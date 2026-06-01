import { useState } from 'react'
import { ShieldAlert, Cpu, Activity, Share2, Target, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'

const CUSTOMERS = [
    { id: 1, name: 'Budi Santoso', tenure: 36, usage: 8.2, support: 2, risk: 0.82, churn: true, country: 'Jakarta', plan: 'Basic' },
    { id: 2, name: 'Siti Rahayu', tenure: 24, usage: 12.5, support: 0, risk: 0.31, churn: false, country: 'Bandung', plan: 'Premium' },
    { id: 3, name: 'Ahmad Hidayat', tenure: 6, usage: 4.1, support: 5, risk: 0.91, churn: true, country: 'Surabaya', plan: 'Basic' },
    { id: 4, name: 'Dewi Lestari', tenure: 48, usage: 15.2, support: 1, risk: 0.12, churn: false, country: 'Bali', plan: 'Enterprise' },
    { id: 5, name: 'Rizki Permana', tenure: 12, usage: 6.8, support: 3, risk: 0.65, churn: true, country: 'Medan', plan: 'Basic' },
    { id: 6, name: 'Indah Pratiwi', tenure: 60, usage: 18.4, support: 0, risk: 0.08, churn: false, country: 'Jakarta', plan: 'Enterprise' },
    { id: 7, name: 'Fauzan Malik', tenure: 8, usage: 5.2, support: 4, risk: 0.77, churn: false, country: 'Yogyakarta', plan: 'Standard' },
    { id: 8, name: 'Ratna Sari', tenure: 30, usage: 11.9, support: 1, risk: 0.22, churn: false, country: 'Surabaya', plan: 'Premium' },
]

const SHAP = [
    { feature: 'Tenure (lama berlangganan)', impact: -0.38, dir: 'neg', raw: 38 },
    { feature: 'Jumlah support calls', impact: 0.31, dir: 'pos', raw: 31 },
    { feature: 'Usage per bulan', impact: -0.27, dir: 'neg', raw: 27 },
    { feature: 'Paket berlangganan', impact: 0.18, dir: 'pos', raw: 18 },
    { feature: 'Lokasi geografis', impact: 0.12, dir: 'pos', raw: 12 },
]

export default function ChurnPredictionApp() {
    const [threshold, setThreshold] = useState(0.5)
    const [selected, setSelected] = useState(null)
    
    const atRisk = CUSTOMERS.filter(c => c.risk >= threshold)
    const safe = CUSTOMERS.filter(c => c.risk < threshold)

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10">
            {/* Header */}
            <div className="bg-slate-900 px-4 md:px-8 py-6 text-white shadow-lg border-b border-red-900/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-red-400 mb-1 uppercase">
                            <ShieldAlert className="w-4 h-4" /> Classification Model
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white m-0 tracking-tight">Customer Churn Prediction</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-2xl font-black text-red-400">{atRisk.length}</div>
                            <div className="text-xs text-red-200 font-medium uppercase tracking-wider">At Risk Customers</div>
                        </div>
                        <div className="h-10 w-px bg-slate-700"></div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-emerald-400">94.2%</div>
                            <div className="text-xs text-emerald-200 font-medium uppercase tracking-wider">Model Accuracy</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* Decision Threshold Controller */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Decision Boundary</h3>
                                <p className="text-xs text-slate-500 mt-1">Adjust probability threshold for classification</p>
                            </div>
                            <div className="text-2xl font-black text-red-600">{(threshold * 100).toFixed(0)}%</div>
                        </div>
                        <input 
                            aria-label="Threshold slider" 
                            type="range" 
                            min={0} max={100} 
                            value={threshold * 100} 
                            onChange={e => setThreshold(e.target.value / 100)} 
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" 
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                            <span>More False Positives</span>
                            <span>Balanced</span>
                            <span>More False Negatives</span>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 flex-1 text-center min-w-[120px]">
                            <div className="text-3xl font-black text-red-600">{atRisk.length}</div>
                            <div className="text-xs font-bold text-red-800 uppercase tracking-wider mt-1">Predicted Churn</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex-1 text-center min-w-[120px]">
                            <div className="text-3xl font-black text-emerald-600">{safe.length}</div>
                            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1">Predicted Safe</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Predictions Table */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Scoring Results</h2>
                            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">n = {CUSTOMERS.length}</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {[...CUSTOMERS].sort((a, b) => b.risk - a.risk).map((c) => {
                                const isRisk = c.risk >= threshold;
                                const isSelected = selected?.id === c.id;
                                return (
                                    <div 
                                        key={c.id} 
                                        onClick={() => setSelected(isSelected ? null : c)}
                                        className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors ${isSelected ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900">{c.name}</div>
                                            <div className="text-xs text-slate-500">{c.plan} • {c.country}</div>
                                        </div>
                                        
                                        <div className="flex-1 hidden md:block">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all ${c.risk > 0.7 ? 'bg-red-500' : c.risk > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                        style={{width: `${c.risk * 100}%`}}
                                                    />
                                                </div>
                                                <div className="w-10 text-right text-xs font-bold text-slate-700">{(c.risk * 100).toFixed(0)}%</div>
                                            </div>
                                        </div>

                                        <div className="w-24 text-right">
                                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${isRisk ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                                {isRisk ? 'High Risk' : 'Retained'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Explainable AI Sidebar */}
                    <div className="space-y-6">
                        {selected ? (
                            <div className="bg-white rounded-2xl p-6 border-2 border-red-400 shadow-md">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900">{selected.name}</h2>
                                        <p className="text-sm text-slate-500 font-medium">Individual Prediction Profile</p>
                                    </div>
                                    <button aria-label="Close" onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                                </div>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Plan Type</span>
                                        <span className="font-bold text-slate-900">{selected.plan}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Tenure</span>
                                        <span className="font-bold text-slate-900">{selected.tenure} months</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Monthly Usage</span>
                                        <span className="font-bold text-slate-900">{selected.usage} GB</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pb-1">
                                        <span className="text-slate-500">Support Calls</span>
                                        <span className="font-bold text-slate-900">{selected.support} calls</span>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-xl text-center border ${selected.risk >= threshold ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                                    <div className="text-xs font-bold uppercase tracking-wider mb-1">Churn Probability</div>
                                    <div className="text-3xl font-black">{(selected.risk * 100).toFixed(0)}%</div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm text-white">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <Share2 className="w-5 h-5 text-red-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">SHAP Feature Impact</h3>
                                </div>
                                <p className="text-slate-400 text-sm mb-6">
                                    Global feature importance explaining which variables drive the Random Forest model predictions.
                                </p>

                                <div className="h-[200px] w-full mb-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={SHAP} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <XAxis type="number" hide />
                                            <YAxis type="category" dataKey="feature" hide />
                                            <RechartsTooltip 
                                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                                contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}}
                                                formatter={(value) => [`${value}%`, 'Impact Magnitude']}
                                            />
                                            <Bar dataKey="raw" radius={[0, 4, 4, 0]}>
                                                {SHAP.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.dir === 'pos' ? '#f87171' : '#34d399'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                <div className="flex justify-between text-xs font-medium text-slate-500 border-t border-slate-700 pt-3">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Reduces Churn</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div> Increases Churn</div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Model Performance</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                    <div className="text-xl font-black text-slate-800">0.89</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase">ROC AUC</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                    <div className="text-xl font-black text-slate-800">0.91</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase">Precision</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                    <div className="text-xl font-black text-slate-800">0.86</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase">Recall</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                    <div className="text-xl font-black text-slate-800">0.88</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase">F1-Score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
