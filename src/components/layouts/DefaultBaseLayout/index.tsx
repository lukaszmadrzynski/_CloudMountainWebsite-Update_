import * as React from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import Header from '../../sections/Header';
import Footer from '../../sections/Footer';
import { seoGenerateTitle, seoGenerateMetaTags, seoGenerateMetaDescription } from '../../../utils/seo-utils';
import { generateStructuredData } from '../../../utils/structured-data';

export default function DefaultBaseLayout(props) {
    const { page, site } = props;

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
        console.log('[DefaultBaseLayout] site:', site);
        console.log('[DefaultBaseLayout] header:', site?.header);
        console.log('[DefaultBaseLayout] footer:', site?.footer);
    }

    const { enableAnnotations = true } = site;
    const pageMeta = page?.__metadata || {};
    let title = seoGenerateTitle(page, site);
    let metaTags = seoGenerateMetaTags(page, site);
    let metaDescription = seoGenerateMetaDescription(page, site);

    // Canonical URL — every page gets one. Helps AI search engines and
    // traditional search dedupe the entity graph. urlPath is always normalized
    // (e.g. "/ecotours" or "/yunnan-four-kingdoms-ecotour/") so we can stitch
    // it onto site.env.URL without worrying about trailing slashes — we
    // always add a trailing slash to be consistent with sitemap.xml.
    const domainUrl = site?.env?.URL || 'https://cloudmountain.top';
    const urlPath = pageMeta?.urlPath || '/';
    const canonicalPath = urlPath === '/' ? '/' : (urlPath.endsWith('/') ? urlPath : urlPath + '/');
    const canonicalUrl = domainUrl.replace(/\/$/, '') + canonicalPath;

    // JSON-LD structured data — emits Organization + WebSite + LocalBusiness
    // site-wide, plus per-page nodes (TouristAttraction for tours, FAQPage
    // when an FAQ section is present, BreadcrumbList on every non-home page,
    // Article for blog posts). Single <script type="application/ld+json"> tag
    // with @graph containing all nodes. See src/utils/structured-data.js.
    const structuredData = generateStructuredData(page, site);
    const structuredDataJson = JSON.stringify(structuredData);
    return (
        <div className={classNames('sb-page', pageMeta.pageCssClasses)} {...(enableAnnotations && { 'data-sb-object-id': pageMeta.id })}>
            <div className="sb-base sb-default-base-layout">
                <Head>
                    <title>{title}</title>
                    {metaDescription && <meta name="description" content={metaDescription} />}
                    {metaTags.map((metaTag) => {
                        if (metaTag.format === 'property') {
                            // OpenGraph meta tags (og:*) should be have the format <meta property="og:…" content="…">
                            return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                        }
                        return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                    })}
                    <link rel="canonical" href={canonicalUrl} />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {site.favicon && <link rel="icon" href={site.favicon} />}
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <meta name="theme-color" content="#1f3a2e" />
                    {/* JSON-LD structured data for AI/LLM discoverability. */}
                    <script
                        type="application/ld+json"
                        // The JSON is built from a fixed in-memory graph (no
                        // user input) so dangerouslySetInnerHTML is safe.
                        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
                    />
                </Head>
                {site.header && <Header {...site.header} enableAnnotations={enableAnnotations} />}
                {props.children}
                {site.footer && <Footer {...site.footer} enableAnnotations={enableAnnotations} />}
            </div>
        </div>
    );
}
