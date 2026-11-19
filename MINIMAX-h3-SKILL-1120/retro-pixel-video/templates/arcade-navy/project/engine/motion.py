"""运动工具：缓动、一拍二量化、种子随机（无全局状态、无墙钟）。"""
import math
import random


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(p):
    p = clamp(p)
    return 1 - (1 - p) ** 3


def ease_in_out(p):
    p = clamp(p)
    return p * p * (3 - 2 * p)


def back_out(p, s=1.6):
    p = clamp(p) - 1
    return p * p * ((s + 1) * p + s) + 1


def twos(f, origin):
    """一拍二：把帧号量化到相对 origin 的偶数帧（姿态动画用）。"""
    return f - ((f - origin) % 2)


def lerp(a, b, p):
    return a + (b - a) * p


def rng(*seed):
    """确定性随机：种子由调用方给出（场景名 + 编号），不依赖帧之外的任何状态。"""
    return random.Random(hash_seed(seed))


def hash_seed(seed):
    h = 2166136261
    for ch in repr(seed).encode():
        h = ((h ^ ch) * 16777619) & 0xFFFFFFFF
    return h


def bounce_y(p, h):
    """落下 + 小弹跳（一拍一用）：p 0..1 -> 相对落点的 y 偏移（负=上方）。"""
    p = clamp(p)
    if p < 0.6:
        q = p / 0.6
        return -h * (1 - q * q)
    q = (p - 0.6) / 0.4
    return -h * 0.18 * math.sin(math.pi * q)
