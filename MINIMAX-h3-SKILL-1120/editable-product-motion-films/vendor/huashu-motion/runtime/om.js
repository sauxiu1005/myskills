// huashu-motion runtime — optional helpers a composition can include (copy to vendor/om.js).
// Plain script, no build. Everything here stays deterministic: values come from time, never the clock.
(function () {
  const OM = (window.OM = window.OM || {});

  // Composition variables (the values the studio inspector edits). Read once at build time.
  // Values arrive typed as declared: a number variable edited in the studio can come back as the string
  // "1.5", and `B(4.8) + V.endHold` would then concatenate instead of add.
  OM.vars = () => {
    const eng = window.__omEngine || null, alias = window.__hyperframes && window.__hyperframes.getVariables;
    const v = { ...(eng ? eng.variables() : alias ? alias() : {}) };
    let decl = [];
    try { decl = JSON.parse(document.documentElement.getAttribute('data-composition-variables') || '[]'); } catch (e) { decl = []; }
    for (const d of decl) {
      if (!d || !(d.id in v)) continue;
      if (d.type === 'number' && typeof v[d.id] === 'string' && v[d.id].trim() !== '' && isFinite(Number(v[d.id]))) v[d.id] = Number(v[d.id]);
      if (d.type === 'boolean' && typeof v[d.id] === 'string') v[d.id] = v[d.id] === 'true';
    }
    return v;
  };

  // Canvas / WebGL engines that draw a whole frame from a time value plug into the film's
  // timeline here: the paused timeline drives a proxy, every seek calls draw(t).
  //   OM.clock(tl, (t) => engine.renderFrame(t), 15)
  // The tween writes through a setter, so draw(t) runs on every render of the timeline — including
  // silent seeks that suppress onUpdate callbacks.
  OM.clock = function (tl, draw, duration, at) {
    let t = 0;
    const p = {};
    Object.defineProperty(p, 't', { get: () => t, set: (v) => { t = v; draw(v); } });
    tl.fromTo(p, { t: 0 }, { t: duration, duration, ease: 'none', immediateRender: false }, at || 0);
    draw(0);
    return tl;
  };

  // Pickable regions for things drawn on a canvas, so people can click them in the studio and
  // comments arrive with an id. box(t) returns [x, y, w, h] in composition pixels, or null when absent.
  //   OM.region('cat', (t) => t < 4 ? [820, 610, 240, 260] : null, '猫')
  const regions = new Map();
  OM.region = function (id, box, label) { regions.set(id, { box, label }); return OM; };
  window.__om = {
    hitTest(x, y, t) {
      let best = null;
      for (const [id, r] of regions) {
        const b = r.box(t);
        if (!b || x < b[0] || y < b[1] || x > b[0] + b[2] || y > b[1] + b[3]) continue;
        if (!best || b[2] * b[3] < best.box[2] * best.box[3]) best = { id, box: b, label: r.label };
      }
      return best;
    },
    boxOf(id, t) { const r = regions.get(id); return r ? r.box(t) : null; },
    regions: () => [...regions.keys()],
    regionLabel: (id) => regions.get(id)?.label ?? null,
  };

  // Word cues from narration. `om voice` writes <script type="application/json" id="om-cues">
  // {"words":[{"word":"缓存","start":1.92,"end":2.31}, …]} into the composition.
  //   tl.fromTo('#hit', {...}, {...}, OM.cue('缓存') - 0.3)   // land the motion as the word is spoken
  let words = null;
  const load = () => {
    if (words) return words;
    const node = document.getElementById('om-cues');
    words = node ? (JSON.parse(node.textContent).words || []) : [];
    return words;
  };
  const norm = (s) => String(s).replace(/\s+/g, '').toLowerCase();
  OM.cue = function (word, nth, edge) {
    const target = norm(word), list = load();
    let seen = 0;
    for (const w of list) {
      if (norm(w.word) === target || norm(w.word).includes(target)) {
        if (++seen === (nth || 1)) return edge === 'end' ? w.end : w.start;
      }
    }
    throw new Error(`huashu-motion: no cue "${word}"${nth > 1 ? ` #${nth}` : ''} in om-cues (${list.length} words)`);
  };
  OM.words = () => load().slice();

  // Sound. `om sound` reads what the composition declares here and renders the soundtrack
  // (assets/sound.wav, <audio id="om-sound">): music sectioned by the scene labels, effects on the hits.
  //   OM.music({ product: 'devtool', drop: 'reveal' })  // a built-in direction (om sound --list), or off: true;
  //                                                    // or write the score: <script type="text/vnd.abc" id="om-score">
  //   tl.to('.card', {...}, OM.sfx('thud', 5.6))      // returns the time, so motion and sound share one line
  //   tl.addLabel('scene:chart', OM.beat(16))         // 16 beats in: scene cuts on the music's grid
  // Nothing plays in the browser; re-run `om sound` (or `om render`, which does it) after timing changes.
  const hits = [];
  let music = {};
  OM.sfx = function (name, at, opts) {
    const t = Number(at);
    if (!(t >= 0)) throw new Error(`huashu-motion: OM.sfx('${name}') needs a time ≥ 0, got ${at}`);
    hits.push({ ...(opts || {}), name: String(name), at: t });
    return t;
  };
  OM.music = function (opts) { music = { ...music, ...(opts || {}) }; return OM; };
  OM.beat = function (n, bpm) {
    const b = Number(bpm || music.bpm);
    if (!(b > 0)) throw new Error('huashu-motion: OM.beat needs a bpm — call OM.music({ bpm }) first');
    return (Number(n) * 60) / b;
  };
  window.__om.sound = () => ({ hits: hits.slice(), music: { ...music } });

  // Springs as closed-form step responses: a pure function of time, so any frame renders alone and
  // reverse seeks land in the same state. `bounce` is the overshoot (0 = critically damped, 0.1 = a
  // tiny overshoot, 0.3 = playful). The tween's duration is the settle time.
  //   tl.to('.card', { y: 0, duration: .6, ease: OM.spring(0.12) }, 2.4)
  const zeta = (b) => (b <= 0 ? 1 : -Math.log(b) / Math.sqrt(Math.PI * Math.PI + Math.log(b) ** 2));
  const step = (t, z, w) => {
    if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  };
  OM.spring = function (bounce) {
    const z = zeta(Math.min(0.9, Math.max(0, Number(bounce) || 0)));
    const w = 6.9 / z; // settles to 0.1% at the end of the tween
    return (p) => (p >= 1 ? 1 : p <= 0 ? 0 : step(p, z, w));
  };
  // The same spring for engines that draw from t (canvas, WebGL): a value that changes target many
  // times is the sum of one step per change. changes = [{ at, to }], sorted by at.
  //   const x = OM.springValue(0, [{ at: 1, to: 300 }, { at: 2.2, to: 120 }], t, { bounce: 0.1, settle: 0.6 })
  OM.springValue = function (from, changes, t, opts) {
    const o = opts || {}, z = zeta(o.bounce || 0), w = 6.9 / z / (o.settle || 0.6);
    let v = from, prev = from;
    for (const c of changes) {
      if (t > c.at) v += (c.to - prev) * step(t - c.at, z, w);
      prev = c.to;
    }
    return v;
  };

  // Seeded randomness: same seed, same film. Math.random would differ between preview and render.
  //   const rnd = OM.random(7); rnd() → [0, 1)
  OM.random = function (seed) {
    let a = (Number(seed) || 1) >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // One camera over one world. Lay every shot out in a single container (the "world"), then move
  // the camera through it instead of cutting between slides. The camera keeps a focus point and a
  // zoom; zoom interpolates in log space, so a 1× → 8× push feels even instead of rushing at the end,
  // and the focus point travels on its own curve, so the thing you push into stays put on screen.
  //   const cam = OM.camera('#world', { width: 1920, height: 1080 });
  //   cam.set({ fit: '#composer', pad: 120 });                            // first frame
  //   cam.to(tl, 1.2, { fit: '#send', pad: 300, duration: .7, ease: 'expo.inOut' });
  //   cam.to(tl, 3.0, { focus: [960, 540], zoom: 1, duration: .9 });       // pull back to the whole world
  // fit: a selector/element framed with `pad` px around it; focus: [x, y] in world px; zoom: number;
  // anchor: where on screen the focus lands (default the centre). cam.region(id) makes the current
  // view pickable in the studio.
  OM.camera = function (world, opts) {
    const o = opts || {};
    const el = typeof world === 'string' ? document.querySelector(world) : world;
    if (!el) throw new Error(`huashu-motion: OM.camera — no element ${world}`);
    const root = document.querySelector('[data-composition-id]');
    const W = o.width || Number(root?.getAttribute('data-width')) || 1920;
    const H = o.height || Number(root?.getAttribute('data-height')) || 1080;
    el.style.transformOrigin = '0 0';
    const state = { fx: W / 2, fy: H / 2, lz: 0, ax: W / 2, ay: H / 2 };
    const apply = () => {
      const s = Math.exp(state.lz);
      el.style.transform = `translate(${state.ax - s * state.fx}px, ${state.ay - s * state.fy}px) scale(${s})`;
    };
    // World coordinates of an element, measured against the world's own box so the current camera
    // pose and the studio's preview scale cancel out.
    const box = (target) => {
      const t = typeof target === 'string' ? el.querySelector(target) || document.querySelector(target) : target;
      if (!t) throw new Error(`huashu-motion: OM.camera — no element ${target}`);
      const wr = el.getBoundingClientRect(), r = t.getBoundingClientRect();
      const k = wr.width / (el.offsetWidth || W);
      return { x: (r.left - wr.left) / k, y: (r.top - wr.top) / k, w: r.width / k, h: r.height / k };
    };
    let plan = { ...state }; // the pose the next move starts from (the live state only changes on seek)
    const pose = (p) => {
      const out = { fx: plan.fx, fy: plan.fy, lz: plan.lz, ax: p.anchor ? p.anchor[0] : plan.ax, ay: p.anchor ? p.anchor[1] : plan.ay };
      if (p.fit) {
        const b = box(p.fit), pad = p.pad == null ? 80 : p.pad;
        out.fx = b.x + b.w / 2; out.fy = b.y + b.h / 2;
        out.lz = Math.log(p.zoom || Math.min(W / (b.w + 2 * pad), H / (b.h + 2 * pad)));
      } else {
        if (p.focus) { out.fx = p.focus[0]; out.fy = p.focus[1]; }
        if (p.zoom) out.lz = Math.log(p.zoom);
      }
      return out;
    };
    const cam = {
      set(p) { Object.assign(state, pose(p || {})); plan = { ...state }; apply(); return cam; },
      // Poses are computed when the timeline is built, from the layout at that moment.
      to(tl, at, p) {
        const target = pose(p || {});
        const proxy = {};
        for (const k of Object.keys(target)) Object.defineProperty(proxy, k, { get: () => state[k], set: (v) => { state[k] = v; apply(); }, enumerable: true });
        tl.fromTo(proxy, { ...plan }, { ...target, duration: p.duration == null ? 0.8 : p.duration, ease: p.ease || 'power3.inOut', immediateRender: false }, Math.max(0, at));
        plan = target;
        return cam;
      },
      zoom: () => Math.exp(state.lz),
      region(id, label) { OM.region(id, () => [0, 0, W, H], label || id); return cam; },
    };
    apply();
    return cam;
  };
})();
