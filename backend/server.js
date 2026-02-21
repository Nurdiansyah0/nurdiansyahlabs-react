/**
 * NurdiansyahLabs SEO Backend
 * Express server that monitors Google Trends for service-relevant keywords
 * Port: 3001 (proxied to frontend dev at 5173)
 */
import express from 'express'
import cors from 'cors'
import googleTrends from 'google-trends-api'
import cron from 'node-cron'

const app = express()
const PORT = 3001

app.use(cors({ origin: ['http://localhost:5173', 'https://nurdiansyahlabs.com'] }))
app.use(express.json())

// ── Service keyword groups ────────────────────────────────────────────────────
const SERVICE_KEYWORDS = {
    landing_page: [
        'jasa landing page', 'buat website bisnis', 'landing page murah',
        'jasa web design', 'website UMKM', 'pembuatan website profesional',
    ],
    fullstack: [
        'jasa fullstack developer', 'buat sistem web', 'jasa aplikasi web custom',
        'programmer freelance indonesia', 'sistem inventory online', 'aplikasi kasir web',
    ],
    data_analyst: [
        'jasa analisis data', 'buat dashboard bisnis', 'jasa visualisasi data',
        'laporan data penjualan', 'jasa power bi', 'jasa tableau indonesia',
    ],
    data_science: [
        'jasa machine learning', 'prediksi penjualan data', 'jasa data scientist',
        'sistem rekomendasi produk', 'analisis sentimen', 'forecasting bisnis',
    ],
}

// ── In-memory cache (persists while server is running) ────────────────────────
let trendsCache = {
    lastUpdated: null,
    data: {},
    opportunities: [],
}

// ── Fetch trends for a single keyword ────────────────────────────────────────
async function fetchKeywordTrend(keyword) {
    try {
        const results = await googleTrends.interestOverTime({
            keyword,
            geo: 'ID',                 // Indonesia
            startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days
            endTime: new Date(),
        })
        const parsed = JSON.parse(results)
        const timeline = parsed?.default?.timelineData || []
        const values = timeline.map(t => t.value[0])
        const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0
        const latest = values[values.length - 1] ?? 0
        const trend = values.length >= 2 ? (values[values.length - 1] - values[values.length - 4]) : 0
        return { keyword, avg, latest, trend, timeline: timeline.slice(-12) }
    } catch (e) {
        // Google Trends returns errors for low-traffic keywords – treat as 0
        return { keyword, avg: 0, latest: 0, trend: 0, timeline: [], error: true }
    }
}

// ── Compute opportunity score (0-100) ─────────────────────────────────────────
function opportunityScore({ avg, latest, trend }) {
    const momentum = trend > 0 ? Math.min(trend * 2, 30) : 0
    return Math.min(Math.round((latest * 0.5) + (avg * 0.3) + momentum), 100)
}

// ── Fetch all service trends ──────────────────────────────────────────────────
async function refreshAllTrends() {
    console.log('[trends] Refreshing keyword data…')
    const data = {}
    const opportunities = []

    for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
        data[service] = []
        for (const kw of keywords) {
            const result = await fetchKeywordTrend(kw)
            const score = opportunityScore(result)
            const record = { ...result, service, score }
            data[service].push(record)
            opportunities.push(record)
            // Small delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 1200))
        }
    }

    // Sort opportunities by score descending
    opportunities.sort((a, b) => b.score - a.score)

    trendsCache = {
        lastUpdated: new Date().toISOString(),
        data,
        opportunities: opportunities.slice(0, 10), // top 10
    }
    console.log('[trends] Refresh complete:', new Date().toLocaleString('id-ID'))
}

// ── API: All trends data ──────────────────────────────────────────────────────
app.get('/api/trends', (req, res) => {
    if (!trendsCache.lastUpdated) {
        return res.status(202).json({ message: 'Data is still loading. Try again in 30 seconds.' })
    }
    res.json(trendsCache)
})

// ── API: Top opportunities ─────────────────────────────────────────────────────
app.get('/api/trends/opportunities', (req, res) => {
    res.json({
        lastUpdated: trendsCache.lastUpdated,
        opportunities: trendsCache.opportunities,
    })
})

// ── API: Single keyword request ───────────────────────────────────────────────
app.get('/api/trends/keyword/:kw', async (req, res) => {
    try {
        const result = await fetchKeywordTrend(decodeURIComponent(req.params.kw))
        res.json({ ...result, score: opportunityScore(result) })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// ── API: Generate sitemap (for dynamic routes) ────────────────────────────────
app.get('/api/sitemap', (req, res) => {
    const base = 'https://nurdiansyahlabs.com'
    const staticPages = ['/', '/showcase/A/landing-page-1', '/showcase/A/landing-page-2',
        '/showcase/A/landing-page-3', '/showcase/A/landing-page-4',
        '/showcase/B/fullstack-1', '/showcase/B/fullstack-2', '/showcase/B/fullstack-3', '/showcase/B/fullstack-4',
        '/showcase/C/data-analyst-1', '/showcase/C/data-analyst-2', '/showcase/C/data-analyst-3', '/showcase/C/data-analyst-4',
        '/showcase/D/data-science-1', '/showcase/D/data-science-2', '/showcase/D/data-science-3', '/showcase/D/data-science-4',
    ]

    const topKeywords = trendsCache.opportunities.slice(0, 5).map(o =>
        `/blog/${o.keyword.toLowerCase().replace(/\s+/g, '-')}`
    )
    const allPages = [...staticPages, ...topKeywords]
    const today = new Date().toISOString().split('T')[0]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

    res.set('Content-Type', 'application/xml')
    res.send(xml)
})

// ── API: Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', lastUpdated: trendsCache.lastUpdated, port: PORT })
})

// ── Schedule: refresh every 6 hours ──────────────────────────────────────────
cron.schedule('0 */6 * * *', () => {
    console.log('[cron] Scheduled refresh triggered')
    refreshAllTrends()
})

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 NurdiansyahLabs SEO Backend running at http://localhost:${PORT}`)
    console.log(`   API Endpoints:`)
    console.log(`   GET /api/trends         → Full trends data (cached)`)
    console.log(`   GET /api/trends/opportunities → Top 10 keyword opportunities`)
    console.log(`   GET /api/trends/keyword/:kw   → Single keyword lookup`)
    console.log(`   GET /api/sitemap        → Dynamic XML sitemap`)
    console.log(`   GET /api/health         → Health check\n`)
    // Fetch on startup (non-blocking)
    setTimeout(refreshAllTrends, 2000)
})
