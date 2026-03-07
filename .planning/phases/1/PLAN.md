---
phase: 01-seo-content
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/how-to-become-a-gapp-provider/page.tsx
  - app/gapp-paid-caregiver/page.tsx
  - app/sitemap.ts
autonomous: true
requirements: [CONT-01, CONT-02, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, LINK-01, QUAL-01, QUAL-02, QUAL-03]

must_haves:
  truths:
    - "Visitor can read /how-to-become-a-gapp-provider with enrollment steps, DBHDD requirements, and CTA to Featured listing"
    - "Visitor can read /gapp-paid-caregiver explaining family caregiver payment through GAPP"
    - "Both pages appear in Google-parseable sitemap"
    - "Both pages have FAQPage and BreadcrumbList structured data"
    - "Both pages link to 3+ existing pages each"
    - "Content reads like a knowledgeable friend, not a healthcare textbook or AI slop"
  artifacts:
    - path: "app/how-to-become-a-gapp-provider/page.tsx"
      provides: "Provider enrollment content page"
      min_lines: 250
      contains: "export const metadata"
    - path: "app/gapp-paid-caregiver/page.tsx"
      provides: "Family caregiver payment content page"
      min_lines: 250
      contains: "export const metadata"
    - path: "app/sitemap.ts"
      provides: "Updated sitemap with both new URLs"
      contains: "how-to-become-a-gapp-provider"
  key_links:
    - from: "app/how-to-become-a-gapp-provider/page.tsx"
      to: "/providers"
      via: "CTA link to claim listing / get Featured"
      pattern: "href=\"/providers\""
    - from: "app/how-to-become-a-gapp-provider/page.tsx"
      to: "/directory"
      via: "Link to see listed providers"
      pattern: "href=\"/directory\""
    - from: "app/gapp-paid-caregiver/page.tsx"
      to: "/directory"
      via: "CTA to find agencies that hire family caregivers"
      pattern: "href=\"/directory\""
    - from: "app/gapp-paid-caregiver/page.tsx"
      to: "/services/personal-care"
      via: "Link to PCS service page"
      pattern: "href=\"/services/personal-care\""
---

<objective>
Create two revenue-driving SEO content pages for GeorgiaGAPP.com and register them in the sitemap.

Purpose: Capture provider-side search traffic (drives $99/mo Featured signups) and high-intent family searches about paid caregiving through GAPP. These are the two highest-ROI pages in the SEO expansion.

Output: Two new page.tsx files and an updated sitemap.ts.
</objective>

<execution_context>
@./ANTI-AI-STYLE-GUIDE.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/REQUIREMENTS.md
@.planning/phases/1/01-RESEARCH.md

<interfaces>
<!-- Template page to copy structure from -->
@app/gapp-approval-guide/page.tsx

<!-- Schema components — use FAQPageSchema and BreadcrumbSchema -->
From components/JsonLd.tsx:
```typescript
interface FAQItem { question: string; answer: string }
interface FAQPageSchemaProps { faqs: FAQItem[] }
export function FAQPageSchema({ faqs }: FAQPageSchemaProps): JSX.Element

interface BreadcrumbItem { name: string; url: string }
interface BreadcrumbSchemaProps { items: BreadcrumbItem[] }
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps): JSX.Element
```

From lib/supabase.ts:
```typescript
export const supabase: SupabaseClient
```

From lib/config.ts:
```typescript
export const config: { contact: { disclaimer: string }, tiers: [...], ... }
```

<!-- Sitemap structure — add entries after the pediatric-home-nursing-georgia entry (line ~159) -->
@app/sitemap.ts
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create /how-to-become-a-gapp-provider page</name>
  <files>app/how-to-become-a-gapp-provider/page.tsx</files>
  <action>
Create `app/how-to-become-a-gapp-provider/page.tsx` as a server component. Copy the exact structure of `app/gapp-approval-guide/page.tsx` — same imports, same section cadence, same Tailwind patterns.

**Imports:**
```typescript
import Link from 'next/link'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { config } from '@/lib/config'
import { FAQPageSchema, BreadcrumbSchema } from '@/components/JsonLd'
```

**Metadata (static export, NOT generateMetadata):**
```typescript
export const metadata: Metadata = {
  title: 'How to Become a GAPP Provider in Georgia (2026 Guide)',
  description: 'Step-by-step guide to becoming a GAPP provider in Georgia. DBHDD licensing, Medicaid enrollment, and how to list your agency in the provider directory.',
  keywords: 'become GAPP provider Georgia, GAPP agency requirements, DBHDD home health license, Georgia Medicaid enrollment, GAPP provider directory listing',
  openGraph: {
    title: 'How to Become a GAPP Provider in Georgia',
    description: 'DBHDD licensing, Medicaid enrollment, and listing your agency. The complete guide for home health agencies.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/how-to-become-a-gapp-provider',
  },
}
```

**FAQ array (6 items):** Define a `PROVIDER_FAQS` const array at top of file. Questions should target real provider-side search queries:
1. How long does it take to become a GAPP provider?
2. What licenses do I need to start a GAPP agency in Georgia?
3. How much does it cost to start a GAPP home health agency?
4. Can an individual nurse become a GAPP provider?
5. How do GAPP agencies get paid?
6. How do I get listed in the GAPP provider directory?

Answers must be factual, specific, and written in the style of ANTI-AI-STYLE-GUIDE.md. Short sentences. No "serves as", no "it's important to note", no three-adjective clusters.

**Provider stats:** Include `getProviderStats()` function (copy from gapp-approval-guide) to show live stats like "Join 327+ providers already listed."

**Page sections (follow the exact section pattern from gapp-approval-guide):**

1. **Hero** — `bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4`, visual breadcrumb (Home / Become a GAPP provider), h1, subtitle for agency owners/nurses considering starting a GAPP agency.

2. **"Who this is for" bar** — `bg-gray-50 border-b`, pills for: Home health agency owners, Nurses starting an agency, Existing agencies expanding to GAPP, Healthcare entrepreneurs.

3. **Requirements section** — `py-12 px-4`, h2 "What you need to become a GAPP provider". Checklist-style items:
   - Georgia DBHDD home health agency license
   - Active Georgia Medicaid enrollment
   - Professional liability insurance
   - Qualified nursing staff (RN supervisors, LPN/PCS workers)
   - Office location in Georgia
   - Quality assurance program

4. **Steps section** — `py-12 px-4 bg-gray-50`, h2 "How to become a GAPP provider". Use the numbered step card pattern from gapp-approval-guide (colored header with number, white body). Steps:
   - Step 1: Get your DBHDD home health agency license (explain the Georgia Department of Behavioral Health and Developmental Disabilities licensing process)
   - Step 2: Enroll as a Georgia Medicaid provider (describe Medicaid enrollment through DXC Technology/GAMMIS)
   - Step 3: Set up your operations (staffing, training, office, compliance)
   - Step 4: Start accepting GAPP patients (prior authorization process, how referrals work)
   - Step 5: List your agency in the directory (CTA to /providers with stats embed)

5. **Directory CTA section** — Prominent CTA box (use the gradient accent box pattern from gapp-approval-guide step 3). Include live stats: "{stats.total} providers listed, {stats.accepting} accepting new patients." Two buttons:
   - "Claim your listing" -> /providers (primary coral button)
   - "Get Featured for $99/mo" -> /providers (secondary button, reference config.tiers[1])

6. **"What GAPP agencies do day-to-day" section** — `py-12 px-4`, brief practical description of daily operations. Keep it real: scheduling nurses, managing authorizations, coordinating with families.

7. **Related Resources grid** — `py-12 px-4 bg-gray-50`, sm:grid-cols-2 gap-4. Links to:
   - /directory — "Browse the provider directory"
   - /gapp-providers-georgia — "GAPP providers across Georgia"
   - /gapp-approval-guide — "How families get approved for GAPP"
   - /services/rn-nursing — "RN nursing services explained"

8. **FAQ section** — `py-12 px-4`, collapsible `<details>` elements using the exact pattern from gapp-approval-guide (group class, rotate chevron, px-6 py-4 summary).

9. **Final CTA** — `py-12 px-4 bg-gray-50`, "Already a GAPP provider?" with link to /providers.

10. **Disclaimer** — `py-8 bg-gray-100 border-t`, `config.contact.disclaimer`.

**Content quality rules (from ANTI-AI-STYLE-GUIDE.md — MUST follow):**
- Write like a knowledgeable friend talking to someone considering opening a GAPP agency
- Short sentences. If a comma is followed by "-ing", split or cut it.
- No "serves as", "it's important to note", "comprehensive", "vibrant", "diverse array", "landscape"
- No three-adjective clusters. No "not only X but also Y".
- Sentence case headings ("What you need" not "What You Need")
- Max 1 AI vocabulary word per paragraph
- Max 1-2 em dashes total
- Final section gives a next step (link), not a summary
- Test: "Could a stressed agency owner scan this in 30 seconds and get what they need?"

**Internal links (LINK-01 — minimum 3):**
- /providers (claim listing CTA)
- /directory (see who's listed)
- /gapp-providers-georgia (provider landscape)
- /gapp-approval-guide (inline link where discussing how families find providers)
- /services/rn-nursing (in Related Resources)
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && npx next build 2>&1 | tail -20</automated>
  </verify>
  <done>
- /how-to-become-a-gapp-provider route exists and builds without errors
- Page has static metadata with title 55-60 chars, description 150-160 chars, canonical URL
- Page has FAQPageSchema with 6 FAQ items and BreadcrumbSchema
- Page links to /providers, /directory, and /gapp-providers-georgia (minimum 3 internal links)
- Page has CTA referencing Featured tier ($99/mo)
- Content passes ANTI-AI-STYLE-GUIDE.md pre-publish checklist (no banned phrases, sentence case headings, parent-advocate voice)
  </done>
</task>

<task type="auto">
  <name>Task 2: Create /gapp-paid-caregiver page</name>
  <files>app/gapp-paid-caregiver/page.tsx</files>
  <action>
Create `app/gapp-paid-caregiver/page.tsx` as a server component. Same structure as Task 1 — copy from `app/gapp-approval-guide/page.tsx`.

**Imports:** Same as Task 1 (Link, Metadata, config, FAQPageSchema, BreadcrumbSchema). This page does NOT need supabase/stats — it's family-facing, not provider-facing.

**Metadata (static export):**
```typescript
export const metadata: Metadata = {
  title: 'Can You Get Paid as a GAPP Caregiver? Georgia Guide',
  description: 'Find out if family members can get paid as GAPP caregivers in Georgia. How PCS works, pay ranges, and steps to become a paid family caregiver through a GAPP agency.',
  keywords: 'GAPP paid caregiver Georgia, get paid caring for child GAPP, family caregiver Medicaid Georgia, PCS caregiver pay, GAPP personal care services',
  openGraph: {
    title: 'Can You Get Paid as a GAPP Caregiver in Georgia?',
    description: 'How family members can get paid to care for their child through GAPP. PCS explained.',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/gapp-paid-caregiver',
  },
}
```

**FAQ array (6 items):** Define a `CAREGIVER_FAQS` const array. Questions targeting family search intent:
1. Can a parent get paid to care for their child through GAPP?
2. How much do GAPP family caregivers get paid?
3. What's the difference between PCS and skilled nursing under GAPP?
4. Do I need training to become a paid GAPP caregiver?
5. Can grandparents or other family members be GAPP caregivers?
6. How long does it take to start getting paid as a GAPP caregiver?

Answers: factual, specific to Georgia, written in parent-to-parent voice. For pay ranges, be honest that rates vary by agency and don't make specific claims. Direct people to contact agencies for exact numbers.

**Page sections:**

1. **Hero** — Same gradient pattern. Breadcrumb: Home / GAPP paid caregiver. h1: "Can you get paid to care for your child through GAPP?" Subtitle addressing the core question directly — yes, through PCS, hired by an agency.

2. **"The short answer" section** — `py-12 px-4`, a highlighted box giving the direct answer upfront: Yes, family members can get paid as Personal Care Services (PCS) workers through a GAPP agency. You don't get paid directly by Medicaid — you get hired by an agency that has a GAPP contract. Explain this plainly in 3-4 sentences.

3. **"How it works" section** — `py-12 px-4 bg-gray-50`, numbered steps (use the step card pattern):
   - Step 1: Your child gets approved for GAPP PCS hours (link to /gapp-approval-guide)
   - Step 2: Find an agency that hires family caregivers (not all do — link to /directory)
   - Step 3: Apply with the agency as a PCS worker (background check, training requirements)
   - Step 4: Agency assigns you to your child's case
   - Step 5: You work shifts and get paid by the agency

4. **"What PCS caregivers actually do" section** — `py-12 px-4`, brief list of typical PCS duties (bathing, dressing, feeding, mobility, medication reminders — not skilled nursing). Clarify the line between PCS and RN/LPN. Link to /services/personal-care.

5. **"What to expect for pay" section** — `py-12 px-4 bg-gray-50`. Be honest: pay varies by agency, typically $10-15/hr range for PCS in Georgia, agencies handle payroll and taxes. Do NOT make specific promises about rates. Direct readers to ask agencies directly.

6. **"Things to know before you start" section** — `py-12 px-4`, practical callouts (use the amber/blue callout box patterns from gapp-approval-guide):
   - You can't be the caregiver AND the legal guardian in some situations — agency will clarify
   - You'll need a background check
   - Hours are set by the authorization, not by you
   - The agency is your employer, not Medicaid

7. **Related Resources grid** — `py-12 px-4 bg-gray-50`, links to:
   - /directory — "Find agencies that hire family caregivers"
   - /services/personal-care — "What PCS covers"
   - /gapp-approval-guide — "How to get your child approved for GAPP"
   - /how-it-works — "How the GAPP program works"

8. **FAQ section** — Collapsible details, same pattern as Task 1.

9. **Final CTA** — `py-12 px-4`, "Ready to find an agency?" with primary button to /directory, secondary to /screener.

10. **Disclaimer** — `config.contact.disclaimer`.

**Content quality rules — same as Task 1.** Additionally:
- This page talks to stressed parents. Write with empathy but stay practical.
- "Your kid" not "your medically fragile child" (except where clinical precision needed)
- Every paragraph answers "what do I do next?"
- No vague promises about pay. Be direct: "Call agencies and ask."

**Internal links (LINK-01 — minimum 3):**
- /directory (find agencies)
- /services/personal-care (PCS details)
- /gapp-approval-guide (getting approved)
- /how-it-works (inline reference)
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && npx next build 2>&1 | tail -20</automated>
  </verify>
  <done>
- /gapp-paid-caregiver route exists and builds without errors
- Page has static metadata with title 55-60 chars, description 150-160 chars, canonical URL
- Page has FAQPageSchema with 6 FAQ items and BreadcrumbSchema
- Page links to /directory, /services/personal-care, and /gapp-approval-guide (minimum 3 internal links)
- Content passes ANTI-AI-STYLE-GUIDE.md pre-publish checklist
- Page does NOT use 'use client' — server component only
  </done>
</task>

<task type="auto">
  <name>Task 3: Add both pages to sitemap.ts</name>
  <files>app/sitemap.ts</files>
  <action>
Edit `app/sitemap.ts`. Add two new entries to the `staticPages` array, inserted after the `pediatric-home-nursing-georgia` entry (currently the last SEO pillar page, around line 159):

```typescript
{
  url: `${baseUrl}/how-to-become-a-gapp-provider`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
{
  url: `${baseUrl}/gapp-paid-caregiver`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
```

Use `priority: 0.8` and `changeFrequency: 'monthly'` — same as other content pages (screener, quiz, county pages). These are not pillar pages (0.95) but above informational pages (0.7).

No other changes to sitemap.ts. Do not modify county pages, provider pages, or existing entries.
  </action>
  <verify>
    <automated>cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template" && grep -c "how-to-become-a-gapp-provider\|gapp-paid-caregiver" app/sitemap.ts</automated>
  </verify>
  <done>
- sitemap.ts contains entries for both /how-to-become-a-gapp-provider and /gapp-paid-caregiver
- Both entries have priority 0.8 and changeFrequency 'monthly'
- Existing sitemap entries unchanged
- File builds without TypeScript errors
  </done>
</task>

</tasks>

<verification>
After all three tasks complete:

1. **Build succeeds:** `npm run build` completes with no errors
2. **Routes exist:** Both `/how-to-become-a-gapp-provider` and `/gapp-paid-caregiver` are in the build output
3. **Sitemap updated:** `grep` confirms both URLs in sitemap.ts
4. **Content quality spot check:** Grep for banned phrases from ANTI-AI-STYLE-GUIDE.md:
   ```bash
   grep -i "serves as\|it's important to note\|diverse array\|vibrant\|comprehensive\|landscape\|tapestry\|testament\|not only.*but also" app/how-to-become-a-gapp-provider/page.tsx app/gapp-paid-caregiver/page.tsx
   ```
   Expected: zero matches
5. **Internal links check:**
   ```bash
   grep -c 'href="/' app/how-to-become-a-gapp-provider/page.tsx
   grep -c 'href="/' app/gapp-paid-caregiver/page.tsx
   ```
   Expected: 3+ each
6. **Schema check:**
   ```bash
   grep "FAQPageSchema\|BreadcrumbSchema" app/how-to-become-a-gapp-provider/page.tsx app/gapp-paid-caregiver/page.tsx
   ```
   Expected: Both components in both files
</verification>

<success_criteria>
- Both pages build and render as server components (no 'use client')
- Both pages have complete SEO: metadata, FAQPage schema, BreadcrumbList schema, canonical URLs
- Both pages appear in sitemap.ts with priority 0.8
- Provider page has CTA to Featured tier ($99/mo) linking to /providers
- Caregiver page explains PCS family caregiver path linking to /directory
- Each page links to 3+ existing pages
- Zero banned phrases from ANTI-AI-STYLE-GUIDE.md
- Content reads like a knowledgeable friend, not AI or a healthcare textbook
</success_criteria>

<output>
After completion, create `.planning/phases/1/01-01-SUMMARY.md`
</output>
