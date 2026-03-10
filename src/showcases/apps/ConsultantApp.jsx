import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const FALLBACK_PRODUCTS = [
    { id: 1, name: 'Ayam Kampung Asli', price: 75000, desc: 'Daging kenyal dengan kaldu yang sangat gurih. Bebas suntik hormon dan diternak lepas liar (free-range). Sangat cocok untuk soto, sup, dan masakan tradisional.', img: '/assets/Ayam_Kampung.jpeg', tag: 'Best Seller' },
    { id: 2, name: 'Ayam KUB (Kampung Unggul)', price: 85000, desc: 'Ayam Kampung Unggul Balitbangtan. Memiliki cita rasa daging yang mirip ayam kampung asli namun dengan bobot yang lebih besar dan daging lebih empuk.', img: '/assets/Ayam_Kampung_KUB_1,2Kg.jpeg', tag: 'Favorit Restoran' },
    { id: 3, name: 'Ayam Kampung Super', price: 80000, desc: 'Persilangan ayam bangkok dan petelur. Dagingnya tebal, empuk, dan cepat matang. Pilihan paling ekonomis untuk warung makan dan katering di Batam.', img: '/assets/Ayam_Kampung_Super_1,2Kg.jpeg', tag: 'Ekonomis' },
]
const BRAND = {
    primary: '#16a34a',     // Green Farm
    primaryHover: '#15803d',
    accent: '#facc15',      // Yellow Beak/Sun
    darkText: '#1f2937',
    lightBg: '#f0fdf4'      // Light Green Bg
}
const fmt = n => n.toLocaleString('id-ID')
export default function ConsultantApp() { // Retained name for routing compatibility
    const navigate = useNavigate()
    // CMS Fetching logic
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch('/api/products.php?app=batam-chicken-supplier')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data && data.data.length > 0) {
                    const formattedProducts = data.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: parseFloat(p.price),
                        desc: p.description,
                        img: p.image_url || '/assets/Ayam_Kampung.jpeg',
                        tag: p.category || 'Tersedia'
                    }))
                    setProducts(formattedProducts)
                } else {
                    setProducts(FALLBACK_PRODUCTS)
                }
            })
            .catch(() => setProducts(FALLBACK_PRODUCTS))
            .finally(() => setLoading(false))
    }, [])
    const orderViaWA = (item) => {
        const text = `Halo Peternakan Ayam Batam, saya ingin memesan ${item.name} dengan harga Rp ${fmt(item.price)}/Kg. Minta info stok dan pengiriman ke alamat saya di Batam.`
        window.open(`https://wa.me/6282268404765?text=${encodeURIComponent(text)}`, '_blank')
    }
    const orderCustom = () => {
        const text = `Halo Peternakan Ayam Batam, saya butuh suplai ayam dalam partai besar untuk restoran/katering saya. Bisa minta daftar harga grosir?`
        window.open(`https://wa.me/6282268404765?text=${encodeURIComponent(text)}`, '_blank')
    }
    return (
        <div style={{ fontFamily: '"Inter",sans-serif', minHeight: '100vh', background: '#fff', color: BRAND.darkText }}>
            {/* Navbar */}
            <nav style={{ padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '2rem' }}>🐓</div>
                    <div style={{ fontWeight: 900, fontSize: '1.2rem', color: BRAND.primary, letterSpacing: '-0.5px' }}>Batam Chicken Farm</div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    {['Home', 'Produk', 'Keunggulan', 'Lokasi'].map(item => (
                        <span key={item} onClick={() => {
                            const id = item === 'Produk' ? 'produk' : item === 'Keunggulan' ? 'keunggulan' : item === 'Lokasi' ? 'lokasi' : null
                            if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                            else if (item === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' })
                        }} style={{ cursor: 'pointer', color: '#4b5563' }} onMouseEnter={e => e.currentTarget.style.color = BRAND.primary} onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>{item}</span>
                    ))}
                    <button onClick={orderCustom} style={{ background: BRAND.primary, border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, boxShadow: '0 4px 10px rgba(22, 163, 74, 0.3)' }}>Order Partai Besar</button>
                </div>
            </nav>
            {/* Hero */}
            <div style={{ background: BRAND.lightBg, padding: '6rem 3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', position: 'relative', zIndex: 10 }}>
                    <div style={{ flex: 1.2 }}>
                        <div style={{ display: 'inline-block', background: '#dcfce7', color: BRAND.primaryHover, padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '0.5px' }}>🌿 AYAM SEHAT TANPA SUNTIKAN</div>
                        <h1 style={{ fontSize: '3.8rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: '#111827' }}>
                            Supplier Ayam Kampung Pusat Kota Batam
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '550px' }}>
                            Tersedia ayam <strong>Kampung Asli, Ayam KUB, dan Jowo Super (Joper)</strong>. Daging segar, potong harian, halal, dan siap diantar ke rumah sakit, catering, restoran, maupun rumah tangga di seluruh Batam.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button onClick={() => document.getElementById('produk').scrollIntoView({ behavior: 'smooth' })} style={{ background: BRAND.primary, color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>Lihat Harga Ayam</button>
                            <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>Gratis Ongkir* Batam Center</span>
                        </div>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '-10%', background: BRAND.accent, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, zIndex: 0 }}></div>
                        <img src="https://images.unsplash.com/photo-1548345680-f5475ea902f4?w=800&fit=crop" alt="Ayam Kampung Batam" style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '30px', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} />
                        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: '#fff', padding: '1.5rem', borderRadius: '20px', zIndex: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '50px', height: '50px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🏅</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#111827' }}>100% Halal</div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Disembelih syar'i</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Keunggulan */}
            <div id="keunggulan" style={{ padding: '6rem 3rem', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem', color: '#111827' }}>Kenapa Mengambil Ayam dari Kami?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: '🚀', title: 'Kiriman Cepat (Khusus Batam)', desc: 'Karena kandang dan pemotongan berlokasi di Batam, daging ayam dijamin fresh and tiba di dapur Anda kurang dari 3 jam setelah potong.' },
                            { icon: '🍃', title: 'Bebas Obat & Hormon', desc: 'Ayam kampung kami dipelihara secara alami dengan pakan jagung, dedak, dan rempah-rempah herbal tanpa suntikan antibiotik berbaya.' },
                            { icon: '🤝', title: 'Harga Peternak Langsung', desc: 'Kami bukan calo. Anda mendapatkan harga tangan pertama langsung dari peternakan kami sehingga cost bisnis restoran Anda lebih efisien.' },
                            { icon: '🔪', title: 'Siap Potong & Bersih', desc: 'Sedia ayam dalam keadaan hidup ataupun sudah dipotong, dicabut bulu, dibersihkan ususnya, dan dipotong beberapa bagian sesuai selera.' }
                        ].map((item, i) => (
                            <div key={i} style={{ background: '#f9fafb', padding: '2.5rem 2rem', border: '1px solid #e5e7eb', borderRadius: '24px', textAlign: 'left', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: '#111827' }}>{item.title}</h3>
                                <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Produk */}
            <div id="produk" style={{ background: '#f8fafc', padding: '6rem 3rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#111827', marginBottom: '1rem' }}>Jenis Ayam Kami</h2>
                        <p style={{ color: '#4b5563', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Pilih jenis ayam yang paling sesuai dengan kebutuhan dapur Anda. Kami menjamin kualitas daging terbaik.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {products.map(item => (
                            <div key={item.id} style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: BRAND.accent, color: '#111827', padding: '6px 14px', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>{item.tag}</div>
                                </div>
                                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>{item.name}</h3>
                                    <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>{item.desc}</p>
                                    <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>Harga per Kg</div>
                                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: BRAND.primary }}>Rp {fmt(item.price)}</div>
                                        </div>
                                        <button onClick={() => orderViaWA(item)} style={{ background: 'transparent', border: `2px solid ${BRAND.primary}`, color: BRAND.primaryHover, padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = BRAND.primary; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = BRAND.primaryHover }}>
                                            Pesan WA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Lokasi Map */}
            <div id="lokasi" style={{ padding: '6rem 3rem', background: '#fff', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', marginBottom: '1rem' }}>Kunjungi Peternakan Kami</h2>
                <p style={{ color: '#4b5563', fontSize: '1.2rem', marginBottom: '3rem' }}>Kawasan Nongsa / Barelang, Batam, Kepulauan Riau (Buka 07:00 - 17:00)</p>
                <div style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', height: '450px', border: '5px solid #f0fdf4' }}>
                    {/* Menggunakan Barelang Bridge sbg center reference umum batam untuk peternakan */}
                    <iframe
                        title="Batam Chicken Farm Location"
                        src="https://maps.google.com/maps?q=barelang+batam&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
            {/* CTA Tambahan */}
            <div style={{ background: '#111827', padding: '5rem 3rem', textAlign: 'center', margin: '0 2rem 2rem', borderRadius: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem' }}>Butuh Pasokan Rutin untuk Usaha Kuliner Anda?</h2>
                <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>Dapatkan penawaran harga khusus partai besar untuk restoran, katering, warung makan, dan rumah makan padang se-Batam.</p>
                <button onClick={orderCustom} style={{ background: BRAND.accent, color: '#111827', border: 'none', padding: '16px 40px', borderRadius: '30px', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(250, 204, 21, 0.2)' }}>Hubungi Supplier Sekarang</button>
            </div>
            {/* Footer */}
            <div style={{ background: '#fff', color: '#6b7280', textAlign: 'center', padding: '2rem', fontSize: '0.9rem', borderTop: '1px solid #e5e7eb' }}>
                <p>&copy; {new Date().getFullYear()} Batam Chicken Farm. Supplier Ayam Kampung Terbaik di Kepulauan Riau.</p>
            </div>
        </div>
    )
}
