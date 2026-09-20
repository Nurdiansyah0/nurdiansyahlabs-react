import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from './translations'

const SUPPORTED_LANGS = ['id', 'en']
const STORAGE_KEY = 'nurdiansyahlabs_lang'

// Approximate IDR → target currency conversion rates (base: 1 IDR)
const CURRENCY_MAP = {
    id: { locale: 'id-ID', currency: 'IDR', rate: 1 },
    en: { locale: 'en-US', currency: 'USD', rate: 0.000062 },
}

function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved

    const browserLang = navigator.language || navigator.userLanguage || 'id'
    const primary = browserLang.split('-')[0].toLowerCase()
    if (SUPPORTED_LANGS.includes(primary)) return primary
    return 'id'
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(detectLang)

    const setLang = useCallback((code) => {
        if (!SUPPORTED_LANGS.includes(code)) return
        setLangState(code)
        localStorage.setItem(STORAGE_KEY, code)
    }, [])

    const t = useCallback((key) => {
        const val = translations[lang]?.[key]
        if (val !== undefined) return val
        return translations['id']?.[key] || translations['en']?.[key] || key
    }, [lang])

    // formatCurrency(amountIDR): converts IDR amount to current language's currency
    const formatCurrency = useCallback((amountIDR) => {
        const map = CURRENCY_MAP[lang] || CURRENCY_MAP['id']
        const converted = amountIDR * map.rate
        try {
            return new Intl.NumberFormat(map.locale, {
                style: 'currency',
                currency: map.currency,
                maximumFractionDigits: map.currency === 'IDR' ? 0 : 2,
            }).format(converted)
        } catch {
            return `${map.currency} ${converted.toLocaleString()}`
        }
    }, [lang])

    useEffect(() => {
        document.documentElement.lang = lang
        document.documentElement.dir = 'ltr'
    }, [lang])

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, formatCurrency, supportedLangs: SUPPORTED_LANGS }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    return useContext(LanguageContext)
}

export const langNames = {
    id: '🇮🇩 Indonesia',
    en: '🇬🇧 English',
}
