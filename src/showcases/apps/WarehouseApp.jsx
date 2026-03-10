import { useState, useEffect, useMemo } from 'react'
import { getOptimizedImg } from '../../utils/imgHelper'
// rackData factory — called once inside useMemo
const buildRackData = () => Array.from({ length: 96 }).map((_, i) => {
    const isAisle = i % 12 === 5 || i % 12 === 6
    if (isAisle) return { isAisle: true }
    let c = '#d1fae5', s = 'Empty', p = Math.floor(Math.random() * 30)
    if (i % 7 === 0) { c = '#ef4444'; s = 'Full'; p = 100 }
    else if (i % 5 === 0) { c = '#fbbf24'; s = 'High'; p = 75 + Math.floor(Math.random() * 20) }
    else if (i % 2 === 0 && i % 4 !== 0) { c = '#34d399'; s = 'Optimal'; p = 40 + Math.floor(Math.random() * 30) }
    return { isAisle: false, color: c, status: s, pct: p, name: `Rack ${String.fromCharCode(65 + Math.floor(i / 12))}-${(i % 12) + 1}` }
})
const initScans = [
    { action: 'Putaway', sku: 'SKU-8921-A', loc: 'Zone C • Rack 12', time: 'Just now', type: 'in', user: 'JD' },
    { action: 'Pick', sku: 'SKU-4412-B', loc: 'Zone A • Rack 02', time: '2 min ago', type: 'out', user: 'SM' },
    { action: 'Relocate', sku: 'SKU-1199-X', loc: 'Z-B to Z-D', time: '12 min ago', type: 'move', user: 'AJ' },
    { action: 'Inventory Check', sku: 'SKU-2231-A', loc: 'Zone C • Rack 08', time: '32 min ago', type: 'check', user: 'RW' },
]
const rnd = () => {
    const aa = [{ action: 'Putaway', type: 'in' }, { action: 'Pick', type: 'out' }, { action: 'Relocate', type: 'move' }, { action: 'Check', type: 'check' }]
    const uu = ['JD', 'SM', 'AJ', 'RW', 'NR']
    const r = aa[Math.floor(Math.random() * aa.length)]
    return { ...r, sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}-${['A', 'B', 'C', 'X', 'Y'][Math.floor(Math.random() * 5)]}`, loc: `Zone ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]} • Rack ${String(Math.floor(1 + Math.random() * 50)).padStart(2, '0')}`, time: 'Just now', user: uu[Math.floor(Math.random() * 5)] }
}
const ITEMS = [
    { sku: 'SKU-8921-A', name: 'Steel Pipe 6m', qty: 48, loc: 'Zone C-12', cat: 'Raw Material', last: '2h ago' },
    { sku: 'SKU-4412-B', name: 'Paint Drum 20L', qty: 15, loc: 'Zone A-02', cat: 'Chemicals', last: '4h ago' },
    { sku: 'SKU-1199-X', name: 'Bolt Set M10', qty: 500, loc: 'Zone D-08', cat: 'Hardware', last: '1d ago' },
    { sku: 'SKU-6652-Y', name: 'Valve 2 inch', qty: 30, loc: 'Zone F-44', cat: 'Parts', last: '3h ago' },
    { sku: 'SKU-2231-A', name: 'Copper Wire 100m', qty: 8, loc: 'Zone C-08', cat: 'Electrical', last: '2d ago' },
    { sku: 'SKU-7719-B', name: 'Safety Helmet', qty: 25, loc: 'Zone B-33', cat: 'Safety', last: '1h ago' },
]
export default function WarehouseApp() {
    const [page, setPage] = useState('dashboard')
    const [scans, setScans] = useState(initScans)
    const [hovered, setHovered] = useState(null)
    const [notifOpen, setNotifOpen] = useState(false)
    // useMemo: rack layout is computed once and never randomises again
    const rackData = useMemo(() => buildRackData(), [])
    useEffect(() => { const t = setInterval(() => setScans(p => [rnd(), ...p.slice(0, 9)]), 4000); return () => clearInterval(t) }, [])
    const addScan = () => setScans(p => [rnd(), ...p.slice(0, 9)])
    const PAGES = [{ k: 'dashboard', i: '📊', l: 'Dashboard' }, { k: 'inventory', i: '📦', l: 'Inventory' }, { k: 'inbound', i: '⬇️', l: 'Inbound' }, { k: 'outbound', i: '⬆️', l: 'Outbound' }, { k: 'reports', i: '📈', l: 'Reports' }]
    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: '"Inter",sans-serif', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ width: '220px', background: '#111827', color: '#fff', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: '#10b981', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>📦</div>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>WAREHOUSE/OS</span>
                    </div>
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {PAGES.map(p => <div key={p.k} onClick={() => setPage(p.k)} style={{ padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: page === p.k ? 'rgba(16,185,129,0.15)' : 'transparent', color: page === p.k ? '#10b981' : '#9ca3af', fontSize: '0.85rem', fontWeight: page === p.k ? 600 : 400, transition: 'all 0.15s' }}>{p.i} {p.l}</div>)}
                </div>
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={getOptimizedImg("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", { w: 100, h: 100 })} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="user" />
                    <div><div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Warehouse Admin</div><div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Shift A</div></div>
                </div>
            </div>
            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Topbar */}
                <div style={{ padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#111827' }}>{PAGES.find(p => p.k === page)?.l}</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px #dcfce7' }} />
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Live</span>
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setNotifOpen(!notifOpen)}>
                            <span style={{ fontSize: '1.2rem' }}>🔔</span>
                            <div style={{ position: 'absolute', top: '-3px', right: '-3px', background: '#ef4444', width: '7px', height: '7px', borderRadius: '50%' }} />
                            {notifOpen && <div style={{ position: 'absolute', top: '30px', right: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', width: '280px', zIndex: 100, overflow: 'hidden' }}>
                                {[{ t: 'Zone C capacity at 98%', c: '#ef4444' }, { t: '5 urgent putaway pending', c: '#f59e0b' }, { t: 'Outbound batch #442 completed', c: '#10b981' }].map((n, i) => <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: n.c }} /><div style={{ fontSize: '0.8rem', color: '#111827' }}>{n.t}</div></div>)}
                            </div>}
                        </div>
                    </div>
                </div>
                {/* Dashboard */}
                {page === 'dashboard' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f3f4f6', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                {[{ l: 'Total Pallets', v: '1,284', t: '+12 today', c: '#3b82f6' }, { l: 'Capacity Used', v: '84%', t: 'Zone C full', c: '#f59e0b' }, { l: 'Pending Putaway', v: `${42 + scans.filter(s => s.type === 'in').length}`, t: 'Needs action', c: '#ef4444' }, { l: 'Orders to Pick', v: `${156 - scans.filter(s => s.type === 'out').length}`, t: 'Cutoff 14:00', c: '#10b981' }].map(m => (
                                    <div key={m.l} style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginBottom: '8px' }}>{m.l}</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{m.v}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: m.c }}>{m.t}</div>
                                    </div>
                                ))}
                            </div>
                            {/* Floor Map */}
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827' }}>Live Floor Map</h2>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#6b7280' }}>
                                        {[['#d1fae5', 'Empty'], ['#34d399', 'Optimal'], ['#fbbf24', 'High'], ['#ef4444', 'Full']].map(([c, l]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: c, borderRadius: '2px' }} />{l}</span>)}
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '5px', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                    {rackData.map((r, i) => {
                                        if (r.isAisle) return <div key={i} style={{ height: '28px' }} />
                                        return <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ height: '28px', background: r.color, borderRadius: '4px', border: hovered === i ? '2px solid #111927' : '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', position: 'relative', transition: 'all 0.1s' }}>
                                            {hovered === i && <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', background: '#111827', color: '#fff', padding: '5px 9px', borderRadius: '5px', fontSize: '0.65rem', whiteSpace: 'nowrap', zIndex: 50, marginBottom: '3px' }}><div style={{ fontWeight: 700 }}>{r.name}</div><div>{r.status} • {r.pct}%</div></div>}
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                        {/* Scans */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827' }}>Recent Scans</h2>
                                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px #dcfce7' }} />
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                                {scans.map((s, i) => (
                                    <div key={`${s.sku}-${i}`} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < scans.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'flex-start' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', background: s.type === 'in' ? '#d1fae5' : s.type === 'out' ? '#fee2e2' : s.type === 'move' ? '#fef3c7' : '#e0e7ff', color: s.type === 'in' ? '#059669' : s.type === 'out' ? '#dc2626' : s.type === 'move' ? '#d97706' : '#4f46e5' }}>
                                            {s.type === 'in' ? '↓' : s.type === 'out' ? '↑' : s.type === 'move' ? '⇄' : '✓'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>{s.action} <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#6b7280' }}>{s.sku}</span></div>
                                            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{s.loc} · <span style={{ fontWeight: 700 }}>{s.user}</span></div>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{s.time}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                <button onClick={addScan} style={{ width: '100%', background: '#111827', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>📷 Scan New Item</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Inventory Table */}
                {page === 'inventory' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f3f4f6' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', background: '#f9fafb', fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                                {['SKU', 'Category', 'Item Name', 'Qty', 'Location', 'Last Updated'].map(h => <div key={h}>{h}</div>)}
                            </div>
                            {ITEMS.map((item, i) => (
                                <div key={item.sku} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#10b981', fontSize: '0.8rem' }}>{item.sku}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.cat}</div>
                                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{item.name}</div>
                                    <div><span style={{ background: item.qty < 10 ? '#fee2e2' : '#d1fae5', color: item.qty < 10 ? '#dc2626' : '#059669', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{item.qty}</span></div>
                                    <div style={{ fontSize: '0.8rem', color: '#374151', fontFamily: 'monospace' }}>{item.loc}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.last}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Inbound / Outbound / Reports — simplified interactive pages */}
                {(page === 'inbound' || page === 'outbound' || page === 'reports') && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f3f4f6', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{page === 'inbound' ? '⬇️' : page === 'outbound' ? '⬆️' : '📈'}</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>{page === 'inbound' ? 'Inbound' : 'Outbound'} {page === 'reports' ? 'Reports' : ''}</h2>
                            <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
                                {page === 'inbound' ? `${scans.filter(s => s.type === 'in').length} putaway scans recorded today.` : page === 'outbound' ? `${scans.filter(s => s.type === 'out').length} picks completed today.` : 'Generating report...'}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                {(page === 'reports' ? [['Total Moves', String(scans.length), '#3b82f6'], ['Inbound', String(scans.filter(s => s.type === 'in').length), '#10b981'], ['Outbound', String(scans.filter(s => s.type === 'out').length), '#f59e0b']] :
                                    page === 'inbound' ? [['Pending', String(42 + scans.filter(s => s.type === 'in').length), '#ef4444'], ['Completed', '127', '#10b981'], ['Today Scans', String(scans.filter(s => s.type === 'in').length), '#3b82f6']] :
                                        [['Queued', '23', '#f59e0b'], ['Dispatched', '89', '#10b981'], ['Today Picks', String(scans.filter(s => s.type === 'out').length), '#3b82f6']]
                                ).map(([l, v, c]) => (
                                    <div key={l} style={{ background: '#f9fafb', borderRadius: '10px', padding: '1rem' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c }}>{v}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addScan} style={{ background: '#111827', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>+ Simulate Scan</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
