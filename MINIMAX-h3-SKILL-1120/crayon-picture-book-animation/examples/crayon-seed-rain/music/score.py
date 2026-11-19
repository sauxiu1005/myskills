"""《下雨啦》原创配乐：4/4，96 BPM，C 大调，15 秒（每小节 2.5 秒）
全部用 numpy 合成：八音盒、钢片琴、单簧管、长笛、木鱼、沙锤。没有弦乐和大钢琴。
运行：$LIB/.venv/bin/python music/score.py  → music/score.wav、music/stems/*.wav
"""
import os, sys, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.environ['LIB'], 'core/audio'))
from sfx import SR, add, bp, lp, hp
E = json.load(open(os.path.join(ROOT, 'events.json'))); DUR = E['dur']; N = int(DUR * SR)
B = 60 / 96; BAR = 4 * B
rng = np.random.default_rng(5)
ST = {k: np.zeros((N, 2)) for k in ['musicbox', 'glock', 'clarinet', 'flute', 'wood', 'shaker']}
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def f_(p): return 440 * 2 ** ((NOTE[p[0]] + 12 * (int(p[-1]) + 1) - 69 + (1 if '#' in p else 0)) / 12)
def T(d): return np.arange(int(d * SR)) / SR
def fade(x, a=0.002, b=0.05):
    ia, ib = int(a * SR), min(len(x), int(b * SR)); x[:ia] *= np.linspace(0, 1, ia); x[-ib:] *= np.linspace(1, 0, ib); return x

def mbox(p, v=0.7, d=1.8, droop=0.0):
    f0 = f_(p); t = T(d); y = np.zeros_like(t)
    fc = f0 * (1 - droop * np.clip(t / d, 0, 1)) if droop else f0
    for r, a, t60 in [(1, 1, 1.5), (2.0, .25, .6), (5.4, .18, .14), (8.9, .08, .06)]:
        ph = 2 * np.pi * np.cumsum(np.full_like(t, 1.0) * fc * r) / SR
        y += a * np.sin(ph + rng.random() * 6) * np.exp(-6.9 * t / t60)
    y[:240] += rng.standard_normal(240) * np.exp(-np.arange(240) / 30) * 0.3
    return fade(lp(y, 9000) * 0.16 * v)
def glock(p, v=0.6):
    f0 = f_(p); t = T(1.6)
    y = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.5) + 0.3 * np.sin(2 * np.pi * f0 * 2.76 * t) * np.exp(-t / 0.12) + 0.12 * np.sin(2 * np.pi * f0 * 5.4 * t) * np.exp(-t / 0.05)
    return fade(y * 0.11 * v)
def clar(p, d, v=0.6):
    f0 = f_(p); t = T(d); vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t) * np.clip(t / 0.4, 0, 1)
    ph = 2 * np.pi * np.cumsum(f0 * vib) / SR
    y = sum(a * np.sin(k * ph) for k, a in [(1, 1), (3, .45), (5, .22), (7, .1), (2, .06)])
    e = np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.12)
    return fade(lp(y * e, 2600) * 0.09 * v)
def flute(p, d, v=0.6):
    f0 = f_(p); t = T(d); vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip((t - 0.15) / 0.3, 0, 1)
    ph = 2 * np.pi * np.cumsum(f0 * vib) / SR
    y = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)
    br = bp(rng.standard_normal(len(t)), f0 * 0.8, f0 * 3) * 0.05
    e = np.minimum(1, t / 0.07) * np.minimum(1, (d - t) / 0.15)
    return fade((y + br) * e * 0.08 * v)
def wood(v=0.6, f=1100):
    t = T(0.12); y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.018) + 0.4 * np.sin(2 * np.pi * f * 1.6 * t) * np.exp(-t / 0.01)
    return fade(y * 0.18 * v, 0.0005, 0.02)
def shake(v=0.5):
    t = T(0.09); return fade(hp(rng.standard_normal(len(t)), 5000) * np.exp(-t / 0.03) * np.minimum(1, t / 0.01) * 0.05 * v, 0.001, 0.02)
def put(st, x, t, g=1.0, pan=0.0):
    if t < DUR - 0.05: add(ST[st], x, t, g, pan)

# 主题（2 小节）：开头两小节只出现它的前半句，结尾第一次完整出现
THEME = [('E5', 0, 1), ('G5', 1, 1), ('A5', 2, .5), ('G5', 2.5, .5), ('E5', 3, 1),
         ('D5', 4, 1), ('E5', 5, .5), ('D5', 5.5, .5), ('C5', 6, 2)]
for p, b, d in THEME[:5]: put('musicbox', mbox(p, 0.75), 0.15 + b * B, 1, 0.15)                    # 第 1 小节：前半句
for p, b, d in [('A4', 4, 1), ('C5', 5, 1), ('B4', 6, .5), ('G4', 6.5, 1.5)]: put('musicbox', mbox(p, 0.65), 0.15 + b * B, 1, 0.15)
for k in range(8): put('shaker', shake(0.6 if k % 2 else 0.9), BAR + k * B / 2, 1, 0.4)              # 第 2 小节加沙锤
for p, b, d in [('C3', 4, 1.6), ('G2', 5.7, 1.0)]: put('clarinet', clar(p, d * B, 0.8), 0.15 + b * B, 1, -0.3)
put('clarinet', clar('A2', 0.55, 0.6), 4.95, 1, -0.3)                                                 # 鼓气时单簧管"噗"的一个低音
# 5.2–5.6 全停
# 小熊：木鱼跟着拍胸口和 Z 字涂色
for t in [5.95, 6.25]: put('wood', wood(0.9, 900), t, 1, 0.3)
for k in range(6): put('wood', wood(0.6 + 0.1 * (k % 2), 1150 if k % 2 else 1300), 7.35 + k * 0.156, 1, 0.1)
for p, t in [('C5', 5.65), ('E5', 6.6), ('G5', 7.25), ('C6', 7.95)]: put('musicbox', mbox(p, 0.7), t, 1, 0.15)
put('clarinet', clar('F2', 1.2, 0.6), 6.6, 1, -0.3); put('clarinet', clar('G2', 0.9, 0.6), 7.6, 1, -0.3)
# 下雨：每被扫出一颗白蜡雨滴敲一个钢片琴音（量化到十六分音符，五声音阶向上爬）
PENTA = ['C6', 'D6', 'E6', 'G6', 'A6', 'C7', 'D7', 'E7']
slots = sorted({round(e['t'] / (B / 4)) for e in E['ev'] if e['type'] == 'glint'})
for i, s in enumerate(slots):
    t = s * B / 4; put('glock', glock(PENTA[(i * 3) % len(PENTA)], 0.55 + 0.25 * rng.random()), t, 1, float(np.clip(rng.uniform(-0.7, 0.7), -1, 1)))
for p, t, d in [('C3', 8.75, 1.4), ('A2', 10.15, 1.4)]: put('clarinet', clar(p, d, 0.7), t, 1, -0.3)
# 结尾：主题完整出现一次（长笛 + 八音盒），最后一句八音盒"发条走慢"
t0 = 11.6
for p, b, d in THEME[:5]: put('flute', flute(p, d * B * 0.95, 0.75), t0 + b * B, 1, -0.1); put('musicbox', mbox(p, 0.5), t0 + b * B, 1, 0.25)
for p, b in [('C3', 0), ('A2', 2), ('G2', 3.4)]: put('clarinet', clar(p, 2 * B * 0.95, 0.55), t0 + b * B, 1, -0.3)
# 主题后半句放慢收进 15 秒：D E D C 越来越慢，音高微微下垂
rit = [('D5', 13.75, 0.9), ('E5', 14.03, 0.9), ('D5', 14.35, 0.62), ('C5', 14.68, 0.3)]
for i, (p, t, d) in enumerate(rit): put('musicbox', mbox(p, 0.62 - 0.08 * i, d=d, droop=0.008 * i), t, 1, 0.2)

mix = sum(ST.values())
sf.write(os.path.join(HERE, 'score.wav'), mix.astype(np.float32), SR)
for k, x in ST.items(): sf.write(os.path.join(HERE, 'stems', k + '.wav'), x.astype(np.float32), SR)
print('score', DUR, 's  glints', len(slots), ' peak', np.abs(mix).max())
