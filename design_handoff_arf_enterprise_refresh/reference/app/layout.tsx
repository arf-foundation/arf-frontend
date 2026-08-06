import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Newsreader, JetBrains_Mono } from 'next/font/google';
import NavBar from '../components/NavBar';
import './globals.css';

/* ----------------------------------------------------------------------------
   Type system — three families, one job each.
   Instrument Sans : all UI + headlines (holds tight tracking at display sizes)
   Newsreader      : the pull quote only — one editorial moment, not decoration
   JetBrains Mono  : eyebrows, labels, code — technical signal without a dark UI
   next/font self-hosts these, so no external font origin is needed and the
   strict CSP in next.config.ts stays untouched.
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
    default: 'ARF AI — Enterprise infrastructure for autonomous AI',
    template: '%s · ARF AI',
  },
  description:
    'Safely deploy autonomous AI in production with deterministic governance, continuous reliability, and enterprise-grade auditability.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    siteName: 'ARF AI',
    title: 'ARF AI — Enterprise infrastructure for autonomous AI',
    description:
      'The control plane between autonomous AI and enterprise infrastructure: deterministic policy, managed risk, verifiable audit trails.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0d12' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* No inline theme script: the CSP forbids unsafe-inline, so the theme class
       is applied by NavBar's client effect. `color-scheme` keeps native form
       controls and scrollbars correct before hydration. */
    <html
      lang="en"
      suppressHydrationWarning
      style={{ colorScheme: 'light dark' }}
      className={`${instrumentSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-arf-dark focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
