import { useState, useEffect } from 'react'

/**
 * ProtectedRoute — guards routes that require admin authentication.
 *
 * Strategy:
 *  - No token in sessionStorage → render children directly.
 *    AdminDashboard handles its own login UI, so we let it render — it will
 *    show the login form. The guard's job is to prevent a *stale/forged*
 *    token from bypassing the UI and accessing dashboard data.
 *
 *  - Token found → verify it server-side (GET /api/auth.php?action=verify).
 *      · Valid   → render children normally.
 *      · Invalid → clear the bad token + render children (AdminDashboard
 *                  sees no token and shows the login form).
 *      · Checking→ show a loading spinner.
 */
export default function ProtectedRoute({ children }) {
    // 'idle'     — no token, skip network check, render immediately
    // 'checking' — token found, verifying with server
    // 'ready'    — verification done (pass or fail), render children
    const [status, setStatus] = useState(() => {
        const token = sessionStorage.getItem('adminToken')
        return token ? 'checking' : 'idle'
    })

    useEffect(() => {
        const token = sessionStorage.getItem('adminToken')
        if (!token) return // nothing to verify

        fetch('/api/v1/auth/verify', {
            method: 'GET',
            headers: { 'X-Admin-Token': token },
        })
            .then((res) => {
                if (!res.ok) {
                    // Token is stale or invalid — wipe it so AdminDashboard
                    // shows the login form instead of partially-authed state
                    sessionStorage.removeItem('adminToken')
                }
            })
            .catch(() => {
                // Network failure — fail closed: clear token, force re-login
                sessionStorage.removeItem('adminToken')
            })
            .finally(() => {
                setStatus('ready')
            })
    }, [])

    if (status === 'checking') {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0a0b',
                    color: '#6366f1',
                    gap: '1rem',
                }}
            >
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: 'spin 1s linear infinite' }}
                >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Verifying session…</span>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    // 'idle' or 'ready' — let AdminDashboard render and handle its own auth state
    return children
}
