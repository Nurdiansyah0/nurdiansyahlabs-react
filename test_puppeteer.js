import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto('http://127.0.0.1:3006/blog', { waitUntil: 'networkidle0' });
  const html = await page.content();
  console.log("HTML HEAD TITLE:", await page.title());
  await browser.close();
})();
