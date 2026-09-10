# Frontend Architecture & Technical Audit: NurdiansyahLabs

**Specialist**: Frontend Architecture Specialist Explorer  
**Date**: 2026-09-08  
**Scope**: Frontend technical architecture, component tree, routing, styling, build pipeline, prerendering, R7 API boundaries, and technical risk analysis.  
**Working Directory**: `/home/nurdiansyah/dev/Personal_project/.agents/survey_frontend_arch`

---

## Executive Summary

NurdiansyahLabs is a production-grade single-page application (SPA) built with **React 18.3.1**, **Vite 6.3.5 / 6.4.1**, **React Router DOM 7.13.0**, **Tailwind CSS 3.4.19**, **Framer Motion 12.34.3**, and an automated static prerender engine (**@prerenderer/rollup-plugin** with Puppeteer). The build pipeline is operational, completing `npm run build` with exit code 0 and generating 18 prerendered static HTML routes.

However, the architectural audit revealed critical fragmentation across styling paradigms, asset delivery, component modularity, and accessibility:
1. **Styling Tri-Split**: Tailwind utility classes, custom CSS classes in `index.css`, and verbose React inline style objects compete against each other. Furthermore, `corePlugins: { preflight: false }` is set in `tailwind.config.js` and `@tailwind base;` is omitted from `index.css`.
2. **Missing Assets & Ghost Icons**: Broken references to non-existent assets (`/assets/logo-dark.svg`, `/assets/Logo.png`, `android-chrome-512x512.png`) and missing Font Awesome icon classes (`fas fa-*`) that render blank glyphs because Font Awesome is neither installed nor loaded.
3. **Dead Link in Programmatic SEO**: `IndustryServicePage.jsx` links to `/service`, which does not exist in the routing table (yielding a 404).
4. **Auth Storage Inconsistency**: Admin auth uses `sessionStorage` in `ProtectedRoute.jsx` and `AdminDashboard.jsx`, while the unused `src/api/client.js` attempts to read `localStorage`.
5. **Nested `<main>` Semantic Violation**: Root `App.jsx` wraps `<Routes>` in `<main id="main-content">`, while downstream pages (`Home.jsx`, `BlogListing.jsx`, `BlogPage.jsx`, `ShowcaseLayout.jsx`, etc.) also wrap their views in `<main>`, creating nested landmark accessibility errors.
6. **Showcase Monolithic Bundling**: Each showcase layout statically imports all its demo apps (e.g. `FullstackShowcase` imports 5 complex apps), bloating individual route chunks up to 173 kB.

---

## 1. Component Tree, Routing Structure, and Layout Architecture

### 1.1 Entry Point & Provider Topology
```
index.html
└── src/main.jsx
    └── <React.StrictMode>
        └── <BrowserRouter>
            └── <HelmetProvider>
                └── <App />
                    ├── <LanguageProvider> (Custom context: 14 languages + live currency converter)
                    │   └── <ErrorBoundary> (Catches uncaught runtime render errors)
                    │       └── <LazyMotion features={loadFeatures}> (Dynamic Framer Motion domAnimation)
                    │           ├── <PageTracker /> (Sends 'pageview' to /api/v1/analytics/track)
                    │           ├── <TerminalEasterEgg /> (Ctrl+` or 'cpanel' interactive CLI modal)
                    │           └── <Suspense fallback={<LogoPulse />}>
                    │               └── <main id="main-content">
                    │                   └── <Routes> ... </Routes>
```

### 1.2 Routing Registry

| Route Path | Component | Loading Strategy | Purpose / Note |
|---|---|---|---|
| `/` | `Home` | **Eager** | Landing page; contains Hero, Services, WhyUs, CTA, Footer |
| `/services/:slug` | `ServicePage` | **Lazy** | Individual service landing pages (`web-development`, `landing-page`, `data-analyst`, `machine-learning`) |
| `/layanan/industri/:industrySlug` | `IndustryServicePage` | **Lazy** | Programmatic SEO routes (klinik, toko online, F&B) |
| `/showcase/landing-page/:projectId` | `LandingPageShowcase` | **Lazy** | Showcase viewer for landing page projects |
| `/showcase/fullstack/:projectId` | `FullstackShowcase` | **Lazy** | Showcase viewer for fullstack systems (POS, WMS, ERP) |
| `/showcase/data-analyst/:projectId` | `DataAnalystShowcase` | **Lazy** | Showcase viewer for analytics dashboards |
| `/showcase/data-science/:projectId` | `DataScienceShowcase` | **Lazy** | Showcase viewer for ML/AI projects |
| `/trends` | `TrendsDashboard` | **Lazy** | Real-time market trends opportunity dashboard |
| `/blog` | `BlogListing` | **Lazy** | Blog article index |
| `/blog/:geo/:langSlug` | `BlogPage` | **Lazy** | Localized multi-geo blog post view |
| `/blog/:slug` | `BlogPage` | **Lazy** | Standard blog post view |
| `/admin` | `AdminDashboard` | **Lazy** (Guarded) | Protected by `<ProtectedRoute>` (checks session token) |
| `*` | `NotFound` | **Lazy** | 404 fallback page |

### 1.3 Page File & Component Inventory

- **`src/pages/Home.jsx`**:
  - Very lean wrapper (28 lines).
  - Imports and arranges `Navbar`, `Hero`, `Services`, `WhyUs`, `CTA`, `Footer`, `SEO`.
  - Wraps contents in `<main>`, creating a nested landmark inside `App.jsx`'s `<main id="main-content">`.
- **`src/components/Navbar.jsx`**:
  - Sticky nav with dynamic backdrop blur (`scrolled ? 'blur(12px)' : 'none'`).
  - Implements multi-language dropdown supporting 14 language locales with native country flags.
  - Links: `/#services`, `/#why-us`, `/blog`, `/#contact`.
  - Heavily relies on inline styles instead of Tailwind utilities.
- **`src/components/Hero.jsx`**:
  - Dark canvas `#090818` with animated 3D background `<TechStack3D />`.
  - Framer Motion stagger animations (`m.div`, `m.h1`, `m.p`).
  - CTAs: Secondary link to `/#services`, primary direct WhatsApp lead link (`https://wa.me/6282176012461`).
  - Stat counters: `18+` (Sistem Terverifikasi), `4` (Pilar Layanan), `3yrs+` (Pengalaman).
- **`src/components/Services.jsx`**:
  - Renders 4 primary service cards (A: Business Landing Page, B: Fullstack Developer, C: Data Analyst, D: Data Scientist).
  - Clicking any card executes `setSearchParams({ service: key })`, triggering the `<PortfolioModal />` overlay.
  - Injects JSON-LD structured data for `ProfessionalService` and `OfferCatalog`.
- **`src/components/WhyUs.jsx`**:
  - 3-pillar value proposition grid (Fast Delivery, Transparent Pricing, Production Readiness).
- **`src/components/CTA.jsx` & `ContactForm.jsx`**:
  - Two-column conversion section: left column contains value proposition and direct WhatsApp/Email CTAs; right column embeds `<ContactForm />`.
  - `ContactForm` posts directly to `/api/v1/leads` with lead tracking telemetry (`lead_form_start`, `lead_form_submit`, `lead_form_success`).
- **`src/components/Footer.jsx`**:
  - Dark footer (`#111827`).
  - Contains live GitHub Actions CI/CD badge, copyright, and social links (WhatsApp, Email, GitHub, LinkedIn).
  - Contains broken asset reference: `<img src="/assets/logo-dark.svg" />`.

---

## 2. CSS and Styling Strategy Audit

### 2.1 Tailwind Configuration & Preflight Status
- **File**: `tailwind.config.js`
- **Configured Content**: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- **Configured Colors**:
  ```javascript
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a', 950: '#042f2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  }
  ```
- **Crucial Setting**:
  ```javascript
  corePlugins: {
    preflight: false,
  }
  ```
  Tailwind's Preflight (CSS reset) is disabled.
- **In `src/index.css`**:
  ```css
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @tailwind components;
  @tailwind utilities;
  ```
  `@tailwind base;` is omitted. Instead, manual element resets are defined for `body`, `a`, `button`, and `img`.

### 2.2 Color & Token Fragmentation
There is an evident architectural divergence between the Tailwind configuration and the actual application styles:
1. **The Tailwind `brand` color scale is Teal (`#14b8a6`)**, but virtually no component in the repository uses `text-brand-*` or `bg-brand-*`.
2. **The actual visual identity uses Deep Indigo & Slate Dark**:
   - Canvas dark: `#090818` / `#020308`
   - Brand indigo primary: `#312e81`, `#3730a3`, `#4338ca`, `#4f46e5`, `#e0e7ff`
   - CTA green: `#166534`, hover `#16a34a`
   - Borders: `#e2e8f0`, `#cbd5e1`
3. Semantic design tokens are declared in `src/index.css` lines 34-54 (`--color-bg-canvas`, `--color-brand-primary`, etc.), but components inconsistently choose between:
   - React inline styles with raw hardcoded hex codes (`#312e81`, `#fff`, `#f9fafb`)
   - CSS variables (`var(--section-py)`, `var(--card-padding)`)
   - Tailwind utility classes (`bg-indigo-900`, `text-slate-600`)
   - Custom stylesheet classes (`.hero-btns`, `.services-grid`, `.modal-inner`)

### 2.3 Typography & Responsive Setup
- Typography is standardized on **Inter** (`'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`).
- `src/hooks/useResponsive.js` provides high-performance breakpoint detection via `window.matchMedia`:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px
  - Helper aliases: `isMobile` (<768px), `isTablet` (768–1023px), `isDesktop` (≥1024px), `isTouchDevice`.

---

## 3. Asset Management, Icons, Images, and Animations

### 3.1 Icon Strategy & Missing Font Awesome Dependency
- **Primary Icon System**: `lucide-react` (v0.575.0) is imported across 95% of components.
- **Ghost Font Awesome Icons**:
  The following files render `<i className="fas fa-...">` elements despite Font Awesome not being included anywhere in dependencies or stylesheets:
  - `src/pages/TrendsDashboard.jsx`:
    - Line 162: `<i className="fas fa-chart-line" />`
    - Line 212: `<i className="fas fa-server" />`
  - `src/showcases/DataAnalystShowcase.jsx` line 31: `<i className="fas fa-exclamation-circle" />`
  - `src/showcases/DataScienceShowcase.jsx` line 35: `<i className="fas fa-exclamation-circle" />`
  - `src/showcases/FullstackShowcase.jsx` line 35: `<i className="fas fa-exclamation-circle" />`
  - `src/showcases/LandingPageShowcase.jsx` line 33: `<i className="fas fa-exclamation-circle" />`
  *Result*: When projects are not found or trends cards load, empty 0x0 boxes or missing glyphs are shown instead of icons. These should be replaced with Lucide React icons (`AlertCircle`, `TrendingUp`, `Server`).

### 3.2 Image Delivery & CDN Helper
- **`src/utils/imgHelper.js`**:
  - Uses `wsrv.nl/?url=` image proxy for on-the-fly image optimization and WebP conversion.
  - Automatically skips CDN for SVGs, blobs, local dev environments (`localhost`, `127.0.0.1`), and self-domain `nurdiansyahlabs.com` to prevent Cloudflare proxy blocking.
- **Missing Asset File Audit**:
  The audit scanned every image and asset reference across the codebase against `public/`:
  1. `src/components/Footer.jsx` line 15:
     ```jsx
     <img src="/assets/logo-dark.svg" alt="NurdiansyahLabs Logo" ... />
     ```
     *Missing*: `/assets/logo-dark.svg` does not exist in `public/assets/`. Only `/assets/logo.svg` exists. (Triggers 404 in browser console on every page footer).
  2. `src/components/seo/SEO.jsx` line 54:
     ```javascript
     "image": `${siteUrl}/assets/Logo.png`
     ```
     *Missing*: `/assets/Logo.png` does not exist in `public/assets/`.
  3. `src/components/Services.jsx` line 124:
     ```javascript
     "image": "https://nurdiansyahlabs.com/assets/android-chrome-512x512.png"
     ```
     *Missing*: `android-chrome-512x512.png` does not exist in `public/assets/`.
  4. `src/showcases/apps/BatamRentalMobilApp.jsx`:
     References `/assets/Logo.png` which does not exist.

### 3.3 Animation & Performance Profile
- **Framer Motion Setup**: Dynamic feature injection via `<LazyMotion features={loadFeatures}>` with `res.domAnimation`. Components correctly import `m` instead of `motion`, reducing baseline bundle size.
- **`TechStack3D.jsx` Performance Risk**:
  - Implements a 3D isometric perspective scene with a camera tilting according to mouse position (`useTransform(x, [-1, 1], [-25, 25])`), 4 rotating rectangular prisms (servers) with 6 faces each, and a continuous linear grid animation.
  - Line 44: `if (isMobile) return null;` — properly avoids running on mobile viewports.
  - *Risk on Desktop*: On high-DPI displays or lower-tier laptops without discrete GPUs, multiple continuous infinite Framer Motion transform loops cause sustained CPU/GPU load and fan spin.

---

## 4. Build Pipeline and Prerender Architecture

### 4.1 Build Scripts (`package.json`)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4.2 Vite Build Execution (`vite.config.js`)
- Runs `vite build` using Terser minification with `drop_console: true` and `drop_debugger: true`.
- Employs `@prerenderer/rollup-plugin` with `@prerenderer/renderer-puppeteer`.
- During build, Vite launches headless Chromium, navigates to each route on local port 3000, waits 5000ms (`renderAfterTime: 5000`), and writes static HTML snapshots to `dist/`.
- Prerendered Routes:
  - 1 Homepage (`/`)
  - 2 Hub pages (`/blog`, `/trends`)
  - 4 Service pages (`/services/web-development`, `/services/landing-page`, `/services/data-analyst`, `/services/machine-learning`)
  - 7 Showcase pages (`/showcase/...`)
  - 3 Dynamic Programmatic SEO pages (`/layanan/industri/...` loaded from `programmatic-seo.json`)
- **Build Timing & Clean Bundling Verification**:
  - Ran `npm run build` directly during audit.
  - **Result**: Exit code `0` in `28.88s`.
  - All 18 routes successfully snapshot to valid HTML files in `dist/`.

### 4.3 Rollup Chunking Analysis
```
dist/assets/vendor-l0sNRNKZ.js                 0.00 kB (Empty chunk warning)
dist/assets/icons-HTpIksZX.js                 22.15 kB (lucide-react)
dist/assets/router-RdZ1B5zn.js               174.98 kB (react-router-dom)
dist/assets/animation-joRTiHPt.js            175.13 kB (framer-motion)
dist/assets/charts-PkEae08j.js               387.36 kB (recharts - 108 kB gzip)
dist/assets/index-B3kNx2C5.js                138.45 kB (main entry)
dist/assets/LandingPageShowcase-C6nfzdps.js  121.03 kB
dist/assets/FullstackShowcase-DptkxwbF.js    173.74 kB
dist/assets/index-6UxaX1Ku.css                59.47 kB (9.82 kB gzip)
```
- **Empty `vendor` Chunk Warning**:
  `vite.config.js` sets `manualChunks: { vendor: ['react', 'react-dom'] }`. Because Vite's React plugin bundles React differently in ESM mode, Rollup outputs:
  `Generated an empty chunk: "vendor".`
  This is benign but produces unnecessary bundle noise and an empty JS file.
- **Showcase Chunk Bloat**:
  `FullstackShowcase` (173.74 kB) and `LandingPageShowcase` (121.03 kB) bundle all sub-applications into single monolithic chunks.

---

## 5. Technical Constraints: R7 Adherence

Requirement R7 dictates: *Preserving existing backend API contracts, auth logic, route URLs, and database/service boundaries.*

### 5.1 Backend API Contracts
The frontend currently consumes the following backend endpoints. Any modernization MUST preserve these exact schemas and methods:

| Endpoint | Method | Consumed In | Request Payload / Params | Response Contract |
|---|---|---|---|---|
| `/api/v1/leads` | POST | `ContactForm.jsx` | `{ name, contact, service, message }` | `{ success: true, data: { id: ... } }` |
| `/api/v1/auth/login` | POST | `AdminDashboard.jsx` | `{ username, password }` | `{ status: "success", token: "..." }` |
| `/api/v1/auth/verify` | GET | `ProtectedRoute.jsx` | Header `X-Admin-Token: <token>` | `{ valid: true, user: { username } }` |
| `/api/v1/auth/forgot_password` | POST | `AdminDashboard.jsx` | `{ identifier }` | `{ message: "..." }` |
| `/api/v1/auth/reset_password` | POST | `AdminDashboard.jsx` | `{ token, password }` | `{ message: "..." }` |
| `/api/v1/analytics/track` | POST | `useTracker.js` | `{ type, path, visitorId, ... }` | `{ success: true }` |
| `/api/v1/posts` | GET | `BlogListing.jsx` | None | `Array<Post>` or `{ posts: [...] }` |
| `/api/v1/posts?slug=...` | GET | `BlogPage.jsx` | Query parameter `slug` | `{ title, description, content, ... }` |
| `/api/v1/trends` | GET | `TrendsDashboard.jsx` | None | `{ opportunities: [...], data: {...} }` |
| `/api/v1/trends/auto_post` | GET | `AdminDashboard.jsx` | `?key=...&geo=...` | `{ status: "success", message: ... }` |
| `/api/v1/media/upload` | POST | `AdminDashboard.jsx`, `AdminProducts.jsx` | Multipart `FormData` (`file` or `image`) | `{ status: "success", url: "...", image_data: {...} }` |
| `/api/v1/admin?action=posts` | GET, POST, PUT, DELETE | `AdminDashboard.jsx` | Header `X-Admin-Token` | `{ posts: [...] }` / CRUD status |
| `/api/v1/admin?action=leads` | GET, DELETE | `AdminDashboard.jsx` | Header `X-Admin-Token` | `{ leads: [...] }` / delete status |
| `/api/v1/analytics` | GET | `AdminDashboard.jsx` | Header `X-Admin-Token` | Telemetry aggregation data |
| `/api/v1/products?app=...` | GET, POST, PUT, DELETE | `AdminDashboard.jsx`, showcase apps | App ID query param | `{ data: [...] }` |
| `/api/v1/primatera/auth` | POST | `PrimateraPoultryApp.jsx` | `{ username, password }` | `{ success: true, ... }` |
| `/api/v1/primatera/records` | GET, POST | `PrimateraPoultryApp.jsx` | Farm flock records payload | `{ records: [...] }` / status |

### 5.2 Authentication & Token Storage Analysis
- **Current Realized Auth**:
  - `AdminDashboard.jsx` (line 55): `sessionStorage.setItem('adminToken', data.token)`
  - `ProtectedRoute.jsx` (line 23, 28): `sessionStorage.getItem('adminToken')`
  - On 401 or logout: `sessionStorage.removeItem('adminToken')`
- **Dead Code Warning (`src/api/client.js`)**:
  - `src/api/client.js` line 16 contains: `const token = localStorage.getItem('adminToken')`.
  - However, `src/api/client.js` is NOT imported anywhere in `src/`. Components invoke `fetch()` directly with manual headers.
  - *Recommendation*: If centralized API client is adopted during modernization, ensure it reads from `sessionStorage` (or supports both `sessionStorage` and `localStorage` gracefully) to maintain backward compatibility.

### 5.3 Route URLs & External Link Boundaries
- All 12 route patterns in `src/App.jsx` are authoritative and must be preserved.
- Static HTML generation paths in `vite.config.js` and `scripts/prerender.js` must mirror the route tree.
- Backend CORS and proxy settings:
  Vite `server.proxy` redirects `/api` and `/upload_articles` to `http://127.0.0.1:8000`.

---

## 6. Technical Risks, Circular Dependencies, and Performance Bottlenecks

### 6.1 Circular Dependency Verification
- Run via AST graph DFS cycle traversal over all `.js` and `.jsx` modules in `src/`.
- **Finding**: **0 circular dependencies detected.** The module graph is an acyclic directed graph (DAG).

### 6.2 Relative Import Verification
- Run via file system resolver over all relative import statements in `src/`.
- **Finding**: **0 broken relative imports.** All imported files, utilities, contexts, hooks, and JSON datasets exist and resolve cleanly.

### 6.3 Technical Risks & Inconsistencies Table

| # | Severity | Category | Description | Exact Location | Proposed Remediation |
|---|---|---|---|---|---|
| 1 | **High** | Route / Link Integrity | Dead Link `/service` leading to 404 | `src/pages/IndustryServicePage.jsx`: lines 22, 37 | Update links to `/#services` or `/services/web-development` |
| 2 | **Medium** | Accessibility | Invalid nested `<main>` landmarks | `src/App.jsx`: line 38 (`<main id="main-content">`) vs `src/pages/Home.jsx`: line 18 (`<main>`) | Remove `<main>` from `Home.jsx` or convert `App.jsx` wrapper to `<div>` |
| 3 | **Medium** | Asset 404s | Missing image assets | `src/components/Footer.jsx`: line 15 (`/assets/logo-dark.svg`), `src/components/seo/SEO.jsx`: line 54 (`/assets/Logo.png`) | Replace with `/assets/logo.svg` or copy missing assets |
| 4 | **Medium** | Visual / UI | Missing Font Awesome classes rendering empty glyphs | `src/pages/TrendsDashboard.jsx`: 162, 212; `src/showcases/*Showcase.jsx`: 31-35 | Replace `<i className="fas ...">` with native `lucide-react` icons |
| 5 | **Low** | SEO / React Bug | Stale effect closure in blog SEO tag update | `src/pages/BlogPage.jsx`: line 62 (`[slug]` dependency missing `actualSlug`, `geo`, `langSlug`) | Add `actualSlug` to dependency array, or use `<SEO />` component |
| 6 | **Medium** | Performance | Heavy 3D scene continuous CPU/GPU load | `src/components/TechStack3D.jsx`: lines 62-150 | Replace continuous multi-face 3D DOM transforms with lightweight CSS canvas or static glowing mesh |
| 7 | **Low** | Build Quality | Empty `vendor` chunk generated by Rollup | `vite.config.js`: line 78 (`vendor: ['react', 'react-dom']`) | Adjust manualChunks or let Vite handle React vendor splitting automatically |
| 8 | **Medium** | Design System | Stylistic fragmentation (inline styles vs Tailwind vs CSS variables) | Everywhere (`Navbar.jsx`, `Services.jsx`, `Hero.jsx`, `CTA.jsx`) | Modernize components to utilize unified Tailwind classes and design tokens |

---

## 7. Pricing & Commercial Presentation Architecture (R4A / R4B)

### 7.1 Existing Pricing Locations in Repository
Pricing data currently exists in four distinct locations in the frontend:
1. **`src/components/Services.jsx` (Hardcoded state)**:
   - Service A (Business Landing Page): `priceIDR: 2500000` ("Mulai dari Rp 2.500.000")
   - Service B (Fullstack Developer): `priceIDR: 5000000` ("Mulai dari Rp 5.000.000")
   - Service C (Data Analyst): `priceIDR: 3000000` ("Mulai dari Rp 3.000.000")
   - Service D (Data Scientist): `priceIDR: 4500000` ("Mulai dari Rp 4.500.000")
2. **`src/data/services.json` (Static JSON dataset)**:
   - `landing-page`: `"Mulai Rp 2.500.000"` (with 11 detailed inclusions, 5-10 day estimate, 2x revisions)
   - `web-development`: `"Mulai Rp 5.000.000"` (no inclusions listed)
   - `data-analyst`: `"Mulai Rp 3.000.000"` (no inclusions listed)
   - `machine-learning`: `"Mulai Rp 4.500.000"` (no inclusions listed)
3. **`src/components/seo/SEO.jsx` (Structured Data Schema)**:
   - `priceRange`: `"Rp 2.500.000 – Rp 5.000.000"`
   - Offers: 2.5M (Landing Page), 5M (Fullstack), 3M (Data Analyst), 4.5M (Data Science).
4. **`src/i18n/LanguageContext.jsx` (Dynamic Currency Conversion)**:
   - Converts IDR amounts on the fly into USD, EUR, JPY, KRW, CNY, GBP, etc., for international visitors.

### 7.2 Commercial UX Deficiencies
- Only Service A has rich deliverables and scope transparency (`inclusions`, `estimation`, `revisions`). Services B, C, and D lack detailed deliverables in `services.json`, making their pricing cards feel unbalanced and less commercially convincing.
- The modal (`PortfolioModal.jsx`) triggered from "Lihat Contoh Proyek" redirects users to showcase routes rather than completing a package-selection-to-quote conversion funnel.
- The conversion flow should guide users from:
  `Service -> Value/Deliverables -> Transparent Package Pricing -> Select Package -> Contact / WhatsApp Prefilled Lead`.

---

## 8. Recommendations for Modernization Team

1. **Design System & Styling**:
   - Align `tailwind.config.js` with the real brand palette (replace teal `brand` with Deep Indigo `#312e81` / `#4338ca` and Dark Slate `#090818`).
   - Gradually refactor inline styles in `Navbar.jsx`, `Hero.jsx`, and `Services.jsx` into clean Tailwind utility classes.
2. **Component & Code Health**:
   - Fix dead links: Replace `/service` in `IndustryServicePage.jsx` with `/#services`.
   - Eliminate nested `<main>` landmarks.
   - Replace Font Awesome `fas fa-*` with Lucide React icons.
   - Fix broken asset paths (`logo-dark.svg` -> `logo.svg`, `Logo.png` -> `logo.svg`).
3. **Performance Optimization**:
   - Refactor `TechStack3D.jsx` to be lighter or provide reduced-motion fallback.
   - Dynamically lazy-load individual showcase apps within `ShowcaseLayout` rather than bundling all apps statically into one monolithic chunk.
4. **R7 Adherence**:
   - Preserve all existing API schemas (`/api/v1/leads`, `/api/v1/auth/*`, `/api/v1/analytics/track`, etc.).
   - Ensure authentication session management continues to honor `sessionStorage`.
