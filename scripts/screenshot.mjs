// Takes screenshots of the built app. Usage:
//   npm run build && npx vite preview --port 4173 &   (in another terminal)
//   npm run screenshots
// Uses playwright-core with a locally installed Chrome/Chromium.
// Set CHROME_PATH if your browser lives elsewhere.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.APP_URL || 'http://localhost:4173/';
const OUT = new URL('../screenshots/', import.meta.url).pathname;
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });

async function shot(name, { width, height, mobile = false, fullPage = false }, action) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  if (action) await action(page);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + name, fullPage });
  console.log('saved', OUT + name);
  await ctx.close();
}

const desktop = { width: 1366, height: 900 };
const phone = { width: 390, height: 844, mobile: true };

await shot('01-desktop-map.png', { ...desktop, fullPage: true });
await shot('02-desktop-search-glutes.png', desktop, async (p) => {
  await p.getByRole('button', { name: 'Glutes', exact: true }).click();
});
await shot('03-desktop-detail-leg-press.png', desktop, async (p) => {
  await p.locator('g.marker[aria-label="Leg Press"]').click();
  await p.waitForSelector('.detail iframe');
  await p.waitForTimeout(2500);
});
await shot('04-mobile-map.png', phone);
await shot('05-mobile-detail-lat-pulldown.png', phone, async (p) => {
  await p.locator('.machine-row', { hasText: 'Lat Pulldown' }).click();
  await p.waitForSelector('.detail iframe');
  await p.waitForTimeout(2500);
});
await shot('06-mobile-search-fallback-bike.png', phone, async (p) => {
  await p.fill('input[type=search]', 'bike');
  await p.locator('.machine-row', { hasText: 'Stationary Bike' }).click();
});

await browser.close();
