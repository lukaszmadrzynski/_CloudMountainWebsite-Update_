import { Roboto_Slab } from 'next/font/google';
import Script from 'next/script';
import '../css/main.css';

// Configure Roboto Slab font (the serif headline font per style.json).
// `display: 'optional'` (vs the typical 'swap') means the browser only
// uses Roboto Slab if it loads within ~100ms; otherwise the fallback
// font stays for the page's lifetime. Trade-off: users on slow
// connections see the fallback serif (no CLS) instead of a swap that
// reflows every heading on the page (huge CLS).
const roboto_slab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'optional',
  variable: '--font-roboto-slab',
});

// Cloudflare Turnstile note: the script is NOT loaded globally here. Each form
// loads its own copy via per-form <Script onLoad> in FormBlock (see
// src/components/blocks/FormBlock/index.tsx). This used to be a single global
// loader, but it had a timing race where on some pages (e.g. /book) the form's
// render() call fired before the global script finished loading. Per-form load
// fires onLoad exactly when each form's widget is ready to render. The widget
// only renders when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set in the env.

export default function MyApp({ Component, pageProps }) {
  const GA_MEASUREMENT_ID = 'G-JG1RTRLGQJ';

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {/* Cloudflare Turnstile - bot protection on the contact/booking forms.
          Loaded per-form by FormBlock (<Script onLoad>). Previously this was a
          single global script here, but on some pages (e.g. /book) the global
          load had timing issues where FormBlock's render() raced with the
          script's injection. Per-form load with onLoad callback is more
          reliable because the widget renders immediately when its own form
          mounts and the onLoad fires only after the script is ready.
          `?render=explicit` disables Turnstile's DOM auto-scan, so we MUST
          call window.turnstile.render() ourselves. */}
      <div className={roboto_slab.variable}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
