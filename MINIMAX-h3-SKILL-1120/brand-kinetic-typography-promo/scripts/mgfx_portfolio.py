"""Motion modules from the two-part portfolio reel (reference 3):
part A (fast tech reel): select_box, code_glitch, cross_ripple, pillar_wave, type_ribbons, infinity_particles, grid_recap;
part B (Swiss layout + liquid-chrome objects): split_hero, text_band, beat_jelly, stack_flip, object_lockup."""
import math, random
import numpy as np, skia
from mgfx_core import *
from mgfx_recipes import carrier, next_bg, mono, typed, quint, cache
from mgfx_chapters import word_points, count_fmt, parse_num

def flash_out(ctx, c, sc, lt, D, dur=0.08):
    if lt > D - dur: c.drawColor(col(next_bg(ctx, sc)))

# ---------------- chrome rendering ----------------
LEGACY_CHROME = __import__('os').environ.get('MGFX_LEGACY_CHROME', '0') == '1'  # set MGFX_LEGACY_CHROME=1 for the old fast bead shading
def chrome_shader(x, y, r, accent, dark=False):
    hi = (255, 255, 255); m1 = (40, 40, 44) if dark else (190, 192, 196); m2 = (12, 12, 14) if dark else (70, 72, 78)
    cols = [col(hi), col(m1), col(m2), col(lc(m2, accent, 0.5)), col(accent)]
    return skia.GradientShader.MakeRadial(skia.Point(x - 0.35 * r, y - 0.4 * r), 1.45 * r, cols, [0, 0.25, 0.6, 0.85, 1.0])
def curve(kind, n, lt):
    t = np.linspace(0, 2 * PI, n, endpoint=False)
    if kind == 'knot':
        r = 2 + np.cos(3 * t); P3 = np.stack([r * np.cos(2 * t), r * np.sin(2 * t), np.sin(3 * t) * 1.2], 1) * 0.36; rad = np.full(n, 0.2)
    elif kind == 'blob':
        P3 = np.stack([np.sin(t) * 1.15 + 0.06 * np.sin(3 * t + lt * 2.2), np.sin(t) * np.cos(t) * 1.1 + 0.05 * np.cos(4 * t - lt * 1.7), 0.35 * np.sin(2 * t)], 1); rad = 0.26 + 0.12 * np.sin(2 * t + lt * 3) ** 2
    else:  # loop: wobbling ring
        P3 = np.stack([np.cos(t), np.sin(t), 0.35 * np.sin(2 * t + lt)], 1); rad = 0.17 + 0.05 * np.sin(3 * t - lt * 2)
    return P3, rad
def draw_chrome_tube(ctx, c, kind, cx, cy, size, rx, ry, accent, lt, dark=False, inflate=1.0):
    P3, rad = curve(kind, 260 if LEGACY_CHROME else 360, lt); rad = rad * inflate
    x, y, z = P3[:, 0], P3[:, 1], P3[:, 2]
    x, z = x * math.cos(ry) + z * math.sin(ry), -x * math.sin(ry) + z * math.cos(ry)
    y, z = y * math.cos(rx) - z * math.sin(rx), y * math.sin(rx) + z * math.cos(rx)
    d = 4.0 + z; f = size * 4.0
    if not LEGACY_CHROME:
        import mgfx_chrome
        mgfx_chrome.tube(c, cx + f * x / d, cy + f * y / d, f * rad / d, d, rad, accent, dark); return
    for i in np.argsort(-d):
        sx = cx + f * x[i] / d[i]; sy = cy + f * y[i] / d[i]; r = f * rad[i] / d[i]
        p = skia.Paint(AntiAlias=True); p.setShader(chrome_shader(sx, sy, r, accent, dark)); c.drawCircle(sx, sy, r, p)
def star_path(cx, cy, R, ri=0.5, n=5, rot=-90, sx=1.0, sy=1.0):
    pts = []
    for k in range(2 * n):
        a = math.radians(rot + k * 180 / n); rr = R if k % 2 == 0 else R * ri; pts.append((cx + rr * math.cos(a) * sx, cy + rr * math.sin(a) * sy))
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    p.close(); return p
def draw_star(ctx, c, cx, cy, R, lt, accent, chrome=True, sx=1.0, sy=1.0, rot=-90, twist=0.0):
    U = ctx.U; pth = star_path(cx, cy, R, 0.52, 5, rot, sx, sy)
    pe = skia.CornerPathEffect.Make(R * 0.18)
    if not LEGACY_CHROME:
        import mgfx_chrome
        sp = skia.Path(); skia.Paint(PathEffect=pe).getFillPath(pth, sp)
        def wv(x, y):  # wave twist: rotation grows with radius and travels in time
            dx, dy = x - cx, y - cy; rr = math.hypot(dx, dy) / R; a = math.radians(twist * math.sin(rr * PI * 1.2 - lt * 5) * rr)
            return cx + dx * math.cos(a) - dy * math.sin(a), cy + dx * math.sin(a) + dy * math.cos(a)
        if twist: sp = mgfx_chrome._warp(sp, wv)
        mgfx_chrome.inflated(c, sp, accent, base=None if chrome else lc(accent, (0, 0, 0), 0.1)); return
    c.drawPath(pth, _pp(P((0, 0, 0), 0.25, blur=R * 0.12), pe, dy=R * 0.12))
    p = skia.Paint(AntiAlias=True); p.setPathEffect(pe)
    if chrome: p.setShader(chrome_shader(cx, cy, R * 1.05, accent))
    else: p.setShader(skia.GradientShader.MakeRadial(skia.Point(cx - R * 0.3, cy - R * 0.35), R * 1.3, [col(lc(accent, (255, 255, 255), 0.6)), col(accent), col(lc(accent, (0, 0, 0), 0.35))], [0, 0.55, 1]))
    c.drawPath(pth, p)
    if chrome:
        c.save(); c.clipPath(pth, doAntiAlias=True); c.drawCircle(cx, cy, R * 0.35, P(accent, 0.75, blur=R * 0.2)); c.restore()
    c.drawOval(skia.Rect(cx - R * 0.42, cy - R * 0.52, cx - R * 0.05, cy - R * 0.32), P((255, 255, 255), 0.55, blur=R * 0.05))
def _pp(p, pe, dy=0):
    p.setPathEffect(pe)
    if dy: p.setImageFilter(skia.ImageFilters.Offset(0, dy))
    return p

# ================= part A =================
# select_box: big word bounces in inside a live selection box with handles and size readout, then RGB-glitches and flashes out
def s_select_box(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, sc.get('size', 280) * U, ctx.W * 0.7)); w = T.width(s); h = T.cap(s)
    wc = ctx.pal[sc.get('color', 'a1')]; bc = ctx.pal[sc.get('box', 'a3')]
    k = eob(prog(lt, 0.0, 0.4), 2.4); tg = D - 0.35; g = prog(lt, tg, D)
    c.save(); c.translate(cx, cy); c.scale(k, k); c.translate(-cx, -cy)
    if g > 0:
        rng = random.Random(int(lt * 30))
        for ch_, dx in ((ctx.pal['a1'], -14), (ctx.pal['a3'], 14)): T.draw_mid(c, s, cx + dx * U * g * 2, cy, P(ch_, 0.8))
        for _ in range(6):
            y0 = cy - h + rng.random() * h * 1.6; hh = rng.uniform(8, 40) * U
            c.save(); c.clipRect(skia.Rect(0, y0, ctx.W, y0 + hh)); T.draw_mid(c, s, cx + rng.uniform(-80, 80) * U * g, cy, P(wc)); c.restore()
    else: T.draw_mid(c, s, cx, cy, P(wc))
    c.restore()
    a = eoc(prog(lt, 0.25, 0.5)); pad = 30 * U; r = skia.Rect(cx - w / 2 - pad, cy - h / 2 - pad, cx + w / 2 + pad, cy + h / 2 + pad)
    if a > 0:
        e = eioe(prog(lt, 0.25, 0.55)); rr = skia.Rect(r.centerX() - r.width() / 2 * e, r.top(), r.centerX() + r.width() / 2 * e, r.bottom())
        c.drawRect(rr, P(bc, 1, 2.5 * U))
        for hx in (rr.left(), rr.centerX(), rr.right()):
            for hy in (rr.top(), rr.centerY(), rr.bottom()):
                if hx == rr.centerX() and hy == rr.centerY(): continue
                q = skia.Rect(hx - 7 * U, hy - 7 * U, hx + 7 * U, hy + 7 * U); c.drawRect(q, P(bg)); c.drawRect(q, P(bc, a, 2.5 * U))
        lbl = f'{int(w / U * 1.5)} × {int(h / U * 1.5)}'; Tm = mono(ctx, 20); lw = Tm.width(lbl) + 24 * U
        lb = skia.Rect(r.centerX() - lw / 2, r.bottom() + 16 * U, r.centerX() + lw / 2, r.bottom() + 52 * U)
        c.drawRRect(skia.RRect.MakeRectXY(lb, 6 * U, 6 * U), P(bc, a)); Tm.draw_mid(c, lbl, lb.centerX(), lb.centerY(), P((255, 255, 255), a))
        mx = r.right() + 40 * U - 30 * U * eoc(prog(lt, 0.4, 0.8)); my = r.bottom() + 30 * U
        cur = skia.Path(); cur.moveTo(mx, my); cur.lineTo(mx, my + 34 * U); cur.lineTo(mx + 9 * U, my + 26 * U); cur.lineTo(mx + 22 * U, my + 26 * U); cur.close()
        c.drawPath(cur, P(fg, a)); c.drawPath(cur, P(bg, a, 2 * U))
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), cx, r.top() - 40 * U, P(fg, 0.6 * a))
    if lt > D - 0.07: c.drawColor(col((255, 255, 255)))
    if lt > D - 0.035: c.drawColor(col(next_bg(ctx, sc)))

# code_glitch: colour field with faint scrolling code, big word types on with a block cursor, periodic RGB slice glitches
CODE = ['const t = ease(p);', 'for (k of frames) {', '  draw(k, beat);', 'scale.set(1.08);', 'return motion;', 'if (hit) shake();', 'mask.reveal(0.4);', '}']
def s_code_glitch(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    Tc = mono(ctx, 24); lines = sc.get('code') or CODE; lh = 40 * U; off = (lt * 90 * U) % (lh * len(lines))
    for k in range(int(ctx.H / lh) + len(lines) + 2):
        Tc.draw(c, lines[k % len(lines)], 80 * U + (k % 3) * 40 * U, k * lh - off, P(fg, 0.12), 'l')
    s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, sc.get('size', 260) * U, ctx.W * 0.72)); n = int(clamp((lt - 0.05) / 0.06, 0, len(s)))
    shown = s[:n]; w = T.width(s); x0 = cx - w / 2; base = cy + T.cap(s) / 2
    gl = 0.0
    for gt in sc.get('glitch_at', [0.45, 0.62, 0.9]):
        gl = max(gl, max(0, 1 - abs(lt / D - gt) / 0.04))
    if gl > 0:
        rng = random.Random(int(lt * 60))
        T.draw(c, shown, x0 - 12 * U * gl, base, P((255, 40, 60), 0.8), 'l'); T.draw(c, shown, x0 + 12 * U * gl, base, P((40, 220, 255), 0.8), 'l')
        for _ in range(7):
            y0 = base - T.cap(s) * 1.1 + rng.random() * T.cap(s) * 1.3; hh = rng.uniform(6, 30) * U
            c.save(); c.clipRect(skia.Rect(0, y0, ctx.W, y0 + hh)); c.drawColor(col(bg)); T.draw(c, shown, x0 + rng.uniform(-60, 60) * U * gl, base, P(fg), 'l'); c.restore()
    T.draw(c, shown, x0, base, P(fg), 'l')
    if int(lt / 0.12) % 2 == 0 or n < len(s):
        cxp = x0 + T.width(shown) + 14 * U; c.drawRect(skia.Rect(cxp, base - T.cap(s), cxp + T.size * 0.09, base), P(fg))
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), cx, base + 70 * U, P(fg, 0.7 * eoc(prog(lt, 0.5, 0.8))))

# cross_ripple: flat grid of dots that morph into plus signs in concentric ripples from the centre
def s_cross_ripple(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy; cc = carrier(ctx, sc)
    sp = 58 * U; nx = int(ctx.W / sp / 2) + 1; ny = int(ctx.H / sp / 2) + 1; c3 = ctx.pal[sc.get('color', 'a3')]
    for j in range(-ny, ny + 1):
        for i in range(-nx, nx + 1):
            r = math.hypot(i, j); m = clamp(0.5 + 0.5 * math.sin(lt * 6 - r * 0.6)) ** 2 * clamp(lt * 3 - r * 0.15)
            x, y = cx + i * sp, cy + j * sp; arm = sp * 0.36 * m; dot = 5 * U * (1 - m) + 2 * U
            colr = cc if (i * 5 + j * 3) % 17 == 0 else c3 if r < 4 * m + 1 and m > 0.3 else fg
            if arm > 1: c.drawLine(x - arm, y, x + arm, y, P(colr, 0.9, 5 * U, cap=False)); c.drawLine(x, y - arm, x, y + arm, P(colr, 0.9, 5 * U, cap=False))
            c.drawCircle(x, y, dot, P(colr, 0.7))
    if sc.get('word'):
        s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, 120 * U, ctx.W * 0.5)); a = eoc(prog(lt, 0.2, 0.5)); w = T.width(s)
        r = skia.Rect(cx - w / 2 - 30 * U, cy - T.cap(s) / 2 - 26 * U, cx + w / 2 + 30 * U, cy + T.cap(s) / 2 + 26 * U)
        c.drawRect(r, P(bg, a)); T.draw_mid(c, s, cx, cy, P(fg, a))
    flash_out(ctx, c, sc, lt, D, 0.04)

# pillar_wave: isometric matrix of rounded pillars rising and falling in a sine wave, coloured caps, the carrier ball rides the crest
def s_pillar_wave(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc)
    n = 11; a = 46 * U; b = 26 * U; ts = D - 0.3; rush = eie(prog(lt, ts, D))
    c.save(); c.translate(ctx.cx, ctx.cy - 60 * U); s = 1 + 3 * rush + 0.05 * prog(lt, 0, D); c.scale(s, s)
    base_c = lc(bg, fg, 0.18) if contrast(bg, fg) > 3 else fg; caps = [ctx.pal['light'], ctx.pal['a1'], ctx.pal['a3']]
    def H(i, j): return (40 + 70 * (0.5 + 0.5 * math.sin(i * 0.7 + j * 0.45 - lt * 6))) * U
    ball = None; bi = (lt / D) * (n - 1); bj = n / 2 + 2 * math.sin(lt * 2)
    for d in range(2 * n - 1):
        for i in range(n):
            j = d - i
            if not (0 <= j < n): continue
            h = H(i, j); x = (i - j) * a; y = (i + j - n) * b - h
            top = [(x, y - b), (x + a, y), (x, y + b), (x - a, y)]
            left = [(x - a, y), (x, y + b), (x, y + b + h), (x - a, y + h)]; right = [(x + a, y), (x, y + b), (x, y + b + h), (x + a, y + h)]
            for poly, k in ((left, 0.55), (right, 0.75)):
                p = skia.Path(); p.addPoly([skia.Point(*q) for q in poly], True); c.drawPath(p, P(lc((0, 0, 0), base_c, k)))
            capc = caps[(i * 3 + j * 7) % 3] if (i * 3 + j * 7) % 4 == 0 else base_c
            p = skia.Path(); p.addPoly([skia.Point(*q) for q in top], True); c.drawPath(p, P(capc))
            if i == int(bi) and j == int(round(bj)): ball = (x, y - 26 * U - 40 * U * abs(math.sin(lt * PI / ctx.beat)))
    if ball: c.drawCircle(ball[0], ball[1], 22 * U, P(cc))
    c.restore()
    if rush > 0:
        for k in range(40):
            rng = random.Random(k); ang = rng.uniform(0, 2 * PI); r0 = rng.uniform(0.1, 0.4) * ctx.W
            c.drawLine(ctx.cx + r0 * math.cos(ang), ctx.cy + r0 * math.sin(ang), ctx.cx + (r0 + ctx.W * rush) * math.cos(ang), ctx.cy + (r0 + ctx.W * rush) * math.sin(ang), P(fg, 0.5 * rush, 3 * U))
    if sc.get('word'):
        sw = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, sw, 110 * U, ctx.W * 0.4)); e = quint(prog(lt, 0.1, 0.5))
        T.draw(c, sw, 80 * U - (1 - e) * 300 * U, 90 * U + T.cap(sw), P(fg, 1 - rush), 'l')
        if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), 82 * U, 140 * U + T.cap(sw), P(fg, 0.7 * e * (1 - rush)), 'l')
    if lt > D - 0.06: c.drawColor(col(next_bg(ctx, sc)))

# type_ribbons: tilted bands of colour carry marquee text at speed in alternating directions; the centre band brakes on the word; bands pinch shut
def s_type_ribbons(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H
    words = [ctx.up(w) for w in sc['words']]; roles = sc.get('bands') or ['a1', 'light', 'a3', 'dark', 'a1', 'a3', 'light']
    nb = 7; bh = H * 1.6 / nb; pinch = eie(prog(lt, D - 0.3, D - 0.04)); tb = D * 0.6
    c.save(); c.translate(ctx.cx, ctx.cy); c.rotate(sc.get('angle', -10)); c.scale(1, 1 - pinch)
    for k in range(nb):
        y0 = -H * 0.8 + k * bh; mid = k == nb // 2; bc = ctx.pal['light' if mid else roles[k % len(roles)]]
        if mid: bc = ctx.pal[sc.get('hero_band', 'a2')]
        tc = max((ctx.pal['dark'], ctx.pal['light']), key=lambda q: contrast(q, bc))
        c.drawRect(skia.Rect(-W, y0, W, y0 + bh + 1), P(bc))
        T = Text(ctx, bh * 0.62); s = ('  ' + words[k % len(words)] + ' ') if not mid else words[0]
        if mid:
            v = 1 - eoe(prog(lt, 0, tb)); x = v * W * 1.6
            for g in range(5, 0, -1):
                if v > 0.03: T.draw_mid(c, s, x + g * v * 120 * U, y0 + bh / 2, P(tc, 0.12))
            T.draw_mid(c, s, x, y0 + bh / 2, P(tc))
        else:
            sw = T.width(s); dirn = 1 if k % 2 else -1; off = (lt * (1400 + 300 * k) * U * dirn) % sw; x = -W - sw + off
            while x < W: T.draw(c, s, x, y0 + bh / 2 + T.cap(s) / 2, P(tc, 0.95), 'l'); x += sw
    c.restore()
    if lt > D - 0.04: c.drawColor(col(next_bg(ctx, sc)))

# infinity_particles: particles stream along a tumbling 3D infinity loop; a word made of particles erodes into the stream; ends in an outward burst
def s_infinity_particles(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    def mk():
        rng = np.random.default_rng(4); n = 1600; t = rng.uniform(0, 2 * PI, n); j = rng.normal(0, 0.07, (n, 3)); return t, j, rng.integers(0, 3, n)
    t, jit, ci = cache(ctx, 'inf', mk)
    cols = [ctx.pal[r] for r in ('a1', 'a3', 'light')]; tt = t + lt * 1.3
    den = 1 + np.sin(tt) ** 2; x = 1.5 * np.cos(tt) / den + jit[:, 0]; y = 1.5 * np.sin(tt) * np.cos(tt) / den + jit[:, 1]; z = 0.4 * np.sin(2 * tt) + jit[:, 2]
    ry = 0.6 * math.sin(lt * 0.8); rx = 0.5
    x, z = x * math.cos(ry) + z * math.sin(ry), -x * math.sin(ry) + z * math.cos(ry); y, z = y * math.cos(rx) - z * math.sin(rx), y * math.sin(rx) + z * math.cos(rx)
    gin = eioc(prog(lt, 0, 0.5)); burst = eie(prog(lt, D - 0.3, D)); f = ctx.H * 0.33 * (1 + 2.5 * burst); d = 3.5 + z
    for i in np.argsort(-d):
        sx = cx + f * x[i] / d[i] * 3.5 * gin + (1 - gin) * (jit[i, 0] * 9) * ctx.W * 0.3; sy = cy + f * y[i] / d[i] * 3.5 * gin + (1 - gin) * jit[i, 1] * ctx.H * 3
        c.drawCircle(sx, sy, 2.6 * U * 3.5 / d[i], P(cols[ci[i]], clamp(0.9 - (d[i] - 3.5) * 0.6) * (1 - burst * 0.5)))
    if sc.get('word'):
        s = ctx.up(sc['word']); size = fit_size(ctx, s, 160 * U, ctx.W * 0.4); px, py, rnd, home = word_points(ctx, s, size, 1400)
        er = prog(lt, D * 0.45, D * 0.9); a = eoc(prog(lt, 0.2, 0.5))
        for i in range(len(px)):
            q = clamp((er - rnd[i] * 0.6) / 0.4) ** 2; ang = math.atan2(py[i], px[i] + 1e-6) + q * 2
            X = cx + px[i] + q * (math.cos(ang) * 600 * U + 400 * U); Y = cy + py[i] + q * math.sin(ang) * 300 * U
            c.drawCircle(X, Y, 2.4 * U, P(fg, a * (1 - q)))
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), cx, ctx.H - 90 * U, P(fg, 0.7 * (1 - burst)))

# grid_recap: 3x3 mosaic replays earlier scenes in sync; cells flash on beats; the centre cell (the next scene) zooms to fill
def s_grid_recap(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H
    from mgfx_scenes import SCENES
    skip = {'grid_recap', 'end_card', 'dot_lockup', 'decode_lockup', 'object_lockup'}
    prev = [s for s in ctx.scenes[:sc['i']] if s['type'] not in skip] or [s for s in ctx.scenes if s['type'] not in skip and s is not sc]
    nxt = ctx.scenes[sc['i'] + 1] if sc['i'] + 1 < len(ctx.scenes) else None
    g = 14 * U; cw = (W - 4 * g) / 3; ch = (H - 4 * g) / 3; zt = D - 0.32; z = eioe(prog(lt, zt, D))
    for k in range(9):
        r_, c_ = divmod(k, 3); x0 = g + c_ * (cw + g); y0 = g + r_ * (ch + g)
        center = k == 4
        if center and z > 0: continue
        pop = eob(prog(lt, 0.03 * k, 0.03 * k + 0.3), 1.8)
        if pop <= 0: continue
        sub = (nxt if center and nxt else prev[k % len(prev)])
        st = (sub['dur'] * 0.15 + lt * 0.9) % sub['dur'] if not (center and nxt) else min(lt * 0.3, sub['dur'] * 0.2)
        c.save(); c.translate(x0 + cw / 2, y0 + ch / 2); c.scale(pop, pop); c.translate(-cw / 2, -ch / 2)
        c.clipRect(skia.Rect(0, 0, cw, ch)); c.scale(cw / W, ch / H)
        SCENES[sub['type']](ctx, c, sub, st); c.restore()
        if int(lt / (ctx.beat / 2)) % 9 == (k * 4) % 9 and lt < zt: c.drawRect(skia.Rect(x0, y0, x0 + cw, y0 + ch), P(fg, 0.25))
    if z > 0 and nxt:
        x0 = lerp(g + cw + g, 0, z); y0 = lerp(g + ch + g, 0, z); w = lerp(cw, W, z); h = lerp(ch, H, z)
        c.save(); c.translate(x0, y0); c.clipRect(skia.Rect(0, 0, w, h)); c.scale(w / W, h / H); SCENES[nxt['type']](ctx, c, nxt, 0.0); c.restore()

# ================= part B =================
def page_flip_out(ctx, c, sc, lt, D, dur=0.28):
    p = prog(lt, D - dur, D)
    if p <= 0: return
    e = eioe(p); x = ctx.W * (1 - e); c.drawRect(skia.Rect(x, 0, ctx.W + 2, ctx.H), P(next_bg(ctx, sc)))
    c.drawRect(skia.Rect(x - 40 * ctx.U * math.sin(PI * p), 0, x, ctx.H), P((0, 0, 0), 0.25 * math.sin(PI * p), blur=20 * ctx.U))
def left_lines(ctx, c, sc, lt, fg, acc_c, x0, ytop, size, maxw, t0=0.05):
    lines = [ctx.up(s) for s in sc['lines']]; hi = sc.get('accent_line', len(lines) - 1); y = ytop
    for i, s in enumerate(lines):
        T = Text(ctx, fit_size(ctx, s, size, maxw)); y += T.cap(s); e = eob(prog(lt, t0 + 0.08 * i, t0 + 0.45 + 0.08 * i), 1.4)
        c.save(); c.clipRect(skia.Rect(0, y - T.cap(s) * 1.25, ctx.W, y + T.cap(s) * 0.25))
        T.draw(c, s, x0 - (1 - e) * maxw * 0.6, y, P(acc_c if i == hi else fg), 'l'); c.restore(); y += T.cap(s) * 0.32
    return y

# split_hero: Swiss left-aligned headline + a liquid-chrome object on the right (knot / blob / loop / star), optional counter + loading bar
def s_split_hero(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H
    ac = ctx.pal[sc.get('accent', 'a2')]; tc = ac if contrast(ac, bg) > 2.2 else fg
    if sc.get('kicker'): mono(ctx, 20).draw(c, ctx.up(sc['kicker']), W * 0.07, H * 0.26, P(fg, 0.6 * eoc(prog(lt, 0, 0.3))), 'l')
    left_lines(ctx, c, sc, lt, fg, tc, W * 0.07, H * 0.3, sc.get('size', 150) * U, W * (0.5 if not ctx.portrait else 0.86))
    obj = sc.get('object', 'knot'); k = eob(prog(lt, 0.1, 0.6), 1.6); ox = W * (0.74 if not ctx.portrait else 0.5); oy = H * (0.5 if not ctx.portrait else 0.72)
    sz = min(W, H) * 0.3 * k
    if sz > 1:
        if obj == 'star': draw_star(ctx, c, ox, oy + math.sin(lt * 2) * 10 * U, sz * 1.1, lt, ac, rot=-90 + lt * 12)
        else: draw_chrome_tube(ctx, c, obj, ox, oy, sz, 0.5 + 0.2 * math.sin(lt * 0.7), lt * 0.6, ac, lt, inflate=1 + (0.15 * math.sin(lt * 2) if obj == 'blob' else 0))
    cn = sc.get('counter')
    if cn:
        u = eoe(prog(lt, 0.3, D * 0.8)); a = parse_num(cn['from']); b = parse_num(cn['to'])
        v = a[1] + (b[1] - a[1]) * u if a and b else None; s = (b[0] + f'{v:.{b[2]}f}' + b[3]) if v is not None else cn['to']
        Tm = mono(ctx, 22); x1 = W * 0.93; y1 = H * 0.86; Tm.draw(c, s, x1, y1, P(fg), 'r')
        if cn.get('label'): Tm.draw(c, ctx.up(cn['label']), x1 - 260 * U, y1, P(fg, 0.5), 'l')
        c.drawRect(skia.Rect(x1 - 260 * U, y1 + 18 * U, x1, y1 + 22 * U), P(fg, 0.2)); c.drawRect(skia.Rect(x1 - 260 * U, y1 + 18 * U, x1 - 260 * U + 260 * U * u, y1 + 22 * U), P(ac))
    page_flip_out(ctx, c, sc, lt, D)

# text_band: a twisting Mobius band of type loops endlessly beside a left-aligned headline
def s_text_band(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H
    if sc.get('lines'): left_lines(ctx, c, sc, lt, fg, fg, W * 0.07, H * 0.3, sc.get('size', 140) * U, W * 0.42)
    s = ctx.up(sc.get('band') or ' '.join(sc.get('lines', ['MOTION']))) + ' • '; n = 90; R = 1.0
    bandc = fg; txtc = bg; cxo = W * (0.72 if not ctx.portrait else 0.5); cyo = H * (0.5 if not ctx.portrait else 0.72); f = min(W, H) * 0.28 * eob(prog(lt, 0.05, 0.5), 1.5)
    ry = lt * 0.5; rx = 0.9 + 0.15 * math.sin(lt); segs = []
    for k in range(n):
        u = 2 * PI * k / n; tw = u / 2 + lt * 0.8
        cpt = np.array([R * math.cos(u), R * math.sin(u), 0.0]); nrm = np.array([math.cos(u) * math.cos(tw), math.sin(u) * math.cos(tw), math.sin(tw)])
        def tr(p):
            x, y, z = p; x, z = x * math.cos(ry) + z * math.sin(ry), -x * math.sin(ry) + z * math.cos(ry); y, z = y * math.cos(rx) - z * math.sin(rx), y * math.sin(rx) + z * math.cos(rx)
            d = 3.2 + z; return (cxo + f * 3.2 * x / d, cyo + f * 3.2 * y / d, z)
        w = 0.22; segs.append((tr(cpt + nrm * w), tr(cpt - nrm * w), tr(cpt)))
    order = sorted(range(n), key=lambda k: -segs[k][2][2])
    T = Text(ctx, f * 0.2); speed = lt * 3
    for k in order:
        a0, b0, m0 = segs[k]; a1, b1, _ = segs[(k + 1) % n]
        p = skia.Path(); p.addPoly([skia.Point(a0[0], a0[1]), skia.Point(a1[0], a1[1]), skia.Point(b1[0], b1[1]), skia.Point(b0[0], b0[1])], True)
        shade = 0.75 + 0.25 * clamp(-m0[2] + 0.5); c.drawPath(p, P(lc(bg, bandc, shade))); c.drawPath(p, P(lc(bg, bandc, shade), 1, 1.2 * U))
        ch = s[(k + int(speed * 3)) % len(s)]
        if ch.strip():
            vx, vy = a1[0] - a0[0] + b1[0] - b0[0], a1[1] - a0[1] + b1[1] - b0[1]; ang = math.degrees(math.atan2(vy, vx))
            hgt = math.hypot(a0[0] - b0[0], a0[1] - b0[1])
            if hgt > 6 * U:
                c.save(); c.translate((a0[0] + b0[0] + a1[0] + b1[0]) / 4, (a0[1] + b0[1] + a1[1] + b1[1]) / 4); c.rotate(ang)
                sc_ = hgt / (f * 0.44 + 1e-6); c.scale(1, max(0.05, sc_)); fo = T.font_for(ch); wch = fo.measureText(ch)
                c.drawString(ch, -wch / 2, T.cap('A') / 2, fo, P(txtc)); c.restore()
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), W * 0.07, H * 0.86, P(fg, 0.6), 'l')
    if lt > D - 0.04: c.drawColor(col(next_bg(ctx, sc)))

# beat_jelly: headline + full-width spectrum bars + a jelly star that squashes on every beat beside a floating black chrome ball
def s_beat_jelly(ctx, c, sc, lt):  # jelly star: one squash per beat, eases back without wobble
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; b = ctx.beat
    ac = ctx.pal[sc.get('accent', 'a2')]
    if sc.get('lines'): left_lines(ctx, c, sc, lt, fg, fg, W * 0.07, H * 0.18, sc.get('size', 140) * U, W * 0.5)
    nb = 64; bw = W / nb; ph = (lt % b) / b; kick = math.exp(-ph * 6)
    for k in range(nb):
        v = 0.25 + 0.45 * kick * math.exp(-((k - 10) / 14) ** 2) + 0.2 * abs(math.sin(k * 0.9 + lt * 9)) * (0.4 + kick)
        hh = H * 0.22 * v * eoc(prog(lt, 0.1 + k * 0.004, 0.4 + k * 0.004))
        c.drawRect(skia.Rect(k * bw + bw * 0.18, H - 40 * U - hh, (k + 1) * bw - bw * 0.18, H - 40 * U), P(fg if k % 9 else ac, 0.9))
    sq = 0.24 * (1 - math.exp(-ph * 40)) * math.exp(-ph * 8); R = min(W, H) * 0.17 * eob(prog(lt, 0.05, 0.45), 2)
    sx, sy = 1 + sq, 1 - sq; scx = W * 0.75; scy = H * 0.45 + R * (1 - sy)
    if R > 1:
        if LEGACY_CHROME: c.drawCircle(W * 0.58, H * 0.32 + math.sin(lt * 2) * 12 * U, R * 0.45, _ball(W * 0.58, H * 0.32 + math.sin(lt * 2) * 12 * U, R * 0.45))
        else:
            import mgfx_chrome; mgfx_chrome.sphere(c, W * 0.58, H * 0.32 + math.sin(lt * 2) * 12 * U, R * 0.45, ac, dark=True, tint=(scx - W * 0.58, scy - H * 0.32, ac))
        draw_star(ctx, c, scx, scy, R, lt, ac, chrome=False, sx=sx, sy=sy, rot=-90 + 6 * math.sin(lt * 3))
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), W * 0.07, H * 0.62, P(fg, 0.6), 'l')
    if lt > D - 0.04: c.drawColor(col(next_bg(ctx, sc)))
def _ball(x, y, r):
    p = skia.Paint(AntiAlias=True); p.setShader(chrome_shader(x, y, r, (90, 90, 100), dark=True)); return p

# stack_flip: one word stacked three times (outline / solid / outline), swaps every half beat with black/white polarity flips
def s_stack_flip(ctx, c, sc, lt):
    U = ctx.U; D = sc['dur']; words = [ctx.up(w) for w in sc['words']]; per = sc.get('per', 0.5) * ctx.beat
    k = min(int(lt / per), 999); s = words[k % len(words)]; inv = k % 2 == 1
    bg = ctx.pal['light'] if inv else ctx.pal['dark']; fg = ctx.pal['dark'] if inv else ctx.pal['light']; c.drawColor(col(bg))
    u = (lt - k * per); pulse = 1 + 0.12 * math.exp(-u * 16)
    T = Text(ctx, fit_size(ctx, s, sc.get('size', 230) * U, ctx.W * 0.86)); hcap = T.cap(s); gap = hcap * 1.25
    c.save(); c.translate(ctx.cx, ctx.cy); c.scale(pulse, pulse); c.translate(-ctx.cx, -ctx.cy)
    for dy in (-gap, gap): T.draw_mid(c, s, ctx.cx, ctx.cy + dy, P(fg, 0.9, 2.5 * U))
    T.draw_mid(c, s, ctx.cx, ctx.cy, P(fg)); c.restore()
    if sc.get('label'): mono(ctx, 20).draw(c, ctx.up(sc['label']), ctx.W - 80 * U, 90 * U, P(fg, 0.7), 'r')
    if lt > D - 0.04: c.drawColor(col(next_bg(ctx, sc)))

# object_lockup: closing page: left headline, pill CTA with arrow, big floating chrome star (or other object), optional logo
def s_object_lockup(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H
    ac = ctx.pal[sc.get('accent', 'a2')]; push = 1 + 0.04 * prog(lt, 0, D)
    c.save(); c.translate(ctx.cx, ctx.cy); c.scale(push, push); c.translate(-ctx.cx, -ctx.cy)
    obj = sc.get('object', 'star'); k = eob(prog(lt, 0.15, 0.7), 1.5); ox = W * (0.73 if not ctx.portrait else 0.5); oy = H * (0.5 if not ctx.portrait else 0.7) + math.sin(lt * 1.8) * 14 * U
    breathe = 1 + 0.03 * math.sin(lt * 3); sz = min(W, H) * 0.36 * k * breathe
    if sz > 1:
        if obj == 'star': draw_star(ctx, c, ox, oy, sz, lt, ac, rot=-90 + lt * 8)
        else: draw_chrome_tube(ctx, c, obj, ox, oy, sz * 0.85, 0.5, lt * 0.5, ac, lt)
    tc = ac if contrast(ac, bg) > 2.2 else fg
    y = left_lines(ctx, c, sc, lt, fg, tc, W * 0.07, H * 0.28, sc.get('size', 150) * U, W * (0.5 if not ctx.portrait else 0.86))
    if sc.get('cta'):
        a = eoc(prog(lt, 0.6, 0.9)); Tc = Text(ctx, 30 * U); s = ctx.up(sc['cta']); w = Tc.width(s) + 110 * U; x0 = W * 0.07 - (1 - a) * 60 * U; y0 = y + 50 * U
        r = skia.Rect(x0, y0, x0 + w, y0 + 76 * U); c.drawRRect(skia.RRect.MakeRectXY(r, 38 * U, 38 * U), P(ac, a))
        pc = max((ctx.pal['dark'], ctx.pal['light']), key=lambda q: contrast(q, ac)); Tc.draw_mid(c, s, x0 + 36 * U, r.centerY(), P(pc, a), 'l')
        axx = r.right() - 46 * U; ayy = r.centerY(); c.drawLine(axx - 10 * U, ayy + 10 * U, axx + 10 * U, ayy - 10 * U, P(pc, a, 4 * U)); c.drawLine(axx - 4 * U, ayy - 10 * U, axx + 10 * U, ayy - 10 * U, P(pc, a, 4 * U)); c.drawLine(axx + 10 * U, ayy - 10 * U, axx + 10 * U, ayy + 4 * U, P(pc, a, 4 * U))
    if sc.get('meta'): mono(ctx, 19).draw(c, ctx.up(sc['meta']), W * 0.07, H * 0.9, P(fg, 0.55 * eoc(prog(lt, 0.8, 1.1))), 'l')
    c.restore()

SCENES4 = {'select_box': s_select_box, 'code_glitch': s_code_glitch, 'cross_ripple': s_cross_ripple, 'pillar_wave': s_pillar_wave,
           'type_ribbons': s_type_ribbons, 'infinity_particles': s_infinity_particles, 'grid_recap': s_grid_recap,
           'split_hero': s_split_hero, 'text_band': s_text_band, 'beat_jelly': s_beat_jelly, 'stack_flip': s_stack_flip, 'object_lockup': s_object_lockup}
REQUIRED4 = {'select_box': ['word'], 'code_glitch': ['word'], 'cross_ripple': [], 'pillar_wave': [], 'type_ribbons': ['words'],
             'infinity_particles': [], 'grid_recap': [], 'split_hero': ['lines'], 'text_band': [], 'beat_jelly': [], 'stack_flip': ['words'],
             'object_lockup': ['lines']}
STILL4 = {'select_box': 0.6, 'code_glitch': 0.5, 'cross_ripple': 0.55, 'pillar_wave': 0.5, 'type_ribbons': 0.7, 'infinity_particles': 0.6,
          'grid_recap': 0.5, 'split_hero': 0.7, 'text_band': 0.6, 'beat_jelly': 0.55, 'stack_flip': 0.3, 'object_lockup': 0.95}
def events4(sc):
    D = sc['dur']; t = sc['type']
    if t == 'stack_flip':
        per = sc.get('per', 0.5) * (D / sc['beats']); return [per * k for k in range(1, int(D / per))]
    return {'select_box': [0.3, D - 0.35], 'code_glitch': [0.45 * D, 0.62 * D, 0.9 * D], 'cross_ripple': [0.3], 'pillar_wave': [D - 0.3],
            'type_ribbons': [D * 0.6], 'infinity_particles': [D * 0.45, D - 0.3], 'grid_recap': [0.25, D - 0.32], 'split_hero': [0.4, D - 0.28],
            'text_band': [0.4], 'beat_jelly': [D / sc['beats'] * k for k in range(1, int(sc['beats']))], 'object_lockup': [0.5, 0.75]}.get(t)
