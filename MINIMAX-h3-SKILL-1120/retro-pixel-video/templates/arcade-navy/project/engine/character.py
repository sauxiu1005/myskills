"""主角「小舟」：参数化像素绑定（每个尺寸重新栅格化，不做放大）。

轮廓关键词：翘起一撮的黑短发、芥末黄连帽衫、青色背包带、白球鞋、深蓝裤。
H = 站立总高（逻辑像素）。全景 40–48 / 中景 64–72 / 特写 H≈300 只露胸像（头约 100px，重绘）。
表情 expr：calm 平静 / wry 苦笑 / brow 挑眉 / wide 睁大眼 / scratch 挠头 / smile 微笑。
"""
import math
import numpy as np
from .canvas import Canvas, C, shift, dilate4, T
from . import props


def _ik(sx, sy, hx, hy, a, b, bend):
    dx, dy = hx - sx, hy - sy
    d = max(1e-3, math.hypot(dx, dy))
    if d > a + b - 0.5:
        k = (a + b - 0.5) / d
        hx, hy = sx + dx * k, sy + dy * k
        d = a + b - 0.5
    cosA = max(-1, min(1, (a * a + d * d - b * b) / (2 * a * d)))
    A = math.acos(cosA) * bend
    base = math.atan2(dy, dx)
    ex, ey = sx + a * math.cos(base + A), sy + a * math.sin(base + A)
    return (ex, ey), (hx, hy)


# legacy 示例人物（复利片的眼镜青年）。只用于复现旧示例或用户明确要求沿用；新主题请在 characters/ 下手画角色。
def draw_zhou(cv, x, y, H, mode="sit", face=0, expr="calm", lhand=None, rhand=None,
              litems=None, ritems=None, guitar_back=False, nod=0, look=(0, 0), legs=None,
              shirt_step=3, clip=None, crouch=0.0, lean=0.0, breath=0, blink=False, stride=None,
              glasses=False, glint=None):
    """x,y = 臀部中心（画布坐标）。lhand/rhand = 手相对肩的偏移（单位 H）。
    litems/ritems = 回调 f(sprite, hx, hy) 画在手上的物件（先画物件后画手指）。"""
    from .cast import require_legacy
    require_legacy()        # 旧示例人物：未在 cues.json cast 声明 kind=legacy_zhou 时直接报错，不静默回落
    S = int(H * 2.2) + 16
    sp = Canvas(S, S)
    ox, oy = S // 2, int(S * 0.6)  # 臀部在 sprite 中的位置
    k = max(1, round(H / 30))
    ol = 2 if H >= 200 else 1

    head_h = H * 0.37
    head_w = head_h * 0.98
    torso_h = H * 0.26
    torso_wt, torso_wb = H * 0.30, H * 0.33
    arm_w = max(2, round(H * 0.095))
    leg_w = max(2, round(H * 0.11))
    ua, fa = H * 0.14, H * 0.13

    fwd = face if face != 0 else 1
    dxt = fwd * lean * H * 0.10          # 上身前倾/后仰：肩与头的水平位移
    hip_y = oy
    sh_y = hip_y - torso_h - breath + abs(lean) * H * 0.02 + crouch * H * 0.02
    head_cy = sh_y - head_h * 0.42 + nod + abs(lean) * H * 0.02
    head_cx = ox + face * H * 0.01 + dxt * 1.25

    body = np.zeros((S, S), bool)

    # ---- 背后的吉他 ----
    if guitar_back:
        g = props.guitar(sp, ox + H * 0.19, hip_y - torso_h * 0.1, H * 0.42, -math.pi * 0.78)
        body |= g

    # ---- 背包（3/4 侧时从远侧露出） ----
    if face != 0:
        pk = sp.m_rrect(ox - face * torso_wt * 0.62 - torso_wt * 0.18, sh_y + 1, torso_wt * 0.36, torso_h * 0.92, max(1, round(H / 25)))
        sp.shaded(pk, "teal", 1, k=k)
        body |= pk

    # ---- 腿 ----
    hip_l, hip_r = (ox - H * 0.08, hip_y - 1), (ox + H * 0.08, hip_y - 1)
    if mode == "stand":
        # crouch 0..1：膝前屈、脚仍着地（调用方把臀部下移 crouch_drop(H, crouch)）
        fy = hip_y + H * 0.28 * (1 - 0.32 * crouch)
        ky = hip_y + H * 0.15 * (1 - 0.40 * crouch)
        kf = fwd * crouch * H * 0.10
        kn_l, kn_r = (ox - H * 0.09 + kf, ky), (ox + H * 0.09 + kf, ky)
        ft_l, ft_r = (ox - H * 0.1, fy), (ox + H * 0.1, fy)
        if stride is not None:   # 行走：两脚前后交替、抬脚、膝随动（6 帧一循环由调用方量化）
            a = 2 * math.pi * stride
            for side in (-1, 1):
                sw = math.sin(a) * (1 if side < 0 else -1)
                lift = max(0.0, math.cos(a) * (1 if side < 0 else -1)) * H * 0.05
                fx = ox + side * H * 0.05 + fwd * sw * H * 0.13
                kx = ox + side * H * 0.05 + fwd * (sw * 0.5 + 0.05) * H * 0.13
                if side < 0:
                    ft_l, kn_l = (fx, hip_y + H * 0.28 - lift), (kx, hip_y + H * 0.15 - lift * 0.6)
                else:
                    ft_r, kn_r = (fx, hip_y + H * 0.28 - lift), (kx, hip_y + H * 0.15 - lift * 0.6)
    else:  # sit：大腿朝镜头（透视短），小腿下垂
        sw = legs or 0
        kn_l, kn_r = (ox - H * 0.1, hip_y + H * 0.07), (ox + H * 0.1, hip_y + H * 0.07)
        ft_l, ft_r = (ox - H * 0.11 - sw, hip_y + H * 0.24), (ox + H * 0.11 + sw, hip_y + H * 0.23)
    legm = sp.m_line([hip_l, kn_l, ft_l], leg_w) | sp.m_line([hip_r, kn_r, ft_r], leg_w)
    sp.shaded(legm, "night", 2, k=k)
    body |= legm
    sh_w = max(3, round(H * 0.13))
    sh_h = max(2, round(H * 0.06))
    for fx, fy in (ft_l, ft_r):
        sm = sp.m_rrect(fx - sh_w // 2, fy - sh_h // 2, sh_w, sh_h, max(0, sh_h // 2 - 1))
        sp.put(sm, C("snow", 4))
        sp.put(sm & ~shift(sm, 0, 1), C("snow", 2))
        sp.rect(fx - sh_w // 2, fy + sh_h // 2 - (0 if sh_h < 4 else 1), sh_w, 1, C("stone", 1))
        body |= sm

    # ---- 卫衣躯干 + 帽兜 ----
    torso = sp.m_poly([(ox - torso_wt / 2 + dxt, sh_y), (ox + torso_wt / 2 + dxt, sh_y), (ox + torso_wb / 2, hip_y + H * 0.02), (ox - torso_wb / 2, hip_y + H * 0.02)])
    torso |= sp.m_ellipse(ox - torso_wt / 2 + H * 0.03 + dxt, sh_y + H * 0.03, H * 0.045, H * 0.04) | sp.m_ellipse(ox + torso_wt / 2 - H * 0.03 + dxt, sh_y + H * 0.03, H * 0.045, H * 0.04)
    hood = sp.m_ellipse(ox - face * H * 0.05 + dxt, sh_y - H * 0.01, H * 0.17, H * 0.07)
    sp.shaded(hood, "mustard", shirt_step - 1, k=k, hi=False)
    sp.shaded(torso, "mustard", shirt_step, k=k)
    body |= torso | hood
    # 罗纹下摆 + 口袋
    sp.put(torso & (np.arange(S)[:, None] >= hip_y - max(1, round(H * 0.025))), C("mustard", shirt_step - 1))
    if H >= 36:
        pk_y = hip_y - torso_h * 0.38
        sp.rect(ox - torso_wt * 0.28, pk_y, torso_wt * 0.56, 1, C("mustard", shirt_step - 1))
    # 背包带（青色）
    st_w = max(1, round(H * 0.045))
    for sx in (ox - torso_wt * 0.3, ox + torso_wt * 0.3):
        if face != 0 and (sx - ox) * face < 0 and H < 40:
            continue
        sp.rect(sx - st_w // 2, sh_y + 1, st_w, torso_h * 0.72, C("teal", 2))
        if st_w >= 2:
            sp.rect(sx - st_w // 2, sh_y + 1, 1, torso_h * 0.72, C("teal", 3))
    # 抽绳
    if H >= 50:
        for sx in (ox - H * 0.035, ox + H * 0.035):
            sp.rect(sx + face * H * 0.03, sh_y + 2, 1, max(2, round(H * 0.07)), C("paper", 2))

    # ---- 头 ----
    hm = sp.m_ellipse(head_cx, head_cy, head_w / 2, head_h / 2)
    ear_x = head_cx - face * head_w * 0.47
    if face != 0:
        hm |= sp.m_ellipse(ear_x, head_cy + head_h * 0.08, max(1, H * 0.035), max(1, H * 0.05))
    sp.shaded(hm, "skin", 2, k=k)
    body |= hm
    # ---- 头发：黑短发 + 翘起一撮 ----
    hw, hh = head_w / 2, head_h / 2
    cap = sp.m_ellipse(head_cx + face * H * 0.008, head_cy - hh * 0.12, hw * 1.07, hh * 0.95)
    cap &= np.arange(S)[:, None] < head_cy - hh * 0.2
    fr = head_cx + face * hw * 0.2
    bang = [(head_cx - hw * 1.06, head_cy + hh * 0.08), (head_cx - hw * 0.82, head_cy - hh * 0.22),
            (fr - hw * 0.52, head_cy - hh * 0.06), (fr - hw * 0.28, head_cy - hh * 0.27),
            (fr + hw * 0.02, head_cy - hh * 0.04), (fr + hw * 0.3, head_cy - hh * 0.28),
            (fr + hw * 0.62, head_cy - hh * 0.1), (head_cx + hw * 0.84, head_cy - hh * 0.26),
            (head_cx + hw * 1.06, head_cy + hh * 0.08), (head_cx + hw * 1.06, head_cy - hh * 0.5),
            (head_cx - hw * 1.06, head_cy - hh * 0.5)]
    hair = cap | sp.m_poly(bang)
    if face != 0:  # 远侧鬓角收进，露出脸颊轮廓
        cut = head_cx + face * hw * 0.98
        hair &= ~((np.arange(S)[None, :] - cut) * face > 0) | (np.arange(S)[:, None] < head_cy - hh * 0.3)
    # 鬓角（3/4 侧在耳朵前方）
    if face != 0:
        hair |= sp.m_rect(ear_x + face * hw * 0.1 - (hw * 0.18 if face > 0 else 0), head_cy - hh * 0.3, hw * 0.18, hh * 0.45)
    # 翘起一撮
    tx = head_cx + hw * 0.18
    ty = head_cy - hh * 0.95
    tuft = [(tx - hw * 0.28, ty + hh * 0.25), (tx - hw * 0.05, ty - hh * 0.22), (tx + hw * 0.32, ty - hh * 0.42),
            (tx + hw * 0.22, ty - hh * 0.18), (tx + hw * 0.18, ty + hh * 0.22)]
    hair |= sp.m_poly(tuft)
    hair &= ~(hm & (np.arange(S)[:, None] > head_cy + hh * 0.05))
    sp.put(hair, C("ink", 1))
    hl = hair & ~shift(hair, -k, -k)
    sp.put(hl & (np.arange(S)[:, None] < head_cy - hh * 0.3), C("ink", 2))
    body |= hair

    # ---- 外轮廓 ----
    ring = body
    for _ in range(ol):
        r = dilate4(ring) & ~ring
        sp.put(r, C("ink", 0))
        ring = ring | r

    # ---- 手臂（自带分隔线） ----
    hands = []
    for side, tgt, items in ((-1, lhand, litems), (1, rhand, ritems)):
        sx, sy = ox + side * (torso_wt / 2 - H * 0.02) + dxt, sh_y + H * 0.045
        if tgt is None:
            sw_ = (math.sin(2 * math.pi * stride) * (-1 if side < 0 else 1) * 0.07 * fwd) if stride is not None else 0
            tgt = (side * 0.06 + sw_, 0.25)
        hx, hy = sx + tgt[0] * H, sy + tgt[1] * H
        bend = side if tgt[1] < 0.05 else -side
        (ex, ey), (hx, hy) = _ik(sx, sy, hx, hy, ua, fa, bend)
        am = sp.m_line([(sx, sy), (ex, ey), (hx, hy)], arm_w)
        arr = dilate4(am) & ~am
        for _ in range(ol - 1):
            arr = (dilate4(arr | am) & ~am)
        sp.put(arr & body, C("mustard", 0))
        sp.put(arr & ~body, C("ink", 0))
        sp.shaded(am, "mustard", shirt_step, k=k)
        cuff = sp.m_ellipse(hx, hy, arm_w * 0.55, arm_w * 0.55) & am
        sp.put(cuff, C("mustard", shirt_step - 1))
        body |= am | arr
        hands.append((hx, hy, items))

    # ---- 五官 ----
    face_features(sp, head_cx, head_cy, hw, hh, face, expr, look, H, blink, glasses, glint)

    # ---- 手上的物件与手 ----
    hr = max(1.5, H * 0.05)
    for hx, hy, items in hands:
        if items:
            items(sp, hx, hy)
        m = sp.m_ellipse(hx, hy, hr, hr)
        sp.outline(m, C("ink", 0))
        sp.shaded(m, "skin", 2, k=1, hi=False)

    if expr == "scratch":
        pass
    if clip is not None:
        cv.blit(sp, x - ox, y - oy)
    else:
        cv.blit(sp, x - ox, y - oy)
    return {"head": (x + (head_cx - ox), y + (head_cy - oy)), "hands": [(x + h[0] - ox, y + h[1] - oy) for h in hands],
            "shoulder_y": y + (sh_y - oy)}


def crouch_drop(H, c):
    """crouch=c 时臀部需要下移的像素（保持脚着地）。"""
    return round(H * 0.28 * 0.32 * c)


def face_features(sp, cx, cy, hw, hh, face, expr, look, H, blink=False, glasses=False, glint=None):
    fx = cx + face * hw * 0.22
    ey = cy + hh * 0.18
    sep = hw * 0.42
    ew = max(1, round(hw * 0.13))
    eh = max(2, round(hh * 0.26))
    ink = C("ink", 0)
    eyes = [(fx - sep, ey), (fx + sep, ey)]
    if face != 0:  # 远侧眼收窄
        eyes = [(fx - sep * (0.75 if face > 0 else 1.0), ey), (fx + sep * (1.0 if face > 0 else 0.75), ey)]
    big = H >= 120
    lx, ly = look

    def eye_open(ex, ey_, w, h, white=False):
        if blink:   # 眨眼：闭成一条线
            sp.rect(round(ex - w + lx), round(ey_ + h * 0.15), w * 2, max(1, round(hh * 0.06)), ink)
            return
        if white:
            sp.ellipse(ex, ey_, w + max(1, w // 2), h * 0.62, C("snow", 4))
            sp.outline(sp.m_ellipse(ex, ey_, w + max(1, w // 2), h * 0.62), ink)
            sp.ellipse(ex + lx, ey_ + ly, max(1, w * 0.55), max(1, h * 0.38), ink)
            sp.px(ex + lx - max(1, w // 3), ey_ + ly - max(1, h // 5), C("snow", 4))
        else:
            sp.rect(round(ex - w / 2 + lx), round(ey_ - h / 2 + ly), w, h, ink)
            if big:
                sp.rect(round(ex - w / 2 + lx), round(ey_ - h / 2 + ly), max(1, w // 3), max(1, h // 4), C("snow", 4))

    def brow(ex, y0, dy_in, dy_out, side):
        w = max(2, round(hw * 0.32))
        th = max(1, round(hh * 0.06))
        x0, x1 = ex - w / 2, ex + w / 2
        if side < 0:
            pts = [(x0, y0 + dy_out), (x1, y0 + dy_in)]
        else:
            pts = [(x0, y0 + dy_in), (x1, y0 + dy_out)]
        sp.line(pts, C("ink", 1), th)

    def mouth(kind):
        mx, my = fx + face * hw * 0.05, cy + hh * 0.58
        mw = max(2, round(hw * 0.3))
        th = max(1, round(hh * 0.05))
        if kind == "flat":
            sp.rect(round(mx - mw / 3), round(my), max(2, round(mw * 0.66)), th, C("skin", 0))
        elif kind == "smile":
            pts = [(mx - mw / 2, my - hh * 0.04), (mx - mw / 4, my + hh * 0.06), (mx + mw / 4, my + hh * 0.06), (mx + mw / 2, my - hh * 0.04)]
            sp.line(pts, C("skin", 0) if not big else C("red", 0), th)
        elif kind == "wry":
            pts = [(mx - mw / 2, my + hh * 0.04), (mx, my + hh * 0.04), (mx + mw / 2, my - hh * 0.06)]
            sp.line(pts, C("skin", 0), th)
        elif kind == "o":
            r = max(1, round(hw * 0.09))
            sp.ellipse(mx, my + hh * 0.02, r, r * 1.3, C("red", 0))
        elif kind == "wave":
            pts = [(mx - mw / 2, my), (mx - mw / 6, my + hh * 0.05), (mx + mw / 6, my - hh * 0.02), (mx + mw / 2, my + hh * 0.04)]
            sp.line(pts, C("skin", 0), th)

    by = ey - eh / 2 - max(2, hh * 0.18)
    if expr == "calm":
        for e in eyes:
            eye_open(e[0], e[1], ew, eh)
        mouth("flat")
    elif expr == "wry":
        for i, e in enumerate(eyes):
            sp.rect(round(e[0] - ew), round(e[1]), ew * 2, max(1, eh // 3), ink)
            brow(e[0], by + 1, -max(1, hh * 0.1), 0, -1 if i == 0 else 1)
        mouth("wry")
    elif expr == "brow":
        for i, e in enumerate(eyes):
            eye_open(e[0], e[1], ew, eh)
        brow(eyes[0][0], by + 1, 0, 0, -1)
        brow(eyes[1][0], by - max(2, hh * 0.14), -max(1, hh * 0.06), max(1, hh * 0.04), 1)
        mouth("wry")
    elif expr == "wide":
        for e in eyes:
            if H >= 60:
                eye_open(e[0], e[1], ew + 1, eh + 1, white=True)
            else:
                sp.rect(round(e[0] - ew / 2 - 0.5), round(e[1] - eh / 2 - 1), ew + 1, eh + 2, ink)
                sp.px(round(e[0] - ew / 2 - 0.5), round(e[1] - eh / 2 - 1), C("snow", 4))
        for i, e in enumerate(eyes):
            brow(e[0], by - max(2, hh * 0.12), -max(1, hh * 0.05), 0, -1 if i == 0 else 1)
        mouth("o")
    elif expr == "scratch":
        for e in eyes:
            sp.line([(e[0] - ew, e[1] - eh * 0.3), (e[0] + ew, e[1]), (e[0] - ew, e[1] + eh * 0.3)] if e[0] < fx else
                    [(e[0] + ew, e[1] - eh * 0.3), (e[0] - ew, e[1]), (e[0] + ew, e[1] + eh * 0.3)], ink, max(1, round(hh * 0.05)))
        mouth("wave")
        dx = cx + hw * 1.05
        sp.poly([(dx, cy - hh * 0.5), (dx + hw * 0.12, cy - hh * 0.25), (dx - hw * 0.12, cy - hh * 0.25)], C("teal", 3))
        sp.ellipse(dx, cy - hh * 0.22, hw * 0.12, hw * 0.12, C("teal", 3))
    elif expr == "smile":
        for e in eyes:
            w = max(2, ew + 1)
            sp.line([(e[0] - w, e[1] + eh * 0.15), (e[0], e[1] - eh * 0.3), (e[0] + w, e[1] + eh * 0.15)], ink, max(1, round(hh * 0.06)))
        mouth("smile")
    if glasses:   # 粗黑框方镜 + 白镜片 + 小黑瞳（参考画风），表情由瞳孔形状表达
        lw = max(4, round(hw * 0.62)); lh = max(3, round(hh * 0.42))
        th = 1 if H < 90 else 2
        for i, e in enumerate(eyes):
            x0, y0 = round(e[0] - lw / 2), round(e[1] - lh / 2)
            sp.rect(x0 - th, y0 - th, lw + 2 * th, lh + 2 * th, ink)
            sp.rect(x0, y0, lw, lh, C("snow", 4))
            sp.rect(x0, y0 + lh - max(1, lh // 4), lw, max(1, lh // 4), C("snow", 2))
            px_, py_ = round(e[0] + look[0] - max(1, lw // 6)), round(e[1] + look[1] - lh // 3)
            pw, ph = max(1, lw // 3), max(2, round(lh * 0.6))
            if blink:
                sp.rect(x0, round(e[1]), lw, max(1, th), ink)
            elif expr == "smile":
                sp.line([(x0 + 1, e[1] + 1), (e[0], e[1] - lh * 0.25), (x0 + lw - 2, e[1] + 1)], ink, th)
            elif expr == "wide":
                sp.rect(px_, py_ - 1, pw, max(1, ph - 1), ink)
            elif expr == "down":
                sp.rect(px_, round(y0 + lh - ph), pw, ph, ink)
            else:
                sp.rect(px_, py_, pw, ph, ink)
            if glint is not None and 0 <= glint <= 1:   # 镜片斜向闪光扫过
                gx = x0 - lh + round((lw + 2 * lh) * glint)
                for yy in range(lh):
                    for d_ in range(max(1, lw // 3)):
                        xx = gx + d_ + (lh - yy)
                        if x0 <= xx < x0 + lw:
                            sp.px(xx, y0 + yy, C("snow", 4) if d_ else C("gold", 3))
        bx0 = round(eyes[0][0] + lw / 2 + th); bx1 = round(eyes[1][0] - lw / 2 - th)
        if bx1 > bx0:
            sp.rect(bx0, round(eyes[0][1] - lh / 2), bx1 - bx0, th, ink)
    # 腮红（只在中景以上）
    if H >= 50 and expr in ("smile", "wry", "scratch"):
        for e in eyes:
            sp.rect(round(e[0] - ew), round(e[1] + eh * 0.9), max(2, ew * 2), max(1, round(hh * 0.06)), C("red", 2))
