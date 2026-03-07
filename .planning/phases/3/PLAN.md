---
phase: 03-niche-service-pages
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/how-to-switch-gapp-providers/page.tsx
  - app/gapp-respite-care/page.tsx
  - app/sitemap.ts
autonomous: true
requirements: [CONT-06, CONT-07, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, LINK-01, QUAL-01, QUAL-02, QUAL-03]

must_haves:
  truths:
    - "Visitor can read how to switch GAPP providers with process steps, what to tell current provider, and realistic timeline"
    - "Visitor can read about GAPP respite care including eligibility, how to request it, and what it actually looks like"
    - "Both pages have FAQPage schema, BreadcrumbList schema, canonical URLs, and sitemap entries"
    - "Each page links to 3+ existing pages including county pages and related content"
    - "Content uses parent-advocate voice and passes ANTI-AI-STYLE-GUIDE.md checklist"
  artifacts:
    - path: "app/how-to-switch-gapp-providers/page.tsx"
      provides: "Provider switching guide with process steps and timeline"
      min_lines: 250
    - path: "app/gapp-respite-care/page.tsx"
      provides: "Respite care explanation with eligibility and request process"
      min_lines: 250
    - path: "app/sitemap.ts"
      provides: "Sitemap entries for both new pages"
      contains: "how-to-switch-gapp-providers"
  key_links:
    - from: "app/how-to-switch-gapp-providers/page.tsx"
      to: "/directory, /gapp-approval-guide, /gapp-services-explained"
      via: "Related Resources grid + inline links"
      pattern: "href=.*directory|href=.*gapp-approval|href=.*gapp-services"
    - from: "app/gapp-respite-care/page.tsx"
      to: "/directory, /gapp-services-explained, /how-to-apply-for-gapp"
      via: "Related Resources grid + inline links"
      pattern: "href=.*directory|href=.*gapp-services|href=.*how-to-apply"
---

<objective>
Create two niche SEO content pages for GeorgiaGAPP.com targeting specific service queries no competitor owns.

Purpose: Capture search traffic from families dealing with provider dissatisfaction (switching) and caregiver burnout (respite). These are high-intent, low-competition queries where no Georgia-specific content exists.

Output: Two new content pages + sitemap updates, all following established patterns from gapp-approval-guide/page.tsx.
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
@app/gapp-services-explained/page.tsx (reference for style and tone)
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
  <name>Task 1: Create /how-to-switch-gapp-providers page</name>
  <files>app/how-to-switch-gapp-providers/page.tsx</files>
  <action>
Create `app/how-to-switch-gapp-providers/page.tsx` as a server component. Copy the structure of `app/gapp-approval-guide/page.tsx` exactly (imports, metadata pattern, schema placement, section layout, FAQ display, Related Resources, CTA, disclaimer).

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'How to Switch GAPP Providers in Georgia: Steps and Timeline',
  description: 'Unhappy with your GAPP agency? How to switch providers without losing services. Steps, what to tell your current agency, and how long it takes.',
  keywords: 'switch GAPP providers, change GAPP agency, transfer GAPP services, GAPP provider problems, new GAPP agency Georgia',
  openGraph: {
    title: 'How to Switch GAPP Providers in Georgia: Steps and Timeline',
    description: 'Step-by-step guide to switching your GAPP agency without a gap in services.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/how-to-switch-gapp-providers',
  },
}
```

**Schemas:** FAQPageSchema + BreadcrumbSchema at top of JSX (Home > How to switch GAPP providers).

**Page sections (in order):**

1. **Hero** — `bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4`. Breadcrumb nav. H1: "How to switch GAPP providers in Georgia". Subtitle: You don't have to stay with an agency that isn't working. Here's how to move to a new one without losing your child's services.

2. **Signs it's time to switch** — `bg-white py-12 px-4` with `max-w-3xl mx-auto`. H2: "Signs it's time to find a new agency". Keep this real and practical. Use plain bullet items (not decorated inline-header lists):
   - Nurses keep canceling or not showing up
   - The agency won't return your calls
   - They can't staff your child's hours consistently
   - You've reported problems and nothing changed
   - Nurses aren't following your child's care plan
   - The agency is losing staff and can't replace them

   Add a brief reassurance sentence: Switching agencies is your right. You won't lose your GAPP approval. Your child's Medicaid and prior authorization stay active.

3. **Step-by-step switching process** — `bg-gray-50 py-12 px-4`. H2: "How to switch, step by step". Use the same numbered step card pattern from gapp-approval-guide (bg-primary header with number circle, white content area).

   Step 1: **Find your new agency first** — Don't quit your current agency until you have a new one lined up. Search our [directory](/directory) by county. Call 2-3 agencies and ask: Are you accepting new patients? Can you staff the hours my child needs? What's your nurse turnover like?

   Step 2: **Tell your new agency you're transferring** — They've done this before. Give them your child's name, Medicaid ID, current hours, and service type. They'll start their intake process while you're still with the old agency.

   Step 3: **Notify your current agency** — Call or send a written notice. You don't need permission to leave. Just tell them: "We're transferring to [new agency] effective [date]." Keep it simple. Ask them to send your child's records to the new agency.

   Step 4: **Coordinate the handoff** — The goal is zero gap in services. Your new agency submits a new prior authorization. In many cases, Medicaid processes transfers faster than new applications. Ask both agencies to overlap if possible — the old one keeps staffing until the new one starts.

   Step 5: **Confirm your hours and care plan** — Once the new agency is active, verify they have the right hours, service type, and care plan details. Do a meet-and-greet with your new nurse before the first shift if you can.

4. **Timeline section** — `bg-white py-12 px-4`. H2: "How long does switching take?" Use styled cards like the Phase 2 pages.

   | Phase | Time |
   |-------|------|
   | Finding a new agency | 1-2 weeks (you control this) |
   | New agency intake | 3-5 days |
   | Prior authorization transfer | 1-3 weeks |
   | First shift with new agency | 1-2 weeks after approval |
   | **Total: roughly 3-6 weeks** | |

   Add a tip box (bg-green-50 border-green-200): "Start looking before you hit your breaking point. The families who switch smoothly are the ones who line up the new agency first."

5. **What to tell your current agency** — `bg-gray-50 py-12 px-4`. H2: "What to say to your current agency". Keep this short and direct. You don't owe them a long explanation. A simple script:

   "We've decided to transfer [child's name]'s GAPP services to another agency. Our last day with you will be [date]. Please send our records to [new agency name] at [contact info]."

   Add a callout box (bg-amber-50 border-amber-200): "Put it in writing. Even if you call, follow up with an email or letter so there's a record. Keep a copy."

6. **What NOT to do** — `bg-white py-12 px-4`. H2: "Common mistakes when switching". Brief section with 3-4 items as plain paragraphs (not a decorated list):
   - Don't quit your current agency before the new one is confirmed and ready to staff
   - Don't assume your hours will transfer automatically — the new agency needs to submit their own prior auth
   - Don't skip the meet-and-greet with the new nurse — your child needs time to adjust
   - Don't feel guilty — agencies deal with transfers regularly, and your child's care is what matters

7. **FAQ section** — `bg-gray-50 py-12 px-4`. Use `<details>` pattern. 6 FAQs:
   - "Will I lose my GAPP approval if I switch agencies?" — No. Your child's GAPP eligibility and Medicaid are separate from the agency. The prior authorization may need to transfer, but you don't lose your spot in the program.
   - "Can my current agency refuse to release my records?" — No. They're required to transfer medical records when you request it. If they drag their feet, contact Georgia Medicaid or file a complaint with DBHDD.
   - "What if no other agencies in my county are accepting patients?" — Check neighboring counties. Many agencies serve multiple counties. Search our directory and call a few — some agencies that show "not accepting" online may have openings for transfers.
   - "Do I need to tell my child's doctor?" — It's a good idea. Let them know the new agency name so they can send orders and communicate with the new nurses. Your doctor doesn't need to approve the switch.
   - "Can I switch back to my old agency later?" — Usually yes, if they're accepting patients. But most families who switch don't go back. Pick your new agency carefully and you shouldn't need to.
   - "What if there's a gap between agencies?" — Plan ahead to avoid this. The best approach is to keep the old agency staffing shifts until the new one starts. If there is a short gap, you'll handle care yourself temporarily. Make sure you have emergency supplies and know your child's care plan inside and out.

8. **Related Resources** — `bg-white py-12 px-4`. Grid with 4 links:
   - `/directory` — "Find a GAPP provider" / "Search agencies by county"
   - `/gapp-services-explained` — "GAPP services explained" / "What RN, LPN, and PCS actually cover"
   - `/gapp-approval-guide` — "GAPP approval guide" / "How the approval process works"
   - `/gapp-respite-care` — "GAPP respite care" / "Get backup hours when you need a break"

9. **CTA** — "Ready to find a better agency?" with buttons to `/directory` ("Browse Providers") and `/screener` ("Check Eligibility").

10. **Disclaimer** — `config.contact.disclaimer`.

**Internal links (LINK-01 — minimum 3):** `/directory`, `/gapp-approval-guide`, `/gapp-services-explained`, `/gapp-respite-care`, `/screener`, and at least one county page link (e.g., `/fulton` or `/dekalb`) woven into body text where natural (e.g., "families in Fulton County can search providers at...").

**ANTI-AI-STYLE-GUIDE.md compliance (QUAL-01, QUAL-02, QUAL-03):**
- Write like a parent who switched agencies telling another parent how it works
- No "serves as," "it's important to note," "comprehensive," "vibrant," "diverse array"
- No three-adjective clusters. No "-ing" phrases tacked on sentence ends.
- Sentence case headings. Max 1 AI vocabulary word per paragraph.
- Max 1-2 em dashes total. No "despite" sandwich structures.
- End with next steps (links, directory search), not a summary.
- Every paragraph answers "what do I do next?"
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && npx tsc --noEmit app/how-to-switch-gapp-providers/page.tsx 2>&1 | head -20 && grep -c "FAQPageSchema\|BreadcrumbSchema\|canonical\|href=" app/how-to-switch-gapp-providers/page.tsx</automated>
  </verify>
  <done>
- /how-to-switch-gapp-providers page exists with 5-step switching process and timeline
- Static metadata with title, description, keywords, openGraph type article, canonical URL
- FAQPageSchema with 6 questions + BreadcrumbSchema
- "Signs it's time to switch" section with practical indicators
- "What to tell your current agency" section with sample script
- Timeline section showing 3-6 weeks total
- Links to /directory, /gapp-approval-guide, /gapp-services-explained, /gapp-respite-care (4+ internal links)
- Content uses parent-advocate voice, passes anti-AI style checklist
  </done>
</task>

<task type="auto">
  <name>Task 2: Create /gapp-respite-care page</name>
  <files>app/gapp-respite-care/page.tsx</files>
  <action>
Create `app/gapp-respite-care/page.tsx` as a server component. Copy structure from `app/gapp-approval-guide/page.tsx` exactly.

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'GAPP Respite Care in Georgia: How to Get Backup Nursing Hours',
  description: 'GAPP respite care gives you a break while a trained nurse watches your child. How it works, who qualifies, how many hours you get, and how to request it.',
  keywords: 'GAPP respite care Georgia, respite nursing Georgia, caregiver respite GAPP, backup nursing hours, GAPP respite eligibility, respite care medically fragile child',
  openGraph: {
    title: 'GAPP Respite Care in Georgia: How to Get Backup Nursing Hours',
    description: 'How GAPP respite care works, who qualifies, and how to request backup nursing hours for your child.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-respite-care',
  },
}
```

**Schemas:** FAQPageSchema + BreadcrumbSchema at top of JSX (Home > GAPP respite care).

**Page sections (in order):**

1. **Hero** — `bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4`. Breadcrumb nav. H1: "GAPP respite care: how to get backup nursing hours". Subtitle: You can't do this alone forever. Respite care gives you a break while a trained nurse takes over.

2. **What respite care actually is** — `bg-white py-12 px-4` with `max-w-3xl mx-auto`. H2: "What respite care means in GAPP". Keep it plain:

   Respite care is temporary relief for you. A nurse or PCS aide comes to your home so you can step away — sleep, run errands, go to a doctor's appointment, or just sit in your car in a parking lot for an hour without anyone needing you.

   It's not a different program. It's built into GAPP. Your agency requests respite hours as part of your child's care plan. The respite nurse handles everything your regular nurse would — meds, monitoring, trach care, whatever your child needs.

   Add a highlighted box (bg-blue-50 border-blue-200 rounded-xl p-6): "Respite isn't a luxury. If you're the primary caregiver for a medically fragile child, burnout is real. Respite hours exist because the system knows you need breaks to keep going."

3. **Who qualifies for respite** — `bg-gray-50 py-12 px-4`. H2: "Who qualifies for GAPP respite care". Keep it simple:
   - Your child is already receiving GAPP services (RN, LPN, or PCS)
   - Your child has an active prior authorization
   - Your physician includes respite in the care plan or supports adding it
   - You're the primary caregiver and need temporary relief

   Add a note: You don't need a separate application for respite. It gets added to your existing GAPP authorization. Talk to your agency and your child's doctor.

4. **How many hours you get** — `bg-white py-12 px-4`. H2: "How many respite hours can you get?" Be honest about the variability:

   There's no single answer. Respite hours depend on what Medicaid authorizes and what your physician orders. Some families get a few hours a week. Others get a block of hours per month. The amount depends on:
   - Your child's medical complexity
   - How many regular nursing hours you already receive
   - What the physician documents as medically necessary
   - Medicaid's authorization decision

   Add a tip box (bg-green-50 border-green-200): "If you're not getting enough respite hours, ask your doctor to write a letter explaining why you need more. Medicaid responds to documented medical necessity."

5. **How to request respite** — `bg-gray-50 py-12 px-4`. H2: "How to request respite hours". Use the numbered step card pattern:

   Step 1: **Talk to your GAPP agency** — Tell your care coordinator or intake person that you need respite hours. They handle this kind of request regularly.

   Step 2: **Get your doctor involved** — Your physician needs to include respite in the care plan or write a supporting order. Tell your doctor you're the primary caregiver and need periodic relief to maintain your own health.

   Step 3: **Agency submits the request** — Your agency submits the respite hours as part of your child's prior authorization to Medicaid. This may be included in a renewal or submitted as a modification.

   Step 4: **Medicaid reviews and approves** — Approval typically comes with your regular authorization. If denied, your agency can appeal with additional documentation from your doctor.

   Step 5: **Schedule your respite shifts** — Once approved, work with your agency to schedule the hours. Some families use them on a regular weekly schedule. Others bank them for when they need a longer break.

6. **What respite looks like day-to-day** — `bg-white py-12 px-4`. H2: "What a respite shift looks like". A short day-in-the-life paragraph to make it concrete:

   The respite nurse arrives at 8am on Saturday. You walk her through your child's morning routine — when the next med is due, what to watch for with the vent settings, where the backup supplies are. Then you leave. You go to the grocery store alone. You get coffee. You sit somewhere quiet. The nurse handles everything — meds, feedings, suctioning, diaper changes. You come back at noon and your child is fine. That's respite.

   Add a second paragraph: Some families use respite for overnight coverage so both parents can sleep. Others use it during the week so the primary caregiver can work a part-time job. There's no wrong way to use it as long as a qualified nurse is with your child.

7. **Common barriers and how to handle them** — `bg-gray-50 py-12 px-4`. H2: "What gets in the way (and how to fix it)". Address the real obstacles families face, using brief paragraphs:

   **"My agency says they can't staff respite shifts."** This is the most common problem. If your agency can't find nurses for respite, ask if they can pull from a different pool or hire per diem staff. If they still can't, consider a second agency for respite-only hours, or look for a new primary agency that has better staffing. Search our [directory](/directory).

   **"My doctor didn't include respite in the order."** Doctors don't always know to add it. Call the office and say: "I need respite hours added to my child's GAPP care plan. Can we update the physician order?" Most will add it once you explain what respite means in GAPP.

   **"Medicaid denied my respite hours."** Ask for the denial reason in writing. Have your doctor write a letter of medical necessity explaining caregiver burnout risk and impact on the child's care. Your agency can resubmit or appeal.

8. **FAQ section** — `bg-white py-12 px-4`. Use `<details>` pattern. 6 FAQs:
   - "Is respite care free through GAPP?" — Yes. Respite hours are covered under your child's GAPP authorization. There's no out-of-pocket cost if your child has active Medicaid and an approved prior auth.
   - "Can I use respite hours to go to work?" — Yes. You can use respite hours however you need to. Work, sleep, errands, medical appointments, or just taking a break. The nurse is there for your child regardless of where you go.
   - "Do I have to use the same agency for respite?" — Not necessarily. Some families use a second agency specifically for respite hours if their primary agency can't staff them. Talk to your care coordinator about options.
   - "How often can I use respite?" — As often as your authorized hours allow. Some families use a few hours every week. Others save up hours for a longer break once a month. It depends on what Medicaid approved.
   - "What if I need respite right now — like today?" — Call your agency and ask for emergency coverage. Most agencies have per diem nurses who can fill short-notice shifts. If your agency can't help, call other agencies in your area from our directory.
   - "Can respite nurses do everything my regular nurse does?" — They should be able to. Respite nurses need to be trained on your child's specific care plan. Before the first respite shift, have the nurse review the care plan and walk through your child's equipment and routines.

9. **Related Resources** — `bg-gray-50 py-12 px-4`. Grid with 4 links:
   - `/gapp-services-explained` — "GAPP services explained" / "What RN, LPN, and PCS actually cover"
   - `/how-to-apply-for-gapp` — "How to apply for GAPP" / "Documents, steps, and timeline"
   - `/how-to-switch-gapp-providers` — "Switch GAPP providers" / "How to find a better agency"
   - `/directory` — "Find a GAPP provider" / "Search agencies by county"

10. **CTA** — "Need a GAPP agency that can staff respite hours?" with buttons to `/directory` ("Browse Providers") and `/screener` ("Check Eligibility").

11. **Disclaimer** — `config.contact.disclaimer`.

**Internal links (LINK-01 — minimum 3):** `/directory`, `/gapp-services-explained`, `/how-to-apply-for-gapp`, `/how-to-switch-gapp-providers`, `/screener`, `/gapp-paid-caregiver`. Weave inline links naturally in body text + Related Resources grid. Include at least one county page link (e.g., mention "families in Gwinnett County" with a link to `/gwinnett`).

**ANTI-AI-STYLE-GUIDE.md compliance (QUAL-01, QUAL-02, QUAL-03):**
- Write like a parent who's been through caregiver burnout explaining respite to another parent
- The day-in-the-life paragraph is the key differentiator — make it feel real and specific
- No "serves as," "it's important to note," "comprehensive," "vibrant," "diverse array"
- No three-adjective clusters. No "-ing" phrases tacked on sentence ends.
- Sentence case headings. Max 1 AI vocabulary word per paragraph.
- Max 1-2 em dashes total. No "despite" sandwich structures.
- End with next steps (links, directory), not a summary.
- "Your kid" where natural. Short sentences. Plain verbs.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && npx tsc --noEmit app/gapp-respite-care/page.tsx 2>&1 | head -20 && grep -c "FAQPageSchema\|BreadcrumbSchema\|canonical\|href=" app/gapp-respite-care/page.tsx</automated>
  </verify>
  <done>
- /gapp-respite-care page exists with eligibility, request process, and day-to-day examples
- Static metadata with title, description, keywords, openGraph type article, canonical URL
- FAQPageSchema with 6 questions + BreadcrumbSchema
- "What respite care actually is" section with burnout acknowledgment
- 5-step request process
- Day-in-the-life paragraph making respite concrete
- "Common barriers" section with practical fixes
- Links to /directory, /gapp-services-explained, /how-to-apply-for-gapp, /how-to-switch-gapp-providers (4+ internal links)
- Content uses parent-advocate voice, passes anti-AI style checklist
  </done>
</task>

<task type="auto">
  <name>Task 3: Add both pages to sitemap.ts</name>
  <files>app/sitemap.ts</files>
  <action>
Open `app/sitemap.ts`. Find the last entry in the "SEO Content Expansion v1.1" section (currently `gapp-services-explained` around line 190). Add two new entries immediately after:

```typescript
    {
      url: `${baseUrl}/how-to-switch-gapp-providers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gapp-respite-care`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
```

Use `priority: 0.8` and `changeFrequency: 'monthly'` to match the existing content page pattern.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "how-to-switch-gapp-providers\|gapp-respite-care" app/sitemap.ts && npx tsc --noEmit app/sitemap.ts 2>&1 | head -5</automated>
  </verify>
  <done>
- sitemap.ts contains entries for both new URLs
- Each entry has priority 0.8 and changeFrequency monthly
- File compiles without TypeScript errors
  </done>
</task>

</tasks>

<verification>
After all three tasks complete, verify the full phase:

1. **Build check:** `npm run build` completes without errors
2. **Both routes exist:** Visit /how-to-switch-gapp-providers and /gapp-respite-care in dev
3. **SEO infrastructure per page:** Each page has metadata export, FAQPageSchema, BreadcrumbSchema, canonical URL
4. **Sitemap:** Both URLs appear in sitemap output
5. **Internal links:** Each page links to 3+ existing pages (grep for href= counts)
6. **Anti-AI style spot check:** No "serves as," no "it's important to note," no three-adjective clusters, sentence case headings
7. **Cross-linking:** The two new pages link to each other where natural
</verification>

<success_criteria>
1. /how-to-switch-gapp-providers page exists with 5-step process, timeline (3-6 weeks), signs to switch, what to say script
2. /gapp-respite-care page exists with eligibility, 5-step request process, day-in-the-life paragraph, common barriers section
3. Both pages have: static metadata export, FAQPageSchema (6 Qs each), BreadcrumbSchema, canonical URL
4. Both pages appear in sitemap.ts with priority 0.8
5. Each page links to 3+ existing pages via Related Resources grid and inline links
6. Content uses parent-advocate voice and passes ANTI-AI-STYLE-GUIDE.md pre-publish checklist
7. `npm run build` succeeds with no errors
</success_criteria>

<output>
After completion, create `.planning/phases/3/03-01-SUMMARY.md`
</output>
