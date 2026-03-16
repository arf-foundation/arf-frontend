import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARF – Agentic Reliability Framework',
  description: 'Bayesian governance for agentic systems',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <nav className="bg-gray-800 text-white shadow-md" aria-label="Main navigation">
          <div className="container mx-auto flex items-center gap-6 p-4">
            <Link href="/" className="font-bold hover:underline">ARF</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/history" className="hover:underline">History</Link>
            <a
              href="https://arf-foundation.github.io/arf-spec/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Spec
            </a>
            <a
              href="https://arf-foundation.github.io/arf-spec/enterprise/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Start‑ups
            </a>
            <a
              href="https://arf-foundation.github.io/arf-spec/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline ml-auto"
            >
              Documentation
            </a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
