// Video footage for a render: ffmpeg decodes the part of each clip a film actually shows into an image
// sequence, and the page shows those images in place of the <video> (runtime/om-engine.js). Every frame
// the film needs exists as a file or the render stops — nothing is ever drawn from "whatever was loaded".
//
// The images are named by presentation order (00000001.png …) and come with the exact timestamp of each,
// so the page can pick "the frame a player would show at media time m", also for variable-frame-rate files.
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { OmError } from './project.js';

const sh = (cmd, args) => spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 256 << 20 });

// Timestamps (seconds on the media timeline, first byte of the container = 0) and the facts that decide colour handling.
export function probeVideo(file) {
  const meta = sh('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,pix_fmt,color_space,color_transfer,color_primaries,r_frame_rate:format=start_time,duration', '-of', 'json', file]);
  if (meta.status !== 0) throw new OmError(`cannot read video ${file}: ${(meta.stderr || '').trim().split('\n').pop()}`);
  const j = JSON.parse(meta.stdout);
  const s = j.streams?.[0];
  if (!s) throw new OmError(`${file} has no video stream`);
  const start = Number(j.format?.start_time) || 0;
  const pk = sh('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'packet=pts_time', '-of', 'csv=p=0', file]);
  const pts = pk.stdout.split('\n').filter((l) => l.trim() !== '').map(Number).filter(Number.isFinite).map((n) => n - start).sort((a, b) => a - b);
  if (!pts.length) throw new OmError(`${file} has no video frames`);
  return { pts, start, width: s.width, height: s.height, codec: s.codec_name, pixFmt: s.pix_fmt, colorSpace: s.color_space, transfer: s.color_transfer, primaries: s.color_primaries, duration: Number(j.format?.duration) || null };
}

// The colour matrix to turn this clip's YUV into RGB: what the file says, else what a browser assumes (HD = 709).
export function matrixFor(info) {
  const s = info.colorSpace || '';
  if (/709/.test(s)) return 'bt709';
  if (/(170m|470bg|601)/.test(s)) return 'bt601';
  if (/2020/.test(s)) return 'bt2020';
  return info.height >= 720 ? 'bt709' : 'bt601';
}
export const isHdr = (info) => /^(arib-std-b67|smpte2084)$/.test(info.transfer || '');

// Index of the frame shown at media time m: the last one at or before it (same rule as the page).
export function frameAt(pts, m) {
  let lo = 0, hi = pts.length - 1;
  if (m <= pts[0] + 1e-3) return 0;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (pts[mid] <= m + 1e-3) lo = mid; else hi = mid - 1; }
  return lo;
}

// Frames of `file` covering media time [from, to]. Returns what the page needs: { base, ext, pts, first }.
// Cached under cacheDir by content; a half-done extraction is never reused.
export async function extractClip(file, { from = 0, to = Infinity, cacheDir, format = 'png', onLog = () => {} } = {}) {
  // what ffprobe says about a file is kept next to its frames: listing every packet of 20 clips on every render cost a second
  const st = statSync(file);
  const memo = join(cacheDir, `probe-${createHash('sha1').update(JSON.stringify([file, st.size, st.mtimeMs, 1])).digest('hex').slice(0, 16)}.json`);
  let info = null;
  try { info = JSON.parse(readFileSync(memo, 'utf8')); } catch { /* not probed yet */ }
  if (!info) { info = probeVideo(file); mkdirSync(cacheDir, { recursive: true }); writeFileSync(memo, JSON.stringify(info)); }
  if (isHdr(info)) throw new OmError(`${file} is HDR (${info.transfer}); convert it to SDR first (ffmpeg -vf zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable,zscale=t=bt709:m=bt709:r=tv,format=yuv420p) or render with --video seek`);
  const last = frameAt(info.pts, Math.min(to, info.pts[info.pts.length - 1] + 1));
  const first = frameAt(info.pts, from);
  const count = last - first + 1;
  const matrix = matrixFor(info);
  const key = createHash('sha1').update(JSON.stringify([file, st.size, st.mtimeMs, first, count, format, matrix, 2])).digest('hex').slice(0, 16);
  const dir = join(cacheDir, key);
  const pts = info.pts.slice(first, last + 1);
  const ext = format === 'jpg' ? 'jpg' : 'png';
  const table = { base: pathToFileURL(dir + '/').href, ext, pts, first, info: { width: info.width, height: info.height, matrix } };
  if (existsSync(join(dir, 'done'))) return table;
  // two <video> elements showing the same part of the same file share one extraction
  if (!running.has(dir)) running.set(dir, extract(file, { dir, pts, count, ext, format, matrix, first, onLog }).finally(() => running.delete(dir)));
  await running.get(dir);
  return table;
}

const running = new Map();

async function extract(file, { dir, pts, count, ext, format, matrix, first, onLog }) {
  const tmp = dir + '.part';
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const vf = `scale=in_color_matrix=${matrix}:in_range=tv:out_range=full:flags=accurate_rnd+full_chroma_int+bicubic,format=rgb24`;
  const enc = format === 'jpg' ? ['-c:v', 'mjpeg', '-q:v', '2', '-pix_fmt', 'yuvj444p', '-vf', `scale=in_color_matrix=${matrix}:out_color_matrix=bt601:in_range=tv:out_range=full:flags=accurate_rnd+full_chroma_int,format=yuvj444p`]
    : ['-c:v', 'png', '-compression_level', '1', '-vf', vf];
  const args = ['-v', 'error', '-y', '-ss', String(Math.max(0, pts[0] - 0.0005)), '-i', file, '-map', '0:v:0', '-fps_mode', 'passthrough', '-frames:v', String(count), ...enc, join(tmp, `%08d.${ext}`)];
  await new Promise((ok, fail) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (b) => { err += b; });
    p.on('error', (e) => fail(new OmError(`ffmpeg: ${e.message}`)));
    p.on('close', (code) => (code === 0 ? ok() : fail(new OmError(`could not extract frames of ${file}: ${err.trim().split('\n').pop()}`))));
  });
  const got = readdirSync(tmp).filter((n) => n.endsWith('.' + ext)).length;
  if (got !== count) throw new OmError(`extracting ${file}: expected ${count} frames, got ${got}`);
  writeFileSync(join(tmp, 'done'), JSON.stringify({ file, count, first, matrix }));
  rmSync(dir, { recursive: true, force: true });
  renameSync(tmp, dir);
  onLog(`frames   ${file.split('/').pop()}: ${count} frames`);
}
