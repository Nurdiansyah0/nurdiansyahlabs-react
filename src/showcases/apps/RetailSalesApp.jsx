import { useState, useRef, useEffect } from 'react'
import { TrendingUp, ShoppingBag, CreditCard, Target, MapPin, DollarSign, Package, ChevronDown, Calendar } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'

const MONTHLY = {
    '2024 Q4': [
        { name: 'Okt', revenue: 48.5, profit: 27.5, cost: 21.0 },
        { name: 'Nov', revenue: 62.0, profit: 38.0, cost: 24.0 },
        { name: 'Des', revenue: 84.0, profit: 56.0, cost: 28.0 }
    ],
    '2025 Q1': [
        { name: 'Jan', revenue: 51.0, profit: 29.0, cost: 22.0 },
        { name: 'Feb', revenue: 58.0, profit: 34.5, cost: 23.5 },
        { name: 'Mar', revenue: 67.0, profit: 42.0, cost: 25.0 }
    ]
}

const BRANCHES = {
    'Semua': { rev: 'Rp 74.2', revFull: 'Rp 74.200.000', growth: '+18.5%', isUp: true, orders: 3241, avg: 'Rp 22.9rb', target: 92 },
    'Jakarta': { rev: 'Rp 28.5', revFull: 'Rp 28.500.000', growth: '+22.1%', isUp: true, orders: 1240, avg: 'Rp 23.0rb', target: 105 },
    'Bandung': { rev: 'Rp 19.1', revFull: 'Rp 19.100.000', growth: '+12.4%', isUp: true, orders: 890, avg: 'Rp 21.5rb', target: 85 },
    'Surabaya': { rev: 'Rp 15.4', revFull: 'Rp 15.400.000', growth: '+21.0%', isUp: true, orders: 658, avg: 'Rp 23.4rb', target: 95 },
    'Bali': { rev: 'Rp 11.2', revFull: 'Rp 11.200.000', growth: '-4.2%', isUp: false, orders: 453, avg: 'Rp 24.7rb', target: 78 },
}

const TOP_PRODUCTS = [
    { id: 1, name: 'Batik Premium Pria', sales: 523, rev: 'Rp 23.5Jt', cat: 'Kemeja', trend: '+12%' },
    { id: 2, name: 'Dress Batik Wanita', sales: 412, rev: 'Rp 22.6Jt', cat: 'Dress', trend: '+8%' },
    { id: 3, name: 'Kain Batik Tulis', sales: 87, rev: 'Rp 10.4Jt', cat: 'Kain', trend: '-2%' },
    { id: 4, name: 'Set Couple Batik', sales: 198, rev: 'Rp 9.4Jt', cat: 'Set', trend: '+15%' },
    { id: 5, name: 'Sarung Batik Eksklusif', sales: 310, rev: 'Rp 4.9Jt', cat: 'Sarung', trend: '+5%' },
]

function CustomDropdown({ value, options, onChange, icon: Icon, label }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full md:w-auto" ref={ref}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-blue-400" />}
                    <span className="text-slate-400 hidden sm:inline">{label}:</span>
                    <span className="font-bold tracking-wide">{value}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 right-0 md:right-auto mt-2 w-full md:min-w-[180px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-200 py-2 z-50">
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                value === opt ? 'bg-blue-50/80 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-slate-600 font-medium hover:bg-slate-50 border-l-2 border-transparent hover:text-slate-900'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function RetailSalesApp() {
    const [period, setPeriod] = useState('2025 Q1')
    const [branch, setBranch] = useState('Semua')
    const [tab, setTab] = useState('overview')
    const data = MONTHLY[period]
    const binfo = BRANCHES[branch]

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10">
            {/* Header */}
            <div className="bg-slate-900 px-4 md:px-8 py-6 text-white shadow-lg">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="text-xs font-bold tracking-widest text-blue-400 mb-1 uppercase">Executive Dashboard</div>
                        <h1 className="text-2xl md:text-3xl font-black text-white m-0">Retail Sales Analytics</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                        <CustomDropdown 
                            label="Periode" 
                            icon={Calendar} 
                            value={period} 
                            options={Object.keys(MONTHLY)} 
                            onChange={setPeriod} 
                        />
                        <CustomDropdown 
                            label="Cabang" 
                            icon={MapPin} 
                            value={branch} 
                            options={Object.keys(BRANCHES)} 
                            onChange={setBranch} 
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {[
                        { label: 'Total Revenue', value: binfo.revFull, icon: DollarSign, trend: binfo.growth, isUp: binfo.isUp, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'Total Pesanan', value: binfo.orders.toLocaleString(), icon: ShoppingBag, trend: '+15.2%', isUp: true, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                        { label: 'Avg. Transaksi', value: binfo.avg, icon: CreditCard, trend: '+3.1%', isUp: true, color: 'text-amber-600', bg: 'bg-amber-100' },
                        { label: 'Target KPI', value: `${binfo.target}%`, icon: Target, trend: binfo.target >= 100 ? 'Achieved' : 'Behind', isUp: binfo.target >= 100, color: 'text-purple-600', bg: 'bg-purple-100' },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                                    <kpi.icon className="w-6 h-6" />
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${kpi.isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    <TrendingUp className={`w-3 h-3 ${!kpi.isUp && 'rotate-180'}`} />
                                    {kpi.trend}
                                </span>
                            </div>
                            <div className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">{kpi.value}</div>
                            <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {[
                        { id: 'overview', label: 'Financial Overview', icon: TrendingUp },
                        { id: 'products', label: 'Top Products', icon: Package },
                        { id: 'branches', label: 'Branch Performance', icon: MapPin }
                    ].map(t => (
                        <button aria-label="Action button" 
                            key={t.id} 
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                                tab === t.id ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {tab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Revenue vs Profit ({period}) - Juta Rupiah</h2>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                                            formatter={(value) => [`Rp ${value} Jt`, undefined]}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
                                        <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                        <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm flex flex-col">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Financial Summary</h2>
                            <div className="flex-1 flex flex-col justify-center gap-6">
                                {data.map((d, i) => (
                                    <div key={d.name}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="font-bold text-slate-700">{d.name}</span>
                                            <div className="text-right">
                                                <div className="font-black text-blue-600">Rp {d.revenue.toFixed(1)} Jt</div>
                                                <div className="text-xs font-semibold text-emerald-600">Profit: Rp {d.profit.toFixed(1)} Jt</div>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${(d.profit / d.revenue) * 100}%` }}></div>
                                            <div className="h-full bg-blue-500 rounded-r-full" style={{ width: `${((d.revenue - d.profit) / d.revenue) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'products' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900">Top Performing Products</h2>
                            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Ranked by Revenue</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Rank</th>
                                        <th className="px-6 py-4 font-semibold">Product Name</th>
                                        <th className="px-6 py-4 font-semibold">Category</th>
                                        <th className="px-6 py-4 font-semibold">Units Sold</th>
                                        <th className="px-6 py-4 font-semibold">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {TOP_PRODUCTS.map((p, i) => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                                    i === 0 ? 'bg-amber-100 text-amber-600' : 
                                                    i === 1 ? 'bg-slate-200 text-slate-600' : 
                                                    i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    #{p.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">{p.cat}</span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-600">{p.sales} <span className="text-xs font-medium text-slate-400">units</span></td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-blue-600">{p.rev}</div>
                                                <div className={`text-xs font-semibold ${p.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{p.trend} vs last period</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 'branches' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                        {Object.entries(BRANCHES).filter(([k]) => k !== 'Semua').map(([name, info], i) => (
                            <div key={name} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MapPin className="w-24 h-24" />
                                </div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                                        <div className="text-xs font-semibold text-slate-500">Branch Office</div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${info.isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {info.growth}
                                    </span>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-3xl font-black text-slate-900 mb-4">{info.rev} <span className="text-sm font-semibold text-slate-500">Jt</span></div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Orders</span>
                                            <span className="font-semibold text-slate-700">{info.orders}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Avg. Value</span>
                                            <span className="font-semibold text-slate-700">{info.avg}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">KPI Target</span>
                                            <span className={`font-semibold ${info.target >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{info.target}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
