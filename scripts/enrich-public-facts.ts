/**
 * Fills the public-fact columns on providers from two public records:
 *   - the NPI registry (npiregistry.cms.hhs.gov, organizations in Georgia)
 *   - the Georgia DCH GAPP provider list, Appendix P dated 2026-08-15
 *
 * Usage:
 *   npx tsx scripts/enrich-public-facts.ts --dry-run      # match, write the review CSV, change nothing
 *   npx tsx scripts/enrich-public-facts.ts                # match and apply to rows not yet checked
 *   npx tsx scripts/enrich-public-facts.ts --all          # re-check every active row
 *   npx tsx scripts/enrich-public-facts.ts --limit 20
 *
 * Review CSV: outreach/2026-10-22-public-facts/npi-matches.csv
 * Matching rules live in lib/public-facts.ts and are deliberately strict.
 */
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pickNpiMatch, normalizeOrgName, type NpiCandidate } from '../lib/public-facts'

loadEnv({ path: '.env.local' })

const STATE_LIST_DATE = '2026-08-15'
const STATE_LIST_CSV = 'outreach/2026-09-appendix-p/appendix-p-2026-08-15-email-list.csv'
const OUT_DIR = 'outreach/2026-10-22-public-facts'
const NPI_API = 'https://npiregistry.cms.hhs.gov/api/'

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const ALL = args.includes('--all')
const limitIdx = args.indexOf('--limit')
const LIMIT = limitIdx >= 0 ? Number(args[limitIdx + 1]) : Infinity

type Row = {
  id: string
  name: string
  slug: string
  city: string | null
  phone: string | null
  intake_phone: string | null
  address: string | null
  facts_checked_at: string | null
  npi: string | null
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') { row.push(cell); cell = '' }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (ch !== '\r') cell += ch
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row) }
  const [header, ...body] = rows
  return body.filter(r => r.length > 1).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])))
}

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

function searchTerms(name: string): string[] {
  // The registry matches the stored spelling, so "LILLIE'S HELPERS" and
  // "LILLIES HELPERS" are different searches. Try the raw first three words
  // and the normalized ones; the registry wants at least two characters
  // before the trailing "*".
  const raw = name.toUpperCase().replace(/[’`]/g, "'").replace(/[,.]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 3).join(' ')
  const norm = normalizeOrgName(name).split(' ').filter(Boolean).slice(0, 3).join(' ')
  return [...new Set([raw, norm])].filter(t => t.length >= 2).map(t => `${t}*`)
}

async function npiCandidates(name: string): Promise<NpiCandidate[]> {
  const seen = new Map<string, NpiCandidate>()
  for (const term of searchTerms(name)) {
    const url = `${NPI_API}?version=2.1&enumeration_type=NPI-2&state=GA&limit=200&organization_name=${encodeURIComponent(term)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`NPI API ${res.status} for ${term}`)
    const json = (await res.json()) as { results?: NpiApiResult[] }
    for (const c of toCandidates(json.results || [])) seen.set(c.npi, c)
    await sleep(120)
  }
  return [...seen.values()]
}

function toCandidates(results: NpiApiResult[]): NpiCandidate[] {
  return results.map(r => {
    const loc = r.addresses?.find(a => a.address_purpose === 'LOCATION') || r.addresses?.[0]
    const tax = r.taxonomies?.find(t => t.primary) || r.taxonomies?.[0]
    const b = r.basic || {}
    const officialName = [b.authorized_official_first_name, b.authorized_official_last_name].filter(Boolean).join(' ') || null
    return {
      npi: String(r.number),
      name: b.organization_name || '',
      enumerationDate: b.enumeration_date || null,
      taxonomy: tax?.desc || null,
      officialName,
      officialTitle: b.authorized_official_title_or_position || null,
      city: loc?.city || null,
      state: loc?.state || null,
      zip: loc?.postal_code || null,
      street: loc?.address_1 || null,
      phone: loc?.telephone_number || null,
    }
  })
}

type NpiApiResult = {
  number: number | string
  basic?: {
    organization_name?: string
    enumeration_date?: string
    authorized_official_first_name?: string
    authorized_official_last_name?: string
    authorized_official_title_or_position?: string
  }
  addresses?: { address_purpose: string; address_1?: string; city?: string; state?: string; postal_code?: string; telephone_number?: string }[]
  taxonomies?: { desc?: string; primary?: boolean }[]
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are needed (.env.local)')
  const supabase = createClient(url, key)

  // State list, keyed by directory slug.
  const stateRows = parseCsv(readFileSync(STATE_LIST_CSV, 'utf8'))
  const stateBySlug = new Map<string, { coverage: string }>()
  for (const r of stateRows) {
    if (r.directory_slug) stateBySlug.set(r.directory_slug, { coverage: (r.counties || '').trim().slice(0, 500) })
  }
  console.log(`State list: ${stateRows.length} rows, ${stateBySlug.size} joined to a directory slug`)

  const { data, error } = await supabase
    .from('providers')
    .select('id, name, slug, city, phone, intake_phone, address, facts_checked_at, npi')
    .eq('is_active', true)
    .order('name')
  if (error) throw error
  const rows = (data || []) as Row[]
  const todo = rows.filter(r => ALL || !r.facts_checked_at).slice(0, LIMIT)
  console.log(`Providers: ${rows.length} active, ${todo.length} to check${DRY ? ' (dry run)' : ''}`)

  mkdirSync(OUT_DIR, { recursive: true })
  const review: string[] = ['slug,name,city,phone,match_npi,match_name,match_city,match_phone,enumeration_date,taxonomy,official,candidates,on_state_list,applied']
  let matched = 0
  let onList = 0
  let applied = 0

  for (const [i, p] of todo.entries()) {
    let candidates: NpiCandidate[] = []
    try {
      candidates = await npiCandidates(p.name)
    } catch (e) {
      console.error(`  ${p.slug}: ${(e as Error).message}`)
    }
    const m = pickNpiMatch({ name: p.name, city: p.city, phone: p.intake_phone || p.phone, address: p.address, slug: p.slug }, candidates)
    const state = stateBySlug.get(p.slug) || null
    if (m) matched++
    if (state) onList++

    const update = {
      npi: m?.npi ?? null,
      npi_enumeration_date: m?.enumerationDate ?? null,
      npi_taxonomy: m?.taxonomy ?? null,
      npi_official_name: m?.officialName ?? null,
      npi_official_title: m?.officialTitle ?? null,
      state_list_date: state ? STATE_LIST_DATE : null,
      state_list_coverage: state?.coverage || null,
      facts_checked_at: new Date().toISOString(),
    }

    let ok = false
    if (!DRY) {
      const { error: upErr } = await supabase.from('providers').update(update).eq('id', p.id)
      if (upErr) console.error(`  ${p.slug}: update failed: ${upErr.message}`)
      else { ok = true; applied++ }
    }

    review.push([
      p.slug, p.name, p.city, p.intake_phone || p.phone, m?.npi, m?.name, m?.city, m?.phone, m?.enumerationDate, m?.taxonomy,
      m ? `${m.officialName || ''} ${m.officialTitle || ''}`.trim() : '', candidates.length, state ? 'yes' : 'no', ok ? 'yes' : 'no',
    ].map(csvCell).join(','))

    if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${todo.length} checked, ${matched} NPI matches so far`)
    await sleep(150)
  }

  const out = `${OUT_DIR}/npi-matches${DRY ? '-dry-run' : ''}.csv`
  writeFileSync(out, review.join('\n') + '\n')
  console.log(`\nDone. NPI matched ${matched}/${todo.length}, on state list ${onList}/${todo.length}, applied ${applied}.`)
  console.log(`Review: ${out}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
