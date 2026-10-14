import { defineConfig, devices } from "@playwright/test";

/* End-to-end suite: replaces the Replay QA app (removed 2026-10-09).
   It runs against a production build (`yarn build` first), never `next dev`,
   so it tests what Vercel serves. Third-party hosts are blocked in
   e2e/fixtures.ts: a run depends only on this repository. Retries are 0 on
   purpose -- a test that needs a retry to pass is reported as a failure, not
   hidden as "flaky". */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const externalBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60_000, // axe on a long page, in WebKit, under parallel load
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }], ["list"]]
    : [["list"]],
  use: {
    baseURL: externalBaseURL ?? `http://127.0.0.1:${PORT}`,
    // next-pwa registers a service worker in production builds; a worker
    // carried between tests would serve cached pages instead of the server's.
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 14"] } },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: `npx next start --port ${PORT} --hostname 127.0.0.1`,
        url: `http://127.0.0.1:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
