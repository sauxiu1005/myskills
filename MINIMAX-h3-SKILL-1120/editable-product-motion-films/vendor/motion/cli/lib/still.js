// om still — a frame of any HTML page as a PNG: the direction key frames and treatment stills that come
// before (or beside) the project's index.html. With --at, the page's first timeline is sought to that time.
// Same capture path as om render, so a still is what the render will show.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { capture } from './capture.js';
import { OmError } from './project.js';

export async function still(input, { at = null, out = null } = {}) {
  let file = resolve(input || '.');
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) throw new OmError(`no such page: ${file}`);
  const html = readFileSync(file, 'utf8');
  const root = /data-composition-id[^>]*>/i.exec(html)?.[0] || '';
  const w = Number(/data-width\s*=\s*["']?(\d+)/i.exec(root)?.[1] || /data-width\s*=\s*["']?(\d+)/i.exec(html)?.[1] || 1920);
  const h = Number(/data-height\s*=\s*["']?(\d+)/i.exec(root)?.[1] || /data-height\s*=\s*["']?(\d+)/i.exec(html)?.[1] || 1080);
  const times = at == null || at === true ? [null] : String(at).split(',').map(Number);
  const name = basename(file).replace(/\.html?$/i, '');
  let shots;
  try { ({ shots } = await capture(file, { times, size: [w, h], lenient: true })); }
  catch (e) { throw e instanceof OmError ? e : new OmError(`screenshot failed: ${e.message}`); }
  const outs = shots.map(({ t, png }) => {
    const target = resolve(out && times.length === 1 ? out : join(out || dirname(file), `${name}${t == null ? '' : `-${t.toFixed(2)}s`}.png`));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, png);
    return target;
  });
  return `still    ${outs.join('\n         ')}\n         ${w}×${h} — open them and look before showing anyone`;
}
