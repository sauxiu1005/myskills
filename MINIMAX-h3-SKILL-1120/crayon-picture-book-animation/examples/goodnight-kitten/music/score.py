"""《晚安，小猫》原创摇篮曲：3/4，72 BPM，F 大调，15 秒（每小节 2.5 秒，共 6 小节）
全部用 numpy 合成：尼龙吉他（拨弦模型）、八音盒、钢片琴、单簧管、木鱼、沙锤。
运行：$LIB/.venv/bin/python music/score.py  → music/score.wav、music/stems/*.wav
"""
import os, sys, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(os.environ['LIB'], 'core/audio'))
from sfx import SR, add, bp, lp, hp
E = json.load(open(os.path.join(ROOT, 'events.json'))); DUR = E['dur']; N = int(DUR * SR)
B = 60 / 72; BAR = 3 * B
rng = np.random.default_rng(5)
ST = {k: np.zeros((N, 2)) for k in ['guitar', 'musicbox', 'glock', 'clarinet', 'wood', 'shaker']}
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

def guitar(p, v=0.6, d=2.4):   # Karplus-Strong 拨弦，加一点琴体低通
    f0 = f_(p); n = int(d * SR); L = int(SR / f0); buf = lp(rng.standard_normal(L), 3500) * 0.5; y = np.zeros(n); i = 0
    for k in range(n):
        y[k] = buf[i]; j = (i + 1) % L; buf[i] = 0.4985 * (buf[i] + buf[j]); i = j
    return fade(lp(y, 2800) * 0.22 * v, 0.001, 0.2)

# 主题（F 大调，3/4，12 拍）：A G F | G(2) A | C A G | F(3)
THEME = [('A5', 1), ('G5', 1), ('F5', 1), ('G5', 2), ('A5', 1), ('C6', 1), ('A5', 1), ('G5', 1), ('F5', 3)]
# 0–8.6：尼龙吉他分解和弦，每小节 F→Dm→Bb→C 循环（低音 + 两个上方音）
CH = [('F2', 'C4', 'A4'), ('D3', 'A3', 'F4'), ('A#2', 'F3', 'D4'), ('C3', 'G3', 'E4')]
for bar in range(4):
    t0 = 0.1 + bar * BAR; lo, m, h = CH[bar % 4]
    for k, (p, b) in enumerate([(lo, 0), (m, 1), (h, 1.5), (m, 2), (h, 2.5)]):
        put('guitar', guitar(p, 0.75 if k == 0 else 0.5), t0 + b * B, 1, -0.25 + 0.15 * k)
# 3.85–5.45 小狗跑来：木鱼 + 沙锤跟着脚步，单簧管两个俏皮低音
for k in range(10): put('wood', wood(0.55 + 0.15 * (k % 2), 1250 if k % 2 else 1050), 3.9 + k * B / 2, 1, -0.5 + 0.06 * k)
for k in range(10): put('shaker', shake(0.7), 3.9 + B / 4 + k * B / 2, 1, 0.4)
put('clarinet', clar('C3', 0.42, 0.75), 4.3, 1, -0.3); put('clarinet', clar('F2', 0.55, 0.75), 4.9, 1, -0.3)
# 6.0–8.6 涂被子：八音盒前半句
t0 = 6.05; bt = 0
for p, d in THEME[:5]: put('musicbox', mbox(p, 0.7), t0 + bt * B * 0.9, 1, 0.15); bt += d
put('clarinet', clar('A#2', 1.6, 0.5), 6.05, 1, -0.3); put('clarinet', clar('C3', 1.2, 0.5), 7.6, 1, -0.3)
# 8.6–9.0 全停
# 9–12 星星：每亮一颗敲一个钢片琴音，按顺序连起来就是主旋律
gt = sorted(e['t'] for e in E['ev'] if e['type'] == 'glint'); slots = []
for t in gt:
    if not slots or t - slots[-1] >= 0.1: slots.append(t)
GL = ['A6', 'G6', 'F6', 'G6', 'A6', 'C7', 'A6', 'G6', 'F6']
for i, t in enumerate(slots[:9]): put('glock', glock(GL[i], 0.5 + 0.2 * rng.random()), t, 1, float(rng.uniform(-0.6, 0.6)))
put('clarinet', clar('F2', 2.4, 0.45), 9.5, 1, -0.3)
for k, (p, b) in enumerate([('F2', 0), ('C4', 1), ('A4', 1.5), ('C4', 2)]): put('guitar', guitar(p, 0.4), 10.9 + b * B, 1, -0.2)
# 12–15 晚安：八音盒把主题完整奏一遍，"发条走慢"，音高下垂，15 秒前收住
times = [12.05, 12.38, 12.71, 13.05, 13.5, 13.82, 14.12, 14.4, 14.68]
for i, ((p, d), t) in enumerate(zip(THEME, times)):
    put('musicbox', mbox(p, 0.66 - 0.035 * i, d=1.4 if i < 8 else 0.3, droop=0.0 if i < 5 else 0.004 * (i - 4)), t, 1, 0.2)
for p, t in [('F2', 12.05), ('A#2', 13.05), ('C3', 13.82)]: put('guitar', guitar(p, 0.35, 1.4), t, 1, -0.2)

mix = sum(ST.values())
sf.write(os.path.join(HERE, 'score.wav'), mix.astype(np.float32), SR)
for k, x in ST.items(): sf.write(os.path.join(HERE, 'stems', k + '.wav'), x.astype(np.float32), SR)
print('score', DUR, 's  stars', len(slots), ' peak', np.abs(mix).max())
