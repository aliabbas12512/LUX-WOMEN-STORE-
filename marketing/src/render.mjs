// Renders the flyers to PNG. Run from the repo root:  node marketing/src/render.mjs
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
const here = process.env.MARKETING_SRC || fileURLToPath(new URL(".", import.meta.url));
const exe = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: exe });
for (const [file, w, h, out] of [
  ["flyer-story.html", 1080, 1920, "flyer-snapchat-story-1080x1920.png"],
  ["flyer-collection.html", 1080, 1350, "flyer-collection-1080x1350.png"],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`file://${here}${file}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${here}../${out}` });
  console.log("wrote", out);
}
await browser.close();
