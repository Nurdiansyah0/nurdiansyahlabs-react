import { useState } from 'react'
const PLATFORMS = ['Tokopedia', 'Shopee', 'Lazada', 'Bukalapak']
const DATA = {
    Tokopedia: { orders: 4821, revenue: 'Rp 98.5Jt', ctr: '4.2%', conv: '3.8%', return: '1.2%', color: '#1d4ed8' },
    Shopee: { orders: 6344, revenue: 'Rp 127.2Jt', ctr: '5.8%', conv: '4.5%', return: '1.8%', color: '#b91c1c' },
    Lazada: { orders: 2190, revenue: 'Rp 54.1Jt', ctr: '2.9%', conv: '2.7%', return: '0.9%', color: '#b45309' },
    Bukalapak: { orders: 1420, revenue: 'Rp 28.9Jt', ctr: '2.1%', conv: '2.0%', return: '1.5%', color: '#047857' },
}
const FUNNEL = ['Impresi', 'Klik', 'Keranjang', 'Checkout', 'Selesai']
const FUNNEL_VALS = [100000, 42000, 8400, 4200, 3200]
export default function EcommerceAnalyticsApp() {
    const [activePlat, setActivePlat] = useState('Shopee')
    const d = DATA[activePlat]
    const maxFunnel = FUNNEL_VALS[0]
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter",sans-serif' }}>

            <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', padding: '2rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.7rem', color: '#475569', letterSpacing: '0.15em', marginBottom: '4px' }}>E-COMMERCE ANALYTICS</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Multi-Platform Dashboard</h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {PLATFORMS.map(p => <button aria-label="Action button" key={p} onClick={() => setActivePlat(p)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activePlat === p ? DATA[p].color : 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }}>{p}</button>)}
                    </div>
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[[`Orders (${activePlat})`, d.orders.toLocaleString(), '📦'], [`Revenue`, d.revenue, '💰'], ['CTR', d.ctr, '👁'], ['Conversion', d.conv, '✅'], ['Return Rate', d.return, '↩']].map(([l, v, i]) => (
                        <div key={l} style={{ background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{i}</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: d.color, marginBottom: '4px' }}>{v}</div>
                            <div style={{ fontSize: '0.75rem', color: '#475569' }}>{l}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Funnel */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Conversion Funnel</h2>
                        {FUNNEL.map((stage, i) => (
                            <div key={stage} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>{stage}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{FUNNEL_VALS[i].toLocaleString()}</span>
                                </div>
                                <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: d.color, borderRadius: '8px', width: `${(FUNNEL_VALS[i] / maxFunnel) * 100}%`, opacity: 1 - i * 0.12, transition: 'width 0.4s' }} />
                                </div>
                                {i < FUNNEL.length - 1 && <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '3px' }}>↓ {((FUNNEL_VALS[i + 1] / FUNNEL_VALS[i]) * 100).toFixed(1)}% lanjut</div>}
                            </div>
                        ))}
                    </div>
                    {/* Platform comparison */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Perbandingan Platform</h2>
                        {Object.entries(DATA).map(([name, pd]) => (
                            <div key={name} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: pd.color }} />
                                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{name}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: pd.color, fontSize: '0.9rem' }}>{pd.revenue}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>Conv: {pd.conv}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Summary recommendations */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Rekomendasi AI</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        {[{ icon: '📈', title: 'Optimalkan Shopee Ads', desc: 'CTR Shopee 5.8% tertinggi. Tingkatkan budget iklan 20% untuk scaling lebih maksimal.', color: '#b91c1c' }, { icon: '⚡', title: 'Perbaiki Funnel Checkout', desc: 'Dropout 50% di tahap checkout. Tambahkan metode pembayaran COD untuk mengurangi friction.', color: '#b45309' }, { icon: '🎯', title: 'Retarget Lazada', desc: 'Conversion rate Lazada terendah 2.7%. Buat bundle promo untuk meningkatkan AOV.', color: '#1d4ed8' }].map(r => (
                            <div key={r.title} style={{ background: '#f8fafc', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{r.icon}</div>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{r.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>{r.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
