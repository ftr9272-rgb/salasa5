const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.resolve(__dirname, 'artifacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const logs = [];

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    logs.push({ type: 'console', text: msg.text(), location: msg.location() });
  });

  page.on('pageerror', err => {
    logs.push({ type: 'pageerror', text: err.message });
  });

  page.on('requestfailed', req => {
    logs.push({ type: 'requestfailed', url: req.url(), failure: req.failure() });
  });

  page.on('response', async res => {
    const status = res.status();
    const url = res.url();
    // record 4xx/5xx
    if (status >= 400) logs.push({ type: 'response', url, status });
  });

  try {
    const url = process.env.URL || 'http://127.0.0.1:5000';
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // wait a short while for SPA to hydrate
    await page.waitForTimeout(2000);

    // take screenshot
    const screenshotPath = path.join(outDir, 'screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // try to find marketplace button text
    const hasMarketplace = await page.$eval('body', b => {
      const text = b.innerText || '';
      return /اذهب|السوق الذكي|SmartMarketplace|go to marketplace/i.test(text);
    }).catch(() => false);

    logs.push({ type: 'check', hasMarketplace });

    // save logs
    fs.writeFileSync(path.join(outDir, 'logs.json'), JSON.stringify(logs, null, 2));

    console.log('Done. Artifacts in', outDir);
  } catch (err) {
    console.error('Error in headless run:', err);
    logs.push({ type: 'fatal', error: String(err) });
    fs.writeFileSync(path.join(outDir, 'logs.json'), JSON.stringify(logs, null, 2));
    process.exit(2);
  } finally {
    await browser.close();
  }
})();
