// oriel — Clarity, in every light.   Aurora & Glassmorphism brand film, 10 s.
// Every frame is a pure function of t: renderAt(t) recomputes all state from cues.json + closed-form curves.
// Pipeline (WebGL2): aurora (4 blurred discs) -> per-card frosted glass (perspective SDF, backdrop blur 30px)
// -> wordmark overlay -> liquid-glass lens (SDF slab, spectral refraction) -> bloom + grain + dither.
import { VS, FS_AURORA, FS_DOWN, FS_BLUR, FS_CARD, FS_OVER, FS_LENS, FS_FINAL } from './shaders.js';

const W = 1920, H = 1080, FPS = 30;
const DPR = window.devicePixelRatio || 1;
const RW = Math.round(W * DPR), RH = Math.round(H * DPR);
const QW = Math.max(8, Math.round(RW / 4)), QH = Math.max(8, Math.round(RH / 4));
const Q = new URLSearchParams(location.search);
const q = (k, d) => (Q.has(k) ? +Q.get(k) : d);

const cues = await (await fetch('/demos/oriel/cues.json')).json();

// ------------------------------------------------------------------ math
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const eSine = (t) => -(Math.cos(Math.PI * clamp(t)) - 1) / 2;          // the house curve: in-out sine (breathing)
const eOutSine = (t) => Math.sin(clamp(t) * Math.PI / 2);
const eOutCubic = (t) => 1 - Math.pow(1 - clamp(t), 3);
const seg = (t, a, b, e = eSine) => e(inv(a, b, t));
const TAU = Math.PI * 2, D2R = Math.PI / 180;

function hermite(keys) {
  const n = keys.length;
  keys.forEach((k, i) => {
    if (k.m) return;
    if (i === 0 || i === n - 1) { k.m = k.v.map(() => 0); return; }
    const a = keys[i - 1], b = keys[i + 1];
    k.m = k.v.map((_, j) => (b.v[j] - a.v[j]) / (b.t - a.t));
  });
  return (t) => {
    if (t <= keys[0].t) return keys[0].v.map((v, j) => v + keys[0].m[j] * (t - keys[0].t));
    if (t >= keys[n - 1].t) return keys[n - 1].v.slice();
    let i = 0; while (t > keys[i + 1].t) i++;
    const a = keys[i], b = keys[i + 1], h = b.t - a.t, s = (t - a.t) / h, s2 = s * s, s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
    return a.v.map((_, j) => h00 * a.v[j] + h10 * h * a.m[j] + h01 * b.v[j] + h11 * h * b.m[j]);
  };
}
function keysS(list, ease = eSine) {
  return (t) => {
    if (t <= list[0][0]) return list[0][1];
    for (let i = 0; i < list.length - 1; i++) {
      const [t0, v0] = list[i], [t1, v1] = list[i + 1];
      if (t <= t1) return lerp(v0, v1, ease(inv(t0, t1, t)));
    }
    return list[list.length - 1][1];
  };
}
function rotM(rx, ry, rz) {
  const a = rx * D2R, b = ry * D2R, c = rz * D2R;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  const Rx = [[1, 0, 0], [0, ca, -sa], [0, sa, ca]], Ry = [[cb, 0, sb], [0, 1, 0], [-sb, 0, cb]], Rz = [[cc, -sc, 0], [sc, cc, 0], [0, 0, 1]];
  const mul = (A, B) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
  const M = mul(Rz, mul(Ry, Rx));
  return { U: [M[0][0], M[1][0], M[2][0]], V: [M[0][1], M[1][1], M[2][1]], N: [M[0][2], M[1][2], M[2][2]] };
}
const F = 2000;
// one slow continuous dolly with a lateral drift: different card depths -> true parallax
function camera(t) {
  return { x: lerp(-24, 26, eSine(inv(-0.5, 10.5, t))), y: lerp(10, -6, eSine(inv(0, 10, t))), z: 120 + 80 * eSine(inv(-0.5, 7.6, t)) - 20 * eSine(inv(7.6, 10.5, t)) };
}
const camO = (cam) => [960 + cam.x, 540 + cam.y, -F + cam.z];

// ------------------------------------------------------------------ palette
const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const PAL = { base: '#07061A', violet: '#7B5CFF', blue: '#3D7BFF', cyan: '#3FE0F0', magenta: '#C04DFF' };
const TXT = (a) => `rgba(242,244,255,${a})`;

// ------------------------------------------------------------------ aurora: 4 solid discs, blur 110-145 px, closed bezier loops 24-38 s
function loopBezier(pts, period, phase) {
  const n = pts.length;
  return (t) => {
    const u = (((t / period + phase) % 1) + 1) % 1 * n;
    const i = Math.floor(u), s = u - i;
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const a = 1 - s;
    return [0, 1].map((k) => a * a * a * p1[k] + 3 * a * a * s * c1[k] + 3 * a * s * s * c2[k] + s * s * s * p2[k]);
  };
}
const BLOBS = [
  { col: PAL.violet, R: 360, sig: 135, i: 1.05, path: loopBezier([[540, 340], [800, 250], [900, 480], [600, 560]], 30, 0.08) },
  { col: PAL.blue, R: 400, sig: 145, i: 0.95, path: loopBezier([[640, 860], [980, 800], [1080, 980], [520, 1000]], 38, 0.55) },
  { col: PAL.cyan, R: 300, sig: 120, i: 0.85, path: loopBezier([[1520, 760], [1330, 640], [1560, 540], [1720, 800]], 26, 0.15) },
  { col: PAL.magenta, R: 210, sig: 110, i: 0.72, path: loopBezier([[1500, 210], [1700, 300], [1420, 360], [1300, 170]], 34, 0.62) },
];
const gainK = keysS([[0, 0.9], [0.8, 0.96], [cues.brighten[0], 0.97], [cues.brighten[1], 1.12], [cues.swell, 1.16], [7.6, 1.08], [10, 1.05]]);

// ------------------------------------------------------------------ WebGL
const canvas = document.getElementById('gl');
canvas.width = RW; canvas.height = RH;
const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
if (!gl) throw new Error('webgl2 unavailable');
const hasFloat = !!gl.getExtension('EXT_color_buffer_float');
gl.getExtension('OES_texture_float_linear');
const IFMT = hasFloat ? gl.RGBA16F : gl.RGBA8, TYPE = hasFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
function compile(fs) {
  const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); throw new Error('shader compile'); } return s; };
  const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(p)); throw new Error('link'); }
  const loc = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const u = gl.getActiveUniform(p, i); loc[u.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, u.name); }
  return { p, loc };
}
const P = { aurora: compile(FS_AURORA), down: compile(FS_DOWN), blur: compile(FS_BLUR), card: compile(FS_CARD), over: compile(FS_OVER), lens: compile(FS_LENS), final: compile(FS_FINAL) };
const vao = gl.createVertexArray();
function makeTarget(w, h) {
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, IFMT, w, h, 0, gl.RGBA, TYPE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { tex, fb, w, h };
}
const T = { sharp: makeTarget(RW, RH), scene: makeTarget(RW, RH), lens: makeTarget(RW, RH), q1: makeTarget(QW, QH), q2: makeTarget(QW, QH), qL: makeTarget(QW, QH), qB: makeTarget(QW, QH) };
function canvasTex(mip) {
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}
function upload(tex, cv, mip) {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
  if (mip) gl.generateMipmap(gl.TEXTURE_2D);
}
const grainImg = new Image(); grainImg.src = '/assets/textures/grain/grain_fine_2048.png';
await grainImg.decode();
const grainTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, grainTex);
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grainImg);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

// ------------------------------------------------------------------ fonts (OFL): fail loudly if anything would fall back
const FONT_UI = "'Inter'", FONT_WORD = "'Manrope'";
const NEED = [[300, FONT_UI], [400, FONT_UI], [500, FONT_UI], [600, FONT_UI], [300, FONT_WORD]];
await Promise.all(NEED.map(([w, f]) => document.fonts.load(`${w} 40px ${f}`, 'oriel Ask Oriel anything… 0123456789 ·')));
await document.fonts.ready;
const FONT_OK = NEED.every(([w, f]) => document.fonts.check(`${w} 40px ${f}`, 'oriel'));
const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`);
if (!FONT_OK || loaded.length < NEED.length) console.error('FONT FALLBACK RISK', loaded.join(', '));
window.__fonts = loaded;

// ------------------------------------------------------------------ blur taps & pass helpers
function gaussTaps(sigma) {
  const R = Math.min(29, Math.max(1, Math.ceil(sigma * 3)));
  const w = []; let sum = 0;
  for (let i = 0; i <= R; i++) { const v = Math.exp(-i * i / (2 * sigma * sigma)); w.push(v); sum += i ? 2 * v : v; }
  for (let i = 0; i <= R; i++) w[i] /= sum;
  const offs = [0], ws = [w[0]];
  for (let i = 1; i <= R; i += 2) { const a = w[i], b = i + 1 <= R ? w[i + 1] : 0, s = a + b; offs.push(s > 0 ? (i * a + (i + 1) * b) / s : i); ws.push(s); }
  while (offs.length < 16) { offs.push(0); ws.push(0); }
  return { offs: new Float32Array(offs.slice(0, 16)), ws: new Float32Array(ws.slice(0, 16)), n: Math.min(16, Math.ceil(R / 2) + 1) };
}
const TAPS_FROST = gaussTaps(35 * DPR / 4);   // backdrop-filter: blur(35px)
const TAPS_LENS = gaussTaps(22 * DPR / 4);
const TAPS_BLOOM = gaussTaps(40 * DPR / 4);
function use(prog, target) {
  gl.useProgram(prog.p);
  if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb); gl.viewport(0, 0, target.w, target.h); }
  else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, RW, RH); }
  const w = target ? target.w : RW, h = target ? target.h : RH;
  if (prog.loc.uRes) gl.uniform2f(prog.loc.uRes, w, h);
  if (prog.loc.uDPR) gl.uniform1f(prog.loc.uDPR, DPR * (target ? target.w / RW : 1));
  return prog.loc;
}
function bindTex(unit, tex, loc) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(loc, unit); }
function draw() { gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLES, 0, 3); }
function blurInto(src, dst, taps, thresh = 0) {
  let L = use(P.down, T.q2); bindTex(0, src.tex, L.uSrc); gl.uniform2f(L.uSrcTexel, 1 / src.w, 1 / src.h); gl.uniform1f(L.uThresh, thresh); draw();
  L = use(P.blur, T.q1); bindTex(0, T.q2.tex, L.uSrc); gl.uniform2f(L.uDir, 1, 0); gl.uniform1fv(L.uOff, taps.offs); gl.uniform1fv(L.uW, taps.ws); gl.uniform1i(L.uN, taps.n); draw();
  L = use(P.blur, dst); bindTex(0, T.q1.tex, L.uSrc); gl.uniform2f(L.uDir, 0, 1); gl.uniform1fv(L.uOff, taps.offs); gl.uniform1fv(L.uW, taps.ws); gl.uniform1i(L.uN, taps.n); draw();
}

// ------------------------------------------------------------------ 2D UI helpers
function rr(g, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function font(g, w, s, fam = FONT_UI, track = 0) { g.font = `${w} ${s}px ${fam}`; g.letterSpacing = `${track}px`; }
// text entrance: opacity + 8 px rise, sine
function riseA(t, t0, dur = 0.8) { const k = inv(t0, t0 + dur, t); return { a: eSine(k), dy: 8 * (1 - eOutSine(k)) }; }
const scratch = document.createElement('canvas').getContext('2d');
function measure(w, s, txt, fam = FONT_UI, track = 0) { font(scratch, w, s, fam, track); return scratch.measureText(txt).width; }

// the Oriel mark in miniature: a dark glass bead with a rainbow dispersion ring
function orb(g, x, y, r, t, a = 1) {
  g.save(); g.globalAlpha *= a;
  const core = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
  core.addColorStop(0, 'rgba(200,210,255,0.55)'); core.addColorStop(0.45, 'rgba(90,92,220,0.35)'); core.addColorStop(1, 'rgba(20,18,60,0.25)');
  g.fillStyle = core; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  const cg = g.createConicGradient(t * 0.5, x, y);
  ['#FF6FAE', '#FFC46B', '#9BFF8A', '#3FE0F0', '#3D7BFF', '#7B5CFF', '#C04DFF', '#FF6FAE'].forEach((c, i, arr) => cg.addColorStop(i / (arr.length - 1), c));
  g.strokeStyle = cg; g.lineWidth = r * 0.26; g.beginPath(); g.arc(x, y, r - r * 0.13, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 1; g.beginPath(); g.arc(x, y, r - 0.5, 0, TAU); g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.ellipse(x - r * 0.32, y - r * 0.38, r * 0.22, r * 0.12, -0.6, 0, TAU); g.fill();
  g.restore();
}

// ------------------------------------------------------------------ copy (exact)
const COPY = {
  ask: 'Ask Oriel anything', listening: 'Listening…', user: 'Summarize my week in three lines.',
  reply: ['3 meetings moved to Thursday', '2 drafts ready for review', 'Focus time protected'],
  t1: 'Focus Mode', t2: 'Private by default', on: 'On', notifA: 'oriel', notifB: ' · Your 9:00 brief is ready',
  word: 'oriel', tag: 'Clarity, in every light.',
};

// ------------------------------------------------------------------ card content (v5: v1 layout & type, world units)
const S = 2;
function begin(c) {
  const g = c.g; g.setTransform(S, 0, 0, S, 0, 0); g.clearRect(0, 0, c.w, c.h);
  g.textBaseline = 'alphabetic'; g.globalAlpha = 1; g.shadowBlur = 0; g.shadowColor = 'rgba(0,0,0,0)'; g.letterSpacing = '0px';
  return g;
}
const bump = (t, a, b, c, d) => seg(t, a, b) * (1 - seg(t, c, d));
const BULGE = cues.lens_bulge, LB = cues.lens_born, ST = cues.settle, MERGE = cues.lens_merge, CK = cues.lens_contract;
// the input orb charges and swells, then a drop of light detaches from it (the lens)
const flareAt = (t) => bump(t, BULGE - 0.25, BULGE + 0.1, LB - 0.05, LB + 0.45);

const IN = { P0: 34, orbX: 54, textX: 98 };
const ASK_W = measure(400, 28, COPY.ask, FONT_UI, -0.2);
function drawInput(c, t) {
  const g = begin(c), P0 = IN.P0, cy = c.h / 2;
  const r = riseA(t, -0.35, 0.9);
  const fl = flareAt(t);
  if (fl > 0.002) {
    const R = 21 + 30 * fl, hg = g.createRadialGradient(IN.orbX, cy, 0, IN.orbX, cy, R);
    hg.addColorStop(0, `rgba(230,236,255,${0.8 * fl})`); hg.addColorStop(0.4, `rgba(160,176,255,${0.38 * fl})`); hg.addColorStop(1, 'rgba(120,140,255,0)');
    g.fillStyle = hg; g.beginPath(); g.arc(IN.orbX, cy, R, 0, TAU); g.fill();
  }
  g.globalAlpha = r.a;
  orb(g, IN.orbX, cy + r.dy, 21 * (1 + 0.08 * fl), t);
  font(g, 400, 28, FONT_UI, -0.2); g.fillStyle = TXT(0.66);
  g.fillText(COPY.ask, IN.textX, cy + 10 + r.dy);
  const on = seg(t, cues.cursor - 0.1, cues.cursor + 0.2);
  const ph = (t - cues.cursor) / 1.05;
  const blink = clamp(0.5 + 1.6 * Math.cos(TAU * ph), 0, 1);
  g.globalAlpha = on * (t < cues.cursor ? 0 : blink);
  g.fillStyle = '#F2F4FF'; rr(g, P0 + 58, cy - 17, 2, 34, 1); g.fill();
  g.globalAlpha = r.a;
  const mx = c.w - P0 - 26;
  g.fillStyle = 'rgba(255,255,255,0.12)'; g.beginPath(); g.arc(mx, cy, 26, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.28)'; g.lineWidth = 1; g.beginPath(); g.arc(mx, cy, 25.5, 0, TAU); g.stroke();
  g.strokeStyle = TXT(0.95); g.lineWidth = 2; g.lineCap = 'round';
  rr(g, mx - 5, cy - 12, 10, 16, 5); g.stroke();
  g.beginPath(); g.arc(mx, cy - 1, 9, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
  g.beginPath(); g.moveTo(mx, cy + 8); g.lineTo(mx, cy + 12); g.stroke();
  g.globalAlpha = 1;
}

// v1 defect fixed: the live dot, "Listening…" and the waveform now rise WITH the card (v1 had ~0.4 s of empty glass)
function drawVoice(c, t) {
  const g = begin(c), P0 = 34;
  const r = riseA(t, cues.listening, 0.8);
  const pulse = 0.5 + 0.5 * Math.sin(TAU * t / 1.6);
  g.globalAlpha = r.a;
  const hg = g.createRadialGradient(P0 + 6, P0 + 20, 0, P0 + 6, P0 + 20, 16);
  hg.addColorStop(0, `rgba(63,224,240,${0.55 + 0.3 * pulse})`); hg.addColorStop(1, 'rgba(63,224,240,0)');
  g.fillStyle = hg; g.beginPath(); g.arc(P0 + 6, P0 + 20, 16, 0, TAU); g.fill();
  g.fillStyle = '#BFF7FF'; g.beginPath(); g.arc(P0 + 6, P0 + 20, 4.5, 0, TAU); g.fill();
  font(g, 500, 24, FONT_UI, -0.1); g.fillStyle = TXT(0.95); g.fillText(COPY.listening, P0 + 26, P0 + 28 + r.dy);
  const N = 36, x0 = P0, x1 = c.w - P0, cy = c.h / 2 + 30, step = (x1 - x0) / (N - 1), bw = 5, maxH = 92;
  const breath = 0.62 + 0.38 * Math.sin(TAU * (t - 1.2) / 2.4);
  for (let i = 0; i < N; i++) {
    const x = x0 + i * step, u = (i - (N - 1) / 2) / ((N - 1) / 2);
    const on = seg(t, c.tin + 0.3 + Math.abs(u) * 0.4, c.tin + 0.9 + Math.abs(u) * 0.4);
    if (on <= 0) continue;
    const shape = Math.exp(-u * u * 2.2) * 0.85 + 0.15;
    const wob = 0.55 + 0.45 * Math.sin(i * 0.9 + t * 3.1) * Math.sin(i * 0.37 - t * 1.7 + 1.3);
    const h = Math.max(4, maxH * on * shape * breath * (0.35 + 0.65 * wob));
    const gr = g.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
    gr.addColorStop(0, 'rgba(150,236,255,0.95)'); gr.addColorStop(0.5, 'rgba(242,244,255,0.98)'); gr.addColorStop(1, 'rgba(170,150,255,0.95)');
    g.globalAlpha = on * (0.55 + 0.45 * shape);
    g.fillStyle = gr; rr(g, x - bw / 2, cy - h / 2, bw, h, bw / 2); g.fill();
  }
  g.globalAlpha = 1;
}

const USER_W = Math.ceil(measure(400, 26, COPY.user, FONT_UI, -0.2)) + 64;
function drawBubble(c, t) {
  const g = begin(c);
  const r = riseA(t, c.tin + 0.3, 0.8);
  g.globalAlpha = r.a; font(g, 400, 26, FONT_UI, -0.2); g.fillStyle = TXT(0.97);
  g.fillText(COPY.user, 32, c.h / 2 + 9 + r.dy);
  g.globalAlpha = 1;
}

const RP = { P0: 38, Y0: 128, LH: 58, tx: 68 };
function drawReply(c, t) {
  const g = begin(c), P0 = RP.P0;
  const hr = riseA(t, c.tin + 0.3, 0.8);
  g.globalAlpha = hr.a; orb(g, P0 + 16, P0 + 16 + hr.dy, 16, t);
  const think = seg(t, c.tin + 0.45, c.tin + 0.75) * (1 - seg(t, cues.lines[0] - 0.1, cues.lines[2] + 0.4));
  if (think > 0.001) {
    g.globalAlpha = think * 0.9;
    for (let i = 0; i < 3; i++) { const ph = 0.5 + 0.5 * Math.sin(TAU * (t * 1.1) - i * 0.9); g.fillStyle = TXT(0.3 + 0.5 * ph); g.beginPath(); g.arc(P0 + 52 + i * 14, P0 + 16, 3.2, 0, TAU); g.fill(); }
  }
  COPY.reply.forEach((line, i) => {
    const r = riseA(t, cues.lines[i] - 0.04, 0.75);
    if (r.a <= 0) return;
    const y = RP.Y0 + i * RP.LH + r.dy;
    g.globalAlpha = r.a;
    const mg = g.createLinearGradient(P0, y - 16, P0 + 10, y - 4);
    mg.addColorStop(0, '#9C86FF'); mg.addColorStop(1, '#3FE0F0');
    g.fillStyle = mg; g.beginPath(); g.arc(P0 + 6, y - 9, 5, 0, TAU); g.fill();
    font(g, 400, 28, FONT_UI, -0.25); g.fillStyle = TXT(0.96); g.fillText(line, P0 + 30, y);
  });
  g.globalAlpha = 1;
}

const TOG = { w: 66, h: 38 };
function drawToggles(c, t) {
  const g = begin(c), P0 = 34;
  const hr = riseA(t, c.tin + 0.3, 0.85);
  [[COPY.t1, cues.toggles[0], 50], [COPY.t2, cues.toggles[1], 134]].forEach(([label, tt, yc]) => {
    g.globalAlpha = hr.a;
    const dy = hr.dy;
    font(g, 500, 25, FONT_UI, -0.2); g.fillStyle = TXT(0.95); g.fillText(label, P0, yc + 9 + dy);
    const p = eSine(inv(tt, tt + 0.34, t));
    const tx = c.w - P0 - TOG.w, ty = yc - TOG.h / 2 + dy;
    rr(g, tx, ty, TOG.w, TOG.h, TOG.h / 2); g.fillStyle = 'rgba(255,255,255,0.14)'; g.fill();
    if (p > 0) {
      g.save(); g.globalAlpha = hr.a * p;
      const gr = g.createLinearGradient(tx, 0, tx + TOG.w, 0); gr.addColorStop(0, '#7B5CFF'); gr.addColorStop(1, '#3FE0F0');
      rr(g, tx, ty, TOG.w, TOG.h, TOG.h / 2); g.fillStyle = gr; g.fill(); g.restore();
    }
    rr(g, tx + 0.5, ty + 0.5, TOG.w - 1, TOG.h - 1, TOG.h / 2); g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 1; g.stroke();
    const kr = TOG.h / 2 - 4, kx = tx + TOG.h / 2 + p * (TOG.w - TOG.h), stretch = 1 + 0.16 * Math.sin(Math.PI * p);
    g.save(); g.translate(kx, ty + TOG.h / 2); g.scale(stretch, 1);
    g.shadowColor = 'rgba(8,5,40,0.35)'; g.shadowBlur = 6; g.shadowOffsetY = 1.5;
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(0, 0, kr, 0, TAU); g.fill(); g.restore();
    const sa = hr.a * eSine(inv(tt + 0.08, tt + 0.5, t));
    if (sa > 0) {
      font(g, 500, 20, FONT_UI, 0); const ow = g.measureText(COPY.on).width;
      const ox = tx - 18 - ow;
      g.globalAlpha = sa; g.fillStyle = TXT(0.62); g.fillText(COPY.on, ox, yc + 7 + dy);
      const dg = g.createRadialGradient(ox - 14, yc + dy, 0, ox - 14, yc + dy, 10);
      dg.addColorStop(0, 'rgba(63,224,240,0.7)'); dg.addColorStop(1, 'rgba(63,224,240,0)');
      g.fillStyle = dg; g.beginPath(); g.arc(ox - 14, yc + dy, 10, 0, TAU); g.fill();
      g.fillStyle = '#9FF3FF'; g.beginPath(); g.arc(ox - 14, yc + dy, 4, 0, TAU); g.fill();
    }
  });
  g.globalAlpha = hr.a; g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(P0, c.h / 2 + hr.dy, c.w - 2 * P0, 1);
  g.globalAlpha = 1;
}

const NOTIF_TW = measure(600, 22, COPY.notifA, FONT_UI, 0.2) + measure(400, 22, COPY.notifB, FONT_UI, 0);
const NOTIF_W = Math.ceil(22 + 34 + 16 + NOTIF_TW + 30);
function drawNotif(c, t) {
  const g = begin(c), cy = c.h / 2;
  const r = riseA(t, c.tin + 0.2, 0.8);
  g.globalAlpha = r.a;
  orb(g, 22 + 17, cy, 17, t);
  font(g, 600, 22, FONT_UI, 0.2); g.fillStyle = TXT(0.97); g.fillText(COPY.notifA, 22 + 34 + 16, cy + 8 + r.dy * 0.5);
  const aw = g.measureText(COPY.notifA).width;
  font(g, 400, 22, FONT_UI, 0); g.fillStyle = TXT(0.8); g.fillText(COPY.notifB, 22 + 34 + 16 + aw, cy + 8 + r.dy * 0.5);
  g.globalAlpha = 1;
}

// ------------------------------------------------------------------ cards: v1 positions / sizes / depths / entrance order
function makeCard(def) { const cv = document.createElement('canvas'); cv.width = def.w * S; cv.height = def.h * S; return { fill: 0.07, ...def, W: def.w, H: def.h, k: 1, cv, g: cv.getContext('2d'), tex: canvasTex(true) }; }
const RIGHT_EDGE = 1620;
const CARDS = [
  makeCard({ id: 'input', w: 640, h: 124, r: 32, base: [600, 382, 40], rot: [3, 7, 0], tin: cues.input_in, tland: cues.input_land, draw: drawInput, ph: 0.0, out: [6.95, 7.4] }),
  makeCard({ id: 'voice', w: 520, h: 250, r: 34, base: [566, 660, -60], rot: [-2, 8, 0], tin: cues.voice_in, tland: cues.voice_land, draw: drawVoice, ph: 1.3, out: [6.8, 7.25] }),
  makeCard({ id: 'bubble', w: USER_W, h: 78, r: 39, base: [RIGHT_EDGE - USER_W / 2, 302, 70], rot: [2, -7, 0], tin: cues.bubble_in, tland: cues.bubble, draw: drawBubble, ph: 2.1, fill: 0.11, out: [6.85, 7.3] }),
  makeCard({ id: 'reply', w: 600, h: 290, r: 34, base: [1320, 540, 0], rot: [1, -7, 0], tin: cues.reply_in, tland: cues.reply_land, draw: drawReply, ph: 2.9, out: [7.12, 7.6] }),
  makeCard({ id: 'toggles', w: 560, h: 184, r: 32, base: [1300, 812, -70], rot: [-3, -6, 0], tin: cues.toggles_in, tland: cues.toggles_land, draw: drawToggles, ph: 3.7, out: [7.0, 7.45] }),
  makeCard({ id: 'notif', w: NOTIF_W, h: 68, r: 34, base: [960, 160, 110], rot: [0, 0, 0], tin: cues.notif[0], tland: cues.notif[1], draw: drawNotif, ph: 4.4, out: [6.75, 7.2], fromTop: true }),
];
const CARD = Object.fromEntries(CARDS.map((c) => [c.id, c]));

function cardState(c, t) {
  const dur = c.tland - c.tin;
  const k = inv(c.tin, c.tland, t), e = eSine(k);
  const tau = Math.max(0, t - c.tland);
  const settle = 1.6 * Math.exp(-2.4 * tau) * Math.sin(2.6 * tau);
  const fl = [Math.sin(TAU * t / 5.6 + c.ph) * 4, Math.sin(TAU * t / 6.4 + c.ph * 1.3) * 0.7, Math.sin(TAU * t / 7.3 + c.ph * 0.7) * 0.9];
  let x = c.base[0], y = c.base[1], z = c.base[2], rx = c.rot[0], ry = c.rot[1];
  if (c.fromTop) { y = lerp(c.base[1] - 30, c.base[1], e); z += 240 * (1 - e); rx += 10 * (1 - e); }
  else { y += 64 * (1 - e); z += 420 * (1 - e); rx += 16 * (1 - e) + settle; ry += (c.rot[1] > 0 ? -6 : 6) * (1 - e); }
  y += fl[0] * e; rx += fl[1]; ry += fl[2];
  // v5 exit: inside the frame - the pane recedes into depth, tips back, defocuses and fades on an ease-in (0.45 s)
  const ko = inv(c.out[0], c.out[1], t), eo = Math.pow(ko, 2.2);
  z += 360 * eo; rx += 6 * eo;
  const yaw = lerp(5, 0, eSine(inv(-1, 6.5, t))) - 2 * eSine(inv(6.5, 10.5, t));
  const pitch = lerp(-3, 0, eSine(inv(-1, 6.5, t)));
  {
    const cyw = Math.cos(yaw * D2R), syw = Math.sin(yaw * D2R), cp = Math.cos(pitch * D2R), sp = Math.sin(pitch * D2R);
    const ddx = x - 960, ddy = y - 540, ddz = z - 80;
    const nx = cyw * ddx + syw * ddz; let nz = -syw * ddx + cyw * ddz;
    const ny = cp * ddy - sp * nz; nz = sp * ddy + cp * nz;
    x = 960 + nx; y = 540 + ny; z = 80 + nz; ry += yaw; rx -= pitch;
  }
  const opIn = c.fromTop ? eSine(inv(c.tin, c.tin + 0.55, t)) : c.id === 'input' ? eSine(inv(c.tin + 0.05 * dur, c.tin + 0.5 * dur, t)) : eSine(inv(c.tin + 0.12 * dur, c.tin + 0.62 * dur, t));
  const op = opIn * (1 - eo);
  const lod = 2.6 * Math.pow(1 - eOutSine(k), 2) + 3.0 * eo;
  const defocus = 0.5 + 9 * Math.pow(1 - e, 2) + 12 * eo;
  const R = rotM(rx, ry, 0);
  const kc = inv(cues.sweep[0], cues.sweep[1], t);
  const catchL = c.id === 'input' && kc > 0 && kc < 1 ? [lerp(-0.08, 0.78, eSine(kc)), 1.15 * Math.sin(Math.PI * kc)] : [0, 0];
  const sheen = -0.8 + 1.0 * inv(-1, 10, t) + (rx - c.rot[0]) * 0.07 + (ry - c.rot[1]) * 0.06;
  return { C: [x, y, z], ...R, op, lod, far: 0, defocus, catchL, sheen, eo };
}
function project(P, O) { const d = P[2] - O[2]; return [960 + F * (P[0] - O[0]) / d, 540 + F * (P[1] - O[1]) / d]; }
function cardPoint(c, s, lx, ly, O) {
  const u = (lx - c.W / 2) * c.k, v = (ly - c.H / 2) * c.k;
  return project([0, 1, 2].map((i) => s.C[i] + s.U[i] * u + s.V[i] * v), O);
}
const ptAt = (id, lx, ly, t) => cardPoint(CARD[id], cardState(CARD[id], t), lx, ly, camO(camera(t)));
const orbAt = (t) => ptAt('input', IN.orbX, CARD.input.h / 2, t);

// ------------------------------------------------------------------ end lockup (v4): logo (lens) + wordmark + tagline
const LOGO = { x: 960, y: q('logoy', 404), r: q('logor', 72) };
const WORD = { size: q('wsize', 140), weight: 300, track: q('wtrack', -1), base: q('wbase', 628) };
const TAG = { size: 30, weight: 500, track: 1.8, base: q('tbase', 696) };
const wordCv = document.createElement('canvas'); wordCv.width = RW; wordCv.height = RH;
const wg = wordCv.getContext('2d');
const wordTex = canvasTex(false);
const WORD_W = measure(WORD.weight, WORD.size, COPY.word, FONT_WORD, WORD.track) - WORD.track;
const TAG_W = measure(TAG.weight, TAG.size, COPY.tag, FONT_UI, TAG.track) - TAG.track;
function endScale(t) { return 1 + 0.02 * eSine(inv(7.6, 10.6, t)); }
function drawWord(t) {
  const g = wg; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
  if (t < cues.word - 0.05) return false;
  const s = endScale(t);
  g.setTransform(DPR * s, 0, 0, DPR * s, DPR * 960 * (1 - s), DPR * 540 * (1 - s));
  g.textBaseline = 'alphabetic';
  const kw = inv(cues.word, cues.word + 0.85, t);
  g.globalAlpha = eSine(kw); font(g, WORD.weight, WORD.size, FONT_WORD, WORD.track); g.fillStyle = '#F4F5FF';
  g.fillText(COPY.word, 960 - WORD_W / 2, WORD.base + 14 * (1 - eOutCubic(kw)));
  const kt = inv(cues.tagline, cues.tagline + 0.75, t);
  if (kt > 0) {
    font(g, TAG.weight, TAG.size, FONT_UI, TAG.track);
    g.globalAlpha = eSine(kt) * 0.9; g.shadowColor = 'rgba(6,5,24,0.55)'; g.shadowBlur = 18 * DPR;
    g.fillStyle = TXT(0.92); g.fillText(COPY.tag, 960 - TAG_W / 2, TAG.base + 8 * (1 - eOutCubic(kt)));
    g.shadowBlur = 0; g.shadowColor = 'rgba(0,0,0,0)';
    g.globalAlpha = eSine(kt); g.fillText(COPY.tag, 960 - TAG_W / 2, TAG.base + 8 * (1 - eOutCubic(kt)));
  }
  g.globalAlpha = 1; g.letterSpacing = '0px';
  return true;
}

// ------------------------------------------------------------------ liquid-glass lens (v5)
// 5.20 the input orb swells; 5.50 a bright drop of light detaches and grows (ease-out) while it slides over
// "Ask Oriel anything" (5.95) -> crosses to the reply card and glides over its three lines (6.65) ->
// 6.95-7.80 contracts slowly to the logo, merge 7.70 (+15 % refraction, damped wobble) -> wordmark 7.75, tagline 8.0.
function cubicBezier(x1, y1, x2, y2) {
  const bx = (u) => 3 * x1 * u * (1 - u) ** 2 + 3 * x2 * u * u * (1 - u) + u ** 3;
  const by = (u) => 3 * y1 * u * (1 - u) ** 2 + 3 * y2 * u * u * (1 - u) + u ** 3;
  return (x) => { x = clamp(x); let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (bx(m) < x) lo = m; else hi = m; } return by((lo + hi) / 2); };
}
const eLiquid = cubicBezier(0.16, 1, 0.3, 1);
const DET = [16, -6];
const ORB_LB = orbAt(LB);
const T1 = cues.lens_text1, T2 = cues.lens_text2;
const ASK_C = ptAt('input', IN.textX + ASK_W * 0.5, CARD.input.h / 2 - 2, T1);
const REPLY_MID = (lx, t) => ptAt('reply', lx, RP.Y0 + RP.LH - 9, t);
const R_IN = REPLY_MID(150, T2 - 0.2), R_MID = REPLY_MID(255, T2), R_OUT = REPLY_MID(330, CK);
const passPath = hermite([
  { t: LB, v: [ORB_LB[0] + DET[0], ORB_LB[1] + DET[1]], m: [150, 0] },
  { t: T1, v: ASK_C, m: [260, 8] },
  { t: 6.3, v: [lerp(ASK_C[0], R_IN[0], 0.55), lerp(ASK_C[1], R_IN[1], 0.5)] },
  { t: T2 - 0.2, v: R_IN },
  { t: T2, v: R_MID },
  { t: CK, v: R_OUT, m: [150, -6] },
]);
const contractK = (t) => { const u = inv(CK, ST, t); return 0.15 * eLiquid(u) + 0.85 * eSine(u); };
function lensCentre(t) {
  if (t < LB) { const o = orbAt(t), k = eSine(inv(BULGE, LB, t)); return [o[0] + DET[0] * k, o[1] + DET[1] * k]; }
  if (t <= CK) return passPath(t);
  const k = contractK(t), p0 = passPath(CK);
  return [lerp(p0[0], LOGO.x, k), lerp(p0[1], LOGO.y, k) - 50 * Math.sin(Math.PI * k) * (1 - k)];
}
const LENS_HX = q('lhx', 160), LENS_HY = q('lhy', 136);
function lensSize(t) {
  if (t < LB) { const r = lerp(21, 46, eOutSine(inv(BULGE, LB, t))); return [r, r]; }
  const gr = eOutCubic(inv(LB, LB + 0.5, t));
  let hx = lerp(46, LENS_HX, gr), hy = lerp(46, LENS_HY, gr);
  if (t > CK) { const k = contractK(t); hx = lerp(hx, LOGO.r, k); hy = lerp(hy, LOGO.r, k); }
  return [hx, hy];
}
function lensSpring(t) {
  const dt = 1 / 240, w = TAU * 2.1, z = 0.34, K = 0.00009;
  let x = 0, v = 0, dir = [1, 0], prev = lensCentre(BULGE);
  const n = Math.floor((t - BULGE) / dt);
  for (let i = 1; i <= n; i++) {
    const p = lensCentre(BULGE + i * dt);
    const vx = (p[0] - prev[0]) / dt, vy = (p[1] - prev[1]) / dt, sp = Math.hypot(vx, vy);
    if (sp > 40) dir = [vx / sp, vy / sp];
    const target = Math.min(0.22, K * sp);
    v += (w * w * (target - x) - 2 * z * w * v) * dt; x += v * dt; prev = p;
  }
  return { x, dir };
}
const lensMag = keysS([[BULGE, 1.55], [CK, 1.55], [ST, 1.32]]);
const lensIris = keysS([[BULGE, 0.62], [LB + 0.9, 0.22], [CK, 0.22], [ST + 0.15, 0.62], [10, 0.66]]);
function lensState(t) {
  if (t < BULGE) return { on: 0 };
  const on = seg(t, BULGE, BULGE + 0.08);
  const c = lensCentre(t);
  let [hx, hy] = lensSize(t);
  const tau = Math.max(0, t - MERGE);
  const wob = t > MERGE ? 0.035 * Math.exp(-5.2 * tau) * Math.sin(10.5 * tau) : 0;
  hx *= 1 + wob; hy *= 1 - wob;
  const s = endScale(t);
  const breathK = seg(t, ST + 0.15, ST + 0.9);
  const br = 1 + 0.016 * Math.sin(TAU * (t - ST - 0.3) / 2.4) * breathK;
  hx *= br; hy *= br;
  if (t > ST - 0.4) { c[0] = 960 + (c[0] - 960) * s; c[1] = 540 + (c[1] - 540) * s; hx *= s; hy *= s; }
  c[1] += 1.5 * Math.sin(TAU * (t - ST) / 3.1) * seg(t, ST + 0.2, ST + 1.0);
  const sp = lensSpring(t), a = 1 + sp.x, b = 1 / Math.sqrt(Math.max(0.5, 1 + sp.x)), [ux, uy] = sp.dir;
  const St = [a * ux * ux + b * uy * uy, (a - b) * ux * uy, (a - b) * ux * uy, a * uy * uy + b * ux * ux];
  const StI = [ux * ux / a + uy * uy / b, (1 / a - 1 / b) * ux * uy, (1 / a - 1 / b) * ux * uy, uy * uy / a + ux * ux / b];
  const mb = Math.exp(-Math.pow((t - MERGE - 0.06) / 0.14, 2));
  const lift = 1 - 0.7 * seg(t, CK + 0.3, ST);
  const glint = t < ST ? lerp(-1.8, 1.8, inv(LB + 0.2, CK + 0.4, t)) : lerp(-1.8, 1.8, inv(8.6, 9.6, t));
  const disp = 1 + 0.45 * Math.sin(TAU * (t - ST - 0.6) / 2.8) * seg(t, ST + 0.3, ST + 1.2);
  const iris = lensIris(t) + 0.08 * Math.sin(TAU * (t - ST) / 2.8) * seg(t, ST + 0.3, ST + 1.2);
  return { on, c, hx, hy, r: Math.min(hx, hy), mag: lensMag(t), str: on * (1 + 0.15 * mb), iris, lift, glint, disp,
    rimGlow: t < LB + 0.9 ? lerp(2.2, 1, seg(t, LB, LB + 0.8)) : lerp(1, 1.8, seg(t, CK + 0.3, ST)), St, StI, stMin: Math.min(a, b),
    halo: seg(t, BULGE, BULGE + 0.12) * (1 - seg(t, LB + 0.05, LB + 0.55)),
    bright: 0.85 * (1 - seg(t, LB + 0.2, LB + 0.75)), stretch: sp.x };
}
// one light sweep, right -> left across the panes (lights them in depth order)
function sweepAt(t) {
  const k = inv(cues.glass_sweep[0], cues.glass_sweep[1], t);
  if (k <= 0 || k >= 1) return [0, 0, 1];
  const nl = Math.hypot(1, 0.3), n = [1 / nl, 0.3 / nl];
  const a = 2100 * n[0] + 520 * n[1], b = 140 * n[0] + 262 * n[1];
  return [lerp(a, b, eSine(k)), Math.sin(Math.PI * Math.min(1, k * 1.25)) * 0.9, 110];
}

// ------------------------------------------------------------------ render
window.DEMO = { width: W, height: H, fps: FPS, duration: 10, motionBlur: { samples: q('mb', 1), shutter: 0.5 } };
window.renderAt = async (t) => {
  const frame = Math.round(t * FPS * 4);
  const cam = camera(t), O = camO(cam);
  const lens = lensState(t);
  const states = CARDS.map((c) => ({ c, s: cardState(c, t) }));
  const sw = sweepAt(t);

  let L = use(P.aurora, T.scene);
  gl.uniform1f(L.uT, t);
  const blobs = new Float32Array(16), sig = new Float32Array(4), cols = new Float32Array(12);
  BLOBS.forEach((b, i) => { const p = b.path(t); blobs.set([p[0] - cam.x * 0.3, p[1] - cam.y * 0.3, b.R, b.i], i * 4); sig[i] = b.sig; cols.set(hex(b.col), i * 3); });
  gl.uniform4fv(L.uBlob, blobs); gl.uniform1fv(L.uSig, sig); gl.uniform3fv(L.uBlobC, cols);
  gl.uniform3fv(L.uBase, hex(PAL.base)); gl.uniform1f(L.uGain, gainK(t)); gl.uniform1f(L.uWarp, 110);
  gl.uniform4f(L.uPool, 960, 560, 380, 200); gl.uniform1f(L.uPoolK, 0.5 * seg(t, 7.2, 8.3));
  gl.uniform3fv(L.uCamO, O); gl.uniform1f(L.uF, F);
  const SC = [], SU = [], SV = [], SN = [], SH = [];
  states.forEach(({ c, s }) => { SC.push(...s.C); SU.push(...s.U); SV.push(...s.V); SN.push(...s.N); SH.push(c.w / 2, c.h / 2, c.r, s.op); });
  gl.uniform3fv(L.uSC, SC); gl.uniform3fv(L.uSU, SU); gl.uniform3fv(L.uSV, SV); gl.uniform3fv(L.uSN, SN); gl.uniform4fv(L.uSH, SH);
  draw();

  if (drawWord(t)) {
    upload(wordTex, wordCv, false);
    L = use(P.over, T.scene); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    bindTex(0, wordTex, L.uTex); gl.uniform1f(L.uA, 1); draw(); gl.disable(gl.BLEND);
  }

  const order = states.filter(({ s }) => s.op > 0.002).sort((a, b) => b.s.C[2] - a.s.C[2]);
  for (const { c, s } of order) {
    c.draw(c, t); upload(c.tex, c.cv, true);
    blurInto(T.scene, T.qB, TAPS_FROST);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, T.scene.fb); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, T.sharp.fb);
    gl.blitFramebuffer(0, 0, RW, RH, 0, 0, RW, RH, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    L = use(P.card, T.scene);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform3fv(L.uCamO, O); gl.uniform1f(L.uF, F);
    gl.uniform3fv(L.uC, s.C); gl.uniform3fv(L.uU, s.U); gl.uniform3fv(L.uV, s.V); gl.uniform3fv(L.uN, s.N);
    gl.uniform2f(L.uHalf, c.w / 2, c.h / 2); gl.uniform1f(L.uRad, c.r);
    gl.uniform1f(L.uOpacity, s.op); gl.uniform1f(L.uDefocus, s.defocus); gl.uniform1f(L.uContentA, 1); gl.uniform1f(L.uLod, s.lod - 0.4);
    gl.uniform1f(L.uFill, c.fill); gl.uniform1f(L.uStroke, 0.40); gl.uniform1f(L.uSeed, CARDS.indexOf(c) + 1); gl.uniform1f(L.uDepthDim, 0.10 * s.far);
    gl.uniform2f(L.uLight, -0.55, -0.83); gl.uniform1f(L.uSheen, s.sheen); gl.uniform2f(L.uCatch, s.catchL[0], s.catchL[1]);
    gl.uniform3f(L.uSweep, sw[0], sw[1], sw[2]); gl.uniform1f(L.uSweepOff, (s.C[2] - 40) * 0.45); gl.uniform1f(L.uChroma, q('chroma', 0.75));
    bindTex(0, T.qB.tex, L.uBlurTex); bindTex(1, c.tex, L.uContent); bindTex(2, T.sharp.tex, L.uSharp);
    draw();
    gl.disable(gl.BLEND);
  }

  blurInto(T.scene, T.qL, TAPS_LENS);
  L = use(P.lens, T.lens);
  bindTex(0, T.scene.tex, L.uScene); bindTex(1, T.qL.tex, L.uBlur);
  gl.uniform1f(L.uOn, lens.on || 0);
  if (lens.on > 0) {
    gl.uniform2f(L.uLC, lens.c[0], lens.c[1]); gl.uniform2f(L.uLH, lens.hx, lens.hy); gl.uniform1f(L.uLR, lens.r);
    gl.uniform1f(L.uMag, lens.mag); gl.uniform1f(L.uEdge, q('edge', 0.14)); gl.uniform1f(L.uDisp, q('disp', 1.0) * lens.disp); gl.uniform1f(L.uStr, lens.str);
    gl.uniform1f(L.uLift, lens.lift); gl.uniform1f(L.uGlint, lens.glint); gl.uniform1f(L.uIris, lens.iris); gl.uniform1f(L.uIrisRot, t * 0.55);
    gl.uniform1f(L.uRimGlow, lens.rimGlow); gl.uniform1f(L.uFres, 0.6);
    gl.uniformMatrix2fv(L.uSt, false, lens.St); gl.uniformMatrix2fv(L.uStI, false, lens.StI); gl.uniform1f(L.uStMin, lens.stMin);
    gl.uniform1f(L.uHalo, lens.halo); gl.uniform1f(L.uBright, lens.bright);
    gl.uniform3f(L.uLight3, -0.5, -0.78, 0.62);
  }
  draw();

  blurInto(T.lens, T.qB, TAPS_BLOOM, 0.62);
  L = use(P.final, null);
  bindTex(0, T.lens.tex, L.uSrc); bindTex(1, T.qB.tex, L.uBloom); bindTex(2, grainTex, L.uGrain);
  gl.uniform1f(L.uBloomAmt, 0.2); gl.uniform1f(L.uGrainAmt, q('grain', 0.16)); gl.uniform1f(L.uFrame, frame); gl.uniform1f(L.uVig, 0.2);
  gl.uniform1f(L.uDither, q('dither', 0.012)); gl.uniform1f(L.uDarkGrain, q('dgrain', 0.022));
  draw();
  gl.finish();
};

// ------------------------------------------------------------------ geometry audit (every frame): overlaps, safe margins, lens edge distance
function audit() {
  const out = { pairMinGap: {}, edgeMin: { card: 1e9, cardAt: null, cardV: 1e9, cardVAt: null, lens: 1e9, lensAt: null }, overlaps: [], wordDirty: [], boxes55: {} };
  for (let f = 0; f < 300; f++) {
    const t = f / FPS, O = camO(camera(t));
    const boxes = [];
    for (const c of CARDS) {
      const s = cardState(c, t);
      if (s.op <= 0.02) continue;
      const pts = [[0, 0], [c.W, 0], [c.W, c.H], [0, c.H]].map(([x, y]) => cardPoint(c, s, x, y, O));
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const b = { id: c.id, op: s.op, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
      boxes.push(b);
      if (f === 165) out.boxes55[c.id] = [b.x0, b.y0, b.x1, b.y1].map((v) => +v.toFixed(0));
      const e = Math.min(b.x0, 1920 - b.x1, b.y0, 1080 - b.y1);
      if (e < out.edgeMin.card) { out.edgeMin.card = e; out.edgeMin.cardAt = [t.toFixed(2), c.id, b.x0.toFixed(0), b.y0.toFixed(0), b.x1.toFixed(0), b.y1.toFixed(0), s.op.toFixed(2)]; }
      if (t >= cues.word && s.op > 0.002) out.wordDirty.push([t.toFixed(2), c.id]);
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const gx = Math.max(a.x0 - b.x1, b.x0 - a.x1), gy = Math.max(a.y0 - b.y1, b.y0 - a.y1);
      const gap = Math.max(gx, gy);
      const k = [a.id, b.id].sort().join('|');
      if (!(k in out.pairMinGap) || gap < out.pairMinGap[k][0]) out.pairMinGap[k] = [+gap.toFixed(1), t.toFixed(2)];
      if (gap < 0) out.overlaps.push([t.toFixed(2), k, +gap.toFixed(1), +a.op.toFixed(2), +b.op.toFixed(2)]);
    }
    const L = lensState(t);
    if (L.on > 0) {
      const ext = 1 + Math.max(0, L.stretch);
      const lx = L.hx * ext, ly = L.hy * ext;
      const e = Math.min(L.c[0] - lx, 1920 - L.c[0] - lx, L.c[1] - ly, 1080 - L.c[1] - ly);
      if (e < out.edgeMin.lens) { out.edgeMin.lens = e; out.edgeMin.lensAt = [t.toFixed(2), L.c[0].toFixed(0), L.c[1].toFixed(0), lx.toFixed(0), ly.toFixed(0)]; }
    }
  }
  out.lensKeys = { ORB_LB, ASK_C, R_IN, R_MID, R_OUT };
  return out;
}
window.linkAt = () => audit();

await window.renderAt(0);
window.__ready = true;
