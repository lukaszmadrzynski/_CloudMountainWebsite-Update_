import { Roboto_Slab } from 'next/font/google';
import Script from 'next/script';
import '../css/main.css';

// Configure Roboto Slab font (the serif headline font per style.json)
const roboto_slab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto-slab',
});

// Cloudflare Turnstile site key. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in
// Cloudflare Pages > Project Settings > Environment variables, and in .env.local
// for local dev. The widget only renders when this is set, so dev/preview builds
// without the env var will skip Turnstile (form still works, just no bot protection).
const TURNSTILE_SITE_KEY = '0x4AAAAAADnCjXKlhofBqKD5'; // HARDCODED — Cloudflare Pages env var injection is broken; site key is public anyway

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
          Loaded once globally; FormBlock renders the actual widget div per form.
          script is a no-op if TURNSTILE_SITE_KEY is empty. */}
      {true && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          async
          defer
        />
      )}
      <div className={roboto_slab.variable}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
