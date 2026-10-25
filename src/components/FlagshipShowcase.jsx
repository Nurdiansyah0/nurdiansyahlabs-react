import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
    Layers, ExternalLink, ArrowRight, CheckCircle2, 
    Smartphone, Server, ShieldCheck, Database, Zap, 
    BarChart3, Activity, Sparkles, Building2, Truck
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useTracker } from '../hooks/useTracker'

const FLAGSHIP_PROJECTS = [
    {
        id: 'primatera',
        slug: 'primatera-poultry',
        route: '/showcase/fullstack/primatera-poultry',
        title: 'Primatera Poultry ERP',
        badge: 'Enterprise Agriculture ERP',
        badgeId: 'Sistem ERP Agribisnis Komersial',
        industry: 'Poultry & Livestock Farming (Joper / KUB)',
        industryId: 'Peternakan Komersial & Agribisnis',
        problem: 'Manual analog paper logs caused rampant feed inventory shrinkage up to 12%, unmonitored FCR deviations, and delayed mortality spike alerts that directly eroded flock profitability.',
        problemId: 'Pencatatan manual di kertas memicu kebocoran inventaris pakan hingga 12%, deviasi rasio FCR tidak terpantau, dan keterlambatan deteksi lonjakan mortalitas yang merugikan margin peternakan.',
        solution: 'Predictive-enabled agriculture ERP: 100% paperless coop telemetry, feed inventory loss prevention, real-time automated FCR telemetry, and harvest yield forecasting.',
        solutionId: 'Platform ERP agribisnis bertenaga prediktif: digitalisasi pencatatan kandang 100%, pencegahan susut inventaris pakan (inventory loss prevention), kalkulasi FCR otomatis real-time, dan proyeksi yield panen harian.',
        metrics: [
            { label: 'Inventory Loss Prevention', labelId: 'Pencegahan Susut Pakan', val: 'Hemat ~12% Pakan' },
            { label: 'Predictive FCR Telemetry', labelId: 'Kalkulasi FCR Prediktif', val: 'Real-Time Auto' },
            { label: 'Mortality Anomaly Alert', labelId: 'Deteksi Dini Mortalitas', val: '< 15 Mins Alert' },
        ],
        stack: ['React 18', 'Node.js / Express', 'PostgreSQL', 'Docker Linux'],
        accent: '#f59e0b',
        accentGlow: 'rgba(245, 158, 11, 0.15)',
        previewData: {
            title: 'PRIMATERA // FLOCK-MONITOR-V2',
            tag: 'LIVE COOP TELEMETRY',
            kpis: [
                { label: 'Total Populasi', value: '24.500 Ekor' },
                { label: 'Indeks FCR', value: '1.48 (Optimal)' },
                { label: 'Pakan Harian', value: '420 kg / hari' },
                { label: 'Mortalitas Hari Ini', value: '0.08% (Normal)' }
            ],
            statusText: 'Kandang Alpha & Beta: Suhu 28.5°C · Ventilasi Otomatis Aktif'
        }
    },
    {
        id: 'batam-rental',
        slug: 'batam-rental-mobil',
        route: '/showcase/landing-page/batam-rental-mobil',
        subdomain: 'https://rental.nurdiansyahlabs.com',
        subdomainHost: 'rental.nurdiansyahlabs.com',
        title: 'Batam Rental Mobil PWA',
        badge: 'Transport Dispatch & Fleet PWA',
        badgeId: 'Aplikasi Web Rental & Dispatch Armada',
        industry: 'Automotive Rental & Logistics (Batam FTZ)',
        industryId: 'Transportasi & Rental Mobil Batam FTZ',
        problem: 'High customer abandonment from slow manual telephone bookings (poor First Call Resolution), fleet scheduling overlaps during peak seasons, and opaque pickup location routing.',
        problemId: 'Calon pelanggan membatalkan reservasi karena penanganan telepon manual yang lambat (First Call Resolution rendah), jadwal armada tumpang tindih saat peak season, dan ketiadaan verifikasi lokasi transparan.',
        solution: 'Ultra-fast PWA (< 800ms FCP) featuring automated dynamic pricing engine, GPS geofencing fleet verification, and 1-click WhatsApp booking dispatch driving instant First Call Resolution.',
        solutionId: 'Progressive Web App (PWA) ultra-responsif (< 800ms FCP) dengan kalkulator tarif dinamis otomatis, verifikasi geofencing GPS armada, dan dispatch booking 1-klik langsung ke WhatsApp operator untuk First Call Resolution instan.',
        metrics: [
            { label: 'First Call Resolution', labelId: 'First Call Resolution', val: '94% Instant Booking' },
            { label: 'GPS Geofencing Verification', labelId: 'Verifikasi Geofencing GPS', val: '100% Fleet Tracked' },
            { label: 'PWA Response Speed', labelId: 'Kecepatan Akses PWA', val: '< 620ms FCP' },
        ],
        stack: ['React 18', 'Vite PWA', 'Tailwind CSS', 'Modular Flask API', 'PostgreSQL'],
        accent: '#3b82f6',
        accentGlow: 'rgba(59, 130, 246, 0.15)',
        previewData: {
            title: 'BATAM RENTAL // DISPATCH-GATEWAY',
            tag: 'RESERVATION DISPATCH ENGINE',
            kpis: [
                { label: 'Armada Siap Pakai', value: '18 Unit Aktif' },
                { label: 'Tarif Sewa Mulai', value: 'Rp 350.000 / hr' },
                { label: 'Rata-rata Waktu Muat', value: '620ms (PWA)' },
                { label: 'Integrasi WhatsApp', value: 'Direct 1-Click' }
            ],
            statusText: 'Sistem Dispatch Aktif: Toyota Avanza, Innova Reborn & HiAce Terhubung'
        }
    },
    {
        id: 'logistack',
        slug: 'warehouse-wms',
        route: '/showcase/fullstack/warehouse-wms',
        title: 'LogiStack Warehouse WMS',
        badge: 'Enterprise Warehouse Management',
        badgeId: 'Sistem ERP Manajemen Pergudangan',
        industry: 'Cross-Border Supply Chain & Maritime Logistics',
        industryId: 'Logistik Pergudangan & Ekspor-Impor',
        problem: 'Severe physical inventory discrepancies in high-volume distribution centers, inefficient picker traversal routes, and high audit penalties in customs regulatory compliance.',
        problemId: 'Ketidaksesuaian stok fisik dan sistem di gudang distribusi, rute picking lambat, dan risiko sanksi akibat kesulitan audit kepatuhan bea cukai kepabeanan.',
        solution: 'Enterprise WMS engineered for bin-level heatmap tracking, inventory loss prevention, automated FIFO/LIFO valuation, and tamper-proof customs compliance audit logs.',
        solutionId: 'Sistem WMS enterprise dengan pelacakan bin-level heatmap presisi, pencegahan kehilangan stok (inventory loss prevention), valuasi FIFO/LIFO otomatis, dan audit trail kepatuhan bea cukai tamper-proof.',
        metrics: [
            { label: 'Inventory Loss Prevention', labelId: 'Pencegahan Susut Stok', val: '0 Discrepancy' },
            { label: 'Stock Accuracy', labelId: 'Akurasi Bin-Level', val: '99.8% Precision' },
            { label: 'Customs Compliance', labelId: 'Audit Trail Kepatuhan', val: '100% Tamper-Proof' },
        ],
        stack: ['React 18', 'Java Spring Boot', 'Hibernate ORM', 'PostgreSQL', 'AWS S3'],
        accent: '#10b981',
        accentGlow: 'rgba(16, 185, 129, 0.15)',
        previewData: {
            title: 'LOGISTACK // WMS-ENTERPRISE-CONSOLE',
            tag: 'BIN-LEVEL REPLENISHMENT',
            kpis: [
                { label: 'Total Item SKU', value: '1.840 Terdaftar' },
                { label: 'Kapasitas Rak Terpakai', value: '87.4% Kapasitas' },
                { label: 'Valuasi Stok (FIFO)', value: 'Rp 1.28 Miliar' },
                { label: 'Audit Trail Status', value: '100% Terverifikasi' }
            ],
            statusText: 'Gudang Utama A-04: Bin Heatmap Aktif · Siklus Picking Teroptimasi'
        }
    }
]

export default function FlagshipShowcase() {
    const { lang } = useLanguage()
    const { trackEvent } = useTracker()
    const isIndo = lang === 'id'
    const [selectedProject, setSelectedProject] = useState(FLAGSHIP_PROJECTS[0])

    const handleSelect = (project) => {
        setSelectedProject(project)
        trackEvent('showcase_tab_switch', { project: project.slug })
    }

    return (
        <section 
            id="showcase" 
            className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
            style={{
                background: '#07080d',
                color: '#F8FAFC',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
        >
            {/* Background Ambient Glow & Dot Matrix */}
            <div 
                aria-hidden="true" 
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 80% 20%, ${selectedProject.accentGlow} 0%, transparent 45%),
                        radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 45%),
                        radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 32px 32px',
                    transition: 'background-image 0.5s ease'
                }} 
            />

            <div className="container relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-12 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300 text-xs font-mono mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                        <span>
                            {isIndo ? 'STUDI KASUS ENTERPRISE · BUKTI PRODUKSI' : 'ENTERPRISE CASE STUDIES · PRODUCTION BLUEPRINTS'}
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-50 leading-tight mb-4">
                        {isIndo ? (
                            <>
                                Sistem Nyata dengan ROI Terukur yang Menggerakkan{' '}
                                <span className="font-serif-accent italic font-normal text-slate-100">
                                    Operasional Klien
                                </span>.
                            </>
                        ) : (
                            <>
                                Real Production Systems Delivering Measured ROI for{' '}
                                <span className="font-serif-accent italic font-normal text-slate-100">
                                    Client Operations
                                </span>.
                            </>
                        )}
                    </h2>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {isIndo 
                            ? 'Bukan sekadar prototipe atau konsep portofolio. Jelajahi arsitektur dan sistem produksi terverifikasi yang dirancang NurdiansyahLabs untuk menyelesaikan tantangan riil bisnis: mengeliminasi susut stok, mempercepat First Call Resolution, dan mengotomasi alur kerja tanpa friksi.'
                            : 'Beyond templates and prototypes. Explore verified production systems engineered by NurdiansyahLabs to deliver concrete business ROI: eliminating inventory shrinkage, accelerating First Call Resolution, and automating frictionless operational workflows.'}
                    </p>
                </div>

                {/* System Tabs Selector */}
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    {FLAGSHIP_PROJECTS.map((proj) => {
                        const isSelected = selectedProject.id === proj.id
                        return (
                            <button
                                key={proj.id}
                                type="button"
                                onClick={() => handleSelect(proj)}
                                className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2.5 min-h-[44px] cursor-pointer ${
                                    isSelected 
                                        ? 'bg-slate-900/90 text-white border border-white/20 shadow-xl' 
                                        : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:bg-slate-800/40'
                                }`}
                                style={{
                                    boxShadow: isSelected 
                                        ? `inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 25px -4px ${proj.accentGlow}` 
                                        : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                                    borderColor: isSelected ? proj.accent : undefined
                                }}
                            >
                                <span 
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ background: isSelected ? proj.accent : '#64748b' }}
                                />
                                <span className="font-semibold">{proj.title}</span>
                                <span className="hidden md:inline-block text-[11px] text-slate-400 font-mono">
                                    [{isIndo ? proj.badgeId : proj.badge}]
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Selected Project Showcase Card */}
                <AnimatePresence mode="wait">
                    <m.div
                        key={selectedProject.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-2xl border border-white/[0.08] bg-[#0b0e17]/80 p-6 sm:p-8 lg:p-10"
                        style={{
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 25px 50px -15px rgba(0, 0, 0, 0.8), 0 0 40px -15px ${selectedProject.accentGlow}`,
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)'
                        }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            
                            {/* Left Column: Context, Problem & Impact */}
                            <div className="lg:col-span-7 text-left space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span 
                                            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border"
                                            style={{ 
                                                color: selectedProject.accent, 
                                                background: `${selectedProject.accent}15`,
                                                borderColor: `${selectedProject.accent}30`
                                            }}
                                        >
                                            {isIndo ? selectedProject.badgeId : selectedProject.badge}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {isIndo ? selectedProject.industryId : selectedProject.industry}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
                                        {selectedProject.title}
                                    </h3>
                                </div>

                                {/* Problem Statement */}
                                <div className="p-4 rounded-xl border border-white/[0.08] bg-[#07090f]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                    <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-mono">
                                        <Zap size={14} />
                                        <span>{isIndo ? 'Tantangan Bisnis' : 'Core Business Challenge'}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        {isIndo ? selectedProject.problemId : selectedProject.problem}
                                    </p>
                                </div>

                                {/* Solution & Value */}
                                <div className="p-4 rounded-xl border border-white/[0.08] bg-[#07090f]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-mono">
                                        <CheckCircle2 size={14} />
                                        <span>{isIndo ? 'Solusi & Dampak Sistem' : 'Engineered Solution & Impact'}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        {isIndo ? selectedProject.solutionId : selectedProject.solution}
                                    </p>
                                </div>

                                {/* Verified Operational Metrics */}
                                <div>
                                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                                        {isIndo ? 'Metrik Terverifikasi' : 'Verified Capabilities'}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {selectedProject.metrics.map((mItem, idx) => (
                                            <div 
                                                key={idx} 
                                                className="p-3 rounded-xl border border-white/[0.08] bg-[#0d111a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                            >
                                                <div className="text-[11px] text-slate-400">
                                                    {isIndo ? mItem.labelId : mItem.label}
                                                </div>
                                                <div className="text-sm font-bold font-mono text-slate-100 mt-0.5">
                                                    {mItem.val}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Architecture Tech Badges */}
                                <div>
                                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                                        {isIndo ? 'Arsitektur Teknologi' : 'Architecture Stack'}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.stack.map((tech, idx) => (
                                            <span 
                                                key={idx}
                                                className="text-xs font-mono px-3 py-1 rounded-lg bg-[#07090f] text-slate-300 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 flex flex-wrap items-center gap-3">
                                    {selectedProject.subdomain && (
                                        <a
                                            href={selectedProject.subdomain}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all min-h-[44px] text-sm cursor-pointer border border-white/20"
                                            style={{
                                                background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
                                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 20px -4px rgba(22, 163, 74, 0.4)'
                                            }}
                                        >
                                            <span>{isIndo ? `🌐 Uji Live Demo: ${selectedProject.subdomainHost}` : `🌐 Test Live Demo: ${selectedProject.subdomainHost}`}</span>
                                            <ExternalLink size={16} />
                                        </a>
                                    )}

                                    <Link
                                        to={selectedProject.route}
                                        onClick={() => trackEvent('showcase_demo_click', { project: selectedProject.slug })}
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all min-h-[44px] text-sm cursor-pointer border border-white/20"
                                        style={{
                                            background: selectedProject.accent,
                                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 20px -4px ${selectedProject.accentGlow}`
                                        }}
                                    >
                                        <span>{isIndo ? 'Arsitektur & Bukti ROI' : 'Architecture & ROI Blueprint'}</span>
                                        <ArrowRight size={16} />
                                    </Link>

                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] transition-all min-h-[44px] text-sm cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                                    >
                                        <span>{isIndo ? 'Konsultasi Arsitektur Serupa' : 'Consult Similar Architecture'}</span>
                                        <ArrowRight size={16} />
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Simulated Live Console Preview */}
                            <div className="lg:col-span-5 w-full">
                                <div 
                                    className="rounded-xl overflow-hidden border border-white/[0.1] bg-[#06080e] text-left font-mono text-xs shadow-2xl"
                                    style={{
                                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 45px -10px rgba(0, 0, 0, 0.9), 0 0 30px -5px ${selectedProject.accentGlow}`
                                    }}
                                >
                                    {/* Mockup Title Bar */}
                                    <div className="px-4 py-3 bg-[#0b0e17] border-b border-white/[0.08] flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                                            <span className="ml-2 text-[11px] text-slate-400 truncate max-w-[200px]">
                                                {selectedProject.previewData.title}
                                            </span>
                                        </div>
                                        <span 
                                            className="text-[10px] px-2 py-0.5 rounded border"
                                            style={{
                                                color: selectedProject.accent,
                                                borderColor: `${selectedProject.accent}40`,
                                                background: `${selectedProject.accent}15`
                                            }}
                                        >
                                            {selectedProject.previewData.tag}
                                        </span>
                                    </div>

                                    {/* Mockup Dashboard Body */}
                                    <div className="p-5 space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedProject.previewData.kpis.map((kpi, idx) => (
                                                <div 
                                                    key={idx}
                                                    className="p-3 rounded-lg border border-white/[0.08] bg-[#0c101b] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                                >
                                                    <div className="text-[10px] text-slate-400">{kpi.label}</div>
                                                    <div 
                                                        className="text-base font-bold mt-1"
                                                        style={{ color: idx === 1 ? selectedProject.accent : '#f8fafc' }}
                                                    >
                                                        {kpi.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Status Bar */}
                                        <div className="p-3 rounded-lg border border-white/[0.08] bg-[#0c101b] text-[11px] text-slate-300 flex items-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                                            <span className="truncate">{selectedProject.previewData.statusText}</span>
                                        </div>

                                        {/* Interactive Live Demo Link */}
                                        <div className="pt-2">
                                            <Link
                                                to={selectedProject.route}
                                                className="w-full py-2.5 px-4 rounded-xl font-sans font-semibold text-xs flex items-center justify-center gap-2 text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                            >
                                                <span>{isIndo ? 'Jelajahi Demo Lengkap di Layar Penuh' : 'Launch Fullscreen Live Experience'}</span>
                                                <ExternalLink size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </m.div>
                </AnimatePresence>

                {/* Bottom Section Link */}
                <div className="mt-10 text-center">
                    <p className="text-xs sm:text-sm text-slate-400">
                        {isIndo 
                            ? 'Mencari arsitektur atau solusi khusus untuk industri Anda?' 
                            : 'Need a custom architecture or system engineered for your specific industry?'}{' '}
                        <a href="#contact" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">
                            {isIndo ? 'Diskusikan bersama teknisi kami' : 'Consult with our engineering team'}
                        </a>
                    </p>
                </div>

            </div>
        </section>
    )
}
