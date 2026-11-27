"""Contact sheet: composite text over picture, tile thumbnails with timecodes. usage: sheet.py dir out.jpg [cols] [width] [step]"""
import sys, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 5
tw = int(sys.argv[4]) if len(sys.argv) > 4 else 300
step = int(sys.argv[5]) if len(sys.argv) > 5 else 1
names = [n for n in sorted(f[:-4] for f in os.listdir(os.path.join(d, "base")) if f.endswith(".jpg")) if int(n[1:]) % step == 0]
th = tw * 16 // 9
rows = (len(names) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (tw + 6), rows * (th + 6)), (40, 40, 40))
for k, n in enumerate(names):
    im = Image.open(os.path.join(d, "base", n + ".jpg")).convert("RGBA")
    tp = os.path.join(d, "text", n + ".png")
    if os.path.exists(tp):
        im = Image.alpha_composite(im, Image.open(tp).convert("RGBA"))
    im = im.convert("RGB").resize((tw, th), Image.LANCZOS)
    ImageDraw.Draw(im).text((6, 6), f"{int(n[1:]) / 30:.1f}s", fill=(255, 80, 80))
    sheet.paste(im, ((k % cols) * (tw + 6), (k // cols) * (th + 6)))
sheet.save(out, quality=88)
