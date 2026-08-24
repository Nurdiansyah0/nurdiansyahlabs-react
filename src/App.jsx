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

const loadFeatures = () => import('framer-motion').then(res => res.domAnimation)


export default function App() {
    return (
        <LanguageProvider>
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
        </LanguageProvider>
    )
}
