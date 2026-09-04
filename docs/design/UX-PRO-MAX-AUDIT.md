# UI/UX Pro Max Audit Matrix — NurdiansyahLabs

**Audit Target:** NurdiansyahLabs Web Application (`https://nurdiansyahlabs.com`)  
**Methodology:** UI/UX Pro Max Design Intelligence (WCAG 2.1 AA/AAA, 119 UX Guidelines, Responsive Resilience)  
**Date:** September 5, 2026  
**Status:** AUDITED & PRIORITIZED (No unauthorized redesigns; V7 CRO Marketing Freeze Preserved)

---

## 1. Executive Summary & 5-Second Test Evaluation

### 5-Second Visual Test:
- **What is the site?** A specialized personal engineering platform and software studio delivering custom fullstack systems, data dashboards, and landing pages.
- **Who does it represent?** Nurdiansyah, a Fullstack Software Engineer & Data Specialist based in Batam, Indonesia.
- **What is being offered?** 4 concrete service pillars with transparent pricing (Landing Pages, Fullstack Systems, Data Analytics, Machine Learning) backed by 18 live interactive systems.
- **What is the primary action?** Consultation via WhatsApp (`hero_primary_cta`, `whatsapp_click`) or async proposal request via Contact Form.
- **Verdict:** **PASS**. Core value proposition and action hierarchy are immediately scannable within 3 seconds.

---

## 2. Findings Matrix

| Finding ID | Page | Component | Category | Severity | Current Behavior | UI/UX Pro Max Principle | Recommended Remediation | Impact | Effort | Risk | V7 Compatibility | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **UX-001** | Global | Global CSS / Animations | `MOTION` | **HIGH** | `index.css` defines animations (`fadeInUp`, `slideUp`, `scaleIn`) without a `@media (prefers-reduced-motion: reduce)` wrapper. | *Animation Rule:* Always respect user vestibular preference (`prefers-reduced-motion`). | Add a global `@media (prefers-reduced-motion: reduce)` rule in `index.css` to collapse animations to 0.01ms. | High (A11y) | Low | Low | Fully Compatible | Deferred (Freeze) |
| **UX-002** | Home / Contact | `ContactForm.jsx` | `ACCESSIBILITY` | **MEDIUM** | Dropdown button for service selection lacks explicit `aria-expanded` and `aria-haspopup` attributes. | *A11y Rule:* Custom select/dropdowns must communicate state to screen readers. | Add `aria-haspopup="listbox"` and `aria-expanded={isDropdownOpen}` to service selector button. | Medium | Low | Low | Fully Compatible | Deferred (Freeze) |
| **UX-003** | Home / Navbar | `Navbar.jsx` | `ACCESSIBILITY` | **MEDIUM** | Language switcher button uses generic fallback `aria-label="Action button"`. | *A11y Rule:* Interactive controls must have descriptive semantic labels. | Change `aria-label` to `"Select language"` and add `aria-expanded={langOpen}`. | Medium | Low | Low | Fully Compatible | Deferred (Freeze) |
| **UX-004** | Global | Global Tokens | `DESIGN SYSTEM` | **MEDIUM** | Color hex values (`#312e81`, `#166534`, `#1e1b4b`) are declared inline across components rather than referencing centralized CSS variables. | *System Rule:* Colors and spacing must be driven by semantic design tokens for consistency. | Migrate inline hex values to semantic CSS custom properties in `index.css` / Tailwind theme. | High | Medium | Medium | Deferred (Freeze) |
| **UX-005** | Home / Modal | `PortfolioModal.jsx` | `INTERACTION` | **MEDIUM** | Modal overlay traps mouse scroll via `document.body.style.overflow = 'hidden'`, but does not trap keyboard tab focus within modal container. | *A11y Rule:* Modal dialogs must trap keyboard focus while open to prevent tabbing behind overlay. | Implement focus trap on modal open and restore focus on dismiss. | High (A11y) | Medium | Low | Deferred (Freeze) |
| **UX-006** | Showcase | `ShowcaseLayout.jsx` | `RESPONSIVE` | **LOW** | Floating badge (`Live Project By Nurdiansyah Labs`) uses `bottom: 5rem` on mobile, which may partially obscure bottom-nav bars in mobile browser Chrome. | *Mobile Rule:* Ensure floating elements leave safe margins from mobile browser viewports. | Adjust mobile floating offset to `bottom: clamp(4rem, 10vh, 5.5rem)` or collapse to pill on scroll. | Low | Low | Low | Deferred (Freeze) |
| **UX-007** | Blog | `BlogListing.jsx` | `RESILIENT TEXT` | **LOW** | Truncates article description at strict character length (`article.description.slice(0, 120) + '...'`) instead of CSS `line-clamp`. | *Resilient Text Rule:* Prefer CSS `-webkit-line-clamp` over JavaScript string slicing for natural multiline flow. | Replace JS slice with Tailwind `line-clamp-2` or CSS `-webkit-line-clamp: 3`. | Low | Low | Low | Deferred (Freeze) |
| **UX-008** | Home / Services | `Services.jsx` | `INTERACTION` | **LOW** | Service cards use `role="button"` and `tabIndex={0}`, but lack `:focus-visible` styling distinct from mouse hover. | *A11y Rule:* Keyboard focus must have distinct, high-contrast visual ring. | Add explicit `:focus-visible` outline (`2px solid #4338ca`) to service card styles. | Medium | Low | Low | Deferred (Freeze) |

---

## 3. Severity Distribution

- **CRITICAL:** `0` (Zero blocking defects, zero layout crashes, zero unhandled errors).
- **HIGH:** `1` (Vestibular motion preference accessibility gate).
- **MEDIUM:** `4` (ARIA labels on dropdowns, keyboard focus trap in modal, semantic token centralization, focus-visible outlines).
- **LOW:** `3` (Mobile floating badge clearance, CSS line-clamp in blog, card keyboard ring).

---

## 4. Top 10 Mobile UX Observations

1. **Touch Target Size:** Buttons and interactive links comply with `44px × 44px` minimum height requirement across all pages.
2. **Mobile Navigation:** Hamburger drawer opens smoothly with blur backdrop and closes on link click or hash change.
3. **Fluid Typography:** Heading sizes scale down safely from `3.75rem` desktop to `1.6rem` mobile using CSS `clamp()`.
4. **Hero CTA Layout:** Flex-wrap ensures WhatsApp and Explore buttons stack cleanly on devices $< 375\text{px}$ without overflow.
5. **Horizontal Overflow:** `overflow-x: hidden` enforced on `html` and `body`; zero horizontal scrolling on mobile viewports.
6. **Form Inputs:** 16px font-size on mobile inputs prevents automatic iOS Safari auto-zoom on input focus.
7. **Service Card Stacking:** 4-column desktop grid reflows to 1-column mobile stack seamlessly.
8. **Modal Usability:** Modal header features sticky 44px close icon and vertical touch scrolling.
9. **Showcase Floating Badge:** Present on all `/showcase/*` screens, allowing 1-tap return to main domain.
10. **Touch Latency:** `touch-action: manipulation` applied to buttons to eliminate the 300ms touch delay on WebKit browsers.

---

## 5. Top 10 Desktop UX Observations

1. **Information Density:** High-value scanability allows technical evaluators to review capabilities, verified proof, and tech stack in under 2 minutes.
2. **Interactive Proof Modals:** Allows instant previewing of 18 systems without navigating away from the core conversion funnel.
3. **Contrast Compliance:** Deep dark hero canvas (`#090818`) paired with light body surface (`#ffffff`) delivers crisp visual differentiation.
4. **Subtle Motion:** 3D particles and card elevation provide a polished, modern feel without exceeding 300ms interaction latency.
5. **Dual Conversion Channels:** Catches both immediate synchronous inquiries (WhatsApp) and detailed asynchronous project briefs (Form).
6. **Live CI/CD Deployment Badge:** Footer integration with GitHub Actions demonstrates active deployment health and transparency.
7. **Visual Noise Level:** Zero gratuitous stock photography, fake customer reviews, or decorative cartoon illustrations.
8. **Grid Alignment:** Consistent 1280px max-width container with 8-point harmonic column spacing.
9. **Navigation Persistence:** Sticky header with backdrop blur provides permanent access to navigation and language switching.
10. **Font Hierarchy:** Clean separation between display sans and code monospaced elements across technical showcases.
