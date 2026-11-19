// om fork — copy a project into a new frame size. A new aspect ratio is a new layout, not a crop:
// the copy keeps the source as is, changes the root size, and leaves a comment in its inbox so the
// agent's `om inbox --wait` picks up the re-layout as its next job.
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { addComment } from './inbox.js';
import { OmError, openProject, readSource, writeSource } from './project.js';

export function parseSize(text) {
  const m = /^\s*(\d{2,5})\s*[x×*:]\s*(\d{2,5})\s*$/i.exec(String(text ?? ''));
  if (!m) throw new OmError('size must look like 1080x1920');
  const width = Number(m[1]), height = Number(m[2]);
  if (width < 16 || height < 16 || width > 8192 || height > 8192) throw new OmError('size must be between 16 and 8192 pixels a side');
  if (width % 2 || height % 2) throw new OmError('width and height must be even (video encoders need it)');
  return { width, height };
}

const ROOT = /<[a-z][\w-]*\b[^>]*\sdata-composition-id\s*=\s*["'][^"']+["'][^>]*>/gi;

// The first root tag that is not inside an HTML comment (comments may quote markup).
function findRoot(html) {
  const comments = [...html.matchAll(/<!--[\s\S]*?-->/g)].map((m) => [m.index, m.index + m[0].length]);
  for (const m of html.matchAll(ROOT)) if (!comments.some(([a, b]) => m.index >= a && m.index < b)) return m;
  return null;
}

// Set data-width/data-height on the root composition element (added when missing) and keep a
// <meta name="viewport" width/height> in step. Returns the old size too.
export function resizeRoot(html, width, height) {
  const root = findRoot(html);
  if (!root) throw new OmError('index.html has no root element with data-composition-id');
  const read = (name) => Number(new RegExp(`\\s${name}\\s*=\\s*["']?(\\d+)`, 'i').exec(root[0])?.[1]) || null;
  const from = { width: read('data-width'), height: read('data-height') };
  let tag = root[0];
  for (const [name, value] of [['data-width', width], ['data-height', height]]) {
    const attr = new RegExp(`(\\s${name}\\s*=\\s*)(["'])[^"']*\\2`, 'i');
    tag = attr.test(tag) ? tag.replace(attr, `$1"${value}"`) : tag.replace(/\s*(\/?)>$/, ` ${name}="${value}"$1>`);
  }
  let out = html.slice(0, root.index) + tag + html.slice(root.index + root[0].length);
  out = out.replace(/(<meta\s+name=["']viewport["']\s+content=["'])width=\d+,\s*height=\d+/i, `$1width=${width}, height=${height}`);
  return { html: out, from, to: { width, height } };
}

const shape = ({ width, height }) => (!width || !height ? null : width === height ? 'square' : height > width ? 'portrait' : 'landscape');
const NAMES = { portrait: '竖屏', landscape: '横屏', square: '方屏' };

// The comment the agent gets: what changed, and what a re-layout means for the new shape.
export function reflowNote(from, to) {
  const a = shape(from), b = shape(to);
  const size = (s) => (s.width && s.height ? `${s.width}×${s.height}` : '原尺寸');
  const head = a && a !== b
    ? `这是从${NAMES[a]}（${size(from)}）复制来的${NAMES[b]}版本（${size(to)}）。请按${b === 'portrait' ? ' 9:16 ' : b === 'square' ? ' 1:1 ' : ' 16:9 '}重排版面——不是裁切，是重排：`
    : `这是复制来的 ${size(to)} 版本（原 ${size(from)}）。请按新尺寸重排版面：`;
  const rules = {
    portrait: '焦点居中，横向并排的元素改成上下堆叠；字号按手机放大（正文约 40px 起，标题更大）；顶部约 8% 留给状态栏和标签页，底部约 25% 是标题、字幕和按钮区，右侧约 14% 有点赞评论栏，关键内容不要放进去；字幕放在底部安全区之上。',
    landscape: '主体可以偏到三分线，信息放到另一侧，上下堆叠的元素改成左右并排；字号回到横屏常规（正文约 28–36px）；底部约 14% 留给字幕。',
    square: '焦点居中，内容收进中间约 80% 的区域；字号介于横竖屏之间；底部约 15% 留给字幕。',
  }[b] || '';
  return `${head}${rules}逐个分镜看一遍关键帧（om look --at 秒），所有文字都在画面内、不压人物主体、不互相遮挡后再交付。`;
}

export function fork(source, dest, size) {
  const src = openProject(source);
  const target = resolve(dest);
  if (existsSync(target)) throw new OmError(`${target} already exists — pick a new folder (om never overwrites a project)`);
  cpSync(src.root, target, { recursive: true, filter: (p) => !/[\\/](out|\.om|snapshots)([\\/]|$)/.test(p.slice(src.root.length)) });
  const project = openProject(target);
  const { html, token } = readSource(project);
  const r = resizeRoot(html, size.width, size.height);
  writeSource(project, r.html, token, `om fork ${r.from.width ?? '?'}x${r.from.height ?? '?'} → ${size.width}x${size.height}`);
  const comment = addComment(project, { text: reflowNote(r.from, r.to) });
  return { project, from: r.from, to: r.to, comment };
}
