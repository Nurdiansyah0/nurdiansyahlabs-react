# UX Pro Max Design System Specification — NurdiansyahLabs

**Product Classification:** Software Engineering Platform & Technical Showcase  
**Document Version:** 1.0.0 (2026-09-05)  
**Status:** PROPOSED & DEFERRED (Audit Baseline; V7 CRO Marketing Freeze Preserved)  
**Design Intelligence Engine:** UI/UX Pro Max Skill v2.15.0 (`ui-ux-pro-max-cli` 2.2.3)

---

## 1. Product Classification

NurdiansyahLabs is classified as:
```text
Software Engineering / Developer Portfolio / Custom Application Studio / Technical Showcase
```

### Why this category applies:
- **Core Offering:** Not a commodity product or mass-market consumer app, but custom fullstack applications (React, Flask, PostgreSQL), operational ERP systems (e.g. Primatera), and data intelligence dashboards.
- **Dual Audience:**
  1. Business owners and operations managers looking for reliable, high-converting digital applications.
  2. Technical recruiters and engineering leaders evaluating architecture maturity, clean code standards, and production robustness.
- **Positioning Requirement:** Must communicate engineering maturity, technical precision, sub-150ms performance, and verifiable production evidence without gimmicky agency fluff or generic template tropes.

---

## 2. Recommended Pattern

**Selected Pattern:** `Portfolio Grid + Technical Proof System` (adapted from UI/UX Pro Max `Portfolio Grid` & `Interactive Product Demo` patterns).

### Why the page structure fits:
- **Visuals & Functional Proof First:** Direct demonstration of 18 live interactive systems via interactive modal previews and deep-dive routes (`/showcase/*`).
- **Clear CTA Progression:**
  - *Primary Conversion:* WhatsApp Consultation (`whatsapp_click` / direct inquiry).
  - *Secondary Conversion:* Project Scoping / Contact Form (`lead_form_start` $\rightarrow$ `lead_form_submit` $\rightarrow$ `lead_form_success`).
- **Logical Section Sequence:**
  1. **Hero:** Problem-aware value proposition + verified systems proof counters (`18+ Verified Systems`) + 3D architecture backdrop.
  2. **Services & Interactive Showcase:** 4 core capabilities (Landing Pages, Fullstack Systems, Data Analytics, Machine Learning) with live interactive modal previews.
  3. **Technical Architecture / Why Us:** Engineering principles (speed, PostgreSQL data integrity, maintainable code).
  4. **Conversion / CTA Section:** Dual contact paths (low-friction WhatsApp and structured async scoping form).
  5. **Footer:** CI/CD build status badge, social profiles, licensing, and machine-readable links (`llms.txt`, `sitemap.xml`).

---

## 3. Recommended Visual Style

**Selected Style:** `Minimal Swiss Technical + Dark Precision Accents` (derived from UI/UX Pro Max `Minimal Swiss` typography + `Dark Mode (OLED)` depth accents).

- **Visual Philosophy:** Clean, content-focused, high contrast, typography-driven clarity with deliberate dark technical accents (Hero, Terminal, Code Showcases).
- **Style Keywords:** Clean, functional, high-density readability, developer precision, authentic metrics, subtle borders, high-contrast surfaces.
- **Accessibility Rating:** WCAG AAA for core text, WCAG AA for secondary badges.
- **Performance Impact:** Zero runtime overhead (standard CSS + lightweight SVGs; no heavy external canvas or bloated 3D libraries).

---

## 4. Color System

| Token | Hex Value | Semantic Usage | WCAG Contrast on BG |
| :--- | :--- | :--- | :--- |
| `--color-bg-canvas` | `#090818` | Deep space hero canvas (Cinematic background) | N/A |
| `--color-bg-surface` | `#ffffff` | Main content cards, modals, form containers | N/A |
| `--color-bg-subtle` | `#f8fafc` | Alternating section backgrounds, table headers | N/A |
| `--color-text-primary` | `#0f172a` | Primary headings, card titles, form inputs | 15.8:1 on `#fff` (AAA) |
| `--color-text-secondary` | `#334155` | Body copy, technical descriptions | 9.7:1 on `#fff` (AAA) |
| `--color-text-muted` | `#64748b` | Timestamps, metadata, hints, breadcrumbs | 4.6:1 on `#fff` (AA) |
| `--color-brand-primary` | `#312e81` | Brand Indigo (Headings, primary accents) | 12.1:1 on `#fff` (AAA) |
| `--color-brand-accent` | `#4338ca` | Interactive links, focus rings, hover highlights | 8.4:1 on `#fff` (AAA) |
| `--color-cta-green` | `#166534` | High-intent conversion action (WhatsApp button) | 5.3:1 on `#dcfce7` (AA) |
| `--color-border-subtle` | `#e2e8f0` | Card borders, dividers, subtle outlines | UI boundary standard |
| `--color-border-active` | `#cbd5e1` | Input focus boundary, active tab indicators | 3:1 graphical object |
| `--color-status-success` | `#15803d` | Form submission success, validated indicators | 5.1:1 on `#f0fdf4` |
| `--color-status-error` | `#b91c1c` | Validation errors, failed status notices | 5.8:1 on `#fef2f2` |
| `--color-status-warning` | `#b45309` | Warning alerts, deprecation notices | 4.8:1 on `#fffbeb` |

---

## 5. Typography System

The typography system uses high-legibility system sans paired with precise monospaced technical font tokens:

- **Display & Heading Font:** `Inter`, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif (Weights: 700, 800, 900)
- **Body Font:** `Inter`, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif (Weights: 400, 500, 600)
- **Technical / Code / Monospace:** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace` (Weights: 400, 500)

### Type Scale (Fluid clamp scaling)
- **Display H1:** `clamp(1.75rem, 5.5vw, 3.5rem)` / Line-height: `1.15` / Tracking: `-0.03em`
- **Section H2:** `clamp(1.5rem, 4vw, 2.5rem)` / Line-height: `1.2` / Tracking: `-0.02em`
- **Card H3:** `clamp(1.1rem, 2vw, 1.35rem)` / Line-height: `1.3` / Tracking: `-0.01em`
- **Body Regular:** `1rem` (16px) / Line-height: `1.65` / Color: `#334155`
- **Body Small:** `0.875rem` (14px) / Line-height: `1.5` / Color: `#475569`
- **Caption / Meta:** `0.75rem` (12px) / Line-height: `1.4` / Tracking: `0.04em`

---

## 6. Spacing & Layout System

Base 8-point harmonic grid:

- **Spacing Tokens:**
  - `4px` (`--space-1`) — Micro gaps between icon and text.
  - `8px` (`--space-2`) — Badge padding, button icon gap.
  - `12px` (`--space-3`) — Card header internal padding, tag spacing.
  - `16px` (`--space-4`) — Standard container padding, input padding.
  - `24px` (`--space-6`) — Card internal padding, grid column gap.
  - `32px` (`--space-8`) — Sub-section gaps, modal gutters.
  - `48px` (`--space-12`) — Major component separations.
  - `clamp(3rem, 7vw, 5.5rem)` (`--section-py`) — Fluid vertical section rhythm.

- **Breakpoints:**
  - `375px` — Compact Mobile (iPhone SE / budget Android)
  - `640px` — Mobile Landscape / Phablet (`sm`)
  - `768px` — Tablet (`md`)
  - `1024px` — Small Desktop / Laptop (`lg`)
  - `1280px` — Large Desktop (`xl`)
  - `1440px` — High-Res Desktop / Studio Display

---

## 7. Component Principles

1. **Buttons:**
   - Minimum tap target: `44px × 44px` across all responsive viewports.
   - Distinct visual hierarchy: Solid High-Contrast primary, Ghost/Subtle secondary.
   - Required states: Default, Hover (transition: 150-200ms), Active (scale: 0.98), Focus-Visible (outline: 2px solid `#4338ca`, outline-offset: 2px).
2. **Cards (Services & Projects):**
   - Clean boundaries: 1px subtle border (`#e2e8f0`) + soft drop-shadow.
   - Elevation on hover: Subtle `translateY(-4px)` with shadow expansion, strictly disabled if `prefers-reduced-motion: reduce`.
3. **Form Inputs:**
   - Explicit `<label>` elements linked via `htmlFor` (never placeholder-only).
   - High contrast borders with distinct active ring on `:focus-visible`.
   - Accessible inline error feedback with `role="alert"` and icons.
4. **Modals (Portfolio Previews):**
   - Body scroll locked when opened, keyboard `ESC` listener active.
   - Focus trapped within modal container during interaction.
   - Visible, accessible close button with `aria-label="Close modal"` (44px target).
5. **Chips & Badges:**
   - Explicit `nowrap` on compact status indicators paired with container flex-wrapping to prevent clipping or orphan text.

---

## 8. Motion & Micro-Interactions

- **Timing Function:** `cubic-bezier(0.4, 0, 0.2, 1)` (Standard smooth ease).
- **Durations:**
  - Micro-interactions (hover, toggle, focus): `150ms – 200ms`.
  - Modal entrances, drawer transitions: `250ms – 300ms`.
  - Page/scroll reveal: `400ms – 500ms`.
- **Accessibility Gate (`prefers-reduced-motion`):**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 9. Anti-Patterns to Avoid

1. **DO NOT introduce AI generic purple/magenta neon gradients** across white backgrounds.
2. **DO NOT use emojis in place of UI icons** (always use Lucide/SVG with accessible aria-labels).
3. **DO NOT truncate critical numbers or project titles** without accessible tooltips or expand paths.
4. **DO NOT rely on color alone** to convey status (combine green/red with check/alert SVG icons).
5. **DO NOT use animations longer than 500ms** for standard UI elements.
6. **DO NOT hide form input labels** inside placeholders.
7. **DO NOT create clickable elements smaller than 44px × 44px** on touch viewports.
