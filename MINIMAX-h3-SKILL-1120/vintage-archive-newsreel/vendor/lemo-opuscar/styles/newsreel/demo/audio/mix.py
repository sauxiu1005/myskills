#!/usr/bin/env python3
"""Score + archive record + foley + announcer -> out/mix.wav. Everything reads timeline.json.
Run from the library root:  .venv/bin/python <demo>/audio/mix.py [--stems]

Music, in order: (1) fanfare; (2) original hot-jazz Charleston band, 200 BPM, F major;
(3) stop + timpani under the title card; (4) original old-time reel, D major (fiddle, plucked
"dulcimer", upright piano, tuba) for Henry Ford's side; (5) the split-screen duel: reel on the
left, band on the right, trading bars, then half bars; (6) the 1925 Golden Gate Orchestra
record of "Charleston" (public domain) takes over at the needle drop and ends on its own final
chord at the freeze; (7) silence; (8) brass "da-DA!" and the end card.
No quotation of existing tunes in the original parts."""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf, soxr
from scipy.ndimage import maximum_filter1d, uniform_filter1d

HERE = Path(__file__).resolve().parent.parent
LIB = HERE.parents[2] if (HERE.parents[2] / "core").exists() else HERE.parents[1]
sys.path.insert(0, str(LIB))
from core.audio import sampler as S, pluck as PL
from core.audio.sfx import SR, add, bp, lp, hp, noise, norm, env_exp, t_, whoosh, thump, click, compress, limit

TL = json.loads((HERE / "timeline.json").read_text())
HIT, DUR, SEC = TL["hits"], TL["dur"], {s["id"]: s for s in TL["secs"]}
B = TL["beat"]; BAR = TL["bar"]
S.seed(11)
N = int((DUR + .3) * SR)
M = S.midi
def bt(bar, beat=0.0): return bar * BAR + beat * B

ev = []          # (t, inst, pitch, dur, vel, pan, gain)
def n(t, inst, p, d, v, pan=0, g=1.0): ev.append((t, inst, p, d, v, pan, g))
plucks = []      # (t, preset, pitches, dur, vel, gain, pan)

# ------------------------------------------------------------------ 1. fanfare (bars 0–2)
for k in range(8):
    n(k * .02, 'timpani', 'F2', .05, .25 + k * .06, 0, .8)
T0 = HIT['beams_on']
fan = [(0, 'C5', .14), (.5, 'F5', .14), (1, 'A5', 1.4), (3, 'G5', .14), (3.5, 'A5', .14), (4, 'C6', 2.6)]
for b_, p, d in fan:
    t = T0 + b_ * B
    n(t, 'trumpet', p, d * B + .02, .85, -.25, .9)
    n(t, 'trumpet', M(p) - 4 if p != 'C6' else 'A5', d * B + .02, .7, .25, .55)
    n(t, 'trombone_stac' if d < .5 else 'trombone', M(p) - 17, d * B + .02, .75, .1, .7)
n(T0, 'tuba_stac', 'F2', .3, .9); n(T0 + 4 * B, 'tuba_stac', 'F2', .4, .9)
n(T0, 'crash', None, None, .8, 0, .7)
n(T0 + 4 * B, 'timpani', 'F2', .6, .8); n(T0 + 4 * B, 'timpani', 'C3', .6, .6)
for p in ['D5', 'F5', 'Bb5']: n(bt(2), 'trumpet', p, .2, .7, 0, .45)
for p in ['F3', 'Bb3', 'D4']: n(bt(2), 'trombone_stac', p, .2, .7, 0, .5)
n(bt(2), 'tuba_stac', 'Bb1', .2, .8)
for p in ['C5', 'F5', 'A5']: n(bt(2, 1.5), 'trumpet', p, .6, .8, 0, .45)
for p in ['F3', 'A3', 'C4']: n(bt(2, 1.5), 'trombone', p, .6, .75, 0, .5)
n(bt(2, 1.5), 'tuba_stac', 'F2', .5, .9); n(bt(2, 1.5), 'timpani', 'F2', .9, .85)
n(bt(2, 2.5), 'sus_cymbal', 'cresc', None, .5, 0, .45)

# ------------------------------------------------------------------ 2. Charleston band (bars 3–15)
CH = {'F': ['F', 'A', 'C'], 'C7': ['C', 'E', 'G', 'Bb'], 'D7': ['D', 'F#', 'A', 'C'], 'G7': ['G', 'B', 'D', 'F'], 'Bb': ['Bb', 'D', 'F']}
ROOT = {'F': 'F2', 'C7': 'C2', 'D7': 'D2', 'G7': 'G1', 'Bb': 'Bb1'}
FIFTH = {'F': 'C2', 'C7': 'G1', 'D7': 'A1', 'G7': 'D2', 'Bb': 'F2'}
voicing = lambda ch, o: [f"{x}{o}" for x in CH[ch]]
def band_bar(t0, ch, soft=1.0, pan=0.0, full=True, gain=1.0):
    """one bar of the Charleston band starting at t0 (seconds)"""
    T = lambda k: t0 + k * B
    n(T(0), 'tuba_stac', ROOT[ch], .3, .85 * soft, pan - .05, .7 * gain)
    n(T(2), 'tuba_stac', FIFTH[ch], .3, .78 * soft, pan - .05, .7 * gain)
    for k in range(4):
        plucks.append((T(k), 'banjo', voicing(ch, 4)[:3], .28, (.75 if k % 2 else .55) * soft, .32 * gain, pan - .35))
    if full:
        for k in (1, 3): n(T(k), 'snare', 'on', None, .32, pan + .15, .55 * gain)
        for k in (0, 1.5):                                   # the Charleston figure
            for p in voicing(ch, 3)[:3]: n(T(k), 'trombone_stac', p, .2, .7, pan + .2, .42 * gain)
        for k in (1, 3):
            for p in voicing(ch, 4)[:2]: n(T(k), 'honky_tonk', p, .18, .5, pan + .3, .35 * gain)

PROG = {3: 'F', 4: 'F', 5: 'C7', 6: 'C7', 7: 'F', 8: 'F', 9: 'D7', 10: 'D7', 11: 'G7', 12: 'C7', 13: 'F', 14: 'D7'}
for bar, ch in PROG.items():
    band_bar(bt(bar), ch, soft=.55 if bar == 3 else 1.0, full=bar >= 4)
for bar in (6, 10):
    for k in (2.5, 3, 3.5): n(bt(bar, k), 'woodblock', None, None, .5, -.3, .45)
MEL = {   # original tune: muted trumpet under the map, open trumpet + clarinet from the lesson on
    7:  [(0, 'A4', .75), (1.5, 'C5', .75), (2.5, 'D5', .4), (3, 'C5', .4), (3.5, 'A4', .4)],
    8:  [(0, 'F4', .75), (1.5, 'G4', .75), (2.5, 'A4', .4), (3, 'G4', .4), (3.5, 'F4', .4)],
    9:  [(0, 'F#4', .75), (1.5, 'A4', .75), (2.5, 'C5', .4), (3, 'D5', .4), (3.5, 'C5', .4)],
    10: [(0, 'A4', .75), (1.5, 'D5', 1.5), (3.5, 'C5', .4)],
    11: [(0, 'B4', .75), (1.5, 'D5', .75), (2.5, 'F5', .4), (3, 'D5', .4), (3.5, 'B4', .4)],
    12: [(0, 'G4', .75), (1.5, 'Bb4', .75), (2.5, 'C5', .4), (3, 'E5', .4), (3.5, 'G5', .4)],
    13: [(0, 'A5', .75), (1.5, 'F5', .75), (2.5, 'C5', .4), (3, 'D5', .4), (3.5, 'F5', .4)],
    14: [(0, 'F#5', .75), (1.5, 'D5', .75), (2.5, 'A4', .4), (3, 'C5', .4), (3.5, 'D5', .4)],
}
for bar, notes in MEL.items():
    open_tp = bar >= 11
    for b_, p, d in notes:
        n(bt(bar, b_), 'trumpet' if open_tp else 'trumpet_mute', p, d * B, .8 if open_tp else .75, -.15, .75 if open_tp else .9)
        if bar >= 11: n(bt(bar, b_), 'clarinet', M(p) - 9, d * B, .6, .35, .5)
# map arrivals: glockenspiel pings; flip-book: woodblock on every step
for k, p in (('ny', 'C6'), ('line_hollywood', 'E6'), ('line_austin', 'G6')):
    n(HIT[k], 'glockenspiel', p, .6, .7, .2, .55)
for i in range(7):
    n(HIT['flipbook'] + i * B, 'woodblock', None, None, .55 + .05 * (i % 2), .25, .5)
# ------------------------------------------------------------------ 3. the stop under the title card
TC = HIT['stop_card']
n(TC, 'tuba_stac', 'D2', .3, .9)
for p in ['F#4', 'A4', 'D5']: n(TC, 'trumpet', p, .2, .85, 0, .5)
for p in ['D3', 'F#3', 'C4']: n(TC, 'trombone_stac', p, .2, .8, 0, .5)
n(TC, 'crash', None, None, .55, 0, .5)
for k in range(10): n(TC + .9 + k * .05, 'timpani', 'A1', .06, .3 + k * .05, 0, .6)
n(TC + 1.4, 'timpani', 'D2', 1.0, .85); n(TC + 1.4 + 2 * B, 'timpani', 'A1', .9, .7)

# ------------------------------------------------------------------ 4. the old-time reel (D major), Ford's side
RCH = {'D': ['D', 'F#', 'A'], 'G': ['G', 'B', 'D'], 'A7': ['A', 'C#', 'E', 'G']}
RROOT = {'D': ('D2', 'A1'), 'G': ('G1', 'D2'), 'A7': ('A1', 'E2')}
REEL = [   # (chord, eighth-note fiddle line; '-' holds) — original
    ('D', 'D5 F#5 A5 F#5 D5 F#5 A5 D6'), ('G', 'B5 G5 D5 G5 B5 A5 G5 F#5'),
    ('D', 'A5 F#5 D5 F#5 A5 B5 A5 F#5'), ('A7', 'E5 G5 B5 G5 E5 C#5 A4 C#5'),
    ('D', 'D5 E5 F#5 G5 A5 F#5 D5 F#5'), ('G', 'G5 A5 B5 D6 B5 G5 D5 G5'),
    ('A7', 'A5 G5 E5 C#5 E5 A5 G5 E5'), ('D', 'F#5 - D5 - A4 - D5 -'),
]
def reel_bar(t0, i, pan=0.0, gain=1.0, fiddle=True):
    ch, line = REEL[i % len(REEL)]
    T = lambda k: t0 + k * B
    r, f = RROOT[ch]
    n(T(0), 'tuba_stac', r, .25, .8, pan, .6 * gain); n(T(2), 'tuba_stac', f, .25, .75, pan, .6 * gain)
    for k in (1, 3):
        for p in [f"{x}3" for x in RCH[ch]][:3]: n(T(k), 'upright', p, .16, .55, pan + .1, .3 * gain)
    notes = line.split()
    if fiddle:
        for j, p in enumerate(notes):
            if p == '-': continue
            d = .5 * B * (2 if j + 1 < len(notes) and notes[j + 1] == '-' else 1)
            n(T(j * .5), 'violin', p, d * .95, .62 + .12 * (j % 2 == 0), pan - .1, .8 * gain)
            n(T(j * .5), 'strumstick', M(p) - 12, .2, .5, pan + .3, .3 * gain)   # dulcimer-ish double
REEL_START = HIT['iris_orch'] - B   # the fiddle comes in half a beat... one beat before the iris (J-cut)
n(REEL_START, 'violin', 'A4', .9 * B, .6, -.1, .7)
n(REEL_START + .5 * B, 'violin', 'C#5', .45 * B, .6, -.1, .7)
reel_bars = int(round((SEC['split']['t0'] - HIT['iris_orch']) / BAR))
for i in range(reel_bars):   # the fiddle sits out the first bar so "Henry Ford's" reads
    reel_bar(HIT['iris_orch'] + i * BAR, i, fiddle=i > 0)
# book slam: bass drum on the downbeat under the reel
n(HIT['book_slam'], 'bass_drum', None, None, .8, 0, .7)

# ------------------------------------------------------------------ 5. the duel (split screen)
# reel on the left, band on the right, trading bars, then half bars, then beats; each side is
# rendered on its own and gated to its own slots (hard edits, like trading cuts)
DUEL, t = [], SEC['split']['t0']
for dur_b, side in [(1, 'L'), (1, 'R'), (.5, 'L'), (.5, 'R'), (.25, 'L'), (.25, 'R'), (.25, 'L'), (.25, 'R')]:
    if t >= HIT['needle'] - 1e-6: break
    DUEL.append((t, min(t + dur_b * BAR, HIT['needle']), side)); t += dur_b * BAR
main_ev, main_pl = ev, plucks
duel_audio = {}
for side in 'LR':
    ev, plucks = [], []
    i = 0
    for a_, z_, sd in DUEL:
        if sd != side: continue
        if side == 'L':
            reel_bar(a_, i, pan=-.7)
        else:
            band_bar(a_, ['F', 'C7', 'F', 'C7'][i % 4], pan=.7)
            for b_, p, d in [(0, 'A5', .75), (1.5, 'C6', .75), (2.5, 'D6', .4), (3, 'C6', .4), (3.5, 'A5', .4)]:
                n(a_ + b_ * B, 'trumpet', p, d * B, .85, .65, .7)
        i += 1
    x = S.render(ev, dur=N / SR)
    for t_p, pre, ps, d, v, g_, pan in plucks:
        y = PL.strum(pre, ps, d, vel=v, spread=.012) if len(ps) > 1 else PL.pluck(pre, ps[0], d, v)
        add(x, y, t_p, g_, pan)
    gate = np.zeros(N, np.float32)
    for a_, z_, sd in DUEL:
        if sd == side:
            i0, i1 = int(a_ * SR), int(z_ * SR); gate[i0:i1] = 1
    gate = uniform_filter1d(gate, int(.012 * SR))
    duel_audio[side] = x * gate[:, None]
ev, plucks = main_ev, main_pl

# ------------------------------------------------------------------ 8. the end: "da – DA!"
h1, h2 = HIT['end_hit1'], HIT['end_hit2']
for p in ['E4', 'Bb4', 'G5']: n(h1, 'trumpet', p, .16, .8, 0, .5)
for p in ['C3', 'Bb3', 'E4']: n(h1, 'trombone_stac', p, .2, .8, 0, .5)
n(h1, 'tuba_stac', 'C2', .2, .85); n(h1, 'snare', 'on', None, .6, 0, .5)
for p in ['A5', 'C6', 'F5']: n(h2, 'trumpet', p, 2.4, .9, 0, .5)
n(h2, 'clarinet', 'F5', 2.4, .7, .3, .5)
for p in ['F3', 'A3', 'C4', 'F4']: n(h2, 'trombone', p, 2.4, .8, 0, .45)
n(h2, 'tuba_stac', 'F2', .6, .9); n(h2, 'timpani', 'F2', 2.2, .9); n(h2, 'crash', None, None, .85, 0, .8)
for p in ['F4', 'A4', 'C5']: n(h2, 'honky_tonk', p, 1.5, .7, .3, .4)
# end card: a soft tag (clarinet + muted trumpet), the band's last word
EC = SEC['endcard']['t0']
for b_, p, d in [(0, 'C5', .5), (.5, 'A4', .5), (1, 'F4', .5), (1.5, 'A4', .5), (2, 'C5', 1.5), (4, 'F5', 4)]:
    n(EC + .2 + b_ * B, 'clarinet', p, d * B, .55, .2, .45)
for p in ['F3', 'A3', 'C4', 'E4']: n(EC + .2 + 4 * B, 'trombone', p, 4 * B, .45, 0, .3)
plucks.append((EC + .2 + 4 * B, 'banjo', ['F4', 'A4', 'C5', 'F5'], 1.2, .6, .22, -.35))

music = S.render(ev, dur=N / SR)
for t, pre, ps, d, v, g, pan in plucks:
    x = PL.strum(pre, ps, d, vel=v, spread=.012) if len(ps) > 1 else PL.pluck(pre, ps[0], d, v)
    add(music, x, t, g, pan)
music = S.room(music, size=.28, mix=.12)
music += S.room(duel_audio['L'] + duel_audio['R'], size=.28, mix=.12)
tt = t_(N / SR)
# the band and reel stop dead at the needle (the record takes over), and stay silent to the end hits
cut = int(HIT['needle'] * SR); rel = int(.03 * SR)
music[cut:cut + rel] *= np.linspace(1, 0, rel)[:, None]
music[cut + rel:int((h1 - .02) * SR)] = 0

# ------------------------------------------------------------------ 6. the 1925 record
rec, rsr = sf.read(HERE / "assets" / "record.wav", dtype="float32")
rec = soxr.resample(rec, rsr, SR)
R = TL["record"]; ratio = R["src_bpm"] / TL["bpm"]
rec_t0 = R["film_end"] - (R["src_end"] - (R["src_t0"] - .6)) * ratio      # film time of the file's first sample
recb = np.zeros(N, np.float32)
i0 = int(rec_t0 * SR); recb[i0:i0 + len(rec)] = rec[:N - i0]
on = int((HIT['needle'] - .02) * SR); recb[:on] = 0
fi = int(.025 * SR); recb[on:on + fi] *= np.linspace(0, 1, fi)
# after its final chord the needle lifts: ring 0.35 s then cut
off = int((HIT['freeze'] + .35) * SR); fo = int(.04 * SR)
recb[off:off + fo] *= np.linspace(1, 0, fo); recb[off + fo:] = 0
recb = bp(recb, 110, 6500, 2)
recb = norm(recb) * .62
# surface noise of a 78: crackle + hiss + rotation rumble, only while the needle is down
crk = np.zeros(N, np.float32)
rng = np.random.default_rng(5)
for t in np.arange(HIT['needle'] - .05, HIT['freeze'] + .35, 1 / 38):
    if rng.random() < .55:
        i = int((t + rng.random() / 38) * SR); L_ = int(SR * .0015)
        crk[i:i + L_] += (rng.random() - .5) * 2 * np.exp(-np.arange(L_) / (SR * .0003))
hiss = hp(noise(N / SR), 3000) * .02
mask = ((tt > HIT['needle'] - .05) & (tt < HIT['freeze'] + .35)).astype(np.float32)
surf = (bp(crk, 800, 9000) * .35 + hiss + lp(noise(N / SR), 30) * .08 * np.sin(2 * np.pi * 1.3 * tt)) * mask

# ------------------------------------------------------------------ foley
fx = np.zeros((N, 2), np.float32)
def arc(v=1.0):
    d = .5; x = hp(noise(d), 2000) * env_exp(d, .006) + bp(noise(d), 3000, 9000) * env_exp(d, .12) * .25
    return norm(x) * v
def long_whoosh(d, v=1.0):
    tq = t_(d); out = np.zeros(len(tq)); nz = noise(d)
    for i in range(0, len(tq), 480):
        f = 400 + 2600 * (i / len(tq)) ** 1.6; hi = min(len(tq), i + 480)
        out[i:hi] = bp(nz[max(0, i - 2000):hi], f * .7, f * 1.4)[-(hi - i):]
    flutter = .55 + .45 * np.abs(np.sin(2 * np.pi * np.cumsum(3 + 9 * tq / d) / SR))
    return norm(out * flutter * (tq / d) ** 1.4) * v
def paper_slap(v=1.0):
    d = .25; return norm(bp(noise(d), 500, 6000) * env_exp(d, .03)) * v
def flap(v=1.0):
    d = .3; tq = t_(d); return norm(bp(noise(d), 800, 5000) * (np.abs(np.sin(2 * np.pi * 14 * tq)) ** 2) * env_exp(d, .1)) * v
def flick(v=1.0):   # one page of a flip-book
    d = .07; return norm(bp(noise(d), 1500, 7000) * env_exp(d, .015)) * v
def shutter(v=1.0):
    a = click(1.4, 1); out = np.zeros(int(.09 * SR)); out[:len(a)] += a[:len(out)]; b_ = click(1.1, .7)
    j = int(.045 * SR); out[j:j + len(b_)] += b_[:len(out) - j]; return norm(out) * v
def pencil_sq(d, v=1.0):   # grease pencil on celluloid: a scratchy squeak
    tq = t_(d); f = 1800 + 500 * np.sin(2 * np.pi * 7 * tq)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (.4 + .6 * (np.sin(2 * np.pi * 23 * tq) > 0))
    x = bp(noise(d), 1500, 6000) * .6 + tone * .25
    return norm(x * np.minimum(1, np.minimum(tq / .02, (d - tq) / .03))) * v
def lead(d, v=1.0):        # soft lead on paper
    x = bp(noise(d), 2500, 9000) * (.6 + .4 * np.abs(np.sin(2 * np.pi * 31 * t_(d))))
    return norm(x * np.minimum(1, np.minimum(t_(d) / .02, (d - t_(d)) / .02))) * v
def ticker(d, v=1.0):      # telegraph sounder clicking along the route
    out = np.zeros(int(d * SR)); r = np.random.default_rng(3); t = 0
    while t < d - .03:
        c = click(1.8 + r.random() * .3, 1); i = int(t * SR); out[i:i + len(c)] += c[:len(out) - i]; t += r.choice([.045, .045, .09, .135])
    return norm(bp(out, 900, 6000)) * v
def needle_drop(v=1.0):
    d = .25; x = click(.9, 1); out = np.zeros(int(d * SR)); out[:len(x)] += x
    out += bp(noise(d), 200, 3000) * env_exp(d, .05) * .4; return norm(out) * v
def needle_lift(v=1.0):    # the stylus skids off: a short descending zip
    d = .32; tq = t_(d); f = 2400 * (1 - .8 * tq / d)
    x = bp(noise(d), 600, 7000) * (.5 + .5 * np.sin(2 * np.pi * np.cumsum(f / 40) / SR)) * env_exp(d, .12)
    return norm(x) * v

add(fx, arc(.6), HIT['beams_on'], .9)
add(fx, long_whoosh(1.15, .8), HIT['paper_fly'] + .02, .7)
add(fx, thump(1, 85), HIT['paper_slam'], .75); add(fx, paper_slap(.8), HIT['paper_slam'], .8)
add(fx, whoosh(.3, .6), HIT['paper_punch'] - .05, .45)
add(fx, pencil_sq(.3, .7), HIT['knee_ring'], .32, .1); add(fx, pencil_sq(.35, .6), HIT['knee_ring'] + .6, .28, .2)
add(fx, whoosh(.36, .8), HIT['wipe_map'] - .17, .6, -.3)
add(fx, ticker(.6, .7), HIT['line_hollywood'] - .6, .3, -.3); add(fx, ticker(.45, .7), HIT['line_austin'] - .45, .3, .1)
add(fx, flap(.8), HIT['flip_grid'] - .14, .6, .2)
for i in range(9): add(fx, shutter(.7), HIT['grid0'] + i * B, .38, (i % 5 - 2) * .15)
for i in range(7): add(fx, flick(.8), HIT['flipbook'] + i * B, .35, .1)
for i in range(12): add(fx, flick(.6), HIT['blinds_card'] + .02 + i * .02, .22, -.2 + i * .03)
add(fx, whoosh(.25, .6), HIT['iris_orch'] - .04, .35)
add(fx, thump(.9, 75), HIT['book_slam'], .65); add(fx, paper_slap(.6), HIT['book_slam'], .6)
add(fx, whoosh(.3, .5), HIT['page_turn'], .35, -.2); add(fx, flap(.6), HIT['page_turn'] + .05, .4, -.2)
add(fx, lead(.26, .7), HIT['ul_jazz'], .32); add(fx, lead(.34, .7), HIT['ul_vogue'], .32)
add(fx, whoosh(.32, .7), HIT['split_in'] - .02, .5, .5)
add(fx, needle_drop(.9), HIT['needle'] - .04, .55)
add(fx, whoosh(.26, .6), HIT['push_over'], .45, -.4)
add(fx, whoosh(.4, .7), HIT['clock_kids'] - .18, .5, .3)
add(fx, thump(.8, 80), HIT['freeze'], .5)
add(fx, needle_lift(.8), HIT['freeze'] + .33, .4)
add(fx, pencil_sq(.25, .7), HIT['freeze'] + .22, .3, -.2); add(fx, pencil_sq(.25, .6), HIT['freeze'] + .44, .28, .3)
add(fx, whoosh(.3, .5), SEC['button']['t1'] - .3, .35)
# projector bed: motor hum + 24 Hz sprocket clatter + optical hiss (the whole film)
claw = (np.abs(np.sin(np.pi * 24 * tt)) ** 18)
bed = bp(noise(N / SR), 1500, 5000) * claw * .5 + hp(lp(noise(N / SR), 260), 110) * .12 + hp(noise(N / SR), 5000) * .08
bed = norm(bed) * .05 * np.minimum(1, tt / .3)
fx[:, 0] += bed; fx[:, 1] += bed * .95

# ------------------------------------------------------------------ the announcer, as a 1930 optical track
def period_voice(x):
    x = hp(x, 260, 2); x = lp(x, 3700, 3)
    x = x + .55 * bp(x, 1500, 2300, 2)                 # horn-loudspeaker presence peak (~+4 dB)
    x = np.tanh(norm(x) * 2.0) / np.tanh(2.0)          # carbon-mic / amplifier grit
    x = compress(x, thr=.3, ratio=4)
    # wow & flutter: a slowly wandering read head
    k = np.arange(len(x), dtype=np.float64)
    dev = .0022 * np.sin(2 * np.pi * .55 * k / SR) + .0007 * np.sin(2 * np.pi * 6.3 * k / SR)
    pos = np.clip(k + np.cumsum(dev) * 1.0, 0, len(x) - 1)
    x = np.interp(pos, k, x).astype(np.float32)
    # a small hard-walled studio: two early reflections
    y = x.copy(); d1, d2 = int(.031 * SR), int(.067 * SR)
    y[d1:] += x[:-d1] * .16; y[d2:] += lp(x, 2500)[:-d2] * .09
    return norm(y) * .9
vo = np.zeros((N, 2), np.float32)
for L in TL["lines"]:
    x, sr = sf.read(HERE / "voice" / "out" / f"{L['id']}.wav", dtype="float32")
    if x.ndim > 1: x = x.mean(1)
    add(vo, period_voice(soxr.resample(x, sr, SR)), L['t'], 1.0)

# duck everything musical under the announcer
env = (np.abs(vo[:, 0]) > .02).astype(np.float32)
env = uniform_filter1d(maximum_filter1d(env, int(.18 * SR)), int(.12 * SR))
duck_m = 1 - .42 * env; duck_r = 1 - .42 * env
mus = music * duck_m[:, None]
for c in range(2):   # optical-track colour on the band
    y = bp(mus[:, c], 95, 7500, 2); y = y - .65 * lp(y, 150, 2)
    mus[:, c] = np.tanh(y * 1.6) / 1.6
    fx[:, c] = hp(fx[:, c], 55, 2)
recm = (recb * duck_r + surf * .9)
mix = mus * 1.2 + fx * .85 + vo * 1.05 + recm[:, None] * np.array([1.0, .98], np.float32) * 1.15
for c in range(2): mix[:, c] = limit(mix[:, c], .95)
(HERE / "out").mkdir(exist_ok=True)
sf.write(HERE / "out" / "mix.wav", mix[:int(DUR * SR)], SR)
if "--stems" in sys.argv:
    for nm, x in (("music", mus), ("fx", fx), ("vo", vo), ("record", np.stack([recm, recm], 1))):
        sf.write(HERE / "out" / f"stem_{nm}.wav", x[:int(DUR * SR)], SR)

def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
vm = np.abs(vo[:, 0]) > .02
print("voice rms", round(rms_db(vo[vm, 0] * 1.05), 1), "| music under voice", round(rms_db(mus[vm, 0] * 1.2), 1),
      "| record (no voice)", round(rms_db(recm[(~vm) & (recm != 0)] * 1.15), 1), "| band (no voice)", round(rms_db(mus[(~vm), 0] * 1.2), 1))
