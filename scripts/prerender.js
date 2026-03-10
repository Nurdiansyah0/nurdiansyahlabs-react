import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE_URL = 'https://nurdiansyahlabs.com';

// Load SEO datasets
const services = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/services.json'), 'utf-8')).services;
const showcases = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/showcase.json'), 'utf-8')).showcases;

const routes = [
    '/',
    '/trends',
    '/blog',
    ...services.map(s => `/services/${s.slug}`),
    ...showcases.map(s => `/showcase/${s.categorySlug}/${s.slug}`),
];

async function generateSitemap(routes) {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${SITE_URL}${route === '/' ? '' : route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
    console.log('Sitemap generated successfully!');
}

async function prerender() {
    const app = express();
    app.use(express.static(DIST_DIR));

    // Catch-all for SPA routing
    app.use((req, res, next) => {
        if (!req.path.includes('.')) {
            res.sendFile(path.join(DIST_DIR, 'index.html'));
        } else {
            next();
        }
    });

    const server = app.listen(PORT, async () => {
        console.log(`Server started at http://localhost:${PORT}`);
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        for (const route of routes) {
            console.log(`Prerendering: ${route}`);
            try {
                await page.goto(`http://localhost:${PORT}${route}`, {
                    waitUntil: 'networkidle0',
                    timeout: 45000
                });

                await page.waitForSelector('#root', { timeout: 15000 });

                const content = await page.content();
                const fileName = route === '/' ? 'index.html' : (route.endsWith('/') ? route + 'index.html' : route + '/index.html');
                const filePath = path.join(DIST_DIR, fileName);

                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                fs.writeFileSync(filePath, content);
                console.log(`Saved: ${filePath}`);
            } catch (err) {
                console.error(`Failed to prerender ${route}:`, err.message);
            }
        }

        await browser.close();
        server.close();

        // Generate sitemap after prerendering
        await generateSitemap(routes);

        console.log('Static Prerendering & Sitemap Generation Complete!');
        process.exit(0);
    });
}

prerender().catch(err => {
    console.error('Fatal error during prerendering:', err);
    process.exit(1);
});
