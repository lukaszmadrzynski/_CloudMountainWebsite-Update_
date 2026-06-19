import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    // suppressHydrationWarning on the <html> element is the standard
    // workaround for React #418 in Next.js 15 + React 19. The error is
    // caused by Next.js injecting a <noscript data-n-css=""> element into
    // the server-rendered <head> that the client tree doesn't reproduce
    // identically (browser extensions can also mutate attributes on this
    // node). The cost of suppression is that we lose the ability to catch
    // real hydration bugs inside the <html>/<head>/<body> shell — none of
    // which are dynamic in this static-export site, so the trade is safe.
    <Html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <Head>
        {/* Preload the Roboto Slab woff2 files used by the site. next/font
            already preloads the active subset, but explicit preloads help
            pages like /partner/corporate/ that have text-heavy LCP — the
            font is in the critical render path and any delay shows up as
            a 4-7s LCP. The hash-based filenames are stable across builds
            because next/font uses content-addressable hashing. */}
        <link
          rel="preload"
          href="/_next/static/media/a88c13d5f58b71d4-s.p.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
      </Head>
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}