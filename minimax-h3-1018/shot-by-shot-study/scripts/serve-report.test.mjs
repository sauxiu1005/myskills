import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {serveReport} from './serve-report.mjs';
test('preview serves media ranges, suffixes and rejects invalid ranges and escaping paths',async()=>{
  const root=mkdtempSync(join(tmpdir(),'report-http-test-'));
  writeFileSync(join(root,'index.html'),'<html>preview</html>');
  writeFileSync(join(root,'source.mp4'),'0123456789');
  const server=serveReport(root);
  try {
    await once(server,'listening');const url=`http://127.0.0.1:${server.address().port}`;
    let res=await fetch(url);assert.equal(res.status,200);assert.match(await res.text(),/preview/);
    res=await fetch(url+'/source.mp4',{headers:{Range:'bytes=2-5'}});
    assert.equal(res.status,206);assert.equal(res.headers.get('content-range'),'bytes 2-5/10');assert.equal(await res.text(),'2345');
    res=await fetch(url+'/source.mp4',{headers:{Range:'bytes=-3'}});assert.equal(await res.text(),'789');
    res=await fetch(url+'/source.mp4',{headers:{Range:'bytes=100-'}});assert.equal(res.status,416);
    res=await fetch(url+'/%2e%2e%2foutside');assert.equal(res.status,403);
    res=await fetch(url+'/source.mp4',{method:'HEAD'});assert.equal(res.headers.get('content-length'),'10');assert.equal(await res.text(),'');
  } finally {await new Promise(resolve=>server.close(resolve));rmSync(root,{recursive:true,force:true});}
});
