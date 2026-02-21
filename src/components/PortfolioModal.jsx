import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const portfolioData = {
    A: {
        title: 'A. Landing Page Development',
        subtitle: "Professional landing pages built for real clients",
        badgeLabel: 'SERVICE A',
        badgeBg: '#eff6ff', badgeColor: '#1d4ed8',
        headerBg: 'linear-gradient(135deg, #eff6ff 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/img_batik_store.png', tag: 'E-Commerce', tagBg: '#eff6ff', tagColor: '#1d4ed8', title: 'Toko Batik Nusantara', desc: 'Product catalog, WhatsApp order, Google Maps & CTA funnels.', route: '/showcase/landing-page/toko-batik' },
            { image: '/assets/projects/img_consultant_port.png', tag: 'Personal Brand', tagBg: '#f0f9ff', tagColor: '#0369a1', title: 'Consultant Portfolio Site', desc: 'Clean, minimalist portfolio with testimonials & packages.', route: '/showcase/landing-page/consultant-portfolio' },
            { image: '/assets/projects/img_fnb_order.png', tag: 'F&B', tagBg: '#fefce8', tagColor: '#a16207', title: 'Warung Makan Bu Sari', desc: 'Digital menu, online ordering funnel, promo section.', route: '/showcase/landing-page/warung-makan' },
            { image: '/assets/projects/img_salon_booking.png', tag: 'Beauty & Wellness', tagBg: '#fdf2f8', tagColor: '#9d174d', title: 'Salon Cantik Pro', desc: 'Booking form, gallery section, animated promo banners.', route: '/showcase/landing-page/salon-cantik' },
        ]
    },
    B: {
        title: 'B. Fullstack Developer',
        subtitle: 'Custom web systems built end-to-end — from database to UI',
        badgeLabel: 'SERVICE B',
        badgeBg: '#eef2ff', badgeColor: '#4338ca',
        headerBg: 'linear-gradient(135deg, #eef2ff 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/img_pos_system.png', tag: 'POS System', tagBg: '#eef2ff', tagColor: '#4338ca', title: 'Koperasi ARFF POS & Member', desc: 'Full cooperative management: POS cashier, member accounts, admin dashboard.', route: '/showcase/fullstack/koperasi-pos' },
            { image: '/assets/projects/img_warehouse_sys.png', tag: 'Inventory', tagBg: '#f0fdf4', tagColor: '#166534', title: 'Warehouse Management System', desc: 'Real-time stock tracking, purchase orders, barcode scanning & alerts.', route: '/showcase/fullstack/warehouse' },
            { image: '/assets/projects/img_vehicle_inspect.png', tag: 'Inspection', tagBg: '#fffbeb', tagColor: '#92400e', title: 'Vehicle Inspection Platform', desc: 'Digital inspection with photo uploads, findings log & inspector assignment.', route: '/showcase/fullstack/vehicle-inspection' },
            { image: '/assets/projects/img_hr_attendance.png', tag: 'HR System', tagBg: '#faf5ff', tagColor: '#6b21a8', title: 'Employee Attendance Portal', desc: 'GPS check-in, leave management, payroll automation & reporting.', route: '/showcase/fullstack/attendance' },
        ]
    },
    C: {
        title: 'C. Data Analyst',
        subtitle: 'Interactive dashboards & business insight reports delivered',
        badgeLabel: 'SERVICE C',
        badgeBg: '#ecfdf5', badgeColor: '#059669',
        headerBg: 'linear-gradient(135deg, #ecfdf5 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/img_dashboard_sales.png', tag: 'Sales Dashboard', tagBg: '#ecfdf5', tagColor: '#059669', title: 'Retail Sales Monitor', desc: 'Power BI tracking daily sales, best-selling SKUs, revenue by branch for 12 outlets.', route: '/showcase/data-analyst/retail-sales' },
            { image: '/assets/projects/img_ecommerce_analytics.png', tag: 'E-Commerce', tagBg: '#f0fdfa', tagColor: '#0d9488', title: 'Tokopedia Seller Analytics', desc: 'Monthly reports on conversion rate, cart abandonment & top product performance.', route: '/showcase/data-analyst/ecommerce-analytics' },
            { image: '/assets/projects/img_clinic_data.png', tag: 'Healthcare', tagBg: '#f0fdf4', tagColor: '#166534', title: 'Clinic Patient Flow Analysis', desc: 'Tableau dashboard on patient visits, wait times & doctor utilization.', route: '/showcase/data-analyst/clinic-analytics' },
            { image: '/assets/projects/img_agri_dashboard.png', tag: 'Agriculture', tagBg: '#fefce8', tagColor: '#a16207', title: 'Crop Yield Trend Report', desc: 'Seasonal yield comparison, cost vs revenue, regional performance heatmaps.', route: '/showcase/data-analyst/crop-yield' },
        ]
    },
    D: {
        title: 'D. Data Scientist',
        subtitle: 'Machine learning and AI solutions that drive smart decisions',
        badgeLabel: 'SERVICE D',
        badgeBg: '#f5f3ff', badgeColor: '#7c3aed',
        headerBg: 'linear-gradient(135deg, #f5f3ff 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/img_sales_forecast.png', tag: 'Forecasting', tagBg: '#f5f3ff', tagColor: '#7c3aed', title: 'Sales Forecasting Model (LSTM)', desc: 'Time-series LSTM predicting next 30/60/90-day revenue with 92% accuracy.', route: '/showcase/data-science/sales-forecasting' },
            { image: '/assets/projects/img_customer_cluster.png', tag: 'Segmentation', tagBg: '#fdf4ff', tagColor: '#a21caf', title: 'Customer Clustering (RFM)', desc: 'K-Means segments into Champion, At-Risk, and Lost groups for targeted campaigns.', route: '/showcase/data-science/customer-clustering' },
            { image: '/assets/projects/img_churn_model.png', tag: 'Churn Prediction', tagBg: '#fef2f2', tagColor: '#b91c1c', title: 'Subscriber Churn Detector', desc: 'XGBoost model predicting churn for 10k+ subscribers with SHAP explainability.', route: '/showcase/data-science/churn-prediction' },
            { image: '/assets/projects/img_recommend_engine.png', tag: 'Recommendation', tagBg: '#eff6ff', tagColor: '#1d4ed8', title: 'Product Recommendation Engine', desc: 'Collaborative filtering system boosting cross-sell by 23%.', route: '/showcase/data-science/recommendation' },
        ]
    }
}

function ProjectCard({ project, onNavigate, t }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden',
                boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
                transform: hovered ? 'translateY(-3px)' : 'none',
                transition: 'all 0.2s ease', background: '#fff', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', height: '100%'
            }}
            onClick={() => onNavigate(project.route)}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '65%', backgroundColor: '#f3f4f6', overflow: 'hidden', borderBottom: '1px solid #e5e7eb' }}>
                <img
                    src={project.image}
                    alt={project.title}
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'top',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease'
                    }}
                />
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ display: 'inline-block', alignSelf: 'flex-start', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '9999px', background: project.tagBg, color: project.tagColor, marginBottom: '8px' }}>
                    {project.tag}
                </span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', marginBottom: '6px', lineHeight: 1.3 }}>{project.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '12px', flexGrow: 1 }}>{project.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontSize: '0.8rem', fontWeight: 700 }}>
                    <i className="fas fa-play-circle" style={{ fontSize: '0.9rem' }}></i> {t('modal.viewDemo')}
                    <i className="fas fa-arrow-right" style={{ fontSize: '0.65rem', marginLeft: '4px', transform: hovered ? 'translateX(3px)' : 'none', transition: 'transform 0.2s' }}></i>
                </div>
            </div>
        </div>
    )
}

export default function PortfolioModal({ serviceKey, onClose }) {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const data = portfolioData[serviceKey]

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const esc = (e) => e.key === 'Escape' && onClose()
        document.addEventListener('keydown', esc)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', esc)
        }
    }, [onClose])

    if (!data) return null

    return (
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                padding: '2rem 1rem', overflowY: 'auto', animation: 'fadeIn 0.2s ease'
            }}>
            <div className="animate-slideUp" style={{
                background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '1000px',
                overflow: 'hidden', marginTop: '1rem', marginBottom: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                {/* Header */}
                <div style={{ background: data.headerBg, padding: '2rem 2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                        <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 14px', borderRadius: '9999px', background: data.badgeBg, color: data.badgeColor, marginBottom: '10px' }}>
                            {data.badgeLabel}
                        </span>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.02em' }}>{data.title}</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>{data.subtitle} — <strong style={{ color: data.badgeColor }}>{data.projects.length} {t('modal.exampleProjects')}</strong></p>
                    </div>
                    <button onClick={onClose} style={{
                        background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b', flexShrink: 0,
                        transition: 'background 0.2s, color 0.2s'
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#334155' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b' }}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Hint */}
                <div style={{ padding: '0.85rem 2.5rem', background: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                    <i className="fas fa-lightbulb" style={{ color: '#eab308' }}></i>
                    {t('modal.hint')}
                </div>

                {/* Projects grid — ALL 4 shown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', padding: '2rem 2.5rem' }}>
                    {data.projects.map(p => (
                        <ProjectCard key={p.title} project={p} onNavigate={(route) => navigate(route)} t={t} />
                    ))}
                </div>

                {/* Footer CTA */}
                <div style={{ padding: '1.5rem 2.5rem 2rem', textAlign: 'center', borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 500 }}>{t('modal.wantSimilar')}</p>
                    <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: '#22c55e', color: '#fff', padding: '12px 28px', borderRadius: '9999px',
                        fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
                        transition: 'transform 0.2s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <i className="fab fa-whatsapp" style={{ fontSize: '1.1rem' }}></i> {t('modal.discuss')}
                    </a>
                </div>
            </div>
        </div>
    )
}
