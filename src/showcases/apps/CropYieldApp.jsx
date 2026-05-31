import { useState } from 'react'
const REGIONS = ['Jawa Tengah', 'Jawa Timur', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur']
const CROPS = ['Padi', 'Jagung', 'Kedelai', 'Singkong', 'Tebu']
const DATA = {
    'Padi': { 'Jawa Tengah': 6.2, 'Jawa Timur': 6.8, 'Sulawesi Selatan': 5.9, 'Sumatera Utara': 5.1, 'Kalimantan Timur': 4.8 },
    'Jagung': { 'Jawa Tengah': 7.1, 'Jawa Timur': 7.4, 'Sulawesi Selatan': 6.5, 'Sumatera Utara': 5.8, 'Kalimantan Timur': 5.2 },
    'Kedelai': { 'Jawa Tengah': 1.8, 'Jawa Timur': 1.9, 'Sulawesi Selatan': 1.6, 'Sumatera Utara': 1.4, 'Kalimantan Timur': 1.2 },
    'Singkong': { 'Jawa Tengah': 22.1, 'Jawa Timur': 23.4, 'Sulawesi Selatan': 19.8, 'Sumatera Utara': 18.2, 'Kalimantan Timur': 16.5 },
    'Tebu': { 'Jawa Tengah': 85.2, 'Jawa Timur': 92.1, 'Sulawesi Selatan': 71.4, 'Sumatera Utara': 68.3, 'Kalimantan Timur': 55.0 },
}
const RECS = {
    'Padi': 'Curah hujan optimal 1500-2000mm/tahun. Rekomendasi: varietas unggul IR64 atau Ciherang. Pupuk NPK 250kg/ha.',
    'Jagung': 'Tanah lempung berpasir ideal. Rekomendasi: hybrid Pioneer P27. Jarak tanam 75x25cm.',
    'Kedelai': 'Butuh drainase baik. Rekomendasi: lakukan inokulasi rhizobium sebelum tanam untuk efisiensi nitrogen.',
    'Singkong': 'Tanah ringan dengan pH 5.5-7.0. Rekomendasi: Varietas Adira-4. Jarak tanam 1x1m.',
    'Tebu': 'Butuh sinar penuh dan air cukup. Rekomendasi: varietas PS 881 untuk rendemen tinggi.',
}
export default function CropYieldApp() {
    const [crop, setCrop] = useState('Padi')
    const [region, setRegion] = useState('Semua')
    const d = DATA[crop]
    const values = region === 'Semua' ? Object.values(d) : [d[region]]
    const maxVal = Math.max(...Object.values(d))
    const avgYield = (Object.values(d).reduce((a, b) => a + b, 0) / REGIONS.length).toFixed(1)
    const bestRegion = Object.entries(d).sort(([, a], [, b]) => b - a)[0][0]
    return (
        <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: '"Inter",sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg,#14532d,#166534)', padding: '1.5rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#86efac', letterSpacing: '0.15em', marginBottom: '4px' }}>CROP YIELD ANALYTICS</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Analisis Hasil Panen</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select aria-label="Select option" value={crop} onChange={e => setCrop(e.target.value)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        {CROPS.map(c => <option key={c} value={c} style={{ color: '#000' }}>{c}</option>)}
                    </select>
                    <select aria-label="Select option" value={region} onChange={e => setRegion(e.target.value)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        <option value="Semua" style={{ color: '#000' }}>Semua Wilayah</option>
                        {REGIONS.map(r => <option key={r} value={r} style={{ color: '#000' }}>{r}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[['Rata-rata Hasil', `${avgYield} ton/ha`, '🌾', '#16a34a'], ['Hasil Terbaik', `${Math.max(...Object.values(d)).toFixed(1)} ton/ha`, '🏆', '#d97706'], ['Wilayah Terbaik', bestRegion, '📍', '#2563eb'], ['Total Komoditas', `${CROPS.length} jenis`, '🌱', '#7c3aed']].map(([l, v, i, c]) => (
                        <div key={l} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #bbf7d0' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{i}</div>
                            <div style={{ fontSize: typeof v === 'string' && v.length > 10 ? '1rem' : '1.5rem', fontWeight: 800, color: c, marginBottom: '4px', lineHeight: 1.2 }}>{v}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{l}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Bar chart */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bbf7d0' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#14532d', marginBottom: '1.5rem' }}>Hasil Panen {crop} per Wilayah (ton/ha)</h2>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end', height: '180px', paddingBottom: '0.5rem' }}>
                            {REGIONS.map((r, i) => {
                                const val = d[r]
                                const h = (val / maxVal) * 160
                                const faded = region !== 'Semua' && region !== r
                                return (
                                    <div key={r} onClick={() => setRegion(region === r ? 'Semua' : r)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: faded ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>{val}</div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '160px' }}>
                                            <div style={{ height: `${h}px`, background: `hsl(${120 + i * 15},60%,45%)`, borderRadius: '6px 6px 0 0', transition: 'height 0.4s', minHeight: '8px' }} />
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{r.split(' ')[0]}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* AI Recommendation */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bbf7d0' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#14532d', marginBottom: '1rem' }}>Rekomendasi 🌱</h2>
                        <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>🤖</span>
                                <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.7, margin: 0 }}>{RECS[crop]}</p>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Perbandingan Wilayah:</div>
                        {Object.entries(d).sort(([, a], [, b]) => b - a).map(([r, v], i) => (
                            <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < REGIONS.length - 1 ? '1px solid #f0fdf4' : 'none' }}>
                                <span style={{ fontSize: '0.82rem', color: '#374151' }}>{i + 1}. {r}</span>
                                <span style={{ fontWeight: 700, color: i === 0 ? '#16a34a' : '#475569', fontSize: '0.85rem' }}>{v} t/ha</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
