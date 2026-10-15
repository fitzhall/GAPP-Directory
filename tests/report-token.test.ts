import { describe, it, expect, beforeAll } from 'vitest'

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = 'test-secret'
  process.env.ADMIN_PASSWORD = 'pw'
  process.env.NEXT_PUBLIC_BASE_URL = 'https://georgiagapp.com' // ignored: report links always use www
})

describe('report token', () => {
  it('round-trips for the same slug', async () => {
    const { reportToken, verifyReportToken } = await import('@/lib/report-token')
    const t = reportToken('opulent-private-care-services')
    expect(t).toHaveLength(24)
    expect(verifyReportToken('opulent-private-care-services', t)).toBe(true)
  })
  it('fails for another slug, a case change, a truncated token, or none', async () => {
    const { reportToken, verifyReportToken } = await import('@/lib/report-token')
    const t = reportToken('opulent-private-care-services')
    expect(verifyReportToken('lowes-guardian-angel', t)).toBe(false)
    expect(verifyReportToken('Opulent-Private-Care-Services', t)).toBe(false)
    expect(verifyReportToken('opulent-private-care-services', t.slice(0, 23))).toBe(false)
    expect(verifyReportToken('opulent-private-care-services', undefined)).toBe(false)
    expect(verifyReportToken('opulent-private-care-services', '')).toBe(false)
  })
  it('builds the absolute URL', async () => {
    const { reportUrl, reportToken } = await import('@/lib/report-token')
    expect(reportUrl('lowes-guardian-angel')).toBe(
      `https://www.georgiagapp.com/report/lowes-guardian-angel?t=${reportToken('lowes-guardian-angel')}`
    )
  })
})
