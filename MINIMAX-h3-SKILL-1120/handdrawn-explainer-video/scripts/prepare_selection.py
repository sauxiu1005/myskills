"""Prepare a self-contained style/hand picker in the job; never write into the skill."""
import argparse
import json
from pathlib import Path
import shutil
from hosted_assets import resolve_asset

PACKAGE = Path(__file__).resolve().parents[1]


def prepare_selection(job):
    target = Path(job).expanduser().resolve() / 'selection'
    if target == PACKAGE or PACKAGE in target.parents:
        raise ValueError('Choose a job directory outside the installed skill')
    catalog = json.loads((PACKAGE / 'assets/hands/catalog.json').read_text())['presets']
    # Resolve before exposing a selection page with broken hand previews.
    hands = [(p['id'], resolve_asset(PACKAGE / 'assets/hands' / p['source'])) for p in catalog]
    # A version-specific folder is not required: these are generated selection assets only.
    target.mkdir(parents=True, exist_ok=True)
    (target / 'hands').mkdir(exist_ok=True)
    for _, source in hands:
        shutil.copy2(source, target / 'hands' / source.name)
    shutil.copytree(PACKAGE / 'assets/style-previews', target / 'style-previews', dirs_exist_ok=True)
    shutil.copy2(PACKAGE / 'assets/selection.html', target / 'selection.html')
    return {'page': str(target / 'selection.html'),
            'hands': {identity: str(target / 'hands' / source.name) for identity, source in hands}}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('job', type=Path)
    args = parser.parse_args()
    print(json.dumps(prepare_selection(args.job), ensure_ascii=False, indent=2))
