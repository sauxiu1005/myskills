"""16-bit material helpers: structured pixel clusters (plaster, wainscot, planks, stone blocks, wood grain).
All deterministic (seeded); draw into a Canvas with palette ramps; 2-4 tone steps, no random noise."""
import numpy as np
from .canvas import C, BAYER4, PAL
from .motion import rng


def plaster(cv, x, y, w, h, ramp="paper", base=1, seed="pl", n=None):
    cv.rect(x, y, w, h, C(ramp, base))
    R = rng(seed)
    for _ in range(n or max(8, w * h // 900)):
        px_, py_, L = R.randint(x, x + w - 16), R.randint(y + 4, y + h - 4), R.randint(5, 14)
        cv.rect(px_, py_, L, 1, C(ramp, max(0, base - 1)))
        cv.rect(px_ + 2, py_ + 1, max(1, L - 3), 1, C(ramp, min(len(PAL.ramps[ramp]) - 1, base + 1)))


def shadow_band(cv, x, y, w, h, ramp, step, down=True):
    """Bayer-dithered gradient from solid (edge) to none, colour = ramp step."""
    thr = np.tile(BAYER4, (h // 4 + 1, w // 4 + 1))[:h, :w]
    for j in range(h):
        d = 1 - j / h if down else j / h
        row = thr[j] < d * 0.9
        yy = y + j
        if 0 <= yy < cv.h:
            seg = cv.a[yy, max(0, x):min(cv.w, x + w)]
            r = row[max(0, -x):max(0, -x) + seg.shape[0]]
            seg[r] = C(ramp, step)


def wainscot(cv, x, y, w, h, ramp="wood", seed="ws", plank=22):
    cv.rect(x, y, w, h, C(ramp, 2))
    R = rng(seed)
    for px_ in range(x, x + w, plank):
        cv.rect(px_, y, 1, h, C(ramp, 0))
        cv.rect(px_ + 1, y, 2, h, C(ramp, 3))
        for g in range(3):
            gy = y + 4 + R.randint(0, max(1, h - 12))
            cv.rect(px_ + 6 + g * 4, gy, 1, R.randint(4, 9), C(ramp, 1))
    cv.rect(x, y - 4, w, 4, C(ramp, 1)); cv.rect(x, y - 4, w, 1, C(ramp, 4)); cv.rect(x, y - 1, w, 1, C(ramp, 0))


def planks(cv, x, y, w, h, ramp="wood", seed="pk", row=9, base=2):
    cv.rect(x, y, w, h, C(ramp, base))
    for r, yy in enumerate(range(y, y + h, row)):
        cv.rect(x, yy, w, 1, C(ramp, base - 2 if base >= 2 else 0)); cv.rect(x, yy + 1, w, 1, C(ramp, base + 1))
        off = (r * 37) % 90
        for xx in range(x - off, x + w, 90):
            if xx >= x:
                cv.rect(xx, yy, 1, row, C(ramp, 0)); cv.px(xx + 3, yy + row // 2, C(ramp, base - 1))
    R = rng(seed)
    for _ in range(w * h // 700):
        gx, gy = R.randint(x, x + w - 30), R.randint(y + 2, y + h - 2)
        cv.rect(gx, gy, R.randint(10, 28), 1, C(ramp, base - 1))


def grain(cv, x, y, w, h, ramp="wood", base=1, seed="gr"):
    """wood grain lines inside a box (for shelves, desks, panels)."""
    R = rng(seed)
    for g in range(max(2, h // 6)):
        gy = y + 2 + R.randint(0, max(1, h - 4))
        gx = x + R.randint(0, max(1, w // 3))
        cv.rect(gx, gy, R.randint(max(4, w // 4), max(5, w - (gx - x) - 2)), 1, C(ramp, base))


def stone_blocks(cv, x, y, w, h, ramp="stone", seed="sb", bw=24, bh=12):
    cv.rect(x, y, w, h, C(ramp, 0))
    R = rng(seed)
    for r, yy in enumerate(range(y, y + h, bh)):
        off = 0 if r % 2 == 0 else -bw // 2
        for xx in range(x + off, x + w, bw):
            a, b = max(xx, x), min(xx + bw - 1, x + w)
            hh = min(bh - 1, y + h - yy)
            if b - a <= 0 or hh <= 0:
                continue
            s = R.choice((1, 2, 2))
            cv.rect(a, yy, b - a, hh, C(ramp, s))
            cv.rect(a, yy, b - a, 1, C(ramp, s + 1)); cv.rect(a, yy, 1, hh, C(ramp, s + 1))
            if R.random() < 0.3:
                cv.rect(a + R.randint(2, max(3, b - a - 6)), yy + R.randint(3, max(4, hh - 2)), 3, 1, C(ramp, s - 1))


def rpg_frame(cv, x, y, w, h, fill=None):
    """in-world window frame (canvas layer): ink / warm ring / ink / bevel / fill, rounded corners."""
    fill = C("paper", 2) if fill is None else fill
    cv.rect(x, y, w, h, C("ink", 0))
    cv.rect(x + 1, y + 1, w - 2, h - 2, C("wood", 3))
    cv.rect(x + 2, y + 2, w - 4, h - 4, C("ink", 0))
    cv.rect(x + 3, y + 3, w - 6, h - 6, fill)
    cv.rect(x + 3, y + 3, w - 6, 1, C("snow", 4)); cv.rect(x + 3, y + 3, 1, h - 6, C("snow", 4))
    cv.rect(x + 3, y + h - 4, w - 6, 1, C("paper", 0)); cv.rect(x + w - 4, y + 3, 1, h - 6, C("paper", 0))
    for cx_, cy_ in ((x + 1, y + 1), (x + w - 2, y + 1), (x + 1, y + h - 2), (x + w - 2, y + h - 2)):
        cv.px(cx_, cy_, C("ink", 0))
