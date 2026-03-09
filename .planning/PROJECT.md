# GeorgiaGAPP.com — GAPP Provider Directory

## What This Is

A Next.js directory connecting Georgia families with GAPP (Georgia Pediatric Program) providers for special needs children requiring home nursing and personal care services. Live at georgiagapp.com with 327 providers, 159 county pages, and 18 content pages.

## Core Value

Help families quickly find verified GAPP providers by county and get connected through callback requests.

## Requirements

### Validated

- [x] Provider search by county (159 GA counties)
- [x] Filter by service type (RN, LPN, PCS)
- [x] Provider profiles with callback forms
- [x] Provider claim flow
- [x] County pages with dynamic metadata and nearby counties
- [x] Content pages (18 total — approval guide, eligibility, waivers, services, provider enrollment, paid caregiver, comparisons, respite care)
- [x] Sitemap with 829+ URLs, proper priority tiers
- [x] Schema markup (Organization, BreadcrumbList, FAQPage, MedicalBusiness)
- [x] Provider analytics dashboard with event tracking and magic link auth
- [x] Help Me Choose quiz
- [x] Eligibility screener
- [x] SEO content expansion v1.1 (7 new pages + internal linking retrofit)
- [x] Custom skills (content-writer, seo-auditor, county-enricher)
- [x] Admin auth system

### Active (v1.2)

- [ ] County enrichment — unique content for all 159 counties
- [ ] Blog infrastructure — /blog index + post template + Article schema
- [ ] First blog posts — 3-5 posts targeting SERP gaps

### Out of Scope

- City-level pages — county pages are primary geo unit for GAPP
- Provider reviews system — requires moderation; separate milestone
- Spanish language pages — separate i18n milestone
- Paid ad landing pages — organic-first strategy

## Context

**SEO Audit (March 7, 2026):** Technical SEO scores ~92/100. Strong foundation with schema, metadata, sitemap. Content gap closed by v1.1.

**v1.1 Complete (March 9, 2026):** 7 new SEO content pages deployed + internal linking retrofit. Canonical URL and metadataBase fixes pushed.

**SERP Position:**
- georgiagapp.com ranks #1 for "GAPP providers Georgia"
- v1.1 pages targeting provider-side and specific family queries now live
- County pages use generic fallback for ~130 of 159 counties — v1.2 fixes this
- No blog exists — missing fresh content signals for Google

## Constraints

- **Tech stack**: Next.js 14.2.5, Tailwind, Supabase, Vercel
- **Tone**: Parent-advocate voice, not healthcare textbook (see ANTI-AI-STYLE-GUIDE.md)
- **SEO**: All pages need generateMetadata, schema markup, internal links, FAQ sections
- **County enrichment**: Must use genuinely unique content per county, not variable-swapped templates

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Anti-AI style guide before content | AI-sounding content hurts rankings (Google helpful content system) | Enforced across all v1.1 content |
| Provider-side content first (v1.1) | Drives Featured tier ($99/mo) signups = revenue | 7 pages deployed |
| County enrichment in v1.2 | Needed to differentiate 159 county pages from thin/duplicate content | In progress |
| Blog in v1.2 | Fresh content signals + topical authority building | Planned |
| Split county enrichment into 2 phases | 159 counties too large for one phase; metro first for highest impact | Phases 5-6 |
| Custom skills for repeatable workflows | Eliminated per-session ramp-up time for content creation | 3 skills built |

---
*Last updated: 2026-03-09 — v1.2 milestone initialized*
