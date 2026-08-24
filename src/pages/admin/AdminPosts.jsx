import { m } from 'framer-motion'
import { Rss, Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react'
import { getOptimizedImg } from '../../utils/imgHelper'

export default function AdminPosts({
    posts, loading,
    editingPost, setEditingPost,
    isCreating, setIsCreating,
    uploadingImage,
    onDeletePost, onSavePost, onGenerateTrend, onImageUpload,
}) {
    // ── Editor View ────────────────────────────────────────────────────────────
    if (editingPost) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{isCreating ? 'Write New Article' : 'Edit Article'}</h2>
                    <button aria-label="Close editor" onClick={() => { setEditingPost(null); setIsCreating(false) }} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={onSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>URL Slug</label>
                        <input aria-label="URL Slug" required disabled={!isCreating} type="text" value={editingPost.slug} onChange={e => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', background: !isCreating ? '#f1f5f9' : '#fff' }} placeholder="e.g. why-need-data-analyst" />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Title</label>
                        <input aria-label="Title" required type="text" value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Description / Excerpt</label>
                        <textarea aria-label="Description" required value={editingPost.description} onChange={e => setEditingPost({ ...editingPost, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', minHeight: '80px', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Post Images (CDN Supported)</label>
                        {editingPost.images && editingPost.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                {editingPost.images.map((imgObj, idx) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        <img src={getOptimizedImg(imgObj.url, { w: 200, h: 200 })} alt={imgObj.alt || 'Preview'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                        <button aria-label="Remove image" type="button" onClick={() => setEditingPost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input aria-label="Upload image" type="file" accept="image/*" onChange={onImageUpload} disabled={uploadingImage} style={{ marginBottom: '8px' }} />
                            {uploadingImage && <span style={{ fontSize: '0.85rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'flex' }}><Loader2 size={14} /></m.div> Uploading to CDN...</span>}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Markdown Content</label>
                        <textarea aria-label="Content" required value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', minHeight: '300px', fontFamily: 'monospace' }} placeholder="Supports ## Headlines, - Lists, and **Bold** text." />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button aria-label="Save Article" type="submit" style={{ background: '#166534', color: '#fff', padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> Save Article
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    // ── List View ──────────────────────────────────────────────────────────────
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0, color: '#0f172a' }}>Live Articles ({posts.length})</h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button aria-label="Auto-Generate Indonesian post" onClick={() => onGenerateTrend('ID')} disabled={loading} style={{ background: '#065f46', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}><Rss size={16} /> Auto-Gen ID (Indo)</button>
                        <button aria-label="Auto-Generate US post" onClick={() => onGenerateTrend('US')} disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}><Rss size={16} /> Auto-Gen US (Eng)</button>
                        <button aria-label="Auto-Generate Japan post" onClick={() => onGenerateTrend('JP')} disabled={loading} style={{ background: '#db2777', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 }}><Rss size={16} /> Auto-Gen JP (Jap)</button>
                    </div>
                    <button aria-label="New Article" onClick={() => { setIsCreating(true); setEditingPost({ slug: '', title: '', description: '', content: '', serviceLabel: 'Update', accent: '#3730a3', accentLight: '#eef2ff', images: [] }) }} style={{ background: '#3730a3', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> New Article</button>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {posts.map(post => (
                    <div key={post.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{post.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>/blog/{post.slug}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button aria-label="Edit post" onClick={() => { setIsCreating(false); setEditingPost(post) }} style={{ background: '#f1f5f9', color: '#1d4ed8', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Edit2 size={16} /></button>
                            <button aria-label="Delete post" onClick={() => onDeletePost(post.slug)} style={{ background: '#fef2f2', color: '#b91c1c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
