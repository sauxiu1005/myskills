#!/usr/bin/env node
// Portable, pinned entry point. No npm fallback. Required fonts are fetched on demand with pinned hashes.
// Platform adaptation: before the bundled CLI starts, prepend project-local tool folders to PATH so
// FFmpeg/ffprobe found by scripts/setup-tools.mjs (linked into <project>/.tools/bin) are used by every
// child process. Order: $OM_TOOLS_DIR, then the nearest .tools/bin from the current directory upward.
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { delimiter, dirname, join, resolve } from 'node:path';
const major = Number(process.versions.node.split('.')[0]);
if (major < 22) {
  console.error(`editable-product-motion-films requires Node 22+; found ${process.versions.node}. Use the host's supported runtime.`);
  process.exit(1);
}
const extra = [];
if (process.env.OM_TOOLS_DIR) extra.push(resolve(process.env.OM_TOOLS_DIR));
for (let d = process.cwd(); ; d = dirname(d)) {
  const c = join(d, '.tools', 'bin');
  if (existsSync(c)) { extra.push(c); break; }
  if (dirname(d) === d) break;
}
if (extra.length) process.env.PATH = [...extra, process.env.PATH || ''].join(delimiter);
const cli = new URL('../vendor/motion/cli/om.js', import.meta.url);
if (!existsSync(fileURLToPath(cli))) {
  console.error('Bundled engine missing. Import the complete skill ZIP including vendor/, not SKILL.md alone.');
  process.exit(1);
}
await import(cli.href);
