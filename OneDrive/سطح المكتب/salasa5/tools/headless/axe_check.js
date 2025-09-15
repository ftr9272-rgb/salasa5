const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Load axe-core from node_modules if available, otherwise use CDN
const AXE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js';

(async () => {
  const outDir = path.join(__dirname, 'artifacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const url = process.env.TEST_URL || 'http://127.0.0.1:5000';
  console.log('Visiting', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Try to inject axe from local node_modules or fallback to CDN
  let axeSource = null;
  try {
    axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  } catch (_) {
    console.log('axe-core not found locally; will load from CDN');
  }

  if (axeSource) {
    await page.addScriptTag({ content: axeSource });
  } else {
    await page.addScriptTag({ url: AXE_CDN });
  }

  const results = await page.evaluate(async () => {
    return await new Promise(resolve => {
      // axe is injected as window.axe
      window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2aa'] } })
        .then(results => resolve(results))
        .catch(err => resolve({ error: String(err) }));
    });
  });

  const outPath = path.join(outDir, 'axe-report.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('Wrote axe report to', outPath);

  await browser.close();

  // Fail the process if there are violations
  if (results.violations && results.violations.length > 0) {
    console.error('Accessibility violations found:', results.violations.length);
    process.exit(2);
  }

  console.log('No accessibility violations found (wcag2aa run-only)');
})();