import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart,
    ChevronRight,
    Star,
    ShieldCheck,
    Truck,
    CreditCard,
    X,
    Plus,
    Minus,
    Search,
    Laptop,
    Smartphone,
    Monitor,
    Headphones,
    ArrowRight
} from 'lucide-react'
import { getOptimizedImg } from '../../utils/imgHelper'

const FALLBACK_PRODUCTS = [
    { id: 'f1', name: 'MacBook Pro M3 Max', price: 54999000, category: 'Laptops', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', extras: { colors: ['Space Black', 'Silver'], sizes: ['36GB / 1TB'] }, description: 'Chip M3 Max paling bertenaga untuk profesional.' },
    { id: 'f2', name: 'iPhone 15 Pro Max', price: 22999000, category: 'Gadgets', image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', extras: { colors: ['Natural Titanium'], sizes: ['256GB'] }, description: 'Titanium design dengan A17 Pro chip.' }
]

const CATEGORIES = [
    { id: 'all', label: 'Semua', icon: Search },
    { id: 'Laptops', label: 'Laptops', icon: Laptop },
    { id: 'Gadgets', label: 'Gadgets', icon: Smartphone },
    { id: 'Monitors', label: 'Monitors', icon: Monitor }
]

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export default function TokoLaptopBatamApp() {
    const [activeTab, setActiveTab] = useState('all')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetch('/api/products.php?app=toko-laptop-batam')
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success' && res.data?.length > 0) {
                    setProducts(res.data)
                } else {
                    setProducts(FALLBACK_PRODUCTS)
                }
            })
            .catch(() => setProducts(FALLBACK_PRODUCTS))
            .finally(() => setLoading(false))
    }, [])

    const filteredProducts = useMemo(() =>
        activeTab === 'all' ? products : products.filter(p => p.category === activeTab)
        , [products, activeTab])

    const handleWhatsAppOrder = () => {
        if (!selectedProduct) return;

        const sizeText = selectedSize ? `\nVarian: ${selectedSize}` : '';
        const colorText = selectedColor ? `\nWarna: ${selectedColor}` : '';

        const message = `Halo Batam Tech! Saya tertarik memesan produk ini (Pengiriman Nasional):\n\n*${selectedProduct.name}*${sizeText}${colorText}\nHarga: ${formatIDR(selectedProduct.price)}\n\nApakah stoknya masih tersedia untuk pengiriman ke kota saya?`;

        window.open(`https://wa.me/6281276012461?text=${encodeURIComponent(message)}`, '_blank');
    }
    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Header */}
            <nav className="sticky top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-100 px-5 md:px-8 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Laptop size={22} />
                    </div>
                    <div>
                        <div className="font-black text-xl tracking-tighter leading-none italic uppercase">BATAM<span className="text-blue-600">TECH</span></div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Premium Pre-loved Specialist</div>
                    </div>
                </motion.div>

                <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500">
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveTab(cat.id); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}
                            className="hover:text-blue-600 transition-colors uppercase"
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-12 md:pt-20 pb-12 md:pb-20 px-5 md:px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent -z-10" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-blue-100">
                            <ShieldCheck size={14} fill="currentColor" /> Expert Pre-loved Selection
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6 md:mb-8 uppercase">
                            Gadget Mewah, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Harga Ramah</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 mb-8 md:mb-10 leading-relaxed max-w-xl">
                            Elektronik pre-loved kualitas grade A+. Lulus QC 21 poin, garansi toko, dan harga Batam yang tak tertandingi.
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                                className="h-16 px-8 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-2xl transition-all uppercase"
                            >
                                Mulai Belanja <ChevronRight size={20} />
                            </button>
                            <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-0">
                                <div className="flex -space-x-3 items-center">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src={getOptimizedImg(`https://i.pravatar.cc/100?img=${i + 10}`, { w: 50, h: 50 })} alt="" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-tight">+5k Gadget Terjual & Teruji se-Indonesia</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-400 blur-[120px] opacity-20 rounded-full" />
                        <img
                            src={getOptimizedImg("https://images.unsplash.com/photo-1517336714731-489689fd1ca8", { w: 1000 })}
                            className="relative w-full h-auto drop-shadow-2xl"
                            alt="Hero Product"
                        />
                    </motion.div>
                </div>
            </section>
            {/* Features */}
            <section className="py-12 md:py-20 px-5 md:px-8 border-y border-slate-50 bg-slate-50/30">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {[
                        { icon: ShieldCheck, title: 'Lulus QC 21 Poin', desc: 'Setiap unit telah melalui pengecekan ketat 21 parameter untuk menjamin performa layaknya baru.' },
                        { icon: Truck, title: 'Pengiriman Aman', desc: 'Packing kayu dan asuransi penuh untuk menjamin unit tiba dengan mulus di tangan Anda.' },
                        { icon: CreditCard, title: 'Garansi Toko', desc: 'Ketenangan ekstra dengan garansi toko 1-3 bulan dan dukungan purna jual selamanya.' }
                    ].map((f, i) => (
                        <div key={i} className="flex gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                                <f.icon size={28} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 mb-2 uppercase">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Catalog */}
            <section id="catalog" className="py-16 md:py-24 px-5 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">Koleksi Pre-loved Terbaik</h2>
                        <p className="text-slate-500">Barang mulus (like new), fungsional 100%, dan harga jauh di bawah harga baru.</p>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[20px] w-fit">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`h-12 px-6 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all uppercase ${activeTab === cat.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <cat.icon size={16} /> {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="font-bold text-slate-400 uppercase">Memuat koleksi terbaik...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((p, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    key={p.id}
                                    className="group bg-white rounded-[32px] p-6 border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer flex flex-col"
                                    onClick={() => {
                                        setSelectedProduct(p)
                                        setSelectedSize(p.extras?.sizes?.[0] || null)
                                        setSelectedColor(p.extras?.colors?.[0] || null)
                                    }}
                                >
                                    <div className="h-48 bg-slate-50 rounded-2xl mb-6 p-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={getOptimizedImg(p.image_url, { w: 400, h: 400 })}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                                            alt={p.name}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black tracking-widest uppercase text-blue-600 mb-2">{p.category}</div>
                                        <h3 className="font-black text-lg text-slate-900 leading-tight mb-2 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{p.name}</h3>
                                        <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                                        <span className="font-black text-xl text-slate-900 tracking-tight">{formatIDR(p.price)}</span>
                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                            <Plus size={20} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-20 px-8">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-slate-400">
                    <div className="col-span-2">
                        <div className="font-black text-2xl tracking-tighter italic text-white mb-6 uppercase">BATAM<span className="text-blue-500">TECH</span></div>
                        <p className="max-w-sm leading-relaxed mb-8">Spesialis gadget pre-loved (second-hand) premium tangan pertama dari Batam. Menghadirkan kualitas unit "Like New" dengan harga yang menghemat kantong Anda.</p>
                        <div className="flex gap-4">
                            {['Instagram', 'Youtube', 'X'].map(social => (
                                <div key={social} className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 flex items-center justify-center text-white cursor-pointer transition-colors text-xs font-bold uppercase">{social[0]}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-black mb-6 uppercase tracking-wider text-sm">Lokasi Kami</h4>
                        <div className="space-y-4 text-sm font-medium">
                            <p className="flex gap-3"><span className="text-blue-500">📍</span> Mega Mall Batam Centre, Lt 2</p>
                            <p className="flex gap-3"><span className="text-blue-500">📍</span> Nagoya Hill, Blok A No. 12</p>
                            <p className="flex gap-3"><span className="text-blue-500">📍</span> Kepri Mall, Lantai Dasar</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-black mb-6 uppercase tracking-wider text-sm">Layanan</h4>
                        <div className="space-y-4 text-sm font-medium">
                            <p className="flex gap-3"><span className="text-blue-500">⚡</span> Fast Response (09.00 - 21.00)</p>
                            <p className="flex gap-3"><span className="text-blue-500">🤝</span> Jaminan Unit Mulus & Original</p>
                            <p className="flex gap-3"><span className="text-blue-500">🛡️</span> After-Sales Support Luar Kota</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 text-center text-xs font-bold tracking-widest text-slate-600 uppercase">
                    © 2025 NurdiansyahLabs · Batam Tech Store. All rights reserved.
                </div>
            </footer>
            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[40px] shadow-2xl p-4 w-full max-w-4xl grid md:grid-cols-2 gap-4 overflow-hidden"
                        >
                            <div className="bg-slate-50 rounded-[32px] p-12 flex items-center justify-center relative">
                                <img src={getOptimizedImg(selectedProduct.image_url, { w: 800, h: 800 })} className="w-full h-auto drop-shadow-xl mix-blend-multiply" alt={selectedProduct.name} />
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-10 flex flex-col">
                                <div className="text-xs font-black tracking-[0.2em] uppercase text-blue-600 mb-2 uppercase">{selectedProduct.category}</div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-4 uppercase">{selectedProduct.name}</h2>
                                <div className="text-3xl font-black text-blue-600 mb-8 tracking-tighter">{formatIDR(selectedProduct.price)}</div>

                                <div className="space-y-6 mb-10 overflow-y-auto pr-2">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 uppercase">Pilih Varian</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.extras?.sizes?.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-5 h-11 border-2 rounded-xl text-sm font-bold transition-all uppercase ${selectedSize === size ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-100 text-slate-600 hover:border-blue-600 hover:text-blue-600'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 uppercase">Warna</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.extras?.colors?.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-5 h-11 rounded-xl text-sm font-bold transition-all uppercase ${selectedColor === color ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white'}`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 leading-relaxed text-sm italic">"{selectedProduct.description}"</p>
                                </div>

                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="mt-auto w-full h-16 bg-green-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 hover:bg-green-600 transition-all uppercase"
                                >
                                    Pesan Lewat WhatsApp <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
