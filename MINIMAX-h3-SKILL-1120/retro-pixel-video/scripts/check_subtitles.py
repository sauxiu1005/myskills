#!/usr/bin/env python3
"""字幕字形验收：检查 cues.json 里全部字幕/画内文字在所用字体中都有字形（不会画成空框）。

  python3 scripts/check_subtitles.py path/to/cues.json [--font 字体路径] [--index 0]

规则：含中文的文本必须用带中文字形的字体（默认 Hiragino Sans GB）；纯英文可用像素字体 Geneva。
同时报告 Geneva 对中文的缺字数，提醒不要把中文交给像素字体。退出码 1 = 有缺字。
"""
import json, sys, argparse, unicodedata
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("cues"); ap.add_argument("--font", default="/System/Library/Fonts/Hiragino Sans GB.ttc"); ap.add_argument("--index", type=int, default=0)
a = ap.parse_args()


def missing(txt, path, index=0):
    f = ImageFont.truetype(path, 16, index=index)

    def img(ch):
        im = Image.new("L", (24, 24), 0); ImageDraw.Draw(im).text((2, 2), ch, font=f, fill=255)
        return f.getbbox(ch), im.tobytes()
    ref = {img(c) for c in ("\ue000", "\U000f0000", "\u0378")}
    out = []
    for ch in sorted(set(txt)):
        if ch.isspace():
            continue
        bb, by = img(ch)
        if bb[2] - bb[0] <= 0 or (bb, by) in ref or by == bytes(len(by)):
            out.append(ch)
    return out


d = json.load(open(a.cues, encoding="utf-8"))
texts = [e["subtitle"]["text"] for e in d.get("events", []) if isinstance(e.get("subtitle"), dict) and e["subtitle"].get("text")]
allt = "".join(texts)
cjk = any(unicodedata.east_asian_width(c) in ("W", "F") for c in allt)
miss = missing(allt, a.font, a.index)
print("字幕 %d 条，字符 %d 种，含中文=%s" % (len(texts), len(set(allt)), cjk))
print("字体 %s：缺字 %s" % (a.font, miss or "无"))
if cjk:
    g = missing(allt, "/System/Library/Fonts/Geneva.ttf")
    print("参考：Geneva 像素字体缺 %d 种字符 —— 中文不能交给像素字体" % len(g))
print("结论:", "FAIL" if miss else "PASS")
sys.exit(1 if miss else 0)
