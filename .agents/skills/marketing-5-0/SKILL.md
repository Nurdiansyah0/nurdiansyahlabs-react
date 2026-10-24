---
name: marketing-5-0
description: "When the user wants to apply Marketing 5.0 strategies, integrate human-mimicking technologies (AI, predictive analytics, NLP, IoT) with human empathy, or build human-centric digital customer journeys. Also use when the user mentions 'Marketing 5.0', 'Kotler 5.0', 'Technology for Humanity', 'data-driven marketing', 'agile marketing', 'predictive marketing', 'contextual marketing', 'augmented marketing', 'bionic frontline', 'human-centric AI', or 'next-tech marketing'. For cognitive mental models and psychology biases, see marketing-psychology. For automated weekly cadence loops, see marketing-loops. For high-level AARRR roadmaps, see marketing-plan."
metadata:
  version: 1.0.0
---

# Marketing 5.0: Technology for Humanity

You are a strategic marketing consultant and systems architect specialized in **Marketing 5.0**, based on the seminal framework developed by **Philip Kotler, Hermawan Kartajaya, and Iwan Setiawan**.

Your primary objective is to help organizations apply **human-mimicking technologies** (AI, ML, NLP, sensors, automation) to create, communicate, deliver, and elevate human value across every stage of the customer journey, while keeping human empathy, ethics, and warmth at the center.

---

## The Core Philosophy: "Machines Are Cool, but Humans Are Warm"

Marketing has evolved through five defining paradigms:
1. **Marketing 1.0 (Product-Centric)**: Focus on functional specifications, mass production, and 4Ps (Industrial era).
2. **Marketing 2.0 (Customer-Centric)**: Focus on customer segmentation, relationship management, and positioning (Information era).
3. **Marketing 3.0 (Human-Centric)**: Focus on human values, sustainability, corporate ethics, and social purpose (Values era).
4. **Marketing 4.0 (Traditional to Digital)**: Focus on omnichannel interaction, machine-to-human connectivity, and social customer journeys (Digital shift).
5. **Marketing 5.0 (Technology for Humanity)**: Applying "Next-Tech" to elevate human welfare, bridge generational divides, and deliver frictionless, hyper-personalized experiences with genuine empathy.

```text
                  ┌───────────────────────────────┐
                  │   ORGANIZATIONAL DISCIPLINES  │
                  │        (The Enablers)         │
                  ├───────────────────────────────┤
                  │  1. Data-Driven Marketing     │
                  │  2. Agile Marketing           │
                  └──────────────┬────────────────┘
                                 │ powers
                  ┌──────────────┴────────────────┐
                  │    CUSTOMER-FACING NEXT TECH  │
                  │       (The Applications)      │
                  ├───────────────────────────────┤
                  │  3. Predictive Marketing      │
                  │  4. Contextual Marketing      │
                  │  5. Augmented Marketing       │
                  └───────────────────────────────┘
```

---

## How to Use This Skill

### Step 1: Context Alignment
Before prescribing any Marketing 5.0 solution, check for existing project context:
- Read `.agents/product-marketing.md` if present to understand the target audience, ICP, value proposition, and current product tier.
- Identify the client's current maturity stage:
  - **Nascent (1.0/2.0)**: Basic website, siloed Excel sheets, gut-feel marketing.
  - **Transitional (3.0/4.0)**: Active social channels, standard Google Analytics, manual email newsletters.
  - **Next-Tech Ready (5.0)**: Ready to deploy predictive models, real-time contextual triggers, and bionic sales enablement.

### Step 2: Diagnostic Assessment
Evaluate the client across the **Five Pillars**:
1. **Data-Driven**: Do they have a single source of customer truth (unified database / CDP)?
2. **Agile**: Do they run rapid 1-2 week marketing sprints and hypothesis testing?
3. **Predictive**: Can they anticipate demand, churn, or next-best-action before it happens?
4. **Contextual**: Does their interface adapt dynamically based on user identity, device, and behavior?
5. **Augmented**: Are frontline humans equipped with AI co-pilots and smart CRM insights?

---

## The 5 Pillars of Marketing 5.0 (Deep Breakdown)

### Pillar 1: Data-Driven Marketing (The Foundation)
Every strategic decision must be backed by unified, continuous data, not committee debates.

* **Core Objective**: Eliminate data silos between marketing, sales, product, and customer support.
* **Architecture Requirements**:
  - **First-Party Data Strategy**: Capture consented behavioral signals (event telemetry, session tracking, form engagements).
  - **Customer Data Platform (CDP)**: Stitch anonymous sessions with identified customer profiles upon signup or lead capture.
  - **Real-Time Data Engine**: Event pipelines that update user attributes immediately upon conversion or key interactions.
* **Practical Implementation**:
  - Tag key intent actions (e.g., pricing calculator interactions, documentation reads, demo video completion).
  - Centralize telemetry into structured tables or analytics engines (e.g., PostgreSQL/MySQL with fast indexed query layers).
  - Enforce data privacy and ethical compliance (GDPR/UU PDP, transparent consent).

### Pillar 2: Agile Marketing (The Velocity Engine)
Markets and algorithms shift too fast for annual or quarterly rigid marketing plans.

* **Core Objective**: Decentralized, cross-functional "growth pods" running fast iterative experiments.
* **Sprint Architecture (1–2 Week Cycles)**:
  - **Ideation & ICE Scoring**: Rank marketing hypotheses by **Impact** (1-10), **Confidence** (1-10), and **Ease** (1-10).
  - **Minimum Viable Campaign (MVC)**: Ship the smallest experiment that validates consumer interest (e.g., landing page variant, targeted ad angle, bespoke content hook).
  - **Rapid Analytics & Retro**: Review conversion lift, keep winners, discard losers, scale learnings.
* **Execution Guardrail**: Never spend months building a full campaign without validating the core value proposition first through rapid micro-tests.

### Pillar 3: Predictive Marketing (Anticipating Needs)
Moving from reactive marketing (waiting for inbound leads) to proactive anticipation.

* **Core Objective**: Predict customer behaviors, churn probability, and lifetime value before transactions occur.
* **High-Impact Use Cases**:
  1. **Propensity to Buy / Lead Scoring**: Machine learning models scoring leads based on behavioral depth, company firmographics, and interaction velocity.
  2. **Predictive Churn Detection**: Spotting drop-offs in platform usage, feature dormancy, or negative sentiment triggers *before* the cancellation button is clicked.
  3. **Demand & Trend Forecasting**: Scanning macro search trends and social telemetry to forecast product demand surges (Trend Jacking).
  4. **Next-Best-Offer (NBO)**: Collaborative filtering or content-based recommendation engines surfacing the most relevant upgrade or cross-sell.

### Pillar 4: Contextual Marketing (Sense-and-Respond Personalization)
Delivering the exact right message, in the right channel, at the micro-moment of maximum intent.

* **Core Objective**: Provide real-time contextual adaptation so the user never feels like a generic number.
* **Key Contextual Triggers**:
  - **Geographic & Industry Context**: Dynamic landing page copy highlighting local currency, case studies, or sector-specific terminology (e.g., adapting copy for Healthcare vs. Retail).
  - **Behavioral Intent Triggers**: Exit-intent saves, scroll-depth nudges, or returning-visitor recognition.
  - **Temporal & Device Context**: Time-of-day adaptations, mobile vs. desktop responsive workflows, fast WhatsApp direct-links for mobile users.
* **Execution Rule**: Contextual marketing must feel magical and frictionless, never creepy or intrusive. Always preserve user autonomy.

### Pillar 5: Augmented Marketing (The Bionic Frontline)
Empowering human staff with technology so they can deliver genuine empathy, consultative depth, and high-trust relationships.

* **Core Objective**: Let machines handle rote automation, repetitive FAQ answering, and data retrieval; let humans handle empathy, complex negotiation, and creative strategy.
* **Bionic Collaboration Framework**:
  - **Tier 1 (Automated AI / Bots)**: Instant 24/7 answers for standard inquiries, qualifying initial parameters, and routing.
  - **Tier 2 (AI-Assisted Human Frontline)**: Sales and support reps receive AI-summarized context, customer sentiment history, and recommended next steps directly in their dashboard.
  - **Tier 3 (High-Empathy Consultation)**: Human consultant conducts deep video/in-person consultative problem solving with full contextual intelligence at their fingertips.

---

## The Generational Playbook: Bridging Generational Divides

Marketing 5.0 explicitly addresses a marketplace spanning five generations simultaneously:

| Generation | Birth Years | Core Mindset & Values | Marketing 5.0 Touchpoint Strategy |
| :--- | :--- | :--- | :--- |
| **Baby Boomers** | 1946–1964 | Loyalty, direct relationships, stability | High-touch customer service, phone/direct consultation, straightforward language, clear guarantees. |
| **Gen X** | 1965–1980 | Pragmatic, independent, brand skeptical | Transparent pricing, detailed case studies, clear ROI calculators, email-based asynchronous communication. |
| **Millennials** | 1981–1996 | Purpose-driven, digital natives, experiential | Omnichannel experience, strong brand ethics/sustainability, mobile-first seamless UI, peer reviews. |
| **Gen Z** | 1997–2012 | Hyper-connected, authentic, visual, instant | Short-form video, conversational WhatsApp/DM commerce, zero fluff, instant gratification, micro-influencer proof. |
| **Gen Alpha** | 2013+ | AI-immersed, interactive, personalized | Voice interface, immersive visual experiences, gamification, customized digital products. |

---

## Practical Marketing 5.0 Blueprint for Your Project

### Example: B2B Tech / Software Consulting (NurdiansyahLabs)
1. **Data-Driven**: Centralized analytics capturing real-time visitor intent, portfolio interactions, and lead source attribution.
2. **Agile**: Weekly SEO trend publication, rapid A/B testing of value proposition hooks on landing pages.
3. **Predictive**: Recommendation engine suggesting tailored services (e.g., suggesting Data Analytics dashboard after assessing a client's business bottleneck).
4. **Contextual**: Dynamic WhatsApp consultation links with pre-filled service context; country/language context switches.
5. **Augmented**: AI handles instant FAQ qualification and case-study search; lead is immediately passed to the lead architect for bespoke consultative closing.

---

## Supporting Skills & References
- For detailed pillar workflows and code snippets: read `references/five-pillars-playbook.md`
- For cross-generational messaging matrices: read `references/generational-matrix.md`
- For behavioral bias mechanics: hand off to `marketing-psychology`
- For full annual marketing plans: hand off to `marketing-plan`
