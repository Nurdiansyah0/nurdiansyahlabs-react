import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminAnalytics({ analyticsData }) {
    if (!analyticsData) return null

    // Safe normalization supporting both modular monolith & legacy payloads
    const kpis = analyticsData.kpis || {
        totalViews: analyticsData.metrics?.total_events || 0,
        uniqueVisitors: analyticsData.metrics?.unique_visitors || 0,
        totalEventsLogged: analyticsData.metrics?.total_events || 0
    }

    const totalViews = kpis.totalViews ?? analyticsData.metrics?.total_events ?? 0
    const uniqueVisitors = kpis.uniqueVisitors ?? analyticsData.metrics?.unique_visitors ?? 0
    const totalEventsLogged = kpis.totalEventsLogged ?? analyticsData.metrics?.total_events ?? 0

    const topPathsChart = Array.isArray(analyticsData.topPathsChart)
        ? analyticsData.topPathsChart
        : Array.isArray(analyticsData.metrics?.top_paths)
            ? analyticsData.metrics.top_paths.map(p => ({
                name: p.path || p.name || '/',
                views: p.count || p.views || 0
            }))
            : []

    const timelineChart = Array.isArray(analyticsData.timelineChart) ? analyticsData.timelineChart : []
    const projectsChart = Array.isArray(analyticsData.projectsChart) ? analyticsData.projectsChart : []

    return (
        <div>
            <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a' }}>Website Traffic &amp; Engagement</h2>

            {/* KPI Scorecards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Pageviews</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{totalViews}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Unique Visitors</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3730a3' }}>{uniqueVisitors}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Events Logged</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>{totalEventsLogged}</div>
                </div>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Traffic Timeline</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        {timelineChart.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineChart}>
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
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                Belum ada data timeline lalu lintas terkumpul
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Most Visited Pages</h3>
                        <div style={{ height: '250px', width: '100%' }}>
                            {topPathsChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topPathsChart} layout="vertical" margin={{ left: 50, right: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" stroke="#1e293b" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="views" fill="#166534" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Belum ada data kunjungan halaman
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Top Portfolio Interactions</h3>
                        <div style={{ height: '250px', width: '100%' }}>
                            {projectsChart.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={projectsChart} layout="vertical" margin={{ left: 50, right: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" stroke="#1e293b" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="clicks" fill="#b45309" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Belum ada interaksi portofolio tercatat
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
