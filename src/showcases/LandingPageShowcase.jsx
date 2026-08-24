import React from 'react'
import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'
import SEO from '../components/seo/SEO'
import showcaseData from '../data/showcase.json'

// App components
import TokoLaptopBatamApp from './apps/TokoLaptopBatamApp'
import ConsultantApp from './apps/ConsultantApp'
import WarungMakanApp from './apps/WarungMakanApp'
import BatamRentalMobilApp from './apps/BatamRentalMobilApp'

const appMapping = {
    'toko-laptop-batam': <TokoLaptopBatamApp />,
    'batam-chicken-supplier': <ConsultantApp />,
    'warung-makan': <WarungMakanApp />,
    'batam-rental-mobil': <BatamRentalMobilApp />
}

export default function LandingPageShowcase() {
    const { projectId } = useParams()

    // Find project in the centralized dataset
    const project = showcaseData.showcases.find(
        s => s.slug === projectId && s.categorySlug === 'landing-page'
    )

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="Landing Pages" accentColor="#1e3a8a">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#1e293b' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                <h2>Project "{projectId}" not found</h2>
                <p>Silakan periksa kembali URL atau kembali ke halaman utama.</p>
            </div>
        </ShowcaseLayout>
    )

    return (
        <>
            <SEO
                title={project.title}
                description={project.description}
                canonical={`/showcase/landing-page/${project.slug}`}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Showcases', url: '/#services' },
                    { name: 'Landing Pages', url: `/showcase/landing-page/${project.slug}` }
                ]}
            />
            <ShowcaseLayout
                title={project.title}
                subtitle={project.description}
                service="Landing Pages"
                accentColor={project.accentColor || "#1e3a8a"}
                githubUrl="https://github.com/Nurdiansyah0"
                isResponsive={true}
            >
                {appMapping[project.slug]}
            </ShowcaseLayout>
        </>
    )
}
