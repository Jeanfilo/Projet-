"""Depth map for 2.5D parallax (Depth Anything V2 small, ONNX, CPU).
usage: python3 -I depth.py model.onnx in.png out_depth.png
Writes an RGB PNG at 540x960: R = high byte, G = low byte of 16-bit disparity (1 = near, 0 = far).
"""
import sys
import numpy as np
import onnxruntime as ort
from PIL import Image

model, src, dst = sys.argv[1:4]
img = Image.open(src).convert("RGB")
W, H = 518, 924  # multiples of 14, ~9:16
x = np.asarray(img.resize((W, H), Image.BICUBIC), dtype=np.float32) / 255.0
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
d = sess.run(None, {sess.get_inputs()[0].name: x})[0].squeeze()
d = (d - d.min()) / (d.max() - d.min() + 1e-6)
# soften edges so the displaced mesh stretches smoothly instead of tearing at depth jumps
d = np.asarray(Image.fromarray(d.astype(np.float32), mode="F").resize((540, 960), Image.BICUBIC))
k = np.exp(-0.5 * (np.arange(-9, 10) / 3.0) ** 2); k /= k.sum()  # separable gaussian, sigma 3 px
d = np.pad(d, 9, mode="edge")
d = np.apply_along_axis(lambda r: np.convolve(r, k, "valid"), 1, d)
d = np.apply_along_axis(lambda c: np.convolve(c, k, "valid"), 0, d)
d = np.clip(d, 0, 1)
v = (d * 65535).astype(np.uint16)
rgb = np.stack([v >> 8, v & 255, np.zeros_like(v)], -1).astype(np.uint8)
Image.fromarray(rgb, "RGB").save(dst)
assert rgb.shape == (960, 540, 3)
print(dst, "near-ratio", round(float((d > 0.5).mean()), 3))
