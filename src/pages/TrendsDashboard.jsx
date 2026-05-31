import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const SERVICE_LABELS = {
    landing_page: { label: 'Landing Page', color: '#172554', bg: '#dbeafe', icon: 'fa-layer-group' },
    fullstack: { label: 'Fullstack Dev', color: '#1e1b4b', bg: '#e0e7ff', icon: 'fa-code' },
    data_analyst: { label: 'Data Analyst', color: '#022c22', bg: '#d1fae5', icon: 'fa-chart-pie' },
    data_science: { label: 'Data Scientist', color: '#2e1065', bg: '#ede9fe', icon: 'fa-brain' },
}

function ScoreBar({ score }) {
    const color = score >= 70 ? '#166534' : score >= 40 ? '#b45309' : '#1e293b'
    return (
        <div style={{ background: '#f1f5f9', borderRadius: '9999px', height: '8px', width: '100%', overflow: 'hidden' }}>
            <m.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: color, borderRadius: '9999px' }}
            />
        </div>
    )
}

function KeywordCard({ item, index }) {
    const svc = SERVICE_LABELS[item.service] || {}
    const scoreColor = item.score >= 70 ? '#166534' : item.score >= 40 ? '#b45309' : '#1e293b'
    const trendArrow = item.trend > 5 ? '↑' : item.trend < -5 ? '↓' : '→'
    const trendColor = item.trend > 5 ? '#166534' : item.trend < -5 ? '#b91c1c' : '#1e293b'

    return (
        <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            style={{
                background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
                border: '1.5px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '0.75rem'
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                        {item.keyword}
                    </div>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: '9999px',
                        background: svc.bg, color: svc.color,
                    }}>
                        <i className={`fas ${svc.icon}`} style={{ marginRight: '4px', fontSize: '0.65rem' }} />
                        {svc.label}
                    </span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                        {item.score}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#1e293b', fontWeight: 600 }}>SCORE</div>
                </div>
            </div>

            {/* Score bar */}
            <ScoreBar score={item.score} />

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#1e293b' }}>
                <div><strong style={{ color: '#1e293b' }}>{item.latest}</strong> current</div>
                <div><strong style={{ color: '#1e293b' }}>{item.avg}</strong> avg (90d)</div>
                <div style={{ color: trendColor, fontWeight: 700 }}>{trendArrow} {Math.abs(item.trend)} trend</div>
            </div>

            {/* CTA */}
            {item.score >= 50 && (
                <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #bbf7d0',
                    borderRadius: '8px', padding: '6px 12px', fontSize: '0.72rem', color: '#166534', fontWeight: 600
                }}>
                    🔥 High opportunity — consider creating content for this keyword
                </div>
            )}
        </m.div>
    )
}

function LoadingCard() {
    return (
        <div style={{
            background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem',
            border: '1.5px solid #e2e8f0', overflow: 'hidden'
        }}>
            {[80, 50, 100].map((w, i) => (
                <div key={i} style={{ height: i === 0 ? '18px' : '10px', background: '#f1f5f9', borderRadius: '4px', width: `${w}%`, marginBottom: '10px' }} />
            ))}
        </div>
    )
}

export default function TrendsDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('all')
    const { t } = useLanguage()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/trends.php')
                if (res.status === 202) {
                    setError('loading')
                    setLoading(false)
                    return
                }
                const json = await res.json()
                setData(json)
                setLoading(false)
            } catch {
                setError('offline')
                setLoading(false)
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    // Flatten all keywords for the selected filter
    const displayed = (() => {
        if (!data) return []
        if (activeFilter === 'all') return data.opportunities || []
        const cards = data.data?.[activeFilter] || []
        return [...cards].sort((a, b) => b.score - a.score)
    })()

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                padding: '3rem 1.5rem 2.5rem', color: '#fff'
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #4338ca, #6d28d9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <i className="fas fa-chart-line" style={{ fontSize: '1.2rem', color: '#fff' }} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
                                Google Trends Monitor
                            </h1>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a5b4fc' }}>
                                NurdiansyahLabs · Auto-updated every 6 hours · Indonesia (ID)
                            </p>
                        </div>
                    </div>
                    {data?.lastUpdated && (
                        <div style={{ fontSize: '0.75rem', color: '#1e293b', marginTop: '0.5rem' }}>
                            Last updated: {new Date(data.lastUpdated).toLocaleString('id-ID')}
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 1.5rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '4px', overflowX: 'auto' }}>
                    {[['all', 'fa-fire', '🔥 Top Opportunities'], ...Object.entries(SERVICE_LABELS).map(([k, v]) => [k, v.icon, v.label])].map(([key, icon, label]) => (
                        <button aria-label="Action button"
                            key={key}
                            onClick={() => setActiveFilter(key)}
                            style={{
                                padding: '0.85rem 1.1rem', fontWeight: 700, fontSize: '0.8rem', border: 'none',
                                cursor: 'pointer', whiteSpace: 'nowrap', background: 'transparent',
                                color: activeFilter === key ? '#3730a3' : '#1e293b',
                                borderBottom: activeFilter === key ? '2.5px solid #3730a3' : '2.5px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <i className={`fas ${icon}`} style={{ marginRight: '6px' }} />{label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
                {/* Status banners */}
                {loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        {Array(6).fill(0).map((_, i) => <LoadingCard key={i} />)}
                    </div>
                )}
                {error === 'offline' && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#1e293b' }}>
                        <i className="fas fa-server" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.4 }} />
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Backend not running</div>
                        <div style={{ fontSize: '0.85rem' }}>
                            Start it with: <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>php -S localhost:8000 -t backend-php</code>
                        </div>
                    </div>
                )}
                {error === 'loading' && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#1e293b' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Fetching Google Trends data…</div>
                        <div style={{ fontSize: '0.85rem' }}>This takes ~2 minutes on first load. Page auto-refreshes.</div>
                    </div>
                )}

                {/* Keyword cards */}
                {!loading && !error && (
                    <>
                        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                                {displayed.length} keyword{displayed.length !== 1 ? 's' : ''} found
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#1e293b' }}>
                                Score = search interest × momentum (0–100)
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            <AnimatePresence>
                                {displayed.map((item, i) => (
                                    <KeywordCard key={`${item.service}-${item.keyword}`} item={item} index={i} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}

                {/* SEO Action Panel */}
                {!loading && !error && data?.opportunities?.length > 0 && (
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            marginTop: '2.5rem', background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                            borderRadius: '20px', padding: '2rem', color: '#fff'
                        }}
                    >
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            🎯 Auto-Generated SEO Pages
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#a5b4fc', marginBottom: '1.25rem' }}>
                            These blog pages are auto-generated from trending keywords to help Google discover your site.
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {data.opportunities.slice(0, 5).map(o => {
                                const slug = o.keyword.toLowerCase().replace(/\s+/g, '-')
                                return (
                                    <a
                                        key={slug}
                                        href={`/blog/${slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            background: 'rgba(255,255,255,0.12)', color: '#e0e7ff',
                                            padding: '5px 14px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 600,
                                            textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        /blog/{slug}
                                    </a>
                                )
                            })}
                        </div>
                    </m.div>
                )}
            </div>
        </main>
    )
}
