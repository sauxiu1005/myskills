"""S4（参考画风）：红长桌后三位白发审核员冒问号盯着发光币 → 横向特写速度线扫过、中间审核员疑惑
→ 讲解：第一轮 10 枚利息各分出 10% 碎片，飞向中央合成发光的 1（10 × 10% = 1）→ 审核员恍然低头。"""
import math
import numpy as np
from engine.canvas import C, T
from engine import arcade as A
from engine.motion import lerp, ease_out
from engine.character import draw_zhou

DEFAULT_MAP = "街机"
SHIRTS = ["stone", "night", "stone"]


def interest_frames(Q):
    D = Q.dur("s4-interest")
    s = Q.start("s4-interest")
    return [s + round(D * 0.55 * k / 10) for k in range(10)], s + round(D * 0.62)


def judges(sm, f, ui, mood):
    A.navy_bg(sm, f, y_floor=120)
    # 发光币在左侧展台
    sm.rect(36, 104, 30, 16, C("stone", 1)); sm.rect(36, 104, 30, 2, C("stone", 3)); A.outline(sm, sm.m_rect(36, 104, 30, 16))
    A.rays(sm, 51, 86, f, n=8, r0=10, r1=40, step=2, gap=4, dot=1)
    A.coin(sm, 51, 88, (f // 2) % 4, r=7, glow=True)
    for i, x in enumerate((150, 205, 260)):
        nod = 0
        expr = "calm"
        if mood == "?":
            look = (-2, 0)
        else:
            look = (-1, 2); nod = 3; expr = "down"
        A.npc(sm, x, 136, 64, shirt=SHIRTS[i], hair="snow", face=0, expr="wry" if mood == "?" else "smile", look=look, nod=nod,
              glasses=True)
    # 红长桌（挡住下半身）
    sm.rect(112, 114, 196, 40, C("red", 0)); sm.rect(112, 114, 196, 4, C("red", 1)); sm.rect(112, 114, 196, 1, C("red", 2))
    A.outline(sm, sm.m_rect(112, 114, 196, 40))
    for x in (150, 205, 260):
        if mood == "?":
            A.bubble(sm, x + 4, 40 - (1 if (f // 6 + x) % 2 else 0), "?")
        else:
            A.bubble(sm, x + 4, 40, "!", C("gold", 1))


def draw(f, Q, cv, ui):
    sm = A.new()
    zs = Q.start("s4-zoom")
    s_int = Q.start("s4-interest")
    drops, combine = interest_frames(Q)
    back = combine + 8
    if f < zs + 8:
        judges(sm, f, ui, "?")
        A.stext(ui, 160, 4, "多出的 1", 36, C("gold", 3), center=True)
    elif f < s_int:
        t = f - zs - 8
        A.bands(sm, 0, A.SH, [C("ink", 0), C("night", 0), C("ink", 0)])
        A.speed_lines(sm, f, 0, A.SH, n=40, sp=22, seed=5)
        lk = (-2, 0) if t < 6 else (2, 0)
        from engine.canvas import Canvas
        big = Canvas(A.SW, A.SH, T)
        draw_zhou(big, 160 - min(8, t * 2) + 8, 200, 190, mode="stand", face=0, expr="wry", glasses=True, look=lk)
        lut = np.arange(256, dtype=np.uint8)
        lut[C("ink", 1)] = C("snow", 2); lut[C("ink", 2)] = C("snow", 3)
        from engine.canvas import PAL
        for i, idx in enumerate(PAL.ramps["mustard"]):
            lut[idx] = PAL.ramps["stone"][min(3, max(0, i - 1))]
        m = big.a != T
        sm.a[m] = lut[big.a[m]]
        A.bubble(sm, 236, 40 - (t // 3) % 2, "?")
        A.speed_lines(sm, f + 5, 0, A.SH, n=10, sp=28, cols=[C("snow", 4), C("teal", 3)], seed=11)
        sm.rect(0, 0, A.SW, 14, C("ink", 0)); sm.rect(0, A.SH - 14, A.SW, 14, C("ink", 0))
    elif f < back:
        A.navy_bg(sm, f, y_floor=128)
        xs = [160 - 90 + k * 20 for k in range(10)]
        rowy = 96
        cx, cy = 160, 40
        for k in range(10):
            A.coin(sm, xs[k], rowy, (f // 3 + k) % 4 if f < drops[k] else 0, r=6)
            if f >= drops[k]:
                sm.rect(xs[k] + 2, rowy - 6, 3, 3, C("ink", 0))          # 被分走的 10%
            if f >= drops[k] and f < combine:
                q = min(1.0, (f - drops[k]) / 7)
                fx, fy = round(lerp(xs[k] + 3, cx, ease_out(q))), round(lerp(rowy - 6, cy, ease_out(q)))
                if q < 1:
                    sm.rect(fx - 1, fy - 1, 3, 3, C("gold", 3)); A.outline(sm, sm.m_rect(fx - 1, fy - 1, 3, 3))
        A.stext(ui, 62, 78, "Round 1", 36, C("teal", 3))
        if f < combine:
            n = sum(1 for d in drops if f >= d + 7)
            m = sm.m_ellipse(cx, cy, 9, 9)
            A.outline(sm, m); sm.put(m, C("night", 1))
            if n:
                sm.put(m & (np.arange(A.SH)[:, None] > cy + 9 - round(18 * n / 10)), C("gold", 2))
            A.stext(ui, 160, 116, "第一轮的 10 枚利息，各分出 10%", 36, C("paper", 2), center=True)
        else:
            A.rays(sm, cx, cy, f, n=12, r0=14, r1=52, step=2)
            A.coin(sm, cx, cy, (f // 2) % 4, r=10, glow=True)
            A.stext(ui, cx, cy - 7, "1", 36, C("ink", 0), center=True)
            A.stext(ui, 160, 112, "10 × 10% = 1", 48, C("gold", 3), center=True)
    else:
        judges(sm, f, ui, "!")
        A.stext(ui, 160, 4, "10 × 10% = 1", 36, C("gold", 3), center=True)
    sm.a[sm.a == T] = C("ink", 0)
    A.up2(sm, cv)
    return DEFAULT_MAP
