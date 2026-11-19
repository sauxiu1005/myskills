// Deterministic math helpers, not a full video template. Units: seconds, radians.
export const clamp01 = x => Math.max(0, Math.min(1, x));
export const lerp = (a,b,u) => a + (b-a)*u;
export function smooth5(u) { u=clamp01(u); return u*u*u*(10+u*(-15+6*u)); }
export function step(t, omega=22, zeta=.88) {
  if (!(omega>0 && zeta>0 && zeta<=1)) throw new RangeError('omega>0; 0<zeta<=1');
  if(t<=0) return 0;
  if(zeta===1) return 1-(1+omega*t)*Math.exp(-omega*t);
  const d=Math.sqrt(1-zeta*zeta), wd=omega*d;
  return 1-Math.exp(-zeta*omega*t)*(Math.cos(wd*t)+zeta/d*Math.sin(wd*t));
}
// changes: chronological [{at, value, omega?, zeta?}], values are absolute targets.
export function springTrack(t, initial, changes) {
  let x=initial, prev=initial, last=-Infinity;
  for(const e of changes) {
    if(e.at<last) throw new RangeError('changes must be chronological');
    x+=(e.value-prev)*step(t-e.at,e.omega??22,e.zeta??.88);
    prev=e.value; last=e.at;
  }
  return x;
}
// Release displacement from target with arbitrary initial velocity.
export function releaseSpring(t,x0,v0,target,omega=22,zeta=.88) {
  if (!(omega>0 && zeta>0 && zeta<=1)) throw new RangeError('omega>0; 0<zeta<=1');
  if(t<=0) return x0;
  const y=x0-target;
  if(zeta===1) return target+(y+(v0+omega*y)*t)*Math.exp(-omega*t);
  const wd=omega*Math.sqrt(1-zeta*zeta);
  return target+Math.exp(-zeta*omega*t)*(y*Math.cos(wd*t)+(v0+zeta*omega*y)/wd*Math.sin(wd*t));
}
export function segment(t,start,end,a,b) {
  if(!(end>start)) throw new RangeError('end must exceed start');
  return lerp(a,b,smooth5((t-start)/(end-start)));
}
