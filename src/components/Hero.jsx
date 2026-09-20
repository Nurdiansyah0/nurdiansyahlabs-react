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
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4"
                            style={{ backdropFilter: 'blur(8px)' }}
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>
                                {isIndo 
                                    ? 'Digital Solutions for Modern Business' 
                                    : 'Digital Solutions for Modern Business'}
                            </span>
                        </m.div>

                        {/* Core Headline (H1): Pain-Point Driven Hook */}
                        <m.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="font-extrabold tracking-tight text-slate-50 leading-[1.14] mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-[3.15rem]"
                        >
                            {isIndo ? (
                                <>
                                    Masih Mengandalkan Excel, Proses Manual, atau{' '}
                                    <span style={{ color: '#818cf8' }}>
                                        Sistem yang Tidak Terhubung?
                                    </span>
                                </>
                            ) : (
                                <>
                                    Still Relying on Spreadsheets, Manual Work, or{' '}
                                    <span style={{ color: '#818cf8' }}>
                                        Disconnected Systems?
                                    </span>
                                </>
                            )}
                        </m.h1>

                        {/* Transformation & Solution Paragraph */}
                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-6"
                        >
                            {isIndo ? (
                                'Saat bisnis bertumbuh, proses yang awalnya sederhana bisa menjadi lambat, sulit dipantau, dan rawan kesalahan. Kami membantu mengubah proses tersebut menjadi sistem digital yang terintegrasi, otomatis, dan siap berkembang bersama bisnis Anda.'
                            ) : (
                                'As your business grows, manual processes become slow, fragmented, and prone to costly errors. We help transform them into integrated, automated digital systems engineered to scale reliably with your business.'
                            )}
                        </m.p>

                        {/* Service Pillars Tagline Chips */}
                        <m.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="flex flex-wrap items-center gap-2 mb-8 text-xs font-semibold text-indigo-200"
                        >
                            <span className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">Web Apps</span>
                            <span className="text-slate-500">•</span>
                            <span className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">{isIndo ? 'Sistem ERP' : 'ERP System'}</span>
                            <span className="text-slate-500">•</span>
                            <span className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">{isIndo ? 'Otomasi Workflow' : 'Workflow Automation'}</span>
                            <span className="text-slate-500">•</span>
                            <span className="px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/20">{isIndo ? 'Solusi AI' : 'AI Solutions'}</span>
                        </m.div>

                        {/* Dual Action CTAs */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8"
                        >
                            {/* Primary CTA: Smooth scroll to #contact */}
                            <a
                                href="#contact"
                                onClick={() => trackEvent('hero_primary_cta', { target: '#contact', text: isIndo ? 'Konsultasikan Proyek Anda' : 'Consult Your Project' })}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/40 min-h-[48px] text-sm sm:text-base cursor-pointer"
                                style={{
                                    boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.35)',
                                }}
                            >
                                <span>{isIndo ? 'Konsultasikan Proyek Anda' : 'Consult Your Project'}</span>
                                <ArrowRight size={18} />
                            </a>

                            {/* Secondary CTA: Scroll to #services */}
                            <a
                                href="#services"
                                onClick={() => trackEvent('hero_secondary_cta', { target: '#services', text: isIndo ? 'Lihat Solusi Kami' : 'View Our Solutions' })}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all min-h-[48px] text-sm sm:text-base cursor-pointer"
                            >
                                <span>{isIndo ? 'Lihat Solusi Kami' : 'View Our Solutions'}</span>
                            </a>

                            {/* Direct WhatsApp Quick-action */}
                            <a
                                href="https://wa.me/6282176012461"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                    trackEvent('hero_whatsapp_click', { location: 'hero' })
                                }}
                                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 transition-all min-h-[48px] text-xs sm:text-sm font-medium"
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
                            className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4"
                        >
                            <div>
                                <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-50">{isIndo ? '3+ Tahun' : '3+ Years'}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{isIndo ? 'Pengalaman Rekayasa' : 'Engineering Exp.'}</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-400">{isIndo ? '18+ Modul' : '18+ Modules'}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{isIndo ? 'Sistem Terverifikasi' : 'Verified Modules'}</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">&lt; 120ms</div>
                                <div className="text-xs text-slate-400 mt-0.5">{isIndo ? 'Respon Latensi API' : 'API Response SLA'}</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-extrabold font-mono text-sky-400">99.9%</div>
                                <div className="text-xs text-slate-400 mt-0.5">{isIndo ? 'Arsitektur Uptime' : 'Uptime Architecture'}</div>
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
