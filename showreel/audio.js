// Synthesised 120 BPM soundtrack locked to the reel's beat grid. node audio.js out.wav
const fs=require('fs'),SR=48000,D=15,N=SR*D,L=new Float32Array(N),R=new Float32Array(N);
let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647*2-1;
const add=(i,v,pan=0)=>{if(i>=0&&i<N){L[i]+=v*(1-pan)*.5*2/2+v*.0;R[i]+=v*(1+pan)*.5}};
const put=(i,l,r)=>{if(i>=0&&i<N){L[i]+=l;R[i]+=r}};
const duck=new Float32Array(N).fill(1);
function kick(t0,g=1){let ph=0;for(let n=0;n<SR*.45;n++){const t=n/SR,f=44+120*Math.exp(-t*32);ph+=f/SR;const v=Math.sin(ph*2*Math.PI)*Math.exp(-t*6.5)*g+(n<200?rnd()*.3*(1-n/200):0);put(Math.round(t0*SR)+n,v*.8,v*.8)}
  for(let n=0;n<SR*.35;n++){const i=Math.round(t0*SR)+n;if(i<N)duck[i]=Math.min(duck[i],1-.75*Math.exp(-n/SR*9))}}
function hat(t0,pan){let p=0;for(let n=0;n<SR*.08;n++){const w=rnd(),v=(w-p)*Math.exp(-n/SR*70)*.12;p=w;put(Math.round(t0*SR)+n,v*(1-pan),v*(1+pan))}}
function clap(t0){let lp=0;for(const o of[0,.011,.022])for(let n=0;n<SR*.25;n++){const w=rnd();lp+=.35*(w-lp);const v=(w-lp)*Math.exp(-n/SR*(o?90:16))*.22;put(Math.round((t0+o)*SR)+n,v,v*.9)}}
function boom(t0,len=1.4){let ph=0,lp=0;for(let n=0;n<SR*len;n++){const t=n/SR;ph+=(34+30*Math.exp(-t*8))/SR;lp+=.02*(rnd()-lp);
  const v=Math.sin(ph*2*Math.PI)*Math.exp(-t*3/len)*.9+lp*Math.exp(-t*4)*3;put(Math.round(t0*SR)+n,v,v)}}
function whoosh(t1,len=.55){let lp=0;const s=Math.round((t1-len)*SR);for(let n=0;n<len*SR;n++){const x=n/(len*SR),c=.02+.25*x*x;lp+=c*(rnd()-lp);
  const v=lp*Math.pow(x,2.2)*.9,pan=Math.sin(x*Math.PI*2)*.7;put(s+n,v*(1-pan),v*(1+pan))}}
function blip(t0,f,g=.15){for(let n=0;n<SR*.12;n++){const t=n/SR,v=Math.sin(2*Math.PI*f*t)*Math.exp(-t*40)*g;put(Math.round(t0*SR)+n,v,v)}}
const hz=m=>440*Math.pow(2,(m-69)/12);
// harmony: Am F C G per 2 s bar
const CH=[[57,60,64,69],[53,57,60,65],[48,55,60,64],[55,59,62,67]],BASS=[33,29,36,31];
// pad
{const st=[];for(let n=0;n<N;n++){const t=n/SR,bar=Math.floor(t/2)%4,chord=t>=13?[57,60,64,71,76]:CH[bar];
  const cut=t<2?.004+.03*(t/2):t>=13?.05*Math.exp(-(t-13)*.6)+.01:.045;
  const amp=(t<2?.5+.5*t/2:1)*(t>14.3?1-(t-14.3)/.7:1)*.055;let l=0,r=0;
  chord.forEach((m,k)=>[-.12,.12].forEach((det,j)=>{const id=k*2+j;st[id]=st[id]||{ph:Math.random(),y:0};const o=st[id];
    o.ph+=hz(m+det)/SR;const saw=2*(o.ph%1)-1;o.y+=cut*(saw-o.y);j?r+=o.y:l+=o.y}));
  put(n,l*amp*duck[n],r*amp*duck[n])}}
// drums + bass 2..13
for(let b=2;b<13;b+=.5)kick(b);for(let b=2.25;b<13;b+=.5)hat(b,((b*4)%2?.4:-.4));for(let b=2.5;b<13;b+=1)clap(b);
{let ph=0;for(let n=Math.round(2*SR);n<13*SR;n++){const t=n/SR,e=(t-2)%.25,m=BASS[Math.floor(t/2)%4]+((Math.floor((t-2)/.25)%4)==3?12:0);
  ph+=hz(m)/SR;const v=(Math.sin(ph*2*Math.PI)+.35*Math.sin(ph*4*Math.PI))*Math.exp(-e*9)*.33*duck[n];put(n,v,v)}}
// transitions + sfx
[2,5,8,11].forEach(t=>{whoosh(t);boom(t)});whoosh(13,.7);boom(13,2);
blip(.08,1320,.2);for(let i=0;i<7;i++)blip(1.0+i*.035,880+i*110,.05);for(let i=0;i<13;i++)blip(1.35+i*.03,1760,.03);
for(let i=0;i<6;i++){blip(2.05+i*.045,660,.04);blip(2.4+i*.045,990,.04)}
for(let i=0;i<5;i++)blip(5.3+i*.5,[523,659,784,988,1046][i],.08);
for(let i=0;i<3;i++)blip(11.1+i*.12,1200+i*200,.08);blip(13.4,1568,.12);blip(13.55,2093,.1);
// shimmer riser into the 3D section and end card
{let ph=0;for(let n=0;n<SR*1.2;n++){const x=n/(SR*1.2);ph+=(300+900*x*x)/SR;const v=Math.sin(ph*2*Math.PI)*x*x*.05;put(Math.round(9.8*SR)+n,v,v)}}
// master: soft clip + normalise
let pk=0;for(let n=0;n<N;n++){L[n]=Math.tanh(L[n]*1.2);R[n]=Math.tanh(R[n]*1.2);pk=Math.max(pk,Math.abs(L[n]),Math.abs(R[n]))}
const g=.92/pk,b=Buffer.alloc(44+N*4);b.write('RIFF',0);b.writeUInt32LE(36+N*4,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);
b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(N*4,40);
for(let n=0;n<N;n++){b.writeInt16LE(Math.round(L[n]*g*32767),44+n*4);b.writeInt16LE(Math.round(R[n]*g*32767),46+n*4)}
fs.writeFileSync(process.argv[2],b);console.log('peak',pk.toFixed(2));
