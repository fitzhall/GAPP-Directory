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
- ✅ **Lead notification system** - callbacks saved to DB + email to providers via Resend
- ✅ **Lead management admin** - `/admin/leads` to view/manage all callback requests

### Provider Verification Flow (Current)
1. All 327 providers seeded as `is_verified: false`
2. Admin manually verifies providers at `/admin`
3. Verified providers show full profile with callback form
4. Unverified providers show limited info, not clickable (visible but "Pending Verification")

### Callback/Lead Flow (NOW WORKING)
1. Family clicks on verified provider → goes to `/provider/[slug]`
2. Family fills out callback form (name, phone, email, service needed, urgency, etc.)
3. Form submits to `/api/callback` which:
   - Saves the lead to `callback_requests` table
   - Sends email notification to provider (via Resend) with lead details
4. Admin can view/manage leads at `/admin/leads`

---

## COMPLETED: Provider Lead Notification System

The lead notification system is now fully implemented:

### How It Works
1. **Form Submission** → `/api/callback` API route
2. **Database** → Lead saved to `callback_requests` table
3. **Email** → Provider receives formatted HTML email via Resend
4. **Admin** → View/manage all leads at `/admin/leads`

### Key Files
- `/app/api/callback/route.ts` - API route that saves lead + sends email
- `/app/admin/leads/page.tsx` - Lead management dashboard
- `/components/CallbackForm.tsx` - Updated to use API route

### Setup Required
Add these environment variables in Vercel:

```
RESEND_API_KEY=re_xxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Get Resend API key:** https://resend.com (free tier: 3k emails/month)

**Important:** You need to verify your domain (georgiagapp.com) in Resend to send from `leads@georgiagapp.com`. Until then, use Resend's default `onboarding@resend.dev` for testing.

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

## Future Enhancements (Optional)

1. **Provider Portal** - Let providers log in to see their leads, update profile
2. **Family Confirmation Email** - Send confirmation to family when they submit
3. **SMS Notifications** - Add Twilio for text alerts to providers
4. **Lead Analytics** - Track conversion rates, response times
5. **Admin Auth** - Protect `/admin` routes with authentication
