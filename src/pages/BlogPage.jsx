import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { MessageCircle, Loader2 } from 'lucide-react'
import { useTracker } from '../hooks/useTracker'
import { getOptimizedImg } from '../utils/imgHelper'

// Generate structured data for any other slugs not in predefined list
function generateGenericData(slug) {
    const keyword = slug.replace(/-/g, ' ')
    return {
        title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} – NurdiansyahLabs`,
        description: `Layanan ${keyword} profesional di Indonesia. Hubungi NurdiansyahLabs untuk konsultasi gratis.`,
        service: 'A', serviceLabel: 'NurdiansyahLabs', accent: '#3730a3', accentLight: '#eef2ff',
        faqs: [], content: `Kami menyediakan layanan **${keyword}** profesional untuk bisnis Anda di Indonesia.`,
    }
}


    // Function to ensure any badge background provides AAA contrast (7:1) with white text (#fff)
    const getSafeAccent = (hex) => {
        if (!hex) return '#1e293b';
        const lower = hex.toLowerCase();
        if (lower.includes('059669') || lower.includes('10b981')) return '#022c22'; // Emerald -> super dark green
        if (lower.includes('22c55e') || lower.includes('16a34a')) return '#14532d'; // Green -> super dark green
        if (lower.includes('f59e0b') || lower.includes('d97706')) return '#78350f'; // Amber -> super dark amber
        if (lower.includes('3b82f6') || lower.includes('2563eb')) return '#1e3a8a'; // Blue -> super dark blue
        if (lower.includes('8b5cf6') || lower.includes('a855f7')) return '#2e1065'; // Violet -> super dark violet
        if (lower.includes('6366f1') || lower.includes('4f46e5')) return '#1e1b4b'; // Indigo -> super dark indigo
        return lower; // Assume others are safe (like original '#3730a3' or already dark)
    };

export default function BlogPage() {
    const { geo, langSlug, slug } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { trackEvent } = useTracker()

    const actualSlug = langSlug && geo ? `${geo}/${langSlug}` : slug;

    // Fetch the post
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts.php?slug=${actualSlug}`)
                if (res.ok) {
                    const data = await res.json()
                    setPost(data)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error("Failed to fetch post:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [slug])

    // Update SEO meta tags dynamically
    useEffect(() => {
        if (!post) return;

        const originalTitle = document.title
        const metaDesc = document.querySelector('meta[name="description"]')
        const originalDesc = metaDesc ? metaDesc.getAttribute('content') : ''

        document.title = `${post.title} | NurdiansyahLabs`
        if (metaDesc) metaDesc.setAttribute('content', post.description)

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]')
        let originalCanonical = ''
        if (canonical) {
            originalCanonical = canonical.getAttribute('href')
        } else {
            canonical = document.createElement('link')
            canonical.setAttribute('rel', 'canonical')
            document.head.appendChild(canonical)
        }
        const pageUrl = `https://nurdiansyahlabs.com/blog/${actualSlug}`
        canonical.setAttribute('href', pageUrl)
        canonical.id = 'blog-canonical'

        // ── Hreflang Tag Injection for Global SEO ──
        let hreflang = document.querySelector('link[hreflang]')
        if (!hreflang && post.lang) {
            hreflang = document.createElement('link')
            hreflang.setAttribute('rel', 'alternate')
            hreflang.setAttribute('hreflang', post.lang)
            hreflang.setAttribute('href', pageUrl)
            hreflang.id = 'blog-hreflang'
            document.head.appendChild(hreflang)
        }

        // JSON-LD for this article
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'blog-ld'
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
            headline: post.title,
            description: post.description,
            url: pageUrl,
            author: { '@type': 'Person', name: 'Nurdiansyah', url: 'https://nurdiansyahlabs.com' },
            publisher: { '@type': 'Organization', name: 'NurdiansyahLabs', logo: { '@type': 'ImageObject', url: 'https://nurdiansyahlabs.com/assets/logo.svg' } },
            datePublished: '2026-02-21',
            dateModified: new Date().toISOString().split('T')[0],
        })
        document.head.appendChild(script)

        return () => {
            document.title = originalTitle
            if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc)

            if (originalCanonical) {
                canonical.setAttribute('href', originalCanonical)
                canonical.removeAttribute('id')
            } else {
                canonical.remove()
            }

            document.getElementById('blog-ld')?.remove()
            document.getElementById('blog-hreflang')?.remove()
        }
    }, [actualSlug, post])

    // Track read event (dwell time)
    useEffect(() => {
        if (!post) return;

        const timer = setTimeout(() => {
            trackEvent('read_article', { slug: actualSlug, title: post.title, duration: 10 })
        }, 10000)

        return () => clearTimeout(timer)
    }, [actualSlug, post, trackEvent])

    // Convert basic markdown to JSX-friendly HTML
    const renderContent = (text) => {
        const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
        const elements = []
        let currentList = []

        const flushList = () => {
            if (currentList.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} style={{ paddingLeft: '1.25rem', margin: '0 0 1rem', color: '#374151' }}>{...currentList}</ul>)
                currentList = []
            }
        }

        lines.forEach((line, i) => {
            if (line.startsWith('- ')) {
                const bold = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                currentList.push(<li key={`li-${i}`} style={{ marginBottom: '4px' }} dangerouslySetInnerHTML={{ __html: bold }} />)
            } else {
                flushList()
                if (line.startsWith('## ')) {
                    elements.push(<h2 key={`h2-${i}`} style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '1.5rem 0 0.5rem' }}>{line.slice(3)}</h2>)
                } else {
                    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    elements.push(<p key={`p-${i}`} style={{ color: '#374151', lineHeight: 1.7, marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: bold }} />)
                }
            }
        })
        flushList()
        return elements
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={40} color="#3730a3" />
                </m.div>
            </div>
        )
    }

    if (error || !post) {
        // Fallback or generic data logic when the post fails to fetch
        const genericPost = generateGenericData(actualSlug)
        return renderPage(genericPost)
    }

    return renderPage(post)

    function renderPage(post) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
                {/* Top bar */}
                <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/" style={{ color: '#3730a3', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <img src={getOptimizedImg("/assets/logo.svg", { w: 50 })} alt="NurdiansyahLabs" style={{ width: '20px', height: '20px' }} />
                        NurdiansyahLabs
                    </Link>
                    <span style={{ color: '#1e293b', fontSize: '0.8rem' }}>›</span>
                    <span style={{ color: '#1e293b', fontSize: '0.8rem' }}>Blog</span>
                    {post?.geo_origin && (
                        <>
                            <span style={{ color: '#1e293b', fontSize: '0.8rem' }}>›</span>
                            <span style={{
                                background: '#f1f5f9', color: '#1e293b', fontSize: '0.7rem',
                                padding: '2px 6px', borderRadius: '4px', fontWeight: 600, display: 'flex', gap: '4px', alignItems: 'center'
                            }}>
                                🌐 {post.geo_origin}
                            </span>
                        </>
                    )}
                    <span style={{ color: '#1e293b', fontSize: '0.8rem' }}>›</span>
                    <span style={{ color: '#0f172a', fontSize: '0.8rem', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {actualSlug.split('/').pop()}
                    </span>
                </div>

                {/* Hero */}
                <div style={{ background: `linear-gradient(135deg, ${post.accentLight} 0%, #fff 100%)`, padding: '3rem 1.5rem 2rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px', background: getSafeAccent(post.accent), color: '#fff', marginBottom: '1rem', display: 'inline-block' }}>
                            {post.serviceLabel}
                        </span>
                        <m.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.3, margin: '0.5rem 0 1rem' }}
                        >
                            {post.title}
                        </m.h1>
                        <p style={{ color: '#1e293b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{post.description}</p>
                        <a
                            href="https://wa.me/6282176012461?text=Halo, saya tertarik dengan layanan NurdiansyahLabs"
                            target="_blank" rel="noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: '#166534', color: '#fff', padding: '0.7rem 1.5rem',
                                borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none'
                            }}
                        >
                            <MessageCircle size={18} /> Konsultasi Gratis via WhatsApp
                        </a>
                    </div>
                </div>

                {/* Article body */}
                <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0' }}>
                        {renderContent(post.content)}
                    </div>

                    {/* FAQ Section */}
                    {post.faqs.length > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                                Pertanyaan Umum (FAQ)
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {post.faqs.map((faq, i) => (
                                    <m.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid #e2e8f0' }}
                                    >
                                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>❓ {faq.q}</div>
                                        <div style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.6 }}>{faq.a}</div>
                                    </m.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA Card */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            marginTop: '2rem', background: `linear-gradient(135deg, ${getSafeAccent(post.accent)}, #0f172a)`,
                            borderRadius: '16px', padding: '2rem', color: '#fff', textAlign: 'center'
                        }}
                    >
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                            Siap Mulai Proyek Anda?
                        </div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '1.25rem' }}>
                            Konsultasi gratis, tanpa komitmen. Respon cepat Senin–Sabtu 09:00–18:00 WIB.
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer"
                                style={{ background: '#166534', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>
                                <MessageCircle size={18} /> WhatsApp
                            </a>
                            <Link to="/" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.65rem 1.4rem', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>
                                Lihat Portofolio
                            </Link>
                        </div>
                    </m.div>

                    {/* Schema.org FAQ hidden markup for SEO */}
                    {post.faqs.length > 0 && (
                        <script type="application/ld+json" dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'FAQPage',
                                mainEntity: post.faqs.map(f => ({
                                    '@type': 'Question',
                                    name: f.q,
                                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                                }))
                            })
                        }} />
                    )}
                </div>
            </div>
        )
    }
}
