import { useState, useRef, useEffect } from 'react'
import { ChevronDown, MapPin, Package } from 'lucide-react'
const REGIONS = ['Jawa Tengah', 'Jawa Timur', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur']
const CROPS = ['Padi', 'Jagung', 'Kedelai', 'Singkong', 'Tebu']
const DATA = {
    'Padi': { 'Jawa Tengah': 6.2, 'Jawa Timur': 6.8, 'Sulawesi Selatan': 5.9, 'Sumatera Utara': 5.1, 'Kalimantan Timur': 4.8 },
    'Jagung': { 'Jawa Tengah': 7.1, 'Jawa Timur': 7.4, 'Sulawesi Selatan': 6.5, 'Sumatera Utara': 5.8, 'Kalimantan Timur': 5.2 },
    'Kedelai': { 'Jawa Tengah': 1.8, 'Jawa Timur': 1.9, 'Sulawesi Selatan': 1.6, 'Sumatera Utara': 1.4, 'Kalimantan Timur': 1.2 },
    'Singkong': { 'Jawa Tengah': 22.1, 'Jawa Timur': 23.4, 'Sulawesi Selatan': 19.8, 'Sumatera Utara': 18.2, 'Kalimantan Timur': 16.5 },
    'Tebu': { 'Jawa Tengah': 85.2, 'Jawa Timur': 92.1, 'Sulawesi Selatan': 71.4, 'Sumatera Utara': 68.3, 'Kalimantan Timur': 55.0 },
}
const RECS = {
    'Padi': 'Curah hujan optimal 1500-2000mm/tahun. Rekomendasi: varietas unggul IR64 atau Ciherang. Pupuk NPK 250kg/ha.',
    'Jagung': 'Tanah lempung berpasir ideal. Rekomendasi: hybrid Pioneer P27. Jarak tanam 75x25cm.',
    'Kedelai': 'Butuh drainase baik. Rekomendasi: lakukan inokulasi rhizobium sebelum tanam untuk efisiensi nitrogen.',
    'Singkong': 'Tanah ringan dengan pH 5.5-7.0. Rekomendasi: Varietas Adira-4. Jarak tanam 1x1m.',
    'Tebu': 'Butuh sinar penuh dan air cukup. Rekomendasi: varietas PS 881 untuk rendemen tinggi.',
}

function CustomDropdown({ value, options, onChange, icon: Icon, label, theme = 'green' }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const themeColors = {
        green: { bg: 'bg-green-900/40', hover: 'hover:bg-green-900/60', border: 'border-green-500/30', text: 'text-green-100', icon: 'text-green-400' },
        slate: { bg: 'bg-slate-800', hover: 'hover:bg-slate-700', border: 'border-slate-600', text: 'text-slate-200', icon: 'text-slate-400' },
        light: { bg: 'bg-white', hover: 'hover:bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: 'text-slate-400', valText: 'text-slate-900' }
    }[theme];

    return (
        <div className="relative w-full sm:w-auto min-w-[160px]" ref={ref} style={{zIndex: 50}}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 ${themeColors.bg} ${themeColors.hover} ${themeColors.border} px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:ring-2 focus:ring-green-400 outline-none backdrop-blur-sm border`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className={`w-4 h-4 ${themeColors.icon}`} />}
                    <span className={`${themeColors.text} hidden sm:inline`}>{label}:</span>
                    <span className={`font-bold ${themeColors.valText || 'text-white'} tracking-wide`}>{value}</span>
                </div>
                <ChevronDown className={`w-4 h-4 ${themeColors.icon} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 w-full bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-200 py-2 z-50 max-h-[300px] overflow-y-auto">
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                value === opt ? 'bg-green-50 text-green-700 font-bold border-l-2 border-green-600' : 'text-slate-600 font-medium hover:bg-slate-50 border-l-2 border-transparent hover:text-slate-900'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CropYieldApp() {
    const [crop, setCrop] = useState('Padi')
    const [region, setRegion] = useState('Semua')
    const d = DATA[crop]
    const values = region === 'Semua' ? Object.values(d) : [d[region]]
    const maxVal = Math.max(...Object.values(d))
    const avgYield = (Object.values(d).reduce((a, b) => a + b, 0) / REGIONS.length).toFixed(1)
    const bestRegion = Object.entries(d).sort(([, a], [, b]) => b - a)[0][0]
    return (
        <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: '"Inter",sans-serif' }}>
            <div style={{ background: 'linear-gradient(135deg,#14532d,#166534)', padding: '1.5rem 2rem', color: '#fff' }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#86efac', letterSpacing: '0.15em', marginBottom: '4px' }}>CROP YIELD ANALYTICS</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Analisis Hasil Panen</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }} className="md:w-auto">
                    <CustomDropdown 
                        label="Komoditas" 
                        icon={Package} 
                        value={crop} 
                        options={CROPS} 
                        onChange={setCrop} 
                        theme="green"
                    />
                    <CustomDropdown 
                        label="Wilayah" 
                        icon={MapPin} 
                        value={region} 
                        options={['Semua', ...REGIONS]} 
                        onChange={setRegion} 
                        theme="green"
                    />
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[['Rata-rata Hasil', `${avgYield} ton/ha`, '🌾', '#14532d'], ['Hasil Terbaik', `${Math.max(...Object.values(d)).toFixed(1)} ton/ha`, '🏆', '#78350f'], ['Wilayah Terbaik', bestRegion, '📍', '#1e3a8a'], ['Total Komoditas', `${CROPS.length} jenis`, '🌱', '#4c1d95']].map(([l, v, i, c]) => (
                        <div key={l} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #bbf7d0' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{i}</div>
                            <div style={{ fontSize: typeof v === 'string' && v.length > 10 ? '1rem' : '1.5rem', fontWeight: 800, color: c, marginBottom: '4px', lineHeight: 1.2 }}>{v}</div>
                            <div style={{ fontSize: '0.75rem', color: '#1e293b' }}>{l}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Bar chart */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bbf7d0' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#14532d', marginBottom: '1.5rem' }}>Hasil Panen {crop} per Wilayah (ton/ha)</h2>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end', height: '180px', paddingBottom: '0.5rem' }}>
                            {REGIONS.map((r, i) => {
                                const val = d[r]
                                const h = (val / maxVal) * 160
                                const faded = region !== 'Semua' && region !== r
                                return (
                                    <div key={r} onClick={() => setRegion(region === r ? 'Semua' : r)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: faded ? 0.3 : 1, transition: 'opacity 0.2s' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#14532d' }}>{val}</div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '160px' }}>
                                            <div style={{ height: `${h}px`, background: `hsl(${120 + i * 15},60%,45%)`, borderRadius: '6px 6px 0 0', transition: 'height 0.4s', minHeight: '8px' }} />
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#1e293b', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{r.split(' ')[0]}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* AI Recommendation */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bbf7d0' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#14532d', marginBottom: '1rem' }}>Rekomendasi 🌱</h2>
                        <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.2rem' }}>🤖</span>
                                <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.7, margin: 0 }}>{RECS[crop]}</p>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#1e293b', marginBottom: '1rem' }}>Perbandingan Wilayah:</div>
                        {Object.entries(d).sort(([, a], [, b]) => b - a).map(([r, v], i) => (
                            <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < REGIONS.length - 1 ? '1px solid #f0fdf4' : 'none' }}>
                                <span style={{ fontSize: '0.82rem', color: '#374151' }}>{i + 1}. {r}</span>
                                <span style={{ fontWeight: 700, color: i === 0 ? '#14532d' : '#1e293b', fontSize: '0.85rem' }}>{v} t/ha</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
