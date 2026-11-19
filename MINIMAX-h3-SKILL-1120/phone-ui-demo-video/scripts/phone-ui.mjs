#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {captureStableFrame} from './frame-capture.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const FFMPEG=process.env.FFMPEG_PATH||'ffmpeg', FFPROBE=process.env.FFPROBE_PATH||'ffprobe';
function argsOf(argv){const a={_:[]};const flags=new Set(['silent']);for(let i=0;i<argv.length;i++){const x=argv[i];if(!x.startsWith('--'))a._.push(x);else{const k=x.slice(2);if(!['out','audio','times','scale','silent'].includes(k))throw Error('Unknown option: '+x);if(flags.has(k))a[k]=true;else{if(!argv[i+1]||argv[i+1].startsWith('--'))throw Error('Missing value for '+x);a[k]=argv[++i];}}}return a;}
function run(cmd,args){return new Promise((resolve,reject)=>{const p=spawn(cmd,args,{stdio:['ignore','pipe','pipe']});let out='',err='';p.stdout.on('data',b=>out+=b);p.stderr.on('data',b=>err+=b);p.on('error',reject);p.on('close',code=>code===0?resolve(out||err):reject(Error(`${cmd} exited ${code}: ${err.slice(-5000)}`)));});}
let PROJECT_ROOT=null;
function resolvePuppeteer(){
  if(process.env.PUPPETEER_MODULE)return path.resolve(process.env.PUPPETEER_MODULE);
  const bases=[PROJECT_ROOT&&path.join(PROJECT_ROOT,'scripts'),PROJECT_ROOT,HERE,process.cwd()].filter(Boolean);
  for(const b of bases){try{return createRequire(path.join(b,'noop.js')).resolve('puppeteer-core');}catch{}}
  throw Error('puppeteer-core not found. Install it with: npm ci --prefix "<project>/scripts" (or set PUPPETEER_MODULE). Searched: '+bases.join(' | '));
}
async function puppeteer(){const m=await import(pathToFileURL(resolvePuppeteer()).href);for(const c of [m.default,m.default?.default,m])if(c&&typeof c.launch==='function')return c;throw Error('Loaded puppeteer-core has no launch()');}
function onPath(names){const dirs=(process.env.PATH||'').split(path.delimiter).filter(Boolean),ext=process.platform==='win32'?['.exe','']:[''];for(const d of dirs)for(const n of names)for(const e of ext){const f=path.join(d,n+e);if(fs.existsSync(f))return f;}return null;}
function chromePath(){const home=os.homedir(),win=[process.env.PROGRAMFILES,process.env['PROGRAMFILES(X86)'],process.env.LOCALAPPDATA].filter(Boolean);
const mac=['Google Chrome.app/Contents/MacOS/Google Chrome','Chromium.app/Contents/MacOS/Chromium','Microsoft Edge.app/Contents/MacOS/Microsoft Edge','Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'];
const candidates=[process.env.CHROME_PATH,...(process.platform==='darwin'?mac.flatMap(m=>['/Applications/'+m,path.join(home,'Applications',m)]):[]),'/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/microsoft-edge',...win.flatMap(w=>[path.join(w,'Google/Chrome/Application/chrome.exe'),path.join(w,'Chromium/Application/chrome.exe'),path.join(w,'Microsoft/Edge/Application/msedge.exe')]),onPath(['chromium','chromium-browser','google-chrome','google-chrome-stable','chrome','msedge','microsoft-edge'])];const found=candidates.find(p=>p&&fs.existsSync(p));if(!found)throw Error('Set CHROME_PATH to an available, permitted Chromium executable.');return found;}
async function launch(){const p=await puppeteer();return p.launch({executablePath:chromePath(),headless:true,protocolTimeout:120000,args:['--force-color-profile=srgb','--hide-scrollbars','--disable-background-timer-throttling','--disable-renderer-backgrounding']});}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.mp4':'video/mp4','.wav':'audio/wav','.mp3':'audio/mpeg','.otf':'font/otf','.avif':'image/avif'};
async function serve(root){root=fs.realpathSync(root);const server=http.createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost'),rel=decodeURIComponent(u.pathname).replace(/^\/+/,''),p=path.resolve(root,rel||'index.html');if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403);return res.end();}const real=fs.realpathSync(p);if((real!==root&&!real.startsWith(root+path.sep))||!fs.statSync(real).isFile()){res.writeHead(403);return res.end();}res.writeHead(200,{'Content-Type':mime[path.extname(real)]||'application/octet-stream','Cache-Control':'no-store'});const stream=fs.createReadStream(real);stream.on('error',()=>res.destroy());stream.pipe(res);}catch{res.writeHead(404);res.end('Not found');}});await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});return {server,url:`http://127.0.0.1:${server.address().port}`};}
const frameCount=cfg=>Math.max(1,Math.ceil(cfg.duration*cfg.fps-1e-7));
function validateConfig(cfg){
  if(!cfg||typeof cfg!=='object')throw Error('Missing PHONE_FILM config');
  for(const k of ['width','height'])if(!Number.isInteger(cfg[k])||cfg[k]<2||cfg[k]%2)throw Error(`${k} must be a positive even integer`);
  for(const k of ['fps','duration'])if(!Number.isFinite(cfg[k])||cfg[k]<=0)throw Error(`${k} must be positive`);
  if(cfg.fps>120||cfg.duration>3600)throw Error('This renderer supports <=120 fps and <=1 hour; split larger productions.');
  if(!Array.isArray(cfg.shots)||!cfg.shots.length)throw Error('Missing shot list');
  let end=0;for(const s of cfg.shots){if(!Number.isFinite(s.start)||!Number.isFinite(s.duration)||s.duration<=0||Math.abs(s.start-end)>1e-6)throw Error('Shots must be contiguous, ordered and positive');end=s.start+s.duration;}
  if(Math.abs(end-cfg.duration)>1e-6)throw Error('Shot durations do not match film duration');
  if(!Array.isArray(cfg.audioEvents))throw Error('audioEvents must be an array');
  for(const e of cfg.audioEvents)if(!Number.isFinite(e.time)||e.time<0||e.time>=cfg.duration)throw Error('Audio event outside timeline');
}
async function open(root,scale=1){
  const {server,url}=await serve(root);let browser;
  try{
    browser=await launch();const page=await browser.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('requestfailed',r=>errors.push(`${r.url()}: ${r.failure()?.errorText}`));
    page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();if(u.startsWith(url+'/')||u.startsWith('data:')||u.startsWith('blob:'))r.continue();else{errors.push('External asset must be local: '+u);r.abort();}});
    await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
    await page.goto(url+'/film.html?export=1',{waitUntil:'networkidle0',timeout:60000});
    await page.waitForFunction('(window.__PHONE_READY__ === true && typeof window.renderAt === "function") || !!window.__PHONE_ERROR__',{timeout:30000}).catch(e=>{throw Error((errors.length?errors.join('\n')+'\n':'')+'Page never became ready: '+e.message);});
    const pageError=await page.evaluate(()=>window.__PHONE_ERROR__||null);if(pageError)throw Error(pageError);
    const sceneIds=await page.evaluate(()=>[...document.querySelectorAll('.scene')].map(e=>e.id));
    const cfg=await page.evaluate(()=>window.PHONE_FILM);validateConfig(cfg);
    const unknown=[...new Set(cfg.shots.map(s=>s.scene).filter(x=>x!=='close'&&!sceneIds.includes(x)))];if(unknown.length)throw Error('Shots use scenes with no <section class="scene" id=...> in film.html: '+unknown.join(', ')+'. Add the section and its animation in film.js.');
    const width=Math.round(cfg.width*scale/2)*2,height=Math.round(cfg.height*scale/2)*2;
    if(width<2||height<2)throw Error('Scale results in invalid output dimensions');
    await page.setViewport({width,height,deviceScaleFactor:1});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
    if(errors.length)throw Error(errors.join('\n'));
    return {browser,page,server,cfg,width,height,errors};
  }catch(e){if(browser)await browser.close();await new Promise(r=>server.close(r));throw e;}
}
function autoTimes(cfg){const last=(frameCount(cfg)-1)/cfg.fps,snap=t=>Math.min(last,Math.max(0,Math.round(t*cfg.fps)/cfg.fps)),out=[];
  cfg.shots.forEach((s,i)=>{out.push(snap(s.start+s.duration*.25),snap(s.start+s.duration*.6));if(i>0){out.push(snap(s.start-1/cfg.fps),snap(s.start+.1));}});out.push(last);
  return [...new Set(out.map(t=>+t.toFixed(4)))].sort((x,y)=>x-y);}
async function seek(ctx,t){await ctx.page.evaluate(async t=>{await window.renderAt(t);if(document.getAnimations().some(a=>a.playState==='running'))throw Error('Running CSS/WAAPI animation is not deterministic');},t);if(ctx.errors.length)throw Error(ctx.errors.join('\n'));}
async function captureFrame(ctx,t,diagnosticsDir,check=()=>{}){
  await seek(ctx,t);
  ctx.captureStats??={mode:'consecutive-pixel-match',pixelTolerance:2,maxCaptures:5,frames:0,captures:0,recoveredFrames:0,mismatches:0};
  const stats=ctx.captureStats;
  try{
    const result=await captureStableFrame({width:ctx.width,height:ctx.height,check,
      settle:async()=>{await ctx.page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));if(ctx.errors.length)throw Error(ctx.errors.join('\n'));},
      capture:async()=>{stats.captures++;return ctx.page.screenshot({type:'png',captureBeyondViewport:false});},
      onMismatch:async({attempt,previous,current})=>{
        stats.mismatches++;fs.mkdirSync(diagnosticsDir,{recursive:true});
        const prefix=path.join(diagnosticsDir,`t${t.toFixed(6)}-capture`);
        fs.writeFileSync(prefix+`${attempt-1}.png`,previous);fs.writeFileSync(prefix+`${attempt}.png`,current);
      }
    });
    stats.frames++;if(result.mismatches)stats.recoveredFrames++;
    return result.png;
  }catch(e){throw Error(`Frame t=${t.toFixed(6)}s: ${e.message} Diagnostics: ${diagnosticsDir}`);}
}
async function close(ctx){await ctx.browser.close();await new Promise(r=>ctx.server.close(r));}
function encode(args){const p=spawn(FFMPEG,['-hide_banner','-loglevel','error','-nostdin','-y',...args],{stdio:['pipe','ignore','pipe']});let err='';p.stderr.on('data',b=>err+=b);let failure;const done=new Promise(resolve=>{p.on('error',e=>{failure=e;resolve();});p.on('close',code=>{if(code!==0)failure??=Error(`FFmpeg exited ${code}: ${err}`);resolve();});});p.stdin.on('error',e=>failure??=e);return {p,done,check(){if(failure)throw failure;}};}
const pipeWrite=(stream,data)=>new Promise((resolve,reject)=>stream.write(data,e=>e?reject(e):resolve()));
async function verify(file,cfg,width,height,frames,expectAudio){
  const probe=JSON.parse(await run(FFPROBE,['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]));
  const v=probe.streams.find(s=>s.codec_type==='video'),aud=probe.streams.filter(s=>s.codec_type==='audio');
  const ratio=s=>{const [a,b]=s.split('/').map(Number);return a/b;};
  if(!v||v.codec_name!=='h264'||v.pix_fmt!=='yuv420p'||v.width!==width||v.height!==height)throw Error('Video codec/dimensions validation failed');
  if(Math.abs(ratio(v.avg_frame_rate)-cfg.fps)>.001||Number(v.nb_read_frames)!==frames)throw Error('Frame rate/count mismatch');
  if(Math.abs(Number(v.duration)-frames/cfg.fps)>1/cfg.fps+.02||Math.abs(Number(probe.format.duration)-frames/cfg.fps)>1/cfg.fps+.02)throw Error('Duration mismatch');
  if(expectAudio?(aud.length!==1||aud[0].codec_name!=='aac'||Number(aud[0].sample_rate)!==48000):aud.length!==0)throw Error('Audio stream mismatch');
  await run(FFMPEG,['-v','error','-xerror','-i',file,'-f','null','-']);
  return probe;
}
async function exportFilm(root,a){
  if(a.silent&&a.audio)throw Error('--silent and --audio are mutually exclusive');
  const out=path.resolve(a.out||path.join(root,'out/video.mp4'));
  if(!out.toLowerCase().endsWith('.mp4'))throw Error('Output must end with .mp4');
  if(fs.existsSync(out))throw Error('Output exists; choose a new version: '+out);
  if(a.audio&&!fs.existsSync(path.resolve(a.audio)))throw Error('Audio file does not exist');
  const scale=Number(a.scale??1);if(!Number.isFinite(scale)||scale<=0||scale>2)throw Error('scale must be >0 and <=2');
  await run(FFMPEG,['-version']);await run(FFPROBE,['-version']);
  fs.mkdirSync(path.dirname(out),{recursive:true});
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'phone-ui-'));let ctx,encoder,cancelled=false;
  const cancel=()=>{cancelled=true;if(encoder&&encoder.p.exitCode===null)encoder.p.kill();};
  process.on('SIGINT',cancel);process.on('SIGTERM',cancel);
  try{
    ctx=await open(root,scale);const {cfg,width,height}=ctx,frames=frameCount(cfg),duration=frames/cfg.fps;
    let audioFile=a.audio?path.resolve(a.audio):null,sound=null;
    if(!a.silent&&!audioFile&&cfg.audioEvents.length){const {synthesize,wavBytes}=await import(pathToFileURL(path.join(root,'audio.mjs')).href);const pcm=synthesize(cfg.audioEvents,duration);audioFile=path.join(temp,'sfx.wav');fs.writeFileSync(audioFile,wavBytes(pcm));sound={peakBeforeGain:pcm.peakBeforeGain,appliedGain:pcm.appliedGain};}
    if(a.silent)audioFile=null;
    const partial=path.join(temp,'video.mp4'),ff=['-f','image2pipe','-framerate',String(cfg.fps),'-c:v','png','-i','pipe:0'];
    if(audioFile)ff.push('-i',audioFile);
    ff.push('-map','0:v:0');
    if(audioFile)ff.push('-map','1:a:0','-af','apad','-c:a','aac','-b:a','192k','-ar','48000');else ff.push('-an');
    ff.push('-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-vf','scale=out_color_matrix=bt709:out_range=tv,format=yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-color_range','tv','-r',String(cfg.fps),'-fps_mode','cfr','-t',String(duration),'-movflags','+faststart',partial);
    encoder=encode(ff);const started=Date.now();
    for(let n=0;n<frames;n++){
      const check=()=>{if(cancelled)throw Error('Export cancelled');encoder.check();};check();
      const png=await captureFrame(ctx,n/cfg.fps,out+'.frame-diagnostics',check);
      await pipeWrite(encoder.p.stdin,png);
      if(n%Math.max(1,Math.round(cfg.fps*2))===0)console.log(`frames ${n+1}/${frames} · ${((Date.now()-started)/1000).toFixed(1)}s elapsed`);
    }
    encoder.p.stdin.end();await encoder.done;encoder.check();
    const probe=await verify(partial,cfg,width,height,frames,!!audioFile);
    fs.copyFileSync(partial,out,fs.constants.COPYFILE_EXCL);
    const report={status:'passed',output:out,bytes:fs.statSync(out).size,width,height,fps:cfg.fps,frames,duration,requestedDuration:cfg.duration,scale,audio:audioFile?(a.audio?'external-mix':'synthesized-sfx'):'none',sound,frame_capture:ctx.captureStats,technical_check:'passed',user_review:'pending',note:'Technical parameters only; picture and sound are reviewed by the user.',probe};
    fs.writeFileSync(out+'.render-report.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify({status:'passed',output:out,report:out+'.render-report.json',duration,frames,width,height,audio:report.audio}));
  }catch(e){fs.writeFileSync(out+'.failed.json',JSON.stringify({status:'failed',error:e.message,frame_capture:ctx?.captureStats||null},null,2));throw e;}
  finally{process.off('SIGINT',cancel);process.off('SIGTERM',cancel);if(encoder&&encoder.p.exitCode===null){encoder.p.kill();await encoder.done;}if(ctx)await close(ctx);fs.rmSync(temp,{recursive:true,force:true});}
}
function bundle(root,a){
  const out=path.resolve(a.out||path.join(root,'out/preview.html'));
  if(!out.toLowerCase().endsWith('.html'))throw Error('Output must end with .html');
  if(fs.existsSync(out))throw Error('Output exists; choose a new version: '+out);
  const read=f=>{const p=path.join(root,f);if(!fs.existsSync(p))throw Error('Missing project file: '+f);return fs.readFileSync(p,'utf8');};
  const safe=t=>t.replace(/<\/(script|style)/gi,'<\\/$1');
  const dataUri=(rel,from)=>{const clean=rel.split(/[?#]/)[0],p=path.resolve(root,from,decodeURIComponent(clean));if(!p.startsWith(path.resolve(root)+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()||!fs.realpathSync(p).startsWith(fs.realpathSync(root)+path.sep))throw Error('Bundle cannot find local asset: '+rel);return `data:${(mime[path.extname(p).toLowerCase()]||'application/octet-stream').split(';')[0]};base64,${fs.readFileSync(p).toString('base64')}`;};
  const isLocal=u=>!/^(data:|blob:|#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(u.trim());
  const inlineCss=t=>{if(/@import\b/i.test(t))throw Error('Bundle: flatten CSS @import before bundling');return t.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g,(m,q,u)=>isLocal(u)?`url("${dataUri(u.trim(),'.')}")`:m);};
  const css=safe(inlineCss(read('style.css'))),story=safe(read('story.js'));
  {const ids=[...read('film.html').matchAll(/<section[^>]*class="[^"]*\bscene\b[^"]*"[^>]*id="([^"]+)"|<section[^>]*id="([^"]+)"[^>]*class="[^"]*\bscene\b/g)].map(m=>m[1]||m[2]);
   const used=[...story.matchAll(/scene\s*:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]).filter(x=>x!=='close'&&!ids.includes(x));
   if(used.length)throw Error('story.js uses scenes with no matching <section class="scene"> in film.html: '+[...new Set(used)].join(', '));}
  const audio=safe(read('audio.mjs').replace(/^export\s+/gm,''));
  const film=safe(read('film.js').replace(/^\s*import\s*\{[^}]*\}\s*from\s*['"]\.\/audio\.mjs['"];?[ \t]*$/m,''));
  if(/^\s*import\s/m.test(film))throw Error('film.js has imports other than ./audio.mjs; inline them before bundling.');
  let html=read('film.html');if(/\bsrcset\s*=/i.test(html))throw Error('Bundle: replace srcset with a single embedded src');const swaps=[
    ['<link rel="stylesheet" href="style.css">',`<style>${css}</style>`],
    ['<script src="story.js"></script>',`<script>${story}</script>`],
    ['<script type="module" src="film.js"></script>',`<script type="module">${audio}\n${film}</script>`]];
  for(const [from,to] of swaps){if(!html.includes(from))throw Error('film.html no longer contains: '+from);html=html.replace(from,()=>to);}
  html=html.replace(/<a\b[^>]*href=["']index\.html["'][^>]*>[\s\S]*?<\/a>/g,'');
  html=html.replace(/(<(?:img|source|audio|video|link)\b[^>]*?\s(?:src|href)=)(["'])([^"']+)\2/gi,(m,pre,q,u)=>isLocal(u)?`${pre}${q}${dataUri(u,'.')}${q}`:m);
  html=html.replace(/(<(?:video|img)\b[^>]*?\sposter=)(["'])([^"']+)\2/gi,(m,pre,q,u)=>isLocal(u)?`${pre}${q}${dataUri(u,'.')}${q}`:m);
  if(/(?:fetch\s*\(|new\s+(?:Image|Audio)\s*\(|\.src\s*=)/.test(story+'\n'+film))throw Error('Bundle: dynamic asset loading requires explicit data URIs in this starter; remove runtime fetch/src assignments');
  const local=[...html.matchAll(/(?:src|href)=["'](?!data:|blob:|#|https?:)([^"']+)["']/g),...html.matchAll(/url\(\s*['"]?(?!data:|blob:|#|https?:)([^'")]+)/g)].map(m=>m[1].trim()).filter(Boolean);
  const remote=[...html.matchAll(/(?:src|href)=["']((?:https?:|\/\/)[^"']+)["']/g),...html.matchAll(/url\(\s*['"]?((?:https?:|\/\/)[^'")]+)/g)].map(m=>m[1]);if(remote.length)throw Error('Bundle: localize external assets first: '+remote.join(', '));
  if(local.length)throw Error('Inline or embed these local assets before bundling: '+[...new Set(local)].join(', '));
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html,{flag:'wx'});
  console.log(JSON.stringify({status:'passed',output:out,bytes:fs.statSync(out).size}));
}
async function main(){
  const a=argsOf(process.argv.slice(2)),command=a._[0],root=a._[1]?path.resolve(a._[1]):null;
  if(root)PROJECT_ROOT=root;
  if(command==='doctor'){
    const r={node:{ok:true,value:process.version}},tryIt=async(k,f)=>{try{r[k]={ok:true,value:await f()};}catch(e){r[k]={ok:false,error:e.message.split('\n')[0]};}};
    await tryIt('chrome',async()=>chromePath());await tryIt('puppeteer',async()=>resolvePuppeteer());
    await tryIt('ffmpeg',async()=>(await run(FFMPEG,['-version'])).split('\n')[0]);await tryIt('ffprobe',async()=>(await run(FFPROBE,['-version'])).split('\n')[0]);
    if(r.chrome.ok&&r.puppeteer.ok)await tryIt('browserLaunch',async()=>{const b=await launch();try{return await b.version();}finally{await b.close();}});
    const can={bundle:true,preview:true,stills:!!r.browserLaunch?.ok,export:!!(r.browserLaunch?.ok&&r.ffmpeg.ok&&r.ffprobe.ok)};
    const status=can.export?'passed':'incomplete';console.log(JSON.stringify({status,can,checks:r},null,2));if(!can.export)process.exitCode=2;return;
  }
  if(!root||!['init','preview','stills','export','bundle'].includes(command))throw Error('Usage: phone-ui.mjs doctor [PROJECT] | init PROJECT | preview PROJECT | stills PROJECT [--times auto|0,3,8] | export PROJECT [--out FILE.mp4] [--silent | --audio MIX.wav] [--scale 0.5] | bundle PROJECT [--out FILE.html]');
  if(command==='bundle'){bundle(root,a);return;}
  if(command==='init'){
    if(fs.existsSync(root))throw Error('Project path already exists; choose a new directory.');
    const skill=path.resolve(HERE,'..'),starter=path.join(skill,'assets/starter');
    if(!fs.existsSync(starter))throw Error('init must run from the installed skill package.');
    const required=['assets/starter/index.html','assets/starter/film.html','assets/starter/film.js','assets/starter/style.css','assets/starter/story.js','assets/starter/audio.mjs','scripts/phone-ui.mjs','scripts/frame-capture.mjs','scripts/package.json','scripts/package-lock.json','LICENSE','references/rendering.md','references/provenance.md'];
    const missing=required.filter(f=>!fs.existsSync(path.join(skill,f)));if(missing.length)throw Error('Skill package incomplete: '+missing.join(', '));
    fs.mkdirSync(path.dirname(root),{recursive:true});const staging=fs.mkdtempSync(path.join(path.dirname(root),'.phone-init-'));
    try{fs.cpSync(starter,staging,{recursive:true});fs.mkdirSync(path.join(staging,'scripts'));
      for(const f of ['phone-ui.mjs','frame-capture.mjs','package.json','package-lock.json'])fs.copyFileSync(path.join(HERE,f),path.join(staging,'scripts',f));
      fs.copyFileSync(path.join(skill,'LICENSE'),path.join(staging,'LICENSE'));
      fs.copyFileSync(path.join(skill,'references/rendering.md'),path.join(staging,'EXPORT.md'));
      fs.copyFileSync(path.join(skill,'references/provenance.md'),path.join(staging,'PROVENANCE.md'));
      if(fs.existsSync(root))throw Error('Project path was created by another process: '+root);
      fs.renameSync(staging,root);
    }finally{if(fs.existsSync(staging))fs.rmSync(staging,{recursive:true,force:true});}
    console.log(root);return;
  }
  if(command==='preview'){const {server,url}=await serve(root);console.log(url+'/index.html');console.error('Preview server keeps running until stopped (Ctrl+C / kill). Run it as a background process.');for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>server.close(()=>process.exit(0)));return;}
  if(command==='stills'){
    const scale=Number(a.scale??1);if(!Number.isFinite(scale)||scale<=0||scale>2)throw Error('Invalid scale');
    const ctx=await open(root,scale);
    try{const times=(!a.times||a.times==='auto')?autoTimes(ctx.cfg):a.times.split(',').map(Number);const bad=times.filter(t=>!Number.isFinite(t)||t<0||t>=ctx.cfg.duration);if(bad.length)throw Error(`Stills time outside timeline [0, ${ctx.cfg.duration}): ${bad.join(', ')}. Omit --times to sample every shot automatically.`);const dir=path.join(root,'out/stills');fs.mkdirSync(dir,{recursive:true});for(const t of times){const file=path.join(dir,`t${t.toFixed(3)}.png`);const png=await captureFrame(ctx,t,path.join(dir,'frame-diagnostics'));fs.writeFileSync(file,png);console.log(file);}fs.writeFileSync(path.join(dir,'capture-report.json'),JSON.stringify(ctx.captureStats,null,2));}finally{await close(ctx);}return;
  }
  await exportFilm(root,a);
}
main().catch(e=>{console.error(e.stack||e.message);process.exitCode=1;});
