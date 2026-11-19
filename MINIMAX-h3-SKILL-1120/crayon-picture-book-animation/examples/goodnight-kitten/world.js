// 纸面：2880×1620 的一页小卧室。床、窗、床头柜和台灯、藏在窗里的白蜡星星、群青夜色、被子
import { line, fill, ellipse, handCircle, smooth, CAM, W, H } from './crayon.js';
import { part } from './rig.js';
import { PAL } from './pal.js';
import { clamp, lerp, hash } from '/core/lib.js';
const K = PAL.crayon;
export const pr = (t, a, b) => clamp((t - a) / (b - a));
export const FLOOR = 1395;
export const KIT = { x: 1460, y: 1228 };
export const PUP = { x: 1170, y: 1232 };
export const WIN = { x0: 1250, y0: 170, x1: 2250, y1: 860, bx: 1750, by: 515 };
export const LAMP = { x: 1945, y: 1050 };
const L_ = (o, s, x = {}) => ({ w: 8, seed: s, col: K.ink, draw: o, ...x });

export function drawRoom(LF, LL, p) {
  // 地板线 + 地毯
  line(LL, [[-300, FLOOR], [3200, FLOOR + 6]], L_(p.l0, 11, { boil: 0.6 }));
  fill(LF, ellipse(1300, 1470, 560, 62, 40), { col: K.rose, p: 0.9, gap: 9, w: 11, ang: 0.15, seed: 12, over: 5, draw: p.f0, boil: 0 });
  line(LL, ellipse(1300, 1470, 560, 62, 48), L_(p.l0, 13, { w: 6, boil: 0.6 }));
  // 窗：窗框、十字、黄昏的几笔玫瑰色、窗帘
  const W0 = WIN;
  [[W0.x0, W0.y0, W0.x1, W0.y0], [W0.x1, W0.y0, W0.x1, W0.y1], [W0.x1, W0.y1, W0.x0, W0.y1], [W0.x0, W0.y1, W0.x0, W0.y0]].forEach(([a, b, c, d], i) => line(LL, [[a, b], [c, d]], L_(p.l1, 20 + i, { w: 10, boil: 0.6 })));
  fill(LF, [[W0.x0 - 18, W0.y1 - 6], [W0.x1 + 18, W0.y1 - 6], [W0.x1 + 30, W0.y1 + 34], [W0.x0 - 30, W0.y1 + 34]], { col: K.wood, p: 1, gap: 7, w: 9, ang: 0.1, seed: 25, over: 3, draw: p.f1, boil: 0 });
  line(LL, [[W0.x0 - 30, W0.y1 + 34], [W0.x1 + 30, W0.y1 + 34]], L_(p.l1, 26, { boil: 0.6 }));
  fill(LF, [[W0.bx - 12, W0.y0], [W0.bx + 12, W0.y0], [W0.bx + 12, W0.y1], [W0.bx - 12, W0.y1]], { col: K.wood, p: 1, gap: 6, w: 8, ang: 1.5, seed: 27, over: 2, draw: p.f1, boil: 0 });
  fill(LF, [[W0.x0, W0.by - 12], [W0.x1, W0.by - 12], [W0.x1, W0.by + 12], [W0.x0, W0.by + 12]], { col: K.wood, p: 1, gap: 6, w: 8, ang: 0.05, seed: 28, over: 2, draw: p.f1, boil: 0 });
  line(LL, [[W0.bx, W0.y0], [W0.bx, W0.y1]], L_(p.l1, 29, { w: 6, boil: 0.6 })); line(LL, [[W0.x0, W0.by], [W0.x1, W0.by]], L_(p.l1, 30, { w: 6, boil: 0.6 }));
  for (let i = 0; i < 4; i++) { const y = 700 + i * 34, x0 = W0.x0 + 40 + 90 * hash(i), x1 = W0.x1 - 60 - 120 * hash(i + 4); line(LF, [[x0, y], [x1, y + 6]], { w: 16, col: K.rose, p: 0.55, seed: 31 + i, draw: p.f1, boil: 0, wob: 2 }); }
  // 床头柜 + 台灯
  const tb = [[1850, 1145], [2050, 1145], [2050, FLOOR], [1850, FLOOR]];
  fill(LF, tb, { col: K.wood, p: 0.95, gap: 9, w: 11, ang: 1.3, seed: 50, over: 4, draw: p.f2, boil: 0 });
  line(LL, [...tb, tb[0]], L_(p.l2, 51, { boil: 0.6 }));
  line(LL, handCircle(1950, 1270, 12, 52, 0, 16), L_(p.l2, 53, { w: 5, boil: 0.6 }));
  line(LL, [[1945, 1145], [1945, 1085]], L_(p.l2, 54, { w: 9, boil: 0.6 }));
  fill(LF, ellipse(1945, 1140, 46, 12, 24), { col: K.wood, p: 1, gap: 5, w: 7, seed: 55, draw: p.f2, boil: 0 });
  const sh = [[1885, 990], [2005, 990], [2040, 1085], [1850, 1085]];
  fill(LF, sh, { col: K.lemon, p: 1, gap: 8, w: 10, ang: 0.4, seed: 56, over: 4, draw: p.f2, boil: 0, cross: true, crossP: 0.5 });
  line(LL, [...sh, sh[0]], L_(p.l2, 57, { boil: 0.6 }));
}
// 床：儿童视角，正面一块板 + 斜着的床面，床头板在右边
export function drawBed(LF, LL, p) {
  const top = [[960, 1250], [1730, 1250], [1760, 1158], [1010, 1158]];
  fill(LF, top, { col: K.mint, p: 0.9, gap: 9, w: 11, ang: 0.2, seed: 60, over: 4, draw: p.f, boil: 0 });
  line(LL, [...top, top[0]], L_(p.l, 61, { boil: 0.6 }));
  const front = [[950, 1250], [1740, 1250], [1740, 1370], [950, 1370]];
  fill(LF, front, { col: K.wood, p: 0.95, gap: 9, w: 11, ang: 1.25, seed: 62, over: 4, draw: p.f, boil: 0 });
  line(LL, [...front, front[0]], L_(p.l, 63, { boil: 0.6 }));
  [[965, 1370, 965, FLOOR], [1725, 1370, 1725, FLOOR]].forEach(([a, b, c, d], i) => line(LL, [[a, b], [c, d]], L_(p.l, 64 + i, { w: 12, boil: 0.6 })));
  const hb = smooth([[1720, 1380], [1720, 1000], [1760, 940], [1800, 1000], [1800, 1380]], 5, false);
  fill(LF, hb, { col: K.wood, p: 0.95, gap: 9, w: 11, ang: 1.4, seed: 66, over: 4, draw: p.f, boil: 0 });
  line(LL, hb, L_(p.l, 67, { boil: 0.6 }));
  const pil = ellipse(1625, 1140, 92, 40, 36, 0, Math.PI * 2, -0.1);
  fill(LF, pil, { col: K.cream, p: 0.9, gap: 8, w: 10, ang: 0.3, seed: 68, over: 3, draw: p.f, boil: 0 });
  line(LL, pil, L_(p.l, 69, { w: 7, boil: 0.6 }));
}
// 被子：盖住两个小家伙的下半身。progress 0–1 = 黄蜡笔涂出来的进度
export const QUILT = smooth([[1000, 1170], [1250, 1150], [1520, 1166], [1700, 1150], [1745, 1260], [1740, 1340], [1350, 1356], [960, 1340], [948, 1250]], 4);
export function drawQuilt(C, q) {
  part(C, QUILT, { col: K.lemon, p: 1.0, gap: 8, w: 11, ang: 0.9, seed: 80, over: 6, draw: q, cross: true, crossP: 0.5 }, q > 0.85 ? { w: 7, seed: 81, col: K.ink, draw: (q - 0.85) / 0.15 } : null);
  if (q > 0.6) {
    const d = (q - 0.6) / 0.4;
    [[1100, 1230, K.rose], [1330, 1280, K.mint], [1560, 1225, K.rose], [1240, 1205, K.mint], [1480, 1300, K.coral]].forEach(([x, y, c], i) => {
      const sq = [[x - 40, y - 26], [x + 40, y - 30], [x + 44, y + 28], [x - 38, y + 30]];
      fill(C.f, sq, { col: c, p: 1, gap: 6, w: 9, ang: -0.6, seed: 82 + i, over: 2, draw: d });
      if (d > 0.8) line(C.l, [...sq, sq[0]], { w: 4, seed: 90 + i, col: K.ink, p: 0.7, wob: 0.6 });
    });
    if (q >= 1) line(C.l, [[990, 1190], [1240, 1172], [1520, 1188], [1712, 1172]], { w: 5, seed: 99, col: K.wood, p: 0.8 });
  }
}

// 藏在窗里的白蜡：星星，以及一只小猫和一只小狗的星座
function inWin(x, y, m = 30) { return x > WIN.x0 + m && x < WIN.x1 - m && y > WIN.y0 + m && y < WIN.y1 - 60 && Math.abs(x - WIN.bx) > m && Math.abs(y - WIN.by) > m; }
export const CAT_C = [[1400, 420], [1420, 330], [1470, 385], [1520, 330], [1545, 420], [1475, 470]].map(([x, y]) => [x - 20, y - 20]);
export const DOG_C = [[1880, 330], [1960, 300], [2040, 330], [2060, 400], [1965, 450], [1870, 400], [1840, 470], [2090, 470]];
const CAT_E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]], DOG_E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [3, 7]];
export const STARS = [];
CAT_C.forEach(([x, y], i) => STARS.push({ x, y, r: 15, big: true, seed: 1100 + i }));
DOG_C.forEach(([x, y], i) => STARS.push({ x, y, r: i > 5 ? 11 : 15, big: true, seed: 1120 + i }));
for (let i = 0; i < 140 && STARS.length < 60; i++) {
  const x = WIN.x0 + 50 + hash(i * 2.3) * 900, y = WIN.y0 + 40 + hash(i * 5.1) * 560;
  if (!inWin(x, y, 40)) continue;
  if (STARS.some(s => Math.hypot(s.x - x, s.y - y) < 70)) continue;
  STARS.push({ x, y, r: 6 + hash(i * 1.7) * 7, big: hash(i * 8.3) > 0.6, seed: 1200 + i });
}
export function star(L, x, y, r, seed) {
  const pts = []; for (let k = 0; k <= 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5; const rr = k % 2 ? r * 0.46 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  fill(L, pts, { col: K.white, p: 1.1, gap: 4, w: 6, over: 1, seed, boil: 0 });
  line(L, pts, { col: K.white, w: 5, p: 1.1, seed: seed + 1, wob: 0.3, boil: 0 });
}
export function drawStars(L) {
  STARS.forEach(s => star(L, s.x, s.y, s.r, s.seed));
  [[CAT_C, CAT_E], [DOG_C, DOG_E]].forEach(([P, E], j) => E.forEach(([a, b], i) => line(L, [P[a], P[b]], { col: K.white, w: 5, p: 1.05, seed: 1400 + j * 20 + i, wob: 0.4, boil: 0 })));
}
// 群青夜色：一道笔刷从左往右刷过窗玻璃
export const BAND = { t0: 9.45, t1: 11.15 };
const X0 = WIN.x0 - 80, X1 = WIN.x1 + 120;
export const washFront = t => { const u = clamp((t - BAND.t0) / (BAND.t1 - BAND.t0)); const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; return lerp(X0, X1, 0.15 * u + 0.85 * e); };
export function drawWash(LW, t) {
  if (t < BAND.t0) return;
  const g = LW.g; g.save();
  g.setTransform(CAM.s, 0, 0, CAM.s, W / 2 - CAM.x * CAM.s, H / 2 - CAM.y * CAM.s);
  g.beginPath(); g.rect(WIN.x0 - 4, WIN.y0 - 4, WIN.x1 - WIN.x0 + 8, WIN.y1 - WIN.y0 + 8); g.clip();
  const f = washFront(t), y0 = WIN.y0 - 40, y1 = WIN.y1 + 40;
  const fx = y => f + 60 * Math.sin(clamp((y - y0) / (y1 - y0)) * Math.PI) + 12 * Math.sin(y * 0.05);
  g.beginPath(); g.moveTo(X0, y0); for (let y = y0; y <= y1; y += 20) g.lineTo(fx(y), y); g.lineTo(X0, y1); g.closePath();
  g.fillStyle = 'rgba(0,0,0,0.7)'; g.fill();
  for (let k = 0; k < 12; k++) { const yy = lerp(y0, y1, (k + 0.5) / 12); g.beginPath(); g.moveTo(X0, yy); g.lineTo(fx(yy) - 30, yy + 4 * Math.sin(k)); g.lineWidth = 6 + 6 * hash(k); g.strokeStyle = `rgba(0,0,0,${0.06 + 0.06 * hash(k * 2)})`; g.stroke(); }
  if (t < BAND.t1) { g.beginPath(); for (let y = y0; y <= y1; y += 20) { const x = fx(y); y === y0 ? g.moveTo(x - 36, y) : g.lineTo(x - 36, y); } g.lineWidth = 56; g.strokeStyle = 'rgba(0,0,0,0.2)'; g.stroke(); }
  g.restore();
}
export function starRevealT(s) { let a = BAND.t0, b = BAND.t1; for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (washFront(m) > s.x) b = m; else a = m; } return b; }

// 窗帘：在水彩之后合成，不被夜色染到
export function drawCurtains(LF, LL, p) {
  const W0 = WIN;
  [[W0.x0 - 90, W0.x0 + 30], [W0.x1 - 30, W0.x1 + 90]].forEach(([a, b], i) => {
    const m = (a + b) / 2, cur = smooth([[a, W0.y0 - 40], [b, W0.y0 - 40], [b - 6, 470], [m + 18 * (i ? 1 : -1), 560], [b + 6, 900], [a - 6, 900], [m - 18 * (i ? 1 : -1), 560], [a + 6, 470]], 4);
    fill(LF, cur, { col: K.coral, p: 0.9, gap: 9, w: 11, ang: 1.45, seed: 40 + i, over: 4, draw: p.f1, boil: 0 }); line(LL, [...cur, cur[0]], L_(p.l1, 44 + i, { w: 7, boil: 0.6 }));
  });
}
