// The score: music composed for this film from what it declares. A style is a small arrangement —
// instruments plus 16-step patterns per layer, each layer entering above an energy gate — and the
// sections (scene labels), the drop, the ending and the brand's motif are what make every film's
// music its own. Producer's rules this follows: the cut and the downbeat are one frame; the big moment
// is preceded by a breath (everything drops out for a beat, a swell pulls in) and lands on the tonic
// with the full band; the film ends on its sonic logo — ringing out, buttoned on a final hit, or
// stopped dead; the music steps back under big hits and under the voice.
import { hit, sampler } from './samples.js';
import { N, RATE, TAU, biquad, decay, drive, ensemble, env, flute, glide, metal, mix, mtof, noise, osc, partials, peakTo, piano, reverse, rhodes, rng, shape, sinp, ks, sub808, synth, vibrato } from './dsp.js';

const hash = (s) => [...String(s)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261);

// ---------- instruments: (f, sec, vel, r) → mono ----------

function padNote(f, sec, r) {
  const n = N(sec), o = new Float32Array(n), att = N(Math.min(0.35, sec / 3)), rel = N(Math.min(0.5, sec / 3));
  for (const det of [-0.004, 0.004]) {
    for (let k = 1; k <= 7; k++) {
      let ph = r(); const inc = (f * k * (1 + det)) / RATE, amp = (1 / k) * Math.exp(-k * 0.35);
      for (let i = 0; i < n; i++) { o[i] += sinp(ph) * amp; ph += inc; }
    }
  }
  for (let i = 0; i < n; i++) o[i] *= Math.min(1, i / att, (n - i) / rel);
  return o;
}

const strum = (f, sec, v, r) => ks(f, sec, { bright: 0.35 + 0.4 * v, keep: 0.997 }, r);

export const INSTRUMENTS = {
  epiano: (f, sec) => {
    const n = N(sec), o = new Float32Array(n);
    let pc = 0, pm = 0;
    for (let i = 0; i < n; i++) {
      const t = i / RATE, I = 1.4 * Math.exp(-t / 0.25);
      pm += f / RATE; pc += f / RATE;
      o[i] = (sinp(pc + I * sinp(pm) / TAU) + 0.18 * sinp(2 * pc)) * Math.exp(-t / 0.9) * Math.min(1, t / 0.004);
    }
    return o;
  },
  pluck: (f, sec) => partials(f, sec, [1, 2, 3, 4, 5, 6, 7].map((k) => [k, 1 / Math.pow(k, 1.9), 0.5 / Math.pow(k, 0.9)]), 0.006),
  bell: (f, sec) => partials(f, sec, [[1, 1, 1.1], [2, 0.42, 0.6], [3, 0.2, 0.35], [4.07, 0.1, 0.22], [5.4, 0.05, 0.12]], 0.002),
  marimba: (f, sec) => partials(f, sec, [[1, 1, 0.38], [3.93, 0.28, 0.08], [9.2, 0.08, 0.03]], 0.002),
  kalimba: (f, sec) => partials(f, sec, [[1, 1, 0.7], [5.4, 0.22, 0.05], [2.01, 0.12, 0.3]], 0.003),
  glass: (f, sec) => partials(f, sec, [[1, 1, 1.4], [2.32, 0.35, 0.6], [4.25, 0.15, 0.3], [6.63, 0.06, 0.15]], 0.003),
  glock: (f, sec) => partials(f, sec, [[1, 1, 1.6], [2.76, 0.32, 0.5], [5.4, 0.14, 0.2], [8.93, 0.06, 0.08]], 0.001),
  piano: (f, sec, v, r) => piano(f, sec, v, r),
  rhodes: (f, sec, v) => rhodes(f, sec, v, 0.35),
  guitar: (f, sec, v, r) => ks(f, sec, { bright: 0.45 + 0.3 * v, keep: 0.9975 }, r),
  uke: (f, sec, v, r) => ks(f, sec, { bright: 0.7, keep: 0.993 }, r),
  harp: (f, sec, v, r) => ks(f, sec, { bright: 0.4, keep: 0.9985 }, r),
  pizz: (f, sec, v, r) => biquad(ks(f, Math.min(sec, 0.6), { bright: 0.3 + 0.2 * v, keep: 0.982 }, r), 'lp', 2600),
  guzheng: (f, sec, v, r) => ks(f, sec, { bright: 0.8, keep: 0.9988, bend: vibrato(0.004, 5, 0.18) }, r),
  pad: (f, sec, v, r) => padNote(f, sec, r),
  warmpad: (f, sec, v, r) => ensemble(f, sec, { voices: 6, spread: 0.006, cutoff: 1500, att: Math.min(0.5, sec / 3), rel: 0.6 }, r),
  strings: (f, sec, v, r) => ensemble(f, sec, { voices: 5, spread: 0.007, cutoff: 2600, att: Math.min(0.35, sec / 3), rel: 0.5 }, r),
  stacc: (f, sec, v, r) => ensemble(f, Math.min(sec, 0.2), { voices: 4, spread: 0.006, cutoff: 1800 + 1800 * v, att: 0.006, rel: 0.08 }, r),
  supersaw: (f, sec, v, r) => ensemble(f, sec, { voices: 7, spread: 0.012, cutoff: 4200, att: 0.02, rel: 0.4 }, r),
  horn: (f, sec, v, r) => ensemble(f, sec, { voices: 3, spread: 0.004, cutoff: (u) => 700 + 1500 * Math.min(1, (u * sec) / 0.25), att: 0.06, rel: 0.25 }, r),
  brass: (f, sec, v) => mix([synth(f, sec, { lo: 500, hi: 3600, close: 0.12, q: 1.4 })], [synth(f * 1.004, sec, { lo: 500, hi: 3600, close: 0.12, q: 1.4 }), 0.8]),
  saw: (f, sec) => mix([synth(f, sec, { lo: 700, hi: 2400, close: 0.4, q: 0.8, bend: vibrato(0.004, 4.8, 0.35), rel: 0.15 })], [synth(f * 1.006, sec, { wave: 'square', lo: 600, hi: 1800, close: 0.4, q: 0.7, bend: vibrato(0.004, 4.8, 0.35), rel: 0.15 }), 0.5]),
  sqlead: (f, sec) => biquad(env(osc('pulse', f, sec, { duty: 0.25, bend: vibrato(0.008, 6, 0.18) }), 0.003, 0.04), 'lp', 5500),
  chip: (f, sec) => env(osc('pulse', f, Math.min(sec, 0.25), { duty: 0.125 }), 0.001, 0.02),
  tri: (f, sec) => env(osc('tri', f, sec), 0.002, 0.02),
  clav: (f, sec, v, r) => biquad(biquad(ks(f, Math.min(sec, 0.25), { bright: 0.85, keep: 0.985 }, r), 'hp', 300), 'bp', 1400, 0.5),
  cowbell: (f, sec) => decay(biquad(mix([osc('square', f, 0.4)], [osc('square', f * 1.48, 0.4), 0.7]), 'bp', f * 1.6, 1.4), 0.12),
  flute: (f, sec, v, r) => flute(f, sec, { breath: 0.1 }, r),
  dizi: (f, sec, v, r) => flute(f, sec, { breath: 0.2, vib: 0.009 }, r),
  bass: (f, sec) => { const o = partials(f, sec, [[1, 1, 1.2], [2, 0.3, 0.5], [3, 0.12, 0.3]], 0.008); return env(o, 0.008, 0.08); },
  synbass: (f, sec) => synth(f, sec, { lo: 140, hi: 1100, close: 0.1, q: 2.2, rel: 0.03 }),
  sub808: (f, sec, v, r, from) => sub808(f, sec, { from, tau: 0.8 }),
  sinebass: (f, sec) => env(osc('sine', f, sec), 0.25, 0.6),
  synpluck: (f, sec) => mix([synth(f, Math.min(sec, 1.2), { lo: 250, hi: 3200, close: 0.11, q: 1.3, rel: 0.15 })], [synth(f * 1.005, Math.min(sec, 1.2), { lo: 250, hi: 3200, close: 0.11, q: 1.3, rel: 0.15 }), 0.7]),
  vibes: (f, sec) => shape(partials(f, sec, [[1, 1, 1.6], [4, 0.25, 0.4], [10, 0.05, 0.1]], 0.003), (u, t) => 1 - 0.25 * (1 - Math.cos(TAU * 5.5 * t))),
  erhu: (f, sec, v, r) => flute(f, sec, { breath: 0.06, vib: 0.012 }, r),
  lowstr: (f, sec, v, r) => ensemble(f, sec, { voices: 4, spread: 0.005, cutoff: 900, att: 0.3, rel: 0.5 }, r),
};

// ---------- drums: (r) → mono ----------

const kick = (f0 = 150, f1 = 46, tau = 0.17, len = 0.36) => mix([glide(f0, f1, len, tau)], [decay(biquad(noise(0.012, rng(7)), 'hp', 2000), 0.004), 0.25]);
export const DRUMS = {
  kick: () => kick(),
  kick808: () => drive(glide(130, 48, 1.1, 0.42), 1.6),
  kicksoft: () => biquad(kick(120, 50, 0.12, 0.3), 'lp', 1800),
  kickchip: () => env(osc('square', 1, 0.12, { bend: (t) => 220 * Math.exp(-t / 0.025) + 40 }), 0.001, 0.03),
  snare: (r) => mix([glide(230, 175, 0.12, 0.05)], [decay(biquad(noise(0.25, r), 'hp', 1600), 0.1), 0.9]),
  snarelofi: (r) => biquad(mix([glide(210, 170, 0.1, 0.04)], [decay(biquad(noise(0.2, r), 'bp', 2600, 0.7), 0.075), 1.1]), 'lp', 5000),
  snaregated: (r) => shape(mix([glide(220, 170, 0.1, 0.06)], [biquad(noise(0.3, r), 'hp', 1200), 0.8]), (u, t) => (t < 0.22 ? Math.exp(-t / 0.4) : Math.max(0, 1 - (t - 0.22) / 0.01) * 0.6)),
  snarechip: (r) => decay(noise(0.12, r), 0.04),
  snarebig: (r) => mix([glide(200, 150, 0.2, 0.08)], [decay(biquad(noise(0.5, r), 'hp', 900), 0.2), 1]),
  clap: (r) => { const b = biquad(noise(0.2, r), 'bp', 1300, 0.9); return shape(b, (u, t) => (t < 0.03 ? (t % 0.01 < 0.004 ? 1 : 0.25) : Math.exp(-(t - 0.03) / 0.06))); },
  hat: (r) => decay(biquad(noise(0.06, r), 'hp', 7000), 0.022),
  hat808: () => metal(0.08, 0.025),
  ohat: () => metal(0.4, 0.14),
  hatchip: (r) => decay(biquad(noise(0.03, r), 'hp', 9000), 0.01),
  shaker: (r) => shape(biquad(noise(0.08, r), 'bp', 6500, 1.2), (u, t) => Math.min(1, t / 0.015) * Math.exp(-t / 0.03)),
  rim: () => partials(1700, 0.05, [[1, 1, 0.012], [2.3, 0.5, 0.008]], 0.0005),
  woodblock: () => partials(1050, 0.12, [[1, 1, 0.04], [2.9, 0.3, 0.015]], 0.0005),
  snap: (r) => mix([decay(biquad(noise(0.05, r), 'bp', 2400, 3), 0.012)], [partials(1900, 0.04, [[1, 1, 0.01]]), 0.2]),
  stomp: (r) => mix([glide(110, 55, 0.3, 0.09)], [decay(biquad(noise(0.08, r), 'lp', 700), 0.03), 0.7]),
  taiko: (r) => mix([glide(95, 58, 1.2, 0.38)], [decay(biquad(noise(0.3, r), 'lp', 400), 0.09), 0.8], [decay(biquad(noise(0.01, r), 'hp', 3000), 0.003), 0.2]),
  tom: (r) => mix([glide(160, 110, 0.5, 0.16)], [decay(biquad(noise(0.06, r), 'lp', 1200), 0.02), 0.4]),
  frame: (r) => mix([glide(120, 85, 0.35, 0.12)], [decay(biquad(noise(0.05, r), 'bp', 900, 0.8), 0.02), 0.5]),
  crash: (r) => mix([decay(biquad(noise(2.2, r), 'hp', 3500), 0.7)], [metal(2.2, 0.9, 4000), 0.6]),
};

// With the sample pack installed (om samples build), these voices play real recordings; without it, or
// for anything not listed, the synth voice above plays. Electronic styles keep their synths on purpose.
const SAMPLED = {
  piano: ['piano', { release: 0.3 }], strings: ['strings', { release: 0.45, gain: 0.8 }], lowstr: ['strings', { release: 0.5, gain: 0.8 }],
  stacc: ['spic', { release: 0.08 }], pizz: ['pizz', { release: 0.1 }], harp: ['harp', { release: 0.3 }], glock: ['glock', { release: 0.3 }],
  marimba: ['marimba', { release: 0.15 }], vibes: ['vibes', { release: 0.3 }], flute: ['flute', { release: 0.2 }], dizi: ['flute', { release: 0.2 }],
  horn: ['horn', { release: 0.3 }], brass: ['hornstac', { release: 0.08 }], guitar: ['guitar', { release: 0.2 }], guzheng: ['dantranh', { release: 0.3 }],
  erhu: ['erhu', { release: 0.25 }], rhodes: ['wurli', { release: 0.2 }], bass: ['ebass', { release: 0.12, gain: 0.55 }],
};
// The string orchestra by section. A score can write each section (violins, violas, celli, basses, a
// solo violin, tremolo); `strings` and `lowstr` give every note to the section that owns its register.
Object.assign(SAMPLED, {
  violins: ['violins', { release: 0.45, gain: 0.8 }], violas: ['violas', { release: 0.45, gain: 0.8 }], celli: ['celli', { release: 0.5, gain: 0.8 }],
  basses: ['basses', { release: 0.5, gain: 0.8 }], violin: ['violin', { release: 0.35 }], trem: ['trem', { release: 0.3, gain: 0.8 }],
});
export const SECTIONS = { strings: [['celli', 0], ['violas', 55], ['violins', 67]], lowstr: [['basses', 0], ['celli', 43]] };
const FALLBACK = { violins: 'strings', violas: 'strings', celli: 'lowstr', basses: 'lowstr', violin: 'strings', trem: 'strings' };
// one voice made of several sampled sections, each taking the notes from its lowest midi upward
export function sectioned(parts, o, make = sampler) {
  const vs = parts.map(([id, lo]) => [make(id, o), lo]).filter(([v]) => v);
  if (vs.length < parts.length) return null; // a pack without the sections: the older single patch plays
  return (f, ...a) => { const m = 69 + 12 * Math.log2(f / 440); let v = vs[0][0]; for (const [x, lo] of vs) if (m >= lo - 0.5) v = x; return v(f, ...a); };
}
const voices = new Map();
export function voice(name) {
  if (!voices.has(name)) voices.set(name, (SECTIONS[name] && sectioned(SECTIONS[name], SAMPLED[name]?.[1])) || (SAMPLED[name] && sampler(...SAMPLED[name])) || INSTRUMENTS[name] || (FALLBACK[name] && voice(FALLBACK[name])) || INSTRUMENTS.epiano);
  return voices.get(name);
}
// acoustic kits swap the drum machine for the recorded kit; small percussion is always recorded when available
// (the recorded "kick" is an orchestral bass drum — a cinematic boom, not a pop kick, so pop kits keep the synth kick)
const ACOUSTIC = { snare: 'snare', snarelofi: 'snare', snarebig: 'snare', hat: 'hat', ohat: 'ohat', tom: 'tom', clap: 'clap', shaker: 'shaker' };
const ALWAYS = { woodblock: 'woodblock', snap: 'snap', crash: 'crash', taiko: 'kick' };
const drums = new Map();
export function drum(name, acoustic = false) {
  const k = `${name}:${acoustic}`;
  if (!drums.has(k)) { const id = (acoustic && ACOUSTIC[name]) || ALWAYS[name]; const h = id && hit(id); drums.set(k, h || ((r) => DRUMS[name](r))); }
  return drums.get(k);
}
export const resetVoices = () => { voices.clear(); drums.clear(); };

// ---------- styles ----------
// Layers: [instrument, pattern(s), energy gate, gain, octave, length in steps?]. A pattern has 16 steps
// (one bar); an array alternates bar by bar. Drums: x full, o medium, g ghost, r 32nd roll, t triplet roll.
// Bass: x root, o octave up, 5 fifth, 3 third, g slide to the root (808). Arp: digits index the chord's
// tones stacked upward (0 root, 1 third, 2 fifth, 3 root 8va…). Comp: x plays the chord. '-' extends
// the previous note, '.' rests. Fields that are arrays of options (roots, loops, bpm) are picked by seed.

const D = (...layers) => layers;
export const STYLES = {
  mallet: {
    about: 'mallets, kalimba and e-piano re-voiced every scene; friendly explainer, the art-motion speedrun score',
    floor: 0.45,
    scale: 'major', roots: [65, 67, 62], bpm: [96, 112], loops: [[0, 4, 5, 3], [0, 5, 3, 4]], kit: 'clean',
    pad: ['pad', 0.055, -1], leads: ['marimba', 'vibes', 'rhodes', 'harp', 'marimba', 'vibes'], rotate: true, shine: true,
    bass: [['bass', 'x.......x.......', 0.4, 0.12, -2]],
    drums: D(['kick', 'x.......x.......', 0.6, 0.3], ['kick', '....x.......x...', 0.9, 0.3], ['hat', '..x...x...x...x.', 0.6, 0.11, 0, 0.3], ['clap', '....x.......x...', 0.75, 0.13, 0, -0.1]),
    arp: [['lead', '0.1.2.1.3.4.5.4.', 0.5, 0.06, 0]],
  },
  pulse: {
    about: 'clean synth-pop pulse: sidechained pad, offbeat synth bass, four-on-the-floor; SaaS, dev tools, AI products',
    floor: 0.55,
    scale: 'major', roots: [57, 60, 62, 64], bpm: [116, 124], loops: [[0, 5, 3, 4], [5, 3, 0, 4], [0, 4, 5, 3]], ext: 9, kit: 'clean',
    pad: ['warmpad', 0.07, -1], pump: 0.75, leads: ['synpluck'], reverb: [0.16, 1.2], stab: 'synpluck',
    bass: [['synbass', ['..x...x...x...x.', '..x...x...x.x.x.'], 0.3, 0.13, -2]],
    drums: D(['kick', 'x...x...x...x...', 0.55, 0.3], ['clap', '....x.......x...', 0.7, 0.12], ['hat808', '..x...x...x...x.', 0.45, 0.07, 0, 0.3], ['shaker', 'x.xxx.xxx.xxx.xx', 0.8, 0.03, 0, -0.3]),
    arp: [['synpluck', '0213021302130213', 0.6, 0.03, -1]],
    fill: { snare: '........x.x.xxxx' },
    variants: { dark: { scale: 'minor', loops: [[0, 5, 2, 6], [0, 3, 5, 4]], leads: ['vibes'], about: 'darker minor pulse for AI and deep tech' } },
  },
  lofi: {
    about: 'dusty Rhodes ninths, swung boom-bap, vinyl crackle; cozy, human — creator tools, journaling, study',
    scale: 'major', roots: [60, 62, 63, 65], bpm: [78, 90], loops: [[1, 4, 0, 5], [3, 2, 1, 4], [0, 5, 1, 4]], ext: 9, swing: 0.6, kit: 'lofi', drumkit: 'acoustic', laidback: 0.02, walk: true,
    comp: [['rhodes', ['x...........x...', 'x.........x.....'], 0, 0.06, -1, 12]], leads: ['vibes'], melody: 0.55,
    bass: [['bass', ['x.....x...x.....', 'x.........5.....'], 0.35, 0.13, -2]],
    drums: D(['kicksoft', ['x.........x.....', 'x......x..x.....'], 0.45, 0.32], ['snarelofi', '....x.......x...', 0.5, 0.16], ['hat', 'x.o.x.o.x.o.x.oo', 0.45, 0.06, 0, 0.25]),
    reverb: [0.16, 1.1], master: { lp: 7000, drive: 1.5, crackle: 0.5 },
  },
  funk: {
    about: 'dorian vamp, popping octave bass, clav on the sixteenths, brass stabs; confident, fun consumer apps',
    floor: 0.55,
    scale: 'dorian', roots: [57, 60, 62], bpm: [100, 112], loops: [[0, 0, 3, 3], [0, 3, 0, 4]], ext: 7, swing: 0.54, kit: 'clean', drumkit: 'acoustic', laidback: 0.01, walk: true,
    leads: ['brass'], stab: 'brass',
    bass: [['bass', ['x..o..x.x..o.xo.', 'x..o..x...x.o.x.'], 0.3, 0.15, -2]],
    comp: [['rhodes', '..x...x.x..x..x.', 0.45, 0.05, -1, 1], ['brass', ['x...............', '..........x.....'], 0.8, 0.05, 0, 2]],
    drums: D(['kick', ['x.....x...x.....', 'x..x..x...x..x..'], 0.5, 0.3], ['snare', '....x..g.g..x...', 0.55, 0.14], ['hat', 'xoxoxoxoxoxoxoxo', 0.5, 0.06, 0, 0.3], ['ohat', '..............x.', 0.8, 0.05, 0, 0.3]),
    fill: { snare: '....x...x.x.xxxx' },
  },
  trap: {
    about: 'half-time trap: sliding 808, rolling hats, snare on three, dark bells; bold, hype, drops',
    floor: 0.55,
    scale: 'minor', roots: [57, 58, 60, 61], bpm: [136, 150], loops: [[0, 5, 2, 6], [0, 3, 5, 4]], kit: 'clean',
    pad: ['strings', 0.03, -1], leads: ['flute'], melody: 0.6,
    bass: [['sub808', ['x......x..x.....', 'x.....g.......x.'], 0.4, 0.22, -2]],
    drums: D(['kick808', ['x......x..x.....', 'x.....x.......x.'], 0.5, 0.26], ['snare', '........x.......', 0.5, 0.15], ['clap', '........x.......', 0.6, 0.1], ['hat808', ['x.x.x.x.x.xrx.x.', 'x.x.xtx.x.x.xrxx'], 0.45, 0.06, 0, 0.25]),
    variants: { phonk: { leads: ['cowbell'], melody: 0, arp: [['cowbell', 'x..x..x...x..x..'.replace(/x/g, '0'), 0.45, 0.06, 1]], about: 'phonk: pitched cowbell riff over the 808' } },
  },
  chiptune: {
    about: '8-bit: pulse-wave arps and lead, triangle bass, noise drums; games, retro, playful dev tools',
    floor: 0.55,
    scale: 'major', roots: [60, 62, 64, 67], bpm: [128, 150], loops: [[0, 4, 5, 3], [0, 5, 3, 4], [5, 3, 0, 4]], kit: 'chip', human: 0,
    leads: ['sqlead'], melody: 0.55, reverb: [0.04, 1],
    bass: [['tri', 'x.o.x.o.x.o.x.o.', 0.3, 0.16, -1]],
    arp: [['chip', '0123012301230123', 0.45, 0.03, 0]],
    drums: D(['kickchip', ['x.......x.......', 'x...x...x...x...'], 0.55, 0.25], ['snarechip', '....x.......x...', 0.6, 0.1], ['hatchip', '..x...x...x...x.', 0.5, 0.06]),
    fill: { snarechip: '........x.x.xxxx' },
  },
  ambient: {
    about: 'no drums: slow pads, a low drone, glass twinkles in a big room; deep tech, science, calm',
    scale: 'major', roots: [60, 62, 64], bpm: [64, 80], loops: [[0, 3], [0, 5], [3, 0]], ext: 9, chordBars: 2, kit: 'clean',
    pad: ['warmpad', 0.09, -1], leads: ['vibes'], reverb: [0.28, 1.5], master: { lp: 9000 },
    bass: [['sinebass', 'x---------------', 0.35, 0.12, -2]],
    arp: [['vibes', ['0.......2.......', '....4.......3...'], 0.5, 0.045, 0]],
    comp: [['strings', 'x---------------', 0.65, 0.03, 0, 32]],
  },
  piano: {
    about: 'felt piano, broken chords and a simple tune, strings at the peak; emotional, human stories, hardware',
    scale: 'major', roots: [60, 62, 64, 65], bpm: [72, 88], loops: [[0, 4, 5, 3], [0, 5, 3, 4], [3, 0, 4, 5]], kit: 'organic',
    leads: ['piano'], melody: 0.3, reverb: [0.2, 1.3], stab: 'piano',
    arp: [['piano', ['0.2.4.2.0.2.4.2.', '0.2.4.5.4.2.0.2.'], 0, 0.06, -1]],
    bass: [['piano', 'x.......x.......', 0.4, 0.08, -2]],
    comp: [['strings', 'x---------------', 0.7, 0.04, -1, 16]],
    drums: D(['kicksoft', 'x.......x.......', 0.85, 0.2]),
  },
  cinematic: {
    about: 'hybrid trailer: string ostinato, taiko, horns, a braam on the drop; epic launches, big model releases',
    scale: 'minor', roots: [57, 58, 60, 62], bpm: [84, 100], loops: [[0, 5, 2, 6], [0, 5, 3, 4], [0, 3, 5, 4]], kit: 'cinematic', drumkit: 'acoustic',
    pad: ['strings', 0.06, -1], leads: ['horn'], reverb: [0.3, 1.5], suck: 2, stab: 'strings',
    arp: [['stacc', '0.00.00.0.00.00.', 0.35, 0.06, -1]],
    bass: [['lowstr', 'x---------------', 0.3, 0.1, -2]],
    drums: D(['taiko', 'x.....x.x.......', 0.6, 0.34], ['tom', '..........x..x.x', 0.8, 0.14], ['kick', 'x.......x.......', 0.9, 0.3], ['snarebig', '....x.......x...', 0.9, 0.14]),
    fill: { tom: 'x.x.x.x.xxxxxxxx' },
  },
  pizzicato: {
    about: 'pizzicato oom-pah, glockenspiel, finger snaps, a little swing; cute, pets, quirky toys',
    floor: 0.45,
    scale: 'major', roots: [60, 62, 65, 67], bpm: [108, 124], loops: [[0, 3, 4, 0], [0, 5, 3, 4], [0, 4, 5, 3]], swing: 0.55, kit: 'organic', walk: true,
    leads: ['glock'], melody: 0.45, reverb: [0.14, 1],
    bass: [['pizz', 'x.......5.......', 0, 0.12, -2]],
    comp: [['pizz', '....x.......x...', 0, 0.05, -1, 1]],
    arp: [['glock', '0.1.2.1.', 0.6, 0.022, 0]],
    drums: D(['snap', '....x.......x...', 0.5, 0.12], ['woodblock', '..x...x...x...x.', 0.7, 0.04, 0, 0.3]),
  },
  acoustic: {
    about: 'strummed guitar, claps, stomps and a shaker; indie, warm, lifestyle and consumer apps',
    floor: 0.45,
    scale: 'major', roots: [60, 62, 64, 67], bpm: [96, 116], loops: [[0, 4, 5, 3], [0, 3, 0, 4], [5, 3, 0, 4]], swing: 0.53, kit: 'organic', drumkit: 'acoustic', walk: true,
    leads: ['glock'], melody: 0.6, reverb: [0.14, 1.1], strum: true,
    comp: [['guitar', ['x..x..x.x..x.x..', 'x..x..x.x.x.x...'], 0, 0.05, -1, 2]],
    bass: [['bass', 'x.......x.....5.', 0.4, 0.12, -2]],
    drums: D(['stomp', 'x.......x.......', 0.45, 0.3], ['clap', '....x.......x...', 0.55, 0.13], ['shaker', 'x.xxx.xxx.xxx.xx', 0.5, 0.035, 0, 0.3]),
    variants: { ukulele: { comp: [['uke', 'x.xx.xx.x.xx.xx.', 0, 0.045, 0, 1]], roots: [65, 67, 69], about: 'ukulele strum, brighter and smaller' } },
  },
  guofeng: {
    about: 'pentatonic tunes on guzheng and dizi over soft strings and frame drum; Chinese culture and brands',
    scale: 'major', melodyScale: [0, 2, 4, 7, 9], roots: [60, 62, 64, 67], bpm: [76, 92], loops: [[3, 4, 2, 5], [0, 5, 3, 4], [5, 3, 4, 0]], kit: 'organic',
    pad: ['strings', 0.035, -1], leads: ['guzheng'], melody: 0.35, reverb: [0.22, 1.4],
    arp: [['guzheng', ['0.1.2.4.2.1.0.1.', '0.2.4.5.4.2.1.2.'], 0, 0.055, -1]],
    bass: [['bass', 'x.......x.......', 0.4, 0.1, -2]],
    drums: D(['frame', 'x.....x...x.....', 0.55, 0.22], ['woodblock', '....x.......x...', 0.7, 0.04]),
    variants: {
      dizi: { leads: ['dizi'], arp: [['harp', '0.1.2.4.2.1.0.1.', 0, 0.05, -1]], about: 'flute leads, harp underneath; airy, calm' },
      erhu: { leads: ['erhu'], melody: 0.3, about: 'erhu sings over guzheng and strings; nostalgic, warm' },
      guochao: { leads: ['guzheng', 'dizi'], bpm: [88, 100], bass: [['sub808', 'x......x..x.....', 0.4, 0.18, -2]], drums: D(['kick', 'x...x...x...x...', 0.5, 0.28], ['clap', '....x.......x...', 0.6, 0.12], ['hat808', '..x...x...x...x.', 0.5, 0.06, 0, 0.25], ['frame', '......x.......x.', 0.55, 0.15]), about: '国潮: guzheng and dizi over a modern beat' },
    },
  },
  synthwave: {
    about: '80s neon: driving saw bass eighths, supersaw pads, gated snare, arps; nostalgic, night, gaming',
    floor: 0.55,
    scale: 'minor', roots: [57, 60, 62], bpm: [96, 110], loops: [[0, 5, 2, 6], [0, 3, 5, 4], [5, 2, 6, 0]], kit: 'clean',
    pad: ['supersaw', 0.045, -1], leads: ['saw'], melody: 0.6, reverb: [0.22, 1.3], stab: 'supersaw',
    bass: [['synbass', 'x.x.x.x.x.x.x.x.', 0.3, 0.13, -2]],
    arp: [['synpluck', '0123210301232103', 0.5, 0.03, -1]],
    drums: D(['kick', 'x...x...x...x...', 0.5, 0.3], ['snaregated', '....x.......x...', 0.55, 0.15], ['hat', '..x...x...x...x.', 0.5, 0.07, 0, 0.3]),
    fill: { tom: '........x.x.x.xx' },
  },
};

// Twelve kinds of product, three directions each. A film picks one by its seed (its brand or id), so two
// films in the same category rarely sound alike; `variant` or `seed` overrides.
export const PRODUCTS = {
  devtool: { about: 'developer tools, productivity SaaS', styles: ['pulse', 'lofi', 'synthwave'] },
  ai: { about: 'AI models, big launches', styles: ['cinematic', 'ambient', 'pulse:dark'] },
  hardware: { about: 'hardware, devices, tech objects', styles: ['cinematic', 'pulse', 'piano'] },
  consumer: { about: 'consumer apps, lifestyle', styles: ['acoustic', 'funk', 'mallet'] },
  cute: { about: 'cute, pets, casual, toys', styles: ['pizzicato', 'acoustic:ukulele', 'chiptune'] },
  creative: { about: 'creator and design tools', styles: ['lofi', 'funk', 'acoustic'] },
  game: { about: 'games and entertainment', styles: ['chiptune', 'synthwave', 'trap'] },
  data: { about: 'finance, data, enterprise', styles: ['pulse', 'piano', 'ambient'] },
  explainer: { about: 'education, explainers, science', styles: ['mallet', 'piano', 'lofi'] },
  calm: { about: 'health, meditation, quiet focus', styles: ['ambient', 'piano', 'guofeng:dizi'] },
  guofeng: { about: 'Chinese culture and brands', styles: ['guofeng', 'guofeng:erhu', 'guofeng:guochao'] },
  hype: { about: 'fashion, sport, high energy', styles: ['trap', 'funk', 'synthwave'] },
};

// Legacy moods (OM.music({ mood })) are the mallet style with their original key, tempo and loop.
export const MOODS = {
  warm: { roots: [65], bpm: [92, 108], loops: [[0, 4, 5, 3]], leads: ['rhodes', 'vibes', 'marimba', 'harp', 'marimba', 'rhodes'] },
  bright: { roots: [67], bpm: [112, 126], loops: [[0, 4, 5, 3]], leads: ['marimba', 'vibes', 'harp', 'rhodes', 'marimba', 'glock'] },
  calm: { roots: [60], bpm: [76, 90], loops: [[0, 5, 3, 4]], leads: ['rhodes', 'vibes', 'harp', 'rhodes', 'vibes', 'harp'] },
  tense: { scale: 'minor', roots: [62], bpm: [100, 120], loops: [[0, 5, 2, 6]], leads: ['marimba', 'pizz', 'vibes', 'marimba', 'harp', 'pizz'] },
  epic: { scale: 'minor', roots: [60], bpm: [84, 100], loops: [[0, 5, 2, 6]], leads: ['horn', 'harp', 'vibes', 'piano', 'horn', 'harp'] },
};

// Motifs end on the chord root (0 or 7), so every statement resolves; rhythms in sixteenths.
const MOTIFS = [
  { d: [2, 3, 0], r: [2, 2, 4] }, { d: [4, 2, 0], r: [2, 2, 4] }, { d: [0, 2, 4, 7], r: [1, 1, 2, 4] },
  { d: [4, 5, 4, 0], r: [2, 1, 1, 4] }, { d: [2, 1, 4, 0], r: [3, 1, 2, 4] }, { d: [4, 7, 5, 7], r: [2, 2, 2, 4] },
  { d: [0, 4, 3, 2, 0], r: [2, 2, 1, 1, 4] }, { d: [5, 4, 2, 0], r: [1, 1, 2, 4] }, { d: [2, 4, 0], r: [3, 3, 4] },
  { d: [7, 4, 5, 2, 0], r: [2, 1, 1, 2, 4] },
];

export const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10] };

export function resolveStyle(m, seed) {
  let name = m.style, product = null, choice = null;
  if (!name && m.product) {
    product = PRODUCTS[m.product] ? m.product : null;
    if (!product) throw new Error(`unknown product "${m.product}" — one of: ${Object.keys(PRODUCTS).join(', ')}`);
    const list = PRODUCTS[product].styles;
    choice = m.variant != null ? ((Number(m.variant) % list.length) + list.length) % list.length : seed % list.length;
    name = list[choice];
  }
  if (!name) name = 'mallet';
  const [base, variant] = String(name).split(':');
  const S0 = STYLES[base];
  if (!S0) throw new Error(`unknown music style "${base}" — one of: ${Object.keys(STYLES).join(', ')}`);
  if (variant && !S0.variants?.[variant]) throw new Error(`style "${base}" has no variant "${variant}" — ${Object.keys(S0.variants || {}).join(', ') || 'none'}`);
  const mood = base === 'mallet' && MOODS[m.mood] ? MOODS[m.mood] : base === 'mallet' && !m.style && !m.product ? MOODS.warm : null;
  const S = { ...S0, ...(variant ? S0.variants[variant] : {}), ...(mood || {}) };
  return { S, name: variant ? `${base}:${variant}` : base, product, choice, mood: mood ? (MOODS[m.mood] ? m.mood : 'warm') : null };
}

const pick = (arr, seed, salt) => (Array.isArray(arr) && Array.isArray(arr[0]) || (Array.isArray(arr) && typeof arr[0] === 'number' && arr.length !== 2) ? arr[hash(`${seed}:${salt}`) % arr.length] : arr);

// The tempo whose eighth-note grid sits closest to the scene cuts (a small pull toward the middle of
// the style's range keeps it from drifting to an edge for a fraction of a millisecond).
export function pickBpm(times, [lo, hi]) {
  const cuts = times.filter((t) => t > 0.05);
  let best = { bpm: (lo + hi) / 2, err: Infinity, max: 0 };
  for (let bpm = lo; bpm <= hi + 1e-9; bpm += 0.25) {
    const e = 30 / bpm;
    const offs = cuts.map((t) => Math.abs(t - Math.round(t / e) * e));
    const err = offs.reduce((s, x) => s + x * x, 0) + 1e-5 * Math.pow((bpm - (lo + hi) / 2) / (hi - lo), 2);
    if (err < best.err - 1e-12) best = { bpm, err, max: Math.max(0, ...offs) };
  }
  return best;
}

export function plan(probe) {
  const m = probe.music || {};
  const seed = m.seed != null ? hash(`seed:${m.seed}`) : hash(m.brand || probe.id || 'film');
  const { S, name, product, choice, mood } = resolveStyle(m, seed);
  const labels = Object.entries(probe.labels || {}).filter(([k]) => k.startsWith('scene:')).map(([k, t]) => ({ id: k.slice(6), t: Number(t) })).sort((a, b) => a.t - b.t);
  if (!labels.length || labels[0].t > 0.05) labels.unshift({ id: '(start)', t: 0 });
  const range = m.bpm ? null : S.bpm;
  const fit = m.bpm ? { bpm: Number(m.bpm), max: Math.max(0, ...labels.map((l) => Math.abs(l.t - Math.round(l.t / (30 / m.bpm)) * (30 / m.bpm)))) } : pickBpm(labels.map((l) => l.t), range);
  const E = 30 / fit.bpm, B = 60 / fit.bpm;
  const root = m.key != null ? Number(m.key) : S.roots[hash(`${seed}:root`) % S.roots.length];
  const loop = m.loop || S.loops[hash(`${seed}:loop`) % S.loops.length];
  const motif = Array.isArray(m.motif) ? { d: m.motif.map((x) => Number(x) - 1), r: m.rhythm || m.motif.map((_, i, a) => (i === a.length - 1 ? 4 : 2)) } : MOTIFS[hash(`${m.brand || probe.id || 'film'}:motif:${m.seed ?? ''}`) % MOTIFS.length];
  const sections = labels.map((l) => ({ id: l.id, t: l.t })).filter((s, i, a) => i === 0 || s.t - a[i - 1].t >= E);
  const voiced = !!probe.voice;
  const dur = probe.duration;

  // the drop: a section named or timed by OM.music({ drop })
  const dropRef = m.drop;
  let drop = null;
  if (dropRef != null) {
    const want = typeof dropRef === 'number' ? dropRef : null, id = typeof dropRef === 'string' ? dropRef.replace(/^scene:/, '') : null;
    drop = sections.find((s) => (id ? s.id === id : Math.abs(s.t - want) < 0.15)) || null;
    if (!drop && want != null && want > 0 && want < dur) { drop = { id: '(drop)', t: want }; sections.push(drop); sections.sort((a, b) => a.t - b.t); }
    if (!drop) throw new Error(`OM.music({ drop: ${JSON.stringify(dropRef)} }) matches no scene label`);
    drop.drop = true;
  }
  const ending = ['ring', 'button', 'stop'].includes(m.ending) ? m.ending : 'ring';
  const k = sections.length;
  const endAt = ending === 'ring' ? null : m.end != null ? Number(m.end) : k >= 2 ? sections[k - 1].t : dur - B;
  const cap = voiced ? 0.7 : 1;
  const dropIdx = drop ? sections.indexOf(drop) : -1;
  const floor = Math.min(cap, m.floor ?? S.floor ?? 0.3);
  sections.forEach((s, i) => {
    s.outro = ending === 'ring' && k >= 3 && i === k - 1 && !s.drop;
    const mid = s.outro ? 0 : k > 2 ? i / (k - 2) : i / Math.max(1, k - 1);
    // groove styles start with a beat (kick and hats from the first scene) — a launch that idles on a pad
    // for twenty seconds before anything moves reads as boring (2026-10-17 user test); calm styles still build from a pad
    let e = s.outro ? 0.3 : floor + (1 - floor) * mid;
    if (dropIdx >= 0) e = i < dropIdx ? floor + (0.8 - floor) * (i / Math.max(1, dropIdx)) : s.outro ? 0.3 : i === dropIdx ? 1 : 0.9;
    if (m.energy && m.energy[s.id] != null) e = Number(m.energy[s.id]);
    s.energy = Math.min(cap, Math.max(0, e));
    s.voice = m.voices?.[i] || S.leads[S.rotate ? i % S.leads.length : 0];
  });
  return {
    style: name, product, choice, mood, S, seed, scale: m.scale || S.scale, mode: m.scale || S.scale, root, loop, motif,
    bpm: fit.bpm, E, B, S16: 15 / fit.bpm, gridError: fit.max, sections, duration: dur, voiced,
    drop: drop ? drop.t : null, suck: (m.suck ?? S.suck ?? 1) * B, ending, end: endAt,
    swing: m.swing ?? S.swing ?? 0.5, kit: m.kit || S.kit || 'clean',
  };
}

// Scale degree (0-based, may exceed 6) → MIDI, in octave `oct` relative to the root's octave.
export const deg = (p, d, oct = 0) => { const s = SCALES[p.scale] || SCALES.major; const o = Math.floor(d / 7); return p.root + s[((d % 7) + 7) % 7] + 12 * (o + oct); };
const snap = (p, midi) => { const ms = p.S.melodyScale; if (!ms) return midi; const pc = (((midi - p.root) % 12) + 12) % 12; let best = 0, bd = 99; for (const x of ms) for (const y of [x - 12, x, x + 12]) { const d = Math.abs(y - pc); if (d < bd || (d === bd && y > best)) { bd = d; best = y; } } return midi - pc + best; };

// chord tones of degree c: triad (+7th, +9th); the dominant in minor takes its raised leading tone
function chord(p, c, oct, ext = p.S.ext, dominant = false) {
  const notes = [deg(p, c, oct), deg(p, c + 2, oct), deg(p, c + 4, oct)];
  if (dominant && p.scale !== 'major' && ((c % 7) + 7) % 7 === 4) notes[1] += 1;
  if (ext >= 7) notes.push(deg(p, c + 6, oct));
  if (ext >= 9) notes.push(deg(p, c + 8, oct));
  return notes;
}
const stack = (p, c, oct, dominant) => { const t = chord(p, c, oct, 0, dominant); return [...t, ...t.map((x) => x + 12), ...t.map((x) => x + 24)]; };

const VEL = { x: 1, o: 0.6, g: 0.32, r: 0.7, t: 0.7 };

// Buses: music (gain-automated: the breath before the drop, the ending, ducks under hits),
// pad (also sidechained to the kick), fx (never automated: swells, crashes, the button).
// Voice leading: of all inversions of `notes` near `center`, the one whose voices move least from `prev`.
function voiceLead(notes, prev, center) {
  const n = notes.length, cands = [];
  for (let rot = 0; rot < n; rot++) {
    const v = [];
    for (let i = 0; i < n; i++) { let x = notes[(i + rot) % n]; while (v.length && x <= v.at(-1)) x += 12; v.push(x); }
    for (const shift of [-24, -12, 0, 12]) cands.push(v.map((x) => x + shift));
  }
  const fit = (v) => (prev ? v.reduce((a, x, i) => a + Math.abs(x - (prev[i] ?? prev.at(-1))), 0) : 0) + 0.6 * Math.abs((v[0] + v.at(-1)) / 2 - center);
  return cands.filter((v) => v[0] >= center - 9 && v.at(-1) <= center + 14).sort((a, b) => fit(a) - fit(b))[0] || notes;
}

// Groove: where each family sits against the grid and how hard it plays on each sixteenth. Drummers
// lay the backbeat back a hair, push the hats, accent the beat; one sixteenth in four carries the weight.
const HAT_ACCENT = [1, 0.5, 0.75, 0.55];
function grooveOf(name, j, S) {
  const back = S.laidback ?? 0.006;
  if (/snare|clap|snap|rim/.test(name)) return { dt: back, v: 1 };
  if (/hat|shaker|tamb/.test(name)) return { dt: -0.003, v: HAT_ACCENT[j % 4] };
  return { dt: 0, v: j % 4 === 0 ? 1 : 0.85 };
}

// Buses: drums, bass, keys (comp), arp, lead, pad (sidechained to the kick), fx (never automated: swells,
// crashes, the button). Each family gets its own processing in sound.js.
export function renderScore(p, buses, r) {
  const { S } = p, S16 = p.S16, end = p.duration, human = S.human ?? 1;
  const put = (bus, sig, t, gain, pan = 0) => { if (t < end && t > -1 && gain > 0) (buses[bus] || buses.music).add(sig, Math.max(0, t), gain, pan); };
  const inst = voice, ak = S.drumkit === 'acoustic';
  const kicks = [];
  const stopAt = p.end ?? Infinity;
  const quiet = (t) => t >= stopAt - 0.005 || (p.drop != null && t >= p.drop - p.suck && t < p.drop - 0.005);
  const jit = (amt) => (human ? (r() - 0.5) * 2 * amt * human : 0);
  const prevV = {};
  let barBase = 0, prevBass = null;
  p.sections.forEach((s, si) => {
    const next = p.sections[si + 1];
    const steps = Math.max(1, Math.round(((next ? next.t : end) - s.t) / S16));
    if (s.drop) barBase = Math.max(0, p.loop.indexOf(0)) * (S.chordBars || 1);
    const e = s.energy, lead = s.voice;
    const cb = S.chordBars || 1;
    const chordAt = (k) => {
      if (s.outro) return 0;
      if (k >= steps) return next ? (next.outro || next.drop ? 0 : p.loop[0]) : 0;
      const barsLeft = Math.ceil((steps - k) / 16);
      const toResolve = (next?.outro || next?.drop || (p.end != null && next && Math.abs(next.t - p.end) < 0.05)) && barsLeft <= 1;
      if (toResolve) return 4;
      return p.loop[Math.floor((barBase + Math.floor(k / 16)) / cb) % p.loop.length];
    };
    const grid = (k) => s.t + k * S16 + (k % 2 === 1 ? (p.swing - 0.5) * 2 * S16 : 0);
    const lenOf = (pat, j) => { let n = 1; while (j + n < 16 && pat[j + n] === '-') n++; return n; };
    const patOf = (pt, bar) => (Array.isArray(pt) ? pt[bar % pt.length] : pt);
    const lastBar = (k) => Math.floor(k / 16) === Math.floor((steps - 1) / 16) && steps >= 16;
    const totalBars = Math.ceil(steps / 16);
    // dynamics: a four-bar arch, and a section that builds into a drop swells through its last two bars
    const dyn = (bar, j) => {
      const arch = [0.9, 0.96, 1, 1.06][(barBase + bar) % 4];
      const build = next?.drop ? 0.85 + 0.25 * Math.min(1, ((bar * 16 + j) / Math.max(1, steps))) : 1;
      return arch * build;
    };

    for (let k = 0; k < steps && s.t + k * S16 < end; k++) {
      const j = k % 16, bar = Math.floor(k / 16), t = grid(k);
      if (quiet(t)) continue;
      const c = chordAt(k), dom = c === 4 && chordAt(Math.min(steps - 1, k + 16)) !== 4;
      const fresh = k === 0, d = dyn(bar, j);
      // pad: one voice-led chord per chord change, or held from the outro's start to the end
      if (S.pad) {
        const [pi, pg, po] = S.pad, center = p.root + 12 * po + 2;
        if (fresh && s.outro) for (const n of voiceLead(chord(p, 0, po, 0), prevV.pad, center)) for (const side of [-0.8, 0.8]) put('pad', inst(pi)(mtof(n) * (side > 0 ? 1.003 : 1), end - s.t + 0.2, 0.6, r), t, pg * 0.8, side);
        else if (!s.outro && (fresh || (j === 0 && (barBase + bar) % cb === 0))) {
          const len = Math.min(16 * cb - (j + 16 * ((barBase + bar) % cb)), steps - k) * S16 + 0.25;
          const v = (prevV.pad = voiceLead(chord(p, c, po, S.ext >= 9 ? 9 : 0, dom), prevV.pad, center));
          v.forEach((n) => { for (const side of [-0.8, 0.8]) put('pad', inst(pi)(mtof(n) * (side > 0 ? 1.003 : 1), len, 0.6, r), t, pg * 0.72 * (0.7 + 0.4 * e) / Math.sqrt(v.length / 3), side); });
        }
      }
      if (s.outro) {
        if (fresh) { put('bass', voice('bass')(mtof(deg(p, 0, -2)), 2.5, 0.7, r), t, 0.16, 0); }
      } else {
        // comp: voice-led chord stabs / strums / held chords, accented on the beat
        S.comp?.forEach(([ci, cp, cg, cgain, coct, clen = 2], li) => {
          if (e < cg) return;
          const pat = patOf(cp, barBase + bar);
          if (pat[j] !== 'x') return;
          const len = Math.min(clen, steps - k) * S16 + 0.08;
          const key = `comp${li}`, notes = (prevV[key] = voiceLead(chord(p, c, coct, S.ext, dom), prevV[key], p.root + 12 * coct + 4));
          const up = S.strum && j % 4 !== 0, vel = (j === 0 ? 0.85 : j % 4 === 0 ? 0.72 : 0.58) * d;
          const t0 = t + 0.004 + jit(0.005);
          notes.forEach((n, i) => {
            const order = up ? notes.length - 1 - i : i;
            put('keys', inst(ci)(mtof(n), len + (S.strum ? 0.3 : 0), vel, r), t0 + (S.strum ? order * (up ? 0.008 : 0.013) : jit(0.004)), cgain * vel * (up ? 0.8 : 1), (i - (notes.length - 1) / 2) * 0.32);
          });
        });
        // bass: on the grid, a touch late; walks into the next chord on the bar's last note
        for (const [bi, bp, bg, bgain, boct] of S.bass || []) {
          if (e < bg) continue;
          const pat = patOf(bp, barBase + bar), ch = pat[j];
          if (!ch || ch === '.' || ch === '-') continue;
          const root = deg(p, c, boct);
          let n = ch === 'o' ? root + 12 : ch === '5' ? deg(p, c + 4, boct) : ch === '3' ? deg(p, c + 2, boct) : root;
          const nextC = chordAt(k + (16 - j));
          const lastInBar = !pat.slice(j + 1).replace(/[.-]/g, '').length && j >= 10;
          if (S.walk && lastInBar && nextC !== c) n = deg(p, nextC + (deg(p, nextC, boct) > root ? -1 : 1), boct); // a scale step into the next root
          const len = Math.min(lenOf(pat, j), steps - k) * S16 * (bi === 'sub808' ? 1.6 : 0.9) + 0.02;
          const vel = (j % 4 === 0 ? 0.95 : 0.8) * d;
          put('bass', inst(bi)(mtof(n), len, vel, r, ch === 'g' && prevBass ? mtof(prevBass) : null), t + 0.002 + jit(0.003), bgain * (0.75 + 0.25 * vel), 0);
          prevBass = n;
        }
        // drums: groove template, accents, a fill on the section's last bar (not before a drop — that gets the breath)
        for (const [di, dp, dg, dgain, , dpan = 0] of S.drums || []) {
          if (e < dg) continue;
          let pat = patOf(dp, barBase + bar);
          const filling = lastBar(k) && next && !next.drop && S.fill?.[di] && e >= 0.5;
          if (filling) pat = S.fill[di];
          const ch = pat[j];
          if (!VEL[ch]) continue;
          const g = grooveOf(di, j, S), hits = ch === 'r' ? 2 : ch === 't' ? 3 : 1;
          for (let h = 0; h < hits; h++) {
            const v = Math.min(1.1, VEL[ch] * g.v * d * (filling ? 0.7 + 0.3 * (j / 15) : 1) * (human ? 0.88 + 0.24 * r() : 1));
            const th = t + g.dt + (h * S16) / hits + jit(0.003);
            put('drums', drum(di, ak)(r, v), th, dgain * Math.pow(v, 1.2) * (0.85 + 0.15 * e) * (/hat|shaker/.test(di) ? 0.8 : 1), dpan);
            if (di.startsWith('kick') || di === 'stomp' || di === 'taiko') kicks.push(th);
          }
        }
        for (const [fi, fp] of Object.entries(S.fill || {})) {
          if ((S.drums || []).some((dd) => dd[0] === fi) || !(lastBar(k) && next && !next.drop && e >= 0.6)) continue;
          if (VEL[fp[j]]) put('drums', drum(fi, ak)(r, 0.5 + 0.5 * j / 15), t + jit(0.003), 0.12 * (0.6 + 0.4 * j / 15), 0);
        }
        // arpeggio texture: accented on the beat, softer in between
        for (const [ai, ap, ag, again, aoct] of S.arp || []) {
          if (e < ag || (ag > 0 && k < 4)) continue;
          const pat = patOf(ap, barBase + bar), ch = pat[j % pat.length];
          if (!ch || ch === '.' || ch === '-') continue;
          const tones = stack(p, c, aoct, dom), n = snap(p, tones[Number(ch)] ?? tones[0]);
          const name = ai === 'lead' ? lead : ai, vel = (j % 4 === 0 ? 0.8 : j % 2 === 0 ? 0.62 : 0.5) * d;
          put('arp', inst(name)(mtof(n), Math.max(lenOf(pat, j % pat.length) * S16 * 1.2, name === 'piano' || name === 'guzheng' || name === 'harp' ? 1.2 : 0.3), vel, r), t + jit(0.004), again * (0.7 + 0.45 * vel) * (0.8 + 0.3 * e), j % 2 ? 0.45 : -0.45);
        }
      }
      // the motif announces every scene in its lead; melodic styles then sing four-bar phrases built from it
      const melodic = S.melody != null && S.melody > 0 && e >= S.melody;
      if (fresh) {
        playMotif(p, put, inst(lead), s.outro ? 0 : c, t, 0.22 * (p.voiced ? 0.55 : 1), s.outro, 0);
        if (s.outro && S.shine) put('lead', INSTRUMENTS.glass(mtof(deg(p, 0, 2)), 2.4), t + (p.motif.r.slice(0, -1).reduce((a, b) => a + b, 0)) * S16, 0.07, 0.2);
      } else if (!s.outro && j === 0 && melodic && bar % 4 === 0 && bar + 1 < totalBars) {
        playPhrase(p, put, inst(lead), [0, 1, 2, 3].map((b) => chordAt(k + 16 * b)), grid, k, steps, 0.15 * (p.voiced ? 0.55 : 1), r, quiet);
      } else if (!s.outro && j === 0 && !melodic && bar % 2 === 0 && bar > 0) {
        playMotif(p, put, inst(lead), c, t, 0.11 * (p.voiced ? 0.55 : 1), false, 0);
      }
    }
    barBase += Math.ceil(steps / 16);
  });

  // the drop: a swell pulls in through the breath, then crash + sub boom on the downbeat
  if (p.drop != null) {
    const sw = Math.max(p.suck, 0.4);
    put('fx', biquad(reverse(drum('crash')(r, 0.9)).slice(-N(sw + 0.05)), 'lp', 6500), p.drop - sw - 0.05, 0.12, 0);
    put('fx', biquad(drum('crash')(r, 0.9), 'lp', 9000), p.drop, 0.14, 0.15);
    put('fx', glide(70, 34, 1.4, 0.45), p.drop, 0.28, 0);
    if (p.kit === 'cinematic') put('fx', braam(mtof(deg(p, 0, -2)), 2.2, r), p.drop, 0.32, 0);
  }
  // the button: a one-beat pickup, the sonic logo landing its last note on the end hit, and the whole band
  // on one tonic chord — low root, kick, cymbal — that rings out while everything else has stopped
  if (p.ending === 'button' && p.end != null) {
    const lastLen = p.motif.r.slice(0, -1).reduce((a, b) => a + b, 0) * p.S16;
    const leadI = voice(p.sections.at(-1).voice);
    playMotif(p, (bus, sig, t, g, pan) => put('fx', sig, t, g, pan), leadI, 0, p.end - lastLen, 0.2 * (p.voiced ? 0.6 : 1), true, 0);
    const ak = S.drumkit === 'acoustic', drummed = (S.drums || []).length > 0;
    if (drummed) for (let k = 0; k < 4; k++) put('fx', drum(ak ? 'snare' : S.drums.find((d) => /snare|clap/.test(d[0]))?.[0] || 'clap', ak)(r, 0.4 + 0.15 * k), p.end - p.B + k * p.S16, 0.05 + 0.025 * k, 0);
    const stabI = S.stab ? voice(S.stab) : leadI;
    const notes = chord(p, 0, -1, 0);
    [...notes, notes[0] + 12].forEach((n, i) => put('fx', stabI(mtof(n), 3, 0.95, r), p.end, 0.075, (i - 1.5) * 0.3));
    put('fx', voice('bass')(mtof(deg(p, 0, -2)), 1.6, 0.9, r), p.end, 0.18, 0);
    if (drummed) put('fx', drum(S.drums.find((d) => /^kick|stomp|taiko/.test(d[0]))?.[0] || 'kick', ak)(r, 1), p.end, 0.3, 0);
    put('fx', biquad(drum('crash')(r, 0.9), 'lp', 10000), p.end, 0.15, 0.1);
    if (S.shine) put('fx', INSTRUMENTS.glass(mtof(deg(p, 0, 2)), 2.4), p.end, 0.06, 0.2);
  }
  return { kicks };
}

function playMotif(p, put, instFn, c, t, g, outro, shift) {
  let tt = t;
  const d = outro ? p.motif.d : p.motif.d.map((x, i, a) => (i === a.length - 1 ? x : x + shift));
  d.forEach((x, i) => {
    const n = snap(p, deg(p, c + x, p.S.leadOct ?? 0)), last = i === d.length - 1;
    put('lead', instFn(mtof(n), last ? (outro ? 2.4 : p.S16 * 6) : p.S16 * 3.2, last ? 0.8 : 0.68, rng(n + i)), tt, g * (last ? 1.05 : 0.9), -0.15 + 0.1 * i);
    tt += p.motif.r[i] * p.S16;
  });
}

// A four-bar phrase from the motif: statement on bar 1, an answer on bar 2 that turns the contour over
// and stops on the third, the statement sequenced onto bar 3's chord, and a cadence on bar 4 that steps
// into a long chord tone. Strong beats take chord tones; the line stays inside an octave and a half.
function playPhrase(p, put, instFn, chords, grid, k0, steps, g, r, quiet) {
  const m = p.motif, lo = p.root + 12 * (p.S.leadOct ?? 0) - 3, hi = lo + 16;
  const fit = (x) => { while (x < lo) x += 12; while (x > hi) x -= 12; return x; };
  const tone = (c, d) => fit(snap(p, deg(p, c + d, p.S.leadOct ?? 0)));
  const bars = [
    m.d.map((d, i) => [d, m.r[i]]),
    [...m.d].reverse().map((d, i, a) => [i === a.length - 1 ? 2 : 4 - d, m.r[i]]),
    m.d.map((d, i, a) => [i === 0 ? d + 1 : d, m.r[i]]),
    [[4, 2], [3, 2], [1, 2], [0, 8]],
  ];
  bars.forEach((notes, b) => {
    let pos = 0;
    notes.forEach(([d, len], i) => {
      const k = k0 + 16 * b + pos;
      pos += len;
      if (k >= steps || pos > 16) return;
      const t = grid(k);
      if (quiet(t)) return;
      const strong = (k % 4) === 0, last = i === notes.length - 1;
      const n = strong ? tone(chords[b], [0, 2, 4][Math.abs(Math.round(d)) % 3] + (d >= 7 ? 7 : 0)) : tone(chords[b], d);
      const vel = (strong ? 0.78 : 0.62) * [0.95, 0.9, 1, 0.92][b] * (0.94 + 0.12 * r());
      put('lead', instFn(mtof(n), Math.max(0.2, len * p.S16 * (last ? 1.6 : 0.95)), vel, r), t + (r() - 0.5) * 0.012, g * (0.75 + 0.35 * vel), -0.1 + 0.2 * r());
    });
  });
}

// low brass blast with a filter swell — the trailer "braam"
function braam(f, sec, r) {
  const a = ensemble(f, sec, { voices: 6, spread: 0.01, cutoff: (u) => 200 + 2200 * Math.min(1, (u * sec) / 0.18) * Math.exp(-(u * sec) / 1.2), att: 0.02, rel: 0.6 }, r);
  const b = ensemble(f / 2, sec, { voices: 3, spread: 0.006, cutoff: 500, att: 0.02, rel: 0.6 }, r);
  return drive(mix([a], [b, 0.8]), 1.4);
}

// Style colour on the finished music: low-pass, saturation, vinyl crackle.
export function master(p, L, R, r) {
  const m = p.S.master;
  if (!m) return;
  if (m.lp) { const l = biquad(L, 'lp', m.lp), rr = biquad(R, 'lp', m.lp); L.set(l); R.set(rr); }
  if (m.drive) { drive(L, m.drive); drive(R, m.drive); }
  if (m.crackle) {
    const n = L.length, hiss = biquad(noise(n / RATE, r), 'bp', 5000, 0.5);
    for (let i = 0; i < n; i++) {
      let v = hiss[i] * 0.004;
      if (r() < 0.0004) v += (r() - 0.5) * 0.12;
      L[i] += v * m.crackle; R[i] += v * m.crackle;
    }
  }
}

// Kick-keyed pumping on the pad bus: dips on every kick and breathes back over ~a beat.
export function pump(track, kicks, depth, beat, len = 0.9) {
  if (!depth || !kicks.length) return;
  const g = new Float32Array(track.n).fill(1);
  for (const k of kicks) {
    const a = Math.max(0, Math.round(k * RATE)), m = Math.round(beat * len * RATE);
    for (let i = 0; i < m && a + i < track.n; i++) { const u = i / m; g[a + i] = Math.min(g[a + i], 1 - depth * Math.pow(1 - u, 2.2)); }
  }
  for (let i = 0; i < track.n; i++) { track.L[i] *= g[i]; track.R[i] *= g[i]; }
}

// A one-paragraph description of the score for the log and for briefing a music model.
export function describe(p) {
  const key = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'][((p.root % 12) + 12) % 12];
  return `${p.style}${p.product ? ` (product ${p.product}, direction ${p.choice + 1}/3)` : ''}${p.mood ? ` · mood ${p.mood}` : ''} · ${key} ${p.scale} · ${p.bpm} BPM`;
}
