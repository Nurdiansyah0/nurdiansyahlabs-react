import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lightbulb, MessageCircle, PlayCircle, ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import { useTracker } from '../hooks/useTracker'
import { getOptimizedImg } from '../utils/imgHelper'

const portfolioData = {
    A: {
        title: 'A. Landing Page Development',
        subtitle: "Professional landing pages built for real clients",
        badgeLabel: 'SERVICE A',
        badgeBg: '#eff6ff', badgeColor: '#1d4ed8',
        headerBg: 'linear-gradient(135deg, #eff6ff 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/screenshots/ss_laptop.png', tag: 'E-Commerce', tagBg: '#eff6ff', tagColor: '#1d4ed8', title: 'Batam Laptop Center', desc: 'Tech product catalog, variants, dynamic cart & checkout flow.', route: '/showcase/landing-page/toko-laptop-batam' },
            { image: '/assets/projects/screenshots/ss_chicken.png', tag: 'Agrobisnis', tagBg: '#f0fdf4', tagColor: '#16a34a', title: 'Batam Chicken Center', desc: 'B2B Supplier Ayam Kampung dengan WhatsApp Order Management.', route: '/showcase/landing-page/batam-chicken-supplier' },
            { image: '/assets/projects/screenshots/ss_siomay.png', tag: 'F&B', tagBg: '#fefce8', tagColor: '#a16207', title: 'Alyuna Siomay', desc: 'Digital menu, online ordering funnel, promo section.', route: '/showcase/landing-page/warung-makan' },
            { image: '/assets/projects/screenshots/ss_rental.png', tag: 'Automotive', tagBg: '#fef2f2', tagColor: '#b91c1c', title: 'Batam Rental Mobil', desc: 'Car rental with Python-based real-time market price scraping.', route: '/showcase/landing-page/batam-rental-mobil' },
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
            { image: '/assets/projects/img_warehouse_sys.png', tag: 'Inventory', tagBg: '#f0fdf4', tagColor: '#166534', title: 'Warehouse Management System', desc: 'Real-time stock tracking, purchase orders, barcode scanning & alerts.', route: '/showcase/fullstack/warehouse-wms' },
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
                    src={getOptimizedImg(project.image, { w: 600, h: 400 })}
                    alt={project.title}
                    loading="lazy"
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'top',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease'
                    }}
                />
            </div>
            <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{
                    display: 'inline-block', alignSelf: 'flex-start',
                    fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '9999px',
                    background: project.tagBg, color: project.tagColor, marginBottom: '6px'
                }}>
                    {project.tag}
                </span>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827', marginBottom: '5px', lineHeight: 1.3 }}>{project.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '10px', flexGrow: 1 }}>{project.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontSize: '0.78rem', fontWeight: 700 }}>
                    <PlayCircle size={15} style={{ fontSize: '0.9rem' }} /> {t('modal.viewDemo')}
                    <ArrowRight size={12} style={{ fontSize: '0.65rem', marginLeft: '4px', transform: hovered ? 'translateX(3px)' : 'none', transition: 'transform 0.2s' }} />
                </div>
            </div>
        </div>
    )
}

export default function PortfolioModal({ serviceKey, onClose }) {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { isMobile, isSm } = useResponsive()
    const { trackEvent } = useTracker()
    const data = portfolioData[serviceKey]

    // Track modal open
    useEffect(() => {
        if (data) {
            trackEvent('view_showcase_modal', { service: data.badgeLabel, title: data.title })
        }
    }, [data, trackEvent])

    // Lock body scroll & ESC key
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
            className="modal-overlay">
            <div className="modal-inner animate-slideUp">
                {/* Header */}
                <div className="modal-header" style={{ background: data.headerBg }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                            display: 'inline-block', fontSize: '0.65rem', fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            padding: '4px 12px', borderRadius: '9999px',
                            background: data.badgeBg, color: data.badgeColor, marginBottom: '8px'
                        }}>
                            {data.badgeLabel}
                        </span>
                        <h2 style={{
                            fontSize: isSm ? '1.15rem' : '1.6rem',
                            fontWeight: 800, color: '#111827', margin: '0 0 5px', letterSpacing: '-0.02em',
                            wordBreak: 'break-word',
                        }}>
                            {data.title}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: isSm ? '0.8rem' : '0.95rem', margin: 0 }}>
                            {data.subtitle} —&nbsp;
                            <strong style={{ color: data.badgeColor }}>{data.projects.length} {t('modal.exampleProjects')}</strong>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        style={{
                            background: '#f1f5f9', border: 'none', borderRadius: '50%',
                            width: '44px', height: '44px', minWidth: '44px', minHeight: '44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '1rem', color: '#64748b', flexShrink: 0,
                            transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#334155' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b' }}>
                        <X size={18} />
                    </button>
                </div>


                {/* Projects grid */}
                <div className="modal-grid">
                    {data.projects.map(p => (
                        <ProjectCard key={p.title} project={p} onNavigate={(route) => {
                            trackEvent('click_project', { title: p.title, route })
                            navigate(route)
                        }} t={t} />
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="modal-footer" style={{ textAlign: 'center', borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>
                    <p style={{ color: '#6b7280', fontSize: isSm ? '0.82rem' : '0.9rem', marginBottom: '0.85rem', fontWeight: 500 }}>
                        {t('modal.wantSimilar')}
                    </p>
                    <a
                        href="https://wa.me/6282176012461"
                        target="_blank" rel="noreferrer"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#22c55e', color: '#fff',
                            padding: isSm ? '10px 22px' : '12px 28px',
                            borderRadius: '9999px', fontWeight: 700,
                            fontSize: isSm ? '0.85rem' : '0.95rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
                            transition: 'transform 0.2s', minHeight: '44px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <MessageCircle size={18} style={{ fontSize: '1.1rem' }} /> {t('modal.discuss')}
                    </a>
                </div>
            </div>
        </div>
    )
}
