#!/usr/bin/env node
// Integration addition: verify preserved file bytes and the single Skill entry.
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'references/source-manifest.json'), 'utf8'));
let failed = 0;
const expectedName = 'novel-to-drama-production';
if (basename(root) !== expectedName) { failed++; console.error('Root folder does not match skill name'); }
const metadata = readFileSync(join(root, 'meta.yaml'), 'utf8');
for (const [key, value] of Object.entries({
  name: expectedName,
  'display-name-en': 'Novel-to-Drama Production',
  'display-name-zh': '小说改编与短剧制作',
  'author-en': 'MiniMax Design',
  'author-cn': 'MiniMax Design',
  source: 'official-featured',
})) {
  if (!metadata.split('\n').includes(`${key}: ${value}`)) { failed++; console.error('Metadata mismatch:', key); }
}
for (const name of ['SKILL.md', 'SKILL.cn.md', 'README.md', 'meta.yaml', 'references/integration.md', 'references/native-workflow.md', 'VALIDATION.md']) {
  const text = readFileSync(join(root, name), 'utf8');
  if (/shuohao-drama-production|Shuohao Drama Production|烁皓短剧制作|scripts\/shuohao\.mjs/.test(text)) {
    failed++; console.error('Old package identity:', name);
  }
}
for (const file of manifest.files) {
  try {
    const hash = createHash('sha256').update(readFileSync(join(root, file.bundled))).digest('hex');
    if (hash !== file.sha256) throw new Error('SHA-256 mismatch');
  } catch (error) { failed++; console.error(file.bundled, error.message); }
}
function entries(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? entries(join(dir,e.name)) : e.name === 'SKILL.md' ? [join(dir,e.name)] : []);
}
const skills = entries(root);
if (skills.length !== 1 || skills[0] !== join(root,'SKILL.md')) { failed++; console.error('Expected exactly one root SKILL.md', skills); }
for (const name of ['SKILL.md', 'SKILL.cn.md']) {
  const body = readFileSync(join(root,name),'utf8');
  if (!body.includes('name: novel-to-drama-production') || body.split('\n').length >= 500) { failed++; console.error('Invalid entry:',name); }
  for (const match of body.matchAll(/`((?:references|scripts)\/[^`]+)`/g)) {
    try { readFileSync(join(root,match[1])); } catch { failed++; console.error('Missing reference:',match[1]); }
  }
}
console.log(`${manifest.files.length} source files checked; ${skills.length} Skill entry; ${failed} failures.`);
process.exitCode = failed ? 1 : 0;
