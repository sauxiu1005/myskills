#!/usr/bin/env python3
"""Code-rendered motion-graphics promo engine (Python + Skia + FFmpeg).
Commands: validate | palette | styles | stills | render | analyze-audio   (see SKILL.md)"""
import argparse, json, math, os, random, shutil, subprocess, sys, tempfile, time
from multiprocessing import Pool
import numpy as np, skia
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mgfx_core import *
from mgfx_scenes import SCENES, REQUIRED, scene_events, stagger, path_pts
import mgfx_recipes, mgfx_chapters, mgfx_portfolio, mgfx_ignite, mgfx_ideaform, mgfx_typeform, mgfx_reelcraft
import mgfx_audio

def ffmpeg_bin():
    try:
        import imageio_ffmpeg; return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        p = shutil.which('ffmpeg')
        if not p: sys.exit('FFmpeg not found: pip install imageio-ffmpeg')
        return p

# ---------------- overlays ----------------
def hud(ctx, c, t, fi, sc):
    h = ctx.spec.get('hud', {}); rd = mgfx_chapters.RECIPE_DEFAULTS.get(ctx.spec.get('recipe'), {})
    mode = h.get('mode') or rd.get('hud_mode') or ctx.st['hud']
    if not h.get('enabled', rd.get('hud', True)) or sc['type'] in ('end_card', 'dot_lockup', 'decode_lockup', 'object_lockup', 'grid_recap', 'arc_lockup', 'caret_lockup', 'converge_lockup'): return
    if sc['type'] == 'rapid_cuts':
        D = sc['dur']; n = len(sc['words']); k = min(int((t - sc['t0']) / (D / n)), n - 1)
        roles = sc.get('bgs') or ['a3', 'a2', 'a1', 'light', 'dark']; bg, fg, acc, _ = ctx.colors(dict(bg=roles[k % len(roles)]))
    else: bg, fg, acc, _ = ctx.colors(sc)
    U = ctx.U; W, H = ctx.W, ctx.H; m = 48 * U; a = 0.85; T = ctx.T(19, 'mono')
    label = ctx.up(h.get('label', ctx.spec.get('meta', {}).get('brand', '')))
    secs = int(t); ff = fi % ctx.fps
    if mode == 'reel':
        pp = P(fg, 0.75, 2 * U, cap=False)
        for x, y, sx, sy in [(m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)]:
            c.drawLine(x, y, x + 24 * U * sx, y, pp); c.drawLine(x, y, x, y + 24 * U * sy, pp)
        T.draw(c, label, m + 36 * U, m + 24 * U, P(fg, 0.8), 'l')
        T.draw(c, f'{sc["i"] + 1:02d} - {ctx.up(sc.get("name", sc["type"]))}', W - m - 36 * U, m + 24 * U, P(fg, 0.85), 'r')
        T.draw(c, f'00:00:{secs:02d}:{ff:02d}', m + 36 * U, H - m - 12 * U, P(fg, 0.75), 'l')
        T.draw(c, f'{ctx.W}x{ctx.H}  {ctx.fps}P  REC', W - m - 60 * U, H - m - 12 * U, P(fg, 0.75), 'r')
        if (fi // 15) % 2 == 0: c.drawCircle(W - m - 44 * U, H - m - 19 * U, 6 * U, P(ctx.pal['a1']))
        sw = W * 0.24; x0 = ctx.cx - sw / 2; yb = H - m - 18 * U
        for k in range(25): c.drawLine(x0 + sw * k / 24, yb - (8 if k % 6 == 0 else 4) * U, x0 + sw * k / 24, yb, P(fg, 0.4, 1.5 * U))
        c.drawRect(skia.Rect(x0 + sw * t / ctx.duration - 3 * U, yb - 14 * U, x0 + sw * t / ctx.duration + 3 * U, yb + 4 * U), P(fg, 0.9))
        return
    if mode == 'pages':
        n = len(ctx.scenes); T.draw(c, label, m, m + 10 * U, P(fg, 0.7), 'l')
        T.draw(c, f'{sc["i"] + 1:02d} — {n:02d}', W - m, m + 10 * U, P(fg, 0.85), 'r')
        c.drawRect(skia.Rect(m, H - m, W - m, H - m + 2 * U), P(fg, 0.15)); c.drawRect(skia.Rect(m, H - m, m + (W - 2 * m) * t / ctx.duration, H - m + 2 * U), P(fg, 0.8))
        return
    if mode == 'chapter':
        pp = P(fg, 0.7, 2 * U, cap=False)
        for x, y, sx, sy in [(m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)]:
            c.drawLine(x, y, x + 22 * U * sx, y, pp); c.drawLine(x, y, x, y + 22 * U * sy, pp)
        T.draw(c, label, m + 36 * U, m + 24 * U, P(fg, 0.7), 'l')
        T.draw(c, f'{ctx.bpm:.2f} BPM', W - m - 36 * U, m + 24 * U, P(fg, 0.7), 'r')
        T.draw(c, f'{sc["i"]:02d} - {ctx.up(sc.get("name", sc["type"]))}', m + 36 * U, H - m - 12 * U, P(fg, 0.85), 'l')
        T.draw(c, f'{fi:03d} / {ctx.N:03d}', W - m - 36 * U, H - m - 12 * U, P(fg, 0.7), 'r')
        return
    if mode in ('frame', 'tech'):
        pp = P(fg, a, 2 * U, cap=False)
        for x, y, sx, sy in [(m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)]:
            c.drawLine(x, y, x + 28 * U * sx, y, pp); c.drawLine(x, y, x, y + 28 * U * sy, pp)
        T.draw(c, label, m + 44 * U, m + 26 * U, P(fg, a), 'l')
        T.draw(c, f'TC 00:00:{secs:02d}:{ff:02d}', W - m - 44 * U, m + 26 * U, P(fg, a), 'r')
        T.draw(c, f'{sc["i"] + 1:02d}/{len(ctx.scenes):02d}  {ctx.up(sc.get("name", sc["type"]))}', m + 44 * U, H - m - 14 * U, P(fg, a), 'l')
        bw = 220 * U; x1 = W - m - 44 * U
        c.drawRect(skia.Rect(x1 - bw, H - m - 24 * U, x1, H - m - 20 * U), P(fg, a * 0.3))
        c.drawRect(skia.Rect(x1 - bw, H - m - 24 * U, x1 - bw + bw * t / ctx.duration, H - m - 20 * U), P(fg, a))
        if (fi // 20) % 2 == 0: c.drawCircle(x1 - bw - 16 * U, H - m - 22 * U, 5 * U, P(acc, a))
        if mode == 'tech':
            c.drawLine(ctx.cx - 20 * U, ctx.cy, ctx.cx - 8 * U, ctx.cy, P(fg, 0.5, 1.5 * U)); c.drawLine(ctx.cx + 8 * U, ctx.cy, ctx.cx + 20 * U, ctx.cy, P(fg, 0.5, 1.5 * U))
            rng = random.Random(fi // 6)
            for i in range(4):
                T.draw(c, f'{rng.choice(["SYS", "VEC", "RND", "GPU"])}.{rng.randint(100, 999)}  {rng.random():.3f}', m + 44 * U, m + 70 * U + i * 26 * U, P(fg, 0.4), 'l')
    elif mode == 'grid':
        for i in range(1, 12):
            x = W * i / 12; c.drawLine(x, 0, x, H, P(fg, 0.05, 1))
        T.draw(c, label, m, m + 10 * U, P(fg, a), 'l'); T.draw(c, f'{sc["i"] + 1:02d} — {ctx.up(sc.get("name", ""))}', W - m, m + 10 * U, P(fg, a), 'r')
        c.drawRect(skia.Rect(m, H - m, m + (W - 2 * m) * t / ctx.duration, H - m + 3 * U), P(fg, a))
    elif mode == 'dots':
        n = len(ctx.scenes); gap = 22 * U; x0 = ctx.cx - gap * (n - 1) / 2
        for i in range(n): c.drawCircle(x0 + i * gap, H - m, (7 if i == sc['i'] else 4) * U, P(fg, 0.9 if i == sc['i'] else 0.35))

def cover_color(ctx, a, b):
    used = {a.get('bg'), b.get('bg')}
    for r in ('a1', 'a2', 'a3', 'light', 'dark'):
        if r not in used: return ctx.pal[r]
    return ctx.pal['a1']

TRANSITIONS = ['cut', 'scan_glitch', 'wipe', 'slide', 'circle', 'glitch', 'bolt', 'speed_lines', 'shutter', 'whip', 'zoom', 'iris', 'blinds']
BOLT = [(0.18, -1.0), (-0.42, 0.12), (-0.04, 0.12), (-0.22, 1.0), (0.44, -0.16), (0.06, -0.16)]

def trans_window(ctx, t, i):
    """(phase, progress, scene_a, scene_b): phase 1 = end of scene i, -1 = start of scene i. Kind comes from the incoming scene."""
    Tt = min(0.25, ctx.beat / 2); sc = ctx.scenes[i]
    if i + 1 < len(ctx.scenes) and t >= sc['t1'] - Tt: return (1, prog(t, sc['t1'] - Tt, sc['t1']), sc, ctx.scenes[i + 1])
    if i > 0 and t < sc['t0'] + Tt: return (-1, prog(t, sc['t0'], sc['t0'] + Tt), ctx.scenes[i - 1], sc)
    return None

def trans_kind(ctx, b):
    if b.get('transition'): return b['transition']
    a = ctx.scenes[b['i'] - 1] if b['i'] > 0 else None
    if ctx.spec.get('recipe') or (a and a['type'] in mgfx_chapters.SELF_EXIT): return 'cut'
    return ctx.st['trans']

def trans_pre(ctx, c, t, i):
    """Camera moves applied to the scene content before drawing (whip, zoom)."""
    w = trans_window(ctx, t, i)
    if not w: return
    ph, p, a, b = w; kind = trans_kind(ctx, b)
    if kind == 'whip':
        dx = -ctx.W * 1.1 * eie(p) if ph > 0 else ctx.W * 1.1 * (1 - eoe(p)); c.translate(dx, 0)
    elif kind == 'zoom':
        s = 1 + 4 * eie(p) if ph > 0 else lerp(0.45, 1, eoe(p))
        c.translate(ctx.cx, ctx.cy); c.scale(s, s); c.translate(-ctx.cx, -ctx.cy)

def transition(ctx, c, t, i):
    """Cover grows over the end of scene i and recedes at the start of scene i+1."""
    out = trans_window(ctx, t, i)
    if not out: return 0.0
    ph, p, a, b = out; kind = trans_kind(ctx, b)
    if kind == 'cut': return 0.0
    if kind == 'iris':  # match transition: the next scene already plays inside a circle growing from a point of this one
        if ph < 0: return 0.0
        fx, fy = b.get('iris_at') or [0.84, 0.52]; ox, oy = ctx.W * fx, ctx.H * fy
        r = eioe(p) * math.hypot(max(ox, ctx.W - ox), max(oy, ctx.H - oy)) * 1.02
        if r > 1:
            c.save(); pth = skia.Path(); pth.addCircle(ox, oy, r); c.clipPath(pth, doAntiAlias=True)
            SCENES[b['type']](ctx, c, b, 0.0); c.restore(); c.drawCircle(ox, oy, r, P(ctx.colors(a)[2], 1, 10 * ctx.U))
        return 0.0
    if kind == 'blinds':  # interleaved bars close from alternating sides, then open the other way
        colr = cover_color(ctx, a, b); W, H = ctx.W, ctx.H; n = 8
        for k in range(n):
            e = eioe(clamp(p * 1.15 - k * 0.015)); y0 = k * H / n; d = 1 if k % 2 else -1
            if ph > 0: x0 = -W + e * W if d > 0 else W - e * W
            else: x0 = e * W if d > 0 else -e * W
            c.drawRect(skia.Rect(x0, y0, x0 + W, y0 + H / n + 1), P(colr))
        return 0.0
    if kind == 'scan_glitch':
        U = ctx.U; W, H = ctx.W, ctx.H; k = p if ph > 0 else 1 - p; k = clamp(k * 1.4)
        if k <= 0: return 0.0
        rng = random.Random(int(t * ctx.fps)); bc = ctx.pal['a3']
        c.drawRect(skia.Rect(0, 0, W, H), P(bc, 0.85 * k))
        s = ctx.up(b.get('name') or b.get('title') or ''); T = Text(ctx, 260 * U)
        if s:
            c.save(); c.translate(ctx.cx, ctx.cy); c.scale(1 + 1.5 * k, 1); c.translate(-ctx.cx, -ctx.cy)
            for dx, cl in ((-22, (255, 40, 60)), (22, (40, 230, 255)), (0, (255, 255, 255))): T.draw_mid(c, s, ctx.cx + dx * U * k, ctx.cy, P(cl, 0.8 * k))
            c.restore()
        for _ in range(int(14 * k)):
            y = rng.uniform(0, H); c.drawRect(skia.Rect(0, y, W, y + rng.uniform(2, 10) * U), P((255, 255, 255), 0.5 * k))
        if ph < 0: c.drawRect(skia.Rect(0, 0, W, H), P((0, 0, 0), 0.6 * (1 - p)))
        return k
    colr = cover_color(ctx, a, b); W, H = ctx.W, ctx.H; Lg = math.hypot(W, H); U = ctx.U
    bacc = ctx.colors(b)[2]
    if kind == 'glitch': return (1 - p) if ph < 0 else p
    e = eioe(p)
    if kind == 'wipe':
        c.save(); c.translate(ctx.cx, ctx.cy); c.rotate(-20)
        x0, x1 = (-Lg, lerp(-Lg, Lg, e)) if ph > 0 else (lerp(-Lg, Lg, e), Lg)
        c.drawRect(skia.Rect(x0, -Lg, x1, Lg), P(colr))
        edge = x1 if ph > 0 else x0; c.drawRect(skia.Rect(edge, -Lg, edge + 40 * U, Lg), P(bacc)); c.restore()
    elif kind == 'slide':
        n = 5
        for k in range(n):
            q = eioe(clamp(p * 1.4 - k * 0.1)); x0 = W * k / n
            if ph > 0: c.drawRect(skia.Rect(x0, H * (1 - q), x0 + W / n + 1, H), P(colr))
            else: c.drawRect(skia.Rect(x0, 0, x0 + W / n + 1, H * (1 - q)), P(colr))
    elif kind == 'circle':
        if ph > 0: c.drawCircle(ctx.cx, ctx.cy, Lg / 2 * e, P(colr))
        else:
            pth = skia.Path(); pth.addRect(skia.Rect(-10, -10, W + 10, H + 10)); pth.addCircle(ctx.cx, ctx.cy, Lg / 2 * e)
            pth.setFillType(skia.PathFillType.kEvenOdd); c.drawPath(pth, P(colr))
    elif kind == 'bolt':
        def bolt(scale):
            return path_pts([(ctx.cx + x * scale, ctx.cy + y * scale) for x, y in BOLT])
        c.save(); c.translate(ctx.cx, ctx.cy); c.rotate(10); c.translate(-ctx.cx, -ctx.cy)
        if ph > 0:
            c.drawPath(bolt(Lg * 5.5 * clamp(p * 1.08) ** 3), P(bacc)); c.drawPath(bolt(Lg * 5 * p ** 3), P(colr))
        else:
            q = p ** 2.2; pth = bolt(Lg * 5 * q); pth.addRect(skia.Rect(-W, -H, 2 * W, 2 * H)); pth.setFillType(skia.PathFillType.kEvenOdd)
            c.drawPath(pth, P(colr)); c.drawPath(bolt(Lg * 5 * q), P(bacc, 1, 14 * U))
        c.restore()
    elif kind == 'speed_lines':
        n = 16; rng = random.Random(sc_seed(a)); rh = H / n
        for k in range(n):
            d = rng.uniform(0, 0.4); q = eioe(clamp((p - d) / 0.6)); y0 = k * rh; cc = bacc if k % 4 == 1 else colr
            if ph > 0:
                x1 = (W + 60 * U) * q; c.drawRect(skia.Rect(-10, y0, x1, y0 + rh + 1), P(cc))
                if 0 < q < 1: c.drawRect(skia.Rect(x1, y0 + rh * 0.4, x1 + 160 * U, y0 + rh * 0.6), P(bacc))
            else:
                x0 = W * q; c.drawRect(skia.Rect(x0, y0, W + 10, y0 + rh + 1), P(cc))
                if 0 < q < 1: c.drawRect(skia.Rect(x0 - 160 * U, y0 + rh * 0.4, x0, y0 + rh * 0.6), P(bacc))
    elif kind == 'shutter':
        if ph > 0:
            h2 = H / 2 * e; c.drawRect(skia.Rect(0, 0, W, h2), P(colr)); c.drawRect(skia.Rect(0, H - h2, W, H), P(colr))
            c.drawRect(skia.Rect(0, h2 - 8 * U, W, h2), P(bacc)); c.drawRect(skia.Rect(0, H - h2, W, H - h2 + 8 * U), P(bacc))
        else:
            w2 = W / 2 * (1 - e); c.drawRect(skia.Rect(0, 0, w2, H), P(colr)); c.drawRect(skia.Rect(W - w2, 0, W, H), P(colr))
            c.drawRect(skia.Rect(w2 - 10 * U, 0, w2, H), P(bacc)); c.drawRect(skia.Rect(W - w2, 0, W - w2 + 10 * U, H), P(bacc))
    elif kind == 'whip':
        k = p ** 1.6 if ph > 0 else (1 - p) ** 1.6
        c.drawRect(skia.Rect(0, 0, W, H), P(colr, clamp(k * 1.3) ** 1.4)); rng = random.Random(sc_seed(a) + 5)
        for j in range(26):
            y = rng.uniform(0, H); th = rng.uniform(3, 22) * U; ln = rng.uniform(0.3, 0.9) * W; x = rng.uniform(-0.3, 1.0) * W
            c.drawRect(skia.Rect(x, y, x + ln, y + th), P(bacc if j % 3 == 0 else ctx.colors(b)[1], 0.7 * math.sin(PI * min(1, k * 1.3))))
    elif kind == 'zoom':
        k = p ** 2 if ph > 0 else (1 - p) ** 2
        rng = random.Random(sc_seed(a) + 9)
        for j in range(48):
            ang = rng.uniform(0, 2 * PI); r0 = rng.uniform(0.15, 0.45) * Lg * (1 - k * 0.5); r1 = r0 + rng.uniform(0.2, 0.6) * Lg * k
            c.drawLine(ctx.cx + r0 * math.cos(ang), ctx.cy + r0 * math.sin(ang), ctx.cx + r1 * math.cos(ang), ctx.cy + r1 * math.sin(ang),
                       P(bacc if j % 3 == 0 else colr, min(1, k * 1.6), rng.uniform(3, 12) * U))
        c.drawRect(skia.Rect(0, 0, W, H), P(colr, clamp(k * 1.3) ** 1.5))
    return 0.0

def sc_seed(sc): return sc['i'] * 131 + 17

def build_events(ctx):
    ev = []; big = {0, len(ctx.scenes) - 1}
    for sc in ctx.scenes:
        ev.append((sc['t0'], 'bigcut' if (sc['i'] in big or sc.get('big')) else 'cut'))
        ev += [(sc['t0'] + x, 'hit') for x in scene_events(sc)]
        if sc['type'] == 'end_card' and sc.get('subtitle'):
            n = len(sc['subtitle']); dur = min(sc['dur'] - 0.3, 0.65 + 0.03 * n) - 0.65
            ev += [(sc['t0'] + 0.65 + dur * k / n, 'type') for k in range(n)]
    return sorted(ev)

def hit_amt(ctx, events, t):
    v = 0.0
    for h, kind in events:
        if h > t: break
        if kind == 'type': continue
        v = max(v, (1.0 if kind == 'bigcut' else 0.55) * math.exp(-(t - h) * 11))
    return v

class Renderer:
    def __init__(self, spec, style=None, height=None, fps=None, fx=True):
        self.ctx = Ctx(spec, style, height)
        if fps: self.ctx.fps = fps; self.ctx.N = int(round(self.ctx.duration * fps))
        self.fx = fx; self.events = build_events(self.ctx); ctx = self.ctx
        self.arr = np.zeros((ctx.H, ctx.W, 4), np.uint8); self.surf = skia.Surface(self.arr); self.c = self.surf.getCanvas()
        g = ctx.st['grain']; rng = np.random.default_rng(3)
        self.grains = [rng.integers(-g, g + 1, (ctx.H, ctx.W, 1), dtype=np.int16) for _ in range(6)] if g and fx else None
        self.vig = skia.Paint(Shader=skia.GradientShader.MakeRadial(skia.Point(ctx.cx, ctx.cy), math.hypot(ctx.W, ctx.H) * 0.62,
                    [col((0, 0, 0), 0), col((0, 0, 0), 0), col((0, 0, 0), ctx.st['vig'])], [0, 0.55, 1.0]))
        sc = ctx.st['scan']
        self.scan = (1 - sc * (np.arange(ctx.H) % 4 < 2)).astype(np.float32)[:, None, None] if sc else None
    def frame(self, fi):
        ctx, c, arr = self.ctx, self.c, self.arr; t = min(fi / ctx.fps, ctx.duration - 1e-6)
        i = next(k for k, s in enumerate(ctx.scenes) if s['t0'] <= t < s['t1'] or k == len(ctx.scenes) - 1)
        sc = ctx.scenes[i]; h = hit_amt(ctx, self.events, t) if self.fx else 0.0
        c.save()
        if h > 0.02 and (ctx.st['shake'] or ctx.st['zoom']):
            sx = (math.sin(fi * 12.9898) * 43758.5453) % 1 - 0.5; sy = (math.sin(fi * 78.233) * 43758.5453) % 1 - 0.5
            c.translate(sx * h * ctx.st['shake'] * ctx.U, sy * h * ctx.st['shake'] * ctx.U)
            s = 1 + h * ctx.st['zoom']; c.translate(ctx.cx, ctx.cy); c.scale(s, s); c.translate(-ctx.cx, -ctx.cy)
        c.save(); trans_pre(ctx, c, t, i)
        SCENES[sc['type']](ctx, c, sc, t - sc['t0'])
        c.restore()
        gl = transition(ctx, c, t, i)
        c.restore()
        if ctx.st['vig']: c.drawPaint(self.vig)
        hud(ctx, c, t, fi, sc)
        if not self.fx: return arr
        d = int(h * ctx.st['rgb'] * ctx.U)
        if d > 0: arr[:, :, 0] = np.roll(arr[:, :, 0], d, axis=1); arr[:, :, 2] = np.roll(arr[:, :, 2], -d, axis=1)
        if gl > 0.05:
            rng = np.random.default_rng(fi)
            for _ in range(int(10 * gl)):
                y0 = rng.integers(0, ctx.H - 10); hh = rng.integers(8, int(ctx.H * 0.08)); dx = int(rng.integers(-80, 80) * gl * ctx.U)
                arr[y0:y0 + hh] = np.roll(arr[y0:y0 + hh], dx, axis=1)
        if self.scan is not None: arr[:, :, :3] = (arr[:, :, :3] * self.scan).astype(np.uint8)
        if self.grains is not None:
            rgb = arr[:, :, :3].astype(np.int16); rgb += self.grains[fi % 6]; np.clip(rgb, 0, 255, out=rgb); arr[:, :, :3] = rgb  # film grain
        return arr

# ---------------- commands ----------------
def load_spec(path):
    with open(path, encoding='utf-8') as f: spec = json.load(f)
    base = os.path.dirname(os.path.abspath(path))
    for k, v in list((spec.get('assets') or {}).items()):
        if v and not os.path.isabs(v): spec['assets'][k] = os.path.join(base, v)
    for k, v in list((spec.get('fonts') or {}).items()):  # font files relative to the spec
        if v and not os.path.isabs(v) and os.path.isfile(os.path.join(base, v)): spec['fonts'][k] = os.path.join(base, v)
    a = spec.get('audio') or {}
    if a.get('path') and not os.path.isabs(a['path']): a['path'] = os.path.join(base, a['path'])
    return spec

def validate(spec):
    errs, warns = [], []
    f = spec.get('format', {})
    if f.get('aspect', '16:9') not in ASPECTS: errs.append(f'aspect must be one of {list(ASPECTS)}')
    if spec.get('style', 'punch') not in STYLES: errs.append(f'style must be one of {list(STYLES)}')
    p = spec.get('palette', {})
    if 'preset' in p and p['preset'] not in PALETTES: errs.append(f'palette.preset must be one of {list(PALETTES)}')
    bpm = f.get('bpm', 120); beat = 60 / bpm; total = 0
    for i, sc in enumerate(spec.get('scenes', [])):
        t = sc.get('type')
        if t not in SCENES: errs.append(f'scene {i}: unknown type {t}'); continue
        for r in REQUIRED[t]:
            if not sc.get(r): errs.append(f'scene {i} ({t}): missing {r}')
        if sc.get('transition') and sc['transition'] not in TRANSITIONS: errs.append(f'scene {i}: transition must be one of {TRANSITIONS}')
        if sc.get('bg', 'dark') not in ROLES: errs.append(f'scene {i}: bg must be a palette role {ROLES}')
        d = sc.get('beats', 0) * beat; total += d
        mins = max(0.5, float(f.get('min_scene', 1.0)))
        if d < mins - 1e-6: errs.append(f'scene {i} ({t}): {d:.2f}s is too short (min {mins}s; showcase cuts may set format.min_scene down to 0.5)')
        for key in ('words', 'labels'):
            if sc.get(key):
                slot = d / len(sc[key]); mn = 0.2 if t in ('rapid_cuts', 'style_cuts') else min(0.45, mins * 0.45)
                if slot < mn: errs.append(f'scene {i} ({t}): {slot:.2f}s per item < {mn}s, add beats or remove items')
                for w in sc[key]:
                    if (has_cjk(w) and len(w) > 8) or (not has_cjk(w) and len(w) > 12): warns.append(f'scene {i}: "{w}" is long; it will auto-shrink')
        for key in ('image', 'logo'):
            if sc.get(key) and sc[key] not in (spec.get('assets') or {}): errs.append(f'scene {i}: {key} "{sc[key]}" not in assets')
    if (spec.get('hud') or {}).get('mode') not in (None, 'frame', 'tech', 'grid', 'dots', 'chapter', 'pages', 'reel'): errs.append('hud.mode must be frame/tech/grid/dots/chapter/pages/reel')
    if spec.get('recipe') and spec['recipe'] not in mgfx_recipes.RECIPES: errs.append(f'recipe must be one of {list(mgfx_recipes.RECIPES)}')
    if spec.get('scenes') and spec['scenes'][-1].get('type') not in ('end_card', 'dot_lockup', 'decode_lockup', 'object_lockup', 'arc_lockup', 'caret_lockup', 'converge_lockup'): warns.append('last scene is not end_card')
    target = f.get('duration')
    if target and abs(total - target) > 0.01: errs.append(f'scene beats sum to {total:.2f}s but format.duration is {target}s ({target / beat:.1f} beats)')
    for k, v in (spec.get('assets') or {}).items():
        if not os.path.isfile(v): errs.append(f'asset {k}: file not found {v}')
    a = spec.get('audio', {})
    if a.get('mode') == 'file' and not os.path.isfile(a.get('path', '')): errs.append('audio.path not found')
    txt = json.dumps(spec, ensure_ascii=False)
    if has_cjk(txt) and not load_fonts(spec.get('style', 'punch'), spec.get('fonts'))['cjk']:
        errs.append('CJK text present but no CJK font found; set fonts.cjk to a font file')
    return errs, warns, total

def cmd_validate(a):
    spec = load_spec(a.spec); errs, warns, total = validate(spec)
    beat = 60 / spec.get('format', {}).get('bpm', 120); t = 0
    for i, sc in enumerate(spec.get('scenes', [])):
        d = sc.get('beats', 0) * beat; print(f'{i + 1:02d} {t:6.2f}-{t + d:6.2f}s  {sc.get("type", "?"):14s} bg={sc.get("bg", "dark"):5s} {sc.get("name", "")}'); t += d
    print(f'total {total:.2f}s')
    for w in warns: print('WARN', w)
    for e in errs: print('ERROR', e)
    print('OK' if not errs else 'FAILED'); sys.exit(1 if errs else 0)

def snapshot(r, fi):
    arr = r.frame(fi); return skia.Image.fromarray(arr.copy(), colorType=skia.kRGBA_8888_ColorType)

def sheet(tiles, labels, tw, th, cols, out, title=None, pal=None):
    rows = math.ceil(len(tiles) / cols); pad = 24; lab = 44; top = 110 if (title or pal) else pad
    W = cols * tw + (cols + 1) * pad; H = top + rows * (th + lab + pad)
    surf = skia.Surface(W, H); c = surf.getCanvas(); c.drawColor(skia.Color(24, 24, 28))
    tf = skia.Typeface.MakeFromName('PingFang SC', skia.FontStyle.Bold()); f = skia.Font(tf, 22)
    if title: c.drawString(title, pad, 48, skia.Font(tf, 30), skia.Paint(AntiAlias=True, Color=skia.ColorWHITE))
    if pal:
        x = pad
        for k in ROLES:
            c.drawRect(skia.Rect(x, 64, x + 110, 96), skia.Paint(Color=col(pal[k]))); c.drawString(f'{k} {rgb2hex(pal[k])}', x + 118, 88, f, skia.Paint(AntiAlias=True, Color=skia.Color(200, 200, 200)))
            x += 290
    for n, (img, l) in enumerate(zip(tiles, labels)):
        x = pad + (n % cols) * (tw + pad); y = top + (n // cols) * (th + lab + pad)
        c.drawImageRect(img, skia.Rect(x, y, x + tw, y + th), skia.SamplingOptions(skia.FilterMode.kLinear, skia.MipmapMode.kNone))
        c.drawString(l, x, y + th + 32, f, skia.Paint(AntiAlias=True, Color=skia.Color(230, 230, 230)))
    surf.makeImageSnapshot().save(out, skia.kPNG); print('wrote', out)

STILL_AT = {'hook': 0.78, 'end_card': 0.97, 'kinetic_words': 0.3, 'rapid_cuts': 0.2, 'dot_field': 0.3, 'shape_morph': 0.14, 'path_trace': 0.6, 'stat': 0.85, 'product_hero': 0.9, 'depth_tunnel': 0.45, 'product_glow': 0.62}
STILL_AT.update(mgfx_recipes.STILL2); STILL_AT.update(mgfx_chapters.STILL3); STILL_AT.update(mgfx_portfolio.STILL4); STILL_AT.update(mgfx_ignite.STILL5); STILL_AT.update(mgfx_ideaform.STILL6); STILL_AT.update(mgfx_typeform.STILL7); STILL_AT.update(mgfx_reelcraft.STILL8)
def cmd_stills(a):
    spec = load_spec(a.spec); r = Renderer(spec, height=a.height or 720); ctx = r.ctx; tiles, labels = [], []
    for sc in ctx.scenes:
        fr = sc.get('still', STILL_AT[sc['type']]); t = sc['t0'] + sc['dur'] * fr
        if sc['type'] == 'rapid_cuts' and 'still' not in sc: t = sc['t0'] + sc['dur'] / len(sc['words']) * 1.9
        Tt = min(0.25, ctx.beat / 2) + 0.02; t = min(max(t, sc['t0'] + (Tt if sc['i'] else 0)), sc['t1'] - (Tt if sc['i'] < len(ctx.scenes) - 1 else 0.02))
        tiles.append(snapshot(r, int(t * ctx.fps))); labels.append(f'{sc["i"] + 1:02d} {sc.get("name", sc["type"])}  {sc["t0"]:.1f}–{sc["t1"]:.1f}s')
    tw = 560 if not ctx.portrait else 300; th = int(tw * ctx.H / ctx.W); cols = 3 if not ctx.portrait else 5
    sheet(tiles, labels, tw, th, cols, a.out, f'{spec.get("meta", {}).get("brand", "")}  ·  {ctx.st["label"]}  ·  {ctx.W}x{ctx.H}', ctx.pal)

def cmd_styles(a):
    spec = load_spec(a.spec); tiles, labels = [], []
    pick = next((s for s in spec['scenes'] if s['type'] == 'kinetic_words'), None) or next((s for s in spec['scenes'] if s['type'] in ('rapid_cuts', 'hook')), spec['scenes'][0])
    for st in STYLES:
        r = Renderer(spec, style=st, height=540); sc = next(s for s in r.ctx.scenes if s['type'] == pick['type'])
        Tt = min(0.25, r.ctx.beat / 2) + 0.02; t = min(max(sc['t0'] + sc['dur'] * STILL_AT[sc['type']], sc['t0'] + Tt), sc['t1'] - Tt); tiles.append(snapshot(r, int(t * r.ctx.fps))); labels.append(f'{st} · {STYLES[st]["label"]}')
    ctx = r.ctx; tw = 640 if not ctx.portrait else 300; th = int(tw * ctx.H / ctx.W)
    sheet(tiles, labels, tw, th, 2 if not ctx.portrait else 4, a.out, '动效风格对比', ctx.pal)

def cmd_palette(a):
    tiles, labels = [], []; spec = load_spec(a.spec) if a.spec else None
    pals = {k: resolve_palette({'preset': k}) for k in PALETTES}
    if a.brand: pals = {'brand': resolve_palette({'brand': a.brand.split(',')}), **pals}
    W, H = 640, 200; surf = skia.Surface(W, (H + 60) * len(pals) + 40); c = surf.getCanvas(); c.drawColor(skia.Color(24, 24, 28))
    tf = skia.Typeface.MakeFromName('PingFang SC', skia.FontStyle.Bold()); f = skia.Font(tf, 22); f15 = skia.Font(tf, 15)
    for n, (k, p) in enumerate(pals.items()):
        y = 20 + n * (H + 60)
        c.drawString(f'{k}  {PALETTES[k]["label"] if k in PALETTES else "品牌色派生"}', 20, y + 28, f, skia.Paint(AntiAlias=True, Color=skia.ColorWHITE))
        for j, r in enumerate(ROLES):
            x = 20 + j * 120; c.drawRect(skia.Rect(x, y + 44, x + 110, y + 44 + H - 40), skia.Paint(Color=col(p[r])))
            c.drawString(rgb2hex(p[r]), x + 6, y + H, f15, skia.Paint(AntiAlias=True, Color=col(max((p['dark'], p['light']), key=lambda q: contrast(q, p[r])))))
        print(k, {r: rgb2hex(p[r]) for r in ROLES})
    surf.makeImageSnapshot().save(a.out, skia.kPNG); print('wrote', a.out)

_R = None
def _init(spec, height, fps):
    global _R; _R = Renderer(spec, height=height, fps=fps)
def _chunk(args):
    a, b, out, crf, maxrate = args; ctx = _R.ctx
    p = subprocess.Popen([ffmpeg_bin(), '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{ctx.W}x{ctx.H}', '-r', str(ctx.fps), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'medium', '-crf', str(crf), '-maxrate', maxrate, '-bufsize', maxrate.replace('M', '') + 'M',
                          '-pix_fmt', 'yuv420p', '-g', str(ctx.fps), '-threads', '2', out], stdin=subprocess.PIPE)
    for fi in range(a, b): p.stdin.write(_R.frame(fi).tobytes())
    p.stdin.close(); p.wait(); return out

def cmd_render(a):
    spec = load_spec(a.spec); errs, _, _ = validate(spec)
    if errs: print('\n'.join(errs)); sys.exit('spec invalid, run validate')
    ff = ffmpeg_bin(); r0 = Renderer(spec, height=a.height, fps=a.fps, fx=False); ctx = r0.ctx
    tmp = tempfile.mkdtemp(prefix='mgfx_'); wav = os.path.join(tmp, 'audio.wav'); ev = build_events(ctx)
    aud = spec.get('audio', {'mode': 'synth'}); mode = aud.get('mode', 'synth')
    if mode == 'synth': mgfx_audio.synth(ctx, wav, ev)
    elif mode == 'file': mgfx_audio.external(ctx, ff, wav, ev)
    mb = max(6, round(16 * ctx.W * ctx.H / (1920 * 1080) * ctx.fps / 60)); maxrate = f'{mb}M'  # grain explodes bitrate without a cap
    workers = max(1, a.workers); N = ctx.N; step = math.ceil(N / workers)
    jobs = [(k, min(N, k + step), os.path.join(tmp, f'part{j:02d}.mp4'), a.crf, maxrate) for j, k in enumerate(range(0, N, step))]
    t0 = time.time(); print(f'rendering {N} frames {ctx.W}x{ctx.H}@{ctx.fps} with {len(jobs)} workers ...', flush=True)
    with Pool(len(jobs), initializer=_init, initargs=(spec, a.height, a.fps)) as pool:
        for out in pool.imap(_chunk, jobs): print('  done', os.path.basename(out), f'{time.time() - t0:.0f}s', flush=True)
    lst = os.path.join(tmp, 'list.txt')
    with open(lst, 'w') as f: f.writelines(f"file '{j[2]}'\n" for j in jobs)
    cmd = [ff, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst]
    if mode != 'none': cmd += ['-i', wav, '-c:a', 'aac', '-b:a', '192k', '-shortest']
    cmd += ['-c:v', 'copy', '-movflags', '+faststart', a.out]
    subprocess.run(cmd, check=True)
    if a.keep_audio and mode != 'none': shutil.copy(wav, os.path.splitext(a.out)[0] + '.wav')
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'wrote {a.out}  {os.path.getsize(a.out) / 1e6:.1f}MB  {ctx.duration:.2f}s  in {time.time() - t0:.0f}s')

def cmd_analyze(a): print(json.dumps(mgfx_audio.analyze(ffmpeg_bin(), a.audio), indent=2))

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
    v = sp.add_parser('validate'); v.add_argument('spec'); v.set_defaults(fn=cmd_validate)
    s = sp.add_parser('stills'); s.add_argument('spec'); s.add_argument('--out', default='storyboard.png'); s.add_argument('--height', type=int); s.set_defaults(fn=cmd_stills)
    y = sp.add_parser('styles'); y.add_argument('spec'); y.add_argument('--out', default='styles.png'); y.set_defaults(fn=cmd_styles)
    p = sp.add_parser('palette'); p.add_argument('--spec'); p.add_argument('--brand', help='comma-separated hex'); p.add_argument('--out', default='palettes.png'); p.set_defaults(fn=cmd_palette)
    r = sp.add_parser('render'); r.add_argument('spec'); r.add_argument('--out', default='promo.mp4'); r.add_argument('--height', type=int)
    r.add_argument('--fps', type=int); r.add_argument('--crf', type=int, default=18); r.add_argument('--workers', type=int, default=max(1, min(4, (os.cpu_count() or 2) // 2)))
    r.add_argument('--keep-audio', action='store_true'); r.set_defaults(fn=cmd_render)
    z = sp.add_parser('analyze-audio'); z.add_argument('audio'); z.set_defaults(fn=cmd_analyze)
    args = ap.parse_args(); args.fn(args)
