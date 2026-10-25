import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTracker } from '../hooks/useTracker'

export default function PageTracker() {
    const location = useLocation()
    const { trackEvent } = useTracker()

    useEffect(() => {
        if (location.pathname.startsWith('/admin')) return
        const path = location.pathname + location.search
        trackEvent('pageview', { path })

        // Forward SPA route transitions to Google Analytics 4 (GA4)
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            try {
                window.gtag('event', 'page_view', {
                    page_path: path,
                    page_title: document.title,
                    page_location: window.location.href,
                })
            } catch {
                // Ignore silently
            }
        }
    }, [location, trackEvent])

    return null
}
