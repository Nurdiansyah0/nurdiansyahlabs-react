import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import prerender from '@prerenderer/rollup-plugin'
import programmaticData from './src/data/programmatic-seo.json' with { type: 'json' }
import showcaseData from './src/data/showcase.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Generate dynamic routes
const programmaticRoutes = programmaticData.industries.map(ind => `/layanan/industri/${ind.slug}`)
const showcaseRoutes = showcaseData.showcases.map(s => `/showcase/${s.categorySlug}/${s.slug}`)
const blogRoutes = [
    '/blog/programmer-freelance-indonesia',
    '/blog/jasa-landing-page-murah-indonesia',
    '/blog/jasa-fullstack-developer-indonesia',
    '/blog/jasa-analisis-data-bisnis-indonesia',
    '/blog/jasa-machine-learning-data-science',
    '/blog/buat-dashboard-bisnis-power-bi-tableau',
    '/blog/berapa-harga-jasa-landing-page-profesional',
    '/blog/cara-memilih-jasa-web-developer-terpercaya',
    '/blog/kapan-bisnis-butuh-data-analyst',
    '/blog/jasa-website-umkm-integrasi-whatsapp',
    '/blog/integrasi-ai-agent-whatsapp-bot-umkm',
    '/blog/manfaat-machine-learning-untuk-bisnis-kecil',
    '/blog/arsitektur-software-enterprise-monolith-vs-microservices',
    '/blog/panduan-full-sdlc-software-engineer-enterprise',
    '/blog/migrasi-excel-ke-custom-erp-operasional',
    '/blog/optimasi-database-postgresql-high-concurrency-transaksi',
    '/blog/studi-kasus-arsitektur-wms-pos-terdistribusi'
]

const enablePrerender = process.platform !== 'android' && process.env.DISABLE_PRERENDER !== 'true'

export default defineConfig({
    plugins: [
        react(),
        ...(enablePrerender ? [
            prerender({
                routes: [
                    '/', 
                    '/blog',
                    '/trends',
                    '/services/web-development',
                    '/services/landing-page',
                    '/services/data-analyst',
                    '/services/machine-learning',
                    ...showcaseRoutes,
                    ...programmaticRoutes,
                    ...blogRoutes
                ],

                renderer: '@prerenderer/renderer-puppeteer',
                rendererOptions: {
                    maxConcurrentRoutes: 4,
                    renderAfterTime: 3000,
                    launchOptions: {
                        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                    }
                },
                server: {
                    port: 3000,
                    host: '127.0.0.1'
                },
                postProcess(renderedRoute) {
                    // Ignore any redirects.
                    renderedRoute.route = renderedRoute.originalRoute

                    // Enforce deterministic self-referencing canonical & og:url across all prerendered routes
                    const siteUrl = 'https://nurdiansyahlabs.com'
                    const routePath = renderedRoute.originalRoute === '/'
                        ? '/'
                        : `/${renderedRoute.originalRoute.replace(/^\/+|\/+$/g, '')}`
                    const expectedCanonical = routePath === '/' ? `${siteUrl}/` : `${siteUrl}${routePath}`

                    // Strip any existing canonical links and inject a single authoritative self-referencing canonical
                    renderedRoute.html = renderedRoute.html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/gi, '')
                    renderedRoute.html = renderedRoute.html.replace(
                        /<\/head>/i,
                        `  <link rel="canonical" href="${expectedCanonical}" data-rh="true" />\n</head>`
                    )
                    renderedRoute.html = renderedRoute.html.replace(
                        /<meta[^>]*property=["']og:url["'][^>]*>/gi,
                        `<meta property="og:url" content="${expectedCanonical}" data-rh="true" />`
                    )
                }
            })
        ] : [])
    ],
    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
                changeOrigin: true,
            },
            '/upload_articles': {
                target: process.env.BACKEND_URL || 'http://127.0.0.1:8000',
                changeOrigin: true,
            }
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('recharts') || id.includes('d3-')) return 'charts'
                        if (id.includes('framer-motion') || id.includes('motion-')) return 'animation'
                        if (id.includes('react-router')) return 'router'
                        if (id.includes('lucide-react')) return 'icons'
                        if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'vendor'
                    }
                }
            }
        }
    }
})
