import { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { Lock, FileText, Users, BarChart3, LogOut, Loader2, Plus, Trash2, Edit2, Save, X, Rss, Eye, EyeOff, Wrench, Laptop } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getOptimizedImg } from '../utils/imgHelper'

export default function AdminDashboard() {
    // Auth State
    const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '')
    const [isAuthed, setIsAuthed] = useState(!!token)

    // Auth UI View ('login', 'forgot', 'reset')
    const [authView, setAuthView] = useState('login')

    // Login Form State
    const [usernameInput, setUsernameInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState('')
    const [authMessage, setAuthMessage] = useState('')

    // Reset Flow State
    const [resetTokenParam, setResetTokenParam] = useState('')

    // Dashboard State
    const [activeTab, setActiveTab] = useState('analytics') // 'analytics' | 'posts' | 'leads' | 'products'
    const [posts, setPosts] = useState([])
    const [leads, setLeads] = useState([])
    const [products, setProducts] = useState([])
    const [productApp, setProductApp] = useState('toko-laptop-batam') // default app filter
    const [analyticsData, setAnalyticsData] = useState(null)
    const [loading, setLoading] = useState(false)

    // Form / Edit State
    const [editingPost, setEditingPost] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // Helper: unified fetch with Auth Header
    const authFetch = async (url, options = {}) => {
        const headers = { 'X-Admin-Token': token, ...options.headers }
        const res = await fetch(url, { ...options, headers })
        if (res.status === 401) {
            handleLogout()
            throw new Error('Unauthorized')
        }
        return res
    }

    // Detect Reset Token in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const resetParam = urlParams.get('reset')
        if (resetParam) {
            setResetTokenParam(resetParam)
            setAuthView('reset')
            // Don't auto-login if they are looking to reset
            setIsAuthed(false)
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setAuthError('')
        setAuthMessage('')
        try {
            const res = await fetch('/api/auth.php?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            })
            const data = await res.json()
            if (res.ok && data.status === 'success') {
                setToken(data.token)
                sessionStorage.setItem('adminToken', data.token)
                setIsAuthed(true)
                setAuthError('')
            } else {
                setAuthError(data.error || 'Invalid credentials')
            }
        } catch (err) {
            setAuthError('Server error')
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setAuthError('')
        setAuthMessage('')
        try {
            const res = await fetch('/api/auth.php?action=forgot_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: usernameInput })
            })
            const data = await res.json()
            if (res.ok) {
                setAuthMessage(data.message || 'Check your email for reset instructions.')
            } else {
                setAuthError(data.error || 'Failed to process request')
            }
        } catch (err) {
            setAuthError('Server error')
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setAuthError('')
        setAuthMessage('')
        try {
            const res = await fetch('/api/auth.php?action=reset_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetTokenParam, password: passwordInput })
            })
            const data = await res.json()
            if (res.ok) {
                setAuthMessage('Password reset successfully! You can now log in.')
                setTimeout(() => {
                    window.location.href = '/admin' // Strip URL params and go to normal login
                }, 2000)
            } else {
                setAuthError(data.error || 'Failed to reset password')
            }
        } catch (err) {
            setAuthError('Server error')
        }
    }

    const handleLogout = () => {
        setToken('')
        sessionStorage.removeItem('adminToken')
        setIsAuthed(false)
        setPosts([])
        setLeads([])
        setProducts([])
    }

    // Fetch Initial Data once Authed
    useEffect(() => {
        if (!isAuthed) return

        const loadData = async () => {
            setLoading(true)
            try {
                if (activeTab === 'posts') {
                    const res = await authFetch('/api/admin.php?action=posts')
                    if (res.ok) {
                        const data = await res.json()
                        setPosts(data.posts || [])
                    }
                } else if (activeTab === 'leads') {
                    const res = await authFetch('/api/admin.php?action=leads')
                    if (res.ok) {
                        const data = await res.json()
                        setLeads(data.leads || [])
                    }
                } else if (activeTab === 'analytics') {
                    const res = await authFetch('/api/analytics.php')
                    if (res.ok) {
                        const data = await res.json()
                        setAnalyticsData(data)
                    }
                } else if (activeTab === 'products') {
                    const res = await authFetch(`/api/products.php?app=${productApp}`)
                    if (res.ok) {
                        const data = await res.json()
                        setProducts(data.data || [])
                    }
                }
            } catch (err) {
                console.error("Failed to load data", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [isAuthed, activeTab, productApp])

    const handleDeletePost = async (slug) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return
        try {
            const res = await authFetch(`/api/admin.php?action=posts&slug=${slug}`, { method: 'DELETE' })
            if (res.ok) {
                setPosts(posts.filter(p => p.slug !== slug))
            }
        } catch (err) {
            alert('Failed to delete post.')
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return
        try {
            const res = await authFetch(`/api/products.php?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id))
            }
        } catch (err) {
            alert('Failed to delete product.')
        }
    }

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead message?")) return
        try {
            const res = await authFetch(`/api/admin.php?action=leads&id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setLeads(leads.filter(l => l.id !== id))
            } else {
                alert('Failed to delete lead on server.')
            }
        } catch (err) {
            alert('Failed to connect to server to delete lead.')
        }
    }

    const handleSavePost = async (e) => {
        e.preventDefault()
        try {
            const method = isCreating ? 'POST' : 'PUT'
            // Clean up variants/colors: handle both string (internal edit state) and array formats
            const dataToSave = { ...editingPost }
            if (dataToSave.extras) {
                // Sizes cleanup
                if (typeof dataToSave.extras.sizes === 'string') {
                    dataToSave.extras.sizes = dataToSave.extras.sizes.split(',').map(s => s.trim()).filter(Boolean)
                } else if (Array.isArray(dataToSave.extras.sizes)) {
                    dataToSave.extras.sizes = dataToSave.extras.sizes.map(s => s.trim()).filter(Boolean)
                }

                // Colors cleanup
                if (typeof dataToSave.extras.colors === 'string') {
                    dataToSave.extras.colors = dataToSave.extras.colors.split(',').map(c => c.trim()).filter(Boolean)
                } else if (Array.isArray(dataToSave.extras.colors)) {
                    dataToSave.extras.colors = dataToSave.extras.colors.map(c => c.trim()).filter(Boolean)
                }
            }

            // Clean up price: strip IDR separators (dots) before sending to DB
            if (dataToSave.price && typeof dataToSave.price === 'string') {
                dataToSave.price = dataToSave.price.replace(/\./g, '')
            }

            const endpoint = activeTab === 'products' ? '/api/products.php' : '/api/admin.php?action=posts'
            const res = await authFetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            })

            if (res.ok) {
                if (activeTab === 'products') {
                    const data = await res.json()
                    const savedProduct = isCreating ? { ...editingPost, id: data.id } : editingPost
                    if (isCreating) {
                        setProducts([savedProduct, ...products])
                    } else {
                        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p))
                    }
                } else {
                    if (isCreating) {
                        setPosts([...posts, editingPost])
                    } else {
                        setPosts(posts.map(p => p.slug === editingPost.slug ? editingPost : p))
                    }
                }

                setEditingPost(null)
                setIsCreating(false)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to save item.')
            }
        } catch (err) {
            alert('Error connecting to server.')
        }
    }

    const handleGenerateTrendPost = async (geo = 'ID') => {
        setLoading(true)
        try {
            const res = await fetch(`/api/auto_post_trends.php?key=nurdiansyah-cron-2026&geo=${geo}`)
            const data = await res.json()
            if (res.ok) {
                if (data.status === 'success') {
                    alert(`Success: Generated article for keyword '${data.keyword_found}'`)
                    // Refresh posts list
                    const postsRes = await authFetch('/api/admin.php?action=posts')
                    if (postsRes.ok) {
                        const postsData = await postsRes.json()
                        setPosts(postsData.posts || [])
                    }
                } else if (data.status === 'skipped') {
                    alert(data.message)
                }
            } else {
                alert(data.error || 'Failed to generate trend post.')
            }
        } catch (err) {
            alert('Error connecting to server.')
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const res = await fetch('/api/upload_image.php', {
                method: 'POST',
                headers: { 'X-Admin-Token': token },
                body: formData
            })
            const data = await res.json()
            if (res.ok && data.status === 'success') {
                const newImgData = data.image_data || { url: data.url, alt: 'Uploaded Image', is_primary: true }

                if (activeTab === 'posts') {
                    setEditingPost(prev => ({
                        ...prev,
                        images: [...(prev.images || []), newImgData]
                    }))
                } else {
                    // Products still use single image_url for now
                    setEditingPost(prev => ({ ...prev, image_url: data.url }))
                }
            } else {
                alert(data.error || 'Failed to upload image')
            }
        } catch (err) {
            alert('Error connecting to upload server.')
        } finally {
            setUploadingImage(false)
        }
    }

    // ── Login Render ───────────────────────────────────────────────────────────
    if (!isAuthed) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#4f46e5' }}>
                        <Lock size={48} />
                    </div>
                    <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>
                        {authView === 'login' ? 'Admin Login' : authView === 'forgot' ? 'Reset Password' : 'Set New Password'}
                    </h1>

                    {authView === 'login' && (
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input aria-label="Form input"
                                type="text"
                                placeholder="Username"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}
                                required
                            />
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <input aria-label="Form input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        style={{ padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}
                                        required
                                    />
                                    <div
                                        style={{ position: 'absolute', right: '10px', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setAuthView('forgot'); setAuthError(''); setAuthMessage('') }}>Forgot Password?</span>
                                </div>
                            </div>

                            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{authError}</div>}
                            <button aria-label="Action button" type="submit" style={{ background: '#4f46e5', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                                Sign In
                            </button>
                        </form>
                    )}

                    {authView === 'forgot' && (
                        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', marginBottom: '0.5rem' }}>Enter your username or email address and we will send you a link to reset your password.</p>
                            <input aria-label="Form input"
                                type="text"
                                placeholder="Username or Email"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}
                                required
                            />

                            {authMessage && <div style={{ color: '#10b981', fontSize: '0.85rem', background: '#d1fae5', padding: '0.5rem', borderRadius: '4px' }}>{authMessage}</div>}
                            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{authError}</div>}

                            <button aria-label="Action button" type="submit" style={{ background: '#4f46e5', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                                Send Reset Link
                            </button>
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }} onClick={() => { setAuthView('login'); setAuthError(''); setAuthMessage('') }}>&larr; Back to Login</span>
                            </div>
                        </form>
                    )}

                    {authView === 'reset' && (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', marginBottom: '0.5rem' }}>Please enter your new password below.</p>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input aria-label="Form input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    style={{ padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}
                                    required
                                />
                                <div
                                    style={{ position: 'absolute', right: '10px', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>

                            {authMessage && <div style={{ color: '#10b981', fontSize: '0.85rem', background: '#d1fae5', padding: '0.5rem', borderRadius: '4px' }}>{authMessage}</div>}
                            {authError && <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{authError}</div>}

                            <button aria-label="Action button" type="submit" style={{ background: '#4f46e5', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                                Save New Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    }

    // ── Dashboard Render ───────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Topbar */}
            <div style={{ background: '#0f172a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                    <div style={{ background: '#4f46e5', padding: '6px', borderRadius: '8px' }}>
                        <Lock size={18} color="#fff" />
                    </div>
                    NurdiansyahLabs Admin
                </div>
                <button aria-label="Action button" onClick={handleLogout} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '2rem', gap: '2rem' }}>
                {/* Sidebar */}
                <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <button aria-label="Action button"
                        onClick={() => { setActiveTab('analytics'); setEditingPost(null); setIsCreating(false) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === 'analytics' ? '#e0e7ff' : 'transparent', color: activeTab === 'analytics' ? '#4f46e5' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                    >
                        <BarChart3 size={20} /> Analytics
                    </button>
                    <button aria-label="Action button"
                        onClick={() => { setActiveTab('posts'); setEditingPost(null); setIsCreating(false) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === 'posts' ? '#e0e7ff' : 'transparent', color: activeTab === 'posts' ? '#4f46e5' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                    >
                        <FileText size={20} /> Blog Articles
                    </button>
                    <button aria-label="Action button"
                        onClick={() => { setActiveTab('leads'); setEditingPost(null); setIsCreating(false) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === 'leads' ? '#e0e7ff' : 'transparent', color: activeTab === 'leads' ? '#4f46e5' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                    >
                        <Users size={20} /> Leads Inbox
                    </button>
                    <button aria-label="Action button"
                        onClick={() => { setActiveTab('products'); setEditingPost(null); setIsCreating(false) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === 'products' ? '#e0e7ff' : 'transparent', color: activeTab === 'products' ? '#4f46e5' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                    >
                        <BarChart3 size={20} /> Products (CMS)
                    </button>
                </div>

                {/* Main Content Area */}
                <div style={{ flexGrow: 1, background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {loading && !editingPost && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                            <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={32} color="#4f46e5" /></m.div>
                        </div>
                    )}

                    {/* View: Editor Mode */}
                    {editingPost && activeTab !== 'products' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>{isCreating ? 'Write New Article' : 'Edit Article'}</h2>
                                <button aria-label="Action button" onClick={() => { setEditingPost(null); setIsCreating(false) }} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>URL Slug</label>
                                    <input aria-label="Form input" required disabled={!isCreating} type="text" value={editingPost.slug} onChange={e => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', background: !isCreating ? '#f1f5f9' : '#fff' }} placeholder="e.g. why-need-data-analyst" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Title</label>
                                    <input aria-label="Form input" required type="text" value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Description / Excerpt</label>
                                    <textarea aria-label="Text input" required value={editingPost.description} onChange={e => setEditingPost({ ...editingPost, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', minHeight: '80px', fontFamily: 'inherit' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Post Images (CDN Supported)</label>

                                    {/* Display Existing Images */}
                                    {editingPost.images && editingPost.images.length > 0 && (
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                            {editingPost.images.map((imgObj, idx) => (
                                                <div key={idx} style={{ position: 'relative' }}>
                                                    <img src={getOptimizedImg(imgObj.url, { w: 200, h: 200 })} alt={imgObj.alt || 'Preview'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                                    <button aria-label="Action button" type="button" onClick={() => {
                                                        setEditingPost(prev => ({
                                                            ...prev,
                                                            images: prev.images.filter((_, i) => i !== idx)
                                                        }))
                                                    }} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input aria-label="Form input" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ marginBottom: '8px' }} />
                                        {uploadingImage && <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'flex' }}><Loader2 size={14} /></m.div> Uploading to CDN...</span>}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Markdown Content</label>
                                    <textarea aria-label="Text input" required value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', minHeight: '300px', fontFamily: 'monospace' }} placeholder="Supports ## Headlines, - Lists, and **Bold** text." />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button aria-label="Action button" type="submit" style={{ background: '#22c55e', color: '#fff', padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Save size={18} /> Save Article
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* View: Product Editor Mode */}
                    {editingPost && activeTab === 'products' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>{isCreating ? 'Add New Product' : 'Edit Product'}</h2>
                                <button aria-label="Action button" onClick={() => { setEditingPost(null); setIsCreating(false) }} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Target App / Landing Page</label>
                                    <select aria-label="Select option" required value={editingPost.app_id} onChange={e => setEditingPost({ ...editingPost, app_id: e.target.value })} disabled={!isCreating} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                                        <option value="toko-laptop-batam">💻 Batam Laptop Center</option>
                                        <option value="batam-chicken-supplier">🐓 Batam Chicken Farm</option>
                                        <option value="batam-rental-mobil">🚗 Batam Rental Mobil</option>
                                        <option value="warung-makan">🍜 Alyuna Siomay</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Product Name</label>
                                    <input aria-label="Form input" required type="text" value={editingPost.name} onChange={e => setEditingPost({ ...editingPost, name: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} placeholder="Asus ROG Strix / Ayam Kampung" />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Price (IDR)</label>
                                        <input aria-label="Form input"
                                            required
                                            type="text"
                                            value={editingPost.price ? Number(editingPost.price.toString().replace(/\./g, '')).toLocaleString('id-ID') : ''}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, ''); // Allow only digits
                                                setEditingPost({ ...editingPost, price: val })
                                            }}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}
                                            placeholder="12.000.000"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Category / Tag</label>
                                        {editingPost.app_id === 'batam-rental-mobil' ? (
                                            <select aria-label="Select option" value={editingPost.category || ''} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                                                <option value="">-- Choose Category --</option>
                                                <option value="Lepas Kunci">Lepas Kunci (Self Drive)</option>
                                                <option value="Dengan Sopir">Dengan Sopir (With Driver)</option>
                                            </select>
                                        ) : editingPost.app_id === 'warung-makan' ? (
                                            <select aria-label="Select option" value={editingPost.category || ''} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                                                <option value="">-- Pilih Kategori --</option>
                                                <option value="Siomay">Siomay (Satuan)</option>
                                                <option value="Paket Spesial">Paket Spesial (Berbagai Isi)</option>
                                                <option value="Kue Kering">Kue Kering / Nastar</option>
                                            </select>
                                        ) : editingPost.app_id === 'toko-laptop-batam' ? (
                                            <select aria-label="Select option" value={editingPost.category || ''} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                                                <option value="">-- Pilih Kategori --</option>
                                                <option value="Laptops">Laptops / MacBooks</option>
                                                <option value="Gadgets">Gadgets / Smartphones</option>
                                                <option value="Monitors">Monitors / Peripherals</option>
                                            </select>
                                        ) : editingPost.app_id === 'batam-chicken-supplier' ? (
                                            <select aria-label="Select option" value={editingPost.category || ''} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                                                <option value="">-- Pilih Label --</option>
                                                <option value="Best Seller">Best Seller</option>
                                                <option value="Favorit Restoran">Favorit Restoran</option>
                                                <option value="Ekonomis">Ekonomis</option>
                                                <option value="Fresh">Fresh Potong Suhu Ruang</option>
                                                <option value="Frozen">Frozen / Beku</option>
                                            </select>
                                        ) : (
                                            <input aria-label="Form input" type="text" value={editingPost.category || ''} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} placeholder="Ketik Kategori / Tag..." />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Description</label>
                                    <textarea aria-label="Text input" required value={editingPost.description} onChange={e => setEditingPost({ ...editingPost, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', minHeight: '80px', fontFamily: 'inherit' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>Product Image</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {editingPost.image_url && (
                                            <img src={getOptimizedImg(editingPost.image_url, { w: 200, h: 200 })} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                        )}
                                        <div style={{ flexGrow: 1 }}>
                                            <input aria-label="Form input" type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0]; if (!file) return;
                                                setUploadingImage(true);
                                                const formData = new FormData(); formData.append('image', file);
                                                fetch('/api/upload_image.php', { method: 'POST', headers: { 'X-Admin-Token': token }, body: formData })
                                                    .then(r => r.json()).then(d => {
                                                        if (d.status === 'success') setEditingPost(p => ({ ...p, image_url: d.url }));
                                                        else alert('Upload failed');
                                                    }).finally(() => setUploadingImage(false));
                                            }} disabled={uploadingImage} style={{ marginBottom: '8px' }} />
                                            {uploadingImage && <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Uploading...</span>}
                                            <input aria-label="Form input" type="text" value={editingPost.image_url || ''} readOnly style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.85rem', color: '#94a3b8' }} placeholder="No image uploaded..." />
                                        </div>
                                    </div>
                                </div>

                                {editingPost.app_id === 'batam-rental-mobil' && (
                                    <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                                        <h3 style={{ fontSize: '1rem', margin: '0 0 1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Wrench size={18} /> Car Specification Details
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1, minWidth: '120px' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Seats</label>
                                                <input aria-label="Form input" type="number" value={editingPost.extras?.seats || 5} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, seats: parseInt(e.target.value) } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: '120px' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Transmission</label>
                                                <select aria-label="Select option" value={editingPost.extras?.trans || 'Matic'} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, trans: e.target.value } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                    <option value="Matic">Matic</option>
                                                    <option value="Manual">Manual</option>
                                                </select>
                                            </div>
                                            <div style={{ flex: 1, minWidth: '120px' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Luggage (Bags)</label>
                                                <input aria-label="Form input" type="number" value={editingPost.extras?.luggage || 2} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, luggage: parseInt(e.target.value) } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editingPost.app_id === 'toko-laptop-batam' && (
                                    <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                        <h3 style={{ fontSize: '1rem', margin: '0 0 1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Laptop size={18} /> Device Configurations
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ flex: 1, minWidth: '120px' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Variants / Sizes (Comma separated)</label>
                                                <input aria-label="Form input" type="text" value={Array.isArray(editingPost.extras?.sizes) ? editingPost.extras.sizes.join(', ') : (editingPost.extras?.sizes || '')} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, sizes: e.target.value } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="256GB, 512GB, 1TB" />
                                            </div>
                                            <div style={{ flex: 1, minWidth: '120px' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Colors (Comma separated)</label>
                                                <input aria-label="Form input" type="text" value={Array.isArray(editingPost.extras?.colors) ? editingPost.extras.colors.join(', ') : (editingPost.extras?.colors || '')} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, colors: e.target.value } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Space Black, Silver" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button aria-label="Action button" type="submit" style={{ background: '#22c55e', color: '#fff', padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Save size={18} /> Save Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* View: Blog Posts List */}
                    {!loading && !editingPost && activeTab === 'posts' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h2 style={{ margin: 0, color: '#0f172a' }}>Live Articles ({posts.length})</h2>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button aria-label="Action button" onClick={() => handleGenerateTrendPost('ID')} disabled={loading} style={{ background: '#059669', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}>
                                            <Rss size={16} /> Auto-Gen ID (Indo)
                                        </button>
                                        <button aria-label="Action button" onClick={() => handleGenerateTrendPost('US')} disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}>
                                            <Rss size={16} /> Auto-Gen US (Eng)
                                        </button>
                                        <button aria-label="Action button" onClick={() => handleGenerateTrendPost('JP')} disabled={loading} style={{ background: '#db2777', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}>
                                            <Rss size={16} /> Auto-Gen JP (Jap)
                                        </button>
                                    </div>
                                    <button aria-label="Action button" onClick={() => { setIsCreating(true); setEditingPost({ slug: '', title: '', description: '', content: '', serviceLabel: 'Update', accent: '#4f46e5', accentLight: '#eef2ff', images: [] }) }} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Plus size={16} /> New Article
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {posts.map(post => (
                                    <div key={post.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{post.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>/blog/{post.slug}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button aria-label="Action button" onClick={() => { setIsCreating(false); setEditingPost(post) }} style={{ background: '#f1f5f9', color: '#3b82f6', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                            <button aria-label="Action button" onClick={() => handleDeletePost(post.slug)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View: Products CMS List */}
                    {!loading && !editingPost && activeTab === 'products' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h2 style={{ margin: 0, color: '#0f172a' }}>Manage Products</h2>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <select aria-label="Select option" value={productApp} onChange={e => setProductApp(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                                        <option value="toko-laptop-batam">💻 Batam Laptop Center</option>
                                        <option value="batam-chicken-supplier">🐓 Batam Chicken Farm</option>
                                        <option value="batam-rental-mobil">🚗 Batam Rental Mobil</option>
                                        <option value="warung-makan">🍜 Alyuna Siomay</option>
                                    </select>

                                    <button aria-label="Action button" onClick={() => { setIsCreating(true); setEditingPost({ app_id: productApp, name: '', price: '', description: '', image_url: '', category: '', extras: {} }) }} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Plus size={16} /> Add Product
                                    </button>
                                </div>
                            </div>

                            {products.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛍️</div>
                                    <div style={{ fontWeight: 600 }}>No products found for this application.</div>
                                    <div style={{ fontSize: '0.9rem' }}>Click "Add Product" to create your first item.</div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {products.map(product => (
                                        <div key={product.id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                            <div style={{ height: '160px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {product.image_url ? (
                                                    <img src={getOptimizedImg(product.image_url, { w: 400, h: 300 })} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                        <img
                                                            src={
                                                                product.app_id === 'toko-laptop-batam' ? 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&fit=crop' :
                                                                    product.app_id === 'batam-chicken-supplier' ? 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&fit=crop' :
                                                                        product.app_id === 'batam-rental-mobil' ? 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&fit=crop' :
                                                                            'https://images.unsplash.com/photo-1563379926898-05f4425af30e?w=400&fit=crop'
                                                            }
                                                            alt="Fallback"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
                                                        />
                                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(248, 250, 252, 0.7)', color: '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>Default Image</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, flex: 1 }}>{product.name}</h3>
                                                    <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{product.category || 'General'}</span>
                                                </div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', marginBottom: '1rem' }}>
                                                    Rp {Number(product.price).toLocaleString('id-ID')}
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', flex: 1 }}>
                                                    {product.description?.substring(0, 80)}...
                                                </p>
                                                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                                    <button aria-label="Action button" onClick={() => { setIsCreating(false); setEditingPost(product) }} style={{ flex: 1, background: '#f1f5f9', color: '#3b82f6', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Edit2 size={16} /> Edit</button>
                                                    <button aria-label="Action button" onClick={() => handleDeleteProduct(product.id)} style={{ flex: 1, background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Trash2 size={16} /> Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* View: Leads Inbox */}
                    {!loading && !editingPost && activeTab === 'leads' && (
                        <div>
                            <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a' }}>Incoming Inquiries ({leads.length})</h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem', color: '#475569' }}>Date</th>
                                            <th style={{ padding: '1rem', color: '#475569' }}>Name</th>
                                            <th style={{ padding: '1rem', color: '#475569' }}>Contact</th>
                                            <th style={{ padding: '1rem', color: '#475569' }}>Service</th>
                                            <th style={{ padding: '1rem', color: '#475569' }}>Message</th>
                                            <th style={{ padding: '1rem', color: '#475569', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...leads].reverse().map((lead, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '1rem', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(lead.timestamp).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{lead.name}</td>
                                                <td style={{ padding: '1rem', color: '#4f46e5' }}>{lead.contact}</td>
                                                <td style={{ padding: '1rem' }}><span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#475569' }}>{lead.service}</span></td>
                                                <td style={{ padding: '1rem', color: '#475569', minWidth: '300px' }}>{lead.message}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <button aria-label="Action button" onClick={() => handleDeleteLead(lead.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title="Delete Lead">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* View: Analytics Dashboard */}
                    {!loading && activeTab === 'analytics' && analyticsData && (
                        <div>
                            <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a' }}>Website Traffic & Engagement</h2>

                            {/* KPI Scorecards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Pageviews</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{analyticsData.kpis.totalViews}</div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Unique Visitors</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4f46e5' }}>{analyticsData.kpis.uniqueVisitors}</div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Events Logged</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>{analyticsData.kpis.totalEventsLogged}</div>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                                {/* Timeline Chart */}
                                <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Traffic Timeline</h3>
                                    <div style={{ height: '300px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={analyticsData.timelineChart}>
                                                <defs>
                                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Area type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    {/* Top Paths Bar Chart */}
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Most Visited Pages</h3>
                                        <div style={{ height: '250px', width: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analyticsData.topPathsChart} layout="vertical" margin={{ left: 50, right: 20 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                    <Bar dataKey="views" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={24} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Top Showcase Interactions */}
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a' }}>Top Portfolio Interactions</h3>
                                        <div style={{ height: '250px', width: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analyticsData.projectsChart} layout="vertical" margin={{ left: 50, right: 20 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                    <Bar dataKey="clicks" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}
