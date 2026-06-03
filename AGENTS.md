# Cloud Mountain Website - Agent Notes

## Active Repository
**Repo:** `I:\3. Packaging\Website\_CloudMountainWebsite-Update_ LIVE VERSION`
**GitHub repo:** `lukaszmadrzynski/_CloudMountainWebsite-Update_`
**Cloudflare Pages:** `https://cloudmountainwebsite-update.pages.dev`
**Branches:**
  - `main` = live production site
  - `under-construction` = work-in-progress branch

## Hash Scroll Behavior

The `elementId` attributes in Stackbit markdown files (e.g., `elementId: partner-form-section`) render as `id` attributes on the **Section wrapper component** (`src/components/sections/Section/index.tsx`), NOT on the content components themselves.

**Critical insight:** If you need hash scroll behavior, implement it in `_app.js` as a global component. Putting it in individual content components (like `FormBlock`, `ItinerarySection`, etc.) will NOT work because the `id` is on the parent `Section` wrapper.

### Location of hash scroll logic:
`src/css/main.css` - CSS `scroll-margin-top` on `[id].sb-component-section`

**The Problem:** JavaScript scroll logic in `_app.js` (and elsewhere) wasn't working because:
1. JavaScript calculations were competing with the browser's native smooth scrolling
2. The `scroll-behavior: smooth` CSS on `<html>` plus the browser's native anchor handling was overriding JS scroll calls
3. Multiple scroll calls in quick succession cancel each other out

**The Solution:** Use CSS `scroll-margin-top` instead of JavaScript for hash scroll positioning. The browser handles the smooth scrolling natively, and the scroll-margin accounts for the fixed header automatically.

### How it works:
1. CSS selector: `[id].sb-component-section` targets all section elements with IDs
2. `scroll-margin-top: 350px` (200 + 150) pushes the scroll position 350px down from the section top
3. Browser handles smooth scrolling natively - no JavaScript needed
4. Works globally for all pages with hash anchors

### Files:
- `src/css/main.css` - Contains the scroll-margin CSS rule
- `src/pages/_document.js` - Contains `data-scroll-behavior="smooth"` on `<html>`
- `src/pages/_app.js` - HashScrollHandler can be removed (no longer needed but kept for compatibility)

## Listing card YAML indentation convention

The listing cards in `content/pages/ecotours.md` (the `EcotourFilterSection.items[]` array) follow a specific indentation pattern that the strict YAML parser (`front-matter` in Next.js) accepts. Use this exactly when adding or editing entries:

```yaml
- type: FeaturedItem                  # 2 spaces
  title: <Tour Name>                   # 2 spaces (sibling of type)
  tagline: Half-Day | <...>            # 2 spaces
  subtitle: from $X to $Y per person    # 2 spaces
  text: >                              # 2 spaces
    <one-paragraph description>        # 4 spaces
  image:                               # 2 spaces
    type: ImageBlock                   # 4 spaces
    url: /images/tours/<slug>/card.webp # 4 spaces (SIBLING of type, not nested deeper)
    altText: <descriptive alt text>    # 4 spaces
    elementId: ''                      # 4 spaces
    styles:                            # 4 spaces
      self:                            # 6 spaces
        borderRadius: x-large          # 8 spaces
        flexDirection: col             # 8 spaces
        justifyContent: center         # 8 spaces
        textAlign: left                # 8 spaces
        margin:                        # 8 spaces
          - ml-1                       # 10 spaces
          - mr-1                       # 10 spaces
  actions:                             # 2 spaces
    - type: Button                     # 4 spaces
      label: Learn More                # 6 spaces
      ...
```

**Critical:** The `url:`, `altText:`, `elementId:`, and `styles:` keys are **siblings of `type:` at the same 4-space indent level**. They are NOT children of `type: ImageBlock` (which has a scalar value, so it can't have children anyway).

**Two existing entries (`Hidden Jade Dragon` and `Lijiang Heavenly Valley`) had a non-standard deep indent of 6 spaces for `url`/`altText` that worked in Stackbit's visual editor but breaks strict YAML parsers with `Runtime YAMLException: bad indentation of a mapping entry`. When editing these, normalize to 4 spaces to match the rest.**

### Files:
- `content/pages/ecotours.md` - The listing page
- `src/components/sections/EcotourFilterSection/index.tsx` - Renders the listing cards in a 3-column grid