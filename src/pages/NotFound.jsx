import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#f9fafb', padding: '2rem', textAlign: 'center',
        }}>
            <div style={{
                fontSize: '6rem', fontWeight: 900, color: '#e5e7eb',
                lineHeight: 1, marginBottom: '0.5rem',
            }}>
                404
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                Page Not Found
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                style={{
                    background: '#4f46e5', color: '#fff',
                    padding: '12px 28px', borderRadius: '10px', fontWeight: 700,
                    fontSize: '0.95rem', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center',
                }}
            >
                ← Back to Home
            </Link>
        </div>
    )
}
