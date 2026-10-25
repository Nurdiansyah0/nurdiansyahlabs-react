import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { 
    Layers, Server, Brain, CheckCircle2, AlertCircle, 
    MessageCircle, ArrowRight, Clock, RotateCcw, ShieldCheck, 
    Sparkles, ExternalLink, Code2, Check, Lock, Database, 
    Activity, Workflow, ShieldAlert, Cpu, ArrowUpRight
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import servicesData from '../data/services.json'
import PortfolioModal from './PortfolioModal'

export default function Services() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeService = searchParams.get('service')
    const { lang, t } = useLanguage()
    const { isMobile, isSm } = useResponsive()
    const isIndo = lang === 'id'

    const packages = servicesData.packages || []

    const openModal = (key) => setSearchParams({ service: key })
    const closeModal = () => { 
        searchParams.delete('service')
        setSearchParams(searchParams) 
    }

    const handleSelectPackage = (pkg) => {
        // Dispatch custom event for real-time ContactForm pre-selection and draft population
        window.dispatchEvent(new CustomEvent('selectPackage', {
            detail: {
                packageId: pkg.id,
                service: pkg.serviceOptionValue,
                message: pkg.draftMessage
            }
        }))

        // Update URL query param cleanly without full page refresh
        const url = new URL(window.location)
        url.searchParams.set('package', pkg.id)
        window.history.replaceState({}, '', url)

        // Smooth scroll to #contact
        const contactSection = document.getElementById('contact')
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => {
                const messageInput = document.getElementById('contact-message') || document.getElementById('contact-name')
                if (messageInput) messageInput.focus()
            }, 600)
        }
    }

    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "NurdiansyahLabs",
        "url": "https://nurdiansyahlabs.com",
        "image": "https://nurdiansyahlabs.com/assets/android-chrome-512x512.png",
        "description": "Jasa Software Enterprise, Full SDLC Software Engineer, Custom ERP & Arsitektur Database Terdistribusi di Indonesia.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Batam",
            "addressRegion": "Kepulauan Riau",
            "addressCountry": "ID"
        },
        "priceRange": "$$$",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Paket Komersial & Layanan Enterprise NurdiansyahLabs",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Paket 1: Enterprise Web Portal & Modular Frontend",
                        "description": "Arsitektur frontend modular React 18, performa tinggi (< 800ms FCP), Core Web Vitals 95+, dan integrasi API terproteksi."
                    },
                    "priceCurrency": "IDR",
                    "price": "2500000",
                    "url": "https://nurdiansyahlabs.com/services/landing-page"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Paket 2: Custom Enterprise ERP & Sistem Operasional Terdistribusi",
                        "description": "Aplikasi web skala enterprise dan sistem ERP kustom terintegrasi dengan metodologi Full SDLC dan database high-concurrency."
                    },
                    "priceCurrency": "IDR",
                    "price": "5000000",
                    "url": "https://nurdiansyahlabs.com/services/web-development"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Paket 3: Konsultasi Arsitektur Teknis, Full SDLC & Enterprise Advisory",
                        "description": "Konsultasi arsitektur sistem, audit query SQL PostgreSQL, mitigasi technical debt, dan sesi discovery gratis 30 menit."
                    },
                    "priceCurrency": "IDR",
                    "price": "0",
                    "url": "https://nurdiansyahlabs.com/#services"
                }
            ]
        }
    }

    const packageIcons = {
        'starter': Layers,
        'custom-erp': Server,
        'advisory': Brain
    }

    const packageAccents = {
        'starter': {
            badgeBg: 'bg-sky-950/70 border-sky-500/40 text-sky-400',
            border: 'border-white/10 hover:border-sky-500/40',
            button: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30',
            highlight: false
        },
        'custom-erp': {
            badgeBg: 'bg-violet-950/90 border-violet-500/60 text-violet-300',
            border: 'border-violet-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_15px_40px_-10px_rgba(139,92,246,0.3)] hover:border-violet-400',
            button: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-900/40',
            highlight: true
        },
        'advisory': {
            badgeBg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400',
            border: 'border-white/10 hover:border-emerald-500/40',
            button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30',
            highlight: false
        }
    }

    return (
        <section 
            id="services" 
            className="relative py-20 lg:py-28 bg-[#07080d] text-slate-100 overflow-hidden"
        >
            {/* Top Atmospheric Aura */}
            <div 
                aria-hidden="true" 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-25 blur-[140px] -z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)'
                }}
            />

            {/* Subtle Dot Grid */}
            <div 
                aria-hidden="true" 
                className="absolute inset-0 pointer-events-none opacity-[0.12] -z-0"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            <script type="application/ld+json">
                {JSON.stringify(schemaMarkup)}
            </script>

            <div className="container relative z-10">
                
                {/* ======================================================== */}
                {/* PART 1: THE DISCIPLINES BENTO GRID (Stacked Devs Style) */}
                {/* ======================================================== */}
                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-400/20 bg-violet-950/40 backdrop-blur-md mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                        <span className="text-xs font-mono font-medium text-violet-200 uppercase tracking-wider">
                            {isIndo ? 'Disiplin Rekayasa' : 'Engineering Disciplines'}
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.14] mb-4">
                        {isIndo ? (
                            <>
                                Empat pilar rekayasa.{' '}
                                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-100 to-purple-300">
                                    Satu studio terpadu.
                                </span>
                            </>
                        ) : (
                            <>
                                Four disciplines.{' '}
                                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-100 to-purple-300">
                                    One unified stack.
                                </span>
                            </>
                        )}
                    </h2>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        {isIndo
                            ? 'Kebanyakan perusahaan kerepotan mengkoordinasikan vendor terpisah untuk website, data pipeline, dan cloud infrastructure. Kami menyatukan seluruh stack rekayasa agar front-end, database, dan arsitektur keamanan bekerja harmonis sebagai satu kesatuan.'
                            : 'Most teams juggle separate vendors for their web app, data pipelines, and infrastructure. We bring it all together under one roof—so every layer of your product is engineered to perform as one.'}
                    </p>
                </div>

                {/* The 4-Card Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24 items-stretch">
                    
                    {/* Bento 1: Web & SaaS Engineering (Col 7) */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between group hover:border-white/20 transition-all"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-violet-400 font-semibold px-2.5 py-1 rounded-md bg-violet-950/60 border border-violet-800/40">
                                    Web & SaaS Engineering
                                </span>
                                <span className="text-xs font-mono text-slate-500">React 18 · Vite · Tailwind</span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                                {isIndo ? 'Aplikasi Web yang Presisi, Cepat & Mengonversi' : 'Web Applications that Look Flawless & Convert'}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                                {isIndo 
                                    ? 'Dari web platform berkonversi tinggi hingga portal custom ERP, kami membangun aplikasi web skala produksi dengan arsitektur modular, SEO prerendered, dan aksesibilitas tinggi.'
                                    : 'From high-converting web platforms to complex SaaS portals, we engineer production-grade web applications with modern modular architecture, SEO-readiness, and sub-second performance.'}
                            </p>
                        </div>

                        {/* Interactive Visual: Mini Browser & Metric Badges */}
                        <div className="rounded-2xl bg-slate-950/90 border border-white/[0.08] p-4 font-mono text-xs shadow-inner">
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3 text-[11px] text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-rose-500/80"></span>
                                    <span className="w-2 h-2 rounded-full bg-amber-500/80"></span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                                    <span className="ml-2 text-slate-300">https://app.nurdiansyahlabs.com</span>
                                </div>
                                <span className="text-emerald-400 font-semibold">200 OK</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                                <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.04]">
                                    <div className="text-slate-400 text-[10px]">Lighthouse</div>
                                    <div className="text-emerald-400 font-bold text-sm sm:text-base mt-0.5">98/100</div>
                                </div>
                                <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.04]">
                                    <div className="text-slate-400 text-[10px]">FCP Speed</div>
                                    <div className="text-sky-400 font-bold text-sm sm:text-base mt-0.5">&lt; 0.6s</div>
                                </div>
                                <div className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.04]">
                                    <div className="text-slate-400 text-[10px]">Architecture</div>
                                    <div className="text-violet-300 font-bold text-sm sm:text-base mt-0.5">Modular</div>
                                </div>
                            </div>
                        </div>
                    </m.div>

                    {/* Bento 2: Data Integrity & Lineage (Col 5) */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between group hover:border-white/20 transition-all"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold px-2.5 py-1 rounded-md bg-sky-950/60 border border-sky-800/40">
                                    Data Lineage & BI
                                </span>
                                <Workflow size={14} className="text-sky-400" />
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                                {isIndo ? 'Data yang Valid, Dilacak & Dipertanggungjawabkan' : 'Data You Can Trust, Trace & Defend'}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                                {isIndo
                                    ? 'Data yang salah menghasilkan keputusan bisnis yang fatal. Kami merekayasa pipeline di mana setiap record divalidasi dan setiap transformasi dapat dilacak.'
                                    : 'Bad data is costly. We engineer pipelines where every record is validated, traceable, and governed—so dashboard numbers are numbers you can stake decisions on.'}
                            </p>
                        </div>

                        {/* Interactive Visual: Lineage Flow Nodes */}
                        <div className="rounded-2xl bg-slate-950/90 border border-white/[0.08] p-3.5 font-mono text-[11px] text-slate-300 shadow-inner">
                            <div className="text-[10px] text-slate-500 mb-2">// Automated Pipeline Flow</div>
                            <div className="grid grid-cols-4 gap-1.5 text-center">
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-200">
                                    <div className="text-[9px] text-slate-500">01</div>
                                    <div className="font-semibold text-[10px] text-sky-300">Ingest</div>
                                </div>
                                <div className="p-2 rounded-lg bg-sky-950/50 border border-sky-600/40 text-sky-200">
                                    <div className="text-[9px] text-sky-400">02</div>
                                    <div className="font-semibold text-[10px] text-emerald-300">Validate</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-200">
                                    <div className="text-[9px] text-slate-500">03</div>
                                    <div className="font-semibold text-[10px] text-indigo-300">Transform</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-200">
                                    <div className="text-[9px] text-slate-500">04</div>
                                    <div className="font-semibold text-[10px] text-amber-300">Serve</div>
                                </div>
                            </div>
                            <div className="mt-2 text-[10px] text-emerald-400 flex items-center justify-between pt-1">
                                <span>Zero-drift schema validation</span>
                                <span>P99 &lt; 120ms</span>
                            </div>
                        </div>
                    </m.div>

                    {/* Bento 3: Enterprise Security First (Col 5) */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between group hover:border-white/20 transition-all"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40">
                                    Security First
                                </span>
                                <ShieldCheck size={16} className="text-emerald-400" />
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                                {isIndo ? 'Keamanan Bukan Fitur, Melainkan Fondasi' : "Security Isn't a Feature. It's the Foundation."}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                                {isIndo
                                    ? 'Setiap baris kode di-harden terhadap ancaman OWASP Top 10, sanitasi SQL injection, enkripsi TLS 1.3, dan arsitektur akses zero-trust.'
                                    : 'Every line of code is engineered against industry benchmarks—OWASP Top 10, strict SQL parameterization, and zero-trust authentication.'}
                            </p>
                        </div>

                        {/* Interactive Visual: Security Scorecard */}
                        <div className="rounded-2xl bg-slate-950/90 border border-white/[0.08] p-3.5 space-y-2 text-xs font-mono shadow-inner">
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5 text-[11px]">
                                    <CheckCircle2 size={13} className="text-emerald-400" />
                                    OWASP Top 10 Hardened
                                </span>
                                <span className="text-[10px] text-emerald-400">PASSED</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5 text-[11px]">
                                    <CheckCircle2 size={13} className="text-emerald-400" />
                                    End-to-End Encryption (AES-256)
                                </span>
                                <span className="text-[10px] text-emerald-400">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5 text-[11px]">
                                    <CheckCircle2 size={13} className="text-emerald-400" />
                                    Zero-Trust JWT Role Auth
                                </span>
                                <span className="text-[10px] text-emerald-400">VERIFIED</span>
                            </div>
                        </div>
                    </m.div>

                    {/* Bento 4: Distributed Databases & Custom ERP (Col 7) */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between group hover:border-white/20 transition-all"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-800/40">
                                    Distributed Database & ERP
                                </span>
                                <Database size={15} className="text-amber-400" />
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                                {isIndo ? 'Database High-Concurrency & Custom ERP Terintegrasi' : 'High-Concurrency Databases & Unified Custom ERP'}
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                                {isIndo
                                    ? 'Gantikan spreadsheet manual yang rapuh dengan custom ERP berbasis PostgreSQL berarsitektur ACID. Transaksi terproteksi, query teroptimasi, dan sinkronisasi real-time antardivisi.'
                                    : 'Replace fragile spreadsheets with robust custom ERPs powered by ACID-compliant PostgreSQL. Multi-tenant ready, high-concurrency safe, and synchronized in real-time.'}
                            </p>
                        </div>

                        {/* Interactive Visual: Live DB Telemetry */}
                        <div className="rounded-2xl bg-slate-950/90 border border-white/[0.08] p-4 font-mono text-xs shadow-inner">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/[0.06] mb-3">
                                <span className="text-slate-300">postgresql://cluster-prod-01</span>
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    Healthy · 50 pool
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-center">
                                <div className="p-2 rounded-lg bg-slate-900 border border-white/[0.04]">
                                    <div className="text-slate-500">Query P99</div>
                                    <div className="text-emerald-400 font-bold text-xs mt-0.5">42ms</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-900 border border-white/[0.04]">
                                    <div className="text-slate-500">Compliance</div>
                                    <div className="text-indigo-300 font-bold text-xs mt-0.5">ACID</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-900 border border-white/[0.04]">
                                    <div className="text-slate-500">Backups</div>
                                    <div className="text-sky-300 font-bold text-xs mt-0.5">Automated</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-900 border border-white/[0.04]">
                                    <div className="text-slate-500">Replication</div>
                                    <div className="text-amber-300 font-bold text-xs mt-0.5">Multi-AZ</div>
                                </div>
                            </div>
                        </div>
                    </m.div>

                </div>

                {/* ======================================================== */}
                {/* PART 2: COMMERCIAL ENGAGEMENT PACKAGES & MODELS */}
                {/* ======================================================== */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                        {isIndo ? 'Model Investasi & Paket Layanan' : 'Engagement Models & Commercial Packages'}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                        {isIndo 
                            ? 'Transparan, tanpa vendor lock-in, dengan kepemilikan 100% source code dan garansi pemeliharaan produksi.'
                            : 'Transparent milestones, no vendor lock-in, with 100% source code ownership and production guarantees.'}
                    </p>
                </div>

                {/* 3 Commercial Package Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {packages.map((pkg, idx) => {
                        const Icon = packageIcons[pkg.id] || Layers
                        const accent = packageAccents[pkg.id] || packageAccents['starter']

                        return (
                            <m.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: idx * 0.12 }}
                                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-slate-900/60 backdrop-blur-xl border ${accent.border} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_40px_-15px_rgba(0,0,0,0.7)]`}
                            >
                                {/* Featured Ribbon for Paket 2 */}
                                {accent.highlight && (
                                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 text-white text-xs font-extrabold tracking-wider uppercase shadow-md shadow-violet-900/50 flex items-center gap-1.5">
                                        <Sparkles size={12} /> {isIndo ? (pkg.badge?.id || 'Pilihan Operasional Utama') : (pkg.badge?.en || 'Top Operational Choice')}
                                    </div>
                                )}

                                <div>
                                    {/* Top Metadata */}
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/[0.08] flex items-center justify-center text-slate-100 shadow-inner">
                                            <Icon size={24} className="text-violet-400" />
                                        </div>
                                        {!accent.highlight && pkg.badge && (
                                            <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border ${accent.badgeBg}`}>
                                                {isIndo ? pkg.badge.id : pkg.badge.en}
                                            </span>
                                        )}
                                    </div>

                                    {/* Package Title & Target */}
                                    <h4 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
                                        {isIndo ? pkg.name.id : pkg.name.en}
                                    </h4>
                                    
                                    <p className="text-xs text-slate-400 mb-6 font-medium">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider">{isIndo ? 'Target' : 'Ideal For'}: </span>
                                        {isIndo ? pkg.target.id : pkg.target.en}
                                    </p>

                                    {/* Price Container */}
                                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.06] mb-6 shadow-inner">
                                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                                            {pkg.id === 'advisory' 
                                                ? (isIndo ? 'Sesi Awal Discovery' : 'Initial Discovery Session') 
                                                : (pkg.id === 'custom-erp' 
                                                    ? (isIndo ? 'Model Investasi Proyek' : 'Investment Model') 
                                                    : (isIndo ? 'Mulai dari' : 'Starting From'))}
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                            {isIndo ? pkg.price.id : pkg.price.en}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 font-mono">
                                            {pkg.id === 'starter' 
                                                ? (isIndo ? 'Tahapan pembayaran per milestone' : 'Milestone-based payments') 
                                                : (pkg.id === 'custom-erp' 
                                                    ? (isIndo ? 'Disesuaikan dengan modul & kompleksitas' : 'Tailored per modules & SLA') 
                                                    : (isIndo ? 'Konsultasi arsitektur 1-on-1' : '1-on-1 architecture advisory'))}
                                        </div>
                                    </div>

                                    {/* Timeline & Revision Scope */}
                                    <div className="grid grid-cols-2 gap-2 mb-6 py-3 px-3.5 rounded-xl bg-slate-950/60 border border-white/[0.06] text-xs font-mono">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Clock size={14} className="text-sky-400 shrink-0" />
                                            <span className="truncate">{isIndo ? pkg.timeline.id : pkg.timeline.en}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <RotateCcw size={14} className="text-violet-400 shrink-0" />
                                            <span className="truncate">{isIndo ? pkg.revisions.id : pkg.revisions.en}</span>
                                        </div>
                                    </div>

                                    {/* Deliverables List */}
                                    <div className="mb-6">
                                        <div className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 font-semibold">
                                            {isIndo ? 'Cakupan & Deliverables:' : 'Deliverables & Scope:'}
                                        </div>
                                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                                            {pkg.deliverables.map((item, dIdx) => (
                                                <li key={dIdx} className="flex items-start gap-2.5 leading-relaxed">
                                                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                                    <span>{isIndo ? item.id : item.en}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Limitations & Exclusions */}
                                    {pkg.limitations && pkg.limitations.length > 0 && (
                                        <div className="mb-6 pt-4 border-t border-white/[0.06]">
                                            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                                                <AlertCircle size={13} className="text-amber-400/80" />
                                                <span>{isIndo ? 'Batasan & Catatan Biaya:' : 'Exclusions & Notes:'}</span>
                                            </div>
                                            <ul className="space-y-1.5 text-xs text-slate-400">
                                                {pkg.limitations.map((limit, lIdx) => (
                                                    <li key={lIdx} className="flex items-start gap-2 leading-normal">
                                                        <span className="text-slate-600 font-bold">•</span>
                                                        <span>{isIndo ? limit.id : limit.en}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Conversion Actions Area */}
                                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                                    {/* Primary Choice Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleSelectPackage(pkg)}
                                        className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-98 shadow-md cursor-pointer ${accent.button}`}
                                        aria-label={`${isIndo ? pkg.ctaText.id : pkg.ctaText.en} - Scroll ke form konsultasi`}
                                    >
                                        <span>{isIndo ? pkg.ctaText.id : pkg.ctaText.en}</span>
                                        <ArrowRight size={16} />
                                    </button>

                                    {/* Contextual WhatsApp Deep-link */}
                                    <a
                                        href={`https://wa.me/6282176012461?text=${encodeURIComponent(isIndo ? pkg.whatsappText : (pkg.whatsappTextEn || pkg.whatsappText))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all min-h-[40px]"
                                        aria-label={`Chat WhatsApp untuk ${isIndo ? pkg.name.id : pkg.name.en}`}
                                    >
                                        <MessageCircle size={15} />
                                        <span>{isIndo ? 'Tanya Langsung via WhatsApp' : 'Direct WhatsApp Inquiry'}</span>
                                    </a>

                                    {/* Deep Link to Detail Page */}
                                    <div className="text-center pt-1">
                                        <Link
                                            to={`/services/${pkg.slug}`}
                                            className="text-xs text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-1 transition-colors"
                                        >
                                            <span>{isIndo ? 'Lihat Spesifikasi & Detail Layanan' : 'View Full Service Scope'}</span>
                                            <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </m.div>
                        )
                    })}
                </div>
            </div>

            {/* Backwards compatibility for PortfolioModal if requested by URL */}
            {activeService && <PortfolioModal serviceKey={activeService} onClose={closeModal} />}
        </section>
    )
}
