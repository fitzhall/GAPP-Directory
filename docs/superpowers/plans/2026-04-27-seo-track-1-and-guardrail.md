# SEO Track 1 + Drift-Prevention Guardrail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix existing SEO drift (16 over-length titles, 12 over-length descs, missing outbound .gov links, footer + internal linking gaps) and install a build-time guardrail that prevents future drift.

**Architecture:** A single `scripts/seo-check.ts` Node script enforces an SEO contract (title ≤60, desc ≤160, canonical present, schemas present on allowlisted pages). Wired into `npm run build` via `package.json`. Lands in two phases: report-only first (so we can see violations drop while applying fixes), then strict mode after Track 1 closes the gap.

**Tech Stack:** Next.js 14.2.5 App Router, TypeScript, `tsx` (already devDep), no test framework — verification is by re-running the script and confirming violation counts.

**Spec:** `docs/superpowers/specs/2026-04-27-seo-track-1-and-guardrail-design.md`

---

## File Structure

**Create:**
- `scripts/seo-check.ts` — guardrail script

**Modify:**
- `package.json` — add `seo:check` and chain into `build`
- 16 page files for title rewrites (subset overlap with desc rewrites)
- 3 page files for outbound .gov link sections
- `app/layout.tsx` — footer additions
- 2 page files for `/gapp-vs-ccsp` internal linking

---

## Task 1: Build the guardrail script (report-only mode)

**Files:**
- Create: `scripts/seo-check.ts`
- Modify: `package.json` (scripts block)

- [ ] **Step 1: Create `scripts/seo-check.ts`**

```typescript
#!/usr/bin/env node
/**
 * SEO contract check. Walks app/**\/page.tsx, validates metadata against
 * an allowlist-aware contract. Phase A is report-only (exits 0). Flip
 * STRICT to true (or set SEO_CHECK_STRICT=1) to block builds.
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative, sep } from 'path'

const APP_DIR = join(process.cwd(), 'app')
const TITLE_MAX = 60
const DESC_MAX = 160
const STRICT_DEFAULT = false  // Phase A: report-only. Flipped to true in Task 7.
const STRICT =
  process.env.SEO_CHECK_STRICT === '1' ? true :
  process.env.SEO_CHECK_STRICT === '0' ? false :
  STRICT_DEFAULT

const EXCLUDED_DIRS = ['admin', 'dashboard', 'api', 'claim', 'availability']

// Pages required to have FAQPageSchema + BreadcrumbSchema + canonical.
// Mirrors high-priority entries in app/sitemap.ts (priority >= 0.7).
const SEO_CONTENT_PAGES = new Set([
  'app/georgia-pediatric-program/page.tsx',
  'app/gapp-providers-georgia/page.tsx',
  'app/gapp-home-care/page.tsx',
  'app/medically-fragile-children-care/page.tsx',
  'app/gapp-approval-guide/page.tsx',
  'app/gapp-approval-timeline/page.tsx',
  'app/gapp-medicaid-requirements/page.tsx',
  'app/why-gapp-applications-get-denied/page.tsx',
  'app/katie-beckett-waiver-georgia/page.tsx',
  'app/pediatric-home-nursing-georgia/page.tsx',
  'app/how-to-become-a-gapp-provider/page.tsx',
  'app/gapp-paid-caregiver/page.tsx',
  'app/gapp-vs-ccsp/page.tsx',
  'app/how-to-apply-for-gapp/page.tsx',
  'app/gapp-services-explained/page.tsx',
  'app/how-to-switch-gapp-providers/page.tsx',
  'app/gapp-respite-care/page.tsx',
  'app/long-term-care-children-georgia/page.tsx',
  'app/sick-child-care-georgia/page.tsx',
])

interface Violation {
  file: string
  rule: string
  message: string
}

function listPageFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const s = statSync(p)
    if (s.isDirectory()) {
      if (EXCLUDED_DIRS.includes(entry)) continue
      if (entry.startsWith('[')) continue  // dynamic routes
      out.push(...listPageFiles(p))
    } else if (entry === 'page.tsx') {
      out.push(p)
    }
  }
  return out
}

function extractMetadata(content: string): {
  title?: string
  description?: string
  canonical?: string
} {
  // Capture metadata export block. Non-greedy to first balanced-looking close.
  const blockMatch = content.match(/export\s+const\s+metadata[^=]*=\s*\{([\s\S]+?)\n\}\s*\n/)
  if (!blockMatch) return {}
  const block = blockMatch[1]

  const titleMatch = block.match(/^\s*title:\s*['"]([^'"]+)['"]/m)
  const descMatch = block.match(/^\s*description:\s*['"]([^'"]+)['"]/m)
  const canonicalMatch = block.match(/canonical:\s*['"]([^'"]+)['"]/)

  return {
    title: titleMatch?.[1],
    description: descMatch?.[1],
    canonical: canonicalMatch?.[1],
  }
}

function check(): Violation[] {
  const violations: Violation[] = []
  const pages = listPageFiles(APP_DIR)

  for (const file of pages) {
    const rel = relative(process.cwd(), file).split(sep).join('/')
    const content = readFileSync(file, 'utf-8')
    const meta = extractMetadata(content)

    if (meta.title !== undefined && meta.title.length > TITLE_MAX) {
      violations.push({
        file: rel,
        rule: 'title-length',
        message: `title is ${meta.title.length} chars (max ${TITLE_MAX}): "${meta.title.slice(0, 64)}${meta.title.length > 64 ? '…' : ''}"`,
      })
    }
    if (meta.description !== undefined && meta.description.length > DESC_MAX) {
      violations.push({
        file: rel,
        rule: 'desc-length',
        message: `description is ${meta.description.length} chars (max ${DESC_MAX})`,
      })
    }

    if (SEO_CONTENT_PAGES.has(rel)) {
      if (!meta.canonical) {
        violations.push({ file: rel, rule: 'canonical-missing', message: 'alternates.canonical not found' })
      }
      if (!content.includes('FAQPageSchema')) {
        violations.push({ file: rel, rule: 'faq-schema-missing', message: 'FAQPageSchema not used' })
      }
      if (!content.includes('BreadcrumbSchema')) {
        violations.push({ file: rel, rule: 'breadcrumb-schema-missing', message: 'BreadcrumbSchema not used' })
      }
    }
  }
  return violations
}

// ---- main ----
if (process.env.SKIP_SEO_CHECK === '1') {
  console.log('⚠ SEO check skipped (SKIP_SEO_CHECK=1)')
  process.exit(0)
}

const today = new Date().toISOString().split('T')[0]
console.log(`SEO Check — ${today}`)
console.log('='.repeat(40))

const violations = check()

if (violations.length === 0) {
  console.log('✓ All pages pass.')
  process.exit(0)
}

const byFile = new Map<string, Violation[]>()
for (const v of violations) {
  if (!byFile.has(v.file)) byFile.set(v.file, [])
  byFile.get(v.file)!.push(v)
}

for (const [file, vs] of byFile) {
  console.log(`\nERROR: ${file}`)
  for (const v of vs) console.log(`  → ${v.message}`)
}

console.log(`\n${byFile.size} pages with errors, ${violations.length} total violations`)

if (STRICT) {
  console.log('\nFAIL (strict mode)')
  process.exit(1)
} else {
  console.log('\n(report-only mode — set SEO_CHECK_STRICT=1 or flip STRICT_DEFAULT to block)')
  process.exit(0)
}
```

- [ ] **Step 2: Add npm scripts to `package.json`**

Modify the `"scripts"` block in `package.json`. The current block is:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

Replace with:

```json
"scripts": {
  "dev": "next dev",
  "build": "tsx scripts/seo-check.ts && next build",
  "start": "next start",
  "lint": "next lint",
  "seo:check": "tsx scripts/seo-check.ts"
}
```

- [ ] **Step 3: Run the script and confirm it reports the audit's known violations**

Run: `npm run seo:check`

Expected output: lists 16 pages with `title-length` errors and 12 pages with `desc-length` errors. Exit code 0 (report-only).

Specifically, it should flag (but is not limited to):
- `app/georgia-pediatric-program/page.tsx` — title-length (80) + desc-length (187)
- `app/katie-beckett-waiver-georgia/page.tsx` — title-length (78) + desc-length (187)
- `app/gapp-approval-guide/page.tsx` — title-length (83) + desc-length (172)

If the script reports 0 violations or fewer than 25 total, the regex extraction broke. Inspect the failing-to-match pages manually before proceeding.

- [ ] **Step 4: Run `npm run build` to confirm it doesn't break the build**

Run: `npm run build`

Expected: SEO check runs first, prints the violation report, exits 0 (report-only), then `next build` proceeds normally and succeeds. The build must succeed unmodified — we are not blocking yet.

- [ ] **Step 5: Commit**

```bash
git add scripts/seo-check.ts package.json
git commit -m "$(cat <<'EOF'
feat(seo): add scripts/seo-check.ts guardrail in report-only mode

Walks app/**/page.tsx, validates metadata against the SEO contract
(title <=60, desc <=160, canonical + schemas required on allowlisted
pages). Wired into npm run build but exits 0 in report-only mode so
existing violations are surfaced without blocking deploys. Strict mode
flips on after Track 1 closes the current 16+12 violation gap.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Title rewrites (16 pages)

**Files modified:** 16 page files, all using `Edit` tool with exact string replacement. Each replacement targets ONLY the title literal — the surrounding metadata block is preserved.

For each replacement: read the file first if not already read in this session, then apply the Edit.

- [ ] **Step 1: Rewrite all 16 titles (apply edits in this order)**

Edits to apply:

| File | Old title (length) | New title (length) |
|---|---|---|
| `app/georgia-pediatric-program/page.tsx` | `Georgia Pediatric Program (GAPP) – Home Nursing for Medically Fragile Children` (80) | `Georgia Pediatric Program (GAPP): Eligibility & Services` (56) |
| `app/gapp-providers-georgia/page.tsx` | `GAPP Providers in Georgia – Find Verified Home Care for Your Child` (68) | `GAPP Providers in Georgia: Find Verified Home Care` (50) |
| `app/gapp-home-care/page.tsx` | `GAPP Home Care in Georgia – In-Home Nursing for Medically Fragile Children` (76) | `GAPP Home Care in Georgia: In-Home Pediatric Nursing` (52) |
| `app/medically-fragile-children-care/page.tsx` | `Medically Fragile Children Care in Georgia – Home Care & Support Options` (74) | `Care for Medically Fragile Children in Georgia` (46) |
| `app/gapp-approval-guide/page.tsx` | `How to Get Approved for the Georgia Pediatric Program (GAPP) – Step-by-Step Guide` (83) | `How to Get Approved for GAPP in Georgia: Step-by-Step` (53) |
| `app/gapp-approval-timeline/page.tsx` | `GAPP approval timeline: how long does it take to get approved in Georgia?` (73) | `GAPP Approval Timeline: How Long Does It Take in Georgia?` (57) |
| `app/gapp-medicaid-requirements/page.tsx` | `GAPP Medicaid Requirements \| Georgia Pediatric Program Eligibility` (66) | `GAPP Medicaid Requirements: Georgia Eligibility Guide` (53) |
| `app/why-gapp-applications-get-denied/page.tsx` | `Why GAPP Applications Get Denied (And How to Avoid It) \| Georgia` (64) | `Why GAPP Applications Get Denied in Georgia` (44) |
| `app/katie-beckett-waiver-georgia/page.tsx` | `Katie Beckett waiver Georgia: eligibility, application & what it covers (2026)` (78) | `Katie Beckett Waiver Georgia: Eligibility & Application` (54) |
| `app/pediatric-home-nursing-georgia/page.tsx` | `Pediatric Home Nursing in Georgia: Find In-Home Nurses for Your Child (2025)` (76) | `Pediatric Home Nursing in Georgia: Find In-Home Nurses` (54) |
| `app/how-to-apply-for-gapp/page.tsx` | `How to Apply for GAPP in Georgia: Documents, Steps, and Timeline` (64) | `How to Apply for GAPP in Georgia: Steps & Documents` (52) |
| `app/waivers/page.tsx` | `Georgia Medicaid Waivers for Children \| Katie Beckett, TEFRA & GAPP` (67) | `Georgia Medicaid Waivers: Katie Beckett, TEFRA & GAPP` (53) |
| `app/gapp-services-explained/page.tsx` | `GAPP Services Explained: What RN, LPN, and PCS Actually Cover` (61) | `GAPP Services Explained: RN, LPN & PCS Care in Georgia` (54) |
| `app/gapp-respite-care/page.tsx` | `GAPP Respite Care in Georgia: How to Get Backup Nursing Hours` (61) | `GAPP Respite Care in Georgia: Backup Nursing Hours` (50) |
| `app/long-term-care-children-georgia/page.tsx` | `Long term care for children in Georgia: your options explained` (62) | `Long Term Care for Children in Georgia: Your Options` (52) |
| `app/how-it-works/page.tsx` | `How GAPP Works \| Georgia Pediatric Program Guide for Families` (61) | `How the Georgia Pediatric Program (GAPP) Works` (47) |

For each row, use the Edit tool:
- `old_string`: `title: '<OLD TITLE>'` (or `title: "<OLD TITLE>"` if double-quoted in file)
- `new_string`: `title: '<NEW TITLE>'` (preserve quote style of original)

If a file has the title appearing in `metadata.title` AND in `metadata.openGraph.title` AND in `metadata.twitter.title`, only modify `metadata.title`. The OG/Twitter copies are intentionally different and unaffected by SERP truncation.

- [ ] **Step 2: Run the SEO check to verify titles are clean**

Run: `npm run seo:check`

Expected: 0 `title-length` violations remaining. Description violations still present (~12).

If any title-length violations remain, the file's quote style probably didn't match — re-inspect the affected file.

- [ ] **Step 3: Commit**

```bash
git add app/
git commit -m "$(cat <<'EOF'
fix(seo): trim 16 page titles to <=60 chars for SERP visibility

All affected titles previously truncated mid-phrase in Google SERPs,
killing CTR. Drops trailing brand stamp (layout.tsx adds the | suffix
template). Preserves primary keyword from GSC top-position queries.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Description rewrites (12 pages)

**Files modified:** 12 page files (subset of Task 2's pages plus a couple borderline ones).

- [ ] **Step 1: Rewrite all 12 descriptions**

Edits to apply:

| File | Old desc length | New description (length) |
|---|---|---|
| `app/georgia-pediatric-program/page.tsx` | 187 | `The Georgia Pediatric Program (GAPP) provides in-home nursing for medically fragile children. Eligibility, covered services, and how to find providers.` (151) |
| `app/gapp-providers-georgia/page.tsx` | 173 | `Search GAPP providers in Georgia. Verified home health agencies offering RN, LPN, and personal care for medically fragile children. Updated weekly.` (148) |
| `app/gapp-home-care/page.tsx` | 177 | `GAPP home care in Georgia: in-home skilled nursing, LPN, and personal care for medically fragile children. 100% Medicaid covered. Find providers.` (146) |
| `app/medically-fragile-children-care/page.tsx` | 168 | `Care options for medically fragile children in Georgia: GAPP home nursing, Medicaid coverage, and how to find skilled nursing providers.` (135) |
| `app/gapp-approval-guide/page.tsx` | 172 | `Get approved for GAPP in Georgia, step-by-step. The exact approval process, common delays to avoid, and providers accepting new patients.` (138) |
| `app/gapp-approval-timeline/page.tsx` | 171 | `How long does GAPP approval take in Georgia? Medicaid takes 30-45 days. GAPP prior authorization adds 2-6 weeks. Full timeline here.` (132) |
| `app/gapp-medicaid-requirements/page.tsx` | 181 | `Medicaid requirements for GAPP in Georgia. What "active Medicaid" means, how to check your status, and Katie Beckett for higher incomes.` (137) |
| `app/why-gapp-applications-get-denied/page.tsx` | 162 | `Common reasons GAPP applications get denied in Georgia, and how to avoid them. Documentation, Medicaid issues, and how to appeal a denial.` (138) |
| `app/katie-beckett-waiver-georgia/page.tsx` | 187 | `Complete guide to the Katie Beckett waiver in Georgia. Eligibility, what it covers, how to apply, and how it connects to GAPP nursing.` (133) |
| `app/pediatric-home-nursing-georgia/page.tsx` | 172 | `Pediatric home nursing in Georgia: GAPP-funded RN and LPN care for medically fragile children. Search verified nursing agencies by county.` (140) |
| `app/waivers/page.tsx` | 173 | `Compare Georgia Medicaid waivers for children with special needs: Katie Beckett (TEFRA), GAPP, and CCSP. Find which waiver fits your child.` (140) |
| `app/long-term-care-children-georgia/page.tsx` | 166 | `Long term care for children in Georgia: GAPP home nursing, Katie Beckett Medicaid, therapy services, and medical equipment. How each works.` (140) |

For each row, use the Edit tool:
- `old_string`: `description: '<OLD DESC>'` (preserve quote style)
- `new_string`: `description: '<NEW DESC>'`

The new desc for `gapp-medicaid-requirements` contains `"active Medicaid"` (literal double quotes). If the file uses single-quoted strings, escape with backslash: `description: 'Medicaid requirements for GAPP in Georgia. What \"active Medicaid\" means, ...'`. If double-quoted, escape with backslash inside double quotes (`\"`). Match the existing escape style of the file.

Only modify `metadata.description`. Leave `metadata.openGraph.description` and `metadata.twitter.description` untouched — they're allowed longer copy and aren't affected by SERP truncation.

- [ ] **Step 2: Run the SEO check to verify descriptions are clean**

Run: `npm run seo:check`

Expected: 0 `desc-length` violations remaining. 0 `title-length` violations from prior task. Total violations: 0 from these two rules. Any remaining violations should only be canonical/schema-related (none expected — schemas were verified clean in audit).

- [ ] **Step 3: Commit**

```bash
git add app/
git commit -m "$(cat <<'EOF'
fix(seo): trim 12 meta descriptions to <=160 chars for SERP visibility

Descriptions were 162-187 chars and getting truncated mid-clause in
Google SERPs. Trimmed to 132-151 char range with primary keyword in
first phrase. OG/Twitter descriptions left intact (no truncation issue).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Outbound .gov links (3 pages)

Adds an "Official resources" subsection to each of the three highest-impression content pages. The audit found these have 0 outbound authoritative links — Google treats them as un-cited.

**Files modified:**
- `app/katie-beckett-waiver-georgia/page.tsx`
- `app/georgia-pediatric-program/page.tsx`
- `app/gapp-home-care/page.tsx`

- [ ] **Step 1: Read each target page and find a placement point**

For each of the 3 files, read it first if not already read. Locate the "Related" or "What's next" section near the bottom of the page (the existing internal-link grid). The new "Official resources" block goes IMMEDIATELY ABOVE that grid.

If no such anchor exists, place the block immediately before the closing `</div>` of the main content section (after the FAQ section).

- [ ] **Step 2: Add the resources block to `app/katie-beckett-waiver-georgia/page.tsx`**

Insert this JSX block above the related-pages grid (look for `<Link href="/medically-fragile-children-care"` — the resources block goes above the wrapping section that contains it):

```tsx
{/* Official resources — outbound .gov links for authority signal */}
<section className="bg-blue-50 border border-blue-100 rounded-lg p-6 my-8">
  <h2 className="text-xl font-bold text-navy mb-3">Official Katie Beckett resources</h2>
  <p className="text-gray-700 mb-4">
    For the most current eligibility rules and application forms, go directly to the state and federal sources:
  </p>
  <ul className="space-y-2 text-gray-700">
    <li>
      <a href="https://medicaid.georgia.gov/programs/all-programs/katie-beckett-deeming-waiver" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Georgia Medicaid: Katie Beckett Deeming Waiver →
      </a>
      <span className="text-gray-600 text-sm block">Official program page from Georgia DCH</span>
    </li>
    <li>
      <a href="https://dch.georgia.gov/divisions-offices/medical-assistance-plans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Georgia Department of Community Health →
      </a>
      <span className="text-gray-600 text-sm block">State agency that runs Georgia Medicaid</span>
    </li>
    <li>
      <a href="https://www.medicaid.gov/medicaid/eligibility/medicaid-children/index.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Medicaid.gov: Eligibility for Children →
      </a>
      <span className="text-gray-600 text-sm block">Federal Medicaid policy reference</span>
    </li>
    <li>
      <a href="https://www.cms.gov/medicare-medicaid-coordination/medicare-and-medicaid-coordination/medicare-medicaid-coordination-office" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        CMS: Medicare-Medicaid Coordination →
      </a>
      <span className="text-gray-600 text-sm block">Centers for Medicare &amp; Medicaid Services</span>
    </li>
  </ul>
  <p className="text-sm text-gray-600 mt-4">
    To start an application, call the Georgia Centralized Katie Beckett Medicaid Team at{' '}
    <a href="tel:6782487449" className="text-primary hover:underline font-semibold">678-248-7449</a>.
  </p>
</section>
```

- [ ] **Step 3: Add the resources block to `app/georgia-pediatric-program/page.tsx`**

Insert above the related-pages grid (look for the section containing `<Link href="/gapp-vs-ccsp"` or similar related-content grid). Use this block:

```tsx
{/* Official resources — outbound .gov links for authority signal */}
<section className="bg-blue-50 border border-blue-100 rounded-lg p-6 my-8">
  <h2 className="text-xl font-bold text-navy mb-3">Official GAPP resources</h2>
  <p className="text-gray-700 mb-4">
    Verify program rules and forms directly with the state and federal Medicaid agencies:
  </p>
  <ul className="space-y-2 text-gray-700">
    <li>
      <a href="https://medicaid.georgia.gov/programs/all-programs/georgia-pediatric-program-gapp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Georgia Medicaid: Georgia Pediatric Program (GAPP) →
      </a>
      <span className="text-gray-600 text-sm block">Official GAPP program page</span>
    </li>
    <li>
      <a href="https://dch.georgia.gov/divisions-offices/medical-assistance-plans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Georgia Department of Community Health →
      </a>
      <span className="text-gray-600 text-sm block">State agency that runs Georgia Medicaid</span>
    </li>
    <li>
      <a href="https://www.medicaid.gov/medicaid/home-community-based-services/index.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Medicaid.gov: Home &amp; Community-Based Services →
      </a>
      <span className="text-gray-600 text-sm block">Federal HCBS policy reference</span>
    </li>
  </ul>
</section>
```

- [ ] **Step 4: Add the resources block to `app/gapp-home-care/page.tsx`**

Insert above the related-pages grid. Use this block:

```tsx
{/* Official resources — outbound .gov links for authority signal */}
<section className="bg-blue-50 border border-blue-100 rounded-lg p-6 my-8">
  <h2 className="text-xl font-bold text-navy mb-3">Official home care resources</h2>
  <p className="text-gray-700 mb-4">
    State and federal references for GAPP home care benefits and Medicaid home health services:
  </p>
  <ul className="space-y-2 text-gray-700">
    <li>
      <a href="https://medicaid.georgia.gov/programs/all-programs/georgia-pediatric-program-gapp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Georgia Medicaid: GAPP Program Page →
      </a>
      <span className="text-gray-600 text-sm block">Official GAPP eligibility and services</span>
    </li>
    <li>
      <a href="https://dch.georgia.gov/divisions-offices/medical-assistance-plans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Georgia Department of Community Health →
      </a>
      <span className="text-gray-600 text-sm block">State agency overseeing Georgia Medicaid</span>
    </li>
    <li>
      <a href="https://www.medicaid.gov/medicaid/benefits/home-health-services/index.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
        Medicaid.gov: Home Health Services →
      </a>
      <span className="text-gray-600 text-sm block">Federal home health benefit overview</span>
    </li>
  </ul>
</section>
```

- [ ] **Step 5: Verify outbound links are present**

Run:

```bash
grep -c 'href="https://[^"]*\.gov' app/katie-beckett-waiver-georgia/page.tsx app/georgia-pediatric-program/page.tsx app/gapp-home-care/page.tsx
```

Expected output:
```
app/katie-beckett-waiver-georgia/page.tsx:4
app/georgia-pediatric-program/page.tsx:3
app/gapp-home-care/page.tsx:3
```

(The Katie Beckett page may show 4 if the existing intake-link to gateway.ga.gov is in another file — but the new block alone contributes 4. Counts of 3+ are pass.)

- [ ] **Step 6: Run the build to verify nothing broke**

Run: `npm run build`

Expected: SEO check passes (or only flags pre-existing unrelated issues), Next compiles successfully.

- [ ] **Step 7: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx app/georgia-pediatric-program/page.tsx app/gapp-home-care/page.tsx
git commit -m "$(cat <<'EOF'
feat(seo): add outbound .gov authority links to top 3 SEO pages

Katie Beckett, Georgia Pediatric Program, and GAPP Home Care had zero
outbound authoritative links despite being the highest-impression
content pages on the site. Added "Official resources" sections linking
to medicaid.georgia.gov, dch.georgia.gov, medicaid.gov, and cms.gov.
Authority signal Google uses to rank source-citing pages above
source-claiming pages.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Footer additions

Adds 6 missing high-priority pages to the footer Resources column.

**Files modified:** `app/layout.tsx`

- [ ] **Step 1: Modify the Resources column in `app/layout.tsx`**

Read `app/layout.tsx` if not already read this session. Find the Resources column (currently 15 entries from `/blog` to `/waivers`). Use Edit to add 6 entries — insert them in logical order: timeline near the approval guide, applications near it, etc.

The current Resources column (lines 175–192) is:

```tsx
<h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
<ul className="space-y-2 text-sm">
  <li><Link href="/blog" className="hover:text-warm transition-colors">Blog</Link></li>
  <li><Link href="/georgia-pediatric-program" className="hover:text-warm transition-colors">What is GAPP?</Link></li>
  <li><Link href="/gapp-providers-georgia" className="hover:text-warm transition-colors">GAPP Providers Georgia</Link></li>
  <li><Link href="/pediatric-home-nursing-georgia" className="hover:text-warm transition-colors">Pediatric Home Nursing</Link></li>
  <li><Link href="/katie-beckett-waiver-georgia" className="hover:text-warm transition-colors">Katie Beckett Waiver</Link></li>
  <li><Link href="/gapp-home-care" className="hover:text-warm transition-colors">GAPP Home Care</Link></li>
  <li><Link href="/medically-fragile-children-care" className="hover:text-warm transition-colors">Medically Fragile Care</Link></li>
  <li><Link href="/gapp-approval-guide" className="hover:text-warm transition-colors">GAPP Approval Guide</Link></li>
  <li><Link href="/how-to-apply-for-gapp" className="hover:text-warm transition-colors">How to Apply</Link></li>
  <li><Link href="/gapp-services-explained" className="hover:text-warm transition-colors">Services Explained</Link></li>
  <li><Link href="/gapp-vs-ccsp" className="hover:text-warm transition-colors">GAPP vs CCSP</Link></li>
  <li><Link href="/gapp-respite-care" className="hover:text-warm transition-colors">Respite Care</Link></li>
  <li><Link href="/sick-child-care-georgia" className="hover:text-warm transition-colors">Sick Child Care</Link></li>
  <li><Link href="/long-term-care-children-georgia" className="hover:text-warm transition-colors">Long-Term Care for Children</Link></li>
  <li><Link href="/waivers" className="hover:text-warm transition-colors">Medicaid Waivers</Link></li>
</ul>
```

Use Edit with `old_string` and `new_string`. Replace the `<li>` for `/gapp-approval-guide` (it appears once and is unique) PLUS the surrounding context to anchor:

`old_string`:

```
  <li><Link href="/gapp-approval-guide" className="hover:text-warm transition-colors">GAPP Approval Guide</Link></li>
                  <li><Link href="/how-to-apply-for-gapp" className="hover:text-warm transition-colors">How to Apply</Link></li>
```

(Note: leading whitespace must match the file exactly. If the Edit fails due to whitespace mismatch, use `Read` first and copy the indentation precisely.)

`new_string`:

```
  <li><Link href="/gapp-approval-guide" className="hover:text-warm transition-colors">GAPP Approval Guide</Link></li>
                  <li><Link href="/gapp-approval-timeline" className="hover:text-warm transition-colors">GAPP Approval Timeline</Link></li>
                  <li><Link href="/why-gapp-applications-get-denied" className="hover:text-warm transition-colors">Why Applications Get Denied</Link></li>
                  <li><Link href="/gapp-medicaid-requirements" className="hover:text-warm transition-colors">Medicaid Requirements</Link></li>
                  <li><Link href="/how-to-apply-for-gapp" className="hover:text-warm transition-colors">How to Apply</Link></li>
                  <li><Link href="/how-to-switch-gapp-providers" className="hover:text-warm transition-colors">How to Switch Providers</Link></li>
                  <li><Link href="/gapp-paid-caregiver" className="hover:text-warm transition-colors">Paid Family Caregiver</Link></li>
```

This inserts 5 new entries between "GAPP Approval Guide" and "How to Apply". The 6th new entry (`gapp-paid-caregiver`) sits right before How to Apply. That preserves the natural reading flow: approval → timeline → denial reasons → requirements → apply → switch → paid caregiver.

- [ ] **Step 2: Verify the new footer links exist**

Run:

```bash
grep -c 'href="/\(gapp-approval-timeline\|why-gapp-applications-get-denied\|gapp-medicaid-requirements\|how-to-switch-gapp-providers\|gapp-paid-caregiver\)"' app/layout.tsx
```

Expected output: `5` (one match per new path; `how-to-apply-for-gapp` was already present so it's not in this count).

If the count is less than 5, the Edit didn't apply cleanly — re-read `app/layout.tsx` and inspect.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(seo): add 6 high-priority pages to footer Resources column

GSC data showed approval-timeline (954 imp, pos 6.08), why-applications-
get-denied (155 imp, 4.52% CTR), and 4 other priority pages were missing
from the footer despite ranking. Footer is the cheapest sitewide
internal-link surface; surfacing these pages distributes link equity
to the rest of the site.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Internal links to `/gapp-vs-ccsp`

`/gapp-vs-ccsp` has only 2 inbound links (footer + 1 page) despite being a useful comparison page. Add contextual links from `/waivers` and `/gapp-medicaid-requirements`.

**Files modified:**
- `app/waivers/page.tsx`
- `app/gapp-medicaid-requirements/page.tsx`

- [ ] **Step 1: Read both files and find natural placement points**

Read each file. Look for an existing reference to "CCSP" or "comparison" in the body content. If one exists, wrap it in a `<Link>`. If none exists, add a contextual sentence near the bottom of the main content.

- [ ] **Step 2: Add link in `app/waivers/page.tsx`**

Search for existing references to CCSP or "comparison" in the file. If found, wrap with a Link. If not, add a "Related" callout near the page bottom (above the existing related-pages grid):

```tsx
<p className="text-gray-700 mb-4">
  Trying to choose between GAPP and CCSP for your child? See our{' '}
  <Link href="/gapp-vs-ccsp" className="text-primary hover:underline font-semibold">
    GAPP vs CCSP comparison
  </Link>{' '}
  for a side-by-side breakdown of eligibility, services, and wait times.
</p>
```

If `Link` is not already imported in this file, add `import Link from 'next/link'` to the top of the file alongside other imports.

- [ ] **Step 3: Add link in `app/gapp-medicaid-requirements/page.tsx`**

The Katie Beckett FAQ already references CCSP-adjacent topics. Find a section discussing waiver eligibility differences and add a contextual link:

```tsx
<p className="text-gray-700 mb-4">
  Wondering whether GAPP or CCSP fits your child better?{' '}
  <Link href="/gapp-vs-ccsp" className="text-primary hover:underline font-semibold">
    Compare GAPP vs CCSP
  </Link>{' '}
  side-by-side — eligibility, services, and how each waiver works.
</p>
```

Place this before the page's closing `</div>` of the main content section (after the FAQ section, before any related-pages grid). If `Link` is not imported, add the import.

- [ ] **Step 4: Verify links exist**

Run:

```bash
grep -c 'href="/gapp-vs-ccsp"' app/waivers/page.tsx app/gapp-medicaid-requirements/page.tsx
```

Expected output:
```
app/waivers/page.tsx:1
app/gapp-medicaid-requirements/page.tsx:1
```

- [ ] **Step 5: Commit**

```bash
git add app/waivers/page.tsx app/gapp-medicaid-requirements/page.tsx
git commit -m "$(cat <<'EOF'
feat(seo): internal-link /gapp-vs-ccsp from waivers and medicaid-requirements

/gapp-vs-ccsp had only 2 inbound links (footer + 1) despite being a
direct query-match for "GAPP vs CCSP" search intent. Added contextual
links from /waivers and /gapp-medicaid-requirements where the
comparison naturally fits.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Flip guardrail to strict mode

After Tasks 2–6 close the violation gap to zero, flip `STRICT_DEFAULT` from `false` to `true` so future drift fails the build.

**Files modified:** `scripts/seo-check.ts`, `package.json` (no change but verified)

- [ ] **Step 1: Confirm the seo-check is currently clean**

Run: `npm run seo:check`

Expected: `✓ All pages pass.` (exit 0). If any violations remain, return to Tasks 2–6 to close them BEFORE flipping strict mode. The whole point of report-only is to land at zero before flipping.

- [ ] **Step 2: Flip the strict default**

Use Edit on `scripts/seo-check.ts`:

`old_string`:
```typescript
const STRICT_DEFAULT = false  // Phase A: report-only. Flipped to true in Task 7.
```

`new_string`:
```typescript
const STRICT_DEFAULT = true  // Phase B: strict — violations block builds. SKIP_SEO_CHECK=1 to bypass.
```

- [ ] **Step 3: Run `npm run build` to confirm strict mode passes**

Run: `npm run build`

Expected: SEO check prints `✓ All pages pass.`, then `next build` completes successfully. Total output ends with no error exit.

If the build fails at the SEO check step, there is a violation we missed. Fix it (do not bypass with SKIP_SEO_CHECK).

- [ ] **Step 4: Commit**

```bash
git add scripts/seo-check.ts
git commit -m "$(cat <<'EOF'
feat(seo): flip seo-check.ts to strict mode (block builds on violations)

Track 1 closed the existing 28-violation gap (16 titles + 12 descs).
Strict mode now active: any future page metadata that exceeds title <=60
or desc <=160 chars, or omits canonical/schema on allowlisted SEO pages,
fails npm run build and therefore the Vercel deploy.

Bypass: SKIP_SEO_CHECK=1 npm run build (logs a visible warning).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Push to main

- [ ] **Step 1: Verify commits**

Run: `git log --oneline -10`

Expected: 7 new commits in this order (most recent first):
1. `feat(seo): flip seo-check.ts to strict mode...`
2. `feat(seo): internal-link /gapp-vs-ccsp...`
3. `feat(seo): add 6 high-priority pages to footer...`
4. `feat(seo): add outbound .gov authority links...`
5. `fix(seo): trim 12 meta descriptions...`
6. `fix(seo): trim 16 page titles...`
7. `feat(seo): add scripts/seo-check.ts guardrail...`

Plus the earlier `docs: add SEO Track 1 + guardrail design spec` commit.

- [ ] **Step 2: Push to main**

Run: `git push origin main`

Vercel will auto-deploy. Watch the deploy logs — the SEO check runs on Vercel as part of the build. If the deploy fails at the SEO check step, something drifted between local and remote (unlikely but check the build log).

- [ ] **Step 3: Smoke check the live site**

Once Vercel reports a successful deploy:
- Open https://www.georgiagapp.com/katie-beckett-waiver-georgia
- View page source (Cmd+U)
- Confirm `<title>` is the new shortened version
- Confirm `<meta name="description">` is the new shortened version
- Scroll the page and confirm the "Official Katie Beckett resources" section renders with 4 .gov links
- Repeat for `/georgia-pediatric-program` and `/gapp-home-care`

If any of those fail, the build deployed an old cached version — wait 60 seconds for Vercel CDN purge and retry.

- [ ] **Step 4: Update the project memory note**

Append to `/Users/fitzhall/.claude/projects/-Users-fitzhall-projects-Directory-Frameworks-directory-starter-template/memory/MEMORY.md` index — add a pointer to a new memory file capturing what was done. (Optional but recommended for future sessions to know that drift-prevention is now active.)

---

## Done state

After Task 8:
- Every SEO content page has title ≤60 chars and desc ≤160 chars
- `katie-beckett-waiver-georgia`, `georgia-pediatric-program`, `gapp-home-care` each have 3+ outbound .gov links
- Footer has 6 new entries
- `/gapp-vs-ccsp` has 4 inbound links (was 2)
- `npm run build` runs `seo-check.ts` in strict mode; future drift fails the build
- Vercel auto-blocks deploys that violate the SEO contract

Pull a fresh GSC export 2–3 weeks post-deploy to measure CTR lift on the rewritten pages — especially `katie-beckett-waiver-georgia` (the 1,691-impression page that was at pos 31).
