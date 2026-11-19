import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const usage='Usage: node design-init.mjs <new-project-directory> [--mode svg|iso-glow-3d]';
if(args.length===1&&args[0]==='--help'){console.log(usage);process.exit(0);}
if(!args[0]||args[0].startsWith('--')||![1,3].includes(args.length)||(args.length===3&&args[1]!=='--mode')){
  console.error(usage);process.exit(2);
}
const mode=args[2]??'svg';
if(!['svg','iso-glow-3d'].includes(mode))throw Error('Unsupported mode: '+mode);
const out=path.resolve(args[0]);
if(out===root || out.startsWith(root+path.sep)){throw Error('Use a project directory outside the installed skill');}
if(fs.existsSync(out)&&fs.readdirSync(out).length){throw Error('Destination must be new or empty; existing files were not modified');}
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<20||(major===20&&minor<10))throw Error('Node 20.10+ required');
// Resolve required assets before creating the destination.
const sourceDirs=mode==='svg'?['kit','scripts','examples/dial-indicator']:['vendor/iso-glow'];
for(const d of sourceDirs)if(!fs.existsSync(path.join(root,d)))throw Error('Missing skill asset: '+d);
fs.mkdirSync(out,{recursive:true});
if(mode==='svg'){
  for(const d of sourceDirs)fs.cpSync(path.join(root,d),path.join(out,d),{recursive:true});
}else{
  fs.cpSync(path.join(root,'vendor/iso-glow'),path.join(out,'iso-glow-source'),{recursive:true});
}
fs.copyFileSync(path.join(root,'LICENSE'),path.join(out,'LICENSE'));
fs.mkdirSync(path.join(out,'qa'),{recursive:true});
const checks=['build','modelTests','browserChecks','visualReview','canvas','preview','package'];
if(mode==='iso-glow-3d')checks.push('scaleAndSources','orbitAndControls','explosionAndSection','desktopAndMobile','webglAndOffline');
const state={version:1,renderMode:mode,node:process.version,project:out,skillRoot:root,outputLanguage:{status:'pending',choice:null,locale:null,label:null,direction:null,source:null},capabilities:{node:'passed',filesystem:'passed',browser:'pending',canvas:'pending'},checks:Object.fromEntries(checks.map(k=>[k,{status:'pending',evidence:[]}]))};
fs.writeFileSync(path.join(out,'design-state.json'),JSON.stringify(state,null,2)+'\n');
console.log(JSON.stringify({created:out,renderMode:mode,node:process.version,next:mode==='svg'?'Resolve outputLanguage via Chinese / English / Other choice (or an explicit existing user choice), then write brief, model.mjs and build.mjs; example is reference only.':'Read references/iso-glow-3d.md in the skill. Resolve project language, research facts and unit mapping, then write the new figure and bundle dependencies. The copied CDN template is a source asset, not a finished offline HTML or MP4.'},null,2));
