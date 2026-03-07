# Provider Analytics Dashboard — Design

**Date:** 2026-03-07
**Status:** Approved
**Context:** Premium providers (Verified $127/q, Premium $387/q) are requesting a dashboard to track clicks, traffic, and engagement on their listings.

## Overview

Add event tracking across the site and a provider-facing dashboard where logged-in providers can see their listing performance over the last 30 days.

## 1. Event Tracking

### New table: `provider_events`

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | PK, default gen_random_uuid() |
| provider_id | UUID (FK -> providers) | Which provider |
| event_type | TEXT | `view`, `click_phone`, `click_website`, `click_callback`, `impression` |
| metadata | JSONB | Page URL, referrer, device info |
| created_at | TIMESTAMPTZ | default now() |

Index on `(provider_id, event_type, created_at)` for dashboard queries.

### New endpoint: `POST /api/events/track`

- Accepts `{ providerId, eventType, metadata? }`
- Inserts into `provider_events`
- No auth required (public-facing tracking)
- Rate-limited to prevent abuse
- RLS: public INSERT only, SELECT restricted to service role + authenticated provider's own records

### Client-side event emitters

| Event | Trigger | Location |
|-------|---------|----------|
| `impression` | ProviderCard scrolls into viewport (IntersectionObserver) | `components/ProviderCard.tsx` |
| `view` | Provider profile page loads | `app/provider/[slug]/page.tsx` |
| `click_phone` | onClick on phone number link | `app/provider/[slug]/page.tsx` |
| `click_website` | onClick on website link | `app/provider/[slug]/page.tsx` |
| `click_callback` | Callback form opened/submitted | `components/CallbackForm.tsx` |

## 2. Provider Authentication

### Approach: Supabase Auth with magic link (email-based, no passwords)

- Provider clicks "Sign In" on site -> enters email -> receives magic link
- Email must match `claimed_by_email` in providers table
- Supabase Auth creates session with JWT
- New column `auth_user_id` (UUID) on `providers` table links auth user to provider record

### Why magic link

- Providers already interact via email (claim flow, upgrade emails, availability pings)
- No password reset flow needed
- Supabase Auth supports it natively

### RLS policy updates

- `provider_events`: SELECT WHERE provider_id matches logged-in provider's record
- `callback_requests`: SELECT WHERE provider_id matches (providers can see their own leads)

### Route protection

- New `app/dashboard/` route group
- Layout-level auth check via Supabase server-side session
- Redirect to login page if no session

## 3. Dashboard UI

### Route: `/dashboard` (auth-protected)

### Layout

Simple page with provider name + "Sign Out" in header.

### Stat cards (top of page)

| Card | Metric | Source |
|------|--------|--------|
| Profile Views | Count of `view` events, last 30d | `provider_events` |
| Phone/Web Clicks | Count of `click_phone` + `click_website`, last 30d | `provider_events` |
| Callback Requests | Count of callbacks, last 30d | `callback_requests` |
| Search Impressions | Count of `impression` events, last 30d | `provider_events` |

### Below the cards

- **Daily views chart** — bar chart showing views per day over last 30 days (CSS bar chart or lightweight lib like recharts)
- **Recent callbacks list** — last 10 callback requests with name, county, urgency, date

### Single page for v1 — no sub-navigation.

## 4. Data Flow

```
Family browses site
  -> ProviderCard visible in results -> POST /api/events/track (impression)
  -> Family clicks provider -> profile loads -> POST /api/events/track (view)
  -> Family clicks phone/website -> POST /api/events/track (click_phone/click_website)
  -> Family submits callback -> existing /api/callback + POST /api/events/track (click_callback)

Provider logs in via magic link
  -> /dashboard queries:
     - COUNT provider_events grouped by event_type WHERE last 30d
     - COUNT callback_requests WHERE last 30d
     - SELECT provider_events WHERE type='view' GROUP BY date (chart)
     - SELECT callback_requests ORDER BY created_at DESC LIMIT 10
```

## 5. Out of Scope (YAGNI)

- Admin analytics view (query Supabase directly)
- Email reports or PDF exports
- A/B testing or conversion funnels
- Real-time updates or WebSockets
- Multi-provider accounts (one login = one provider)
- Selectable date ranges (30d only for v1)
- Monthly comparison or trend arrows
