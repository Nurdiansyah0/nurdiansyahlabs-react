import { useState, useMemo } from 'react'
import { Layers, Cpu } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

const CLUSTERS = [
    { id: 0, name: 'Champions', color: '#6366f1', bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-500', count: 312, rfm: 'R:5 F:5 M:5', revenue: 'Rp 4.8Jt avg', desc: 'Top customers with highest frequency and value. Extreme fidelity.', action: 'Reward with exclusive loyalty program', centroid: [4.2, 4.5] },
    { id: 1, name: 'Loyal', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-500', count: 489, rfm: 'R:4 F:4 M:3', revenue: 'Rp 2.1Jt avg', desc: 'Steady customers with routine purchases. Consistent medium value.', action: 'Upsell premium products and cross-sell', centroid: [3.5, 3.2] },
    { id: 2, name: 'At Risk', color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-500', count: 234, rfm: 'R:2 F:3 M:3', revenue: 'Rp 1.4Jt avg', desc: 'Previously active customers whose engagement is dropping.', action: 'Send personalized re-engagement email', centroid: [1.8, 2.5] },
    { id: 3, name: 'Lost', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500', count: 178, rfm: 'R:1 F:1 M:2', revenue: 'Rp 0.8Jt avg', desc: 'Customers who have not transacted in a long time.', action: 'Offer deep win-back discounts', centroid: [0.8, 1.2] },
]

const generateScatterPoints = () => CLUSTERS.flatMap(c => Array.from({ length: 50 }).map(() => ({
    x: Math.max(0, Math.min(5, c.centroid[0] + (Math.random() - 0.5) * 1.8)),
    y: Math.max(0, Math.min(5, c.centroid[1] + (Math.random() - 0.5) * 1.8)),
    z: Math.random() * 500 + 100,
    cluster: c.id,
    color: c.color,
    name: c.name
})))

export default function CustomerClusteringApp() {
    const [selected, setSelected] = useState(null)
    const SCATTER_POINTS = useMemo(() => generateScatterPoints(), [])
    const total = CLUSTERS.reduce((s, c) => s + c.count, 0)

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <div className="text-white font-bold mb-1" style={{color: data.color}}>{data.name}</div>
                    <div className="text-slate-300 text-xs">PCA_1: {data.x.toFixed(2)}</div>
                    <div className="text-slate-300 text-xs">PCA_2: {data.y.toFixed(2)}</div>
                    <div className="text-slate-300 text-xs">LTV: ~Rp {(data.z * 10000).toLocaleString()}</div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10">
            {/* Header */}
            <div className="bg-slate-900 px-4 md:px-8 py-6 text-white shadow-lg border-b border-indigo-900/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 mb-1 uppercase">
                            <Layers className="w-4 h-4" /> Unsupervised Learning
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white m-0 tracking-tight">K-Means Customer Clustering</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-2xl font-black text-white">{total.toLocaleString()}</div>
                            <div className="text-xs text-indigo-300 font-medium uppercase tracking-wider">Data Points</div>
                        </div>
                        <div className="h-10 w-px bg-slate-700"></div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-emerald-400">0.72</div>
                            <div className="text-xs text-indigo-300 font-medium uppercase tracking-wider">Silhouette Score</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* Cluster Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {CLUSTERS.map(c => {
                        const isSelected = selected?.id === c.id;
                        return (
                            <div 
                                key={c.id} 
                                onClick={() => setSelected(isSelected ? null : c)} 
                                className={`bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all duration-200 ${isSelected ? c.border + ' shadow-md scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: c.color}}></div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-md ${c.bg} ${c.text}`}>Centroid: {c.rfm}</div>
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 mb-1">{c.count}</div>
                                <div className="font-bold text-base mb-1" style={{color: c.color}}>{c.name}</div>
                                <div className="text-xs text-slate-500 font-medium">{c.revenue}</div>
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Scatter Plot */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">PCA Dimensionality Reduction</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">2D Projection of High-Dimensional RFM Features</p>
                            </div>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 hidden sm:inline-block">
                                Alg: K-Means (k=4)
                            </span>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis type="number" dataKey="x" name="PCA_1" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                                    <YAxis type="number" dataKey="y" name="PCA_2" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                                    <ZAxis type="number" dataKey="z" range={[20, 200]} name="Value" />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{strokeDasharray: '3 3'}} />
                                    
                                    {CLUSTERS.map((c) => (
                                        <Scatter 
                                            key={c.id} 
                                            name={c.name} 
                                            data={SCATTER_POINTS.filter(p => p.cluster === c.id && (selected === null || selected.id === c.id))} 
                                            fill={c.color}
                                            fillOpacity={selected && selected.id !== c.id ? 0.2 : 0.7}
                                        />
                                    ))}
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Analytics Sidebar */}
                    <div className="space-y-6">
                        {selected ? (
                            <div className={`bg-white rounded-2xl p-6 border-2 ${selected.border} shadow-md transition-all`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-black" style={{color: selected.color}}>{selected.name} Segment</h2>
                                    <button aria-label="Action button" onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 transition-colors">✕</button>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    {selected.desc}
                                </p>
                                <div className={`p-4 rounded-xl ${selected.bg} border border-white/50`}>
                                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{color: selected.color}}>Prescriptive Action</div>
                                    <div className="text-sm font-bold text-slate-800">{selected.action}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <Cpu className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Model Architecture</h3>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    K-Means clustering applied on Recency, Frequency, and Monetary (RFM) variables after standard scaling.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">Algorithm</span>
                                        <span className="font-semibold text-slate-200">K-Means++</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">Distance Metric</span>
                                        <span className="font-semibold text-slate-200">Euclidean</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">Iterations</span>
                                        <span className="font-semibold text-slate-200">300 (Converged)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pb-1">
                                        <span className="text-slate-400">Inertia (WCSS)</span>
                                        <span className="font-semibold text-slate-200">4,215.8</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Segment Distribution</h3>
                            <div className="space-y-5">
                                {CLUSTERS.map(c => {
                                    const pct = Math.round((c.count / total) * 100);
                                    const isFaded = selected && selected.id !== c.id;
                                    return (
                                        <div key={c.id} className={`transition-opacity duration-200 ${isFaded ? 'opacity-30' : 'opacity-100'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-slate-700">{c.name}</span>
                                                <span className="text-sm font-black" style={{color: c.color}}>{pct}%</span>
                                            </div>
                                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-500" style={{backgroundColor: c.color, width: `${pct}%`}}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
