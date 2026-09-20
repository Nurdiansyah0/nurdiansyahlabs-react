import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from './translations'

const SUPPORTED_LANGS = ['id', 'en']
const STORAGE_KEY = 'nurdiansyahlabs_lang'

function detectLang() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved
    } catch {
        // Fallback safely if localStorage is restricted (e.g. strict sandbox / iframe SecurityError)
    }

    try {
        const browserLang = typeof navigator !== 'undefined' ? (navigator.language || navigator.userLanguage || 'id') : 'id'
        const primary = browserLang.split('-')[0].toLowerCase()
        if (SUPPORTED_LANGS.includes(primary)) return primary
    } catch {
        // Fallback safely if navigator is undefined
    }
    return 'id'
}

const LanguageContext = createContext()

// Standard commercial conversion tier rates (Rp -> USD)
const TIER_RATES_USD = {
    500000: '$35',
    2500000: '$160',
}

export const supportedLangs = SUPPORTED_LANGS

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(detectLang)
    const isIndo = lang === 'id'

    const setLang = useCallback((code) => {
        if (!SUPPORTED_LANGS.includes(code)) return
        setLangState(code)
        try {
            localStorage.setItem(STORAGE_KEY, code)
        } catch {
            // Guard against SecurityError / QuotaExceededError in restricted iframe or sandbox
        }
    }, [])

    const t = useCallback((key) => {
        const val = translations[lang]?.[key]
        if (val !== undefined) return val
        return translations['id']?.[key] || translations['en']?.[key] || key
    }, [lang])

    // formatCurrency(amountIDR): converts IDR amount to current language's currency
    // Outputs clean commercial USD ($35, $160, Custom SOW) for EN, and standard Rupiah (Rp 500.000) for ID
    const formatCurrency = useCallback((amountIDR, options = {}) => {
        if (amountIDR === null || amountIDR === undefined || amountIDR === '') return ''
        const num = Number(amountIDR)
        if (isNaN(num)) return String(amountIDR)

        if (num === 0) {
            if (options?.zeroLabel) return options.zeroLabel
            return lang === 'id' ? 'Gratis / Kustom' : 'Free Discovery / Custom SOW'
        }

        if (lang === 'en') {
            if (TIER_RATES_USD[num]) {
                return TIER_RATES_USD[num]
            }
            // General commercial conversion (approx $1 = Rp 15,625)
            const usdVal = num * 0.000064
            if (num >= 100000) {
                return `$${Math.round(usdVal).toLocaleString('en-US')}`
            }
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: (usdVal % 1 === 0) ? 0 : 2
            }).format(usdVal)
        }

        // Standard Indonesian Rupiah formatting
        try {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(num).replace(/\u00a0/g, ' ')
        } catch {
            return `Rp ${Math.round(num).toLocaleString('id-ID')}`
        }
    }, [lang])

    useEffect(() => {
        document.documentElement.lang = lang
        document.documentElement.dir = 'ltr'
    }, [lang])

    return (
        <LanguageContext.Provider value={{ lang, setLang, isIndo, t, formatCurrency, supportedLangs: SUPPORTED_LANGS }}>
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
