// 角色设定页：?test=sheet
import { layer, clear, line, fill, text, CAM } from './crayon.js';
import { group, clearGroup } from './rig.js';
import { bunny, bear, cloud, leaf, DR } from './chars.js';
import { PAL } from './pal.js';
const K = PAL.crayon;
const G = group(), T = layer();
export function sheet(comp, t, page) {
  CAM.x = 960; CAM.y = 540; CAM.s = 1; DR.l = 1; DR.f = 1;
  clearGroup(G); clear(T);
  const lab = (s, x, y, size = 30) => text(T, s, x, y, { size, font: 'ZCOOL KuaiLe', col: K.ink, p: 1, boil: 0.3 });
  const S = 0.62;
  bunny(G, { x: 150, y: 470, s: S, expr: 'calm', look: [0, 0] }); lab('平静', 150, 520);
  bunny(G, { x: 340, y: 470, s: S, expr: 'talk', open: true, pose: 'point', look: [0.2, -1] }); lab('“要下雨啦！”', 350, 520);
  bunny(G, { x: 560, y: 470, s: S, expr: 'worried', pose: 'worried', ear: 1, look: [0.3, -1] }); lab('担心（耳朵耷拉）', 560, 520);
  bunny(G, { x: 780, y: 470, s: S, expr: 'happy', pose: 'happy', blush: 1 }); lab('开心脸红', 780, 520);
  bear(G, { x: 1080, y: 470, s: S, expr: 'calm', look: [-0.8, 0] }); lab('平静', 1080, 520);
  bear(G, { x: 1290, y: 470, s: S, expr: 'talk', open: true, pose: 'chest' }); lab('“别怕！”', 1290, 520);
  bear(G, { x: 1500, y: 470, s: S, expr: 'happy', pose: 'hold', crayon: true }); lab('举起绿蜡笔', 1500, 520);
  bear(G, { x: 1730, y: 470, s: S, expr: 'happy', pose: 'leaf', look: [-0.5, -1] }); lab('撑叶子', 1730, 520);
  cloud(G, { x: 260, y: 760, s: 0.55, expr: 'grumpy' }); lab('乌云：生气', 260, 870);
  cloud(G, { x: 580, y: 760, s: 0.55, expr: 'puff', puff: 1 }); lab('鼓腮', 580, 870);
  cloud(G, { x: 900, y: 760, s: 0.55, expr: 'smile', pink: 1 }); lab('涂粉、笑了', 900, 870);
  const cols = Object.entries(K);
  cols.forEach(([k, c], i) => { const x = 1130 + (i % 6) * 125, y = 650 + Math.floor(i / 6) * 150; fill(T, [[x, y], [x + 90, y], [x + 90, y + 80], [x, y + 80]], { col: c, p: 0.9, seed: i + 1 }); });
  lab('一盒 11 支蜡笔（轮廓靛蓝，白蜡留给雨滴）+ 群青水彩', 1490, 980, 28);
  lab('《下雨啦》角色设定', 960, 70, 44);
  comp.begin();
  comp.group(G);
  comp.crayon(T.c);
  comp.finish({ vig: 0.2 });
}
