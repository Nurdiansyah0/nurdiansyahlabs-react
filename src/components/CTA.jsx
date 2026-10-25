import { m } from 'framer-motion'
import { MessageCircle, Mail, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import { useTracker } from '../hooks/useTracker'
import ContactForm from './ContactForm'

export default function CTA() {
    const { lang } = useLanguage()
    const { isMobile, isSm } = useResponsive()
    const { trackEvent } = useTracker()
    const isIndo = lang === 'id'

    return (
        <section 
            id="contact" 
            className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
            style={{
                background: '#07080d',
                color: '#F8FAFC',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            {/* Background Ambient Glow & Dot Matrix */}
            <div 
                aria-hidden="true" 
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 15% 25%, rgba(99, 102, 241, 0.18) 0%, transparent 50%),
                        radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                        radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 32px 32px',
                }} 
            />

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    
                    {/* Left Column: Text & Direct Contact Actions */}
                    <m.div
                        initial={{ opacity: 0, x: -25 }} 
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} 
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-6 text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-mono mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>
                                {isIndo ? 'SESI DISCOVERY 1-ON-1 · ZERO OBLIGATION' : '1-ON-1 DISCOVERY · ZERO OBLIGATION'}
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-50 tracking-tight leading-[1.18] mb-4">
                            {isIndo ? (
                                <>
                                    Konsultasi Arsitektur 1-on-1 bersama{' '}
                                    <span className="font-serif-accent italic font-normal text-slate-100">
                                        Lead Systems Architect
                                    </span>.
                                </>
                            ) : (
                                <>
                                    1-on-1 Architecture Discovery with Our{' '}
                                    <span className="font-serif-accent italic font-normal text-slate-100">
                                        Lead Systems Architect
                                    </span>.
                                </>
                            )}
                        </h2>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                            {isIndo ? (
                                'Sesi discovery teknis 30 menit tanpa komitmen: kami bedah bottleneck sistem Anda, review arsitektur database, dan susun roadmap rekayasa terukur. Didukung garansi 30 hari bebas bug dan penyerahan 100% source code tanpa keterikatan vendor lock-in.'
                            ) : (
                                "A 30-minute zero-obligation technical discovery session: we analyze your system bottlenecks, review database scalability, and draft an actionable engineering roadmap. Backed by a 30-day bug-free warranty and 100% full source-code ownership with zero vendor lock-in."
                            )}
                        </p>

                        {/* Frictionless Contact Buttons */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto">
                            <a
                                href={`https://wa.me/6282176012461?text=${encodeURIComponent(isIndo ? 'Halo NurdiansyahLabs, saya ingin menjadwalkan sesi Konsultasi Arsitektur 1-on-1 (30 Menit Discovery Gratis) dengan Lead Systems Architect.' : 'Hello NurdiansyahLabs, I would like to schedule a 1-on-1 Architecture Discovery session (30-Min Free Discovery) with your Lead Systems Architect.')}`}
                                target="_blank" 
                                rel="noreferrer"
                                onClick={() => trackEvent('whatsapp_click', { location: 'cta_section' })}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white transition-all min-h-[48px] text-sm sm:text-base cursor-pointer border border-white/20"
                                style={{
                                    background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 25px -4px rgba(16, 185, 129, 0.45)',
                                }}
                            >
                                <MessageCircle size={19} />
                                <span>{isIndo ? 'Jadwalkan Konsultasi 1-on-1 (WhatsApp)' : 'Book 1-on-1 Discovery (WhatsApp)'}</span>
                            </a>

                            <a
                                href="mailto:nudiansyahdian28.adv@gmail.com"
                                onClick={() => trackEvent('email_click', { location: 'cta_section' })}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] transition-all min-h-[48px] text-sm sm:text-base cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                            >
                                <Mail size={19} />
                                <span>{isIndo ? 'Kirim Spesifikasi Proyek' : 'Email Project Specs'}</span>
                            </a>
                        </div>

                        {/* Operational Confidence Points */}
                        <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <Clock size={15} className="text-emerald-400 shrink-0" />
                                <span>{isIndo ? 'Discovery 30 Menit Bebas Komitmen' : 'Zero-Obligation 30-Min Discovery'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles size={15} className="text-indigo-400 shrink-0" />
                                <span>{isIndo ? '100% Kepemilikan Source Code' : '100% Full Code Ownership'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={15} className="text-sky-400 shrink-0" />
                                <span>{isIndo ? 'Garansi 30 Hari Bebas Bug' : '30-Day Bug-Free Warranty'}</span>
                            </div>
                        </div>

                    </m.div>

                    {/* Right Column: High-Contrast Consultation Form */}
                    <m.div
                        initial={{ opacity: 0, x: 25 }} 
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} 
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="lg:col-span-6 w-full"
                    >
                        <ContactForm />
                    </m.div>

                </div>
            </div>
        </section>
    )
}
