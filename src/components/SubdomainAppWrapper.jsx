import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { MessageCircle, ExternalLink, ChevronDown, ChevronUp, Sparkles, CheckCircle2, X, ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useTracker } from '../hooks/useTracker'

// Subdomain configurations for each application (Marketing 5.0 Enhanced Context)
export const SUBDOMAIN_APPS = {
    rental: {
        id: 'rental',
        subdomains: ['rental', 'batamrentalmobil', 'mobil'],
        title: 'Batam Car Rental - Sistem Booking & Lepas Kunci Online | NurdiansyahLabs',
        description: 'Prototipe sistem rental mobil modern: otomatisasi booking online, manajemen armada lepas kunci, live price scraping, dan invoice instan.',
        componentName: 'BatamRentalMobilApp',
        ctaText: {
            id: 'Konsultasi Sistem Rental',
            en: 'Consult Rental System'
        },
        valueProp: {
            id: 'Sistem booking armada otomatis & lepas kunci online untuk bisnis rental mobil.',
            en: 'Automated fleet booking & keyless rental system built for car rental businesses.'
        },
        valuePillars: {
            id: '⚡ 7-14 Hari Jadi • Source Code 100% Milik Anda • Garansi Pendampingan',
            en: '⚡ 7-14 Days Ready • 100% Client Code Ownership • Full Warranty'
        },
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo sistem di rental.nurdiansyahlabs.com. Saya tertarik membuat aplikasi rental mobil serupa untuk bisnis saya. Bisakah diskusi spesifikasi dan estimasi biayanya?',
        badgeColor: '#003399',
        tag: 'Rental Mobil & Transportasi'
    },
    pos: {
        id: 'pos',
        subdomains: ['pos', 'koperasi', 'kasir'],
        title: 'Koperasi ARFF & Retail POS - Sistem Kasir & Inventori Modern | NurdiansyahLabs',
        description: 'Prototipe sistem kasir Point of Sale (POS) modern untuk koperasi dan toko retail: manajemen stok otomatis, saldo anggota, dan cetak invoice.',
        componentName: 'KoperasiPOSApp',
        ctaText: {
            id: 'Konsultasi Software Kasir',
            en: 'Consult POS & Inventory'
        },
        valueProp: {
            id: 'Sistem kasir multi-cabang, barcode scanner, dan laporan laba-rugi otomatis tanpa biaya bulanan.',
            en: 'Multi-branch POS cashier, barcode scanner, and automated P&L reporting with zero monthly fees.'
        },
        valuePillars: {
            id: '⚡ Multi-Kasir • Offline-First • Bebas Biaya Bulanan Selamanya',
            en: '⚡ Multi-Register • Offline-First • Zero Monthly Recurring Fees'
        },
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di pos.nurdiansyahlabs.com. Saya tertarik membuat software kasir POS & manajemen stok untuk toko/koperasi saya. Bisakah diskusi spesifikasi dan fiturnya?',
        badgeColor: '#312e81',
        tag: 'Point of Sale & Retail'
    },
    clinic: {
        id: 'clinic',
        subdomains: ['clinic', 'klinik', 'medika'],
        title: 'Klinik Medika Analytics - Dashboard Rekam Medis & Farmasi | NurdiansyahLabs',
        description: 'Prototipe dashboard analytics klinik kesehatan: monitoring kunjungan pasien, diagnosis teratas, efisiensi dokter, dan kontrol stok obat.',
        componentName: 'ClinicAnalyticsApp',
        ctaText: {
            id: 'Konsultasi Dashboard Medis',
            en: 'Consult Clinic Analytics'
        },
        valueProp: {
            id: 'Dashboard visualisasi antrean pasien, utilisasi dokter, dan analitik farmasi terintegrasi.',
            en: 'Interactive patient flow visualization, doctor utilization, and integrated pharmacy analytics.'
        },
        valuePillars: {
            id: '⚡ Standar Rekam Medis • Dashboard Real-Time • Visualisasi Tableau/Web',
            en: '⚡ EMR Ready • Real-Time Dashboard • Tableau/Web Visualization'
        },
        waMessage: 'Halo NurdiansyahLabs, saya melihat demo dashboard di clinic.nurdiansyahlabs.com. Saya ingin konsultasi sistem analytics rekam medis dan manajemen operasional klinik kesehatan saya.',
        badgeColor: '#065f46',
        tag: 'Healthcare & Analytics'
    },
    laptop: {
        id: 'laptop',
        subdomains: ['laptop', 'tokolaptop', 'komputer'],
        title: 'Toko Laptop Batam - Katalog & E-Commerce Gadget | NurdiansyahLabs',
        description: 'Prototipe website katalog spesifikasi laptop dan komputer dengan filter performa, perbandingan harga, dan checkout langsung via WhatsApp.',
        componentName: 'TokoLaptopBatamApp',
        ctaText: {
            id: 'Konsultasi Katalog E-Commerce',
            en: 'Consult E-Commerce Catalog'
        },
        valueProp: {
            id: 'Website katalog produk dengan filter spesifikasi canggih dan checkout WhatsApp instan.',
            en: 'High-performance gadget spec catalog with advanced filtering and 1-tap WhatsApp checkout.'
        },
        valuePillars: {
            id: '⚡ Super Cepat di HP • SEO E-Commerce • Checkout 1-Klik',
            en: '⚡ Mobile-First Speed • E-Commerce SEO • 1-Click WhatsApp Order'
        },
        waMessage: 'Halo NurdiansyahLabs, saya melihat demo di laptop.nurdiansyahlabs.com. Saya tertarik membuat website katalog produk elektronik dengan pemesanan langsung WhatsApp.',
        badgeColor: '#1e3a8a',
        tag: 'E-Commerce & Katalog Produk'
    },
    warung: {
        id: 'warung',
        subdomains: ['warung', 'resto', 'kuliner', 'cafe'],
        title: 'Warung Makan & Resto - Menu Digital & Kasir Meja | NurdiansyahLabs',
        description: 'Prototipe sistem pemesanan makanan, menu digital QR meja, dan manajemen kasir dapur untuk warung makan, restoran, dan coffee shop.',
        componentName: 'WarungMakanApp',
        ctaText: {
            id: 'Konsultasi Menu QR & Kasir',
            en: 'Consult QR Menu & POS'
        },
        valueProp: {
            id: 'Menu digital QR meja tanpa download aplikasi, printer dapur, dan rekap omzet harian.',
            en: 'App-free table QR digital menu, kitchen thermal printer routing, and daily revenue recap.'
        },
        valuePillars: {
            id: '⚡ Scan QR Instan • Tanpa Potongan Komisi • Langsung Terhubung Dapur',
            en: '⚡ Instant QR Scan • 0% Commission Cut • Direct Kitchen Order Routing'
        },
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo menu di warung.nurdiansyahlabs.com. Saya tertarik menerapkan menu digital QR dan sistem kasir meja untuk usaha kuliner saya.',
        badgeColor: '#b45309',
        tag: 'F&B & Menu Digital'
    },
    hr: {
        id: 'hr',
        subdomains: ['hr', 'absensi', 'payroll', 'karyawan'],
        title: 'HR & Absensi Karyawan - Sistem Monitoring Tim Online | NurdiansyahLabs',
        description: 'Prototipe aplikasi absensi karyawan online, pengajuan cuti, rekap kehadiran departemen, dan data staf untuk perusahaan & kantor UMKM.',
        componentName: 'AttendanceApp',
        ctaText: {
            id: 'Konsultasi Portal HR & Absensi',
            en: 'Consult HR & Attendance'
        },
        valueProp: {
            id: 'Presensi online dengan validasi GPS selfie anti-fake GPS, rekap cuti, dan ekspor payroll.',
            en: 'Online staff attendance with anti-fake GPS selfie validation, leave tracking, and payroll export.'
        },
        valuePillars: {
            id: '⚡ Anti-Fake GPS • Rekap Otomatis Excel • Mendukung Kantor Multi-Cabang',
            en: '⚡ Anti-Fake GPS • Auto Excel Reports • Multi-Branch Office Support'
        },
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di hr.nurdiansyahlabs.com. Saya tertarik membangun portal absensi online dan rekap HR untuk staf perusahaan saya.',
        badgeColor: '#0f766e',
        tag: 'HR & Absensi Karyawan'
    }
}

export function detectSubdomainApp() {
    if (typeof window === 'undefined') return null

    const hostname = window.location.hostname.toLowerCase()
    const searchParams = new URLSearchParams(window.location.search)

    // 1. Allow URL query parameter override for testing: ?app=rental or ?subdomain=pos
    const queryOverride = (searchParams.get('app') || searchParams.get('subdomain') || '').toLowerCase()
    if (queryOverride) {
        for (const [key, app] of Object.entries(SUBDOMAIN_APPS)) {
            if (key === queryOverride || app.subdomains.includes(queryOverride)) {
                return app
            }
        }
    }

    // 2. Parse hostname subdomain (e.g. rental.nurdiansyahlabs.com or rental.localhost)
    const parts = hostname.split('.')
    if (parts.length >= 2) {
        const sub = parts[0]
        for (const app of Object.values(SUBDOMAIN_APPS)) {
            if (app.subdomains.includes(sub)) {
                return app
            }
        }
    }

    return null
}

export default function SubdomainAppWrapper({ app, children }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showPredictiveNudge, setShowPredictiveNudge] = useState(false)
    const { isIndo } = useLanguage()
    const { trackEvent } = useTracker()

    const ctaLabel = app.ctaText ? (isIndo ? app.ctaText.id : app.ctaText.en) : (isIndo ? 'Konsultasi Solusi Ini' : 'Consult Solution')
    const valueProp = app.valueProp ? (isIndo ? app.valueProp.id : app.valueProp.en) : ''
    const valuePillars = app.valuePillars ? (isIndo ? app.valuePillars.id : app.valuePillars.en) : ''
    const waLink = `https://wa.me/6282176012461?text=${encodeURIComponent(app.waMessage)}`

    // Marketing 5.0 - Data-Driven Telemetry: Log demo view & engagement dwell time
    useEffect(() => {
        trackEvent('subdomain_demo_view', { app: app.id, tag: app.tag })

        // Trigger engaged telemetry & non-intrusive predictive nudge after 22 seconds
        const timer = setTimeout(() => {
            trackEvent('subdomain_demo_engaged', { app: app.id, duration_sec: 22 })
            setShowPredictiveNudge(true)
        }, 22000)

        return () => clearTimeout(timer)
    }, [app.id, app.tag, trackEvent])

    const handleWhatsAppClick = (source = 'top_banner') => {
        trackEvent('subdomain_whatsapp_click', {
            app: app.id,
            source,
            cta: ctaLabel
        })
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: '#0a0f1d' }}>
            <Helmet>
                <title>{app.title}</title>
                <meta name="description" content={app.description} />
                <link rel="canonical" href={`https://${app.id}.nurdiansyahlabs.com/`} />
                <meta property="og:title" content={app.title} />
                <meta property="og:description" content={app.description} />
                <meta property="og:url" content={`https://${app.id}.nurdiansyahlabs.com/`} />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Floating Top Banner / Marketing 5.0 Value Hub */}
            <header 
                role="banner"
                aria-label="NurdiansyahLabs Prototype Banner"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 99999,
                    background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{
                    maxWidth: '1440px',
                    margin: '0 auto',
                    padding: isCollapsed ? '0.4rem 1rem' : '0.65rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                }}>
                    {/* Left: Studio Branding & Dynamic Industry Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: app.badgeColor || '#3730a3',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}>
                            <Sparkles size={12} /> {isIndo ? 'Prototipe Interaktif' : 'Live Interactive Demo'}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                            {app.tag}
                        </span>
                    </div>

                    {/* Middle: Marketing 5.0 Contextual Value Proposition & Trust Anchors */}
                    {!isCollapsed && (
                        <div style={{
                            fontSize: '0.82rem',
                            color: '#cbd5e1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            maxWidth: '620px'
                        }}>
                            <span style={{ color: '#f8fafc', fontWeight: 500 }}>
                                {valueProp}
                            </span>
                            {valuePillars && (
                                <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
                                    {valuePillars}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Right: Contextual CTAs (Bionic Frontline Hand-off) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleWhatsAppClick('top_banner')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#166534',
                                color: '#ffffff',
                                padding: '0.45rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                boxShadow: '0 2px 10px rgba(22, 101, 52, 0.45)',
                                transition: 'all 0.2s',
                                border: '1px solid rgba(74, 222, 128, 0.3)'
                            }}
                        >
                            <MessageCircle size={15} />
                            <span>{ctaLabel}</span>
                        </a>

                        <a
                            href="https://nurdiansyahlabs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            title={isIndo ? 'Buka Website Utama NurdiansyahLabs' : 'Open NurdiansyahLabs Main Website'}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#cbd5e1',
                                padding: '0.45rem 0.75rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                border: '1px solid rgba(255, 255, 255, 0.12)'
                            }}
                        >
                            <span>NurdiansyahLabs</span>
                            <ExternalLink size={12} />
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            aria-label={isCollapsed
                                ? (isIndo ? 'Perbesar Banner' : 'Expand Banner')
                                : (isIndo ? 'Perkecil Banner' : 'Collapse Banner')}
                            title={isCollapsed
                                ? (isIndo ? 'Perbesar Banner' : 'Expand Banner')
                                : (isIndo ? 'Perkecil Banner' : 'Collapse Banner')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                padding: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Render Application Body */}
            <main style={{ minHeight: 'calc(100vh - 50px)' }}>
                {children}
            </main>

            {/* Marketing 5.0 - Predictive / Bionic Consultative Floating Nudge */}
            {showPredictiveNudge && (
                <aside
                    aria-label="Consultation nudge"
                    style={{
                        position: 'fixed',
                        bottom: 'max(1rem, calc(0.75rem + env(safe-area-inset-bottom)))',
                        right: 'max(1rem, calc(0.75rem + env(safe-area-inset-right)))',
                        left: 'auto',
                        zIndex: 99998,
                        maxWidth: 'min(360px, calc(100vw - 2rem))',
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '16px',
                        padding: '1rem 1.15rem',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
                        fontFamily: "'Inter', sans-serif",
                        color: '#f8fafc',
                        animation: 'fadeInUp 0.4s ease-out'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#38bdf8' }}><Sparkles size={16} /></span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                                {isIndo ? 'Kustomisasi untuk Bisnis Anda?' : 'Customize for Your Business?'}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPredictiveNudge(false)}
                            aria-label="Tutup notifikasi"
                            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        >
                            <X size={15} />
                        </button>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                        {isIndo
                            ? `Ingin alur ${app.tag} seperti ini disesuaikan dengan SOP, logo, dan kebutuhan operasional perusahaan Anda?`
                            : `Want this ${app.tag} workflow tailored to your company's SOP and branding?`}
                    </p>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleWhatsAppClick('floating_nudge')}
                            style={{
                                flex: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
                                color: '#ffffff',
                                padding: '0.5rem 0.85rem',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(22, 101, 52, 0.35)'
                            }}
                        >
                            <MessageCircle size={14} />
                            <span>{isIndo ? 'Konsultasi 1-on-1' : '1-on-1 Consultation'}</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setShowPredictiveNudge(false)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#94a3b8',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            {isIndo ? 'Nanti' : 'Later'}
                        </button>
                    </div>
                </aside>
            )}
        </div>
    )
}
