import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runJob } from '../scripts/dreamina-runtime.mjs';
import { publishOutput } from '../scripts/publish-output.mjs';

async function fixture(t) {
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'dreamina-publish-'));
  t.after(() => fs.rm(workspace, { recursive: true, force: true }));
  const job = path.join(workspace, '.hilo/dreamina-jobs/one');
  await fs.mkdir(job, { recursive: true });
  const request = path.join(job, 'request.json');
  await fs.writeFile(request, JSON.stringify({ cli: process.execPath, workspace, operation: 'text2video', args: [], videoQueueChoice: { channel: 'standard', userDecision: '普通通道' } }));
  await runJob(request, async () => ({ code: 0, stdout: JSON.stringify({ submit_id: 'task-one', gen_status: 'success' }), stderr: '' }));
  const source = path.join(job, 'task-one_video_1.mp4');
  const bytes = Buffer.from('000000186674797069736f6d0000020069736f6d', 'hex');
  await fs.writeFile(source, bytes);
  const manifest = path.join(job, 'output.json');
  const output = { index: 0, localPath: source, filename: '小猫伸懒腰.mp4' };
  await fs.writeFile(manifest, JSON.stringify(output));
  return { workspace, job, request, source, bytes, manifest, output };
}

test('publishes one named file with identical bytes; retries do not create a second output', async t => {
  const f = await fixture(t);
  assert.equal((await publishOutput(f.request, f.manifest)).reused, false);
  assert.equal((await publishOutput(f.request, f.manifest)).reused, true);
  assert.deepEqual((await fs.readdir(f.workspace)).sort(), ['.hilo', f.output.filename]);
  assert.deepEqual(await fs.readFile(f.source), f.bytes);
  assert.deepEqual(await fs.readFile(path.join(f.workspace, f.output.filename)), f.bytes);
  await fs.writeFile(f.manifest, JSON.stringify({ ...f.output, filename: '小猫视频.mp4' }));
  await assert.rejects(publishOutput(f.request, f.manifest), /publication mapping/);
});

test('preserves a colliding destination and permits a different name before first publication', async t => {
  const f = await fixture(t);
  const destination = path.join(f.workspace, f.output.filename);
  await fs.writeFile(destination, 'user content');
  await assert.rejects(publishOutput(f.request, f.manifest), /Destination already exists/);
  assert.equal(await fs.readFile(destination, 'utf8'), 'user content');
  await fs.writeFile(f.manifest, JSON.stringify({ ...f.output, filename: '小猫伸懒腰-新片.mp4' }));
  assert.equal((await publishOutput(f.request, f.manifest)).reused, false);
});

test('resumes an intent written before publication without another output', async t => {
  const f = await fixture(t);
  await publishOutput(f.request, f.manifest);
  const receiptPath = path.join(f.job, 'publication-0.json');
  const receipt = JSON.parse(await fs.readFile(receiptPath));
  delete receipt.published;
  await fs.writeFile(receiptPath, JSON.stringify(receipt));
  assert.equal((await publishOutput(f.request, f.manifest)).reused, true);
  assert.equal(JSON.parse(await fs.readFile(receiptPath)).published, true);
});

test('rejects hash names, traversal, unfinished media and unconfirmed generation', async t => {
  const f = await fixture(t);
  for (const filename of ['../cat.mp4', '842cd5cc-b008-4525-b8d7-25ca1d909a92_video_1.mp4']) {
    await fs.writeFile(f.manifest, JSON.stringify({ ...f.output, filename }));
    await assert.rejects(publishOutput(f.request, f.manifest));
  }
  await fs.writeFile(f.manifest, JSON.stringify(f.output));
  await fs.writeFile(f.source, '<html>error</html>');
  await assert.rejects(publishOutput(f.request, f.manifest), /Expected completed media/);
  await fs.writeFile(f.source, f.bytes);
  const statePath = path.join(f.job, 'state.json');
  const state = JSON.parse(await fs.readFile(statePath));
  await fs.writeFile(statePath, JSON.stringify({ ...state, status: 'querying' }));
  await assert.rejects(publishOutput(f.request, f.manifest), /Query the same submission/);
  assert.deepEqual(await fs.readdir(f.workspace), ['.hilo']);
});

test('verified delivery is reused instead of publishing an additional file', async t => {
  const f = await fixture(t);
  const statePath = path.join(f.job, 'state.json');
  const state = JSON.parse(await fs.readFile(statePath));
  await fs.writeFile(statePath, JSON.stringify({ ...state, status: 'querying' }));
  await fs.writeFile(path.join(f.job, 'delivery.json'), JSON.stringify({ outputs: [{ index: 0, nodeId: 'existing', verified: true, path: '已有成片.mp4' }] }));
  const result = await publishOutput(f.request, f.manifest);
  assert.equal(result.status, 'already_delivered');
  assert.equal(result.output.nodeId, 'existing');
  assert.deepEqual(await fs.readdir(f.workspace), ['.hilo']);
});

test('concurrent publication is locked and deleted published files are not silently recreated', async t => {
  const f = await fixture(t);
  const results = await Promise.allSettled([publishOutput(f.request, f.manifest), publishOutput(f.request, f.manifest)]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  await fs.unlink(path.join(f.workspace, f.output.filename));
  await assert.rejects(publishOutput(f.request, f.manifest), /Published file is missing/);
});
