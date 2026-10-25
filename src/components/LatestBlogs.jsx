import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { INITIAL_BLOG_POSTS } from '../data/blogData'

export default function LatestBlogs() {
    const { isIndo } = useLanguage()

    // Take the top 3 featured articles
    const featuredArticles = INITIAL_BLOG_POSTS.slice(0, 3)

    return (
        <section 
            id="insights" 
            className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
            style={{
                background: '#07080d',
                color: '#F8FAFC',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
        >
            {/* Background Ambient Glow & Dot Matrix */}
            <div 
                aria-hidden="true" 
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 55%),
                        radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 32px 32px',
                }} 
            />

            <div className="container relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-12 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span>
                            {isIndo ? 'REKAYASA SISTEM & WHITEPAPER · FIELD NOTES' : 'SYSTEM ARCHITECTURE & WHITEPAPERS · FIELD NOTES'}
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-50 leading-tight mb-4">
                        {isIndo ? (
                            <>
                                Wawasan Arsitektur & Rekayasa{' '}
                                <span className="font-serif-accent italic font-normal text-slate-100">
                                    Software Enterprise
                                </span>.
                            </>
                        ) : (
                            <>
                                Architectural Insights &{' '}
                                <span className="font-serif-accent italic font-normal text-slate-100">
                                    Enterprise Engineering
                                </span>.
                            </>
                        )}
                    </h2>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {isIndo
                            ? 'Artikel dan whitepaper teknis berbasis pengalaman lapangan rekayasa software: dari perdebatan monolith vs microservices, metodologi Full SDLC, hingga strategi optimasi database konkurensi tinggi.'
                            : 'Field-tested technical articles and whitepapers on enterprise engineering: from monolithic architecture vs microservices, Full SDLC workflows, to high-concurrency database optimizations.'}
                    </p>
                </div>

                {/* 3-Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
                    {featuredArticles.map((article, idx) => (
                        <m.article
                            key={article.slug || idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c101b]/80 p-6 hover:border-indigo-500/40 hover:bg-[#0e1424]/90 transition-all duration-300 shadow-xl"
                            style={{
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px -15px rgba(0,0,0,0.8)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)'
                            }}
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-violet-950/60 text-violet-300 border border-violet-500/25">
                                        {article.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                                        <Clock size={12} />
                                        {article.readTime}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-3">
                                    <Link to={`/blog/${article.slug}`} className="no-underline text-inherit">
                                        {article.title}
                                    </Link>
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
                                    {article.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                                <span className="text-[11px] font-mono text-indigo-400">
                                    {article.serviceLabel || 'Software Enterprise'}
                                </span>
                                <Link 
                                    to={`/blog/${article.slug}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors no-underline group-hover:translate-x-1 duration-200"
                                >
                                    <span>{isIndo ? 'Baca Panduan' : 'Read Article'}</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </m.article>
                    ))}
                </div>

                {/* View All Button with Specular Glass */}
                <div className="text-center pt-2">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 hover:text-white font-semibold text-sm transition-all no-underline shadow-lg"
                        style={{
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 25px -5px rgba(0,0,0,0.5)'
                        }}
                    >
                        <BookOpen size={16} className="text-indigo-400" />
                        <span>{isIndo ? 'Lihat Semua 5 Panduan & Whitepaper Teknis' : 'View All 5 Engineering Whitepapers'}</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
