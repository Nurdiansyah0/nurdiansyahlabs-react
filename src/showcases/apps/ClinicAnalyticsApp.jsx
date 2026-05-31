import { useState } from 'react'
const DEPTS = ['Semua', 'IGD', 'Rawat Inap', 'Poliklinik', 'Radiologi', 'Laboratorium']
const MONTHLY_PATIENTS = {
    'Januari': { igd: 234, rawat: 87, poli: 412, radio: 98, lab: 201 },
    'Februari': { igd: 198, rawat: 92, poli: 380, radio: 112, lab: 220 },
    'Maret': { igd: 267, rawat: 104, poli: 445, radio: 87, lab: 198 },
}
const BEDS = { total: 120, occupied: 98, available: 22, emergency: 6 }
const CONDITIONS = [
    { name: 'Hipertensi', patients: 312, pct: 18, color: '#ef4444' },
    { name: 'Diabetes', patients: 245, pct: 14, color: '#f59e0b' },
    { name: 'ISPA', patients: 198, pct: 11, color: '#3b82f6' },
    { name: 'Jantung', patients: 167, pct: 9, color: '#8b5cf6' },
    { name: 'Lainnya', patients: 831, pct: 48, color: '#e2e8f0' },
]
export default function ClinicAnalyticsApp() {
    const [dept, setDept] = useState('Semua')
    const [month, setMonth] = useState('Maret')
    const d = MONTHLY_PATIENTS[month]
    const totalPat = dept === 'Semua' ? d.igd + d.rawat + d.poli + d.radio + d.lab : { IGD: d.igd, 'Rawat Inap': d.rawat, Poliklinik: d.poli, Radiologi: d.radio, Laboratorium: d.lab }[dept] || 0
    const maxPat = Math.max(d.igd, d.rawat, d.poli, d.radio, d.lab)
    return (
        <div style={{ minHeight: '100vh', background: '#f0f7ff', fontFamily: '"Inter",sans-serif' }}>

            <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', padding: '1.5rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#93c5fd', letterSpacing: '0.15em', marginBottom: '4px' }}>CLINIC HEALTH ANALYTICS</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Dashboard Analitik RS Sejahtera</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select aria-label="Select option" value={month} onChange={e => setMonth(e.target.value)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                        {Object.keys(MONTHLY_PATIENTS).map(m => <option key={m} value={m} style={{ color: '#000' }}>{m}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[{ l: 'Total Pasien', v: String(d.igd + d.rawat + d.poli + d.radio + d.lab), i: '👥', c: '#2563eb' }, { l: 'Bed Terisi', v: `${BEDS.occupied}/${BEDS.total}`, i: '🛏', c: '#dc2626' }, { l: 'BOR', v: `${Math.round((BEDS.occupied / BEDS.total) * 100)}%`, i: '📊', c: '#f59e0b' }, { l: 'Bed Kosong', v: String(BEDS.available), i: '✅', c: '#16a34a' }].map(m => (
                        <div key={m.l} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{m.i}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: m.c, marginBottom: '4px' }}>{m.v}</div>
                            <div style={{ fontSize: '0.8rem', color: '#475569' }}>{m.l}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Bar chart per dept */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>Kunjungan per Departemen — {month}</h2>
                            <select aria-label="Select option" value={dept} onChange={e => setDept(e.target.value)} style={{ padding: '6px 12px', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}>
                                {DEPTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        {[['IGD', d.igd, '#ef4444'], ['Rawat Inap', d.rawat, '#8b5cf6'], ['Poliklinik', d.poli, '#2563eb'], ['Radiologi', d.radio, '#f59e0b'], ['Laboratorium', d.lab, '#16a34a']].map(([name, val, color]) => (
                            <div key={name} style={{ marginBottom: '1rem', opacity: dept === 'Semua' || dept === name ? 1 : 0.3 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#374151', fontWeight: 500 }}>{name}</span>
                                    <span style={{ fontWeight: 700, color: '#1e3a8a' }}>{val} pasien</span>
                                </div>
                                <div style={{ height: '14px', background: '#f0f7ff', borderRadius: '7px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: color, borderRadius: '7px', width: `${(val / maxPat) * 100}%`, transition: 'width 0.5s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Diagnosis distribution */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '1.5rem' }}>Diagnosis Terbanyak</h2>
                        {CONDITIONS.map(c => (
                            <div key={c.name} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color }} /><span style={{ fontSize: '0.85rem', color: '#374151' }}>{c.name}</span></div>
                                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a' }}>{c.pct}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#f0f7ff', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: c.color, borderRadius: '4px', width: `${c.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Bed occupancy visual */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '1.5rem' }}>Status Bed Real-Time</h2>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {Array.from({ length: BEDS.total }).map((_, i) => (
                            <div key={i} style={{ width: '28px', height: '28px', borderRadius: '4px', background: i < BEDS.occupied ? (i < BEDS.emergency ? '#fca5a5' : '#93c5fd') : '#d1fae5', border: '1px solid', borderColor: i < BEDS.occupied ? (i < BEDS.emergency ? '#ef4444' : '#3b82f6') : '#86efac', cursor: 'default' }} title={i < BEDS.emergency ? 'Emergency' : i < BEDS.occupied ? 'Terisi' : 'Kosong'} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.78rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#fca5a5', borderRadius: '2px' }} /> Emergency ({BEDS.emergency})</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#93c5fd', borderRadius: '2px' }} /> Terisi ({BEDS.occupied - BEDS.emergency})</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#d1fae5', borderRadius: '2px' }} /> Kosong ({BEDS.available})</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
