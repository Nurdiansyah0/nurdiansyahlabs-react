import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import Home from './pages/Home'
import LandingPageShowcase from './showcases/LandingPageShowcase'
import FullstackShowcase from './showcases/FullstackShowcase'
import DataAnalystShowcase from './showcases/DataAnalystShowcase'
import DataScienceShowcase from './showcases/DataScienceShowcase'
import TrendsDashboard from './pages/TrendsDashboard'
import BlogPage from './pages/BlogPage'

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
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
            </BrowserRouter>
        </LanguageProvider>
    )
}
