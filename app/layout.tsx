import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import NavBar from '../components/NavBar';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://arf-frontend-sandy.vercel.app'),
  title: {
    default: 'Agentic Reliability Framework (ARF) – Governance for AI Systems',
    template: '%s | ARF',
  },
  description:
    'ARF is a governance layer for AI systems. The core engine is access‑controlled and offered to qualified pilots under outcome‑based pricing.',
  keywords: [
    'AI reliability',
    'self-healing systems',
    'AI governance',
    'pilot program',
    'access control',
    'Bayesian inference',
    'cloud governance',
    'enterprise AI',
  ],
  authors: [{ name: 'Juan Petter', url: 'https://www.linkedin.com/in/juan-petter' }],
  creator: 'ARF Foundation',
  publisher: 'ARF Foundation',
  robots: 'index, follow',
  openGraph: {
    title: 'ARF – Agentic Reliability Framework',
    description:
      'Stewarded, pilot‑first reliability framework for AI systems. Core engine is access‑controlled.',
    url: 'https://arf-frontend-sandy.vercel.app',
    siteName: 'ARF',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ARF Dashboard Preview' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARF – Agentic Reliability Framework',
    description: 'Access‑controlled governance for cloud infrastructure.',
    creator: '@arf_foundation',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ARF',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
      <body className="min-h-screen bg-gray-100">
        <NavBar />
        {/* No background – grid fully visible, cards remain solid via globals.css */}
        <div className="relative z-10 backdrop-blur-sm">
          <main>{children}</main>
        </div>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
