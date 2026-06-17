import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const baseUrl = 'http://localhost:5173';

async function captureScreenshots() {
  await mkdir(screenshotsDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Dashboard - KPI cards
  await page.goto(baseUrl);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '01-dashboard-overview.png'), fullPage: true });

  // 2. Dashboard - scroll to orders table
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '02-dashboard-orders-table.png'), fullPage: false });

  // 3. Analytics - all charts
  await page.goto(`${baseUrl}/analytics`);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '03-analytics-charts.png'), fullPage: true });

  // 4. Analytics - with filters applied
  const filterSelects = page.locator('form select');
  await filterSelects.nth(0).selectOption('Electronics');
  await filterSelects.nth(1).selectOption('Europe');
  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '04-analytics-filtered.png'), fullPage: true });

  // 5. Reports listing
  await page.goto(`${baseUrl}/reports`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '05-reports-listing.png'), fullPage: true });

  // 6. Reports - search
  await page.fill('input[placeholder="Search reports..."]', 'Sales');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '06-reports-search.png'), fullPage: true });

  // 7. Report detail
  await page.goto(`${baseUrl}/reports`);
  await page.waitForTimeout(1500);
  const firstRow = page.locator('tbody tr').first();
  if (await firstRow.count() > 0) {
    await firstRow.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '07-report-detail.png'), fullPage: true });
  }

  // 8. Dark mode
  await page.goto(baseUrl);
  await page.waitForTimeout(1500);
  await page.getByLabel('Toggle theme').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '08-dark-mode.png'), fullPage: true });

  // 9. Mobile responsive
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotsDir, '09-mobile-dashboard.png'), fullPage: true });

  await page.getByLabel('Open menu').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '10-mobile-sidebar.png'), fullPage: true });

  await browser.close();
  console.log('Screenshots saved to screenshots/');
}

captureScreenshots().catch((err) => {
  console.error(err);
  process.exit(1);
});
