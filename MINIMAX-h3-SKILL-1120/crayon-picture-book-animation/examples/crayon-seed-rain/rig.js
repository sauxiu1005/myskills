// Shared parts for drawing characters: part occlusion (erase lines/colour behind + cut-paper backing), limb tubes, canvas groups
import { layer, clear, line, fill, CAM, sx, sy } from './crayon.js';

// A "character group": three layers, backing (knock), fill (f), outline (l)
export function group() { return { k: layer(), f: layer(), l: layer() }; }
export function clearGroup(C) { clear(C.k); clear(C.f); clear(C.l); }

function pathScreen(g, poly) { g.beginPath(); poly.forEach(([x, y], i) => i ? g.lineTo(sx(x), sy(y)) : g.moveTo(sx(x), sy(y))); g.closePath(); }
export function erase(L, poly) { const g = L.g; g.save(); g.globalCompositeOperation = 'destination-out'; g.globalAlpha = 1; g.fillStyle = '#000'; pathScreen(g, poly); g.fill(); g.restore(); }
export function knock(C, poly) { const g = C.k.g; g.save(); g.globalAlpha = 1; g.fillStyle = '#000'; pathScreen(g, poly); g.fill(); g.restore(); }

// Draw one part: it hides the parts drawn before it (erases their lines and colour), then fills and outlines itself
// fo: fill params (null = no fill), lo: outline params (null = no outline)
export function part(C, poly, fo, lo, { occ = true, kn = true } = {}) {
  if (occ) { erase(C.l, poly); if (fo) erase(C.f, poly); }
  if (kn) knock(C, poly);
  if (fo) fill(C.f, poly, fo);
  if (lo) line(C.l, [...poly, poly[1] || poly[0]], lo);
}

// Limb tube: offset both sides of a polyline + round caps, returns a closed polygon
export function tube(pts, w0, w1 = w0) {
  const n = pts.length; const L = [], R = [];
  const dirs = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d; dirs.push([dx, dy]);
    const w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const cap = (c, d, w, from) => { const out = []; const a0 = Math.atan2(d[1], d[0]); for (let k = 1; k < 8; k++) { const a = a0 + from + Math.PI * k / 8; out.push([c[0] + Math.cos(a) * w, c[1] + Math.sin(a) * w]); } return out; };
  return [...L, ...cap(pts[n - 1], dirs[n - 1], w1 / 2, Math.PI / 2), ...R.reverse(), ...cap(pts[0], dirs[0], w0 / 2, -Math.PI / 2)];
}
// Smooth a polyline (two rounds of subdivision)
export function curve(pts, n = 6) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = mid(pts[i - 1], pts[i]), b = mid(pts[i], pts[i + 1]);
    for (let k = 0; k <= n; k++) { const t = k / n, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * pts[i][0] + t * t * b[0], u * u * a[1] + 2 * u * t * pts[i][1] + t * t * b[1]]); }
  }
  out.push(pts[pts.length - 1]); return out;
}
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
