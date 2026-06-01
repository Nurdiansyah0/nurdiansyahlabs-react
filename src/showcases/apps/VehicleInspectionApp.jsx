import { useState } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import { useNavigate } from 'react-router-dom'
const VEHICLES = [
    { id: 'VH-001', plate: 'B 1234 AB', type: 'Toyota Avanza', owner: 'PT. Maju Jaya', color: 'Silver' },
    { id: 'VH-002', plate: 'D 5678 CD', type: 'Honda CR-V', owner: 'CV. Berkah Mandiri', color: 'Black' },
    { id: 'VH-003', plate: 'F 9012 EF', type: 'Mitsubishi L300', owner: 'PT. Cargo Express', color: 'White' },
]
const TABS = ['Exterior', 'Interior', 'Mesin', 'Kelengkapan', 'Hasil']
const CHECKS = {
    Exterior: ['Kaca Depan', 'Kaca Samping Kiri', 'Kaca Samping Kanan', 'Kaca Belakang', 'Kap Mesin', 'Bumper Depan', 'Bumper Belakang', 'Pintu Kiri', 'Pintu Kanan', 'Atap', 'Lampu Depan', 'Lampu Belakang', 'Spion Kiri', 'Spion Kanan', 'Ban Depan Kiri', 'Ban Depan Kanan', 'Ban Belakang Kiri', 'Ban Belakang Kanan'],
    Interior: ['Jok Depan Kiri', 'Jok Depan Kanan', 'Jok Belakang', 'Dashboard', 'Setir', 'Panel Instrumen', 'AC', 'Sistem Audio', 'Karpet', 'Sabuk Pengaman', 'Kaca Film'],
    Mesin: ['Oli Mesin', 'Air Radiator', 'Aki', 'Filter Udara', 'V-Belt', 'Rem Depan', 'Rem Belakang', 'Shock Absorber', 'Transmisi', 'Knalpot'],
    Kelengkapan: ['STNK', 'KIR', 'BPKB (foto)', 'Ban Serep', 'Dongkrak', 'Kunci Roda', 'Kotak P3K', 'Segitiga Pengaman', 'Kartu Inspeksi'],
}
const OPT = ['Baik', 'Cacat', 'Tidak Ada']
export default function VehicleInspectionApp() {
    const { isMobile } = useResponsive()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(0)
    const [selectedVeh, setSelectedVeh] = useState(null)
    const [checks, setChecks] = useState({})
    const [notes, setNotes] = useState({})
    const [inspector, setInspector] = useState({ name: '', date: new Date().toISOString().slice(0, 10) })
    const [submitted, setSubmitted] = useState(false)
    const [showVehPicker, setShowVehPicker] = useState(false)
    const setCheck = (section, item, val) => setChecks(prev => ({ ...prev, [`${section}:${item}`]: val }))
    const setNote = (section, item, val) => setNotes(prev => ({ ...prev, [`${section}:${item}`]: val }))
    const allSections = Object.keys(CHECKS)
    const total = allSections.reduce((s, sec) => s + CHECKS[sec].length, 0)
    const done = Object.keys(checks).length
    const issues = Object.values(checks).filter(v => v === 'Cacat' || v === 'Tidak Ada').length
    const pct = Math.round((done / total) * 100)
    if (submitted) return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: '"Inter",sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem', maxWidth: '600px', width: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: issues > 0 ? '#fef3c7' : '#d1fae5', borderRadius: '12px', alignItems: 'center' }}>
                    <div style={{ fontSize: '2.5rem' }}>{issues > 0 ? '⚠️' : '✅'}</div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Inspeksi Selesai</div>
                        <div style={{ color: '#4b5563', fontSize: '0.9rem' }}>Kendaraan: {selectedVeh?.plate} · {selectedVeh?.type}</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[['Total Item', String(done), '#1d4ed8'], ['Baik', String(Object.values(checks).filter(v => v === 'Baik').length), '#047857'], ['Masalah', String(issues), '#b91c1c']].map(([l, v, c]) => (
                        <div key={l} style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: c }}>{v}</div>
                            <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '4px' }}>{l}</div>
                        </div>
                    ))}
                </div>
                {issues > 0 && (
                    <div style={{ background: '#fff5f5', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                        <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Item Bermasalah:</div>
                        {Object.entries(checks).filter(([, v]) => v !== 'Baik').map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid #fee2e2' }}>
                                <span style={{ color: '#374151' }}>{k.split(':')[1]}</span>
                                <span style={{ color: '#991b1b', fontWeight: 700 }}>{v}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button aria-label="Action button" onClick={() => { setSubmitted(false); setChecks({}); setNotes({}); setActiveTab(0) }} style={{ flex: 1, background: '#1e293b', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Inspeksi Baru</button>
                    <button aria-label="Action button" onClick={() => window.print()} style={{ flex: 1, background: '#1d4ed8', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>🖨 Cetak Laporan</button>
                </div>
            </div>
        </div>
    )
    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: '"Inter",sans-serif' }}>
            
            <div style={{ background: '#1e293b', padding: isMobile ? '1rem' : '1.5rem 3rem', color: '#fff', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1rem' : '0' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#1e293b', marginBottom: '4px' }}>VEHICLE INSPECTION</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>Form Inspeksi Kendaraan</div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8' }}>{pct}%</div>
                        <div style={{ fontSize: '0.7rem', color: '#1e293b' }}>Progress</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c' }}>{issues}</div>
                        <div style={{ fontSize: '0.7rem', color: '#1e293b' }}>Issues</div>
                    </div>
                </div>
            </div>
            {/* Select Vehicle */}
            {!selectedVeh ? (
                <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 2rem' }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>1. Pilih Kendaraan</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {VEHICLES.map(v => (
                                <div key={v.id} onClick={() => setSelectedVeh(v)} style={{ padding: '1.25rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1d4ed8'; e.currentTarget.style.background = '#f0f7ff' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ fontSize: '2rem' }}>🚗</div>
                                        <div><div style={{ fontWeight: 700, color: '#1e293b' }}>{v.plate}</div><div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{v.type} · {v.color}</div></div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '0.8rem', color: '#1e293b' }}>Pemilik</div><div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{v.owner}</div></div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ fontSize: '0.85rem', color: '#1e293b', marginBottom: '8px' }}>Nama Inspektor</div>
                            <input aria-label="Form input" value={inspector.name} onChange={e => setInspector(p => ({ ...p, name: e.target.value }))} placeholder="Nama inspektor..." style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem', paddingBottom: '2rem' }}>
                    {/* Vehicle info bar */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem' }}>🚗</span>
                            <div><div style={{ fontWeight: 700, color: '#1e293b' }}>{selectedVeh.plate} – {selectedVeh.type}</div><div style={{ fontSize: '0.8rem', color: '#1e293b' }}>{selectedVeh.owner}</div></div>
                        </div>
                        <button aria-label="Action button" onClick={() => setSelectedVeh(null)} style={{ background: 'none', border: '1px solid #e2e8f0', color: '#1e293b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Ganti Kendaraan</button>
                    </div>
                    {/* Tab nav */}
                    <div style={{ display: 'flex', background: '#fff', borderRadius: '12px', padding: '6px', marginBottom: '1.5rem', gap: '6px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
                        {TABS.map((t, i) => (
                            <button aria-label="Action button" key={t} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: activeTab === i ? '#1e293b' : 'transparent', color: activeTab === i ? '#fff' : '#1e293b', fontWeight: activeTab === i ? 700 : 500, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                {i < 4 ? ['🔍', '🪑', '⚙️', '📋'][i] : ''} {t}
                            </button>
                        ))}
                    </div>
                    {/* Checklist sections */}
                    {activeTab < 4 && (() => {
                        const section = TABS[activeTab]
                        const items = CHECKS[section] || []
                        return (
                            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{section} — {items.filter(item => checks[`${section}:${item}`]).length}/{items.length} selesai</div>
                                {items.map(item => {
                                    const key = `${section}:${item}`
                                    const val = checks[key]
                                    return (
                                        <div key={item} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ fontWeight: 500, color: '#374151', fontSize: '0.9rem' }}>{item}</div>
                                            {OPT.map(o => (
                                                <button aria-label="Action button" key={o} onClick={() => setCheck(section, item, o)} style={{ padding: '7px', borderRadius: '7px', border: '1px solid', borderColor: val === o ? (o === 'Baik' ? '#047857' : o === 'Cacat' ? '#b91c1c' : '#b45309') : '#e2e8f0', background: val === o ? (o === 'Baik' ? '#d1fae5' : o === 'Cacat' ? '#fee2e2' : '#fef3c7') : '#fff', color: val === o ? (o === 'Baik' ? '#065f46' : o === 'Cacat' ? '#991b1b' : '#92400e') : '#1e293b', fontWeight: val === o ? 700 : 400, cursor: 'pointer', fontSize: '0.8rem' }}>
                                                    {o === 'Baik' ? '✓ ' : o === 'Cacat' ? '⚠ ' : '✕ '}{o}
                                                </button>
                                            ))}
                                        </div>
                                    )
                                })}
                                <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                    {activeTab > 0 ? <button aria-label="Action button" onClick={() => setActiveTab(activeTab - 1)} style={{ background: '#f1f5f9', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#1e293b' }}>← Sebelumnya</button> : <div />}
                                    <button aria-label="Action button" onClick={() => setActiveTab(activeTab + 1)} style={{ background: '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Selanjutnya →</button>
                                </div>
                            </div>
                        )
                    })()}
                    {/* Summary tab */}
                    {activeTab === 4 && (
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: isMobile ? '1rem' : '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>Ringkasan Inspeksi</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                {[['Total Diperiksa', String(done), '#1d4ed8'], ['Baik', String(Object.values(checks).filter(v => v === 'Baik').length), '#047857'], ['Cacat', String(Object.values(checks).filter(v => v === 'Cacat').length), '#b91c1c'], ['Tidak Ada', String(Object.values(checks).filter(v => v === 'Tidak Ada').length), '#b45309']].map(([l, v, c]) => (
                                    <div key={l} style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: c }}>{v}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '4px' }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: issues > 0 ? '#fef3c7' : '#d1fae5', borderRadius: '10px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.5rem' }}>{issues > 0 ? '⚠️' : '✅'}</span>
                                <span style={{ fontWeight: 600, color: '#374151' }}>{issues > 0 ? `Ditemukan ${issues} item bermasalah. Perlu penanganan sebelum kendaraan dioperasikan.` : 'Semua item dalam kondisi baik. Kendaraan siap beroperasi.'}</span>
                            </div>
                            <button aria-label="Action button" onClick={() => !inspector.name ? alert('Isi nama inspektor dulu!') : setSubmitted(true)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>✅ Selesaikan &amp; Simpan Laporan</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
