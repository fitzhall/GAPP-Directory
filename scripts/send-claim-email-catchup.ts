// One-off (2026-11-04): send the new claim email to free agencies that claimed
// in the last 90 days and got the old "Claim Received" email (or none).
// Usage: npx tsx scripts/send-claim-email-catchup.ts [--send]
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { claimEmailHtml, claimEmailSubject } from '../lib/claim-email'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '')
}

const SKIP = new Set(['aubrey.crook@gmail.com']) // Homelogic said no to Sarah (do not contact)
const SEND = process.argv.includes('--send')

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const since = new Date(Date.now() - 90 * 864e5).toISOString()
  const { data, error } = await db
    .from('providers')
    .select('name, slug, claimed_by_email, claimer_name, counties_served')
    .eq('is_active', true).eq('is_claimed', true).eq('is_verified', false)
    .gte('claimed_at', since)
    .order('claimed_at', { ascending: false })
  if (error) throw error
  const rows = (data || []).filter(r => r.claimed_by_email && !SKIP.has(r.claimed_by_email.toLowerCase()))
  const resend = new Resend(process.env.RESEND_API_KEY)
  const replyTo = process.env.LEAD_NOTIFY_EMAIL || 'help@georgiagapp.com'
  for (const r of rows) {
    const html = claimEmailHtml({
      claimerName: r.claimer_name || '', agencyName: r.name, slug: r.slug,
      email: r.claimed_by_email, countiesServed: r.counties_served || [],
    })
    if (!SEND) { console.log(`DRY ${r.claimed_by_email} | ${r.name} | ${(r.counties_served || []).length} counties`); continue }
    const res = await resend.emails.send({
      from: 'GeorgiaGAPP.com <noreply@georgiagapp.com>', replyTo, to: r.claimed_by_email,
      subject: claimEmailSubject(r.name), html,
    })
    console.log(`SENT ${r.claimed_by_email} | ${r.name} |`, res.error ? `ERROR ${res.error.message}` : res.data?.id)
    await new Promise(ok => setTimeout(ok, 600))
  }
  console.log(`${rows.length} agencies, replies to ${replyTo === process.env.LEAD_NOTIFY_EMAIL ? 'LEAD_NOTIFY_EMAIL' : replyTo}`)
}
main().catch(e => { console.error(e); process.exit(1) })
