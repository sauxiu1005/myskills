// Every subtitle cue fits on one line per language inside the gate (measured with the page's own fonts).
//   node <demo>/tools/subcheck.mjs <demo>        (run from the library root)
import path from 'path';
const LIB = path.resolve(process.env.LIB || '.');
const { openDemo, closeServer } = await import(path.join(LIB, 'core/render/page.mjs'));
const dir = process.argv[2];
const { browser, page } = await openDemo(dir);
const res = await page.evaluate(() => window.SUBCHECK());
await browser.close(); closeServer();
let bad = 0;
for (const r of res) { console.log(`${r.ok ? 'OK ' : 'BAD'} ${r.id}  zh ${r.zh}px  en ${r.en}px`); if (!r.ok) bad++; }
console.log(bad ? `${bad} cue(s) too wide` : 'all cues fit on one line per language');
process.exit(bad ? 1 : 0);
