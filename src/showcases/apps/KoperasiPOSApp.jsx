import { useState, useEffect } from 'react'
const PRODUCTS = [
    { id: 1, name: 'Beras Premium 5kg', price: 75000, stock: 24, cat: 'Sembako', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&fit=crop' },
    { id: 2, name: 'Minyak Goreng 2L', price: 34500, stock: 12, cat: 'Sembako', img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&fit=crop' },
    { id: 3, name: 'Gula Pasir 1kg', price: 16000, stock: 45, cat: 'Sembako', img: 'https://images.unsplash.com/photo-1581006560933-281b37f44d8c?w=300&fit=crop' },
    { id: 4, name: 'Telur Ayam 1kg', price: 28000, stock: 8, cat: 'Sembako', img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&fit=crop' },
    { id: 5, name: 'Susu UHT 1L', price: 18500, stock: 30, cat: 'Minuman', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&fit=crop' },
    { id: 6, name: 'Kopi Bubuk 200g', price: 24000, stock: 15, cat: 'Minuman', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&fit=crop' },
    { id: 7, name: 'Mie Instan (Karton)', price: 115000, stock: 5, cat: 'Snack', img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec29a?w=300&fit=crop' },
    { id: 8, name: 'Keripik Singkong', price: 12000, stock: 35, cat: 'Snack', img: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=300&fit=crop' },
    { id: 9, name: 'Teh Botol 500ml', price: 5000, stock: 60, cat: 'Minuman', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&fit=crop' },
    { id: 10, name: 'Sabun Cuci 1kg', price: 22000, stock: 20, cat: 'Kebutuhan', img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&fit=crop' },
]
const MEMBERS = [{ id: 1, no: 'KOP-001', name: 'Budi Santoso', saldo: 'Rp 1.25Jt' }, { id: 2, no: 'KOP-002', name: 'Siti Rahayu', saldo: 'Rp 890rb' }, { id: 3, no: 'KOP-003', name: 'Ahmad Hidayat', saldo: 'Rp 2.1Jt' }, { id: 4, no: 'KOP-004', name: 'Dewi Lestari', saldo: 'Rp 450rb' }]
const fmt = n => n.toLocaleString('id-ID')
export default function KoperasiPOSApp() {
    const [page, setPage] = useState('pos')
    const [cat, setCat] = useState('Semua')
    const [search, setSearch] = useState('')
    const [cart, setCart] = useState([])
    const [member, setMember] = useState(null)
    const [showMember, setShowMember] = useState(false)
    const [receipt, setReceipt] = useState(null)
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
            {/* Sidebar */}
            <div style={{ width: '220px', background: '#312e81', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', background: '#4f46e5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>⚡</div>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Koperasi ARFF</span>
                    </div>
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {SIDES.map((s, i) => (
                        <div key={s.label} onClick={() => { if (i === 0) setPage('dashboard'); else if (i === 1) setPage('pos'); else if (i === 2) setPage('members'); else if (i === 3) setPage('inventory') }} style={{ padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', cursor: i <= 3 ? 'pointer' : 'default', background: pageIdx === i ? '#4f46e5' : 'transparent', color: pageIdx === i ? '#fff' : '#c7d2fe', fontSize: '0.85rem', fontWeight: pageIdx === i ? 600 : 400, opacity: i > 3 ? 0.4 : 1, transition: 'all 0.15s' }}>
                            <span>{s.icon}</span><span>{s.label}</span>
                        </div>
                    ))}
                </div>
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* SVG avatar — no external image dependency */}
                    <svg width="32" height="32" viewBox="0 0 32 32" style={{ borderRadius: '50%', flexShrink: 0 }} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#4f46e5" />
                        <circle cx="16" cy="13" r="5" fill="#c7d2fe" />
                        <ellipse cx="16" cy="26" rx="9" ry="5.5" fill="#c7d2fe" />
                    </svg>
                    <div><div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Admin Kasir</div><div style={{ fontSize: '0.7rem', color: '#c7d2fe' }}>Shift Pagi</div></div>
                </div>
            </div>
            {/* Dashboard */}
            {page === 'dashboard' && (
                <div style={{ flex: 1, background: '#eef2ff', padding: '2rem', overflowY: 'auto' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '2rem' }}>Dashboard Koperasi</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        {[{ l: 'Total Anggota', v: '248', c: '#4f46e5', i: '👥' }, { l: 'Transaksi Hari Ini', v: '34', c: '#10b981', i: '🛒' }, { l: 'Pendapatan', v: 'Rp 4.2Jt', c: '#f59e0b', i: '💰' }, { l: 'Stok Rendah', v: '7', c: '#ef4444', i: '⚠️' }].map(m => (
                            <div key={m.l} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e0e7ff' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.i}</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b4b' }}>{m.v}</div>
                                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>{m.l}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e0e7ff' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '1rem' }}>Transaksi Terbaru</h2>
                        {[{ n: 'Budi Santoso', t: 'Rp 184.500', time: '10:32', s: 'Lunas' }, { n: 'Siti Rahayu', t: 'Rp 67.000', time: '09:15', s: 'Lunas' }, { n: 'Walk-in', t: 'Rp 245.000', time: '08:45', s: 'Lunas' }, { n: 'Ahmad Hidayat', t: 'Rp 128.000', time: '08:12', s: 'Kredit' }].map((tx, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                                <div><div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem' }}>{tx.n}</div><div style={{ fontSize: '0.75rem', color: '#475569' }}>{tx.time}</div></div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ background: tx.s === 'Lunas' ? '#d1fae5' : '#fef3c7', color: tx.s === 'Lunas' ? '#059669' : '#d97706', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>{tx.s}</span>
                                    <div style={{ fontWeight: 700, color: '#4f46e5' }}>{tx.t}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Members */}
            {page === 'members' && (
                <div style={{ flex: 1, background: '#eef2ff', padding: '2rem', overflowY: 'auto' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '2rem' }}>Data Anggota Koperasi</h1>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e0e7ff', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', padding: '1rem 1.5rem', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                            {['No.', 'No. Anggota', 'Nama', 'Saldo SHU', 'Status'].map(h => <div key={h}>{h}</div>)}
                        </div>
                        {MEMBERS.map((m, i) => (
                            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr 1fr', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{i + 1}</div>
                                <div style={{ fontFamily: 'monospace', color: '#4f46e5', fontWeight: 700, fontSize: '0.85rem' }}>{m.no}</div>
                                <div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem' }}>{m.name}</div>
                                <div style={{ color: '#475569', fontSize: '0.85rem' }}>{m.saldo}</div>
                                <div><span style={{ background: '#d1fae5', color: '#059669', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>Aktif</span></div>
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
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', background: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                            {['Produk', 'Kategori', 'Stok', 'Harga'].map(h => <div key={h}>{h}</div>)}
                        </div>
                        {PRODUCTS.map(p => (
                            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', alignItems: 'center' }}>
                                <div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem' }}>{p.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#475569' }}>{p.cat}</div>
                                <div><span style={{ background: p.stock < 10 ? '#fee2e2' : '#d1fae5', color: p.stock < 10 ? '#dc2626' : '#059669', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>{p.stock} unit</span></div>
                                <div style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.9rem' }}>Rp {fmt(p.price)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* POS */}
            {page === 'pos' && (
                <div style={{ flex: 1, display: 'flex', gap: '0', overflow: 'hidden' }}>
                    {/* Products */}
                    <div style={{ flex: 1, background: '#eef2ff', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
                                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }}>🔍</span>
                                <input aria-label="Form input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..." style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '10px', border: '1px solid #e0e7ff', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Semua', 'Sembako', 'Minuman', 'Snack', 'Kebutuhan'].map(c => <button aria-label="Action button" key={c} onClick={() => setCat(c)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: cat === c ? '#4f46e5' : '#fff', color: cat === c ? '#fff' : '#4f46e5', fontWeight: cat === c ? 700 : 500, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}>{c}</button>)}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '1rem', overflowY: 'auto', flex: 1, alignContent: 'start', paddingBottom: '1rem' }}>
                            {filtered.map(p => (
                                <div key={p.id} onClick={() => addToCart(p)} style={{ background: '#fff', borderRadius: '14px', padding: '1rem', cursor: 'pointer', border: cart.find(c => c.id === p.id) ? '2px solid #4f46e5' : '1px solid #e0e7ff', transition: 'all 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <img src={p.img} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} alt={p.name} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px', lineHeight: 1.2 }}>{p.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 800, color: '#4f46e5', fontSize: '0.85rem' }}>Rp {fmt(p.price)}</span>
                                        <span style={{ fontSize: '0.65rem', color: p.stock < 10 ? '#ef4444' : '#10b981', background: p.stock < 10 ? '#fee2e2' : '#d1fae5', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>{p.stock}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Cart */}
                    <div style={{ width: '360px', background: '#fff', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e0e7ff', flexShrink: 0 }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div><div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e1b4b' }}>Pesanan Baru</div><div style={{ fontSize: '0.75rem', color: '#475569' }}>{invNum}</div></div>
                            <button aria-label="Action button" onClick={() => setCart([])} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>🗑</button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            {cart.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}><div style={{ fontSize: '2rem' }}>🛒</div><p style={{ fontSize: '0.85rem' }}>Klik produk untuk menambahkan</p></div>}
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                                    <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e1b4b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>Rp {fmt(item.price)}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <button aria-label="Action button" onClick={() => upd(item.id, -1)} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>-</button>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '20px', textAlign: 'center' }}>{item.qty}</span>
                                        <button aria-label="Action button" onClick={() => upd(item.id, 1)} style={{ width: '22px', height: '22px', borderRadius: '4px', border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>+</button>
                                        <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.8rem', width: '70px', textAlign: 'right' }}>Rp {fmt(item.price * item.qty)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Member */}
                        <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                            <div onClick={() => setShowMember(!showMember)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: member ? '#eef2ff' : '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1b4b' }}>{member ? `👤 ${member.name}` : '👤 Pilih Anggota'}</span>
                                <span style={{ fontSize: '0.7rem', color: '#475569' }}>{showMember ? '▲' : '▼'}</span>
                            </div>
                            {showMember && <div style={{ marginTop: '6px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <div onClick={() => { setMember(null); setShowMember(false) }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.8rem', color: '#475569', borderBottom: '1px solid #f1f5f9' }}>— Tanpa Anggota —</div>
                                {MEMBERS.map(m => <div key={m.id} onClick={() => { setMember(m); setShowMember(false) }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#1e1b4b', background: member?.id === m.id ? '#eef2ff' : 'transparent' }}>{m.name} <span style={{ color: '#475569', fontWeight: 400 }}>({m.no})</span></div>)}
                            </div>}
                        </div>
                        {/* Summary */}
                        <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#475569' }}><span>Subtotal ({cart.reduce((s, c) => s + c.qty, 0)} item)</span><span>Rp {fmt(total)}</span></div>
                            {member && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', color: '#10b981' }}><span>Diskon Anggota (5%)</span><span>-Rp {fmt(discount)}</span></div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontWeight: 800, fontSize: '1.1rem', color: '#1e1b4b' }}><span>Total</span><span style={{ color: '#4f46e5' }}>Rp {fmt(total - discount)}</span></div>
                            <button aria-label="Action button" onClick={checkout} disabled={!cart.length} style={{ width: '100%', padding: '14px', background: cart.length ? '#4f46e5' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: cart.length ? 'pointer' : 'not-allowed', fontSize: '0.95rem', boxShadow: cart.length ? '0 4px 12px rgba(79,70,229,0.3)' : 'none' }}>Proses Pembayaran</button>
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
                        <div style={{ fontFamily: 'monospace', color: '#475569', marginBottom: '1rem', fontSize: '0.9rem' }}>{receipt.inv}</div>
                        {receipt.member && <div style={{ color: '#4f46e5', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Anggota: {receipt.member.name}</div>}
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                            {receipt.items.map(i => <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}><span>{i.name} ×{i.qty}</span><span style={{ fontWeight: 600 }}>Rp {fmt(i.price * i.qty)}</span></div>)}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #e5e7eb', color: '#4f46e5' }}><span>Total</span><span>Rp {fmt(receipt.total)}</span></div>
                        </div>
                        <div style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1.5rem' }}>• {receipt.time}</div>
                        <button aria-label="Action button" onClick={() => setReceipt(null)} style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Transaksi Baru</button>
                    </div>
                </div>
            )}
        </div>
    )
}
