# Phase 7: Blog Infrastructure

**Goal:** Build the `/blog` system — index page, post layout with Article schema, content data model, and sitemap integration.

**Requirements:** BLOG-01 through BLOG-05, LINK-01, LINK-02

---

## Architecture Decision: Content Storage

**Choice: File-based TypeScript data objects** (like existing content pages)
- Matches current codebase pattern — no new dependencies
- Blog posts as individual page.tsx files under `app/blog/[slug]/`
- Post metadata defined in a central `lib/blog-data.ts` registry
- No MDX, no database table, no new packages needed
- Migrate to Supabase CMS later if needed (Phase 8+ concern)

---

## Task Breakdown

### Task 1: Blog data model (`lib/blog-data.ts`)

Create the blog post registry with metadata for all posts.

**Create `lib/blog-data.ts`:**
```typescript
export interface BlogPost {
  slug: string
  title: string
  description: string
  author: string
  publishedAt: string      // ISO date
  updatedAt?: string       // ISO date
  readingTime: string      // e.g. "6 min read"
  category: string         // e.g. "GAPP Guide", "Family Resources"
  keywords: string[]
  featured?: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  // Phase 8 will populate this — leave empty array for now
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
```

**Depends on:** Nothing
**Verify:** TypeScript compiles, functions return expected shapes

---

### Task 2: Blog index page (`app/blog/page.tsx`)

**Create `app/blog/page.tsx`:**
- Static `export const metadata: Metadata` with title "GAPP Blog — Tips for Georgia Families", description, canonical, openGraph
- Import `getAllBlogPosts()` from `lib/blog-data.ts`
- Render `BreadcrumbSchema` (Home → Blog)
- Hero section: heading + subheading explaining blog purpose
- Post listing: cards with title, description, date, reading time, category badge
- Empty state: "Blog posts coming soon" message when array is empty
- Link each card to `/blog/[slug]`

**Design notes:**
- Max-width container (match existing `max-w-3xl` pattern)
- Cards: white bg, rounded-lg, shadow-sm, hover state
- Category badge: small pill with category name
- Date format: "March 9, 2026" (human-readable)

**Depends on:** Task 1
**Verify:** Page renders at `/blog`, shows empty state, metadata correct

---

### Task 3: Blog post layout (`app/blog/[slug]/page.tsx`)

**Create `app/blog/[slug]/page.tsx`:**
- `generateStaticParams()` — returns slugs from `BLOG_POSTS`
- `generateMetadata()` — dynamic metadata from post data (title, description, canonical, openGraph type: 'article')
- Render `ArticleSchema` (already exists in `components/JsonLd.tsx`) with headline, description, datePublished, dateModified, author
- Render `BreadcrumbSchema` (Home → Blog → Post Title)
- Post header: title (h1), author, published date, reading time, category badge
- Post body: `{children}` or content section (Phase 8 fills actual content)
- Bottom section: "Related posts" placeholder + CTA back to blog index
- Back to blog link at top

**Key pattern:** Each blog post will be its own `app/blog/[slug]/page.tsx` file in Phase 8. This task creates the shared layout pattern and the dynamic route that reads from the registry.

**For Phase 7 (infrastructure only):** The `[slug]/page.tsx` should handle the case where `BLOG_POSTS` is empty by returning `notFound()` for any slug.

**Depends on:** Task 1
**Verify:** Route exists, returns 404 for unknown slugs, `generateStaticParams` works with empty array

---

### Task 4: Sitemap integration

**Edit `app/sitemap.ts`:**
- Import `getAllBlogPosts()` from `lib/blog-data.ts`
- Add blog index: `{ url: '.../blog', priority: 0.8, changeFrequency: 'weekly' }`
- Map blog posts: `{ url: '.../blog/${slug}', priority: 0.7, changeFrequency: 'monthly' }`
- Add under a `// Blog` comment section

**Depends on:** Task 1
**Verify:** `npm run build` generates sitemap with blog routes

---

### Task 5: Footer blog link

**Edit `app/layout.tsx`:**
- Add "Blog" link to the Resources column in the footer
- Place it logically near the top of the Resources list (high-value internal link)

**Depends on:** Task 2 (blog page must exist)
**Verify:** Footer renders blog link, link navigates to `/blog`

---

### Task 6: Homepage blog reference

**Edit `app/page.tsx`:**
- Add a "From our blog" or "Latest resources" section
- Placement: after the existing content sections, before the footer
- Show: heading + brief text + link to `/blog`
- Keep it minimal — just a CTA section, not a full post listing
- When no posts exist: show "Resources coming soon" or skip section entirely

**Depends on:** Task 2
**Verify:** Homepage renders blog reference section

---

### Task 7: Build verification

- Run `npm run build` — must pass with zero errors
- Verify all 6 success criteria from ROADMAP:
  1. `/blog` index page exists with post listing sorted by date
  2. Blog post template renders with Article schema, author, date, reading time
  3. Posts have generateMetadata, canonical URLs, openGraph
  4. Blog routes appear in sitemap.ts
  5. Footer includes blog link
  6. Build passes

**Depends on:** All previous tasks
**Verify:** `npm run build` succeeds, manual review of output

---

## Execution Order

```
Task 1 (data model)
  ├── Task 2 (blog index) ──── Task 5 (footer link)
  ├── Task 3 (post layout)     Task 6 (homepage reference)
  └── Task 4 (sitemap)
                          └── Task 7 (build verification)
```

Tasks 2, 3, 4 can run in parallel after Task 1.
Tasks 5, 6 can run in parallel after Task 2.
Task 7 runs last.

---

## Files Created/Modified

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `lib/blog-data.ts` | Blog post registry and helpers |
| CREATE | `app/blog/page.tsx` | Blog index page |
| CREATE | `app/blog/[slug]/page.tsx` | Blog post template/layout |
| EDIT | `app/sitemap.ts` | Add blog routes |
| EDIT | `app/layout.tsx` | Add blog to footer |
| EDIT | `app/page.tsx` | Add blog reference section |

---

*Plan created: 2026-03-09*
*Phase 7 of v1.2 — County Enrichment & Blog System*
