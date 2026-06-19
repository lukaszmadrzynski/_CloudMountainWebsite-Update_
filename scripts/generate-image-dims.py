"""
Build-time image dimensions manifest.

Reads every .webp/.jpg/.jpeg/.png under public/images/* and emits a
JSON map of { "/path/to/file.ext": { "w": 1920, "h": 1080 }, ... }.
Used by the HeroSection / HomepageHeroSection / EcotoursHeroSection
to set correct width/height on <img> tags so the browser reserves
the right amount of space (CLS=0) regardless of the actual image
aspect ratio. Without this, we'd either hardcode width/height
(breaks for any non-matching aspect) or skip them entirely
(which is what causes the CLS hits we see in the Lighthouse report).

Output: content/image-dims.json  (committed to git so it's
available without re-running the script)

Usage:
  node scripts/generate-image-dims.js
  # or auto-run via npm prebuild
"""
import json
import os
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(r"I:\3. Packaging\Website\_CloudMountainWebsite-Update_ LIVE VERSION")
PUBLIC = REPO_ROOT / "public" / "images"
OUT_PATH = REPO_ROOT / "content" / "image-dims.json"

EXTS = {".webp", ".jpg", ".jpeg", ".png"}


def human(n: int) -> str:
    if n >= 1024 * 1024:
        return f"{n / 1024 / 1024:.2f} MB"
    return f"{n / 1024:.1f} KB"


def main() -> None:
    dims = {}
    skipped = 0
    for path in PUBLIC.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in EXTS:
            continue
        # Convert to URL-style path: /images/foo/bar.webp
        rel = path.relative_to(PUBLIC.parent).as_posix()
        try:
            with Image.open(path) as im:
                w, h = im.width, im.height
        except Exception as e:
            skipped += 1
            print(f"  SKIP {rel}: {e}")
            continue
        dims[f"/{rel}"] = {"w": w, "h": h}

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(dims, indent=2, sort_keys=True), encoding="utf-8")

    print(f"Wrote {len(dims)} entries to {OUT_PATH.relative_to(REPO_ROOT)}")
    print(f"Skipped: {skipped} (corrupt/unsupported)")
    # Show a sample of hero-sized images for sanity check
    print("\nSample entries:")
    for k in sorted(dims.keys()):
        if any(s in k for s in ("banner", "hero", "HERO")):
            print(f"  {k}: {dims[k]}")


if __name__ == "__main__":
    main()