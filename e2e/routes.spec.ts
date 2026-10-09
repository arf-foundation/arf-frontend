import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { test, expect, visit, isLocal, PUBLIC_ROUTES } from "./fixtures";

function discoverPages(dir: string, prefix = ""): string[] {
  const found: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) {
      if (name === "page.tsx") found.push(prefix || "/");
      continue;
    }
    if (name === "api" && !prefix) continue; // route handlers, not pages
    if (name.startsWith("_")) continue; // private folders
    if (name.startsWith("[")) throw new Error(`dynamic route ${full}: list concrete paths in e2e/fixtures.ts`);
    const segment = name.startsWith("(") ? "" : `/${name}`; // route groups add no segment
    found.push(...discoverPages(full, prefix + segment));
  }
  return found;
}

test("every page under app/ is in PUBLIC_ROUTES", () => {
  const onDisk = discoverPages(path.join(__dirname, "..", "app")).sort();
  expect([...PUBLIC_ROUTES].sort()).toEqual(onDisk);
});

for (const route of PUBLIC_ROUTES) {
  test.describe(`route ${route}`, () => {
    test("loads with 200, a title, and no errors", async ({ page, problems }) => {
      const response = await visit(page, route);
      expect(response?.status(), `status of ${route}`).toBe(200);
      await expect(page).toHaveTitle(/\S/);
      await expect(page.locator("body")).not.toBeEmpty();
      problems.expectNone();
    });

    test("internal links resolve", async ({ page }, testInfo) => {
      // The link set is the same markup in every engine; one project checks it.
      test.skip(testInfo.project.name !== "chromium", "links are engine-independent; checked once in chromium");
      await visit(page, route);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
      // /dashboard links to its own https:// URL when served over http (its
      // insecure-context banner). The suite serves http, so that link has
      // nothing to answer it here; production is https-only.
      const local = [...new Set(hrefs.filter((h) => isLocal(h) && h.startsWith("http:")))];
      const broken: string[] = [];
      for (const href of local) {
        const url = new URL(href);
        const res = await page.request.get(url.origin + url.pathname + url.search);
        if (res.status() >= 400) broken.push(`${res.status()} ${href}`);
        if (url.hash.length > 1 && url.pathname === new URL(page.url()).pathname) {
          const id = decodeURIComponent(url.hash.slice(1));
          if ((await page.locator(`[id="${id}"]`).count()) === 0) broken.push(`missing anchor ${href}`);
        }
      }
      expect(broken, broken.join("\n")).toEqual([]);
    });
  });
}
