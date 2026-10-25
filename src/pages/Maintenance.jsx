import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
    Wrench, 
    Server, 
    Database, 
    Globe, 
    Clock, 
    CheckCircle2, 
    MessageCircle, 
    Mail, 
    Github, 
    Linkedin, 
    ArrowRight, 
    ShieldCheck, 
    Activity 
} from 'lucide-react'

export default function Maintenance() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 45,
        seconds: 0
    })
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev
                if (seconds > 0) {
                    seconds--
                } else if (minutes > 0) {
                    minutes--
                    seconds = 59
                } else if (hours > 0) {
                    hours--
                    minutes = 59
                    seconds = 59
                }
                return { hours, minutes, seconds }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (!email || !email.includes('@')) return
        try {
            const list = JSON.parse(localStorage.getItem('maintenance_subscribers') || '[]')
            if (!list.includes(email)) {
                list.push(email)
                localStorage.setItem('maintenance_subscribers', JSON.stringify(list))
            }
        } catch {
            // ignore localStorage errors
        }
        setSubscribed(true)
    }

    const padZero = (n) => String(n).padStart(2, '0')

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#090D16',
            color: '#F8FAFC',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <Helmet>
                <title>Scheduled Maintenance &amp; Upgrades | NurdiansyahLabs</title>
                <meta name="description" content="NurdiansyahLabs is currently undergoing scheduled infrastructure upgrades. We will be back online shortly." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Ambient Background Glow */}
            <div style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '700px',
                    height: '700px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(9, 13, 22, 0) 70%)',
                    filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(9, 13, 22, 0) 70%)',
                    filter: 'blur(70px)'
                }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Main Content Area */}
            <main style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '860px',
                width: '100%',
                margin: '0 auto',
                padding: '3rem 1.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                {/* Brand */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '2rem',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em',
                    color: '#F8FAFC'
                }}>
                    <img 
                        src="/assets/logo.svg" 
                        alt="NurdiansyahLabs Logo" 
                        style={{ width: '36px', height: '36px', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' }} 
                    />
                    <span>Nurdiansyah<span style={{ color: '#818CF8' }}>Labs</span></span>
                </div>

                {/* Status Indicator */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#34D399',
                    marginBottom: '1.5rem'
                }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        boxShadow: '0 0 8px #10B981'
                    }} />
                    Scheduled Maintenance in Progress
                </div>

                {/* Main Headline */}
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    marginBottom: '1.25rem',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 50%, #94A3B8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    We’re Upgrading Our <br />
                    <span style={{
                        background: 'linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Digital Infrastructure
                    </span>
                </h1>

                {/* Description */}
                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: '#94A3B8',
                    maxWidth: '640px',
                    lineHeight: 1.6,
                    marginBottom: '2.5rem'
                }}>
                    Our platform is temporarily offline while we execute planned system enhancements, server migrations, and performance optimizations. We will be back online shortly.
                </p>

                {/* Live Countdown Card */}
                <div style={{
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    padding: '1.5rem 2rem',
                    width: '100%',
                    maxWidth: '580px',
                    marginBottom: '2rem',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#64748B',
                        marginBottom: '1rem',
                        fontWeight: 600
                    }}>
                        <Clock size={15} />
                        Estimated Time Until Service Restoration
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px'
                    }}>
                        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF' }}>{padZero(timeLeft.hours)}</div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', marginTop: '2px' }}>Hours</div>
                        </div>
                        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF' }}>{padZero(timeLeft.minutes)}</div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', marginTop: '2px' }}>Minutes</div>
                        </div>
                        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF' }}>{padZero(timeLeft.seconds)}</div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', marginTop: '2px' }}>Seconds</div>
                        </div>
                        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 700, color: '#38BDF8' }}>99%</div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', marginTop: '2px' }}>Integrity</div>
                        </div>
                    </div>
                </div>

                {/* System Status Panel */}
                <div style={{
                    background: 'rgba(17, 24, 39, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '14px',
                    padding: '1.25rem 1.75rem',
                    width: '100%',
                    maxWidth: '580px',
                    marginBottom: '2rem',
                    textAlign: 'left'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        color: '#94A3B8',
                        fontWeight: 600
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={15} /> Component</span>
                        <span>Status</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F1F5F9' }}>
                            <Server size={16} color="#818CF8" />
                            Core API &amp; Microservices
                        </span>
                        <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                            Deploying v2.4
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F1F5F9' }}>
                            <Database size={16} color="#FBBF24" />
                            Database Clusters
                        </span>
                        <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                            Indexing &amp; Optimization
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F1F5F9' }}>
                            <Globe size={16} color="#34D399" />
                            Global Edge CDN &amp; DNS
                        </span>
                        <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>
                            Operational
                        </span>
                    </div>
                </div>

                {/* Email Notification Form */}
                <form onSubmit={handleSubscribe} style={{ width: '100%', maxWidth: '500px', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={subscribed}
                            placeholder="Enter your email to get notified when we're back"
                            required
                            style={{
                                flex: '1 1 240px',
                                background: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                color: '#FFFFFF',
                                fontSize: '0.95rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={subscribed}
                            style={{
                                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '12px 20px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: subscribed ? 'default' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: subscribed ? 0.7 : 1,
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                        >
                            <span>Notify Me</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    {subscribed && (
                        <div style={{
                            marginTop: '10px',
                            color: '#34D399',
                            fontSize: '0.85rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '10px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}>
                            <CheckCircle2 size={16} />
                            Thank you! We'll alert you the moment systems are fully online.
                        </div>
                    )}
                </form>

                {/* Emergency Contact */}
                <div style={{
                    width: '100%',
                    maxWidth: '580px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                        Have an urgent inquiry or need direct client assistance?
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                        <a 
                            href="https://wa.me/6282176012461?text=Hi%20Nurdiansyah,%20I'm%20reaching%20out%20regarding%20NurdiansyahLabs%20maintenance."
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#F8FAFC',
                                padding: '10px 18px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textDecoration: 'none'
                            }}
                        >
                            <MessageCircle size={16} color="#4ADE80" />
                            WhatsApp Direct
                        </a>
                        <a 
                            href="mailto:nudiansyahdian28.adv@gmail.com"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#F8FAFC',
                                padding: '10px 18px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textDecoration: 'none'
                            }}
                        >
                            <Mail size={16} color="#F87171" />
                            Email Support
                        </a>
                        <a 
                            href="https://github.com/Nurdiansyah0"
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#F8FAFC',
                                padding: '10px 18px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textDecoration: 'none'
                            }}
                        >
                            <Github size={16} color="#A5B4FC" />
                            GitHub
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/nurdiansyah-ds"
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#F8FAFC',
                                padding: '10px 18px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textDecoration: 'none'
                            }}
                        >
                            <Linkedin size={16} color="#38BDF8" />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: '#64748B',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                &copy; {new Date().getFullYear()} NurdiansyahLabs. All rights reserved. • Systems undergoing maintenance.
            </footer>
        </div>
    )
}
