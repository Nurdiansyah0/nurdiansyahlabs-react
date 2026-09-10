## 2026-09-10T04:01:25Z
You are Worker M3 for the NurdiansyahLabs platform modernization.

Working Directory: /home/nurdiansyah/dev/Personal_project/.agents/worker_m3
Workspace Root: /home/nurdiansyah/dev/Personal_project
Milestone: Milestone 3 — Pricing & Commercial Conversion Flow (R3)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Context & Inputs to Read First:
1. /home/nurdiansyah/dev/Personal_project/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-10T03:06:38Z and 2026-09-08T11:48:20Z R4A, R4B, R4C)
2. /home/nurdiansyah/dev/Personal_project/.agents/orchestrator_ui_gen2/PROJECT.md
3. /home/nurdiansyah/dev/Personal_project/.agents/survey_commercial_flow/handoff.md and analysis.md
4. /home/nurdiansyah/dev/Personal_project/.agents/product-marketing.md (specifically line 15: approved pricing baseline)

Exclusive Write Ownership:
You have exclusive write access to:
- src/data/services.json
- src/components/Services.jsx
- src/components/ContactForm.jsx
- src/components/seo/SEO.jsx
- src/pages/IndustryServicePage.jsx (to fix line 113 broken /service link)
Do NOT edit backend files or files outside this scope.

Detailed Deliverables for Milestone 3:
1. Remediate Pricing Discrepancies & Align with Approved Baseline:
   - Approved source (.agents/product-marketing.md line 15): "Landing pages from Rp 500k, fullstack systems tailored per scope, and technical consultancy."
   - In `src/data/services.json` and `src/components/Services.jsx`:
     * Paket 1: Starter Web & Landing Page — Mulai Rp 500.000. (Target: UMKM, personal branding, early startup. Scope: 3-7 hari, responsive design, lead capture, WhatsApp quick CTA, basic SEO, 2x minor revision. Exclusion: Domain/hosting recurring cost).
     * Paket 2: Custom Web Application & Operational ERP — Sesuai Cakupan Proyek (Mulai Rp 2.500.000). (Target: Growing business, multi-branch, agriculture/retail/logistics. Scope: Custom database, RBAC, API integration, automated workflows, warranty & SLA support).
     * Paket 3: Technical Architecture Advisory & Enterprise Consultation — Konsultasi & Penawaran Khusus (Gratis 30-Menit Discovery). (Target: CTOs, product managers, tech leaders. Scope: Architecture audit, data/AI pipeline strategy, custom quote).
   - In `src/components/seo/SEO.jsx`: Update JSON-LD schema priceRange to "Rp 500.000 – Rp 5.000.000+" and starting price "500000".
   - STRICT INTEGRITY: Zero fabricated discounts, fake strikethrough pricing, artificial urgency timers, or fake customer numbers.
2. Direct Commercial Conversion Flow:
   - Modernize `Services.jsx` to present these 3 clear packages with distinct inclusions, limitations, deliverables, and transparent pricing.
   - Eliminate the modal dead-end for service packages: Clicking "Pilih Paket" or "Konsultasi Paket Ini" smoothly scrolls to `#contact`, pre-selects the package in `ContactForm.jsx`, and populates a tailored message draft.
   - Provide direct WhatsApp deep-link button per package with pre-filled inquiry text for frictionless mobile conversion.
3. Fix Broken Link in IndustryServicePage.jsx:
   - Line 113: Fix `<Link to="/service">` (which throws 404) to `<Link to="/#services">`.
4. Verification:
   - Run `npm run build` to confirm clean build exit 0 and static route prerendering across all 18 routes.
   - Run `PYTHONPATH=backend ./backend/venv/bin/pytest backend/tests/test_api.py` to confirm 13/13 backend tests pass.
   - Write comprehensive report to /home/nurdiansyah/dev/Personal_project/.agents/worker_m3/handoff.md.
