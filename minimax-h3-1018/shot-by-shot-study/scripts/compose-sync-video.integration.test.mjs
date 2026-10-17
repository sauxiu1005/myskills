import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { plan, layoutFromPanels, composeArgs, motionPlan, commandFile } from '../vendor/video-sync/scripts/video-sync.mjs';

const ffmpeg = process.env.FFMPEG_BIN || 'ffmpeg';
const available = spawnSync(ffmpeg, ['-version']).status === 0;
const cli = fileURLToPath(new URL('./compose-sync-video.mjs', import.meta.url));
function run(bin, args) {
  // A wall-clock timeout catches an infinite render; no output -t masks the bug.
  const r = spawnSync(bin, args, { encoding: 'utf8', timeout: 20000, maxBuffer: 4 << 20 });
  assert.ifError(r.error);
  assert.equal(r.status, 0, r.stderr);
  return r;
}

test('legacy or inconsistent panel plans require regeneration', () => {
  assert.throws(() => layoutFromPanels({ panel: { width: 96, height: 64 } }), /panels/);
  const layout = plan({ width: 192, height: 108 });
  assert.throws(() => layoutFromPanels({ layout, panel: { width: 96, height: 64 } }), /panels/);
});

for (const scenario of [
  { name: 'scaled landscape, silent', width: 192, height: 108, options: { videoScale: 0.5 } },
  { name: 'portrait height cap, silent', width: 108, height: 192, options: { maxVideoHeight: 96 } },
  { name: '4K width cap, silent', width: 3840, height: 2160, options: { maxVideoWidth: 192 } },
  { name: 'audio shorter than picture', width: 192, height: 108, audio: 0.4 },
  { name: 'audio longer than picture', width: 192, height: 108, audio: 2 },
]) {
  test(`both composers end at source video EOF: ${scenario.name}`, { skip: !available }, () => {
    const dir = mkdtempSync(join(tmpdir(), 'compose-regression-'));
    try {
      const video = join(dir, 'source.mp4');
      const sourceArgs = ['-v', 'error', '-y', '-f', 'lavfi', '-i',
        `color=c=red:s=${scenario.width}x${scenario.height}:r=10:d=1`];
      if (scenario.audio) sourceArgs.push('-f', 'lavfi', '-i', `sine=duration=${scenario.audio}:sample_rate=48000`, '-c:a', 'aac');
      run(ffmpeg, [...sourceArgs, '-c:v', 'libx264', '-preset', 'ultrafast', video]);
      const meta = { width: scenario.width, height: scenario.height, fps: 10, hasAudio: !!scenario.audio };
      const layout = plan(meta, { ...scenario.options, fps: 10, minPanelPx: 48 });
      const shots = [{ id: 'S01', start: 0, end: 0.5 }, { id: 'S02', start: 0.5, end: 1 }];
      const rows = [{ id: 'S01', top: 0, height: 16 }, { id: 'S02', top: 16, height: 16 }];
      const view = { x: 0, y: 0, width: layout.panel.width, height: 32 };
      const content = layout.panel.height;
      writeFileSync(join(dir, 'layout.json'), JSON.stringify({ layout, panel: layout.panel, rows, view, content }));
      writeFileSync(join(dir, 'shots.json'), JSON.stringify({ meta, shots }));
      for (const [name, color] of [['static.png', 'blue'], ['list-dim.png', 'gray'], ['list-lit.png', 'white']]) {
        run(ffmpeg, ['-v', 'error', '-y', '-f', 'lavfi', '-i',
          `color=c=${color}:s=${layout.panel.width}x${layout.panel.height}`, '-frames:v', '1', join(dir, name)]);
      }
      const motion = motionPlan({ shots, rows, view, content });
      const commands = join(dir, 'motion.cmd');
      writeFileSync(commands, commandFile(motion.commands) + '\n');
      for (const mode of ['expression-cli', 'sendcmd']) {
        const out = join(dir, `${mode}.mp4`);
        if (mode === 'expression-cli') {
          run(process.execPath, [cli, '--shots', join(dir, 'shots.json'), '--video', video,
            '--panels', dir, '--out', out, '--ffmpeg', ffmpeg]);
        } else {
          run(ffmpeg, composeArgs({ video, still: join(dir, 'static.png'), listDim: join(dir, 'list-dim.png'),
            listLit: join(dir, 'list-lit.png'), out, layout, motion, view, commands, hasAudio: meta.hasAudio }));
        }
        const decoded = run(ffmpeg, ['-v', 'info', '-i', out, '-map', '0:v', '-progress', 'pipe:1', '-f', 'null', '-']);
        const frames = [...decoded.stdout.matchAll(/^frame=(\d+)$/gm)].at(-1);
        assert.equal(Number(frames?.[1]), 10, `${mode} must preserve all ten source frames and stop\n${decoded.stderr}\n${decoded.stdout}`);
        assert.match(decoded.stderr, new RegExp(`\\b${layout.output.width}x${layout.output.height}\\b`));
        assert.equal(/Audio:/.test(decoded.stderr), meta.hasAudio, 'preserve audio presence');
        const duration = Number(/Duration: 00:00:(\d+\.\d+)/.exec(decoded.stderr)?.[1]);
        assert.ok(duration >= 1 && duration <= 1.12, `${mode}: audio must also stop with the 1s picture, got ${duration}s`);
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
