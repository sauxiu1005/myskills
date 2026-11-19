// om samples build — assembles the real-instrument pack from public-domain (CC0) libraries, plus two CC-BY
// pianos (the grand and an electric). Each file is fetched from its upstream repository at a pinned commit,
// trimmed (leading silence off, a few seconds kept, faded), resampled to 48 kHz FLAC or Opus (stereo kept as
// recorded, mono stays mono), and its true pitch is measured (names in sample libraries are sometimes an octave off). Multi-mic
// drum kits are mixed down to stereo here (close mic centre, overheads panned). The result is a folder with
// manifest.json that samples.js reads; without it the score falls back to synthesis.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OmError } from './project.js';
import { packDir } from './samples.js';

// octave: the library's naming convention against scientific pitch (Versilian names middle C "C3"),
// verified by measuring the recordings (autocorrelation, and the spectral peak for the bells).
const VSCO = { octave: 12, repo: 'sgossner/VSCO-2-CE', sha: '440300901dfe9275fd84e0b7763af1f8443ae62e', license: 'CC0-1.0', credit: 'Versilian Studios / Sam Gossner — VSCO 2 Community Edition' };
const VCSL = { octave: 12, repo: 'sgossner/VCSL', sha: 'c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e', license: 'CC0-1.0', credit: 'Versilian Studios — Versilian Community Sample Library' };
const WURLI = { repo: 'sfzinstruments/GregSullivan.E-Pianos', sha: '8c3e581acda3594b553948ff0222d4f84a698376', license: 'CC-BY-3.0', credit: 'Electric piano samples by Greg Sullivan (http://www.sullivang.net/), CC BY 3.0; trimmed, resampled and re-encoded' };
const SALAMANDER = { repo: 'sfzinstruments/SalamanderGrandPiano', sha: '3382bf9496bba2486f5ab0de55a264d1dfc38404', license: 'CC-BY-3.0', credit: 'Salamander Grand Piano V3 by Alexander Holm, CC BY 3.0; trimmed, resampled and re-encoded' };
const ERHU = { octave: -12, repo: 'sfzinstruments/aliexpress-erhu', sha: '6615047b2fd06126877483e97b8bb4af9d00b080', license: 'CC0-1.0', credit: 'Karoryfer Samples — aliexpress erhu' };
const BODY = { repo: 'sfzinstruments/body_percussion', sha: '4ac9d8966679c648b62fa10a188179e186b97f24', license: 'CC0-1.0', credit: 'Karoryfer Samples — body percussion' };
const UNRULY = { repo: 'sfzinstruments/karoryfer.unruly-drums', sha: '9bf75c2a1392f190cd1c264645653629f0b3a097', license: 'CC0-1.0', credit: 'Karoryfer Samples — Unruly Drums' };
const RUSTY = { repo: 'sfzinstruments/karoryfer.big-rusty-drums', sha: 'f07ce00df34a46b6b08375be56fe116cf15782bc', license: 'CC0-1.0', credit: 'Karoryfer Samples — Big Rusty Drums' };
const SYNTHP = { repo: 'freepats/synthesizer-percussion', sha: '39bbabce8e0e10aa259d5d94fca329f668733185', license: 'CC0-1.0', credit: 'FreePats — Synthesizer Percussion (Roberto, zenvoid.org)' };
const GUITAR = { zip: 'https://github.com/freepats/spanish-classical-guitar/releases/download/v1.0.0/SpanishClassicalGuitar-20190618-compact.zip', license: 'CC0-1.0', credit: 'FreePats — Spanish Classical Guitar' };
const BASS = { zip: 'https://github.com/freepats/electric-bass-YR/releases/download/2019-09-30/FingerBassYR-SFZ%2BWAV-20190930.7z', license: 'CC0-1.0', credit: 'FreePats — Finger Bass YR (Andrea Biasior)' };

// id: the instrument the score asks for. re: file pattern, groups (note, layer, rr). keep: layers kept
// (first = soft). every: thin pitched samples to one per n semitones. sec: kept length. lo/hi: midi range as
// named in the library (before its octave offset). release: a key-release sample of a pitched instrument.
// mono: true folds a stereo recording to mono (saves space where the image adds nothing). gain: dB, set so
// the loudest layer of a new kit peaks near -3 dBFS (soft layers keep their natural distance below it).
const SPECS = [
  // the piano is a concert grand recorded in stereo, 4 of its 16 velocity layers, every minor third (A0–C8); Opus keeps it ~14 MB
  { id: 'piano', src: SALAMANDER, dir: 'Samples', re: /^([A-G]#?\d)v(\d+)\.flac$/, keep: ['4', '8', '12', '16'], sec: 7, codec: 'opus' },
  // its hammer/damper noise on key release, recorded hot (the sfz plays it at -37 dB): relN is key 20 + N
  { id: 'piano', src: SALAMANDER, dir: 'Samples', re: /^rel(\d+)\.flac$/, midiOf: (n) => 20 + Number(n), every: 3, release: true, gain: -34, sec: 0.9, codec: 'opus' },
  // the string orchestra by section, so a score can be orchestrated (score.js plays `strings` as celli/violas/
  // violins by register); long bowed notes compress well, so these are Opus
  { id: 'violins', src: VSCO, dir: 'Strings/Violin Section/susVib', re: /_susVib_([A-G]#?\d)_v(\d)\.wav$/, keep: ['1', '2'], sec: 6, codec: 'opus' },
  { id: 'violas', src: VSCO, dir: 'Strings/Viola Section/susvib', re: /_susvib_([A-G]#?\d)_v(\d)_1\.wav$/, keep: ['1', '2'], sec: 6, codec: 'opus' },
  { id: 'celli', src: VSCO, dir: 'Strings/Cello Section/susvib', re: /^susvib_([A-G]#?\d)_v(\d)_1\.wav$/, keep: ['1', '3'], sec: 6, codec: 'opus' },
  { id: 'basses', src: VSCO, dir: 'Strings/Solo Contrabass/SusVib', re: /_SusVib_([A-G]#?\d)_v(\d)_rr1\.wav$/, keep: ['1', '3'], sec: 6, codec: 'opus' },
  { id: 'violin', src: VSCO, octave: 0, dir: 'Strings/Solo Violin/Arco Vib', re: /_ArcoVib_([A-G]#?\d)_(p|f)\.wav$/, keep: ['p', 'f'], sec: 6, codec: 'opus' }, // this player's files use scientific pitch
  { id: 'trem', src: VSCO, dir: 'Strings/Cello Section/trem', re: /^trem_([A-G]#?\d)_v(\d)_1\.wav$/, keep: ['1', '2'], hi: 47, sec: 5, codec: 'opus' },
  { id: 'trem', src: VSCO, dir: 'Strings/Viola Section/trem', re: /_trem_([A-G]#?\d)_v(\d)_rr1\.wav$/, keep: ['1', '2'], lo: 48, hi: 54, sec: 5, codec: 'opus' },
  { id: 'trem', src: VSCO, dir: 'Strings/Violin Section/Trem', re: /_Trem_([A-G]#?\d)_v(\d)\.wav$/, keep: ['1', '2'], lo: 55, sec: 5, codec: 'opus' },
  { id: 'pizz', src: VSCO, dir: 'Strings/Violin Section/Pizz', re: /_Pizz_([A-G]#?\d)_v(\d)_rr(\d)\.wav$/, keep: ['2'], lo: 55, sec: 1.6 },
  { id: 'pizz', src: VSCO, dir: 'Strings/Cello Section/pizzT', re: /pizzT_([A-G]#?\d)_v(\d)_RR(\d)\.wav$/, keep: ['2'], hi: 54, sec: 1.8 },
  { id: 'spic', src: VSCO, dir: 'Strings/Violin Section/Spic', re: /_Spic_([A-G]#?\d)_v(\d)_rr(\d)\.wav$/, keep: ['2'], lo: 55, sec: 0.8 },
  { id: 'spic', src: VSCO, dir: 'Strings/Cello Section/spic', re: /spic_([A-G]#?\d)_v(\d)_RR(\d)\.wav$/i, keep: ['2'], hi: 54, sec: 0.8 },
  { id: 'harp', src: VSCO, octave: 0, dir: 'Strings/Harp', re: /KSHarp_([A-G]#?\d)_(mf|f|mp)\.wav$/, keep: ['mf', 'f', 'mp'], sec: 3.5, codec: 'opus' },
  { id: 'glock', src: VSCO, dir: 'Percussion/Glock', re: /glock_medium_([A-G]#?\d)\.wav$/, sec: 2.5 },
  { id: 'marimba', src: VSCO, dir: 'Percussion/Marimba', re: /Marimba_hit_Outrigger_([A-G]#?\d)_loud_01\.wav$/, sec: 2 },
  { id: 'vibes', src: VCSL, dir: 'Idiophones/Struck Idiophones/Vibraphone/Soft Mallets', re: /Vibes_soft_([A-G]#?\d)_v(\d)_rr\d_Main\.wav$/, keep: ['1', '2'], sec: 3.5, codec: 'opus' },
  { id: 'flute', src: VSCO, dir: 'Woodwinds/Flute/susNV', re: /LDFlute_susNV_([A-G]#?\d)_v(\d)_1\.wav$/, keep: ['1'], sec: 4, codec: 'opus' },
  { id: 'horn', src: VSCO, dir: 'Brass/F Horn/sus', re: /MOHorn_sus_([A-G]#?\d)_v(\d)_1\.wav$/, keep: ['2'], sec: 4 },
  { id: 'hornstac', src: VSCO, dir: 'Brass/F Horn/stac', re: /MOHorn_stac_([A-G]#?\d)_v(\d)_rr1\.wav$/, keep: ['3'], sec: 1 },
  { id: 'dantranh', src: VCSL, dir: 'Chordophones/Zithers/Dan Tranh/Normal', re: /^([A-G]#?\d)_(mf|f|ff)_1\.wav$/, keep: ['f'], sec: 3.5 },
  { id: 'erhu', src: ERHU, dir: 'Samples/sus', re: /erhu_([a-g]b?\d)_sus_rr1\.wav$/, sec: 4, codec: 'opus' },
  { id: 'wurli', src: WURLI, dir: 'Wurlitzer EP200/Samples', re: /^([a-g]b?\d)(mp|f)\.flac$/, keep: ['mp', 'f'], sec: 3.5 },
  { id: 'guitar', src: GUITAR, inner: /samples\/([A-G]#?\d)\.ogg$/, every: 2, sec: 3.5 },
  { id: 'ebass', src: BASS, inner: /samples\/finger\/([A-G]#?)\.wav$/, sec: 2.5 },
  // unpitched: layer = velocity order, several round robins
  { id: 'kick', src: VCSL, dir: 'Membranophones/Struck Membranophones/Bass Drum 1', re: /BDrumNew_hit_v(\d)_rr(\d)_Sum\.wav$/, drum: true, keep: ['5', '7'], sec: 0.9 },
  { id: 'snare', src: VCSL, dir: 'Membranophones/Struck Membranophones/Snare Drum, Modern 2', re: /Snare3M_HitSN_v(\d)_rr(\d)_Mid\.wav$/, drum: true, keep: ['3', '5'], sec: 0.7 },
  { id: 'hat', src: VCSL, dir: 'Idiophones/Struck Idiophones/Hi-Hat Cymbal', re: /HiHat_HitC_v(\d)_rr(\d)_Mid\.wav$/, drum: true, keep: ['2', '4'], sec: 0.4 },
  { id: 'ohat', src: VCSL, dir: 'Idiophones/Struck Idiophones/Hi-Hat Cymbal', re: /HiHat_HitO_rr(\d)()_Mid\.wav$/, drum: true, sec: 1.2 },
  { id: 'tom', src: VCSL, dir: 'Membranophones/Struck Membranophones/Tom 1/Stick', re: /TomH_HitS_v(\d)_rr(\d)_Mid\.wav$/, drum: true, keep: ['3', '4'], sec: 1 },
  { id: 'crash', src: VCSL, dir: 'Idiophones/Struck Idiophones/Suspended Cymbal 1', re: /susCymb1_hit_(f|fff)(1)\.wav$/, drum: true, keep: ['f', 'fff'], sec: 3.5 },
  { id: 'clap', src: VCSL, dir: 'Idiophones/Struck Idiophones/Claps', re: /Clap_rr(\d)()\.wav$/, drum: true, sec: 0.5 },
  { id: 'woodblock', src: VCSL, dir: 'Idiophones/Struck Idiophones/Woodblock', re: /wood_click_(f)_rr(\d)\.wav$/, drum: true, sec: 0.4 },
  { id: 'shaker', src: VCSL, dir: 'Idiophones/Struck Idiophones/Shaker, Large', re: /LShaker_Hit_rr(\d)()_Mid\.wav$/, drum: true, sec: 0.4 },
  { id: 'tamb', src: VCSL, dir: 'Idiophones/Struck Idiophones/Tambourine 1', re: /Tamb1_Hit_v(\d)_rr(\d)_Mid\.wav$/, drum: true, sec: 0.6 },
  { id: 'snap', src: BODY, dir: 'Samples/body', re: /snap_(r)_rr(\d)\.wav$/, drum: true, sec: 0.4 },
  // pop acoustic kit: Karoryfer Unruly Drums, close mic in the centre + overheads (or the kit's own stereo
  // pair) mixed to stereo. tpl: {m} mic folder, {l} velocity layer, {rr} round robin; mics: p pan -1..1 or 'st' (keep
  // the file's own stereo), w weight. layers are the kept velocity numbers (first = soft).
  { id: 'pk_kick', src: UNRULY, tpl: 'Samples/k20/{m}/rr{rr}/kick_clean_vl{l}_rr{rr}.flac', mics: [{ m: 'in', p: 0, w: 0.8 }, { m: 'out', p: 0, w: 0.5 }, { m: 'oh', p: 'st', w: 0.6 }], layers: ['3', '7'], rrs: ['1', '2'], drum: true, gain: 6, sec: 0.8 },
  { id: 'pk_snare', src: UNRULY, tpl: 'Samples/s14/{m}/rr{rr}/s14_center_vl{l}_rr{rr}.flac', mics: [{ m: 'top', p: 0, w: 1 }, { m: 'ohl', p: -1, w: 0.7 }, { m: 'ohr', p: 1, w: 0.7 }], layers: ['3', '7'], rrs: ['1', '2'], drum: true, gain: 4, sec: 0.7 },
  { id: 'pk_rim', src: UNRULY, tpl: 'Samples/s14/{m}/rr{rr}/s14_sstick_vl{l}_rr{rr}.flac', mics: [{ m: 'top', p: 0, w: 1 }, { m: 'ohl', p: -1, w: 0.7 }, { m: 'ohr', p: 1, w: 0.7 }], layers: ['2', '5'], rrs: ['1', '2'], drum: true, gain: 17, sec: 0.4 },
  { id: 'pk_rimshot', src: UNRULY, tpl: 'Samples/s14/{m}/rr{rr}/s14_rimshot_vl{l}_rr{rr}.flac', mics: [{ m: 'top', p: 0, w: 1 }, { m: 'ohl', p: -1, w: 0.7 }, { m: 'ohr', p: 1, w: 0.7 }], layers: ['2', '5'], rrs: ['1', '2'], drum: true, gain: 6, sec: 0.7 },
  { id: 'pk_hat', src: UNRULY, tpl: 'Samples/h14/{m}/rr{rr}/hh_closed_tip_vl{l}_rr{rr}.flac', mics: [{ m: 'cl', p: 0, w: 1 }, { m: 'ohl', p: -1, w: 0.7 }, { m: 'ohr', p: 1, w: 0.7 }], layers: ['2', '6'], rrs: ['1', '2'], drum: true, gain: 2, sec: 0.35 },
  { id: 'pk_ohat', src: UNRULY, tpl: 'Samples/h14/{m}/rr{rr}/hh_open_tip_vl{l}_rr{rr}.flac', mics: [{ m: 'cl', p: 0, w: 1 }, { m: 'ohl', p: -1, w: 0.7 }, { m: 'ohr', p: 1, w: 0.7 }], layers: ['3', '6'], rrs: ['1', '2'], drum: true, gain: 8, sec: 1.4 },
  { id: 'pk_phat', src: UNRULY, tpl: 'Samples/h14/{m}/rr{rr}/hh_footchik_vl{l}_rr{rr}.flac', mics: [{ m: 'cl', p: 0, w: 1 }, { m: 'ohl', p: -1, w: 0.7 }, { m: 'ohr', p: 1, w: 0.7 }], layers: ['3'], rrs: ['1', '2'], drum: true, gain: 14, sec: 0.25 },
  { id: 'pk_crash', src: UNRULY, tpl: 'Samples/c16/{m}/rr{rr}/cr_edge_vl{l}_rr{rr}.flac', mics: [{ m: 'cl', p: 0, w: 0.8 }, { m: 'oh', p: 'st', w: 0.8 }], layers: ['2', '4'], rrs: ['1', '2'], drum: true, gain: 13, sec: 3.5 },
  { id: 'pk_ride', src: UNRULY, tpl: 'Samples/r20/{m}/rr{rr}/ride_bow_vl{l}_rr{rr}.flac', mics: [{ m: 'cl', p: 0, w: 0.8 }, { m: 'oh', p: 'st', w: 0.8 }], layers: ['3', '6'], rrs: ['1', '2'], drum: true, gain: 1, sec: 3 },
  // Unruly has no toms: Big Rusty Drums (same maker, same licence) 14" rack tom
  { id: 'pk_tom', src: RUSTY, tpl: 'Samples/tom_14/center/{m}/t14_vl{l}_rr{rr}.flac', mics: [{ m: 'cl', p: 0, w: 1 }, { m: 'oh', p: 'st', w: 0.8 }], layers: ['2', '5'], rrs: ['1', '2'], drum: true, gain: 5, sec: 1 },
  // electronic kit: FreePats Synthesizer Percussion (vintage analog-synth style, mono). map: file → [layer, rr]
  { id: 'ek_kick', src: SYNTHP, dir: 'samples', map: { Kick04: ['1', '1'], Kick06: ['1', '2'] }, drum: true, gain: -8, sec: 0.8 },
  { id: 'ek_snare', src: SYNTHP, dir: 'samples', map: { Snare09: ['1', '1'], Snare14: ['1', '2'] }, drum: true, gain: -3, sec: 0.6 },
  { id: 'ek_clap', src: SYNTHP, dir: 'samples', map: { Clap01: ['1', '1'] }, drum: true, gain: -3, sec: 0.5 },
  { id: 'ek_hat', src: SYNTHP, dir: 'samples', map: { 'ClosedHiHat01-01': ['1', '1'], 'ClosedHiHat02-01': ['1', '2'] }, drum: true, gain: -3, sec: 0.3 },
  { id: 'ek_ohat', src: SYNTHP, dir: 'samples', map: { 'OpenHiHat02-01': ['1', '1'] }, drum: true, gain: -3, sec: 1.2 },
];

const PC = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
export function noteToMidi(name) {
  const m = /^([a-gA-G])(#|b|s)?(-?\d+)?$/.exec(name);
  if (!m) return null;
  const pc = PC[m[1].toLowerCase()] + (m[2] === '#' || m[2] === 's' ? 1 : m[2] === 'b' ? -1 : 0);
  return m[3] == null ? pc : 12 * (Number(m[3]) + 1) + pc;
}

// fundamental by normalized autocorrelation (YIN-like difference function) over 50 ms–450 ms of the note
export function measurePitch(x, rate) {
  const a = Math.floor(0.05 * rate), n = Math.min(x.length - a, Math.floor(0.4 * rate));
  if (n < rate * 0.05) return null;
  const minLag = Math.floor(rate / 2200), maxLag = Math.min(Math.floor(rate / 27), Math.floor(n / 2));
  const d = new Float64Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) { let s = 0; for (let i = a; i < a + n - lag; i += 2) { const v = x[i] - x[i + lag]; s += v * v; } d[lag] = s; }
  let run = 0, best = -1;
  const cm = new Float64Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) { run += d[lag]; cm[lag] = d[lag] * (lag - minLag + 1) / (run || 1); }
  for (let lag = minLag + 1; lag < maxLag; lag++) if (cm[lag] < 0.15 && cm[lag] <= cm[lag - 1] && cm[lag] <= cm[lag + 1]) { best = lag; break; }
  if (best < 0) { let m = Infinity; for (let lag = minLag; lag <= maxLag; lag++) if (cm[lag] < m) { m = cm[lag]; best = lag; } if (m > 0.4) return null; }
  const y0 = cm[best - 1] ?? cm[best], y1 = cm[best], y2 = cm[best + 1] ?? cm[best];
  const shift = (y0 - y2) / (2 * (y0 - 2 * y1 + y2) || 1);
  return 69 + 12 * Math.log2(rate / (best + shift) / 440);
}

// Fallback for notes the autocorrelation cannot read (below ~30 Hz, above ~2 kHz, weak fundamentals): the
// strongest of the first five partials within ±75 cents of where the name says it should be, divided back
// down to the fundamental. Returns a fractional midi number, or null. Trusts the name for the octave.
export function measureSpectral(x, rate, midi) {
  const n = 1 << 17, re = new Float64Array(n), im = new Float64Array(n), st = Math.floor(0.03 * rate), len = Math.min(n, x.length - st);
  if (len < rate * 0.1) return null;
  for (let i = 0; i < len; i++) re[i] = x[st + i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / len));
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let m = 2; m <= n; m <<= 1) {
    const a = (-2 * Math.PI) / m, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += m) { let cr = 1, ci = 0; for (let k = 0; k < m / 2; k++) { const u = i + k, v = u + m / 2, tr = re[v] * cr - im[v] * ci, ti = re[v] * ci + im[v] * cr; re[v] = re[u] - tr; im[v] = im[u] - ti; re[u] += tr; im[u] += ti; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } }
  }
  const mag = (k) => Math.hypot(re[k], im[k]), f0 = 440 * 2 ** ((midi - 69) / 12);
  let best = null;
  for (let k = 1; k <= 5; k++) {
    const lo = Math.floor(k * f0 * 2 ** (-0.75 / 12) * n / rate), hi = Math.ceil(k * f0 * 2 ** (0.75 / 12) * n / rate);
    if (hi > n / 2 - 2) break;
    let pk = lo;
    for (let b = lo; b <= hi; b++) if (mag(b) > mag(pk)) pk = b;
    const a = mag(pk - 1), c = mag(pk), d = mag(pk + 1), sh = (a - d) / (2 * (a - 2 * c + d) || 1);
    if (!best || c > best.amp) best = { amp: c, f: ((pk + sh) * rate) / n / k };
  }
  return best ? 69 + 12 * Math.log2(best.f / 440) : null;
}

const run = (cmd, args) => new Promise((res) => { const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] }); let e = ''; p.stderr.on('data', (d) => (e += d)); p.on('close', (c) => res(c === 0 ? null : e.trim().split('\n').pop() || `exit ${c}`)); });
async function pool(items, n, fn) { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } })); return out; }

function tree(src, cache) {
  const f = join(cache, `${src.repo.replace('/', '_')}@${src.sha.slice(0, 8)}.json`);
  if (!existsSync(f)) {
    const r = spawnSync('curl', ['-sfL', `https://api.github.com/repos/${src.repo}/git/trees/${src.sha}?recursive=1`, '-o', f]);
    if (r.status !== 0) throw new OmError(`could not list ${src.repo} (curl exit ${r.status})`);
  }
  return JSON.parse(readFileSync(f, 'utf8')).tree.filter((x) => x.type === 'blob').map((x) => x.path);
}

function archive(src, cache) {
  const dir = join(cache, src.zip.split('/').pop().replace(/%2B/g, '+').replace(/\.(zip|7z)$/, ''));
  if (!existsSync(dir)) {
    const file = dir + (src.zip.endsWith('.7z') ? '.7z' : '.zip');
    if (spawnSync('curl', ['-sfL', src.zip, '-o', file]).status !== 0) throw new OmError(`could not download ${src.zip}`);
    mkdirSync(dir, { recursive: true });
    if (spawnSync('bsdtar', ['-xf', file, '-C', dir]).status !== 0) throw new OmError(`could not unpack ${file} (needs bsdtar)`);
  }
  const files = [];
  const walk = (d) => { for (const e of readdirSync(d)) { const p = join(d, e); statSync(p).isDirectory() ? walk(p) : files.push(p); } };
  walk(dir);
  return { dir, files };
}

const thin = (list, every) => { if (!every || every <= 1) return list; const out = []; for (const s of list.sort((a, b) => a.midi - b.midi)) if (!out.length || s.midi - out.at(-1).midi >= every || s.midi === out.at(-1).midi) out.push(s); return out; };

const g2 = (p) => [Math.cos(((p + 1) * Math.PI) / 4), Math.sin(((p + 1) * Math.PI) / 4)].map((v) => v.toFixed(4)); // equal-power pan: centre 0.7071 per side, hard pan 1 / 0

// filter graph for one job: one input → plain chain; several mics → pan each, sum, then the chain
function graph(spec, nIn, tail) {
  if (nIn === 1) return { args: ['-af', `aformat=channel_layouts=mono|stereo,${spec.gain ? `volume=${spec.gain}dB,` : ''}${tail}`] };
  const parts = spec.mics.map((m, i) => (m.p === 'st'
    ? `[${i}:a]aformat=channel_layouts=stereo,volume=${m.w}[m${i}]`
    : `[${i}:a]aformat=channel_layouts=mono,pan=stereo|c0=${g2(m.p)[0]}*c0|c1=${g2(m.p)[1]}*c0,volume=${m.w}[m${i}]`));
  const sum = `${spec.mics.map((_, i) => `[m${i}]`).join('')}amix=inputs=${nIn}:normalize=0:duration=longest,${spec.gain ? `volume=${spec.gain}dB,` : ''}${tail}`;
  return { args: ['-filter_complex', `${parts.join(';')};${sum}`] };
}

const channelsOf = (f) => Number(spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=channels', '-of', 'csv=p=0', f]).stdout.toString().trim()) || 1;

export async function buildSamples({ out = packDir(), only = null, log = () => {} } = {}) {
  if (spawnSync('ffmpeg', ['-version']).status !== 0) throw new OmError('om samples build needs ffmpeg');
  const cache = join(out, '.src');
  mkdirSync(cache, { recursive: true });
  const jobs = [];
  for (const spec of SPECS) {
    if (only && !only.includes(spec.id)) continue;
    let cands = [];
    if (spec.tpl) {
      const have = new Set(tree(spec.src, cache));
      for (const l of spec.layers) for (const rr of spec.rrs) {
        const paths = spec.mics.map((m) => spec.tpl.replace(/\{m\}/g, m.m).replace(/\{l\}/g, l).replace(/\{rr\}/g, rr));
        if (paths.every((q) => have.has(q))) cands.push({ path: paths[0], paths, name: null, layer: l, rr });
        else log(`warning  ${spec.id} vl${l} rr${rr}: a mic file is missing upstream`);
      }
    } else if (spec.src.zip) {
      const { dir, files } = archive(spec.src, cache);
      for (const f of files) { const m = spec.inner.exec(f.slice(dir.length + 1).replace(/\\/g, '/')); if (m) cands.push({ local: f, name: m[1], layer: 'x', rr: '1' }); }
    } else {
      for (const path of tree(spec.src, cache)) {
        if (!path.startsWith(spec.dir + '/') || path.slice(spec.dir.length + 1).includes('/')) continue;
        const file = path.split('/').pop();
        if (spec.map) { const k = file.replace(/\.[^.]+$/, ''); if (spec.map[k]) cands.push({ path, paths: [path], name: null, layer: spec.map[k][0], rr: spec.map[k][1] }); continue; }
        const m = spec.re.exec(file);
        if (!m) continue;
        if (spec.drum) cands.push({ path, name: null, layer: m[1] || 'x', rr: m[2] || '1' });
        else cands.push({ path, name: m[1], layer: m[2] || 'x', rr: m[3] || '1' });
      }
    }
    if (spec.keep) cands = cands.filter((c) => spec.keep.includes(c.layer) || (!spec.drum && c.layer === 'x'));
    if (!spec.drum) {
      cands.forEach((c) => (c.midi = spec.midiOf ? spec.midiOf(c.name) : noteToMidi(c.name)));
      cands = cands.filter((c) => c.midi != null && (spec.lo == null || c.midi >= spec.lo) && (spec.hi == null || c.midi <= spec.hi));
      // keep one sample per pitch & layer (first rr), thinned to every n semitones (per layer)
      const byLayer = {};
      for (const c of cands) (byLayer[c.layer] ||= new Map()).has(c.midi) ? null : byLayer[c.layer].set(c.midi, c);
      cands = Object.values(byLayer).flatMap((m) => thin([...m.values()], spec.every));
    }
    for (const c of cands) jobs.push({ spec, c });
  }
  log(`samples  ${jobs.length} files from ${new Set(jobs.map((j) => j.spec.src.repo || j.spec.src.zip)).size} sources`);
  const insts = {};
  let failed = 0;
  await pool(jobs, 8, async ({ spec, c }, k) => {
    const rawOf = (path) => join(cache, 'raw', spec.src.repo.replace('/', '_'), path);
    const raws = c.local ? [c.local] : (c.paths || [c.path]).map(rawOf);
    for (let i = 0; i < raws.length; i++) {
      if (c.local || existsSync(raws[i])) continue;
      const path = (c.paths || [c.path])[i];
      mkdirSync(join(raws[i], '..'), { recursive: true });
      const err = await run('curl', ['-sfL', '--retry', '3', `https://raw.githubusercontent.com/${spec.src.repo}/${spec.src.sha}/${path.split('/').map(encodeURIComponent).join('/')}`, '-o', `${raws[i]}.part`]);
      if (err) { failed++; log(`warning  ${path}: download failed`); return; }
      renameSync(`${raws[i]}.part`, raws[i]);
    }
    const name = spec.drum ? `${spec.id}_${c.layer}_${c.rr}` : `${spec.id}_${spec.release ? 'rel_' : ''}${c.midi}_${c.layer}`;
    const rel = join(spec.id, `${name.replace(/[^\w.-]/g, '_')}.${spec.codec || 'flac'}`);
    mkdirSync(join(out, spec.id), { recursive: true });
    const fade = Math.min(0.25, spec.sec / 4);
    const tail = `silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.003,atrim=0:${spec.sec},afade=t=out:st=${(spec.sec - fade).toFixed(3)}:d=${fade},aresample=48000`;
    const g = graph(spec, raws.length, tail);
    const err = await run('ffmpeg', ['-v', 'error', '-y', ...raws.flatMap((r) => ['-i', r]), ...g.args, ...(spec.mono ? ['-ac', '1'] : []), ...(spec.codec === 'opus' ? ['-c:a', 'libopus', '-b:a', '128k'] : ['-sample_fmt', 's16', '-compression_level', '12']), join(out, rel)]);
    if (err) { failed++; log(`warning  ${rel}: ${err}`); return; }
    const entry = { file: rel, layer: c.layer, rr: c.rr, ch: channelsOf(join(out, rel)) };
    if (!spec.drum) {
      const pcm = spawnSync('ffmpeg', ['-v', 'error', '-i', join(out, rel), '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'], { maxBuffer: 64 << 20 }).stdout;
      const x = new Float32Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 4));
      const hasOct = /\d/.test(c.name);
      let root = c.midi + (spec.octave ?? spec.src.octave ?? 0);
      if (spec.release) entry.root = root; // key-release noise has no pitch to measure
      else {
        let meas = measurePitch(x, 48000), tol = 0.5;
        if (hasOct && (meas == null || Math.abs(meas - root) > 0.5)) { const sp = measureSpectral(x, 48000, root); if (sp != null) { meas = sp; tol = 0.75; } }
        if (!hasOct) root = meas != null ? Math.round((meas - c.midi) / 12) * 12 + c.midi : 36 + c.midi; // name has no octave
        entry.root = root;
        if (meas != null && Math.abs(meas - root) <= tol) entry.cents = Math.round((meas - root) * 100); // fine tuning only; a wilder reading is a partial, not the pitch
      }
    }
    const inst = (insts[spec.id] ||= { license: new Set(), credit: new Set(), drum: !!spec.drum, samples: [], releases: [] });
    inst.license.add(spec.src.license); inst.credit.add(spec.src.credit);
    (spec.release ? inst.releases : inst.samples).push(entry);
    if ((k + 1) % 50 === 0) log(`samples  ${k + 1}/${jobs.length}`);
  });
  const prev = existsSync(join(out, 'manifest.json')) ? JSON.parse(readFileSync(join(out, 'manifest.json'), 'utf8')).instruments : {};
  const instruments = { ...(only ? prev : {}) };
  const order = (a, b) => (a.root ?? 0) - (b.root ?? 0) || String(a.layer).localeCompare(String(b.layer)) || String(a.rr).localeCompare(String(b.rr));
  for (const [id, v] of Object.entries(insts)) {
    instruments[id] = { license: [...v.license].join(' + '), credit: [...v.credit], drum: v.drum, channels: Math.max(...v.samples.map((x) => x.ch)), samples: v.samples.sort(order) };
    if (v.releases.length) instruments[id].releases = v.releases.sort(order);
  }
  writeFileSync(join(out, 'manifest.json'), JSON.stringify({ version: 2, built: new Date().toISOString(), instruments }, null, 1));
  writeFileSync(join(out, 'NOTICE.txt'), [...new Set(Object.values(instruments).flatMap((v) => v.credit))].map((c) => `- ${c}`).join('\n') + '\n\nAll CC0 except the grand piano (Salamander Grand Piano V3 by Alexander Holm) and the Wurlitzer electric piano (by Greg Sullivan), both CC BY 3.0, trimmed, resampled and re-encoded here. Versilian Studios asks for credit and that the samples are not sold on their own.\n');
  let bytes = 0;
  for (const v of Object.values(instruments)) for (const s of [...v.samples, ...(v.releases || [])]) bytes += existsSync(join(out, s.file)) ? statSync(join(out, s.file)).size : 0;
  if (!only) rmSync(join(cache, 'raw'), { recursive: true, force: true });
  const count = (v) => v.samples.length + (v.releases?.length || 0);
  return `samples  ${out}\n         ${Object.keys(instruments).length} instruments, ${Object.values(instruments).reduce((a, v) => a + count(v), 0)} samples, ${(bytes / 1e6).toFixed(1)} MB${failed ? `, ${failed} failed` : ''}\n         ${Object.entries(instruments).map(([k, v]) => `${k}×${count(v)}`).join(' ')}`;
}
