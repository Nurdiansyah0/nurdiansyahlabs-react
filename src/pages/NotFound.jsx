import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, BookOpen, MessageCircle, Terminal } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function NotFound() {
    const { isIndo } = useLanguage()

    const waNumber = '6282176012461'
    const waText = isIndo
        ? encodeURIComponent('Halo NurdiansyahLabs, saya mengalami error 404 pada website dan ingin konsultasi mengenai software/website enterprise.')
        : encodeURIComponent('Hello NurdiansyahLabs, I encountered a 404 error and would like to inquire about enterprise software development.')
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`

    return (
        <>
            <Helmet>
                <title>{isIndo ? '404 - Halaman Tidak Ditemukan | NurdiansyahLabs' : '404 - Resource Not Found | NurdiansyahLabs'}</title>
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center px-4 py-16 relative overflow-hidden font-sans">
                {/* Ambient background glow effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

                {/* Decorative Grid Lines */}
                <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10 max-w-2xl w-full mx-auto text-center">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 shadow-xl mb-6 backdrop-blur-md">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        <Terminal size={14} className="text-cyan-400" />
                        <span className="tracking-wider uppercase text-slate-300">HTTP 404 • ROUTE_NOT_FOUND</span>
                    </div>

                    {/* High-Impact Gradient 404 Typography */}
                    <div className="relative mb-4 select-none">
                        <div 
                            className="text-8xl sm:text-9xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-200 drop-shadow-[0_10px_35px_rgba(99,102,241,0.3)]"
                        >
                            404
                        </div>
                        {/* Subtle glow behind numbers */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-2xl text-8xl sm:text-9xl font-black text-indigo-500 pointer-events-none">
                            404
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                        {isIndo ? 'Halaman Tidak Ditemukan' : 'Resource Route Not Found'}
                    </h1>

                    {/* Explanation */}
                    <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                        {isIndo
                            ? 'Endpoint atau halaman yang Anda tuju telah dipindahkan, diperbarui, atau alamat URL yang dimasukkan kurang tepat.'
                            : 'The requested route or resource does not exist on this cluster. It may have been relocated or updated in production.'}
                    </p>

                    {/* Primary Action Button Group */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
                        <Link
                            to="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-900/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-indigo-400/30 cursor-pointer min-h-[48px] no-underline"
                        >
                            <Home size={18} />
                            <span>{isIndo ? 'Kembali ke Beranda' : 'Return to Home'}</span>
                        </Link>

                        <Link
                            to="/blog"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer min-h-[48px] no-underline"
                        >
                            <BookOpen size={18} className="text-cyan-400" />
                            <span>{isIndo ? 'Baca Artikel & Wawasan' : 'Explore Engineering Blog'}</span>
                        </Link>

                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm border border-emerald-400/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-950/40 cursor-pointer min-h-[48px] no-underline"
                        >
                            <MessageCircle size={18} />
                            <span>{isIndo ? 'Tanya Tim via WhatsApp' : 'Direct WhatsApp Inquiry'}</span>
                        </a>
                    </div>

                    {/* Quick Sitemap Links Card */}
                    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm max-w-lg mx-auto">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            {isIndo ? 'Navigasi Cepat Arsitektur NurdiansyahLabs' : 'Quick Studio Navigation'}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-300">
                            <a 
                                href="/#services" 
                                className="py-2.5 px-3 rounded-lg bg-slate-800/60 hover:bg-indigo-950/60 hover:text-indigo-300 border border-slate-700/50 transition-colors text-slate-300 no-underline"
                            >
                                {isIndo ? 'Layanan' : 'Services'}
                            </a>
                            <a 
                                href="/#why-us" 
                                className="py-2.5 px-3 rounded-lg bg-slate-800/60 hover:bg-indigo-950/60 hover:text-indigo-300 border border-slate-700/50 transition-colors text-slate-300 no-underline"
                            >
                                {isIndo ? 'Metodologi' : 'Full SDLC'}
                            </a>
                            <a 
                                href="/#contact" 
                                className="py-2.5 px-3 rounded-lg bg-slate-800/60 hover:bg-indigo-950/60 hover:text-indigo-300 border border-slate-700/50 transition-colors text-slate-300 no-underline"
                            >
                                {isIndo ? 'Kontak' : 'Contact'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
