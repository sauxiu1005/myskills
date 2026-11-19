// 《晚安，小猫》时间线：一页纸上的一个连续镜头，结尾拉回整页（不出纸边）
import { layer, clear, line, text, CAM, BOIL, W, H, sx, sy } from './crayon.js';
import { group, clearGroup } from './rig.js';
import { kitten, puppy, DR } from './chars.js';
import { drawRoom, drawBed, drawQuilt, drawCurtains, drawStars, drawWash, starRevealT, STARS, BAND, KIT, PUP, FLOOR, LAMP, pr } from './world.js';
import { PAL } from './pal.js';
import { clamp, lerp, hash, track, ss } from '/core/lib.js';
import VO from './voices/dur.json' with { type: 'json' };
const K = PAL.crayon;
export const DUR = 15;

const D = id => (VO && VO[id]) || 1.6;
export const LINES = [
  { id: 'l1', who: 'kitten', t: 0.8, text: '天黑了，我有点怕……' },
  { id: 'l2', who: 'puppy', t: 6.05, text: '别怕，我陪你。' },
  { id: 'l3', who: 'kitten', t: 12.3, text: '嗯……晚安。' },
].map(L => ({ ...L, d: D(L.id) }));
export const SUBS = LINES.map((L, i) => { const t0 = L.t - 0.1; let t1 = Math.max(t0 + 1.8, L.t + L.d + 0.7); const nx = LINES[i + 1]; if (nx) t1 = Math.min(t1, nx.t - 0.3); return { t0, t1: Math.min(t1, DUR - 0.15), text: L.text }; });
const speaking = (who, t) => LINES.some(L => L.who === who && t >= L.t && t < L.t + L.d);
const mouthOpen = t => Math.floor(t * 8 + 0.5) % 2 === 0;

// —— 镜头（世界坐标中心 + 缩放；整页 = 0.6667） ——
const camT = track([
  [0, [1420, 1010, 1.1]], [3.5, [1420, 1010, 1.1]],
  [4.3, [760, 1120, 1.1]], [4.6, [760, 1120, 1.1]],
  [6.0, [1320, 1060, 1.3]], [8.95, [1340, 1060, 1.3]],
  [9.6, [1750, 520, 1.42]], [11.75, [1750, 520, 1.42]],
  [12.35, [1320, 990, 1.4]], [13.4, [1320, 990, 1.4]],
  [15.0, [1440, 820, 0.70]],
]);

// —— 小狗的路线：从画面左边跑进来，一跳坐到床上 ——
const RUN = { t0: 3.85, t1: 5.45, x0: -180, x1: 860 };
const GROUND = 1478;
const HOP = { t0: 5.45, t1: 5.95 };
function pupPos(t) {
  if (t < HOP.t0) { const u = clamp((t - RUN.t0) / (RUN.t1 - RUN.t0)); return [lerp(RUN.x0, RUN.x1, u), GROUND - (Math.floor(t * 12) % 2 ? 12 : 0)]; }
  const u = ss((t - HOP.t0) / (HOP.t1 - HOP.t0)); return [lerp(RUN.x1, PUP.x, u), lerp(GROUND, PUP.y, u) - 150 * Math.sin(Math.PI * u)];
}

// —— 事件（音效与音乐对点，导出给 mix.py） ——
export const EV = [];
const ev = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
LINES.forEach(L => ev(L.t, 'voice', { id: L.id, who: L.who }));
ev(0, 'room');
[[0.1, 0.6, 0.2], [0.35, 0.7, -0.2], [0.55, 0.6, 0.1]].forEach(([t, d, pan]) => ev(t, 'scratch', { dur: d, pan }));
[[0.75, 0.8, 0.1], [1.05, 0.8, -0.1]].forEach(([t, d, pan]) => ev(t, 'scribble', { dur: d, pan }));
ev(1.6, 'curl', { pan: 0.1 });
ev(3.6, 'scratch', { dur: 0.6, pan: -0.6 }); ev(3.8, 'scribble', { dur: 0.6, pan: -0.6 });
for (let k = 0; k < 19; k++) { const t = RUN.t0 + 0.04 + k / 12; if (t < RUN.t1) ev(t, 'paw', { pan: clamp(lerp(-0.8, 0.0, (t - RUN.t0) / (RUN.t1 - RUN.t0)), -1, 1), k: k % 2 }); }
ev(5.95, 'land', { pan: -0.1 });
ev(6.55, 'scratch', { dur: 0.4, pan: 0.05 }); ev(6.75, 'zigzag', { dur: 1.55, pan: 0.05 });
ev(8.35, 'fluff', { pan: 0 });
ev(8.6, 'silence', { dur: 0.4 });
ev(BAND.t0, 'brush', { dur: BAND.t1 - BAND.t0 });
ev(9.6, 'crickets', { dur: 5.4 });
STARS.filter(s => s.big).forEach(s => ev(starRevealT(s), 'glint', { pan: clamp((s.x - 1750) / 600, -1, 1) }));
ev(14.1, 'purr', { dur: 0.9 });
[['A', 0], ['B', 3.6], ['C', 6.0], ['S', 8.6], ['D', 9.0], ['E', 12.0]].forEach(([id, t]) => ev(t, 'cue', { id }));

// —— 角色状态 ——
function kittenState(t) {
  const o = { x: KIT.x, y: KIT.y, s: 1, seed: 100, expr: 'calm', look: [0, -0.3], scared: 0 };
  if (t < 1.6) { o.look = [0.6, -1]; if (t > 0.9) { o.expr = 'worried'; o.brows = true; } }
  else if (t < 8.4) { o.scared = 1; o.expr = 'worried'; o.brows = true; o.look = t < 4.2 ? [0.4, -1] : t < 5.95 ? [-1, 0.3] : [-1, -0.2]; o.blush = 0.2; }
  else if (t < 9.0) { o.scared = 0.4; o.look = [-1, -0.3]; o.expr = 'calm'; }
  else if (t < 12.0) { o.look = [0.6, -1]; o.expr = t > 10.2 ? 'wow' : 'calm'; if (t > 11.0) { o.expr = 'happy'; o.blush = 0.7; } }
  else {
    const u = ss((t - 12.0) / 0.9);
    o.r = -0.16 * u; o.x -= 26 * u; o.expr = t < 13.6 ? 'sleepy' : 'closed'; o.blush = 0.7; o.look = [-0.4, 0.4];
  }
  if (speaking('kitten', t)) { o.expr = 'talk'; o.open = mouthOpen(t); o.talkEye = t > 12 ? 'sleepy' : 'calm'; }
  return o;
}
function puppyState(t) {
  const [x, y] = pupPos(t);
  const o = { x, y, s: 1, seed: 300, pose: 'stand', expr: 'happy', look: [1, 0], crayon: true };
  if (t < HOP.t0) { o.pose = Math.floor(t * 12) % 4 < 2 ? 'runA' : 'runB'; o.earSwing = Math.floor(t * 12) % 2 ? 0.25 : -0.15; }
  else if (t < HOP.t1) { o.pose = 'hold'; o.earSwing = 0.35; }
  else {
    o.pose = 'sit'; o.armPose = 'stand'; o.look = [1, 0.2]; o.expr = 'calm';
    if (t >= 6.55 && t < 8.35) {
      const a = Math.sin((t - 6.55) * 2 * Math.PI * 3.2);
      o.arms = [[[-70, -206], [-92, -160], [-96, -118]], [[70, -206], [118 + 14 * a, -176], [176 + 46 * a, -142 + 8 * a]]];
      o.look = [1, 0.8];
    } else if (t >= 5.95 && t < 6.55) { o.armPose = 'hold'; }
    if (t >= 8.35) { o.crayon = false; o.expr = 'happy'; o.look = [1, -0.2]; }
    if (t >= 9.0 && t < 12.0) { o.look = [1, -1]; o.expr = t > 10.2 ? 'wow' : 'calm'; if (t > 11) o.expr = 'happy'; }
    if (t >= 12.0) { const u = ss((t - 12.2) / 1.0); o.r = 0.06 * u; o.x += 14 * u; o.expr = t > 13.2 ? 'closed' : 'happy'; o.blush = 0.5; }
  }
  if (speaking('puppy', t)) { o.expr = 'talk'; o.open = mouthOpen(t); }
  return o;
}

// —— 图层 ——
const HID = layer(), RM = { f: layer(), l: layer() }, BD = { f: layer(), l: layer() }, CT = { f: layer(), l: layer() }, PP = group(), KT = group(), QL = group(), WASH = layer(), FX = layer(), SUBK = layer(), SUBT = layer();

export function frame(comp, t) {
  [CAM.x, CAM.y, CAM.s] = camT(t);
  BOIL.amp = t > 8.6 && t < 9.0 ? 0.5 : t > 12.4 ? lerp(0.8, 0.45, pr(t, 12.4, 15)) : 1;
  [HID, RM.f, RM.l, BD.f, BD.l, CT.f, CT.l, WASH, FX, SUBK, SUBT].forEach(clear);
  [PP, KT, QL].forEach(clearGroup);
  drawStars(HID);
  drawRoom(RM.f, RM.l, { l0: pr(t, 0.0, 0.5), f0: pr(t, 0.4, 1.1), l1: pr(t, 0.1, 0.7), f1: pr(t, 0.5, 1.3), l2: pr(t, 3.55, 4.1), f2: pr(t, 3.85, 4.5) });
  drawBed(BD.f, BD.l, { l: pr(t, 0.05, 0.6), f: pr(t, 0.45, 1.2) });
  drawCurtains(CT.f, CT.l, { l1: pr(t, 0.1, 0.7), f1: pr(t, 0.5, 1.3) });
  if (t > 3.6) { DR.l = pr(t, 3.6, 4.0); DR.f = pr(t, 3.75, 4.2); puppy(PP, puppyState(t)); }
  DR.l = pr(t, 0.2, 0.9); DR.f = pr(t, 0.6, 1.4); if (t > 0.2) kitten(KT, kittenState(t));
  DR.l = 1; DR.f = 1;
  if (t > 6.6) drawQuilt(QL, pr(t, 6.75, 8.35));
  // 星星亮起来的那一下：白蜡外面闪一圈小小的光芒
  if (t > BAND.t0) STARS.filter(s => s.big).forEach(s => {
    const k = pr(t, starRevealT(s), starRevealT(s) + 0.25) * (1 - pr(t, starRevealT(s) + 0.35, starRevealT(s) + 0.7));
    if (k <= 0) return;
    for (let j = 0; j < 4; j++) { const a = j * Math.PI / 2 + 0.4; line(FX, [[s.x + Math.cos(a) * s.r * 1.4, s.y + Math.sin(a) * s.r * 1.4], [s.x + Math.cos(a) * s.r * (1.4 + 1.2 * k), s.y + Math.sin(a) * s.r * (1.4 + 1.2 * k)]], { w: 4, col: K.white, p: 1, seed: s.seed + 30 + j, wob: 0.2 }); }
  });
  drawWash(WASH, t);
  subTo(SUBK, SUBT, t);
  comp.paperCam(CAM.x * 0.6, CAM.y * 0.6, CAM.s / 0.6);
  comp.begin();
  comp.crayon(HID.c);
  comp.crayon(RM.f.c); comp.crayon(RM.l.c);
  if (t > BAND.t0) comp.wash(WASH.c, { color: PAL.wash });
  comp.crayon(CT.f.c); comp.crayon(CT.l.c);
  comp.crayon(BD.f.c); comp.crayon(BD.l.c);
  const go = [hash(BOIL.step) * 300, hash(BOIL.step + 7) * 300];
  comp.group(PP, { goff: go }); comp.group(KT, { goff: go }); comp.group(QL, { goff: go });
  comp.crayon(FX.c, { goff: go });
  comp.knock(SUBK.c); comp.crayon(SUBT.c);
  // 夜里：台灯亮起一圈暖光，四周慢慢暗下来
  const lw = 0.4 * ss(pr(t, 10.6, 12.2));
  comp.finish({ vig: 0.3, lamp: [sx(LAMP.x - 260) / W, 1 - sy(LAMP.y - 60) / H, 0.95 * CAM.s / 0.6667, lw] });
}

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
