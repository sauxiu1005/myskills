// render.mjs: renders studio.html in headless Chrome. Length and fps come from the page (PROJECT in src/config.js).
//
//   Look at it (open the images with your image viewer / Read tool):
//     node render.mjs --sheet=0.5,1,1.5,2 [--cols=4] [--w=480] --out=out/check/a.jpg        contact sheet of chosen times
//     node render.mjs --strip=2.0:2.5 [--cols=6] [--w=320] --out=out/check/strip.jpg        EVERY frame in a stretch (motion)
//     node render.mjs --sheet=2.1,2.2 --crop=760,300,400,400 --w=600 --out=out/check/face.jpg full-res crops (details)
//     node render.mjs --strip=2.0:2.5 --crop-at=960,780,500,400 --out=out/check/feet.jpg       crops that follow a WORLD point
//         (x,y in world px, may be page expressions like PLK.MX(1.38); w,h in screen px) through each frame's camera
//     node render.mjs --stills=1.2,3.4 --out=out/stills                                     full-res PNGs
//   Make the video:
//     node render.mjs --clip [--range=0:4] --out=out/video.mp4                               straight to MP4 (one worker)
//     node render.mjs --frames [--range=0:8] [--workers=1]                                   JPEG frames → out/frames (resumable)
//     node render.mjs --encode --out=out/video.mp4                                           out/frames → MP4
//   Standalone loops (LOOPS in the page): add --loop=<name> to any of the above (times are then loop times), or
//     node render.mjs --loop=emotions --png --out=out/loop_emotions                          one cycle as PNGs (for GIFs)
//   Music: --audio=assets/song.mp3 (or PROJECT.audio) is muxed into --clip and --encode. Other flags: --fps=24,
//   --chrome=<path to Chrome/Chromium>, --ffmpeg=<path to ffmpeg> (or FFMPEG_PATH).
//   Short sample only:
//     node render.mjs --sample[=20 | =a:b] [--out=out/sample.mp4]                           first N s, or the stretch a–b s, straight to MP4, then stop
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, renameSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { prepareFrameCache, isFrameCacheCurrent } from './render-cache.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--?/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const SELF = fileURLToPath(import.meta.url);
const span = s => String(s).split(':').map(Number);
const MODES = ['sheet', 'strip', 'stills', 'png', 'frames', 'clip', 'encode', 'sample'];
function usage() {
  const head = readFileSync(SELF, 'utf8').split('\n').filter(l => l.startsWith('//')).slice(0, 22).map(l => l.replace(/^\/\/ ?/, '')).join('\n');
  console.log(head + '\n\nRun these from a project folder (made by scripts/new_project.sh). Exit codes: 0 ok, 1 usage error, 2 missing dependency.');
}
const die = (msg, code = 1) => { console.error('error: ' + msg); process.exit(code); };
if (args.help || args.h) { usage(); process.exit(0); }
if (!MODES.some(m => args[m])) { usage(); process.exit(process.argv.length > 2 ? 1 : 0); }
// --sample[=N]: a short MP4 of the first N seconds (default 20), then stop. Never starts the full render.
// --sample=a:b: that stretch instead (pick the shot that best shows the film, e.g. the drop or the climax).
if (args.sample) {
  const v = args.sample === true ? '20' : String(args.sample);
  const [a, b] = v.includes(':') ? span(v) : [0, +v];
  if (!(b > a && a >= 0)) die('--sample takes seconds (--sample=20) or a stretch (--sample=10.4:30.4)');
  args.clip = true; args.range = `${a}:${b}`; args.out = args.out || 'out/sample.mp4';
}
// ---- dependency checks: say what is missing and how to get it, before anything else runs ----
function onPath(name) { for (const d of (process.env.PATH || '').split(process.platform === 'win32' ? ';' : ':')) { for (const ext of process.platform === 'win32' ? ['.exe', ''] : ['']) { const f = `${d}/${name}${ext}`; if (d && existsSync(f)) return f; } } return null; }
function findFfmpeg() { return [args.ffmpeg, process.env.FFMPEG_PATH, onPath('ffmpeg'), '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg'].find(p => p && p !== true && existsSync(p)); }
const FFMPEG = (args.encode || args.clip) ? findFfmpeg() : null;
if ((args.encode || args.clip) && !FFMPEG) die('ffmpeg not found. Install it (macOS: brew install ffmpeg · Ubuntu: sudo apt install ffmpeg · Windows: winget install ffmpeg), or pass --ffmpeg=<path> / set FFMPEG_PATH.', 2);
if (!existsSync(resolve('studio.html'))) die(`no studio.html in ${process.cwd()}: run this from a project folder (create one with scripts/new_project.sh <dir>).`);
let puppeteer = null;
if (!args.encode) {
  try { puppeteer = (await import('puppeteer-core')).default; }
  catch { die('npm packages not installed (puppeteer-core missing). Run `npm install` in this project folder (needs Node.js 18+ with npm).', 2); }
}
const CHROMES = [args.chrome, process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ...playwrightChromes()];
// Chromium builds Playwright downloaded (~/.cache/ms-playwright/chromium-NNNN), newest first
function playwrightChromes() {
  const dir = `${homedir()}/.cache/ms-playwright`;
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(n => /^chromium-\d+$/.test(n)).sort((a, b) => b.split('-')[1] - a.split('-')[1])
    .map(n => `${dir}/${n}/chrome-linux64/chrome`);
}
const CHROME = CHROMES.find(p => p && existsSync(p));
if (!CHROME && !args.encode) die('Chrome/Chromium not found. Install Google Chrome, or pass --chrome=<path> / set CHROME_PATH.', 2);
const fps = +(args.fps || 24), FRAMES_DIR = 'out/frames';
const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' exited ' + c)) : ok()); });
const times = s => String(s).split(',').map(Number);
// comma-separated fields, keeping commas inside parentheses ('PLK.MX(1.38),PLK.WL,500,300'); numbers stay numbers
const fields = s => { const out = []; let d = 0, cur = ''; for (const ch of String(s)) { if (ch === ',' && !d) { out.push(cur); cur = ''; continue; } d += ch === '(' ? 1 : ch === ')' ? -1 : 0; cur += ch; } out.push(cur); return out.map(v => isNaN(+v) ? v : +v); };

if (args.encode) {
  const out = args.out || 'out/video.mp4';
  if (!isFrameCacheCurrent(process.cwd(), { fps, loop: args.loop || null })) {
    die('rendered frames are missing a current cache manifest; run `node render.mjs --frames` again before encoding');
  }
  // no page is loaded here, so read PROJECT.audio straight from src/config.js (the music is on by default)
  let audio = args.audio;
  if (audio === undefined && existsSync('src/config.js')) { const m = readFileSync('src/config.js', 'utf8').match(/audio\s*:\s*['"`]([^'"`]+)['"`]/); if (m) audio = m[1]; }
  if (audio === true || audio === 'none') audio = '';
  const n = existsSync(FRAMES_DIR) ? readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg')).length : 0;
  if (!n) die(`no frames in ${FRAMES_DIR}: render them first with  node render.mjs --frames`);
  if (audio && !existsSync(audio)) die(`audio file not found: ${audio}`);
  mkdirSync(dirname(out), { recursive: true });
  console.log(`encoding ${n} frames → ${out}${audio ? ' with ' + audio : ''}`);
  await run(FFMPEG, ['-y', '-loglevel', 'error', '-stats', '-framerate', String(fps), '-i', `${FRAMES_DIR}/f%05d.jpg`,
    ...(audio ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-vf', 'scale=out_range=tv,format=yuv420p', '-color_range', 'tv', '-movflags', '+faststart', out]);
  console.log('wrote ' + out + (audio ? '' : '  (NO AUDIO: no --audio and no PROJECT.audio in src/config.js)'));
  process.exit(0);
}

// --soft-gl: no GPU on this machine; render WebGL in software (SwiftShader), which Chrome only allows when asked.
// --gpu-angle=vulkan|gl-egl: headless Linux on an NVIDIA GPU (e.g. a cloud or cluster node); plain --use-gl=angle gets
// no WebGL context there. Check which GPU Chrome actually lands on with gpu_probe.mjs.
const ANGLE = { vulkan: ['--use-angle=vulkan', '--enable-features=Vulkan'], 'gl-egl': ['--use-angle=gl-egl'] };
if (args['gpu-angle'] && !ANGLE[args['gpu-angle']]) { console.error(`--gpu-angle must be one of ${Object.keys(ANGLE)}`); process.exit(1); }
const gpu = args['soft-gl'] ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  : args['gpu-angle'] ? ANGLE[args['gpu-angle']]
  : process.platform === 'win32' ? ['--use-angle=d3d11'] : process.platform === 'darwin' ? ['--use-angle=metal'] : ['--use-gl=angle'];
// Ubuntu 23.10+ blocks Chrome's user-namespace sandbox; headless rendering of local files doesn't need it.
const sandbox = process.platform === 'linux' ? ['--no-sandbox'] : [];
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: [...sandbox, '--allow-file-access-from-files', '--ignore-gpu-blocklist', ...gpu, '--enable-gpu-rasterization', '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
});
async function openPage(tag = '') {
  const page = await browser.newPage();
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[page${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[page error${tag}]`, e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'networkidle0', timeout: 180000 });
  await page.waitForFunction('window.ready === true', { timeout: 60000 });
  if (args.loop) {
    const ok = await page.evaluate(name => { if (!LOOPS[name]) return false; window.LOOP = LOOPS[name]; return true; }, args.loop);
    if (!ok) { console.error(`no loop named "${args.loop}"`); process.exit(1); }
  }
  return page;
}
const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};
// the length of whatever is being rendered: a loop's .len, or the video's duration
const lengthOf = page => page.evaluate(() => window.LOOP ? window.LOOP.len : DUR);

if (args.sheet || args.strip) {
  const page = await openPage(), out = args.out || 'out/sheet.jpg'; mkdirSync(dirname(out), { recursive: true });
  let ts;
  if (args.strip) { const [a, b] = span(args.strip); ts = []; for (let i = Math.round(a * fps); i <= Math.round(b * fps); i++) ts.push(i / fps); }
  else ts = times(args.sheet);
  const crop = args.crop ? times(args.crop) : null, at = args['crop-at'] ? fields(args['crop-at']) : null;
  const { url, ms } = await page.evaluate((ts, c, w, crop, at) => window.renderSheet(ts, c, w, crop, at), ts, +(args.cols || (args.strip ? 6 : 3)), +(args.w || (args.strip ? 320 : 640)), crop, at);
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out}  (${ts.length} frames)  ms/frame: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = args.out || 'out/stills'; mkdirSync(out, { recursive: true });
  console.log('GPU:', await page.evaluate(() => window.gpuInfo()));
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, s, 'image/png');
    const f = `${out}/t${s.toFixed(2).replace('.', '_')}.png`; writeFileSync(f, buf);
    console.log(`${f}  ${Date.now() - t0} ms`);
  }
} else if (args.png) {
  // PNG sequence (for GIFs): a loop's full cycle (frame n equals frame 0, so it isn't rendered), or --range=a:b.
  const probe = await openPage(), len = await lengthOf(probe); await probe.close();
  const [a, b] = args.range ? span(args.range) : [0, len], n = Math.round((b - a) * fps);
  const out = args.out || `out/${args.loop ? 'loop_' + args.loop : 'png'}`, workers = +(args.workers || 3); mkdirSync(out, { recursive: true });
  let next = 0; const start = Date.now();
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage('#' + w);
    while (next < n) { const i = next++; writeFileSync(`${out}/f${String(i).padStart(4, '0')}.png`, await frameOf(page, a + i / fps, 'image/png')); }
  }));
  console.log(`${n} frames → ${out}  (${((Date.now() - start) / n).toFixed(0)} ms/frame)`);
} else if (args.frames) {
  // Parallel and resumable: each worker pulls the next missing frame; files are written atomically.
  const probe = await openPage(), len = await lengthOf(probe); await probe.close();
  const [a, b] = args.range ? span(args.range) : [0, len], workers = +(args.workers || 1);   // >1 can time out on laptops; the run is resumable, so just re-run it
  prepareFrameCache(process.cwd(), { fps, loop: args.loop || null });
  mkdirSync(FRAMES_DIR, { recursive: true });
  const first = Math.round(a * fps), last = Math.min(Math.ceil(len * fps) - 1, Math.round(b * fps) - 1);
  const todo = []; for (let i = first; i <= last; i++) { const f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`; if (!existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${todo.length} frames to render (${last - first + 1 - todo.length} already done), ${workers} workers`);
  let next = 0, done = 0; const start = Date.now();
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage('#' + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES_DIR}/f${String(i).padStart(5, '0')}.jpg`;
      const buf = await frameOf(page, i / fps, 'image/jpeg', .94);
      writeFileSync(f + '.tmp', buf); renameSync(f + '.tmp', f);
      if (++done % 24 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`frame ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/frame effective  eta ${((todo.length - done) * el / done / 60).toFixed(1)} min`);
      }
    }
  }));
} else if (args.clip) {
  const page = await openPage(), len = await lengthOf(page);
  let [a, b] = args.range ? span(args.range) : typeof args.clip === 'string' ? span(args.clip) : [0, len];
  if (b > len) { console.log(`note: clipped to the video's length (${len} s)`); b = len; }
  if (!(b > a)) die(`nothing to render: ${a}–${b} s is outside the video (0–${len} s)`);
  const audio = args.audio || await page.evaluate(() => PROJECT.audio || '');
  const out = args.out || 'out/clip.mp4'; mkdirSync(dirname(out), { recursive: true });
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    ...(audio ? ['-ss', String(a), '-t', String(b - a), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-vf', 'scale=out_range=tv,format=yuv420p', '-color_range', 'tv', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((b - a) * fps), start = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await frameOf(page, a + i / fps, 'image/jpeg', .93);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 24 === 0 || i === n - 1) console.log(`frame ${i + 1}/${n}  ${((Date.now() - start) / (i + 1)).toFixed(0)} ms/frame`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(`wrote ${out}`);
  if (args.sample) {
    const msf = (Date.now() - start) / n, full = Math.ceil(len * fps), shotT = await page.evaluate(() => (typeof SHOTS !== 'undefined' ? SHOTS.map(s => s[0]) : []));
    console.log(`sample done: ${a}–${b} s of ${len} s, ${msf.toFixed(0)} ms/frame. Stopped here (the full video was not rendered).`);
    console.log(`full video: ${full} frames ≈ ${(full * msf / 60000).toFixed(1)} min to render (one worker) once every shot is built.`);
    console.log(`shots registered so far start at: ${shotT.length ? shotT.map(v => +v.toFixed(2)).join(', ') + ' s' : 'none'} — compare with STORYBOARD.md to see what is still missing.`);
  }
}
await browser.close();
