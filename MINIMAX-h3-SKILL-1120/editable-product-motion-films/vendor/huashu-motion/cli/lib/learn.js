// om learn — how the skill gets better with every film. Two layers of experience:
//   shipped  skills/huashu-motion/references/experience.md — general findings, reproduced or measured,
//            shipped to everyone with the package (edited in the repository, not by this command);
//   local    ~/.huashu-motion/experience.md (OM_HOME to move it) — this machine's user: their words,
//            their taste, and single-film observations that are not proven yet. Never shipped.
// `om learn [topics…]` reads both before a film, `om learn harvest <dir>` gathers what a finished project
// can teach, `om learn add` writes one entry and refuses one without a kind, topics and evidence.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OmError, listHistory } from './project.js';
import { comments } from './inbox.js';

export const KINDS = {
  preference: 'the user said it — quote their words; it holds for this user until they say otherwise',
  observed: 'seen once, in one film — a lead, not a rule',
  verified: 'reproduced in two or more films, or measured — the shipped experience.md is where general ones end up',
  superseded: 'no longer true — keep the entry and say what replaced it',
};
const SHIPPED = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'skills', 'huashu-motion', 'references', 'experience.md');
export const localFile = () => join(process.env.OM_HOME || join(homedir(), '.huashu-motion'), 'experience.md');
const HEAD = `# Local experience\n\nWhat this machine's films taught. Written by \`om learn add\` (or edited by hand: fix an entry in place\nwhen it turns out wrong, set its kind to superseded and say why). Not shipped with the package.\n`;

// entries of a markdown file: each "## …" heading and its body
function entries(file, layer) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split(/\n(?=## )/).filter((b) => b.startsWith('## ')).map((b) => {
    const head = b.split('\n')[0].slice(3).trim();
    const kind = /·\s*(preference|observed|verified|superseded)\s*·/.exec(head)?.[1] || (layer === 'shipped' ? 'shipped' : 'observed');
    const tags = (/topics?:\s*([^\n·]+)/i.exec(head)?.[1] || '').split(/[,\s]+/).filter(Boolean);
    return { layer, head, kind, tags, body: b.trim(), id: /^(L\d+)/.exec(head)?.[1] || null };
  });
}

// before a film: every preference of this user, then the entries that match the topics (all of them when none given)
export function recall(topics = []) {
  const want = topics.map((t) => t.toLowerCase());
  const match = (e) => !want.length || want.some((t) => e.tags.includes(t) || e.body.toLowerCase().includes(t));
  const local = entries(localFile(), 'local'), shipped = entries(SHIPPED, 'shipped');
  const prefs = local.filter((e) => e.kind === 'preference');
  const rest = [...local.filter((e) => e.kind !== 'preference' && e.kind !== 'superseded' && match(e)), ...shipped.filter(match)];
  const out = [];
  out.push(prefs.length ? `## This user's preferences (${prefs.length}) — their words; they hold until the user says otherwise\n\n${prefs.map((e) => e.body).join('\n\n')}` : `## This user's preferences: none recorded yet (${localFile()})`);
  out.push(rest.length ? `## Experience${want.length ? ` on ${want.join(', ')}` : ''} (${rest.length}) — what past films found; the actual film wins when they disagree, then fix the entry\n\n${rest.map((e) => `${e.layer === 'local' ? '[local] ' : ''}${e.body}`).join('\n\n')}` : `## Experience${want.length ? ` on ${want.join(', ')}` : ''}: nothing matches`);
  return out.join('\n\n');
}

// one entry, appended to the local file
export function addEntry({ kind, topics, text, todo, evidence, project = null }) {
  if (!KINDS[kind]) throw new OmError(`om learn add needs --kind ${Object.keys(KINDS).join('|')}\n${Object.entries(KINDS).map(([k, v]) => `  ${k.padEnd(11)} ${v}`).join('\n')}`);
  const tags = String(topics || '').split(/[,\s]+/).filter(Boolean);
  if (!tags.length) throw new OmError('om learn add needs --topics (e.g. rhythm,sound,launch) so the entry is found again');
  if (!String(text || '').trim()) throw new OmError('om learn add needs the finding as text: om learn add "…" --kind … --topics … --evidence …');
  if (!String(evidence || '').trim()) throw new OmError('om learn add needs --evidence: the quote, the project and file, the measurement — an entry nobody can check is a rumour');
  if (kind === 'preference' && !/[「“"]/.test(text)) throw new OmError('a preference quotes the user: put their words in 「…」 or "…"');
  const f = localFile();
  mkdirSync(dirname(f), { recursive: true });
  const prev = existsSync(f) ? readFileSync(f, 'utf8') : HEAD;
  const n = 1 + Math.max(0, ...entries(f, 'local').map((e) => Number(e.id?.slice(1)) || 0));
  const date = new Date().toISOString().slice(0, 10);
  const block = [`## L${n} · ${date} · ${kind} · topics: ${tags.join(', ')}`, '', `- ${kind === 'preference' ? 'Said' : 'Finding'}: ${text.trim()}`];
  if (todo) block.push(`- Do: ${String(todo).trim()}`);
  block.push(`- Evidence: ${String(evidence).trim()}${project ? ` (${project})` : ''}`);
  writeFileSync(f, prev.replace(/\s*$/, '\n\n') + block.join('\n') + '\n');
  return `learned  L${n} → ${f}`;
}

// after a film: what the project itself recorded, and the questions that decide what is worth keeping
export function harvest(project) {
  const cs = comments(project);
  const hist = listHistory(project);
  const logf = join(project.om, 'history.jsonl');
  const log = existsSync(logf) ? readFileSync(logf, 'utf8').split('\n').flatMap((l) => { try { return [JSON.parse(l)]; } catch { return []; } }) : [];
  const renders = existsSync(join(project.om, 'renders.jsonl')) ? readFileSync(join(project.om, 'renders.jsonl'), 'utf8').split('\n').filter(Boolean).length : 0;
  const lines = [`harvest  ${project.root}`, `         ${hist.length} saved versions · ${renders} renders · ${cs.length} studio comments`];
  if (cs.length) {
    lines.push('', 'Studio comments (the user pointing at the frame — the most direct evidence of taste):');
    for (const c of cs) lines.push(`  ${c.t != null ? `${c.t.toFixed(1)}s ` : ''}${c.target ? `[${c.target}] ` : ''}${c.scene ? `(${c.scene}) ` : ''}「${c.text}」 → ${c.status}${c.note ? `: ${c.note}` : ''}${c.thread?.filter((x) => x.who === 'user').map((x) => ` · reopened: 「${x.text}」`).join('') || ''}`);
  }
  const labels = log.map((h) => h.label).filter((l) => l && !/^(before |om sound$)/.test(l));
  if (labels.length) lines.push('', `Edits: ${[...new Set(labels)].slice(-12).join(' · ')}`);
  lines.push('', 'Also take what the user said in the conversation — quote it.', '',
    'Keep an entry only when all three hold: it is not obvious, it saves time or a wrong turn next film, and this',
    'film produced evidence for it. Then, in this order:',
    '  1. Does an existing entry say otherwise? Fix that entry first (om learn shows them; edit the file).',
    '  2. Can a tool catch it (a check in om qa / om sound / om render)? Change the tool and its test instead of writing it down.',
    '  3. Otherwise: om learn add "…" --kind preference|observed --topics … --evidence "…" [--do "…"].',
    '     The user\'s words are a preference; your own observation from one film is observed.',
    '  4. Seen in two films, or measured, and true for anyone (not this user\'s taste)? On the development machine,',
    '     add it to the shipped references/experience.md, and the stable part of it to the reference it belongs to.',
    `Local experience: ${localFile()}`);
  return lines.join('\n');
}

export function learnStatus() {
  const f = localFile(), local = entries(f, 'local'), shipped = entries(SHIPPED, 'shipped');
  const by = (k) => local.filter((e) => e.kind === k).length;
  return `learn    local ${f}${existsSync(f) ? ` (${local.length} entries: ${by('preference')} preferences, ${by('observed')} observed, ${by('verified')} verified, ${by('superseded')} superseded; ${statSync(f).size} bytes)` : ' (none yet)'}\n         shipped ${shipped.length} entries in references/experience.md\n         om learn [topics…] · om learn harvest <dir> · om learn add "…" --kind … --topics … --evidence …`;
}
