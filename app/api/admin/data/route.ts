import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-service'
import { sendLeadEmail, type LeadForEmail } from '@/lib/lead-email'
import { validateMatchLead } from '@/lib/match-lead'
import { reportUrl } from '@/lib/report-token'

// Every database read and write the admin pages make, run on the server with
// the service role after the admin session is checked. The admin pages used
// to make these calls from the browser with the public key, which only worked
// because the database let the public key read and write everything.

const ADMIN_PROVIDER_COLUMNS =
  'id, name, slug, city, email, phone, website, services_offered, languages, is_claimed, is_verified, is_featured, accepting_new_patients, tier_level, created_at, claimed_at, counties_served, claimed_by_email, claimer_name, claimer_phone, claim_token, unverified_at, unverified_reason, downgraded_at, downgraded_reason, missed_checkin_at'

type Args = Record<string, unknown>
type Result = { data: unknown; error: string | null }

function asId(value: unknown): string {
  if (typeof value !== 'string' || !value) throw new Error('id is required')
  return value
}

function asObject(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} must be an object`)
  }
  const copy = { ...(value as Record<string, unknown>) }
  delete copy.id // never let an update rewrite a primary key
  return copy
}

// PostgREST returns at most 1,000 rows per request; page through the rest.
async function selectAll(
  build: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>
): Promise<Result> {
  const pageSize = 1000
  const rows: unknown[] = []
  for (let from = 0; from < 100_000; from += pageSize) {
    const { data, error } = await build(from, from + pageSize - 1)
    if (error) return { data: null, error: error.message }
    rows.push(...(data || []))
    if (!data || data.length < pageSize) break
  }
  return { data: rows, error: null }
}

async function run(op: string, args: Args): Promise<Result> {
  const db = createServiceClient()
  const wrap = ({ data, error }: { data: unknown; error: { message: string } | null }): Result => ({
    data,
    error: error ? error.message : null,
  })

  switch (op) {
    // app/admin/page.tsx
    case 'providers.list':
      return selectAll((from, to) =>
        db.from('providers').select(ADMIN_PROVIDER_COLUMNS).order('name').range(from, to)
      )
    case 'providers.details':
      return wrap(
        await db.from('providers').select('counties_served, languages').eq('id', asId(args.id)).single()
      )
    case 'providers.update':
      return wrap(
        await db.from('providers').update(asObject(args.updates, 'updates')).eq('id', asId(args.id))
      )

    // app/admin/leads/page.tsx
    case 'leads.list':
      return selectAll((from, to) =>
        db
          .from('callback_requests')
          .select('*, provider:providers(id, name, slug)')
          .order('created_at', { ascending: false })
          .range(from, to)
      )
    case 'leads.update':
      return wrap(
        await db.from('callback_requests').update(asObject(args.updates, 'updates')).eq('id', asId(args.id))
      )

    // Route a site-owned lead to a verified provider and email them.
    case 'leads.assign': {
      const id = asId(args.id)
      const providerId = asId(args.providerId)
      // Only active, verified providers may receive a family's details, and
      // only a lead nobody has yet; the UI enforces both, the op is the boundary.
      const { data: provider, error: pErr } = await db
        .from('providers')
        .select('id, name, email')
        .eq('id', providerId)
        .eq('is_active', true)
        .eq('is_verified', true)
        .maybeSingle()
      if (pErr || !provider) return { data: null, error: 'Provider not found or not verified' }

      const { data: lead, error: uErr } = await db
        .from('callback_requests')
        .update({ provider_id: providerId })
        .eq('id', id)
        .is('provider_id', null)
        .select('*, provider:providers(id, name, slug)')
        .maybeSingle()
      if (uErr) return { data: null, error: uErr.message }
      if (!lead) return { data: null, error: 'Lead not found or already assigned' }

      const email: 'sent' | 'no_email' | 'send_failed' = !provider.email
        ? 'no_email'
        : (await sendLeadEmail(provider.email, provider.name, lead as LeadForEmail)) ? 'sent' : 'send_failed'
      return { data: { lead, email }, error: null }
    }

    // The operator took a call and logs it so every lead is in one list.
    case 'leads.insertPhone': {
      const v = validateMatchLead({ ...args, smsConsent: true, sourcePage: '/admin/leads' })
      if (!v.ok) return { data: null, error: v.error }
      const l = v.lead
      const { data, error } = await db
        .from('callback_requests')
        .insert({
          parent_name: l.parentName,
          phone: l.phone,
          email: null,
          zip_code: '',
          county: l.county,
          service_needed: l.serviceNeeded,
          urgency: 'asap',
          special_needs: l.notes,
          provider_id: null,
          source: 'phone',
          source_page: null,
          status: 'contacted',
          contacted_at: new Date().toISOString(),
        })
        .select('*, provider:providers(id, name, slug)')
        .single()
      if (error) return { data: null, error: error.message }
      return { data, error: null }
    }

    // Verified providers who serve a county, Featured first.
    case 'providers.forCounty': {
      const county = typeof args.county === 'string' ? args.county : ''
      if (!county) return { data: [], error: null }
      return wrap(
        await db
          .from('providers')
          .select('id, name, slug, is_featured')
          .eq('is_active', true)
          .eq('is_verified', true)
          .contains('counties_served', [county])
          .order('is_featured', { ascending: false })
          .order('name')
      )
    }

    // Every active listing's signed report link, for the sales call lists.
    case 'providers.reportLinks': {
      const r = await selectAll((from, to) =>
        db.from('providers').select('name, slug').eq('is_active', true).order('name').range(from, to)
      )
      if (r.error) return r
      const rows = (r.data as { name: string; slug: string }[]).map(p => ({ ...p, url: reportUrl(p.slug) }))
      return { data: rows, error: null }
    }

    case 'providers.reportLink': {
      const slug = typeof args.slug === 'string' ? args.slug : ''
      if (!slug) return { data: null, error: 'slug is required' }
      return { data: { url: reportUrl(slug) }, error: null }
    }

    // app/admin/requests/page.tsx
    case 'requests.list':
      return selectAll((from, to) =>
        db.from('listing_requests').select('*').order('created_at', { ascending: false }).range(from, to)
      )
    case 'requests.update':
      return wrap(
        await db.from('listing_requests').update(asObject(args.updates, 'updates')).eq('id', asId(args.id))
      )
    case 'providers.insert':
      return wrap(
        await db.from('providers').insert(asObject(args.values, 'values')).select().single()
      )

    // app/admin/analytics/page.tsx
    case 'analytics.load': {
      const since = typeof args.since === 'string' ? args.since : new Date(0).toISOString()
      const [events, providers, callbacks] = await Promise.all([
        selectAll((from, to) =>
          db
            .from('provider_events')
            .select('provider_id, event_type, created_at')
            .gte('created_at', since)
            .order('created_at')
            .range(from, to)
        ),
        selectAll((from, to) =>
          db
            .from('providers')
            .select('id, name, slug, city, is_claimed, is_verified, is_featured, tier_level')
            .eq('is_active', true)
            .order('name')
            .range(from, to)
        ),
        selectAll((from, to) =>
          db
            .from('callback_requests')
            .select('id, parent_name, county, urgency, service_needed, created_at, provider_id')
            .gte('created_at', since)
            .order('created_at', { ascending: false })
            .range(from, to)
        ),
      ])
      const error = events.error || providers.error || callbacks.error
      return {
        data: { events: events.data, providers: providers.data, callbacks: callbacks.data },
        error,
      }
    }

    default:
      return { data: null, error: `Unknown operation: ${op}` }
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request)
  if (denied) return denied

  try {
    const { op, args } = await request.json()
    if (typeof op !== 'string') {
      return NextResponse.json({ data: null, error: 'op is required' }, { status: 400 })
    }
    const result = await run(op, (args || {}) as Args)
    return NextResponse.json(result, { status: result.error ? 400 : 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Admin data error:', error)
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
