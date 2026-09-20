export default function ShowcaseLayout({ children }) {
    return (
        <div style={{ 
            minHeight: '100vh', 
            width: '100%', 
            position: 'relative', 
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden'
        }}>
            {/* Fully Responsive App Shell (PWA Compatible) */}
            <main style={{ 
                width: '100%', 
                flex: 1,
                position: 'relative',
                overflowX: 'hidden',
                // Hardware acceleration & momentum scroll for native PWA feel
                WebkitOverflowScrolling: 'touch',
                transform: 'translateZ(0)' // Constrain fixed elements inside viewport
            }}>
                {children}
            </main>
        </div>
    )
}
