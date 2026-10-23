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

async function shot(name, { width, height, mobile = false, fullPage = false, scheme = 'light', path = '' }, action) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    colorScheme: scheme,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  if (action) await action(page);
  await page.waitForTimeout(1500); // let the load + glide animations settle
  await page.screenshot({ path: OUT + PREFIX + name, fullPage });
  console.log('saved', OUT + PREFIX + name);
  await ctx.close();
}

const desktop = { width: 1366, height: 900 };
const phone = { width: 390, height: 844, mobile: true };

await shot('01-desktop-map.png', { ...desktop, fullPage: true });
await shot('02-desktop-search-glutes.png', desktop, (p) => p.fill('input[type=search]', 'glutes'));
await shot('03-desktop-detail-half-racks.png', desktop, (p) => p.locator('g.item[aria-label="Rack r1"]').click());
await shot('04-mobile-map.png', phone);
await shot('05-mobile-detail-synergy-360.png', phone, async (p) => {
  await p.click('text=List view');
  await p.locator('.machine-row', { hasText: 'Synergy 360 Rig' }).click();
});
await shot('06-mobile-dark.png', { ...phone, scheme: 'dark' });
await shot('07-desktop-track-level.png', { ...desktop, path: '?level=3f' });
await browser.close();
