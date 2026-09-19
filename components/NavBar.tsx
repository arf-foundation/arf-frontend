"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";

/* Matches the transition-[grid-template-rows] duration below -- keeping the
   unmount delay and the CSS duration in the same place so they can't drift
   apart. */
const MOBILE_MENU_MS = 260;

/* ----------------------------------------------------------------------------
   NavBar — 8 links + CTA reduced to 4 primary links + one button.
   Product / Docs / Pricing / Console are the only things a buyer needs before
   they talk to us. History, Changelog, FAQ, Spec and the community links live
   in the footer. "Whitepaper (soon)" is gone — we don't advertise what doesn't
   exist. Request Pilot Access is the single CTA; there's no separate Sign In
   until WorkOS AuthKit actually exists (see toggleTheme's neighbor below).

--------------------------------------------------------------------------- */

/* Labels here must match their counterparts in components/Footer.tsx and
   wherever else the same destination is linked (app/page.tsx's hero/feature
   CTAs, packages/ui/src/ConsoleCard.tsx) -- WCAG 3.2.4 Consistent
   Identification requires the same accessible name for the same function
   everywhere it appears, and Replay QA caught several of these drifting
   ("Product" vs "Capabilities", "Console" vs "Open Governance Console" vs
   "Open console", "Developers" vs "GitHub" vs "Specification"). */
const PRIMARY_LINKS = [
  { label: "Capabilities", href: "/#capabilities" },
  { label: "FAQ", href: "/faq" },
  { label: "Pricing", href: "/pricing" },
  { label: "Console", href: "/dashboard" },
  {
    label: "GitHub",
    href: "https://github.com/arf-foundation",
    external: true,
  },
] as const;

type Theme = "light" | "dark";

export default function NavBar() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Menu used to unmount instantly on close ({mobileOpen && (...)}), so it
  // just snapped. Keeping it mounted through the closing transition (mount
  // immediately on open, unmount MOBILE_MENU_MS after close) lets
  // grid-template-rows actually animate both directions instead of only
  // ever appearing pre-opened.
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuShown, setMenuShown] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      // Mount-then-animate needs this: the transition can't play unless the
      // 0fr state actually paints before the next frame flips it to 1fr,
      // which needs a real render in between -- not derivable from mobileOpen
      // alone. Same accepted pattern as app/history, /dashboard, /signup.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMenuMounted(true);
      const id = requestAnimationFrame(() => setMenuShown(true));
      return () => cancelAnimationFrame(id);
    }
    setMenuShown(false);
    const timeout = setTimeout(() => setMenuMounted(false), MOBILE_MENU_MS);
    return () => clearTimeout(timeout);
  }, [mobileOpen]);

  useEffect(() => {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "dark" : "light";
    // Hydration-safe initialization: the server renders a neutral default and
    // this client-only effect syncs the real theme state once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(nextTheme);
    setIsHydrated(true);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    // See .theme-transition-off in globals.css: without this, elements whose
    // color comes from an inherited CSS var (--text-primary etc.) and also
    // sit in a `transition` utility get stuck showing the old theme's color
    // on the first toggle after page load — a Chromium transition bug, not
    // a state bug (the --text-* variables themselves update correctly).
    root.classList.add("theme-transition-off");
    root.classList.toggle("dark", next === "dark");
    void root.offsetHeight;
    // Two frames, not one. A single rAF callback runs BEFORE the paint it was
    // scheduled for, so transitions were being re-enabled in the same frame the
    // new colours were still being committed -- which is the exact window the
    // Chromium bug above needs to latch the previous theme's resolved colour.
    // Nesting a second rAF moves the removal to after that paint has actually
    // landed. Replay QA reported header ink stuck at light-theme values against
    // a dark-theme header background; this is the half of that we can act on.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("theme-transition-off")),
    );
    setTheme(next);
    try {
      window.localStorage.setItem("arf-theme", next);
    } catch {
      /* storage unavailable — the toggle still works for this session */
    }
  };

  return (
    <header className="arf-page-root sticky top-0 z-40 border-b border-[color:var(--hairline)] bg-[color:var(--surface-canvas-85)] backdrop-blur-md">
      <div className="arf-shell flex h-[74px] items-center justify-between gap-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="ARF AI home"
        >
          {/* width/height must match the rendered 22px box, not the source
              file's native resolution -- Next/Image treats the declared
              size as the SOURCE size, not a max, so 256x256 here was
              serving a 256px WebP (26.8KB) into a 22px box on every load.
              At 22 Next's own srcset step logic already covers 2x/3x DPR
              (rounds up to its next configured breakpoint, w=48). */}
          <Image
            src="/arf-icon.png"
            alt=""
            width={22}
            height={22}
            className="h-[22px] w-[22px]"
            priority
          />
          <span className="text-base font-semibold tracking-[-0.02em]">
            ARF AI
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {PRIMARY_LINKS.map((link) =>
            "external" in link && link.external ? (
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
            ),
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--hairline)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)] active:scale-90"
            suppressHydrationWarning
          >
            {isHydrated && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            {!isHydrated && <Moon className="h-4 w-4 opacity-70" />}
          </button>

          {/* No real sign-in flow exists yet (WorkOS AuthKit is planned, not
              wired up) -- a "Sign In" button that routes to /signup was
              misleading and, since it was one of several links to that same
              destination with a different label, a repeated WCAG 3.2.4
              (Consistent Identification) failure across every page. Re-add
              once AuthKit lands, pointed at the real login route. */}
          <Link
            href="/signup"
            className="hidden items-center gap-2 rounded-lg bg-arf-blue bg-gradient-to-br from-arf-blue to-arf-purple px-[17px] py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(51,88,232,0.7)] transition hover:brightness-110 active:scale-[0.97] sm:inline-flex"
          >
            Request Pilot Access
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--hairline)] transition active:scale-90 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {menuMounted && (
        <div
          id="mobile-nav-menu"
          aria-hidden={!menuShown}
          inert={!menuShown ? true : undefined}
          className="grid border-t border-[color:var(--hairline)] bg-[color:var(--surface-canvas)] transition-[grid-template-rows] duration-[260ms] ease-out md:hidden"
          style={{ gridTemplateRows: menuShown ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="arf-shell flex flex-col gap-1 py-4">
              {PRIMARY_LINKS.map((link) =>
                "external" in link && link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-2 py-3 text-base font-medium text-[color:var(--text-secondary)] transition active:scale-[0.98]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-2 py-3 text-base font-medium text-[color:var(--text-secondary)] transition active:scale-[0.98]"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <div className="mt-2 flex flex-col gap-2.5">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-arf-blue bg-gradient-to-br from-arf-blue to-arf-purple px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.97]"
                >
                  Request Pilot Access <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--hairline)] px-5 py-3 text-sm font-semibold"
                  suppressHydrationWarning
                >
                  {isHydrated && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
                  {!isHydrated && <Moon className="h-4 w-4 opacity-70" />}
                  {theme === "dark" ? "Light theme" : "Dark theme"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
