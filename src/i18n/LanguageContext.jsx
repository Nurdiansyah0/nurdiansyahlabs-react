import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from './translations'

const SUPPORTED_LANGS = Object.keys(translations)
const STORAGE_KEY = 'nurdiansyahlabs_lang'

// Approximate IDR → target currency conversion rates (base: 1 IDR)
const CURRENCY_MAP = {
    en: { locale: 'en-US', currency: 'USD', rate: 0.000062 },
    id: { locale: 'id-ID', currency: 'IDR', rate: 1 },
    fr: { locale: 'fr-FR', currency: 'EUR', rate: 0.000058 },
    de: { locale: 'de-DE', currency: 'EUR', rate: 0.000058 },
    es: { locale: 'es-ES', currency: 'EUR', rate: 0.000058 },
    pt: { locale: 'pt-BR', currency: 'BRL', rate: 0.00031 },
    it: { locale: 'it-IT', currency: 'EUR', rate: 0.000058 },
    ja: { locale: 'ja-JP', currency: 'JPY', rate: 0.0093 },
    ko: { locale: 'ko-KR', currency: 'KRW', rate: 0.083 },
    zh: { locale: 'zh-CN', currency: 'CNY', rate: 0.00045 },
    hi: { locale: 'hi-IN', currency: 'INR', rate: 0.0052 },
    ar: { locale: 'ar-SA', currency: 'SAR', rate: 0.00023 },
    ru: { locale: 'ru-RU', currency: 'RUB', rate: 0.0056 },
    tr: { locale: 'tr-TR', currency: 'TRY', rate: 0.0020 },
}

function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved

    const browserLang = navigator.language || navigator.userLanguage || 'en'
    const primary = browserLang.split('-')[0].toLowerCase()
    if (SUPPORTED_LANGS.includes(primary)) return primary
    return 'en'
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(detectLang)

    const setLang = useCallback((code) => {
        setLangState(code)
        localStorage.setItem(STORAGE_KEY, code)
    }, [])

    const t = useCallback((key) => {
        const val = translations[lang]?.[key]
        if (val !== undefined) return val
        return translations['en']?.[key] || key
    }, [lang])

    // formatCurrency(amountIDR): converts IDR amount to current language's currency
    const formatCurrency = useCallback((amountIDR) => {
        const map = CURRENCY_MAP[lang] || CURRENCY_MAP['en']
        const converted = amountIDR * map.rate
        try {
            return new Intl.NumberFormat(map.locale, {
                style: 'currency',
                currency: map.currency,
                maximumFractionDigits: map.currency === 'IDR' || map.currency === 'JPY' || map.currency === 'KRW' ? 0 : 2,
            }).format(converted)
        } catch {
            return `${map.currency} ${converted.toLocaleString()}`
        }
    }, [lang])

    useEffect(() => {
        document.documentElement.lang = lang
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
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
    en: '🇬🇧 English',
    id: '🇮🇩 Bahasa Indonesia',
    fr: '🇫🇷 Français',
    de: '🇩🇪 Deutsch',
    es: '🇪🇸 Español',
    pt: '🇧🇷 Português',
    it: '🇮🇹 Italiano',
    ja: '🇯🇵 日本語',
    ko: '🇰🇷 한국어',
    zh: '🇨🇳 中文',
    hi: '🇮🇳 हिन्दी',
    ar: '🇸🇦 العربية',
    ru: '🇷🇺 Русский',
    tr: '🇹🇷 Türkçe',
}
