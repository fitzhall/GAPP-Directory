# SEO Track 1 + Drift-Prevention Guardrail

**Date:** 2026-04-27
**Author:** Claude (Opus 4.7) + Fitz
**Status:** Approved — ready for implementation plan

## Context

A 3-month GSC export pulled on 2026-04-27 showed:
- 13,306 impressions, 298 clicks (~3 clicks/day)
- Desktop position 15.92 vs mobile 7.20 — real systemic gap, not noise
- `/katie-beckett-waiver-georgia`: 1,691 imp, 6 clicks, position 31 — biggest unconverted opportunity on the site

A targeted audit (via `gapp-seo-auditor` skill) found:
- **16 pages** with title length > 60 chars (Google SERP truncation threshold)
- **12 pages** with meta description length > 160 chars
- **0 outbound authoritative (.gov) links** on the three highest-impression content pages: `katie-beckett-waiver-georgia`, `georgia-pediatric-program`, `gapp-home-care`
- 6 high-priority pages missing from the footer
- `/gapp-vs-ccsp` has only 2 inbound links

Schemas, canonicals, and routes all clean. The drift is concentrated in metadata and outbound authority signals.

## Why this is here

The current state is **drift after a previous SEO overhaul**. The SEO Gap Sprint on 2026-03-09 enriched several pages, and during that enrichment the title/meta lengths grew past Google's truncation thresholds without any check. There is currently no automated guardrail to prevent the next drift. Manual audit + manual data collection takes hours; the lead time between drift and detection is measured in weeks.

The goal of this spec is two-fold:
1. **Track 1** — fix the current drift today (titles, metas, outbound .gov links, footer, internal linking)
2. **Guardrail** — install a build-time hard block so future drift cannot reach production

## Non-goals

- Track 2 work (Katie Beckett body rewrite, comparison table expansion, image additions, em-dash polish)
- New content / new pages
- PageSpeed Core Web Vitals diagnosis (manual run by user)
- CI/CD changes beyond what `npm run build` already does (Vercel runs build on every push)

---

## Section 1 — The guardrail (`scripts/seo-check.ts`)

### What it is

A single Node/TypeScript script invoked before `next build`. It walks `app/**/page.tsx`, extracts the `metadata` export via regex, and enforces an SEO contract.

### Contract

| Rule | Threshold | Severity | Applies to |
|---|---|---|---|
| Title length | ≤ 60 chars | error | All pages with `metadata.title` |
| Description length | ≤ 160 chars | error | All pages with `metadata.description` |
| `alternates.canonical` present | required | error | All SEO/content pages |
| `FAQPageSchema` import + usage | required | error | Allowlisted SEO pages |
| `BreadcrumbSchema` import + usage | required | error | Allowlisted SEO pages |

### Allowlist

The script maintains an explicit list of "SEO content pages" that must satisfy schema requirements. This list mirrors the high-priority entries in `app/sitemap.ts` (priority ≥ 0.7, excluding interactive routes). The allowlist lives as a `SEO_CONTENT_PAGES` constant inside the script; adding a new SEO page is a one-line update.

### Excluded paths

Paths the script skips entirely:
- `app/admin/**`
- `app/dashboard/**`
- `app/api/**`
- Dynamic routes: `app/[county]/page.tsx`, `app/provider/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/claim/[slug]/page.tsx`, `app/claim/t/[token]/page.tsx`, `app/availability/[token]/page.tsx`
- `app/layout.tsx` (handled separately for `metadataBase` check)

### Output

Human-readable report grouped by severity:

```
SEO Check — 2026-04-27
======================
ERROR: app/katie-beckett-waiver-georgia/page.tsx
  → title is 78 chars (max 60): "Katie Beckett waiver Georgia: eligibility..."
  → description is 187 chars (max 160): "Complete guide..."

ERROR: app/georgia-pediatric-program/page.tsx
  → title is 80 chars (max 60): "Georgia Pediatric Program (GAPP) –..."

PASS: 27 pages OK
FAIL: 16 pages with errors

Exit code: 1
```

### Exit codes

- `0` — all pages pass
- `1` — one or more errors

### Bypass

`SKIP_SEO_CHECK=1 npm run build` bypasses the check. For emergency hot-fix deploys only. The script logs a visible warning when bypass is active, so the bypass is observable in deploy logs.

### Wiring

`package.json`:
```json
"scripts": {
  "build": "tsx scripts/seo-check.ts && next build",
  "seo:check": "tsx scripts/seo-check.ts"
}
```

Implementation note: the existing files in `scripts/` are `.ts` but `package.json` shows no current TS runner. The plan task that wires the script must first inspect `package.json` and either reuse an existing runner (`ts-node`, `tsx`) if one is found, or add `tsx` as a devDependency (`tsx` is preferred — faster, zero config). The chosen runner is what `package.json` `build` and `seo:check` scripts invoke.

### Two-phase rollout

Phase A — **report-only mode**: script runs, prints violations, but exits 0 regardless. Lets us land the script + use it as a progress meter while applying Track 1.

Phase B — **strict mode**: enabled after Track 1 reduces violations to zero. Script exits 1 on any error.

The phase is controlled by an env var `SEO_CHECK_STRICT` (default off in Phase A, on in Phase B). Final commit of Track 1 flips the default to on.

---

## Section 2 — Track 1 fixes

Five atomic commits.

### Commit 1: Title rewrites (16 pages)

Every page with title > 60 chars gets rewritten. Drop trailing `| GeorgiaGAPP.com` since `app/layout.tsx` already templates the brand suffix. Preserve primary keyword from GSC top-position queries.

Pages affected:
- `georgia-pediatric-program` (80 → ~58)
- `gapp-providers-georgia` (68 → ~55)
- `gapp-home-care` (76 → ~58)
- `medically-fragile-children-care` (74 → ~58)
- `gapp-approval-guide` (83 → ~52)
- `gapp-approval-timeline` (73 → ~58)
- `gapp-medicaid-requirements` (66 → ~52)
- `why-gapp-applications-get-denied` (64 → ~58)
- `katie-beckett-waiver-georgia` (78 → ~54)
- `pediatric-home-nursing-georgia` (76 → ~58)
- `how-to-apply-for-gapp` (64 → ~52)
- `waivers` (67 → ~58)
- Borderline pages (60–62): `gapp-services-explained`, `gapp-respite-care`, `long-term-care-children-georgia`, `how-it-works` — trim to ≤58 for safety margin

### Commit 2: Description rewrites (12 pages)

Trim each over-length description to 145–155 chars. Lead with primary query phrase. One CTA verb (e.g. "Learn", "Find", "Compare"). Same pages as Commit 1 plus any with desc > 160 not already covered.

### Commit 3: Outbound .gov links (3 pages)

Add an "Official resources" subsection (or contextual inline links) on:

- **`katie-beckett-waiver-georgia`**: `medicaid.georgia.gov` (Katie Beckett page), `dch.georgia.gov`, GA Centralized Katie Beckett team contact, `cms.gov` Katie Beckett overview
- **`georgia-pediatric-program`**: `medicaid.georgia.gov`, `dch.georgia.gov`, `medicaid.gov`
- **`gapp-home-care`**: same 3 + GA DCH home health page

All outbound links: `target="_blank"` and `rel="noopener noreferrer"`.

### Commit 4: Footer additions

`app/layout.tsx` Resources column adds 6 entries:
- `/gapp-approval-timeline`
- `/why-gapp-applications-get-denied`
- `/gapp-medicaid-requirements`
- `/how-to-apply-for-gapp`
- `/how-to-switch-gapp-providers`
- `/gapp-paid-caregiver`

### Commit 5: Internal links to `/gapp-vs-ccsp`

Add contextual `<Link>` to `/gapp-vs-ccsp` from:
- `app/waivers/page.tsx`
- `app/gapp-medicaid-requirements/page.tsx`

---

## Section 3 — Order of operations

```
1. Build guardrail (scripts/seo-check.ts) in report-only mode
2. Wire to package.json (SEO_CHECK_STRICT=0 by default)
3. Run guardrail → confirm it flags the 16+12 known violations
4. Apply Track 1 commits 1–5 sequentially (re-run guardrail after each)
5. Final state: guardrail reports 0 violations
6. Flip default to strict mode (SEO_CHECK_STRICT=1 inline default)
7. npm run build → must pass clean
8. Commit + push to main
9. Vercel auto-deploy
```

### Verification per commit

- **C1** (titles): re-run `npm run seo:check` — title violations drop to 0
- **C2** (descs): re-run — desc violations drop to 0
- **C3** (.gov links): manual grep `grep -r 'href="https://[^"]*\.gov' app/katie-beckett-waiver-georgia/page.tsx app/georgia-pediatric-program/page.tsx app/gapp-home-care/page.tsx` — at least 3 matches per file
- **C4** (footer): grep new hrefs in `app/layout.tsx` — 6 new entries present
- **C5** (internal): grep `/gapp-vs-ccsp` in `app/waivers/page.tsx` and `app/gapp-medicaid-requirements/page.tsx` — at least 1 match each
- **Final**: `npm run build` exits 0 with strict mode on

---

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Regex parse misses an odd `metadata` export style | Add a unit-style smoke test inside the script: parse all 47 pages, expect ≥40 successful extractions |
| Script blocks emergency deploys | `SKIP_SEO_CHECK=1` bypass + log warning |
| New SEO page added without allowlist update | Add a "page in sitemap with priority ≥0.8 but not in allowlist" warning (advisory only) |
| Guardrail thresholds get stale (Google changes truncation) | Constants at top of script — easy to adjust. Document in comment with year. |
| Strict mode flip catches a pre-existing edge case I missed | Phase A report-only run before flip surfaces this |

---

## Success criteria

After this work ships:
1. Every SEO content page has title ≤60 and desc ≤160
2. Three top pages each have ≥3 outbound .gov links
3. Footer has all high-priority resource pages
4. `/gapp-vs-ccsp` has ≥4 inbound links (was 2)
5. `npm run build` runs `seo-check.ts` and fails on any future violation
6. Pull a fresh GSC export 2–3 weeks post-deploy to measure CTR lift on the rewritten pages

## Out of scope (Track 2 + later)

- Katie Beckett body rewrite, expanded comparison table, images
- PageSpeed CWV diagnosis (manual user run)
- New content pages
- Mobile-specific optimizations
- Provider profile SEO
- Schema enhancements beyond FAQ + Breadcrumb
