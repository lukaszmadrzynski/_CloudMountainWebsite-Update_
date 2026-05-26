import { Inter, Roboto_Slab } from 'next/font/google';
import Script from 'next/script';
import '../css/main.css';

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// Configure Roboto Slab font
const roboto_slab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto-slab',
});

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
      <div className={`${inter.variable} ${roboto_slab.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
