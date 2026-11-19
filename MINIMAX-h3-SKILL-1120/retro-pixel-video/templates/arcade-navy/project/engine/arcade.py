"""参考画风套件（深海军蓝/靛紫底 + 金黄/青蓝/朱红强调 + 粗暗轮廓 + 干净像素簇）。
全部画在 320x180 小画布上，场景最后 up2() 2× 最近邻放大到 640x360（输出 1080p 时 1 像素 = 6px）。"""
import math
import numpy as np
from .canvas import C, Canvas, T, BAYER4, dilate4
from .character import draw_zhou, crouch_drop

SW, SH = 320, 180


def new():
    return Canvas(SW, SH, T)


def up2(sm, cv):
    cv.a[:] = np.repeat(np.repeat(sm.a, 2, 0), 2, 1)


def hsh(*a):
    h = 2166136261
    for v in a:
        h = ((h ^ (int(v) & 0xFFFFFFFF)) * 16777619) & 0xFFFFFFFF
    return h


def bands(sm, y0, y1, cols, dither=3):
    """竖向分阶底色，阶间 Bayer 抖色 dither 行。"""
    n = len(cols)
    H = y1 - y0
    thr = np.tile(BAYER4, (SH // 4 + 1, SW // 4 + 1))[:SH, :SW]
    for y in range(y0, y1):
        t = (y - y0) / max(1, H) * n
        i = min(n - 1, int(t))
        fr = t - i
        row = np.full(SW, cols[i], np.uint8)
        if i + 1 < n and fr > 1 - dither / max(1, H / n):
            k = (fr - (1 - dither / (H / n))) / (dither / (H / n))
            row = np.where(thr[y] < k, cols[i + 1], cols[i])
        sm.a[y, :] = row


def navy_bg(sm, f, grid=True, dots=True, y_floor=120):
    """参考 10–14 秒：近黑海军蓝底，上部斜向点阵（靛紫），下部透视网格地面（洋红/靛紫）。"""
    bands(sm, 0, y_floor, [C("ink", 0), C("night", 0), C("night", 1)])
    if dots:
        for y in range(3, y_floor - 4, 4):
            for x in range(((y // 4) % 2) * 2 + (f // 3) % 4, SW, 4):
                if (x - y) % 16 < 8:
                    sm.px(x, y, C("sky", 0))
    if grid:
        sm.rect(0, y_floor, SW, SH - y_floor, C("ink", 0))
        sm.rect(0, y_floor, SW, 1, C("sky", 1))
        cx = SW // 2
        for k in range(-12, 13):
            x1 = cx + k * 34
            sm.line([(cx + k * 6, y_floor), (x1, SH)], C("sky", 0))
        y, g = y_floor + 3, 3
        sh = (f % 6) / 6
        while y < SH:
            sm.rect(0, round(y + sh * g), SW, 1, C("sky", 0))
            g *= 1.45
            y += g


def speed_lines(sm, f, y0, y1, n=26, sp=14, cols=None, seed=1):
    cols = cols or [C("night", 2), C("teal", 1), C("night", 3), C("snow", 4)]
    for i in range(n):
        h = hsh(i, seed)
        y = y0 + h % max(1, y1 - y0)
        L = 10 + (h >> 8) % 40
        x = SW + 60 - ((h >> 16) % 400 + f * (sp + (h >> 4) % 6)) % (SW + 120)
        col = cols[(h >> 20) % len(cols)]
        sm.rect(x, y, L, 1, col)


def rays(sm, cx, cy, f, n=12, r0=14, r1=260, step=2, cols=None, dot=2, gap=5):
    """金黄像素点阵放射束：n 条，按 step 帧一档顺时针步进旋转（不平滑），沿束点状。"""
    cols = cols or [C("gold", 2), C("gold", 3), C("mustard", 3)]
    base = (f // step) * (math.pi / n / 3)
    for k in range(n):
        a = base + k * 2 * math.pi / n
        ca, sa = math.cos(a), math.sin(a)
        for j, r in enumerate(range(r0, r1, gap)):
            w = dot + (1 if r > 60 else 0) + (1 if r > 120 else 0)
            for off in ((0,) if r < 40 else (-1, 1) if r < 100 else (-2, 0, 2)):
                x = round(cx + r * ca - off * sa * 2)
                y = round(cy + r * sa + off * ca * 2)
                if (j + k + (f // step)) % 3 == 0:
                    continue
                sm.rect(x - w // 2, y - w // 2, w, w, cols[(j + k) % len(cols)])


def outline(sm, m, col=None, n=1):
    col = C("ink", 0) if col is None else col
    ring = m
    for _ in range(n):
        r = dilate4(ring) & ~ring
        sm.put(r, col)
        ring = ring | r


def panel(sm, x, y, w, h, fill=None, border=None, inner=None):
    """蓝底金边街机框（两层边：外墨线 + 金边 + 内青线）。"""
    fill = C("night", 2) if fill is None else fill
    border = C("gold", 2) if border is None else border
    sm.rect(x - 2, y - 2, w + 4, h + 4, C("ink", 0))
    sm.rect(x - 1, y - 1, w + 2, h + 2, border)
    sm.rect(x, y, w, h, fill)
    sm.rect(x, y, w, 1, inner if inner is not None else C("teal", 2))
    sm.rect(x, y + h - 1, w, 1, C("night", 1))


def pop(t, dur=4, over=0.25):
    """硬弹入：0..dur 帧从 0 冲到 1+over 再回 1。t<0 -> None。"""
    if t < 0:
        return None
    if t >= dur + 2:
        return 1.0
    if t < dur:
        return (t + 1) / dur * (1 + over)
    return 1 + over * (1 - (t - dur + 1) / 2)


def banner_box(sm, cx, cy, w, h, t):
    s = pop(t)
    if s is None:
        return None
    ww, hh = max(4, round(w * s)), max(4, round(h * min(1.0, s)))
    x, y = cx - ww // 2, cy - hh // 2
    panel(sm, x, y, ww, hh, fill=C("night", 2), border=C("gold", 2))
    for k in (x + 3, x + ww - 6):         # 两端铆钉
        sm.rect(k, y + 2, 3, 3, C("gold", 3))
        sm.rect(k, y + hh - 5, 3, 3, C("gold", 3))
    return (x, y, ww, hh)


def coin(sm, x, y, phase=0, r=4, glow=False):
    """4 相旋转金币，粗墨描边。"""
    ph = phase % 4
    w = [r, max(1, r * 2 // 3), 1, max(1, r * 2 // 3)][ph]
    m = sm.m_ellipse(x, y, w, r)
    outline(sm, m)
    sm.put(m, C("gold", 2))
    sm.put(m & (sm.m_ellipse(x - max(1, w // 3), y - r // 3, max(1, w // 2), max(1, r // 2))), C("gold", 3))
    if w >= 2:
        sm.rect(x - max(0, w // 3), y - r // 2, max(1, w * 2 // 3), 1 if r < 5 else 2, C("gold", 1))
        sm.rect(x, y - r // 2 + 1, 1, r - 1, C("gold", 1))
    if glow:
        for k in range(4):
            a = k * math.pi / 2 + phase * 0.4
            sm.px(round(x + (r + 3) * math.cos(a)), round(y + (r + 3) * math.sin(a)), C("gold", 3))


def qblock(sm, x, y, t_hit=None, used=False, s=16):
    dy = 0
    if t_hit is not None and 0 <= t_hit < 6:
        dy = -[3, 4, 3, 2, 1, 0][t_hit]
    y += dy
    sm.rect(x - 1, y - 1, s + 2, s + 2, C("ink", 0))
    sm.rect(x, y, s, s, C("wood", 2) if used else C("gold", 2))
    sm.rect(x, y, s, 1, C("gold", 3) if not used else C("wood", 3))
    sm.rect(x, y + s - 2, s, 2, C("gold", 0) if not used else C("wood", 1))
    for cx, cy in ((x + 2, y + 2), (x + s - 3, y + 2), (x + 2, y + s - 4), (x + s - 3, y + s - 4)):
        sm.px(cx, cy, C("gold", 0) if not used else C("wood", 1))
    if not used:      # 像素问号
        q = ["0110", "1001", "0001", "0010", "0100", "0000", "0100"]
        for j, row in enumerate(q):
            for i, ch in enumerate(row):
                if ch == "1":
                    sm.rect(x + 4 + i * 2, y + 2 + j * 2 - 1, 2, 2, C("snow", 4))
                    sm.px(x + 5 + i * 2, y + 3 + j * 2 - 1, C("gold", 0))
    return y


def brick_row(sm, y0, y1, x0=0, x1=SW):
    sm.rect(x0, y0, x1 - x0, y1 - y0, C("red", 0))
    for y in range(y0, y1, 6):
        off = 0 if (y - y0) // 6 % 2 == 0 else 6
        sm.rect(x0, y, x1 - x0, 1, C("ink", 1))
        for x in range(x0 - 12 + off, x1, 12):
            sm.rect(x, y, 1, 6, C("ink", 1))
            sm.rect(x + 1, y + 1, 10, 1, C("red", 1))


def cloud(sm, x, y, w=30):
    m = sm.m_ellipse(x, y, w // 2, 6) | sm.m_ellipse(x - w // 4, y + 2, w // 4, 5) | sm.m_ellipse(x + w // 4, y + 1, w // 4 + 1, 6) | sm.m_ellipse(x - 2, y - 4, w // 5, 6)
    m &= np.arange(SH)[:, None] <= y + 6
    outline(sm, m)
    sm.put(m, C("snow", 4))
    sm.put(m & ~np.roll(m, -2, 0), C("snow", 2))


def hill(sm, x, base, w, h):
    m = sm.m_ellipse(x, base, w // 2, h) & (np.arange(SH)[:, None] < base)
    outline(sm, m)
    sm.put(m, C("green", 1))
    sm.put(m & (np.arange(SW)[None, :] > x + w // 6), C("green", 0))
    for k in range(3):
        sm.rect(x - w // 5 + k * 5, base - h // 2 + (k % 2) * 3, 1, 3, C("green", 0))


def arcade_sky(sm, y1=150):
    bands(sm, 0, y1, [C("day", 0), C("day", 1), C("teal", 2)], dither=4)
    for y in range(0, y1, 3):         # CRT 扫描线（每 3 行一条暗线，仅天空）
        row = sm.a[y]
        sm.a[y] = np.where(row == C("day", 1), C("day", 0), np.where(row == C("teal", 2), C("day", 1), row))


def heart(sm, x, y, col=None, s=1):
    col = C("red", 1) if col is None else col
    pat = ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"]
    m = np.zeros((SH, SW), bool)
    for j, r in enumerate(pat):
        for i, ch in enumerate(r):
            if ch == "1":
                X, Y = x + (i - 3) * s, y + j * s
                if 0 <= Y < SH - s and 0 <= X < SW - s:
                    m[Y:Y + s, X:X + s] = True
    sm.put(m, col)
    sm.rect(x - 2 * s, y + s, s, s, C("red", 2))
    outline(sm, m)


def hero(sm, x, feet_y, H, crouch=0.0, **kw):
    """legacy 示例人物（复利片的大头眼镜青年）。仅当 cues.json cast 声明 kind=legacy_zhou 时可用，否则报错；
    新主题的主角请在 characters/ 下按文案手画（engine/sprite.py），不要用它当默认角色。"""
    kw.setdefault("glasses", True)
    hip = feet_y - round(H * 0.28) - 1 + crouch_drop(H, crouch)
    return draw_zhou(sm, x, hip, H, mode="stand", crouch=crouch, **kw)


def num_text(ui, x, y, s, col, size=36, shadow=None):
    """输出坐标（640 逻辑）上居中的像素字。"""
    w = ui.text_size(s, size)[0] // ui.s
    ui.text((x - w // 2) * ui.s, y * ui.s, s, size, col, shadow=C("ink", 0) if shadow is None else shadow)


def stext(ui, x, y, txt, size=27, col=None, center=False):
    """小画布坐标 (x,y) 处的像素字（墨影）。"""
    from .ui import tr
    col = C("paper", 2) if col is None else col
    txt = tr(txt)
    X = x * 2
    if center:
        X -= ui.text_size(txt, size)[0] // ui.s // 2
    ui.text(X * ui.s, y * 2 * ui.s, txt, size, col, shadow=C("ink", 0))


def text_w(ui, txt, size=27):
    from .ui import tr
    return ui.text_size(tr(txt), size)[0] // ui.s // 2


_REMAP = {}


def npc(sm, x, feet_y, H, shirt="teal", hair="snow", hair_steps=(2, 3), **kw):
    """legacy 示例人物换装（同一骨架）。同样需要 cast 声明 legacy_zhou；新主题的配角请单独手画。"""
    from .canvas import PAL
    tmp = Canvas(SW, SH + 120, T)
    kw.setdefault("glasses", False)
    hip = feet_y - round(H * 0.28) - 1 + crouch_drop(H, kw.get("crouch", 0.0))
    r = draw_zhou(tmp, x, hip, H, mode="stand", **kw)
    lut = np.arange(256, dtype=np.uint8)
    ms = PAL.ramps["mustard"]; sr = PAL.ramps[shirt]
    for i, idx in enumerate(ms):
        lut[idx] = sr[min(len(sr) - 1, max(0, round(i * (len(sr) - 1) / (len(ms) - 1))))]
    if hair is not None:
        lut[C("ink", 1)] = C(hair, hair_steps[0]); lut[C("ink", 2)] = C(hair, hair_steps[1])
    a = lut[tmp.a[:SH]]
    m = tmp.a[:SH] != T
    sm.a[m] = a[m]
    return r


def hourglass(sp, x, y, s=1.0, t=0):
    x, y = round(x), round(y)
    w, h = round(9 * s), round(14 * s)
    sp.rect(x - w // 2 - 1, y - h // 2 - 2, w + 2, 3, C("wood", 2)); sp.rect(x - w // 2 - 1, y + h // 2 - 1, w + 2, 3, C("wood", 2))
    m = sp.m_poly([(x - w // 2, y - h // 2 + 1), (x + w // 2, y - h // 2 + 1), (x, y), (x + w // 2, y + h // 2 - 1), (x - w // 2, y + h // 2 - 1), (x, y)])
    outline(sp, m)
    sp.put(m, C("snow", 3))
    fill = (t % 24) / 24
    sp.put(m & (np.arange(sp.h)[:, None] > y + (h // 2) * (1 - fill)) , C("gold", 2))
    sp.put(m & (np.arange(sp.h)[:, None] < y) & (np.arange(sp.h)[:, None] > y - (h // 2) * (1 - fill)), C("gold", 2))
    sp.px(x, y + 1, C("gold", 3))


def bar(sm, x, y, w, h, frac, col, back=None):
    sm.rect(x - 1, y - 1, w + 2, h + 2, C("ink", 0))
    sm.rect(x, y, w, h, C("night", 1) if back is None else back)
    fw = round(w * max(0.0, min(1.0, frac)))
    if fw > 0:
        sm.rect(x, y, fw, h, col)
        sm.rect(x, y, fw, 1, C("snow", 4) if h > 2 else col)


def bubble(sm, x, y, ch="?", col=None):
    """白色圆气泡 + 红色问号/感叹号（参考：问号气泡）。"""
    col = C("red", 1) if col is None else col
    m = sm.m_ellipse(x, y, 7, 7)
    m |= sm.m_poly([(x - 2, y + 5), (x + 2, y + 5), (x - 3, y + 10)])
    outline(sm, m)
    sm.put(m, C("snow", 4))
    if ch == "?":
        for (i, j) in ((-2, -4), (-1, -5), (0, -5), (1, -5), (2, -4), (2, -3), (1, -2), (0, -1), (0, 0), (0, 2)):
            sm.rect(x + i, y + j, 1, 1, col)
        sm.rect(x - 1, y - 5, 3, 1, col); sm.rect(x - 1, y + 2, 2, 2, col)
    else:
        sm.rect(x - 1, y - 5, 2, 6, col); sm.rect(x - 1, y + 2, 2, 2, col)


def desk_room(sm, f, lamp=False, monitor=True):
    """参考 grid1：深灰蓝室内 + 暖木书桌 + 城市夜景窗。"""
    bands(sm, 0, 130, [C("ink", 1), C("night", 0), C("night", 1)])
    sm.rect(0, 130, SW, SH - 130, C("wood", 1))
    for y in range(130, SH, 5):
        sm.rect(0, y, SW, 1, C("wood", 0))
    sm.rect(0, 129, SW, 2, C("ink", 0))
    # 窗 + 城市剪影
    sm.rect(196, 20, 96, 64, C("ink", 0)); sm.rect(198, 22, 92, 60, C("night", 0))
    for k in range(9):
        h = hsh(k, 4)
        bx, bw, bh = 198 + k * 11, 9 + h % 4, 16 + (h >> 4) % 30
        sm.rect(bx, 82 - bh, bw, bh, C("night", 2))
        for wy in range(82 - bh + 3, 80, 5):
            for wx in range(bx + 2, bx + bw - 1, 3):
                if (hsh(wx, wy) >> 3) % 4 == 0:
                    sm.px(wx, wy, C("lamp", 1))
    sm.rect(243, 22, 2, 60, C("ink", 0)); sm.rect(198, 50, 92, 2, C("ink", 0))
    sm.rect(196, 84, 96, 3, C("wood", 3))
    # 书桌
    sm.rect(20, 112, 150, 6, C("wood", 3)); sm.rect(20, 112, 150, 1, C("wood", 4)); sm.rect(20, 118, 150, 2, C("wood", 0))
    sm.rect(26, 120, 5, 12, C("wood", 1)); sm.rect(160, 120, 5, 12, C("wood", 1))
    if monitor:
        sm.rect(40, 80, 44, 30, C("ink", 0)); sm.rect(42, 82, 40, 25, C("teal", 0) if not lamp else C("teal", 1))
        for k in range(5):
            sm.rect(45, 85 + k * 4, 8 + (hsh(k, f // 6) % 24), 1, C("teal", 3) if k % 2 else C("green", 2))
        sm.rect(58, 110, 8, 2, C("stone", 1))
    # 台灯
    sm.rect(140, 96, 2, 16, C("stone", 1)); sm.rect(132, 92, 16, 6, C("red", 1)); sm.rect(132, 92, 16, 1, C("red", 2))
    if lamp:
        sm.rect(135, 98, 10, 2, C("lamp", 1))
        m = sm.m_poly([(134, 100), (146, 100), (162, 112), (118, 112)])
        sm.put(m & (sm.a == C("night", 1)), C("night", 3))


def guitar(sp, hx, hy, s=1.0, ang=-0.5):
    x, y = round(hx), round(hy)
    m = sp.m_ellipse(x, y + round(3 * s), round(6 * s), round(5 * s)) | sp.m_ellipse(x + round(3 * s), y - round(1 * s), round(4 * s), round(4 * s))
    nx, ny = x + round(16 * s * math.cos(ang)), y + round(16 * s * math.sin(ang))
    m |= sp.m_line([(x + 2, y), (nx, ny)], max(2, round(2 * s)))
    outline(sp, m)
    sp.put(m, C("red", 1))
    sp.put(m & sp.m_line([(x + 2, y), (nx, ny)], max(2, round(2 * s))), C("wood", 2))
    sp.ellipse(x + 1, y + 1, max(1, round(2 * s)), max(1, round(2 * s)), C("ink", 0))
    sp.rect(nx - 1, ny - 1, 3, 3, C("wood", 0))


def jump_curve(f, bumps, h=24):
    """参考 26–30 秒跳跃：蓄力 3 帧 → 上升 8 帧 → 顶点（=bump 帧）→ 下落 6 帧 → 落地压缩 3 帧。返回 (dy, crouch, airborne)。"""
    for hb in bumps:
        t = f - hb
        if -11 <= t < -8:
            return 0, 0.5 + 0.2 * (t + 11), False
        if -8 <= t <= 0:
            u = (t + 8) / 8
            return round(h * (1 - (1 - u) ** 2)), 0.0, True
        if 0 < t <= 6:
            u = t / 6
            return round(h * (1 - u * u)), 0.0, True
        if 6 < t <= 9:
            return 0, [0.9, 0.6, 0.25][t - 7], False
    return 0, 0.0, False


def stage(sm, f, gy=148, clouds=True):
    arcade_sky(sm, gy)
    if clouds:
        cloud(sm, 60 - (f // 8) % 400 // 40, 26, 34); cloud(sm, 236, 18, 28); cloud(sm, 300, 46, 22)
    hill(sm, 30, gy, 70, 26); hill(sm, 230, gy, 110, 34)
    brick_row(sm, gy, SH)
    sm.rect(0, gy, SW, 1, C("ink", 0)); sm.rect(0, gy + 1, SW, 1, C("green", 1))
