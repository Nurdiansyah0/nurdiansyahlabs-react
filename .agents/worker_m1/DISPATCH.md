## 2026-09-10T03:09:42Z

You are Worker M1 for the NurdiansyahLabs platform modernization.

Working Directory: /home/nurdiansyah/dev/Personal_project/.agents/worker_m1
Workspace Root: /home/nurdiansyah/dev/Personal_project
Milestone: Milestone 1 — Design Tokens & Visual Design System (R1)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Context & Inputs to Read First:
1. /home/nurdiansyah/dev/Personal_project/.agents/ORIGINAL_REQUEST.md (specifically the latest prompt from 2026-09-10T03:06:38Z and 2026-09-08T11:48:20Z)
2. /home/nurdiansyah/dev/Personal_project/.agents/orchestrator_ui_gen2/PROJECT.md
3. /home/nurdiansyah/dev/Personal_project/.agents/survey_ui_audit/handoff.md and analysis.md
4. /home/nurdiansyah/dev/Personal_project/.agents/survey_frontend_arch/analysis.md

Exclusive Write Ownership:
You have exclusive write access to:
- tailwind.config.js
- src/index.css
- src/hooks/useResponsive.js
- src/components/Footer.jsx
- src/components/Navbar.jsx
- Subpage layout files if needed for global navigation consistency (e.g. src/components/Layout.jsx or wrapping src/pages/BlogListing.jsx, src/pages/BlogPage.jsx, src/pages/ServicePage.jsx, src/pages/TrendsDashboard.jsx)
Do NOT modify backend code, API contracts, or files outside this scope.

Detailed Deliverables for Milestone 1:
1. Standardize Design Tokens in Tailwind & CSS:
   - Standardize color palette: Canvas deep slate (#0B0F17), clean surface card styles (slate-900/80, border-slate-800/80 or border-white/10), electric indigo/cyan accents (#6366F1, #06B6D4).
   - Standardize typography scale and clean hierarchy (Inter / Plus Jakarta Sans font stack with clean fallbacks).
   - Standardize consistent card surfaces, shadows, and subtle micro-interactions; eliminate jarring animations and visual clutter.
2. Fix P0 Accessibility / Contrast Failure in Footer.jsx:
   - Replace the dark gray text color '#1f2937' on dark background '#111827' (which currently fails WCAG AA with a 1.15:1 contrast ratio) with accessible high-contrast values (#9CA3AF / #E5E7EB / #FFFFFF) for text, links, copyright, and social anchors.
   - Ensure all links and interactive elements have clear focus/hover states.
3. Fix the Inverted Responsive Logic (useResponsive.js):
   - In useResponsive.js and components like Navbar.jsx, fix the inverted logic where `isSm ? mobile : desktop` caused desktop to receive small sizes and mobile to receive large sizes. Ensure desktop screens get desktop sizing and mobile screens get mobile sizing.
4. Navigation Shell Consistency:
   - Ensure Navbar and Footer are consistently present on subpages (BlogListing, BlogPage, ServicePage, TrendsDashboard) so visitors never get stranded without a header/footer.
5. Verification:
   - Run `npm run build` to verify clean Vite build and static route prerendering (must exit code 0).
   - Document all changes, before/after contrast measurements, and build outputs in /home/nurdiansyah/dev/Personal_project/.agents/worker_m1/handoff.md.
