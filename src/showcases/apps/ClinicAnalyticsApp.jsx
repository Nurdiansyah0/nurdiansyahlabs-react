import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Calendar, Building } from 'lucide-react'
const DEPTS = ['Semua', 'IGD', 'Rawat Inap', 'Poliklinik', 'Radiologi', 'Laboratorium']
const MONTHLY_PATIENTS = {
    'Januari': { igd: 234, rawat: 87, poli: 412, radio: 98, lab: 201 },
    'Februari': { igd: 198, rawat: 92, poli: 380, radio: 112, lab: 220 },
    'Maret': { igd: 267, rawat: 104, poli: 445, radio: 87, lab: 198 },
}
const BEDS = { total: 120, occupied: 98, available: 22, emergency: 6 }
const CONDITIONS = [
    { name: 'Hipertensi', patients: 312, pct: 18, color: '#b91c1c' },
    { name: 'Diabetes', patients: 245, pct: 14, color: '#b45309' },
    { name: 'ISPA', patients: 198, pct: 11, color: '#1d4ed8' },
    { name: 'Jantung', patients: 167, pct: 9, color: '#6d28d9' },
    { name: 'Lainnya', patients: 831, pct: 48, color: '#e2e8f0' },
]

function CustomDropdown({ value, options, onChange, icon: Icon, label, theme = 'blue' }) {
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
        blue: { bg: 'bg-blue-900/40', hover: 'hover:bg-blue-900/60', border: 'border-blue-500/30', text: 'text-blue-100', icon: 'text-blue-400' },
        light: { bg: 'bg-white', hover: 'hover:bg-slate-50', border: 'border-blue-200', text: 'text-slate-500', icon: 'text-blue-500', valText: 'text-blue-900' }
    }[theme];

    return (
        <div className="relative w-full sm:w-auto min-w-[160px]" ref={ref} style={{zIndex: 50}}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 ${themeColors.bg} ${themeColors.hover} ${themeColors.border} px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:ring-2 focus:ring-blue-400 outline-none backdrop-blur-sm border`}
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
                                value === opt ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-slate-600 font-medium hover:bg-slate-50 border-l-2 border-transparent hover:text-slate-900'
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

export default function ClinicAnalyticsApp() {
    const [dept, setDept] = useState('Semua')
    const [month, setMonth] = useState('Maret')
    const d = MONTHLY_PATIENTS[month]
    const totalPat = dept === 'Semua' ? d.igd + d.rawat + d.poli + d.radio + d.lab : { IGD: d.igd, 'Rawat Inap': d.rawat, Poliklinik: d.poli, Radiologi: d.radio, Laboratorium: d.lab }[dept] || 0
    const maxPat = Math.max(d.igd, d.rawat, d.poli, d.radio, d.lab)
    return (
        <div style={{ minHeight: '100vh', background: '#f0f7ff', fontFamily: '"Inter",sans-serif' }}>

            <div style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e3a8a)', padding: '1.5rem 2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: '#93c5fd', letterSpacing: '0.15em', marginBottom: '4px' }}>CLINIC HEALTH ANALYTICS</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Dashboard Analitik RS Sejahtera</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }} className="md:w-auto">
                    <CustomDropdown 
                        label="Bulan" 
                        icon={Calendar} 
                        value={month} 
                        options={Object.keys(MONTHLY_PATIENTS)} 
                        onChange={setMonth} 
                        theme="blue"
                    />
                </div>
            </div>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[{ l: 'Total Pasien', v: String(d.igd + d.rawat + d.poli + d.radio + d.lab), i: '👥', c: '#1e40af' }, { l: 'Bed Terisi', v: `${BEDS.occupied}/${BEDS.total}`, i: '🛏', c: '#991b1b' }, { l: 'BOR', v: `${Math.round((BEDS.occupied / BEDS.total) * 100)}%`, i: '📊', c: '#b45309' }, { l: 'Bed Kosong', v: String(BEDS.available), i: '✅', c: '#166534' }].map(m => (
                        <div key={m.l} style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{m.i}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: m.c, marginBottom: '4px' }}>{m.v}</div>
                            <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>{m.l}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Bar chart per dept */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>Kunjungan per Departemen — {month}</h2>
                            <CustomDropdown 
                                label="Dept" 
                                icon={Building} 
                                value={dept} 
                                options={DEPTS} 
                                onChange={setDept} 
                                theme="light"
                            />
                        </div>
                        {[['IGD', d.igd, '#b91c1c'], ['Rawat Inap', d.rawat, '#6d28d9'], ['Poliklinik', d.poli, '#1e40af'], ['Radiologi', d.radio, '#b45309'], ['Laboratorium', d.lab, '#166534']].map(([name, val, color]) => (
                            <div key={name} style={{ marginBottom: '1rem', opacity: dept === 'Semua' || dept === name ? 1 : 0.3 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#374151', fontWeight: 500 }}>{name}</span>
                                    <span style={{ fontWeight: 700, color: '#1e3a8a' }}>{val} pasien</span>
                                </div>
                                <div style={{ height: '14px', background: '#f0f7ff', borderRadius: '7px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: color, borderRadius: '7px', width: `${(val / maxPat) * 100}%`, transition: 'width 0.5s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Diagnosis distribution */}
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '1.5rem' }}>Diagnosis Terbanyak</h2>
                        {CONDITIONS.map(c => (
                            <div key={c.name} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color }} /><span style={{ fontSize: '0.85rem', color: '#374151' }}>{c.name}</span></div>
                                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a' }}>{c.pct}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#f0f7ff', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: c.color, borderRadius: '4px', width: `${c.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Bed occupancy visual */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '1.5rem' }}>Status Bed Real-Time</h2>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {Array.from({ length: BEDS.total }).map((_, i) => (
                            <div key={i} style={{ width: '28px', height: '28px', borderRadius: '4px', background: i < BEDS.occupied ? (i < BEDS.emergency ? '#fca5a5' : '#93c5fd') : '#d1fae5', border: '1px solid', borderColor: i < BEDS.occupied ? (i < BEDS.emergency ? '#b91c1c' : '#1d4ed8') : '#86efac', cursor: 'default' }} title={i < BEDS.emergency ? 'Emergency' : i < BEDS.occupied ? 'Terisi' : 'Kosong'} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.78rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#fca5a5', borderRadius: '2px' }} /> Emergency ({BEDS.emergency})</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#93c5fd', borderRadius: '2px' }} /> Terisi ({BEDS.occupied - BEDS.emergency})</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#d1fae5', borderRadius: '2px' }} /> Kosong ({BEDS.available})</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
