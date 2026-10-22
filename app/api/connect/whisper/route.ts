import { NextRequest } from 'next/server'
import { twimlWhisper } from '@/lib/connect'
import { readTwilioForm, twilioRequestIsValid, twimlResponse } from '@/lib/connect-server'

// What the agency hears when it picks up, before the family is joined.

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const params = await readTwilioForm(request)
  if (!twilioRequestIsValid(request, params)) {
    return twimlResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>', 403)
  }
  const name = (request.nextUrl.searchParams.get('name') || 'a GAPP agency').slice(0, 120)
  return twimlResponse(twimlWhisper(name))
}
