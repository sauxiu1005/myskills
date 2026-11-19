// Fontless distribution: pinned, hash-verified downloads into a writable external cache.
import { existsSync, readFileSync, mkdirSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { OmError } from './project.js';
const LIB = resolve(dirname(fileURLToPath(import.meta.url)), '../../fonts');
export const fontManifest = JSON.parse(readFileSync(join(LIB, 'downloads.json'), 'utf8'));
export function cacheRoot() {
  return resolve(process.env.OM_FONT_CACHE_DIR || join(process.env.XDG_CACHE_HOME || join(homedir(), '.cache'), 'editable-product-motion-films', 'fonts', fontManifest.commit));
}
function valid(data, spec) {
  return data.length === spec.bytes && createHash('sha256').update(data).digest('hex') === spec.sha256;
}
function verified(path, spec) {
  try { return valid(readFileSync(path), spec); } catch (e) { if (e.code === 'ENOENT') return false; throw e; }
}
export async function ensureFonts(names) {
  const unique = [...new Set(names)];
  for (const name of unique) if (!Object.hasOwn(fontManifest.files, name)) throw new OmError(`Unknown pinned font: ${name}`);
  const result = {};
  // Resolve everything before callers create or modify a project.
  for (const name of unique) {
    const spec = fontManifest.files[name];
    const cached = join(cacheRoot(), name);
    if (verified(cached, spec)) { result[name] = cached; continue; }
    if (process.env.OM_FONT_OFFLINE === '1') throw new OmError(`Font unavailable or corrupt: ${name}. Offline mode is enabled. Run om fonts fetch online first, or populate OM_FONT_CACHE_DIR with the exact fonts listed in fonts/downloads.json.`);
    mkdirSync(dirname(cached), { recursive: true });
    let last;
    for (let attempt = 0; attempt < 3; attempt++) {
      const temp = `${cached}.${randomUUID()}.part`;
      try {
        console.error(`[fonts] Fetching ${name} (${attempt + 1}/3)`);
        const response = await fetch(fontManifest.baseUrl + encodeURIComponent(name), { signal: AbortSignal.timeout(45000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const chunks = []; let bytes = 0;
        for await (const chunk of response.body) {
          bytes += chunk.length;
          if (bytes > spec.bytes) throw new Error('Response exceeds expected font size');
          chunks.push(chunk);
        }
        const data = Buffer.concat(chunks);
        if (!valid(data, spec)) throw new Error('Font size or SHA-256 mismatch');
        writeFileSync(temp, data, { flag: 'wx' });
        renameSync(temp, cached);
        result[name] = cached;
        break;
      } catch (e) {
        last = e;
        if (attempt < 2) await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      } finally { rmSync(temp, { force: true }); }
    }
    if (!result[name]) throw new OmError(`Cannot obtain font ${name}: ${last?.message}. Check network access to raw.githubusercontent.com and retry; existing verified cache files are reused. You can also populate OM_FONT_CACHE_DIR with the exact files in fonts/downloads.json. No system-font substitution was made.`);
  }
  return result;
}
