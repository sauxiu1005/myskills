#!/usr/bin/env python3
"""One command: 3+ photos/illustrations -> custom ASCII creatures -> ocean page -> smoke check.

Example:
  python3 scripts/make.py --out ../my-ocean \
      --creature "slot=octopus,image=~/Pictures/octo.png,motion=pulse,name=Headphone octopus" \
      --creature "slot=hero,image=sunfish.svg,motion=swim,name=Sunfish" \
      --creature "slot=visitor,image=whale.png,motion=swim,facing=right,name=Blue whale"
Slots: hero, second (sharks) | ray | turtle | jellyfish | octopus | visitor (the occasional giant).
Slots not listed keep the built-in creature. image= may be a photo, transparent PNG or a code-drawn SVG."""
import argparse,json,os,pathlib,subprocess,sys,math
HERE=pathlib.Path(__file__).resolve().parent
ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--out',required=True)
ap.add_argument('--creature',action='append',default=[],help='slot=..,image=..,motion=swim|pulse,facing=left|right,name=..,scale=..,rotate=..')
ap.add_argument('--theme',default='mono',choices=['mono','pearl','abyss','sunset'])
ap.add_argument('--speed',type=float,default=1.4)
ap.add_argument('--width',type=int,default=1920);ap.add_argument('--height',type=int,default=1080)
ap.add_argument('--keep',default='',help='comma list of built-in slots the user chose: hero,second,ray,turtle,jellyfish,octopus,visitor')
ap.add_argument('--min',type=int,default=3,help='minimum number of chosen creatures, custom + kept built-ins (default 3)')
a=ap.parse_args()
SLOTS={'hero','second','ray','turtle','jellyfish','octopus','visitor'}
keep=[k.strip() for k in a.keep.split(',') if k.strip()]
bad=[k for k in keep if k not in SLOTS]
if bad:sys.exit(f'unknown --keep slots: {bad}')
used=[dict(x.split('=',1) for x in c.split(',') if '=' in x).get('slot') for c in a.creature]
if set(keep)&set(used):sys.exit(f'slot both kept and replaced: {sorted(set(keep)&set(used))}')
if len(a.creature)+len(keep)<a.min:sys.exit(f'need at least {a.min} creatures (custom + --keep), got {len(a.creature)+len(keep)}')
out=pathlib.Path(a.out).expanduser().resolve();(out/'creatures').mkdir(parents=True,exist_ok=True)
def run(cmd):
    print('$',' '.join(map(str,cmd)),flush=True);r=subprocess.run(list(map(str,cmd)),capture_output=True,text=True)
    if r.returncode:print(r.stdout,r.stderr);sys.exit(f'step failed: {cmd[1]}')
    return r.stdout.strip().splitlines()[-1] if r.stdout.strip() else ''
def svg_to_png(svg,png):
    """Render a code-drawn SVG silhouette (for creatures named without a photo) on white."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b=p.chromium.launch(headless=True);pg=b.new_page(viewport={'width':900,'height':900})
        html=png.with_suffix('.html');html.write_text('<body style="margin:0;background:#fff"><img id=i src="'+svg.name+'" style="width:820px;height:820px;object-fit:contain;margin:20px">')
        import shutil;shutil.copy(svg,png.parent/svg.name)
        pg.goto(html.as_uri());pg.wait_for_function('document.getElementById("i").naturalWidth>0');pg.locator('#i').screenshot(path=str(png));b.close()
    return png
specs=[]
for k,raw in enumerate(a.creature):
    kv=dict(x.split('=',1) for x in raw.split(',') if '=' in x)
    if 'slot' not in kv or 'image' not in kv:sys.exit(f'--creature needs slot= and image=: {raw}')
    img=pathlib.Path(kv['image']).expanduser().resolve()
    if not img.exists():sys.exit(f'image not found: {img}')
    if img.suffix.lower()=='.svg':img=svg_to_png(img,out/'creatures'/f"{kv['slot']}-svg.png")
    j=out/'creatures'/f"{kv['slot']}.json"
    cmd=[sys.executable,HERE/'silhouette.py',img,'--out',j,'--slot',kv['slot'],'--motion',kv.get('motion','swim'),'--facing',kv.get('facing','left'),'--name',kv.get('name',img.stem),'--preview',out/'creatures'/f"{kv['slot']}-grid.png"]
    for opt in ('scale','rotate','tolerance','cols'):
        if opt in kv:cmd+=[f'--{opt}',kv[opt]]
    print('creature',kv['slot'],run(cmd),flush=True);specs.append(json.loads(j.read_text()))
cj=out/'creatures'/'creatures.json';cj.write_text(json.dumps(specs,ensure_ascii=False))
run([sys.executable,HERE/'build.py','--out',out/'demo','--theme',a.theme,'--speed',a.speed,'--width',a.width,'--height',a.height,'--creatures',cj])
# smoke check
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(headless=True);pg=b.new_page(viewport={'width':a.width,'height':a.height});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto((out/'demo/index.html').as_uri()+'?render=1');pg.wait_for_function('!!window.ocean')
    seen={}
    for sample_time in (2,6,10,14,18):
        t=sample_time/a.speed
        pg.evaluate('t=>ocean.renderAt(t)',t)
        for c in pg.evaluate('ocean.getState().creatures'):seen[c['id']]=max(seen.get(c['id'],0),c['glyphs'])
    st=pg.evaluate('ocean.getState()');b.close()
check={'errors':errs,'invalidGlyphs':st['invalidGlyphCount'],'glyphsPerCreature':seen,'custom':[s['slot'] for s in specs]}
missing=[s['slot'] for s in specs if seen.get('hammerhead' if s['slot']=='visitor' else s['slot'],0)<50]
(out/'smoke.json').write_text(json.dumps(check,indent=1,ensure_ascii=False));print('smoke',json.dumps(check,ensure_ascii=False),flush=True)
if errs or st['invalidGlyphCount'] or missing:sys.exit(f'smoke check failed; custom creatures not visible: {missing}')
print('DONE',out/'demo/index.html',flush=True)
