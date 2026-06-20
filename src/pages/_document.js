import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
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
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}