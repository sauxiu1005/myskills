"""Resolve calibrated drawing hand and pen presets."""
from pathlib import Path
from hosted_assets import resolve_asset, asset_available
import json
import math
import shutil
from PIL import Image
import numpy as np

PACKAGE = Path(__file__).resolve().parents[1]


def prepare_hand(options, root, work, canvas_height, font_path, font_index):
    catalog = json.loads((PACKAGE/'assets/hands/catalog.json').read_text())
    identity = options.get('preset', catalog['default'])
    if options.get('source'):
        if 'nib' not in options:
            raise ValueError('A custom hand requires its measured nib coordinates')
        source = Path(options['source']).expanduser()
        source = source if source.is_absolute() else root/source
        calibration = options
    else:
        calibration = next((entry for entry in catalog['presets'] if entry['id']==identity), None)
        if calibration is None:
            raise ValueError('Unknown hand preset: '+identity)
        source = resolve_asset(PACKAGE/'assets/hands'/calibration['source'])
    hand = Image.open(source).convert('RGBA')
    nib = calibration['nib']
    if not (0<=nib[0]<hand.width and 0<=nib[1]<hand.height):
        raise ValueError('Nib coordinates lie outside hand asset')
    alpha = np.array(hand)[:,:,3]
    kind = calibration.get('kind', 'hand')
    if kind not in ('hand', 'pen'):
        raise ValueError('Drawing tool kind must be hand or pen')
    if kind == 'hand' and (alpha[-1]>128).sum()<8:
        raise ValueError('The forearm must continue through the bottom edge of its source')
    # Even at the highest tip position, the cut edge must remain below the canvas.
    minimum_scale = (canvas_height+24)/max(1,hand.height-nib[1]-1) if kind == 'hand' else 0
    wrist=calibration.get('wrist')
    calibrated_scale=(canvas_height/1080*410/np.linalg.norm(np.array(wrist)-nib)) if wrist else canvas_height/1080*(calibration.get('scale', .66))
    requested_scale = float(options.get('scale',calibrated_scale))
    if not math.isfinite(requested_scale) or requested_scale <= 0:
        raise ValueError('Drawing tool scale must be positive and finite')
    scale = max(requested_scale, minimum_scale)
    # Keep the selected original with the job, so cache cleanup cannot break a rerender.
    local_hand = Path(work) / 'hands' / source.name
    local_hand.parent.mkdir(parents=True, exist_ok=True)
    if source.resolve() != local_hand.resolve():
        shutil.copy2(source, local_hand)
    source = local_hand
    return {'preset':identity,'kind':kind,'source':str(source.resolve()),'nib':nib,'scale':scale,
            'arm_bottom_at_highest_tip':(hand.height-nib[1])*scale-12}
