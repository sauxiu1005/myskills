import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync,spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {deflateSync} from 'node:zlib';
import {decodeScreenshot,samePixels,captureStableFrame} from './frame-capture.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),cli=path.join(root,'scripts/phone-ui.mjs');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'phone-ui-tests-')),tests=[];
const run=(args,env={})=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8',cwd:tmp,env:{...process.env,...env},timeout:15000});
const ok=(name,fn)=>{fn();tests.push(name);console.log('PASS '+name);};
try{
 const project=path.join(tmp,'project · 中文 空格');
 ok('init from different cwd with Unicode/space path',()=>{const q=run(['init',project]);assert.equal(q.status,0,q.stderr);for(const f of ['LICENSE','PROVENANCE.md','EXPORT.md','scripts/package-lock.json','scripts/frame-capture.mjs','film.js'])assert(fs.existsSync(path.join(project,f)));});
 ok('init never overwrites incremental project',()=>{fs.writeFileSync(path.join(project,'custom.json'),'keep');const before=fs.readFileSync(path.join(project,'story.js'));assert.notEqual(run(['init',project]).status,0);assert.deepEqual(fs.readFileSync(path.join(project,'story.js')),before);assert.equal(fs.readFileSync(path.join(project,'custom.json'),'utf8'),'keep');});
 ok('bundle starter and remove overview navigation',()=>{const q=run(['bundle',project]);assert.equal(q.status,0,q.stderr);const h=fs.readFileSync(path.join(project,'out/preview.html'),'utf8');assert(!h.includes('href="index.html"'));assert(h.includes('function synthesize'));});
 ok('bundle refuses to overwrite prior result',()=>assert.notEqual(run(['bundle',project]).status,0));
 const style=path.join(project,'style.css'),originalCss=fs.readFileSync(style,'utf8');
 ok('bundle embeds CSS local resource',()=>{fs.mkdirSync(path.join(project,'assets'));fs.writeFileSync(path.join(project,'assets/a.svg'),'<svg xmlns="http://www.w3.org/2000/svg"/>');fs.appendFileSync(style,'\n#amb{background:url("assets/a.svg")}');const q=run(['bundle',project,'--out',path.join(project,'out/css.html')]);assert.equal(q.status,0,q.stderr);assert(fs.readFileSync(path.join(project,'out/css.html'),'utf8').includes('data:image/svg+xml;base64,'));});
 ok('missing CSS resource is explicit failure',()=>{fs.writeFileSync(style,originalCss+'\n#amb{background:url(missing.png)}');const q=run(['bundle',project,'--out',path.join(project,'out/missing.html')]);assert.notEqual(q.status,0);assert(q.stderr.includes('cannot find local asset'));});
 fs.writeFileSync(style,originalCss);
 const story=path.join(project,'story.js'),original=fs.readFileSync(story,'utf8');
 ok('unknown scene cannot silently bundle',()=>{fs.writeFileSync(story,original.replace("scene: 'chat'","scene: 'not-implemented'"));const q=run(['bundle',project,'--out',path.join(project,'out/unknown.html')]);assert.notEqual(q.status,0);assert(q.stderr.includes('no matching'));});fs.writeFileSync(story,original);
 ok('project-local dependency discovered from skill CLI',()=>{const d=path.join(project,'scripts/node_modules/puppeteer-core');fs.mkdirSync(d,{recursive:true});fs.writeFileSync(path.join(d,'package.json'),JSON.stringify({name:'puppeteer-core',type:'module',main:'index.js'}));fs.writeFileSync(path.join(d,'index.js'),'export default {launch(){throw Error("DEPENDENCY_RESOLVED_STUB_ONLY")}}');const q=run(['stills',project]);assert(q.stderr.includes('DEPENDENCY_RESOLVED_STUB_ONLY'),q.stderr);});
 ok('frame counts and sampling boundaries (helpers only, not screenshots)',()=>{const src=fs.readFileSync(cli,'utf8'),ctx={};vm.createContext(ctx);const a=src.slice(src.indexOf('const frameCount='),src.indexOf('async function open('));const b=src.slice(src.indexOf('function autoTimes('),src.indexOf('async function seek('));vm.runInContext(a+b+'\nglobalThis.helpers={frameCount,autoTimes,validateConfig}',ctx);const h=ctx.helpers;
  assert.equal(h.frameCount({duration:8.4+9.3,fps:30}),531);assert.equal(h.frameCount({duration:.1+.2,fps:30}),9);
  for(const duration of [.02,.5,6,18,60])for(const fps of [24,30,60]){const cfg={fps,duration,shots:[{start:0,duration}]};const n=h.frameCount(cfg);for(const t of h.autoTimes(cfg)){assert(t>=0&&t<duration,`${duration}/${fps}: ${t}`);assert(Math.round(t*fps)<n);}}
 });
 ok('source syntax checks (not render validation)',()=>{for(const f of ['scripts/phone-ui.mjs','scripts/frame-capture.mjs','assets/starter/film.js','assets/starter/audio.mjs']){const q=spawnSync(process.execPath,['--check',path.join(root,f)],{encoding:'utf8'});assert.equal(q.status,0,q.stderr);}});
 // Tiny valid PNG fixtures with independently known RGBA values.
 const crc=buf=>{let c=0xffffffff;for(const v of buf){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
 const chunk=(type,data)=>{const t=Buffer.from(type),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(data.length);c.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([n,t,data,c]);};
 const fixture=(value,filter=0,channels=4,extra=false)=>{const h=Buffer.alloc(13);h.writeUInt32BE(2);h.writeUInt32BE(2,4);h[8]=8;h[9]=channels===4?6:2;const rows=[];let prev=Buffer.alloc(2*channels);
  for(let y=0;y<2;y++){const row=Buffer.alloc(2*channels,value);if(channels===4){row[3]=255;row[7]=255;}const coded=Buffer.alloc(row.length+1);coded[0]=filter;
   for(let x=0;x<row.length;x++){const a=x>=channels?row[x-channels]:0,b=prev[x],c=x>=channels?prev[x-channels]:0,p=a+b-c;const pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);const predict=[0,a,b,Math.floor((a+b)/2),pa<=pb&&pa<=pc?a:pb<=pc?b:c][filter];coded[x+1]=(row[x]-predict)&255;}rows.push(coded);prev=row;}
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',h),...(extra?[chunk('tEXt',Buffer.from('note\0different encoding'))]:[]),chunk('IDAT',deflateSync(Buffer.concat(rows))),chunk('IEND',Buffer.alloc(0))]);};
 const good=fixture(30),bad=fixture(220),expected=Buffer.from([30,30,30,255,30,30,30,255,30,30,30,255,30,30,30,255]);
 ok('PNG filters, channel normalization and ancillary bytes',()=>{for(let f=0;f<5;f++)for(const c of [3,4])assert.deepEqual(decodeScreenshot(fixture(30,f,c,true),2,2),expected);assert.throws(()=>decodeScreenshot(good,4,2),/dimensions/);assert.throws(()=>decodeScreenshot(good.subarray(0,20),2,2));});
 ok('pixel comparison tolerates only two levels per channel',()=>{assert(samePixels(expected,decodeScreenshot(fixture(32),2,2)));assert(!samePixels(expected,decodeScreenshot(fixture(33),2,2)));});
 const asyncOk=async(name,fn)=>{await fn();tests.push(name);console.log('PASS '+name);};
 const guarded=async(sequence,onMismatch=async()=>{})=>{let i=0,waits=0;const r=await captureStableFrame({width:2,height:2,settle:async()=>{waits++;},capture:async()=>sequence[Math.min(i++,sequence.length-1)],onMismatch});assert.equal(waits,r.captures);return r;};
 await asyncOk('transient bad first capture is discarded',async()=>{let logs=0;const r=await guarded([bad,good,fixture(30,4,3,true)],async()=>{logs++;});assert.equal(r.captures,3);assert.equal(logs,1);assert.deepEqual(decodeScreenshot(r.png,2,2),expected);});
 await asyncOk('transient middle capture cannot pass as a stable frame',async()=>{const r=await guarded([good,bad,good,good]);assert.equal(r.captures,4);assert.equal(r.mismatches,2);});
 await asyncOk('unstable render fails at bounded capture limit',async()=>{let n=0,logs=0;await assert.rejects(captureStableFrame({width:2,height:2,settle:async()=>{},capture:async()=>n++%2?bad:good,onMismatch:async()=>{logs++;}}),/Unstable screenshot/);assert.equal(n,5);assert.equal(logs,4);});
 await asyncOk('legitimate cuts and black frames are not temporal anomalies',async()=>{const black=fixture(0);for(const png of [good,bad,black]){const r=await guarded([png,png]);assert.equal(r.captures,2);assert.equal(r.mismatches,0);}});
 console.log(JSON.stringify({status:'passed',count:tests.length,tests,limits:'No browser frames or MP4 rendered. Dependency stub verifies resolution only.'},null,2));
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
