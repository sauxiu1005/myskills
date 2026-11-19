// Real-instrument samples. `om samples build` assembles a pack of public-domain recordings (piano, string
// section, harp, mallets, guitar, flute, horn, a drum kit…); when it is installed, the score plays those
// instruments from the recordings — nearest sample, resampled to pitch, velocity picks the layer, round
// robins alternate — and everything else (and every instrument when there is no pack) stays synthesized.
// sampler()/hit() return mono, as they always did; samplerStereo()/hitStereo() return { L, R } with the
// recorded stereo image (a mono recording gives L === R, the same array).
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { N, RATE, env, mtof } from './dsp.js';

export const packDir = () => process.env.OM_SAMPLES || join(homedir(), '.cache', 'huashu-motion', 'samples');

let pack;
export function loadPack() {
  if (pack !== undefined) return pack;
  const dir = packDir(), f = join(dir, 'manifest.json');
  pack = null;
  if (process.env.OM_SAMPLES !== 'off' && existsSync(f)) {
    try { pack = { dir, ...JSON.parse(readFileSync(f, 'utf8')) }; } catch { pack = null; }
  }
  return pack;
}
export const resetPack = () => { pack = undefined; };
export const hasSample = (id) => !!loadPack()?.instruments?.[id]?.samples?.length;

const pcm = new Map();
// decoded once per file: { L, R, mono }. A mono file has R === L === mono; a stereo file's mono is (L+R)/2.
function decode(file, ch = 1) {
  if (pcm.has(file)) return pcm.get(file);
  const c = ch >= 2 ? 2 : 1;
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', join(pack.dir, file), '-f', 'f32le', '-ac', String(c), '-ar', String(RATE), '-'], { maxBuffer: 256 << 20 });
  const raw = r.status === 0 ? new Float32Array(r.stdout.buffer.slice(r.stdout.byteOffset, r.stdout.byteOffset + (r.stdout.length & ~3))) : new Float32Array(c);
  let d;
  if (c === 1) d = { L: raw, R: raw, mono: raw };
  else {
    const n = raw.length >> 1, L = new Float32Array(n), R = new Float32Array(n), mono = new Float32Array(n);
    for (let i = 0; i < n; i++) { L[i] = raw[2 * i]; R[i] = raw[2 * i + 1]; mono[i] = (L[i] + R[i]) / 2; }
    d = { L, R, mono };
  }
  pcm.set(file, d);
  return d;
}

const RANK = { pp: 0, p: 1, mp: 2, mf: 3, f: 4, ff: 5, fff: 6 };
const layersOf = (list) => [...new Set(list.map((s) => s.layer))].sort((a, b) => (RANK[a] ?? Number(a) ?? 0) - (RANK[b] ?? Number(b) ?? 0));
const layerFor = (layers, vel) => layers[Math.max(0, Math.min(layers.length - 1, Math.round(vel * (layers.length - 1))))];

// Cubic (Catmull-Rom) read of x at fractional positions: cleaner than linear when shifting pitch.
function resample(x, ratio, n) {
  const o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = i * ratio, j = Math.floor(p), t = p - j;
    if (j + 2 >= x.length) break;
    const a = x[j - 1] ?? x[j], b = x[j], c = x[j + 1], d = x[j + 2];
    o[i] = b + 0.5 * t * (c - a + t * (2 * a - 5 * b + 4 * c - d + t * (3 * (b - c) + d - a)));
  }
  return o;
}

// the sample of `pool` (already one layer) whose root is nearest to midi; ties go to a random round robin
function nearest(pool, midi, r) {
  let best = Infinity;
  for (const s of pool) best = Math.min(best, Math.abs(s.root - midi));
  const near = pool.filter((s) => Math.abs(s.root - midi) === best);
  return near[Math.floor(r() * near.length) % near.length];
}

// pitched voice core: (f, sec, vel, r) → { L, R }. stereo=false reads the mono fold-down and returns L === R.
function pitched(id, { release = 0.15, gain = 1, relSample = false } = {}, stereo) {
  const inst = loadPack()?.instruments?.[id];
  if (!inst?.samples?.length) return null;
  const layers = layersOf(inst.samples);
  const rels = relSample ? inst.releases || [] : [];
  const relLayers = layersOf(rels);
  const side = (d) => (stereo ? d : { L: d.mono, R: d.mono });
  return (f, sec, vel = 0.7, r = Math.random) => {
    const midi = 69 + 12 * Math.log2(f / 440);
    const layer = layerFor(layers, vel);
    const s = nearest(inst.samples.filter((q) => q.layer === layer), midi, r);
    const x = side(decode(s.file, s.ch));
    const ratio = f / mtof(s.root + (s.cents || 0) / 100);
    const want = N(sec), cap = Math.floor((x.L.length - 3) / ratio);
    const n = Math.max(1, Math.min(want, cap)); // a shifted-up sample runs out early: end it there, faded
    const g = gain * (0.55 + 0.45 * Math.min(1, vel / Math.max(0.01, (layers.indexOf(layer) + 1) / layers.length)));
    const withRel = rels.length > 0 && cap >= want; // a note that died on its own has nothing to release
    const fade = withRel ? Math.min(release, 0.12) : release; // the release sample carries the damper's tail
    const one = !stereo || x.L === x.R; // a mono recording is processed once and returned as L === R
    const keys = one ? ['L'] : ['L', 'R'];
    let rr = null, ov = 0;
    if (withRel) {
      const pool = rels.filter((q) => q.layer === layerFor(relLayers, vel));
      const rs = nearest(pool.length ? pool : rels, midi, r), rx = side(decode(rs.file, rs.ch));
      const rratio = f / mtof(rs.root), rn = Math.max(1, Math.floor((rx.L.length - 3) / rratio));
      ov = N(0.01);
      rr = { L: resample(rx.L, rratio, rn), g: gain * 0.8 * (0.4 + 0.6 * vel) };
      rr.R = !one && rx.R !== rx.L ? resample(rx.R, rratio, rn) : rr.L;
    }
    const total = withRel ? n - ov + rr.L.length : n, out = {};
    for (const k of keys) {
      const o = resample(x[k], ratio, n);
      for (let i = 0; i < n; i++) o[i] *= g;
      env(o, 0.0015, Math.min(fade, n / RATE / 3));
      if (withRel) { const t = new Float32Array(total); t.set(o); for (let i = 0; i < rr[k].length; i++) t[n - ov + i] += rr[k][i] * rr.g; out[k] = t; } else out[k] = o;
    }
    return one ? { L: out.L, R: out.L } : out;
  };
}

// An unpitched hit core: (r, vel) → { L, R }.
function unpitched(id, { gain = 1 } = {}, stereo) {
  const inst = loadPack()?.instruments?.[id];
  if (!inst?.samples?.length) return null;
  const layers = layersOf(inst.samples);
  return (r = Math.random, vel = 0.8) => {
    const pool = inst.samples.filter((s) => s.layer === layerFor(layers, vel));
    const s = pool[Math.floor(r() * pool.length) % pool.length];
    const d = decode(s.file, s.ch), scale = (x) => { const o = new Float32Array(x.length); for (let i = 0; i < x.length; i++) o[i] = x[i] * gain; return o; };
    if (!stereo) { const o = scale(d.mono); return { L: o, R: o }; }
    const L = scale(d.L);
    return { L, R: d.R === d.L ? L : scale(d.R) };
  };
}

// A pitched instrument as (f, sec, vel, r) → mono, the same shape as the synth voices. `release` is the fade-out
// in seconds; release: true (or relSample: true) also lays the recorded key-release noise over the note's end
// when the instrument has one (the piano does) — the fade is then a short 0.12 s damper fade at most.
export function sampler(id, opts = {}) {
  const v = pitched(id, normalize(opts), false);
  return v && ((f, sec, vel, r) => v(f, sec, vel, r).L);
}
// the same, as { L, R } with the recorded stereo image
export function samplerStereo(id, opts = {}) { return pitched(id, normalize(opts), true); }

// An unpitched hit (drum, clap, snap…) as (r, vel) → mono.
export function hit(id, opts = {}) {
  const v = unpitched(id, opts, false);
  return v && ((r, vel) => v(r, vel).L);
}
export function hitStereo(id, opts = {}) { return unpitched(id, opts, true); }

function normalize(opts) {
  const o = { ...opts };
  if (o.release === true) { o.relSample = true; o.release = 0.15; }
  return o;
}
