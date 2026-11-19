// The bundled font library (all SIL OFL 1.1). Typography carries most of a film's polish, so the
// agent should reach for a real typeface instead of the system default.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OmError, readSource, writeSource } from './project.js';

const LIB = resolve(fileURLToPath(import.meta.url), '../../../fonts');
export const library = () => JSON.parse(readFileSync(join(LIB, 'index.json'), 'utf8'));

export function families() {
  const map = new Map();
  for (const f of library()) {
    if (!map.has(f.family)) map.set(f.family, { family: f.family, note: f.note || '', faces: [] });
    map.get(f.family).faces.push(`${f.weight.replace(' ', '–')}${f.style === 'italic' ? 'i' : ''}`);
  }
  return [...map.values()];
}

// Copy a family into <project>/assets/fonts and declare it in one managed <style id="om-fonts"> block.
export function addFamily(project, name) {
  const faces = library().filter((f) => f.family.toLowerCase() === name.toLowerCase());
  if (!faces.length) throw new OmError(`no font "${name}" — run \`om fonts\` to list them`);
  const dir = join(project.root, 'assets', 'fonts');
  mkdirSync(dir, { recursive: true });
  for (const f of faces) copyFileSync(join(LIB, f.file), join(dir, f.file));
  for (const extra of ['OFL.txt', 'LICENSES.md']) if (!existsSync(join(dir, extra))) copyFileSync(join(LIB, extra), join(dir, extra));
  const { html, token } = readSource(project);
  const block = /<style id="om-fonts">([\s\S]*?)<\/style>/.exec(html);
  const rules = new Map();
  for (const m of (block?.[1] ?? '').matchAll(/@font-face\s*{[^}]*src:\s*url\("assets\/fonts\/([^"]+)"\)[^}]*}/g)) rules.set(m[1], m[0]);
  for (const f of faces) rules.set(f.file, `@font-face { font-family: "${f.family}"; src: url("assets/fonts/${f.file}") format("woff"); font-weight: ${f.weight}; font-style: ${f.style}; }`);
  const css = `<style id="om-fonts">\n${[...rules.values()].join('\n')}\n</style>`;
  let next;
  if (block) next = html.replace(block[0], css);
  else if (/<\/head>/i.test(html)) next = html.replace(/<\/head>/i, (m) => `${css}\n${m}`);
  else throw new OmError('index.html has no <head>');
  if (next !== html) writeSource(project, next, token, `font ${faces[0].family}`);
  return { family: faces[0].family, faces: faces.map((f) => `${f.weight}${f.style === 'italic' ? ' italic' : ''}`) };
}
