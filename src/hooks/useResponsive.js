import { useState, useEffect, useMemo } from 'react'

/**
 * useResponsive — detects screen size, device type, and browser UA using matchMedia (Senior Performance Mode).
 * 
 * Performance Optimizations:
 * 1. matchMedia: Listeners only fire when a breakpoint is crossed, NOT on every pixel of resize.
 * 2. Static UA: Browser/Device detection runs exactly ONCE per session, not on every resize.
 * 3. Debounced Dimensions: If width/height are needed, they are debounced to save battery/CPU.
 * 
 * Tailwild Standard Breakpoints:
1536px *   sm: 640px
 *   md: 768px
 *   lg: 1024px
 *   xl: 1280px
 *   2xl: 
 */

// Static Device & Browser Detection (Hoisted for performance)
const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
const isMobileBrowser = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(ua)
const isIOS = /iPhone|iPad|iPod/i.test(ua)
const isAndroid = /Android/i.test(ua)
const isSamsung = /SamsungBrowser/i.test(ua)
const isXiaomi = /MI\s|MIUI|Redmi|Xiaomi/i.test(ua)
const isTouchDevice = typeof window !== 'undefined' && (isMobileBrowser || ('ontouchstart' in window))

const BREAKPOINTS = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
}

export function useResponsive() {
    // Breakpoint matches state
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return {}
        return Object.keys(BREAKPOINTS).reduce((acc, key) => {
            acc[key] = window.matchMedia(BREAKPOINTS[key]).matches
            return acc
        }, {})
    })

    // Debounced dimensions for raw pixel values
    const [dimensions, setDimensions] = useState(() => ({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    }))

    useEffect(() => {
        if (typeof window === 'undefined') return

        // 1. Breakpoint Listeners (Ultra Lightweight)
        const mediaQueryLists = Object.entries(BREAKPOINTS).map(([key, query]) => ({
            key,
            mql: window.matchMedia(query)
        }))

        const mqlHandlers = mediaQueryLists.map(({ key, mql }) => {
            const handler = (e) => setMatches(prev => ({ ...prev, [key]: e.matches }))

            if (mql.addEventListener) {
                mql.addEventListener('change', handler)
            } else {
                mql.addListener(handler) // Legacy support
            }
            return { mql, handler }
        })

        // 2. Optimized Resize Listener (Using rAF for buttery smoothness)
        let rafId
        const handleResize = () => {
            cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                })
            })
        }

        window.addEventListener('resize', handleResize, { passive: true })

        return () => {
            mqlHandlers.forEach(({ mql, handler }) => {
                if (mql.removeEventListener) {
                    mql.removeEventListener('change', handler)
                } else {
                    mql.addListener(handler)
                }
            })
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(rafId)
        }
    }, [])

    return useMemo(() => {
        const isMobile = !matches.md // < 768px
        const isTablet = matches.md && !matches.lg // 768px - 1023px
        const isDesktop = matches.lg // >= 1024px

        return {
            // Raw values
            ...dimensions,

            // Breakpoint flags (Tailwind standard)
            isXs: dimensions.width < 480, // Restoring legacy 'tiny phone' detection
            isSm: matches.sm,
            isMd: matches.md,
            isLg: matches.lg,
            isXl: matches.xl,
            is2xl: matches['2xl'],

            // Semantic aliases
            isMobile,
            isTablet,
            isDesktop,

            // Static data
            isTouchDevice,
            ua,
            isMobileBrowser,
            isIOS,
            isAndroid,
            isSamsung,
            isXiaomi
        }
    }, [dimensions, matches])
}

/**
 * Responsive Value Helper (rv)
 */
export function rv(resp, vals) {
    if (resp.isXs && vals.xs !== undefined) return vals.xs
    if (resp.isSm && vals.sm !== undefined) return vals.sm
    if (resp.isMd && vals.md !== undefined) return vals.md
    if (resp.isLg && vals.lg !== undefined) return vals.lg
    return vals.default ?? vals.lg ?? vals.md ?? vals.sm ?? vals.xs
}
