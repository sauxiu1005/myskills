#!/usr/bin/env python3
"""Banding metric: low-frequency error of an encode vs the lossless master in the dark regions.
Both frames are blurred (sigma 6 px) so grain/dither cancels; what remains is contouring / block DC steps.
usage: band_metric.py master.mkv encode.mp4 t [t ...]"""
import json, sys, subprocess, numpy as np
from scipy.ndimage import gaussian_filter
FF = 'ffmpeg'


def dimensions(src):
    result = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
                             '-show_entries', 'stream=width,height', '-of', 'json', src],
                            capture_output=True, text=True, check=True)
    stream = json.loads(result.stdout)['streams'][0]
    return int(stream['width']), int(stream['height'])


def frame(src, t, size):
    width, height = size
    raw = subprocess.run([FF, '-v', 'error', '-noautorotate', '-ss', str(t), '-i', src,
                          '-map', '0:v:0', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    if len(raw) != width * height * 3:
        raise ValueError(f'{src}: no complete {width}x{height} frame at {t}s')
    return np.frombuffer(raw, np.uint8).reshape(height, width, 3).astype(np.float32)


def regions(width, height):
    rw, rh = max(1, width // 4), max(1, height // 4)
    return {name: (slice(y, y + rh), slice(x, x + rw)) for name, (y, x) in {
        'TL': (0, 0), 'TR': (0, width - rw),
        'BL': (height - rh, 0), 'BR': (height - rh, width - rw),
        'BC': (height - rh, (width - rw) // 2),
    }.items()}


def main(master, enc, times):
    size = dimensions(master)
    if dimensions(enc) != size:
        raise ValueError('master and encode dimensions must match; compare aligned frames')
    worst = 0
    for t in times:
        a, b = frame(master, float(t), size), frame(enc, float(t), size)
        row = []
        for k, region in regions(*size).items():
            A, B = a[region].mean(2), b[region].mean(2)
            if A.mean() > 60: continue
            d = gaussian_filter(B, 6) - gaussian_filter(A, 6)
            d -= d.mean()
            v = float(np.percentile(np.abs(d), 99))
            worst = max(worst, v)
            row.append(f'{k} L{A.mean():.0f} lf99={v:.2f}')
        print(t, ' | '.join(row))
    print('worst lf99', round(worst, 2))


if __name__ == '__main__':
    if len(sys.argv) < 4:
        raise SystemExit('usage: band_metric.py master.mkv encode.mp4 t [t ...]')
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
