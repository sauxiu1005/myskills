"""像素层：语义色槽画布 + 原语 + 色板映射。

Canvas.a 存的是「语义色槽」（色板索引，255 = 透明）。
Canvas.light 存局部光等级（0 无光 / 1 外圈 / 2 内圈），只由场景在真实光源（路灯、台灯）处写入。
所有原语都无抗锯齿（PIL 在 'L' 模式下的填充为硬边），坐标为整数逻辑像素。
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw

T = 255  # 透明
BAYER4 = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], np.float32) / 16.0


class Palette:
    def __init__(self, path):
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
        self.d = d
        self.rgb = np.array([[int(c["hex"][i:i + 2], 16) for i in (1, 3, 5)] for c in d["colors"]], np.uint8)
        self.n = len(self.rgb)
        self.ramps = d["ramps"]
        self.maps = {}
        for k, m in d["slot_maps"].items():
            self.maps[k] = {lv: np.array(m[lv] + [0] * (256 - self.n), np.uint8) for lv in ("base", "lit1", "lit2")}

    def c(self, ramp, step):
        r = self.ramps[ramp]
        if step < 0:
            step = len(r) + step
        return r[max(0, min(len(r) - 1, step))]

    def hex(self, idx):
        return tuple(int(x) for x in self.rgb[idx])

    def resolve(self, slots, light, state, H, W):
        """语义槽 -> 色板索引。state 来自 Cues.palette_state；过渡用 Bayer 有序抖色分步替换映射。"""
        def apply(name):
            m = self.maps[name]
            out = m["base"][slots]
            if light is not None:
                out = np.where(light == 1, m["lit1"][slots], out)
                out = np.where(light >= 2, m["lit2"][slots], out)
            return out
        dst = apply(state["dst"])
        if state["k"] >= state["steps"] or state["src"] == state["dst"]:
            return dst
        src = apply(state["src"])
        thr = np.tile(BAYER4, (H // 4 + 1, W // 4 + 1))[:H, :W]
        use_dst = thr < (state["k"] / state["steps"])
        return np.where(use_dst, dst, src)


def default_palette():
    here = os.path.dirname(os.path.abspath(__file__))
    return Palette(os.path.normpath(os.path.join(here, "..", "..", "palette", "compound-dawn.json")))


PAL = default_palette()


def C(ramp, step):
    return PAL.c(ramp, step)


def shift(m, dx, dy):
    """out[y,x] = m[y+dy, x+dx]，越界为 False。"""
    H, W = m.shape
    out = np.zeros_like(m)
    ys0, ys1 = max(0, -dy), min(H, H - dy)
    xs0, xs1 = max(0, -dx), min(W, W - dx)
    if ys1 > ys0 and xs1 > xs0:
        out[ys0:ys1, xs0:xs1] = m[ys0 + dy:ys1 + dy, xs0 + dx:xs1 + dx]
    return out


def dilate4(m):
    return m | shift(m, 1, 0) | shift(m, -1, 0) | shift(m, 0, 1) | shift(m, 0, -1)


def dilate8(m):
    o = dilate4(m)
    return o | shift(m, 1, 1) | shift(m, -1, -1) | shift(m, 1, -1) | shift(m, -1, 1)


class Canvas:
    def __init__(self, w, h, fill=T):
        self.w, self.h = w, h
        self.a = np.full((h, w), fill, np.uint8)
        self.light = np.zeros((h, w), np.uint8)

    # ---------- 掩码 ----------
    def mask(self, fn):
        im = Image.new("L", (self.w, self.h), 0)
        fn(ImageDraw.Draw(im))
        return np.array(im) > 0

    def m_rect(self, x, y, w, h):
        m = np.zeros((self.h, self.w), bool)
        x0, y0, x1, y1 = max(0, int(x)), max(0, int(y)), min(self.w, int(x + w)), min(self.h, int(y + h))
        if x1 > x0 and y1 > y0:
            m[y0:y1, x0:x1] = True
        return m

    def m_ellipse(self, cx, cy, rx, ry):
        return self.mask(lambda d: d.ellipse([round(cx - rx), round(cy - ry), round(cx + rx), round(cy + ry)], fill=1))

    def m_poly(self, pts):
        return self.mask(lambda d: d.polygon([(round(x), round(y)) for x, y in pts], fill=1))

    def m_line(self, pts, width=1):
        pts = [(round(x), round(y)) for x, y in pts]
        def fn(d):
            d.line(pts, fill=1, width=width)
            if width > 2:
                r = width / 2 - 0.5
                for x, y in pts:
                    d.ellipse([x - r, y - r, x + r, y + r], fill=1)
        return self.mask(fn)

    def m_rrect(self, x, y, w, h, r):
        return self.mask(lambda d: d.rounded_rectangle([round(x), round(y), round(x + w - 1), round(y + h - 1)], radius=r, fill=1))

    # ---------- 填充 ----------
    def put(self, m, c):
        self.a[m] = c

    def rect(self, x, y, w, h, c):
        x0, y0, x1, y1 = max(0, int(x)), max(0, int(y)), min(self.w, int(x + w)), min(self.h, int(y + h))
        if x1 > x0 and y1 > y0:
            self.a[y0:y1, x0:x1] = c

    def px(self, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < self.w and 0 <= y < self.h:
            self.a[y, x] = c

    def ellipse(self, cx, cy, rx, ry, c):
        self.put(self.m_ellipse(cx, cy, rx, ry), c)

    def poly(self, pts, c):
        self.put(self.m_poly(pts), c)

    def line(self, pts, c, width=1):
        self.put(self.m_line(pts, width), c)

    def rrect(self, x, y, w, h, r, c):
        self.put(self.m_rrect(x, y, w, h, r), c)

    def shaded(self, m, ramp, base, k=1, hi=True, sh=True, hi_k=None, dirx=1, diry=1):
        """按左上光源给一个形状上色：base 色阶 + 右下阴影带(k) + 左上高光(1px)。"""
        r = PAL.ramps[ramp]
        b = max(0, min(len(r) - 1, base))
        self.a[m] = r[b]
        if sh and b > 0:
            s = m & ~shift(m, k * dirx, k * diry)
            self.a[s] = r[b - 1]
        if hi and b < len(r) - 1:
            hk = hi_k or 1
            h_ = m & ~shift(m, -hk * dirx, -hk * diry)
            if sh and b > 0:
                h_ &= ~(m & ~shift(m, k * dirx, k * diry))
            self.a[h_] = r[b + 1]

    def outline(self, m, c, eight=False):
        ring = (dilate8(m) if eight else dilate4(m)) & ~m
        self.a[ring] = c
        return ring

    def blit(self, spr, x, y):
        """把另一张 Canvas（透明=255）贴到 (x,y)，同时合并其局部光。"""
        x, y = int(x), int(y)
        sx0, sy0 = max(0, -x), max(0, -y)
        dx0, dy0 = max(0, x), max(0, y)
        w = min(spr.w - sx0, self.w - dx0)
        h = min(spr.h - sy0, self.h - dy0)
        if w <= 0 or h <= 0:
            return
        src = spr.a[sy0:sy0 + h, sx0:sx0 + w]
        m = src != T
        self.a[dy0:dy0 + h, dx0:dx0 + w][m] = src[m]

    def dither_fill(self, m, c_lo, c_hi, frac_map):
        """有序抖色：frac_map(与画布同形) 0..1，>阈值取 c_hi。只用于天空带与光圈边缘。"""
        thr = np.tile(BAYER4, (self.h // 4 + 1, self.w // 4 + 1))[:self.h, :self.w]
        hi = frac_map > thr
        self.a[m & hi] = c_hi
        self.a[m & ~hi] = c_lo

    # ---------- 光 ----------
    def add_light(self, cx, cy, r1, r2, squash=1.0, clip=None):
        """真实光源 mask：r2 内圈=2，r1 外圈=1，外圈边缘 3px 有序抖色。"""
        yy, xx = np.mgrid[0:self.h, 0:self.w]
        d = np.sqrt((xx - cx) ** 2 + ((yy - cy) / squash) ** 2)
        thr = np.tile(BAYER4, (self.h // 4 + 1, self.w // 4 + 1))[:self.h, :self.w]
        lv = np.zeros((self.h, self.w), np.uint8)
        edge = 4.0
        in1 = d < r1 - edge * thr
        in2 = d < r2 - edge * thr
        lv[in1] = 1
        lv[in2] = 2
        if clip is not None:
            lv[~clip] = 0
        self.light = np.maximum(self.light, lv)


def sky_gradient(cv, y0, y1, levels=5, band=6, x0=0, x1=None, bands=None):
    """sky 语义槽 0..4 垂直渐变；只在相邻两级交界的 band 像素内做有序抖色。"""
    x1 = cv.w if x1 is None else x1
    H = y1 - y0
    bounds = bands or [y0 + H * (i + 1) / levels for i in range(levels - 1)]
    thr = np.tile(BAYER4, (cv.h // 4 + 1, cv.w // 4 + 1))[:cv.h, :cv.w]
    for y in range(max(0, y0), min(cv.h, y1)):
        lv = 0
        for b in bounds:
            if y >= b:
                lv += 1
        frac = 0.0
        for i, b in enumerate(bounds):
            if b - band <= y < b:
                lv = i
                frac = (y - (b - band)) / band
        row = np.full(x1 - x0, C("sky", lv), np.uint8)
        if frac > 0:
            hi = frac > thr[y, x0:x1]
            row[hi] = C("sky", min(levels - 1, lv + 1))
        cv.a[y, x0:x1] = row
