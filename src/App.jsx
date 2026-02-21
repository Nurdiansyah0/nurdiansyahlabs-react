import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'

// Eagerly load the Home page because it's required for the initial render
import Home from './pages/Home'

// Lazy load all other routes to reduce First Load JS payload
const LandingPageShowcase = lazy(() => import('./showcases/LandingPageShowcase'))
const FullstackShowcase = lazy(() => import('./showcases/FullstackShowcase'))
const DataAnalystShowcase = lazy(() => import('./showcases/DataAnalystShowcase'))
const DataScienceShowcase = lazy(() => import('./showcases/DataScienceShowcase'))
const TrendsDashboard = lazy(() => import('./pages/TrendsDashboard'))
const BlogPage = lazy(() => import('./pages/BlogPage'))

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src="/assets/logo.svg" width="50" alt="Loading..." style={{ animation: 'pulse 1.5s infinite' }} /></div>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/showcase/landing-page/:projectId" element={<LandingPageShowcase />} />
                        <Route path="/showcase/fullstack/:projectId" element={<FullstackShowcase />} />
                        <Route path="/showcase/data-analyst/:projectId" element={<DataAnalystShowcase />} />
                        <Route path="/showcase/data-science/:projectId" element={<DataScienceShowcase />} />
                        {/* SEO & Trends routes */}
                        <Route path="/trends" element={<TrendsDashboard />} />
                        <Route path="/blog/:slug" element={<BlogPage />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </LanguageProvider>
    )
}
