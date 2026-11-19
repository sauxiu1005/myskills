#!/usr/bin/env node
// Find the external tools the engine needs (FFmpeg, ffprobe, a Chromium browser) without installing anything.
//   node setup-tools.mjs                      report what is found, as JSON
//   node setup-tools.mjs --link <projectDir>  also link found ffmpeg/ffprobe into <projectDir>/.tools/bin,
//                                             which scripts/om.mjs puts on PATH automatically
// It searches PATH, common package-manager folders and host runtime folders (for example an
// imageio-ffmpeg binary shipped with a bundled Python). It never downloads; missing tools are reported
// so the agent can ask the user before installing anything.
import { existsSync, mkdirSync, readdirSync, statSync, symlinkSync, unlinkSync, lstatSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { delimiter, join, resolve } from 'node:path';
import { homedir } from 'node:os';

const isWin = process.platform === 'win32';
const exe = (n) => (isWin ? n + '.exe' : n);
const runs = (p, args = ['-version']) => { try { return spawnSync(p, args, { encoding: 'utf8', timeout: 8000 }).status === 0; } catch { return false; } };

function walk(dir, depth, test, out) {
  if (depth < 0 || out.length > 20) return;
  let entries; try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isFile() || e.isSymbolicLink()) { if (test(e.name)) out.push(full); }
    else if (e.isDirectory() && !e.name.startsWith('.git') && e.name !== 'node_modules') walk(full, depth - 1, test, out);
  }
}

function find(name) {
  const hits = [];
  for (const d of (process.env.PATH || '').split(delimiter)) if (d && existsSync(join(d, exe(name)))) hits.push({ path: join(d, exe(name)), source: 'PATH' });
  const common = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/opt/local/bin'];
  for (const d of common) if (existsSync(join(d, exe(name)))) hits.push({ path: join(d, exe(name)), source: 'common' });
  // host runtime folders: bundled Python/Node runtimes some hosts ship
  const roots = [join(homedir(), '.hub-global', 'runtimes'), join(homedir(), '.hub', 'runtimes')];
  for (const r of roots) {
    if (!existsSync(r)) continue;
    const found = [];
    walk(r, 8, (n) => n === exe(name) || (name === 'ffmpeg' && /^ffmpeg-(macos|linux|win)[\w.-]*$/.test(n)), found);
    for (const p of found) hits.push({ path: p, source: 'host-runtime' });
  }
  const seen = new Set();
  return hits.filter((h) => !seen.has(h.path) && seen.add(h.path) && runs(h.path));
}

function chrome() {
  if (process.env.OM_CHROME && existsSync(process.env.OM_CHROME)) return process.env.OM_CHROME;
  const mac = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'];
  for (const p of mac) if (existsSync(p)) return p;
  for (const n of ['google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge']) {
    for (const d of (process.env.PATH || '').split(delimiter)) if (d && existsSync(join(d, n))) return join(d, n);
  }
  return null;
}

const args = process.argv.slice(2);
const li = args.indexOf('--link');
const report = { node: process.versions.node, ffmpeg: find('ffmpeg')[0] || null, ffprobe: find('ffprobe')[0] || null, chrome: chrome(), linked: null, missing: [] };
if (!report.ffmpeg) report.missing.push('ffmpeg');
if (!report.ffprobe) report.missing.push('ffprobe');
if (!report.chrome) report.missing.push('chrome');

if (li >= 0) {
  const project = resolve(args[li + 1] || '.');
  const bin = join(project, '.tools', 'bin');
  mkdirSync(bin, { recursive: true });
  report.linked = { dir: bin, tools: [] };
  for (const [name, hit] of [['ffmpeg', report.ffmpeg], ['ffprobe', report.ffprobe]]) {
    if (!hit || hit.source === 'PATH') continue;
    const dest = join(bin, exe(name));
    try { if (lstatSync(dest)) unlinkSync(dest); } catch { /* none */ }
    symlinkSync(hit.path, dest);
    report.linked.tools.push(name);
  }
}
report.ready = report.missing.length === 0;
report.note = report.ready
  ? 'All engine tools found. Run om.mjs from inside the project so .tools/bin is on PATH (or set OM_TOOLS_DIR).'
  : `Missing: ${report.missing.join(', ')}. Ask the user before installing; preview stills and the single-file preview only need Chrome, render/sound/qa need ffmpeg + ffprobe.`;
console.log(JSON.stringify(report, null, 2));
process.exit(report.ready ? 0 : 2);
