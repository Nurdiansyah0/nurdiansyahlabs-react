import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminAnalytics({ analyticsData }) {
    if (!analyticsData) return null
    return (
        <div>
            <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a' }}>Website Traffic &amp; Engagement</h2>

            {/* KPI Scorecards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Pageviews</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{analyticsData.kpis.totalViews}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Unique Visitors</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3730a3' }}>{analyticsData.kpis.uniqueVisitors}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Events Logged</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>{analyticsData.kpis.totalEventsLogged}</div>
                </div>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Traffic Timeline</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.timelineChart}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3730a3" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3730a3" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#1e293b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#1e293b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="views" stroke="#3730a3" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Most Visited Pages</h3>
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.topPathsChart} layout="vertical" margin={{ left: 50, right: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#1e293b" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="views" fill="#166534" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Top Portfolio Interactions</h3>
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.projectsChart} layout="vertical" margin={{ left: 50, right: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#1e293b" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="clicks" fill="#b45309" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
