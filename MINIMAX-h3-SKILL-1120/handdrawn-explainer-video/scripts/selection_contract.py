"""Record explicit style/hand choices and block unselected production jobs."""
import argparse
import json
from pathlib import Path

PACKAGE = Path(__file__).resolve().parents[1]

def validate_selection(root, manifest):
    root = Path(root)
    style = json.loads((root/'style/selection.json').read_text())
    if style.get('confirmation') not in ('explicit_user_request', 'user_dialog', 'user_delegated') or not style.get('evidence', '').strip():
        raise ValueError('Ask the user to choose a style; timeout or automatic defaults are not accepted')
    hand = json.loads((root/'options/hand-selection.json').read_text())
    presets = json.loads((PACKAGE/'assets/hands/catalog.json').read_text())['presets']
    valid = {p['id'] for p in presets}
    if hand.get('preset') not in valid or hand.get('confirmation') not in ('explicit_user_request', 'user_dialog', 'user_delegated') or not hand.get('evidence','').strip():
        raise ValueError('Ask the user to choose a real-hand preset or explicitly choose pen-only')
    configured = manifest.get('hand', {})
    if configured.get('source') or configured.get('preset') != hand['preset']:
        raise ValueError('Configured drawing hand does not match the recorded user choice')
    return {'style': style['mode'], 'hand': hand['preset'], 'selection_checked': True}

def record(root, choice, evidence):
    from style_choice import prepare_catalog, validate_selection as validate_style
    root = Path(root);root.mkdir(parents=True, exist_ok=True)
    if not evidence.strip(): raise ValueError('Record the actual user reply or submitted selection file')
    catalog = prepare_catalog(root)
    style = choice['style'];validate_style(style,catalog)
    ids = {p['id'] for p in json.loads((PACKAGE/'assets/hands/catalog.json').read_text())['presets']}
    if choice.get('hand') not in ids: raise ValueError('Choose a hand explicitly')
    style = {**style, 'confirmation':'explicit_user_request', 'evidence':evidence}
    (root/'style/selection.json').write_text(json.dumps(style,ensure_ascii=False,indent=2))
    (root/'options').mkdir(exist_ok=True)
    (root/'options/hand-selection.json').write_text(json.dumps({'preset':choice['hand'],'confirmation':'explicit_user_request','evidence':evidence},ensure_ascii=False,indent=2))
    job = root/'job.json'
    if job.exists():
        data=json.loads(job.read_text());data['hand']={'preset':choice['hand']};job.write_text(json.dumps(data,ensure_ascii=False,indent=2))
    return {'recorded':True,'hand':choice['hand'],'next':'Resolve the selected style, then create the drawing plan'}

if __name__ == '__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('command',choices=['record','verify']);p.add_argument('job',type=Path);p.add_argument('--selection',type=Path);p.add_argument('--evidence');a=p.parse_args()
    if a.command=='record':
        if not a.selection or not a.evidence:p.error('record needs --selection and --evidence')
        result=record(a.job,json.loads(a.selection.read_text()),a.evidence)
    else:
        result=validate_selection(a.job,json.loads((a.job/'job.json').read_text()))
    print(json.dumps(result,ensure_ascii=False))
