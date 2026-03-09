---
name: gapp-seo-auditor
description: "Audit GeorgiaGAPP.com for SEO issues including missing canonicals, orphan pages, broken links, missing schemas, and content quality. This skill should be used when the user says 'audit the site', 'SEO check', 'check for issues', 'why isn't this ranking', 'GSC issues', 'fix SEO', or 'indexing problems'. For creating new pages, see gapp-content-writer."
---

# GAPP SEO Auditor

Run a comprehensive SEO audit of GeorgiaGAPP.com. Check technical SEO, content quality, and internal linking. Output a prioritized report with specific fixes.

## Audit checks

Run all checks in order, then output a single prioritized report.

### Check 1: Route verification

Verify every URL in `app/sitemap.ts` has a matching `page.tsx` file. Also find any page.tsx files not in the sitemap. Flag mismatches as **Critical**.

### Check 2: Canonical URLs

Grep for `export const metadata` and `generateMetadata` across all page files. For each, verify `alternates.canonical` is present and uses `https://www.georgiagapp.com/`. Verify `metadataBase` is set in `app/layout.tsx`. Flag missing canonicals as **High**.

### Check 3: Schema markup

Identify content/SEO pages (sitemap priority >= 0.7, excluding interactive pages like quiz/screener/directory). Grep each for `FAQPageSchema` and `BreadcrumbSchema`. Flag missing schemas as **Medium**.

### Check 4: Meta quality

Extract all title and description values. Flag titles outside 40-65 chars, descriptions outside 140-165 chars, and any duplicates. Flag as **Medium**.

### Check 5: Internal link audit

Grep all `href="/` patterns across page files and layout.tsx. Build a link map. Identify orphan pages (linked from fewer than 2 pages) and broken links (targets without matching pages). Broken links = **Critical**, orphans = **High**.

### Check 6: Content quality

For each content page, count AI vocabulary words: delve, leverage, utilize, foster, bolster, underscore, showcase, pivotal, crucial, vibrant, robust, comprehensive, seamless, innovative, groundbreaking, tapestry, testament, landscape (abstract), nestled, boasts, multifaceted, holistic, intricate, nuanced. Flag pages with 3+ as **Low**. Check for em dash overuse (2+ per page) and Title Case headings.

### Check 7: Footer links

Read footer in `app/layout.tsx`. Verify all hrefs point to existing pages. Check if high-priority content pages (priority >= 0.8) are missing from footer.

## Report format

```
## SEO Audit Report

### Critical (blocking indexation)
- [issue]: [file] — [fix]

### High (hurting rankings)
- [issue]: [file] — [fix]

### Medium (optimization)
- [issue]: [file] — [fix]

### Low (nice to have)
- [issue]: [file] — [fix]

### Summary
- X critical, Y high, Z medium, W low
- Top 3 fixes to prioritize
```

After the report, ask which issues to fix and apply fixes when authorized.
