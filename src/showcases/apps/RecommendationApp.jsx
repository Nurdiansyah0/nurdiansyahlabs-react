/**
 * RecommendationApp.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-world Hybrid Recommendation Engine Showcase
 * Architecture: React → PHP Bridge → Python FastAPI (SVD + TF-IDF)
 *
 * Features:
 *  - User profile switcher (8 personas)
 *  - Method selector: Hybrid / Collaborative / Content-Based
 *  - Category filter
 *  - Live Like/Dislike feedback with re-ranking
 *  - Explainability panel (why was this recommended?)
 *  - Service status indicator (ML service online/offline)
 */
import { useState, useEffect, useCallback, useMemo } from 'react'

// ── Constants & Helpers ──────────────────────────────────────────────────────
const API_BASE = '/api/recommend.php'
const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
const fmtSold = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

const METHOD_OPTIONS = [
    { key: 'hybrid', label: '🔀 Hybrid', desc: 'SVD + TF-IDF combined (best accuracy)' },
    { key: 'collaborative', label: '👥 Collaborative', desc: 'Based on users like you' },
    { key: 'content', label: '📄 Content-Based', desc: 'Based on product similarity' },
]

const CATEGORY_EMOJIS = {
    'Laptop': '💻', 'Smartphone': '📱', 'Audio': '🎧', 'Monitor': '🖥️',
    'Aksesori': '⌨️', 'Tablet': '📟', 'Sepatu': '👟', 'Celana': '👖',
    'Kemeja': '👔', 'Kaos': '👕', 'Jam Tangan': '⌚', 'Koper': '🧳',
    'Elektronik Rumah': '🏠', 'Dapur': '🍳', 'Olahraga': '🏋️',
    'Suplemen': '💊', 'Buku': '📚', 'Kamera': '📷', 'Gaming': '🎮',
}

// ── Fetch hooks ──────────────────────────────────────────────────────────────
async function apiFetch(action, { method = 'GET', body } = {}) {
    const url = `${API_BASE}?action=${action}`
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
    }
    const res = await fetch(url, opts)
    return res.json()
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ServiceBadge({ online, mode }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '999px',
            background: online ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${online ? '#10b981' : '#ef4444'}`,
            fontSize: '0.72rem', fontWeight: 700, color: online ? '#10b981' : '#ef4444',
        }}>
            <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: online ? '#10b981' : '#ef4444',
                boxShadow: online ? '0 0 6px #10b981' : 'none',
                animation: online ? 'pulse 2s infinite' : 'none',
                display: 'inline-block',
            }} />
            {online ? `RecoEngine ${mode || 'Online'}` : 'ML Service Offline'}
        </div>
    )
}

function ScoreBar({ label, value, max = 1, color }) {
    const pct = Math.min(100, (value / max) * 100)
    return (
        <div style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280', marginBottom: '3px' }}>
                <span>{label}</span><span>{(value * 100).toFixed(1)}%</span>
            </div>
            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
        </div>
    )
}

function ProductCard({ product, onFeedback, onExplain, isNew }) {
    const emoji = CATEGORY_EMOJIS[product.category] || '📦'
    const [fbState, setFbState] = useState(null)

    const handleFb = (type) => {
        setFbState(type)
        onFeedback(product.id, type)
    }

    return (
        <div style={{
            background: '#fff', borderRadius: '16px',
            border: isNew ? '2px solid #7c3aed' : '1px solid #e5e7eb',
            overflow: 'hidden', transition: 'all 0.25s ease',
            boxShadow: isNew ? '0 0 0 3px rgba(124,58,237,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = isNew ? '0 0 0 3px rgba(124,58,237,0.08)' : '0 2px 8px rgba(0,0,0,0.04)'}
        >
            {/* Card Header (Image) */}
            <div style={{
                height: 160, position: 'relative', background: '#f3f4f6',
                backgroundImage: `url(${product.imageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                borderBottom: '1px solid #e5e7eb'
            }}>
                {isNew && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#7c3aed', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 99, letterSpacing: '0.05em', zIndex: 10 }}>
                        NEW RECO
                    </div>
                )}

                {/* Fallback pattern if image is missing */}
                {!product.imageUrl && (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justify: 'center', background: 'linear-gradient(135deg, #f8f7ff, #ede9fe)' }}>
                        <div style={{ fontSize: '3rem', opacity: 0.8 }}>{emoji}</div>
                    </div>
                )}

                {/* Category Badge over Image */}
                <div style={{
                    position: 'absolute', bottom: 8, left: 8,
                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                    padding: '2px 8px', borderRadius: 6,
                    fontSize: '0.65rem', color: '#5b21b6', fontWeight: 700, letterSpacing: '0.05em'
                }}>
                    {emoji} {product.category}
                </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Brand & Name */}
                <div>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{product.brand}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e1b4b', lineHeight: 1.25, marginTop: 2 }}>{product.name}</div>
                </div>

                {/* Price & Sold */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#7c3aed', fontSize: '1rem' }}>{fmt(product.price)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>⭐ {product.rating} · {fmtSold(product.sold)} sold</div>
                </div>

                {/* Reason chip */}
                <div style={{
                    background: '#f5f3ff', border: '1px solid #ddd6fe',
                    borderRadius: 8, padding: '6px 10px',
                    fontSize: '0.7rem', color: '#5b21b6', lineHeight: 1.4,
                }}>
                    💡 {product.reason}
                </div>

                {/* Score bars */}
                {product.score != null && (
                    <div style={{ marginTop: '4px' }}>
                        <ScoreBar label="Hybrid Score" value={product.score} color="#7c3aed" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ padding: '10px 1rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '6px' }}>
                <button onClick={() => handleFb('like')} style={{
                    flex: 1, padding: '7px 0', border: 'none', borderRadius: 8,
                    background: fbState === 'like' ? '#d1fae5' : '#f3f4f6',
                    color: fbState === 'like' ? '#059669' : '#374151',
                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s',
                }}>👍 Like</button>
                <button onClick={() => handleFb('dislike')} style={{
                    flex: 1, padding: '7px 0', border: 'none', borderRadius: 8,
                    background: fbState === 'dislike' ? '#fee2e2' : '#f3f4f6',
                    color: fbState === 'dislike' ? '#dc2626' : '#374151',
                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s',
                }}>👎 Pass</button>
                <button onClick={() => onExplain(product)} style={{
                    padding: '7px 10px', border: 'none', borderRadius: 8,
                    background: '#f3f4f6', color: '#374151',
                    fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                }}>🔍</button>
            </div>
        </div>
    )
}

function ExplainPanel({ data, onClose }) {
    if (!data) return null
    const { product, cf_score, top_similar_products, explanation } = data
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={onClose}>
            <div style={{
                background: '#fff', borderRadius: '20px', maxWidth: 520, width: '100%',
                padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>EXPLAINABILITY REPORT</div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b' }}>{product?.name}</h3>
                    </div>
                    <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontWeight: 700, color: '#374151' }}>✕ Close</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        ['Category Match', explanation?.category_match ? '✅ Yes' : '❌ No', explanation?.category_match ? '#d1fae5' : '#fee2e2'],
                        ['Brand Match', explanation?.brand_match ? '✅ Yes' : '❌ No', explanation?.brand_match ? '#d1fae5' : '#fef3c7'],
                        ['Popularity Rank', `#${explanation?.popularity_rank}`, '#ede9fe'],
                        ['CF Score', cf_score?.toFixed(3), '#f0f9ff'],
                    ].map(([label, val, bg]) => (
                        <div key={label} style={{ background: bg, borderRadius: 10, padding: '0.75rem' }}>
                            <div style={{ fontSize: '0.68rem', color: '#6b7280', marginBottom: 4 }}>{label}</div>
                            <div style={{ fontWeight: 800, color: '#1e1b4b' }}>{val}</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.75rem' }}>🔗 Similar Products (Content-Based)</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        {(top_similar_products || []).map(p => (
                            <div key={p.id} style={{ border: '1px solid #f3f4f6', borderRadius: 8, overflow: 'hidden' }}>
                                <div style={{ height: 60, background: '#f3f4f6', backgroundImage: `url(${p.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    {!p.imageUrl && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{CATEGORY_EMOJIS[p.category]}</div>}
                                </div>
                                <div style={{ padding: '6px', fontSize: '0.7rem', textAlign: 'center' }}>
                                    <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                    <div style={{ color: '#7c3aed', fontWeight: 800 }}>{fmt(p.price)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: '#f8f7ff', borderRadius: 10, padding: '0.75rem', fontSize: '0.78rem', color: '#5b21b6', lineHeight: 1.6 }}>
                    📊 <strong>Model:</strong> Hybrid SVD Collaborative Filtering (60%) + TF-IDF Content Similarity (40%). CF score reflects latent factor similarity with your interaction history. TF-IDF matches product descriptions, category, and brand tags.
                </div>
            </div>
        </div>
    )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function RecommendationApp() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [method, setMethod] = useState('hybrid')
    const [categories, setCategories] = useState([])
    const [categoryFilter, setCategoryFilter] = useState('')
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const [serviceOnline, setServiceOnline] = useState(null)
    const [serviceMode, setServiceMode] = useState('')
    const [explainData, setExplainData] = useState(null)
    const [newProductIds, setNewProductIds] = useState(new Set())
    const [serviceError, setServiceError] = useState('')
    const [feedbackCount, setFeedbackCount] = useState(0)

    // Check ML service health
    useEffect(() => {
        apiFetch('health')
            .then(d => {
                setServiceOnline(!d.error && d.status === 'ok')
                if (d.service) setServiceMode(d.service.replace('RecoEngine-', ''))
            })
            .catch(() => setServiceOnline(false))
    }, [])

    // Load users & categories
    useEffect(() => {
        apiFetch('users').then(d => {
            if (d.data) {
                setUsers(d.data)
                setSelectedUser(d.data[0])
            }
        })
        apiFetch('categories').then(d => d.data && setCategories(d.data))
    }, [])

    // Load recommendations whenever user/method/category changes
    const fetchRecommendations = useCallback(async (uid, meth, cat) => {
        if (!uid) return
        setLoading(true)
        setServiceError('')
        try {
            const d = await apiFetch('recommend', {
                method: 'POST',
                body: { user_id: uid, limit: 12, method: meth, exclude_seen: true, category_filter: cat || null },
            })
            if (d.error) {
                setServiceError(d.detail || d.error)
                setRecommendations([])
            } else {
                const prev = new Set(recommendations.map(r => r.id))
                const incoming = d.data || []
                const updated = new Set(incoming.filter(p => !prev.has(p.id)).map(p => p.id))
                setNewProductIds(updated)
                setRecommendations(incoming)
                setTimeout(() => setNewProductIds(new Set()), 2500)
            }
        } catch {
            setServiceError('ML service is offline. Start with: cd ml_service && ./start_ml.sh')
        }
        setLoading(false)
    }, [recommendations])

    useEffect(() => {
        if (selectedUser) fetchRecommendations(selectedUser.id, method, categoryFilter)
    }, [selectedUser, method, categoryFilter])

    const handleFeedback = useCallback(async (productId, type) => {
        if (!selectedUser) return
        const d = await apiFetch('feedback', {
            method: 'POST',
            body: { user_id: selectedUser.id, product_id: productId, feedback: type },
        })
        setFeedbackCount(c => c + 1)
        if (d.updated_recommendations) {
            // Merge updated recommendations back (partial re-rank)
            setRecommendations(prev => {
                const updatedMap = Object.fromEntries(d.updated_recommendations.map(r => [r.id, r]))
                return prev.map(r => updatedMap[r.id] || r)
            })
        }
    }, [selectedUser])

    const handleExplain = useCallback(async (product) => {
        const d = await apiFetch(`explain&product_id=${product.id}&user_id=${selectedUser?.id || 'U001'}`)
        setExplainData(d)
    }, [selectedUser])

    const historyProducts = useMemo(() => {
        if (!selectedUser || !selectedUser.history) return []
        return selectedUser.history.map(id => ({ id, name: `Product #${id}` }))
    }, [selectedUser])

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: '#f8f7ff', fontFamily: '"Inter",sans-serif' }}>
            <style>{`
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                .skeleton { background: linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
            `}</style>

            {/* ── Header ── */}
            <div style={{ background: 'linear-gradient(135deg,#4c0591,#7c3aed,#a855f7)', padding: '1.5rem 2rem', color: '#fff' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.68rem', color: '#d8b4fe', letterSpacing: '0.15em', marginBottom: 4 }}>DATA SCIENCE / RECOMMENDATION ENGINE</div>
                            <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>RecoEngine</h1>
                            <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '0.85rem' }}>
                                Hybrid SVD Collaborative Filtering + TF-IDF Content Similarity · Same architecture as Netflix & Tokopedia
                            </p>
                        </div>
                        <ServiceBadge online={serviceOnline} mode={serviceMode} />
                    </div>

                    {/* Architecture pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Python FastAPI', 'SVD (TruncatedSVD)', 'TF-IDF + Cosine Sim', 'PHP Bridge', 'Live Feedback Loop'].map(tag => (
                            <div key={tag} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', borderRadius: 999, fontSize: '0.68rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 2rem' }}>

                {/* ── Service offline warning ── */}
                {serviceError && (
                    <div style={{ background: '#fff3cd', border: '1px solid #f59e0b', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 4 }}>ML Service Not Running</div>
                            <div style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.6 }}>{serviceError}</div>
                            <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.78rem', background: '#fef3c7', borderRadius: 6, padding: '6px 10px', color: '#92400e' }}>
                                cd ml_service && ./start_ml.sh
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Controls Row ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

                    {/* User selector */}
                    <div style={{ background: '#fff', borderRadius: 14, padding: '1rem 1.25rem', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>👤 USER PROFILE</div>
                        <select
                            value={selectedUser?.id || ''}
                            onChange={e => setSelectedUser(users.find(u => u.id === e.target.value))}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#1e1b4b', fontWeight: 600, background: '#f8f7ff', outline: 'none', cursor: 'pointer' }}
                        >
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        {selectedUser && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.4 }}>
                                🎭 {selectedUser.persona}
                                <br />
                                📦 {selectedUser.history?.length} purchased items in history
                            </div>
                        )}
                    </div>

                    {/* Method selector */}
                    <div style={{ background: '#fff', borderRadius: 14, padding: '1rem 1.25rem', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🧠 ML METHOD</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {METHOD_OPTIONS.map(m => (
                                <button key={m.key} onClick={() => setMethod(m.key)} style={{
                                    textAlign: 'left', padding: '8px 10px', border: `1.5px solid ${method === m.key ? '#7c3aed' : '#e5e7eb'}`,
                                    borderRadius: 8, background: method === m.key ? '#f5f3ff' : '#fff',
                                    cursor: 'pointer', transition: 'all 0.15s',
                                }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: method === m.key ? '#7c3aed' : '#374151' }}>{m.label}</div>
                                    <div style={{ fontSize: '0.68rem', color: '#6b7280' }}>{m.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category & Stats */}
                    <div style={{ background: '#fff', borderRadius: 14, padding: '1rem 1.25rem', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🗂️ FILTER CATEGORY</div>
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#1e1b4b', background: '#f8f7ff', outline: 'none', cursor: 'pointer', marginBottom: '0.75rem' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c] || '📦'} {c}</option>)}
                        </select>

                        {/* Stats chips */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {[
                                ['🎯 Results', recommendations.length],
                                ['💬 Feedbacks', feedbackCount],
                                ['📦 Products', 50],
                                ['👥 Users', users.length],
                            ].map(([label, val]) => (
                                <div key={label} style={{ background: '#f8f7ff', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#7c3aed' }}>{val}</div>
                                    <div style={{ fontSize: '0.62rem', color: '#6b7280' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Results header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b' }}>
                            Recommended for {selectedUser?.name?.split(' – ')[0] || '…'}
                        </h2>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                            Method: <strong style={{ color: '#7c3aed' }}>{method}</strong> · {recommendations.length} products ranked
                            {feedbackCount > 0 && <span style={{ color: '#10b981', marginLeft: 8 }}>✨ Model updated from {feedbackCount} feedback(s)</span>}
                        </div>
                    </div>
                    <button onClick={() => fetchRecommendations(selectedUser?.id, method, categoryFilter)} style={{
                        padding: '8px 16px', background: '#7c3aed', color: '#fff', border: 'none',
                        borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    }}>
                        {loading ? '⚙️ Computing…' : '🔄 Refresh'}
                    </button>
                </div>

                {/* ── Product grid ── */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', height: 320 }}>
                                <div className="skeleton" style={{ height: 120 }} />
                                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                                    <div className="skeleton" style={{ height: 14, width: '55%' }} />
                                    <div className="skeleton" style={{ height: 40 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : recommendations.length === 0 && !serviceError ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>No recommendations found</div>
                        <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Try a different category or algorithm</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {recommendations.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onFeedback={handleFeedback}
                                onExplain={handleExplain}
                                isNew={newProductIds.has(product.id)}
                            />
                        ))}
                    </div>
                )}

                {/* ── Architecture explainer ── */}
                <div style={{ marginTop: '2.5rem', background: '#1e1b4b', borderRadius: 20, padding: '2rem', color: '#fff' }}>
                    <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 800 }}>🏗️ System Architecture</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        {[
                            { icon: '⚛️', title: 'React Frontend', desc: 'useCallback, useMemo optimized. Real-time feedback loop with partial re-ranking.' },
                            { icon: '🐘', title: 'PHP Bridge', desc: 'Sanitizes & proxies requests via cURL. Acts as secure API gateway to ML service.' },
                            { icon: '🐍', title: 'Python FastAPI', desc: 'Trains SVD + TF-IDF on startup. Serves recommendations in <10ms after training.' },
                            { icon: '📐', title: 'SVD (Collaborative)', desc: 'TruncatedSVD decomposes user×product matrix into latent factors for user similarity.' },
                            { icon: '📝', title: 'TF-IDF (Content)', desc: 'Vectorizes product names, category, brand, tags. Cosine similarity finds similar items.' },
                            { icon: '🔀', title: 'Hybrid (60/40)', desc: 'Weighted blend: 60% CF + 40% CB. Live feedback applies delta scores without retraining.' },
                        ].map(item => (
                            <div key={item.title} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>{item.title}</div>
                                <div style={{ fontSize: '0.72rem', color: '#a78bfa', lineHeight: 1.6 }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Explain Modal ── */}
            <ExplainPanel data={explainData} onClose={() => setExplainData(null)} />
        </div>
    )
}
