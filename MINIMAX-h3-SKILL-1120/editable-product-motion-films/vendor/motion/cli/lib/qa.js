// om qa — what a frame-by-frame look at a render can catch automatically. Reads the decoded video
// at low resolution and reports: single-frame pops (a frame that jumps and jumps back), dead time
// (stretches where nothing moves), hard cuts, whether the last frame matches the first (loops), and
// the motion curve per second so a flat film is visible as a flat line.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { OmError } from './project.js';

const W = 96, H = 54;

function probe(file) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate,width,height:format=duration', '-of', 'json', file], { encoding: 'utf8' });
  if (r.status !== 0) throw new OmError(`cannot read ${file}: ${(r.stderr || '').trim()}`);
  const j = JSON.parse(r.stdout), s = j.streams[0];
  const [n, d] = s.r_frame_rate.split('/').map(Number);
  return { fps: n / d, width: s.width, height: s.height, duration: Number(j.format.duration) };
}

function frames(file) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${W}:${H},format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new OmError(`ffmpeg could not decode ${file}`);
  const size = W * H, out = [];
  for (let i = 0; i + size <= r.stdout.length; i += size) out.push(r.stdout.subarray(i, i + size));
  return out;
}

const diff = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[s.length >> 1] : 0; };

export function qa(file, { loop = false } = {}) {
  if (!existsSync(file)) throw new OmError(`no such file ${file}`);
  const info = probe(file), f = frames(file), fps = info.fps;
  const d = f.slice(1).map((x, i) => diff(x, f[i]));
  const t = (i) => +(i / fps).toFixed(2);
  // A pop: frame i differs a lot from both neighbours while the neighbours are close to each other.
  const pops = [];
  for (let i = 1; i < f.length - 1; i++) {
    const a = d[i - 1], b = d[i], around = diff(f[i - 1], f[i + 1]);
    if (a > 6 && b > 6 && around < Math.min(a, b) / 3) pops.push({ at: t(i), jump: +Math.min(a, b).toFixed(1) });
  }
  // Hard cuts: a jump far above the local motion level that does not come back.
  const cuts = [];
  for (let i = 0; i < d.length; i++) {
    const local = median(d.slice(Math.max(0, i - 6), i).concat(d.slice(i + 1, i + 7)));
    if (d[i] > 14 && d[i] > 4 * (local + 1) && !pops.some((p) => Math.abs(p.at - t(i + 1)) < 0.05)) cuts.push(t(i + 1));
  }
  // Dead time: ≥ 1 s where consecutive frames barely change.
  const dead = [];
  let run = 0;
  for (let i = 0; i <= d.length; i++) {
    if (i < d.length && d[i] < 0.25) run++;
    else { if (run / fps >= 1) dead.push({ from: t(i - run), to: t(i), seconds: +(run / fps).toFixed(2) }); run = 0; }
  }
  const perSec = [];
  for (let s = 0; s * fps < d.length; s++) {
    const seg = d.slice(Math.round(s * fps), Math.round((s + 1) * fps));
    perSec.push(+(seg.reduce((a, b) => a + b, 0) / seg.length).toFixed(1));
  }
  const mean = perSec.reduce((a, b) => a + b, 0) / (perSec.length || 1);
  const sd = Math.sqrt(perSec.reduce((a, b) => a + (b - mean) ** 2, 0) / (perSec.length || 1));
  const loopGap = +diff(f[0], f[f.length - 1]).toFixed(2);
  return {
    file, ...info, frames: f.length,
    pops, cuts, dead,
    motion: { perSecond: perSec, mean: +mean.toFixed(2), contrast: +(sd / (mean + 1e-6)).toFixed(2) },
    loop: { firstLastDiff: loopGap, seamless: loopGap < 1.5, checked: loop },
  };
}

export function report(r) {
  const lines = [`${r.file}  ${r.width}×${r.height}  ${r.fps.toFixed(2)} fps  ${r.duration.toFixed(2)} s`];
  lines.push(r.pops.length ? `✗ ${r.pops.length} single-frame pop(s): ${r.pops.slice(0, 12).map((p) => p.at + 's').join(', ')} — look at these frames (om look <dir> --at …); usually an element shown one frame early or a fromTo rendering its start state` : '✓ no single-frame pops');
  lines.push(r.dead.length ? `${r.dead.some((x) => x.seconds > 2) ? '✗' : '·'} still for ≥1 s: ${r.dead.map((x) => `${x.from}–${x.to}s`).join(', ')} — fine for a reading hold or an end card, dead time anywhere else` : '✓ no stretch of ≥1 s without motion');
  lines.push(`· ${r.cuts.length} hard cut(s)${r.cuts.length ? ': ' + r.cuts.slice(0, 20).join(', ') + 's' : ''}  (average shot ${(r.duration / (r.cuts.length + 1)).toFixed(1)} s)`);
  lines.push(`· motion per second: ${r.motion.perSecond.join(' ')}  (contrast ${r.motion.contrast}${r.motion.contrast < 0.35 ? ' — very even: the film may feel flat; give it fast and slow moments' : ''})`);
  if (r.loop.checked) lines.push(r.loop.seamless ? `✓ last frame matches the first (diff ${r.loop.firstLastDiff}) — loops cleanly` : `✗ last frame differs from the first (diff ${r.loop.firstLastDiff}) — it will stutter as a loop`);
  return lines.join('\n');
}
