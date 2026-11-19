// Mix-engineer effects for the synthesized score: FDN reverb, synced delay, chorus, parametric EQ, tape-style
// saturation, M/S widening, bus glue compressor, transient shaper, plus per-instrument channel chains.
// Everything works on Float32Array at RATE and runs IN PLACE (the arrays you pass are the arrays you get
// back, so pass .slice() if you still need the dry signal). All are deterministic: no Math.random.
// "wet" on the time-based effects (plate, delay) is a send level ADDED to the untouched dry signal;
// chorus uses a classic dry/wet `mix`, saturate/widen/glue are inserts.
import { RATE, TAU, sinp, undb } from './dsp.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
// Mutually-prime delay lengths are what keeps an FDN from ringing at common multiples.
const nextPrime = (n) => { while (!isPrime(n)) n++; return n; };
const pow2 = (n) => { let p = 1; while (p < n) p <<= 1; return p; };
const sameFirst = (L, R) => { if (!R || R === L) return L.slice(); return R; };

// ---------- biquad (RBJ) ----------
// Coefficients are doubles; filter state is double too so 35 Hz highpasses at 48 kHz don't smear.
export function biquadCoefs(type, f, gain = 0, q = Math.SQRT1_2, fs = RATE) {
  const w = TAU * clamp(f, 10, fs * 0.49) / fs, cs = Math.cos(w), sn = Math.sin(w), al = sn / (2 * q);
  const A = Math.pow(10, gain / 40), sA = 2 * Math.sqrt(A) * al;
  let b0, b1, b2, a0, a1, a2;
  switch (type) {
    case 'lp': b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; break;
    case 'hp': b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; break;
    case 'peak': b0 = 1 + al * A; b1 = -2 * cs; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * cs; a2 = 1 - al / A; break;
    case 'lowshelf':
      b0 = A * ((A + 1) - (A - 1) * cs + sA); b1 = 2 * A * ((A - 1) - (A + 1) * cs); b2 = A * ((A + 1) - (A - 1) * cs - sA);
      a0 = (A + 1) + (A - 1) * cs + sA; a1 = -2 * ((A - 1) + (A + 1) * cs); a2 = (A + 1) + (A - 1) * cs - sA; break;
    case 'highshelf':
      b0 = A * ((A + 1) + (A - 1) * cs + sA); b1 = -2 * A * ((A - 1) + (A + 1) * cs); b2 = A * ((A + 1) + (A - 1) * cs - sA);
      a0 = (A + 1) - (A - 1) * cs + sA; a1 = 2 * ((A - 1) - (A + 1) * cs); a2 = (A + 1) - (A - 1) * cs - sA; break;
    default: throw new Error(`fx: unknown filter type "${type}"`);
  }
  return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
}
function run(x, [b0, b1, b2, a1, a2]) {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i], y = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = v; y2 = y1; y1 = y; x[i] = y;
  }
  return x;
}
// Butterworth Q per section: 12 dB/oct is one section, 24 is two (Q .5412 + 1.3066), 48 is four.
const BUTTER = { 2: [0.7071], 4: [0.5412, 1.3066], 8: [0.5098, 0.6013, 0.8999, 2.5629] };

// bands: [{ type: 'hp'|'lp'|'lowshelf'|'highshelf'|'peak', f, gain (dB), q, order (hp/lp only: 12 | 24, default 12) }].
// Note: a shelf's corner frequency sits at HALF its dB gain (RBJ); the full gain is reached an octave or two beyond.
export function eq(x, bands) {
  for (const b of bands) {
    if ((b.type === 'hp' || b.type === 'lp') && (b.order === 24 || b.order === 48)) {
      for (const q of BUTTER[b.order / 6]) run(x, biquadCoefs(b.type, b.f, 0, q));
    } else run(x, biquadCoefs(b.type, b.f, b.gain ?? 0, b.q ?? Math.SQRT1_2));
  }
  return x;
}

// ---------- FDN reverb ----------
// room / plate / hall: size scales the delay lengths (bigger = longer gaps between reflections), decay is RT60 in
// seconds at low frequencies, damp is the highpass-ish absorption per round trip (0 bright .. 0.9 dark).
export const REVERBS = {
  room: { size: 0.5, decay: 0.55, predelay: 0.004, damp: 0.35, wet: 0.2, mod: 0.2 },  // small, near-field: glues without a "tail"
  plate: { size: 0.85, decay: 1.8, predelay: 0.012, damp: 0.22, wet: 0.2, mod: 0.35 }, // bright and dense, the classic vocal/keys send
  hall: { size: 1.5, decay: 3.2, predelay: 0.025, damp: 0.42, wet: 0.2, mod: 0.5 },    // big, dark; the predelay keeps the dry note articulate
};
const BASE_MS = [29.7, 37.1, 41.1, 43.7, 53.3, 59.9, 67.3, 79.1];
// Sylvester-Hadamard rows (±1): input and output taps use different rows, so L and R excite and read the
// network through orthogonal patterns -> decorrelated stereo tail without any extra filters.
const had = (r) => Array.from({ length: 8 }, (_, c) => (popcount(r & c) & 1 ? -1 : 1));
const popcount = (v) => { let n = 0; while (v) { n += v & 1; v >>= 1; } return n; };
const IN_L = had(1), IN_R = had(2), OUT_L = had(3), OUT_R = had(5);
const WET_CAL = 2.5; // measured: wet=1 on the plate preset returns about the dry energy per side (white noise); /rt^0.25 evens out long vs short tails (a longer tail is spread thinner), so presets stay within ~4 dB of each other

export function plate(L, R, o = {}) {
  const c = { ...REVERBS[o.preset || 'plate'], ...o };
  const n = L.length, size = c.size, rt = Math.max(0.05, c.decay), d = clamp(c.damp, 0, 0.95);
  const lens = BASE_MS.map((ms) => nextPrime(Math.max(64, Math.round(ms * size * RATE / 1000))));
  // `decay` is the RT60 you would measure on the whole tail (backward-integrated impulse response), not just the lows:
  // any damping makes the bright start die faster, so the lows are given ~20% extra (calibrated against the measurement in test/fx.test.js).
  const rtEff = rt * (1 + 0.22 * Math.min(1, d / 0.15));
  const gain = lens.map((l) => Math.pow(10, -3 * l / (rtEff * RATE)));      // -60 dB after rtEff seconds
  const dep = lens.map((l) => Math.min(c.mod * 3, l / 8));                // samples of modulation depth; ~3 is inaudible as pitch but kills flutter echoes
  const bufs = lens.map((l, j) => new Float32Array(pow2(l + Math.ceil(dep[j]) + 4)));
  const masks = bufs.map((b) => b.length - 1);
  const rate = lens.map((_, j) => (0.23 + 0.11 * j) / RATE), ph = lens.map((_, j) => j / 8);
  const lp = new Float64Array(8), s = new Float64Array(8), ap = new Float64Array(8);
  const pre = Math.round(c.predelay * RATE), pdL = new Float32Array(pre + 1), pdR = new Float32Array(pre + 1);
  // Two input allpasses per side thicken a single click into a burst before it hits the FDN (early density).
  const apLen = (ms) => nextPrime(Math.round(ms * (0.5 + 0.5 * size) * RATE / 1000));
  const mkAp = (ms) => ({ buf: new Float32Array(apLen(ms)), k: 0 });
  const apsL = [mkAp(4.7), mkAp(7.9)], apsR = [mkAp(5.3), mkAp(9.1)];
  const apRun = (aps, x) => { for (const a of aps) { const v = a.buf[a.k], u = x + 0.55 * v; a.buf[a.k] = u; x = v - 0.55 * u; a.k = (a.k + 1) % a.buf.length; } return x; };
  const outGain = (c.wet * WET_CAL) / 2 / Math.pow(rt, 0.25);
  let pk = 0;
  for (let i = 0; i < n; i++) {
    let xl = L[i], xr = R[i];
    if (pre > 0) { const a = pdL[pk], b = pdR[pk]; pdL[pk] = xl; pdR[pk] = xr; xl = a; xr = b; pk = pk + 1 > pre ? 0 : pk + 1; }
    xl = apRun(apsL, xl); xr = apRun(apsR, xr);
    let sum = 0;
    for (let j = 0; j < 8; j++) {
      ph[j] += rate[j]; if (ph[j] >= 1) ph[j] -= 1;
      const pos = i - (lens[j] + dep[j] * sinp(ph[j])), i0 = Math.floor(pos), fr = pos - i0, bf = bufs[j], m = masks[j];
      const v = bf[i0 & m] + ((1 - fr) / (1 + fr)) * (bf[(i0 + 1) & m] - ap[j]); ap[j] = v; // allpass interpolation: flat magnitude, unlike linear (which dulls and shortens the tail)
      lp[j] = (1 - d) * v + d * lp[j];
      s[j] = lp[j] * gain[j]; sum += s[j];
    }
    const h = sum * 0.25; let wl = 0, wr = 0;     // Householder: y = s - (2/N)·Σs, an orthogonal mix without a matrix multiply
    for (let j = 0; j < 8; j++) {
      bufs[j][i & masks[j]] = s[j] - h + (xl * IN_L[j] + xr * IN_R[j]) * 0.35;
      wl += s[j] * OUT_L[j]; wr += s[j] * OUT_R[j];
    }
    L[i] += wl * outGain; R[i] += wr * outGain;
  }
  return [L, R];
}

// ---------- delay ----------
// Stereo echo. pingpong: the input is summed to mono and the repeats bounce L, R, L... Feedback path gets a lowpass
// (each repeat darker, like tape/BBD, so repeats sit behind the dry note) and a fixed 120 Hz highpass (no bass build-up).
// The tail past the end of the arrays is cut: pad the track first if you need it.
export function delay(L, R, { time = 0.375, feedback = 0.35, pingpong = true, lp = 3500, wet = 0.25 } = {}) {
  const D = Math.max(1, Math.round(time * RATE)), bl = new Float32Array(D), br = new Float32Array(D), fb = Math.min(0.95, feedback);
  const a = 1 - Math.exp(-TAU * lp / RATE), hpk = Math.exp(-TAU * 120 / RATE);
  let lL = 0, lR = 0, hL = 0, hR = 0, pL = 0, pR = 0, k = 0;
  for (let i = 0; i < L.length; i++) {
    const dl = bl[k], dr = br[k];
    lL += a * (dl - lL); lR += a * (dr - lR);
    hL = lL - pL + hpk * hL; hR = lR - pR + hpk * hR; pL = lL; pR = lR; // 1-pole highpass: y = x - x_prev + p·y_prev
    if (pingpong) { bl[k] = (L[i] + R[i]) * 0.5 + fb * hR; br[k] = fb * hL; }
    else { bl[k] = L[i] + fb * hL; br[k] = R[i] + fb * hR; }
    L[i] += dl * wet; R[i] += dr * wet;
    k = k + 1 === D ? 0 : k + 1;
  }
  return [L, R];
}

// ---------- chorus ----------
// Hermite 4-point read: linear interpolation would dull the highs of every wet voice (the "digital" chorus sound).
function hermite(x, pos) {
  const i = Math.floor(pos), t = pos - i, n = x.length;
  const a = i - 1 >= 0 && i - 1 < n ? x[i - 1] : 0, b = i >= 0 && i < n ? x[i] : 0, c = i + 1 >= 0 && i + 1 < n ? x[i + 1] : 0, d = i + 2 >= 0 && i + 2 < n ? x[i + 2] : 0;
  const c1 = 0.5 * (c - a), c2 = a - 2.5 * b + 2 * c - 0.5 * d, c3 = 0.5 * (d - a) + 1.5 * (b - c);
  return ((c3 * t + c2) * t + c1) * t + b;
}
// depth in ms of delay sweep, rate in Hz. Two voices per side (11 ms and 17 ms bases) at different LFO phases,
// left and right a quarter-cycle apart: the sum is wide but collapses to mono without a hollow comb.
export function chorus(L, R, { depth = 3, rate = 0.4, mix = 0.5 } = {}) {
  const n = L.length, dm = depth * RATE / 1000, bases = [11, 17].map((ms) => ms * RATE / 1000);
  const src = [L.slice(), R.slice()], dry = mix < 1 ? 1 - mix : 0;
  for (let ch = 0; ch < 2; ch++) {
    const out = ch ? R : L, x = src[ch];
    for (let i = 0; i < n; i++) {
      const t = (i / RATE) * rate;
      const v1 = hermite(x, i - (bases[0] + dm * sinp(t + 0.25 * ch)));
      const v2 = hermite(x, i - (bases[1] + dm * sinp(t + 0.5 + 0.25 * ch)));
      out[i] = x[i] * dry + (v1 + v2) * 0.5 * mix;
    }
  }
  return [L, R];
}
// Mono source in, stereo out (new arrays; x is untouched).
export const chorusMono = (x, o) => chorus(x.slice(), x.slice(), o);

// ---------- saturation ----------
// Asymmetric tanh (a small bias before the curve gives even harmonics: the warm, tube/tape part), run at 2x so the
// new harmonics don't fold back as aliasing, then a tone lowpass. Small-signal gain is 1 and the output RMS is matched
// to the input, so drive changes colour, not level. drive 0..1, mix 0..1, tone 0 (dark, 1.5 kHz) .. 1 (open, 19 kHz).
export function saturate(x, { drive = 0.3, mix = 1, tone = 0.6, even = 0.12 } = {}) {
  const n = x.length;
  let e0 = 0; for (let i = 0; i < n; i++) e0 += x[i] * x[i];
  if (e0 === 0) return x;
  const k = 1 + 8 * clamp(drive, 0, 1), b = clamp(even, 0, 0.5) * Math.min(1, 0.3 + clamp(drive, 0, 1)), t0 = Math.tanh(b), norm = 1 / (k * (1 - t0 * t0));
  const up = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const a = x[i - 1] ?? x[i], c = x[i], d = x[i + 1] ?? x[i], e = x[i + 2] ?? d;
    up[2 * i] = c; up[2 * i + 1] = (-a + 9 * c + 9 * d - e) / 16; // 4-point midpoint interpolation
  }
  for (let i = 0; i < up.length; i++) up[i] = (Math.tanh(k * up[i] + b) - t0) * norm;
  for (const q of BUTTER[4]) run(up, biquadCoefs('lp', 20000, 0, q, RATE * 2)); // anti-alias before decimating
  const y = new Float32Array(n);
  for (let i = 0; i < n; i++) y[i] = up[2 * i];
  for (const q of BUTTER[2]) run(y, biquadCoefs('lp', 1500 * Math.pow(10, 1.1 * clamp(tone, 0, 1)), 0, q));
  // remove the DC the bias creates (1-pole highpass at ~10 Hz)
  const hk = Math.exp(-TAU * 10 / RATE); let px = 0, py = 0;
  for (let i = 0; i < n; i++) { const v = y[i]; py = v - px + hk * py; px = v; y[i] = py; }
  let e1 = 0; for (let i = 0; i < n; i++) e1 += y[i] * y[i];
  const g = e1 > 0 ? Math.sqrt(e0 / e1) : 1;
  for (let i = 0; i < n; i++) x[i] = x[i] * (1 - mix) + y[i] * g * mix;
  return x;
}

// ---------- M/S widening ----------
// Side signal above 150 Hz is scaled by `amount` (1 = unchanged, 1.5 = wider, 0 = mono highs); the side content
// below 150 Hz is left exactly as it was, so the bass image never gets wider or phasey. The 8th-order highpass is
// steep so a 100 Hz tone sees under 4% of the change.
export function widen(L, R, amount = 1.3) {
  const n = L.length, S = new Float32Array(n);
  for (let i = 0; i < n; i++) S[i] = (L[i] - R[i]) * 0.5;
  const H = S.slice();
  for (const q of BUTTER[8]) run(H, biquadCoefs('hp', 150, 0, q));
  const g = amount - 1;
  for (let i = 0; i < n; i++) { const d = H[i] * g; L[i] += d; R[i] -= d; }
  return [L, R];
}

// ---------- bus compressor ----------
// Stereo-linked RMS detector (15 ms window), soft knee, attack/release (ms) smoothing the gain reduction in dB.
// threshold is in dB RMS (a sine at -3 dBFS peak reads -6). Defaults are "glue": low ratio, slow attack so
// the transients punch through, auto-ish release.
export function glue(L, R, { threshold = -18, ratio = 2, attack = 30, release = 150, makeup = 0, knee = 6 } = {}) {
  const n = L.length, ac = Math.exp(-1 / (attack * 0.001 * RATE)), rc = Math.exp(-1 / (release * 0.001 * RATE)), dk = Math.exp(-1 / (0.015 * RATE));
  const slope = 1 - 1 / Math.max(1, ratio), mk = undb(makeup);
  let ms = 0, gr = 0; // gr: gain reduction in dB, >= 0
  for (let i = 0; i < n; i++) {
    ms = dk * ms + (1 - dk) * (L[i] * L[i] + R[i] * R[i]) * 0.5;
    const lvl = 10 * Math.log10(ms + 1e-12), over = lvl - threshold;
    let target;
    if (2 * over < -knee) target = 0;
    else if (2 * Math.abs(over) <= knee) target = slope * (over + knee / 2) ** 2 / (2 * knee);
    else target = slope * over;
    gr = target > gr ? target + ac * (gr - target) : target + rc * (gr - target);
    const g = undb(-gr) * mk;
    L[i] *= g; R[i] *= g;
  }
  return [L, R];
}

// ---------- transient shaper ----------
// attack / sustain in -1..1 (about ±12 dB at the extreme). Compares a fast and a slow envelope: where fast > slow
// we are on a hit (attack), where fast < slow we are on the tail (sustain). Level-independent, so it works on
// a quiet hat and a loud kick alike. Run it on L and R separately (or on a mono drum bus before panning).
export function transientShape(x, { attack = 0.3, sustain = 0 } = {}) {
  const n = x.length, k = (ms) => Math.exp(-1 / (ms * 0.001 * RATE));
  const fa = k(0.5), fr = k(20), sa = k(15), sr = k(250), sm = k(1.5);
  let f = 0, s = 0, g = 1;
  for (let i = 0; i < n; i++) {
    const v = Math.abs(x[i]);
    f = v > f ? v + fa * (f - v) : v + fr * (f - v);
    s = v > s ? v + sa * (s - v) : v + sr * (s - v);
    const d = 20 * Math.log10((f + 1e-6) / (s + 1e-6)); // + on a hit, - on the decay
    // Sustain lift peaks at -12 dB between the envelopes and fades out by -24: a fast envelope that is MUCH lower
    // than the slow one means a gap of silence, not a tail, and boosting that would hit the next onset with full gain.
    const m = -d, gdb = d > 0 ? attack * Math.min(d, 12) : sustain * (m < 12 ? m : Math.max(0, 24 - m));
    g = sm * g + (1 - sm) * undb(gdb);
    x[i] *= g;
  }
  return x;
}

// ---------- channels ----------
// One chain per instrument class. Each step is { fx, ...options }; delay takes `beats` (converted with the song's bpm).
// Reasons are in the comments: the aim is every part has its own frequency slot, its own depth, and the bass stays
// dry, mono and centred.
export const CHANNELS = {
  // Kick/snare/hats: remove sub rumble no speaker plays, add the hit, glue with a touch of drive, and a SMALL room so
  // drums share one space with the rest without washing the groove.
  drums: [
    { fx: 'eq', bands: [{ type: 'hp', f: 30 }, { type: 'peak', f: 350, gain: -2, q: 1 }, { type: 'highshelf', f: 9000, gain: 1.5 }] },
    { fx: 'transient', attack: 0.3, sustain: 0 },
    { fx: 'saturate', drive: 0.25, mix: 0.5, tone: 0.7 },
    { fx: 'plate', preset: 'room', wet: 0.1 },
  ],
  // Electric piano / keys: highpass leaves the bass its room, chorus gives the width that makes a Rhodes a Rhodes,
  // plate puts it on a shelf behind the lead.
  keys: [
    { fx: 'eq', bands: [{ type: 'hp', f: 120 }, { type: 'peak', f: 300, gain: -1.5, q: 1 }] },
    { fx: 'chorus', depth: 3, rate: 0.35, mix: 0.35 },
    { fx: 'plate', preset: 'plate', wet: 0.16 },
  ],
  // Pads: highpass at 150 + a 9 kHz lid so they fill the middle without masking bass or hats; slow chorus, widened,
  // and the long hall so they sit in the far field.
  pad: [
    { fx: 'eq', bands: [{ type: 'hp', f: 150 }, { type: 'lp', f: 9000 }] },
    { fx: 'chorus', depth: 5, rate: 0.2, mix: 0.45 },
    { fx: 'widen', amount: 1.4 },
    { fx: 'plate', preset: 'hall', wet: 0.28 },
  ],
  // Bass: steep highpass at 35, mud notch at 250, saturation with a darker tone adds upper harmonics so it
  // still reads on phone speakers. NO reverb, no widening: low end stays dry and in the centre.
  bass: [
    { fx: 'eq', bands: [{ type: 'hp', f: 35, order: 24 }, { type: 'peak', f: 250, gain: -2, q: 1 }] },
    { fx: 'saturate', drive: 0.35, mix: 0.4, tone: 0.35 },
  ],
  // Lead: a bit of presence, a dotted-eighth ping-pong delay (darkened so it doesn't mask the next phrase) and a plate.
  lead: [
    { fx: 'eq', bands: [{ type: 'hp', f: 180 }, { type: 'peak', f: 3000, gain: 1.5, q: 0.8 }] },
    { fx: 'delay', beats: 0.75, feedback: 0.35, pingpong: true, lp: 3500, wet: 0.18 },
    { fx: 'plate', preset: 'plate', wet: 0.14 },
  ],
  // Plucks/arps: eighth-note echoes make a sparse line sound busy; a room (not a hall) keeps the notes short.
  pluck: [
    { fx: 'eq', bands: [{ type: 'hp', f: 150 }] },
    { fx: 'delay', beats: 0.5, feedback: 0.3, pingpong: true, lp: 4500, wet: 0.14 },
    { fx: 'plate', preset: 'room', wet: 0.12 },
  ],
  // Mix bus: gentle 2:1 glue (about 2 dB of reduction at peaks), nothing else; the master chain owns loudness.
  bus: [
    { fx: 'glue', threshold: -18, ratio: 2, attack: 30, release: 150, makeup: 1 },
  ],
};

const STEPS = {
  eq: (L, R, s) => { eq(L, s.bands); eq(R, s.bands); },
  saturate: (L, R, s) => { saturate(L, s); saturate(R, s); },
  transient: (L, R, s) => { transientShape(L, s); transientShape(R, s); },
  chorus: (L, R, s) => chorus(L, R, s),
  plate: (L, R, s) => plate(L, R, s),
  delay: (L, R, s, bpm) => delay(L, R, s.beats != null ? { ...s, time: s.beats * 60 / bpm } : s),
  widen: (L, R, s) => widen(L, R, s.amount),
  glue: (L, R, s) => glue(L, R, s),
};
// Run a chain in place. R may be omitted/null/identical to L for a mono source (it becomes a copy, so chorus and
// the reverb can spread it). Returns [L, R].
export function applyChain(L, R, chain, { bpm = 100 } = {}) {
  R = sameFirst(L, R);
  for (const s of chain) {
    const f = STEPS[s.fx];
    if (!f) throw new Error(`fx: unknown chain step "${s.fx}"`);
    f(L, R, s, bpm);
  }
  return [L, R];
}
