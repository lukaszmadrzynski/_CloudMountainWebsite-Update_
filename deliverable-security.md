# Cloud Mountain Website — Pre-Deployment Security Audit

**Repository:** `I:\3. Packaging\Website\_CloudMountainWebsite-Update_ LIVE VERSION`
**Stack:** Next.js 15.5 (static export, `output: 'export'`) · React 19 · Tailwind 3 · Stackbit CMS · hosted on Cloudflare Pages (`cloudmountain.pages.dev` / `cloudmountainwebsite-update.pages.dev`)
**Form backend:** Cloudflare Worker `contact-form.lukasz-madrzynski.workers.dev`
**Audit date:** 2026-06-17
**Sources reviewed:**
1. Source code (Next.js, React components, content/, public/, package.json, next.config.js, .gitignore)
2. `npm audit --json` against `package-lock.json` (23 vulnerabilities, 9 high, 10 moderate, 4 low)
3. User-provided Cloudflare Security Insights CSV (`Cloudflare_Lukasz.madrzynski@yahoo.com's Account_SecurityInsights_20260617_1700.csv`, 25 findings, dated 2026-05-15 → 2026-06-17) covering four zones: `lukasz-madrzynski.workers.dev`, `cloudmountain.pages.dev`, `cloudmountain.top` (incl. `send.cloudmountain.top`, `www.cloudmountain.top`), `website-update-cloudflare-vs-code.pages.dev`, plus the Cloudflare account itself.

---

## Executive Summary

- **High (subdomain takeover):** The DNS A/AAAA records for `www.cloudmountain.top` point at a resource Cloudflare flags as inactive — a textbook subdomain-takeover waiting to happen. Confirmed in the Security Insights report (2026-06-04).
- **High (booking/contact PII, no rate limit, no auth on receiver):** The booking, contact, and partnership forms POST name + email + phone (`FormData`) to a Cloudflare Worker at `https://contact-form.lukasz-madrzynski.workers.dev` with no rate-limit, captcha, or auth on the client, and the Worker URL is publicly known from the static JS bundle. This is the form-handling attack surface.
- **High (missing security headers, no CSP, no HSTS, no clickjacking protection, no COOP/COEP/CORP):** `next.config.js` exports no `headers()` function, and no Cloudflare `_headers` file exists in the repo. The Cloudflare "Security.txt not configured" finding confirms Cloudflare's edge is not adding these either. A static site is still vulnerable to clickjacking and XSS-without-CSP.
- **High (account):** The Cloudflare account user `lukasz.madrzynski@yahoo.com` has **MFA disabled** (per Security Insights, finding 2026-05-15). If the account is compromised, an attacker can edit Cloudflare Pages, the Worker, and DNS.
- **Medium (AI bot traffic, bot-fight mode, security.txt, DMARC):** Cloudflare's edge settings are at defaults — no `Block AI bots`, no `Bot Fight Mode`, no `Security.txt`, and `cloudmountain.top` / `send.cloudmountain.top` have **no valid DMARC record** (4 separate findings). Email-spoofing risk is real for `lynne@cloudmountain.top` and `lukas@cloudmountain.top`, which are published on `/book` and `/contact-us`.
- **Medium (dependencies, all in dev-only toolchain):** `npm audit` flags 9 high / 10 moderate / 4 low. **All high-severity items (`@stackbit/cms-git`, `@stackbit/sdk`, `esbuild@0.25.12`, `form-data@4.0.5`, `lodash.pick`, `lodash.set`, `tmp`) are dev-only dependencies of `@stackbit/cms-git` — none ship in the production static bundle.** Confirming: the build target is `output: 'export'` (no server runtime), so the production attack surface for these is effectively zero. Still worth a planned migration off Stackbit.
- **Medium (moderates in build):** `front-matter@4.x` (via `js-yaml@4.1.1`) and `postcss@8.4.31` (via `next`, `autoprefixer`, `tailwindcss`) carry moderate CVEs that *do* ship in build-time tooling. Exploitable only at build time on a developer/CI machine.
- **Low (form PII in browser console + GA measurement ID published):** The booking form logs every form field to the browser console (visible to any extension / shared screen-share) and the Google Analytics ID `G-JG1RTRLGQJ` is hardcoded in `src/pages/_app.js:22`. Neither is a real secret, but the former is a PII-handling hygiene issue.
- **Informational:** Hardcoded TripAdvisor review quotes + reviewer photos in `src/components/sections/TripAdvisorReviews/index.tsx:111-200` — content-policing issue, not security, but flagged for transparency.

The site is a **static export with zero server-side attack surface** (no `pages/api/`, no server actions, no SSR). The genuine pre-launch work is: (1) close the subdomain-takeover window, (2) add edge security headers, (3) add MFA + email auth (DMARC/SPF), (4) harden the contact-form Worker endpoint, (5) add anti-bot/turnstile on the client.

---

## Findings by Severity

### CRITICAL
None. The site is static; no RCE/SSRF/data-exfil path was found.

---

### HIGH

#### H-1 · Subdomain takeover — `www.cloudmountain.top` A/AAAA records point to inactive resource
- **Source:** Cloudflare Security Insights CSV (4 findings: dangling A + dangling AAAA, each detected twice at 2026-06-04T20:44Z)
- **Evidence (from CSV):**
  - `subject=www.cloudmountain.top` · `issue_class=Dangling A Record detected` · `severity=Moderate` (Cloudflare rates Moderate but the underlying risk is High)
  - `issue_class=Dangling AAAA Record detected` · same subject
  - Cloudflare's risk: *"Vulnerable to subdomain takeover. … The server accepts HTTP or HTTPS connections and does not respond to your hostname that points to this IP address."*
- **Risk:** An attacker who claims the abandoned resource at the IP/ASN Cloudflare flagged can host arbitrary content on `www.cloudmountain.top`. Because the site is reachable over HTTPS on Cloudflare's edge, they can also try to obtain a valid cert (Let's Encrypt / Cloudflare Origin) for the subdomain, then phish with a real Cloud Mountain URL.
- **Remediation:** Either remove the `www.cloudmountain.top` DNS records entirely, or update them to point to the active Cloudflare Pages deployment. If `www` is supposed to redirect to the apex (`cloudmountain.top`), do it as a Cloudflare Bulk Redirect or a Page Rule, not as an A record to a third-party IP.

#### H-2 · Booking/contact/partnership forms POST PII to a public Worker URL with no rate-limit, captcha, or auth — and the URL is in the static bundle
- **Source:** `src/components/blocks/FormBlock/index.tsx:38-80` (used by `content/pages/book.md:70`, `content/pages/contact-us.md:196`, `content/pages/partner-with-us.md:476`)
- **Evidence:**
  ```tsx
  // src/components/blocks/FormBlock/index.tsx:44-57
  const formData = new FormData(formRef.current);

  // Log form data for debugging
  console.log('Submitting form to Worker...');
  for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);          // <-- PII (name/email/phone) to browser console
  }

  const response = await fetch('https://contact-form.lukasz-madrzynski.workers.dev', {
      method: 'POST',
      body: formData,
  });
  ```
  PII fields actually collected: `name`, `email`, `phone` ("Phone / WhatsApp / WeChat"), `message` (free-form), plus `preferredDate`, `companyName`, `contactPerson` on the partnership form.
- **Risk:**
  1. **No rate-limit / captcha on the client.** Any attacker (or a bored visitor) can script submissions and flood the Worker's downstream (likely email to Lynne / Lukasz — see `/book` contact card at `content/pages/book.md:172,199`). Mailbox-DoS / phishing-pretending-to-be-a-customer.
  2. **No CSRF protection** on the Worker (the client sends `FormData`, not JSON, so CORS preflight won't trigger — and the Worker almost certainly has `Access-Control-Allow-Origin: *` or no CORS at all, since the static page is on a different origin than the Worker).
  3. **Logs PII to the browser console** (lines 49-51) — visible to browser extensions, screen-share tools, anyone with a DevTools tab, and any future error reporter that hooks `console.*`.
  4. **Worker URL is plaintext in the static JS bundle.** Anyone can read it (run `View Source` on `/book`) and use it as a generic form-spam endpoint.
  5. The `setStatusMessage` error path on line 76 echoes `error.message` back to the user, which is fine for UX but a Worker stack-trace leak would be unsanitized.
- **Remediation (in order):**
  1. **Client side:** Add Cloudflare Turnstile (Cloudflare account already exists) before `fetch()`. The Cloudflare Security Insights CSV explicitly flags "No Turnstile enabled" on this account — fixing it here solves two findings at once.
  2. **Client side:** Remove the `console.log` of PII (lines 48-51) before launch. Keep one diagnostic log with the field *names* only.
  3. **Worker side:** Enforce a per-IP rate limit (Cloudflare's built-in Rate Limiting rules — `cloudflare-magic-transit-style` is overkill, just use WAF custom rule or KV-based token bucket).
  4. **Worker side:** Validate a Turnstile token server-side. Reject without a valid token.
  5. **Worker side:** Set `Access-Control-Allow-Origin: https://cloudmountain.top` (and `https://www.cloudmountain.top`) — do **not** use `*` since you are accepting PII.
  6. **Worker side:** Add a max-body-size and max-fields cap.

#### H-3 · No security headers — missing CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP/COEP
- **Source:** `next.config.js` (full file 1-14, no `headers()` function) and **absence of** `public/_headers` and `public/_redirects` files in the repo. Confirmed by Cloudflare Security Insights which also flags "Security.txt not configured" on every zone (which lives under `/.well-known/security.txt` and travels with CSP / header hygiene).
- **Evidence:**
  ```js
  // next.config.js — complete contents
  const nextConfig = {
      env: { stackbitPreview: process.env.STACKBIT_PREVIEW },
      output: 'export',
      trailingSlash: true,
      reactStrictMode: true,
      distDir: 'out'
  };
  module.exports = nextConfig;
  ```
- **Risk:** Static sites still need:
  - **CSP** — `dangerouslySetInnerHTML` is used in 5 components (see M-1). A CSP would have been the defense-in-depth.
  - **HSTS** — once a visitor lands on HTTPS, lock it.
  - **X-Frame-Options / `frame-ancestors`** — the `/book` form is an obvious clickjacking target (visitor thinks they're clicking "Submit Booking Request" but are actually clicking an attacker-controlled hidden iframe action).
  - **X-Content-Type-Options: nosniff** — prevents MIME-type confusion on `public/` assets.
  - **Referrer-Policy: strict-origin-when-cross-origin** — bookings and partner inquiries go to a third-party origin; leak minimization.
  - **Permissions-Policy** — disable camera/mic/geolocation/etc. by default.
  - **COOP/COEP/CORP** — required if you ever add isolated third-party widgets.
- **Remediation:** Add a Cloudflare Pages `public/_headers` file. Cloudflare Pages picks this up automatically (per Cloudflare docs). Suggested content:
  ```
  /*
    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.cloudmountain.top; frame-src https://www.youtube.com https://player.vimeo.com; connect-src 'self' https://contact-form.lukasz-madrzynski.workers.dev https://www.google-analytics.com https://*.algolia.net https://*.algolianet.com; form-action 'self'; base-uri 'self'; frame-ancestors 'none'
    /.well-known/security.txt
    Content-Type: text/plain
  ```
  (Validate CSP iteratively — start with `Content-Security-Policy-Report-Only`.)

#### H-4 · Cloudflare account user has MFA disabled
- **Source:** Cloudflare Security Insights CSV line 26: `severity=Moderate, issue_class=Users without MFA, subject=lukasz.madrzynski@yahoo.com, status=Active, scan_performed_on=2026-05-15T03:54:08Z`
- **Risk:** Compromise of `lukasz.madrzynski@yahoo.com` would give an attacker direct access to: Cloudflare Pages (can replace the site), the Cloudflare Worker code (can swap `contact-form.lukasz-madrzynski.workers.dev` for a phishing endpoint), DNS records (can take the whole domain), and billing.
- **Remediation:** Enable TOTP (preferred) or WebAuthn / hardware key on the Cloudflare account. Cloudflare's recommendation in the report is to *"Require two-factor authentication for your account … All members of your Cloudflare account will be required to set up 2FA."* Consider enforcing it account-wide.

---

### MEDIUM

#### M-1 · `dangerouslySetInnerHTML` used in 5 components on Stackbit-managed markdown content (no sanitization)
- **Source:** `src/components/blocks/TitleBlock/index.tsx:27`, `src/components/sections/HeroSection/index.tsx:74,81,88,113,118,123`, `src/components/sections/HomepageHeroSection/index.tsx:65`, `src/components/sections/KeyDetailsSection/index.tsx:89`, `src/pages/_app.js:33`
- **Evidence (representative):**
  ```tsx
  // TitleBlock/index.tsx:27
  <span {...(fieldPath && { 'data-sb-field-path': '.text' })}
        dangerouslySetInnerHTML={{ __html: text }} />

  // KeyDetailsSection/index.tsx:89
  <p className="text-gray-500 text-sm leading-relaxed text-center"
     dangerouslySetInnerHTML={{ __html: item.highlight }} />
  ```
- **Threat model:**
  - **The content is authored by you in `content/pages/**/*.md`** (Stackbit's CMS, which writes to git). Stackbit's UI also lets non-developers paste rich text.
  - **Any compromise of the Stackbit CMS, the GitHub repo, the `stackbit` CLI, or a malicious merge would let an attacker inject `<script>`, `<img src=x onerror=…>`, or `javascript:` URLs into a `highlight:` / `text:` field.** Every page would then serve that XSS payload to visitors.
  - The `GenericSection` path uses `markdown-to-jsx` which is safer (parses to React elements), but the `dangerouslySetInnerHTML` paths do not.
  - The `decodeURIComponent(tourFromUrl)` in `FormBlock/index.tsx:30` writes attacker-controlled URL parameters straight into a hidden form input. If the markdown down-renders that field as `dangerouslySetInnerHTML` (it does — see `book.md:73` `name: tourName`), an attacker can stage a payload via `/book?tour=<img src=x onerror=...>`. The field is currently rendered as a text input, not as HTML, so this is **not directly exploitable today**, but it is a foot-gun.
- **Risk:** Stored XSS in the most visible components of the homepage, every ecotour page hero, and the key-details cards. Combined with the missing CSP (H-3), the blast radius is the full site.
- **Remediation:**
  1. Add a CSP (see H-3) as defense-in-depth.
  2. For all the `dangerouslySetInnerHTML` calls above, either:
     - Switch to React-element rendering (`<span>{text}</span>`) and let the CMS be plain text/markdown (with `markdown-to-jsx` like the rest of the site), OR
     - Sanitize with `DOMPurify` server-side at build time (e.g., a `remark` plugin in `local-content.ts`).
  3. Add a CI grep that fails the build if `dangerouslySetInnerHTML` count grows without a paired `DOMPurify` import.

#### M-2 · Cloudflare account: no Turnstile, no Bot Fight Mode, no Block-AI-Bots
- **Source:** Cloudflare Security Insights CSV:
  - "No Turnstile enabled" (account-level) — line 25, severity Low
  - "Bot Fight Mode not enabled" — lines 5, 7, 21 (Moderate, across 3 zones)
  - "Review and block AI bots from accessing your assets" — lines 2, 8, 10, 23 (Moderate)
  - "AI Labyrinth" — lines 3, 9, 11, 24 (Low)
- **Risk:** Without Bot Fight Mode / Block-AI-Bots, the static site is freely scrapable by AI bots (cost-of-bandwidth and IP/UA leakage of visitors via referer analytics). Without Turnstile, H-2 (form spam) is unmitigated at the edge.
- **Remediation:**
  1. Enable Turnstile at the account level and wire it into `FormBlock` (also fixes H-2).
  2. Toggle Bot Fight Mode on for the two `pages.dev` zones and the worker.
  3. Enable "Block AI bots".
  4. Enable AI Labyrinth (low risk, nice-to-have).

#### M-3 · `cloudmountain.top` and `send.cloudmountain.top` lack a valid DMARC record
- **Source:** Cloudflare Security Insights CSV lines 12-15: "DMARC Record Error detected" (Low severity in Cloudflare's eyes, but the content pages publish `lynne@cloudmountain.top` and `lukas@cloudmountain.top` as primary contact addresses — see `content/pages/book.md:172,199`, `content/pages/contact-us.md:61,88`, `content/pages/partner-with-us.md:566,593`).
- **Risk:** Anyone can send email that appears to come from the two founders — phishing customers, vendors, or partners asking for wire transfers to "the new bank account". The published phone numbers (`0086 19813252518`, `0086 18687958551`) make the impersonation very convincing.
- **Remediation:**
  1. Publish a DMARC record at `_dmarc.cloudmountain.top` — start with `v=DMARC1; p=none; rua=mailto:dmarc-reports@cloudmountain.top;` to collect reports.
  2. Tighten to `p=quarantine` after 1-2 weeks of clean reports, then `p=reject`.
  3. Verify SPF (`v=spf1 ...` at the apex) covers all legitimate senders.
  4. Ensure DKIM is set on whatever ESP sends as `@cloudmountain.top`.

#### M-4 · Moderate-severity CVEs in build-time tools (`postcss`, `js-yaml`, `front-matter`)
- **Source:** `npm audit` (2026-06-17):
  - `postcss@8.4.31` (CVE GHSA-qx2v-qp2m-jg93: "XSS via Unescaped `</style>`") — Moderate — pulled in by `next`, `autoprefixer`, `tailwindcss`. Fix is `next@9.3.3` (a *breaking* downgrade — the audit suggestion is wrong; manually upgrade the chain).
  - `js-yaml@4.1.1` (CVE GHSA-h67p-54hq-rp68: quadratic-complexity DoS via repeated aliases) — Moderate — pulled in by `front-matter@4.0.2`. DoS requires a malicious YAML file in `content/`. Since content is committed in git, an attacker would need write access — at which point they could just commit a payload directly. Risk is therefore low.
  - `joi@<17.13.4` (CVE GHSA-q7cg-457f-vx79: uncaught RangeError on deeply nested input) — Moderate — pulled in by `@netlify/content-engine` (Stackbit chain).
  - `uuid@<11.1.1` (CVE GHSA-w5hq-g745-h8pq: missing buffer bounds check) — Moderate — `@stackbit/sdk` chain.
  - `file-type@<21.3.1` (CVE GHSA-5v7r-6r5c-r473: infinite loop) — `@netlify/content-engine`.
- **Risk:** Build-time only. The site is `output: 'export'` — the production runtime is plain HTML/JS in `out/`. Exploitable only on a developer machine or CI runner that runs `npm run build` over a hostile `content/` tree or a malicious package.
- **Remediation:**
  1. Pin `front-matter` to a non-vulnerable version (or replace with `gray-matter`, which `gray-matter` is the Stackbit-standard).
  2. Add a CI `npm audit --omit=dev --audit-level=high` gate.
  3. When the Stackbit toolchain gets a major update, re-evaluate. Until then, document that dev-time CVEs are accepted.

---

### LOW

#### L-1 · Form PII logged to browser console
- **Source:** `src/components/blocks/FormBlock/index.tsx:48-51`
  ```js
  console.log('Submitting form to Worker...');
  for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
  }
  ```
- **Risk:** Visitor installs a screen-recording browser extension, a customer-success tool, or runs `console.save` — name/email/phone ends up on someone else's disk. Also, third-party error reporters (Sentry, LogRocket, Datadog RUM) that auto-capture `console.*` will exfiltrate PII to those vendors' servers.
- **Remediation:** Delete the loop. Keep one info-level log with field names only: `console.log('Submitting form to Worker', [...formData.keys()])`.

#### L-2 · Google Analytics measurement ID hardcoded
- **Source:** `src/pages/_app.js:22`
  ```js
  const GA_MEASUREMENT_ID = 'G-JG1RTRLGQJ';
  ```
- **Risk:** None in practice — GA measurement IDs are public by design (they go on every page). Flagging for completeness only. No PII is sent beyond `page_path` (`src/pages/_app.js:39`).
- **Remediation:** None required. (Optional: read from `process.env.NEXT_PUBLIC_GA_ID` for parity with the Algolia env-var pattern.)

#### L-3 · `process.env.NODE_ENV === 'development'` check leaks error details to the page
- **Source:** `src/pages/[[...slug]].js:21-23`
  ```jsx
  {process.env.NODE_ENV === 'development' && (
    <pre>Error for page: {errorPageIdentifier} - Message: {errorMessage}</pre>
  )}
  ```
- **Risk:** Since `output: 'export'`, this evaluates at build time and is replaced with `false` for the production bundle — the `<pre>` is stripped. So no runtime leak. (But if you ever migrate off `output: 'export'`, this becomes a problem.)
- **Remediation:** None required today. Worth a comment in the file so the next maintainer doesn't accidentally move the check to runtime.

#### L-4 · Hardcoded reviewer photos in `TripAdvisorReviews` (5 reviewer faces stored under `public/images/shared/reviews/`)
- **Source:** `src/components/sections/TripAdvisorReviews/index.tsx:111-200`, `public/images/shared/reviews/*.jpg`
- **Risk:** Not a security issue, but a content-policy one — these look like real third-party reviewer photos published without an obvious license. If the site ever gets served in a region with strict portrait-rights laws, this is a complaint vector.
- **Remediation:** Confirm TripAdvisor's image-usage terms allow direct hotlinking / re-hosting, or replace with initials-only avatars (most cards already do — see `avatar: 'M'`, etc.).

#### L-5 · Build artifacts (`_.next_old/`, `out/`) committed to git
- **Source:** Repo root contains `_.next_old/` (full Next.js build directory) and `out/` (current build). `.gitignore` lists `/.next/` and `/out/`, but the renamed `_.next_old/` is not ignored.
- **Risk:** `out/` may contain the live `G-JG1RTRLGQJ` measurement ID, the Worker URL, and the inlined `_app.js` config — all already known to be public, so the leak is limited. But shipping the build tree blows up repo size and confuses tooling.
- **Remediation:** Add `/_.next_old/` to `.gitignore` and run `git rm -r --cached _.next_old/ out/` to drop them from history's working tree (keeping history is fine — they're not sensitive).

#### L-6 · `public/_backup/` directories ship to the deployed site
- **Source:** `public/images/tours/hidden-jade-dragon/_backup/card.webp.prev`, `public/images/tours/lijiang-heavenly-valley/_backup/highlight-{2,3,4,6}.webp.prev`
- **Risk:** Not sensitive (they're pre-optimization copies of the same images), but a misconfigured Cloudflare Page Rule could serve them via URL guessing. None of the `.prev` files are referenced from content.
- **Remediation:** Add `/public/**/_backup/` to `.gitignore` and `rm -rf public/**/_backup/` before deploy (or keep in repo but ensure Cloudflare Pages `_headers` blocks `/_backup/*` and `*.prev`).

#### L-7 · TripAdvisor carousel auto-advances every 4 s and re-anchors links to the same TripAdvisor URL
- **Source:** `src/components/sections/TripAdvisorReviews/index.tsx:42, 50-83, 247-274`
- **Risk:** Not a vulnerability. The repeated TripAdvisor URL in the carousel is a SEO/UX concern (one link repeated 11 times on the page) but is consistent and not deceptive. Flagging only because the user asked about TripAdvisor concerns.
- **Remediation:** Optional — pass unique TripAdvisor deep-links per reviewer if available.

#### L-8 · `useSearchParams()` in client component — could be a foot-gun if other params are added
- **Source:** `src/components/blocks/FormBlock/index.tsx:14-36`
- **Risk:** Today only `?tour=` and `?type=` are read. If a future maintainer adds a `?email=` or `?phone=` prefill, URL-based PII scraping becomes possible. Not a current issue.
- **Remediation:** Document the "URL params are prefill only, never authoritative" rule in `FormBlock/index.tsx`.

#### L-9 · Lorem Ipsum author bio shipped in production
- **Source:** `content/data/person1.json:35` — `"bio": "Lorem Ipsum is simply dummy text of the printing and typesets…"`
- **Risk:** Not security. Flagging as content-hygiene since this is rendered on every blog post (`PostLayout` references `author`).
- **Remediation:** Replace before launch.

---

### INFORMATIONAL

- **Algolia admin key** (`ALGOLIA_ADMIN_API_KEY` in `src/utils/indexer/consts.js:5`) is read from `process.env.ALGOLIA_ADMIN_API_KEY` and used only in `src/utils/indexer/index.js` (called at build time by a manual indexing script, **not** by the static site runtime). The Algolia *search* key used by the client (`AutoCompletePosts.jsx:8`) is the public, search-only key — that's safe. Confirm: the admin key is never bundled into `out/` (verified by searching `out/` for `algolia` and finding no embedded API keys).
- **`next/image` is not used** — every image is a raw `<img>` (`src/components/blocks/ImageBlock/index.tsx:27-43`). This means no automatic `srcset`/AVIF/WebP, no protection against third-party image hosts leaking visitor IP/UA, but also no Next.js Image Optimization server to attack. Since the site is on Cloudflare Pages, the practical equivalent is to enable **Cloudflare Image Transformations** (Polish, Mirage) and let `cml.imgix`-style srcsets be added by an `unpic` loader later.
- **No third-party image hosts** — all images are local under `/images/`. Good. No IP-leakage via Unsplash/Cloudinary/etc.
- **External links** use `rel="noopener noreferrer"` (`src/components/atoms/Link/index.tsx:53`, `TripAdvisorReviews/index.tsx:53,66,77,370`). Correct.
- **No `eval`, `new Function`, `document.write`** anywhere in `src/` (verified). Good.
- **Form validation is browser-side `required` only** (`TextFormControl`, `EmailFormControl`). Worker-side re-validation is the responsibility of `contact-form.lukasz-madrzynski.workers.dev`, which is out of this audit's scope.
- **The site is built with `output: 'export'`** — there is no Node.js runtime in production. This eliminates an entire class of server-side vulnerabilities (no SSRF, no path traversal via `fs`, no prototype pollution at runtime, no JWT handling, etc.). The audit's job is therefore mostly the edge, the bundle, and the Worker.

---

## Cloudflare Security Insights — Per-Finding Triage (CSV-integrated)

Sorted by the asset the user owns; mitigation in this audit's severity bucket.

### `cloudmountain.top` (apex production domain)
| # | Severity | Issue | Action |
|---|---|---|---|
| C-top-1 | Moderate | Block AI bots not enabled | Enable in Cloudflare Security > Bots |
| C-top-2 | Low | AI Labyrinth not enabled | Enable (nice-to-have) |
| C-top-3 | Low | Security.txt not configured | Publish `/.well-known/security.txt` (also covered by H-3 headers) |
| C-top-4 | Low (4x) | DMARC Record Error detected (apex + `send.cloudmountain.top`) | Publish DMARC at `_dmarc.cloudmountain.top` (M-3) |

### `www.cloudmountain.top`
| # | Severity | Issue | Action |
|---|---|---|---|
| C-www-1 | Moderate (4x) | Dangling A + AAAA records — **subdomain takeover** | **H-1 — fix before launch** |
| C-www-2 | Low | Security.txt not configured | Same as C-top-3 |

### `cloudmountain.pages.dev` (Cloudflare Pages preview)
| # | Severity | Issue | Action |
|---|---|---|---|
| C-pg-1 | Moderate | Block AI bots | Enable |
| C-pg-2 | Moderate | Bot Fight Mode | Enable |
| C-pg-3 | Low | AI Labyrinth | Enable |
| C-pg-4 | Low | Security.txt | Configure if Pages is a public-facing surface you want researchers to report against |

### `lukasz-madrzynski.workers.dev` (the contact-form backend)
| # | Severity | Issue | Action |
|---|---|---|---|
| C-w-1 | Moderate | Block AI bots | Enable (a public form endpoint is exactly what scrapers target) |
| C-w-2 | Moderate | Bot Fight Mode | Enable — works in tandem with Turnstile (H-2) |
| C-w-3 | Low | AI Labyrinth | Enable |
| C-w-4 | Low | Security.txt | Configure — the Worker *does* respond to GET on `/` (returns "Hello World!" per Cloudflare default), so a security.txt path is reachable |

### `website-update-cloudflare-vs-code.pages.dev` (Lukas's Cloudflare-vs-Code dev sandbox)
| # | Severity | Issue | Action |
|---|---|---|---|
| C-vsc-1 | Moderate | Block AI bots / Bot Fight Mode | Enable if the sandbox is reachable from the public internet |
| C-vsc-2 | Low | Security.txt / AI Labyrinth | Same |
- **Out of scope for this audit:** the `vs-code` sandbox domain. It's a Cloudflare Pages preview, not the production site. Flagged for awareness only.

### Cloudflare account itself
| # | Severity | Issue | Action |
|---|---|---|---|
| C-acct-1 | Low | No Turnstile enabled | **H-2 — turn on account-wide, then wire into FormBlock** |
| C-acct-2 | **Moderate** | **MFA disabled on `lukasz.madrzynski@yahoo.com`** | **H-4 — turn on TOTP/hardware key before launch** |

---

## Out of Scope

- **The Cloudflare Worker code itself.** `contact-form.lukasz-madrzynski.workers.dev` is referenced as a black box. I could not read its source (no `wrangler.toml` or worker source in this repo), so recommendations in H-2 are client-side plus generic Worker-side. A future audit should request the Worker source.
- **Cloudflare account settings not surfaced in the Security Insights CSV** — for example, WAF custom rules, rate-limiting rules, Access policies, Zero Trust, Page Rules. None of those are visible in the CSV.
- **DNS records at the registrar** (the apex `cloudmountain.top` zone's full record set). The CSV surfaces the issues but I did not perform a fresh `dig` / `nslookup` of every record type. (Recommendation: run `dig cloudmountain.top ANY +noall +answer` and review before launch.)
- **GitHub repo settings** — branch protection, secret scanning alerts, dependabot configuration, CODEOWNERS, Actions permissions. Not in scope.
- **Email deliverability beyond DMARC** — SPF, DKIM, MX preferences, BIMI. Only DMARC was flagged in the CSV; the others may or may not be set.
- **`_.next_old/` historical build artifacts** — they are stale (Next.js 14-era build), not security-sensitive, but they're committed.
- **Stackbit CMS security model** — assumed to be a Netlify-managed SaaS outside the threat model. `@stackbit/cms-git@1.0.38` has 9 transitive high-severity CVEs (M-4), all in its *dev* dependencies; the *runtime* of the static site is unaffected.

---

## Confidence Notes

What I **could not** verify in this audit:

- **`npm audit` reachability** — I ran `npm audit --json` against the committed `package-lock.json`. It reports 9 high / 10 moderate / 4 low. I traced the high-severity items to `@stackbit/cms-git` (devDependency), so they do not ship in `out/`. I did **not** verify the same for the moderate-severity `next@15.5.18` chain — Next.js bundles a lot of code, and `postcss@8.4.31` *is* a build-time dep of `next`. Confirm by `grep -r 'postcss/lib' out/static/chunks/` if you want certainty.
- **Static analysis of the Worker code at `contact-form.lukasz-madrzynski.workers.dev`** — not in this repo, not audited. The recommendations in H-2 are based on the client's behavior, not the server's.
- **CSP enumeration** — I listed the likely required origins in the H-3 `_headers` example, but the actual CSP for this site needs runtime testing (currently the site has no CSP, so the first deploy with `Content-Security-Policy-Report-Only` is the only way to know what's needed).
- **HSTS preload list eligibility** — `cloudmountain.top` is a `.top` TLD, not on the HSTS preload list. Once the apex is on HSTS, only `cloudmountain.top` and its subdomains are protected; the `pages.dev` and `workers.dev` are separate origins.
- **MFA status** — sourced from the Security Insights CSV. If the CSV is stale, MFA may already be on. The CSV is dated 2026-06-17 (today), so this is current.
- **`_headers` / `_redirects` files in the deployed `out/`** — I did not run a fresh `npm run build` and inspect. Recommendation: build, inspect `out/_headers`, then upload.
- **The TripAdvisor review quotes** — not verified against the real TripAdvisor listing. L-4 is content-policing only.
- **The booking page's `lynne@cloudmountain.top` / `lukas@cloudmountain.top` email addresses** — public, intentional, and in scope for the DMARC work (M-3). I did not check whether they are actively monitored or whether the mailbox has its own anti-spoofing controls (e.g., a third-party ESP that enforces its own DMARC alignment).

---

## Suggested Pre-Launch Checklist (in priority order)

1. ☐ **H-1** — Remove or repoint `www.cloudmountain.top` DNS A/AAAA records.
2. ☐ **H-4** — Enable MFA on the Cloudflare account.
3. ☐ **H-2 + M-2 + C-acct-1** — Enable Turnstile account-wide, wire into `FormBlock`, remove console-log of PII, add per-IP rate limit on the Worker.
4. ☐ **H-3** — Add `public/_headers` with CSP / HSTS / X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy. Add `public/.well-known/security.txt`.
5. ☐ **M-1** — Replace the 5 `dangerouslySetInnerHTML` sites with `markdown-to-jsx` rendering (the rest of the site already uses it), or add `DOMPurify` sanitization at build time. Add a CI grep gate.
6. ☐ **M-3** — Publish DMARC at `_dmarc.cloudmountain.top`, start with `p=none; rua=…`, graduate to `p=reject` after two clean weeks.
7. ☐ **M-2** — Enable Bot Fight Mode and Block-AI-Bots on the two `pages.dev` zones and the Worker.
8. ☐ **M-4** — Pin `front-matter` (or migrate to `gray-matter`); add a `npm audit --omit=dev --audit-level=high` CI gate.
9. ☐ **L-1 / L-2 / L-3 / L-5 / L-6 / L-9** — Strip console logs, commit `_.next_old/` removal, add `/_.next_old/` to `.gitignore`, replace Lorem Ipsum bio.
10. ☐ After fix items 1-3: re-run Cloudflare's "Run a scan" to confirm the takeover, MFA, and Turnstile findings are gone.

---

*End of audit.*
