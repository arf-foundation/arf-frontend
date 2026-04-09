import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://arf-frontend-sandy.vercel.app'),
  title: {
    default: 'Agentic Reliability Framework (ARF) – AI Reliability & Self‑Healing Control Plane',
    template: '%s | ARF',
  },
  description: 'Turn probabilistic AI into deterministic, auditable action. Reduce MTTR by up to 85% with self‑healing systems powered by Bayesian governance.',
  keywords: ['AI reliability', 'self-healing systems', 'AI governance', 'agent orchestration', 'production AI', 'SRE automation', 'Bayesian inference', 'cloud governance'],
  authors: [{ name: 'Juan Petter', url: 'https://www.linkedin.com/in/juan-petter' }],
  creator: 'ARF Foundation',
  publisher: 'ARF Foundation',
  robots: 'index, follow',
  openGraph: {
    title: 'ARF – Agentic Reliability Framework',
    description: 'Auditable cloud governance powered by Bayesian intelligence.',
    url: 'https://arf-frontend-sandy.vercel.app',
    siteName: 'ARF',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ARF Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARF – Agentic Reliability Framework',
    description: 'Bayesian governance for cloud infrastructure.',
    creator: '@arf_foundation',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ARF',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-gray-100">
        <nav className="bg-gray-800 text-white shadow-md" aria-label="Main navigation">
          <div className="container mx-auto flex items-center justify-between gap-6 p-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold hover:underline">ARF</Link>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/history" className="hover:underline">History</Link>
              <Link href="/changelog" className="hover:underline">Changelog</Link>
              <Link href="/faq" className="hover:underline">FAQ</Link>
              <Link href="/pricing" className="hover:underline font-medium text-blue-400">Pricing</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Sign Up
              </Link>
              <a
                href="https://arf-foundation.github.io/arf-spec/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-sm"
              >
                Docs
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
