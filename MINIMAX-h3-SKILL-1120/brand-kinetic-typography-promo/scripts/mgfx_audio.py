"""Synthesized score + SFX locked to the beat grid, external-music mixing, and BPM analysis."""
import math, subprocess, wave, json
import numpy as np
SR = 44100
PI = math.pi
MOODS = {  # bass root Hz, chord tones
    'energetic': [(55.0, [220, 261.63, 329.63]), (43.65, [174.61, 220, 261.63]), (65.41, [196, 261.63, 329.63]), (49.0, [196, 246.94, 293.66])],
    'bright':    [(65.41, [261.63, 329.63, 392]), (49.0, [196, 246.94, 293.66]), (55.0, [220, 261.63, 329.63]), (43.65, [174.61, 220, 261.63])],
    'cool':      [(73.42, [293.66, 349.23, 440, 523.25]), (49.0, [246.94, 293.66, 349.23]), (65.41, [261.63, 329.63, 392, 493.88]), (55.0, [220, 261.63, 329.63, 392])],
}
STYLE_MIX = {
    'punch':  dict(kick=0.9, kick_every=1, hat=0.22, offhat=0.08, clap=0.35, bass=0.45, pad=0.07, arp=0.0, boom=0.9, whoosh=0.7, blip='sine', drum_in=2),
    'swiss':  dict(kick=0.6, kick_every=2, hat=0.12, offhat=0.0, clap=0.0, rim=0.25, bass=0.35, pad=0.09, arp=0.0, boom=0.0, whoosh=0.35, blip='sine', drum_in=1),
    'hud':    dict(kick=0.85, kick_every=1, hat=0.16, offhat=0.1, clap=0.2, bass=0.4, pad=0.05, arp=0.12, boom=0.7, whoosh=0.5, blip='square', drum_in=2),
    'bouncy': dict(kick=0.75, kick_every=1, hat=0.15, offhat=0.0, clap=0.4, bass=0.35, pad=0.04, arp=0.0, pluck=0.18, boom=0.0, whoosh=0.4, blip='marimba', drum_in=2),
}

def _lp(x, k):
    w = np.hanning(k); w /= w.sum(); return np.convolve(x, w, 'same')
def _saw(f, d): return 2 * ((f * d) % 1.0) - 1

def synth(ctx, out_wav, events):
    """events: list of (t, kind) with kind in cut/bigcut/hit/type."""
    beat = ctx.beat; DUR = ctx.duration; n = int(SR * DUR) + 1; tt = np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n); rng = np.random.default_rng(7)
    mix = STYLE_MIX[ctx.style_name]; aud = ctx.spec.get('audio', {}); chords = MOODS[aud.get('mood', 'energetic')]
    def add(sig, t0, g=1.0, pan=0.0):
        i = int(t0 * SR); j = min(n, i + len(sig))
        if i >= n or i < 0: return
        L[i:j] += sig[:j - i] * g * (1 - max(0, pan)); R[i:j] += sig[:j - i] * g * (1 + min(0, pan))
    def kick():
        d = np.arange(int(0.4 * SR)) / SR; f = 48 + 110 * np.exp(-d * 30)
        return np.sin(2 * PI * np.cumsum(f) / SR) * np.exp(-d * 7) + 0.3 * np.exp(-d * 200) * rng.standard_normal(len(d))
    def hat():
        d = np.arange(int(0.06 * SR)) / SR; x = rng.standard_normal(len(d)); return (x - _lp(x, 6)) * np.exp(-d * 70)
    def clap():
        d = np.arange(int(0.25 * SR)) / SR; x = rng.standard_normal(len(d)); x = _lp(x, 4) - _lp(x, 30)
        return x * (np.exp(-d * 18) + 0.6 * np.exp(-np.maximum(0, d - 0.012) * 40) * (d > 0.012))
    def rim():
        d = np.arange(int(0.05 * SR)) / SR; return (np.sin(2 * PI * 1700 * d) + 0.5 * np.sin(2 * PI * 820 * d)) * np.exp(-d * 90)
    def blip(f, dur=0.08):
        d = np.arange(int(dur * SR)) / SR
        if mix['blip'] == 'square': return np.sign(np.sin(2 * PI * f * d)) * 0.5 * np.exp(-d * 40)
        if mix['blip'] == 'marimba': return (np.sin(2 * PI * f * d) + 0.4 * np.sin(2 * PI * f * 4 * d) * np.exp(-d * 60)) * np.exp(-d * 22)
        return np.sin(2 * PI * f * d) * np.exp(-d * 40)
    def whoosh(dur):
        d = np.arange(int(dur * SR)) / SR; x = rng.standard_normal(len(d)); a = _lp(x, 40); b = _lp(x, 6) - _lp(x, 40)
        u = d / dur; return (a * (1 - u) + b * u * 1.4) * u ** 2 * (1 - np.clip((u - 0.92) / 0.08, 0, 1))
    def boom():
        d = np.arange(int(1.6 * SR)) / SR; f = 38 + 60 * np.exp(-d * 8)
        return np.sin(2 * PI * np.cumsum(f) / SR) * np.exp(-d * 2.5) + _lp(rng.standard_normal(len(d)), 20) * np.exp(-d * 6) * 0.8
    def pluck(f, dur=0.3):
        d = np.arange(int(dur * SR)) / SR; return _lp(_saw(f, d), 8) * np.exp(-d * 12)
    # beat grid
    nbeats = int(DUR / beat); end_t = ctx.scenes[-1]['t0']
    cut_beats = set(round(s['t0'] / beat) for s in ctx.scenes)
    fast = [s for s in ctx.scenes if s['type'] == 'rapid_cuts']
    for b in range(mix['drum_in'], nbeats):
        t0 = b * beat
        if t0 >= end_t: break
        if b % mix['kick_every'] == 0 or b in cut_beats:
            add(kick(), t0, mix['kick'])
            if any(s['t0'] <= t0 < s['t1'] for s in fast): add(kick(), t0 + beat / 2, mix['kick'] * 0.6)
        add(hat(), t0 + beat / 2, mix['hat'], 0.3)
        if mix['offhat']: add(hat(), t0 + beat / 4, mix['offhat'], -0.3); add(hat(), t0 + 3 * beat / 4, mix['offhat'], -0.3)
        if mix['clap'] and b % 2 == 1: add(clap(), t0, mix['clap'])
        if mix.get('rim') and b % 2 == 1: add(rim(), t0 + beat / 2, mix['rim'])
    bass = np.zeros(n); pad = np.zeros(n); arp = np.zeros(n); bar = 4 * beat
    for bi in range(int(DUR / bar) + 1):
        bf, ch = chords[bi % 4]
        for e in range(16):
            s0 = bi * bar + e * bar / 16
            if s0 >= end_t or s0 < mix['drum_in'] * beat: continue
            d = np.arange(int(min(0.12, bar / 16) * SR)) / SR
            note = (np.sin(2 * PI * bf * d) * 1.4 if ctx.style_name == 'swiss' else _saw(bf * (2 if e % 4 == 3 else 1), d)) * np.exp(-d * 14)
            i = int(s0 * SR); m = max(0, min(len(d), n - i)); bass[i:i + m] += note[:m]
            if mix['arp']:
                fq = ch[e % len(ch)] * 2; a = np.sign(np.sin(2 * PI * fq * d)) * np.exp(-d * 25); arp[i:i + m] += a[:m]
            if mix.get('pluck') and e % 2 == 0:
                pl = pluck(ch[(e // 2) % len(ch)] * 2); mm = max(0, min(len(pl), n - i)); arp[i:i + mm] += pl[:mm] * mix['pluck'] / 0.12
        i0 = int(bi * bar * SR); i1 = min(n, int((bi + 1) * bar * SR)); d = tt[i0:i1]
        for fq in ch: pad[i0:i1] += 0.33 * (_saw(fq, d) + _saw(fq * 1.006, d) + _saw(fq * 0.994, d))
    bass = _lp(bass, 30); pad = _lp(pad, 60); arp = _lp(arp, 6)
    duck = np.ones(n)
    for b in range(mix['drum_in'], nbeats):
        i = int(b * beat * SR); d = np.arange(int(0.3 * SR)) / SR; m = max(0, min(len(d), n - i))
        duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.8 * np.exp(-d[:m] * 12))
    padenv = np.clip(tt / 1.0, 0, 1) * (tt < end_t + 0.05)
    L += bass * mix['bass'] * duck; R += bass * mix['bass'] * duck
    L += pad * mix['pad'] * duck * padenv; R += np.roll(pad, 300) * mix['pad'] * duck * padenv
    L += arp * 0.12 * duck * (tt < end_t); R += np.roll(arp, 600) * 0.12 * duck * (tt < end_t)
    sfx_gain = 1.0
    _sfx(ctx, events, add, whoosh, boom, blip, mix, sfx_gain)
    _outro(ctx, L, R, tt, chords, end_t)
    _write(out_wav, L, R, DUR)

def _sfx(ctx, events, add, whoosh, boom, blip, mix, g):
    for t, kind in events:
        if kind in ('cut', 'bigcut') and t > 0.3: add(whoosh(0.45), t - 0.42, mix['whoosh'] * g, 0.4 if int(t * 10) % 2 else -0.4)
        if kind == 'bigcut' and mix['boom']: add(boom(), t, mix['boom'] * g)
        if kind == 'hit': add(blip(900 + (int(t * 7) % 5) * 140, 0.08), t, 0.22 * g, 0.2)
        if kind == 'type': add(blip(2400, 0.015), t, 0.07 * g)
    add(blip(880), 0.08, 0.35 * g)

def _outro(ctx, L, R, tt, chords, end_t):
    i0 = int(end_t * SR); d = tt[i0:] - end_t
    if len(d) == 0: return
    ch = chords[0][1]; ring = sum(_saw(fq, d) + _saw(fq * 1.005, d) for fq in ch + [ch[0] * 2]) * np.exp(-d * 1.2)
    ring = _lp(ring, 50); L[i0:] += ring * 0.07; R[i0:] += ring * 0.07

def _write(out_wav, L, R, DUR):
    n = len(L); tt = np.arange(n) / SR; fade = np.clip((DUR - tt) / 0.3, 0, 1); L = L * fade; R = R * fade
    st = np.stack([L, R], 1); pk = np.max(np.abs(st)) or 1.0; st = np.tanh(st / pk * 1.6) / np.tanh(1.6) * 0.89
    with wave.open(out_wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())

def decode(ffmpeg, path, sr=SR, ch=2):
    raw = subprocess.run([ffmpeg, '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(sr), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).astype(np.float64)

def external(ctx, ffmpeg, out_wav, events):
    """Use a provided/generated music file starting at audio.start seconds; optionally layer SFX."""
    aud = ctx.spec['audio']; x = decode(ffmpeg, aud['path']); s = int(aud.get('start', 0) * SR); n = int(SR * ctx.duration) + 1
    x = x[s:s + n]
    if len(x) < n: x = np.vstack([x, np.zeros((n - len(x), 2))])
    x = x / (np.max(np.abs(x)) or 1) * 0.8
    L, R = x[:, 0].copy(), x[:, 1].copy()
    if aud.get('sfx', True):
        rng = np.random.default_rng(3)
        def add(sig, t0, g=1.0, pan=0.0):
            i = int(t0 * SR); j = min(n, i + len(sig))
            if 0 <= i < n: L[i:j] += sig[:j - i] * g * (1 - max(0, pan)); R[i:j] += sig[:j - i] * g * (1 + min(0, pan))
        def whoosh(dur):
            d = np.arange(int(dur * SR)) / SR; xx = rng.standard_normal(len(d)); a = _lp(xx, 40); b = _lp(xx, 6) - _lp(xx, 40); u = d / dur
            return (a * (1 - u) + b * u * 1.4) * u ** 2
        def boom():
            d = np.arange(int(1.2 * SR)) / SR; f = 38 + 60 * np.exp(-d * 8); return np.sin(2 * PI * np.cumsum(f) / SR) * np.exp(-d * 3)
        def blip(f, dur=0.08):
            d = np.arange(int(dur * SR)) / SR; return np.sin(2 * PI * f * d) * np.exp(-d * 40)
        mix = dict(STYLE_MIX[ctx.style_name]); _sfx(ctx, events, add, whoosh, boom, blip, mix, aud.get('sfx_gain', 0.5))
    _write(out_wav, L, R, ctx.duration)

def analyze(ffmpeg, path):
    """Estimate BPM and strong-beat offsets so scene cuts can land on the music."""
    sr = 22050; x = decode(ffmpeg, path, sr, 1)[:, 0]; hop = 512
    fr = len(x) // hop; e = np.array([np.sum(x[i * hop:(i + 1) * hop] ** 2) for i in range(fr)])
    env = np.maximum(0, np.diff(np.log(e + 1e-9), prepend=0)); env -= env.mean()
    fps = sr / hop; best = (0, 120)
    ac = np.correlate(env, env, 'full')[len(env) - 1:]
    for bpm in np.arange(70, 181, 0.5):
        lag = fps * 60 / bpm; v = sum(np.interp(lag * k, np.arange(len(ac)), ac) for k in (1, 2, 4))
        if v > best[0]: best = (v, bpm)
    bpm = float(best[1])
    if bpm < 90: bpm *= 2
    period = fps * 60 / bpm
    phases = [np.sum(np.interp(np.arange(p, len(env), period), np.arange(len(env)), env)) for p in np.linspace(0, period, 32, endpoint=False)]
    off = float(np.linspace(0, period, 32, endpoint=False)[int(np.argmax(phases))] / fps)
    # loudness per 4-bar window to suggest a strong start point
    win = int(16 * 60 / bpm * fps); loud = []
    for st in np.arange(off * fps, len(e) - win, 4 * period):
        loud.append((float(st / fps), float(np.mean(e[int(st):int(st) + win]))))
    loud.sort(key=lambda z: -z[1])
    return dict(bpm=round(bpm, 1), first_beat=round(off, 3), duration=round(len(x) / sr, 2),
                suggested_starts=[round(s, 3) for s, _ in loud[:3]])
