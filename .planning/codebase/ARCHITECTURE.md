# Architecture

**Analysis Date:** 2026-03-07

## Pattern Overview

**Overall:** Next.js App Router monolith with Supabase BaaS (Backend-as-a-Service)

**Key Characteristics:**
- Server-side rendered pages by default, client components only for interactivity (forms, filters, nav)
- No dedicated backend -- Supabase handles database, auth (RLS), and storage directly
- API routes handle side effects (email via Resend, webhook processing) rather than data access
- SEO-heavy architecture with static generation for county pages and content pages
- Two-tier provider system: free (claimed) vs paid (verified/featured) with Whop payment integration

## Layers

**Presentation Layer (Pages):**
- Purpose: Render UI, fetch data server-side, handle routing
- Location: `app/` (Next.js App Router)
- Contains: Page components (`.tsx`), layouts, metadata generation
- Depends on: `lib/supabase.ts`, `components/`, `types/provider.ts`
- Used by: End users (families, providers, admins)

**Component Layer:**
- Purpose: Reusable UI components shared across pages
- Location: `components/`
- Contains: `ProviderCard.tsx`, `CallbackForm.tsx`, `MobileNav.tsx`, `JsonLd.tsx`, `MiniScreener.tsx`, `PaginatedProviderList.tsx`, `CountiesSection.tsx`
- Depends on: `types/provider.ts`, `lib/utils.ts`
- Used by: Page components in `app/`

**API Layer:**
- Purpose: Handle mutations, webhooks, cron jobs, and admin operations
- Location: `app/api/`
- Contains: Route handlers (POST/GET) for callbacks, claims, search, admin actions, webhooks, cron
- Depends on: Supabase (service role), Resend (email)
- Used by: Client components (fetch), Vercel cron, Whop webhooks

**Data Access Layer:**
- Purpose: Query builders, transformers (snake_case DB -> camelCase TypeScript)
- Location: `lib/supabase.ts`
- Contains: `getProviders()`, `getProviderBySlug()`, `getFeaturedProviders()`, `getActiveCounties()`, `createCallbackRequest()`, transform functions
- Depends on: `@supabase/supabase-js`, `types/provider.ts`
- Used by: Pages (server-side), API routes

**Configuration Layer:**
- Purpose: Centralized site configuration, tier definitions, service types, quiz questions
- Location: `lib/config.ts`
- Contains: `config` object, helper functions (`getTierName()`, `getServiceLabel()`, etc.)
- Depends on: Nothing
- Used by: Pages, components, layouts

**Type Layer:**
- Purpose: TypeScript interfaces for all domain objects
- Location: `types/`
- Contains: `provider.ts` (Provider, ProviderCardData, CallbackRequest, ProviderFilters, QuizAnswers), `member.ts` (legacy generic template)
- Depends on: Nothing
- Used by: Everything

## Data Flow

**Family Searches for Provider:**
1. Family visits `/directory` (client component) or `/{county}` (server component)
2. Page fetches all active providers from Supabase via `lib/supabase.ts`
3. Client-side filtering by county, service, search query (in `/directory`)
4. OR server-side filtering via `.contains('counties_served', [county])` (in `/{county}`)
5. Results rendered as `ProviderCard` components, sorted by tier (featured first)

**Family Requests Callback:**
1. Family fills `CallbackForm` on `/provider/[slug]` page
2. Form POSTs to `/api/callback/route.ts`
3. API inserts row into `callback_requests` table via Supabase service role
4. API sends HTML email to provider via Resend
5. Admin views leads at `/admin/leads`

**Provider Claims Profile:**
1. Provider visits `/claim/[slug]` or `/claim/t/[token]` (token-based claim link)
2. Submits claim form with email, name, phone, optional profile updates
3. POSTs to `/api/claim/route.ts`
4. API updates provider: `is_claimed = true`, `claimed_by_email`, profile changes
5. Admin reviews at `/admin` and can verify/feature

**Payment Webhook (Whop):**
1. Provider pays via Whop checkout
2. Whop sends webhook to `/api/webhooks/whop/route.ts`
3. Webhook verifies HMAC signature, parses event type
4. On `membership.went_valid`: finds provider by email, upgrades `tier_level`, sets `is_verified`/`is_featured`
5. On `membership.went_invalid`: downgrades provider, removes verification
6. If provider not found: stores in `pending_upgrades` table for manual processing

**Availability Ping (Cron):**
1. Vercel cron triggers `/api/cron/availability-ping` every Monday at 2pm UTC
2. API generates unique tokens for each verified provider, stores in `availability_tokens` table
3. Sends email via Resend with "Yes, I'm Available" / "Not This Week" links
4. Provider clicks link -> `/availability/[token]` page processes response
5. Follow-up cron (`/api/cron/availability-followup`) runs daily, resets stale availability

**State Management:**
- No global state management library (no Redux, Zustand, etc.)
- Server components fetch data directly from Supabase at render time
- Client components use React `useState`/`useEffect` for local state
- Admin auth stored in `sessionStorage` (not secure -- see CONCERNS.md)

## Key Abstractions

**Provider:**
- Purpose: Central domain entity representing a GAPP home care agency
- Examples: `types/provider.ts` (interface), `lib/supabase.ts` (queries), `components/ProviderCard.tsx` (display)
- Pattern: Full `Provider` interface for detail pages, lightweight `ProviderCardData` for listings

**Tier System:**
- Purpose: Controls visibility, features, and ranking of providers
- Examples: `lib/config.ts` (tier definitions), `components/ProviderCard.tsx` (conditional rendering by claim/verify/feature status)
- Pattern: Numeric `tierLevel` (0-3) + boolean flags (`isClaimed`, `isVerified`, `isFeatured`) drive card appearance and sorting
- Ranking: Featured+Verified (5) > Verified (4) > Featured-only (2) > Claimed (1) > Unclaimed (0)

**snake_case to camelCase Transform:**
- Purpose: Bridge between Supabase (snake_case columns) and TypeScript (camelCase properties)
- Examples: `lib/supabase.ts` `transformProvider()`, inline transforms in `app/directory/page.tsx`, `app/provider/[slug]/page.tsx`, `app/[county]/page.tsx`
- Pattern: Manual property-by-property mapping. **This is duplicated across multiple files** -- the same transform exists in at least 4 places.

**County System:**
- Purpose: Geographic organization for provider discovery and SEO
- Examples: `app/[county]/page.tsx` (159 static county pages), `provider-counties.json`, hardcoded `GEORGIA_COUNTIES` arrays
- Pattern: Dynamic route catch-all with static params generation, county context metadata for SEO

## Entry Points

**Homepage:**
- Location: `app/page.tsx`
- Triggers: Root URL `/`
- Responsibilities: Hero with search/quiz CTAs, eligibility screener CTA, county browse grid

**Directory:**
- Location: `app/directory/page.tsx`
- Triggers: `/directory` URL, quiz results redirect
- Responsibilities: Client-side provider search with county/service filters, pagination

**Provider Profile:**
- Location: `app/provider/[slug]/page.tsx`
- Triggers: `/provider/{slug}` URL
- Responsibilities: Full provider detail, callback form (verified), claim CTA (unclaimed), SEO metadata

**County Pages:**
- Location: `app/[county]/page.tsx`
- Triggers: `/{county}` URL (e.g., `/fulton`)
- Responsibilities: County-specific provider listing, SEO content, nearby county links, mini screener

**Admin Panel:**
- Location: `app/admin/` (layout.tsx provides auth gate)
- Triggers: `/admin`, `/admin/leads`, `/admin/requests`, `/admin/guide`
- Responsibilities: Provider management (verify/feature/toggle), lead management, listing request review

**API - Callback:**
- Location: `app/api/callback/route.ts`
- Triggers: POST from `CallbackForm` component
- Responsibilities: Save lead to DB, send email notification to provider

**API - Whop Webhook:**
- Location: `app/api/webhooks/whop/route.ts`
- Triggers: Whop payment events
- Responsibilities: Upgrade/downgrade providers based on payment status

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Wraps all pages
- Responsibilities: Navigation, footer, Google Analytics, Organization schema, font loading

## Error Handling

**Strategy:** Console logging + user-friendly error states. No centralized error handling.

**Patterns:**
- API routes: try/catch blocks returning `NextResponse.json({ error: string }, { status: number })`
- Data fetching: `console.error()` + `throw error` or return empty arrays
- Client components: `status` state machine (`idle` | `submitting` | `success` | `error`) with inline error messages
- Email failures: Logged but not propagated -- lead is still saved even if email fails
- Webhook failures: Unmatched providers stored in `pending_upgrades` for manual review

## Cross-Cutting Concerns

**Logging:** `console.error()` and `console.log()` throughout. No structured logging framework. Vercel captures these in deployment logs.

**Validation:** Inline validation in API route handlers (check required fields, return 400). No validation library (no Zod, no Yup). Client-side validation uses HTML `required` attributes + manual checks.

**Authentication:**
- Admin: Password-based via `ADMIN_PASSWORD` or `ADMIN_USERS` (JSON) env vars. Auth state stored in `sessionStorage`. No JWT, no cookies, no middleware protection.
- Provider: Claim flow uses email verification. Token-based claim links (`/claim/t/[token]`).
- Public: No auth required. RLS handles read access.

**SEO:**
- `generateMetadata()` on all key pages for dynamic meta tags
- Schema.org structured data via `components/JsonLd.tsx` (Organization, MedicalBusiness, Breadcrumb, FAQ)
- `app/sitemap.ts` and `app/robots.ts` for search engine crawling
- Canonical URLs pointing to `www.georgiagapp.com`
- `generateStaticParams()` on county pages for static generation

**Payments:** Whop webhook integration at `/api/webhooks/whop/route.ts`. HMAC signature verification. Product name matching to determine tier upgrade.

**Email:** Resend SDK. Used for: callback notifications to providers, availability pings, admin emails (upgrade prompts, live notifications). HTML email templates inline in API routes.

---

*Architecture analysis: 2026-03-07*
