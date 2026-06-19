/**
 * Build-time image dimensions manifest (Node.js version).
 *
 * Reads every .webp/.jpg/.jpeg/.png under public/images/* and emits a
 * JSON map of { "/path/to/file.ext": { "w": 1920, "h": 1080 }, ... }.
 *
 * This Node.js version is the primary (runs as the npm prebuild script);
 * the Python equivalent at scripts/generate-image-dims.py is kept as a
 * fallback. They produce the same output.
 *
 * Output: content/image-dims.json  (committed to git)
 *
 * Requires no dependencies — uses Node 18+ built-in fs/path and a
 * tiny WebP/JPEG/PNG header parser.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(REPO_ROOT, 'public', 'images');
const OUT_PATH = path.join(REPO_ROOT, 'content', 'image-dims.json');
const EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

/**
 * Parse width and height from common image headers (WebP/PNG/JPEG/GIF).
 * Returns null on failure or unsupported formats.
 */
function readDimsFromFile(filePath) {
    const buf = fs.readFileSync(filePath);
    if (buf.length < 24) return null;

    // WebP: RIFF header + WEBP signature + VP8 / VP8L / VP8X chunk
    if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
        const chunk = buf.toString('ascii', 12, 16);
        if (chunk === 'VP8 ') {
            // VP8 bitstream: width at offset 26 (LE 16-bit, mask 0x3FFF)
            const w = buf.readUInt16LE(26) & 0x3fff;
            const h = buf.readUInt16LE(28) & 0x3fff;
            return { w, h };
        }
        if (chunk === 'VP8L') {
            // VP8L: 14-bit width-1 at byte 21, 14-bit height-1 at byte 24
            const b21 = buf.readUInt8(21);
            const b22 = buf.readUInt8(22);
            const b23 = buf.readUInt8(23);
            const b24 = buf.readUInt8(24);
            const w = 1 + (((b22 & 0x3f) << 8) | b21);
            const h = 1 + (((b24 & 0x0f) << 10) | (b23 << 2) | ((b22 & 0xc0) >> 6));
            return { w, h };
        }
        if (chunk === 'VP8X') {
            // Extended: width-1 is 24-bit LE at offset 24, height-1 at offset 27
            const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
            const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
            return { w, h };
        }
        return null;
    }

    // PNG: signature 89 50 4E 47 + IHDR chunk (length 13, type IHDR, then width 4-byte BE, height 4-byte BE)
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
        buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) {
        const w = buf.readUInt32BE(16);
        const h = buf.readUInt32BE(20);
        return { w, h };
    }

    // JPEG: SOF0/SOF2 marker, then 4-byte length, then 1-byte precision, then height, width
    if (buf[0] === 0xff && buf[1] === 0xd8) {
        let off = 2;
        while (off < buf.length) {
            if (buf[off] !== 0xff) break;
            const marker = buf[off + 1];
            off += 2;
            if (marker === 0xd8 || marker === 0xd9) continue;
            const len = buf.readUInt16BE(off);
            if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
                // SOFn — at offset+3 (after length) is precision, then h, w
                const h = buf.readUInt16BE(off + 3);
                const w = buf.readUInt16BE(off + 5);
                return { w, h };
            }
            off += len;
        }
    }

    return null;
}

function walk(dir, out) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, out);
        } else if (EXTS.has(path.extname(entry.name).toLowerCase())) {
            const rel = '/' + path.relative(PUBLIC, full).replace(/\\/g, '/');
            try {
                const dims = readDimsFromFile(full);
                if (dims) {
                    out[rel] = dims;
                } else {
                    console.warn(`  SKIP ${rel}: could not parse dimensions`);
                }
            } catch (e) {
                console.warn(`  SKIP ${rel}: ${e.message}`);
            }
        }
    }
}

function main() {
    if (!fs.existsSync(PUBLIC)) {
        console.error(`Public dir not found: ${PUBLIC}`);
        process.exit(1);
    }
    const dims = {};
    walk(PUBLIC, dims);
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    const sorted = Object.fromEntries(Object.keys(dims).sort().map((k) => [k, dims[k]]));
    fs.writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
    console.log(`Wrote ${Object.keys(dims).length} entries to ${path.relative(REPO_ROOT, OUT_PATH)}`);
}

if (require.main === module) {
    main();
}

module.exports = { readDimsFromFile };