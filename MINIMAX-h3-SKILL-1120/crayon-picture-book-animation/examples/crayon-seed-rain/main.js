import { makeComp } from './gl.js';
import { BOIL } from './crayon.js';
const Q = new URLSearchParams(location.search);
const comp = makeComp(document.getElementById('gl'));
window.DUR = 1;
await document.fonts.load('400 40px "ZCOOL KuaiLe"', '小熊要下雨啦别怕看我的嘻一点都没湿');
const M = await import('./film.js');
if (Q.get('test') === 'sheet') {
  const S = await import('./sheet.js');
  window.render = t => { BOIL.step = Math.floor(t * 12); S.sheet(comp, t, Q.get('page') || 'cast'); };
} else {
  window.DUR = M.DUR; window.EV = M.EV; window.SUBS = M.SUBS;
  window.render = t => { BOIL.step = Math.floor(t * 12 + 1e-6); M.frame(comp, t); };
}
window.READY = true;
