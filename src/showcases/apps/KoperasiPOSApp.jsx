import { useState, useEffect } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import { PRODUCTS } from '../../data/koperasiProducts'
import { Users, ShoppingCart, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Package, CreditCard, ChevronRight } from 'lucide-react'
const MEMBERS = [{ id: 1, no: 'KOP-001', name: 'Budi Santoso', saldo: 'Rp 1.25Jt' }, { id: 2, no: 'KOP-002', name: 'Siti Rahayu', saldo: 'Rp 890rb' }, { id: 3, no: 'KOP-003', name: 'Ahmad Hidayat', saldo: 'Rp 2.1Jt' }, { id: 4, no: 'KOP-004', name: 'Dewi Lestari', saldo: 'Rp 450rb' }]
const fmt = n => n.toLocaleString('id-ID')
export default function KoperasiPOSApp() {
    const { isMobile } = useResponsive()
    const [page, setPage] = useState('pos')
    const [cat, setCat] = useState('Semua')
    const [search, setSearch] = useState('')
    const [cart, setCart] = useState([])
    const [member, setMember] = useState(null)
    const [showMember, setShowMember] = useState(false)
    const [receipt, setReceipt] = useState(null)
    const [showCart, setShowCart] = useState(false)
    const [invNum] = useState(`INV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`)
    const filtered = PRODUCTS.filter(p => (cat === 'Semua' || p.cat === cat) && (!search || p.name.toLowerCase().includes(search.toLowerCase())))
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0)
    const discount = member ? Math.round(total * 0.05) : 0
    const addToCart = p => setCart(prev => { const e = prev.find(c => c.id === p.id); return e ? prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...p, qty: 1 }] })
    const upd = (id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + d) } : c).filter(c => c.qty > 0))
    const checkout = () => {
        if (!cart.length) return
        setReceipt({ inv: invNum, items: [...cart], total: total - discount, member, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) })
        setCart([]); setMember(null)
    }
    const SIDES = [{ icon: '🏠', label: 'Dashboard' }, { icon: '🛒', label: 'Kasir POS' }, { icon: '👥', label: 'Data Anggota' }, { icon: '📦', label: 'Inventori' }, { icon: '📊', label: 'Laporan' }, { icon: '⚙️', label: 'Pengaturan' }]
    const pageIdx = page === 'dashboard' ? 0 : page === 'pos' ? 1 : page === 'members' ? 2 : page === 'inventory' ? 3 : 1
    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: '"Inter",sans-serif', overflow: 'hidden' }}>
            {/* Sidebar / Bottom Nav */}
            {!isMobile ? (
                <div style={{ width: '220px', background: '#312e81', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', background: '#3730a3', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>⚡</div>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Koperasi ARFF</span>
                        </div>
                    </div>
                    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {SIDES.map((s, i) => (
                            <div key={s.label} onClick={() => { if (i === 0) setPage('dashboard'); else if (i === 1) setPage('pos'); else if (i === 2) setPage('members'); else if (i === 3) setPage('inventory') }} style={{ padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', cursor: i <= 3 ? 'pointer' : 'default', background: pageIdx === i ? '#3730a3' : 'transparent', color: pageIdx === i ? '#fff' : '#c7d2fe', fontSize: '0.85rem', fontWeight: pageIdx === i ? 600 : 400, opacity: i > 3 ? 0.4 : 1, transition: 'all 0.15s' }}>
                                <span>{s.icon}</span><span>{s.label}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" style={{ borderRadius: '50%', flexShrink: 0 }} fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="16" fill="#3730a3" />
                            <circle cx="16" cy="13" r="5" fill="#c7d2fe" />
                            <ellipse cx="16" cy="26" rx="9" ry="5.5" fill="#c7d2fe" />
                        </svg>
                        <div><div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Admin Kasir</div><div style={{ fontSize: '0.7rem', color: '#c7d2fe' }}>Shift Pagi</div></div>
                    </div>
                </div>
            ) : (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#312e81', display: 'flex', justifyContent: 'space-around', padding: '10px 5px', zIndex: 100, borderTop: '1px solid #1e1b4b' }}>
                    {SIDES.slice(0, 4).map((s, i) => (
                        <div key={s.label} onClick={() => { if (i === 0) setPage('dashboard'); else if (i === 1) setPage('pos'); else if (i === 2) setPage('members'); else if (i === 3) setPage('inventory') }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: pageIdx === i ? '#fff' : '#c7d2fe', fontSize: '0.65rem', fontWeight: pageIdx === i ? 700 : 500, padding: '5px' }}>
                            <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{s.icon}</span>
                            <span style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{s.label.split(' ')[0]}</span>
                        </div>
                    ))}
                </div>
            )}
            {/* Pages Wrapper */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingBottom: isMobile ? '65px' : '0' }}>
            {/* Dashboard */}
            {page === 'dashboard' && (
                <div style={{ flex: 1, background: '#f8fafc', padding: isMobile ? '1.25rem' : '2.5rem', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>Overview Koperasi</h1>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Ringkasan performa dan aktivitas hari ini.</p>
                        </div>
                        {!isMobile && (
                            <button style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}>
                                Unduh Laporan <ArrowUpRight size={16} />
                            </button>
                        )}
                    </div>
                    
                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                        {[
                            { title: 'Total Anggota', value: '248', trend: '+12% minggu ini', isUp: true, icon: <Users size={20} color="#4f46e5" />, bg: '#e0e7ff' },
                            { title: 'Pendapatan Hari Ini', value: 'Rp 4.25M', trend: '+8.4% dari kemarin', isUp: true, icon: <TrendingUp size={20} color="#059669" />, bg: '#d1fae5' },
                            { title: 'Total Transaksi', value: '156', trend: '-2.1% dari kemarin', isUp: false, icon: <ShoppingCart size={20} color="#ea580c" />, bg: '#ffedd5' },
                            { title: 'Stok Kritis', value: '7 Item', trend: 'Perlu restock segera', isUp: null, icon: <AlertCircle size={20} color="#e11d48" />, bg: '#ffe4e6' }
                        ].map((k, i) => (
                            <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                    <div style={{ background: k.bg, padding: '10px', borderRadius: '12px' }}>{k.icon}</div>
                                    {k.isUp !== null && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: k.isUp ? '#f0fdf4' : '#fef2f2', color: k.isUp ? '#166534' : '#991b1b', padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {k.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {k.trend}
                                        </div>
                                    )}
                                    {k.isUp === null && <div style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 600 }}>{k.trend}</div>}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>{k.title}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{k.value}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1.5rem' }}>
                        {/* Chart Area */}
                        <div style={{ flex: 2, background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Statistik Penjualan</h2>
                                <select style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem', color: '#475569', background: '#f8fafc', outline: 'none', cursor: 'pointer' }}>
                                    <option>7 Hari Terakhir</option>
                                    <option>Bulan Ini</option>
                                </select>
                            </div>
                            {/* Fake Bar Chart */}
                            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', marginTop: '2rem' }}>
                                {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '100%', maxWidth: '40px', height: `${h}%`, background: h === 100 ? '#4f46e5' : '#c7d2fe', borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease-out', position: 'relative' }}>
                                            {h === 100 && <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', background: '#1e1b4b', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Rp 8.2M</div>}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div style={{ flex: 1, background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Transaksi Terkini</h2>
                                <button style={{ border: 'none', background: 'none', color: '#4f46e5', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>Semua <ChevronRight size={16} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[{ n: 'Budi Santoso', t: 'Rp 184.500', time: '10:32', s: 'Lunas', id: 'INV-001' }, { n: 'Siti Rahayu', t: 'Rp 67.000', time: '09:15', s: 'Lunas', id: 'INV-002' }, { n: 'Pelanggan Umum', t: 'Rp 245.000', time: '08:45', s: 'Lunas', id: 'INV-003' }, { n: 'Ahmad Hidayat', t: 'Rp 128.000', time: '08:12', s: 'Kredit', id: 'INV-004' }, { n: 'Dewi Lestari', t: 'Rp 45.000', time: '07:30', s: 'Lunas', id: 'INV-005' }].map((tx, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: tx.s === 'Kredit' ? '#fff7ed' : '#f0fdf4', color: tx.s === 'Kredit' ? '#ea580c' : '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {tx.s === 'Kredit' ? <CreditCard size={18} /> : <Package size={18} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{tx.n}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{tx.id} • {tx.time}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{tx.t}</div>
                                            <span style={{ color: tx.s === 'Lunas' ? '#10b981' : '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>{tx.s}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Members */}
            {page === 'members' && (
                <div style={{ flex: 1, background: '#eef2ff', padding: '2rem', overflowY: 'auto' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '2rem' }}>Data Anggota Koperasi</h1>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e0e7ff', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', minWidth: '600px', padding: '1rem 1.5rem', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                            {['No.', 'No. Anggota', 'Nama', 'Saldo SHU', 'Status'].map(h => <div key={h}>{h}</div>)}
                        </div>
                        {MEMBERS.map((m, i) => (
                            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', minWidth: '600px', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>{i + 1}</div>
                                <div style={{ fontFamily: 'monospace', color: '#3730a3', fontWeight: 700, fontSize: '0.85rem' }}>{m.no}</div>
                                <div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem' }}>{m.name}</div>
                                <div style={{ color: '#1e293b', fontSize: '0.85rem' }}>{m.saldo}</div>
                                <div><span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>Aktif</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Inventory */}
            {page === 'inventory' && (
                <div style={{ flex: 1, background: '#eef2ff', padding: '2rem', overflowY: 'auto' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '2rem' }}>Inventori Barang</h1>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e0e7ff', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', minWidth: '500px', padding: '1rem 1.5rem', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                            {['Produk', 'Kategori', 'Stok', 'Harga'].map(h => <div key={h}>{h}</div>)}
                        </div>
                        {PRODUCTS.map(p => (
                            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', minWidth: '500px', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', alignItems: 'center' }}>
                                <div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem' }}>{p.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>{p.cat}</div>
                                <div><span style={{ background: p.stock < 10 ? '#fee2e2' : '#d1fae5', color: p.stock < 10 ? '#991b1b' : '#065f46', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>{p.stock} unit</span></div>
                                <div style={{ fontWeight: 700, color: '#3730a3', fontSize: '0.9rem' }}>Rp {fmt(p.price)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* POS */}
            {page === 'pos' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0', overflow: 'hidden', position: 'relative' }}>
                    {/* Products */}
                    <div style={{ flex: 1, background: '#eef2ff', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
                                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#1f2937' }}>🔍</span>
                                <input aria-label="Form input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..." style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '10px', border: '1px solid #e0e7ff', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Semua', 'Sembako', 'Minuman', 'Snack', 'Kebutuhan'].map(c => <button aria-label="Action button" key={c} onClick={() => setCat(c)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: cat === c ? '#3730a3' : '#fff', color: cat === c ? '#fff' : '#3730a3', fontWeight: cat === c ? 700 : 500, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}>{c}</button>)}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '1rem', overflowY: 'auto', flex: 1, alignContent: 'start', paddingBottom: '1rem' }}>
                            {filtered.map(p => (
                                <div key={p.id} onClick={() => addToCart(p)} style={{ background: '#fff', borderRadius: '14px', padding: '1rem', cursor: 'pointer', border: cart.find(c => c.id === p.id) ? '2px solid #3730a3' : '1px solid #e0e7ff', transition: 'all 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <img src={p.img} referrerPolicy="no-referrer" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} alt={p.name} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px', lineHeight: 1.2 }}>{p.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, color: '#3730a3', fontSize: '0.85rem' }}>Rp {fmt(p.price)}</span>
                                        <span style={{ fontSize: '0.65rem', color: p.stock < 10 ? '#b91c1c' : '#047857', background: p.stock < 10 ? '#fee2e2' : '#d1fae5', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>{p.stock}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Cart */}
                    {isMobile && (
                        <button aria-label="Action button" onClick={() => setShowCart(!showCart)} style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: '#3730a3', color: '#fff', border: 'none', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(55,48,163,0.4)', zIndex: 100001, cursor: 'pointer' }}>
                            🛒{cart.length > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 800 }}>{cart.length}</span>}
                        </button>
                    )}
                    <div style={{ width: isMobile ? '100%' : '360px', height: isMobile ? '70%' : 'auto', position: isMobile ? 'absolute' : 'relative', bottom: 0, zIndex: 100001, background: '#fff', display: isMobile && !showCart ? 'none' : 'flex', flexDirection: 'column', borderLeft: isMobile ? 'none' : '1px solid #e0e7ff', flexShrink: 0, boxShadow: isMobile ? '0 -4px 20px rgba(0,0,0,0.15)' : 'none', borderRadius: isMobile ? '20px 20px 0 0' : '0' }}>
                        {isMobile && <div onClick={() => setShowCart(false)} style={{ padding: '8px', textAlign: 'center', background: '#f8fafc', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: '20px 20px 0 0', borderBottom: '1px solid #f1f5f9' }}>▼ Tutup Keranjang</div>}
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e1b4b' }}>Pesanan Baru</div><div style={{ fontSize: '0.75rem', color: '#1e293b' }}>{invNum}</div></div>
                            <button aria-label="Action button" onClick={() => setCart([])} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>🗑</button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            {cart.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: '#1e293b' }}><div style={{ fontSize: '2rem' }}>🛒</div><p style={{ fontSize: '0.85rem' }}>Klik produk untuk menambahkan</p></div>}
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                                    <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e1b4b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#1e293b' }}>Rp {fmt(item.price)}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <button aria-label="Action button" onClick={() => upd(item.id, -1)} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>-</button>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '20px', textAlign: 'center' }}>{item.qty}</span>
                                        <button aria-label="Action button" onClick={() => upd(item.id, 1)} style={{ width: '22px', height: '22px', borderRadius: '4px', border: 'none', background: '#3730a3', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>+</button>
                                        <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.8rem', width: '70px', textAlign: 'right' }}>Rp {fmt(item.price * item.qty)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Member */}
                        <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                            <div onClick={() => setShowMember(!showMember)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: member ? '#eef2ff' : '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1b4b' }}>{member ? `👤 ${member.name}` : '👤 Pilih Anggota'}</span>
                                <span style={{ fontSize: '0.7rem', color: '#1e293b' }}>{showMember ? '▲' : '▼'}</span>
                            </div>
                            {showMember && <div style={{ marginTop: '6px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <div onClick={() => { setMember(null); setShowMember(false) }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.8rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>— Tanpa Anggota —</div>
                                {MEMBERS.map(m => <div key={m.id} onClick={() => { setMember(m); setShowMember(false) }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#1e1b4b', background: member?.id === m.id ? '#eef2ff' : 'transparent' }}>{m.name} <span style={{ color: '#1e293b', fontWeight: 400 }}>({m.no})</span></div>)}
                            </div>}
                        </div>
                        {/* Summary */}
                        <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#1e293b' }}><span>Subtotal ({cart.reduce((s, c) => s + c.qty, 0)} item)</span><span>Rp {fmt(total)}</span></div>
                            {member && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#047857' }}><span>Diskon Anggota (5%)</span><span>-Rp {fmt(discount)}</span></div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontWeight: 800, fontSize: '1.1rem', color: '#1e1b4b' }}><span>Total</span><span style={{ color: '#3730a3' }}>Rp {fmt(total - discount)}</span></div>
                            <button aria-label="Action button" onClick={checkout} disabled={!cart.length} style={{ width: '100%', padding: '14px', background: cart.length ? '#3730a3' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: cart.length ? 'pointer' : 'not-allowed', fontSize: '0.95rem', boxShadow: cart.length ? '0 4px 12px rgba(79,70,229,0.3)' : 'none' }}>Proses Pembayaran</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Receipt Modal */}
            {receipt && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setReceipt(null)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '2.5rem', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                        <div style={{ width: '56px', height: '56px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem' }}>✓</div>
                        <h2 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: '0.5rem' }}>Pembayaran Berhasil!</h2>
                        <div style={{ fontFamily: 'monospace', color: '#1e293b', marginBottom: '1rem', fontSize: '0.9rem' }}>{receipt.inv}</div>
                        {receipt.member && <div style={{ color: '#3730a3', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Anggota: {receipt.member.name}</div>}
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                            {receipt.items.map(i => <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}><span>{i.name} ×{i.qty}</span><span style={{ fontWeight: 600 }}>Rp {fmt(i.price * i.qty)}</span></div>)}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #e5e7eb', color: '#3730a3' }}><span>Total</span><span>Rp {fmt(receipt.total)}</span></div>
                        </div>
                        <div style={{ color: '#1e293b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>• {receipt.time}</div>
                        <button aria-label="Action button" onClick={() => setReceipt(null)} style={{ width: '100%', background: '#3730a3', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Transaksi Baru</button>
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}
