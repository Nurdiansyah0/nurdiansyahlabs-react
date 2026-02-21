import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()
    return (
        <footer style={{ background: '#111827', color: '#9ca3af', padding: '2.5rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/assets/logo-dark.svg" alt="NurdiansyahLabs Logo" style={{ width: '28px', height: '28px' }} />
                    <span>Nurdiansyah<span style={{ color: '#818cf8' }}>Labs</span></span>
                </div>
                <div style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                    {t('footer.copy')}
                </div>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#4ade80'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fab fa-whatsapp"></i>
                    </a>
                    <a href="mailto:nudiansyahdian28.adv@gmail.com" style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#f87171'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://github.com/Nurdiansyah0" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#818cf8'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/nurdiansyah-ds" target="_blank" rel="noreferrer" style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#60a5fa'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
            </motion.div>
        </footer>
    )
}
