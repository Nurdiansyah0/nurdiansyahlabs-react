import { useResponsive } from '../hooks/useResponsive'
import { MessageCircle } from 'lucide-react'

export default function ShowcaseLayout({ children, title, subtitle, githubUrl, service, accentColor, isResponsive = false }) {
    const { isMobile, width } = useResponsive()

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

            {/* Minimal Top Header */}
            <div style={{
                background: '#fff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0.5rem 1.5rem',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                minHeight: '48px'
            }}>
                <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{
                    background: '#22c55e', color: '#fff',
                    padding: '6px 16px', borderRadius: '8px',
                    fontWeight: 700, fontSize: '0.82rem',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'background 0.2s'
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
                    onMouseLeave={e => e.currentTarget.style.background = '#22c55e'}>
                    <MessageCircle size={16} />
                    Contact Developer
                </a>
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

            {/* ── Content: wrap in a horizontally-scrollable container on mobile ── */}
            <div style={{
                flex: 1,
                overflowX: isMobile && !isResponsive ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
            }}>
                {isMobile && !isResponsive ? (
                    <div style={{
                        position: 'relative',
                        width: '100%',
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
