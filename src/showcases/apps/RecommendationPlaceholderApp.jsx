import React from 'react';
import { PackageSearch, ArrowRight } from 'lucide-react';

export default function RecommendationPlaceholderApp() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-rose-200/50 border-4 border-white">
                <PackageSearch size={48} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Product Recommendation Engine</h1>
            <p className="text-lg text-slate-500 max-w-xl mb-8 leading-relaxed font-medium">
                Sistem rekomendasi AI cerdas menggunakan Collaborative Filtering sedang dalam tahap pengembangan (Under Construction). 
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => window.history.back()}>
                <ArrowRight className="rotate-180" size={18} /> Kembali ke Portofolio
            </div>
        </div>
    );
}
