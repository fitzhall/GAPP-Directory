import { describe, it, expect } from 'vitest'
import {
  pickPoolNumber,
  isConnectEligible,
  toE164,
  formatPhoneDisplay,
  connectPool,
  twimlConnectToAgency,
  twimlConnectToOperator,
  twimlWhisper,
  agencyUnavailable,
} from '@/lib/connect'

const now = new Date('2026-10-22T12:00:00Z')
const later = '2026-10-22T12:10:00Z'
const past = '2026-10-22T11:00:00Z'
const pool = ['+14045550001', '+14045550002']

describe('pickPoolNumber', () => {
  it('returns null with no pool', () => {
    expect(pickPoolNumber([], [], 'p1', now)).toBeNull()
  })
  it('reuses this listing\'s live number', () => {
    const r = pickPoolNumber(pool, [{ number: '+14045550002', provider_id: 'p1', expires_at: later }], 'p1', now)
    expect(r).toEqual({ number: '+14045550002', reused: true })
  })
  it('takes a free number before an expired one is considered taken', () => {
    const r = pickPoolNumber(pool, [{ number: '+14045550001', provider_id: 'p9', expires_at: later }], 'p1', now)
    expect(r).toEqual({ number: '+14045550002', reused: false })
  })
  it('treats an expired assignment as free', () => {
    const r = pickPoolNumber(pool, [
      { number: '+14045550001', provider_id: 'p9', expires_at: past },
      { number: '+14045550002', provider_id: 'p8', expires_at: later },
    ], 'p1', now)
    expect(r).toEqual({ number: '+14045550001', reused: false })
  })
  it('takes over the number that expires soonest when all are live', () => {
    const r = pickPoolNumber(pool, [
      { number: '+14045550001', provider_id: 'p9', expires_at: '2026-10-22T12:14:00Z' },
      { number: '+14045550002', provider_id: 'p8', expires_at: '2026-10-22T12:03:00Z' },
    ], 'p1', now)
    expect(r).toEqual({ number: '+14045550002', reused: false })
  })
  it('ignores assignments for numbers no longer in the pool', () => {
    const r = pickPoolNumber(['+14045550001'], [{ number: '+14045559999', provider_id: 'p1', expires_at: later }], 'p1', now)
    expect(r).toEqual({ number: '+14045550001', reused: false })
  })
})

describe('isConnectEligible', () => {
  it('is true for an unverified, unfeatured listing with a phone', () => {
    expect(isConnectEligible({ isVerified: false, isFeatured: false, phone: '(478) 508-9247' })).toBe(true)
  })
  it('is false for verified or featured listings', () => {
    expect(isConnectEligible({ isVerified: true, isFeatured: false, phone: '4785089247' })).toBe(false)
    expect(isConnectEligible({ isVerified: false, isFeatured: true, phone: '4785089247' })).toBe(false)
  })
  it('is false without a usable phone or when inactive', () => {
    expect(isConnectEligible({ isVerified: false, isFeatured: false, phone: null })).toBe(false)
    expect(isConnectEligible({ isVerified: false, isFeatured: false, phone: '123' })).toBe(false)
    expect(isConnectEligible({ isActive: false, isVerified: false, isFeatured: false, phone: '4785089247' })).toBe(false)
  })
})

describe('phone helpers', () => {
  it('converts US spellings to E.164', () => {
    expect(toE164('(678) 263-8540')).toBe('+16782638540')
    expect(toE164('1-678-263-8540')).toBe('+16782638540')
    expect(toE164('+16782638540')).toBe('+16782638540')
    expect(toE164('263-8540')).toBeNull()
  })
  it('formats for display', () => {
    expect(formatPhoneDisplay('+16782638540')).toBe('(678) 263-8540')
    expect(formatPhoneDisplay('+441234')).toBe('+441234')
  })
  it('reads the pool from the environment', () => {
    expect(connectPool({ TWILIO_CONNECT_NUMBERS: '+14045550001, 404-555-0002,,bad' } as NodeJS.ProcessEnv)).toEqual(['+14045550001', '+14045550002'])
    expect(connectPool({} as NodeJS.ProcessEnv)).toEqual([])
  })
})

describe('TwiML', () => {
  it('dials the agency with a whisper and an action, escaping the name', () => {
    const xml = twimlConnectToAgency({
      agencyName: "Lillie's Helpers & Co",
      agencyPhone: '+14785089247',
      actionUrl: 'https://www.georgiagapp.com/api/connect/status?leg=agency&sid=CA1',
      whisperUrl: 'https://www.georgiagapp.com/api/connect/whisper?name=Lillie',
    })
    expect(xml).toContain('Lillie&apos;s Helpers &amp; Co')
    expect(xml).toContain('<Dial timeout="25" action="https://www.georgiagapp.com/api/connect/status?leg=agency&amp;sid=CA1" method="POST">')
    expect(xml).toContain('<Number url="https://www.georgiagapp.com/api/connect/whisper?name=Lillie" method="POST">+14785089247</Number>')
  })
  it('dials the operator with the right line for each reason', () => {
    expect(twimlConnectToOperator({ operatorPhone: '+16782638540', reason: 'agency_unavailable' })).toContain('did not pick up')
    expect(twimlConnectToOperator({ operatorPhone: '+16782638540', reason: 'no_assignment' })).not.toContain('did not pick up')
    expect(twimlConnectToOperator({ operatorPhone: '+16782638540', reason: 'no_assignment' })).toContain('<Dial timeout="30">+16782638540</Dial>')
  })
  it('whispers the agency name', () => {
    expect(twimlWhisper('Jade Care')).toContain('A family is calling Jade Care from Georgia GAPP dot com.')
  })
  it('knows which dial outcomes mean the agency never answered', () => {
    expect(agencyUnavailable('no-answer')).toBe(true)
    expect(agencyUnavailable('busy')).toBe(true)
    expect(agencyUnavailable('completed')).toBe(false)
    expect(agencyUnavailable(null)).toBe(false)
  })
})
