// <om-player src="film/index.html"> — plays a huashu-motion composition in a page: the studio, an exported
// share page, the website. The film runs in an iframe with runtime/om-engine.js injected (video: 'live'),
// scaled to fit, and is driven from here: every animation frame seeks the timelines to the clock, footage
// and the soundtrack play natively and are pulled back if they drift. Paused, it shows exactly frame t —
// the same seek the renderer uses.
//
//   attributes  src · controls · autoplay · loop · muted · disable-click-to-play
//   properties  currentTime (get/set) · duration · paused · muted · iframeElement
//   methods     play() · pause() · seek(t)
//   events      ready (detail: { duration, compositionWidth, compositionHeight }) · timeupdate · play · pause · ended · error
(function () {
  if (typeof customElements === 'undefined' || customElements.get('om-player')) return;
  const CSS = `
:host { display: block; position: relative; overflow: hidden; background: #000; aspect-ratio: var(--om-aspect, 16 / 9); }
.stage { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
iframe { display: block; border: 0; background: transparent; }
.cover { position: absolute; inset: 0; cursor: pointer; }
.msg { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; color: #f5f5f5; font: 13px/1.5 system-ui, sans-serif; padding: 24px; text-align: center; }
.msg.on { display: flex; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; display: none; align-items: center; gap: 10px; padding: 18px 12px 10px; background: linear-gradient(transparent, rgba(0,0,0,.55)); color: #fff; font: 12px/1 ui-monospace, Menlo, monospace; opacity: 0; transition: opacity .2s; }
:host([controls]) .bar { display: flex; }
:host(:hover) .bar, .bar.show { opacity: 1; }
.bar button { all: unset; cursor: pointer; width: 22px; height: 22px; display: grid; place-items: center; }
.bar svg { width: 16px; height: 16px; fill: currentColor; }
.track { flex: 1; height: 4px; background: rgba(255,255,255,.3); border-radius: 2px; position: relative; cursor: pointer; }
.fill { position: absolute; left: 0; top: 0; bottom: 0; background: #fff; border-radius: 2px; }
.time { min-width: 86px; text-align: right; font-variant-numeric: tabular-nums; }`;
  const PLAY = '<path d="M7 4l13 8-13 8z"/>', PAUSE = '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>';
  const SOUND = '<path d="M4 9h4l5-4v14l-5-4H4z M16 8a5 5 0 010 8"/>', MUTE = '<path d="M4 9h4l5-4v14l-5-4H4z M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" fill="none"/>';
  const fmt = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;

  class OmPlayer extends HTMLElement {
    static get observedAttributes() { return ['src', 'muted']; }
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><div class="stage"><iframe allow="autoplay; fullscreen"></iframe></div><div class="cover"></div><div class="msg"></div>
<div class="bar"><button class="pp" aria-label="play">` + `<svg viewBox="0 0 24 24">${PLAY}</svg></button><div class="track"><div class="fill"></div></div><span class="time">0:00.0</span><button class="snd" aria-label="sound"><svg viewBox="0 0 24 24">${SOUND}</svg></button></div>`;
      this._stage = root.querySelector('.stage');
      this._frame = root.querySelector('iframe');
      this._msg = root.querySelector('.msg');
      this._t = 0; this._dur = 0; this._w = 1920; this._h = 1080; this._playing = false; this._engine = null; this._raf = 0; this._load = 0;
      this._frame.addEventListener('load', () => this._boot(++this._load));
      root.querySelector('.cover').addEventListener('click', () => { if (!this.hasAttribute('disable-click-to-play')) this._playing ? this.pause() : this.play(); });
      root.querySelector('.pp').addEventListener('click', () => (this._playing ? this.pause() : this.play()));
      root.querySelector('.snd').addEventListener('click', () => { this.muted = !this.muted; });
      const track = root.querySelector('.track');
      const scrub = (e) => { const r = track.getBoundingClientRect(); this.seek(((e.clientX - r.left) / r.width) * this._dur); };
      track.addEventListener('pointerdown', (e) => { track.setPointerCapture(e.pointerId); scrub(e); track.onpointermove = scrub; });
      track.addEventListener('pointerup', () => { track.onpointermove = null; });
      new ResizeObserver(() => this._fit()).observe(this);
    }
    connectedCallback() { if (this.getAttribute('src') && !this._frame.getAttribute('src')) this._frame.src = this.getAttribute('src'); }
    attributeChangedCallback(name, _, v) {
      if (name === 'src' && v && this.isConnected) { this._halt(); this._engine = null; this._frame.src = v; }
      if (name === 'muted' && this._engine) this._engine.setMuted(v != null);
    }

    get iframeElement() { return this._frame; }
    get duration() { return this._dur; }
    get paused() { return !this._playing; }
    get currentTime() { return this._t; }
    set currentTime(t) { this.seek(t); }
    get muted() { return this.hasAttribute('muted'); }
    set muted(m) { this.toggleAttribute('muted', !!m); this._ui(); }

    play() {
      if (!this._engine || this._playing) return;
      if (this._t >= this._dur - 1e-3) this._t = 0;
      this._playing = true;
      this._t0 = this._t; this._p0 = performance.now();
      const step = () => {
        if (!this._playing) return;
        let t = this._t0 + (performance.now() - this._p0) / 1000;
        if (t >= this._dur) {
          if (this.hasAttribute('loop')) { this._t0 = 0; this._p0 = performance.now(); t = 0; }
          else { this._t = this._dur; this._drive(false); this._playing = false; this._ui(); this._emit('timeupdate'); this._emit('pause'); this._emit('ended'); return; }
        }
        this._t = t; this._drive(true); this._emit('timeupdate'); this._ui();
        this._raf = requestAnimationFrame(step);
      };
      this._emit('play'); this._ui();
      this._raf = requestAnimationFrame(step);
    }
    pause() { if (!this._playing) return; this._halt(); this._drive(false); this._ui(); this._emit('pause'); this._emit('timeupdate'); }
    seek(t) {
      t = Math.max(0, Math.min(this._dur || 0, Number(t) || 0));
      this._t = t;
      if (this._playing) { this._t0 = t; this._p0 = performance.now(); }
      this._drive(this._playing); this._ui(); this._emit('timeupdate');
    }

    _halt() { this._playing = false; cancelAnimationFrame(this._raf); }
    _drive(playing) { try { this._engine && this._engine.preview(this._t, playing); } catch (e) { this._fail(String(e && e.message || e)); } }
    _emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }
    _fail(m) { this._msg.textContent = m; this._msg.classList.add('on'); this._emit('error', { message: m }); }
    _fit() {
      const W = this.clientWidth, H = this.clientHeight;
      if (!W || !H) return;
      const k = Math.min(W / this._w, H / this._h);
      this._frame.style.width = this._w + 'px'; this._frame.style.height = this._h + 'px';
      this._stage.style.transform = `translate(${(W - this._w * k) / 2}px, ${(H - this._h * k) / 2}px) scale(${k})`;
    }
    _ui() {
      const r = this.shadowRoot;
      r.querySelector('.pp svg').innerHTML = this._playing ? PAUSE : PLAY;
      r.querySelector('.snd svg').innerHTML = this.muted ? MUTE : SOUND;
      r.querySelector('.fill').style.width = (this._dur ? (100 * this._t) / this._dur : 0) + '%';
      r.querySelector('.time').textContent = `${fmt(this._t)} / ${fmt(this._dur)}`;
    }
    // Wait for the engine's start-up handshake in the film, then report ready.
    _boot(n) {
      this._msg.classList.remove('on');
      let win;
      try { win = this._frame.contentWindow; void win.document; } catch (e) { return this._fail('the film is on another origin — serve it next to this page'); }
      const t0 = performance.now();
      const poll = () => {
        if (n !== this._load) return; // a newer src took over
        if (win.__omReady === true && win.__omEngine) {
          const eng = win.__omEngine, info = eng.info();
          this._engine = eng; this._dur = eng.duration(); this._w = info.width; this._h = info.height;
          eng.setMuted(this.muted);
          this.style.setProperty('--om-aspect', `${this._w} / ${this._h}`);
          this._fit(); this._t = Math.min(this._t, this._dur); this._drive(false); this._ui();
          this._emit('ready', { duration: this._dur, compositionWidth: this._w, compositionHeight: this._h });
          if (this.hasAttribute('autoplay')) this.play();
          return;
        }
        if (win.__omBootFailed) return this._fail(`the film did not start: ${win.__omBootFailed}`);
        if (!win.__omEngine && performance.now() - t0 > 3000) return this._fail('this page has no huashu-motion engine (runtime/om-engine.js) — open it through om studio or om export');
        if (performance.now() - t0 > 60000) return this._fail('the film did not become ready within a minute');
        setTimeout(poll, 30);
      };
      poll();
    }
  }
  customElements.define('om-player', OmPlayer);
})();
