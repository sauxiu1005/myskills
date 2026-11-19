"""Idea-to-form modules (R5, original — designed for creative-platform / co-creation brands).
One carrier runs through the chain: a prompt caret -> a stroke -> a canvas frame -> morphing media inside the frame ->
zoom out to a shared canvas -> everything collapses back into the caret, which writes the wordmark.
Modules: prompt_type, frame_trace, media_morph, canvas_zoom, caret_lockup. Each hands off by geometry (hard, invisible cuts)."""
import math
import skia
from mgfx_core import *
from mgfx_recipes import carrier, mono, cache
import mgfx_chapters

# ---------------- theme ----------------
def theme(ctx, sc):
    """bg / fg from the scene; card = surface colour of frames and tiles (white on light themes)."""
    bg, fg, _, _ = ctx.colors(sc); light = lum(bg) > 0.5
    card = (255, 255, 255) if light else lc(bg, fg, 0.045); ctx._th = (bg, fg, card, light); return bg, fg, card, light
def th(ctx): return getattr(ctx, '_th', None) or (ctx.pal['dark'], ctx.pal['light'], lc(ctx.pal['dark'], ctx.pal['light'], 0.045), False)

# ---------------- shared geometry ----------------
def frame_rect(ctx):
    w = ctx.W * (0.84 if ctx.portrait else 0.56); h = w * 9 / 16
    return ctx.cx - w / 2, ctx.cy - 30 * ctx.U - h / 2, w, h
def stroke_len(ctx): return frame_rect(ctx)[2] * 0.3
def lockup_geom(ctx, sc):
    U = ctx.U; title = sc.get('title', 'MiniMax Design')
    T = Text(ctx, fit_size(ctx, title, sc.get('size', 150) * U, ctx.W * 0.72)); tw = T.width(title); cap = T.cap(title)
    x0 = ctx.cx - tw / 2; base = ctx.cy + cap / 2 - 40 * U
    return T, title, tw, cap, x0, base
def caret_box(ctx, x, base, cap):  # caret rect for the lockup
    U = ctx.U; return skia.Rect(x - 3.5 * U, base - cap * 1.12, x + 3.5 * U, base + cap * 0.16)
def _next(ctx, sc):
    i = sc['i'] + 1
    return ctx.scenes[i] if i < len(ctx.scenes) else None

def frame_r(ctx, w): return w * 0.075 if ctx.spec.get('frame_shape', 'icon') == 'icon' else 14 * ctx.U
def rr_path(x, y, w, h, r, shape='icon'):
    """Frame outline starting at bottom centre (so a stroke can split there and wrap both ways).
    shape 'icon' = square corners except a rounded bottom-left (the MiniMax Design icon shape); 'round' = all corners."""
    q = r if shape == 'round' else 0.0
    p = skia.Path(); p.moveTo(x + w / 2, y + h); p.lineTo(x + r, y + h)
    p.arcTo(skia.Rect(x, y + h - 2 * r, x + 2 * r, y + h), 90, 90, False)
    if q: p.lineTo(x, y + q); p.arcTo(skia.Rect(x, y, x + 2 * q, y + 2 * q), 180, 90, False); p.lineTo(x + w - q, y); p.arcTo(skia.Rect(x + w - 2 * q, y, x + w, y + 2 * q), 270, 90, False); p.lineTo(x + w, y + h - q); p.arcTo(skia.Rect(x + w - 2 * q, y + h - 2 * q, x + w, y + h), 0, 90, False)
    else: p.lineTo(x, y); p.lineTo(x + w, y); p.lineTo(x + w, y + h)
    p.close(); return p
def frame_path(ctx, x, y, w, h): return rr_path(x, y, w, h, frame_r(ctx, w), ctx.spec.get('frame_shape', 'icon'))

def draw_frame_chrome(ctx, c, fx, fy, fw, fh, fg, bg, k=1.0, grid=1.0, handles=1.0, labels=1.0, sc=None, lt=0.0, stroke=None):
    """The canvas frame in its settled state: fill, dot grid, outline, corner handles, meta labels."""
    U = ctx.U; fp = frame_path(ctx, fx, fy, fw, fh); card = th(ctx)[2]
    c.drawPath(fp, P(card, k))
    if grid > 0:
        c.save(); c.clipPath(fp, doAntiAlias=True); sp = 36 * U; gx = fx + (fw % sp) / 2; gy = fy + (fh % sp) / 2
        pt = P(fg, 0.16 * grid * k); yy = gy
        while yy <= fy + fh:
            xx = gx
            while xx <= fx + fw: c.drawCircle(xx, yy, 1.5 * U, pt); xx += sp
            yy += sp
        c.restore()
    c.drawPath(fp, P(fg, 0.9 * k, stroke or 2.4 * U))
    if handles > 0: draw_handles(ctx, c, fx, fy, fw, fh, fg, bg, k * clamp(handles), handles)
    if labels > 0 and sc is not None:
        Tm = mono(ctx, 19); y = fy - 26 * U
        Tm.draw(c, sc.get('meta_left', 'CANVAS · 16:9'), fx, y, P(fg, 0.55 * labels * k), 'l', track=2 * U)
        Tm.draw(c, sc.get('meta_right', '1920 × 1080'), fx + fw, y, P(fg, 0.55 * labels * k), 'r', track=2 * U)

def draw_handles(ctx, c, fx, fy, fw, fh, fg, bg, a, s=1.0):
    """Selection handles: filled dots on the three square corners (as in the brand icon), squares on 'round' frames."""
    U = ctx.U; r = 8 * U * max(0.0, s)
    if r <= 0: return
    if ctx.spec.get('frame_shape', 'icon') == 'icon':
        for (x, y) in ((fx, fy), (fx + fw, fy), (fx + fw, fy + fh)): c.drawCircle(x, y, r, P(fg, a))
    else:
        for (x, y) in ((fx, fy), (fx + fw, fy), (fx, fy + fh), (fx + fw, fy + fh)):
            q = skia.Rect(x - r, y - r, x + r, y + r); c.drawRect(q, P(bg, a)); c.drawRect(q, P(fg, a, 2 * U))

# ---------------- 1. prompt_type ----------------
# prompt_type: an input pill draws on, an idea is typed, "send" is pressed; the letters lift away, the pill collapses
# into its centre line and the caret lies down into the same stroke (hand-off: carrier stroke at screen centre)
def s_prompt_type(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc); cx, cy = ctx.cx, ctx.cy
    s = sc.get('text', '我有一个想法'); T = Text(ctx, sc.get('size', 58) * U); cap = T.cap(s)
    fw = frame_rect(ctx)[2]; L1 = stroke_len(ctx); pw = max(fw * 0.8, T.width(s) + 300 * U); ph = 116 * U
    t0 = 0.42; cps = sc.get('cps', 7.5); t1 = t0 + len(s) / cps; ts = t1 + 0.2; tc0 = ts + 0.1; tc1 = min(D - 0.3, tc0 + 0.62)
    a = eoe(prog(lt, 0, 0.42)); cp = eioc(prog(lt, tc0, tc1))
    ww = lerp(pw * a, L1, cp); hh = ph * (1 - cp); lw = lerp(2.4 * U, 6 * U, cp); pc = lc(fg, cc, cp)
    if hh > 2 * U:
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(cx - ww / 2, cy - hh / 2, cx + ww / 2, cy + hh / 2), hh / 2, hh / 2), P(pc, 0.9 if cp < 1 else 1, lw))
    elif ww > 1:
        c.drawLine(cx - ww / 2, cy, cx + ww / 2, cy, P(cc, 0.5, 14 * U, blur=10 * U)); c.drawLine(cx - ww / 2, cy, cx + ww / 2, cy, P(cc, 1, lw))
    la = eoc(prog(lt, 0.15, 0.5)) * (1 - cp)
    if la > 0: mono(ctx, 20).draw(c, sc.get('kicker', 'PROMPT'), cx - pw / 2 + 10 * U, cy - ph / 2 - 30 * U, P(fg, 0.5 * la), 'l', track=4 * U)
    # typed text; after send, letters lift away one by one
    x0 = cx - pw / 2 + 60 * U; n = int(clamp((lt - t0) * cps, 0, len(s))); x = x0
    for k, ch in enumerate(s[:n]):
        aw = T.font_for(ch).measureText(ch); up = eie(prog(lt, ts + 0.035 * k, ts + 0.035 * k + 0.45))
        if up < 1: c.drawString(ch, x, cy + cap / 2 - up * 90 * U, T.font_for(ch), P(fg, 1 - up))
        x += aw
    # send button
    bx = cx + pw / 2 - 62 * U; ba = a * (1 - cp)
    if ba > 0.01:
        press = math.exp(-max(0, lt - ts) * 9) if lt >= ts else 0; on = lt >= ts; r = 34 * U * (1 - 0.14 * press) * ba
        c.drawCircle(bx, cy, r, P(cc if on else fg, (1 if on else 0.14) * ba))
        ac = bg if on else fg; q = 12 * U * ba
        c.drawLine(bx, cy + q, bx, cy - q, P(ac, ba, 3.2 * U)); c.drawLine(bx - q * 0.75, cy - q * 0.25, bx, cy - q, P(ac, ba, 3.2 * U)); c.drawLine(bx + q * 0.75, cy - q * 0.25, bx, cy - q, P(ac, ba, 3.2 * U))
    # caret: blinks, follows the text, then lies down into the stroke
    if lt > 0.25 and cp < 1:
        kx = x0 + T.width(s[:n]) + 8 * U; blink = 1.0 if (t0 <= lt <= ts + 0.1) else (1.0 if int(lt / 0.27) % 2 == 0 else 0.0)
        X = lerp(kx, cx, cp); Wd = lerp(5 * U, L1, cp); Hd = lerp(cap * 1.35, 6 * U, cp)
        if blink or cp > 0: c.drawRect(skia.Rect(X - (Wd / 2 if cp > 0 else 0), cy - Hd / 2, X + (Wd / 2 if cp > 0 else Wd), cy + Hd / 2), P(cc))

# ---------------- 2. frame_trace ----------------
# frame_trace: the carrier stroke drops to the frame's bottom edge, splits and wraps both ways round a 16:9 frame;
# the heads meet at the top with a flash, the stroke cools to a hairline, grid + handles + labels appear, caption rises
def s_frame_trace(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc)
    fx, fy, fw, fh = frame_rect(ctx); L1 = stroke_len(ctx); ycb = fy + fh
    tm = 1.1; settle = eoc(prog(lt, tm, tm + 0.3))
    if lt >= tm: draw_frame_chrome(ctx, c, fx, fy, fw, fh, fg, bg, k=settle, grid=eoc(prog(lt, tm + 0.05, tm + 0.6)), handles=eob(prog(lt, tm + 0.1, tm + 0.45), 2), labels=eoc(prog(lt, tm + 0.25, tm + 0.6)), sc=sc)
    lw = lerp(6 * U, 2.4 * U, settle); kc = lc(cc, fg, settle)
    if lt < 0.38:
        u = eioc(prog(lt, 0, 0.38)); y = lerp(ctx.cy, ycb, u)
        c.drawLine(ctx.cx - L1 / 2, y, ctx.cx + L1 / 2, y, P(cc, 0.5, 14 * U, blur=10 * U)); c.drawLine(ctx.cx - L1 / 2, y, ctx.cx + L1 / 2, y, P(cc, 1, 6 * U))
    elif settle < 1:
        path = frame_path(ctx, fx, fy, fw, fh); pm = skia.PathMeasure(path, False); Lp = pm.getLength()
        s = lerp(L1 / 2, Lp / 2, eioe(prog(lt, 0.38, tm))); seg = skia.Path()
        pm.getSegment(0, s, seg, True); pm.getSegment(Lp - s, Lp, seg, True)
        c.drawPath(seg, P(kc, 0.45 * (1 - settle), 14 * U, blur=10 * U)); c.drawPath(seg, P(kc, 1, lw))
    if lt >= tm:
        u = lt - tm; c.drawCircle(ctx.cx, fy, 12 * U + u * 260 * U, P(cc, 0.8 * math.exp(-u * 6), 3 * U)); c.drawCircle(ctx.cx, fy, 9 * U * math.exp(-u * 5), P(cc))
    if sc.get('caption'):
        a = eoc(prog(lt, tm + 0.3, tm + 0.75)) * (1 - prog(lt, D - 0.3, D - 0.05))
        if a > 0: Text(ctx, 46 * U).draw(c, sc['caption'], ctx.cx, fy + fh + 100 * U + (1 - a) * 24 * U, P(fg, a))

# ---------------- 3. media_morph ----------------
NPT = 180
def _poly_sample(pts, n=NPT):
    """Resample a closed convex polygon to n points by arc length, starting where a leftward ray from the centroid
    crosses it and running clockwise (screen coords) — gives stable point correspondence between any two shapes."""
    if len(pts) == 1: return [pts[0]] * n
    area = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    if area < 0: pts = pts[::-1]
    gx = sum(p[0] for p in pts) / len(pts); gy = sum(p[1] for p in pts) / len(pts)
    best = None  # leftward ray intersection
    for i in range(len(pts)):
        (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % len(pts)]
        if (y1 - gy) * (y2 - gy) <= 0 and y1 != y2:
            t = (gy - y1) / (y2 - y1); x = x1 + t * (x2 - x1)
            if x <= gx and (best is None or x < best[0]): best = (x, gy, i, t)
    x, y, i0, t0 = best; seq = [(x, y)] + [pts[(i0 + 1 + k) % len(pts)] for k in range(len(pts))] + [(x, y)]
    seg = [math.hypot(seq[k + 1][0] - seq[k][0], seq[k + 1][1] - seq[k][1]) for k in range(len(seq) - 1)]; L = sum(seg)
    out = []; k = 0; acc = 0.0
    for j in range(n):
        d = L * j / n
        while k < len(seg) - 1 and acc + seg[k] < d: acc += seg[k]; k += 1
        u = (d - acc) / seg[k] if seg[k] else 0; out.append((lerp(seq[k][0], seq[k + 1][0], u), lerp(seq[k][1], seq[k + 1][1], u)))
    return out
def _rect(x0, y0, x1, y1): return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
def _circle(x, y, r, m=48): return [(x + r * math.cos(2 * PI * k / m), y + r * math.sin(2 * PI * k / m)) for k in range(m)]

def media_state(ctx, kind, rect, t=0.0, grow=1.0, kick=0.0):
    """List of 8 (points, colour) elements describing one medium inside rect. kind: text | image | video | sound."""
    fx, fy, fw, fh = rect; pal = ctx.pal; _, fg, bg, light = th(ctx); cc, a2, a3 = pal['a1'], pal['a2'], pal['a3']
    X = lambda u: fx + u * fw; Y = lambda v: fy + v * fh; out = []
    if kind == 'text':
        rows = [(0.09, 0.14, 0.58, 0.27, fg)] + [(0.09, 0.38 + 0.1 * k, 0.09 + w, 0.38 + 0.1 * k + 0.05, lc(bg, fg, 0.5)) for k, w in enumerate((0.8, 0.72, 0.77, 0.48, 0.62))]
        rows.append((0.68, 0.12, 0.91, 0.29, a2))
        for k, (x0, y0, x1, y1, cl) in enumerate(rows):
            g = eoe(clamp(grow * 1.6 - k * 0.1)); out.append((_rect(X(x0), Y(y0), X(lerp(x0 + 0.002, x1, g)), Y(y1)), cl))
        lx = 0.09 + 0.62 * eoe(clamp(grow * 1.6 - 0.5)) + 0.012; out.append((_rect(X(lx), Y(0.775), X(lx + 0.011), Y(0.86)), cc))
    elif kind in ('image', 'video'):
        v = max(0.0, t) if kind == 'video' else 0.0; d1, d2, d3 = -0.05 * v, -0.1 * v, -0.18 * v; sun = 0.3 - 0.05 * eoe(clamp(v * 1.5))
        m1, m2, gr, cl1, cl2 = ((a2, a3, fg, (255, 255, 255), (255, 255, 255)) if light else (lc(bg, a2, 0.55), a2, lc(a3, bg, 0.25), lc(bg, fg, 0.85), lc(bg, fg, 0.6)))
        out.append((_circle(X(0.7), Y(sun), 0.085 * fw), cc))
        out.append(([(X(-0.05 + d1), Y(0.78)), (X(0.33 + d1), Y(0.36)), (X(0.78 + d1), Y(0.78))], m1))
        out.append(([(X(0.28 + d2), Y(0.84)), (X(0.62 + d2), Y(0.44)), (X(1.08 + d2), Y(0.84))], m2))
        out.append(([(X(-0.02), Y(1.02)), (X(-0.02), Y(0.8)), (X(0.45 + d3), Y(0.7)), (X(1.02), Y(0.79)), (X(1.02), Y(1.02))], gr))
        out.append((_rect(X(0.1 - d2 * 0.6), Y(0.19), X(0.3 - d2 * 0.6), Y(0.245)), cl1))
        out.append((_rect(X(0.44 - d1), Y(0.12), X(0.56 - d1), Y(0.16)), cl2))
        out.append(([(X(0.7), Y(sun))], cc)); out.append(([(X(0.7), Y(sun))], cc))
    else:  # sound: 8 bars, pulse on the beat
        hs = (0.22, 0.4, 0.62, 0.46, 0.74, 0.5, 0.34, 0.2); cols = (a2, cc, cc, fg, cc, a3, a2, a2) if light else (cc, cc, lc(cc, a2, 0.5), a2, a2, lc(a2, a3, 0.5), a3, a3)
        for k, h0 in enumerate(hs):
            h = h0 * (0.72 + 0.38 * kick * (0.6 + 0.4 * math.sin(k * 1.7)) + 0.06 * math.sin(t * 7 + k)); x0 = 0.17 + k * 0.088
            out.append((_rect(X(x0), Y(0.5 - h / 2), X(x0 + 0.05), Y(0.5 + h / 2)), cols[k]))
    return out

def draw_elems(c, elems, alpha=1.0, round_r=0):
    for pts, cl in elems:
        if len(pts) < 3: continue
        p = skia.Path(); p.moveTo(*pts[0])
        for q in pts[1:]: p.lineTo(*q)
        p.close(); pa = P(cl, alpha)
        if round_r: pa.setPathEffect(skia.CornerPathEffect.Make(round_r))
        c.drawPath(p, pa)
def morph(A, B, u, stagger=0.06):
    out = []
    for k, ((pa, ca), (pb, cb)) in enumerate(zip(A, B)):
        v = eioc(clamp(u * (1 + stagger * 7) - stagger * k)); sa, sb = _poly_sample(pa), _poly_sample(pb)
        out.append(([(lerp(x1, x2, v), lerp(y1, y2, v)) for (x1, y1), (x2, y2) in zip(sa, sb)], lc(ca, cb, v)))
    return out
def sky(ctx, c, rect, a):
    if a <= 0: return
    fx, fy, fw, fh = rect; p = skia.Paint(AntiAlias=True)
    _, _, card, light = th(ctx); top = lc(card, ctx.pal['a2'], 0.75 if light else 0.22)
    p.setShader(skia.GradientShader.MakeLinear([skia.Point(fx, fy), skia.Point(fx, fy + fh)], [col(top, a), col(card, 0)]))
    c.drawRect(skia.Rect(fx, fy, fx + fw, fy + fh), p)

def media_schedule(ctx, sc):
    b = ctx.beat; return dict(img=(b * 1.45, b * 2), vid=b * 3, snd=(b * 4 - 0.3, b * 4))
def media_frame(ctx, sc, lt, rect):
    """Elements + overlay alphas for the media_morph timeline at local time lt inside rect."""
    m = media_schedule(ctx, sc); b = ctx.beat; kick = math.exp(-((lt % b) / b) * 5) if lt >= m['snd'][1] else 0.0
    tv = lt - m['vid']
    if lt < m['img'][1]:
        A = media_state(ctx, 'text', rect, grow=prog(lt, 0.0, 0.7)); B = media_state(ctx, 'image', rect)
        return morph(A, B, prog(lt, *m['img'])), prog(lt, *m['img']), 0.0
    if lt < m['snd'][0]: return media_state(ctx, 'video' if tv > 0 else 'image', rect, t=tv), 1.0, eoc(prog(lt, m['vid'] - 0.05, m['vid'] + 0.15))
    u = prog(lt, *m['snd']); A = media_state(ctx, 'video', rect, t=tv); B = media_state(ctx, 'sound', rect, t=lt, kick=kick)
    return (morph(A, B, u) if u < 1 else B), 1 - u, 1 - u

def draw_media(ctx, c, sc, lt, rect, alpha=1.0):
    fx, fy, fw, fh = rect; U = ctx.U; _, fg, card, light = th(ctx); cc = ctx.pal['a1']; m = media_schedule(ctx, sc)
    els, sky_a, ov = media_frame(ctx, sc, lt, rect)
    c.save(); c.clipPath(frame_path(ctx, fx, fy, fw, fh), doAntiAlias=True)
    sky(ctx, c, rect, sky_a * alpha); draw_elems(c, els, alpha, round_r=3 * U * fw / frame_rect(ctx)[2])
    if ov > 0:  # video overlay: play badge + timeline
        tv = lt - m['vid']; s_ = fw / frame_rect(ctx)[2]; pop = eob(prog(tv, 0, 0.3), 2); fade = 1 - prog(tv, 0.3, 0.6)
        if fade > 0 and pop > 0:
            R = 46 * U * s_ * pop * (1 + 0.25 * prog(tv, 0.3, 0.6)); px, py = fx + fw / 2, fy + fh / 2
            disc, mark = ((255, 255, 255), fg) if light else (ctx.pal['dark'], fg)
            c.drawCircle(px, py, R, P(disc, (0.92 if light else 0.45) * fade * ov * alpha)); c.drawCircle(px, py, R, P(fg, fade * ov * alpha, 2.5 * U * s_))
            tri = skia.Path(); tri.moveTo(px - R * 0.28, py - R * 0.4); tri.lineTo(px + R * 0.45, py); tri.lineTo(px - R * 0.28, py + R * 0.4); tri.close(); c.drawPath(tri, P(mark, fade * ov * alpha))
        y = fy + fh * 0.92; xa, xb = fx + fw * 0.05, fx + fw * 0.95; ph = lerp(xa, xb, clamp(0.12 + max(0, tv) * 0.35))
        c.drawLine(xa, y, xb, y, P((255, 255, 255) if light else fg, (0.8 if light else 0.3) * ov * alpha, 2.5 * U * s_)); c.drawLine(xa, y, ph, y, P(cc, ov * alpha, 2.5 * U * s_)); c.drawCircle(ph, y, 6 * U * s_, P(cc, ov * alpha))
    c.restore()

# media_morph: inside the settled frame ONE set of shapes becomes text -> image -> video -> sound (point-wise polygon morph,
# staggered), a rolling label below names each medium on its beat
def s_media_morph(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']
    fx, fy, fw, fh = frame_rect(ctx); m = media_schedule(ctx, sc)
    draw_frame_chrome(ctx, c, fx, fy, fw, fh, fg, bg, grid=1 - 0.6 * prog(lt, 0, 0.5), sc=sc)
    draw_media(ctx, c, sc, lt, (fx, fy, fw, fh))
    labels = sc.get('labels', ['文字', '图像', '视频', '声音']); ch = [0.0, m['img'][1], m['vid'], m['snd'][1]][:len(labels)]
    k = max(i for i, t in enumerate(ch) if lt >= t - 0.22); T = Text(ctx, 54 * U); y = fy + fh + 100 * U; hcap = T.cap(labels[0])
    c.save(); c.clipRect(skia.Rect(fx - 10 * U, y - hcap * 1.4, fx + fw * 0.6, y + hcap * 0.4))
    for i in (k - 1, k):
        if i < 0: continue
        u = eoe(prog(lt, ch[i] - 0.22, ch[i])) if i == k else 1.0; up = eoe(prog(lt, ch[k] - 0.22, ch[k])) if i == k - 1 else 0.0
        a0 = eoc(prog(lt, 0, 0.35)) if i == 0 else 1.0
        dy = (1 - u) * hcap * 1.5 - up * hcap * 1.5; T.draw(c, labels[i], fx, y + dy, P(fg, a0 * (1 - up)), 'l')
    c.restore()
    Tm = mono(ctx, 20); Tm.draw(c, f'{k + 1:02d} / {len(labels):02d}', fx + fw, y - hcap * 0.3, P(fg, 0.55 * eoc(prog(lt, 0, 0.35))), 'r', track=3 * U)
    bar = fw * 0.22; xb = fx + fw - bar; yb = y + 14 * U
    c.drawLine(xb, yb, xb + bar, yb, P(fg, 0.2, 2 * U, cap=False)); c.drawLine(xb, yb, xb + bar * clamp(lt / D), yb, P(ctx.pal['a1'], 1, 2 * U, cap=False))

# ---------------- 4. canvas_zoom ----------------
TILES = [(-1.22, -0.5, 0.56, 0.56, 'image'), (1.18, -0.42, 0.78, 0.44, 'text'), (-1.14, 0.62, 0.76, 0.43, 'video'),
         (1.02, 0.66, 0.42, 0.62, 'image'), (0.05, -0.98, 0.5, 0.28, 'sound')]
def _tile_rect(F, t, s, pan):
    fx, fy, fw, fh = F; Fc = (fx + fw / 2, fy + fh / 2); dx, dy, w, h, _ = t
    cx = Fc[0] + (dx * fw) * s + pan[0]; cy = Fc[1] + (dy * fw) * s + pan[1]; return (cx - w * fw * s / 2, cy - h * fw * s / 2, w * fw * s, h * fw * s)
def _cursor(ctx, c, x, y, name, cl, a, txt=(255, 255, 255)):
    U = ctx.U; _, fg, card, light = th(ctx)
    p = skia.Path(); p.moveTo(x, y); p.lineTo(x, y + 30 * U); p.lineTo(x + 8 * U, y + 23 * U); p.lineTo(x + 14 * U, y + 35 * U)
    p.lineTo(x + 19 * U, y + 33 * U); p.lineTo(x + 13 * U, y + 21 * U); p.lineTo(x + 23 * U, y + 21 * U); p.close()
    body, edge = (fg, (255, 255, 255)) if light else (fg, th(ctx)[0])
    c.drawPath(p, P(body, a)); c.drawPath(p, P(edge, a, 1.8 * U))
    T = Text(ctx, 20 * U); w = T.width(name); r = skia.Rect(x + 20 * U, y + 36 * U, x + 20 * U + w + 24 * U, y + 66 * U)
    c.drawRRect(skia.RRect.MakeRectXY(r, 15 * U, 15 * U), P(cl, a)); T.draw_mid(c, name, r.centerX(), r.centerY(), P(txt, a))

# --- logo layers (icon background, mascot, wordmark) for the brand lockup ---
LOGO_ICON = 530.0; LOGO_W = 3121.0; LOGO_H = 529.0; WM_X, WM_Y = 690.0, 132.0; SQ0, SQ1 = 25.3, 503.7; SQ_R = 36.0
def _raw(ctx, key):
    path = (ctx.spec.get('assets') or {}).get(key)
    if not path: return None
    return cache(ctx, ('raw', key), lambda: skia.Image.MakeFromEncoded(skia.Data.MakeFromFileName(path)))
def logo_geom(ctx, sc):
    """Placement of the layered logo: scale k (screen px per logo px) and its top-left; plus the icon-square rect."""
    U = ctx.U; Lw = ctx.W * sc.get('logo_width', 0.56) if not ctx.portrait else ctx.W * 0.86; k = Lw / LOGO_W
    x0 = ctx.cx - Lw / 2; y0 = ctx.cy - 60 * U - LOGO_H * k / 2
    sq = (x0 + SQ0 * k, y0 + SQ0 * k, (SQ1 - SQ0) * k, (SQ1 - SQ0) * k); return k, x0, y0, sq
def has_logo(ctx, sc): return sc is not None and all(_raw(ctx, sc.get(n)) is not None for n in ('logo_icon', 'logo_mascot', 'logo_wordmark') if sc.get(n)) and sc.get('logo_icon')
def _img(c, img, x, y, k, a=1.0):
    if img is None: return
    p = skia.Paint(AntiAlias=True); p.setAlphaf(clamp(a)); c.drawImageRect(img, skia.Rect(x, y, x + img.width() * k, y + img.height() * k), skia.SamplingOptions(skia.FilterMode.kLinear, skia.MipmapMode.kLinear), p)

# canvas_zoom: the camera pulls back from the frame: it becomes one tile on a shared canvas; sibling works load in,
# connectors draw between them with data dots, two cursors (you + AI) work side by side; then every tile collapses into
# the next scene's anchor — the brand icon square (layered logo) or the caret where the wordmark starts
def s_canvas_zoom(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = ctx.pal['a1']
    F = frame_rect(ctx); fx, fy, fw, fh = F; prev = ctx.scenes[sc['i'] - 1] if sc['i'] > 0 else None
    mlt = (prev['dur'] if prev and prev['type'] == 'media_morph' else 3.0) + lt  # continue the media timeline
    z = eioe(prog(lt, 0.0, 1.15)); s = lerp(1.0, sc.get('zoom', 0.34), z); pan = (lerp(0, -0.03 * ctx.W, z), lerp(0, 0.02 * ctx.H, z))
    nx = _next(ctx, sc); logo = has_logo(ctx, nx)
    if logo:
        lk, lx0, ly0, sq = logo_geom(ctx, nx); kr = skia.Rect(sq[0], sq[1], sq[0] + sq[2], sq[1] + sq[3]); kcol = ctx.pal['a2']
    else:
        gT, gtitle, gtw, gcap, gx0, gbase = lockup_geom(ctx, nx or {}); kr = caret_box(ctx, gx0 - 16 * U, gbase, gcap); kcol = cc
    tc0 = D - 0.75; col_ = lambda k: eie(prog(lt, tc0 + 0.05 * k, tc0 + 0.05 * k + 0.5))
    ga = eoc(prog(lt, 0.3, 0.9)) * (1 - prog(lt, tc0, D - 0.2))
    if ga > 0:  # screen dot grid of the canvas
        sp = 40 * U; pt = P(fg, (0.14 if light else 0.1) * ga); yy = (ctx.H % sp) / 2
        while yy < ctx.H:
            xx = (ctx.W % sp) / 2
            while xx < ctx.W: c.drawCircle(xx, yy, 1.3 * U, pt); xx += sp
            yy += sp
    main = (F[0] + F[2] / 2 * (1 - s) + pan[0], F[1] + F[3] / 2 * (1 - s) + pan[1], F[2] * s, F[3] * s)
    rects = [main] + [_tile_rect(F, t, s, pan) for t in TILES]
    def collapse(k, r):
        u = col_(k)
        if u <= 0: return r, 1.0, 0.0
        x, y, w, h = r; w2, h2 = lerp(w, kr.width(), u), lerp(h, kr.height(), u)
        cx_, cy_ = lerp(x + w / 2, kr.centerX(), u), lerp(y + h / 2, kr.centerY(), u); return (cx_ - w2 / 2, cy_ - h2 / 2, w2, h2), 1 - u, u
    cent = lambda r: (r[0] + r[2] / 2, r[1] + r[3] / 2)
    ca = eoc(prog(lt, 1.0, 1.5)) * (1 - prog(lt, tc0 - 0.1, tc0 + 0.2))
    if ca > 0:  # node connectors with travelling data dots
        for k, r in enumerate(rects[1:]):
            (ax, ay), (bx, by) = cent(main), cent(r); pth = skia.Path(); pth.moveTo(ax, ay); mx = (ax + bx) / 2; pth.cubicTo(mx, ay, mx, by, bx, by)
            pm = skia.PathMeasure(pth, False); L = pm.getLength(); seg = skia.Path(); pm.getSegment(0, L * eioe(prog(lt, 0.95 + 0.06 * k, 1.45 + 0.06 * k)), seg, True)
            c.drawPath(seg, P(fg, 0.35 * ca, 1.6 * U))
            if lt > 1.2:
                pt_ = pm.getPosTan(L * (((lt - 1.2) * 0.9 + k * 0.23) % 1.0))
                if pt_: c.drawCircle(pt_[0].x(), pt_[0].y(), 4.5 * U, P(cc, ca))
    for k, r in enumerate(rects):
        (x, y, w, h), keep, u = collapse(k, r)
        ap = 1.0 if k == 0 else eoc(prog(lt, 0.3 + 0.08 * k, 0.75 + 0.08 * k))
        if ap <= 0: continue
        if k > 0 and u == 0:
            g = lerp(0.86, 1.0, ap); x, y, w, h = x + w * (1 - g) / 2, y + h * (1 - g) / 2, w * g, h * g
        fp = frame_path(ctx, x, y, w, h)
        c.drawPath(fp, P(lc(card, kcol, u) if u > 0 else card, ap))
        if keep > 0.02:
            if k == 0: draw_media(ctx, c, prev or sc, mlt, (x, y, w, h), alpha=keep)
            else:
                kind = TILES[k - 1][4]; c.save(); c.clipPath(fp, doAntiAlias=True)
                if kind in ('image', 'video'): sky(ctx, c, (x, y, w, h), keep * ap)
                kk = math.exp(-((lt % ctx.beat) / ctx.beat) * 5)
                draw_elems(c, media_state(ctx, kind, (x, y, w, h), t=1.5 + 0.3 * k, kick=kk), keep * ap)
                if kind == 'video':
                    yv = y + h * 0.9; c.drawLine(x + w * 0.06, yv, x + w * 0.94, yv, P((255, 255, 255) if light else fg, 0.6 * keep * ap, 2 * U)); c.drawLine(x + w * 0.06, yv, x + w * (0.3 + 0.1 * lt), yv, P(cc, keep * ap, 2 * U))
                c.restore()
        c.drawPath(fp, P(fg, ((0.9 if k == 0 else 0.4) * keep + (0.9 if logo else 0) * u) * ap, (2.4 * U * lerp(1, 0.7, z)) if k == 0 else 1.5 * U))
    hk = 1 - prog(lt, 0, 0.4)
    if hk > 0:  # main frame handles + labels fade as we pull back
        mx_, my_, mw_, mh_ = main; draw_handles(ctx, c, mx_, my_, mw_, mh_, fg, bg, hk)
        Tm = mono(ctx, 19); Tm.draw(c, (prev or sc).get('meta_left', 'CANVAS · 16:9'), mx_, my_ - 26 * U, P(fg, 0.55 * hk), 'l', track=2 * U)
        Tm.draw(c, (prev or sc).get('meta_right', '1920 × 1080'), mx_ + mw_, my_ - 26 * U, P(fg, 0.55 * hk), 'r', track=2 * U)
    cur_a = eoc(prog(lt, 1.0, 1.3)) * (1 - prog(lt, tc0 - 0.15, tc0 + 0.1))
    if cur_a > 0:  # selection on one sibling + two cursors co-editing
        r1 = rects[1]; sel = eoe(prog(lt, 1.45, 1.75)); pad = 8 * U
        if sel > 0:
            q = skia.Rect(r1[0] - pad, r1[1] - pad, r1[0] - pad + (r1[2] + 2 * pad) * sel, r1[1] - pad + (r1[3] + 2 * pad) * sel)
            c.drawRect(q, P(cc, cur_a, 2 * U))
            if sel >= 1:
                for (hx, hy) in ((q.left(), q.top()), (q.right(), q.top()), (q.left(), q.bottom()), (q.right(), q.bottom())): c.drawCircle(hx, hy, 5 * U, P(card, cur_a)); c.drawCircle(hx, hy, 5 * U, P(cc, cur_a, 2 * U))
        (ax, ay) = cent(r1); u = eioe(prog(lt, 0.95, 1.5)); _cursor(ctx, c, lerp(ctx.W * 0.06, ax + r1[2] * 0.3, u), lerp(ctx.H * 1.05, ay + r1[3] * 0.32, u), sc.get('you', '你'), cc, cur_a)
        r2 = rects[2]; (bx, by) = cent(r2); u2 = eioe(prog(lt, 1.05, 1.65)); drag = eioe(prog(lt, 1.7, 2.1)) * 18 * U
        _cursor(ctx, c, lerp(ctx.W * 1.02, bx - r2[2] * 0.28, u2) + drag, lerp(-ctx.H * 0.05, by + r2[3] * 0.2, u2) + drag * 0.4, sc.get('ai', 'AI'), fg if light else ctx.pal['a3'], cur_a, txt=(255, 255, 255) if light else ctx.pal['dark'])
    if sc.get('caption'):
        a = eoc(prog(lt, 1.1, 1.5)) * (1 - prog(lt, tc0, tc0 + 0.25))
        if a > 0: Text(ctx, 44 * U).draw(c, sc['caption'], ctx.cx, ctx.H - 90 * U + (1 - a) * 20 * U, P(fg, a))
    if logo:  # the collapsed tiles settle into the brand icon (its handles snap on)
        ia = eoc(prog(lt, D - 0.3, D - 0.08))
        if ia > 0: _img(c, _raw(ctx, nx['logo_icon']), lx0, ly0, lk, ia)
    else:
        ka = eob(prog(lt, tc0 + 0.25, D - 0.12), 2)
        if ka > 0:
            h = kr.height() * ka; c.drawRect(skia.Rect(kr.left(), kr.centerY() - h / 2, kr.right(), kr.centerY() + h / 2), P(cc))

# ---------------- 5. caret_lockup ----------------
# caret_lockup: with a layered logo — the icon is already there, the mascot peeks up into it, then a caret sweeps right and
# reveals the wordmark; without one — the caret writes the title letter by letter. Tagline + meta settle; caret blinks.
def s_caret_lockup(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc)
    if has_logo(ctx, sc):
        k, x0, y0, sq = logo_geom(ctx, sc); _img(c, _raw(ctx, sc['logo_icon']), x0, y0, k)
        pk = eob(prog(lt, 0.12, 0.62), 1.6); clip = skia.Path(); s0 = SQ0 * k
        clip.addRect(skia.Rect(x0 - LOGO_ICON * k, y0 - LOGO_ICON * k, x0 + SQ1 * k + 2 * k, y0 + SQ1 * k + 1 * k))
        c.save(); c.clipPath(clip, doAntiAlias=True); _img(c, _raw(ctx, sc['logo_mascot']), x0, y0 + (1 - pk) * LOGO_ICON * k * 0.75, k); c.restore()
        if sc.get('logo_border'): _img(c, _raw(ctx, sc['logo_border']), x0, y0, k)  # icon outline stays on top of the mascot
        wx, wy = x0 + WM_X * k, y0 + WM_Y * k; wimg = _raw(ctx, sc['logo_wordmark']); ww = wimg.width() * k; wh = wimg.height() * k
        sw = eioe(prog(lt, 0.55, 1.3)); kx = lerp(wx - 18 * U, wx + ww + 18 * U, sw)
        c.save(); c.clipRect(skia.Rect(wx - 4 * U, wy - 40 * U, kx - 6 * U, wy + wh + 40 * U)); _img(c, wimg, wx, wy + (1 - eoc(prog(lt, 0.55, 1.1))) * 10 * U, k); c.restore()
        blink = 1.0 if lt < 1.3 else (1.0 if int((lt - 1.3) / (ctx.beat / 2)) % 2 == 0 else 0.0)
        ka = eoc(prog(lt, 0.5, 0.6)) * (1 - prog(lt, D - 0.9, D - 0.6))
        if blink and ka > 0: c.drawRect(skia.Rect(kx - 3.5 * U, wy - 4 * U, kx + 3.5 * U, wy + wh + 4 * U), P(cc, ka))
        ty = y0 + LOGO_H * k + 110 * U; tx = ctx.cx; align = 'c'
    else:
        T, title, tw, cap, x0, base = lockup_geom(ctx, sc)
        sw = eioe(prog(lt, 0.3, 1.05)); kx = lerp(x0 - 16 * U, x0 + tw + 16 * U, sw); split = sc.get('accent_from')
        x = x0; c.save(); c.clipRect(skia.Rect(0, 0, kx - 4 * U, ctx.H))
        for i, ch in enumerate(title):
            aw = T.font_for(ch).measureText(ch); d = clamp((kx - x) / (150 * U)); rise = (1 - eoc(d)) * 34 * U
            if d > 0: c.drawString(ch, x, base + rise, T.font_for(ch), P(cc if (split is not None and i >= split) else fg, eoc(d)))
            x += aw
        c.restore()
        blink = 1.0 if lt < 1.05 else (1.0 if int((lt - 1.05) / (ctx.beat / 2)) % 2 == 0 else 0.0)
        if blink: c.drawRect(caret_box(ctx, kx, base, cap), P(cc))
        lw = eioe(prog(lt, 1.05, 1.5)); yl = base + 56 * U; c.drawLine(x0, yl, x0 + tw * lw, yl, P(fg, 0.3, 2 * U, cap=False))
        ty = yl + 76 * U; tx = x0; align = 'l'
    if sc.get('tagline'):
        Tt = Text(ctx, sc.get('tagline_size', 46) * U); s = sc['tagline']; t0 = min(1.3, D * 0.42); st = max(0.006, min(0.035, (D - 0.75 - t0 - 0.35) / max(1, len(s)))); xx = tx - (Tt.width(s) / 2 if align == 'c' else 0)
        for i, ch in enumerate(s):
            a = eoc(prog(lt, t0 + st * i, t0 + 0.35 + st * i)); c.drawString(ch, xx, ty + (1 - a) * 18 * U, Tt.font_for(ch), P(fg, 0.92 * a)); xx += Tt.font_for(ch).measureText(ch)
    if sc.get('meta'):
        a = eoc(prog(lt, min(1.7, D - 0.7), min(2.05, D - 0.4))); mono(ctx, 21).draw(c, sc['meta'], tx if align == 'c' else tx, ty + 62 * U, P(fg, 0.5 * a), align, track=3 * U)

SCENES6 = {'prompt_type': s_prompt_type, 'frame_trace': s_frame_trace, 'media_morph': s_media_morph, 'canvas_zoom': s_canvas_zoom, 'caret_lockup': s_caret_lockup}
REQUIRED6 = {'prompt_type': [], 'frame_trace': [], 'media_morph': [], 'canvas_zoom': [], 'caret_lockup': []}
STILL6 = {'prompt_type': 0.5, 'frame_trace': 0.75, 'media_morph': 0.45, 'canvas_zoom': 0.62, 'caret_lockup': 0.92}
def events6(sc):
    D = sc['dur']; t = sc['type']; b = D / sc['beats']
    if t == 'prompt_type':
        s = sc.get('text', '我有一个想法'); return [0.42 + len(s) / sc.get('cps', 7.5) + 0.2]
    return {'frame_trace': [1.1], 'media_morph': [b * 2, b * 3, b * 4], 'canvas_zoom': [1.0, D - 0.15], 'caret_lockup': [0.62, 1.3] if sc.get('logo_icon') else [0.3, 1.05]}.get(t)
mgfx_chapters.SELF_EXIT.update(SCENES6)
