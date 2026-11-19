#!/usr/bin/env python3
"""Turn a creature photo or illustration into an ASCII Ocean creature (grid + theme colors).
Background: real alpha if present; otherwise border colors (incl. checkerboards) are flood-filled
from the edges, so light areas inside the creature (eye whites) are kept.
Output grid chars: '.' empty, '0'-'9' density (dark = dense), 'D' dark eye/pupil, 'L' highlight."""
import argparse,colorsys,json,pathlib
import numpy as np
from PIL import Image,ImageFilter
from collections import deque
ap=argparse.ArgumentParser()
ap.add_argument('image');ap.add_argument('--out',required=True)
ap.add_argument('--slot',required=True,help='hero, second, ray, turtle, jellyfish, octopus or visitor')
ap.add_argument('--name',default='')
ap.add_argument('--motion',choices=['swim','pulse'],default='swim',help='swim = fish/shark/whale body wave; pulse = jellyfish/octopus bell')
ap.add_argument('--facing',choices=['left','right'],default='left',help='where the head points in the image (swim only)')
ap.add_argument('--rotate',type=float,default=0,help='degrees counter-clockwise before processing')
ap.add_argument('--scale',type=float,default=0,help='on-screen size; 0 keeps the slot default')
ap.add_argument('--cols',type=int,default=96)
ap.add_argument('--tolerance',type=float,default=34)
ap.add_argument('--preview',help='optional PNG preview of the ASCII grid')
a=ap.parse_args()
im=Image.open(a.image).convert('RGBA')
if a.rotate:im=im.rotate(a.rotate,expand=True,fillcolor=(0,0,0,0))
im.thumbnail((720,720))
arr=np.asarray(im).astype(np.float32);rgb=arr[...,:3];alpha=arr[...,3]
h,w=alpha.shape
if alpha.min()<250:
    fg=alpha>128
else:
    border=np.concatenate([rgb[0],rgb[-1],rgb[:,0],rgb[:,-1]])
    q=(border//24).astype(int);keys,counts=np.unique(q[:,0]*10000+q[:,1]*100+q[:,2],return_counts=True)
    cents=[]
    for kk in keys[np.argsort(-counts)][:4]:
        m=(q[:,0]*10000+q[:,1]*100+q[:,2])==kk
        if m.sum()>len(border)*.05:cents.append(border[m].mean(0))
    dist=np.min([np.linalg.norm(rgb-c,axis=2) for c in cents],axis=0)
    bgl=dist<a.tolerance
    bg=np.zeros_like(bgl);dq=deque()
    for y in range(h):
        for x in (0,w-1):
            if bgl[y,x] and not bg[y,x]:bg[y,x]=1;dq.append((y,x))
    for x in range(w):
        for y in (0,h-1):
            if bgl[y,x] and not bg[y,x]:bg[y,x]=1;dq.append((y,x))
    while dq:
        y,x=dq.popleft()
        for yy,xx in ((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
            if 0<=yy<h and 0<=xx<w and bgl[yy,xx] and not bg[yy,xx]:bg[yy,xx]=1;dq.append((yy,xx))
    fg=~bg.astype(bool)
# largest component
lab=np.zeros((h,w),int);best=(0,0);n=0
for y0 in range(h):
    for x0 in range(w):
        if fg[y0,x0] and not lab[y0,x0]:
            n+=1;lab[y0,x0]=n;dq=deque([(y0,x0)]);cnt=0
            while dq:
                y,x=dq.popleft();cnt+=1
                for yy,xx in ((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
                    if 0<=yy<h and 0<=xx<w and fg[yy,xx] and not lab[yy,xx]:lab[yy,xx]=n;dq.append((yy,xx))
            if cnt>best[0]:best=(cnt,n)
if best[0]<200:raise SystemExit('No clear creature found; use a photo with a plain background or a transparent PNG.')
fg=lab==best[1]
m=Image.fromarray((fg*255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5));fg=np.asarray(m)>127
ys,xs=np.where(fg);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
fg=fg[y0:y1,x0:x1];rgb=rgb[y0:y1,x0:x1]
if a.motion=='swim' and a.facing=='right':fg=fg[:,::-1];rgb=rgb[:,::-1]
H0,W0=fg.shape
if a.motion=='swim' and H0>W0*1.15:print('warning: tall silhouette for swim; consider --rotate or motion=pulse')
cols=a.cols if W0>=H0 else max(24,round(a.cols*W0/H0));rows=max(12,round(cols*H0/W0)) if W0>=H0 else a.cols
mk=np.asarray(Image.fromarray((fg*255).astype(np.uint8)).resize((cols,rows),Image.BOX))>110
lum_full=(.2126*rgb[...,0]+.7152*rgb[...,1]+.0722*rgb[...,2])/255
lum=np.asarray(Image.fromarray((lum_full*255).astype(np.uint8)).resize((cols,rows),Image.BOX)).astype(float)/255
inside=lum[mk];med=float(np.median(inside)) if inside.size else .5
grid=[]
for r in range(rows):
    row=''
    for c in range(cols):
        if not mk[r,c]:row+='.';continue
        L=lum[r,c]
        if L<min(.3,med*.45):row+='D'
        elif L>.9 and med<.78:row+='L'
        else:
            rel=np.clip((1-L)*.7+.3*(1-abs(L-med)),0,1);row+=str(int(round(rel*9)))
    grid.append(row)
# theme colors from the creature's own hue
px=rgb[fg].reshape(-1,3)/255;hs=np.array([colorsys.rgb_to_hls(*p) for p in px[::max(1,len(px)//4000)]])
sat=hs[:,2]>.18
def hexc(hh,l,s):r,g,b=colorsys.hls_to_rgb(hh%1,l,s);return '#%02x%02x%02x'%(round(r*255),round(g*255),round(b*255))
colors=None
if sat.mean()>.15:
    ang=hs[sat,0]*2*np.pi;hue=(np.arctan2(np.sin(ang).mean(),np.cos(ang).mean())/(2*np.pi))%1
    warm=hue+((0.03-hue+.5)%1-.5)*.25
    colors={'pearl':[hexc(hue,.27,.42),hexc(hue,.52,.42)],'abyss':[hexc(hue,.8,.62),hexc(hue,.62,.68)],'sunset':[hexc(warm,.3,.4),hexc(warm,.6,.58)]}
res={'slot':a.slot,'name':a.name or pathlib.Path(a.image).stem,'motion':a.motion,'cols':cols,'rows':rows,'grid':grid,'amp':.16,'source':pathlib.Path(a.image).name}
if a.scale:res['scale']=a.scale
if colors:res['colors']=colors
pathlib.Path(a.out).write_text(json.dumps(res,ensure_ascii=False))
if a.preview:
    from PIL import ImageDraw
    pv=Image.new('RGB',(cols*8,rows*12),'#faf8f1');dr=ImageDraw.Draw(pv);ramp='.:;+=x*o#'
    for r,row in enumerate(grid):
        for c,ch in enumerate(row):
            if ch=='.':continue
            g='@' if ch=='D' else 'o' if ch=='L' else ramp[min(8,int(ch))]
            dr.text((c*8,r*12),g,fill='#181b30' if ch=='D' else (colors or {'pearl':['#203657']})['pearl'][0])
    pv.save(a.preview)
print(json.dumps({'slot':a.slot,'cols':cols,'rows':rows,'filled':int(mk.sum()),'colors':colors}))
