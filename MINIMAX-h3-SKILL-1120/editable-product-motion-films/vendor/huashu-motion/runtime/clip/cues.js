// Timing for a clip spec, before anything is drawn: the pace multiplier, cues anchored to narration words,
// and the film length. Pure functions (no DOM), shared by clip.js in the browser and the tests in Node.
//
//   cue.word  "缓存"     with om-cues in the project: at = the moment that word is spoken (+ cue.offset seconds)
//   cue.nth   2          the 2nd time it is spoken (default 1)
//   cue.edge  "end"      anchor to the end of the word instead of its start
//   data.hitWord         same, for y4 insert's data.hit (the moment the big text slams in)
// Without om-cues (or when the word is not in the narration) the cue keeps its own `at`, scaled by pace.
(function (root) {
  const norm = (s) => String(s).replace(/\s+/g, '').toLowerCase();

  // The nth time `term` is spoken, searched in the narration text with every word joined, so it also
  // finds a term the tokenizer split across words (ICU cuts 缓存命中 into 缓|存命|中). Returns the start of
  // the first word it touches (or the end of the last one with edge 'end'); null when it is not there.
  function findWord(words, term, nth = 1, edge = 'start') {
    const target = norm(term);
    if (!target || !words || !words.length) return null;
    let text = '';
    const owner = [];
    words.forEach((w, i) => { for (const ch of norm(w.word)) { text += ch; owner.push(i); } });
    let from = 0, seen = 0;
    for (;;) {
      const k = text.indexOf(target, from);
      if (k < 0) return null;
      if (++seen === (nth || 1)) {
        const first = words[owner[k]], last = words[owner[k + target.length - 1]];
        return edge === 'end' ? last.end : first.start;
      }
      from = k + target.length;
    }
  }

  // spec → { spec (a copy with final times), duration, problems[] }
  //   pace:     multiplies every time position that is not anchored to a word (at, data.hit, duration)
  //   words:    [{word, start, end}] from om-cues, or null
  //   voiceEnd: when the narration ends (s); the film is never shorter than voiceEnd + tail
  //   cue:      optional resolver tried first (the browser passes OM.cue); falls back to findWord
  function prepare(input, { pace = 1, words = null, voiceEnd = null, cue = null, tail = 0.5 } = {}) {
    const spec = JSON.parse(JSON.stringify(input));
    const p = Number(pace) > 0 ? Number(pace) : 1;
    const problems = [], anchored = [];
    const voiced = Array.isArray(words) && words.length > 0;
    const resolve = (term, nth, edge) => {
      if (cue) { try { const v = cue(term, nth, edge); if (Number.isFinite(v)) return v; } catch { /* fall back */ } }
      return findWord(words, term, nth, edge);
    };
    for (const q of spec.cues || []) {
      const own = +((Number(q.at) || 0) * p).toFixed(6);
      if (voiced && q.word) {
        const t = resolve(q.word, q.nth || 1, q.edge);
        if (t == null) { q.at = own; problems.push(`cue「${q.word}」${q.nth > 1 ? `第 ${q.nth} 次` : ''}不在配音里，${q.kind} 用自带的 at=${+own.toFixed(2)}s`); }
        else { q.at = Math.max(0, t + (Number(q.offset) || 0)); anchored.push({ kind: q.kind, word: q.word, at: q.at }); }
      } else q.at = own;
      const d = q.data;
      if (d && (d.hit != null || d.hitWord)) {
        const t = voiced && d.hitWord ? resolve(d.hitWord, d.hitNth || 1, d.hitEdge) : null;
        if (t != null) d.hit = t + (Number(d.hitOffset) || 0);
        else {
          if (voiced && d.hitWord) problems.push(`hitWord「${d.hitWord}」不在配音里，用自带的 hit`);
          if (d.hit != null) d.hit = +(Number(d.hit) * p).toFixed(6);
        }
      }
    }
    let duration = +((Number(spec.duration) || 0) * p).toFixed(6);
    if (voiced && Number.isFinite(voiceEnd)) duration = Math.max(duration, voiceEnd + tail);
    spec.duration = duration;
    return { spec, duration, problems, anchored };
  }

  root.ClipCues = { findWord, prepare };
})(typeof window !== 'undefined' ? window : globalThis);
