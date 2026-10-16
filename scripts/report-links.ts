// Joins the admin "Export Report Links" CSV (name, slug, report_url) into the
// two call-list CSVs by slug, adding/refreshing a report_url column.
//   npx tsx scripts/report-links.ts ~/Downloads/gapp-report-links-2026-10-15.csv
// The export is made in /admin on production, so the links are signed with
// production's secret and verify there. Re-export and re-run if the admin
// password or ADMIN_USERS ever changes.
import { readFileSync, writeFileSync } from 'node:fs'

const FILES = [
  'outreach/2026-10-15-call-lists/claimed-dial-sheet.csv',
  'outreach/2026-10-15-call-lists/hot-unclaimed.csv',
]

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') { row.push(cell); cell = '' }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (ch !== '\r') cell += ch
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row) }
  return rows
}

export function toCsv(rows: string[][]): string {
  const q = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  return rows.map(r => r.map(q).join(',')).join('\n') + '\n'
}

/** Returns the rows with a report_url column filled from `links` (slug → url). */
export function joinReportLinks(rows: string[][], links: Map<string, string>): { rows: string[][]; matched: number } {
  const header = rows[0]
  const slugIdx = header.indexOf('slug')
  if (slugIdx < 0) throw new Error('no slug column')
  let urlIdx = header.indexOf('report_url')
  if (urlIdx < 0) { header.push('report_url'); urlIdx = header.length - 1 }
  let matched = 0
  for (const r of rows.slice(1)) {
    if (!r.length || !r[slugIdx]) continue
    while (r.length <= urlIdx) r.push('')
    const url = links.get(r[slugIdx])
    if (url) { r[urlIdx] = url; matched++ }
  }
  return { rows, matched }
}

function main() {
  const exportPath = process.argv[2]
  if (!exportPath) {
    console.error('usage: npx tsx scripts/report-links.ts <gapp-report-links-YYYY-MM-DD.csv>')
    process.exit(2)
  }
  const exp = parseCsv(readFileSync(exportPath, 'utf8'))
  const h = exp[0]
  const si = h.indexOf('slug'), ui = h.indexOf('report_url')
  if (si < 0 || ui < 0) throw new Error(`${exportPath}: expected columns slug and report_url`)
  const links = new Map(exp.slice(1).filter(r => r[si]).map(r => [r[si], r[ui]] as [string, string]))

  for (const file of FILES) {
    const { rows, matched } = joinReportLinks(parseCsv(readFileSync(file, 'utf8')), links)
    writeFileSync(file, toCsv(rows))
    console.log(`${file}: ${rows.length - 1} rows, ${matched} report_url set`)
  }
}

if (process.argv[1] && process.argv[1].endsWith('report-links.ts')) main()
