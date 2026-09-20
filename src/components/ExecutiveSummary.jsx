import React, { useState } from 'react'
import { FileText, ChevronDown, ChevronUp, Layers, CheckCircle, ExternalLink, Globe } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * ExecutiveTechnicalSummary Component
 * 
 * Provides an evidence-dense, self-contained technical passage (~135-165 words)
 * adhering to Princeton GEO and Claude SEO research criteria for maximum
 * AI search citability, entity clarity, and human SXO transparency.
 */
export default function ExecutiveSummary({ 
    title, 
    category, 
    summary, 
    metrics = [], 
    stack = [],
    subdomain = null,
    subdomainHost = null
}) {
    const [isExpanded, setIsExpanded] = useState(true)
    const { isIndo } = useLanguage()

    if (!summary) return null

    return (
        <aside 
            aria-label={`Executive Technical Summary: ${title}`}
            style={{
                maxWidth: '1200px',
                margin: '1.5rem auto',
                padding: '0 1rem'
            }}
        >
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
            }}>
                <header 
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            padding: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FileText size={18} color="#a5b4fc" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700 }}>
                                {isIndo ? 'Arsitektur & Brief Rekayasa' : 'Architecture & Engineering Brief'}
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                                {isIndo ? `Ringkasan Teknis Eksekutif: ${title}` : `Executive Technical Summary: ${title}`}
                            </h2>
                        </div>
                    </div>
                    <button 
                        type="button"
                        aria-label={isExpanded
                            ? (isIndo ? 'Perkecil ringkasan eksekutif' : 'Collapse executive summary')
                            : (isIndo ? 'Perbesar ringkasan eksekutif' : 'Expand executive summary')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </header>

                {isExpanded && (
                    <div style={{ padding: '1.5rem' }}>
                        {subdomain && (
                            <div style={{
                                marginBottom: '1.25rem',
                                padding: '0.75rem 1.25rem',
                                background: '#f0fdf4',
                                borderRadius: '12px',
                                border: '1.5px solid #bbf7d0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.75rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: '#dcfce7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Globe size={18} color="#16a34a" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {isIndo ? 'Subdomain Langsung' : 'Live Subdomain Deployment'}
                                        </div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#14532d' }}>
                                            {subdomainHost || subdomain.replace('https://', '')}
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={subdomain}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: '#166534',
                                        color: '#ffffff',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        boxShadow: '0 2px 8px rgba(22, 101, 52, 0.25)',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <span>{isIndo ? 'Buka Subdomain Penuh' : 'Launch Full Subdomain'}</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        )}
                        <p style={{
                            fontSize: '0.95rem',
                            lineHeight: 1.7,
                            color: '#334155',
                            margin: '0 0 1.25rem 0',
                            fontWeight: 450
                        }}>
                            {summary}
                        </p>

                        {(metrics.length > 0 || stack.length > 0) && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                gap: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid #f1f5f9'
                            }}>
                                {metrics.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                            {isIndo ? 'Tolok Ukur Teknis Utama' : 'Key Technical Benchmarks'}
                                        </div>
                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e293b', fontSize: '0.88rem', lineHeight: 1.6 }}>
                                            {metrics.map((m, idx) => (
                                                <li key={idx} style={{ marginBottom: '4px' }}>{m}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {stack.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                            {isIndo ? 'Stack Produksi Terverifikasi' : 'Verified Production Stack'}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {stack.map((item, idx) => (
                                                <span 
                                                    key={idx}
                                                    style={{
                                                        background: '#f1f5f9',
                                                        color: '#1e293b',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 600,
                                                        padding: '4px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e2e8f0'
                                                    }}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    )
}
