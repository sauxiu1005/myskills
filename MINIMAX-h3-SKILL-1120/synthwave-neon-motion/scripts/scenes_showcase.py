#!/usr/bin/env python3
"""Three-scene 80s synthwave showcase — original code, 2.5D (NOT true 3D, NOT AI-generated).

Scenes (each 4 s at 30 fps by default):
  01 COASTLINE DRIVE   wedge sports car, coast road, palms, sea reflections, skyline; low rear-3/4 tracking
  02 ARCADE AFTER DARK arcade interior, cabinets front/mid/back, ceiling light strips, floor reflections; aisle push + edge reveal
  03 NEON OBJECT       original unbranded cassette player floating over a neon plinth; small orbit, chrome sweep, 1 s hold

2.5D: flat polygons projected through a pinhole camera, painted far-to-near (painter's algorithm, no z-buffer,
no real lighting). Every frame is a pure function of (frame index, args, seed). All on-screen text is English.
Requires python3, numpy, Pillow, ffmpeg.

v0.2 adds (all OFF by default, so the default command reproduces v0.1 output):
  --motion standard|high   implemented actions: coast speed ramp + layered tail-light trails + near-pole wipe +
                           motion-stretched dashes + burst FOV/camera lag; arcade segment-by-segment strip lighting +
                           push speed variation + sign flicker-on; player key press + reel spin-up + LED on + floor
                           pulse rings + chrome sweep + 4-point star glint + small yaw/roll pose change.
  --look film              film texture: per-frame seeded luminance-weighted grain (size scales with output height),
                           lifted blacks, soft highlight shoulder, halation; optional --weave / --flicker.
  --chroma N / --scanlines video/CRT artefacts, independent of film grain (scanlines are NOT film).
"""
import argparse, math, os, subprocess
import numpy as np
from multiprocessing import Pool
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

UP = np.array([0., 1., 0.])
NEAR = 0.12
A = None

def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease(k): return -(math.cos(math.pi * clamp(k)) - 1) / 2
def mix(c1, c2, k): return tuple(int(a + (b - a) * k) for a, b in zip(c1, c2))
def scale(c, k): return tuple(int(min(255, v * k)) for v in c)
def EN(): return {'base': 0.0, 'standard': 1.0, 'high': 1.5}[A.motion]
def bump(x, a, b, c):
    if x <= a or x >= c: return 0.0
    return ease((x - a) / (b - a)) if x < b else 1 - ease((x - b) / (c - b))
def expo_out(k): return 1 - 2 ** (-10 * clamp(k))
def hsh(n, s=0): return ((math.sin(n * 12.9898 + s * 78.233) * 43758.5453) % 1.0)

FONT_PATHS = ["/System/Library/Fonts/Supplemental/Futura.ttc", "/System/Library/Fonts/Helvetica.ttc",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"]
def font(px):
    for p in FONT_PATHS:
        if os.path.exists(p): return ImageFont.truetype(p, max(6, int(px)))
    return ImageFont.load_default()

class Cam:
    def __init__(s, pos, target, fov, W, H):
        s.p = np.array(pos, float); f = np.array(target, float) - s.p; f /= np.linalg.norm(f)
        r = np.cross(UP, f); r /= np.linalg.norm(r); u = np.cross(f, r)
        s.r, s.u, s.f, s.W, s.H = r, u, f, W, H
        s.F = (W / 2) / math.tan(math.radians(fov) / 2)
    def view(s, P):
        d = np.asarray(P, float) - s.p
        return np.stack([d @ s.r, d @ s.u, d @ s.f], -1)
    def scr(s, V):
        return s.W / 2 + V[..., 0] * s.F / V[..., 2], s.H / 2 - V[..., 1] * s.F / V[..., 2]
    def pt(s, P):
        V = s.view(np.array([P], float))[0]
        if V[2] < NEAR: return None
        x, y = s.scr(V); return float(x), float(y), float(V[2])
    def poly(s, P, mirror=False):
        P = np.array(P, float)
        if mirror: P = P * np.array([1, -1, 1])
        V = list(s.view(P)); out = []
        for i in range(len(V)):
            a, b = V[i], V[(i + 1) % len(V)]; ia, ib = a[2] >= NEAR, b[2] >= NEAR
            if ia: out.append(a)
            if ia != ib: out.append(a + (b - a) * (NEAR - a[2]) / (b[2] - a[2]))
        if len(out) < 3: return None
        x, y = s.scr(np.array(out)); return list(zip(x.tolist(), y.tolist()))
    def depth(s, P): return float(np.mean(s.view(np.array(P, float))[:, 2]))
    def facing(s, P, n): return float(np.dot(n, s.p - np.mean(np.array(P, float), 0))) > 0

class Cv:
    def __init__(s, W, H, bg):
        s.W, s.H = W, H
        s.base = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)); s.glow = Image.new('RGB', (W, H))
        s._dr()
    def _dr(s): s.d = ImageDraw.Draw(s.base); s.g = ImageDraw.Draw(s.glow)
    def poly(s, pts, fill, emit=None, outline=None, ow=1, oemit=None):
        if not pts: return
        s.d.polygon(pts, fill=fill); s.g.polygon(pts, fill=emit or (0, 0, 0))
        if outline:
            s.d.line(pts + [pts[0]], fill=outline, width=max(1, int(ow)))
            if oemit: s.g.line(pts + [pts[0]], fill=oemit, width=max(1, int(ow)))
    def line(s, pts, fill, w=1, emit=None, gw=None):
        if not pts or len(pts) < 2: return
        s.d.line(pts, fill=fill, width=max(1, int(round(w))))
        s.g.line(pts, fill=emit or (0, 0, 0), width=max(1, int(round(gw or w))))
    def ellipse(s, x, y, r, fill, emit=None):
        b = [x - r, y - r, x + r, y + r]; s.d.ellipse(b, fill=fill); s.g.ellipse(b, fill=emit or (0, 0, 0))
    def gpoly(s, pts, stops, direction=(0, 1), sweep=None, emit_k=0.0):
        if not pts: return
        m = Image.new('L', (s.W, s.H)); ImageDraw.Draw(m).polygon(pts, fill=255); bb = m.getbbox()
        if not bb: return
        x0, y0, x1, y1 = bb; X, Y = np.meshgrid(np.arange(x0, x1), np.arange(y0, y1))
        dx, dy = direction; pr = X * dx + Y * dy; t = (pr - pr.min()) / (np.ptp(pr) + 1e-9)
        pos = [p for p, _ in stops]; cols = np.array([c for _, c in stops], float)
        rgb = np.stack([np.interp(t, pos, cols[:, i]) for i in range(3)], -1)
        if sweep:
            c, w, amp = sweep; p2 = X * 0.8 + Y * 0.6; t2 = (p2 - p2.min()) / (np.ptp(p2) + 1e-9)
            rgb += amp * np.exp(-((t2 - c) / w) ** 2)[..., None] * np.array([255, 245, 255])
        tile = Image.fromarray(rgb.clip(0, 255).astype(np.uint8)); mk = m.crop(bb)
        s.base.paste(tile, (x0, y0), mk)
        if emit_k > 0: s.glow.paste(Image.fromarray((rgb * emit_k).clip(0, 255).astype(np.uint8)), (x0, y0), mk)
        elif sweep: s.glow.paste(Image.fromarray((np.clip(rgb - 200, 0, 255) * 0.8).astype(np.uint8)), (x0, y0), mk)
        else: s.g.polygon(pts, fill=(0, 0, 0))
    def add(s, arr, k=1.0):
        s.base = Image.fromarray(np.clip(np.asarray(s.base, float) + arr * k, 0, 255).astype(np.uint8)); s._dr()

def sky(W, H, stops, seed):
    y = np.linspace(0, 1, H); pos = [p for p, _ in stops]; cols = np.array([c for _, c in stops], float)
    g = np.stack([np.interp(y, pos, cols[:, i]) for i in range(3)], -1)[:, None, :]
    return np.repeat(g, W, 1) + np.random.default_rng(seed).normal(0, 0.9, (H, W, 3))

def circle3d(c, ax, ay, r, n=28):
    c = np.array(c, float); ax = np.array(ax, float); ay = np.array(ay, float)
    return [c + ax * r * math.cos(t) + ay * r * math.sin(t) for t in np.linspace(0, 2 * math.pi, n, endpoint=False)]

def quad(P0, du, dv, u0, v0, u1, v1):
    P0, du, dv = map(np.array, (P0, du, dv))
    return [P0 + du * u0 + dv * v0, P0 + du * u1 + dv * v0, P0 + du * u1 + dv * v1, P0 + du * u0 + dv * v1]

INK = (8, 3, 18); MAG = (255, 43, 214); CYAN = (34, 228, 255); WARM = (255, 160, 70)

# ---------------------------------------------------------------- 01 COASTLINE DRIVE
def palm(cv, cam, x, z, h, sid, haze_col):
    lean = (hsh(sid, 1) - 0.5) * 1.6
    P = [(x + lean * (k ** 1.6) * h * 0.18, k * h, z) for k in np.linspace(0, 1, 10)]
    V = cam.view(np.array(P))
    if V[:, 2].min() < 0.6: return
    sx, sy = cam.scr(V); hz = clamp((V[0, 2] - 25) / 160) * 0.75
    col = mix(INK, haze_col, hz); rim = mix((150, 40, 130), haze_col, hz)
    for i in range(9):
        w = 0.34 * cam.F / V[i, 2] * (1 - 0.35 * i / 9)
        cv.line([(sx[i], sy[i]), (sx[i + 1], sy[i + 1])], col, w)
    cx, cy, cz = P[-1]
    for j in range(9):
        a = j / 9 * 2 * math.pi + hsh(sid, 2) * 6; L = h * (0.42 + 0.12 * hsh(sid * 9 + j, 3))
        sway = 0.04 * math.sin(j + sid)
        F3 = [(cx + math.cos(a) * L * k, cy + L * (0.28 * k - (0.75 + sway) * k * k), cz + math.sin(a) * L * k * 0.55) for k in np.linspace(0, 1, 8)]
        Vf = cam.view(np.array(F3))
        if Vf[:, 2].min() < 0.4: continue
        fx, fy = cam.scr(Vf)
        for k in range(7):
            w = 0.26 * cam.F / Vf[k, 2] * (1 - k / 8)
            cv.line([(fx[k], fy[k]), (fx[k + 1], fy[k + 1])], col, w)
        cv.line(list(zip(fx[:6], fy[:6] - max(1, 0.02 * cam.F / Vf[0, 2]))), rim, max(1, cv.W / 900), emit=scale(rim, 0.4))

def car(cv, cam, cx, z0, bob):
    hz = lambda zl: 0.95 + (0.55 - 0.95) * zl / 4.4
    W3 = lambda x, y, zl: (cx + x, y + bob, z0 + zl)
    P = cam.poly
    cv.poly(P([(cx - 1.25, 0.002, z0 - 0.2), (cx + 1.25, 0.002, z0 - 0.2), (cx + 1.25, 0.002, z0 + 4.6), (cx - 1.25, 0.002, z0 + 4.6)]), (6, 3, 10))
    for sx in (-0.65, 0.65):
        cv.poly(P([(cx + sx - 0.22, 0.003, z0 - 3.2), (cx + sx + 0.22, 0.003, z0 - 3.2), (cx + sx + 0.22, 0.003, z0), (cx + sx - 0.22, 0.003, z0)]), (110, 18, 52), emit=(120, 10, 45))
    for sx in (-0.95, 0.62):
        cv.poly(P([W3(sx, 0, 0.75), W3(sx + 0.33, 0, 0.75), W3(sx + 0.33, 0.42, 0.75), W3(sx, 0.42, 0.75)]), (10, 6, 16))
    deck = P([W3(-0.95, hz(0), 0), W3(0.95, hz(0), 0), W3(0.95, hz(4.4), 4.4), W3(-0.95, hz(4.4), 4.4)])
    cv.gpoly(deck, [(0, (70, 30, 110)), (1, (170, 70, 150))], direction=(0, 1))
    side = P([W3(0.95, 0.22, 0), W3(0.95, hz(0), 0), W3(0.95, hz(4.4), 4.4), W3(0.95, 0.40, 4.58), W3(0.95, 0.27, 4.45)])
    cv.gpoly(side, [(0, (46, 24, 92)), (0.55, (70, 30, 110)), (0.62, (200, 70, 170)), (1, (60, 20, 70))], direction=(0, 1))
    stripe = [cam.pt(W3(0.955, 0.62, 0.15)), cam.pt(W3(0.955, 0.47, 4.3))]
    if all(stripe): cv.line([s[:2] for s in stripe], CYAN, max(1, cv.W / 700), emit=CYAN)
    for zl in (0.95, 3.55):
        t = P(circle3d(W3(0.97, 0.34, zl), (0, 0, 1), (0, 1, 0), 0.34))
        r = P(circle3d(W3(0.98, 0.34, zl), (0, 0, 1), (0, 1, 0), 0.21))
        h = P(circle3d(W3(0.99, 0.34, zl), (0, 0, 1), (0, 1, 0), 0.07))
        cv.poly(t, (10, 6, 18)); cv.poly(r, (70, 70, 120), outline=(120, 220, 255), ow=max(1, cv.W / 900), oemit=(30, 90, 120)); cv.poly(h, (25, 20, 40))
    cs = P([W3(0.74, hz(0.85), 0.85), W3(0.70, 1.22, 1.6), W3(0.70, 1.22, 2.5), W3(0.74, hz(3.25), 3.25)])
    cv.gpoly(cs, [(0, (60, 90, 170)), (0.5, (30, 25, 80)), (1, (14, 10, 34))], direction=(0, 1))
    top = [cam.pt(W3(0.71, 1.22, 1.6)), cam.pt(W3(0.71, 1.22, 2.5))]
    if all(top): cv.line([s[:2] for s in top], (150, 240, 255), max(1, cv.W / 800), emit=(60, 160, 200))
    rw = [W3(-0.72, hz(0.85), 0.85), W3(0.72, hz(0.85), 0.85), W3(0.68, 1.22, 1.6), W3(-0.68, 1.22, 1.6)]
    cv.poly(P(rw), (18, 12, 40))
    for k in np.linspace(0.15, 0.85, 6):
        a = np.array(rw[0]) * (1 - k) + np.array(rw[3]) * k; b = np.array(rw[1]) * (1 - k) + np.array(rw[2]) * k
        pa, pb = cam.pt(a), cam.pt(b)
        if pa and pb: cv.line([pa[:2], pb[:2]], (80, 45, 120), max(1, cv.W / 600))
    cv.poly(P([W3(-0.95, 0.22, 0), W3(0.95, 0.22, 0), W3(0.95, hz(0), 0), W3(-0.95, hz(0), 0)]), (28, 13, 48))
    cv.poly(P([W3(-0.88, 0.66, -0.01), W3(0.88, 0.66, -0.01), W3(0.88, 0.79, -0.01), W3(-0.88, 0.79, -0.01)]), (255, 70, 120), emit=(255, 40, 95))
    for xs in np.linspace(-0.66, 0.66, 7):
        a, b = cam.pt(W3(xs, 0.66, -0.02)), cam.pt(W3(xs, 0.79, -0.02))
        if a and b: cv.d.line([a[:2], b[:2]], fill=(90, 10, 40), width=max(1, int(cv.W / 900)))
    cv.poly(P([W3(-0.26, 0.38, -0.01), W3(0.26, 0.38, -0.01), W3(0.26, 0.52, -0.01), W3(-0.26, 0.52, -0.01)]), (55, 38, 78))
    for y in (0.30, 0.34):
        a, b = cam.pt(W3(-0.9, y, -0.01)), cam.pt(W3(0.9, y, -0.01))
        if a and b: cv.d.line([a[:2], b[:2]], fill=(70, 40, 100), width=max(1, int(cv.W / 1000)))

SKY_B = None
def skyline_blocks():
    global SKY_B
    if SKY_B is None:
        r = np.random.default_rng(1986); xs = -1550.0; SKY_B = []
        while xs < -230:
            w = r.uniform(25, 70); h = r.uniform(25, 150) * (1.4 if r.random() < 0.15 else 1)
            win = [(r.uniform(0.1, 0.9), r.uniform(0.05, 0.92), r.random()) for _ in range(int(h / 9))]
            SKY_B.append((xs, xs + w, h, win, r.random())); xs += w + r.uniform(2, 14)
    return SKY_B

def coast_speed(fr):
    """m/s. base: constant 22. motion: cruise (build) -> accelerate (burst) -> settle (hold)."""
    e = EN()
    if not e: return 22.0
    t = fr / A.shot
    return 17.0 + 26.0 * e * ease((t - 0.30) / 0.28) - 10.0 * e * ease((t - 0.62) / 0.25)

def coast_state(fr, W, H):
    e = EN(); ts = fr / A.fps; carx = 1.8
    if e:
        n = int(fr); zc = sum(coast_speed(i) for i in range(n)) / A.fps + (fr - n) * coast_speed(n) / A.fps
    else:
        zc = 22.0 * ts
    bk = bump(fr / A.shot, 0.32, 0.55, 0.85) * e          # burst envelope
    lag = 1.4 * bk; fov = 58 + 7 * bk; shake = 0.018 * bk * math.sin(fr * 2.1)
    cam = Cam((carx + 2.3 + 0.25 * math.sin(ts * 0.9), 1.05 + 0.03 * math.sin(ts * 2.3) + shake, zc - 6.8 - lag),
              (carx - 1.0 + 0.6 * ease(fr / A.shot), 0.85, zc + 6), fov, W, H)
    return cam, zc, coast_speed(fr), bk

def tail_trails(cv, cam, carx, z0, spd, bob):
    """M-T multi-layer optical trails from both tail lights; length grows with speed above cruise."""
    L = max(0.0, spd - 18.0) * 0.28
    if L < 0.05: return
    lay = Image.new('RGB', (cv.W, cv.H)); d = ImageDraw.Draw(lay)
    for w, frac, col in ((0.30, 1.0, (70, 6, 40)), (0.16, 0.7, (170, 25, 85)), (0.06, 0.42, (255, 150, 185))):
        for sx in (-0.7, 0.7):
            pts = [(carx + sx, 0.725 + bob - w / 2, z0 - 0.02), (carx + sx, 0.725 + bob + w / 2, z0 - 0.02),
                   (carx + sx, 0.725 + bob + w * 0.12, z0 - 0.02 - L * frac), (carx + sx, 0.725 + bob - w * 0.12, z0 - 0.02 - L * frac)]
            q = cam.poly(pts)
            if q: d.polygon(q, fill=col)
    lay = lay.filter(ImageFilter.GaussianBlur(cv.W / 900))
    cv.glow = ImageChops.add(cv.glow, lay); cv.add(np.asarray(lay, float), 0.9)

def near_wipe(cv, fr, W, H):
    """Near-foreground pole pair passing the lens during the burst, with 5-subframe motion blur."""
    poles = []
    for zf in (0.55, 0.63):                       # pass-by moments as fraction of the shot
        cz = coast_state(zf * A.shot, W, H)[0].p[2]; poles.append(cz + 0.6)
    acc = np.zeros((H, W)); rim = np.zeros((H, W))
    for s in range(5):
        cam = coast_state(fr - s * 0.2, W, H)[0]
        m = Image.new('L', (W, H)); r = Image.new('L', (W, H)); dm, dr = ImageDraw.Draw(m), ImageDraw.Draw(r)
        for z in poles:
            q = cam.poly([(5.55, -0.2, z), (5.85, -0.2, z), (5.85, 4.2, z), (5.55, 4.2, z)])
            if q: dm.polygon(q, fill=255); dr.line([q[0], q[3]], fill=255, width=max(2, int(W / 240)))
        acc += np.asarray(m, float) / 5; rim += np.asarray(r, float) / 5
    if acc.max() <= 0: return
    a = (acc / 255)[..., None]
    b = np.asarray(cv.base, float) * (1 - a) + np.array([7, 3, 14]) * a
    cv.base = Image.fromarray(b.clip(0, 255).astype(np.uint8)); cv._dr()
    rr = (rim / 255)[..., None] * np.array(MAG, float)
    cv.add(rr, 0.7); cv.glow = ImageChops.add(cv.glow, Image.fromarray((rr * 0.6).clip(0, 255).astype(np.uint8))); cv._dr()

def scene_coast(f, W, H):
    ts = f / A.fps; carx = 1.8
    cam, zc, spd, bk = coast_state(f, W, H)
    hy = cam.pt((cam.p[0], cam.p[1], zc + 1e5))[1]
    hk = clamp(hy / H)
    cv = Cv(W, H, sky(W, H, [(0, (6, 3, 20)), (hk * 0.45, (30, 10, 64)), (hk * 0.85, (120, 34, 116)), (hk, (255, 120, 120)), (1, (10, 5, 20))], 7))
    sp = cam.pt((-650, 70, zc + 3000)); R = 0
    if sp:
        R = 260 * cam.F / sp[2]; n = int(2 * R) + 2; yy, xx = np.mgrid[0:n, 0:n].astype(float)
        u, v = (xx - R) / R, (yy - R) / R; disc = u * u + v * v <= 1
        cols = np.array([(255, 236, 120), (255, 170, 70), (255, 90, 90), (255, 40, 130)], float)
        k = ((v + 1) / 2 * 3).clip(0, 2.999); i0 = k.astype(int); fr = (k - i0)[..., None]
        c = cols[i0] * (1 - fr) + cols[np.minimum(i0 + 1, 3)] * fr
        w = v.clip(0, None); ph = w * 6 - ts * 0.4; gap = (ph - np.floor(ph)) < (w * 0.5).clip(0, 0.5)
        a = (disc & ~gap).astype(float) * 255
        img = Image.fromarray(np.dstack([c, a]).clip(0, 255).astype(np.uint8), 'RGBA')
        cv.base.paste(img, (int(sp[0] - R), int(sp[1] - R)), img)
        cv.glow.paste(Image.fromarray((c * 0.55).clip(0, 255).astype(np.uint8)), (int(sp[0] - R), int(sp[1] - R)), img)
    for (x0, x1, h, win, tint) in skyline_blocks():
        zb = zc + 1800; q = cam.poly([(x0, 0, zb), (x1, 0, zb), (x1, h, zb), (x0, h, zb)])
        if not q: continue
        edge = MAG if tint < 0.5 else CYAN
        cv.poly(q, (16, 8, 34), outline=scale(edge, 0.7), ow=1, oemit=scale(edge, 0.6))
        for (u, v, wc) in win:
            p = cam.pt((x0 + (x1 - x0) * u, h * v, zb))
            if p and (wc < 0.55): cv.ellipse(p[0], p[1], max(0.6, cv.W / 1400), WARM if wc < 0.3 else (140, 230, 255), emit=scale(WARM, 0.6))
    far = zc + 4000
    cv.gpoly(cam.poly([(-4.7, 0, zc - 7), (-4.7, 0, far), (-5000, 0, far), (-5000, 0, zc - 7)]),
             [(0, (90, 30, 110)), (0.12, (40, 16, 74)), (1, (8, 5, 24))])
    cv.poly(cam.poly([(4.7, 0, zc - 7), (5000, 0, zc - 7), (5000, 0, far), (4.7, 0, far)]), (12, 6, 22))
    if sp:
        for i in range(30):
            y = hy + 2 + (i + 1) ** 1.55 * 1.1 * W / 1280
            if y > H: break
            hw = R * (0.35 + 0.035 * i) * (0.55 + 0.45 * math.sin(ts * 3.1 + i * 1.7))
            xo = math.sin(i * 2.3 + ts * 2) * R * 0.15
            col = mix((255, 200, 120), (180, 40, 120), i / 30)
            cv.line([(sp[0] - hw + xo, y), (sp[0] + hw + xo, y)], col, max(1, W / 900), emit=scale(col, 0.7))
    for (x0, x1, h, win, tint) in skyline_blocks()[::3]:
        p = cam.pt(((x0 + x1) / 2, 0, zc + 1800))
        if not p: continue
        for j in range(4):
            y = hy + 3 + j * 5 * W / 1280; ww = (x1 - x0) * cam.F / p[2] * 0.3 * (0.6 + 0.4 * math.sin(ts * 4 + j + x0))
            c = MAG if tint < 0.5 else CYAN
            cv.line([(p[0] - ww, y), (p[0] + ww, y)], scale(c, 0.45), 1, emit=scale(c, 0.35))
    cv.gpoly(cam.poly([(-4.2, 0, zc - 7), (4.6, 0, zc - 7), (4.6, 0, far), (-4.2, 0, far)]),
             [(0, (80, 34, 96)), (0.1, (36, 18, 56)), (1, (18, 10, 30))])
    for x, c in ((-4.0, MAG), (4.4, CYAN)):
        cv.poly(cam.poly([(x - 0.07, 0.001, zc - 7), (x + 0.07, 0.001, zc - 7), (x + 0.07, 0.001, zc + 900), (x - 0.07, 0.001, zc + 900)]), c, emit=scale(c, 0.8))
    k0 = int(math.floor((zc - 7) / 7))
    dl = 3.0 + (max(0.0, spd - 22.0) * 0.16 if EN() else 0.0)     # dashes stretch with speed (motion smear)
    for k in range(k0, k0 + 70):
        z = k * 7
        cv.poly(cam.poly([(-0.09, 0.002, z), (0.09, 0.002, z), (0.09, 0.002, z + dl), (-0.09, 0.002, z + dl)]), (255, 205, 230), emit=(150, 90, 120))
    tops = []
    for k in range(int((zc - 6) // 5), int((zc + 160) // 5)):
        z = k * 5; a, b = cam.pt((-4.75, 0, z)), cam.pt((-4.75, 0.78, z))
        if a and b:
            cv.line([a[:2], b[:2]], (30, 16, 50), max(1, 0.09 * cam.F / a[2])); tops.append(b[:2])
    if len(tops) > 1: cv.line(tops, (255, 110, 220), max(1, W / 700), emit=scale(MAG, 0.7))
    objs = []
    for k in range(int((zc - 10) // 21) - 1, int((zc + 320) // 21) + 1):
        objs.append(('palm', 7.4 + 0.8 * hsh(k, 5), k * 21 + 5, 8.5 + 2.5 * hsh(k, 6), k))
    for k in range(int((zc - 10) // 34) - 1, int((zc + 420) // 34) + 1):
        objs.append(('palm', -6.0 - 0.6 * hsh(k, 7), k * 34 + 17, 7.5 + 2 * hsh(k, 8), k + 500))
    objs.append(('car', carx, zc, 0, 0))
    objs.sort(key=lambda o: -(o[2] + (2.2 if o[0] == 'car' else 0) - cam.p[2]))
    for o in objs:
        if o[0] == 'car':
            bob = 0.012 * math.sin(ts * 13); car(cv, cam, o[1], o[2], bob)
            if EN(): tail_trails(cv, cam, o[1], o[2], spd, bob)
        else: palm(cv, cam, o[1], o[2], o[3], o[4], (150, 45, 120))
    if EN(): near_wipe(cv, f, W, H)
    return cv

# ---------------------------------------------------------------- 02 ARCADE AFTER DARK
PROFILE = [(0, 0), (0, 0.82), (0.17, 0.95), (-0.13, 1.08), (-0.07, 1.65), (0.05, 1.70), (0.05, 1.95), (-0.9, 1.95), (-0.9, 0)]
MARQ = [(255, 60, 200), (40, 230, 255), (255, 150, 60), (180, 90, 255)]

def cabinet(cv, cam, O, out, along, wid, sid, f, mirror=False):
    O, out, along = map(lambda v: np.array(v, float), (O, out, along))
    Wp = lambda o, y, a: O + out * o + UP * y + along * a
    P = lambda pts: cam.poly(pts, mirror)
    style = sid % 4; mq = MARQ[sid % 4]; ts = f / A.fps * (1.6 if EN() else 1.0)
    def E(pts, fill, emit):
        q = P(pts)
        if q: cv.poly(q, scale(fill, 0.5) if mirror else fill, emit=scale(emit, 0.45) if mirror else emit)
    if not mirror:
        for a, n in ((0, -along), (wid, along)):
            sp = [Wp(o, y, a) for o, y in PROFILE]
            if cam.facing(sp, n):
                q = P(sp); cv.poly(q, (24, 12, 44))
                art = P([Wp(-0.85, 0.2, a), Wp(-0.55, 0.2, a), Wp(-0.05, 1.5, a), Wp(-0.35, 1.5, a)])
                cv.poly(art, scale(mq, 0.35), emit=scale(mq, 0.12))
                trim = [cam.pt(Wp(o, y, a)) for o, y in PROFILE[:7]]
                if all(trim): cv.line([t[:2] for t in trim], mq, max(1, cv.W / 700), emit=scale(mq, 0.8))
        if not cam.facing([Wp(0, 0.4, wid / 2)], out): return
        cv.poly(P([Wp(0, 0, 0), Wp(0, 0, wid), Wp(0, 0.82, wid), Wp(0, 0.82, 0)]), (30, 16, 52))
        cv.poly(P([Wp(0.001, 0.30, wid * 0.32), Wp(0.001, 0.30, wid * 0.68), Wp(0.001, 0.62, wid * 0.68), Wp(0.001, 0.62, wid * 0.32)]), (48, 26, 70))
    for a0 in (0.38, 0.55):
        E([Wp(0.002, 0.50, wid * a0), Wp(0.002, 0.50, wid * (a0 + 0.07)), Wp(0.002, 0.57, wid * (a0 + 0.07)), Wp(0.002, 0.57, wid * a0)], WARM, WARM)
    if not mirror:
        cv.poly(P([Wp(0, 0.82, 0), Wp(0, 0.82, wid), Wp(0.17, 0.95, wid), Wp(0.17, 0.95, 0)]), (60, 24, 90))
        pa, pb = np.array([0.17, 0.95]), np.array([-0.13, 1.08])
        cv.poly(P([Wp(*pa, 0), Wp(*pa, wid), Wp(*pb, wid), Wp(*pb, 0)]), (40, 22, 66))
        cols = [(255, 50, 80), (255, 220, 60), (40, 230, 255), (255, 60, 210)]
        for i, (u, v) in enumerate([(0.55, 0.45), (0.68, 0.40), (0.81, 0.45), (0.68, 0.62)]):
            o, y = pa + (pb - pa) * v; p = cam.pt(Wp(o, y + 0.012, wid * u))
            if p: cv.ellipse(p[0], p[1], max(1.2, 0.03 * cam.F / p[2]), cols[i], emit=scale(cols[i], 0.5))
        o, y = pa + (pb - pa) * 0.5; jb, jt = cam.pt(Wp(o, y, wid * 0.25)), cam.pt(Wp(o, y + 0.12, wid * 0.25))
        if jb and jt:
            cv.line([jb[:2], jt[:2]], (20, 20, 30), max(1, 0.015 * cam.F / jb[2])); cv.ellipse(jt[0], jt[1], max(1.5, 0.035 * cam.F / jt[2]), (255, 40, 70), emit=(120, 10, 30))
        cv.poly(P([Wp(-0.13, 1.08, 0.02), Wp(-0.13, 1.08, wid - 0.02), Wp(-0.07, 1.65, wid - 0.02), Wp(-0.07, 1.65, 0.02)]), (10, 7, 18))
    s0 = np.array(Wp(-0.125, 1.13, wid * 0.1)); du = np.array(along) * wid * 0.8
    dv = np.array(Wp(-0.075, 1.60, 0)) - np.array(Wp(-0.125, 1.13, 0))
    sq = lambda u0, v0, u1, v1: quad(s0 + out * 0.004, du, dv, u0, v0, u1, v1)
    E(sq(0, 0, 1, 1), (20, 24, 70), (24, 28, 80))
    ph = ts * 0.7 + sid
    if style == 0:
        for r in range(3):
            for c in range(6):
                u = 0.12 + c * 0.13 + 0.06 * math.sin(ph * 2); v = 0.62 + r * 0.11; col = (90, 255, 150) if r % 2 else (255, 90, 210)
                E(sq(u, v, u + 0.07, v + 0.06), col, col)
        E(sq(0.45 + 0.3 * math.sin(ph * 3), 0.08, 0.55 + 0.3 * math.sin(ph * 3), 0.15), CYAN, CYAN)
    elif style == 1:
        E(sq(0, 0.5, 1, 1), (40, 20, 90), (40, 20, 90)); E(sq(0, 0.49, 1, 0.52), MAG, MAG)
        for i in range(4):
            v = ((i / 4 + ph * 0.5) % 1) * 0.45; E(sq(0.46, v, 0.54, v + 0.05), (255, 230, 120), (255, 230, 120))
        E(sq(0.4, 0.05, 0.6, 0.15), (255, 60, 90), (255, 60, 90))
    elif style == 2:
        for r in range(4):
            for c in range(7):
                E(sq(0.08 + c * 0.13, 0.15 + r * 0.22, 0.11 + c * 0.13, 0.19 + r * 0.22), (255, 230, 90), (200, 180, 60))
        x = (ph * 0.4) % 0.85; E(sq(0.05 + x, 0.36, 0.14 + x, 0.48), (255, 220, 40), (255, 220, 40))
    else:
        for i, col in enumerate([(255, 230, 110), (255, 150, 70), (255, 70, 120), (200, 50, 200)]):
            E(sq(0.15, 0.25 + i * 0.13, 0.85, 0.33 + i * 0.13), col, col)
    E([Wp(0.052, 1.71, 0.03), Wp(0.052, 1.71, wid - 0.03), Wp(0.052, 1.92, wid - 0.03), Wp(0.052, 1.92, 0.03)], mq, scale(mq, 0.9))
    if not mirror:
        for v in (1.77, 1.85):
            a, b = cam.pt(Wp(0.053, v, 0.1)), cam.pt(Wp(0.053, v, wid - 0.1))
            if a and b: cv.d.line([a[:2], b[:2]], fill=(255, 255, 255), width=max(1, int(cv.W / 1000)))

ARC_P = {}
def arcade_progress(f):
    """0..1 along the aisle. base: one in-out-sine. motion: slow creep -> fast push -> settle (speed variation)."""
    e = EN()
    if not e: return ease(f / (A.shot - 1))
    if e not in ARC_P:
        v = [0.35 + 2.2 * e * math.exp(-((i / A.shot - 0.50) / 0.13) ** 2) for i in range(A.shot)]
        c = np.concatenate([[0], np.cumsum(v)]); ARC_P[e] = c / c[-1]
    return float(ARC_P[e][min(f, A.shot)])

def seg_level(f, i, start, step):
    """Segment-by-segment light-up with one dropout flicker; returns 0..1."""
    on = start + i * step; k = (f - on) / 6.0
    if k <= 0: return 0.0
    if 0.2 < k < 0.4 and hsh(i, 9) < 0.5: return 0.25
    return expo_out(k)

def scene_arcade(f, W, H):
    k = arcade_progress(f); ts = f / A.fps; e = EN()
    cx, cz = -0.92 + 0.85 * k, 0.0 + 4.2 * k
    cam = Cam((cx, 1.45 + 0.015 * math.sin(ts * 1.7), cz), (cx * 0.35 + 0.2, 1.32, cz + 8), 64, W, H)
    cv = Cv(W, H, np.zeros((H, W, 3)) + 4)
    P = cam.poly
    cv.poly(P([(-3.2, 0, 15.5), (3.2, 0, 15.5), (3.2, 3.1, 15.5), (-3.2, 3.1, 15.5)]), (30, 12, 52))
    cv.gpoly(P([(-3.2, 3.1, -1), (3.2, 3.1, -1), (3.2, 3.1, 15.5), (-3.2, 3.1, 15.5)]), [(0, (8, 4, 16)), (1, (26, 12, 46))])
    for x, c in ((-3.2, (22, 10, 42)), (3.2, (20, 10, 40))):
        cv.poly(P([(x, 0, -1), (x, 0, 15.5), (x, 3.1, 15.5), (x, 3.1, -1)]), c)
    cv.gpoly(P([(-3.2, 0, -1), (3.2, 0, -1), (3.2, 0, 15.5), (-3.2, 0, 15.5)]), [(0, (34, 16, 56)), (1, (10, 5, 20))])
    for x in np.arange(-3.2, 3.3, 0.8):
        a, b = cam.pt((x, 0.001, max(cz + 0.3, -1))), cam.pt((x, 0.001, 15.5))
        if a and b: cv.d.line([a[:2], b[:2]], fill=(36, 18, 58), width=1)
    for z in np.arange(0, 15.6, 0.8):
        a, b = cam.pt((-3.2, 0.001, z)), cam.pt((3.2, 0.001, z))
        if a and b: cv.d.line([a[:2], b[:2]], fill=(36, 18, 58), width=1)
    cabs = []
    for i in range(12): cabs.append(((-1.55, 0, 0.9 + i * 1.02), (1, 0, 0), (0, 0, 1), 0.86, i))
    for i in range(12): cabs.append(((1.55, 0, 1.4 + i * 1.02), (-1, 0, 0), (0, 0, 1), 0.86, i + 21))
    for i, x0 in enumerate((-1.9, -0.95, 0.0, 0.95)): cabs.append(((x0, 0, 13.9), (0, 0, -1), (1, 0, 0), 0.86, i + 42))
    strips = [((-0.95, 3.08), (130, 40, 255)), ((0.95, 3.08), (40, 230, 255))]
    NS = 16; zs = np.linspace(-1, 15.4, NS + 1)
    def lv(i, start, step):
        return 1.0 if not e else 0.12 + 0.88 * seg_level(f, i, start, step / e)
    def lights(cvx, mirror):
        mk, ek = (0.55, 0.4) if mirror else (1, 0.9)
        for si, ((x, y), c) in enumerate(strips):
            if not e:
                q = cam.poly([(x - 0.06, y, -1), (x + 0.06, y, -1), (x + 0.06, y, 15.4), (x - 0.06, y, 15.4)], mirror)
                cvx.poly(q, scale(c, mk), emit=scale(c, ek)); continue
            for i in range(NS):
                l = lv(i, 2 + si * 3, 2.6)
                q = cam.poly([(x - 0.06, y, zs[i] + 0.03), (x + 0.06, y, zs[i] + 0.03), (x + 0.06, y, zs[i + 1] - 0.03), (x - 0.06, y, zs[i + 1] - 0.03)], mirror)
                cvx.poly(q, scale(c, mk * l), emit=scale(c, ek * l * l))
        for wi, (x, c) in enumerate(((-3.18, MAG), (3.18, CYAN))):
            mk2, ek2 = (0.5, 0.35) if mirror else (1, 0.8)
            for i in range(NS if e else 1):
                l = lv(i, 34 + wi * 2, 2.2)
                z0, z1 = (zs[i], zs[i + 1]) if e else (-1, 15.4)
                q = cam.poly([(x, 2.36, z0), (x, 2.36, z1), (x, 2.42, z1), (x, 2.42, z0)], mirror)
                cvx.poly(q, scale(c, mk2 * l), emit=scale(c, ek2 * l * l))
        for j, z in enumerate((1.6, 4.6, 7.6, 10.6, 13.6)):
            l = 1.0 if not e else 0.15 + 0.85 * expo_out((f - 50 - j * 3) / 8)
            q = cam.poly(circle3d((0, 3.08, z), (1, 0, 0), (0, 0, 1), 0.17, 18), mirror)
            cvx.poly(q, scale(WARM, (0.6 if mirror else 1) * l), emit=scale(WARM, (0.5 if mirror else 1) * l))
    rf = Cv(W, H, np.zeros((H, W, 3)))
    lights(rf, True)
    for c in cabs: cabinet(rf, cam, *c, f, mirror=True)
    for z in (1.6, 4.6, 7.6, 10.6, 13.6):
        rf.poly(cam.poly(circle3d((0, 0.002, z), (1, 0, 0), (0, 0, 1), 1.0, 24)), (70, 34, 12))
    refl = np.asarray(rf.base.filter(ImageFilter.GaussianBlur(W / 500)), float) + np.asarray(rf.glow.filter(ImageFilter.GaussianBlur(W / 200)), float) * 0.6
    cv.add(refl, 0.85)
    lights(cv, False)
    p = cam.pt((0, 2.55, 15.45))
    sl = 1.0
    if e:                                     # sign: dark -> two flickers -> on, as the result of the push
        sl = 0.12 if f < 70 else (0.9 if f in (71, 72, 75) else (0.2 if f < 76 else 1.0))
    if p:
        fnt = font(0.5 * cam.F / p[2])
        cv.g.text((p[0], p[1]), "ARCADE", font=fnt, anchor='mm', fill=scale(MAG, 0.9 * sl), stroke_width=max(2, int(W / 300)), stroke_fill=scale(MAG, 0.9 * sl))
        cv.d.text((p[0], p[1]), "ARCADE", font=fnt, anchor='mm', fill=mix((40, 20, 50), (255, 170, 240), sl))
    cabs.sort(key=lambda c: -cam.depth([np.array(c[0]) + np.array(c[2]) * c[3] / 2 + np.array([0, 1, 0])]))
    for c in cabs: cabinet(cv, cam, *c, f)
    return cv

# ---------------------------------------------------------------- 03 NEON OBJECT
def scene_object(f, W, H):
    ts = f / A.fps; mv = A.shot - 30; k = ease(f / (mv - 1)) if f < mv else 1.0
    yaw = math.radians(-26 + 38 * k); R = 6.5
    cam = Cam((R * math.sin(yaw), 2.45, -R * math.cos(yaw)), (0, 1.3, 0), 40, W, H)
    cv = Cv(W, H, sky(W, H, [(0, (5, 3, 14)), (0.5, (22, 9, 44)), (0.62, (34, 12, 60)), (1, (8, 4, 16))], 11))
    P = cam.poly
    for i, x in enumerate(np.arange(-6, 6.1, 1.2)):
        c = MAG if i % 2 else CYAN
        for y0 in (0.3, 1.9, 3.3):
            hh = 1.1 * (0.6 + 0.4 * hsh(i, y0))
            cv.poly(P([(x - 0.03, y0, 7), (x + 0.03, y0, 7), (x + 0.03, y0 + hh, 7), (x - 0.03, y0 + hh, 7)]), scale(c, 0.35), emit=scale(c, 0.3))
    for i in range(14):
        p = cam.pt((-7 + 14 * hsh(i, 21), 0.5 + 4 * hsh(i, 22), 10))
        if p: cv.ellipse(p[0], p[1], 0.18 * cam.F / p[2], scale(WARM, 0.25 + 0.2 * hsh(i, 23)), emit=scale(WARM, 0.3))
    p = cam.pt((3.3, 3.2, 3.0))
    if p: cv.ellipse(p[0], p[1], 0.12 * cam.F / p[2], (255, 200, 140), emit=(255, 150, 70))
    cv.gpoly(P([(-30, 0, -8), (30, 0, -8), (30, 0, 30), (-30, 0, 30)]), [(0, (26, 10, 44)), (1, (6, 3, 12))])
    rf = Cv(W, H, np.zeros((H, W, 3)))
    rim = P(circle3d((0, 0.78, 0), (1, 0, 0), (0, 0, 1), 0.95, 64), True)
    if rim: rf.d.line(rim + [rim[0]], fill=(20, 110, 130), width=max(2, int(W / 300)))
    ring = P(circle3d((0, 1.62, 1.4), (1, 0, 0), (0, 1, 0), 1.3, 72), True)
    if ring: rf.d.line(ring + [ring[0]], fill=(90, 20, 80), width=max(2, int(W / 400)))
    cv.add(np.asarray(rf.base.filter(ImageFilter.GaussianBlur(W / 250)), float), 0.9)
    e = EN(); FP = 20                              # key press frame (motion mode)
    br = 0.85 + 0.15 * math.sin(ts * math.pi)
    pulses = (FP + 2, 66) if e else ()
    for fp in pulses:                                # floor pulse rings expanding from the plinth
        kk = (f - fp) / 22.0
        if 0 <= kk <= 1:
            rr = 0.95 + 2.6 * e * expo_out(kk); a = (1 - kk) ** 2
            q = P(circle3d((0, 0.003, 0), (1, 0, 0), (0, 0, 1), rr, 72))
            if q: cv.line(q + [q[0]], scale(CYAN, 0.8 * a), max(1, W / 500), emit=scale(CYAN, 0.9 * a))
            br += 0.9 * a
    ring = P(circle3d((0, 1.62, 1.4), (1, 0, 0), (0, 1, 0), 1.3, 96))
    if ring: cv.line(ring + [ring[0]], scale((230, 60, 200), br), max(2, W / 450), emit=scale((200, 40, 170), 0.8 * br))
    n = 64; top = circle3d((0, 0.78, 0), (1, 0, 0), (0, 0, 1), 0.95, n); bot = circle3d((0, 0, 0), (1, 0, 0), (0, 0, 1), 0.95, n)
    for i in range(n):
        j = (i + 1) % n; nn = (top[i] + top[j]) / 2 * np.array([1, 0, 1])
        qd = [bot[i], bot[j], top[j], top[i]]
        if cam.facing(qd, nn):
            lx = nn[0] / 0.95
            col = mix((22, 10, 40), (120, 55, 40), clamp(lx)) if lx > 0 else mix((22, 10, 40), (20, 60, 90), clamp(-lx))
            cv.poly(P(qd), col)
    tp = P(top); cv.poly(tp, (20, 11, 36))
    if tp: cv.line(tp + [tp[0]], (110, 240, 255), max(1, W / 600), emit=(30, 170, 210))
    bob = 0.05 * math.sin(ts * 2.2) * (1 - k)
    C = np.array([0, 1.62 + bob, 0]); hx, hy, hz = 0.75, 0.5, 0.21
    cv.poly(P(circle3d((0, 0.781, 0), (1, 0, 0), (0, 0, 1), 0.62, 32)), (9, 5, 18))
    # small pose change: yaw -9 -> +5 deg and a press "nod" (roll), settling to 0 motion before the hold
    yo = math.radians((-9 + 14 * k) * e) if e else 0.0
    ro = math.radians(2.5 * e * bump(f, FP - 1, FP + 3, FP + 18)) if e else 0.0
    cy_, sy_, cr, sr = math.cos(yo), math.sin(yo), math.cos(ro), math.sin(ro)
    Rm = np.array([[cy_, 0, sy_], [0, 1, 0], [-sy_, 0, cy_]]) @ np.array([[cr, -sr, 0], [sr, cr, 0], [0, 0, 1]])
    RV = lambda v: Rm @ np.array(v, float)
    V = lambda x, y, z: C + RV([x, y, z])
    faces = {
        'left':  ([V(-hx, -hy, hz), V(-hx, -hy, -hz), V(-hx, hy, -hz), V(-hx, hy, hz)], RV((-1, 0, 0))),
        'right': ([V(hx, -hy, -hz), V(hx, -hy, hz), V(hx, hy, hz), V(hx, hy, -hz)], RV((1, 0, 0))),
        'top':   ([V(-hx, hy, -hz), V(hx, hy, -hz), V(hx, hy, hz), V(-hx, hy, hz)], RV((0, 1, 0))),
        'front': ([V(-hx, -hy, -hz), V(hx, -hy, -hz), V(hx, hy, -hz), V(-hx, hy, -hz)], RV((0, 0, -1))),
    }
    if e:   # reel angle: still until the key press, then spin-up (eased angular velocity)
        om = [0.0 if i < FP + 2 else 5.5 * ease((i - FP - 2) / 14) for i in range(f + 1)]
        rang = sum(om) / A.fps
    else:
        rang = ts * 1.6
    sw = (f - 48) / 30
    for name in ('left', 'right', 'top', 'front'):
        pts, nrm = faces[name]
        if not cam.facing(pts, nrm): continue
        q = P(pts)
        if name == 'front':
            cv.gpoly(q, [(0, (240, 236, 255)), (0.2, (175, 175, 232)), (0.46, (62, 60, 140)), (0.5, (28, 24, 78)), (0.72, (190, 75, 165)), (1, (70, 28, 84))],
                     sweep=(-0.3 + 1.6 * sw, 0.09, 0.9) if 0 <= sw <= 1 else None)
        elif name == 'right':
            cv.gpoly(q, [(0, (255, 170, 100)), (0.5, (170, 70, 90)), (1, (50, 18, 60))])
        elif name == 'left':
            cv.gpoly(q, [(0, (60, 190, 230)), (0.5, (40, 60, 120)), (1, (14, 12, 40))])
        else:
            cv.gpoly(q, [(0, (90, 80, 140)), (1, (40, 34, 80))])
        if q: cv.line(q + [q[0]], (235, 225, 255), max(1, W / 1000), emit=(90, 70, 110))
    if cam.facing(faces['front'][0], faces['front'][1]):
        F0 = V(-hx, -hy, -hz - 0.004); du, dv = RV([2 * hx, 0, 0]), RV([0, 2 * hy, 0]); ZB = RV([0, 0, 1])
        fq = lambda u0, v0, u1, v1, d=0.0: P(quad(F0 - ZB * d, du, dv, u0, v0, u1, v1))
        cv.poly(fq(0.06, 0.22, 0.64, 0.84), (190, 190, 230))
        cv.poly(fq(0.08, 0.25, 0.62, 0.81, 0.002), (26, 18, 54))
        cv.gpoly(fq(0.11, 0.66, 0.59, 0.75, 0.003), [(0, (255, 170, 80)), (1, (255, 70, 140))], direction=(1, 0))
        cv.poly(fq(0.20, 0.38, 0.50, 0.52, 0.003), (70, 40, 40))
        for u in (0.22, 0.48):
            ctr = F0 + du * u + dv * 0.45 - ZB * 0.004; AX, AY = RV((1, 0, 0)), RV((0, 1, 0))
            cv.poly(P(circle3d(ctr, AX, AY, 0.085, 24)), (235, 232, 245))
            cv.poly(P(circle3d(ctr - ZB * 0.001, AX, AY, 0.04, 16)), (30, 24, 50))
            for t in range(6):
                a = t / 6 * 2 * math.pi + rang
                p1 = cam.pt(ctr + AX * math.cos(a) * 0.04 + AY * math.sin(a) * 0.04 - ZB * 0.002)
                p2 = cam.pt(ctr + AX * math.cos(a) * 0.065 + AY * math.sin(a) * 0.065 - ZB * 0.002)
                if p1 and p2: cv.d.line([p1[:2], p2[:2]], fill=(120, 110, 150), width=max(1, int(W / 900)))
        for r in range(9):
            for c in range(6):
                p = cam.pt(F0 + du * (0.71 + c * 0.04) + dv * (0.20 + r * 0.05) - ZB * 0.003)
                if p: cv.d.ellipse([p[0] - W / 900, p[1] - W / 900, p[0] + W / 900, p[1] + W / 900], fill=(30, 22, 56))
        cv.poly(fq(0.70, 0.74, 0.93, 0.78, 0.003), (40, 30, 70))
        cv.poly(fq(0.792, 0.73, 0.832, 0.79, 0.004), (230, 230, 250))
        led = cam.pt(F0 + du * 0.90 + dv * 0.88 - ZB * 0.004)
        lon = 1.0 if (not e or f >= FP + 2) else 0.15
        if led: cv.ellipse(led[0], led[1], max(1.5, 0.018 * cam.F / led[2]), scale((255, 60, 110), lon), emit=scale((255, 40, 90), lon))
        cv.poly(fq(0.0, 0.06, 1.0, 0.09, 0.002), (220, 210, 255), emit=(60, 40, 90))
    if cam.facing(faces['right'][0], faces['right'][1]):
        ctr = V(hx + 0.004, -0.05, 0.0); BZ, BY, BX = RV((0, 0, 1)), RV((0, 1, 0)), RV((1, 0, 0))
        cv.poly(P(circle3d(ctr, BZ, BY, 0.14, 28)), (40, 30, 60), outline=(255, 190, 120), ow=1)
        for t in range(12):
            a = t / 12 * 2 * math.pi + (0.6 * ease((f - FP - 30) / 20) if e else 0)   # volume wheel nudged up
            p1 = cam.pt(ctr + BY * math.sin(a) * 0.09 + BZ * math.cos(a) * 0.09); p2 = cam.pt(ctr + BX * 0.002 + BY * math.sin(a) * 0.14 + BZ * math.cos(a) * 0.14)
            if p1 and p2: cv.d.line([p1[:2], p2[:2]], fill=(150, 110, 120), width=1)
    if cam.facing(faces['left'][0], faces['left'][1]):
        cv.poly(P(circle3d(V(-hx - 0.004, 0.25, 0.0), RV((0, 0, 1)), RV((0, 1, 0)), 0.045, 18)), (8, 6, 14), outline=CYAN, ow=1, oemit=scale(CYAN, 0.6))
    def key_h(i):
        if i != 1: return 0.075
        if not e: return 0.04
        return 0.075 - 0.035 * ease((f - FP) / 3)                      # PLAY key press and latch
    keys = [(-0.66 + i * 0.17, key_h(i), i) for i in range(5)]
    keys.sort(key=lambda kk: -cam.depth([V(kk[0] + 0.075, hy, 0)]))
    sidex = 0.15 if (not e and yaw > 0) or (e and cam.facing([V(0, hy, 0)], RV((1, 0, 0)))) else 0
    for x0, hgt, i in keys:
        z0, z1, y0 = -hz + 0.02, 0.08, hy; xs = x0 + sidex
        kt = [V(x0, y0 + hgt, z0), V(x0 + 0.15, y0 + hgt, z0), V(x0 + 0.15, y0 + hgt, z1), V(x0, y0 + hgt, z1)]
        kf = [V(x0, y0, z0), V(x0 + 0.15, y0, z0), V(x0 + 0.15, y0 + hgt, z0), V(x0, y0 + hgt, z0)]
        ks = [V(xs, y0, z0), V(xs, y0, z1), V(xs, y0 + hgt, z1), V(xs, y0 + hgt, z0)]
        cv.poly(P(ks), (90, 80, 130)); cv.poly(P(kf), (255, 70, 100) if i == 0 else (150, 145, 200), emit=(120, 20, 40) if i == 0 else None)
        cv.gpoly(P(kt), [(0, (245, 240, 255)), (1, (140, 140, 190))])
    if e:   # 4-point star glint on the chrome corner as the sweep exits
        sk = bump(f, 74, 79, 88)
        p = cam.pt(V(hx - 0.02, hy - 0.02, -hz - 0.01))
        if p and sk > 0:
            L = 0.32 * cam.F / p[2] * sk; w = max(1, W / 700)
            for dx, dy, l in ((1, 0, L), (0, 1, L * 0.8), (0.7, 0.7, L * 0.35), (0.7, -0.7, L * 0.35)):
                cv.line([(p[0] - dx * l, p[1] - dy * l), (p[0] + dx * l, p[1] + dy * l)], (255, 250, 255), w, emit=(255, 230, 255), gw=w * 2)
    return cv

SCENES = [(scene_coast, "01  COASTLINE DRIVE"), (scene_arcade, "02  ARCADE AFTER DARK"), (scene_object, "03  NEON OBJECT")]

def render(f):
    W, H, ss = A.width, A.height, A.ss
    si = min(2, f // A.shot); lf = f - si * A.shot
    fn, label = SCENES[si]
    cv = fn(lf, W * ss, H * ss)
    if A.look == 'film' and A.weave:   # gate weave: smooth drift applied BEFORE downsampling (no softening);
        s = H / 720 * ss                # with --ss 1 it is rounded to whole pixels for the same reason
        dx = s * (0.45 * math.sin(f * 0.41 + 1.3) + 0.25 * math.sin(f * 1.07)); dy = s * (0.35 * math.sin(f * 0.29) + 0.2 * math.sin(f * 0.93 + 2.0))
        if ss == 1: dx, dy = round(dx), round(dy)
        cv.base = cv.base.transform(cv.base.size, Image.AFFINE, (1, 0, dx, 0, 1, dy), resample=Image.BILINEAR, fillcolor=(8, 4, 14))
    base = np.asarray(cv.base.resize((W, H), Image.LANCZOS), float)
    glow = cv.glow.resize((W, H), Image.BILINEAR)
    g1 = np.asarray(glow.filter(ImageFilter.GaussianBlur(W / 900)), float)
    g2 = np.asarray(glow.filter(ImageFilter.GaussianBlur(W / 95)), float)
    out = base + g1 * 0.8 + g2 * A.bloom
    film = A.look == 'film'
    if film and A.halation > 0:                      # halation: red-orange bloom around the brightest cores only
        lum = out.mean(2); hm = Image.fromarray(np.clip((lum - 185) * 3.5, 0, 255).astype(np.uint8))
        hb = np.asarray(hm.filter(ImageFilter.GaussianBlur(W / 110)), float) / 255
        out += hb[..., None] * np.array([255, 70, 45]) * 0.55 * A.halation
    yv, xv = np.mgrid[0:H, 0:W]; q = (xv / W - .5) ** 2 + (yv / H - .5) ** 2
    out *= (1 - q * 0.7)[..., None]
    if film:
        out = out * 0.965 + np.array([9, 5, 15])                     # lifted, violet-tinted blacks
        kn = 215.0; hi = out > kn                                    # soft highlight shoulder (neon core stays ~240)
        out[hi] = kn + (out[hi] - kn) / (1 + (out[hi] - kn) / 60.0)
        if A.flicker: out *= 1 + 0.014 * (hsh(f, 31) - 0.5) * 2
    gl = A.grain if A.grain != 'auto' else ('standard' if film else 'off')
    if gl == 'off':
        out += np.random.default_rng(A.seed * 1000 + f).normal(0, 1.6, out.shape)   # v0.1 fine noise (near-invisible)
    else:
        out = film_grain(out, f, W, H, gl)
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    if A.chroma or A.scanlines:                       # video/CRT artefacts: independent of film grain
        arr = np.asarray(img, float)
        if A.chroma:
            c = int(A.chroma); arr = arr.copy(); arr[:, :, 0] = np.roll(arr[:, :, 0], c, 1); arr[:, :, 2] = np.roll(arr[:, :, 2], -c, 1)
        if A.scanlines: arr[::2] *= 0.9
        img = Image.fromarray(arr.clip(0, 255).astype(np.uint8))
    if A.labels:
        d = ImageDraw.Draw(img); fs = H * 0.024; x0, y0 = W * 0.03, H * 0.93
        d.rectangle([x0, y0 - fs * 0.55, x0 + fs * 0.18, y0 + fs * 0.55], fill=(255, 43, 214))
        d.text((x0 + fs * 0.6, y0), label, font=font(fs), anchor='lm', fill=(205, 196, 225))
    if A.tag:
        d = ImageDraw.Draw(img); fs = H * 0.036
        d.text((W * 0.03, H * 0.06), A.tag, font=font(fs), anchor='lm', fill=(245, 240, 255), stroke_width=max(1, int(H / 360)), stroke_fill=(10, 5, 20))
    return np.asarray(img).tobytes()

def film_grain(out, f, W, H, level):
    """Per-frame seeded, luminance-weighted, slightly clumped grain; size follows output height so it survives
    downscaling/compression. Strongest in midtones, lighter in deep blacks, near-zero on neon hard cores."""
    amp = {'low': 5.0, 'standard': 8.0, 'strong': 12.0}[level]
    g = max(1.0, H / 720 * 1.35); h2, w2 = int(H / g) + 2, int(W / g) + 2
    rng = np.random.default_rng(A.seed * 7919 + f * 131 + 17)
    up = lambda a: np.asarray(Image.fromarray(a.astype(np.float32), mode='F').resize((W, H), Image.BILINEAR), float)
    n = up(rng.normal(0, 1, (h2, w2))) / 0.62
    nc = np.stack([up(rng.normal(0, 1, (h2, w2))) for _ in range(3)], -1) * 0.18 / 0.62
    L = (out.mean(2) / 255).clip(0, 1)
    wgt = (0.45 + 0.55 * np.sqrt(np.clip(4 * L * (1 - L), 0, 1))) * (1 - np.clip((L - 0.9) / 0.1, 0, 1) * 0.8)
    return out + amp * wgt[..., None] * (n[..., None] + nc)

def init(a):
    global A; A = a

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', default='synthwave_scenes.mp4')
    ap.add_argument('--width', type=int, default=1280); ap.add_argument('--height', type=int, default=720)
    ap.add_argument('--fps', type=int, default=30); ap.add_argument('--shot', type=int, default=120, help='frames per scene')
    ap.add_argument('--ss', type=int, default=2, help='supersampling factor')
    ap.add_argument('--bloom', type=float, default=0.55); ap.add_argument('--seed', type=int, default=1986)
    ap.add_argument('--no-labels', dest='labels', action='store_false')
    ap.add_argument('--frames', type=str, default=None, help='comma list: write PNG stills instead of video')
    ap.add_argument('--jobs', type=int, default=max(1, (os.cpu_count() or 2) - 1))
    ap.add_argument('--ffmpeg', default='ffmpeg')
    ap.add_argument('--motion', default='base', choices=['base', 'standard', 'high'], help='base = v0.1 motion')
    ap.add_argument('--look', default='clean', choices=['clean', 'film'])
    ap.add_argument('--grain', default='auto', choices=['auto', 'off', 'low', 'standard', 'strong'], help='auto: standard with --look film, else off')
    ap.add_argument('--halation', type=float, default=0.6); ap.add_argument('--weave', action='store_true'); ap.add_argument('--flicker', action='store_true')
    ap.add_argument('--chroma', type=int, default=0, help='VHS chroma offset px (video artefact, not film)')
    ap.add_argument('--scanlines', action='store_true', help='CRT scanlines (video artefact, not film)')
    ap.add_argument('--range', default=None, help='video frame range start:end, e.g. 0:120 (coast) 240:360 (object)')
    ap.add_argument('--tag', default='', help='optional top-left English tag, e.g. ORIGINAL / RETRO MOTION')
    a = ap.parse_args(); init(a)
    if a.frames:
        stem = os.path.splitext(a.out)[0]
        for f in [int(x) for x in a.frames.split(',')]:
            Image.frombytes('RGB', (a.width, a.height), render(f)).save(f'{stem}_f{f:03d}.png')
        print('stills written'); return
    N = a.shot * 3; r0, r1 = (int(x) for x in a.range.split(':')) if a.range else (0, N)
    cmd = [a.ffmpeg, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{a.width}x{a.height}', '-r', str(a.fps), '-i', '-',
           '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17'] + (['-tune', 'grain', '-crf', '15'] if a.look == 'film' else []) + [ '-movflags', '+faststart', a.out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(a.jobs, initializer=init, initargs=(a,)) as pool:
        for i, fr in enumerate(pool.imap(render, range(r0, r1), chunksize=2)):
            p.stdin.write(fr)
            if i % 30 == 0: print('frame', i, '/', r1 - r0, flush=True)
    p.stdin.close(); p.wait(); print('wrote', a.out, r1 - r0, 'frames')

if __name__ == '__main__':
    main()
