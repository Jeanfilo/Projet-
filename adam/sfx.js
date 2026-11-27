// Natural ambience only (no music, no voice): cosmic air, wind, leaves, stream, rain, drips.
// usage: node sfx.js out.wav   -> 48 kHz stereo, 60 s, kept very quiet so the narration sits on top.
const fs = require("fs");
const SR = 48000, D = 60, N = SR * D, L = new Float32Array(N), R = new Float32Array(N);
let seed = 12345; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1, ur = () => (rnd() + 1) / 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), sm = x => (x = clamp(x), x * x * (3 - 2 * x));
// piecewise-smooth automation: env([[t,v],...])(t)
const env = kf => t => { if (t <= kf[0][0]) return kf[0][1]; for (let i = 1; i < kf.length; i++) if (t <= kf[i][0]) { const [a, va] = kf[i - 1], [b, vb] = kf[i]; return va + (vb - va) * sm((t - a) / (b - a)); } return kf[kf.length - 1][1]; };
const lp = fc => { const a = 1 - Math.exp(-2 * Math.PI * fc / SR); let y = 0; return x => (y += a * (x - y)); };
function bp(fc, q) { let x1 = 0, x2 = 0, y1 = 0, y2 = 0, b0, b1, b2, a1, a2;
  const set = f => { const w = 2 * Math.PI * f / SR, al = Math.sin(w) / (2 * q), a0 = 1 + al; b0 = al / a0; b1 = 0; b2 = -al / a0; a1 = -2 * Math.cos(w) / a0; a2 = (1 - al) / a0; };
  set(fc); const f = x => { const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; }; f.set = set; return f; }
const hp = fc => { const l = lp(fc); return x => x - l(x); };
// one continuous stereo noise layer through a filter chain, shaped by an envelope
function layer(make, gain, width = 1) { const fl = make(), fr = make();
  for (let n = 0; n < N; n++) { const t = n / SR, g = gain(t); if (g <= 0) { fl(0); fr(0); continue; } const a = rnd(), b = rnd() * width + a * (1 - width); L[n] += fl(a) * g; R[n] += fr(b) * g; } }

// 1. cosmic air: very low, slow-breathing rumble (space, celestial, high altitude)
layer(() => { const f = lp(140), g = lp(140); return x => g(f(x)) * 6; },
  env([[0, 0], [1.2, .5], [13, .45], [21, .4], [26.5, .55], [27.6, .12], [40.2, .12], [42, .35], [58.6, .35], [60, 0]]));
// 2. airy breath: gentle swells that follow the camera moves and the passages through light
layer(() => { const f = bp(1100, .6); return x => f(x) * 1.2; },
  env([[0, 0], [1.5, .08], [3.4, .1], [4.4, .3], [5.4, .08], [12.8, .08], [13.9, .32], [14.8, .06], [20.4, .06], [21.1, .18], [22, .07], [26.2, .08], [27.3, .26], [28.2, 0], [40.0, 0], [41.2, .34], [43, .08], [49.8, .08], [50.6, .22], [51.6, .07], [58.6, .07], [60, 0]]));
// 3. wind: band-limited noise whose colour drifts slowly
{ const fl = bp(500, 1.1), fr = bp(520, 1.1), g = env([[21, 0], [22.5, .1], [24, .18], [26, .26], [27.4, .08], [31.4, .08], [32.3, .3], [33.8, .3], [34.8, .04], [40.2, .04], [41.5, .22], [44, .14], [50, .16], [52, .12], [58.6, .1], [60, 0]]);
  for (let n = 0; n < N; n++) { const t = n / SR, gg = g(t); if (n % 64 === 0) { const f = 420 + 260 * Math.sin(t * .37) + 140 * Math.sin(t * 1.13); fl.set(f); fr.set(f * 1.04); }
    const m = .75 + .25 * Math.sin(t * .9 + Math.sin(t * .23) * 2); L[n] += fl(rnd()) * gg * m * 1.6; R[n] += fr(rnd()) * gg * m * 1.6; } }
// 4. leaves rustling in the garden (louder during the gust), plus a stream with bubbles
{ const hl = hp(2400), hr = hp(2600), sl = lp(7000), sr = lp(7000), g = env([[27, 0], [28, .26], [31.4, .26], [32.3, .55], [33.8, .5], [34.8, .16], [35.6, 0]]); let burst = 0, bt = 0;
  for (let n = 0; n < N; n++) { const t = n / SR, gg = g(t); if (gg <= 0) continue; if (n >= bt) { burst = ur() * .9 + .1; bt = n + (SR * (.01 + ur() * .05)) | 0; }
    const e = burst * (.5 + .5 * Math.sin(t * 2.1 + Math.sin(t * 7) * .5)); L[n] += sl(hl(rnd())) * gg * e * .9; R[n] += sr(hr(rnd())) * gg * e * .9; } }
{ const bed = bp(700, .7), g = env([[27, 0], [28, .18], [32, .14], [34.6, .07], [35.6, 0]]); let next = 27 * SR;
  for (let n = 27 * SR; n < 36 * SR; n++) { const t = n / SR, gg = g(t); const v = bed(rnd()) * gg * .8; L[n] += v; R[n] += v * .9;
    if (n >= next) { next = n + (SR * (.015 + ur() * .06)) | 0; const f0 = 500 + ur() * 1300, tau = .006 + ur() * .02, a = gg * (.2 + ur() * .5), pan = ur();
      for (let k = 0; k < SR * tau * 5 && n + k < N; k++) { const u = k / SR, s = Math.sin(2 * Math.PI * f0 * (1 + 3 * u / tau * .1) * u) * Math.exp(-u / tau) * a; L[n + k] += s * (1 - pan); R[n + k] += s * pan; } } } }
// 5. rain on leaves: dense soft ticks, and slow drips (falling-drop "plip")
{ const g = env([[34.6, 0], [35.8, .32], [39.4, .28], [41, 0]]), fl = bp(4200, .8), fr = bp(3900, .8);
  for (let n = 34 * SR; n < 42 * SR; n++) { const t = n / SR, gg = g(t); const il = ur() < .03 ? rnd() : 0, ir = ur() < .03 ? rnd() : 0; L[n] += fl(il) * gg * 3; R[n] += fr(ir) * gg * 3; }
  let next = 35.2 * SR; while (next < 40.6 * SR) { const n = next | 0, t = n / SR, gg = g(t), f0 = 900 + ur() * 1300, pan = .2 + ur() * .6;
    for (let k = 0; k < SR * .12; k++) { const u = k / SR, f = f0 * (1 + u * 6), s = Math.sin(2 * Math.PI * f * u) * Math.exp(-u / .025) * gg * .45; L[n + k] += s * (1 - pan); R[n + k] += s * pan; }
    next += SR * (.25 + ur() * .6); } }
// 6. faint shimmer of air while the particles of light gather (noise only, no pitch)
{ const g = env([[14, 0], [14.6, .05], [19.5, .05], [21, 0]]), h = hp(5000);
  for (let n = 14 * SR; n < 21 * SR; n++) { const t = n / SR, v = h(rnd()) * g(t) * (.6 + .4 * Math.sin(t * 5.3)); L[n] += v; R[n] += -v; } }

// gentle fade in/out, then normalise peak; final loudness is set by ffmpeg (about -32 LUFS)
for (let n = 0; n < N; n++) { const t = n / SR, f = sm(t / .8) * sm((D - t) / 1.2); L[n] *= f; R[n] *= f; }
let pk = 0; for (let n = 0; n < N; n++) pk = Math.max(pk, Math.abs(L[n]), Math.abs(R[n]));
const gn = .5 / pk, buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) { buf.writeInt16LE(Math.round(clamp(L[n] * gn, -1, 1) * 32767), 44 + n * 4); buf.writeInt16LE(Math.round(clamp(R[n] * gn, -1, 1) * 32767), 46 + n * 4); }
fs.writeFileSync(process.argv[2], buf);
console.log("peak before normalise", pk.toFixed(3));
