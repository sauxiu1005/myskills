// Crayon stroke engine (Canvas2D): draws into a "pressure layer" (RGB = colour, A = pressure); gl.js decides adhesion from the paper tooth.
// World coords → screen coords via CAM; line widths are in screen pixels (each frame is a freshly "redrawn" picture, so stroke width does not scale much with the camera).
// BOIL.step = floor(t*12): the jitter seed changes every 2 frames (at 24fps) = line boil.
import { clamp, lerp, hash, vnoise } from '/core/lib.js';
export const W = 1920, H = 1080;
export const CAM = { x: 960, y: 540, s: 1 };
export const BOIL = { step: 0, amp: 1 };
export const WMUL = { k: 1 };        // global line-width multiplier (adjustable for big close-ups on the model sheet)

export function layer() { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.lineCap = 'round'; g.lineJoin = 'round'; return { c, g }; }
export function clear(L) { L.g.setTransform(1, 0, 0, 1, 0, 0); L.g.clearRect(0, 0, W, H); }

export const sx = x => (x - CAM.x) * CAM.s + W / 2;
export const sy = y => (y - CAM.y) * CAM.s + H / 2;
export const ws = w => w * Math.pow(CAM.s, 0.45) * WMUL.k;      // screen line width: varies slightly with the camera
const n1 = (seed, x) => vnoise(x + seed * 17.31) * 2 - 1;

// Convert a world-coord polyline to screen and resample by screen distance
function toScreen(pts) { return pts.map(p => [sx(p[0]), sy(p[1])]); }
function resample(sp, step = 3.5, closed = false) {
  const q = closed ? [...sp, sp[0]] : sp; const out = [q[0].slice()]; const L = [0]; let acc = 0, total = 0;
  for (let i = 1; i < q.length; i++) {
    const [ax, ay] = q[i - 1], [bx, by] = q[i]; const d = Math.hypot(bx - ax, by - ay); if (d < 1e-6) continue;
    let pos = step - acc;
    while (pos <= d) { const u = pos / d; out.push([ax + (bx - ax) * u, ay + (by - ay) * u]); total += step; L.push(total); pos += step; }
    acc = d - (pos - step);
  }
  const last = q[q.length - 1]; const lp = out[out.length - 1]; const rem = Math.hypot(last[0] - lp[0], last[1] - lp[1]);
  if (rem > 0.3) { out.push(last.slice()); total += rem; L.push(total); }
  return { p: out, L, total };
}

// ——— crayon line ———
// o: col, w (screen px), p (pressure 0–1), seed, wob (hand wobble), boil, taper (tapering ratio at both ends), draw (drawing progress 0–1), streak (number of stroke streaks)
export function line(L, pts, o = {}) {
  const g = L.g;
  const col = o.col || "#2d3263", w = ws(o.w ?? 6), p = o.p ?? 0.8, seed = o.seed ?? 1, wob = o.wob ?? 1, boil = o.boil ?? 1;
  const draw = o.draw ?? 1; if (draw <= 0) return;
  const sp = toScreen(pts); const R = resample(sp, 3, o.closed);
  let n = R.p.length; if (n < 2) return;
  const lim = R.total * draw;
  const st = BOIL.step, ba = BOIL.amp * boil;
  const jx = (hash(seed * 3.1 + st * 7.7) - .5) * 1.6 * ba, jy = (hash(seed * 5.3 + st * 3.9) - .5) * 1.6 * ba;
  const P = [], Wd = [];
  const taper = o.taper ?? 0.25, tl = Math.min(R.total * taper, 28);
  for (let i = 0; i < n; i++) {
    const s = R.L[i]; if (s > lim) break;
    const a = R.p[Math.max(0, i - 1)], b = R.p[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const tn = Math.hypot(tx, ty) || 1; tx /= tn; ty /= tn;
    const off = n1(seed, s / 85) * 1.7 * wob + n1(seed + st * 1.37 + 11, s / 38) * 0.9 * ba;
    P.push([R.p[i][0] - ty * off + jx, R.p[i][1] + tx * off + jy, -ty, tx]);
    const e0 = o.closed ? 1 : clamp(s / (tl + 1e-3)), e1 = o.closed ? 1 : clamp((Math.min(lim, R.total) - s) / (tl + 1e-3));
    Wd.push(w * (0.82 + 0.3 * n1(seed + 3, s / 55)) * (0.45 + 0.55 * Math.min(e0, e1)));
  }
  if (P.length < 2) return;
  g.fillStyle = col; g.strokeStyle = col;
  // main band
  ribbon(g, P, Wd, 1); g.globalAlpha = p * 0.5; g.fill();
  // core (lighter at both ends where the crayon lifts)
  ribbon(g, P, Wd, 0.5); g.globalAlpha = p * 0.34; g.fill();
  // stroke streaks
  const ns = o.streak ?? 2;
  for (let k = 0; k < ns; k++) {
    const side = (hash(seed + k * 9.1) - .5) * 0.9;
    g.beginPath();
    for (let i = 0; i < P.length; i++) { const q = P[i]; const d = side * Wd[i]; const x = q[0] + q[2] * d, y = q[1] + q[3] * d; i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.lineWidth = Math.max(1, w * 0.22); g.globalAlpha = p * 0.3; g.stroke();
  }
  g.globalAlpha = 1;
}
function ribbon(g, P, Wd, k) {
  g.beginPath();
  for (let i = 0; i < P.length; i++) { const q = P[i], d = Wd[i] * 0.5 * k; i ? g.lineTo(q[0] + q[2] * d, q[1] + q[3] * d) : g.moveTo(q[0] + q[2] * d, q[1] + q[3] * d); }
  for (let i = P.length - 1; i >= 0; i--) { const q = P[i], d = Wd[i] * 0.5 * k; g.lineTo(q[0] - q[2] * d, q[1] - q[3] * d); }
  g.closePath();
}

// ——— fill: back-and-forth zigzag hatching that goes over the outline ———
// o: col, p, ang (hatching angle), gap (row spacing px), w (stroke width px), over (overshoot past the outline px), seed, draw (fill progress), boil, cross (second cross-hatching pass)
export function fill(L, poly, o = {}) {
  const g = L.g;
  const col = o.col || '#f6c945', p = o.p ?? 0.62, seed = o.seed ?? 1, boil = o.boil ?? 1;
  const st = BOIL.step, ba = BOIL.amp * boil;
  const ang = (o.ang ?? 0.62) + (hash(seed + st * 1.9) - .5) * 0.035 * ba;
  const gap = ws(o.gap ?? 10.5), w = ws(o.w ?? 11), over = ws(o.over ?? 7);
  const draw = o.draw ?? 1; if (draw <= 0) return;
  const sp = toScreen(poly);
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const rp = sp.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca]);   // rotate so the hatching is horizontal
  let y0 = Infinity, y1 = -Infinity; for (const q of rp) { y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
  const rows = []; let y = y0 + gap * (0.35 + 0.3 * hash(seed + st * 0.7 * ba));
  let r = 0;
  while (y < y1) {
    const xs = [];
    for (let i = 0; i < rp.length; i++) {
      const a = rp[i], b = rp[(i + 1) % rp.length];
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
    }
    xs.sort((a, b) => a - b);
    const spans = []; for (let i = 0; i + 1 < xs.length; i += 2) spans.push([xs[i], xs[i + 1]]);
    rows.push({ y, spans, r }); r++;
    y += gap * (0.8 + 0.4 * hash(seed * 1.3 + r * 3.7));
  }
  // join into zigzag strokes: adjacent rows whose spans overlap get connected
  const strokes = []; let curS = null, prev = null, dir = 1;
  for (const row of rows) {
    if (row.spans.length !== 1) { curS = null; prev = null; for (const s of row.spans) strokes.push([[s, row.y, row.r]]); continue; }
    const s = row.spans[0];
    if (curS && prev && s[0] < prev[1] && s[1] > prev[0]) curS.push([s, row.y, row.r]);
    else { curS = [[s, row.y, row.r]]; strokes.push(curS); }
    prev = s;
  }
  // total length, used for fill progress
  const paths = strokes.map((S, si) => {
    const pts = [];
    S.forEach(([s, yy, rr], k) => {
      const len = s[1] - s[0];
      const oA = over * (hash(seed + rr * 5.1 + 0.3) * 1.1 - 0.15) - Math.min(0, len * 0) , oB = over * (hash(seed + rr * 2.3 + 0.7) * 1.1 - 0.15);
      const yj = (hash(seed + rr * 1.7 + st * 0.31 * ba) - .5) * gap * 0.35 * Math.max(ba, .3);
      const a = [s[0] - oA, yy + yj], b = [s[1] + oB, yy + yj + (hash(seed + rr) - .5) * gap * 0.6];
      if ((k + si) % 2 === 0) pts.push(a, b); else pts.push(b, a);
    });
    return pts.map(([x, y]) => [x * ca - y * sa, x * sa + y * ca]);
  });
  let total = 0; const lens = paths.map(pp => { let l = 0; for (let i = 1; i < pp.length; i++) l += Math.hypot(pp[i][0] - pp[i - 1][0], pp[i][1] - pp[i - 1][1]); total += l; return l; });
  let budget = total * draw;
  g.strokeStyle = col; g.lineWidth = w;
  for (let k = 0; k < paths.length && budget > 0; k++) {
    const pp = paths[k];
    const cut = cutPath(pp, budget); budget -= lens[k];
    // each pass of hatching has a different pressure: the individual back-and-forth strokes stay visible
    for (let i = 1; i < cut.length; i++) {
      const pr = p * (0.72 + 0.42 * hash(seed * 0.37 + k * 13.1 + i * 0.71));
      g.beginPath(); g.moveTo(cut[i - 1][0], cut[i - 1][1]); g.lineTo(cut[i][0], cut[i][1]);
      g.globalAlpha = pr * 0.62; g.lineWidth = w; g.stroke();
      g.globalAlpha = pr * 0.3; g.lineWidth = w * 0.42; g.stroke();
    }
  }
  g.globalAlpha = 1;
  if (o.cross) fill(L, poly, { ...o, cross: false, ang: (o.ang ?? 0.62) + (o.crossAng ?? 1.25), seed: seed + 101, p: p * (o.crossP ?? 0.7) });
}
function cutPath(pp, len) {
  const out = [pp[0]]; let acc = 0;
  for (let i = 1; i < pp.length; i++) {
    const d = Math.hypot(pp[i][0] - pp[i - 1][0], pp[i][1] - pp[i - 1][1]);
    if (acc + d >= len) { const u = (len - acc) / d; out.push([lerp(pp[i - 1][0], pp[i][0], u), lerp(pp[i - 1][1], pp[i][1], u)]); return out; }
    acc += d; out.push(pp[i]);
  }
  return out;
}

// ——— solid soft fill: small areas (blush, pupils) filled with circular scribbles ———
export function dab(L, x, y, r, o = {}) {
  fill(L, handCircle(x, y, r, o.seed ?? 1, 0, 20).map(([px, py]) => [px, y + (py - y) * (o.sq ?? 1)]), { col: o.col || '#ee8ea4', p: o.p ?? 0.7, gap: o.gap ?? 4.5, w: o.w ?? 6, over: o.over ?? 1.5, seed: o.seed ?? 1, ang: o.ang ?? 0.5, boil: o.boil ?? 1 });
}

// ——— shape tools (world coords) ———
export function ellipse(cx, cy, rx, ry, n = 48, a0 = 0, a1 = Math.PI * 2, rot = 0) {
  const out = []; const c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; const x = Math.cos(a) * rx, y = Math.sin(a) * ry; out.push([cx + x * c - y * s, cy + x * s + y * c]); }
  return out;
}
// hand-drawn circle: start and end slightly offset, a bit lopsided
export function handCircle(cx, cy, r, seed = 1, over = 0.12, n = 56) {
  const out = []; const a0 = hash(seed) * 6.28;
  for (let i = 0; i <= n; i++) { const u = i / n; const a = a0 + u * Math.PI * 2 * (1 + over); const rr = r * (1 + 0.035 * Math.sin(a * 2 + seed) + (u > 1 - over ? 0.04 * (u - (1 - over)) / over : 0)); out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return out;
}
// chain of cubic Béziers: [p0, c1, c2, p1, c3, c4, p2, ...]
export function bez(c, n = 16) {
  const out = [c[0]];
  for (let i = 0; i + 3 < c.length; i += 3) {
    const [a, b, d, e] = [c[i], c[i + 1], c[i + 2], c[i + 3]];
    for (let k = 1; k <= n; k++) { const t = k / n, u = 1 - t; out.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * d[0] + t * t * t * e[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * d[1] + t * t * t * e[1]]); }
  }
  return out;
}
// smooth closed curve (Catmull-Rom)
export function smooth(pts, n = 8, closed = true) {
  const out = []; const m = pts.length; const N = closed ? m : m - 1;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + m) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
    const P0 = closed || i > 0 ? p0 : p1, P3 = closed || i + 2 < m ? p3 : p2;
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * ((2 * p1[0]) + (-P0[0] + p2[0]) * t + (2 * P0[0] - 5 * p1[0] + 4 * p2[0] - P3[0]) * t2 + (-P0[0] + 3 * p1[0] - 3 * p2[0] + P3[0]) * t3),
                0.5 * ((2 * p1[1]) + (-P0[1] + p2[1]) * t + (2 * P0[1] - 5 * p1[1] + 4 * p2[1] - P3[1]) * t2 + (-P0[1] + 3 * p1[1] - 3 * p2[1] + P3[1]) * t3)]); }
  }
  if (!closed) out.push(pts[m - 1]); else out.push(out[0]);
  return out;
}
// transform: translate, rotate, scale a set of points
export function xf(pts, { x = 0, y = 0, r = 0, s = 1, sx: kx = 1, sy: ky = 1, ox = 0, oy = 0 } = {}) {
  const c = Math.cos(r), sn = Math.sin(r);
  return pts.map(([px, py]) => { const X = (px - ox) * s * kx, Y = (py - oy) * s * ky; return [x + ox + X * c - Y * sn, y + oy + X * sn + Y * c]; });
}

// ——— crayon lettering (subtitles, title): glyphs are filled, then jitter slightly every 2 frames ———
export function text(L, str, x, y, o = {}) {
  const g = L.g, st = BOIL.step, seed = o.seed ?? 7, ba = BOIL.amp * (o.boil ?? 1);
  const size = o.size ?? 56; const font = o.font ?? 'Patrick Hand';
  g.save();
  g.font = `${o.weight ?? 400} ${size}px "${font}"`; g.textBaseline = 'alphabetic';
  const chars = [...str]; const widths = chars.map(c => g.measureText(c).width); const tw = widths.reduce((a, b) => a + b, 0) + (o.track ?? 0) * (chars.length - 1);
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - tw : x - tw / 2;
  const reveal = o.reveal ?? 1;   // 0–1, written out letter by letter
  const nShow = reveal * chars.length;
  g.fillStyle = o.col || '#2b2f5e';
  chars.forEach((ch, i) => {
    const vis = clamp(nShow - i); if (vis <= 0) { cx += widths[i] + (o.track ?? 0); return; }
    const jx = (hash(seed + i * 3.3 + st * 1.1) - .5) * 1.4 * ba, jy = (hash(seed + i * 7.1 + st * 2.3) - .5) * 1.4 * ba;
    const rot = (hash(seed + i * 1.9) - .5) * 0.07 + (hash(seed + i + st * .7) - .5) * 0.02 * ba;
    const by = (hash(seed + i * 5.5) - .5) * size * 0.05;
    g.save(); g.translate(cx + widths[i] / 2 + jx, y + by + jy); g.rotate(rot);
    g.globalAlpha = (o.p ?? 1) * vis;
    g.fillText(ch, -widths[i] / 2, 0);
    if (o.stroke) { g.lineWidth = o.stroke; g.strokeStyle = o.col || '#2b2f5e'; g.globalAlpha = (o.p ?? 1) * vis * 0.6; g.strokeText(ch, -widths[i] / 2, 0); }
    g.restore();
    cx += widths[i] + (o.track ?? 0);
  });
  g.restore();
  return tw;
}
