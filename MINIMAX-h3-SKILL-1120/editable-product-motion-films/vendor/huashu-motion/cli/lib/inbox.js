// The comment inbox: the bridge between "point at the frame" in the studio and the agent in a terminal.
// .om/inbox.jsonl is an append-only event log; the current state of each comment is a fold over it.
// Any agent that can run a shell command can take part: `om inbox --wait` blocks until there is work.
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OmError } from './project.js';

const file = (project) => join(project.om, 'inbox.jsonl');

function append(project, event) {
  mkdirSync(project.om, { recursive: true });
  writeFileSync(file(project), JSON.stringify({ ...event, at: new Date().toISOString() }) + '\n', { flag: 'a' });
}

export function comments(project) {
  if (!existsSync(file(project))) return [];
  const byId = new Map();
  for (const line of readFileSync(file(project), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; } // a torn last line must not break the inbox
    if (e.type === 'comment') byId.set(e.id, { ...e, type: undefined, status: 'pending', created: e.at, thread: [] });
    const c = byId.get(e.id);
    if (!c) continue;
    if (e.type === 'claim') Object.assign(c, { status: 'working', claimed: e.at, agent: e.agent });
    if (e.type === 'done') { Object.assign(c, { status: 'done', done: e.at, note: e.note }); c.thread.push({ who: 'agent', text: e.note || '', at: e.at }); }
    if (e.type === 'reopen') { Object.assign(c, { status: 'pending', note: null }); c.thread.push({ who: 'user', text: e.note || '', at: e.at }); }
    if (e.type === 'cancel') Object.assign(c, { status: 'cancelled' });
  }
  return [...byId.values()];
}

export function addComment(project, input) {
  const text = String(input.text ?? '').trim();
  if (!text) throw new OmError('comment text is empty');
  const num = (v) => (v == null || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null);
  const comment = {
    type: 'comment',
    id: 'c' + randomBytes(3).toString('hex'),
    text,
    t: num(input.t),                     // seconds into the film
    x: num(input.x), y: num(input.y),    // composition pixels
    target: input.target ? String(input.target) : null,   // data-om-id under the pointer
    scene: input.scene ? String(input.scene) : null,
    element: input.element ? String(input.element).slice(0, 600) : null, // outerHTML excerpt
    variables: input.variables && typeof input.variables === 'object' ? input.variables : null,
  };
  append(project, comment);
  return comments(project).find((c) => c.id === comment.id);
}

export function claim(project, id, agent = 'agent') {
  const c = comments(project).find((x) => x.id === id);
  if (!c) throw new OmError(`no comment ${id}`, 404);
  append(project, { type: 'claim', id, agent });
  return { ...c, status: 'working' };
}

export function resolve(project, id, note = '') {
  const c = comments(project).find((x) => x.id === id);
  if (!c) throw new OmError(`no comment ${id}`, 404);
  append(project, { type: 'done', id, note: String(note) });
  return { ...c, status: 'done', note };
}

export function setStatus(project, id, type, note = '') {
  if (!['reopen', 'cancel'].includes(type)) throw new OmError(`bad status ${type}`);
  if (!comments(project).some((x) => x.id === id)) throw new OmError(`no comment ${id}`, 404);
  append(project, { type, id, note });
}

export const pending = (project) => comments(project).filter((c) => c.status === 'pending');
