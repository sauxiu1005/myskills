import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import { constants, createReadStream } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const INSTALL_URL = 'https://jimeng.jianying.com/cli';
const CDN_HOST = 'lf3-static.bytednsdoc.com';
const OPERATIONS = new Set(['text2image', 'image2image', 'image_upscale', 'text2video', 'image2video', 'frames2video', 'multiframe2video', 'multimodal2video']);

export function runProcess(executable, args, { cwd, timeout = 60000 } = {}) {
  return new Promise((resolve) => {
    let stdout = '', stderr = '', timedOut = false, settled = false;
    const child = spawn(executable, args, { cwd, shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => { timedOut = true; child.kill(); }, timeout);
    const hardStop = setTimeout(() => { if (!settled) child.kill('SIGKILL'); }, timeout + 2000);
    const finish = (code, error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer); clearTimeout(hardStop);
      resolve({ code, stdout, stderr: error ? `${stderr}\n${error.message}` : stderr, timedOut });
    };
    const append = (key, chunk) => {
      if (key === 'stdout') stdout += chunk.toString(); else stderr += chunk.toString();
      if (Buffer.byteLength(stdout) + Buffer.byteLength(stderr) > 4 * 1024 * 1024) child.kill();
    };
    child.stdout.on('data', chunk => append('stdout', chunk));
    child.stderr.on('data', chunk => append('stderr', chunk));
    child.on('error', error => finish(null, error));
    child.on('close', code => finish(code));
  });
}

export function jsonPayloads(text) {
  const found = [];
  let start = -1, depth = 0, quoted = false, escaped = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (start < 0) { if (c === '{' || c === '[') { start = i; depth = 1; } continue; }
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
    if (c === '"') quoted = true;
    else if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      if (depth === 0) {
        try { found.push(JSON.parse(text.slice(start, i + 1))); } catch { /* CLI progress text is not a response. */ }
        start = -1;
      }
    }
  }
  return found;
}

export function taskFacts(payloads) {
  const ids = new Set(), statuses = [], reasons = [];
  function walk(value) {
    if (Array.isArray(value)) { value.forEach(walk); return; }
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) {
      if (key === 'submit_id' && typeof item === 'string' && item) ids.add(item);
      if (key === 'gen_status' && typeof item === 'string') statuses.push(item);
      if (key === 'fail_reason' && typeof item === 'string' && item) reasons.push(item);
      if (typeof item === 'object') walk(item);
    }
  }
  payloads.forEach(walk);
  if (ids.size > 1 || (statuses.includes('success') && statuses.includes('fail'))) return { ambiguous: true };
  return { submitId: [...ids][0], genStatus: statuses.includes('fail') ? 'fail' : statuses.includes('success') ? 'success' : statuses.at(-1), failReason: reasons.at(-1) };
}

export function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, /token|cookie|secret|password|device_code|user_?id|phone|email|nickname/i.test(key) ? '[redacted]' : redact(item)]));
  if (typeof value === 'string') return value.replace(/((?:access_token|refresh_token|device_code|authorization|cookie|password)\s*[:=]\s*)[^\s,;]+/gi, '$1[redacted]');
  return value;
}

async function atomicJson(file, data) {
  const temp = `${file}.${randomUUID()}.tmp`;
  try {
    const handle = await fs.open(temp, 'wx', 0o600);
    try { await handle.writeFile(JSON.stringify(data, null, 2) + '\n'); await handle.sync(); }
    finally { await handle.close(); }
    await fs.rename(temp, file);
  } finally { await fs.rm(temp, { force: true }); }
}

async function findExecutable() {
  const name = process.platform === 'win32' ? 'dreamina.exe' : 'dreamina';
  const candidates = [process.env.DREAMINA_CLI_PATH, ...(process.env.PATH || '').split(path.delimiter).filter(Boolean).map(dir => path.join(dir, name)), path.join(os.homedir(), '.local', 'bin', name), path.join(os.homedir(), 'bin', name)];
  for (const candidate of candidates.filter(Boolean)) {
    try { await fs.access(candidate, constants.X_OK); if ((await fs.stat(candidate)).isFile()) return path.resolve(candidate); } catch { /* Continue through documented locations. */ }
  }
  return null;
}

export function installSource(script, platform, arch) {
  const names = { darwin: { arm64: 'darwin_arm64', x64: 'darwin_amd64' }, linux: { arm64: 'linux_arm64', x64: 'linux_amd64' }, win32: { x64: 'windows_amd64.exe' } };
  const target = names[platform]?.[arch];
  if (!target) throw new Error(`Unsupported platform: ${platform}/${arch}`);
  const base = script.match(/^DOWNLOAD_BASE="(https:\/\/[^"$\s]+)"\s*$/m)?.[1];
  if (!base || new URL(base).hostname !== CDN_HOST || !script.includes(`dreamina_cli_${target}`)) throw new Error('The official installer format changed; inspect the official installation source before proceeding.');
  return `${base}/dreamina_cli_${target}`;
}

async function getOfficial(url, maxBytes) {
  for (let redirects = 0; redirects <= 4; redirects++) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !['jimeng.jianying.com', CDN_HOST].includes(parsed.hostname) || parsed.username || parsed.password) throw new Error('Unexpected installation source.');
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(120000) });
    if ([301, 302, 303, 307, 308].includes(response.status)) { url = new URL(response.headers.get('location'), url).href; continue; }
    if (!response.ok) throw new Error(`Official download returned HTTP ${response.status}`);
    const chunks = []; let size = 0;
    for await (const chunk of response.body) { size += chunk.length; if (size > maxBytes) throw new Error('Official download exceeds the expected size limit.'); chunks.push(chunk); }
    return Buffer.concat(chunks);
  }
  throw new Error('Too many installation redirects.');
}

async function installBinary() {
  // Read the official manifest-like literals; never execute its shell body.
  // In particular, shell profile edits and third-party agent rule injection are unnecessary here.
  const source = installSource((await getOfficial(INSTALL_URL, 128 * 1024)).toString('utf8'), process.platform, process.arch);
  const binary = await getOfficial(source, 300 * 1024 * 1024);
  const magic = binary.subarray(0, 4).toString('hex');
  const valid = process.platform === 'win32' ? magic.startsWith('4d5a') : process.platform === 'linux' ? magic === '7f454c46' : ['cffaedfe', 'feedfacf', 'cafebabe', 'bebafeca'].includes(magic);
  if (binary.length < 4096 || !valid) throw new Error('The official download is not an executable for this platform.');
  const directory = path.join(os.homedir(), process.platform === 'win32' ? 'bin' : '.local/bin');
  await fs.mkdir(directory, { recursive: true });
  const destination = path.join(directory, process.platform === 'win32' ? 'dreamina.exe' : 'dreamina');
  const temp = `${destination}.${randomUUID()}.download`;
  await fs.writeFile(temp, binary, { mode: 0o755, flag: 'wx' });
  try {
    // An installation that appeared concurrently must not be overwritten.
    await fs.link(temp, destination);
  } finally { await fs.rm(temp, { force: true }); }
  return destination;
}

export async function prepare(allowInstall = false) {
  let cli = await findExecutable(), installed = false;
  if (!cli && allowInstall) { cli = await installBinary(); installed = true; }
  if (!cli) return { status: 'client_missing', next: 'prepare --install' };
  const help = await runProcess(cli, ['-h']);
  if (help.code !== 0 || !help.stdout.includes('query_result')) return { status: 'client_unusable', cli, error: redact(help.stderr || help.stdout) };
  const version = await runProcess(cli, ['version']);
  const credit = await runProcess(cli, ['user_credit']);
  const message = `${credit.stderr}\n${credit.stdout}`;
  const authRequired = /未检测到有效登录态|请先执行 dreamina login|not logged in|authentication required/i.test(message);
  return { status: credit.code === 0 ? 'ready' : authRequired ? 'login_required' : 'account_check_failed', cli, installed, version: jsonPayloads(version.stdout), account: redact(jsonPayloads(credit.stdout)), ...(credit.code !== 0 ? { error: redact(message.trim()).slice(0, 2000) } : {}) };
}

function validateRequest(request) {
  if (!request || !OPERATIONS.has(request.operation) || !path.isAbsolute(request.cli || '') || !path.isAbsolute(request.workspace || '')) throw new Error('Request requires an absolute cli, absolute workspace, and a supported operation.');
  if (!Array.isArray(request.args) || !request.args.every(value => typeof value === 'string' && !value.includes('\0'))) throw new Error('args must be an array of strings.');
  if (request.args.some(value => /^--?(?:poll|help|h|download_dir|submit_id)(?:=|$)/.test(value))) throw new Error('Polling, help and query flags are managed separately.');
}


function requirePrivateJob(workspace, directory) {
  const parts = path.relative(workspace, directory).split(path.sep);
  if (parts.length !== 3 || parts[0] !== '.hilo' || parts[1] !== 'dreamina-jobs' || !parts[2]) {
    throw new Error('Use the private workspace/.hilo/dreamina-jobs/<job>/ directory. For a legacy job, move its complete directory including state and delivery records before resuming; never recreate its request alone.');
  }
}

async function fileDigest(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

async function readRecovery(directory, state) {
  let receipt;
  try { receipt = JSON.parse(await fs.readFile(path.join(directory, 'recovery.json'), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  if (!state || receipt.fingerprint !== state.fingerprint || receipt.originalSubmitId !== state.submitId) throw new Error('Recovery receipt does not match the original task.');
  if (!path.isAbsolute(receipt.localPath || '') || await fileDigest(receipt.localPath) !== receipt.sha256) throw new Error('Recovered media changed or is missing; locate the same completed result without submitting again.');
  return receipt;
}

// This records a result already downloaded and matched through the host's browser/media
// capabilities. It cannot generate, accelerate, or infer which web card the user intended.
export async function recoverLocal(requestFile, manifestFile) {
  const requestPath = await fs.realpath(requestFile);
  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  validateRequest(request);
  const directory = path.dirname(requestPath), workspace = await fs.realpath(request.workspace);
  requirePrivateJob(workspace, directory);
  const manifestPath = await fs.realpath(manifestFile);
  if (path.dirname(manifestPath) !== directory) throw new Error('Keep the recovery manifest in the private job directory.');
  const lockPath = path.join(directory, 'running.lock');
  const lock = await fs.open(lockPath, 'wx', 0o600);
  try {
    await lock.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
    const state = JSON.parse(await fs.readFile(path.join(directory, 'state.json'), 'utf8'));
    const fingerprint = createHash('sha256').update(JSON.stringify(request)).digest('hex');
    if (state.fingerprint !== fingerprint || !state.submitId) throw new Error('Resolve the original task receipt before accepting a replacement.');
    if (state.status === 'delivered') throw new Error('Task already delivered; inspect existing canvas assets before replacing it.');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    if (typeof manifest.matchEvidence !== 'string' || !manifest.matchEvidence.trim()) throw new Error('Provide concrete match evidence for the unique completed result.');
    const source = new URL(manifest.sourcePage);
    if (source.protocol !== 'https:' || source.hostname !== 'jimeng.jianying.com' || source.username || source.password) throw new Error('Use the actual official Jimeng result page.');
    const localPath = await fs.realpath(manifest.localPath);
    // Staging under the job directory keeps partial downloads out of the asset watcher.
    if (path.dirname(localPath) !== directory) throw new Error('Stage the completed media in the private job directory.');
    const stat = await fs.stat(localPath);
    const handle = await fs.open(localPath, 'r');
    const bytes = Buffer.alloc(16);
    try { await handle.read(bytes, 0, bytes.length, 0); } finally { await handle.close(); }
    const ext = path.extname(localPath).toLowerCase();
    const isVideo = (['.mp4', '.mov'].includes(ext) && bytes.toString('ascii', 4, 8) === 'ftyp') || (ext === '.webm' && bytes.subarray(0, 4).toString('hex') === '1a45dfa3');
    const isImage = (ext === '.png' && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') || (['.jpg', '.jpeg'].includes(ext) && bytes.subarray(0, 3).toString('hex') === 'ffd8ff') || (ext === '.webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP');
    const wantsVideo = request.operation.endsWith('video');
    if (!stat.isFile() || stat.size < 16 || (wantsVideo ? !isVideo : !isImage)) throw new Error('Expected completed media matching the requested image/video type; not a screenshot, thumbnail or HTML page.');
    const sha256 = await fileDigest(localPath);
    let recovery = await readRecovery(directory, state);
    if (recovery && (recovery.sha256 !== sha256 || recovery.localPath !== localPath)) throw new Error('A different recovered result is already bound. Preserve it and inspect delivery before replacement.');
    if (!recovery) {
      recovery = { fingerprint, originalSubmitId: state.submitId, source: 'jimeng-web', sourcePage: source.origin + source.pathname, matchEvidence: redact(manifest.matchEvidence), localPath, sha256, recoveredAt: new Date().toISOString() };
      await atomicJson(path.join(directory, 'recovery.json'), recovery);
    }
    return { status: 'generated', originalSubmitId: state.submitId, originalStatus: state.status, recovery };
  } finally { await lock.close(); await fs.rm(lockPath, { force: true }); }
}

export async function runJob(requestFile, runner = runProcess) {
  const requestPath = await fs.realpath(requestFile);
  const request = JSON.parse(await fs.readFile(requestPath, 'utf8'));
  validateRequest(request);
  const workspace = await fs.realpath(request.workspace), directory = path.dirname(requestPath);
  const relative = path.relative(workspace, directory);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('Store the request inside the current workspace.');
  requirePrivateJob(workspace, directory);
  const statePath = path.join(directory, 'state.json'), lockPath = path.join(directory, 'running.lock');
  let lock;
  try { lock = await fs.open(lockPath, 'wx', 0o600); } catch (error) {
    if (error.code === 'EEXIST') return { status: 'busy', statePath, next: 'Wait for the current runner. If it ended, inspect the existing state before removing its stale lock; never create a replacement submission.' };
    throw error;
  }
  try {
    await lock.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
    const fingerprint = createHash('sha256').update(JSON.stringify(request)).digest('hex');
    let state;
    try { state = JSON.parse(await fs.readFile(statePath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (state && state.fingerprint !== fingerprint) throw new Error('This job already exists with different inputs. Preserve it and resolve its submission before creating a distinct job.');
    if (state?.status === 'delivered') return { ...state, statePath };
    const recovery = await readRecovery(directory, state);
    if (recovery) return { status: 'generated', originalSubmitId: state.submitId, originalStatus: state.status, statePath, recovery };
    if (state?.status === 'failed') return { ...state, statePath };
    if (state && !state.submitId) return { ...state, status: 'outcome_unknown', statePath, next: 'Recover the original submit_id with list_task; do not submit again.' };
    const submitting = !state;
    if (submitting && !request.operation.endsWith('video')) {
      const choice = request.imageProviderChoice;
      if (choice?.provider !== 'jimeng' || typeof choice.userRequest !== 'string' || !choice.userRequest.trim()) {
        throw new Error('Image tasks default to built-in services. Submit through this skill only after an explicit Jimeng provider choice; record imageProviderChoice.provider and imageProviderChoice.userRequest.');
      }
    }
    if (submitting && request.operation.endsWith('video')) {
      const choice = request.videoQueueChoice;
      if (!choice || !['standard', 'member'].includes(choice.channel) || typeof choice.userDecision !== 'string' || !choice.userDecision.trim()) {
        throw new Error('Before video submission, disclose queueing and additional member-channel credits, obtain the user choice, and record videoQueueChoice.channel and videoQueueChoice.userDecision. Do not assume consent from CLI defaults.');
      }
    }
    if (!state) {
      state = { fingerprint, operation: request.operation, status: 'submitting', startedAt: new Date().toISOString() };
      await atomicJson(statePath, state);
    }
    const args = submitting ? [request.operation, ...request.args, '--poll=0'] : ['query_result', `--submit_id=${state.submitId}`];
    let result;
    try { result = await runner(request.cli, args, { cwd: workspace, timeout: 120000 }); }
    catch (error) { result = { code: null, stdout: '', stderr: error.message, timedOut: false }; }
    const payloads = jsonPayloads(result.stdout);
    const facts = taskFacts(payloads);
    const mismatched = facts.ambiguous || (state.submitId && facts.submitId && state.submitId !== facts.submitId);
    if (!mismatched && facts.submitId) state.submitId = facts.submitId;
    state.status = mismatched ? 'outcome_unknown' : facts.genStatus === 'fail' ? 'failed' : facts.genStatus === 'success' && state.submitId ? 'generated' : state.submitId ? 'querying' : 'outcome_unknown';
    state.updatedAt = new Date().toISOString();
    if (facts.failReason && !mismatched) state.failReason = redact(facts.failReason);
    await atomicJson(statePath, state);
    return { ...state, statePath, exitCode: result.code, timedOut: result.timedOut, payloads: redact(payloads), ...(result.code !== 0 ? { error: redact(result.stderr).slice(0, 3000) } : {}), ...(mismatched ? { error: 'Ambiguous or mismatched task receipt; inspect the original task.' } : {}) };
  } finally { await lock.close(); await fs.rm(lockPath, { force: true }); }
}

async function main() {
  const [action, argument, manifest] = process.argv.slice(2);
  if (action === 'prepare' && (!argument || argument === '--install')) return prepare(argument === '--install');
  if (action === 'run' && argument) return runJob(path.resolve(argument));
  if (action === 'recover-local' && argument && manifest) return recoverLocal(path.resolve(argument), path.resolve(manifest));
  throw new Error('Usage: node dreamina-runtime.mjs prepare [--install] | run /absolute/workspace/.hilo/dreamina-jobs/<job>/request.json | recover-local <request.json> <web-result.json>');
}

const entryPath = process.argv[1] ? await fs.realpath(process.argv[1]).catch(() => null) : null;
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  main().then(value => process.stdout.write(JSON.stringify(value, null, 2) + '\n')).catch(error => { process.stderr.write(JSON.stringify({ status: 'error', error: redact(error.message) }) + '\n'); process.exitCode = 1; });
}
