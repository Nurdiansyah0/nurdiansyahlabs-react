import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { 
    Cpu, Database, ShieldCheck, Activity, Terminal, 
    Layers, Zap, CheckCircle2, Server, ArrowUpRight 
} from 'lucide-react'
import { useResponsive } from '../hooks/useResponsive'
import { useLanguage } from '../i18n/LanguageContext'

const ARCHITECTURE_TIERS = [
    {
        id: 'frontend',
        name: 'Client & PWA Layer',
        nameId: 'Layer Klien & PWA',
        tech: 'React 18 · Vite 6 · Tailwind CSS',
        metrics: 'Sub-second FCP · 18 Static Routes',
        status: 'Optimal',
        icon: Layers,
        color: '#6366f1',
        bgGlow: 'rgba(99, 102, 241, 0.12)'
    },
    {
        id: 'gateway',
        name: 'API Gateway & Core Engine',
        nameId: 'API Gateway & Service Engine',
        tech: 'Python Flask · JWT Auth · Pytest',
        metrics: '< 120ms Latency · Contract Verified',
        status: 'Active',
        icon: Server,
        color: '#06b6d4',
        bgGlow: 'rgba(6, 182, 212, 0.12)'
    },
    {
        id: 'database',
        name: 'Persistence & State',
        nameId: 'Penyimpanan Data & Status',
        tech: 'PostgreSQL · SQLite · Redis Ready',
        metrics: 'ACID Compliant · Automated Backups',
        status: 'Synced',
        icon: Database,
        color: '#10b981',
        bgGlow: 'rgba(16, 185, 129, 0.12)'
    },
    {
        id: 'intelligence',
        name: 'AI & Data Intelligence',
        nameId: 'Pipeline AI & Intelijen Data',
        tech: 'Scikit-learn · Smart Vision · Analytics',
        metrics: 'Real-time Inference · Telemetry Logs',
        status: 'Ready',
        icon: Cpu,
        color: '#a855f7',
        bgGlow: 'rgba(168, 85, 247, 0.12)'
    }
]

const PLATFORM_METRICS = [
    { label: 'Uptime SLA', value: '99.9%', detail: 'High-availability architecture' },
    { label: 'API Response', value: '< 120ms', detail: 'Sub-second edge routing' },
    { label: 'Test Coverage', value: '100%', detail: 'Pytest contract verification' },
    { label: 'Static Routes', value: '18 Pages', detail: 'Automated SEO prerender' },
]

const ENDPOINT_CONTRACTS = [
    { method: 'POST', path: '/api/v1/leads', desc: 'Secure lead ingestion & email trigger', status: '201 Created' },
    { method: 'GET',  path: '/api/v1/health', desc: 'Service health & dependency check', status: '200 OK' },
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Role-based JWT session authentication', status: '200 OK' },
    { method: 'GET',  path: '/api/v1/analytics', desc: 'Real-time operational telemetry sync', status: '200 OK' },
]

export default function TechStack3D() {
    const { isMobile, isSm } = useResponsive()
    const { lang } = useLanguage()
    const isIndo = lang === 'id'
    const [activeTab, setActiveTab] = useState('arch')

    return (
        <div 
            className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden text-left"
            style={{
                background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(11, 15, 23, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.7), 0 0 30px -10px rgba(99, 102, 241, 0.25)',
                backdropFilter: 'blur(16px)',
            }}
        >
            {/* Window Title Bar */}
            <div 
                className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/60"
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Terminal size={12} className="text-indigo-400" />
                        nurdiansyahlabs-core
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wide uppercase">
                        99.9% Uptime
                    </span>
                </div>
            </div>

            {/* Subheader / Mode Switcher */}
            <div className="flex items-center justify-between p-3 border-b border-slate-800/50 bg-slate-900/40 text-xs">
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('arch')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs min-h-[36px] flex items-center gap-1.5 ${
                            activeTab === 'arch' 
                                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <Layers size={13} />
                        {isIndo ? 'Arsitektur' : 'Architecture'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('metrics')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs min-h-[36px] flex items-center gap-1.5 ${
                            activeTab === 'metrics' 
                                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <Activity size={13} />
                        {isIndo ? 'Telemetri' : 'Telemetry'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('contracts')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs min-h-[36px] flex items-center gap-1.5 ${
                            activeTab === 'contracts' 
                                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <ShieldCheck size={13} />
                        {isIndo ? 'API Kontrak' : 'Contracts'}
                    </button>
                </div>

                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500">
                    node: v20 · py: 3.10
                </span>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5">
                <AnimatePresence mode="wait">
                    {activeTab === 'arch' && (
                        <m.div
                            key="arch"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                        >
                            {ARCHITECTURE_TIERS.map((tier) => {
                                const IconComponent = tier.icon
                                return (
                                    <div
                                        key={tier.id}
                                        className="p-3 rounded-xl transition-all border border-slate-800/80 hover:border-slate-700 bg-slate-900/60 flex items-start justify-between gap-3"
                                        style={{
                                            background: `linear-gradient(90deg, ${tier.bgGlow} 0%, rgba(15, 23, 42, 0.6) 100%)`
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div 
                                                className="p-2 rounded-lg mt-0.5"
                                                style={{ background: `${tier.color}20`, color: tier.color }}
                                            >
                                                <IconComponent size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-100">
                                                        {isIndo ? tier.nameId : tier.name}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-300 font-mono mt-0.5">
                                                    {tier.tech}
                                                </div>
                                                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                                                    {tier.metrics}
                                                </div>
                                            </div>
                                        </div>

                                        <span 
                                            className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700 text-slate-300 bg-slate-950/60 shrink-0"
                                        >
                                            {tier.status}
                                        </span>
                                    </div>
                                )
                            })}
                        </m.div>
                    )}

                    {activeTab === 'metrics' && (
                        <m.div
                            key="metrics"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                        >
                            <div className="grid grid-cols-2 gap-2.5">
                                {PLATFORM_METRICS.map((mItem, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60"
                                    >
                                        <div className="text-[11px] font-medium text-slate-400">{mItem.label}</div>
                                        <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
                                            {mItem.value}
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">{mItem.detail}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 rounded-xl border border-indigo-900/50 bg-indigo-950/20 text-xs text-indigo-200 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Zap size={15} className="text-indigo-400" />
                                    {isIndo ? 'Diverifikasi via Pytest & CI Runner' : 'Verified via Pytest & CI Pipeline'}
                                </span>
                                <CheckCircle2 size={14} className="text-emerald-400" />
                            </div>
                        </m.div>
                    )}

                    {activeTab === 'contracts' && (
                        <m.div
                            key="contracts"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2 font-mono text-xs"
                        >
                            {ENDPOINT_CONTRACTS.map((contract, idx) => (
                                <div 
                                    key={idx}
                                    className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                            contract.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-sky-950 text-sky-400 border border-sky-800/60'
                                        }`}>
                                            {contract.method}
                                        </span>
                                        <span className="text-slate-200 truncate">{contract.path}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 shrink-0">{contract.status}</span>
                                </div>
                            ))}

                            <div className="text-[11px] text-slate-400 pt-2 font-sans flex items-center justify-between">
                                <span>{isIndo ? 'Strict Schema Validation & CORS Enforcement' : 'Strict Schema Validation & CORS Enforcement'}</span>
                                <span className="font-mono text-emerald-400">PASSED</span>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Status Bar */}
            <div 
                className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400"
                style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>{isIndo ? 'Platform Modern NurdiansyahLabs' : 'NurdiansyahLabs Core Studio'}</span>
                </div>
                <a 
                    href="#showcase" 
                    className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 min-h-[auto]"
                >
                    {isIndo ? 'Lihat Bukti Sistem' : 'View System Proof'}
                    <ArrowUpRight size={12} />
                </a>
            </div>
        </div>
    )
}
