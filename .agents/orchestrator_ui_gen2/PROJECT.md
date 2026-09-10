# Project: NurdiansyahLabs Platform Modernization & Commercial Flow

## Architecture
- **Frontend Stack**: React 18 + Vite + Tailwind CSS + Static Prerender (`scripts/prerender.js`)
- **Backend Stack**: Flask API (`/api/v1/*`), SQLite/PostgreSQL, Auth (JWT), Pytest (`backend/tests/test_api.py`)
- **Key Design Principles**:
  - Premium engineering studio aesthetic: Deep slate canvas (`#0B0F17`), crisp high-contrast text (`#F8FAFC`, `#94A3B8`), subtle borders (`border-white/10` or `border-slate-800`), electric indigo/blue accent (`#6366F1`, `#3B82F6`).
  - Strict WCAG AA contrast compliance: No dark-on-dark footer or low-contrast text.
  - Authentic showcase: Direct integration of real production systems (Primatera Poultry ERP, Batam Rental Mobil, LogiStack WMS, Koperasi POS, Smart Vision AI).
  - Accurate commercial flow: Landing page starting Rp 500.000, Custom Web App starting Rp 2.500.000, free discovery consultation. Zero fake metrics, zero fake discounts.
  - Strict single-writer enforcement: Subagents operate on explicit designated files.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Design Tokens & Global Styles | Standardize typography scale, color tokens, surface cards, eliminate clutter & 3D cyber grid void | M1 | survey_ui_audit, survey_frontend_arch |
| 2 | Navigation & Shell Consistency | Standardize Navbar & Footer across all subpages (wrap in unified layout), fix footer contrast to WCAG AA | M1 | survey_ui_audit |
| 3 | Responsive Hook Inversion Fix | Fix inverted `isSm` ternary logic in `useResponsive.js` and dependent components | M1 | survey_ui_audit |
| 4 | Homepage Above-the-Fold Value Prop | 5-second value proposition, concise B2B positioning, clear primary CTA to consultation/inquiry | M2 | ORIGINAL_REQUEST R2 |
| 5 | Real Production Systems Showcase | Feature Primatera ERP & Batam Rental Mobil directly on homepage instead of buried modals or placeholders | M2 | survey_ui_audit, survey_commercial_flow |
| 6 | Owner-Approved Pricing Packages | Starter Web (Rp 500k), Custom Web App (Rp 2.5M), Technical Advisory with clear deliverables and revision policies | M3 | survey_commercial_flow, ORIGINAL_REQUEST R3 |
| 7 | Direct Commercial Conversion Flow | Seamless path from package selection to ContactForm pre-fill and contextual WhatsApp link | M3 | survey_commercial_flow |
| 8 | Credibility Hardening & Clean Data | Remove dead "Under Construction" / fake 23% cross-sell, remove "50+ clients" claims in `lang_eu`/`lang_asia` | M4 | survey_ui_audit, survey_commercial_flow |
| 9 | Architecture Diagrams & Tech Proof | Show real system architectures, tech capabilities, CI/CD status badge, Pytest health | M4 | survey_commercial_flow |
| 10 | Responsive & A11y Hardening | Fix nested `<main>` tags, replace dead FontAwesome classes with SVG/Lucide, ensure mobile/tablet responsiveness | M5 | survey_ui_audit |
| 11 | Build Verification & E2E Validation | Verify `npm run build` exits 0 with clean static prerender, verify backend test suite passes | M6 | ORIGINAL_REQUEST R6 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Design Tokens & Visual Design System | `tailwind.config.js`, `src/index.css`, `src/components/Footer.jsx`, `src/components/Navbar.jsx`, `src/hooks/useResponsive.js`, shared layout | none | IN_PROGRESS |
| 2 | Landing & Homepage Experience | `src/components/Hero.jsx`, `src/pages/Home.jsx`, `src/components/CTA.jsx`, value proposition & primary CTA | M1 | PLANNED |
| 3 | Pricing & Commercial Conversion Flow | `src/data/services.json`, `src/components/Services.jsx`, `src/components/ContactForm.jsx`, `src/components/seo/SEO.jsx`, package selection | M2 | PLANNED |
| 4 | Trust & Credibility Showcase | `src/data/showcase.json`, `src/components/PortfolioModal.jsx`, `src/i18n/lang_eu.js`, `src/i18n/lang_asia.js`, real app showcases | M3 | PLANNED |
| 5 | Responsive & Accessibility Hardening | Semantic HTML, ARIA attributes, SVG icons (replacing dead FontAwesome), mobile/tablet styling | M4 | PLANNED |
| 6 | Build Verification & E2E Validation | Clean Vite build, prerender check, backend regression check, zero secrets | M5 | PLANNED |

## Interface Contracts
- **Services Data**: `src/data/services.json` exports array of packages with id, title, target, price, startingPriceIDR, deliverables, features, limitations, ctaText.
- **Leads API**: `POST /api/v1/leads` requires `{ name, contact, service?, message? }`.
- **Contact Form Pre-fill**: Setting URL search param or internal state `?service=starter` or `?service=custom` auto-populates the service selector in `ContactForm.jsx`.

## Code Layout
- `src/index.css` - Design tokens, typography variables, global base classes
- `tailwind.config.js` - Color palette, typography scale, border radiuses, container padding
- `src/components/` - UI components (Navbar, Footer, Hero, Services, ContactForm, CTA, etc.)
- `src/pages/` - Route pages (Home, ServicePage, BlogListing, BlogPage, TrendsDashboard, etc.)
- `src/showcases/` - Authentic interactive production applications
- `src/data/` - Static metadata (services.json, showcase.json)
- `scripts/prerender.js` - Headless prerendering script executed during `npm run build`
