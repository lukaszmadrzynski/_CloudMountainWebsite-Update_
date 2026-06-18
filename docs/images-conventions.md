# Cloud Mountain Website — Image Asset Convention

This directory holds every image used by the website. The structure is designed
so that any contributor (human or AI agent) can add a new ecotour page in
minutes without grep'ing through the repo to find filenames.

## TL;DR

- Per-tour assets live in **`tours/<tour-slug>/`** (one folder per ecotour)
- Cross-tour / brand / icon assets live in **`shared/`**
- Generic page assets live in **`pages/<page-slug>/`**
- Partner-page assets live in **`partner/<partner-page-slug>/`**
- Blog-post assets live in **`blog/<post-slug>/`**
- Stackbit editor-only thumbnails live in **`shared/presets/`**

All names are **kebab-case, lowercase, no spaces**. New uploads are **`.webp`**.

## Full folder layout

```
public/images/
│
├── README.md                         ← you are here
│
├── shared/                           ← assets used across multiple pages
│   ├── brand/                        ← logos, brand colors as image tokens
│   │   ├── cm-logo-color.png             # Full color logo, used in SEO meta
│   │   ├── cm-logo-header.png            # Header bar logo
│   │   ├── cm-logo-footer.webp          # Footer logo
│   │   ├── logo-dark.svg                # Stackbit preset alternative
│   │   └── logo-white.svg               # Stackbit preset alternative
│   │
│   ├── key-details/                  ← icons for the KeyDetailsSection
│   │   ├── special.png                   # "What's special" icon
│   │   ├── duration.png                  # "Duration" icon
│   │   ├── location.png                  # "Location" icon
│   │   └── level.png                     # "Activity level" icon
│   │
│   ├── itinerary/                    ← time-of-day icons for ItinerarySection
│   │   ├── morning.png
│   │   ├── afternoon.png
│   │   └── evening.png
│   │
│   ├── trust/                        ← review platforms, partner logos
│   │   ├── tripadvisor-logo.webp
│   │   ├── partner-rangle.svg
│   │   ├── partner-empathy.svg
│   │   ├── partner-sanity.svg
│   │   ├── partner-wellster.svg
│   │   ├── partner-telus.svg
│   │   └── partner-vise.svg
│   │
│   ├── reviews/                      ← TripAdvisor reviewer photos
│   │   ├── shirley-o.jpg
│   │   ├── sven.jpg
│   │   ├── lisa.jpg
│   │   └── ... (one per reviewer)
│   │
│   ├── team/                         ← team member photos
│   │   ├── lukas.jpg
│   │   └── lynne.jpg
│   │
│   ├── presets/                      ← Stackbit editor-only thumbnails
│   │   ├── hero.svg                       # not used on live site
│   │   ├── main-hero.jpg
│   │   ├── abstract-background.svg
│   │   └── ...
│   │
│   ├── ui/                           ← one-off UI bits
│   │   └── ...
│   │
│   └── misc/                         ← anything not yet categorized
│       └── (empty by design — add new category before adding to misc)
│
├── tours/                            ← one folder per ecotour
│   ├── shangri-la-monkey/
│   │   ├── banner.webp                 # hero image
│   │   ├── banner-alt.webp             # alternate hero / partner-page reuse
│   │   ├── card.webp                   # listing card on /ecotours
│   │   ├── highlight-1.webp             # first HighlightsSection card
│   │   ├── highlight-2.webp
│   │   └── ...
│   ├── wenhai-sanctuary/
│   │   ├── banner.webp
│   │   ├── card.webp
│   │   └── highlight-N.webp
│   └── ... (one folder per existing tour)
│
├── pages/                            ← one folder per top-level page
│   ├── home/                            # homepage hero, etc.
│   ├── why-us/                          # About-Cloud-Mountain page icons
│   ├── contact-us/
│   ├── ecotours-listing/                # HERO-Ecotours.webp etc.
│   ├── partner-with-us/                 # Partner-With-Us-Hero.webp
│   └── book/
│
├── partner/                          ← one folder per partner subpage
│   ├── consulting/
│   ├── corporate/
│   ├── family-ecocamps/
│   ├── schools/
│   ├── student-ecocamps/
│   └── travel-agencies/
│
└── blog/                             ← one folder per blog post
    ├── first-year-sustainable-ecotourism-yunnan/
    ├── discovering-naxi-culinary-traditions/
    ├── local-guides-stories/
    ├── spring-wildflowers-yunnan/
    ├── sustainable-lodging-yunnan/
    └── tea-horse-road-adventure/
```

## Naming rules

| Role | Pattern | Example |
|---|---|---|
| Hero banner | `banner.webp` | `tours/wenhai-sanctuary/banner.webp` |
| Alternate hero | `banner-alt.webp` | `tours/shangri-la-monkey/banner-alt.webp` |
| Listing card | `card.webp` | `tours/wenhai-sanctuary/card.webp` |
| Highlight card #N | `highlight-N.webp` (zero-pad to 2 digits when N ≥ 10) | `highlight-01.webp` |
| Highlight variant | `highlight-N-<suffix>.webp` | `highlight-1c.webp` |
| Page hero | `<page-slug>-hero.webp` (in `pages/<slug>/`) | `pages/why-us/why-us-hero.webp` |
| Partner page hero | `<partner-page-slug>-hero.webp` (in `partner/<slug>/`) | `partner/consulting/consulting-hero.webp` |
| Blog cover | `<post-slug>-cover.webp` (in `blog/<slug>/`) | `blog/first-year-...-yunn/first-year-...-cover.webp` |

## Image spec guidelines

- **Format:** `.webp` for new uploads (smallest, supported by all modern browsers)
- **Hero banner:** 1920 × 1080 minimum, 16:9, landscape
- **Listing card:** 800 × 800 minimum, square, can be tightly cropped
- **Highlight icons:** 600 × 600 minimum, square
- **JPG fallback:** If a `.webp` doesn't exist, the page falls back to the `.jpg` version. New uploads should be WebP.
- **Alt text:** Every image reference in markdown MUST have descriptive `altText`. It's both an SEO and accessibility requirement.

## How to add a new ecotour page

This is the operation the team will be doing repeatedly. Full checklist:

### 1. Create the asset folder
```bash
mkdir -p public/images/tours/<tour-slug>
```

### 2. Drop in the assets
- `banner.webp` — hero image (1920×1080+)
- `card.webp` — listing card (800×800 square)
- `highlight-1.webp`, `highlight-2.webp`, … — one per highlight

If you don't have new images yet, copy from an existing tour's folder
(e.g. `tours/wenhai-sanctuary/`) and flag the tour in your PR description
as "needs real assets."

### 3. Create the page markdown
`content/pages/ecotours/<tour-slug>-ecotour.md`. **Copy the existing template at
`content/pages/ecotours/ecotour-page-template.md` as your starting point.**
Then update:
- `title:` — display name
- `slug: /<tour-slug>-ecotour`
- `media:` URLs → `/images/tours/<tour-slug>/banner.webp`
- `actions[0].url:` → `/book?tour=<Tour+Name+With+Plusses>`
- `SimplifiedPricingSection` `plans[].url:` → `/book?tour=<Tour+Name>&group=N`
- `seo.metaTitle` / `seo.metaDescription` / `seo.metaTags[].content`

### 4. Register the tour in the listing
Open `content/pages/ecotours.md` and add a new `FeaturedItem` to the
`EcotourFilterSection.items[]` list. Match the exact field shape of the
other 9 entries. **Critical:** the `tagline` field must contain one of
`Half-Day` / `One Day` / `Two Days` / `Three Days` (etc.) so the filter
button groups the tour correctly. The `subtitle` should be the price
range like `"from $340 to $469 per person"`. The `url` in `actions[0]`
should be `/<tour-slug>-ecotour`.

### 5. Build & verify
```bash
npm run dev
```
Visit the tour page + the `/ecotours` listing. Verify:
- Hero image loads
- All highlights render with images
- Itinerary renders correctly
- "Book this Ecotour!" button goes to `/book?tour=...` with the right value
- Listing card shows up under the right duration filter (try each filter)
- StickyBookingBar shows the correct lowest price
- The FAQ accordion expands

### 6. Commit
The team does not commit to GitHub. The user (Lukas) reviews the diff and
commits.

## Why the old structure was bad

The previous layout was a flat `public/images/` directory with 400+ files
named things like `WH-Banner.webp`, `TC-Icon1c.webp`, `LJ-Banner.jpg`. Three
problems:

1. **No way to scan a directory and find "all the Wenhai tour files"** — you'd
   have to remember the `WH-` prefix and grep.
2. **Case-mismatched duplicates** (`Special.webp` next to `special.png`) — the
   one without refs is dead, but you can't tell without greping.
3. **JPG/WebP duplicates of the same image** — the original JPG was left
   behind when the file was re-encoded as WebP. 50+ files of pure waste.

The new layout fixes all three.

## For agents

If you are an AI agent adding a new ecotour page:

1. Read this README.
2. Use the existing template (`ecotour-page-template.md`) — don't write from
   scratch. Mimic byte-for-byte.
3. Match the `bookingUrl` encoding: spaces become `+`, e.g. `Wenhai+Sanctuary`.
4. The `tagline` on the listing card must contain `Half-Day` / `One Day` /
   `Two Days` / `Three Days` for the filter to group it.
5. The `StickyBookingBar` price is computed from the lowest
   `SimplifiedPricingSection.plans[].price` — just make sure the prices are
   formatted as `$N` (single dollar sign, integer).
6. After editing, `npm run build` should pass with no errors. If it doesn't,
   the most common cause is a missing image reference or a typo in the slug.

## Asset audit

To re-audit which images are still used (e.g. before another cleanup pass):

```powershell
# PowerShell on Windows:
$images = Get-ChildItem 'public/images' -Recurse -File
$searchExts = '*.md','*.ts','*.tsx','*.js','*.jsx','*.json','*.css'
$refFiles = Get-ChildItem . -Recurse -File -Include $searchExts |
    Where-Object { $_.DirectoryName -notlike '*\public\images*' -and
                  $_.Directory.FullName -notmatch '\\(node_modules|\.git|out|\.next)\\' }

foreach ($img in $images) {
    $name = $img.Name
    $hits = Select-String -Path $refFiles -Pattern ([regex]::Escape("/images/.../$name")) -ErrorAction SilentlyContinue
    if (-not $hits) {
        Write-Host "UNUSED: $name"
    }
}
```

Replace `...` with the subfolder the file lives in. Files reported as UNUSED
are candidates for deletion (verify the audit before trashing).
