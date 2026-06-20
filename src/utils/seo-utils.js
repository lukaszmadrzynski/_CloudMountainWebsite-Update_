export function seoGenerateMetaTags(page, site) {
    let pageMetaTags = {};

    if (site.defaultMetaTags?.length) {
        site.defaultMetaTags.forEach((metaTag) => {
            pageMetaTags[metaTag.property] = metaTag.content;
        });
    }

    const seoTitle = seoGenerateTitle(page, site);
    const seoDescription = seoGenerateMetaDescription(page, site);
    const ogImage = seoGenerateOgImage(page, site);
    const domainUrl = site.env?.URL ? site.env.URL : null;
    const pageUrl = page.__metadata?.urlPath
        ? (domainUrl ? domainUrl + page.__metadata.urlPath : page.__metadata.urlPath)
        : null;
    const isPost = page.__metadata?.modelName === 'PostLayout';

    // Social preview image is 1200x630. The manifest in /scripts/ could be wired
    // in later for actual per-image dimensions; for now we hardcode 1200x630
    // because the default is that size and most crawlers (WhatsApp, Telegram,
    // Twitter, LinkedIn) accept a missing og:image:width/height but prefer it.
    pageMetaTags = {
        ...pageMetaTags,
        ...(seoTitle && { 'og:title': seoTitle }),
        ...(ogImage && { 'og:image': ogImage }),
        ...(ogImage && { 'og:image:width': '1200' }),
        ...(ogImage && { 'og:image:height': '630' }),
        ...(ogImage && { 'og:image:alt': seoTitle || 'Cloud Mountain' }),
        ...(seoDescription && { 'og:description': seoDescription }),
        ...(pageUrl && { 'og:url': pageUrl }),
        ...(domainUrl && { 'og:site_name': site.titleSuffix || 'Cloud Mountain' }),
        'og:type': isPost ? 'article' : 'website',
        // Twitter card — many crawlers (including some social apps) also read these
        'twitter:card': 'summary_large_image',
        ...(seoTitle && { 'twitter:title': seoTitle }),
        ...(seoDescription && { 'twitter:description': seoDescription }),
        ...(ogImage && { 'twitter:image': ogImage })
    };

    if (page.seo?.metaTags?.length) {
        page.seo?.metaTags.forEach((metaTag) => {
            pageMetaTags[metaTag.property] = metaTag.content;
        });
    }

    let metaTags = [];
    Object.keys(pageMetaTags).forEach((key) => {
        if (pageMetaTags[key] !== null && pageMetaTags[key] !== undefined) {
            metaTags.push({
                property: key,
                content: pageMetaTags[key],
                format: key.startsWith('og') || key === 'twitter:card' || key.startsWith('twitter:') ? 'property' : 'name'
            });
        }
    });

    return metaTags;
}

export function seoGenerateTitle(page, site) {
    let title = page.seo?.metaTitle ? page.seo?.metaTitle : page.title;
    if (site.titleSuffix && page.seo?.addTitleSuffix !== false) {
        title = `${title} - ${site.titleSuffix}`;
    }
    return title;
}

export function seoGenerateMetaDescription(page, site) {
    let metaDescription = null;
    // Blog posts use the exceprt as the default meta description
    if (page.__metadata.modelName === 'PostLayout') {
        metaDescription = page.excerpt;
    }
    // page metaDescription field overrides all others
    if (page.seo?.metaDescription) {
        metaDescription = page.seo?.metaDescription;
    }
    return metaDescription;
}

export function seoGenerateOgImage(page, site) {
    let ogImage = null;
    // Use the sites default og:image field
    if (site.defaultSocialImage) {
        ogImage = site.defaultSocialImage;
    }
    // Blog posts use the featuredImage as the default og:image
    if (page.__metadata.modelName === 'PostLayout') {
        if (page.featuredImage?.url) {
            ogImage = page.featuredImage.url;
        }
    }
    // page socialImage field overrides all others
    if (page.seo?.socialImage) {
        ogImage = page.seo?.socialImage;
    }

    // ogImage should use an absolute URL. social platforms (WhatsApp, Telegram,
    // Twitter, LinkedIn, Facebook) silently fail to render relative og:image URLs.
    const domainUrl = site.env?.URL ? site.env.URL : null;

    if (ogImage) {
        if (domainUrl) {
            return domainUrl + ogImage;
        } else {
            return ogImage;
        }
    }
    return null;
}
