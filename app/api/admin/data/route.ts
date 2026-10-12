import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-session'
import { createServiceClient } from '@/lib/supabase-service'

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
