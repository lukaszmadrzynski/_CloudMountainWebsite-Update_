"""
Generate the Cloud Mountain favicon set from public/images/shared/brand/cm-logo-color.png.

Outputs:
  public/favicon.ico            — multi-size .ico (16, 32, 48) for legacy browsers
  public/favicon-16x16.png      — modern browser tab
  public/favicon-32x32.png      — modern browser tab / shortcut
  public/apple-touch-icon.png   — iOS home screen (180x180)
  public/android-chrome-192x192.png — PWA / Android
  public/android-chrome-512x512.png — PWA / Android splash
  public/site.webmanifest       — PWA manifest (just the basics)
"""
from PIL import Image
import os, json, sys

ROOT = r"I:\3. Packaging\Website\_CloudMountainWebsite-Update_ LIVE VERSION"
PUBLIC = os.path.join(ROOT, "public")
SRC = r"I:\3. Packaging\Logos\Cloud Mountain Logo\_FINAL_\PNG\LOGO COLOR NO TEXT.png"

if not os.path.exists(SRC):
    print(f"FAIL: source not found: {SRC}")
    sys.exit(1)

src = Image.open(SRC).convert("RGBA")
print(f"source: {src.size} {src.mode}")

# Multi-size .ico
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_imgs = [src.resize(s, Image.LANCZOS) for s in ico_sizes]
ico_path = os.path.join(PUBLIC, "favicon.ico")
ico_imgs[0].save(ico_path, format="ICO", sizes=ico_sizes, append_images=ico_imgs[1:])
print(f"wrote {ico_path}  ({os.path.getsize(ico_path)} bytes)")

# 16x16 png
for size, name in [(16, "favicon-16x16.png"), (32, "favicon-32x32.png")]:
    p = os.path.join(PUBLIC, name)
    src.resize((size, size), Image.LANCZOS).save(p, "PNG", optimize=True)
    print(f"wrote {p}  ({os.path.getsize(p)} bytes)")

# Apple touch icon (180x180, no transparency — iOS adds black bg if alpha)
apple_src = src.convert("RGB")  # remove alpha so it doesn't get a black box
p = os.path.join(PUBLIC, "apple-touch-icon.png")
# Pad to 180x180 from 66x66
apple = Image.new("RGB", (180, 180), (255, 255, 255))
# Center the upscaled logo
upscaled = apple_src.resize((170, 170), Image.LANCZOS)
apple.paste(upscaled, (5, 5), upscaled.split()[3] if upscaled.mode == "RGBA" else None)
apple.save(p, "PNG", optimize=True)
print(f"wrote {p}  ({os.path.getsize(p)} bytes)")

# Android chrome (192 and 512)
for size, name in [(192, "android-chrome-192x192.png"), (512, "android-chrome-512x512.png")]:
    p = os.path.join(PUBLIC, name)
    src.resize((size, size), Image.LANCZOS).save(p, "PNG", optimize=True)
    print(f"wrote {p}  ({os.path.getsize(p)} bytes)")

# PWA manifest
manifest = {
    "name": "Cloud Mountain Ecotours",
    "short_name": "Cloud Mountain",
    "description": "Sustainable eco-tours in Lijiang and Shangri-La, Yunnan, China.",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#1f3a2e",
    "icons": [
        {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
    ],
}
mp = os.path.join(PUBLIC, "site.webmanifest")
with open(mp, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)
print(f"wrote {mp}")
