import { useCallback } from 'react'

export function useTracker() {
    const trackEvent = useCallback(async (type, payload = {}) => {
        // Silently fail if fetch fails, so we don't block the UI
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
            console.error('Analytics tracking failed:', error)
        }
    }, [])

    return { trackEvent }
}
