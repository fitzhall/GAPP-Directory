# Phase 1: Revenue-Driving Content (Provider + Caregiver Pages) - Research

**Researched:** 2026-03-07
**Domain:** Next.js App Router content pages, SEO schema markup, content style
**Confidence:** HIGH

## Summary

Phase 1 requires creating two new SEO content pages following the exact patterns already established across 10+ existing content pages. The codebase has a well-defined, consistent approach: static `export const metadata` for SEO, `FAQPageSchema` and `BreadcrumbSchema` components from `@/components/JsonLd`, server components by default, `max-w-3xl` centered layout, and Tailwind styling with the project's color system (primary coral, accent sky blue, navy text).

No new libraries, components, or infrastructure are needed. Both pages are pure content pages that follow the template set by `gapp-providers-georgia/page.tsx` and `gapp-approval-guide/page.tsx`. The sitemap needs two new entries. The navigation does not need changes (these are deep content pages, not nav-level items).

**Primary recommendation:** Copy the structure of `app/gapp-approval-guide/page.tsx` as the closest template for both new pages. It has the right section density, FAQ pattern, internal linking, and CTA placement.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | "How to become a GAPP provider" page with enrollment steps, requirements, CTA to /providers | Follow `gapp-approval-guide` pattern; link to existing `/providers` page which has claim/listing flow |
| CONT-02 | "GAPP paid caregiver" page explaining family caregiver payment through GAPP | Follow same content page pattern; include FAQ schema for search snippet eligibility |
| SEO-01 | generateMetadata with title (55-60 chars), description (150-160 chars), keywords | Use static `export const metadata: Metadata` pattern (all existing pages use this, not generateMetadata) |
| SEO-02 | FAQPage schema with 5-7 questions | Use `FAQPageSchema` component from `@/components/JsonLd` |
| SEO-03 | BreadcrumbList schema | Use `BreadcrumbSchema` component from `@/components/JsonLd` |
| SEO-04 | Pages in sitemap.ts with appropriate priority | Add entries to `app/sitemap.ts` static pages array |
| SEO-05 | Canonical URL set | Set in `metadata.alternates.canonical` |
| LINK-01 | Each page links to at least 3 existing pages | Use Related Resources section pattern + inline links |
| QUAL-01 | Passes ANTI-AI-STYLE-GUIDE.md checklist | Detailed style guide reviewed; see Content Quality section below |
| QUAL-02 | Parent-advocate voice, not healthcare textbook | Short sentences, plain verbs, action-oriented |
| QUAL-03 | Actionable next steps (phone numbers, links, timelines) | End with CTA section linking to `/directory`, `/providers`, or `/screener` |
</phase_requirements>

## Standard Stack

### Core (already in project)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| Next.js | 14.2.5 | App Router, static metadata export | Already configured |
| TypeScript | - | Page components | Strict types |
| Tailwind CSS | - | All styling | Use `cn()` from `lib/utils.ts` if needed |
| @supabase/supabase-js | ^2.57.4 | Only if page needs live stats | `gapp-providers-georgia` fetches provider stats; both new pages may want this |

### Supporting (already in project)
| Component | Path | Purpose |
|-----------|------|---------|
| `FAQPageSchema` | `@/components/JsonLd` | FAQ structured data |
| `BreadcrumbSchema` | `@/components/JsonLd` | Breadcrumb structured data |
| `WebPageSchema` | `@/components/JsonLd` | Available but not used by existing content pages |
| `ArticleSchema` | `@/components/JsonLd` | Available but not used by existing content pages |
| `config` | `@/lib/config` | Site config, disclaimer text, tier info |
| `supabase` | `@/lib/supabase` | Database client for provider stats |

**No new packages needed.**

## Architecture Patterns

### Content Page File Structure
```
app/
├── how-to-become-a-gapp-provider/
│   └── page.tsx          # Server component, ~300-500 lines
├── gapp-paid-caregiver/
│   └── page.tsx          # Server component, ~300-500 lines
```

Each page is a single `page.tsx` file in its own route folder. No layouts, no loading states, no client components needed.

### Pattern 1: Static Metadata Export

Every existing content page uses `export const metadata: Metadata` (NOT `generateMetadata`). This is the established pattern.

```typescript
// Source: app/gapp-approval-guide/page.tsx lines 39-51
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title Here (55-60 chars)',
  description: 'Description here (150-160 chars).',
  keywords: 'keyword1, keyword2, keyword3',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    type: 'article',  // Use 'article' for content pages
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/page-slug',
  },
}
```

**Note:** SEO-01 says "generateMetadata" but the actual codebase uses static export. Use static export to match the existing pattern. Both work identically for static content pages.

### Pattern 2: JSON-LD Schema Placement

Schemas go at the top of the returned JSX, before visible content.

```typescript
// Source: app/gapp-providers-georgia/page.tsx lines 87-93
export default async function PageName() {
  return (
    <div className="min-h-screen bg-white">
      <FAQPageSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Page Name', url: 'https://www.georgiagapp.com/page-slug' },
        ]}
      />
      {/* Visible content sections below */}
    </div>
  )
}
```

### Pattern 3: FAQ Data Structure

FAQs are defined as a const array at the top of the file, used for both schema and display.

```typescript
const FAQS = [
  {
    question: 'Question text?',
    answer: 'Answer text.',
  },
  // ... 5-7 items
]
```

### Pattern 4: FAQ Display (Collapsible Details)

```typescript
// Source: app/gapp-approval-guide/page.tsx lines 512-525
{FAQS.map((faq, i) => (
  <details key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
    <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between hover:bg-gray-50">
      {faq.question}
      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div className="px-6 pb-4 text-gray-700">
      {faq.answer}
    </div>
  </details>
))}
```

### Pattern 5: Section Layout

All content pages follow this section cadence:

1. **Hero** — `bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 px-4` with breadcrumb nav, h1, subtitle
2. **Content Sections** — alternating `bg-white` and `bg-gray-50` backgrounds, each `py-12 px-4` with `max-w-3xl mx-auto`
3. **Internal Link Section** — "Related Resources" grid near bottom
4. **CTA** — Final call-to-action with link to `/directory` or relevant page
5. **Disclaimer** — `config.contact.disclaimer` in gray footer section

### Pattern 6: Breadcrumb Nav (Visual)

A visual breadcrumb appears at top of hero, separate from the schema breadcrumb.

```typescript
<nav className="text-sm text-gray-500 mb-4">
  <Link href="/" className="hover:text-primary">Home</Link>
  <span className="mx-2">/</span>
  <span className="text-gray-900">Page Name</span>
</nav>
```

### Pattern 7: Internal Linking — Related Resources

```typescript
// Source: app/gapp-providers-georgia/page.tsx lines 341-363
<section className="py-12 sm:py-16 px-4 bg-gray-50">
  <div className="max-w-3xl mx-auto">
    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Related Resources</h2>
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Link href="/some-page" className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
        <h3 className="font-semibold text-gray-900 mb-1">Link Title</h3>
        <p className="text-sm text-gray-600">Short description</p>
      </Link>
      {/* More links */}
    </div>
  </div>
</section>
```

### Pattern 8: Provider Stats (Optional)

Some pages fetch live stats from Supabase for credibility. The provider page should do this (shows how many providers are listed). The caregiver page likely does not need this.

```typescript
// Source: app/gapp-providers-georgia/page.tsx lines 47-65
import { supabase } from '@/lib/supabase'

async function getProviderStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, services_offered, accepting_new_patients, is_verified')
    .eq('is_active', true)
  if (error || !data) return { total: 0, accepting: 0, verified: 0 }
  return {
    total: data.length,
    accepting: data.filter(p => p.accepting_new_patients).length,
    verified: data.filter(p => p.is_verified).length,
  }
}
```

### Anti-Patterns to Avoid
- **Client components for content pages:** All existing content pages are server components. No `'use client'` needed.
- **Dynamic metadata (generateMetadata):** Overkill for static content. Use `export const metadata`.
- **Custom schema JSON inline:** Always use the `JsonLd` components from `@/components/JsonLd`.
- **Hardcoded disclaimer text:** Use `config.contact.disclaimer`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON-LD schema | Inline `<script>` tags | `FAQPageSchema`, `BreadcrumbSchema` from `@/components/JsonLd` | Consistent structure, proper escaping |
| Metadata | Custom head tags | Next.js `Metadata` type export | Framework handles dedup and merging |
| Provider stats | Custom API call | Direct `supabase` import in server component | Server components can query directly |

## Common Pitfalls

### Pitfall 1: Canonical URL mismatch
**What goes wrong:** Canonical URL doesn't match the actual route, or uses naked domain instead of `www`.
**How to avoid:** Always use `https://www.georgiagapp.com/exact-slug`. Check that the slug in `alternates.canonical` matches the folder name exactly.

### Pitfall 2: Sitemap entry forgotten
**What goes wrong:** Page exists but isn't in sitemap. Google discovers it slowly.
**How to avoid:** Add entry to `app/sitemap.ts` staticPages array immediately when creating the page. Use `priority: 0.8` and `changeFrequency: 'monthly'` for content pages.

### Pitfall 3: AI-sounding content
**What goes wrong:** Content uses banned phrases from ANTI-AI-STYLE-GUIDE.md. Reads like a healthcare textbook.
**How to avoid:** Run the pre-publish checklist from the style guide. No "serves as," no "it's important to note," no three-adjective clusters, no "-ing" clauses tacked onto sentences. Write like talking to a friend who asked "how does this work?"

### Pitfall 4: Missing internal links
**What goes wrong:** New page is an orphan with no links in or out.
**How to avoid:** LINK-01 requires 3+ outbound links per page. Use the Related Resources grid pattern. Also add inline contextual links in body text (see how `gapp-approval-guide` links to `/directory` mid-content).

### Pitfall 5: OpenGraph type wrong
**What goes wrong:** Using `type: 'website'` for content/article pages.
**How to avoid:** Content pages should use `type: 'article'` in OpenGraph. Only the homepage and directory use `type: 'website'`.

## Content Quality Requirements (from ANTI-AI-STYLE-GUIDE.md)

The project has an extensive anti-AI style guide. Key rules for the planner to enforce:

### Voice
- Write like a knowledgeable friend, not a healthcare textbook
- Short sentences. If a sentence has a comma followed by "-ing", split or cut it.
- "Your kid" not "your medically fragile child" (except where clinical precision matters)
- Every paragraph answers "what do I do next?"

### Banned Patterns
- No "serves as" / "stands as" -- use "is"
- No "it's important to note/remember/consider"
- No "not only X but also Y"
- No "diverse array of" / "comprehensive" / "vibrant"
- No three-adjective clusters
- No "-ing" phrases tacked onto sentence ends
- No "despite its challenges" sandwich structure
- Max 1 AI vocabulary word per paragraph (see full list in guide)
- Max 1-2 em dashes per article
- Sentence case headings, not Title Case

### Pre-Publish Checklist
Each page MUST pass the 13-item checklist in the style guide before commit. The final check: "Could a stressed parent scan this in 30 seconds and get what they need?"

## Sitemap Integration

New entries needed in `app/sitemap.ts` static pages array:

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

Insert after the existing SEO pillar pages block (after `pediatric-home-nursing-georgia` entry, around line 159).

## Navigation

New pages do NOT need nav bar entries. The nav already has: Find Provider, Check Eligibility, Help Me Choose, What is GAPP?, Waivers, For Providers. These are deep content pages discovered via search and internal links.

The footer Resources section MAY get updated in Phase 4 (LINK-02/LINK-03), but that is out of scope for Phase 1.

## Page-Specific Guidance

### `/how-to-become-a-gapp-provider` (CONT-01)

**Target audience:** Home health agency owners or nurses considering starting a GAPP agency.
**Revenue angle:** This page should funnel readers to the `/providers` page where they can claim/list their agency. The Featured tier ($99/mo) is the revenue driver.
**Key content areas:**
- DBHDD licensing requirements for Georgia home health agencies
- Medicaid enrollment process for GAPP
- What GAPP agencies actually do day-to-day
- CTA: "Already a GAPP provider? Claim your listing" linking to `/providers`
- CTA: "Get featured for $99/mo" referencing the Featured tier from `config.tiers[1]`

**Internal links to include:**
- `/providers` (claim your listing)
- `/directory` (see who's already listed)
- `/gapp-providers-georgia` (understand the provider landscape)

### `/gapp-paid-caregiver` (CONT-02)

**Target audience:** Family members (parents, grandparents) wanting to know if they can get paid to care for their child through GAPP.
**Search intent:** "Can I get paid to care for my child through GAPP?" / "GAPP family caregiver pay"
**Key content areas:**
- Whether family members can be paid caregivers under GAPP (PCS specifically)
- How the process works (hire through an agency, not directly from Medicaid)
- Pay ranges and what to expect
- Steps to become a paid family caregiver
- CTA: "Find agencies that hire family caregivers" linking to `/directory`

**Internal links to include:**
- `/directory` (find providers)
- `/services/personal-care` (PCS is the relevant service)
- `/how-it-works` or `/gapp-approval-guide` (getting started)

## Open Questions

1. **Provider page live stats**
   - What we know: `gapp-providers-georgia` and `gapp-approval-guide` both fetch live provider stats from Supabase
   - What's unclear: Whether the "become a provider" page benefits from showing stats ("Join 327 providers already listed")
   - Recommendation: Include stats -- it adds credibility and is a proven pattern in the codebase

2. **Family caregiver specifics**
   - What we know: GAPP covers PCS (Personal Care Services) which can involve family caregivers hired through agencies
   - What's unclear: Exact Georgia-specific rules on family member eligibility as PCS workers
   - Recommendation: Keep content factual about the general process (family member applies through an agency) and direct readers to contact agencies for specifics. Do not make specific claims about pay rates or eligibility rules without verification.

## Sources

### Primary (HIGH confidence)
- `app/gapp-providers-georgia/page.tsx` -- Full content page pattern with metadata, schemas, stats, sections
- `app/gapp-approval-guide/page.tsx` -- Step-by-step content page pattern with FAQ, Related Resources
- `app/how-it-works/page.tsx` -- Simpler content page pattern
- `components/JsonLd.tsx` -- All available schema components and their interfaces
- `app/sitemap.ts` -- Sitemap structure and priority conventions
- `app/layout.tsx` -- Navigation structure, footer links
- `ANTI-AI-STYLE-GUIDE.md` -- Content quality requirements

### Secondary (MEDIUM confidence)
- `app/providers/page.tsx` -- Existing "For Providers" page (client component with search/claim flow)
- `lib/config.ts` -- Tier pricing ($99/mo Featured) and site config

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, all patterns verified from codebase
- Architecture: HIGH -- direct observation of 3 existing content pages
- Pitfalls: HIGH -- based on actual codebase conventions and style guide
- Content accuracy (GAPP specifics): MEDIUM -- domain knowledge about Georgia Medicaid programs should be fact-checked

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (stable -- these are established codebase patterns)
