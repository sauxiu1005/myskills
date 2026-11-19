#!/usr/bin/env python3
"""Validate an exported SRT: ordered, non-empty, non-overlapping cues with a minimum gap.
Usage: python3 check_srt.py film.srt [--gap-ms 20]  (exit 1 on any violation)"""
import argparse, re, sys
from pathlib import Path

TS = re.compile(r'(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)')

def ms(h, m, s, f):
    return ((int(h) * 60 + int(m)) * 60 + int(s)) * 1000 + int(f)

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('srt', type=Path)
    p.add_argument('--gap-ms', type=int, default=20)
    a = p.parse_args()
    blocks = [b for b in re.split(r'\n\s*\n', a.srt.read_text(encoding='utf-8-sig').strip()) if b.strip()]
    cues, errs = [], []
    for i, b in enumerate(blocks, 1):
        m = TS.search(b)
        if not m:
            errs.append(f'cue {i}: missing timestamp'); continue
        t0, t1 = ms(*m.groups()[:4]), ms(*m.groups()[4:])
        text = b[m.end():].strip()
        if t1 <= t0: errs.append(f'cue {i}: empty or negative duration')
        if not text: errs.append(f'cue {i}: no text')
        cues.append((i, t0, t1))
    for (i, a0, a1), (j, b0, _) in zip(cues, cues[1:]):
        if a1 > b0 - a.gap_ms:
            errs.append(f'cue {i} ends {a1} ms but cue {j} starts {b0} ms (need >= {a.gap_ms} ms gap)')
    print({'cues': len(cues), 'errors': len(errs)})
    for e in errs: print(e, file=sys.stderr)
    sys.exit(1 if errs else 0)

if __name__ == '__main__':
    main()
