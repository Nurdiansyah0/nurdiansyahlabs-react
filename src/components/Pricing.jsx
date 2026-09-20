import { m } from 'framer-motion'
import { CheckCircle2, X, MessageCircle, ArrowRight, Sparkles, Building2, Cpu } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useTracker } from '../hooks/useTracker'

const WA_NUMBER = '6282176012461'

function PricingCard({ pkg, index, isIndo, trackEvent }) {
    const waMessage = encodeURIComponent(
        isIndo
            ? `Halo, saya tertarik dengan ${pkg.name[isIndo ? 'id' : 'en']}. Boleh saya tahu lebih lanjut?`
            : `Hi, I'm interested in the ${pkg.name['en']} package. Can I get more details?`
    )

    return (
        <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            style={{
                background: pkg.featured
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(15,23,42,0.95) 100%)'
                    : 'rgba(15, 23, 42, 0.7)',
                border: pkg.featured
                    ? '1.5px solid rgba(129, 140, 248, 0.55)'
                    : '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '1.25rem',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
            }}
            className="p-7 flex-1 min-w-0"
        >
            {/* Featured glow */}
            {pkg.featured && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'radial-gradient(circle at 60% 0%, rgba(99,102,241,0.18) 0%, transparent 60%)',
                    }}
                />
            )}

            {/* Badge */}
            {pkg.badge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide mb-4 self-start"
                    style={{
                        background: pkg.featured ? 'rgba(99,102,241,0.25)' : 'rgba(16,185,129,0.15)',
                        color: pkg.featured ? '#a5b4fc' : '#34d399',
                        border: pkg.featured ? '1px solid rgba(129,140,248,0.3)' : '1px solid rgba(52,211,153,0.25)',
                    }}
                >
                    {pkg.featured ? <Sparkles size={11} /> : pkg.icon}
                    <span>{isIndo ? pkg.badge.id : pkg.badge.en}</span>
                </div>
            )}

            {/* Package Name */}
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                {isIndo ? pkg.label.id : pkg.label.en}
            </div>
            <h3 className="text-lg font-extrabold text-slate-50 leading-tight mb-1">
                {isIndo ? pkg.name.id : pkg.name.en}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
                {isIndo ? pkg.idealFor.id : pkg.idealFor.en}
            </p>

            {/* Price */}
            <div className="mb-5 pb-5 border-b border-slate-800/80">
                <div className="text-2xl font-black text-slate-50 tracking-tight">
                    {isIndo ? pkg.price.id : pkg.price.en}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                    {isIndo ? pkg.paymentNote.id : pkg.paymentNote.en}
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <span className="text-indigo-400">⏱</span>
                        {isIndo ? pkg.timeline.id : pkg.timeline.en}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="text-emerald-400">↻</span>
                        {isIndo ? pkg.revisions.id : pkg.revisions.en}
                    </span>
                </div>
            </div>

            {/* Deliverables */}
            <div className="mb-4 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    {isIndo ? 'Termasuk dalam Paket' : 'Deliverables & Scope'}
                </div>
                <ul className="space-y-2">
                    {pkg.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{isIndo ? item.id : item.en}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Exclusions */}
            <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    {isIndo ? 'Tidak Termasuk' : 'Exclusions'}
                </div>
                <ul className="space-y-1.5">
                    {pkg.exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                            <X size={12} className="text-slate-600 shrink-0 mt-0.5" />
                            <span>{isIndo ? item.id : item.en}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-auto">
                <a
                    href={`#contact`}
                    onClick={() => trackEvent('pricing_cta_primary', { package: pkg.id })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all min-h-[44px]"
                    style={{
                        background: pkg.featured
                            ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            : 'rgba(99,102,241,0.15)',
                        color: '#e0e7ff',
                        border: pkg.featured ? 'none' : '1px solid rgba(99,102,241,0.3)',
                        boxShadow: pkg.featured ? '0 6px 20px -4px rgba(99,102,241,0.45)' : 'none',
                    }}
                >
                    <span>{isIndo ? pkg.cta.primary.id : pkg.cta.primary.en}</span>
                    <ArrowRight size={15} />
                </a>
                <a
                    href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('pricing_wa_click', { package: pkg.id })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:text-emerald-400 hover:bg-slate-800/40 transition-all"
                >
                    <MessageCircle size={14} className="text-emerald-500" />
                    <span>{isIndo ? 'Tanya via WhatsApp' : 'Ask on WhatsApp'}</span>
                </a>
            </div>
        </m.div>
    )
}

const PACKAGES = [
    {
        id: 'starter',
        featured: false,
        icon: <Building2 size={11} />,
        badge: { id: 'Paket Starter', en: 'Starter Package' },
        label: { id: 'Paket 1', en: 'Package 1' },
        name: {
            id: 'Landing Page & Website Bisnis Profesional',
            en: 'Professional Landing Page & Business Website',
        },
        idealFor: {
            id: 'Ideal untuk: UMKM, startup, toko online, jasa profesional',
            en: 'Ideal for: SMEs, startups, online stores, professional services',
        },
        price: { id: 'Mulai Rp 500.000', en: 'From Rp 500,000' },
        paymentNote: { id: 'Pembayaran berbasis milestone', en: 'Milestone-based payments' },
        timeline: { id: '3–7 hari kerja', en: '3–7 working days' },
        revisions: { id: '2x revisi minor', en: '2x minor revisions' },
        deliverables: [
            {
                id: 'Desain responsif mobile-first (target < 1s load time)',
                en: 'Mobile-first responsive design (< 1s load time target)',
            },
            {
                id: 'Integrasi WhatsApp direct CTA dengan pesan dinamis',
                en: 'WhatsApp direct CTA integration with dynamic message',
            },
            {
                id: 'Lead capture inquiry form terhubung email',
                en: 'Lead capture inquiry form connected to email',
            },
            {
                id: 'Pondasi basic technical SEO & Google Analytics 4',
                en: 'Basic technical SEO foundation & Google Analytics 4',
            },
            {
                id: 'Deployment ke hosting & setup sertifikat SSL HTTPS',
                en: 'Deployment to hosting & SSL HTTPS certificate setup',
            },
        ],
        exclusions: [
            {
                id: 'Biaya domain & hosting recurring ditanggung klien',
                en: 'Domain & recurring hosting costs borne by client',
            },
            {
                id: 'Tidak mencakup custom database atau auth login user',
                en: 'Does not include custom database or user login auth',
            },
        ],
        cta: {
            primary: { id: 'Pilih Paket Starter', en: 'Choose Starter Package' },
        },
    },
    {
        id: 'erp',
        featured: true,
        icon: null,
        badge: { id: 'Paling Diminati', en: 'Most Popular' },
        label: { id: 'Paket 2', en: 'Package 2' },
        name: {
            id: 'Custom Web Application & Sistem ERP Operasional',
            en: 'Custom Web Application & Operational ERP System',
        },
        idealFor: {
            id: 'Ideal untuk: bisnis berkembang, multi-cabang, pertanian/retail/logistik',
            en: 'Ideal for: Growing business, multi-branch, agriculture/retail/logistics',
        },
        price: { id: 'Sesuai Cakupan Proyek (Mulai Rp 2.500.000)', en: 'Project-Scoped (From Rp 2,500,000)' },
        paymentNote: { id: 'Disesuaikan per modul & SLA', en: 'Tailored per modules & SLA' },
        timeline: { id: '3–8 minggu (sprint mingguan)', en: '3–8 weeks (weekly sprints)' },
        revisions: { id: 'Sesuai milestone & kesepakatan scope', en: 'Per milestone & agreed scope' },
        deliverables: [
            {
                id: 'Arsitektur modular scalable (React 18 + Python Flask + PostgreSQL)',
                en: 'Modular scalable architecture (React 18 + Python Flask + PostgreSQL)',
            },
            {
                id: 'Role-Based Access Control multi-level (Admin, Manajer, Kasir)',
                en: 'Multi-level Role-Based Access Control (Admin, Manager, Cashier)',
            },
            {
                id: 'Dashboard operasional real-time & KPI bisnis terintegrasi',
                en: 'Real-time operational dashboard & integrated business KPI',
            },
            {
                id: 'Database relasional teroptimasi dengan automated backup',
                en: 'Optimized relational database with automated backup',
            },
            {
                id: 'Ekspor PDF faktur, rekap Excel/CSV, & integrasi WhatsApp',
                en: 'PDF invoice export, Excel/CSV recap, & WhatsApp integration',
            },
            {
                id: 'Garansi 30 hari bug-fix & SLA support purna jual',
                en: '30-day bug-fix warranty & post-sale SLA support',
            },
        ],
        exclusions: [
            {
                id: 'Biaya server VPS/cloud hosting & API pihak ketiga ditanggung klien',
                en: 'VPS/cloud server & third-party API costs borne by client',
            },
            {
                id: 'Fitur tambahan di luar scope disepakati per change order',
                en: 'Features beyond agreed scope handled via change order',
            },
        ],
        cta: {
            primary: { id: 'Minta Penawaran ERP', en: 'Request ERP Proposal' },
        },
    },
    {
        id: 'enterprise',
        featured: false,
        icon: <Cpu size={11} />,
        badge: { id: 'Discovery Gratis', en: 'Free Discovery' },
        label: { id: 'Paket 3', en: 'Package 3' },
        name: {
            id: 'Konsultasi Arsitektur Teknis & Enterprise Advisory',
            en: 'Technical Architecture Advisory & Enterprise Consultation',
        },
        idealFor: {
            id: 'Ideal untuk: CTO, product manager, tech leader',
            en: 'Ideal for: CTOs, product managers, tech leaders',
        },
        price: { id: 'Konsultasi & Penawaran Khusus (Gratis Sesi Discovery 30 Menit)', en: 'Custom Consultation & Proposal (Free 30-Min Discovery)' },
        paymentNote: { id: 'Advisory 1-on-1 sesuai SOW', en: '1-on-1 advisory per agreed SOW' },
        timeline: { id: 'Sesi 30 menit; Audit 3–5 hari kerja', en: '30-min session; Audit 3–5 working days' },
        revisions: { id: 'Sesuai scope perjanjian SOW', en: 'Per agreed SOW scope' },
        deliverables: [
            {
                id: 'Sesi discovery teknis 1-on-1 selama 30 menit (Google Meet / Zoom)',
                en: '30-minute 1-on-1 technical discovery session (Google Meet / Zoom)',
            },
            {
                id: 'Audit arsitektur sistem, analisis query bottleneck, & SQL security',
                en: 'System architecture audit, query bottleneck analysis, & SQL security',
            },
            {
                id: 'Roadmap modernisasi teknologi & strategi pipeline data/AI',
                en: 'Technology modernization roadmap & data/AI pipeline strategy',
            },
            {
                id: 'Rekomendasi optimasi performa backend & mitigasi technical debt',
                en: 'Backend performance optimization recommendations & technical debt mitigation',
            },
            {
                id: 'Penyusunan penawaran custom SOW terstruktur sesuai kebutuhan',
                en: 'Structured custom SOW proposal tailored to your requirements',
            },
        ],
        exclusions: [
            {
                id: 'Implementasi teknis tidak termasuk dalam sesi discovery',
                en: 'Technical implementation not included in discovery session',
            },
            {
                id: 'Pengerjaan lanjutan disepakati dalam SOW terpisah',
                en: 'Follow-up work agreed in a separate SOW',
            },
        ],
        cta: {
            primary: { id: 'Mulai Discovery 1-on-1 Gratis', en: 'Start Free 1-on-1 Discovery' },
        },
    },
]

export default function Pricing() {
    const { lang } = useLanguage()
    const { trackEvent } = useTracker()
    const isIndo = lang === 'id'

    return (
        <section
            id="pricing"
            className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
            style={{
                background: 'linear-gradient(180deg, #0F172A 0%, #0B0F17 50%, #0F172A 100%)',
                color: '#F8FAFC',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
        >
            {/* Ambient glow */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 30%, rgba(6, 182, 212, 0.07) 0%, transparent 50%),
                        linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
                }}
            />

            <div className="container relative z-10">
                {/* Header */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4">
                        <Sparkles size={13} />
                        <span>{isIndo ? 'Paket Layanan & Investasi' : 'Service Packages & Investment'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-50 tracking-tight leading-tight mb-3">
                        {isIndo ? (
                            <>
                                Pilih Paket yang{' '}
                                <span style={{ color: '#818cf8' }}>Sesuai Kebutuhan</span>{' '}
                                Bisnis Anda
                            </>
                        ) : (
                            <>
                                Choose the Package that{' '}
                                <span style={{ color: '#818cf8' }}>Fits Your Business</span>{' '}
                                Needs
                            </>
                        )}
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
                        {isIndo
                            ? 'Semua paket dimulai dengan konsultasi gratis. Tidak ada biaya tersembunyi — harga transparan, scope jelas, SLA tertulis.'
                            : 'Every package starts with a free consultation. No hidden fees — transparent pricing, clear scope, written SLA.'}
                    </p>
                </m.div>

                {/* Cards */}
                <div className="flex flex-col lg:flex-row gap-5 items-stretch">
                    {PACKAGES.map((pkg, i) => (
                        <PricingCard
                            key={pkg.id}
                            pkg={pkg}
                            index={i}
                            isIndo={isIndo}
                            trackEvent={trackEvent}
                        />
                    ))}
                </div>

                {/* Bottom Trust Note */}
                <m.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 text-center text-xs text-slate-500"
                >
                    {isIndo
                        ? '✓ Semua paket termasuk konsultasi awal gratis  ·  ✓ Tidak ada lock-in kontrak jangka panjang  ·  ✓ Pembayaran bertahap berbasis milestone'
                        : '✓ All packages include a free initial consultation  ·  ✓ No long-term contract lock-in  ·  ✓ Phased milestone-based payments'}
                </m.div>
            </div>
        </section>
    )
}
