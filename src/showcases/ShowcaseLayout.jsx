import { useResponsive } from '../hooks/useResponsive'
import { ExternalLink } from 'lucide-react'

export default function ShowcaseLayout({ children }) {
    const { isMobile } = useResponsive()

    return (
        <div style={{ 
            minHeight: '100vh', 
            width: '100%', 
            position: 'relative', 
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden'
        }}>
            
            {/* Fully Responsive App Shell (PWA Compatible) */}
            <main style={{ 
                width: '100%', 
                flex: 1,
                position: 'relative',
                overflowX: 'hidden',
                // Hardware acceleration & momentum scroll for native PWA feel
                WebkitOverflowScrolling: 'touch',
                transform: 'translateZ(0)' // Constrain fixed elements inside viewport
            }}>
                {children}
            </main>

            {/* SEO Hook - Floating Badge to Main Web */}
            <a 
                href="https://nurdiansyahlabs.com" 
                target="_blank" 
                rel="noopener noreferrer dofollow"
                style={{
                    position: 'fixed',
                    bottom: isMobile ? '1rem' : '2rem',
                    right: isMobile ? '1rem' : '2rem',
                    zIndex: 99999, // Ensure it's above everything
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    padding: isMobile ? '10px 14px' : '12px 20px',
                    borderRadius: '100px',
                    fontFamily: '"Inter", sans-serif',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(0, 0, 0, 0.4)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
                    e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                    <span style={{ opacity: 0.85, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Live Project By
                    </span>
                    <span style={{ 
                        background: 'linear-gradient(to right, #60a5fa, #a78bfa)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 900,
                        fontSize: isMobile ? '0.8rem' : '0.95rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Nurdiansyah Labs
                    </span>
                </div>
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '8px', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a78bfa'
                }}>
                    <ExternalLink size={16} strokeWidth={2.5} />
                </div>
            </a>
        </div>
    )
}
