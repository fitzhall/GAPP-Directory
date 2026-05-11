# Katie Beckett Page Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `app/katie-beckett-waiver-georgia/page.tsx` from a pos-32 / 9-click-per-90-days page into the most comprehensive parent-facing Katie Beckett guide in the Georgia SERP, targeting pos 4–7 and ~50–80 clicks/month.

**Architecture:** Single-page rewrite. Content + metadata + one new schema component (`ArticleSchema` in `components/JsonLd.tsx`). No new routes, no DB changes, no shared component churn. Nine atomic commits in one PR. Hard 5th-grade-level voice constraint enforced via banned-word grep and Hemingway check.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind, existing FAQPageSchema/BreadcrumbSchema components.

**Source spec:** `docs/superpowers/specs/2026-05-11-katie-beckett-rewrite-design.md`
**Source research:** `docs/seo-research/katie-beckett/findings.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/katie-beckett-waiver-georgia/page.tsx` | Modify | All visible content, FAQ array, metadata, schema invocations |
| `components/JsonLd.tsx` | Modify | Add `ArticleSchema` export (one new component, mirrors existing `OrganizationSchema` pattern) |

No other files changed.

---

## Task 1: Scaffold new section shells

Adds empty `<section>` blocks at the correct positions in `page.tsx`, plus 5 new jump-link anchors in the hero. This is structural-only; no prose yet. Ships green so subsequent commits add content into known anchors.

**Files:**
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Read the current jump-link block in the hero**

Open `app/katie-beckett-waiver-georgia/page.tsx` and locate lines 125–141. The current jump-link block has 5 links: eligibility, how-to-apply, what-it-covers, vs-gapp, faqs.

- [ ] **Step 2: Replace the jump-link block with the expanded version**

Use Edit on the hero jump-link block. Replace the 5-link `<div className="flex flex-wrap gap-3">` with this 9-link version:

```tsx
          {/* Quick links */}
          <div className="flex flex-wrap gap-2">
            <a href="#online-portal" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              The new online portal
            </a>
            <a href="#eligibility" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Who qualifies
            </a>
            <a href="#income-rules" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How income works
            </a>
            <a href="#how-to-apply" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How to apply
            </a>
            <a href="#timeline" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              How long it takes
            </a>
            <a href="#appeals" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              If you are denied
            </a>
            <a href="#renewal" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Renewal
            </a>
            <a href="#what-it-covers" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              What it covers
            </a>
            <a href="#vs-other-programs" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              Compared to other programs
            </a>
            <a href="#faqs" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors">
              FAQs
            </a>
          </div>
```

- [ ] **Step 3: Insert empty Block 3 shell (Online Portal) after "What is Katie Beckett"**

Locate the end of the "What is Katie Beckett" section (currently ends with `</section>` around line 170, just before `{/* Eligibility Requirements */}`). Insert this empty shell:

```tsx
      {/* The new Online Portal (April 15, 2026) */}
      <section id="online-portal" className="py-12 sm:py-16 px-4 scroll-mt-24 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            The new Katie Beckett online portal
          </h2>
          {/* Content added in Task 2 */}
        </div>
      </section>
```

- [ ] **Step 4: Insert empty Block 5 shell (Income/Deeming) after Eligibility**

Locate the end of the existing Eligibility section (around line 216, just before `{/* Qualifying Conditions */}`). Insert:

```tsx
      {/* How "no income limit" actually works */}
      <section id="income-rules" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Why your family income does not count
          </h2>
          {/* Content added in Task 3 */}
        </div>
      </section>
```

- [ ] **Step 5: Insert empty Block 8 shell (Timeline) after How to Apply**

Locate the end of the "How to Apply" section (around line 360, just before `{/* What Katie Beckett Covers */}`). Insert:

```tsx
      {/* Timeline and medical evaluation */}
      <section id="timeline" className="py-12 sm:py-16 px-4 scroll-mt-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            How long Katie Beckett takes
          </h2>
          {/* Content added in Task 4 */}
        </div>
      </section>
```

- [ ] **Step 6: Insert empty Block 9 shell (Appeals) immediately after Block 8**

After the closing `</section>` of the Timeline block from Step 5:

```tsx
      {/* If you are denied */}
      <section id="appeals" className="py-12 sm:py-16 px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            If you are denied
          </h2>
          {/* Content added in Task 5 */}
        </div>
      </section>
```

- [ ] **Step 7: Insert empty Block 10 shell (Renewal) immediately after Block 9**

After the closing `</section>` of the Appeals block:

```tsx
      {/* Renewal and recertification */}
      <section id="renewal" className="py-12 sm:py-16 px-4 scroll-mt-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Renewing your child&apos;s Katie Beckett
          </h2>
          {/* Content added in Task 6 */}
        </div>
      </section>
```

- [ ] **Step 8: Update the existing "Katie Beckett vs GAPP" anchor**

In the existing section header for the comparison (currently `id="vs-gapp"`, around line 411), change the ID to `vs-other-programs` so the jump-link in the new hero block matches.

Change: `<section id="vs-gapp"` → `<section id="vs-other-programs"`

- [ ] **Step 9: Run build to verify the page still compiles**

Run: `npm run build`
Expected: Build succeeds, seo-check.ts passes (no metadata changes yet).

If build fails: fix the JSX issue before continuing. Empty `<section>` shells with comments should compile cleanly.

- [ ] **Step 10: Run dev server, manually click each new jump-link**

Run: `npm run dev`
Open `http://localhost:3000/katie-beckett-waiver-georgia`. Click each of the 10 jump-links in the hero. All 10 should scroll to an anchor on the page (empty sections are OK — content arrives in later tasks).

- [ ] **Step 11: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): scaffold new section shells + expanded jump links

Adds 5 empty section shells with anchors at the positions content will land:
- #online-portal (Block 3)
- #income-rules (Block 5)
- #timeline (Block 8)
- #appeals (Block 9)
- #renewal (Block 10)

Renames #vs-gapp -> #vs-other-programs to match 4-way comparison.

Per spec: docs/superpowers/specs/2026-05-11-katie-beckett-rewrite-design.md"
```

---

## Task 2: Add Online Portal section (Block 3) + hero freshness badge

Adds the highest-impact freshness signal on the page — the April 15, 2026 portal launch — plus a visible "updated for the portal" indicator in the hero.

**Files:**
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Add a freshness badge under the hero h1**

In the hero, immediately after the `<p className="text-xl text-gray-600 mb-6">` paragraph (around line 109), and BEFORE the existing `<div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">` callout, insert:

```tsx
          <div className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated May 2026 — includes the new online portal that launched April 15, 2026</span>
          </div>
```

- [ ] **Step 2: Fill the empty Online Portal section shell with content**

Locate the empty `<section id="online-portal">` shell from Task 1. Replace the `{/* Content added in Task 2 */}` placeholder with this complete content block:

```tsx
          <p className="text-gray-700 mb-4">
            On April 15, 2026, Georgia launched a new online portal for Katie Beckett. You can use it to apply, send your child&apos;s medical records, and check your status. You can also message the case worker who handles your file.
          </p>
          <p className="text-gray-700 mb-6">
            The portal lives on the state Medicaid website. If you do not have a computer, you can still apply by phone or at your local DFCS office. Both work the same way as before.
          </p>

          <div className="bg-white border border-blue-100 rounded-xl p-5 mb-6">
            <p className="font-semibold text-gray-900 mb-3">What you can do in the portal</p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Start and submit your Katie Beckett application</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Upload your child&apos;s medical records</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Check your case status without calling</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Send a message to your case worker</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>See and download your approval letter when it arrives</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-700">
            The portal is at{' '}
            <a href="https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">medicaid.georgia.gov</a>.
            You can also call the Katie Beckett team at{' '}
            <a href="tel:6782487449" className="text-primary hover:underline font-semibold">678-248-7449</a> if you need help getting started.
          </p>
```

- [ ] **Step 3: Run reading-level check on the new Online Portal prose**

Manually paste the new prose body (the two `<p>` paragraphs and the bullet list) into Hemingway Editor (https://hemingwayapp.com/). Confirm:
- Grade level shown is ≤ 5
- No "hard to read" sentences flagged (yellow/red highlights)

If grade level > 5: rewrite the offending sentences using shorter words and shorter sentences. Common fixes: split compound sentences with "and"/"but" into two sentences.

- [ ] **Step 4: Grep the new section for banned AI tells**

Run from the project root:

```bash
grep -nE "comprehensive|robust|leverage|utilize|delve|nuanced|holistic|multifaceted|seamless|vibrant|pivotal|crucial|underscore|foster|bolster|tapestry|landscape|nestled|intricate|myriad|moreover|furthermore|in essence|ultimately|notably,|indeed,|importantly,|crucially,|It's worth noting|It is worth noting|It's important to note" app/katie-beckett-waiver-georgia/page.tsx
```

Expected: zero matches in the new content. If any match: rewrite.

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: Build succeeds. seo-check.ts passes.

- [ ] **Step 6: Visual check on dev server**

```bash
npm run dev
```

Open `http://localhost:3000/katie-beckett-waiver-georgia`. Confirm:
- Hero freshness badge appears under the hero paragraph
- Online portal section renders with title, two paragraphs, 5-item bullet card, and bottom CTA
- The `medicaid.georgia.gov` link opens in a new tab and resolves to the state page

- [ ] **Step 7: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): add online portal section + hero freshness badge

Adds the April 15, 2026 portal launch as the highest-impact freshness
signal on the page. Hero now carries a visible 'Updated May 2026'
indicator and the new #online-portal section documents what families
can do in the portal."
```

---

## Task 3: Add Income/Deeming section (Block 5)

The single highest-leverage content addition. The deeming mechanic is the most-misunderstood part of the program and has direct keyword coverage at "katie beckett income limits" (30/mo Atlanta DMA).

**Files:**
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Fill the empty Income section shell with content**

Locate the empty `<section id="income-rules">` shell from Task 1. Replace the `{/* Content added in Task 3 */}` placeholder with:

```tsx
          <p className="text-gray-700 mb-4">
            Most Medicaid programs look at how much your family earns. Katie Beckett does not. It only looks at your child&apos;s own money. For most kids, that amount is zero.
          </p>
          <p className="text-gray-700 mb-6">
            This rule is called <strong>deeming</strong>. The state deems that only your child&apos;s money counts toward the income test, not yours.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
            <p className="font-semibold text-green-900 mb-2">A real-world example</p>
            <p className="text-green-900 mb-3">
              Say your family earns $200,000 a year. Your child has no money of their own. Under Katie Beckett, your child passes the income test. The only test left is the medical one.
            </p>
            <p className="text-green-900 text-sm">
              The same is true at $300,000 or $500,000. Family income does not block Katie Beckett.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            <strong>What does count as your child&apos;s money?</strong>
          </p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>Child support paid directly to your child</li>
            <li>SSI checks your child receives</li>
            <li>Money in a bank account in your child&apos;s name</li>
            <li>Assets your child inherited from a relative</li>
          </ul>
          <p className="text-gray-700 mb-6">
            For most children, none of these apply. So the income limit on Katie Beckett is not the problem most families think it is.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-900 text-sm">
              <strong>If you were told &quot;you make too much for Medicaid,&quot;</strong> you were told about regular Medicaid. Katie Beckett is the way around that rule for kids with serious medical needs.
            </p>
          </div>
```

- [ ] **Step 2: Run reading-level check on the new prose**

Paste the new section's body prose into Hemingway. Confirm grade ≤ 5. Most likely culprit: the "regular Medicaid" sentence may flag — keep it short by splitting if needed.

- [ ] **Step 3: Run the banned-AI-tells grep from Task 2 Step 4**

Expected: zero matches in the new section.

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 5: Visual check on dev server**

Confirm the section renders with the title, three paragraphs, green example callout with $200k dollar amount visible, the bulleted list of what counts as the child's money, and the amber callout at the bottom.

- [ ] **Step 6: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): add income/deeming section with worked example

Targets 'katie beckett income limits' (30/mo Atlanta DMA) and the most
misunderstood part of the program. Worked example with concrete dollar
amounts (\$200k family, child qualifies) is the kind of content the
medicaid.georgia.gov page won't write."
```

---

## Task 4: Add Timeline/Appeals/Renewal sections (Blocks 8, 9, 10)

Three new sections in one commit per the spec's commit plan.

**Files:**
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Fill the Timeline section shell (Block 8)**

Locate the empty `<section id="timeline">` shell. Replace the placeholder comment with:

```tsx
          <p className="text-gray-700 mb-6">
            Most families wait 45 to 90 days from start to finish. Here is how that time breaks down.
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">Week 1 to 2 — Application review</p>
              <p className="text-gray-700 text-sm">The state checks if your application is complete. If something is missing, they will ask for it. Missing forms add weeks to your wait.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">Week 3 to 8 — Medical evaluation</p>
              <p className="text-gray-700 text-sm">A nurse or doctor reviews your child&apos;s medical records. They want to see if your child needs the kind of care a hospital or nursing home would give.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-1">Week 9 to 10 — Decision and approval letter</p>
              <p className="text-gray-700 text-sm">The state mails you a letter with the answer. If approved, your child has Medicaid right away. The approval lasts at least two years.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="font-semibold text-green-900 mb-2">What speeds up your case</p>
              <ul className="text-green-900 text-sm space-y-1 list-disc list-inside">
                <li>A full medical history from your child&apos;s main doctor</li>
                <li>Notes from any specialists who treat your child</li>
                <li>A current treatment plan</li>
                <li>Records of daily care your child needs</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="font-semibold text-red-900 mb-2">What slows your case down</p>
              <ul className="text-red-900 text-sm space-y-1 list-disc list-inside">
                <li>Missing or old medical records</li>
                <li>No proof of daily care needs</li>
                <li>Records that do not match what the doctor wrote</li>
                <li>No SSI denial letter on file</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700">
            Once Katie Beckett is approved, you can start the GAPP nursing process. See our{' '}
            <Link href="/gapp-approval-timeline" className="text-primary hover:underline">GAPP approval timeline</Link>{' '}
            for how long GAPP takes after Medicaid is in place.
          </p>
```

- [ ] **Step 2: Fill the Appeals section shell (Block 9)**

Locate the empty `<section id="appeals">` shell. Replace the placeholder comment with:

```tsx
          <p className="text-gray-700 mb-6">
            A denial is not the end. You have the right to ask the state to look at your case again. This is called an appeal.
          </p>

          <p className="font-semibold text-gray-900 mb-3">Most denials come from one of three reasons</p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>The state did not see enough medical proof</li>
            <li>Your child&apos;s care needs were not clear in the records</li>
            <li>The SSI denial letter was missing from your file</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <p className="font-semibold text-amber-900 mb-2">You have 30 days to act</p>
            <p className="text-amber-900 text-sm">
              From the date on your denial letter, you have 30 days to ask for a fair hearing. A fair hearing is the legal name for an appeal. You can ask by phone or in writing. The state will set a date for the hearing.
            </p>
          </div>

          <p className="font-semibold text-gray-900 mb-3">What helps on appeal</p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>A letter from your child&apos;s doctor that spells out daily care needs</li>
            <li>A log of how many hours of care your child gets each week</li>
            <li>Records from any new doctor visits since you first applied</li>
          </ul>

          <p className="text-gray-700 mb-4">
            If you need help, the <strong>Georgia Advocacy Office</strong> and <strong>Parent to Parent of Georgia</strong> are both free. They know how Katie Beckett works and can guide you through the appeal.
          </p>

          <p className="text-gray-700">
            For more on common denial reasons, see our{' '}
            <Link href="/why-gapp-applications-get-denied" className="text-primary hover:underline">guide to GAPP denials</Link>. Many of the same rules apply.
          </p>
```

- [ ] **Step 3: Fill the Renewal section shell (Block 10)**

Locate the empty `<section id="renewal">` shell. Replace the placeholder comment with:

```tsx
          <p className="text-gray-700 mb-4">
            Katie Beckett approval lasts at least two years. Some families get a longer approval based on how stable their child&apos;s needs are.
          </p>
          <p className="text-gray-700 mb-6">
            About 60 to 90 days before your approval ends, the state sends a renewal notice. Open it right away. The notice tells you what to do.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="font-semibold text-blue-900 mb-2">Renewal is not a full new application</p>
            <p className="text-blue-900 text-sm">
              The state wants updated medical records and a fresh medical evaluation. Your child&apos;s old approval stays in place while the renewal is being reviewed.
            </p>
          </div>

          <p className="font-semibold text-gray-900 mb-3">What ends your child&apos;s Katie Beckett</p>
          <ul className="space-y-2 text-gray-700 mb-6 list-disc list-inside ml-2">
            <li>Missing the renewal window with no answer to the state</li>
            <li>Your child going back to a hospital or nursing home for a long stay</li>
            <li>Your child turning 18</li>
          </ul>

          <p className="text-gray-700">
            If your child is close to 18, start planning for the next program early. GAPP nursing covers kids up to 21. Adult Medicaid waivers like ICWP or COMP may also fit your family.
          </p>
```

- [ ] **Step 4: Run reading-level check on all three new sections**

Paste each section's body prose into Hemingway separately. Confirm each is grade ≤ 5. Common fixes if flagged: split "and"/"but" compound sentences.

- [ ] **Step 5: Run the banned-AI-tells grep**

```bash
grep -nE "comprehensive|robust|leverage|utilize|delve|nuanced|holistic|multifaceted|seamless|vibrant|pivotal|crucial|underscore|foster|bolster|tapestry|landscape|nestled|intricate|myriad|moreover|furthermore|in essence|ultimately|notably,|indeed,|importantly,|crucially,|It's worth noting|It is worth noting|It's important to note" app/katie-beckett-waiver-georgia/page.tsx
```

Expected: zero matches.

- [ ] **Step 6: Run build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 7: Visual check on dev server**

Confirm all three sections render. Confirm the "30 days to act" amber callout in Appeals stands out. Confirm the new link to `/why-gapp-applications-get-denied` works.

- [ ] **Step 8: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): add timeline, appeals, and renewal sections

Three new sections targeting:
- Process clarity (Timeline, with 45-90 day breakdown)
- Denial recovery (Appeals, with 30-day fair hearing deadline)
- Long-term planning (Renewal, with what ends Katie Beckett)

Renewal section bridges to GAPP (covers under-21) and adult waivers
(ICWP, COMP) for families approaching the 18-year cutoff."
```

---

## Task 5: Expand eligibility, how-to-apply, what-it-covers, and "What is" sections

Per spec: Block 2 (TEFRA history), Block 4 (eligibility detail), Block 7 (3 application channels + DCH forms), Block 11 (coverage cards — dental + ABA). All four expansions ship in one commit.

**Files:**
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Add TEFRA history paragraph to Block 2 ("What is the Katie Beckett Waiver?")**

Locate the "What is Katie Beckett" section (around line 145). The current section has three paragraphs. Insert a fourth paragraph immediately after the existing "In Georgia, the Katie Beckett program is administered by the Department of Community Health..." paragraph and BEFORE the blue "Key Point" callout:

```tsx
            <p>
              Katie Beckett is named after a child from Iowa who lived on a ventilator. Before this rule existed, Medicaid only paid for her care in a hospital, not at her parents&apos; home. In 1982, Congress passed a law called TEFRA that let kids like Katie get Medicaid at home. Georgia&apos;s version of this rule is called the <strong>TEFRA Children&apos;s Medical Assistance Program</strong>. People still call it Katie Beckett.
            </p>
```

- [ ] **Step 2: Expand the Eligibility cards data**

Locate the eligibility cards array around line 184 in `page.tsx`. The current array is:

```tsx
              { title: 'Age Requirement', desc: 'Child must be under 18 years old' },
              { title: 'Disability Requirement', desc: 'Child must have a disability as defined by Section 1614 of the Social Security Act' },
              { title: 'Level of Care', desc: 'Child must require care at an institutional level (hospital, nursing facility, or ICF)' },
              { title: 'Home Care Appropriate', desc: 'Child must be able to be safely and appropriately cared for at home' },
              { title: 'Cost Effective', desc: 'Home care must cost less than institutional care (this is almost always the case)' },
              { title: 'Georgia Resident', desc: 'Child must be a resident of Georgia' },
```

Replace with the expanded version (each card now has a `detail` field):

```tsx
              { title: 'Age', desc: 'Your child must be under 18.', detail: 'Katie Beckett ends on the 18th birthday. Plan for GAPP (under 21) or adult waivers before that point.' },
              { title: 'Disability', desc: 'Your child must have a disability as defined by Section 1614 of the Social Security Act.', detail: 'This is the same definition used for SSI. The disability must be expected to last at least 12 months or result in death.' },
              { title: 'Level of care', desc: 'Your child must need care at the level a hospital or nursing facility would give.', detail: 'DCH looks for things like continuous medical supervision, four or more hours of skilled nursing each day, or care needs that an untrained caregiver cannot meet alone.' },
              { title: 'Safe to be home', desc: 'Your child must be able to be safely cared for at home.', detail: 'Your home does not need to be a medical setting. A bedroom, a caregiver, and the right equipment usually meet this test.' },
              { title: 'Cost test', desc: 'Home care must cost less than facility care.', detail: 'For nearly every child, home care is cheaper than a hospital or nursing home. This test almost always passes.' },
              { title: 'Georgia resident', desc: 'Your child must live in Georgia.', detail: 'A Georgia mailing address and parent residency normally meet this rule. Temporary out-of-state hospital stays do not break residency.' },
```

- [ ] **Step 3: Update the eligibility card render to show the detail field**

Locate the `.map((req, i) => ...)` render block around line 191. The current render shows `req.title` and `req.desc`. Update to also render `req.detail` as a smaller sentence below `req.desc`:

```tsx
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-200">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{req.title}</p>
                  <p className="text-gray-700 text-sm mt-1">{req.desc}</p>
                  <p className="text-gray-500 text-sm mt-2">{req.detail}</p>
                </div>
              </div>
```

- [ ] **Step 4: Restructure How to Apply Step 3 to show 3 channels**

Locate the existing Step 3 ("Contact the Katie Beckett Team") in the How to Apply section, around line 288. The current Step 3 shows only the phone contact card. Replace the entire Step 3 `<div className="bg-white rounded-xl border border-gray-200 p-6">...</div>` with:

```tsx
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">Pick how you want to apply</h3>
                  <p className="text-gray-700 mb-4">You can apply three ways. Pick whichever fits your situation.</p>

                  <div className="grid sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">Online</p>
                      <p className="text-gray-700 text-sm mb-2">Use the state portal at <a href="https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">medicaid.georgia.gov</a> or apply through <a href="https://gateway.ga.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gateway.ga.gov</a>.</p>
                      <p className="text-gray-500 text-xs">Fastest if you have the records ready to upload.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">By phone</p>
                      <p className="text-gray-700 text-sm mb-2">Call the Katie Beckett team at <a href="tel:6782487449" className="text-primary hover:underline font-semibold">678-248-7449</a>.</p>
                      <p className="text-gray-500 text-xs">They walk you through what they need.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-semibold text-gray-900 mb-2">In person</p>
                      <p className="text-gray-700 text-sm mb-2">Visit your local DFCS office. Ask for a Katie Beckett application.</p>
                      <p className="text-gray-500 text-xs">Best if you want help filling out the forms.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p className="font-medium text-gray-900">Centralized Katie Beckett Medicaid Team</p>
                    <p className="text-gray-700">5815 Live Oak Parkway, Suite D-2</p>
                    <p className="text-gray-700">Norcross, GA 30093</p>
                    <p className="text-gray-700 mt-2">
                      <strong>Phone:</strong> 678-248-7449<br />
                      <strong>Fax:</strong> 678-248-7459
                    </p>
                  </div>
                </div>
              </div>
            </div>
```

- [ ] **Step 5: Restructure How to Apply Step 4 to name the 3 DCH forms**

Locate the existing Step 4 ("Complete the Application") around line 309. Replace the entire Step 4 block with:

```tsx
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Fill out the three Katie Beckett forms</h3>
                  <p className="text-gray-700 mb-4">Three forms from the Department of Community Health make up the Katie Beckett application. Your child&apos;s doctor fills out the medical parts.</p>

                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">1</span>
                      <div>
                        <p className="font-semibold text-gray-900">Pediatric DMA Form</p>
                        <p>The main application. Captures your child&apos;s diagnosis, treating doctors, and care history.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">2</span>
                      <div>
                        <p className="font-semibold text-gray-900">Medical Necessity Level of Care Statement</p>
                        <p>Your child&apos;s doctor signs this. It explains why your child needs hospital-level or nursing-facility-level care.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">3</span>
                      <div>
                        <p className="font-semibold text-gray-900">Cost Effectiveness Form</p>
                        <p>Shows that caring for your child at home costs less than caring for them in a facility. For nearly every child, this passes easily.</p>
                      </div>
                    </li>
                  </ul>

                  <p className="text-gray-600 text-sm mt-4">
                    The state has all three forms in English and Spanish. You can ask for them by phone, download them from <a href="https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">medicaid.georgia.gov</a>, or pick them up at a DFCS office.
                  </p>
                </div>
              </div>
            </div>
```

- [ ] **Step 6: Expand the Coverage cards data (Block 11) — add dental/braces and ABA detail**

Locate the coverage cards array in the "What does Katie Beckett cover in Georgia?" section (around line 378). The current array has 8 entries. Replace it with this expanded version that adds detail to Dental and Therapy and adds one new Behavioral Health card:

```tsx
            {[
              { title: 'Doctor visits and specialists', desc: 'Pediatricians, neurologists, pulmonologists, and any specialist your child needs. No referral hoops for Medicaid-enrolled providers.' },
              { title: 'Hospital stays', desc: 'Inpatient and outpatient hospital care, emergency room visits, and surgeries.' },
              { title: 'Prescription medications', desc: 'Covered prescriptions including specialty medications that private insurance often limits or denies.' },
              { title: 'Durable medical equipment', desc: 'Wheelchairs, feeding pumps, oxygen equipment, suction machines, hospital beds, and other equipment your child uses daily.' },
              { title: 'Therapy services', desc: 'Physical, occupational, and speech therapy. ABA therapy for autism is also covered with a written diagnosis and a prescription from your child\'s doctor.' },
              { title: 'Home nursing through GAPP', desc: 'RN, LPN, and personal care services in your home. Private insurance rarely covers the hours medically fragile children actually need.' },
              { title: 'Mental health services', desc: 'Counseling, psychiatric care, and ongoing behavioral support for kids who need it.' },
              { title: 'Behavioral health crisis services', desc: 'Mobile crisis teams and short-term stabilization for kids in a behavioral health emergency. Separate from the routine mental health benefit.' },
              { title: 'Dental and orthodontia', desc: 'Cleanings, fillings, and sedation dentistry for kids who cannot sit still. Braces are covered when a dentist writes a medical necessity letter showing why your child needs them.' },
              { title: 'Medical transportation', desc: 'Non-emergency rides to and from appointments. One less thing to figure out on appointment days.' },
            ].map((item, i) => (
```

This adds two cards (Behavioral health crisis services, and renames "Dental care" to "Dental and orthodontia" with the braces detail), and adds the ABA detail to Therapy services.

- [ ] **Step 7: Run reading-level check on the new prose**

Paste the new TEFRA history paragraph, the eligibility-card detail sentences, the new Step 3 and Step 4 prose, and the expanded coverage card descriptions into Hemingway. Confirm grade ≤ 5 on each block.

- [ ] **Step 8: Run banned-AI-tells grep**

Expected: zero matches.

- [ ] **Step 9: Run build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 10: Visual check on dev server**

- "What is Katie Beckett" section now has a fourth paragraph with TEFRA history
- Eligibility cards now show three lines each (title, short rule, detail)
- How to Apply Step 3 now shows three side-by-side application channels (online, phone, in person)
- How to Apply Step 4 lists three named DCH forms with descriptions
- "What it covers" section now has 10 cards including the new Behavioral health crisis card and the expanded Dental and orthodontia card
- All links resolve

- [ ] **Step 11: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): expand intro, eligibility, application, coverage

- Block 2: Add TEFRA history paragraph (Iowa origin, 1982 Act, Georgia
  name 'TEFRA Children's Medical Assistance Program')
- Block 4: Each eligibility card now shows rule + detail sentence
  (Level of Care card explains the DCH checklist)
- Block 7 Step 3: Three application channels side-by-side
  (medicaid.georgia.gov, 678-248-7449, DFCS in person)
- Block 7 Step 4: Three named DCH forms (Pediatric DMA, Medical
  Necessity Level of Care, Cost Effectiveness)
- Block 11: Dental card expanded for braces/orthodontia, Therapy card
  expanded for ABA/autism, plus new Behavioral health crisis card"
```

---

## Task 6: Rebuild 4-way comparison table (Block 12)

Replaces the existing 2-way Katie Beckett vs GAPP table with a 4-way comparison covering Katie Beckett (TEFRA), GAPP, NOW, and COMP — the four Georgia Medicaid waivers that apply to children, per `app/waivers/page.tsx`.

**Files:**
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Locate the current 2-way table**

The existing comparison section starts at the `<section id="vs-other-programs">` (originally `id="vs-gapp"`, renamed in Task 1) around line 411 and ends before the CTA section. The section contains:
1. An h2 with text "Katie Beckett vs GAPP: What's the Difference?"
2. An intro paragraph
3. A 2-column table (Katie Beckett, GAPP) with 6 rows
4. A green "How They Work Together" callout

- [ ] **Step 2: Replace the entire comparison section body**

Replace the entire `<div className="max-w-3xl mx-auto">...</div>` content inside the `<section id="vs-other-programs">` with this new 4-way version:

```tsx
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Katie Beckett compared to other Georgia programs
          </h2>

          <p className="text-gray-700 mb-8">
            Georgia has several Medicaid programs that help children with serious needs. Each one does something different. Here is how the four that matter for kids line up.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-900"></th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-primary">Katie Beckett (TEFRA)</th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-accent">GAPP</th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">NOW Waiver</th>
                  <th className="border border-gray-200 px-3 py-3 text-left font-semibold text-gray-700">COMP Waiver</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">What it is</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">A way to get Medicaid</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">A nursing service</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Daily life supports</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Heavy daily supports</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">Who it is for</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids with serious medical needs</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids who need home nursing</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids and adults with IDD</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Kids and adults with severe IDD</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">Age range</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Under 18</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Under 21</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">All ages</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">All ages</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">Family income test</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None (child must already have Medicaid)</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">None</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">How to apply</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">678-248-7449 or gateway.ga.gov</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Pick a GAPP provider; they apply for you</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Sign up on the state DD waitlist</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Sign up on the state DD waitlist</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-3 font-medium text-gray-900 bg-gray-50">You choose the provider?</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">N/A</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Yes</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Yes</td>
                  <td className="border border-gray-200 px-3 py-3 text-gray-700">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-3">How Katie Beckett and GAPP work together</h3>
            <p className="text-green-900 mb-3">
              Most Georgia families use Katie Beckett to get Medicaid. Then they sign up for GAPP to get home nursing care for their child.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-primary text-white rounded-full font-medium">Katie Beckett</span>
              <span className="text-green-800">→</span>
              <span className="px-3 py-1 bg-green-600 text-white rounded-full font-medium">Medicaid</span>
              <span className="text-green-800">→</span>
              <span className="px-3 py-1 bg-accent text-white rounded-full font-medium">GAPP nursing</span>
            </div>
            <p className="text-green-900 text-sm mt-3">
              NOW and COMP are different waivers run by the Georgia DD (Developmental Disabilities) office. They serve kids with mostly cognitive needs, not medical ones. Most families with medically fragile children use Katie Beckett plus GAPP, not the DD waivers.
            </p>
          </div>
        </div>
```

Note the wrapper change: outer wrapper goes from `max-w-3xl` to `max-w-4xl` because the 4-way table needs more horizontal room.

- [ ] **Step 3: Run reading-level check**

Paste the new intro paragraph and the "How Katie Beckett and GAPP work together" callout into Hemingway. Confirm grade ≤ 5. Table cell content is exempt from grade check (terse data).

- [ ] **Step 4: Run banned-AI-tells grep**

Expected: zero matches.

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 6: Visual check on dev server**

- Section renders with the new 4-column table
- Horizontal scroll works on mobile (the `overflow-x-auto` wrapper does its job)
- The flow infographic shows three pills: Katie Beckett → Medicaid → GAPP nursing
- The explanatory note about NOW/COMP being DD-office-run reads clearly

- [ ] **Step 7: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): replace 2-way table with 4-way comparison

Table now compares Katie Beckett (TEFRA) / GAPP / NOW / COMP — the
four Georgia Medicaid waivers that apply to children, per
app/waivers/page.tsx.

Rows: what it is, who it is for, age, income test, how to apply,
provider choice.

The 'How They Work Together' callout retains the KB -> Medicaid -> GAPP
flow but now also explains where NOW/COMP fit (DD office, mostly
cognitive-needs families)."
```

---

## Task 7: Expand FAQ from 11 to 22 entries

Adds 11 new FAQ entries to the `KATIE_BECKETT_FAQS` array. Each entry is 2-4 sentences max so it stays eligible for FAQ rich results.

**Files:**
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Locate the existing FAQ array**

`KATIE_BECKETT_FAQS` is the const array declared near the top of `page.tsx` (around line 5). It currently has 11 entries. The render block at the bottom (`{KATIE_BECKETT_FAQS.map(...)}`) and the `<FAQPageSchema faqs={KATIE_BECKETT_FAQS} />` invocation in the JSX both consume this array, so adding entries to the array automatically expands both the visible FAQ accordion and the FAQ schema.

- [ ] **Step 2: Append 11 new FAQ entries to the array**

Add the following 11 entries to the end of the `KATIE_BECKETT_FAQS` array, after the existing entry 11 ("What does Katie Beckett Medicaid cover that regular insurance might not?"):

```tsx
  {
    question: 'What are the income limits for Katie Beckett in Georgia?',
    answer: 'There are no family income limits for Katie Beckett. Only your child\'s own money is counted, and most kids have none. A family making $200,000 a year can still qualify if their child meets the medical rules.',
  },
  {
    question: 'How do I apply for Katie Beckett through gateway.ga.gov?',
    answer: 'Go to gateway.ga.gov and start a Medicaid application. When asked, mark that the application is for a child with a disability. The system will route your case to the Katie Beckett team.',
  },
  {
    question: 'What is the new Katie Beckett online portal?',
    answer: 'Georgia launched a Katie Beckett online portal on April 15, 2026. Families can apply, upload medical records, track status, and message their case worker through the portal. You can access it through medicaid.georgia.gov.',
  },
  {
    question: 'What forms do I need for the Katie Beckett application?',
    answer: 'You need three forms from the Department of Community Health: the Pediatric DMA form, the Medical Necessity Level of Care Statement, and the Cost Effectiveness Form. Your child\'s doctor fills out the medical parts. The state can mail you the forms or you can download them from medicaid.georgia.gov.',
  },
  {
    question: 'How do I appeal a Katie Beckett denial in Georgia?',
    answer: 'You have 30 days from the date of your denial letter to ask for a fair hearing. Call the Katie Beckett team at 678-248-7449 or send your request in writing. A doctor\'s letter spelling out your child\'s daily care needs gives the strongest appeal.',
  },
  {
    question: 'How does Katie Beckett renewal work?',
    answer: 'Most approvals last at least two years. About 60 to 90 days before your approval ends, the state sends a renewal notice. You will need updated medical records and a new evaluation, but not a full new application.',
  },
  {
    question: 'What is the deeming waiver and how does it apply to Katie Beckett?',
    answer: 'The deeming waiver is the rule that lets Katie Beckett ignore your family income. The state "deems" that only your child\'s own money counts toward the test. For most kids that is zero, so any family income level can qualify.',
  },
  {
    question: 'Does Katie Beckett cover ABA therapy for autism?',
    answer: 'Yes. Once your child has Medicaid through Katie Beckett, ABA therapy is covered. Your child needs a written autism diagnosis and a prescription for ABA from a doctor or psychologist.',
  },
  {
    question: 'Does Katie Beckett cover dental work and braces?',
    answer: 'Yes for basic dental care like cleanings, fillings, and sedation dentistry for kids who cannot sit still. Braces are covered when a dentist or orthodontist writes a medical necessity letter showing why your child needs them.',
  },
  {
    question: 'What happens when my child turns 18?',
    answer: 'Katie Beckett ends on your child\'s 18th birthday. GAPP nursing continues until age 21. Before age 18, talk to the Katie Beckett team about adult Medicaid waivers like ICWP or COMP that may fit your family.',
  },
  {
    question: 'Where is the Katie Beckett office in Georgia?',
    answer: 'The Centralized Katie Beckett Medicaid Team is at 5815 Live Oak Parkway, Suite D-2, Norcross, GA 30093. The phone number is 678-248-7449.',
  },
```

- [ ] **Step 3: Run reading-level check on the new FAQ answers**

Paste each new answer into Hemingway. Confirm grade ≤ 5 on each. FAQ answers should be the easiest to keep simple because they are short.

- [ ] **Step 4: Run banned-AI-tells grep**

Expected: zero matches.

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 6: Visual check on dev server**

- The FAQ accordion now has 22 entries
- Each entry expands and collapses correctly
- Confirm the FAQ schema in dev tools (view page source, find the `application/ld+json` block, verify it contains 22 question/answer pairs)

- [ ] **Step 7: Validate FAQ schema in Rich Results Test**

After deploying the change to a preview environment (or using a local tunnel like ngrok), paste the URL into https://search.google.com/test/rich-results. Expected: FAQ rich result detected with 22 questions, no errors.

If running entirely local: validate the JSON-LD by copy-pasting the FAQ schema JSON into https://validator.schema.org/. Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): expand FAQ from 11 to 22 entries

New entries target specific queries from DataForSEO research:
- katie beckett income limits (30/mo)
- katie beckett application georgia (30/mo)
- katie beckett renewal (20/mo)
- katie beckett deeming waiver (20/mo)
- katie beckett autism (10/mo)
- does katie beckett cover dental (10/mo, currently pos 5.76 with 0 clicks)

Plus comprehensiveness entries on the new online portal, DCH forms,
appeal process, age-18 transition, and the Norcross office address.

Each answer is 2-4 sentences to stay eligible for FAQ rich results."
```

---

## Task 8: Add Article schema + metadata description + visible last-updated

Adds the `ArticleSchema` component to `components/JsonLd.tsx`, uses it on the Katie Beckett page, updates the `metadata.description` to mention the portal, and adds a visible "Last updated" line to the disclaimer.

**Files:**
- Modify: `components/JsonLd.tsx`
- Modify: `app/katie-beckett-waiver-georgia/page.tsx`

- [ ] **Step 1: Add the ArticleSchema component to JsonLd.tsx**

Open `components/JsonLd.tsx`. After the existing `OrganizationSchema` component (and before any other schemas), insert:

```tsx
// Article Schema - for long-form content pages with freshness signal
interface ArticleSchemaProps {
  headline: string
  datePublished: string  // ISO 8601 (YYYY-MM-DD)
  dateModified: string   // ISO 8601 (YYYY-MM-DD)
  description?: string
  url?: string
}

export function ArticleSchema({
  headline,
  datePublished,
  dateModified,
  description,
  url,
}: ArticleSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    datePublished,
    dateModified,
    ...(description && { description }),
    ...(url && { mainEntityOfPage: { '@type': 'WebPage', '@id': url } }),
    author: {
      '@type': 'Organization',
      name: 'GeorgiaGAPP',
      url: 'https://www.georgiagapp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GeorgiaGAPP',
      url: 'https://www.georgiagapp.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.georgiagapp.com/logo.webp',
      },
    },
  }
  return <JsonLd data={data} />
}
```

- [ ] **Step 2: Update the metadata.description on the Katie Beckett page**

In `app/katie-beckett-waiver-georgia/page.tsx`, locate the `metadata` export (around line 73). Replace the current `description` field:

```tsx
  description: 'Complete guide to the Katie Beckett waiver in Georgia. Eligibility, what it covers, how to apply, and how it connects to GAPP nursing.',
```

With:

```tsx
  description: 'Katie Beckett (TEFRA) in Georgia — eligibility, the 2026 Online Portal, income rules, application forms, and how it works with GAPP.',
```

Confirm the new string is 152 characters (under the 160 limit enforced by seo-check).

- [ ] **Step 3: Import ArticleSchema and invoke it on the page**

In `app/katie-beckett-waiver-georgia/page.tsx`, update the import on line 3:

```tsx
import { FAQPageSchema, BreadcrumbSchema, ArticleSchema } from '@/components/JsonLd'
```

Then in the page component body, locate the existing `<FAQPageSchema ... />` and `<BreadcrumbSchema ... />` invocations (around line 87). Add an `<ArticleSchema>` invocation immediately after `<BreadcrumbSchema>`:

```tsx
      <ArticleSchema
        headline="Katie Beckett Waiver in Georgia"
        datePublished="2026-01-19"
        dateModified="2026-05-11"
        description="Katie Beckett (TEFRA) in Georgia — eligibility, the 2026 Online Portal, income rules, application forms, and how it works with GAPP."
        url="https://www.georgiagapp.com/katie-beckett-waiver-georgia"
      />
```

- [ ] **Step 4: Update the disclaimer to show "Last updated: May 2026"**

Locate the disclaimer section at the bottom of the page (around line 624). Replace the existing single-paragraph disclaimer with:

```tsx
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            <strong>Last updated:</strong> May 2026 (includes the April 15, 2026 online portal launch)
          </p>
          <p className="text-sm text-gray-500">
            This information is for education only. It is not legal or medical advice. For official Katie Beckett eligibility information, contact the Centralized Katie Beckett Medicaid Team at <a href="tel:6782487449" className="underline hover:text-gray-700">678-248-7449</a>.
          </p>
        </div>
      </section>
```

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: success. The seo-check.ts script will validate that the new description is ≤ 160 chars.

- [ ] **Step 6: Validate the Article schema**

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000/katie-beckett-waiver-georgia` and view source. Find the new `<script type="application/ld+json">` block containing the Article schema. Copy the JSON contents (everything between the script tags). Paste into https://validator.schema.org/. Expected: no errors.

Also verify Article + FAQ + Breadcrumb schemas all coexist (three separate `<script>` blocks).

- [ ] **Step 7: Visual check on dev server**

- The disclaimer at the bottom now shows "Last updated: May 2026" prominently
- No visual regressions

- [ ] **Step 8: Commit**

```bash
git add components/JsonLd.tsx app/katie-beckett-waiver-georgia/page.tsx
git commit -m "feat(katie-beckett): add Article schema + dateModified freshness signal

- New ArticleSchema component in components/JsonLd.tsx (mirrors
  OrganizationSchema pattern, accepts headline + datePublished +
  dateModified + optional description and url)

- Katie Beckett page now emits three schemas: FAQPage, BreadcrumbList,
  and Article (datePublished 2026-01-19, dateModified 2026-05-11)

- Visible 'Last updated: May 2026' line in the disclaimer pairs with
  the schema-level dateModified — Google sometimes ignores schema-only
  freshness signals without a visible counterpart

- metadata.description rewritten to surface the 2026 Online Portal
  (152 chars, under 160 limit)"
```

---

## Task 9: Final verification pass

End-to-end check that the rewrite hits all spec constraints before declaring complete. This task may produce no code changes — only verification. If issues surface, fix them inline before the final commit.

**Files:**
- May modify: `app/katie-beckett-waiver-georgia/page.tsx` (only if issues found)

- [ ] **Step 1: Run seo-check.ts in strict mode**

```bash
npm run build
```

The build runs `scripts/seo-check.ts` in strict mode. Expected output includes a line `✓ All pages pass.` and the build completes with no errors.

If a violation appears: read the error message. Common violations: title > 60 chars (we shouldn't have introduced this since title is unchanged), description > 160 chars (verify the new description is ≤ 160), missing canonical (already in place).

- [ ] **Step 2: Run the comprehensive banned-AI-tells grep across the whole page**

```bash
grep -nE "comprehensive|robust|leverage|utilize|delve|nuanced|holistic|multifaceted|seamless|vibrant|pivotal|crucial|underscore|foster|bolster|tapestry|landscape|nestled|intricate|myriad|moreover|furthermore|in essence|ultimately|notably,|indeed,|importantly,|crucially,|It's worth noting|It is worth noting|It's important to note|obtain|utilize|demonstrate|reside|commence|inquire|consequently|nevertheless|additionally|sufficient|approximately|numerous|various " app/katie-beckett-waiver-georgia/page.tsx
```

Expected: zero matches. If any match: rewrite the offending sentence.

Note: this grep includes the plain-vocab swap list from the spec, not just the AI-tells list. Words like "obtain" or "utilize" should be replaced with "get" and "use".

- [ ] **Step 3: Em-dash count check**

```bash
grep -o "—" app/katie-beckett-waiver-georgia/page.tsx | wc -l
```

Expected: ≤ 2.

If > 2: locate each em dash with `grep -n "—" app/katie-beckett-waiver-georgia/page.tsx` and rewrite at least (count - 2) of them. Common replacements: split into two sentences, or use ", " / ". " instead.

- [ ] **Step 4: Reading-level check on the full page body**

Hemingway Editor doesn't have a CLI, so manual paste required. Extract all body prose (skip JSX, skip headings, skip table cells) into a single text blob and paste into https://hemingwayapp.com/. Confirm:
- Overall grade level ≤ 6 (a slight tolerance above the per-section 5 target since the full-page average smooths out)
- No more than 5 "hard to read" sentences across the whole page
- No more than 10 "very hard to read" sentences

If grade level > 6 or counts exceed: identify the worst sentences and rewrite. Split compound sentences. Shorten words.

- [ ] **Step 5: Validate all three schemas in production-equivalent form**

On the dev server, view-source the page and extract the three `<script type="application/ld+json">` blocks. Paste each into https://validator.schema.org/ separately. Expected: zero errors on each.

- [ ] **Step 6: Lighthouse run on the Katie Beckett URL**

Run the local dev server in production mode:

```bash
npm run build && npm run start
```

In Chrome DevTools, open the page at `http://localhost:3000/katie-beckett-waiver-georgia`, run Lighthouse on Mobile, Performance audit only. Expected:
- LCP ≤ 2.5s (the logo fix from commit `ee13be4` should hold)
- Performance score ≥ 85
- No regressions vs the pre-rewrite version

If LCP regressed: identify the new largest contentful element. Most likely culprit: the new freshness badge SVG or one of the new section header `<h2>` blocks. Fix by ensuring the LCP element is above the fold and lightweight.

- [ ] **Step 7: Manual click-through on dev server**

Open `http://localhost:3000/katie-beckett-waiver-georgia` on both desktop and mobile viewports (Chrome DevTools device mode for mobile). Walk through the page top to bottom:

- All 10 jump-links scroll to a section with content
- The hero freshness badge renders
- The online portal section bullets render with checkmark icons
- The income deeming section's green $200k example callout stands out
- The eligibility cards each show three lines
- The how-to-apply Step 3 shows three side-by-side channels on desktop and stacks on mobile
- The how-to-apply Step 4 lists three DCH forms with numbered badges
- The 4-way comparison table scrolls horizontally on mobile
- The new FAQ entries (12-22) expand and collapse
- The disclaimer shows "Last updated: May 2026"
- All internal links return 200 (test by clicking each one)
- All external `.gov` links open in new tabs

- [ ] **Step 8: Read every new content block aloud**

The final check from the spec: read every new content block aloud. If a sentence makes you stumble, rewrite it. Update the page file with any rewrites discovered.

- [ ] **Step 9: Commit only if Step 1-8 produced changes**

If steps 1-8 surfaced violations that you fixed:

```bash
git add app/katie-beckett-waiver-georgia/page.tsx
git commit -m "fix(katie-beckett): verification-pass fixes (reading level + em dashes + AI tells)"
```

If no changes needed:

```bash
git commit --allow-empty -m "verify(katie-beckett): rewrite passes seo-check, reading-level, schema validation"
```

The empty commit marks the verification pass in the git log even when no fixes were needed.

---

## Measurement (post-merge)

This is not a code task. After the PR merges and Vercel deploys:

- **Day 1 (deploy day):** Confirm the deployed page renders correctly. Pull the page through https://search.google.com/test/rich-results to confirm Google sees the FAQ + Article schemas.
- **Week 2 (2026-05-25):** Pull a fresh GSC export. Compare CTR on the Katie Beckett page in the 2-week pre-rewrite window vs post-rewrite. Expected first signal: `does katie beckett cover dental insurance` CTR improves (we ranked pos 5.76 with 0 clicks pre-rewrite; the new dental FAQ should convert).
- **Week 4 (2026-06-08):** Position movement begins on Georgia-anchored queries. Expected: pos 32 → pos 15-20 for "katie beckett waiver georgia" cluster.
- **Month 3 (2026-08-11):** Final measurement. Page should be at pos 4-7 with 50-80 clicks/month. If position has not moved meaningfully, the rewrite did not work — pull GSC, identify which query clusters under-performed, and diagnose before adding more content.
