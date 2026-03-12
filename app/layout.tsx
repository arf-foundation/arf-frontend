import type { Metadata } from 'next';
import Link from 'next/link';               // ← Added for client‑side navigation
import './globals.css';

export const metadata: Metadata = {
  title: 'ARF Dashboard',
  description: 'Agentic Reliability Framework Frontend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {/* 
          Navbar – now using Next.js Link for internal routes (faster, no full reload)
          External documentation link opens in a new tab with security attributes.
        */}
        <nav className="bg-gray-800 text-white shadow-md" aria-label="Main navigation">
          <div className="container mx-auto flex items-center gap-6 p-4">
            <Link href="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded">
              Dashboard
            </Link>
            <Link href="/history" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded">
              History
            </Link>
            <a
              href="https://arf-foundation.github.io/arf-spec/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              Documentation
            </a>
          </div>
        </nav>

        {/* Page content */}
        <main>{children}</main>
      </body>
    </html>
  );
}