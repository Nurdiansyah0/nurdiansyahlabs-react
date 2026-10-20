import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FlagshipShowcase from '../components/FlagshipShowcase'
import Services from '../components/Services'
import WhyUs from '../components/WhyUs'
import LatestBlogs from '../components/LatestBlogs'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import SEO from '../components/seo/SEO'

export default function Home() {
    return (
        <>
            <SEO
                title="Konsultan Website & Jasa Software Enterprise | NurdiansyahLabs"
                description="Konsultan website dan jasa rekayasa software enterprise di Indonesia. Solusi end-to-end full SDLC dari arsitektur aplikasi web, custom ERP, hingga deployment produksi."
                canonical="/"
            />
            <Navbar />
            <div className="homepage-wrapper">
                <Hero />
                <FlagshipShowcase />
                <Services />
                <WhyUs />
                <LatestBlogs />
                <CTA />
            </div>
            <Footer />
        </>
    )
}
