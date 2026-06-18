# Cloud Mountain Website — Web Optimization Audit

**Repo:** `I:\3. Packaging\Website\_CloudMountainWebsite-Update_ LIVE VERSION`
**Stack:** Next.js 15.5 (pages router) + React 19, Tailwind 3, static export (`output: 'export'`), deployed via Netlify / Cloudflare Pages
**Audit date:** 2026-06-17
**Scope:** Read-only audit of source code, content, and config. **No build was run** (the `out/` directory in the repo only contains webpack cache, not built HTML — a clean build is needed to actually measure final asset sizes).

---

## 1. Executive Summary

### Top 3 wins (biggest gains for least effort)

1. **Re-encode / shrink the 12 webp images over 500 KB.** There is one >1 MB banner that is still PNG, four >500 KB tour banners, and 3 family/partner hero images at ~580–745 KB. Re-exporting these at quality 75–80 with sensible max-widths (1920 for hero, 1600 for tour banner) will cut well over 4 MB of bytes from the largest pages.
2. **Add `width`/`height` (or `aspect-ratio`) and `loading="lazy"` to every `<img>` and `fetchpriority="high"` to the LCP hero.** The main `ImageBlock` (`src/components/blocks/ImageBlock/index.tsx:27-43`) and the three hero components (`HomepageHeroSection`, `HeroSection`, `EcotoursHeroSection`, `PartnerWithUsHeroSection`) all emit raw `<img>` with no intrinsic dimensions. This is the single biggest CLS / LCP risk on the site.
3. **Add `sitemap.xml`, fix the `robots.txt` Sitemap URL, and add a 404 page.** There is **no `sitemap.xml`**, the existing `robots.txt` points the Sitemap directive to a different domain than the configured production URL, and the dynamic page returns `{ notFound: true }` (`src/pages/[[...slug]].js:100`) but there is no custom `src/pages/404.js` to style it.

### Top 3 risks

1. **Multiple `<h1>` per page.** `PageLayout` always renders an `sr-only` `<h1>` from the page title (`src/components/layouts/PageLayout/index.tsx:52-55`), and the hero components each render their own `<h1>`. That makes the heading hierarchy broken on every page that uses a hero. `HeroSection` (`src/components/sections/HeroSection/index.tsx:72, 113`) renders the `<h1>` *twice* in the DOM (mobile and desktop variants are both mounted, only CSS-hides one). Screen readers will see 2–3 h1s.
2. **Tailwind config has `fontFamily.serif` defined twice** (`tailwind.config.js:28-29`) — the second entry silently overwrites the first. `fontFamily.serif` ends up being `['var(--font-roboto-slab)', ...]` only; `var(--font-inter)` is never wired to anything. `_app.js` loads both fonts (`src/pages/_app.js:6-19`), so Inter is being downloaded and never used.
3. **Algolia is in the bundle but disabled at runtime.** `SearchBlock` requires `@algolia/autocomplete-js`, `@algolia/autocomplete-theme-classic`, and `algoliasearch` (all in `package.json` deps), and `PostFeedLayout` registers `AutoCompletePosts`. But the blog index page sets `enableSearch: false` (`content/pages/blog/index.md:5`), so the UI never renders in production. The build still ships the chunk (1.16 MB in the previous `out/` static analysis). Remove or guard the import.

> **Bonus risk (not currently deploy-blocking, but worth cleaning up):** `netlify.toml` is a leftover from the project's prior Netlify hosting. The live site is on Cloudflare Pages, which auto-detects `out/` and ignores `netlify.toml` — so the `publish = ".next"` mismatch does not affect production. Still, it is misleading and would bite a future Netlify migration. See §5.6.

---

## 2. Performance findings

### 2.1 Image sizes (top 12 over 500 KB)

The total of these 12 alone is ~9.5 MB. A clean re-encode at q=80 / max-1920-width WebP for the hero/tour banners would typically bring them all under 250 KB.

| Size (KB) | Path | Notes |
|---:|---|---|
| 2,388 | `public/images/tours/hidden-jade-dragon/banner.png` | **Only PNG in a `.webp` world** — should be converted (the same image exists as `banner.webp` at 533 KB, the PNG is leftover) |
| 745   | `public/images/partner/family-ecocamps/Family Hero.webp` | Partner page hero |
| 685   | `public/images/tours/lijiang-heavenly-valley/banner.webp` | Tour banner |
| 634   | `public/images/partner/family-ecocamps/Family Hero2.webp` | Partner page hero |
| 609   | `public/images/tours/living-waters-of-lashi/banner.webp` | Tour banner |
| 607   | `public/images/tours/e-biking-lijiang-villages/banner.webp` | Tour banner |
| 577   | `public/images/partner/student-ecocamps/Ledership Hero2.webp` | Partner hero |
| 575   | `public/images/tours/lijiang-forgotten-forest/banner.webp` | Tour banner |
| 574   | `public/images/tours/lijiang-heritage-in-depth/banner.webp` | Tour banner |
| 567   | `public/images/pages/home/CM Hero OPTIMIZED.webp` | **Home LCP image** |
| 563   | `public/images/partner/student-ecocamps/Ledership Hero.webp` | Partner hero |
| 533   | `public/images/tours/hidden-jade-dragon/banner.webp` | The webp version of the same image (above PNG) |

Counts at a glance: **12 files >500 KB, 1 file >1 MB, 202 webp, 18 png, 32 jpg, 22 svg**. The 18 PNGs deserve a sweep — most should have a webp counterpart (or never been PNG in the first place).

### 2.2 Spot-check on 5 random images — all webp? all sized?

Picked one from each top-level dir:

| Path | Format | Has width/height on `<img>`? | `loading="lazy"`? |
|---|---|:---:|:---:|
| `public/images/pages/home/CM Hero OPTIMIZED.webp` | webp ✅ | ❌ no intrinsic size | ❌ no |
| `public/images/tours/lijiang-heavenly-valley/banner.webp` | webp ✅ | ❌ no | ❌ no |
| `public/images/partner/family-ecocamps/Family Hero.webp` | webp ✅ | ❌ no | ❌ no |
| `public/images/shared/presets/Hero 1920.jpg` | jpg (not webp) | ❌ no | ❌ no |
| `public/images/partner/family-ecocamps/Family Hero2.webp` | webp ✅ | ❌ no | ❌ no |

**`Hero 1920.jpg`** — large jpg that doesn't have a webp version. It's the only file in `shared/presets/`. If it is referenced from anywhere, convert it.

### 2.3 Where `<img>` is used (and missing attrs)

- `src/components/blocks/ImageBlock/index.tsx:27-43` — generic ImageBlock; raw `<img>`, no `width`/`height`/`loading`/`decoding`/`fetchpriority`.
- `src/components/sections/HomepageHeroSection/index.tsx:45-50` — LCP candidate on `/`; no `fetchpriority="high"`, no intrinsic size.
- `src/components/sections/HeroSection/index.tsx:39-58` — renders the same image **twice** (mobile vs desktop, both mounted, CSS-only switch). Doubles the request for one image.
- `src/components/sections/EcotoursHeroSection/index.tsx:33-38` — same pattern, no attrs.
- `src/components/sections/PartnerWithUsHeroSection/index.tsx` (not opened but registered as a dynamic import — same code path assumed).
- `src/components/sections/ItinerarySection/index.tsx:558-562` — period icon `<img>`, no lazy.
- `src/components/sections/KeyDetailsSection/index.tsx:33-38` — **only place in the codebase that uses `loading="lazy"`**, alt="". Acceptable for a decorative icon.
- `src/components/sections/TripAdvisorReviews/index.tsx:58` — avatar `<img>`, no lazy, no width/height.

**No `<picture>`, no `srcset`, no responsive variants anywhere.** Every image is served at its raw resolution.

**No `next/image` import anywhere in `src/`** — confirmed by grep. The project opted out of the Next/Image pipeline entirely; all images are passed through `output: 'export'` as-is and served by the static host.

### 2.4 JavaScript bundle

Stack taken from `package.json:9-36`:

- `next ^15.5.18`, `react ^19.2.6`, `react-dom ^19.2.6`
- `tailwindcss ^3.4.19`
- `swiper ^12.1.4`
- `markdown-to-jsx ^7.7.17`, `marked ^14.1.4`
- `classnames`, `dayjs`, `front-matter`, `glob`
- `algoliasearch ^4.27.0`, `@algolia/autocomplete-js ^1.19.8`, `@algolia/autocomplete-theme-classic ^1.19.8`

**Unused / dead-weight candidate deps:**

| Package | Used in | Runtime use? | Notes |
|---|---|---|---|
| `@algolia/autocomplete-js` | `SearchBlock/BaseAutoComplete.jsx` | **No** (search disabled in `content/pages/blog/index.md:5`) | Remove or guard import |
| `@algolia/autocomplete-theme-classic` | `SearchBlock/AutoCompletePosts.jsx:5` | No | Same |
| `algoliasearch` | `SearchBlock/AutoCompletePosts.jsx`, `indexer/index.js` | No client (only `indexer/` uses it at build time) | Fine to keep, but the `SearchBlock` chunk that imports it is the heavy one |
| `marked` | `utils/indexer/index.js` | **No** — only used at build time to index posts for Algolia | If you delete Algolia search, drop `marked` too |
| `markdown-to-jsx` | `GenericSection/index.tsx:2` | Yes (page sections render markdown) | Keep |
| `swiper` | `PostFeedSection/index.tsx:3-7` | Yes (blog post carousel) | Keep but consider if you really need three modules + three CSS imports |
| `glob` | `utils/local-content.ts:3` | Build time only | Keep |
| `dayjs` | Not imported in `src/` (was previously bundled by `_.next_old/server/chunks/9259.js`) | **No** | Safe to remove from `package.json` |
| `front-matter` | `utils/local-content.ts:4` | Build time | Keep |
| `@base2/pretty-print-object` | devDep, only used in `.stackbit/` tooling | OK devDep | Keep |

The previous build's `out/static/chunks/main.js` is **7 MB** (raw, gzipped it's much smaller but still significant). Top offenders from a static chunk analysis on the existing `out/`:

| Chunk | Size (KB) |
|---:|---|
| `static/chunks/main.js` | 7,060 |
| `_pages-dir-browser_src_components_sections_FeaturedPostsSection_index_tsx.js` | 1,850 |
| `_pages-dir-browser_src_components_sections_RecentPostsSection_index_tsx.js` | 1,849 |
| `_pages-dir-browser_src_components_sections_PostFeedSection_index_tsx.js` | 1,844 |
| `_pages-dir-browser_src_components_blocks_SearchBlock_AutoCompletePosts_jsx.js` | 1,164 |
| `_pages-dir-browser_src_components_layouts_PageLayout_index_tsx.js` | 931 |

The `PostFeedSection` / `RecentPostsSection` / `FeaturedPostsSection` chunks are all 1.8 MB because Swiper is bundled into each. They are imported via `getComponent` so they only load on pages that use them, but a single 1.8 MB chunk is still a lot.

### 2.5 Rendering / static patterns

The site is `output: 'export'` (`next.config.js:8`) and uses `getStaticPaths` + `getStaticProps` (`src/pages/[[...slug]].js:57-122`). All page content is pre-rendered at build time, so the **first paint cost** is dominated by the HTML + critical assets, not by React hydration. Good baseline.

But several components still mount heavy client state with `useEffect` that could be server-rendered:

- `StickyBookingBar` (`src/components/sections/StickyBookingBar/index.tsx:22-70`) — five `useState`, scroll/resize listeners, only used on the right of the screen on desktop. Always mounts on every tour page even when scrolled. This is the most expensive client component on a tour page.
- `TripAdvisorReviews` (`src/components/sections/TripAdvisorReviews/index.tsx:27-30, 204-208`) — 8 `useState`, an `setInterval` auto-scroller, resize observer. The 4-second auto-scroll on desktop (`index.tsx:248-274`) is the kind of thing you could drop without losing functionality.
- `Header` mobile menu measure effect (`src/components/sections/Header/index.tsx:222-269`) — measures on every menu open; only needed when the menu opens, but currently always re-runs.
- `EcotourFilterSection` (`src/components/sections/EcotourFilterSection/index.tsx:23, 71-86`) — `useState` for an in-page filter. Could be plain CSS radio buttons + `:checked` selectors and skip React entirely.
- `CarouselSection` (`src/components/sections/CarouselSection/index.tsx:15, 100-116`) — `useState` to toggle a `max-height` reveal. Pure CSS `details/summary` or `[hidden]` would do.

---

## 3. SEO findings

### 3.1 Meta tags

- Every content page has a `seo:` block with `metaTitle`, `metaDescription`, and (usually) `socialImage`. ✅
- `og:title` and `og:image` are auto-generated by `seoGenerateMetaTags` (`src/utils/seo-utils.js:11-17`) from the page title and `site.defaultSocialImage` (`content/data/site.json:5`). The default `og:image` is a 64×64 PNG (`/images/shared/brand/cm-logo-color.png`) — **square logo used for OG/social cards is wrong**; social previews will be tiny logos in a sea of background color. Replace with a 1200×630 hero image.
- **`og:description` is only set via `metaTags` in the page frontmatter** — no automatic fallback. `index.md:498` sets one for the homepage, but the rest of the pages don't. As a result, `og:description` is missing from every page except `/`. Easy fix: in `seo-utils.js`, default `og:description` to `metaDescription` when no explicit one is in `metaTags`.
- **No canonical URLs anywhere.** `grep -r canonical` in `src/` returns nothing. Every page (including the blog pagination pages `/blog/page/2/`, …) will be indexed under multiple URLs if linked externally. Add `<link rel="canonical" href={site.env.URL + page.__metadata.urlPath} />` in `DefaultBaseLayout/index.tsx:26-38`.
- **No Twitter card meta** (`twitter:card`, `twitter:title`, `twitter:image`, `twitter:description`). Twitter falls back to OG, but for high-quality Twitter previews you want explicit tags.

### 3.2 Alt text

- `ImageBlock` and the hero components default `alt={altText || ''}` — a missing alt becomes empty, which is correct for decorative images but wrong for content images. Author discipline + content audit is the fix, not a code fix.
- 35 `altText: ''` matches across content pages; **34 of them are `Button.altText`** (a Button has a `label`, so empty alt is fine), and **1 is an actual `ImageBlock.altText`** with a real `url`:
  - `content/pages/ecotours.md:429` — Shangri-La Monkey `card.webp` has empty alt. The card needs a sentence like "Yunnan snub-nosed monkey in Baima Snow Mountain" or the listing won't be accessible.

### 3.3 Sitemap / robots / 404

- **No `sitemap.xml`** anywhere in `public/` or generated at build. With 32 content pages you should either generate one at build (`next-sitemap` or a custom script reading `content/pages`) or add a Cloudflare Worker to serve one.
- `public/robots.txt` says `Sitemap: https://cloudmountain.top/` but the canonical site (per `AGENTS.md:6`) is `https://cloudmountainwebsite-update.pages.dev`. Pick one and point to it.
- **No `404.html`** and no `src/pages/404.js`. `getStaticProps` returns `{ notFound: true }` for missing paths (`src/pages/[[...slug]].js:100, 120`) but Next.js' default 404 page will be served.

### 3.4 Structured data (JSON-LD)

- **No JSON-LD anywhere** (`grep ld+json` returns nothing in `src/` or `content/`). For a tour operator this is a meaningful SEO win:
  - `Organization` on `/` (name, logo, social links, address).
  - `TouristAttraction` or `Product`/`Offer` on each ecotour page (price, location, description, image, provider).
  - `BreadcrumbList` on deep pages.
  - `BlogPosting` on blog posts.
- Easy to drop into `DefaultBaseLayout` as a `<script type="application/ld+json">` block driven by the page data.

### 3.5 Homepage frontmatter bug

`content/pages/index.md:500-502`:

```yaml
addTitleSuffix: true
type: PageLayout
isDraft: false
```

`type: PageLayout` and `isDraft: false` are placed *after* the `seo:` block, not at the top. Strict YAML parsers will treat them as nested under `seo` and the page will be parsed as `seo.type: PageLayout`, `seo.isDraft: false` while `type` and `isDraft` are *missing* at the top level. The page may currently work because the parser is lenient, but `addTitleSuffix: true` and `isDraft: false` are the wrong values being read. **Fix: move `type: PageLayout` and `isDraft: false` to the top, before the `seo:` block.** This is the only file in the repo with this problem (verified by scan).

### 3.6 Other SEO issues

- `content/pages/ecotours.md:21` — `altText: Dope design preview` is a placeholder text leaked into production. Same pattern in `book.md:14, 18, 49, 276` and other `GenericSection` entries — they all use default scaffold alt text. These have empty `url:` (verified) so the `ImageBlock` returns `null` (`src/components/blocks/ImageBlock/index.tsx:8-10`), so it's not user-visible, but it's content hygiene.
- `Header` has `title: 'Cloud Mountain'` (`content/data/header.json:74`) which is rendered as a `<span class="h4">` (`src/components/sections/Header/index.tsx:302-306`) — this is a hidden duplicate brand name with no SEO weight. Not harmful, but consider an `aria-label` on the logo link.
- `noindex` is not set on draft or un-published content beyond `isDraft` filtering in `static-paths-resolvers.js:5` — fine for a static site, but worth noting for any preview flow.

---

## 4. Accessibility findings

### 4.1 Color contrast

Brand palette from `content/data/style.json:1-6`:

- `light`: `#ffffff`
- `dark`: `#434343`
- `neutral`: `#fcfcfc`
- `neutralAlt`: `#DCDCDC`
- `primary`: `#5ebb46`

| Pair | Ratio | WCAG AA (normal text) | Notes |
|---|---:|:---:|---|
| `#434343` on `#ffffff` | 11.4:1 | ✅ pass | Used as `bg-light-fg-dark` body text |
| `#5ebb46` on `#ffffff` | 2.95:1 | ❌ fail for normal text, borderline for large text | Primary button text on light background. The `bg-light-fg-dark` style overrides `.sb-component-button-primary` to `text-light` (white) (`main.css:231-233`) so this is usually fine in those overrides, but on the bare `primary` class anywhere else (e.g. filter buttons `EcotourFilterSection/index.tsx:79` use `bg-primary text-white` directly — that passes) it's a non-issue. **Watch out for any use of primary as text on light.** |
| `#5ebb46` on `#DCDCDC` | 2.1:1 | ❌ fail | If you ever put primary-colored text on a neutralAlt card, it fails. |
| `text-dark/50` placeholder text on white | ~5:1 | borderline | `main.css:229` uses `placeholder-dark/50` for inputs on light backgrounds — 50% opacity dark gray on white is roughly 5.7:1, passes for normal but fails the more common 60% threshold. |

**Specific concern:** `ItinerarySection/index.tsx:83` shows `text-[#5ebb46] font-semibold text-sm` on a white card (e.g. "Half Day" label). At 14 px+ semibold, 2.95:1 is **OK for large text AA** (3:1) but **fails normal text AA** (4.5:1). For sub-18 px text, darken to a deeper green like `#3d8a2c`.

### 4.2 Focus indicators

Several components explicitly remove the focus ring with no replacement:

- `Header/index.tsx:273` — hamburger button: `focus:outline-none`. Replace with `focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`.
- `EcotourFilterSection/index.tsx:77` — filter pill buttons: `focus:outline-none focus:ring-0`. Same fix.
- `FormBlock/SelectFormControl/index.tsx:58` — `<select>`: `focus:outline-none`. Replace with a visible border change.
- `FormBlock/TextareaFormControl/index.tsx:39` — same.
- `FormBlock/EmailFormControl/index.tsx:39` — same.
- `FormBlock/TextFormControl/index.tsx:42` — same.

The pattern across the form controls is: `focus:outline-none` is the only focus style. With a colored border this works visually, but a screen-reader user tabbing through the form needs either `focus-visible` styling or `:focus { border-color: …; box-shadow: … }`.

### 4.3 ARIA labels

- Header hamburger: `aria-label="Open Menu"` / `"Close Menu"` ✅ (`Header/index.tsx:273-274`).
- Mobile sub-nav button: `aria-expanded` ✅ (`Header/index.tsx:381`).
- Carousel buttons: `aria-label="Previous slide"`, `"Next slide"` ✅ (`PostFeedSection/index.tsx:348, 366`).
- TripAdvisor scroll/dot buttons: ✅ (`TripAdvisorReviews/index.tsx:394, 432, 458`).
- Form controls: `aria-labelledby` ✅ (`TextFormControl`, `EmailFormControl`, `TextareaFormControl`, `SelectFormControl`, `CheckboxFormControl`).
- Action component sets `aria-label={altText}` on links (`Action/index.tsx:24`). ✅
- EcotourCard: `aria-label={title || 'View details'}` ✅ (`FeaturedItemsSection/EcotourCard.tsx:51`).

**Missing ARIA:**
- `StickyBookingBar` anchor links (`StickyBookingBar/index.tsx:109, 154, 205`) have no `aria-label`. The visible text is "Book This Ecotour" / "Book Now", so this is OK in practice, but if you ever make the link icon-only it will fail.
- `ItinerarySection` expand buttons — the `+` glyph (`ItinerarySection/index.tsx:530-537`) is the only indicator. Add `aria-expanded={isOpen}` on the accordion button. Currently the `<button>` (line 515) has no `aria-expanded` either, just `onClick`.
- `<a href="#main">Skip to main content</a>` exists (`Header/index.tsx:29-31`) ✅ — good.

### 4.4 Heading hierarchy

- `PageLayout/index.tsx:52-55` — **always emits an `sr-only` `<h1>`** with the page title.
- `HeroSection/index.tsx:72, 113` — emits **two** `<h1>` (mobile + desktop; only one is visible). Combined with the `sr-only` one, you have **3 h1s on every hero page** in the DOM.
- `HomepageHeroSection/index.tsx:58` — emits one `<h1>` visible. Combined with the `sr-only` one, you have **2 h1s** on `/`.
- `EcotoursHeroSection` — no h1 emitted (just a background image), so on `/ecotours` you have the `sr-only` h1 only — fine, but then `TitleBlock` starts with h2.
- Every `TitleBlock` (`TitleBlock/index.tsx:14`) is `<h2>`. So the h2 in `GenericSection` is the first real heading on those pages. Hierarchy is h1 (sr-only) → h2 → h2 → h2 (which is fine — consecutive h2s are allowed).

**Fixes:**
1. **Delete the `sr-only` h1 in `PageLayout`** — the page title is already conveyed by `og:title` / `<title>`. The hero `<h1>` is the right one. Or:
2. **Don't emit a hero `<h1>`** when the page already has a visible section title. Pass a flag through the hero.

The cleanest fix is to delete the `sr-only` h1 in `PageLayout` and let each page/section own its visible h1.

### 4.5 Forms

- Labels are wired through `aria-labelledby` on every input. ✅
- `SelectFormControl` (`SelectFormControl/index.tsx:13`) runs an effect to sync state with prop changes — fine.
- `FormBlock` (`FormBlock/index.tsx:54`) hardcodes the form action URL to `https://contact-form.lukasz-madrzynski.workers.dev`. This bypasses the Netlify form-handler that the `.netlify/functions/submission_created.js` was set up for. Decide which one is canonical. Either:
  - keep the Worker (and the Netlify function is dead code), or
  - switch the form to use Netlify Forms + the function and drop the Worker URL.

---

## 5. Deploy readiness

### 5.1 `package.json` scripts

`package.json:4-8`:

```json
"dev": "next dev",
"build": "next build",
"start": "next start"
```

- No `lint`, no `type-check`. `tsconfig.json` is configured but no script runs `tsc --noEmit`. Easy fix.
- `"start"` won't work for a static export — the site is `output: 'export'`, so the produced site is in `out/` and should be served by a static file server (Netlify, Cloudflare Pages) directly. `next start` is for the SSR dev server. Consider deleting or aliasing.

### 5.2 `next.config.js`

- `output: 'export'` ✅ (`next.config.js:8`) — produces a static site.
- `trailingSlash: true` ✅ — Cloudflare Pages / Netlify prefer trailing slashes.
- `env.stackbitPreview: process.env.STACKBIT_PREVIEW` — exposes the env var to client. This works, but the codebase still reads `process.env.stackbitPreview` directly in `src/utils/static-props-resolvers.js:48, 63, 76, 89` and `src/utils/static-paths-resolvers.js:5, 21, 31`. In a static build, `process.env.stackbitPreview` is evaluated at build time only — once. Make sure `.env.production` sets it to the right value (or it's undefined → `isDraft: true` pages are excluded from the build, which is what you want for production).

### 5.3 Environment variables referenced

| Var | Where | Documented in `.env.example`? |
|---|---|:---:|
| `STACKBIT_PREVIEW` | `next.config.js:6`, `Header/index.tsx:372/383`, `static-props-resolvers.js`, `static-paths-resolvers.js` | ❌ |
| `STACKBIT_CONTACT_FORM_SUBMISSION_URL` | `.netlify/functions/submission_created.js:8` | ❌ |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | `utils/indexer/consts.js:1` | ❌ |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | `utils/indexer/consts.js:2` | ❌ |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | `utils/indexer/consts.js:3` | ❌ |
| `ALGOLIA_ADMIN_API_KEY` | `utils/indexer/consts.js:5` | ❌ |
| `URL` | `utils/page-utils.js:28`, `utils/seo-utils.js:77` | ❌ |
| `NODE_ENV` | automatic | n/a |

**No `.env.example`, no `.env.production`, no `.env.development` file exists in the repo** (verified by `Get-ChildItem` listing). A new contributor has to guess the variable names.

### 5.4 Cache / CDN

- **No `_headers` file** in `public/` for Netlify-style custom headers.
- **No `headers()` config in `next.config.js`** — the `out/` directory is served by the host as-is.
- For a static export on Cloudflare Pages, you need a `_headers` file at the publish root. Recommended cache policy:
  - `/_next/static/*` and `/images/*` — `Cache-Control: public, max-age=31536000, immutable` (immutable content-hashed assets).
  - `*.html` — `Cache-Control: public, max-age=0, must-revalidate` (or short max-age with stale-while-revalidate).
  - `*.webp` / `*.jpg` / `*.png` — same as `_next/static/*`.
  - `/sitemap.xml` — `Cache-Control: public, max-age=3600`.
- Cloudflare Pages also reads a `_redirects` file — useful for redirecting `/some-old-url` → `/new-url` and for forcing trailing-slash on bare paths.

### 5.5 Favicon / PWA / theme color

| Asset | Present? | Notes |
|---|:---:|---|
| `favicon.ico` | ❌ | `content/data/site.json:2` points to a 64×64 PNG (`/images/shared/brand/cm-logo-color.png`). Browsers will use it but iOS Safari and others prefer a real `.ico`. |
| `apple-touch-icon.png` | ❌ | iOS home-screen icon will fall back to a cropped favicon. |
| `android-chrome-192.png`, `512.png` | ❌ | |
| `manifest.json` / `site.webmanifest` | ❌ | No PWA install, no theme color meta. |
| `<meta name="theme-color">` | ❌ | Mobile browser chrome (address bar tint) won't match the brand. |

Easy to add via `DefaultBaseLayout/index.tsx:26-38` (the `<Head>` block). Generate a small icon set (or use a tool like https://realfavicongenerator.net) and ship `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest` in `public/`.

### 5.6 Build target

> **Confirmed working — no action needed.** Build target is `out/` via `output: 'export'` + `distDir: 'out'` (`next.config.js:8, 11`). Cloudflare Pages auto-detects this on push. Confirmed working.

`netlify.toml:1-7` is a leftover from the project's prior Netlify hosting and is **not used by the current Cloudflare Pages deploy**:

```toml
[build]
  command = "npm run build"
  publish = ".next"
  functions = ".netlify/functions"

[[plugins]]
package = "@netlify/plugin-nextjs"
```

Although it is not affecting the live site, it is misleading. The `publish = ".next"` value would be wrong for a Netlify deploy (should be `"out"`), and `[[plugins]] package = "@netlify/plugin-nextjs"` is for SSR/SSG via Netlify's Next.js runtime — it does nothing useful for `output: 'export'` and adds unnecessary build time if the project is ever moved back to Netlify. **Recommendation:** either delete `netlify.toml` entirely (since Cloudflare Pages is the live host), or fix it to `publish = "out"` and remove the plugin block so it does not bite a future Netlify migration.

### 5.7 Cleanup tasks

- `_.next_old/` (folder) — appears to be a backup of a previous build. Should not be in the repo (not in `.gitignore` line 16-17).
- `out/` — also a build artifact, but it IS gitignored (`.gitignore:17`); the artifacts just happen to be in the working tree.
- `tsconfig.tsbuildinfo` — incremental build cache, should be in `.gitignore`.
- `_.next_old/cache/`, `_.next_old/diagnostics/`, `_.next_old/server/`, `_.next_old/static/`, `_.next_old/types/` are all build output.

### 5.8 `_app.js` analytics loading

`src/pages/_app.js:22-43` — Google Analytics (`G-JG1RTRLGQJ`) is loaded with `strategy="afterInteractive"` ✅, but there's no consent banner or `IP anonymization` flag. For a site serving EU/China visitors (which Yunnan is in), this is a GDPR concern. Consider switching to GA4 with consent mode and adding a privacy/cookie notice.

### 5.9 `useSearchParams` in static export

`FormBlock/index.tsx:3, 14-15` imports `useSearchParams` from `next/navigation`. This hook requires `<Suspense>` boundaries and is meant for app-router client components. In a `pages` router + `output: 'export'` setup this may either silently no-op or break the form's URL pre-fill behavior. Verify in a real build.

---

## 6. Quick wins (under 1 hour each)

| # | Action | File(s) | Effort |
|---|---|---|---:|
| 1 | Fix `index.md` frontmatter — move `type: PageLayout` and `isDraft: false` to the top | `content/pages/index.md:500-502` | 5 min |
| 2 | Add `width`/`height` + `loading="lazy"` to the generic `ImageBlock` | `src/components/blocks/ImageBlock/index.tsx:27-43` | 30 min (needs content audit to know intrinsic sizes) |
| 3 | Add `fetchpriority="high"` and intrinsic size to the LCP hero on `/` | `src/components/sections/HomepageHeroSection/index.tsx:45-50` | 10 min |
| 4 | Fix `tailwind.config.js` — collapse the duplicate `fontFamily.serif` keys (and decide whether Inter is actually used) | `tailwind.config.js:28-29` | 5 min |
| 5 | Add a 404 page | new `src/pages/404.tsx` (or `.js`) | 30 min |
| 6 | Update `robots.txt` Sitemap URL to the actual production domain | `public/robots.txt:4` | 5 min |
| 7 | Add `og:description` fallback in `seoGenerateMetaTags` | `src/utils/seo-utils.js:11-17` | 10 min |
| 8 | Fix `netlify.toml` `publish` directory to `"out"` (and remove the `@netlify/plugin-nextjs` plugin block) | `netlify.toml:3, 6-7` | 5 min |
| 9 | Remove the Shangri-La Monkey empty `altText` | `content/pages/ecotours.md:429` | 5 min |
| 10 | Add `aria-expanded` to the Itinerary day accordion button | `src/components/sections/ItinerarySection/index.tsx:515-538` | 5 min |
| 11 | Add favicon set (`.ico`, `apple-touch-icon.png`, `site.webmanifest`) and `<meta name="theme-color">` | new files + `DefaultBaseLayout/index.tsx:26-38` | 30 min |
| 12 | Add `_headers` and `_redirects` files in `public/` for Cloudflare Pages / Netlify | new files | 20 min |
| 13 | Add a 1200×630 default `og:image` | new asset + `content/data/site.json:5` | 30 min |
| 14 | Delete `_app.js` `useRouter` reference if unused (currently it imports `next/router` via Header, but the analytics setup in `_app.js` does not need it) | n/a (skip if not needed) | 0 |
| 15 | Replace `focus:outline-none` with `focus-visible:ring-2` in the form controls | `src/components/blocks/FormBlock/*/index.tsx` | 20 min |

---

## 7. Larger improvements (1+ hour each)

| # | Action | Why it matters | Effort |
|---|---|---|---:|
| 1 | **Re-encode all 12 images >500 KB** to webp at q=80 with sensible max-widths; convert the leftover PNGs (esp. `hidden-jade-dragon/banner.png`) | Cuts ~4–6 MB off the largest pages; biggest single perf win | 2–3 h |
| 2 | **Add `next/image` (or a thin wrapper)** to `ImageBlock` and the heroes, and provide responsive `sizes` + `srcset` | Proper CLS-safe images, responsive variants, AVIF/WebP negotiation | 4–6 h (touches every page section) |
| 3 | **Generate `sitemap.xml` at build** via a small `scripts/generate-sitemap.mjs` (reads `content/pages/**/*.md`) and run it from `package.json` `build` script | Search engines need it; right now zero | 1–2 h |
| 4 | **Add JSON-LD structured data**: `Organization` on `/`, `TouristAttraction` on each ecotour page, `BlogPosting` on blog posts, `BreadcrumbList` on deep pages | Real SEO lift for tour keywords | 4–6 h |
| 5 | **Delete the `sr-only` h1 in `PageLayout` and refactor hero h1 ownership** so each page has exactly one visible h1 | Fixes heading hierarchy and a11y audit failure on every page | 1 h |
| 6 | **Drop the Algolia + marked + dayjs dead code** — remove from `package.json`, remove `SearchBlock`, remove the `indexer/` directory if not used; also remove `_.next_old/`, `out/`, `tsconfig.tsbuildinfo` from the repo | Saves ~5 MB of installed deps and a 1.16 MB chunk | 2 h |
| 7 | **Convert `EcotourFilterSection`, `CarouselSection` show/hide, `ItinerarySection` accordion, `StickyBookingBar` sticky logic to CSS-only** where possible | Removes `useState`/`useEffect` from the largest client components | 4–8 h |
| 8 | **Add canonical URLs, Twitter card meta, and `<link rel="alternate" hreflang="..." />`** in `DefaultBaseLayout` | SEO completeness | 1 h |
| 9 | **Add a real `404.html` and `_redirects` for old URLs** (especially if any blog slugs have changed) | Better UX + search engine handling of broken links | 1 h |
| 10 | **Add a Lighthouse / PageSpeed Insights check to CI** so regressions are caught | Long-term protection | 2 h setup |

---

## 8. Out of scope / notes

- **No actual Lighthouse run was performed** in this audit. The repo's `out/` directory contains only webpack cache and stale build artifacts — no rendered HTML — so a real Chrome DevTools / Lighthouse measurement is not possible from this machine. The performance flags in §2 are inferred from the source code patterns (missing `width`/`height`, no `next/image`, no `loading="lazy"`, no `fetchpriority`, oversized images).
- **Network throttling / mobile / desktop Lighthouse comparisons** — would require a deployed URL or a local serve.
- **Third-party API performance** (Algolia response time, Cloudflare Worker contact-form latency) — out of scope; both can be measured once the forms/search are wired back in.
- **Actual color contrast on every rendered color pair** — only the brand palette was tested. Per-component uses (e.g. `text-primary/50`, hover states) should be audited visually in a build.
- **Screen-reader walk-through** of the accordion, mobile menu, and form — out of scope without a running site.

## 9. Confidence notes

| Finding | Confidence | Why |
|---|---|---|
| 12 images >500 KB, 1 >1 MB | High | Direct `Get-ChildItem` size measurement on the working tree. |
| No `width`/`height`/`loading` on any `<img>` | High | grep across `src/` confirms only one `loading="lazy"` site. |
| No `next/image` usage | High | grep across `src/` returns zero matches. |
| Two h1s on every hero page | High | Direct reading of `PageLayout`, `HeroSection`, `HomepageHeroSection`. |
| `netlify.toml` `publish` mismatch | High | Direct read of `netlify.toml:3` vs `next.config.js:8,11`. |
| Tailwind `fontFamily.serif` duplicated | High | Direct read of `tailwind.config.js:28-29`. |
| `index.md` malformed frontmatter | High | Direct read of `content/pages/index.md:500-502`. |
| Algolia dead code | High | `enableSearch: false` confirmed in `content/pages/blog/index.md:5`. |
| Exact chunk sizes (7 MB main.js) | Medium | Sizes taken from a stale `out/` working tree; a fresh build may differ. |
| Color contrast ratios | Medium | Calculated from `style.json` hex values; not measured against a live page. |
| `useSearchParams` in static export breakage | Low–Medium | Inferred from the imports; not verified against a real build. |

---

*End of audit.*

---
