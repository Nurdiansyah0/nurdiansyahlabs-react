import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { 
    TrendingUp, Layers, Code2, PieChart, Brain, 
    Server, Flame, Sparkles, Clock, AlertCircle 
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/seo/SEO'

const SERVICE_LABELS = {
    landing_page: { label: 'Web & Landing Page', color: '#172554', bg: '#dbeafe', icon: Layers },
    fullstack: { label: 'Fullstack Dev & ERP', color: '#1e1b4b', bg: '#e0e7ff', icon: Code2 },
    data_analyst: { label: 'Data Analyst & BI', color: '#022c22', bg: '#d1fae5', icon: PieChart },
    data_science: { label: 'Data Science & AI', color: '#2e1065', bg: '#ede9fe', icon: Brain },
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
    const Icon = svc.icon || TrendingUp
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
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        {item.keyword}
                    </div>
                    <span style={{
                        fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px',
                        background: svc.bg || '#f1f5f9', color: svc.color || '#334155',
                        display: 'inline-flex', alignItems: 'center', gap: '5px'
                    }}>
                        <Icon size={12} />
                        {svc.label || item.service}
                    </span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                        {item.score}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>SKOR</div>
                </div>
            </div>

            {/* Score bar */}
            <ScoreBar score={item.score} />

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#64748B' }}>
                <div><strong style={{ color: '#0F172A' }}>{item.latest}</strong> tren saat ini</div>
                <div><strong style={{ color: '#0F172A' }}>{item.avg}</strong> rata-rata (90h)</div>
                <div style={{ color: trendColor, fontWeight: 700 }}>{trendArrow} {Math.abs(item.trend)} momentum</div>
            </div>

            {/* CTA */}
            {item.score >= 50 && (
                <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #bbf7d0',
                    borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', color: '#166534', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                    <Flame size={14} color="#166534" /> Peluang tinggi — permintaan pencarian sedang meningkat
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
    const { isIndo } = useLanguage()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/v1/trends')
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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
            <SEO
                title="Google Trends Monitor Indonesia | NurdiansyahLabs"
                description="Live Google Trends analytics and real-time market search intelligence dashboard for digital services and software engineering in Indonesia."
                canonical="/trends"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Trends Monitor', url: '/trends' }
                ]}
            />

            <Navbar />

            <main style={{ flex: 1 }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #070A0F 0%, #0F172A 50%, #1E1B4B 100%)',
                    padding: '3.5rem 1.5rem 2.75rem', color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.85rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
                            }}>
                                <TrendingUp size={24} color="#fff" />
                            </div>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
                                    Google Trends Monitor
                                </h1>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: '#A5B4FC' }}>
                                    NurdiansyahLabs · Pembaruan Otomatis Setiap 6 Jam · Wilayah Indonesia (ID)
                                </p>
                            </div>
                        </div>
                        {data?.lastUpdated && (
                            <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={13} /> Terakhir diperbarui: {new Date(data.lastUpdated).toLocaleString('id-ID')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 1.5rem', position: 'sticky', top: '64px', zIndex: 10 }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                        {[
                            ['all', Flame, '🔥 Peluang Teratas'],
                            ...Object.entries(SERVICE_LABELS).map(([k, v]) => [k, v.icon, v.label])
                        ].map(([key, Icon, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(key)}
                                style={{
                                    padding: '0.9rem 1.1rem', fontWeight: 700, fontSize: '0.82rem', border: 'none',
                                    cursor: 'pointer', whiteSpace: 'nowrap', background: 'transparent',
                                    color: activeFilter === key ? '#4F46E5' : '#64748B',
                                    borderBottom: activeFilter === key ? '2.5px solid #4F46E5' : '2.5px solid transparent',
                                    transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px'
                                }}
                            >
                                <Icon size={14} />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem 4rem' }}>
                    {/* Status banners */}
                    {loading && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            {Array(6).fill(0).map((_, i) => <LoadingCard key={i} />)}
                        </div>
                    )}
                    {error === 'offline' && (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <Server size={36} style={{ margin: '0 auto 1rem', color: '#94A3B8' }} />
                            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Backend Analytics Istirahat</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>
                                Data tren di-cache dan akan otomatis diperbarui saat background worker aktif.
                            </div>
                        </div>
                    )}
                    {error === 'loading' && (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>Mengambil Data Google Trends Terbaru…</div>
                            <div style={{ fontSize: '0.88rem', color: '#64748B' }}>Proses ini membutuhkan ~2 menit pada sinkronisasi pertama. Halaman akan me-refresh otomatis.</div>
                        </div>
                    )}

                    {/* Keyword cards */}
                    {!loading && !error && (
                        <>
                            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ fontWeight: 800, color: '#0F172A' }}>
                                    Ditemukan {displayed.length} Kata Kunci Potensial
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                    Skor = Minat Pencarian × Laju Momentum (0–100)
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
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
                                marginTop: '2.5rem', background: 'linear-gradient(135deg, #070A0F 0%, #1E1B4B 100%)',
                                borderRadius: '20px', padding: '2rem', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <div style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={18} color="#818CF8" /> Halaman SEO Berkinerja Tinggi
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#CBD5E1', marginBottom: '1.25rem' }}>
                                Halaman blog berikut ditargetkan secara khusus untuk menangkap tren pencarian pasar Indonesia:
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
                                                background: 'rgba(255,255,255,0.08)', color: '#E0E7FF',
                                                padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600,
                                                textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)',
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

            <Footer />
        </div>
    )
}
