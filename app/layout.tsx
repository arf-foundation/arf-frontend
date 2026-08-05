import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono, Newsreader } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import NavBar from '../components/NavBar';
import ChatWidget from '../components/ChatWidget';
import './globals.css';

/* ----------------------------------------------------------------------------
   Type system — three families, one job each.
   Instrument Sans : all UI + headlines (holds tight tracking at display sizes)
   Newsreader      : the pull quote only — one editorial moment, not decoration
   JetBrains Mono  : eyebrows, labels, code — technical signal without a dark UI
   next/font self-hosts these, so no external font origin is needed and the
   CSP's font-src stays untouched.
--------------------------------------------------------------------------- */
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://arf-ai.com'),
  title: {
    default: 'ARF AI – Enterprise infrastructure for autonomous AI',
    template: '%s | ARF AI',
  },
  description:
    'Safely deploy autonomous AI in production with deterministic governance, continuous reliability, and enterprise-grade auditability.',
  keywords: [
    'AI governance',
    'enterprise AI infrastructure',
    'autonomous AI control plane',
    'deterministic policy enforcement',
    'AI reliability',
    'decision governance',
    'audit trails',
    'risk management',
    'AI operations',
  ],
  authors: [{ name: 'Juan Petter', url: 'https://www.linkedin.com/in/juan-petter' }],
  creator: 'ARF Foundation',
  publisher: 'ARF Foundation',
  robots: 'index, follow',
  openGraph: {
    title: 'ARF AI – Enterprise infrastructure for autonomous AI',
    description:
      'Safely deploy autonomous AI in production with deterministic governance, continuous reliability, and enterprise-grade auditability.',
    url: 'https://arf-ai.com',
    siteName: 'ARF AI',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ARF AI Governance Console' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARF AI – Enterprise infrastructure for autonomous AI',
    description: 'Deterministic governance for autonomous AI. Enterprise‑grade auditability.',
    creator: '@arf_foundation',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ARF AI',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0d12' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ colorScheme: 'light dark' }}
      className={`${instrumentSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function makeSafe(original, methodName) {
                  return function() {
                    if (window === window.parent) {
                      return original ? original.apply(this, arguments) : Promise.reject(new Error(methodName + ' not available'));
                    } else {
                      return Promise.reject(new DOMException(
                        methodName + ' is only allowed in top-level browsing contexts',
                        'InvalidStateError'
                      ));
                    }
                  };
                }

                if (typeof navigator !== 'undefined') {
                  if (navigator.getInstalledRelatedApps) {
                    navigator.getInstalledRelatedApps = makeSafe(navigator.getInstalledRelatedApps, 'getInstalledRelatedApps');
                  } else {
                    navigator.getInstalledRelatedApps = makeSafe(null, 'getInstalledRelatedApps');
                  }

                  if (navigator.getInstalledApps) {
                    navigator.getInstalledApps = makeSafe(navigator.getInstalledApps, 'getInstalledApps');
                  } else {
                    navigator.getInstalledApps = makeSafe(null, 'getInstalledApps');
                  }
                }

                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason && event.reason.message && (
                    event.reason.message.includes('getInstalledRelatedApps') ||
                    event.reason.message.includes('getInstalledApps')
                  )) {
                    event.preventDefault();
                    console.debug('Ignored ' + event.reason.message);
                  }
                });

                // Blocking theme init — CSP allows 'unsafe-inline' for scripts
                // here, so this runs before first paint and removes the
                // one-frame flash of the wrong theme that a client-effect-only
                // toggle (NavBar) would otherwise cause on load.
                try {
                  var stored = localStorage.getItem('arf-theme');
                  var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-arf-dark focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main">{children}</main>
        <ChatWidget />
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
