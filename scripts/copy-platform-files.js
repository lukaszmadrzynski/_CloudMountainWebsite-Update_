/**
 * Post-build helper: copies platform-specific files from public/ to out/
 * so Cloudflare Pages sees them in the deployed bundle.
 *
 * Why this is needed: Next.js with `output: 'export'` strips files starting
 * with `_` (like `_redirects` and `_headers`) from the build output, because
 * they are conventionally platform-config files handled by the host (Netlify,
 * Cloudflare Pages, etc.). But Cloudflare Pages only deploys what's in the
 * `out/` directory -- so without this copy step, _redirects and _headers are
 * silently dropped and never take effect.
 *
 * Run automatically via the `postbuild` npm script after `next build`.
 *
 * Implementation note: We deliberately avoid `fs.existsSync(TARGET_DIR)` because
 * on Windows, Next.js can hold file handles briefly after `next build` exits,
 * causing an EPERM on directory stats. We just attempt the copy directly and
 * catch ENOENT/EPERM per-file.
 */
const fs = require('fs');
const path = require('path');

const PLATFORM_FILES = ['_redirects', '_headers'];
const SOURCE_DIR = path.join(__dirname, '..', 'public');
const TARGET_DIR = path.join(__dirname, '..', 'out');

let copied = 0;
let skipped = 0;
for (const file of PLATFORM_FILES) {
    const src = path.join(SOURCE_DIR, file);
    const dst = path.join(TARGET_DIR, file);
    try {
        fs.copyFileSync(src, dst);
        console.log(`[copy-platform-files] Copied ${file} -> ${path.relative(process.cwd(), dst)}`);
        copied++;
    } catch (err) {
        if (err.code === 'ENOENT' && err.path && err.path.includes(src)) {
            console.warn(`[copy-platform-files] Source not found, skipped: ${src}`);
            skipped++;
        } else {
            console.warn(`[copy-platform-files] Could not copy ${file}: ${err.message}${err.code ? ' (' + err.code + ')' : ''}`);
            skipped++;
        }
    }
}

if (copied === 0) {
    console.warn(`[copy-platform-files] No platform files copied. If _redirects / _headers are missing from out/, redirects and security headers will not be active on the deployed site.`);
}
