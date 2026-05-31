import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Wrench, HeadphonesIcon, Users, Settings, Briefcase, CheckCircle, ChevronRight, Phone } from 'lucide-react';
import { getOptimizedImg } from '../../utils/imgHelper';
// ── COLOR THEME ─────────────────────────────────────────────────────────────
const BRAND = {
    primary: '#003399',      // BCA Blue
    secondary: '#FFCC00',    // Mandiri Yellow
    darkBlue: '#002673',     // Darker BCA Blue
    accent: '#005CB9',       // Lighter BCA Blue
    lightGray: '#F3F4F6'
};
// ── i18n CONFIGURATION ───────────────────────────────────────────────────────
const resources = {
    en: {
        translation: {
            hero_title: 'Trusted & Professional',
            hero_subtitle: 'Car Rental Batam',
            hero_description: 'Experience your journey with the best comfort, safety, and reliability. The leading car rental service in Batam.',
            fleet_title: 'Our Premium Fleet',
            fleet_subtitle: 'Choose from our wide range of well-maintained vehicles',
            price_per_day: '{{price}} / day',
            price_start: 'Starting From',
            book_now: 'Book Now',
            services_title: 'Why Choose Us?',
            features_1_title: 'Free Delivery',
            features_1_desc: 'Free unit delivery to Airport, Ferry Terminal, or Hotel.',
            features_2_title: 'Premium Quality',
            features_2_desc: 'Units are always clean, fragrant, and in prime condition.',
            features_3_title: '24/7 Support',
            features_3_desc: 'Professional team ready to assist your journey 24 hours.',
            filter_all: 'All Cars',
            filter_self_drive: 'Self Drive',
            filter_with_driver: 'With Driver',
            filter_matic: 'Automatic',
            filter_manual: 'Manual'
        }
    },
    id: {
        translation: {
            hero_title: 'Terpercaya & Profesional',
            hero_subtitle: 'Rental Mobil Batam',
            hero_description: 'Nikmati perjalanan Anda dengan kenyamanan, keamanan, dan keandalan terbaik. Layanan rental mobil terdepan di Batam.',
            fleet_title: 'Armada Premium Kami',
            fleet_subtitle: 'Pilih dari berbagai pilihan kendaraan kami yang terawat dengan baik',
            price_per_day: '{{price}} / hari',
            price_start: 'Mulai Dari',
            book_now: 'Pesan Sekarang',
            services_title: 'Mengapa Memilih Kami?',
            features_1_title: 'Gratis Antar Jemput',
            features_1_desc: 'Pengantaran unit gratis ke Bandara, Pelabuhan, atau Hotel.',
            features_2_title: 'Kualitas Premium',
            features_2_desc: 'Unit selalu bersih, wangi, dan dalam kondisi prima.',
            features_3_title: 'Dukungan 24/7',
            features_3_desc: 'Tim profesional siap membantu perjalanan Anda 24 jam.',
            filter_all: 'Semua Mobil',
            filter_self_drive: 'Lepas Kunci',
            filter_with_driver: 'Dengan Sopir',
            filter_matic: 'Matic',
            filter_manual: 'Manual'
        }
    }
    // ... translations for other languages can be added here
};
if (!i18n.isInitialized) {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'id',
            interpolation: { escapeValue: false }
        });
}
// ── UTILITIES ────────────────────────────────────────────────────────────────
const openWhatsApp = (lang, car = null) => {
    const phone = '6282176012461';
    const message = car
        ? `Halo, saya ingin memesan *${car.name}* (${car.type}) seharga *${car.price}/hari*. Apakah tersedia?`
        : `Halo, saya ingin memesan mobil rental di Batam. Bisakah Anda membantu saya?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};
const detectLocationAndSetLanguage = async () => {
    if (localStorage.getItem('i18nextLng')) return;
    try {
        const response = await fetch('https://get.geojs.io/v1/ip/country.json');
        if (!response.ok) return;
        const data = await response.json();
        const countryToLang = { SG: 'en', ID: 'id', MY: 'ms', TH: 'th', VN: 'vi', MM: 'my' };
        const lang = countryToLang[data.country];
        if (lang) i18n.changeLanguage(lang);
    } catch (e) { console.warn("Locale detect failed", e); }
};
// ── DATA ───────────────────────────────────────────────────────────────────

const exchangeRates = {
    'id': { rate: 1, symbol: 'Rp', locale: 'id-ID' },
    'en': { rate: 0.000086, symbol: 'S$', locale: 'en-SG' },
    'ms': { rate: 0.00028, symbol: 'RM', locale: 'ms-MY' },
    'th': { rate: 0.0022, symbol: '฿', locale: 'th-TH' },
    'vi': { rate: 1.62, symbol: '₫', locale: 'vi-VN' },
    'my': { rate: 0.13, symbol: 'K', locale: 'my-MM' }
};
const languages = [
    { code: 'en', label: 'English' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'ms', label: 'Bahasa Melayu' },
    { code: 'th', label: 'ไทย (Thai)' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'my', label: 'မြန်မာ (Burmese)' }
];
// ── COMPONENTS ─────────────────────────────────────────────────────────────
function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const currentLang = languages.find(l => l.code === i18n.language) || languages[1];
    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button aria-label="Action button" onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center w-full rounded-full border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Globe className="mr-2 h-4 w-4" style={{ color: BRAND.primary }} />
                {currentLang.label}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                        <div className="py-1 flex flex-col">
                            {languages.map((lang) => (
                                <button aria-label="Action button" key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); setIsOpen(false); }} className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${i18n.language === lang.code ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
function Services() {
    const { t } = useTranslation();
    const services = [
        { icon: <MapPin className="h-8 w-8 text-white" />, titleKey: 'features_1_title', defaultTitle: 'Free Delivery', descKey: 'features_1_desc', defaultDesc: 'Free unit delivery to Airport, Ferry Terminal, or Hotel.' },
        { icon: <CheckCircle className="h-8 w-8 text-white" />, titleKey: 'features_2_title', defaultTitle: 'Premium Quality', descKey: 'features_2_desc', defaultDesc: 'Units are always clean, fragrant, and in prime condition.' },
        { icon: <HeadphonesIcon className="h-8 w-8 text-white" />, titleKey: 'features_3_title', defaultTitle: '24/7 Support', descKey: 'features_3_desc', defaultDesc: 'Professional team ready to assist your journey 24 hours.' }
    ];
    return (
        <section className="py-24 bg-gray-50" id="services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-black text-gray-900 sm:text-4xl text-center mb-4">{t('services_title', 'Why Choose Us?')}</h2>
                <div className="w-20 h-1.5 mx-auto mb-16 rounded-full" style={{ backgroundColor: BRAND.secondary }}></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((s, i) => (
                        <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 group transition-all hover:shadow-xl">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl mb-8 transform group-hover:scale-110 transition-all shadow-lg" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})` }}>{s.icon}</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t(s.titleKey, s.defaultTitle)}</h2>
                            <p className="text-gray-500 leading-relaxed font-medium">{t(s.descKey, s.defaultDesc)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
function Fleet() {
    const { t, i18n } = useTranslation();
    const [allCars, setAllCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const currentLang = i18n.language || 'id';
    const { rate, symbol, locale } = exchangeRates[currentLang] || exchangeRates['id'];
    useEffect(() => {
        fetch('/api/products.php?app=batam-rental-mobil')
            .then(r => r.json())
            .then(d => {
                if (d.status === 'success') {
                    if (d.data?.length > 0) {
                        const formatted = d.data.map(p => ({
                            id: p.id,
                            name: p.name,
                            type: p.category || 'Rental',
                            price: parseFloat(p.price),
                            desc: p.description || '',
                            seats: p.extras?.seats || 5,
                            trans: p.extras?.trans || 'Matic',
                            luggage: p.extras?.luggage || 2,
                            cat: (p.category?.toLowerCase().includes('sopir') || p.category === 'Dengan Sopir') ? 'Dengan Sopir' : 'Lepas Kunci',
                            // Handle both image_url and img fields for maximum compatibility
                            img: p.image_url || p.img || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'
                        }));
                        setAllCars(formatted);
                        setFilteredCars(formatted);
                    } else {
                        // If status is success but data is empty
                        setAllCars([]);
                        setFilteredCars([]);
                    }
                } else {
                    throw new Error('API Error');
                }
            }).catch((err) => {
                console.error("Fetch error:", err);
                setAllCars([]);
                setFilteredCars([]);
            }).finally(() => setLoading(false));
    }, []);
    const filter = (type) => {
        setActiveFilter(type);
        if (type === 'All') setFilteredCars(allCars);
        else if (type === 'Lepas Kunci') setFilteredCars(allCars.filter(c => c.cat === 'Lepas Kunci'));
        else if (type === 'Dengan Sopir') setFilteredCars(allCars.filter(c => c.cat === 'Dengan Sopir'));
        else if (type === 'Matic') setFilteredCars(allCars.filter(c => c.trans === 'Matic'));
        else if (type === 'Manual') setFilteredCars(allCars.filter(c => c.trans === 'Manual'));
    };
    const formatPrice = (base) => {
        const converted = base * rate;
        const cur = currentLang === 'vi' ? 'VND' : (currentLang === 'en' ? 'SGD' : (currentLang === 'ms' ? 'MYR' : (currentLang === 'th' ? 'THB' : 'IDR')));
        return new Intl.NumberFormat(locale, { style: 'currency', currencyDisplay: 'narrowSymbol', currency: cur, minimumFractionDigits: 0, maximumFractionDigits: cur === 'IDR' || cur === 'VND' ? 0 : 2 }).format(converted);
    };
    const filters = [
        { id: 'All', label: t('filter_all') },
        { id: 'Lepas Kunci', label: t('filter_self_drive') },
        { id: 'Dengan Sopir', label: t('filter_with_driver') },
        { id: 'Matic', label: t('filter_matic') },
        { id: 'Manual', label: t('filter_manual') }
    ];
    return (
        <section className="py-24 bg-white" id="fleet">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">{t('fleet_title', 'Our Premium Fleet')}</h2>
                    <div className="w-20 h-1.5 mx-auto mt-4 mb-6 rounded-full" style={{ backgroundColor: BRAND.secondary }}></div>
                    <p className="text-lg text-gray-500">{t('fleet_subtitle')}</p>
                </div>
                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {filters.map(f => (
                        <button aria-label="Action button"
                            key={f.id}
                            onClick={() => filter(f.id)}
                            className={`px-6 py-2.5 rounded-full font-bold transition-all border ${activeFilter === f.id ? 'text-white border-transparent' : 'text-gray-600 bg-white border-gray-200 hover:border-blue-600'}`}
                            style={{ backgroundColor: activeFilter === f.id ? BRAND.primary : 'white' }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? <div className="col-span-full text-center py-12">Loading...</div> :
                        <AnimatePresence mode='popLayout'>
                            {filteredCars.length === 0 ? (
                                <div className="col-span-full text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                                    <p className="text-gray-500 font-medium text-lg">Belum ada armada kendaraan yang tersedia saat ini.</p>
                                </div>
                            ) : filteredCars.map((car) => {
                                const price = formatPrice(car.price);
                                return (
                                    <motion.div
                                        layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                        key={car.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col group transition-all"
                                    >
                                        <div className="h-60 bg-gray-50 flex items-center justify-center p-8 relative overflow-hidden">
                                            <div className="absolute top-4 right-4 z-10">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white ${car.cat === 'Lepas Kunci' ? 'bg-green-600' : 'bg-orange-600'}`}>
                                                    {car.cat}
                                                </span>
                                            </div>
                                            <img src={getOptimizedImg(car.img, { w: 500, h: 300 })} alt={car.name} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-8 flex-grow flex flex-col">
                                            <div className="mb-4">
                                                <span className="text-blue-600 text-xs font-black uppercase tracking-widest block mb-2">{car.type}</span>
                                                <h2 className="text-2xl font-black text-gray-900 mb-2">{car.name}</h2>
                                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed h-10 mb-4">{car.desc}</p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mb-8 py-4 border-y border-gray-50">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Users size={18} className="text-gray-400" />
                                                    <span className="text-xs font-bold text-gray-600">{car.seats} Seats</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 border-x border-gray-100">
                                                    <Settings size={18} className="text-gray-400" />
                                                    <span className="text-xs font-bold text-gray-600">{car.trans}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <Briefcase size={18} className="text-gray-400" />
                                                    <span className="text-xs font-bold text-gray-600">{car.luggage} Bags</span>
                                                </div>
                                            </div>
                                            <div className="mt-auto pt-4 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('price_start')}</span>
                                                    <span className="text-2xl font-black text-gray-900">{price}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold">/ {currentLang === 'id' ? 'Hari' : 'Day'}</span>
                                                </div>
                                                <button aria-label="Action button"
                                                    onClick={() => openWhatsApp(currentLang, { name: car.name, type: car.type, price })}
                                                    className="h-14 px-8 rounded-2xl font-black text-gray-900 shadow-lg hover:brightness-105 transition-all flex items-center gap-2"
                                                    style={{ backgroundColor: BRAND.secondary }}
                                                >
                                                    {t('book_now')}
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    }
                </motion.div>
            </div>
        </section>
    );
}
// ── MAIN APP CONTENT ───────────────────────────────────────────────────────
export default function BatamRentalMobilApp() {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        detectLocationAndSetLanguage();
        // Force the page to start at the top
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="batam-rent-wrapper min-h-screen flex flex-col font-sans text-gray-900 bg-white selection:bg-blue-100">
            {/* Header / Navbar */}
            <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 h-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-full items-center">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-xl" style={{ backgroundColor: BRAND.primary }}>
                            <img src="/assets/Logo.png" alt="Logo" className="h-8 w-auto brightness-0 invert" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-2xl tracking-tighter leading-none" style={{ color: BRAND.primary }}>BATAMRENT</span>
                            <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Premium Car Rental</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        {['Services', 'Fleet', 'Contact'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-gray-500 hover:text-blue-900 transition-colors uppercase tracking-widest">{item}</a>
                        ))}
                        <LanguageSwitcher />
                        <button aria-label="Action button"
                            onClick={() => openWhatsApp(i18n.language)}
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-gray-900 shadow-md hover:shadow-xl transition-all"
                            style={{ backgroundColor: BRAND.secondary }}
                        >
                            <Phone size={18} />
                            62-821-7601-2461
                        </button>
                    </div>
                    <div className="md:hidden">
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex flex-col justify-center py-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {/* Background Video or High-Qual Image */}
                        <div className="absolute inset-0 bg-black">
                            <iframe title="Embedded Content"
                                className="absolute opacity-40 w-full h-full object-cover pointer-events-none scale-110"
                                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                src="https://www.youtube.com/embed/w4goi8YBrfg?autoplay=1&mute=1&loop=1&playlist=w4goi8YBrfg&controls=0&showinfo=0&rel=0"
                                allow="autoplay"
                            />
                        </div>
                        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to right, ${BRAND.primary}cc, transparent)` }}></div>
                        <div className="absolute inset-x-0 bottom-0 h-32 z-20 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 mb-8"
                            >
                                <span className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_#FFCC00]" style={{ backgroundColor: BRAND.secondary }}></span>
                                <span className="text-xs font-black text-white uppercase tracking-[0.2em] shadow-sm">#1 Recommended in Batam</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="text-6xl font-black text-white sm:text-8xl mb-6 leading-[0.9] tracking-tighter"
                            >
                                {t('hero_title')}<br />
                                <span style={{ color: BRAND.secondary }}>{t('hero_subtitle')}</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="text-xl text-blue-50/80 mb-12 font-medium leading-relaxed max-w-xl"
                            >
                                {t('hero_description')}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                className="flex flex-wrap gap-4"
                            >
                                <button aria-label="Action button"
                                    onClick={() => document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-10 py-5 bg-white text-blue-900 rounded-2xl font-black text-lg transition-all shadow-2xl hover:bg-blue-50 flex items-center gap-3"
                                >
                                    Pesan Sekarang
                                    <ChevronRight size={24} />
                                </button>
                                <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-sm">2,500+ Clients</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-xs text-shadow-sm">★</span>)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <Services />
                <Fleet />
                {/* Contact CTA */}
                <section className="py-24 bg-gray-900 text-white overflow-hidden relative" id="contact">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-24"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-black mb-8 leading-tight">Ready to explore Batam?<br /><span className="text-blue-500">Contact us now for best prices.</span></h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30"><MapPin className="text-blue-400" /></div>
                                        <div>
                                            <h4 className="font-bold text-lg">Our Office</h4>
                                            <p className="text-gray-400">Rumjis, Batam Center, Kepulauan Riau, Indonesia</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30"><Phone className="text-blue-400" /></div>
                                        <div>
                                            <h4 className="font-bold text-lg">24/7 Hotline</h4>
                                            <p className="text-gray-400">+62 821 7601 2461</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-[2rem] p-4 shadow-2xl overflow-hidden h-96 border-4" style={{ borderColor: BRAND.primary }}>
                                <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0773457625937!2d103.94955377627753!3d1.1041678623135676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98b56fbc5ff73%3A0xf0ab4bfc58d201ec!2sRumjis!5e0!3m2!1sen!2sid!4v1772357246236!5m2!1sen!2sid" width="100%" height="100%" style={{ border: 0 }}></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-white text-gray-900 py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: BRAND.primary }}>
                            <img src="/assets/Logo.png" alt="Logo" className="h-6 w-auto brightness-0 invert" />
                        </div>
                        <span className="font-black text-xl tracking-tighter" style={{ color: BRAND.primary }}>BATAMRENT</span>
                    </div>
                    <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">© 2026 Batam Rental Mobil. Professional Choice.</p>
                    <div className="flex gap-4">
                        {['Instagram', 'Facebook', 'TikTok'].map(sm => (
                            <span key={sm} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-blue-50 transition-colors cursor-pointer"><ChevronRight size={16} /></span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
