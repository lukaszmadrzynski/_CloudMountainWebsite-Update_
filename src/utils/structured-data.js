// src/utils/structured-data.js
//
// JSON-LD structured data for AI/LLM discoverability.
//
// LLMs (ChatGPT, Perplexity, Claude, Google AI Overviews) and AI-search engines
// (You.com, Phind, Bing Chat) lean heavily on schema.org JSON-LD to understand
// what a page is, who offers it, what it costs, and what questions it answers.
// Pages without JSON-LD are at a disadvantage for AI recommendations.
//
// Conventions:
//  - All schema is wrapped in @graph so we can put multiple @types on a single
//    page in one <script> tag. Reduces DOM noise vs one script per @type.
//  - Site-wide nodes (Organization, WebSite, LocalBusiness) are emitted on
//    every page so the entity graph is connected from any URL.
//  - Per-page nodes (TouristAttraction, FAQPage, Article, BreadcrumbList) are
//    added on top, based on page type.
//  - All nodes use stable @id URLs (https://cloudmountain.top/#...) so LLM
//    crawlers can deduplicate across pages.
//
// This file is consumed by DefaultBaseLayout (site-wide + per-page) and by
// PostLayout (Article). The function `generateStructuredData(page, site)`
// returns the @graph array; the layout is responsible for serializing it
// into a single <script type="application/ld+json"> tag.

const SITE_NAME = 'Cloud Mountain';
const SITE_LEGAL_NAME = 'Lijiang Cloud Mountain Education Consulting Co. Ltd.';
const SITE_URL = 'https://cloudmountain.top';
const LOGO_URL = 'https://cloudmountain.top/images/shared/brand/cm-logo-color.png';

// All verified brand profiles used in sameAs arrays. Edit this list when a
// new official channel is opened. Unknown / unverified URLs are deliberately
// omitted — schema validators reject dead sameAs entries.
const SOCIAL_INSTAGRAM = 'https://www.instagram.com/cloud.mountain.ecotours/';
const SOCIAL_LINKEDIN  = 'https://www.linkedin.com/company/cloud-mountain-sustainability/';
const SOCIAL_YOUTUBE   = 'https://www.youtube.com/channel/UCAXEBGgeC7H_BqcGAE2Z35Q';
const SOCIAL_FACEBOOK  = 'https://www.facebook.com/cloud.mountain.lijiang';
const SOCIAL_X         = 'https://x.com/_CloudMountain_';
const SOCIAL_GITHUB    = 'https://github.com/lukaszmadrzynski';
const TRIPADVISOR_URL  = 'https://www.tripadvisor.com/Attraction_Review-g303783-d17638375-Reviews-Lijiang_Cloud_Mountain_Ecotours-Lijiang_Yunnan.html';

const ORG_ID    = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BUSINESS_ID = `${SITE_URL}/#business`;
const LUKAS_ID  = `${SITE_URL}/#lukas`;
const LYNNE_ID  = `${SITE_URL}/#lynne`;
const NATUREFORALL_ID = `${SITE_URL}/#natureforall`;

// Lijiang Old Town approximate centroid — used for `geo` and per-tour
// `contentLocation`. Verified against Google Maps.
const LIJIANG_LAT = 26.8721;
const LIJIANG_LON = 100.2254;

// IUCN #NatureForAll — global initiative connecting people with nature via
// storytelling, communications, and partnership programs. Cloud Mountain is
// officially listed as a partner organization (see content/pages/why-us.md
// "Collaboration & Partnerships" section, lines 644-645). The primary URL
// points to the IUCN programme landing page; the knowledge hub is exposed
// via `sameAs` for entity-graph deduplication. Verify the IUCN URL with
// Lukas before relying on it for SEO/AI citation accuracy.
const IUCN_NATUREFORALL_URL = 'https://www.iucn.org/our-work/initiatives/natureforall';
const NATUREFORALL_HUB_URL  = 'https://natureforall.global/';

function getSocialSameAs() {
    // Single source of truth for the brand's verified profile URLs.
    // Used by both Organization and LocalBusiness so the two @graph nodes
    // stay perfectly aligned.
    return [
        SOCIAL_INSTAGRAM,
        SOCIAL_LINKEDIN,
        SOCIAL_YOUTUBE,
        SOCIAL_FACEBOOK,
        SOCIAL_X,
        SOCIAL_GITHUB,
        TRIPADVISOR_URL
    ];
}

// Target keywords for SEO and AI-search discoverability. The head terms
// + mid-tail we want to rank for. Long-tail variations (best time Yunnan,
// tour price, etc.) are answered in FAQPage schema on each tour page.
// Keep in sync with `llms.txt` and `llms-full.txt`.
//
// Spelling variants: many people type "eco tours" (two words) or "eco-tours"
// (hyphenated) instead of "ecotours" (one word). All three forms are
// included so the schema.org keywords field covers every common spelling.
const SITE_KEYWORDS = [
    'Yunnan ecotours', 'Yunnan eco tours', 'Yunnan eco-tours',
    'Yunnan tours', 'Yunnan guide', 'Yunnan tour guide',
    'Yunnan local guide', 'Lijiang tours', 'Lijiang tour guide',
    'Shangri-La tours', 'Shangri-La tour', 'Dali tours', 'Kunming tours',
    'small group tours Yunnan', 'sustainable tourism Yunnan',
    'cultural tours Yunnan', 'Yunnan cultural heritage', 'Yunnan birding',
    'Yunnan endemic birding', 'Meili Snow Mountain tour', 'Kawagebo tour',
    'Tiger Leaping Gorge trek', 'Tea Horse Road tour', 'Naxi cultural tour',
    'Naxi heritage tour', 'Tibetan cultural tour Yunnan',
    'Bai cultural tour Dali', 'Jade Dragon Snow Mountain',
    'Yunnan small group travel', 'Yunnan private tour', 'China ecotours',
    'China eco tours', 'Yunnan travel guide', 'best time visit Yunnan',
    'sustainable travel China', 'Yunnan trekking', 'Yunnan hiking',
    'Yunnan 7 day tour',
    // Spelling variants for "ecotour(s)" - singular + hyphenated forms
    'ecotours', 'eco tours', 'eco-tours',
    'ecotour', 'eco tour', 'eco-tour',
    'Yunnan ecotour', 'Yunnan eco tour', 'Yunnan eco-tour',
    'responsible tourism Yunnan'
];

// Strip simple markdown wrappers from a string. Used to turn "*Price:* $1,776"
// into "Price: $1,776" before stuffing it into schema fields.
function stripMarkdown(s) {
    if (!s) return '';
    return String(s)
        .replace(/\*\*(.+?)\*\*/g, '$1')   // bold
        .replace(/\*(.+?)\*/g, '$1')        // italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
        .replace(/`([^`]+)`/g, '$1')        // code
        .replace(/\r/g, '')
        .replace(/\n+/g, ' ')
        .trim();
}

// First sentence of a longer string — used for description fallbacks.
function firstSentence(s, max = 200) {
    if (!s) return '';
    const cleaned = stripMarkdown(s);
    const m = cleaned.match(/^[^.!?]+[.!?]/);
    const out = m ? m[0] : cleaned;
    return out.length > max ? out.slice(0, max - 1) + '…' : out;
}

// Strip HTML tags for plain-text schema fields (e.g. description).
function stripHtml(s) {
    if (!s) return '';
    return String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Absolute URL helper. If the input is already absolute, returns as-is.
// Otherwise prefixes with the canonical site URL.
function absoluteUrl(maybePath) {
    if (!maybePath) return null;
    if (/^https?:\/\//i.test(maybePath)) return maybePath;
    if (maybePath.startsWith('/')) return SITE_URL + maybePath;
    return SITE_URL + '/' + maybePath;
}

// ---------------------------------------------------------------------------
// Site-wide nodes (on every page)
// ---------------------------------------------------------------------------

function organizationNode() {
    return {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: SITE_NAME,
        alternateName: SITE_LEGAL_NAME,
        legalName: SITE_LEGAL_NAME,
        url: SITE_URL,
        logo: LOGO_URL,
        description: 'Cloud Mountain is a small, locally-run ecotour company based in Lijiang, Yunnan, China. We design and lead small-group (2-6 guests) sustainable experiences across northwest Yunnan.',
        keywords: SITE_KEYWORDS.join(', '),
        foundingLocation: 'Lijiang, Yunnan, China',
        areaServed: [
            { '@type': 'Place', name: 'Lijiang, Yunnan, China' },
            { '@type': 'Place', name: 'Shangri-La, Yunnan, China' },
            { '@type': 'Place', name: 'Dali, Yunnan, China' },
            { '@type': 'Place', name: 'Kunming, Yunnan, China' }
        ],
        // Founders as Person nodes — emit them on the Organization's own
        // founder field so the entity graph is anchored from any page.
        founder: [
            { '@id': `${SITE_URL}/#lukas` },
            { '@id': `${SITE_URL}/#lynne` }
        ],
        // Partnership / affiliation declarations. `affiliation` is the
        // schema.org property for partner organizations. For formal
        // membership, also add to `memberOf`. Cloud Mountain is an official
        // partner of the IUCN Task Force on Nature Education and a member
        // of the global #NatureForAll initiative — referenced from
        // content/pages/why-us.md (lines 644-645).
        affiliation: [
            { '@id': NATUREFORALL_ID }
        ],
        sameAs: getSocialSameAs(),
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'contact@cloudmountain.top',
                availableLanguage: ['English', 'Chinese'],
                areaServed: 'Worldwide'
            },
            {
                '@type': 'ContactPoint',
                contactType: 'sales',
                name: 'Lynne Lyu',
                email: 'lynne@cloudmountain.top',
                telephone: '+86-19813252518',
                availableLanguage: ['English', 'Chinese']
            },
            {
                '@type': 'ContactPoint',
                contactType: 'sales',
                name: 'Lukasz Madrzynski',
                email: 'lukas@cloudmountain.top',
                telephone: '+86-18687958551',
                availableLanguage: ['English']
            }
        ]
    };
}

function websiteNode() {
    return {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'en',
        publisher: { '@id': ORG_ID }
    };
}

function businessNode(site) {
    // `site` comes from content/data/site.json, which supplies the single
    // source of truth for TripAdvisor aggregate rating data. If the file
    // is missing the reviews block we fall back to omitting aggregateRating
    // (better than emitting stale numbers).
    const reviews = site?.reviews || null;

    const node = {
        '@type': ['TravelAgency', 'LocalBusiness', 'TouristInformationCenter'],
        '@id': BUSINESS_ID,
        name: SITE_NAME,
        alternateName: SITE_LEGAL_NAME,
        url: SITE_URL,
        image: LOGO_URL,
        logo: LOGO_URL,
        keywords: SITE_KEYWORDS.join(', '),
        description: 'Sustainable small-group ecotours in Yunnan, China. Cultural, mountain, and birding experiences led by local guides.',
        priceRange: '$$',
        currenciesAccepted: 'USD, CNY',
        paymentAccepted: 'Cash, Bank Transfer, Credit Card',
        // Local SEO signal — Google Maps tie-in. Use Lijiang Old Town centroid.
        geo: {
            '@type': 'GeoCoordinates',
            latitude: LIJIANG_LAT,
            longitude: LIJIANG_LON
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lijiang',
            addressRegion: 'Yunnan',
            addressCountry: 'CN'
        },
        areaServed: [
            { '@type': 'AdministrativeArea', name: 'Yunnan, China' },
            { '@type': 'City', name: 'Lijiang' },
            { '@type': 'City', name: 'Shangri-La' },
            { '@type': 'City', name: 'Dali' },
            { '@type': 'City', name: 'Kunming' }
        ],
        sameAs: getSocialSameAs(),
        founder: [
            { '@id': LUKAS_ID },
            { '@id': LYNNE_ID }
        ],
        parentOrganization: { '@id': ORG_ID }
    };

    if (reviews && reviews.ratingValue && reviews.reviewCount) {
        // Single biggest AI-citable trust signal — Perplexity, Claude, and
        // Google AI Overviews all weight `aggregateRating` heavily.
        node.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: reviews.ratingValue,
            reviewCount: reviews.reviewCount,
            bestRating: reviews.bestRating || 5,
            worstRating: reviews.worstRating || 1,
            description: `${reviews.source || 'TripAdvisor'} rating as of ${reviews.asOf || 'today'}`,
            url: reviews.url || TRIPADVISOR_URL
        };
    }

    return node;
}

// ---------------------------------------------------------------------------
// Founder Person nodes (Lukasz + Lynne) — emitted on every page so the
// entity graph is anchored from any URL. AI crawlers use these to
// disambiguate the company from similarly named operators and to attribute
// claims (PhD from UNEP-Tongji, 2024 IUCN-CEC Asia Award, etc.).
// ---------------------------------------------------------------------------

function lukasNode() {
    return {
        '@type': 'Person',
        '@id': LUKAS_ID,
        name: 'Lukasz Madrzynski',
        givenName: 'Lukasz',
        familyName: 'Madrzynski',
        jobTitle: 'Co-founder & Nature Immersion Expert',
        worksFor: { '@id': ORG_ID },
        url: `${SITE_URL}/why-us/#meet-the-founders`,
        image: `${SITE_URL}/images/shared/presets/Lukas2.webp`,
        description: 'Co-founder of Cloud Mountain. PhD researcher at UNEP-Tongji Institute of Environment for Sustainable Development. Bachelor of Chinese Studies, Warsaw University. Member of the IUCN Commission on Education and Communication. Heritage Conservation Practitioner at UNESCO-WHITRAP. Senior Consultant at Lijiang Conservation and Development Association. 2024 IUCN-CEC Asia Award winner.',
        knowsAbout: [
            'Yunnan biodiversity',
            'Naxi cultural heritage',
            'Tiger Leaping Gorge ecology',
            'Sustainable tourism',
            'Meili Snow Mountain / Kawagebo',
            'UNESCO World Heritage conservation'
        ],
        knowsLanguage: ['en', 'pl', 'zh'],
        alumniOf: [
            { '@type': 'EducationalOrganization', name: 'UNEP-Tongji Institute of Environment for Sustainable Development', sameAs: 'https://unep-tongji.org/' },
            { '@type': 'EducationalOrganization', name: 'Warsaw University' }
        ],
        memberOf: [
            { '@type': 'Organization', name: 'IUCN Commission on Education and Communication', sameAs: 'https://www.iucn.org/commissions/commission-on-education-and-communication' },
            { '@type': 'Organization', name: 'UNESCO WHITRAP' }
        ],
        award: ['2024 IUCN-CEC Asia Award'],
        nationality: { '@type': 'Country', name: 'Poland' },
        sameAs: [
            'https://www.linkedin.com/in/lukaszmadrzynski/',
            'https://www.iucn.org/commissions/commission-on-education-and-communication',
            SOCIAL_GITHUB
        ]
    };
}

function lynneNode() {
    return {
        '@type': 'Person',
        '@id': LYNNE_ID,
        name: 'Lynne Lyu',
        givenName: 'Lynne',
        familyName: 'Lyu',
        jobTitle: 'Co-founder & Culture Immersion Expert',
        worksFor: { '@id': ORG_ID },
        url: `${SITE_URL}/why-us/#meet-the-founders`,
        image: `${SITE_URL}/images/shared/presets/Lynne2.webp`,
        description: 'Co-founder of Cloud Mountain. Deputy General Secretary at Lijiang Conservation and Development Association. Deputy Chief Editor of Lijiang Wenhai Ecotourism Guidebook and Lijiang Laojun Mountains Climate Change Brochure. Bachelor of Arts in Art Design (Anqing Normal University). Founder of Lynne玲 Art Studio.',
        knowsAbout: [
            'Naxi culture and Dongba pictographs',
            'Lijiang Old Town UNESCO heritage',
            'Wenhai wetlands conservation',
            'Sustainable tourism',
            'Yunnan cultural preservation'
        ],
        knowsLanguage: ['en', 'zh'],
        memberOf: [
            { '@type': 'Organization', name: 'Lijiang Conservation and Development Association' }
        ],
        nationality: { '@type': 'Country', name: 'China' }
        // No sameAs — Lynne does not currently maintain a public LinkedIn
        // presence (verified 2026-09-17). Don't fabricate; an empty array
        // would just add noise to the entity graph.
    };
}

// IUCN #NatureForAll — emitted on every page so AI agents can corroborate
// the partnership directly from the entity graph. The text on
// content/pages/why-us.md:644-645 declares Cloud Mountain "an official
// partner of the IUCN Task Force on Nature Education and a member of the
// global #natureforall initiative". This node makes that statement
// machine-readable.
function natureForAllNode() {
    return {
        '@type': ['Organization', 'NGO'],
        '@id': NATUREFORALL_ID,
        name: 'IUCN #NatureForAll',
        alternateName: 'NatureForAll',
        url: IUCN_NATUREFORALL_URL,
        description: 'IUCN global initiative connecting people with nature through storytelling, communications, and partnership programs. Cloud Mountain is an official partner organization of the IUCN Task Force on Nature Education and a member of the global #NatureForAll initiative.',
        parentOrganization: {
            '@type': 'Organization',
            name: 'International Union for Conservation of Nature (IUCN)',
            url: 'https://www.iucn.org/'
        },
        keywords: 'nature conservation, IUCN, #NatureForAll, education for nature, partnerships',
        sameAs: [
            NATUREFORALL_HUB_URL,
            IUCN_NATUREFORALL_URL,
            'https://twitter.com/hashtag/NatureForAll'
        ]
    };
}

// ---------------------------------------------------------------------------
// Per-page nodes
// ---------------------------------------------------------------------------

// BreadcrumbList — derives crumbs from page.urlPath + site header.
function breadcrumbNode(page) {
    const urlPath = page.__metadata?.urlPath || '/';
    if (urlPath === '/') return null;
    const items = [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL + '/'
        }
    ];
    const segments = urlPath.split('/').filter(Boolean);
    let acc = '';
    segments.forEach((seg, i) => {
        acc += '/' + seg;
        const label = seg
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        items.push({
            '@type': 'ListItem',
            position: i + 2,
            name: label,
            item: SITE_URL + acc + '/'
        });
    });
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items
    };
}

// WebPage — generic fallback for any page that doesn't get a richer type.
function webPageNode(page) {
    const urlPath = page.__metadata?.urlPath || '/';
    return {
        '@type': 'WebPage',
        '@id': SITE_URL + urlPath + '/#webpage',
        url: SITE_URL + urlPath + '/',
        name: page.title,
        description: page.seo?.metaDescription || firstSentence(stripMarkdown(page.text || '')),
        inLanguage: 'en',
        keywords: SITE_KEYWORDS.join(', '),
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORG_ID }
    };
}

// Find first section of a given modelName
function findSection(page, modelName) {
    return (page.sections || []).find(s => s.__metadata?.modelName === modelName);
}

// Find first FeaturedItem that has a hero image — for Tour schema image.
function findHeroImage(page) {
    const hero = findSection(page, 'HeroSection');
    if (hero?.media?.url) return absoluteUrl(hero.media.url);
    if (page.featuredImage?.url) return absoluteUrl(page.featuredImage.url);
    return null;
}

// Extract lowest price + currency from SimplifiedPricingSection
function extractPricing(page) {
    const sec = findSection(page, 'SimplifiedPricingSection');
    if (!sec?.plans || !Array.isArray(sec.plans)) return null;
    const prices = sec.plans
        .map(p => {
            if (typeof p.price !== 'string') return null;
            const n = parseInt(p.price.replace(/[^0-9]/g, ''), 10);
            return isNaN(n) ? null : n;
        })
        .filter(n => n !== null);
    if (prices.length === 0) return null;
    return {
        lowestPrice: Math.min(...prices),
        currency: 'USD',
        bookingUrl: absoluteUrl(sec.bookingUrl || sec.plans[sec.plans.length - 1]?.url || '/book'),
        plans: sec.plans.map(p => ({
            people: p.people,
            price: p.price,
            url: absoluteUrl(p.url)
        })),
        included: sec.included?.text ? stripMarkdown(sec.included.text) : null,
        notIncluded: sec.included?.notIncluded || null,
        meetingPoint: sec.included?.meetingPoint || null
    };
}

// TouristAttraction + Offer — for tour pages
function tourSchema(page) {
    const hero = findSection(page, 'HeroSection');
    const keyDetails = findSection(page, 'KeyDetailsSection');
    const pricing = extractPricing(page);
    if (!hero && !keyDetails) return null;

    const urlPath = page.__metadata?.urlPath || '/';
    const url = SITE_URL + urlPath + '/';
    const title = page.title || '';
    const description = page.seo?.metaDescription || firstSentence(stripMarkdown(page.text || ''));
    const image = findHeroImage(page);

    // Try to derive a "where" location from the KeyDetailsSection
    let location = null;
    if (keyDetails?.items) {
        const loc = keyDetails.items.find(i => (i.title || '').toLowerCase().includes('location'));
        if (loc) location = stripMarkdown(loc.subtitle || loc.highlight || '');
    }

    const node = {
        '@type': ['TouristAttraction', 'Tour'],
        '@id': url + '#tour',
        name: title,
        description,
        url,
        image,
        inLanguage: 'en',
        keywords: SITE_KEYWORDS.join(', '),
        touristType: ['Nature tourists', 'Cultural tourists', 'Adventure tourists', 'Bird watchers'],
        isAccessibleForFree: false,
        provider: { '@id': ORG_ID }
    };
    if (location) {
        node.address = {
            '@type': 'PostalAddress',
            addressRegion: 'Yunnan',
            addressCountry: 'CN',
            streetAddress: location
        };
        // Local SEO + Google Maps tie-in for the tour itself.
        node.contentLocation = {
            '@type': 'Place',
            name: location,
            address: node.address,
            // Coordinates are Lijiang-area approximate (the centroid is in
            // Old Town). If/when precise per-tour routes are mapped, swap
            // to a midpoint coordinate. Better to omit than to be wrong.
            geo: {
                '@type': 'GeoCoordinates',
                latitude: LIJIANG_LAT,
                longitude: LIJIANG_LON
            }
        };
    }
    if (pricing) {
        // Build-time dynamic dates so the schema doesn't claim expired offers
        // on January 1 of the next year. Generates the current calendar year
        // for the start window and next calendar year-end for the cutoff.
        const year = new Date().getUTCFullYear();
        const nextYear = year + 1;
        node.offers = {
            '@type': 'Offer',
            '@id': url + '#offer',
            url: pricing.bookingUrl,
            price: pricing.lowestPrice,
            priceCurrency: pricing.currency,
            availability: 'https://schema.org/InStock',
            availabilityStarts: `${year}-01-01`,
            availabilityEnds: `${nextYear}-12-31`,
            validFrom: `${year}-01-01`,
            priceValidUntil: `${nextYear}-12-31`,
            seller: { '@id': ORG_ID }
        };
    }
    return node;
}

// FAQPage — for pages with an AccordionSection
function faqSchema(page) {
    const acc = findSection(page, 'AccordionSection');
    if (!acc?.items || !Array.isArray(acc.items)) return null;
    const items = acc.items.filter(i => i.question && i.answer);
    if (items.length === 0) return null;
    return {
        '@type': 'FAQPage',
        mainEntity: items.map(i => ({
            '@type': 'Question',
            name: stripMarkdown(i.question),
            acceptedAnswer: {
                '@type': 'Answer',
                text: stripMarkdown(i.answer)
            }
        }))
    };
}

// BlogPosting — for blog posts (PostLayout)
// BlogPosting is richer than the generic Article type and is what Google
// AI Overviews surface preferentially for blog content. Author uses the
// Lukas Person @id when available so authorship is corroborated, not just
// declared as a name string.
function articleSchema(page) {
    if (page.__metadata?.modelName !== 'PostLayout') return null;
    const urlPath = page.__metadata?.urlPath || '/';
    const url = SITE_URL + urlPath + '/';
    const title = page.title || '';
    const description = page.excerpt || firstSentence(stripMarkdown(page.markdown_content || ''));
    const image = page.featuredImage?.url ? absoluteUrl(page.featuredImage.url) : null;
    const datePublished = page.date || null;
    // dateModified: if a modifiedAt/dateModified frontmatter field exists
    // upstream we use it; otherwise reuse datePublished (no point claiming
    // a modification that didn't happen).
    const dateModified = page.dateModified || page.modifiedAt || datePublished;
    return {
        '@type': 'BlogPosting',
        '@id': url + '#article',
        headline: title,
        description,
        url,
        image,
        datePublished,
        dateModified,
        inLanguage: 'en',
        // Authored by Lukas (the marketing lead) by default. Author profile
        // is fully anchored via Person @id so entity-graph parsers can
        // resolve it to the Organization + sameAs URLs.
        author: { '@id': LUKAS_ID },
        publisher: { '@id': ORG_ID },
        isPartOf: { '@id': WEBSITE_ID },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: page.category || 'Ecotourism',
        keywords: SITE_KEYWORDS.slice(0, 10).join(', ')
    };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function generateStructuredData(page, site) {
    const graph = [
        organizationNode(),
        websiteNode(),
        businessNode(site),
        lukasNode(),
        lynneNode(),
        natureForAllNode()
    ];
    const bc = breadcrumbNode(page);
    if (bc) graph.push(bc);
    graph.push(webPageNode(page));

    // Tour page?
    if (page.__metadata?.modelName === 'PageLayout') {
        const t = tourSchema(page);
        if (t) graph.push(t);
        const f = faqSchema(page);
        if (f) graph.push(f);
    }

    // Blog post?
    const a = articleSchema(page);
    if (a) graph.push(a);

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
}
