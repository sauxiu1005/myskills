/* Huashu Motion camera rig. Absolute-time sampling, no renderer dependency. MIT. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OpenMotionCamera=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const clamp=x=>Math.max(0,Math.min(1,x));
 const ease={linear:x=>x,hold:x=>x<1?0:1,inQuad:x=>x*x,outCubic:x=>1-(1-x)**3,inOutCubic:x=>x<.5?4*x*x*x:1-(-2*x+2)**3/2,inOutQuint:x=>x<.5?16*x**5:1-(-2*x+2)**5/2,outExpo:x=>x===1?1:1-2**(-10*x),inExpo:x=>x===0?0:2**(10*x-10)};
 const finite=n=>typeof n==='number'&&Number.isFinite(n);
 function create(shots){
  if(!Array.isArray(shots)||!shots.length)throw new Error('Camera rig requires shots');
  const source=JSON.parse(JSON.stringify(shots));let previousEnd=0;const ids=new Set();
  source.forEach((s,i)=>{if(!finite(s.start)||!finite(s.end)||s.start!==previousEnd||s.end<=s.start)throw new Error('Camera shots must be contiguous, increasing, and start at zero');previousEnd=s.end;if(typeof s.id!=='string'||!s.id.trim()||ids.has(s.id)||!Array.isArray(s.keys)||s.keys.length<1)throw new Error('Camera shot needs a unique non-empty string id and pose keys');ids.add(s.id);let last=-1;
   s.keys.forEach((k,j)=>{if(!finite(k.at)||k.at<0||k.at>s.end-s.start+1e-9||k.at<=last||(j===0&&k.at!==0))throw new Error('Camera key times must increase from zero inside each shot');last=k.at;for(const name of ['position','target'])if(!Array.isArray(k[name])||k[name].length!==3||!k[name].every(finite))throw new Error('Camera vectors require three finite values');if(!finite(k.fov)||k.fov<=1||k.fov>=150)throw new Error('Camera field of view is invalid');if(k.roll!==undefined&&!finite(k.roll))throw new Error('Camera roll is invalid');if(k.ease&&!ease[k.ease])throw new Error('Unknown camera ease');});
  });
  function sample(time){if(!finite(time))throw new Error('Camera time must be finite');const t=Math.max(0,Math.min(time,previousEnd));const shot=source.find(s=>t<s.end)||source[source.length-1],local=t-shot.start;let a=shot.keys[0],b=a;for(let i=1;i<shot.keys.length;i++){b=shot.keys[i];if(local<=b.at)break;a=b;}const progress=b.at===a.at?0:Math.abs(local-b.at)<1e-9?1:clamp((local-a.at)/(b.at-a.at)),u=ease[b.ease||'linear'](progress),mix=(x,y)=>x+(y-x)*u;return{time:t,shot:shot.id,local,progress,position:a.position.map((n,i)=>mix(n,b.position[i])),target:a.target.map((n,i)=>mix(n,b.target[i])),fov:mix(a.fov,b.fov),roll:mix(a.roll||0,b.roll||0)};}
  return Object.freeze({duration:previousEnd,sample,shots:()=>JSON.parse(JSON.stringify(source))});
 }
 function track(pose,subject,options={}){if(!subject||!Array.isArray(subject.position)||!Array.isArray(subject.forward)||subject.position.length!==3||subject.forward.length!==3||![...subject.position,...subject.forward].every(finite))throw new Error('Tracking needs a finite subject pose');const length=Math.hypot(subject.forward[0],subject.forward[2]);if(length<1e-8)throw new Error('Tracking forward vector must have a horizontal direction');const f=[subject.forward[0]/length,0,subject.forward[2]/length],right=[-f[2],0,f[0]],distance=options.distance??6,height=options.height??3,side=options.side??0,lookAhead=options.lookAhead??1;if(![distance,height,side,lookAhead].every(finite)||distance<0||height<0)throw new Error('Tracking offsets are invalid');return{...pose,position:subject.position.map((v,i)=>v-f[i]*distance+right[i]*side+(i===1?height:0)),target:subject.position.map((v,i)=>v+f[i]*lookAhead+(i===1?.6:0))};}
 return Object.freeze({create,track,eases:Object.keys(ease)});
});
