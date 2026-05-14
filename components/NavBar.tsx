'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

/**
 * Responsive navigation bar for ARF.
 * On screens below 768px (md), links collapse into a hamburger menu.
 * The logo and "Request Pilot Access" CTA remain always visible.
 * Accessibility: menu button uses aria-expanded and aria-controls.
 */
export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-gray-800 text-white shadow-md" aria-label="Main navigation">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo — always visible */}
        <Link
          href="/"
          className="font-bold hover:underline whitespace-nowrap text-lg"
        >
          ARF
        </Link>

        {/* Desktop links: visible md and up */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="hover:underline text-sm">Dashboard</Link>
          <Link href="/history" className="hover:underline text-sm">History</Link>
          <Link href="/changelog" className="hover:underline text-sm">Changelog</Link>
          <Link href="/faq" className="hover:underline text-sm">FAQ</Link>
          <Link href="/pricing" className="hover:underline text-sm font-medium text-blue-400">
            Access Models
          </Link>
          <a
            href="https://github.com/arf-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-sm"
          >
            Spec
          </a>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition ml-2 whitespace-nowrap"
          >
            Request Pilot Access
          </Link>
        </div>

        {/* Mobile: CTA + hamburger button */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap"
          >
            Pilot Access
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 border-t border-gray-700' : 'max-h-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          <Link
            href="/dashboard"
            className="block px-4 py-3 rounded-md hover:bg-gray-700 transition text-sm"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            className="block px-4 py-3 rounded-md hover:bg-gray-700 transition text-sm"
            onClick={closeMenu}
          >
            History
          </Link>
          <Link
            href="/changelog"
            className="block px-4 py-3 rounded-md hover:bg-gray-700 transition text-sm"
            onClick={closeMenu}
          >
            Changelog
          </Link>
          <Link
            href="/faq"
            className="block px-4 py-3 rounded-md hover:bg-gray-700 transition text-sm"
            onClick={closeMenu}
          >
            FAQ
          </Link>
          <Link
            href="/pricing"
            className="block px-4 py-3 rounded-md hover:bg-gray-700 transition text-sm font-medium text-blue-400"
            onClick={closeMenu}
          >
            Access Models
          </Link>
          <a
            href="https://github.com/arf-foundation"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 rounded-md hover:bg-gray-700 transition text-sm"
            onClick={closeMenu}
          >
            Spec
          </a>
        </div>
      </div>
    </nav>
  );
}
