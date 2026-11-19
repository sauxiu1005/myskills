// Shared deterministic PCM synthesis for preview and offline WAV export.
export function synthesize(events, duration, sampleRate = 48000) {
  const pcm = new Float32Array(Math.ceil(duration * sampleRate));
  const lengths = {pop:.13, whoosh:.45, swipe:.23, type:.065, ding:.65, thud:.27};
  events.forEach((e, index) => {
    if (!(e.type in lengths) || !Number.isFinite(e.time) || e.time < 0 || !Number.isFinite(e.gain ?? .2) || (e.gain ?? .2) < 0) throw new Error('Invalid audio event');
    let seed = (index + 1) * 2654435761 >>> 0;
    const length = lengths[e.type], start = Math.round(e.time * sampleRate), gain = e.gain ?? .2;
    for (let n=0; n<Math.ceil(length*sampleRate) && start+n<pcm.length; n++) {
      const t=n/sampleRate, p=t/length;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const noise=(seed/4294967296)*2-1;
      let wave;
      if(e.type==='ding') wave=(Math.sin(2*Math.PI*880*t)+.35*Math.sin(2*Math.PI*1320*t))*Math.exp(-7*p);
      else if(e.type==='pop') wave=Math.sin(2*Math.PI*(480*t-900*t*t))*Math.exp(-9*p);
      else if(e.type==='thud') wave=(Math.sin(2*Math.PI*72*t)+.15*noise)*Math.exp(-9*p);
      else if(e.type==='type') wave=noise*Math.exp(-14*p);
      else wave=(noise*.4+Math.sin(2*Math.PI*(140*t+170*t*t))*.1)*Math.sin(Math.PI*p)**2;
      pcm[start+n] += wave*gain*Math.min(1,t/.003)*Math.min(1,(length-t)/.01);
    }
  });
  let peak=0; for(const x of pcm) peak=Math.max(peak,Math.abs(x));
  const scale=peak>.9?.9/peak:1;
  if(scale<1) for(let i=0;i<pcm.length;i++) pcm[i]*=scale;
  return {pcm, sampleRate, peakBeforeGain:peak, appliedGain:scale};
}
export function wavBytes({pcm,sampleRate}) {
  const bytes=new Uint8Array(44+pcm.length*2), v=new DataView(bytes.buffer);
  const str=(at,s)=>[...s].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));
  str(0,'RIFF');v.setUint32(4,36+pcm.length*2,true);str(8,'WAVE');str(12,'fmt ');
  v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sampleRate,true);
  v.setUint32(28,sampleRate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,pcm.length*2,true);
  for(let i=0;i<pcm.length;i++)v.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,pcm[i]))*32767),true);
  return bytes;
}
