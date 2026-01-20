# Agent Handoff Document - GeorgiaGAPP.com

## Project Overview
GeorgiaGAPP.com is a directory of GAPP (Georgia Pediatric Program) providers - home health agencies that provide nursing care to medically fragile children in Georgia. The site helps families find providers and helps providers get listed/verified.

**Tech Stack:** Next.js 14, Supabase, Tailwind CSS, Resend (email), Whop (payments)

---

## Recent Session Summary (Jan 2025)

### Issues Fixed This Session

#### 1. Profile Editing During Claim Process
**Problem:** Providers couldn't update their business info (name, city, services) when claiming their listing.

**Solution:**
- Added expandable "Need to update your profile info?" section to `/app/claim/[slug]/page.tsx`
- Fields: business name, city, services (RN/LPN/PCS), counties served
- API at `/app/api/claim/route.ts` updated to handle `profileUpdates` object
- Admin email notification shows any profile changes

#### 2. New Listing Request Flow
**Problem:** Providers not in the directory had no way to request to be added.

**Solution:**
- New page: `/app/request-listing/page.tsx` - form for unlisted providers
- New API: `/app/api/listing-request/route.ts` - handles submissions
- New admin page: `/app/admin/requests/page.tsx` - review/approve/reject requests
- New migration: `/supabase/migrations/005_listing_requests.sql`
- **USER ALREADY RAN THIS MIGRATION**

#### 3. Auto-Verified Provider Issue
**Problem:** "Mack Lander LLC" showing as verified but never paid.

**Root Cause:** The seed script (`scripts/seed-providers.ts` line 189) set `is_verified: true` for all imported providers. Also, `scripts/verify-one-per-county.ts` auto-verified one provider per county.

**Recommended Fix (not yet applied):** User should run in Supabase:
```sql
UPDATE providers
SET
  is_verified = false,
  is_claimed = false,
  verified_at = NULL,
  accepting_new_patients = false,
  tier_level = 0
WHERE is_verified = true
  AND (claimed_by_email IS NULL OR claimed_by_email = '');
```

---

## SEO Work This Session

### Current Ranking Page
- `/gapp-providers-georgia` ranks #2 for "ga gapp providers"
- ~1,500 words, FAQ schema, strong internal linking

### New Page Created
- `/katie-beckett-waiver-georgia` - targeting "Katie Beckett waiver Georgia"
- Comprehensive guide: eligibility, application, vs GAPP comparison
- 10 FAQs with schema markup
- ~500 lines, strong internal links to GAPP directory

### Existing SEO Pages
| URL | Target Keyword |
|-----|---------------|
| `/gapp-providers-georgia` | GAPP providers Georgia (RANKING #2) |
| `/gapp-approval-guide` | how to get approved for GAPP |
| `/gapp-approval-timeline` | GAPP approval timeline |
| `/gapp-home-care` | GAPP home care Georgia |
| `/gapp-medicaid-requirements` | GAPP Medicaid requirements |
| `/medically-fragile-children-care` | medically fragile child care Georgia |
| `/waivers` | Georgia Medicaid waivers (general) |
| `/why-gapp-applications-get-denied` | GAPP denied |
| `/katie-beckett-waiver-georgia` | Katie Beckett waiver Georgia (NEW) |
| `/services/rn-nursing` | pediatric RN nursing Georgia |
| `/services/lpn-services` | GAPP LPN services |
| `/services/personal-care` | GAPP personal care services |

### Next SEO Priority
**Recommended:** Create `/pediatric-home-nursing-georgia` page
- Broader keyword that captures parents who don't know GAPP exists
- High commercial intent, less competitive than government sites
- Direct funnel to the provider directory

---

## Database Schema (Key Tables)

### providers
- `is_claimed` - boolean (has someone claimed this listing)
- `claimed_by_email` - text (email of person who claimed)
- `claimed_at` - timestamp
- `is_verified` - boolean (have they paid/been verified)
- `verified_at` - timestamp
- `tier_level` - integer (0=unclaimed, 1=claimed, 2=verified, 3=premium)
- `services_offered` - text[] (RN, LPN, PCS)
- `counties_served` - text[]

### listing_requests (NEW)
- `contact_name`, `contact_email`, `contact_phone`
- `business_name`, `city`, `services_offered`, `counties_served`
- `status` - text (pending, approved, rejected)
- `provider_id` - UUID (links to created provider if approved)

### callback_requests
- Leads from families requesting callbacks from providers

---

## Admin Panel

**URL:** `/admin` (password protected via `ADMIN_PASSWORD` env var)

**Key Pages:**
- `/admin` - Main provider management (verify, feature, copy claim links)
- `/admin/requests` - NEW: Review listing requests from unlisted providers
- `/admin/leads` - View callback requests from families

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Claim form | `app/claim/[slug]/page.tsx` |
| Claim API | `app/api/claim/route.ts` |
| New listing request page | `app/request-listing/page.tsx` |
| New listing request API | `app/api/listing-request/route.ts` |
| Admin - providers | `app/admin/page.tsx` |
| Admin - listing requests | `app/admin/requests/page.tsx` |
| Provider types | `types/provider.ts` |
| Supabase client | `lib/supabase.ts` |
| Site config | `lib/config.ts` |

---

## Pending Items / Known Issues

1. **Reset auto-verified providers** - SQL above needs to be run to fix providers who were auto-verified but never paid

2. **Home page is thin** - Only ~300 words, could benefit from more SEO content

3. **Next SEO page** - `/pediatric-home-nursing-georgia` recommended as next content piece

4. **Deployment** - Site deploys via Vercel from GitHub. Recent deploy should have gone through with commit `d4f803a`.

---

## Git Info
- **Repo:** https://github.com/fitzhall/GAPP-Directory
- **Branch:** main
- **Latest commits:**
  - `d4f803a` - Add Katie Beckett waiver Georgia SEO page
  - `fe2d194` - Add profile editing during claim + new listing request flow
