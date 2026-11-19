// A project is a folder whose index.html is a composition (docs/CONTRACT.md) — the only source of truth.
// Everything huashu-motion keeps on the side (history, inbox) lives in .om/ and can be deleted safely.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export class OmError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

export const sha = (data) => createHash('sha256').update(data).digest('hex');

export function openProject(dir = '.') {
  const root = resolve(dir);
  const index = join(root, 'index.html');
  if (!existsSync(index)) throw new OmError(`no index.html in ${root} — run \`om new <name>\` first`, 404);
  return { root, index, om: join(root, '.om') };
}

export function readSource(project) {
  const html = readFileSync(project.index, 'utf8');
  return { html, token: sha(html) };
}

// Atomic write guarded by the token the caller read. A mismatch means someone else (the agent, the
// user in another tab) saved in between; we refuse instead of silently overwriting their work.
export function writeSource(project, html, baseToken, label) {
  const current = readFileSync(project.index, 'utf8');
  if (baseToken && sha(current) !== baseToken) throw new OmError('index.html changed since you read it — reload and retry', 409);
  snapshot(project, current, 'before ' + label);
  const tmp = project.index + '.om-tmp';
  writeFileSync(tmp, html);
  renameSync(tmp, project.index);
  snapshot(project, html, label); // so the history log says who made this version
  return sha(html);
}

// ---------- history ----------
// Every write keeps the previous source as .om/history/NNNNNN.html plus one log line, so undo is
// always "go back one save" no matter who saved (studio, `om set`, or the agent via `om save`).
function historyDir(project) {
  const dir = join(project.om, 'history');
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function listHistory(project) {
  const dir = join(project.om, 'history');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => /^\d{6}\.html$/.test(n)).sort();
}

export function snapshot(project, html, label = 'edit') {
  const dir = historyDir(project);
  const names = listHistory(project);
  const last = names.at(-1);
  if (last && sha(readFileSync(join(dir, last))) === sha(html)) return last; // nothing new to keep
  const name = String(names.length ? Number(last.slice(0, 6)) + 1 : 1).padStart(6, '0') + '.html';
  writeFileSync(join(dir, name), html);
  const entry = { at: new Date().toISOString(), snapshot: name, label, token: sha(html) };
  writeFileSync(join(project.om, 'history.jsonl'), JSON.stringify(entry) + '\n', { flag: 'a' });
  return name;
}

export function undo(project) {
  const names = listHistory(project);
  const { html, token } = readSource(project);
  // Walk back past snapshots identical to the current file (e.g. the agent saved the same content).
  for (let i = names.length - 1; i >= 0; i--) {
    const previous = readFileSync(join(historyDir(project), names[i]), 'utf8');
    if (sha(previous) === token) continue;
    const moved = join(project.om, 'undone');
    mkdirSync(moved, { recursive: true });
    writeFileSync(join(moved, `${Date.now()}.html`), html); // the undone version is kept, never lost
    const tmp = project.index + '.om-tmp';
    writeFileSync(tmp, previous);
    renameSync(tmp, project.index);
    for (const n of names.slice(i)) renameSync(join(historyDir(project), n), join(moved, `${Date.now()}-${n}`));
    return { restored: names[i], token: sha(previous) };
  }
  throw new OmError('nothing to undo', 409);
}

// ---------- variables ----------
// Editable values are composition variables declared on <html data-composition-variables='[…]'>.
// We rewrite only the `default` fields inside that one attribute and leave every other byte untouched.
const HTML_TAG = /<html\b(?:[^>"']|"[^"]*"|'[^']*')*>/i;
const VAR_ATTR = /\sdata-composition-variables\s*=\s*('([^']*)'|"([^"]*)")/i;

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const encode = (s, quote) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(quote === "'" ? /'/g : /"/g, quote === "'" ? '&#39;' : '&quot;');

function locateVariables(html) {
  const tag = HTML_TAG.exec(html);
  if (!tag) return null;
  const attr = VAR_ATTR.exec(tag[0]);
  if (!attr) return { tag, attr: null, list: [] };
  const raw = attr[2] ?? attr[3];
  let list;
  try { list = JSON.parse(decode(raw)); } catch (e) { throw new OmError(`data-composition-variables is not valid JSON: ${e.message}`); }
  if (!Array.isArray(list)) throw new OmError('data-composition-variables must be an array');
  return { tag, attr, list, quote: attr[2] !== undefined ? "'" : '"' };
}

export function readVariables(html) {
  return locateVariables(html)?.list ?? [];
}

export function coerce(decl, value) {
  switch (decl.type) {
    case 'number': {
      const n = typeof value === 'number' ? value : Number(String(value).trim());
      if (!Number.isFinite(n)) throw new OmError(`${decl.id}: "${value}" is not a number`);
      if (decl.min != null && n < decl.min) throw new OmError(`${decl.id}: ${n} is below min ${decl.min}`);
      if (decl.max != null && n > decl.max) throw new OmError(`${decl.id}: ${n} is above max ${decl.max}`);
      return n;
    }
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (value === 'true' || value === 'false') return value === 'true';
      throw new OmError(`${decl.id}: expected true or false`);
    case 'color':
      if (!/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(String(value))) throw new OmError(`${decl.id}: expected a hex color like #d9480f`);
      return String(value);
    case 'enum':
      if (!(decl.options || []).some((o) => o.value === value)) throw new OmError(`${decl.id}: "${value}" is not one of ${(decl.options || []).map((o) => o.value).join(', ')}`);
      return value;
    default:
      return String(value);
  }
}

// Decode the attribute's HTML entities while remembering where each decoded char came from, so a
// value can be replaced in the raw attribute without touching any other byte (formatting, key order).
function decodeWithMap(raw) {
  let text = '';
  const map = [];
  const entity = /^&(quot|#39|apos|lt|gt|amp|#\d+|#x[0-9a-f]+);/i;
  for (let i = 0; i < raw.length;) {
    const m = raw[i] === '&' ? entity.exec(raw.slice(i, i + 12)) : null;
    if (m) {
      const e = m[1].toLowerCase();
      const ch = { quot: '"', '#39': "'", apos: "'", lt: '<', gt: '>', amp: '&' }[e] ?? String.fromCodePoint(e.startsWith('#x') ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
      map.push(i); text += ch; i += m[0].length;
    } else { map.push(i); text += raw[i]; i += 1; }
  }
  map.push(raw.length);
  return { text, map };
}

// Spans of each top-level object and of its "id" and "default" values inside the JSON text.
function objectSpans(text) {
  let i = 0;
  const ws = () => { while (/\s/.test(text[i])) i++; };
  const string = () => { const s = i; i++; while (text[i] !== '"') i += text[i] === '\\' ? 2 : 1; i++; return JSON.parse(text.slice(s, i)); };
  const value = () => {
    ws();
    const c = text[i];
    if (c === '"') return string();
    if (c === '{' || c === '[') {
      const close = c === '{' ? '}' : ']'; i++; ws();
      while (text[i] !== close) { if (c === '{') { ws(); string(); ws(); i++; } value(); ws(); if (text[i] === ',') i++; ws(); }
      i++; return null;
    }
    while (i < text.length && !/[\s,\]}]/.test(text[i])) i++;
    return null;
  };
  const out = [];
  ws(); i++; // [
  for (ws(); text[i] !== ']'; ws()) {
    const obj = { start: i }; i++;
    for (ws(); text[i] !== '}'; ws()) {
      const key = string(); ws(); i++; ws();
      const vs = i, v = value(); const ve = i;
      if (key === 'id') obj.id = v;
      if (key === 'default') obj.def = [vs, ve];
      ws(); if (text[i] === ',') i++;
    }
    obj.close = i; i++; out.push(obj);
    ws(); if (text[i] === ',') i++;
  }
  return out;
}

export function setVariables(html, values) {
  const found = locateVariables(html);
  if (!found || !found.attr) throw new OmError('this composition declares no variables (data-composition-variables on <html>)');
  const coerced = {};
  for (const [id, value] of Object.entries(values)) {
    const decl = found.list.find((d) => d.id === id);
    if (!decl) throw new OmError(`unknown variable "${id}" — known: ${found.list.map((d) => d.id).join(', ')}`);
    coerced[id] = coerce(decl, value);
  }
  const raw = found.attr[2] ?? found.attr[3];
  const { text, map } = decodeWithMap(raw);
  const edits = [];
  for (const o of objectSpans(text)) {
    if (!(o.id in coerced)) continue;
    const json = encode(JSON.stringify(coerced[o.id]), found.quote);
    if (o.def) edits.push([map[o.def[0]], map[o.def[1]], json]);
    else edits.push([map[o.close], map[o.close], `,${encode('"default":', found.quote)}${json}`]);
  }
  let next = raw;
  for (const [a, b, rep] of edits.sort((x, y) => y[0] - x[0])) next = next.slice(0, a) + rep + next.slice(b);
  const attrStart = found.tag.index + found.attr.index + found.attr[0].indexOf(raw, found.attr[0].indexOf('=') + 1);
  let out = html.slice(0, attrStart) + next + html.slice(attrStart + raw.length);
  // Keep the authored fallback text of plain data-var-text elements in step, so the source reads true.
  for (const [id, v] of Object.entries(coerced)) {
    if (typeof v !== 'string') continue;
    const re = new RegExp(`(<([a-z][\\w-]*)\\b[^>]*\\sdata-var-text\\s*=\\s*["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>)([^<]*)(</\\2>)`, 'gi');
    out = out.replace(re, (_, open, tag, _old, close) => open + v.replace(/&/g, '&amp;').replace(/</g, '&lt;') + close);
  }
  return out;
}

// ---------- scan ----------
// A cheap static map of the source for agents: variables, addressable objects and their line numbers,
// scene labels. The studio gets the live version (actual times) from the running composition.
export function scan(html) {
  const lines = html.split('\n');
  const lineOf = (index) => html.slice(0, index).split('\n').length;
  const objects = [];
  for (const m of html.matchAll(/data-om-id\s*=\s*["']([^"']+)["']/g)) objects.push({ id: m[1], line: lineOf(m.index) });
  for (const m of html.matchAll(/OM\.region\(\s*["']([^"']+)["']/g)) objects.push({ id: m[1], line: lineOf(m.index), canvas: true });
  const scenes = [];
  for (const m of html.matchAll(/addLabel\(\s*["']scene:([^"']+)["']/g)) scenes.push({ id: m[1], line: lineOf(m.index) });
  const root = /data-composition-id\s*=\s*["']([^"']+)["'][^>]*/.exec(html);
  const attr = (name) => root && new RegExp(`data-${name}\\s*=\\s*["']([^"']+)["']`).exec(root[0])?.[1];
  return {
    composition: root?.[1] ?? null,
    width: Number(attr('width')) || null,
    height: Number(attr('height')) || null,
    duration: Number(attr('duration')) || null,
    variables: readVariables(html).map(({ id, type, label, default: value }) => ({ id, type, label, value })),
    objects,
    scenes,
    lines: lines.length,
  };
}
