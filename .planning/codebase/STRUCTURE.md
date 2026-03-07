# Codebase Structure

**Analysis Date:** 2026-03-07

## Directory Layout

```
directory-starter-template/
├── app/                              # Next.js App Router (pages + API)
│   ├── page.tsx                      # Homepage
│   ├── layout.tsx                    # Root layout (nav, footer, GA, fonts)
│   ├── globals.css                   # Global styles
│   ├── page-modern.tsx               # Unused alternate homepage design
│   ├── [county]/page.tsx             # Dynamic county pages (159 counties)
│   ├── directory/                    # Provider search/browse
│   │   ├── page.tsx                  # Main directory (client component)
│   │   ├── layout.tsx                # Directory layout
│   │   └── join/page.tsx             # Provider join CTA page
│   ├── provider/[slug]/page.tsx      # Individual provider profile
│   ├── providers/                    # "For Providers" landing
│   │   ├── page.tsx                  # Provider marketing/signup page
│   │   └── layout.tsx
│   ├── admin/                        # Admin panel (password-gated)
│   │   ├── layout.tsx                # Admin auth gate + navigation
│   │   ├── page.tsx                  # Provider management dashboard
│   │   ├── leads/page.tsx            # Callback request management
│   │   ├── requests/page.tsx         # Listing request review
│   │   ├── members/page.tsx          # Member management (legacy)
│   │   └── guide/page.tsx            # Admin guide/help
│   ├── claim/                        # Provider claim flow
│   │   ├── [slug]/page.tsx           # Claim by slug
│   │   └── t/[token]/page.tsx        # Claim by token (outreach links)
│   ├── quiz/                         # "Help Me Choose" quiz
│   │   ├── page.tsx                  # Multi-step matching quiz
│   │   └── layout.tsx
│   ├── screener/                     # GAPP eligibility screener
│   │   ├── page.tsx                  # Interactive eligibility check
│   │   └── layout.tsx
│   ├── availability/[token]/page.tsx # Provider availability response page
│   ├── request-listing/page.tsx      # New provider listing request form
│   ├── case-managers/                # Case manager portal
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api/                          # API route handlers
│   │   ├── callback/route.ts         # POST: Save lead + send email
│   │   ├── claim/route.ts            # POST: Provider claims profile
│   │   ├── search/route.ts           # GET: Provider search
│   │   ├── listing-request/route.ts  # POST: New provider listing request
│   │   ├── providers/
│   │   │   ├── register/route.ts     # POST: Provider registration
│   │   │   ├── [slug]/route.ts       # GET: Provider by slug
│   │   │   └── report-issue/route.ts # POST: Report provider issue
│   │   ├── admin/
│   │   │   ├── auth/route.ts         # POST: Admin login
│   │   │   ├── verify-provider/route.ts
│   │   │   ├── update-provider/route.ts
│   │   │   ├── members/route.ts
│   │   │   ├── send-upgrade-email/route.ts
│   │   │   └── send-live-email/route.ts
│   │   ├── members/
│   │   │   ├── route.ts              # Legacy member CRUD
│   │   │   └── [slug]/route.ts
│   │   ├── availability/
│   │   │   ├── validate/route.ts     # Validate availability token
│   │   │   └── respond/route.ts      # Process availability response
│   │   ├── case-managers/
│   │   │   └── search/route.ts       # Case manager provider search
│   │   ├── webhooks/
│   │   │   └── whop/route.ts         # Whop payment webhook
│   │   └── cron/
│   │       ├── availability-ping/route.ts     # Weekly availability email
│   │       └── availability-followup/route.ts # Daily follow-up
│   ├── services/                     # Service-type SEO pages
│   │   ├── rn-nursing/page.tsx
│   │   ├── lpn-services/page.tsx
│   │   └── personal-care/page.tsx
│   └── [SEO content pages]/          # Static content for organic search
│       ├── gapp-providers-georgia/page.tsx
│       ├── gapp-approval-guide/page.tsx
│       ├── gapp-approval-timeline/page.tsx
│       ├── gapp-home-care/page.tsx
│       ├── gapp-medicaid-requirements/page.tsx
│       ├── georgia-pediatric-program/page.tsx
│       ├── how-it-works/page.tsx
│       ├── katie-beckett-waiver-georgia/page.tsx
│       ├── medically-fragile-children-care/page.tsx
│       ├── pediatric-home-nursing-georgia/page.tsx
│       ├── waivers/page.tsx
│       └── why-gapp-applications-get-denied/page.tsx
├── components/                       # Shared React components
│   ├── ProviderCard.tsx              # Provider listing card (3 variants: unclaimed/claimed/verified)
│   ├── CallbackForm.tsx              # Lead capture form (client component)
│   ├── MobileNav.tsx                 # Mobile hamburger menu (client component)
│   ├── JsonLd.tsx                    # Schema.org structured data components
│   ├── MiniScreener.tsx              # Inline eligibility screener widget
│   ├── PaginatedProviderList.tsx     # Client-side paginated provider grid
│   ├── CountiesSection.tsx           # Counties served display with expand/collapse
│   ├── MemberCard.tsx                # Legacy generic member card (unused)
│   └── admin/
│       └── ui/                       # Admin-specific UI components
│           └── StatsCard.tsx
├── lib/                              # Shared utilities and data access
│   ├── supabase.ts                   # Supabase client + query functions + transforms
│   ├── config.ts                     # Site configuration (tiers, services, badges, quiz)
│   └── utils.ts                      # Utility functions (cn() for Tailwind)
├── types/                            # TypeScript type definitions
│   ├── provider.ts                   # Provider, ProviderCardData, CallbackRequest, ProviderFilters, QuizAnswers
│   └── member.ts                     # Legacy generic member types (template artifact)
├── supabase/                         # Database schema and migrations
│   ├── schema.sql                    # Full schema (source of truth)
│   ├── seed.sql                      # Sample provider data
│   ├── verify-one-per-county.sql     # One-time verification script
│   └── migrations/
│       ├── 001_add_claimed_status.sql
│       ├── 002_add_availability.sql
│       ├── 003_add_suspension_tracking.sql
│       ├── 004_claim_tokens_and_issues.sql
│       ├── 005_listing_requests.sql
│       ├── 006_verification_tracking.sql
│       └── add_claimer_details.sql
├── scripts/                          # One-off utility scripts (run with tsx)
│   ├── seed-providers.ts             # Import providers from CSV
│   ├── import-appendix-p.ts          # Import from Appendix P document
│   ├── update-counties.ts            # Update county data
│   ├── verify-one-per-county.ts      # Auto-verify one provider per county
│   └── fix-provider-status.ts        # Fix verification status issues
├── configs/                          # Example/alternate configurations
│   └── fire-safety.ts                # Example config for different niche
├── styles/                           # Additional style files
├── public/                           # Static assets
│   ├── logo.png                      # Site logo
│   ├── og-image.png                  # OpenGraph preview image
│   ├── favicon.ico                   # Favicons
│   └── llms.txt                      # LLM context file
├── docs/                             # Documentation
│   └── plans/                        # Implementation plans
├── CLAUDE.md                         # AI assistant context (comprehensive)
├── HANDOFF.md                        # Session handoff document
├── provider-counties.json            # County geographic data
├── unclaimed-providers-for-outreach.csv  # Seed data source
├── package.json
├── tsconfig.json                     # TypeScript config (path alias: @/* -> ./*)
├── tailwind.config.ts                # Tailwind with brand colors
├── next.config.js                    # Next.js config (minimal)
├── vercel.json                       # Vercel config (cron schedules)
└── postcss.config.js
```

## Directory Purposes

**`app/`:**
- Purpose: All pages, layouts, and API routes (Next.js App Router convention)
- Contains: Page components (`page.tsx`), layouts (`layout.tsx`), API handlers (`route.ts`)
- Key files: `app/layout.tsx` (root layout with nav/footer), `app/page.tsx` (homepage)

**`app/api/`:**
- Purpose: Server-side API endpoints for mutations and integrations
- Contains: Route handlers organized by domain (callback, claim, admin, webhooks, cron)
- Key files: `app/api/callback/route.ts` (lead capture), `app/api/webhooks/whop/route.ts` (payments)

**`components/`:**
- Purpose: Reusable UI components shared across pages
- Contains: Provider display, forms, navigation, SEO schema components
- Key files: `ProviderCard.tsx` (most complex -- 3 rendering modes), `CallbackForm.tsx` (lead capture)

**`lib/`:**
- Purpose: Data access, configuration, and utilities
- Contains: Supabase client/queries, site config, helper functions
- Key files: `supabase.ts` (all DB access), `config.ts` (tiers, services, quiz)

**`types/`:**
- Purpose: TypeScript interfaces for domain objects
- Contains: Provider types, callback request types, filter types
- Key files: `provider.ts` (primary types used everywhere)

**`supabase/`:**
- Purpose: Database schema definition and migrations
- Contains: SQL files for schema, seeds, and incremental migrations
- Key files: `schema.sql` (full schema, source of truth)

**`scripts/`:**
- Purpose: One-off utility scripts for data management
- Contains: Seeding, importing, fixing provider data
- Run with: `npx tsx scripts/[script].ts`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout (nav, footer, analytics, fonts)
- `app/page.tsx`: Homepage
- `app/directory/page.tsx`: Main provider search (client component)
- `app/provider/[slug]/page.tsx`: Provider detail page (server component)
- `app/[county]/page.tsx`: County landing pages (server component, statically generated)

**Configuration:**
- `lib/config.ts`: Site name, tiers, services, badges, quiz questions
- `tailwind.config.ts`: Brand colors (primary/coral, accent/blue, warm/peach, navy)
- `tsconfig.json`: Path alias `@/*` -> `./*`
- `vercel.json`: Cron job schedules (availability ping Monday 2pm, followup daily 2pm)
- `next.config.js`: Minimal (strict mode, SWC minify)

**Core Logic:**
- `lib/supabase.ts`: All database queries, data transformation layer
- `app/api/callback/route.ts`: Lead capture + email notification
- `app/api/webhooks/whop/route.ts`: Payment processing + tier upgrades
- `app/api/admin/auth/route.ts`: Admin authentication
- `app/api/cron/availability-ping/route.ts`: Weekly provider availability check

**Data/Schema:**
- `supabase/schema.sql`: Full database schema (providers, callback_requests, RLS policies)
- `types/provider.ts`: TypeScript type definitions
- `provider-counties.json`: Georgia county geographic data
- `unclaimed-providers-for-outreach.csv`: Original seed data (327 providers)

**SEO:**
- `components/JsonLd.tsx`: Schema.org structured data (Organization, MedicalBusiness, Breadcrumb, FAQ)
- `app/[county]/page.tsx`: 159 statically generated county pages with regional context

## Naming Conventions

**Files:**
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js convention)
- Components: `PascalCase.tsx` (e.g., `ProviderCard.tsx`, `CallbackForm.tsx`)
- Lib modules: `camelCase.ts` (e.g., `supabase.ts`, `config.ts`, `utils.ts`)
- Types: `camelCase.ts` (e.g., `provider.ts`, `member.ts`)
- Scripts: `kebab-case.ts` (e.g., `seed-providers.ts`, `fix-provider-status.ts`)
- SQL migrations: `NNN_description.sql` (e.g., `001_add_claimed_status.sql`)

**Directories:**
- Routes: `kebab-case` (e.g., `gapp-approval-guide/`, `request-listing/`)
- Dynamic routes: `[param]` (e.g., `[county]`, `[slug]`, `[token]`)
- API grouping: `kebab-case` (e.g., `case-managers/`, `availability-ping/`)

**Database:**
- Tables: `snake_case` (e.g., `providers`, `callback_requests`)
- Columns: `snake_case` (e.g., `counties_served`, `is_verified`, `tier_level`)
- TypeScript properties: `camelCase` (e.g., `countiesServed`, `isVerified`, `tierLevel`)

## Where to Add New Code

**New Page (public-facing):**
- Create `app/{page-name}/page.tsx`
- Add SEO metadata via `export const metadata` or `generateMetadata()`
- For content/SEO pages: server component, static content, internal links
- Add to footer navigation in `app/layout.tsx` if appropriate

**New API Route:**
- Create `app/api/{domain}/{action}/route.ts`
- Use lazy-initialized Supabase client with service role for mutations: `createClient(url, SUPABASE_SERVICE_ROLE_KEY)`
- Return `NextResponse.json()` with appropriate status codes
- Follow existing pattern: validate inputs, try/catch, console.error on failure

**New Component:**
- Create `components/{ComponentName}.tsx`
- Use `'use client'` directive only if component needs interactivity (state, effects, event handlers)
- Import types from `@/types/provider`
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes

**New Provider Feature (e.g., Analytics Dashboard):**
- Types: Add interfaces to `types/provider.ts`
- Database: Add migration to `supabase/migrations/007_*.sql`
- Data access: Add query functions to `lib/supabase.ts` or create new `lib/{feature}.ts`
- API routes: `app/api/{feature}/route.ts`
- UI pages: `app/{feature}/page.tsx` (or under `app/admin/` for admin features)
- Components: `components/{FeatureComponent}.tsx`

**New Admin Page:**
- Create `app/admin/{page-name}/page.tsx`
- Auth is handled by `app/admin/layout.tsx` (wraps all admin routes)
- Add nav link in `app/admin/layout.tsx` `navLinks` array
- Use `supabase` client from `@/lib/supabase` (uses anon key; switch to service role in API routes for privileged ops)

**New Database Table:**
- Create migration: `supabase/migrations/NNN_description.sql`
- Update `supabase/schema.sql` to keep it as source of truth
- Add TypeScript types to `types/provider.ts` or new type file
- Add RLS policies in the migration
- Add query functions to `lib/supabase.ts`

**New Cron Job:**
- Create `app/api/cron/{job-name}/route.ts`
- Add schedule to `vercel.json` `crons` array
- Protect with `CRON_SECRET` verification (see `availability-ping` pattern)

## Special Directories

**`supabase/migrations/`:**
- Purpose: Incremental database schema changes
- Generated: No (manually written SQL)
- Committed: Yes
- Note: Run manually in Supabase SQL Editor. No automated migration runner.

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes (by `npm run build`)
- Committed: No

**`node_modules/`:**
- Purpose: Package dependencies
- Generated: Yes (by `npm install`)
- Committed: No

**`public/`:**
- Purpose: Static assets served at root URL
- Generated: No
- Committed: Yes
- Note: Large image files (logo 4MB, og-image 5MB, apple-touch-icon 5.7MB)

**`configs/`:**
- Purpose: Example configurations for different directory niches
- Generated: No
- Committed: Yes
- Note: Contains `fire-safety.ts` as template example. Not used by the live GAPP site.

**`docs/plans/`:**
- Purpose: Implementation planning documents
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-07*
