#!/usr/bin/env python3
"""Minimal original 80s-synthwave preview renderer (no code copied from any reference).

Every frame is a pure function of (frame index, args, seed): grid, striped sun,
wireframe mountains, stars and a chrome/neon title. Camera: low push-in, then a
lateral parallax move. --loop renders a static-camera seamless loop instead.
Requires: python3, numpy, Pillow, ffmpeg on PATH (or --ffmpeg).
"""
import argparse, json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_CANDIDATES = ["/System/Library/Fonts/STHeiti Medium.ttc", "/System/Library/Fonts/Hiragino Sans GB.ttc",
                   "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc", "C:/Windows/Fonts/msyhbd.ttc"]

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def in_out_sine(k): return -(math.cos(math.pi * clamp(k)) - 1) / 2
def out_cubic(k): return 1 - (1 - clamp(k)) ** 3
def in_quart(k): return clamp(k) ** 4
def rng(seed): return np.random.default_rng(seed)

def load_palette(name):
    with open(os.path.join(HERE, '..', 'palettes', f'{name}.json'), encoding='utf-8') as f: return json.load(f)
def load_intensity(name):
    with open(os.path.join(HERE, '..', 'palettes', 'intensity.json'), encoding='utf-8') as f: return json.load(f)['levels'][name]

def font(size):
    for p in FONT_CANDIDATES:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

class Scene:
    def __init__(s, a):
        s.a, s.W, s.H, s.N = a, a.width, a.height, a.frames
        s.P, s.I = load_palette(a.palette), load_intensity(a.intensity)
        r = rng(a.seed)
        s.stars = np.c_[r.random(160) * s.W, r.random(160) * s.H * 0.5, r.random(160), r.integers(1, 4, 160)]
        # two mountain ridges (far / near), seeded random walk, periodic in x for safe wrapping
        s.ridges = []
        for k, (amp, n) in enumerate([(0.10, 48), (0.065, 36)]):
            h = np.cumsum(r.normal(0, 1, n)); h -= np.linspace(h[0], h[-1], n); h = (h - h.min()) / (np.ptp(h) + 1e-9)
            s.ridges.append((amp, h * 0.7 + 0.3 * r.random(n)))
        # sky gradient (static)
        sky = [np.array(hexrgb(c), float) for c in s.P['sky']]
        y = np.linspace(0, 1, s.H)
        g = np.stack([np.interp(y, [0, 1/3, 2/3, 1], [c[i] for c in sky]) for i in range(3)], -1)[:, None, :]
        s.sky = np.repeat(g, s.W, axis=1)
        s.sky += r.normal(0, 0.8, s.sky.shape)  # anti-banding dither, fixed by seed
        s.title_font, s.sub_font = font(int(s.H * 0.13)), font(int(s.H * 0.038))

    # ---- camera: pure function of frame ----
    def camera(s, f):
        t = f / s.N
        if s.a.loop:
            return dict(z=f / s.a.grid_period, x=0.0, h=1.0, zoom=1.0)
        push = in_out_sine(t / 0.55)            # C1 low push-in over first 55 %
        lat = in_out_sine((t - 0.45) / 0.55)    # C2-style lateral move, overlaps for a carried transition
        return dict(z=f / s.a.grid_period * (1 + 0.6 * push), x=-1.6 + 3.2 * lat, h=1.25 - 0.35 * push, zoom=1.0 + 0.10 * push)

    def render(s, f):
        W, H, P, I = s.W, s.H, s.P, s.I
        cam = s.camera(f)
        hy = H * 0.56
        img = Image.fromarray(s.sky.clip(0, 255).astype(np.uint8))
        glow = Image.new('RGB', (W, H)); gd = ImageDraw.Draw(glow); d = ImageDraw.Draw(img)
        # stars: periodic twinkle (period divides N in loop mode)
        for x, y, ph, sz in s.stars:
            b = 0.5 + 0.5 * math.sin(2 * math.pi * (f / s.N * (1 + int(ph * 3)) + ph))
            c = int(120 + 120 * b); d.point((x - cam['x'] * 4, y), fill=(c, c, min(255, c + 30)))
        # sun: rises in demo mode, bands widen downward and scroll down
        rise = 1.0 if s.a.loop else out_cubic(f / (s.N * 0.35))
        R = H * 0.23 * cam['zoom']; sx = W / 2 - cam['x'] * W * 0.006; sy = hy - R * 0.55 * rise + R * (1 - rise) * 0.9
        yy, xx = np.mgrid[0:int(2 * R) + 2, 0:int(2 * R) + 2].astype(float)
        u, v = (xx - R) / R, (yy - R) / R
        disc = (u * u + v * v) <= 1
        cols = np.array([hexrgb(c) for c in P['sun']], float)
        k = ((v + 1) / 2 * 3).clip(0, 2.999); i0 = k.astype(int); fr = (k - i0)[..., None]
        sunc = cols[i0] * (1 - fr) + cols[np.minimum(i0 + 1, 3)] * fr
        w = (v - 0.05).clip(0, None)
        phase = w * 7.0 - (f / s.a.band_period)
        gap = (phase - np.floor(phase)) < (w * 0.45).clip(0, 0.55)
        a = (disc & ~gap).astype(float)
        sun = Image.fromarray(np.dstack([sunc, a * 255]).clip(0, 255).astype(np.uint8), 'RGBA')
        halo = Image.new('RGBA', (int(4 * R), int(4 * R)), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
        pc = hexrgb(P['sun'][3]); hd.ellipse([R * 0.8, R * 0.8, R * 3.2, R * 3.2], fill=pc + (90,))
        halo = halo.filter(ImageFilter.GaussianBlur(R * 0.35))
        img.paste(halo, (int(sx - 2 * R), int(sy - 2 * R)), halo)
        img.paste(sun, (int(sx - R), int(sy - R)), sun)
        # mountains (wireframe ridges, parallax 0.25 / 0.4)
        for idx, (amp, h) in enumerate(s.ridges):
            par = (0.25, 0.4)[idx]; n = len(h); off = cam['x'] * W * 0.04 * par
            pts = []
            for j in range(-1, n + 2):
                X = j / (n - 1) * W * 1.1 - W * 0.05 - off
                pts.append((X, hy - amp * H * h[j % n] * (1.0 if abs(X - W / 2) > W * 0.18 else 0.35)))
            poly = pts + [(pts[-1][0], hy), (pts[0][0], hy)]
            d.polygon(poly, fill=hexrgb(P['shadow']))
            wire = hexrgb(P['mountain_wire'][idx])
            gd.line(pts, fill=wire, width=3); d.line(pts, fill=wire, width=1)
            for (X, Y) in pts[::2]: d.line([(X, Y), (X + (W / 2 - X) * 0.08, hy)], fill=tuple(int(c * 0.6) for c in wire), width=1)
        # ground
        d.rectangle([0, hy, W, H], fill=hexrgb(P['shadow']))
        gc = tuple(int(c * I['grid_brightness']) for c in hexrgb(P['grid']))
        Fp = H * 0.9 * cam['zoom']; ch = cam['h']
        def proj(X, Z): return W / 2 + (X - cam['x']) * Fp / Z, hy + ch * Fp / Z
        ph = cam['z'] % 1.0
        for i in range(0, 40):                    # horizontal lines flow toward camera
            Z = (i + 1 - ph) * 1.0
            if Z < 0.35: continue
            y = hy + ch * Fp / Z
            if y > H + 2: continue
            fade = clamp(1.6 / Z); col = tuple(int(c * (0.25 + 0.75 * fade)) for c in gc)
            d.line([(0, y), (W, y)], fill=col, width=1); gd.line([(0, y), (W, y)], fill=col, width=3 if Z < 6 else 1)
        for j in range(-30, 31):                   # vertical lines converge to vanishing point
            x0, y0 = proj(j * 1.0, 0.35); x1, y1 = proj(j * 1.0, 60)
            d.line([(x0, y0), (x1, y1)], fill=gc, width=1); gd.line([(x0, y0), (x1, y1)], fill=gc, width=3)
        hot = hexrgb(P['horizon_hot']); d.line([(0, hy), (W, hy)], fill=hot, width=2); gd.line([(0, hy), (W, hy)], fill=hot, width=6)
        # title: slam at 70 % (demo) / static in loop
        if s.a.title:
            if s.a.loop: sc, alpha, flash = 1.0, 1.0, 0.0; tx, ty = W * 0.07, H * 0.08; anchor = 'la'
            else:
                fs = int(s.N * 0.70); k = (f - (fs - 3)) / 3
                if f < fs - 3: sc, alpha = 0, 0
                elif f < fs: sc, alpha = 1.8 - 0.8 * in_quart(k), 1
                else: u2 = (f - fs) / s.a.fps; sc, alpha = 1 - 0.04 * math.sin(u2 * 22) * math.exp(-u2 * 7), 1
                flash = 0.35 * math.exp(-max(0, f - fs) / 3) if f >= fs else 0
                tx, ty = W / 2, H * 0.30; anchor = 'mm'
            if alpha > 0:
                img = s.title(img, glow, tx, ty, sc, anchor)
                if flash > 0: img = Image.blend(img, Image.new('RGB', (W, H), (255, 235, 250)), flash)
        # bloom = blurred glow layer added twice (tight + wide)
        g1 = np.asarray(glow.filter(ImageFilter.GaussianBlur(H * 0.004)), float)
        g2 = np.asarray(glow.filter(ImageFilter.GaussianBlur(H * 0.028)), float)
        out = np.asarray(img, float) + g1 * 0.9 + g2 * I['bloom'] * 1.4
        if I['scanlines'] > 0: out[::3] *= (1 - I['scanlines'] * 2)
        if I['rgb_split_px']: k = I['rgb_split_px']; out[:, k:, 0] = out[:, :-k, 0]; out[:, :-k, 2] = out[:, k:, 2]
        yv, xv = np.mgrid[0:H, 0:W]; q = ((xv / W - .5) ** 2 + (yv / H - .5) ** 2)
        out *= (1 - q * I['vignette'] * 2)[..., None]
        return Image.fromarray(out.clip(0, 255).astype(np.uint8))

    def title(s, img, glow, tx, ty, sc, anchor):
        W, H, P = s.W, s.H, s.P
        f = s.title_font if sc == 1.0 else font(max(8, int(s.H * 0.13 * sc)))
        m = Image.new('L', (W, H)); ImageDraw.Draw(m).text((tx, ty), s.a.title, font=f, fill=255, anchor=anchor)
        bb = m.getbbox()
        if not bb: return img
        y0, y1 = bb[1], bb[3]
        ch = [np.array(hexrgb(c), float) for c in P['chrome']]
        yy = np.clip((np.arange(H) - y0) / max(1, y1 - y0), 0, 1)
        stops = [0, .45, .5, .75, 1]; cols = [ch[0], ch[1], ch[3], ch[4], ch[0]]
        grad = np.stack([np.interp(yy, stops, [c[i] for c in cols]) for i in range(3)], -1)
        chrome = Image.fromarray(np.repeat(grad[:, None], W, 1).clip(0, 255).astype(np.uint8))
        k = max(3, int(H * 0.012) | 1)
        pad = 12 * k                                          # filters are local: work on a padded crop for speed
        box = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(W, bb[2] + pad), min(H, bb[3] + pad))
        mc = m.crop(box)
        def full(c):
            out = Image.new('L', (W, H)); out.paste(c, box[:2]); return out
        rim = full(mc.filter(ImageFilter.MaxFilter(3 * k)))   # outer neon rim
        stroke_c = mc.filter(ImageFilter.MaxFilter(2 * k - 1))  # dark stroke keeps the chrome readable over glow
        stroke = full(stroke_c)
        backing = full(mc.filter(ImageFilter.MaxFilter(4 * k + 1)).filter(ImageFilter.GaussianBlur(3 * k)))
        img = Image.composite(Image.new('RGB', (W, H), hexrgb(P['shadow'])), img, backing.point(lambda v: int(v * 0.85)))
        neon = Image.new('RGB', (W, H), hexrgb(P['neon_primary']))
        img = Image.composite(neon, img, rim)
        outer = Image.fromarray((np.asarray(rim, np.int16) - np.asarray(stroke, np.int16)).clip(0, 255).astype(np.uint8))
        glow.paste(neon, (0, 0), outer.filter(ImageFilter.GaussianBlur(2)))
        img = Image.composite(Image.new('RGB', (W, H), hexrgb(P['shadow'])), img, stroke)
        img = Image.composite(chrome, img, m)
        if s.a.subtitle:
            d = ImageDraw.Draw(img); g = ImageDraw.Draw(glow)
            pos = (tx, y1 + H * 0.05) if anchor == 'mm' else (tx, y1 + H * 0.02)
            d.text(pos, s.a.subtitle, font=s.sub_font, fill=hexrgb(P['text_main']), anchor='ma' if anchor == 'mm' else 'la')
            g.text(pos, s.a.subtitle, font=s.sub_font, fill=hexrgb(P['neon_secondary']), anchor='ma' if anchor == 'mm' else 'la')
        return img

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out', default='synthwave_preview.mp4')
    ap.add_argument('--width', type=int, default=1280); ap.add_argument('--height', type=int, default=720)
    ap.add_argument('--fps', type=int, default=30); ap.add_argument('--frames', type=int, default=150)
    ap.add_argument('--palette', default='neon-sunset', choices=['neon-sunset', 'cyan-midnight', 'peach-dusk'])
    ap.add_argument('--intensity', default='standard', choices=['subtle', 'standard', 'full'])
    ap.add_argument('--title', default='霓虹夜航'); ap.add_argument('--subtitle', default='NIGHTWAVE · 午夜出发')
    ap.add_argument('--seed', type=int, default=1986)
    ap.add_argument('--loop', action='store_true', help='static camera; all cycles divide --frames')
    ap.add_argument('--grid-period', type=int, default=30, help='frames per grid-line cycle')
    ap.add_argument('--band-period', type=int, default=75, help='frames per sun-band cycle')
    ap.add_argument('--still', type=int, default=None, help='render only this frame to --out (png)')
    ap.add_argument('--ffmpeg', default='ffmpeg')
    a = ap.parse_args()
    if a.loop:
        for n, p in (('grid-period', a.grid_period), ('band-period', a.band_period)):
            if a.frames % p: sys.exit(f'--loop needs --frames divisible by --{n} ({a.frames} % {p} != 0)')
    sc = Scene(a)
    if a.still is not None:
        sc.render(a.still).save(a.out); print('wrote', a.out); return
    cmd = [a.ffmpeg, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{a.width}x{a.height}', '-r', str(a.fps),
           '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', a.out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(a.frames):
        p.stdin.write(sc.render(f).tobytes())
    p.stdin.close(); p.wait(); print('wrote', a.out, a.frames, 'frames')

if __name__ == '__main__':
    main()
