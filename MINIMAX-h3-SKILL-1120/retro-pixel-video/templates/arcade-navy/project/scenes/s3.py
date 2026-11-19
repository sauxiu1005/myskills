"""S3（参考画风）：A 中景·100 枚币与假设卡 → B 横向特写·速度线扫过+镜片闪光 → C 蓝天街机舞台：
跳起顶 ? 块，金币连锁分落单利/复利两堆，计数 100→110→120 / 121（第 11 枚从复利堆自己跳出、发光）
→ D 举起发光币，金黄点阵放射束步进旋转，蓝色横幅弹入。镜头间硬切，机位静止（参考语法）。"""
import math
import numpy as np
from engine.canvas import C, T
from engine import arcade as A
from engine.motion import ease_out, lerp

DEFAULT_MAP = "街机"
GY = 148                     # 舞台地面（小画布）
BLK = (152, 58)              # ? 块左上
PL, PR = 62, 258             # 单利堆 / 复利堆 x
FLIGHT = 8
CUT_B, CUT_C, CUT_D = 256, 272, 346


def hit_frames(Q, eid, n, frac=0.8, cap=None):
    D = Q.dur(eid) if cap is None else min(Q.dur(eid), cap)
    return [Q.start(eid) + round(D * frac * k / n) for k in range(n)]


def coin_drops(Q):
    """(落定帧, 堆 'L'/'R', 是否发光, 轮次)。与音效混音同一公式。"""
    out = []
    for r, eid in enumerate(("s3-s110", "s3-s120")):
        out += [(hf, "L", False, r) for hf in hit_frames(Q, eid, 10)]
    out += [(hf, "R", False, 0) for hf in hit_frames(Q, "s3-c110", 10)]
    out += [(hf, "R", k == 10, 1) for k, hf in enumerate(hit_frames(Q, "s3-c121", 11, frac=0.9, cap=12))]
    return out


def glow_hit(Q):
    return [d[0] for d in coin_drops(Q) if d[2]][0]


def bump_frames(Q):
    return [Q.start("s3-c110") - FLIGHT, Q.start("s3-c121") - FLIGHT]


def glow_pos(Q):
    return PR * 2, (GY - 10) * 2


def iris(Q):
    x, y = glow_pos(Q)
    return x, y, 6


def pile(sm, x, base, n, gold=False):
    h = 5 + round((n - 100) * 0.25) + 6
    w = 22 + round((n - 100) * 0.3)
    m = sm.m_ellipse(x, base, w // 2, h) & (np.arange(A.SH)[:, None] <= base)
    A.outline(sm, m)
    sm.put(m, C("gold", 1))
    for j in range(0, h, 3):                     # 币沿横纹
        y = base - j
        hw = int((w // 2) * math.sqrt(max(0, 1 - (j / max(1, h)) ** 2)))
        for xx in range(x - hw + 1 + (j // 3) % 2 * 2, x + hw - 1, 4):
            sm.rect(xx, y - 1, 2, 1, C("gold", 2))
            sm.px(xx, y - 2, C("gold", 3))
    sm.rect(x - 3, base - h + 1, 6, 1, C("gold", 3))


# ---------------- A：中景 · 100 枚币 ----------------
def shot_a(f, Q, sm, ui):
    A.navy_bg(sm, f, y_floor=124)
    pile(sm, 196, 150, 100)
    t = Q.t(f, "s3-card1")
    point = t >= 0
    br = 1 if (f // 12) % 2 else 0
    A.hero(sm, 120, 150, 74, face=1, expr="calm", breath=br, blink=(f % 40) in (0, 1),
           rhand=(0.16, 0.02) if point else None, look=(1, 0))
    for k, (eid, key) in enumerate((("s3-card1", "假设：本金 100 单位"), ("s3-card2", "每轮 +10%"), ("s3-card3", "不追加投入"))):
        tt = Q.t(f, eid)
        s = A.pop(tt, dur=3)
        if s is None:
            continue
        y = 12 + k * 17
        w = ui.text_size(key if False else __import__("engine.ui", fromlist=["tr"]).tr(key), 27)[0] // ui.s // 2 + 10
        A.panel(sm, 316 - 4 - round(w * min(1, s)), y, round(w * min(1, s)), 13)
        if s >= 1:
            ui.text((316 - 4 - w + 5) * 2 * ui.s, (y + 2) * 2 * ui.s, key, 27, C("gold", 3) if k == 1 else C("paper", 2), shadow=C("ink", 0))
    if f >= Q.start("s3-card1"):
        A.coin(sm, 182, 120, (f // 3) % 4, r=4)
        ui.text(190 * 2 * ui.s, 115 * 2 * ui.s, "×100", 36, C("paper", 2), shadow=C("ink", 0))


# ---------------- B：横向特写 · 速度线 + 镜片闪光 ----------------
def shot_b(f, Q, sm, ui):
    t = f - CUT_B
    A.bands(sm, 0, A.SH, [C("ink", 0), C("night", 0), C("ink", 0)])
    A.speed_lines(sm, f, 0, A.SH, n=40, sp=22, seed=3)
    x = 150 + max(0, 8 - t * 2)                  # 头像冲入后停住
    g = (t - 4) / 6 if 4 <= t <= 10 else None
    A.A_hero_close = None
    from engine.character import draw_zhou
    draw_zhou(sm, x, 200, 190, mode="stand", face=1, expr="calm" if t < 11 else "smile", glasses=True, glint=g, look=(1, 0))
    A.speed_lines(sm, f + 7, 0, A.SH, n=10, sp=26, cols=[C("snow", 4), C("teal", 3)], seed=9)
    sm.rect(0, 0, A.SW, 14, C("ink", 0)); sm.rect(0, A.SH - 14, A.SW, 14, C("ink", 0))     # 横向遮幅


# ---------------- C：蓝天街机舞台 ----------------
def hero_jump(f, Q):
    """返回 (dy 上升像素, crouch, 举手)。蓄力 3 帧 → 上升 8 帧到顶（顶块）→ 下落 6 帧 → 落地压缩 2 帧。"""
    for hb in bump_frames(Q):
        t = f - hb
        if -11 <= t < -8:
            return 0, 0.5 + 0.2 * (t + 11), False
        if -8 <= t <= 0:
            u = (t + 8) / 8
            return round(24 * (1 - (1 - u) ** 2)), 0.0, True
        if 0 < t <= 6:
            u = t / 6
            return round(24 * (1 - u * u)), 0.0, True
        if 6 < t <= 9:
            return 0, [0.9, 0.6, 0.25][t - 7], False
    return 0, 0.0, False


def coin_xy(d, f, Q):
    """发射：从 ? 块顶部弹出，抛物线落到对应堆顶。发光币从复利堆自己跳出再落回。"""
    land, side, glow, r = d
    t0 = land - FLIGHT
    u = (f - t0) / FLIGHT
    tx = PL if side == "L" else PR
    if glow:
        sx, sy, top = PR, GY - 16, 52
    else:
        sx, sy, top = BLK[0] + 8, BLK[1] - 4, 26
    x = lerp(sx, tx + ((hash((land, side)) % 9) - 4), u)
    y0 = lerp(sy, GY - 12, u)
    y = y0 - top * 4 * u * (1 - u) - (0 if glow else 8 * (1 - u))
    return round(x), round(y)


def shot_c(f, Q, sm, ui):
    A.arcade_sky(sm, GY)
    A.cloud(sm, 60, 28, 34); A.cloud(sm, 230, 20, 28); A.cloud(sm, 300, 44, 22)
    A.hill(sm, 30, GY, 70, 26); A.hill(sm, 210, GY, 110, 34)
    A.brick_row(sm, GY, A.SH)
    sm.rect(0, GY, A.SW, 1, C("ink", 0)); sm.rect(0, GY + 1, A.SW, 1, C("green", 1))
    drops = coin_drops(Q)
    nL = 100 + sum(1 for d in drops if d[1] == "L" and f >= d[0])
    nR = 100 + sum(1 for d in drops if d[1] == "R" and f >= d[0])
    pile(sm, PL, GY, nL)
    pile(sm, PR, GY, nR)
    gh = glow_hit(Q)
    if f >= gh:
        A.coin(sm, PR, GY - 9 - round((nR - 100) * 0.25), (f // 2) % 4, r=4, glow=True)
    # ? 块
    th = None
    for hb in bump_frames(Q):
        if 0 <= f - hb < 6:
            th = f - hb
    A.qblock(sm, BLK[0], BLK[1], t_hit=th)
    # 主角
    dy, cr, up = hero_jump(f, Q)
    A.hero(sm, 160, GY - dy, 56, crouch=cr, face=0, expr="smile" if f >= gh else ("wide" if up else "calm"),
           rhand=(0.06, -0.42) if up else None, lhand=(-0.2, 0.05) if up else None, blink=(f % 37) in (0, 1))
    # 飞行中的金币（链）
    for d in drops:
        if d[0] - FLIGHT <= f < d[0]:
            x, y = coin_xy(d, f, Q)
            A.coin(sm, x, y, f + d[0], r=4 if d[2] else 3, glow=d[2])
    # 每堆落定时的小跳字
    for eid, x, txt, col in (("s3-s110", PL, "+10", C("snow", 4)), ("s3-c110", PR, "+10", C("snow", 4)),
                             ("s3-s120", PL, "+10", C("snow", 4)), ("s3-c121", PR, "+11", C("gold", 3))):
        t = f - (Q.start(eid) + (10 if eid == "s3-c121" else 9))
        if 0 <= t < 14 and f < CUT_D:
            A.num_text(ui, x * 2, (GY - 46) * 2 - min(t, 6) * 2, txt, col, size=36)
    # HUD 计数器（参考：金币图标 + ×N，白字墨影；复利为金色）
    A.coin(sm, 12, 12, (f // 4) % 4, r=4)
    A.coin(sm, 196, 12, (f // 4) % 4, r=4, glow=f >= gh)
    from engine.ui import tr
    ui.text(20 * 2 * ui.s, 6 * 2 * ui.s, tr("单利") + " ×%d" % nL, 36, C("paper", 2), shadow=C("ink", 0))
    ui.text(204 * 2 * ui.s, 6 * 2 * ui.s, tr("复利") + " ×%d" % nR, 36, C("gold", 3) if f >= gh else C("paper", 2), shadow=C("ink", 0))
    A.num_text(ui, 320, 50, "+10%", C("gold", 3), size=27)
    if f >= gh:
        A.num_text(ui, PR * 2, (GY - 40) * 2 - 30, "121", C("gold", 3), size=48)


# ---------------- D：奖励特写 · 放射束 + 横幅 ----------------
def shot_d(f, Q, sm, ui):
    t = f - CUT_D
    A.bands(sm, 0, A.SH, [C("ink", 0), C("night", 0), C("sky", 0), C("night", 0)])
    A.rays(sm, 160, 64, f, n=12, r0=22, step=2)
    def held(sp, hx, hy):
        A.coin(sp, round(hx), round(hy) - 9, (t // 2) % 4, r=7, glow=True)
    hop = [0, 3, 5, 4, 2, 0][t] if 0 <= t < 6 else 0
    A.hero(sm, 160, 196 - hop, 128, face=0, expr="smile", rhand=(0.1, -0.36), lhand=(-0.1, -0.36), ritems=held)
    box = A.banner_box(sm, 160, 22, 150, 22, t - 4)
    if box is not None and A.pop(t - 4) >= 0.9:
        from engine.ui import tr
        A.num_text(ui, 320, 34, tr("复利") + " ×121", C("gold", 3), size=48)
    if t >= 8:
        A.num_text(ui, 380, 52 * 2 - min(t - 8, 6) * 2, "+1", C("gold", 3), size=48)
    A.speed_lines(sm, f, 150, 170, n=0)


def draw(f, Q, cv, ui):
    sm = A.new()
    if f < CUT_B:
        shot_a(f, Q, sm, ui)
    elif f < CUT_C:
        shot_b(f, Q, sm, ui)
    elif f < CUT_D:
        shot_c(f, Q, sm, ui)
    else:
        shot_d(f, Q, sm, ui)
    sm.a[sm.a == T] = C("ink", 0)
    A.up2(sm, cv)
    return DEFAULT_MAP
