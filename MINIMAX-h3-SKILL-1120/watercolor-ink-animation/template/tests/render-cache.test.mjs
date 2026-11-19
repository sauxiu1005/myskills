import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { isFrameCacheCurrent, prepareFrameCache } from '../render-cache.mjs';

test('resumes only when project inputs and render settings match', () => {
  const root = mkdtempSync(join(tmpdir(), 'watercolor-render-cache-'));
  try {
    mkdirSync(join(root, 'src'), { recursive: true });
    mkdirSync(join(root, 'node_modules/pkg'), { recursive: true });
    mkdirSync(join(root, 'out/frames'), { recursive: true });
    writeFileSync(join(root, 'studio.html'), '<script src="src/scene.js"></script>');
    writeFileSync(join(root, 'src/scene.js'), 'scene A');
    writeFileSync(join(root, 'node_modules/pkg/index.js'), 'dependency A');
    const frame = join(root, 'out/frames/f00000.jpg');
    writeFileSync(frame, 'cached frame');

    const options = { fps: 24, loop: null };
    assert.equal(prepareFrameCache(root, options, () => {}).reused, false, 'legacy frames are discarded once');
    writeFileSync(frame, 'fresh frame');
    assert.equal(prepareFrameCache(root, options, () => {}).reused, true, 'matching inputs resume');
    assert.equal(readFileSync(frame, 'utf8'), 'fresh frame');
    assert.equal(isFrameCacheCurrent(root, options), true);

    writeFileSync(join(root, 'src/scene.js'), 'scene B');
    assert.equal(isFrameCacheCurrent(root, options), false, 'same-size source edits invalidate by content');
    assert.equal(prepareFrameCache(root, options, () => {}).reused, false);
    assert.equal(existsSync(frame), false, 'stale frames are removed');

    writeFileSync(frame, 'current frame');
    writeFileSync(join(root, 'node_modules/pkg/index.js'), 'dependency B');
    writeFileSync(join(root, 'out/video.mp4'), 'encoded output');
    assert.equal(prepareFrameCache(root, options, () => {}).reused, true, 'dependencies and outputs are not render inputs');
    assert.equal(prepareFrameCache(root, { ...options, fps: 30 }, () => {}).reused, false, 'fps changes invalidate frames');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
