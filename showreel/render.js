// usage: node render.js <outDir> [frame,frame,...]   (no list = all 900 frames, 4 workers)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const out=process.argv[2],list=process.argv[3]?process.argv[3].split(',').map(Number):[...Array(900).keys()];
fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch(),N=Math.min(4,list.length);
  await Promise.all([...Array(N).keys()].map(async w=>{const p=await b.newPage({viewport:{width:1920,height:1080}});
    p.on('pageerror',e=>{console.error(e);process.exit(1)});
    await p.goto('file://'+path.resolve(__dirname,'reel.html'));await p.evaluate(()=>window.ready);
    for(let i=w;i<list.length;i+=N){const f=list[i];
      const d=await p.evaluate(f=>{renderFrame(f);return document.getElementById('c').toDataURL('image/png')},f);
      fs.writeFileSync(path.join(out,`f${String(f).padStart(4,'0')}.png`),Buffer.from(d.split(',')[1],'base64'))}}));
  await b.close()})();
