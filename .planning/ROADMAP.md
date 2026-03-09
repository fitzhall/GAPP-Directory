# Roadmap: GeorgiaGAPP.com v1.2 — County Enrichment & Blog System

## Phase 5: County Enrichment — Metro Atlanta & Regional Centers

**Goal:** Enrich the top 30-40 highest-traffic county pages with unique local content, DFCS office info, and honest provider coverage context. Uses the `/gapp-county-enricher` skill.

**Requirements:** CNTY-01 through CNTY-05, QUAL-01 through QUAL-03

**Success Criteria:**
1. Top 30 metro/regional counties have enhanced `COUNTY_CONTEXT` entries with DFCS office info
2. Each description contains at least one locally-specific fact
3. Rural counties with low coverage honestly state the gap
4. All descriptions pass ANTI-AI-STYLE-GUIDE.md checklist
5. `npm run build` passes with no TypeScript errors

## Phase 6: County Enrichment — Remaining Counties

**Goal:** Complete enrichment for all remaining ~120 rural and suburban counties. Batch processing via `/gapp-county-enricher all`.

**Requirements:** CNTY-01 through CNTY-05, QUAL-01 through QUAL-03

**Success Criteria:**
1. All 159 counties have unique `COUNTY_CONTEXT` entries (no generic fallback used)
2. Every description is distinguishable from every other county
3. Neighboring county cross-references are accurate
4. All descriptions pass ANTI-AI-STYLE-GUIDE.md checklist
5. `npm run build` passes

## Phase 7: Blog Infrastructure

**Goal:** Build the `/blog` system — index page, post layout with Article schema, MDX/markdown support, and sitemap integration.

**Requirements:** BLOG-01 through BLOG-05, LINK-01, LINK-02

**Success Criteria:**
1. `/blog` index page exists with post listing sorted by date
2. Blog post template renders with Article schema, author, date, reading time
3. Posts have generateMetadata, canonical URLs, openGraph
4. Blog routes appear in sitemap.ts
5. Footer includes blog link
6. `npm run build` passes

## Phase 8: First Blog Posts & Internal Linking

**Goal:** Publish 3-5 blog posts targeting SERP gaps, wire bidirectional internal links.

**Requirements:** POST-01 through POST-05, LINK-01, LINK-02, QUAL-01 through QUAL-03

**Success Criteria:**
1. At least 3 blog posts published with unique, keyword-targeted content
2. Each post has FAQPage schema (5-7 questions)
3. Each post links to 3+ existing content/county pages
4. Each post is linked from 2+ existing pages (bidirectional)
5. All content passes ANTI-AI-STYLE-GUIDE.md checklist
6. Homepage references blog or latest post

---

## Phase Summary

| # | Phase | Goal | Requirements | Criteria |
|---|-------|------|--------------|----------|
| 5 | County Enrichment (Metro) | Top 30-40 counties with local content | CNTY-01-05, QUAL-01-03 | 5 |
| 6 | County Enrichment (Rural) | Remaining ~120 counties | CNTY-01-05, QUAL-01-03 | 5 |
| 7 | Blog Infrastructure | /blog index + post template + schema | BLOG-01-05, LINK-01-02 | 6 |
| 8 | First Blog Posts | 3-5 posts + bidirectional linking | POST-01-05, LINK-01-02, QUAL-01-03 | 6 |

**Total:** 4 phases | 20 requirements | All covered

---
*Roadmap created: 2026-03-09*
*Continues from v1.1 phase numbering (Phases 1-4 complete)*
