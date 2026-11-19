// 纸面：2880×1620 的一页。草地、藏在纸上的白蜡雨滴和水洼、群青水彩、书桌
import { line, fill, ellipse, CAM, W, H, sx, sy } from './crayon.js';
import { PAL } from './pal.js';
import { clamp, lerp, hash } from '/core/lib.js';
const K = PAL.crayon;
export const PAGE = { w: 2880, h: 1620 };
export const pr = (t, a, b) => clamp((t - a) / (b - a));
export const groundY = x => 1300 + 26 * Math.sin(x * 0.0021 + 0.6) + 12 * Math.sin(x * 0.0063);
export const BUNNY = { x: 1290, y: 1322 };
export const BEAR = { x: 1680, y: 1318 };
export const CLOUD = { x: 1480, y: 330 };
export const SHELTER = [[1040, 790], [1960, 790], [1990, 1350], [1010, 1350]];
const inShelter = (x, y) => x > 1000 && x < 2000 && y > 640 && y < 1360;

// 藏起来的白蜡：雨滴（天上）和水洼的涟漪（地上）
export const DROPS = [];
for (let i = 0; i < 170; i++) {
  const gx = i % 17, gy = Math.floor(i / 17);
  const x = 60 + gx * 162 + (hash(i * 3.1) - 0.5) * 120, y = 70 + gy * 118 + (hash(i * 7.7) - 0.5) * 80;
  if (inShelter(x, y) || y > groundY(x) - 30) continue;
  if (Math.abs(x - CLOUD.x) < 270 && Math.abs(y - CLOUD.y) < 150) continue;
  DROPS.push({ x, y, r: 11 + hash(i * 1.3) * 7, big: hash(i * 5.9) > 0.55, seed: 1200 + i });
}
export const RIPPLES = [];
for (let i = 0; i < 26; i++) {
  const x = 80 + i * 108 + (hash(i * 2.2) - 0.5) * 60, y = 1430 + hash(i * 4.4) * 150;
  if (x > 1000 && x < 2000) continue;
  RIPPLES.push({ x, y, r: 30 + hash(i * 9.1) * 26, seed: 1500 + i });
}
function drop(L, d) {
  const pts = []; for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2; const r = d.r * (1 - 0.55 * Math.max(0, -Math.sin(a)) ** 3); pts.push([d.x + Math.cos(a) * r * 0.75, d.y + Math.sin(a) * r * (Math.sin(a) < 0 ? 1.9 : 1)]); }
  fill(L, pts, { col: K.white, p: 1.1, gap: 4, w: 6, over: 1, seed: d.seed, boil: 0 });
  line(L, pts, { col: K.white, w: 5, p: 1.1, seed: d.seed + 1, wob: 0.3, boil: 0 });
}
export function drawHidden(L) {
  DROPS.forEach(d => drop(L, d));
  RIPPLES.forEach(r => {
    line(L, ellipse(r.x, r.y, r.r, r.r * 0.32, 30, 0.3, Math.PI * 2 - 0.4), { col: K.white, w: 6, p: 1.1, seed: r.seed, boil: 0 });
    line(L, ellipse(r.x, r.y, r.r * 0.5, r.r * 0.16, 20, 0.6, Math.PI * 2 - 0.2), { col: K.white, w: 5, p: 1.1, seed: r.seed + 1, boil: 0 });
  });
}
// 草地：地平线 + 草绿涂色 + 几簇小草
export function drawGround(LF, LL, p) {
  const top = []; for (let x = -300; x <= 3180; x += 30) top.push([x, groundY(x)]);
  const poly = [...top, [3180, groundY(3180) + 70], ...top.slice().reverse().map(([x, y]) => [x, y + 70 + 10 * Math.sin(x * 0.01)])];
  fill(LF, poly, { col: K.grass, p: 1.0, gap: 9, w: 11, ang: 1.25, seed: 41, over: 6, draw: p.gf, boil: 0.4 });
  line(LL, top, { w: 8, seed: 42, draw: p.gl, boil: 0.6 });
  for (let i = 0; i < 26; i++) {
    const x = -120 + i * 125 + hash(i) * 60, y = groundY(x) + 2;
    if (x > 1080 && x < 1880) continue;
    line(LL, [[x - 10, y], [x - 16, y - 26]], { w: 5, col: K.grass, seed: 60 + i, p: 1, draw: p.gf, boil: 0.6 });
    line(LL, [[x, y], [x + 2, y - 34]], { w: 5, col: K.grass, seed: 90 + i, p: 1, draw: p.gf, boil: 0.6 });
    line(LL, [[x + 10, y], [x + 18, y - 24]], { w: 5, col: K.grass, seed: 120 + i, p: 1, draw: p.gf, boil: 0.6 });
  }
}

// 群青水彩：两道笔刷从左往右，叶子底下留干
export const BANDS = [
  { y0: -120, y1: 820, t0: 8.75, t1: 9.95, seed: 1 },
  { y0: 760, y1: 1720, t0: 9.45, t1: 10.75, seed: 2 },
];
const X0 = -320, X1 = 3200;
export const bandFront = (b, t) => { const u = clamp((t - b.t0) / (b.t1 - b.t0)); const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; return lerp(X0, X1, 0.15 * u + 0.85 * e); };
export function drawWash(LW, t) {
  const g = LW.g; g.save();
  g.setTransform(CAM.s, 0, 0, CAM.s, W / 2 - CAM.x * CAM.s, H / 2 - CAM.y * CAM.s);
  for (const b of BANDS) {
    if (t < b.t0) continue;
    const f = bandFront(b, t), moving = t < b.t1;
    const fx = y => f + 80 * Math.sin(clamp((y - b.y0) / (b.y1 - b.y0)) * Math.PI) + 14 * Math.sin(y * 0.05);
    g.beginPath(); g.moveTo(X0 - 60, b.y0 + 10 * Math.sin(b.seed));
    for (let x = X0; x <= f; x += 40) g.lineTo(x, b.y0 + 8 * Math.sin(x * 0.03 + b.seed) + 6 * hash(x + b.seed));
    for (let y = b.y0; y <= b.y1; y += 20) g.lineTo(fx(y), y);
    for (let x = f; x >= X0; x -= 40) g.lineTo(x, b.y1 + 8 * Math.sin(x * 0.027 + b.seed * 2) + 6 * hash(x * 1.3 + b.seed));
    g.closePath();
    g.fillStyle = `rgba(0,0,0,0.62)`; g.fill();
    // 鬃毛痕迹：细而淡
    for (let k = 0; k < 14; k++) {
      const yy = lerp(b.y0, b.y1, (k + 0.5) / 14) + 6 * Math.sin(k * 3.1);
      g.beginPath(); g.moveTo(X0, yy); g.lineTo(fx(yy) - 30, yy + 4 * Math.sin(k)); g.lineWidth = 6 + 6 * hash(k + b.seed); g.strokeStyle = `rgba(0,0,0,${0.06 + 0.06 * hash(k * 2 + b.seed)})`; g.stroke();
    }
    if (moving) {   // 湿的前沿颜色更深
      g.beginPath(); for (let y = b.y0; y <= b.y1; y += 20) { const x = fx(y); y === b.y0 ? g.moveTo(x - 40, y) : g.lineTo(x - 40, y); }
      g.lineWidth = 60; g.strokeStyle = 'rgba(0,0,0,0.18)'; g.stroke();
    }
  }
  // 叶子下面是干的
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
  g.beginPath(); SHELTER.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.filter = 'blur(10px)'; g.fill(); g.filter = 'none';
  g.restore();
}
// 每颗白蜡雨滴被前沿扫到的时刻
export function dropRevealT(d) {
  const b = d.y < 790 ? BANDS[0] : BANDS[1];
  let lo_ = b.t0, hi = b.t1; for (let i = 0; i < 30; i++) { const m = (lo_ + hi) / 2; if (bandFront(b, m) > d.x) hi = m; else lo_ = m; }
  return hi;
}

// 书桌：纸页外面是木桌和两支蜡笔（屏幕空间，叠在纸面之上，纸页处挖空）
export function drawDesk(L) {
  const g = L.g; const x0 = sx(0), y0 = sy(0), x1 = sx(PAGE.w), y1 = sy(PAGE.h);
  if (x0 <= 0 && y0 <= 0 && x1 >= W && y1 >= H) return false;
  g.save();
  g.fillStyle = '#a8784e'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 46; i++) { const y = sy(-1400 + i * 100 + 30 * hash(i)); g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 60) g.lineTo(x, y + 6 * Math.sin(x * 0.004 + i) * CAM.s * 2); g.lineWidth = 2 + 3 * hash(i * 3); g.strokeStyle = `rgba(90,52,28,${0.25 + 0.2 * hash(i * 7)})`; g.stroke(); }
  g.fillStyle = 'rgba(60,35,20,0.35)'; g.filter = 'blur(12px)'; g.fillRect(x0 + 10, y0 + 14, x1 - x0, y1 - y0); g.filter = 'none';
  g.globalCompositeOperation = 'destination-out'; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.globalCompositeOperation = 'source-over';
  const crayon = (wx, wy, rot, col) => {
    g.save(); g.translate(sx(wx), sy(wy)); g.rotate(rot); const s = CAM.s, Lc = 420 * s, R = 26 * s;
    g.fillStyle = col; g.fillRect(-Lc / 2, -R, Lc, 2 * R);
    g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(-Lc * 0.25, -R, Lc * 0.4, 2 * R);
    g.fillStyle = col; g.beginPath(); g.moveTo(Lc / 2, -R); g.lineTo(Lc / 2 + 60 * s, 0); g.lineTo(Lc / 2, R); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(-Lc / 2, R * 0.4, Lc, R * 0.6);
    g.restore();
  };
  crayon(3260, 1180, -0.35, K.grass); crayon(3200, 1460, 0.12, K.coral); crayon(-380, 360, 1.9, K.lemon);
  g.restore();
  return true;
}
