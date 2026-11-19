// huashu-motion engine — the page side of rendering. The renderer injects this file before the
// composition's own scripts run (Page.addScriptToEvaluateOnNewDocument); the composition never
// references it; the studio and exported pages inject it the same way. One engine serves rendering,
// screenshots and the preview (window.__omConfig.video === 'live', driven by runtime/om-player.js).
//
// What it provides, from the composition contract (skills/huashu-motion/references/contract.md):
//   window.__timelines           registry of paused GSAP timelines (created here if missing)
//   OM.vars()                    the variables — defaults from <html data-composition-variables>, overridden by
//                                window.__omVariables, typed as declared (window.__hyperframes.getVariables(): older alias)
//   [data-var-text] [data-var-src]   bound to the variables on DOMContentLoaded and for elements added later
//   --<id>                       every variable is a CSS custom property on the root (a colour variable "clay" is var(--clay))
//   OM.ready(promise)            a promise the page wants awaited before the first frame (fonts, an engine's boot);
//                                window.__hf.buildReady[key] = promise is the older form and still works
//   window.__omEngine            the renderer's handle: seek(t), duration(), media(), setFrames(), …
//   window.__omReady / __omBootFailed   the start-up handshake the renderer waits for
(function () {
  if (window.__omEngine) return;
  const cfg = window.__omConfig || {};
  const SETTLE_MS = cfg.settleTimeout || 15000;

  const num = (v, d) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
  // Wait for the browser to have laid out and painted what the seek changed: `paintWaits` animation frames (default 2).
  const PAINT = cfg.paintWaits == null ? 2 : cfg.paintWaits;
  const raf2 = (ms = 5000) => new Promise((ok, fail) => {
    if (PAINT === 0) { void document.body.offsetHeight; return ok(); } // force style + layout, nothing more
    const timer = setTimeout(() => fail(new Error('the page did not paint (requestAnimationFrame never fired)')), ms);
    const step = (k) => requestAnimationFrame(() => (k > 1 ? step(k - 1) : (clearTimeout(timer), ok())));
    step(PAINT);
  });
  const within = (p, ms, what) => new Promise((ok, fail) => {
    const timer = setTimeout(() => fail(new Error(`${what} did not finish within ${ms} ms`)), ms);
    Promise.resolve(p).then((v) => { clearTimeout(timer); ok(v); }, (e) => { clearTimeout(timer); fail(e); });
  });

  // ---------- variables ----------
  const declared = () => {
    try { const d = JSON.parse(document.documentElement.getAttribute('data-composition-variables') || '[]'); return Array.isArray(d) ? d : []; } catch (e) { return []; }
  };
  function variables() {
    const v = {};
    const decl = declared();
    for (const d of decl) if (d && d.id != null && 'default' in d) v[d.id] = d.default;
    Object.assign(v, window.__omVariables || {});
    for (const d of decl) {
      if (!d || !(d.id in v)) continue;
      if (d.type === 'number' && typeof v[d.id] === 'string' && v[d.id].trim() !== '' && isFinite(Number(v[d.id]))) v[d.id] = Number(v[d.id]);
      if (d.type === 'boolean' && typeof v[d.id] === 'string') v[d.id] = v[d.id] === 'true';
    }
    return v;
  }
  // OM.vars() is the supported way to read them; window.__hyperframes.getVariables() is the name films written
  // before the engine had its own still use, so it stays as an alias.
  window.OM = window.OM || {};
  if (!window.OM.vars) window.OM.vars = variables;
  window.__hyperframes = window.__hyperframes || {};
  if (!window.__hyperframes.getVariables) window.__hyperframes.getVariables = variables;

  function bind(root) {
    if (!root || root.nodeType !== 1) return;
    const v = variables();
    const nodes = [...(root.matches('[data-var-text],[data-var-src]') ? [root] : []), ...root.querySelectorAll('[data-var-text],[data-var-src]')];
    for (const el of nodes) {
      const t = el.getAttribute('data-var-text'), s = el.getAttribute('data-var-src');
      if (t != null && t in v && el.textContent !== String(v[t])) el.textContent = String(v[t]);
      if (s != null && s in v && v[s] != null && el.getAttribute('src') !== String(v[s])) el.setAttribute('src', String(v[s]));
    }
  }
  // Every variable is also a CSS custom property on the root: a colour variable "clay" is var(--clay) in the stylesheet,
  // and the studio's colour pickers rely on it. Compositions use this without declaring the property themselves.
  function cssVars() {
    const v = variables(), st = document.documentElement.style;
    for (const [k, val] of Object.entries(v)) if (val != null && typeof val !== 'object' && /^[\w-]+$/.test(k)) st.setProperty('--' + k, String(val));
  }
  document.addEventListener('DOMContentLoaded', () => {
    cssVars();
    bind(document.documentElement);
    new MutationObserver((list) => { for (const m of list) m.addedNodes.forEach(bind); }).observe(document.documentElement, { childList: true, subtree: true });
  });

  // ---------- ready promises ----------
  window.__timelines = window.__timelines || {};
  window.__hf = window.__hf || {};
  window.__hf.buildReady = window.__hf.buildReady || {};
  let readyN = 0;
  window.OM = window.OM || {};
  window.OM.ready = (p) => { window.__hf.buildReady['om:' + readyN++] = Promise.resolve(p); return p; };

  const timelines = () => Object.values(window.__timelines).filter((t) => t && typeof t.seek === 'function');
  const root = () => document.querySelector('[data-composition-id]');

  // ---------- media ----------
  const state = { mode: cfg.video === 'seek' || cfg.video === 'live' ? cfg.video : 'extract', muted: false, fps: 30, frames: new Map(), prepared: new WeakSet(), warnings: [], maxSeekError: 0, seeks: 0, rvfcMissed: 0 };
  let mediaN = 0;
  const videos = () => [...document.querySelectorAll('video')];
  function describe(el) {
    if (!el.id) el.id = 'om-media-' + (++mediaN);
    const start = num(el.getAttribute('data-start'), 0);
    const duration = num(el.getAttribute('data-duration'), Infinity);
    return {
      id: el.id, tag: el.tagName.toLowerCase(), src: el.currentSrc || el.getAttribute('src') || el.getAttribute('data-om-src') || '',
      start, duration, mediaStart: num(el.getAttribute('data-media-start') ?? el.getAttribute('data-playback-start'), 0),
      rate: Math.min(10, Math.max(0.1, num(el.getAttribute('data-playback-rate'), 1))), volume: num(el.getAttribute('data-volume'), 1),
      // as the film wrote it: the engine mutes every video it takes over, which must not drop a clip's own sound from the mix
      muted: el.dataset.omMuted != null ? el.dataset.omMuted === '1' : el.muted || el.hasAttribute('muted'),
    };
  }
  const media = () => [...document.querySelectorAll('video,audio')].map(describe);

  // The frame a player would show at media time m: the last one at or before it.
  function frameIndex(table, m) {
    const p = table.pts;
    let lo = 0, hi = p.length - 1;
    if (m <= p[0] + 1e-3) return 0;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (p[mid] <= m + 1e-3) lo = mid; else hi = mid - 1; }
    return lo;
  }
  const frameUrl = (table, i) => table.base + String(i + 1).padStart(8, '0') + '.' + table.ext;
  const loadImage = async (url, id) => {
    const im = new Image();
    im.src = url;
    try { await im.decode(); } catch (e) { throw new Error(`missing video frame for #${id}: ${url}`); }
  };

  async function prepareVideo(el) {
    // Render mode never plays the file: the element stays where it is (layout, class, transform, filter all
    // untouched) and shows the frame we hand it as its poster.
    if (el.dataset.omMuted == null) el.dataset.omMuted = el.muted || el.hasAttribute('muted') ? '1' : '0';
    el.muted = true;
    el.removeAttribute('autoplay'); el.removeAttribute('loop'); el.removeAttribute('controls');
    try { el.pause(); } catch (e) { /* not loaded */ }
    if (state.mode === 'extract') {
      if (el.hasAttribute('src')) { el.setAttribute('data-om-src', el.getAttribute('src')); el.removeAttribute('src'); }
      for (const s of el.querySelectorAll('source')) s.remove();
      el.preload = 'none';
      el.load();
    } else if (el.readyState < 1) {
      await within(new Promise((ok, fail) => { el.addEventListener('loadedmetadata', ok, { once: true }); el.addEventListener('error', () => fail(new Error(`video #${el.id} failed to load: ${el.currentSrc}`)), { once: true }); el.preload = 'auto'; el.load(); }), SETTLE_MS, `video #${el.id}`);
    }
    state.prepared.add(el);
  }

  async function syncVideo(el, t) {
    const d = describe(el);
    const active = t >= d.start - 1e-6 && t < d.start + d.duration - 1e-6;
    if (!active) { if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden'; return; }
    if (el.style.visibility === 'hidden') el.style.visibility = '';
    if (!state.prepared.has(el)) await prepareVideo(el);
    const m = (t - d.start) * d.rate + d.mediaStart;
    if (state.mode === 'extract') {
      const table = state.frames.get(d.id);
      if (!table) throw new Error(`video #${d.id} (${d.src}) has no extracted frames — it appeared after the renderer looked for media`);
      const i = frameIndex(table, m);
      const span = table.pts.length > 1 ? (table.pts[table.pts.length - 1] - table.pts[0]) / (table.pts.length - 1) : 0.1;
      if (i === table.pts.length - 1 && m > table.pts[i] + 2 * span + 0.05 && !state.warnings.includes(`#${d.id} ended`)) state.warnings.push(`#${d.id} ended`);
      const url = frameUrl(table, i);
      if (el.getAttribute('poster') !== url) { await loadImage(url, d.id); el.setAttribute('poster', url); }
      return;
    }
    const target = Math.max(0, Math.min(m, (el.duration || Infinity) - 1e-3));
    if (Math.abs(el.currentTime - target) > 1e-4 || !el.dataset.omSeeked) {
      const done = new Promise((ok) => el.addEventListener('seeked', ok, { once: true }));
      el.currentTime = target;
      await within(done, SETTLE_MS, `seeking video #${d.id}`);
      el.dataset.omSeeked = '1';
      state.seeks++;
      if ('requestVideoFrameCallback' in el) {
        // which frame was actually presented (its media time) — a measure of how exact the browser's seek was
        const shown = await within(new Promise((ok) => el.requestVideoFrameCallback((_, md) => ok(md.mediaTime))), 300, 'presenting').catch(() => null);
        if (shown != null) state.maxSeekError = Math.max(state.maxSeekError, Math.abs(shown - target));
        else state.rvfcMissed++;
      }
    }
  }

  // ---------- settle ----------
  async function settled() {
    const start = performance.now();
    for (;;) {
      await within(document.fonts.ready, SETTLE_MS, 'loading fonts');
      const waiting = Object.values(window.__hf.buildReady).filter(Boolean);
      await within(Promise.all(waiting), SETTLE_MS, 'the composition\'s ready promises (window.__hf.buildReady)');
      await Promise.all([...document.images].filter((i) => !i.complete).map((i) => within(new Promise((ok) => { i.addEventListener('load', ok, { once: true }); i.addEventListener('error', ok, { once: true }); }), SETTLE_MS, `image ${i.currentSrc}`)));
      if (document.fonts.status !== 'loading') break;
      if (performance.now() - start > SETTLE_MS) throw new Error(`fonts did not finish loading within ${SETTLE_MS} ms`);
    }
  }

  function duration() {
    const r = root();
    const fromRoot = r && num(r.getAttribute('data-duration'), 0);
    if (fromRoot > 0) return fromRoot;
    return timelines().reduce((m, t) => Math.max(m, t.duration()), 0);
  }

  async function seek(t) {
    state.t = t;
    for (const tl of timelines()) { tl.pause(); tl.seek(t, false); }
    for (const a of document.getAnimations()) {
      if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) continue;
      try { a.pause(); a.currentTime = t * 1000; } catch (e) { /* finished or detached */ }
    }
    for (const el of videos()) await syncVideo(el, t);
    for (const el of document.querySelectorAll('audio')) { el.muted = true; try { el.pause(); } catch (e) { /* ignore */ } }
    await settled();
    await raf2();
  }

  // The preview (om-player): the timelines jump to t at once, and footage and sound play natively, nudged back when they
  // drift. While paused, media sits on the exact frame of t. Nothing here waits — it runs on every animation frame.
  function preview(t, playing) {
    state.t = t;
    for (const tl of timelines()) { tl.pause(); tl.seek(t, false); }
    for (const a of document.getAnimations()) {
      if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) continue;
      try { a.pause(); a.currentTime = t * 1000; } catch (e) { /* finished or detached */ }
    }
    for (const el of document.querySelectorAll('video,audio')) {
      const d = describe(el);
      const active = t >= d.start - 1e-6 && t < d.start + d.duration - 1e-6;
      if (el.tagName === 'VIDEO') { const v = active ? '' : 'hidden'; if (el.style.visibility !== v) el.style.visibility = v; }
      if (!active) { if (!el.paused) el.pause(); continue; }
      const m = (t - d.start) * d.rate + d.mediaStart;
      el.muted = state.muted || d.muted;
      el.volume = Math.max(0, Math.min(1, d.volume));
      if (el.playbackRate !== d.rate) el.playbackRate = d.rate;
      if (playing) {
        if (el.paused) { el.currentTime = m; const p = el.play(); if (p && p.catch) p.catch(() => {}); }
        else if (Math.abs(el.currentTime - m) > 0.12) el.currentTime = m;
      } else {
        if (!el.paused) el.pause();
        if (Math.abs(el.currentTime - m) > 0.004) el.currentTime = m;
      }
    }
  }

  // Move the timelines through a list of times without painting or waiting: a worker that skipped frames catches up on
  // everything a timeline remembers (callbacks, onUpdate state) so it renders what a render from frame 0 would.
  function advance(times) {
    for (const t of times) for (const tl of timelines()) { tl.pause(); tl.seek(t, false); }
  }

  window.__omEngine = {
    duration, seek, advance, settled, media, variables, preview,
    setMuted(m) { state.muted = !!m; for (const el of document.querySelectorAll('video,audio')) el.muted = state.muted || el.hasAttribute('muted'); },
    setMode(m) { state.mode = m === 'seek' ? 'seek' : 'extract'; },
    setFrames(id, table) { state.frames.set(id, table); },
    stats: () => ({ mode: state.mode, warnings: state.warnings.slice(), maxSeekError: state.maxSeekError, seeks: state.seeks, rvfcMissed: state.rvfcMissed }),
    info() {
      const r = root();
      return {
        id: r && r.getAttribute('data-composition-id'),
        width: r ? num(r.getAttribute('data-width'), 1920) : 1920, height: r ? num(r.getAttribute('data-height'), 1080) : 1080,
        fps: r ? num(r.getAttribute('data-fps'), 30) : 30, duration: duration(),
        timelines: Object.keys(window.__timelines), labels: (timelines()[0] && timelines()[0].labels) || {},
      };
    },
  };

  // ---------- start-up handshake ----------
  // The renderer waits for __omReady (or __omBootFailed) before it asks for a single frame.
  window.addEventListener('load', async () => {
    try {
      await settled();
      for (const el of videos()) { describe(el); if (state.mode === 'extract') await prepareVideo(el); else if (state.mode === 'live') { el.removeAttribute('autoplay'); try { el.pause(); } catch (e) { /* not loaded */ } } } // frames come from disk: stop the file loading
      if (!cfg.lenient && !(duration() > 0)) throw new Error('the composition has no timeline: register a paused GSAP timeline in window.__timelines');
      window.__omReady = true;
    } catch (e) { window.__omBootFailed = String((e && e.message) || e); }
  });
})();
