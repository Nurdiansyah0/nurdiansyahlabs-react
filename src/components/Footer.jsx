import { m } from 'framer-motion'
import { MessageCircle, Mail, Github, Linkedin } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
    const { t } = useLanguage()
    return (
        <footer style={{ background: '#0B0F17', color: '#9CA3AF', padding: '2.5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <m.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="container footer-inner">
                {/* Brand */}
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/assets/logo.svg" alt="NurdiansyahLabs Logo" style={{ width: '26px', height: '26px' }} />
                    <span>Nurdiansyah<span style={{ color: '#818CF8' }}>Labs</span></span>
                </div>
                {/* Copyright & Live Deploy Status */}
                <div style={{ fontSize: '0.85rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span>{t('footer.copy')}</span>
                    <a href="https://github.com/Nurdiansyah0/nurdiansyahlabs-react/actions" target="_blank" rel="noreferrer" title="Live CI/CD Pipeline Status" style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '4px' }}>
                        <img 
                            src="https://github.com/Nurdiansyah0/nurdiansyahlabs-react/actions/workflows/deploy.yml/badge.svg" 
                            alt="Deploy Status" 
                            style={{ height: '20px', borderRadius: '4px' }} 
                        />
                    </a>
                </div>
                {/* Social icons */}
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer"
                        aria-label="Contact us on WhatsApp"
                        style={{ color: '#9CA3AF', fontSize: '1.15rem', transition: 'color 0.2s, transform 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#4ADE80'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.transform = 'none'; }}
                        onFocus={e => { e.currentTarget.style.color = '#4ADE80'; }}
                        onBlur={e => { e.currentTarget.style.color = '#9CA3AF'; }}>
                        <MessageCircle size={18} />
                    </a>
                    <a href="mailto:nudiansyahdian28.adv@gmail.com"
                        aria-label="Email Us"
                        style={{ color: '#9CA3AF', fontSize: '1.15rem', transition: 'color 0.2s, transform 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#F87171'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.transform = 'none'; }}
                        onFocus={e => { e.currentTarget.style.color = '#F87171'; }}
                        onBlur={e => { e.currentTarget.style.color = '#9CA3AF'; }}>
                        <Mail size={18} />
                    </a>
                    <a href="https://github.com/Nurdiansyah0" target="_blank" rel="noreferrer"
                        aria-label="GitHub Profile"
                        style={{ color: '#9CA3AF', fontSize: '1.15rem', transition: 'color 0.2s, transform 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#A5B4FC'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.transform = 'none'; }}
                        onFocus={e => { e.currentTarget.style.color = '#A5B4FC'; }}
                        onBlur={e => { e.currentTarget.style.color = '#9CA3AF'; }}>
                        <Github size={18} />
                    </a>
                    <a href="https://www.linkedin.com/in/nurdiansyah-ds" target="_blank" rel="noreferrer"
                        aria-label="LinkedIn Profile"
                        style={{ color: '#9CA3AF', fontSize: '1.15rem', transition: 'color 0.2s, transform 0.2s', display: 'inline-flex', alignItems: 'center', minHeight: '44px' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#60A5FA'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.transform = 'none'; }}
                        onFocus={e => { e.currentTarget.style.color = '#60A5FA'; }}
                        onBlur={e => { e.currentTarget.style.color = '#9CA3AF'; }}>
                        <Linkedin size={18} />
                    </a>
                </div>
            </m.div>
        </footer>
    )
}
