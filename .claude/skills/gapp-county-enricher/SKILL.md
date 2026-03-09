---
name: gapp-county-enricher
description: "Enrich GeorgiaGAPP.com county pages with unique local content, DFCS office info, and provider context. This skill should be used when the user says 'enrich counties', 'enrich [county name]', 'county enrichment', 'make county pages unique', 'county SEO', or 'improve county pages'. Handles single counties or batch processing. For new content pages, see gapp-content-writer."
argument-hint: [county-name or 'all']
---

# GAPP County Enricher

Make county pages genuinely unique by adding local DFCS office info, area-specific GAPP context, and neighboring county links. Each county must have content that could not be produced by swapping city names in a template.

## Before starting

1. Read `app/[county]/page.tsx` to understand the `COUNTY_CONTEXT` structure
2. Read `ANTI-AI-STYLE-GUIDE.md` for content quality rules
3. Note which counties already have context entries vs using the generic fallback

## Modes

**Single county:** `/gapp-county-enricher fulton` — enrich one county
**Batch:** `/gapp-county-enricher all` — process all 159, in batches of 10-15

For batch mode, prioritize metro counties and regional centers first. Present each batch for review before continuing.

## What to add per county

Each `COUNTY_CONTEXT` entry:

```typescript
'county-slug': {
  region: 'Region Name',
  cities: ['City1', 'City2'],
  description: '2-3 sentences about GAPP access here'
}
```

**Enhance descriptions with:**

1. **Local DFCS office** — city where the office is, phone number if verifiable
2. **Provider density** — metro with many providers, or rural where families need neighboring counties? Be honest about gaps.
3. **Neighboring counties** — 1-2 that share providers, so families know to expand search
4. **Area-specific detail** — what makes GAPP access here different (hospital systems, distance to Atlanta, population)

## Content quality rules

- 2-3 sentences max per description
- State facts plainly: "Fulton County has 47 GAPP providers" not "boasts a vibrant network"
- Use "is" and "has", not "serves as" or "features"
- No promotional language, no "nestled in", no "in the heart of"
- If coverage is low, say so: "Telfair County has limited GAPP provider coverage. Families here often use providers based in Laurens or Dodge County."
- Max 1 AI vocabulary word per description
- No three-adjective clusters

## Uniqueness requirement

Each description must contain at least one fact specific to that county. Generic text adds no SEO value.

Good: "The DFCS office in Statesboro handles GAPP intake for Bulloch County. Two agencies currently serve this area, with additional providers available from neighboring Chatham County."

Bad: "Bulloch County families have access to quality GAPP providers serving the community."

## After enrichment

Run `npm run build` to verify no TypeScript errors. Review each description — it should be distinguishable from every other county.
