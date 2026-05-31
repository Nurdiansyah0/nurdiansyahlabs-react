import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight, BookOpen, Loader2 } from 'lucide-react'
import { getOptimizedImg } from '../utils/imgHelper'

export default function BlogListing() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        document.title = 'Blog & Insights | NurdiansyahLabs'
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) metaDesc.setAttribute('content', 'Temukan artikel menarik seputar web development, data analyst, dan tips bisnis dari NurdiansyahLabs.')

        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts.php')
                const data = await res.json()
                if (data.posts) {
                    setArticles(data.posts)
                }
            } catch (err) {
                console.error("Failed to fetch posts:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()

        return () => {
            document.title = 'NurdiansyahLabs | Jasa Landing Page & Web Developer Profesional Indonesia'
            if (metaDesc) metaDesc.setAttribute('content', 'Jasa pembuatan landing page, web developer fullstack, analisis data bisnis, dan data science terpercaya di Indonesia. Mulai Rp 1.750.000. Konsultasi gratis via WhatsApp!')
        }
    }, [])

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '6rem 1.5rem 4rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eef2ff', color: '#4f46e5', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
                        <BookOpen size={18} /> Our Blog
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                        Insights & <span style={{ color: '#4f46e5' }}>News</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                        Pelajari tips terbaru seputar web development, analisis data, bisnis digital, dan teknologi machine learning.
                    </p>
                </m.div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '400px' }}>
                                <div style={{ height: '200px', background: '#f1f5f9' }} />
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ height: '24px', background: '#e2e8f0', borderRadius: '4px', width: '80%' }} />
                                    <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '100%' }} />
                                    <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '90%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {articles.map((article, i) => (
                            <m.div
                                key={article.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    background: '#fff', borderRadius: '16px', overflow: 'hidden',
                                    border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'none'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <Link to={`/blog/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ height: '200px', background: article.accentLight, position: 'relative', overflow: 'hidden' }}>
                                        {article.img ? (
                                            <img src={getOptimizedImg(article.img, { w: 600, h: 400 })} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${article.accent}, #0f172a)`, opacity: 0.1 }} />
                                        )}
                                        <span style={{
                                            position: 'absolute', top: '16px', left: '16px',
                                            background: article.accent, color: '#fff', padding: '6px 12px',
                                            borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700
                                        }}>
                                            {article.serviceLabel}
                                        </span>
                                    </div>
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                                            {article.title}
                                        </h2>
                                        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                                            {article.description.length > 120 ? article.description.slice(0, 120) + '...' : article.description}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: article.accent, fontWeight: 700, fontSize: '0.9rem' }}>
                                            Baca Artikel <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            </m.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
