// huashu-motion clip runtime: one parameterized explainer animation (a JSON spec) drawn on a canvas and driven
// by the film's timeline. Adapted from huashu-art-motion scripts/engine/clip.js (MIT) — see NOTICE.md.
//
// index.html loads, in order: gsap, vendor/om.js, vendor/clip/lib/*.js, vendor/clip/cues.js, this file, one
// grammar file (vendor/clip/grammars/<grammar>.js); then
//   <script type="application/json" id="clip-spec">{"grammar": "t3_finance_chart", "duration": 7, "data": {…}, "cues": […]}</script>
//   const tl = gsap.timeline({ paused: true });
//   CLIP.mount({ id: 'film', tl, apply: (spec, V) => { … } });   // "{{var}}" placeholders are filled before apply
//   window.__timelines['film'] = tl;
// mount() reads the spec, merges the composition variables (apply), anchors cues to narration words (om-cues),
// builds the paused timeline (OM.clock + one scene label per beat) and registers the pickable regions — all
// synchronously — then loads fonts and images and initialises the grammar. The engine waits for that
// (OM.ready) before it takes a frame.
//
// Spec contract (upstream references/09 §5): { grammar, duration, fps=30, safe?, alpha?, data?, cues: [{at, kind, text?, sub?,
// data?, image?, dur?}] }. Added here: cue.word / nth / edge / offset (see cues.js) and the top-level `pace`.
// The canvas size comes from the root's data-width / data-height (set 1080×1920 there for a vertical film).
(() => {
window.CLIPS = window.CLIPS || {};
const C = window.CLIP = window.CLIP || {};

// ---------- helpers for grammar files (as upstream) ----------
// time inside a cue: the cue is first visible on the frame at t = at
C.lt = (t, at, fps) => t - at + 1 / fps;
C.p = (t, at, dur, fps) => U.clamp(C.lt(t, at, fps) / dur);
C.fit = (iw, ih, bx, by, bw, bh) => { const s = Math.min(bw / iw, bh / ih); const w = iw * s, h = ih * s; return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h, s }; };
C.sub = (r, box) => ({ x: box.x + r[0] * box.w, y: box.y + r[1] * box.h, w: r[2] * box.w, h: r[3] * box.h });
C.text = (cue, ...fallback) => (cue && (cue.text ?? cue.data?.text)) ?? fallback.find(v => v != null) ?? '';

// Font families the grammars draw with → files in the project's assets/fonts/ (all SIL OFL 1.1).
// The 黑体 keeps upstream's family names PuHui-* but the files are Noto Sans SC (GB2312 subsets).
const FACES = C.FACES = {
  'PuHui-Medium': ['NotoSansSC-500.woff'], 'PuHui-Bold': ['NotoSansSC-700.woff'], 'PuHui-Heavy': ['NotoSansSC-800.woff'], 'PuHui-Black': ['NotoSansSC-900.woff'],
  'CMU-rm': ['cmunrm.woff'], 'CMU-it': ['cmunti.woff'], 'EBGaramond-400i': ['EBGaramond-400i.woff'],
  'Inter': ['Inter-var.woff', { weight: '100 900' }], 'RobotoCondensed': ['RobotoCondensed-var.woff', { weight: '100 900' }],
  'LXGWWenKai-500': ['LXGWWenKai-500.woff'],
};
C.fontDir = 'assets/fonts/';

// ---------- problems the author should see: listed on the frame itself, not only in the console ----------
const problems = C.problems = [];
C.problem = (msg) => { if (!problems.includes(msg)) { problems.push(msg); console.warn('[clip] ' + msg); } };
// A variable that holds JSON (data series, rects, palettes). Broken JSON → the template default, and a note on the frame.
C.json = (value, fallback, name) => {
  if (value == null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch (e) { C.problem(`变量 ${name} 不是合法 JSON，先用默认值（${e.message}）`); return fallback; }
};

// ---------- pickable regions: grammar files call CLIP.mark() while they draw ----------
// The box is the local rect pushed through the canvas' current transform, so camera moves, zooms and
// slide-ins are included; marking the same id twice in a frame takes the union. OM.region reads the boxes
// of the frame on screen.
let hits = new Map();
C.mark = (c, id, x, y, w, h) => {
  if (!(w > 0 && h > 0)) return;
  const m = c.getTransform();
  const xs = [], ys = [];
  for (const [px, py] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) { xs.push(m.a * px + m.c * py + m.e); ys.push(m.b * px + m.d * py + m.f); }
  let x0 = Math.min(...xs), y0 = Math.min(...ys), x1 = Math.max(...xs), y1 = Math.max(...ys);
  const old = hits.get(id);
  if (old) { x0 = Math.min(x0, old[0]); y0 = Math.min(y0, old[1]); x1 = Math.max(x1, old[0] + old[2]); y1 = Math.max(y1, old[1] + old[3]); }
  hits.set(id, [x0, y0, x1 - x0, y1 - y0]);
};
// Scene ids for a list of cues: name(q) → base or null; numbered from 1 per base ("point-1", "point-2"),
// except the first title, which is just "title".
C.beats = (cues, name) => { const n = {}; return cues.map(q => { const b = name(q); if (!b) return null; n[b] = (n[b] || 0) + 1;
  return { id: b === 'title' && n[b] === 1 ? 'title' : `${b}-${n[b]}`, at: q.at }; }).filter(Boolean); };
// Region id for the i-th cue of a kind (0-based, the same index the spec uses in data.index).
C.rid = (base, i) => `${base}-${i}`;

// Variables into the spec: a string "{{title}}" becomes the variable's value (typed: numbers stay numbers),
// "{{series|json}}" parses a JSON-holding variable (empty → the field is left out; broken → the declared
// default), and "收盘 {{price}} 元" interpolates. A cue (other than a number) whose text/sub placeholders all
// came out empty is dropped, so clearing a variable removes that beat.
const declared = (id) => { try { return (JSON.parse(document.documentElement.getAttribute('data-composition-variables') || '[]').find(v => v.id === id) || {}).default; } catch { return undefined; } };
C.fill = (spec, V) => {
  const one = (s) => {
    const whole = /^\{\{\s*([\w-]+)\s*(\|\s*json\s*)?\}\}$/.exec(s);
    if (whole) {
      if (!(whole[1] in V)) { C.problem(`spec 引用了没声明的变量 ${whole[1]}`); return undefined; }
      return whole[2] ? (String(V[whole[1]]).trim() === '' ? undefined : C.json(V[whole[1]], C.json(declared(whole[1]), undefined, whole[1] + ' 的默认值'), whole[1])) : V[whole[1]];
    }
    return s.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_, k) => (k in V ? String(V[k]) : (C.problem(`spec 引用了没声明的变量 ${k}`), '')));
  };
  const walk = (x) => Array.isArray(x) ? x.map(walk) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, walk(v)]).filter(([, v]) => v !== undefined)) : typeof x === 'string' && x.includes('{{') ? one(x) : x;
  const out = walk(spec);
  out.cues = (out.cues || []).filter((q, i) => {
    const raw = (spec.cues || [])[i] || {};
    const emptied = ['text', 'sub'].some(k => typeof raw[k] === 'string' && /^\{\{[^}]+\}\}$/.test(raw[k].trim()) && String(q[k] ?? '').trim() === '');
    return !(emptied && q.kind !== 'number' && String(q.text ?? '').trim() === '' && String(q.sub ?? '').trim() === '');
  });
  return out;
};

C.readSpec = (id = 'clip-spec') => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`没有 <script type="application/json" id="${id}">`);
  return JSON.parse(node.textContent);
};

// Default effect per cue kind: name, or [name, seconds before the cue, options]. A number cue lands at
// `at` after counting for ~0.8 s, a title floats in on a swell.
C.SFX = {
  title: ['riser', 0, { dur: 0.6, gain: 0.6 }], point: 'pop', number: ['count', 0.8, { dur: 0.8 }], highlight: 'draw',
  bar: 'tick', candle: 'tick', line: ['draw', 0, { dur: 0.8 }], enter: 'whoosh', image: 'paper', clip: 'paper',
  insert: 'pop', react: 'boing', draw: 'draw',
};

C.mount = function ({ id = 'film', canvas = 'c', tl = gsap.timeline({ paused: true }), spec: given, apply } = {}) {
  const root = document.querySelector(`[data-composition-id="${id}"]`) || document.body;
  const cv = document.getElementById(canvas), c = cv.getContext('2d');
  cv.width = Number(root.getAttribute('data-width')) || 1920; cv.height = Number(root.getAttribute('data-height')) || 1080;
  const V = (window.OM && OM.vars && OM.vars()) || {};
  let spec, G, ctx, dur = 1, failed = null;
  const fail = (msg) => { failed = failed || msg; console.error('CLIP BOOT FAILED\n' + msg); };

  try {
    spec = given || C.readSpec();
    spec.data = spec.data || {}; spec.cues = spec.cues || [];
    spec = C.fill(spec, V);
    if (apply) spec = apply(spec, V) || spec;
    const W = Number(root.getAttribute('data-width')) || spec.width || 1920, H = Number(root.getAttribute('data-height')) || spec.height || 1080;
    spec.width = W; spec.height = H;
    // narration from `om voice`
    let words = null, voiceEnd = null;
    const node = document.getElementById('om-cues');
    if (node) {
      try { const j = JSON.parse(node.textContent); words = j.words || []; voiceEnd = Number(j.offset || 0) + Number(j.duration || 0);
        if (!(voiceEnd > 0) && words.length) voiceEnd = words[words.length - 1].end; }
      catch (e) { C.problem('om-cues 不是合法 JSON，口播锚点没生效'); }
    }
    const prep = ClipCues.prepare(spec, { pace: spec.pace ?? 1, words, voiceEnd, cue: window.OM && OM.cue ? (w, n, e) => OM.cue(w, n, e) : null });
    prep.problems.forEach(C.problem);
    spec = prep.spec; dur = prep.duration;
    if (!spec.grammar) throw new Error('spec 缺 grammar');
    if (!(dur > 0)) throw new Error('spec.duration 必须 > 0');
    G = CLIPS[spec.grammar];
    if (!G || typeof G.draw !== 'function') throw new Error(`没有加载语法 ${spec.grammar}：index.html 要引入 vendor/clip/grammars/${spec.grammar}.js`);
    const FPS = spec.fps || Number(root.getAttribute('data-fps')) || 30;
    // cues as upstream: sorted, the ones past the end dropped, number captions unified (text = sub = data.text)
    const cues0 = spec.cues.map((q, i) => ({ ...q, i, at: +q.at || 0 })).sort((a, b) => a.at - b.at || a.i - b.i);
    for (const q of cues0) if (q.at > dur + 1e-9) console.warn(`cue ${q.kind} at=${q.at} 超出片长 ${dur}s，看不到，已丢掉`);
    const cues = cues0.filter(q => q.at <= dur + 1e-9);
    for (const q of cues) if (q.kind === 'number') { const cap = q.text ?? q.sub ?? (q.data && q.data.text); if (cap != null) { q.text = cap; q.sub = cap; } }
    const safe = { top: 0, bottom: 0, left: 0, right: 0, ...(spec.safe || {}) };
    const box = { x: safe.left, y: safe.top, w: W - safe.left - safe.right, h: H - safe.top - safe.bottom };
    ctx = { spec, data: spec.data, theme: spec.theme || {}, cues, W, H, FPS, u: Math.min(W, H) / 1080, portrait: H > W, alpha: !!spec.alpha, IMG: {}, dur, safe, box,
      of: (...kinds) => cues.filter(q => kinds.includes(q.kind)), lt: (t, at) => C.lt(t, at, FPS), p: (t, at, d) => C.p(t, at, d, FPS) };
    C.ctx = ctx;
  } catch (e) { fail(String(e && e.message || e)); }

  // ---------- the timeline: filled right away, so the engine knows the length and the scenes ----------
  let ready = false, lastT = 0, drawnT = null;
  const band = ctx && ctx.safe.fill && !ctx.alpha ? (cc => { const { W, H } = ctx, s = ctx.safe; cc.fillStyle = s.fill;
    if (s.top) cc.fillRect(0, 0, W, s.top); if (s.bottom) cc.fillRect(0, H - s.bottom, W, s.bottom); if (s.left) cc.fillRect(0, 0, s.left, H); if (s.right) cc.fillRect(W - s.right, 0, s.right, H); }) : null;
  const frame = (t) => {
    hits = new Map(); drawnT = t;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height);
    if (failed) return notice(c, ['动画没能启动：' + failed], true);
    try { c.save(); G.draw(c, t, ctx); c.restore(); } catch (e) { console.error(e); c.setTransform(1, 0, 0, 1, 0, 0); return notice(c, [`第 ${t.toFixed(2)} 秒画不出来：${e.message}`], true); }
    if (band) band(c);
    if (problems.length) { c.setTransform(1, 0, 0, 1, 0, 0); notice(c, problems, false); }
  };
  C.frame = (t) => frame(t);
  OM.clock(tl, (t) => { lastT = t; if (ready) frame(t); }, dur);
  if (!failed && G.scenes) {
    let prev = -1;
    for (const s of G.scenes(ctx).sort((a, b) => a.at - b.at)) { if (!(s.at >= 0) || s.at > dur + 1e-9 || s.at - prev < 1e-3) continue; tl.addLabel('scene:' + s.id, s.at); prev = s.at; }
  }
  // a sound effect per cue for `om sound`: cue.sfx names one (see `om sound --list`), false turns it off
  if (!failed && window.OM && OM.sfx) for (const q of ctx.cues) {
    const s = q.sfx === undefined ? C.SFX[q.kind] : q.sfx;
    if (!s) continue;
    const [name, lead = 0, opts] = Array.isArray(s) ? s : [s];
    OM.sfx(name, Math.max(0, q.at - lead), opts);
  }
  window.__timelines = window.__timelines || {};
  window.__timelines[id] = tl;
  if (!failed && G.regions) for (const r of G.regions(ctx)) OM.region(r.id, (t) => {
    if (!ready) return null;
    if (drawnT == null || Math.abs(t - drawnT) > 1e-4) frame(t);   // the box of the frame being asked about
    return hits.get(r.id) || null;
  }, r.label);

  // ---------- async boot: fonts, images, layout. The engine holds capture until this resolves ----------
  const hold = (p) => { if (window.OM && window.OM.ready) return window.OM.ready(p); window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {}; window.__hf.buildReady['clip:' + id] = p; return p; };
  const booted = hold((async () => {
    try {
      if (failed) return;
      cv.width = ctx.W; cv.height = ctx.H; U.setStage(ctx.W, ctx.H);
      const urls = new Set();
      ctx.cues.forEach(q => q.image && urls.add(q.image)); if (ctx.data.image) urls.add(ctx.data.image);
      await Promise.all([...urls].map(u => new Promise((res, rej) => { const im = new Image(); im.onload = () => { ctx.IMG[u] = im; res(); }; im.onerror = () => rej(new Error(`图片加载失败：${u}（路径相对 index.html）`)); im.src = u; })));
      const faces = [...new Set([...(G.faces || []), ...(G.fonts || [])])].filter(f => FACES[f]).map(f => ({ family: f, url: C.fontDir + FACES[f][0], desc: FACES[f][1] || {} }));
      await Promise.all(faces.map(async f => { const ff = new FontFace(f.family, `url(${f.url})`, f.desc); await ff.load(); document.fonts.add(ff); }));
      await document.fonts.ready;
      // glyph check: text the CJK fonts don't have falls back to a system font (looks different on another machine)
      if (G.fonts) {
        await U.loadCmaps(faces.filter(f => G.fonts.includes(f.family)));
        const txt = ctx.cues.map(q => [q.text, q.sub, q.data && q.data.text].filter(Boolean).join('')).join('') + JSON.stringify(ctx.data);
        for (const fam of G.fonts) { const miss = U.missingGlyphs(fam, [...txt].filter(ch => ch.codePointAt(0) >= 0x2E80).join(''));
          if (miss.length) console.warn(`字体「${fam}」缺字：${miss.join('')}（会回退系统字体）`); }
      }
      if (G.init) G.init(ctx);
    } catch (e) { fail(String(e && e.message || e)); }
    ready = true;
    frame(lastT);
  })());
  C.booted = booted;
  return { tl, spec, ctx, duration: dur, booted };
};

// A note in the top-left corner of the frame (variable problems, missing narration words, boot errors).
function notice(c, lines, fatal) {
  const W = c.canvas.width, s = Math.max(0.6, Math.min(W, c.canvas.height) / 1080), pad = 16 * s, lh = 30 * s;
  c.save(); c.font = `${20 * s}px "PuHui-Medium", "PingFang SC", sans-serif`; c.textBaseline = 'top';
  const shown = lines.slice(0, 6), w = Math.min(W - 40 * s, Math.max(...shown.map(l => c.measureText(l).width)) + 2 * pad);
  c.fillStyle = fatal ? '#7a1010' : 'rgba(150,20,20,0.88)'; c.fillRect(20 * s, 20 * s, w, shown.length * lh + 2 * pad - (lh - 22 * s));
  c.fillStyle = '#fff'; shown.forEach((l, i) => c.fillText(l, 20 * s + pad, 20 * s + pad + i * lh, w - 2 * pad));
  c.restore();
}
})();
