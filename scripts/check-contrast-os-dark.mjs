// Reproduces the reported bug directly: emulates the OS "prefers dark"/"prefers
// light" setting (Playwright's colorScheme context option, which sets the
// prefers-color-scheme media feature the browser itself reads) independently
// of the SITE's own active theme (set via localStorage before navigation, the
// same key NavBar/the blocking init script use). This lets us reproduce every
// OS x site combination, including the two mismatched ones actually reported:
// "Windows dark, site light" and "Windows light, site dark".
//
// getComputedStyle alone doesn't catch this class of bug -- a browser's own
// auto-dark paint adjustment (Chromium/Edge forced-colors-style heuristics)
// happens after the cascade, so computed color values can report correctly
// while the rendered pixels are what the user actually complained about.
// So we check the CSS mechanism directly (color-scheme, OS/class state) AND
// take a screenshot -- the screenshot is the only artifact that shows what
// the user actually saw.

import Browserbase from '@browserbasehq/sdk';
import { chromium } from 'playwright-core';

const TARGET_URL = process.argv[2] || 'https://arf-ai.com/';
const OS_SCHEME = process.argv[3] || 'dark'; // OS/browser preference to emulate: 'dark' | 'light'
const SITE_THEME = process.argv[4] || 'light'; // site's own active theme: 'dark' | 'light'
const screenshotPath = process.argv[5] || `scripts/contrast-check-os-${OS_SCHEME}-site-${SITE_THEME}.png`;

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });

async function main() {
  console.log(`Creating Browserbase session (OS=${OS_SCHEME}, site theme=${SITE_THEME})...`);
  const session = await bb.sessions.create({});
  console.log(`Session created: ${session.id}`);
  console.log(`Live view / replay: https://www.browserbase.com/sessions/${session.id}`);

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const context = browser.contexts()[0];
  await context.clearCookies();
  const page = context.pages()[0] ?? (await context.newPage());

  // OS-preference emulation -- sets prefers-color-scheme for the whole page,
  // the same signal a real OS dark/light setting sends to the browser.
  await page.emulateMedia({ colorScheme: OS_SCHEME });

  // Pin the site's own theme independently of OS preference, same mechanism
  // the blocking init script in layout.tsx reads (localStorage['arf-theme']).
  await page.addInitScript((theme) => {
    window.localStorage.setItem('arf-theme', theme);
  }, SITE_THEME);

  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const cs = h1 ? getComputedStyle(h1) : null;
    return {
      osPrefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      htmlHasDarkClass: document.documentElement.classList.contains('dark'),
      htmlColorScheme: getComputedStyle(document.documentElement).colorScheme,
      h1Color: cs?.color,
      h1Text: h1?.textContent?.trim(),
    };
  });

  console.log('\n=== Result ===');
  console.log(JSON.stringify(result, null, 2));

  const expectedScheme = SITE_THEME === 'dark' ? 'dark' : 'light';
  const pass = result.htmlColorScheme === expectedScheme && result.htmlHasDarkClass === (SITE_THEME === 'dark');
  console.log(`\ncolor-scheme is scoped to the site's active theme (not OS): ${pass ? 'PASS' : 'FAIL'}`);
  console.log(`  expected htmlColorScheme="${expectedScheme}", got "${result.htmlColorScheme}"`);

  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\nScreenshot saved to ${screenshotPath}`);

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
