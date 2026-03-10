import { useState, useEffect } from 'react'
import { useResponsive } from '../../hooks/useResponsive'
import { getOptimizedImg } from '../../utils/imgHelper'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Truck, CreditCard, ChevronRight, Plus, Menu, X, Phone, MapPin, Globe, CheckCircle } from 'lucide-react'



const BRAND = {
    primary: 'emerald', // Using tailwind names now
    accent: 'amber'
}
const fmt = n => n.toLocaleString('id-ID')
export default function ConsultantApp() {
    const { isMobile, isTablet, width } = useResponsive()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch('/api/products.php?app=batam-chicken-supplier')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data && data.data.length > 0) {
                    const formattedProducts = data.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: parseFloat(p.price),
                        desc: p.description,
                        img: p.image_url || 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg',
                        tag: p.category || 'Fresh'
                    }))
                    setProducts(formattedProducts)
                } else {
                    setProducts([])
                }
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [])

    const orderViaWA = (item) => {
        const text = `Halo Batam Chicken Center, saya ingin memesan ${item.name} dengan harga Rp ${fmt(item.price)}/Kg. Mohon informasi stok dan jadwal pengiriman.`
        window.open(`https://wa.me/6282176012461?text=${encodeURIComponent(text)}`, '_blank')
    }

    const orderCustom = () => {
        const text = `Halo Batam Chicken Center, saya butuh suplai ayam rutin untuk restoran/bisnis kuliner saya. Bisa kirimkan daftar harga grosir?`
        window.open(`https://wa.me/6282176012461?text=${encodeURIComponent(text)}`, '_blank')
    }

    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="sticky top-0 inset-x-0 h-20 bg-white/95 backdrop-blur-xl z-[100] border-b border-slate-100 px-5 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
                        <span className="text-2xl">🐓</span>
                    </div>
                    <div>
                        <div className="font-black text-xl tracking-tighter leading-none text-emerald-600 uppercase">BATAM<span className="text-emerald-900">CHICKEN</span></div>
                        <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Center & Supplier</div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {['Home', 'Produk', 'Keunggulan', 'Lokasi'].map(item => (
                        <button
                            key={item}
                            onClick={() => {
                                const id = item.toLowerCase()
                                document.getElementById(id === 'home' ? 'hero' : id)?.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest"
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        onClick={orderCustom}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                    >
                        Order Partai Besar
                    </button>
                </div>

                <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-20 bg-white border-b border-slate-100 z-[90] p-6 flex flex-col gap-6 md:hidden shadow-2xl"
                    >
                        {['Home', 'Produk', 'Keunggulan', 'Lokasi'].map(item => (
                            <button
                                key={item}
                                onClick={() => {
                                    const id = item.toLowerCase()
                                    document.getElementById(id === 'home' ? 'hero' : id)?.scrollIntoView({ behavior: 'smooth' })
                                    setMobileMenuOpen(false)
                                }}
                                className="text-xl font-black text-slate-900 uppercase tracking-tighter text-left"
                            >
                                {item}
                            </button>
                        ))}
                        <button
                            onClick={orderCustom}
                            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg"
                        >
                            Order Partai Besar
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section id="hero" className="relative pt-12 md:pt-20 pb-12 md:pb-24 px-5 md:px-8 overflow-hidden bg-emerald-50/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-6 md:mb-8 border border-emerald-200 shadow-sm">
                            <ShieldCheck size={14} fill="currentColor" /> Premium & Healthy Chicken
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6 md:mb-8 uppercase">
                            Ayam Segar, <br />
                            <span className="text-emerald-600">Terbaik di Batam</span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-500 mb-8 md:mb-10 leading-relaxed max-w-xl font-medium">
                            Ayam kampung asli tanpa suntikan hormon. Dipotong harian untuk menjamin kesegaran maksimal langsung dari peternakan kami ke dapur Anda.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => document.getElementById('produk').scrollIntoView({ behavior: 'smooth' })}
                                className="h-14 md:h-16 px-8 md:px-10 bg-emerald-600 text-white rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] transition-all uppercase tracking-wider text-sm md:text-base"
                            >
                                Lihat Produk <ChevronRight size={20} />
                            </button>
                            <div className="flex items-center gap-4 py-3 md:py-0">
                                <div className="flex -space-x-3 items-center">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={getOptimizedImg(`https://i.pravatar.cc/100?img=${i + 20}`, { w: 50, h: 50 })} alt="" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">+2k Suplai Restoran</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-10 bg-emerald-200/40 rounded-full blur-[100px] -z-10" />
                        <div className="bg-white p-4 rounded-[40px] shadow-2xl border border-white/50">
                            <img
                                src={getOptimizedImg("https://images.pexels.com/photos/1405930/pexels-photo-1405930.jpeg", { w: 800, h: 600 })}
                                className="w-full h-[300px] md:h-[450px] object-cover rounded-[32px] shadow-inner"
                                alt="Batam Chicken Center"
                            />
                        </div>
                        {/* Trust Badge */}
                        <div className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-white p-5 rounded-3xl shadow-2xl border border-slate-50 flex items-center gap-4 max-w-[200px] md:max-w-xs animate-bounce-slow">
                            <div className="w-12 md:w-14 h-12 md:h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <div className="font-black text-slate-900 text-sm md:text-lg leading-tight uppercase">100% Halal</div>
                                <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-tight">Potong Higienis</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features (Keunggulan) */}
            <section id="keunggulan" className="py-16 md:py-24 px-5 md:px-8 bg-white border-y border-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">Kenapa Memilih Kami?</h2>
                        <div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { icon: '🚀', title: 'Kiriman Cepat', desc: 'Ayam dipotong saat ada pesanan, tiba di lokasi Anda kurang dari 3 jam kemudian.' },
                            { icon: '🍃', title: 'Pakan Alami', desc: 'Tanpa antibiotik berbahaya. Hasil daging lebih padat, gurih, dan berkualitas tinggi.' },
                            { icon: '💰', title: 'Harga Kandang', desc: 'Tangan pertama dari peternakan. Potong biaya distribusi dan dapatkan harga terbaik.' },
                            { icon: '🔪', title: 'Ready-to-Cook', desc: 'Bisa minta potong 4, 8, atau 12 bagian. Sudah dibersihkan utuh dan siap olah.' }
                        ].map((item, i) => (
                            <motion.div
                                whileHover={{ y: -10 }}
                                key={i}
                                className="bg-slate-50 p-8 rounded-[32px] border border-slate-100/50 hover:bg-emerald-50 transition-colors"
                            >
                                <div className="text-4xl mb-6">{item.icon}</div>
                                <h3 className="font-black text-lg text-slate-900 uppercase mb-3 tracking-tight">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products (Produk) */}
            <section id="produk" className="py-16 md:py-24 px-5 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-none">Varian Produk Kami</h2>
                        <p className="text-slate-500 font-medium">Pasokan rutin untuk kebutuhan harian maupun bisnis katering Anda.</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100">
                        <Truck size={16} /> Gratis Ongkir Area Batam Center*
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Memuat Produk...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.length === 0 && !loading ? (
                            <div className="col-span-full text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
                                <p className="text-slate-500 font-medium text-lg">Belum ada stok ayam yang tersedia saat ini.</p>
                            </div>
                        ) : products.map((item, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={item.id}
                                className="group bg-white rounded-[40px] p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all flex flex-col"
                            >
                                <div className="h-48 md:h-56 bg-emerald-50/50 rounded-[32px] mb-6 p-4 overflow-hidden relative">
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm border border-emerald-50">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <img
                                        src={getOptimizedImg(item.img, { w: 600, h: 450 })}
                                        className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm"
                                        alt={item.name}
                                    />
                                </div>
                                <div className="flex-1 px-2">
                                    <h3 className="font-black text-xl text-slate-900 leading-tight mb-2 tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{item.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                                <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-slate-50 px-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga / Kg</span>
                                            <span className="font-black text-2xl text-emerald-600 tracking-tight">Rp {fmt(item.price)}</span>
                                        </div>
                                        <button
                                            onClick={() => orderViaWA(item)}
                                            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-all shadow-lg hover:rotate-6 active:scale-95"
                                        >
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Map & Location */}
            <section id="lokasi" className="py-20 px-5 md:px-8 bg-slate-50/50">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white p-6 md:p-10 rounded-[48px] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2 rounded-[32px] overflow-hidden h-[300px] md:h-[400px] shadow-inner border border-slate-100">
                            <iframe
                                title="Batam Chicken Center"
                                src="https://maps.google.com/maps?q=barelang+batam&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                            ></iframe>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <div className="inline-flex w-fit px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black tracking-widest uppercase border border-emerald-100">Our Location</div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Mampir Langsung ke Farm Kami</h2>
                            <p className="text-slate-500 leading-relaxed font-medium">Buka setiap hari (07:00 - 17:00). Kawasan Barelang, Batam. Dapatkan harga khusus untuk pembelian langsung di tempat.</p>
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                                    <MapPin className="text-emerald-600" size={20} /> Barelang Bridge Area, Batam
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                                    <Phone className="text-emerald-600" size={20} /> +62 821-7601-2461
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-5 md:px-8 text-center bg-white">
                <div className="max-w-4xl mx-auto py-20 px-10 bg-emerald-600 rounded-[50px] shadow-2xl shadow-emerald-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/10 rounded-full blur-3xl -ml-32 -mb-32" />

                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-8 relative z-10 leading-tight">Suplai Restoran <br />Partai Besar?</h2>
                    <p className="text-emerald-50 mb-12 text-lg md:text-xl font-medium relative z-10 opacity-90">Dapatkan katalog harga grosir khusus B2B untuk menekan budget operasional Anda.</p>
                    <button
                        onClick={orderCustom}
                        className="bg-white text-emerald-900 px-12 py-5 rounded-2xl font-black text-lg md:text-xl uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10"
                    >
                        Hubungi Supplier Utama
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-50 text-center">
                <div className="font-black text-xl tracking-tighter uppercase mb-4 text-emerald-600">BATAM<span className="text-slate-900">CHICKEN</span></div>
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">© {new Date().getFullYear()} Batam Chicken Center. All rights reserved.</p>
            </footer>
        </div>
    )
}

