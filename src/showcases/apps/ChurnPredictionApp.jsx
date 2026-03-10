import { useState } from 'react'
const CUSTOMERS = [
    { id: 1, name: 'Budi Santoso', tenure: 36, usage: 8.2, support: 2, risk: 0.82, churn: true, country: 'Jakarta', plan: 'Basic' },
    { id: 2, name: 'Siti Rahayu', tenure: 24, usage: 12.5, support: 0, risk: 0.31, churn: false, country: 'Bandung', plan: 'Premium' },
    { id: 3, name: 'Ahmad Hidayat', tenure: 6, usage: 4.1, support: 5, risk: 0.91, churn: true, country: 'Surabaya', plan: 'Basic' },
    { id: 4, name: 'Dewi Lestari', tenure: 48, usage: 15.2, support: 1, risk: 0.12, churn: false, country: 'Bali', plan: 'Enterprise' },
    { id: 5, name: 'Rizki Permana', tenure: 12, usage: 6.8, support: 3, risk: 0.65, churn: true, country: 'Medan', plan: 'Basic' },
    { id: 6, name: 'Indah Pratiwi', tenure: 60, usage: 18.4, support: 0, risk: 0.08, churn: false, country: 'Jakarta', plan: 'Enterprise' },
    { id: 7, name: 'Fauzan Malik', tenure: 8, usage: 5.2, support: 4, risk: 0.77, churn: false, country: 'Yogyakarta', plan: 'Standard' },
    { id: 8, name: 'Ratna Sari', tenure: 30, usage: 11.9, support: 1, risk: 0.22, churn: false, country: 'Surabaya', plan: 'Premium' },
]
const SHAP = [
    { feature: 'Tenure (lama berlangganan)', impact: -0.38, dir: 'neg' },
    { feature: 'Jumlah support calls', impact: 0.31, dir: 'pos' },
    { feature: 'Usage per bulan', impact: -0.27, dir: 'neg' },
    { feature: 'Paket berlangganan', impact: 0.18, dir: 'pos' },
    { feature: 'Lokasi geografis', impact: 0.12, dir: 'pos' },
]
export default function ChurnPredictionApp() {
    const [threshold, setThreshold] = useState(0.5)
    const [selected, setSelected] = useState(null)
    const atRisk = CUSTOMERS.filter(c => c.risk >= threshold)
    const safe = CUSTOMERS.filter(c => c.risk < threshold)
    return (
        <div style={{ minHeight: '100vh', background: '#fff5f5', fontFamily: '"Inter",sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#b91c1c)', padding: '1.5rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#fca5a5', letterSpacing: '0.15em', marginBottom: '4px' }}>DATA SCIENCE / CLASSIFICATION</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Customer Churn Prediction</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{atRisk.length}</div>
                        <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>At Risk</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>94.2%</div>
                        <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Accuracy</div>
                    </div>
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Threshold slider */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #fee2e2', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#374151', marginBottom: '8px', fontSize: '0.9rem' }}>Risk Threshold: <span style={{ color: '#dc2626', fontWeight: 800 }}>{threshold.toFixed(2)}</span></div>
                        <input type="range" min={0} max={100} value={threshold * 100} onChange={e => setThreshold(e.target.value / 100)} style={{ width: '100%', accentColor: '#dc2626' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}><span>0.00 (Semua)</span><span>1.00 (Tidak ada)</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ background: '#fee2e2', borderRadius: '10px', padding: '1rem', textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{atRisk.length}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>At Risk</div>
                        </div>
                        <div style={{ background: '#d1fae5', borderRadius: '10px', padding: '1rem', textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{safe.length}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Safe</div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {/* Risk Table */}
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #fee2e2', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #fee2e2', background: '#fff5f5', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#7f1d1d' }}>Risk Table</h3>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{CUSTOMERS.length} pelanggan</span>
                        </div>
                        {CUSTOMERS.sort((a, b) => b.risk - a.risk).map((c, i) => {
                            const isRisk = c.risk >= threshold
                            return (
                                <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 1.5rem', borderTop: i > 0 ? '1px solid #fff5f5' : 'none', cursor: 'pointer', background: selected?.id === c.id ? '#fff5f5' : '#fff', alignItems: 'center', transition: 'background 0.1s' }}>
                                    <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{c.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.plan}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', background: c.risk > 0.7 ? '#dc2626' : c.risk > 0.4 ? '#f59e0b' : '#10b981', width: `${c.risk * 100}%` }} />
                                        </div>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: c.risk > 0.7 ? '#dc2626' : c.risk > 0.4 ? '#d97706' : '#059669', minWidth: '30px' }}>{(c.risk * 100).toFixed(0)}%</span>
                                    </div>
                                    <span style={{ background: isRisk ? '#fee2e2' : '#d1fae5', color: isRisk ? '#dc2626' : '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '5px', textAlign: 'center' }}>{isRisk ? 'At Risk' : 'Safe'}</span>
                                </div>
                            )
                        })}
                    </div>
                    {/* SHAP + Detail */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #fee2e2' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', marginBottom: '1.25rem' }}>Feature Importance (SHAP)</h3>
                            {SHAP.map(s => (
                                <div key={s.feature} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                                        <span style={{ color: '#374151' }}>{s.feature}</span>
                                        <span style={{ fontWeight: 700, color: s.dir === 'pos' ? '#dc2626' : '#059669' }}>{s.dir === 'pos' ? '+' : ''}{s.impact}</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: s.dir === 'pos' ? '#fca5a5' : '#86efac', borderRadius: '4px', width: `${Math.abs(s.impact) * 100}%`, transition: 'width 0.4s' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selected && (
                            <div style={{ background: '#fff5f5', borderRadius: '16px', padding: '1.5rem', border: '1px solid #fca5a5' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#7f1d1d', margin: 0 }}>{selected.name}</h3>
                                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                                </div>
                                {[['Plan', selected.plan], ['Tenure', `${selected.tenure} bulan`], ['Usage', `${selected.usage} GB/bln`], ['Support Calls', selected.support], ['Lokasi', selected.country]].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #fee2e2', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#64748b' }}>{k}</span><span style={{ fontWeight: 700, color: '#374151' }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: '1rem', padding: '10px', background: selected.risk >= threshold ? '#dc2626' : '#059669', borderRadius: '8px', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                                    Risk Score: {(selected.risk * 100).toFixed(0)}% — {selected.risk >= threshold ? '⚠️ Segment: At Risk' : '✅ Segment: Safe'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
