import { m } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'

export default function CTA() {
    const { t } = useLanguage()
    const { isMobile, isSm } = useResponsive()
    return (
        <section id="contact" style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #1e3a8a 100%)',
            color: '#fff', padding: 'var(--section-py) 0',
        }}>
            <m.div
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="container"
                style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    {t('cta.title')}
                </h2>
                <p style={{ color: '#c7d2fe', fontSize: isSm ? '0.95rem' : '1.05rem', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                    {t('cta.desc')}
                </p>
                <a
                    href="https://wa.me/6282176012461"
                    target="_blank" rel="noreferrer"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        background: '#22c55e', color: '#fff',
                        padding: isSm ? '13px 28px' : '16px 36px',
                        borderRadius: '9999px', fontWeight: 700,
                        fontSize: isSm ? '0.95rem' : '1.05rem',
                        boxShadow: '0 8px 32px rgba(34,197,94,0.4)',
                        transition: 'all 0.2s', textDecoration: 'none', minHeight: '44px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'scale(1.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.transform = 'scale(1)' }}>
                    <MessageCircle size={18} style={{ fontSize: '1.3rem' }} />
                    {t('cta.btn')}
                </a>
                <div style={{ marginTop: '1.25rem', color: '#818cf8', fontSize: isSm ? '0.78rem' : '0.85rem' }}>
                    {t('cta.info')}
                </div>
            </m.div>
        </section>
    )
}
