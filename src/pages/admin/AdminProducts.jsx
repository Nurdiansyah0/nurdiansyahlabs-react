import { Plus, Edit2, Trash2, Save, X, Loader2, Wrench, Laptop } from 'lucide-react'
import { getOptimizedImg } from '../../utils/imgHelper'

const APP_OPTIONS = [
    { value: 'toko-laptop-batam', label: '\uD83D\uDCBB Batam Laptop Center' },
    { value: 'batam-chicken-supplier', label: '\uD83D\uDC13 Batam Chicken Farm' },
    { value: 'batam-rental-mobil', label: '\uD83D\uDE97 Batam Rental Mobil' },
    { value: 'warung-makan', label: '\uD83C\uDF5C Alyuna Siomay' },
]

const FALLBACK_IMAGES = {
    'toko-laptop-batam': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&fit=crop',
    'batam-chicken-supplier': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&fit=crop',
    'batam-rental-mobil': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&fit=crop',
    'warung-makan': 'https://images.unsplash.com/photo-1563379926898-05f4425af30e?w=400&fit=crop',
}

function CategorySelect({ appId, value, onChange }) {
    const style = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }
    if (appId === 'batam-rental-mobil') return (
        <select aria-label="Category" value={value || ''} onChange={onChange} style={style}>
            <option value="">-- Choose Category --</option>
            <option value="Lepas Kunci">Lepas Kunci (Self Drive)</option>
            <option value="Dengan Sopir">Dengan Sopir (With Driver)</option>
        </select>
    )
    if (appId === 'warung-makan') return (
        <select aria-label="Category" value={value || ''} onChange={onChange} style={style}>
            <option value="">-- Pilih Kategori --</option>
            <option value="Siomay">Siomay (Satuan)</option>
            <option value="Paket Spesial">Paket Spesial (Berbagai Isi)</option>
            <option value="Kue Kering">Kue Kering / Nastar</option>
        </select>
    )
    if (appId === 'toko-laptop-batam') return (
        <select aria-label="Category" value={value || ''} onChange={onChange} style={style}>
            <option value="">-- Pilih Kategori --</option>
            <option value="Laptops">Laptops / MacBooks</option>
            <option value="Gadgets">Gadgets / Smartphones</option>
            <option value="Monitors">Monitors / Peripherals</option>
        </select>
    )
    if (appId === 'batam-chicken-supplier') return (
        <select aria-label="Category" value={value || ''} onChange={onChange} style={style}>
            <option value="">-- Pilih Label --</option>
            <option value="Best Seller">Best Seller</option>
            <option value="Favorit Restoran">Favorit Restoran</option>
            <option value="Ekonomis">Ekonomis</option>
            <option value="Fresh">Fresh Potong Suhu Ruang</option>
            <option value="Frozen">Frozen / Beku</option>
        </select>
    )
    return <input aria-label="Category" type="text" value={value || ''} onChange={onChange} style={style} placeholder="Ketik Kategori / Tag..." />
}

export default function AdminProducts({
    products, productApp, setProductApp, loading,
    editingPost, setEditingPost,
    isCreating, setIsCreating,
    uploadingImage, token,
    onDeleteProduct, onSavePost,
    onSetUploadingImage,
}) {
    const handleInlineImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        onSetUploadingImage(true)
        const formData = new FormData()
        formData.append('image', file)
        fetch('/api/v1/media/upload', { method: 'POST', headers: { 'X-Admin-Token': token }, body: formData })
            .then(r => r.json())
            .then(d => {
                if (d.status === 'success') setEditingPost(p => ({ ...p, image_url: d.url }))
                else alert('Upload failed')
            })
            .finally(() => onSetUploadingImage(false))
    }

    // ── Product Editor View ────────────────────────────────────────────────────
    if (editingPost) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{isCreating ? 'Add New Product' : 'Edit Product'}</h2>
                    <button aria-label="Close editor" onClick={() => { setEditingPost(null); setIsCreating(false) }} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={onSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Target App / Landing Page</label>
                        <select aria-label="App" required value={editingPost.app_id} onChange={e => setEditingPost({ ...editingPost, app_id: e.target.value })} disabled={!isCreating} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                            {APP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Product Name</label>
                        <input aria-label="Product Name" required type="text" value={editingPost.name} onChange={e => setEditingPost({ ...editingPost, name: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} placeholder="Asus ROG Strix / Ayam Kampung" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Price (IDR)</label>
                            <input aria-label="Price" required type="text" value={editingPost.price ? Number(editingPost.price.toString().replace(/\./g, '')).toLocaleString('id-ID') : ''} onChange={e => { const val = e.target.value.replace(/\D/g, ''); setEditingPost({ ...editingPost, price: val }) }} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} placeholder="12.000.000" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Category / Tag</label>
                            <CategorySelect appId={editingPost.app_id} value={editingPost.category} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Description</label>
                        <textarea aria-label="Description" required value={editingPost.description} onChange={e => setEditingPost({ ...editingPost, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', minHeight: '80px', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#1e293b' }}>Product Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {editingPost.image_url && <img src={getOptimizedImg(editingPost.image_url, { w: 200, h: 200 })} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />}
                            <div style={{ flexGrow: 1 }}>
                                <input aria-label="Upload product image" type="file" accept="image/*" onChange={handleInlineImageUpload} disabled={uploadingImage} style={{ marginBottom: '8px' }} />
                                {uploadingImage && <span style={{ fontSize: '0.85rem', color: '#1e293b' }}>Uploading...</span>}
                                <input aria-label="Image URL" type="text" value={editingPost.image_url || ''} readOnly style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.85rem', color: '#1e293b' }} placeholder="No image uploaded..." />
                            </div>
                        </div>
                    </div>

                    {editingPost.app_id === 'batam-rental-mobil' && (
                        <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                            <h3 style={{ fontSize: '1rem', margin: '0 0 1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}><Wrench size={18} /> Car Specification Details</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Seats</label>
                                    <input aria-label="Seats" type="number" value={editingPost.extras?.seats || 5} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, seats: parseInt(e.target.value) } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: '120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Transmission</label>
                                    <select aria-label="Transmission" value={editingPost.extras?.trans || 'Matic'} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, trans: e.target.value } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <option value="Matic">Matic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: '120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Luggage (Bags)</label>
                                    <input aria-label="Luggage" type="number" value={editingPost.extras?.luggage || 2} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, luggage: parseInt(e.target.value) } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {editingPost.app_id === 'toko-laptop-batam' && (
                        <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                            <h3 style={{ fontSize: '1rem', margin: '0 0 1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}><Laptop size={18} /> Device Configurations</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Variants / Sizes (Comma separated)</label>
                                    <input aria-label="Variants" type="text" value={Array.isArray(editingPost.extras?.sizes) ? editingPost.extras.sizes.join(', ') : (editingPost.extras?.sizes || '')} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, sizes: e.target.value } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="256GB, 512GB, 1TB" />
                                </div>
                                <div style={{ flex: 1, minWidth: '120px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Colors (Comma separated)</label>
                                    <input aria-label="Colors" type="text" value={Array.isArray(editingPost.extras?.colors) ? editingPost.extras.colors.join(', ') : (editingPost.extras?.colors || '')} onChange={e => setEditingPost({ ...editingPost, extras: { ...editingPost.extras, colors: e.target.value } })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Space Black, Silver" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button aria-label="Save Product" type="submit" style={{ background: '#166534', color: '#fff', padding: '0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={18} /> Save Product</button>
                    </div>
                </form>
            </div>
        )
    }

    // ── Product List View ──────────────────────────────────────────────────────
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0, color: '#0f172a' }}>Manage Products</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select aria-label="Filter by app" value={productApp} onChange={e => setProductApp(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                        {APP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button aria-label="Add Product" onClick={() => { setIsCreating(true); setEditingPost({ app_id: productApp, name: '', price: '', description: '', image_url: '', category: '', extras: {} }) }} style={{ background: '#3730a3', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> Add Product</button>
                </div>
            </div>
            {products.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#1e293b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>&#128717;</div>
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
                                        <img src={FALLBACK_IMAGES[product.app_id] || FALLBACK_IMAGES['warung-makan']} alt="Fallback" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(248, 250, 252, 0.7)', color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>Default Image</div>
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, flex: 1 }}>{product.name}</h3>
                                    <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{product.category || 'General'}</span>
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', marginBottom: '1rem' }}>Rp {Number(product.price).toLocaleString('id-ID')}</div>
                                <p style={{ fontSize: '0.85rem', color: '#1e293b', marginBottom: '1.5rem', flex: 1 }}>{product.description?.substring(0, 80)}...</p>
                                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                    <button aria-label="Edit product" onClick={() => { setIsCreating(false); setEditingPost(product) }} style={{ flex: 1, background: '#f1f5f9', color: '#1d4ed8', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Edit2 size={16} /> Edit</button>
                                    <button aria-label="Delete product" onClick={() => onDeleteProduct(product.id)} style={{ flex: 1, background: '#fef2f2', color: '#b91c1c', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Trash2 size={16} /> Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
