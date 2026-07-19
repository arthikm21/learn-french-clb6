#!/usr/bin/env bash
set -euo pipefail

FILM_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRAME_DIR="$FILM_ROOT/assets/film-v3/render"
VOICE_FILE="$FILM_ROOT/audio/5311184f258e06aa.mp3"
OUTPUT_FILE="$FILM_ROOT/launch-film-vertical-v3.mp4"

for required_file in \
  "$FRAME_DIR/01-hook.jpg" \
  "$FRAME_DIR/02-promise.jpg" \
  "$FRAME_DIR/03-product.jpg" \
  "$FRAME_DIR/04-scenarios.jpg" \
  "$FRAME_DIR/05-tcf.jpg" \
  "$FRAME_DIR/06-payoff.jpg" \
  "$FRAME_DIR/07-cta.jpg" \
  "$VOICE_FILE"; do
  if [[ ! -s "$required_file" ]]; then
    echo "Missing V3 video input: $required_file" >&2
    exit 1
  fi
done

ffmpeg -hide_banner -loglevel warning -y \
  -loop 1 -framerate 30 -t 3.50 -i "$FRAME_DIR/01-hook.jpg" \
  -loop 1 -framerate 30 -t 2.58 -i "$FRAME_DIR/02-promise.jpg" \
  -loop 1 -framerate 30 -t 5.68 -i "$FRAME_DIR/03-product.jpg" \
  -loop 1 -framerate 30 -t 3.38 -i "$FRAME_DIR/04-scenarios.jpg" \
  -loop 1 -framerate 30 -t 3.18 -i "$FRAME_DIR/05-tcf.jpg" \
  -loop 1 -framerate 30 -t 3.78 -i "$FRAME_DIR/06-payoff.jpg" \
  -loop 1 -framerate 30 -t 2.98 -i "$FRAME_DIR/07-cta.jpg" \
  -i "$VOICE_FILE" \
  -filter_complex "\
    [0:v]scale=1080:1920:flags=lanczos,setsar=1,zoompan=z='min(zoom+0.00022,1.023)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,format=yuv420p[v0];\
    [1:v]scale=1080:1920:flags=lanczos,setsar=1,zoompan=z='min(zoom+0.00012,1.012)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,format=yuv420p[v1];\
    [2:v]scale=1080:1920:flags=lanczos,setsar=1,fps=30,format=yuv420p[v2];\
    [3:v]scale=1080:1920:flags=lanczos,setsar=1,zoompan=z='min(zoom+0.00012,1.012)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,format=yuv420p[v3];\
    [4:v]scale=1080:1920:flags=lanczos,setsar=1,zoompan=z='min(zoom+0.00012,1.012)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,format=yuv420p[v4];\
    [5:v]scale=1080:1920:flags=lanczos,setsar=1,zoompan=z='min(zoom+0.00022,1.023)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,format=yuv420p[v5];\
    [6:v]scale=1080:1920:flags=lanczos,setsar=1,zoompan=z='min(zoom+0.00010,1.010)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,format=yuv420p[v6];\
    [v0][v1]xfade=transition=fade:duration=0.18:offset=3.32[x1];\
    [x1][v2]xfade=transition=fade:duration=0.18:offset=5.72[x2];\
    [x2][v3]xfade=transition=fade:duration=0.18:offset=11.22[x3];\
    [x3][v4]xfade=transition=fade:duration=0.18:offset=14.42[x4];\
    [x4][v5]xfade=transition=fade:duration=0.18:offset=17.42[x5];\
    [x5][v6]xfade=transition=fade:duration=0.18:offset=21.02[v];\
    [7:a]adelay=delays=6350:all=1,apad=pad_dur=24,atrim=duration=24,aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=7[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.2 \
  -pix_fmt yuv420p -r 30 -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 \
  -map_metadata -1 -t 24 "$OUTPUT_FILE"

echo "Vertical V3 MP4 built: $OUTPUT_FILE"
