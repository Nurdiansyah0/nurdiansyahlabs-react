# Qualified Lead Definition — NurdiansyahLabs

**Version:** 1.0.0 (2026-09-05)  
**Objective:** Establish objective, non-fabricated criteria for evaluating inbound inquiries to prevent vanity optimization.

---

## 1. Context & Purpose

NurdiansyahLabs is not a mass-market commodity service. It is a specialized personal engineering platform and software studio delivering:
- Custom Fullstack Web Applications (React, Flask, PostgreSQL)
- Operational ERP Systems (e.g. Primatera Poultry ERP, LogiStack WMS)
- Business Intelligence Dashboards (Sales analytics, predictive models)
- High-Converting Commercial Landing Pages

Optimizing purely for lead volume (e.g., student inquiries, spam, speculative low-ball projects) harms focus. We define an **Engineering-Qualified Lead (EQL)**.

---

## 2. Engineering-Qualified Lead (EQL) Criteria

An inquiry is categorized as an **EQL** when it satisfies at least **3 of the 5** core criteria below:

| Dimension | Criteria | Disqualifying Indicators |
| :--- | :--- | :--- |
| **1. Business Need** | Concrete commercial need (ERP, POS, internal tool, e-commerce, or landing page). | General curiosity, school homework assistance, vague exploratory requests. |
| **2. Scope Clarity** | Identifiable workflow or project requirements (e.g., "we need to track inventory for 3 warehouses"). | "Can you build an app like Gojek for Rp 500k?". |
| **3. Realistic Budget & Timeline** | Project budget aligns with engineering scope (Landing pages from Rp 500k; custom fullstack systems proportional to complexity). | Expectation of free speculative labor or unreasonable turnaround without scope. |
| **4. Stakeholder Authority** | Sender is a business founder, product manager, operations lead, or recruiter. | Anonymous inquiries with unverified contact information. |
| **5. Technical Compatibility** | Project benefits from modern web architectures, API integration, or data intelligence. | Requests to pirate proprietary software or configure blackhat automation. |

---

## 3. Lead Triage Stages

1. **Captured Lead (`leads` table):**
   - Inbound form submitted or WhatsApp link clicked.
   - Status: `NEW`.
2. **Contact Validation:**
   - Email address or WhatsApp phone number confirmed reachable.
   - Status: `VALIDATED`.
3. **Requirement Discovery:**
   - Brief asynchronous exchange or 15-minute scoping call.
   - Status: `QUALIFIED` or `UNQUALIFIED`.
4. **Proposal / Engagement:**
   - Concrete scope, milestones, and deliverables agreed upon.
   - Status: `COMMISSIONED`.

---

## 4. Measurement Policy

- The website analytics must track `lead_form_submit` and `whatsapp_click`.
- However, the conversion rate reported to stakeholders must distinguish between **Gross Submissions** and **EQLs**.
