// Render an offline SVG scene adapter to H.264. No browser, screen capture or network.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const [sceneFile, output, ...flags] = process.argv.slice(2);
if (!sceneFile || !output || flags.some(f => !['--preview'].includes(f))) {
  console.log('Usage: node render-video.mjs scene.mjs output.mp4 [--preview]\nScene exports width, height, fps, duration, frameAt(t) returning {svg,state}.\nSet SHARP_MODULE and FFMPEG_PATH if not available normally. --preview saves chapter frames only.');
  process.exit(sceneFile === '--help' ? 0 : 2);
}
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const scene = await import(pathToFileURL(path.resolve(sceneFile)));
const {width,height,fps,duration,frameAt} = scene;
if (![width,height,fps,duration].every(Number.isFinite) || width%2 || height%2 || width<2 || height<2 || fps<1 || fps>120 || duration<=0 || duration>600 || typeof frameAt!=='function') throw Error('Invalid scene dimensions, timing or frameAt');
const out = path.resolve(output), qa = out.replace(/\.[^.]+$/, '')+'-qa';
fs.mkdirSync(path.dirname(out),{recursive:true}); fs.mkdirSync(qa,{recursive:true});
const checkpoints = scene.checkpoints || [0,duration/2,duration-1/fps];
const evidence=[];
for (const t of checkpoints) {
  const frame = await frameAt(t);
  await sharp(Buffer.from(frame.svg)).resize(width,height).png().toFile(path.join(qa,`frame-${t.toFixed(2)}.png`));
  evidence.push({t,state:frame.state});
}
fs.writeFileSync(path.join(qa,'states.json'),JSON.stringify(evidence,null,2)+'\n');
if (flags.includes('--preview')) {console.log(`Preview: ${qa}`);process.exit(0);}
if (fs.existsSync(out)) throw Error('Output already exists; choose a fresh versioned filename');
const partial=out+'.partial.mp4', total=Math.round(duration*fps);
const ff=spawn(process.env.FFMPEG_PATH || 'ffmpeg',['-hide_banner','-loglevel','error','-n','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',partial],{stdio:['pipe','ignore','pipe']});
let stderr='';ff.stderr.on('data',d=>stderr+=d);
ff.stdin.on('error',()=>{});
const closed = new Promise((resolve,reject)=>{ff.once('error',reject);ff.once('close',code=>resolve(code));});
try {
  for(let i=0;i<total;i++) {
    const frame=await frameAt(i/fps);
    const png=await sharp(Buffer.from(frame.svg)).resize(width,height).png().toBuffer();
    if(ff.stdin.destroyed)throw Error('Encoder input closed: '+stderr);
    if(!ff.stdin.write(png))await Promise.race([once(ff.stdin,'drain'),closed.then(code=>{throw Error('Encoder stopped: '+code+' '+stderr);})]);
    if(i%fps===0)console.log(`render ${i}/${total}`);
  }
  ff.stdin.end(); const code=await closed;if(code!==0)throw Error('Encoder failed: '+stderr);
  fs.renameSync(partial,out);
  fs.writeFileSync(path.join(qa,'render.json'),JSON.stringify({output:out,width,height,fps,duration,frames:total,audio:'silent',method:'offline SVG frames; not a browser interaction recording'},null,2)+'\n');
  console.log(`DONE ${out}`);
} catch(error) {ff.kill();throw error;}
