import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In production (cPanel), the PHP API lives at /api/trends.php
// In dev, the Node.js backend runs on localhost:3001
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true,
        // Proxy /api/* to the Node.js backend during local dev
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            }
        }
    },
    build: {
        // Output to dist/ for cPanel upload
        outDir: 'dist',
        // Ensure assets are hashed for cache busting
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    motion: ['framer-motion'],
                }
            }
        }
    }
})
