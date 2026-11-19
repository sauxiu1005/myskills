#!/usr/bin/env node
// Give the user a clickable entry into the editable project: the bundled Studio (live preview, variable
// inspector, click-to-comment, undo, render) served on this machine's loopback address.
//   node open-project.mjs <filmDir>          reuse the Studio already serving this film, or start one in the background
//   node open-project.mjs <filmDir> --stop   stop it
// Prints JSON: { url, root, pid, reused, verified }. "verified" means the URL answered as a Studio whose
// project root is exactly this film — not merely that some server listens on the port (another app may hold
// the default port; the CLI then moves to the next free one).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, readFileSync, realpathSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const film = resolve(args.find((a) => !a.startsWith('--')) || '.');
if (!existsSync(join(film, 'index.html'))) { console.error(`no index.html in ${film}`); process.exit(1); }
const root = realpathSync(film);
const omDir = join(root, '.om');
mkdirSync(omDir, { recursive: true });
const record = join(omDir, 'studio.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

async function servesThisFilm(url) {
  try {
    const r = await fetch(new URL('api/state', url), { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return false;
    const s = await r.json();
    return !!s.root && realpathSync(s.root) === root;
  } catch { return false; }
}

const prev = existsSync(record) ? JSON.parse(readFileSync(record, 'utf8')) : null;

if (args.includes('--stop')) {
  if (prev && alive(prev.pid)) process.kill(prev.pid);
  if (existsSync(record)) unlinkSync(record);
  console.log(JSON.stringify({ stopped: !!prev, root }));
  process.exit(0);
}

if (prev && alive(prev.pid) && await servesThisFilm(prev.url)) {
  console.log(JSON.stringify({ ...prev, reused: true, verified: true }, null, 2));
  process.exit(0);
}

const log = join(omDir, 'studio.log');
const fd = openSync(log, 'w');
const child = spawn(process.execPath, [join(here, 'om.mjs'), 'studio', '.', '--no-open'], { cwd: root, detached: true, stdio: ['ignore', fd, fd], env: process.env });
child.unref();

let url = null;
for (let i = 0; i < 100 && !url; i++) {
  await sleep(150);
  const m = readFileSync(log, 'utf8').match(/studio\s+(https?:\/\/\S+)/);
  if (m) url = m[1];
  if (!alive(child.pid)) break;
}
const verified = !!url && await servesThisFilm(url);
const info = { url, root, pid: child.pid, startedAt: new Date().toISOString(), log };
if (verified) writeFileSync(record, JSON.stringify(info, null, 2));
else if (alive(child.pid)) process.kill(child.pid);
console.log(JSON.stringify({ ...info, reused: false, verified, ...(verified ? {} : { error: readFileSync(log, 'utf8').slice(-800) }) }, null, 2));
process.exit(verified ? 0 : 1);
