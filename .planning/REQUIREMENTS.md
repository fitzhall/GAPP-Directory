# Requirements: GeorgiaGAPP.com v1.2 — County Enrichment & Blog System

**Defined:** 2026-03-09
**Core Value:** Help families quickly find verified GAPP providers by county

## v1.2 Requirements

### County Enrichment (CNTY)

- [ ] **CNTY-01**: Each of the 159 county pages has a unique `COUNTY_CONTEXT` entry (not generic fallback)
- [ ] **CNTY-02**: Each county description contains at least one locally-specific fact (DFCS office location, provider count, neighboring county reference, or population context)
- [ ] **CNTY-03**: County descriptions pass ANTI-AI-STYLE-GUIDE.md checklist (max 1 AI vocab word, no three-adjective clusters, no promotional language)
- [ ] **CNTY-04**: Metro counties (top 30 by population) have DFCS office city and phone number where verifiable
- [ ] **CNTY-05**: Rural counties with low provider coverage honestly state the gap and suggest neighboring counties to search

### Blog Infrastructure (BLOG)

- [ ] **BLOG-01**: Blog index page exists at `/blog` with title, description, and list of posts sorted by date
- [ ] **BLOG-02**: Blog post layout exists with Article schema (JSON-LD), author, publish date, and reading time
- [ ] **BLOG-03**: Blog posts use markdown or MDX content with consistent styling matching site brand
- [ ] **BLOG-04**: Blog index and posts appear in sitemap.ts with appropriate priority
- [ ] **BLOG-05**: Blog posts have generateMetadata with unique title, description, canonical URL, and openGraph

### Blog Content (POST)

- [ ] **POST-01**: First blog post published — topic targeting a SERP gap identified from GSC or keyword research
- [ ] **POST-02**: Each blog post has 5-7 FAQ items with FAQPage schema
- [ ] **POST-03**: Each blog post links to at least 3 existing content/county pages
- [ ] **POST-04**: Each blog post passes ANTI-AI-STYLE-GUIDE.md checklist
- [ ] **POST-05**: Blog posts linked from relevant existing content pages (bidirectional linking)

### Internal Linking (LINK)

- [ ] **LINK-01**: Footer updated with blog link
- [ ] **LINK-02**: Homepage references blog section or latest post

### Content Quality (QUAL)

- [ ] **QUAL-01**: All new content passes ANTI-AI-STYLE-GUIDE.md checklist before commit
- [ ] **QUAL-02**: Content uses parent-advocate voice, not healthcare textbook tone
- [ ] **QUAL-03**: Each page/post has actionable next steps

## Out of Scope

| Feature | Reason |
|---------|--------|
| City-level pages | County pages are primary geo unit for GAPP |
| Provider reviews | Requires moderation system; separate milestone |
| Spanish language pages | Separate i18n milestone |
| Multi-admin auth | Already complete — not part of v1.2 |
| Additional content pages | Use /gapp-content-writer skill ad-hoc; v1.2 focuses on county depth + blog foundation |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CNTY-01 | Phase 5 | Pending |
| CNTY-02 | Phase 5 | Pending |
| CNTY-03 | Phase 5 | Pending |
| CNTY-04 | Phase 5 | Pending |
| CNTY-05 | Phase 5 | Pending |
| BLOG-01 | Phase 6 | Pending |
| BLOG-02 | Phase 6 | Pending |
| BLOG-03 | Phase 6 | Pending |
| BLOG-04 | Phase 6 | Pending |
| BLOG-05 | Phase 6 | Pending |
| POST-01 | Phase 7 | Pending |
| POST-02 | Phase 7 | Pending |
| POST-03 | Phase 7 | Pending |
| POST-04 | Phase 7 | Pending |
| POST-05 | Phase 7 | Pending |
| LINK-01 | Phase 7 | Pending |
| LINK-02 | Phase 7 | Pending |
| QUAL-01 | Phase 5-7 | Pending |
| QUAL-02 | Phase 5-7 | Pending |
| QUAL-03 | Phase 5-7 | Pending |

**Coverage:**
- v1.2 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
