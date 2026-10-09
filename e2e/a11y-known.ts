/* Serious/critical axe violations already on main when this suite landed
   (recorded 2026-10-09 from main 3332501). Every entry is an open defect to
   fix, not a permanent exception.

   How the ratchet works (e2e/a11y.spec.ts):
   - a rule NOT listed for a route and scheme fails, in every engine;
   - a listed rule that chromium no longer reports fails too, so a fix
     must delete its entry and the list only shrinks.
   Limits, stated: an entry is per rule, not per element, so one more element
   breaking an already-listed rule on the same page is not caught; and
   `scrollable-region-focusable` is reported only at phone width
   (mobile-chromium), where the stale check does not run.

   What each rule is, today:
   - color-contrast: hard-coded accents (#b0453a, #a66a1e, #b3392a,
     amber-500, arf-purple badges, arf-blue in dark) under 4.5:1.
     The /dashboard (dark) entry includes the "Switch to HTTPS" banner, which
     renders only because this suite serves plain http.
   - link-in-text-block: arf-blue inline links distinguished by colour alone.
   - aria-progressbar-name: the /signup progress bar has no accessible name.
   - scrollable-region-focusable: horizontally scrolling tables that cannot be
     reached by keyboard at phone width. */
export const KNOWN_VIOLATIONS: Record<string, readonly string[]> = {
  "/ dark": ["color-contrast"],
  "/changelog dark": ["color-contrast"],
  "/changelog light": ["color-contrast"],
  "/dashboard dark": ["color-contrast"],
  "/dashboard light": ["color-contrast"],
  "/faq dark": ["color-contrast", "link-in-text-block"],
  "/faq light": ["link-in-text-block"],
  "/history dark": ["color-contrast", "scrollable-region-focusable"],
  "/history light": ["color-contrast", "scrollable-region-focusable"],
  "/pricing dark": ["color-contrast", "scrollable-region-focusable"],
  "/pricing light": ["scrollable-region-focusable"],
  "/signup dark": ["aria-progressbar-name", "color-contrast", "link-in-text-block"],
  "/signup light": ["aria-progressbar-name", "link-in-text-block"],
  "/terms dark": ["color-contrast"],
};

/* Rules only some engines or viewports report; the chromium stale check
   skips them instead of demanding they appear on desktop chromium. */
export const NOT_STALE_CHECKED = new Set(["scrollable-region-focusable"]);
