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
                background: '#07080d',
                color: '#F8FAFC',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: isSm ? '5.5rem' : '7.5rem',
                paddingBottom: isSm ? '3.5rem' : '5rem',
            }}
        >
            {/* Top Volumetric Aurora Mesh (Stacked Devs aesthetic) */}
            <div 
                aria-hidden="true" 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[420px] pointer-events-none opacity-45 blur-[130px] -z-0"
                style={{
                    background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(167, 139, 250, 0.45) 0%, rgba(99, 102, 241, 0.25) 45%, transparent 75%)'
                }}
            />

            {/* Micro Dot Matrix Backdrop */}
            <div 
                aria-hidden="true" 
                className="absolute inset-0 pointer-events-none opacity-[0.14] -z-0"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 60%, transparent 100%)',
                }}
            />

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column: Value Proposition & CTAs */}
                    <div className="lg:col-span-7 text-left">
                        {/* Live Engineering Status Pill */}
                        <m.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-violet-400/25 bg-violet-950/40 backdrop-blur-md mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
                            </span>
                            <span className="text-[11px] sm:text-xs font-mono font-medium text-violet-200 tracking-wide">
                                {isIndo ? 'Engineering Studio · Full SDLC & AI-Hardened' : 'Engineering Studio · Full SDLC & AI-Hardened'}
                            </span>
                        </m.div>

                        {/* Core Headline (H1): Contrast Pairing Sans + Editorial Serif */}
                        <m.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="font-extrabold tracking-tight text-white leading-[1.12] mb-4 text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] break-words"
                        >
                            {isIndo ? (
                                <>
                                    Bangun software enterprise & arsitektur sistem{' '}
                                    <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-100 to-purple-300 pr-1">
                                        tanpa kompromi.
                                    </span>
                                </>
                            ) : (
                                <>
                                    Architecting enterprise systems & software with{' '}
                                    <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-100 to-purple-300 pr-1">
                                        zero compromise.
                                    </span>
                                </>
                            )}
                        </m.h1>

                        {/* Transformation & Solution Paragraph */}
                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-slate-300/90 text-sm sm:text-lg leading-relaxed max-w-2xl mb-6 font-normal"
                        >
                            {isIndo ? (
                                'Bukan sekadar website standar. Kami merancang arsitektur web modern, custom ERP, database terdistribusi, dan platform enterprise skala produksi—dikerjakan dengan standar keamanan ketat, performa tinggi, dan akselerasi AI.'
                            ) : (
                                'Beyond basic web pages. We engineer secure web applications, custom ERPs, scalable databases, and cloud infrastructure—pixel-perfect on every screen and hardened to industry standards.'
                            )}
                        </m.p>

                        {/* Service Pillars Specular Pills */}
                        <m.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 text-[11px] sm:text-xs font-mono text-slate-300"
                        >
                            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                                {isIndo ? 'Full SDLC Sprint 1–2 Minggu' : 'Full SDLC 1–2 Wk Sprints'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                                {isIndo ? 'High-Concurrency (< 120ms)' : 'Latency < 120ms'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                {isIndo ? 'OWASP Hardened' : 'OWASP Hardened'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                {isIndo ? '1-on-1 Architect Advisory' : 'Architect Advisory'}
                            </span>
                        </m.div>

                        {/* Dual Action CTAs */}
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto"
                        >
                            {/* Primary CTA: Specular Glow Button */}
                            <a
                                href="#contact"
                                onClick={() => trackEvent('hero_primary_cta', { target: '#contact', text: isIndo ? 'Konsultasi Arsitektur 1-on-1' : '1-on-1 Architecture Discovery' })}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_12px_32px_-8px_rgba(129,140,248,0.6)] min-h-[48px] text-sm sm:text-base cursor-pointer group"
                            >
                                <span>{isIndo ? 'Konsultasi Arsitektur 1-on-1' : '1-on-1 Architecture Discovery'}</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>

                            {/* Secondary CTA: Glass Specular Outline */}
                            <a
                                href="#services"
                                onClick={() => trackEvent('hero_secondary_cta', { target: '#services', text: isIndo ? 'Lihat Solusi Produksi' : 'Explore Production Solutions' })}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all min-h-[48px] text-sm sm:text-base cursor-pointer"
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
                            className="pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
                        >
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-sky-400">99.9%</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{isIndo ? 'Uptime SLA Target' : 'Production Uptime SLA'}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-emerald-400">&lt; 120ms</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{isIndo ? 'Respon Latensi API' : 'API Response SLA'}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-violet-400">{isIndo ? '18+ Modul' : '18+ Modules'}</div>
                                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{isIndo ? 'Sistem Terverifikasi' : 'Verified Modules'}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                                <div className="text-lg sm:text-2xl font-extrabold font-mono text-slate-100">100%</div>
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
