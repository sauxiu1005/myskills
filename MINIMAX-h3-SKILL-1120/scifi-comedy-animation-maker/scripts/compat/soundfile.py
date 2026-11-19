"""Minimal soundfile stand-in (read/write float WAV via scipy.io.wavfile).
Used because the pip install of the real soundfile package was not completed in this environment.
Only the subset used by the original lemo-opuscar scripts: read(path) -> (data, sr), write(path, data, sr)."""
import numpy as np
from scipy.io import wavfile
def read(path, dtype='float64'):
    sr, x = wavfile.read(path)
    if x.dtype == np.int16: x = x / 32768.0
    elif x.dtype == np.int32: x = x / 2147483648.0
    elif x.dtype == np.uint8: x = (x - 128) / 128.0
    return x.astype(dtype), sr
def write(path, data, sr, subtype=None):
    wavfile.write(path, sr, np.asarray(data, dtype=np.float32))
