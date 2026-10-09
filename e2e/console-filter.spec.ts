import { test, expect } from "@playwright/test";
import { isThirdPartyNoise } from "./fixtures";

/* The console-error gate must not drop a first-party error just because its
   message mentions an outside URL (Codex's review of 68a7860, R1), while the
   noise the suite itself causes by aborting third-party loads stays ignored.
   Pure checks of the filter; one engine is enough. */
test.describe("console error filter", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "pure function; checked once in chromium");
  });

  const PAGE = "http://127.0.0.1:3100/";
  const OWN_SCRIPT = "http://127.0.0.1:3100/_next/static/chunks/app.js";

  test("a first-party error naming an outside URL is reported", () => {
    expect(isThirdPartyNoise("First-party operation failed while processing https://example.invalid/resource", OWN_SCRIPT)).toBe(false);
  });

  test("a plain first-party error is reported", () => {
    expect(isThirdPartyNoise("TypeError: x is undefined", OWN_SCRIPT)).toBe(false);
  });

  test("an error with no location naming an outside URL, but not a load failure, is reported", () => {
    expect(isThirdPartyNoise("Unexpected response from https://api.example.invalid/v1", "")).toBe(false);
  });

  test("a failed load of this site's own resource is reported", () => {
    expect(isThirdPartyNoise("Failed to load resource: the server responded with a status of 500", "http://127.0.0.1:3100/api/x")).toBe(false);
  });

  test("an error located at a third-party URL is ignored", () => {
    expect(isThirdPartyNoise("Failed to load resource: net::ERR_BLOCKED_BY_CLIENT", "https://www.youtube.com/iframe_api")).toBe(true);
  });

  test("an engine's blocked-load message naming only third-party URLs is ignored, even when attributed to the page", () => {
    expect(isThirdPartyNoise("Loading failed for the <script> with source “https://www.googletagmanager.com/gtag/js”.", PAGE)).toBe(true);
    expect(isThirdPartyNoise("Failed to load resource: net::ERR_BLOCKED_BY_CLIENT https://www.linkedin.com/x", "")).toBe(true);
  });
});
