#!/usr/bin/env node
// Apache-2.0. Creates local content plans, never calls a Design API.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const finite = v => typeof v === 'number' && Number.isFinite(v);
const round = v => Math.round(v * 100) / 100;
const md = v => String(v ?? '—').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/\|/g, '&#124;').replace(/[\r\n]+/g, '<br>');
const json = v => `${JSON.stringify(v, null, 2)}\n`;

export function buildPlan(doc, state) {
  if (!doc || !Array.isArray(doc.shots) || !doc.shots.length) throw new Error('shots must be a nonempty array');
  if (!['measured', 'estimated', 'unknown'].includes(state?.timing?.status)) {
    throw new Error('state.timing.status must explicitly be measured, estimated or unknown');
  }
  if (!['platform-native', 'local-assisted', 'observation-draft'].includes(state.executionMode)) {
    throw new Error('Invalid executionMode');
  }
  const timingStatus = state.timing.status;
  const measured = timingStatus === 'measured';
  if (measured && state.executionMode === 'observation-draft') throw new Error('Observation drafts cannot claim measured timing');
  const offset = state.source?.rangeStartSeconds;
  if (!finite(offset) || offset < 0) throw new Error('source.rangeStartSeconds must be nonnegative');
  const duration = doc.meta?.durationSeconds;
  if (measured && (!finite(duration) || duration <= 0)) throw new Error('Measured duration must be positive');
  const precision = state.timing.precisionSeconds;
  if (measured && (!finite(precision) || precision <= 0 || precision > 1)) throw new Error('Measured precisionSeconds must be >0 and <=1');
  if (measured && (!state.timing.method || state.timing.method === 'unavailable')) throw new Error('Measured timing needs a source method');
  const tolerance = measured ? precision + 1e-8 : 1e-8;
  if (measured && finite(state.source.rangeEndSeconds) && Math.abs(state.source.rangeEndSeconds - offset - duration) > tolerance) {
    throw new Error('Source range does not match analysis duration');
  }
  let previousEnd = 0;
  const seen = new Set();
  const cards = doc.shots.map((shot, i) => {
    const expected = `S${String(i + 1).padStart(2, '0')}`;
    if (shot.id !== expected || seen.has(shot.id)) throw new Error(`Expected unique sequential id ${expected}`);
    seen.add(shot.id);
    const values = [shot.start, shot.end, shot.seconds];
    if (values.some(v => v != null && !finite(v))) throw new Error(`${shot.id}: time must be a number or null`);
    const completeTime = values.every(finite);
    if (measured && !completeTime) throw new Error(`${shot.id}: measured timing is incomplete`);
    if (completeTime) {
      if (shot.start < 0 || shot.end <= shot.start || shot.seconds <= 0) throw new Error(`${shot.id}: invalid interval`);
      if (Math.abs(shot.end - shot.start - shot.seconds) > Math.max(tolerance, 0.01000001)) throw new Error(`${shot.id}: duration mismatch`);
      if (measured && Math.abs(shot.start - previousEnd) > tolerance) throw new Error(`${shot.id}: timeline gap or overlap`);
      previousEnd = shot.end;
    }
    const evidence = state.shotEvidence?.[shot.id] ?? {};
    return {
      key: `shot-${shot.id}`,
      shotId: shot.id,
      analysisInterval: completeTime ? {start: shot.start, end: shot.end, seconds: shot.seconds} : null,
      sourceInterval: completeTime ? {start: round(offset + shot.start), end: round(offset + shot.end)} : null,
      timingStatus,
      size: shot.size || null, category: shot.category || null, camera: shot.camera || null,
      description: shot.frame || '', audio: shot.audio || '', onscreenText: shot.onscreenText || '',
      rhythm: shot.rhythm || null, rhythmNote: shot.rhythmNote || '', note: shot.note || '',
      confidence: evidence.confidence || 'unverified',
      audioSource: evidence.audioSource || 'unavailable',
      uncertainty: evidence.uncertainty || '',
      // Expected paths only. Existence and successful upload must be checked separately.
      frameCandidates: ['a','b'].map(suffix => `${doc.params?.frameDir || 'frames'}/${shot.id}${suffix}.jpg`),
      visualEvidence: evidence.visual || []
    };
  });
  if (measured && Math.abs(previousEnd - duration) > tolerance) throw new Error('Timeline does not cover full duration');
  const seconds = cards.map(c => c.analysisInterval?.seconds);
  const sorted = seconds.filter(finite).sort((a,b) => a-b);
  const n = cards.length;
  const stats = measured ? {
    shotCount: n, durationSeconds: duration,
    meanShotSeconds: round(duration / n),
    medianShotSeconds: round(n % 2 ? sorted[(n - 1)/2] : (sorted[n/2-1] + sorted[n/2])/2),
    shotsPerMinute: round(n / duration * 60),
    transitionsPerMinute: round(Math.max(0, n - 1) / duration * 60),
    shortestShot: cards.reduce((a,b) => a.analysisInterval.seconds <= b.analysisInterval.seconds ? a : b).shotId,
    longestShot: cards.reduce((a,b) => a.analysisInterval.seconds >= b.analysisInterval.seconds ? a : b).shotId
  } : {shotCount: n, note: 'Timing unverified; precise timing statistics withheld'};
  const label = {measured:'工具测量；仍需画面复核', estimated:'时间估算草稿', unknown:'时间未知草稿'}[timingStatus];
  const columns = ['镜号','时间段 / 时长','景别 / 类别','运镜','画面','台词 / 文字','节奏','证据 / 置信度'];
  const rows = cards.map(c => {
    const t = c.analysisInterval;
    return [c.shotId, t ? `${timingStatus === 'measured' ? '' : '估算 '}${t.start}–${t.end}s / ${t.seconds}s` : '待测量',
      `${c.size || '待确认'} / ${c.category || '待确认'}`, c.camera || '待确认', c.description,
      `${c.audio || '未记录台词'} [${c.audioSource}]；${c.onscreenText || '未记录画面文字'}`,
      `${c.rhythm || '未分析'} ${c.rhythmNote}`,
      `${c.confidence}；${c.visualEvidence.join(', ') || '无已记录视觉证据'}；${c.uncertainty || c.note}`];
  });
  const table = [`# ${md(doc.title || '视频拉片')} — ${label}`, '',
    '> 本文件是待写入画布的内容；未创建任何 Design 节点。', '',
    `| ${columns.join(' | ')} |`, `| ${columns.map(()=>'---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(md).join(' | ')} |`), ''].join('\n');
  const plan = {
    schemaVersion: 1, format: 'video-shot-interactive-report-content-plan',
    platformImportFormat: false, executionStatus: 'not-applied',
    title: doc.title || '视频拉片', timingStatus, precisionLabel: label,
    source: state.source, statistics: stats,
    quality: {status: 'unverified', note: 'Plan builder checks timing structure only; see separate quality record'},
    nodes: [
      {key:'source', kind:'video-reference', title:'01-原片与分析说明', source:state.source},
      {key:'frames', kind:'image-group-plan', title:'02-关键帧联系表', status:'assets-not-checked'},
      {key:'shot-table', kind:'table-or-markdown', title:'03-逐镜分析表', columns, rows},
      {key:'summary', kind:'text', title:'04-拉片报告', statistics:stats, timingStatus},
      {key:'quality', kind:'text', title:'05-质量检查与待复核项', suppliedRecord:state.quality || null}
    ], shots: cards,
    nextAction: 'Verify assets and semantic annotations, then map this plan through actual Design tools'
  };
  return {plan, table};
}

export function main(args) {
  if (args.includes('--help')) {
    process.stdout.write('node canvas-plan.mjs shots.json --state analysis-state.json --out NEW_OUTPUT_DIR\nCreates local JSON/Markdown only; refuses to overwrite existing files.\n');
    return;
  }
  const [input, ...rest] = args;
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) {
    if (!['--state','--out'].includes(rest[i]) || !rest[i+1] || rest[i+1].startsWith('--') || opts[rest[i]]) throw new Error('Expected --state FILE --out DIR');
    opts[rest[i]] = rest[i+1];
  }
  if (!input || !opts['--state'] || !opts['--out']) throw new Error('Expected shots.json --state analysis-state.json --out DIR');
  const doc = JSON.parse(readFileSync(input, 'utf8'));
  const state = JSON.parse(readFileSync(opts['--state'], 'utf8'));
  const {plan, table} = buildPlan(doc, state);
  const out = resolve(opts['--out']);
  const files = [join(out, 'canvas-plan.json'), join(out, 'canvas-table.md')];
  if (files.some(existsSync)) throw new Error('Output files already exist; choose a new revision directory');
  mkdirSync(out, {recursive:true});
  writeFileSync(files[0], json(plan), {flag:'wx'});
  writeFileSync(files[1], table, {flag:'wx'});
  process.stdout.write(`${json({status:'local-plan-created', files, designNodesCreated:0})}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { main(process.argv.slice(2)); }
  catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
