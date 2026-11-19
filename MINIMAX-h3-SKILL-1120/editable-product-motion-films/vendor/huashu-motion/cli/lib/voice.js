// om voice — narration for a composition. Synthesize a script (or take a recording), time every word,
// and wire both into index.html: <audio id="om-voice"> for the mixer, <script id="om-cues"> for OM.cue.
// Timing is honest about where it comes from (`precision` in the cues): TTS sentences are measured
// exactly and words are interpolated inside the detected speech; recordings use whisper's per-token
// times when the model is present, otherwise silence gaps — never a fake "word-accurate" claim.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { OmError, readSource, sha, writeSource } from './project.js';
import { fileURLToPath } from 'node:url';
import { nextOutput } from './render.js';

const r3 = (x) => Math.round(x * 1000) / 1000;
const sum = (xs) => xs.reduce((n, x) => n + x, 0);
const HAN = /\p{Script=Han}/u;
const SPEECH_CHAR = /[\p{L}\p{N}]/u;

// ---------- text ----------

const ENDERS = '。！？；!?;';
const CLAUSE = /^[，、,：:；;—…]+$/;
const CLOSERS = '”’」』）)】"\'';

// Sentences end at 。！？；!?; or a newline (English "." too, when a space or the end follows).
export function splitSentences(text) {
  const out = [];
  let buf = '';
  const chars = [...String(text)];
  const push = () => { const s = buf.trim(); if ([...s].some((c) => SPEECH_CHAR.test(c))) out.push(s); buf = ''; };
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === '\n' || c === '\r') { push(); continue; }
    buf += c;
    const dot = c === '.' && /[A-Za-z)]/.test(chars[i - 1] || '') && (i + 1 >= chars.length || /\s/.test(chars[i + 1]));
    if (ENDERS.includes(c) || dot) {
      while (i + 1 < chars.length && (ENDERS.includes(chars[i + 1]) || CLOSERS.includes(chars[i + 1]))) buf += chars[++i];
      push();
    }
  }
  push();
  return out;
}

const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });
const LATIN = /[A-Za-z0-9](?:[A-Za-z0-9.'’+_-]*[A-Za-z0-9%+])?%?/g;

// Tokens of one sentence: words (Chinese by Intl.Segmenter, Latin/number runs kept whole, `keep`
// terms never split) and the punctuation/space between them.
export function tokenize(sentence, keep = []) {
  const terms = [...new Set(keep.filter(Boolean))].sort((a, b) => b.length - a.length);
  const tokens = [];
  const free = (s) => {
    let last = 0;
    for (const m of s.matchAll(LATIN)) {
      chinese(s.slice(last, m.index));
      tokens.push({ text: m[0], word: true });
      last = m.index + m[0].length;
    }
    chinese(s.slice(last));
  };
  const chinese = (s) => {
    for (const seg of segmenter.segment(s)) {
      const word = seg.isWordLike ?? [...seg.segment].some((c) => SPEECH_CHAR.test(c));
      tokens.push({ text: seg.segment, word: !!word });
    }
  };
  let i = 0, last = 0;
  outer: while (i < sentence.length) {
    for (const t of terms) {
      if (sentence.startsWith(t, i)) {
        free(sentence.slice(last, i));
        tokens.push({ text: t, word: true });
        i += t.length; last = i;
        continue outer;
      }
    }
    i++;
  }
  free(sentence.slice(last));
  return tokens.filter((t) => t.text.length);
}

// How long a token takes to say, in "Chinese syllables": one per Han character or digit, vowel groups
// for Latin words; punctuation gets a sliver (real pauses are measured from the audio instead).
export function weight(token) {
  if (!token.word) return /^\s*$/.test(token.text) ? 0 : 0.1;
  let w = 0;
  for (const part of token.text.match(/[A-Za-z]+|[0-9]|[^A-Za-z0-9]/gu) || []) {
    if (/^[A-Za-z]+$/.test(part)) w += Math.max(1, (part.match(/[aeiouy]+/gi) || []).length);
    else if (/[0-9]/.test(part) || SPEECH_CHAR.test(part)) w += 1;
  }
  return Math.max(w, 0.5);
}

// ---------- timing ----------

// Speech spans [[start, end], …] in real seconds. "Speech time" is the same audio with the silences
// cut out; words are spread over speech time so a pause never swallows part of a word.
function speechClock(spans) {
  const total = sum(spans.map(([s, e]) => e - s));
  const at = (x, edge) => {
    let acc = 0;
    for (let i = 0; i < spans.length; i++) {
      const [s, e] = spans[i], len = e - s;
      const inside = edge === 'end' ? x <= acc + len + 1e-9 : x < acc + len - 1e-9;
      if (inside || i === spans.length - 1) return s + Math.min(Math.max(x - acc, 0), len);
      acc += len;
    }
    return 0;
  };
  return { total, at };
}

// Give every token a start/end inside the spans, proportional to its weight. Returns the tokens with
// times attached to the words.
export function placeWords(tokens, spans) {
  if (!spans.length) throw new OmError('no speech found to place words in');
  const { total, at } = speechClock(spans);
  // punctuation before the first / after the last word is the pause itself, already cut from spans
  const first = tokens.findIndex((t) => t.word), last = tokens.findLastIndex((t) => t.word);
  const w = tokens.map((t, i) => (i < first || i > last ? 0 : weight(t)));
  const W = sum(w) || 1;
  let cw = 0;
  return tokens.map((t, i) => {
    const a = (total * cw) / W;
    cw += w[i];
    const b = (total * cw) / W;
    return t.word ? { ...t, start: r3(at(a, 'start')), end: r3(at(b, 'end')) } : { ...t };
  });
}

// Split tokens at clause punctuation (，、：；…); punctuation stays with the clause it ends, and a
// clause without words joins its neighbour.
export function clausesOf(tokens) {
  const out = [[]];
  for (const t of tokens) {
    out.at(-1).push(t);
    if (!t.word && CLAUSE.test(t.text.trim())) out.push([]);
  }
  const merged = [];
  for (const c of out) {
    if (c.some((t) => t.word) || !merged.length) merged.push([...c]);
    else merged.at(-1).push(...c);
  }
  if (merged.length > 1 && !merged[0].some((t) => t.word)) merged[1].unshift(...merged.shift());
  return merged.filter((c) => c.length);
}

const speechLen = (text) => [...text].filter((c) => SPEECH_CHAR.test(c)).length;

// Lay clauses onto spans and spread words inside each; empty spans collapse onto the previous end.
function placeUnits(units, spans, start) {
  let lastEnd = start;
  return units.map((u, k) => {
    const own = spans[k] || [];
    const placed = placeWords(u, own.length ? own : [[lastEnd, lastEnd]]);
    if (own.length) lastEnd = own.at(-1)[1];
    return placed;
  });
}

// A sentence: first snap its clauses onto the pauses inside its speech, then spread words within each
// clause — so a word right after a comma starts when the voice resumes.
export function placeSentence(tokens, spans) {
  const units = clausesOf(tokens);
  if (units.length < 2 || spans.length < 2) return placeWords(tokens, spans);
  return placeUnits(units, sentenceSpans(units.map((c) => sum(c.map(weight))), spans), spans[0][0]).flat();
}

// A recording with per-character times from whisper (`times`, one per speech character of the
// script): whisper decides which pause each clause boundary belongs to, the pauses themselves give the
// exact edges, and words are spread inside. Whisper's own token times are too loose to use directly.
export function placeByAnchors(sentences, intervals, times) {
  const units = sentences.flatMap((s, si) => clausesOf(s.tokens).map((tokens) => ({ si, tokens })));
  let ci = 0;
  const first = units.map((u) => { const i = ci; ci += sum(u.tokens.filter((t) => t.word).map((t) => speechLen(t.text))); return i; });
  const at = first.slice(1).map((i) => times[i]?.start ?? null);
  const spans = sentenceSpans(units.map((u) => sum(u.tokens.map(weight))), intervals, at);
  const placed = placeUnits(units.map((u) => u.tokens), spans, intervals[0]?.[0] ?? 0);
  return sentences.map((s, si) => ({ text: s.text, tokens: placed.filter((_, k) => units[k].si === si).flat() }));
}

export const wordsOf = (sentences) => sentences.flatMap((s) => s.tokens.filter((t) => t.word).map((t) => ({ word: t.text, start: t.start, end: t.end })));

// ffmpeg silencedetect output → silences [[start, end], …]
export function parseSilences(stderr, duration) {
  const out = [];
  let open = null;
  for (const line of String(stderr).split('\n')) {
    const s = /silence_start:\s*(-?[\d.]+)/.exec(line);
    const e = /silence_end:\s*([\d.]+)/.exec(line);
    if (s) open = Math.max(0, Number(s[1]));
    if (e && open != null) { out.push([open, Number(e[1])]); open = null; }
  }
  if (open != null) out.push([open, duration]);
  return out;
}

// The complement of the silences inside [0, duration], dropping blips shorter than minSpeech.
export function speechIntervals(silences, duration, minSpeech = 0.04) {
  const out = [];
  let at = 0;
  for (const [s, e] of silences) {
    if (s - at >= minSpeech) out.push([r3(at), r3(s)]);
    at = Math.max(at, e);
  }
  if (duration - at >= minSpeech) out.push([r3(at), r3(duration)]);
  return out.length ? out : [[0, r3(duration)]];
}

// Real-time spans covering speech-time [x0, x1] of `intervals`.
function clipSpans(intervals, x0, x1) {
  const out = [];
  let acc = 0;
  for (const [s, e] of intervals) {
    const len = e - s, a = Math.max(x0 - acc, 0), b = Math.min(x1 - acc, len);
    if (b - a > 1e-6) out.push([s + a, s + b]);
    acc += len;
  }
  return out;
}

// Units (sentences or clauses) of a recording → their speech spans. Each boundary goes to the silence
// gap nearest its target (monotonic, least squares): the target is where the text weights put it, or
// — when `at` gives a real time for it (whisper heard the unit begin there) — that time. A gap farther
// than 0.4 s of speech from a whisper anchor is not trusted; the anchor itself is used.
export function sentenceSpans(weights, intervals, at = null) {
  const lens = intervals.map(([s, e]) => e - s);
  const S = sum(lens), W = sum(weights) || 1;
  const toSpeech = (t) => sum(intervals.map(([s, e]) => Math.max(0, Math.min(e, t) - s)));
  const targets = [], gaps = [];
  let acc = 0;
  for (let k = 0; k < weights.length - 1; k++) {
    acc += weights[k];
    targets.push(at?.[k] != null ? toSpeech(at[k]) : (S * acc) / W);
  }
  for (let k = 1; k < targets.length; k++) targets[k] = Math.max(targets[k], targets[k - 1]);
  acc = 0;
  for (let j = 0; j < lens.length - 1; j++) { acc += lens[j]; gaps.push(acc); }
  const pauses = intervals.slice(1).map(([s], j) => s - intervals[j][1]);
  let cuts = gaps.length >= targets.length ? bestCuts(targets, gaps, pauses) : targets;
  if (at) cuts = cuts.map((c, k) => (at[k] != null && Math.abs(c - targets[k]) > 0.4 ? targets[k] : c));
  for (let k = 1; k < cuts.length; k++) cuts[k] = Math.max(cuts[k], cuts[k - 1]);
  const bounds = [0, ...cuts, S];
  return weights.map((_, k) => clipSpans(intervals, bounds[k], bounds[k + 1]));
}

// Longer pauses are likelier boundaries, so the squared miss is divided by the pause length.
function bestCuts(targets, gaps, pauses) {
  const miss = (j, k) => (gaps[j] - targets[k]) ** 2 / (pauses[j] + 0.1);
  const K = targets.length, G = gaps.length;
  if (!K) return [];
  const cost = Array.from({ length: K }, () => new Float64Array(G).fill(Infinity));
  const from = Array.from({ length: K }, () => new Int32Array(G).fill(-1));
  for (let j = 0; j < G; j++) cost[0][j] = miss(j, 0);
  for (let k = 1; k < K; k++) {
    let best = Infinity, arg = -1;
    for (let j = 1; j < G; j++) {
      if (cost[k - 1][j - 1] < best) { best = cost[k - 1][j - 1]; arg = j - 1; }
      if (arg >= 0) { cost[k][j] = best + miss(j, k); from[k][j] = arg; }
    }
  }
  let j = 0;
  for (let i = 1; i < G; i++) if (cost[K - 1][i] < cost[K - 1][j]) j = i;
  const picked = [];
  for (let k = K - 1; k >= 0; k--) { picked.unshift(gaps[j]); j = from[k][j]; }
  return picked;
}

// Edit-distance alignment of two character arrays; returns, for each index of a, the matched index in
// b (-1 when that character was inserted or substituted — those get interpolated).
export function alignChars(a, b) {
  const n = a.length, m = b.length, W = m + 1;
  const dir = new Uint8Array((n + 1) * W); // 1 diag, 2 up (skip a), 3 left (skip b)
  let prev = new Uint32Array(W), cur = new Uint32Array(W);
  for (let j = 0; j <= m; j++) { prev[j] = j; dir[j] = 3; }
  for (let i = 1; i <= n; i++) {
    cur[0] = i; dir[i * W] = 2;
    for (let j = 1; j <= m; j++) {
      const same = a[i - 1].toLowerCase() === b[j - 1].toLowerCase();
      const d = prev[j - 1] + (same ? 0 : 1), u = prev[j] + 1, l = cur[j - 1] + 1;
      if (d <= u && d <= l) { cur[j] = d; dir[i * W + j] = same ? 1 : 4; }
      else if (u <= l) { cur[j] = u; dir[i * W + j] = 2; }
      else { cur[j] = l; dir[i * W + j] = 3; }
    }
    [prev, cur] = [cur, prev];
  }
  const match = new Array(n).fill(-1);
  for (let i = n, j = m; i > 0 || j > 0;) {
    const d = dir[i * W + j];
    if (d === 1) { match[i - 1] = j - 1; i--; j--; }
    else if (d === 4) { i--; j--; }
    else if (d === 2) i--;
    else j--;
  }
  return match;
}

// Times for script characters from timed ASR characters: matched ones copy, the rest are spread
// evenly between their timed neighbours.
export function charTimes(script, asr) {
  const match = alignChars(script, asr.map((c) => c.ch));
  const t = match.map((j) => (j >= 0 ? { start: asr[j].start, end: asr[j].end } : null));
  const known = t.filter(Boolean).length;
  for (let i = 0; i < t.length;) {
    if (t[i]) { i++; continue; }
    let j = i;
    while (j < t.length && !t[j]) j++;
    const a = i > 0 ? t[i - 1].end : (asr[0]?.start ?? 0);
    const b = j < t.length ? t[j].start : (asr.at(-1)?.end ?? a);
    const step = Math.max(b - a, 0) / (j - i);
    for (let k = i; k < j; k++) t[k] = { start: a + step * (k - i), end: a + step * (k - i + 1) };
    i = j;
  }
  return { times: t, matched: script.length ? known / script.length : 0 };
}

// whisper.cpp --output-json-full → timed speech characters. With --dtw, a token's t_dtw (centiseconds)
// is far closer to when it was said than its decoder offsets, which drift by up to a second; tokens
// that cut a character in half (U+FFFD) fall back to spreading the segment's text over the segment.
export function asrChars(json) {
  const chars = [];
  const spread = (text, from, to) => {
    const cs = [...text].filter((c) => SPEECH_CHAR.test(c));
    cs.forEach((ch, i) => chars.push({ ch, start: from + ((to - from) * i) / cs.length, end: from + ((to - from) * (i + 1)) / cs.length }));
  };
  for (const seg of json.transcription || []) {
    const toks = (seg.tokens || []).filter((t) => t.text && !/^\s*\[.*\]\s*$/.test(t.text));
    if (toks.some((t) => t.text.includes('\ufffd'))) { spread(seg.text || '', seg.offsets.from / 1000, seg.offsets.to / 1000); continue; }
    const dtw = toks.length && toks.every((t) => t.t_dtw >= 0);
    toks.forEach((t, i) => {
      if (!dtw) return spread(t.text, t.offsets.from / 1000, t.offsets.to / 1000);
      const from = t.t_dtw / 100, next = toks[i + 1] ? toks[i + 1].t_dtw / 100 : Math.max(from, seg.offsets.to / 1000);
      spread(t.text, from, Math.max(from, next));
    });
  }
  return chars;
}

// ---------- captions ----------

const visible = (s) => sum([...s].map((c) => (/[\p{L}\p{N}]/u.test(c) ? (/[\x00-\x7f]/.test(c) ? 0.5 : 1) : 0)));

// One sentence → caption lines of at most `max` visible characters, cut at commas first, then at
// word boundaries. Lines never cross a sentence.
export function captionLines(sentence, max = 16) {
  const clauses = [[]];
  for (const t of sentence.tokens) {
    clauses.at(-1).push(t);
    if (!t.word && CLAUSE.test(t.text.trim())) clauses.push([]);
  }
  const width = (ts) => visible(ts.filter((t) => t.word).map((t) => t.text).join(''));
  const lines = [];
  let line = [];
  for (const clause of clauses.filter((c) => c.some((t) => t.word))) {
    if (width(line) + width(clause) <= max) { line.push(...clause); continue; }
    if (line.length) lines.push(line);
    line = [];
    if (width(clause) <= max) { line = [...clause]; continue; }
    for (const t of clause) {
      if (t.word && width(line) + width([t]) > max && line.length) { lines.push(line); line = []; }
      line.push(t);
    }
  }
  if (line.some((t) => t.word)) lines.push(line);
  return lines.map((ts) => {
    const words = ts.filter((t) => t.word);
    const text = ts.map((t) => t.text).join('')
      .replace(/[，、；：。]/g, ' ').replace(/[,;:.]+(?=\s|$)/g, ' ')
      .replace(/\s+/g, ' ').trim();
    return { text, start: words[0].start, end: words.at(-1).end };
  });
}

const stamp = (s) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

export function toSrt(sentences, { max = 16, offset = 0 } = {}) {
  const lines = sentences.flatMap((s) => captionLines(s, max));
  return lines.map((l, i) => `${i + 1}\n${stamp(l.start + offset)} --> ${stamp(l.end + offset)}\n${l.text}\n`).join('\n');
}

// ---------- index.html ----------

// The words the composition anchors to: OM.cue('词') / OM.cue("词", 2) / an alias like cue('词').
export function cueTerms(html) {
  const out = [];
  const code = html.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1'); // examples in comments are not anchors
  for (const m of code.matchAll(/\bcue\(\s*(['"`])((?:(?!\1).)+)\1\s*(?:,\s*(\d+))?/g)) out.push({ term: m[2], nth: Number(m[3] || 1) });
  return out;
}

// Same matching rule as runtime/om.js OM.cue; returns the anchors that would throw.
export function missingCues(words, terms) {
  const norm = (s) => String(s).replace(/\s+/g, '').toLowerCase();
  return terms.filter(({ term, nth }) => words.filter((w) => norm(w.word).includes(norm(term))).length < nth);
}

const ROOT = /<([a-z][\w-]*)\b[^>]*\sdata-composition-id\s*=\s*["'][^"']+["'][^>]*>/i;
const AUDIO = /<audio\b[^>]*\sid\s*=\s*["']om-voice["'][^>]*>(?:\s*<\/audio>)?/i;
const CUES = /<script\b[^>]*\sid\s*=\s*["']om-cues["'][^>]*>[\s\S]*?<\/script>/i;

function attrs(tag) {
  const out = {};
  const inner = (/^<[\w-]+((?:[^>"']|"[^"]*"|'[^']*')*)>/.exec(tag)?.[1] || '').replace(/\/$/, '');
  for (const m of inner.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) out[m[1]] = m[2] ?? m[3] ?? m[4] ?? '';
  return out;
}

const escAttr = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const fmt = (n) => String(r3(n));

// First match of `re` that is not inside an HTML comment (comments may quote these very tags).
function find(html, re) {
  const comments = [...html.matchAll(/<!--[\s\S]*?-->/g)].map((m) => [m.index, m.index + m[0].length]);
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  for (const m of html.matchAll(g)) if (!comments.some(([a, b]) => m.index >= a && m.index < b)) return m;
  return null;
}
const splice = (html, m, text) => html.slice(0, m.index) + text + html.slice(m.index + m[0].length);

// Put the narration into the composition. Idempotent: an existing om-voice / om-cues is replaced in
// place, and the user's own tweaks on the audio element (data-start, volume, track…) are kept.
export function applyVoice(html, { src, duration, sentences, meta = {}, fit = false }) {
  const root = find(html, ROOT);
  if (!root) throw new OmError('index.html has no root element with data-composition-id');
  const old = find(html, AUDIO);
  const prev = old ? attrs(old[0]) : {};
  const offset = Number(prev['data-start']) || 0;
  const a = { id: 'om-voice', src, 'data-start': prev['data-start'] ?? '0', 'data-duration': fmt(duration), 'data-track-index': prev['data-track-index'] ?? '9', 'data-volume': prev['data-volume'] ?? '1' };
  for (const [k, v] of Object.entries(prev)) if (!(k in a) && k !== 'crossorigin') a[k] = v;
  const audioTag = `<audio ${Object.entries(a).map(([k, v]) => `${k}="${escAttr(v)}"`).join(' ')}></audio>`;

  const words = wordsOf(sentences).map((w) => ({ ...w, start: r3(w.start + offset), end: r3(w.end + offset) }));
  const head = JSON.stringify({ ...meta, offset, duration: r3(duration) }).slice(0, -1);
  const body = words.map((w) => JSON.stringify(w)).join(',\n');
  const json = `${head},"words":[\n${body}\n]}`.replace(/</g, '\\u003c');
  const cuesTag = `<script type="application/json" id="om-cues">${json}</script>`;

  let out = old ? splice(html, old, audioTag) : splice(html, root, `${root[0]}\n  ${audioTag}`);
  const cues = find(out, CUES);
  if (cues) out = splice(out, cues, cuesTag);
  else {
    const at = find(out, /<\/head>/i) || find(out, /<script\b/i) || find(out, /<\/body>/i);
    out = at ? splice(out, at, `${cuesTag}\n${at[0]}`) : out + cuesTag;
  }

  const rootNow = find(out, ROOT);
  const rootDuration = Number(attrs(rootNow[0])['data-duration']) || null;
  const needed = offset + duration;
  let newDuration = rootDuration;
  // Without a root data-duration the film is as long as its timeline — that is the composition's call,
  // so --fit only ever lengthens an explicit duration.
  if (fit && rootDuration != null && needed > rootDuration) {
    newDuration = Math.ceil((needed + 0.5) * 10) / 10;
    out = splice(out, rootNow, rootNow[0].replace(/(\sdata-duration\s*=\s*)(["'])[^"']*\2/, `$1"${newDuration}"`));
  }
  return { html: out, offset, rootDuration, newDuration, words };
}

// ---------- tools ----------

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 256 << 20, ...opts });
  if (r.error) throw new OmError(`could not run ${cmd}: ${r.error.message}${r.error.code === 'ENOENT' ? ' — run `om doctor`' : ''}`);
  return r;
}

function must(cmd, args, what, opts) {
  const r = run(cmd, args, opts);
  if (r.status !== 0) throw new OmError(`${what} failed: ${(r.stderr || r.stdout || '').trim().split('\n').slice(-3).join(' | ')}`);
  return r;
}

const ffmpeg = (args, what) => must('ffmpeg', ['-v', 'error', '-y', ...args], what);
const probe = (file) => Number(must('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], 'ffprobe').stdout.trim());

function speechOf(file, duration, noise = '-35dB', min = 0.15) {
  const r = must('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', `silencedetect=noise=${noise}:d=${min}`, '-f', 'null', '-'], 'silencedetect');
  return speechIntervals(parseSilences(r.stderr, duration), duration);
}

// Models live in ~/.cache/huashu-motion; files an earlier version downloaded (under ~/.cache/hyperframes) are used where
// they are, so nobody downloads 800 MB twice.
const CACHE = join(homedir(), '.cache', 'huashu-motion');
const LEGACY = join(homedir(), '.cache', 'hyperframes');
const firstFile = (...paths) => paths.find((p) => existsSync(p)) || null;

// A one-time model download with curl (resumable, follows the proxy settings curl already honours).
function download(url, file, log, what) {
  mkdirSync(dirname(file), { recursive: true });
  log(`downloading ${what} (one time)…`);
  const part = file + '.part';
  const r = spawnSync('curl', ['-fL', '--retry', '3', '-C', '-', '-o', part, url], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(part)) throw new OmError(`could not download ${what} from ${url}: ${(r.stderr || '').trim().split('\n').pop() || `curl exit ${r.status}`}`);
  renameSync(part, file);
}

const KOKORO_SETUP = 'uv venv -p 3.12 ~/.cache/huashu-motion/tts-venv && uv pip install -p ~/.cache/huashu-motion/tts-venv/bin/python kokoro-onnx soundfile';
const KOKORO_FILES = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/';
const KOKORO_PY = join(dirname(fileURLToPath(import.meta.url)), 'kokoro.py');

class KokoroMissing extends OmError {}

function kokoro(textFile, outFile, voice, speed, log = () => {}) {
  // Our documented Kokoro venv (short path on purpose: espeak-ng silently ignores long data paths).
  // (installs made before the rename to huashu-motion live under the old name; a venv can't be moved)
  const python = firstFile(...['huashu-motion', 'open-motion'].map((d) => join(homedir(), '.cache', d, 'tts-venv', 'bin', 'python')));
  if (!python) throw new KokoroMissing(`Kokoro TTS is not set up. One-time setup:\n  ${KOKORO_SETUP}`);
  const model = firstFile(join(CACHE, 'tts', 'kokoro-v1.0.onnx'), join(LEGACY, 'tts', 'models', 'kokoro-v1.0.onnx')) || join(CACHE, 'tts', 'kokoro-v1.0.onnx');
  const voices = firstFile(join(CACHE, 'tts', 'voices-v1.0.bin'), join(LEGACY, 'tts', 'voices', 'voices-v1.0.bin')) || join(CACHE, 'tts', 'voices-v1.0.bin');
  if (!existsSync(model)) download(KOKORO_FILES + 'kokoro-v1.0.onnx', model, log, 'the Kokoro voice model (~325 MB)');
  if (!existsSync(voices)) download(KOKORO_FILES + 'voices-v1.0.bin', voices, log, 'the Kokoro voices (~28 MB)');
  const r = run(python, [KOKORO_PY, model, voices, textFile, voice, String(speed), outFile]);
  let res = {};
  try { res = JSON.parse((r.stdout || '').trim().split('\n').at(-1) || ''); } catch { /* fall through */ }
  if (res.ok && existsSync(outFile)) return;
  const why = res.error || (r.stderr || '').trim().split('\n').at(-1) || `exit ${r.status}`;
  if (/not installed/i.test(why)) throw new KokoroMissing(`Kokoro TTS is not set up (${why}). One-time setup:\n  ${KOKORO_SETUP}`);
  throw new OmError(`Kokoro failed: ${why}`);
}

function say(textFile, outFile, voice, speed) {
  if (process.platform !== 'darwin') throw new OmError('say: voices are macOS only — use a Kokoro voice like zf_xiaobei');
  const args = ['-v', voice, '-o', outFile, '-f', textFile];
  if (speed !== 1) args.push('-r', String(Math.round(185 * speed)));
  // The macOS speech service occasionally hangs on a request; give each sentence a deadline and one retry.
  for (let attempt = 1; ; attempt++) {
    const r = run('say', args, { timeout: 60_000 });
    if (r.status === 0 && existsSync(outFile)) return;
    if (r.signal && attempt < 2) continue;
    throw new OmError(`say -v ${voice} ${r.signal ? 'timed out' : `failed: ${(r.stderr || '').trim()}`}${/not found|Voice/i.test(r.stderr || '') ? ' — list voices with: say -v "?"' : ''}`);
  }
}

// voice id → engine. Default: Chinese on macOS → say:Tingting (Kokoro's Chinese goes through espeak
// without tones and is hard to understand); everything else → Kokoro.
export function pickVoice(voice, text, platform = process.platform) {
  const zh = HAN.test(text);
  if (!voice) return platform === 'darwin' && zh ? { engine: 'say', id: 'Tingting' } : { engine: 'kokoro', id: zh ? 'zf_xiaobei' : 'af_heart' };
  if (voice === 'say') return { engine: 'say', id: zh ? 'Tingting' : 'Samantha' };
  if (voice.startsWith('say:')) return { engine: 'say', id: voice.slice(4) };
  return { engine: 'kokoro', id: voice.replace(/^kokoro:/, '') };
}

const TRIM = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04,areverse';

function readText(arg) {
  if (arg == null || arg === true) return null;
  const p = resolve(String(arg));
  if (String(arg).length < 512 && existsSync(p)) return readFileSync(p, 'utf8');
  return String(arg);
}

// ---------- the command ----------

export async function voice(project, opts = {}, log = () => {}) {
  const text = readText(opts.text);
  if (!text && !opts.audio) throw new OmError('usage: om voice <dir> --text <script.txt|"文本"> [--voice say:Tingting|zf_xiaobei] [--speed 1]\n       om voice <dir> --audio <recording> [--text <script>] [--asr on|off]');
  const { html } = readSource(project);
  const keep = cueTerms(html).map((c) => c.term);
  const tmp = mkdtempSync(join(tmpdir(), 'om-voice-'));
  const t0 = Date.now();

  const res = opts.audio
    ? fromRecording(resolve(String(opts.audio)), text, keep, tmp, opts, log)
    : fromScript(text, keep, tmp, opts, log);

  const fresh = readSource(project);
  const meta = { source: res.source, precision: res.precision };
  const applied = applyVoice(fresh.html, { src: 'assets/voice.wav', duration: res.duration, sentences: res.sentences, meta, fit: !!opts.fit });

  // assets/voice.wav — the previous take moves to .om/voice-history, never overwritten.
  const assets = join(project.root, 'assets');
  mkdirSync(assets, { recursive: true });
  const target = join(assets, 'voice.wav');
  if (existsSync(target) && sha(readFileSync(target)) !== sha(readFileSync(res.wav))) {
    const hist = join(project.om, 'voice-history');
    mkdirSync(hist, { recursive: true });
    renameSync(target, join(hist, `${new Date().toISOString().replace(/[:.]/g, '-')}.wav`));
  }
  copyFileSync(res.wav, target);
  const sidecar = { ...meta, offset: applied.offset, duration: r3(res.duration), sentences: res.sentences.map((s) => ({ text: s.text, start: s.tokens.find((t) => t.word)?.start, end: s.tokens.filter((t) => t.word).at(-1)?.end })), words: wordsOf(res.sentences) };
  writeFileSync(join(assets, 'voice.words.json'), JSON.stringify(sidecar, null, 1) + '\n');
  const srt = nextOutput(project, 'srt');
  writeFileSync(srt, toSrt(res.sentences, { offset: applied.offset }));
  writeSource(project, applied.html, fresh.token, `om voice (${res.source})`);

  const lines = [
    `voice    ${target}  ${res.duration.toFixed(2)}s  (${res.source})`,
    `words    ${applied.words.length} → <script id="om-cues"> + ${join(assets, 'voice.words.json')}`,
    `timing   ${res.precision} — ${PRECISION[res.precision]}`,
    `captions ${srt}`,
  ];
  if (res.note) lines.push(`note     ${res.note}`);
  const end = applied.offset + res.duration;
  if (applied.newDuration !== applied.rootDuration) lines.push(`fit      composition data-duration ${applied.rootDuration ?? 'unset'} → ${applied.newDuration}s`);
  else if (applied.rootDuration != null && end > applied.rootDuration) lines.push(`warning  narration ends at ${end.toFixed(2)}s but the composition is ${applied.rootDuration}s — the tail is cut. Re-run with --fit, or lengthen data-duration yourself.`);
  else if (applied.rootDuration == null) lines.push(`length   the root has no data-duration, so the film is as long as its timeline — make it reach ${end.toFixed(2)}s, e.g. tl.to({}, { duration: 0.6 }, OM.words().at(-1).end)`);
  const missing = missingCues(applied.words, cueTerms(applied.html));
  if (missing.length) lines.push(`warning  OM.cue anchors not in the narration (they will throw): ${[...new Set(missing.map((m) => m.term + (m.nth > 1 ? ` #${m.nth}` : '')))].join(', ')}`);
  lines.push(`took     ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return lines.join('\n');
}

export const PRECISION = {
  tts: 'sentence edges measured from the synthesized audio; words interpolated inside the detected speech (typically within ~0.1s)',
  asr: 'whisper places each clause, pauses give the exact edges, words interpolated inside (words are what whisper heard)',
  'asr+script': 'script aligned to whisper, which places each clause; pauses give the exact edges, words interpolated inside',
  silence: 'sentence edges guessed from silence gaps, words interpolated — approximate (can be off by a word or more); use --asr on for better timing',
};

function fromScript(text, keep, tmp, opts, log) {
  const sentences = splitSentences(text);
  if (!sentences.length) throw new OmError('the script has no speakable text');
  const speed = Number(opts.speed || 1);
  if (!(speed > 0.3 && speed < 3)) throw new OmError('--speed must be between 0.3 and 3');
  const pause = opts.pause == null ? 0.25 : Number(opts.pause);
  let v = pickVoice(opts.voice, text);
  if (v.engine === 'kokoro' && HAN.test(text)) log('note: Kokoro reads Chinese through espeak without tones — whisper could not understand it in our tests. Prefer say:Tingting (macOS) or your own recording (--audio).');
  const clips = [];
  for (let i = 0; i < sentences.length; i++) {
    const txt = join(tmp, `s${i}.txt`);
    writeFileSync(txt, sentences[i]);
    let raw = join(tmp, `s${i}.${v.engine === 'say' ? 'aiff' : 'wav'}`);
    log(`tts ${i + 1}/${sentences.length} (${v.engine}:${v.id}) ${sentences[i]}`);
    try {
      if (v.engine === 'say') say(txt, raw, v.id, speed); else kokoro(txt, raw, v.id, speed, log);
    } catch (e) {
      if (!(e instanceof KokoroMissing) || opts.voice || process.platform !== 'darwin') throw e;
      v = { engine: 'say', id: HAN.test(text) ? 'Tingting' : 'Samantha' };
      log(`Kokoro is not set up — using macOS say:${v.id}. (${KOKORO_SETUP})`);
      raw = join(tmp, `s${i}.aiff`);
      say(txt, raw, v.id, speed);
    }
    const clip = join(tmp, `c${i}.wav`);
    ffmpeg(['-i', raw, '-af', TRIM, '-ar', '24000', '-ac', '1', '-c:a', 'pcm_s16le', clip], 'trimming the clip');
    const duration = probe(clip);
    clips.push({ file: clip, duration, spans: speechOf(clip, duration, '-40dB', 0.12) });
  }
  const gap = join(tmp, 'gap.wav');
  ffmpeg(['-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(pause), '-c:a', 'pcm_s16le', gap], 'making the pause');
  const list = clips.flatMap((c, i) => [c.file, ...(i < clips.length - 1 && pause > 0 ? [gap] : [])]);
  writeFileSync(join(tmp, 'list.txt'), list.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
  const wav = join(tmp, 'voice.wav');
  ffmpeg(['-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), '-c', 'copy', wav], 'joining the sentences');
  const duration = probe(wav);
  const pauseReal = pause > 0 ? probe(gap) : 0;
  let at = 0;
  const out = sentences.map((s, i) => {
    const spans = clips[i].spans.map(([a, b]) => [a + at, b + at]);
    at += clips[i].duration + (i < clips.length - 1 ? pauseReal : 0);
    return { text: s, tokens: placeSentence(tokenize(s, keep), spans) };
  });
  return { wav, duration, sentences: out, source: `tts:${v.engine}:${v.id}`, precision: 'tts' };
}

function whisperCli() {
  const which = run(process.platform === 'win32' ? 'where' : 'which', ['whisper-cli']);
  const found = which.status === 0 && which.stdout.trim().split('\n')[0];
  return [found, '/opt/homebrew/bin/whisper-cli', '/usr/local/bin/whisper-cli', join(LEGACY, 'whisper', 'whisper.cpp', 'build', 'bin', 'whisper-cli')].find((p) => p && existsSync(p));
}

function fromRecording(file, text, keep, tmp, opts, log) {
  if (!existsSync(file)) throw new OmError(`no such recording: ${file}`);
  const wav = join(tmp, 'voice.wav');
  ffmpeg(['-i', file, '-vn', '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', wav], `reading ${extname(file) || 'the recording'}`);
  const duration = probe(wav);
  const zh = text ? HAN.test(text) : opts.lang ? /^zh/i.test(opts.lang) : true;
  const lang = opts.lang || (zh ? 'zh' : 'en');
  const model = opts.model || (lang === 'en' ? 'small.en' : 'small');
  const modelPath = firstFile(join(CACHE, 'whisper', 'models', `ggml-${model}.bin`), join(LEGACY, 'whisper', 'models', `ggml-${model}.bin`)) || join(CACHE, 'whisper', 'models', `ggml-${model}.bin`);
  const asr = opts.asr === true ? 'on' : opts.asr === false ? 'off' : String(opts.asr || 'auto');
  let note = '';

  const wantAsr = asr === 'on' || (asr === 'auto' && (!text || (existsSync(modelPath) && whisperCli())));
  if (wantAsr) {
    const wav16 = join(tmp, 'asr16.wav');
    ffmpeg(['-i', wav, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav16], 'resampling for ASR');
    const cli = whisperCli();
    if (!cli) throw new OmError(`whisper is not installed — brew install whisper-cpp (macOS) or build whisper.cpp${text ? '; or --asr off for silence alignment' : ''}`);
    if (!existsSync(modelPath)) download(`https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${model}.bin`, modelPath, log, `the whisper ${model} model (~${model.startsWith('small') ? '490' : model.startsWith('base') ? '150' : '?'} MB)`);
    log(`transcribing with whisper ${model} (${lang})…`);
    const args = ['-m', modelPath, '-l', lang, '-ojf', '-of', join(tmp, 'asr'), '-np', '-nfa', '--dtw', model.replace(/-/g, '.'), wav16];
    if (lang === 'zh') args.push('--prompt', '以下是普通话的句子。');
    must(cli, args, 'whisper');
    const chars = asrChars(JSON.parse(readFileSync(join(tmp, 'asr.json'), 'utf8')));
    if (!chars.length) throw new OmError('whisper heard no speech in the recording');
    const script = text || JSON.parse(readFileSync(join(tmp, 'asr.json'), 'utf8')).transcription.map((s) => s.text).join('');
    const sentences = splitSentences(script).map((s) => ({ text: s, tokens: tokenize(s, keep) }));
    const scriptChars = sentences.flatMap((s) => s.tokens.filter((t) => t.word).flatMap((t) => [...t.text].filter((c) => SPEECH_CHAR.test(c))));
    const { times, matched } = charTimes(scriptChars, chars);
    if (text) note = `${Math.round(matched * 100)}% of the script's characters matched what whisper heard`;
    if (text && matched < 0.5) note += ' — low: is this the right script for this recording?';
    const out = placeByAnchors(sentences, speechOf(wav, duration, '-35dB', 0.18), times);
    return { wav, duration, sentences: out, source: `recording:${file.split(/[\\/]/).pop()}`, precision: text ? 'asr+script' : 'asr', note };
  }

  if (!text) throw new OmError('a recording without --text needs whisper (--asr on)');
  if (asr === 'auto') note = `whisper ${model} not found — used silence alignment. For tighter timing: om voice … --asr on (downloads ~490 MB once)`;
  const sentences = splitSentences(text).map((s) => ({ text: s, tokens: tokenize(s, keep) }));
  const intervals = speechOf(wav, duration, '-35dB', 0.18);
  const spans = sentenceSpans(sentences.map((s) => sum(s.tokens.filter((t) => t.word).map(weight))), intervals);
  const out = sentences.map((s, i) => ({ text: s.text, tokens: placeSentence(s.tokens, spans[i].length ? spans[i] : [[spans[i - 1]?.at(-1)?.[1] ?? 0, spans[i - 1]?.at(-1)?.[1] ?? 0]]) }));
  return { wav, duration, sentences: out, source: `recording:${file.split(/[\\/]/).pop()}`, precision: 'silence', note };
}
