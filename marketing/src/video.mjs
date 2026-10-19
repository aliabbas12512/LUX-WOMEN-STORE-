// Renders video.html frame by frame and encodes an MP4 with ffmpeg.
// Usage (repo root): node marketing/src/video.mjs
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import { mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
const here = process.env.MARKETING_SRC || fileURLToPath(new URL(".", import.meta.url));
const FPS = 30;
const frames = `${process.env.FRAMES_DIR || tmpdir()}/lux-frames`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${here}video.html`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const total = await page.evaluate(() => window.DURATION);
const n = Math.round(total * FPS);
for (let i = 0; i < n; i++) {
  await page.evaluate((t) => window.render(t), i / FPS);
  await page.screenshot({ path: `${frames}/${String(i).padStart(4, "0")}.jpg`, type: "jpeg", quality: 95 });
}
await browser.close();
const out = `${here}../ad-video-snapchat-1080x1920.mp4`;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", `${frames}/%04d.jpg`,
  "-f", "lavfi", "-t", String(total), "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
  "-c:a", "aac", "-shortest", out]);
console.log(`wrote ${out} (${n} frames)`);
