import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installSource, jsonPayloads, taskFacts, redact, recoverLocal, runJob, runProcess } from '../scripts/dreamina-runtime.mjs';

async function fixture(t, args = ['--prompt', 'a cat', '--resolution_type', '2k']) {
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'dreamina-test-'));
  t.after(() => fs.rm(workspace, { recursive: true, force: true }));
  const job = path.join(workspace, '.hilo', 'dreamina-jobs', 'one');
  await fs.mkdir(job, { recursive: true });
  const requestPath = path.join(job, 'request.json');
  await fs.writeFile(requestPath, JSON.stringify({ cli: process.execPath, workspace, operation: 'text2image', args, imageProviderChoice: {provider:'jimeng',userRequest:'用即梦生成一张小猫图片'} }));
  return { workspace, job, requestPath };
}
const response = payload => ({ code: 0, stdout: JSON.stringify(payload), stderr: '', timedOut: false });

test('a skill mounted through a directory link still runs its command entrypoint', async t => {
  const { workspace } = await fixture(t);
  const link = path.join(workspace, 'linked-skill');
  await fs.symlink(fileURLToPath(new URL('../', import.meta.url)), link, process.platform === 'win32' ? 'junction' : 'dir');
  const result = await runProcess(process.execPath, [path.join(link, 'scripts/dreamina-runtime.mjs'), 'invalid-command']);
  assert.equal(result.code, 1);
  assert.match(JSON.parse(result.stderr).error, /Usage:/);
});

test('repeated run resumes the original ID and never submits a second paid task', async t => {
  const { requestPath, job } = await fixture(t);
  const calls = [];
  const runner = async (cli, args) => {
    calls.push(args);
    return args[0] === 'text2image' ? response({ submit_id: 'task-1', gen_status: 'querying' }) : response({ submit_id: 'task-1', gen_status: 'success', results: [{ url: 'https://example.test/output.png?signature=temporary' }] });
  };
  assert.equal((await runJob(requestPath, runner)).status, 'querying');
  assert.equal((await runJob(requestPath, runner)).status, 'generated');
  assert.deepEqual(calls[1], ['query_result', '--submit_id=task-1']);
  const state = await fs.readFile(path.join(job, 'state.json'), 'utf8');
  assert.ok(!state.includes('signature='));
});

test('writes intent before invoking the CLI and retains uncertainty after a lost receipt', async t => {
  const { requestPath, job } = await fixture(t);
  let calls = 0;
  const runner = async () => {
    calls++;
    assert.equal(JSON.parse(await fs.readFile(path.join(job, 'state.json'), 'utf8')).status, 'submitting');
    return { code: null, stdout: '', stderr: 'network interrupted', timedOut: true };
  };
  assert.equal((await runJob(requestPath, runner)).status, 'outcome_unknown');
  assert.equal((await runJob(requestPath, runner)).status, 'outcome_unknown');
  assert.equal(calls, 1);
});

test('failed generation is terminal and is not automatically repeated', async t => {
  const { requestPath } = await fixture(t); let calls = 0;
  const runner = async () => { calls++; return response({ submit_id: 'task-f', gen_status: 'fail', fail_reason: 'membership required' }); };
  assert.equal((await runJob(requestPath, runner)).status, 'failed');
  assert.equal((await runJob(requestPath, runner)).failReason, 'membership required');
  assert.equal(calls, 1);
});

test('a timeout after receiving an ID still resumes by that exact ID', async t => {
  const { requestPath } = await fixture(t);
  const accepted = await runJob(requestPath, async () => ({ code: null, stdout: '{"submit_id":"task-timeout","gen_status":"querying"}', stderr: '', timedOut: true }));
  assert.equal(accepted.submitId, 'task-timeout');
  assert.equal(accepted.status, 'querying');
  await runJob(requestPath, async (_, args) => { assert.deepEqual(args, ['query_result', '--submit_id=task-timeout']); return response({ submit_id: 'task-timeout', gen_status: 'success' }); });
});

test('corrupt state cannot be mistaken for an unsubmitted request', async t => {
  const { requestPath, job } = await fixture(t);
  await fs.writeFile(path.join(job, 'state.json'), '{broken');
  let called = false;
  await assert.rejects(runJob(requestPath, async () => { called = true; return response({}); }));
  assert.equal(called, false);
});

test('transient query errors preserve the ID for a subsequent read-only recovery', async t => {
  const { requestPath } = await fixture(t); let calls = 0;
  const runner = async (_, args) => {
    calls++;
    if (calls === 1) return response({ submit_id: 'task-r', gen_status: 'querying' });
    assert.equal(args[0], 'query_result');
    if (calls === 2) return { code: 1, stdout: '', stderr: 'temporary timeout', timedOut: true };
    return response({ submit_id: 'task-r', gen_status: 'success' });
  };
  await runJob(requestPath, runner);
  assert.equal((await runJob(requestPath, runner)).submitId, 'task-r');
  assert.equal((await runJob(requestPath, runner)).status, 'generated');
});

test('input mutation cannot reuse an existing job to generate again', async t => {
  const { requestPath } = await fixture(t);
  await runJob(requestPath, async () => response({ submit_id: 'task-a', gen_status: 'querying' }));
  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  request.args = ['--prompt', 'a different request'];
  await fs.writeFile(requestPath, JSON.stringify(request));
  await assert.rejects(runJob(requestPath, async () => { throw new Error('must not execute'); }), /different inputs/);
});

test('overlapping runners cannot submit twice', async t => {
  const { requestPath } = await fixture(t);
  let release, started;
  const ready = new Promise(resolve => { started = resolve; });
  const barrier = new Promise(resolve => { release = resolve; });
  const first = runJob(requestPath, async () => { started(); await barrier; return response({ submit_id: 'task-c', gen_status: 'querying' }); });
  await ready;
  assert.equal((await runJob(requestPath, async () => { throw new Error('must not execute'); })).status, 'busy');
  release(); await first;
});

test('a contradictory query response cannot replace the saved task ID', async t => {
  const { requestPath } = await fixture(t);
  await runJob(requestPath, async () => response({ submit_id: 'original', gen_status: 'querying' }));
  const result = await runJob(requestPath, async () => response({ submit_id: 'different', gen_status: 'success' }));
  assert.equal(result.status, 'outcome_unknown');
  assert.equal(result.submitId, 'original');
});

test('exit code zero without terminal success is not completion', async t => {
  const { requestPath } = await fixture(t);
  assert.equal((await runJob(requestPath, async () => response({ submit_id: 'accepted' }))).status, 'querying');
});

test('JSON parsing preserves quoted braces, progress messages and conflicting receipt detection', () => {
  const payloads = jsonPayloads('progress\n{"submit_id":"x","prompt":"{quoted} \\" value","gen_status":"querying"}\n{"submit_id":"x","gen_status":"success"}');
  assert.equal(taskFacts(payloads).genStatus, 'success');
  assert.equal(taskFacts([{ submit_id: 'a' }, { submit_id: 'b' }]).ambiguous, true);
  assert.equal(taskFacts([{ gen_status: 'success' }, { gen_status: 'fail' }]).ambiguous, true);
});

test('structured argv does not execute shell syntax in a prompt', async () => {
  const prompt = '中文 "quotes" $(printf injected) `printf injected` ; & |\nnext line';
  const result = await runProcess(process.execPath, ['-e', 'process.stdout.write(JSON.stringify(process.argv[1]))', prompt]);
  assert.equal(result.code, 0);
  assert.equal(JSON.parse(result.stdout), prompt);
});

test('installer selection uses official binary literals without executing shell instructions', () => {
  const script = 'DOWNLOAD_BASE="https://lf3-static.bytednsdoc.com/obj/vendor"\nDOWNLOAD_FILE="dreamina_cli_darwin_arm64"\nrm -rf /some/unrelated/path';
  assert.equal(installSource(script, 'darwin', 'arm64'), 'https://lf3-static.bytednsdoc.com/obj/vendor/dreamina_cli_darwin_arm64');
  assert.throws(() => installSource(script.replace('lf3-static.bytednsdoc.com', 'example.test'), 'darwin', 'arm64'), /changed/);
  assert.throws(() => installSource(script, 'win32', 'arm64'), /Unsupported/);
});

test('credentials are redacted from structured output', () => {
  assert.deepEqual(redact({ data: { access_token: 'secret', device_code: 'secret', credit: 20 }, user_id: 'private' }), { data: { access_token: '[redacted]', device_code: '[redacted]', credit: 20 }, user_id: '[redacted]' });
});


test('visible job directories are rejected before creating state or invoking the CLI', async t => {
  const { workspace, job, requestPath } = await fixture(t);
  const visible = path.join(workspace, '.dreamina-jobs', 'one');
  await fs.mkdir(path.dirname(visible), { recursive: true });
  await fs.rename(job, visible);
  await assert.rejects(runJob(path.join(visible, 'request.json'), async () => { throw new Error('paid submission forbidden'); }), /private/);
  await assert.rejects(fs.stat(path.join(visible, 'state.json')), { code: 'ENOENT' });
});

test('a verified web replacement survives original failure and never submits or queries the old task', async t => {
  const { requestPath, job } = await fixture(t);
  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  request.operation = 'multimodal2video';
  request.videoQueueChoice = { channel: 'standard', userDecision: 'Use the standard queue' };
  await fs.writeFile(requestPath, JSON.stringify(request));
  await runJob(requestPath, async () => response({ submit_id: 'original', gen_status: 'fail' }));
  const original = await fs.readFile(path.join(job, 'state.json'), 'utf8');
  const localPath = path.join(job, 'replacement.mp4');
  await fs.writeFile(localPath, Buffer.from('000000186674797069736f6d0000020069736f6d69736f32', 'hex'));
  const manifest = path.join(job, 'web-result.json');
  await fs.writeFile(manifest, JSON.stringify({ localPath, sourcePage: 'https://jimeng.jianying.com/ai-tool/generate?workspace=0', matchEvidence: 'Same full prompt, three references, time, model, duration and aspect; unique completed VIP card.' }));
  const recovered = await recoverLocal(requestPath, manifest);
  assert.equal(recovered.status, 'generated');
  assert.equal(recovered.originalSubmitId, 'original');
  const resumed = await runJob(requestPath, async () => { throw new Error('must not invoke CLI'); });
  assert.equal(resumed.status, 'generated');
  assert.equal(resumed.recovery.localPath, await fs.realpath(localPath));
  assert.equal(await fs.readFile(path.join(job, 'state.json'), 'utf8'), original);
  assert.equal((await recoverLocal(requestPath, manifest)).recovery.sha256, recovered.recovery.sha256);
  await fs.writeFile(localPath, '<html>expired</html>');
  await assert.rejects(runJob(requestPath), /changed/);
});

test('recovery rejects a screenshot or HTML renamed as video and missing match evidence', async t => {
  const { requestPath, job } = await fixture(t);
  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  request.operation = 'multimodal2video';
  request.videoQueueChoice = { channel: 'standard', userDecision: 'Use the standard queue' };
  await fs.writeFile(requestPath, JSON.stringify(request));
  await runJob(requestPath, async () => response({ submit_id: 'original', gen_status: 'fail' }));
  const localPath = path.join(job, 'result.mp4'), manifest = path.join(job, 'web-result.json');
  await fs.writeFile(localPath, '<html>not a video</html>');
  await fs.writeFile(manifest, JSON.stringify({localPath, sourcePage: 'https://jimeng.jianying.com/ai-tool/generate', matchEvidence: 'Matched prompt and all settings'}));
  await assert.rejects(recoverLocal(requestPath, manifest), /media/);
  await fs.writeFile(manifest, JSON.stringify({localPath, sourcePage: 'https://jimeng.jianying.com'}));
  await assert.rejects(recoverLocal(requestPath, manifest), /evidence/);
  await assert.rejects(fs.stat(path.join(job, 'recovery.json')), {code: 'ENOENT'});
});


test('a new video cannot submit before a queue choice, but a saved legacy task can still resume', async t => {
  const { requestPath, job } = await fixture(t);
  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  request.operation = 'text2video';
  await fs.writeFile(requestPath, JSON.stringify(request));
  let calls = 0;
  await assert.rejects(runJob(requestPath, async () => { calls++; return response({}); }), /videoQueueChoice/);
  assert.equal(calls, 0);
  await assert.rejects(fs.stat(path.join(job, 'state.json')), { code: 'ENOENT' });
  const { createHash } = await import('node:crypto');
  await fs.writeFile(path.join(job, 'state.json'), JSON.stringify({fingerprint: createHash('sha256').update(JSON.stringify(request)).digest('hex'), submitId:'legacy', status:'querying'}));
  assert.equal((await runJob(requestPath, async (_, args) => { assert.deepEqual(args, ['query_result','--submit_id=legacy']); return response({submit_id:'legacy',gen_status:'success'}); })).status, 'generated');
});

test('an explicit member-channel decision permits one video submission and subsequent queries only', async t => {
  const { requestPath } = await fixture(t);
  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  request.operation = 'text2video';
  request.args = ['--prompt','a cat','--video_resolution','720p','--model_version','seedance2.0_vip'];
  request.videoQueueChoice = {channel:'member',userDecision:'Use the member channel; I accept the extra credits disclosed for this video'};
  await fs.writeFile(requestPath, JSON.stringify(request));
  const calls=[];
  const runner=async (_,args)=>{ calls.push(args);return response({submit_id:'member-task',gen_status:'querying'}); };
  await runJob(requestPath,runner);await runJob(requestPath,runner);
  assert.equal(calls.filter(args=>args[0]==='text2video').length,1);
  assert.deepEqual(calls[1],['query_result','--submit_id=member-task']);
});


test('image generation requires explicit provider choice, not just a model or loaded skill', async t => {
  const {requestPath,job}=await fixture(t);
  const request=JSON.parse(await fs.readFile(requestPath,'utf8'));
  delete request.imageProviderChoice;
  await fs.writeFile(requestPath,JSON.stringify(request));
  let called=false;
  await assert.rejects(runJob(requestPath,async()=>{called=true;return response({});}),/imageProviderChoice/);
  assert.equal(called,false);
  await assert.rejects(fs.stat(path.join(job,'state.json')),{code:'ENOENT'});
});

test('legacy accepted image tasks without the new choice record remain queryable without resubmission', async t => {
  const {requestPath,job}=await fixture(t);
  const request=JSON.parse(await fs.readFile(requestPath,'utf8'));
  delete request.imageProviderChoice;
  await fs.writeFile(requestPath,JSON.stringify(request));
  const {createHash}=await import('node:crypto');
  await fs.writeFile(path.join(job,'state.json'),JSON.stringify({fingerprint:createHash('sha256').update(JSON.stringify(request)).digest('hex'),submitId:'legacy-image',status:'querying'}));
  const result=await runJob(requestPath,async(_,args)=>{assert.deepEqual(args,['query_result','--submit_id=legacy-image']);return response({submit_id:'legacy-image',gen_status:'success'});});
  assert.equal(result.status,'generated');
});
