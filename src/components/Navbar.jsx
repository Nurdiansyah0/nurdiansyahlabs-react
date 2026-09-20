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
        { href: '/#services', label: t('nav.services') },
        { href: '/#why-us', label: t('nav.whyUs') },
        { href: '/blog', label: isIndo ? 'Wawasan & Tips' : 'Insights & Tips' },
        { href: '/#contact', label: t('nav.contact') },
    ]

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: scrolled ? 'rgba(255,255,255,0.92)' : '#fff',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.07)' : 'none',
            transition: 'all 0.3s ease',
        }}>
            <div className="container">
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    height: (isMobile || isSm) ? '56px' : '64px',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minHeight: 0 }}>
                        <img
                            src={getOptimizedImg("/assets/logo.svg", { w: 100 })}
                            alt="NurdiansyahLabs Logo"
                            style={{ width: (isMobile || isSm) ? '28px' : '36px', height: (isMobile || isSm) ? '28px' : '36px' }}
                        />
                        <span style={{
                            fontSize: (isMobile || isSm) ? '1.1rem' : '1.35rem',
                            fontWeight: 800, color: '#312e81', letterSpacing: '-0.02em',
                            whiteSpace: 'nowrap',
                        }}>
                            Nurdiansyah<span style={{ color: '#4338ca' }}>Labs</span>
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
                        {links.map(l => (
                            l.href.startsWith('/') && !l.href.includes('#') ? (
                                <Link key={l.href} to={l.href}
                                    style={{ color: '#1f2937', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s', minHeight: 0, textDecoration: 'none' }}
                                    onMouseEnter={e => e.target.style.color = '#4338ca'}
                                    onMouseLeave={e => e.target.style.color = '#1f2937'}>
                                    {l.label}
                                </Link>
                            ) : (
                                <a key={l.href} href={l.href}
                                    style={{ color: '#1f2937', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s', minHeight: 0, textDecoration: 'none' }}
                                    onMouseEnter={e => e.target.style.color = '#4338ca'}
                                    onMouseLeave={e => e.target.style.color = '#1f2937'}>
                                    {l.label}
                                </a>
                            )
                        ))}

                        {/* Language Selector: Instant ID / EN Toggle */}
                        <div
                            role="group"
                            aria-label="Pilihan Bahasa"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '3px',
                                borderRadius: '9999px',
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc',
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
                                    padding: '5px 10px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    background: lang === 'id' ? '#312e81' : 'transparent',
                                    color: lang === 'id' ? '#ffffff' : '#64748b',
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
                                    padding: '5px 10px',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    background: lang === 'en' ? '#312e81' : 'transparent',
                                    color: lang === 'en' ? '#ffffff' : '#64748b',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    lineHeight: 1,
                                }}
                            >
                                <span>🇬🇧</span> EN
                            </button>
                        </div>

                        <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{
                            background: '#166534', color: '#fff', padding: '8px 20px',
                            borderRadius: '9999px', fontWeight: 600, fontSize: '0.9rem',
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            transition: 'background 0.2s', minHeight: 0,
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#166534'}>
                            <MessageCircle size={18} /> WhatsApp
                        </a>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="hamburger-btn"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        style={{
                            padding: '10px', borderRadius: '8px', color: '#374151',
                            background: mobileOpen ? '#f3f4f6' : 'transparent',
                            minHeight: '44px', minWidth: '44px',
                        }}>
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    borderTop: '1px solid #e5e7eb',
                    padding: '1rem',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    background: '#fff',
                }}>
                    {links.map(l => (
                        l.href.startsWith('/') && !l.href.includes('#') ? (
                            <Link
                                key={l.href}
                                to={l.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    color: '#374151', fontWeight: 500, padding: '10px 12px',
                                    borderRadius: '8px', fontSize: '1rem',
                                    display: 'flex', alignItems: 'center',
                                    minHeight: '44px', textDecoration: 'none',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {l.label}
                            </Link>
                        ) : (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    color: '#374151', fontWeight: 500, padding: '10px 12px',
                                    borderRadius: '8px', fontSize: '1rem',
                                    display: 'flex', alignItems: 'center',
                                    minHeight: '44px', textDecoration: 'none',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {l.label}
                            </a>
                        )
                    ))}

                    {/* Mobile Language Selector: Segmented ID / EN */}
                    <div
                        role="group"
                        aria-label="Pilihan Bahasa Mobile"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            padding: '4px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
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
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.88rem',
                                fontWeight: lang === 'id' ? 700 : 500,
                                background: lang === 'id' ? '#312e81' : 'transparent',
                                color: lang === 'id' ? '#ffffff' : '#475569',
                                cursor: 'pointer',
                                minHeight: '40px',
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
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.88rem',
                                fontWeight: lang === 'en' ? 700 : 500,
                                background: lang === 'en' ? '#312e81' : 'transparent',
                                color: lang === 'en' ? '#ffffff' : '#475569',
                                cursor: 'pointer',
                                minHeight: '40px',
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
                            gap: '8px', background: '#166534', color: '#fff',
                            padding: '12px 20px', borderRadius: '9999px', fontWeight: 600,
                            fontSize: '1rem', textAlign: 'center', minHeight: '44px',
                        }}>
                        <MessageCircle size={18} /> WhatsApp
                    </a>
                </div>
            )}
        </nav>
    )
}
