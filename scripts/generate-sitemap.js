/**
 * Pre-build helper: generates public/sitemap.xml from all .md files in
 * content/pages/. Cloudflare Pages deploys the contents of public/ as static
 * assets alongside the Next.js export, so writing here is enough -- no copy
 * step needed (next build automatically copies public/* into out/*).
 *
 * Run automatically via the `prebuild` npm script before `next build`.
 *
 * URL conventions (matches next.config.js `trailingSlash: true`):
 *   - Pages are referenced by their `slug:` frontmatter field
 *   - URL ends with a trailing slash
 *   - Drafts (`isDraft: true`) are excluded
 *
 * Priority / changefreq heuristics:
 *   - Home: 1.0, daily
 *   - Top-level pages (why-us, contact-us, partner-with-us, book, ecotours): 0.9, weekly
 *   - Tour pages: 0.8, monthly
 *   - Partner pages: 0.7, monthly
 *   - Blog index: 0.7, weekly
 *   - Blog posts: 0.6, monthly
 *   - Everything else: 0.5, monthly
 *
 * Lastmod: filesystem mtime of the .md file. Stable across machines since
 * it's the file's mtime, not git history (no git dependency at build time).
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const frontmatter = require('front-matter');

const SITE_URL = 'https://cloudmountain.top';
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'pages');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'sitemap.xml');

function priorityForUrl(url) {
    // url: e.g. "/", "/ecotours/", "/ecotours/lijiang-old-town-ecotour/",
    // "/partner/corporate/", "/blog/", "/blog/some-post/"
    if (url === '/') return { priority: 1.0, changefreq: 'daily' };

    const segments = url.replace(/^\/|\/$/g, '').split('/').filter(Boolean);

    if (segments.length === 0) return { priority: 1.0, changefreq: 'daily' };

    if (segments.length === 1) {
        const top = segments[0];
        if (['ecotours', 'why-us', 'contact-us', 'partner-with-us', 'book'].includes(top)) {
            return { priority: 0.9, changefreq: 'weekly' };
        }
        if (top === 'blog') return { priority: 0.7, changefreq: 'weekly' };
        if (top === 'partner') return { priority: 0.7, changefreq: 'monthly' };
        return { priority: 0.8, changefreq: 'monthly' };
    }

    if (segments[0] === 'ecotours') return { priority: 0.8, changefreq: 'monthly' };
    if (segments[0] === 'partner') return { priority: 0.7, changefreq: 'monthly' };
    if (segments[0] === 'blog') return { priority: 0.6, changefreq: 'monthly' };

    return { priority: 0.5, changefreq: 'monthly' };
}

function urlFromSlug(slug) {
    // slug is like "/why-us" or "/" or "/ecotours/lijiang-old-town-ecotour"
    if (!slug) return null;
    // Normalize to always have a leading and trailing slash
    let url = slug.trim();
    if (!url.startsWith('/')) url = '/' + url;
    if (url !== '/' && !url.endsWith('/')) url = url + '/';
    return url;
}

function isoDate(d) {
    return d.toISOString().slice(0, 10);
}

function buildSitemap() {
    const mdFiles = glob.sync('**/*.md', { cwd: CONTENT_DIR, absolute: true });

    const urls = [];
    const seen = new Set();

    for (const file of mdFiles) {
        const raw = fs.readFileSync(file, 'utf8');
        const fm = frontmatter(raw);
        const attrs = fm.attributes || {};

        if (attrs.isDraft === true) continue;

        const url = urlFromSlug(attrs.slug);
        if (!url) continue;
        if (seen.has(url)) continue;
        seen.add(url);

        const mtime = fs.statSync(file).mtime;
        const { priority, changefreq } = priorityForUrl(url);

        urls.push({
            loc: SITE_URL + url,
            lastmod: isoDate(mtime),
            changefreq,
            priority: priority.toFixed(1),
        });
    }

    // Stable order: home first, then alphabetical
    urls.sort((a, b) => {
        if (a.loc === SITE_URL + '/') return -1;
        if (b.loc === SITE_URL + '/') return 1;
        return a.loc.localeCompare(b.loc);
    });

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((u) =>
            [
                '  <url>',
                `    <loc>${u.loc}</loc>`,
                `    <lastmod>${u.lastmod}</lastmod>`,
                `    <changefreq>${u.changefreq}</changefreq>`,
                `    <priority>${u.priority}</priority>`,
                '  </url>',
            ].join('\n')
        ),
        '</urlset>',
        '',
    ].join('\n');

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
    console.log(`[generate-sitemap] Wrote ${urls.length} URLs to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

buildSitemap();
