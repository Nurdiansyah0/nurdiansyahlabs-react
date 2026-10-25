import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight, BookOpen, Clock, Search, Terminal, Sparkles, Filter } from 'lucide-react'
import { getOptimizedImg } from '../utils/imgHelper'
import { useLanguage } from '../i18n/LanguageContext'
import { INITIAL_BLOG_POSTS } from '../data/blogData'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/seo/SEO'

const CATEGORIES = [
    'Semua',
    'Arsitektur Sistem',
    'Full SDLC',
    'Sistem ERP',
    'Database & Cloud',
    'Studi Kasus'
]

export const resolveArticleImg = (article) => {
    if (article?.img && !article.img.startsWith('/assets/showcase')) return article.img;
    if (Array.isArray(article?.images) && article.images.length > 0) {
        return article.images[0]?.url || article.images[0];
    }
    if (typeof article?.images === 'string') {
        try {
            const parsed = JSON.parse(article.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed[0]?.url || parsed[0];
            }
        } catch (e) {}
    }
    const svc = article?.service || '';
    const cat = (article?.category || article?.serviceLabel || '').toLowerCase();
    if (svc === 'A' || cat.includes('landing')) return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80';
    if (svc === 'B' || cat.includes('fullstack') || cat.includes('developer') || cat.includes('arsitektur')) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
    if (svc === 'C' || cat.includes('data') || cat.includes('dashboard') || cat.includes('erp')) return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
    if (svc === 'D' || cat.includes('machine') || cat.includes('ai') || cat.includes('science')) return 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80';
};

export default function BlogListing() {
    const [articles, setArticles] = useState(INITIAL_BLOG_POSTS)
    const [selectedCategory, setSelectedCategory] = useState('Semua')
    const [searchQuery, setSearchQuery] = useState('')
    const { isIndo } = useLanguage()

    // Background revalidation with live API if available
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/v1/posts')
                if (!res.ok) return
                const data = await res.json()
                const remotePosts = Array.isArray(data) ? data : data?.posts
                if (remotePosts && remotePosts.length > 0) {
                    // Merge remote posts with initial curated posts by slug
                    setArticles(prev => {
                        const existingSlugs = new Set(remotePosts.map(p => p.slug))
                        const nonOverlapping = prev.filter(p => !existingSlugs.has(p.slug))
                        return [...remotePosts, ...nonOverlapping]
                    })
                }
            } catch (err) {
                // Keep INITIAL_BLOG_POSTS gracefully on API error
            }
        }

        fetchPosts()
    }, [])

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesCategory = selectedCategory === 'Semua' || 
                article.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                article.serviceLabel?.toLowerCase().includes(selectedCategory.toLowerCase())

            const q = searchQuery.toLowerCase().trim()
            const matchesSearch = !q || 
                article.title?.toLowerCase().includes(q) || 
                article.description?.toLowerCase().includes(q) ||
                article.category?.toLowerCase().includes(q)

            return matchesCategory && matchesSearch
        })
    }, [articles, selectedCategory, searchQuery])

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070A0F', color: '#F8FAFC' }}>
            <SEO
                title={isIndo 
                    ? 'Wawasan Rekayasa Software Enterprise & Arsitektur Sistem' 
                    : 'Enterprise Software Engineering & Systems Architecture Insights'}
                description={isIndo
                    ? 'Artikel mendalam seputar arsitektur modular monolith vs microservices, metodologi full SDLC, custom ERP, dan optimasi database skala enterprise.'
                    : 'Deep architectural insights on modular monoliths, distributed microservices, full SDLC engineering, custom ERP systems, and high-concurrency databases.'}
                canonical="/blog"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Blog', url: '/blog' }
                ]}
            />
            
            <Navbar />

            <main style={{ flex: 1, padding: '4rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
                {/* Background ambient lighting */}
                <div 
                    aria-hidden="true" 
                    style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                        width: '100%', maxWidth: '1200px', height: '400px', pointerEvents: 'none', zIndex: 0,
                        background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
                    }} 
                />

                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    {/* Header Banner */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '820px', margin: '0 auto 3.5rem' }}
                    >
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)',
                            color: '#A5B4FC', padding: '6px 16px', borderRadius: '9999px',
                            fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem'
                        }}>
                            <Terminal size={15} /> {isIndo ? 'Engineering & Systems Blog' : 'Engineering & Systems Blog'}
                        </div>
                        
                        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900, color: '#F8FAFC', marginBottom: '1.2rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                            {isIndo ? (
                                <>Wawasan Teknis &amp; <span style={{ color: '#818CF8' }}>Arsitektur Software</span></>
                            ) : (
                                <>Technical Insights &amp; <span style={{ color: '#818CF8' }}>Systems Architecture</span></>
                            )}
                        </h1>
                        
                        <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 auto', maxWidth: '640px' }}>
                            {isIndo
                                ? 'Panduan teknis mendalam tentang rekayasa software skala besar, metodologi full SDLC, custom ERP terintegrasi, dan optimasi performa backend.'
                                : 'Authoritative engineering write-ups on production software architecture, full SDLC rigor, custom ERP systems, and high-throughput databases.'}
                        </p>
                    </m.div>

                    {/* Filter and Search Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem', width: '100%', maxWidth: '100%' }}>
                        {/* Search Input */}
                        <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isIndo ? 'Cari topik, keyword, atau arsitektur...' : 'Search topics, architecture, or keywords...'}
                                style={{
                                    width: '100%', padding: '12px 16px 12px 46px',
                                    background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.12)',
                                    borderRadius: '12px', color: '#F8FAFC', fontSize: '0.95rem',
                                    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#6366F1'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                        </div>

                        {/* Category Pills with smooth touch wrapping */}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '100%', padding: '2px 0' }}>
                            {CATEGORIES.map(category => {
                                const active = selectedCategory === category
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        style={{
                                            padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            background: active ? '#4F46E5' : 'rgba(15, 23, 42, 0.6)',
                                            color: active ? '#FFFFFF' : '#94A3B8',
                                            border: active ? '1px solid #6366F1' : '1px solid rgba(255, 255, 255, 0.08)',
                                            minHeight: '38px', touchAction: 'manipulation'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!active) e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!active) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                                        }}
                                    >
                                        {category}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Articles Grid (Responsive minmax to prevent 320px-360px overflow) */}
                    {filteredArticles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <p style={{ color: '#94A3B8', fontSize: '1.05rem', margin: 0 }}>
                                {isIndo ? 'Tidak ada artikel yang sesuai dengan pencarian Anda.' : 'No articles matched your criteria.'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.75rem' }}>
                            {filteredArticles.map((article, i) => (
                                <m.article
                                    key={article.slug}
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.75)',
                                        borderRadius: '16px', overflow: 'hidden',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        display: 'flex', flexDirection: 'column',
                                        transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)'
                                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'
                                        e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'none'
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <Link to={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', color: 'inherit' }}>
                                        {/* Thumbnail Container */}
                                        <div style={{ height: '210px', position: 'relative', overflow: 'hidden', background: '#0F172A' }}>
                                            {(() => {
                                                const thumb = resolveArticleImg(article);
                                                return thumb ? (
                                                    <img 
                                                        src={getOptimizedImg(thumb, { w: 640, h: 420 })} 
                                                        alt={article.title} 
                                                        loading="lazy"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                        onError={e => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80';
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)' }} />
                                                );
                                            })()}
                                            
                                            {/* Category Tag Badge */}
                                            <span style={{
                                                position: 'absolute', top: '16px', left: '16px',
                                                background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(255, 255, 255, 0.15)', color: '#A5B4FC',
                                                padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700
                                            }}>
                                                {article.category || article.serviceLabel}
                                            </span>

                                            {article.readTime && (
                                                <span style={{
                                                    position: 'absolute', bottom: '12px', right: '12px',
                                                    background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)',
                                                    color: '#CBD5E1', padding: '3px 8px', borderRadius: '6px',
                                                    fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                    <Clock size={12} /> {article.readTime}
                                                </span>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: 'clamp(1rem, 3.5vw, 1.5rem)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                                                {article.title}
                                            </h2>
                                            
                                            <p style={{
                                                fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {article.description}
                                            </p>

                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                                            }}>
                                                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                                    {article.author || 'Nurdiansyah'}
                                                </span>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818CF8', fontWeight: 700, fontSize: '0.85rem' }}>
                                                    {isIndo ? 'Baca Analisis' : 'Read Analysis'} <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </m.article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
