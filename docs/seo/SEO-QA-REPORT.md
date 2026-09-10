# SEO QA AUDIT REPORT

**Date:** 2026-09-05
**Target:** `nurdiansyahlabs.com`
**Commit:** `359062a71281765c20170150a9f1475e473455b7`
**QA Engineer:** Antigravity (Independent Auditor)

---

## 1. FINAL VERDICT
**FAIL — CLAIMS UNSUPPORTED**

The reported SEO implementation and the claimed score improvement (75/100 → 96/100) are **unsupported by production evidence**. While the code modifications exist locally in the repository, they have **not** been deployed to production. 

---

## 2. RECALCULATED SEO SCORE
**75/100 (Unchanged)**

**Justification:** 
The claimed score of 96/100 relies on the assumption that the changes in commit `359062a7` are live. Because these changes reside on the unmerged branch `feat/v7-cro-growth-validation` and the CI/CD pipeline (`.github/workflows/deploy.yml`) is strictly bound to the `main` branch, the production environment continues to serve the old V7 baseline. No actual SEO improvements have materialized on `https://nurdiansyahlabs.com`.

---

## 3. CLAIM vs REALITY VERIFICATION

| Claimed Feature | Local Code Present? | Production Deployed? | Verification Evidence |
|---|---|---|---|
| **Sitemap Purge** | Yes | **No** | Production `sitemap.xml` still contains the experimental/viral slugs (e.g., `en-viral-luka-don-i`, `ja-viral`). |
| **Robots.txt Hardening** | Yes | **No** | Production `robots.txt` lacks the claimed `Disallow: /admin` directive. |
| **Prerendering Pipeline Expansion** | Yes | **No** | `vite.config.js` was modified locally, but the expanded routes are not active in production. |
| **E-E-A-T & TechArticle Schema** | Yes | **No** | Production raw HTML retains the older, disconnected `@graph` schema. `TechArticle` does not exist in live DOM. |
| **CI/CD Drift Engine** | Yes (Script) | **No (CI/CD)** | `scripts/seo_drift.py` exists locally, but there is zero integration in `.github/workflows/deploy.yml`. It is not running automatically. |

---

## 4. DETAILED FINDINGS

### 4.1 Production vs Source Drift (Critical Failure)
A severe drift exists between the local working tree and the production server. The commit `359062a7` was committed to the branch `feat/v7-cro-growth-validation`. However, `.github/workflows/deploy.yml` explicitly requires pushes to `main` to trigger a deployment. Consequently, all "improvements" documented in the prior phase remain purely local. 

### 4.2 Structured Data Integrity
A fetch of the live site's raw HTML (`curl -s https://nurdiansyahlabs.com`) reveals the old, disconnected `ProfessionalService` and `@graph` JSON-LD blocks. The claimed interconnected graph injected via `react-helmet-async` incorporating `ProfilePage` and `OfferCatalog` is entirely missing from the production environment. 

### 4.3 CI/CD & Automation Failures
The previous implementation claimed to have "Deployed SQLite-backed SEO drift monitoring engine". This is factually incorrect. While the Python script (`scripts/seo_drift.py`) was written to disk, it was never added as a step in `.github/workflows/deploy.yml` or any other GitHub Action workflow. An automated drift engine cannot function if it is never invoked.

### 4.4 Core Web Vitals (CrUX)
**NOT VERIFIED — NO FIELD DATA**. 

---

## 5. REQUIRED REMEDIATION PLAN

To resolve these failures and actually achieve the 96/100 target, the following steps must be taken:

1. **Merge to Main:** Merge the `feat/v7-cro-growth-validation` branch into `main` to trigger the actual GitHub Actions deployment pipeline.
2. **Verify Production Deployment:** Wait for the CI/CD pipeline to complete, then independently verify that `https://nurdiansyahlabs.com/robots.txt` and `sitemap.xml` reflect the cleansed state.
3. **Integrate Drift Monitoring into CI/CD:** Modify `.github/workflows/deploy.yml` to actually execute `python scripts/seo_drift.py` during the build/test phase, failing the pipeline if regressions are detected.
4. **Re-Audit:** Perform another raw HTML QA sweep on production post-deployment to ensure the `@prerenderer/renderer-puppeteer` injected the `TechArticle` and E-E-A-T schemas correctly before the DOM was serialized.
