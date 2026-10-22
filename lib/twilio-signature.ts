import { createHmac, timingSafeEqual } from 'node:crypto'

// Twilio signs every webhook: base64(HMAC-SHA1(authToken, url + each POST
// param key+value in sorted key order)). The URL is the exact one Twilio was
// told to call, query string included.

export function twilioSignature(authToken: string, url: string, params: Record<string, string>): string {
  const data = url + Object.keys(params).sort().map(k => k + params[k]).join('')
  return createHmac('sha1', authToken).update(data, 'utf8').digest('base64')
}

export function validateTwilioSignature(
  authToken: string,
  url: string,
  params: Record<string, string>,
  signature: string | null | undefined
): boolean {
  if (!authToken || !signature) return false
  const expected = Buffer.from(twilioSignature(authToken, url, params))
  const given = Buffer.from(signature)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

/** The public URL Twilio called, built from the site base so proxies cannot change it. */
export function publicWebhookUrl(baseUrl: string, pathname: string, search: string): string {
  return baseUrl.replace(/\/$/, '') + pathname + (search || '')
}
