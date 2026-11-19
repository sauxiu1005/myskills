// om swatch — the palettes of the direction cards as one PNG, so the user can choose colour apart from
// composition and rhythm. Reads every `Palette:` line of directions.md (or any card file):
//   A · Ratchet   language: mechanism   look: …
//   Palette:  ground #EEF0EC 70 · surface #DCE2DA 15 · ink #15201B · accent #2F6BFF 5 · flip #2F6BFF — from: site CSS
// The numbers are shares of the frame (the rest is split evenly); everything after " — " is the source note.
// It also checks what a palette alone can show: ink on ground contrast, and three directions that share
// one ground or one accent family (the house look, see references/colour.md).
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { OmError } from './project.js';
import { still } from './still.js';

const rgb = (hex) => { const h = hex.replace('#', ''); const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h; return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) / 255); };
const lum = (hex) => { const [r, g, b] = rgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function hsl(hex) {
  const [r, g, b] = rgb(hex), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
}
const warm = (hex) => { const { h, s } = hsl(hex); return s > 0.35 && (h < 55 || h > 340); };

export function parsePalettes(text) {
  const out = [];
  let name = null;
  for (const line of text.split('\n')) {
    const head = /^(?:#+\s*)?([A-Z])\s*·\s*([^\s].*?)(?:\s{2,}|\t|$)/.exec(line.trim());
    if (head) name = `${head[1]} · ${head[2].trim()}`;
    const p = /^\s*(?:[-*]\s*)?palette\s*[:：]\s*(.+)$/i.exec(line);
    if (!p) continue;
    const [body, from] = p[1].split(/\s+[—–]\s+/);
    const swatches = body.split(/\s*·\s*/).map((s) => {
      const m = /^(.*?)\s*(#[0-9a-f]{6}|#[0-9a-f]{3})\b\s*(\d+(?:\.\d+)?)?%?/i.exec(s.trim());
      return m && { role: m[1].trim() || 'colour', hex: m[2].toUpperCase(), share: m[3] ? Number(m[3]) : null };
    }).filter(Boolean);
    if (swatches.length) out.push({ name: name || `#${out.length + 1}`, swatches, from: (from || '').replace(/^from:\s*/i, '').trim() });
  }
  return out;
}

export function checkPalettes(palettes) {
  const notes = [];
  const role = (p, r) => p.swatches.find((s) => s.role.toLowerCase().startsWith(r));
  for (const p of palettes) {
    const g = role(p, 'ground') || p.swatches[0], ink = role(p, 'ink') || role(p, 'text');
    const parts = [`ground L ${hsl(g.hex).l.toFixed(2)}`];
    if (ink) { const c = contrast(g.hex, ink.hex); parts.push(`ink ${c.toFixed(1)}:1${c < 4.5 ? ' — too low for small text' : ''}`); }
    if (!role(p, 'ground')) parts.push('no "ground" role: the first swatch is taken as the ground');
    if (!p.from) parts.push('no source ("— from: …"): say where the colours came from');
    notes.push(`${p.name.padEnd(24)} ${parts.join(' · ')}`);
  }
  if (palettes.length >= 2) {
    const grounds = palettes.map((p) => role(p, 'ground') || p.swatches[0]);
    const dark = grounds.filter((g) => hsl(g.hex).l < 0.2).length, light = grounds.filter((g) => hsl(g.hex).l > 0.8).length;
    if (dark === palettes.length) notes.push(`warning  every direction has a dark ground — at least one should not (colour.md §3)`);
    if (light === palettes.length) notes.push(`warning  every direction has a light ground — let one differ in value`);
    // the loudest colour of each palette, whatever its role is called (accent, flood, glow…)
    const accents = palettes.map((p) => [...p.swatches].sort((a, b) => hsl(b.hex).s * (1 - Math.abs(2 * hsl(b.hex).l - 1)) - hsl(a.hex).s * (1 - Math.abs(2 * hsl(a.hex).l - 1)))[0]);
    if (accents.every((a) => warm(a.hex))) notes.push('warning  every accent is a warm orange-red — the house look; change the hue family of at least one (colour.md §2)');
    const single = palettes.filter((p) => p.swatches.filter((s) => /accent/i.test(s.role)).length === 1 && p.swatches.length <= 4).length;
    if (single === palettes.length) notes.push('warning  all directions are "neutral ground + one accent" — vary the strategy too (colour.md §3)');
  }
  return notes;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export async function swatch(input, { out = null } = {}) {
  const file = resolve(input || 'directions.md');
  if (!existsSync(file)) throw new OmError(`no such file: ${file}`);
  const palettes = parsePalettes(readFileSync(file, 'utf8'));
  if (!palettes.length) throw new OmError(`no "Palette:" line in ${file}\n  write one per direction: Palette:  ground #EEF0EC 70 · ink #15201B · accent #2F6BFF 5 — from: <where each colour came from>`);
  const W = 1600, ROW = 230, H = 60 + palettes.length * ROW;
  const rows = palettes.map((p) => {
    const given = p.swatches.reduce((a, s) => a + (s.share ?? 0), 0), free = p.swatches.filter((s) => s.share == null).length;
    const rest = free ? Math.max(4, (100 - given) / free) : 0;
    const cells = p.swatches.map((s) => {
      const fg = contrast(s.hex, '#000000') > contrast(s.hex, '#FFFFFF') ? '#000' : '#fff';
      return `<div class="c" style="flex:${s.share ?? rest} 1 0;background:${s.hex};color:${fg}"><b>${esc(s.role)}</b><span>${s.hex}${s.share != null ? ` · ${s.share}%` : ''}</span></div>`;
    }).join('');
    return `<section><h2>${esc(p.name)}</h2><div class="bar">${cells}</div><p>${esc(p.from || 'source not given')}</p></section>`;
  }).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#F4F4F2;font:16px/1.3 -apple-system,"PingFang SC",sans-serif;color:#1C1C1C}
#s{width:${W}px;height:${H}px;box-sizing:border-box;padding:30px 40px;display:flex;flex-direction:column;gap:20px}
section{height:${ROW - 20}px;display:flex;flex-direction:column;gap:8px}
h2{margin:0;font-size:22px;font-weight:600}
.bar{flex:1;display:flex;border-radius:6px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.12)}
.c{display:flex;flex-direction:column;justify-content:flex-end;padding:10px 12px;gap:2px;min-width:132px;overflow:hidden}
.c b{font-size:14px;font-weight:600;white-space:nowrap}.c span{font:13px ui-monospace,Menlo,monospace;opacity:.85;white-space:nowrap}
p{margin:0;font-size:14px;color:#5A5A58}
</style></head><body><div id="s" data-composition-id="swatch" data-width="${W}" data-height="${H}">${rows}</div></body></html>`;
  const tmp = join(mkdtempSync(join(tmpdir(), 'om-swatch-')), 'swatch.html');
  writeFileSync(tmp, html);
  const png = resolve(out || join(dirname(file), `${basename(file).replace(/\.\w+$/, '')}-palettes.png`));
  await still(tmp, { out: png });
  return [`swatch   ${png}`, `         ${palettes.length} palette${palettes.length > 1 ? 's' : ''} — open it beside the key frames; the user can choose colour apart from composition`, ...checkPalettes(palettes).map((n) => `         ${n}`)].join('\n');
}
