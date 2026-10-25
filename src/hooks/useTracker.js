import { useCallback } from 'react'

export function useTracker() {
    const trackEvent = useCallback(async (type, payload = {}) => {
        // 1. Silently forward to Google Analytics 4 (GA4) if initialized
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            try {
                window.gtag('event', type, payload)
            } catch {
                // Silently ignore GA error
            }
        }

        // 2. Persist to in-house analytics database
        try {
            await fetch('/api/v1/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    ...payload,
                }),
                // Use keepalive to ensure the request finishes even if the user navigates away
                keepalive: true
            })
        } catch (error) {
            console.error('In-house analytics tracking failed:', error)
        }
    }, [])

    return { trackEvent }
}
