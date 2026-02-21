import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()
    return (
        <footer style={{ background: '#111827', color: '#9ca3af', padding: '2rem 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="container footer-inner">
                {/* Brand */}
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/assets/logo-dark.svg" alt="NurdiansyahLabs Logo" style={{ width: '26px', height: '26px' }} />
                    <span>Nurdiansyah<span style={{ color: '#818cf8' }}>Labs</span></span>
                </div>
                {/* Copyright */}
                <div style={{ fontSize: '0.82rem' }}>
                    {t('footer.copy')}
                </div>
                {/* Social icons */}
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer"
                        aria-label="Contact us on WhatsApp"
                        style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => e.target.style.color = '#4ade80'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fab fa-whatsapp"></i>
                    </a>
                    <a href="mailto:nudiansyahdian28.adv@gmail.com"
                        aria-label="Email Us"
                        style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => e.target.style.color = '#f87171'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://github.com/Nurdiansyah0" target="_blank" rel="noreferrer"
                        aria-label="GitHub Profile"
                        style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => e.target.style.color = '#818cf8'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/nurdiansyah-ds" target="_blank" rel="noreferrer"
                        aria-label="LinkedIn Profile"
                        style={{ color: '#9ca3af', fontSize: '1.15rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => e.target.style.color = '#60a5fa'}
                        onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
            </motion.div>
        </footer>
    )
}
