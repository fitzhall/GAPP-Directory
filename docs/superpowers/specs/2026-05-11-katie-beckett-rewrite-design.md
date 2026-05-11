# Katie Beckett Page Rewrite — Design Spec

**Date:** 2026-05-11
**Target page:** `app/katie-beckett-waiver-georgia/page.tsx`
**Current state:** ranks pos 32 with 2,252 impressions / 9 clicks in 90-day GSC window
**Target state:** pos 4–7 on Georgia-anchored queries, ~50–80 clicks/month
**Research input:** `docs/seo-research/katie-beckett/findings.md`

---

## Goal

Rewrite the Katie Beckett page into the most comprehensive parent-facing guide in the SERP, exploiting two facts surfaced by the DataForSEO + GSC research:

1. **Competition is LOW** on every Katie Beckett keyword in Atlanta DMA (40 keywords with measurable volume, all LOW competition).
2. **The official `medicaid.georgia.gov` page is structurally thin** — 5 sections, no FAQ, no benefits detail, no income explanation. We can rank #2–#3 just below it through comprehensiveness.

The rewrite ships in a single PR as nine atomic commits. No new components. No DB or schema changes. Content + metadata + Article schema only.

---

## Non-goals

- Not rewriting other SEO content pages (no scope creep)
- Not adding new shared React components
- Not changing the page route, slug, or canonical URL
- Not pursuing keywords with no measurable volume (per findings.md, 76 of 116 seed keywords returned zero)
- Not adding HowTo schema (would fragment rich-result eligibility with the FAQ schema we already have)
- Not building condition-specific pages (only "katie beckett autism" had measurable volume at 10/mo — handled via FAQ instead)

---

## Information Architecture

Page goes from 12 blocks to 17. Five blocks net-new, five expanded, seven unchanged.

| # | Block | State |
|---|---|---|
| 1 | Hero | Modified — add "Updated for Apr 2026 portal" badge |
| 2 | What is the Katie Beckett Waiver? | Expanded — TEFRA history paragraph |
| 3 | **The new Online Portal (Apr 15, 2026)** | **New** |
| 4 | Eligibility Requirements (6 cards) | Expanded — 1-2 sentences per card |
| 5 | **How "no income limit" actually works (deeming)** | **New** |
| 6 | Qualifying Conditions | Expanded — autism caveat |
| 7 | How to Apply | Expanded — 3 channels, DCH form names |
| 8 | **Timeline & medical evaluation** | **New** |
| 9 | **If you're denied (appeals)** | **New** |
| 10 | **Renewal & recertification** | **New** |
| 11 | What does Katie Beckett cover? | Expanded — dental/braces, ABA detail |
| 12 | Katie Beckett vs Other GA Programs | Restructured — 4-way table (KB/GAPP/NOW/COMP) |
| 13 | Find a GAPP Provider CTA | Unchanged |
| 14 | FAQs | Expanded — 11 → 22 entries |
| 15 | Official .gov resources | Modified — add gateway.ga.gov |
| 16 | Related Resources | Unchanged |
| 17 | Disclaimer | Modified — "Last updated: May 2026" |

---

## Content blocks — net-new

### Block 3: The New Online Portal (Apr 15, 2026)

**~150-200 words. 1 callout box. Anchor: `#online-portal`.**

Covers:
- What it is: state-built tool letting families upload documents, track application status, message case workers
- Launched April 15, 2026 (date prominent for freshness)
- What you can do: submit applications, upload medical records, message case workers, view approval letters
- How to access: portal landing page on medicaid.georgia.gov + alternative channels for families without computer access (the phone line and DFCS office remain)

**Why this block exists:** The competitor scrape of medicaid.georgia.gov confirms the portal is the top-of-page news on the official page. Mirroring this content with the same launch date is the strongest freshness signal we can add.

### Block 5: How "no income limit" actually works

**~250 words. 1 worked-example block. Anchor: `#income-rules`.**

Covers:
- The deeming mechanic: under TEFRA, only the child's own income/assets are deemed, not the family's
- Worked example with real numbers: family of 4 making $200,000/yr — child still qualifies if medical criteria met
- What the child IS counted for: child support paid to them, inherited assets in the child's name, SSI received
- Why this is the most misunderstood part: contrast with regular Medicaid's family-income test
- Callout: "If you were told 'you make too much for Medicaid,' you were told about regular Medicaid. Katie Beckett is the workaround."

**Why this block exists:** "katie beckett income limits" gets 30/mo Atlanta DMA volume. The concrete dollar-amount worked example is the kind of content the .gov page won't write — content moat.

### Block 8: Timeline & medical evaluation

**~200 words. 1 visual timeline. Anchor: `#timeline`.**

Covers:
- 45-90 day standard processing window
- Stage breakdown:
  - Application submission → completeness review (1-2 weeks)
  - Medical evaluation (3-6 weeks)
  - Decision (1-2 weeks)
- What the medical evaluation looks at: institutional level-of-care criteria from DCH checklist (continuous medical supervision, 4+ hours daily nursing equivalent, etc.)
- Documentation that speeds approval vs documentation that slows it

**Why this block exists:** The existing page mentions "45-90 days" once in a callout but doesn't break down the stages. Detailed timeline content is what separates a comprehensive guide from a brochure.

### Block 9: If you're denied (appeals)

**~200 words. Anchor: `#appeals`.**

Covers:
- Common denial reasons: insufficient medical documentation, LOC criteria not clearly met, missing SSI denial letter
- Right to a fair hearing — what it is, how to request, deadline (typically 30 days from denial notice)
- What changes between original app and appeal (usually: more medical detail, treating-physician statement)
- When to involve an advocate — link to Georgia Advocacy Office, Parent to Parent of GA
- Internal link to `/why-gapp-applications-get-denied` for adjacent denial context

**Why this block exists:** Denial is the highest-emotion search moment in the funnel. The current page has 1 FAQ on this; a dedicated section converts.

### Block 10: Renewal & recertification

**~150 words. Anchor: `#renewal`.**

Covers:
- Approvals run minimum 2 years (currently mentioned in step 6 callout — expand here)
- When renewal notices arrive (typically 60-90 days before expiration)
- What changes at renewal: medical eval refresh required, not full reapplication
- What gets you in trouble: missing the renewal window, returning to institutional care, child turning 18

**Why this block exists:** "katie beckett renewal" 20/mo Atlanta volume. Direct keyword match.

---

## Content blocks — expanded

### Block 2: What is the Katie Beckett Waiver?

Current: 3 paragraphs. Add 1 paragraph on TEFRA history (Section 134, 1982 act, Katie Beckett the original child). Add 1 sentence naming the program "TEFRA Children's Medical Assistance Program" to mirror official .gov terminology.

### Block 4: Eligibility Requirements (6 cards)

Each card title + 1 sentence currently. Expand each to 1-2 sentences with concrete detail. Most important expansion: the "Level of Care" card explains what DCH's checklist actually evaluates (currently the page asserts the criterion without explaining it).

### Block 7: How to Apply (6 steps)

- **Step 3 restructure:** present 3 application channels side-by-side instead of phone-only — phone (678-248-7449), local DFCS office, gateway.ga.gov
- **Step 4 restructure:** name the 3 DCH forms — Pediatric DMA, Medical Necessity Level of Care Statement, Cost Effectiveness Form
- Add sub-bullet noting Spanish-language forms are available
- ~150 words of additions

### Block 11: What it covers (8 cards)

- Expand the **Dental** card: explicitly mention orthodontia (braces) covered with medical-necessity letter
- Expand the **Therapy** card: explicitly mention ABA for autism
- Add 1 new card: **Behavioral health crisis services**

### Block 12: Comparison table — 2-way → 4-way

**Programs:** Katie Beckett (TEFRA) / GAPP / NOW / COMP

**Rationale:** These are the four Georgia Medicaid waivers that apply to children, per `app/waivers/page.tsx`. ICWP and CCSP are adult-focused and excluded (the memory note suggesting "CCSP/SOURCE" was inaccurate for a child-focused comparison).

**Rows:**
- What it is (eligibility pathway / service program)
- Who it's for (medically fragile / IDD / etc.)
- Age range
- Income test (none / regular Medicaid / etc.)
- How to apply (phone, DFCS, gateway, agency choice)
- Provider choice (yes/no/limited)

**Followed by** existing "How They Work Together" infographic, slightly modified to show the 4-way relationship.

~600 words of table content.

---

## FAQ expansion: 11 → 22

Keep all 11 existing. Add 11 new entries below.

| # | Question | Keyword targeted | Vol/mo |
|---|---|---|---|
| 12 | What are the income limits for Katie Beckett in Georgia? | katie beckett income limits | 30 |
| 13 | How do I apply for Katie Beckett through gateway.ga.gov? | katie beckett application georgia | 30 |
| 14 | What is the new Katie Beckett Online Portal? | (freshness signal) | — |
| 15 | What forms do I need for the Katie Beckett application? | (comprehensiveness) | — |
| 16 | How do I appeal a Katie Beckett denial in Georgia? | katie beckett denial | <10 |
| 17 | How does Katie Beckett renewal work? | katie beckett renewal | 20 |
| 18 | What is the deeming waiver and how does it apply? | katie beckett deeming waiver | 20 |
| 19 | Does Katie Beckett cover ABA therapy for autism? | katie beckett autism | 10 |
| 20 | Does Katie Beckett cover dental work and braces? | does katie beckett cover dental | 10 |
| 21 | What happens when my child turns 18? | (transition bridge) | — |
| 22 | Where is the Katie Beckett office in Georgia? | (Norcross detail) | — |

**FAQ length rule:** 2-4 sentences each. Long answers tank rich-result eligibility — schema rewards concise.

**Stealth-winner note on FAQ #20:** GSC shows we already rank pos 5.76 for "does katie beckett cover dental insurance" with 103 impressions and 0 clicks. A richer dental answer converts that pos-5 visibility into actual clicks without needing to move position.

---

## Metadata & schema

### Title

**Keep current:** `Katie Beckett Waiver Georgia: Eligibility & Application` (56 chars, passes seo-check)

### Description

**New:** `Katie Beckett (TEFRA) in Georgia — eligibility, the 2026 Online Portal, income rules, application forms, and how it works with GAPP.`

(152 chars, under 160 limit, mentions portal for freshness)

### Schema additions

- **FAQPageSchema:** expand to 22 entries (existing component, feed new FAQ array)
- **BreadcrumbSchema:** unchanged
- **Add Article schema:**
  - `@type: Article`
  - `headline: <title>`
  - `datePublished: 2026-01-19` (original commit `d4f803a`)
  - `dateModified: 2026-05-11`
  - `author: { @type: Organization, name: "GeorgiaGAPP" }`

### dateModified pair

Article schema `dateModified` paired with visible "Last updated: May 2026" text in the disclaimer block. Without both, Google sometimes ignores the schema-level freshness signal.

---

## Style & voice

Per `ANTI-AI-STYLE-GUIDE.md`:

- Sentence case in H1/H2/H3 except `metadata.title` (Title Case carve-out)
- Em dashes capped at 2 per page — current page has ~6, reduce during rewrite
- Banned vocab: delve, leverage, robust, comprehensive, seamless, nuanced, multifaceted, foster, bolster, intricate, holistic, vibrant, pivotal, crucial, underscore
- Worked examples use specific dollar amounts and named entities (the $200k family example, real DCH form names) — concreteness is the moat
- No hedging — direct parent-facing voice
- No AI tells (no "It is worth noting that…", no "It's important to remember…", no triples)

---

## Internal linking

### Existing links to keep
- `/gapp-providers-georgia`
- `/gapp-vs-ccsp`
- `/waivers`
- `/gapp-approval-guide`
- All 9 related-resource cards

### New outbound links from this page
- `/why-gapp-applications-get-denied` — from new "If you're denied" block (Block 9)
- `/gapp-approval-timeline` — from new "Timeline" block (Block 8)

---

## Implementation: nine commits in one PR

| # | Commit | Files |
|---|---|---|
| 1 | scaffold new sections (empty shells + jump-links + anchors) | page.tsx |
| 2 | add Online Portal content + freshness badge in hero | page.tsx |
| 3 | add deeming/income mechanics section + worked example | page.tsx |
| 4 | add Timeline / Appeals / Renewal sections | page.tsx |
| 5 | expand eligibility cards + how-to-apply DCH form names + gateway.ga.gov | page.tsx |
| 6 | rebuild 4-way comparison table (KB/GAPP/NOW/COMP) | page.tsx |
| 7 | expand FAQ from 11 → 22 | page.tsx |
| 8 | metadata + Article schema + dateModified + style cleanup | page.tsx, components/JsonLd.tsx (Article schema) |
| 9 | run seo-check.ts strict + fix any violations | (validation only) |

Each commit is independently revertable.

---

## Verification before merge

- `npm run build` passes (seo-check.ts strict mode runs as part of build)
- Local dev server (`npm run dev`) — manually walk the page top to bottom, verify:
  - All jump-links scroll to the right anchors
  - Mobile layout doesn't break in new sections
  - All internal links 200
  - Em-dash count ≤ 2
  - No banned AI vocab
- Lighthouse run on local — confirm LCP < 2.5s (logo fix held, this page was the trigger)
- Validate FAQPageSchema and Article schema in Google's Rich Results Test before merging

---

## Measurement plan

**Baseline (today):**
- Page position: 32
- Page impressions: 2,252 (90-day GSC)
- Page clicks: 9 (90-day GSC)
- Page CTR: 0.40%

**3-week post-merge check (target: 2026-06-01):**
- Pull fresh GSC export
- Compare position movement on Georgia-anchored queries (katie beckett waiver georgia, katie beckett ga, katie beckett medicaid georgia, katie beckett income limits)
- CTR should improve on `does katie beckett cover dental insurance` (currently pos 5.76 / 0 clicks) — this is the fastest signal

**3-month post-merge check (target: 2026-08-11):**
- Page-level clicks should be in the 50-80/mo range
- Position on the primary Georgia cluster should be pos 4–7
- If position has not moved, the rewrite did not work — diagnose before adding more content

---

## Risks & open questions

- **Article schema risk:** First time adding Article schema to a content page on this site. Google may flag it as conflicting with FAQ. Mitigation: validate in Rich Results Test before merging.
- **Online Portal accuracy risk:** Portal launched 3 weeks ago. If features change rapidly, the section may go stale. Mitigation: link to medicaid.georgia.gov portal page as the source of truth; describe portal capabilities generically rather than UI specifics.
- **4-way comparison row choices:** Rows can be debated. Alternative axes considered: "Hours of nursing covered" (rejected — not all programs are nursing). "How fast to apply" (rejected — not parent-relevant). The 6 chosen rows match parent decision criteria.
- **Word count creep:** Target ~3,000 words, comparable to KFF and Verywell Health. Going past 4,000 risks readability and Google's "thin content vs bloat" balance. Reviewer should push back on any section that drifts past its target word count.
