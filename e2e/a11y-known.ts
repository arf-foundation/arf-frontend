/* Serious/critical axe violations accepted as known, per "route scheme".

   Empty since 2026-10-09: the 14 entries recorded from main 3332501 were
   fixed together (fix/a11y-known-violations):
   - color-contrast: brand blue/purple TEXT gets a dark-mode tint
     (app/globals.css); #a66a1e becomes #9c6219; the reds and amber used as
     text get dark: variants; the changelog's purple badge text is darkened
     in light mode.
   - link-in-text-block: inline links in sentences (FAQ, signup) are underlined.
   - aria-progressbar-name: the /signup step indicator has an aria-label.
   - scrollable-region-focusable: the /history and /pricing tables' scrolling
     wrappers are focusable, labelled regions.

   How the ratchet works (e2e/a11y.spec.ts):
   - a rule NOT listed for a route and scheme fails, in every engine;
   - a listed rule that chromium no longer reports fails too, so a fix
     must delete its entry and the list only shrinks.
   Limits, stated: an entry is per rule, not per element, so one more element
   breaking an already-listed rule on the same page is not caught; and
   `scrollable-region-focusable` is reported only at phone width
   (mobile-chromium), where the stale check does not run.
   Add an entry only for a defect that cannot be fixed in the same change,
   with a comment naming it. */
export const KNOWN_VIOLATIONS: Record<string, readonly string[]> = {};

/* Rules only some engines or viewports report; the chromium stale check
   skips them instead of demanding they appear on desktop chromium. */
export const NOT_STALE_CHECKED = new Set(["scrollable-region-focusable"]);
