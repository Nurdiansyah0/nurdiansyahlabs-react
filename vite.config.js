import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import vitePrerender from 'vite-plugin-prerender'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Renderer = vitePrerender.PuppeteerRenderer

export default defineConfig({
    plugins: [
        react(),
        vitePrerender({
            staticDir: path.join(__dirname, 'dist'),
            routes: ['/', '/blog', '/trends', '/admin'],
            renderer: new Renderer({
                renderAfterDocumentEvent: 'render-event'
            })
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
