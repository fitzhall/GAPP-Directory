# Katie Beckett — Keyword Research Findings

**Date:** 2026-05-11
**Data sources:**
- DataForSEO `keywords_data/google_ads/search_volume/live` — Atlanta DMA (location 200524), 116 seed keywords, $0.075
- GSC Performance export (Feb 11 – May 9, 2026)
- Live competitor scrape: `medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett`

**Total spend:** $0.075. SERP and keyword-expansion endpoints required a separate funding tier — sufficient signal came from volume + GSC + competitor analysis.

---

## Headline numbers

- **40 of 116** seed keywords have measurable monthly volume in Atlanta DMA.
- **~2,000 unique monthly searches** in Atlanta DMA across the Katie Beckett cluster (≈ ~3,500–4,000 statewide based on Atlanta DMA = ~60% of GA population).
- **Competition is LOW on every single keyword.** Not one keyword in the seed set returned MEDIUM or HIGH. Translation: very few advertisers are bidding here, and as a proxy, organic competition is thin.
- **Current position:** GSC has us at avg pos **32** for `/katie-beckett-waiver-georgia`. Page is ranking but invisible.

---

## Volume tiers

### Tier 1 — Brand head terms (3,900/mo combined exact match buckets)

Google clusters these semantically — likely a single pool of ~1,300 unique searchers routed through three equivalent triggers:

| Keyword | Vol/mo (Atlanta) | CPC | Comp |
|---|---:|---:|---|
| katie beckett | 1,300 | $6.95 | LOW |
| katie beckett waiver | 1,300 | $6.95 | LOW |
| katie beckett medicaid | 1,300 | $6.95 | LOW |

**Read:** The generic-brand pool is the prize. Anyone in Atlanta searching the program by any of its three common names. We're currently invisible on this cluster (pos 56–86 per GSC).

### Tier 2 — Georgia-specific + program variants (2,600/mo)

| Keyword | Vol/mo | CPC | Comp |
|---|---:|---:|---|
| katie beckett waiver georgia | 260 | $9.09 | LOW |
| katie beckett waiver ga | 260 | $9.09 | LOW |
| katie beckett medicaid georgia | 260 | $9.09 | LOW |
| katie beckett medicaid ga | 260 | $9.09 | LOW |
| katie beckett georgia | 260 | $9.09 | LOW |
| katie beckett ga | 260 | $9.09 | LOW |
| georgia katie beckett | 260 | $9.09 | LOW |
| katie beckett waiver program | 260 | $17.56 | LOW |
| katie beckett program | 260 | $17.56 | LOW |
| katie beckett application | 260 | $17.56 | LOW |

**Read:** Georgia-anchored terms + the high-intent "application" term. CPCs are the highest in the set ($9–$17), which means commercial value per click is real (these are searchers ready to act). **This is where the page should win first.**

### Tier 3 — High-intent long-tail (~400/mo, 27 keywords)

The 10–50/mo range. Each tiny on its own; together they represent the "I'm researching specifics" segment:

| Keyword | Vol/mo | CPC |
|---|---:|---:|
| tefra | 50 | $0 |
| what is katie beckett medicaid | 40 | $2.72 |
| katie beckett program georgia | 30 | $9.47 |
| katie beckett income limits | 30 | n/a |
| katie beckett application georgia | 30 | $9.47 |
| how to apply for katie beckett in georgia | 30 | $11.83 |
| who qualifies for katie beckett | 20 | $5.74 |
| what does katie beckett cover in georgia | 20 | $13.69 |
| what does katie beckett cover | 20 | n/a |
| katie beckett renewal | 20 | n/a |
| katie beckett deeming waiver | 20 | n/a |
| katie beckett autism | 10 | n/a |
| does katie beckett cover dental | 10 | n/a |
| deeming waiver georgia | 10 | n/a |
| ...and 13 more at 10/mo each | | |

**Read:** Sweep these. Each requires one section/FAQ entry. Cumulative win.

---

## What 76 keywords had no measurable volume

These returned `null` or 0 in Atlanta DMA — worth knowing because we shouldn't waste content blocks targeting them:

- Condition-specific (besides autism): "katie beckett cerebral palsy", "katie beckett down syndrome", "katie beckett feeding tube" — searched effectively zero. Caregivers know to search by program name, not by condition.
- Coverage-specific specifics: "does katie beckett cover braces", "does katie beckett cover formula", "katie beckett vision" — zero. Suggests covered-services questions get bundled into the generic "what does katie beckett cover" 20/mo bucket.
- Process specifics: "katie beckett wait time", "katie beckett approval time", "katie beckett medical evaluation", "katie beckett denial reasons" — zero. Process detail is mentally bundled into the generic "how to apply" search.
- Transition: "katie beckett 18", "katie beckett age out", "after katie beckett" — zero in Atlanta DMA. Surprising — may be national community language but not a query string at this volume.

**Implication for content:** Don't build standalone sections targeting near-zero-volume specifics. Bundle them into the bigger sections as paragraph-level answers. The keyword surface area Google evaluates is **the page as a whole**, not individual H2s.

---

## Competitor reality — `medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett`

This is the official Georgia Medicaid page. It almost certainly ranks #1 on every Georgia-anchored Katie Beckett query. We will not outrank `.gov` on authority. We can outrank it on **comprehensiveness, freshness, and parent-facing detail**.

**What the official page covers (5 sections only):**
1. Program Overview (TEFRA history paragraph)
2. Application — 3 channels: phone 678-248-7449, local DFCS office, gateway.ga.gov
3. **Katie Beckett Online Portal — launched April 15, 2026** (this is news; our page does not mention it)
4. Forms (3 specific names: Pediatric DMA, Medical Necessity Level of Care Statement, Cost Effectiveness Form)
5. Other Documents (modification forms, deeming waiver manual)

**What the official page DOES NOT cover (= our content opportunity):**
- Specific income/asset thresholds (despite "katie beckett income limits" being a 30/mo search)
- Approval timelines and processing windows
- Renewal/recertification procedure detail
- Institutional level-of-care criteria (what actually qualifies a child)
- Approval duration specifics
- Benefit amounts / covered services breakdown
- Appeal procedures after denial
- FAQ section
- Comparisons to other waivers (CCSP, SOURCE, GAPP, SSI pathway)
- Spanish-language explanation (only the *forms* are bilingual)

**This is unusually favorable.** When the .gov page is thin, the well-organized comprehensive guide can rank #2–#3 on the same SERP and convert better.

---

## What our current page (`/katie-beckett-waiver-georgia`, 633 lines) already does well

- Hero + breadcrumb + jump links
- 6-step application process with the correct phone number and Norcross address
- Conditions list (15 entries)
- Coverage section (8 service categories)
- KB vs GAPP comparison table
- 11 FAQs with FAQPageSchema markup
- BreadcrumbSchema
- 4 outbound .gov authority links
- 9 related-resource internal links

---

## Gaps the rewrite must close (ranked by signal strength)

| Gap | Search evidence | Priority |
|---|---|---|
| No mention of the new **Online Portal (April 15, 2026)** | Competitor freshness signal; Google rewards recency | **Critical** |
| No discussion of **"no income limit" deeming mechanics** despite "katie beckett income limits" being a 30/mo search | Direct search match | **High** |
| Doesn't reference the actual DCH form names (Pediatric DMA, Medical Necessity Level of Care, Cost Effectiveness Form) | Authority signal — parents will see these names on the .gov page and want them explained | **High** |
| Doesn't cover **gateway.ga.gov** as an application channel | Official channel; named on the .gov page | **High** |
| No CCSP/SOURCE/Independent Care Waiver comparison | Tier-2 keyword "katie beckett vs ccsp" + memory note about 4-way comparison | **High** |
| No **denial/appeals** content | Caregiver community pain point even if exact-match search is thin | Medium |
| No **renewal/recertification** detail | "katie beckett renewal" 20/mo search | Medium |
| Form 1500-line content style: all bullets and cards, no narrative depth | Comprehensiveness signal — Google rewards substantive text | Medium |
| 11 FAQs is light — could be 20+ given how rich the topic is | FAQ schema scales | Medium |
| No Spanish-language acknowledgment | Latino-family search exists, DCH publishes bilingual forms | Low |
| No condition-specific paragraphs (autism the only one with real volume at 10/mo) | "katie beckett autism" 10/mo | Low |
| No transition-at-18 content | Near-zero search volume; deprioritize | Skip |

---

## Strategic recommendation

**Go after Tier 2 (Georgia-specific) as the primary win, and pick up Tier 1 (generic) as a comprehensiveness side effect.**

Reasons:
1. **Tier 2 is reachable**: LOW competition + we already rank pos 36 = closing the gap to pos 5–7 is realistic with content depth, no link-building required.
2. **Tier 1 falls into our lap when we win Tier 2**: Google's topical-authority signal lifts the page on adjacent queries when it sees comprehensive coverage. We don't need to write "for the generic searcher" — winning Georgia comprehensively will get us partial credit on generic queries too.
3. **The .gov page can't be displaced on Tier 1 anyway**. But it has no FAQ, no benefits detail, no income explanation — so we can rank #2–#3 just below it, which is the realistic best case.
4. **The CPC data confirms commercial value**: $9.09 CPC on Georgia-anchored queries means each click has real-world dollar value. Even at pos 5–7, this page becomes a strong family-acquisition channel.

### Target SERP outcomes (3-month horizon)

| Query | Current pos | Target pos | Volume captured |
|---|---:|---:|---:|
| katie beckett waiver georgia | 36 | 4–7 | ~15–25 clicks/mo |
| katie beckett ga | 35 | 4–7 | ~15–25 clicks/mo |
| katie beckett medicaid georgia | 39 | 4–7 | ~10–20 clicks/mo |
| katie beckett income limits | 57 | 8–12 | ~3 clicks/mo |
| how to apply for katie beckett in georgia | n/a | 4–7 | ~2–4 clicks/mo |
| katie beckett renewal | n/a | 10–15 | ~1–2 clicks/mo |
| **Total target uplift** | — | — | **~50–80 clicks/mo** |

That's vs current ~3 clicks/mo from this page. **~17–25× uplift** if the rewrite executes.
