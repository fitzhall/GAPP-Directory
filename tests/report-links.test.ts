import { describe, it, expect } from 'vitest'
import { parseCsv, toCsv, joinReportLinks } from '../scripts/report-links'

describe('report-links join', () => {
  it('adds a report_url column and fills it by slug, leaving unknown slugs blank', () => {
    const rows = parseCsv('name,slug,pitch\n"Acme, LLC",acme,"say ""hi"""\nBeta,beta,x\n')
    const { rows: out, matched } = joinReportLinks(rows, new Map([['acme', 'https://www.georgiagapp.com/report/acme?t=abc']]))
    expect(matched).toBe(1)
    expect(out[0]).toEqual(['name', 'slug', 'pitch', 'report_url'])
    expect(out[1][3]).toBe('https://www.georgiagapp.com/report/acme?t=abc')
    expect(out[2][3]).toBe('')
    expect(toCsv(out)).toBe('name,slug,pitch,report_url\n"Acme, LLC",acme,"say ""hi""",https://www.georgiagapp.com/report/acme?t=abc\nBeta,beta,x,\n')
  })
  it('refreshes an existing report_url column instead of adding a second one', () => {
    const rows = parseCsv('slug,report_url\nacme,old\n')
    const { rows: out } = joinReportLinks(rows, new Map([['acme', 'new']]))
    expect(out[0]).toEqual(['slug', 'report_url'])
    expect(out[1]).toEqual(['acme', 'new'])
  })
})
