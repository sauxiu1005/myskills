"""Scene modules. Each scene draws itself from local time lt in [0, dur)."""
import math, random, re
import numpy as np, skia
from mgfx_core import *

GLYPHS = '01#%&*<>/=+'

def stagger(ctx, c, s, cx, cy, T, paint, lt, t0, t_out=None, track=0.0, dir_=1, clip=True, per=None, glow=None):
    st = ctx.st; per = per if per is not None else st['per']; dur = st['din']; amp = st['amp']
    adv = T.adv(s); w = sum(adv) + track * (len(s) - 1); ch = T.cap(s)
    x = cx - w / 2; base = cy + ch / 2
    if clip:
        c.save()
        if dir_ > 0: c.clipRect(skia.Rect(-1e4, base - ch * 1.7, 1e4, base + ch * 0.12 + 2))
        else: c.clipRect(skia.Rect(-1e4, base - ch - 2, 1e4, base + ch * 1.7))
    for i, chr_ in enumerate(s):
        p = prog(lt, t0 + i * per, t0 + i * per + dur)
        if p > 0:
            off = (1 - ease_in(st, p)) * ch * amp * dir_
            if t_out is not None:
                q = prog(lt, t_out + i * per * 0.6, t_out + i * per * 0.6 + 0.22); off -= eie(q) * ch * amp * dir_
            g = chr_
            if st['decode'] and p < 0.75 and not is_cjk(chr_) and chr_ != ' ':
                g = GLYPHS[(int(lt * 40) + i * 7) % len(GLYPHS)]
            f = T.font_for(chr_)
            if glow is not None: c.drawString(g, x, base + off, f, P(glow, 0.7, blur=12 * ctx.U))
            c.drawString(g, x, base + off, f, paint)
        x += adv[i] + track
    if clip: c.restore()
    return w

def big_text(ctx, s, size, maxw_frac=0.86, track=0.0):
    s = ctx.up(s); sz = fit_size(ctx, s, size * ctx.U, ctx.W * maxw_frac, track=track)
    return s, Text(ctx, sz)

def glow_of(ctx, acc): return acc if ctx.st['glow'] else None

# ---------- shapes ----------
def poly_sample(verts, n=240):
    v = np.array(verts + [verts[0]], float); seg = np.linalg.norm(np.diff(v, axis=0), axis=1)
    L = np.concatenate([[0], np.cumsum(seg)]); out = []
    for si in np.linspace(0, L[-1], n, endpoint=False):
        k = min(np.searchsorted(L, si, side='right') - 1, len(seg) - 1); u = (si - L[k]) / seg[k]
        out.append(v[k] + (v[k + 1] - v[k]) * u)
    return np.array(out)
def reg(k, R, rot=-90, inner=None):
    m = 2 if inner else 1; vs = []
    for i in range(k * m):
        a = math.radians(rot + i * 360 / (k * m)); r = R if (not inner or i % 2 == 0) else R * inner
        vs.append((r * math.cos(a), r * math.sin(a)))
    return vs
SHAPES = [poly_sample(reg(120, 1.0)), poly_sample(reg(4, 1.25, -135)), poly_sample(reg(3, 1.3, -90)), poly_sample(reg(5, 1.3, -90, 0.45))]
def path_pts(pts, close=True):
    p = skia.Path(); p.moveTo(*pts[0])
    for q in pts[1:]: p.lineTo(*q)
    if close: p.close()
    return p
def shape_paint(ctx, color, a=1.0):
    p = P(color, a)
    if ctx.st['corner']: p.setPathEffect(skia.CornerPathEffect.Make(40 * ctx.U))
    return p

def draw_image(ctx, c, key, cx, cy, maxw, maxh, alpha=1.0, plate=None, shadow=True):
    if key not in ctx.images: return None
    img, opaque = ctx.images[key]
    s = min(maxw / img.width(), maxh / img.height()); w, h = img.width() * s, img.height() * s
    r = skia.Rect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)
    rad = 28 * ctx.U
    if opaque:
        pad = 0
        if shadow: c.drawRRect(skia.RRect.MakeRectXY(r.makeOffset(0, 24 * ctx.U), rad, rad), P((0, 0, 0), 0.35 * alpha, blur=30 * ctx.U))
        c.save(); c.clipRRect(skia.RRect.MakeRectXY(r, rad, rad), doAntiAlias=True)
    elif plate is not None:
        c.drawRRect(skia.RRect.MakeRectXY(r.makeOutset(30 * ctx.U, 30 * ctx.U), rad * 2, rad * 2), P(plate, alpha))
    p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(alpha))
    c.drawImageRect(img, r, skia.SamplingOptions(skia.FilterMode.kLinear, skia.MipmapMode.kNone), p)
    if opaque: c.restore()
    return r

# ===================== scenes =====================
def s_hook(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; k = D / 1.5
    cx, cy = ctx.cx, ctx.cy + 20 * U
    a = eob(prog(lt, 0.03 * k, 0.22 * k), 3.0) if ctx.st['ease'] != 'expo' else eoe(prog(lt, 0.03 * k, 0.22 * k))
    sq = math.sin(PI * prog(lt, 0.22 * k, 0.3 * k)) * (0.35 if ctx.st['over'] else 0)
    stt = eioe(prog(lt, 0.3 * k, 0.6 * k))
    w = (lerp(30 * U, ctx.W * 0.78, stt) + 30 * U * sq) * a; h = lerp(30 * U, 8 * U, stt) * (1 - sq * 0.6) * a
    if a > 0: c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), h / 2, h / 2), P(acc))
    if lt < 0.6 * k and a > 0:
        u = prog(lt, 0.06 * k, 0.5 * k); c.drawCircle(cx, cy, 20 * U + u * 160 * U, P(acc, (1 - u) * 0.6, 3 * U))
    t1 = 0.52 * k
    s1, T1 = big_text(ctx, sc.get('line1', ''), sc.get('size1', 170))
    if s1: stagger(ctx, c, s1, cx, cy - 34 * U - T1.cap(s1) / 2, T1, P(fg), lt, t1, dir_=1, glow=glow_of(ctx, acc))
    s2, T2 = big_text(ctx, sc.get('line2', ''), sc.get('size2', 260))
    if s2:
        adv = T2.adv(s2); x = cx - sum(adv) / 2; base = cy + 34 * U + T2.cap(s2)
        c.save(); c.clipRect(skia.Rect(0, cy + 8 * U, ctx.W, ctx.H))
        for i, ch in enumerate(s2):
            p = prog(lt, t1 + 0.1 + i * ctx.st['per'] * 1.3, t1 + 0.1 + i * ctx.st['per'] * 1.3 + ctx.st['din'])
            if p > 0:
                off = -(1 - ease_in(ctx.st, p)) * T2.cap(s2) * 1.5
                bob = math.sin((lt - t1 - 0.3) * 14 - i * 0.9) * 12 * U * prog(lt, t1 + 0.35, t1 + 0.5) if ctx.st['ease'] != 'expo' else 0
                c.drawString(ch, x, base + off + bob, T2.font_for(ch), P(acc2 if sc.get('accent_line2', True) else fg))
            x += adv[i]
        c.restore()
    if sc.get('kicker'):
        T = ctx.T(26, 'mono'); a2 = eoc(prog(lt, 0.05 * k, 0.3 * k))
        T.draw(c, ctx.up(sc['kicker']), cx, cy - 300 * U, P(fg, 0.75 * a2))

def timeline(ctx, c, lt, D, keys, color):
    U = ctx.U; x0, x1, y = ctx.W * 0.14, ctx.W * 0.86, ctx.H - 120 * U
    if ctx.style_name == 'bouncy':
        n = len(keys); gap = 46 * U; xs = ctx.cx - gap * (n - 1) / 2
        for i, k in enumerate(keys):
            on = lt >= k; s = (14 + 8 * spring(prog(lt, k, k + 0.6) * 1.6)) * U if on else 10 * U
            c.drawCircle(xs + i * gap, y, s / 1.4, P(color, 1 if on else 0.3))
        return
    c.drawLine(x0, y, x1, y, P(color, 0.35, 2 * U))
    for i in range(29):
        xx = lerp(x0, x1, i / 28); c.drawLine(xx, y - (10 if i % 4 == 0 else 5) * U, xx, y, P(color, 0.35, 2 * U))
    ph = lerp(x0, x1, prog(lt, 0, D))
    for k in keys:
        kx = lerp(x0, x1, k / D); hit = lt >= k; s = (10 * (1 + 0.6 * math.exp(-(lt - k) * 10)) if hit else 8) * U
        c.save(); c.translate(kx, y - 28 * U); c.rotate(45)
        c.drawRect(skia.Rect(-s / 2, -s / 2, s / 2, s / 2), P(color) if hit else P(color, 0.6, 2 * U)); c.restore()
    c.drawLine(ph, y - 60 * U, ph, y + 14 * U, P(color, 1, 3 * U)); c.drawRect(skia.Rect(ph - 9 * U, y - 72 * U, ph + 9 * U, y - 56 * U), P(color))

def ease_graph(ctx, c, lt, t0, fg, acc):
    U = ctx.U; gs = 200 * U; gx = ctx.W - gs - 130 * U; gy = 140 * U
    a = prog(lt, t0, t0 + 0.15)
    if a <= 0: return
    c.save(); c.translate(gx, gy)
    c.drawRect(skia.Rect(0, 0, gs, gs), P(fg, 0.4 * a, 2 * U))
    p0, p1, p2, p3 = (0, gs), (0.75 * gs, gs), (0.25 * gs, 0), (gs, 0)
    c.drawLine(*p0, *p1, P(acc, a, 2 * U)); c.drawLine(*p3, *p2, P(acc, a, 2 * U))
    c.drawCircle(*p1, 6 * U, P(acc, a)); c.drawCircle(*p2, 6 * U, P(acc, a))
    tr = eoc(prog(lt, t0, t0 + 0.35)); pts = []
    for i in range(61):
        u = i / 60 * tr; m = 1 - u
        pts.append((m ** 3 * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u ** 3 * p3[0],
                    m ** 3 * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u ** 3 * p3[1]))
    c.drawPath(path_pts(pts, False), P(fg, a, 4 * U))
    u = ((lt - t0) * 1.6) % 1.0; e = eioc(u)
    c.drawCircle(u * gs, gs - e * gs, 8 * U, P(fg, a))
    ctx.T(15, 'mono').draw(c, 'cubic-bezier(.75,0,.25,1)', 0, gs + 30 * U, P(fg, a * 0.8), 'l')
    c.restore()

def s_kinetic(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    words = sc['words']; n = len(words); slot = D / n
    mq = ctx.up(sc.get('marquee') or ' • '.join(words) + ' • ')
    Tm = ctx.T(240); rows = int(ctx.H / (260 * U)) + 1
    for r in range(rows):
        y = 160 * U + r * 260 * U; sp = (240 if r % 2 else -240) * U; w = Tm.width(mq)
        off = ((lt * sp) + r * 400 * U) % w
        Tm.draw(c, mq, -off, y, P(fg, 0.1), 'l'); Tm.draw(c, mq, -off + w, y, P(fg, 0.1), 'l')
    keys = [i * slot + 0.05 for i in range(n)]
    for i, wd in enumerate(words):
        t0 = keys[i]; tout = (i + 1) * slot - 0.22 if i < n - 1 else None
        track = 0.0
        if i % 2 == 1 and ctx.style_name != 'bouncy': track = lerp(-10, 50, eioc(prog(lt, t0 + 0.1, t0 + slot * 0.8))) * U
        s, T = big_text(ctx, wd, sc.get('size', 300), 0.84, track=50 * U if i % 2 else 0)
        if lt >= t0 and (tout is None or lt < tout + 0.5):
            stagger(ctx, c, s, ctx.cx, ctx.cy, T, P(fg), lt, t0, t_out=tout, track=track, glow=glow_of(ctx, acc))
            ctx.T(24, 'mono').draw(c, f'{i + 1:02d}', ctx.cx, ctx.cy - T.cap(s) / 2 - 40 * U, P(acc, eoc(prog(lt, t0, t0 + 0.2)) * (1 - prog(lt, tout or 1e9, (tout or 1e9) + 0.1))))
    if ctx.style_name in ('punch', 'swiss', 'hud') and not ctx.portrait: ease_graph(ctx, c, lt, 0.5 * D, fg, acc)
    timeline(ctx, c, lt, D, keys, fg)

def s_morph(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    labels = sc['labels']; n = len(labels); slot = D / n; cx, cy = ctx.cx, ctx.cy - 50 * U
    cols = [acc, acc2, fg, acc]
    dr = eoc(prog(lt, 0, 0.5))
    for i, (r, sp, dash) in enumerate([(330, 40, [4, 14]), (410, -25, [40, 20]), (500, 15, [2, 8])]):
        p = P(fg, 0.4, 2 * U, cap=False); p.setPathEffect(skia.DashPathEffect.Make([d * U for d in dash], 0))
        c.save(); c.translate(cx, cy); c.rotate(lt * sp); R = r * U
        c.drawArc(skia.Rect(-R, -R, R, R), -90, 360 * dr, False, p); c.restore()
    for i in range(6):
        a = lt * 2.2 + i * PI / 3; r = 410 * U * dr
        c.drawCircle(cx + r * math.cos(a), cy + r * math.sin(a), (7 if i % 2 else 4) * U, P(acc2 if i % 2 else acc))
    md = min(0.32, slot * 0.4)
    idx, u = 0, 0.0
    for i in range(1, n):
        if lt >= i * slot - md: idx = i - 1; u = eioe(prog(lt, i * slot - md, i * slot))
        if lt >= i * slot: idx, u = i, 0.0
    nxt = min(idx + 1, n - 1)
    pts = SHAPES[idx % 4] * (1 - u) + SHAPES[nxt % 4] * u
    color = lc(cols[idx % 4], cols[nxt % 4], u)
    sc_ = 200 * U * (eob(prog(lt, 0, 0.3), 2.0) if ctx.st['over'] else eoe(prog(lt, 0, 0.3)))
    blow = sc.get('blowup', True)
    ex = prog(lt, D - 0.3, D) if blow else 0
    if ex > 0:
        e2 = eioc(prog(lt, D - 0.38, D - 0.2)); pts = pts * (1 - e2) + SHAPES[0] * e2; color = lc(color, acc, e2)
        sc_ *= 1 + eie(ex) * 10
    rot = lt * 35 + sum(eioe(prog(lt, i * slot - md, i * slot)) * 90 for i in range(1, n))
    c.save(); c.translate(cx, cy); c.rotate(rot)
    c.drawPath(path_pts([(x * sc_, y * sc_) for x, y in pts]), shape_paint(ctx, color)); c.restore()
    for i in range(n):
        k = i * slot
        if 0 <= lt - k < 0.4:
            q = eoe((lt - k) / 0.4)
            for j in range(16):
                a = j * PI / 8 + i; r0 = (280 + q * 120) * U; r1 = (280 + q * 300) * U
                c.drawLine(cx + r0 * math.cos(a), cy + r0 * math.sin(a), cx + r1 * math.cos(a), cy + r1 * math.sin(a), P(fg, 1 - q, 4 * U))
    if ex < 0.15:
        ia = idx if u < 0.5 else nxt
        ctx.T(40, 'mono').draw_mid(c, f'{ia + 1:02d}', cx, cy, P(bg if contrast(bg, color) > 1.8 else fg, 1 - u * 2 if u < 0.5 else (u - 0.5) * 2))
        lb = ctx.up(labels[ia]); sz = fit_size(ctx, lb, 96 * U, ctx.W * 0.84)
        T = Text(ctx, sz); y = cy + (360 if not ctx.portrait else 420) * U
        stagger(ctx, c, lb, cx, y, T, P(fg), lt, ia * slot + 0.02, t_out=(ia + 1) * slot - 0.14 if ia < n - 1 else None, glow=glow_of(ctx, acc))

def flow_angle(x, y, t): return math.sin(x * 0.004 + t * 1.3) * 2.0 + math.cos(y * 0.005 - t * 0.9) * 1.6 + math.sin((x + y) * 0.002 + t)
def s_dots(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    sp = 60 * U; nx = int(ctx.W / sp) + 1; ny = int(ctx.H / sp) + 1
    mx = ctx.cx + ctx.W * 0.26 * math.sin(lt * 1.3); my = ctx.cy + ctx.H * 0.24 * math.cos(lt * 1.7)
    words = sc['words']; n = len(words); slot = (D - 0.35) / n
    ln = eioe(prog(lt, D * 0.45, D * 0.45 + 0.35)); ex = prog(lt, D - 0.35, D)
    wi = min(int(lt / slot), n - 1) if slot > 0 else 0
    s, T = big_text(ctx, words[wi], sc.get('size', 240), 0.8)
    ww = T.width(s) + 60 * U; ch = T.cap(s)
    box = (ctx.cx - ww / 2, ctx.cy - ch / 2 - 40 * U, ctx.cx + ww / 2, ctx.cy + ch / 2 + 40 * U)
    ox = (ctx.W - (nx - 1) * sp) / 2; oy = (ctx.H - (ny - 1) * sp) / 2
    for j in range(ny):
        for i in range(nx):
            x = ox + i * sp; y = oy + j * sp; d = math.hypot(x - ctx.cx, y - ctx.cy)
            ap = eob(prog(lt, d / 2600, d / 2600 + 0.35), 2)
            wv = 0.5 + 0.5 * math.sin(math.hypot(x - mx, y - my) / (70 * U) - lt * 9)
            r = (3 + 9 * wv) * U * ap
            if ex > 0:
                e = eie(prog(lt, D - 0.35 + i * 0.004, D - 0.15 + i * 0.004))
                c.drawCircle(x, y, max(r, lerp(r, sp * 0.78, e)), P(lc(fg, acc, min(1, e * 4)))); continue
            if box[0] < x < box[2] and box[1] < y < box[3]: continue
            if r <= 0.1: continue
            dotc = acc if (i + j) % 7 == 0 else fg
            if ln > 0:
                a = flow_angle(x / U, y / U, lt); L = lerp(0, 26 * U, ln)
                c.drawLine(x - math.cos(a) * L, y - math.sin(a) * L, x + math.cos(a) * L, y + math.sin(a) * L, P(dotc, 1, lerp(r * 2, (5 + 3 * wv) * U, ln)))
            else: c.drawCircle(x, y, r, P(dotc))
    if ex < 0.5:
        stagger(ctx, c, s, ctx.cx, ctx.cy, T, P(fg), lt, wi * slot + 0.05, t_out=(wi + 1) * slot - 0.22 if wi < n - 1 else None, glow=glow_of(ctx, acc))

def s_path(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    bw = ctx.up(sc.get('bg_word', ''));
    if bw:
        T = Text(ctx, fit_size(ctx, bw, 520 * U, ctx.W * 0.92)); T.draw_mid(c, bw, ctx.cx, ctx.cy, P(fg, 0.07))
    ax, ay = ctx.W * 0.37, ctx.H * 0.31
    if ctx.portrait: fx, fy = 2, 3
    else: fx, fy = 3, 2
    Npts = 1400; pts = [(ctx.cx + ax * math.sin(2 * PI * fx * i / Npts + PI / 2), ctx.cy + ay * math.sin(2 * PI * fy * i / Npts)) for i in range(Npts + 1)]
    cl = [acc2, acc, lc(acc, acc2, 0.5), fg]; head = None
    for k, cc in enumerate(cl):
        d = (3 - k) * 0.07
        hd = eioc(prog(lt - d, 0.02, D * 0.68)); tl = eioc(prog(lt - d, D * 0.55, D * 0.98))
        a, b = int(tl * Npts), int(hd * Npts)
        if b - a > 1:
            c.drawPath(path_pts(pts[a:b + 1], False), P(cc, 1, 22 * U))
            if k == 3: head = pts[b]
    if head and lt < D * 0.95:
        x, y = head; c.drawCircle(x, y, 20 * U, P(fg)); c.drawCircle(x, y, 32 * U, P(fg, 0.8, 2 * U))
        c.drawLine(x + 32 * U, y - 32 * U, x + 70 * U, y - 70 * U, P(fg, 0.8, 2 * U))
        lab = sc.get('label') or f'x:{x:6.1f}  y:{y:6.1f}'
        ctx.T(20, 'mono').draw(c, ctx.up(lab), x + 76 * U, y - 74 * U, P(fg), 'l')

CUBE = [(x, y, z) for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
EDGES = [(a, b) for a in range(8) for b in range(a + 1, 8) if sum(abs(CUBE[a][i] - CUBE[b][i]) for i in range(3)) == 2]
def s_tunnel(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    acc_t = eie(prog(lt, D * 0.7, D)); zt = lt * 2.6 + acc_t * 5
    c.save(); c.translate(ctx.cx, ctx.cy); c.rotate(math.sin(lt * 1.6) * 12 + lt * 20)
    tc = [acc, acc2, fg]; items = sorted((((i * 0.5 - zt) % 9.0) + 0.15, i) for i in range(18))[::-1]
    asp = ctx.H / ctx.W
    for z, i in items:
        s = 900 * U / z; a = clamp((9 - z) / 4) * clamp(z * 1.5)
        c.save(); c.rotate(z * 18)
        r = skia.Rect(-s, -s * asp, s, s * asp) if not ctx.portrait else skia.Rect(-s * 0.62, -s, s * 0.62, s)
        if ctx.st['corner']: c.drawRRect(skia.RRect.MakeRectXY(r, s * 0.2, s * 0.2), P(tc[i % 3], a, max(2, 26 / z) * U))
        else: c.drawRect(r, P(tc[i % 3], a, max(2, 26 / z) * U))
        c.restore()
    c.restore()
    wd = ctx.up(sc.get('word', ''))
    if wd:
        ap = eoc(prog(lt, 0.1, 0.4)); hasimg = sc.get('image') in ctx.images
        T = Text(ctx, fit_size(ctx, wd, (150 if hasimg else sc.get('size', 280)) * U, ctx.W * 0.86))
        c.save(); c.translate(ctx.cx, ctx.cy + (ctx.H * (0.3 if ctx.portrait else 0.38) if hasimg else 0)); s_ = lerp(1.4, 1.0, ap); c.scale(s_, s_)
        T.draw_mid(c, wd, 0, 0, P(fg, ap * 0.9, 3 * U)); c.restore()
    img = sc.get('image')
    if img and img in ctx.images:
        e = eob(prog(lt, 0.05, 0.5), 2) if ctx.st['over'] else eoe(prog(lt, 0.05, 0.5))
        sz = (520 if ctx.portrait else 400) * U * e * (1 + acc_t * 3); fl = math.sin(lt * 2.4) * 14 * U
        c.save(); c.translate(ctx.cx, ctx.cy + fl - (ctx.H * 0.05 if ctx.portrait else 90 * U)); c.scale(max(0.05, abs(math.cos(lt * 0.9) * 0.25 + 0.75)), 1)
        draw_image(ctx, c, img, 0, 0, sz, sz, plate=None); c.restore()
    else:
        ry = lt * 1.8; rx = lt * 1.1 + 0.5; S = 170 * U * eob(prog(lt, 0.05, 0.45), 2) * (1 + acc_t * 3); pr = []
        for x, y, z in CUBE:
            x1 = x * math.cos(ry) + z * math.sin(ry); z1 = -x * math.sin(ry) + z * math.cos(ry)
            y1 = y * math.cos(rx) - z1 * math.sin(rx); z2 = y * math.sin(rx) + z1 * math.cos(rx)
            k = 4 / (4 + z2); pr.append((ctx.cx + x1 * S * k, ctx.cy + y1 * S * k))
        for a, b in EDGES: c.drawLine(*pr[a], *pr[b], P(acc2, 1, 5 * U))
        for p in pr: c.drawCircle(*p, 9 * U, P(acc))
    if ctx.st['flash'] and lt > D - 0.1:
        c.drawColor(col(ctx.pal['light'], prog(lt, D - 0.1, D - 0.03)))

def s_cuts(ctx, c, sc, lt):
    U = ctx.U; D = sc['dur']; words = sc['words']; n = len(words); slot = D / n
    k = min(int(lt / slot), n - 1); u = (lt - k * slot) / slot
    roles = sc.get('bgs') or ['a3', 'a2', 'a1', 'light', 'dark']
    role = roles[k % len(roles)]; bg, fg, acc, acc2 = ctx.colors(dict(bg=role)); c.drawColor(col(bg))
    effs = sc.get('effects') or ctx.st['cuts']; eff = effs[k % len(effs)]
    word = ctx.up(words[k]); T = Text(ctx, fit_size(ctx, word, sc.get('size', 280) * U, ctx.W * 0.8)); ch = T.cap(word); w = T.width(word)
    for i in range(12):
        x = ((i * 190 * U + u * 300 * U * (1 if k % 2 else -1)) % (ctx.W + 360 * U)) - 180 * U
        c.drawRect(skia.Rect(x, 0, x + 40 * U, ctx.H), P(fg, 0.06))
    p = P(fg); c.save(); c.translate(ctx.cx, ctx.cy)
    if eff == 'rotate':
        c.rotate(lerp(-120, 0, ease_in(ctx.st, clamp(u * 1.6))) + u * 8); T.draw(c, word, 0, ch / 2, p)
    elif eff == 'squash':
        e = math.sin(PI * clamp(u * 1.6)) * (1 - 0.3 * clamp(u * 1.6)); c.translate(0, ch / 2); c.scale(lerp(1, 1.35, e), lerp(1, 0.5, e)); T.draw(c, word, 0, 0, p)
    elif eff == 'stretch':
        e = math.sin(PI * clamp(u * 1.6)); c.translate(0, ch / 2); c.scale(lerp(1, 0.78, e), lerp(1, 1.5, e) * lerp(0.3, 1, eoe(clamp(u * 3)))); T.draw(c, word, 0, 0, p)
    elif eff in ('overshoot', 'bounce'):
        s = spring(u * slot * (2.5 if eff == 'overshoot' else 1.6));
        if eff == 'bounce': c.translate(0, -abs(math.sin(u * PI * 2)) * 80 * U * (1 - u))
        c.scale(max(0.01, s), max(0.01, s)); T.draw(c, word, 0, ch / 2, p)
    elif eff == 'blur':
        e = eoe(clamp(u * 1.5)); xo = lerp(-ctx.W * 0.5, 0, e)
        for j in range(10, 0, -1): T.draw(c, word, xo - j * (1 - e) * 70 * U, ch / 2, P(fg, 0.12))
        T.draw(c, word, xo, ch / 2, p)
    elif eff in ('glitch', 'decode'):
        rng = random.Random(int(lt * 30) + k * 97)
        disp = word if eff == 'glitch' or u > 0.55 else ''.join(GLYPHS[rng.randrange(len(GLYPHS))] if (not is_cjk(ch_) and rng.random() > u * 1.6) else ch_ for ch_ in word)
        for j in range(12):
            y0 = -ch * 0.6 + j * ch * 1.2 / 12; y1 = y0 + ch * 1.2 / 12
            dx = rng.uniform(-60, 60) * U * (1 - u * 0.8) if rng.random() < 0.6 else 0
            c.save(); c.clipRect(skia.Rect(-1e4, y0, 1e4, y1))
            T.draw(c, disp, dx - 8 * U, ch / 2, P(acc, 0.9)); T.draw(c, disp, dx + 8 * U, ch / 2, P(acc2, 0.9)); T.draw(c, disp, dx, ch / 2, p)
            c.restore()
    elif eff == 'scale':
        s = lerp(4.5, 1, eoe(clamp(u * 1.4))); c.scale(s, s); T.draw(c, word, 0, ch / 2, p)
    elif eff == 'loop':
        T.draw(c, word, 0, ch / 2, p); c.rotate(u * 360 + lt * 200); r = w / 2 + 70 * U
        c.drawArc(skia.Rect(-r, -r * 0.55, r, r * 0.55), 0, 300, False, P(acc, 1, 10 * U))
    elif eff == 'slide':
        e = eoe(clamp(u * 2)); c.clipRect(skia.Rect(-1e4, -ch * 0.7, 1e4, ch * 0.62)); T.draw(c, word, 0, ch / 2 + (1 - e) * ch * 1.3, p)
    elif eff == 'mask':
        e = eioe(clamp(u * 2.2)); c.drawRect(skia.Rect(-w / 2 - 20 * U, -ch * 0.7, lerp(-w / 2 - 20 * U, w / 2 + 20 * U, e), ch * 0.7), P(acc))
        c.save(); c.clipRect(skia.Rect(-1e4, -1e4, lerp(-w / 2, w / 2 + 40 * U, eioe(clamp(u * 2.2 - 0.25))), 1e4)); T.draw(c, word, 0, ch / 2, p); c.restore()
    elif eff == 'track':
        tr = lerp(80, 0, eoe(clamp(u * 1.6))) * U; T.draw(c, word, 0, ch / 2, P(fg, eoe(clamp(u * 3))), track=tr)
    else: T.draw(c, word, 0, ch / 2, p)
    c.restore()
    ctx.T(30, 'mono').draw(c, f'{k + 1:02d}/{n:02d}', ctx.cx, (150 if not ctx.portrait else 220) * U, P(fg))

def s_stat(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    v = str(sc['value']); m = re.match(r'^(\D*?)([\d][\d,]*\.?\d*)(.*)$', v)
    e = eoe(prog(lt, 0.1, min(D * 0.6, 1.4)))
    if m:
        pre, num, suf = m.groups(); dec = len(num.split('.')[1]) if '.' in num else 0; val = float(num.replace(',', ''))
        cur = val * e; s = f'{cur:,.{dec}f}' if ',' in num else f'{cur:.{dec}f}'; txt = pre + s + suf
        pct = clamp(val / 100) if '%' in suf else 1.0
    else: txt, pct = v, 1.0
    cy = ctx.cy - 40 * U; R = (340 if not ctx.portrait else 420) * U
    c.drawCircle(ctx.cx, cy, R, P(fg, 0.15, 14 * U))
    c.drawArc(skia.Rect(ctx.cx - R, cy - R, ctx.cx + R, cy + R), -90, 360 * pct * e, False, P(acc, 1, 14 * U))
    for i in range(60):
        a = i / 60 * 2 * PI - PI / 2; r0 = R + 30 * U; r1 = r0 + (18 if i % 5 == 0 else 8) * U
        on = i / 60 <= pct * e
        c.drawLine(ctx.cx + r0 * math.cos(a), cy + r0 * math.sin(a), ctx.cx + r1 * math.cos(a), cy + r1 * math.sin(a), P(acc if on else fg, 1 if on else 0.3, 3 * U))
    full = (m.group(1) + m.group(2) + m.group(3)) if m else v
    T = Text(ctx, fit_size(ctx, full, 230 * U, R * 1.75))
    sc_ = ease_in(ctx.st, prog(lt, 0.05, 0.6)); c.save(); c.translate(ctx.cx, cy); c.scale(sc_, sc_)
    if glow_of(ctx, acc): T.draw_mid(c, txt, 0, 0, P(acc, 0.6, blur=14 * U))
    T.draw_mid(c, txt, 0, 0, P(fg)); c.restore()
    if sc.get('label'):
        lines = wrap(ctx, ctx.up(sc['label']), 54 * U, ctx.W * 0.8); T2 = Text(ctx, 54 * U)
        y0 = cy + R + 110 * U
        for i, ln in enumerate(lines[:2]):
            stagger(ctx, c, ln, ctx.cx, y0 + i * 72 * U, T2, P(fg), lt, 0.5 + i * 0.12, per=0.02)
    if sc.get('kicker'):
        ctx.T(32, 'mono').draw(c, ctx.up(sc['kicker']), ctx.cx, cy - R - 80 * U, P(fg, 0.7 * eoc(prog(lt, 0.2, 0.5))))

def s_product(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    if ctx.portrait: px, py, box = ctx.cx, ctx.H * 0.40, 640 * U
    else: px, py, box = ctx.W * 0.33, ctx.cy + 20 * U, 640 * U
    for i, (r, sp) in enumerate([(380, 30), (440, -18)]):
        p = P(acc if i == 0 else fg, 0.5, 3 * U, cap=False); p.setPathEffect(skia.DashPathEffect.Make([30 * U, 18 * U] if i else [4 * U, 14 * U], 0))
        c.save(); c.translate(px, py); c.rotate(lt * sp); R = r * U * eoc(prog(lt, 0, 0.5))
        c.drawCircle(0, 0, R, p); c.restore()
    c.drawCircle(px, py, 300 * U * eob(prog(lt, 0, 0.35), 2), P(acc, 0.9))
    e = ease_in(ctx.st, prog(lt, 0.1, 0.1 + ctx.st['din'] * 1.4)); fl = math.sin(lt * 2.2) * 10 * U
    rect = None
    if sc.get('image') in ctx.images:
        c.save(); c.translate(px, py + fl + (1 - e) * 200 * U); c.scale(max(0.01, e), max(0.01, e))
        rect = draw_image(ctx, c, sc['image'], 0, 0, box, box, plate=None); c.restore()
    cos = sc.get('callouts', [])[:4]
    title = ctx.up(sc.get('title', ''))
    if ctx.portrait:
        if title:
            T = Text(ctx, fit_size(ctx, title, 150 * U, ctx.W * 0.86)); stagger(ctx, c, title, ctx.cx, ctx.H * 0.12, T, P(fg), lt, 0.2, glow=glow_of(ctx, acc))
        ys = [ctx.H * 0.64 + i * 125 * U for i in range(len(cos))]; xl = ctx.W * 0.12; maxw = ctx.W * 0.74
    else:
        if title:
            T = Text(ctx, fit_size(ctx, title, 120 * U, ctx.W * 0.42)); stagger(ctx, c, title, ctx.W * 0.73, ctx.H * 0.2, T, P(fg), lt, 0.2, glow=glow_of(ctx, acc))
        n = max(1, len(cos)); ys = [ctx.cy - (n - 1) * 70 * U + i * 140 * U + 60 * U for i in range(len(cos))]; xl = ctx.W * 0.56; maxw = ctx.W * 0.36
    for i, co in enumerate(cos):
        t0 = 0.45 + i * 0.18; a = eoc(prog(lt, t0, t0 + 0.35)); y = ys[i]
        if a <= 0: continue
        sx, sy = (px + 300 * U * 0.7, py + (y - py) * 0.3) if not ctx.portrait else (px + (xl - px) * 0.2, py + 300 * U)
        ex, ey = lerp(sx, xl - 30 * U, a), lerp(sy, y, a)
        c.drawLine(sx, sy, ex, ey, P(fg, 0.6, 2 * U)); c.drawCircle(sx, sy, 7 * U, P(fg))
        c.drawCircle(xl - 30 * U + 12 * U, y, 12 * U * a, P(acc))
        lines = wrap(ctx, co, 46 * U, maxw)[:2]; T2 = Text(ctx, 46 * U)
        for j, ln in enumerate(lines):
            c.save(); c.clipRect(skia.Rect(xl, y - 60 * U + j * 58 * U, ctx.W, y + 30 * U + j * 58 * U))
            T2.draw(c, ln, xl + 20 * U, y + T2.cap(ln) / 2 + j * 58 * U + (1 - a) * 60 * U, P(fg), 'l'); c.restore()

def s_end(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; k = D / 1.5
    zoom = 1 + 0.035 * prog(lt, 0, D); c.save(); c.translate(ctx.cx, ctx.cy); c.scale(zoom, zoom); c.translate(-ctx.cx, -ctx.cy)
    ly = ctx.cy - (210 if not ctx.portrait else 330) * U
    e = eoe(prog(lt, 0, 0.28)); q = eie(prog(lt, 0.22, 0.35))
    for sx, sy in [(0, ly), (ctx.W, ly), (ctx.cx, -50 * U), (ctx.cx, ctx.H + 50 * U)]:
        exx, eyy = lerp(sx, ctx.cx, e), lerp(sy, ly, e); bx, by = lerp(sx, ctx.cx, q), lerp(sy, ly, q)
        if q < 1: c.drawLine(bx, by, exx, eyy, P(fg, 1, 3 * U))
    logo = sc.get('logo', 'logo')
    if logo in ctx.images:
        s = ease_in(ctx.st, prog(lt, 0.26, 0.26 + ctx.st['din'] * 1.3))
        c.save(); c.translate(ctx.cx, ly); c.scale(max(0.01, s), max(0.01, s))
        draw_image(ctx, c, logo, 0, 0, 340 * U, 190 * U, plate=None, shadow=False); c.restore()
    else:
        for j, (si, cc, dx) in enumerate([(0, acc, -130), (2, acc2, 0), (1, fg, 130)]):
            s = 48 * U * (eob(prog(lt, 0.26 + j * 0.06, 0.6 + j * 0.06), 2.6) if ctx.st['over'] else eoe(prog(lt, 0.26 + j * 0.06, 0.6 + j * 0.06)))
            if s > 0:
                c.save(); c.translate(ctx.cx + dx * U, ly); c.rotate((1 - eoe(prog(lt, 0.26 + j * 0.06, 0.8))) * -180 + (45 if si == 1 else 0))
                c.drawPath(path_pts([tuple(p) for p in SHAPES[si] * s]), shape_paint(ctx, cc)); c.restore()
    title = ctx.up(sc.get('title', '')); T = Text(ctx, fit_size(ctx, title, 230 * U, ctx.W * 0.86))
    ty = ctx.cy + (20 if not ctx.portrait else -40) * U
    stagger(ctx, c, title, ctx.cx, ty, T, P(fg), lt, 0.35, per=ctx.st['per'] * 1.2, glow=glow_of(ctx, acc))
    lw = eioe(prog(lt, 0.6, 1.0)) * min(560 * U, ctx.W * 0.4); uy = ty + T.cap(title) / 2 + 50 * U
    c.drawLine(ctx.cx - lw, uy, ctx.cx + lw, uy, P(acc, 1, 4 * U, cap=False))
    sub = ctx.up(sc.get('subtitle', ''))
    if sub:
        Tm = Text(ctx, fit_size(ctx, sub, 38 * U, ctx.W * 0.84, 'mono'), 'mono'); nn = int(len(sub) * prog(lt, 0.65, min(D - 0.3, 0.65 + 0.03 * len(sub))))
        if nn > 0:
            full = Tm.width(sub); x0 = ctx.cx - full / 2; y = uy + 80 * U
            Tm.draw(c, sub[:nn], x0, y, P(fg), 'l')
            if int(lt * 6) % 2 == 0 or nn < len(sub):
                cx_ = x0 + Tm.width(sub[:nn]) + 6 * U; c.drawRect(skia.Rect(cx_, y - 32 * U, cx_ + 5 * U, y + 6 * U), P(acc2))
    cta = ctx.up(sc.get('cta', ''))
    if cta:
        a = eoc(prog(lt, 0.95, 1.25)); Tc = ctx.T(34, 'mono'); w2 = Tc.width(cta); y = uy + 170 * U
        r = skia.Rect(ctx.cx - w2 / 2 - 60 * U, y - 40 * U, ctx.cx + w2 / 2 + 36 * U, y + 40 * U)
        c.drawRRect(skia.RRect.MakeRectXY(r, 40 * U, 40 * U), P(acc, a))
        cf = max((ctx.pal['dark'], ctx.pal['light']), key=lambda q: contrast(q, acc)); c.drawCircle(r.left() + 32 * U, y, (8 + 2 * math.sin(lt * 12)) * U, P(cf, a)); Tc.draw_mid(c, cta, ctx.cx + 12 * U, y, P(cf, a))
    c.restore()

SCENES = {'hook': s_hook, 'kinetic_words': s_kinetic, 'shape_morph': s_morph, 'dot_field': s_dots, 'path_trace': s_path,
          'depth_tunnel': s_tunnel, 'rapid_cuts': s_cuts, 'stat': s_stat, 'product_hero': s_product, 'end_card': s_end}
REQUIRED = {'hook': ['line1'], 'kinetic_words': ['words'], 'shape_morph': ['labels'], 'dot_field': ['words'], 'path_trace': [],
            'depth_tunnel': [], 'rapid_cuts': ['words'], 'stat': ['value'], 'product_hero': ['image'], 'end_card': ['title']}

def scene_events(sc):
    """Local times of visual hits inside a scene (for camera punch + sfx)."""
    D = sc['dur']; t = sc['type']
    if t in ('kinetic_words', 'rapid_cuts'): n = len(sc['words']); return [i * D / n for i in range(1, n)]
    if t == 'shape_morph': n = len(sc['labels']); return [i * D / n for i in range(1, n)]
    if t == 'dot_field': n = len(sc['words']); return [i * (D - 0.35) / n for i in range(1, n)]
    if t == 'hook': return [0.52 * D / 1.5]
    if t == 'end_card': return [0.35]
    return []

# ---- motion recipes (mgfx_recipes.py) ----
import mgfx_recipes as _rc
import mgfx_chapters as _ch
SCENES.update(_rc.SCENES2); REQUIRED.update(_rc.REQUIRED2); SCENES.update(_ch.SCENES3); REQUIRED.update(_ch.REQUIRED3)
import mgfx_portfolio as _pf
SCENES.update(_pf.SCENES4); REQUIRED.update(_pf.REQUIRED4)
import mgfx_ignite as _ig
SCENES.update(_ig.SCENES5); REQUIRED.update(_ig.REQUIRED5)
import mgfx_ideaform as _if
SCENES.update(_if.SCENES6); REQUIRED.update(_if.REQUIRED6)
import mgfx_typeform as _tf
SCENES.update(_tf.SCENES7); REQUIRED.update(_tf.REQUIRED7)
import mgfx_reelcraft as _rf
SCENES.update(_rf.SCENES8); REQUIRED.update(_rf.REQUIRED8)
_base_events = scene_events
def scene_events(sc):
    ev = _rc.events2(sc)
    if ev is None: ev = _ch.events3(sc)
    if ev is None: ev = _pf.events4(sc)
    if ev is None: ev = _ig.events5(sc)
    if ev is None: ev = _if.events6(sc)
    if ev is None: ev = _tf.events7(sc)
    if ev is None: ev = _rf.events8(sc)
    return ev if ev is not None else _base_events(sc)

# ---- product_glow 产品灯效: the product's own light carries the scene. A tinted, blurred copy of the product
# silhouette glows behind it and switches colour on every beat (cycle of palette roles); a ring pulses out from the
# product on each beat, a soft wash tints the background, the headline rises letter by letter on the left with an
# underline in the live colour, and a mono readout + swatch row name the current colour.
def _hex(cc): return '#%02X%02X%02X' % tuple(int(v) for v in cc[:3])
def s_glow(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; b = ctx.beat
    cyc = [ctx.pal[r] for r in sc.get('cycle', ['a1', 'a2', 'a3'])]; n = len(cyc)
    ph = lt / b; i = int(ph) % n; u = eoe(clamp((ph % 1) / 0.22)); cur = lc(cyc[(i - 1) % n] if ph >= 1 else cyc[i], cyc[i], u)
    hit = math.exp(-(ph % 1) * 6)
    c.drawColor(col(cur, 0.10 + 0.06 * hit))
    if ctx.portrait: px, py, box = ctx.cx, ctx.H * 0.42, ctx.W * 0.86
    else: px, py, box = ctx.W * 0.64, ctx.cy + 10 * U, 820 * U
    e = ease_in(ctx.st, prog(lt, 0.0, 0.0 + ctx.st['din'] * 1.4)); fl = math.sin(lt * 2.4) * 8 * U
    for k in range(3):
        q = ((ph + k / 3.0) % 1.0) if lt > 0.15 else 0
        R = (260 + 520 * eoe(q)) * U; a = (1 - q) * 0.55 * clamp(lt / 0.3)
        if a > 0.01: c.drawCircle(px, py, R, P(cur, a, (4 - 2 * q) * U))
    key = sc.get('image')
    if key in ctx.images:
        img, _ = ctx.images[key]; s = min(box / img.width(), box / img.height()) * (0.82 + 0.18 * e)
        w, h = img.width() * s, img.height() * s; r = skia.Rect(px - w / 2, py + fl - h / 2, px + w / 2, py + fl + h / 2)
        smp = skia.SamplingOptions(skia.FilterMode.kLinear, skia.MipmapMode.kNone)
        for blur, a in [(70 * U, 0.85), (22 * U, 0.9)]:
            gp = skia.Paint(AntiAlias=True, ColorFilter=skia.ColorFilters.Blend(col(cur), skia.BlendMode.kSrcIn), ImageFilter=skia.ImageFilters.Blur(blur, blur))
            gp.setAlphaf(clamp(a * e * (0.75 + 0.25 * hit))); c.drawImageRect(img, r, smp, gp)
        p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(e)); c.drawImageRect(img, r, smp, p)
    words = [ctx.up(w) for w in (sc.get('words') or [sc.get('word', '')]) if w]; nw = max(1, len(words))
    lx = ctx.W * 0.08 if not ctx.portrait else ctx.cx; al = 'l' if not ctx.portrait else 'c'; ty = ctx.cy - 20 * U if not ctx.portrait else ctx.H * 0.80
    seg = (D - 0.1) / nw; wi = min(nw - 1, int(max(0, lt - 0.1) / seg)) if words else 0
    sz = sc.get('size', 150) * U; maxw = ctx.W * (0.40 if not ctx.portrait else 0.86)
    Ts = [Text(ctx, fit_size(ctx, w, sz, maxw)) for w in words]; cap = max([T.cap(w) for T, w in zip(Ts, words)] or [0])
    for k, (w, T) in enumerate(zip(words, Ts)):
        t0 = 0.1 + k * seg; tout = t0 + seg - 0.16 if k < nw - 1 else None
        if t0 - 0.05 <= lt <= (tout + 0.6 if tout else D):
            _rf.rise(ctx, c, w, lx, ty, T, P(fg), lt, t0, per=0.03, dur=0.36, t_out=tout, align=al)
    if words:
        w = words[wi]; T = Ts[wi]; uy = ty + cap / 2 + 40 * U; x0 = lx if al == 'l' else lx - T.width(w) / 2
        t0 = 0.1 + wi * seg; ww = T.width(w) * eioe(prog(lt, t0 + 0.1, t0 + 0.4)); c.drawRect(skia.Rect(x0, uy, x0 + ww, uy + 8 * U), P(cur))
        M = ctx.T(26, 'mono'); a = eoc(prog(lt, 0.4, 0.7))
        if a > 0:
            lab = ctx.up(sc.get('label', 'LIGHT')); M.draw(c, '%s  %02d / %s' % (lab, i + 1, _hex(cyc[i])), x0, uy + 80 * U, P(fg, 0.8 * a), 'l')
            for j, cc in enumerate(cyc):
                q = (22 if j == i else 14) * U; sx = x0 + j * 44 * U + 11 * U
                c.drawRect(skia.Rect(sx - q / 2, uy + 130 * U - q / 2, sx + q / 2, uy + 130 * U + q / 2), P(cc, a if j == i else 0.55 * a))
SCENES['product_glow'] = s_glow; REQUIRED['product_glow'] = ['image']
_ev_prev = scene_events
def scene_events(sc):
    if sc['type'] == 'product_glow': b = sc['dur'] / max(1, sc['beats']); return [b * k for k in range(1, int(sc['beats']))]
    return _ev_prev(sc)
