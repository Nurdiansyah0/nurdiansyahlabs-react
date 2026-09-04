# NurdiansyahLabs — Analytics Telemetry Specification (V7)

**Goal:** Close instrumentation blind spots between visitor interest, showcase discovery, and inquiry conversion.

---

## 1. Event Catalog

| Event Name | Trigger | Payload | Business Question Answered |
| :--- | :--- | :--- | :--- |
| `pageview` | Route navigation | `path`, `visitorId` | Which routes receive traffic? |
| `hero_primary_cta` | Click "Start Project Consultation" / WhatsApp | `target`, `text` | Are visitors responding to direct consultation? |
| `hero_secondary_cta` | Click "Explore Live Demos" | `target`, `text` | Do visitors prefer exploring showcase projects first? |
| `view_showcase_modal`| Click a service card | `service`, `title` | Which service category generates highest curiosity? |
| `click_project` | Click interactive project demo | `title`, `route` | Which specific application builds the most credibility? |
| `whatsapp_click` | Click WhatsApp CTA button | `location` (hero, cta, modal) | What is our true direct-chat inquiry volume? |
| `lead_form_start` | First input focus in contact form | `field` | How many visitors start filling out the form? |
| `lead_form_submit` | Form submission attempt | `service` | How many visitors complete the form? |
| `lead_form_success`| Successful submission (HTTP 201) | `service`, `lead_id` | What is our true completed form conversion rate? |

---

## 2. Privacy & Data Integrity Rules

1. **No PII in Telemetry:** Never send user names, emails, phone numbers, or freeform message text in `trackEvent()` payloads.
2. **Anonymous Identification:** Use ephemeral, random visitor tokens stored in `sessionStorage` (`visitorId`).
3. **Keepalive Delivery:** Set `keepalive: true` in `fetch()` so events fired on outbound navigation (e.g. clicking external WhatsApp or GitHub links) complete reliably.
