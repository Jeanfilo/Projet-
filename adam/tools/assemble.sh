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
# capped at 14 Mb/s: film grain is incompressible, TikTok re-encodes to ~3-5 Mb/s anyway
V="-c:v libx264 -preset slow -crf 19 -maxrate 14M -bufsize 28M -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart"
A="-c:a aac -b:a 192k -ar 48000"
ffmpeg -loglevel error -y -framerate 30 -i "$F/base/f%04d.jpg" -framerate 30 -i "$F/text/f%04d.png" -i "$O/ambiance_naturelle.wav" \
  -filter_complex "[0:v][1:v]overlay=0:0:format=auto,hqdn3d=1.2:1.0:2.5:2.5,format=yuv420p[v]" -map "[v]" -map 2:a $V $A -t 60 "$O/le_commencement_d_adam.mp4"
ffmpeg -loglevel error -y -framerate 30 -i "$F/base/f%04d.jpg" -i "$O/ambiance_naturelle.wav" -filter_complex "[0:v]hqdn3d=1.2:1.0:2.5:2.5,format=yuv420p[v]" -map "[v]" -map 1:a $V $A -t 60 "$O/le_commencement_d_adam_sans_sous_titres.mp4"
for f in "$O"/*.mp4; do echo "$(basename "$f"): $(ffprobe -v error -show_entries format=duration,size -of csv=p=0 "$f")"; done
