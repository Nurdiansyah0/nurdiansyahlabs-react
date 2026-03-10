import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
    { url: 'http://localhost:5173/showcase/landing-page/toko-laptop-batam', name: 'ss_laptop.png' },
    { url: 'http://localhost:5173/showcase/landing-page/batam-chicken-supplier', name: 'ss_chicken.png' },
    { url: 'http://localhost:5173/showcase/landing-page/warung-makan', name: 'ss_siomay.png' },
    { url: 'http://localhost:5173/showcase/landing-page/batam-rental-mobil', name: 'ss_rental.png' }
];

async function capture() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    for (const route of routes) {
        console.log(`Capturing ${route.url}...`);
        try {
            await page.goto(route.url, { waitUntil: 'networkidle0', timeout: 30000 });
            // Wait a bit for animations
            await new Promise(r => setTimeout(r, 2000));
            const outputPath = path.join(__dirname, '../public/assets/projects/screenshots', route.name);
            await page.screenshot({ path: outputPath, fullPage: false });
            console.log(`Saved to ${outputPath}`);
        } catch (e) {
            console.error(`Failed to capture ${route.url}: ${e.message}`);
        }
    }

    await browser.close();
}

capture();
