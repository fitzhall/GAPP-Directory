# Phase 5: County Enrichment — Metro Atlanta & Regional Centers

**Goal:** Enrich the top 30-40 highest-traffic county pages with unique local content, DFCS office info, and honest provider coverage context.

**File:** `app/[county]/page.tsx` (single file — all changes are to the `COUNTY_CONTEXT` and `COUNTY_REGIONS` objects)

## Current State

- `COUNTY_CONTEXT` has ~30 entries (metro Atlanta + major regional centers)
- ~130 counties use the generic fallback (no "About" section rendered, generic metadata)
- `COUNTY_REGIONS` has ~45 entries for nearby county links
- Existing entries are decent but lack DFCS office info and some feel generic

## Plan

### Task 1: Extract COUNTY_CONTEXT to separate data file

**Why:** The `COUNTY_CONTEXT` object will grow to 159 entries. Keeping it inline in page.tsx makes the file unmanageable (already 715 lines). Extract to a data file.

**Steps:**
1. Create `lib/county-data.ts` with:
   - Export `COUNTY_CONTEXT` (the Record type stays the same)
   - Export `COUNTY_REGIONS` (the neighboring counties map)
   - Export `GEORGIA_COUNTIES` array (currently duplicated in page.tsx and sitemap.ts)
   - Export `formatCountyName()` helper
2. Update `app/[county]/page.tsx` to import from `lib/county-data.ts`
3. Update `app/sitemap.ts` to import `GEORGIA_COUNTIES` from `lib/county-data.ts` (remove duplication)
4. Run `npm run build` to verify no breakage

**Acceptance:** Build passes. County pages render identically. No duplicate county arrays.

### Task 2: Enhance existing metro Atlanta entries (10 counties)

**Counties:** fulton, gwinnett, cobb, dekalb, clayton, cherokee, forsyth, henry, douglas, rockdale

**For each county, update the description to include:**
- DFCS office city (e.g., "The Fulton County DFCS office in Atlanta handles GAPP intake")
- Actual provider count from the database if available, or remove vague "many providers" language
- One genuinely unique local fact (hospital system, population characteristic, growth pattern)
- Remove any AI-sounding language ("wide range of", "excellent access to", "strong healthcare infrastructure")

**Quality gate:** Each description must pass ANTI-AI-STYLE-GUIDE.md. Max 2-3 sentences. No promotional language.

**Acceptance:** 10 metro entries enhanced with DFCS info and unique facts. All pass anti-AI checklist.

### Task 3: Enhance existing regional center entries (20 counties)

**Counties:** chatham, richmond, muscogee, bibb, dougherty, lowndes, hall, clarke, whitfield, floyd, houston, columbia, glynn, liberty, troup, bartow, paulding, newton, fayette, coweta

**Same enhancement pattern as Task 2:**
- DFCS office city/location
- Honest provider density statement
- One unique local fact
- Remove AI-sounding language from existing descriptions

**Acceptance:** 20 regional entries enhanced. All pass anti-AI checklist.

### Task 4: Add remaining metro-adjacent counties (10-15 new entries)

**Target counties not yet in COUNTY_CONTEXT:**
- walton, barrow, jackson, carroll, spalding, butts, pike, lamar, heard, meriwether
- Plus any other counties in COUNTY_REGIONS that don't have COUNTY_CONTEXT entries

**For each, create a new entry:**
```typescript
'county-slug': {
  region: 'Region Name',
  cities: ['City1', 'City2'],
  description: '2-3 sentences with locally-specific fact'
}
```

**Quality gate:** Each description contains at least one fact specific to that county. Not variable-swapped from another county.

**Acceptance:** 10-15 new entries added. Each has a unique, verifiable fact. All pass anti-AI checklist.

### Task 5: Add COUNTY_REGIONS entries for new counties

**For each new COUNTY_CONTEXT entry from Task 4:**
- Add a `COUNTY_REGIONS` entry with 4-5 accurate neighboring counties
- Verify bidirectional: if A lists B as neighbor, B should list A

**Acceptance:** All new counties have neighbor entries. No orphan references.

### Task 6: Build verification

1. Run `npm run build` — must pass with zero errors
2. Spot-check 5 county pages in dev to verify "About" section renders
3. Verify metadata generation works for enhanced counties (check page source)
4. Count: confirm 40-45 total COUNTY_CONTEXT entries

**Acceptance:** Build passes. County pages render correctly. 40+ entries in COUNTY_CONTEXT.

## Execution Order

```
Task 1 (extract data file) → Task 2 + Task 3 (can parallelize) → Task 4 → Task 5 → Task 6
```

Tasks 2 and 3 are independent and can be done in parallel since they modify different entries.

## Requirements Coverage

| Requirement | Task(s) | How |
|-------------|---------|-----|
| CNTY-01 | Tasks 2-4 | Top 40 counties get entries (remaining 120 in Phase 6) |
| CNTY-02 | Tasks 2-4 | Each description has locally-specific fact |
| CNTY-03 | Tasks 2-4 | Anti-AI checklist enforced per description |
| CNTY-04 | Tasks 2-3 | Metro counties get DFCS office info |
| CNTY-05 | Task 4 | Rural adjacent counties state coverage gaps honestly |
| QUAL-01 | All | Anti-AI checklist on all content |
| QUAL-02 | All | Parent-advocate voice |
| QUAL-03 | Tasks 2-4 | Descriptions include actionable context (where to go, what to expect) |

## Risk

- **DFCS office data accuracy:** Web search may not return current phone numbers. Use city names only if phone can't be verified. Never fabricate.
- **File size:** 40+ entries is manageable in a separate data file. Full 159 entries (Phase 6) will need review.
- **Build time:** 159 static county pages already generate. Adding context data won't increase build time meaningfully.

---
*Plan created: 2026-03-09*
