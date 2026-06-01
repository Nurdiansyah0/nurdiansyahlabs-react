import { useState, useRef, useEffect } from 'react'
import { Brain, TrendingUp, Activity, ChevronDown, Database, Zap, Cpu, Network, Target } from 'lucide-react'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts'

const TS_DATA = {
    'LSTM Neural Network': [
        { month: 'Jan', actual: 4200 }, { month: 'Feb', actual: 4500 }, { month: 'Mar', actual: 4800 }, { month: 'Apr', actual: 3800 }, { month: 'Mei', actual: 5100 }, { month: 'Jun', actual: 5500 }, { month: 'Jul', actual: 4900 }, { month: 'Ags', actual: 5800 }, { month: 'Sep', actual: 6200 },
        { month: 'Okt', actual: 6800, forecast: 6800, confidence: [6800, 6800] },
        { month: 'Nov', forecast: 7200, confidence: [6900, 7500] }, { month: 'Des', forecast: 7800, confidence: [7300, 8300] }, { month: 'Jan', forecast: 8400, confidence: [7600, 9200] }, { month: 'Feb', forecast: 8900, confidence: [8000, 9800] }, { month: 'Mar', forecast: 9500, confidence: [8300, 10700] },
    ],
    'XGBoost Regressor': [
        { month: 'Jan', actual: 4200 }, { month: 'Feb', actual: 4500 }, { month: 'Mar', actual: 4800 }, { month: 'Apr', actual: 3800 }, { month: 'Mei', actual: 5100 }, { month: 'Jun', actual: 5500 }, { month: 'Jul', actual: 4900 }, { month: 'Ags', actual: 5800 }, { month: 'Sep', actual: 6200 },
        { month: 'Okt', actual: 6800, forecast: 6800, confidence: [6800, 6800] },
        { month: 'Nov', forecast: 7100, confidence: [6800, 7400] }, { month: 'Des', forecast: 7500, confidence: [7100, 7900] }, { month: 'Jan', forecast: 8000, confidence: [7400, 8600] }, { month: 'Feb', forecast: 8300, confidence: [7600, 9000] }, { month: 'Mar', forecast: 8700, confidence: [7900, 9500] },
    ],
    'Facebook Prophet': [
        { month: 'Jan', actual: 4200 }, { month: 'Feb', actual: 4500 }, { month: 'Mar', actual: 4800 }, { month: 'Apr', actual: 3800 }, { month: 'Mei', actual: 5100 }, { month: 'Jun', actual: 5500 }, { month: 'Jul', actual: 4900 }, { month: 'Ags', actual: 5800 }, { month: 'Sep', actual: 6200 },
        { month: 'Okt', actual: 6800, forecast: 6800, confidence: [6800, 6800] },
        { month: 'Nov', forecast: 7300, confidence: [6700, 7900] }, { month: 'Des', forecast: 7600, confidence: [6800, 8400] }, { month: 'Jan', forecast: 8100, confidence: [7000, 9200] }, { month: 'Feb', forecast: 8500, confidence: [7200, 9800] }, { month: 'Mar', forecast: 8900, confidence: [7400, 10400] },
    ]
}

const MODELS = {
    'LSTM Neural Network': { rmse: '241.5', mae: '185.2', mape: '4.2%', r2: '0.96', desc: 'Deep learning architecture optimized for complex non-linear sequential patterns.', time: '1.24s', icon: Network },
    'XGBoost Regressor': { rmse: '284.1', mae: '210.8', mape: '5.8%', r2: '0.92', desc: 'Gradient boosting decision tree algorithm, excellent for structured tabular features.', time: '0.42s', icon: Cpu },
    'Facebook Prophet': { rmse: '315.6', mae: '245.3', mape: '6.5%', r2: '0.88', desc: 'Additive regression model highly robust to missing data and extreme trend shifts.', time: '0.85s', icon: TrendingUp },
}

function CustomDropdown({ value, options, onChange, icon: Icon, label }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full md:w-auto min-w-[240px]" ref={ref}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:ring-2 focus:ring-indigo-400 outline-none backdrop-blur-md"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-indigo-400" />}
                    <span className="text-indigo-200 hidden sm:inline">{label}:</span>
                    <span className="font-bold tracking-wide">{value}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 w-full bg-slate-900 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-indigo-500/20 py-2 z-50">
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                value === opt ? 'bg-indigo-600/20 text-indigo-300 font-bold border-l-2 border-indigo-500' : 'text-slate-300 font-medium hover:bg-slate-800 border-l-2 border-transparent hover:text-white'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SalesForecastingApp() {
    const [model, setModel] = useState('LSTM Neural Network')
    const chartData = TS_DATA[model]
    const metrics = MODELS[model]

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10">
            {/* Header */}
            <div className="bg-slate-900 px-4 md:px-8 py-6 text-white shadow-lg border-b border-indigo-900/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 mb-1 uppercase">
                            <Brain className="w-4 h-4" /> Predictive Analytics Studio
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white m-0 tracking-tight">Sales Forecasting Model</h1>
                    </div>
                    <div className="w-full md:w-auto">
                        <CustomDropdown 
                            label="Algorithm" 
                            icon={Database} 
                            value={model} 
                            options={Object.keys(MODELS)} 
                            onChange={setModel} 
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Model Accuracy (R²)', value: metrics.r2, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-100', desc: 'Variance explained' },
                        { label: 'MAPE', value: metrics.mape, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'Mean Absolute % Error' },
                        { label: 'RMSE', value: metrics.rmse, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100', desc: 'Root Mean Square Error' },
                        { label: 'Inference Time', value: metrics.time, icon: Zap, color: 'text-purple-600', bg: 'bg-purple-100', desc: 'Per 10k predictions' },
                    ].map((m, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg} ${m.color}`}>
                                    <m.icon className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-semibold text-slate-500">{m.label}</div>
                            </div>
                            <div className="text-2xl md:text-3xl font-black text-slate-900 mb-1">{m.value}</div>
                            <div className="text-xs font-medium text-slate-400">{m.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Demand Forecast Projection</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">Historical vs Predicted values with 95% Confidence Interval</p>
                            </div>
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 hidden sm:inline-block">
                                Horizon: +6 Months
                            </span>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                                        labelStyle={{fontWeight: 'bold', color: '#0f172a', marginBottom: '4px'}}
                                    />
                                    <Legend wrapperStyle={{paddingTop: '20px', fontSize: '13px', fontWeight: 500}} />
                                    
                                    {/* Confidence Interval Area */}
                                    <Area type="monotone" dataKey="confidence" name="95% Confidence" fill="#818cf8" stroke="none" fillOpacity={0.15} />
                                    
                                    {/* Actual Line */}
                                    <Line type="monotone" dataKey="actual" name="Actual Sales" stroke="#0f172a" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                    
                                    {/* Forecast Line */}
                                    <Line type="monotone" dataKey="forecast" name="Model Forecast" stroke="#4f46e5" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4, fill: '#4f46e5'}} activeDot={{r: 6}} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Model Details */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <metrics.icon className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Model Architecture</h3>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {metrics.desc}
                            </p>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                    <span className="text-slate-400">Training Data</span>
                                    <span className="font-semibold text-slate-200">1.2M records</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                    <span className="text-slate-400">Features</span>
                                    <span className="font-semibold text-slate-200">24 variables</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                    <span className="text-slate-400">Loss Function</span>
                                    <span className="font-semibold text-slate-200">Huber Loss</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pb-1">
                                    <span className="text-slate-400">Optimizer</span>
                                    <span className="font-semibold text-slate-200">AdamW</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Pipeline Status</h3>
                            <div className="space-y-4">
                                {[
                                    { step: 'Data Ingestion & Cleaning', status: 'Done', color: 'bg-emerald-500' },
                                    { step: 'Feature Engineering (Lags)', status: 'Done', color: 'bg-emerald-500' },
                                    { step: 'Hyperparameter Tuning', status: 'Done', color: 'bg-emerald-500' },
                                    { step: 'Model Inference', status: 'Active', color: 'bg-blue-500 animate-pulse' },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${p.color}`}></div>
                                        <div className="flex-1 text-sm font-medium text-slate-700">{p.step}</div>
                                        <div className="text-xs font-bold text-slate-400">{p.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
