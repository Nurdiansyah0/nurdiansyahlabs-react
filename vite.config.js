import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import prerender from '@prerenderer/rollup-plugin'
import programmaticData from './src/data/programmatic-seo.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Generate dynamic routes
const programmaticRoutes = programmaticData.industries.map(ind => `/layanan/industri/${ind.slug}`)
const blogRoutes = [
    '/blog/jasa-landing-page-murah-indonesia',
    '/blog/jasa-fullstack-developer-indonesia',
    '/blog/jasa-analisis-data-bisnis-indonesia',
    '/blog/jasa-machine-learning-data-science',
    '/blog/buat-dashboard-bisnis-power-bi-tableau',
    '/blog/berapa-harga-jasa-landing-page-profesional',
    '/blog/cara-memilih-jasa-web-developer-terpercaya',
    '/blog/kapan-bisnis-butuh-data-analyst',
    '/blog/jasa-website-umkm-integrasi-whatsapp',
    '/blog/manfaat-machine-learning-untuk-bisnis-kecil',
    '/blog/programmer-freelance-indonesia'
]

export default defineConfig({
    plugins: [
        react(),
        prerender({
            routes: [
                '/', 
                '/blog', 
                '/trends', 
                '/services/web-development',
                '/services/landing-page',
                '/services/data-analyst',
                '/services/machine-learning',
                '/showcase/landing-page/toko-laptop-batam',
                '/showcase/landing-page/batam-chicken-supplier',
                '/showcase/landing-page/warung-makan',
                '/showcase/landing-page/batam-rental-mobil',
                '/showcase/fullstack/koperasi-pos',
                '/showcase/fullstack/warehouse-wms',
                '/showcase/fullstack/primatera-poultry',
                '/showcase/data-science/smart-vision',
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
                // Optional: Minify HTML here or rely on Vite
            }
        })
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
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    animation: ['framer-motion'],
                    charts: ['recharts'],
                    icons: ['lucide-react']
                }
            }
        }
    }
})
