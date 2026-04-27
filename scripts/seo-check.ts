#!/usr/bin/env node
/**
 * SEO contract check. Walks app/**\/page.tsx, validates metadata against
 * an allowlist-aware contract. Phase A is report-only (exits 0). Flip
 * STRICT to true (or set SEO_CHECK_STRICT=1) to block builds.
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative, sep } from 'path'

const APP_DIR = join(process.cwd(), 'app')
const TITLE_MAX = 60
const DESC_MAX = 160
const STRICT_DEFAULT = false  // Phase A: report-only. Flipped to true in Task 7.
const STRICT =
  process.env.SEO_CHECK_STRICT === '1' ? true :
  process.env.SEO_CHECK_STRICT === '0' ? false :
  STRICT_DEFAULT

const EXCLUDED_DIRS = ['admin', 'dashboard', 'api', 'claim', 'availability']

// Pages required to have FAQPageSchema + BreadcrumbSchema + canonical.
// Mirrors high-priority entries in app/sitemap.ts (priority >= 0.7).
const SEO_CONTENT_PAGES = new Set([
  'app/georgia-pediatric-program/page.tsx',
  'app/gapp-providers-georgia/page.tsx',
  'app/gapp-home-care/page.tsx',
  'app/medically-fragile-children-care/page.tsx',
  'app/gapp-approval-guide/page.tsx',
  'app/gapp-approval-timeline/page.tsx',
  'app/gapp-medicaid-requirements/page.tsx',
  'app/why-gapp-applications-get-denied/page.tsx',
  'app/katie-beckett-waiver-georgia/page.tsx',
  'app/pediatric-home-nursing-georgia/page.tsx',
  'app/how-to-become-a-gapp-provider/page.tsx',
  'app/gapp-paid-caregiver/page.tsx',
  'app/gapp-vs-ccsp/page.tsx',
  'app/how-to-apply-for-gapp/page.tsx',
  'app/gapp-services-explained/page.tsx',
  'app/how-to-switch-gapp-providers/page.tsx',
  'app/gapp-respite-care/page.tsx',
  'app/long-term-care-children-georgia/page.tsx',
  'app/sick-child-care-georgia/page.tsx',
])

interface Violation {
  file: string
  rule: string
  message: string
}

function listPageFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const s = statSync(p)
    if (s.isDirectory()) {
      if (EXCLUDED_DIRS.includes(entry)) continue
      if (entry.startsWith('[')) continue  // dynamic routes
      out.push(...listPageFiles(p))
    } else if (entry === 'page.tsx') {
      out.push(p)
    }
  }
  return out
}

function extractMetadata(content: string): {
  title?: string
  description?: string
  canonical?: string
} {
  // Capture metadata export block. Non-greedy to first balanced-looking close.
  const blockMatch = content.match(/export\s+const\s+metadata[^=]*=\s*\{([\s\S]+?)\n\}\s*\n/)
  if (!blockMatch) return {}
  const block = blockMatch[1]

  const titleMatch = block.match(/^\s*title:\s*['"]([^'"]+)['"]/m)
  const descMatch = block.match(/^\s*description:\s*['"]([^'"]+)['"]/m)
  const canonicalMatch = block.match(/canonical:\s*['"]([^'"]+)['"]/)

  return {
    title: titleMatch?.[1],
    description: descMatch?.[1],
    canonical: canonicalMatch?.[1],
  }
}

function check(): Violation[] {
  const violations: Violation[] = []
  const pages = listPageFiles(APP_DIR)

  for (const file of pages) {
    const rel = relative(process.cwd(), file).split(sep).join('/')
    const content = readFileSync(file, 'utf-8')
    const meta = extractMetadata(content)

    if (meta.title !== undefined && meta.title.length > TITLE_MAX) {
      violations.push({
        file: rel,
        rule: 'title-length',
        message: `title is ${meta.title.length} chars (max ${TITLE_MAX}): "${meta.title.slice(0, 64)}${meta.title.length > 64 ? '…' : ''}"`,
      })
    }
    if (meta.description !== undefined && meta.description.length > DESC_MAX) {
      violations.push({
        file: rel,
        rule: 'desc-length',
        message: `description is ${meta.description.length} chars (max ${DESC_MAX})`,
      })
    }

    if (SEO_CONTENT_PAGES.has(rel)) {
      if (!meta.canonical) {
        violations.push({ file: rel, rule: 'canonical-missing', message: 'alternates.canonical not found' })
      }
      if (!content.includes('FAQPageSchema')) {
        violations.push({ file: rel, rule: 'faq-schema-missing', message: 'FAQPageSchema not used' })
      }
      if (!content.includes('BreadcrumbSchema')) {
        violations.push({ file: rel, rule: 'breadcrumb-schema-missing', message: 'BreadcrumbSchema not used' })
      }
    }
  }
  return violations
}

// ---- main ----
if (process.env.SKIP_SEO_CHECK === '1') {
  console.log('⚠ SEO check skipped (SKIP_SEO_CHECK=1)')
  process.exit(0)
}

const today = new Date().toISOString().split('T')[0]
console.log(`SEO Check — ${today}`)
console.log('='.repeat(40))

const violations = check()

if (violations.length === 0) {
  console.log('✓ All pages pass.')
  process.exit(0)
}

const byFile = new Map<string, Violation[]>()
for (const v of violations) {
  if (!byFile.has(v.file)) byFile.set(v.file, [])
  byFile.get(v.file)!.push(v)
}

for (const [file, vs] of byFile) {
  console.log(`\nERROR: ${file}`)
  for (const v of vs) console.log(`  → ${v.message}`)
}

console.log(`\n${byFile.size} pages with errors, ${violations.length} total violations`)

if (STRICT) {
  console.log('\nFAIL (strict mode)')
  process.exit(1)
} else {
  console.log('\n(report-only mode — set SEO_CHECK_STRICT=1 or flip STRICT_DEFAULT to block)')
  process.exit(0)
}
