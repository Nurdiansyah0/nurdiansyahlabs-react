# NurdiansyahLabs — Growth & CRO Experiment Backlog (V7)

**Framework:** Corey Haines Experimentation Protocol  
**Scoring Model:** ICE (Impact × Confidence ÷ Effort, scale 1–5)  
**Rule:** Only claim experiment success when measured against production baseline.

---

## Active & Prioritized Experiments

### EXP-001: Verified Systems vs. Unverified Clients Social Proof
- **Hypothesis:** Replacing unverified "50+ Clients" with verified "18+ Verified Systems" will increase technical credibility and raise WhatsApp inquiry initiation among engineering-minded founders.
- **Problem:** Discerning clients suspect unverified agency claims.
- **Evidence:** Codebase audit revealed exactly 18 active database-driven systems in PostgreSQL `projects`.
- **Change:** Updated Hero badge and Hero stat counter to "18+ Verified Systems".
- **Primary Metric:** `whatsapp_click` and `hero_primary_cta` click rate.
- **Secondary Metric:** `lead_form_submit` count.
- **Status:** **DEPLOYED & INSTRUMENTED**. Awaiting 30-day baseline data.
- **ICE Score:** Impact: 4, Confidence: 5, Effort: 1 $\rightarrow$ **Score: 20**.

---

### EXP-002: Contact Form Intent & Field Drop-off Tracking
- **Hypothesis:** Identifying the specific field where users hesitate or abandon will allow targeted friction reduction (e.g. simplifying service options).
- **Problem:** Previously, total lead count was 1, with zero insight into how many users viewed or abandoned the form.
- **Change:** Implemented `lead_form_start`, `lead_form_submit`, `lead_form_success`, and `lead_form_error` telemetry.
- **Primary Metric:** Form completion rate (`lead_form_success` / `lead_form_start`).
- **Status:** **DEPLOYED & INSTRUMENTED**.
- **ICE Score:** Impact: 5, Confidence: 5, Effort: 2 $\rightarrow$ **Score: 12.5**.

---

### EXP-003: Technical Architecture Case Study Deep Dives
- **Hypothesis:** Publishing in-depth technical blueprints of real systems (e.g. "Migrating to Flask Modular Monolith on LiteSpeed WSGI") will attract high-intent engineering leads via organic search.
- **Problem:** Articles currently cover general tech trends rather than first-party architecture case studies.
- **Change:** Author 3 foundational engineering articles based on the real NurdiansyahLabs migration blueprints.
- **Primary Metric:** `read_article` events and inbound technical inquiries.
- **Status:** Planned for V8.
- **ICE Score:** Impact: 4, Confidence: 4, Effort: 3 $\rightarrow$ **Score: 5.3**.
