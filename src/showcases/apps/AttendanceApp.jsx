import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const EMPLOYEES = [
    { id: 1, name: 'Budi Santoso', dept: 'Engineering', pos: 'Senior Dev', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop', status: 'present' },
    { id: 2, name: 'Siti Rahayu', dept: 'Product', pos: 'Product Manager', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&fit=crop', status: 'present' },
    { id: 3, name: 'Ahmad Hidayat', dept: 'Marketing', pos: 'Marketing Lead', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop', status: 'absent' },
    { id: 4, name: 'Dewi Lestari', dept: 'Engineering', pos: 'Backend Dev', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&fit=crop', status: 'late' },
    { id: 5, name: 'Rizki Permana', dept: 'Design', pos: 'UI Designer', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop', status: 'present' },
    { id: 6, name: 'Indah Pratiwi', dept: 'HR', pos: 'HR Manager', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop', status: 'leave' },
    { id: 7, name: 'Fauzan Malik', dept: 'Finance', pos: 'Accountant', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&fit=crop', status: 'present' },
    { id: 8, name: 'Ratna Sari', dept: 'Engineering', pos: 'Frontend Dev', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop', status: 'present' },
]
const DEPTS = ['Semua', 'Engineering', 'Product', 'Marketing', 'Design', 'HR', 'Finance']
const STATUS_CLR = { present: '#d1fae5', late: '#fef3c7', absent: '#fee2e2', leave: '#dbeafe' }
const STATUS_TXT = { present: '#059669', late: '#d97706', absent: '#dc2626', leave: '#2563eb' }
const STATUS_LBL = { present: 'Hadir', late: 'Terlambat', absent: 'Tidak Hadir', leave: 'Cuti' }
function Clock() {
    const [time, setTime] = useState(new Date())
    useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
    return <>{time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>
}
export default function AttendanceApp() {
    const navigate = useNavigate()
    const [page, setPage] = useState('attendance')
    const [employees, setEmployees] = useState(EMPLOYEES)
    const [dept, setDept] = useState('Semua')
    const [search, setSearch] = useState('')
    const [checkinModal, setCheckinModal] = useState(false)
    const [selectedEmp, setSelectedEmp] = useState(null)
    const [leaveModal, setLeaveModal] = useState(false)
    const [leaveForm, setLeaveForm] = useState({ emp: '', type: '', from: '', to: '', reason: '' })
    const [leaveSuccess, setLeaveSuccess] = useState(false)
    const filtered = employees.filter(e => (dept === 'Semua' || e.dept === dept) && (!search || e.name.toLowerCase().includes(search.toLowerCase())))
    const stats = { present: employees.filter(e => e.status === 'present').length, late: employees.filter(e => e.status === 'late').length, absent: employees.filter(e => e.status === 'absent').length, leave: employees.filter(e => e.status === 'leave').length }
    const doCheckin = (id, st) => {
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: st } : e))
        setCheckinModal(false); setSelectedEmp(null)
    }
    const PAGES = [{ k: 'attendance', l: 'Absensi', i: '📋' }, { k: 'employees', l: 'Karyawan', i: '👥' }, { k: 'leave', l: 'Cuti', i: '📅' }, { k: 'reports', l: 'Laporan', i: '📊' }]
    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: '"Inter",sans-serif', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ width: '220px', background: '#0f172a', color: '#fff', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: '#6366f1', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>⏰</div>
                        <span style={{ fontWeight: 700 }}>AttendanceOS</span>
                    </div>
                </div>
                <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {PAGES.map(p => <div key={p.k} onClick={() => setPage(p.k)} style={{ padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: page === p.k ? 'rgba(99,102,241,0.2)' : 'transparent', color: page === p.k ? '#818cf8' : '#94a3b8', fontSize: '0.85rem', fontWeight: page === p.k ? 700 : 400 }}>{p.i} {p.l}</div>)}
                </div>
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '1.2rem', fontWeight: 700, color: '#6366f1', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                    <Clock />
                </div>
            </div>
            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f8fafc' }}>
                {/* Topbar */}
                <div style={{ padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>{PAGES.find(p => p.k === page)?.l}</h1>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Senin, 3 Maret 2025</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setLeaveModal(true)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>📅 Ajukan Cuti</button>
                        <button onClick={() => setCheckinModal(true)} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>✓ Check-in</button>
                    </div>
                </div>
                {/* Attendance Page */}
                {page === 'attendance' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            {[{ l: 'Hadir', v: stats.present, c: '#10b981', bg: '#d1fae5' }, { l: 'Terlambat', v: stats.late, c: '#f59e0b', bg: '#fef3c7' }, { l: 'Tidak Hadir', v: stats.absent, c: '#ef4444', bg: '#fee2e2' }, { l: 'Cuti', v: stats.leave, c: '#3b82f6', bg: '#dbeafe' }].map(m => (
                                <div key={m.l} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: m.c }}>{m.v}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{m.l}</div>
                                </div>
                            ))}
                        </div>
                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari karyawan..." style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', minWidth: '200px' }} />
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {DEPTS.map(d => <button key={d} onClick={() => setDept(d)} style={{ padding: '8px 14px', borderRadius: '8px', background: dept === d ? '#6366f1' : '#fff', color: dept === d ? '#fff' : '#64748b', fontWeight: dept === d ? 700 : 400, cursor: 'pointer', fontSize: '0.8rem', border: dept === d ? 'none' : '1px solid #e2e8f0' }}>{d}</button>)}
                            </div>
                        </div>
                        {/* Table */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1fr 1.5fr', padding: '12px 1.5rem', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                                {['Karyawan', 'Departemen', 'Jabatan', 'Status', 'Waktu Masuk'].map(h => <div key={h}>{h}</div>)}
                            </div>
                            {filtered.map((e, i) => (
                                <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1fr 1.5fr', padding: '12px 1.5rem', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={e.img} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt={e.name} />
                                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{e.name}</div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#475569' }}>{e.dept}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{e.pos}</div>
                                    <div><span style={{ background: STATUS_CLR[e.status], color: STATUS_TXT[e.status], padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{STATUS_LBL[e.status]}</span></div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{e.status === 'present' ? `${String(7 + Math.floor(Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} WIB` : e.status === 'late' ? `${String(9 + Math.floor(Math.random() * 1)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} WIB` : '–'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Employees page */}
                {page === 'employees' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem' }}>
                            {employees.map(e => (
                                <div key={e.id} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                    <img src={e.img} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '3px solid #e0e7ff' }} alt={e.name} />
                                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{e.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>{e.pos} · {e.dept}</div>
                                    <span style={{ background: STATUS_CLR[e.status], color: STATUS_TXT[e.status], padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{STATUS_LBL[e.status]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Leave/Reports simplified */}
                {(page === 'leave' || page === 'reports') && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', maxWidth: '600px', width: '100%', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {page === 'leave' ? (<>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Pengajuan Cuti</h2>
                                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>Klik tombol di bawah untuk mengajukan cuti</p>
                                <div style={{ display: 'grid', gap: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                                    {[{ s: 'present', n: 'Hadir Hari Ini' }, { s: 'late', n: 'Terlambat' }, { s: 'leave', n: 'Sedang Cuti' }].map(({ s, n }) => (
                                        <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>{n}</span>
                                            <span style={{ fontWeight: 700, color: STATUS_TXT[s] }}>{employees.filter(e => e.status === s).length} orang</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setLeaveModal(true)} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>+ Ajukan Cuti Baru</button>
                            </>) : (<>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Laporan Absensi</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                                    {[['Total Karyawan', employees.length, '#6366f1'], ['Rata-rata Kehadiran', `${Math.round((stats.present / employees.length) * 100)}%`, '#10b981'], ['Keterlambatan', stats.late, '#f59e0b'], ['Tidak Hadir', stats.absent, '#ef4444']].map(([l, v, c]) => (
                                        <div key={l} style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c }}>{v}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{l}</div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => window.print()} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>🖨 Export Laporan</button>
                            </>)}
                        </div>
                    </div>
                )}
            </div>
            {/* Check-in Modal */}
            {checkinModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setCheckinModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Manual Check-in</h2>
                            <button onClick={() => setCheckinModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                        </div>
                        {!selectedEmp ? (
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {employees.filter(e => e.status === 'absent').map(e => (
                                    <div key={e.id} onClick={() => setSelectedEmp(e)} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s' }}
                                        onMouseEnter={el => el.currentTarget.style.borderColor = '#6366f1'}
                                        onMouseLeave={el => el.currentTarget.style.borderColor = '#e2e8f0'}>
                                        <img src={e.img} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt={e.name} />
                                        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, color: '#0f172a' }}>{e.name}</div><div style={{ fontSize: '0.8rem', color: '#64748b' }}>{e.dept} · {e.pos}</div></div>
                                        <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Belum Hadir</span>
                                    </div>
                                ))}
                                {employees.filter(e => e.status === 'absent').length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>✅ Semua karyawan sudah absen</div>}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <img src={selectedEmp.img} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} alt={selectedEmp.name} />
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>{selectedEmp.name}</div>
                                <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{selectedEmp.dept} · {selectedEmp.pos}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Waktu: <strong><Clock /></strong></div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => doCheckin(selectedEmp.id, 'present')} style={{ flex: 1, background: '#d1fae5', color: '#059669', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>✓ Hadir</button>
                                    <button onClick={() => doCheckin(selectedEmp.id, 'late')} style={{ flex: 1, background: '#fef3c7', color: '#d97706', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>⏰ Terlambat</button>
                                </div>
                                <button onClick={() => setSelectedEmp(null)} style={{ width: '100%', marginTop: '0.75rem', background: 'none', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem' }}>← Kembali</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Leave Modal */}
            {leaveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setLeaveModal(false); setLeaveSuccess(false) }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '90%' }}>
                        {leaveSuccess ? (<div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Berhasil!</h2>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Pengajuan cuti telah dikirim ke HR untuk ditinjau.</p>
                            <button onClick={() => { setLeaveModal(false); setLeaveSuccess(false) }} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Tutup</button>
                        </div>) : (<>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Ajukan Cuti</h2>
                                <button onClick={() => setLeaveModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                            </div>
                            {[['emp', 'Nama Karyawan'], ['type', 'Jenis Cuti'], ['from', 'Tanggal Mulai'], ['to', 'Tanggal Selesai'], ['reason', 'Alasan Cuti']].map(([k, l]) => (
                                <div key={k} style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>{l}</label>
                                    {k === 'type' ? (
                                        <select value={leaveForm[k]} onChange={e => setLeaveForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}>
                                            <option value="">Pilih jenis cuti</option>
                                            {['Cuti Tahunan', 'Cuti Sakit', 'Cuti Melahirkan', 'Cuti Penting', 'Izin Tidak Berbayar'].map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    ) : (
                                        <input type={k === 'from' || k === 'to' ? 'date' : 'text'} value={leaveForm[k]} onChange={e => setLeaveForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }} />
                                    )}
                                </div>
                            ))}
                            <button onClick={() => leaveForm.emp && leaveForm.type && leaveForm.from && leaveForm.to ? setLeaveSuccess(true) : alert('Lengkapi semua field!')} style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>Kirim Pengajuan →</button>
                        </>)}
                    </div>
                </div>
            )}
        </div>
    )
}
