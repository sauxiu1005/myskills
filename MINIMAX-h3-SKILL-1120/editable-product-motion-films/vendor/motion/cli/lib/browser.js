// Finding a browser to drive: the Chrome the user already has; nothing is downloaded.
//   1. OM_CHROME (a path)
//   2. an installed Chrome / Chromium / Edge / Brave
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const APPS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  '/snap/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

// Where a browser would be looked for, in order, with what was found. `env` and `apps` are injectable for tests.
export function chromeCandidates({ env = process.env, apps = APPS } = {}) {
  const list = [];
  if (env.OM_CHROME) list.push({ source: 'OM_CHROME', path: env.OM_CHROME });
  for (const p of apps) list.push({ source: 'installed', path: p });
  return list;
}

export function findChrome(opts) {
  return chromeCandidates(opts).find((c) => existsSync(c.path))?.path || null;
}

export function chromeVersion(exe) {
  const r = spawnSync(exe, ['--version'], { encoding: 'utf8', timeout: 10_000 });
  return /(\d+\.\d+\.\d+\.\d+)/.exec(r.stdout || '')?.[1] || null;
}

export const NO_CHROME = 'no Chrome found — install Google Chrome (or Chromium / Edge), or set OM_CHROME to a browser executable';
