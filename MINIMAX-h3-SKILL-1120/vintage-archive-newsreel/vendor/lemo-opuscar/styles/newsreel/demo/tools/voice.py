#!/usr/bin/env python3
"""Newsreel announcer with Kokoro (offline), with blended voices.

    $LIB/.venv/bin/python tools/voice.py voice/lines.json voice/out

lines.json = [{"id", "text", "voice", "speed", "lang"?, "asr"?, "zh", "en"}]
`voice` is one Kokoro voice ("am_michael") or a blend of style vectors
("am_michael:0.7,bm_george:0.3"): the blend keeps American phonemes (espeak en-us) with
some British cadence, a cheap stand-in for the 1930s mid-Atlantic announcer.
Writes <id>.wav (24 kHz mono, clean: the period treatment happens in audio/mix.py so the
speech check runs on clean audio) and dur.json, like core/tts/tts.py.
"""
import json, os, sys
import numpy as np, soundfile as sf

LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..'))
TTS = os.path.join(LIB, 'core', 'tts')
from kokoro_onnx import Kokoro

lines, out = json.load(open(sys.argv[1], encoding='utf-8')), sys.argv[2]
k = Kokoro(os.path.join(TTS, 'kokoro-v1.0.onnx'), os.path.join(TTS, 'voices-v1.0.bin'))


def style(spec):
    if ':' not in spec and ',' not in spec:
        return spec
    acc = None
    for part in spec.split(','):
        name, w = (part.split(':') + ['1'])[:2]
        v = k.get_voice_style(name.strip()) * float(w)
        acc = v if acc is None else acc + v
    return acc


os.makedirs(out, exist_ok=True)
dur = {}
only = set(sys.argv[3:])
for L in lines:
    if only and L['id'] not in only:
        continue
    a, sr = k.create(L['text'], voice=style(L.get('voice', 'am_michael')), speed=L.get('speed', 1.15),
                     lang=L.get('lang', 'en-us'))
    nz = np.where(np.abs(a) > np.abs(a).max() * .02)[0]
    a = a[max(0, nz[0] - int(.02 * sr)): nz[-1] + int(.06 * sr)]
    sf.write(os.path.join(out, L['id'] + '.wav'), a, sr)
    dur[L['id']] = round(len(a) / sr, 3)
    print(L['id'], dur[L['id']], L['text'])
old = {}
p = os.path.join(out, 'dur.json')
if os.path.exists(p):
    old = json.load(open(p))
old.update(dur)
json.dump(old, open(p, 'w'), indent=1)
