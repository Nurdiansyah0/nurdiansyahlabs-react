# Frontend Build & Static Prerendering Specification Mining Report

**Agent**: Frontend Prerender Spec Miner  
**Working Directory**: `/home/nurdiansyah/dev/Personal_project/.agents/survey_frontend`  
**Parent Orchestrator ID**: `a4d3b1f3-0d7c-4f48-8f97-2fc4a7bf699e`  
**Date**: 2026-09-08T11:34:00Z  
**Target Verification Requirement**: R3 (Frontend Build & Static Prerender Verification)

---

## 1. Observation

### 1.1 Root Configuration & Build Scripts
- **File**: `package.json`
  - `name`: `"nurdiansyahlabs"`, `type`: `"module"`, `version`: `"1.0.0"`
  - `scripts`:
    - `"dev": "vite"`
    - `"build": "vite build"`
    - `"preview": "vite preview"`
  - **Notice**: There is no dedicated `"prerender"` npm script; prerendering is embedded directly into the Rollup phase of `vite build`.
  - Core dependencies:
    - `react`: `^18.3.1`, `react-dom`: `^18.3.1`
    - `react-router-dom`: `^7.13.0`
    - `react-helmet-async`: `^3.0.0`
    - `framer-motion`: `^12.34.3`
    - `recharts`: `^3.7.0`
    - `lucide-react`: `^0.575.0`
    - `i18next`: `^25.8.13`, `react-i18next`: `^16.5.4`
  - Build & Prerendering devDependencies:
    - `@prerenderer/rollup-plugin`: `^0.3.12`
    - `@prerenderer/renderer-puppeteer`: `^1.2.4`
    - `puppeteer`: `^24.38.0`
    - `express`: `^5.2.1`
    - `terser`: `^5.46.0`
    - `vite`: `^6.3.5`

- **File**: `vite.config.js`
  - Plugins: `react()`, `prerender({ routes: [...], renderer: '@prerenderer/renderer-puppeteer', rendererOptions: { renderAfterTime: 5000 }, server: { port: 3000, host: '127.0.0.1' } })`
  - Dynamic programmatic routes generation:
    `const programmaticRoutes = programmaticData.industries.map(ind => '/layanan/industri/' + ind.slug)` (from `src/data/programmatic-seo.json`)
  - Total routes configured in `vite.config.js`: 18 routes (15 explicit + 3 programmatic).
  - Production build settings:
    - `outDir`: `'dist'`
    - `assetsDir`: `'assets'`
    - `minify`: `'terser'` with `drop_console: true`, `drop_debugger: true`
    - `rollupOptions.output.manualChunks`: vendor (`react`, `react-dom`), router (`react-router-dom`), animation (`framer-motion`), charts (`recharts`), icons (`lucide-react`).

### 1.2 Prerendering Pipelines
Two distinct prerendering implementations exist in the repository:

1. **Pipeline A: Integrated Vite Rollup Plugin (`vite.config.js`)**
   - Triggered by: `npm run build` (`vite build`).
   - Mechanism: Rollup plugin spins up internal HTTP server at `http://127.0.0.1:3000` serving generated dist bundles.
   - Puppeteer launches headless browser, navigates to each configured route, waits 5000ms (`renderAfterTime: 5000`) for React hydration and `react-helmet-async` meta tag injection, captures `page.content()`, and writes `dist/<route>/index.html`.
   - Generates 18 HTML files.
   - Build timing observed: ~19.55 seconds total.

2. **Pipeline B: Standalone Script (`scripts/prerender.js`)**
   - Triggered by: `node scripts/prerender.js`.
   - Mechanism: Express.js server starts on port 8080 (`http://localhost:8080`), serves `dist/` with an SPA fallback `res.sendFile(dist/index.html)`.
   - Puppeteer launches directly (`headless: 'new'`, `args: ['--no-sandbox', '--disable-setuid-sandbox']`).
   - Routes: Derived dynamically from `src/data/services.json` (4 services) and `src/data/showcase.json` (18 showcases), plus `/`, `/trends`, `/blog` = 25 routes.
   - Post-render hook: `generateSitemap(routes)` creates/overwrites `dist/sitemap.xml`.
   - Execution timing observed: ~38 seconds for 25 routes.

### 1.3 Route Inventory & Source Architecture
- **Router Configuration** (`src/App.jsx` & `src/main.jsx`):
  - `src/main.jsx` initializes: `<React.StrictMode><BrowserRouter><HelmetProvider><App /></HelmetProvider></BrowserRouter></React.StrictMode>`.
  - Dispatches custom event: `setTimeout(() => document.dispatchEvent(new Event('render-event')), 2000)`.
  - Routes declared in `src/App.jsx`:
    1. `/` -> `<Home />` (Eagerly loaded)
    2. `/showcase/landing-page/:projectId` -> `<LandingPageShowcase />` (Lazy loaded)
    3. `/showcase/fullstack/:projectId` -> `<FullstackShowcase />` (Lazy loaded)
    4. `/showcase/data-analyst/:projectId` -> `<DataAnalystShowcase />` (Lazy loaded)
    5. `/showcase/data-science/:projectId` -> `<DataScienceShowcase />` (Lazy loaded)
    6. `/trends` -> `<TrendsDashboard />` (Lazy loaded)
    7. `/blog` -> `<BlogListing />` (Lazy loaded)
    8. `/blog/:geo/:langSlug` -> `<BlogPage />` (Dynamic route, runtime API-driven)
    9. `/blog/:slug` -> `<BlogPage />` (Dynamic route, runtime API-driven)
    10. `/layanan/industri/:industrySlug` -> `<IndustryServicePage />` (Lazy loaded)
    11. `/admin` -> `<ProtectedRoute><AdminDashboard /></ProtectedRoute>` (Protected, excluded from static prerender)
    12. `/services/:slug` -> `<ServicePage />` (Lazy loaded)
    13. `*` -> `<NotFound />` (Catch-all)

### 1.4 Route Discrepancy Matrix
A comparison between `vite.config.js`, `scripts/prerender.js`, and `src/App.jsx`:
| Route Pattern / URL | App.jsx Supported | vite.config.js (npm run build) | scripts/prerender.js | Monitored by seo_drift.py |
|---|:---:|:---:|:---:|:---:|
| `/` | Yes | Yes | Yes | Yes |
| `/blog` | Yes | Yes | Yes | Yes |
| `/trends` | Yes | Yes | Yes | Yes |
| `/services/web-development` | Yes | Yes | Yes | Yes |
| `/services/landing-page` | Yes | Yes | Yes | Yes |
| `/services/data-analyst` | Yes | Yes | Yes | Yes |
| `/services/machine-learning` | Yes | Yes | Yes | Yes |
| `/showcase/landing-page/toko-laptop-batam` | Yes | Yes | Yes | No |
| `/showcase/landing-page/batam-chicken-supplier` | Yes | Yes | Yes | No |
| `/showcase/landing-page/warung-makan` | Yes | Yes | Yes | No |
| `/showcase/landing-page/batam-rental-mobil` | Yes | Yes | Yes | Yes |
| `/showcase/fullstack/koperasi-pos` | Yes | Yes | Yes | No |
| `/showcase/fullstack/warehouse-wms` | Yes | Yes | Yes | Yes |
| `/showcase/fullstack/primatera-poultry` | Yes | Yes | Yes | Yes |
| `/showcase/data-science/smart-vision` | Yes | Yes | Yes | Yes |
| `/layanan/industri/klinik-kesehatan` | Yes | Yes | No | No |
| `/layanan/industri/toko-online-retail` | Yes | Yes | No | No |
| `/layanan/industri/bisnis-fb-kuliner` | Yes | Yes | No | No |
| `/showcase/fullstack/vehicle-inspection` | Yes | No | Yes | No |
| `/showcase/fullstack/attendance` | Yes | No | Yes | No |
| `/showcase/data-analyst/retail-sales` | Yes | No | Yes | No |
| `/showcase/data-analyst/ecommerce-analytics` | Yes | No | Yes | No |
| `/showcase/data-analyst/clinic-analytics` | Yes | No | Yes | No |
| `/showcase/data-analyst/crop-yield` | Yes | No | Yes | No |
| `/showcase/data-science/sales-forecasting` | Yes | No | Yes | No |
| `/showcase/data-science/customer-clustering` | Yes | No | Yes | No |
| `/showcase/data-science/churn-prediction` | Yes | No | Yes | No |
| `/showcase/data-science/recommendation` | Yes | No | Yes | No |
| `/admin` | Yes | No (Protected) | No | No (Disallow) |
| `/blog/:slug` | Yes | No (Runtime DB) | No | No |

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Build Pipeline | Vite Production Bundler | Compiles JSX, CSS, Tailwind, transforms modules, generates code-split chunks with Terser minification | `src/`, `vite.config.js` | `dist/assets/*.js`, `dist/assets/*.css` | Exits non-zero on syntax or unresolved import error | `package.json`, `vite.config.js` |
| 2 | Prerender Engine | `@prerenderer/rollup-plugin` | Rollup plugin during Vite build that launches Puppeteer, navigates to 18 static routes, and saves prerendered HTML | 18 configured routes | 18 `index.html` files in `dist/` | Throws timeout or launch error, breaking build | `vite.config.js` |
| 3 | Prerender Engine | Standalone Puppeteer Prerenderer | Node.js script using Express + Puppeteer to prerender 25 routes and generate sitemap | `node scripts/prerender.js`, `dist/` | 25 HTML files in `dist/`, `dist/sitemap.xml` | Logs route error to stderr; exits 1 on fatal launch failure | `scripts/prerender.js` |
| 4 | SEO Engine | Dynamic Head & Schema Injection | `react-helmet-async` dynamically mutates `<title>`, `<meta>`, canonical `<link>`, and Schema.org JSON-LD | Props to `<SEO>` component | Mutated `<head>` in DOM before Puppeteer serialization | Falls back to default site title/description | `src/components/seo/SEO.jsx` |
| 5 | SEO Verification | SQLite-backed SEO Drift Engine | Validates HTTP 200, non-empty title, canonical link, and JSON-LD schema presence across 14 routes | Local or remote URL (`SEO_TARGET_URL`) | SQLite records in `data/seo_drift.db`, console report | Exits code 1 on status!=200, missing title, or missing canonical | `scripts/seo_drift.py` |
| 6 | Routing & Fallback | SPA Error Boundary | Class component catching uncaught rendering errors in React tree | Unhandled component exception | Displays "Something went wrong" UI card | Catches error; prevents white-screen crash | `src/components/ErrorBoundary.jsx` |
| 7 | Route Protection | Session-Based Admin Guard | Guards `/admin` against unauthenticated access via `sessionStorage` token validation | Route navigation to `/admin` | Login UI or Dashboard | Redirects/renders login form on unauthenticated state | `src/components/ProtectedRoute.jsx` |
| 8 | Programmatic SEO | Dynamic Industry Landing Pages | Dynamically generates structured industry landing pages from JSON dataset | `src/data/programmatic-seo.json` | Prerendered HTML at `/layanan/industri/:industrySlug` | Renders "Industri tidak ditemukan" if slug invalid | `src/pages/IndustryServicePage.jsx` |
| 9 | Showcase Gallery | Domain Case Study Demos | Four distinct showcase categories: Landing Page, Fullstack, Data Analyst, Data Science | Centralized `src/data/showcase.json` | Interactive applications & Executive Summaries | Displays "Project Not Found" card if slug unmatched | `src/showcases/*` |
| 10 | Performance | Manual Code Splitting | Rollup `manualChunks` isolating vendor, router, animation, charts, and icons | Rollup chunk configuration | Chunks: `vendor-*.js`, `router-*.js`, etc. | Warns on empty chunks | `vite.config.js` |

---

## 3. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Prerender Port Conflict | Port 3000 in use during `npm run build` | `@prerenderer/rollup-plugin` fails or connects to external server on port 3000, resulting in timeout or wrong content |
| 2 | Standalone Prerender Port Conflict | Port 8080 in use during `node scripts/prerender.js` | Express throws `EADDRINUSE: address already in use :::8080` and process crashes with exit code 1 |
| 3 | Missing Static Image Asset | Navigation to `/showcase/landing-page/batam-rental-mobil` or `/layanan/industri/*` | Browser requests `/assets/Logo.png` and `/assets/logo-dark.svg`, receiving 404. Page renders cleanly without fatal exception |
| 4 | Offline / Missing API during Prerendering | Prerendering `/blog` or `/trends` when backend API is offline | Component catches fetch error in `useEffect`, sets `loading: false`, renders empty list/loading skeleton without crashing DOM |
| 5 | Non-Sandboxed Linux / Container Environment | Puppeteer launch without `--no-sandbox` | `@prerenderer/renderer-puppeteer` lacks explicit sandbox args in `vite.config.js`; fails in root Docker environments without `--no-sandbox` |
| 6 | Route Discrepancy (Showcase Incompleteness) | Direct request to `/showcase/fullstack/vehicle-inspection` in `dist` after `npm run build` | File `dist/showcase/fullstack/vehicle-inspection/index.html` is absent; server falls back to `dist/index.html` (client-side rendered only) |
| 7 | Trailing Slash Redirect | Request to `/services/web-development` without trailing slash on static server | Static HTTP server issues HTTP 301 Redirect to `/services/web-development/`; client follows to 200 OK |
| 8 | Empty Rollup Vendor Chunk | `npm run build` bundling with `manualChunks: { vendor: ['react', 'react-dom'] }` | Vite outputs: `Generated an empty chunk: "vendor"`. Build succeeds with code 0; non-fatal Rollup notice |

---

## 4. Logic Chain

1. **Build Invocation**:
   - Running `npm run build` executes `vite build`.
   - Vite processes entry `index.html` and parses dependencies.
   - Rollup executes plugins in sequence: `@vitejs/plugin-react` transforms JSX, then `@prerenderer/rollup-plugin` intercepts the bundle generation hook.
2. **Prerender Execution**:
   - The plugin builds client assets to `dist/`, starts an internal HTTP server at `http://127.0.0.1:3000`, and launches headless Chrome via Puppeteer.
   - It iterates over the 18 routes declared in `vite.config.js`.
   - Each route is requested, waited on for 5000ms, serialized to HTML, and written to `dist/<route>/index.html`.
3. **Route Coverage**:
   - 18 static routes are generated by `npm run build`.
   - All 18 routes generate non-empty HTML files (> 4 KB up to 245 KB for `koperasi-pos`).
   - The root DOM element `<div id="root">` contains the fully rendered application markup, pre-filled meta tags, canonical links, and connected JSON-LD schemas.
4. **Smoke Testing & Verification**:
   - When serving `dist/` via an HTTP server and launching headless Chrome:
     - All tested routes load with HTTP 200 (or 301 followed by 200).
     - `#root` contains thousands of characters of rendered markup.
     - Neither `page.on('pageerror')` nor the ErrorBoundary fallback string `"Something went wrong"` trigger.
   - `scripts/seo_drift.py` confirms 14/14 invariant routes pass with valid titles, canonical tags, and JSON-LD schema presence.

---

## 5. Caveats

1. **Route Disparity Between Build and Standalone Script**:
   - `vite.config.js` declares 18 routes (including 3 programmatic routes, but only 8 of 18 showcases).
   - `scripts/prerender.js` declares 25 routes (including all 18 showcases, but 0 programmatic routes).
   - If requirement R3 strictly tests the output of `npm run build`, only 18 static HTML files are generated. If R3 requires all 18 showcases to be prerendered, `vite.config.js` or `scripts/prerender.js` must be synchronized.
2. **Puppeteer Sandbox Flags**:
   - `vite.config.js` does not pass `launchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }` to `@prerenderer/renderer-puppeteer`. On host Linux systems running as normal users, this works. In Docker containers or CI running as root, this could trigger Chrome sandbox errors.
3. **Port Collisions**:
   - Hardcoded port 3000 in `vite.config.js` and port 8080 in `scripts/prerender.js` can fail if tests or existing services bind to those ports simultaneously.
4. **Non-fatal 404s for Missing Assets**:
   - Images `/assets/Logo.png` and `/assets/logo-dark.svg` are referenced in `SEO.jsx` and `Footer.jsx` but absent from `public/assets/`.

---

## 6. Conclusion & Specification for R3 Verification Suite

To satisfy **Requirement R3** ("Frontend Build & Static Prerender Verification"):

### Exact Verification Criteria:
1. **Clean Bundle Generation in `dist/`**:
   - `npm run build` exits with code 0.
   - `dist/index.html` exists and is > 10 KB.
   - `dist/assets/` contains valid compiled JavaScript (`index-*.js`) and CSS (`index-*.css`).
   - Zero syntax errors or unresolved Rollup import failures.
2. **Valid HTML Generation for Declared Routes**:
   - All 18 declared routes from `vite.config.js` must produce a corresponding `index.html` file in `dist/`.
   - Each HTML file must be > 1 KB.
   - Each HTML file must contain rendered markup inside `<div id="root">` (must not be an empty `<div id="root"></div>`).
   - No HTML file may contain the ErrorBoundary fallback string (`"Something went wrong"`).
   - Each HTML file must contain a non-empty `<title>` tag and `<link rel="canonical"`.
3. **Zero Uncaught Bundle Syntax / Runtime Errors**:
   - Serving `dist/` locally and navigating routes via headless Chrome must produce 0 uncaught page exceptions (`page.on('pageerror')`).
   - Routes must return HTTP 200.
4. **SEO Drift Validation**:
   - Running `scripts/seo_drift.py` against the served `dist/` must exit with code 0 and report 14/14 invariants passed.

---

## 7. Verification Method

To independently reproduce and verify this specification:

1. **Verify Build & Prerender Execution**:
   ```bash
   npm run build
   ```
   *Expected*: Exit code 0, build time 15–25s, 18 HTML files generated in `dist/`.

2. **Verify Prerendered HTML Files Exist and Are Populated**:
   ```bash
   python3 -c "
   import os, sys
   routes = [
     'index.html', 'blog/index.html', 'trends/index.html',
     'services/web-development/index.html', 'services/landing-page/index.html',
     'services/data-analyst/index.html', 'services/machine-learning/index.html',
     'showcase/landing-page/toko-laptop-batam/index.html',
     'showcase/landing-page/batam-chicken-supplier/index.html',
     'showcase/landing-page/warung-makan/index.html',
     'showcase/landing-page/batam-rental-mobil/index.html',
     'showcase/fullstack/koperasi-pos/index.html',
     'showcase/fullstack/warehouse-wms/index.html',
     'showcase/fullstack/primatera-poultry/index.html',
     'showcase/data-science/smart-vision/index.html',
     'layanan/industri/klinik-kesehatan/index.html',
     'layanan/industri/toko-online-retail/index.html',
     'layanan/industri/bisnis-fb-kuliner/index.html'
   ]
   missing = [r for r in routes if not os.path.exists(os.path.join('dist', r))]
   if missing:
       print('MISSING ROUTES:', missing)
       sys.exit(1)
   for r in routes:
       content = open(os.path.join('dist', r)).read()
       assert '<div id=\"root\"></div>' not in content, f'Empty root in {r}'
       assert 'Something went wrong' not in content, f'ErrorBoundary in {r}'
       assert '<title>' in content, f'Missing title in {r}'
   print('ALL 18 ROUTES VERIFIED CLEAN & POPULATED')
   "
   ```

3. **Verify SEO Invariants with SEO Drift**:
   ```bash
   python3 -m http.server 3015 --directory dist &
   PID=$!
   sleep 1
   SEO_TARGET_URL="http://127.0.0.1:3015" python3 scripts/seo_drift.py
   STATUS=$?
   kill $PID
   exit $STATUS
   ```
   *Expected*: Exit code 0, 14/14 passed invariants.
