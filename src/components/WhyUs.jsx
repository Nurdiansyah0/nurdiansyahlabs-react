import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const beliefs = [
    { icon: 'fa-clock', tTitle: 'why.1.title', tDesc: 'why.1.desc' },
    { icon: 'fa-wallet', tTitle: 'why.2.title', tDesc: 'why.2.desc' },
    { icon: 'fa-cubes', tTitle: 'why.3.title', tDesc: 'why.3.desc' },
]

export default function WhyUs() {
    const { t } = useLanguage()
    return (
        <section id="why-us" style={{ padding: '5rem 0', background: '#f9fafb' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        {t('why.title')}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>{t('why.subtitle')}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                    {beliefs.map((b, idx) => (
                        <motion.div key={b.tTitle}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                            style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                                <i className={`fas ${b.icon}`} style={{ fontSize: '1.5rem', color: '#4338ca' }}></i>
                            </div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: '#111827', marginBottom: '0.75rem' }}>{t(b.tTitle)}</h3>
                            <p style={{ color: '#6b7280', lineHeight: 1.7, fontSize: '0.95rem' }}>{t(b.tDesc)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
