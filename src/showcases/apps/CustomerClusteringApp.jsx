import { useState, useMemo } from 'react'
const CLUSTERS = [
    { id: 0, name: 'Champions', color: '#6366f1', bg: '#ede9fe', count: 312, rfm: 'R:5 F:5 M:5', revenue: 'Rp 4.8Jt avg', desc: 'Top customers dengan frekuensi dan nilai transaksi tertinggi. Fidelitas sangat tinggi.', action: 'Reward dengan loyalty program eksklusif' },
    { id: 1, name: 'Loyal', color: '#10b981', bg: '#d1fae5', count: 489, rfm: 'R:4 F:4 M:3', revenue: 'Rp 2.1Jt avg', desc: 'Pelanggan setia dengan pembelian rutin. Nilai transaksi sedang namun konsisten.', action: 'Upsell produk premium dan cross-sell' },
    { id: 2, name: 'At Risk', color: '#f59e0b', bg: '#fef3c7', count: 234, rfm: 'R:2 F:3 M:3', revenue: 'Rp 1.4Jt avg', desc: 'Pelanggan yang pernah aktif namun jarang bertransaksi belakangan ini.', action: 'Kirim personalized re-engagement email' },
    { id: 3, name: 'Lost', color: '#ef4444', bg: '#fee2e2', count: 178, rfm: 'R:1 F:1 M:2', revenue: 'Rp 0.8Jt avg', desc: 'Pelanggan yang sudah lama tidak melakukan transaksi. Perlu win-back campaign.', action: 'Tawarkan diskon besar sekali pakai' },
]
// Scatter plot data — generated once per mount via useMemo in the component
const generateScatterPoints = () => CLUSTERS.flatMap(c => Array.from({ length: 20 }).map(() => ({
    x: Math.random() * (c.id === 0 ? 5 : c.id === 1 ? 4 : c.id === 2 ? 3 : 2),
    y: Math.random() * (c.id === 0 ? 5 : c.id === 1 ? 4 : c.id === 2 ? 3 : 2),
    cluster: c.id,
    color: c.color,
})))
export default function CustomerClusteringApp() {
    const [selected, setSelected] = useState(null)
    // useMemo ensures scatter points are generated once, not on every render
    const SCATTER_POINTS = useMemo(() => generateScatterPoints(), [])
    const total = CLUSTERS.reduce((s, c) => s + c.count, 0)
    return (
        <div style={{ minHeight: '100vh', background: '#f8f9ff', fontFamily: '"Inter",sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg,#312e81,#4f46e5)', padding: '1.5rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#c7d2fe', letterSpacing: '0.15em', marginBottom: '4px' }}>DATA SCIENCE / CLUSTERING</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Customer Clustering – RFM Analysis</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{total.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#c7d2fe' }}>Total pelanggan dianalisis</div>
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Cluster cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {CLUSTERS.map(c => (
                        <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)} style={{ background: selected?.id === c.id ? c.bg : '#fff', borderRadius: '14px', padding: '1.25rem', border: `2px solid ${selected?.id === c.id ? c.color : '#e5e7eb'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, marginTop: '4px' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c.color, background: c.bg, padding: '3px 8px', borderRadius: '6px' }}>{c.rfm}</span>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', marginBottom: '2px' }}>{c.count}</div>
                            <div style={{ fontWeight: 700, color: c.color, fontSize: '0.9rem', marginBottom: '2px' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.revenue}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Scatter plot simulation */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#312e81', marginBottom: '1rem' }}>RFM Scatter Plot</h3>
                        <div style={{ position: 'relative', height: '240px', background: '#f8f9ff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                            {/* Axes */}
                            <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center' }}>Frekuensi →</div>
                            <div style={{ position: 'absolute', top: '0', bottom: '0', left: '8px', display: 'flex', alignItems: 'center', fontSize: '0.65rem', color: '#94a3b8', writingMode: 'vertical-lr', textAlign: 'center' }}>← Recency</div>
                            {SCATTER_POINTS.filter(p => selected === null || p.cluster === selected.id).map((p, i) => (
                                <div key={i} style={{ position: 'absolute', left: `${15 + p.x * 16}%`, top: `${10 + p.y * 14}%`, width: '8px', height: '8px', borderRadius: '50%', background: p.color, opacity: 0.75, transition: 'all 0.2s' }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            {CLUSTERS.map(c => <span key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', cursor: 'pointer', opacity: selected && selected.id !== c.id ? 0.4 : 1 }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color }} />{c.name}</span>)}
                        </div>
                    </div>
                    {/* Distribution */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#312e81', marginBottom: '1.5rem' }}>Distribusi Segmen</h3>
                        {CLUSTERS.map(c => (
                            <div key={c.id} style={{ marginBottom: '1rem', opacity: selected && selected.id !== c.id ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{c.name}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: c.color }}>{c.count} ({Math.round((c.count / total) * 100)}%)</span>
                                </div>
                                <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: c.color, borderRadius: '6px', width: `${(c.count / total) * 100}%`, transition: 'width 0.4s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Selected cluster detail */}
                {selected && (
                    <div style={{ background: selected.bg, borderRadius: '16px', padding: '1.5rem', border: `1px solid ${selected.color}40` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: selected.color, margin: '0 0 0.5rem' }}>{selected.name} Segment</h3>
                                <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.7, marginBottom: '1rem' }}>{selected.desc}</p>
                                <div style={{ background: '#fff', borderRadius: '10px', padding: '1rem', display: 'inline-block' }}><span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>💡 Action: </span><span style={{ fontSize: '0.85rem', color: selected.color, fontWeight: 700 }}>{selected.action}</span></div>
                            </div>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
