import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    ComposedChart
} from 'recharts'

/* ================================================================
   RETAIL SALES MONITOR
   ================================================================ */
function RetailSales() {
    const monthlySales = [
        { month: 'Aug', target: 480, actual: 452, margin: 12 },
        { month: 'Sep', target: 500, actual: 534, margin: 14 },
        { month: 'Oct', target: 520, actual: 498, margin: 13.5 },
        { month: 'Nov', target: 580, actual: 621, margin: 15 },
        { month: 'Dec', target: 700, actual: 812, margin: 18.2 },
        { month: 'Jan', target: 540, actual: 575, margin: 14.8 },
        { month: 'Feb', target: 560, actual: 543, margin: 14.1 },
    ]
    const branchData = [
        { name: 'Bandung', sales: 248 }, { name: 'Jakarta', sales: 334 }, { name: 'Surabaya', sales: 189 },
        { name: 'Medan', sales: 142 }, { name: 'Yogyakarta', sales: 175 }, { name: 'Makassar', sales: 98 },
    ].sort((a, b) => b.sales - a.sales)

    const topSKUs = [
        { sku: 'Beras Cap Koki 5kg', sold: 1240, revenue: '93M', trend: '+12%', color: '#059669' },
        { sku: 'Minyak Bimoli 2L', sold: 980, revenue: '45M', trend: '+8%', color: '#0ea5e9' },
        { sku: 'Susu Ultra Full 1L', sold: 867, revenue: '26M', trend: '+5%', color: '#6366f1' },
        { sku: 'Indomie Goreng 40pk', sold: 734, revenue: '18M', trend: '-2%', color: '#ef4444' },
    ]

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif', color: '#e2e8f0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Retail Performance Dashboard</h1>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Power BI Style Report • Last Updated: Feb 21, 2026</div>
                    </div>
                </div>

                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Total Revenue (YTD)', value: 'Rp 4.0B', change: '+14.2% YoY', up: true },
                        { label: 'Gross Margin', value: '14.8%', change: '+1.1% YoY', up: true },
                        { label: 'Avg Basket Size', value: 'Rp 195,400', change: '-2.4% MoM', up: false },
                        { label: 'Store Footfall', value: '284K', change: '+8.3% MoM', up: true },
                    ].map(k => (
                        <div key={k.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</div>
                            <div style={{ fontWeight: 800, fontSize: '1.8rem', color: '#fff', marginBottom: '4px' }}>{k.value}</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: k.up ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className={`fas fa-arrow-${k.up ? 'up' : 'down'}`}></i> {k.change}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Main Chart */}
                    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.25rem' }}>
                        <h3 style={{ fontWeight: 600, color: '#fff', marginBottom: '1.5rem', fontSize: '1rem' }}>Revenue vs Target & Margin</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <ComposedChart data={monthlySales}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#475569' }} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={v => `${v}M`} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Bar yAxisId="left" dataKey="actual" fill="#0ea5e9" name="Actual Rev (M)" radius={[2, 2, 0, 0]} barSize={24} />
                                <Line yAxisId="left" type="step" dataKey="target" stroke="#f43f5e" strokeWidth={2} name="Target (M)" dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={3} name="Margin %" dot={{ fill: '#10b981', r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.25rem' }}>
                        <h3 style={{ fontWeight: 600, color: '#fff', marginBottom: '1rem', fontSize: '1rem' }}>Revenue by Branch (YTD)</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={branchData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" tick={{ fill: '#cbd5e1', fontSize: 12 }} width={80} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }} cursor={{ fill: '#334155' }} />
                                <Bar dataKey="sales" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Custom Visual */}
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.25rem' }}>
                    <h3 style={{ fontWeight: 600, color: '#fff', marginBottom: '1.5rem', fontSize: '1rem' }}>Top 4 SKUs Contribution</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {topSKUs.map(s => (
                            <div key={s.sku} style={{ background: '#0f172a', padding: '1rem', borderRadius: '6px', borderLeft: `4px solid ${s.color}` }}>
                                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.sku}</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Rp {s.revenue}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                                    <span>{s.sold.toLocaleString()} units</span>
                                    <span style={{ color: s.trend.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: 700 }}>{s.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   TOKOPEDIA SELLER ANALYTICS
   ================================================================ */
function EcommerceAnalytics() {
    const weeklyData = [
        { day: 'Mon', sessions: 1240, cvr: 1.2 },
        { day: 'Tue', sessions: 1560, cvr: 1.4 },
        { day: 'Wed', sessions: 980, cvr: 0.9 },
        { day: 'Thu', sessions: 1820, cvr: 1.8 },
        { day: 'Fri', sessions: 2340, cvr: 2.1 },
        { day: 'Sat', sessions: 3100, cvr: 2.8 },
        { day: 'Sun', sessions: 2680, cvr: 2.3 },
    ]
    const funnelData = [{ name: 'Impressions', value: 48400 }, { name: 'Clicks', value: 12200 }, { name: 'Add to Cart', value: 3800 }, { name: 'Checkout', value: 1580 }, { name: 'Purchase', value: 1083 }]
    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '16px', padding: '2rem', color: '#fff', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(16,185,129,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ background: '#fff', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Tokopedia Seller Analytics</h1>
                        </div>
                        <div style={{ opacity: 0.9, fontSize: '0.9rem' }}>Comprehensive view of traffic, funnel, and conversion metrics (Last 7 Days)</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Revenue</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Rp 134.8M</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Area Chart Component */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Sessions & Conversion Rate Trend</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Area yAxisId="left" type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" name="Sessions" />
                                    <Line yAxisId="right" type="monotone" dataKey="cvr" stroke="#f59e0b" strokeWidth={3} name="CVR %" dot={{ r: 4, strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Funnel Display */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', flex: 1 }}>
                            <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', fontSize: '1.1rem' }}>E-Commerce Funnel</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {funnelData.map((f, i) => (
                                    <div key={f.name} style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', position: 'relative', zIndex: 10 }}>
                                            <span style={{ color: '#475569', fontWeight: 600 }}>{f.name}</span>
                                            <span style={{ color: '#0f172a', fontWeight: 800 }}>{f.value.toLocaleString()} <span style={{ color: '#94a3b8', fontWeight: 500, marginLeft: '4px' }}>({((f.value / funnelData[0].value) * 100).toFixed(1)}%)</span></span>
                                        </div>
                                        <div style={{ height: '32px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(f.value / funnelData[0].value) * 100}%`, background: COLORS[i], borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }} />
                                        </div>
                                        {i < funnelData.length - 1 && (
                                            <div style={{ position: 'absolute', right: '10px', bottom: '-22px', fontSize: '0.7rem', color: '#94a3b8', zIndex: 5 }}>
                                                Drop-off: {(((funnelData[i].value - funnelData[i + 1].value) / funnelData[i].value) * 100).toFixed(1)}%
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   CLINIC PATIENT FLOW ANALYSIS
   ================================================================ */
function ClinicAnalytics() {
    const hourlyPatients = [
        { hour: '08:00', value: 12 }, { hour: '09:00', value: 28 }, { hour: '10:00', value: 35 },
        { hour: '11:00', value: 42 }, { hour: '12:00', value: 18 }, { hour: '13:00', value: 31 },
        { hour: '14:00', value: 38 }, { hour: '15:00', value: 29 }, { hour: '16:00', value: 15 },
    ]
    const deptDistrib = [
        { name: 'Umum', value: 42 }, { name: 'Poli Anak', value: 23 }, { name: 'Gigi', value: 18 },
        { name: 'Kandungan', value: 12 }, { name: 'THT', value: 5 },
    ]
    const COLORS = ['#0ea5e9', '#6366f1', '#14b8a6', '#f43f5e', '#f59e0b']

    return (
        <div style={{ background: '#f0f9ff', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: '#0ea5e9', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(14,165,233,0.3)' }}><i className="fas fa-hospital"></i></div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Clinic Analytics Dashboard</h1>
                        <div style={{ color: '#0284c7', fontSize: '0.85rem', fontWeight: 500 }}>Live Operations View • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Grid Heatmap for Doctor Utilization */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #bae6fd', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(14,165,233,0.05)' }}>
                            <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Doctor Utilization Heatmap</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                {[
                                    { dr: 'Dr. Sarah M.', pct: 92, val: '18/20 pts' },
                                    { dr: 'Dr. John D.', pct: 85, val: '17/20 pts' },
                                    { dr: 'Dr. Emily W.', pct: 60, val: '12/20 pts' },
                                    { dr: 'Dr. Robert C.', pct: 100, val: '22/20 pts' },
                                    { dr: 'Dr. Lisa K.', pct: 45, val: '9/20 pts' },
                                    { dr: 'Dr. Michael B.', pct: 75, val: '15/20 pts' },
                                    { dr: 'Dr. Alan T.', pct: 95, val: '19/20 pts' },
                                    { dr: 'Dr. Sandra P.', pct: 80, val: '16/20 pts' },
                                ].map(d => {
                                    let bg = '#e0f2fe', color = '#0284c7'
                                    if (d.pct >= 90) { bg = '#fee2e2'; color = '#ef4444' } // High
                                    else if (d.pct < 50) { bg = '#fef3c7'; color = '#d97706' } // Low

                                    return (
                                        <div key={d.dr} style={{ background: bg, borderRadius: '10px', padding: '1rem', border: `1px solid rgba(0,0,0,0.05)` }}>
                                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', marginBottom: '8px' }}>{d.dr}</div>
                                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: color, marginBottom: '2px' }}>{d.pct}%</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{d.val}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #bae6fd', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(14,165,233,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1.1rem' }}>Hourly Patient Footfall</h3>
                                <div style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }}></div> Live</div>
                            </div>
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={hourlyPatients}>
                                    <defs>
                                        <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #bae6fd' }} />
                                    <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorPts)" name="Patients" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Donut Chart */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #bae6fd', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(14,165,233,0.05)', flex: 1 }}>
                            <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '1rem', fontSize: '1.1rem' }}>Patients by Department</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={deptDistrib} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {deptDistrib.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #bae6fd' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {deptDistrib.map((d, i) => (
                                    <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[i] }} />
                                            <span style={{ color: '#475569', fontWeight: 500 }}>{d.name}</span>
                                        </div>
                                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   CROP YIELD TREND REPORT
   ================================================================ */
function CropYield() {
    const yieldTrend = [
        { season: 'MT I 23', padi: 5.8, jagung: 7.2, kedelai: 2.1 },
        { season: 'MT II 23', padi: 6.1, jagung: 6.8, kedelai: 2.4 },
        { season: 'MT I 24', padi: 5.4, jagung: 7.5, kedelai: 2.0 },
        { season: 'MT II 24', padi: 6.4, jagung: 8.1, kedelai: 2.6 },
        { season: 'MT I 25', padi: 6.8, jagung: 8.4, kedelai: 2.9 },
        { season: 'MT II 25', padi: 7.1, jagung: 8.9, kedelai: 3.1 },
    ]
    const regionData = [
        { region: 'Jawa Tengah', pct: 95 }, { region: 'Jawa Timur', pct: 88 }, { region: 'Jawa Barat', pct: 105 },
        { region: 'Sumatera Selatan', pct: 70 }, { region: 'Lampung', pct: 82 }, { region: 'Sulawesi Selatan', pct: 90 },
    ]

    return (
        <div style={{ background: '#fefce8', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#422006', margin: '0 0 10px' }}>Indonesian Crop Yield Analysis</h1>
                    <div style={{ color: '#854d0e', fontSize: '1rem', fontWeight: 500 }}>Harvest seasons MT 2023 - 2025 (Average Ton/Ha)</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { crop: 'Padi (Rice)', val: '6.8', prev: '5.8', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', color: '#16a34a', bg: '#dcfce7' },
                        { crop: 'Jagung (Corn)', val: '8.4', prev: '7.2', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: '#d97706', bg: '#fef3c7' },
                        { crop: 'Kedelai (Soy)', val: '2.9', prev: '2.1', icon: 'M4 4h16v16H4V4z', color: '#65a30d', bg: '#ecfccb' },
                    ].map(c => (
                        <div key={c.crop} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #fef08a', boxShadow: '0 4px 10px rgba(161,98,7,0.05)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: c.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, opacity: 0.5 }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon}></path></svg>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#713f12', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>{c.crop}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#422006' }}>{c.val}</span>
                                <span style={{ fontSize: '0.9rem', color: '#854d0e', fontWeight: 600 }}>t/ha</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="fas fa-arrow-up"></i> {(((c.val - c.prev) / c.prev) * 100).toFixed(1)}% vs MT I '23
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #fef08a', padding: '1.5rem', boxShadow: '0 4px 10px rgba(161,98,7,0.05)' }}>
                        <h3 style={{ fontWeight: 700, color: '#422006', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Historical Yield Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={yieldTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#fef08a" vertical={false} />
                                <XAxis dataKey="season" tick={{ fontSize: 11, fill: '#854d0e' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#854d0e' }} tickFormatter={v => `${v}t`} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #fef08a', background: '#fff' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="padi" stroke="#16a34a" strokeWidth={4} name="Padi" dot={{ r: 5, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="jagung" stroke="#d97706" strokeWidth={4} name="Jagung" dot={{ r: 5, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="kedelai" stroke="#65a30d" strokeWidth={4} name="Kedelai" dot={{ r: 5, fill: '#65a30d', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #fef08a', padding: '1.5rem', boxShadow: '0 4px 10px rgba(161,98,7,0.05)' }}>
                        <h3 style={{ fontWeight: 700, color: '#422006', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Padi Attainment vs Target (%)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {regionData.map(r => (
                                <div key={r.region}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                                        <span style={{ color: '#713f12', fontWeight: 600 }}>{r.region}</span>
                                        <span style={{ color: r.pct >= 100 ? '#16a34a' : r.pct < 80 ? '#ef4444' : '#d97706', fontWeight: 800 }}>{r.pct}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#fef08a', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(r.pct, 100)}%`, background: r.pct >= 100 ? '#16a34a' : r.pct < 80 ? '#ef4444' : '#d97706', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            ))}
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
    'retail-sales': { title: 'Retail Sales Monitor', subtitle: 'Interactive Mockup Integration — Power BI style', accentColor: '#0ea5e9', component: <RetailSales /> },
    'ecommerce-analytics': { title: 'Tokopedia Seller Analytics', subtitle: 'Interactive Mockup Integration — E-commerce Funnel', accentColor: '#10b981', component: <EcommerceAnalytics /> },
    'clinic-analytics': { title: 'Clinic Patient Flow Analysis', subtitle: 'Interactive Mockup Integration — Heatmaps', accentColor: '#0ea5e9', component: <ClinicAnalytics /> },
    'crop-yield': { title: 'Crop Yield Trend Report', subtitle: 'Interactive Mockup Integration — Line charts and progress', accentColor: '#d97706', component: <CropYield /> },
}

export default function DataAnalystShowcase() {
    const { projectId } = useParams()
    const project = projects[projectId]

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="C" accentColor="#059669">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                <h2>Project not found</h2>
            </div>
        </ShowcaseLayout>
    )

    return (
        <ShowcaseLayout title={project.title} subtitle={project.subtitle} service="Data Analyst" accentColor={project.accentColor} githubUrl="https://github.com/Nurdiansyah0">
            {project.component}
        </ShowcaseLayout>
    )
}
