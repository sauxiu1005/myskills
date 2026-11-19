// om beats — find the pulse of a piece of music someone else made (their own track, an AI-generated one), so
// scene cuts can sit on real beats instead of a synthesized grid. Pure JS, no dependencies; ffmpeg is only
// used to decode. Method: spectral-flux onset envelope (3 bands, bass weighted, hop 10 ms) → autocorrelation
// for the period → Ellis (2007) dynamic-programming beat tracker for the phase → a robust line fit through the
// tracked beats (sub-frame accuracy, drift-free tempo) → downbeat from bass accent + energy rise on 4 phases →
// bar-level loudness for sections and drops.
//
// analyzeFile(file) / analyze(pcm) returns (all times in seconds from the start of the audio):
//   {
//     bpm,         // 70–180, fitted from the tracked beats (not an integer, e.g. 127.98)
//     confidence,  // 0–1; < 0.3 means "no clear pulse": bpm/beats/downbeats are a best guess, trust `sections`
//     beats: [t],      // every beat, regular grid when the tempo is steady, raw tracker output when it drifts
//     downbeats: [t],  // first beat of each bar, 4/4 assumed (every 4th entry of `beats`)
//     sections: [{ start, end, energy }],  // loudness segments cut on bar lines (4 s blocks when no pulse); energy 0–1, 1 = loudest
//     drops: [{ t, score }],  // up to 3 candidates, t on a downbeat, score 0–1 = size of the energy jump, best first
//     end,         // where the music really stops (last point above the silence threshold)
//     duration,    // length of the decoded file
//   }
import { spawnSync } from 'node:child_process';
import { OmError } from './project.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const r3 = (x) => Math.round(x * 1000) / 1000;

// ---------- decode ----------

// Any audio/video file → { L, R, rate, duration } (Float32Array per channel, mono sources are duplicated).
export function decode(file, rate = 48000) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-nostdin', '-i', file, '-vn', '-f', 'f32le', '-ac', '2', '-ar', String(rate), '-'], { maxBuffer: Infinity });
  if (r.error) {
    if (r.error.code === 'ENOENT') throw new OmError('ffmpeg not found — install it (macOS: brew install ffmpeg) to decode music files');
    throw new OmError(`ffmpeg failed to start: ${r.error.message}`);
  }
  if (r.status !== 0) throw new OmError(`ffmpeg could not decode ${file}: ${String(r.stderr).trim().split('\n').pop() || 'exit ' + r.status}`);
  const n = Math.floor(r.stdout.length / 8);
  if (!n) throw new OmError(`${file} decoded to no audio`);
  const buf = new Float32Array(r.stdout.buffer.slice(r.stdout.byteOffset, r.stdout.byteOffset + n * 8)); // copy → 4-byte aligned
  const L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = buf[2 * i]; R[i] = buf[2 * i + 1]; }
  return { L, R, rate, duration: n / rate };
}

// ---------- beatAt (self-contained and pure on purpose: the browser runtime inlines it) ----------

// Time of beat n (0-based, fractional n interpolates linearly). Outside the list the nearest beat length is
// extended, so beatAt(beats, -1) is one beat before the first and beatAt(beats, len + 3) is past the last.
export function beatAt(beats, n) {
  const last = beats.length - 1;
  if (last < 0) return NaN;
  if (last === 0) return beats[0];
  if (n <= 0) return beats[0] + n * (beats[1] - beats[0]);
  if (n >= last) return beats[last] + (n - last) * (beats[last] - beats[last - 1]);
  const i = Math.floor(n);
  return beats[i] + (n - i) * (beats[i + 1] - beats[i]);
}

// ---------- FFT ----------

function makeFFT(n) {
  const bits = Math.log2(n), rev = new Uint32Array(n), cs = new Float64Array(n / 2), sn = new Float64Array(n / 2);
  for (let i = 0; i < n; i++) { let x = i, y = 0; for (let b = 0; b < bits; b++) { y = (y << 1) | (x & 1); x >>= 1; } rev[i] = y; }
  for (let i = 0; i < n / 2; i++) { cs[i] = Math.cos((2 * Math.PI * i) / n); sn[i] = -Math.sin((2 * Math.PI * i) / n); }
  return (re, im) => {
    for (let i = 0; i < n; i++) { const j = rev[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1, step = n / size;
      for (let s = 0; s < n; s += size) {
        for (let k = 0, w = 0; k < half; k++, w += step) {
          const a = s + k, b = a + half;
          const tr = re[b] * cs[w] - im[b] * sn[w], ti = re[b] * sn[w] + im[b] * cs[w];
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        }
      }
    }
  };
}

// ---------- onset features ----------

const WIN = 512; // at ~12 kHz = 43 ms; 23 Hz bins, so the bass band (bins 1–6) resolves a kick
const BANDS = [[1, 7], [7, 33], [33, 256]]; // bass 23–140 Hz, mid to ~750 Hz, highs to 6 kHz
const BAND_W = [2, 1, 1]; // the kick decides where the beat is, hats only add
// Flux peaks sit this much before the acoustic onset (log compression fires as soon as the hit enters the
// window tail); measured on synthetic drums with known onsets.
const FLUX_LEAD = 0.009;

// Decimate to ~12 kHz, STFT with hop 10 ms, log-magnitude half-wave flux per band, plus raw bass magnitude
// (linear, so accents survive) and block RMS at the full rate.
function features({ L, R, rate }) {
  const D = Math.max(1, Math.round(rate / 12000)), r2 = rate / D, hop = Math.round(r2 / 100), n = L.length;
  const m = Math.floor(n / D), y = new Float32Array(m);
  let ss = 0;
  for (let i = 0; i < m; i++) { let s = 0; for (let k = 0; k < D; k++) s += L[i * D + k] + R[i * D + k]; y[i] = s / (2 * D); ss += y[i] * y[i]; }
  const gain = ss > 1e-12 ? 0.1 / Math.sqrt(ss / m) : 1;
  const nF = Math.floor(m / hop) + 1, fft = makeFFT(WIN);
  const hann = new Float64Array(WIN);
  for (let i = 0; i < WIN; i++) hann[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / WIN);
  const re = new Float64Array(WIN), im = new Float64Array(WIN), prev = new Float64Array(WIN / 2 + 1), cur = new Float64Array(WIN / 2 + 1);
  const flux = BANDS.map(() => new Float32Array(nF)), bass = new Float32Array(nF);
  for (let f = 0; f < nF; f++) {
    const s0 = f * hop - WIN / 2;
    for (let i = 0; i < WIN; i++) { const j = s0 + i; re[i] = j >= 0 && j < m ? y[j] * hann[i] : 0; im[i] = 0; }
    fft(re, im);
    for (let k = 1; k < WIN / 2; k++) {
      const a = Math.hypot(re[k], im[k]) / (WIN / 2) * gain;
      cur[k] = Math.log1p(1000 * a);
      if (k < 7) bass[f] += a;
    }
    for (let k = 1; k < WIN / 2; k++) {
      // SuperFlux (Böck 2013): compare with the max of the neighbouring bins of the previous frame, so a
      // sustained chord whose partials beat against each other does not read as a stream of onsets
      const d = cur[k] - Math.max(prev[k - 1], prev[k], prev[k + 1]);
      if (f > 1 && d > 0) for (let b = 0; b < BANDS.length; b++) if (k >= BANDS[b][0] && k < BANDS[b][1]) { flux[b][f] += d; break; }
    }
    prev.set(cur);
  }
  // loudness: RMS per hop-sized block of the original-rate mono mix
  const hopF = hop * D, nB = Math.ceil(n / hopF), rms = new Float32Array(nB);
  for (let b = 0; b < nB; b++) {
    let s = 0; const a = b * hopF, e = Math.min(n, a + hopF);
    for (let i = a; i < e; i++) { const v = 0.5 * (L[i] + R[i]); s += v * v; }
    rms[b] = Math.sqrt(s / Math.max(1, e - a));
  }
  return { hopSec: hop / r2, nF, flux, bass, rms, blockSec: hopF / rate };
}

// onset strength envelope: bands normalized by their own mean, bass-weighted sum, local mean removed.
function envelope(flux, nF, hopSec) {
  const e = new Float32Array(nF);
  flux.forEach((fl, b) => {
    let mean = 0; for (let i = 0; i < nF; i++) mean += fl[i]; mean /= nF;
        const k = BAND_W[b] / (mean + 0.1); // absolute floor (drums sit at 0.25–2 per band, a steady chord at <0.06): an empty band stays quiet instead of being normalized up to noise
    for (let i = 0; i < nF; i++) e[i] += fl[i] * k;
  });
  const w = Math.max(3, Math.round(0.1 / hopSec)), pre = new Float64Array(nF + 1);
  for (let i = 0; i < nF; i++) pre[i + 1] = pre[i] + e[i];
  const o = new Float32Array(nF);
  for (let i = 0; i < nF; i++) {
    const a = Math.max(0, i - w), b = Math.min(nF, i + w + 1);
    o[i] = Math.max(0, e[i] - (pre[b] - pre[a]) / (b - a));
  }
  return o;
}

// ---------- tempo ----------

// unbiased, normalized autocorrelation for lags 0..maxLag (frames)
function acorr(x, maxLag) {
  const n = x.length, out = new Float64Array(maxLag + 1);
  let m = 0; for (let i = 0; i < n; i++) m += x[i]; m /= n;
  x = x.map((v) => v - m); // without this the non-negative envelope's DC term makes every lag look periodic
  for (let l = 0; l <= maxLag; l++) { let s = 0; for (let i = 0; i + l < n; i++) s += x[i] * x[i + l]; out[l] = s / Math.max(1, n - l); }
  const z = out[0] || 1;
  for (let l = 0; l <= maxLag; l++) out[l] /= z;
  return out;
}
const at = (a, x) => { if (x <= 0) return a[0]; if (x >= a.length - 1) return a[a.length - 1]; const i = Math.floor(x); return a[i] + (a[i + 1] - a[i]) * (x - i); };

// Period (frames, fractional) of the beat. Candidates 60–240 bpm scored by autocorrelation plus its
// harmonics (a real beat repeats at 2× and 4× too) with a broad prior around 120; folded into 70–180;
// above 150 a double-time mistake is checked against bass periodicity and onset periodicity.
function tempo(env, bassEnv, hopSec) {
  const maxLag = Math.round(4 * 60 / 60 / hopSec) + 2, ac = acorr(env, maxLag), acB = acorr(bassEnv, maxLag);
  const lag = (bpm) => 60 / bpm / hopSec;
  let best = null;
  for (let bpm = 60; bpm <= 240; bpm += 0.5) {
    const L = lag(bpm);
    const s = (at(ac, L) + 0.5 * at(ac, 2 * L) + 0.25 * at(ac, 4 * L)) * Math.exp(-0.5 * Math.pow(Math.log2(bpm / 120) / 1.2, 2));
    if (!best || s > best.s) best = { s, bpm };
  }
  let bpm = best.bpm;
  while (bpm > 180) bpm /= 2;
  while (bpm < 70) bpm *= 2;
  if (bpm > 150) {
    const L = lag(bpm), on = at(ac, L) / Math.max(1e-6, at(ac, 2 * L)), lo = at(acB, L) / Math.max(1e-6, at(acB, 2 * L));
    if (Math.min(on, lo) < 0.75 || (on + lo) / 2 < 0.8) bpm /= 2; // the kick/accent period is the slower one
  }
  const L = lag(bpm);
  return { period: L, acf: Math.max(at(ac, L), at(ac, 2 * L)) };
}

// ---------- beat tracking (Ellis 2007) ----------

function track(env, P, tight = 100) {
  const n = env.length, score = new Float64Array(n), from = new Int32Array(n).fill(-1);
  const lo = Math.max(1, Math.round(P / 2)), hi = Math.round(P * 2), pen = new Float64Array(hi + 1);
  for (let t = lo; t <= hi; t++) pen[t] = tight * Math.pow(Math.log(t / P), 2);
  for (let t = 0; t < n; t++) {
    let best = 0, bi = -1;
    for (let k = lo; k <= hi && k <= t; k++) { const v = score[t - k] - pen[k]; if (v > best) { best = v; bi = t - k; } }
    score[t] = env[t] + best; from[t] = bi;
  }
  let t = n - 1;
  for (let k = n - 1; k >= Math.max(0, n - Math.round(P)); k--) if (score[k] > score[t]) t = k;
  const out = [];
  for (; t >= 0; t = from[t]) { out.push(t); if (from[t] < 0) break; }
  return out.reverse();
}

// local peak of env near frame b, refined to a fraction of a frame
function peakNear(env, b, r = 2) {
  let p = b;
  for (let i = Math.max(0, b - r); i <= Math.min(env.length - 1, b + r); i++) if (env[i] > env[p]) p = i;
  if (p <= 0 || p >= env.length - 1) return p;
  const a = env[p - 1], c = env[p], d = env[p + 1], den = a - 2 * c + d;
  return den < 0 ? p + clamp(0.5 * (a - d) / den, -0.5, 0.5) : p;
}

// Global grid t = (ph + k·p)·hop: scan period (±3 % around the autocorrelation estimate) and phase for the
// grid whose beats sit on the highest envelope, then polish. This is what pins the phase to the kick when an
// intro has only off-beat hats, and gives a drift-free tempo. `quality` = envelope at the beats / average.
function comb(x, P) {
  const n = x.length, s = new Float32Array(n + 1);
  for (let i = 0; i < n; i++) s[i] = 0.25 * (x[i - 1] ?? x[i]) + 0.5 * x[i] + 0.25 * (x[i + 1] ?? x[i]);
  const score = (p, ph) => { let v = 0, c = 0; for (let t = ph; t < n - 1; t += p) { const i = t | 0; v += s[i] + (s[i + 1] - s[i]) * (t - i); c++; } return v / Math.max(1, c); };
  let best = { v: -1, p: P, ph: 0 };
  for (let r = -0.03; r <= 0.0301; r += 0.0002) for (let ph = 0; ph < P * (1 + r); ph += 0.5) { const p = P * (1 + r), v = score(p, ph); if (v > best.v) best = { v, p, ph }; }
  const c = best;
  for (let r = -0.0004; r <= 0.00041; r += 0.00002) for (let d = -0.75; d <= 0.751; d += 0.1) { const p = c.p * (1 + r), ph = c.ph + d, v = ph >= 0 ? score(p, ph) : -1; if (v > best.v) best = { v, p, ph }; }
  let mean = 0; for (let i = 0; i < n; i++) mean += x[i]; mean /= n;
  return { p: best.p, ph: best.ph, quality: best.v / Math.max(1e-9, mean) };
}

// ---------- analysis ----------

export function analyze({ L, R, rate }) {
  const duration = L.length / rate, F = features({ L, R, rate }), { hopSec, nF } = F;
  // end of the music: last block above -55 dBFS RMS
  let last = -1;
  for (let b = F.rms.length - 1; b >= 0; b--) if (F.rms[b] > 0.0018) { last = b; break; }
  const end = r3(Math.min(duration, (last + 1) * F.blockSec));
  const nUse = Math.max(8, Math.min(nF, Math.ceil(end / hopSec) + 1));
  const env = envelope(F.flux, nF, hopSec).subarray(0, nUse);
  const bassEnv = envelope([F.flux[0]], nF, hopSec).subarray(0, nUse);
  let sd = 0, mean = 0;
  for (let i = 0; i < nUse; i++) mean += env[i];
  mean /= nUse;
  for (let i = 0; i < nUse; i++) sd += (env[i] - mean) ** 2;
  sd = Math.sqrt(sd / nUse) || 1;
  const x = env.map((v) => v / sd);

  // tempo from the autocorrelation, phase and exact period from the comb; the DP tracker (Ellis) is what we
  // fall back to when the tempo wanders and no single grid fits
  const tp = tempo(x, bassEnv, hopSec), cb = comb(x, tp.period);
  const fr = track(x, tp.period), ts = fr.map((b) => peakNear(x, b) * hopSec + FLUX_LEAD);
  // the grid holds when it sits on a clearly stronger envelope than chance, or when the tracker agrees with it
  const agree = ts.filter((t) => { const r = (((t - cb.ph * hopSec) % (cb.p * hopSec)) + cb.p * hopSec) % (cb.p * hopSec); return Math.min(r, cb.p * hopSec - r) < 0.04; }).length / Math.max(1, ts.length);
  let beats, period;
  if (cb.quality >= 8 || (cb.quality >= 1.5 && agree >= 0.8)) {
    period = cb.p * hopSec; beats = [];
    for (let k = 0; (cb.ph + k * cb.p) * hopSec <= end + 1e-9; k++) beats.push(r3((cb.ph + k * cb.p) * hopSec + FLUX_LEAD));
  } else {
    beats = ts.map(r3).filter((v) => v <= end + 1e-9);
    period = ts.length > 1 ? (ts.at(-1) - ts[0]) / (ts.length - 1) : tp.period * hopSec;
  }
  const bpm = Math.round(60 / period * 100) / 100;

  // confidence: periodic (autocorrelation) × beats land on real onsets × onsets stand out from the background
  let hit = 0, atBeat = 0;
  for (const t of beats) { const f = Math.round((t - FLUX_LEAD) / hopSec); if (f < 0 || f >= nUse) continue; let m = 0; for (let i = Math.max(0, f - 2); i <= Math.min(nUse - 1, f + 2); i++) m = Math.max(m, x[i]); atBeat += m; if (m > 1.5) hit++; }
  const nb = Math.max(1, beats.filter((t) => t < end).length);
  const c1 = clamp((tp.acf - 0.1) / 0.4), c2 = clamp(hit / nb / 0.6), c3 = clamp((atBeat / nb - 1.5) / 3);
  // absolute gate: normalizing by the std would turn the numerical fuzz of a steady pad into "rhythm"
  const c4 = clamp((mean - 0.3) / 0.6);
  const confidence = r3(Math.cbrt(c1 * c2 * c3) * c4);
  const clear = confidence >= 0.3;

  // mean square over [a, b) seconds from the 10 ms blocks, edge blocks weighted by overlap
  const ms = (a, b) => {
    const A = a / F.blockSec, B = Math.max(A + 1e-6, b / F.blockSec); let s = 0, w = 0;
    for (let k = Math.floor(A); k < Math.min(Math.ceil(B), F.rms.length); k++) { const o = Math.min(B, k + 1) - Math.max(A, k); s += F.rms[k] * F.rms[k] * o; w += o; }
    return s / (w || 1);
  };

  // downbeat: of the 4 beat phases, the one with the strongest bass hit + energy rise
  const beatE = beats.map((t, i) => Math.sqrt(ms(t, beats[i + 1] ?? t + period)));
  const bassAt = beats.map((t) => { const f = Math.round((t - FLUX_LEAD) / hopSec); let s = 0; for (let i = Math.max(0, f - 1); i <= Math.min(nF - 1, f + 6); i++) s += F.bass[i]; return s; });
  const meanOf = (a) => a.reduce((s, v) => s + v, 0) / Math.max(1, a.length) || 1;
  const bm = meanOf(bassAt), em = meanOf(beatE);
  const phase = [0, 0, 0, 0];
  beats.forEach((_, i) => { phase[i % 4] += bassAt[i] / bm + 0.5 * Math.max(0, (beatE[i] - (beatE[i - 1] ?? beatE[i])) / em); });
  let ph = 0;
  for (let p = 1; p < 4; p++) if (phase[p] > phase[ph] * 1.0001) ph = p;
  const downbeats = beats.filter((_, i) => i % 4 === ph);

  // bars (or 4 s blocks without a pulse) → loudness → sections and drops
  let edges;
  if (clear && downbeats.length >= 2) {
    edges = [0, ...downbeats.filter((t) => t > 0.05 && t < end - 0.05), end];
  } else {
    edges = []; for (let t = 0; t < end - 1e-9; t += 4) edges.push(t);
    edges.push(end);
  }
  edges = edges.filter((t, i) => i === 0 || t - edges[i - 1] > 0.05);
  const barRms = [];
  for (let i = 0; i + 1 < edges.length; i++) barRms.push(Math.sqrt(ms(edges[i], edges[i + 1])));
  const top = Math.max(1e-9, ...barRms), e01 = barRms.map((v) => v / top);
  // a new section starts when a bar is > 2.5 dB away from the running section; sections are >= 2 bars
  const sections = [];
  let cur = null;
  e01.forEach((e, i) => {
    const d = edges[i + 1] - edges[i];
    const dbd = cur ? Math.abs(20 * Math.log10((e + 1e-6) / (cur.sum / cur.dur + 1e-6))) : 0;
    if (!cur || (dbd > 2.5 && cur.n >= 2)) { cur = { start: edges[i], end: edges[i + 1], sum: e * d, dur: d, n: 1 }; sections.push(cur); }
    else { cur.end = edges[i + 1]; cur.sum += e * d; cur.dur += d; cur.n++; }
  });
  const sec = sections.map((s) => ({ start: r3(s.start), end: r3(s.end), e: s.sum / s.dur }));
  const smax = Math.max(1e-9, ...sec.map((s) => s.e));
  const outSections = sec.map((s) => ({ start: s.start, end: s.end, energy: r3(s.e / smax) }));

  const cand = [];
  for (let i = 1; i < e01.length; i++) {
    const before = i > 1 ? 0.5 * (e01[i - 1] + e01[i - 2]) : e01[0];
    cand.push({ t: r3(edges[i]), score: r3(clamp(e01[i] - before)) });
  }
  cand.sort((a, b) => b.score - a.score);
  const drops = [];
  for (const c of cand) {
    if (c.score < 0.05 || drops.length >= 3) break;
    if (drops.every((d) => Math.abs(d.t - c.t) > 4 * period * 1.5)) drops.push(c);
  }
  return { bpm, confidence, beats, downbeats, sections: outSections, drops, end, duration: r3(duration) };
}

export const analyzeFile = (file) => analyze(decode(file));
