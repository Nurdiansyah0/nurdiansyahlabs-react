import { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import AdminLogin from './AdminLogin'
import AdminSidebar from './AdminSidebar'
import AdminAnalytics from './AdminAnalytics'
import AdminPosts from './AdminPosts'
import AdminLeads from './AdminLeads'
import AdminProducts from './AdminProducts'

export default function AdminDashboard() {
    // ── Auth State ─────────────────────────────────────────────────────────────
    const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '')
    const [isAuthed, setIsAuthed] = useState(!!sessionStorage.getItem('adminToken'))
    const [authView, setAuthView] = useState('login') // 'login' | 'forgot' | 'reset'
    const [usernameInput, setUsernameInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState('')
    const [authMessage, setAuthMessage] = useState('')
    const [resetTokenParam, setResetTokenParam] = useState('')

    // ── Dashboard State ────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('analytics')
    const [posts, setPosts] = useState([])
    const [leads, setLeads] = useState([])
    const [products, setProducts] = useState([])
    const [productApp, setProductApp] = useState('toko-laptop-batam')
    const [analyticsData, setAnalyticsData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [editingPost, setEditingPost] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // ── Helpers ────────────────────────────────────────────────────────────────
    const authFetch = async (url, options = {}) => {
        const headers = { 'X-Admin-Token': token, ...options.headers }
        const res = await fetch(url, { ...options, headers })
        if (res.status === 401) { handleLogout(); throw new Error('Unauthorized') }
        return res
    }

    // Detect reset token in URL on mount
    useEffect(() => {
        const resetParam = new URLSearchParams(window.location.search).get('reset')
        if (resetParam) { setResetTokenParam(resetParam); setAuthView('reset'); setIsAuthed(false) }
    }, [])

    // ── Auth Handlers ──────────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault(); setAuthError(''); setAuthMessage('')
        try {
            const res = await fetch('/api/auth.php?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: usernameInput, password: passwordInput }) })
            const data = await res.json()
            if (res.ok && data.status === 'success') { setToken(data.token); sessionStorage.setItem('adminToken', data.token); setIsAuthed(true) }
            else setAuthError(data.error || 'Invalid credentials')
        } catch { setAuthError('Server error') }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault(); setAuthError(''); setAuthMessage('')
        try {
            const res = await fetch('/api/auth.php?action=forgot_password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: usernameInput }) })
            const data = await res.json()
            if (res.ok) setAuthMessage(data.message || 'Check your email for reset instructions.')
            else setAuthError(data.error || 'Failed to process request')
        } catch { setAuthError('Server error') }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault(); setAuthError(''); setAuthMessage('')
        try {
            const res = await fetch('/api/auth.php?action=reset_password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: resetTokenParam, password: passwordInput }) })
            const data = await res.json()
            if (res.ok) { setAuthMessage('Password reset successfully! You can now log in.'); setTimeout(() => { window.location.href = '/admin' }, 2000) }
            else setAuthError(data.error || 'Failed to reset password')
        } catch { setAuthError('Server error') }
    }

    const handleLogout = () => {
        setToken(''); sessionStorage.removeItem('adminToken'); setIsAuthed(false)
        setPosts([]); setLeads([]); setProducts([])
    }

    const handleTabChange = (tab) => { setActiveTab(tab); setEditingPost(null); setIsCreating(false) }

    // ── Data Fetching ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthed) return
        const load = async () => {
            setLoading(true)
            try {
                if (activeTab === 'posts') { const r = await authFetch('/api/admin.php?action=posts'); if (r.ok) setPosts((await r.json()).posts || []) }
                else if (activeTab === 'leads') { const r = await authFetch('/api/admin.php?action=leads'); if (r.ok) setLeads((await r.json()).leads || []) }
                else if (activeTab === 'analytics') { const r = await authFetch('/api/analytics.php'); if (r.ok) setAnalyticsData(await r.json()) }
                else if (activeTab === 'products') { const r = await authFetch(`/api/products.php?app=${productApp}`); if (r.ok) setProducts((await r.json()).data || []) }
            } catch (err) { console.error('Failed to load data', err) }
            finally { setLoading(false) }
        }
        load()
    }, [isAuthed, activeTab, productApp])

    // ── CRUD Handlers ──────────────────────────────────────────────────────────
    const handleDeletePost = async (slug) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return
        try { const r = await authFetch(`/api/admin.php?action=posts&slug=${slug}`, { method: 'DELETE' }); if (r.ok) setPosts(posts.filter(p => p.slug !== slug)) }
        catch { alert('Failed to delete post.') }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        try { const r = await authFetch(`/api/products.php?id=${id}`, { method: 'DELETE' }); if (r.ok) setProducts(products.filter(p => p.id !== id)) }
        catch { alert('Failed to delete product.') }
    }

    const handleDeleteLead = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead message?')) return
        try {
            const r = await authFetch(`/api/admin.php?action=leads&id=${id}`, { method: 'DELETE' })
            if (r.ok) setLeads(leads.filter(l => l.id !== id))
            else alert('Failed to delete lead on server.')
        } catch { alert('Failed to connect to server to delete lead.') }
    }

    const handleSavePost = async (e) => {
        e.preventDefault()
        try {
            const method = isCreating ? 'POST' : 'PUT'
            const dataToSave = { ...editingPost }
            if (dataToSave.extras) {
                if (typeof dataToSave.extras.sizes === 'string') dataToSave.extras.sizes = dataToSave.extras.sizes.split(',').map(s => s.trim()).filter(Boolean)
                else if (Array.isArray(dataToSave.extras.sizes)) dataToSave.extras.sizes = dataToSave.extras.sizes.map(s => s.trim()).filter(Boolean)
                if (typeof dataToSave.extras.colors === 'string') dataToSave.extras.colors = dataToSave.extras.colors.split(',').map(c => c.trim()).filter(Boolean)
                else if (Array.isArray(dataToSave.extras.colors)) dataToSave.extras.colors = dataToSave.extras.colors.map(c => c.trim()).filter(Boolean)
            }
            if (dataToSave.price && typeof dataToSave.price === 'string') dataToSave.price = dataToSave.price.replace(/\./g, '')
            const endpoint = activeTab === 'products' ? '/api/products.php' : '/api/admin.php?action=posts'
            const r = await authFetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSave) })
            if (r.ok) {
                if (activeTab === 'products') {
                    const d = await r.json()
                    const saved = isCreating ? { ...editingPost, id: d.id } : editingPost
                    setProducts(isCreating ? [saved, ...products] : products.map(p => p.id === saved.id ? saved : p))
                } else {
                    setPosts(isCreating ? [...posts, editingPost] : posts.map(p => p.slug === editingPost.slug ? editingPost : p))
                }
                setEditingPost(null); setIsCreating(false)
            } else { alert((await r.json()).error || 'Failed to save item.') }
        } catch { alert('Error connecting to server.') }
    }

    const handleGenerateTrendPost = async (geo = 'ID') => {
        setLoading(true)
        try {
            const r = await fetch(`/api/auto_post_trends.php?key=nurdiansyah-cron-2026&geo=${geo}`)
            const d = await r.json()
            if (r.ok) {
                if (d.status === 'success') {
                    alert(`Success: Generated article for keyword '${d.keyword_found}'`)
                    const postsRes = await authFetch('/api/admin.php?action=posts')
                    if (postsRes.ok) setPosts((await postsRes.json()).posts || [])
                } else if (d.status === 'skipped') alert(d.message)
            } else alert(d.error || 'Failed to generate trend post.')
        } catch { alert('Error connecting to server.') }
        finally { setLoading(false) }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0]; if (!file) return
        setUploadingImage(true)
        const formData = new FormData(); formData.append('image', file)
        try {
            const r = await fetch('/api/upload_image.php', { method: 'POST', headers: { 'X-Admin-Token': token }, body: formData })
            const d = await r.json()
            if (r.ok && d.status === 'success') {
                const imgData = d.image_data || { url: d.url, alt: 'Uploaded Image', is_primary: true }
                setEditingPost(prev => ({ ...prev, images: [...(prev.images || []), imgData] }))
            } else alert(d.error || 'Failed to upload image')
        } catch { alert('Error connecting to upload server.') }
        finally { setUploadingImage(false) }
    }

    // ── Render: Login ──────────────────────────────────────────────────────────
    if (!isAuthed) return (
        <AdminLogin
            authView={authView} setAuthView={setAuthView}
            usernameInput={usernameInput} setUsernameInput={setUsernameInput}
            passwordInput={passwordInput} setPasswordInput={setPasswordInput}
            showPassword={showPassword} setShowPassword={setShowPassword}
            authError={authError} authMessage={authMessage}
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
            onResetPassword={handleResetPassword}
        />
    )

    // ── Render: Dashboard ──────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <AdminSidebar activeTab={activeTab} onLogout={handleLogout} onTabChange={handleTabChange} />

            <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '2rem', gap: '2rem' }}>
                {/* Sidebar nav is rendered inline by AdminSidebar, this placeholder keeps layout */}
                <div style={{ width: '250px', flexShrink: 0 }} />

                {/* Main Content */}
                <div style={{ flexGrow: 1, background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {loading && !editingPost && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                            <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={32} color="#3730a3" /></m.div>
                        </div>
                    )}

                    {!loading && activeTab === 'analytics' && <AdminAnalytics analyticsData={analyticsData} />}

                    {activeTab === 'posts' && (
                        <AdminPosts
                            posts={posts} loading={loading}
                            editingPost={editingPost} setEditingPost={setEditingPost}
                            isCreating={isCreating} setIsCreating={setIsCreating}
                            uploadingImage={uploadingImage}
                            onDeletePost={handleDeletePost}
                            onSavePost={handleSavePost}
                            onGenerateTrend={handleGenerateTrendPost}
                            onImageUpload={handleImageUpload}
                        />
                    )}

                    {!loading && activeTab === 'leads' && <AdminLeads leads={leads} onDeleteLead={handleDeleteLead} />}

                    {activeTab === 'products' && (
                        <AdminProducts
                            products={products} productApp={productApp} setProductApp={setProductApp} loading={loading}
                            editingPost={editingPost} setEditingPost={setEditingPost}
                            isCreating={isCreating} setIsCreating={setIsCreating}
                            uploadingImage={uploadingImage} token={token}
                            onDeleteProduct={handleDeleteProduct}
                            onSavePost={handleSavePost}
                            onSetUploadingImage={setUploadingImage}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
