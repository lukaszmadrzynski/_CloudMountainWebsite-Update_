const fs = require('fs');
const path = require('path');
const glob = require('glob');
const frontmatter = require('front-matter');

const root = path.join(__dirname, '..');
const files = glob.sync('content/pages/**/*.md', { cwd: root }).sort();

console.log('SLUG'.padEnd(48) + '| og:description (from metaTags)');
console.log('-'.repeat(160));
for (const f of files) {
    const raw = fs.readFileSync(path.join(root, f), 'utf8');
    const fm = frontmatter(raw);
    const a = fm.attributes || {};
    const slug = (a.slug || '').toString();
    const tags = a.seo?.metaTags || [];
    const ogDesc = tags.find(t => t.property === 'og:description');
    const val = ogDesc ? ogDesc.content.toString().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : '(none — falls back to nothing)';
    console.log(slug.padEnd(48) + '| ' + val);
}
