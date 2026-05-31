import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { m } from 'framer-motion'
import { Layers, Code, PieChart, Brain, CheckCircle, Images, MousePointerClick } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import PortfolioModal from './PortfolioModal'

const services = [
    {
        key: 'A', icon: Layers, iconBg: '#dbeafe', iconColor: '#1e3a8a', accentColor: '#1e3a8a',
        badgeBg: '#eff6ff', badgeColor: '#1e3a8a', priceIDR: 1750000, priceNote: '',
        tTitle: 'svc.a.title', tTagline: 'svc.a.tagline',
        tFeatures: ['svc.a.f1', 'svc.a.f2', 'svc.a.f3', 'svc.a.f4'], tIdeal: 'svc.a.ideal',
    },
    {
        key: 'B', icon: Code, iconBg: '#e0e7ff', iconColor: '#4338ca', accentColor: '#4338ca',
        badgeBg: '#eef2ff', badgeColor: '#4338ca', priceIDR: 5000000, priceNote: '',
        tTitle: 'svc.b.title', tTagline: 'svc.b.tagline',
        tFeatures: ['svc.b.f1', 'svc.b.f2', 'svc.b.f3', 'svc.b.f4'], tIdeal: 'svc.b.ideal',
    },
    {
        key: 'C', icon: PieChart, iconBg: '#d1fae5', iconColor: '#065f46', accentColor: '#065f46',
        badgeBg: '#ecfdf5', badgeColor: '#065f46', priceIDR: 3000000, priceNote: 'svc.perMonth',
        tTitle: 'svc.c.title', tTagline: 'svc.c.tagline',
        tFeatures: ['svc.c.f1', 'svc.c.f2', 'svc.c.f3', 'svc.c.f4'], tIdeal: 'svc.c.ideal',
    },
    {
        key: 'D', icon: Brain, iconBg: '#ede9fe', iconColor: '#5b21b6', accentColor: '#5b21b6',
        badgeBg: '#f5f3ff', badgeColor: '#5b21b6', priceIDR: 4500000, priceNote: 'svc.perMonth',
        tTitle: 'svc.d.title', tTagline: 'svc.d.tagline',
        tFeatures: ['svc.d.f1', 'svc.d.f2', 'svc.d.f3', 'svc.d.f4'], tIdeal: 'svc.d.ideal',
    },
]

function ServiceCard({ service, onClick, index, t, formatCurrency, isMobile }) {
    const [hovered, setHovered] = useState(false)
    return (
        <m.div
            onClick={onClick}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="button" tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
            style={{
                background: '#fff', borderRadius: '20px',
                padding: 'var(--card-padding)',
                border: `1.5px solid ${hovered ? service.accentColor + '40' : '#e5e7eb'}`,
                boxShadow: hovered ? `0 20px 40px -10px ${service.accentColor}22` : '0 2px 12px rgba(0,0,0,0.04)',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.25s ease', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', height: '100%',
            }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: service.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                <service.icon size={22} color={service.iconColor} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '3px' }}>{t(service.tTitle)}</h3>
            <p style={{ fontSize: '0.78rem', color: '#1f2937', fontStyle: 'italic', marginBottom: '0.65rem' }}>{t(service.tTagline)}</p>
            <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#1f2937' }}>{t('svc.startingFrom')}</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: service.accentColor }}>
                    {formatCurrency(service.priceIDR)}{' '}
                    <span style={{ fontSize: '0.78rem', fontWeight: 400, color: '#6b7280' }}>
                        {service.priceNote ? t(service.priceNote) : ''}
                    </span>
                </div>
            </div>
            <ul style={{ listStyle: 'none', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '0.85rem' }}>
                {service.tFeatures.map(fKey => (
                    <li key={fKey} style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: '#374151', alignItems: 'flex-start' }}>
                        <CheckCircle size={16} style={{ color: '#166534', marginTop: '2px', flexShrink: 0 }} />
                        {t(fKey)}
                    </li>
                ))}
            </ul>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.65rem', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('svc.idealFor')}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1f2937', marginTop: '2px' }}>{t(service.tIdeal)}</div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: service.badgeBg, color: service.badgeColor, padding: '5px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, width: 'fit-content' }}>
                <Images size={16} /> {t('svc.viewExamples')}
            </div>
        </m.div>
    )
}

export default function Services() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeService = searchParams.get('service')
    const { t, formatCurrency } = useLanguage()
    const { isMobile } = useResponsive()

    const openModal = (key) => setSearchParams({ service: key })
    const closeModal = () => { searchParams.delete('service'); setSearchParams(searchParams) }

    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "NurdiansyahLabs",
        "url": "https://nurdiansyahlabs.com",
        "image": "https://nurdiansyahlabs.com/assets/android-chrome-512x512.png",
        "description": "Jasa Web Developer Profesional dan Data Analyst di Indonesia.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "ID"
        },
        "priceRange": "$$$",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Layanan Digital NurdiansyahLabs",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Jasa Pembuatan Landing Page",
                        "description": "Solusi Landing Page SEO Friendly dan responsif untuk konversi maksimal."
                    },
                    "priceCurrency": "IDR",
                    "price": "1750000"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Jasa Fullstack Web Development",
                        "description": "Pembuatan website kustom, dashboard sistem informasi, dan e-commerce."
                    },
                    "priceCurrency": "IDR",
                    "price": "5000000"
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Jasa Data Analyst",
                        "description": "Pembuatan Dashboard interaktif dengan Power BI & Tableau untuk bisnis."
                    },
                    "priceCurrency": "IDR",
                    "price": "3000000"
                }
            ]
        }
    };

    return (
        <section id="services" style={{ padding: 'var(--section-py) 0', background: '#fff' }}>
            <script type="application/ld+json">
                {JSON.stringify(schemaMarkup)}
            </script>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '3.5rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {t('svc.title')}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1.05rem', marginBottom: '0.5rem' }}>{t('svc.subtitle')}</p>
                    <p style={{ color: '#3730a3', fontSize: '0.82rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <MousePointerClick size={20} />
                        {t('svc.hint')}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {services.map((s, idx) => (
                        <ServiceCard
                            key={s.key}
                            service={s}
                            onClick={() => openModal(s.key)}
                            index={idx}
                            t={t}
                            formatCurrency={formatCurrency}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </div>
            {activeService && <PortfolioModal serviceKey={activeService} onClose={closeModal} />}
        </section>
    )
}
