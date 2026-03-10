import { useResponsive } from '../hooks/useResponsive'
import { MessageCircle } from 'lucide-react'

export default function ShowcaseLayout({ children, title, subtitle, githubUrl, service, accentColor, isResponsive = false }) {
    const { isMobile, width } = useResponsive()

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

            {/* Floating Contact Button */}
            <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{
                position: 'fixed',
                bottom: isMobile ? '1.5rem' : '2rem',
                right: isMobile ? '1.5rem' : '2rem',
                zIndex: 1000,
                background: '#22c55e', color: '#fff',
                padding: '12px 20px', borderRadius: '50px',
                fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = '#16a34a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = '#22c55e';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                }}>
                <MessageCircle size={20} />
                Contact Developer
            </a>

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
