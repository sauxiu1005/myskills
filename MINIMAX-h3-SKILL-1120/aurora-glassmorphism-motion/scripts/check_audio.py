import sys, json, os
import numpy as np
import soundfile as sf
from scipy import signal

# usage: check_audio.py <demo_dir>  (reads <demo_dir>/out/audio.wav and out/hits.json)
HERE = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.getcwd()
x, sr = sf.read(os.path.join(HERE, 'out', 'audio.wav'))
hits = json.load(open(os.path.join(HERE, 'out', 'hits.json')))
mono = x.mean(axis=1) if x.ndim > 1 else x


def onsets(y):
    sos = signal.butter(4, 2500, 'hp', fs=sr, output='sos')
    h = signal.sosfilt(sos, y)
    hop = 240
    e = np.sqrt(np.convolve(h ** 2, np.ones(hop) / hop, 'same')[::hop] + 1e-12)
    db = 20 * np.log10(e)
    flux = np.maximum(np.diff(db, prepend=db[0]), 0)
    return db, flux, hop


def align(y, label):
    db, flux, hop = onsets(y)
    out = []
    for t in hits:
        i0, i1 = max(0, int((t - 0.06) * sr / hop)), int((t + 0.06) * sr / hop)
        j = i0 + int(np.argmax(flux[i0:i1]))
        pre = db[max(0, int((t - 0.25) * sr / hop)):max(1, int((t - 0.03) * sr / hop))]
        post = db[int(t * sr / hop):int((t + 0.08) * sr / hop)]
        rise = float(post.max() - np.median(pre))
        out.append((round(t, 2), round((j * hop / sr - t) * 1000), round(rise, 1)))
    print(label)
    for t, off, rise in out:
        print(f'  {t:5.2f}s  offset {off:+4d} ms  rise {rise:5.1f} dB')
    errs = [abs(o) for _, o, _ in out]
    print(f'  max |offset| {max(errs)} ms; audible(rise>=3dB) {sum(r >= 3 for *_, r in out)}/{len(out)}')


align(mono, 'full-range mono')
sos = signal.butter(4, 300, 'hp', fs=sr, output='sos')
ph = signal.sosfilt(sos, mono)
sos2 = signal.butter(2, 9000, 'lp', fs=sr, output='sos')
ph = signal.sosfilt(sos2, ph)
b, a = signal.iirpeak(1800 / (sr / 2), 1.2)
ph = ph + 0.4 * signal.lfilter(b, a, ph)
align(ph, 'phone speaker sim (mono, HP300, LP9k, +peak 1.8k)')
sf.write(os.path.join(HERE, 'out', 'phone_sim.wav'), ph / max(1e-9, np.abs(ph).max()) * 0.9, sr)
