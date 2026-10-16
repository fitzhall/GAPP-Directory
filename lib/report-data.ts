import { createServiceClient } from '@/lib/supabase-service'

// Numbers behind /report/[slug]: what one listing got in the last 90 days,
// and what verified listings in the same counties typically get.

export type EventCounts = {
  views: number
  impressions: number
  phoneClicks: number
  websiteClicks: number
  callbackClicks: number
  helplineClicks: number
}

export type ReportData = {
  provider: {
    id: string
    name: string
    slug: string
    city: string
    counties: string[]
    isClaimed: boolean
    isVerified: boolean
    isFeatured: boolean
    hasWebsite: boolean
  }
  since: string
  days: 90
  you: EventCounts & { leads: number }
  peers: { count: number; views: number; phoneClicks: number; scope: 'counties' | 'sitewide' }
}

export const REPORT_DAYS = 90 as const

export function emptyCounts(): EventCounts {
  return { views: 0, impressions: 0, phoneClicks: 0, websiteClicks: 0, callbackClicks: 0, helplineClicks: 0 }
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

const FIELD: Record<string, keyof EventCounts> = {
  view: 'views',
  impression: 'impressions',
  click_phone: 'phoneClicks',
  click_website: 'websiteClicks',
  click_callback: 'callbackClicks',
  click_helpline: 'helplineClicks',
}

export function summarizeEvents(rows: { provider_id: string; event_type: string }[]): Record<string, EventCounts> {
  const out: Record<string, EventCounts> = {}
  for (const r of rows) {
    const field = FIELD[r.event_type]
    if (!field) continue
    out[r.provider_id] ||= emptyCounts()
    out[r.provider_id][field]++
  }
  return out
}

export function peerMedians(counts: Record<string, EventCounts>, peerIds: string[]) {
  const views = peerIds.map(id => counts[id]?.views ?? 0)
  const phones = peerIds.map(id => counts[id]?.phoneClicks ?? 0)
  return { count: peerIds.length, views: median(views), phoneClicks: median(phones) }
}

const MIN_PEERS = 3

export async function getReportData(slug: string): Promise<ReportData | null> {
  const db = createServiceClient()
  const since = new Date(Date.now() - REPORT_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: p } = await db
    .from('providers')
    .select('id, name, slug, city, counties_served, website, is_active, is_claimed, is_verified, is_featured')
    .eq('slug', slug)
    .maybeSingle()
  if (!p || !p.is_active) return null

  const counties: string[] = p.counties_served || []

  // Verified, active peers sharing a county; fall back to all verified.
  const verified = () => db.from('providers').select('id').eq('is_active', true).eq('is_verified', true).neq('id', p.id)
  let scope: 'counties' | 'sitewide' = counties.length ? 'counties' : 'sitewide'
  let peers = (counties.length ? await verified().overlaps('counties_served', counties) : await verified()).data || []
  if (scope === 'counties' && peers.length < MIN_PEERS) {
    scope = 'sitewide'
    peers = (await verified()).data || []
  }
  const peerIds = peers.map(x => x.id)

  // PostgREST returns at most 1,000 rows per request, and impressions alone
  // can exceed that for a Featured provider plus its peers, so page through.
  const events: { provider_id: string; event_type: string }[] = []
  const pageSize = 1000
  for (let from = 0; from < 100_000; from += pageSize) {
    const { data } = await db
      .from('provider_events')
      .select('provider_id, event_type')
      .in('provider_id', [p.id, ...peerIds])
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .range(from, from + pageSize - 1)
    events.push(...(data || []))
    if (!data || data.length < pageSize) break
  }
  const counts = summarizeEvents(events)

  const { count: leads } = await db
    .from('callback_requests')
    .select('id', { count: 'exact', head: true })
    .eq('provider_id', p.id)
    .gte('created_at', since)

  return {
    provider: {
      id: p.id,
      name: p.name,
      slug: p.slug,
      city: p.city || '',
      counties,
      isClaimed: !!p.is_claimed,
      isVerified: !!p.is_verified,
      isFeatured: !!p.is_featured,
      hasWebsite: !!p.website,
    },
    since,
    days: REPORT_DAYS,
    you: { ...(counts[p.id] || emptyCounts()), leads: leads || 0 },
    peers: { ...peerMedians(counts, peerIds), scope },
  }
}
