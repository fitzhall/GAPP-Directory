# GeorgiaGAPP.com — GAPP Provider Directory

## What This Is

A Next.js directory connecting Georgia families with GAPP (Georgia Pediatric Program) providers for special needs children requiring home nursing and personal care services. Live at georgiagapp.com with 327 providers, 159 county pages, and 11 content pages.

## Core Value

Help families quickly find verified GAPP providers by county and get connected through callback requests.

## Requirements

### Validated

- [x] Provider search by county (159 GA counties)
- [x] Filter by service type (RN, LPN, PCS)
- [x] Provider profiles with callback forms
- [x] Provider claim flow
- [x] County pages with dynamic metadata and nearby counties
- [x] Content pages (approval guide, eligibility, waivers, services)
- [x] Sitemap with 829+ URLs, proper priority tiers
- [x] Schema markup (Organization, BreadcrumbList, FAQPage, MedicalBusiness)
- [x] Provider analytics dashboard with event tracking and magic link auth
- [x] Help Me Choose quiz
- [x] Eligibility screener

### Active

- [ ] SEO content expansion (7 new pages targeting SERP gaps)
- [ ] Internal linking improvements
- [ ] Anti-AI content style enforcement (ANTI-AI-STYLE-GUIDE.md)

### Out of Scope

- Blog infrastructure — deferred to v1.2 (need content pages first)
- City-level pages — deferred (county pages are priority)
- Provider reviews system — future milestone
- SMS notifications — future milestone

## Context

**SEO Audit (March 7, 2026):** Technical SEO scores ~92/100. Strong foundation with schema, metadata, sitemap. Gap is content velocity and search intent coverage.

**SERP Analysis findings:**
- georgiagapp.com ranks #1 for "GAPP providers Georgia"
- NOT ranking for provider-side queries ("how to become a GAPP provider")
- NOT ranking for specific family queries ("GAPP paid caregiver", "GAPP vs CCSP")
- Competitors: Health Force of GA, Clarks Care Solutions, Miralta Home Care, Advance Care Partners

**Content style:** ANTI-AI-STYLE-GUIDE.md created from Wikipedia's "Signs of AI Writing" — must be read before any content creation.

## Constraints

- **Tech stack**: Next.js 14.2.5, Tailwind, Supabase, Vercel
- **Tone**: Parent-advocate voice, not healthcare textbook (see ANTI-AI-STYLE-GUIDE.md)
- **SEO**: All pages need generateMetadata, schema markup, internal links, FAQ sections

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Anti-AI style guide before content | AI-sounding content hurts rankings (Google helpful content system) | — Pending |
| Provider-side content (#1 priority) | Drives Featured tier ($99/mo) signups = revenue | — Pending |
| County page enrichment deferred to v1.2 | New content pages have higher ROI than enriching existing | — Pending |

---
*Last updated: 2026-03-07 after SEO audit and SERP analysis*
