import React, { useState, useEffect, useMemo } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import { getOptimizedImg } from '../../utils/imgHelper'
import { 
    LayoutDashboard, Box, ArrowDownToLine, ArrowUpFromLine, 
    FileText, Bell, Search, Settings, Activity, Filter,
    MoreVertical, CheckCircle2, AlertCircle, ArrowRightLeft,
    ChevronDown, Map, PackageSearch, BarChart3, TrendingUp, 
    Users, Menu, X, Plus, ScanLine, ArrowUpRight, ArrowDownRight,
    MapPin, Thermometer
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'

// --- Mock Data Generators ---
const buildRackData = () => Array.from({ length: 144 }).map((_, i) => {
    const col = i % 12;
    const row = Math.floor(i / 12);
    // Aisles every 4 columns and 4 rows
    const isAisle = col % 4 === 3 || row % 4 === 3;
    
    if (isAisle) return { isAisle: true };
    
    let bg = 'bg-emerald-100 border-emerald-200', dot = 'bg-emerald-500', s = 'Optimal', p = 40 + Math.floor(Math.random() * 30);
    const rand = Math.random();
    if (rand < 0.15) { bg = 'bg-rose-100 border-rose-200'; dot = 'bg-rose-500'; s = 'Full'; p = 95 + Math.floor(Math.random() * 5); }
    else if (rand < 0.3) { bg = 'bg-amber-100 border-amber-200'; dot = 'bg-amber-500'; s = 'High'; p = 75 + Math.floor(Math.random() * 20); }
    else if (rand < 0.45) { bg = 'bg-slate-50 border-slate-200'; dot = 'bg-slate-300'; s = 'Empty'; p = 0; }
    
    return { 
        isAisle: false, bg, dot, status: s, pct: p, 
        name: `R-${String.fromCharCode(65 + Math.floor(row / 4))}${(col % 4) + 1}`,
        temp: 18 + Math.floor(Math.random() * 6) + '°C',
        skus: Math.floor(Math.random() * 5)
    };
})

const initScans = [
    { id: 'TRX-8911', action: 'Putaway', sku: 'SKU-8921-A', loc: 'Z-C • R-12', time: 'Just now', type: 'in', user: 'JD', status: 'Completed' },
    { id: 'TRX-8910', action: 'Pick', sku: 'SKU-4412-B', loc: 'Z-A • R-02', time: '2 min ago', type: 'out', user: 'SM', status: 'Completed' },
    { id: 'TRX-8909', action: 'Relocate', sku: 'SKU-1199-X', loc: 'Z-B → Z-D', time: '12 min ago', type: 'move', user: 'AJ', status: 'In Progress' },
    { id: 'TRX-8908', action: 'Audit Check', sku: 'SKU-2231-A', loc: 'Z-C • R-08', time: '32 min ago', type: 'check', user: 'RW', status: 'Pending' },
    { id: 'TRX-8907', action: 'Putaway', sku: 'SKU-6652-Y', loc: 'Z-F • R-44', time: '45 min ago', type: 'in', user: 'NR', status: 'Completed' },
]

const rnd = () => {
    const actions = [
        { action: 'Putaway', type: 'in' }, { action: 'Pick', type: 'out' }, 
        { action: 'Relocate', type: 'move' }, { action: 'Audit', type: 'check' }
    ]
    const users = ['JD', 'SM', 'AJ', 'RW', 'NR', 'MK']
    const statuses = ['Completed', 'Completed', 'In Progress', 'Pending']
    const r = actions[Math.floor(Math.random() * actions.length)]
    
    return { 
        ...r, 
        id: `TRX-${Math.floor(8000 + Math.random() * 1999)}`,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}-${['A', 'B', 'C', 'X', 'Y'][Math.floor(Math.random() * 5)]}`, 
        loc: `Z-${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]} • R-${String(Math.floor(1 + Math.random() * 50)).padStart(2, '0')}`, 
        time: 'Just now', 
        user: users[Math.floor(Math.random() * users.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
    }
}

const ITEMS = [
    { sku: 'SKU-8921-A', name: 'Steel Pipe 6m - Galvanized', qty: 48, min: 20, loc: 'Z-C • R-12', cat: 'Raw Material', status: 'Optimal' },
    { sku: 'SKU-4412-B', name: 'Polyurethane Paint 20L', qty: 15, min: 25, loc: 'Z-A • R-02', cat: 'Chemicals', status: 'Low Stock' },
    { sku: 'SKU-1199-X', name: 'Hex Bolt Set M10x50', qty: 500, min: 200, loc: 'Z-D • R-08', cat: 'Hardware', status: 'Optimal' },
    { sku: 'SKU-6652-Y', name: 'Gate Valve 2 inch Brass', qty: 30, min: 30, loc: 'Z-F • R-44', cat: 'Parts', status: 'Warning' },
    { sku: 'SKU-2231-A', name: 'Copper Wire 100m Roll', qty: 8, min: 10, loc: 'Z-C • R-08', cat: 'Electrical', status: 'Low Stock' },
    { sku: 'SKU-7719-B', name: 'Industrial Safety Helmet', qty: 125, min: 50, loc: 'Z-B • R-33', cat: 'Safety', status: 'Optimal' },
    { sku: 'SKU-3321-C', name: 'Hydraulic Pump Assembly', qty: 4, min: 2, loc: 'Z-E • R-15', cat: 'Machinery', status: 'Optimal' },
    { sku: 'SKU-9982-X', name: 'Lithium Battery Pack 24V', qty: 0, min: 10, loc: 'Z-A • R-11', cat: 'Electrical', status: 'Out of Stock' },
]

const volumeData = [
    { time: '08:00', in: 120, out: 80 },
    { time: '10:00', in: 210, out: 150 },
    { time: '12:00', in: 180, out: 200 },
    { time: '14:00', in: 250, out: 310 },
    { time: '16:00', in: 170, out: 190 },
    { time: '18:00', in: 90, out: 110 },
]

// --- Components ---

const StatCard = ({ title, value, trend, trendUp, icon: Icon, colorClass }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend}
            </div>
        </div>
        <div>
            <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
    </div>
)

export default function WarehouseApp() {
    const { isMobile } = useResponsive()
    const [page, setPage] = useState('dashboard')
    const [scans, setScans] = useState(initScans)
    const [hoveredRack, setHoveredRack] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
    
    const rackData = useMemo(() => buildRackData(), [])
    
    useEffect(() => { 
        const t = setInterval(() => setScans(p => [rnd(), ...p.slice(0, 14)]), 5000); 
        return () => clearInterval(t) 
    }, [])
    
    const addScan = () => setScans(p => [rnd(), ...p.slice(0, 14)])

    const navGroups = [
        {
            title: 'MAIN',
            items: [
                { k: 'dashboard', i: LayoutDashboard, l: 'Dashboard' },
                { k: 'map', i: Map, l: 'Live Map' },
            ]
        },
        {
            title: 'OPERATIONS',
            items: [
                { k: 'inventory', i: Box, l: 'Inventory Matrix' },
                { k: 'inbound', i: ArrowDownToLine, l: 'Inbound Flow' },
                { k: 'outbound', i: ArrowUpFromLine, l: 'Outbound Flow' },
            ]
        },
        {
            title: 'ANALYTICS',
            items: [
                { k: 'reports', i: BarChart3, l: 'Reporting' },
                { k: 'activity', i: Activity, l: 'Audit Logs' },
            ]
        }
    ]

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
            
            {/* Sidebar Overlay (Mobile) */}
            {isMobile && sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: sidebarOpen ? '260px' : '0px', opacity: sidebarOpen ? 1 : 0 }}
                className={`fixed md:relative z-50 h-full bg-[#0f172a] text-slate-300 flex flex-col flex-shrink-0 shadow-xl overflow-hidden`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800/60 shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-900/50">
                        <Box className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">OmniWMS</span>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
                    {navGroups.map((group, idx) => (
                        <div key={idx}>
                            <h4 className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{group.title}</h4>
                            <div className="space-y-1">
                                {group.items.map(item => {
                                    const active = page === item.k;
                                    return (
                                        <button 
                                            key={item.k}
                                            onClick={() => { setPage(item.k); if(isMobile) setSidebarOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                active ? 'bg-blue-600/15 text-blue-400' : 'hover:bg-slate-800/50 hover:text-white'
                                            }`}
                                        >
                                            <item.i className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                                            {item.l}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800/60 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <img 
                            src={getOptimizedImg("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", { w: 100, h: 100 })} 
                            className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover" 
                            alt="Admin" 
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">David Chen</p>
                            <p className="text-xs text-slate-500 truncate">Ops Manager • Shift A</p>
                        </div>
                        <Settings className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        
                        {/* Global Search */}
                        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search SKU, Location, ID..." 
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700"
                            />
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                                <span>⌘</span><span>K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm" onClick={addScan}>
                            <ScanLine className="w-4 h-4" />
                            <span>Scan Item</span>
                        </button>
                        
                        <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>
                        
                        <button className="p-2 relative text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors md:hidden">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full max-w-7xl mx-auto space-y-6"
                        >
                            
                            {/* Dashboard Page */}
                            {page === 'dashboard' && (
                                <>
                                    {/* Page Title */}
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Overview</h1>
                                            <p className="text-sm text-slate-500 mt-1">Real-time metrics for Main Facility • Los Angeles</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                Live Sync
                                            </span>
                                            <button className="flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50">
                                                Today <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <StatCard title="Total Volume Received" value="1,284" trend="12.5%" trendUp={true} icon={ArrowDownToLine} colorClass="bg-blue-500" />
                                        <StatCard title="Total Volume Shipped" value="892" trend="4.2%" trendUp={true} icon={ArrowUpFromLine} colorClass="bg-emerald-500" />
                                        <StatCard title="Storage Utilization" value="84.2%" trend="1.1%" trendUp={false} icon={Box} colorClass="bg-amber-500" />
                                        <StatCard title="Pending Tasks" value={42 + scans.filter(s => s.type === 'in' || s.type === 'move').length} trend="High Priority" trendUp={false} icon={AlertCircle} colorClass="bg-rose-500" />
                                    </div>

                                    {/* Main Charts & Activity Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        
                                        {/* Chart Section */}
                                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-base font-semibold text-slate-900">Throughput Volume</h2>
                                                    <p className="text-xs text-slate-500 mt-0.5">Inbound vs Outbound (Items per Hour)</p>
                                                </div>
                                                <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                                            </div>
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                        <defs>
                                                            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                            </linearGradient>
                                                            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                                        <RechartsTooltip 
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                            itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                                                            labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                                                        />
                                                        <Area type="monotone" dataKey="in" name="Inbound" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                                                        <Area type="monotone" dataKey="out" name="Outbound" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Recent Activity Log */}
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[350px]">
                                            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                                                <h2 className="text-base font-semibold text-slate-900">Live Activity Feed</h2>
                                                <button className="text-blue-600 text-xs font-medium hover:underline">View All</button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                                                {scans.map((scan, i) => (
                                                    <div key={scan.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer">
                                                        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                                                            scan.type === 'in' ? 'bg-blue-100 text-blue-600' :
                                                            scan.type === 'out' ? 'bg-emerald-100 text-emerald-600' :
                                                            scan.type === 'move' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
                                                        }`}>
                                                            {scan.type === 'in' ? <ArrowDownToLine className="w-4 h-4" /> :
                                                             scan.type === 'out' ? <ArrowUpFromLine className="w-4 h-4" /> :
                                                             scan.type === 'move' ? <ArrowRightLeft className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                                    {scan.action} <span className="text-slate-500 font-normal">#{scan.id.split('-')[1]}</span>
                                                                </p>
                                                                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{scan.time}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 truncate mb-1">
                                                                <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded mr-1">{scan.sku}</span>
                                                                to {scan.loc}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                                                    <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-600">{scan.user}</div>
                                                                    Operated by {scan.user}
                                                                </div>
                                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                                                    scan.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                                    scan.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                    {scan.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Mini Map Preview */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-base font-semibold text-slate-900">Facility Heatmap</h2>
                                                <p className="text-xs text-slate-500 mt-0.5">Real-time rack occupancy status</p>
                                            </div>
                                            <div className="flex gap-3 text-xs font-medium text-slate-600">
                                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300"></span>Empty</span>
                                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Optimal</span>
                                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>High</span>
                                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Full</span>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full overflow-x-auto pb-2">
                                            <div className="min-w-[800px] grid grid-cols-[repeat(12,minmax(0,1fr))] gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
                                                {rackData.map((r, i) => {
                                                    if (r.isAisle) return <div key={i} className="h-10 bg-transparent flex items-center justify-center"><span className="text-[10px] text-slate-300 transform -rotate-90">AISLE</span></div>
                                                    
                                                    return (
                                                        <div 
                                                            key={i} 
                                                            onMouseEnter={() => setHoveredRack(i)} 
                                                            onMouseLeave={() => setHoveredRack(null)}
                                                            className={`h-10 rounded-md border shadow-sm transition-all duration-200 cursor-pointer relative overflow-hidden group ${r.bg} ${hoveredRack === i ? 'ring-2 ring-slate-400 ring-offset-1 scale-105 z-10' : ''}`}
                                                        >
                                                            {/* Fill Bar Indicator */}
                                                            <div className={`absolute bottom-0 left-0 right-0 opacity-20 ${r.dot}`} style={{ height: `${r.pct}%` }}></div>
                                                            
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className={`w-2 h-2 rounded-full shadow-sm ${r.dot}`}></div>
                                                            </div>
                                                            
                                                            {/* Enhanced Tooltip */}
                                                            {hoveredRack === i && (
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-slate-900 text-white rounded-lg shadow-xl text-xs z-50 p-3 pointer-events-none border border-slate-700">
                                                                    <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                                                                        <span className="font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400"/> {r.name}</span>
                                                                        <span className={`px-1.5 py-0.5 rounded font-semibold text-[10px] ${r.status === 'Full' ? 'bg-rose-500/20 text-rose-300' : r.status === 'High' ? 'bg-amber-500/20 text-amber-300' : r.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                                                                            {r.status}
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-1.5 text-[11px] text-slate-300">
                                                                        <div className="flex justify-between"><span>Capacity:</span> <span className="font-mono text-white">{r.pct}%</span></div>
                                                                        <div className="flex justify-between"><span>Active SKUs:</span> <span className="font-mono text-white">{r.skus}</span></div>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="flex items-center gap-1"><Thermometer className="w-3 h-3"/> Temp:</span> 
                                                                            <span className="font-mono text-white">{r.temp}</span>
                                                                        </div>
                                                                    </div>
                                                                    {/* Tooltip arrow */}
                                                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Inventory Page */}
                            {page === 'inventory' && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-120px)]">
                                    <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-xl font-bold text-slate-900">Inventory Matrix</h1>
                                            <p className="text-sm text-slate-500 mt-0.5">Manage and track all physical assets</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input type="text" placeholder="Search inventory..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64" />
                                            </div>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                                                <Filter className="w-4 h-4" /> Filters
                                            </button>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                                                <Plus className="w-4 h-4" /> Add Item
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
                                                <tr>
                                                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider w-10">
                                                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                    </th>
                                                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">SKU & Item Name</th>
                                                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Category</th>
                                                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">Qty / Min</th>
                                                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Location</th>
                                                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                                                    <th className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase tracking-wider w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                {ITEMS.map((item) => (
                                                    <tr key={item.sku} className="hover:bg-slate-50/80 transition-colors group">
                                                        <td className="py-3 px-4">
                                                            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mr-3 shrink-0">
                                                                    <PackageSearch className="w-5 h-5 text-slate-400" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                                                                    <div className="font-mono text-xs text-slate-500 mt-0.5">{item.sku}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                                                {item.cat}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex flex-col items-end">
                                                                <span className={`font-bold text-sm ${item.qty === 0 ? 'text-rose-600' : item.qty <= item.min ? 'text-amber-600' : 'text-slate-900'}`}>
                                                                    {item.qty} <span className="text-xs font-normal text-slate-400">pcs</span>
                                                                </span>
                                                                <span className="text-xs text-slate-400 mt-0.5">Min: {item.min}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-mono">
                                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                                {item.loc}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                                item.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' :
                                                                item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                                                                item.status === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                                                            }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                                    item.status === 'Optimal' ? 'bg-emerald-500' :
                                                                    item.status === 'Low Stock' ? 'bg-amber-500' :
                                                                    item.status === 'Out of Stock' ? 'bg-rose-500' : 'bg-slate-500'
                                                                }`}></span>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* Pagination Footer */}
                                    <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white shrink-0">
                                        <p className="text-xs text-slate-500">Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{ITEMS.length}</span> of <span className="font-medium text-slate-900">4,281</span> results</p>
                                        <div className="flex gap-1">
                                            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">1</button>
                                            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">2</button>
                                            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">3</button>
                                            <button className="px-3 py-1 border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">Next</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Generic Placeholder for other pages */}
                            {(page !== 'dashboard' && page !== 'inventory') && (
                                <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-2xl text-center p-8">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 capitalize">{page} Module</h2>
                                    <p className="text-slate-500 mt-2 max-w-sm">This module is part of the Enterprise WMS suite. Data connection is currently established and pending synchronization.</p>
                                    <button onClick={() => setPage('dashboard')} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
