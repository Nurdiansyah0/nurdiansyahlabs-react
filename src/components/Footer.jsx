import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { MessageCircle, Mail, Github, Linkedin, MapPin, ArrowRight, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer() {
    const { t, isIndo } = useLanguage()

    return (
        <footer 
            style={{ 
                background: '#070A0F', 
                color: '#94A3B8', 
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '4rem',
                paddingBottom: '2.5rem'
            }}
        >
            <div className="container">
                {/* 4-Column Enterprise Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
                    
                    {/* Col 1: Brand & Enterprise Positioning (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2.5 text-slate-100 font-extrabold text-lg tracking-tight no-underline">
                            <img src="/assets/logo.svg" alt="NurdiansyahLabs Logo" className="w-8 h-8" />
                            <span>Nurdiansyah<span className="text-indigo-400">Labs</span></span>
                        </Link>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                            {isIndo 
                                ? 'Studio rekayasa software enterprise & Full SDLC Software Engineer di Indonesia. Kami merancang arsitektur aplikasi web berkinerja tinggi, custom ERP, dan sistem database terdistribusi skala produksi.'
                                : 'Enterprise software engineering studio & Full SDLC Software Engineer based in Indonesia. We architect high-performance web applications, custom ERPs, and distributed production databases.'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                            <ShieldCheck size={16} />
                            <span>{isIndo ? 'Disiplin SDLC Ketat · 100% Kepemilikan Kode' : 'Rigorous SDLC · 100% Code Ownership'}</span>
                        </div>
                    </div>

                    {/* Col 2: Solusi & Layanan (3 cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            {isIndo ? 'Layanan & Solusi' : 'Services & Solutions'}
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li>
                                <a href="/#services" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Jasa Software Enterprise' : 'Enterprise Software Engineering'}
                                </a>
                            </li>
                            <li>
                                <Link to="/services/web-development" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Custom ERP & Web Apps' : 'Custom ERP & Web Apps'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/services/landing-page" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Enterprise Web Portal' : 'Enterprise Web Portal'}
                                </Link>
                            </li>
                            <li>
                                <a href="/#services" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Konsultasi Arsitektur Teknis' : 'Architecture Advisory'}
                                </a>
                            </li>
                            <li>
                                <Link to="/trends" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Tech Trends Radar 2026' : 'Tech Trends Radar 2026'}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Wawasan & Whitepaper Teknis (3 cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            {isIndo ? 'Wawasan & Artikel' : 'Technical Insights'}
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li>
                                <Link to="/blog/arsitektur-software-enterprise-monolith-vs-microservices" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Monolith vs Microservices' : 'Monolith vs Microservices'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/panduan-full-sdlc-software-engineer-enterprise" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Panduan Full SDLC Enterprise' : 'Full SDLC Enterprise Guide'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/migrasi-excel-ke-custom-erp-operasional" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Migrasi Excel ke Custom ERP' : 'Excel to Custom ERP'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/optimasi-database-postgresql-high-concurrency-transaksi" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Optimasi PostgreSQL Concurrency' : 'PostgreSQL Concurrency Tuning'}
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog/studi-kasus-arsitektur-wms-pos-terdistribusi" className="text-slate-400 hover:text-indigo-300 transition-colors no-underline">
                                    {isIndo ? 'Studi Kasus WMS & POS' : 'Distributed WMS/POS Case Study'}
                                </Link>
                            </li>
                            <li className="pt-1">
                                <Link to="/blog" className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 text-xs no-underline">
                                    <span>{isIndo ? 'Semua Artikel Teknis' : 'View All Insights'}</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Lokasi & Kontak (2 cols) */}
                    <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            {isIndo ? 'Kontak & Lokasi' : 'Contact & Base'}
                        </h4>
                        <div className="space-y-2.5 text-xs text-slate-400">
                            <div className="flex items-start gap-2">
                                <MapPin size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                                <span>Batam, Kepulauan Riau, Indonesia (FTZ)</span>
                            </div>
                            <div>
                                <a 
                                    href="https://wa.me/6282176012461" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-emerald-400 hover:underline block font-mono"
                                >
                                    +62 821-7601-2461
                                </a>
                                <a 
                                    href="mailto:nudiansyahdian28.adv@gmail.com" 
                                    className="text-slate-400 hover:text-slate-200 block truncate font-mono mt-1"
                                >
                                    nudiansyahdian28.adv@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-3 pt-2">
                            <a 
                                href="https://wa.me/6282176012461" 
                                target="_blank" 
                                rel="noreferrer"
                                aria-label="WhatsApp"
                                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                            >
                                <MessageCircle size={16} />
                            </a>
                            <a 
                                href="mailto:nudiansyahdian28.adv@gmail.com" 
                                aria-label="Email"
                                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                            >
                                <Mail size={16} />
                            </a>
                            <a 
                                href="https://github.com/Nurdiansyah0" 
                                target="_blank" 
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-colors"
                            >
                                <Github size={16} />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/nurdiansyah-ds" 
                                target="_blank" 
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-colors"
                            >
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright & CI/CD Pipeline Badge */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© 2026 NurdiansyahLabs. All rights reserved.</p>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">CI/CD Production:</span>
                        <a 
                            href="https://github.com/Nurdiansyah0/nurdiansyahlabs-react/actions" 
                            target="_blank" 
                            rel="noreferrer" 
                            title="Live CI/CD Pipeline Status"
                            className="inline-flex items-center"
                        >
                            <img 
                                src="https://github.com/Nurdiansyah0/nurdiansyahlabs-react/actions/workflows/deploy.yml/badge.svg" 
                                alt="Deploy Status" 
                                className="h-5 rounded" 
                            />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    )
}
