"""
Generate -sm (640w) and -md (1024w) WebP variants for hero images that
don't have them yet. Same approach as the original hero variant script
but only fills in the missing ones.

Run: python scripts/generate-missing-hero-variants.py
"""
import os
from pathlib import Path
from PIL import Image

REPO = Path(__file__).resolve().parent.parent
PUBLIC = REPO / "public" / "images"

# (relative_path, target_widths) — only emit variants for missing files
TARGETS = [
    ("pages/why-us/Why-Us-Hero.webp", (640, 1024)),
    ("pages/contact-us/Contact-Us-Hero.webp", (640, 1024)),
    ("pages/partner-with-us/Partner-With-Us-Hero.webp", (640, 1024)),
]

WEBP_QUALITY = 80


def generate(rel_path: str, widths: tuple) -> list[Path]:
    src = PUBLIC / rel_path
    if not src.exists():
        print(f"  SKIP {rel_path}: source not found")
        return []
    base, ext = src.stem, src.suffix  # ext == ".webp"
    out_paths: list[Path] = []
    with Image.open(src) as im:
        for w in widths:
            suffix = "-sm" if w == 640 else "-md" if w == 1024 else f"-{w}w"
            out = src.with_name(f"{base}{suffix}{ext}")
            if out.exists():
                print(f"  SKIP {out.name}: already exists")
                continue
            if im.width <= w:
                # Don't upscale — skip and log
                print(f"  SKIP {out.name}: source {im.width}px <= target {w}px (no upscale)")
                continue
            ratio = w / im.width
            h = round(im.height * ratio)
            resized = im.resize((w, h), Image.LANCZOS)
            resized.save(out, "WEBP", quality=WEBP_QUALITY, method=6)
            print(f"  WROTE {out.name} ({w}x{h}, {out.stat().st_size:,} bytes)")
            out_paths.append(out)
    return out_paths


def main():
    print(f"PUBLIC = {PUBLIC}")
    for rel, widths in TARGETS:
        print(f"\n{rel}:")
        generate(rel, widths)
    print("\nDone.")


if __name__ == "__main__":
    main()
