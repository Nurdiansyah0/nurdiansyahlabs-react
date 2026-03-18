import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')
        setErrorMsg('')

        try {
            const res = await fetch('/api/contact.php', {
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
        display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px'
    }

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
                        <p style={{ color: '#64748b', lineHeight: 1.6 }}>{t('contact.successDesc') !== 'contact.successDesc' ? t('contact.successDesc') : 'Thank you for your message. We will contact you shortly.'}</p>
                        <button
                            onClick={() => setStatus('idle')}
                            style={{ marginTop: '2rem', background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 24px', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer' }}
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
                            <input
                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                placeholder={t('contact.namePlaceholder')} style={inputStyle}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>{t('contact.emailLabel')}</label>
                            <input
                                type="text" name="contact" required value={formData.contact} onChange={handleChange}
                                placeholder={t('contact.emailPlaceholder')} style={inputStyle}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>{t('contact.serviceLabel')}</label>
                            <select
                                name="service" value={formData.service} onChange={handleChange}
                                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            >
                                <option value="">{t('contact.serviceOptionMap')}</option>
                                <option value="Landing Page">{t('contact.serviceOption1')}</option>
                                <option value="Fullstack Web">{t('contact.serviceOption2')}</option>
                                <option value="Data Analyst">{t('contact.serviceOption3')}</option>
                                <option value="Data Science">{t('contact.serviceOption4')}</option>
                                <option value="Lainnya">{t('contact.serviceOption5')}</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>{t('contact.msgLabel')}</label>
                            <textarea
                                name="message" required value={formData.message} onChange={handleChange}
                                placeholder={t('contact.msgPlaceholder')}
                                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                disabled={status === 'submitting'}
                                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px',
                                background: status === 'submitting' ? '#a5b4fc' : '#4f46e5',
                                color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s, transform 0.1s'
                            }}
                            onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.background = '#4338ca' }}
                            onMouseLeave={e => { if (status !== 'submitting') e.currentTarget.style.background = '#4f46e5' }}
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
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                            {t('contact.privacyText')}
                        </div>
                    </m.form>
                )}
            </AnimatePresence>
        </m.div>
    )
}
