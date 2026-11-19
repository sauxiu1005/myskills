"""常用道具（全部按语义色槽绘制，形状干净、像素簇成块）。"""
import math
from .canvas import C, PAL, Canvas, shift


def rot_pts(pts, cx, cy, ang):
    ca, sa = math.cos(ang), math.sin(ang)
    return [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in pts]


def ellipse_pts(rx, ry, n=28, ox=0, oy=0):
    return [(ox + rx * math.cos(2 * math.pi * i / n), oy + ry * math.sin(2 * math.pi * i / n)) for i in range(n)]


# ---------------- 硬币 ----------------
def coin(cv, cx, cy, r, glow=False, flat=False):
    """正面硬币（flat=True 为躺在桌上的椭圆）。glow：硬边核心 + 1px 外圈 + 四向光芒。"""
    ry = max(1, round(r * 0.5)) if flat else r
    if glow:
        cv.ellipse(cx, cy, r + 2, ry + 2, C("lamp", 1))
        L = r + 4
        cv.rect(cx, cy - ry - L + r, 1, L - r - 1, C("lamp", 1))
        cv.rect(cx, cy + ry + 2, 1, L - r - 1, C("lamp", 1))
        cv.rect(cx - r - L + r, cy, L - r - 1, 1, C("lamp", 1))
        cv.rect(cx + r + 2, cy, L - r - 1, 1, C("lamp", 1))
    m = cv.m_ellipse(cx, cy, r, ry)
    cv.outline(m, C("gold", 0))
    cv.shaded(m, "gold", 2 if not glow else 3, k=1)
    if r >= 4 and not flat:
        cv.ellipse(cx, cy, max(1, r - 2), max(1, ry - 2), C("gold", 1) if not glow else C("gold", 2))
        cv.rect(cx - 1, cy - max(1, ry // 3), 2, max(2, (ry * 2) // 3), C("gold", 3))
    elif flat and r >= 3:
        cv.rect(cx - r + 2, cy - 1, max(1, r - 1), 1, C("gold", 3))


# ---------------- 沙漏 ----------------
def hourglass(cv, cx, cy, h, top_frac=0.92, flow=True):
    """竖直沙漏，中心 (cx,cy)，总高 h。上半沙量 top_frac。"""
    w = max(7, round(h * 0.62)) | 1
    cap = max(2, round(h * 0.11))
    hw = w // 2
    top, bot = cy - h // 2, cy + h // 2
    gl_top, gl_bot = top + cap, bot - cap
    mid = cy
    bulb_w = hw - 1
    # 玻璃（两个倒置的圆三角）
    upper = [(cx - bulb_w, gl_top), (cx + bulb_w, gl_top), (cx + bulb_w, gl_top + (mid - gl_top) * 0.45), (cx + 1, mid - 1), (cx - 1, mid - 1), (cx - bulb_w, gl_top + (mid - gl_top) * 0.45)]
    lower = [(cx - 1, mid + 1), (cx + 1, mid + 1), (cx + bulb_w, gl_bot - (gl_bot - mid) * 0.45), (cx + bulb_w, gl_bot), (cx - bulb_w, gl_bot), (cx - bulb_w, gl_bot - (gl_bot - mid) * 0.45)]
    mu, ml = cv.m_poly(upper), cv.m_poly(lower)
    glass = mu | ml
    cv.outline(glass, C("snow", 0))
    cv.put(glass, C("snow", 2))
    # 沙
    import numpy as np
    yy = np.arange(cv.h)[:, None]
    sand_top_y = mid - 1 - (mid - 1 - gl_top) * top_frac
    sand_u = mu & (yy >= sand_top_y)
    cv.put(sand_u, C("gold", 2))
    cv.put(sand_u & ~shift(sand_u, 1, 0), C("gold", 1))
    lower_level = gl_bot - max(1, round((gl_bot - mid) * (1 - top_frac) * 0.9))
    sand_l = ml & (yy >= lower_level)
    cv.put(sand_l, C("gold", 2))
    if flow and top_frac > 0.02:
        cv.rect(cx, mid - 1, 1, max(1, lower_level - mid + 1), C("gold", 3))
    # 玻璃高光
    cv.rect(cx - bulb_w + 1, gl_top + 1, 1, max(1, (mid - gl_top) // 3), C("snow", 4))
    # 木框
    for yy0 in (top, bot - cap):
        m = cv.m_rect(cx - hw - 1, yy0, w + 2, cap)
        cv.outline(m, C("wood", 0))
        cv.shaded(m, "wood", 3, k=1)
    pw = 1 if h < 30 else 2
    for xx in (cx - hw - 1, cx + hw + 1 - pw):
        m = cv.m_rect(xx, top + cap, pw, h - 2 * cap)
        cv.put(m, C("wood", 2))
    return (cx - hw - 2, top - 1, w + 4, h + 2)


# ---------------- 路灯 ----------------
def streetlamp(cv, x, base_y, h, lit, facing=1, light_r=None):
    """地平线路灯：杆 + 弯臂 + 灯罩 + 灯泡。lit 时灯泡用暖光色，并在 light mask 中写入光圈。"""
    pole = max(1, round(h / 22))
    top = base_y - h
    cv.rect(x, top, pole, h, C("stone", 0))
    arm = max(2, round(h * 0.22))
    hx = x + facing * arm
    cv.rect(min(x, hx), top, abs(hx - x) + pole, pole, C("stone", 0))
    hw = max(2, round(h * 0.16))
    hh = max(1, round(h * 0.07))
    cv.rect(hx - hw // 2, top, hw + pole, hh + 1, C("stone", 1))
    bulb = C("lamp", 1) if lit else C("stone", 2)
    cv.rect(hx - hw // 2 + (1 if hw > 3 else 0), top + hh + 1, max(1, hw + pole - (2 if hw > 3 else 0)), max(1, hh), bulb)
    if lit and light_r:
        cv.add_light(hx, top + hh + light_r * 0.45, light_r * 0.75, light_r * 0.36, squash=1.5)
    return (hx, top + hh + 1)


# ---------------- 吉他 ----------------
def guitar(cv, cx, cy, size, ang):
    """吉他：以琴身中心 (cx,cy) 为原点，ang 为琴颈方向（弧度，0=向右）。size≈琴身长。"""
    s = size
    lower = rot_pts(ellipse_pts(s * 0.30, s * 0.27, 28, ox=-s * 0.12), cx, cy, ang)
    upper = rot_pts(ellipse_pts(s * 0.22, s * 0.21, 24, ox=s * 0.22), cx, cy, ang)
    neck = rot_pts([(s * 0.35, -s * 0.05), (s * 1.05, -s * 0.05), (s * 1.05, s * 0.05), (s * 0.35, s * 0.05)], cx, cy, ang)
    head = rot_pts([(s * 1.03, -s * 0.08), (s * 1.25, -s * 0.07), (s * 1.25, s * 0.07), (s * 1.03, s * 0.08)], cx, cy, ang)
    mb = cv.m_poly(lower) | cv.m_poly(upper)
    mn = cv.m_poly(neck)
    mh = cv.m_poly(head)
    cv.outline(mb | mn | mh, C("ink", 0))
    cv.shaded(mb, "wood", 4, k=max(1, round(s / 14)))
    cv.put(mn, C("wood", 1))
    cv.put(mh, C("wood", 0))
    hole = rot_pts(ellipse_pts(s * 0.09, s * 0.09, 16, ox=s * 0.12), cx, cy, ang)
    cv.poly(hole, C("ink", 0))
    br = rot_pts([(-s * 0.28, -s * 0.09), (-s * 0.22, -s * 0.09), (-s * 0.22, s * 0.09), (-s * 0.28, s * 0.09)], cx, cy, ang)
    cv.poly(br, C("wood", 1))
    # 琴弦一条高光
    a = rot_pts([(-s * 0.25, 0), (s * 1.03, 0)], cx, cy, ang)
    cv.line(a, C("stone", 3), 1)
    return mb | mn | mh


# ---------------- 钱包 ----------------
def wallet(cv, cx, cy, w, open_=True):
    h = max(4, round(w * 0.62))
    m = cv.m_rrect(cx - w // 2, cy - h // 2, w, h, 1)
    cv.outline(m, C("ink", 0))
    cv.shaded(m, "red", 1, k=1)
    if open_:
        cv.rect(cx - w // 2 + 1, cy - h // 2 + 1, w - 2, max(1, h // 3), C("red", 0))
    cv.rect(cx + w // 2 - 3, cy - 1, 2, 2, C("gold", 2))


# ---------------- 笔记本 ----------------
def notebook(cv, x, y, w, h, open_=False, lines=True):
    m = cv.m_rect(x, y, w, h)
    cv.outline(m, C("ink", 0))
    if not open_:
        cv.shaded(m, "teal", 1, k=1)
        cv.rect(x + 1, y, 1, h, C("teal", 0))
        cv.rect(x + w // 2 - 2, y + h // 3, max(3, w // 3), 2, C("paper", 2))
    else:
        cv.put(m, C("paper", 2))
        cv.rect(x + w // 2, y, 1, h, C("paper", 0))
        if lines:
            for yy in range(y + 3, y + h - 2, 3):
                cv.rect(x + 2, yy, w // 2 - 4, 1, C("paper", 0))
                cv.rect(x + w // 2 + 2, yy, w // 2 - 4, 1, C("paper", 0))


def check_mark(cv, x, y, s, c):
    """打勾（s=格子尺寸）。"""
    pts = [(x + s * 0.18, y + s * 0.5), (x + s * 0.42, y + s * 0.74), (x + s * 0.84, y + s * 0.22)]
    cv.line(pts, c, max(1, round(s / 6)))


def plant(cv, x, base_y, h):
    pot = cv.m_poly([(x - h * 0.28, base_y - h * 0.38), (x + h * 0.28, base_y - h * 0.38), (x + h * 0.22, base_y), (x - h * 0.22, base_y)])
    leaves = cv.m_ellipse(x, base_y - h * 0.62, h * 0.3, h * 0.28) | cv.m_ellipse(x - h * 0.22, base_y - h * 0.5, h * 0.18, h * 0.14) | cv.m_ellipse(x + h * 0.2, base_y - h * 0.8, h * 0.16, h * 0.18)
    cv.outline(pot | leaves, C("ink", 0))
    cv.shaded(leaves, "green", 1, k=2)
    cv.shaded(pot, "red", 1, k=1)
