import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { CheckCircle, ArrowRight, Activity, Code, BarChart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/seo/SEO'
import programmaticData from '../data/programmatic-seo.json'

export default function IndustryServicePage() {
    const { industrySlug } = useParams()
    
    const industryData = programmaticData.industries.find(ind => ind.slug === industrySlug)
    
    // Fallback if URL is manipulated
    if (!industryData) {
        return (
            <>
                <Navbar />
                <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
                    <h1>Industri tidak ditemukan.</h1>
                    <Link to="/service" style={{ color: '#312e81', textDecoration: 'underline' }}>Kembali ke Layanan</Link>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <SEO 
                title={`Jasa Website & Data untuk ${industryData.name}`}
                description={industryData.heroDesc}
                canonical={`/layanan/industri/${industrySlug}`}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Layanan', url: '/service' },
                    { name: industryData.name, url: `/layanan/industri/${industrySlug}` }
                ]}
            />
            <Navbar />
            
            <main style={{ flex: 1, paddingTop: '80px' }}>
                {/* Hero Section */}
                <section style={{ 
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 
                    color: '#fff', 
                    padding: '5rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                            SOLUSI DIGITAL KHUSUS {industryData.name.toUpperCase()}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>
                            {industryData.heroTitle}
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#c7d2fe', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            {industryData.heroDesc}
                        </p>
                        <a href="https://wa.me/6282176012461" target="_blank" rel="noreferrer" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#166534', color: '#fff', padding: '14px 28px', 
                            borderRadius: '99px', fontWeight: 700, textDecoration: 'none',
                            boxShadow: '0 8px 20px rgba(22, 101, 52, 0.4)', transition: 'transform 0.2s'
                        }}>
                            Konsultasi Gratis <ArrowRight size={18} />
                        </a>
                    </div>
                </section>

                {/* Problem / Solution Section */}
                <section style={{ padding: '5rem 2rem' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '1rem' }}>Tantangan Industri Anda</h2>
                            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.05rem', background: '#fee2e2', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
                                {industryData.painPoint}
                            </p>
                        </m.div>
                        <m.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '1rem' }}>Solusi NurdiansyahLabs</h2>
                            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.05rem', background: '#dcfce7', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #22c55e' }}>
                                {industryData.solution}
                            </p>
                        </m.div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section style={{ padding: '4rem 2rem', background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#1e293b', marginBottom: '3rem' }}>
                            Kenapa {industryData.name} Memilih Kami?
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {industryData.benefits.map((benefit, i) => (
                                <m.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} 
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <CheckCircle color="#2563eb" size={24} style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>{benefit}</span>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Cross-link to actual services */}
                <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                    <p style={{ color: '#64748b', marginBottom: '1rem' }}>Fokus Teknologi Utama:</p>
                    <h3 style={{ fontSize: '1.5rem', color: '#312e81', marginBottom: '2rem' }}>{industryData.serviceHighlight}</h3>
                    <Link to="/service" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid #2563eb', paddingBottom: '2px' }}>
                        Lihat Daftar Lengkap Layanan & Harga Kami &rarr;
                    </Link>
                </section>

            </main>
            <Footer />
        </div>
    )
}
