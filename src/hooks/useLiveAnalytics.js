import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useLiveAnalytics — Custom React Hook
 * 
 * Connects to PHP Server-Sent Events endpoint `/api/stream.php`.
 * Delivers real-time visitor data (active_now, pageviews_today, top_pages)
 * without WebSocket, Node.js, or any paid third-party service.
 * 
 * @param {Object} options
 * @param {boolean} options.enabled  – Set false to pause connection (e.g. when admin panel is hidden)
 * @returns {{ activeNow, pageviewsToday, topPages, isConnected, error }}
 */
export function useLiveAnalytics({ enabled = true } = {}) {
  const [activeNow, setActiveNow]       = useState(0)
  const [pageviewsToday, setPageviews]  = useState(0)
  const [topPages, setTopPages]         = useState([])
  const [isConnected, setIsConnected]   = useState(false)
  const [error, setError]               = useState(null)

  const esRef           = useRef(null)
  const reconnectTimer  = useRef(null)

  const connect = useCallback(() => {
    if (!enabled || typeof EventSource === 'undefined') return
    if (esRef.current) {
      esRef.current.close()
    }

    const es = new EventSource('/api/stream.php')
    esRef.current = es

    es.addEventListener('analytics', (event) => {
      try {
        const data = JSON.parse(event.data)
        setActiveNow(data.active_now     ?? 0)
        setPageviews(data.pageviews_today ?? 0)
        setTopPages(data.top_pages       ?? [])
        setIsConnected(true)
        setError(null)
      } catch {
        /* malformed frame — ignore */
      }
    })

    // PHP sends this when loop ends (every ~2min) — browser auto-reconnects
    es.addEventListener('reconnect', () => {
      es.close()
      reconnectTimer.current = setTimeout(connect, 500)
    })

    es.onerror = () => {
      setIsConnected(false)
      setError('Stream disconnected — retrying…')
      es.close()
      reconnectTimer.current = setTimeout(connect, 3000)
    }
  }, [enabled])

  useEffect(() => {
    connect()
    return () => {
      esRef.current?.close()
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
    }
  }, [connect])

  return { activeNow, pageviewsToday, topPages, isConnected, error }
}
