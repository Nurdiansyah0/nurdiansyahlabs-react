import { m } from 'framer-motion'
import { Layers, Database, ShieldCheck, Sparkles, Check, X, Zap, Cpu, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'

const beliefs = [
    { 
        icon: Layers, 
        tTitle: 'why.1.title', 
        tDesc: 'why.1.desc',
        color: '#818cf8',
        border: 'border-violet-500/20',
        bg: 'bg-violet-950/30',
        badge: 'Agile Full SDLC',
        metrics: ['Sprint 1–2 Minggu', 'CI/CD Automated', 'Full Git Access']
    },
    { 
        icon: Database, 
        tTitle: 'why.2.title', 
        tDesc: 'why.2.desc',
        color: '#38bdf8',
        border: 'border-sky-500/20',
        bg: 'bg-sky-950/30',
        badge: 'ACID Data & SLA',
        metrics: ['PostgreSQL Cluster', '< 120ms Latency', 'Predictive Telemetry']
    },
    { 
        icon: ShieldCheck, 
        tTitle: 'why.3.title', 
        tDesc: 'why.3.desc',
        color: '#34d399',
        border: 'border-emerald-500/20',
        bg: 'bg-emerald-950/30',
        badge: 'Zero Lock-in',
        metrics: ['100% Code Ownership', 'No Hidden Royalty', '30-Day Bug Warranty']
    },
]

export default function WhyUs() {
    const { t, lang } = useLanguage()
    const { isMobile, isSm } = useResponsive()
    const isIndo = lang === 'id'

    return (
        <section 
            id="why-us" 
            className="relative py-20 lg:py-28 bg-[#07080d] text-slate-100 overflow-hidden"
        >
            {/* Ambient Background Radial Glow */}
            <div 
                aria-hidden="true" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[450px] pointer-events-none opacity-20 blur-[130px] -z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(167, 139, 250, 0.2) 45%, transparent 75%)'
                }}
            />

            {/* Micro Dot Matrix Backdrop */}
            <div 
                aria-hidden="true" 
                className="absolute inset-0 pointer-events-none opacity-[0.12] -z-0"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="container relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-400/20 bg-violet-950/40 backdrop-blur-md mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                        <Sparkles size={12} className="text-violet-400" />
                        <span className="text-xs font-mono font-medium text-violet-200 uppercase tracking-wider">
                            {isIndo ? 'Standar Rekayasa Kami' : 'Engineering Standard'}
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.14] mb-4">
                        {isIndo ? (
                            <>
                                Perbedaan nyata di setiap{' '}
                                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-100 to-purple-300">
                                    lapisan rekayasa.
                                </span>
                            </>
                        ) : (
                            <>
                                The difference in every{' '}
                                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-100 to-purple-300">
                                    engineering layer.
                                </span>
                            </>
                        )}
                    </h2>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        {t('why.subtitle')}
                    </p>
                </div>

                {/* 3 Value Pillar Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
                    {beliefs.map((b, idx) => {
                        const IconComponent = b.icon
                        return (
                            <m.div 
                                key={b.tTitle}
                                initial={{ opacity: 0, y: 25 }} 
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }} 
                                transition={{ duration: 0.5, delay: idx * 0.12 }}
                                className={`rounded-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between group hover:border-white/20 transition-all`}
                            >
                                <div>
                                    {/* Icon & Badge */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div 
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/[0.08] shadow-inner"
                                            style={{ background: `${b.color}15`, color: b.color }}
                                        >
                                            <IconComponent size={24} />
                                        </div>
                                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-950/80 border border-white/[0.06] text-slate-300">
                                            {b.badge}
                                        </span>
                                    </div>

                                    {/* Title & Desc */}
                                    <h3 className="font-bold text-lg sm:text-xl text-white mb-3 leading-snug">
                                        {t(b.tTitle)}
                                    </h3>
                                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                                        {t(b.tDesc)}
                                    </p>
                                </div>

                                {/* Micro Metric Chips */}
                                <div className="pt-4 border-t border-white/[0.06] space-y-1.5 font-mono text-xs">
                                    {b.metrics.map((m, mIdx) => (
                                        <div key={mIdx} className="flex items-center gap-2 text-slate-300 text-[11px]">
                                            <Check size={13} className="text-emerald-400 shrink-0" />
                                            <span>{m}</span>
                                        </div>
                                    ))}
                                </div>
                            </m.div>
                        )
                    })}
                </div>

                {/* Comparison Strip (Stacked Devs Style) */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl p-6 sm:p-8 bg-slate-950/80 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_20px_40px_-15px_rgba(0,0,0,0.8)] overflow-x-auto"
                >
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold flex items-center gap-2">
                        <Zap size={14} className="text-violet-400" />
                        <span>{isIndo ? 'Perbandingan Model Eksekusi' : 'Delivery Model Comparison'}</span>
                    </div>

                    <div className="min-w-[550px] grid grid-cols-4 gap-4 text-xs font-mono text-slate-300 pb-2 border-b border-white/[0.06]">
                        <span className="text-slate-400 font-semibold">{isIndo ? 'Aspek Rekayasa' : 'Engineering Aspect'}</span>
                        <span className="text-slate-400">{isIndo ? 'Freelancer Lepas' : 'Solo Freelancers'}</span>
                        <span className="text-slate-400">{isIndo ? 'Agensi Tradisional' : 'Traditional Agency'}</span>
                        <span className="text-violet-300 font-bold">NurdiansyahLabs</span>
                    </div>

                    <div className="min-w-[550px] divide-y divide-white/[0.04] text-xs font-mono">
                        <div className="grid grid-cols-4 gap-4 py-3 items-center">
                            <span className="text-slate-300 font-medium">{isIndo ? 'Arsitektur Full SDLC' : 'Full SDLC Rigor'}</span>
                            <span className="text-rose-400 flex items-center gap-1"><X size={12} /> {isIndo ? 'Jarang' : 'Rare'}</span>
                            <span className="text-amber-400 flex items-center gap-1"><Check size={12} /> {isIndo ? 'Parsial' : 'Partial'}</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={12} /> {isIndo ? 'Standar Wajib' : 'Mandatory'}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 py-3 items-center">
                            <span className="text-slate-300 font-medium">{isIndo ? 'Kepemilikan Source Code' : 'Source Code Ownership'}</span>
                            <span className="text-amber-400 flex items-center gap-1"><Check size={12} /> {isIndo ? 'Ya' : 'Yes'}</span>
                            <span className="text-rose-400 flex items-center gap-1"><X size={12} /> {isIndo ? 'Vendor Lock-in' : 'Lock-in'}</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={12} /> {isIndo ? '100% Milik Anda' : '100% Unlocked'}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 py-3 items-center">
                            <span className="text-slate-300 font-medium">{isIndo ? 'Automated CI/CD & Tests' : 'CI/CD & Automated Tests'}</span>
                            <span className="text-rose-400 flex items-center gap-1"><X size={12} /> {isIndo ? 'Manual' : 'Manual'}</span>
                            <span className="text-amber-400 flex items-center gap-1"><X size={12} /> {isIndo ? 'Opsional Biaya +' : 'Paid Addon'}</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={12} /> {isIndo ? 'Included Pytest' : 'Included'}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 py-3 items-center">
                            <span className="text-slate-300 font-medium">{isIndo ? 'Komunikasi & Advisory' : 'Direct Architect Advisory'}</span>
                            <span className="text-amber-400 flex items-center gap-1">{isIndo ? 'Sering ghosting' : 'Inconsistent'}</span>
                            <span className="text-slate-400">{isIndo ? 'Lewat Account Mgr' : 'Via Sales Rep'}</span>
                            <span className="text-violet-300 font-bold flex items-center gap-1"><Check size={12} /> {isIndo ? '1-on-1 Lead Architect' : '1-on-1 Direct'}</span>
                        </div>
                    </div>
                </m.div>
            </div>
        </section>
    )
}
