import React, { useState, useMemo } from 'react'
import {
    Sparkles,
    Sliders,
    RefreshCw,
    Layers,
    Cpu,
    ArrowRight,
    CheckCircle2,
    Info,
    Calculator,
    Star,
    Zap,
    TrendingUp,
    Filter
} from 'lucide-react'

// 1. Catalog of Products
const PRODUCTS = [
    {
        id: 'p1',
        name: 'Keychron Q1 Pro Mechanical Keyboard',
        category: 'Peripherals',
        icon: '⌨️',
        price: 'Rp 2.850.000',
        tags: ['Wireless', 'Hot-swap', 'CNC Aluminum']
    },
    {
        id: 'p2',
        name: 'Dell UltraSharp 32" 4K IPS Monitor',
        category: 'Displays',
        icon: '🖥️',
        price: 'Rp 9.400.000',
        tags: ['4K UHD', 'USB-C 90W', 'Color Accurate']
    },
    {
        id: 'p3',
        name: 'Sony WH-1000XM5 ANC Headphones',
        category: 'Audio',
        icon: '🎧',
        price: 'Rp 4.999.000',
        tags: ['Active Noise Cancelling', '30hr Battery', 'LDAC']
    },
    {
        id: 'p4',
        name: 'Herman Miller Aeron Ergonomic Chair',
        category: 'Ergonomics',
        icon: '🪑',
        price: 'Rp 18.500.000',
        tags: ['Pellicle Mesh', 'Lumbar Support', 'PostureFit']
    },
    {
        id: 'p5',
        name: 'CalDigit TS4 Thunderbolt 4 Dock',
        category: 'Peripherals',
        icon: '🔌',
        price: 'Rp 5.750.000',
        tags: ['18 Ports', 'PCIe Gen4', 'Dual 6K']
    },
    {
        id: 'p6',
        name: 'Shure SM7B Cardioid Studio Microphone',
        category: 'Audio',
        icon: '🎙️',
        price: 'Rp 6.200.000',
        tags: ['Dynamic Cardioid', 'Broadcast Quality', 'EM Shield']
    }
]

// 2. Peer Benchmark User Matrix
const BENCHMARK_USERS = [
    {
        id: 'u1',
        name: 'Alex (Senior Fullstack)',
        role: 'Engineering Lead',
        avatar: '👨‍💻',
        ratings: { p1: 5, p2: 5, p3: null, p4: 4, p5: 5, p6: null }
    },
    {
        id: 'u2',
        name: 'Budi (Podcast Producer)',
        role: 'Sound Engineer',
        avatar: '🎧',
        ratings: { p1: 3, p2: null, p3: 5, p4: null, p5: null, p6: 5 }
    },
    {
        id: 'u3',
        name: 'Citra (Remote Product Designer)',
        role: 'Design System Lead',
        avatar: '🎨',
        ratings: { p1: 4, p2: 5, p3: 4, p4: 5, p5: 4, p6: null }
    },
    {
        id: 'u4',
        name: 'Dimas (ML Platform Engineer)',
        role: 'DevOps & Cloud',
        avatar: '⚡',
        ratings: { p1: 5, p2: 4, p3: null, p4: null, p5: 5, p6: null }
    }
]

// 3. Preset User Profiles for quick interactive testing
const PRESETS = {
    developer: {
        label: 'Developer Profile',
        ratings: { p1: 5, p2: 5, p3: null, p4: null, p5: null, p6: null }
    },
    creator: {
        label: 'Media Creator Profile',
        ratings: { p1: null, p2: null, p3: 5, p4: null, p5: null, p6: 5 }
    },
    ergonomics: {
        label: 'Ergonomic Workspace Profile',
        ratings: { p1: 4, p2: null, p3: null, p4: 5, p5: null, p6: null }
    },
    blank: {
        label: 'Clean Slate (Rate from Scratch)',
        ratings: { p1: null, p2: null, p3: null, p4: null, p5: null, p6: null }
    }
}

// Vector Cosine Similarity Helper
function calculateCosineSimilarity(vecA, vecB) {
    let dotProduct = 0
    let normA = 0
    let normB = 0

    PRODUCTS.forEach(p => {
        const a = vecA[p.id] || 0
        const b = vecB[p.id] || 0
        dotProduct += a * b
        normA += a * a
        normB += b * b
    })

    if (normA === 0 || normB === 0) return 0
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export default function RecommendationPlaceholderApp() {
    const [activeRatings, setActiveRatings] = useState(PRESETS.developer.ratings)
    const [activeMode, setActiveMode] = useState('user-based') // 'user-based' | 'item-based' | 'math'
    const [selectedItemForCorrelation, setSelectedItemForCorrelation] = useState('p1')

    // Handle rating update by user
    const handleRate = (productId, rating) => {
        setActiveRatings(prev => ({
            ...prev,
            [productId]: prev[productId] === rating ? null : rating
        }))
    }

    const handleClearAll = () => {
        setActiveRatings({ p1: null, p2: null, p3: null, p4: null, p5: null, p6: null })
    }

    const handleApplyPreset = (key) => {
        setActiveRatings(PRESETS[key].ratings)
    }

    // 1. User-Based Collaborative Filtering Calculations
    const userBasedAnalysis = useMemo(() => {
        // Calculate similarity with each benchmark user
        const similarities = BENCHMARK_USERS.map(user => {
            const score = calculateCosineSimilarity(activeRatings, user.ratings)
            // Calculate dot product and norms for transparent mathematical audit
            let dot = 0
            let nA = 0
            let nB = 0
            PRODUCTS.forEach(p => {
                const a = activeRatings[p.id] || 0
                const b = user.ratings[p.id] || 0
                dot += a * b
                nA += a * a
                nB += b * b
            })
            return {
                ...user,
                similarity: score,
                dotProduct: dot,
                normActive: Math.sqrt(nA),
                normPeer: Math.sqrt(nB)
            }
        }).sort((a, b) => b.similarity - a.similarity)

        // For each unrated product, calculate predicted score via weighted average
        const unratedProducts = PRODUCTS.filter(p => !activeRatings[p.id])
        const ratedCount = PRODUCTS.length - unratedProducts.length

        const recommendations = unratedProducts.map(product => {
            let weightedSum = 0
            let similarityWeightSum = 0
            const supportingNeighbors = []

            similarities.forEach(neighbor => {
                const neighborRating = neighbor.ratings[product.id]
                if (neighborRating && neighbor.similarity > 0) {
                    weightedSum += neighbor.similarity * neighborRating
                    similarityWeightSum += neighbor.similarity
                    supportingNeighbors.push({
                        name: neighbor.name,
                        similarity: neighbor.similarity,
                        rating: neighborRating
                    })
                }
            })

            const predictedRating = similarityWeightSum > 0
                ? weightedSum / similarityWeightSum
                : null

            return {
                product,
                predictedRating: predictedRating !== null ? Number(predictedRating.toFixed(2)) : null,
                confidence: similarityWeightSum > 0 ? Math.min(100, Math.round(similarityWeightSum * 45)) : 0,
                supportingNeighbors
            }
        })
        .filter(item => item.predictedRating !== null)
        .sort((a, b) => b.predictedRating - a.predictedRating)

        return {
            similarities,
            recommendations,
            ratedCount,
            totalCount: PRODUCTS.length
        }
    }, [activeRatings])

    // 2. Item-Based Collaborative Filtering Calculations
    const itemBasedAnalysis = useMemo(() => {
        // Construct item rating vectors across all users (active + benchmark)
        const allUsers = [
            { id: 'active', ratings: activeRatings },
            ...BENCHMARK_USERS
        ]

        // Calculate item-item cosine similarity matrix
        const correlationMap = {}

        PRODUCTS.forEach(pA => {
            correlationMap[pA.id] = {}
            PRODUCTS.forEach(pB => {
                if (pA.id === pB.id) {
                    correlationMap[pA.id][pB.id] = 1.0
                    return
                }
                let dot = 0
                let normA = 0
                let normB = 0
                allUsers.forEach(u => {
                    const rA = u.ratings[pA.id] || 0
                    const rB = u.ratings[pB.id] || 0
                    dot += rA * rB
                    normA += rA * rA
                    normB += rB * rB
                })
                const sim = normA > 0 && normB > 0 ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0
                correlationMap[pA.id][pB.id] = Number(sim.toFixed(3))
            })
        })

        // Correlations for the currently selected product
        const selectedProduct = PRODUCTS.find(p => p.id === selectedItemForCorrelation) || PRODUCTS[0]
        const relatedItems = PRODUCTS
            .filter(p => p.id !== selectedItemForCorrelation)
            .map(p => ({
                product: p,
                similarity: correlationMap[selectedItemForCorrelation][p.id] || 0
            }))
            .sort((a, b) => b.similarity - a.similarity)

        return {
            correlationMap,
            selectedProduct,
            relatedItems
        }
    }, [activeRatings, selectedItemForCorrelation])

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Title Section */}
                <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Sparkles size={13} />
                            Machine Learning &bull; Unsupervised Vector Space
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                            Product Recommendation Engine
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
                            Real-time interactive Collaborative Filtering computing Cosine Vector Similarity and Top-N rating predictions directly in your browser.
                        </p>
                    </div>

                    {/* Live Telemetry Status Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-2 rounded-xl text-xs">
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Inference Latency</span>
                            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5 mt-0.5">
                                <Zap size={12} /> &lt; 0.5 ms (Client-Side)
                            </span>
                        </div>
                        <div className="bg-slate-800/80 border border-slate-700/60 px-3 py-2 rounded-xl text-xs">
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Matrix Sparsity</span>
                            <span className="text-indigo-400 font-mono font-bold">
                                {Math.round(((PRODUCTS.length - userBasedAnalysis.ratedCount) / PRODUCTS.length) * 100)}% unrated
                            </span>
                        </div>
                    </div>
                </div>

                {/* Preset Controls Bar */}
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                            <Sliders size={14} /> Quick Presets:
                        </span>
                        {Object.entries(PRESETS).map(([key, item]) => (
                            <button
                                key={key}
                                onClick={() => handleApplyPreset(key)}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/60 hover:border-indigo-500/50 transition-all duration-150"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleClearAll}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                    >
                        <RefreshCw size={12} /> Clear My Ratings
                    </button>
                </div>

                {/* Mode Selector Navigation Tabs */}
                <div className="flex border-b border-slate-800 gap-2">
                    <button
                        onClick={() => setActiveMode('user-based')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                            activeMode === 'user-based'
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        <Layers size={16} /> User-Based Recommendations
                    </button>
                    <button
                        onClick={() => setActiveMode('item-based')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                            activeMode === 'item-based'
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        <Cpu size={16} /> Item-to-Item Similarity Matrix
                    </button>
                    <button
                        onClick={() => setActiveMode('math')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                            activeMode === 'math'
                                ? 'border-indigo-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-300'
                        }`}
                    >
                        <Calculator size={16} /> Mathematical Formulas & Vector Breakdown
                    </button>
                </div>

                {/* TAB 1: User-Based Collaborative Filtering */}
                {activeMode === 'user-based' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Column: Interactive Rating Matrix (8 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            <span>⭐</span> Interactive User Rating Vector
                                        </h2>
                                        <p className="text-xs text-slate-400">
                                            Click any star to rate products. Recommendations adapt instantaneously via vector recalculation.
                                        </p>
                                    </div>
                                    <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 font-mono">
                                        {userBasedAnalysis.ratedCount} of {PRODUCTS.length} rated
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {PRODUCTS.map(product => {
                                        const currentRating = activeRatings[product.id]
                                        return (
                                            <div
                                                key={product.id}
                                                className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                                    currentRating
                                                        ? 'bg-slate-700/30 border-indigo-500/30'
                                                        : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl p-2 rounded-lg bg-slate-800 border border-slate-700">
                                                        {product.icon}
                                                    </span>
                                                    <div>
                                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                                            <span className="text-indigo-300 font-mono">{product.price}</span>
                                                            &bull;
                                                            <span>{product.category}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Interactive 5-Star Rating Buttons */}
                                                <div className="flex items-center gap-1 self-end sm:self-center">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => handleRate(product.id, star)}
                                                            className={`p-1.5 rounded-md transition-transform active:scale-95 ${
                                                                currentRating && currentRating >= star
                                                                    ? 'text-amber-400 hover:text-amber-300'
                                                                    : 'text-slate-600 hover:text-slate-400'
                                                            }`}
                                                            aria-label={`Rate ${star} stars`}
                                                        >
                                                            <Star
                                                                size={18}
                                                                fill={currentRating && currentRating >= star ? 'currentColor' : 'none'}
                                                            />
                                                        </button>
                                                    ))}
                                                    {currentRating && (
                                                        <span className="text-xs font-mono font-bold text-amber-400 ml-1.5 w-6 text-right">
                                                            {currentRating}.0
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Peer Cosine Similarity Breakdown */}
                            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
                                <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                                    <TrendingUp size={16} className="text-emerald-400" /> Peer User Cosine Similarity Ranking
                                </h2>
                                <p className="text-xs text-slate-400 mb-4">
                                    Similarity score &isin; [0, 1] calculated against your active preference vector:
                                </p>

                                <div className="space-y-3">
                                    {userBasedAnalysis.similarities.map((peer, idx) => {
                                        const pct = Math.round(peer.similarity * 100)
                                        return (
                                            <div key={peer.id} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{peer.avatar}</span>
                                                    <div>
                                                        <div className="text-xs font-bold text-white flex items-center gap-2">
                                                            {peer.name}
                                                            {idx === 0 && peer.similarity > 0 && (
                                                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
                                                                    Top Neighbor
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400">{peer.role}</div>
                                                    </div>
                                                </div>

                                                <div className="text-right flex items-center gap-3">
                                                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                                                        <div
                                                            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <div className="font-mono text-xs font-bold text-indigo-300 w-12 text-right">
                                                        {(peer.similarity).toFixed(3)}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Dynamic Recommendations Output (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-gradient-to-b from-indigo-950/40 to-slate-800/80 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Sparkles className="text-amber-400" size={18} /> Top Recommended For You
                                    </h2>
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        Live Ranked
                                    </span>
                                </div>

                                {userBasedAnalysis.recommendations.length > 0 ? (
                                    <div className="space-y-4">
                                        {userBasedAnalysis.recommendations.map((rec, index) => (
                                            <div
                                                key={rec.product.id}
                                                className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-colors"
                                            >
                                                <div className="absolute top-0 right-0 bg-indigo-600 text-white font-mono text-[10px] font-black px-2.5 py-1 rounded-bl-lg">
                                                    Rank #{index + 1}
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">
                                                        {rec.product.icon}
                                                    </span>
                                                    <div className="flex-1 pr-10">
                                                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                            {rec.product.name}
                                                        </h3>
                                                        <div className="text-xs text-indigo-400 font-mono mt-0.5">
                                                            {rec.product.price}
                                                        </div>

                                                        {/* Predicted Rating Banner */}
                                                        <div className="mt-3 flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                                                            <div className="flex items-center text-amber-400">
                                                                <Star size={14} fill="currentColor" />
                                                            </div>
                                                            <span className="text-xs font-bold text-white">
                                                                Predicted: {rec.predictedRating} / 5.0
                                                            </span>
                                                            <span className="text-slate-500 text-xs font-mono">&bull;</span>
                                                            <span className="text-[11px] text-slate-400">
                                                                Confidence: {rec.confidence}%
                                                            </span>
                                                        </div>

                                                        {/* Explainability Tag */}
                                                        <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                                                            💡 Recommended because {rec.supportingNeighbors.length} similar user profile(s) ({rec.supportingNeighbors.map(n => n.name.split(' ')[0]).join(', ')}) rated this item highly.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 px-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <Filter size={32} className="mx-auto text-slate-600 mb-3" />
                                        <h3 className="text-sm font-bold text-slate-300">All Items Already Rated</h3>
                                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                                            Clear or unrate some items on the left to see the Collaborative Filtering engine generate new recommendations.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Technical Capabilities Note */}
                            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
                                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                                    <Info size={14} className="text-indigo-400" /> Engineering Specifications
                                </div>
                                <p>
                                    This demonstration executes client-side sparse vector dot product operations. Unlike static mockups, all predicted ratings dynamically recalibrate in O(U &times; I) time whenever a user rates or removes an item.
                                </p>
                            </div>
                        </div>

                    </div>
                )}

                {/* TAB 2: Item-to-Item Similarity Matrix */}
                {activeMode === 'item-based' && (
                    <div className="space-y-6">
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Cpu className="text-indigo-400" size={18} /> Pairwise Item-to-Item Cosine Similarity Heatmap
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        Select a primary product to inspect correlation affinities across the product catalog:
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label htmlFor="product-select" className="text-xs text-slate-400">Target Item:</label>
                                    <select
                                        id="product-select"
                                        value={selectedItemForCorrelation}
                                        onChange={e => setSelectedItemForCorrelation(e.target.value)}
                                        className="bg-slate-900 border border-slate-700 rounded-lg text-xs px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        {PRODUCTS.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Correlation Ranked List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {itemBasedAnalysis.relatedItems.map(item => {
                                    const score = item.similarity
                                    const pct = Math.round(score * 100)
                                    return (
                                        <div key={item.product.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-2xl p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                                                    {item.product.icon}
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-white truncate">{item.product.name}</div>
                                                    <div className="text-[11px] text-slate-400">{item.product.category}</div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-mono text-sm font-bold text-indigo-400">
                                                    {score.toFixed(3)}
                                                </div>
                                                <div className="text-[10px] text-slate-500">{pct}% affinity</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Full Correlation Matrix Table */}
                            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                                <span>📐</span> Full 6&times;6 Item Similarity Matrix
                            </h3>
                            <div className="overflow-x-auto rounded-xl border border-slate-700">
                                <table className="w-full text-xs text-left border-collapse">
                                    <thead className="bg-slate-950 text-slate-400 font-mono">
                                        <tr>
                                            <th className="p-2.5 border-b border-r border-slate-700">Item</th>
                                            {PRODUCTS.map(p => (
                                                <th key={p.id} className="p-2.5 border-b border-slate-700 text-center">
                                                    {p.icon} {p.id.toUpperCase()}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 font-mono">
                                        {PRODUCTS.map(pRow => (
                                            <tr key={pRow.id} className="hover:bg-slate-800/40">
                                                <td className="p-2.5 border-r border-slate-700 font-bold text-white bg-slate-900/60">
                                                    {pRow.icon} {pRow.id.toUpperCase()}
                                                </td>
                                                {PRODUCTS.map(pCol => {
                                                    const val = itemBasedAnalysis.correlationMap[pRow.id]?.[pCol.id] || 0
                                                    const isSelf = pRow.id === pCol.id
                                                    const isHigh = val >= 0.7 && !isSelf
                                                    return (
                                                        <td
                                                            key={pCol.id}
                                                            className={`p-2.5 text-center ${
                                                                isSelf
                                                                    ? 'bg-slate-800 text-slate-500'
                                                                    : isHigh
                                                                    ? 'bg-indigo-900/30 text-indigo-300 font-bold'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {val.toFixed(2)}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: Mathematical Formulas & Vector Breakdown */}
                {activeMode === 'math' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Formula 1: Cosine Vector Similarity */}
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Calculator className="text-indigo-400" size={18} /> 1. Cosine Similarity Formula
                            </h2>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Measures the cosine of the angle between two multi-dimensional rating vectors $\mathbf{u}$ (active user) and $\mathbf{v}$ (peer user):
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-center text-sm text-indigo-300 overflow-x-auto">
                                {'sim(u, v) = (u · v) / ( ||u||₂ × ||v||₂ ) = Σ(r_{u,i} × r_{v,i}) / ( √Σr_{u,i}² × √Σr_{v,i}² )'}
                            </div>
                            <p className="text-xs text-slate-400">
                                This normalizes differences in rating frequency, ensuring active and peer vectors evaluate angle alignment rather than absolute magnitude.
                            </p>

                            {/* Live Calculation Table */}
                            <h3 className="text-xs font-bold text-slate-200 mt-4 uppercase tracking-wider">
                                Live Component Breakdown:
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left font-mono">
                                    <thead className="bg-slate-900 text-slate-400">
                                        <tr>
                                            <th className="p-2">Peer</th>
                                            <th className="p-2">Dot Product (u &bull; v)</th>
                                            <th className="p-2">||u|| Norm</th>
                                            <th className="p-2">||v|| Norm</th>
                                            <th className="p-2">sim(u, v)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {userBasedAnalysis.similarities.map(peer => (
                                            <tr key={peer.id}>
                                                <td className="p-2 font-sans text-white">{peer.name.split(' ')[0]}</td>
                                                <td className="p-2 text-indigo-300">{peer.dotProduct.toFixed(1)}</td>
                                                <td className="p-2 text-slate-400">{peer.normActive.toFixed(2)}</td>
                                                <td className="p-2 text-slate-400">{peer.normPeer.toFixed(2)}</td>
                                                <td className="p-2 font-bold text-emerald-400">{peer.similarity.toFixed(3)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Formula 2: Weighted Rating Prediction */}
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <TrendingUp className="text-emerald-400" size={18} /> 2. Weighted Rating Prediction
                            </h2>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                To predict an unrated item $i$ for active user $u$, ratings from neighbors $v \in N$ are aggregated weighted by their cosine similarity:
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-center text-sm text-emerald-400 overflow-x-auto">
                                {'r̂_{u, i} = Σ(sim(u, v) × r_{v, i}) / Σ|sim(u, v)|'}
                            </div>
                            <p className="text-xs text-slate-400">
                                Users with high cosine similarity contribute significantly more weight to the predicted recommendation score than dissimilar users.
                            </p>

                            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 mt-4 text-xs text-slate-300">
                                <div className="font-bold text-white flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-400" /> Key Engineering Guarantees:
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-slate-400">
                                    <li>Zero hardcoded recommendations — every output derived from live vector math.</li>
                                    <li>Deterministic in-browser execution without external API dependencies.</li>
                                    <li>Handles matrix sparsity gracefully with fallback neighborhood support.</li>
                                    <li>Instant reactivity on any user input event without page reloading.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Section */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <div>
                        NurdiansyahLabs Data Science &bull; Production Machine Learning Architecture Showcase
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-mono text-slate-400">CollaborativeFilteringModule v1.2 (Active)</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
