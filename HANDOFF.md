# GeorgiaGAPP.com - Development Handoff Document

## Project Overview

**GeorgiaGAPP.com** is a directory connecting families with GAPP (Georgia Pediatric Program) providers for special needs children. Built with Next.js 14 + Supabase.

**Live Site:** https://georgiagapp.com (deployed on Vercel)
**GitHub:** https://github.com/fitzhall/GAPP-Directory

---

## Current State

### What's Working
- ✅ Provider directory with 327 seeded providers from CSV
- ✅ Search/filter by county and service type (RN, LPN, PCS)
- ✅ Clean SEO URLs for all 159 Georgia counties (`/fulton`, `/cobb`, etc.)
- ✅ Provider profile pages with callback request forms
- ✅ Admin panel at `/admin` for provider management (verify, feature, toggle accepting)
- ✅ Mobile-responsive design with hamburger menu
- ✅ Brand package integrated (logo, favicon, colors, OG image for social sharing)
- ✅ Sitemap and robots.txt for SEO

### Provider Verification Flow (Current)
1. All 327 providers seeded as `is_verified: false`
2. Admin manually verifies providers at `/admin`
3. Verified providers show full profile with callback form
4. Unverified providers show limited info, not clickable (visible but "Pending Verification")

### Callback/Lead Flow (Current)
1. Family clicks on verified provider → goes to `/provider/[slug]`
2. Family fills out callback form (name, phone, email, child info, message)
3. Form submits to... **nowhere yet** - this is the gap

---

## NEXT PRIORITY: Provider Lead Notification System

### The Problem
When families submit callback requests, providers have no way to receive them. We're collecting lead data but not delivering it.

### Options to Consider

#### Option A: Email Notification (Simplest)
- Store provider email in database (already have `email` field)
- When callback form submits, send email to provider
- Requires: Email service (Resend, SendGrid, or Supabase Edge Functions)
- Pros: Simple, no provider login needed
- Cons: Emails can go to spam, no tracking

#### Option B: Provider Dashboard (More Robust)
- Create `/provider-portal` with login
- Providers see their leads, mark as contacted
- Requires: Auth system (Supabase Auth), new UI
- Pros: Tracking, lead management, provider can update their profile
- Cons: More complex, providers need to check it

#### Option C: Hybrid (Recommended)
- Email notification immediately when lead comes in
- Provider dashboard for history/management
- Best of both worlds

### Database Changes Needed

```sql
-- Leads/callbacks table (may already exist, check schema)
CREATE TABLE IF NOT EXISTS callbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  family_name TEXT NOT NULL,
  family_email TEXT,
  family_phone TEXT NOT NULL,
  child_age TEXT,
  service_needed TEXT,
  message TEXT,
  urgency TEXT,
  status TEXT DEFAULT 'new', -- new, contacted, converted, closed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  notes TEXT
);

-- Provider auth (if doing dashboard)
-- Could use Supabase Auth with provider email
```

### Files to Check/Modify

1. **`/components/CallbackForm.tsx`** - Current form component
2. **`/app/api/`** - Need API route for form submission
3. **`/lib/supabase.ts`** - Database client
4. **`/supabase/schema.sql`** - Check if callbacks table exists

---

## Tech Stack

- **Framework:** Next.js 14.2.5 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Font:** Nunito (Google Fonts)

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://mjuuqjrxzhkvsbrgqfot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

---

## Brand Guidelines

Colors (in `tailwind.config.ts`):
- **Primary (Coral Pink):** #FF8A80 - CTAs, buttons
- **Accent (Sky Blue):** #87CEEB - Trust, links
- **Warm (Soft Peach):** #FFCBA4 - Backgrounds
- **Navy:** #2C3E50 - Text, headers

Full brand guide: `/GeorgiaGAPP_Brand_Package/BRAND_GUIDELINES.md`

---

## Key Files

```
/app
  /[county]/page.tsx      # County pages (/fulton, /cobb)
  /admin/page.tsx         # Admin panel
  /directory/page.tsx     # Main directory with filters
  /provider/[slug]/page.tsx  # Individual provider profiles
  /providers/page.tsx     # "For Providers" landing page
  /quiz/page.tsx          # Provider matching quiz
  layout.tsx              # Main layout with nav/footer

/components
  CallbackForm.tsx        # Lead capture form
  ProviderCard.tsx        # Provider listing card
  MobileNav.tsx           # Mobile hamburger menu

/lib
  supabase.ts             # Supabase client
  config.ts               # Site config

/supabase
  schema.sql              # Database schema
  seed.sql                # Sample data
```

---

## Quick Commands

```bash
# Run locally
npm run dev

# Build
npm run build

# The repo auto-deploys to Vercel on push to main
git push origin main
```

---

## Contact

- **Support Email:** help@georgiaGAPP.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/mjuuqjrxzhkvsbrgqfot

---

## Summary for Next Agent

**Immediate need:** When a family submits a callback request on a provider's profile page, that request needs to actually reach the provider. Currently the form exists but doesn't send anywhere.

**Suggested approach:**
1. Check if `callbacks` table exists in Supabase
2. Create API route to save callback to database
3. Set up email notification to provider (Resend is easy with Vercel)
4. Optionally: Build simple provider portal for lead management

**Questions to clarify with user:**
- Do providers have reliable emails in the database?
- Do they want providers to have login accounts?
- What info should the notification email contain?
- Should families get a confirmation email too?
