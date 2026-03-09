# Phase 8: First Blog Posts & Internal Linking

**Goal:** Publish 3 blog posts targeting GSC-identified SERP gaps, wire bidirectional internal links.

**Requirements:** POST-01 through POST-05, LINK-01, LINK-02, QUAL-01 through QUAL-03

---

## Blog Post Topics (from GSC data)

### Post 1: "Childcare options for medically fragile children in Georgia"
- **Slug:** `childcare-medically-fragile-children-georgia`
- **Targets:** daycare for medically fragile (6 imp, pos 78), sick child care (27 imp, pos 50), daycare for children with health conditions (6 imp, pos 10), medically fragile daycare near me (14 imp, pos 10)
- **Combined impressions:** 53
- **Internal links to:** /directory, /screener, /gapp-services-explained, county pages (fulton, gwinnett, cobb)
- **Category:** Family Resources

### Post 2: "What does GAPP stand for? A plain-English guide to Georgia's pediatric program"
- **Slug:** `what-does-gapp-stand-for`
- **Targets:** what does gapp stand for (5 imp, pos 6), gapp program (6 imp, pos 60), georgia pediatric program (15 imp, pos 48), gapp georgia (4 imp, pos 38)
- **Combined impressions:** 30
- **Internal links to:** /georgia-pediatric-program, /gapp-approval-guide, /how-to-apply-for-gapp, /screener
- **Category:** GAPP Guide

### Post 3: "Home health aides vs. GAPP nursing: what's the difference?"
- **Slug:** `home-health-aides-vs-gapp-nursing`
- **Targets:** home health aides for medically fragile children (12 imp, pos 74), medically fragile children homecare (4 imp, pos 9), home care for medically fragile children (2 imp, pos 78)
- **Combined impressions:** 18
- **Internal links to:** /services/rn-nursing, /services/lpn-services, /gapp-services-explained, /directory
- **Category:** GAPP Guide

---

## Task Breakdown

### Task 1: Write all 3 blog posts as page.tsx files

Each post follows the blog template pattern from Phase 7:
- Content as JSX in `app/blog/[slug]/page.tsx` — but since we use a dynamic route, posts will be separate content files imported by the dynamic route
- Actually: create each post as a content component, and update blog-data.ts registry

**Architecture:** Since `app/blog/[slug]/page.tsx` already exists as a dynamic route, we need to either:
a) Add post content inline to the registry (too messy), or
b) Create content components per post and import them in the dynamic route

**Decision:** Create `lib/blog-posts/` directory with one TSX content component per post. The dynamic route imports them by slug.

### Task 2: Register posts in `lib/blog-data.ts`

Add all 3 posts to the BLOG_POSTS array with metadata.

### Task 3: Update `app/blog/[slug]/page.tsx` to render post content

Import content components and render them in the post body section.

### Task 4: Add FAQPageSchema to each post (5-7 questions each)

### Task 5: Bidirectional internal linking

Add links FROM existing pages TO blog posts:
- /gapp-services-explained → Post 3
- /georgia-pediatric-program → Post 2
- /gapp-approval-guide → Post 1

### Task 6: Build verification

---

## Quality Gates

Every post must pass ANTI-AI-STYLE-GUIDE.md checklist:
- No more than 1 AI vocabulary word per paragraph
- No "-ing" phrases as fake analysis
- Sentence case headings
- Parent-to-parent voice
- Final paragraph = actionable next step
- Max 1-2 em dashes per article
- Scannable by a stressed parent in 30 seconds

---

*Plan created: 2026-03-09*
