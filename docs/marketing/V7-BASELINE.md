# NurdiansyahLabs — Production Baseline (V7 Audit)

**Date of Audit:** 2026-09-05  
**Target Environment:** Production (`https://nurdiansyahlabs.com`)  
**Methodology:** Direct inspection of PostgreSQL production database, React frontend AST/source, CloudLinux LiteSpeed runtime, and live HTTP probing.

---

## 1. Technical Baseline

- **Frontend Stack:** React 18, Vite 6, PWA, Tailwind CSS, Framer Motion, Recharts.
- **Backend Stack:** Python 3.13.15, Flask 3.1.3 Modular Monolith, native WSGI (`wsgi.py`).
- **Database:** cPanel PostgreSQL 13 (`uygpuazs_dilindo`), SQLAlchemy 2.0 ORM, Alembic migrations initialized.
- **Hosting & Web Server:** CloudLinux, LiteSpeed Enterprise, Phusion Passenger WSGI.
- **API Namespace:** Strictly `/api/v1/*`. (Legacy procedural `/api/*.php` retired with HTTP 410 Gone tombstone).
- **Public Routes:**
  - `/` (Home, Services, WhyUs, Contact)
  - `/showcase/:category/:slug` (Interactive demo showcases)
  - `/blog` (Article index)
  - `/blog/:slug` (Deep-dive technical articles)
  - `/trends` (AI Industry Trends Dashboard)
  - `/layanan/industri/:slug` (Industry-specific solutions)
  - `/admin/login` & `/admin/dashboard` (Administrative portal)
  - `/llms.txt` (AI crawler context)

---

## 2. Production Data Evidence (Measured)

Queries executed directly against the live PostgreSQL database (`uygpuazs_dilindo`):

| Table | Total Rows | Evidence / Breakdown |
| :--- | :--- | :--- |
| `analytics` | **2,471** | `pageview`: 2,147 <br>`click_project`: 117 <br>`view_showcase_modal`: 203 <br>`read_article`: 4 |
| `leads` | **1** | Contact form submissions: 1 (Recorded: 2026-06-24) |
| `posts` | **24** | Active published technical and business articles |
| `projects` | **18** | Dynamic database-driven project catalog |
| `products` | **0** | Table exists, ready for product catalog |
| `admin_users` | **1** | Production administrative user |
| `primatera_users` | **3** | Seeded farm operator/viewer demo accounts |

---

## 3. Conversion Baseline

- **Primary CTA (Observed):** "Konsultasi Proyek" / "Get Free Consultation" leading to WhatsApp (`https://wa.me/6282176012461`) or `#contact` form.
- **Secondary CTA (Observed):** "Lihat Demo Langsung" / "Explore Live Demos" leading to `#services` and showcase modals.
- **Lead Entry Points:**
  1. WhatsApp click (External link).
  2. Inbound Contact Form (`/api/v1/leads` POST).
- **Observed Conversion Path:**
  - Visitor lands $\rightarrow$ Hero $\rightarrow$ Clicks Showcase Modal (203 events) $\rightarrow$ Clicks Project link (117 events).
- **Gaps Identified in Funnel Measurement:**
  - Hero CTA clicks (`hero_primary_cta`, `hero_secondary_cta`) are currently **UNTRACKED**.
  - Contact form interactions (`contact_open`, `lead_form_start`, `lead_form_submit`) are currently **UNTRACKED**.
  - Funnel drop-off between viewing projects and initiating contact is **UNKNOWN** due to missing telemetry on CTA buttons.

---

## 4. SEO & AEO Baseline

- **Schema.org Graph:** Connected `@graph` in `SEO.jsx` declaring `Person` (Nurdiansyah), `WebSite`, and `ProfessionalService` (NurdiansyahLabs).
- **AI Search Context:** Deployed at `https://nurdiansyahlabs.com/llms.txt`, providing canonical entity, stack, and project definitions for LLMs.
- **Title & Metadata:** Configured per route via `react-helmet-async`.
- **Indexing Directives:** `sitemap.xml` and `robots.txt` present in root.

---

## 5. Epistemic Classification of Current Knowledge

1. **OBSERVED:**
   - 2,471 analytics events in PostgreSQL;
   - 1 real lead in database;
   - Sub-150ms WSGI latency on API endpoints;
   - 18 projects stored in database;
   - 24 articles stored in database.
2. **MEASURED:**
   - Test pass rate: 100% (13/13 Pytest cases);
   - Frontend bundle build time: ~13.7s;
   - Real PostgreSQL row counts.
3. **INFERRED:**
   - Visitors are interested in showcase demos because `view_showcase_modal` (203) and `click_project` (117) have high relative frequency compared to articles.
4. **HYPOTHESIZED:**
   - Tracking CTA button clicks will reveal whether visitors drop off before opening the contact form or after viewing form fields.
   - Adding distinct click tracking to WhatsApp will establish the true ratio between WhatsApp chats and web lead submissions.
5. **UNKNOWN:**
   - How many total visitors reached the contact form section without submitting;
   - True bounce rate per marketing channel (traffic attribution is not yet isolated by UTM).
