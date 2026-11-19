// Constant-tempo candidates + measured waveform transients; no third-party Node packages.
// Input: little-endian Float32 mono PCM, sample rate, output JSON. Not lyric alignment.
import fs from 'fs';
const [,,file,srArg,outFile]=process.argv;const SR=+srArg;
if(!file||!outFile||!Number.isFinite(SR)||SR<8000||SR>192000) throw new Error('Usage: node analyze-beats.mjs mono.f32 SAMPLE_RATE output.json (8000..192000 Hz)');
const buf=fs.readFileSync(file);const x=new Float32Array(buf.buffer,buf.byteOffset,Math.floor(buf.length/4));
if(buf.length%4!==0) throw new Error('PCM byte length must be divisible by 4');
const dur=x.length/SR;
if(dur<4||dur>1200) throw new Error('Analyze a 4..1200 second range; retain its source offset');
let energy=0;for(const v of x){if(!Number.isFinite(v)) throw new Error('Non-finite PCM sample');energy+=v*v;}
if(energy/x.length<1e-10) throw new Error('Audio is silent or too quiet for reliable analysis');
// ---- transient envelope: high-passed (1st diff) energy in [t,t+W] vs [t-W,t]
const hpx=new Float32Array(x.length);for(let i=1;i<x.length;i++)hpx[i]=x[i]-x[i-1];
const cs=new Float64Array(x.length+1);for(let i=0;i<x.length;i++)cs[i+1]=cs[i]+hpx[i]*hpx[i];
const W=Math.round(0.010*SR),step=Math.round(0.001*SR);const ms=[];// rise per ms
for(let n=W;n<x.length-W;n+=step){const a=(cs[n]-cs[n-W])/W+1e-9,b=(cs[n+W]-cs[n])/W+1e-9;ms.push({t:n/SR,r:Math.max(0,Math.log(b/a)),e:b});}
const rise=new Float32Array(Math.ceil(dur*1000)+2);for(const m of ms)rise[Math.round(m.t*1000)]=m.r;
const R=t=>rise[Math.round(t*1000)]||0;
// ---- tempo from coarse onset curve (sum of rise in 10ms bins) via autocorrelation
const cb=new Float32Array(Math.ceil(dur*100));for(let i=0;i<rise.length;i++)cb[Math.floor(i/10)]+=rise[i];
let best={s:-1};for(let bpm=70;bpm<=180;bpm+=0.02){const lag=6000/bpm;let s=0;for(let i=0;i+2*lag<cb.length;i++){const j=i+lag,k=i+2*lag;const v=(t)=>{const a=Math.floor(t),f=t-a;return cb[a]*(1-f)+(cb[a+1]||0)*f;};s+=cb[i]*(v(j)+0.5*v(k));}if(s>best.s)best={s,bpm};}
// ---- grid fit at 1 ms phase resolution, small smoothing tolerance (±3 ms max)
const Rs=t=>Math.max(R(t-0.002),R(t-0.001),R(t),R(t+0.001),R(t+0.002));
let g={s:-1};for(let bpm=best.bpm-0.6;bpm<=best.bpm+0.6;bpm+=0.005){const P=60/bpm;for(let ph=0;ph<P;ph+=0.001){let s=0;for(let t=ph;t<dur-0.02;t+=P)s+=Rs(t);if(s>g.s)g={s,bpm,ph};}}
const P=60/g.bpm;const beats=[];for(let t=g.ph;t<dur-0.02;t+=P)beats.push(t);
// per-beat nearest transient within ±60 ms: strongest rise peak; record deviation + strength
const per=beats.map(t=>{let bt=t,bv=0;for(let d=-0.060;d<=0.060001;d+=0.001){const v=R(t+d);if(v>bv){bv=v;bt=t+d;}}return {grid:+t.toFixed(4),transient:+bt.toFixed(4),dev_ms:+((bt-t)*1000).toFixed(1),strength:+bv.toFixed(2)};});
const strong=per.filter(p=>p.strength>=1.0);const devs=strong.map(p=>Math.abs(p.dev_ms)).sort((a,b)=>a-b);
const out={method:'raw_waveform_transient_grid',confidence:'estimated_constant_tempo_grid_with_measured_transients',limitations:['70..180 BPM search; half/double tempo ambiguity','variable tempo and weak percussion need manual review','transient strength is not proof of musical downbeat','does not align words or phonemes'],file,sr:SR,duration_s:+dur.toFixed(4),bpm_autocorr:+best.bpm.toFixed(2),bpm:+g.bpm.toFixed(3),phase_s:+g.ph.toFixed(4),beat_period_s:+P.toFixed(5),n_beats:beats.length,strong_beats:strong.length,median_abs_dev_ms_strong:devs[devs.length>>1]??null,p90_abs_dev_ms_strong:devs[Math.floor(devs.length*0.9)]??null,beats:per};
fs.writeFileSync(outFile,JSON.stringify(out,null,1));
console.log(JSON.stringify({...out,beats:per.slice(0,4)}));
