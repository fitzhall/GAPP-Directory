# CLAUDE.md - Georgia GAPP Provider Directory

## Project Overview

**GeorgiaGAPP.com** is a directory connecting Georgia families with GAPP (Georgia Pediatric Program) providers for special needs children requiring home nursing and personal care services.

- **Live Site:** https://www.georgiagapp.com
- **GitHub:** https://github.com/fitzhall/GAPP-Directory
- **Hosting:** Vercel (auto-deploys from main branch)
- **Database:** Supabase (PostgreSQL)

### Purpose
Help families quickly find verified GAPP providers (RN, LPN, PCS) by county, submit callback requests, and allow providers to claim/manage their listings.

---

## Tech Stack

- **Framework:** Next.js 14.2.5 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Styling:** Tailwind CSS
- **Font:** Nunito (Google Fonts)
- **Email:** Resend API for lead notifications
- **Hosting:** Vercel

### Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.57.4",
  "next": "14.2.5",
  "react": "^18.3.1",
  "resend": "^6.6.0",
  "tailwind-merge": "^2.2.0"
}
```

---

## Project Structure

```
GAPP-Directory/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Main layout with nav/footer
│   ├── globals.css               # Global styles
│   │
│   ├── [county]/page.tsx         # County pages (/fulton, /cobb)
│   ├── directory/page.tsx        # Main directory with search/filters
│   ├── provider/[slug]/page.tsx  # Individual provider profile + callback form
│   │
│   ├── admin/
│   │   ├── page.tsx              # Provider management dashboard
│   │   └── leads/page.tsx        # Lead management dashboard
│   │
│   ├── api/
│   │   ├── callback/route.ts     # POST: Save lead + send email
│   │   └── providers/route.ts    # GET: Provider search/filter
│   │
│   ├── claim/                    # Provider claim flow
│   ├── request-listing/          # New provider listing request
│   ├── quiz/                     # "Help Me Choose" provider matching
│   │
│   └── [SEO pages]/              # Content pages for SEO
│       ├── gapp-providers-georgia/
│       ├── gapp-approval-guide/
│       ├── how-it-works/
│       └── ...
│
├── components/
│   ├── CallbackForm.tsx          # Lead capture form
│   ├── ProviderCard.tsx          # Provider listing card
│   ├── MobileNav.tsx             # Mobile hamburger menu
│   └── ...
│
├── lib/
│   ├── supabase.ts               # Supabase client factory
│   ├── config.ts                 # Site-wide configuration
│   └── utils.ts                  # Helper functions (cn, etc.)
│
├── types/
│   ├── provider.ts               # Provider TypeScript types
│   └── member.ts                 # Generic member types (legacy)
│
├── supabase/
│   ├── schema.sql                # Database schema (source of truth)
│   └── seed.sql                  # Sample data
│
├── public/                       # Static assets
├── scripts/                      # Utility scripts
└── configs/                      # Example configurations
```

---

## Database Schema

### `providers` Table
Main provider data (327 seeded from CSV).

**Key Fields:**
- `id` (UUID, PK)
- `name`, `slug` (URL-friendly)
- `counties_served` (TEXT[]) - Array of counties
- `services_offered` (TEXT[]) - ['RN', 'LPN', 'PCS']
- `tier_level` (INTEGER) - 0 = Verified (free), 1 = Featured ($99/mo)
- `is_active`, `is_claimed`, `is_verified`, `is_featured` (BOOLEAN)
- `accepting_new_patients` (BOOLEAN)
- `email`, `phone`, `intake_phone`, `website`
- `bio`, `how_to_start`, `years_in_business`
- `claimed_by_email`, `claimed_at`, `verified_at`

**Indexes:**
- GIN indexes on `counties_served`, `services_offered`
- B-tree on `slug`, `tier_level`, `is_active`

### `callback_requests` Table
Family lead capture (callback form submissions).

**Key Fields:**
- `id` (UUID, PK)
- `provider_id` (UUID, FK → providers)
- `parent_name`, `phone`, `email`
- `county`, `zip_code`, `service_needed`
- `urgency` ('asap' | 'this_month' | 'researching')
- `status` ('new' | 'contacted' | 'converted' | 'closed')
- `created_at`, `contacted_at`

### Row Level Security (RLS)
- **Providers:** Public read access for active providers
- **Callback Requests:** Anyone can INSERT, service role can manage

---

## Key Features & User Flows

### 1. Provider Search & Directory
**Files:** `app/directory/page.tsx`

- Search by county (159 GA counties)
- Filter by service type (RN, LPN, PCS)
- Filter by availability ("Accepting New Patients")
- Results show verified providers with tier-based sorting

### 2. County Pages (SEO)
**Files:** `app/[county]/page.tsx`

- Clean URLs: `/fulton`, `/cobb`, `/dekalb`
- Pre-filtered directory for specific county
- Dynamic metadata for SEO

### 3. Provider Profiles
**Files:** `app/provider/[slug]/page.tsx`, `components/CallbackForm.tsx`

- Only verified providers get full profiles
- Callback form → submits to `/api/callback`
- Unverified providers show "Pending Verification" state

### 4. Callback/Lead Flow
**Files:** `app/api/callback/route.ts`

1. Family fills out callback form on provider page
2. POST to `/api/callback`:
   - Saves lead to `callback_requests` table
   - Sends HTML email to provider via Resend
3. Admin can view/manage leads at `/admin/leads`

**Email Template:** HTML format with family details, service needed, urgency

### 5. Provider Claim Flow
**Files:** `app/claim/[slug]/page.tsx`

- Unclaimed providers can be claimed by agency owners
- Two-step flow: Basic info → Edit full profile
- Sets `is_claimed = true`, `claimed_by_email`
- Requires admin verification (`is_verified = true`) to go live

### 6. Admin Panel
**Files:** `app/admin/page.tsx`, `app/admin/leads/page.tsx`

- **Provider Management:** Verify, feature, toggle accepting status
- **Lead Management:** View all callback requests, update status
- **No auth yet** - planned for future

### 7. "Help Me Choose" Quiz
**Files:** `app/quiz/page.tsx`, `lib/config.ts`

- Multi-step form: location → service → urgency → special needs
- Questions defined in `lib/config.ts` → `quizQuestions`
- Matches families with providers based on answers

---

## Configuration

### `lib/config.ts` - Single Source of Truth

All site-wide settings live here:

```typescript
export const config = {
  siteName: 'GAPP Provider Directory',
  tagline: 'Find a Georgia GAPP provider you can trust',
  memberSingular: 'provider',
  memberPlural: 'providers',

  tiers: [
    { level: 0, name: 'Verified', price: 0, ... },
    { level: 1, name: 'Featured', price: 99, ... }
  ],

  services: [
    { id: 'RN', label: 'Registered Nursing (RN)', ... },
    { id: 'LPN', label: 'Licensed Practical Nursing (LPN)', ... },
    { id: 'PCS', label: 'Personal Care Services (PCS)', ... }
  ],

  badges: [...],
  quizQuestions: [...]
}
```

**Helper Functions:**
- `getTierName(level)`, `getTierColor(level)`
- `getServiceLabel(id)`, `getServiceDescription(id)`

---

## Brand Guidelines

**Colors** (in `tailwind.config.ts`):
- **Primary (Coral Pink):** `#FF8A80` - CTAs, buttons
- **Accent (Sky Blue):** `#87CEEB` - Trust elements, links
- **Warm (Soft Peach):** `#FFCBA4` - Backgrounds, highlights
- **Navy:** `#2C3E50` - Text, headers

**Font:** Nunito (Google Fonts) - friendly, accessible

---

## API Routes

### `POST /api/callback`
Save callback request + send email to provider.

**Request Body:**
```typescript
{
  providerId: string,
  parentName: string,
  phone: string,
  email?: string,
  county: string,
  zipCode: string,
  serviceNeeded: 'RN' | 'LPN' | 'PCS' | 'not_sure',
  urgency: 'asap' | 'this_month' | 'researching',
  hoursNeeded?: string,
  specialNeeds?: string,
  preferredCallbackTime?: string
}
```

**Response:** `{ success: true, id: string }` or `{ error: string }`

**Side Effects:**
1. Insert into `callback_requests` table
2. Send HTML email via Resend to provider

---

## Environment Variables

### Required (Vercel)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://mjuuqjrxzhkvsbrgqfot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # For admin operations
RESEND_API_KEY=re_xxxxx                        # For email notifications
```

### Local Development
Copy `.env.example` → `.env.local` and fill in values.

---

## Development Guidelines

### Running Locally
```bash
npm install
npm run dev  # Starts on http://localhost:3000
```

### Building
```bash
npm run build
npm start
```

### Deployment
Push to `main` branch → auto-deploys to Vercel.

### Code Style
- Use TypeScript with strict types (`types/provider.ts`)
- Server Components by default, Client Components only when needed (`'use client'`)
- Tailwind for all styling (use `cn()` helper from `lib/utils.ts`)
- Follow Next.js App Router conventions

### Database Queries
- **Client-side:** Use `createClientComponentClient()` from `lib/supabase.ts`
- **Server-side:** Use `createServerComponentClient()` or `createServerActionClient()`
- **Admin/API:** Use service role key for privileged operations

### Common Patterns

**Fetching Providers:**
```typescript
const { data: providers } = await supabase
  .from('providers')
  .select('*')
  .eq('is_active', true)
  .eq('is_verified', true)
  .contains('counties_served', [county])
```

**GIN Array Queries:**
Use `.contains()` for TEXT[] columns:
```typescript
.contains('counties_served', ['Fulton'])
.contains('services_offered', ['RN'])
```

**Tier Sorting:**
Featured providers (tier_level = 1) should appear first:
```typescript
.order('tier_level', { ascending: false })
.order('name', { ascending: true })
```

---

## SEO & Content Pages

Multiple content pages for organic search:
- `/gapp-providers-georgia`
- `/gapp-approval-guide`
- `/gapp-approval-timeline`
- `/how-it-works`
- `/why-gapp-applications-get-denied`
- etc.

**Sitemap:** Generated in `app/sitemap.ts` (includes all counties, providers, content pages)
**Robots.txt:** `app/robots.ts`

**Canonical URLs:** All pages use `www.georgiagapp.com` (not naked domain).

---

## Data Sources

### Initial Provider Data
- **File:** `unclaimed-providers-for-outreach.csv`
- **Count:** 327 providers seeded from CSV
- **Status:** All seeded as `is_verified: false`, `is_claimed: false`

### County Data
- **File:** `provider-counties.json`
- **Count:** 159 Georgia counties with geo data

---

## Key Components

### `ProviderCard.tsx`
Reusable card for directory listings.

**Props:**
- `provider` (Provider object)
- `showCounties` (boolean) - show counties list
- `priority` (boolean) - for image loading

**Features:**
- Tier badge (Verified vs Featured)
- Trust badges (fast response, background checked)
- Accepting status indicator
- Responsive design

### `CallbackForm.tsx`
Lead capture form on provider pages.

**Props:**
- `provider` (Provider object)

**Behavior:**
- Client component (`'use client'`)
- Form validation
- POSTs to `/api/callback`
- Shows success/error states

### `MobileNav.tsx`
Mobile hamburger menu.

**Features:**
- Overlay navigation
- Smooth transitions
- Touch-friendly hit areas

---

## Future Enhancements

Documented in `HANDOFF.md`:

1. **Provider Portal** - Let providers log in, view leads, update profile
2. **Family Confirmation Emails** - Send receipt email to families
3. **SMS Notifications** - Twilio integration for text alerts
4. **Lead Analytics** - Track conversion rates, response times
5. **Admin Authentication** - Protect `/admin` routes
6. **Reviews System** - Allow families to leave reviews

---

## Common Tasks

### Adding a New County
Counties are dynamic from the database (`counties_served` column). No code changes needed.

### Adding a New Service Type
1. Update `lib/config.ts` → `services` array
2. Update `types/provider.ts` if needed
3. Update seeder/migrations

### Changing Tier Pricing
1. Update `lib/config.ts` → `tiers` array
2. Update `/providers` page copy

### Adding a New Badge
1. Add to `lib/config.ts` → `badges` array
2. Add boolean field to `providers` table (e.g., `is_spanish_speaking`)
3. Update `ProviderCard.tsx` to display badge

### Modifying Email Template
Edit `app/api/callback/route.ts` → HTML string in Resend call.

---

## Debugging Tips

### Provider Not Showing in Directory
Check:
1. `is_active = true`
2. `is_verified = true`
3. `counties_served` includes the searched county
4. `services_offered` includes the filtered service (if applicable)

### Callback Form Not Sending Email
Check:
1. `RESEND_API_KEY` set in Vercel
2. Provider has valid `email` field
3. Check Vercel logs for API errors
4. Verify domain in Resend dashboard

### RLS Issues
If queries fail with "permission denied":
- Use service role key for admin operations
- Check RLS policies in `supabase/schema.sql`
- Ensure `is_active = true` for public queries

---

## Important Notes

### Do Not Hardcode
- County names (use database)
- Service types (use `lib/config.ts`)
- Colors (use Tailwind theme)
- Email content (should be configurable)

### Performance
- Use Next.js Image component for all images
- Enable Suspense boundaries for data fetching
- Index database columns used in WHERE/ORDER BY

### Security
- Never expose service role key to client
- Validate all API inputs
- Use RLS for data access control
- Sanitize user inputs in emails

### Georgia-Specific Context
- GAPP = Georgia Pediatric Program (Medicaid waiver)
- RN = Registered Nurse, LPN = Licensed Practical Nurse, PCS = Personal Care Services
- Counties matter because providers serve specific regions
- Target audience: families with medically fragile children

---

## Contact & Resources

- **Support Email:** help@georgiagapp.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/mjuuqjrxzhkvsbrgqfot
- **Vercel Dashboard:** https://vercel.com (linked to GitHub repo)
- **Resend Dashboard:** https://resend.com (for email deliverability)

---

**Last Updated:** 2026-01-19
