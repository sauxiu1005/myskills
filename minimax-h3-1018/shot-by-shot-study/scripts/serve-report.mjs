#!/usr/bin/env node
// Loopback-only static preview with HTTP byte ranges for HTML video seeking.
import {createServer} from 'node:http';
import {createReadStream,statSync,realpathSync} from 'node:fs';
import {resolve,join,extname,sep} from 'node:path';
import {pathToFileURL} from 'node:url';

export function serveReport(folder,port=0) {
  const root=realpathSync(folder);
  const mime={'.html':'text/html; charset=utf-8','.mp4':'video/mp4','.m4v':'video/mp4','.webm':'video/webm','.mov':'video/quicktime','.jpg':'image/jpeg','.png':'image/png','.json':'application/json','.css':'text/css','.js':'text/javascript'};
  const server=createServer((req,res)=>{
    try {
      if(!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end();return;}
      const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      let file=resolve(root,'.'+path);
      if(file!==root&&!file.startsWith(root+sep)) {res.writeHead(403);res.end();return;}
      if(statSync(file).isDirectory()) file=join(file,'index.html');
      file=realpathSync(file);
      if(file!==root&&!file.startsWith(root+sep)) {res.writeHead(403);res.end();return;}
      const stat=statSync(file);
      if(!stat.isFile()) {res.writeHead(404);res.end();return;}
      const size=stat.size;
      let start=0,end=size-1,code=200;
      if(req.headers.range) {
        const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if(!match||(!match[1]&&!match[2])) {res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
        start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
        end=match[1]&&match[2]?Math.min(size-1,Number(match[2])):size-1;
        if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size) {res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
        code=206;
      }
      const headers={'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':Math.max(0,end-start+1),'Accept-Ranges':'bytes','Cache-Control':'no-store'};
      if(code===206) headers['Content-Range']=`bytes ${start}-${end}/${size}`;
      res.writeHead(code,headers);
      if(req.method==='HEAD'||size===0) {res.end();return;}
      createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
    }catch {res.writeHead(404);res.end();}
  });
  server.listen(port,'127.0.0.1',()=>console.log(`Report preview: http://127.0.0.1:${server.address().port}/`));
  return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const args=process.argv.slice(2);
  if(!args[0]||args[0]==='--help') console.log('node serve-report.mjs REPORT_FOLDER [--port PORT]');
  else {
    const port=args[1]==='--port'?Number(args[2]):0;
    if(!Number.isInteger(port)||port<0||port>65535) throw new Error('Invalid port');
    serveReport(args[0],port).on('error',e=>{console.error(e.message);process.exitCode=1;});
  }
}
