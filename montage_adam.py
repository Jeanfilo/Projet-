#!/usr/bin/env python3
"""Montage 9:16 de l'épisode Adam : images 3D (dossier images/) + voix off.

Usage : python3 montage_adam.py VOIX.mp3 [--apercu]
Sortie : Adam_episode.mp4 (1080x1920, H.264/AAC), travelling lent sur chaque image,
fondus enchaînés. Les temps ci-dessous suivent la transcription de la voix off.
"""
import subprocess, sys, os, json

FPS, T = 30, 0.7  # fréquence, durée du fondu enchaîné
# (image, début, fin) en secondes, calé sur la voix off
PLANS = [
    ("1A", 0.0, 8.0),     # "Avant l'apparition de l'humanité..."
    ("1B", 8.0, 22.0),    # Allah annonce aux anges
    ("2A", 22.0, 27.0),   # Allah enseigna à Adam les noms
    ("2B", 27.0, 31.0),   # la connaissance
    ("3A", 31.0, 46.0),   # refus d'Iblis
    ("4A", 46.0, 53.0),   # le jardin, l'interdiction
    ("4B", 53.0, 56.0),   # Iblis les tenta
    ("5A", 56.0, 60.0),   # la tentation prend plusieurs formes
    ("5B", 60.0, 63.0),   # silence, prise de conscience
    ("6A", 63.0, 70.0),   # Adam se repentit
    ("6B", 70.0, 76.0),   # Allah accepta son repentir
    ("7A", 76.0, 82.0),   # établis sur terre
    ("7B", 82.0, 95.0),   # leçon : ne jamais désespérer
    ("8C", 95.0, 103.0),  # verset 39:53 (récitation) : l'immensité de la miséricorde
    ("8B", 103.0, 110.0), # le renouveau
    ("6A", 110.0, 116.0), # traduction : "ne désespérez pas"
    ("7A", 116.0, 123.0), # "Allah pardonne tous les péchés"
    ("8A", 123.0, None),  # "la porte du repentir est immense"
]


def dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "json", path], capture_output=True, text=True, check=True).stdout
    return float(json.loads(out)["format"]["duration"])


def main():
    voix = sys.argv[1]
    apercu = "--apercu" in sys.argv
    W, H = (540, 960) if apercu else (1080, 1920)
    here = os.path.dirname(os.path.abspath(__file__))
    total = dur(voix) + 0.3
    plans = [(i, s, e if e is not None else total) for i, s, e in PLANS]

    inputs, graph = [], []
    for k, (img, s, e) in enumerate(plans):
        L = (e - s) + T
        n = int(round(L * FPS))
        inputs += ["-i", os.path.join(here, "images", img + ".jpg")]
        # travelling lent, alterné entrée / sortie, léger décalage pour la vie
        if k % 2 == 0:
            z, x, y = f"1+0.10*on/{n}", "iw/2-iw/zoom/2", "ih/2-ih/zoom/2"
        else:
            z, x, y = f"1.10-0.10*on/{n}", "iw/2-iw/zoom/2", "ih/2-ih/zoom/2"
        graph.append(f"[{k}:v]scale={W * 3 // 2}:{H * 3 // 2}:flags=lanczos,"
                     f"zoompan=z='{z}':x='{x}':y='{y}':d={n}:s={W}x{H}:fps={FPS},"
                     f"setsar=1,format=yuv420p[v{k}]")
    prev = "v0"
    for j in range(len(plans) - 1):
        off = plans[j][2] - T / 2
        graph.append(f"[{prev}][v{j + 1}]xfade=transition=fade:duration={T}:offset={off:.3f}[x{j}]")
        prev = f"x{j}"
    graph.append(f"[{prev}]fade=t=in:d=1,fade=t=out:st={total - 1.5:.2f}:d=1.5,format=yuv420p[vout]")
    graph.append(f"[{len(plans)}:a]aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11,"
                 f"apad=pad_dur=2,atrim=duration={total:.3f}[aout]")

    script = os.path.join(here, ".filtre.txt")
    with open(script, "w") as f:
        f.write(";\n".join(graph))
    out = os.path.join(here, "Adam_episode_apercu.mp4" if apercu else "Adam_episode.mp4")
    enc = ["-preset", "veryfast", "-crf", "26"] if apercu else ["-preset", "medium", "-crf", "18"]
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-stats"] + inputs + ["-i", voix,
                    "-filter_complex_script", script, "-map", "[vout]", "-map", "[aout]",
                    "-c:v", "libx264"] + enc + ["-pix_fmt", "yuv420p", "-r", str(FPS),
                    "-c:a", "aac", "-b:a", "192k", "-t", f"{total:.3f}",
                    "-movflags", "+faststart", out], check=True)
    os.remove(script)
    print("OK", out, f"{total:.1f}s {W}x{H}")


if __name__ == "__main__":
    main()
