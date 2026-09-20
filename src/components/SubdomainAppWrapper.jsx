import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MessageCircle, ExternalLink, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

// Subdomain configurations for each application
export const SUBDOMAIN_APPS = {
    rental: {
        id: 'rental',
        subdomains: ['rental', 'batamrentalmobil', 'mobil'],
        title: 'Batam Car Rental - Sistem Booking & Lepas Kunci Online',
        description: 'Prototipe aplikasi pemesanan dan rental mobil profesional di Batam. Dilengkapi fitur lepas kunci, armada lengkap, dan antar-jemput bandara.',
        componentName: 'BatamRentalMobilApp',
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di rental.nurdiansyahlabs.com dan tertarik membuat aplikasi rental mobil serupa untuk bisnis saya.',
        badgeColor: '#003399',
        tag: 'Rental Mobil & Transportasi'
    },
    pos: {
        id: 'pos',
        subdomains: ['pos', 'koperasi', 'kasir'],
        title: 'Koperasi ARFF & Retail POS - Sistem Kasir & Inventori Modern',
        description: 'Prototipe sistem kasir Point of Sale (POS) modern untuk koperasi dan toko retail: manajemen stok otomatis, saldo anggota, dan cetak invoice.',
        componentName: 'KoperasiPOSApp',
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di pos.nurdiansyahlabs.com dan tertarik membuat sistem kasir POS / inventori toko untuk bisnis saya.',
        badgeColor: '#312e81',
        tag: 'Point of Sale & Retail'
    },
    clinic: {
        id: 'clinic',
        subdomains: ['clinic', 'klinik', 'medika'],
        title: 'Klinik Medika Analytics - Dashboard Rekam Medis & Farmasi',
        description: 'Prototipe dashboard analytics klinik kesehatan: monitoring kunjungan pasien, diagnosis teratas, efisiensi dokter, dan kontrol stok obat.',
        componentName: 'ClinicAnalyticsApp',
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di clinic.nurdiansyahlabs.com dan tertarik membuat dashboard analytics / sistem rekam medis untuk klinik saya.',
        badgeColor: '#065f46',
        tag: 'Healthcare & Analytics'
    },
    laptop: {
        id: 'laptop',
        subdomains: ['laptop', 'tokolaptop', 'komputer'],
        title: 'Toko Laptop Batam - Katalog & E-Commerce Gadget',
        description: 'Prototipe website katalog spesifikasi laptop dan komputer dengan filter performa, perbandingan harga, dan checkout langsung via WhatsApp.',
        componentName: 'TokoLaptopBatamApp',
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di laptop.nurdiansyahlabs.com dan tertarik membuat website katalog toko komputer/elektronik untuk usaha saya.',
        badgeColor: '#1e3a8a',
        tag: 'E-Commerce & Katalog Produk'
    },
    warung: {
        id: 'warung',
        subdomains: ['warung', 'resto', 'kuliner', 'cafe'],
        title: 'Warung Makan & Resto - Menu Digital & Kasir Meja',
        description: 'Prototipe sistem pemesanan makanan, menu digital QR meja, dan manajemen kasir dapur untuk warung makan, restoran, dan coffee shop.',
        componentName: 'WarungMakanApp',
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di warung.nurdiansyahlabs.com dan tertarik membuat sistem menu digital & kasir resto untuk usaha kuliner saya.',
        badgeColor: '#b45309',
        tag: 'F&B & Menu Digital'
    },
    hr: {
        id: 'hr',
        subdomains: ['hr', 'absensi', 'payroll', 'karyawan'],
        title: 'HR & Absensi Karyawan - Sistem Monitoring Tim Online',
        description: 'Prototipe aplikasi absensi karyawan online, pengajuan cuti, rekap kehadiran departemen, dan data staf untuk perusahaan & kantor UMKM.',
        componentName: 'AttendanceApp',
        waMessage: 'Halo NurdiansyahLabs, saya mencoba demo di hr.nurdiansyahlabs.com dan tertarik membuat aplikasi absensi & HR karyawan untuk kantor saya.',
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
    const waLink = `https://wa.me/6282176012461?text=${encodeURIComponent(app.waMessage)}`

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Helmet>
                <title>{app.title}</title>
                <meta name="description" content={app.description} />
                <meta property="og:title" content={app.title} />
                <meta property="og:description" content={app.description} />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Floating Top Banner / Lead Magnet */}
            <header 
                role="banner"
                aria-label="NurdiansyahLabs Prototype Banner"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 99999,
                    background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%)',
                    color: '#ffffff',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: isCollapsed ? '0.4rem 1rem' : '0.65rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                }}>
                    {/* Left: Studio Branding & Tag */}
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
                            textTransform: 'uppercase'
                        }}>
                            <Sparkles size={12} /> Live Prototype
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>
                            {app.tag}
                        </span>
                    </div>

                    {/* Middle: Value Proposition (Hidden on very narrow mobile when collapsed) */}
                    {!isCollapsed && (
                        <div style={{
                            fontSize: '0.82rem',
                            color: '#cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span>Ingin membuat sistem kustom seperti ini untuk bisnis Anda?</span>
                        </div>
                    )}

                    {/* Right: CTAs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
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
                                boxShadow: '0 2px 8px rgba(22, 101, 52, 0.4)',
                                transition: 'background 0.2s'
                            }}
                        >
                            <MessageCircle size={15} />
                            <span>Pesan via WhatsApp</span>
                        </a>

                        <a
                            href="https://nurdiansyahlabs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka Website Utama NurdiansyahLabs"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: '#cbd5e1',
                                padding: '0.45rem 0.75rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <span>NurdiansyahLabs</span>
                            <ExternalLink size={12} />
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            aria-label={isCollapsed ? 'Perbesar Banner' : 'Perkecil Banner'}
                            title={isCollapsed ? 'Perbesar Banner' : 'Perkecil Banner'}
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

            {/* Render Application */}
            <main style={{ minHeight: 'calc(100vh - 50px)' }}>
                {children}
            </main>
        </div>
    )
}
