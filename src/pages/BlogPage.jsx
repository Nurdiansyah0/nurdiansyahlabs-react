import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { m } from 'framer-motion'
import { 
    ArrowLeft, Calendar, Clock, User, Share2, 
    CheckCircle2, MessageCircle, Terminal, ChevronRight, 
    Check, Copy, Sparkles, ShieldCheck, ArrowRight
} from 'lucide-react'
import { useTracker } from '../hooks/useTracker'
import { getOptimizedImg } from '../utils/imgHelper'
import { useLanguage } from '../i18n/LanguageContext'
import { getFallbackPost, INITIAL_BLOG_POSTS } from '../data/blogData'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/seo/SEO'

// Enhanced Markdown to JSX Parser supporting code blocks, links, tables, lists, and headings
function parseMarkdownToElements(text) {
    if (!text) return null
    const lines = text.trim().split('\n')
    const elements = []
    let inCodeBlock = false
    let codeLanguage = ''
    let codeBuffer = []
    let inList = false
    let listType = 'ul'
    let listBuffer = []

    const flushList = () => {
        if (!inList || listBuffer.length === 0) return
        const ListTag = listType === 'ol' ? 'ol' : 'ul'
        elements.push(
            <ListTag 
                key={`list-${elements.length}`} 
                style={{ 
                    paddingLeft: '1.5rem', 
                    margin: '1rem 0 1.5rem', 
                    color: '#CBD5E1', 
                    lineHeight: 1.7 
                }}
            >
                {listBuffer.map((item, idx) => (
                    <li 
                        key={idx} 
                        style={{ marginBottom: '0.4rem' }} 
                        dangerouslySetInnerHTML={{ __html: item }} 
                    />
                ))}
            </ListTag>
        )
        listBuffer = []
        inList = false
    }

    const flushCodeBlock = () => {
        if (!inCodeBlock) return
        const codeString = codeBuffer.join('\n')
        elements.push(
            <CodeBlock 
                key={`code-${elements.length}`} 
                language={codeLanguage} 
                code={codeString} 
            />
        )
        codeBuffer = []
        inCodeBlock = false
    }

    // Helper to format inline markdown (bold, italic, inline code, links)
    const formatInline = (str) => {
        return str
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #F8FAFC; font-weight: 700;">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em style="color: #E2E8F0;">$1</em>')
            // Inline Code
            .replace(/`([^`]+)`/g, '<code style="background: rgba(99, 102, 241, 0.15); color: #A5B4FC; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; border: 1px solid rgba(99, 102, 241, 0.2);">$1</code>')
            // Markdown Links [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, anchor, url) => {
                const isExternal = url.startsWith('http')
                return `<a href="${url}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} style="color: #818CF8; text-decoration: underline; text-underline-offset: 3px; font-weight: 600;">${anchor}</a>`
            })
    }

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i]
        const trimmed = rawLine.trim()

        // Code block toggle ```lang
        if (trimmed.startsWith('```')) {
            if (inCodeBlock) {
                flushCodeBlock()
            } else {
                flushList()
                inCodeBlock = true
                codeLanguage = trimmed.slice(3).trim() || 'bash'
            }
            continue
        }

        if (inCodeBlock) {
            codeBuffer.push(rawLine)
            continue
        }

        // Horizontal Rule
        if (trimmed === '---' || trimmed === '***') {
            flushList()
            elements.push(
                <hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '2.5rem 0' }} />
            )
            continue
        }

        // Unordered List (- or *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            if (!inList || listType !== 'ul') {
                flushList()
                inList = true
                listType = 'ul'
            }
            listBuffer.push(formatInline(trimmed.slice(2)))
            continue
        }

        // Ordered List (1. 2.)
        const matchNumbered = trimmed.match(/^(\d+)\.\s+(.*)$/)
        if (matchNumbered) {
            if (!inList || listType !== 'ol') {
                flushList()
                inList = true
                listType = 'ol'
            }
            listBuffer.push(formatInline(matchNumbered[2]))
            continue
        }

        // End list if a non-list item is reached
        flushList()

        if (!trimmed) continue

        // Headings
        if (trimmed.startsWith('#### ')) {
            elements.push(
                <h4 key={`h4-${i}`} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F1F5F9', marginTop: '1.8rem', marginBottom: '0.6rem' }}>
                    {trimmed.slice(5)}
                </h4>
            )
        } else if (trimmed.startsWith('### ')) {
            elements.push(
                <h3 key={`h3-${i}`} style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC', marginTop: '2.2rem', marginBottom: '0.8rem', letterSpacing: '-0.01em' }}>
                    {trimmed.slice(4)}
                </h3>
            )
        } else if (trimmed.startsWith('## ')) {
            elements.push(
                <h2 key={`h2-${i}`} style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2.8rem', marginBottom: '1rem', letterSpacing: '-0.02em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                    {trimmed.slice(3)}
                </h2>
            )
        } else if (trimmed.startsWith('> ')) {
            // Blockquote
            elements.push(
                <blockquote 
                    key={`quote-${i}`} 
                    style={{ 
                        borderLeft: '4px solid #6366F1', 
                        background: 'rgba(99, 102, 241, 0.07)', 
                        padding: '1rem 1.25rem', 
                        margin: '1.5rem 0', 
                        borderRadius: '0 8px 8px 0', 
                        color: '#CBD5E1', 
                        fontStyle: 'italic' 
                    }}
                    dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }}
                />
            )
        } else if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            // Table Row
            if (trimmed.includes('---')) continue // divider
            const cells = trimmed.split('|').filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1)
            elements.push(
                <div key={`table-row-${i}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: '8px', padding: '10px 12px', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.9rem', color: '#CBD5E1' }}>
                    {cells.map((c, cIdx) => (
                        <div key={cIdx} dangerouslySetInnerHTML={{ __html: formatInline(c.trim()) }} />
                    ))}
                </div>
            )
        } else {
            // Standard Paragraph
            elements.push(
                <p 
                    key={`p-${i}`} 
                    style={{ color: '#CBD5E1', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '1.02rem' }}
                    dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} 
                />
            )
        }
    }

    flushList()
    flushCodeBlock()
    return elements
}

// Code Block with Copy Action
function CodeBlock({ language, code }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div style={{
            margin: '1.75rem 0', borderRadius: '12px', overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)', background: '#030712'
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 16px', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {language || 'code'}
                </span>
                <button
                    onClick={handleCopy}
                    style={{
                        background: 'transparent', border: 'none', color: '#94A3B8',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.75rem', transition: 'color 0.2s'
                    }}
                >
                    {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                    <span style={{ color: copied ? '#10B981' : 'inherit' }}>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
            </div>
            <pre style={{
                padding: '1rem 1.25rem', margin: 0, overflowX: 'auto',
                fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.6, fontFamily: 'monospace'
            }}>
                <code>{code}</code>
            </pre>
        </div>
    )
}

export default function BlogPage() {
    const { geo, langSlug, slug } = useParams()
    const { trackEvent } = useTracker()
    const { isIndo } = useLanguage()

    const actualSlug = langSlug && geo ? `${geo}/${langSlug}` : slug
    const fallback = useMemo(() => getFallbackPost(actualSlug), [actualSlug])

    const [post, setPost] = useState(fallback)
    const [loading, setLoading] = useState(!fallback)

    // Background fetch to sync with remote API if article exists in DB
    useEffect(() => {
        let isMounted = true
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/v1/posts?slug=${actualSlug}`)
                if (res.ok) {
                    const data = await res.json()
                    if (isMounted && data && data.title) {
                        setPost(data)
                    }
                }
            } catch (err) {
                // Keep local fallback post silently
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchPost()
        return () => { isMounted = false }
    }, [actualSlug])

    // Dwell Time Tracking for SEO signals
    useEffect(() => {
        if (!post) return
        const timer = setTimeout(() => {
            trackEvent('read_article', { slug: actualSlug, title: post.title, duration: 15 })
        }, 15000)
        return () => clearTimeout(timer)
    }, [actualSlug, post, trackEvent])

    // Current page data
    const activePost = post || {
        slug: actualSlug,
        title: `${actualSlug.replace(/-/g, ' ').toUpperCase()} | NurdiansyahLabs`,
        description: 'Artikel rekayasa software enterprise dan sistem arsitektur oleh NurdiansyahLabs.',
        content: `Informasi teknis untuk **${actualSlug.replace(/-/g, ' ')}** sedang disinkronkan dari repositori sistem. Silakan hubungi kami untuk konsultasi arsitektur langsung.`,
        category: 'Enterprise Engineering',
        author: 'Nurdiansyah',
        publishedAt: '2026-04-01'
    }

    const pageUrl = `https://nurdiansyahlabs.com/blog/${actualSlug}`

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070A0F', color: '#F8FAFC' }}>
            <SEO
                title={`${activePost.title}`}
                description={activePost.description}
                canonical={`/blog/${actualSlug}`}
                type="article"
                image={activePost.img}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Blog', url: '/blog' },
                    { name: activePost.title, url: `/blog/${actualSlug}` }
                ]}
                additionalSchemas={[
                    {
                        "@type": "TechArticle",
                        "@id": `${pageUrl}#article`,
                        "headline": activePost.title,
                        "description": activePost.description,
                        "url": pageUrl,
                        "inLanguage": "id-ID",
                        "author": {
                            "@type": "Person",
                            "@id": "https://nurdiansyahlabs.com/#person",
                            "name": "Nurdiansyah",
                            "jobTitle": "Enterprise Software Engineer & Systems Architect",
                            "url": "https://nurdiansyahlabs.com"
                        },
                        "publisher": {
                            "@type": "ProfessionalService",
                            "@id": "https://nurdiansyahlabs.com/#service",
                            "name": "NurdiansyahLabs"
                        },
                        "datePublished": activePost.publishedAt || "2026-03-15",
                        "dateModified": new Date().toISOString().split('T')[0]
                    }
                ]}
            />

            <Navbar />

            {/* Breadcrumb Navigation Bar */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.85)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.75rem 1.5rem', backdropFilter: 'blur(8px)'
            }}>
                <div className="container" style={{
                    maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.82rem', color: '#94A3B8', flexWrap: 'wrap'
                }}>
                    <Link to="/" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 600 }}>Beranda</Link>
                    <ChevronRight size={14} />
                    <Link to="/blog" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 600 }}>Blog</Link>
                    <ChevronRight size={14} />
                    <span style={{ color: '#CBD5E1', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activePost.title}
                    </span>
                </div>
            </div>

            {/* Main Article Container */}
            <main style={{ flex: 1, padding: '3rem 1.5rem 5rem' }}>
                <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
                    {/* Back link */}
                    <Link 
                        to="/blog" 
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: '#94A3B8', textDecoration: 'none', fontSize: '0.88rem',
                            fontWeight: 600, marginBottom: '2rem', transition: 'color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                    >
                        <ArrowLeft size={16} /> {isIndo ? 'Kembali ke Semua Artikel' : 'Back to All Articles'}
                    </Link>

                    {/* Article Header */}
                    <header style={{ marginBottom: '2.5rem' }}>
                        {activePost.category && (
                            <div style={{
                                display: 'inline-block', padding: '4px 12px', borderRadius: '6px',
                                background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#A5B4FC', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.04em', marginBottom: '1rem'
                            }}>
                                {activePost.category}
                            </div>
                        )}

                        <h1 style={{
                            fontSize: 'clamp(2rem, 4.5vw, 2.9rem)', fontWeight: 900,
                            color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '1.25rem'
                        }}>
                            {activePost.title}
                        </h1>

                        <p style={{ fontSize: '1.15rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            {activePost.description}
                        </p>

                        {/* Author & Metadata Strip */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap',
                            paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '0.85rem', color: '#64748B'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontWeight: 600 }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%', background: '#312E81',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#A5B4FC'
                                }}>
                                    N
                                </div>
                                {activePost.author || 'Nurdiansyah'}
                            </div>

                            {activePost.publishedAt && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Calendar size={14} />
                                    <span>{activePost.publishedAt}</span>
                                </div>
                            )}

                            {activePost.readTime && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Clock size={14} />
                                    <span>{activePost.readTime}</span>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Article Body Card */}
                    <article style={{
                        background: 'rgba(15, 23, 42, 0.65)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px', padding: 'clamp(1.5rem, 4vw, 2.75rem)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)', marginBottom: '3rem'
                    }}>
                        {parseMarkdownToElements(activePost.content)}
                    </article>

                    {/* FAQs Section if present */}
                    {activePost.faqs && activePost.faqs.length > 0 && (
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '1.25rem' }}>
                                {isIndo ? 'Pertanyaan yang Sering Diajukan (FAQ)' : 'Frequently Asked Questions'}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {activePost.faqs.map((faq, idx) => (
                                    <div 
                                        key={idx}
                                        style={{
                                            background: 'rgba(15, 23, 42, 0.65)', borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem 1.5rem'
                                        }}
                                    >
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '0.5rem' }}>
                                            {faq.q}
                                        </h3>
                                        <p style={{ fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Author E-E-A-T Credibility Box */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        borderRadius: '16px', padding: '1.75rem',
                        display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '3rem'
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%', background: '#1E1B4B',
                            border: '2px solid #6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontWeight: 900, fontSize: '1.2rem', color: '#A5B4FC'
                        }}>
                            NL
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Ditulis &amp; Ditinjau Oleh
                            </div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', margin: '2px 0 6px' }}>
                                Nurdiansyah
                            </div>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
                                Enterprise Software Engineer &amp; Systems Architect di NurdiansyahLabs. Mengawal arsitektur sistem skala produksi, database terdistribusi, dan siklus penuh Full SDLC dari perancangan hingga deployment.
                            </p>
                        </div>
                    </div>

                    {/* Contextual Related Systems from Portfolio */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '16px', padding: '1.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '3rem'
                    }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                            Implementasi Nyata pada Portofolio Kami
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                            <Link to="/showcase/fullstack/primatera-poultry" style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#F8FAFC', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>🐔 Primatera Poultry ERP</span>
                                <ArrowRight size={14} color="#818CF8" />
                            </Link>
                            <Link to="/showcase/fullstack/warehouse-wms" style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#F8FAFC', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>📦 LogiStack Warehouse WMS</span>
                                <ArrowRight size={14} color="#818CF8" />
                            </Link>
                            <Link to="/services/web-development" style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#F8FAFC', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>💻 Rekayasa Software Enterprise</span>
                                <ArrowRight size={14} color="#818CF8" />
                            </Link>
                        </div>
                    </div>

                    {/* High-Impact Enterprise CTA */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '20px',
                        padding: '2.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.6rem' }}>
                            {isIndo ? 'Siap Merancang Arsitektur Software Perusahaan Anda?' : 'Ready to Engineer Your Enterprise Software?'}
                        </h3>
                        <p style={{ fontSize: '0.98rem', color: '#CBD5E1', maxWidth: '580px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                            {isIndo
                                ? 'Konsultasi arsitektur sistem, audit kode, dan analisis kebutuhan bersama kami. Bebas komitmen, langsung berbicara dengan engineer.'
                                : 'Discuss your system architecture, technical requirements, or software overhaul directly with our software architect.'}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a 
                                href="https://wa.me/6282176012461?text=Halo%20NurdiansyahLabs,%20saya%20ingin%20konsultasi%20mengenai%20rekayasa%20software%20enterprise." 
                                target="_blank" 
                                rel="noreferrer"
                                style={{
                                    background: '#16A34A', color: '#FFFFFF', padding: '12px 24px',
                                    borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
                                    display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem'
                                }}
                            >
                                <MessageCircle size={18} /> {isIndo ? 'Konsultasi Teknis via WhatsApp' : 'WhatsApp Consultation'}
                            </a>
                            <Link 
                                to="/"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', padding: '12px 24px',
                                    borderRadius: '12px', fontWeight: 700, textDecoration: 'none',
                                    border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.95rem'
                                }}
                            >
                                {isIndo ? 'Eksplorasi Portofolio' : 'Explore Portfolio'}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
