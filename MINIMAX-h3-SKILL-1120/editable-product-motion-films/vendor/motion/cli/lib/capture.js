// Load a composition in a real Chrome and step through it: seek to a time, wait until the page is
// settled, take a picture. Rendering, stills and checks share this one path so what you look at is
// what gets rendered.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { findChrome, NO_CHROME } from './browser.js';
import { launch, newPage } from './cdp.js';
import { OmError } from './project.js';

const ENGINE = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'runtime', 'om-engine.js');

// file: an index.html on disk. Returns a handle; always call close().
//   video: 'extract' (frames from images, default) | 'seek' (the browser's own decoder)
//   variables: overrides for the composition's variables; transparent: clear page background
//   size: [w, h] viewport (default: the root element's data-width/height, else 1920x1080)
//   lenient: any page, not only a composition — no timeline is fine (stills of direction pages, palette sheets)
//   html: use this source instead of the file's (relative paths still resolve next to the file) — om sound probes the text it is about to write
export async function openFilm(file, { chrome = findChrome(), transport = 'pipe', video = 'extract', variables = null, transparent = false, size = null, lenient = false, html: override = null, chromeArgs = [], paintWaits = 2, shotFormat = null, bootTimeout = 120_000, onLog = () => {} } = {}) {
  if (!chrome) throw new OmError(NO_CHROME);
  const html = override ?? readFileSync(file, 'utf8');
  let scratch = null, target = file;
  if (override != null) {
    scratch = mkdtempSync(join(tmpdir(), 'om-page-'));
    target = join(scratch, 'page.html');
    const base = `<base href="${pathToFileURL(dirname(file) + '/').href}">`;
    writeFileSync(target, /<head\b[^>]*>/i.test(html) ? html.replace(/<head\b[^>]*>/i, (m) => m + base) : /<!doctype[^>]*>/i.test(html) ? html.replace(/<!doctype[^>]*>/i, (m) => m + base) : base + html);
  }
  const root = /<[a-z][\w-]*\b[^>]*\sdata-composition-id\s*=[^>]*>/i.exec(html)?.[0] || '';
  const dim = (n, d) => Number(new RegExp(`data-${n}\\s*=\\s*["']?(\\d+)`, 'i').exec(root)?.[1]) || d;
  const [width, height] = size || [dim('width', 1920), dim('height', 1080)];

  const conn = await launch(chrome, { transport, args: [`--window-size=${width},${height}`, ...chromeArgs] });
  const errors = [];
  let page;
  try {
    page = await newPage(conn);
    page.on('Runtime.exceptionThrown', (p) => errors.push(`pageerror: ${p.exceptionDetails?.exception?.description?.split('\n')[0] || p.exceptionDetails?.text}`));
    page.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error') errors.push(`console.error: ${(p.args || []).map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300)}`); });
    page.on('Log.entryAdded', (p) => { if (p.entry?.level === 'error') errors.push(`${p.entry.source}: ${p.entry.text}${p.entry.url ? ` (${p.entry.url})` : ''}`); });
    await Promise.all([page.send('Page.enable'), page.send('Runtime.enable'), page.send('Log.enable')]);
    await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    if (transparent) await page.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    const boot = `window.__omConfig=${JSON.stringify({ video, lenient, paintWaits })};window.__omVariables=${JSON.stringify(variables || {}).replace(/</g, '\\u003c')};\n` + readFileSync(ENGINE, 'utf8');
    await page.send('Page.addScriptToEvaluateOnNewDocument', { source: boot });
    const loaded = new Promise((ok) => page.on('Page.loadEventFired', ok));
    const nav = await page.send('Page.navigate', { url: pathToFileURL(target).href });
    if (nav.errorText) throw new OmError(`could not open ${file}: ${nav.errorText}`);
    await loaded;
    // The start-up handshake: ready, or a reason it cannot start.
    const state = await page.evaluate(`new Promise((ok) => { const t0 = Date.now(); (function poll() {
      if (window.__omReady === true) return ok({ ready: true });
      if (window.__omBootFailed) return ok({ failed: window.__omBootFailed });
      if (Date.now() - t0 > ${bootTimeout}) return ok({ failed: 'the page never became ready' });
      setTimeout(poll, 20); })(); })`, { ms: bootTimeout + 5000 });
    if (state.failed) throw new OmError(`the composition did not start: ${state.failed}${errors.length ? `\n  ${errors.slice(0, 5).join('\n  ')}` : ''}`);
  } catch (e) {
    await conn.close();
    if (scratch) rmSync(scratch, { recursive: true, force: true });
    throw e;
  }
  const info = await page.evaluate('window.__omEngine.info()');
  onLog(`browser  ${chrome} (${conn.transport})`);

  let stalls = 0;
  return {
    get stalls() { return stalls; },
    info, width, height, errors, transport: conn.transport, pid: conn.pid, imageCodec: (shotFormat || (conn.transport === 'pipe' ? 'png' : 'jpeg')) === 'png' ? 'png' : 'mjpeg',
    media: () => page.evaluate('window.__omEngine.media()'),
    setFrames: (id, table) => page.evaluate(`window.__omEngine.setFrames(${JSON.stringify(id)}, ${JSON.stringify(table)})`),
    stats: () => page.evaluate('window.__omEngine.stats()'),
    evaluate: (expr, opts) => page.evaluate(expr, opts),
    send: (method, params) => page.send(method, params),
    // Seek and wait until the frame is painted. A page that never settles fails here, not silently.
    seek: (t) => page.evaluate(`window.__omEngine.seek(${t})`, { ms: 60_000 }),
    advance: (times) => page.evaluate(`window.__omEngine.advance(${JSON.stringify(times)})`),
    // The current frame as an image Buffer. clip: { x, y, width, height, scale } crops (om look --zoom).
    async shot({ format = shotFormat || (conn.transport === 'pipe' ? 'png' : 'jpeg'), quality = shotFormat === 'jpeg' ? 95 : 100, clip = null } = {}) {
      // PNG is lossless and carries alpha; optimizeForSpeed trades file size for ~3x faster encoding.
      // Over the WebSocket fallback large PNGs were seen to drop the connection, so it defaults to JPEG q100.
      const params = { format, ...(format === 'jpeg' ? { quality } : { optimizeForSpeed: true }), fromSurface: true, captureBeyondViewport: false, ...(clip ? { clip: { scale: 1, ...clip } } : {}) };
      // On a machine under heavy load the compositor was seen to drop a screenshot request (no answer for a minute). The page
      // has not changed, so asking again after two painted frames gives the same picture; a third miss fails the render.
      for (let attempt = 1; ; attempt++) {
        try { return Buffer.from((await page.send('Page.captureScreenshot', params, 15_000)).data, 'base64'); } catch (e) {
          if (attempt >= 3 || !/timed out/.test(e.message)) throw e;
          stalls++;
          await page.evaluate('new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)))', { ms: 15_000 });
        }
      }
    },
    async close(opts) { await conn.close(opts); if (scratch) rmSync(scratch, { recursive: true, force: true }); },
  };
}

// A few pictures of one page: times = seconds to seek to (null = as loaded). Returns [{ t, png }].
// clip: { x, y, width, height, scale } crops each shot (a close-up of a spot).
export async function capture(file, { times = [null], clip = null, ...open } = {}) {
  const film = await openFilm(file, { video: 'seek', ...open }); // a handful of frames: the browser's own video decoder is fine
  try {
    const shots = [];
    for (const t of times) {
      if (t != null && film.info.timelines.length) await film.seek(t);
      shots.push({ t, png: await film.shot({ format: 'png', clip }) });
    }
    return { info: film.info, shots, errors: film.errors.slice() };
  } finally { await film.close(); }
}
