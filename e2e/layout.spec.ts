import { test, expect, visit, PUBLIC_ROUTES } from "./fixtures";

/* Phone-width layout and theme switching. */

for (const route of PUBLIC_ROUTES) {
  test(`no horizontal scroll ${route}`, async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("mobile-"), "phone-width check runs in the mobile projects");
    await visit(page, route);
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(overflow.scrollWidth, `${route} is wider than the ${overflow.viewport}px viewport`).toBeLessThanOrEqual(
      overflow.viewport,
    );
  });
}

test("the page follows the OS colour scheme", async ({ page }) => {
  // app/layout.tsx adds `dark` to <html> before first paint when the visitor
  // has no stored choice and the OS prefers dark.
  const render = async (scheme: "light" | "dark") => {
    await page.emulateMedia({ colorScheme: scheme });
    await visit(page, "/");
    return page.evaluate(() => ({
      dark: document.documentElement.classList.contains("dark"),
      ink: getComputedStyle(document.body).color,
    }));
  };
  const light = await render("light");
  const dark = await render("dark");
  expect(light.dark, "light scheme: <html> carries the dark class").toBe(false);
  expect(dark.dark, "dark scheme: <html> lacks the dark class").toBe(true);
  expect(dark.ink, "dark scheme renders the same body text colour as light").not.toBe(light.ink);
});
