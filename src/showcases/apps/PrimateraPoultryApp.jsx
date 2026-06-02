import React, { useState, useEffect, useRef } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { ClipboardList, LayoutDashboard, Wallet, TrendingUp, TrendingDown, FileText, Scale, AlertTriangle, DollarSign, Plus, X, Package, Truck, Printer, Settings, Download, Upload, Trash2, Users, LogOut, Shield, Lock, User } from 'lucide-react';



export default function PrimateraPoultryApp() {
    const { isMobile } = useResponsive();

    // Auth State
    const [currentUser, setCurrentUser] = useState(null);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const [activeTab, setActiveTab] = useState('dashboard');

    // Core Data States
    const [records, setRecords] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [inventory, setInventory] = useState({ feed: 0, medicine: 0 });
    const [harvestRecords, setHarvestRecords] = useState([]);

    // UI states for forms
    const [showProdForm, setShowProdForm] = useState(false);
    const [showFinForm, setShowFinForm] = useState(false);
    const [showHarvestForm, setShowHarvestForm] = useState(false);

    // Form States
    const [prodData, setProdData] = useState({ date: new Date().toISOString().split('T')[0], flockId: 'KUB-A', feedConsumedKg: '', medicineUsedPcs: '', mortalityCount: '', bodyWeightGrams: '', notes: '' });
    const [finData, setFinData] = useState({ date: new Date().toISOString().split('T')[0], type: 'EXPENSE', category: 'PAKAN_KG', amount: '', quantity: '', notes: '' });
    const [basketData, setBasketData] = useState({ count: '', weightKg: '' });

    const fileInputRef = useRef(null);

    // Load Existing Data from Backend
    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/api/primatera_api.php');
                const data = await res.json();
                if (data.success) {
                    setRecords(data.records || []);
                    setTransactions(data.transactions || []);
                    setInventory(data.inventory || { feed: 0, medicine: 0 });
                }
            } catch (err) {
                console.error('Failed to fetch data from backend:', err);
            }
        };
        const savedUser = localStorage.getItem('primatera_user');
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
        loadData();
    }, []);

    // Save User Session
    useEffect(() => {
        if (currentUser) localStorage.setItem('primatera_user', JSON.stringify(currentUser));
        else localStorage.removeItem('primatera_user');
    }, [currentUser]);

    const syncToBackend = async (resource, payload, method = 'POST') => {
        try {
            await fetch(`/api/primatera_api.php?resource=${resource}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: payload ? JSON.stringify(payload) : null
            });
        } catch (err) {
            console.error(`Failed to sync ${resource}:`, err);
        }
    };

    const doLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!loginForm.username || !loginForm.password) {
            setLoginError('Username dan Password wajib diisi');
            return;
        }

        try {
            const res = await fetch('/api/primatera_auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: loginForm.username.toLowerCase().trim(),
                    password: loginForm.password
                })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setCurrentUser(data.user);
                setLoginForm({ username: '', password: '' });
                setActiveTab('dashboard');
            } else {
                setLoginError(data.message || 'Login gagal, periksa username dan password.');
            }
        } catch (err) {
            console.error('Login API error:', err);
            setLoginError('Koneksi ke server terputus. Pastikan backend berjalan dan URL benar.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleProdChange = (e) => setProdData(p => ({ ...p, [e.target.name]: e.target.value }));
    const handleFinChange = (e) => {
        const { name, value } = e.target;
        if (name === 'amount' || name === 'quantity') {
            const rawValue = value.replace(/\D/g, '');
            setFinData(p => ({ ...p, [name]: rawValue }));
        } else {
            setFinData(p => ({ ...p, [name]: value }));
        }
    };

    const handleProdSubmit = (e) => {
        e.preventDefault();
        const feedUsed = parseFloat(prodData.feedConsumedKg) || 0;
        const medUsed = parseInt(prodData.medicineUsedPcs) || 0;
        if (inventory.feed < feedUsed) {
            if (!window.confirm(`Stok pakan di gudang (${inventory.feed} Kg) tidak cukup untuk konsumsi ini (${feedUsed} Kg). Tetap simpan dan buat stok minus?`)) return;
        }

        const newRecord = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
            date: new Date(prodData.date).getTime(),
            dateString: prodData.date,
            flockId: prodData.flockId,
            feedConsumedKg: feedUsed,
            medicineUsedPcs: medUsed,
            mortalityCount: parseInt(prodData.mortalityCount) || 0,
            bodyWeightGrams: parseInt(prodData.bodyWeightGrams) || 0,
            notes: prodData.notes
        };

        setRecords([newRecord, ...records]);
        const newInv = { feed: inventory.feed - feedUsed, medicine: inventory.medicine - medUsed };
        setInventory(newInv);
        setProdData(p => ({ ...p, feedConsumedKg: '', medicineUsedPcs: '', mortalityCount: '', bodyWeightGrams: '', notes: '' }));
        setShowProdForm(false);
        syncToBackend('records', newRecord);
        syncToBackend('inventory', newInv);
        alert('Data Produksi tersimpan & Stok Gudang diperbarui!');
    };

    const handleFinSubmit = (e) => {
        e.preventDefault();
        const amountNum = parseFloat(finData.amount) || 0;
        const qtyNum = parseFloat(finData.quantity) || 0;

        let newInv = { ...inventory };
        if (finData.type === 'EXPENSE' && finData.category === 'PAKAN_KG') {
            if (qtyNum <= 0) { alert('Harap isi jumlah kuantitas barang masuk gudang!'); return; }
            newInv.feed += qtyNum;
            setInventory(newInv);
            syncToBackend('inventory', newInv);
        }
        if (finData.type === 'EXPENSE' && finData.category === 'OBAT_PCS') {
            if (qtyNum <= 0) { alert('Harap isi jumlah kuantitas barang masuk gudang!'); return; }
            newInv.medicine += qtyNum;
            setInventory(newInv);
            syncToBackend('inventory', newInv);
        }

        const newTx = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
            date: new Date(finData.date).getTime(),
            dateString: finData.date,
            type: finData.type,
            category: finData.category,
            amount: amountNum,
            quantity: qtyNum,
            notes: finData.notes
        };

        setTransactions([newTx, ...transactions]);
        syncToBackend('transactions', newTx);
        setFinData(p => ({ ...p, amount: '', quantity: '', notes: '' }));
        setShowFinForm(false);
        alert('Transaksi tersimpan & Gudang diperbarui!');
    };

    const addBasket = (e) => {
        e.preventDefault();
        if (basketData.count && basketData.weightKg) {
            setHarvestRecords([...harvestRecords, { id: Date.now(), count: parseInt(basketData.count), weightKg: parseFloat(basketData.weightKg) }]);
            setBasketData({ count: '', weightKg: '' });
        }
    };

    const finishHarvest = () => {
        const totalBirds = harvestRecords.reduce((s, b) => s + b.count, 0);
        const totalWeight = harvestRecords.reduce((s, b) => s + b.weightKg, 0);
        const avgWeight = (totalWeight / totalBirds).toFixed(2);

        const docTransaction = transactions.find(t => t.category === 'DOC');
        const initialPopulation = docTransaction ? parseInt(docTransaction.quantity || 0) : 0;
        const totalMortality = records.reduce((s, r) => s + parseInt(r.mortalityCount || 0), 0);
        const harvestCountSoFar = transactions.filter(t => t.category === 'PANEN_AYAM').reduce((s, t) => s + (t.harvestCount !== undefined ? parseInt(t.harvestCount) : (t.notes?.match(/Panen (\d+) Ekor/) ? parseInt(t.notes.match(/Panen (\d+) Ekor/)[1]) : 0)), 0);
        const remainingBirds = initialPopulation - totalMortality - harvestCountSoFar;

        if (totalBirds > remainingBirds) {
            alert(`Stok ayam hidup hanya ${remainingBirds} ekor. Tidak bisa memanen ${totalBirds} ekor.`);
            return;
        }

        const pricePerKg = prompt(`Total Panen: ${totalBirds} ekor (${totalWeight} Kg).\nMasukkan harga kesepakatan per Kg (Rp):`);
        if (pricePerKg) {
            const income = totalWeight * parseFloat(pricePerKg.replace(/\D/g, ''));
            const newTx = {
                id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
                date: new Date().getTime(),
                dateString: new Date().toISOString().split('T')[0],
                type: 'INCOME',
                category: 'PANEN_AYAM',
                amount: income,
                quantity: totalWeight,
                harvestCount: totalBirds,
                notes: `Panen ${totalBirds} Ekor. ABW: ${avgWeight} Kg. Rp${pricePerKg}/Kg`
            };
            setTransactions([newTx, ...transactions]);
            syncToBackend('transactions', newTx);
            setHarvestRecords([]);
            setShowHarvestForm(false);
            alert(`Panen selesai! Nota penjualan sebesar Rp${income.toLocaleString('id-ID')} masuk ke Keuangan.`);
        }
    };

    const delRec = (id) => { 
        if (window.confirm('Hapus record produksi ini?')) {
            setRecords(records.filter(r => r.id !== id));
            syncToBackend('records&id=' + id, null, 'DELETE');
        } 
    }
    const delTx = (id) => { 
        if (window.confirm('Hapus transaksi ini?')) {
            setTransactions(transactions.filter(t => t.id !== id));
            syncToBackend('transactions&id=' + id, null, 'DELETE');
        } 
    }
    const delBasket = (id) => setHarvestRecords(harvestRecords.filter(b => b.id !== id));

    const exportData = () => {
        const dataStr = JSON.stringify({ records, transactions, inventory });
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `primatera_backup_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.records) setRecords(data.records);
                if (data.transactions) setTransactions(data.transactions);
                if (data.inventory) setInventory(data.inventory);
                alert('Data berhasil di-restore!');
            } catch (err) {
                alert('Format file tidak valid!');
            }
        };
        reader.readAsText(file);
    };



    const totalFeed = records.reduce((s, r) => s + (parseFloat(r.feedConsumedKg) || 0), 0);
    const totalMortality = records.reduce((s, r) => s + parseInt(r.mortalityCount || 0), 0);
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    const netProfit = totalIncome - totalExpense;

    const harvestWeights = transactions.filter(t => t.category === 'PANEN_AYAM').reduce((s, t) => s + parseFloat(t.quantity || 0), 0);
    const harvestCount = transactions.filter(t => t.category === 'PANEN_AYAM').reduce((s, t) => {
        const match = t.notes && t.notes.match(/Panen (\d+) Ekor/);
        return s + (match ? parseInt(match[1]) : 0);
    }, 0);

    let estimatedFCR = 0;
    if (harvestWeights > 0 && totalFeed > 0) estimatedFCR = (totalFeed / harvestWeights).toFixed(2);

    const fmtMoney = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

    // ERP Biological KPIs
    const docTransaction = transactions.find(t => t.category === 'DOC');
    const initialPopulation = docTransaction ? parseInt(docTransaction.quantity || 0) : 0;
    const docStartDate = docTransaction ? docTransaction.date : null;

    let currentPopulation = initialPopulation - totalMortality - harvestCount;
    if (currentPopulation < 0) currentPopulation = 0;

    let depletionRate = 0;
    if (initialPopulation > 0) depletionRate = ((totalMortality / initialPopulation) * 100).toFixed(1);

    let flockAgeDays = 0;
    if (docStartDate) {
        const diffTime = Math.max(0, new Date().getTime() - docStartDate);
        flockAgeDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // =========================================================================
    // LOGIN PAGE
    // =========================================================================
    if (!currentUser) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: '"Inter", sans-serif', padding: '1rem' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '3rem 2.5rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid #f1f5f9' }}>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/Logo_Primatera.png"
                            alt="Primatera Logo"
                            style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))', mixBlendMode: 'multiply' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }}
                        />
                        <div style={{ display: 'none', fontSize: '4rem', backgroundColor: '#fef3c7', padding: '20px', borderRadius: '50%', marginBottom: '1rem' }}>🐣</div>
                    </div>

                    <h1 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: '800', fontSize: '1.8rem' }}>Welcome Back</h1>
                <p style={{ margin: '0 0 2.5rem 0', color: '#64748b', fontSize: '0.95rem' }}>Masuk ke ERP Primatera Poultry</p>

                {loginError && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fecaca' }}>
                        <AlertTriangle size={16} /> {loginError}
                    </div>
                )}

                <form onSubmit={doLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                placeholder="Masukkan username..."
                                required
                                style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc', transition: 'all 0.2s', color: '#0f172a' }}
                                onFocus={(e) => e.target.style.border = '1px solid #3b82f6'}
                                onBlur={(e) => e.target.style.border = '1px solid #cbd5e1'}
                            />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>Demo: <b>userdemo</b>, <b>nardi</b>, <b>ardiansyah</b></span>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc', transition: 'all 0.2s', color: '#0f172a' }}
                                onFocus={(e) => e.target.style.border = '1px solid #3b82f6'}
                                onBlur={(e) => e.target.style.border = '1px solid #cbd5e1'}
                            />
                        </div>
                    </div>
                    <button type="submit" style={{ marginTop: '0.5rem', backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(217, 119, 6, 0.2)' }} onMouseOver={(e) => e.target.style.backgroundColor = '#b45309'} onMouseOut={(e) => e.target.style.backgroundColor = '#d97706'}>
                        Sign In
                    </button>
                </form>
            </div>
            </div >
        );
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'records', label: 'Produksi', icon: <ClipboardList size={20} /> },
        { id: 'inventory', label: 'Gudang', icon: <Package size={20} /> },
        { id: 'finance', label: 'Keuangan', icon: <Wallet size={20} /> },
        { id: 'settings', label: 'Sistem', icon: <Settings size={20} /> },
    ];

    const isViewer = currentUser.role === 'viewer';

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: '"Inter", sans-serif', backgroundColor: '#f8fafc', overflow: 'hidden', color: '#0f172a' }}>
            {/* Sidebar / Bottom Nav */}
            {!isMobile ? (
                <div style={{ width: '250px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #e2e8f0' }}>
                        <img src="/Logo_Primatera.png" alt="Primatera Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', mixBlendMode: 'multiply' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }} />
                        <div style={{ display: 'none', fontSize: '1.8rem', backgroundColor: '#fef3c7', padding: '8px', borderRadius: '12px' }}>🐣</div>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>Primatera</h2>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>End-to-End ERP</p>
                        </div>
                    </div>
                    <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', borderRadius: '12px', border: 'none',
                                    backgroundColor: activeTab === tab.id ? '#fef3c7' : 'transparent',
                                    color: activeTab === tab.id ? '#b45309' : '#64748b',
                                    fontWeight: activeTab === tab.id ? '700' : '500',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    textAlign: 'left', fontSize: '0.95rem'
                                }}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', padding: '0 8px' }}>
                            <div style={{ backgroundColor: isViewer ? '#f1f5f9' : '#dbeafe', color: isViewer ? '#475569' : '#1d4ed8', padding: '8px', borderRadius: '50%' }}><Users size={18} /></div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>{currentUser.name}</h4>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{isViewer ? 'Read Only' : 'Mitra'}</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', width: '100%', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
                            <LogOut size={18} /> Keluar
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-around', padding: '10px 8px', borderTop: '1px solid #e2e8f0', zIndex: 100, boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                backgroundColor: 'transparent', border: 'none',
                                color: activeTab === tab.id ? '#b45309' : '#94a3b8',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                cursor: 'pointer', padding: '8px'
                            }}
                        >
                            {tab.icon}
                            <span style={{ fontSize: '0.75rem' }}>{tab.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div style={{ flex: 1, padding: isMobile ? '1.5rem' : '2.5rem', overflowY: 'auto', paddingBottom: isMobile ? '90px' : '2.5rem' }}>

                {isMobile && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ backgroundColor: isViewer ? '#f1f5f9' : '#dbeafe', color: isViewer ? '#475569' : '#1d4ed8', padding: '6px', borderRadius: '50%' }}><Users size={16} /></div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b' }}>{currentUser.name}</h4>
                                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{isViewer ? 'Read Only' : 'Mitra'}</span>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444' }}><LogOut size={18} /></button>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ backgroundColor: '#d1fae5', padding: '10px', borderRadius: '10px', color: '#059669' }}><TrendingUp size={22} /></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#f0fdf4', color: '#166534', padding: '4px 8px', borderRadius: '20px' }}>Pemasukan</span>
                                </div>
                                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>{fmtMoney(totalIncome)}</h3>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ backgroundColor: '#fee2e2', padding: '10px', borderRadius: '10px', color: '#dc2626' }}><TrendingDown size={22} /></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#fef2f2', color: '#991b1b', padding: '4px 8px', borderRadius: '20px' }}>Pengeluaran</span>
                                </div>
                                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>{fmtMoney(totalExpense)}</h3>
                            </div>
                            <div style={{ backgroundColor: netProfit >= 0 ? '#4f46e5' : '#e11d48', color: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}><DollarSign size={22} /></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '20px' }}>Laba Bersih</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>{fmtMoney(netProfit)}</h3>
                            </div>
                        </div>

                        {/* ERP BIOLOGICAL KPIs */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Umur Pemeliharaan</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>{flockAgeDays} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Hari</span></h3>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Populasi Awal (DOC)</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>{initialPopulation} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Ekor</span></h3>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Populasi Saat Ini</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>{currentPopulation} <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Ekor</span></h3>
                            </div>
                            <div style={{ backgroundColor: depletionRate > 5 ? '#fef2f2' : '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1px solid', borderColor: depletionRate > 5 ? '#fecaca' : '#bbf7d0' }}>
                                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: depletionRate > 5 ? '#991b1b' : '#166534', fontWeight: '600' }}>Deplesi (Mati)</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', color: depletionRate > 5 ? '#b91c1c' : '#15803d', fontWeight: '800' }}>{depletionRate} <span style={{ fontSize: '0.9rem' }}>%</span></h3>
                            </div>
                        </div>

                        {harvestWeights > 0 && (
                            <div style={{ backgroundColor: '#f0fdfa', padding: '1.25rem', borderRadius: '16px', border: '1px solid #ccfbf1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ backgroundColor: '#14b8a6', color: '#fff', padding: '12px', borderRadius: '12px' }}><Scale size={20} /></div>
                                <div><p style={{ margin: '0 0 2px 0', fontSize: '0.85rem', color: '#0f766e', fontWeight: '600' }}>Performa FCR (Feed Conversion Ratio) Aktual</p><h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#115e59' }}>{estimatedFCR}</h4></div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', backgroundColor: '#fff', borderRadius: '20px', color: '#0f766e', fontWeight: '600' }}>Target: &lt; 1.6</span>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '12px' }}><Scale size={20} /></div>
                                <div><p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', color: '#64748b' }}>Pakan Terpakai</p><h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{totalFeed.toFixed(1)} Kg</h4></div>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '12px' }}><AlertTriangle size={20} /></div>
                                <div><p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', color: '#64748b' }}>Ayam Mati</p><h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>{totalMortality} Ekor</h4></div>
                            </div>
                            <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '12px' }}><Package size={20} /></div>
                                <div><p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', color: '#64748b' }}>Sisa Pakan Gudang</p><h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: inventory.feed <= 50 ? '#dc2626' : '#0f172a' }}>{inventory.feed} Kg</h4></div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'inventory' && (
                    <div>
                        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={20} color="#059669" /> Stok Pakan (Gudang)</h3>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: inventory.feed <= 50 ? '#dc2626' : '#0f172a' }}>
                                    {inventory.feed.toFixed(1)} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>Kg</span>
                                </div>
                                {inventory.feed <= 50 && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '8px 0 0 0' }}>⚠️ Peringatan: Stok menipis, pertimbangkan restock.</p>}
                            </div>
                            <div style={{ flex: 1, minWidth: '200px', borderLeft: isMobile ? 'none' : '1px solid #e2e8f0', paddingTop: isMobile ? '1rem' : 0, paddingLeft: isMobile ? 0 : '2rem' }}>
                                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} color="#2563eb" /> Stok Obat/Vaksin</h3>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>
                                    {inventory.medicine} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>Pcs</span>
                                </div>
                            </div>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>💡 <b>Cara kerja Auto-Deduction:</b> Pembelian pakan di menu Keuangan akan otomatis menambah stok Gudang. Pemakaian pakan harian di menu Produksi otomatis memotong stok Gudang.</p>
                    </div>
                )}

                {activeTab === 'records' && (
                    <div>
                        {!isViewer && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                <button onClick={() => setShowProdForm(!showProdForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: showProdForm ? '#f1f5f9' : '#d97706', color: showProdForm ? '#475569' : '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    {showProdForm ? <><X size={18} /> Batal</> : <><Plus size={18} /> Isi Kartu Kandang</>}
                                </button>
                            </div>
                        )}

                        {showProdForm && !isViewer && (
                            <div style={{ backgroundColor: '#ffffff', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Kartu Kandang Digital</h3>
                                <form onSubmit={handleProdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ flex: '1 1 200px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Tanggal</label>
                                            <input type="date" name="date" value={prodData.date} onChange={handleProdChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                                        </div>
                                        <div style={{ flex: '1 1 200px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Kandang</label>
                                            <select name="flockId" value={prodData.flockId} onChange={handleProdChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}>
                                                <option value="KUB-A">KUB - A</option><option value="KUB-B">KUB - B</option>
                                                <option value="JOPER-A">Joper - A</option><option value="JOPER-B">Joper - B</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ flex: '1 1 150px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Pakan Habis (Kg)</label>
                                            <input type="number" step="0.1" name="feedConsumedKg" value={prodData.feedConsumedKg} onChange={handleProdChange} placeholder="Misal: 25.5" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Stok Gudang: {inventory.feed} Kg</span>
                                        </div>
                                        <div style={{ flex: '1 1 150px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Ayam Mati (Ekor)</label>
                                            <input type="number" name="mortalityCount" value={prodData.mortalityCount} onChange={handleProdChange} placeholder="2" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                                        </div>
                                        <div style={{ flex: '1 1 150px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Obat/Vaksin (Pcs)</label>
                                            <input type="number" name="medicineUsedPcs" value={prodData.medicineUsedPcs} onChange={handleProdChange} placeholder="0" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                                        </div>
                                        <div style={{ flex: '1 1 150px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#2563eb' }}>Sampling BW (Gram) - <i>Opsional</i></label>
                                            <input type="number" name="bodyWeightGrams" value={prodData.bodyWeightGrams} onChange={handleProdChange} placeholder="Misal: 450" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #93c5fd', backgroundColor: '#eff6ff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Catatan Cuaca / Obat</label>
                                        <textarea name="notes" value={prodData.notes} onChange={handleProdChange} placeholder="Ayam diberi vitamin pagi hari..." rows="2" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}></textarea>
                                    </div>
                                    <button type="submit" style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>Simpan Kartu Kandang</button>
                                </form>
                            </div>
                        )}

                        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                            {records.length === 0 ? (
                                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                    <FileText size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>Data Produksi Kosong</h3>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <tr>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Tanggal</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Kandang</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Pakan</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Kematian</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Obat</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#2563eb', fontSize: '0.9rem' }}>ABW</th>
                                                {!isViewer && <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Aksi</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.map((rec, i) => (
                                                <tr key={rec.id} style={{ borderBottom: i === records.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#334155' }}>{rec.dateString}</td>
                                                    <td style={{ padding: '16px' }}><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>{rec.flockId}</span></td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>{rec.feedConsumedKg} Kg</td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: rec.mortalityCount > 0 ? '#dc2626' : '#059669', fontWeight: '600' }}>{rec.mortalityCount}</td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#334155' }}>{rec.medicineUsedPcs ? `${rec.medicineUsedPcs} Pcs` : '-'}</td>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#2563eb', fontWeight: '700' }}>{rec.bodyWeightGrams ? `${rec.bodyWeightGrams}g` : '-'}</td>
                                                    {!isViewer && (
                                                        <td style={{ padding: '16px' }}>
                                                            <button onClick={() => delRec(rec.id)} style={{ color: '#ef4444', background: 'none', border: '1px solid #fee2e2', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Hapus</button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div>
                        {!isViewer && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <button onClick={() => setShowHarvestForm(!showHarvestForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: showHarvestForm ? '#f1f5f9' : '#059669', color: showHarvestForm ? '#475569' : '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    {showHarvestForm ? <><X size={18} /> Batal Panen</> : <><Truck size={18} /> Kalkulator Panen</>}
                                </button>
                                <button onClick={() => setShowFinForm(!showFinForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: showFinForm ? '#f1f5f9' : '#0f172a', color: showFinForm ? '#475569' : '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    {showFinForm ? <><X size={18} /> Batal</> : <><Plus size={18} /> Tambah Transaksi</>}
                                </button>
                            </div>
                        )}

                        {showHarvestForm && !isViewer && (
                            <div style={{ backgroundColor: '#ffffff', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', border: '2px dashed #10b981', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, color: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={24} /> Kalkulator Timbang Panen</h3>
                                </div>
                                <form onSubmit={addBasket} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 120px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Jumlah (Ekor)</label>
                                        <input type="number" value={basketData.count} onChange={(e) => setBasketData({ ...basketData, count: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }} />
                                    </div>
                                    <div style={{ flex: '1 1 120px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Berat (Kg)</label>
                                        <input type="number" step="0.01" value={basketData.weightKg} onChange={(e) => setBasketData({ ...basketData, weightKg: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }} />
                                    </div>
                                    <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>+ Keranjang</button>
                                </form>

                                {harvestRecords.length > 0 && (
                                    <>
                                        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                            {harvestRecords.map((b, idx) => (
                                                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                                    <span style={{ fontWeight: '600', color: '#475569' }}>Keranjang {idx + 1}: {b.count} Ekor, {b.weightKg} Kg</span>
                                                    <button onClick={() => delBasket(b.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#065f46' }}>Total: <b>{harvestRecords.reduce((s, b) => s + b.count, 0)} Ekor</b> | <b>{harvestRecords.reduce((s, b) => s + b.weightKg, 0).toFixed(2)} Kg</b></p>
                                            </div>
                                            <button onClick={finishHarvest} style={{ padding: '10px 20px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Printer size={18} /> Generate Nota</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {showFinForm && !isViewer && (
                            <div style={{ backgroundColor: '#ffffff', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>Form Transaksi Keuangan</h3>
                                <form onSubmit={handleFinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ flex: '1 1 200px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Tanggal Transaksi</label>
                                            <input type="date" name="date" value={finData.date} onChange={handleFinChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
                                        </div>
                                        <div style={{ flex: '1 1 200px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Tipe</label>
                                            <select name="type" value={finData.type} onChange={handleFinChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', fontWeight: '700', color: finData.type === 'INCOME' ? '#059669' : '#dc2626' }}>
                                                <option value="INCOME">Pemasukan (+)</option>
                                                <option value="EXPENSE">Pengeluaran (-)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ flex: '1 1 200px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Kategori</label>
                                            <select name="category" value={finData.category} onChange={handleFinChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}>
                                                {finData.type === 'INCOME' ? (
                                                    <><option value="PANEN_AYAM">Panen Ayam</option><option value="TELUR">Penjualan Telur</option><option value="LAINNYA">Lainnya</option></>
                                                ) : (
                                                    <><option value="PAKAN_KG">Beli Pakan (Otomatis +Stok)</option><option value="OBAT_PCS">Obat/Vaksin (Otomatis +Stok)</option><option value="DOC">Beli DOC / Bibit</option><option value="OPERASIONAL">Operasional/Gaji</option></>
                                                )}
                                            </select>
                                        </div>
                                        {(finData.type === 'EXPENSE' && (finData.category === 'PAKAN_KG' || finData.category === 'OBAT_PCS')) && (
                                            <div style={{ flex: '1 1 100px' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#059669' }}>Qty Barang Masuk</label>
                                                <input type="text" inputMode="numeric" name="quantity" value={finData.quantity} onChange={handleFinChange} placeholder="Misal: 50" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0', backgroundColor: '#f0fdf4', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontWeight: '800' }} />
                                            </div>
                                        )}
                                        <div style={{ flex: '1 1 200px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Jumlah (Rp)</label>
                                            <input type="text" inputMode="numeric" name="amount" value={finData.amount ? 'Rp' + parseInt(finData.amount, 10).toLocaleString('id-ID') : ''} onChange={handleFinChange} placeholder="Rp500.000" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontWeight: '800' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Keterangan</label>
                                        <textarea name="notes" value={finData.notes} onChange={handleFinChange} placeholder="Contoh: Beli pakan..." rows="2" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}></textarea>
                                    </div>
                                    <button type="submit" style={{ backgroundColor: finData.type === 'INCOME' ? '#059669' : '#dc2626', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                                        Simpan Transaksi
                                    </button>
                                </form>
                            </div>
                        )}

                        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                            {transactions.length === 0 ? (
                                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                    <Wallet size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>Buku Kas Kosong</h3>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <tr>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Tanggal</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Kategori</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Nominal</th>
                                                <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Keterangan</th>
                                                {!isViewer && <th style={{ padding: '16px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Aksi</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((tx, i) => (
                                                <tr key={tx.id} style={{ borderBottom: i === transactions.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#334155' }}>{tx.dateString}</td>
                                                    <td style={{ padding: '16px' }}><span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>{tx.category.replace('_KG', '').replace('_PCS', '')}</span></td>
                                                    <td style={{ padding: '16px', fontSize: '0.95rem', color: tx.type === 'INCOME' ? '#059669' : '#dc2626', fontWeight: '700' }}>
                                                        {tx.type === 'INCOME' ? '+' : '-'}{fmtMoney(tx.amount)}
                                                    </td>
                                                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.notes || '-'}</td>
                                                    {!isViewer && (
                                                        <td style={{ padding: '16px' }}>
                                                            <button onClick={() => delTx(tx.id)} style={{ color: '#ef4444', background: 'none', border: '1px solid #fee2e2', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Hapus</button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={20} /> Pengaturan Sistem & Data</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Backup Data Lokal</h4>
                                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>Unduh seluruh riwayat ke format JSON.</p>
                                    <button onClick={exportData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                                        <Download size={18} /> Export JSON
                                    </button>
                                </div>

                                {!isViewer && (
                                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Restore Data</h4>
                                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>Pulihkan data dari JSON.</p>
                                        <input type="file" accept=".json" ref={fileInputRef} onChange={importData} style={{ display: 'none' }} />
                                        <button onClick={() => fileInputRef.current.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                                            <Upload size={18} /> Import JSON
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                )}
            </div>
        </div>
    );
}
