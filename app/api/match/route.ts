import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-service'
import { validateMatchLead, dedupWindowStart } from '@/lib/match-lead'
import { sendOperatorLeadEmail } from '@/lib/operator-email'

// A family on an unclaimed listing (or a content page) asks GeorgiaGAPP to
// match them with a provider. The row has no provider until an admin
// assigns one from /admin/leads.
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const result = validateMatchLead(body)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  const lead = result.lead

  try {
    const db = createServiceClient()

    const { data: existing } = await db
      .from('callback_requests')
      .select('id')
      .eq('source', 'match_form')
      .eq('phone', lead.phone)
      .gte('created_at', dedupWindowStart(new Date()))
      .limit(1)
      .maybeSingle()
    if (existing) return NextResponse.json({ success: true, id: existing.id, deduped: true })

    const { data: inserted, error } = await db
      .from('callback_requests')
      .insert({
        parent_name: lead.parentName,
        phone: lead.phone,
        email: null,
        zip_code: '',
        county: lead.county,
        service_needed: lead.serviceNeeded,
        urgency: 'asap',
        special_needs: lead.notes,
        provider_id: null,
        source: 'match_form',
        source_page: lead.sourcePage,
        status: 'new',
      })
      .select('id')
      .single()

    if (error || !inserted) {
      console.error('match insert failed:', error)
      return NextResponse.json({ error: 'Could not save your request. Please call us.' }, { status: 500 })
    }

    await sendOperatorLeadEmail(lead, 'match_form')

    return NextResponse.json({ success: true, id: inserted.id })
  } catch (err) {
    console.error('match route error:', err)
    return NextResponse.json({ error: 'Could not save your request. Please call us.' }, { status: 500 })
  }
}
