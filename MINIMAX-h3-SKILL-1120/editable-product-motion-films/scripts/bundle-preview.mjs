#!/usr/bin/env node
// Package one film for canvas preview and hand-off, without a server:
//   node bundle-preview.mjs <filmDir> [--out preview.html] [--zip source.zip] [--title "…"] [--no-audio] [--no-autoplay]
//
// preview.html is a single self-contained file: the composition with every local script, stylesheet,
// font, image, audio and video inlined as data URIs, the bundled om-engine injected in live mode, and a
// small player (play/pause, scrub, time, sound) that drives it through an iframe srcdoc. Nothing is
// fetched at view time, so a canvas or file previewer that renders HTML can play it.
// --zip writes the editable source (index.html, vendor/, assets/, treatment, records) without out/, .om/,
// .tools/ or snapshots, so it can be unpacked and re-rendered with the same engine.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const VENDOR = resolve(here, '../vendor/motion');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const flag = (k) => args.includes(k);
const film = resolve(args.find((a, i) => !a.startsWith('--') && !['--out', '--zip', '--title'].includes(args[i - 1])) || '.');
const src = join(film, 'index.html');
if (!existsSync(src)) { console.error(`no index.html in ${film}`); process.exit(1); }
const out = resolve(opt('--out') || join(film, 'out', 'preview.html'));
const noAudio = flag('--no-audio');

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.ogg': 'audio/ogg', '.opus': 'audio/ogg', '.flac': 'audio/flac',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
  '.json': 'application/json', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.hdr': 'application/octet-stream', '.bin': 'application/octet-stream',
};
const AUDIO = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.opus', '.flac']);
const inlined = new Map();
const missing = new Set();
let bytes = 0;

const isRemote = (p) => /^(?:[a-z]+:|\/\/|#)/i.test(p);
function dataUri(fromDir, ref) {
  const clean = ref.split(/[?#]/)[0];
  if (!clean || isRemote(clean)) return null;
  let file;
  try { file = resolve(fromDir, decodeURI(clean)); } catch { file = resolve(fromDir, clean); }
  const ext = extname(file).toLowerCase();
  if (!MIME[ext]) return null;
  if (!existsSync(file) || !statSync(file).isFile()) { missing.add(relative(film, file)); return null; }
  if (noAudio && AUDIO.has(ext)) return 'data:' + MIME[ext] + ';base64,';
  if (!inlined.has(file)) {
    const buf = readFileSync(file);
    bytes += buf.length;
    inlined.set(file, 'data:' + MIME[ext] + ';base64,' + buf.toString('base64'));
  }
  return inlined.get(file);
}
const cssUrls = (css, fromDir) => css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, ref) => { const d = dataUri(fromDir, ref.trim()); return d ? `url("${d}")` : m; });
const safeScript = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');

let html = readFileSync(src, 'utf8');
// 1. external local scripts -> inline
html = html.replace(/<script\b([^>]*?)\bsrc\s*=\s*(['"])([^'"]+)\2([^>]*)>\s*<\/script>/gi, (m, a, q, ref, b) => {
  if (isRemote(ref)) return m;
  const file = resolve(film, ref.split(/[?#]/)[0]);
  if (!existsSync(file)) { missing.add(relative(film, file)); return m; }
  const attrs = (a + ' ' + b).replace(/\s+/g, ' ').trim();
  return `<script${attrs ? ' ' + attrs : ''}>${safeScript(readFileSync(file, 'utf8'))}</script>`;
});
// 2. local stylesheets -> <style>, urls resolved from the stylesheet's folder
html = html.replace(/<link\b[^>]*\brel\s*=\s*(['"])stylesheet\1[^>]*>/gi, (m) => {
  const h = m.match(/\bhref\s*=\s*(['"])([^'"]+)\1/i);
  if (!h || isRemote(h[2])) return m;
  const file = resolve(film, h[2].split(/[?#]/)[0]);
  if (!existsSync(file)) { missing.add(relative(film, file)); return m; }
  return `<style>${cssUrls(readFileSync(file, 'utf8'), dirname(file))}</style>`;
});
// 3. url() inside <style> blocks and style="" attributes
html = html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, a, css, b) => a + cssUrls(css, film) + b);
html = html.replace(/\bstyle\s*=\s*"([^"]*url\([^"]*)"/gi, (m, css) => `style="${cssUrls(css, film).replace(/"/g, '&quot;')}"`);
// 4. any quoted relative path to a local media/font file (attributes, variables JSON, script strings)
html = html.replace(/(["'`])((?:\.\/|\.\.\/)?[\w\-.\/%\u4e00-\u9fff]+\.(?:png|jpe?g|gif|webp|avif|svg|woff2?|ttf|otf|mp3|wav|m4a|aac|ogg|opus|flac|mp4|webm|mov|json|glb|gltf|hdr|bin))\1/gi, (m, q, ref) => {
  const d = dataUri(film, ref);
  return d ? q + d + q : m;
});
// 5. files loaded at run time by path built in code (e.g. clip.js: fontDir + 'NotoSansSC-500.woff'):
//    a virtual file map plus a shim for fetch / XHR / FontFace / img·audio·video src, so relative loads resolve
//    to data URIs inside the srcdoc. Only files whose path or name appears in the page are included.
const SKIPDIR = new Set(['out', '.om', '.tools', 'snapshots', 'node_modules', '.git', 'qa']);
const all = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIPDIR.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && MIME[extname(e.name).toLowerCase()]) all.push(full);
  }
})(film);
const vfs = {};
for (const file of all) {
  const rel = relative(film, file).split(sep).join('/');
  if (html.includes(rel) || html.includes("'" + basename(file) + "'") || html.includes('"' + basename(file) + '"')) {
    const d = dataUri(film, rel);
    if (d) vfs[rel] = d;
  }
}
// bare file names (font tables in libraries) that the film never ships are not missing files
for (const m of [...missing]) if (!m.includes('/')) missing.delete(m);
const shim = `(function(){var F=${JSON.stringify(vfs)};
function r(u){if(typeof u!=='string')return u;var k=u.replace(/^[.][/]/,'').split(/[?#]/)[0];try{k=decodeURI(k)}catch(e){}return F[k]||u}
window.__omFiles=F;var of=window.fetch;if(of)window.fetch=function(u,o){return of.call(this,typeof u==='string'?r(u):u,o)};
var ox=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){arguments[1]=r(u);return ox.apply(this,arguments)};
if(window.FontFace){var OF=window.FontFace;window.FontFace=function(n,s,d){if(typeof s==='string')s=s.replace(/url\\(\\s*(['"]?)([^'")]+)\\1\\s*\\)/g,function(m,q,u){return 'url("'+r(u)+'")'});return new OF(n,s,d)};window.FontFace.prototype=OF.prototype}
[window.HTMLImageElement,window.HTMLMediaElement,window.HTMLSourceElement].forEach(function(C){if(!C)return;var d=Object.getOwnPropertyDescriptor(C.prototype,'src');if(!d||!d.set)return;Object.defineProperty(C.prototype,'src',{get:d.get,set:function(v){d.set.call(this,r(v))},configurable:true})});
var sa=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(n==='src'||n==='href'||n==='poster')v=r(v);return sa.call(this,n,v)};})();`;

// 6. engine in live mode, before the film's own scripts
const engine = readFileSync(join(VENDOR, 'runtime/om-engine.js'), 'utf8');
const inject = `<script>${safeScript(shim)}</script><script>window.__omConfig={video:"live",lenient:true}</script><script>${safeScript(engine)}</script>`;
if (/<head(\s[^>]*)?>/i.test(html)) html = html.replace(/<head(\s[^>]*)?>/i, (m) => m + inject);
else html = /^\s*<!doctype[^>]*>/i.test(html) ? html.replace(/^\s*<!doctype[^>]*>/i, (m) => m + inject) : inject + html;

const W = Number((html.match(/data-width\s*=\s*["'](\d+)/) || [])[1] || 1920);
const H = Number((html.match(/data-height\s*=\s*["'](\d+)/) || [])[1] || 1080);
const title = opt('--title') || (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || basename(film);
const autoplay = !flag('--no-autoplay');
const payload = JSON.stringify(html).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const page = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
html,body{margin:0;height:100%;background:#0b0b0c;color:#eee;font:12px/1.4 ui-monospace,Menlo,monospace;overflow:hidden}
#wrap{position:absolute;inset:0;bottom:44px}
#stage{position:absolute;left:0;top:0;transform-origin:0 0}
#stage iframe{display:block;border:0;background:#000;width:${W}px;height:${H}px}
#cover{position:absolute;inset:0;cursor:pointer}
#bar{position:absolute;left:0;right:0;bottom:0;height:44px;display:flex;align-items:center;gap:12px;padding:0 14px;box-sizing:border-box;background:#141416}
#bar button{all:unset;cursor:pointer;width:24px;height:24px;display:grid;place-items:center}
#bar svg{width:16px;height:16px;fill:currentColor}
#track{flex:1;height:6px;background:#333;border-radius:3px;position:relative;cursor:pointer}
#fill{position:absolute;left:0;top:0;bottom:0;background:#fff;border-radius:3px}
#time{min-width:110px;text-align:right;font-variant-numeric:tabular-nums}
#msg{position:absolute;inset:0;display:none;align-items:center;justify-content:center;padding:24px;text-align:center}
</style></head><body>
<div id="wrap"><div id="stage"><iframe id="film" title="${esc(title)}" allow="autoplay"></iframe></div><div id="cover"></div><div id="msg"></div></div>
<div id="bar"><button id="pp" aria-label="播放/暂停"><svg viewBox="0 0 24 24"></svg></button><div id="track"><div id="fill"></div></div><span id="time">0:00.0 / 0:00.0</span><button id="snd" aria-label="声音"><svg viewBox="0 0 24 24"></svg></button></div>
<script id="om-film" type="application/json">${payload}</script>
<script>
(function(){
var W=${W},H=${H},AUTOPLAY=${autoplay};
var PLAY='<path d="M7 4l13 8-13 8z"/>',PAUSE='<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>',SOUND='<path d="M4 9h4l5-4v14l-5-4H4z M16 8a5 5 0 010 8"/>',MUTE='<path d="M4 9h4l5-4v14l-5-4H4z M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" fill="none"/>';
var $=function(id){return document.getElementById(id)};
var frame=$('film'),wrap=$('wrap'),stage=$('stage'),eng=null,dur=0,t=0,playing=false,t0=0,p0=0,raf=0,muted=true;
function fmt(s){return Math.floor(s/60)+':'+(s%60).toFixed(1).padStart(4,'0')}
function fit(){var k=Math.min(wrap.clientWidth/W,wrap.clientHeight/H);stage.style.transform='translate('+((wrap.clientWidth-W*k)/2)+'px,'+((wrap.clientHeight-H*k)/2)+'px) scale('+k+')'}
function ui(){$('pp').firstChild.innerHTML=playing?PAUSE:PLAY;$('snd').firstChild.innerHTML=muted?MUTE:SOUND;$('fill').style.width=(dur?100*t/dur:0)+'%';$('time').textContent=fmt(t)+' / '+fmt(dur)}
function drive(p){try{eng&&eng.preview(t,p)}catch(e){fail(String(e&&e.message||e))}}
function fail(m){var el=$('msg');el.textContent=m;el.style.display='flex'}
function step(){if(!playing)return;t=t0+(performance.now()-p0)/1000;if(t>=dur){t0=0;p0=performance.now();t=0}drive(true);ui();raf=requestAnimationFrame(step)}
function play(){if(!eng||playing)return;if(t>=dur-1e-3)t=0;playing=true;t0=t;p0=performance.now();ui();raf=requestAnimationFrame(step)}
function pause(){if(!playing)return;playing=false;cancelAnimationFrame(raf);drive(false);ui()}
function seek(s){t=Math.max(0,Math.min(dur,s));if(playing){t0=t;p0=performance.now()}drive(playing);ui()}
$('cover').onclick=$('pp').onclick=function(){playing?pause():play()};
$('snd').onclick=function(){muted=!muted;eng&&eng.setMuted(muted);ui()};
var track=$('track');function scrub(e){var r=track.getBoundingClientRect();seek((e.clientX-r.left)/r.width*dur)}
track.addEventListener('pointerdown',function(e){track.setPointerCapture(e.pointerId);scrub(e);track.onpointermove=scrub});
track.addEventListener('pointerup',function(){track.onpointermove=null});
document.addEventListener('keydown',function(e){if(e.code==='Space'){e.preventDefault();playing?pause():play()}});
window.addEventListener('resize',fit);
frame.addEventListener('load',function(){
  var win;try{win=frame.contentWindow;void win.document}catch(e){return fail('预览环境阻止了内嵌播放')}
  var s=performance.now();(function poll(){
    if(win.__omReady===true&&win.__omEngine){eng=win.__omEngine;dur=eng.duration();eng.setMuted(muted);fit();drive(false);ui();window.__previewReady=true;if(AUTOPLAY)play();return}
    if(win.__omBootFailed)return fail('动画未能启动：'+win.__omBootFailed);
    if(performance.now()-s>60000)return fail('动画在 60 秒内没有就绪');
    setTimeout(poll,30)})();
});
window.__preview={play:play,pause:pause,seek:seek,get time(){return t},get duration(){return dur}};
fit();ui();frame.srcdoc=JSON.parse($('om-film').textContent);
})();
</script></body></html>`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, page);
const size = Buffer.byteLength(page);
const report = { preview: out, bytes: size, width: W, height: H, inlinedFiles: inlined.size, runtimeFiles: Object.keys(vfs).length, missing: [...missing] };
if (size > 45 * 1024 * 1024) report.warning = 'preview is over 45 MB; most uploads cap at 50 MB — use --no-audio or lighter footage';

const zipOut = opt('--zip');
if (zipOut) {
  const { sourceFiles, zip } = await import(new URL('../vendor/motion/cli/lib/export.js', import.meta.url).href);
  const skip = (rel) => /^(\.tools|qa|tmp)\//.test(rel) || /^[^/]*-\d+(\.\d+)?s\.png$/.test(rel) || rel.endsWith('.zip');
  const files = sourceFiles(film).filter((r) => !skip(r));
  const entries = files.map((rel) => ({ name: basename(film) + '/' + rel, data: readFileSync(join(film, rel)), mtime: statSync(join(film, rel)).mtime }));
  const zp = resolve(zipOut);
  mkdirSync(dirname(zp), { recursive: true });
  writeFileSync(zp, zip(entries));
  report.zip = { path: zp, files: files.length, bytes: statSync(zp).size };
}
console.log(JSON.stringify(report, null, 2));
