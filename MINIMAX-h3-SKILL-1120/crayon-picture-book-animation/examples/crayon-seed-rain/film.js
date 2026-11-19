// 《下雨啦》时间线：一页纸上的一个连续镜头，结尾拉回整页
import { layer, clear, line, text, CAM, BOIL, W, H, sx, sy } from './crayon.js';
import { group, clearGroup } from './rig.js';
import { bunny, bear, cloud, leaf, leafPoly, DR, BEAR_HAND } from './chars.js';
import { drawGround, drawHidden, drawWash, drawDesk, dropRevealT, BANDS, DROPS, BUNNY, BEAR, CLOUD, SHELTER, pr } from './world.js';
import { PAL } from './pal.js';
import { clamp, lerp, hash, track } from '/core/lib.js';
import VO from './voices/dur.json' with { type: 'json' };
const K = PAL.crayon;
export const DUR = 15;

// —— 台词（t = 开口时间；d 来自配音实测） ——
const D = id => (VO && VO[id]) || 1.6;
export const LINES = [
  { id: 'l1', who: 'bunny', t: 0.6, text: '小熊，要下雨啦！' },
  { id: 'l2', who: 'bear', t: 5.85, text: '别怕，看我的！' },
  { id: 'l3', who: 'bunny', t: 11.75, text: '嘻嘻，一点都没湿！' },
].map(L => ({ ...L, d: D(L.id) }));
export const SUBS = LINES.map((L, i) => { const t0 = L.t - 0.1; let t1 = Math.max(t0 + 1.8, L.t + L.d + 0.7); const nx = LINES[i + 1]; if (nx) t1 = Math.min(t1, nx.t - 0.3); return { t0, t1: Math.min(t1, DUR - 0.15), text: L.text }; });
const speaking = (who, t) => LINES.some(L => L.who === who && t >= L.t && t < L.t + L.d);
const mouthOpen = t => Math.floor(t * 8 + 0.5) % 2 === 0;

// —— 镜头（世界坐标中心 + 缩放；整页 = 0.6667） ——
const camT = track([
  [0, [1470, 1010, 1.0]], [3.4, [1470, 1010, 1.0]],
  [4.5, [1480, 560, 1.0]], [5.6, [1480, 560, 1.0]],
  [6.3, [1540, 960, 1.25]], [8.35, [1540, 960, 1.25]],
  [9.2, [1440, 810, 0.6667]], [11.55, [1440, 810, 0.6667]],
  [12.45, [1480, 1040, 1.2]], [13.25, [1480, 1040, 1.2]],
  [15.0, [1440, 830, 0.70]],
]);

// —— 事件（音效与音乐对点，导出给 mix.py） ——
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
LINES.forEach(L => ev(L.t, 'voice', { id: L.id, who: L.who }));
ev(0, 'room');
[[0.3, 0.5, -0.1], [0.5, 0.8, -0.3], [0.8, 0.8, 0.4]].forEach(([t, d, pan]) => ev(t, 'scratch', { dur: d, pan }));
[[1.0, 0.9, -0.3], [1.3, 0.9, 0.4], [1.6, 0.8, 0]].forEach(([t, d, pan]) => ev(t, 'scribble', { dur: d, pan }));
ev(0.9, 'pop', { pan: -0.2 });
ev(2.6, 'droop', { pan: -0.2 }); ev(2.75, 'droop', { pan: -0.2, k: 0.7 });
ev(3.5, 'scratch', { dur: 0.7, pan: 0 }); ev(3.9, 'scribble', { dur: 0.8, pan: 0 });
ev(4.85, 'puff', { pan: 0 });
ev(5.2, 'silence', { dur: 0.4 });
ev(5.95, 'thump', { pan: 0.3 });
ev(6.85, 'swish', { pan: 0.35 });
ev(7.0, 'scratch', { dur: 0.6, pan: 0.1 }); ev(7.35, 'zigzag', { dur: 0.9, pan: 0.1 });
ev(7.95, 'stem', { pan: 0.3 });
BANDS.forEach(b => ev(b.t0, 'brush', { dur: b.t1 - b.t0 }));
ev(8.8, 'rain', { dur: 3.2 });
DROPS.filter(d => d.big).forEach(d => ev(dropRevealT(d), 'glint', { pan: clamp((d.x - 1440) / 1440, -1, 1) }));
for (let i = 0; i < 9; i++) ev(9.3 + i * 0.27 + 0.08 * hash(i), 'tap', { pan: lerp(-0.2, 0.3, hash(i * 3)) });
[0, 1, 2, 3].forEach(k => ev(11.8 + k * 0.25, 'spin', { pan: 0 }));
ev(12.0, 'scribble', { dur: 0.7, pan: -0.1 });
ev(13.35, 'scribble', { dur: 0.7, pan: 0 });

[['A', 0], ['B', 2.5], ['S', 5.2], ['C', 5.6], ['D', 8.4], ['E', 11.6]].forEach(([id, t]) => ev(t, 'cue', { id }));

// —— 角色状态 ——
function bunnyState(t) {
  const o = { x: BUNNY.x, y: BUNNY.y, s: 1, seed: 100, pose: 'stand', expr: 'calm', look: [0.4, 0], ear: 0 };
  const talk = speaking('bunny', t);
  if (t < 2.6) { if (t > 0.9) { o.pose = 'point'; o.look = [0.2, -1]; } }
  else if (t < 7.0) { o.pose = 'worried'; o.expr = 'worried'; o.ear = t < 2.75 ? 0.5 : 1; o.look = t < 5.6 ? [0.3, -1] : [1, -0.2]; }
  else if (t < 8.4) { o.pose = 'worried'; o.expr = 'wow'; o.open = true; o.look = [0.6, -1]; o.ear = t < 7.6 ? 0.6 : t < 8.0 ? 0.25 : 0; }
  else if (t < 11.6) { o.pose = t > 10.4 ? 'happy' : 'stand'; o.expr = t > 10.4 ? 'happy' : 'wow'; o.open = true; o.look = [0, -1]; }
  else {
    o.pose = 'happy'; o.expr = 'happy'; o.blush = pr(t, 12.0, 12.7);
    const k = Math.floor((t - 11.8) / 0.125);
    if (t >= 11.8 && t < 12.8) { o.flip = k % 2 === 1; o.y -= k % 2 ? 18 : 0; o.earWiggle = (k % 2 ? 0.12 : -0.08); }
  }
  if (talk) { o.expr = 'talk'; o.open = mouthOpen(t); }
  return o;
}
function bearState(t) {
  const o = { x: BEAR.x, y: BEAR.y, s: 1, seed: 300, pose: 'stand', expr: 'calm', look: [-0.8, 0] };
  if (t > 2.4 && t < 5.6) o.look = [-0.3, -1];
  if (t >= 5.6 && t < 6.8) { o.pose = t > 5.9 ? 'chest' : 'stand'; o.expr = 'happy'; }
  else if (t >= 6.8 && t < 7.95) { o.pose = 'hold'; o.crayon = true; o.expr = 'happy'; }
  else if (t >= 7.95) { o.pose = 'leaf'; o.expr = t > 9.0 && t < 10.4 ? 'calm' : 'happy'; o.look = [-0.5, -1]; o.blush = t > 12 ? 0.5 : 0; }
  if (speaking('bear', t)) { o.expr = 'talk'; o.open = mouthOpen(t); }
  return o;
}
function cloudState(t) {
  const o = { x: CLOUD.x, y: CLOUD.y, s: 1, seed: 500, expr: 'grumpy', puff: 0 };
  if (t >= 4.85 && t < 8.7) { o.puff = t < 4.95 ? 0.5 : 1; o.expr = 'puff'; }
  if (t >= 13.3) { o.pink = pr(t, 13.3, 14.1); o.expr = t > 13.7 ? 'smile' : 'grumpy'; }
  return o;
}

// —— 图层 ——
const HID = layer(), BG = { f: layer(), l: layer() }, LF = group(), CL = group(), BN = group(), BR = group(), WASH = layer(), FX = layer(), DESK = layer(), SUBK = layer(), SUBT = layer();

export function frame(comp, t) {
  [CAM.x, CAM.y, CAM.s] = camT(t);
  BOIL.amp = t > 5.2 && t < 5.6 ? 0.5 : t > 14.2 ? 0.7 : 1;
  [HID, BG.f, BG.l, WASH, FX, DESK, SUBK, SUBT].forEach(clear);
  [LF, CL, BN, BR].forEach(clearGroup);
  drawHidden(HID);
  drawGround(BG.f, BG.l, { gl: pr(t, 0.3, 0.8), gf: pr(t, 1.6, 2.4) });
  // 大叶子 + 叶柄
  if (t > 7.0) {
    leaf(LF, { line: pr(t, 7.0, 7.6), fill: pr(t, 7.35, 8.25) });
    if (t > 7.95) {
      const h = BEAR_HAND('leaf'); const { at } = leafPoly();
      line(LF.l, [at(0.6, 30), [BEAR.x + h[0] - 4, BEAR.y + h[1] - 6]], { w: 9, col: K.grass, p: 1, seed: 777, draw: pr(t, 7.95, 8.15) });
    }
  }
  // 乌云
  if (t > 3.5) { DR.l = pr(t, 3.5, 4.2); DR.f = pr(t, 3.9, 4.7); cloud(CL, cloudState(t)); }
  // 小兔、小熊（边画边出现）
  DR.l = pr(t, 0.45, 1.3); DR.f = pr(t, 0.95, 1.9); if (t > 0.45) bunny(BN, bunnyState(t));
  DR.l = pr(t, 0.75, 1.6); DR.f = pr(t, 1.25, 2.2); if (t > 0.75) bear(BR, bearState(t));
  DR.l = 1; DR.f = 1;
  // 落下来的雨（白蜡笔短线，12 fps 换一张），只落在水彩已经刷过的地方
  if (t > 8.9 && t < 11.9) {
    const st = BOIL.step, k = 1 - pr(t, 11.3, 11.9);
    for (let i = 0; i < 70 * k; i++) {
      const x = hash(i * 1.7 + st * 0.13) * 2900 - 10, y = hash(i * 3.3 + st * 0.71) * 1260;
      const b = y < 790 ? BANDS[0] : BANDS[1]; if (t < b.t0) continue;
      const u = clamp((t - b.t0) / (b.t1 - b.t0)); if (x > lerp(-320, 3200, u)) continue;
      if (x > 1020 && x < 1980 && y > 700) continue;
      line(FX, [[x, y], [x - 10, y + 46]], { w: 5, col: K.white, p: 1, seed: 900 + i, wob: 0.2, taper: 0.4 });
    }
    // 打在叶子上的小水花
    const { at } = leafPoly();
    for (let i = 0; i < 5; i++) { if (hash(i + BOIL.step * 0.37) < 0.5 || t < 9.3) continue; const u = 0.12 + 0.76 * hash(i * 9 + BOIL.step); const [x, y] = at(u, -96 * Math.sin(u * Math.PI)); line(FX, [[x - 14, y - 6], [x - 22, y - 18]], { w: 4, col: K.white, p: 1, seed: 950 + i }); line(FX, [[x + 14, y - 6], [x + 22, y - 18]], { w: 4, col: K.white, p: 1, seed: 960 + i }); }
  }
  // 水彩
  if (t > BANDS[0].t0) drawWash(WASH, t);
  const deskOn = drawDesk(DESK);
  subTo(SUBK, SUBT, t);
  // 合成：纸纹锚定在纸面上，随镜头移动
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6);
  comp.begin();
  comp.crayon(HID.c);
  comp.crayon(BG.f.c); comp.crayon(BG.l.c);
  const go = [hash(BOIL.step) * 300, hash(BOIL.step + 7) * 300];
  comp.group(LF, { goff: go });
  if (t > BANDS[0].t0) comp.wash(WASH.c, { color: PAL.wash });
  comp.group(CL, { goff: go });
  comp.group(BN, { goff: go }); comp.group(BR, { goff: go });   // 角色在水彩之后合成，夜色里也看得清
  comp.crayon(FX.c, { goff: go });
  if (deskOn) comp.image(DESK.c);
  comp.knock(SUBK.c); comp.crayon(SUBT.c);
  comp.finish({ vig: 0.3 });
}

// 字幕 = 书上印的字：手写体、靛蓝色，一字一字写出来，垫一块撕边留白纸
const FONT = 'ZCOOL KuaiLe';
export function subTo(SUBK, SUBT, t) {
  const S = SUBS.find(s => t >= s.t0 && t < s.t1); if (!S) return;
  const rv = pr(t, S.t0, S.t0 + 0.35);
  const g = SUBK.g; g.save(); g.font = `400 56px "${FONT}"`; const tw = g.measureText(S.text).width; g.restore();
  const cx = 960, cy = 1000, hw = tw / 2 + 50, hh = 46;
  g.save(); g.fillStyle = '#000'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const px = Math.cos(a), py = Math.sin(a); const sq = Math.pow(Math.abs(px), 0.3) * Math.sign(px); const n = 1 + 0.06 * Math.sin(a * 7 + 1.3) + 0.03 * Math.sin(a * 17); const X = cx + sq * hw * n, Y = cy + py * hh * n; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }
  g.closePath(); g.fill(); g.restore();
  text(SUBT, S.text, cx, cy + 20, { size: 56, font: FONT, col: K.ink, reveal: rv, seed: 11 + S.t0 * 3, p: 1, stroke: 1.2 });
}
