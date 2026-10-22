import { NextRequest } from 'next/server'
import { config } from '@/lib/config'
import { isConnectEligible, toE164, twimlConnectToAgency, twimlConnectToOperator } from '@/lib/connect'
import { serviceClient, siteBase, readTwilioForm, twilioRequestIsValid, twimlResponse, SELECT_FOR_CONNECT, type ProviderForConnect } from '@/lib/connect-server'

// Twilio's Voice webhook for every pool number. Finds the listing live on the
// dialed number and forwards the call to it; with none live, the helpline.

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const params = await readTwilioForm(request)
  if (!twilioRequestIsValid(request, params)) {
    return twimlResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Reject/></Response>', 403)
  }

  const to = toE164(params.To || '') || params.To || ''
  const from = toE164(params.From || '') || params.From || null
  const callSid = params.CallSid || ''
  const base = siteBase()
  const operatorPhone = toE164(process.env.CONNECT_FALLBACK_PHONE || '') || config.contact.phoneRaw
  const supabase = serviceClient()

  try {
    const { data: assignment } = await supabase
      .from('connect_assignments')
      .select('provider_id, expires_at')
      .eq('number', to)
      .maybeSingle<{ provider_id: string; expires_at: string }>()

    let provider: ProviderForConnect | null = null
    if (assignment && new Date(assignment.expires_at) > new Date()) {
      const { data } = await supabase
        .from('providers')
        .select(SELECT_FOR_CONNECT)
        .eq('id', assignment.provider_id)
        .maybeSingle<ProviderForConnect>()
      provider = data
    }

    const agencyPhone = provider ? toE164(provider.intake_phone || provider.phone || '') : null
    const eligible =
      !!provider && !!agencyPhone &&
      isConnectEligible({ isActive: provider.is_active, isVerified: !!provider.is_verified, isFeatured: !!provider.is_featured, phone: agencyPhone })

    if (provider && agencyPhone && eligible) {
      await supabase.from('connect_calls').insert({
        call_sid: callSid, from_number: from, to_number: to, provider_id: provider.id, forwarded_to: 'agency',
      })
      await supabase.from('provider_events').insert({
        provider_id: provider.id, event_type: 'connect_call', metadata: { call_sid: callSid },
      })
      return twimlResponse(twimlConnectToAgency({
        agencyName: provider.name,
        agencyPhone,
        actionUrl: `${base}/api/connect/status?leg=agency`,
        whisperUrl: `${base}/api/connect/whisper?name=${encodeURIComponent(provider.name)}`,
      }))
    }

    await supabase.from('connect_calls').insert({
      call_sid: callSid, from_number: from, to_number: to, provider_id: null, forwarded_to: 'operator',
    })
    return twimlResponse(twimlConnectToOperator({
      operatorPhone,
      reason: 'no_assignment',
      actionUrl: `${base}/api/connect/status?leg=operator`,
    }))
  } catch (err) {
    // Never leave a family listening to silence: ring the helpline.
    console.error('connect/voice error:', err)
    return twimlResponse(twimlConnectToOperator({ operatorPhone, reason: 'no_assignment' }))
  }
}
