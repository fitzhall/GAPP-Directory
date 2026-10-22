import { NextRequest } from 'next/server'
import { config } from '@/lib/config'
import { agencyUnavailable, toE164, twimlConnectToOperator, twimlHangup } from '@/lib/connect'
import { sendConnectCallEmail } from '@/lib/connect-email'
import { serviceClient, siteBase, readTwilioForm, twilioRequestIsValid, twimlResponse } from '@/lib/connect-server'

// <Dial action> callback. After the agency leg: record the outcome, email the
// operator, and if the agency never answered, ring the helpline instead.

export const dynamic = 'force-dynamic'

type CallRow = {
  id: string
  call_sid: string
  from_number: string | null
  provider_id: string | null
  forwarded_to: 'agency' | 'operator'
  fell_back: boolean
  dial_status: string | null
}

export async function POST(request: NextRequest) {
  const params = await readTwilioForm(request)
  if (!twilioRequestIsValid(request, params)) {
    return twimlResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>', 403)
  }

  const leg = request.nextUrl.searchParams.get('leg') === 'operator' ? 'operator' : 'agency'
  const callSid = params.CallSid || ''
  const dialStatus = (params.DialCallStatus || '').toLowerCase() || null
  const duration = params.DialCallDuration ? Number(params.DialCallDuration) : null
  const operatorPhone = toE164(process.env.CONNECT_FALLBACK_PHONE || '') || config.contact.phoneRaw
  const supabase = serviceClient()

  try {
    const { data: row } = await supabase
      .from('connect_calls')
      .select('id, call_sid, from_number, provider_id, forwarded_to, fell_back, dial_status')
      .eq('call_sid', callSid)
      .maybeSingle<CallRow>()

    let agency: { name: string; slug: string } | null = null
    if (row?.provider_id) {
      const { data } = await supabase.from('providers').select('name, slug').eq('id', row.provider_id).maybeSingle<{ name: string; slug: string }>()
      agency = data
    }

    if (leg === 'agency') {
      const fellBack = agencyUnavailable(dialStatus)
      if (row) {
        await supabase
          .from('connect_calls')
          .update({ dial_status: dialStatus, duration_seconds: duration, fell_back: fellBack, updated_at: new Date().toISOString() })
          .eq('id', row.id)
      }
      await sendConnectCallEmail({
        from: row?.from_number ?? (params.From ? toE164(params.From) : null),
        agencyName: agency?.name ?? null,
        agencySlug: agency?.slug ?? null,
        dialStatus,
        durationSeconds: duration,
        fellBack,
        forwardedTo: 'agency',
      })
      if (fellBack) {
        return twimlResponse(twimlConnectToOperator({
          operatorPhone,
          reason: 'agency_unavailable',
          actionUrl: `${siteBase()}/api/connect/status?leg=operator`,
        }))
      }
      return twimlResponse(twimlHangup())
    }

    // Operator leg finished. Only a call that never had a listing is news;
    // a fallback call was already emailed when the agency leg ended.
    if (row && row.forwarded_to === 'operator') {
      await supabase
        .from('connect_calls')
        .update({ dial_status: dialStatus, duration_seconds: duration, updated_at: new Date().toISOString() })
        .eq('id', row.id)
      await sendConnectCallEmail({
        from: row.from_number,
        agencyName: null,
        agencySlug: null,
        dialStatus,
        durationSeconds: duration,
        fellBack: false,
        forwardedTo: 'operator',
      })
    }
    return twimlResponse(twimlHangup())
  } catch (err) {
    console.error('connect/status error:', err)
    return twimlResponse(twimlHangup())
  }
}
