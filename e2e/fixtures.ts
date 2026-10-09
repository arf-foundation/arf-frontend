import { test as base, expect, type Page } from "@playwright/test";

/* Every public, statically built page. e2e/routes.spec.ts fails if a page.tsx
   is added under app/ without being listed here, so a new page cannot be
   silently left out of the crawl, the accessibility scan or the layout check. */
export const PUBLIC_ROUTES = [
  "/",
  "/agent",
  "/changelog",
  "/dashboard",
  "/faq",
  "/history",
  "/offline",
  "/pricing",
  "/privacy",
  "/signup",
  "/terms",
] as const;

export function isLocal(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "127.0.0.1" || hostname === "localhost";
  } catch {
    // data:, blob: and about: URLs belong to the page itself.
    return true;
  }
}

type Problems = { list: string[]; expectNone: () => void };

/* `problems` collects what a visitor would hit and the page would not show:
   uncaught exceptions, console errors, and failed or >= 400 same-origin
   requests. Third-party requests are aborted so a run never depends on
   YouTube, LinkedIn or GitHub being up; the console noise those aborts cause
   is attributed to the third-party URL and ignored. */
function onlyThirdPartyUrls(text: string): boolean {
  const urls = text.match(/https?:\/\/[^\s"'<>)]+/g) ?? [];
  return urls.length > 0 && urls.every((u) => !isLocal(u));
}

/* How each engine words a blocked or failed resource load in the console. */
const LOAD_FAILURE = /Failed to load resource|Loading failed for the <script>|ERR_BLOCKED_BY_CLIENT|blocked by client|NS_ERROR_|net::ERR_FAILED/i;

/* Whether a console error is noise from the suite's own third-party aborts
   (true) or a problem to report (false). `where` is the message's source
   location, empty when the engine gives none. */
export function isThirdPartyNoise(text: string, where: string): boolean {
  // Located at a third-party URL: every third-party load is aborted, so no
  // third-party code runs here, and the message can only be about that abort.
  if (where && !isLocal(where)) return true;
  // Some engines attribute the abort to the page instead. Recognise that by
  // its wording AND by naming only third-party URLs, never by URLs alone: a
  // first-party error that merely mentions an outside URL is reported.
  return LOAD_FAILURE.test(text) && onlyThirdPartyUrls(text);
}

export const test = base.extend<{ problems: Problems }>({
  problems: [async ({ page }, use) => {
    const list: string[] = [];
    await page.route((url) => !isLocal(url.href), (route) => route.abort("blockedbyclient"));
    // The CSP's `upgrade-insecure-requests` is right for production (https)
    // but this suite serves plain http, and WebKit then upgrades the page's
    // own CSS/font loads to https://127.0.0.1, which fail: the page renders
    // unstyled and every check after that is meaningless. Remove that one
    // directive from document responses; the rest of the policy still applies.
    await page.route(
      (url) => isLocal(url.href),
      async (route) => {
        if (route.request().resourceType() !== "document") return route.fallback();
        const response = await route.fetch();
        const headers = { ...response.headers() };
        const csp = headers["content-security-policy"];
        if (csp) headers["content-security-policy"] = csp.replace(/\s*upgrade-insecure-requests\s*;?/g, " ");
        await route.fulfill({ response, headers });
      },
    );
    // @vercel/analytics loads /_vercel/insights/script.js, which the Vercel
    // edge serves and `next start` does not; stub it rather than fail every page.
    // Only that path: any other /_vercel/ request must still fail visibly.
    await page.route("**/_vercel/insights/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
    );
    page.on("pageerror", (err) => list.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const where = msg.location().url;
      if (isThirdPartyNoise(msg.text(), where)) return;
      list.push(`console.error: ${msg.text()}${where ? ` (${where})` : ""}`);
    });
    page.on("requestfailed", (req) => {
      if (!isLocal(req.url())) return;
      const reason = req.failure()?.errorText ?? "";
      // A navigation or prefetch the page itself cancelled is not a failure.
      if (/ERR_ABORTED|NS_BINDING_ABORTED|cancelled/i.test(reason)) return;
      list.push(`requestfailed: ${req.method()} ${req.url()} ${reason}`);
    });
    page.on("response", (res) => {
      if (isLocal(res.url()) && res.status() >= 400) {
        list.push(`HTTP ${res.status()}: ${res.request().method()} ${res.url()}`);
      }
    });
    await use({ list, expectNone: () => expect(list, list.join("\n")).toEqual([]) });
  }, { auto: true }],
});

export { expect };

/* Navigate and wait until the page has settled: fonts, client hydration and
   finite animations included, so later checks see the page a visitor sees. */
export async function visit(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  // Without View Transitions (CI's Linux WebKit), RouteTransition fades the
  // whole page in on mount (.arf-route-fade, 260ms). axe sampling mid-fade
  // measured every colour partly transparent (#3358e8 as #5574ec, 4.12:1)
  // and failed at random. Wait for finite CSS animations and transitions to
  // end; endless decorative ones are ignored.
  await page.waitForFunction(() =>
    document.getAnimations().every(
      (a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity,
    ),
  );
  return response;
}
