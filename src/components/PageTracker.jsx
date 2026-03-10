import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTracker } from '../hooks/useTracker'

export default function PageTracker() {
    const location = useLocation()
    const { trackEvent } = useTracker()

    useEffect(() => {
        if (location.pathname.startsWith('/admin')) return
        trackEvent('pageview', { path: location.pathname + location.search })
    }, [location, trackEvent])

    return null
}
