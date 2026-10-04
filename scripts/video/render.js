// Rebuilds public/media/arf-how-it-works.* from index.html + data.js.
//
// The composition is deterministic: window.render(t) draws the frame at time t,
// so each frame is a screenshot at t = i / fps, independent of machine speed.
// JPEG frames go to stdout; pipe them into ffmpeg rather than writing them to
// disk. Render in 10-second segments, then concatenate:
//
//   node scripts/video/render.js 0 10 30 | ffmpeg -f image2pipe -framerate 30 -c:v mjpeg -i - \
//        -c:v libx264 -pix_fmt yuv420p -crf 12 seg0.mp4          (likewise 10-20, 20-30)
//   ffmpeg -f concat -safe 0 -i segs.txt -c copy master.mp4
//   ffmpeg -i master.mp4 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an arf-how-it-works.mp4
//   ffmpeg -i master.mp4 -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 -an arf-how-it-works.webm
//   ffmpeg -ss 11 -i master.mp4 -frames:v 1 arf-how-it-works-poster.png   (then -c:v libwebp -quality 82 for .webp)
//
// Uses playwright-core (a devDependency) with the system Edge, so no browser
// download is needed. Usage: node scripts/video/render.js [from_s] [to_s] [fps]
const path = require("path");
const { chromium } = require("playwright-core");

(async () => {
  const [from = 0, to = 30, fps = 30] = process.argv.slice(2).map(Number);
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("file:///" + path.join(__dirname, "index.html").replace(/\\/g, "/"));
  await page.evaluate(() => document.fonts.ready);
  if (errors.length) { console.error("page errors:", errors); process.exit(2); }
  for (let i = Math.round(from * fps); i < Math.round(to * fps); i++) {
    await page.evaluate((t) => window.render(t), i / fps);
    const buf = await page.screenshot({ type: "jpeg", quality: 93 });
    if (!process.stdout.write(buf)) await new Promise((r) => process.stdout.once("drain", r));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
