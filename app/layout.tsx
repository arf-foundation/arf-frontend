import type { Metadata } from 'next';
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
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex gap-6">
            <a href="/" className="hover:underline">Dashboard</a>
            <a href="/history" className="hover:underline">History</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
