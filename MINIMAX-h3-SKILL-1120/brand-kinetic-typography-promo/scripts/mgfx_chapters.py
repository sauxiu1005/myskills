"""Motion modules from the chapter-style reel (orange-ball showreel): physics ball, tracking snap, ripple grid,
particle word, 3D particle sphere, data dashboard, serif flow, decode lockup. Each scene performs its own exit
(drop-through, collapse, disperse, dolly + stripe smear, mask sweep, whip), so the next cut can be a hard cut."""
import math, random
import numpy as np, skia
from mgfx_core import *
from mgfx_recipes import carrier, next_bg, mono, typed, quint, cache

SCR = '#%&*+=<>/\\|01ABCDEFXZ'
def scramble(ctx, c, s, x, y, T, paint, lt, t0, per=0.035, hold=0.18, align='c', track=0.0):
    """Characters flicker through random glyphs, then lock left to right."""
    out = []
    for i, ch in enumerate(s):
        u = lt - t0 - i * per
        if u < 0: out.append(' '); continue
        out.append(ch if (u > hold or ch == ' ' or is_cjk(ch)) else SCR[(int(lt * 50) + i * 7) % len(SCR)])
    T.draw(c, ''.join(out), x, y, paint, align, track)

def bounce_y(t, h0, g_t=0.32, n=3, k=0.42):
    """Height above floor (0..h0) for a ball dropped at t=0 that lands at g_t and bounces n times."""
    if t < g_t: return h0 * (1 - (t / g_t) ** 2), -1
    t -= g_t; d = g_t * 2 * math.sqrt(k); h = h0 * k
    for _ in range(n):
        if t < d: u = t / d; return h * 4 * u * (1 - u), _
        t -= d; d *= math.sqrt(k); h *= k
    return 0.0, n

# 1 ---------- ball_drop: ball falls onto a ruler line with squash & stretch, ruler extends, caption types; ball drops through the line
def s_ball_drop(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy; cc = carrier(ctx, sc)
    R = 26 * U; fy = cy + 40 * U; h0 = ctx.H * 0.5; tout = D - 0.2
    h, ph = bounce_y(lt, h0)
    vel = abs(bounce_y(lt + 0.01, h0)[0] - h) / 0.01 / h0
    near = [abs(lt - tt) for tt in (0.32, 0.32 + 0.64 * 0.65, 0.32 + 0.64 * 0.65 * 1.65)]
    sq = 0.3 * math.exp(-(min(near) / 0.035) ** 2) * (1 if lt < 1.2 else 0)
    sy = 1 - sq + min(0.35, vel * 0.08); sx = 1 / max(0.5, sy)
    y = fy - R - h
    if lt > tout:
        u = prog(lt, tout, D); y = fy - R + eie(u) * ctx.H * 0.7; sy, sx = 1 + 0.8 * u, 1 / (1 + 0.8 * u)
    e = eioe(prog(lt, 0.95, 1.35)); L = ctx.W * 0.36 * e
    c.drawLine(cx - L, fy, cx + L, fy, P(fg, 0.55, 2 * U, cap=False))
    for k in range(-12, 13):
        x = cx + k * ctx.W * 0.03
        if abs(x - cx) <= L: c.drawLine(x, fy, x, fy + (14 if k % 4 == 0 else 7) * U, P(fg, 0.45, 2 * U, cap=False))
    c.save(); c.translate(cx, y + R * (1 - sy)); c.scale(sx, sy)
    if sc.get('shape', ctx.spec.get('carrier_shape')) == 'icon':
        from mgfx_ideaform import rr_path; c.rotate(-90 * eie(prog(lt, 0.0, 0.9))); c.drawPath(rr_path(-R * 1.1, -R * 1.1, R * 2.2, R * 2.2, R * 0.5, 'icon'), P(cc))
    else: c.drawCircle(0, 0, R, P(cc))
    c.restore()
    if lt > tout: c.drawRect(skia.Rect(0, fy + 1, ctx.W, ctx.H), P(bg))  # ball passes "through" the line
    if sc.get('caption'): typed(ctx, c, ctx.up(sc['caption']), cx, fy + 80 * U, mono(ctx, 28), P(fg, 0.9), lt, 1.15, cps=28, align='c')
    if sc.get('kicker'): mono(ctx, 20).draw(c, ctx.up(sc['kicker']), cx, fy + 125 * U, P(fg, 0.45 * eoc(prog(lt, 1.3, 1.5))))

# 2 ---------- tracking_snap: giant word slams from wide tracking to tight with blur over a marquee, then hard-cuts to a colour field, left-aligned
def s_tracking_snap(ctx, c, sc, lt):
    U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; tcut = sc.get('cut_at', 0.48) * D
    phase2 = lt >= tcut
    s2 = dict(sc, bg=sc.get('bg2', 'a3')) if phase2 else sc
    bg, fg, acc, acc2 = ctx.colors(s2); c.drawColor(col(bg))
    word = ctx.up(sc['word']); base = sc.get('size', 260) * U
    if not phase2:
        if sc.get('marquee'):
            m = ctx.up(sc['marquee']) + '   '; Tm = Text(ctx, 70 * U); wm = Tm.width(m); off = -(lt * 500 * U) % wm
            for r, yy in enumerate((H * 0.2, H * 0.84)):
                x = -wm + (off if r == 0 else -off % wm)
                while x < W: Tm.draw(c, m, x, yy, P(fg, 0.1), 'l'); x += wm
        p = prog(lt, 0.0, 0.5); e = eoe(p); T = Text(ctx, fit_size(ctx, word, base, W * 0.9)); n = max(1, len(word) - 1)
        tr = lerp(W * 0.9 / n, -0.02 * T.size, e)
        v = (1 - p) ** 2
        for g in range(6, 0, -1):
            if v > 0.03: T.draw_mid(c, word, ctx.cx - g * v * 70 * U, ctx.cy, P(fg, 0.07), 'c', tr)
        T.draw_mid(c, word, ctx.cx, ctx.cy, P(fg), 'c', tr)
        if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), ctx.cx, ctx.cy + T.cap(word) / 2 + 70 * U, P(fg, 0.7 * e))
    else:
        u = lt - tcut; punch = 1 + 0.08 * math.exp(-u * 18); T = Text(ctx, fit_size(ctx, word, base * 1.15, W * 0.86))
        x0 = W * 0.07; c.save(); c.translate(x0, ctx.cy); c.scale(punch, punch); c.translate(-x0, -ctx.cy)
        T.draw_mid(c, word, x0, ctx.cy, P(fg), 'l', -0.02 * T.size); c.restore()
        rd = sc.get('readout') or f'{ctx.bpm:.2f} BPM'
        if (int(u / (ctx.beat / 2))) % 2 == 0 or u > D - tcut - 0.3: mono(ctx, 24).draw(c, ctx.up(rd), x0, H - 100 * U, P(fg, 0.9), 'l')
        if sc.get('label'): mono(ctx, 24).draw(c, ctx.up(sc['label']), W - x0, H - 100 * U, P(fg, 0.7), 'r')

# 3 ---------- grid_ripple: matrix of rounded squares breathes with a radial wave (square <-> circle), accents light up, collapses to one dot
def s_grid_ripple(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy; cc = carrier(ctx, sc)
    sp = 64 * U; nx = int(ctx.W / sp / 2) + 2; ny = int(ctx.H / sp / 2) + 2; tc = D * 0.66
    push = 1 + 0.06 * prog(lt, 0, tc); grow = eoc(prog(lt, 0, 0.35))
    c.save(); c.translate(cx, cy); c.scale(push, push)
    rmax = math.hypot(nx, ny)
    for j in range(-ny, ny + 1):
        for i in range(-nx, nx + 1):
            r = math.hypot(i, j); w = math.sin(r * 0.7 - lt * 7.5)
            cl = eie(prog(lt, tc + 0.25 * (1 - r / rmax), D - 0.06))
            x, y = i * sp * (1 - cl), j * sp * (1 - cl)
            s = sp * (0.18 + 0.2 * (w + 1) / 2) * grow * (1 - 0.7 * cl); rr = s * (w + 1) / 2
            hot = (i * 7 + j * 13) % 11 == 0 and w > 0.2
            rect = skia.Rect(x - s, y - s, x + s, y + s); rrect = skia.RRect.MakeRectXY(rect, rr, rr)
            if hot: c.drawRRect(rrect, P(cc))
            elif (i + j) % 5 == 0: c.drawRRect(rrect, P(cc, 0.8, 2.5 * U))
            else: c.drawRRect(rrect, P(fg, 0.12 + 0.18 * (w + 1) / 2))
    c.restore()
    k = prog(lt, D - 0.12, D)
    if k > 0: c.drawCircle(cx, cy, 14 * U * eob(k, 2), P(cc))
    if sc.get('word'):
        s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, 120 * U, ctx.W * 0.6)); e = quint(prog(lt, 0.15, 0.6)); a = 1 - prog(lt, tc, tc + 0.2)
        y = ctx.H - 110 * U; c.save(); c.clipRect(skia.Rect(0, y - T.cap(s) * 1.2, ctx.W, y + 8 * U))
        c.drawRect(skia.Rect(70 * U, y - T.cap(s) - 26 * U, 70 * U + (T.width(s) + 50 * U) * e, y + 26 * U), P(bg, 0.9 * a))
        T.draw(c, s, 95 * U, y + (1 - e) * T.cap(s) * 1.3, P(fg, a), 'l'); c.restore()
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), ctx.W - 80 * U, 90 * U, P(fg, 0.7 * (1 - prog(lt, tc, tc + 0.2))), 'r')

# 4 ---------- particle_word: particles swarm into a word, shimmer in turbulence, then wind blows them off to the right
def word_points(ctx, s, size, n):
    def mk():
        k = 4; T = Text(ctx, size / k); w = int(T.width(s)) + 8; h = int(T.cap(s) * 1.5) + 8
        arr = np.zeros((h, w, 4), np.uint8); surf = skia.Surface(arr); cv = surf.getCanvas()
        T.draw(cv, s, 4, h * 0.5 + T.cap(s) / 2, P((255, 255, 255))); surf.flushAndSubmit()
        ys, xs = np.nonzero(arr[..., 3] > 128); rng = np.random.default_rng(3)
        idx = rng.choice(len(xs), min(n, len(xs)), replace=len(xs) < n)
        jit = rng.uniform(-0.5, 0.5, (len(idx), 2))
        px = (xs[idx] + jit[:, 0] - w / 2) * k; py = (ys[idx] + jit[:, 1] - h / 2) * k
        return px, py, rng.uniform(0, 1, len(idx)), rng.uniform(-1, 1, (len(idx), 2))
    return cache(ctx, ('pw', s, round(size)), mk)
def s_particle_word(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    s = ctx.up(sc['word']); size = fit_size(ctx, s, sc.get('size', 300) * U, ctx.W * 0.8)
    px, py, rnd, home = word_points(ctx, s, size, int(sc.get('count', 2600)))
    zoom = lerp(1.06, 1.0, eoc(prog(lt, 0, D))); c.save(); c.translate(cx, cy); c.scale(zoom, zoom)
    ca, cb = ctx.pal[sc.get('from', 'a1')], ctx.pal[sc.get('to', 'a3')]; mid = fg
    td = D * 0.68; xs = (px - px.min()) / max(1, px.max() - px.min())
    for i in range(len(px)):
        a = eioc(prog(lt, 0.02 + rnd[i] * 0.2, 0.45 + rnd[i] * 0.2))
        sx = home[i, 0] * ctx.W * 0.7; sy = home[i, 1] * ctx.H * 0.6
        x = lerp(sx, px[i], a) + math.sin(lt * 6 + i) * 1.8 * U; y = lerp(sy, py[i], a) + math.cos(lt * 5 + i * 1.3) * 1.8 * U
        w = prog(lt, td + (1 - xs[i]) * 0.25 + rnd[i] * 0.1, D)
        if w > 0:
            w2 = w * w; x += w2 * ctx.W * (0.8 + rnd[i]); y += math.sin(xs[i] * 9 + lt * 4) * 90 * U * w + (rnd[i] - 0.5) * 120 * U * w2
        q = xs[i]; colr = lc(ca, mid, q * 2) if q < 0.5 else lc(mid, cb, q * 2 - 1)
        c.drawCircle(x, y, (2.6 + 1.6 * rnd[i]) * U, P(colr, 0.35 + 0.65 * a))
    c.restore()
    if sc.get('label'): typed(ctx, c, ctx.up(sc['label']), cx, cy + size * 0.65, mono(ctx, 26), P(fg, 0.8 * (1 - prog(lt, td, td + 0.2))), lt, 0.5, align='c')

# 5 ---------- sphere3d: twisted particle sphere spins over a perspective grid floor, camera orbits, dollies into the core, stripes smear down
def s_sphere3d(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy; W, H = ctx.W, ctx.H
    def mk():
        rng = np.random.default_rng(9); n = 1500; u = rng.uniform(-1, 1, n); th = rng.uniform(0, 2 * PI, n)
        r = np.sqrt(1 - u * u); tw = 1.2 * u
        return np.stack([r * np.cos(th + tw), u, r * np.sin(th + tw)], 1), u
    pts, lat = cache(ctx, 'sph', mk)
    ts = D - 0.22; dolly = eie(prog(lt, D * 0.55, ts)); orbit = 0.4 * lt + 2.0 * dolly
    dist = lerp(4.2, 0.35, dolly); f = H * 0.85
    breathe = 1 + 0.08 * np.sin(lat * 6 - lt * 5)
    P3 = pts * breathe[:, None]
    ry = lt * 1.1; x = P3[:, 0] * math.cos(ry) + P3[:, 2] * math.sin(ry); z = -P3[:, 0] * math.sin(ry) + P3[:, 2] * math.cos(ry); y = P3[:, 1]
    tilt = 0.35; y, z = y * math.cos(tilt) - z * math.sin(tilt), y * math.sin(tilt) + z * math.cos(tilt)
    co, so = math.cos(orbit), math.sin(orbit)
    # floor grid
    gp = P(fg, 0.18, 1.5 * U)
    def proj(X, Y, Z):
        X2 = X * co + Z * so; Z2 = -X * so + Z * co; d = dist + Z2
        return (cx + f * X2 / d, cy - f * Y / d) if d > 0.2 else None
    for k in range(-6, 7):
        a1 = proj(k * 0.6, -1.5, -4); a2 = proj(k * 0.6, -1.5, 4); b1 = proj(-4, -1.5, k * 0.6); b2 = proj(4, -1.5, k * 0.6)
        if a1 and a2: c.drawLine(*a1, *a2, gp)
        if b1 and b2: c.drawLine(*b1, *b2, gp)
    X2 = x * co + z * so; Z2 = -x * so + z * co; d = dist + Z2
    order = np.argsort(-d)
    for i in order:
        if d[i] < 0.15: continue
        sx = cx + f * X2[i] / d[i]; sy = cy - f * y[i] / d[i]
        if not (-50 < sx < W + 50 and -50 < sy < H + 50): continue
        c.drawCircle(sx, sy, min(40 * U, 6 * U / d[i]), P(lc(acc, acc2, (lat[i] + 1) / 2), clamp(1.4 - d[i] / 5)))
    if sc.get('word'):
        s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, 110 * U, W * 0.5)); a = eoc(prog(lt, 0.2, 0.5)) * (1 - dolly)
        T.draw(c, s, 80 * U, 80 * U + T.cap(s), P(fg, a), 'l')
        if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), 82 * U, 130 * U + T.cap(s), P(fg, 0.7 * a), 'l')
    smear(ctx, c, sc, prog(lt, ts, D))

def smear(ctx, c, sc, p):
    """Vertical stripes roll down and fill with the next background."""
    if p <= 0: return
    cols = [ctx.pal[r] for r in ('a3', 'a1', 'light', 'a2')] + [next_bg(ctx, sc)]; n = 10; w = ctx.W / n
    for k in range(n):
        for j, cl in enumerate(cols):
            q = eioe(clamp(p * 1.6 - k * 0.04 - j * 0.12)); c.drawRect(skia.Rect(k * w, -1, (k + 1) * w + 1, ctx.H * q), P(cl))

# 6 ---------- data_dash: stripes lift to reveal a dashboard: three count-up metrics, staggered elastic bars, trim-path line, ring, floating tags
def parse_num(v):
    import re
    m = re.search(r'[\d,.]+', v)
    if not m: return None
    s = m.group(0); num = float(s.replace(',', '')); dec = len(s.split('.')[1]) if '.' in s else 0
    return v[:m.start()], num, dec, v[m.end():], ',' in s
def count_fmt(v, u):
    p = parse_num(v)
    if not p: return v
    pre, num, dec, suf, comma = p; x = num * u
    s = f'{x:,.{dec}f}' if comma else f'{x:.{dec}f}'
    return pre + s + suf
def s_data_dash(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; cc = carrier(ctx, sc)
    push = 1 + 0.04 * prog(lt, 0, D); c.save(); c.translate(ctx.cx, ctx.cy); c.scale(push, push); c.rotate(-1.2 * prog(lt, 0, D)); c.translate(-ctx.cx, -ctx.cy)
    stats = sc.get('stats', [])[:3]; x0 = W * 0.07; t0 = 0.3
    Tm = mono(ctx, 20)
    for k, st in enumerate(stats):
        y = H * (0.3 + 0.21 * k); u = eoe(prog(lt, t0 + 0.1 * k, t0 + 0.75 + 0.1 * k)); a = eoc(prog(lt, t0 + 0.1 * k, t0 + 0.3 + 0.1 * k))
        T = Text(ctx, 110 * U); T.draw(c, count_fmt(st['value'], u), x0, y + (1 - a) * 30 * U, P(fg, a), 'l')
        Tm.draw(c, ctx.up(st.get('label', '')), x0 + 4 * U, y + 40 * U, P(fg, 0.6 * a), 'l')
    cw, ch = W * 0.42, H * 0.56; cx0 = W * 0.5; cy0 = H * 0.22; ca = eob(prog(lt, t0, t0 + 0.4), 1.6)
    c.save(); c.translate(cx0 + cw / 2, cy0 + ch / 2); c.scale(lerp(0.9, 1, ca), lerp(0.9, 1, ca)); c.translate(-(cx0 + cw / 2), -(cy0 + ch / 2))
    r = skia.Rect(cx0, cy0, cx0 + cw, cy0 + ch)
    c.drawRRect(skia.RRect.MakeRectXY(r.makeOffset(0, 18 * U), 30 * U, 30 * U), P((0, 0, 0), 0.12, blur=26 * U))
    card = ctx.pal['light'] if bg != ctx.pal['light'] else lc(ctx.pal['light'], (255, 255, 255), 0.7)
    c.drawRRect(skia.RRect.MakeRectXY(r, 30 * U, 30 * U), P(card))
    tf = max((ctx.pal['dark'], ctx.pal['light']), key=lambda q: contrast(q, card))
    bars = sc.get('bars') or [0.35, 0.5, 0.42, 0.68, 0.6, 0.85, 0.95]; nb = len(bars); bx0 = cx0 + 50 * U; bw = (cw - 100 * U) / nb; by = cy0 + ch - 50 * U
    for k, v in enumerate(bars):
        q = eob(prog(lt, t0 + 0.25 + 0.035 * k, t0 + 0.75 + 0.035 * k), 2.2); hh = v * ch * 0.45 * q
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(bx0 + k * bw + bw * 0.2, by - hh, bx0 + (k + 0.8) * bw, by), 8 * U, 8 * U), P(cc if k == nb - 1 else lc(tf, card, 0.75)))
    line = sc.get('line') or [0.2, 0.35, 0.3, 0.55, 0.5, 0.72, 0.8]; tp = eioc(prog(lt, t0 + 0.4, t0 + 1.1))
    pts = [(bx0 + (k + 0.5) * bw, cy0 + ch * 0.5 - v * ch * 0.3) for k, v in enumerate(line)]
    pth = skia.Path(); pth.moveTo(*pts[0])
    for q in pts[1:]: pth.lineTo(*q)
    pe = P(acc2 if acc2 != cc else acc, 1, 4 * U); meas = skia.PathMeasure(pth, False); L = meas.getLength()
    pe.setPathEffect(skia.DashPathEffect.Make([L * tp + 0.1, L + 1], 0)); c.drawPath(pth, pe)
    for k, q in enumerate(pts):
        if tp * (len(pts) - 1) >= k: c.drawCircle(*q, 6 * U, P(acc2 if acc2 != cc else acc))
    if sc.get('ring'):
        rc = (cx0 + cw - 80 * U, cy0 + 80 * U); rp = eoe(prog(lt, t0 + 0.3, t0 + 1.0)); num = parse_num(sc['ring']); frac = (num[1] / 100) if num else 1
        c.drawCircle(*rc, 44 * U, P(lc(tf, card, 0.85), 1, 8 * U))
        c.drawArc(skia.Rect(rc[0] - 44 * U, rc[1] - 44 * U, rc[0] + 44 * U, rc[1] + 44 * U), -90, 360 * frac * rp, False, P(cc, 1, 8 * U))
        mono(ctx, 18).draw_mid(c, count_fmt(sc['ring'], rp), rc[0], rc[1], P(tf))
    for k, tg in enumerate(sc.get('tags', [])[:3]):
        q = eob(prog(lt, t0 + 0.6 + 0.12 * k, t0 + 0.95 + 0.12 * k), 2); px, py = pts[min(len(pts) - 1, 2 + 2 * k)]
        py -= 50 * U + math.sin(lt * 3 + k) * 6 * U; Tt = mono(ctx, 18); w = Tt.width(ctx.up(tg)) + 30 * U
        rr = skia.Rect(px - w / 2, py - 20 * U + (1 - q) * 30 * U, px + w / 2, py + 20 * U + (1 - q) * 30 * U)
        c.drawRRect(skia.RRect.MakeRectXY(rr, 20 * U, 20 * U), P(tf, clamp(q))); Tt.draw_mid(c, ctx.up(tg), px, rr.centerY(), P(card, clamp(q)))
    c.restore(); c.restore()
    if sc.get('title'): mono(ctx, 22).draw(c, ctx.up(sc['title']), x0, H * 0.14, P(fg, 0.7), 'l')
    # entry: stripes lift off; exit: dark sweep with flowing curves
    pin = prog(lt, 0, 0.3)
    if pin < 1:
        cols = [ctx.pal[r] for r in ('a3', 'a1', 'light')]; n = 10; w = W / n
        for k in range(n):
            for j, cl in enumerate(cols):
                q = eioe(clamp(pin * 1.6 - k * 0.04 - (2 - j) * 0.1)); c.drawRect(skia.Rect(k * w, H * q, (k + 1) * w + 1, H + 1), P(cl))
    sweep(ctx, c, sc, prog(lt, D - 0.25, D))

def sweep(ctx, c, sc, p):
    if p <= 0: return
    nb = next_bg(ctx, sc); e = eioe(p); W, H, U = ctx.W, ctx.H, ctx.U; x = W * (1 - e) - 120 * U
    c.drawRect(skia.Rect(x, 0, W + 10, H), P(nb))
    for k in range(5):
        pth = skia.Path(); pth.moveTo(x, 0)
        for j in range(21):
            yy = H * j / 20; pth.lineTo(x - (40 + 30 * k) * U * math.sin(PI * j / 20) * (1 - e * 0.5), yy)
        c.drawPath(pth, P(ctx.pal['a1'] if k % 2 == 0 else ctx.pal['a3'], 0.8, 3 * U))

# 7 ---------- serif_flow: italic serif statement over glowing flowing wave lines, two lines drift in parallax, whip-pans off right
def s_serif_flow(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; cc = carrier(ctx, sc)
    tw = D - 0.25; whip = eie(prog(lt, tw, D)); c.save(); c.translate(-W * 1.1 * whip, 0)
    push = 1 + 0.05 * prog(lt, 0, D); c.translate(ctx.cx, ctx.cy); c.scale(push, push); c.translate(-ctx.cx, -ctx.cy)
    for k in range(14):
        pth = skia.Path(); ph = k * 0.35; amp = (60 + 10 * k) * U; yb = H * (0.62 if k % 2 else 0.4) + (k - 7) * 6 * U
        for j in range(61):
            x = W * j / 60; y = yb + amp * math.sin(j * 0.12 + lt * 2.2 + ph) * math.sin(j * 0.05 + ph * 0.5)
            pth.moveTo(x, y) if j == 0 else pth.lineTo(x, y)
        cl = acc if k % 3 == 0 else acc2 if k % 3 == 1 else fg
        c.drawPath(pth, P(cl, 0.25, 6 * U, blur=8 * U)); c.drawPath(pth, P(cl, 0.5, 1.5 * U))
    lines = sc['lines'][:2]; Ts = []
    for i, s in enumerate(lines):
        T = Text(ctx, fit_size(ctx, s, sc.get('size', 170) * U, W * 0.72, 'serif_it'), 'serif_it')
        e = quint(prog(lt, 0.05 + 0.18 * i, 0.6 + 0.18 * i)); drift = (1 if i == 0 else -1) * prog(lt, 0, D) * 40 * U
        x = W * (0.1 if i == 0 else 0.22) + drift; y = H * 0.42 + i * T.cap(s) * 1.45
        c.save(); c.clipRect(skia.Rect(0, y - T.cap(s) * 1.4, W, y + T.cap(s) * 0.35))
        T.draw(c, s, x, y + (1 - e) * T.cap(s) * 1.6, P(fg if i == 0 else cc), 'l'); c.restore()
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), W * 0.1, H * 0.85, P(fg, 0.6 * eoc(prog(lt, 0.6, 0.9))), 'l')
    c.restore()
    if lt > tw - 0.15:  # carrier block + dot enter bottom-right just before the whip
        a = eob(prog(lt, tw - 0.15, tw + 0.05), 2); x = W - 180 * U - W * 0.4 * whip; y = H - 160 * U
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(x, y, x + 90 * U * a, y + 90 * U * a), 14 * U, 14 * U), P(cc)); c.drawCircle(x + 130 * U, y + 45 * U, 14 * U * a, P(fg))
    if whip > 0:
        for j in range(18):
            yy = H * (j + 0.5) / 18; c.drawLine(W * (1 - whip), yy, W * (1 - whip) + W * whip * 0.6, yy, P(fg, 0.25 * whip, 3 * U))
    if lt > D - 0.04: c.drawColor(col(next_bg(ctx, sc)))

# 8 ---------- decode_lockup: heavy wordmark pulls back, carrier dot arcs in and lands as the full stop, rule opens, subtitle decodes, chapter nav lights up
def s_decode_lockup(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; cc = carrier(ctx, sc); cx, cy = ctx.cx, ctx.cy
    kind = sc.get('font', 'display'); title = ctx.up(sc['title']) if kind == 'display' else sc['title']
    T = Text(ctx, fit_size(ctx, title, sc.get('size', 240) * U, W * 0.66, kind), kind); tw = T.width(title); cap = T.cap(title); dR = cap * 0.13
    sc_ = lerp(1.25, 1.0, eoe(prog(lt, 0, 0.9))); a = eoc(prog(lt, 0, 0.25))
    base = cy + cap * 0.2; x0 = cx - (tw + dR * 2.6) / 2
    lg = sc.get('logo')
    if lg and lg in ctx.images:  # optional logo pops in above the wordmark
        from mgfx_scenes import draw_image
        la = eoc(prog(lt, 0.05, 0.4)); ls = eob(prog(lt, 0.05, 0.45), 2); ly = base - cap - 120 * U
        c.save(); c.translate(cx, ly); c.scale(max(ls, 0.01), max(ls, 0.01)); draw_image(ctx, c, lg, 0, 0, 260 * U, 130 * U, alpha=la, shadow=False); c.restore()
    c.save(); c.translate(cx, cy); c.scale(sc_, sc_); c.translate(-cx, -cy)
    T.draw(c, title, x0, base, P(fg, a), 'l')
    tx, ty = x0 + tw + dR * 1.4, base - dR
    u = prog(lt, 0.2, 0.62)
    if lt < 0.62:
        X = lerp(tx - W * 0.35, tx, u); Y = ty - math.sin(PI * u) * H * 0.35 + (1 - u) * -H * 0.1; sq = 0
    else:
        tb = lt - 0.62; X = tx; Y = ty - 50 * U * abs(math.sin(tb * PI / 0.18)) * math.exp(-tb * 10); sq = 0.35 * math.exp(-tb * 12)
    if lt > 0.2:
        c.save(); c.translate(X, Y + dR * sq); c.scale(1 + sq, 1 - sq); c.drawCircle(0, 0, dR, P(cc)); c.restore()
    c.restore()
    lw = eioe(prog(lt, 0.75, 1.1)) * W * 0.3; yl = base + 70 * U
    c.drawLine(cx - lw, yl, cx + lw, yl, P(fg, 0.5, 2 * U, cap=False))
    if sc.get('subtitle'): scramble(ctx, c, ctx.up(sc['subtitle']), cx, yl + 60 * U, mono(ctx, 28), P(cc), lt, 0.85, track=6 * U)
    if sc.get('meta'): scramble(ctx, c, ctx.up(sc['meta']), cx, yl + 105 * U, mono(ctx, 19), P(fg, 0.6), lt, 1.05, per=0.02)
    nav = sc.get('nav')
    if nav is None: nav = [s.get('name', '') for s in ctx.scenes[:-1] if s.get('name')][:7]
    if nav:
        Tn = mono(ctx, 17); items = [f'{k:02d} {ctx.up(n)}' for k, n in enumerate(nav)]; gap = 40 * U
        tot = sum(Tn.width(s) for s in items) + gap * (len(items) - 1); x = cx - tot / 2; y = H - 70 * U
        if tot > W * 0.9: items = [f'{k:02d}' for k in range(len(nav))]; tot = sum(Tn.width(s) for s in items) + gap * (len(items) - 1); x = cx - tot / 2
        for k, s in enumerate(items):
            on = lt > 1.0 + 0.07 * k; Tn.draw(c, s, x, y, P(cc if on and k == len(items) - 1 else fg, 0.85 if on else 0.2), 'l'); x += Tn.width(s) + gap
    if sc.get('cta'):
        ca = eoc(prog(lt, 1.2, 1.45)); Tc = mono(ctx, 26); s = ctx.up(sc['cta']); w2 = Tc.width(s); y = yl + 175 * U
        r = skia.Rect(cx - w2 / 2 - 36 * U, y - 32 * U, cx + w2 / 2 + 36 * U, y + 32 * U); c.drawRRect(skia.RRect.MakeRectXY(r, 32 * U, 32 * U), P(fg, ca, 2 * U))
        Tc.draw_mid(c, s, cx, y, P(fg, ca))

SCENES3 = {'ball_drop': s_ball_drop, 'tracking_snap': s_tracking_snap, 'grid_ripple': s_grid_ripple, 'particle_word': s_particle_word,
           'sphere3d': s_sphere3d, 'data_dash': s_data_dash, 'serif_flow': s_serif_flow, 'decode_lockup': s_decode_lockup}
REQUIRED3 = {'ball_drop': [], 'tracking_snap': ['word'], 'grid_ripple': [], 'particle_word': ['word'], 'sphere3d': [],
             'data_dash': ['stats'], 'serif_flow': ['lines'], 'decode_lockup': ['title']}
STILL3 = {'ball_drop': 0.75, 'tracking_snap': 0.3, 'grid_ripple': 0.4, 'particle_word': 0.55, 'sphere3d': 0.35, 'data_dash': 0.85,
          'serif_flow': 0.6, 'decode_lockup': 0.97}
def events3(sc):
    D = sc['dur']
    return {'ball_drop': [0.32, D - 0.2], 'tracking_snap': [0.42, sc.get('cut_at', 0.48) * D], 'grid_ripple': [D * 0.66],
            'particle_word': [0.45, D * 0.68], 'sphere3d': [D * 0.55, D - 0.22], 'data_dash': [0.3, 0.75], 'serif_flow': [0.1, D - 0.25],
            'decode_lockup': [0.62]}.get(sc['type'])

# scenes that finish their own hand-off: the cut into the next scene is a hard cut
import mgfx_recipes as _r
SELF_EXIT = set(_r.SCENES2) | set(SCENES3) | {'select_box', 'code_glitch', 'cross_ripple', 'pillar_wave', 'type_ribbons', 'infinity_particles', 'grid_recap', 'split_hero', 'text_band', 'beat_jelly', 'stack_flip', 'comet_burst', 'beat_word', 'color_matrix', 'fluid_blob', 'sphere_burst', 'ui_cards'}
RECIPE_DEFAULTS = {'dot_reel': dict(hud=False), 'chapter_reel': dict(hud=True, hud_mode='chapter'), 'tech_reel': dict(hud=True, hud_mode='tech'), 'page_reel': dict(hud=True, hud_mode='pages'), 'ignite_reel': dict(hud=True, hud_mode='reel')}
_r.RECIPES['chapter_reel'] = ['ball_drop', 'tracking_snap', 'grid_ripple', 'particle_word', 'sphere3d', 'data_dash', 'serif_flow', 'decode_lockup']
_r.RECIPES['tech_reel'] = ['ball_drop', 'select_box', 'code_glitch', 'cross_ripple', 'pillar_wave', 'type_ribbons', 'infinity_particles', 'grid_recap', 'dot_lockup']
_r.RECIPES['page_reel'] = ['split_hero', 'text_band', 'split_hero', 'beat_jelly', 'stack_flip', 'object_lockup']
_r.RECIPES['ignite_reel'] = ['comet_burst', 'beat_word', 'color_matrix', 'fluid_blob', 'sphere_burst', 'ui_cards', 'arc_lockup']
