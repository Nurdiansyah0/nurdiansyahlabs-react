import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'

export default function ShowcaseLayout({ children, title, subtitle, githubUrl, service, accentColor }) {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { isMobile, isSm, width } = useResponsive()

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

            {/* ── Top bar ─────────────────────────────────────────── */}
            <div style={{
                background: '#fff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0 1rem',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                flexWrap: isSm ? 'wrap' : 'nowrap',
            }}>
                {/* Left: Back + breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minWidth: 0 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            color: '#64748b', fontWeight: 600,
                            fontSize: isSm ? '0.78rem' : '0.85rem',
                            padding: '6px 10px', borderRadius: '8px',
                            background: '#f1f5f9', border: 'none', cursor: 'pointer',
                            transition: 'background 0.2s', whiteSpace: 'nowrap',
                            minHeight: '36px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                        <i className="fas fa-arrow-left" style={{ fontSize: '0.7rem' }}></i>
                        {t('show.back')}
                    </button>

                    {/* Breadcrumb — hidden on very small screens */}
                    {!isSm && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                            <img src="/assets/logo.svg" alt="Logo" style={{ width: '14px', height: '14px' }} />
                            <span style={{ fontWeight: 700, color: '#64748b' }}>NurdiansyahLabs</span>
                            <i className="fas fa-chevron-right" style={{ fontSize: '0.55rem' }}></i>
                            <span style={{ color: accentColor, fontWeight: 600 }}>{t('show.service')} {service}</span>
                            <i className="fas fa-chevron-right" style={{ fontSize: '0.55rem' }}></i>
                            <span style={{ color: '#1e293b', fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {t('show.liveDemo')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: Live badge + Source + Hire */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{
                        background: '#f0fdf4', color: '#166534',
                        fontSize: '0.65rem', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '9999px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        whiteSpace: 'nowrap',
                    }}>
                        <span style={{ width: '5px', height: '5px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
                        {t('show.liveDemo')}
                    </span>

                    {githubUrl && !isSm && (
                        <a href={githubUrl} target="_blank" rel="noreferrer" style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            color: '#475569', fontSize: '0.75rem', fontWeight: 600,
                            padding: '5px 10px', borderRadius: '8px',
                            border: '1px solid #e2e8f0', textDecoration: 'none',
                            transition: 'all 0.2s', minHeight: '32px',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <i className="fab fa-github"></i>
                            {!isMobile && t('show.source')}
                        </a>
                    )}

                    <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: '#22c55e', color: '#fff',
                        fontSize: isSm ? '0.72rem' : '0.78rem',
                        fontWeight: 700,
                        padding: isSm ? '5px 10px' : '6px 12px',
                        borderRadius: '8px', textDecoration: 'none',
                        whiteSpace: 'nowrap', minHeight: '32px',
                    }}>
                        <i className="fab fa-whatsapp"></i>
                        {isSm ? 'Hire' : t('show.hireMe')}
                    </a>
                </div>
            </div>

            {/* ── Page header ──────────────────────────────────────── */}
            <div style={{
                background: `linear-gradient(135deg, ${accentColor}15 0%, #fff 100%)`,
                padding: isMobile ? '1.25rem 1rem' : '2rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(1.1rem, 4vw, 2rem)',
                        fontWeight: 800, color: '#0f172a', marginBottom: '3px',
                        lineHeight: 1.3,
                    }}>
                        {title}
                    </h1>
                    <p style={{ color: '#64748b', fontSize: isMobile ? '0.8rem' : '0.95rem' }}>{subtitle}</p>
                </div>
            </div>

            {/* ── Mobile notice ─────────────────────────────────────── */}
            {isMobile && (
                <div style={{
                    background: '#fffbeb',
                    borderBottom: '1px solid #fde68a',
                    padding: '0.6rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.75rem',
                    color: '#92400e',
                }}>
                    <i className="fas fa-desktop" style={{ flexShrink: 0 }}></i>
                    <span>This is a <strong>desktop mockup</strong> — pinch to zoom or rotate your device for the best view.</span>
                </div>
            )}

            {/* ── Content: wrap in a horizontally-scrollable container on mobile ── */}
            <div style={{
                flex: 1,
                overflowX: isMobile ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
            }}>
                {/*
                  On mobile we render the showcase inside a 1024px-wide scaled
                  container so the desktop mockup is always readable without
                  breaking the surrounding page layout.
                */}
                {isMobile ? (
                    /*
                      Scale the 1024-wide desktop mockup to fit the current
                      mobile viewport. We use a "scale-wrapper" pattern:
                      1. Outer div: sets the rendered height via paddingBottom so
                         the page doesn't collapse.
                      2. Inner div: fixed 1024px wide, transformed to scale down.
                    */
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        // paddingBottom creates height proportional to the scaled content
                        // We don't know inner height upfront, so we let content overflow
                        overflow: 'hidden',
                    }}>
                        <div
                            style={{
                                width: '1024px',
                                transform: `scale(${width / 1024})`,
                                transformOrigin: 'top left',
                            }}
                        >
                            {children}
                        </div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    )
}
