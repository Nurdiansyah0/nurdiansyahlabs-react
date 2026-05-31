import { useState } from 'react'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
const ACTUAL = [42, 45, 48, 38, 51, 55, 49, 58, 62, 68, 65, 72]
const FORECAST = [null, null, null, null, null, null, null, null, null, null, 72, 78, 84, 89, 95]
const PERIODS = [6, 12, 24]
export default function SalesForecastingApp() {
    const [period, setPeriod] = useState(12)
    const [model, setModel] = useState('ARIMA')
    const maxVal = Math.max(...ACTUAL, ...FORECAST.filter(Boolean))
    const forecastMonths = [...MONTHS, 'Jan', 'Feb', 'Mar']
    const accuracy = { ARIMA: '94.2%', Prophet: '91.8%', 'LSTM': '96.1%', 'Linear Reg': '88.5%' }
    return (
        <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: '"Inter",sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', padding: '1.5rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#a78bfa', letterSpacing: '0.15em', marginBottom: '4px' }}>DATA SCIENCE / TIME SERIES</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Sales Forecasting</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select aria-label="Select option" aria-label="Select option" value={model} onChange={e => setModel(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        {Object.keys(accuracy).map(m => <option key={m} value={m} style={{ color: '#000' }}>{m}</option>)}
                    </select>
                    <select aria-label="Select option" aria-label="Select option" value={period} onChange={e => setPeriod(Number(e.target.value))} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        {PERIODS.map(p => <option key={p} value={p} style={{ color: '#000' }}>+{p} bulan</option>)}
                    </select>
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[['Model Akurasi', accuracy[model], '🎯', '#7c3aed'], ['RMSE', '4.82', '📉', '#2563eb'], ['Tren', 'Naik +18%', '📈', '#16a34a'], ['Horizon Forecast', `${period} bulan`, '⏳', '#f59e0b']].map(([l, v, i, c]) => (
                        <div key={l} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{i}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c, marginBottom: '4px' }}>{v}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{l}</div>
                        </div>
                    ))}
                </div>
                {/* Chart */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e5e7eb', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Forecast Chart — Model: {model}</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '20px', height: '3px', background: '#6366f1', borderRadius: '2px' }} /> Aktual</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '20px', height: '3px', background: '#f59e0b', borderRadius: '2px', borderTop: '2px dashed #f59e0b' }} /> Forecast</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '200px', paddingBottom: '0.5rem', position: 'relative' }}>
                        {/* Gridlines */}
                        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: 'repeat(4,1fr)', pointerEvents: 'none' }}>
                            {[100, 75, 50, 25].map(p => <div key={p} style={{ borderTop: '1px solid #f1f5f9', position: 'relative' }}><span style={{ position: 'absolute', left: 0, top: '-8px', fontSize: '0.6rem', color: '#94a3b8' }}>{Math.round(maxVal * p / 100)}</span></div>)}
                        </div>
                        {ACTUAL.map((v, i) => (
                            <div key={`a${i}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ height: `${(v / maxVal) * 180}px`, width: '100%', background: '#6366f1', borderRadius: '4px 4px 0 0', transition: 'height 0.4s', minHeight: '4px', position: 'relative' }} title={`${forecastMonths[i]}: ${v}K`} />
                                <div style={{ fontSize: '0.55rem', color: '#94a3b8', transform: 'rotate(-30deg)', whiteSpace: 'nowrap' }}>{MONTHS[i]}</div>
                            </div>
                        ))}
                        {FORECAST.slice(10).map((v, i) => (
                            v && <div key={`f${i}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ height: `${(v / maxVal) * 180}px`, width: '100%', background: '#fef3c7', border: '2px dashed #f59e0b', borderRadius: '4px 4px 0 0', transition: 'height 0.4s', minHeight: '4px' }} title={`Forecast: ${v}K`} />
                                <div style={{ fontSize: '0.55rem', color: '#f59e0b', transform: 'rotate(-30deg)', whiteSpace: 'nowrap' }}>{['Nov', 'Des', 'Jan'][i]}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Model Comparison</h3>
                        {Object.entries(accuracy).map(([m, a]) => (
                            <div key={m} onClick={() => setModel(m)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', marginBottom: '6px', background: model === m ? '#f5f3ff' : '#f8fafc', border: `1px solid ${model === m ? '#7c3aed' : '#e5e7eb'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                                <span style={{ fontWeight: model === m ? 700 : 500, color: model === m ? '#7c3aed' : '#374151', fontSize: '0.9rem' }}>{m}</span>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div style={{ width: '80px', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', background: model === m ? '#7c3aed' : '#94a3b8', borderRadius: '4px', width: a }} /></div>
                                    <span style={{ fontWeight: 700, color: model === m ? '#7c3aed' : '#64748b', fontSize: '0.85rem' }}>{a}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>📅 Proyeksi {period} Bulan</h3>
                        {Array.from({ length: Math.min(period, 6) }).map((_, i) => {
                            const base = ACTUAL[ACTUAL.length - 1]
                            const proj = Math.round(base * (1 + 0.06 * (i + 1)))
                            return <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                                <span style={{ color: '#64748b' }}>{MONTHS[(11 + i + 1) % 12]} {i < 1 ? '2025' : '2025'}</span>
                                <span style={{ fontWeight: 700, color: '#7c3aed' }}>{proj}K unit</span>
                            </div>
                        })}
                        {period > 6 && <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', padding: '8px 0' }}>+{period - 6} bulan lagi...</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
