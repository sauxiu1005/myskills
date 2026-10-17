import test from 'node:test';
import assert from 'node:assert/strict';
import { scrollExpression, buildExpressionCompose } from './compose-sync-video.mjs';

const shots = [
  {id:'S01',start:0,end:1},
  {id:'S02',start:1,end:2},
  {id:'S03',start:2,end:3},
  {id:'S04',start:3,end:4},
];
const rows = [
  {id:'S01',top:0,height:100},
  {id:'S02',top:110,height:100},
  {id:'S03',top:220,height:100},
  {id:'S04',top:330,height:100},
];

test('末镜即时进入安全锚点，前序镜头保持短缓动', () => {
  const expr = scrollExpression(shots, [0,0,110,220], .45);
  assert.match(expr, /clip\(\(t-2\)\/0\.45,0,1\)/);
  assert.match(expr, /gte\(t,3\)/);
});

test('透明尾区让末镜完整到达第二行，且每镜只有一个有效高亮', () => {
  const r = buildExpressionCompose({
    shots, rows, view:{x:20,y:80,width:600,height:300}, content:430,
    layout:{video:{width:640,height:360},panel:{width:640,height:400},stack:'vstack',fps:30,crf:20},
    video:'source.mp4', still:'static.png', listDim:'list-dim.png', listLit:'list-lit.png', out:'out.mp4', hasAudio:true,
  });
  assert.equal(r.anchor,110);
  assert.equal(r.targets.at(-1),220);
  assert.ok(r.paddedHeight >= 520, '末镜滚到第二行后，裁窗仍有完整像素');
  const filter = r.args[r.args.indexOf('-filter_complex') + 1];
  assert.equal((filter.match(/enable='between\(t,/g) || []).length, shots.length);
  assert.match(filter, /pad=640:520:0:0:color=black@0/);
});
