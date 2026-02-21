import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function Hero() {
    const { t } = useLanguage()

    return (
        <section style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 100%)',
            color: '#fff', padding: '5rem 0 6rem', position: 'relative', overflow: 'hidden'
        }}>
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'rgba(99,102,241,0.15)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', background: 'rgba(59,130,246,0.12)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }}
            />

            <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(165,180,252,0.3)', padding: '6px 16px', borderRadius: '9999px', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', letterSpacing: '0.04em' }}>
                    <span style={{ width: '6px', height: '6px', background: '#818cf8', borderRadius: '50%', display: 'inline-block' }}></span>
                    {t('hero.badge')}
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
                    {t('hero.h1.1')}<br />
                    <span style={{ color: '#a5b4fc' }}>{t('hero.h1.2')}</span><br />
                    {t('hero.h1.3')}
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#c7d2fe', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                    {t('hero.desc')}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                    <a href="#services" style={{ background: '#fff', color: '#312e81', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s', display: 'inline-block' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0f0ff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}>
                        {t('hero.cta1')}
                    </a>
                    <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{ background: '#22c55e', color: '#fff', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 20px rgba(34,197,94,0.35)', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.transform = 'translateY(0)' }}>
                        <i className="fab fa-whatsapp" style={{ fontSize: '1.1rem' }}></i> {t('hero.cta2')}
                    </a>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                    style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem', marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(165,180,252,0.15)' }}>
                    {[['50+', t('hero.stat1')], ['4', t('hero.stat2')], ['3yrs+', t('hero.stat3')]].map(([num, label]) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a5b4fc' }}>{num}</div>
                            <div style={{ fontSize: '0.85rem', color: '#a5b4fc', marginTop: '2px' }}>{label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
