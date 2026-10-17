#!/usr/bin/env node
// Produces a portable report folder; no Design calls and no re-analysis of content.
import {readFileSync,writeFileSync,existsSync,mkdirSync,copyFileSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {renderHtml,validate} from '../vendor/video-shots/scripts/video-shots.mjs';
import {buildPlan} from './canvas-plan.mjs';
const here=fileURLToPath(new URL('.',import.meta.url));
export function buildReport({input,stateFile,video,frames,trackFile,out}) {
  const doc=JSON.parse(readFileSync(input,'utf8'));
  const state=JSON.parse(readFileSync(stateFile,'utf8'));
  if(state.timing?.status!=='measured') throw new Error('Interactive synchronization requires measured timing');
  buildPlan(doc,state); // checks timing provenance and continuous coverage
  if(!statSync(video).isFile()) throw new Error('Video is not a readable file');
  const extension=video.toLowerCase().match(/\.(mp4|webm|mov|m4v)$/)?.[1];
  if(!extension) throw new Error('Use a browser-playable MP4/WebM/MOV/M4V input; validate its codec separately');
  const sourceName=`source.${extension}`;
  const frameExists={};
  for(const s of doc.shots) for(const suffix of ['a','b']) {
    const key=s.id+suffix;
    if(!existsSync(join(frames,key+'.jpg'))) throw new Error(`Missing keyframe: ${key}.jpg`);
    frameExists[key]=true;
  }
  const track=trackFile?JSON.parse(readFileSync(trackFile,'utf8')):undefined;
  const ctx={track,frameExists,frameDir:'frames',frameRel:'frames',video:sourceName};
  const check=validate(doc,ctx);
  if(!check.ok) throw new Error(`Shot validation failed: ${check.failed.map(g=>g.id).join(', ')}`);
  const dest=resolve(out);
  if(existsSync(dest)) throw new Error('Output directory already exists; choose a new revision');
  let html=renderHtml(doc,ctx);
  const css=readFileSync(join(here,'report-follow.css'),'utf8');
  const js=readFileSync(join(here,'report-follow.js'),'utf8');
  html=html.replace('</head>',`<style>\n${css}\n</style>\n</head>`)
    .replace('</body>',`<script>\n${js}\n</script>\n</body>`);
  mkdirSync(join(dest,'frames'),{recursive:true});
  for(const key of Object.keys(frameExists)) copyFileSync(join(frames,key+'.jpg'),join(dest,'frames',key+'.jpg'));
  copyFileSync(video,join(dest,sourceName));
  copyFileSync(input,join(dest,'shots.json'));
  copyFileSync(stateFile,join(dest,'analysis-state.json'));
  writeFileSync(join(dest,'index.html'),html);
  writeFileSync(join(dest,'checks.json'),JSON.stringify({
    dataValidation:check,
    browserPlayback:'not-tested-by-builder',
    highlightSeekAndFollow:'not-tested-by-builder',
    designEmbedding:'not-tested-by-builder'
  },null,2));
  return {entry:join(dest,'index.html'),video:sourceName,shots:doc.shots.length,frameCount:Object.keys(frameExists).length};
}
export function main(argv) {
  if(argv.includes('--help')) {console.log('node build-report.mjs shots.json --state analysis-state.json --video source.mp4 --frames frames [--track track.json] --out NEW_REPORT_DIR');return;}
  const [input,...rest]=argv;const options={input};
  const names={'--state':'stateFile','--video':'video','--frames':'frames','--track':'trackFile','--out':'out'};
  for(let i=0;i<rest.length;i+=2) {
    if(!names[rest[i]]||!rest[i+1]||rest[i+1].startsWith('--')) throw new Error('Invalid arguments; use --help');
    options[names[rest[i]]]=rest[i+1];
  }
  for(const field of ['input','stateFile','video','frames','out']) if(!options[field]) throw new Error(`Missing ${field}; use --help`);
  console.log(JSON.stringify(buildReport(options),null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  try {main(process.argv.slice(2));}catch(e){console.error(e.message);process.exitCode=1;}
}
