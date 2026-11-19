"""Type-led modules for creative / AI platform brands (R6, original). Big type carries every beat; frames, handles and
cursors only support it. type_prompt, pixel_word, media_type, select_words (+ caret_lockup from mgfx_ideaform to close)."""
import math, random
import numpy as np, skia
from mgfx_core import *
from mgfx_recipes import carrier, mono, cache
import mgfx_chapters
from mgfx_ideaform import theme, has_logo, logo_geom, _raw, _img, _next

def _blink(lt, per=0.27): return int(lt / per) % 2 == 0

# ---------------- type_prompt ----------------
# type_prompt: a giant caret blinks, the idea is typed in display-size type; the lead-in words lift away while the key word
# glides to centre and swells, the caret flashes on the beat, then the key word punches through the camera
def s_type_prompt(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc)
    s = sc.get('text', '我有一个想法'); key = sc.get('key', 2); T = Text(ctx, fit_size(ctx, s, sc.get('size', 190) * U, ctx.W * 0.8)); cap = T.cap(s)
    tw = T.width(s); x0 = ctx.cx - tw / 2; base = ctx.cy + cap / 2
    t0 = 0.22; cps = sc.get('cps', 7.5); t1 = t0 + len(s) / cps; tk = t1 + 0.3; z1 = D - 0.28
    n = int(clamp((lt - t0) * cps, 0, len(s)))
    head, tail = s[:len(s) - key], s[len(s) - key:]; hw = T.width(head); kw = T.width(tail)
    g = eioe(prog(lt, tk, tk + 0.6)); big = lerp(1.0, sc.get('swell', 2.0), g) * (1 + 7 * eie(prog(lt, z1, D)))
    kx0 = x0 + hw; kcx = lerp(kx0 + kw / 2, ctx.cx, g); kcy = lerp(base - cap / 2, ctx.cy, g)
    if sc.get('kicker'):
        a = eoc(prog(lt, 0.05, 0.4)) * (1 - prog(lt, tk, tk + 0.3)); mono(ctx, 22).draw(c, sc['kicker'], x0, base - cap - 60 * U, P(fg, 0.55 * a), 'l', track=5 * U)
    x = x0
    for i, ch in enumerate(head[:n]):  # lead-in characters lift away one by one
        aw = T.font_for(ch).measureText(ch); up = eie(prog(lt, tk + 0.04 * i, tk + 0.04 * i + 0.4))
        if up < 1: c.drawString(ch, x, base - up * 120 * U, T.font_for(ch), P(fg, 1 - up))
        x += aw
    if n > len(head):
        sub = tail[:n - len(head)]
        c.save(); c.translate(kcx, kcy); c.scale(big, big); c.translate(-(kx0 + kw / 2), -(base - cap / 2))
        T.draw(c, sub, kx0, base, P(fg), 'l'); c.restore()
    # caret: giant brand bar after the last typed glyph; after the swell it sits after the key word and flashes on the beat
    if lt < z1:
        if g <= 0: kx = x0 + T.width(s[:n]) + 10 * U; h = cap * 1.25; cy_ = base - cap / 2; vis = (t0 <= lt <= t1 + 0.1) or _blink(lt)
        else:
            kx = kcx + kw / 2 * big + 18 * U * big; h = cap * 1.25 * big; cy_ = kcy; vis = True
        if vis:
            fl = math.exp(-max(0.0, lt - (tk + 0.6)) * 6) if lt > tk + 0.6 else 0
            w = 10 * U * (big if g > 0 else 1); c.drawRect(skia.Rect(kx, cy_ - h / 2, kx + w, cy_ + h / 2), P(cc))
            if fl > 0: c.drawRect(skia.Rect(kx, cy_ - h / 2, kx + w, cy_ + h / 2), P(cc, 0.5 * fl, None, blur=14 * U))
    if lt > z1: c.drawColor(col(bg, eie(prog(lt, D - 0.1, D))))

# ---------------- pixel_word ----------------
def word_cells(ctx, s, size, cols_per_char=12):
    """Rasterise a word into a coarse grid: list of cell centres (relative to the word's left baseline) and the cell size."""
    def mk():
        T = Text(ctx, size); w = T.width(s); cap = T.cap(s); cs = size / cols_per_char; H = int(cap * 1.5) + 4; Wd = int(w) + 4
        surf = skia.Surface(Wd, H); cv = surf.getCanvas(); cv.clear(skia.ColorTRANSPARENT); T.draw(cv, s, 2, cap * 1.2, P((255, 255, 255)), 'l')
        a = surf.makeImageSnapshot().toarray()[..., 3].astype(np.float32) / 255; out = []
        ny, nx = int(H / cs), int(Wd / cs)
        for j in range(ny):
            for i in range(nx):
                blk = a[int(j * cs):int((j + 1) * cs), int(i * cs):int((i + 1) * cs)]
                if blk.size and blk.mean() > 0.42: out.append(((i + 0.5) * cs - 2, (j + 0.5) * cs - cap * 1.2))
        out.sort(key=lambda p: (p[0], p[1])); return out, cs, w, cap
    return cache(ctx, ('cells', s, round(size, 1), cols_per_char), mk)

# pixel_word: the first word is built from square pixels (pop in), the pixels fly apart and re-assemble into the second word,
# then resolve into crisp type; a lead line rolls ("from" -> "to") and a brand selection box snaps round the result
def s_pixel_word(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc); b = ctx.beat
    A, B = sc.get('words', ['像素', '语义']); size = sc.get('size', 340) * U
    ca, cs, wa, cap = word_cells(ctx, A, size); cb, _, wb, _ = word_cells(ctx, B, size)
    base = ctx.cy + cap / 2 + 30 * U; xa, xb = ctx.cx - wa / 2, ctx.cx - wb / 2
    m0, m1 = b * 2, b * 2 + 0.75; r0 = m1 + 0.05; r1 = r0 + 0.3; rng = random.Random(3)
    cols = [fg, cc, ctx.pal['a2'], fg, fg]; n = max(len(ca), len(cb)); u_res = eoc(prog(lt, r0, r1))
    for i in range(n):
        pa = ca[i * len(ca) // n]; pb = cb[i * len(cb) // n]; ang = rng.uniform(0, 2 * PI); dist = rng.uniform(40, 180) * U; clr = cols[rng.randrange(len(cols))]
        pop = eob(prog(lt, rng.uniform(0, 0.45), rng.uniform(0.25, 0.7)), 2.2)
        st = (pa[0] / max(wa, 1)) * 0.3; e = eioc(prog(lt, m0 + st, m1 - 0.3 + st))
        x = lerp(xa + pa[0], xb + pb[0], e) + math.cos(ang) * dist * math.sin(PI * e); y = base + lerp(pa[1], pb[1], e) + math.sin(ang) * dist * math.sin(PI * e)
        kick = math.exp(-((lt % b) / b) * 7) if lt < m0 else 0
        sz = cs * 0.84 * pop * (1 + 0.15 * kick * (i % 3 == 0)) * (1 - u_res)
        cl = lc(fg, clr, math.sin(PI * e)) if e > 0 else (fg if i % 7 else cc)
        if sz > 0.5: c.drawRect(skia.Rect(x - sz / 2, y - sz / 2, x + sz / 2, y + sz / 2), P(cl))
    if u_res > 0: Text(ctx, size).draw(c, B, xb, base, P(fg, u_res), 'l')
    # lead line rolls from "from" to "to"
    leads = sc.get('leads', ['从操作', '到操作']); Tl = Text(ctx, 58 * U); ly = base - cap - 70 * U; hl = Tl.cap(leads[0])
    c.save(); c.clipRect(skia.Rect(0, ly - hl * 1.4, ctx.W, ly + hl * 0.4)); sw = eoe(prog(lt, m0 + 0.2, m0 + 0.5)); la = eoc(prog(lt, 0.15, 0.5))
    Tl.draw(c, leads[0], lerp(xa, xb, sw), ly - sw * hl * 1.6, P(fg, 0.7 * la * (1 - sw)), 'l'); Tl.draw(c, leads[1], xb, ly + (1 - sw) * hl * 1.6, P(cc, sw), 'l'); c.restore()
    if sc.get('tail'):
        a = eoc(prog(lt, r1 + 0.3, r1 + 0.6)); mono(ctx, 24).draw(c, sc['tail'], xb + wb, base + 80 * U, P(fg, 0.55 * a), 'r', track=4 * U)
    # brand selection box snaps round the resolved word on the next beat
    sb = eoe(prog(lt, r1, r1 + 0.25))
    if sb > 0:
        pad = lerp(90, 26, sb) * U; q = skia.Rect(xb - pad, base - cap - pad, xb + wb + pad, base + pad * 0.6 + 18 * U)
        c.drawRect(q, P(cc, sb, 2.5 * U))
        for (hx, hy) in ((q.left(), q.top()), (q.right(), q.top()), (q.left(), q.bottom()), (q.right(), q.bottom())):
            c.drawCircle(hx, hy, 7 * U, P(card, sb)); c.drawCircle(hx, hy, 7 * U, P(cc, sb, 2.5 * U))

# ---------------- media_type ----------------
def _scene_fill(ctx, c, x, y, w, h, t, moving):
    """A tiny landscape used as the fill inside letters (image / video)."""
    pal = ctx.pal; _, fg, card, light = theme_cached(ctx); p = skia.Paint(AntiAlias=True)
    p.setShader(skia.GradientShader.MakeLinear([skia.Point(x, y), skia.Point(x, y + h)], [col(pal['a2']), col(lc(pal['a2'], (255, 255, 255), 0.7))])); c.drawRect(skia.Rect(x, y, x + w, y + h), p)
    d = (t * 0.12 if moving else 0.0); X = lambda u: x + u * w; Y = lambda v: y + v * h
    c.drawCircle(X(0.72), Y(0.3 - (0.06 * clamp(t) if moving else 0)), h * 0.16, P(pal['a1']))
    for (pts, cl) in (([(-0.1 - d * 0.4, 0.95), (0.3 - d * 0.4, 0.38), (0.75 - d * 0.4, 0.95)], pal['a3']), ([(0.35 - d, 1.0), (0.7 - d, 0.5), (1.2 - d, 1.0)], fg)):
        pa = skia.Path(); pa.moveTo(X(pts[0][0]), Y(pts[0][1]))
        for q in pts[1:]: pa.lineTo(X(q[0]), Y(q[1]))
        pa.close(); c.drawPath(pa, P(cl))
    c.drawRect(skia.Rect(X(0.08 + d * 0.5), Y(0.18), X(0.3 + d * 0.5), Y(0.24)), P((255, 255, 255), 0.9))
def theme_cached(ctx): return getattr(ctx, '_th')

# media_type: ONE big word slot whose letters become each medium in turn — typed text, letters filled with an image,
# the image moving inside the letters with a playhead scrubbing across, letters bouncing as a waveform; rolls on the beat
def s_media_type(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc); b = ctx.beat
    words = sc.get('words', ['文本', '图像', '视频', '音乐']); tags = sc.get('tags', ['TEXT', 'IMAGE', 'VIDEO', 'MUSIC'])
    size = sc.get('size', 330) * U; T = Text(ctx, size); slot = D / len(words); k = min(len(words) - 1, int(lt / slot))
    def draw_word(i, dy, a):
        s = words[i]; w = T.width(s); cap = T.cap(s); x = ctx.cx - w / 2; base = ctx.cy + cap / 2 + dy; u = lt - i * slot
        kind = i % 4
        if kind == 0:  # typed text with caret
            n = int(clamp(u * 9 + 0.5, 0, len(s))) if i == k else len(s); T.draw(c, s[:n], x, base, P(fg, a), 'l')
            if i == k and _blink(lt, b / 2): kx = x + T.width(s[:n]) + 14 * U; c.drawRect(skia.Rect(kx, base - cap * 1.1, kx + 10 * U, base + cap * 0.15), P(cc, a))
        elif kind in (1, 2):  # letters as a window onto an image (moving for video)
            r = skia.Rect(x - 10 * U, base - cap * 1.15, x + w + 10 * U, base + cap * 0.2)
            c.saveLayer(r); T.draw(c, s, x, base, P(fg), 'l'); pp = skia.Paint(); pp.setBlendMode(skia.BlendMode.kSrcIn)
            c.saveLayer(r, pp); _scene_fill(ctx, c, r.left(), r.top(), r.width(), r.height(), u, kind == 2); c.restore(); c.restore()
            if a < 1: c.drawRect(r, P(bg, 1 - a))
            if kind == 2 and i == k:  # playhead scrubbing across the word + timeline
                ph = lerp(r.left(), r.right(), clamp(u / slot)); c.drawLine(ph, r.top() - 10 * U, ph, r.bottom() + 10 * U, P(cc, a, 4 * U))
                ty = base + 70 * U; c.drawLine(x, ty, x + w, ty, P(fg, 0.2 * a, 3 * U)); c.drawLine(x, ty, ph, ty, P(cc, a, 3 * U)); c.drawCircle(ph, ty, 8 * U, P(cc, a))
                mono(ctx, 22).draw(c, '00:%02d:%02d' % (int(u * 7) % 60, int(u * 60 * 7) % 60), x + w, ty + 44 * U, P(fg, 0.55 * a), 'r', track=3 * U)
        else:  # letters bounce as a waveform on the beat
            kick = math.exp(-((lt % b) / b) * 6); xx = x
            for j, ch in enumerate(s):
                aw = T.font_for(ch).measureText(ch); amp = (0.5 + 0.5 * math.sin(j * 2.1 + lt * 9)) * kick
                c.save(); c.translate(xx + aw / 2, base); c.scale(1, 1 + 0.28 * amp); c.translate(-(xx + aw / 2), -base)
                c.drawString(ch, xx, base - 30 * U * amp, T.font_for(ch), P(fg if j % 2 == 0 else cc, a)); c.restore(); xx += aw
            nb = 36; bw = (w + 40 * U) / nb; by = base + 80 * U
            for q in range(nb):
                hh = (8 + 46 * abs(math.sin(q * 0.7 + lt * 6)) * (0.35 + kick)) * U
                c.drawRect(skia.Rect(x - 20 * U + q * bw + bw * 0.2, by - hh / 2, x - 20 * U + (q + 1) * bw - bw * 0.2, by + hh / 2), P(cc if q % 5 == 0 else fg, 0.85 * a))
        return x, base, cap
    cap0 = T.cap(words[0]); top = ctx.cy - cap0 / 2 - 40 * U; bot = ctx.cy + cap0 / 2 + 180 * U
    roll = eoe(prog(lt, (k + 1) * slot - 0.2, (k + 1) * slot)) if k + 1 < len(words) else 0.0
    c.save(); c.clipRect(skia.Rect(0, top - cap0 * 0.4, ctx.W, bot)); x, base, cap = draw_word(k, -roll * cap0 * 1.7, 1 - roll)
    if roll > 0: draw_word(k + 1, (1 - roll) * cap0 * 1.7, roll)
    c.restore()
    kk = k + (1 if roll > 0.5 else 0); Tm = mono(ctx, 22)
    Tm.draw(c, f'{kk + 1:02d} / {len(words):02d}  ·  {tags[kk]}', ctx.cx - T.width(words[kk]) / 2, top - 40 * U, P(fg, 0.55 * eoc(prog(lt, 0, 0.3))), 'l', track=4 * U)
    if sc.get('label'):
        Tm.draw(c, sc['label'], ctx.cx + T.width(words[kk]) / 2, top - 40 * U, P(cc, eoc(prog(lt, 0, 0.3))), 'r', track=4 * U)

# ---------------- select_words ----------------
# select_words: a two-line statement slams in word by word on the beats; a brand selection box (dot handles) jumps to each
# new word, the last word is grabbed and stretched by a cursor; then the type drops away and the box becomes the logo icon
def s_select_words(ctx, c, sc, lt):
    bg, fg, card, light = theme(ctx, sc); c.drawColor(col(bg)); U = ctx.U; D = sc['dur']; cc = carrier(ctx, sc); b = ctx.beat
    lines = sc.get('lines', [['把创意，'], ['真正', '做出来']]); size = sc.get('size', 200) * U; T = Text(ctx, size)
    cap = T.cap('创'); lh = cap * 1.42; tot_w = max(T.width(''.join(l)) for l in lines); x0 = ctx.cx - tot_w / 2; y0 = ctx.cy - lh * (len(lines) - 1) / 2 + cap / 2
    items = []
    for li, ws in enumerate(lines):
        x = x0
        for w in ws: items.append((w, x, y0 + li * lh, T.width(w))); x += T.width(w)
    hits = [b * i * sc.get('beats_per_word', 1) for i in range(len(items))]; last = len(items) - 1
    out0 = D - 0.75; drop = lambda i: eie(prog(lt, out0 + 0.04 * i, out0 + 0.04 * i + 0.35))
    for i, (w, x, y, ww) in enumerate(items):
        u = eoe(prog(lt, hits[i], hits[i] + 0.3))
        if u <= 0: continue
        sx = 1.0
        if i == last: sx = 1 + 0.14 * math.sin(PI * clamp(prog(lt, hits[i] + 0.45, hits[i] + 1.0)))
        dd = drop(i); c.save(); c.clipRect(skia.Rect(x - 20 * U, y - cap * 1.3, x + ww * 1.2 + 20 * U, y + cap * 0.35 + dd * 200 * U))
        c.translate(x, y); c.scale(sx, 1); c.translate(-x, -y)
        T.draw(c, w, x, y + (1 - u) * cap * 1.3 + dd * 160 * U, P(cc if i == last else fg, 1 - dd), 'l'); c.restore()
    # selection box follows the newest word
    cur = max([i for i in range(len(items)) if lt >= hits[i]] or [0]); prev = max(0, cur - 1); mv = eoe(prog(lt, hits[cur], hits[cur] + 0.22)) if cur else 1.0
    def box(i):
        w, x, y, ww = items[i]; sx = 1 + 0.14 * math.sin(PI * clamp(prog(lt, hits[i] + 0.45, hits[i] + 1.0))) if i == last else 1
        return (x - 18 * U, y - cap * 1.12, x + ww * sx + 18 * U, y + cap * 0.22)
    A_, B_ = box(prev), box(cur); q = [lerp(A_[j], B_[j], mv) for j in range(4)]
    nx = _next(ctx, sc); morph_u = eioe(prog(lt, out0 + 0.15, D - 0.1))
    if has_logo(ctx, nx) and morph_u > 0:
        lk, lx0, ly0, sq = logo_geom(ctx, nx); tq = (sq[0], sq[1], sq[0] + sq[2], sq[1] + sq[3]); q = [lerp(q[j], tq[j], morph_u) for j in range(4)]
        c.drawRect(skia.Rect(*q), P(lc(card, ctx.pal['a2'], morph_u), morph_u))
    ba = eoc(prog(lt, 0.05, 0.3))
    r = skia.Rect(*q); c.drawRect(r, P(lc(cc, fg, morph_u), ba, 2.5 * U))
    for (hx, hy) in ((r.left(), r.top()), (r.right(), r.top()), (r.left(), r.bottom()), (r.right(), r.bottom())):
        c.drawCircle(hx, hy, 7 * U, P(card, ba * (1 - morph_u))); c.drawCircle(hx, hy, 7 * U, P(cc, ba * (1 - morph_u), 2.5 * U))
    # cursor grabbing the bottom-right handle of the last word
    ca = eoc(prog(lt, hits[last] + 0.25, hits[last] + 0.45)) * (1 - prog(lt, out0, out0 + 0.2))
    if ca > 0:
        hx, hy = r.right() + 4 * U, r.bottom() + 4 * U; pth = skia.Path(); pth.moveTo(hx, hy); pth.lineTo(hx, hy + 30 * U); pth.lineTo(hx + 8 * U, hy + 23 * U)
        pth.lineTo(hx + 14 * U, hy + 35 * U); pth.lineTo(hx + 19 * U, hy + 33 * U); pth.lineTo(hx + 13 * U, hy + 21 * U); pth.lineTo(hx + 23 * U, hy + 21 * U); pth.close()
        c.drawPath(pth, P(fg, ca)); c.drawPath(pth, P((255, 255, 255), ca, 1.8 * U))
    if has_logo(ctx, nx):
        ia = eoc(prog(lt, D - 0.22, D - 0.04))
        if ia > 0: lk, lx0, ly0, sq = logo_geom(ctx, nx); _img(c, _raw(ctx, nx['logo_icon']), lx0, ly0, lk, ia)

SCENES7 = {'type_prompt': s_type_prompt, 'pixel_word': s_pixel_word, 'media_type': s_media_type, 'select_words': s_select_words}
REQUIRED7 = {'type_prompt': [], 'pixel_word': [], 'media_type': [], 'select_words': []}
STILL7 = {'type_prompt': 0.62, 'pixel_word': 0.85, 'media_type': 0.3, 'select_words': 0.62}
def events7(sc):
    D = sc['dur']; t = sc['type']; b = D / sc['beats']
    if t == 'type_prompt':
        s = sc.get('text', '我有一个想法'); t1 = 0.22 + len(s) / sc.get('cps', 7.5); return [t1 + 0.3, t1 + 0.9]
    if t == 'media_type':
        n = len(sc.get('words', [1, 2, 3, 4])); return [D / n * i for i in range(1, n)]
    if t == 'select_words':
        n = sum(len(l) for l in sc.get('lines', [[1], [2, 3]])); return [b * i for i in range(n)]
    return {'pixel_word': [0.05, b * 2, b * 2 + 0.85]}.get(t)
mgfx_chapters.SELF_EXIT.update(SCENES7)
