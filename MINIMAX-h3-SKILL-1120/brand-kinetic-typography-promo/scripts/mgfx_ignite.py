"""Motion modules from the ignition reel (reference 4): comet_burst, beat_word, color_matrix, fluid_blob,
sphere_burst, ui_cards, arc_lockup; plus the `scan_glitch` transition and the `reel` HUD (in mgfx.py)."""
import math, random
import numpy as np, skia
from mgfx_core import *
from mgfx_recipes import carrier, next_bg, mono, typed, quint, cache
from mgfx_chapters import count_fmt, parse_num

def cycle_cols(ctx): return [ctx.pal[r] for r in ('a1', 'a2', 'a3')] + [ctx.pal['light']]

# comet_burst: comets streak into the centre, ignite, concentric multi-colour arcs spin out in alternating directions and settle; caption pops
def s_comet_burst(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    tb = min(0.7, D * 0.38); rng = random.Random(7); L = math.hypot(ctx.W, ctx.H) * 0.6
    for k in range(14):
        ang = rng.uniform(-PI * 0.9, -PI * 0.1) if k else -PI / 2; d0 = rng.uniform(0.0, 0.25); p = prog(lt, d0 * tb, tb)
        if 0 < p < 1:
            r = L * (1 - eie(p) ** 0.7); hx, hy = cx + r * math.cos(ang), cy + r * math.sin(ang); tl = (90 + 200 * p) * U * (1 if k else 1.6)
            tx, ty = hx + tl * math.cos(ang), hy + tl * math.sin(ang)
            p_ = skia.Paint(AntiAlias=True, StrokeWidth=(5 if k == 0 else 2.5) * U, Style=skia.Paint.kStroke_Style, StrokeCap=skia.Paint.kRound_Cap)
            p_.setShader(skia.GradientShader.MakeLinear([skia.Point(hx, hy), skia.Point(tx, ty)], [col(fg), col(fg, 0)])); c.drawLine(hx, hy, tx, ty, p_)
            c.drawCircle(hx, hy, (6 if k == 0 else 3) * U, P(fg))
    u = lt - tb
    if u >= 0:
        fl = math.exp(-u * 10); c.drawCircle(cx, cy, 30 * U + u * 900 * U, P(fg, 0.5 * fl, 3 * U)); c.drawColor(col(fg, 0.25 * fl))
        cols = cycle_cols(ctx)
        for k in range(6):
            R = (70 + 46 * k) * U * eob(clamp(u / 0.35 - k * 0.06), 1.8); dirn = 1 if k % 2 else -1
            rot = dirn * (720 - 120 * k) * (1 - math.exp(-u * 4)) / 2 + k * 40; sweep = 100 + 35 * ((k * 3) % 5)
            if R > 1: c.drawArc(skia.Rect(cx - R, cy - R, cx + R, cy + R), rot, sweep, False, P(cols[k % 4], 1, (10 - k) * U))
        br = 1 + 0.12 * math.sin(lt * 2 * PI / ctx.beat); c.drawCircle(cx, cy, 16 * U * br * eob(clamp(u / 0.2), 2), P(fg))
    if sc.get('caption'):
        a = eob(prog(lt, tb + 0.45, tb + 0.8), 1.8); s = ctx.up(sc['caption'])
        if a > 0: mono(ctx, 26).draw(c, s, cx, cy + 400 * U * (0.8 if ctx.portrait else 0.75) - (1 - a) * -30 * U, P(fg, clamp(a)), track=8 * U)

# beat_word: one heavy word per colour field; pops in, squashes on every beat, letters jitter into place, an underline vibrates; ends scaling out
def s_beat_word(ctx, c, sc, lt):
    U = ctx.U; D = sc['dur']; words = [ctx.up(w) for w in sc['words']]; n = len(words); seg = D / n; k = min(int(lt / seg), n - 1); u = lt - k * seg
    bgs = sc.get('bgs') or ['a1', 'a2', 'a3']; s2 = dict(sc, bg=bgs[k % len(bgs)]); bg, fg, acc, acc2 = ctx.colors(s2); c.drawColor(col(bg))
    s = words[k]; T = Text(ctx, fit_size(ctx, s, sc.get('size', 300) * U, ctx.W * 0.82)); w = T.width(s); cap = T.cap(s)
    pop = eob(prog(u, 0, 0.28), 2.4); b = ctx.beat; ph = (u % b); sq = 0.16 * math.exp(-ph * 14) if u > 0.1 else 0
    out = eie(prog(lt, D - 0.16, D)) if k == n - 1 else 0
    sx = (1 + sq * 0.8) * (pop * (1 - out) + out * 2.5 * 0) if out < 1 else 0; sy = (1 - sq) * pop * (1 - out)
    sx = (1 + sq * 0.8) * pop * (1 - out)
    c.save(); c.translate(ctx.cx, ctx.cy + cap / 2); c.scale(max(sx, 0.001), max(sy, 0.001)); c.translate(-ctx.cx, -(ctx.cy + cap / 2))
    rng = random.Random(k * 31); x = ctx.cx - w / 2; j = math.exp(-u * 9)
    for ch, a_ in zip(s, T.adv(s)):
        c.save(); c.translate(x + a_ / 2, ctx.cy); c.rotate(rng.uniform(-14, 14) * j); c.translate(0, rng.uniform(-40, 40) * U * j)
        c.drawString(ch, -a_ / 2, cap / 2, T.font_for(ch), P(fg)); c.restore(); x += a_
    c.restore()
    lc_ = ctx.pal[sc.get('line', 'a2')] if bg != ctx.pal[sc.get('line', 'a2')] else fg
    if k == 0 or sc.get('line_all'):
        y = ctx.cy + cap / 2 + 40 * U; half = w / 2 * (0.6 + 0.4 * eoe(prog(u, 0.1, 0.4))) * (1 + 0.15 * math.exp(-ph * 10)) * (1 - out)
        pth = skia.Path(); amp = 18 * U * math.exp(-ph * 8)
        for i in range(41):
            xx = ctx.cx - half + 2 * half * i / 40; yy = y + amp * math.sin(i * 0.9 - u * 30) * math.sin(PI * i / 40)
            pth.moveTo(xx, yy) if i == 0 else pth.lineTo(xx, yy)
        c.drawPath(pth, P(lc_, 1, 9 * U))
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), ctx.cx, ctx.H - 100 * U, P(fg, 0.75))
    if lt > D - 0.03: c.drawColor(col(next_bg(ctx, sc)))

# color_matrix: dot core / squircle rim matrix; a scale ripple fires from the centre on every beat, colours jump ring by ring
def s_color_matrix(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy; b = ctx.beat
    nx, ny = (15, 9) if not ctx.portrait else (9, 15); sp = min(ctx.W * 0.86 / nx, ctx.H * 0.8 / ny); cols = cycle_cols(ctx)
    kb = int(lt / b); rmax = math.hypot(nx / 2, ny / 2); grow = eoc(prog(lt, 0, 0.3))
    for j in range(ny):
        for i in range(nx):
            dx, dy = i - (nx - 1) / 2, j - (ny - 1) / 2; r = math.hypot(dx, dy); rn = r / rmax; pulse = 0
            for kk in range(max(0, kb - 1), kb + 1):
                tt = lt - kk * b; front = tt * 14
                pulse = max(pulse, math.exp(-((r - front) / 1.2) ** 2) * math.exp(-tt * 1.5) if tt >= 0 else 0)
            s = sp * (0.2 + 0.18 * pulse) * grow; ring = int(r / 1.5)
            colr = cols[(kb + ring) % 4] if sc.get('cycle', True) else fg
            x, y = cx + dx * sp, cy + dy * sp
            if rn < 0.33: c.drawCircle(x, y, s * 0.8, P(colr))
            else:
                c.save(); c.translate(x, y); c.rotate(35 * pulse); rr = skia.Rect(-s, -s, s, s); c.drawRRect(skia.RRect.MakeRectXY(rr, s * 0.42, s * 0.42), P(colr, 0.35 + 0.65 * min(1, pulse + 0.3))); c.restore()
    if sc.get('word'):
        sw = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, sw, 100 * U, ctx.W * 0.4)); a = eoc(prog(lt, 0.15, 0.4))
        T.draw(c, sw, 80 * U, ctx.H - 80 * U, P(fg, a), 'l')
    if lt > D - 0.03: c.drawColor(col(next_bg(ctx, sc)))

# fluid_blob: gradient metaball blob morphs and drifts; a heavy word sits on top and inverts where the blob passes
def blob_path(cx, cy, R, lt, seed=0):
    p = skia.Path(); n = 90
    for i in range(n + 1):
        a = 2 * PI * i / n
        r = R * (1 + 0.16 * math.sin(3 * a + lt * 1.7 + seed) + 0.1 * math.sin(5 * a - lt * 2.3 + seed * 2) + 0.06 * math.sin(2 * a + lt * 3.1))
        x, y = cx + r * math.cos(a) * 1.25, cy + r * math.sin(a)
        p.moveTo(x, y) if i == 0 else p.lineTo(x, y)
    p.close(); return p
def s_fluid_blob(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    R = min(ctx.W, ctx.H) * 0.3 * eob(prog(lt, 0, 0.45), 1.6) * (1 + 0.05 * math.sin(lt * 4))
    if R < 1: return
    p1 = blob_path(cx + math.sin(lt * 1.3) * 60 * U, cy + math.cos(lt) * 30 * U, R, lt)
    p2 = blob_path(cx + math.cos(lt * 1.1) * R * 1.1, cy - math.sin(lt * 1.4) * R * 0.5, R * 0.35, lt, 2)
    blob = skia.Op(p1, p2, skia.PathOp.kUnion_PathOp) or p1
    cols = [ctx.pal[r] for r in sc.get('colors', ['a3', 'a1', 'a2'])]; a = lt * 0.9
    g = skia.Paint(AntiAlias=True); g.setShader(skia.GradientShader.MakeLinear([skia.Point(cx - R * 1.4 * math.cos(a), cy - R * 1.4 * math.sin(a)), skia.Point(cx + R * 1.4 * math.cos(a), cy + R * 1.4 * math.sin(a))], [col(q) for q in cols + [cols[0]]]))
    c.drawPath(blob, P((0, 0, 0), 0.18, blur=40 * U)); c.drawPath(blob, g)
    c.save(); c.clipPath(blob, doAntiAlias=True)
    h = skia.Paint(AntiAlias=True); h.setShader(skia.GradientShader.MakeRadial(skia.Point(cx - R * 0.35, cy - R * 0.45), R * 0.9, [col((255, 255, 255), 0.55), col((255, 255, 255), 0)])); c.drawPaint(h); c.restore()
    s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, sc.get('size', 260) * U, ctx.W * 0.84)); e = quint(prog(lt, 0.2, 0.7))
    out_c = fg; in_c = ctx.pal['light'] if contrast(ctx.pal['light'], cols[0]) > contrast(ctx.pal['dark'], cols[0]) else ctx.pal['dark']
    yy = cy + T.cap(s) / 2; c.save(); c.clipRect(skia.Rect(0, yy - T.cap(s) * 1.2, ctx.W, yy + 6 * U))
    T.draw(c, s, cx, yy + (1 - e) * T.cap(s) * 1.3, P(out_c)); c.clipPath(blob, doAntiAlias=True); T.draw(c, s, cx, yy + (1 - e) * T.cap(s) * 1.3, P(in_c)); c.restore()
    if sc.get('label'): mono(ctx, 22).draw(c, ctx.up(sc['label']), cx, ctx.H - 90 * U, P(fg, 0.7 * e))
    if lt > D - 0.03: c.drawColor(col(next_bg(ctx, sc)))

# sphere_burst: gradient point sphere with live HUD leader-line annotation; implodes, then bursts into a drifting field on the beat
def s_sphere_burst(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cx, cy = ctx.cx, ctx.cy
    N = int(sc.get('count', 1400))
    def mk():
        i = np.arange(N) + 0.5; phi = np.arccos(1 - 2 * i / N); th = PI * (1 + 5 ** 0.5) * i; rng = np.random.default_rng(2)
        return np.stack([np.cos(th) * np.sin(phi), np.cos(phi), np.sin(th) * np.sin(phi)], 1), rng.uniform(1.5, 4.5, N), rng.normal(0, 1, (N, 3))
    pts, vel, drift = cache(ctx, ('sb', N), mk)
    tb = sc.get('burst_at', 0.5) * D; imp = eie(prog(lt, tb - 0.3, tb)) * 0.25; u = max(0, lt - tb)
    rad = (1 - imp) + vel * (1 - math.exp(-u * 4)) * (1 if u > 0 else 0)
    P3 = pts * rad[:, None] + drift * 0.08 * u
    ry = lt * 0.8; x = P3[:, 0] * math.cos(ry) + P3[:, 2] * math.sin(ry); z = -P3[:, 0] * math.sin(ry) + P3[:, 2] * math.cos(ry); y = P3[:, 1]
    tl = 0.3; y, z = y * math.cos(tl) - z * math.sin(tl), y * math.sin(tl) + z * math.cos(tl)
    f = ctx.H * 0.3 * 4; d = 4 + z; g = eob(prog(lt, 0, 0.4), 1.5)
    stops = [ctx.pal['a1'], ctx.pal['a2'], ctx.pal['a3']]
    for i in np.argsort(-d):
        if d[i] < 0.3: continue
        q = (1 - pts[i, 1]) / 2; colr = lc(stops[0], stops[1], q * 2) if q < 0.5 else lc(stops[1], stops[2], q * 2 - 1)
        c.drawCircle(cx + f * x[i] / d[i] * g, cy - f * y[i] / d[i] * g, 3.2 * U * 4 / d[i], P(colr, clamp(1.3 - (d[i] - 4) * 0.35) * (1 - 0.6 * prog(lt, tb + 0.6, D))))
    hc = ctx.pal[sc.get('hud_color', 'a2')]; Tm = mono(ctx, 18); vi = 221 % N
    if lt < tb + 0.15:
        vx, vy = cx + f * x[vi] / d[vi] * g, cy - f * y[vi] / d[vi] * g; a = eoc(prog(lt, 0.3, 0.5))
        bx, by = cx + 360 * U, cy - 260 * U; c.drawCircle(vx, vy, 8 * U, P(hc, a, 2 * U))
        c.drawLine(vx, vy, bx - 40 * U, by, P(hc, a, 1.5 * U)); c.drawLine(bx - 40 * U, by, bx, by, P(hc, a, 1.5 * U))
        Tm.draw(c, f'VERTEX B{vi}', bx + 10 * U, by - 6 * U, P(hc, a), 'l')
        Tm.draw(c, f'X{P3[vi,0]:+.2f} Y{P3[vi,1]:+.2f} Z{P3[vi,2]:+.2f}', bx + 10 * U, by + 20 * U, P(hc, 0.8 * a), 'l')
    Tm.draw(c, f'{"FIELD" if lt > tb else "SPHERE"} // N={N}', 80 * U, ctx.H - 90 * U, P(hc, 0.9), 'l')
    if sc.get('word'):
        s = ctx.up(sc['word']); T = Text(ctx, fit_size(ctx, s, 100 * U, ctx.W * 0.4)); T.draw(c, s, 80 * U, 90 * U + T.cap(s), P(fg, eoc(prog(lt, 0.1, 0.4))), 'l')
    if lt > D - 0.03: c.drawColor(col(next_bg(ctx, sc)))

# ui_cards: bento grid of five coloured UI cards (growth line + counter, progress ring, toggle + pill, weekly bars, gauge) cascade in on the beat
def s_ui_cards(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H; g = 22 * U
    if not ctx.portrait:
        x0, y0, w, h = W * 0.06, H * 0.12, W * 0.88, H * 0.76; cw = (w - 2 * g) / 3; ch = (h - g) / 2
        rects = [(x0, y0, cw, h), (x0 + cw + g, y0, cw, ch), (x0 + cw + g, y0 + ch + g, cw, ch), (x0 + 2 * (cw + g), y0, cw, ch), (x0 + 2 * (cw + g), y0 + ch + g, cw, ch)]
    else:
        x0, y0, w, h = W * 0.06, H * 0.1, W * 0.88, H * 0.8; cw = (w - g) / 2; ch = (h - 2 * g) / 3
        rects = [(x0, y0, w, ch), (x0, y0 + ch + g, cw, ch), (x0 + cw + g, y0 + ch + g, cw, ch), (x0, y0 + 2 * (ch + g), cw, ch), (x0 + cw + g, y0 + 2 * (ch + g), cw, ch)]
    order = [0, 3, 1, 2, 4]; gauge_c = ctx.pal[sc['gauge_color']] if sc.get('gauge_color') else lc(ctx.pal['a3'], ctx.pal['a1'], 0.35)
    fills = [ctx.pal['dark'] if bg != ctx.pal['dark'] else lc(ctx.pal['dark'], ctx.pal['light'], 0.1), ctx.pal['a1'], ctx.pal['a3'], ctx.pal['a2'], gauge_c]
    Tm = mono(ctx, 18)
    for idx, (x, y, cw_, ch_) in enumerate(rects):
        k = order.index(idx); t0 = 0.05 + 0.08 * k; e = eob(prog(lt, t0, t0 + 0.35), 1.8)
        if e <= 0: continue
        c.save(); c.translate(x + cw_ / 2, y + ch_ / 2 + (1 - clamp(e)) * 60 * U); c.scale(e, e); c.translate(-cw_ / 2, -ch_ / 2)
        fc = fills[idx]; tc = max((ctx.pal['dark'], ctx.pal['light']), key=lambda q: contrast(q, fc)); r = skia.Rect(0, 0, cw_, ch_)
        c.drawRRect(skia.RRect.MakeRectXY(r, 26 * U, 26 * U), P(fc)); u = prog(lt, t0 + 0.2, t0 + 1.0); pad = 30 * U
        if idx == 0:
            gr = sc.get('growth', {}); Tm.draw(c, ctx.up(gr.get('label', 'GROWTH')), pad, pad + 18 * U, P(tc, 0.7), 'l')
            v = count_fmt(gr.get('to', '+248%'), eoe(u)) if not gr.get('from') else _between(gr['from'], gr['to'], eoe(u))
            Text(ctx, 90 * U).draw(c, v, pad, pad + 130 * U, P(ctx.pal['a2'] if contrast(ctx.pal['a2'], fc) > 2 else tc), 'l')
            pts = [(pad + (cw_ - 2 * pad) * i / 9, ch_ - pad - (ch_ * 0.4) * (0.15 + 0.85 * (i / 9) ** 1.6 + 0.08 * math.sin(i * 2.1))) for i in range(10)]
            pth = skia.Path(); pth.moveTo(*pts[0]); [pth.lineTo(*q) for q in pts[1:]]
            L = skia.PathMeasure(pth, False).getLength(); tp = eioc(u); pe = P(ctx.pal['a1'], 1, 5 * U); pe.setPathEffect(skia.DashPathEffect.Make([L * tp + 0.1, L + 1], 0))
            c.drawPath(pth, P(ctx.pal['a1'], 0.4, 12 * U, blur=8 * U) if tp > 0 else P(fc)); c.drawPath(pth, pe)
            ex = pts[min(9, int(tp * 9))]; c.drawCircle(*ex, 10 * U, P(ctx.pal['a1'], 0.5, blur=8 * U)); c.drawCircle(*ex, 6 * U, P(ctx.pal['a1']))
        elif idx == 1:
            rg = sc.get('ring', {}); Tm.draw(c, ctx.up(rg.get('label', 'STATUS')), pad, pad + 18 * U, P(tc, 0.8), 'l')
            a_, b_ = parse_num(rg.get('from', '30%')), parse_num(rg.get('to', '87%')); val = lerp(a_[1], b_[1], eoe(u)); R = min(cw_, ch_) * 0.28; ccx, ccy = cw_ / 2, ch_ * 0.58
            c.drawCircle(ccx, ccy, R, P(tc, 0.25, 12 * U)); c.drawArc(skia.Rect(ccx - R, ccy - R, ccx + R, ccy + R), -90, 3.6 * val, False, P(tc, 1, 12 * U))
            Text(ctx, 40 * U).draw_mid(c, f'{val:.0f}%', ccx, ccy, P(tc))
        elif idx == 2:
            Tm.draw(c, ctx.up(sc.get('controls_label', 'CONTROLS')), pad, pad + 18 * U, P(tc, 0.8), 'l')
            tw_, th_ = 110 * U, 56 * U; ty = ch_ * 0.42; on = eioe(prog(u, 0.2, 0.5)); tr = skia.Rect(pad, ty, pad + tw_, ty + th_)
            c.drawRRect(skia.RRect.MakeRectXY(tr, th_ / 2, th_ / 2), P(lc(lc(fc, tc, 0.3), ctx.pal['a2'], on))); c.drawCircle(pad + th_ / 2 + (tw_ - th_) * on, ty + th_ / 2, th_ / 2 - 6 * U, P(ctx.pal['light']))
            pl = ctx.up(sc.get('cta', 'PLAY ▶')); Tp = mono(ctx, 22); pw = Tp.width(pl) + 50 * U; py_ = ch_ - pad - 56 * U; pa = eob(prog(u, 0.4, 0.7), 2)
            if pa > 0:
                pr = skia.Rect(pad, py_, pad + pw * pa, py_ + 56 * U); c.drawRRect(skia.RRect.MakeRectXY(pr, 28 * U, 28 * U), P(ctx.pal['a2']))
                Tp.draw_mid(c, pl, pad + pw * pa / 2, py_ + 28 * U, P(ctx.pal['dark'], clamp(pa)))
        elif idx == 3:
            Tm.draw(c, ctx.up(sc.get('bars_label', 'WEEKLY')), pad, pad + 18 * U, P(tc, 0.8), 'l')
            bars = sc.get('bars') or [0.4, 0.65, 0.5, 0.9, 0.7, 0.55, 0.8]; nb = len(bars); bw = (cw_ - 2 * pad) / nb; base = ch_ - pad
            for i, v in enumerate(bars):
                q = eob(prog(u, 0.04 * i, 0.04 * i + 0.4), 2); hh = v * (ch_ - 3 * pad - 20 * U) * q
                c.drawRRect(skia.RRect.MakeRectXY(skia.Rect(pad + i * bw + bw * 0.2, base - hh, pad + (i + 0.8) * bw, base), 6 * U, 6 * U), P(gauge_c if i == nb // 2 else tc))
        else:
            gg = sc.get('gauge', {}); Tm.draw(c, ctx.up(gg.get('label', 'LEVEL')), pad, pad + 18 * U, P(tc, 0.8), 'l')
            R = min(cw_, ch_) * 0.34; ccx, ccy = cw_ / 2, ch_ * 0.7
            for i in range(25):
                a = math.radians(180 + 180 * i / 24); c.drawCircle(ccx + R * math.cos(a), ccy + R * math.sin(a), 4 * U, P(tc, 0.9 if i / 24 <= gg.get('value', 0.7) * eoe(u) else 0.3))
            na = math.radians(180 + 180 * gg.get('value', 0.7) * eoe(u)); c.drawLine(ccx, ccy, ccx + R * 0.8 * math.cos(na), ccy + R * 0.8 * math.sin(na), P(tc, 1, 5 * U)); c.drawCircle(ccx, ccy, 10 * U, P(tc))
        c.restore()
    if lt > D - 0.03: c.drawColor(col(next_bg(ctx, sc)))
def _between(a, b, u):
    pa, pb = parse_num(a), parse_num(b)
    if not pa or not pb: return b
    v = lerp(pa[1], pb[1], u); return pb[0] + f'{v:.{pb[2]}f}' + pb[3]

# arc_lockup: centre dot fires colour rays, two arcs orbit and lock into an icon, wordmark unmasks beside it, two-tone underline, typed lines + blinking block cursor
def s_arc_lockup(ctx, c, sc, lt):
    bg, fg, acc, acc2 = ctx.colors(sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; W, H = ctx.W, ctx.H
    title = ctx.up(sc['title']); T = Text(ctx, fit_size(ctx, title, sc.get('size', 200) * U, W * 0.55)); tw = T.width(title); cap = T.cap(title)
    ir = cap * 0.62; gap = 50 * U; tot = ir * 2 + gap + tw; ix = W / 2 - tot / 2 + ir; iy = H * 0.46; tx = ix + ir + gap
    cols = cycle_cols(ctx); cc = carrier(ctx, sc); rng = random.Random(3)
    rp = prog(lt, 0.0, 0.45)
    if 0 < rp < 1:
        for k in range(28):
            a = 2 * PI * k / 28 + rng.uniform(-0.1, 0.1); r0 = ir * 0.3 + eoe(rp) * W * 0.25; r1 = r0 + 120 * U * (1 - rp)
            c.drawLine(ix + r0 * math.cos(a), iy + r0 * math.sin(a), ix + r1 * math.cos(a), iy + r1 * math.sin(a), P(cols[k % 4], 1 - rp, 3 * U))
    lk = eoe(prog(lt, 0.15, 0.8))
    for k, (cl, sw, r_) in enumerate(((ctx.pal['a2'], 250, 1.0), (ctx.pal['a1'], 200, 0.72))):
        R = ir * r_ * (1.8 - 0.8 * lk); rot = (1 - lk) * (540 if k else -540) + (-45 if k else 120)
        c.drawArc(skia.Rect(ix - R, iy - R, ix + R, iy + R), rot, sw * clamp(lk * 1.2), False, P(cl, 1, ir * 0.13))
    c.drawCircle(ix, iy, ir * 0.24 * eob(prog(lt, 0.0, 0.25), 2.2), P(cc if sc.get('dot_color') is None else ctx.pal[sc['dot_color']]))
    m = eoe(prog(lt, 0.5, 0.95)); base = iy + cap / 2
    c.save(); c.clipRect(skia.Rect(tx, base - cap * 1.3, tx + tw * m + 4 * U, base + cap * 0.3)); T.draw(c, title, tx - (1 - m) * 80 * U, base, P(fg), 'l'); c.restore()
    ul = eioe(prog(lt, 0.8, 1.1)) * tw; uy = base + 34 * U
    c.drawLine(tx, uy, tx + ul * 0.62, uy, P(ctx.pal['a1'], 1, 5 * U, cap=False)); c.drawLine(tx + tw * 0.62, uy, tx + max(tw * 0.62, ul), uy, P(fg, 1, 5 * U, cap=False))
    Tm = mono(ctx, 24); y = uy + 60 * U; tlast = 1.0
    for i, s in enumerate([ctx.up(q) for q in sc.get('lines', [])][:3]):
        t0 = 1.0 + i * 0.35; typed(ctx, c, s, tx, y, Tm, P(fg, 0.85 if i == 0 else 0.6), lt, t0, cps=40); tlast = t0 + len(s) / 40
        if lt >= t0: last = (s[:int(clamp((lt - t0) * 40, 0, len(s)))], y)
        y += 38 * U
    if sc.get('lines') and lt > 1.0 and int(lt / 0.25) % 2 == 0:
        s_, yy = last; cx_ = tx + Tm.width(s_) + 8 * U; c.drawRect(skia.Rect(cx_, yy - 20 * U, cx_ + 14 * U, yy + 2 * U), P(ctx.pal['a2']))

SCENES5 = {'comet_burst': s_comet_burst, 'beat_word': s_beat_word, 'color_matrix': s_color_matrix, 'fluid_blob': s_fluid_blob,
           'sphere_burst': s_sphere_burst, 'ui_cards': s_ui_cards, 'arc_lockup': s_arc_lockup}
REQUIRED5 = {'comet_burst': [], 'beat_word': ['words'], 'color_matrix': [], 'fluid_blob': ['word'], 'sphere_burst': [], 'ui_cards': [], 'arc_lockup': ['title']}
STILL5 = {'comet_burst': 0.75, 'beat_word': 0.3, 'color_matrix': 0.55, 'fluid_blob': 0.6, 'sphere_burst': 0.4, 'ui_cards': 0.8, 'arc_lockup': 0.97}
def events5(sc):
    D = sc['dur']; t = sc['type']; b = D / sc['beats']
    return {'comet_burst': [min(0.7, D * 0.38)], 'beat_word': [b * k for k in range(1, int(sc['beats']))], 'color_matrix': [b * k for k in range(1, int(sc['beats']))],
            'fluid_blob': [0.3], 'sphere_burst': [sc.get('burst_at', 0.5) * D], 'ui_cards': [0.05 + 0.08 * k for k in range(5)], 'arc_lockup': [0.0, 0.8]}.get(t)
