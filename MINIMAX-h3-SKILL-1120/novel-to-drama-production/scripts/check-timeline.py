#!/usr/bin/env python3
"""Validate a drama-post/v1 handoff; does not claim media or perceptual QC."""
import argparse
import json
import math
from pathlib import Path


def validate(doc, base=Path('.'), require_local=False):
    errors = []
    def bad(message):
        errors.append(message)
    def number(value):
        return type(value) in (int, float) and math.isfinite(value)
    def text(value):
        return isinstance(value, str) and bool(value.strip())
    if not isinstance(doc, dict):
        return ['manifest must be an object']
    if doc.get('schema') != 'drama-post/v1':
        bad('schema must be drama-post/v1')
    duration = doc.get('duration')
    if not number(duration) or duration <= 0:
        return errors + ['duration must be positive and finite']
    export = doc.get('export', {})
    if not isinstance(export, dict):
        export = {}
    for key in ('width', 'height'):
        if type(export.get(key)) is not int or export[key] <= 0:
            bad(f'export.{key} must be a positive integer')
    if not number(export.get('fps')) or export['fps'] <= 0:
        bad('export.fps must be positive and finite')
    target = doc.get('target')
    if target is not None:
        if (not isinstance(target, dict) or not number(target.get('min'))
                or not number(target.get('max')) or not 0 <= target['min'] <= target['max']):
            bad('target must contain valid min/max seconds')
        elif not target['min'] <= duration <= target['max']:
            bad('duration outside target range')
    def records(key):
        items = doc.get(key)
        if not isinstance(items, list):
            bad(f'{key} must be an array')
            return []
        result, seen = [], set()
        for i, item in enumerate(items):
            if not isinstance(item, dict) or not text(item.get('id')):
                bad(f'{key}[{i}] requires a nonempty id')
                continue
            if item['id'] in seen:
                bad(f'duplicate {key} id: {item["id"]}')
            seen.add(item['id'])
            result.append(item)
        return result
    def source(item):
        value = item.get('source')
        if not text(value):
            bad(f'{item["id"]}: missing source')
        elif require_local and ('://' in value or not (base / value).is_file()):
            bad(f'{item["id"]}: source is not a readable local file: {value}')
    def interval(item):
        start, end = item.get('start'), item.get('end')
        if not number(start) or not number(end) or not 0 <= start < end <= duration + 0.000001:
            bad(f'{item["id"]}: invalid or out-of-bounds interval')
            return False
        return True
    clips = records('clips')
    spans = []
    for clip in clips:
        source(clip)
        si, so, sd, start, speed = (clip.get(k) for k in ('in', 'out', 'source_duration', 'start', 'speed'))
        if not all(number(v) for v in (si, so, sd, start, speed)) or not (0 <= si < so <= sd and start >= 0 and speed > 0):
            bad(f'{clip["id"]}: invalid source trim, start or speed')
            continue
        end = start + (so - si) / speed
        if end > duration + 0.000001:
            bad(f'{clip["id"]}: video exceeds timeline')
        spans.append((start, end))
    covered = 0.0
    for start, end in sorted(spans):
        if start > covered + 0.000001:
            bad(f'video gap from {covered:g} to {start:g}')
        covered = max(covered, end)
    if covered < duration - 0.000001:
        bad(f'video ends at {covered:g}, before duration {duration:g}')
    expected, cues = records('expected_cues'), records('cues')
    kinds = {'dialogue', 'narration', 'inner', 'system'}
    for item in expected + cues:
        if item.get('kind') not in kinds or not text(item.get('text')):
            bad(f'{item["id"]}: invalid speech kind or empty text')
    required = {item['id']: item for item in expected}
    actual = {item['id']: item for item in cues}
    for key in required.keys() - actual.keys():
        bad(f'missing required cue: {key}')
    for key in actual.keys() - required.keys():
        bad(f'unplanned cue: {key}')
    valid_cues = []
    for cue in cues:
        source(cue)
        if interval(cue):
            valid_cues.append(cue)
        if cue['id'] in required:
            for key in ('text', 'kind'):
                if cue.get(key) != required[cue['id']].get(key):
                    bad(f'{cue["id"]}: {key} differs from locked cue')
    allowed = doc.get('allowed_speech_overlaps', [])
    pairs = set()
    if not isinstance(allowed, list):
        bad('allowed_speech_overlaps must be an array')
        allowed = []
    for pair in allowed:
        if (not isinstance(pair, list) or len(pair) != 2 or not all(text(x) for x in pair)
                or pair[0] == pair[1] or any(x not in actual for x in pair)):
            bad('invalid allowed speech overlap pair')
        else:
            pairs.add(frozenset(pair))
    for i, left in enumerate(valid_cues):
        for right in valid_cues[i + 1:]:
            if (min(left['end'], right['end']) - max(left['start'], right['start']) > 0.000001
                    and frozenset((left['id'], right['id'])) not in pairs):
                bad(f'unplanned speech overlap: {left["id"]}, {right["id"]}')
    for overlay in records('overlays'):
        interval(overlay)
        if 'cue_id' in overlay and (not text(overlay['cue_id']) or overlay['cue_id'] not in actual):
            bad(f'{overlay["id"]}: unknown cue_id')
        if not text(overlay.get('text')) and not text(overlay.get('source')):
            bad(f'{overlay["id"]}: missing overlay text or source')
        if 'source' in overlay:
            source(overlay)
        if not text(overlay.get('position')):
            bad(f'{overlay["id"]}: missing position plan')
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--require-local', action='store_true')
    args = parser.parse_args()
    try:
        doc = json.loads(args.manifest.read_text(encoding='utf-8'))
        errors = validate(doc, args.manifest.resolve().parent, args.require_local)
    except (OSError, ValueError) as exc:
        print(json.dumps({'ok': False, 'errors': [str(exc)]}, ensure_ascii=False))
        return 2
    print(json.dumps({'ok': not errors, 'errors': errors}, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(main())
