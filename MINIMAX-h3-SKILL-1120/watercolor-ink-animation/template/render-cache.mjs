import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const CACHE_VERSION = 1;
const FRAME_FILE = /^f\d{5,}\.jpg(?:\.tmp)?$/;

function projectFiles(rootDir) {
  const files = [];
  const visit = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (dir === rootDir && (entry.name === 'out' || entry.name === 'node_modules' || entry.name === '.git')) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.push(path);
    }
  };
  visit(rootDir);
  return files;
}

function fingerprint(rootDir, { fps, loop }) {
  const hash = createHash('sha256');
  hash.update(JSON.stringify({ cacheVersion: CACHE_VERSION, fps, loop }));
  for (const path of projectFiles(rootDir)) {
    hash.update(relative(rootDir, path).split(sep).join('/'));
    hash.update('\0');
    hash.update(readFileSync(path));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function readCache(path) {
  try {
    const cache = JSON.parse(readFileSync(path, 'utf8'));
    return cache.version === CACHE_VERSION && typeof cache.fingerprint === 'string' ? cache : null;
  } catch {
    return null;
  }
}

export function isFrameCacheCurrent(rootDir, options) {
  const cachePath = resolve(rootDir, 'out/frames/.render-cache.json');
  const cache = readCache(cachePath);
  return Boolean(cache && cache.fingerprint === fingerprint(resolve(rootDir), options));
}

export function prepareFrameCache(rootDir, options, log = console.log) {
  rootDir = resolve(rootDir);
  const frameDir = join(rootDir, 'out/frames');
  const cachePath = join(frameDir, '.render-cache.json');
  mkdirSync(frameDir, { recursive: true });
  const next = { version: CACHE_VERSION, fingerprint: fingerprint(rootDir, options) };
  const previous = readCache(cachePath);
  const matches = previous?.fingerprint === next.fingerprint;

  if (!matches) {
    const frames = readdirSync(frameDir).filter(name => FRAME_FILE.test(name));
    if (frames.length) {
      log(previous ? 'render inputs changed; discarding cached frames' : 'existing frames have no valid cache manifest; discarding cached frames');
      for (const name of frames) unlinkSync(join(frameDir, name));
    }
    const temporary = `${cachePath}.tmp`;
    writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`);
    renameSync(temporary, cachePath);
  }

  return { fingerprint: next.fingerprint, reused: matches };
}
