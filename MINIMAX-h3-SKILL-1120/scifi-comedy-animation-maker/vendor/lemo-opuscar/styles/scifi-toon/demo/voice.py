"""Voice post-processing: out/raw/<id>.wav (made by core/tts/tts.py) → voices/<id>.wav (48k, processed per character)
+ voices/dur.json (durations) + voices/lips.json (lip sync: openness o and "brightness" b per 1/24 s)
- "pitch": shift in semitones (coffee creature +7)
- "cut":   truncate at this many seconds (Gary's interrupted line), 40 ms fade-out
- VASK: light saturation + low-mid boost = raspy; GARY: slightly brightened
Usage: python voice.py"""
import json, os, numpy as np, soundfile as sf, librosa
from scipy.signal import butter, sosfilt
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000
L = json.load(open(os.path.join(HERE, 'lines.json')))
os.makedirs(os.path.join(HERE, 'voices'), exist_ok=True)
dur, lips = {}, {}
def peq(x, f, gain_db, q=1.0):   # peaking EQ (RBJ biquad)
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    from scipy.signal import lfilter; return lfilter(np.array(b) / a[0], np.array(a) / a[0], x)
for l in L:
    y, sr = sf.read(os.path.join(HERE, 'out/raw', l['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = librosa.resample(y, orig_sr=sr, target_sr=SR)
    if l.get('pitch'): y = librosa.effects.pitch_shift(y, sr=SR, n_steps=l['pitch'])
    if l.get('cut'):
        n = int(l['cut'] * SR); y = y[:n]; f = int(.04 * SR); y[-f:] *= np.linspace(1, 0, f)
    y = y / (np.abs(y).max() + 1e-9) * .9
    if l['who'] == 'VASK':
        sat = np.tanh(y * 2.6) / np.tanh(2.6); y = .7 * y + .3 * sat
        y = peq(y, 180, 2.5, .8); y = peq(y, 2800, -1.5, 1.0)
    elif l['who'] == 'GARY':
        y = peq(y, 3200, 2.0, .9)
    y = y / (np.abs(y).max() + 1e-9) * .9
    sf.write(os.path.join(HERE, 'voices', l['id'] + '.wav'), y.astype(np.float32), SR)
    dur[l['id']] = round(len(y) / SR, 3)
    # lip sync: 50 ms window RMS (normalized to the line's 95th percentile) + spectral centroid
    hop = SR // 24; win = int(.05 * SR); o, b = [], []
    S = np.abs(librosa.stft(y, n_fft=4096, hop_length=hop, win_length=win, center=True))
    freqs = librosa.fft_frequencies(sr=SR, n_fft=4096)
    rms = np.sqrt((S ** 2).mean(0)); p = np.percentile(rms, 95) + 1e-9
    cen = (S * freqs[:, None]).sum(0) / (S.sum(0) + 1e-9)
    for i in range(len(rms)):
        o.append(round(float(np.clip((rms[i] / p - .1) / .8, 0, 1)), 2))
        b.append(round(float(np.clip((cen[i] - 1200) / 2600, 0, 1)), 2))
    lips[l['id']] = {'o': o, 'b': b}
    print(l['id'], dur[l['id']])
json.dump(dur, open(os.path.join(HERE, 'voices/dur.json'), 'w'), indent=0)
json.dump(lips, open(os.path.join(HERE, 'voices/lips.json'), 'w'))
