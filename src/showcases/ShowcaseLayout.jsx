import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function ShowcaseLayout({ children, title, subtitle, githubUrl, service, accentColor }) {
    const navigate = useNavigate()
    const { t } = useLanguage()

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            {/* Top bar */}
            <div style={{
                background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 1.5rem',
                height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigate(-1)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b',
                        fontWeight: 600, fontSize: '0.85rem', padding: '6px 12px', borderRadius: '8px',
                        background: '#f1f5f9', border: 'none', cursor: 'pointer', transition: 'background 0.2s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                        <i className="fas fa-arrow-left" style={{ fontSize: '0.75rem' }}></i> {t('show.back')}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.8rem' }}>
                        <img src="/assets/logo.svg" alt="Logo" style={{ width: '16px', height: '16px' }} />
                        <span style={{ fontWeight: 700, color: '#64748b' }}>NurdiansyahLabs</span>
                        <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
                        <span style={{ color: accentColor, fontWeight: 600 }}>{t('show.service')} {service}</span>
                        <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
                        <span style={{ color: '#1e293b', fontWeight: 600 }}>{t('show.liveDemo')}</span>
                    </div>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                        background: '#f0fdf4', color: '#166534', fontSize: '0.7rem', fontWeight: 700,
                        padding: '3px 10px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                        <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
                        {t('show.liveDemo')}
                    </span>
                    {githubUrl && (
                        <a href={githubUrl} target="_blank" rel="noreferrer" style={{
                            display: 'flex', alignItems: 'center', gap: '6px', color: '#475569',
                            fontSize: '0.8rem', fontWeight: 600, padding: '5px 12px', borderRadius: '8px',
                            border: '1px solid #e2e8f0', textDecoration: 'none', transition: 'all 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <i className="fab fa-github"></i> {t('show.source')}
                        </a>
                    )}
                    <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: '6px', background: '#22c55e', color: '#fff',
                        fontSize: '0.8rem', fontWeight: 700, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none'
                    }}>
                        <i className="fab fa-whatsapp"></i> {t('show.hireMe')}
                    </a>
                </div>
            </div>

            {/* Page header */}
            <div style={{ background: `linear-gradient(135deg, ${accentColor}15 0%, #fff 100%)`, padding: '2rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{title}</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{subtitle}</p>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    )
}
