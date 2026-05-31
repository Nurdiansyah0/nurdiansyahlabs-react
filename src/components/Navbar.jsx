import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, MessageCircle, Globe, ChevronDown } from 'lucide-react'
import { useLanguage, langNames } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import { getOptimizedImg } from '../utils/imgHelper'

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const { t, lang, setLang, supportedLangs } = useLanguage()
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
        { href: '/blog', label: 'Insights & Tips' },
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
                    height: isSm ? '56px' : '64px',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minHeight: 0 }}>
                        <img
                            src={getOptimizedImg("/assets/logo.svg", { w: 100 })}
                            alt="NurdiansyahLabs Logo"
                            style={{ width: isSm ? '28px' : '36px', height: isSm ? '28px' : '36px' }}
                        />
                        <span style={{
                            fontSize: isSm ? '1.05rem' : '1.4rem',
                            fontWeight: 800, color: '#312e81', letterSpacing: '-0.02em',
                            whiteSpace: 'nowrap',
                        }}>
                            Nurdiansyah<span style={{ color: '#3730a3' }}>Labs</span>
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

                        {/* Language selector */}
                        <div style={{ position: 'relative' }}>
                            <button aria-label="Action button" onClick={() => setLangOpen(!langOpen)} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', borderRadius: '8px',
                                border: '1px solid #e5e7eb', background: '#f9fafb',
                                color: '#374151', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                                minHeight: '36px',
                            }}>
                                <Globe size={14} color="#3730a3" />
                                {lang.toUpperCase()}
                                <ChevronDown size={12} />
                            </button>
                            {langOpen && (
                                <div style={{
                                    position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)', padding: '6px',
                                    width: '200px', maxHeight: '320px', overflowY: 'auto', zIndex: 999,
                                }}>
                                    {supportedLangs.map(code => (
                                        <button aria-label="Action button" key={code} onClick={() => { setLang(code); setLangOpen(false) }}
                                            style={{
                                                display: 'block', width: '100%', textAlign: 'left',
                                                padding: '8px 12px', borderRadius: '8px', border: 'none',
                                                cursor: 'pointer', fontSize: '0.85rem', minHeight: '36px',
                                                fontWeight: lang === code ? 700 : 400,
                                                background: lang === code ? '#eef2ff' : 'transparent',
                                                color: lang === code ? '#4338ca' : '#374151',
                                            }}>
                                            {langNames[code]}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                    <button aria-label="Action button"
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

                    {/* Mobile language selector */}
                    <select aria-label="Select Language"
                        value={lang}
                        onChange={e => setLang(e.target.value)}
                        style={{
                            padding: '10px 12px', borderRadius: '8px',
                            border: '1px solid #e5e7eb', fontSize: '0.9rem',
                            fontWeight: 500, color: '#374151', background: '#f9fafb',
                            minHeight: '44px', width: '100%',
                        }}>
                        {supportedLangs.map(code => (
                            <option key={code} value={code}>{langNames[code]}</option>
                        ))}
                    </select>

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
