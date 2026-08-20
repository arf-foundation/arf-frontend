'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
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

/* ----------------------------------------------------------------------------
   The active theme lives on <html> as a `.dark` class, applied by the blocking
   script in layout.tsx before first paint. That class is therefore external
   state that React does not own, so it is read through useSyncExternalStore
   rather than mirrored into useState.

   The server snapshot is deliberately 'light' — SSR cannot know the visitor's
   stored preference. Reading the real class during render instead would make
   the first client render disagree with the SSR markup (different icon and
   aria-label on the toggle), which React treats as a failed hydration: it
   discards the server tree and regenerates it on the client. Because <html> is
   a React host singleton, regenerating it clears every attribute React did not
   itself render — stripping the `.dark` the blocking script had just applied,
   so dark-mode visitors got the right theme until hydration and then a hard
   flip to light. useSyncExternalStore is the sanctioned way to render the
   server value during hydration and re-read the real one immediately after.
--------------------------------------------------------------------------- */
const subscribeToTheme = (onStoreChange: () => void) => {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};

const getThemeSnapshot = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

const getServerThemeSnapshot = (): Theme => 'light';

export default function NavBar() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    // Decide from the real DOM class rather than `theme`, which is 'light' for
    // the one render that hydration occupies. Toggling the class is all that is
    // needed to update the icon too — the MutationObserver above sees the change
    // and re-reads the snapshot, so there is no separate state to keep in sync.
    const next: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
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
