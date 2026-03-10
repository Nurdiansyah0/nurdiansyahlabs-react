import React from 'react'
import { useParams } from 'react-router-dom'
import ShowcaseLayout from './ShowcaseLayout'
import SEO from '../components/seo/SEO'
import showcaseData from '../data/showcase.json'

// App components
import SalesForecastingApp from './apps/SalesForecastingApp'
import CustomerClusteringApp from './apps/CustomerClusteringApp'
import ChurnPredictionApp from './apps/ChurnPredictionApp'
import RecommendationApp from './apps/RecommendationApp'

const appMapping = {
    'sales-forecasting': <SalesForecastingApp />,
    'customer-clustering': <CustomerClusteringApp />,
    'churn-prediction': <ChurnPredictionApp />,
    'recommendation': <RecommendationApp />
}

export default function DataScienceShowcase() {
    const { projectId } = useParams()

    // Find project in the centralized dataset
    const project = showcaseData.showcases.find(
        s => s.slug === projectId && s.categorySlug === 'data-science'
    )

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="Data Science" accentColor="#4f46e5">
            <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
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
                canonical={`/showcase/data-science/${project.slug}`}
            />
            <ShowcaseLayout
                title={project.title}
                subtitle={project.description}
                service="Data Science"
                accentColor={project.accentColor || "#4f46e5"}
                githubUrl="https://github.com/Nurdiansyah0"
                isResponsive={true}
            >
                {appMapping[project.slug]}
            </ShowcaseLayout>
        </>
    )
}
