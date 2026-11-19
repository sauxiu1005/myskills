// 角色：小猫（坐姿）、小狗（站、跑、坐），局部原点在脚底 / 坐点
import { line, fill, dab, ellipse, handCircle, xf, smooth } from './crayon.js';
import { part, tube, curve } from './rig.js';
import { PAL } from './pal.js';
const K = PAL.crayon;
const LW = 7;
export const DR = { l: 1, f: 1 };
const lo = (seed, x = {}) => ({ w: LW, seed, col: K.ink, draw: DR.l, ...x });
const fo = (col, seed, x = {}) => ({ col, p: 0.82, gap: 9, w: 11, ang: 0.6, seed, over: 4, draw: DR.f, ...x });
function T0(o) { const k = o.flip ? -1 : 1; return pts => xf(pts, { x: o.x || 0, y: o.y || 0, s: o.s || 1, r: o.r || 0, sx: k }); }

function eyes(C, P, xs, y, ex, look, sd) {
  xs.forEach((x, i) => {
    const s = sd + i * 7;
    if (ex === 'happy') { line(C.l, P([[x - 11, y + 5], [x - 5, y - 5], [x + 5, y - 5], [x + 11, y + 5]]), lo(s, { w: 5.5, taper: 0.3 })); return; }
    if (ex === 'closed') { line(C.l, P([[x - 11, y - 2], [x - 5, y + 5], [x + 5, y + 5], [x + 11, y - 2]]), lo(s, { w: 5.5, taper: 0.3 })); return; }
    const r = ex === 'wow' ? 10 : 8;
    const ex_ = x + look[0] * 5, ey = y + look[1] * 6;
    part(C, P(ellipse(ex_, ey, r * 0.85, r * 1.12, 16)), { col: K.ink, p: 1, gap: 3.2, w: 5, over: 0.5, seed: s, ang: 1.3, draw: DR.f }, lo(s + 1, { w: 4 }), { occ: false });
    if (DR.f > 0.9) dab(C.l, ...P([[ex_ + 3, ey - 4]])[0], 2.6, { col: K.white, p: 1, seed: s + 2, gap: 2, w: 3 });
    if (ex === 'sleepy') { const lid = [[ex_ - r - 3, ey - r - 4], [ex_ + r + 3, ey - r - 4], [ex_ + r + 3, ey], [ex_ - r - 3, ey]]; part(C, P(lid), null, null, { occ: true, kn: false }); line(C.l, P([[ex_ - r - 2, ey], [ex_ + r + 2, ey]]), lo(s + 4, { w: 4.5 })); }
  });
}
function worriedBrows(C, P, xs, y, sd) {
  xs.forEach((x, i) => { const inner = x < 0 ? 1 : -1; line(C.l, P([[x - inner * 11, y + 2], [x + inner * 11, y - 7]]), lo(sd + i, { w: 5, p: 0.9 })); });
}
function mouth(C, P, x, y, ex, sd, open) {
  if (ex === 'talk' && open) { part(C, P(ellipse(x, y + 4, 7, 8, 18)), { col: K.coral, p: 0.95, gap: 3, w: 4, over: 0.5, seed: sd, draw: DR.f }, lo(sd + 1, { w: 4.5 }), { occ: false }); return; }
  if (ex === 'wow') { part(C, P(ellipse(x, y + 5, 7, 9, 16)), { col: K.coral, p: 0.95, gap: 3, w: 4, over: 0.5, seed: sd, draw: DR.f }, lo(sd + 1, { w: 4.5 }), { occ: false }); return; }
  if (ex === 'happy') { part(C, P([[x - 13, y - 2], [x - 7, y + 9], [x + 7, y + 9], [x + 13, y - 2]]), { col: K.coral, p: 0.95, gap: 3, w: 4, over: 0.5, seed: sd, draw: DR.f }, lo(sd + 1, { w: 4.5 }), { occ: false }); return; }
  if (ex === 'worried') { line(C.l, P([[x - 9, y + 5], [x - 3, y], [x + 3, y], [x + 9, y + 5]]), lo(sd, { w: 4.5 })); return; }
  line(C.l, P([[x - 11, y], [x - 5, y + 5], [x, y], [x + 5, y + 5], [x + 11, y]]), lo(sd, { w: 4.5 }));
}

// ———————— 小猫：橘色、白肚皮、三角耳、长尾巴；害怕时耳朵往后贴、尾巴卷进怀里 ————————
export function kitten(C, o) {
  const P = T0(o), sd = o.seed || 100, ex = o.expr || 'calm', look = o.look || [0, 0];
  const scared = o.scared ?? 0;
  // 尾巴（放松时在身后）
  if (scared < 0.5) {
    const tl = curve([[52, -26], [118, -40], [150, -100], [128, -160], [104, -168]], 6);
    part(C, P(tube(tl, 26, 20)), fo(K.orange, sd + 1, { p: 0.85 }), lo(sd + 2));
    line(C.l, P([[134, -132], [154, -126]]), lo(sd + 3, { w: 5, col: K.rust, p: 1 })); line(C.l, P([[146, -92], [164, -98]]), lo(sd + 4, { w: 5, col: K.rust, p: 1 }));
  }
  // 身体 + 肚皮
  part(C, P(ellipse(0, -84, 72, 88, 44)), fo(K.orange, sd + 10, { p: 0.85, ang: 0.4 }), lo(sd + 11));
  part(C, P(ellipse(0, -72, 40, 56, 32)), fo(K.cream, sd + 12, { p: 0.9, ang: 1.0 }), lo(sd + 13, { w: 5, p: 0.7 }));
  // 尾巴（害怕时卷到身前，被抱着）
  if (scared >= 0.5) {
    const tl = curve([[56, -20], [70, -60], [30, -96], [-26, -92], [-44, -62]], 6);
    part(C, P(tube(tl, 26, 20)), fo(K.orange, sd + 14, { p: 0.85 }), lo(sd + 15));
    line(C.l, P([[4, -104], [10, -84]]), lo(sd + 16, { w: 5, col: K.rust, p: 1 })); line(C.l, P([[-28, -100], [-24, -80]]), lo(sd + 17, { w: 5, col: K.rust, p: 1 }));
  }
  // 手臂
  const arms = scared >= 0.5 ? [[[-52, -136], [-40, -96], [-6, -84]], [[52, -136], [42, -100], [14, -82]]] : (o.arms || [[[-52, -136], [-70, -96], [-62, -56]], [[52, -136], [70, -96], [62, -56]]]);
  arms.forEach((pts, i) => {
    part(C, P(tube(curve(pts, 5), 22)), fo(K.orange, sd + 20 + i, { p: 0.85 }), lo(sd + 22 + i));
    const h = pts[pts.length - 1]; part(C, P(handCircle(h[0], h[1], 13, sd + i, 0, 18)), fo(K.cream, sd + 24 + i, { p: 0.9, gap: 6, w: 8 }), lo(sd + 26 + i, { w: 5.5 }));
  });
  // 耳朵：放松竖起 → 害怕往两边、往后贴
  [-1, 1].forEach((k, i) => {
    const a = k * (0.25 + 0.75 * scared), cx = k * 46, cy = -246 + 14 * scared;
    const tri = [[-28, 18], [0, -46], [28, 18]].map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
    part(C, P(smooth(tri, 4)), fo(K.orange, sd + 30 + i, { p: 0.85 }), lo(sd + 32 + i));
    const inn = [[-14, 12], [0, -26], [14, 12]].map(([x, y]) => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]);
    part(C, P(inn), fo(K.coral, sd + 34 + i, { p: 0.95, gap: 5, w: 7, over: 1 }), null, { occ: false, kn: false });
  });
  // 头
  part(C, P(ellipse(0, -200, 80, 66, 44)), fo(K.orange, sd + 40, { p: 0.85, ang: 0.5 }), lo(sd + 41));
  [[-14, -262, -10, -236], [0, -266, 0, -238], [14, -262, 10, -236]].forEach(([a, b, c, d], i) => line(C.l, P([[a, b + 6], [c, d]]), lo(sd + 42 + i, { w: 5, col: K.rust, p: 1 })));
  part(C, P(ellipse(0, -176, 30, 20, 24)), fo(K.cream, sd + 46, { p: 0.9, gap: 6, w: 8 }), null, { occ: false });
  const bl = o.blush ?? 0.4;
  [[-50, -180], [50, -180]].forEach(([x, y], i) => dab(C.f, ...P([[x, y]])[0], (10 + 6 * bl) * (o.s || 1), { col: K.coral, p: 0.7 + 0.3 * bl, seed: sd + 47 + i, sq: 0.7 }));
  eyes(C, P, [-28, 28], -206, ex === 'talk' ? (o.talkEye || 'calm') : ex, look, sd + 50);
  if (o.brows) worriedBrows(C, P, [-28, 28], -230, sd + 60);
  part(C, P([[-7, -186], [7, -186], [0, -178]]), { col: K.coral, p: 1, gap: 3, w: 4, over: 0.5, seed: sd + 62, draw: DR.f }, lo(sd + 63, { w: 3.5 }), { occ: false });
  mouth(C, P, 0, -172, ex === 'sleepy' || ex === 'closed' ? 'calm' : ex, sd + 64, o.open);
  [-1, 1].forEach((k, i) => { [-6, 4].forEach((dy, j) => line(C.l, P([[k * 40, -176 + dy], [k * 82, -182 + dy * 2.2]]), lo(sd + 70 + i * 2 + j, { w: 3.5, p: 0.85 }))); });
}

// ———————— 小狗：奶咖色、垂耳朵、小红领巾 ————————
const PUP_ARMS = {
  stand: [[[-70, -206], [-92, -160], [-96, -118]], [[70, -206], [92, -160], [96, -118]]],
  runA: [[[-70, -206], [-104, -186], [-124, -150]], [[70, -206], [96, -230], [112, -268]]],
  runB: [[[-70, -206], [-96, -230], [-112, -268]], [[70, -206], [104, -186], [124, -150]]],
  hold: [[[-70, -206], [-92, -160], [-96, -118]], [[70, -206], [118, -250], [138, -300]]],
  draw: [[[-70, -206], [-92, -160], [-96, -118]], [[70, -206], [118, -176], [168, -150]]],
  hug: [[[-70, -206], [-92, -160], [-96, -118]], [[70, -206], [130, -210], [176, -190]]],
};
export const PUP_HAND = (pose, arms) => { const a = (arms || PUP_ARMS[pose] || PUP_ARMS.stand)[1]; return a[a.length - 1]; };
export function puppy(C, o) {
  const P = T0(o), sd = o.seed || 300, ex = o.expr || 'calm', look = o.look || [0, 0];
  const pose = o.pose || 'stand';
  // 腿
  if (pose === 'sit') {
    [-1, 1].forEach((k, i) => { part(C, P(ellipse(k * 44, -18, 40, 26, 26)), fo(K.latte, sd + 1 + i, { p: 0.85 }), lo(sd + 3 + i)); part(C, P(ellipse(k * 52, -10, 18, 12, 18)), fo(K.cream, sd + 5 + i, { p: 0.9, gap: 6, w: 8 }), null, { occ: false, kn: false }); });
  } else {
    const ph = pose === 'runA' ? 1 : pose === 'runB' ? -1 : 0;
    [-1, 1].forEach((k, i) => {
      const sw = ph * k * 26;
      const pts = [[k * 30, -96], [k * 32 + sw * 0.5, -50], [k * 34 + sw, -14]];
      part(C, P(tube(curve(pts, 4), 34, 30)), fo(K.latte, sd + 7 + i, { p: 0.85 }), lo(sd + 9 + i));
      const f = pts[2]; part(C, P(ellipse(f[0] + 8, f[1] + 6, 26, 14, 20)), fo(K.cream, sd + 11 + i, { p: 0.9, gap: 6, w: 8 }), lo(sd + 13 + i, { w: 5.5 }));
    });
  }
  const by = pose === 'sit' ? 30 : 0;
  // 身体
  part(C, P(ellipse(0, -150 + by, 88, 100, 46)), fo(K.latte, sd + 20, { p: 0.85, ang: 0.4 }), lo(sd + 21));
  part(C, P(ellipse(0, -136 + by, 52, 64, 36)), fo(K.cream, sd + 22, { p: 0.9, ang: 0.9 }), lo(sd + 23, { w: 5, p: 0.7 }));
  // 手臂
  const arms = (o.arms || PUP_ARMS[pose === 'sit' ? (o.armPose || 'stand') : pose] || PUP_ARMS.stand).map(a => a.map(([x, y]) => [x, y + by]));
  arms.forEach((pts, i) => {
    part(C, P(tube(curve(pts, 5), 32, 28)), fo(K.latte, sd + 24 + i, { p: 0.85 }), lo(sd + 26 + i));
  });
  if (o.crayon) {   // 黄蜡笔
    const h = arms[1][2], q = arms[1][1]; const dx = h[0] - q[0], dy = h[1] - q[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const a = [h[0] - ux * 6, h[1] - uy * 6], b = [h[0] + ux * 58, h[1] + uy * 58];
    part(C, P(tube([a, b], 18)), fo(K.lemon, sd + 30, { p: 1, gap: 5, w: 7 }), lo(sd + 31, { w: 5 }));
    const tip = [b[0] + ux * 18, b[1] + uy * 18], nx = -uy * 8, ny = ux * 8;
    part(C, P([[b[0] + nx, b[1] + ny], tip, [b[0] - nx, b[1] - ny]]), fo(K.lemon, sd + 32, { p: 1.1, gap: 4, w: 6, over: 1 }), lo(sd + 33, { w: 4.5 }));
  }
  arms.forEach((pts, i) => { const h = pts[2]; part(C, P(handCircle(h[0], h[1], 18, sd + 34 + i, 0, 18)), fo(K.cream, sd + 36 + i, { p: 0.9, gap: 6, w: 8 }), lo(sd + 38 + i, { w: 5.5 })); });
  // 小红领巾
  const sc = [[-62, -236 + by], [62, -236 + by], [56, -212 + by], [10, -206 + by], [0, -176 + by], [-12, -206 + by], [-56, -212 + by]];
  part(C, P(smooth(sc, 3)), fo(K.red, sd + 40, { p: 1, gap: 6, w: 8, ang: 0.2 }), lo(sd + 41, { w: 6 }));
  // 头
  const hy = -310 + by;
  part(C, P(ellipse(0, hy, 88, 76, 46)), fo(K.latte, sd + 44, { p: 0.85, ang: 0.5 }), lo(sd + 45));
  // 垂耳朵（在头前面的两侧）
  [-1, 1].forEach((k, i) => {
    const sw = (o.earSwing || 0) * k;
    part(C, P(ellipse(k * 84, hy + 22, 26, 58, 30, 0, Math.PI * 2, k * 0.3 + sw)), fo(K.cocoa, sd + 46 + i, { p: 0.9 }), lo(sd + 48 + i));
  });
  part(C, P(ellipse(0, hy + 30, 40, 28, 30)), fo(K.cream, sd + 50, { p: 0.95, gap: 6, w: 8 }), lo(sd + 51, { w: 5, p: 0.7 }));
  part(C, P(ellipse(0, hy + 16, 14, 10, 18)), { col: K.ink, p: 1, gap: 3, w: 5, over: 0.5, seed: sd + 52, draw: DR.f }, lo(sd + 53, { w: 4 }), { occ: false });
  const bl = o.blush ?? 0.3;
  [[-56, hy + 26], [56, hy + 26]].forEach(([x, y], i) => dab(C.f, ...P([[x, y]])[0], (10 + 6 * bl) * (o.s || 1), { col: K.coral, p: 0.7 + 0.3 * bl, seed: sd + 54 + i, sq: 0.7 }));
  eyes(C, P, [-32, 32], hy - 10, ex === 'talk' ? 'calm' : ex, look, sd + 60);
  mouth(C, P, 0, hy + 40, ex === 'closed' ? 'calm' : ex, sd + 70, o.open);
}
