import React from 'react'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#f9fafb', padding: '2rem', textAlign: 'center',
                }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: '#fee2e2', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem',
                    }}>
                        ⚠️
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#4f46e5', color: '#fff', border: 'none',
                            padding: '12px 28px', borderRadius: '10px', fontWeight: 700,
                            fontSize: '0.95rem', cursor: 'pointer',
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
