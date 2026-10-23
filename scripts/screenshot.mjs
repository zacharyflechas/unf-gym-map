// Takes screenshots of the built app. Usage:
//   npm run build && npx vite preview --port 4173 &   (in another terminal)
//   npm run screenshots
// Uses playwright-core with a locally installed Chrome/Chromium.
// Set CHROME_PATH if your browser lives elsewhere.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.APP_URL || 'http://localhost:4173/';
const OUT = new URL('../screenshots/', import.meta.url).pathname;
const PREFIX = process.env.SHOT_PREFIX || ''; // e.g. SHOT_PREFIX=draft-
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
  await page.waitForTimeout(2500); // let the load + zoom animations settle
  await page.screenshot({ path: OUT + PREFIX + name, fullPage });
  console.log('saved', OUT + PREFIX + name);
  await ctx.close();
}

const desktop = { width: 1366, height: 900 };
const phone = { width: 390, height: 844, mobile: true };

await shot('01-desktop-map.png', { ...desktop, fullPage: true });
await shot('02-desktop-search-glutes.png', desktop, async (p) => {
  await p.getByRole('button', { name: 'Glutes', exact: true }).click();
});
await shot('03-desktop-detail-half-racks.png', desktop, async (p) => {
  await p.locator('g.item[aria-label="Rack r1"]').click();
  await p.waitForSelector('.detail iframe');
  await p.waitForTimeout(2500);
});
await shot('04-mobile-map.png', phone);
await shot('05-mobile-detail-synergy-360.png', phone, async (p) => {
  await p.locator('.machine-row', { hasText: 'Synergy 360 Rig' }).click();
  await p.waitForSelector('.detail iframe');
  await p.waitForTimeout(2500);
});
await shot('06-mobile-search-fallback-nautilus.png', phone, async (p) => {
  await p.fill('input[type=search]', 'nautilus');
  await p.locator('.machine-row', { hasText: 'Nautilus One' }).click();
});

// Extra: detail panel scrolled to the draft/source info box.
{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '#cozy-corner-none', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.locator('.machine-row', { hasText: 'Nautilus One Circuit' }).click();
  await page.waitForTimeout(1500);
  await page.locator('.draft-info').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + PREFIX + '07-desktop-detail-sources.png' });
  console.log('saved', OUT + PREFIX + '07-desktop-detail-sources.png');
  await ctx.close();
}
await browser.close();
