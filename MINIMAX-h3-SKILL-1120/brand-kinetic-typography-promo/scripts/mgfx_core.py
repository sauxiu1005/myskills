"""Core: easing, color, palettes, styles, fonts, text drawing, render context."""
import math, os, re, colorsys
import numpy as np, skia

PI = math.pi
def clamp(x, a=0.0, b=1.0): return a if x < a else b if x > b else x
def prog(t, a, b): return clamp((t - a) / (b - a)) if b > a else (1.0 if t >= b else 0.0)
def lerp(a, b, u): return a + (b - a) * u
def eoe(x): return 1.0 if x >= 1 else (0.0 if x <= 0 else 1 - 2 ** (-10 * x))
def eie(x): return 0.0 if x <= 0 else (1.0 if x >= 1 else 2 ** (10 * x - 10))
def eioe(x):
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    return 2 ** (20 * x - 10) / 2 if x < 0.5 else (2 - 2 ** (-20 * x + 10)) / 2
def eoc(x): x = clamp(x); return 1 - (1 - x) ** 3
def eioc(x): x = clamp(x); return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2
def eob(x, s=1.70158):
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    c3 = s + 1; return 1 + c3 * (x - 1) ** 3 + s * (x - 1) ** 2
def spring(x, f=2.2, d=6.0):
    if x <= 0: return 0.0
    if x >= 1.6: return 1.0
    return 1 - math.exp(-d * x) * math.cos(f * 2 * PI * x)

# ---------------- color ----------------
def hex2rgb(h):
    h = h.strip().lstrip('#')
    if len(h) == 3: h = ''.join(ch * 2 for ch in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def rgb2hex(c): return '#%02X%02X%02X' % tuple(int(v) for v in c)
def lc(c1, c2, u): return tuple(int(lerp(c1[i], c2[i], clamp(u))) for i in range(3))
def lum(c):
    def ch(v):
        v /= 255; return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(v) for v in c); return 0.2126 * r + 0.7152 * g + 0.0722 * b
def contrast(a, b):
    la, lb = lum(a), lum(b); return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
def hls(c): return colorsys.rgb_to_hls(*(v / 255 for v in c))
def from_hls(h, l, s): return tuple(int(round(v * 255)) for v in colorsys.hls_to_rgb(h % 1.0, clamp(l), clamp(s)))
def col(c, a=1.0): return skia.Color(int(c[0]), int(c[1]), int(c[2]), int(clamp(a) * 255))

PALETTES = {
    'ember':   dict(label='炽焰撞色', dark='#0B0B14', light='#F4EFE6', a1='#FF4D3D', a2='#C6FF3D', a3='#3D5BFF'),
    'bauhaus': dict(label='包豪斯三原色', dark='#151515', light='#F1EDE4', a1='#E2412B', a2='#F5C400', a3='#2347C6'),
    'cyber':   dict(label='赛博霓虹', dark='#070B14', light='#E6F7FF', a1='#00E5FF', a2='#FF2BD6', a3='#7CFF4F'),
    'candy':   dict(label='糖果波普', dark='#2B1E4A', light='#FFF6EC', a1='#FF6FA8', a2='#FFD23F', a3='#3EC7B5'),
    'mono':    dict(label='黑白单强调', dark='#101010', light='#F5F5F2', a1='#FF5A1F', a2='#D9D9D4', a3='#2A2A2A'),
    'earth':   dict(label='自然大地', dark='#0F1F17', light='#F3EFE3', a1='#3FBF7F', a2='#E9C46A', a3='#E76F51'),
}
ROLES = ['dark', 'light', 'a1', 'a2', 'a3']

def derive_from_brand(colors):
    """Build a full 5-role palette from 1-3 brand hex colors."""
    b = [hex2rgb(c) for c in colors]
    h, l, s = hls(b[0])
    a1 = b[0]
    a2 = b[1] if len(b) > 1 else from_hls(h + 0.42, clamp(l, 0.5, 0.65), max(s, 0.75))
    a3 = b[2] if len(b) > 2 else from_hls(h - 0.36, clamp(l, 0.45, 0.6), max(s, 0.7))
    dark = from_hls(h, 0.07, min(0.45, s * 0.6))
    light = from_hls(h + 0.08, 0.94, min(0.3, s * 0.4))
    return dict(dark=dark, light=light, a1=a1, a2=a2, a3=a3)

def resolve_palette(p):
    p = p or {}
    if 'brand' in p:
        pal = derive_from_brand(p['brand'] if isinstance(p['brand'], list) else [p['brand']])
    else:
        base = PALETTES[p.get('preset', 'ember')]
        pal = {k: hex2rgb(base[k]) for k in ROLES}
    for k in ROLES:  # explicit overrides win
        if k in p: pal[k] = hex2rgb(p[k])
    return pal

# ---------------- styles ----------------
STYLES = {
    'punch':  dict(label='冲击快剪', ease='back', over=2.2, amp=1.4, per=0.03, din=0.42, shake=28, zoom=0.02, rgb=14,
                   grain=9, vig=0.5, hud='frame', trans='wipe', upper=True, corner=0, scan=0, glow=0, decode=False,
                   cuts=['rotate', 'squash', 'stretch', 'overshoot', 'blur', 'glitch', 'scale', 'loop'], flash=True),
    'swiss':  dict(label='极简瑞士', ease='expo', over=0, amp=1.1, per=0.025, din=0.55, shake=0, zoom=0, rgb=0,
                   grain=3, vig=0.12, hud='grid', trans='slide', upper=True, corner=0, scan=0, glow=0, decode=False,
                   cuts=['slide', 'mask', 'track', 'scale'], flash=False),
    'hud':    dict(label='科技HUD', ease='expo', over=0.8, amp=1.0, per=0.02, din=0.32, shake=10, zoom=0.01, rgb=8,
                   grain=6, vig=0.55, hud='tech', trans='glitch', upper=True, corner=0, scan=0.12, glow=1, decode=True,
                   cuts=['glitch', 'decode', 'scale', 'blur'], flash=True),
    'bouncy': dict(label='活泼弹性', ease='spring', over=3.0, amp=1.2, per=0.04, din=0.7, shake=0, zoom=0.035, rgb=0,
                   grain=0, vig=0.1, hud='dots', trans='circle', upper=False, corner=1, scan=0, glow=0, decode=False,
                   cuts=['overshoot', 'squash', 'stretch', 'bounce', 'rotate'], flash=False),
}

def ease_in(st, p):
    if st['ease'] == 'back': return eob(p, st['over'])
    if st['ease'] == 'spring': return spring(p * 1.6)
    return eoe(p)

# ---------------- fonts ----------------
FONT_CANDIDATES = {
    'display': {
        'punch':  [('Helvetica Neue', 900, 3), ('Helvetica Neue', 900, 5), ('Arial', 900, 5), ('DejaVu Sans', 700, 5)],
        'swiss':  [('Helvetica Neue', 700, 5), ('Helvetica', 700, 5), ('Arial', 700, 5), ('DejaVu Sans', 700, 5)],
        'hud':    [('DIN Condensed', 700, 5), ('Avenir Next Condensed', 700, 3), ('Helvetica Neue', 700, 3), ('DejaVu Sans', 700, 5)],
        'bouncy': [('Arial Rounded MT Bold', 400, 5), ('Avenir Next', 800, 5), ('Arial', 900, 5), ('DejaVu Sans', 700, 5)],
    },
    'cjk':  [('PingFang SC', 600, 5), ('Hiragino Sans GB', 700, 5), ('Noto Sans CJK SC', 900, 5), ('Source Han Sans SC', 900, 5),
             ('Microsoft YaHei', 700, 5), ('WenQuanYi Zen Hei', 400, 5)],
    'serif': [('Didot', 700, 5), ('Bodoni 72', 700, 5), ('Georgia', 700, 5), ('Times New Roman', 700, 5), ('DejaVu Serif', 700, 5)],
    'cjk_serif': [('Songti SC', 900, 5), ('STSong', 400, 5), ('Noto Serif CJK SC', 900, 5), ('Source Han Serif SC', 900, 5)],
    'serif_it': [('Bodoni 72', 400, 5), ('Didot', 400, 5), ('Georgia', 400, 5), ('Times New Roman', 400, 5), ('DejaVu Serif', 400, 5)],
    'mono': [('Menlo', 700, 5), ('SF Mono', 600, 5), ('DejaVu Sans Mono', 700, 5), ('Courier New', 700, 5)],
}
def _find(cands, slant=skia.FontStyle.kUpright_Slant):
    for fam, w, wd in cands:
        tf = skia.Typeface.MakeFromName(fam, skia.FontStyle(w, wd, slant))
        if tf and tf.getFamilyName().lower() == fam.lower(): return tf
    return None
def load_fonts(style, overrides=None):
    o = overrides or {}
    def get(key, cands):
        if key in o:
            v = o[key]
            if os.path.isfile(v): return skia.Typeface.MakeFromFile(v)
            return _find([(v, 700, 5)]) or _find(cands)
        return _find(cands)
    return dict(display=get('display', FONT_CANDIDATES['display'][style]),
                cjk=get('cjk', FONT_CANDIDATES['cjk']),
                mono=get('mono', FONT_CANDIDATES['mono']),
                serif=get('serif', FONT_CANDIDATES['serif']),
                cjk_serif=get('cjk_serif', FONT_CANDIDATES['cjk_serif']),
                serif_it=o.get('serif_it') and get('serif_it', FONT_CANDIDATES['serif_it']) or _find(FONT_CANDIDATES['serif_it'], skia.FontStyle.kItalic_Slant))

def is_cjk(ch): return ord(ch) >= 0x2E80
def has_cjk(s): return any(is_cjk(c) for c in s)

class Text:
    """Mixed Latin/CJK text with per-character font fallback."""
    _fc = {}
    def __init__(self, ctx, size, kind='display'):
        self.ctx, self.size, self.kind = ctx, size, kind
        tf = ctx.fonts.get(kind) or ctx.fonts['display']
        self.lat = self._font(tf, size)
        cj = (ctx.fonts.get('cjk_serif') if kind in ('serif', 'serif_it') else None) or ctx.fonts['cjk'] or tf
        self.cj = self._font(cj, size * (0.92 if kind != 'mono' else 0.95))
    @classmethod
    def _font(cls, tf, size):
        k = (id(tf), round(size, 2))
        if k not in cls._fc:
            f = skia.Font(tf, size); f.setEdging(skia.Font.Edging.kAntiAlias); f.setSubpixel(True); cls._fc[k] = f
        return cls._fc[k]
    def font_for(self, ch): return self.cj if is_cjk(ch) else self.lat
    def adv(self, s): return [self.font_for(ch).measureText(ch) for ch in s]
    def width(self, s, track=0.0): return sum(self.adv(s)) + track * max(0, len(s) - 1)
    def cap(self, s=''):
        if s and all(is_cjk(c) or c == ' ' for c in s): return self.cj.getSize() * 0.80
        return self.lat.getMetrics().fCapHeight
    def draw(self, c, s, x, y, paint, align='c', track=0.0):
        w = self.width(s, track); x = {'c': x - w / 2, 'l': x, 'r': x - w}[align]
        for ch, a in zip(s, self.adv(s)):
            c.drawString(ch, x, y, self.font_for(ch), paint); x += a + track
        return w
    def draw_mid(self, c, s, x, cy, paint, align='c', track=0.0):
        return self.draw(c, s, x, cy + self.cap(s) / 2, paint, align, track)

def fit_size(ctx, s, size, maxw, kind='display', track=0.0):
    w = Text(ctx, size, kind).width(s, track)
    return size if w <= maxw or w == 0 else size * maxw / w

def wrap(ctx, s, size, maxw, kind='display'):
    T = Text(ctx, size, kind); lines, cur = [], ''
    tokens = re.findall(r'[\u2E80-\uFFFF]|[^\s\u2E80-\uFFFF]+|\s+', s)
    for tok in tokens:
        trial = cur + tok
        if T.width(trial.strip()) > maxw and cur.strip():
            lines.append(cur.strip()); cur = tok.lstrip()
        else: cur = trial
    if cur.strip(): lines.append(cur.strip())
    return lines

def P(c, a=1.0, stroke=None, cap=True, blur=0):
    p = skia.Paint(AntiAlias=True, Color=col(c, a))
    if stroke is not None:
        p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(stroke)
        p.setStrokeCap(skia.Paint.kRound_Cap if cap else skia.Paint.kButt_Cap); p.setStrokeJoin(skia.Paint.kRound_Join)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    return p

# ---------------- context ----------------
ASPECTS = {'16:9': (16, 9), '9:16': (9, 16), '1:1': (1, 1), '4:5': (4, 5)}

class Ctx:
    def __init__(self, spec, style_override=None, height=None):
        f = spec.get('format', {})
        a, b = ASPECTS[f.get('aspect', '16:9')]
        short = height or f.get('short_side', 1080)
        if a >= b: H = short; W = int(round(short * a / b / 2) * 2)
        else: W = short; H = int(round(short * b / a / 2) * 2)
        self.W, self.H = W, H; self.U = min(W, H) / 1080; self.cx, self.cy = W / 2, H / 2
        self.portrait = H > W
        self.fps = f.get('fps', 60); self.bpm = f.get('bpm', 120); self.beat = 60 / self.bpm
        self.spec = spec
        self.style_name = style_override or spec.get('style', 'punch')
        self.st = dict(STYLES[self.style_name], **{k: v for k, v in (spec.get('fx') or {}).items() if k in ('shake', 'zoom', 'rgb', 'grain', 'vig', 'scan')})
        self.pal = resolve_palette(spec.get('palette'))
        self.fonts = load_fonts(self.style_name, spec.get('fonts'))
        self.images = {}
        for k, path in (spec.get('assets') or {}).items():
            if path and os.path.isfile(path):
                img = skia.Image.MakeFromEncoded(skia.Data.MakeFromFileName(path))
                if img is not None:
                    arr = img.toarray(); opaque = bool(arr[..., 3].min() > 250) if arr.shape[-1] == 4 else True
                    if not opaque:  # trim transparent margins so logos/products fill their layout box
                        ys, xs = np.where(arr[..., 3] > 8)
                        if len(xs):
                            pad = int(0.02 * max(img.width(), img.height()))
                            r = skia.IRect.MakeLTRB(max(0, xs.min() - pad), max(0, ys.min() - pad), min(img.width(), xs.max() + pad + 1), min(img.height(), ys.max() + pad + 1))
                            img = img.makeSubset(r) or img
                    self.images[k] = (img, opaque)
        # timeline
        t = 0.0; self.scenes = []
        for i, sc in enumerate(spec['scenes']):
            d = sc['beats'] * self.beat
            self.scenes.append(dict(sc, i=i, t0=t, t1=t + d, dur=d)); t += d
        self.duration = t; self.N = int(round(t * self.fps))
    def up(self, s):
        return s.upper() if self.st['upper'] else s
    def colors(self, sc):
        bg = self.pal[sc.get('bg', 'dark')]
        fg = max((self.pal['dark'], self.pal['light']), key=lambda c: contrast(c, bg))
        acc = sorted((self.pal[r] for r in ('a1', 'a2', 'a3') if r != sc.get('bg')), key=lambda c: -contrast(c, bg))
        return bg, fg, acc[0], acc[1] if len(acc) > 1 else acc[0]
    def T(self, size, kind='display'): return Text(self, size * self.U, kind)
