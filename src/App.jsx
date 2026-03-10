import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { LazyMotion } from 'framer-motion'

import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useTracker } from './hooks/useTracker'

// Eagerly load the Home page because it's required for the initial render
import Home from './pages/Home'

// Lazy load all other routes to reduce First Load JS payload
const LandingPageShowcase = lazy(() => import('./showcases/LandingPageShowcase'))
const FullstackShowcase = lazy(() => import('./showcases/FullstackShowcase'))
const DataAnalystShowcase = lazy(() => import('./showcases/DataAnalystShowcase'))
const DataScienceShowcase = lazy(() => import('./showcases/DataScienceShowcase'))
const TrendsDashboard = lazy(() => import('./pages/TrendsDashboard'))
const BlogListing = lazy(() => import('./pages/BlogListing'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ServicePage = lazy(() => import('./pages/ServicePage'))

const loadFeatures = () => import('framer-motion').then(res => res.domAnimation)

function PageTracker() {
    const location = useLocation()
    const { trackEvent } = useTracker()

    useEffect(() => {
        if (location.pathname.startsWith('/admin')) return
        trackEvent('pageview', { path: location.pathname + location.search })
    }, [location, trackEvent])

    return null
}

export default function App() {
    return (
        <LanguageProvider>
            <LazyMotion features={loadFeatures}>
                <BrowserRouter>
                    <PageTracker />
                    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src="/assets/logo.svg" width="50" alt="Loading..." style={{ animation: 'pulse 1.5s infinite' }} /></div>}>
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
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/services/:slug" element={<ServicePage />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </LazyMotion>
        </LanguageProvider>
    )
}
