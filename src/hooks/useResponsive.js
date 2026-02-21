import { useState, useEffect } from 'react'

/**
 * useResponsive — detects screen size, device type, and browser UA.
 * Breakpoints:
 *   xs   < 480px   (small phones like iPhone SE)
 *   sm   < 640px   (phones, Xiaomi 14 ≈ 393px)
 *   md   < 768px   (large phones / small tablets)
 *   lg   < 1024px  (tablets)
 *   xl  >= 1024px  (desktop)
 */
export function useResponsive() {
    const getValues = () => {
        const w = window.innerWidth
        const h = window.innerHeight
        const ua = navigator.userAgent || ''
        const isMobileBrowser = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(ua)
        const isIOS = /iPhone|iPad|iPod/i.test(ua)
        const isAndroid = /Android/i.test(ua)
        const isSamsung = /SamsungBrowser/i.test(ua)
        const isXiaomi = /MI\s|MIUI|Redmi|Xiaomi/i.test(ua)

        return {
            width: w,
            height: h,
            // breakpoints
            isXs: w < 480,
            isSm: w < 640,
            isMd: w < 768,
            isLg: w < 1024,
            isXl: w >= 1024,
            // convenience aliases
            isMobile: w < 768,
            isTablet: w >= 768 && w < 1024,
            isDesktop: w >= 1024,
            // touch
            isTouchDevice: isMobileBrowser || ('ontouchstart' in window),
            // browser info
            ua,
            isMobileBrowser,
            isIOS,
            isAndroid,
            isSamsung,
            isXiaomi,
        }
    }

    const [resp, setResp] = useState(getValues)

    useEffect(() => {
        const handleResize = () => setResp(getValues())
        window.addEventListener('resize', handleResize, { passive: true })
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return resp
}

/**
 * Responsive value helper — returns the most specific matching value.
 * Usage: rv(resp, { xs: '0.75rem', sm: '1rem', default: '1.2rem' })
 */
export function rv(resp, vals) {
    if (resp.isXs && vals.xs !== undefined) return vals.xs
    if (resp.isSm && vals.sm !== undefined) return vals.sm
    if (resp.isMd && vals.md !== undefined) return vals.md
    if (resp.isLg && vals.lg !== undefined) return vals.lg
    return vals.default ?? vals.lg ?? vals.md ?? vals.sm ?? vals.xs
}
