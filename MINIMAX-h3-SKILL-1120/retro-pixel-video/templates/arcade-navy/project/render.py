#!/usr/bin/env python3
"""《年轻人的复利》像素渲染入口。

  python3 render.py --keyframes            # 每镜一张风格关键帧 + 总览 -> ../review/
  python3 render.py --frames 88 235 496    # 指定帧 -> ../../out/frames/
  python3 render.py --all                  # 全片逐帧 PNG -> ../../out/frames/（下一阶段再编码 mp4）
  python3 render.py --shot 3               # 某一镜全部帧

render_frame(f) 是纯函数：只依赖帧号 + cues.json + 静态资源（色板 JSON、字体），
无墙钟、无逐帧累积状态，任意顺序渲染逐像素一致。
"""
import argparse, importlib, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import numpy as np
from PIL import Image, ImageDraw

from engine.cues import Cues, default_cues
from engine.canvas import Canvas, PAL, T, C
from engine.ui import UI, compose, font, rgb

ROOT = os.path.normpath(os.path.join(HERE, ".."))          # young-compound/
OUT = os.path.normpath(os.path.join(HERE, "..", "..", "out"))
SCENES = {i: importlib.import_module("scenes.s%d" % i) for i in sorted({s["id"] for s in default_cues().shots})}

def keyframe_of(Q, eid):
    # 每镜的结果事件由 cues.json 和生成脚本共同维护。
    f = Q.start(eid) + Q.dur(eid) // 2
    shot = Q.shot(Q.ev(eid)["shot_id"])
    if not (0 <= f < Q.duration and shot["start"] <= f < shot["end"]):
        raise ValueError("keyframe %s is outside its shot or timeline: %d" % (eid, f))
    return f


TRANS = 0   # half-length of a shot transition (frames on each side of the cut)


def _single(f, fs, Q):
    """draw the shot that owns frame fs, subtitle/palette timing from f."""
    W, H = Q.logical
    sh = Q.shot_at(fs)
    cv = Canvas(W, H, T)
    ui = UI(Q.scale, W, H)
    default_map = SCENES[sh["id"]].draw(fs, Q, cv, ui)
    if (cv.a == T).any():
        raise RuntimeError("frame %d: 画布有未填充像素" % fs)
    sub = Q.subtitle_at(f)
    if sub is not None:
        ui.subtitle(sub["subtitle"]["text"])
    state = Q.palette_state(fs, default_map)
    idx = PAL.resolve(cv.a, cv.light, state, H, W)
    return idx, ui, state


def transition_mask(Q, b, p, W, H):
    """True = show the incoming shot. s2->s3: pixel iris opening from the snowball (object match);
    s3->s4: none (the zoom box itself is the match); others: SNES-style diamond wipe left->right."""
    yy, xx = np.mgrid[0:H, 0:W]
    prev = Q.shot_at(b - 1)["id"]
    if prev == 2:
        bx, by, r0 = SCENES[2].iris(Q)
        R = r0 + p * 760
        bx4, by4, xx4, yy4 = bx // 4, by // 4, xx // 4, yy // 4      # 4px blocks -> stepped pixel edge
        return (xx4 - bx4) ** 2 + (yy4 - by4) ** 2 <= (R / 4) ** 2
    cell = 16
    cx = (xx % cell) - cell / 2 + 0.5
    cy = (yy % cell) - cell / 2 + 0.5
    dman = (np.abs(cx) + np.abs(cy)) / cell                        # 0 centre .. 1 corner
    local = p * 1.7 - (xx // cell) * cell / W * 0.7
    return dman < local


def render_layers(f, Q=None):
    """返回 (pixel_idx[360,640] 色板索引, ui: UI, state)。镜头交界 ±TRANS 帧内做有动机的像素转场。"""
    Q = Q or default_cues()
    W, H = Q.logical
    for s in Q.shots[1:]:
        b = s["start"]
        if b - TRANS <= f < b + TRANS and Q.shot_at(b - 1)["id"] != 3:
            p = (f - (b - TRANS) + 1) / (2 * TRANS + 1)
            ia, ua, sa = _single(f, min(f, b - 1), Q)
            ib, ub, sb = _single(f, max(f, b), Q)
            m = transition_mask(Q, b, p, W, H)
            idx = np.where(m, ib, ia)
            return idx, (ub if p >= 0.5 else ua), (sb if p >= 0.5 else sa)
    return _single(f, f, Q)


def render_frame(f, Q=None):
    idx, ui, state = render_layers(f, Q)
    return compose(PAL.rgb[idx], ui, ui.s)


def save_frames(frames, outdir, Q=None):
    os.makedirs(outdir, exist_ok=True)
    paths = []
    for f in frames:
        p = os.path.join(outdir, "f%04d.png" % f)
        render_frame(f, Q).save(p)
        paths.append(p)
        print("frame", f, "->", p)
    return paths


def keyframes(Q=None):
    Q = Q or default_cues()
    kdir = os.path.join(ROOT, "review", "keyframes")
    os.makedirs(kdir, exist_ok=True)
    items = []
    for eid in Q.raw["keyframe_events"]:
        f = keyframe_of(Q, eid)
        sid = Q.ev(eid)["shot_id"]
        img = render_frame(f, Q)
        p = os.path.join(kdir, "S%d_f%04d_%s.png" % (sid, f, eid))
        img.save(p)
        items.append((sid, f, eid, img))
        print("S%d" % sid, eid, "frame", f, "->", p)
    # 按当前关键帧数量排总览，每格 480×270；标镜号与帧号。
    cw, ch, lab = 480, 270, 48
    cols = min(3, len(items))
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new("RGB", (cw * cols + (cols + 1) * 12, (ch + lab) * rows + (rows + 1) * 12), PAL.hex(C("ink", 0)))
    d = ImageDraw.Draw(sheet)
    for i, (sid, f, eid, img) in enumerate(items):
        cx, cy = 12 + (i % cols) * (cw + 12), 12 + (i // cols) * (ch + lab + 12)
        sheet.paste(img.resize((cw, ch), Image.NEAREST), (cx, cy + lab))
        d.text((cx + 6, cy + 6), "S%d · 帧 %d · %s" % (sid, f, eid), font=font(30, True), fill=rgb(C("paper", 2)))
    sp = os.path.join(ROOT, "review", "keyframes_sheet.png")
    sheet.save(sp)
    print("sheet ->", sp)
    return items, sp


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", type=int, nargs="*")
    ap.add_argument("--keyframes", action="store_true")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--shot", type=int)
    ap.add_argument("--out", default=os.path.join(OUT, "frames"))
    a = ap.parse_args()
    Q = default_cues()
    if a.keyframes:
        keyframes(Q)
    if a.frames:
        save_frames(a.frames, a.out, Q)
    if a.shot:
        s = Q.shot(a.shot)
        save_frames(range(s["start"], s["end"]), a.out, Q)
    if a.all:
        save_frames(range(0, Q.duration), a.out, Q)


if __name__ == "__main__":
    main()
