import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Minimal recharts-style bar chart using pure divs
const BAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b']
const MONTHLY = {
    '2024 Q4': [{ m: 'Okt', rev: 4850, cost: 2100, profit: 2750 }, { m: 'Nov', rev: 6200, cost: 2400, profit: 3800 }, { m: 'Des', rev: 8400, cost: 2800, profit: 5600 }],
    '2025 Q1': [{ m: 'Jan', rev: 5100, cost: 2200, profit: 2900 }, { m: 'Feb', rev: 5800, cost: 2350, profit: 3450 }, { m: 'Mar', rev: 6700, cost: 2500, profit: 4200 }],
}
const BRANCHES = {
    'Semua': { rev: 'Rp 74.2Jt', growth: '+18%', orders: 3241, avg: 'Rp 22.9rb' },
    'Jakarta': { rev: 'Rp 28.5Jt', growth: '+22%', orders: 1240, avg: 'Rp 23.0rb' },
    'Bandung': { rev: 'Rp 19.1Jt', growth: '+12%', orders: 890, avg: 'Rp 21.5rb' },
    'Surabaya': { rev: 'Rp 15.4Jt', growth: '+21%', orders: 658, avg: 'Rp 23.4rb' },
    'Bali': { rev: 'Rp 11.2Jt', growth: '+8%', orders: 453, avg: 'Rp 24.7rb' },
}
const TOP_PRODUCTS = [
    { n: 'Batik Premium Pria', sales: 523, rev: 'Rp 23.5Jt', cat: 'Kemeja' },
    { n: 'Dress Batik Wanita', sales: 412, rev: 'Rp 22.6Jt', cat: 'Dress' },
    { n: 'Kain Batik Tulis', sales: 87, rev: 'Rp 10.4Jt', cat: 'Kain' },
    { n: 'Set Couple Batik', sales: 198, rev: 'Rp 9.4Jt', cat: 'Set' },
    { n: 'Sarung Batik Eksklusif', sales: 310, rev: 'Rp 4.9Jt', cat: 'Sarung' },
]
export default function RetailSalesApp() {
    const navigate = useNavigate()
    const [period, setPeriod] = useState('2025 Q1')
    const [branch, setBranch] = useState('Semua')
    const [tab, setTab] = useState('overview')
    const data = MONTHLY[period]
    const maxRev = Math.max(...data.map(d => d.rev))
    const binfo = BRANCHES[branch]
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter",sans-serif' }}>
            
            <div style={{ background: '#1e293b', padding: '1.5rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.15em', marginBottom: '4px' }}>DATA ANALYTICS DASHBOARD</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Retail Sales Analytics</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select aria-label="Select option" value={period} onChange={e => setPeriod(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        {Object.keys(MONTHLY).map(p => <option key={p} value={p} style={{ color: '#000' }}>{p}</option>)}
                    </select>
                    <select aria-label="Select option" value={branch} onChange={e => setBranch(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        {Object.keys(BRANCHES).map(b => <option key={b} value={b} style={{ color: '#000' }}>{b}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[['Total Revenue', binfo.rev, '📈', binfo.growth], ['Total Pesanan', String(binfo.orders), '🛒', '+15%'], ['Avg. Transaksi', binfo.avg, '💳', '+3%'], ['Konversi', '3.4%', '🎯', '+0.5%']].map(([l, v, i, t]) => (
                        <div key={l} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{i}</span>
                                <span style={{ background: '#d1fae5', color: '#059669', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>{t}</span>
                            </div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{v}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{l}</div>
                        </div>
                    ))}
                </div>
                {/* Tab nav */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                    {[['overview', 'Overview'], ['products', 'Produk Terlaris'], ['branches', 'Perbandingan Cabang']].map(([k, l]) => (
                        <button aria-label="Action button" key={k} onClick={() => setTab(k)} style={{ padding: '9px 20px', borderRadius: '8px', background: tab === k ? '#6366f1' : '#fff', color: tab === k ? '#fff' : '#64748b', fontWeight: tab === k ? 700 : 500, cursor: 'pointer', fontSize: '0.85rem', border: tab !== k ? '1px solid #e2e8f0' : 'none' }}>{l}</button>
                    ))}
                </div>
                {tab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Revenue Bulanan ({period})</h2>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', height: '200px', padding: '0 0 0.5rem' }}>
                                {data.map((d, i) => (
                                    <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1' }}>{(d.rev / 1000).toFixed(1)}K</div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '160px', gap: '2px' }}>
                                            <div style={{ height: `${(d.profit / maxRev) * 160}px`, background: '#c7d2fe', borderRadius: '4px 4px 0 0', minHeight: '4px', transition: 'height 0.3s' }} />
                                            <div style={{ height: `${((d.rev - d.profit) / maxRev) * 160}px`, background: '#6366f1', borderRadius: '0', minHeight: '4px' }} />
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{d.m}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.78rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#6366f1', borderRadius: '2px' }} /> Revenue</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#c7d2fe', borderRadius: '2px' }} /> Profit</span>
                            </div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Ringkasan {period}</h2>
                            {data.map((d, i) => (
                                <div key={d.m} style={{ padding: '12px 0', borderBottom: i < data.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{d.m}</span>
                                        <span style={{ fontWeight: 800, color: '#6366f1', fontSize: '0.9rem' }}>Rp {d.rev.toLocaleString()}</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: '#6366f1', borderRadius: '3px', width: `${(d.rev / maxRev) * 100}%`, transition: 'width 0.3s' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab === 'products' && (
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 1.5rem', background: '#f8fafc', fontWeight: 600, color: '#64748b', fontSize: '0.8rem', borderBottom: '1px solid #e2e8f0' }}>
                            {['Produk', 'Kategori', 'Terjual', 'Revenue'].map(h => <div key={h}>{h}</div>)}
                        </div>
                        {TOP_PRODUCTS.map((p, i) => (
                            <div key={p.n} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 1.5rem', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: BAR_COLORS[i] + '20', color: BAR_COLORS[i], fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{p.n}</span>
                                </div>
                                <span style={{ fontSize: '0.8rem', background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontWeight: 600, display: 'inline-block' }}>{p.cat}</span>
                                <span style={{ fontWeight: 700, color: '#374151' }}>{p.sales}</span>
                                <span style={{ fontWeight: 700, color: '#6366f1' }}>{p.rev}</span>
                            </div>
                        ))}
                    </div>
                )}
                {tab === 'branches' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
                        {Object.entries(BRANCHES).filter(([k]) => k !== 'Semua').map(([name, info], i) => (
                            <div key={name} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{name}</span>
                                    <span style={{ background: '#d1fae5', color: '#059669', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>{info.growth}</span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: BAR_COLORS[i], marginBottom: '8px' }}>{info.rev}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📦 {info.orders} pesanan · 💳 {info.avg}/transaksi</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
