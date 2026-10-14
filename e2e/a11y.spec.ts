import AxeBuilder from "@axe-core/playwright";
import { test, expect, visit, PUBLIC_ROUTES } from "./fixtures";
import { KNOWN_VIOLATIONS, NOT_STALE_CHECKED } from "./a11y-known";

/* WCAG 2.1 A/AA scan of every route in both colour schemes, in every engine
   and viewport. Serious and critical violations fail unless already listed in
   e2e/a11y-known.ts, a list that may only shrink. That includes
   color-contrast, the regression class Replay QA used to catch (header ink
   stuck at light-theme values on a dark page). The theme follows the OS
   setting unless the visitor chose one, so emulating the scheme exercises the
   same path as a real visitor. */
const SCHEMES = ["light", "dark"] as const;

for (const route of PUBLIC_ROUTES) {
  for (const scheme of SCHEMES) {
    test(`a11y ${route} (${scheme})`, async ({ page }, testInfo) => {
      // Reduced motion: the site's own rule cuts every animation and transition
      // to 0.01ms, so axe measures the colours a page settles on. Without it,
      // CI's Linux WebKit was sampled mid-fade (the route fade-in, /agent's
      // animate-fade-in), whenever hydration happened to start one, and every
      // colour read partly transparent. Colours do not depend on this setting.
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await visit(page, route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      const known = new Set(KNOWN_VIOLATIONS[`${route} ${scheme}`] ?? []);

      const unexpected = blocking
        .filter((v) => !known.has(v.id))
        .map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.slice(0, 5).map((n) => n.target.join(" ")).join("\n  ")}`);
      expect(unexpected, `new accessibility violations on ${route} (${scheme}):\n${unexpected.join("\n")}`).toEqual([]);

      if (testInfo.project.name === "chromium") {
        const seen = new Set(blocking.map((v) => v.id));
        const stale = [...known].filter((id) => !seen.has(id) && !NOT_STALE_CHECKED.has(id));
        expect(stale, `fixed on ${route} (${scheme}); delete from e2e/a11y-known.ts: ${stale.join(", ")}`).toEqual([]);
      }
    });
  }
}
