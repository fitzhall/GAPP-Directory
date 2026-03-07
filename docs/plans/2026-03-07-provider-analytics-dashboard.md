# Provider Analytics Dashboard — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Give premium providers a login-protected dashboard showing profile views, clicks, callback requests, and search impressions over the last 30 days.

**Architecture:** New `provider_events` table tracks all engagement. Supabase Auth with magic link handles provider login. A `/dashboard` route renders stat cards + daily views chart + recent callbacks. A lightweight tracking client fires events from existing pages.

**Tech Stack:** Next.js 14 App Router, Supabase Auth (magic link), Supabase PostgreSQL, Tailwind CSS, recharts (bar chart)

**Design doc:** `docs/plans/2026-03-07-provider-analytics-dashboard-design.md`

---

## Task 1: Database Migration — provider_events table

**Files:**
- Create: `supabase/migrations/007_provider_events.sql`
- Modify: `supabase/schema.sql` (append new table definition)

**Step 1: Write the migration SQL**

Create `supabase/migrations/007_provider_events.sql`:

```sql
-- Provider analytics event tracking
CREATE TABLE provider_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click_phone', 'click_website', 'click_callback', 'impression')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Primary query index: dashboard stats for a provider in a date range
CREATE INDEX idx_provider_events_dashboard
  ON provider_events (provider_id, event_type, created_at DESC);

-- Enable RLS
ALTER TABLE provider_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (public tracking)
CREATE POLICY "Public can insert events" ON provider_events
  FOR INSERT WITH CHECK (true);

-- Providers can read their own events (requires Supabase Auth - added in Task 3)
-- For now, only service role can read
CREATE POLICY "Service role can read all events" ON provider_events
  FOR SELECT USING (true);
```

**Step 2: Append to schema.sql**

Add the same table definition to the bottom of `supabase/schema.sql` after the `provider_cards` view (line 188), inside a new section header:

```sql
-- ============================================
-- PROVIDER EVENTS TABLE (Analytics)
-- ============================================
```

**Step 3: Commit**

```bash
git add supabase/migrations/007_provider_events.sql supabase/schema.sql
git commit -m "feat: add provider_events table for analytics tracking"
```

---

## Task 2: Event Tracking API + Client Helper

**Files:**
- Create: `app/api/events/track/route.ts`
- Create: `lib/track.ts`

**Step 1: Create the tracking API endpoint**

Create `app/api/events/track/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_EVENTS = ['view', 'click_phone', 'click_website', 'click_callback', 'impression'] as const

export async function POST(request: NextRequest) {
  try {
    const { providerId, eventType, metadata } = await request.json()

    if (!providerId || !eventType) {
      return NextResponse.json({ error: 'Missing providerId or eventType' }, { status: 400 })
    }

    if (!VALID_EVENTS.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
    }

    const { error } = await supabase
      .from('provider_events')
      .insert({
        provider_id: providerId,
        event_type: eventType,
        metadata: metadata || {},
      })

    if (error) {
      console.error('Error tracking event:', error)
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

**Step 2: Create the client-side tracking helper**

Create `lib/track.ts`:

```typescript
export function trackEvent(providerId: string, eventType: string, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  // Fire and forget - don't block UI
  fetch('/api/events/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ providerId, eventType, metadata }),
    keepalive: true,
  }).catch(() => {
    // Silently fail - analytics should never break the user experience
  })
}
```

**Step 3: Commit**

```bash
git add app/api/events/track/route.ts lib/track.ts
git commit -m "feat: add event tracking API and client helper"
```

---

## Task 3: Wire Up Event Tracking to Existing Pages

**Files:**
- Create: `components/TrackView.tsx` (client component for view tracking)
- Create: `components/TrackImpression.tsx` (client component for impression tracking)
- Modify: `app/provider/[slug]/page.tsx` (add view + click tracking)
- Modify: `components/CallbackForm.tsx` (add callback click tracking)
- Modify: `components/ProviderCard.tsx` (add impression tracking)

**Step 1: Create TrackView component**

This fires a `view` event once when the provider profile page mounts.

Create `components/TrackView.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/track'

export function TrackView({ providerId }: { providerId: string }) {
  useEffect(() => {
    trackEvent(providerId, 'view')
  }, [providerId])

  return null
}
```

**Step 2: Create TrackImpression component**

This fires an `impression` event when a ProviderCard becomes visible using IntersectionObserver.

Create `components/TrackImpression.tsx`:

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/track'

export function TrackImpression({ providerId, children }: { providerId: string, children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const tracked = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true
          trackEvent(providerId, 'impression')
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [providerId])

  return <div ref={ref}>{children}</div>
}
```

**Step 3: Add TrackView to provider profile page**

Modify `app/provider/[slug]/page.tsx`. Add import at top (after existing imports, around line 8):

```typescript
import { TrackView } from '@/components/TrackView'
```

Add `<TrackView>` inside the return, right after the opening `<div className="min-h-screen bg-gray-50">` (line 143):

```typescript
<TrackView providerId={provider.id} />
```

**Step 4: Add click tracking to phone and website links**

The provider profile page (`app/provider/[slug]/page.tsx`) is a server component. The phone link (line 355-369) and website link (line 371-388) need onClick handlers, but server components can't have event handlers.

Create a new client component `components/TrackableLink.tsx`:

```typescript
'use client'

import { trackEvent } from '@/lib/track'

interface TrackableLinkProps {
  href: string
  providerId: string
  eventType: string
  className?: string
  target?: string
  rel?: string
  onClick?: (e: React.MouseEvent) => void
  children: React.ReactNode
}

export function TrackableLink({ href, providerId, eventType, children, onClick, ...props }: TrackableLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    trackEvent(providerId, eventType)
    onClick?.(e)
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
```

Then in `app/provider/[slug]/page.tsx`, import it:

```typescript
import { TrackableLink } from '@/components/TrackableLink'
```

Replace the phone `<a>` tag (lines 355-369) with:

```typescript
<TrackableLink
  href={`tel:${contactPhone.replace(/\D/g, '')}`}
  providerId={provider.id}
  eventType="click_phone"
  className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
>
```

Replace the website `<a>` tag (lines 371-388) with:

```typescript
<TrackableLink
  href={provider.website}
  providerId={provider.id}
  eventType="click_website"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
>
```

**Step 5: Add callback tracking to CallbackForm**

Modify `components/CallbackForm.tsx`. Add import at top (after line 2):

```typescript
import { trackEvent } from '@/lib/track'
```

Inside `handleSubmit`, after the successful `setStatus('success')` (line 65), add:

```typescript
trackEvent(providerId, 'click_callback')
```

**Step 6: Wrap ProviderCard with TrackImpression**

Modify `components/ProviderCard.tsx`. Add import at top:

```typescript
import { TrackImpression } from '@/components/TrackImpression'
```

At the end of the file, wrap the existing export. Change the component name to `ProviderCardInner` and create a new `ProviderCard` that wraps it:

Actually, simpler approach — wrap the return JSX. In each of the 3 return blocks (unclaimed line 34-92, claimed line 97-157, verified line 160-261), wrap the outermost `<Link>` with `<TrackImpression providerId={provider.id}>`. For example, line 34:

```typescript
return (
  <TrackImpression providerId={provider.id}>
    <Link ... >
```

And close it before the closing `)` of each return.

**Step 7: Commit**

```bash
git add components/TrackView.tsx components/TrackImpression.tsx components/TrackableLink.tsx
git add app/provider/\[slug\]/page.tsx components/CallbackForm.tsx components/ProviderCard.tsx
git commit -m "feat: wire event tracking to provider pages and cards"
```

---

## Task 4: Database Migration — auth_user_id on providers

**Files:**
- Create: `supabase/migrations/008_provider_auth.sql`
- Modify: `supabase/schema.sql` (add column)

**Step 1: Write the migration**

Create `supabase/migrations/008_provider_auth.sql`:

```sql
-- Link Supabase Auth users to provider records
ALTER TABLE providers ADD COLUMN auth_user_id UUID UNIQUE;

-- Index for looking up provider by auth user
CREATE INDEX idx_providers_auth_user ON providers (auth_user_id) WHERE auth_user_id IS NOT NULL;

-- RLS: providers can read their own events
CREATE POLICY "Providers can read own events" ON provider_events
  FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM providers WHERE auth_user_id = auth.uid()
    )
  );

-- RLS: providers can read their own callback requests
CREATE POLICY "Providers can read own callbacks" ON callback_requests
  FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM providers WHERE auth_user_id = auth.uid()
    )
  );
```

**Step 2: Add column to schema.sql**

In `supabase/schema.sql`, add after `verified_at` (around line 61):

```sql
auth_user_id UUID UNIQUE,            -- Links to Supabase Auth user
```

**Step 3: Commit**

```bash
git add supabase/migrations/008_provider_auth.sql supabase/schema.sql
git commit -m "feat: add auth_user_id column and provider RLS policies"
```

---

## Task 5: Provider Auth — Login Page + Auth Helper

**Files:**
- Create: `lib/auth.ts` (server-side Supabase Auth client)
- Create: `app/dashboard/login/page.tsx`

**Step 1: Install @supabase/ssr**

```bash
cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template"
npm install @supabase/ssr
```

**Step 2: Create server-side auth helper**

Create `lib/auth.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

export async function getProviderSession() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Look up the provider linked to this auth user
  const { data: provider } = await supabase
    .from('providers')
    .select('id, name, slug, tier_level, is_verified, is_featured, claimed_by_email')
    .eq('auth_user_id', user.id)
    .single()

  if (!provider) return null

  return {
    user,
    provider: {
      id: provider.id as string,
      name: provider.name as string,
      slug: provider.slug as string,
      tierLevel: provider.tier_level as number,
      isVerified: provider.is_verified as boolean,
      isFeatured: provider.is_featured as boolean,
      email: provider.claimed_by_email as string,
    },
  }
}
```

**Step 3: Create login page**

Create `app/dashboard/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProviderLoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setStatus('error')
      return
    }

    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We sent a sign-in link to <strong>{email}</strong>. Click the link to access your dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Sign in with your provider email</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourprovider.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!email || status === 'sending'}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              email && status !== 'sending'
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {status === 'sending' ? 'Sending...' : 'Send Sign-In Link'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Use the email associated with your claimed provider profile
        </p>
      </div>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add lib/auth.ts app/dashboard/login/page.tsx
git commit -m "feat: add provider auth helper and magic link login page"
```

---

## Task 6: Auth Callback + Link Account

**Files:**
- Create: `app/dashboard/auth/callback/route.ts`

**Step 1: Create the auth callback handler**

This handles the magic link redirect. It exchanges the auth code for a session, then links the Supabase Auth user to their provider record (by matching `claimed_by_email`).

Create `app/dashboard/auth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/dashboard/login?error=missing_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    return NextResponse.redirect(`${origin}/dashboard/login?error=auth_failed`)
  }

  // Link auth user to provider record (first login only)
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check if already linked
  const { data: existing } = await serviceClient
    .from('providers')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!existing) {
    // Find provider by email and link
    const { error: linkError } = await serviceClient
      .from('providers')
      .update({ auth_user_id: user.id })
      .eq('claimed_by_email', user.email)
      .is('auth_user_id', null)

    if (linkError) {
      console.error('Error linking auth user to provider:', linkError)
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

**Step 2: Commit**

```bash
git add app/dashboard/auth/callback/route.ts
git commit -m "feat: add auth callback to link Supabase Auth user to provider"
```

---

## Task 7: Dashboard Layout + Auth Guard

**Files:**
- Create: `app/dashboard/layout.tsx`

**Step 1: Create the dashboard layout with auth guard**

Create `app/dashboard/layout.tsx`:

```typescript
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProviderSession } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getProviderSession()

  if (!session) {
    redirect('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-lg font-bold text-gray-900">
              Provider Dashboard
            </Link>
            <p className="text-sm text-gray-500">{session.provider.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/provider/${session.provider.slug}`}
              className="text-sm text-primary hover:underline"
            >
              View My Listing
            </Link>
            <form action="/dashboard/auth/signout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  )
}
```

**Step 2: Create sign-out route**

Create `app/dashboard/auth/signout/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/auth'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/dashboard/login', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.georgiagapp.com'))
}
```

**Step 3: Commit**

```bash
git add app/dashboard/layout.tsx app/dashboard/auth/signout/route.ts
git commit -m "feat: add dashboard layout with auth guard and sign-out"
```

---

## Task 8: Dashboard Page — Stats + Chart + Callbacks

**Files:**
- Create: `app/dashboard/page.tsx`
- Install: `recharts`

**Step 1: Install recharts**

```bash
cd "/Users/fitzhall/projects/Directory Frameworks/directory-starter-template"
npm install recharts
```

**Step 2: Create the dashboard page**

Create `app/dashboard/page.tsx`:

```typescript
import { getProviderSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { DashboardCharts } from '@/components/DashboardCharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getDashboardData(providerId: string) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const since = thirtyDaysAgo.toISOString()

  // Fetch event counts by type
  const { data: events } = await supabase
    .from('provider_events')
    .select('event_type, created_at')
    .eq('provider_id', providerId)
    .gte('created_at', since)

  // Count by type
  const counts = { view: 0, click_phone: 0, click_website: 0, click_callback: 0, impression: 0 }
  const dailyViews: Record<string, number> = {}

  for (const event of events || []) {
    const type = event.event_type as keyof typeof counts
    if (type in counts) counts[type]++

    if (type === 'view') {
      const day = new Date(event.created_at).toISOString().split('T')[0]
      dailyViews[day] = (dailyViews[day] || 0) + 1
    }
  }

  // Build daily chart data (last 30 days, fill gaps with 0)
  const chartData = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    chartData.push({
      date: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: dailyViews[key] || 0,
    })
  }

  // Fetch recent callbacks
  const { data: callbacks } = await supabase
    .from('callback_requests')
    .select('id, parent_name, county, urgency, service_needed, created_at')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Count callbacks in last 30 days
  const { count: callbackCount } = await supabase
    .from('callback_requests')
    .select('id', { count: 'exact', head: true })
    .eq('provider_id', providerId)
    .gte('created_at', since)

  return {
    views: counts.view,
    clicks: counts.click_phone + counts.click_website,
    impressions: counts.impression,
    callbacks: callbackCount || 0,
    chartData,
    recentCallbacks: (callbacks || []).map(cb => ({
      id: cb.id,
      parentName: cb.parent_name,
      county: cb.county,
      urgency: cb.urgency,
      serviceNeeded: cb.service_needed,
      createdAt: cb.created_at,
    })),
  }
}

export default async function DashboardPage() {
  const session = await getProviderSession()
  if (!session) redirect('/dashboard/login')

  const data = await getDashboardData(session.provider.id)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Last 30 Days</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Profile Views" value={data.views} />
        <StatCard label="Phone & Web Clicks" value={data.clicks} />
        <StatCard label="Callback Requests" value={data.callbacks} />
        <StatCard label="Search Impressions" value={data.impressions} />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Profile Views</h2>
        <DashboardCharts data={data.chartData} />
      </div>

      {/* Recent Callbacks */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Callback Requests</h2>
        {data.recentCallbacks.length === 0 ? (
          <p className="text-gray-500">No callback requests yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recentCallbacks.map((cb) => (
              <div key={cb.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{cb.parentName}</p>
                  <p className="text-sm text-gray-500">
                    {cb.county} County &middot; {cb.serviceNeeded} &middot;{' '}
                    <span className={cb.urgency === 'asap' ? 'text-red-600 font-medium' : ''}>
                      {cb.urgency === 'asap' ? 'ASAP' : cb.urgency === 'this_month' ? 'This month' : 'Researching'}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(cb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
```

**Step 3: Create the chart client component**

Create `components/DashboardCharts.tsx`:

```typescript
'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  date: string
  label: string
  views: number
}

export function DashboardCharts({ data }: { data: ChartData[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="views" fill="#FF8A80" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add app/dashboard/page.tsx components/DashboardCharts.tsx package.json package-lock.json
git commit -m "feat: add provider analytics dashboard with stats, chart, and callbacks"
```

---

## Task 9: Add Dashboard Link to Site Navigation

**Files:**
- Modify: `app/layout.tsx` (add "Provider Login" link to nav)

**Step 1: Add link to navigation**

In `app/layout.tsx`, find the navigation section and add a "Provider Login" link that goes to `/dashboard/login`. Look for the existing nav links and add:

```typescript
<Link href="/dashboard/login" className="text-sm text-gray-600 hover:text-gray-900">
  Provider Login
</Link>
```

Place it near the "For Providers" or similar CTA in the header/nav area.

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add provider login link to site navigation"
```

---

## Task 10: Supabase Auth Configuration

**This task is manual — run SQL in Supabase dashboard.**

**Step 1: Run migrations in Supabase SQL Editor**

Go to Supabase Dashboard > SQL Editor and run:
1. `supabase/migrations/007_provider_events.sql`
2. `supabase/migrations/008_provider_auth.sql`

**Step 2: Enable magic link auth in Supabase**

Go to Supabase Dashboard > Authentication > Providers:
- Ensure "Email" provider is enabled
- Enable "Magic Link" (should be on by default)
- Set redirect URL: `https://www.georgiagapp.com/dashboard/auth/callback`

**Step 3: Add callback URL to Supabase Auth settings**

Go to Authentication > URL Configuration:
- Site URL: `https://www.georgiagapp.com`
- Redirect URLs: add `https://www.georgiagapp.com/dashboard/auth/callback`

**Step 4: Verify**

- Visit `/dashboard/login`
- Enter a claimed provider email
- Check for magic link email
- Click link → should redirect to `/dashboard`
- Dashboard should show empty stats (no events tracked yet)

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | provider_events table | migration + schema |
| 2 | Tracking API + helper | `/api/events/track`, `lib/track.ts` |
| 3 | Wire tracking to pages | TrackView, TrackImpression, TrackableLink, modify 3 existing files |
| 4 | auth_user_id migration | migration + schema |
| 5 | Login page + auth helper | `lib/auth.ts`, `/dashboard/login` |
| 6 | Auth callback | `/dashboard/auth/callback` |
| 7 | Dashboard layout | `/dashboard/layout.tsx`, signout route |
| 8 | Dashboard page | Stats, chart, callbacks, recharts |
| 9 | Nav link | Modify root layout |
| 10 | Supabase config | Manual — SQL + auth settings |
