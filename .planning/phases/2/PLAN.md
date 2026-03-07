---
phase: 02-waiver-comparison-application
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/gapp-vs-ccsp/page.tsx
  - app/how-to-apply-for-gapp/page.tsx
  - app/gapp-services-explained/page.tsx
  - app/sitemap.ts
autonomous: true
requirements: [CONT-03, CONT-04, CONT-05, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, LINK-01, QUAL-01, QUAL-02, QUAL-03]

must_haves:
  truths:
    - "Visitor can read a GAPP vs CCSP comparison with a clear differentiation table"
    - "Visitor can read step-by-step GAPP application instructions with document checklist and timelines"
    - "Visitor can read what RN, LPN, and PCS services actually cover day-to-day"
    - "All three pages have FAQPage schema, BreadcrumbList schema, canonical URLs, and sitemap entries"
    - "Each page links to 3+ existing pages including county pages and related content"
    - "Content uses parent-advocate voice and passes ANTI-AI-STYLE-GUIDE.md checklist"
  artifacts:
    - path: "app/gapp-vs-ccsp/page.tsx"
      provides: "GAPP vs CCSP comparison page with differentiation table"
      min_lines: 250
    - path: "app/how-to-apply-for-gapp/page.tsx"
      provides: "Step-by-step application guide with document checklist"
      min_lines: 300
    - path: "app/gapp-services-explained/page.tsx"
      provides: "RN/LPN/PCS service details with day-to-day examples"
      min_lines: 300
    - path: "app/sitemap.ts"
      provides: "Sitemap entries for all three new pages"
      contains: "gapp-vs-ccsp"
  key_links:
    - from: "app/gapp-vs-ccsp/page.tsx"
      to: "/directory, /gapp-approval-guide, /waivers"
      via: "Related Resources grid + inline links"
      pattern: "href=.*directory|href=.*gapp-approval|href=.*waivers"
    - from: "app/how-to-apply-for-gapp/page.tsx"
      to: "/directory, /gapp-approval-guide, /screener"
      via: "Related Resources grid + inline links"
      pattern: "href=.*directory|href=.*gapp-approval|href=.*screener"
    - from: "app/gapp-services-explained/page.tsx"
      to: "/directory, /services/rn-nursing, /services/personal-care"
      via: "Related Resources grid + inline links"
      pattern: "href=.*directory|href=.*services"
---

<objective>
Create three mid-funnel SEO content pages for GeorgiaGAPP.com targeting families researching waiver programs and application processes.

Purpose: Capture search traffic from families comparing Georgia waiver programs, figuring out how to apply, and understanding what services their child would actually receive. These pages fill the gap between awareness ("what is GAPP?") and action ("find a provider").

Output: Three new content pages + sitemap updates, all following established patterns from gapp-approval-guide/page.tsx.
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@ANTI-AI-STYLE-GUIDE.md
@app/gapp-approval-guide/page.tsx (TEMPLATE — copy this structure exactly)
@app/sitemap.ts
@components/JsonLd.tsx
@lib/config.ts

<interfaces>
<!-- Components and imports the executor needs -->

From components/JsonLd.tsx:
```typescript
export function FAQPageSchema({ faqs }: { faqs: { question: string; answer: string }[] })
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] })
```

From lib/supabase.ts:
```typescript
import { supabase } from '@/lib/supabase'
```

From lib/config.ts:
```typescript
import { config } from '@/lib/config'
// Use: config.contact.disclaimer
```

Standard imports for every page:
```typescript
import Link from 'next/link'
import { Metadata } from 'next'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'
import { config } from '@/lib/config'
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create /gapp-vs-ccsp comparison page</name>
  <files>app/gapp-vs-ccsp/page.tsx</files>
  <action>
Create `app/gapp-vs-ccsp/page.tsx` as a server component. Copy the structure of `app/gapp-approval-guide/page.tsx` exactly (imports, metadata pattern, schema placement, section layout, FAQ display, Related Resources, CTA, disclaimer).

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'GAPP vs CCSP: Which Georgia Waiver Program Fits Your Child?',
  description: 'Compare GAPP and CCSP waiver programs side by side. See eligibility, services, wait times, and which one covers home nursing for your child in Georgia.',
  keywords: 'GAPP vs CCSP, Georgia waiver programs, GAPP waiver, CCSP waiver, pediatric Medicaid Georgia, home nursing waiver Georgia',
  openGraph: {
    title: 'GAPP vs CCSP: Which Georgia Waiver Program Fits Your Child?',
    description: 'Side-by-side comparison of Georgia GAPP and CCSP waiver programs. Eligibility, services, wait times.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-vs-ccsp',
  },
}
```

**Schemas:** FAQPageSchema + BreadcrumbSchema at top of JSX (Home > GAPP vs CCSP).

**Page sections (in order):**

1. **Hero** — `bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4`. Breadcrumb nav. H1: "GAPP vs CCSP: which Georgia waiver program fits your child?" Subtitle: Short sentence about why families confuse these two programs.

2. **Quick answer box** — `bg-white py-12 px-4` with `max-w-3xl mx-auto`. A highlighted box (bg-blue-50 border border-blue-200 rounded-xl p-6) with the one-sentence difference: GAPP covers home nursing for medically fragile kids under 21. CCSP covers home and community services for adults and some children with developmental disabilities. If your child needs a nurse at home, you want GAPP.

3. **Comparison table section** — `bg-gray-50 py-12 px-4` with `max-w-3xl mx-auto`. H2: "Side-by-side comparison". Build a responsive comparison table using a styled div grid (NOT an HTML table — tables break on mobile). Structure:

```
Feature column | GAPP column | CCSP column
```

Rows to include (use a const array mapped to JSX, like the step cards pattern):
- **Full name**: Georgia Pediatric Program | Community Care Services Program
- **Who it's for**: Children under 21 with medical conditions needing skilled nursing | Adults and some children with intellectual/developmental disabilities
- **Main services**: RN, LPN, personal care (PCS) at home | Personal support, respite, community living, day programs
- **Covers home nursing?**: Yes — this is the main service | No — focused on community-based support
- **Age limit**: Under 21 | Varies (primarily adults, some children)
- **Wait list**: Typically no wait list — apply through a provider | Often has a wait list
- **How to apply**: Through a Medicaid-enrolled GAPP agency | Through your regional office or case manager
- **Medicaid required?**: Yes — active Georgia Medicaid | Yes — active Georgia Medicaid

Style each row with alternating bg-white/bg-gray-50, with the feature label in font-semibold. On mobile, stack the columns vertically with clear GAPP/CCSP labels.

4. **When to choose GAPP** — `bg-white py-12 px-4`. H2: "When GAPP is the right choice". Short paragraph: Your child needs a nurse at home. They have a trach, ventilator, feeding tube, or other medical equipment that requires skilled monitoring. They need someone who can give medications, manage medical equipment, or respond to emergencies. List 4-5 specific scenarios as brief bullet items (not decorated inline-header lists — just plain text bullets).

5. **When to choose CCSP** — same section continued or new `bg-gray-50` section. H2: "When CCSP might be better". Your child or family member has a developmental disability and needs help with daily living, community activities, or day programs. CCSP does not cover skilled nursing. If you need a nurse, go with GAPP.

6. **Can you have both?** — Short section. H2: "Can you use both programs?" Answer: In some cases, yes. A child could receive GAPP for home nursing and CCSP for community services if they qualify for both. Talk to your case manager about combining waivers. Link to `/waivers` for more details on Georgia waiver programs.

7. **FAQ section** — `bg-gray-50 py-12 px-4`. Use `<details>` pattern from template. 5-7 FAQs:
   - "What's the biggest difference between GAPP and CCSP?" → GAPP pays for nurses in your home. CCSP pays for community support and day programs. If your child needs medical care at home, GAPP is the one.
   - "Does CCSP cover home nursing?" → No. CCSP covers personal support, respite, and community services. For home nursing (RN or LPN), you need GAPP.
   - "Can my child be on both GAPP and CCSP?" → Potentially yes, if they qualify for both. GAPP would cover nursing, CCSP would cover community support. Your case manager can help figure this out.
   - "Is there a wait list for GAPP?" → GAPP typically does not have a wait list. You apply through a Medicaid-enrolled agency and they submit for prior authorization. CCSP often has a wait list.
   - "How do I know which program my child qualifies for?" → If your child needs skilled nursing at home (trach care, vent management, tube feedings), that's GAPP. If they need help with daily living and community activities, that's CCSP. Start with your pediatrician or call Georgia Medicaid at 1-866-211-0950.
   - "What if my child needs both nursing and community services?" → Apply for GAPP first if nursing is the immediate need. You can explore CCSP for additional community services later.

8. **Related Resources** — `bg-white py-12 px-4`. Grid with 4 links:
   - `/gapp-approval-guide` — "GAPP approval guide" / "Step-by-step process to get approved"
   - `/how-to-apply-for-gapp` — "How to apply for GAPP" / "Documents, timelines, and what to expect"
   - `/waivers` — "Georgia waiver programs" / "Compare all available waivers"
   - `/directory` — "Find a GAPP provider" / "Browse providers by county"

9. **CTA** — "Ready to apply for GAPP?" with buttons to `/directory` ("Find a Provider") and `/screener` ("Check Eligibility").

10. **Disclaimer** — `config.contact.disclaimer`.

**Internal links (LINK-01 — minimum 3):** `/gapp-approval-guide`, `/waivers`, `/directory`, `/screener`, `/how-to-apply-for-gapp`, `/gapp-services-explained`. Weave inline links naturally in body text plus the Related Resources grid.

**County page links:** In the comparison table "How to apply" GAPP row or in the CTA section, mention that families can search providers by county and link to `/directory`.

**ANTI-AI-STYLE-GUIDE.md compliance (QUAL-01, QUAL-02, QUAL-03):**
- Write like a friend explaining the difference, not a policy document
- No "serves as," "it's important to note," "comprehensive," "vibrant," "diverse array"
- No three-adjective clusters. No "-ing" phrases tacked on sentence ends.
- Sentence case headings. Max 1 AI vocabulary word per paragraph.
- Max 1-2 em dashes total. No "despite" sandwich structures.
- End with next steps (links, phone numbers), not a summary.
- Every paragraph answers "what do I do next?"
- Use "your kid" where natural, not "your medically fragile child" every time
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && npx tsc --noEmit app/gapp-vs-ccsp/page.tsx 2>&1 | head -20 && grep -c "FAQPageSchema\|BreadcrumbSchema\|canonical\|href=" app/gapp-vs-ccsp/page.tsx</automated>
  </verify>
  <done>
- /gapp-vs-ccsp page exists with comparison table (grid-based, not HTML table)
- Static metadata with title, description, keywords, openGraph type article, canonical URL
- FAQPageSchema with 5-7 questions + BreadcrumbSchema
- Links to /gapp-approval-guide, /waivers, /directory, /screener (4+ internal links)
- Content uses parent-advocate voice, passes anti-AI style checklist
  </done>
</task>

<task type="auto">
  <name>Task 2: Create /how-to-apply-for-gapp page</name>
  <files>app/how-to-apply-for-gapp/page.tsx</files>
  <action>
Create `app/how-to-apply-for-gapp/page.tsx` as a server component. Copy structure from `app/gapp-approval-guide/page.tsx` exactly. This page is the actionable companion to the approval guide — focused on documents, timelines, and the literal steps to submit an application.

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'How to Apply for GAPP in Georgia: Documents, Steps, and Timeline',
  description: 'Apply for the Georgia Pediatric Program step by step. Required documents, where to submit, expected timeline, and what to do if denied. Updated 2026.',
  keywords: 'apply for GAPP Georgia, GAPP application, Georgia Pediatric Program application, GAPP documents needed, GAPP timeline, how to get GAPP',
  openGraph: {
    title: 'How to Apply for GAPP in Georgia: Documents, Steps, and Timeline',
    description: 'Step-by-step GAPP application guide with required documents, timelines, and tips to avoid delays.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/how-to-apply-for-gapp',
  },
}
```

**Schemas:** FAQPageSchema + BreadcrumbSchema (Home > How to apply for GAPP).

**Optionally fetch provider stats** using the same `getProviderStats()` pattern from the template (supabase query for active providers). Use in the "find a provider" CTA section: "{stats.accepting} providers accepting new patients."

**Page sections (in order):**

1. **Hero** — Breadcrumb nav. H1: "How to apply for GAPP in Georgia". Subtitle: Everything you need — documents, steps, and realistic timelines.

2. **"Who this is for" pills** — Same pattern as approval guide. Tags: "Parents applying for home nursing", "Families with active Medicaid", "Hospital discharge planners".

3. **Document checklist section** — `bg-white py-12 px-4`, `max-w-3xl mx-auto`. H2: "Documents you'll need before you start". This is the document checklist (CONT-04 requirement). Use a styled checklist (checkbox icon + text, similar to the requirements list in approval guide).

Documents needed:
- Child's active Georgia Medicaid card (not pending — the actual card or ID number)
- Physician order for skilled nursing (must state: diagnosis, type of care needed, medical necessity, recommended hours)
- Child's medical records or recent hospital discharge summary
- Parent/guardian photo ID
- Proof of Georgia residency (utility bill, lease, etc.)
- Child's birth certificate or Social Security card

Add a callout box (bg-amber-50 border-amber-200): "The physician order is where most applications stall. Your GAPP agency can send the correct form to your doctor. Pick your agency first, then get the order."

4. **Step-by-step application process** — `bg-gray-50 py-12 px-4`. H2: "The application process, step by step". Use the same step card pattern from gapp-approval-guide (bg-primary header with number circle, white content area).

Step 1: **Confirm your child has active Medicaid** — Not pending, not applied-for. You need the Medicaid ID number. Call 1-866-211-0950 or check Georgia Gateway to verify.

Step 2: **Choose a GAPP agency in your county** — The agency handles your application. You don't apply to Medicaid directly. Search by county at [link to /directory]. Ask if they're accepting new patients and have nurses available.

Step 3: **Gather your documents** — Have everything from the checklist above ready. The agency will tell you exactly what format they need. Respond to document requests within 48 hours.

Step 4: **Agency submits prior authorization** — Your agency submits the prior authorization to Georgia Medicaid on your behalf. You don't do this step. Confirm they've submitted and ask for the expected timeline.

Step 5: **Wait for approval (2-6 weeks)** — Timeline depends on document completeness and Medicaid processing. Check in with your agency weekly if you haven't heard back.

Step 6: **Intake and care begins** — Once approved, your agency schedules a home visit, creates a care plan, assigns nurses, and starts shifts. Typically 1-2 weeks from approval to first shift.

5. **Timeline callout section** — `bg-white py-12 px-4`. H2: "Realistic timeline: how long does this take?" Create a visual timeline using styled cards (not a horizontal timeline graphic — keep it simple).

| Phase | Time |
|-------|------|
| Gather documents | 1-2 weeks (you control this) |
| Choose agency + intake | 1 week |
| Prior authorization review | 2-4 weeks |
| Nurse assignment + scheduling | 1-2 weeks |
| **Total: roughly 5-9 weeks** | |

Add a callout (bg-green-50 border-green-200): "The fastest families do steps 1-3 in parallel. Get your Medicaid confirmed, contact agencies, and gather documents at the same time."

6. **What if you're denied** — `bg-gray-50 py-12 px-4`. H2: "What to do if your application is denied". Short, direct section. Common reasons: Medicaid wasn't active, physician order was incomplete, child didn't meet medical necessity threshold. Steps: Ask for the denial reason in writing. Have your agency help fix the issue. Resubmit or file an appeal. Link to `/why-gapp-applications-get-denied` for the full guide.

7. **FAQ section** — 5-7 FAQs using `<details>` pattern:
   - "Can I apply for GAPP without Medicaid?" → No. Active Georgia Medicaid is required before an agency can submit prior authorization. Apply for Medicaid first through Georgia Gateway or your local DFCS office.
   - "Do I apply to Medicaid directly for GAPP?" → No. You apply through a Medicaid-enrolled GAPP agency. They handle the prior authorization paperwork. Your job is to choose an agency and provide documents.
   - "How long does GAPP approval take?" → Plan for 5-9 weeks from start to first nurse visit. The biggest variable is how quickly you gather documents and how fast Medicaid processes the prior auth.
   - "What if no agencies in my county are accepting patients?" → Contact agencies in neighboring counties. Many serve multiple counties. Check our directory and filter by your county — some agencies travel to underserved areas.
   - "Can I switch agencies after I apply?" → Yes, but it may restart some of the process. If your current agency isn't responsive, find a new one. See our guide on switching providers.
   - "Does GAPP cost anything out of pocket?" → No. GAPP is a Medicaid program. If your child has active Georgia Medicaid, GAPP services are covered at no cost to you.

8. **Related Resources** — Grid with 4 links:
   - `/gapp-approval-guide` — "GAPP approval guide" / "The full approval process explained"
   - `/gapp-services-explained` — "GAPP services explained" / "What RN, LPN, and PCS actually cover"
   - `/why-gapp-applications-get-denied` — "Why applications get denied" / "Common reasons and how to avoid them"
   - `/directory` — "Find a GAPP provider" / "Search by county"

9. **CTA** — "Find a GAPP agency to start your application" with provider stats if fetched, buttons to `/directory` and `/screener`.

10. **Disclaimer** — `config.contact.disclaimer`.

**Internal links (LINK-01):** `/directory`, `/gapp-approval-guide`, `/screener`, `/why-gapp-applications-get-denied`, `/gapp-services-explained`, county page links in the "find by county" area if included.

**ANTI-AI-STYLE-GUIDE.md compliance:** Same rules as Task 1. Write like a parent who figured this out explaining it to another parent. Short sentences. No inflated language. Every section answers "what do I do next?"
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && npx tsc --noEmit app/how-to-apply-for-gapp/page.tsx 2>&1 | head -20 && grep -c "FAQPageSchema\|BreadcrumbSchema\|canonical\|href=" app/how-to-apply-for-gapp/page.tsx</automated>
  </verify>
  <done>
- /how-to-apply-for-gapp page exists with document checklist, step-by-step process, and timeline callouts
- Static metadata with title, description, keywords, openGraph type article, canonical URL
- FAQPageSchema with 5-7 questions + BreadcrumbSchema
- Document checklist section with 6 items
- Timeline section with realistic week estimates
- Links to /directory, /gapp-approval-guide, /screener, /why-gapp-applications-get-denied (4+ internal links)
- Content uses parent-advocate voice, passes anti-AI style checklist
  </done>
</task>

<task type="auto">
  <name>Task 3: Create /gapp-services-explained page</name>
  <files>app/gapp-services-explained/page.tsx</files>
  <action>
Create `app/gapp-services-explained/page.tsx` as a server component. Copy structure from `app/gapp-approval-guide/page.tsx`.

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'GAPP Services Explained: What RN, LPN, and PCS Actually Cover',
  description: 'What does a GAPP nurse actually do in your home? Real examples of RN, LPN, and personal care services for medically fragile children in Georgia.',
  keywords: 'GAPP services, RN home nursing Georgia, LPN services GAPP, personal care services PCS, GAPP home care, what does GAPP cover',
  openGraph: {
    title: 'GAPP Services Explained: What RN, LPN, and PCS Actually Cover',
    description: 'Real examples of what GAPP nurses and personal care aides do day-to-day in your home.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-services-explained',
  },
}
```

**Schemas:** FAQPageSchema + BreadcrumbSchema (Home > GAPP services explained).

**Page sections (in order):**

1. **Hero** — Breadcrumb nav. H1: "GAPP services explained: what RN, LPN, and PCS actually cover". Subtitle: What happens when a GAPP nurse shows up at your house. The real day-to-day, not the policy language.

2. **Quick overview** — `bg-white py-12 px-4`. H2: "Three types of GAPP services". Brief intro: GAPP covers three service types. Each one does different things. Here's which one your child probably needs. Then 3 cards in a grid (sm:grid-cols-3) with:
   - **RN (Registered Nursing)** — For the most complex medical needs. Trach care, ventilator management, IV medications.
   - **LPN (Licensed Practical Nursing)** — For ongoing medical care. G-tube feedings, medication administration, wound care.
   - **PCS (Personal Care Services)** — For daily living help. Bathing, dressing, feeding, positioning.

Each card: colored top border (use primary for RN, accent for LPN, warm for PCS), brief 2-sentence description, "Learn more below" text.

3. **RN services deep dive** — `bg-gray-50 py-12 px-4`, `max-w-3xl mx-auto`. H2: "Registered Nursing (RN): what they do in your home".

Start with a "day in the life" paragraph: An RN arrives at 7am. She checks your child's trach, suctions as needed, and hooks up the ventilator settings for the day. She watches the monitors, gives medications through the G-tube at 8am, and documents everything. If something goes wrong — a trach comes out, oxygen drops, a seizure starts — she handles it.

Then a "what RN services include" list (plain bullets, not decorated):
- Tracheostomy care and suctioning
- Ventilator monitoring and management
- IV medication administration
- Complex wound care and dressing changes
- Seizure monitoring and emergency response
- Care plan development and updates
- Training parents on medical procedures
- Coordination with doctors and specialists

Then a "your child probably needs an RN if" box (bg-blue-50 border-blue-200 rounded-xl p-5):
- They have a trach or ventilator
- They need IV medications
- They have complex medical equipment at home
- Their condition requires someone who can assess and make clinical decisions

4. **LPN services deep dive** — `bg-white py-12 px-4`. H2: "Licensed Practical Nursing (LPN): what they do in your home".

Day-in-the-life: An LPN comes at 6pm for the evening shift. She checks vitals, gives the 6pm medications through the G-tube, preps the overnight feeding pump, and does a wound dressing change. She monitors your child through the evening, handles the 10pm meds, and documents the shift.

"What LPN services include" list:
- G-tube and feeding pump management
- Medication administration (oral and G-tube)
- Blood sugar monitoring and insulin
- Wound care and dressing changes
- Vital sign monitoring
- Catheter care
- Documenting and reporting changes to the RN or doctor

"Your child probably needs an LPN if" box:
- They have a G-tube or feeding pump
- They need medications given on a schedule
- They have wounds that need regular care
- They need monitoring but not ventilator/trach-level intervention

5. **PCS deep dive** — `bg-gray-50 py-12 px-4`. H2: "Personal Care Services (PCS): what they do in your home".

Day-in-the-life: A PCS aide arrives in the morning. She helps your child get out of bed, bathes them, gets them dressed, and prepares breakfast. She helps with positioning in the wheelchair, does range-of-motion exercises the therapist prescribed, and keeps your child safe and comfortable while you handle everything else.

"What PCS includes" list:
- Bathing, grooming, and hygiene
- Dressing and undressing
- Feeding assistance (not tube feeding — that's nursing)
- Toileting and diaper changes
- Positioning and transfers
- Range-of-motion exercises (as directed by therapist)
- Light housekeeping related to the child's care area
- Companionship and supervision

"Your child probably needs PCS if" box:
- They need physical help with daily activities
- They can't bathe, dress, or feed themselves
- They need someone to help with mobility
- A family member currently does all of this and needs relief

6. **Which service is right section** — `bg-white py-12 px-4`. H2: "How to figure out which service your child needs". Short guidance: Your doctor's order determines the service type. But here's the quick version:
- Medical equipment at home (trach, vent, IV) → RN
- Ongoing medical tasks (G-tube, medications, wound care) → LPN
- Daily living help (bathing, dressing, feeding) → PCS
- Not sure → Ask your agency. They'll assess your child and recommend the right service level. Link to `/screener`.

7. **Can you get more than one?** — Brief section. Yes. Many children receive a combination. A child with a trach might get RN during the day and PCS in the evening. The mix depends on the physician order and what Medicaid authorizes.

8. **FAQ section** — 5-7 FAQs using `<details>` pattern:
   - "How many hours of GAPP services can my child get?" → It depends on the physician order and what Medicaid authorizes. Some children get 8 hours/day, others get 24/7 nursing. Your agency and doctor determine the hours based on medical necessity.
   - "Can I choose which nurse comes to my home?" → Your agency assigns nurses, but you can request changes if someone isn't a good fit. Most agencies try to keep the same nurses on your case for consistency.
   - "What if the nurse doesn't show up?" → Call your agency immediately. They should send a replacement. If missed shifts happen regularly, that's a sign to consider switching agencies.
   - "Can GAPP nurses go to school with my child?" → GAPP is primarily for in-home care. School nursing is usually through the school district via IEP or 504 plans. Some families use GAPP hours for before/after school care.
   - "Do I have to be home while the nurse is there?" → This depends on your child's care plan and age. For younger children, a parent usually needs to be available. Ask your agency about their policy.
   - "Can a family member be a PCS aide through GAPP?" → In some cases, yes. Family members can be hired as PCS aides through a GAPP agency. The agency handles training and paperwork. See our page on getting paid as a family caregiver.

9. **Related Resources** — Grid with 4 links:
   - `/services/rn-nursing` — "RN nursing services" / "Full details on registered nursing through GAPP"
   - `/services/personal-care` — "Personal care services" / "What PCS covers and how to get it"
   - `/how-to-apply-for-gapp` — "How to apply" / "Documents and steps to get started"
   - `/directory` — "Find a provider" / "Search GAPP agencies by county"

10. **CTA** — "Find a GAPP provider for your child" with buttons to `/directory` and `/screener`.

11. **Disclaimer** — `config.contact.disclaimer`.

**Internal links (LINK-01):** `/directory`, `/services/rn-nursing`, `/services/lpn-services`, `/services/personal-care`, `/screener`, `/how-to-apply-for-gapp`, `/gapp-paid-caregiver`. Weave naturally into body text + Related Resources grid.

**ANTI-AI-STYLE-GUIDE.md compliance:** Same rules. The day-in-the-life paragraphs are the key content differentiator — make them feel real and specific, not clinical. "She checks the trach" not "The registered nurse performs tracheostomy assessment and maintenance." Short sentences. Plain verbs.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && npx tsc --noEmit app/gapp-services-explained/page.tsx 2>&1 | head -20 && grep -c "FAQPageSchema\|BreadcrumbSchema\|canonical\|href=" app/gapp-services-explained/page.tsx</automated>
  </verify>
  <done>
- /gapp-services-explained page exists with RN, LPN, and PCS deep dives including day-to-day examples
- Each service type has: day-in-the-life paragraph, service list, "your child probably needs this if" box
- Static metadata with title, description, keywords, openGraph type article, canonical URL
- FAQPageSchema with 5-7 questions + BreadcrumbSchema
- Links to /directory, /services/rn-nursing, /services/personal-care, /screener, /how-to-apply-for-gapp (5+ internal links)
- Content uses parent-advocate voice with specific real-world examples, passes anti-AI style checklist
  </done>
</task>

<task type="auto">
  <name>Task 4: Add all three pages to sitemap.ts</name>
  <files>app/sitemap.ts</files>
  <action>
Open `app/sitemap.ts`. Find the "SEO Content Expansion v1.1" comment block (around line 160, after the `gapp-paid-caregiver` entry). Add three new entries immediately after:

```typescript
    {
      url: `${baseUrl}/gapp-vs-ccsp`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-to-apply-for-gapp`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gapp-services-explained`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
```

Use `priority: 0.8` and `changeFrequency: 'monthly'` to match the existing content page pattern.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "gapp-vs-ccsp\|how-to-apply-for-gapp\|gapp-services-explained" app/sitemap.ts && npx tsc --noEmit app/sitemap.ts 2>&1 | head -5</automated>
  </verify>
  <done>
- sitemap.ts contains entries for all three new URLs
- Each entry has priority 0.8 and changeFrequency monthly
- File compiles without TypeScript errors
  </done>
</task>

</tasks>

<verification>
After all four tasks complete, verify the full phase:

1. **Build check:** `npm run build` completes without errors
2. **All three routes exist:** Visit /gapp-vs-ccsp, /how-to-apply-for-gapp, /gapp-services-explained in dev
3. **SEO infrastructure per page:** Each page has metadata export, FAQPageSchema, BreadcrumbSchema, canonical URL
4. **Sitemap:** All three URLs appear in sitemap output
5. **Internal links:** Each page links to 3+ existing pages (grep for href= counts)
6. **Anti-AI style spot check:** No "serves as," no "it's important to note," no three-adjective clusters, sentence case headings
</verification>

<success_criteria>
1. /gapp-vs-ccsp comparison page exists with clear differentiation table (grid-based, mobile-responsive)
2. /how-to-apply-for-gapp page exists with document checklist (6 items), step-by-step process (6 steps), and timeline callout (5-9 weeks)
3. /gapp-services-explained page exists with RN/LPN/PCS deep dives including day-to-day examples for each
4. All three pages have: static metadata export, FAQPageSchema (5-7 Qs each), BreadcrumbSchema, canonical URL
5. All three pages appear in sitemap.ts with priority 0.8
6. Each page links to 3+ existing pages via Related Resources grid and inline links
7. Content uses parent-advocate voice and passes ANTI-AI-STYLE-GUIDE.md pre-publish checklist
8. `npm run build` succeeds with no errors
</success_criteria>

<output>
After completion, create `.planning/phases/2/02-01-SUMMARY.md`
</output>
