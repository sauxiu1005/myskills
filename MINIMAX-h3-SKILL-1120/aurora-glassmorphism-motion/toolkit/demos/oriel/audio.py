#!/usr/bin/env python3
"""Soundtrack for "oriel — Clarity, in every light."  (Aurora & Glassmorphism, 10 s)

Warm, open ambient cue in D major at 80 bpm, v5 cue sheet (v1 layout and beats + glass; one cues.json for picture and sound).
mgaudio `ambient` recipe, flavor 'glass', no drums. SFX:
  0.04 catch-light twinkle | 0.95 / 1.9 input / voice land | 2.8 bubble pop | 3.15 / 3.95 reply / toggles land
  3.3 / 3.6 / 3.9 reply lines (in-key ticks) | 4.15 / 4.45 toggles | 5.45 notification ding | 4.75-5.3 light sweep pings
  5.2 orb swells (bubble) | 5.5 drop of light detaches (glass tink) | 5.95 over "Ask Oriel anything" (swish + tink, wine-glass F#5)
  6.2 musical lift | 6.65 over the reply lines (tink, wine-glass D5) | 6.75 cards recede | 6.95 contract
  7.7 merge tink | 7.8 sonic logo D6 F#6 A6 E7 + shimmer | 8.0 tagline tick
"""
import sys, json, os
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'lib', 'audio'))
import mgaudio as mg
from mgaudio import recipes, sfx, synth, fm, theory, seq
from mgaudio import samples as SM
from mgaudio.recipes import place_segments
from mgaudio import filters as F
from mgaudio.core import Sound, noise_st

OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)
cues = json.load(open(os.path.join(HERE, 'cues.json')))
LIFT, SETTLE = cues['swell'], cues['settle']

m = recipes.ambient(bpm=cues['bpm'], key='D', mode='major', prog='Imaj9 vi9 IVmaj9 V6/9', drop=LIFT, outro=SETTLE,
                    flavor='glass', chord_beats=2, final='Imaj9')
f, g = m.form, m.grid
print(f.summary())
for s in f.segments(0, 10):
    print('  chord', s)

# ---- pad: one octave up (warm but not muddy), opens through the film
m['pad'].clips = []
place_segments(m['pad'], f, 0.0, f.end, lambda v, d: synth.pad([n + 12 for n in v], d, 0.75, 'glass', attack=min(0.6, d * 0.35), release=2.0))
m['pad'].hp = 200
m['pad'].insert(lambda a: F.eq(a, [('pk', 350, -4.0, 0.8), ('pk', 750, -3.0, 0.7), ('hs', 6000, 1.5)]))
# warm floor: root + fifth one/two octaves down, soft-filtered (fixes the thin low end of v1)
warm = m.track('warm', level=-24, group='music', fx=[lambda a: F.eq(a, [('lp', 900), ('pk', 180, 2.0, 0.8), ('hp', 45)])])
for (t0, t1, notes, name) in f.segments(0, 10):
    root = name[:2] if len(name) > 1 and name[1] in '#b' else name[0]
    r = theory.midi(root + '2')
    if r < 38: r += 12
    d = t1 - t0
    if d <= 0.01: continue
    warm.add(synth.pad([r, r + 7, r + 12], d + 0.6, 0.7, 'glass', attack=min(0.5, d * 0.4), release=1.2), t0)
m['pad'].automate('lpf', [(0, 1600), (2.5, 2800), (cues['brighten'][0], 3200), (cues['brighten'][1], 7000), (LIFT, 14000), (10, 14000)])

# ---- arpeggio: lighter, sparse in the UI section, blooms at the lift
m['bells'].clips = []
_ins = SM.inst('glock') if SM.available('glock') else None
for t_, n_, d_, v_ in seq.arp(g, lambda t: f.chord_at(t, 24), 0.0, f.outro, div=8, pattern='updown', octaves=1, gate=1.0, vel=0.5, accents='x...'):
    snd = _ins.play(n_, None, v_) if (_ins and n_ >= 81) else fm.bell(n_, 1.4, v_, 'celesta')
    m['bells'].add(snd, t_, pan=float(np.sin(t_ * 2.1)) * 0.5)
HI = [('pk', 700, -2.0, 0.7), ('hs', 3000, 2.0), ('hs', 8000, 3.0)]
for name in ('bells', 'sparkle'):
    m[name].insert(lambda a: F.eq(a, HI))
m['bells'].automate('gain', [(0, -9), (2.4, -7), (4.5, -5), (LIFT, -1.5), (SETTLE, -3), (10, -5)])

# no low thump: the lift is soft. Keep the sub swell very low, mute the boom, soften the pulse
if 'boom' in m.tracks: m['boom'].mute = True
if 'pulse' in m.tracks: m['pulse'].gain = -6
if 'sub' in m.tracks: m['sub'].gain = 0
for name in ('swell', 'bloom'):
    if name in m.tracks: m[name].insert(lambda a: F.eq(a, [('pk', 500, -3.0, 0.6), ('hs', 5000, 2.0)]))
m['air'].insert(lambda a: F.eq(a, [('pk', 350, -3.0, 0.8), ('hs', 6000, 2.0)]))

# the music group: fades in from the very first frame (no silent start), lifts 4.5-6.0, opens at 6.3, holds the end
m.group('music').automate('gain', [(0, -9), (0.6, -3.5), (cues['brighten'][0], -3.0), (cues['brighten'][1], -1.5),
                                     (LIFT, 0.5), (7.5, 0.5), (SETTLE, 0.0), (10, 0.0)])

# ---- shimmer layer: a high, quiet air bed; louder at the lift
n = int(48000 * 10.0)
hiss = F.eq(noise_st(n, 'white', seed=31, corr=0.2) * 0.25, [('hp', 7000), ('hp', 7000), ('lp', 15000)])
env = np.interp(np.arange(n) / 48000., [0, 0.4, 3.0, 4.5, 6.2, 8.0, 10.0], [0.0, 0.35, 0.35, 0.6, 1.0, 0.7, 0.55])
m.track('airhiss', level=-29, width=1.0).add(Sound(hiss * env), 0.0)

# ---- a written celesta line answering the arpeggio (lands on the lift and on the logo)
PRES = HI + [('pk', 3500, -1.0, 1.0)]   # v5: 2-5 kHz pulled back a little
mel = m.track('motif', level=-25, sends={'delay': -8, 'shimmer': -10}, pan=-0.15, fx=[lambda a: F.eq(a, PRES)])
for t, nn, d, v in [(1.7, 'A5', 0.9, 0.45), (cues['bubble'], 'F#5', 1.0, 0.42), (cues['lines'][0], 'B5', 0.8, 0.45), (cues['lines'][2], 'C#6', 0.8, 0.46), (LIFT, 'A5', 1.8, 0.58)]:
    mel.add(fm.bell(theory.midi(nn), d + 1.0, v, 'celesta'), t)

# ---- sonic logo when the lens settles: D6 F#6 A6 E7 (open add9), plus a last E7 glint for the end frame
logo = m.track('logo', level=-23, sends={'shimmer': -6, 'hall': -8}, fx=[lambda a: F.eq(a, PRES)])
for i, nn in enumerate(['D6', 'F#6', 'A6', 'E7']):
    logo.add(fm.bell(theory.midi(nn), 2.6 - 0.3 * i, 0.6 - 0.06 * i, 'celesta'), SETTLE + 0.085 * i)
logo.add(fm.bell(theory.midi('E7'), 1.4, 0.38, 'celesta'), 9.0)

# ---- sound design, locked to cues.json
UI_LIFT = 4.5   # v2: the UI sounds were too quiet on phone speakers
def S(snd, at, gain=0.0, pan=None, verb=None):
    m.sfx(snd, at=at, gain=gain + UI_LIFT, pan=pan, verb=verb)

LB, MERGE = cues['lens_born'], cues['lens_merge']
def glass_tink(note, vel=0.55):
    # struck glass: a high FM chime + a short >4 kHz transient on top (crisp attack)
    b = fm.bell(theory.midi(note), 1.6, vel, 'chime')
    c = sfx.tick('hi').hpf(4500).gain(-10)
    return b + c
# hook: a soft twinkle with the 1 px catch-light, and a breath of air as the first card drifts in
S(sfx.chime(('A6', 'D7', 'F#7'), step=0.06, kind='celesta'), at=cues['sweep'][0] + 0.02, gain=-12, pan=-0.3, verb=-8)
S(sfx.whoosh(1.2, 'air', direction=1, peak=0.5, seed=3), at=0.35, gain=-16, pan=-0.4, verb=-12)
# cards landing (left column, then right column): whisper-light UI clicks, panned with the card
S(sfx.click('soft'), at=cues['input_land'], gain=-15, pan=-0.45, verb=-14)
S(sfx.whoosh(1.0, 'soft', direction=1, peak=0.6, seed=5), at=cues['voice_land'] - 0.35, gain=-19, pan=-0.45)
S(sfx.click('soft'), at=cues['voice_land'], gain=-16, pan=-0.45, verb=-14)
S(sfx.pop('soft', pitch=1.2), at=cues['bubble'], gain=-13, pan=0.5, verb=-14)
for k in ('reply_land', 'toggles_land'):
    S(sfx.click('soft'), at=cues[k], gain=-11, pan=0.45, verb=-14)
    S(sfx.tick('hi').hpf(3000), at=cues[k], gain=-17, pan=0.45)
# 5.2 the input orb swells (rising bubble) -> 5.5 the drop of light detaches: bright glass tink
S(sfx.bubble(0.45, rise=1.8, seed=4), at=cues['lens_bulge'] - 0.02, gain=-17, pan=-0.55, verb=-10)
S(glass_tink('A6', 0.6), at=LB, gain=-8, pan=-0.5, verb=-8)
# over "Ask Oriel anything": glass swish + tink, rubbed wine-glass tone (VCSL D#4 -> F#5) under the slide
S(sfx.whoosh(0.7, 'swish', direction=1, peak=0.6, seed=21).hpf(1500), at=cues['lens_text1'] - 0.42, gain=-17, pan=-0.45)
S(glass_tink('D7', 0.45), at=cues['lens_text1'], gain=-12, pan=-0.4, verb=-8)
rub = SM.hit('wineglass', match='D#4', vel=0.6, pitch=15, maxdur=1.8).fade(0.3, 0.8)
S(rub, at=LB + 0.15, gain=-16, pan=-0.35, verb=-8)
# reply lines arrive: one soft in-key tick each; toggles switch on
for i, t in enumerate(cues['lines']):
    nn = ['A6', 'D7', 'F#7'][i]
    S(sfx.blip(nn, 'sine', dur=0.06, glide=0.5), at=t, gain=-17, pan=0.35 + 0.03 * i, verb=-10)
    S(sfx.tick('hi').hpf(3000), at=t, gain=-23, pan=0.35)
for i, t in enumerate(cues['toggles']):
    S(sfx.toggle(on=True), at=t, gain=-12 - i, pan=0.4)
# notification capsule (top centre)
S(sfx.whoosh(0.9, 'soft', direction=0, peak=0.75, seed=9), at=cues['notif'][1] - 0.4, gain=-21, pan=0.0)
S(sfx.ding('F#6', 'celesta', dur=0.8), at=cues['notif'][1], gain=-16, pan=0.0, verb=-8)
# light sweep: air right->left and a tiny glass ping as it lights each column in depth order (times from the geometry)
gs0, gs1 = cues['glass_sweep']
S(sfx.whoosh(gs1 - gs0 + 0.3, 'air', direction=1, peak=0.55, seed=17).hpf(2500), at=gs0 - 0.1, gain=-19, pan=0.0, verb=-12)
for (tt, nn, pp) in [(gs0 + 0.22, 'A6', 0.45), (gs0 + 0.31, 'D7', 0.0), (gs0 + 0.38, 'F#7', -0.45)]:
    S(glass_tink(nn, 0.28), at=tt, gain=-22, pan=pp, verb=-9)
# glide over the reply lines: swish + tink, second wine-glass tone (-> D5) panned right
S(sfx.whoosh(0.8, 'swish', direction=1, peak=0.55, seed=11).hpf(1200), at=cues['lens_text2'] - 0.55, gain=-21, pan=0.2, verb=-12)
rub2 = SM.hit('wineglass', match='D#4', vel=0.6, pitch=11, maxdur=1.4).fade(0.3, 0.8)
S(rub2, at=cues['lens_text2'] - 0.4, gain=-17, pan=0.45, verb=-8)
S(sfx.tick('hi').hpf(3000), at=cues['lens_text2'], gain=-15, pan=0.45)
S(glass_tink('A6', 0.55), at=cues['lens_text2'], gain=-8, pan=0.45, verb=-8)
# cards recede in place, the lens contracts to the centre
S(sfx.whoosh(1.0, 'soft', direction=-1, peak=0.5, seed=13), at=cues['cards_out'][0], gain=-20, pan=-0.2, verb=-10)
S(sfx.whoosh(0.7, 'soft', direction=-1, peak=0.6, seed=29).hpf(800), at=cues['lens_contract'] - 0.05, gain=-18, pan=0.25)
# merge -> overshoot -> settle -> wordmark -> tagline
S(glass_tink('A6', 0.62), at=MERGE, gain=-10, pan=0.0, verb=-7)
S(sfx.shimmer_hit(theory.midi('D5')), at=SETTLE, gain=-7, verb=-8)
S(sfx.sparkle(1.2, 16, 'D', 'major_pentatonic', shape='fade', seed=7), at=cues['word'] + 0.1, gain=-16, verb=-10)
S(sfx.tick('hi'), at=cues['tagline'], gain=-22, pan=0.0, verb=-12)

res = m.export(os.path.join(OUT, 'audio.wav'), lufs=-14, tp=-1.5, spectrogram=os.path.join(OUT, 'audio_spec.png'))
m.report()
print({k: res[k] for k in ('duration', 'lufs', 'true_peak', 'bands', 'warnings') if k in res})
hits = [cues['sweep'][0], cues['input_land'], cues['voice_land'], cues['bubble'], cues['reply_land'], cues['toggles_land'], LB, cues['lens_text1']] + cues['lines'] + cues['toggles'] + [cues['notif'][1], cues['lens_text2'], MERGE, SETTLE]
json.dump(hits, open(os.path.join(OUT, 'hits.json'), 'w'))
