import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { 
    Layers, Server, Brain, CheckCircle2, AlertCircle, 
    MessageCircle, ArrowRight, Clock, RotateCcw, ShieldCheck, 
    Sparkles, ExternalLink, Code2, Check, Lock
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import servicesData from '../data/services.json'
import PortfolioModal from './PortfolioModal'

export default function Services() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeService = searchParams.get('service')
    const { lang, t } = useLanguage()
    const { isMobile } = useResponsive()
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
        "description": "Jasa Pembuatan Landing Page Cepat, Web Developer Fullstack ERP, dan Konsultasi Arsitektur Perangkat Lunak di Indonesia.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Batam",
            "addressRegion": "Kepulauan Riau",
            "addressCountry": "ID"
        },
        "priceRange": "Rp 500.000 – Rp 5.000.000+",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Paket Komersial & Layanan Digital NurdiansyahLabs",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Paket 1: Starter Web & Landing Page",
                        "description": "Landing page responsif performa tinggi untuk UMKM dan startup."
                    },
                    "priceCurrency": "IDR",
                    "price": "500000",
                    "url": "https://nurdiansyahlabs.com/services/landing-page"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Paket 2: Custom Web Application & Operational ERP",
                        "description": "Aplikasi web fullstack dan sistem ERP kustom terintegrasi."
                    },
                    "priceCurrency": "IDR",
                    "price": "2500000",
                    "url": "https://nurdiansyahlabs.com/services/web-development"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Paket 3: Technical Architecture Advisory & Enterprise Consultation",
                        "description": "Konsultasi arsitektur sistem, strategi data/AI, dan discovery gratis 30 menit."
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
            border: 'border-slate-800 hover:border-sky-500/50',
            button: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30',
            highlight: false
        },
        'custom-erp': {
            badgeBg: 'bg-indigo-950/90 border-indigo-500/60 text-indigo-300',
            border: 'border-indigo-500/60 shadow-lg shadow-indigo-950/50 hover:border-indigo-400',
            button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40',
            highlight: true
        },
        'advisory': {
            badgeBg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400',
            border: 'border-slate-800 hover:border-emerald-500/50',
            button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30',
            highlight: false
        }
    }

    return (
        <section 
            id="services" 
            className="relative py-20 lg:py-28 bg-[#090D16] text-slate-100 overflow-hidden"
            style={{
                backgroundImage: `
                    radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
                    radial-gradient(circle at 85% 85%, rgba(14, 165, 233, 0.08) 0%, transparent 45%)
                `
            }}
        >
            <script type="application/ld+json">
                {JSON.stringify(schemaMarkup)}
            </script>

            <div className="container relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/50 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-4">
                        <Sparkles size={14} />
                        <span>{isIndo ? 'Paket Layanan & Penawaran Komersial' : 'Commercial Packages & Pricing'}</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-50 tracking-tight leading-[1.15] mb-4">
                        {isIndo ? (
                            <>
                                Pilihan Paket Transparan Sesuai{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                                    Kebutuhan Nyata
                                </span>{' '}
                                Bisnis Anda
                            </>
                        ) : (
                            <>
                                Transparent Packages Tailored to Your{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                                    Real Needs
                                </span>
                            </>
                        )}
                    </h2>

                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                        {isIndo
                            ? 'Tanpa biaya tersembunyi, tanpa taktik urgensi artifisial. Biaya riil dihitung berdasarkan cakupan rekayasa perangkat lunak dan keandalan sistem produksi.'
                            : 'No hidden fees, no artificial urgency tactics. True project pricing calculated from engineering scope and production reliability.'}
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
                                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#101726]/90 backdrop-blur-sm border ${accent.border}`}
                            >
                                {/* Featured Ribbon for Paket 2 */}
                                {accent.highlight && (
                                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 text-white text-xs font-extrabold tracking-wider uppercase shadow-md shadow-indigo-900/50 flex items-center gap-1.5">
                                        <Sparkles size={12} /> {pkg.badge || 'Pilihan Operasional Utama'}
                                    </div>
                                )}

                                <div>
                                    {/* Top Metadata */}
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-100">
                                            <Icon size={24} className="text-indigo-400" />
                                        </div>
                                        {!accent.highlight && pkg.badge && (
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${accent.badgeBg}`}>
                                                {pkg.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Package Title & Target */}
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-50 mb-2 leading-snug">
                                        {pkg.name}
                                    </h3>
                                    
                                    <p className="text-xs text-slate-400 mb-6 font-medium">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider">{isIndo ? 'Target' : 'Ideal For'}: </span>
                                        {pkg.target}
                                    </p>

                                    {/* Price Container */}
                                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 mb-6">
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            {pkg.id === 'advisory' 
                                                ? (isIndo ? 'Sesi Awal Discovery' : 'Initial Discovery Session') 
                                                : (pkg.id === 'custom-erp' 
                                                    ? (isIndo ? 'Model Investasi Proyek' : 'Investment Model') 
                                                    : (isIndo ? 'Mulai dari' : 'Starting From'))}
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-black text-slate-50 tracking-tight">
                                            {pkg.price}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {pkg.id === 'starter' 
                                                ? (isIndo ? 'Tahapan pembayaran per milestone' : 'Milestone-based payments') 
                                                : (pkg.id === 'custom-erp' 
                                                    ? (isIndo ? 'Disesuaikan dengan modul & kompleksitas' : 'Tailored per modules & SLA') 
                                                    : (isIndo ? 'Konsultasi arsitektur 1-on-1' : '1-on-1 architecture advisory'))}
                                        </div>
                                    </div>

                                    {/* Timeline & Revision Scope */}
                                    <div className="grid grid-cols-2 gap-2 mb-6 py-3 px-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Clock size={14} className="text-sky-400 shrink-0" />
                                            <span className="truncate">{pkg.timeline}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <RotateCcw size={14} className="text-indigo-400 shrink-0" />
                                            <span className="truncate">{pkg.revisions}</span>
                                        </div>
                                    </div>

                                    {/* Deliverables List */}
                                    <div className="mb-6">
                                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                                            {isIndo ? 'Cakupan & Deliverables:' : 'Deliverables & Scope:'}
                                        </div>
                                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                                            {pkg.deliverables.map((item, dIdx) => (
                                                <li key={dIdx} className="flex items-start gap-2.5 leading-relaxed">
                                                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Limitations & Exclusions */}
                                    {pkg.limitations && pkg.limitations.length > 0 && (
                                        <div className="mb-6 pt-4 border-t border-slate-800/80">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <AlertCircle size={13} className="text-amber-400/80" />
                                                <span>{isIndo ? 'Batasan & Catatan Biaya:' : 'Exclusions & Notes:'}</span>
                                            </div>
                                            <ul className="space-y-1.5 text-xs text-slate-400">
                                                {pkg.limitations.map((limit, lIdx) => (
                                                    <li key={lIdx} className="flex items-start gap-2 leading-normal">
                                                        <span className="text-slate-600 font-bold">•</span>
                                                        <span>{limit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Conversion Actions Area */}
                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    {/* Primary Choice Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleSelectPackage(pkg)}
                                        className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 transform active:scale-98 shadow-md ${accent.button}`}
                                        aria-label={`${pkg.ctaText} - Scroll ke form konsultasi`}
                                    >
                                        <span>{pkg.ctaText}</span>
                                        <ArrowRight size={16} />
                                    </button>

                                    {/* Contextual WhatsApp Deep-link */}
                                    <a
                                        href={`https://wa.me/6282176012461?text=${encodeURIComponent(pkg.whatsappText)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                                        aria-label={`Chat WhatsApp untuk ${pkg.name}`}
                                    >
                                        <MessageCircle size={15} />
                                        <span>{isIndo ? 'Tanya Langsung via WhatsApp' : 'Direct WhatsApp Inquiry'}</span>
                                    </a>

                                    {/* Deep Link to Detail Page */}
                                    <div className="text-center pt-1">
                                        <Link
                                            to={`/services/${pkg.slug}`}
                                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 transition-colors"
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

                {/* Transparency Commitment & Assurance Banner */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-16 p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 max-w-4xl mx-auto"
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                        <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 shrink-0">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-50 mb-1.5">
                                {isIndo ? 'Standar Rekayasa & Kepastian Komersial NurdiansyahLabs' : 'Engineering Standards & Commercial Assurance'}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                                {isIndo
                                    ? 'Setiap proyek dirancang untuk skalabilitas jangka panjang dengan repositori kode bersih, tanpa keterikatan vendor lock-in, dan kepemilikan penuh diserahkan ke klien.'
                                    : 'Every project is engineered for long-term scalability with clean codebase, zero vendor lock-in, and full client asset ownership.'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-medium">
                                <div className="flex items-center gap-2">
                                    <Check size={14} className="text-emerald-400 shrink-0" />
                                    <span>{isIndo ? '100% Repositori Milik Klien' : '100% Client Code Ownership'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={14} className="text-emerald-400 shrink-0" />
                                    <span>{isIndo ? 'Tanpa Markup Biaya Cloud' : 'Zero Cloud Cost Markups'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={14} className="text-emerald-400 shrink-0" />
                                    <span>{isIndo ? 'Garansi Bug-Fix & SLA SLA' : 'Warranty & Post-Launch SLA'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </m.div>
            </div>

            {/* Backwards compatibility for PortfolioModal if requested by URL */}
            {activeService && <PortfolioModal serviceKey={activeService} onClose={closeModal} />}
        </section>
    )
}
