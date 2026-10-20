// Records a short demo video (load animation -> search glow -> tap a machine -> close).
// Requires `npm run preview` on port 4173 and Playwright's ffmpeg (`npx playwright-core install ffmpeg`). Output: screenshots/demo-desktop.webm, screenshots/demo-mobile.webm
import { chromium } from 'playwright-core';
import { mkdirSync, renameSync, rmSync } from 'node:fs';

const BASE = process.env.APP_URL || 'http://localhost:4173/';
const OUT = new URL('../screenshots/', import.meta.url).pathname;
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });

async function record(name, viewport, mobile, script) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    recordVideo: { dir: OUT + 'tmp-video', size: viewport },
  });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await script(page);
  const video = page.video();
  await ctx.close();
  renameSync(await video.path(), OUT + name);
  console.log('saved', OUT + name);
}

await record('demo-desktop.webm', { width: 1280, height: 800 }, false, async (p) => {
  await p.waitForTimeout(2600); // load sequence
  await p.locator('g.marker[aria-label="Squat Rack"]').hover();
  await p.waitForTimeout(700);
  await p.getByRole('button', { name: 'Glutes', exact: true }).click();
  await p.waitForTimeout(2200); // glow pulse
  await p.getByRole('button', { name: 'Clear' }).click();
  await p.waitForTimeout(500);
  await p.locator('g.marker[aria-label="Lat Pulldown"]').click();
  await p.waitForTimeout(2200); // zoom + drawer
  await p.keyboard.press('Escape');
  await p.waitForTimeout(1300); // zoom back out
  await p.locator('g.marker[aria-label="Smith Machine"]').click();
  await p.waitForTimeout(2000);
  await p.getByRole('button', { name: 'Close details' }).click();
  await p.waitForTimeout(1200);
});

await record('demo-mobile.webm', { width: 390, height: 844 }, true, async (p) => {
  await p.waitForTimeout(2600);
  await p.locator('g.marker[aria-label="Leg Press"]').tap();
  await p.waitForTimeout(2200);
  await p.getByRole('button', { name: 'Close details' }).tap();
  await p.waitForTimeout(1200);
  await p.locator('.map-scroll').evaluate((el) => el.scrollTo({ left: 400, behavior: 'smooth' }));
  await p.waitForTimeout(800);
  await p.locator('g.marker[aria-label="Dumbbell Rack"]').tap();
  await p.waitForTimeout(2200);
  await p.getByRole('button', { name: 'Close details' }).tap();
  await p.waitForTimeout(1200);
});

await browser.close();
rmSync(OUT + 'tmp-video', { recursive: true, force: true });
