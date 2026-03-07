# Codebase Concerns

**Analysis Date:** 2026-03-07

## Tech Debt

**No Analytics/Tracking Infrastructure for Provider Dashboards:**
- Issue: Premium providers want analytics dashboards (clicks, impressions, callback counts), but there is zero tracking infrastructure. Google Analytics is site-wide only (`app/layout.tsx` line 74) with no per-provider event tracking. No database tables exist for page views, click events, or impression counts.
- Files: `app/layout.tsx`, `app/provider/[slug]/page.tsx`, `supabase/schema.sql`
- Impact: Cannot build provider analytics dashboards without first creating event tracking tables, API endpoints for recording events, and client-side event emitters. This is a prerequisite for the premium analytics feature.
- Fix approach: Create `provider_events` table (provider_id, event_type, metadata, created_at) with RLS. Add a `/api/events/track` endpoint. Emit events from provider profile pages (view), callback form (submission), directory listings (impression), and phone/website clicks (click). Then build dashboard views on top.

**Tier Level Inconsistency:**
- Issue: `tier_level` semantics conflict between `supabase/schema.sql` and API routes. Schema comment says "0 = Verified Free, 1 = Featured $99/mo" but `app/api/claim/route.ts` line 80 uses "0=unclaimed, 1=claimed, 2=verified, 3=premium" and `app/api/admin/verify-provider/route.ts` line 49 uses the same 0-3 scheme. The admin page toggleFeatured at line 291-294 sets tier_level to 0 or 1. These are incompatible numbering systems.
- Files: `supabase/schema.sql` (line 44), `app/api/claim/route.ts` (line 80), `app/api/admin/verify-provider/route.ts` (line 49), `app/api/webhooks/whop/route.ts` (lines 110-126), `app/admin/page.tsx` (lines 291-294)
- Impact: A provider claimed via the claim API gets tier_level=1, but the admin panel interprets tier_level=1 as "Featured". The Whop webhook sets tier_level=2 for verified and tier_level=3 for premium, but the admin panel only toggles between 0 and 1. Sorting by tier_level in `lib/supabase.ts` (line 56) produces unpredictable ordering.
- Fix approach: Standardize on the 0-3 scheme (unclaimed/claimed/verified/premium). Update `supabase/schema.sql` comments and add a CHECK constraint. Update admin panel toggleFeatured to use correct levels. Add a `tier_level` enum or constant map in `lib/config.ts`.

**Dead Code in `lib/data.ts`:**
- Issue: File exports an empty array with a comment saying "This file is no longer used." Still imported nowhere but occupies space and confuses new developers.
- Files: `lib/data.ts`
- Impact: Minor confusion. Low priority.
- Fix approach: Delete the file.

**`provider_inquiries` Table Referenced But Not in Schema:**
- Issue: `app/api/providers/register/route.ts` line 37 inserts into `provider_inquiries` table, but this table does not exist in `supabase/schema.sql` or any migration file. The code silently catches the error (line 52: "If table doesn't exist, just continue with email").
- Files: `app/api/providers/register/route.ts` (lines 35-53), `supabase/schema.sql`
- Impact: Provider registration data is silently lost. Only the email notification survives.
- Fix approach: Either create the `provider_inquiries` table via migration, or merge this functionality with the existing `listing_requests` table from migration 005.

**`pending_upgrades` Table Referenced But Not in Schema:**
- Issue: `app/api/webhooks/whop/route.ts` line 83 inserts into `pending_upgrades` table when a Whop payment comes in for an unrecognized email. This table does not exist in any migration.
- Files: `app/api/webhooks/whop/route.ts` (lines 82-92)
- Impact: Whop payments from unrecognized emails silently fail to store. Manual processing is impossible since the data is lost.
- Fix approach: Create `pending_upgrades` table via migration with columns: email, product_id, product_name, event_type, raw_data (JSONB), status, created_at.

**Duplicate Transform Logic:**
- Issue: Provider data transformation (snake_case DB columns to camelCase TypeScript) is duplicated across at least 3 locations: `lib/supabase.ts` (transformProvider function), `app/provider/[slug]/page.tsx` (inline transform at lines 32-63), and `app/api/search/route.ts` (inline map at lines 29-39). Each has slightly different field selections.
- Files: `lib/supabase.ts` (lines 175-208), `app/provider/[slug]/page.tsx` (lines 32-63), `app/api/search/route.ts` (lines 29-39)
- Impact: Adding a new provider field requires updating multiple locations. Risk of inconsistency.
- Fix approach: Use `lib/supabase.ts` transformProvider as the single source of truth. Import and use it everywhere.

## Security Considerations

**Admin Authentication is Client-Side Only (Critical):**
- Risk: Admin auth stores `admin_auth=true` in `sessionStorage` (`app/admin/layout.tsx` line 23). The admin page directly queries Supabase using the anon key (`app/admin/page.tsx` line 5 imports from `lib/supabase.ts` which uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`). The RLS policy on providers is `USING (true) WITH CHECK (true)` for all modifications (schema.sql line 136). This means ANY user can modify ANY provider record by calling the Supabase API directly with the publicly-exposed anon key.
- Files: `app/admin/layout.tsx` (lines 22-29), `app/admin/page.tsx` (line 5, line 222-225), `supabase/schema.sql` (lines 134-137), `lib/supabase.ts` (line 9)
- Current mitigation: The sessionStorage check hides the admin UI, but provides no actual security. The Supabase anon key is exposed in client-side JavaScript.
- Recommendations: (1) Replace the anon-key RLS policy with a proper auth-based policy requiring Supabase Auth. (2) Move all admin write operations to API routes that verify admin credentials server-side. (3) Use the service role key only in server-side API routes, never on the client.

**Admin API Routes Have No Authentication (Critical):**
- Risk: Admin API routes like `/api/admin/verify-provider`, `/api/admin/update-provider`, `/api/admin/send-upgrade-email`, and `/api/admin/send-live-email` accept POST requests with no authentication whatsoever. Anyone can verify a provider, send emails, or modify provider data by calling these endpoints directly.
- Files: `app/api/admin/verify-provider/route.ts`, `app/api/admin/update-provider/route.ts`, `app/api/admin/send-upgrade-email/route.ts`
- Current mitigation: None. The `/api/admin/auth` route exists but is only called by the client-side login form. No other admin route checks for authentication.
- Recommendations: Add middleware or a shared `verifyAdminAuth()` function that all admin API routes call before processing. Use a signed JWT or session token rather than sessionStorage.

**SQL Injection via Search (Medium):**
- Risk: User search input is interpolated directly into Supabase `.or()` filter strings without sanitization. In `lib/supabase.ts` line 46: `query.or(\`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%\`)` and `app/api/search/route.ts` line 22: `.or(\`name.ilike.%${query}%,city.ilike.%${query}%\`)`. A crafted search string containing PostgREST filter syntax (e.g., commas, parentheses, periods) could manipulate the query.
- Files: `lib/supabase.ts` (line 46), `app/api/search/route.ts` (line 22)
- Current mitigation: Supabase PostgREST does some escaping, but the `.or()` string concatenation bypasses parameterized queries.
- Recommendations: Sanitize search input to strip PostgREST metacharacters (`,`, `.`, `(`, `)`) or use Supabase's `.textSearch()` / `.ilike()` per-column instead of string concatenation in `.or()`.

**XSS in Email Templates (Medium):**
- Risk: User-submitted data (parentName, phone, email, specialNeeds, agencyName, message, etc.) is interpolated directly into HTML email templates without escaping. A user submitting `<script>` tags or HTML in the "special needs" field would have it rendered in the email.
- Files: `app/api/callback/route.ts` (lines 113-201), `app/api/claim/route.ts` (lines 142-227), `app/api/listing-request/route.ts` (lines 92-162), `app/api/providers/register/route.ts` (lines 58-195)
- Current mitigation: None. All template strings use raw `${variable}` interpolation.
- Recommendations: Create an `escapeHtml()` utility function and apply it to all user-provided data before inserting into email HTML templates.

**Update-Provider Uses Anon Key Instead of Service Role:**
- Risk: `app/api/admin/update-provider/route.ts` line 6-8 explicitly uses the anon key with a comment "Using anon key since service role has issues". This means the update operation relies on the permissive RLS policy rather than proper service role access.
- Files: `app/api/admin/update-provider/route.ts` (lines 5-8)
- Current mitigation: The overly-permissive RLS policy allows it to work, but this is a workaround, not a fix.
- Recommendations: Fix the service role key configuration issue and use service role for all admin operations.

**Callback Requests RLS Too Permissive:**
- Risk: The `callback_requests` table RLS policy allows ALL operations (SELECT, UPDATE, DELETE) with `USING (true)` (schema.sql line 146-148). Anyone with the anon key can read all callback requests including family phone numbers, emails, and medical needs.
- Files: `supabase/schema.sql` (lines 145-148)
- Current mitigation: None. Sensitive family data (PII) is readable by anyone.
- Recommendations: Restrict SELECT/UPDATE/DELETE to service role only. The INSERT policy for public access is correct.

**No Rate Limiting on Any Endpoint:**
- Risk: No rate limiting exists on any API route. The callback form, claim endpoint, search API, and admin auth can all be spammed without restriction.
- Files: All files in `app/api/`
- Current mitigation: None.
- Recommendations: Add rate limiting via Vercel Edge middleware or a simple in-memory/Redis-based limiter. Priority endpoints: `/api/callback` (email spam), `/api/admin/auth` (brute force), `/api/claim` (abuse).

## Performance Bottlenecks

**Admin Page Loads All Providers at Once:**
- Problem: `app/admin/page.tsx` fetches ALL providers on mount with `supabase.from('providers').select('*')` (no limit, no pagination at the database level). Client-side pagination, filtering, and sorting happen in JavaScript after loading the full dataset.
- Files: `app/admin/page.tsx` (lines ~130-160)
- Cause: With 327+ providers, this loads all records into client memory. As the directory grows, this will degrade.
- Improvement path: Add server-side pagination and filtering. Use Supabase `.range()` and pass filter parameters to the query.

**`getActiveCounties()` Fetches All Providers:**
- Problem: To get a list of active counties, `lib/supabase.ts` line 120 fetches ALL active providers' `counties_served` arrays, then flattens and deduplicates in JavaScript.
- Files: `lib/supabase.ts` (lines 119-133)
- Cause: No database-level aggregation of counties.
- Improvement path: Create a Supabase function or materialized view that returns distinct counties. Or cache the result since counties change infrequently.

**No Caching on Provider Queries:**
- Problem: Every page load hits Supabase directly. Provider data changes infrequently but is fetched fresh every time.
- Files: `lib/supabase.ts`, `app/provider/[slug]/page.tsx`, `app/directory/page.tsx`
- Cause: No Next.js ISR, no cache headers, no SWR/React Query on client-side fetches.
- Improvement path: Use Next.js `revalidate` on server components, or add `Cache-Control` headers on API routes. Consider ISR with revalidation for provider profile pages.

## Fragile Areas

**Availability Ping System:**
- Files: `app/api/cron/availability-ping/route.ts`, `app/api/cron/availability-followup/route.ts`, `app/availability/[token]/page.tsx`, `vercel.json`
- Why fragile: The availability system sends emails to ALL verified providers every Monday, each requiring a token insert and email send in a sequential loop (line 70). If any email fails, that provider is skipped. If the cron job times out (Vercel has a 10-second limit on hobby plan), some providers never get pinged. The 7-day expiry resets availability for non-responders, potentially hiding active providers.
- Safe modification: Add batch processing with error recovery. Log failed sends for retry. Consider a queue-based approach.
- Test coverage: No tests exist for any cron job.

**Whop Webhook Integration:**
- Files: `app/api/webhooks/whop/route.ts`
- Why fragile: Provider matching relies on email address equality (line 77). If a provider signs up for Whop with a different email than their directory listing, the webhook fails silently. The `pending_upgrades` table doesn't exist (see Tech Debt above), so unmatched payments are lost. Product tier determination relies on string matching of product names (lines 104-136), which breaks if product names change in Whop.
- Safe modification: Add a provider lookup by claimed_by_email as fallback. Create the pending_upgrades table. Use product IDs (env vars) as primary matching, not product names.
- Test coverage: No tests.

**Claim Flow Slug Generation:**
- Files: `app/api/claim/route.ts` (lines 88-93), `app/api/admin/update-provider/route.ts` (lines 10-16, 42-44)
- Why fragile: When a provider updates their business name during claim, a new slug is generated. If the new slug collides with an existing provider's slug, the update will fail due to the UNIQUE constraint. Neither endpoint checks for slug uniqueness before updating.
- Safe modification: Add slug collision detection and append a suffix (e.g., `-2`) if needed.
- Test coverage: No tests.

## Scaling Limits

**Email Sending in Request Loops:**
- Current capacity: Works for ~327 providers
- Limit: Vercel serverless function timeout (10s hobby, 60s pro). The availability ping cron sends emails sequentially in a for-loop. At ~1 email per 200ms, ~50 emails would hit the 10s limit.
- Scaling path: Use Resend batch API, or implement a queue (Vercel KV + cron) to process in chunks.

**Single Supabase Client Instance:**
- Current capacity: Works at current traffic levels
- Limit: `lib/supabase.ts` creates a single module-level Supabase client that is shared across all server-side operations (including client-side via Next.js bundling). This works but doesn't leverage Supabase server-side auth helpers.
- Scaling path: Use `@supabase/ssr` package for proper server/client separation. Create per-request clients in server components.

## Missing Critical Features

**No Provider Analytics Infrastructure:**
- Problem: Premium providers are requesting analytics dashboards to track listing performance. There is no event tracking, no analytics tables, no click/view counting, and no dashboard UI.
- Blocks: Cannot offer analytics as a premium feature. Cannot demonstrate ROI to paying providers. Cannot track which listings generate the most engagement.

**No Provider Self-Service Portal:**
- Problem: Providers cannot log in to manage their own listings. All changes go through the admin panel. There is no provider authentication system.
- Blocks: Providers cannot update their own profiles, view their leads, or access analytics. Every change requires admin intervention.

**No Input Validation Library:**
- Problem: All API routes do manual field-presence checks (e.g., `if (!body.parentName || !body.phone)`). No schema validation (Zod, Yup, etc.) for request bodies. No phone/email format validation.
- Blocks: Invalid data can enter the database. No consistent error messages for invalid input.

## Test Coverage Gaps

**Zero Tests:**
- What's not tested: The entire codebase has no test files. No unit tests, no integration tests, no E2E tests. No test runner is configured (no jest.config, no vitest.config, no playwright.config).
- Files: Every file in the project
- Risk: Any code change could break existing functionality without detection. The admin auth bypass, RLS policies, tier level logic, email sending, webhook processing, and cron jobs are all untested.
- Priority: High. Start with API route tests (especially `/api/admin/auth`, `/api/callback`, `/api/webhooks/whop`) and add E2E tests for critical flows (claim, callback, admin verify).

---

*Concerns audit: 2026-03-07*
