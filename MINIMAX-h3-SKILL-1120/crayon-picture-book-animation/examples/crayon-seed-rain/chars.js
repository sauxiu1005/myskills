// 角色：小兔、小熊、乌云、大叶子。参数化：表情 × 姿势，局部原点在两脚中间
import { line, fill, dab, ellipse, handCircle, xf, smooth } from './crayon.js';
import { part as rpart, tube, curve } from './rig.js';
import { PAL } from './pal.js';
import { clamp, lerp } from '/core/lib.js';
const K = PAL.crayon;
const LW = 7;
export const DR = { l: 1, f: 1 };
const lo = (seed, x = {}) => ({ w: LW, seed, draw: DR.l, ...x });
const fo = (col, seed, x = {}) => ({ col, p: 0.8, gap: 9, w: 11, ang: 0.6, seed, over: 4, draw: DR.f, ...x });
const part = (C, poly, f, l, opt) => rpart(C, poly, f, l, opt);
function T0(o) { const k = o.flip ? -1 : 1; return pts => xf(pts, { x: o.x || 0, y: o.y || 0, s: o.s || 1, r: o.r || 0, sx: k }); }

function eyes(C, P, xs, y, ex, look, sd, big = 1) {
  xs.forEach((x, i) => {
    const s = sd + i * 7;
    if (ex === 'happy') { line(C.l, P([[x - 11, y + 5], [x - 5, y - 5], [x + 5, y - 5], [x + 11, y + 5]]), lo(s, { w: 5.5, taper: 0.3 })); return; }
    if (ex === 'closed') { line(C.l, P([[x - 11, y - 2], [x - 5, y + 5], [x + 5, y + 5], [x + 11, y - 2]]), lo(s, { w: 5.5, taper: 0.3 })); return; }
    const r = (ex === 'wow' ? 10.5 : 8) * big;
    const ex_ = x + look[0] * 5, ey = y + look[1] * 6;
    part(C, P(ellipse(ex_, ey, r * 0.85, r * 1.1, 16)), { col: K.ink, p: 1, gap: 3.2, w: 5, over: 0.5, seed: s, ang: 1.3, draw: DR.f }, lo(s + 1, { w: 4 }), { occ: false });
    if (DR.f > 0.9) dab(C.l, ...P([[ex_ + 3, ey - 4]])[0], 2.6, { col: K.white, p: 1, seed: s + 2, gap: 2, w: 3 });
  });
}
function brows(C, P, xs, y, kind, sd) {
  xs.forEach((x, i) => {
    const inner = x < 0 ? 1 : -1;   // 指向脸中线的方向
    const dy = kind === 'worried' ? -7 : kind === 'grumpy' ? 7 : 0;
    const a = [x - inner * 11, y], b = [x + inner * 11, y + dy];
    line(C.l, P([a, b]), lo(sd + i, { w: 5, p: 0.9 }));
  });
}
function mouthAt(C, P, x, y, ex, sd, open) {
  if (ex === 'talk' && open) { part(C, P(ellipse(x, y + 4, 9, 10, 20)), { col: K.coral, p: 0.95, gap: 3, w: 4, over: 0.5, seed: sd, draw: DR.f }, lo(sd + 1, { w: 4.5 }), { occ: false }); return; }
  if (ex === 'happy' || ex === 'wow' && open) {
    const m = ex === 'wow' ? ellipse(x, y + 5, 8, 10, 18) : [[x - 15, y - 2], [x - 8, y + 10], [x + 8, y + 10], [x + 15, y - 2]];
    part(C, P(m), { col: K.coral, p: 0.95, gap: 3, w: 4, over: 0.5, seed: sd, draw: DR.f }, lo(sd + 1, { w: 4.5 }), { occ: false }); return;
  }
  if (ex === 'worried') { line(C.l, P([[x - 9, y + 5], [x - 3, y], [x + 3, y], [x + 9, y + 5]]), lo(sd, { w: 4.5 })); return; }
  if (ex === 'puff') { part(C, P(handCircle(x, y + 2, 6, sd, 0, 14)), { col: K.coral, p: 0.9, gap: 3, w: 4, over: 0.5, seed: sd, draw: DR.f }, lo(sd + 1, { w: 4 }), { occ: false }); return; }
  // 平静 / 说话闭口：小小的 ω
  line(C.l, P([[x - 12, y], [x - 6, y + 5], [x, y], [x + 6, y + 5], [x + 12, y]]), lo(sd, { w: 4.5 }));
}

// ———————— 小兔：奶油色身体、天蓝小裙子、柠檬黄雨靴，情绪靠耳朵 ————————
const BUNNY_ARMS = {
  stand: [[[-36, -178], [-58, -140], [-66, -100]], [[36, -178], [58, -140], [66, -100]]],
  point: [[[-36, -178], [-58, -140], [-66, -100]], [[36, -178], [72, -214], [96, -262]]],
  worried: [[[-36, -178], [-50, -148], [-16, -136]], [[36, -178], [50, -148], [16, -136]]],
  happy: [[[-36, -178], [-82, -214], [-104, -258]], [[36, -178], [82, -214], [104, -258]]],
};
export function bunny(C, o) {
  const P = T0(o), sd = o.seed || 100, ex = o.expr || 'calm', look = o.look || [0, 0];
  const ear = o.ear ?? 0;
  // 耳朵（在头后面）
  [-1, 1].forEach((k, i) => {
    const a = k * (0.16 + 1.72 * ear + (o.earWiggle || 0));
    const ang = -Math.PI / 2 + a, L = 138, Wd = 27;
    const bx = k * 28, by = -296;
    const cx = bx + Math.cos(ang) * L * 0.5, cy = by + Math.sin(ang) * L * 0.5;
    part(C, P(ellipse(cx, cy, L * 0.55, Wd, 36, 0, Math.PI * 2, ang)), fo(K.cream, sd + 1 + i, { p: 0.62, ang: ang + 0.4 }), lo(sd + 3 + i));
    part(C, P(ellipse(cx + Math.cos(ang) * 8, cy + Math.sin(ang) * 8, L * 0.38, Wd * 0.45, 28, 0, Math.PI * 2, ang)), fo(K.coral, sd + 5 + i, { p: 0.85, gap: 6, w: 8, over: 2 }), null, { occ: false, kn: false });
  });
  // 腿和雨靴
  [-1, 1].forEach((k, i) => {
    part(C, P(tube([[k * 24, -84], [k * 25, -40]], 26)), fo(K.cream, sd + 10 + i, { p: 0.62 }), lo(sd + 12 + i));
    const boot = smooth([[k * 12, -48], [k * 40, -48], [k * 42, -14], [k * 46, -2], [k * 40, 6], [k * 4, 6], [k * 10, -14]].map(([x, y]) => [x, y]), 4);
    part(C, P(boot), fo(K.lemon, sd + 14 + i, { p: 0.95, gap: 7, w: 9, ang: 1.2 }), lo(sd + 16 + i));
  });
  // 裙子
  const dress = smooth([[-34, -196], [34, -196], [58, -124], [80, -66], [40, -58], [0, -62], [-40, -58], [-80, -66], [-58, -124]], 5);
  part(C, P(dress), fo(K.sky, sd + 20, { p: 0.9, ang: 0.35 }), lo(sd + 21));
  // 手臂
  const arms = o.arms || BUNNY_ARMS[o.pose || 'stand'];
  arms.forEach((pts, i) => {
    part(C, P(tube(curve(pts, 5), 22)), fo(K.cream, sd + 24 + i, { p: 0.62 }), lo(sd + 26 + i));
    const h = pts[pts.length - 1];
    part(C, P(handCircle(h[0], h[1], 14, sd + i, 0, 18)), fo(K.cream, sd + 28 + i, { p: 0.62, gap: 6, w: 8 }), lo(sd + 30 + i, { w: 5.5 }));
  });
  // 头
  part(C, P(ellipse(0, -250, 76, 64, 44)), fo(K.cream, sd + 40, { p: 0.6, ang: 0.5 }), lo(sd + 41));
  const bl = o.blush ?? 0;
  [[-46, -228], [46, -228]].forEach(([x, y], i) => dab(C.f, ...P([[x, y]])[0], (11 + 7 * bl) * (o.s || 1), { col: K.coral, p: 0.7 + 0.3 * bl, seed: sd + 44 + i, sq: 0.7 }));
  eyes(C, P, [-27, 27], -258, ex, look, sd + 50);
  if (ex === 'worried') brows(C, P, [-27, 27], -282, 'worried', sd + 60);
  part(C, P(ellipse(0, -240, 8, 5.5, 14)), { col: K.coral, p: 1, gap: 3, w: 4, over: 0.5, seed: sd + 62, draw: DR.f }, null, { occ: false });
  mouthAt(C, P, 0, -228, ex, sd + 64, o.open);
}

// ———————— 小熊：土棕色、蜂蜜色肚皮，比小兔高半个头 ————————
const BEAR_ARMS = {
  stand: [[[-84, -192], [-110, -146], [-116, -100]], [[84, -192], [110, -146], [116, -100]]],
  chest: [[[-84, -192], [-110, -146], [-116, -100]], [[84, -192], [70, -150], [26, -158]]],
  hold: [[[-84, -192], [-110, -146], [-116, -100]], [[84, -192], [126, -246], [138, -312]]],
  leaf: [[[-84, -192], [-104, -150], [-96, -112]], [[84, -192], [112, -262], [92, -340]]],
};
export const BEAR_HAND = pose => { const a = (BEAR_ARMS[pose] || BEAR_ARMS.stand)[1]; return a[a.length - 1]; };
export function bear(C, o) {
  const P = T0(o), sd = o.seed || 300, ex = o.expr || 'calm', look = o.look || [0, 0];
  // 耳朵
  [-1, 1].forEach((k, i) => {
    part(C, P(handCircle(k * 66, -372, 31, sd + i, 0, 26)), fo(K.brown, sd + 1 + i, { p: 0.85 }), lo(sd + 3 + i));
    part(C, P(handCircle(k * 66, -370, 15, sd + 5 + i, 0, 18)), fo(K.honey, sd + 6 + i, { p: 0.9, gap: 6, w: 8 }), null, { occ: false, kn: false });
  });
  // 腿
  [-1, 1].forEach((k, i) => {
    part(C, P(ellipse(k * 48, -26, 38, 32, 28)), fo(K.brown, sd + 10 + i, { p: 0.85 }), lo(sd + 12 + i));
    part(C, P(ellipse(k * 50, -16, 18, 12, 18)), fo(K.honey, sd + 14 + i, { p: 0.9, gap: 6, w: 8 }), null, { occ: false, kn: false });
  });
  // 身体 + 肚皮
  part(C, P(ellipse(0, -138, 106, 112, 48)), fo(K.brown, sd + 20, { p: 0.85, ang: 0.4 }), lo(sd + 21));
  part(C, P(ellipse(0, -124, 64, 72, 40)), fo(K.honey, sd + 22, { p: 0.9, ang: 0.9 }), lo(sd + 23, { w: 5, p: 0.7 }));
  // 手臂
  const arms = o.arms || BEAR_ARMS[o.pose || 'stand'];
  arms.forEach((pts, i) => {
    part(C, P(tube(curve(pts, 5), 36, 32)), fo(K.brown, sd + 24 + i, { p: 0.85 }), lo(sd + 26 + i));
  });
  // 手里的绿蜡笔
  if (o.crayon) {
    const h = arms[1][arms[1].length - 1], q = arms[1][arms[1].length - 2];
    const dx = h[0] - q[0], dy = h[1] - q[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const a = [h[0] - ux * 8, h[1] - uy * 8], b = [h[0] + ux * 62, h[1] + uy * 62];
    part(C, P(tube([a, b], 18)), fo(K.leaf, sd + 30, { p: 1, gap: 5, w: 7 }), lo(sd + 31, { w: 5 }));
    const tip = [b[0] + ux * 18, b[1] + uy * 18], nx = -uy * 8, ny = ux * 8;
    part(C, P([[b[0] + nx, b[1] + ny], tip, [b[0] - nx, b[1] - ny]]), fo(K.grass, sd + 32, { p: 1, gap: 4, w: 6, over: 1 }), lo(sd + 33, { w: 4.5 }));
    // 手掌盖在蜡笔上
    part(C, P(handCircle(h[0], h[1], 18, sd + 34, 0, 18)), fo(K.brown, sd + 35, { p: 0.85, gap: 6, w: 8 }), lo(sd + 36, { w: 5.5 }));
  }
  if (o.pose === 'chest') { const h = arms[1][2]; part(C, P(handCircle(h[0], h[1], 18, sd + 37, 0, 18)), fo(K.brown, sd + 38, { p: 0.85, gap: 6, w: 8 }), lo(sd + 39, { w: 5.5 })); }
  // 头
  part(C, P(ellipse(0, -302, 96, 84, 48)), fo(K.brown, sd + 40, { p: 0.85, ang: 0.5 }), lo(sd + 41));
  part(C, P(ellipse(0, -270, 42, 31, 32)), fo(K.honey, sd + 42, { p: 0.95, gap: 7, w: 9 }), lo(sd + 43, { w: 5, p: 0.75 }));
  part(C, P(ellipse(0, -284, 14, 9.5, 18)), { col: K.ink, p: 1, gap: 3, w: 5, over: 0.5, seed: sd + 44, draw: DR.f }, lo(sd + 45, { w: 4 }), { occ: false });
  const bl = o.blush ?? 0;
  [[-64, -280], [64, -280]].forEach(([x, y], i) => dab(C.f, ...P([[x, y]])[0], (12 + 6 * bl) * (o.s || 1), { col: K.coral, p: 0.75 + 0.25 * bl, seed: sd + 46 + i, sq: 0.7 }));
  eyes(C, P, [-36, 36], -312, ex, look, sd + 50);
  if (ex === 'worried') brows(C, P, [-36, 36], -338, 'worried', sd + 60);
  mouthAt(C, P, 0, -258, ex, sd + 64, o.open);
}

// ———————— 乌云：灰紫色、有脸 ————————
export function cloud(C, o) {
  const sd = o.seed || 500, pf = o.puff ?? 0, ex = o.expr || 'grumpy';
  const P = pts => xf(pts, { x: o.x, y: o.y, s: o.s || 1, sx: 1 + 0.12 * pf, sy: 1 + 0.1 * pf });
  const pts = []; const N = 120;
  for (let i = 0; i <= N; i++) { const a = i / N * Math.PI * 2; const b = Math.abs(Math.sin(a * 3.5 + 0.4)); const r = 1 + 0.13 * Math.sqrt(b); pts.push([Math.cos(a) * 240 * r, Math.sin(a) * 122 * r * (Math.sin(a) > 0 ? 0.85 : 1)]); }
  part(C, P(pts), fo(K.cloud, sd + 1, { p: 0.82, gap: 10, w: 12, ang: 0.3, cross: true, crossP: 0.5 }), lo(sd + 2, { w: 8 }));
  if (o.pink > 0) fill(C.f, P(pts.map(([x, y]) => [x * 0.94, y * 0.92])), { col: K.coral, p: 0.8, gap: 10, w: 12, ang: -0.5, seed: sd + 3, over: 4, draw: o.pink });
  if (DR.l < 0.6) return;
  const fe = o.face ?? 1; if (fe <= 0) return;
  const ee = ex === 'smile' ? 'happy' : ex === 'puff' ? 'closed' : 'calm';
  eyes(C, P, [-58, 58], -6, ee, [0, 0.3], sd + 10, 1.15);
  if (ex === 'grumpy') brows(C, P, [-58, 58], -34, 'grumpy', sd + 20);
  if (ex === 'puff') [[-96, 26], [96, 26]].forEach(([x, y], i) => dab(C.f, ...P([[x, y]])[0], 20, { col: K.coral, p: 0.75, seed: sd + 30 + i, sq: 0.8 }));
  if (ex === 'smile') [[-96, 22], [96, 22]].forEach(([x, y], i) => dab(C.f, ...P([[x, y]])[0], 16, { col: K.coral, p: 0.85, seed: sd + 30 + i, sq: 0.7 }));
  if (ex === 'grumpy') line(C.l, P([[-16, 40], [-6, 33], [6, 33], [16, 40]]), lo(sd + 40, { w: 5 }));
  else mouthAt(C, P, 0, 30, ex === 'smile' ? 'happy' : 'puff', sd + 40);
}

// ———————— 大叶子：世界坐标，带拱起的中脉 ————————
export const LEAF = { x: 1500, y: 735, len: 880, wid: 120, arch: 70, rot: -0.04 };
export function leafPoly(L = LEAF) {
  const up = [], dn = [], mid = []; const N = 40; const c = Math.cos(L.rot), s = Math.sin(L.rot);
  const at = (u, v) => { const lx = (u - 0.5) * L.len, ly = -L.arch * Math.sin(u * Math.PI) + v; return [L.x + lx * c - ly * s, L.y + lx * s + ly * c]; };
  for (let i = 0; i <= N; i++) { const u = i / N; const w = L.wid * Math.pow(Math.sin(u * Math.PI), 0.75); up.push(at(u, -w)); dn.push(at(u, w * 0.55)); mid.push(at(u, 0)); }
  return { poly: [...up, ...dn.reverse()], mid, at };
}
export function leaf(C, o) {
  const sd = 700; const { poly, mid, at } = leafPoly();
  part(C, poly, { col: K.leaf, p: 1.05, gap: 8, w: 11, ang: 0.9, seed: sd + 1, over: 5, draw: o.fill ?? 1, cross: true, crossP: 0.55 }, { w: 8, seed: sd + 2, draw: o.line ?? 1 });
  if ((o.line ?? 1) > 0.5) {
    line(C.l, mid.slice(2, -2), { w: 5, seed: sd + 3, col: K.grass, p: 0.95, draw: o.fill ?? 1 });
    for (let k = 1; k <= 6; k++) { const u = k / 7; line(C.l, [at(u, 0), at(u + 0.05, -80 * Math.sin(u * Math.PI))], { w: 4, seed: sd + 10 + k, col: K.grass, p: 0.9, draw: o.fill ?? 1 }); }
  }
}
