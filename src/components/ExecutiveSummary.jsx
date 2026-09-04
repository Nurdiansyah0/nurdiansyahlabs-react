import React, { useState } from 'react'
import { FileText, ChevronDown, ChevronUp, Layers, CheckCircle } from 'lucide-react'

/**
 * ExecutiveTechnicalSummary Component
 * 
 * Provides an evidence-dense, self-contained technical passage (~135-165 words)
 * adhering to Princeton GEO and Claude SEO research criteria for maximum
 * AI search citability, entity clarity, and human SXO transparency.
 */
export default function ExecutiveSummary({ title, category, summary, metrics = [], stack = [] }) {
    const [isExpanded, setIsExpanded] = useState(true)

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
                                Architecture & Engineering Brief
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                                Executive Technical Summary: {title}
                            </h2>
                        </div>
                    </div>
                    <button 
                        type="button"
                        aria-label={isExpanded ? "Collapse executive summary" : "Expand executive summary"}
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
                                            Key Technical Benchmarks
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
                                            Verified Production Stack
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
