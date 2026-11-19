#!/usr/bin/env python3
"""Build the offline ASCII Ocean v8 page: free swimming, click feeding, local hover lens,
a visiting hammerhead, three themes, and optional custom creatures from photos.
No upstream code or network required."""
import argparse,json,pathlib,re
p=argparse.ArgumentParser()
p.add_argument('--out',required=True)
p.add_argument('--theme',choices=['mono','pearl','abyss','sunset'],default='mono')
p.add_argument('--density',type=float,default=1)
p.add_argument('--speed',type=float,default=1.4)
p.add_argument('--width',type=int,default=1920)
p.add_argument('--height',type=int,default=1080)
p.add_argument('--seed',type=int,default=42)
p.add_argument('--creatures',help='JSON list from silhouette.py / make.py; each item replaces one slot (hero, second, ray, turtle, jellyfish, octopus, visitor)')
a=p.parse_args();d=vars(a).copy();out=pathlib.Path(d.pop('out')).resolve();cpath=d.pop('creatures')
for key,lo,hi in [('density',.5,1.5),('speed',.2,2.5),('width',360,3840),('height',480,2160)]:
    if not lo<=d[key]<=hi:p.error(f'{key} must be {lo}..{hi}')
if a.width%2 or a.height%2:p.error('width/height must be even')
d.update(population=6,fish=42,color='#203657',octopus=True)
creatures=json.loads(pathlib.Path(cpath).read_text()) if cpath else []
SLOTS={'hero','second','ray','turtle','jellyfish','octopus','visitor'}
seen=set()
for c in creatures:
    if c.get('slot') not in SLOTS:p.error(f"slot must be one of {sorted(SLOTS)}")
    if c['slot'] in seen:p.error(f"slot {c['slot']} used twice")
    seen.add(c['slot'])
    if c.get('motion') not in ('swim','pulse'):p.error('motion must be swim or pulse')
    if c['slot']=='visitor' and c['motion']!='swim':p.error('visitor must use motion=swim')
    if len(c['grid'])!=c['rows'] or any(len(r)!=c['cols'] for r in c['grid']):p.error('grid size mismatch')
src=(pathlib.Path(__file__).parent.parent/'templates/index.html').read_text()
src=re.sub(r'/\*CONFIG\*/\{[^;]+\}',lambda _:'/*CONFIG*/'+json.dumps(d),src,count=1)
src=src.replace('/*CREATURES*/[]','/*CREATURES*/'+json.dumps(creatures,separators=(',',':')),1)
out.mkdir(parents=True,exist_ok=True);(out/'index.html').write_text(src)
(out/'config.json').write_text(json.dumps({**d,'creatures':[{k:v for k,v in c.items() if k!='grid'} for c in creatures]},indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'html':str(out/'index.html'),'custom':[c['slot'] for c in creatures]}))
