import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {renderHtml} from '../vendor/video-shots/scripts/video-shots.mjs';
import {buildReport} from './build-report.mjs';

// Structural tests only: no video decoding, browser UI or real frame extraction.
const loadDoc = () => JSON.parse(readFileSync(new URL('../vendor/video-shots/examples/demo-shots.json', import.meta.url), 'utf8'));
const playerTag = html => html.match(/<video\b[^>]*id="report-video"[^>]*>/)?.[0] ?? '';

test('report player has a package-relative video source before user file selection', () => {
  const html = renderHtml(loadDoc(), {video:'source.mp4', frameRel:'frames'});
  assert.match(html, /^<!doctype html>/);
  assert.match(playerTag(html), /\ssrc="source\.mp4"/);
  assert.doesNotMatch(playerTag(html), /blob:|file:\/\//);
});

test('explicit package binding overrides a machine-specific source path', () => {
  const doc = loadDoc();
  doc.source = '/private/example-only/original-video.mp4';
  const tag = playerTag(renderHtml(doc, {video:'source.webm', frameRel:'frames'}));
  assert.match(tag, /\ssrc="source\.webm"/);
  assert.doesNotMatch(tag, /\/private\//);
});

test('verified frame references use portable paths and preserve shot slots', () => {
  const doc = loadDoc();
  const frameExists = Object.fromEntries(doc.shots.flatMap(s => [[s.id+'a',true],[s.id+'b',true]]));
  const html = renderHtml(doc, {video:'source.mp4',frameRel:'frames',frameExists});
  assert.ok(playerTag(html).includes(`poster="frames/${doc.shots[0].id}a.jpg"`));
  assert.ok(html.includes('"frameDir":"frames"'));
  for (const shot of doc.shots) assert.ok(html.includes(`"${shot.id}":"ab"`));
});

test('unmeasured input cannot be upgraded into a built synchronized report', () => {
  const root = mkdtempSync(join(tmpdir(),'report-binding-test-'));
  try {
    const input = join(root,'shots.json');
    const stateFile = join(root,'analysis-state.json');
    const out = join(root,'report');
    writeFileSync(input,JSON.stringify(loadDoc()));
    writeFileSync(stateFile,JSON.stringify({timing:{status:'estimated'}}));
    assert.throws(() => buildReport({input,stateFile,out,video:join(root,'not-created.mp4'),frames:join(root,'frames')}), /requires measured timing/);
    assert.equal(existsSync(out),false);
  } finally {rmSync(root,{recursive:true,force:true});}
});
