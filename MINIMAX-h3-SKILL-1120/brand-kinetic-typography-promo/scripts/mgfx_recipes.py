"""Motion recipe `dot_reel` (贯穿圆点): one carrier dot drives every cut.
Each scene performs its own hand-off in its last ~0.25 s (burst fill, collapse to a point,
particles flattening into a grid, dolly-in, ribbon exit, dot flight), so these scenes are joined
with transition `cut`; spec `"recipe": "dot_reel"` makes `cut` the default."""
import math, random
import numpy as np, skia
from mgfx_core import *
from mgfx_scenes import draw_image

def carrier(ctx, sc): return ctx.pal[sc.get('carrier') or ctx.spec.get('carrier', 'a1')]
def next_bg(ctx, sc):
    i = sc['i'] + 1
    return ctx.pal[ctx.scenes[i].get('bg', 'dark')] if i < len(ctx.scenes) else ctx.pal['dark']
def mono(ctx, size): return ctx.T(size, 'mono')
def typed(ctx, c, s, x, y, T, paint, lt, t0, cps=30, align='l', track=0.0):
    n = int(clamp((lt - t0) * cps, 0, len(s)))
    if n <= 0: return
    x0 = x - T.width(s, track) / 2 if align == 'c' else x
    T.draw(c, s[:n], x0, y, paint, 'l', track)
def quint(p): return 1 - (1 - clamp(p)) ** 5
def cache(ctx, key, fn):
    d = ctx.__dict__.setdefault('_rcache', {})
    if key not in d: d[key] = fn()
    return d[key]

# 1 ---------- dot_split: dot breathes, splits on the 2nd beat, orbits, collapses, bursts to fill the next background
def s_dot_split(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; b = ctx.beat
    cx, cy = ctx.cx, ctx.cy; cc = carrier(ctx, sc); nb = next_bg(ctx, sc); Lg = math.hypot(ctx.W, ctx.H)
    a0 = eoc(prog(lt, 0, 0.5))
    c.drawLine(cx - 70 * U * a0, cy, cx + 70 * U * a0, cy, P(fg, 0.3, 2 * U)); c.drawLine(cx, cy - 70 * U * a0, cx, cy + 70 * U * a0, P(fg, 0.3, 2 * U))
    for r, sp, dash in ((190, 20, [3, 12]), (290, -12, [26, 16])):
        p = P(fg, 0.22, 2 * U, cap=False); p.setPathEffect(skia.DashPathEffect.Make([d * U for d in dash], 0))
        c.save(); c.translate(cx, cy); c.rotate(lt * sp); R = r * U * a0; c.drawArc(skia.Rect(-R, -R, R, R), -90, 360 * a0, False, p); c.restore()
    ts = min(b, D * 0.3); tb = D - 0.22; tc = max(ts + 0.5, tb - max(0.45, b))
    n = int(sc.get('count', 4)); R0 = 24 * U
    for k in range(int(D / b) + 1):
        u = lt - k * b
        if 0 <= u < 0.45 and lt < tb:
            q = eoc(u / 0.45); c.drawCircle(cx, cy, R0 + q * 230 * U, P(cc, (1 - q) * 0.5, 3 * U))
    sp = eob(prog(lt, ts, ts + 0.35), 2.4); cl = eie(prog(lt, tc, tb)); spin = prog(lt, ts + 0.3, tb)
    orbit = math.radians(45) * sp + 2 * PI * 1.6 * eie(spin); dist = 160 * U * sp * (1 - cl)
    if lt < ts:
        br = 1 + 0.12 * math.sin(lt * 4 * PI / b); c.drawCircle(cx, cy, R0 * br * eob(prog(lt, 0, 0.3), 2.5), P(cc))
    elif lt < tb:
        for j in range(n):
            for g in range(5, -1, -1):
                a = orbit - g * 0.07 * (1 + 3 * spin) + j * 2 * PI / n
                c.drawCircle(cx + dist * math.cos(a), cy + dist * math.sin(a), R0 * 0.8 * (1 - g * 0.12), P(cc, 1 if g == 0 else 0.18))
    else:
        s = 1 - 0.2 * eoc(prog(lt, tb, tb + 0.06)); q = prog(lt, tb + 0.05, D)
        c.drawCircle(cx, cy, R0 * s + eie(q) * Lg * 0.62, P(lc(cc, nb, q)))
    if sc.get('kicker'): mono(ctx, 22).draw(c, ctx.up(sc['kicker']), 80 * U, 96 * U, P(fg, 0.7 * a0), 'l')
    if sc.get('caption') and lt < tb: typed(ctx, c, ctx.up(sc['caption']), cx, cy + 300 * U, mono(ctx, 30), P(fg, 0.9), lt, ts + 0.1, align='c')

# 2 ---------- snap_type: line 1 snaps in from the right with motion trails, line 2 slices up from below,
#              type squashes on the beat, brackets tick; ends collapsing into a point
def s_snap_type(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; b = ctx.beat; W = ctx.W
    lines = [ctx.up(s) for s in sc['lines'][:2]]
    Ts = [Text(ctx, fit_size(ctx, s, sc.get('size', 210) * U, W * 0.86)) for s in lines]
    caps = [T.cap(s) for T, s in zip(Ts, lines)]; gap = 44 * U
    total = sum(caps) + gap * (len(lines) - 1); y = ctx.cy - total / 2
    k = eie(prog(lt, D - 0.26, D - 0.05)); zs = 1 - 0.985 * k; t2 = min(b, D * 0.3)
    c.save(); c.translate(ctx.cx, ctx.cy); c.scale(zs, zs); c.translate(-ctx.cx, -ctx.cy)
    sq = 0.0
    for j in range(1, int(D / b) + 1):
        if t2 + 0.3 < j * b <= lt: sq = max(sq, math.exp(-(lt - j * b) * 14))
    for i, (s, T, ch) in enumerate(zip(lines, Ts, caps)):
        base = y + ch; y = base + gap; t0 = 0.02 if i == 0 else t2
        p = prog(lt, t0, t0 + 0.42); e = quint(p)
        if p <= 0: continue
        c.save(); mid = base - ch / 2; c.translate(ctx.cx, mid); c.scale(1 + 0.1 * sq, 1 - 0.16 * sq); c.translate(-ctx.cx, -mid)
        if i == 0:
            off = (1 - e) * W * 1.1; v = (1 - p) ** 3
            if v > 0.02:
                for g in range(8, 0, -1): T.draw(c, s, ctx.cx + off + g * v * 90 * U, base, P(fg, 0.07))
            T.draw(c, s, ctx.cx + off, base, P(fg))
        else:
            rng = random.Random(11); ns = 6
            for kk in range(ns):
                ya = base - ch * 1.1 + kk * ch * 1.25 / ns
                c.save(); c.clipRect(skia.Rect(0, ya, W, ya + ch * 1.25 / ns + 1))
                T.draw(c, s, ctx.cx + rng.uniform(-1, 1) * 260 * U * (1 - e), base + (1 - e) * ch * 1.4, P(fg)); c.restore()
        c.restore()
    bx = max(T.width(s) for T, s in zip(Ts, lines)) / 2 + 60 * U; by = total / 2 + 50 * U; L = 46 * U; jj = 10 * U * sq; a = eoc(prog(lt, 0.25, 0.5))
    for sx_, sy_ in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        X = ctx.cx + sx_ * (bx + jj); Y = ctx.cy + sy_ * (by + jj)
        c.drawLine(X, Y, X - sx_ * L, Y, P(fg, a, 4 * U, cap=False)); c.drawLine(X, Y, X, Y - sy_ * L, P(fg, a, 4 * U, cap=False))
    if sc.get('kicker'): mono(ctx, 22).draw(c, ctx.up(sc['kicker']), ctx.cx, ctx.cy - by - 40 * U, P(fg, 0.8 * a))
    c.restore()
    if lt > D - 0.06:
        c.drawColor(col(next_bg(ctx, sc))); c.drawCircle(ctx.cx, ctx.cy, 10 * U, P(carrier(ctx, sc)))

# 3 ---------- shape_spin: rounded square spins 720° morphing square<->circle inside a live measurement frame,
#              then breaks into particles that form a sunflower spiral, then flatten into the next grid
def s_shape_spin(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    cc = carrier(ctx, sc); nb = next_bg(ctx, sc); scol = ctx.pal[sc.get('shape_color', 'a3')]
    tA = D * 0.52; tC = D - 0.28; w = 170 * U; f = eioc(prog(lt, tC, D - 0.02))
    c.drawColor(col(lc(bg, nb, f)))
    rot = 720 * eioc(prog(lt, 0, tA)); m = 0.5 - 0.5 * math.cos(lt * PI / ctx.beat); rr = lerp(28 * U, w, m); pop = eob(prog(lt, 0, 0.35), 2.0)
    if lt < tA:
        for k in range(3):
            j = math.sin(lt * 40 + k * 2) * 6 * U * (1 + k); ww = (w + (k + 1) * 34 * U + j) * pop; r2 = min(ww, rr + (k + 1) * 34 * U)
            c.save(); c.translate(cx, cy); c.rotate(rot * (1 - 0.15 * (k + 1)))
            c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(-ww, -ww, ww, ww), r2, r2), P(fg, 0.25 - 0.06 * k, 2 * U)); c.restore()
        c.save(); c.translate(cx, cy); c.rotate(rot); ww = w * pop
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(-ww, -ww, ww, ww), rr * pop, rr * pop), P(scol)); c.restore()
        bw = w * 1.45 * pop; a = eoc(prog(lt, 0.2, 0.5))
        p = P(fg, 0.7 * a, 2 * U, cap=False); p.setPathEffect(skia.DashPathEffect.Make([10 * U, 8 * U], 0))
        c.drawRect(skia.Rect(cx - bw, cy - bw, cx + bw, cy + bw), p)
        for sx_, sy_ in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
            X, Y = cx + sx_ * bw, cy + sy_ * bw; r_ = skia.Rect(X - 7 * U, Y - 7 * U, X + 7 * U, Y + 7 * U)
            c.drawRect(r_, P(bg)); c.drawRect(r_, P(fg, a, 2 * U))
        T = mono(ctx, 20); T.draw(c, f'ROT {rot % 360:05.1f}°', cx + bw, cy - bw - 18 * U, P(fg, a), 'r'); T.draw(c, f'R {rr / U:03.0f}', cx - bw, cy + bw + 34 * U, P(fg, a), 'l')
    else:
        N = 324; e = eioc(prog(lt, tA, tA + 0.4)); sp = 60 * U
        for i in range(N):
            gx, gy = (i % 18 - 8.5) / 8.5 * w, (i // 18 - 8.5) / 8.5 * w
            r = 13.5 * U * math.sqrt(i + 1) * (1 + 0.07 * math.sin(i * 0.12 - lt * 9)); th = i * 2.39996 + lt * 0.8
            x = lerp(cx + gx, cx + r * math.cos(th), e); y = lerp(cy + gy, cy + r * math.sin(th), e)
            x = lerp(x, cx + (i % 18 - 8.5) * sp, f); y = lerp(y, cy + (i // 18 - 8.5) * sp, f)
            c.drawCircle(x, y, 7 * U * (1 - 0.3 * f), P(lc(lc(scol, cc, e), fg if i % 18 != 9 else cc, f)))
    if sc.get('label'): mono(ctx, 24).draw(c, ctx.up(sc['label']), 80 * U, ctx.H - 90 * U, P(fg, 0.75 * (1 - f)), 'l')

# 4 ---------- grid_wave3d: flat dot grid with a carrier-coloured spine, camera tilts into 3D, ripple rolls, dolly-in through the centre
def s_wave3d(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H
    cc = carrier(ctx, sc)
    tilt = math.radians(58) * eioc(prog(lt, D * 0.22, D * 0.6)); ca, sa = math.cos(tilt), math.sin(tilt)
    push = eie(prog(lt, D - 0.4, D)); dist = 14 - 1.5 * prog(lt, 0, D) - 10 * push
    f = 0.35 * W * (U * 1080 / H if H else 1); amp = 1.3 * eoc(prog(lt, D * 0.3, D * 0.7)); sw = 1.25
    pts = []
    for zi in range(-28, 11):
        for xi in range(-20, 21):
            X, Z = xi * sw, zi * sw; r = math.hypot(X, Z)
            Y = amp * math.sin(r * 0.55 - lt * 7) * math.exp(-r * 0.03)
            if xi == 0: X += math.sin(lt * 25) * 0.25 * math.exp(-lt * 3)
            depth = dist - Y * ca - Z * sa
            if depth < 0.5: continue
            sx = ctx.cx + f * X / depth; sy = ctx.cy + f * (Z * ca - Y * sa) / depth + H * 0.1 * sa
            if -80 * U < sx < W + 80 * U and -80 * U < sy < H + 80 * U: pts.append((depth, sx, sy, Y, xi == 0))
    pts.sort(key=lambda q: -q[0])
    for depth, sx, sy, Y, spine in pts:
        rad = min(80 * U, 0.12 * f / depth); q = clamp(Y / 1.3 * 0.5 + 0.5) if amp > 0.01 else 0
        c.drawCircle(sx, sy, rad, P(cc if spine else lc(fg, cc, q ** 3), clamp(1.7 - depth / 13)))
    if sc.get('word'):
        s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, 150 * U, W * 0.5)); e = quint(prog(lt, 0.1, 0.55)); y = H * 0.2 + T.cap(s)
        c.save(); c.clipRect(skia.Rect(0, y - T.cap(s) * 1.2, W, y + 10 * U)); T.draw(c, s, W * 0.07, y + (1 - e) * T.cap(s) * 1.3, P(fg), 'l'); c.restore()
        if sc.get('label'): typed(ctx, c, ctx.up(sc['label']), W * 0.07, y + 60 * U, mono(ctx, 26), P(fg, 0.8), lt, 0.4)
    if lt > D - 0.05: c.drawColor(col(next_bg(ctx, sc)))

# 5 ---------- point_ring: point-cloud torus tumbling in space, then accelerates and collapses to one dot
def s_point_ring(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc)
    def mk():
        rng = np.random.default_rng(5); n = 1100; th = rng.uniform(0, 2 * PI, n); ph = rng.uniform(0, 2 * PI, n); rr = 0.3 * np.sqrt(rng.uniform(0.2, 1, n))
        return np.stack([(1 + rr * np.cos(ph)) * np.cos(th), rr * np.sin(ph), (1 + rr * np.cos(ph)) * np.sin(th)], 1), rng.uniform(0, 1, n)
    pts, tone = cache(ctx, 'torus', mk)
    cl = eie(prog(lt, D * 0.55, D - 0.06)); ry = lt * 0.9 + cl * 5; rx = 1.05 + 0.25 * math.sin(lt * 1.3)
    cyr, syr, cxr, sxr = math.cos(ry), math.sin(ry), math.cos(rx), math.sin(rx)
    x = pts[:, 0] * cyr + pts[:, 2] * syr; z = -pts[:, 0] * syr + pts[:, 2] * cyr; y = pts[:, 1]
    y, z = y * cxr - z * sxr, y * sxr + z * cxr
    s = (1 - cl) * eob(prog(lt, 0, 0.4), 1.6); dist = 3.4; f = ctx.H * 0.36 * dist
    if sc.get('word'):
        wd = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, wd, 300 * U, ctx.W * 0.8)); T.draw_mid(c, wd, ctx.cx, ctx.cy, P(fg, 0.12))
    order = np.argsort(-z)
    for i in order:
        d = dist + z[i] * s; sx = ctx.cx + f * x[i] * s / d; sy = ctx.cy + f * y[i] * s / d
        c.drawCircle(sx, sy, 4.2 * U * dist / d, P(lc(fg, acc2, tone[i] * 0.5), clamp(0.3 + 0.7 * (1.2 - z[i]) / 2.4)))
    if cl > 0.5: c.drawCircle(ctx.cx, ctx.cy, 14 * U * eoc(prog(cl, 0.5, 1)), P(cc))
    if sc.get('label'): mono(ctx, 24).draw(c, ctx.up(sc['label']), ctx.cx, ctx.H - 90 * U, P(fg, 0.8 * (1 - cl)))

# 6 ---------- ribbon_loop: striped capsule ribbon shoots in, ties a loop (trim head + chasing tail), bursts, exits
def s_ribbon_loop(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; cc = carrier(ctx, sc)
    Rl = 0.2 * H
    def pt(s):
        th = 2 * PI * eioc(prog(s, 0.36, 0.64))
        return (lerp(-0.25 * W, 1.25 * W, s) + Rl * math.sin(th), ctx.cy + Rl + 0.22 * H * (1 - 2 * s) - Rl * (1 - math.cos(th)))
    if sc.get('word'):
        wd = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, wd, 460 * U, W * 1.6)); T.draw_mid(c, wd, W * 0.6 - lt * W * 0.18, ctx.cy, P(fg, 0.18, 3 * U))
    p = prog(lt, 0, D * 0.94); head = lerp(0, 1.55, 0.45 * p + 0.55 * eioc(p)); tail = head - 0.42 - 0.12 * math.sin(PI * p)
    a0, a1 = clamp(tail), clamp(head); wst = 20 * U * (1 - 0.3 * math.sin(PI * p))
    def seg(lo, hi):
        if hi - lo < 0.002: return
        ss = np.linspace(lo, hi, max(8, int((hi - lo) * 400))); P0 = [pt(s) for s in ss]
        nr = []
        for k in range(len(P0)):
            q0, q1 = P0[max(0, k - 1)], P0[min(len(P0) - 1, k + 1)]; dx, dy = q1[0] - q0[0], q1[1] - q0[1]; L = math.hypot(dx, dy) or 1; nr.append((-dy / L, dx / L))
        def off(o): return path_line([(x + n[0] * o, y + n[1] * o) for (x, y), n in zip(P0, nr)])
        c.drawPath(off(0), P(ctx.pal['dark'], 1, wst * 3 + 10 * U))
        for o, cl_ in ((-wst, cc), (0, ctx.pal['light']), (wst, ctx.pal['a3'] if sc.get('bg') != 'a3' else ctx.pal['a2'])): c.drawPath(off(o), P(cl_, 1, wst * 1.02))
    img = sc.get('image') if sc.get('image') in ctx.images else None
    seg(a0, min(a1, 0.5))
    if img:
        e = eob(prog(lt, 0.1, 0.5), 1.8); c.save(); c.translate(ctx.cx, ctx.cy + math.sin(lt * 3) * 10 * U); c.rotate(-8); c.scale(max(0.01, e), max(0.01, e))
        draw_image(ctx, c, img, 0, 0, 640 * U, 520 * U, shadow=False); c.restore()
    seg(max(a0, 0.5), a1)
    if 0.64 <= head <= 0.9:  # burst lines when the loop closes
        q = prog(head, 0.64, 0.9); lx, ly = pt(0.5); ly -= Rl
        for j in range(12):
            a = j * PI / 6 + 0.2; r0 = Rl * 1.25 + q * 60 * U; r1 = r0 + 70 * U * math.sin(PI * q)
            c.drawLine(lx + r0 * math.cos(a), ly + r0 * math.sin(a), lx + r1 * math.cos(a), ly + r1 * math.sin(a), P(fg, 1, 6 * U))
    if sc.get('label'): mono(ctx, 24).draw(c, ctx.up(sc['label']), 80 * U, H - 90 * U, P(fg, 0.8), 'l')

def path_line(pts):
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    return p

# 7 ---------- text_ring: rows of type marquee in alternating directions, then wrap into concentric counter-rotating rings;
#              the centre dot pops out on a parabola at the end
def s_text_ring(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc); cx, cy = ctx.cx, ctx.cy
    words = [ctx.up(w) for w in sc['words']]; n = len(words); g = eie(prog(lt, D - 0.34, D)); dirs = (1, -1, 1); speeds = (1.1, 0.6, 0.35)
    for r in range(3):
        R0 = (170 + 120 * r) * U * (0.8 if ctx.portrait else 1); ws = words[r % n:] + words[:r % n]; s0 = ' • '.join(ws) + ' • '
        def mk(s0=s0, R0=R0):
            T0 = Text(ctx, 44 * U); w0 = T0.width(s0); reps = max(1, round(2 * PI * R0 / w0)); T = Text(ctx, 44 * U * 2 * PI * R0 / (reps * w0)); s = s0 * reps
            adv = T.adv(s); cum = np.cumsum([0] + adv[:-1]) + np.array(adv) / 2; return s, T, adv, cum
        s, T, adv, cum = cache(ctx, ('ring', sc['i'], r), mk)
        total = 2 * PI * R0; ly = cy + (r - 1) * 150 * U; mq = dirs[r] * lt * 700 * U; rot = dirs[r] * speeds[r] * lt
        R = R0 * (1 + 0.8 * g); cap = T.cap('A'); L = len(s)
        for i, ch in enumerate(s):
            e = eioc(prog(lt, D * 0.18 + 0.15 * i / L, D * 0.48 + 0.15 * i / L))
            lx = cx + (cum[i] - total / 2) + mq; phi = cum[i] / R0 + rot - PI / 2
            px = lerp(lx, cx + R * math.cos(phi), e); py = lerp(ly, cy + R * math.sin(phi), e); deg = math.degrees(phi + PI / 2) * e
            if not (-60 * U < px < ctx.W + 60 * U): continue
            c.save(); c.translate(px, py); c.rotate(deg)
            c.drawString(ch, -adv[i] / 2, cap / 2, T.font_for(ch), P(cc if ch == '•' else fg, 1 - g)); c.restore()
    ce = eoc(prog(lt, D * 0.4, D * 0.6)); pulse = 1 + 0.25 * math.exp(-((lt % ctx.beat) * 12))
    if sc.get('label') and ce > 0 and g < 0.5:
        lb = ctx.up(sc['label']); Tl = Text(ctx, fit_size(ctx, lb, 60 * U, 230 * U)); Tl.draw_mid(c, lb, cx, cy + 70 * U, P(fg, ce * (1 - 2 * g)))
    u = prog(lt, D - 0.32, D)
    dx = ctx.W * 0.22 * u; dy = -420 * U * 4 * u * (1 - u)
    c.drawCircle(cx + dx, cy + dy - (30 * U if sc.get('label') else 0) * (1 - u), 22 * U * pulse * max(ce, 0.6 if u > 0 else ce), P(cc))

# 8 ---------- dot_lockup: serif title masks in, the carrier dot drops with gravity and bounces into place as the full stop
def s_dot_lockup(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; cc = carrier(ctx, sc); cx, cy = ctx.cx, ctx.cy
    kind = sc.get('font', 'serif'); title = sc['title'] if kind != 'display' else ctx.up(sc['title'])
    T = Text(ctx, fit_size(ctx, title, sc.get('size', 230) * U, W * 0.7, kind), kind); tw = T.width(title); cap = T.cap(title); dR = cap * 0.14
    x0 = cx - (tw + dR * 2.8) / 2; base = cy + cap * 0.3
    if sc.get('logo', 'logo') in ctx.images and sc.get('logo', 'logo'):
        a = eoc(prog(lt, 0.7, 1.0)); c.save(); c.translate(cx, base - cap - 120 * U); c.scale(0.9 + 0.1 * a, 0.9 + 0.1 * a)
        draw_image(ctx, c, sc.get('logo', 'logo'), 0, 0, 300 * U, 110 * U, alpha=a, shadow=False); c.restore()
    p = prog(lt, 0.02, 0.6); e = quint(p); v = (1 - p) ** 3
    c.save(); c.clipRect(skia.Rect(x0 - 20 * U, base - cap * 1.4, x0 + tw + 20 * U, base + cap * 0.4))
    if v > 0.02:
        for g in range(6, 0, -1): T.draw(c, title, x0 - (1 - e) * tw * 0.7 - g * v * 50 * U, base, P(fg, 0.08), 'l')
    T.draw(c, title, x0 - (1 - e) * tw * 0.7, base, P(fg), 'l'); c.restore()
    tx, ty = x0 + tw + dR * 1.5, base - dR
    u = prog(lt, 0.15, 0.62); sx, sy = tx + 300 * U, -80 * U
    if lt < 0.62: X, Y, sqz = lerp(sx, tx, eoc(u)), lerp(sy, ty, u * u), 0.0
    else:
        tb = lt - 0.62; X = tx; h = 70 * U * abs(math.sin(tb * PI / 0.2)) * math.exp(-tb * 9); Y = ty - h
        sqz = 0.35 * math.exp(-((tb % 0.2) / 0.04) ** 2) * math.exp(-tb * 6)
    c.save(); c.translate(X, Y + dR * sqz); c.scale(1 + sqz, 1 - sqz); c.drawCircle(0, 0, dR, P(cc)); c.restore()
    a = eoc(prog(lt, 0.75, 1.05)); lw = eioe(prog(lt, 0.7, 1.05)) * tw * 0.5
    c.drawLine(cx - lw, base + 60 * U, cx + lw, base + 60 * U, P(fg, 0.5, 2 * U, cap=False))
    if sc.get('subtitle'): mono(ctx, 30).draw(c, ctx.up(sc['subtitle']), cx, base + 130 * U, P(fg, a), track=8 * U)
    if sc.get('meta'): mono(ctx, 19).draw(c, ctx.up(sc['meta']), cx, base + 185 * U, P(fg, 0.55 * eoc(prog(lt, 0.95, 1.25))), track=4 * U)
    if sc.get('cta'):
        ca = eoc(prog(lt, 1.0, 1.3)); Tc = mono(ctx, 30); w2 = Tc.width(ctx.up(sc['cta'])); y = base + 270 * U
        r = skia.Rect(cx - w2 / 2 - 40 * U, y - 36 * U, cx + w2 / 2 + 40 * U, y + 36 * U); c.drawRRect(skia.RRect.MakeRectXY(r, 36 * U, 36 * U), P(cc, ca))
        tc = max((ctx.pal['dark'], ctx.pal['light']), key=lambda q: contrast(q, cc)); Tc.draw_mid(c, ctx.up(sc['cta']), cx, y, P(tc, ca))

SCENES2 = {'dot_split': s_dot_split, 'snap_type': s_snap_type, 'shape_spin': s_shape_spin, 'grid_wave3d': s_wave3d,
           'point_ring': s_point_ring, 'ribbon_loop': s_ribbon_loop, 'text_ring': s_text_ring, 'dot_lockup': s_dot_lockup}
REQUIRED2 = {'dot_split': [], 'snap_type': ['lines'], 'shape_spin': [], 'grid_wave3d': [], 'point_ring': [], 'ribbon_loop': [],
             'text_ring': ['words'], 'dot_lockup': ['title']}
STILL2 = {'dot_split': 0.55, 'snap_type': 0.6, 'shape_spin': 0.3, 'grid_wave3d': 0.7, 'point_ring': 0.35, 'ribbon_loop': 0.55,
          'text_ring': 0.7, 'dot_lockup': 0.97}
def events2(sc):
    D = sc['dur']; b = D / max(1, sc.get('beats', 1)); t = sc['type']; ts = min(b, D * 0.3)
    return {'dot_split': [ts, D - 0.22], 'snap_type': [ts, D - 0.1], 'shape_spin': [D * 0.52], 'grid_wave3d': [D * 0.22, D - 0.3],
            'point_ring': [D * 0.55], 'ribbon_loop': [D * 0.45], 'text_ring': [D * 0.18, D - 0.32], 'dot_lockup': [0.62]}.get(t)
RECIPES = {'dot_reel': ['dot_split', 'snap_type', 'shape_spin', 'grid_wave3d', 'point_ring', 'ribbon_loop', 'text_ring', 'dot_lockup']}
