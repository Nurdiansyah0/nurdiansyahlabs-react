import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'

/* ================================================================
   KOPERASI ARFF – POS & Member System
   ================================================================ */
function KoperasiPOS() {
    return (
        <div style={{ display: 'flex', height: '100vh', background: '#eef2ff', fontFamily: '"Inter", sans-serif' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#312e81', color: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '30px', height: '30px', background: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Sistem Koperasi</div>
                </div>
                <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    {['Dashboard', 'Kasir POS', 'Data Anggota', 'Inventori', 'Laporan Keuangan', 'Pengaturan'].map((t, i) => (
                        <div key={t} style={{
                            padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600,
                            background: i === 1 ? '#4f46e5' : 'transparent', color: i === 1 ? '#fff' : '#c7d2fe',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                            <i className={`fas fa-${['home', 'shopping-cart', 'users', 'box', 'chart-bar', 'cog'][i]}`}></i>
                            {t}
                        </div>
                    ))}
                </div>
                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop" style={{ width: '36px', height: '36px', borderRadius: '50%' }} alt="Admin" />
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Admin Kasir</div>
                        <div style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Shift Pagi</div>
                    </div>
                </div>
            </div>

            {/* Main Content (POS View) */}
            <div style={{ flex: 1, padding: '1.5rem', display: 'flex', gap: '1.5rem', overflow: 'hidden' }}>

                {/* Product Grid Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, position: 'relative', maxWidth: '400px' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
                            <input placeholder="Cari barang atau scan barcode..." style={{ width: '100%', padding: '12px 1rem 12px 2.5rem', borderRadius: '12px', border: '1px solid #e0e7ff', outline: 'none', fontSize: '0.9rem' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['Semua', 'Sembako', 'Minuman', 'Snack'].map((c, i) => (
                                <button key={c} style={{
                                    padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.85rem',
                                    background: i === 0 ? '#4f46e5' : '#fff', color: i === 0 ? '#fff' : '#4f46e5', cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>{c}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', overflowY: 'auto', paddingBottom: '1rem', alignContent: 'start' }}>
                        {[
                            { name: 'Beras Premium 5kg', price: '75.000', stock: 24, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&fit=crop' },
                            { name: 'Minyak Goreng 2L', price: '34.500', stock: 12, img: 'https://images.unsplash.com/photo-1627993433696-6e2eeaa4b3ce?w=300&fit=crop' },
                            { name: 'Gula Pasir 1kg', price: '16.000', stock: 45, img: 'https://images.unsplash.com/photo-1581006560933-281b37f44d8c?w=300&fit=crop' },
                            { name: 'Telur Ayam 1kg', price: '28.000', stock: 8, img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&fit=crop' },
                            { name: 'Susu UHT 1L', price: '18.500', stock: 30, img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&fit=crop' },
                            { name: 'Kopi Bubuk 200g', price: '24.000', stock: 15, img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&fit=crop' },
                            { name: 'Mie Instan (Karton)', price: '115.000', stock: 5, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec29a?w=300&fit=crop' },
                            { name: 'Sabun Cuci 1kg', price: '22.000', stock: 20, img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&fit=crop' },
                        ].map((p, i) => (
                            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', cursor: 'pointer', border: '1px solid #e0e7ff', transition: 'transform 0.1s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img src={p.img} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} alt={p.name} />
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1b4b', marginBottom: '4px', lineHeight: 1.2 }}>{p.name}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                    <span style={{ fontWeight: 800, color: '#4f46e5', fontSize: '0.95rem' }}>Rp {p.price}</span>
                                    <span style={{ fontSize: '0.7rem', color: p.stock < 10 ? '#ef4444' : '#10b981', background: p.stock < 10 ? '#fee2e2' : '#d1fae5', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Stok: {p.stock}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Area */}
                <div style={{ width: '380px', background: '#fff', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e1b4b' }}>Pesanan Baru</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>INV-260221-001</div>
                        </div>
                        <button style={{ background: '#f1f5f9', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}><i className="fas fa-trash"></i></button>
                    </div>

                    {/* Cart Items */}
                    <div style={{ flex: 1, padding: '1rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'Beras Premium 5kg', price: '75.000', qty: 2, total: '150.000' },
                            { name: 'Minyak Goreng 2L', price: '34.500', qty: 1, total: '34.500' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e1b4b', marginBottom: '4px' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Rp {item.price}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px', borderRadius: '8px' }}>
                                        <button style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>-</button>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '16px', textAlign: 'center' }}>{item.qty}</span>
                                        <button style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>+</button>
                                    </div>
                                    <div style={{ fontWeight: 800, color: '#1e1b4b', width: '70px', textAlign: 'right', fontSize: '0.95rem' }}>{item.total}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Member Select */}
                    <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '30px', height: '30px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}><i className="fas fa-user"></i></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e1b4b' }}>Pilih Anggota Koperasi</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Untuk pembayaran SHU/Kredit</div>
                                </div>
                            </div>
                            <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}></i>
                        </div>
                    </div>

                    {/* Summary & Pay */}
                    <div style={{ padding: '1.5rem', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                            <span>Subtotal</span><span>Rp 184.500</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#64748b', fontSize: '0.85rem' }}>
                            <span>Pajak (0%)</span><span>Rp 0</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: '#1e1b4b', fontSize: '1.2rem', fontWeight: 800 }}>
                            <span>Total</span><span style={{ color: '#4f46e5' }}>Rp 184.500</span>
                        </div>
                        <button style={{ width: '100%', padding: '16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                            Proses Pembayaran
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   WAREHOUSE MANAGEMENT SYSTEM
   ================================================================ */
function Warehouse() {
    return (
        <div style={{ background: '#f3f4f6', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
            {/* Top Nav */}
            <div style={{ background: '#111827', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#10b981', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-box"></i></div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em' }}>WAREHOUSE<span style={{ fontWeight: 300, color: '#9ca3af' }}>/OS</span></div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Dashboard</span>
                    <span>Inventory</span>
                    <span>Inbound</span>
                    <span>Outbound</span>
                    <span>Reports</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <i className="fas fa-bell" style={{ color: '#9ca3af', fontSize: '1.1rem' }}></i>
                        <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', width: '8px', height: '8px', borderRadius: '50%' }}></div>
                    </div>
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop" style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="User" />
                </div>
            </div>

            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>

                {/* Left Area: Metrics + Heatmap */}
                <div>
                    {/* Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {[
                            { label: 'Total Pallets', val: '1,284', trend: '+12', color: '#3b82f6' },
                            { label: 'Capacity Used', val: '84%', trend: 'Zone C full', color: '#f59e0b' },
                            { label: 'Pending Putaway', val: '42', trend: 'Urgent: 5', color: '#ef4444' },
                            { label: 'Orders to Pick', val: '156', trend: 'Cutoff 14:00', color: '#10b981' },
                        ].map(m => (
                            <div key={m.label} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, marginBottom: '8px' }}>{m.label}</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{m.val}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: m.color }}>{m.trend}</div>
                            </div>
                        ))}
                    </div>

                    {/* Warehouse Floor Heatmap Mock */}
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#111827' }}>Live Floor Map</h2>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#d1fae5', borderRadius: '2px' }} /> Empty</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#34d399', borderRadius: '2px' }} /> Optimal</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#fbbf24', borderRadius: '2px' }} /> High</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }} /> Full</span>
                            </div>
                        </div>

                        {/* Grid simulation */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            {Array.from({ length: 96 }).map((_, i) => {
                                // Simulate heatmap data
                                let color = '#d1fae5' // default green
                                if (i % 7 === 0) color = '#ef4444' // some full
                                if (i % 5 === 0) color = '#fbbf24' // some high
                                if (i % 2 === 0 && i % 4 !== 0) color = '#34d399' // some optimal

                                // Aisles
                                if (i % 12 === 5 || i % 12 === 6) return <div key={i} style={{ height: '30px', background: 'transparent' }} />

                                return <div key={i} style={{ height: '30px', background: color, borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', opacity: 0.9 }} title={`Rack A-${i}`} />
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Area: Activities */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827' }}>Recent Scans</h2>
                    </div>
                    <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                        {[
                            { action: 'Putaway', sku: 'SKU-8921-A', loc: 'Zone C • Rack 12', time: 'Just now', type: 'in', user: 'JD' },
                            { action: 'Pick', sku: 'SKU-4412-B', loc: 'Zone A • Rack 02', time: '2 mins ago', type: 'out', user: 'SM' },
                            { action: 'Pick', sku: 'SKU-4412-C', loc: 'Zone A • Rack 02', time: '5 mins ago', type: 'out', user: 'SM' },
                            { action: 'Relocate', sku: 'SKU-1199-X', loc: 'Z-B to Z-D', time: '12 mins ago', type: 'move', user: 'AJ' },
                            { action: 'Putaway', sku: 'SKU-6652-Y', loc: 'Zone F • Rack 44', time: '18 mins ago', type: 'in', user: 'JD' },
                            { action: 'Inventory Check', sku: 'SKU-2231-A', loc: 'Zone C • Rack 08', time: '32 mins ago', type: 'check', user: 'RW' },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i !== 5 ? '1px solid #f3f4f6' : 'none' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem',
                                    background: s.type === 'in' ? '#d1fae5' : s.type === 'out' ? '#fee2e2' : s.type === 'move' ? '#fef3c7' : '#e0e7ff',
                                    color: s.type === 'in' ? '#059669' : s.type === 'out' ? '#dc2626' : s.type === 'move' ? '#d97706' : '#4f46e5'
                                }}>
                                    <i className={`fas fa-${s.type === 'in' ? 'arrow-down' : s.type === 'out' ? 'arrow-up' : s.type === 'move' ? 'exchange-alt' : 'clipboard-check'}`}></i>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{s.action} <span style={{ fontFamily: 'monospace', color: '#6b7280', fontSize: '0.75rem', marginLeft: '4px', fontWeight: 500 }}>{s.sku}</span></div>
                                        <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{s.time}</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                        {s.loc} • <span style={{ fontWeight: 600 }}>{s.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                        <button style={{ width: '100%', background: '#111827', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <i className="fas fa-barcode"></i> Scan New Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   VEHICLE INSPECTION PLATFORM
   ================================================================ */
function VehicleInspection() {
    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            {/* Tablet Mockup Container */}
            <div style={{ width: '800px', background: '#fff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', overflow: 'hidden', border: '8px solid #1e293b' }}>

                {/* Header */}
                <div style={{ background: '#f59e0b', color: '#fff', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <i className="fas fa-car" style={{ fontSize: '1.5rem' }}></i>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.02em' }}>INSPECT PRO</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Digital Condition Report</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>ID: REP-8842-X</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>21 Feb 2026 • 14:30</div>
                    </div>
                </div>

                {/* Main View */}
                <div style={{ display: 'flex', height: '600px' }}>
                    {/* Left: Vehicle Schematic */}
                    <div style={{ flex: 1.2, borderRight: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', background: '#fafaf9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Vehicle</div>
                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>2023 Toyota Camry LE</div>
                                <div style={{ fontSize: '0.85rem', color: '#475569', fontFamily: 'monospace' }}>VIN: 4T1B11HK5PU******</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Odometer</div>
                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>42,501 mi</div>
                            </div>
                        </div>

                        {/* Car schematic placeholder */}
                        <div style={{ flex: 1, border: '2px dashed #cbd5e1', borderRadius: '16px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                            <i className="fas fa-car-side" style={{ fontSize: '12rem', color: '#e2e8f0' }}></i>

                            {/* Damage markers */}
                            <div style={{ position: 'absolute', top: '30%', left: '20%', width: '24px', height: '24px', background: '#ef4444', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, boxShadow: '0 0 0 4px rgba(239,68,68,0.2)', cursor: 'pointer' }}>1</div>
                            <div style={{ position: 'absolute', bottom: '40%', right: '30%', width: '24px', height: '24px', background: '#ef4444', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, boxShadow: '0 0 0 4px rgba(239,68,68,0.2)', cursor: 'pointer' }}>2</div>

                            <div style={{ position: 'absolute', bottom: '1rem', width: '100%', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Tap area to add damage marker</div>
                        </div>
                    </div>

                    {/* Right: Checklist & Photos */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ flex: 1, padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#d97706', borderBottom: '3px solid #f59e0b', cursor: 'pointer' }}>Exterior (2)</div>
                            <div style={{ flex: 1, padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>Interior</div>
                            <div style={{ flex: 1, padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>Mechanical</div>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                            {/* Damages List */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Reported Damages</div>

                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem' }}><span style={{ background: '#ef4444', color: '#fff', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.6rem', marginRight: '6px' }}>1</span> Front Bumper Scratch</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>Severity: Minor</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <img src="https://images.unsplash.com/photo-1590213019310-9b4334f590bb?w=150&fit=crop" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} alt="Damage 1" />
                                        <div style={{ flex: 1, background: '#fff', border: '1px dashed #fca5a5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>+ Add Photo</div>
                                    </div>
                                </div>

                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem' }}><span style={{ background: '#ef4444', color: '#fff', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.6rem', marginRight: '6px' }}>2</span> Rear Dent</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>Severity: Moderate</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ flex: 1, background: '#fff', border: '1px dashed #fca5a5', borderRadius: '8px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>+ Add Photo</div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Standard Area Inspection</div>
                                {['Windshield / Glass', 'Headlights / Taillights', 'Tires & Wheels', 'Paint Condition'].map(item => (
                                    <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#334155' }}>{item}</div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><i className="fas fa-check"></i></div>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#f1f5f9', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18}  /></div>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: '#f1f5f9', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>NA</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer CTA */}
                        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
                            <button style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Save Draft</button>
                            <button style={{ flex: 2, padding: '12px', background: '#f59e0b', border: 'none', borderRadius: '10px', fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 6px rgba(245,158,11,0.2)' }}>Complete & Sign</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   EMPLOYEE ATTENDANCE PORTAL
   ================================================================ */
function Attendance() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#fdfbfe', fontFamily: '"Inter", sans-serif' }}>
            {/* Sidebar minimal */}
            <div style={{ width: '100px', background: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', borderRadius: '12px', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>H</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#94a3b8', fontSize: '1.2rem' }}>
                    <i className="fas fa-th-large" style={{ color: '#8b5cf6' }}></i>
                    <i className="fas fa-users"></i>
                    <i className="fas fa-calendar-alt"></i>
                    <i className="fas fa-chart-pie"></i>
                    <i className="fas fa-cog"></i>
                </div>
            </div>

            {/* Main view */}
            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>Today's Attendance</h1>
                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Tuesday, October 24, 2026 • 08:42 AM</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#475569', padding: '10px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Download Report</button>
                        <button style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(139,92,246,0.2)' }}>+ Manual Check-in</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {[
                        { label: 'Total Employees', val: '142', sub: 'Active roster', icon: 'fas fa-users', color: '#3b82f6', bg: '#eff6ff' },
                        { label: 'On Time', val: '118', sub: '83% of workforce', icon: 'fas fa-check-circle', color: '#10b981', bg: '#ecfdf5' },
                        { label: 'Late', val: '14', sub: 'Needs attention', icon: 'fas fa-clock', color: '#f59e0b', bg: '#fffbeb' },
                        { label: 'Absent/Leave', val: '10', sub: 'Approved: 8', icon: 'fas fa-bed', color: '#ef4444', bg: '#fef2f2' },
                    ].map(s => (
                        <div key={s.label} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                                    <i className={s.icon}></i>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{s.val}</div>
                            </div>
                            <div style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem', marginBottom: '4px' }}>{s.label}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>

                    {/* Live log */}
                    <div style={{ flex: 2, background: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Live Check-ins</h2>
                            <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                                <div style={{ background: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>All</div>
                                <div style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Late Only</div>
                            </div>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Employee</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Department</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Time</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Method / Status</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.9rem' }}>
                                {[
                                    { name: 'Sarah Jenkins', role: 'Lead Designer', dept: 'Product', time: '08:41 AM', stat: 'On Time', meth: 'Face ID', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop' },
                                    { name: 'Michael Chen', role: 'Frontend Dev', dept: 'Engineering', time: '08:35 AM', stat: 'On Time', meth: 'Mobile GPS', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop' },
                                    { name: 'David Smith', role: 'Account Exec', dept: 'Sales', time: '08:32 AM', stat: 'Late (2m)', meth: 'Mobile GPS', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop' },
                                    { name: 'Elena Rodriguez', role: 'Marketing Manager', dept: 'Marketing', time: '08:20 AM', stat: 'On Time', meth: 'Keycard', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop' },
                                    { name: 'James Wilson', role: 'Backend Dev', dept: 'Engineering', time: '08:15 AM', stat: 'On Time', meth: 'Face ID', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop' },
                                ].map((e, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={e.img} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt={e.name} />
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{e.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>{e.dept}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#1e293b' }}>{e.time}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontWeight: 500 }}>{e.meth}</span>
                                                <span style={{ fontSize: '0.75rem', background: e.stat.includes('Late') ? '#fef2f2' : '#ecfdf5', color: e.stat.includes('Late') ? '#ef4444' : '#10b981', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>{e.stat}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Right widget: Map tracking */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Field Team Output</h3>
                                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px #dcfce7' }}></div>
                            </div>
                            <div style={{ background: '#f8fafc', height: '180px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                {/* Map mockup */}
                                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)' }}></div>
                                <div style={{ position: 'relative', zIndex: 10, background: '#fff', padding: '8px 12px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&fit=crop" style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="Pin" />
                                    David S. — Client Visit
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '20px', padding: '1.5rem', color: '#fff', boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9, marginBottom: '8px' }}>Payroll Processing</div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem' }}>October Cycle</h3>
                            <div style={{ background: 'rgba(255,255,255,0.2)', height: '6px', borderRadius: '999px', marginBottom: '8px' }}>
                                <div style={{ width: '85%', height: '100%', background: '#fff', borderRadius: '999px' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                                <span>85% timesheets approved</span>
                                <span>Requires Action</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

/* ================================================================
   ROUTER
   ================================================================ */
const projects = {
    'koperasi-pos': { title: 'Koperasi ARFF POS & Member System', subtitle: 'Interactive Mockup Integration', component: <KoperasiPOS /> },
    'warehouse': { title: 'Warehouse Management System', subtitle: 'Interactive Mockup Integration', component: <Warehouse /> },
    'vehicle-inspection': { title: 'Vehicle Inspection Platform', subtitle: 'Interactive Mockup Integration', component: <VehicleInspection /> },
    'attendance': { title: 'Employee Attendance Portal', subtitle: 'Interactive Mockup Integration', component: <Attendance /> },
}

export default function FullstackShowcase() {
    const { projectId } = useParams()
    const project = projects[projectId]

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="B" accentColor="#4338ca">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                <h2>Project not found</h2>
            </div>
        </ShowcaseLayout>
    )

    return (
        <ShowcaseLayout title={project.title} subtitle={project.subtitle} service="Fullstack" accentColor="#4338ca" githubUrl="https://github.com/Nurdiansyah0">
            {project.component}
        </ShowcaseLayout>
    )
}
