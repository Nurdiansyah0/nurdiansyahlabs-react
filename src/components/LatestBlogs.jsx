import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { INITIAL_BLOG_POSTS } from '../data/blogData'

export default function LatestBlogs() {
    const { isIndo } = useLanguage()

    // Take the top 3-5 articles
    const featuredArticles = INITIAL_BLOG_POSTS.slice(0, 3)

    return (
        <section 
            id="insights" 
            className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #0B0F17 0%, #0D131F 50%, #0B0F17 100%)',
                color: '#F8FAFC',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
        >
            <div className="container relative z-10">
                {/* Section Header */}
                <div className="max-w-3xl mb-12 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-3">
                        <Sparkles size={13} className="text-indigo-400" />
                        <span>
                            {isIndo ? 'Wawasan & Panduan Rekayasa Sistem' : 'Technical Insights & Engineering Guides'}
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-50 leading-tight mb-4">
                        {isIndo ? (
                            <>
                                Arsitektur & Praktik Terbaik{' '}
                                <span className="text-gradient-indigo">
                                    Software Enterprise
                                </span>
                            </>
                        ) : (
                            <>
                                Architectural Insights &{' '}
                                <span className="text-gradient-indigo">
                                    Enterprise Engineering
                                </span>
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
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all shadow-lg"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                                        {article.category}
                                    </span>
                                    <span className="flex items-center gap-1">
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
                                    {article.excerpt}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                                <div className="flex flex-wrap gap-1.5">
                                    {article.tags.slice(0, 2).map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[10px] font-mono text-slate-400">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <Link 
                                    to={`/blog/${article.slug}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors no-underline group-hover:translate-x-0.5"
                                >
                                    <span>{isIndo ? 'Baca Panduan' : 'Read Article'}</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </m.article>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center pt-2">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm transition-all no-underline shadow-md"
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
