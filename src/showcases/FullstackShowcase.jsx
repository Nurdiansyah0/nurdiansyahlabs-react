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

const appMapping = {
    'koperasi-pos': <KoperasiPOSApp />,
    'warehouse-wms': <WarehouseApp />,
    'vehicle-inspection': <VehicleInspectionApp />,
    'attendance': <AttendanceApp />
}

export default function FullstackShowcase() {
    const { projectId } = useParams()

    // Find project in the centralized dataset
    const project = showcaseData.showcases.find(
        s => s.slug === projectId && s.categorySlug === 'fullstack'
    )

    if (!project) return (
        <ShowcaseLayout title="Project Not Found" subtitle="" service="Fullstack" accentColor="#4338ca">
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
                canonical={`/showcase/fullstack/${project.slug}`}
            />
            <ShowcaseLayout
                title={project.title}
                subtitle={project.description}
                service="Fullstack"
                accentColor={project.accentColor || "#4338ca"}
                githubUrl="https://github.com/Nurdiansyah0"
                isResponsive={true}
            >
                {appMapping[project.slug]}
            </ShowcaseLayout>
        </>
    )
}
