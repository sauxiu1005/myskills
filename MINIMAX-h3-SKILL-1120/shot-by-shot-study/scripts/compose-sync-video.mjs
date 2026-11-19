#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { layoutFromPanels } from '../vendor/video-sync/scripts/video-sync.mjs';

function flag(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function n(v) { return Number(Number(v).toFixed(4)); }
function ramp(t, ease) { return 'clip((t-' + n(t) + ')/' + n(ease) + ',0,1)'; }

export function scrollExpression(shots, targets, easeSeconds = 0.45) {
  if (!shots.length) return '0';
  const parts = [String(n(targets[0] || 0))];
  for (let i = 1; i < shots.length; i++) {
    const delta = n((targets[i] || 0) - (targets[i - 1] || 0));
    if (!delta) continue;
    const start = Number(shots[i].start);
    const span = Math.max(0.001, Number(shots[i].end) - start);
    const ease = Math.min(easeSeconds, span);
    const step = i === shots.length - 1 ? 'gte(t,' + n(start) + ')' : ramp(start, ease);
    parts.push(delta + '*' + step);
  }
  return parts.join('+');
}

export function buildExpressionCompose(o) {
  const { shots, rows, view, content, layout, video, still, listDim, listLit, out } = o;
  const hasAudio = o.hasAudio !== false, easeSeconds = o.easeSeconds ?? 0.45, anchorRow = o.anchorRow ?? 1;
  if (!shots?.length || !rows?.length) throw new Error('shots 和 layout.rows 不能为空');
  const byId = new Map(rows.map(r => [r.id, r]));
  const orderedRows = shots.map(s => {
    const row = byId.get(s.id);
    if (!row) throw new Error('layout.rows 缺少镜头 ' + s.id);
    return row;
  });
  const slot = Math.min(Math.max(0, Math.round(anchorRow)), rows.length - 1);
  const anchor = (rows[slot]?.top ?? 0) - (rows[0]?.top ?? 0);
  const targets = orderedRows.map(r => Math.max(0, r.top - anchor));
  const scroll = scrollExpression(shots, targets, easeSeconds);
  const lastBottom = Math.max(...rows.map(r => Number(r.top) + Number(r.height)));
  const paddedHeight = Math.ceil(Math.max(content, lastBottom, targets.at(-1) + view.height));
  const { width: vw, height: vh } = layout.video;
  const { width: pw, height: ph } = layout.panel;
  const fps = layout.fps || 30;
  const splitLabels = shots.map((_, i) => '[lit' + i + ']').join('');
  // Normalize timestamps before scaling: some FFmpeg versions lose the EOF frame otherwise.
  const chain = [
    '[0:v]fps=' + fps + ',scale=' + vw + ':' + vh + ':flags=lanczos,setsar=1[v]',
    '[1:v]scale=' + pw + ':' + ph + ',setsar=1,fps=' + fps + '[base]',
    "[2:v]fps=" + fps + ",format=rgba,pad=" + pw + ':' + paddedHeight + ":0:0:color=black@0,crop=w=" + view.width + ':h=' + view.height + ':x=' + view.x + ":y='" + scroll + "'[win]",
    '[3:v]fps=' + fps + ',format=rgba,split=' + shots.length + splitLabels,
    ...shots.map((s, i) => '[lit' + i + ']crop=w=' + view.width + ':h=' + orderedRows[i].height + ':x=' + view.x + ':y=' + orderedRows[i].top + '[hi' + i + ']'),
    '[base][win]overlay=x=' + view.x + ':y=' + view.y + '[p0]',
    ...shots.map((s, i) => '[p' + i + '][hi' + i + "]overlay=x=" + view.x + ":y='" + view.y + '+' + orderedRows[i].top + '-(' + scroll + ")':eval=frame:enable='between(t," + n(s.start) + ',' + n(s.end) + ")'[p" + (i + 1) + ']'),
    '[v][p' + shots.length + ']' + layout.stack + '=inputs=2:shortest=1[out]',
  ];
  const args = ['-v','error','-y','-i',resolve(video),'-loop','1','-framerate',String(fps),'-i',resolve(still),'-loop','1','-framerate',String(fps),'-i',resolve(listDim),'-loop','1','-framerate',String(fps),'-i',resolve(listLit),'-filter_complex',chain.join(';'),'-map','[out]'];
  if (hasAudio) args.push('-map','0:a?','-af','apad','-c:a','aac','-b:a','160k');
  if (hasAudio) args.push('-shortest','-fflags','+shortest');
  args.push('-c:v','libx264','-preset','medium','-crf',String(layout.crf ?? 20),'-pix_fmt','yuv420p','-movflags','+faststart',resolve(out));
  return { args, scroll, paddedHeight, anchor, targets };
}

function main() {
  const shotsPath = flag('--shots'), panels = flag('--panels'), video = flag('--video'), out = flag('--out');
  if (!shotsPath || !panels || !video || !out) throw new Error('用法: --shots shots.json --video source.mp4 --panels panels-dir --out result.mp4 [--args-only args.json]');
  const doc = JSON.parse(readFileSync(shotsPath, 'utf8'));
  const measure = JSON.parse(readFileSync(join(panels, 'layout.json'), 'utf8'));
  const source = doc.meta || {};
  const layout = layoutFromPanels(measure);
  const built = buildExpressionCompose({ shots:doc.shots, rows:measure.rows, view:measure.view, content:measure.content ?? measure.tallHeight, layout, video, still:join(panels,'static.png'), listDim:join(panels,'list-dim.png'), listLit:join(panels,'list-lit.png'), out, hasAudio:source.hasAudio !== false });
  const argsOnly = flag('--args-only');
  if (argsOnly) { writeFileSync(argsOnly, JSON.stringify(built, null, 2)); return; }
  const run = spawnSync(flag('--ffmpeg','ffmpeg'), built.args, {stdio:'inherit'});
  if (run.error) throw run.error;
  if (run.status !== 0) process.exit(run.status ?? 1);
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) main();
