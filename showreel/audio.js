// Transition sound design layered under the song: risers into each cut + sub hits. node audio.js sfx.wav
// Cut times (real s) = reel.html scene cuts after the song warp.
const fs=require('fs'),SR=48000,D=14.4,N=Math.round(SR*D),L=new Float32Array(N),R=new Float32Array(N);
let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647*2-1;
const put=(i,l,r)=>{if(i>=0&&i<N){L[i]+=l;R[i]+=r}};
function boom(t0,len=1,g=1){let ph=0,lp=0;for(let n=0;n<SR*len;n++){const t=n/SR;ph+=(34+40*Math.exp(-t*9))/SR;lp+=.03*(rnd()-lp);
  const v=(Math.sin(ph*2*Math.PI)*Math.exp(-t*3/len)*.7+lp*Math.exp(-t*6)*2.5)*g;put(Math.round(t0*SR)+n,v,v)}}
function riser(t1,len,g=1){let lp=0;const s=Math.round((t1-len)*SR);for(let n=0;n<len*SR;n++){const x=n/(len*SR);lp+=(.02+.4*x*x)*(rnd()-lp);
  const v=lp*x*x*g,pan=Math.sin(x*Math.PI*3)*.6;put(s+n,v*(1-pan),v*(1+pan))}}
const CUTS=[1.138,3.924,6.710,9.497,11.354];
CUTS.forEach((t,i)=>{riser(t,i?.45:1.1);boom(t,i===4?1.8:1)});
riser(9.032,.3,.6); // 3D collapse
let pk=0;for(let n=0;n<N;n++)pk=Math.max(pk,Math.abs(L[n]),Math.abs(R[n]));
const g=.9/pk,b=Buffer.alloc(44+N*4);b.write('RIFF',0);b.writeUInt32LE(36+N*4,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);
b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(N*4,40);
for(let n=0;n<N;n++){b.writeInt16LE(Math.round(L[n]*g*32767),44+n*4);b.writeInt16LE(Math.round(R[n]*g*32767),46+n*4)}
fs.writeFileSync(process.argv[2],b);
