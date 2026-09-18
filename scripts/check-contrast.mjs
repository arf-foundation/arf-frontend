// Diagnostic script: opens the live site in a real cloud browser (Browserbase)
// via Playwright-over-CDP, captures console/page errors (looking for the
// React #418 hydration mismatch), reads actual computed styles for the
// elements reported as low-contrast, and saves a screenshot for visual
// inspection. Deterministic Playwright control -- no AI/Stagehand needed
// since exactly what to check is already known.

import Browserbase from '@browserbasehq/sdk';
import { chromium } from 'playwright-core';

const TARGET_URL = process.argv[2] || 'https://arf-ai.com/';

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });

async function main() {
  console.log(`Creating Browserbase session...`);
  const session = await bb.sessions.create({});
  console.log(`Session created: ${session.id}`);
  console.log(`Live view / replay: https://www.browserbase.com/sessions/${session.id}`);

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const context = browser.contexts()[0];
  const page = context.pages()[0] ?? (await context.newPage());

  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  console.log(`Navigating to ${TARGET_URL} (fresh context, no cookies/localStorage)...`);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000); // let hydration + any error settle

  const result = await page.evaluate(() => {
    function styleOf(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        text: el.textContent?.trim().slice(0, 60),
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontFamily: cs.fontFamily,
      };
    }
    const contentRoot = document.querySelector('main .arf-page-root') || document.querySelectorAll('.arf-page-root')[1];
    const h1 = document.querySelector('h1');
    const heroP = document.querySelector('main .arf-page-root > section p, main section p');
    const whyArfHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('Why ARF'));
    const whyArfBody = whyArfHeading ? whyArfHeading.parentElement?.querySelectorAll('p') : [];

    return {
      htmlClass: document.documentElement.className,
      htmlHasDarkClass: document.documentElement.classList.contains('dark'),
      bodyBg: getComputedStyle(document.body).backgroundColor,
      contentRoot: styleOf(contentRoot),
      h1: styleOf(h1),
      heroParagraph: styleOf(heroP),
      whyArfHeading: styleOf(whyArfHeading),
      whyArfBodyParas: Array.from(whyArfBody || []).map(styleOf),
    };
  });

  console.log('\n=== Computed styles ===');
  console.log(JSON.stringify(result, null, 2));

  console.log('\n=== Console messages (filtered: error/warning) ===');
  for (const m of consoleMessages) {
    if (m.type === 'error' || m.type === 'warning') {
      console.log(`[${m.type}] ${m.text}`);
    }
  }

  console.log('\n=== Uncaught page errors ===');
  if (pageErrors.length === 0) console.log('(none)');
  for (const e of pageErrors) console.log(e);

  const screenshotPath = process.argv[3] || 'scripts/contrast-check.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\nScreenshot saved to ${screenshotPath}`);

  await browser.close();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
