"""文字光栅化与换行（UI/字幕层共用）。

- 英文/数字：沿用像素字体（Geneva 10，无抗锯齿）。
- 含中文（或其他 CJK）：Geneva 没有中文字形，会画成空框/空白，所以改用带中文字形的 Hiragino Sans GB，
  在逻辑字号（12/16/22 像素）下无抗锯齿栅格化，再最近邻放大到输出网格。
- 画布按字体真实 bbox 与 ascent+descent 的并集开，字形顶部/底部/左右都不会被截掉。
- 换行：中文按字断行（不在行首放句读、不在行尾放开括号），英文按空格断行；行宽受安全边距约束。
"""
import os, unicodedata
import numpy as np
from PIL import Image, ImageDraw, ImageFont

PIXFONT = os.environ.get("PIX_FONT_LATIN", "/System/Library/Fonts/Geneva.ttf")
CJKFONT = os.environ.get("PIX_FONT_CJK", "/System/Library/Fonts/Hiragino Sans GB.ttc")
CJK_INDEX = {False: 0, True: 2}          # Hiragino Sans GB：0 = W3，2 = W6（1/3 是界面变体，顶端会越界，不用）
CJK_PX = {1: 12, 2: 16, 3: 22}           # 像素字放大档 k → 中文逻辑字号（逻辑像素，640×360 网格）
NO_START = set("，。、：；！？）」』》】,.:;!?)]}%…—～·")
NO_END = set("（「『《【([{")
_cache, _fonts = {}, {}


def has_cjk(s):
    return any(unicodedata.east_asian_width(ch) in ("W", "F") for ch in s)


def _font(path, px, index=0):
    key = (path, px, index)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(path, px, index=index)
    return _fonts[key]


def check_glyphs(txt, path=None, index=0):
    """返回字体里没有字形的字符：与私用区/未分配码位渲染出的缺字框（.notdef）逐像素相同即视为缺字。
    字幕验收：所用字体对全部字幕文本必须返回空列表。"""
    f = _font(path or CJKFONT, 16, index)

    def img(ch):
        bb = f.getbbox(ch)
        im = Image.new("L", (24, 24), 0); ImageDraw.Draw(im).text((2, 2), ch, font=f, fill=255)
        return bb, im.tobytes()
    ref = {img(c) for c in ("\ue000", "\U000f0000", "\u0378")}
    miss = []
    for ch in sorted(set(txt)):
        if ch.isspace():
            continue
        bb, by = img(ch)
        if bb[2] - bb[0] <= 0 or (bb, by) in ref or by == bytes(len(by)):
            miss.append(ch)
    return miss


def raster(txt, k, scale, bold=False):
    """返回 L 模式蒙版（已按输出网格最近邻放大）。k = 1 小字 / 2 标签与字幕 / 3 印章。"""
    key = (txt, k, scale, bold)
    if key in _cache:
        return _cache[key]
    if has_cjk(txt):
        f = _font(CJKFONT, CJK_PX[k], CJK_INDEX[bold]); up = scale
    else:
        f = _font(PIXFONT, 10); up = k * scale
    asc, desc = f.getmetrics()
    bb = f.getbbox(txt)
    x0, y0 = min(0, bb[0]), min(0, bb[1])
    w, h = max(1, max(bb[2], 1) - x0), max(asc + desc, bb[3]) - y0
    im = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(im); d.fontmode = "1"
    d.text((-x0, -y0), txt, font=f, fill=255)
    if not has_cjk(txt):                      # 像素字：去掉上方空白，保留降部（与旧版一致）
        rows = np.nonzero(np.array(im).max(1))[0]
        if len(rows):
            top = min(int(rows[0]), 2)
            im = im.crop((0, top, w, max(int(rows[-1]) + 1, 9 - y0)))
    m = im.resize((im.width * up, im.height * up), Image.NEAREST)
    _cache[key] = m
    return m


def _tokens(txt):
    if not has_cjk(txt):
        ws = txt.split(" ")
        return [w + (" " if i < len(ws) - 1 else "") for i, w in enumerate(ws)]
    out, buf = [], ""
    for ch in txt:                            # 中文逐字；连续的拉丁字母/数字成一个词
        if ch.isascii() and (ch.isalnum() or ch in "%.-"):
            buf += ch
        else:
            if buf:
                out.append(buf); buf = ""
            out.append(ch)
    if buf:
        out.append(buf)
    return out


def wrap(txt, measure, maxw, max_lines=3):
    """贪心换行 + 句读避头尾。measure(s) -> 输出像素宽。返回行列表；单行放得下就不拆。"""
    if measure(txt) <= maxw:
        return [txt]
    toks, lines, cur = _tokens(txt), [], ""
    for t in toks:
        if cur and measure((cur + t).rstrip()) > maxw:
            if t[0] in NO_START and len(cur) > 1:         # 句读不放行首：把上一字一起带下去
                lines.append(cur[:-1].rstrip()); cur = cur[-1] + t
            elif cur[-1] in NO_END:
                lines.append(cur[:-1].rstrip()); cur = cur[-1] + t
            else:
                lines.append(cur.rstrip()); cur = t.lstrip()
        else:
            cur += t
    if cur:
        lines.append(cur.rstrip())
    if len(lines) == 2:                                   # 两行时再平衡一次，避免末行只剩两三个字
        full = "".join(lines) if has_cjk(txt) else " ".join(lines)
        best = None
        for i in range(1, len(full)):
            a, b = full[:i].rstrip(), full[i:].lstrip()
            if not a or not b or b[0] in NO_START or a[-1] in NO_END:
                continue
            if not has_cjk(txt) and full[i - 1] != " " and full[i] != " ":
                continue
            wm = max(measure(a), measure(b))
            if wm <= maxw and (best is None or wm < best[0]):
                best = (wm, [a, b])
        if best:
            lines = best[1]
    return lines[:max_lines]
