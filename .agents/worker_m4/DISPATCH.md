## 2026-09-10T04:24:37Z

You are Worker M4 for the NurdiansyahLabs platform modernization.

Working Directory: /home/nurdiansyah/dev/Personal_project/.agents/worker_m4
Workspace Root: /home/nurdiansyah/dev/Personal_project
Milestone: Milestone 4 — Trust & Credibility Showcase (R4)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Context & Inputs to Read:
1. /home/nurdiansyah/dev/Personal_project/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-10T03:06:38Z and 2026-09-08T11:48:20Z R5)
2. /home/nurdiansyah/dev/Personal_project/.agents/orchestrator_ui_gen2/PROJECT.md
3. /home/nurdiansyah/dev/Personal_project/.agents/survey_ui_audit/handoff.md and analysis.md
4. /home/nurdiansyah/dev/Personal_project/.agents/survey_commercial_flow/handoff.md

Exclusive Write Ownership:
You have exclusive write access to:
- src/data/showcase.json
- src/components/PortfolioModal.jsx
- src/showcases/apps/RecommendationPlaceholderApp.jsx
- src/i18n/lang_eu.js
- src/i18n/lang_asia.js
Do NOT edit backend files or files outside this scope.

Detailed Deliverables for Milestone 4:
1. Eliminate Fabricated International Marketing Claims (lang_eu.js & lang_asia.js):
   - In `src/i18n/lang_eu.js` lines 4, 8, 43, 47: Replace fabricated "50+ clients" claims ("APPROUVÉ PAR PLUS DE 50 CLIENTS", "VERTRAUT VON 50+ KUNDEN", etc.) with authentic engineering statements ("18+ MODUL TERVERIFIKASI", "18+ SYSTEM-MODULE VERIFIZIERT", etc.).
   - In `src/i18n/lang_asia.js` lines 4, 37, 70: Replace fabricated "50+ clients" claims in Japanese, Korean, and Chinese with authentic engineering metrics ("18+ 認証済みシステムモジュール", "18+ 검증된 システム 모듈", "18+ 验证系统模块").
   - Ensure ZERO fake customer numbers or fabricated claims exist in any translation file.
2. Eliminate Dead "Under Construction" Placeholder & Fake 23% Metric:
   - In `src/components/PortfolioModal.jsx` line 60: The text claimed "Product Recommendation Engine: Collaborative filtering system boosting cross-sell by 23%" linking to `/showcase/data-science/recommendation`.
   - In `src/showcases/apps/RecommendationPlaceholderApp.jsx`: It currently renders "Sistem rekomendasi AI cerdas menggunakan Collaborative Filtering sedang dalam tahap pengembangan (Under Construction)."
   - Remediate:
     * Remove the fabricated "boosting cross-sell by 23%" claim.
     * Turn `RecommendationPlaceholderApp.jsx` into a functioning, authentic interactive demonstration (or feature the real Smart Vision AI edge computer vision / predictive telemetry from the codebase). If retaining the recommendation demo, build a genuine interactive Collaborative Filtering matrix demo that actually computes cosine similarity on real sample movie/product vectors in-browser, with real formulas and interactive input!
     * Update `PortfolioModal.jsx` description to accurately reflect the real interactive capability without fake business metrics.
3. Authenticate Showcases in `src/data/showcase.json`:
   - Verify that all projects listed in `showcase.json` describe authentic technical capabilities of the real applications in the repository (Primatera Poultry ERP, Batam Rental Mobil PWA, LogiStack WMS, Koperasi POS, Smart Vision AI).
   - Ensure descriptions highlight real engineering achievements: offline-first PWA, paperless logs, sub-second query response, edge computer vision.
4. Verification:
   - Run `npm run build` and ensure clean build with exit code 0 and all 18 static routes prerendering in `dist/`.
   - Run `PYTHONPATH=backend ./backend/venv/bin/pytest backend/tests/test_api.py` and ensure 13/13 backend tests pass.
   - Write comprehensive report to /home/nurdiansyah/dev/Personal_project/.agents/worker_m4/handoff.md.

Update your progress.md regularly. When complete, send a message back with your handoff path.
