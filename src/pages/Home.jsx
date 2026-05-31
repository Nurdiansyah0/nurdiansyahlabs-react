import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyUs from '../components/WhyUs'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import SEO from '../components/seo/SEO'

export default function Home() {
    return (
        <>
            <SEO
                title="Jasa Landing Page & Web Developer Profesional Indonesia"
                description="Jasa pembuatan landing page, web developer fullstack, analisis data bisnis, dan data science terpercaya di Indonesia. Solusi digital terintegrasi untuk UMKM dan startup."
                canonical="/"
            />
            <Navbar />
            <main>
            <Hero />
            <Services />
            <WhyUs />
            <CTA />
            </main>
            <Footer />
        </>
    )
}
