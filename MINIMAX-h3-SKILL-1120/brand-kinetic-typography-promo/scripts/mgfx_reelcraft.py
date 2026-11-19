"""Reelcraft modules (R7, original). Ported from the hand-timed showreel grammar that reads as the most natural:
burst -> hold -> fast exit inside each shot, per-letter masked reveals with overshoot, continuous secondary motion
(marquees, orbits, timelines) and match transitions (iris / blinds / shape blow-up into the next background).
Scenes: line_split, marquee_swap, orbit_morph, style_cuts, converge_lockup  +  type extras: split_flap, slice_type,
outline_echo. Keep each scene >= ~1.25 s (style_cuts: >= 0.22 s per word) so the hold can land."""
import math, random
import numpy as np, skia
from mgfx_core import *
from mgfx_recipes import carrier, mono, next_bg, cache
import mgfx_chapters
from mgfx_ideaform import has_logo, logo_geom, _raw, _img, LOGO_ICON, LOGO_H, LOGO_W, WM_X, WM_Y, SQ1, rr_path

def ob(p, s=2.2): return eob(p, s)
def rise(ctx, c, s, cx, cy, T, paint, lt, t0, per=0.03, dur=0.42, t_out=None, dir_=1, track=0.0, amp=1.4, clip=True, align='c'):
    """Per-letter masked reveal with overshoot (the showreel's signature move). cy = optical middle of the caps."""
    adv = T.adv(s); w = sum(adv) + track * max(0, len(s) - 1); ch = T.cap(s)
    x = {'c': cx - w / 2, 'l': cx, 'r': cx - w}[align]; base = cy + ch / 2
    if clip:
        c.save()
        if dir_ > 0: c.clipRect(skia.Rect(-1e4, base - ch * 1.7, 1e4, base + ch * 0.12 + 2))
        else: c.clipRect(skia.Rect(-1e4, base - ch - 2, 1e4, base + ch * 1.7))
    for i, chr_ in enumerate(s):
        p = prog(lt, t0 + i * per, t0 + i * per + dur)
        if p > 0:
            off = (1 - ob(p)) * ch * amp * dir_
            if t_out is not None:
                q = prog(lt, t_out + i * per * 0.6, t_out + i * per * 0.6 + 0.2); off -= eie(q) * ch * amp * dir_
            c.drawString(chr_, x, base + off, T.font_for(chr_), paint)
        x += adv[i] + track
    if clip: c.restore()
    return w

# ---------------- shapes ----------------
def _sample(verts, n=240):
    v = np.array(list(verts) + [verts[0]], float); seg = np.linalg.norm(np.diff(v, axis=0), axis=1); L = np.concatenate([[0], np.cumsum(seg)])
    s = np.linspace(0, L[-1], n, endpoint=False); out = []
    for si in s:
        k = min(np.searchsorted(L, si, side='right') - 1, len(seg) - 1); u = (si - L[k]) / max(seg[k], 1e-9); out.append(v[k] + (v[k + 1] - v[k]) * u)
    a = np.array(out); i = int(np.argmin(a[:, 0] + a[:, 1])); return np.roll(a, -i, axis=0)
def _reg(k, R, rot=-90, inner=None):
    m = k * (2 if inner else 1)
    return [((R if (not inner or i % 2 == 0) else R * inner) * math.cos(math.radians(rot + i * 360 / m)),
             (R if (not inner or i % 2 == 0) else R * inner) * math.sin(math.radians(rot + i * 360 / m))) for i in range(m)]
def _icon(R=0.95, r=0.3):
    v = [(-R, -R), (R, -R), (R, R)]
    for i in range(13):
        a = PI / 2 + i * (PI / 2) / 12; v.append((-R + r + r * math.cos(a), R - r + r * math.sin(a)))
    return v
SHAPE_VERTS = {'icon': _icon(), 'circle': _reg(120, 1.08, -135), 'square': _reg(4, 1.3, -135), 'triangle': _reg(3, 1.3, -90),
               'diamond': _reg(4, 1.3, -90), 'star': _reg(5, 1.3, -90, 0.45), 'hexagon': _reg(6, 1.15, -90)}
_SH = {}
def shape_pts(name):
    if name not in _SH: _SH[name] = _sample(SHAPE_VERTS.get(name, SHAPE_VERTS['circle']))
    return _SH[name]
def _pp(pts, close=True):
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    if close: p.close()
    return p

# ---------------- line_split ----------------
# line_split: a carrier dot pops (overshoot), squashes in anticipation and stretches into a hairline; the top line rises
# letter by letter above it, the bottom word drops in below with a bouncing settle. Pair with transition "iris" next.
def s_line_split(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc); cx, cy = ctx.cx, ctx.cy + 20 * U
    k = clamp(D / 1.25, 0.8, 1.5)
    a = ob(prog(lt, 0.08 * k, 0.32 * k), 3.0); sq = math.sin(PI * prog(lt, 0.32 * k, 0.42 * k)) * 0.35; st = eioe(prog(lt, 0.42 * k, 0.85 * k))
    h = lerp(30, 8, st) * (1 - sq * 0.6) * a * U
    if a > 0:
        ww = (lerp(30 * U, ctx.W * 0.68, st) + 30 * U * sq) * a; r = min(h / 2, 15 * U)
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(cx - ww / 2, cy - h / 2, cx + ww / 2, cy + h / 2), r, r), P(cc))
        if lt < 0.85 * k:
            u = prog(lt, 0.12 * k, 0.65 * k); c.drawCircle(cx, cy, (20 + u * 160) * U, P(cc, (1 - u) * 0.6, 3 * U))
    top = ctx.up(sc.get('top', 'I HAVE AN')); bot = ctx.up(sc.get('bottom', 'IDEA.'))
    T1 = Text(ctx, fit_size(ctx, top, sc.get('size_top', 170) * U, ctx.W * 0.8)); T2 = Text(ctx, fit_size(ctx, bot, sc.get('size', 300) * U, ctx.W * 0.82))
    rise(ctx, c, top, cx, cy - 34 * U - T1.cap(top) / 2, T1, P(fg), lt, 0.6 * k, per=0.025, dur=0.4)
    adv = T2.adv(bot); x = cx - sum(adv) / 2; base = cy + 34 * U + T2.cap(bot); bc = ctx.pal[sc.get('accent', 'a2')]
    c.save(); c.clipRect(skia.Rect(0, cy + 8 * U, ctx.W, ctx.H))
    for i, ch in enumerate(bot):
        p = prog(lt, 0.7 * k + i * 0.04, 0.7 * k + i * 0.04 + 0.4)
        if p > 0:
            off = -(1 - ob(p)) * T2.cap(bot) * 1.5; bob = math.sin((lt - 0.9 * k) * 14 - i * 0.9) * 12 * U * prog(lt, 0.95 * k, 1.05 * k)
            c.drawString(ch, x, base + off + bob, T2.font_for(ch), P(bc))
        x += adv[i]
    c.restore()

# ---------------- marquee_swap ----------------
def _timeline(ctx, c, lt, D, keys, color, acc):
    U = ctx.U; x0, x1, y = ctx.W * 0.135, ctx.W * 0.865, ctx.H * 0.89
    c.drawLine(x0, y, x1, y, P(color, 0.35, 2 * U))
    for i in range(29):
        xx = lerp(x0, x1, i / 28); c.drawLine(xx, y - (10 if i % 4 == 0 else 5) * U, xx, y, P(color, 0.35, 2 * U))
    for kk in keys:
        kx = lerp(x0, x1, kk / D); hit = lt >= kk; s = 10 * U * (1 + 0.6 * math.exp(-(lt - kk) * 10)) if hit else 8 * U
        c.save(); c.translate(kx, y - 28 * U); c.rotate(45); c.drawRect(skia.Rect(-s / 2, -s / 2, s / 2, s / 2), P(color) if hit else P(color, 0.6, 2 * U)); c.restore()
    ph = lerp(x0, x1, clamp(lt / D)); c.drawLine(ph, y - 60 * U, ph, y + 14 * U, P(acc, 1, 3 * U)); c.drawRect(skia.Rect(ph - 9 * U, y - 72 * U, ph + 9 * U, y - 56 * U), P(acc))
def _bezier(ctx, c, lt, t0, fg, acc):
    U = ctx.U; a = prog(lt, t0, t0 + 0.15)
    if a <= 0: return
    gs = 240 * U; gx, gy = ctx.W - gs - 180 * U, 150 * U
    c.save(); c.translate(gx, gy); c.drawRect(skia.Rect(0, 0, gs, gs), P(fg, 0.5 * a, 2 * U))
    p0, p1, p2, p3 = (0, gs), (0.75 * gs, gs), (0.25 * gs, 0), (gs, 0)
    c.drawLine(*p0, *p1, P(acc, a, 2 * U)); c.drawLine(*p3, *p2, P(acc, a, 2 * U)); c.drawCircle(*p1, 7 * U, P(acc, a)); c.drawCircle(*p2, 7 * U, P(acc, a))
    tr = eoc(prog(lt, t0, t0 + 0.35)); pts = []
    for i in range(61):
        u = i / 60 * tr; m = 1 - u
        pts.append((m ** 3 * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u ** 3 * p3[0], m ** 3 * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u ** 3 * p3[1]))
    c.drawPath(_pp(pts, False), P(fg, a, 5 * U)); u = ((lt - t0) * 1.8) % 1.0; e = eioc(u); c.drawCircle(u * gs, gs - e * gs, 9 * U, P(fg, a))
    mono(ctx, 17).draw(c, "cubic-bezier(.75,0,.25,1)", 0, gs + 34 * U, P(fg, a * 0.8), 'l'); c.restore()
# marquee_swap: outlined marquee rows drift in opposite directions; big words replace each other on the beat with
# masked per-letter in/out (the middle words open their tracking), the last word lands in the accent; optional
# cubic-bezier card and a keyframe timeline whose playhead sweeps the scene.
def s_marquee_swap(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W = ctx.W
    words = [ctx.up(w) for w in sc['words']]; n = len(words)
    mq = ctx.up(sc.get('marquee') or (' • '.join(words) + ' • ')); fo = Text(ctx, 250 * U); po = P(fg, 0.12, 2 * U)
    for r in range(4):
        y = ctx.H * (0.157 + r * 0.25); sp = (260 if r % 2 else -260) * U; mw = fo.width(mq); off = ((lt * sp) + r * 400 * U) % mw
        fo.draw(c, mq, -off, y, po, 'l'); fo.draw(c, mq, -off + mw, y, po, 'l')
    seg = (D - 0.11) / n; hot = ctx.pal[sc.get('accent', 'a1')] if sc.get('accent') else acc
    for i, s in enumerate(words):
        T = Text(ctx, fit_size(ctx, s, sc.get('size', 320) * U, W * 0.82)); t0 = 0.11 + i * seg; tout = t0 + seg - 0.13 if i < n - 1 else None
        trk = (lerp(0, 70, eioc(prog(lt, t0 + 0.04, t0 + 0.38))) - 20) * U if 0 < i < n - 1 else 0
        rise(ctx, c, s, ctx.cx, ctx.cy - 20 * U, T, P(hot if i == n - 1 else fg), lt, t0, t_out=tout, track=trk)
    if sc.get('graph', True): _bezier(ctx, c, lt, 0.11 + (n - 1) * seg, fg, hot)
    if sc.get('timeline', True): _timeline(ctx, c, lt, D, [0.11 + i * seg + 0.14 for i in range(n)], fg, hot)

# ---------------- orbit_morph ----------------
# orbit_morph: dashed orbit rings draw on and turn, satellites circle; the hero shape morphs through a list on the beat
# (spin + radial burst on every key), labelled SHAPE 0n — NAME; at the end it becomes a circle and blows up into the
# next scene's background colour (match cut — no transition needed).
def s_orbit_morph(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy - 20 * U
    names = sc.get('shapes') or ['icon', 'circle', 'diamond']; cols = [ctx.pal[r] for r in (sc.get('colors') or ['a1', 'a2', 'light'])]
    n = len(names); dr = eoc(prog(lt, 0, 0.4)); Rr = min(ctx.W, ctx.H) / 1080
    for i, (r, sp, dash) in enumerate([(330, 40, [4, 14]), (410, -25, [40, 20]), (500, 15, [2, 8])]):
        p = P(fg, 0.4, 2 * U, cap=False); p.setPathEffect(skia.DashPathEffect.Make([d * U for d in dash], 0))
        c.save(); c.translate(cx, cy); c.rotate(lt * sp); c.drawArc(skia.Rect(-r * Rr, -r * Rr, r * Rr, r * Rr), -90, 360 * dr, False, p); c.restore()
    for i in range(6):
        a = lt * 2.4 + i * PI / 3; r = 410 * Rr
        c.drawCircle(cx + r * math.cos(a) * dr, cy + r * math.sin(a) * dr, (7 if i % 2 else 4) * U, P(acc2 if i % 2 else acc))
    span = max(0.3, D - 0.5); keys = [span * j / max(1, n - 1) for j in range(n)] if n > 1 else [0]
    idx, u = 0, 0.0
    for j in range(1, n):
        if lt >= keys[j] - 0.28: idx, u = j - 1, eioe(prog(lt, keys[j] - 0.28, keys[j]))
    if u >= 1: idx, u = idx + 1, 0.0
    if lt >= keys[-1]: idx, u = n - 1, 0.0
    nx = min(idx + 1, n - 1); pts = shape_pts(names[idx]) * (1 - u) + shape_pts(names[nx]) * u
    color = lc(cols[idx % len(cols)], cols[nx % len(cols)], u); size = 210 * Rr * ob(prog(lt, 0, 0.27), 2.0)
    blow = sc.get('blow', True); nb = next_bg(ctx, sc); tb = D - 0.34
    if blow and lt > tb - 0.12:
        e2 = eioc(prog(lt, tb - 0.12, tb + 0.04)); pts = pts * (1 - e2) + shape_pts('circle') * e2; color = lc(color, nb, e2)
        size *= 1 + eie(prog(lt, tb, D)) * 11
    rot = lt * 30 + sum(eioe(prog(lt, keys[j] - 0.28, keys[j])) * (90 + 45 * j) for j in range(1, n))
    c.save(); c.translate(cx, cy); c.rotate(rot); c.drawPath(_pp([(x * size, y * size) for x, y in pts]), P(color)); c.restore()
    for kk in keys:
        if 0 <= lt - kk < 0.4:
            q = eoe((lt - kk) / 0.4)
            for j in range(16):
                a = j * PI / 8 + kk; r0 = (270 + q * 120) * Rr; r1 = (270 + q * 300) * Rr
                c.drawLine(cx + r0 * math.cos(a), cy + r0 * math.sin(a), cx + r1 * math.cos(a), cy + r1 * math.sin(a), P(fg, 1 - q, 4 * U))
    if not blow or lt < tb:
        k = min(int(round(idx + u)), n - 1); labels = sc.get('labels') or [x.upper() for x in names]
        mono(ctx, 24).draw(c, f"SHAPE 0{k + 1} — {labels[k % len(labels)]}", cx, ctx.H * 0.87, P(fg, 0.8))

# ---------------- style_cuts ----------------
TREATS = ['type', 'scale', 'blur', 'squash', 'glitch', 'select', 'stretch', 'overshoot', 'rotate', 'track']
# style_cuts: one word per slot (>= 0.22 s), every slot a different type treatment and background; drifting stripes
# behind; a STYLE nn/NN label names the treatment. The densest way to show many type styles without losing rhythm.
def s_style_cuts(ctx, c, sc, lt):
    U = ctx.U; D = sc['dur']; words = [ctx.up(w) for w in sc['words']]; n = len(words); per = D / n
    k = min(int(lt / per), n - 1); u = (lt - k * per) / per; styles = sc.get('styles') or TREATS
    kind = styles[k % len(styles)]; roles = sc.get('bgs') or ['a1', 'light', 'dark', 'a2', 'a3']
    bg, fg, acc, acc2 = ctx.colors(dict(bg=roles[k % len(roles)])); c.drawColor(col(bg)); word = words[k]
    T = Text(ctx, fit_size(ctx, word, sc.get('size', 300) * U, ctx.W * 0.8)); ch = T.cap(word); w = T.width(word)
    for i in range(12):
        x = ((i * 190 * U + u * 300 * U * (1 if k % 2 else -1)) % (ctx.W + 360 * U)) - 180 * U; c.drawRect(skia.Rect(x, 0, x + 40 * U, ctx.H), P(fg, 0.06))
    p = P(fg); c.save(); c.translate(ctx.cx, ctx.cy)
    def mid(tt=T, s=word, pp=p, dx=0.0): tt.draw(c, s, dx, tt.cap(s) / 2, pp)
    if kind == 'type':
        M = Text(ctx, fit_size(ctx, word, 260 * U, ctx.W * 0.7, 'mono'), 'mono'); m = min(len(word), int(u * 1.6 * len(word)) + 1); full = M.width(word)
        M.draw(c, word[:m], -full / 2, M.cap(word) / 2, p, 'l'); x = -full / 2 + M.width(word[:m]) + 10 * U
        c.drawRect(skia.Rect(x, -M.cap(word) / 2 - 10 * U, x + 26 * U, M.cap(word) / 2 + 10 * U), P(acc))
    elif kind == 'scale':
        s = lerp(4.5, 1, eoe(clamp(u * 1.4))); c.scale(s, s); mid()
    elif kind == 'blur':
        e = eoe(clamp(u * 1.5)); xo = lerp(-900 * U, 0, e)
        for j in range(10, 0, -1): mid(pp=P(fg, 0.12), dx=xo - j * (1 - e) * 70 * U)
        mid(dx=xo)
        if e > 0.6: px = lerp(-w / 2, w / 2, prog(u, 0.55, 1.0)); c.drawLine(px, -ch * 0.9, px, ch * 0.9, P(acc, 1, 6 * U))
    elif kind == 'squash':
        e = ob(clamp(u * 1.8), 2.5); c.save(); c.translate(0, ch / 2); c.scale(lerp(1, 1.4, e), lerp(1, 0.45, e)); T.draw(c, word, 0, 0, p); c.restore()
        for j in range(24):
            hh = (20 + 70 * abs(math.sin(j * 1.7 + lt * 30))) * e * U; xx = (-460 + j * 40) * U
            c.drawRect(skia.Rect(xx, ch * 0.75 - hh / 2 + 80 * U, xx + 18 * U, ch * 0.75 + hh / 2 + 80 * U), P(acc))
    elif kind == 'glitch':
        rng = random.Random(int(lt * 30))
        for j in range(12):
            y0 = -ch * 0.6 + j * ch * 1.2 / 12; y1 = y0 + ch * 1.2 / 12; dx = rng.uniform(-60, 60) * U * (1 - u * 0.7) if rng.random() < 0.6 else 0
            c.save(); c.clipRect(skia.Rect(-1e4, y0, 1e4, y1)); mid(pp=P(acc, 0.9), dx=dx - 8 * U); mid(pp=P(acc2, 0.9), dx=dx + 8 * U); mid(dx=dx); c.restore()
    elif kind == 'select':
        s = lerp(0.85, 1, ob(clamp(u * 2), 2)); c.scale(s, s); mid(); e = eoe(clamp(u * 2.2)); bw = w / 2 + 40 * U; bh = ch / 2 + 40 * U; hs = 12 * U
        c.drawRect(skia.Rect(-bw * e, -bh * e, bw * e, bh * e), P(acc, 1, 4 * U))
        for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
            r = skia.Rect(sx * bw * e - hs, sy * bh * e - hs, sx * bw * e + hs, sy * bh * e + hs); c.drawRect(r, P((255, 255, 255))); c.drawRect(r, P(acc, 1, 4 * U))
        mono(ctx, 24).draw(c, f"W {int(w / U)}  H {int(ch / U)}", bw * e, bh * e + 50 * U, P(acc, e), 'r')
    elif kind == 'stretch':
        e = ob(clamp(u * 1.8), 2.5); c.translate(0, ch / 2); c.scale(lerp(1, 0.72, e), lerp(0.3, 1.7, e)); T.draw(c, word, 0, 0, p)
    elif kind == 'overshoot':
        s = spring(u * 0.25, f=6, d=14); c.scale(s, s); mid()
    elif kind == 'rotate':
        c.rotate(lerp(-120, 0, ob(clamp(u * 1.6), 1.6)) + u * 8); mid()
    elif kind == 'track':
        tr = lerp(160 * U, -0.02 * T.size, eoe(clamp(u * 1.5))); T.draw(c, word, 0, ch / 2, p, 'c', tr)
    c.restore()
    if sc.get('label', True): mono(ctx, 26).draw(c, f"STYLE {k + 1:02d}/{n:02d}  {kind.upper()}", 96 * U, ctx.H - 120 * U, P(fg, 0.9), 'l')
def spring(x, f=3.0, d=5.0):
    if x <= 0: return 0.0
    return 1 - math.exp(-d * x) * math.cos(f * 2 * PI * x)

# ---------------- converge_lockup ----------------
# converge_lockup: four hairlines shoot in from the frame edges and meet at the icon, which spins/pops in (layered logo:
# the mascot peeks out), a caret sweeps the wordmark (or the title rises letter by letter), tagline rises, meta fades;
# slow push-in, then a still hold. Without logo assets: icon shape in the carrier colour + title text.
def s_converge_lockup(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc)
    zoom = 1 + 0.03 * clamp(lt / D); c.save(); c.translate(ctx.cx, ctx.cy); c.scale(zoom, zoom); c.translate(-ctx.cx, -ctx.cy)
    logo = has_logo(ctx, sc)
    if logo:
        k, x0, y0, sq = logo_geom(ctx, sc); isz = LOGO_ICON * k; icx, icy = x0 + isz / 2, y0 + isz / 2; ybot = y0 + LOGO_H * k
    else:
        title = sc.get('title', ctx.spec.get('meta', {}).get('brand', 'BRAND')); T = Text(ctx, fit_size(ctx, title, sc.get('size', 150) * U, ctx.W * 0.6))
        isz = T.cap(title) * 1.25; tw = T.width(title); gap = isz * 0.35; tot = isz + gap + tw; x0 = ctx.cx - tot / 2; y0 = ctx.cy - 60 * U - isz / 2
        icx, icy = x0 + isz / 2, y0 + isz / 2; ybot = y0 + isz
    e = eoe(prog(lt, 0.0, 0.26)); q = eie(prog(lt, 0.2, 0.34))
    for sx, sy in [(0, icy), (ctx.W, icy), (icx, -50 * U), (icx, ctx.H + 50 * U)]:
        if q < 1: c.drawLine(lerp(sx, icx, q), lerp(sy, icy, q), lerp(sx, icx, e), lerp(sy, icy, e), P(cc, 1, 3 * U))
    s = ob(prog(lt, 0.26, 0.6), 2.4)
    if s > 0:
        c.save(); c.translate(icx, icy); c.rotate((1 - eoe(prog(lt, 0.26, 0.7))) * -90); c.scale(s, s); c.translate(-icx, -icy)
        if logo:
            _img(c, _raw(ctx, sc['logo_icon']), x0, y0, k); pk = ob(prog(lt, 0.45, 0.85), 1.6)
            if sc.get('logo_mascot'):
                c.save(); c.clipRect(skia.Rect(x0 - isz, y0 - isz, x0 + SQ1 * k, y0 + SQ1 * k)); _img(c, _raw(ctx, sc['logo_mascot']), x0, y0 + (1 - pk) * isz * 0.75, k); c.restore()
            if sc.get('logo_border'): _img(c, _raw(ctx, sc['logo_border']), x0, y0, k)
        else:
            c.drawPath(rr_path(x0, y0, isz, isz, isz * 0.22, 'icon'), P(cc))
        c.restore()
    if logo:
        wimg = _raw(ctx, sc['logo_wordmark']); wx, wy = x0 + WM_X * k, y0 + WM_Y * k; ww, wh = wimg.width() * k, wimg.height() * k
        sw = eioe(prog(lt, 0.55, 1.15)); kx = lerp(wx - 18 * U, wx + ww + 18 * U, sw)
        c.save(); c.clipRect(skia.Rect(wx - 4 * U, wy - 40 * U, kx - 6 * U, wy + wh + 40 * U)); _img(c, wimg, wx, wy + (1 - eoc(prog(lt, 0.55, 1.0))) * 12 * U, k); c.restore()
        if 0.5 < lt < D - 0.3 and (lt < 1.15 or int((lt - 1.15) / (ctx.beat / 2)) % 2 == 0): c.drawRect(skia.Rect(kx - 4 * U, wy - 6 * U, kx + 4 * U, wy + wh + 6 * U), P(cc))
    else:
        rise(ctx, c, title, x0 + isz + gap, icy, T, P(fg), lt, 0.5, per=0.035, dur=0.5, align='l')
    tg = sc.get('tagline')
    if tg:
        Tt = Text(ctx, sc.get('tagline_size', 50) * U, 'display' if not sc.get('tagline_font') else sc['tagline_font'])
        t0 = min(1.1, D * 0.55); per = max(0.006, min(0.02, (D - t0 - 0.6) / max(1, len(tg))))
        rise(ctx, c, tg, ctx.cx, ybot + 110 * U, Tt, P(fg, 0.9), lt, t0, per=per, dur=0.4, amp=1.2)
    if sc.get('meta'):
        a = eoc(prog(lt, min(1.4, D - 0.6), min(1.7, D - 0.3))); mono(ctx, 24).draw(c, sc['meta'], ctx.cx, ybot + 195 * U, P(fg, 0.5 * a), 'c', track=3 * U)
    c.restore()

# ================= type extras =================
GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@'
# split_flap: airport split-flap board — one tile per letter; tiles flip through random glyphs and settle left to right,
# each landing with a small drop and a flash of the accent; a mono sub-line types under the board.
def s_split_flap(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; word = ctx.up(sc['word'])
    n = len(word); tw = min(ctx.W * 0.86 / n, 230 * U); th = tw * 1.38; gap = tw * 0.08; x0 = ctx.cx - (n * tw + (n - 1) * gap) / 2; y0 = ctx.cy - th / 2 - 20 * U
    T = Text(ctx, th * 0.62); tile = lc(bg, fg, 0.1); settle_end = min(D * 0.62, 0.35 + n * 0.09)
    for i, ch in enumerate(word):
        x = x0 + i * (tw + gap); ts = 0.25 + (settle_end - 0.25) * i / max(1, n - 1); a = ob(prog(lt, 0.03 * i, 0.03 * i + 0.3), 2)
        if a <= 0: continue
        land = prog(lt, ts, ts + 0.18); drop = math.sin(PI * land) * 10 * U if 0 < land < 1 else 0
        c.save(); c.translate(x + tw / 2, y0 + th / 2 + drop); c.scale(a, a)
        r = skia.RRect.MakeRectXY(skia.Rect(-tw / 2, -th / 2, tw / 2, th / 2), 10 * U, 10 * U); c.drawRRect(r, P(tile))
        if lt < ts:
            g = GL[(int(lt * 28) + i * 7) % len(GL)] if ch != ' ' else ' '; fl = (lt * 28) % 1
            c.save(); c.scale(1, 1 - 0.5 * math.sin(PI * fl) if fl < 0.5 else 1); T.draw_mid(c, g, 0, 0, P(fg, 0.75)); c.restore()
        else:
            hit = math.exp(-(lt - ts) * 12); T.draw_mid(c, ch, 0, 0, P(lc(fg, acc, hit)))
        c.drawLine(-tw / 2, 0, tw / 2, 0, P(bg, 0.9, 3 * U)); c.restore()
    if sc.get('sub'):
        s = ctx.up(sc['sub']); m = int(clamp((lt - settle_end) * 30, 0, len(s))); M = mono(ctx, 28)
        if m > 0: M.draw(c, s[:m], ctx.cx - M.width(s) / 2, y0 + th + 80 * U, P(fg, 0.85), 'l')

# slice_type: the word is cut into horizontal bands that slide in from alternating sides with motion trails and lock;
# on every later beat the bands kick sideways and snap back; at the end they slide out the opposite way.
def s_slice_type(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; word = ctx.up(sc['word']); b = ctx.beat
    T = Text(ctx, fit_size(ctx, word, sc.get('size', 320) * U, ctx.W * 0.86)); ch = T.cap(word); nb = sc.get('bands', 6); y0 = ctx.cy - ch / 2; bh = ch / nb
    hot = sc.get('accent_band', nb // 2)
    for j in range(nb):
        d = 1 if j % 2 else -1; p = eoe(prog(lt, 0.04 * j, 0.04 * j + 0.42)); xo = (1 - p) * ctx.W * 0.9 * d
        if lt > 0.6:
            ph = ((lt - 0.6) % b) / b; xo += d * 60 * U * math.exp(-ph * 9) * math.sin(ph * 30) * (1 if lt < D - 0.3 else 0)
        xo += eie(prog(lt, D - 0.28 + 0.02 * j, D - 0.04 + 0.02 * j)) * ctx.W * -d
        c.save(); c.clipRect(skia.Rect(-10, y0 + j * bh - (ch if j == 0 else 0), ctx.W + 10, y0 + (j + 1) * bh + (ch * 0.2 if j == nb - 1 else 0)))
        clr = acc if j == hot else fg; v = 1 - p
        for g in range(5, 0, -1):
            if v > 0.03: T.draw_mid(c, word, ctx.cx + xo + g * v * 90 * U * d, ctx.cy, P(clr, 0.12))
        T.draw_mid(c, word, ctx.cx + xo, ctx.cy, P(clr)); c.restore()
    if sc.get('label'): mono(ctx, 24).draw(c, ctx.up(sc['label']), ctx.cx, ctx.cy + ch / 2 + 90 * U, P(fg, 0.7 * eoc(prog(lt, 0.5, 0.8))))

# outline_echo: outlined copies of the word collapse inward from the camera onto a solid word (z-zoom), then on every
# beat a ring of outlined echoes pulses outward in alternating accents; ends by punching the solid word forward.
def s_outline_echo(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; word = ctx.up(sc['word']); b = ctx.beat
    T = Text(ctx, fit_size(ctx, word, sc.get('size', 300) * U, ctx.W * 0.7)); cx, cy = ctx.cx, ctx.cy
    def draw(s_, paint):
        c.save(); c.translate(cx, cy); c.scale(s_, s_); c.translate(-cx, -cy); T.draw_mid(c, word, cx, cy, paint); c.restore()
    cin = eoe(prog(lt, 0, 0.45))
    for j in range(6, 0, -1):
        s_ = 1 + j * 0.16 * (1 - cin) * 4 + j * 0.035
        a = (1 - cin) * 0.9 + 0.25 * math.exp(-j * 0.5) * cin
        if lt > 0.45:
            ph = ((lt - 0.45) % b) / b; s_ = 1 + j * 0.05 + eoe(ph) * j * 0.06; a = (1 - ph) * 0.8 * math.exp(-j * 0.25)
        draw(s_, P(acc if j % 2 else acc2, a, 3 * U))
    out = eie(prog(lt, D - 0.25, D)); draw(lerp(1.0, 1.0, cin) * (1 + out * 5), P(fg, 1 - out * 0.5))
    if sc.get('label'): mono(ctx, 24).draw(c, ctx.up(sc['label']), cx, cy + T.cap(word) / 2 + 100 * U, P(fg, 0.7 * cin * (1 - out)))

SCENES8 = {'line_split': s_line_split, 'marquee_swap': s_marquee_swap, 'orbit_morph': s_orbit_morph, 'style_cuts': s_style_cuts,
           'converge_lockup': s_converge_lockup, 'split_flap': s_split_flap, 'slice_type': s_slice_type, 'outline_echo': s_outline_echo}
REQUIRED8 = {'line_split': [], 'marquee_swap': ['words'], 'orbit_morph': [], 'style_cuts': ['words'], 'converge_lockup': [],
             'split_flap': ['word'], 'slice_type': ['word'], 'outline_echo': ['word']}
STILL8 = {'line_split': 0.82, 'marquee_swap': 0.86, 'orbit_morph': 0.45, 'style_cuts': 0.69, 'converge_lockup': 0.93,
          'split_flap': 0.8, 'slice_type': 0.6, 'outline_echo': 0.55}
def events8(sc):
    D = sc['dur']; t = sc['type']; b = D / sc['beats']
    if t not in SCENES8: return None
    if t == 'line_split': k = clamp(D / 1.25, 0.8, 1.5); return [0.08 * k, 0.6 * k]
    if t == 'marquee_swap': n = len(sc['words']); seg = (D - 0.11) / n; return [0.11 + i * seg for i in range(n)]
    if t == 'orbit_morph': n = len(sc.get('shapes') or [1, 2, 3]); span = max(0.3, D - 0.5); return [span * j / max(1, n - 1) for j in range(1, n)]
    if t == 'style_cuts': n = len(sc['words']); return [D / n * i for i in range(n)]
    if t == 'converge_lockup': return [0.26]
    return [b * i for i in range(1, int(sc['beats']))]
mgfx_chapters.SELF_EXIT.update({'line_split', 'orbit_morph', 'style_cuts', 'slice_type', 'outline_echo'})
