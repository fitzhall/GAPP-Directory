# GAPP Content Skills Design

**Date:** 2026-03-09
**Goal:** Automate SEO content creation, auditing, and county enrichment via 3 custom Claude Code skills

## Context

GeorgiaGAPP.com ranks #1 for "GAPP providers Georgia". Milestone v1.1 added 7 SEO content pages + internal linking retrofit. The content creation process is repeatable but manual — every session requires re-explaining the same patterns (page template, ANTI-AI checklist, SEO infrastructure, internal linking). Skills eliminate that overhead.

**Sources combined:**
- Existing page template pattern (app/gapp-approval-guide/page.tsx)
- ANTI-AI-STYLE-GUIDE.md (content quality firewall)
- SEO Machine repo (TheCraigHewitt/seomachine) — content strategy, AI writing detection, programmatic SEO patterns
- v1.1 REQUIREMENTS.md (SEO infrastructure checklist)

## Skill 1: gapp-content-writer

**Location:** .claude/skills/gapp-content-writer/SKILL.md
**Trigger:** "write a page about [topic]", "new content page", "create SEO page"

### Workflow
1. Accept topic/keyword from user
2. Check existing pages to avoid keyword cannibalization
3. Generate complete page.tsx following template:
   - Imports: Link, Metadata, config, FAQPageSchema, BreadcrumbSchema
   - FAQ array (5-7 questions, parent-advocate voice)
   - metadata export: title (55-60 chars), description (150-160 chars), keywords, openGraph, canonical
   - Page component: Hero, body content, FAQ section, CTA to directory
4. Run ANTI-AI-STYLE-GUIDE checklist (automated scrub)
5. Add route to sitemap.ts
6. Wire 3+ internal links in the new page
7. Identify 2+ existing pages to retrofit with links back

### Quality gates
- Max 1 AI vocab word per paragraph
- Max 1-2 em dashes per page
- Sentence case headings
- No banned phrases from ANTI-AI-STYLE-GUIDE
- Parent-to-parent voice ("your kid" not "your medically fragile child")
- Every paragraph answers "what do I do next?"
- Final paragraph = next step, not summary

### Template structure
```
imports (Link, Metadata, config, FAQPageSchema, BreadcrumbSchema)
FAQ array (5-7 items)
metadata export (title, description, keywords, openGraph, canonical)
page component:
  - FAQPageSchema + BreadcrumbSchema (invisible)
  - Hero section (gradient bg, h1 sentence case, subtitle)
  - Body sections (h2 sentence case, prose, internal links)
  - FAQ accordion/display section
  - CTA section (link to /directory or /screener)
  - Disclaimer (config.contact.disclaimer)
```

## Skill 2: gapp-seo-auditor

**Location:** .claude/skills/gapp-seo-auditor/SKILL.md
**Trigger:** "audit the site", "SEO check", "check for issues", "GSC issues"

### Checks performed
1. Route verification — all sitemap.ts routes have matching page.tsx
2. Canonical check — every page with metadata has alternates.canonical
3. Schema check — content pages have FAQPageSchema + BreadcrumbSchema
4. Meta quality — title length, description length, uniqueness
5. Internal link audit — orphan pages, broken links
6. Content quality — ANTI-AI banned word density per page
7. Prioritized report output: Critical > High > Quick wins

### Out of scope
Page speed, Core Web Vitals, external link checking (require browser tools)

## Skill 3: gapp-county-enricher

**Location:** .claude/skills/gapp-county-enricher/SKILL.md
**Trigger:** "enrich [county]", "enrich counties", "county enrichment"

### Workflow
1. Accept county name or "all" for batch
2. Read current COUNTY_CONTEXT in app/[county]/page.tsx
3. For existing entries — enhance with local DFCS office info, unique GAPP access paragraph, neighboring county links
4. For missing entries — generate new context entry
5. Run ANTI-AI-STYLE-GUIDE against all generated text
6. Web search for real DFCS office data when possible

### Key constraint
Each county must have genuinely unique content (not variable-swapped templates)

## File structure

```
.claude/skills/
  gapp-content-writer/
    SKILL.md
  gapp-seo-auditor/
    SKILL.md
  gapp-county-enricher/
    SKILL.md
```

## What we're NOT building (yet)
- Blog post skill (no /blog infrastructure yet)
- Landing page CRO (not relevant to directory)
- Email/social skills (no distribution channels yet)
- Python analytics pipeline (no DataForSEO/GA4 integration)
