"""Place each narration line on its scene and derive word-accurate subtitle timings.
usage: python3 -I voice_align.py narration_raw.wav narration.title subs_lines.json out_dir
  subs_lines.json: [[target_start, "chunk|chunk|..."], ...]  (one entry per narration line)
Writes out_dir/narration.wav (60 s, 48 kHz mono) and out_dir/timing.js (subtitle chunks).
"""
import json, sys, wave
import numpy as np

raw_wav, title_json, lines_json, out_dir = sys.argv[1:5]
lines = json.load(open(lines_json))
segs = json.load(open(title_json))

# 1. character -> time map, rebuilt by walking the TTS tokens along our own text (robust to offset quirks)
texts = [l[1].replace("|", " ") for l in lines]
full = "\n".join(texts)
tb = np.full(len(full), np.nan); te = np.full(len(full), np.nan)
pos = 0
for s in segs:
    for w in s["timestamped_words"]:
        tok = w["word"]
        if not tok.strip() or tok.startswith("<#"):
            continue
        while pos < len(full) and full[pos].isspace():
            pos += 1
        k = full.find(tok, pos, pos + len(tok) + 6)
        if k < 0:
            continue  # token not found nearby (normalised text): its letters inherit neighbours' times
        tb[k:k + len(tok)] = w["time_begin"] / 1000; te[k:k + len(tok)] = w["time_end"] / 1000
        pos = k + len(tok)
idx = np.arange(len(full)); ok = ~np.isnan(tb)
letters = np.array([not c.isspace() for c in full])
assert ok[letters].mean() > .97, f"only {ok[letters].mean():.0%} of letters aligned"
tb = np.interp(idx, idx[ok], tb[ok]); te = np.interp(idx, idx[ok], te[ok])

# 2. speech span of every line, then its new start (target, never overlapping the previous line)
starts, spans, off = [], [], 0
for (target, _), t in zip(lines, texts):
    b, e = tb[off], te[off + len(t) - 1]
    s = max(target, (starts[-1] + spans[-1][1] - spans[-1][0] + .3) if starts else 0)
    starts.append(s); spans.append((b, e)); off += len(t) + 1
assert starts[-1] + spans[-1][1] - spans[-1][0] < 58.8, "narration runs past the end card"

# 3. assemble the 60 s narration track
with wave.open(raw_wav) as w:
    sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
SR = 48000; out = np.zeros(SR * 60, np.float32)
for s, (b, e) in zip(starts, spans):
    a, z = max(0, int((b - .06) * sr)), min(len(x), int((e + .3) * sr))
    seg = x[a:z]; n = len(seg)
    fade = np.ones(n); f = int(.02 * sr); fade[:f] = np.linspace(0, 1, f); fade[-int(.12 * sr):] *= np.linspace(1, 0, int(.12 * sr))
    seg = np.interp(np.arange(0, n, sr / SR), np.arange(n), seg * fade)  # resample to 48 kHz
    p = int((s - .06) * SR); out[p:p + len(seg)] += seg[:len(out) - p]
with wave.open(f"{out_dir}/narration.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())

# 4. subtitle chunks: shown from their first word until the next chunk (or a short hold after the line)
chunks, off = [], 0
for li, ((target, raw), s, (b, e)) in enumerate(zip(lines, starts, spans)):
    shift, c0 = s - b, off
    parts = raw.split("|")
    for pi, p in enumerate(parts):
        st = tb[c0] + shift - .08
        c0 += len(p) + 1
        en = (tb[c0] + shift - .1) if pi < len(parts) - 1 else (e + shift + .35)
        chunks.append({"start": round(float(st), 2), "end": round(float(en), 2), "text": p})
    off += len(texts[li]) + 1
for a, c in zip(chunks, chunks[1:]):
    a["end"] = min(a["end"], c["start"])
    assert a["end"] > a["start"], a
with open(f"{out_dir}/timing.js", "w") as f:
    f.write("// Subtitle timings measured on the generated narration (word timestamps). Written by tools/voice_align.py\n")
    f.write("var ALIGNED = " + json.dumps(chunks, ensure_ascii=False, indent=0) + ";\nif (typeof module !== 'undefined') module.exports = ALIGNED;\n")
for s, (b, e), t in zip(starts, spans, texts):
    print(f"{s:6.2f} -> {s + e - b:6.2f}  {t[:60]}")
