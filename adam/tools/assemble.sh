#!/usr/bin/env bash
# Encode the rendered frames into the deliverables.
# usage: tools/assemble.sh <framesDir> <outDir>
set -euo pipefail
F="$1"; O="$2"; HERE="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$O"
node "$HERE/sfx.js" "$F/sfx_raw.wav" >/dev/null
# ambience ~ -32 LUFS: discreet, leaves headroom for the voice-over
ffmpeg -loglevel error -y -i "$F/sfx_raw.wav" -af "volume=-11dB" -c:a pcm_s16le "$O/ambiance_naturelle.wav"
node "$HERE/make_srt.js" "$O/le_commencement_d_adam.srt"
AUD="$O/ambiance_naturelle.wav"
if [ -f "$HERE/voice/narration.wav" ]; then
  # a small synthetic hall: a hint of space around the narrator, kept low so diction stays clear
  python3 -I - "$F/ir.wav" <<'PY'
import sys, wave, numpy as np
from scipy.signal import lfilter
sr = 48000; t = np.arange(int(1.4 * sr)) / sr; rng = np.random.default_rng(3); chans = []
for _ in range(2):
    x = rng.standard_normal(len(t)) * np.exp(-t / .32)
    x = lfilter([.35], [1, -.65], x)            # darker tail
    x = np.concatenate([np.zeros(int(.018 * sr)), x])  # 18 ms pre-delay
    chans.append(x / np.sqrt((x ** 2).sum()))
ir = np.stack(chans, 1) * .5
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(ir, -1, 1) * 32767).astype(np.int16).tobytes())
PY
  ffmpeg -loglevel error -y -i "$HERE/voice/narration.wav" -i "$F/ir.wav" -filter_complex \
    "[0:a]highpass=f=75,acompressor=threshold=0.125:ratio=2.5:attack=8:release=160:makeup=2,pan=stereo|c0=c0|c1=c0,asplit=2[d][w];[w][1:a]afir[r];[d][r]amix=inputs=2:weights=1 0.16:normalize=0[v]" \
    -map "[v]" -c:a pcm_s16le "$F/voice_proc.wav"
  I=$(ffmpeg -hide_banner -i "$F/voice_proc.wav" -af ebur128 -f null - 2>&1 | grep -E "^ +I:" | tail -1 | awk '{print $2}')
  G=$(python3 -c "print(round(-16-($I),2))")   # narration at -16 LUFS, ambience stays ~16 dB under it
  ffmpeg -loglevel error -y -i "$F/voice_proc.wav" -i "$O/ambiance_naturelle.wav" -filter_complex \
    "[0:a]volume=${G}dB[v];[v][1:a]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.84:level=false[a]" -map "[a]" -c:a pcm_s16le "$O/voix_et_ambiance.wav"
  AUD="$O/voix_et_ambiance.wav"
fi
# capped at 14 Mb/s: film grain is incompressible, TikTok re-encodes to ~3-5 Mb/s anyway
V="-c:v libx264 -preset slow -crf 19 -maxrate 14M -bufsize 28M -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart"
A="-c:a aac -b:a 192k -ar 48000"
ffmpeg -loglevel error -y -framerate 30 -i "$F/base/f%04d.jpg" -framerate 30 -i "$F/text/f%04d.png" -i "$AUD" \
  -filter_complex "[0:v][1:v]overlay=0:0:format=auto,hqdn3d=1.2:1.0:2.5:2.5,format=yuv420p[v]" -map "[v]" -map 2:a $V $A -t 60 "$O/le_commencement_d_adam.mp4"
ffmpeg -loglevel error -y -framerate 30 -i "$F/base/f%04d.jpg" -i "$AUD" -filter_complex "[0:v]hqdn3d=1.2:1.0:2.5:2.5,format=yuv420p[v]" -map "[v]" -map 1:a $V $A -t 60 "$O/le_commencement_d_adam_sans_sous_titres.mp4"
for f in "$O"/*.mp4; do echo "$(basename "$f"): $(ffprobe -v error -show_entries format=duration,size -of csv=p=0 "$f")"; done
