// Synthesis building blocks shared by the score (score.js) and the effects (sound.js). Mono Float32Array
// at RATE; every function is deterministic given its rng, so the same source always gives the same file.
export const RATE = 48000;
export const TAU = Math.PI * 2;
export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
export const db = (x) => 20 * Math.log10(Math.max(x, 1e-9));
export const undb = (d) => Math.pow(10, d / 20);
export const N = (sec) => Math.max(1, Math.round(sec * RATE));

export function rng(seed) {
  let a = typeof seed === 'number' ? seed >>> 0 : [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIN = new Float32Array(4097);
for (let i = 0; i <= 4096; i++) SIN[i] = Math.sin((i / 4096) * TAU);
export const sinp = (phase) => { const x = (phase - Math.floor(phase)) * 4096, i = x | 0; return SIN[i] + (SIN[i + 1] - SIN[i]) * (x - i); };

export function noise(sec, r) { const n = N(sec), o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = r() * 2 - 1; return o; }

// Partials [ratio, amp, decay τ seconds]; attack in seconds. One struck/plucked note.
export function partials(f, sec, list, att = 0.004, r = null) {
  const n = N(sec), o = new Float32Array(n);
  for (const [ratio, amp, tau] of list) {
    const fr = f * ratio;
    if (fr > RATE * 0.45) continue;
    let ph = r ? r() : 0;
    const inc = fr / RATE, k = Math.exp(-1 / (tau * RATE));
    let e = amp;
    for (let i = 0; i < n; i++) { o[i] += sinp(ph) * e; ph += inc; e *= k; }
  }
  const a = N(att);
  for (let i = 0; i < Math.min(a, n); i++) o[i] *= i / a;
  const rel = Math.min(n, N(0.02));
  for (let i = 0; i < rel; i++) o[n - 1 - i] *= i / rel;
  return o;
}

// Sine whose frequency glides from f0 to f1 (exponentially) over `sec`; amplitude decays with τ.
export function glide(f0, f1, sec, tau, att = 0.002) {
  const n = N(sec), o = new Float32Array(n), a = N(att);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const u = i / n, f = f0 * Math.pow(f1 / f0, u);
    ph += f / RATE;
    o[i] = sinp(ph) * Math.exp(-i / (tau * RATE)) * (i < a ? i / a : 1);
  }
  return o;
}

// RBJ biquad, optionally with a time-varying centre (fc as a function of 0..1).
export function biquad(x, type, fc, q = 0.707) {
  const o = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, b0, b1, b2, a1, a2;
  const coef = (f) => {
    const w = (TAU * Math.min(Math.max(f, 20), RATE * 0.45)) / RATE, cs = Math.cos(w), al = Math.sin(w) / (2 * q);
    let B0, B1, B2;
    if (type === 'lp') { B0 = (1 - cs) / 2; B1 = 1 - cs; B2 = B0; }
    else if (type === 'hp') { B0 = (1 + cs) / 2; B1 = -(1 + cs); B2 = B0; }
    else { B0 = al; B1 = 0; B2 = -al; }
    const A0 = 1 + al;
    b0 = B0 / A0; b1 = B1 / A0; b2 = B2 / A0; a1 = (-2 * cs) / A0; a2 = (1 - al) / A0;
  };
  const dyn = typeof fc === 'function';
  if (!dyn) coef(fc);
  for (let i = 0; i < x.length; i++) {
    if (dyn && (i & 31) === 0) coef(fc(i / x.length));
    const y = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y; o[i] = y;
  }
  return o;
}

export const shape = (x, fn) => { for (let i = 0; i < x.length; i++) x[i] *= fn(i / x.length, i / RATE); return x; };
export const decay = (x, tau, att = 0.001) => shape(x, (u, t) => Math.exp(-t / tau) * Math.min(1, t / att));
export const mix = (...xs) => { const n = Math.max(...xs.map(([s, , at = 0]) => N(at) + s.length)), o = new Float32Array(n); for (const [s, g = 1, at = 0] of xs) { const o0 = N(at); for (let i = 0; i < s.length; i++) o[o0 + i] += s[i] * g; } return o; };
export const peakTo = (x, p) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); if (m > 0) for (let i = 0; i < x.length; i++) x[i] *= p / m; return x; };
export const drive = (x, k) => { const n = Math.tanh(k); for (let i = 0; i < x.length; i++) x[i] = Math.tanh(x[i] * k) / n; return x; };
export const reverse = (x) => x.slice().reverse();
// attack / release ramps (seconds) so a held note never clicks
export const env = (x, att, rel) => { const a = N(att), r = Math.min(x.length, N(rel)); for (let i = 0; i < Math.min(a, x.length); i++) x[i] *= i / a; for (let i = 0; i < r; i++) x[x.length - 1 - i] *= i / r; return x; };

// Band-limited oscillators (polyBLEP). wave: saw | square | pulse (duty) | tri. `bend(t)` returns a
// pitch multiplier over time (glides, vibrato, scoops).
const blep = (t, dt) => (t < dt ? (t /= dt, t + t - t * t - 1) : t > 1 - dt ? (t = (t - 1) / dt, t * t + t + t + 1) : 0);
export function osc(wave, f, sec, { duty = 0.5, bend = null, phase = 0 } = {}) {
  const n = N(sec), o = new Float32Array(n);
  let ph = phase, tri = 0;
  for (let i = 0; i < n; i++) {
    const fr = bend ? f * bend(i / RATE) : f, dt = Math.min(0.45, fr / RATE);
    if (wave === 'sine') o[i] = sinp(ph);
    else if (wave === 'saw') o[i] = 2 * ph - 1 - blep(ph, dt);
    else {
      const d = wave === 'square' || wave === 'tri' ? 0.5 : duty;
      let v = (ph < d ? 1 : -1) + blep(ph, dt) - blep((ph - d + 1) % 1, dt);
      if (wave === 'tri') { tri = dt * 4 * v + (1 - dt * 0.05) * tri; v = tri; }
      o[i] = v;
    }
    ph += dt; if (ph >= 1) ph -= 1;
  }
  return o;
}

export const vibrato = (depth = 0.006, rate = 5.5, delay = 0.25) => (t) => 1 + (t > delay ? depth * Math.min(1, (t - delay) / 0.3) * Math.sin(TAU * rate * t) : 0);
export const scoop = (cents = -40, time = 0.06) => (t) => Math.pow(2, (cents / 1200) * Math.max(0, 1 - t / time));

// Karplus–Strong string with a fractional delay, so high notes stay in tune. bright 0..1 colours the
// pluck, keep 0.97..0.999 sets how long it rings; `bend(t)` may change the pitch while it rings.
export function ks(f, sec, { bright = 0.5, keep = 0.996, bend = null } = {}, r) {
  const n = N(sec), o = new Float32Array(n);
  const P0 = RATE / f - 0.5, burst = Math.ceil(P0) + 2;
  let lp = 0;
  const a = 0.15 + 0.85 * bright;
  for (let i = 0; i < Math.min(burst, n); i++) { lp += a * ((r() * 2 - 1) - lp); o[i] = lp; }
  for (let i = burst; i < n; i++) {
    const P = bend ? RATE / (f * bend(i / RATE)) - 0.5 : P0;
    const x = i - P, j = Math.floor(x), fr = x - j;
    const s0 = o[j] + (o[j + 1] - o[j]) * fr, s1 = o[j - 1] + (o[j] - o[j - 1]) * fr;
    o[i] = keep * 0.5 * (s0 + s1);
  }
  return env(o, 0.001, 0.03);
}

// Struck piano string: slightly inharmonic partials, two strings per note (slow beating), a fast and a
// slow decay stage, a felt hammer thump. vel 0..1 also brightens.
export function piano(f, sec, vel = 0.7, r = rng(f)) {
  const n = N(sec), o = new Float32Array(n);
  const B = 0.00025 * Math.pow(f / 262, 0.5), base = 1.8 * Math.pow(262 / f, 0.45);
  for (let k = 1; k <= 10; k++) {
    const fk = f * k * Math.sqrt(1 + B * k * k);
    if (fk > Math.min(RATE * 0.45, 2500 + 5000 * vel)) break;
    const amp = Math.pow(k, -(2.6 - 0.9 * vel)) * (k === 2 ? 1.3 : 1), tau = base / Math.pow(k, 1.1);
    for (const det of [-0.0004, 0.0004]) {
      let ph = r(); const inc = (fk * (1 + det)) / RATE;
      const k1 = Math.exp(-1 / (tau * 0.22 * RATE)), k2 = Math.exp(-1 / (tau * 2.2 * RATE));
      let e1 = amp * 0.6, e2 = amp * 0.4;
      for (let i = 0; i < n; i++) { o[i] += sinp(ph) * (e1 + e2) * 0.5; ph += inc; e1 *= k1; e2 *= k2; }
    }
  }
  const thump = decay(biquad(noise(0.03, r), 'lp', 900 + 1800 * vel), 0.008);
  for (let i = 0; i < thump.length && i < n; i++) o[i] += thump[i] * 0.25 * vel;
  return env(o, 0.002, 0.15);
}

// Rhodes-like FM electric piano; `trem` adds the classic stereo-tremolo wobble in amplitude.
export function rhodes(f, sec, vel = 0.7, trem = 0) {
  const n = N(sec), o = new Float32Array(n);
  let pc = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE, I = (0.6 + 1.6 * vel) * Math.exp(-t / 0.3);
    pc += f / RATE;
    o[i] = (sinp(pc + I * sinp(pc) / TAU) + 0.12 * sinp(2 * pc)) * Math.exp(-t / 1.4) * Math.min(1, t / 0.003) * (1 - trem * 0.5 * (1 - Math.cos(TAU * 4.5 * t)));
  }
  return env(o, 0.003, 0.12);
}

// Detuned saw ensemble through a low-pass: strings (slow attack), stabs (fast), pads.
export function ensemble(f, sec, { voices = 5, spread = 0.008, cutoff = 2200, att = 0.25, rel = 0.4, wave = 'saw' } = {}, r = rng(f)) {
  const n = N(sec), o = new Float32Array(n);
  for (let v = 0; v < voices; v++) {
    const d = voices === 1 ? 0 : (v / (voices - 1) - 0.5) * 2 * spread;
    const s = osc(wave, f * (1 + d), sec, { phase: r() });
    for (let i = 0; i < n; i++) o[i] += s[i] / voices;
  }
  const y = biquad(o, 'lp', typeof cutoff === 'function' ? cutoff : cutoff, 0.8);
  return env(y, att, Math.min(rel, sec / 2));
}

// Filtered synth voice with a filter envelope: cutoff opens from `lo` to `hi` and closes over `close` s.
export function synth(f, sec, { wave = 'saw', duty = 0.5, lo = 300, hi = 3000, close = 0.25, q = 1.2, att = 0.004, rel = 0.05, bend = null } = {}) {
  const s = osc(wave, f, sec, { duty, bend });
  const y = biquad(s, 'lp', (u) => lo + (hi - lo) * Math.exp(-(u * sec) / close), q);
  return env(y, att, Math.min(rel, sec / 2));
}

// 808: a sine that falls into its pitch, saturated so it reads on phone speakers. `from` = previous
// note's frequency for a slide.
export function sub808(f, sec, { from = null, slide = 0.08, punch = 2.2, tau = 0.9, sat = 2.2 } = {}) {
  const n = N(sec), o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const target = from ? from * Math.pow(f / from, Math.min(1, t / slide)) : f;
    const fr = target * (1 + (punch - 1) * Math.exp(-t / 0.012));
    ph += fr / RATE;
    o[i] = sinp(ph) * Math.exp(-t / tau);
  }
  return env(drive(o, sat), 0.002, 0.06);
}

// Flute / dizi: sine with a touch of 2nd and 3rd, breath noise, scoop into the note and delayed vibrato.
export function flute(f, sec, { breath = 0.12, vib = 0.007 } = {}, r = rng(f)) {
  const v = vibrato(vib, 5.6, 0.22), sc = scoop(-35, 0.07), b = (t) => v(t) * sc(t);
  const s = osc('sine', f, sec, { bend: b }), s2 = osc('sine', 2 * f, sec, { bend: b }), s3 = osc('sine', 3 * f, sec, { bend: b });
  const br = biquad(noise(sec, r), 'bp', 2 * f, 1.5);
  const n = s.length, o = new Float32Array(n);
  for (let i = 0; i < n; i++) o[i] = s[i] + 0.22 * s2[i] + 0.06 * s3[i] + breath * br[i] * 3;
  return env(o, 0.06, 0.12);
}

// TR-808-style metal: six square waves (the original's frequencies) high-passed — hats and cymbals.
export function metal(sec, tau, hp = 7000) {
  const fs = [205.3, 304.4, 369.6, 522.7, 540, 800], n = N(sec), o = new Float32Array(n);
  for (const f of fs) { const s = osc('square', f, sec); for (let i = 0; i < n; i++) o[i] += s[i] / 6; }
  return decay(biquad(biquad(o, 'hp', hp), 'hp', hp), tau);
}

// Schroeder reverb (4 combs + 2 allpasses per side); size stretches the room, wet is mixed back in.
export function reverb(L, R, wet = 0.1, size = 1) {
  const fb = Math.min(0.9, 0.78 + 0.06 * (size - 1));
  const run = (x, combs, aps) => {
    const y = new Float32Array(x.length);
    for (const d of combs) { const buf = new Float32Array(d); let k = 0, lp = 0; for (let i = 0; i < x.length; i++) { const v = buf[k]; lp = v * 0.75 + lp * 0.25; buf[k] = x[i] + lp * fb; y[i] += v; k = (k + 1) % d; } }
    for (const d of aps) { const buf = new Float32Array(d); let k = 0; for (let i = 0; i < y.length; i++) { const v = buf[k], u = y[i] + v * 0.5; buf[k] = u; y[i] = v - u * 0.5; k = (k + 1) % d; } }
    return y;
  };
  const s = (RATE / 44100) * size;
  const l = run(L, [1116, 1188, 1277, 1356].map((d) => Math.round(d * s)), [556, 441].map((d) => Math.round(d * (RATE / 44100))));
  const r = run(R, [1139, 1211, 1300, 1379].map((d) => Math.round(d * s)), [579, 464].map((d) => Math.round(d * (RATE / 44100))));
  for (let i = 0; i < L.length; i++) { L[i] += l[i] * wet * 0.5; R[i] += r[i] * wet * 0.5; }
}
