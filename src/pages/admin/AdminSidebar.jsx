import { Lock, FileText, Users, BarChart3, LogOut } from 'lucide-react'

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, onTabChange }) {
    const navBtn = (tab, icon, label) => (
        <button
            aria-label={label}
            onClick={() => onTabChange(tab)}
            style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '1rem', borderRadius: '12px', border: 'none',
                background: activeTab === tab ? '#e0e7ff' : 'transparent',
                color: activeTab === tab ? '#3730a3' : '#1e293b',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
            }}
        >
            {icon} {label}
        </button>
    )

    return (
        <>
            {/* Topbar */}
            <div style={{ background: '#0f172a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                    <div style={{ background: '#3730a3', padding: '6px', borderRadius: '8px' }}>
                        <Lock size={18} color="#fff" />
                    </div>
                    NurdiansyahLabs Admin
                </div>
                <button aria-label="Logout" onClick={onLogout} style={{ background: 'transparent', color: '#1e293b', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>

            {/* Sidebar Nav */}
            <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                {navBtn('analytics', <BarChart3 size={20} />, 'Analytics')}
                {navBtn('posts', <FileText size={20} />, 'Blog Articles')}
                {navBtn('leads', <Users size={20} />, 'Leads Inbox')}
                {navBtn('products', <BarChart3 size={20} />, 'Products (CMS)')}
            </div>
        </>
    )
}
