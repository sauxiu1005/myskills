"""S5（参考画风）：深夜书桌，台灯亮起，主角抱吉他练习，顶部 XP 条随拨弦增长、5 颗星逐个点亮（习惯）
→ “类比”横幅弹入 → 硬切蓝天舞台：不规则砖柱台阶（平台期、回落、跳升），主角逐柱跳上；虚线“固定%”被红叉划掉。"""
import math
from engine.canvas import C, T
from engine import arcade as A
from engine.motion import lerp

DEFAULT_MAP = "街机"
G = 150
COLS = [0, 10, 12, 12, 6, 6, 30, 44]          # 真实成长：平台、回落、跳升


def star(sm, x, y, on):
    pat = ["00100", "01110", "11111", "01110", "01010"]
    for j, r in enumerate(pat):
        for i, ch in enumerate(r):
            if ch == "1":
                sm.rect(x + i * 2 - 5, y + j * 2, 2, 2, C("gold", 2) if on else C("night", 2))
    if on:
        sm.rect(x - 1, y + 2, 2, 2, C("gold", 3))


def draw(f, Q, cv, ui):
    sm = A.new()
    cut = Q.start("s5-curve")
    if f < cut:
        lit = f >= Q.start("s5-lamp") + 2
        A.desk_room(sm, f, lamp=lit)
        playing = f >= Q.start("s5-skill")
        ph = (f // 3) % 2
        def gt(sp, hx, hy):
            A.guitar(sp, hx - 2, hy + 2, 1.2, ang=-2.6)
        A.hero(sm, 112, G, 74, face=0, expr="smile" if playing and f > Q.start("s5-habit") else "calm",
               rhand=(0.14, 0.12 + (0.05 if ph and playing else 0)), lhand=(-0.2, 0.0), litems=gt if playing else None,
               ritems=gt if not playing else None, blink=(f % 40) in (0, 1), nod=ph if playing else 0)
        if playing:
            for k in range(3):
                t = (f - Q.start("s5-skill") - k * 4) % 12
                sm.rect(130 + t * 2, 96 - t * 2 - k * 4, 2, 3, C("teal", 3)); sm.rect(132 + t * 2, 93 - t * 2 - k * 4, 1, 4, C("teal", 3))
        # HUD：XP 条 + 习惯星
        xp = 0.0
        if playing:
            xp = min(1.0, (f - Q.start("s5-skill")) / 40)
        A.stext(ui, 8, 7, "XP", 27, C("teal", 3))
        A.bar(sm, 24, 9, 120, 5, xp, C("teal", 2))
        hb = Q.start("s5-habit")
        nst = 0 if f < hb else min(5, 1 + int((f - hb) / max(1, Q.dur("s5-habit")) * 5))
        for k in range(5):
            star(sm, 168 + k * 14, 6, k < nst)
        if f >= Q.start("s5-analogy"):
            box = A.banner_box(sm, 160, 44, 80, 20, f - Q.start("s5-analogy"))
            if box and A.pop(f - Q.start("s5-analogy")) >= 0.9:
                A.stext(ui, 160, 38, "类比", 36, C("gold", 3), center=True)
    else:
        t = f - cut
        A.stage(sm, f, G)
        xs = [24 + i * 38 for i in range(len(COLS))]
        # 虚线“固定%”（等比直线式期待）
        for k in range(0, 270, 6):
            y = G - 4 - round(k * 0.2)
            sm.rect(xs[0] + k, y, 3, 1, C("snow", 4))
        for x, h in zip(xs, COLS):
            if h:
                A.brick_row(sm, G - h, G, x - 12, x + 12)
                A.outline(sm, sm.m_rect(x - 12, G - h, 24, h))
                sm.rect(x - 12, G - h, 24, 2, C("green", 1))
        A.stext(ui, 232, 74, "固定%", 36, C("snow", 4))
        if t >= 12:
            u = min(1.0, (t - 12) / 4)
            sm.line([(226, 72), (226 + round(44 * u), 94)], C("red", 1), 3)
            sm.line([(226, 94), (226 + round(44 * u), 72)], C("red", 1), 3)
        # 逐柱跳
        hop = 5
        i = min(len(COLS) - 1, t // hop)
        u = (t % hop) / hop if t // hop < len(COLS) - 1 else 0
        j = min(len(COLS) - 1, i + 1)
        x = lerp(xs[i], xs[j], u) if u else xs[i]
        base = lerp(G - COLS[i], G - COLS[j], u) if u else G - COLS[i]
        arc = 10 * math.sin(math.pi * u) if u else 0
        cr = 0.6 if (u == 0 and t % hop == 0 and t > 0) else 0.0
        A.hero(sm, round(x), round(base - arc), 46, crouch=cr, face=1,
               expr="wide" if j in (4, 5) and u else "smile", rhand=(0.1, -0.4) if u else None)
        if t >= 18:
            A.stext(ui, 160, 4, "真实：有平台、有回落", 36, C("gold", 3), center=True)
    sm.a[sm.a == T] = C("ink", 0)
    A.up2(sm, cv)
    return DEFAULT_MAP
