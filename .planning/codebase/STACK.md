# Technology Stack

**Analysis Date:** 2026-03-07

## Languages

**Primary:**
- TypeScript 5.x - All application code (strict mode enabled in `tsconfig.json`)

**Secondary:**
- SQL - Database schema and migrations (`supabase/schema.sql`)
- CSS - Global styles via Tailwind (`app/globals.css`)

## Runtime

**Environment:**
- Node.js (version not pinned, no `.nvmrc` or `.node-version` present)
- Next.js runtime (server components + API routes run server-side)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.5 (App Router) - Full-stack framework, server and client components
- React 18.3.1 - UI library
- Tailwind CSS 3.3.x - Utility-first CSS framework

**Build/Dev:**
- SWC (via Next.js) - TypeScript compilation and minification (`swcMinify: true` in `next.config.js`)
- PostCSS 8.x + Autoprefixer - CSS processing (`postcss.config.js`)
- tsx 4.21.x - Script runner for `scripts/` directory (dev dependency)
- dotenv 17.2.x - Environment variable loading for scripts (dev dependency)

**Testing:**
- Not detected. No test framework, config, or test files present.

**Linting:**
- ESLint 8.x with `eslint-config-next` 14.2.5

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` ^2.57.4 - Database client (PostgreSQL via Supabase)
- `next` 14.2.5 - Application framework
- `resend` ^6.6.0 - Transactional email delivery (lead notifications, availability pings, admin alerts)

**UI Utilities:**
- `clsx` ^2.1.0 - Conditional className construction
- `tailwind-merge` ^2.2.0 - Tailwind class deduplication (used via `cn()` helper in `lib/utils.ts`)

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Target: ES5, module: ESNext, bundler resolution
- `scripts/` directory excluded from compilation

**Next.js:**
- Config: `next.config.js`
- React strict mode enabled
- SWC minification enabled
- No custom webpack config, rewrites, or redirects

**Tailwind:**
- Config: `tailwind.config.ts`
- Custom brand colors: `primary` (coral #FF8A80), `accent` (sky blue #87CEEB), `warm` (peach #FFCBA4), `navy` (#2C3E50)
- Custom font family: Nunito (loaded via `next/font/google` in `app/layout.tsx`)
- Content paths: `./pages/**`, `./components/**`, `./app/**`

**Vercel:**
- Config: `vercel.json`
- Framework: nextjs
- Two cron jobs configured (see INTEGRATIONS.md)

**Environment Variables (from `.env.example`):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (client-exposed)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (client-exposed)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-only)
- `RESEND_API_KEY` - Email service key
- `NEXT_PUBLIC_BASE_URL` - Canonical site URL
- `CRON_SECRET` - Vercel cron authentication
- `ADMIN_PASSWORD` - Single-password admin auth (legacy)
- `ADMIN_USERS` - Multi-user admin auth (JSON array)
- `WHOP_API_KEY` - Payment platform API key
- `WHOP_WEBHOOK_SECRET` - Webhook signature verification
- `WHOP_VERIFIED_PRODUCT_ID` - Whop product ID for verified tier
- `WHOP_PREMIUM_PRODUCT_ID` - Whop product ID for premium tier

## Analytics

- Google Analytics 4 (GA4) - Measurement ID `G-QSHSPFWHFF` hardcoded in `app/layout.tsx`
- Loaded via `next/script` with `afterInteractive` strategy

## Platform Requirements

**Development:**
- Node.js (LTS recommended, no version pinned)
- npm
- Supabase project with schema applied (`supabase/schema.sql`)
- `.env.local` with Supabase credentials

**Production:**
- Vercel (auto-deploys from `main` branch)
- Supabase hosted PostgreSQL
- Resend account with verified domain (`georgiagapp.com`)
- Whop account with products configured
- Environment variables set in Vercel dashboard

## Utility Scripts

Located in `scripts/` (run with `tsx`):
- `scripts/seed-providers.ts` - Seed providers from CSV
- `scripts/import-appendix-p.ts` - Import provider data from Appendix P document
- `scripts/fix-provider-status.ts` - Bulk status corrections
- `scripts/update-counties.ts` - Update county data
- `scripts/verify-one-per-county.ts` - Ensure one verified provider per county

---

*Stack analysis: 2026-03-07*
