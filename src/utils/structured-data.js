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
const SOCIAL_INSTAGRAM = 'https://www.instagram.com/cloud.mountain.ecotours/';
const SOCIAL_LINKEDIN = 'https://www.linkedin.com/company/cloud-mountain-sustainability/';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const BUSINESS_ID = `${SITE_URL}/#business`;

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
        foundingLocation: 'Lijiang, Yunnan, China',
        areaServed: [
            { '@type': 'Place', name: 'Lijiang, Yunnan, China' },
            { '@type': 'Place', name: 'Shangri-La, Yunnan, China' },
            { '@type': 'Place', name: 'Dali, Yunnan, China' },
            { '@type': 'Place', name: 'Kunming, Yunnan, China' }
        ],
        sameAs: [SOCIAL_INSTAGRAM, SOCIAL_LINKEDIN],
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

function businessNode() {
    return {
        '@type': ['TravelAgency', 'LocalBusiness', 'TouristInformationCenter'],
        '@id': BUSINESS_ID,
        name: SITE_NAME,
        alternateName: SITE_LEGAL_NAME,
        url: SITE_URL,
        image: LOGO_URL,
        logo: LOGO_URL,
        description: 'Sustainable small-group ecotours in Yunnan, China. Cultural, mountain, and birding experiences led by local guides.',
        priceRange: '$$',
        currenciesAccepted: 'USD, CNY',
        paymentAccepted: 'Cash, Bank Transfer, Credit Card',
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
        parentOrganization: { '@id': ORG_ID }
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
    }
    if (pricing) {
        node.offers = {
            '@type': 'Offer',
            '@id': url + '#offer',
            url: pricing.bookingUrl,
            price: pricing.lowestPrice,
            priceCurrency: pricing.currency,
            availability: 'https://schema.org/InStock',
            availabilityStarts: '2026-01-01',
            availabilityEnds: '2026-12-31',
            validFrom: '2026-01-01',
            priceValidUntil: '2026-12-31',
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

// Article — for blog posts (PostLayout)
function articleSchema(page) {
    if (page.__metadata?.modelName !== 'PostLayout') return null;
    const urlPath = page.__metadata?.urlPath || '/';
    const url = SITE_URL + urlPath + '/';
    const title = page.title || '';
    const description = page.excerpt || firstSentence(stripMarkdown(page.markdown_content || ''));
    const image = page.featuredImage?.url ? absoluteUrl(page.featuredImage.url) : null;
    const datePublished = page.date || null;
    const author = page.author?.name || 'Cloud Mountain';
    return {
        '@type': 'Article',
        '@id': url + '#article',
        headline: title,
        description,
        url,
        image,
        datePublished,
        dateModified: datePublished,
        inLanguage: 'en',
        author: { '@type': 'Person', name: author },
        publisher: { '@id': ORG_ID },
        isPartOf: { '@id': WEBSITE_ID },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url }
    };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function generateStructuredData(page, site) {
    const graph = [organizationNode(), websiteNode(), businessNode()];
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
