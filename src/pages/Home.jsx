import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyUs from '../components/WhyUs'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Services />
            <WhyUs />
            <CTA />
            <Footer />
        </>
    )
}
