// Synthesised phonk soundtrack, 120 BPM, locked to the reel's grid. node audio.js out.wav
// Structure: 0-2 filtered intro + riser | 2 DROP | 8 switch-up | 10.5 break (silence) | 11 slam | 13 final hit + tail
const fs=require('fs'),SR=48000,D=15,N=SR*D,L=new Float32Array(N),R=new Float32Array(N);
let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647*2-1;
const put=(i,l,r)=>{if(i>=0&&i<N){L[i]+=l;R[i]+=r}};
const hz=m=>440*Math.pow(2,(m-69)/12), S16=.125;
const live=t=>t>=2&&t<13&&!(t>=10.5&&t<11); // drums/bass/riff play
const duck=new Float32Array(N).fill(1);

function kick(t0,g=1){let ph=0;for(let n=0;n<SR*.5;n++){const t=n/SR,f=48+170*Math.exp(-t*38);ph+=f/SR;
  const v=Math.tanh(Math.sin(ph*2*Math.PI)*Math.exp(-t*7)*3)*.75*g+(n<120?rnd()*.5*(1-n/120):0);put(Math.round(t0*SR)+n,v,v)}
  for(let n=0;n<SR*.3;n++){const i=Math.round(t0*SR)+n;if(i<N)duck[i]=Math.min(duck[i],1-.8*Math.exp(-n/SR*10))}}
function snare(t0,g=1){let lp=0;for(const o of[0,.008,.017])for(let n=0;n<SR*.3;n++){const t=n/SR,w=rnd();lp+=.4*(w-lp);
  const v=((w-lp)*Math.exp(-t*(o?80:14))*.3+(o?0:Math.sin(2*Math.PI*190*t)*Math.exp(-t*30)*.25))*g;put(Math.round((t0+o)*SR)+n,v,v*.92)}}
function hat(t0,g,pan){let p=0;for(let n=0;n<SR*.05;n++){const w=rnd(),v=(w-p)*Math.exp(-n/SR*90)*.11*g;p=w;put(Math.round(t0*SR)+n,v*(1-pan),v*(1+pan))}}
// 808 cowbell: two detuned squares, band-limited by a one-pole, short decay
function cowbell(t0,m,g=1,cut=.35){const f1=hz(m),f2=f1*1.48;let y=0,h=0;for(let n=0;n<SR*.28;n++){const t=n/SR;
  const sq=(Math.sin(2*Math.PI*f1*t)>0?1:-1)+(Math.sin(2*Math.PI*f2*t)>0?.8:-.8);y+=cut*(sq-y);const hp=y-h;h+=.02*(y-h);
  const v=hp*(Math.exp(-t*9)*.7+Math.exp(-t*40)*.3)*.13*g;put(Math.round(t0*SR)+n,v,v)}}
function boom(t0,len=1.4,g=1){let ph=0,lp=0;for(let n=0;n<SR*len;n++){const t=n/SR;ph+=(36+40*Math.exp(-t*9))/SR;lp+=.02*(rnd()-lp);
  const v=(Math.tanh(Math.sin(ph*2*Math.PI)*2.5)*Math.exp(-t*3/len)*.8+lp*Math.exp(-t*4)*3)*g;put(Math.round(t0*SR)+n,v,v)}}
function riser(t1,len,g=.9){let lp=0;const s=Math.round((t1-len)*SR);for(let n=0;n<len*SR;n++){const x=n/(len*SR);lp+=(.02+.4*x*x)*(rnd()-lp);
  const v=lp*Math.pow(x,2)*g,pan=Math.sin(x*Math.PI*3)*.6;put(s+n,v*(1-pan),v*(1+pan))}}

// --- cowbell riff (A minor), 2 bars of 16ths; null = rest
const RIFF=[69,null,null,69,null,null,72,null,69,null,76,null,74,72,null,71,
            69,null,null,69,null,null,72,null,67,null,null,67,64,null,67,null];
const RIFF2=[81,null,79,null,76,null,79,null,81,null,84,null,83,81,null,79, // switch-up from 8s, an octave higher
             81,null,null,81,null,79,76,null,74,null,null,76,79,null,76,null];
// intro: same riff, low-passed and opening up
for(let s=0;s<16;s++){const t=s*S16,m=RIFF[s%32];if(m!==null)cowbell(t,m,.4+.6*t/2,.03+.25*(t/2)**2)}
for(let t=2;t<13;t+=S16){if(!live(t))continue;const s=Math.round((t-2)/S16)%32,m=(t>=8?RIFF2:RIFF)[s];if(m!==null)cowbell(t,m,1)}
// final phrase rings out
[[13,81],[13.375,79],[13.75,76],[14.125,69]].forEach(([t,m],i)=>cowbell(t,m,1-i*.18));

// --- distorted 808 with glides; per-bar root, hits on a syncopated 16th pattern
const ROOT=[33,33,29,31],HITS=[0,3,6,10,12,14];
{let f=hz(33),ph=0,env=0;const ev=[];
  for(let bar=1;bar<6.5;bar++)HITS.forEach((h,k)=>{const t=bar*2+h*S16;if(!live(t))return;
    const r=ROOT[Math.floor(t/2)%4]+(k===4?12:k===5?7:0);ev.push([t,r])});
  ev.push([11,33]);ev.push([13,33]);ev.sort((a,b)=>a[0]-b[0]);
  let e=0;for(let n=Math.round(2*SR);n<N;n++){const t=n/SR;while(e<ev.length&&ev[e][0]<=t){env=1;e++}
    const target=hz(ev[Math.max(0,e-1)][1]);f+= (target-f)*.0009; // glide
    ph+=f/SR;env*=t>=13?.99997:.99992;if(!live(t)&&t<13)env*=.999;
    const v=Math.tanh(Math.sin(ph*2*Math.PI)*env*4)*.32*(t>=13?1:duck[n]*.6+.4);put(n,v,v)}}

// --- drums
for(let t=2;t<13;t+=.5){if(!live(t))continue;const s=Math.round((t-2)/.5)%4;if(s===0||(s===2&&Math.floor(t)%2))kick(t);if(s===1||s===3)snare(t)}
for(let t=2;t<13;t+=S16){if(!live(t))continue;const s=Math.round((t-2)/S16)%32,roll=s>=28&&Math.floor((t-2)/4)%2;
  hat(t,s%2?.6:1,s%2?.35:-.35);if(roll){hat(t+S16/2,.7,0)}}
// extra kicks on the switch-up for drive
for(let t=8.75;t<10.5;t+=1)kick(t,.7);

// --- transitions
[2,5,8,11].forEach(t=>{riser(t,.6);boom(t)});riser(10.5,.4,.5);riser(13,1.0,1.1);boom(13,2,1.2);
riser(2,2,.6); // intro build
// break: reversed-808 suck-in into 11
{let ph=0;for(let n=0;n<SR*.45;n++){const x=n/(SR*.45);ph+=(40+60*x)/SR;const v=Math.sin(ph*2*Math.PI)*x*x*.6;put(Math.round(10.55*SR)+n,v,v)}}

// --- stereo echo on everything above the bass (3/16 ping-pong)
{const d=Math.round(.1875*SR);for(let n=d;n<N;n++){L[n]+=R[n-d]*.22;R[n]+=L[n-d]*.22}}
// fade tail
for(let n=Math.round(14.4*SR);n<N;n++){const g=1-(n/SR-14.4)/.6;L[n]*=g;R[n]*=g}
// master: drive + soft clip + normalise
let pk=0;for(let n=0;n<N;n++){L[n]=Math.tanh(L[n]*1.1);R[n]=Math.tanh(R[n]*1.1);pk=Math.max(pk,Math.abs(L[n]),Math.abs(R[n]))}
const g=.95/pk,b=Buffer.alloc(44+N*4);b.write('RIFF',0);b.writeUInt32LE(36+N*4,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);
b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(N*4,40);
for(let n=0;n<N;n++){b.writeInt16LE(Math.round(L[n]*g*32767),44+n*4);b.writeInt16LE(Math.round(R[n]*g*32767),46+n*4)}
fs.writeFileSync(process.argv[2],b);console.log('peak',pk.toFixed(2));
