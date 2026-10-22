import { describe, it, expect } from 'vitest'
import { createHmac } from 'node:crypto'
import { twilioSignature, validateTwilioSignature, publicWebhookUrl } from '@/lib/twilio-signature'

const token = '12345'
const url = 'https://www.georgiagapp.com/api/connect/voice?x=1'
const params = { To: '+14045550001', From: '+16785551212', CallSid: 'CA123' }

describe('twilio signature', () => {
  it('matches Twilio\'s documented scheme: url + sorted key/value pairs, HMAC-SHA1, base64', () => {
    const expected = createHmac('sha1', token).update(url + 'CallSidCA123From+16785551212To+14045550001').digest('base64')
    expect(twilioSignature(token, url, params)).toBe(expected)
  })
  it('validates a correct signature and rejects a tampered one', () => {
    const sig = twilioSignature(token, url, params)
    expect(validateTwilioSignature(token, url, params, sig)).toBe(true)
    expect(validateTwilioSignature(token, url, { ...params, To: '+14045550002' }, sig)).toBe(false)
    expect(validateTwilioSignature(token, url + '&y=2', params, sig)).toBe(false)
    expect(validateTwilioSignature(token, url, params, null)).toBe(false)
    expect(validateTwilioSignature('', url, params, sig)).toBe(false)
  })
  it('builds the public webhook URL from the site base', () => {
    expect(publicWebhookUrl('https://www.georgiagapp.com/', '/api/connect/voice', '?a=1')).toBe('https://www.georgiagapp.com/api/connect/voice?a=1')
    expect(publicWebhookUrl('https://www.georgiagapp.com', '/api/connect/voice', '')).toBe('https://www.georgiagapp.com/api/connect/voice')
  })
})
