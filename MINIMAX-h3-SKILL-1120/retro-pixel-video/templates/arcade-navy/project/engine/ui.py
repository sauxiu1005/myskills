import os
"""声明的独立 UI / 字幕层（输出分辨率 1920×1080）。

- 中文（字幕、标签、假设卡、片名、脚注、印章字）只在这一层，用本地中文字体在输出分辨率绘制。
- 面板坐标用逻辑像素给出，×3 后自然对齐 3px 网格；面板为硬边纯色（取自色板）。
- 文字本身由字体光栅化（含字体自身的边缘抗锯齿），这是本层与像素层的唯一区别，自检时按 ui_mask 排除。
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from .canvas import PAL, C
from . import textfit as TF

FONT_PATH = "/System/Library/Fonts/Hiragino Sans GB.ttc"
_fonts = {}


# ---- 英文版画内文字对照（英文工程专用；未列出的文字原样输出）
EN = {
    "每轮加同样一份": "Same amount each round", "上一轮也滚进来": "Last round's gains roll in",
    "假设：本金 100 单位": "Hypothetical example: 100 units", "每轮 +10%": "+10% per round",
    "不追加投入": "No added contributions", "纯数学示意·非投资回报": "Math illustration · Not a promised return",
    "单利": "Simple", "复利": "Compound", "利息放罐外": "Interest kept outside",
    "多出的 1": "The extra 1", "第一轮的 10 枚利息，各分出 10%": "10% from each of round 1's 10 gains",
    "轮": "Round", "第10轮：单利 200 ｜ 复利 ≈259 ｜ 差 ≈59": "Round 10: simple 200 | compound ≈259 | gap ≈59",
    "每轮固定 10% 仅为假设": "Fixed 10% per round is hypothetical",
    "类比": "Analogy", "固定%": "Fixed %", "真实：有平台、有回落": "Real: plateaus & dips",
    "练习": "Practice", "复盘": "Review", "下一次": "Next", "每周 1 次": "1× a week", "只选一项": "Pick one",
    "年轻人的复利": "Compounding for the Young", "数学例子为假设，非投资建议": "Hypothetical math · Not investment advice",
}


def tr(t):
    return EN.get(t, t)


def font(size, bold=False):
    key = (size, bold)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(FONT_PATH, size, index=2 if bold else 0)
    return _fonts[key]




def rgb(idx, a=255):
    r, g, b = PAL.hex(idx)
    return (r, g, b, a)


def snap(v, g=3):
    return int(round(v / g)) * g


CLEAN = os.environ.get("PIX_CLEAN") == "1"   # 无字展示版：关闭全部文字/字幕/标签层


class UI:
    def __init__(self, scale=3, w=640, h=360):
        self.s = scale
        self.W, self.H = w * scale, h * scale
        self.im = Image.new("RGBA", (self.W, self.H), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    # 逻辑坐标面板：边框 bw 逻辑像素
    def panel(self, x, y, w, h, fill, border=None, bw=1, shadow=None):
        s = self.s
        if shadow is not None:
            self.d.rectangle([(x + 1) * s, (y + 1) * s, (x + w + 1) * s - 1, (y + h + 1) * s - 1], fill=rgb(shadow))
        if border is not None:
            # 16-bit RPG 窗口：外描边、四角切 1 像素、内侧上/左亮边 + 下/右暗边（按底色深浅选色阶）
            R = lambda a, b, c, d, col: self.d.rectangle([a * s, b * s, c * s - 1, d * s - 1], fill=col)
            R(x, y, x + w, y + h, rgb(border))
            R(x + bw, y + bw, x + w - bw, y + h - bw, rgb(fill))
            fr = rgb(fill)
            light = (fr[0] * 299 + fr[1] * 587 + fr[2] * 114) / 1000 > 110
            ring = rgb(C("wood", 3)) if light else rgb(C("sky", 2))
            hi = rgb(C("snow", 4)) if light else rgb(C("ink", 2))
            lo = rgb(C("paper", 0)) if light else rgb(C("ink", 0))
            if w > 8 and h > 8:
                a, b, c, d = x + bw, y + bw, x + w - bw, y + h - bw
                R(a, b, c, d, ring)                                   # 中间暖色环
                R(a + 1, b + 1, c - 1, d - 1, rgb(border))            # 内描边
                R(a + 2, b + 2, c - 2, d - 2, fr)
                R(a + 2, b + 2, c - 2, b + 3, hi); R(a + 2, b + 2, a + 3, d - 2, hi)    # 内斜面：上/左亮
                R(a + 2, d - 3, c - 2, d - 2, lo); R(c - 3, b + 3, c - 2, d - 2, lo)    # 下/右暗
                for px_, py_ in ((a, b), (c - 1, b), (a, d - 1), (c - 1, d - 1)):      # 环的四角回描边色 → 圆角感
                    R(px_, py_, px_ + 1, py_ + 1, rgb(border))
            elif w > 6 and h > 6:
                R(x + bw, y + bw, x + w - bw, y + bw + 1, hi); R(x + bw, y + bw, x + bw + 1, y + h - bw, hi)
            for cx_, cy_ in ((x, y), (x + w - 1, y), (x, y + h - 1), (x + w - 1, y + h - 1)):
                R(cx_, cy_, cx_ + 1, cy_ + 1, (0, 0, 0, 0) if shadow is None or cy_ == y else rgb(shadow))
        else:
            self.d.rectangle([x * s, y * s, (x + w) * s - 1, (y + h) * s - 1], fill=rgb(fill))

    # ---- 文字：英文 Geneva 10 像素字（×k×s）；含中文时用 Hiragino Sans GB 逻辑字号 12/16/22 无抗锯齿（×s）。见 textfit.py
    @staticmethod
    def kof(size):
        return 3 if size >= 54 else 2 if size >= 33 else 1

    def _pix(self, txt, k):
        return TF.raster(txt, k, self.s)

    def text_size(self, txt, size, bold=False):
        m = self._pix(txt, self.kof(size))
        return m.width, m.height, (0, 0, m.width, m.height)

    def _blit_text(self, ox, oy, txt, k, color, shadow=None):
        m = self._pix(txt, k)
        ox, oy = snap(ox, self.s), snap(oy, self.s)
        if shadow is not None:
            self.im.paste(Image.new("RGBA", m.size, rgb(shadow)), (ox + self.s * k // 2 * 0 + self.s, oy + self.s), m)
        self.im.paste(Image.new("RGBA", m.size, rgb(color)), (ox, oy), m)

    # 输出坐标文字（左上角对齐逻辑网格）
    def text(self, ox, oy, txt, size, color, bold=False, anchor="la", shadow=None):
        if CLEAN:
            return (0, 0, 0, 0)
        txt = tr(txt)
        self._blit_text(ox, oy, txt, self.kof(size), color, shadow)

    def label(self, x, y, txt, size=33, fg=None, bg=None, border=None, pad=3, bold=True, align="left"):
        if CLEAN:
            return (0, 0, 0, 0)
        """逻辑坐标 (x,y) 处的标签：面板自动包住像素字（面板边按逻辑像素对齐）。返回面板逻辑 (x,y,w,h)。"""
        txt = tr(txt)
        fg = C("ink", 0) if fg is None else fg
        bg = C("paper", 2) if bg is None else bg
        k = self.kof(size)
        tw, th, _ = self.text_size(txt, size)
        pad = max(4, pad + 1)
        lw = tw // self.s + 2 * pad
        lh = th // self.s + 2 * pad - k
        if align == "center":
            x = x - lw // 2
        elif align == "right":
            x = x - lw
        self.panel(x, y, lw, lh, bg, border, 1, shadow=C("ink", 0) if border is not None else None)
        self._blit_text((x + pad) * self.s, y * self.s + (lh * self.s - th) // 2, txt, k, fg)
        return x, y, lw, lh

    SAFE_X, SAFE_BOTTOM = 32, 14     # 字幕安全边距（逻辑像素）：左右各 32（=96 输出像素 5%），底部 14（=42 输出像素 ≈4%）

    def subtitle(self, txt):
        if CLEAN:
            return (0, 0, 0, 0)
        """底部 RPG 对话框式字幕：英文像素字 ×2 / 中文 Hiragino 16px ×3；超宽自动换行（中文按字、句读避头尾）；面板在安全区内。"""
        k = 2
        pad_x, pad_y, gap = 8, 3, 2
        maxw = (self.W // self.s - 2 * self.SAFE_X - 2 * pad_x) * self.s
        lines = TF.wrap(txt, lambda t: self._pix(t, k).width, maxw)
        ims = [self._pix(t, k) for t in lines]
        lw = max(m.width for m in ims) // self.s + 2 * pad_x
        lh_line = max(-(-m.height // self.s) for m in ims) + gap
        lh = lh_line * len(lines) - gap + 2 * pad_y + 2
        x = (self.W // self.s - lw) // 2
        y = self.H // self.s - self.SAFE_BOTTOM - lh
        self.panel(x, y, lw, lh, C("ink", 1), C("paper", 1), 1, shadow=C("ink", 0))
        self.d.rectangle([(x + 2) * self.s, (y + 2) * self.s, (x + lw - 2) * self.s - 1, (y + 2) * self.s + self.s - 1], fill=rgb(C("ink", 2)))
        for i, (t, m) in enumerate(zip(lines, ims)):
            ox = (x + (lw - m.width // self.s) // 2) * self.s
            oy = (y + pad_y + 2 + i * lh_line) * self.s
            self._blit_text(ox, oy, t, k, C("paper", 2), shadow=C("ink", 0))
        return (x, y, lw, lh)

    def stamp(self, x, y, txt, size, color, angle_steps=0):
        if CLEAN:
            return (0, 0, 0, 0)
        """印章：硬边方框 + 像素字。"""
        txt = tr(txt)
        k = self.kof(size)
        tw, th, _ = self.text_size(txt, size)
        lw = tw // self.s + 8
        lh = th // self.s + 8 - k
        self.panel(x, y, lw, lh, C("paper", 2), color, 2)
        self._blit_text((x + 4) * self.s, y * self.s + (lh * self.s - th) // 2, txt, k, color)
        return (x, y, lw, lh)

    def mask(self):
        return np.array(self.im)[:, :, 3] > 0


def compose(pix_rgb, ui, scale=3):
    big = np.repeat(np.repeat(pix_rgb, scale, axis=0), scale, axis=1)
    base = Image.fromarray(big, "RGB").convert("RGBA")
    base.alpha_composite(ui.im)
    return base.convert("RGB")
