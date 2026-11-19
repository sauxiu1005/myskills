"""S1（参考画风）：深夜书桌房间，主角掏出钱包——只掉出 1 枚币，弹两下，耸肩（HUD ×1）
→ 硬切特写：高举沙漏，青色点阵放射束旋转；顶部两条状态条：金币条很短，时间条满格。"""
import math
from engine.canvas import C, T
from engine import arcade as A

DEFAULT_MAP = "街机"
G = 150


def wallet(sp, hx, hy):
    x, y = round(hx), round(hy)
    sp.rect(x - 6, y - 4, 12, 8, C("ink", 0)); sp.rect(x - 5, y - 3, 10, 6, C("wood", 2)); sp.rect(x - 5, y - 3, 10, 1, C("wood", 3))
    sp.rect(x + 2, y - 1, 3, 2, C("gold", 1))


def draw(f, Q, cv, ui):
    sm = A.new()
    tm = Q.start("s1-time")
    if f < tm:
        A.desk_room(sm, f)
        wal = Q.start("s1-wallet")
        t = f - wal
        drop0 = wal + 5
        expr, lh, rh, it = "calm", None, None, None
        if t >= 0:
            lh, it = (0.12, 0.04), wallet
            expr = "wide" if t < 10 else "wry"
        if t >= 16:
            lh, rh, it = (-0.32, 0.02), (0.32, 0.02), None
        A.hero(sm, 120, G, 76, face=0, expr=expr, rhand=lh, lhand=rh, ritems=it, blink=(f % 40) in (0, 1),
               breath=1 if (f // 12) % 2 else 0, nod=1 if t >= 16 else 0)
        if f >= drop0:
            u = f - drop0
            cx = 136 + min(u, 14)
            if u < 6:
                y = 108 + (G - 4 - 108) * (u / 6) ** 2
            elif u < 12:
                y = G - 4 - 9 * math.sin(math.pi * (u - 6) / 6)
            elif u < 16:
                y = G - 4 - 3 * math.sin(math.pi * (u - 12) / 4)
            else:
                y = G - 4
            A.coin(sm, cx, round(y), u // 2 if u < 16 else 0, r=4)
            if u >= 6:
                A.coin(sm, 12, 12, 0, r=4)
                A.stext(ui, 20, 6, "×1", 36)
        if t >= 16:   # 汗滴
            sm.rect(140, 70 + (t - 16) // 3 % 4, 2, 3, C("teal", 3))
    else:
        t = f - tm
        A.bands(sm, 0, A.SH, [C("ink", 0), C("night", 0), C("sky", 0), C("night", 0)])
        A.rays(sm, 196, 50, f, n=12, r0=20, step=2, cols=[C("teal", 2), C("teal", 3), C("snow", 4)])
        def hg(sp, hx, hy):
            A.hourglass(sp, hx, hy - 10, 1.4, f)
        rise = min(1.0, t / 5)
        A.hero(sm, 150, 196, 132, face=0, expr="smile" if t > 6 else "wide",
               rhand=(0.06 + 0.1 * rise, 0.1 - 0.5 * rise), ritems=hg, lhand=(-0.12, 0.2))
        # 顶部状态条：金币短、时间满
        A.coin(sm, 14, 14, (f // 4) % 4, r=4)
        A.bar(sm, 24, 11, 90, 6, 0.06, C("red", 1))
        A.hourglass(sm, 14, 30, 0.8, f)
        A.bar(sm, 24, 27, 90, 6, min(1.0, t / 12), C("teal", 2))
        if t >= 12 and (t // 3) % 2 == 0:
            sm.rect(110, 26, 4, 8, C("snow", 4))
    sm.a[sm.a == T] = C("ink", 0)
    A.up2(sm, cv)
    return DEFAULT_MAP
