"""S7（参考画风）：角色选择卡（吉他/代码/画画/跑步），光标只选吉他 → 4 周格逐个点亮 → 蓝天舞台：
Practice / Review / Next 三块 ? 块依次顶出金币、计数 +1 → 群像观众举手、爱心逐个出现 → 收尾跳起顶块 + 标题横幅。"""
import math
from engine.canvas import C, T
from engine import arcade as A
from engine.motion import lerp, ease_in_out

DEFAULT_MAP = "街机"
G = 148
CARDS = [(40, "guitar"), (118, "code"), (196, "draw"), (274, "run")]
BLOCKS = [(70, "练习"), (152, "复盘"), (234, "下一次")]


def icon(sm, x, y, kind, dim):
    if kind == "guitar":
        A.guitar(sm, x - 3, y + 4, 1.4, ang=-0.9)
    elif kind == "code":
        sm.rect(x - 12, y - 8, 24, 16, C("ink", 0)); sm.rect(x - 11, y - 7, 22, 13, C("teal", 0))
        for k in range(3):
            sm.rect(x - 9, y - 5 + k * 4, 6 + k * 4, 1, C("green", 2))
    elif kind == "draw":
        sm.rect(x - 10, y - 9, 18, 18, C("ink", 0)); sm.rect(x - 9, y - 8, 16, 16, C("paper", 2))
        sm.line([(x - 6, y + 4), (x + 4, y - 5)], C("red", 1), 2)
    else:
        m = sm.m_poly([(x - 10, y + 4), (x - 4, y - 4), (x + 4, y - 4), (x + 12, y + 2), (x + 12, y + 6), (x - 10, y + 6)])
        A.outline(sm, m); sm.put(m, C("red", 1)); sm.rect(x - 10, y + 5, 22, 2, C("snow", 4))
    if dim:
        reg = sm.m_rect(x - 16, y - 14, 32, 28)
        sm.put(reg & (sm.a != T) & (sm.a != C("night", 1)), C("night", 2))


def draw(f, Q, cv, ui):
    sm = A.new()
    pick = Q.start("s7-pick")
    wk0 = Q.start("s7-weekly")
    rv = Q.start("s7-review")
    crowd0 = Q.start("music-end")
    final0 = crowd0 + 24
    if f < wk0:
        A.navy_bg(sm, f, y_floor=150)
        sel = pick + 4
        cur = 3 - min(3, max(0, (f - Q.start("s7-shelf")) // 4)) if f < sel else 0
        for i, (x, kind) in enumerate(CARDS):
            chosen = f >= sel and i == 0
            dim = f >= sel and i != 0
            A.panel(sm, x - 24, 42, 48, 66, fill=C("night", 1), border=C("gold", 2) if chosen else C("night", 3))
            pop = 4 if chosen and f - sel < 4 else 0
            icon(sm, x, 70 - pop, kind, dim)
            if i == cur and f < sel and (f // 2) % 2 == 0:
                sm.rect(x - 28, 38, 56, 2, C("gold", 3)); sm.rect(x - 28, 110, 56, 2, C("gold", 3))
                sm.rect(x - 28, 38, 2, 74, C("gold", 3)); sm.rect(x + 26, 38, 2, 74, C("gold", 3))
                sm.poly([(x - 4, 116), (x + 4, 116), (x, 112)], C("gold", 3))
        if f >= sel:
            A.rays(sm, CARDS[0][0], 75, f, n=10, r0=36, r1=70, step=2, dot=1)
            A.panel(sm, CARDS[0][0] - 24, 42, 48, 66, fill=C("night", 1), border=C("gold", 2))
            icon(sm, CARDS[0][0], 70 - (4 if f - sel < 4 else 0), "guitar", False)
            A.stext(ui, CARDS[0][0], 92, "×1", 27, C("gold", 3), center=True)
        A.stext(ui, 160, 10, "只选一项", 36, C("gold", 3), center=True)
    elif f < rv:
        A.desk_room(sm, f, lamp=True, monitor=False)
        ph = (f // 3) % 2
        def gt(sp, hx, hy):
            A.guitar(sp, hx - 2, hy + 2, 1.2, ang=-2.6)
        A.hero(sm, 112, 150, 74, face=0, expr="smile", rhand=(0.14, 0.12 + 0.05 * ph), lhand=(-0.2, 0.0), litems=gt, nod=ph)
        n = min(4, 1 + int(Q.p(f, "s7-weekly", frac=0.85) * 4))
        for k in range(4):
            x = 180 + k * 30
            A.panel(sm, x, 96, 24, 22, fill=C("night", 1), border=C("gold", 2) if k < n else C("night", 3))
            A.stext(ui, x + 12, 99, "W%d" % (k + 1), 27, C("gold", 3) if k < n else C("night", 3), center=True)
            if k < n:
                sm.rect(x + 8, 110, 8, 4, C("lamp", 1))
        A.stext(ui, 220, 76, "每周 1 次", 36, C("gold", 3), center=True)
    elif f < crowd0:
        A.stage(sm, f, G)
        bumps = [rv + 12, rv + 30, rv + 48]
        # 位置：在三块之间走/跳
        xs = [b[0] + 8 for b in BLOCKS]
        x = xs[0]
        for k in range(1, 3):
            a0, a1 = bumps[k - 1] + 7, bumps[k] - 11
            if f >= a1:
                x = xs[k]
            elif f > a0:
                x = lerp(xs[k - 1], xs[k], ease_in_out((f - a0) / (a1 - a0)))
        walking = any(bumps[k - 1] + 7 < f < bumps[k] - 11 for k in (1, 2))
        dy, cr, air = A.jump_curve(f, bumps, h=22)
        A.hero(sm, round(x), G - dy, 52, crouch=cr, face=0 if not walking else 1,
               stride=((f // 2) % 6) / 6 if walking else None,
               expr="smile" if not air else "wide", rhand=(0.06, -0.42) if air else None)
        n = 0
        for k, (bx, key) in enumerate(BLOCKS):
            th = f - bumps[k] if f >= bumps[k] else None
            A.qblock(sm, bx, 64, t_hit=th, used=f >= bumps[k])
            act = f >= bumps[k]
            A.stext(ui, bx + 8, 42, key, 36, C("gold", 3) if act else C("snow", 4), center=True)
            if act:
                n += 1
                u = min(1.0, (f - bumps[k]) / 6)
                if u < 1:
                    A.coin(sm, bx + 8, round(60 - 20 * u), f, r=4)
                elif f - bumps[k] < 18:
                    A.stext(ui, bx + 8, 24, "+1", 36, C("gold", 3), center=True)
            if k < 2:
                for xx in range(bx + 20, BLOCKS[k + 1][0] - 4, 4):
                    sm.rect(xx, 71, 2, 1, C("snow", 4))
                sm.poly([(BLOCKS[k + 1][0] - 6, 68), (BLOCKS[k + 1][0] - 2, 71), (BLOCKS[k + 1][0] - 6, 74)], C("snow", 4))
        A.coin(sm, 12, 12, (f // 4) % 4, r=4)
        A.stext(ui, 20, 6, "×%d" % n, 36)
    elif f < final0:
        t = f - crowd0
        A.navy_bg(sm, f, y_floor=124)
        shirts = ["teal", "red", "green", "mustard", "stone", "night"]
        hairs = [("ink", (1, 2)), ("wood", (1, 2)), ("red", (0, 1)), ("wood", (2, 3)), ("snow", (1, 2)), ("mustard", (1, 2))]
        hts = [58, 52, 62, 50, 56, 60]
        for i in range(6):
            x = 30 + i * 52
            on = t >= 2 + i * 3
            A.npc(sm, x, 150, hts[i], shirt=shirts[i], hair=hairs[i][0], hair_steps=hairs[i][1], face=[1, 0, -1, 1, 0, -1][i],
                  glasses=i in (1, 4),
                  expr="smile" if on else "calm", rhand=(0.1, -0.42) if on and i % 2 == 0 else None,
                  lhand=(-0.1, -0.42) if on and i % 2 == 1 else None)
            if on:
                A.heart(sm, x, 52 - min(4, (t - 2 - i * 3)) + ((f // 4 + i) % 2), s=2)
        sm.rect(0, 124, A.SW, 30, C("wood", 1)); sm.rect(0, 124, A.SW, 3, C("wood", 3)); A.outline(sm, sm.m_rect(0, 124, A.SW, 30))
    else:
        t = f - final0
        A.stage(sm, f, G)
        bump = final0 + 11
        dy, cr, air = A.jump_curve(f, [bump, bump + 16], h=24)
        A.qblock(sm, 152, 66, t_hit=f - bump if f >= bump else None, used=f >= bump)
        A.hero(sm, 160, G - dy, 54, crouch=cr, face=0, expr="smile", rhand=(0.06, -0.42) if air else None,
               lhand=(-0.06, -0.42) if air and f > bump + 6 else None)
        if f >= bump:
            u = min(1.0, (f - bump) / 6)
            A.coin(sm, 160, round(62 - 22 * u), f, r=5, glow=True)
            A.stext(ui, 186, 30, "+1", 36, C("gold", 3))
        box = A.banner_box(sm, 160, 24, 210, 26, t - 2)
        if box and A.pop(t - 2) >= 0.9:
            A.stext(ui, 160, 16, "年轻人的复利", 36, C("gold", 3), center=True)
        A.stext(ui, 160, 154, "数学例子为假设，非投资建议", 36, C("snow", 4), center=True)
    sm.a[sm.a == T] = C("ink", 0)
    A.up2(sm, cv)
    return DEFAULT_MAP
