import React, { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useTracker } from '../hooks/useTracker'
import { useLocation } from 'react-router-dom'

export default function FloatingWhatsApp() {
    const { isIndo } = useLanguage()
    const { trackEvent } = useTracker()
    const location = useLocation()
    const [isVisible, setIsVisible] = useState(false)
    const [hasDismissed, setHasDismissed] = useState(false)

    // Don't show in admin area
    if (location.pathname.startsWith('/admin')) {
        return null
    }

    // Show after scrolling 150px or after 3 seconds
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsVisible(true)
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        const timer = setTimeout(() => setIsVisible(true), 3000)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearTimeout(timer)
        }
    }, [])

    if (!isVisible) return null

    const waNumber = '6282176012461'
    const waText = isIndo
        ? encodeURIComponent('Halo NurdiansyahLabs, saya tertarik konsultasi mengenai pembuatan software dan website perusahaan.')
        : encodeURIComponent('Hello NurdiansyahLabs, I would like to consult about enterprise software and website development.')
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`

    const handleClick = () => {
        trackEvent('whatsapp_floating_click', {
            path: location.pathname,
            source: 'floating_widget'
        })
    }

    return (
        <aside
            aria-label="WhatsApp Quick Consultation"
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 select-none group"
            style={{ animation: 'fadeInUp 0.4s ease-out' }}
        >
            {/* Pop-up Badge Pill */}
            {!hasDismissed && (
                <div 
                    className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 border border-emerald-500/30 text-slate-100 text-xs font-semibold shadow-xl shadow-black/40 backdrop-blur-md transition-all hover:border-emerald-400"
                >
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleClick}
                        className="text-slate-200 hover:text-white no-underline transition-colors"
                    >
                        {isIndo ? 'Konsultasi Online' : 'Chat with Engineer'}
                    </a>
                    <button
                        type="button"
                        onClick={() => setHasDismissed(true)}
                        className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
                        aria-label="Tutup notifikasi"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}

            {/* Main Floating Button */}
            <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleClick}
                aria-label={isIndo ? 'Hubungi kami via WhatsApp' : 'Contact us via WhatsApp'}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 transition-transform active:scale-95 hover:scale-105 cursor-pointer relative"
                style={{
                    boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.45)'
                }}
            >
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-950"></span>
                </span>
                <MessageCircle size={28} className="text-white" />
            </a>
        </aside>
    )
}
