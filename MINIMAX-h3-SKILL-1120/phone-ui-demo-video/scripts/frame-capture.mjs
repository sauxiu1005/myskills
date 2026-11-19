import {inflateSync} from 'node:zlib';

// Decode Chromium's 8-bit, non-interlaced RGB/RGBA screenshots. Compare pixels,
// not PNG bytes: compression and ancillary chunks need not be identical.
export function decodeScreenshot(bytes, width, height) {
  const b=Buffer.from(bytes);
  if(!b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw Error('Invalid screenshot PNG');
  let w,h,channels,ended=false;const chunks=[];
  for(let p=8;p+12<=b.length;){
    const size=b.readUInt32BE(p),type=b.toString('ascii',p+4,p+8),end=p+12+size;
    if(end>b.length) throw Error('Truncated screenshot PNG');
    const data=b.subarray(p+8,p+8+size);
    if(type==='IHDR') {
      if(size!==13) throw Error('Invalid PNG header');
      w=data.readUInt32BE(0);h=data.readUInt32BE(4);
      channels=data[9]===2?3:data[9]===6?4:0;
      if(w!==width||h!==height||data[8]!==8||!channels||data[10]||data[11]||data[12]) throw Error('Unsupported screenshot PNG format or dimensions');
    } else if(type==='IDAT') chunks.push(data);
    else if(type==='IEND'){ended=true;break;}
    p=end;
  }
  if(!ended||!channels||!chunks.length) throw Error('Incomplete screenshot PNG');
  const stride=w*channels,expected=(stride+1)*h;
  const raw=inflateSync(Buffer.concat(chunks),{maxOutputLength:expected});
  if(raw.length!==expected) throw Error('Screenshot pixel length mismatch');
  const pixels=Buffer.alloc(stride*h);
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<h;y++){
    const filter=raw[y*(stride+1)];if(filter>4) throw Error('Invalid PNG filter');
    for(let x=0;x<stride;x++){
      const i=y*stride+x,a=x>=channels?pixels[i-channels]:0,up=y?pixels[i-stride]:0,c=y&&x>=channels?pixels[i-stride-channels]:0;
      const prediction=filter===0?0:filter===1?a:filter===2?up:filter===3?Math.floor((a+up)/2):paeth(a,up,c);
      pixels[i]=(raw[y*(stride+1)+1+x]+prediction)&255;
    }
  }
  // Normalize channels so RGB and opaque RGBA encode the same image.
  const rgba=Buffer.alloc(w*h*4,255);
  for(let i=0,j=0;i<pixels.length;i+=channels,j+=4){rgba[j]=pixels[i];rgba[j+1]=pixels[i+1];rgba[j+2]=pixels[i+2];if(channels===4)rgba[j+3]=pixels[i+3];}
  return rgba;
}

export function samePixels(a,b,tolerance=2) {
  if(a.length!==b.length)return false;
  for(let i=0;i<a.length;i++)if(Math.abs(a[i]-b[i])>tolerance)return false;
  return true;
}

// All captures belong to ONE frozen timeline time, never to adjacent frames.
// Accept only consecutive matching captures, retry finitely, fail closed.
export async function captureStableFrame({capture,settle,width,height,onMismatch=async()=>{},maxCaptures=5,check=()=>{}}) {
  if(!Number.isInteger(maxCaptures)||maxCaptures<2||maxCaptures>8)throw Error('Invalid capture limit');
  let previous=null,previousPixels=null,mismatches=0;
  for(let attempt=1;attempt<=maxCaptures;attempt++){
    check();await settle();check();
    const png=Buffer.from(await capture());
    const pixels=decodeScreenshot(png,width,height);
    if(previousPixels){
      if(samePixels(previousPixels,pixels))return {png,captures:attempt,mismatches};
      mismatches++;await onMismatch({attempt,previous,current:png});
    }
    previous=png;previousPixels=pixels;
  }
  throw Error(`Unstable screenshot after ${maxCaptures} captures at the same timeline time; inspect frame diagnostics. No frame was encoded.`);
}
