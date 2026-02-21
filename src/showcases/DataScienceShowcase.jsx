import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis, BarChart, Bar, AreaChart, Area, ComposedChart
} from 'recharts'

/* ================================================================
   B2B SALES FORECASTING
   ================================================================ */
function SalesForecasting() {
    const forecastData = [
        { month: 'Jan', actual: 4200, forecast: null, lower: null, upper: null },
        { month: 'Feb', actual: 4800, forecast: null, lower: null, upper: null },
        { month: 'Mar', actual: 4100, forecast: null, lower: null, upper: null },
        { month: 'Apr', actual: 5100, forecast: null, lower: null, upper: null },
        { month: 'May', actual: 5600, forecast: 5600, lower: 5600, upper: 5600 }, // Connection point
        { month: 'Jun', actual: null, forecast: 6100, lower: 5800, upper: 6400 },
        { month: 'Jul', actual: null, forecast: 6300, lower: 5900, upper: 6700 },
        { month: 'Aug', actual: null, forecast: 6800, lower: 6200, upper: 7400 },
        { month: 'Sep', actual: null, forecast: 6500, lower: 5800, upper: 7200 },
        { month: 'Oct', actual: null, forecast: 7200, lower: 6400, upper: 8000 },
        { month: 'Nov', actual: null, forecast: 7800, lower: 6800, upper: 8800 },
        { month: 'Dec', actual: null, forecast: 8500, lower: 7500, upper: 9500 },
    ]

    const features = [
        { name: 'Historical Sales', imp: 85 }, { name: 'Marketing Spend', imp: 65 },
        { name: 'Seasonality Index', imp: 45 }, { name: 'Economic Indicators', imp: 25 },
        { name: 'Competitor Pricing', imp: 15 },
    ]

    return (
        <div style={{ background: '#171717', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif', color: '#e5e5e5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ background: '#6366f1', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 0 15px rgba(99,102,241,0.5)' }}><i className="fas fa-chart-line"></i></div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Sales Forecasting AI (ARIMA)</h1>
                        </div>
                        <div style={{ color: '#a3a3a3', fontSize: '0.9rem' }}>Time-series prediction model vs historical data for Q3/Q4</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ background: '#262626', border: '1px solid #404040', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#a3a3a3' }}>Model:</span> <span style={{ color: '#fff', fontWeight: 600 }}>SARIMA (1,1,1)(0,1,1)12</span>
                        </div>
                        <div style={{ background: '#262626', border: '1px solid #404040', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#a3a3a3' }}>MAPE:</span> <span style={{ color: '#10b981', fontWeight: 600 }}>4.2%</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Main Forecasting Chart */}
                    <div style={{ background: '#262626', border: '1px solid #404040', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 600, margin: 0, fontSize: '1.1rem' }}>6-Month Revenue Projection</h3>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '4px', background: '#3b82f6', borderRadius: '2px' }} /> Actuals</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '4px', background: '#f59e0b', borderRadius: '2px', border: '1px dashed #f59e0b' }} /> Forecast</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '2px' }} /> 95% Confidence</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <ComposedChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#171717', border: '1px solid #404040', borderRadius: '8px' }} />

                                {/* Area for Confidence Interval */}
                                <Area type="monotone" dataKey="upper" stroke="none" fill="#f59e0b" fillOpacity={0.1} />
                                <Area type="monotone" dataKey="lower" stroke="none" fill="#262626" fillOpacity={1} /> {/* Cheat to mask bottom half */}

                                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', stroke: '#171717', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#f59e0b', stroke: '#171717', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Feature Importance */}
                    <div style={{ background: '#262626', border: '1px solid #404040', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ fontWeight: 600, margin: '0 0 1.5rem', fontSize: '1.1rem' }}>Feature Importance (SHAP)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {features.map((f, i) => (
                                <div key={f.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: '#d4d4d4' }}>
                                        <span>{f.name}</span>
                                        <span style={{ fontWeight: 600 }}>{f.imp}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#404040', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${f.imp}%`, background: `linear-gradient(90deg, #6366f1, #a855f7)`, borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '2rem', padding: '1rem', background: '#171717', borderRadius: '8px', border: '1px solid #404040', fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.5 }}>
                            <i className="fas fa-info-circle" style={{ color: '#6366f1', marginRight: '6px' }}></i>
                            Model highly dependent on historical lags. Marketing spend shows strong positive correlation with a 2-week delay.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   CUSTOMER SEGMENTATION (K-MEANS)
   ================================================================ */
function CustomerClustering() {
    // Generate mock scatter data for 3 clusters
    const data01 = Array.from({ length: 60 }).map(() => ({ x: Math.random() * 30 + 10, y: Math.random() * 40 + 10, z: Math.random() * 200 + 50 })) // Penny Pinchers
    const data02 = Array.from({ length: 50 }).map(() => ({ x: Math.random() * 40 + 40, y: Math.random() * 30 + 50, z: Math.random() * 200 + 50 })) // Loyalists
    const data03 = Array.from({ length: 40 }).map(() => ({ x: Math.random() * 30 + 60, y: Math.random() * 40 + 10, z: Math.random() * 200 + 50 })) // High Rollers

    const barData = [
        { age: '18-24', c1: 40, c2: 10, c3: 5 },
        { age: '25-34', c1: 30, c2: 35, c3: 20 },
        { age: '35-44', c1: 15, c2: 40, c3: 45 },
        { age: '45-54', c1: 10, c2: 10, c3: 20 },
        { age: '55+', c1: 5, c2: 5, c3: 10 },
    ]

    return (
        <div style={{ background: '#fafafa', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', background: '#e0e7ff', color: '#4338ca', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em', gap: '8px', alignItems: 'center' }}>
                        <i className="fas fa-project-diagram"></i> K-MEANS CLUSTERING OVERVIEW
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Customer Segmentation</h1>
                    <div style={{ color: '#64748b', fontSize: '1rem' }}>Recency, Frequency, Monetary (RFM) 3D Projection mapped to 2D</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { name: 'Bargain Hunters', desc: 'Low spend, high frequency, highly sensitive to discounts.', pct: '40%', color: '#ef4444', ltv: '$120' },
                        { name: 'Brand Loyalists', desc: 'Consistent spenders, brand advocates, standard margins.', pct: '33%', color: '#3b82f6', ltv: '$850' },
                        { name: 'High Rollers', desc: 'High spend volume, low frequency, premium product focus.', pct: '27%', color: '#10b981', ltv: '$2,400' },
                    ].map((c, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', borderTop: `4px solid ${c.color}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '1.5rem', fontWeight: 800, color: c.color, opacity: 0.2 }}>0{i + 1}</div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 8px' }}>{c.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.5rem', height: '40px' }}>{c.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Pop. Size</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: c.color }}>{c.pct}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Avg LTV</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b' }}>{c.ltv}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontWeight: 700, color: '#1e1b4b', margin: '0 0 1rem', fontSize: '1.1rem' }}>Cluster Distribution (Spend vs Frequency)</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Avg Spend ($)" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis type="number" dataKey="y" name="Frequency (Visits)" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <ZAxis type="number" dataKey="z" range={[60, 400]} name="Recency" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Scatter name="Bargain Hunters" data={data01} fill="#ef4444" opacity={0.6} />
                                <Scatter name="Brand Loyalists" data={data02} fill="#3b82f6" opacity={0.6} />
                                <Scatter name="High Rollers" data={data03} fill="#10b981" opacity={0.6} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontWeight: 700, color: '#1e1b4b', margin: '0 0 1rem', fontSize: '1.1rem' }}>Demographics: Age Distribution</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} stackOffset="expand">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" tickFormatter={(tick) => `${tick * 100}%`} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="age" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Bar dataKey="c1" name="Bargain Hunters" stackId="a" fill="#ef4444" />
                                <Bar dataKey="c2" name="Loyalists" stackId="a" fill="#3b82f6" />
                                <Bar dataKey="c3" name="High Rollers" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   CHURN PREDICTION (XGBOOST)
   ================================================================ */
function ChurnPrediction() {
    return (
        <div style={{ background: '#18181b', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif', color: '#e4e4e7' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ background: '#27272a', border: '1px solid #ef4444', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 0 30px rgba(239,68,68,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef2f2', border: '4px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#ef4444' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>High Risk Account Detected</h2>
                            <div style={{ fontSize: '0.9rem', color: '#a1a1aa', marginTop: '4px' }}>Customer ID: ACCT-98421 • Global Tech Inc.</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Churn Probability</div>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ef4444', textShadow: '0 0 20px rgba(239,68,68,0.4)', lineHeight: 1 }}>87%</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ background: '#27272a', borderRadius: '16px', padding: '1.5rem', border: '1px solid #3f3f46' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem', borderBottom: '1px solid #3f3f46', paddingBottom: '1rem' }}>Top Risk Factors (SHAP Values)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { factor: 'Active Days Last 30d', val: '4 days', impact: '+24%', type: 'danger' },
                                { factor: 'Support Tickets (Open)', val: '3 tickets', impact: '+18%', type: 'danger' },
                                { factor: 'NPS Score', val: '4 (Detractor)', impact: '+15%', type: 'danger' },
                                { factor: 'Contract Length', val: '24 months', impact: '-12%', type: 'safe' },
                                { factor: 'Feature Adoption (Pro)', val: '12%', impact: '+8%', type: 'danger' },
                            ].map(f => (
                                <div key={f.factor} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#18181b', borderRadius: '8px', borderLeft: `4px solid ${f.type === 'danger' ? '#ef4444' : '#10b981'}` }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e4e4e7' }}>{f.factor}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Current: {f.val}</div>
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: f.type === 'danger' ? '#ef4444' : '#10b981' }}>{f.impact}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: '#27272a', borderRadius: '16px', padding: '1.5rem', border: '1px solid #3f3f46' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem' }}>Recommended Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-phone-alt"></i> Trigger Executive Call
                                </button>
                                <button style={{ width: '100%', background: '#3f3f46', color: '#e4e4e7', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#52525b'} onMouseLeave={e => e.currentTarget.style.background = '#3f3f46'}>
                                    <i className="fas fa-ticket-alt"></i> Expedite Open Tickets
                                </button>
                                <button style={{ width: '100%', background: '#3f3f46', color: '#e4e4e7', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#52525b'} onMouseLeave={e => e.currentTarget.style.background = '#3f3f46'}>
                                    <i className="fas fa-gift"></i> Offer 3-Month Extension Discount
                                </button>
                            </div>
                        </div>

                        <div style={{ background: '#1e1b4b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #3730a3', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '6rem', color: '#4338ca', opacity: 0.3 }}><i className="fas fa-brain"></i></div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Model Details</h3>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>XGBoost Classifier</div>
                            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
                                <div><span style={{ color: '#818cf8', display: 'block', fontSize: '0.75rem' }}>Precision</span><span style={{ fontWeight: 700, color: '#fff' }}>0.88</span></div>
                                <div><span style={{ color: '#818cf8', display: 'block', fontSize: '0.75rem' }}>Recall</span><span style={{ fontWeight: 700, color: '#fff' }}>0.92</span></div>
                                <div><span style={{ color: '#818cf8', display: 'block', fontSize: '0.75rem' }}>F1-Score</span><span style={{ fontWeight: 700, color: '#fff' }}>0.90</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   RECOMMENDATION ENGINE (COLLAB FILTERING)
   ================================================================ */
function Recommendation() {
    return (
        <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '2rem', fontFamily: '"Inter", sans-serif', display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '1000px', width: '100%' }}>

                {/* Simulated E-commerce Storefront */}
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden', position: 'relative' }}>
                    {/* Store Header */}
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>TechStore.</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', gap: '1.5rem' }}>
                            <span>Laptops</span><span>Phones</span><span style={{ color: '#3b82f6', fontWeight: 600 }}>Accessories</span><span>Audio</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop" style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="User" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Welcome, Alex</span>
                        </div>
                    </div>

                    {/* Store Content */}
                    <div style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1.5rem', color: '#1e293b' }}>Recommended For You</h2>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {[
                                { item: 'Wireless Earbuds Pro', price: '$249', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&fit=crop', match: 98, reason: 'Bought "iPhone 13" 2 days ago' },
                                { item: 'Mechanical Keyboard JS', price: '$129', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=300&fit=crop', match: 85, reason: 'Similar users bought this' },
                                { item: '4K USB-C Monitor', price: '$399', img: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=300&fit=crop', match: 72, reason: 'Viewed 3x this week' },
                                { item: 'Ergonomic Mouse', price: '$89', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&fit=crop', match: 65, reason: 'Frequently bought together with Keyboard' },
                            ].map((p, i) => (
                                <div key={i} style={{ flex: 1, position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div style={{ background: '#f8fafc', borderRadius: '12px', height: '180px', marginBottom: '1rem', overflow: 'hidden', position: 'relative' }}>
                                        <img src={p.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.item} />
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#3b82f6', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}>{p.match}% Match</div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3, marginBottom: '6px' }}>{p.item}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{p.price}</div>

                                    {/* Admin Overlay View Tooltip (simulating hover state for demonstration) */}
                                    {i === 0 && (
                                        <div style={{ position: 'absolute', top: '50px', left: '-20px', background: '#1e293b', color: '#fff', padding: '1rem', borderRadius: '8px', width: '250px', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #334155' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                                                <i className="fas fa-cog"></i> Recsys Debugger
                                            </div>
                                            <div style={{ fontSize: '0.8rem', marginBottom: '8px', lineHeight: 1.4 }}><span style={{ color: '#94a3b8' }}>Algorithm:</span> Collaborative Filtering (ALS)</div>
                                            <div style={{ fontSize: '0.8rem', marginBottom: '12px', lineHeight: 1.4 }}><span style={{ color: '#94a3b8' }}>Vector Distance:</span> 0.9821</div>
                                            <div style={{ background: '#0f172a', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                                                <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Top Influencing Features:</div>
                                                • Past Purchase: Phone (0.85)<br />
                                                • User Segment: Tech Enthusiast (0.62)
                                            </div>
                                            {/* Triangle pointer */}
                                            <div style={{ position: 'absolute', top: '20px', right: '-6px', width: '12px', height: '12px', background: '#1e293b', borderRight: '1px solid #334155', borderTop: '1px solid #334155', transform: 'rotate(45deg)' }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

/* ================================================================
   ROUTER
   ================================================================ */
const projects = {
    'sales-forecasting': { title: 'B2B Sales Forecasting', subtitle: 'Interactive Mockup Integration — ARIMA Time-Series', accentColor: '#4f46e5', component: <SalesForecasting /> },
    'customer-clustering': { title: 'Customer Segmentation (K-Means)', subtitle: 'Interactive Mockup Integration — Scatter clustering', accentColor: '#3b82f6', component: <CustomerClustering /> },
    'churn-prediction': { title: 'Churn Prediction (XGBoost)', subtitle: 'Interactive Mockup Integration — classification risk', accentColor: '#ef4444', component: <ChurnPrediction /> },
    'recommendation': { title: 'Recommendation Engine', subtitle: 'Interactive Mockup Integration — collaborative filtering', accentColor: '#0f172a', component: <Recommendation /> },
}

export default function DataScienceShowcase() {
    const { projectId } = useParams()
    const project = projects[projectId]

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="D" accentColor="#4f46e5">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                <h2>Project not found</h2>
            </div>
        </ShowcaseLayout>
    )

    return (
        <ShowcaseLayout title={project.title} subtitle={project.subtitle} service="Data Science" accentColor={project.accentColor} githubUrl="https://github.com/Nurdiansyah0">
            {project.component}
        </ShowcaseLayout>
    )
}
