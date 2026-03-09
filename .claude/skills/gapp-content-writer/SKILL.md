---
name: gapp-content-writer
description: "Create SEO-optimized content pages for GeorgiaGAPP.com. This skill should be used when creating new content pages, writing SEO pages, adding pages for target keywords, or when the user says 'write a page about [topic]', 'new content page', 'create SEO page', or 'add page for [keyword]'. Handles the full pipeline: page creation, metadata, schemas, sitemap, internal linking, and anti-AI content quality."
---

# GAPP Content Writer

Create complete, publish-ready Next.js content pages for GeorgiaGAPP.com following established patterns, anti-AI quality checks, and full SEO infrastructure.

## Before writing

1. Read `ANTI-AI-STYLE-GUIDE.md` in the project root for content quality rules
2. Read `references/anti-ai-vocabulary.md` in this skill directory for the banned word list
3. Read `app/sitemap.ts` to check existing routes and avoid keyword cannibalization
4. Read an existing content page (e.g. `app/gapp-respite-care/page.tsx`) to match the exact template

## Page creation workflow

### Step 1: Generate page file

Create `app/[slug]/page.tsx` with this exact structure:

**Imports:** `Link` from next/link, `Metadata` from next, `config` from @/lib/config, `FAQPageSchema` and `BreadcrumbSchema` from @/components/JsonLd

**FAQ array:** 5-7 questions. Parent-advocate voice. Direct answers, no AI filler.

**Metadata export:**
- `title`: 55-60 characters, primary keyword near front
- `description`: 150-160 characters, keyword + value prop
- `keywords`: primary + 3-5 secondary
- `openGraph`: title, description, type: 'article'
- `alternates.canonical`: `https://www.georgiagapp.com/[slug]`

**Page component:**
- `FAQPageSchema` + `BreadcrumbSchema` (invisible, top of component)
- Hero section: `bg-gradient-to-b from-blue-50 to-white`, h1 in sentence case
- Body: `max-w-3xl mx-auto`, h2 sections in sentence case, short paragraphs
- FAQ display section: `bg-gray-50`
- CTA section: link to `/directory` or `/screener`
- Disclaimer: `config.contact.disclaimer`

### Step 2: Add to sitemap

Add entry to the SEO Content Expansion section of `app/sitemap.ts` with priority 0.8 and changeFrequency 'monthly'.

### Step 3: Wire internal links

**In the new page:** Include 3+ internal links — always `/directory`, plus 1-2 related content pages or county pages.

**In existing pages:** Add links back from 2+ existing pages (footer, related resources sections, or body text).

### Step 4: Anti-AI quality check

**Banned phrases:** "serves as", "stands as", "is a testament", "plays a crucial role", "ensuring", "fostering", "showcasing", "highlighting", "nestled", "in the heart of", "vibrant", "boasts", "it's important to note", "not only X but also Y"

**Limits:** Max 1 AI vocab word per paragraph. Max 1-2 em dashes per page. No three-adjective clusters.

**Voice:** Sentence case headings. "Your kid" where natural. Parent-to-parent tone. Every paragraph answers "what do I do next?" Final paragraph = next step, not summary.

**Structure:** No "challenges and future prospects". No "in conclusion". Prose over decorated bullet lists. Short paragraphs (2-4 sentences). "Is" not "serves as". "Has" not "features".

### Step 5: Build verification

Run `npm run build` to verify the page compiles.

## Writing guidelines

**Hook:** Open with a specific scenario or direct statement. Never "In today's..." or a generic definition.

**Body:** State facts plainly. Real numbers, timelines, phone numbers. If you can't name the source, don't cite it.

**FAQ answers:** Direct. "Yes, you can switch at any time" not "The GAPP program offers families the flexibility to transition between providers."

**CTA:** Link to `/directory`, `/screener`, or a county page. Give the reader something to do now.
