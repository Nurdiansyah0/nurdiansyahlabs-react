import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, MessageCircle } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import { getOptimizedImg } from '../utils/imgHelper'

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { t, lang, setLang, isIndo } = useLanguage()
    const { isMobile, isSm } = useResponsive()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close mobile menu on route/hash change
    useEffect(() => {
        if (!mobileOpen) return
        const close = () => setMobileOpen(false)
        window.addEventListener('hashchange', close)
        return () => window.removeEventListener('hashchange', close)
    }, [mobileOpen])

    const links = [
        { href: '/#showcase', label: isIndo ? 'Showcase Sistem' : 'System Showcase' },
        { href: '/#services', label: t('nav.services') },
        { href: '/#why-us', label: t('nav.whyUs') },
        { href: '/blog', label: isIndo ? 'Wawasan & Tips' : 'Insights & Tips' },
        { href: '/#contact', label: t('nav.contact') },
    ]

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: scrolled ? 'rgba(7, 8, 13, 0.85)' : 'rgba(7, 8, 13, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.03)',
            boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.8)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
            <div className="container">
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    height: (isMobile || isSm) ? '58px' : '68px',
                }}>
                    {/* Logo & Studio Tag */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minHeight: 0 }}>
                        <img
                            src={getOptimizedImg("/assets/logo.svg", { w: 100 })}
                            alt="NurdiansyahLabs Logo"
                            style={{ 
                                width: (isMobile || isSm) ? '28px' : '34px', 
                                height: (isMobile || isSm) ? '28px' : '34px',
                                filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))'
                            }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                fontSize: (isMobile || isSm) ? '1.15rem' : '1.3rem',
                                fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em',
                                whiteSpace: 'nowrap',
                            }}>
                                Nurdiansyah<span style={{ color: '#818cf8' }}>Labs</span>
                            </span>
                            <span 
                                className="hidden sm:inline-flex font-mono"
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    color: '#c4b5fd',
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    border: '1px solid rgba(167, 139, 250, 0.3)',
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                }}
                            >
                                STUDIO
                            </span>
                        </div>
                    </Link>

                    {/* Desktop links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
                        {links.map(l => (
                            l.href.startsWith('/') && !l.href.includes('#') ? (
                                <Link key={l.href} to={l.href}
                                    style={{ 
                                        color: '#94a3b8', 
                                        fontWeight: 500, 
                                        fontSize: '0.88rem', 
                                        transition: 'color 0.2s', 
                                        minHeight: 0, 
                                        textDecoration: 'none',
                                        letterSpacing: '0.01em'
                                    }}
                                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                                    onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                                    {l.label}
                                </Link>
                            ) : (
                                <a key={l.href} href={l.href}
                                    style={{ 
                                        color: '#94a3b8', 
                                        fontWeight: 500, 
                                        fontSize: '0.88rem', 
                                        transition: 'color 0.2s', 
                                        minHeight: 0, 
                                        textDecoration: 'none',
                                        letterSpacing: '0.01em'
                                    }}
                                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                                    onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                                    {l.label}
                                </a>
                            )
                        ))}

                        {/* Language Selector: Segmented Dark Control */}
                        <div
                            role="group"
                            aria-label="Pilihan Bahasa"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '3px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'rgba(255, 255, 255, 0.04)',
                                gap: '2px',
                            }}
                        >
                            <button
                                type="button"
                                aria-label="Bahasa Indonesia"
                                onClick={() => setLang('id')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 9px',
                                    borderRadius: '9999px',
                                    border: lang === 'id' ? '1px solid rgba(167, 139, 250, 0.35)' : '1px solid transparent',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: lang === 'id' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                    color: lang === 'id' ? '#ffffff' : '#94a3b8',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    lineHeight: 1,
                                }}
                            >
                                <span>🇮🇩</span> ID
                            </button>
                            <button
                                type="button"
                                aria-label="English"
                                onClick={() => setLang('en')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 9px',
                                    borderRadius: '9999px',
                                    border: lang === 'en' ? '1px solid rgba(167, 139, 250, 0.35)' : '1px solid transparent',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: lang === 'en' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                    color: lang === 'en' ? '#ffffff' : '#94a3b8',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    lineHeight: 1,
                                }}
                            >
                                <span>🇬🇧</span> EN
                            </button>
                        </div>

                        {/* WhatsApp CTA Button with Specular Inner Border */}
                        <a 
                            href="https://wa.me/6282176012461" 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{
                                background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
                                color: '#ffffff',
                                padding: '8px 18px',
                                borderRadius: '9999px',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 15px rgba(22, 163, 74, 0.3)',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                minHeight: 0,
                                textDecoration: 'none'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-1px)'
                                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 6px 20px rgba(22, 163, 74, 0.4)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 15px rgba(22, 163, 74, 0.3)'
                            }}
                        >
                            <MessageCircle size={16} />
                            <span>{isIndo ? 'Konsultasi' : 'Discovery'}</span>
                        </a>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="hamburger-btn"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            background: mobileOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '40px',
                            minWidth: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}>
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu drawer */}
            {mobileOpen && (
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '1.25rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    background: 'rgba(7, 8, 13, 0.98)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    width: '100%',
                    maxWidth: '100vw',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
                }}>
                    {links.map(l => (
                        l.href.startsWith('/') && !l.href.includes('#') ? (
                            <Link
                                key={l.href}
                                to={l.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    color: '#e2e8f0',
                                    fontWeight: 500,
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: '44px',
                                    textDecoration: 'none',
                                    transition: 'background 0.15s, color 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                                    e.currentTarget.style.color = '#ffffff'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.color = '#e2e8f0'
                                }}
                            >
                                {l.label}
                            </Link>
                        ) : (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    color: '#e2e8f0',
                                    fontWeight: 500,
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: '44px',
                                    textDecoration: 'none',
                                    transition: 'background 0.15s, color 0.15s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                                    e.currentTarget.style.color = '#ffffff'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.color = '#e2e8f0'
                                }}
                            >
                                {l.label}
                            </a>
                        )
                    ))}

                    {/* Mobile Language Selector */}
                    <div
                        role="group"
                        aria-label="Pilihan Bahasa Mobile"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '6px',
                            padding: '4px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            width: '100%',
                            boxSizing: 'border-box',
                            marginTop: '0.5rem',
                            marginBottom: '0.5rem'
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setLang('id')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '10px 6px',
                                borderRadius: '8px',
                                border: lang === 'id' ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid transparent',
                                fontSize: '0.85rem',
                                fontWeight: lang === 'id' ? 700 : 500,
                                background: lang === 'id' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                color: lang === 'id' ? '#ffffff' : '#94a3b8',
                                cursor: 'pointer',
                                minHeight: '44px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span>🇮🇩</span> Indonesia (ID)
                        </button>
                        <button
                            type="button"
                            onClick={() => setLang('en')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '10px 6px',
                                borderRadius: '8px',
                                border: lang === 'en' ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid transparent',
                                fontSize: '0.85rem',
                                fontWeight: lang === 'en' ? 700 : 500,
                                background: lang === 'en' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                color: lang === 'en' ? '#ffffff' : '#94a3b8',
                                cursor: 'pointer',
                                minHeight: '44px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span>🇬🇧</span> English (EN)
                        </button>
                    </div>

                    <a
                        href="https://wa.me/6282176012461"
                        target="_blank" rel="noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', 
                            background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', 
                            color: '#fff',
                            padding: '12px 20px', 
                            borderRadius: '12px', 
                            fontWeight: 600,
                            fontSize: '0.95rem', 
                            textAlign: 'center', 
                            minHeight: '44px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 15px rgba(22, 163, 74, 0.3)',
                            textDecoration: 'none'
                        }}>
                        <MessageCircle size={18} />
                        <span>{isIndo ? 'Konsultasi WhatsApp 1-on-1' : 'WhatsApp 1-on-1 Discovery'}</span>
                    </a>
                </div>
            )}
        </nav>
    )
}
