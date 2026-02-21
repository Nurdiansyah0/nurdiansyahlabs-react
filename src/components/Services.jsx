import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import PortfolioModal from './PortfolioModal'

const services = [
    {
        key: 'A', icon: 'fa-layer-group', iconBg: '#dbeafe', iconColor: '#1d4ed8', accentColor: '#1d4ed8',
        badgeBg: '#eff6ff', badgeColor: '#1d4ed8', priceIDR: 1750000, priceNote: '',
        tTitle: 'svc.a.title', tTagline: 'svc.a.tagline',
        tFeatures: ['svc.a.f1', 'svc.a.f2', 'svc.a.f3', 'svc.a.f4'], tIdeal: 'svc.a.ideal',
    },
    {
        key: 'B', icon: 'fa-code', iconBg: '#e0e7ff', iconColor: '#4338ca', accentColor: '#4338ca',
        badgeBg: '#eef2ff', badgeColor: '#4338ca', priceIDR: 5000000, priceNote: '',
        tTitle: 'svc.b.title', tTagline: 'svc.b.tagline',
        tFeatures: ['svc.b.f1', 'svc.b.f2', 'svc.b.f3', 'svc.b.f4'], tIdeal: 'svc.b.ideal',
    },
    {
        key: 'C', icon: 'fa-chart-pie', iconBg: '#d1fae5', iconColor: '#059669', accentColor: '#059669',
        badgeBg: '#ecfdf5', badgeColor: '#059669', priceIDR: 3000000, priceNote: 'svc.perMonth',
        tTitle: 'svc.c.title', tTagline: 'svc.c.tagline',
        tFeatures: ['svc.c.f1', 'svc.c.f2', 'svc.c.f3', 'svc.c.f4'], tIdeal: 'svc.c.ideal',
    },
    {
        key: 'D', icon: 'fa-brain', iconBg: '#ede9fe', iconColor: '#7c3aed', accentColor: '#7c3aed',
        badgeBg: '#f5f3ff', badgeColor: '#7c3aed', priceIDR: 4500000, priceNote: 'svc.perMonth',
        tTitle: 'svc.d.title', tTagline: 'svc.d.tagline',
        tFeatures: ['svc.d.f1', 'svc.d.f2', 'svc.d.f3', 'svc.d.f4'], tIdeal: 'svc.d.ideal',
    },
]

function ServiceCard({ service, onClick, index, t, formatCurrency }) {
    const [hovered, setHovered] = useState(false)
    return (
        <motion.div onClick={onClick}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            role="button" tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
            style={{
                background: '#fff', borderRadius: '20px', padding: '1.5rem',
                border: `1.5px solid ${hovered ? service.accentColor + '40' : '#e5e7eb'}`,
                boxShadow: hovered ? `0 20px 40px -10px ${service.accentColor}22` : '0 2px 12px rgba(0,0,0,0.04)',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.25s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%'
            }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: service.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <i className={`fas ${service.icon}`} style={{ fontSize: '1.2rem', color: service.iconColor }}></i>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827', marginBottom: '4px' }}>{t(service.tTitle)}</h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic', marginBottom: '0.75rem' }}>{t(service.tTagline)}</p>
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t('svc.startingFrom')}</div>
                <div style={{ fontWeight: 800, fontSize: '1.35rem', color: service.accentColor }}>
                    {formatCurrency(service.priceIDR)} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#6b7280' }}>{service.priceNote ? t(service.priceNote) : ''}</span>
                </div>
            </div>
            <ul style={{ listStyle: 'none', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                {service.tFeatures.map(fKey => (
                    <li key={fKey} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#374151' }}>
                        <i className="fas fa-check-circle" style={{ color: '#22c55e', marginTop: '2px', flexShrink: 0 }}></i>
                        {t(fKey)}
                    </li>
                ))}
            </ul>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('svc.idealFor')}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f2937', marginTop: '2px' }}>{t(service.tIdeal)}</div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: service.badgeBg, color: service.badgeColor, padding: '5px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content' }}>
                <i className="fas fa-images"></i> {t('svc.viewExamples')}
            </div>
        </motion.div>
    )
}

export default function Services() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeService = searchParams.get('service')
    const { t, formatCurrency } = useLanguage()

    const openModal = (key) => {
        setSearchParams({ service: key })
    }

    const closeModal = () => {
        searchParams.delete('service')
        setSearchParams(searchParams)
    }

    return (
        <section id="services" style={{ padding: '5rem 0', background: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {t('svc.title')}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{t('svc.subtitle')}</p>
                    <p style={{ color: '#4f46e5', fontSize: '0.85rem', fontWeight: 500 }}>
                        <i className="fas fa-hand-pointer" style={{ marginRight: '4px' }}></i>
                        {t('svc.hint')}
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {services.map((s, idx) => (
                        <ServiceCard key={s.key} service={s} onClick={() => openModal(s.key)} index={idx} t={t} formatCurrency={formatCurrency} />
                    ))}
                </div>
            </div>
            {activeService && <PortfolioModal serviceKey={activeService} onClose={closeModal} />}
        </section>
    )
}
