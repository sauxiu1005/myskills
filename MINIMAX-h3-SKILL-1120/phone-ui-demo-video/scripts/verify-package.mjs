import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'references/package-manifest.json');
if(!fs.existsSync(file)){console.error('Manifest missing: '+file);process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(file,'utf8')),fail=[];
for(const e of manifest.files){
 const p=path.resolve(root,e.path);
 if(!p.startsWith(root+path.sep)){fail.push('Unsafe manifest path: '+e.path);continue;}
 if(!fs.existsSync(p)){fail.push('MISSING '+e.path);continue;}
 if(!fs.statSync(p).isFile()){fail.push('NOT FILE '+e.path);continue;}
 const b=fs.readFileSync(p),hash=crypto.createHash('sha256').update(b).digest('hex');
 if(b.length!==e.bytes||hash!==e.sha256)fail.push('CHANGED '+e.path+' bytes='+b.length+' sha256='+hash);
}
console.log(JSON.stringify({status:fail.length?'failed':'passed',checked:manifest.files.length,issues:fail},null,2));
if(fail.length)process.exitCode=1;
