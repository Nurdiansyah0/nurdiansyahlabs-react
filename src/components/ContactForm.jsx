import { useState, useRef, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function ContactForm() {
    const { t } = useLanguage()
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        service: '',
        message: ''
    })
    const [status, setStatus] = useState('idle') // idle, submitting, success, error
    const [errorMsg, setErrorMsg] = useState('')
    
    // Custom Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

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
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleServiceSelect = (value) => {
        setFormData({ ...formData, service: value })
        setIsDropdownOpen(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')
        setErrorMsg('')

        try {
            const res = await fetch('/api/v1/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', contact: '', service: '', message: '' })
                // Reset to idle after 5 seconds
                setTimeout(() => setStatus('idle'), 5000)
            } else {
                throw new Error(data.error || 'Terjadi kesalahan saat mengirim pesan.')
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
        { value: "Landing Page", label: t('contact.serviceOption1') },
        { value: "Fullstack Web", label: t('contact.serviceOption2') },
        { value: "Data Analyst", label: t('contact.serviceOption3') },
        { value: "Data Science", label: t('contact.serviceOption4') },
        { value: "Lainnya", label: t('contact.serviceOption5') }
    ]
    
    const selectedServiceLabel = formData.service 
        ? serviceOptions.find(opt => opt.value === formData.service)?.label 
        : t('contact.serviceOptionMap')

    return (
        <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                background: '#ffffff', borderRadius: '24px', padding: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative',
                overflow: 'hidden'
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
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{t('contact.successTitle') !== 'contact.successTitle' ? t('contact.successTitle') : 'Message Sent!'}</h3>
                        <p style={{ color: '#1e293b', lineHeight: 1.6 }}>{t('contact.successDesc') !== 'contact.successDesc' ? t('contact.successDesc') : 'Thank you for your message. We will contact you shortly.'}</p>
                        <button aria-label="Action button"
                            onClick={() => setStatus('idle')}
                            style={{ marginTop: '2rem', background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '10px 24px', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {t('contact.sendAnother') !== 'contact.sendAnother' ? t('contact.sendAnother') : 'Send Another'}
                        </button>
                    </m.div>
                ) : (
                    <m.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
                            {t('contact.title')}
                        </h3>

                        {status === 'error' && (
                            <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                                <AlertCircle size={16} /> {errorMsg}
                            </m.div>
                        )}

                        <div>
                            <label style={labelStyle}>{t('contact.nameLabel')}</label>
                            <input aria-label="Form input"
                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                placeholder={t('contact.namePlaceholder')} style={inputStyle}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#3730a3'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>{t('contact.emailLabel')}</label>
                            <input aria-label="Form input"
                                type="text" name="contact" required value={formData.contact} onChange={handleChange}
                                placeholder={t('contact.emailPlaceholder')} style={inputStyle}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#3730a3'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div ref={dropdownRef} style={{ position: 'relative' }}>
                            <label style={labelStyle}>{t('contact.serviceLabel')}</label>
                            
                            {/* Hidden input to fulfill required attribute logic if needed, though we can just check before submit */}
                            <input type="hidden" name="service" value={formData.service} required />
                            
                            <div 
                                onClick={() => !status.includes('submitting') && setIsDropdownOpen(!isDropdownOpen)}
                                style={{ 
                                    ...inputStyle, 
                                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderColor: isDropdownOpen ? '#3730a3' : '#e2e8f0',
                                    color: formData.service ? '#0f172a' : '#94a3b8'
                                }}
                            >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {selectedServiceLabel}
                                </span>
                                <ChevronDown size={18} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, color: '#64748b' }} />
                            </div>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <m.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute', top: 'calc(100% - 12px)', left: 0, right: 0, zIndex: 50,
                                            background: '#ffffff', borderRadius: '12px', padding: '6px',
                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                            border: '1px solid #e2e8f0', maxHeight: '200px', overflowY: 'auto'
                                        }}
                                    >
                                        <div 
                                            onClick={() => handleServiceSelect('')}
                                            style={{
                                                padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.9rem', transition: 'background 0.2s', color: '#64748b',
                                                background: formData.service === '' ? '#f1f5f9' : 'transparent',
                                                marginBottom: '4px'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = formData.service === '' ? '#f1f5f9' : 'transparent'}
                                        >
                                            {t('contact.serviceOptionMap')}
                                        </div>
                                        {serviceOptions.map((opt) => (
                                            <div
                                                key={opt.value}
                                                onClick={() => handleServiceSelect(opt.value)}
                                                style={{
                                                    padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                                                    fontSize: '0.9rem', transition: 'background 0.2s', color: '#0f172a',
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
                            <label style={labelStyle}>{t('contact.msgLabel')}</label>
                            <textarea aria-label="Text input"
                                name="message" required value={formData.message} onChange={handleChange}
                                placeholder={t('contact.msgPlaceholder')}
                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#3730a3'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <button aria-label="Action button"
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
                                    {t('contact.sending') !== 'contact.sending' ? t('contact.sending') : 'Sending...'}
                                </>
                            ) : (
                                t('contact.btnSubmit')
                            )}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#1e293b' }}>
                            {t('contact.privacyText')}
                        </div>
                    </m.form>
                )}
            </AnimatePresence>
        </m.div>
    )
}
