// Renders film.html frame by frame in headless Chromium (WebGL2 via SwiftShader).
// usage: node render.js <outDir> [--frames 0,30,60 | --range a-b] [--workers 4] [--text-only] [--skip-existing]
// One browser per worker: each has its own GPU process, so SwiftShader uses one core per worker.
// Writes base/fNNNN.jpg (picture) and text/fNNNN.png (subtitles + titles, transparent).
const http = require("http"), fs = require("fs"), path = require("path"), { chromium } = require("playwright");
const ROOT = __dirname, args = process.argv.slice(2), out = path.resolve(args[0] || "out");
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args[i + 1]; };
const TOTAL = 1800, textOnly = args.includes("--text-only"), N = +opt("--workers", 4);
let frames = [...Array(TOTAL).keys()];
if (opt("--frames")) frames = opt("--frames").split(",").map(Number);
if (opt("--range")) { const [a, b] = opt("--range").split("-").map(Number); frames = frames.filter(f => f >= a && f <= b); }
for (const d of ["base", "text"]) fs.mkdirSync(path.join(out, d), { recursive: true });
const nm = f => `f${String(f).padStart(4, "0")}`;
if (args.includes("--skip-existing")) frames = frames.filter(f => !(fs.existsSync(path.join(out, "base", nm(f) + ".jpg")) && fs.existsSync(path.join(out, "text", nm(f) + ".png"))));
const MIME = { ".html": "text/html", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(res);
});
const save = (file, dataURL) => fs.writeFileSync(file, Buffer.from(dataURL.slice(dataURL.indexOf(",") + 1), "base64"));
server.listen(0, "127.0.0.1", async () => {
  const url = `http://127.0.0.1:${server.address().port}/film.html`, t0 = Date.now();
  let done = 0;
  await Promise.all([...Array(Math.min(N, frames.length)).keys()].map(async w => {
    const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    page.on("pageerror", e => { console.error("page error:", e.message); process.exit(1); });
    page.on("console", m => { if (m.type() === "error") console.error("console:", m.text()); });
    await page.goto(url); await page.evaluate(() => window.READY);
    for (let i = w; i < frames.length; i += N) {
      const f = frames[i], name = nm(f);
      const r = await page.evaluate(([f, b]) => window.renderFrame(f, { base: b, text: true }), [f, !textOnly]);
      if (r.img) save(path.join(out, "base", name + ".jpg"), r.img);
      save(path.join(out, "text", name + ".png"), r.txt);
      if (++done % 60 === 0) console.log(`${done}/${frames.length} frames, ${((Date.now() - t0) / done / 1000).toFixed(2)} s/frame`);
    }
    await browser.close();
  }));
  server.close();
  console.log(`done ${frames.length} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
});
