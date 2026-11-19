// `om export html`: turn a project into a folder any static host can serve — a clean player page, a
// playable copy of the film, the om player, and the source as a zip, so whoever watches it can
// remix it in their own agent. Viewing it makes no network request; the only outside link is REPO_URL.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { OmError, readSource, scan } from './project.js';

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const REPO_URL = 'https://github.com/alchaincyf/huashu-motion';
const SKILL = REPO_URL.replace(/^https:\/\/github\.com\//, '');

// ---------- what ships ----------
// Tool state and render output stay home: the film copy and the zip carry only what the film needs.
const SKIP = new Set(['out', '.om', 'snapshots', 'node_modules', '.git', '.DS_Store']);
export const shipped = (rel) => !rel.split(/[\\/]/).some((seg) => SKIP.has(seg));

export function sourceFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      const rel = relative(root, full).split(sep).join('/');
      if (!shipped(rel)) continue;
      const st = e.isSymbolicLink() ? statSync(full) : e;
      if (st.isDirectory()) walk(full);
      else if (st.isFile()) files.push(rel);
    }
  };
  walk(root);
  return files.sort();
}

// The same injection the studio does: the source never references the engine, the copy does (live mode: the
// player drives it).
export function injectRuntime(html, src = '../player/om-engine.js') {
  const tag = `<script>window.__omConfig={video:"live",lenient:true}</script><script src="${src}"></script>`;
  if (/<head(\s[^>]*)?>/i.test(html)) return html.replace(/<head(\s[^>]*)?>/i, (m) => m + tag);
  // no <head>: after the doctype, never before it (a script ahead of the doctype puts the page in quirks mode)
  return /^\s*<!doctype[^>]*>/i.test(html) ? html.replace(/^\s*<!doctype[^>]*>/i, (m) => m + tag) : tag + html;
}

// ---------- zip (store/deflate, UTF-8 names) ----------
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => { for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
const crc32 = zlib.crc32 || ((buf) => { let c = 0xffffffff; for (const b of buf) c = CRC_TABLE[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; });

export function zip(entries) {
  const parts = [], central = [];
  let offset = 0;
  for (const { name, data, mtime = new Date() } of entries) {
    const file = Buffer.from(name, 'utf8');
    const packed = zlib.deflateRawSync(data, { level: 9 });
    const stored = packed.length >= data.length;
    const body = stored ? data : packed;
    const time = (mtime.getHours() << 11) | (mtime.getMinutes() << 5) | (mtime.getSeconds() >> 1);
    const date = ((Math.max(1980, mtime.getFullYear()) - 1980) << 9) | ((mtime.getMonth() + 1) << 5) | mtime.getDate();
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(stored ? 0 : 8, 8);
    local.writeUInt16LE(time, 10); local.writeUInt16LE(date, 12); local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(file.length, 26);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0); dir.writeUInt16LE(0x0314, 4); dir.writeUInt16LE(20, 6); dir.writeUInt16LE(0x0800, 8); dir.writeUInt16LE(stored ? 0 : 8, 10);
    dir.writeUInt16LE(time, 12); dir.writeUInt16LE(date, 14); dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(body.length, 20); dir.writeUInt32LE(data.length, 24); dir.writeUInt16LE(file.length, 28);
    dir.writeUInt32LE((0o100644 << 16) >>> 0, 38); dir.writeUInt32LE(offset, 42);
    parts.push(local, file, body);
    central.push(dir, file);
    offset += 30 + file.length + body.length;
  }
  const cd = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cd, end]);
}

// ---------- title and blurb ----------
// gallery.json (or a template's template.json) may give { title, description|summary }, each either a
// string or { en, zh }. Otherwise the <title> of index.html, minus an "huashu-motion ·" prefix.
const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[e]);
export function readMeta(root, html) {
  let meta = {};
  for (const f of ['template.json', 'gallery.json']) { try { meta = { ...meta, ...JSON.parse(readFileSync(join(root, f), 'utf8')) }; } catch {} }
  const doc = /<title>([^<]*)<\/title>/i.exec(html)?.[1];
  const fromDoc = doc && decode(doc).replace(/^\s*huashu-motion\s*[·|:—–-]\s*/i, '').trim();
  return { title: meta.title || fromDoc || basename(root), description: meta.description || meta.summary || '' };
}

const slug = (s) => String(s).normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'film';

function freeDir(parent, base) {
  for (let v = 1; ; v++) {
    const dir = join(parent, v === 1 ? base : `${base}-v${v}`);
    if (!existsSync(dir)) return dir;
  }
}

// ---------- export ----------
export function exportHtml(project, { out, title, description, name, back } = {}) {
  const { html } = readSource(project);
  const s = scan(html);
  name = slug(name || basename(project.root));
  const meta = readMeta(project.root, html);
  const dir = out ? resolve(out) : freeDir(join(project.root, 'out'), `${name}-share`);
  if (existsSync(dir) && readdirSync(dir).length) throw new OmError(`${dir} already exists and is not empty — pick a new folder (om never overwrites an export)`);
  if (relative(project.root, dir) && !relative(project.root, dir).startsWith('..') && shipped(relative(project.root, dir))) {
    throw new OmError('export into the project\'s out/ folder or outside the project, so the export does not end up in its own source');
  }

  const files = sourceFiles(project.root);
  const put = (rel, data) => { const f = join(dir, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, data); };
  const entries = [];
  for (const rel of files) {
    const data = readFileSync(join(project.root, rel));
    put(`film/${rel}`, rel === 'index.html' ? injectRuntime(data.toString('utf8')) : data);
    entries.push({ name: `${name}/${rel}`, data, mtime: statSync(join(project.root, rel)).mtime });
  }
  put('source.zip', zip(entries));
  for (const f of ['om-player.js', 'om-engine.js']) put(`player/${f}`, readFileSync(join(PKG, 'runtime', f)));
  for (const f of ['Inter-var.woff', 'NotoSansSC-500.woff', 'OFL.txt']) put(`fonts/${f}`, readFileSync(join(PKG, 'fonts', f)));
  put('index.html', sharePage({
    title: title || meta.title, description: description ?? meta.description, name,
    width: s.width || 1920, height: s.height || 1080, duration: s.duration, back,
  }));
  return { dir, name, files };
}

// ---------- the page ----------
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] ?? v.en ?? v.zh ?? Object.values(v)[0] : v) || '';
const both = (v) => (v && typeof v === 'object' ? `<span data-l="en">${esc(pick(v, 'en'))}</span><span data-l="zh">${esc(pick(v, 'zh'))}</span>` : esc(v));
const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

export function sharePage({ title, description, name, width, height, duration, back }) {
  const plain = pick(title, 'en');
  const data = { title: { en: pick(title, 'en'), zh: pick(title, 'zh') }, name, repo: REPO_URL, skill: SKILL };
  return `<!doctype html>
<html lang="en" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(plain)} · huashu-motion</title>
<meta name="description" content="${esc(pick(description, 'en'))}">
<meta property="og:title" content="${esc(plain)}">
<meta property="og:description" content="${esc(pick(description, 'en') || 'Made with huashu-motion')}">
<meta name="theme-color" content="#11100e">
<script>try { document.documentElement.dataset.lang = localStorage.getItem('om-lang') || ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'); } catch { document.documentElement.dataset.lang = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'; }</script>
<style>
@font-face { font-family: "Inter"; src: url("fonts/Inter-var.woff") format("woff"); font-weight: 100 900; font-display: swap; }
@font-face { font-family: "Noto Sans SC"; src: url("fonts/NotoSansSC-500.woff") format("woff"); font-weight: 400 700; font-display: swap; unicode-range: U+3000-303F, U+3400-9FFF, U+FF00-FFEF; }
:root {
  --bg: #11100e; --raise: #1a1916; --raise-2: #23211d; --line: #2e2b26; --line-soft: #24221e;
  --ink: #f4f1eb; --ink-2: #b9b2a6; --ink-3: #7d776d; --accent: #e5531a; --accent-ink: #fff;
  --ar: ${width} / ${height};
  --sans: "Inter", "PingFang SC", "Noto Sans SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
  color-scheme: dark;
}
* { box-sizing: border-box; }
[hidden] { display: none !important; }
html[data-lang="en"] [data-l="zh"], html[data-lang="zh"] [data-l="en"] { display: none; }
html, body { margin: 0; background: var(--bg); color: var(--ink); }
body { min-height: 100svh; display: flex; flex-direction: column; font: 15px/1.55 var(--sans); -webkit-font-smoothing: antialiased; font-feature-settings: "cv11", "ss01"; }
body::before { content: ""; position: fixed; inset: -20vh -10vw auto; height: 90vh; pointer-events: none; z-index: 0;
  background: radial-gradient(60% 55% at 50% 40%, #e5531a14, transparent 70%); }
a { color: inherit; }
button { font: inherit; color: inherit; border: 0; background: none; cursor: pointer; }

.top { position: relative; display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 28px; }
.brand { display: inline-flex; align-items: center; gap: 9px; font-weight: 600; letter-spacing: -.01em; text-decoration: none; }
.nav { display: flex; align-items: center; gap: 18px; }
.back { padding-left: 18px; border-left: 1px solid var(--line); color: var(--ink-2); font-size: 13.5px; text-decoration: none; }
.back::before { content: "← "; color: var(--ink-3); }
.back:hover { color: var(--ink); }
.logo { width: 18px; height: 18px; border-radius: 5px; background: conic-gradient(from 210deg, var(--accent), #f59f00, var(--accent)); box-shadow: inset 0 0 0 4px var(--bg); }
.lang { display: inline-flex; padding: 3px; border-radius: 99px; background: var(--raise); box-shadow: inset 0 0 0 1px var(--line-soft); font-size: 12px; }
.lang button { padding: 3px 10px; border-radius: 99px; color: var(--ink-3); }
html[data-lang="en"] .lang [data-set="en"], html[data-lang="zh"] .lang [data-set="zh"] { background: var(--raise-2); color: var(--ink); }

main { position: relative; flex: 1; width: 100%; max-width: 1240px; margin: 0 auto; padding: 8px 28px 40px; }
.stage { position: relative; width: min(100%, calc((100svh - 260px) * (${width} / ${height}))); min-width: min(100%, 560px); aspect-ratio: var(--ar); margin: 0 auto;
  border-radius: 14px; overflow: hidden; background: #000; box-shadow: 0 0 0 1px #ffffff12, 0 30px 80px -20px #000000c0, 0 12px 30px -12px #00000080; }
.stage om-player { display: block; width: 100%; height: 100%; }
.fs { position: absolute; top: 12px; right: 12px; z-index: 3; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 9px;
  background: #0000006b; color: #fff; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); opacity: 0; transition: opacity .2s; }
.stage:hover .fs, .fs:focus-visible { opacity: 1; }
@media (hover: none) { .fs { opacity: .85; } }
.fs svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.stage:fullscreen { width: 100vw; height: 100vh; max-width: none; border-radius: 0; display: grid; place-items: center; }
.stage:fullscreen om-player { width: min(100vw, calc(100vh * ${width} / ${height})); height: auto; aspect-ratio: var(--ar); }
.stuck { position: absolute; inset: 0; z-index: 4; display: grid; place-items: center; padding: 24px; text-align: center; background: #0d0c0bf0; color: var(--ink-2); font-size: 14px; }
.stuck b { display: block; margin-bottom: 8px; color: var(--ink); font-size: 16px; font-weight: 600; }
.stuck code { display: inline-block; margin-top: 12px; padding: 7px 12px; border-radius: 8px; background: var(--raise-2); color: var(--ink); font: 13px var(--mono); user-select: all; }

.info { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; width: min(100%, calc((100svh - 260px) * (${width} / ${height}))); min-width: min(100%, 560px); margin: 26px auto 0; }
.info h1 { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 650; letter-spacing: -.022em; text-wrap: balance; }
.info p { margin: 8px 0 0; max-width: 62ch; color: var(--ink-2); text-wrap: pretty; }
.meta { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 12px !important; font-size: 13px; color: var(--ink-3) !important; font-variant-numeric: tabular-nums; }
.meta a { color: var(--ink-2); text-decoration: none; border-bottom: 1px solid var(--line); }
.meta a:hover { color: var(--ink); border-color: var(--ink-3); }

.remix { position: fixed; right: 28px; bottom: 28px; z-index: 10; display: inline-flex; align-items: center; gap: 9px; height: 46px; padding: 0 20px 0 16px; border-radius: 99px;
  background: var(--accent); color: var(--accent-ink); font-weight: 600; letter-spacing: -.005em; box-shadow: 0 10px 30px -8px #e5531a99, 0 2px 6px #00000066; transition: transform .15s, box-shadow .15s; }
.remix:hover { transform: translateY(-1px); box-shadow: 0 14px 34px -8px #e5531ab3, 0 2px 6px #00000066; }
.remix svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }

.sheet { position: fixed; right: 28px; bottom: 88px; z-index: 11; width: 440px; max-width: calc(100vw - 32px); max-height: calc(100svh - 120px); overflow: auto; padding: 20px;
  border-radius: 16px; background: var(--raise); box-shadow: 0 0 0 1px var(--line), 0 30px 70px -10px #000000d0; animation: rise .18s ease-out; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } }
.sheet h2 { margin: 0; font-size: 16px; font-weight: 650; letter-spacing: -.01em; }
.sheet .x { position: absolute; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 8px; color: var(--ink-3); font-size: 20px; line-height: 1; }
.sheet .x:hover { background: var(--raise-2); color: var(--ink); }
.sheet .lead { margin: 6px 0 16px; color: var(--ink-2); font-size: 13.5px; }
.label { margin: 18px 0 8px; font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-3); }
.code { position: relative; border-radius: 10px; background: var(--bg); box-shadow: inset 0 0 0 1px var(--line-soft); }
.code pre { margin: 0; padding: 12px 84px 12px 14px; white-space: pre-wrap; word-break: break-word; font: 12.5px/1.6 var(--mono); color: var(--ink); }
.code.cmd pre { padding-top: 10px; padding-bottom: 10px; white-space: pre; overflow-x: auto; word-break: normal; }
.code.cmd pre::before { content: "$ "; color: var(--ink-3); }
.copy { position: absolute; top: 7px; right: 7px; height: 28px; padding: 0 11px; border-radius: 7px; background: var(--raise-2); color: var(--ink-2); font-size: 12px; font-weight: 550; box-shadow: inset 0 0 0 1px var(--line); }
.copy:hover { color: var(--ink); }
.copy.done { background: #1f3a2a; color: #7ee2a8; box-shadow: none; }
.code.prompt .copy { background: var(--accent); color: #fff; box-shadow: none; }
.code + .code { margin-top: 8px; }
.sheet .dl { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--line-soft); font-size: 13px; color: var(--ink-3); }
.sheet .dl a { color: var(--ink); text-decoration: none; font-weight: 550; }
.sheet .dl a:hover { color: var(--accent); }

footer { position: relative; padding: 22px 28px 30px; text-align: center; font-size: 12px; color: var(--ink-3); letter-spacing: .01em; }
footer a { color: var(--ink-2); text-decoration: none; }
footer a:hover { color: var(--ink); }

@media (max-width: 720px) {
  .top { height: 54px; padding: 0 16px; }
  main { padding: 0 16px 8px; }
  .stage, .info { width: 100%; min-width: 0; }
  .stage { border-radius: 10px; }
  .info { display: block; margin-top: 18px; }
  .info h1 { font-size: 21px; }
  .info p { font-size: 14.5px; }
  .remix { position: static; display: flex; justify-content: center; width: 100%; margin-top: 20px; box-shadow: 0 8px 24px -10px #e5531a99; }
  .sheet { left: 0; right: 0; bottom: 0; width: auto; max-width: none; max-height: 86svh; border-radius: 18px 18px 0 0; padding: 20px 16px calc(20px + env(safe-area-inset-bottom)); }
  footer { padding: 20px 16px 28px; }
}
</style>
<script src="player/om-player.js"></script>
</head>
<body>
<header class="top">
  <div class="nav"><a class="brand" href="${REPO_URL}"><span class="logo" aria-hidden="true"></span>huashu-motion</a>${back ? `<a class="back" href="${esc(back)}"><span data-l="en">All works</span><span data-l="zh">全部作品</span></a>` : ''}</div>
  <div class="lang" role="group" aria-label="Language"><button data-set="en">EN</button><button data-set="zh">中文</button></div>
</header>

<main>
  <figure class="stage" id="stage" style="margin-block: 0">
    <om-player id="player" src="film/index.html" controls></om-player>
    <button class="fs" id="fs" title="Fullscreen (F)" aria-label="Fullscreen"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
    <div class="stuck" id="stuck" hidden><div>
      <b><span data-l="en">The film can't load from a double-clicked file.</span><span data-l="zh">直接双击打开时，浏览器不让影片加载。</span></b>
      <span data-l="en">Serve this folder instead — in a terminal inside it, run:</span><span data-l="zh">在这个文件夹里打开终端，运行下面这行，再用浏览器打开它给的地址：</span><br>
      <code>npx serve .</code>
    </div></div>
  </figure>

  <section class="info">
    <div>
      <h1>${both(title)}</h1>
      ${description ? `<p>${both(description)}</p>` : ''}
      <p class="meta"><span>${width}×${height}</span><span id="dur">${duration ? fmt(duration) : ''}</span><a href="source.zip" download><span data-l="en">Source (.zip)</span><span data-l="zh">下载源码</span></a></p>
    </div>
  </section>
  <button class="remix" id="remix" aria-haspopup="dialog" aria-expanded="false">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l6-6-6-6M12 19h8"/></svg>
    <span data-l="en">Remix in your agent</span><span data-l="zh">在你的 Agent 里 Remix</span>
  </button>
</main>

<div class="sheet" id="sheet" role="dialog" aria-modal="false" aria-labelledby="sheet-title" hidden>
  <button class="x" id="close" aria-label="Close">×</button>
  <h2 id="sheet-title"><span data-l="en">Remix this film</span><span data-l="zh">Remix 这部片</span></h2>
  <p class="lead"><span data-l="en">It's code, not pixels. Paste this into Claude Code, Codex, Cursor or any coding agent, then point at the frame to change it.</span><span data-l="zh">它是代码，不是像素。把下面这段贴给 Claude Code、Codex、Cursor 或任何编程 Agent，然后指着画面改。</span></p>
  <div class="label"><span data-l="en">Prompt</span><span data-l="zh">提示词</span></div>
  <div class="code prompt"><pre id="prompt"></pre><button class="copy" data-copy="prompt"></button></div>
  <div class="label"><span data-l="en">First time with huashu-motion</span><span data-l="zh">第一次用 huashu-motion</span></div>
  <div class="code cmd"><pre id="skill">npx skills add ${esc(SKILL)}</pre><button class="copy" data-copy="skill"></button></div>
  <div class="code cmd"><pre id="demo">npx huashu-motion demo</pre><button class="copy" data-copy="demo"></button></div>
  <div class="dl"><span><span data-l="en">The whole project, ready for <code>om studio</code></span><span data-l="zh">完整工程，解压即可 <code>om studio</code></span></span><a href="source.zip" download>source.zip ↓</a></div>
</div>

<footer>made with <a href="${REPO_URL}">huashu-motion</a></footer>

<script type="application/json" id="om-share">${json(data)}</script>
<script>
(() => {
  const D = JSON.parse(document.getElementById('om-share').textContent);
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement, player = $('player'), sheet = $('sheet'), remix = $('remix'), stage = $('stage');
  const T = {
    en: { copy: 'Copy', copied: 'Copied', prompt: (t, url) => 'Remix this film with huashu-motion: "' + t + '".\\nSource: ' + url + ' (download and unzip it, then run \`npx huashu-motion studio ' + D.name + '\` so I can watch and point at the frame while you work).\\nKeep what works, and change it to: ' },
    zh: { copy: '复制', copied: '已复制', prompt: (t, url) => '用 huashu-motion 复刻这部片：《' + t + '》。\\n源码：' + url + '（下载解压后运行 \`npx huashu-motion studio ' + D.name + '\`，我边看边指着画面改）。\\n保留好的部分，把它改成：' },
  };
  const store = (k, v) => { try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch { return null; } };
  const setLang = (l) => {
    root.dataset.lang = l; root.lang = l === 'zh' ? 'zh-CN' : 'en'; store('om-lang', l);
    $('prompt').textContent = T[l].prompt(D.title[l] || D.title.en, new URL('source.zip', location.href).href);
    document.querySelectorAll('.copy').forEach((b) => { if (!b.classList.contains('done')) b.textContent = T[l].copy; });
  };
  setLang(root.dataset.lang === 'zh' ? 'zh' : 'en');
  document.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.set)));

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
    const t = Object.assign(document.createElement('textarea'), { value: text });
    t.style.cssText = 'position:fixed;opacity:0'; document.body.append(t); t.select();
    const ok = document.execCommand('copy'); t.remove(); return ok;
  };
  document.querySelectorAll('.copy').forEach((b) => b.addEventListener('click', async () => {
    if (!(await copyText($(b.dataset.copy).textContent))) return;
    b.classList.add('done'); b.textContent = T[root.dataset.lang].copied;
    clearTimeout(b.t); b.t = setTimeout(() => { b.classList.remove('done'); b.textContent = T[root.dataset.lang].copy; }, 1600);
  }));

  const open = (on) => { sheet.hidden = !on; remix.setAttribute('aria-expanded', on); };
  remix.addEventListener('click', (e) => { e.stopPropagation(); open(sheet.hidden); });
  $('close').addEventListener('click', () => open(false));
  document.addEventListener('click', (e) => { if (!sheet.hidden && !sheet.contains(e.target)) open(false); });

  const fsOn = document.fullscreenEnabled || document.webkitFullscreenEnabled;
  const fullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) return (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    (stage.requestFullscreen || stage.webkitRequestFullscreen).call(stage);
  };
  if (fsOn) $('fs').addEventListener('click', fullscreen); else $('fs').hidden = true;
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, button, a') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') open(false);
    else if (e.key === ' ' || e.key === 'k') { e.preventDefault(); player.paused ? player.play() : player.pause(); }
    else if ((e.key === 'f' || e.key === 'F') && fsOn) fullscreen();
  });

  const fmt = (t) => { const m = Math.floor(t / 60), s = Math.round(t - m * 60); return m + ':' + String(s).padStart(2, '0'); };
  let ready = false;
  player.addEventListener('ready', (e) => {
    ready = true; $('stuck').hidden = true;
    const d = (e.detail && e.detail.duration) || player.duration;
    if (d) $('dur').textContent = fmt(d);
  });
  // A double-clicked file:// page may refuse to run the film's frame; say how to fix it instead of a blank box.
  if (location.protocol === 'file:') setTimeout(() => { if (!ready) $('stuck').hidden = false; }, 8000);
})();
</script>
</body>
</html>
`;
}

function fmt(t) { const m = Math.floor(t / 60), s = Math.round(t - m * 60); return `${m}:${String(s).padStart(2, '0')}`; }
