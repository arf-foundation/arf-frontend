// Verifies the redesigned Architecture pipeline (components/ArchitecturePipeline.tsx,
// shipped in 2e4eeb8) at a given viewport width and theme. Checks:
//  - the compact node-number badge doesn't overlap "Risk Engine"'s label text
//  - the wire after the cluster is structurally symmetric with the wires before it
//  - the comet-sweep animation is actually animating (two samples of the ::after
//    pseudo-element's computed transform, taken ~400ms apart, must differ)

import Browserbase from '@browserbasehq/sdk';
import { chromium } from 'playwright-core';

const TARGET_URL = process.argv[2] || 'https://www.arf-ai.com/';
const WIDTH = parseInt(process.argv[3] || '1280', 10);
const THEME = process.argv[4] || 'light'; // 'light' | 'dark'
const screenshotPath = process.argv[5] || `scripts/arch-${WIDTH}-${THEME}.png`;

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });

async function main() {
  console.log(`Session for width=${WIDTH} theme=${THEME}...`);
  const session = await bb.sessions.create({});
  console.log(`Live view: https://www.browserbase.com/sessions/${session.id}`);

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const context = browser.contexts()[0];
  const page = context.pages()[0] ?? (await context.newPage());
  await page.setViewportSize({ width: WIDTH, height: 1400 });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  if (THEME === 'dark') {
    const btn = await page.$('button[aria-label*="theme" i]');
    await btn.click();
    await page.waitForTimeout(400);
  }

  const section = await page.$('#architecture');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600); // let scroll-reveal + IntersectionObserver arm

  const overlapCheck = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('.arf-pipeline-node-compact'));
    return nodes.map((node) => {
      const label = node.querySelector('.arf-pipeline-node-label');
      const n = node.querySelector('.arf-pipeline-node-n');
      if (!label || !n) return { label: label?.textContent, overlap: null };
      const lr = label.getBoundingClientRect();
      const nr = n.getBoundingClientRect();
      const overlap = !(lr.right < nr.left || lr.left > nr.right || lr.bottom < nr.top || lr.top > nr.bottom);
      return { label: label.textContent, overlap };
    });
  });

  const wireSymmetry = await page.evaluate(() => {
    const wires = Array.from(document.querySelectorAll('.arf-pipeline-track > .arf-pipeline-item > .arf-pipeline-wire, .arf-pipeline-track > .arf-pipeline-wire'));
    return wires.map((w) => {
      const r = w.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    });
  });

  const sweep1 = await page.evaluate(() => {
    const el = document.querySelector('.arf-pipeline-wire::after') || document.querySelector('.arf-pipeline-wire');
    const target = document.querySelector('.arf-pipeline-wire');
    if (!target) return null;
    const cs = getComputedStyle(target, '::after');
    return cs.transform;
  });
  await page.waitForTimeout(450);
  const sweep2 = await page.evaluate(() => {
    const target = document.querySelector('.arf-pipeline-wire');
    if (!target) return null;
    const cs = getComputedStyle(target, '::after');
    return cs.transform;
  });

  console.log('\n=== Compact node label/number overlap ===');
  console.log(JSON.stringify(overlapCheck, null, 2));
  console.log('\n=== Wire dimensions (px) — first is before cluster, rest inside/after ===');
  console.log(JSON.stringify(wireSymmetry, null, 2));
  console.log('\n=== Comet sweep transform, two samples ~450ms apart ===');
  console.log('sample1:', sweep1);
  console.log('sample2:', sweep2);
  console.log('animating:', sweep1 !== sweep2 ? 'YES (transform changed)' : 'NO (static — investigate)');

  await section.screenshot({ path: screenshotPath });
  console.log(`\nScreenshot saved to ${screenshotPath}`);

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
