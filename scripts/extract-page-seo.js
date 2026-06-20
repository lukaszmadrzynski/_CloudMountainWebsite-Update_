const fs = require('fs');
const path = require('path');
const glob = require('glob');
const frontmatter = require('front-matter');

const root = path.join(__dirname, '..');
const files = glob.sync('content/pages/**/*.md', { cwd: root }).sort();

const rows = [];
for (const f of files) {
    const raw = fs.readFileSync(path.join(root, f), 'utf8');
    const fm = frontmatter(raw);
    const a = fm.attributes || {};
    const slug = (a.slug || '').toString();
    const title = a.title || '';
    const seo = a.seo || {};
    const metaTitle = seo.metaTitle || '';
    const metaDescription = (seo.metaDescription || '').toString().replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    rows.push({ slug, title, metaTitle, metaDescription });
}

// Print as a tab-separated table for easy copy/paste
console.log('SLUG\tTITLE\tMETA_TITLE\tMETA_DESCRIPTION');
for (const r of rows) {
    console.log(`${r.slug}\t${r.title}\t${r.metaTitle}\t${r.metaDescription}`);
}

// Also write to JSON
fs.writeFileSync(path.join(__dirname, '..', 'scripts', 'page-seo.json'), JSON.stringify(rows, null, 2));
