import { useState, useRef, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle, ChevronDown, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useTracker } from '../hooks/useTracker'

const PACKAGE_CONFIG = {
    'starter': {
        value: 'Paket 1: Starter Web & Landing Page',
        message: 'Halo NurdiansyahLabs, saya tertarik dengan Paket 1: Starter Web & Landing Page (Mulai Rp 500.000). Saya ingin mendiskusikan kebutuhan landing page untuk bisnis/startup saya.'
    },
    'landing-page': {
        value: 'Paket 1: Starter Web & Landing Page',
        message: 'Halo NurdiansyahLabs, saya tertarik dengan Paket 1: Starter Web & Landing Page (Mulai Rp 500.000). Saya ingin mendiskusikan kebutuhan landing page untuk bisnis/startup saya.'
    },
    'Landing Page': {
        value: 'Paket 1: Starter Web & Landing Page',
        message: 'Halo NurdiansyahLabs, saya tertarik dengan Paket 1: Starter Web & Landing Page (Mulai Rp 500.000). Saya ingin mendiskusikan kebutuhan landing page untuk bisnis/startup saya.'
    },
    'custom': {
        value: 'Paket 2: Custom Web Application & Operational ERP',
        message: 'Halo NurdiansyahLabs, saya ingin meminta penawaran untuk Paket 2: Custom Web Application & Operational ERP (Mulai Rp 2.500.000). Bisnis kami membutuhkan sistem kustom untuk pengelolaan operasional dan database.'
    },
    'custom-erp': {
        value: 'Paket 2: Custom Web Application & Operational ERP',
        message: 'Halo NurdiansyahLabs, saya ingin meminta penawaran untuk Paket 2: Custom Web Application & Operational ERP (Mulai Rp 2.500.000). Bisnis kami membutuhkan sistem kustom untuk pengelolaan operasional dan database.'
    },
    'web-development': {
        value: 'Paket 2: Custom Web Application & Operational ERP',
        message: 'Halo NurdiansyahLabs, saya ingin meminta penawaran untuk Paket 2: Custom Web Application & Operational ERP (Mulai Rp 2.500.000). Bisnis kami membutuhkan sistem kustom untuk pengelolaan operasional dan database.'
    },
    'Fullstack Web': {
        value: 'Paket 2: Custom Web Application & Operational ERP',
        message: 'Halo NurdiansyahLabs, saya ingin meminta penawaran untuk Paket 2: Custom Web Application & Operational ERP (Mulai Rp 2.500.000). Bisnis kami membutuhkan sistem kustom untuk pengelolaan operasional dan database.'
    },
    'advisory': {
        value: 'Paket 3: Technical Architecture Advisory & Enterprise Consultation',
        message: 'Halo NurdiansyahLabs, saya ingin menjadwalkan sesi Paket 3: Technical Architecture Advisory & Enterprise Consultation (Gratis 30-Menit Discovery) untuk mendiskusikan arsitektur sistem dan strategi teknologi kami.'
    },
    'machine-learning': {
        value: 'Paket 3: Technical Architecture Advisory & Enterprise Consultation',
        message: 'Halo NurdiansyahLabs, saya ingin menjadwalkan sesi Paket 3: Technical Architecture Advisory & Enterprise Consultation (Gratis 30-Menit Discovery) untuk mendiskusikan arsitektur sistem dan strategi teknologi kami.'
    },
    'Data Science': {
        value: 'Paket 3: Technical Architecture Advisory & Enterprise Consultation',
        message: 'Halo NurdiansyahLabs, saya ingin menjadwalkan sesi Paket 3: Technical Architecture Advisory & Enterprise Consultation (Gratis 30-Menit Discovery) untuk mendiskusikan arsitektur sistem dan strategi teknologi kami.'
    },
    'data-analyst': {
        value: 'Business Intelligence & Data Analytics Dashboard',
        message: 'Halo NurdiansyahLabs, saya ingin konsultasi mengenai pembuatan Business Intelligence & Dashboard Data untuk analisa performa bisnis saya.'
    },
    'Data Analyst': {
        value: 'Business Intelligence & Data Analytics Dashboard',
        message: 'Halo NurdiansyahLabs, saya ingin konsultasi mengenai pembuatan Business Intelligence & Dashboard Data untuk analisa performa bisnis saya.'
    }
}

const DEFAULT_MESSAGES = Object.values(PACKAGE_CONFIG).map(p => p.message)

export default function ContactForm() {
    const { t, lang } = useLanguage()
    const { trackEvent } = useTracker()
    const isIndo = lang === 'id'

    const [hasStartedForm, setHasStartedForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        service: '',
        message: ''
    })
    const [status, setStatus] = useState('idle') // idle, submitting, success, error
    const [errorMsg, setErrorMsg] = useState('')
    const [isHighlighted, setIsHighlighted] = useState(false)
    
    // Custom Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Handle incoming URL search params on mount or hash navigation
    useEffect(() => {
        const checkUrlParams = () => {
            const params = new URLSearchParams(window.location.search)
            const targetParam = params.get('package') || params.get('service')
            if (targetParam && PACKAGE_CONFIG[targetParam]) {
                const config = PACKAGE_CONFIG[targetParam]
                setFormData(prev => ({
                    ...prev,
                    service: config.value,
                    message: !prev.message || DEFAULT_MESSAGES.includes(prev.message) ? config.message : prev.message
                }))
                setIsHighlighted(true)
                setTimeout(() => setIsHighlighted(false), 3000)
            }
        }

        checkUrlParams()
        window.addEventListener('popstate', checkUrlParams)
        return () => window.removeEventListener('popstate', checkUrlParams)
    }, [])

    // Listen to custom event for seamless commercial package selection
    useEffect(() => {
        const handlePackageSelectEvent = (e) => {
            const detail = e.detail || {}
            const pkgKey = detail.packageId || detail.service || ''
            const pkgConfig = PACKAGE_CONFIG[pkgKey]

            const newService = detail.service || (pkgConfig ? pkgConfig.value : '')
            const newMessage = detail.message || (pkgConfig ? pkgConfig.message : '')

            setFormData(prev => ({
                ...prev,
                service: newService || prev.service,
                message: newMessage || prev.message
            }))

            setIsHighlighted(true)
            setTimeout(() => setIsHighlighted(false), 3000)
        }

        window.addEventListener('selectPackage', handlePackageSelectEvent)
        return () => window.removeEventListener('selectPackage', handlePackageSelectEvent)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleChange = (e) => {
        if (!hasStartedForm) {
            setHasStartedForm(true)
            trackEvent('lead_form_start', { field: e.target.name })
        }
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleServiceSelect = (value) => {
        if (!hasStartedForm) {
            setHasStartedForm(true)
            trackEvent('lead_form_start', { field: 'service' })
        }
        
        let draftMsg = formData.message
        if (!formData.message || DEFAULT_MESSAGES.includes(formData.message)) {
            const foundConfig = Object.values(PACKAGE_CONFIG).find(p => p.value === value)
            if (foundConfig) {
                draftMsg = foundConfig.message
            }
        }

        setFormData({ ...formData, service: value, message: draftMsg })
        setIsDropdownOpen(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')
        setErrorMsg('')
        trackEvent('lead_form_submit', { service: formData.service || 'General' })

        try {
            const res = await fetch('/api/v1/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setStatus('success')
                trackEvent('lead_form_success', { service: formData.service || 'General', lead_id: data.data?.id })
                setFormData({ name: '', contact: '', service: '', message: '' })
                setHasStartedForm(false)
                // Reset to idle after 5 seconds
                setTimeout(() => setStatus('idle'), 5000)
            } else {
                trackEvent('lead_form_error', { code: data.error?.code || 'VALIDATION_ERROR' })
                throw new Error(data.error?.message || data.error || 'Terjadi kesalahan saat mengirim pesan.')
            }
        } catch (err) {
            setStatus('error')
            setErrorMsg(err.message || 'Gagal terhubung ke server. Silakan coba lagi.')
        }
    }

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: '12px',
        border: '1px solid #e2e8f0', background: '#f8fafc',
        fontSize: '0.95rem', color: '#0f172a', transition: 'all 0.2s',
        marginBottom: '1rem', outline: 'none'
    }

    const labelStyle = {
        display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px'
    }

    const serviceOptions = [
        { 
            value: "Paket 1: Starter Web & Landing Page", 
            label: isIndo ? "Paket 1: Starter Web & Landing Page (Mulai Rp 500rb)" : "Package 1: Starter Web & Landing Page (From Rp 500k)" 
        },
        { 
            value: "Paket 2: Custom Web Application & Operational ERP", 
            label: isIndo ? "Paket 2: Custom Web App & Operational ERP (Mulai Rp 2.5jt)" : "Package 2: Custom Web App & Operational ERP (From Rp 2.5M)" 
        },
        { 
            value: "Paket 3: Technical Architecture Advisory & Enterprise Consultation", 
            label: isIndo ? "Paket 3: Technical Architecture Advisory (Gratis Discovery)" : "Package 3: Technical Architecture Advisory (Free Discovery)" 
        },
        { 
            value: "Business Intelligence & Data Analytics Dashboard", 
            label: isIndo ? "Business Intelligence & Dashboard Data (Mulai Rp 2.5jt)" : "Business Intelligence & Data Dashboard" 
        },
        { 
            value: "Konsultasi Kustom / Lainnya", 
            label: isIndo ? "Konsultasi Kustom / Kebutuhan Lainnya" : "Custom Consultation / Other" 
        }
    ]
    
    const selectedServiceObj = serviceOptions.find(opt => opt.value === formData.service)
    const selectedServiceLabel = selectedServiceObj ? selectedServiceObj.label : (formData.service || (isIndo ? 'Pilih Paket atau Layanan...' : 'Choose a package or service...'))

    return (
        <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                background: '#ffffff', 
                borderRadius: '24px', 
                padding: '2rem',
                border: isHighlighted ? '2px solid #6366f1' : '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: isHighlighted 
                    ? '0 0 0 4px rgba(99, 102, 241, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.15)' 
                    : '0 20px 40px rgba(0,0,0,0.08)', 
                position: 'relative',
                overflow: 'hidden',
                transition: 'border 0.3s ease, box-shadow 0.3s ease'
            }}
        >
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <m.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ textAlign: 'center', padding: '2rem 1rem' }}
                    >
                        <m.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            style={{ display: 'inline-flex', background: '#dcfce7', color: '#16a34a', padding: '16px', borderRadius: '50%', marginBottom: '1.5rem' }}
                        >
                            <CheckCircle size={40} />
                        </m.div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                            {isIndo ? 'Permintaan Terkirim!' : 'Inquiry Submitted!'}
                        </h3>
                        <p style={{ color: '#1e293b', lineHeight: 1.6 }}>
                            {isIndo 
                                ? 'Terima kasih atas pesan Anda. Kami akan meninjau kebutuhan proyek Anda dan membalas dalam waktu maksimal 2-4 jam kerja.' 
                                : 'Thank you for reaching out. We will review your project scope and respond within 2-4 business hours.'}
                        </p>
                        <button 
                            aria-label="Kirim Permintaan Baru"
                            onClick={() => setStatus('idle')}
                            style={{ marginTop: '2rem', background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '10px 24px', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {isIndo ? 'Kirim Pesan Lain' : 'Send Another Inquiry'}
                        </button>
                    </m.div>
                ) : (
                    <m.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                {isIndo ? 'Mulai Konsultasi & Penawaran' : 'Start Consultation & Request Quote'}
                            </h3>
                            {formData.service && (
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: '#e0e7ff',
                                    color: '#3730a3',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '4px 10px',
                                    borderRadius: '9999px'
                                }}>
                                    <Sparkles size={12} /> {isIndo ? 'Paket Dipilih' : 'Package Pre-filled'}
                                </span>
                            )}
                        </div>

                        {status === 'error' && (
                            <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                                <AlertCircle size={16} /> {errorMsg}
                            </m.div>
                        )}

                        <div>
                            <label htmlFor="contact-name" style={labelStyle}>{t('contact.nameLabel')}</label>
                            <input
                                id="contact-name"
                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                placeholder={t('contact.namePlaceholder')} style={inputStyle}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#3730a3'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label htmlFor="contact-channel" style={labelStyle}>{t('contact.emailLabel')}</label>
                            <input
                                id="contact-channel"
                                type="text" name="contact" required value={formData.contact} onChange={handleChange}
                                placeholder={t('contact.emailPlaceholder')} style={inputStyle}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#3730a3'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <label id="service-select-label" style={labelStyle}>{t('contact.serviceLabel')}</label>
                            
                            {/* Hidden input to fulfill required attribute logic */}
                            <input type="hidden" name="service" value={formData.service} required />
                            
                            <button
                                type="button"
                                id="service-select-button"
                                aria-haspopup="listbox"
                                aria-expanded={isDropdownOpen}
                                aria-labelledby="service-select-label service-select-button"
                                onClick={() => !status.includes('submitting') && setIsDropdownOpen(!isDropdownOpen)}
                                onKeyDown={e => {
                                    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setIsDropdownOpen(true)
                                    } else if (e.key === 'Escape') {
                                        setIsDropdownOpen(false)
                                    }
                                }}
                                style={{ 
                                    ...inputStyle, 
                                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderColor: isDropdownOpen ? '#3730a3' : (formData.service ? '#6366f1' : '#e2e8f0'),
                                    color: formData.service ? '#0f172a' : '#94a3b8',
                                    textAlign: 'left',
                                    fontWeight: formData.service ? 600 : 400
                                }}
                            >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {selectedServiceLabel}
                                </span>
                                <ChevronDown size={18} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, color: '#64748b' }} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <m.div
                                        role="listbox"
                                        aria-labelledby="service-select-label"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute', top: 'calc(100% - 12px)', left: 0, right: 0, zIndex: 50,
                                            background: '#ffffff', borderRadius: '12px', padding: '6px',
                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                            border: '1px solid #e2e8f0', maxHeight: '220px', overflowY: 'auto'
                                        }}
                                    >
                                        <div 
                                            role="option"
                                            aria-selected={formData.service === ''}
                                            tabIndex={0}
                                            onClick={() => handleServiceSelect('')}
                                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleServiceSelect('')}
                                            style={{
                                                padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.88rem', transition: 'background 0.2s', color: '#64748b',
                                                background: formData.service === '' ? '#f1f5f9' : 'transparent',
                                                marginBottom: '4px'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = formData.service === '' ? '#f1f5f9' : 'transparent'}
                                        >
                                            {isIndo ? '— Pilih Paket atau Layanan —' : '— Select Package or Service —'}
                                        </div>
                                        {serviceOptions.map((opt) => (
                                            <div
                                                key={opt.value}
                                                role="option"
                                                aria-selected={formData.service === opt.value}
                                                tabIndex={0}
                                                onClick={() => handleServiceSelect(opt.value)}
                                                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleServiceSelect(opt.value)}
                                                style={{
                                                    padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                                                    fontSize: '0.88rem', transition: 'background 0.2s', color: '#0f172a',
                                                    fontWeight: formData.service === opt.value ? 700 : 500,
                                                    background: formData.service === opt.value ? '#e0e7ff' : 'transparent',
                                                    marginBottom: '4px'
                                                }}
                                                onMouseEnter={e => {
                                                    if (formData.service !== opt.value) e.currentTarget.style.background = '#f8fafc'
                                                }}
                                                onMouseLeave={e => {
                                                    if (formData.service !== opt.value) e.currentTarget.style.background = 'transparent'
                                                }}
                                            >
                                                {opt.label}
                                            </div>
                                        ))}
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <label htmlFor="contact-message" style={labelStyle}>{t('contact.msgLabel')}</label>
                            <textarea
                                id="contact-message"
                                name="message" required value={formData.message} onChange={handleChange}
                                placeholder={t('contact.msgPlaceholder')}
                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#3730a3'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <button
                            aria-label={status === 'submitting' ? 'Mengirim pesan penawaran...' : t('contact.btnSubmit')}
                            type="submit"
                            disabled={status === 'submitting'}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px',
                                background: status === 'submitting' ? '#a5b4fc' : '#3730a3',
                                color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s, transform 0.1s'
                            }}
                            onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.background = '#4338ca' }}
                            onMouseLeave={e => { if (status !== 'submitting') e.currentTarget.style.background = '#3730a3' }}
                            onMouseDown={e => { if (status !== 'submitting') e.currentTarget.style.transform = 'scale(0.98)' }}
                            onMouseUp={e => { if (status !== 'submitting') e.currentTarget.style.transform = 'scale(1)' }}
                        >
                            {status === 'submitting' ? (
                                <>
                                    <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                        <Loader2 size={20} />
                                    </m.div>
                                    {isIndo ? 'Mengirim Permintaan...' : 'Submitting...'}
                                </>
                            ) : (
                                t('contact.btnSubmit')
                            )}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#475569' }}>
                            {t('contact.privacyText')}
                        </div>
                    </m.form>
                )}
            </AnimatePresence>
        </m.div>
    )
}
