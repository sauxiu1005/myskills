"""S2（参考画风·蓝天街机舞台）：三块 ? 块各弹 1 枚（每轮加同样一份）→ 硬切：? 块金字塔连锁，
主角顶第一块，金币向上撞出下一层 1→2→4→8，最后金币雨落进两侧，主角跳起庆祝（收益再生收益）。"""
import math
from engine.canvas import C, T
from engine import arcade as A
from engine.motion import lerp

DEFAULT_MAP = "街机"
GY = 148
CUT = None
ROWS = [[(152, 92)], [(124, 62), (180, 62)], [(96, 32), (138, 32), (166, 32), (208, 32)]]


def iris(Q):
    return 320, 150, 6


def draw(f, Q, cv, ui):
    sm = A.new()
    A.stage(sm, f, GY)
    cut = Q.start("s2-snowball")
    if f < cut:
        b0, D = Q.start("s2-bricks"), Q.dur("s2-bricks")
        A.hero(sm, 54, GY, 56, face=1, expr="calm", blink=(f % 37) in (0, 1))
        for k in range(3):
            hb = b0 + round(D * k / 3)
            x = 110 + k * 42
            th = f - hb if f >= hb else None
            A.qblock(sm, x, 70, t_hit=th, used=f >= hb)
            if f >= hb:
                u = min(1.0, (f - hb) / 5)
                A.coin(sm, x + 8, round(66 - 18 * u), (f - hb) // 2, r=4)
                A.stext(ui, x + 8, 30, "+1", 36, C("snow", 4), center=True)
        A.stext(ui, 160, 4, "每轮加同样一份", 36, C("gold", 3), center=True)
    else:
        bump = Q.start("s2-snowball") + 8
        hits = [bump, Q.start("s2-wrap"), Q.start("s2-wrap") + 12]
        rain0 = hits[2] + 6
        jump2 = Q.end("s2-wrap") - 14
        dy, cr, air = A.jump_curve(f, [bump, jump2], h=20 if f < jump2 - 12 else 28)
        A.hero(sm, 160, GY - dy, 56, crouch=cr, face=0, expr="smile" if f > rain0 else ("wide" if air else "calm"),
               rhand=(0.06, -0.42) if air else None, lhand=(-0.06, -0.42) if (air and f > rain0) else None)
        for r, row in enumerate(ROWS):
            for (x, y) in row:
                th = f - hits[r] if f >= hits[r] else None
                A.qblock(sm, x, y, t_hit=th, used=f >= hits[r])
        # 层间飞行金币：第 r 层每块弹出 2 枚，斜向上撞下一层
        for r in range(2):
            if hits[r] <= f < hits[r + 1]:
                u = (f - hits[r]) / (hits[r + 1] - hits[r])
                for (x, y) in ROWS[r]:
                    for side in (-1, 1):
                        tx, ty = [p for p in ROWS[r + 1] if (p[0] - x) * side > 0][0 if side > 0 else -1]
                        A.coin(sm, round(lerp(x + 8, tx + 8, u)), round(lerp(y - 4, ty + 20, u) - 6 * math.sin(math.pi * u)), f, r=3)
        # 第三层：8 枚金币雨落到两侧
        n_land = 0
        for k in range(8):
            l0 = hits[2] + 1 + k
            u = (f - l0) / 12
            if 0 <= u < 1:
                x0 = ROWS[2][k // 2][0] + 8
                tx = 40 + k * 8 if k < 4 else 220 + (k - 4) * 12
                A.coin(sm, round(lerp(x0, tx, u)), round(28 - 30 * math.sin(math.pi * u * 0.6) + (GY - 6 - 28) * u * u), f + k, r=3)
            elif u >= 1:
                n_land += 1
        for k in range(n_land):
            tx = 40 + k * 8 if k < 4 else 220 + (k - 4) * 12
            A.coin(sm, tx, GY - 5, 0, r=3)
        # 每层倍数
        for r, (txt, yy) in enumerate((("×1", 96), ("×2", 66), ("×4", 36))):
            if f >= hits[r]:
                A.stext(ui, 236 if r else 182, yy - 2, txt, 48, C("gold", 2))
        if n_land:
            A.stext(ui, 262, 108, "×8", 48, C("gold", 2))
        A.stext(ui, 160, 4, "上一轮也滚进来", 36, C("snow", 4), center=True)
    sm.a[sm.a == T] = C("ink", 0)
    A.up2(sm, cv)
    return DEFAULT_MAP
