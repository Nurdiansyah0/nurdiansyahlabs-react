import React from 'react'
import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'
import SEO from '../components/seo/SEO'
import showcaseData from '../data/showcase.json'

// App components
import RetailSalesApp from './apps/RetailSalesApp'
import EcommerceAnalyticsApp from './apps/EcommerceAnalyticsApp'
import ClinicAnalyticsApp from './apps/ClinicAnalyticsApp'
import CropYieldApp from './apps/CropYieldApp'

const appMapping = {
    'retail-sales': <RetailSalesApp />,
    'ecommerce-analytics': <EcommerceAnalyticsApp />,
    'clinic-analytics': <ClinicAnalyticsApp />,
    'crop-yield': <CropYieldApp />
}

export default function DataAnalystShowcase() {
    const { projectId } = useParams()

    // Find project in the centralized dataset
    const project = showcaseData.showcases.find(
        s => s.slug === projectId && s.categorySlug === 'data-analyst'
    )

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="Data Analyst" accentColor="#0ea5e9">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#475569' }}>
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
                canonical={`/showcase/data-analyst/${project.slug}`}
            />
            <ShowcaseLayout
                title={project.title}
                subtitle={project.description}
                service="Data Analyst"
                accentColor={project.accentColor || "#0ea5e9"}
                githubUrl="https://github.com/Nurdiansyah0"
                isResponsive={true}
            >
                {appMapping[project.slug]}
            </ShowcaseLayout>
        </>
    )
}
