# GeorgiaGAPP SEO Gameplan — June 11, 2026

## The Desktop Position Mystery — SOLVED

Desktop avg position (17.4) vs mobile (8.9) is **not a ranking problem — it's an impression-mix artifact.**

28-day device data from GSC:

| | Desktop | Mobile |
|---|---|---|
| Clicks | 58 | 85 |
| Impressions | 3,410 | 2,440 |
| CTR | 1.7% | 3.5% |
| Avg position | 17.4 | 8.9 |

**Why desktop "never moves":**
1. Desktop gets ~40% MORE impressions, and the bulk of them come from a long tail of
   national informational queries where we rank pages 3–10: Katie Beckett variants
   ("what is katie beckett program" pos 99, "katie beckett medicaid" pos 75–89) and
   national paid-caregiver queries ("getting paid as a family caregiver" pos 96,
   including out-of-state noise like "north platte" and "nikiski").
2. Every new deep-position impression drags the average DOWN even while core terms hold #1.
   As the Katie Beckett page gains topical authority and shows up for more national
   queries, the average gets anchored. **Growing visibility looks like a stuck average.**
3. Mobile average is flattered by high-impression pos-1 queries (a news-style query at
   pos 1.0 with 88 impressions) plus provider brand-name searches.

**Proof there's no desktop penalty:** "gapp providers" = pos 1.1 desktop (54% CTR),
"gapp provider" = pos 1.0 desktop. Per-query deltas between devices go BOTH directions
(e.g. "gapp" is 38 desktop / 14 mobile, but "georgia pediatric program" is 39 desktop / 54 mobile).
That's SERP-feature/local-pack noise, not a technical problem.

**Action: stop watching average position.** Track a fixed basket of core queries instead
(see Measurement section). Average position will likely get WORSE as impressions grow — that's fine.

---

## Priority 1 — High-intent content gaps (build these)

### 1A. "Get Paid as a Family Caregiver in Georgia" hub ⭐ HIGHEST LEAD VALUE
The single most conversion-relevant cluster we're losing. All GA-specific, all parent-intent,
all currently ranking 40–75:
- "does georgia pay family caregivers" — pos 62 desktop
- "how much does georgia pay family caregivers" — pos 51
- "can a spouse be paid as a caregiver in georgia" — pos 71
- "can i get paid to care for my child/father/mother in georgia" — pos 42–83
- "get paid to care for disabled child georgia" — pos 54–55

These parents become paid caregivers THROUGH GAPP PCS — this is our exact funnel.
`/gapp-paid-caregiver` already ranks 5.4 mobile for "gapp paid caregiver" but doesn't
match the broader "georgia family caregiver pay" intent.

**Build:** A hub page targeting "get paid to be a family caregiver in Georgia" with
H2 sections answering each variant (spouse, parent, child; pay rates; how long approval
takes), FAQ schema, CTA into the screener/directory. Interlink with /gapp-paid-caregiver.

### 1B. GAPP Pediatric Nursing Services page
"gapp pediatric nursing services" — 71 impr desktop pos 58, 4 impr mobile pos 61
(~124 impressions/28d total). `/pediatric-home-nursing-georgia` (2,856 words) exists but
doesn't match this GAPP-specific phrasing.

**Build:** `/gapp-nursing-services` — what RN/LPN skilled nursing under GAPP covers, hours,
eligibility, how it differs from PCS, directory CTA filtered to nursing providers.
Link from homepage, /georgia-pediatric-program, /gapp-services-explained.

### 1C. Katie Beckett hub-and-spoke split
The 6,621-word `/katie-beckett-waiver-georgia` page is trying to rank for ~40 query variants
and lands pos 30–90 on nearly all of them. Split into spokes, keep the main page as hub:
- `/katie-beckett-income-limits` (pos 19 desktop currently)
- `/katie-beckett-application` ("katie beckett application" pos 25–59, "how long does it take to get approved for katie beckett" pos 12)
- `/what-does-katie-beckett-cover` (pos 32–80, incl. "does katie beckett cover dental" pos 4!)
- `/katie-beckett-vs-gapp` (natural companion to existing /gapp-vs-ccsp)

### 1D. Strengthen program-entity queries
"georgia pediatric program" (78 impr, pos 39 desktop), "gapp program georgia" (64 impr, pos 52),
"gapp" (56 impr, pos 38). We rank #1 for "gapp providers" but ~38 for "gapp" — Google sees us
as a directory, not a program authority. DCH owns the official-program intent; realistic goal
is pos 38 → 10–15.
- Organization + WebSite schema on homepage; FAQPage schema sitewide where FAQs exist
- Tighten /georgia-pediatric-program title to lead with "Georgia Pediatric Program (GAPP)"
- Internal links: every content page should link "Georgia Pediatric Program (GAPP)" → that page

### 1E. Medically-fragile daycare cluster (already winning — push to top 5)
- "daycare for children with health conditions" pos 8.7 desktop ✅
- "daycare for infants with medical needs" pos 9.2 ✅
- "medically fragile daycare near me" pos 10.6
- "daycare for medically fragile children" pos 33 desktop / 54 mobile ← the head term lags

Refresh `/medically-fragile-children-care` + `/sick-child-care-georgia`: align H1/title to the
head term, add a "daycare vs in-home GAPP care" comparison section, interlink the two pages.

---

## Priority 2 — CTR & conversion quick wins (this week)

1. **/gapp-approval-timeline title/meta rewrite** — 348 impr at pos 6.2 but 1.44% CTR.
   Should be 4–6%. Test: "GAPP Approval Timeline 2026: How Long It Really Takes (Week by Week)"
2. **Callback form: county field broken** — every lead saves `county: "Unknown"`. Fix capture.
3. **Callback form: no dedup** — CJ Talgo submitted twice in 35 min. Add phone-based dedup or
   "already requested" state.
4. **Stale SUPABASE_SERVICE_ROLE_KEY in .env.local** — rotated; update it.

---

## Priority 3 — Authority (ongoing)

- The pos-1.0 mobile news query (88 impr) proves fresh/newsy content ranks fast.
  Publish a monthly "GAPP Program Updates" post (rate changes, DCH announcements, waitlist news).
- Backlink targets: GA special-needs parent groups, children's hospital resource pages,
  Medicaid navigator orgs, provider associations.
- Provider profiles now rank pos 1–2 for provider brand names (SDC Health Services etc.)
  and earn clicks — add more interlinks between profiles and content pages both directions.

---

## Measurement — fixed query basket (check weekly, per device)

| Query | Desktop now | Mobile now | 60-day target |
|---|---|---|---|
| gapp providers | 1.1 | 47.7* | hold 1 / top 10 |
| gapp | 38.3 | 14.5 | top 20 / top 10 |
| georgia pediatric program | 39.3 | 54.0 | top 15 |
| gapp pediatric nursing services | 58.3 | 61.0 | top 10 (new page) |
| does georgia pay family caregivers | 62.4 | 54.3 | top 10 (new hub) |
| daycare for medically fragile children | 33.2 | 53.9 | top 10 |
| katie beckett waiver georgia | 37.0 | 53.0 | top 15 (hub/spoke) |
| gapp approval timeline (page CTR) | 1.44% CTR | — | 4%+ CTR |

*"gapp providers" mobile pos 47.7 vs desktop 1.1 is the one genuine device anomaly —
likely local-pack displacement on mobile. Check the live mobile SERP once.

## Sequencing
- **Week 1:** P2 quick wins (form fixes, title rewrites, schema) + start 1A caregiver hub
- **Week 2:** 1B nursing services page + 1D entity/internal-link pass
- **Week 3–4:** 1C Katie Beckett split + 1E daycare refresh
- **Monthly:** news post + basket review
