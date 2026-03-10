import { m } from 'framer-motion'
import { MessageCircle, Mail } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import ContactForm from './ContactForm'

export default function CTA() {
    const { t } = useLanguage()
    const { isMobile, isSm } = useResponsive()

    return (
        <section id="contact" style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #1e3a8a 100%)',
            color: '#fff', padding: 'var(--section-py) 0',
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '3rem' : '4rem',
                    alignItems: 'center'
                }}>
                    {/* Left Column: Text & Direct Contact */}
                    <m.div
                        initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}
                    >
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            {t('cta.title')}
                        </h2>
                        <p style={{ color: '#c7d2fe', fontSize: isSm ? '1rem' : '1.1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                            {t('cta.desc')}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                            <a
                                href="https://wa.me/6282176012461"
                                target="_blank" rel="noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                                    background: '#22c55e', color: '#fff',
                                    padding: '14px 28px', borderRadius: '9999px', fontWeight: 700,
                                    boxShadow: '0 8px 32px rgba(34,197,94,0.4)',
                                    transition: 'all 0.2s', textDecoration: 'none'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'scale(1.04)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.transform = 'scale(1)' }}>
                                <MessageCircle size={20} />
                                {t('cta.btn')}
                            </a>
                            <a
                                href="mailto:admin@nurdiansyahlabs.com"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                                    background: 'rgba(255,255,255,0.1)', color: '#fff',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '14px 28px', borderRadius: '9999px', fontWeight: 600,
                                    transition: 'all 0.2s', textDecoration: 'none'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}>
                                <Mail size={20} />
                                {t('cta.emailBtn')}
                            </a>
                        </div>

                        <div style={{ color: '#818cf8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }} />
                            {t('cta.info')}
                        </div>
                    </m.div>

                    {/* Right Column: Contact Form */}
                    <m.div
                        initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <ContactForm />
                    </m.div>
                </div>
            </div>
        </section>
    )
}
