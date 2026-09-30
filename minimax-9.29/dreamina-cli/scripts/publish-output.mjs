import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function digest(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

async function readJson(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function saveJson(file, value) {
  const temp = `${file}.${randomUUID()}.tmp`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2), { flag: 'wx', mode: 0o600 });
  await fs.rename(temp, file);
}

// Publish completed bytes once; no CLI, network, transcoding or canvas mutation.
// The host discovers only the final named file. Canvas verification remains required.
export async function publishOutput(requestFile, manifestFile) {
  const requestPath = await fs.realpath(requestFile);
  const request = await readJson(requestPath);
  const workspace = await fs.realpath(request.workspace);
  const directory = path.dirname(requestPath);
  const parts = path.relative(workspace, directory).split(path.sep);
  if (parts.length !== 3 || parts[0] !== '.hilo' || parts[1] !== 'dreamina-jobs' || !parts[2]) throw new Error('Use the original private job directory.');
  const manifestPath = await fs.realpath(manifestFile);
  if (path.dirname(manifestPath) !== directory) throw new Error('Keep the output manifest inside this job.');
  const lockPath = path.join(directory, 'running.lock');
  const lock = await fs.open(lockPath, 'wx', 0o600);
  let temp;
  try {
    await lock.writeFile(JSON.stringify({ pid: process.pid }));
    const state = await readJson(path.join(directory, 'state.json'));
    const fingerprint = createHash('sha256').update(JSON.stringify(request)).digest('hex');
    if (state?.fingerprint !== fingerprint || !state.submitId) throw new Error('Resolve the original task receipt before publishing.');
    const recovery = await readJson(path.join(directory, 'recovery.json'));
    const recovered = recovery?.fingerprint === fingerprint && recovery.originalSubmitId === state.submitId;
    const manifest = await readJson(manifestPath);
    const { index, filename } = manifest ?? {};
    if (!Number.isSafeInteger(index) || index < 0) throw new Error('Provide a zero-based output index.');
    if (typeof filename !== 'string' || !filename.trim() || filename !== filename.trim() || filename.startsWith('.') || /[\\/:*?"<>|\x00-\x1f]/.test(filename) || Buffer.byteLength(filename) > 180) throw new Error('Provide a short descriptive filename, not a path.');
    const stem = path.parse(filename).name;
    if (!/[\p{L}]/u.test(stem) || /[a-f0-9]{24,}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i.test(stem)) throw new Error('Use a content description without task IDs or hashes.');
    const delivery = await readJson(path.join(directory, 'delivery.json'));
    const delivered = delivery?.outputs?.find(output => output.index === index && output.verified && output.nodeId);
    if (delivered) return { status: 'already_delivered', output: delivered };
    if (state.status !== 'generated' && !recovered) throw new Error('Query the same submission until generated, or verify its recovered result.');
    const source = await fs.realpath(manifest.localPath);
    if (path.dirname(source) !== directory) throw new Error('Use completed media staged directly inside this job.');
    const stat = await fs.stat(source);
    const bytes = Buffer.alloc(16);
    const handle = await fs.open(source, 'r');
    try { await handle.read(bytes, 0, 16, 0); } finally { await handle.close(); }
    const ext = path.extname(filename).toLowerCase();
    const video = (['.mp4', '.mov'].includes(ext) && bytes.toString('ascii', 4, 8) === 'ftyp') || (ext === '.webm' && bytes.subarray(0, 4).toString('hex') === '1a45dfa3');
    const image = (ext === '.png' && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') || (['.jpg', '.jpeg'].includes(ext) && bytes.subarray(0, 3).toString('hex') === 'ffd8ff') || (ext === '.webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP');
    if (!stat.isFile() || stat.size < 16 || ext !== path.extname(source).toLowerCase() || (request.operation.endsWith('video') ? !video : !image)) throw new Error('Expected completed media with its original extension and requested media type.');
    const sha256 = await digest(source);
    if (recovered && (source !== recovery.localPath || sha256 !== recovery.sha256)) throw new Error('Recovered media does not match its receipt.');
    const receiptPath = path.join(directory, `publication-${index}.json`);
    let receipt = await readJson(receiptPath);
    if (receipt && (receipt.fingerprint !== fingerprint || receipt.filename !== filename || receipt.sha256 !== sha256)) throw new Error('This output already has a publication mapping. Reuse it; do not publish another name.');
    const destination = path.join(workspace, filename);
    const existing = await fs.lstat(destination).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
    if (existing) {
      if (!receipt || !existing.isFile() || await digest(destination) !== sha256) throw new Error('Destination already exists; preserve it and choose another descriptive name before first publication.');
      if (!receipt.published) await saveJson(receiptPath, { ...receipt, published: true });
      return { status: 'published_pending_canvas', path: filename, reused: true };
    }
    if (receipt?.published) throw new Error('Published file is missing. Inspect the existing canvas asset before any replacement.');
    receipt ??= { fingerprint, submitId: state.submitId, index, filename, sha256 };
    await saveJson(receiptPath, receipt);
    temp = path.join(directory, `.publish-${randomUUID()}.tmp`);
    await fs.copyFile(source, temp);
    if (await digest(temp) !== sha256) throw new Error('Source changed during publication; retain the original task.');
    // Atomic no-overwrite publication: watcher never sees a partial/empty media file.
    await fs.link(temp, destination);
    await saveJson(receiptPath, { ...receipt, published: true });
    return { status: 'published_pending_canvas', path: filename, reused: false };
  } finally {
    if (temp) await fs.rm(temp, { force: true });
    await lock.close();
    await fs.rm(lockPath, { force: true });
  }
}

const entryPath = process.argv[1] ? await fs.realpath(process.argv[1]).catch(() => null) : null;
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  const [request, manifest] = process.argv.slice(2);
  publishOutput(request, manifest).then(result => process.stdout.write(JSON.stringify(result) + '\n')).catch(error => {
    process.stderr.write(JSON.stringify({ status: 'error', error: error.message }) + '\n');
    process.exitCode = 1;
  });
}
