import { m } from 'framer-motion'
import { MessageCircle, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import { useTracker } from '../hooks/useTracker'
import TechStack3D from './TechStack3D'

export default function Hero() {
    const { t, lang } = useLanguage()
    const { isMobile, isSm } = useResponsive()
    const { trackEvent } = useTracker()
    const isIndo = lang === 'id'

    return (
        <section 
            id="hero"
            style={{
                background: 'linear-gradient(180deg, #070A0F 0%, #0B0F17 50%, #0F172A 100%)',
                color: '#F8FAFC',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: isSm ? '5.5rem' : '7.5rem',
                paddingBottom: isSm ? '3.5rem' : '5rem',
            }}
        >
            {/* Ambient Background Glow & Engineering Grid */}
            <div 
                aria-hidden="true" 
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 45%),
                        radial-gradient(circle at 85% 65%, rgba(6, 182, 212, 0.1) 0%, transparent 45%),
                        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
                }} 
            />

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column: Value Proposition & CTAs */}
                    <div className="lg:col-span-7 text-left">
                        
                        {/* Studio Identity Badge */}
                        <m.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-[10.5px] sm:text-xs font-semibold tracking-wide uppercase mb-4 max-w-full flex-wrap leading-tight"
                            style={{ backdropFilter: 'blur(8px)' }}
                        >
                            <span className="flex h-2 w-2 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>
                                {isIndo 
                                    ? 'Marketing 5.0 · Rekayasa Next-Tech & Arsitektur Enterprise Human-Centric' 
                                    : 'Marketing 5.0 · Next-Tech Engineering & Human-Centric Enterprise Systems'}
                            </span>
                        </m.div>

                        {/* Core Headline (H1): Enterprise & Full SDLC Keyword Anchored */}
                        <m.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="font-extrabold tracking-tight text-slate-50 leading-[1.14] mb-4 text-2xl sm:text-4xl md:text-5xl lg:text-[3.15rem] break-words"
                        >
                            {isIndo ? (
                                <>
                                    Jasa Software Enterprise Human-Centric &{' '}
                                    <span style={{ color: '#818cf8' }}>
                                        Full SDLC Systems Architecture
                                    </span>
                                </>
                            ) : (
                                <>
                                    Human-Centric Enterprise Technology &{' '}
                                    <span style={{ color: '#818cf8' }}>
                                        Full SDLC Systems Engineering
                                    </span>
                                </>
                            )}
                        </m.h1>

                        {/* Transformation & Solution Paragraph */}
                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mb-6"
                        >
                            {isIndo ? (
                                'Mesin memberi kecepatan komputasi presisi, manusia menghadirkan empati dan pemahaman bisnis yang mendalam. Kami merancang arsitektur software enterprise, custom ERP, dan platform digital terukur dengan metodologi Full SDLC—menggabungkan otomatisasi Next-Tech (CI/CD, database PostgreSQL ACID, latensi <120ms) dengan pendampingan langsung Lead Systems Architect tanpa vendor lock-in.'
                            ) : (
                                'Machines deliver extreme computational velocity; humans provide warmth, strategic empathy, and domain precision. We engineer resilient enterprise software, custom ERPs, and scalable platforms with end-to-end Full SDLC discipline—merging automated Next-Tech (<120ms API latency, ACID resilience) with dedicated 1-on-1 Lead Systems Architect advisory and zero vendor lock-in.'
                            )}
                        </m.p>

                        {/* Service Pillars Tagline Chips */}
                        <m.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 text-[11px] sm:text-xs font-semibold text-indigo-200"
                        >
                            <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">{isIndo ? 'Full SDLC Sprint 1–2 Minggu' : 'Full SDLC 1–2 Week Sprints'}</span>
                            <span className="text-slate-500 hidden sm:inline">•</span>
                            <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">{isIndo ? 'High-Concurrency (< 120ms)' : 'High-Concurrency (< 120ms)'}</span>
                            <span className="text-slate-500 hidden sm:inline">•</span>
                            <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">{isIndo ? 'Telemetri Prediktif & Analitik' : 'Predictive Telemetry & Analytics'}</span>
                            <span className="text-slate-500 hidden sm:inline">•</span>
                            <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">{isIndo ? 'Bionic 1-on-1 Architect Advisory' : 'Bionic 1-on-1 Architect Advisory'}</span>
                        </m.div>

                        {/* Dual Action CTAs */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto"
                        >
                            {/* Primary CTA: Smooth scroll to #contact */}
                            <a
                                href="#contact"
                                onClick={() => trackEvent('hero_primary_cta', { target: '#contact', text: isIndo ? 'Konsultasi Arsitektur 1-on-1' : '1-on-1 Architecture Discovery' })}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/40 min-h-[48px] text-sm sm:text-base cursor-pointer"
                                style={{
                                    boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.35)',
                                }}
                            >
                                <span>{isIndo ? 'Konsultasi Arsitektur 1-on-1' : '1-on-1 Architecture Discovery'}</span>
                                <ArrowRight size={18} />
                            </a>

                            {/* Secondary CTA: Scroll to #services */}
                            <a
                                href="#services"
                                onClick={() => trackEvent('hero_secondary_cta', { target: '#services', text: isIndo ? 'Lihat Solusi Produksi' : 'Explore Production Solutions' })}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all min-h-[48px] text-sm sm:text-base cursor-pointer"
                            >
                                <span>{isIndo ? 'Lihat Solusi Produksi' : 'Explore Production Solutions'}</span>
                            </a>

                            {/* Direct WhatsApp Quick-action */}
                            <a
                                href={`https://wa.me/6282176012461?text=${encodeURIComponent(isIndo ? 'Halo NurdiansyahLabs, saya ingin konsultasi arsitektur sistem enterprise dan solusi Next-Tech untuk akselerasi bisnis kami.' : 'Hello NurdiansyahLabs, I would like to consult on enterprise systems architecture and Next-Tech solutions for our business growth.')}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                    trackEvent('hero_whatsapp_click', { location: 'hero' })
                                }}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 transition-all min-h-[48px] text-xs sm:text-sm font-medium"
                                title={isIndo ? 'WhatsApp — Respons Cepat' : 'Fast Response via WhatsApp'}
                            >
                                <MessageCircle size={17} className="text-emerald-400" />
                                <span>{isIndo ? 'WhatsApp — Respons Cepat' : 'WhatsApp — Quick Response'}</span>
                            </a>
                        </m.div>

                        {/* Verified Platform Proof Points */}
                        <m.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
                        >
                            <div>
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-sky-400">99.9%</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{isIndo ? 'Uptime SLA Target' : 'Production Uptime SLA'}</div>
                            </div>
                            <div>
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-emerald-400">&lt; 120ms</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{isIndo ? 'Respon Latensi API' : 'API Response SLA'}</div>
                            </div>
                            <div>
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-indigo-400">{isIndo ? '18+ Modul' : '18+ Modules'}</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{isIndo ? 'Sistem Terverifikasi' : 'Verified Modules'}</div>
                            </div>
                            <div>
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-slate-50">100%</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{isIndo ? 'Kepemilikan Source Code' : 'Full Code Ownership'}</div>
                            </div>
                        </m.div>

                    </div>

                    {/* Right Column: Studio System Preview / Architecture Card */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 w-full flex justify-center"
                    >
                        <TechStack3D />
                    </m.div>

                </div>
            </div>
        </section>
    )
}
