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
        problem: 'Traditional analog paper logs, manual recording errors, and zero visibility into daily flock feed consumption, volatile mortality rates, and Feed Conversion Ratios (FCR).',
        problemId: 'Pencatatan analog di buku kertas rentan hilang dan lambat. Menyebabkan pemilik peternakan kehilangan kendali atas konsumsi pakan harian, lonjakan mortalitas ayam, dan deviasi FCR (Feed Conversion Ratio) yang merugikan.',
        solution: 'An end-to-end digital farm resource planning platform tracking pen populations, daily feed intake, automated FCR calculations, medication schedules, and coop cashflow economics.',
        solutionId: 'Platform ERP digital terintegrasi untuk mendigitalkan operasional peternakan secara paperless: pelacakan populasi tiap kandang, konsumsi pakan, kalkulasi FCR otomatis real-time, jadwal vaksin, dan proyeksi margin panen.',
        metrics: [
            { label: 'Paperless Records', labelId: 'Pencatatan Harian', val: '100% Digital' },
            { label: 'FCR Calculation', labelId: 'Kalkulasi FCR', val: 'Real-Time Auto' },
            { label: 'Mortality Tracking', labelId: 'Monitoring Mortalitas', val: 'Pen-Level Alert' },
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
        title: 'Batam Rental Mobil PWA',
        badge: 'Transport Dispatch & Fleet PWA',
        badgeId: 'Aplikasi Web Rental & Dispatch Armada',
        industry: 'Automotive Rental & Logistics (Batam FTZ)',
        industryId: 'Transportasi & Rental Mobil Batam FTZ',
        problem: 'High customer drop-off from manual telephone booking friction, vehicle schedule overlaps during peak seasons, and opaque rental pricing calculations.',
        problemId: 'Calon pelanggan sering membatalkan sewa karena lambatnya reservasi lewat telepon manual, jadwal tumpang tindih saat musim liburan, dan ketiadaan kalkulator tarif yang transparan.',
        solution: 'A high-performance Progressive Web App with instantaneous fleet schedules, real-time dynamic pricing calculation, and direct automated WhatsApp dispatch workflows.',
        solutionId: 'Progressive Web App (PWA) berkinerja tinggi dengan katalog ketersediaan armada real-time, kalkulator tarif dinamis otomatis (harian/bulanan + opsi supir), dan dispatch lead otomatis ke WhatsApp operator.',
        metrics: [
            { label: 'Mobile Speed', labelId: 'Kecepatan PWA', val: '< 800ms FCP' },
            { label: 'Lead Dispatch', labelId: 'Dispatch Booking', val: 'Instant WhatsApp' },
            { label: 'Fleet Sync', labelId: 'Kalkulator Tarif', val: '100% Dinamis' },
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
        problem: 'Inventory discrepancies across high-volume distribution centers, slow picker traversal cycles, and audit risks in customs compliance reporting.',
        problemId: 'Ketidaksesuaian stok fisik dan data di gudang besar, siklus picking yang lambat, serta kesulitan membuat laporan audit kepatuhan bea cukai logistik maritim.',
        solution: 'An enterprise WMS platform engineered for bin-level tracking, automated FIFO/LIFO valuation, barcode scanner integration, and tamper-proof compliance logs.',
        solutionId: 'Platform ERP pergudangan skala enterprise untuk pelacakan stok level-rak (bin-level), valuasi inventaris otomatis (FIFO & LIFO), pemindaian barcode terintegrasi, dan rekam audit kepatuhan kepabeanan.',
        metrics: [
            { label: 'Stock Accuracy', labelId: 'Akurasi Stok', val: 'Bin-Level Heatmap' },
            { label: 'Inventory Valuation', labelId: 'Valuasi Inventaris', val: 'FIFO & LIFO Auto' },
            { label: 'Compliance Audit', labelId: 'Kepatuhan Audit', val: 'Multi-Warehouse' },
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
                background: 'linear-gradient(180deg, #0B0F17 0%, #0F172A 50%, #0B0F17 100%)',
                color: '#F8FAFC',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
        >
            {/* Background Ambient Glow */}
            <div 
                aria-hidden="true" 
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 80% 20%, ${selectedProject.accentGlow} 0%, transparent 40%),
                        radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 40%)
                    `,
                    transition: 'background-image 0.5s ease'
                }} 
            />

            <div className="container relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-12 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-semibold tracking-wider uppercase mb-3">
                        <Sparkles size={13} className="text-indigo-400" />
                        <span>
                            {isIndo ? 'Proyek & Sistem Produksi Unggulan' : 'Flagship Production Systems'}
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-50 leading-tight mb-4">
                        {isIndo ? (
                            <>
                                Sistem Nyata yang Menggerakkan{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-200">
                                    Operasional Klien
                                </span>
                            </>
                        ) : (
                            <>
                                Real Production Systems Powering{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-200">
                                    Client Operations
                                </span>
                            </>
                        )}
                    </h2>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {isIndo 
                            ? 'Bukan sekadar prototipe atau konsep portofolio. Jelajahi arsitektur dan sistem aplikasi produksi teruji yang dirancang langsung oleh NurdiansyahLabs untuk menyelesaikan tantangan riil bisnis di lapangan.'
                            : 'Beyond templates and prototypes. Explore verified, production-grade applications engineered by NurdiansyahLabs to solve complex operational challenges for actual businesses.'}
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
                                        ? 'bg-slate-800 text-white border border-slate-600 shadow-lg' 
                                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800/40'
                                }`}
                                style={{
                                    boxShadow: isSelected ? `0 4px 20px -4px ${proj.accentGlow}` : 'none',
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
                        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 lg:p-10"
                        style={{
                            boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px -10px ${selectedProject.accentGlow}`,
                            backdropFilter: 'blur(12px)'
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
                                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                                    <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                                        <Zap size={14} />
                                        <span>{isIndo ? 'Tantangan Bisnis' : 'Core Business Challenge'}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                        {isIndo ? selectedProject.problemId : selectedProject.problem}
                                    </p>
                                </div>

                                {/* Solution & Value */}
                                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
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
                                                className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/60"
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
                                                className="text-xs font-mono px-3 py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 flex flex-wrap items-center gap-3">
                                    <Link
                                        to={selectedProject.route}
                                        onClick={() => trackEvent('showcase_demo_click', { project: selectedProject.slug })}
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all shadow-md min-h-[44px] text-sm cursor-pointer"
                                        style={{
                                            background: selectedProject.accent,
                                            boxShadow: `0 6px 20px -4px ${selectedProject.accentGlow}`
                                        }}
                                    >
                                        <span>{isIndo ? 'Buka Live Demo Sistem' : 'Launch Interactive Demo'}</span>
                                        <ExternalLink size={16} />
                                    </Link>

                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all min-h-[44px] text-sm cursor-pointer"
                                    >
                                        <span>{isIndo ? 'Konsultasikan Proyek Serupa' : 'Discuss Similar System'}</span>
                                        <ArrowRight size={16} />
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Simulated Live Console Preview */}
                            <div className="lg:col-span-5 w-full">
                                <div 
                                    className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-left font-mono text-xs shadow-2xl"
                                    style={{
                                        boxShadow: `0 15px 35px -10px rgba(0, 0, 0, 0.8), 0 0 25px -5px ${selectedProject.accentGlow}`
                                    }}
                                >
                                    {/* Mockup Title Bar */}
                                    <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
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
                                                    className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/60"
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
                                        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-[11px] text-slate-300 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                                            <span className="truncate">{selectedProject.previewData.statusText}</span>
                                        </div>

                                        {/* Interactive Live Demo Link */}
                                        <div className="pt-2">
                                            <Link
                                                to={selectedProject.route}
                                                className="w-full py-2.5 px-4 rounded-lg font-sans font-semibold text-xs flex items-center justify-center gap-2 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
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
