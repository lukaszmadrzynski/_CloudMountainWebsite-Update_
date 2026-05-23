// pages/_app.js

import { Inter, Roboto_Slab } from 'next/font/google';
import Script from 'next/script'; // <<<<<< 1. ADD THIS IMPORT
import '../css/main.css';

// Configure Inter font (No changes here)
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// Configure Roboto Slab font (No changes here)
const roboto_slab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto-slab',
});

export default function MyApp({ Component, pageProps }) {
  // <<<<<< 2. DEFINE YOUR MEASUREMENT ID
  const GA_MEASUREMENT_ID = 'G-JG1RTRLGQJ';

  return (
    // <<<<<< 3. WRAP EVERYTHING IN A FRAGMENT (<> ... </>)
    <>
      {/*
        ADD THE GOOGLE ANALYTICS SCRIPTS HERE
        They are placed outside your main div so they don't interfere with your styling.
      */}
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

      {/* This is your existing code. No changes needed here. */}
      <div className={`${inter.variable} ${roboto_slab.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
