# External Integrations

**Analysis Date:** 2026-03-07

## APIs & External Services

**Payment Processing:**
- Whop - Subscription payments for provider tier upgrades
  - SDK/Client: Raw HTTP (no SDK, webhook-based)
  - Webhook endpoint: `app/api/webhooks/whop/route.ts`
  - Auth: `WHOP_API_KEY`, `WHOP_WEBHOOK_SECRET` (HMAC-SHA256 signature verification)
  - Product IDs: `WHOP_VERIFIED_PRODUCT_ID`, `WHOP_PREMIUM_PRODUCT_ID`
  - Checkout URLs (hardcoded in `app/api/admin/send-upgrade-email/route.ts`):
    - Verified: `https://whop.com/bitcoin-estate-commission-inc/verfied-tier/`
    - Premium: `https://whop.com/bitcoin-estate-commission-inc/premium-listing/`
  - Events handled: `membership.went_valid`, `payment.succeeded`, `membership.created`, `checkout.completed`, `membership.went_invalid`, `membership.cancelled`, `subscription.cancelled`
  - On payment: matches customer email to provider record, upgrades `tier_level` and sets `is_verified`/`is_featured`
  - On cancellation: downgrades provider to `tier_level: 0`, removes verified/featured flags
  - Unmatched payments stored in `pending_upgrades` table for manual processing

**Email Service:**
- Resend - Transactional email delivery
  - SDK: `resend` npm package ^6.6.0
  - Auth: `RESEND_API_KEY` (env var, starts with `re_`)
  - From addresses:
    - `GeorgiaGAPP.com <leads@georgiagapp.com>` - Lead notification emails
    - `GeorgiaGAPP <noreply@georgiagapp.com>` - System emails (availability pings, claim confirmations, upgrade prompts)
    - `GeorgiaGAPP System <noreply@georgiagapp.com>` - Admin notification emails
  - Client instantiation pattern (lazy, server-only):
    ```typescript
    function getResend() {
      if (!process.env.RESEND_API_KEY) return null
      return new Resend(process.env.RESEND_API_KEY)
    }
    ```
  - Graceful degradation: all email sends wrapped in try/catch, failures logged but do not fail parent requests

**Email Types Sent:**
1. **Lead notifications** (`app/api/callback/route.ts`) - HTML email to provider when family requests callback
2. **Claim confirmation** (`app/api/claim/route.ts`) - Confirmation to provider + admin notification
3. **Availability ping** (`app/api/cron/availability-ping/route.ts`) - Weekly "Are you accepting cases?" with one-click response buttons
4. **Availability warning** (`app/api/cron/availability-followup/route.ts`) - 24hr warning before hiding from searches
5. **Suspension notice** (`app/api/cron/availability-followup/route.ts`) - Notification when hidden from searches + admin summary
6. **Upgrade prompt** (`app/api/admin/send-upgrade-email/route.ts`) - Upsell email with Whop checkout links
7. **Live notification** (`app/api/admin/send-live-email/route.ts`) - Notification when listing goes live

**Analytics:**
- Google Analytics 4 (GA4)
  - Measurement ID: `G-QSHSPFWHFF` (hardcoded in `app/layout.tsx`)
  - Integration: `next/script` with `afterInteractive` strategy
  - No custom events detected - standard pageview tracking only

## Data Storage

**Database:**
- Supabase (hosted PostgreSQL)
  - Project URL: `NEXT_PUBLIC_SUPABASE_URL` (client-exposed)
  - Connection: Two access levels
    - Anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) - Client-side queries, RLS-enforced
    - Service role key (`SUPABASE_SERVICE_ROLE_KEY`) - Server-side admin operations, bypasses RLS
  - Client: `@supabase/supabase-js` ^2.57.4
  - Schema: `supabase/schema.sql`

**Tables:**
- `providers` - Core provider directory (327 seeded records)
  - RLS: public SELECT where `is_active = true`, unrestricted modifications (admin auth handled at API level)
  - GIN indexes on `counties_served` and `services_offered` (TEXT[] columns)
  - B-tree indexes on `slug`, `tier_level`, `is_active`
- `callback_requests` - Family lead capture (callback form submissions)
  - RLS: public INSERT, service role manages reads/updates
  - FK to `providers(id)` with CASCADE delete
- `availability_tokens` - One-time tokens for weekly availability check-ins
  - Referenced in cron jobs but not in `schema.sql` (created separately)
  - Fields: `token`, `provider_id`, `expires_at`, `used_at`, `response`, `warning_sent_at`, `suspension_processed_at`
- `pending_upgrades` - Stores Whop payments that could not be matched to a provider
  - Referenced in webhook handler but not in `schema.sql` (created separately)

**Views:**
- `provider_cards` - Lightweight view for search result cards (subset of provider fields)

**Supabase Client Pattern:**
- Single client module: `lib/supabase.ts`
  - Exports singleton `supabase` client (anon key)
  - Exports query functions: `getProviders()`, `getProviderBySlug()`, `getProvidersByCounty()`, `getFeaturedProviders()`, `getActiveCounties()`, `createCallbackRequest()`
  - Transform functions convert snake_case DB rows to camelCase TypeScript types
- API routes create their own service-role clients inline:
  ```typescript
  function getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  ```

**File Storage:**
- Local filesystem only (static assets in `public/`)
- No Supabase Storage or S3 integration

**Caching:**
- None. No Redis, no in-memory cache, no ISR configuration detected.

## Authentication & Identity

**Admin Auth:**
- Custom password-based auth (`app/api/admin/auth/route.ts`)
- Two modes:
  1. Multi-user: `ADMIN_USERS` env var (JSON array of `{username, password, role}`)
  2. Single password fallback: `ADMIN_PASSWORD` env var
- No JWT, no sessions, no cookies - auth state managed client-side
- No Supabase Auth used

**Provider Auth:**
- None. Providers claim profiles via email verification flow but do not have login accounts.
- Availability responses use one-time tokens (not authenticated sessions)

**End User Auth:**
- None. Families submit forms without accounts.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, Bugsnag, or equivalent.

**Logs:**
- `console.log` / `console.error` throughout API routes
- Vercel function logs (accessible via Vercel dashboard)
- Structured logging pattern: key webhook events log parsed data objects

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Auto-deploys from `main` branch on GitHub (`fitzhall/GAPP-Directory`)
  - Framework detection: Next.js (set in `vercel.json`)

**CI Pipeline:**
- None detected. No GitHub Actions, no CircleCI, no test pipeline.

**Cron Jobs (Vercel Crons):**
- Configured in `vercel.json`:
  1. `GET /api/cron/availability-ping` - Every Monday at 2:00 PM UTC (`0 14 * * 1`)
     - Sends weekly availability check emails to all verified providers
     - Generates one-time tokens stored in `availability_tokens` table
     - Resets `is_available = false` for non-responders from previous week
  2. `GET /api/cron/availability-followup` - Daily at 2:00 PM UTC (`0 14 * * *`)
     - 24hr mark: sends warning email to non-responders
     - 48hr mark: sets `is_available = false`, `accepting_new_patients = false`, sends suspension notice
     - Sends admin summary email listing all suspended providers
- Auth: `CRON_SECRET` via `Authorization: Bearer <secret>` header

## Environment Configuration

**Required env vars (production):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key
- `RESEND_API_KEY` - Email delivery
- `NEXT_PUBLIC_BASE_URL` - Canonical URL (fallback: `https://georgiagapp.com`)
- `CRON_SECRET` - Cron job authentication
- `ADMIN_PASSWORD` or `ADMIN_USERS` - Admin panel access
- `WHOP_API_KEY` - Payment integration
- `WHOP_WEBHOOK_SECRET` - Webhook verification
- `WHOP_VERIFIED_PRODUCT_ID` - Product mapping
- `WHOP_PREMIUM_PRODUCT_ID` - Product mapping

**Secrets location:**
- Vercel dashboard (production)
- `.env.local` (local development, gitignored)
- `.env.example` provides template with placeholder values

## Webhooks & Callbacks

**Incoming:**
- `POST /api/webhooks/whop` (`app/api/webhooks/whop/route.ts`)
  - Receives Whop payment/subscription lifecycle events
  - Verifies HMAC-SHA256 signature via `whop-signature` or `x-whop-signature` header
  - Uses `crypto.timingSafeEqual` for constant-time comparison
  - Also responds to `GET` for Whop endpoint verification

**Outgoing:**
- None. No outgoing webhooks configured.

## SEO Infrastructure

**Sitemap:** Dynamic generation in `app/sitemap.ts`
**Robots.txt:** Dynamic generation in `app/robots.ts`
**Structured Data:** JSON-LD Organization schema via `components/JsonLd.tsx` (rendered in layout)
**Open Graph:** Full OG + Twitter Card metadata in `app/layout.tsx`
**Canonical:** `www.georgiagapp.com` (www subdomain is canonical)

---

*Integration audit: 2026-03-07*
