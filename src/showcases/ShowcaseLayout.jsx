import { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'
import { ExternalLink, Layers, Server, Database, Code, Cpu } from 'lucide-react'

export default function ShowcaseLayout({ children, techStack }) {
    const { isMobile } = useResponsive()
    const [showStack, setShowStack] = useState(false)

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

                {/* SEO Hook - Floating Badge to Main Web */}
                <a 
                    href="https://nurdiansyahlabs.com" 
                    target="_blank" 
                    rel="noopener noreferrer dofollow"
                    style={{
                        position: 'fixed',
                        bottom: isMobile ? '5rem' : '2rem',
                        right: isMobile ? '1rem' : '2rem',
                        zIndex: 99999, // Allow modals (100001) to appear above this
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

                {/* Tech Stack Hook - Floating Button Left */}
                {techStack && (
                    <>
                        <button 
                            onClick={() => setShowStack(true)}
                            style={{
                                position: 'fixed',
                                bottom: isMobile ? '5rem' : '2rem',
                                left: isMobile ? '1rem' : '2rem',
                                zIndex: 99999,
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                color: '#1e293b',
                                padding: isMobile ? '10px 14px' : '12px 20px',
                                borderRadius: '100px',
                                fontFamily: '"Inter", sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.15)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: isMobile ? '0.8rem' : '0.9rem'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(0, 0, 0, 0.15)';
                            }}
                        >
                            <Layers size={18} color="#4338ca" />
                            <span>Software Stack</span>
                        </button>

                        {/* Tech Stack Modal */}
                        {showStack && (
                            <div style={{
                                position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', zIndex: 100002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                            }} onClick={() => setShowStack(false)}>
                                <div onClick={e => e.stopPropagation()} style={{
                                    background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', fontFamily: '"Inter", sans-serif', animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <div style={{ background: 'linear-gradient(135deg, #4338ca, #312e81)', padding: '2rem 1.5rem', color: '#fff', textAlign: 'center', position: 'relative' }}>
                                        <button onClick={() => setShowStack(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', marginBottom: '1rem' }}><Layers size={32} /></div>
                                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{techStack.name}</h2>
                                        <p style={{ margin: '8px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Enterprise Architecture Profile</p>
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <Code color="#4f46e5" size={24} style={{ marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frontend Layer</div>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginTop: '2px' }}>{techStack.frontend}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <Server color="#10b981" size={24} style={{ marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Backend System</div>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginTop: '2px' }}>{techStack.backend}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <Database color="#f59e0b" size={24} style={{ marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Database Layer</div>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginTop: '2px' }}>{techStack.database}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <Cpu color="#6366f1" size={24} style={{ marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Infrastructure & OS</div>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginTop: '2px' }}>{techStack.infrastructure}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1rem 1.5rem', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                                        <button onClick={() => setShowStack(false)} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>Tutup Analisis</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
