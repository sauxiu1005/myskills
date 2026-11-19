import {synthesize} from './audio.mjs';
addEventListener('error',e=>{window.__PHONE_ERROR__=e.message||'Page script error';});
addEventListener('unhandledrejection',e=>{window.__PHONE_ERROR__=String(e.reason?.message||e.reason);});
const $=s=>document.querySelector(s), cfg=window.PHONE_FILM, shots=cfg.shots;
const query=new URLSearchParams(location.search), exporting=query.has('export');
if(exporting)document.body.classList.add('export');
document.title=cfg.title;
$('#brand').textContent=cfg.brand;$('#tagline').textContent=cfg.tagline;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=p=>1-(1-clamp(p))**3;
const ramp=(t,a,b)=>ease((t-a)/(b-a));
const mix=(a,b,p)=>a+(b-a)*p;
const scenes=[...document.querySelectorAll('.scene')];
const unknownScenes=[...new Set(shots.map(s=>s.scene).filter(id=>!scenes.some(el=>el.id===(id==='close'?'lock':id))))];
if(unknownScenes.length){window.__PHONE_ERROR__='Unknown scene(s): '+unknownScenes.join(', ')+'. Add matching scene elements in film.html and animation in film.js.';throw Error(window.__PHONE_ERROR__);}
let active=-1;
function caption(el,lines,effect){el.replaceChildren();lines.forEach(line=>{const row=document.createElement('span');if(effect==='wave'){[...line].forEach(c=>{const char=document.createElement('span');char.className='char';char.textContent=c;row.append(char)})}else row.textContent=line;el.append(row)});}
function animateCaption(el,effect,t,delay,out){
  const p=ramp(t,delay,delay+.65);el.style.opacity=p*(1-out);
  let trans=`translateY(${(1-p)*40}px)`, filter=`blur(${(1-p)*6}px)`;
  if(effect==='flip')trans=`perspective(1000px) rotateX(${(1-p)*-55}deg)`;
  if(effect==='zoom')trans=`scale(${1+(1-p)*.22})`;
  if(effect==='glow'){trans='none';filter=`blur(${(1-p)*10}px)`;}
  el.style.transform=trans;el.style.filter=filter;
  [...el.querySelectorAll('.char')].forEach((ch,i)=>{const q=ramp(t,delay+i*.048,delay+i*.048+.55);ch.style.opacity=q;ch.style.transform=`translateY(${(1-q)*38}px) rotate(${(1-q)*5}deg)`;});
}
function fit(){const s=Math.min(innerWidth/cfg.width,innerHeight/cfg.height);$('#stage').style.width=cfg.width+'px';$('#stage').style.height=cfg.height+'px';$('#stage').style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit);fit();
window.renderAt=function(seconds){
  const t=clamp(seconds,0,cfg.duration-1e-7);
  let i=shots.findIndex(s=>t>=s.start&&t<s.start+s.duration);if(i<0)i=shots.length-1;
  const s=shots[i],u=(t-s.start)/s.duration,local=u*6;
  if(i!==active){active=i;$('#chapter').textContent=`SHOT ${String(i+1).padStart(2,'0')} / ${shots.length} · ${s.scene.toUpperCase()}`;$('#shot-title').textContent=s.title;caption($('#caption-left'),s.left,s.effect);caption($('#caption-right'),s.right,s.effect);}
  scenes.forEach(el=>el.style.display=(el.id===(s.scene==='close'?'lock':s.scene)?'block':'none'));
  const closing=s.scene==='close',exit=closing?ramp(local,3.3,5.1):0;
  animateCaption($('#caption-left'),s.effect,local,.3,exit);
  animateCaption($('#caption-right'),s.effect,local,2.5,exit);
  const entrance=ramp(t,0,1.3),yaw=5*Math.sin(t*Math.PI/1.5);
  $('#phone').style.opacity=entrance*(1-exit);
  $('#phone').style.transform=`translate(-50%,-50%) translateY(${(1-entrance)*70+exit*45}px) rotateY(${mix(-24,yaw,entrance)+exit*25}deg) rotateX(${2.5*Math.sin(t*Math.PI/3)+exit*8}deg) rotateZ(${-exit*4}deg) scale(${(.92+.08*entrance)*(1-exit*.42)})`;
  $('#wall').style.background=`radial-gradient(ellipse at 10% 0,#ffffff80,transparent 46%),radial-gradient(ellipse at 90% 30%,#71e8ee90,transparent 65%),linear-gradient(155deg,${s.color},#253892 70%,#121c54)`;
  $('#wall').style.transform=`scale(${1.03+.025*Math.sin(t/6)}) translate(${Math.sin(t/5)*8}px,${Math.cos(t/6)*6}px)`;
  const open=s.scene==='app'?ramp(local,1,2):0;
  const dark=['chat','data'].includes(s.scene)||(s.scene==='app'&&open>.6);
  $('#status').style.color=dark?'#17233f':'#fff';$('.homebar').style.background=dark?'#17233f':'#fff';
  $('#sleep').style.opacity=closing?ramp(local,2.7,3.4):1-ramp(t,0,.6);
  $('#brand-card').style.opacity=closing?ramp(local,4.2,5.2):0;
  document.querySelectorAll('.notice').forEach((el,j)=>{const p=closing?1:ramp(local,1.0+j*1.8,1.6+j*1.8);el.style.opacity=p;el.style.transform=`translateY(${(1-p)*-30}px) scale(${.94+.06*p})`;});
  const aw=$('#app-window');aw.style.left=mix(40,0,open)+'px';aw.style.top=mix(320,0,open)+'px';aw.style.width=mix(72,390,open)+'px';aw.style.height=mix(72,846,open)+'px';aw.style.borderRadius=mix(22,48,open)+'px';aw.style.opacity=open>0?1:0;$('#app-content').style.opacity=open;
  $('#app-icon').style.transform=`scale(${1-.08*Math.sin(clamp((local-.7)/.5)*Math.PI)})`;
  document.querySelectorAll('.feature').forEach((el,j)=>{const p=ramp(local,2.05+j*.07,2.6+j*.07);el.style.opacity=p;el.style.transform=`translateY(${(1-p)*22}px)`;});
  document.querySelectorAll('.bubble').forEach((el,j)=>{const p=ramp(local,.4+j*1.05,.9+j*1.05);el.style.opacity=p;el.style.transform=`translateY(${(1-p)*20}px) scale(${.95+.05*p})`;});
  const progress=.78*ramp(local,.8,3.2);$('#ring').style.strokeDashoffset=540.354*(1-progress);$('#count').textContent=Math.round(progress*100);
  document.querySelectorAll('.metric').forEach((el,j)=>{const p=ramp(local,2.6+j*.4,3.2+j*.4);el.style.opacity=p;el.style.transform=`translateY(${(1-p)*15}px)`;});
  $('#timecode').textContent=`${t.toFixed(1)} / ${cfg.duration.toFixed(1)}s · ${s.title}`;
  document.querySelectorAll('#segments i').forEach((el,j)=>el.style.width=(clamp((t-shots[j].start)/shots[j].duration)*100)+'%');
  window.__PHONE_STATE__={time:t,shot:i,scene:s.scene};
};
let current=shots[clamp(Number(query.get('shot'))||0,0,shots.length-1)].start,playing=false,started=false,realStart=0,muted=true;
let audioCtx,audioBuffer,audioSource;
function stopAudio(){if(audioSource){audioSource.stop();audioSource.disconnect();audioSource=null;}}
async function syncAudio(){stopAudio();if(muted||!playing||exporting)return;audioCtx??=new AudioContext();await audioCtx.resume();if(!audioBuffer){const {pcm,sampleRate}=synthesize(cfg.audioEvents,cfg.duration);audioBuffer=audioCtx.createBuffer(1,pcm.length,sampleRate);audioBuffer.copyToChannel(pcm,0);}if(!playing||muted)return;audioSource=audioCtx.createBufferSource();audioSource.buffer=audioBuffer;audioSource.connect(audioCtx.destination);audioSource.start(0,Math.min(current,cfg.duration-.001));}
function paintPause(){$('#pause').textContent=playing?'暂停':'播放';}
function play(){if(current>=cfg.duration)current=0;started=true;$('#intro').style.display='none';playing=true;realStart=performance.now()-current*1000;paintPause();syncAudio();}
function pause(){playing=false;stopAudio();paintPause();}
function seek(t){current=clamp(t,0,cfg.duration-1/cfg.fps);realStart=performance.now()-current*1000;window.renderAt(current);syncAudio();}
shots.forEach((s,i)=>{const b=document.createElement('button');b.title=s.title;b.setAttribute('aria-label',s.title);b.innerHTML='<i></i>';b.onclick=()=>seek(s.start);$('#segments').append(b);});
$('#start').onclick=play;$('#pause').onclick=()=>playing?pause():play();
$('#replay').onclick=()=>{seek(0);play();};$('#mute').onclick=()=>{muted=!muted;$('#mute').textContent=muted?'开启音效':'静音';syncAudio();};
const nav=dir=>seek(shots[clamp(active+dir,0,shots.length-1)].start);
$('#prev').onclick=()=>nav(-1);$('#next').onclick=()=>nav(1);
addEventListener('keydown',e=>{if(exporting)return;if(e.code==='Space'){e.preventDefault();playing?pause():play();}else if(e.key.toLowerCase()==='r')$('#replay').click();else if(e.key==='ArrowLeft')nav(-1);else if(e.key==='ArrowRight')nav(1);});
addEventListener('mousemove',e=>$('#hud').classList.toggle('visible',started&&innerHeight-e.clientY<70));
function tick(now){if(playing){current=Math.min(cfg.duration,(now-realStart)/1000);window.renderAt(current);if(current>=cfg.duration)pause();}requestAnimationFrame(tick);}
window.renderAt(current);window.__PHONE_READY__=true;if(!exporting)requestAnimationFrame(tick);
