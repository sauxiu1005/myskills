// 角色设定页：?test=sheet
import { layer, clear, fill, text, CAM } from './crayon.js';
import { group, clearGroup } from './rig.js';
import { kitten, puppy, DR } from './chars.js';
import { PAL } from './pal.js';
const K = PAL.crayon;
const G = group(), T = layer();
export function sheet(comp, t) {
  CAM.x = 960; CAM.y = 540; CAM.s = 1; DR.l = 1; DR.f = 1;
  clearGroup(G); clear(T);
  const lab = (s, x, y, size = 30) => text(T, s, x, y, { size, font: 'ZCOOL KuaiLe', col: K.ink, p: 1, boil: 0.3 });
  const S = 0.85;
  kitten(G, { x: 150, y: 470, s: S, expr: 'calm' }); lab('安心', 150, 520);
  kitten(G, { x: 390, y: 470, s: S, expr: 'worried', brows: true, scared: 1, look: [0.4, -1] }); lab('害怕（耳朵后贴、抱尾巴）', 400, 520);
  kitten(G, { x: 640, y: 470, s: S, expr: 'wow', look: [0.6, -1] }); lab('惊喜', 640, 520);
  kitten(G, { x: 860, y: 470, s: S, expr: 'sleepy', blush: 0.8 }); lab('困了', 860, 520);
  puppy(G, { x: 1120, y: 470, s: 0.62, expr: 'calm', look: [1, 0] }); lab('平静', 1120, 520);
  puppy(G, { x: 1340, y: 470, s: 0.62, expr: 'happy', pose: 'runA', crayon: true }); lab('抱着黄蜡笔跑', 1340, 520);
  puppy(G, { x: 1560, y: 470, s: 0.62, expr: 'talk', open: true, pose: 'sit', armPose: 'stand' }); lab('“我陪你”', 1560, 520);
  puppy(G, { x: 1780, y: 470, s: 0.62, expr: 'closed', pose: 'sit', armPose: 'stand', blush: 0.6 }); lab('睡着', 1780, 520);
  const cols = Object.entries(K);
  cols.forEach(([k, c], i) => { const x = 300 + (i % 7) * 140, y = 680 + Math.floor(i / 7) * 130; fill(T, [[x, y], [x + 100, y], [x + 100, y + 80], [x, y + 80]], { col: c, p: 0.9, seed: i + 1 }); });
  lab('一盒 12 支蜡笔（轮廓梅子紫，白蜡留给星星）+ 群青水彩', 760, 960, 28);
  lab('《晚安，小猫》角色设定', 960, 70, 44);
  comp.begin(); comp.group(G); comp.crayon(T.c); comp.finish({ vig: 0.2 });
}
