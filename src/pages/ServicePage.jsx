import React from 'react'
import { useParams, Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import servicesData from '../data/services.json'
import { useLanguage } from '../i18n/LanguageContext'

// Shared UI components (Simplified for this task)
const Layout = ({ children }) => (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
    </div>
)

export default function ServicePage() {
    const { slug } = useParams()
    const { isIndo } = useLanguage()
    const service = servicesData.services.find(s => s.slug === slug)

    if (!service) return (
        <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            {isIndo ? 'Layanan tidak ditemukan.' : 'Service not found.'}
        </div>
    )

    return (
        <Layout>
            <SEO
                title={service.title}
                description={service.description}
                canonical={`/services/${service.slug}`}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: isIndo ? 'Layanan' : 'Services', url: '/services/web-development' },
                    { name: service.title, url: `/services/${service.slug}` }
                ]}
                additionalSchemas={[
                    {
                        "@type": "Service",
                        "@id": `https://nurdiansyahlabs.com/services/${service.slug}#service`,
                        "name": service.title,
                        "description": service.description,
                        "provider": { "@id": "https://nurdiansyahlabs.com/#service" },
                        "areaServed": { "@type": "Country", "name": "Indonesia" },
                        "offers": {
                            "@type": "Offer",
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "priceCurrency": "IDR",
                                "description": service.price
                            }
                        }
                    }
                ]}
            />

            <header className="bg-indigo-900 text-white py-14 sm:py-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <span className="text-indigo-300 font-bold uppercase tracking-wider text-sm">{service.category}</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight break-words">{service.title}</h1>
                    {service.tagline && (
                        <p className="text-lg sm:text-xl text-indigo-200 font-medium italic mb-3">"{service.tagline}"</p>
                    )}
                    <p className="text-base sm:text-lg text-indigo-100 max-w-2xl">{service.description}</p>
                    <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto">
                        <a 
                            href={`https://wa.me/6282176012461?text=${encodeURIComponent(`Halo NurdiansyahLabs, saya tertarik konsultasi mengenai layanan ${service.title}.`)}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 sm:px-8 py-3.5 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-emerald-950/40 no-underline inline-flex items-center justify-center gap-2 min-h-[48px]"
                        >
                            <span>{isIndo ? 'Konsultasi Sekarang (WhatsApp)' : 'Start Project on WhatsApp'}</span>
                        </a>
                        <Link to="/" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-3.5 rounded-xl font-bold backdrop-blur-sm transition-all no-underline inline-flex items-center justify-center min-h-[48px]">
                            {isIndo ? 'Lihat Portofolio' : 'View Our Work'}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
                <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-xl shadow-indigo-100/50">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">
                        {isIndo ? 'Mengapa Memilih Layanan Kami?' : 'Why Choose Our Service?'}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-indigo-600">
                                {isIndo ? '✓ Berorientasi Hasil' : '✓ Results-Driven'}
                            </h3>
                            <p className="text-slate-600">
                                {isIndo
                                    ? 'Kami fokus membangun solusi digital yang mengonversi trafik menjadi pelanggan.'
                                    : 'We build digital solutions engineered to convert traffic into paying customers.'}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-indigo-600">
                                {isIndo ? '✓ Teknologi Modern' : '✓ Modern Tech Stack'}
                            </h3>
                            <p className="text-slate-600">
                                {isIndo
                                    ? 'Menggunakan tech-stack terbaru untuk performa maksimal dan keamanan tinggi.'
                                    : 'We use production-grade stacks for maximum performance and enterprise-level security.'}
                            </p>
                        </div>
                    </div>

                    {service.inclusions && service.inclusions.length > 0 && (
                        <div className="mt-10 pt-8 border-t border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                {isIndo ? 'Fitur & Layanan Termasuk:' : 'Features & Inclusions:'}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {service.inclusions.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                                        <span className="text-emerald-600 font-bold">✓</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(service.idealFor || service.estimation || service.revisions) && (
                        <div className="mt-8 pt-6 border-t border-slate-100 grid sm:grid-cols-3 gap-4">
                            {service.idealFor && (
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        {isIndo ? 'Ideal Untuk' : 'Ideal For'}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-800">{service.idealFor}</div>
                                </div>
                            )}
                            {service.estimation && (
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        {isIndo ? 'Estimasi Pengerjaan' : 'Estimated Timeline'}
                                    </div>
                                    <div className="text-sm font-semibold text-indigo-900">{service.estimation}</div>
                                </div>
                            )}
                            {service.revisions && (
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                        {isIndo ? 'Kebijakan Revisi' : 'Revision Policy'}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-800">{service.revisions}</div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-indigo-50 p-5 sm:p-6 rounded-2xl">
                            <div>
                                <span className="text-slate-500 text-sm">
                                    {isIndo ? 'Investasi' : 'Investment'}
                                </span>
                                <div className="text-2xl font-black text-indigo-950">{service.price}</div>
                            </div>
                            <Link to="/#contact" className="text-indigo-600 font-bold hover:underline">
                                {isIndo ? 'Mulai Konsultasi →' : 'Start a Consultation →'}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8 text-slate-900 px-4 sm:px-6">
                        {isIndo ? 'Layanan Lainnya' : 'Other Services'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-6 text-indigo-900">
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
