#!/usr/bin/env node
// Integration addition: unified launcher; upstream implementations are unchanged.
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const upstream = join(root, 'references/upstream');
const modules = ['novel-outline','novel-characters','novel-art','novel-script','novel-staging','novel-storyboard','character-refs'];
const [command, ...args] = process.argv.slice(2);
function run(file, argv = []) {
  const result = spawnSync(process.execPath, [file, ...argv], { stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  return result.status ?? 1;
}
if (!command || command === 'list' || command === '--help') {
  console.log('Usage: node drama.mjs <module|report|selftest> [original arguments]\n' + modules.join('\n'));
} else if (command === 'selftest') {
  let failures = 0;
  for (const module of modules) {
    console.log(`\n[${module}]`);
    if (run(join(upstream, 'skills', module, 'scripts/selftest.mjs'))) failures++;
  }
  console.log('\n[report]');
  if (run(join(upstream, 'scripts/report-selftest.mjs'))) failures++;
  process.exitCode = failures ? 1 : 0;
} else if (command === 'report') {
  process.exitCode = run(join(upstream, 'scripts/report.mjs'), args);
} else if (modules.includes(command)) {
  process.exitCode = run(join(upstream, 'skills', command, 'scripts', `${command}.mjs`), args);
} else {
  console.error(`Unknown module: ${command}. Use list for supported modules.`);
  process.exitCode = 2;
}
