# NurdiansyahLabs — Evidence-Based CRO & Growth Validation Report (V7)

**Auditor & Engineer:** Principal Software Architect & Growth Engineer  
**Target:** `https://nurdiansyahlabs.com`  
**Date:** 2026-09-05  
**Runtime:** React 18 + Vite PWA $\rightarrow$ Python 3.13.15 + Flask 3.1.3 Modular Monolith $\rightarrow$ PostgreSQL 13 (CloudLinux LiteSpeed WSGI)

---

## 1. Executive Summary

In Master Prompt V7, we transitioned from subjective redesigns to **evidence-based CRO, telemetry closure, and objective positioning validation**.

Using live queries against production PostgreSQL (`uygpuazs_dilindo`), we audited exact interaction data, reconciled real project records against marketing claims, closed critical instrumentation gaps across Hero and Contact conversion points, and compiled an actionable, ICE-ranked experimentation backlog.

---

## 2. Evidence Before Change (Measured vs. Observed)

From the production PostgreSQL database:
- **Total Inbound Leads:** Exactly **1 lead** recorded in production (`leads` table) dated 2026-06-24.
- **Total Telemetry Rows:** **2,471 rows** in `analytics`:
  - `pageview`: 2,147 (86.9%)
  - `view_showcase_modal`: 203 (8.2%)
  - `click_project`: 117 (4.7%)
  - `read_article`: 4 (0.2%)
- **Active Projects:** **18 dynamic systems** stored in `projects`.
- **Instrumentation Blind Spots Discovered:**
  - Zero telemetry on Hero CTA button clicks (`hero_primary_cta`, `hero_secondary_cta`);
  - Zero telemetry on outbound WhatsApp consultation clicks (`whatsapp_click`);
  - Zero telemetry on Contact Form interaction stages (`lead_form_start`, `lead_form_submit`, `lead_form_success`, `lead_form_error`).

---

## 3. Problems Identified (Ranked by Impact)

1. **Conversion Blind Spot (Critical - Impact 5):** Complete absence of event tracking between viewing showcase modals and clicking contact buttons made it impossible to know where visitors drop out of the acquisition funnel.
2. **Unverified Social Proof Risk (High - Impact 4):** Hero stat counter previously stated `"50+ Clients Served"` while database proof accounts for 18 production systems and 1 recorded web lead. This created credibility exposure for discerning tech recruiters and enterprise clients.
3. **Missing Telemetry on External Inquiries (High - Impact 4):** Since Indonesian SME clients predominantly convert via WhatsApp (`wa.me/*`), untracked outbound links caused 100% of WhatsApp lead attempts to be invisible to analytics.
4. **Lack of Machine-Readable AEO Context (Medium - Impact 3):** AI answer engines lacked explicit entity mapping connecting Nurdiansyah with Flask modular monoliths and specific showcase systems.

---

## 4. Changes Implemented

### 4.1 Telemetry & Analytics Instrumentation
- **[`src/components/Hero.jsx`](file:///home/nurdiansyah/Development/Personal_project/src/components/Hero.jsx):**
  - Integrated `useTracker` hook.
  - Attached `trackEvent('hero_secondary_cta', { target: '#services', text: ... })` to "Explore Live Demos".
  - Attached `trackEvent('hero_primary_cta', { target: 'whatsapp', text: ... })` and `trackEvent('whatsapp_click', { location: 'hero' })` to WhatsApp CTA.
  - Replaced unverified stat counter `"50+"` with verified `"18+"` (`hero.stat1`).
- **[`src/components/CTA.jsx`](file:///home/nurdiansyah/Development/Personal_project/src/components/CTA.jsx):**
  - Attached `trackEvent('whatsapp_click', { location: 'footer_cta' })` to WhatsApp button.
  - Attached `trackEvent('email_click', { location: 'footer_cta' })` to mailto button.
- **[`src/components/ContactForm.jsx`](file:///home/nurdiansyah/Development/Personal_project/src/components/ContactForm.jsx):**
  - Added `hasStartedForm` tracking state: triggers `lead_form_start` on first input/service selection.
  - Added `trackEvent('lead_form_submit', { service: ... })` on form submission initiation.
  - Added `trackEvent('lead_form_success', { service: ..., lead_id: ... })` upon receiving HTTP 201 response.
  - Added `trackEvent('lead_form_error', { code: ... })` on submission failure.

### 4.2 Copywriting & Epistemic Alignment
- **[`src/i18n/lang_en_id.js`](file:///home/nurdiansyah/Development/Personal_project/src/i18n/lang_en_id.js):**
  - Updated `hero.stat1` in English: `"Verified Systems"`.
  - Updated `hero.stat1` in Indonesian: `"Sistem Terverifikasi"`.
  - Hero badge and descriptions grounded strictly in production-verified software engineering capabilities.

### 4.3 Documentation Created
- [`docs/marketing/V7-BASELINE.md`](file:///home/nurdiansyah/Development/Personal_project/docs/marketing/V7-BASELINE.md)
- [`docs/marketing/QUALIFIED-LEAD-DEFINITION.md`](file:///home/nurdiansyah/Development/Personal_project/docs/marketing/QUALIFIED-LEAD-DEFINITION.md)
- [`docs/marketing/V7-ANALYTICS-SPEC.md`](file:///home/nurdiansyah/Development/Personal_project/docs/marketing/V7-ANALYTICS-SPEC.md)
- [`docs/marketing/V7-CRO-AUDIT.md`](file:///home/nurdiansyah/Development/Personal_project/docs/marketing/V7-CRO-AUDIT.md)
- [`docs/marketing/V7-SEO-AEO-AUDIT.md`](file:///home/nurdiansyah/Development/Personal_project/docs/marketing/V7-SEO-AEO-AUDIT.md)
- [`docs/marketing/V7-EXPERIMENT-BACKLOG.md`](file:///home/nurdiansyah/Development/Personal_project/docs/marketing/V7-EXPERIMENT-BACKLOG.md)
- [`docs/marketing/V7-GROWTH-ROADMAP.md`](file:///home/nurdiansyah/Development/Personal_project/docs/marketing/V7-GROWTH-ROADMAP.md)

---

## 5. Production Verification & Test Results

```bash
# 1. Full Backend Pytest Suite
# => 13 of 13 tests PASSED in 4.58s on Python 3.13.15 runtime

# 2. Frontend Production Build (Vite)
# => Built successfully in 14.18s with zero errors

# 3. Live HTTP Endpoint Probes
curl -skS https://nurdiansyahlabs.com/api/v1/health
# => HTTP 200 OK (status: ok, database: ok)

curl -skS https://nurdiansyahlabs.com/llms.txt
# => HTTP 200 OK (Machine-readable AI entity index verified)

curl -skS https://nurdiansyahlabs.com/api/
# => HTTP 410 Gone (Legacy PHP retired tombstone verified)
```

---

## 6. Unknowns & Unmeasured Items

- **Visitor-to-Lead Baseline Ratio:** Cannot be calculated accurately until the new telemetry runs in production over a minimum 14-to-30-day window.
- **Channel Attribution (UTM):** Direct vs. Organic traffic is currently combined; fine-grained campaign source breakdown is not yet instrumented.

---

## 7. Remaining Risks

- **Low Traffic Density:** Because daily volume is modest, statistical significance on standard A/B testing is not achievable in days. We must rely on sequential before/after measurement and event ratio analysis.
- **WhatsApp External Drop-off:** While clicking WhatsApp is now measured (`whatsapp_click`), whether the user actually clicks "Send" inside the native WhatsApp app remains invisible to web telemetry.

---

## 8. V8 Recommendations (Evidence-Driven)

1. **Monitor New Telemetry Events:** Review PostgreSQL `analytics` table after 14 days to observe the actual ratio between `pageview` $\rightarrow$ `hero_primary_cta` $\rightarrow$ `whatsapp_click` $\rightarrow$ `lead_form_success`.
2. **Execute EXP-003 (Case Study Depth):** Write 2 technical architecture teardowns on `/blog/` to capture organic technical traffic from developers and engineering recruiters searching for modular monolith case studies.
