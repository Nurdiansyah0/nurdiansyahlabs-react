import React from 'react'
import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'
import SEO from '../components/seo/SEO'
import showcaseData from '../data/showcase.json'

// App components
import KoperasiPOSApp from './apps/KoperasiPOSApp'
import WarehouseApp from './apps/WarehouseApp'
import VehicleInspectionApp from './apps/VehicleInspectionApp'
import AttendanceApp from './apps/AttendanceApp'
import PrimateraPoultryApp from './apps/PrimateraPoultryApp'

import ExecutiveSummary from '../components/ExecutiveSummary'

const appMapping = {
    'koperasi-pos': <KoperasiPOSApp />,
    'warehouse-wms': <WarehouseApp />,
    'vehicle-inspection': <VehicleInspectionApp />,
    'attendance': <AttendanceApp />,
    'primatera-poultry': <PrimateraPoultryApp />
}

export default function FullstackShowcase() {
    const { projectId } = useParams()

    // Find project in the centralized dataset
    const project = showcaseData.showcases.find(
        s => s.slug === projectId && s.categorySlug === 'fullstack'
    )

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="Fullstack" accentColor="#4338ca">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#1e293b' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                <h2>Project "{projectId}" not found</h2>
            </div>
        </ShowcaseLayout>
    )

    return (
        <>
            <SEO
                title={project.title}
                description={project.description}
                canonical={`/showcase/fullstack/${project.slug}`}
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Fullstack Systems', url: '/services/web-development' },
                    { name: project.title, url: `/showcase/fullstack/${project.slug}` }
                ]}
                additionalSchemas={[
                    {
                        "@type": "SoftwareApplication",
                        "@id": `https://nurdiansyahlabs.com/showcase/fullstack/${project.slug}#app`,
                        "name": project.title,
                        "description": project.description,
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web, Linux, Cloud",
                        "author": { "@id": "https://nurdiansyahlabs.com/#person" },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD",
                            "description": "Interactive Live Case Study & Demo"
                        }
                    }
                ]}
            />
            <ShowcaseLayout
                title={project.title}
                subtitle={project.description}
                service="Fullstack"
                accentColor={project.accentColor || "#4338ca"}
                githubUrl="https://github.com/Nurdiansyah0"
                isResponsive={true}
                techStack={project.techStack}
            >
                {project.executiveSummary && (
                    <ExecutiveSummary
                        title={project.title}
                        category={project.category}
                        summary={project.executiveSummary}
                        metrics={project.metrics || []}
                        stack={project.stack || []}
                        subdomain={project.subdomain}
                        subdomainHost={project.subdomainHost}
                    />
                )}
                {project.subdomain && !project.executiveSummary && (
                    <div style={{ maxWidth: '1200px', margin: '1rem auto 0', padding: '0 1rem' }}>
                        <div style={{
                            padding: '0.75rem 1.25rem',
                            background: '#f0fdf4',
                            borderRadius: '12px',
                            border: '1.5px solid #bbf7d0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.2rem' }}>🌐</span>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Live Subdomain Deployment
                                    </div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#14532d' }}>
                                        {project.subdomainHost}
                                    </div>
                                </div>
                            </div>
                            <a
                                href={project.subdomain}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#166534',
                                    color: '#ffffff',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    textDecoration: 'none'
                                }}
                            >
                                <span>Buka Subdomain Penuh ↗</span>
                            </a>
                        </div>
                    </div>
                )}
                {appMapping[project.slug]}
            </ShowcaseLayout>
        </>
    )
}
