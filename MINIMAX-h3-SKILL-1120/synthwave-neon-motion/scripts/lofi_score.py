#!/usr/bin/env python3
"""Default soundtrack for synthwave-neon-motion: procedural lo-fi (free, local, deterministic).

Warm Rhodes-style electric piano (tremolo, soft strum), round sine bass, lazy boom-bap drums with swung hats,
vinyl crackle + hiss, optional rain bed, gentle tape saturation and wow, low-pass air. Picture and music read the
same integer-frame cues.json, so accents land on visual events.

cues.json fields used (all optional except fps/total_frames):
  fps, total_frames (legacy alias: frames), bpm (default 72)
  chords      {"frame": "Fmaj7", ...}   default: Fmaj7-Em7-Dm7-Cmaj7, two beats each, looped
  melody      [[frame, midi], ...]      default: sparse pentatonic notes on off-beats after drums_in
  music: {
    muffled_until  frame   keys play low-passed ("through a wall") until here, then open over 15 frames
    drums_in       frame   drums + bass enter (default: 1/4 of the film, snapped to a beat)
    accents        [frame] soft sub hit on each (match cuts, reveals)
    chimes         [frame] bell note on each (lights on, sign, title)
    whooshes       [[a,b]] filtered-noise swell between frames (wipes)
    risers         [[a,b]] reverse swell into b (before a cut)
    tape_stop      [a,b]   music pitch falls to silence between a and b (ending)
    rain           [a,b]   rain bed between frames (omit for none)
  }
Usage: python3 lofi_score.py cues.json out.wav
"""
import json, sys, numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 44100
CH = {'Fmaj7': [53, 57, 60, 64], 'Em7': [52, 55, 59, 62], 'Dm7': [50, 53, 57, 60], 'Cmaj7': [48, 52, 55, 59],
      'Cmaj9': [48, 52, 55, 59, 62], 'Am7': [45, 52, 55, 60], 'Gsus': [43, 50, 55, 60], 'Bbmaj7': [46, 53, 57, 62]}
ROOT = {'Fmaj7': 41, 'Em7': 40, 'Dm7': 38, 'Cmaj7': 36, 'Cmaj9': 36, 'Am7': 33, 'Gsus': 31, 'Bbmaj7': 34}

def main(cue_path, out):
    C = json.load(open(cue_path)); FPS = C['fps']
    NF = C.get('total_frames', C.get('frames'))
    if 'total_frames' in C and 'frames' in C and C['total_frames'] != C['frames']:
        raise ValueError('total_frames and legacy frames must agree')
    if type(NF) is not int or NF <= 0 or not np.isfinite(FPS) or FPS <= 0:
        raise ValueError('total_frames must be a positive integer and fps must be positive and finite')
    N = int(round(NF / FPS * SR))
    bpm = C.get('bpm', 72); BF = FPS * 60 / bpm; M = C.get('music', {})
    rng = np.random.default_rng(72); t = np.arange(N) / SR
    fs = lambda f: int(f / FPS * SR); midi = lambda m: 440 * 2 ** ((m - 69) / 12)
    lp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
    hp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
    bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
    def put(buf, sig, s):
        e = min(N, s + len(sig))
        if 0 <= s < e: buf[s:e] += sig[:e - s]
    def rhodes(freq, dur, vel):
        n = int(dur * SR); tt = np.arange(n) / SR; ph = 2 * np.pi * freq * tt
        w = np.sin(ph) + 0.35 * np.sin(2 * ph) * np.exp(-tt * 6) + 0.12 * np.sin(3.01 * ph) * np.exp(-tt * 9) + 0.08 * np.sin(7 * ph) * np.exp(-tt * 30)
        env = (1 - np.exp(-tt * 300)) * np.exp(-tt * 0.9) * (1 - np.clip((tt - dur + 0.15) / 0.15, 0, 1))
        return w * env * (1 + 0.12 * np.sin(2 * np.pi * 4.2 * tt)) * vel
    drums_in = M.get('drums_in', round(NF / 4 / BF) * BF)
    ts = M.get('tape_stop'); stop0 = ts[0] if ts else NF
    chords = C.get('chords')
    if chords: chords = sorted((int(k), v) for k, v in chords.items())
    else:
        prog = ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7']; chords = []; f = 0; i = 0
        while f < NF: chords.append((int(round(f)), prog[i % 4])); f += 2 * BF; i += 1
    keys, bass, drums, fx = (np.zeros(N) for _ in range(4))
    for i, (f0, name) in enumerate(chords):
        f1 = chords[i + 1][0] if i + 1 < len(chords) else NF
        for j, m in enumerate(CH[name]): put(keys, rhodes(midi(m), (f1 - f0) / FPS + 0.3, 0.17), fs(f0) + j * 900)
        if drums_in <= f0 < stop0:
            for off, dm in ((0, 0), (1.5 * BF, 0), (1.76 * BF, 12)):
                if f0 + off < min(f1, stop0):
                    n = int(0.7 * SR); tt = np.arange(n) / SR
                    put(bass, np.sin(2 * np.pi * midi(ROOT[name] + dm) * tt) * np.exp(-tt * 2.2) * (1 - np.exp(-tt * 200)) * 0.5, fs(f0 + off))
    mel = C.get('melody')
    if mel is None:
        scale = [72, 74, 76, 79, 81, 79, 76, 74, 72, 69]; mel = []; f = drums_in + 0.5 * BF; k = 0
        while f < stop0 - BF:
            if rng.random() < 0.6: mel.append((f, scale[k % len(scale)]))
            f += BF * (0.5 if rng.random() < 0.4 else 1.0); k += 1
    for f, m in mel: put(keys, rhodes(midi(m), 0.9, 0.11), fs(f))
    def kick():
        n = int(0.35 * SR); tt = np.arange(n) / SR; fr = 48 + 90 * np.exp(-tt * 28)
        return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 9) * 0.9
    def snare():
        n = int(0.3 * SR); tt = np.arange(n) / SR
        return (bp(rng.normal(0, 1, n), 1200, 5000) * 0.6 * np.exp(-tt * 16) + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 25) * 0.5) * 0.55
    def hat(v):
        n = int(0.06 * SR); tt = np.arange(n) / SR
        return hp(rng.normal(0, 1, n), 7000) * np.exp(-tt * 70) * v
    b = drums_in; bar = 4 * BF
    while b < stop0:
        for off in (0, 1.5 * BF, 2 * BF, 3.5 * BF):
            if b + off < stop0: put(drums, kick(), fs(b + off))
        for off in (BF, 3 * BF):
            if b + off < stop0: put(drums, snare(), fs(b + off) + 400)      # lazy, slightly late snare
        for k in range(8):
            f = b + k * BF / 2 + (BF * 0.16 if k % 2 else 0)                # swung 8ths
            if f < stop0: put(drums, hat(0.18 if k % 2 else 0.26), fs(f))
        b += bar
    for f in M.get('accents', []):
        n = int(0.6 * SR); tt = np.arange(n) / SR; put(fx, np.sin(2 * np.pi * 45 * tt) * np.exp(-tt * 5) * 0.5, fs(f))
    for f in M.get('chimes', []):
        n = int(2.5 * SR); tt = np.arange(n) / SR
        put(fx, (np.sin(2 * np.pi * midi(91) * tt) + 0.4 * np.sin(2 * np.pi * midi(91) * 2.76 * tt) * np.exp(-tt * 3)) * np.exp(-tt * 1.6) * 0.06, fs(f))
    for a, b2 in M.get('whooshes', []):
        L = fs(b2) - fs(a); put(fx, bp(rng.normal(0, 1, L), 300, 2500) * np.sin(np.linspace(0, np.pi, L)) ** 2 * 0.1, fs(a))
    for a, b2 in M.get('risers', []):
        L = fs(b2) - fs(a); put(fx, hp(rng.normal(0, 1, L), 3000) * np.linspace(0, 1, L) ** 3 * 0.12, fs(a))
    mu = M.get('muffled_until', 0)
    kk = np.clip((t - mu / FPS) / (15 / FPS), 0, 1) if mu else np.ones(N)
    music = (lp(keys, 750, 4) * (1 - kk) * 0.9 + lp(keys, 5500, 2) * kk) * 0.9 + lp(bass, 400) * 0.8 + lp(drums, 9000) * 0.8 + fx
    if ts:
        s0, s1 = fs(ts[0]), fs(ts[1]); T = (s1 - s0) / SR; tau = np.arange(s1 - s0) / SR
        pos = s0 + (T * (1 - (1 - tau / T) ** 2.5) / 2.5) * SR
        music = np.concatenate([music[:s0], lp(np.interp(pos, np.arange(N), music) * (1 - tau / T) ** 0.5, 4000), np.zeros(N - s1)])
    wow = 1 + 0.002 * np.sin(2 * np.pi * 0.5 * t)                            # gentle tape wow (amplitude flutter)
    crack = np.zeros(N); n_c = int(26 * N / SR); idx = rng.choice(N, n_c, replace=False); crack[idx] = rng.normal(0, 0.5, n_c)
    crack = hp(lp(crack, 6000), 1200) + lp(rng.normal(0, 0.006, N), 5000)
    bed = crack
    if M.get('rain'):
        a, b2 = M['rain']; env = np.clip((t - a / FPS) / 1.0, 0, 1) * np.clip((b2 / FPS - t) / 2.0, 0, 1) * (1 - 0.4 * kk * bool(mu))
        bed = bed + bp(rng.normal(0, 1, N), 1500, 9000) * 0.022 * env
    mix = np.tanh((music * wow + bed) * 1.4) / 1.4
    mix = lp(mix, 11000) * np.clip(t / 0.5, 0, 1) * np.clip((N / SR - t) / 0.6, 0, 1)
    st = np.stack([mix, np.roll(mix, 220) * 0.92 + mix * 0.08], 1); st = st / (np.abs(st).max() + 1e-9) * 0.85
    wavfile.write(out, SR, (st * 32767).astype(np.int16)); print('lofi score', out, round(N / SR, 2), 's')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'cues.json', sys.argv[2] if len(sys.argv) > 2 else 'lofi.wav')
