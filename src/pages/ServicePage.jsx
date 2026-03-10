import React from 'react'
import { useParams, Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import servicesData from '../data/services.json'

// Shared UI components (Simplified for this task)
const Layout = ({ children }) => <div className="min-h-screen bg-slate-50">{children}</div>

export default function ServicePage() {
    const { slug } = useParams()
    const service = servicesData.services.find(s => s.slug === slug)

    if (!service) return <div>Service not found</div>

    return (
        <Layout>
            <SEO
                title={service.title}
                description={service.description}
                canonical={`/services/${service.slug}`}
            />

            <header className="bg-indigo-900 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <span className="text-indigo-300 font-bold uppercase tracking-wider text-sm">{service.category}</span>
                    <h1 className="text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight">{service.title}</h1>
                    <p className="text-xl text-indigo-100 max-w-2xl">{service.description}</p>
                    <div className="mt-8 flex gap-4">
                        <a href="https://wa.me/6282176012461" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105">
                            Konsultasi Sekarang
                        </a>
                        <Link to="/" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold backdrop-blur-sm transition-all">
                            Lihat Portofolio
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-16 px-6">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-indigo-100/50">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Mengapa Memilih Layanan Kami?</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-indigo-600">✓ Berorientasi Hasil</h3>
                            <p className="text-slate-600">Kami tidak hanya membangun website, kami membangun solusi bisnis yang mengonversi pengunjung menjadi pelanggan.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-indigo-600">✓ Teknologi Modern</h3>
                            <p className="text-slate-600">Pengerjaan dengan stack teknologi terbaru untuk memastikan performa maksimal dan keamanan tingkat tinggi.</p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex justify-between items-center bg-indigo-50 p-6 rounded-2xl">
                            <div>
                                <span className="text-slate-500 text-sm">Investasi</span>
                                <div className="text-2xl font-black text-indigo-950">{service.price}</div>
                            </div>
                            <Link to="/contact" className="text-indigo-600 font-bold hover:underline">Detail Biaya →</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8 text-slate-900 px-6">Layanan Lainnya</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 text-indigo-900">
                        {servicesData.services.filter(s => s.slug !== slug).map(rel => (
                            <Link key={rel.slug} to={`/services/${rel.slug}`} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all no-underline">
                                <div className="font-bold text-lg mb-2">{rel.title}</div>
                                <div className="text-slate-500 text-sm line-clamp-2">{rel.description}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </Layout>
    )
}
