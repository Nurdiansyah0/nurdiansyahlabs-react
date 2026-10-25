import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { 
    Cpu, Database, ShieldCheck, Activity, Terminal, 
    Layers, Zap, CheckCircle2, Server, ArrowUpRight, Code2, Sparkles, Check
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
        color: '#818cf8',
        bgGlow: 'rgba(129, 140, 248, 0.12)'
    },
    {
        id: 'gateway',
        name: 'API Gateway & Core Engine',
        nameId: 'API Gateway & Service Engine',
        tech: 'Python Flask · JWT Auth · Pytest',
        metrics: '< 120ms Latency · Contract Verified',
        status: 'Active',
        icon: Server,
        color: '#38bdf8',
        bgGlow: 'rgba(56, 189, 248, 0.12)'
    },
    {
        id: 'database',
        name: 'Persistence & State',
        nameId: 'Penyimpanan Data & Status',
        tech: 'PostgreSQL · SQLite · Redis Ready',
        metrics: 'ACID Compliant · Automated Backups',
        status: 'Synced',
        icon: Database,
        color: '#34d399',
        bgGlow: 'rgba(52, 211, 153, 0.12)'
    },
    {
        id: 'intelligence',
        name: 'AI & Data Intelligence',
        nameId: 'Pipeline AI & Intelijen Data',
        tech: 'Scikit-learn · Smart Vision · Analytics',
        metrics: 'Real-time Inference · Telemetry Logs',
        status: 'Ready',
        icon: Cpu,
        color: '#c084fc',
        bgGlow: 'rgba(192, 132, 252, 0.12)'
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
    const [activeTab, setActiveTab] = useState('code')

    return (
        <div 
            className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden text-left border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_25px_60px_-20px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(167,139,250,0.2)] backdrop-blur-xl transition-all"
            style={{
                background: 'linear-gradient(145deg, rgba(15, 18, 28, 0.96) 0%, rgba(9, 11, 18, 0.98) 100%)',
            }}
        >
            {/* Window Title Bar */}
            <div 
                className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-slate-950/70"
            >
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        <Terminal size={12} className="text-violet-400" />
                        core.engine.ts
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wide uppercase">
                        Production Live
                    </span>
                </div>
            </div>

            {/* Subheader / Mode Switcher */}
            <div className="flex items-center justify-between p-2 sm:p-2.5 border-b border-white/[0.06] bg-slate-900/40 text-xs">
                <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                    <button
                        type="button"
                        onClick={() => setActiveTab('code')}
                        className={`px-2.5 py-1.5 rounded-lg font-mono text-xs min-h-[34px] flex items-center gap-1.5 shrink-0 transition-all ${
                            activeTab === 'code' 
                                ? 'bg-violet-600/25 text-violet-200 border border-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <Code2 size={13} className="text-violet-400" />
                        AI Pair & Tests
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('arch')}
                        className={`px-2.5 py-1.5 rounded-lg font-mono text-xs min-h-[34px] flex items-center gap-1.5 shrink-0 transition-all ${
                            activeTab === 'arch' 
                                ? 'bg-violet-600/25 text-violet-200 border border-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <Layers size={13} className="text-indigo-400" />
                        {isIndo ? 'Arsitektur' : 'Architecture'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('metrics')}
                        className={`px-2.5 py-1.5 rounded-lg font-mono text-xs min-h-[34px] flex items-center gap-1.5 shrink-0 transition-all ${
                            activeTab === 'metrics' 
                                ? 'bg-violet-600/25 text-violet-200 border border-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <Activity size={13} className="text-sky-400" />
                        {isIndo ? 'Telemetri' : 'Telemetry'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('contracts')}
                        className={`px-2.5 py-1.5 rounded-lg font-mono text-xs min-h-[34px] flex items-center gap-1.5 shrink-0 transition-all ${
                            activeTab === 'contracts' 
                                ? 'bg-violet-600/25 text-violet-200 border border-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                    >
                        <ShieldCheck size={13} className="text-emerald-400" />
                        {isIndo ? 'API Kontrak' : 'Contracts'}
                    </button>
                </div>

                <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500">
                    CI: PASSED
                </span>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5">
                <AnimatePresence mode="wait">
                    {/* NEW TAB: Code & AI Testing Pair (Stacked Devs aesthetic) */}
                    {activeTab === 'code' && (
                        <m.div
                            key="code"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-3 font-mono text-xs"
                        >
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-white/[0.05]">
                                <span className="text-slate-300 flex items-center gap-1.5">
                                    <Sparkles size={12} className="text-violet-400" />
                                    telemetry.service.ts <span className="text-slate-500">· AI-drafted, engineer-hardened</span>
                                </span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <Check size={12} /> 0 issues
                                </span>
                            </div>

                            <div className="bg-slate-950/80 rounded-xl p-3 border border-white/[0.06] text-[11px] sm:text-xs leading-relaxed overflow-x-auto text-slate-300">
                                <div className="text-slate-500">// 1. Schema-validated distributed lead engine</div>
                                <div><span className="text-purple-400">export async function</span> <span className="text-sky-300">dispatchTelemetry</span>(<span className="text-amber-200">payload</span>: <span className="text-emerald-300">Event</span>) {'{'}</div>
                                <div className="pl-4 text-slate-400">const valid = <span className="text-indigo-300">EventSchema</span>.<span className="text-sky-300">parse</span>(payload);</div>
                                <div className="pl-4 text-slate-400">const latency = await <span className="text-indigo-300">metrics</span>.<span className="text-sky-300">recordSLA</span>(valid.id);</div>
                                <div className="pl-4"><span className="text-purple-400">return</span> {'{'} <span className="text-slate-300">status:</span> <span className="text-amber-300">200</span>, <span className="text-slate-300">sla_ms:</span> latency, <span className="text-slate-300">hardened:</span> <span className="text-sky-400">true</span> {'}'};</div>
                                <div>{'}'}</div>
                            </div>

                            {/* Verification Footnotes */}
                            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                                    <span>18/18 tests pass</span>
                                </div>
                                <div className="p-2 rounded-lg bg-violet-950/30 border border-violet-800/40 text-violet-300 flex items-center gap-1.5">
                                    <Zap size={12} className="text-violet-400 shrink-0" />
                                    <span>96% coverage</span>
                                </div>
                                <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-800/40 text-sky-300 flex items-center gap-1.5">
                                    <ShieldCheck size={12} className="text-sky-400 shrink-0" />
                                    <span>OWASP secure</span>
                                </div>
                            </div>
                        </m.div>
                    )}

                    {activeTab === 'arch' && (
                        <m.div
                            key="arch"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-2.5"
                        >
                            {ARCHITECTURE_TIERS.map((tier) => {
                                const IconComponent = tier.icon
                                return (
                                    <div
                                        key={tier.id}
                                        className="p-3 rounded-xl transition-all border border-white/[0.06] hover:border-white/10 bg-slate-900/60 flex items-start justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
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
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-3"
                        >
                            <div className="grid grid-cols-2 gap-2.5">
                                {PLATFORM_METRICS.map((mItem, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-3.5 rounded-xl border border-white/[0.06] bg-slate-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                                    >
                                        <div className="text-[11px] font-medium text-slate-400">{mItem.label}</div>
                                        <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
                                            {mItem.value}
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">{mItem.detail}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 rounded-xl border border-violet-900/40 bg-violet-950/20 text-xs text-violet-200 flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                <span className="flex items-center gap-2">
                                    <Zap size={15} className="text-violet-400" />
                                    {isIndo ? 'Diverifikasi via Pytest & CI Runner' : 'Verified via Pytest & CI Pipeline'}
                                </span>
                                <CheckCircle2 size={14} className="text-emerald-400" />
                            </div>
                        </m.div>
                    )}

                    {activeTab === 'contracts' && (
                        <m.div
                            key="contracts"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-2 font-mono text-xs"
                        >
                            {ENDPOINT_CONTRACTS.map((contract, idx) => (
                                <div 
                                    key={idx}
                                    className="p-2.5 rounded-lg border border-white/[0.06] bg-slate-950/80 flex items-center justify-between gap-2"
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
                className="px-4 py-2.5 bg-slate-950/90 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400"
            >
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                    <span>{isIndo ? 'NurdiansyahLabs Engineering Studio' : 'NurdiansyahLabs Studio Engine'}</span>
                </div>
                <a 
                    href="#showcase" 
                    className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1 min-h-[auto]"
                >
                    {isIndo ? 'Lihat Bukti Sistem' : 'View System Proof'}
                    <ArrowUpRight size={12} />
                </a>
            </div>
        </div>
    )
}
