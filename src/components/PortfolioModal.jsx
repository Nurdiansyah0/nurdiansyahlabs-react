import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lightbulb, MessageCircle, PlayCircle, ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useResponsive } from '../hooks/useResponsive'
import { useTracker } from '../hooks/useTracker'
import { getOptimizedImg } from '../utils/imgHelper'

const portfolioData = {
    A: {
        title: {
            id: 'A. Business Landing Page',
            en: 'A. Business Landing Page'
        },
        subtitle: {
            id: 'Landing page profesional yang dibangun untuk klien nyata',
            en: 'Professional landing pages built for real clients'
        },
        badgeLabel: 'SERVICE A',
        badgeBg: '#eff6ff', badgeColor: '#1e3a8a',
        headerBg: 'linear-gradient(135deg, #eff6ff 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/screenshots/ss_laptop.png', tag: 'E-Commerce', tagBg: '#eff6ff', tagColor: '#1e3a8a', title: 'Batam Laptop Center', desc: { id: 'Katalog produk teknologi, varian produk, keranjang dinamis & alur checkout.', en: 'Tech product catalog, variants, dynamic cart & checkout flow.' }, route: '/showcase/landing-page/toko-laptop-batam' },
            { image: '/assets/projects/screenshots/ss_chicken.png', tag: 'Agrobisnis', tagBg: '#f0fdf4', tagColor: '#16a34a', title: 'Batam Chicken Center', desc: { id: 'Supplier Ayam Kampung B2B dengan manajemen pesanan WhatsApp.', en: 'B2B Kampung Chicken supplier with WhatsApp order management.' }, route: '/showcase/landing-page/batam-chicken-supplier' },
            { image: '/assets/projects/screenshots/ss_siomay.png', tag: 'F&B', tagBg: '#fefce8', tagColor: '#a16207', title: 'Alyuna Siomay', desc: { id: 'Menu digital, funnel pemesanan online, bagian promo.', en: 'Digital menu, online ordering funnel, promo section.' }, route: '/showcase/landing-page/warung-makan', subdomain: 'https://warung.nurdiansyahlabs.com' },
            { image: '/assets/projects/screenshots/ss_rental.png', tag: 'Automotive', tagBg: '#fef2f2', tagColor: '#b91c1c', title: 'Batam Rental Mobil', desc: { id: 'Rental mobil dengan scraping harga pasar berbasis Python secara real-time.', en: 'Car rental with Python-based real-time market price scraping.' }, route: '/showcase/landing-page/batam-rental-mobil', subdomain: 'https://rental.nurdiansyahlabs.com' },
        ]
    },
    B: {
        title: { id: 'B. Fullstack Developer', en: 'B. Fullstack Developer' },
        subtitle: {
            id: 'Sistem web kustom yang dibangun end-to-end — dari database hingga UI',
            en: 'Custom web systems built end-to-end — from database to UI'
        },
        badgeLabel: 'SERVICE B',
        badgeBg: '#eef2ff', badgeColor: '#4338ca',
        headerBg: 'linear-gradient(135deg, #eef2ff 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/img_pos_system.png', tag: 'POS System', tagBg: '#eef2ff', tagColor: '#4338ca', title: 'Koperasi ARFF POS & Member', desc: { id: 'Manajemen koperasi lengkap: kasir POS, akun anggota, dashboard admin.', en: 'Full cooperative management: POS cashier, member accounts, admin dashboard.' }, route: '/showcase/fullstack/koperasi-pos', subdomain: 'https://pos.nurdiansyahlabs.com' },
            { image: '/assets/projects/img_warehouse_sys.png', tag: 'Inventory', tagBg: '#f0fdf4', tagColor: '#166534', title: 'Warehouse Management System', desc: { id: 'Pelacakan stok real-time, purchase order, pemindai barcode & notifikasi.', en: 'Real-time stock tracking, purchase orders, barcode scanning & alerts.' }, route: '/showcase/fullstack/warehouse-wms' },
            { image: '/assets/projects/img_vehicle_inspect.png', tag: 'Inspection', tagBg: '#fffbeb', tagColor: '#92400e', title: 'Vehicle Inspection Platform', desc: { id: 'Inspeksi digital dengan upload foto, log temuan & penugasan inspektor.', en: 'Digital inspection with photo uploads, findings log & inspector assignment.' }, route: '/showcase/fullstack/vehicle-inspection' },
            { image: '/assets/projects/img_hr_attendance.png', tag: 'HR System', tagBg: '#faf5ff', tagColor: '#6b21a8', title: 'Employee Attendance Portal', desc: { id: 'Check-in GPS, manajemen cuti, otomatisasi penggajian & pelaporan.', en: 'GPS check-in, leave management, payroll automation & reporting.' }, route: '/showcase/fullstack/attendance', subdomain: 'https://hr.nurdiansyahlabs.com' },
            { image: '/assets/projects/img_primatera.png', tag: 'ERP System', tagBg: '#fef3c7', tagColor: '#92400e', title: 'Primatera Poultry', desc: { id: 'Sistem ERP digital end-to-end untuk bisnis unggas Joper/KUB.', en: 'End-to-end digital ERP system for Joper/KUB poultry business.' }, route: '/showcase/fullstack/primatera-poultry' },
        ]
    },
    C: {
        title: { id: 'C. Analis Data', en: 'C. Data Analyst' },
        subtitle: {
            id: 'Dashboard interaktif & laporan insight bisnis yang tersampaikan',
            en: 'Interactive dashboards & business insight reports delivered'
        },
        badgeLabel: 'SERVICE C',
        badgeBg: '#ecfdf5', badgeColor: '#065f46',
        headerBg: 'linear-gradient(135deg, #ecfdf5 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/img_dashboard_sales.png', tag: 'Sales Dashboard', tagBg: '#ecfdf5', tagColor: '#065f46', title: 'Retail Sales Monitor', desc: { id: 'Power BI melacak penjualan harian, SKU terlaris, pendapatan per cabang untuk 12 gerai.', en: 'Power BI tracking daily sales, best-selling SKUs, revenue by branch for 12 outlets.' }, route: '/showcase/data-analyst/retail-sales' },
            { image: '/assets/projects/img_ecommerce_analytics.png', tag: 'E-Commerce', tagBg: '#f0fdfa', tagColor: '#0d9488', title: 'Tokopedia Seller Analytics', desc: { id: 'Laporan bulanan tentang tingkat konversi, cart abandonment & performa produk terlaris.', en: 'Monthly reports on conversion rate, cart abandonment & top product performance.' }, route: '/showcase/data-analyst/ecommerce-analytics' },
            { image: '/assets/projects/img_clinic_data.png', tag: 'Healthcare', tagBg: '#f0fdf4', tagColor: '#166534', title: 'Clinic Patient Flow Analysis', desc: { id: 'Dashboard Tableau untuk kunjungan pasien, waktu tunggu & utilisasi dokter.', en: 'Tableau dashboard on patient visits, wait times & doctor utilization.' }, route: '/showcase/data-analyst/clinic-analytics', subdomain: 'https://clinic.nurdiansyahlabs.com' },
            { image: '/assets/projects/img_agri_dashboard.png', tag: 'Agriculture', tagBg: '#fefce8', tagColor: '#a16207', title: 'Crop Yield Trend Report', desc: { id: 'Perbandingan hasil panen musiman, biaya vs pendapatan, peta panas kinerja regional.', en: 'Seasonal yield comparison, cost vs revenue, regional performance heatmaps.' }, route: '/showcase/data-analyst/crop-yield' },
        ]
    },
    D: {
        title: { id: 'D. Data Scientist', en: 'D. Data Scientist' },
        subtitle: {
            id: 'Solusi machine learning dan AI yang mendorong keputusan lebih cerdas',
            en: 'Machine learning and AI solutions that drive smart decisions'
        },
        badgeLabel: 'SERVICE D',
        badgeBg: '#f5f3ff', badgeColor: '#5b21b6',
        headerBg: 'linear-gradient(135deg, #f5f3ff 0%, #fff 100%)',
        projects: [
            { image: '/assets/projects/img_sales_forecast.png', tag: 'Forecasting', tagBg: '#f5f3ff', tagColor: '#5b21b6', title: 'Sales Forecasting Model (LSTM)', desc: { id: 'LSTM time-series memprediksi pendapatan 30/60/90 hari ke depan dengan akurasi 92%.', en: 'Time-series LSTM predicting next 30/60/90-day revenue with 92% accuracy.' }, route: '/showcase/data-science/sales-forecasting' },
            { image: '/assets/projects/img_customer_cluster.png', tag: 'Segmentation', tagBg: '#fdf4ff', tagColor: '#a21caf', title: 'Customer Clustering (RFM)', desc: { id: 'Segmentasi K-Means ke Champion, Berisiko, dan Hilang untuk kampanye tertarget.', en: 'K-Means segments into Champion, At-Risk, and Lost groups for targeted campaigns.' }, route: '/showcase/data-science/customer-clustering' },
            { image: '/assets/projects/img_churn_model.png', tag: 'Churn Prediction', tagBg: '#fef2f2', tagColor: '#b91c1c', title: 'Subscriber Churn Detector', desc: { id: 'Model XGBoost memprediksi churn untuk 10k+ pelanggan dengan SHAP explainability.', en: 'XGBoost model predicting churn for 10k+ subscribers with SHAP explainability.' }, route: '/showcase/data-science/churn-prediction' },
            { image: '/assets/projects/img_recommend_engine.png', tag: 'Recommendation', tagBg: '#eff6ff', tagColor: '#1e3a8a', title: 'Product Recommendation Engine', desc: { id: 'Collaborative filtering interaktif yang menghitung cosine similarity dan peringkat prediksi secara real-time.', en: 'Interactive collaborative filtering matrix computing real-time cosine similarity and ranking predictions.' }, route: '/showcase/data-science/recommendation' },
        ]
    }
}

function ProjectCard({ project, onNavigate, t, isIndo }) {
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                        display: 'inline-block',
                        fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '9999px',
                        background: project.tagBg, color: project.tagColor
                    }}>
                        {project.tag}
                    </span>
                    {project.subdomain && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.62rem', fontWeight: 800,
                            padding: '2px 7px', borderRadius: '6px',
                            background: '#dcfce7', color: '#15803d',
                            border: '1px solid #bbf7d0'
                        }}>
                            🌐 {isIndo ? 'Subdomain Aktif' : 'Subdomain Live'}
                        </span>
                    )}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827', marginBottom: '5px', lineHeight: 1.3 }}>{project.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '10px', flexGrow: 1 }}>
                    {typeof project.desc === 'object' ? (isIndo ? project.desc.id : project.desc.en) : project.desc}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3730a3', fontSize: '0.78rem', fontWeight: 700 }}>
                        <PlayCircle size={15} style={{ fontSize: '0.9rem' }} /> {t('modal.viewDemo')}
                        <ArrowRight size={12} style={{ fontSize: '0.65rem', marginLeft: '4px', transform: hovered ? 'translateX(3px)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PortfolioModal({ serviceKey, onClose }) {
    const navigate = useNavigate()
    const { t, isIndo } = useLanguage()
    const { isMobile, isSm } = useResponsive()
    const { trackEvent } = useTracker()
    const data = portfolioData[serviceKey]
    const modalRef = useRef(null)
    const previousActiveElement = useRef(null)

    // Track modal open
    useEffect(() => {
        if (data) {
            const titleStr = typeof data.title === 'object' ? data.title.en : data.title
            trackEvent('view_showcase_modal', { service: data.badgeLabel, title: titleStr })
        }
    }, [data, trackEvent])

    // Lock body scroll, manage focus trap, and handle ESC key
    useEffect(() => {
        previousActiveElement.current = document.activeElement
        document.body.style.overflow = 'hidden'

        // Focus the first interactive element inside the modal
        const focusTimer = setTimeout(() => {
            if (modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
                if (focusableElements.length > 0) {
                    focusableElements[0].focus()
                }
            }
        }, 50)

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
                return
            }

            if (e.key === 'Tab' && modalRef.current) {
                const focusables = Array.from(modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)

                if (focusables.length === 0) return

                const firstElement = focusables[0]
                const lastElement = focusables[focusables.length - 1]

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault()
                        lastElement.focus()
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault()
                        firstElement.focus()
                    }
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            clearTimeout(focusTimer)
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKeyDown)
            if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
                previousActiveElement.current.focus()
            }
        }
    }, [onClose])

    if (!data) return null

    return (
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
        >
            <div ref={modalRef} className="modal-inner animate-slideUp">
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
                        <h2 id="portfolio-modal-title" style={{
                            fontSize: isSm ? '1.15rem' : '1.6rem',
                            fontWeight: 800, color: '#111827', margin: '0 0 5px', letterSpacing: '-0.02em',
                            wordBreak: 'break-word',
                        }}>
                            {typeof data.title === 'object' ? (isIndo ? data.title.id : data.title.en) : data.title}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: isSm ? '0.8rem' : '0.95rem', margin: 0 }}>
                            {typeof data.subtitle === 'object' ? (isIndo ? data.subtitle.id : data.subtitle.en) : data.subtitle} —&nbsp;
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
                            cursor: 'pointer', fontSize: '1rem', color: '#1e293b', flexShrink: 0,
                            transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#334155' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b' }}>
                        <X size={18} />
                    </button>
                </div>


                {/* Projects grid */}
                <div className="modal-grid">
                    {data.projects.map(p => (
                        <ProjectCard key={p.title} project={p} onNavigate={(route) => {
                            trackEvent('click_project', { title: p.title, route })
                            navigate(route)
                        }} t={t} isIndo={isIndo} />
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
                            background: '#166534', color: '#fff',
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
