import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'

/* ================================================================
   TOKO BATIK NUSANTARA – E-Commerce Landing Page
   ================================================================ */
function TokoBatik() {
    const [cartCount, setCartCount] = useState(0)
    const [heroImageIndex, setHeroImageIndex] = useState(0)

    // Authentic local Batik images
    const heroImages = [
        "/assets/projects/batik/hero1.jpg",
        "/assets/projects/batik/hero2.jpg"
    ]

    const products = [
        { name: 'Kemeja Batik Pria Klasik', price: 'Rp 450.000', img: '/assets/projects/batik/prod1.jpg' },
        { name: 'Kemeja Batik Lengan Pendek', price: 'Rp 380.000', img: '/assets/projects/batik/prod2.jpg' },
        { name: 'Hem Batik Modern', price: 'Rp 420.000', img: '/assets/projects/batik/prod3.jpg' },
        { name: 'Kemeja Batik Coklat', price: 'Rp 450.000', img: '/assets/projects/batik/prod4.jpg' },
        { name: 'Dress Batik Wanita', price: 'Rp 650.000', img: '/assets/projects/batik/prod5.jpg' },
        { name: 'Atasan Batik Sutra', price: 'Rp 850.000', img: '/assets/projects/batik/prod6.jpg' },
        { name: 'Blouse Batik Kasual', price: 'Rp 350.000', img: '/assets/projects/batik/prod7.jpg' },
        { name: 'Dress Batik Cantik', price: 'Rp 550.000', img: '/assets/projects/batik/prod8.jpg' },
    ]

    const handleAddToCart = () => {
        setCartCount(prev => prev + 1)
    }

    const nextHero = () => setHeroImageIndex((prev) => (prev + 1) % heroImages.length)
    const prevHero = () => setHeroImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)

    return (
        <div style={{ fontFamily: '"Inter", sans-serif', background: '#f5f5f5', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '1440px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>

                {/* Browser Window Header */}
                <div style={{ background: '#f6f6f6', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e5e5e5' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ed6a5e' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f4bf4f' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#61c554' }}></div>
                </div>

                {/* Dark Navy Top Bar */}
                <div style={{ background: '#1c2e4a', color: '#fff', fontSize: '0.75rem', padding: '8px 2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '100px' }}></div>
                    <div style={{ fontFamily: '"Playfair Display", serif' }}>Batik modern indonesia</div>
                    <div style={{ width: '100px', textAlign: 'right' }}>Free account</div>
                </div>

                {/* Main Navbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}>
                        <i className="fas fa-bars" style={{ fontSize: '1.2rem', color: '#333' }}></i>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Menu</span>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '1.8rem', fontFamily: '"Playfair Display", serif', color: '#111', lineHeight: '1' }}>BATIK MODERN</div>
                        <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: '#666', marginTop: '4px' }}>INDONESIA</div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1.2rem', color: '#333', alignItems: 'center', flex: 1, justifyItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <i className="far fa-user" style={{ cursor: 'pointer' }}></i>
                        <i className="far fa-heart" style={{ cursor: 'pointer' }}></i>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <i className="fas fa-shopping-bag"></i>
                            {cartCount > 0 && (
                                <div style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#d4af37', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                                    {cartCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sub Navbar */}
                <div style={{ borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 3rem' }}>
                    <div style={{ width: '24px' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>
                        <div style={{ background: '#c19a5b', color: '#fff', padding: '12px 24px', cursor: 'pointer' }}>Home</div>
                        <div style={{ padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Products <i className="fas fa-chevron-down" style={{ fontSize: '0.6rem' }}></i></div>
                        <div style={{ padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Shipping <i className="fas fa-chevron-down" style={{ fontSize: '0.6rem' }}></i></div>
                        <div style={{ padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Collection <i className="fas fa-chevron-down" style={{ fontSize: '0.6rem' }}></i></div>
                        <div style={{ padding: '12px 24px', cursor: 'pointer' }}>Contact</div>
                    </div>
                    <div>
                        <i className="fas fa-search" style={{ color: '#666', cursor: 'pointer' }}></i>
                    </div>
                </div>

                {/* Hero section */}
                <div style={{ background: '#e0e4e5', width: '100%', minHeight: '500px', display: 'flex', alignItems: 'center', position: 'relative', padding: '0 5rem' }}>
                    <div onClick={prevHero} style={{ position: 'absolute', left: '2rem', cursor: 'pointer', color: '#fff', opacity: 0.8, fontSize: '1.5rem', mixBlendMode: 'difference' }}><i className="fas fa-chevron-left"></i></div>
                    <div onClick={nextHero} style={{ position: 'absolute', right: '2rem', cursor: 'pointer', color: '#fff', opacity: 0.8, fontSize: '1.5rem', mixBlendMode: 'difference' }}><i className="fas fa-chevron-right"></i></div>

                    <div style={{ zIndex: 10, flex: 1, paddingLeft: '5rem' }}>
                        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '3.5rem', fontWeight: 400, color: '#111', lineHeight: 1.1, margin: '0 0 1rem 0' }}>
                            LUXURY BATIK<br />
                            COLLECTIONS –<br />
                            HANDCRAFTED<br />
                            ELEGANCE
                        </h1>
                        <p style={{ color: '#333', fontSize: '1rem', marginBottom: '2.5rem', fontWeight: 500 }}>
                            Luxury batik collections - handcrafted elegance
                        </p>
                        <button style={{ background: '#1c2e4a', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.05em' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#0f172a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#1c2e4a'}>
                            Shop Now
                        </button>
                    </div>

                    <div style={{ flex: 1, height: '500px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <img src={heroImages[heroImageIndex]} alt="Batik Model" style={{ height: '120%', objectFit: 'contain', transform: 'translateY(5%)', mixBlendMode: 'multiply' }} />
                    </div>
                </div>

                {/* Products Grid */}
                <div style={{ padding: '5rem', background: '#fff' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        {products.map((p, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ background: '#f5f5f5', width: '100%', height: '350px', marginBottom: '1.2rem', overflow: 'hidden' }}>
                                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                                </div>
                                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', color: '#111', lineHeight: '1.4', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    {p.name.split(' - ')[0]}<br />{p.name.split(' - ')[1] || ''}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1.2rem', fontWeight: 500 }}>{p.price}</div>
                                <button
                                    onClick={handleAddToCart}
                                    style={{ background: '#1c2e4a', color: '#fff', border: 'none', padding: '10px', fontSize: '0.8rem', fontWeight: 500, width: '120px', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#0f172a'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#1c2e4a'}>
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

/* ================================================================
   CONSULTANT PORTFOLIO SITE – Personal Brand
   ================================================================ */
function ConsultantPortfolio() {
    return (
        <div style={{ background: '#1a1f26', color: '#fff', fontFamily: '"Inter", sans-serif', minHeight: '100vh', padding: '0 4rem' }}>
            {/* Top Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ letterSpacing: '0.1em', fontWeight: 300, fontSize: '0.9rem' }}>NURDIANSYAH</div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#a1a1aa' }}>
                    <span style={{ color: '#fff' }}>Home</span>
                    <span>About</span>
                    <span>Case Studies</span>
                    <span>Contact</span>
                    <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '4px 16px', fontSize: '0.7rem' }}>Book a Call</button>
                </div>
            </div>

            {/* Hero */}
            <div style={{ display: 'flex', height: '400px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.2, margin: '0 0 2rem', color: '#e4e4e7' }}>
                        NURDIANSYAH |<br />
                        <span style={{ color: '#a1a1aa' }}>STRATEGIC SOLUTIONS</span>
                    </h1>
                    <button style={{ background: '#b48a5b', color: '#fff', border: 'none', padding: '12px 24px', width: 'fit-content', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                        LEARN MORE
                    </button>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                    {/* Simulated person image */}
                    <div style={{ width: '300px', height: '350px', background: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop) center/cover', borderTopLeftRadius: '140px', borderTopRightRadius: '140px' }} />
                </div>
            </div>

            {/* Services */}
            <div style={{ padding: '4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', fontWeight: 400, marginBottom: '3rem' }}>SERVICES</h2>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {[
                        { icon: '⚙️', title: 'Process Mapping', desc: 'Identify bottlenecks and streamline workflows for maximum efficiency.' },
                        { icon: '💰', title: 'Strategic Solution', desc: 'Comprehensive financial strategies to unlock sustainable business growth.' },
                        { icon: '💼', title: 'Consultant Value', desc: 'Expert advisory on market positioning and competitive advantages.' },
                        { icon: '📈', title: 'Marketing Solutions', desc: 'Data-driven marketing campaigns to increase ROAS and brand equity.' }
                    ].map(s => (
                        <div key={s.title} style={{ flex: 1 }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#b48a5b', filter: 'sepia(1)' }}>{s.icon}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e4e4e7' }}>{s.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#71717a', lineHeight: 1.6 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Case Studies & Contact split */}
            <div style={{ display: 'flex', padding: '4rem 0' }}>
                <div style={{ flex: 2, paddingRight: '4rem', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', fontWeight: 400, marginBottom: '3rem' }}>CASE STUDIES</h2>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ flex: 1 }}>
                                <div style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#a1a1aa' }}>📄</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e4e4e7' }}>Case Studie {i}</div>
                                <div style={{ fontSize: '0.75rem', color: '#71717a', lineHeight: 1.6, marginBottom: '1rem' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</div>
                                <a href="#" style={{ fontSize: '0.75rem', color: '#b48a5b', textDecoration: 'none' }}>Learn more ›</a>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ flex: 1, paddingLeft: '4rem' }}>
                    <h2 style={{ fontSize: '1rem', letterSpacing: '0.1em', fontWeight: 400, marginBottom: '3rem' }}>CONTACT</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.8rem', color: '#e4e4e7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><i className="fas fa-phone" style={{ color: '#71717a' }}></i> 012 453 6789</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><i className="fas fa-envelope" style={{ color: '#71717a' }}></i> Email</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><i className="fas fa-map-marker-alt" style={{ color: '#71717a' }}></i> info@example.com</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><i className="fas fa-globe" style={{ color: '#71717a' }}></i> www.nurdiansyah.com</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   WARUNG MAKAN BU SARI – F&B Landing Page
   ================================================================ */
function WarungMakan() {
    return (
        <div style={{ background: '#f5cd4f', fontFamily: '"Inter", sans-serif', minHeight: '100vh', overflow: 'hidden' }}>
            <div style={{ maxWidth: '1200px', background: '#e3512a', borderRadius: '24px', margin: '2rem auto', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>

                {/* Header Navbar */}
                <div style={{ background: '#84954a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem', color: '#fff' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.05em' }}>SAPORI & SOLE</div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', fontWeight: 500 }}>
                        <span style={{ borderBottom: '2px solid #fff', paddingBottom: '2px' }}>Home</span>
                        <span style={{ opacity: 0.8 }}>About</span>
                        <span style={{ opacity: 0.8 }}>Photos</span>
                        <span style={{ opacity: 0.8 }}>News</span>
                        <span style={{ opacity: 0.8 }}>Contact</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1.1rem' }}>
                        <i className="fas fa-search"></i>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-shopping-cart"></i>
                            <div style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#e3512a', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '50%', fontWeight: 800 }}>0</div>
                        </div>
                    </div>
                </div>

                {/* Hero section */}
                <div style={{ display: 'flex', position: 'relative' }}>
                    {/* Left huge pizza */}
                    <div style={{ flex: 1.2, background: '#1c2125', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden', position: 'relative', minHeight: '400px' }}>
                        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&fit=crop" style={{ width: '130%', objectFit: 'cover', transform: 'translateX(-15%) scale(1.1)' }} alt="Pizza" />
                    </div>
                    {/* Right pasta/salads */}
                    <div style={{ flex: 0.8, background: '#84954a', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                            <img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Pasta1" />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                            <img src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Pasta2" />
                        </div>
                    </div>
                    {/* Floating Hero Text */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: '2rem 4rem', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
                        <h1 style={{ color: '#fff', fontSize: '3.5rem', fontWeight: 800, margin: '0 0 1rem', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>SAPORI & SOLE</h1>
                        <button style={{ background: '#db6c3b', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '30px', fontWeight: 800, letterSpacing: '0.05em', cursor: 'pointer', boxShadow: '0 4px 15px rgba(219,108,59,0.4)', textTransform: 'uppercase' }}>Order Now</button>
                    </div>
                </div>

                {/* Popular Categories */}
                <div style={{ display: 'flex', background: '#f5cd4f' }}>
                    <div style={{ flex: 1, background: '#e3512a', padding: '3rem 3rem 4rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.8rem', margin: '0 0 2rem' }}>Popular Categories</h2>
                        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', paddingBottom: '1rem', width: '90%' }}>
                            <img src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&fit=crop" style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt="Pizza Cat" />
                            <div style={{ background: '#e3512a', color: '#fff', textAlign: 'center', padding: '10px', width: '80%', margin: '-20px auto 0', borderRadius: '10px', position: 'relative', fontWeight: 700 }}>Pizza</div>
                        </div>
                    </div>

                    <div style={{ flex: 3, background: '#84954a', padding: '3rem 2rem 4rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
                        {[
                            { name: 'Pasta', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&fit=crop', bg: '#84954a' },
                            { name: 'Salads', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&fit=crop', bg: '#84954a' },
                            { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&fit=crop', bg: '#84954a' },
                        ].map(c => (
                            <div key={c.name} style={{ flex: 1, background: '#fff', borderRadius: '16px', overflow: 'hidden', paddingBottom: '1rem' }}>
                                <img src={c.img} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt={c.name} />
                                <div style={{ background: c.bg, color: '#fff', textAlign: 'center', padding: '10px', width: '80%', margin: '-20px auto 0', borderRadius: '10px', position: 'relative', fontWeight: 700 }}>{c.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

/* ================================================================
   SALON CANTIK PRO – Beauty & Wellness
   ================================================================ */
function SalonCantik() {
    return (
        <div style={{ background: '#ebdcd9', fontFamily: '"Playfair Display", serif', minHeight: '100vh', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#fcfbf9', maxWidth: '1000px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>

                {/* Gold top trim */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 3rem 0' }}>
                    <div style={{ background: 'linear-gradient(90deg, #d4af37, #f3e5ab)', height: '20px', width: '250px' }}></div>
                </div>

                {/* Navbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 3rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 500, color: '#555' }}>
                        <span>Home</span> <span>About Us</span> <span>Blog</span> <span>Contact</span>
                    </div>
                    <div style={{ fontSize: '2rem', letterSpacing: '0.1em' }}>ÉCLAT</div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                        <span>Log In</span>
                        <div style={{ background: 'linear-gradient(90deg, #d4af37, #c19b26)', color: '#fff', padding: '8px 20px', borderRadius: '2px' }}>Book Now</div>
                    </div>
                </div>

                {/* Hero */}
                <div style={{ height: '400px', background: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&fit=crop) center/cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <div style={{ background: 'rgba(252,251,249,0.85)', padding: '2rem 4rem', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                        <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '1rem', color: '#555' }}>- ÉCLAT SALON & SPA -</div>
                        <h1 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem', fontWeight: 400 }}>Book Your Moment of Grace</h1>
                        <button style={{ background: 'linear-gradient(135deg, #d4af37, #b2881b)', color: '#fff', border: 'none', padding: '12px 32px', fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer' }}>EXPLORE SERVICES</button>
                    </div>
                </div>

                {/* Mid section: split */}
                <div style={{ display: 'flex' }}>
                    {/* Left: Services List */}
                    <div style={{ flex: 1, padding: '4rem 3rem', background: '#f5efec' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.1em', marginBottom: '1rem' }}>OUR SERVICES</h2>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginBottom: '3rem', fontFamily: '"Inter", sans-serif' }}>Our beauty salon provides comprehensive treatments<br />tailored to your unique needs.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            {[
                                { title: 'Skin Care', desc: 'Luxury facial treatments tailored to your skin type.' },
                                { title: 'Beauty Basic', desc: 'Essential beauty routines for every day.' },
                                { title: 'Advanced Treatment', desc: 'Microdermabrasion and chemical peels.' },
                                { title: 'Body Styling', desc: 'Relaxing massages and body contouring.' }
                            ].map(s => (
                                <div key={s.title}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: '0.5rem', color: '#333' }}>{s.title}</h3>
                                    <p style={{ fontSize: '0.75rem', color: '#777', fontFamily: '"Inter", sans-serif', lineHeight: 1.5, marginBottom: '10px' }}>{s.desc}</p>
                                    <span style={{ fontSize: '0.7rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>Book Now</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Team & Form */}
                    <div style={{ flex: 1, padding: '4rem 3rem', borderLeft: '1px solid #eaeaea' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.1em', marginBottom: '2rem' }}>MEET THE TEAM</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
                            {[
                                { name: 'Mariana', role: 'Colorist', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&fit=crop' },
                                { name: 'Sarah', role: 'Esthetician', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&fit=crop' },
                                { name: 'Jessica', role: 'Stylist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop' }
                            ].map(t => (
                                <div key={t.name} style={{ textAlign: 'center' }}>
                                    <img src={t.img} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', marginBottom: '10px' }} alt={t.name} />
                                    <div style={{ fontSize: '0.9rem' }}>{t.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#777', fontFamily: '"Inter", sans-serif' }}>{t.role}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: 'url(https://images.unsplash.com/photo-1528698827591-e19ef705597e?w=800&fit=crop) center/cover', padding: '2rem', position: 'relative' }}>
                            <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 400, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>BOOK AN APPOINTMENT</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontFamily: '"Inter", sans-serif' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input placeholder="Your Name" style={{ padding: '8px', border: '1px solid #ddd' }} />
                                        <input placeholder="Service" style={{ padding: '8px', border: '1px solid #ddd' }} />
                                        <input placeholder="Your Email" style={{ padding: '8px', border: '1px solid #ddd' }} />
                                    </div>
                                    <div style={{ background: '#f9f9f9', border: '1px solid #ddd', padding: '10px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                                        Interactive Calendar Widget
                                    </div>
                                </div>
                                <button style={{ marginTop: '1.5rem', background: '#d4af37', color: '#fff', border: 'none', padding: '10px 30px', fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer' }}>SUBMIT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   ROUTER
   ================================================================ */
const projects = {
    'toko-batik': {
        title: 'Toko Batik Nusantara',
        subtitle: 'E-Commerce landing page — Interactive Mockup Integration',
        component: <TokoBatik />
    },
    'consultant-portfolio': {
        title: 'Consultant Portfolio Site',
        subtitle: 'Personal branding landing page — Interactive Mockup Integration',
        component: <ConsultantPortfolio />
    },
    'warung-makan': {
        title: 'Warung Makan Bu Sari',
        subtitle: 'F&B landing page — Interactive Mockup Integration',
        component: <WarungMakan />
    },
    'salon-cantik': {
        title: 'Salon Cantik Pro',
        subtitle: 'Beauty & wellness booking page — Interactive Mockup Integration',
        component: <SalonCantik />
    },
}

export default function LandingPageShowcase() {
    const { projectId } = useParams()
    const project = projects[projectId]

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="A" accentColor="#1d4ed8">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                <h2>Project "{projectId}" not found</h2>
            </div>
        </ShowcaseLayout>
    )

    return (
        <ShowcaseLayout
            title={project.title}
            subtitle={project.subtitle}
            service="Landing Pages"
            accentColor="#1d4ed8"
            githubUrl="https://github.com/Nurdiansyah0">
            {project.component}
        </ShowcaseLayout>
    )
}
