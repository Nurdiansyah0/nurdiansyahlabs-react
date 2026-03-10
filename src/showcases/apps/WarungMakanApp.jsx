import { useState, useEffect } from 'react'
import { getOptimizedImg } from '../../utils/imgHelper'
const FALLBACK_MENU = [
    { id: 1, name: 'Siomay Campur Biasa', price: 15000, cat: 'Siomay', img: '/assets/Siomay_01.jpg', desc: 'Siomay ikan tenggiri asli dengan siraman bumbu kacang gurih manis.' },
    { id: 2, name: 'Siomay Paket Komplit', price: 25000, cat: 'Paket Spesial', img: '/assets/Siomay_All_Paket.jpeg', desc: 'Isian lengkap: Siomay, Tahu, Telur, Kentang, Kol, dan Pare.' },
    { id: 3, name: 'Siomay Porsi Besar (Ekstra Bumbu)', price: 30000, cat: 'Paket Spesial', img: '/assets/Siomay_pkt.jpeg', desc: 'Porsi kenyang dengan ekstra siraman bumbu kacang kental yang medok mantap.' },
    { id: 4, name: 'Nastar Wisman Toples', price: 95000, cat: 'Kue Kering', img: '/assets/Nastar.jpeg', desc: 'Nastar premium renyah lumer di mulut dengan isian selai nanas asli dan butter Wisman.' },
]
const BRAND = {
    primary: '#f9a826',      // Golden yellow (like Nastar & Siomay highlights)
    primaryHover: '#f59e0b', // Slightly darker yellow for hover states 
    accent: '#f5cd4f',       // Light yellow compliment
    darkBg: '#1c2125'        // Soft black background
};
const CATS = ['Semua', 'Siomay', 'Paket Spesial', 'Kue Kering']
const fmt = n => n.toLocaleString('id-ID')
export default function WarungMakanApp() {
    const [cat, setCat] = useState('Semua')
    const [menu, setMenu] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetch('/api/products.php?app=warung-makan')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data && data.data.length > 0) {
                    const formattedMenu = data.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: parseFloat(p.price),
                        cat: p.category || 'Siomay',
                        img: p.image_url || '/assets/Siomay_01.jpg',
                        desc: p.description
                    }))
                    setMenu(formattedMenu)
                } else {
                    setMenu(FALLBACK_MENU)
                }
            })
            .catch(() => setMenu(FALLBACK_MENU))
            .finally(() => setLoading(false))
    }, [])
    const filtered = cat === 'Semua' ? menu : menu.filter(m => m.cat === cat)
    const orderViaWA = (item) => {
        const text = `Halo Alyuna Siomay, saya tertarik ingin memesan ${item.name} dengan harga Rp ${fmt(item.price)}. Apakah masih tersedia?`
        window.open(`https://wa.me/6282268404765?text=${encodeURIComponent(text)}`, '_blank')
    }
    return (
        <div style={{ fontFamily: '"Inter",sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>
            {/* Navbar */}
            <div style={{ background: BRAND.primary, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#111', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={getOptimizedImg("/assets/Logo_alyuna.jpeg", { w: 100, h: 100 })} alt="Alyuna Siomay" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #111' }} />
                    <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '0.05em' }}>ALYUNA SIOMAY</div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    {CATS.filter(c => c !== 'Semua').map(c => (
                        <span key={c} onClick={() => { setCat(c); document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }) }} style={{ cursor: 'pointer', opacity: cat === c ? 1 : 0.8, borderBottom: cat === c ? '2px solid #111' : 'none', paddingBottom: '2px' }}>
                            {c}
                        </span>
                    ))}
                </div>
            </div>
            {/* Hero */}
            <div style={{ background: '#1c2125', minHeight: '60vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflow: 'hidden', position: 'absolute', inset: 0 }}>
                    <img src={getOptimizedImg('/assets/Background_Siomay.jpeg', { w: 1200, h: 800 })} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} alt="Siomay Background" />
                </div>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', background: 'rgba(28, 33, 37, 0.7)', padding: '4rem 5rem', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <img src={getOptimizedImg("/assets/Logo_alyuna.jpeg", { w: 300, h: 300 })} alt="Alyuna Siomay Logo" style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1.5rem', border: '5px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
                        <h1 style={{ color: '#fff', fontSize: '4rem', fontWeight: 900, margin: '0 0 1rem', textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>ALYUNA SIOMAY</h1>
                        <p style={{ color: BRAND.accent, marginBottom: '2.5rem', fontSize: '1.3rem', fontWeight: 600 }}>Siomay Tenggiri Asli • Bumbu Kacang Kental</p>
                        <button onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} style={{ background: BRAND.primary, color: '#111', border: 'none', padding: '16px 40px', borderRadius: '30px', fontWeight: 900, cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(249, 168, 38, 0.4)' }}>Lihat Menu Siomay</button>
                    </div>
                </div>
            </div>
            {/* About */}
            <div style={{ background: '#fff', padding: '6rem 2rem', position: 'relative' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={getOptimizedImg("/assets/Logo_alyuna.jpeg", { w: 250, h: 250 })} alt="Alyuna Siomay & Nastar" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }} />
                        <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: '#f5cd4f', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>👩‍🍳</div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1c2125', marginBottom: '1.5rem' }}>Cerita Rasa Alyuna</h2>
                        <p style={{ color: '#555', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                            Bermula dari kecintaan keluarga terhadap hidangan lokal yang otentik, <strong>Alyuna Siomay</strong> hadir menyajikan siomay ikan tenggiri asli dengan resep turun-temurun. Setiap gigitan adalah perpaduan sempurna antara tekstur ikan yang kenyal dan siraman bumbu kacang rahasia kami yang gurih, manis, dan <em style={{ color: BRAND.primaryHover, fontWeight: 800, fontStyle: 'normal' }}>medok</em>.
                        </p>
                        <p style={{ color: '#555', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: '800px', margin: '0 auto' }}>
                            Selain hidangan gurih, kami juga menghadirkan kehangatan lewat <strong>Nastar Wisman Toples</strong> premium kami. Dibuat dengan butter Wisman berkualitas tinggi dan selai nanas pilihan dari kebun lokal, memberikan sensasi renyah yang langsung lumer di mulut. Kami menyajikan rasa dan kualitas juara tanpa kompromi!
                        </p>
                    </div>
                </div>
            </div>
            {/* Menu */}
            <div id="menu" style={{ background: '#f5f5f5', padding: '5rem 2rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 900, color: '#1c2125', marginBottom: '1rem' }}>Menu Pilihan</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '4rem', fontSize: '1.2rem' }}>Pilih paket favoritmu, <strong style={{ color: '#25d366' }}>pesan langsung via WhatsApp 📲</strong></p>
                <div style={{ display: 'flex', gap: '15px', justifyItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
                    {CATS.map(c => (
                        <button key={c} onClick={() => setCat(c)} style={{ padding: '12px 28px', borderRadius: '30px', border: 'none', background: cat === c ? BRAND.primary : '#fff', color: cat === c ? '#111' : '#444', fontWeight: cat === c ? 800 : 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: '0.2s' }}>
                            {c}
                        </button>
                    ))}
                </div>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '2.5rem' }}>
                    {filtered.map(item => (
                        <div key={item.id} style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease', cursor: 'default' }}>
                            <img src={getOptimizedImg(item.img, { w: 600, h: 400 })} alt={item.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1c2125', margin: 0, flex: 1 }}>{item.name}</h3>
                                    <span style={{ background: '#f5cd4f', color: '#1c2125', fontSize: '0.8rem', padding: '5px 12px', borderRadius: '8px', marginLeft: '12px', flexShrink: 0, fontWeight: 700 }}>{item.cat}</span>
                                </div>
                                <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.6, marginBottom: '2rem', minHeight: '50px' }}>{item.desc}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                                    <span style={{ fontWeight: 900, color: BRAND.primaryHover, fontSize: '1.4rem' }}>Rp {fmt(item.price)}</span>
                                    <button onClick={() => orderViaWA(item)} style={{ background: '#25d366', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                                        <span>Pesan via WA</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Location Map */}
            <div style={{ background: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1c2125', marginBottom: '1rem' }}>Lokasi Kami</h2>
                <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '3rem' }}>Griya Batu Aji Asri Tahap IV Blok I3 No 8, Batam</p>
                <div style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: '450px' }}>
                    <iframe
                        title="Alyuna Siomay Location"
                        src="https://maps.google.com/maps?q=griya+batu+aji+asri+tahap+iv+blok+i3+no+8+batam&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
            {/* Footer */}
            <div style={{ background: '#1c2125', color: '#888', textAlign: 'center', padding: '3rem 2rem', fontSize: '0.9rem' }}>
                <img src={getOptimizedImg("/assets/Logo_alyuna.jpeg", { w: 100, h: 100 })} alt="Alyuna" style={{ width: '40px', height: '40px', borderRadius: '50%', opacity: 0.5, marginBottom: '1rem' }} />
                <p>&copy; {new Date().getFullYear()} Alyuna Siomay. Buka Tiap Hari, Sedia Pesanan Partai Besar.</p>
            </div>
        </div>
    )
}
