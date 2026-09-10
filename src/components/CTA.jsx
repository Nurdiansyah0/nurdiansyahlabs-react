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
                background: 'linear-gradient(180deg, #0B0F17 0%, #111827 50%, #070A0F 100%)',
                color: '#F8FAFC',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            {/* Background Ambient Glow */}
            <div 
                aria-hidden="true" 
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 45%),
                        radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 45%),
                        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-4">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>{isIndo ? 'Konsultasi Rekayasa Gratis' : 'Free Engineering Consultation'}</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-50 tracking-tight leading-[1.15] mb-4">
                            {isIndo ? (
                                <>
                                    Siap Membangun Sistem Digital{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
                                        Skala Produksi
                                    </span>{' '}
                                    untuk Bisnis Anda?
                                </>
                            ) : (
                                <>
                                    Ready to Build{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
                                        Production-Grade
                                    </span>{' '}
                                    Digital Systems for Your Business?
                                </>
                            )}
                        </h2>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                            {isIndo ? (
                                'Diskusikan kebutuhan aplikasi web, sistem ERP, atau otomasi data Anda bersama tim rekayasa kami. Kami memberikan rekomendasi arsitektur terukur, estimasi timeline realistis, dan rancangan biaya transparan — 100% gratis tanpa komitmen.'
                            ) : (
                                "Discuss your web application, ERP system, or data automation needs with our engineering team. We provide scalable architecture recommendations, realistic timelines, and transparent cost estimates — 100% free with no commitment required."
                            )}
                        </p>

                        {/* Frictionless Contact Buttons */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
                            <a
                                href="https://wa.me/6282176012461"
                                target="_blank" 
                                rel="noreferrer"
                                onClick={() => trackEvent('whatsapp_click', { location: 'cta_section' })}
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all shadow-lg min-h-[48px] text-sm sm:text-base cursor-pointer"
                                style={{
                                    boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.4)',
                                }}
                            >
                                <MessageCircle size={19} />
                                <span>{isIndo ? 'Chat via WhatsApp' : 'Chat on WhatsApp'}</span>
                            </a>

                            <a
                                href="mailto:nudiansyahdian28.adv@gmail.com"
                                onClick={() => trackEvent('email_click', { location: 'cta_section' })}
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all min-h-[48px] text-sm sm:text-base cursor-pointer"
                            >
                                <Mail size={19} />
                                <span>{isIndo ? 'Kirim Email Penawaran' : 'Email Us Directly'}</span>
                            </a>
                        </div>

                        {/* Operational Confidence Points */}
                        <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <Clock size={15} className="text-emerald-400 shrink-0" />
                                <span>{isIndo ? 'Respon Cepat < 24 Jam' : 'Fast Response < 24h'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles size={15} className="text-indigo-400 shrink-0" />
                                <span>{isIndo ? 'Rekomendasi Arsitektur Gratis' : 'Free Architecture Review'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={15} className="text-sky-400 shrink-0" />
                                <span>{isIndo ? 'Kerahasiaan & NDA Terjamin' : 'Confidential & NDA Ready'}</span>
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
