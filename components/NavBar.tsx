'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';

/* ----------------------------------------------------------------------------
   NavBar — 8 links + CTA reduced to 4 primary links + two buttons.
   Product / Docs / Pricing / Console are the only things a buyer needs before
   they talk to us. History, Changelog, FAQ, Spec and the community links live
   in the footer. "Whitepaper (soon)" is gone — we don't advertise what doesn't
   exist. Sign In is OUTLINED (a place you log into, WorkOS AuthKit later);
   Request Pilot Access stays the single filled CTA.

--------------------------------------------------------------------------- */

const PRIMARY_LINKS = [
  { label: 'Product', href: '/#capabilities' },
  { label: 'Docs', href: '/faq' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Console', href: '/dashboard' },
] as const;

type Theme = 'light' | 'dark';

export default function NavBar() {
  // Lazy initializer instead of an effect: layout.tsx's blocking inline
  // script already applies `.dark` to <html> before this component hydrates
  // (CSP here allows 'unsafe-inline', so that script can run pre-paint), so
  // reading the class back here is a synchronous read of already-settled
  // DOM state, not a guess to correct later — no set-state-in-effect, and no
  // one-frame icon flash while an effect would otherwise catch up.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    // Decide from the real DOM class, not the `theme` state variable. If
    // React's initial read of that class (in the lazy initializer above)
    // ever raced the pre-hydration blocking script and landed on the wrong
    // value, deciding from `theme` would make the first click "correct" the
    // mismatch instead of doing what was clicked — the class flips, but not
    // to where the user expects — and only the second click, now reading a
    // `theme` that finally matches reality, does the intended toggle. Sourcing
    // the decision from the DOM itself removes the possibility of that
    // divergence entirely; `theme` still drives the icon, nothing else.
    const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    setTheme(next);
    try {
      window.localStorage.setItem('arf-theme', next);
    } catch {
      /* storage unavailable — the toggle still works for this session */
    }
  };

  return (
    <header className="arf-page-root sticky top-0 z-40 border-b border-[color:var(--hairline)] bg-[color:var(--surface-canvas)]/85 backdrop-blur-md">
      <div className="arf-shell flex h-[74px] items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3" aria-label="ARF AI home">
          <span className="h-[22px] w-[22px] rounded-md bg-gradient-to-br from-arf-blue to-arf-purple" />
          <span className="text-base font-semibold tracking-[-0.02em]">ARF AI</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {PRIMARY_LINKS.map((link) =>
            'external' in link && link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14.5px] font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14.5px] font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--hairline)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Placeholder for WorkOS AuthKit — swap href for the hosted login URL */}
          <Link href="/signup" className="arf-btn-ghost hidden sm:inline-flex" data-workos="authkit-signin">
            Sign In
          </Link>

          <Link
            href="/signup"
            className="hidden items-center gap-2 rounded-lg bg-gradient-to-br from-arf-blue to-arf-purple px-[17px] py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(51,88,232,0.7)] transition hover:brightness-110 sm:inline-flex"
          >
            Request Pilot Access
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--hairline)] md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-menu" className="border-t border-[color:var(--hairline)] bg-[color:var(--surface-canvas)] md:hidden">
          <div className="arf-shell flex flex-col gap-1 py-4">
            {PRIMARY_LINKS.map((link) =>
              'external' in link && link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-[color:var(--text-secondary)]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-[color:var(--text-secondary)]"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="mt-2 flex flex-col gap-2.5">
              <Link href="/signup" className="arf-btn-ghost justify-center">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-arf-blue to-arf-purple px-5 py-3 text-sm font-semibold text-white"
              >
                Request Pilot Access <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
