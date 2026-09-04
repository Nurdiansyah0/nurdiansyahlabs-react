# NurdiansyahLabs — SEO & AEO Audit (V7)

**Auditor:** Technical SEO & Answer Engine Optimization (AEO) Specialist  
**Date:** 2026-09-05  
**Subject:** `https://nurdiansyahlabs.com`

---

## 1. Technical SEO Audit

- **Crawlability & Directives:**
  - `robots.txt`: Verified accessible, allows all user-agents, links to `sitemap.xml`.
  - `sitemap.xml`: Verified accessible, catalogs core routes and blog articles.
- **Metadata & Open Graph:**
  - `title`: Dynamic per-route titles configured with `react-helmet-async`.
  - `canonical`: Dynamic self-referential canonical tags prevent duplicate query param indexing.
  - `og:image`: Configured with high-resolution brand banner.

---

## 2. Structured Data (Schema.org) Audit

- **Schema Type:** JSON-LD connected `@graph`.
- **Entities Defined:**
  1. `Person`:
     - `@id`: `https://nurdiansyahlabs.com/#person`
     - Name: `Nurdiansyah`
     - Role: Fullstack Software Engineer & Architect
     - SameAs: GitHub (`Nurdiansyah0`), LinkedIn (`nurdiansyah-ds`)
  2. `WebSite`:
     - `@id`: `https://nurdiansyahlabs.com/#website`
     - Publisher: `#person`
  3. `ProfessionalService`:
     - `@id`: `https://nurdiansyahlabs.com/#service`
     - Founder: `#person`
     - Locality: Batam, Kepulauan Riau, Indonesia
     - Contact: `+6282176012461`
- **Validation:** Strict adherence to schema.org standards without fake reviews, ratings, or awards.

---

## 3. AEO / AI Search Engine Optimization Audit

- **AI Search File:** `https://nurdiansyahlabs.com/llms.txt`.
- **Coverage:**
  - Entity definitions for Nurdiansyah & NurdiansyahLabs.
  - Full technical stack specifications (React 18 PWA, Flask 3.1.3 Modular Monolith, PostgreSQL 13, LiteSpeed WSGI).
  - Highlighted systems: Primatera Poultry ERP, LogiStack WMS, Batam Rental Mobil.
  - Canonical contact endpoints.
