import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { LazyMotion } from 'framer-motion'
import PageTracker from './components/PageTracker'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import { getOptimizedImg } from './utils/imgHelper'

// Eagerly load the Home page because it's required for the initial render
import Home from './pages/Home'
import TerminalEasterEgg from './components/TerminalEasterEgg'

// Lazy load all other routes to reduce First Load JS payload
const LandingPageShowcase = lazy(() => import('./showcases/LandingPageShowcase'))
const FullstackShowcase = lazy(() => import('./showcases/FullstackShowcase'))
const DataAnalystShowcase = lazy(() => import('./showcases/DataAnalystShowcase'))
const DataScienceShowcase = lazy(() => import('./showcases/DataScienceShowcase'))
const TrendsDashboard = lazy(() => import('./pages/TrendsDashboard'))
const BlogListing = lazy(() => import('./pages/BlogListing'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ServicePage = lazy(() => import('./pages/ServicePage'))
const IndustryServicePage = lazy(() => import('./pages/IndustryServicePage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Subdomain Apps
const BatamRentalMobilApp = lazy(() => import('./showcases/apps/BatamRentalMobilApp'))
const KoperasiPOSApp = lazy(() => import('./showcases/apps/KoperasiPOSApp'))
const ClinicAnalyticsApp = lazy(() => import('./showcases/apps/ClinicAnalyticsApp'))
const TokoLaptopBatamApp = lazy(() => import('./showcases/apps/TokoLaptopBatamApp'))
const WarungMakanApp = lazy(() => import('./showcases/apps/WarungMakanApp'))
const AttendanceApp = lazy(() => import('./showcases/apps/AttendanceApp'))
import SubdomainAppWrapper, { detectSubdomainApp } from './components/SubdomainAppWrapper'
import showcaseData from './data/showcase.json'

// Normalize showcase bilingual fields for safe rendering across both legacy and localized components
if (showcaseData && Array.isArray(showcaseData.showcases)) {
    const REACT_ELEMENT = Symbol.for('react.element')
    const makeRenderable = (obj) => {
        if (!obj || typeof obj !== 'object' || obj.$$typeof) return obj
        if ('id' in obj || 'en' in obj) {
            const fallbackText = obj.id || obj.en || ''
            Object.defineProperties(obj, {
                $$typeof: { value: REACT_ELEMENT, enumerable: false, configurable: true },
                type: { value: React.Fragment, enumerable: false, configurable: true },
                key: { value: null, enumerable: false, configurable: true },
                ref: { value: null, enumerable: false, configurable: true },
                props: { value: { children: fallbackText }, enumerable: false, configurable: true },
                toString: { value: () => fallbackText, enumerable: false, configurable: true }
            })
        }
        return obj
    }

    showcaseData.showcases.forEach(p => {
        makeRenderable(p.title)
        makeRenderable(p.description)
        if (p.executiveSummary) {
            makeRenderable(p.executiveSummary)
            if (p.executiveSummary.problemStatement) makeRenderable(p.executiveSummary.problemStatement)
            if (p.executiveSummary.solutionArchitecture) makeRenderable(p.executiveSummary.solutionArchitecture)
            if (p.executiveSummary.businessImpact) makeRenderable(p.executiveSummary.businessImpact)
        }
    })
}

const loadFeatures = () => import('framer-motion').then(res => res.domAnimation)


export default function App() {
    const subdomainApp = detectSubdomainApp()

    return (
        <LanguageProvider>
            {subdomainApp ? (
                // ── Dedicated Subdomain View (rental.*, pos.*, clinic.*, laptop.*, warung.*, hr.*) ──
                <ErrorBoundary>
                    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={getOptimizedImg("/assets/logo.svg", { w: 100 })} width="50" alt="Loading..." style={{ animation: 'pulse 1.5s infinite' }} /></div>}>
                        <SubdomainAppWrapper app={subdomainApp}>
                            {subdomainApp.id === 'rental' && <BatamRentalMobilApp />}
                            {subdomainApp.id === 'pos' && <KoperasiPOSApp />}
                            {subdomainApp.id === 'clinic' && <ClinicAnalyticsApp />}
                            {subdomainApp.id === 'laptop' && <TokoLaptopBatamApp />}
                            {subdomainApp.id === 'warung' && <WarungMakanApp />}
                            {subdomainApp.id === 'hr' && <AttendanceApp />}
                        </SubdomainAppWrapper>
                    </Suspense>
                </ErrorBoundary>
            ) : (
                // ── Main Website View (nurdiansyahlabs.com) ──
                <ErrorBoundary>
                    <LazyMotion features={loadFeatures}>
                        <PageTracker />
                        <TerminalEasterEgg />
                        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={getOptimizedImg("/assets/logo.svg", { w: 100 })} width="50" alt="Loading..." style={{ animation: 'pulse 1.5s infinite' }} /></div>}>
                            <main id="main-content">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/showcase/landing-page/:projectId" element={<LandingPageShowcase />} />
                                    <Route path="/showcase/fullstack/:projectId" element={<FullstackShowcase />} />
                                    <Route path="/showcase/data-analyst/:projectId" element={<DataAnalystShowcase />} />
                                    <Route path="/showcase/data-science/:projectId" element={<DataScienceShowcase />} />
                                    {/* SEO & Trends routes */}
                                    <Route path="/trends" element={<TrendsDashboard />} />
                                    <Route path="/blog" element={<BlogListing />} />
                                    <Route path="/blog/:geo/:langSlug" element={<BlogPage />} />
                                    <Route path="/blog/:slug" element={<BlogPage />} />
                                    {/* Programmatic SEO Routes */}
                                    <Route path="/layanan/industri/:industrySlug" element={<IndustryServicePage />} />
                                    <Route path="/admin" element={
                                        <ProtectedRoute>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/services/:slug" element={<ServicePage />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </main>
                        </Suspense>
                    </LazyMotion>
                </ErrorBoundary>
            )}
        </LanguageProvider>
    )
}
