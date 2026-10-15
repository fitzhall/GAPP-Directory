# Match Leads, Helpline CTA, and Provider Reports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture the families who land on unclaimed provider pages (phone first, short form second), route those leads to verified providers from admin, and give every provider a signed traffic-report link the operator can text during sales calls.

**Architecture:** Leads with no provider live in the existing `callback_requests` table (`provider_id` becomes nullable, plus `source` and `source_page`). A new `/api/match` route and two components (`HelplineCta`, `MatchForm`) render on unclaimed provider pages and five informational pages. Admin gets a "Needs match" view with assign-and-email. A public `/report/[slug]?t=` page is gated by an HMAC token derived from the existing admin signing secret and reads `provider_events` with the service role.

**Tech Stack:** Next.js 14.2.5 App Router, TypeScript strict, Tailwind, Supabase (service role on the server, `@supabase/supabase-js` 2.x), Resend 6, Vitest (new) for unit tests, `tsx` for scripts.

**Spec:** `docs/superpowers/specs/2026-10-15-match-leads-and-provider-reports-design.md`

## Global Constraints

- Branch `feat/match-leads-and-reports`, based on `main` at `3254fd4`. Never commit to `main`.
- New site phone: display `(678) 263-8540`, raw `+16782638540`. The old `(770) 746-3176` / `+17707463176` must not remain anywhere.
- All family-facing copy at a 5th-grade reading level, plain English, no AI tells (memory `feedback_content_voice_5th_grade.md`; `ANTI-AI-STYLE-GUIDE.md`). Sentence case for headings in the body.
- Claimed-unverified and verified provider pages are not changed.
- Public (anon) key reads only `PUBLIC_PROVIDER_COLUMNS`; every new server read of private data uses `createServiceClient()` from `lib/supabase-service.ts`.
- The migration is applied to production only after the operator approves the exact SQL (memory `project_security_lockdown_2026_10_12`).
- `npm run build` runs `scripts/seo-check.ts`; no new page may be added to the sitemap, and `/report` is `noindex`.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- `/report/[slug]` must not appear in nav, footer, sitemap, or any internal link.

## Review Focus

1. **Phone numbers typed with punctuation or a leading +1** (`(404) 555-1212`, `+1 404 555 1212`, `404.555.1212`): all must save as one normalised form and dedup against each other. Test in Task 2 (`normalizePhone`).
2. **County values that are not Georgia counties** (a tampered POST with `county: "<script>"` or `"Unknown"`): the API must reject with 400, not store garbage the admin then has to clean. Test in Task 2 (`validateMatchLead` rejects unknown county).
3. **A second submit of the same form within 30 minutes** (double tap, retry after a slow network): one row, one email. Test in Task 2 (`dedupWindowStart`) and the route check in Task 4.
4. **A report link whose slug was edited** (`/report/opulent-private-care-services?t=<token for another slug>`, or the slug upper-cased): must 404, never show another provider's numbers. Test in Task 10 (`verifyReportToken` wrong slug, case change, truncated token).
5. **Assigning a lead to a provider that has no email on file**: the assignment must still save, and the admin must be told no email went out, rather than a silent success. Test in Task 8 (`leads.assign` returns `emailed: false`).

---

### Task 1: New site phone number

**Files:**
- Modify: `lib/config.ts:116-121`

**Interfaces:**
- Produces: `config.contact.phone === '(678) 263-8540'`, `config.contact.phoneRaw === '+16782638540'`. Tasks 5 and 12 read these.

- [ ] **Step 1: Change the number**

In `lib/config.ts`, inside `contact: { … }`, replace

```ts
    phone: '(770) 746-3176',
    phoneRaw: '+17707463176',
```

with

```ts
    phone: '(678) 263-8540',
    phoneRaw: '+16782638540',
```

- [ ] **Step 2: Verify no hardcoded copies of the old number remain**

Run: `grep -rn '746-3176\|7707463176\|770) 746' app components lib public --include='*.ts' --include='*.tsx' --include='*.html' --include='*.txt' --include='*.xml' | grep -v node_modules`

Expected: no output. If any file prints, replace that literal with `config.contact.phone` / `config.contact.phoneRaw` (import `config` from `@/lib/config`).

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/config.ts
git commit -m "fix(contact): new site phone number 678-263-8540

The old number no longer works. Footer, /contact, /privacy and /terms all
read config.contact, so one change covers them.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Vitest, migration 014, and the pure lead helpers

**Files:**
- Create: `vitest.config.ts`
- Create: `supabase/migrations/014_match_leads.sql`
- Create: `lib/match-lead.ts`
- Create: `tests/match-lead.test.ts`
- Modify: `package.json` (scripts + devDependencies)
- Modify: `tsconfig.json` (exclude `tests`)

**Interfaces:**
- Produces:
  - `normalizePhone(raw: string): string` → ten digits or `''`.
  - `formatPhone(digits: string): string` → `(404) 555-1212`.
  - `validateMatchLead(body: unknown): { ok: true; lead: MatchLead } | { ok: false; error: string }`.
  - `type MatchLead = { parentName: string; phone: string; county: string; serviceNeeded: 'RN'|'LPN'|'PCS'|'not_sure'; notes: string | null; sourcePage: string }` (phone already formatted).
  - `dedupWindowStart(now: Date, minutes?: number): string` ISO string.
  - `GEORGIA_COUNTY_NAMES: string[]` display names, e.g. `'Fulton'`, `'Ben Hill'`, `'DeKalb'`.
- Consumes: `GEORGIA_COUNTIES` and `formatCountyName` from `lib/county-data.ts` (slugs → display names).

- [ ] **Step 1: Install Vitest and wire `npm test`**

Run: `npm install --save-dev vitest@2.1.9`

Edit `package.json` scripts to add:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
```

In `tsconfig.json`, change `"exclude": ["node_modules", "scripts"]` to `"exclude": ["node_modules", "scripts", "tests", "vitest.config.ts"]` so `next build` does not type-check test files.

- [ ] **Step 2: Write the failing tests**

Create `tests/match-lead.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  normalizePhone,
  formatPhone,
  validateMatchLead,
  dedupWindowStart,
  GEORGIA_COUNTY_NAMES,
} from '@/lib/match-lead'

describe('normalizePhone', () => {
  it('strips punctuation', () => {
    expect(normalizePhone('(404) 555-1212')).toBe('4045551212')
    expect(normalizePhone('404.555.1212')).toBe('4045551212')
  })
  it('drops a leading country code 1', () => {
    expect(normalizePhone('+1 404 555 1212')).toBe('4045551212')
    expect(normalizePhone('14045551212')).toBe('4045551212')
  })
  it('returns empty for too few digits', () => {
    expect(normalizePhone('555-1212')).toBe('')
    expect(normalizePhone('')).toBe('')
  })
})

describe('formatPhone', () => {
  it('formats ten digits', () => {
    expect(formatPhone('4045551212')).toBe('(404) 555-1212')
  })
})

describe('GEORGIA_COUNTY_NAMES', () => {
  it('has 159 display names including the odd spellings', () => {
    expect(GEORGIA_COUNTY_NAMES).toHaveLength(159)
    expect(GEORGIA_COUNTY_NAMES).toContain('Fulton')
    expect(GEORGIA_COUNTY_NAMES).toContain('DeKalb')
    expect(GEORGIA_COUNTY_NAMES).toContain('Ben Hill')
  })
})

const good = {
  parentName: 'Maria Lopez',
  phone: '+1 (404) 555-1212',
  county: 'Fulton',
  serviceNeeded: 'LPN',
  notes: 'Nights only',
  sourcePage: '/provider/some-agency',
  smsConsent: true,
}

describe('validateMatchLead', () => {
  it('accepts a complete body and normalises the phone', () => {
    const r = validateMatchLead(good)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.lead.phone).toBe('(404) 555-1212')
      expect(r.lead.notes).toBe('Nights only')
      expect(r.lead.serviceNeeded).toBe('LPN')
    }
  })
  it('turns blank notes into null and trims the name', () => {
    const r = validateMatchLead({ ...good, notes: '   ', parentName: '  Maria ' })
    expect(r.ok && r.lead.notes).toBe(null)
    expect(r.ok && r.lead.parentName).toBe('Maria')
  })
  it('rejects a missing name', () => {
    expect(validateMatchLead({ ...good, parentName: '' })).toEqual({ ok: false, error: 'Please enter your name.' })
  })
  it('rejects a short phone', () => {
    expect(validateMatchLead({ ...good, phone: '555-1212' })).toEqual({ ok: false, error: 'Please enter a 10-digit phone number.' })
  })
  it('rejects a county that is not in Georgia', () => {
    expect(validateMatchLead({ ...good, county: 'Unknown' }).ok).toBe(false)
    expect(validateMatchLead({ ...good, county: '<script>' }).ok).toBe(false)
  })
  it('rejects an unknown service', () => {
    expect(validateMatchLead({ ...good, serviceNeeded: 'MD' }).ok).toBe(false)
  })
  it('rejects without consent', () => {
    expect(validateMatchLead({ ...good, smsConsent: false })).toEqual({ ok: false, error: 'Please check the box so we can contact you.' })
  })
  it('rejects a source page that is not a site path', () => {
    expect(validateMatchLead({ ...good, sourcePage: 'https://evil.example' }).ok).toBe(false)
    expect(validateMatchLead({ ...good, sourcePage: '/' + 'a'.repeat(200) }).ok).toBe(false)
  })
  it('rejects non-object bodies', () => {
    expect(validateMatchLead(null).ok).toBe(false)
    expect(validateMatchLead('x').ok).toBe(false)
  })
})

describe('dedupWindowStart', () => {
  it('is 30 minutes before now by default', () => {
    const now = new Date('2026-10-15T12:00:00.000Z')
    expect(dedupWindowStart(now)).toBe('2026-10-15T11:30:00.000Z')
  })
  it('takes a custom window', () => {
    const now = new Date('2026-10-15T12:00:00.000Z')
    expect(dedupWindowStart(now, 5)).toBe('2026-10-15T11:55:00.000Z')
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, "Cannot find module '@/lib/match-lead'" (or similar resolve error).

- [ ] **Step 4: Write `lib/match-lead.ts`**

```ts
// Pure helpers for site-owned "match me" leads: validation, phone
// normalisation and the dedup window. No database, no Next imports, so
// they run in unit tests as-is. /api/match and the admin phone-lead op
// both use them.
import { GEORGIA_COUNTIES, formatCountyName } from '@/lib/county-data'

export const SERVICE_OPTIONS = ['RN', 'LPN', 'PCS', 'not_sure'] as const
export type ServiceNeeded = (typeof SERVICE_OPTIONS)[number]

export const GEORGIA_COUNTY_NAMES: string[] = GEORGIA_COUNTIES.map(formatCountyName)

export type MatchLead = {
  parentName: string
  phone: string // formatted "(404) 555-1212"
  county: string // display name, e.g. "Fulton"
  serviceNeeded: ServiceNeeded
  notes: string | null
  sourcePage: string
}

export type MatchLeadValidation =
  | { ok: true; lead: MatchLead }
  | { ok: false; error: string }

/** Ten US digits, or '' when the input cannot be a US phone number. */
export function normalizePhone(raw: string): string {
  let digits = (raw || '').replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  return digits.length === 10 ? digits : ''
}

export function formatPhone(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

const MAX_NAME = 120
const MAX_NOTES = 2000
const MAX_SOURCE = 200

export function validateMatchLead(body: unknown): MatchLeadValidation {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Bad request.' }
  }
  const b = body as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

  const parentName = str(b.parentName).slice(0, MAX_NAME)
  if (!parentName) return { ok: false, error: 'Please enter your name.' }

  const digits = normalizePhone(str(b.phone))
  if (!digits) return { ok: false, error: 'Please enter a 10-digit phone number.' }

  const county = str(b.county)
  if (!GEORGIA_COUNTY_NAMES.includes(county)) return { ok: false, error: 'Please pick your county.' }

  const serviceNeeded = str(b.serviceNeeded)
  if (!(SERVICE_OPTIONS as readonly string[]).includes(serviceNeeded)) {
    return { ok: false, error: 'Please tell us what kind of help you need.' }
  }

  if (b.smsConsent !== true) return { ok: false, error: 'Please check the box so we can contact you.' }

  const sourcePage = str(b.sourcePage)
  if (!sourcePage.startsWith('/') || sourcePage.startsWith('//') || sourcePage.length > MAX_SOURCE) {
    return { ok: false, error: 'Bad request.' }
  }

  const notesRaw = str(b.notes).slice(0, MAX_NOTES)
  const notes = notesRaw ? notesRaw : null

  return {
    ok: true,
    lead: {
      parentName,
      phone: formatPhone(digits),
      county,
      serviceNeeded: serviceNeeded as ServiceNeeded,
      notes,
      sourcePage,
    },
  }
}

/** ISO timestamp `minutes` before `now`; rows at or after it count as duplicates. */
export function dedupWindowStart(now: Date, minutes = 30): string {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString()
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: all tests in `tests/match-lead.test.ts` PASS. If the county count is not 159, check `GEORGIA_COUNTIES` length in `lib/county-data.ts` and fix the expectation to the real number only if the list is genuinely different from 159; do not pad the list.

- [ ] **Step 6: Write migration 014**

Create `supabase/migrations/014_match_leads.sql`:

```sql
-- Site-owned leads (2026-10-15). A family who lands on an unclaimed listing
-- can now ask GeorgiaGAPP to match them. Those rows have no provider until
-- an admin assigns one, so provider_id becomes nullable and the row records
-- where it came from. See docs/superpowers/specs/2026-10-15-match-leads-and-provider-reports-design.md

ALTER TABLE public.callback_requests ALTER COLUMN provider_id DROP NOT NULL;

ALTER TABLE public.callback_requests
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'provider_form'
    CHECK (source IN ('provider_form', 'match_form', 'phone')),
  ADD COLUMN IF NOT EXISTS source_page TEXT;

CREATE INDEX IF NOT EXISTS idx_callback_requests_unassigned
  ON public.callback_requests (created_at DESC)
  WHERE provider_id IS NULL;

-- A tap on the GeorgiaGAPP helpline number from an unclaimed listing's page,
-- attributed to that listing ("families tried to reach you through us").
ALTER TABLE public.provider_events DROP CONSTRAINT IF EXISTS provider_events_event_type_check;
ALTER TABLE public.provider_events ADD CONSTRAINT provider_events_event_type_check
  CHECK (event_type IN ('view', 'click_phone', 'click_website', 'click_callback', 'impression', 'click_helpline'));

-- Check: expect provider_id nullable, source default 'provider_form'.
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'callback_requests' AND column_name IN ('provider_id', 'source', 'source_page');
```

- [ ] **Step 7: Apply the migration to production, after approval**

Show the operator the SQL above and get an explicit yes (AskUserQuestion). Then run:

```bash
npx supabase@2.120.0 db query --linked --project-ref mjuuqjrxzhkvsbrgqfot "$(cat supabase/migrations/014_match_leads.sql)"
```

Expected: the final SELECT returns three rows, `provider_id` `is_nullable = YES`, `source` default `'provider_form'::text`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tsconfig.json lib/match-lead.ts tests/match-lead.test.ts supabase/migrations/014_match_leads.sql
git commit -m "feat(leads): match-lead helpers, migration 014, vitest

callback_requests.provider_id is nullable with source/source_page;
provider_events gains click_helpline. Pure validation and phone
normalisation live in lib/match-lead.ts with unit tests.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Move the provider lead email into `lib/lead-email.ts`

**Files:**
- Create: `lib/lead-email.ts`
- Create: `tests/lead-email.test.ts`
- Modify: `app/api/callback/route.ts:102-226`

**Interfaces:**
- Produces:
  - `type LeadForEmail = { parent_name: string; phone: string; email: string | null; zip_code: string; county: string; service_needed: string; urgency: string; preferred_callback_time: string | null; special_needs: string | null }` (the `callback_requests` row shape, so a DB row can be passed straight in).
  - `leadEmailSubject(lead: LeadForEmail): string`
  - `leadEmailHtml(providerName: string, lead: LeadForEmail): string`
  - `sendLeadEmail(to: string, providerName: string, lead: LeadForEmail): Promise<boolean>` → `false` when Resend is not configured or the send throws (never throws).
- Consumes: `resend` package, `RESEND_API_KEY`.

- [ ] **Step 1: Write the failing test**

Create `tests/lead-email.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { leadEmailHtml, leadEmailSubject, type LeadForEmail } from '@/lib/lead-email'

const lead: LeadForEmail = {
  parent_name: 'Maria Lopez',
  phone: '(404) 555-1212',
  email: null,
  zip_code: '',
  county: 'Fulton',
  service_needed: 'LPN',
  urgency: 'asap',
  preferred_callback_time: null,
  special_needs: 'Nights only',
}

describe('leadEmailSubject', () => {
  it('names the family and the service', () => {
    expect(leadEmailSubject(lead)).toBe('New Lead: Maria Lopez needs Nursing (LPN)')
  })
})

describe('leadEmailHtml', () => {
  it('includes the provider name, phone link and notes', () => {
    const html = leadEmailHtml('Opulent Private Care', lead)
    expect(html).toContain('Opulent Private Care')
    expect(html).toContain('tel:(404) 555-1212')
    expect(html).toContain('Nights only')
    expect(html).toContain('AS SOON AS POSSIBLE')
  })
  it('omits the email row and the ZIP row when they are blank', () => {
    const html = leadEmailHtml('Opulent Private Care', lead)
    expect(html).not.toContain('mailto:')
    expect(html).not.toContain('ZIP Code:')
  })
  it('escapes HTML in family input', () => {
    const html = leadEmailHtml('P', { ...lead, parent_name: '<img src=x>' })
    expect(html).not.toContain('<img src=x>')
    expect(html).toContain('&lt;img src=x&gt;')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/lead-email.test.ts`
Expected: FAIL, cannot resolve `@/lib/lead-email`.

- [ ] **Step 3: Write `lib/lead-email.ts`**

```ts
// The email a provider gets when a family lead is sent to them. Used by
// /api/callback (family filled the provider's own form) and by the admin
// leads.assign op (operator routed a site-owned lead to this provider).
import { Resend } from 'resend'

export type LeadForEmail = {
  parent_name: string
  phone: string
  email: string | null
  zip_code: string
  county: string
  service_needed: string
  urgency: string
  preferred_callback_time: string | null
  special_needs: string | null
}

const SERVICE_TEXT: Record<string, string> = {
  RN: 'Nursing (RN)',
  LPN: 'Nursing (LPN)',
  PCS: 'Personal Care Services',
  not_sure: 'Not sure yet',
}

const URGENCY_TEXT: Record<string, string> = {
  asap: 'AS SOON AS POSSIBLE',
  this_month: 'Within the next month',
  researching: 'Just researching',
}

const CALLBACK_TIME_TEXT: Record<string, string> = {
  morning: 'Morning (8am - 12pm)',
  afternoon: 'Afternoon (12pm - 5pm)',
  evening: 'Evening (5pm - 8pm)',
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function leadEmailSubject(lead: LeadForEmail): string {
  const service = SERVICE_TEXT[lead.service_needed] || lead.service_needed
  return `New Lead: ${lead.parent_name} needs ${service}`
}

export function leadEmailHtml(providerName: string, lead: LeadForEmail): string {
  const e = escapeHtml
  const service = SERVICE_TEXT[lead.service_needed] || lead.service_needed
  const urgency = URGENCY_TEXT[lead.urgency] || lead.urgency
  const callbackTime = CALLBACK_TIME_TEXT[lead.preferred_callback_time || ''] || 'Any time'
  const row = (label: string, value: string, bold = false) => `
                    <tr>
                      <td style="padding: 8px 0; color: #666; width: 140px; vertical-align: top;">${label}</td>
                      <td style="padding: 8px 0; color: #333;${bold ? ' font-weight: bold;' : ''}">${value}</td>
                    </tr>`

  return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #FF8A80; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Callback Request</h1>
              </div>

              <div style="padding: 30px; background: #f9f9f9;">
                <p style="font-size: 16px; color: #333;">
                  A family has requested a callback from <strong>${e(providerName)}</strong> through GeorgiaGAPP.com
                </p>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0; border-bottom: 2px solid #FF8A80; padding-bottom: 10px;">
                    Family Information
                  </h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${row('Name:', e(lead.parent_name), true)}
                    ${row('Phone:', `<a href="tel:${e(lead.phone)}" style="color: #FF8A80;">${e(lead.phone)}</a>`, true)}
                    ${lead.email ? row('Email:', `<a href="mailto:${e(lead.email)}" style="color: #FF8A80;">${e(lead.email)}</a>`) : ''}
                    ${lead.zip_code ? row('ZIP Code:', e(lead.zip_code)) : ''}
                    ${row('County:', e(lead.county))}
                  </table>
                </div>

                <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h2 style="color: #2C3E50; margin-top: 0; border-bottom: 2px solid #87CEEB; padding-bottom: 10px;">
                    Care Needs
                  </h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${row('Service Needed:', e(service), true)}
                    ${row('Urgency:', `<span style="color: ${lead.urgency === 'asap' ? '#FF8A80' : '#333'}; font-weight: bold;">${e(urgency)}</span>`)}
                    ${row('Best Callback Time:', e(callbackTime))}
                    ${lead.special_needs ? row('Special Notes:', e(lead.special_needs)) : ''}
                  </table>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                  <a href="tel:${e(lead.phone)}"
                     style="display: inline-block; background: #FF8A80; color: white; padding: 15px 40px;
                            text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                    Call ${e(lead.parent_name)} Now
                  </a>
                </div>

                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                  This lead was submitted through GeorgiaGAPP.com<br>
                  Please respond promptly to provide the best service.
                </p>
              </div>
            </div>`
}

/** Sends the lead email. Returns false (and logs) instead of throwing. */
export async function sendLeadEmail(to: string, providerName: string, lead: LeadForEmail): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'GeorgiaGAPP.com <leads@georgiagapp.com>',
      to,
      subject: leadEmailSubject(lead),
      html: leadEmailHtml(providerName, lead),
    })
    return true
  } catch (err) {
    console.error('Error sending lead email:', err)
    return false
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/lead-email.test.ts`
Expected: PASS.

- [ ] **Step 5: Use it from `/api/callback`**

In `app/api/callback/route.ts`:

1. Remove `import { Resend } from 'resend'` and the `getResend()` function (lines 3 and 13-16).
2. Add `import { sendLeadEmail } from '@/lib/lead-email'`.
3. Replace everything from `// Send email notification to provider if they have an email` through the closing `}` of `if (provider.email && resend) { … }` (lines 102-226) with:

```ts
    // Send email notification to provider if they have an email
    if (provider.email) {
      await sendLeadEmail(provider.email, provider.name, {
        parent_name: body.parentName,
        phone: body.phone,
        email: body.email || null,
        zip_code: body.zipCode,
        county: body.county || 'Unknown',
        service_needed: body.serviceNeeded,
        urgency: body.urgency,
        preferred_callback_time: body.preferredCallbackTime || null,
        special_needs: body.specialNeeds || null,
      })
    }
```

- [ ] **Step 6: Type-check and build-check**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors, all tests pass.

- [ ] **Step 7: Commit**

```bash
git add lib/lead-email.ts tests/lead-email.test.ts app/api/callback/route.ts
git commit -m "refactor(leads): move the provider lead email into lib/lead-email

Same template, now HTML-escaped and reusable from the admin assign op.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: `/api/match` route and the operator notification

**Files:**
- Create: `app/api/match/route.ts`
- Create: `lib/operator-email.ts`
- Create: `tests/operator-email.test.ts`
- Modify: `.env.example` (add `LEAD_NOTIFY_EMAIL`)

**Interfaces:**
- Consumes: `validateMatchLead`, `dedupWindowStart`, `MatchLead` from `lib/match-lead.ts`; `createServiceClient` from `lib/supabase-service.ts`.
- Produces: `POST /api/match` with body `{ parentName, phone, county, serviceNeeded, notes?, sourcePage, smsConsent }` → `200 { success: true, id, deduped?: true }` | `400 { error }` | `500 { error }`.
- Produces: `operatorLeadEmailHtml(lead: MatchLead, source: 'match_form' | 'phone', adminUrl: string): string`, `sendOperatorLeadEmail(lead: MatchLead, source: 'match_form' | 'phone'): Promise<boolean>`.

- [ ] **Step 1: Write the failing test for the operator email**

Create `tests/operator-email.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { operatorLeadEmailHtml, operatorLeadEmailSubject } from '@/lib/operator-email'
import type { MatchLead } from '@/lib/match-lead'

const lead: MatchLead = {
  parentName: 'Maria Lopez',
  phone: '(404) 555-1212',
  county: 'Fulton',
  serviceNeeded: 'LPN',
  notes: 'Nights only',
  sourcePage: '/provider/triumph-private-home-care-llc-decatur-8440',
}

describe('operatorLeadEmailSubject', () => {
  it('reads as "Match lead: name, county, service"', () => {
    expect(operatorLeadEmailSubject(lead)).toBe('Match lead: Maria Lopez, Fulton, Nursing (LPN)')
  })
})

describe('operatorLeadEmailHtml', () => {
  it('links the source page and the admin leads page', () => {
    const html = operatorLeadEmailHtml(lead, 'match_form', 'https://www.georgiagapp.com/admin/leads')
    expect(html).toContain('https://www.georgiagapp.com/provider/triumph-private-home-care-llc-decatur-8440')
    expect(html).toContain('https://www.georgiagapp.com/admin/leads')
    expect(html).toContain('tel:(404) 555-1212')
    expect(html).toContain('Nights only')
  })
  it('escapes family input', () => {
    const html = operatorLeadEmailHtml({ ...lead, notes: '<b>x</b>' }, 'match_form', 'https://x/admin/leads')
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/operator-email.test.ts`
Expected: FAIL, cannot resolve `@/lib/operator-email`.

- [ ] **Step 3: Write `lib/operator-email.ts`**

```ts
// The email the operator (LEAD_NOTIFY_EMAIL) gets when a family asks the
// site to match them, with no provider attached yet.
import { Resend } from 'resend'
import { escapeHtml } from '@/lib/lead-email'
import type { MatchLead } from '@/lib/match-lead'

const SERVICE_TEXT: Record<string, string> = {
  RN: 'Nursing (RN)',
  LPN: 'Nursing (LPN)',
  PCS: 'Personal Care Services',
  not_sure: 'Not sure yet',
}

export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.georgiagapp.com'

export function operatorLeadEmailSubject(lead: MatchLead): string {
  return `Match lead: ${lead.parentName}, ${lead.county}, ${SERVICE_TEXT[lead.serviceNeeded] || lead.serviceNeeded}`
}

export function operatorLeadEmailHtml(lead: MatchLead, source: 'match_form' | 'phone', adminUrl: string): string {
  const e = escapeHtml
  const sourceUrl = `${SITE_URL}${lead.sourcePage}`
  const row = (label: string, value: string) => `
      <tr>
        <td style="padding: 6px 0; color: #666; width: 120px; vertical-align: top;">${label}</td>
        <td style="padding: 6px 0; color: #333;">${value}</td>
      </tr>`
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2C3E50; padding: 16px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">A family needs a match</h1>
      </div>
      <div style="padding: 24px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; padding: 12px;">
          ${row('Name', `<strong>${e(lead.parentName)}</strong>`)}
          ${row('Phone', `<a href="tel:${e(lead.phone)}" style="color: #FF8A80; font-weight: bold;">${e(lead.phone)}</a>`)}
          ${row('County', e(lead.county))}
          ${row('Needs', e(SERVICE_TEXT[lead.serviceNeeded] || lead.serviceNeeded))}
          ${lead.notes ? row('Notes', e(lead.notes)) : ''}
          ${row('Came from', source === 'phone' ? 'Phone call (logged by admin)' : `<a href="${e(sourceUrl)}" style="color: #2C3E50;">${e(lead.sourcePage)}</a>`)}
        </table>
        <div style="text-align: center; margin-top: 24px;">
          <a href="tel:${e(lead.phone)}" style="display: inline-block; background: #FF8A80; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Call ${e(lead.parentName)}</a>
          <br><br>
          <a href="${e(adminUrl)}" style="color: #2C3E50;">Open in admin to assign a provider</a>
        </div>
      </div>
    </div>`
}

/** Returns false (and logs) when LEAD_NOTIFY_EMAIL or Resend is missing or the send fails. */
export async function sendOperatorLeadEmail(lead: MatchLead, source: 'match_form' | 'phone'): Promise<boolean> {
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!to || !process.env.RESEND_API_KEY) {
    console.warn('sendOperatorLeadEmail: LEAD_NOTIFY_EMAIL or RESEND_API_KEY not set; lead saved but not emailed')
    return false
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'GeorgiaGAPP.com <leads@georgiagapp.com>',
      to,
      subject: operatorLeadEmailSubject(lead),
      html: operatorLeadEmailHtml(lead, source, `${SITE_URL}/admin/leads`),
    })
    return true
  } catch (err) {
    console.error('Error sending operator lead email:', err)
    return false
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/operator-email.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the route**

Create `app/api/match/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-service'
import { validateMatchLead, dedupWindowStart } from '@/lib/match-lead'
import { sendOperatorLeadEmail } from '@/lib/operator-email'

// A family on an unclaimed listing (or a content page) asks GeorgiaGAPP to
// match them with a provider. The row has no provider until an admin
// assigns one from /admin/leads.
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const result = validateMatchLead(body)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  const lead = result.lead

  try {
    const db = createServiceClient()

    const { data: existing } = await db
      .from('callback_requests')
      .select('id')
      .eq('source', 'match_form')
      .eq('phone', lead.phone)
      .gte('created_at', dedupWindowStart(new Date()))
      .limit(1)
      .maybeSingle()
    if (existing) return NextResponse.json({ success: true, id: existing.id, deduped: true })

    const { data: inserted, error } = await db
      .from('callback_requests')
      .insert({
        parent_name: lead.parentName,
        phone: lead.phone,
        email: null,
        zip_code: '',
        county: lead.county,
        service_needed: lead.serviceNeeded,
        urgency: 'asap',
        special_needs: lead.notes,
        provider_id: null,
        source: 'match_form',
        source_page: lead.sourcePage,
        status: 'new',
      })
      .select('id')
      .single()

    if (error || !inserted) {
      console.error('match insert failed:', error)
      return NextResponse.json({ error: 'Could not save your request. Please call us.' }, { status: 500 })
    }

    await sendOperatorLeadEmail(lead, 'match_form')

    return NextResponse.json({ success: true, id: inserted.id })
  } catch (err) {
    console.error('match route error:', err)
    return NextResponse.json({ error: 'Could not save your request. Please call us.' }, { status: 500 })
  }
}
```

- [ ] **Step 6: Document the env var**

Append to `.env.example` after the Resend block:

```bash
# Where site-owned "match me" leads are emailed (the operator's inbox)
LEAD_NOTIFY_EMAIL=you@example.com
```

Also add `LEAD_NOTIFY_EMAIL` to the Vercel project (Production + Preview) with the operator's address before the merge; note this in the PR description.

- [ ] **Step 7: Smoke-test the route locally**

Run: `npm run dev` in the background, then:

```bash
curl -s -X POST http://localhost:3000/api/match -H 'Content-Type: application/json' \
  -d '{"parentName":"Test Family","phone":"4045550100","county":"Fulton","serviceNeeded":"not_sure","sourcePage":"/provider/test","smsConsent":true}'
```

Expected: `{"success":true,"id":"…"}`. Run it again at once: expected `{"success":true,"id":"…","deduped":true}`. Then a bad body:

```bash
curl -s -X POST http://localhost:3000/api/match -H 'Content-Type: application/json' -d '{"parentName":"x"}'
```

Expected: `{"error":"Please enter a 10-digit phone number."}` with status 400. Delete the test row afterwards:

```bash
npx supabase@2.120.0 db query --linked --project-ref mjuuqjrxzhkvsbrgqfot "delete from callback_requests where parent_name = 'Test Family' and source = 'match_form'"
```

(If `.env.local` has no working service-role key, the insert will fail with 500; test against a Vercel preview deploy instead and note that in the task's result.)

- [ ] **Step 8: Commit**

```bash
git add app/api/match/route.ts lib/operator-email.ts tests/operator-email.test.ts .env.example
git commit -m "feat(leads): POST /api/match saves a site-owned lead and emails the operator

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: `MatchForm` and `HelplineCta` components, `click_helpline` tracking

**Files:**
- Create: `components/MatchForm.tsx`
- Create: `components/HelplineCta.tsx`
- Modify: `app/api/events/track/route.ts:9`

**Interfaces:**
- Produces: `<MatchForm county?: string; sourcePage: string />` (client). `<HelplineCta variant: 'provider' | 'banner'; sourcePage: string; county?: string; providerId?: string />` (server).
- Consumes: `config.contact.phone/phoneRaw`, `config.services` (`{ id, label }`), `GEORGIA_COUNTY_NAMES` from `lib/match-lead.ts`, `TrackableLink`.

- [ ] **Step 1: Allow the new event type**

In `app/api/events/track/route.ts` change

```ts
const VALID_EVENTS = ['view', 'click_phone', 'click_website', 'click_callback', 'impression'] as const
```

to

```ts
const VALID_EVENTS = ['view', 'click_phone', 'click_website', 'click_callback', 'impression', 'click_helpline'] as const
```

- [ ] **Step 2: Write `components/MatchForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { config } from '@/lib/config'
import { GEORGIA_COUNTY_NAMES, SERVICE_OPTIONS, type ServiceNeeded } from '@/lib/match-lead'

interface MatchFormProps {
  county?: string
  sourcePage: string
}

const SERVICE_LABELS: Record<ServiceNeeded, string> = {
  RN: 'A nurse (RN)',
  LPN: 'A nurse (LPN)',
  PCS: 'Help with daily care (PCS)',
  not_sure: "I'm not sure yet",
}

export function MatchForm({ county, sourcePage }: MatchFormProps) {
  const [form, setForm] = useState({
    parentName: '',
    phone: '',
    county: county && GEORGIA_COUNTY_NAMES.includes(county) ? county : '',
    serviceNeeded: '' as ServiceNeeded | '',
    notes: '',
    smsConsent: false,
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sourcePage }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please call us.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMessage('Something went wrong. Please call us.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Got it</h3>
        <p className="text-gray-700">
          We will call or text you within one business day.
          Faster: call us now at{' '}
          <a href={`tel:${config.contact.phoneRaw}`} className="text-primary font-semibold">{config.contact.phone}</a>.
        </p>
      </div>
    )
  }

  const input = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mf-name" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
          <input id="mf-name" type="text" required autoComplete="name" className={input}
            value={form.parentName} onChange={e => setForm(f => ({ ...f, parentName: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="mf-phone" className="block text-sm font-medium text-gray-700 mb-1">Your phone</label>
          <input id="mf-phone" type="tel" required autoComplete="tel" inputMode="tel" className={input}
            value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="mf-county" className="block text-sm font-medium text-gray-700 mb-1">Your county</label>
          <select id="mf-county" required className={input}
            value={form.county} onChange={e => setForm(f => ({ ...f, county: e.target.value }))}>
            <option value="">Pick a county</option>
            {GEORGIA_COUNTY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="mf-service" className="block text-sm font-medium text-gray-700 mb-1">What do you need?</label>
          <select id="mf-service" required className={input}
            value={form.serviceNeeded} onChange={e => setForm(f => ({ ...f, serviceNeeded: e.target.value as ServiceNeeded }))}>
            <option value="">Pick one</option>
            {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{SERVICE_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mf-notes" className="block text-sm font-medium text-gray-700 mb-1">Anything we should know? (optional)</label>
        <textarea id="mf-notes" rows={2} className={input} placeholder="Nights, weekends, a trach, a vent..."
          value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required checked={form.smsConsent}
            onChange={e => setForm(f => ({ ...f, smsConsent: e.target.checked }))}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0" />
          <span className="text-xs text-gray-600 leading-relaxed">
            I agree to receive calls, text messages, and emails from GeorgiaGAPP.com at the phone number I
            provided, about my request. Message &amp; data rates may apply. Message frequency varies.
            Reply <strong>STOP</strong> to opt out, or <strong>HELP</strong> for help. See our{' '}
            <Link href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link> and{' '}
            <Link href="/terms" target="_blank" className="text-primary underline">Terms</Link>.
            <span className="block mt-1 text-gray-500">We do not share your phone number with anyone for marketing.</span>
          </span>
        </label>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">{errorMessage}</p>
      )}

      <button type="submit" disabled={status === 'submitting'}
        className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
        {status === 'submitting' ? 'Sending...' : 'Match me with a provider'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Write `components/HelplineCta.tsx`**

```tsx
import { config } from '@/lib/config'
import { TrackableLink } from '@/components/TrackableLink'
import { MatchForm } from '@/components/MatchForm'

interface HelplineCtaProps {
  variant: 'provider' | 'banner'
  sourcePage: string
  county?: string
  providerId?: string
}

// "Talk to a human" block: our number first (call or text), the short match
// form second. On an unclaimed provider page the taps are logged against
// that provider as click_helpline so its report can say how many families
// tried to reach it through us.
export function HelplineCta({ variant, sourcePage, county, providerId }: HelplineCtaProps) {
  const where = county ? `${county} County` : 'your county'
  const tel = `tel:${config.contact.phoneRaw}`
  const sms = `sms:${config.contact.phoneRaw}`
  const btn = 'flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors'
  const callClass = `${btn} bg-primary text-white hover:bg-primary-dark`
  const textClass = `${btn} border-2 border-primary text-primary hover:bg-primary/10`

  const buttons = providerId ? (
    <>
      <TrackableLink href={tel} providerId={providerId} eventType="click_helpline" className={callClass}>
        Call {config.contact.phone}
      </TrackableLink>
      <TrackableLink href={sms} providerId={providerId} eventType="click_helpline" className={textClass}>
        Text us
      </TrackableLink>
    </>
  ) : (
    <>
      <a href={tel} className={callClass}>Call {config.contact.phone}</a>
      <a href={sms} className={textClass}>Text us</a>
    </>
  )

  return (
    <div className={variant === 'banner' ? 'bg-warm/20 border border-warm rounded-2xl p-6 sm:p-8' : 'py-2'}>
      <div className="text-center max-w-xl mx-auto">
        {variant === 'provider' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-2">We can still help you</h2>
            <p className="text-gray-700 mb-5">
              This agency has not claimed its listing yet, so we can&apos;t connect you to them directly.
              Call or text us and we&apos;ll match you with a GAPP provider in {where} today. A real person answers.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Not sure which provider to call?</h2>
            <p className="text-gray-700 mb-5">
              Call or text us and we&apos;ll match you with a GAPP provider in {where}. A real person answers.
            </p>
          </>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">{buttons}</div>
        <p className="text-sm text-gray-500 mb-4">Or tell us what you need and we&apos;ll reach out:</p>
      </div>
      <div className="max-w-xl mx-auto">
        <MatchForm county={county} sourcePage={sourcePage} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. (`bg-warm`, `bg-primary`, `hover:bg-primary-dark` are existing Tailwind theme colours; `warm` is `#FFCBA4` in `tailwind.config.ts`.)

- [ ] **Step 5: Commit**

```bash
git add components/MatchForm.tsx components/HelplineCta.tsx app/api/events/track/route.ts
git commit -m "feat(leads): HelplineCta and MatchForm components; click_helpline event

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Helpline CTA on unclaimed provider pages

**Files:**
- Modify: `app/provider/[slug]/page.tsx:6-12` (imports) and `:381-407` (the unclaimed branch)

**Interfaces:**
- Consumes: `HelplineCta` from Task 5. `provider.countiesServed: string[]` (display names), `provider.id`, `provider.slug` already in scope.

- [ ] **Step 1: Import the component**

After `import { VerifiedProviderProfile } from '@/components/provider/VerifiedProviderProfile'` add:

```ts
import { HelplineCta } from '@/components/HelplineCta'
```

- [ ] **Step 2: Replace the unclaimed block**

Find the `else` branch that starts with the comment `/* Unclaimed profile - show claim CTA */` and ends just before `)}` closing `provider.isClaimed ? ( … ) : ( … )`. Replace the whole `<div className="text-center py-4"> … </div>` with:

```tsx
                  /* Unclaimed profile: our helpline first, then the claim link */
                  <div className="py-2">
                    <HelplineCta
                      variant="provider"
                      county={provider.countiesServed[0]}
                      providerId={provider.id}
                      sourcePage={`/provider/${provider.slug}`}
                    />

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-500 mb-2">Do you run this agency?</p>
                      <Link
                        href={`/claim/${provider.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Claim this listing for free
                      </Link>
                    </div>
                  </div>
```

Leave the `provider.isClaimed` (claimed-but-unverified) branch exactly as it is.

- [ ] **Step 3: Build and look at it**

Run: `npx tsc --noEmit`, then `npm run dev` and open `http://localhost:3000/provider/triumph-private-home-care-llc-decatur-8440` (unclaimed) at a 390px-wide viewport.

Expected: the "We can still help you" heading, two buttons (call, text), the four-field form, then the small claim link. Then open `http://localhost:3000/provider/opulent-private-care-services` (verified) and `http://localhost:3000/provider/a-heart-for-care` (claimed, unverified): expected unchanged, no helpline block.

- [ ] **Step 4: Commit**

```bash
git add 'app/provider/[slug]/page.tsx'
git commit -m "feat(provider): helpline CTA and match form on unclaimed listings

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Helpline banner on the five highest-traffic content pages

**Files:**
- Modify: `app/georgia-pediatric-program/page.tsx:457`
- Modify: `app/gapp-providers-georgia/page.tsx:367`
- Modify: `app/gapp-paid-caregiver/page.tsx:342`
- Modify: `app/katie-beckett-waiver-georgia/page.tsx:885`
- Modify: `app/gapp-approval-timeline/page.tsx:305`

**Interfaces:**
- Consumes: `HelplineCta` (Task 5).

- [ ] **Step 1: Add the import to each of the five files**

After the existing `import { FAQPageSchema, … } from '@/components/JsonLd'` line in each file add:

```ts
import { HelplineCta } from '@/components/HelplineCta'
```

- [ ] **Step 2: Insert the banner immediately before the `{/* FAQs */}` comment in each file**

The block is the same in all five, with `sourcePage` set to the page's own path:

```tsx
      {/* Talk to a human */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <HelplineCta variant="banner" sourcePage="/georgia-pediatric-program" />
        </div>
      </section>

```

Use these `sourcePage` values:

| File | sourcePage |
|---|---|
| `app/georgia-pediatric-program/page.tsx` | `/georgia-pediatric-program` |
| `app/gapp-providers-georgia/page.tsx` | `/gapp-providers-georgia` |
| `app/gapp-paid-caregiver/page.tsx` | `/gapp-paid-caregiver` |
| `app/katie-beckett-waiver-georgia/page.tsx` | `/katie-beckett-waiver-georgia` |
| `app/gapp-approval-timeline/page.tsx` | `/gapp-approval-timeline` |

- [ ] **Step 3: Confirm the guardrail still passes**

Run: `npm run seo:check`
Expected: exit 0. (The pages keep their FAQ, breadcrumb and canonical; nothing about metadata changed.)

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Look at one**

With `npm run dev`, open `http://localhost:3000/gapp-approval-timeline` at 390px. Expected: the peach banner with the number, two buttons and the form sits directly above "Timeline FAQs".

- [ ] **Step 5: Commit**

```bash
git add app/georgia-pediatric-program/page.tsx app/gapp-providers-georgia/page.tsx app/gapp-paid-caregiver/page.tsx app/katie-beckett-waiver-georgia/page.tsx app/gapp-approval-timeline/page.tsx
git commit -m "feat(content): helpline banner on the five top-traffic pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Admin data ops: assign, phone lead, providers by county

**Files:**
- Modify: `app/api/admin/data/route.ts` (add four `case`s before `case 'providers.insert':`)

**Interfaces:**
- Consumes: `sendLeadEmail` (Task 3), `validateMatchLead`, `formatPhone`, `normalizePhone` (Task 2), `sendOperatorLeadEmail` (Task 4).
- Produces (all via `adminData(op, args)` from the browser):
  - `leads.assign { id: string; providerId: string }` → `{ lead: Row, emailed: boolean }` where `Row` is the `callback_requests` row with `provider: { id, name, slug }`.
  - `leads.insertPhone { parentName, phone, county, serviceNeeded, notes? }` → the inserted row with `provider: null`.
  - `providers.forCounty { county: string }` → `Array<{ id, name, slug, is_featured }>` (active + verified, Featured first).
  - `providers.reportLink { slug: string }` → `{ url: string }` (implemented in Task 10, stubbed here as a `throw new Error('not yet')` so the switch compiles; Task 10 replaces it).

- [ ] **Step 1: Add imports**

At the top of `app/api/admin/data/route.ts` add:

```ts
import { sendLeadEmail } from '@/lib/lead-email'
import { sendOperatorLeadEmail } from '@/lib/operator-email'
import { validateMatchLead } from '@/lib/match-lead'
```

- [ ] **Step 2: Add the cases**

Insert before `    // app/admin/requests/page.tsx` (i.e. right after `case 'leads.update'`):

```ts
    // Route a site-owned lead to a verified provider and email them.
    case 'leads.assign': {
      const id = asId(args.id)
      const providerId = asId(args.providerId)
      const { data: provider, error: pErr } = await db
        .from('providers')
        .select('id, name, email')
        .eq('id', providerId)
        .single()
      if (pErr || !provider) return { data: null, error: 'Provider not found' }

      const { data: lead, error: uErr } = await db
        .from('callback_requests')
        .update({ provider_id: providerId })
        .eq('id', id)
        .select('*, provider:providers(id, name, slug)')
        .single()
      if (uErr || !lead) return { data: null, error: uErr?.message || 'Lead not found' }

      const emailed = provider.email ? await sendLeadEmail(provider.email, provider.name, lead) : false
      return { data: { lead, emailed }, error: null }
    }

    // The operator took a call and logs it so every lead is in one list.
    case 'leads.insertPhone': {
      const v = validateMatchLead({ ...args, smsConsent: true, sourcePage: '/admin/leads' })
      if (!v.ok) return { data: null, error: v.error }
      const l = v.lead
      const { data, error } = await db
        .from('callback_requests')
        .insert({
          parent_name: l.parentName,
          phone: l.phone,
          email: null,
          zip_code: '',
          county: l.county,
          service_needed: l.serviceNeeded,
          urgency: 'asap',
          special_needs: l.notes,
          provider_id: null,
          source: 'phone',
          source_page: null,
          status: 'contacted',
          contacted_at: new Date().toISOString(),
        })
        .select('*, provider:providers(id, name, slug)')
        .single()
      if (error) return { data: null, error: error.message }
      return { data, error: null }
    }

    // Verified providers who serve a county, Featured first.
    case 'providers.forCounty': {
      const county = typeof args.county === 'string' ? args.county : ''
      if (!county) return { data: [], error: null }
      return wrap(
        await db
          .from('providers')
          .select('id, name, slug, is_featured')
          .eq('is_active', true)
          .eq('is_verified', true)
          .contains('counties_served', [county])
          .order('is_featured', { ascending: false })
          .order('name')
      )
    }

    case 'providers.reportLink':
      throw new Error('not yet') // replaced in the report task
```

Note on `leads.insertPhone`: the status is `contacted` because the operator is logging a call that already happened. `sendOperatorLeadEmail` is deliberately not called here; the operator is the one typing.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If `lead` does not satisfy `LeadForEmail` because the joined `provider` key is extra, that is fine (structural typing allows extra keys on a variable); if TypeScript complains about `email` possibly being `undefined`, cast: `sendLeadEmail(provider.email, provider.name, lead as LeadForEmail)` with `import type { LeadForEmail } from '@/lib/lead-email'`.

- [ ] **Step 4: Verify the no-email case by reading the code path**

Confirm in the diff that when `provider.email` is null, `emailed` is `false` and the update still ran before it. This is Review Focus item 5; the UI in Task 9 shows the "no email on file" note from this flag.

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/data/route.ts
git commit -m "feat(admin): leads.assign, leads.insertPhone, providers.forCounty ops

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Admin leads page: Needs match tab, assign, add phone lead

**Files:**
- Modify: `app/admin/leads/page.tsx`

**Interfaces:**
- Consumes: the three ops from Task 8; `GEORGIA_COUNTY_NAMES`, `SERVICE_OPTIONS` from `lib/match-lead.ts`.

- [ ] **Step 1: Update the `Lead` type and filter type**

Replace the `provider` field and add two fields:

```ts
  source: 'provider_form' | 'match_form' | 'phone'
  source_page: string | null
  provider: {
    id: string
    name: string
    slug: string
  } | null
```

Change `type StatusFilter = 'all' | 'new' | 'contacted' | 'converted' | 'closed'` to

```ts
type StatusFilter = 'needs_match' | 'all' | 'new' | 'contacted' | 'converted' | 'closed'
```

Add imports:

```ts
import { GEORGIA_COUNTY_NAMES, SERVICE_OPTIONS } from '@/lib/match-lead'
```

- [ ] **Step 2: State and data for assignment and phone leads**

Inside `LeadsPage`, after `const [updating, setUpdating] = useState<string | null>(null)` add:

```ts
  const [countyProviders, setCountyProviders] = useState<Record<string, { id: string; name: string; slug: string; is_featured: boolean }[]>>({})
  const [assignChoice, setAssignChoice] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [showPhoneForm, setShowPhoneForm] = useState(false)
  const [phoneForm, setPhoneForm] = useState({ parentName: '', phone: '', county: '', serviceNeeded: 'not_sure', notes: '' })
```

Change the initial filter so unassigned leads are shown first when any exist. Replace `const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')` with `useState<StatusFilter>('all')` unchanged, and in `fetchLeads` after `setLeads(data || [])` add:

```ts
      if ((data || []).some(l => l.provider === null)) setStatusFilter('needs_match')
```

Replace the `filteredLeads` filter with:

```ts
  const filteredLeads = leads.filter(lead => {
    if (statusFilter === 'needs_match') return lead.provider === null
    if (statusFilter === 'all') return true
    return lead.status === statusFilter
  })
  const needsMatchCount = leads.filter(l => l.provider === null).length
```

Add the three handlers after `updateStatus`:

```ts
  async function loadCountyProviders(county: string) {
    if (countyProviders[county]) return
    const { data } = await adminData<{ id: string; name: string; slug: string; is_featured: boolean }[]>('providers.forCounty', { county })
    setCountyProviders(prev => ({ ...prev, [county]: data || [] }))
  }

  async function assignLead(id: string) {
    const providerId = assignChoice[id]
    if (!providerId) return
    setUpdating(id)
    const { data, error } = await adminData<{ lead: Lead; emailed: boolean }>('leads.assign', { id, providerId })
    if (error || !data) {
      alert(`Could not assign: ${error?.message || 'unknown error'}`)
    } else {
      setLeads(prev => prev.map(l => (l.id === id ? data.lead : l)))
      setNotice(data.emailed
        ? `Assigned to ${data.lead.provider?.name} and emailed them.`
        : `Assigned to ${data.lead.provider?.name}. They have no email on file, so nothing was sent. Call them.`)
    }
    setUpdating(null)
  }

  async function addPhoneLead(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await adminData<Lead>('leads.insertPhone', phoneForm)
    if (error || !data) {
      alert(error?.message || 'Could not save')
      return
    }
    setLeads(prev => [data, ...prev])
    setPhoneForm({ parentName: '', phone: '', county: '', serviceNeeded: 'not_sure', notes: '' })
    setShowPhoneForm(false)
    setStatusFilter('needs_match')
  }

  function sourceBadge(lead: Lead) {
    if (lead.source === 'match_form') return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Match form</span>
    if (lead.source === 'phone') return <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">Phone</span>
    return null
  }
```

- [ ] **Step 3: Header button and notice**

In the header `<div className="flex gap-3">`, before the `Providers` link add:

```tsx
              <button
                onClick={() => setShowPhoneForm(v => !v)}
                className="px-3 py-1.5 bg-primary text-white text-xs sm:text-sm font-medium rounded hover:bg-primary-dark"
              >
                {showPhoneForm ? 'Cancel' : 'Add phone lead'}
              </button>
```

Right after the stats cards grid (before `{/* Filter Tabs */}`) add:

```tsx
        {notice && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg px-4 py-3 flex justify-between">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="text-blue-600">Dismiss</button>
          </div>
        )}

        {showPhoneForm && (
          <form onSubmit={addPhoneLead} className="mb-6 bg-white rounded-lg border border-gray-200 p-4 grid sm:grid-cols-2 gap-3">
            <input required placeholder="Parent name" className="px-3 py-2 border rounded"
              value={phoneForm.parentName} onChange={e => setPhoneForm(f => ({ ...f, parentName: e.target.value }))} />
            <input required placeholder="Phone" className="px-3 py-2 border rounded"
              value={phoneForm.phone} onChange={e => setPhoneForm(f => ({ ...f, phone: e.target.value }))} />
            <select required className="px-3 py-2 border rounded"
              value={phoneForm.county} onChange={e => setPhoneForm(f => ({ ...f, county: e.target.value }))}>
              <option value="">County</option>
              {GEORGIA_COUNTY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="px-3 py-2 border rounded"
              value={phoneForm.serviceNeeded} onChange={e => setPhoneForm(f => ({ ...f, serviceNeeded: e.target.value }))}>
              {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s === 'not_sure' ? 'Not sure' : s}</option>)}
            </select>
            <textarea placeholder="Notes from the call" className="px-3 py-2 border rounded sm:col-span-2" rows={2}
              value={phoneForm.notes} onChange={e => setPhoneForm(f => ({ ...f, notes: e.target.value }))} />
            <button type="submit" className="sm:col-span-2 px-4 py-2 bg-primary text-white font-medium rounded hover:bg-primary-dark">
              Save phone lead
            </button>
          </form>
        )}
```

- [ ] **Step 4: Tabs**

Replace the tab array `(['all', 'new', 'contacted', 'converted', 'closed'] as StatusFilter[])` with `(['needs_match', 'all', 'new', 'contacted', 'converted', 'closed'] as StatusFilter[])` and replace the tab label expression

```tsx
                  {status} ({status === 'all' ? leads.length : leads.filter(l => l.status === status).length})
```

with

```tsx
                  {status === 'needs_match' ? 'Needs match' : status} (
                  {status === 'needs_match' ? needsMatchCount : status === 'all' ? leads.length : leads.filter(l => l.status === status).length})
```

- [ ] **Step 5: Row changes**

In the header row, after `{getUrgencyBadge(lead.urgency)}` add `{sourceBadge(lead)}`.

Replace the `<span className="text-gray-500 text-xs sm:text-sm">{lead.zip_code}, {lead.county}</span>` with

```tsx
                  <span className="text-gray-500 text-xs sm:text-sm">{[lead.zip_code, lead.county].filter(Boolean).join(', ')}</span>
```

Replace the "For:" span with:

```tsx
                  {lead.provider ? (
                    <span>
                      <strong>For:</strong>{' '}
                      <Link href={`/provider/${lead.provider.slug}`} className="text-primary hover:underline">
                        {lead.provider.name}
                      </Link>
                    </span>
                  ) : (
                    <span className="text-amber-700"><strong>Needs a provider</strong></span>
                  )}
                  {lead.source_page && (
                    <span>
                      <strong>From:</strong>{' '}
                      <Link href={lead.source_page} className="text-gray-700 hover:underline" target="_blank">{lead.source_page}</Link>
                    </span>
                  )}
```

In the actions row, inside the `<>` after `updating === lead.id ? … : (` and before the `lead.status === 'new'` button, add the assign control for unassigned leads:

```tsx
                      {!lead.provider && (
                        <div className="flex flex-wrap items-center gap-2 w-full mb-1">
                          <select
                            className="px-2 py-1.5 border border-gray-300 rounded text-xs"
                            value={assignChoice[lead.id] || ''}
                            onFocus={() => loadCountyProviders(lead.county)}
                            onChange={e => setAssignChoice(prev => ({ ...prev, [lead.id]: e.target.value }))}
                          >
                            <option value="">Assign to a verified provider in {lead.county}…</option>
                            {(countyProviders[lead.county] || []).map(p => (
                              <option key={p.id} value={p.id}>{p.is_featured ? '★ ' : ''}{p.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => assignLead(lead.id)}
                            disabled={!assignChoice[lead.id]}
                            className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary-dark disabled:opacity-50"
                          >
                            Assign and email
                          </button>
                          {countyProviders[lead.county] && countyProviders[lead.county].length === 0 && (
                            <span className="text-xs text-gray-500">No verified providers serve {lead.county} yet.</span>
                          )}
                        </div>
                      )}
```

- [ ] **Step 6: Type-check and try it**

Run: `npx tsc --noEmit`. Expected: no errors.

With `npm run dev`, log in at `/admin`, open `/admin/leads`. Expected: a "Needs match" tab; if the smoke-test row from Task 4 was not deleted it appears with the "Match form" badge, the "From:" link and the assign select. Click "Add phone lead", save one, see it appear with the "Phone" badge. Assign it to Opulent Private Care Services (Cobb/Fulton) and see the notice.

Delete both test rows afterwards:

```bash
npx supabase@2.120.0 db query --linked --project-ref mjuuqjrxzhkvsbrgqfot "delete from callback_requests where parent_name in ('Test Family','Test Phone') and source in ('match_form','phone')"
```

- [ ] **Step 7: Commit**

```bash
git add app/admin/leads/page.tsx
git commit -m "feat(admin): Needs match tab, assign-and-email, add phone lead

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Report token

**Files:**
- Create: `lib/signing-key.ts`
- Create: `lib/report-token.ts`
- Create: `tests/report-token.test.ts`
- Modify: `lib/admin-session.ts:12-19` (use the shared `signingKey`)
- Modify: `app/api/admin/data/route.ts` (replace the `providers.reportLink` stub)

**Interfaces:**
- Produces: `signingKey(): string` (moved), `reportToken(slug: string): string` (24-char base64url), `verifyReportToken(slug: string, token: string | undefined): boolean`, `reportUrl(slug: string): string` (absolute).
- Consumes: `ADMIN_SESSION_SECRET` or `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USERS`/`ADMIN_PASSWORD`, `NEXT_PUBLIC_BASE_URL`.

- [ ] **Step 1: Write the failing tests**

Create `tests/report-token.test.ts`:

```ts
import { describe, it, expect, beforeAll } from 'vitest'

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = 'test-secret'
  process.env.ADMIN_PASSWORD = 'pw'
  process.env.NEXT_PUBLIC_BASE_URL = 'https://www.georgiagapp.com'
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/report-token.test.ts`
Expected: FAIL, cannot resolve `@/lib/report-token`.

- [ ] **Step 3: Extract `signingKey` into `lib/signing-key.ts`**

Create `lib/signing-key.ts`:

```ts
import { createHmac } from 'crypto'

// The server-side HMAC key behind admin sessions and provider report links.
// Derived from a server-only secret plus the admin credentials, so changing
// the admin password ends every open session and rotates every report link.
export function signingKey(): string {
  const base = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base) throw new Error('No server secret available to sign admin sessions')
  const credentials = process.env.ADMIN_USERS || process.env.ADMIN_PASSWORD || ''
  return createHmac('sha256', base).update(`gapp-admin-session-v1:${credentials}`).digest('hex')
}
```

In `lib/admin-session.ts` delete the local `function signingKey() { … }` (the block from `// The signing key is derived` through its closing `}`) and add `import { signingKey } from '@/lib/signing-key'` after the `crypto` import. Everything else in that file stays.

- [ ] **Step 4: Write `lib/report-token.ts`**

```ts
import { createHmac, timingSafeEqual } from 'crypto'
import { signingKey } from '@/lib/signing-key'

// A provider's report link is /report/<slug>?t=<token>. The token is an HMAC
// of the slug, so a link proves the operator made it for that one slug and
// nothing else. No database row, no expiry; rotating ADMIN_SESSION_SECRET
// (or the admin password) invalidates every link at once.

export function reportToken(slug: string): string {
  return createHmac('sha256', signingKey()).update(`report-v1:${slug}`).digest('base64url').slice(0, 24)
}

export function verifyReportToken(slug: string, token: string | undefined): boolean {
  if (!token || token.length !== 24) return false
  const expected = Buffer.from(reportToken(slug))
  const given = Buffer.from(token)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export function reportUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.georgiagapp.com'
  return `${base}/report/${slug}?t=${reportToken(slug)}`
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: all PASS, including the earlier files.

- [ ] **Step 6: Replace the admin stub**

In `app/api/admin/data/route.ts` add `import { reportUrl } from '@/lib/report-token'` and replace

```ts
    case 'providers.reportLink':
      throw new Error('not yet') // replaced in the report task
```

with

```ts
    case 'providers.reportLink': {
      const slug = typeof args.slug === 'string' ? args.slug : ''
      if (!slug) return { data: null, error: 'slug is required' }
      return { data: { url: reportUrl(slug) }, error: null }
    }
```

- [ ] **Step 7: Type-check and commit**

Run: `npx tsc --noEmit`. Expected: no errors.

```bash
git add lib/signing-key.ts lib/report-token.ts tests/report-token.test.ts lib/admin-session.ts app/api/admin/data/route.ts
git commit -m "feat(report): signed per-provider report tokens

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Report data

**Files:**
- Create: `lib/report-data.ts`
- Create: `tests/report-data.test.ts`

**Interfaces:**
- Produces:
  - `median(values: number[]): number` (0 for empty; average of the two middle values for even counts).
  - `summarizeEvents(rows: { provider_id: string; event_type: string }[]): Record<string, EventCounts>` where `EventCounts = { views: number; impressions: number; phoneClicks: number; websiteClicks: number; callbackClicks: number; helplineClicks: number }`.
  - `peerMedians(counts: Record<string, EventCounts>, peerIds: string[]): { count: number; views: number; phoneClicks: number }`.
  - `getReportData(slug: string): Promise<ReportData | null>` with
    ```ts
    type ReportData = {
      provider: { id: string; name: string; slug: string; city: string; counties: string[]; isClaimed: boolean; isVerified: boolean; isFeatured: boolean; hasWebsite: boolean }
      since: string // ISO
      days: 90
      you: EventCounts & { leads: number }
      peers: { count: number; views: number; phoneClicks: number; scope: 'counties' | 'sitewide' }
    }
    ```
- Consumes: `createServiceClient`.

- [ ] **Step 1: Write the failing tests**

Create `tests/report-data.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { median, summarizeEvents, peerMedians } from '@/lib/report-data'

describe('median', () => {
  it('handles empty, odd and even lists', () => {
    expect(median([])).toBe(0)
    expect(median([5])).toBe(5)
    expect(median([1, 9, 3])).toBe(3)
    expect(median([1, 2, 3, 10])).toBe(2.5)
  })
})

describe('summarizeEvents', () => {
  it('counts each event type per provider', () => {
    const counts = summarizeEvents([
      { provider_id: 'a', event_type: 'view' },
      { provider_id: 'a', event_type: 'view' },
      { provider_id: 'a', event_type: 'click_phone' },
      { provider_id: 'a', event_type: 'click_helpline' },
      { provider_id: 'b', event_type: 'impression' },
      { provider_id: 'b', event_type: 'click_website' },
      { provider_id: 'b', event_type: 'click_callback' },
      { provider_id: 'b', event_type: 'something_new' },
    ])
    expect(counts.a).toEqual({ views: 2, impressions: 0, phoneClicks: 1, websiteClicks: 0, callbackClicks: 0, helplineClicks: 1 })
    expect(counts.b).toEqual({ views: 0, impressions: 1, phoneClicks: 0, websiteClicks: 1, callbackClicks: 1, helplineClicks: 0 })
  })
})

describe('peerMedians', () => {
  it('treats peers with no events as zeros and reports the peer count', () => {
    const counts = summarizeEvents([
      { provider_id: 'p1', event_type: 'view' },
      { provider_id: 'p1', event_type: 'view' },
      { provider_id: 'p1', event_type: 'view' },
      { provider_id: 'p1', event_type: 'click_phone' },
      { provider_id: 'p2', event_type: 'view' },
    ])
    expect(peerMedians(counts, ['p1', 'p2', 'p3'])).toEqual({ count: 3, views: 1, phoneClicks: 0 })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/report-data.test.ts`
Expected: FAIL, cannot resolve `@/lib/report-data`.

- [ ] **Step 3: Write `lib/report-data.ts`**

```ts
import { createServiceClient } from '@/lib/supabase-service'

// Numbers behind /report/[slug]: what one listing got in the last 90 days,
// and what verified listings in the same counties typically get.

export type EventCounts = {
  views: number
  impressions: number
  phoneClicks: number
  websiteClicks: number
  callbackClicks: number
  helplineClicks: number
}

export type ReportData = {
  provider: {
    id: string
    name: string
    slug: string
    city: string
    counties: string[]
    isClaimed: boolean
    isVerified: boolean
    isFeatured: boolean
    hasWebsite: boolean
  }
  since: string
  days: 90
  you: EventCounts & { leads: number }
  peers: { count: number; views: number; phoneClicks: number; scope: 'counties' | 'sitewide' }
}

export const REPORT_DAYS = 90 as const

export function emptyCounts(): EventCounts {
  return { views: 0, impressions: 0, phoneClicks: 0, websiteClicks: 0, callbackClicks: 0, helplineClicks: 0 }
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

const FIELD: Record<string, keyof EventCounts> = {
  view: 'views',
  impression: 'impressions',
  click_phone: 'phoneClicks',
  click_website: 'websiteClicks',
  click_callback: 'callbackClicks',
  click_helpline: 'helplineClicks',
}

export function summarizeEvents(rows: { provider_id: string; event_type: string }[]): Record<string, EventCounts> {
  const out: Record<string, EventCounts> = {}
  for (const r of rows) {
    const field = FIELD[r.event_type]
    if (!field) continue
    out[r.provider_id] ||= emptyCounts()
    out[r.provider_id][field]++
  }
  return out
}

export function peerMedians(counts: Record<string, EventCounts>, peerIds: string[]) {
  const views = peerIds.map(id => counts[id]?.views ?? 0)
  const phones = peerIds.map(id => counts[id]?.phoneClicks ?? 0)
  return { count: peerIds.length, views: median(views), phoneClicks: median(phones) }
}

const MIN_PEERS = 3

export async function getReportData(slug: string): Promise<ReportData | null> {
  const db = createServiceClient()
  const since = new Date(Date.now() - REPORT_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: p } = await db
    .from('providers')
    .select('id, name, slug, city, counties_served, website, is_active, is_claimed, is_verified, is_featured')
    .eq('slug', slug)
    .maybeSingle()
  if (!p || !p.is_active) return null

  const counties: string[] = p.counties_served || []

  // Verified, active peers sharing a county; fall back to all verified.
  let scope: 'counties' | 'sitewide' = 'counties'
  let peerQuery = db.from('providers').select('id').eq('is_active', true).eq('is_verified', true).neq('id', p.id)
  if (counties.length) peerQuery = peerQuery.overlaps('counties_served', counties)
  let { data: peers } = await peerQuery
  if (!peers || peers.length < MIN_PEERS) {
    scope = 'sitewide'
    const r = await db.from('providers').select('id').eq('is_active', true).eq('is_verified', true).neq('id', p.id)
    peers = r.data || []
  }
  const peerIds = peers.map(x => x.id)

  const { data: events } = await db
    .from('provider_events')
    .select('provider_id, event_type')
    .in('provider_id', [p.id, ...peerIds])
    .gte('created_at', since)
    .limit(100000)
  const counts = summarizeEvents(events || [])

  const { count: leads } = await db
    .from('callback_requests')
    .select('id', { count: 'exact', head: true })
    .eq('provider_id', p.id)
    .gte('created_at', since)

  return {
    provider: {
      id: p.id,
      name: p.name,
      slug: p.slug,
      city: p.city || '',
      counties,
      isClaimed: !!p.is_claimed,
      isVerified: !!p.is_verified,
      isFeatured: !!p.is_featured,
      hasWebsite: !!p.website,
    },
    since,
    days: REPORT_DAYS,
    you: { ...(counts[p.id] || emptyCounts()), leads: leads || 0 },
    peers: { ...peerMedians(counts, peerIds), scope },
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/report-data.test.ts`
Expected: PASS.

- [ ] **Step 5: Type-check and commit**

Run: `npx tsc --noEmit`. Expected: no errors (supabase-js types the `overlaps`/`in`/`gte` chain; if `peerQuery` reassignment fails typing, build the two queries inline instead of reassigning).

```bash
git add lib/report-data.ts tests/report-data.test.ts
git commit -m "feat(report): 90-day listing numbers with county peer medians

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: The report page

**Files:**
- Create: `app/report/[slug]/page.tsx`
- Modify: `app/robots.ts:26,31` (disallow `/report/`)

**Interfaces:**
- Consumes: `verifyReportToken` (Task 10), `getReportData` (Task 11), `config.contact`.

- [ ] **Step 1: Write the page**

Create `app/report/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { verifyReportToken } from '@/lib/report-token'
import { getReportData, type ReportData } from '@/lib/report-data'
import { config } from '@/lib/config'

// A private, signed page the operator texts to a provider during a sales
// call. Not linked from anywhere, not indexed, rendered fresh on every hit.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your GeorgiaGAPP listing report',
  robots: { index: false, follow: false },
}

type Props = { params: { slug: string }; searchParams: { t?: string } }

function Stat({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
      {note && <p className="text-xs text-gray-500 mt-2">{note}</p>}
    </div>
  )
}

function missingList(d: ReportData): string[] {
  const items: string[] = []
  if (!d.provider.isClaimed) items.push('Your phone number is not shown. Families who find you cannot call you.')
  if (!d.provider.isVerified) items.push('No callback form. Families who do not call leave without a trace.')
  if (!d.provider.isVerified || !d.provider.hasWebsite) items.push('No link to your website.')
  if (!d.provider.isFeatured) items.push('Not first in your county results. Featured listings are.')
  return items
}

export default async function ReportPage({ params, searchParams }: Props) {
  if (!verifyReportToken(params.slug, searchParams.t)) notFound()
  const d = await getReportData(params.slug)
  if (!d) notFound()

  const reached = d.you.helplineClicks + d.you.leads
  const sinceText = new Date(d.since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const missing = missingList(d)
  const peerScope = d.peers.scope === 'counties'
    ? `${d.peers.count} verified listings that serve your counties`
    : `${d.peers.count} verified listings across Georgia (too few in your counties to compare)`

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <p className="text-sm text-gray-500">GeorgiaGAPP.com listing report</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{d.provider.name}</h1>
          <p className="text-gray-600 mt-1">
            {d.provider.city && `${d.provider.city} · `}Last {d.days} days, since {sinceText}
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What families did on your listing</h2>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Profile views" value={d.you.views} />
            <Stat label="Times shown in search results" value={d.you.impressions} />
            <Stat
              label="Phone taps"
              value={d.you.phoneClicks}
              note={!d.provider.isClaimed ? 'Zero, because your number is not shown.' : undefined}
            />
            <Stat
              label="Families who tried to reach you through us"
              value={reached}
              note={reached > 0 ? 'They tapped our helpline from your page or asked us for a match.' : undefined}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Verified listings near you</h2>
          <p className="text-sm text-gray-500 mb-3">Typical numbers for {peerScope}, same {d.days} days.</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2 font-medium"> </th>
                  <th className="text-right px-4 py-2 font-medium">You</th>
                  <th className="text-right px-4 py-2 font-medium">Verified listing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Profile views</td>
                  <td className="px-4 py-3 text-right font-semibold">{d.you.views}</td>
                  <td className="px-4 py-3 text-right">{d.peers.views}</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Phone taps</td>
                  <td className="px-4 py-3 text-right font-semibold">{d.you.phoneClicks}</td>
                  <td className="px-4 py-3 text-right">{d.peers.phoneClicks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {missing.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What your listing is missing</h2>
            <ul className="space-y-2">
              {missing.map(m => (
                <li key={m} className="flex gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 text-gray-800">
                  <span className="text-primary font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-navy text-white rounded-2xl p-6 text-center print:hidden">
          {!d.provider.isClaimed ? (
            <>
              <h2 className="text-xl font-bold mb-2">Claim your listing. It is free.</h2>
              <p className="text-white/80 mb-4">Claiming turns your phone number on the same day.</p>
              <Link href={`/claim/${d.provider.slug}`} className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg">
                Claim this listing
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">Want the callback form and the top spot?</h2>
              <p className="text-white/80 mb-4">Call or text us and we will turn them on today.</p>
              <a href={`tel:${config.contact.phoneRaw}`} className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg">
                {config.contact.phone}
              </a>
            </>
          )}
        </section>

        <p className="text-xs text-gray-400 text-center">
          Counts come from GeorgiaGAPP.com visitor activity. Search impressions are directory listings shown, not Google.
        </p>
      </div>
    </main>
  )
}
```

`bg-navy` is the existing `#2C3E50` theme colour. If `navy` is not a Tailwind colour name in `tailwind.config.ts`, use `bg-[#2C3E50]`.

- [ ] **Step 2: Keep crawlers out**

In `app/robots.ts` change both `disallow: ['/admin/', '/api/']` to `disallow: ['/admin/', '/api/', '/report/']`.

- [ ] **Step 3: Confirm the guardrail and sitemap**

Run: `grep -n 'report' app/sitemap.ts` → expected no output. Run: `npm run seo:check` → expected exit 0.

- [ ] **Step 4: Open two reports locally**

Get a token with the admin op or a one-liner (needs the env in `.env.local`):

```bash
set -a; source .env.local; set +a; npx tsx -e "import('./lib/report-token').then(m => { console.log(m.reportUrl('opulent-private-care-services')); console.log(m.reportUrl('triumph-private-home-care-llc-decatur-8440')) })"
```

Open both URLs on `npm run dev` (swap the host for `http://localhost:3000`). Expected: Opulent shows views, phone taps, a peers table and the "callback form and top spot" CTA is replaced by nothing missing except Featured if it is Featured; Triumph shows "Zero, because your number is not shown", four missing items, and the claim CTA. Change one character of `t=` → expected 404. Open `/report/no-such-slug?t=anything` → 404.

- [ ] **Step 5: Commit**

```bash
git add 'app/report/[slug]/page.tsx' app/robots.ts
git commit -m "feat(report): signed per-provider listing report page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Report links in admin and in the call-list CSVs

**Files:**
- Modify: `app/admin/page.tsx:320-324` (helper) and `:706-720` (row buttons)
- Create: `scripts/report-links.ts`
- Modify: `outreach/2026-10-15-call-lists/claimed-dial-sheet.csv`, `outreach/2026-10-15-call-lists/hot-unclaimed.csv`, `outreach/2026-10-15-call-lists/README.md`

**Interfaces:**
- Consumes: `providers.reportLink` op (Task 10), `reportUrl` (Task 10).

- [ ] **Step 1: "Copy report" button in admin**

In `app/admin/page.tsx`, after `copyClaimLink` add:

```ts
  // Copy a signed report link for a provider (the sales tool)
  async function copyReportLink(slug: string) {
    const { data, error } = await adminData<{ url: string }>('providers.reportLink', { slug })
    if (error || !data) {
      alert(error?.message || 'Could not make link')
      return
    }
    await navigator.clipboard.writeText(data.url)
  }
```

Confirm `adminData` is already imported in that file (`grep -n "adminData" app/admin/page.tsx`); if not, add `import { adminData } from '@/lib/admin-data'`.

In the row actions, right after the `{!provider.is_claimed && ( … Copy Link … )}` block add:

```tsx
                          <button
                            onClick={async (e) => {
                              const btn = e.currentTarget
                              await copyReportLink(provider.slug)
                              const originalText = btn.innerText
                              btn.innerText = 'Copied!'
                              setTimeout(() => (btn.innerText = originalText), 1000)
                            }}
                            className="px-3 py-1.5 text-xs rounded border border-navy text-navy hover:bg-navy/10"
                          >
                            Copy report
                          </button>
```

(Use `border-[#2C3E50] text-[#2C3E50]` if `navy` is not a theme colour.)

- [ ] **Step 2: Write the script**

Create `scripts/report-links.ts`:

```ts
// Adds a report_url column to the two call-list CSVs so every row on the
// dial sheet has its signed report link.
//   set -a; source .env.local; set +a; npx tsx scripts/report-links.ts
// Needs ADMIN_SESSION_SECRET (or SUPABASE_SERVICE_ROLE_KEY) and
// ADMIN_USERS/ADMIN_PASSWORD to match production, or the links will not verify.
import { readFileSync, writeFileSync } from 'node:fs'
import { reportUrl } from '../lib/report-token'

const FILES = [
  'outreach/2026-10-15-call-lists/claimed-dial-sheet.csv',
  'outreach/2026-10-15-call-lists/hot-unclaimed.csv',
]

function parseCsv(text: string): string[][] {
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

function toCsv(rows: string[][]): string {
  const q = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  return rows.map(r => r.map(q).join(',')).join('\n') + '\n'
}

for (const file of FILES) {
  const rows = parseCsv(readFileSync(file, 'utf8'))
  const header = rows[0]
  const slugIdx = header.indexOf('slug')
  if (slugIdx < 0) throw new Error(`${file}: no slug column`)
  let urlIdx = header.indexOf('report_url')
  if (urlIdx < 0) { header.push('report_url'); urlIdx = header.length - 1 }
  for (const r of rows.slice(1)) {
    if (!r.length || !r[slugIdx]) continue
    r[urlIdx] = reportUrl(r[slugIdx])
  }
  writeFileSync(file, toCsv(rows))
  console.log(`${file}: ${rows.length - 1} rows, report_url set`)
}
```

- [ ] **Step 3: Run it against the real secrets**

The links must verify on production, so the env used here must equal Vercel's `ADMIN_SESSION_SECRET` (or `SUPABASE_SERVICE_ROLE_KEY` if that is what production falls back to) and `ADMIN_USERS`/`ADMIN_PASSWORD`. Check with the operator which of these is set on Vercel; pull them into `.env.local` by hand (do not print them), then:

```bash
set -a; source .env.local; set +a; npx tsx scripts/report-links.ts
```

Expected: two lines, `62 rows` and `69 rows`. Open one URL from the CSV against the production site after deploy (Task 14) to confirm it verifies.

- [ ] **Step 4: Update the README**

Append to `outreach/2026-10-15-call-lists/README.md`:

```markdown

`report_url` (added 2026-10-15): a signed link to that provider's 90-day listing report. Text it
during the call. Links stop working if ADMIN_SESSION_SECRET or the admin password changes; rerun
`scripts/report-links.ts` to regenerate.
```

- [ ] **Step 5: Commit**

```bash
git add app/admin/page.tsx scripts/report-links.ts outreach/2026-10-15-call-lists/
git commit -m "feat(admin): copy report link; script adds report_url to the call lists

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Full verification, PR, env, production check

**Files:**
- None new. Verifies everything above.

- [ ] **Step 1: Run everything**

```bash
npm test && npx tsc --noEmit && npm run lint && npm run build
```

Expected: tests pass, no type errors, lint clean (or only pre-existing warnings), `seo-check` passes, build succeeds.

- [ ] **Step 2: Manual pass on a phone-width window**

With `npm run dev`:

1. `/provider/triumph-private-home-care-llc-decatur-8440`: helpline block, tap "Call" (observe a `POST /api/events/track` with `click_helpline` in the network tab), submit the form with a real-looking test name "QA Family".
2. `/gapp-approval-timeline`: banner above the FAQs, submit once.
3. `/admin/leads`: both rows under "Needs match" with source badges and "From:" links. Assign the first to a verified provider. Check Resend's log for the provider email.
4. "Add phone lead", save, see it with the Phone badge and status Contacted.
5. `/report/<slug>?t=…` for Opulent and Triumph; tamper the token → 404.
6. `/contact` and the footer show `(678) 263-8540`.

Then delete the QA rows:

```bash
npx supabase@2.120.0 db query --linked --project-ref mjuuqjrxzhkvsbrgqfot "delete from callback_requests where parent_name like 'QA %' and source in ('match_form','phone')"
```

- [ ] **Step 3: Vercel env**

Add `LEAD_NOTIFY_EMAIL` to Production and Preview on the Vercel project (operator's address, from the brainstorm). Confirm `ADMIN_SESSION_SECRET` is set on Production so report links are stable and not tied to the service-role key.

- [ ] **Step 4: Open the PR**

```bash
git push -u origin feat/match-leads-and-reports
gh pr create --title "Match leads, helpline CTA, provider traffic reports" --body "$(cat <<'EOF'
## What

- New site number (678) 263-8540 everywhere (old one is dead).
- Unclaimed provider pages and the five top-traffic content pages now show "call or text us" plus a four-field match form. Leads land in callback_requests with no provider (migration 014, applied).
- /admin/leads: "Needs match" tab, assign-and-email to a verified provider in the county, "Add phone lead".
- /report/[slug]?t=<signed token>: 90-day listing report with county peer medians. "Copy report" button in admin; `scripts/report-links.ts` added report_url to the Oct 15 call lists.
- Vitest added; tests for validation, dedup window, emails, token, report math.

## Why

Jul 15 – Oct 15: 728 of 1,221 provider-page views (60%) hit unclaimed listings with no phone and no form. Verified listings convert ~6% of views. Spec: docs/superpowers/specs/2026-10-15-match-leads-and-provider-reports-design.md

## Before merge

- [ ] `LEAD_NOTIFY_EMAIL` set on Vercel (Production + Preview)
- [ ] `ADMIN_SESSION_SECRET` set on Production

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: After merge, verify on production**

Within ~1 hour of deploy (the provider page ISR window is 3600s), open `https://www.georgiagapp.com/provider/triumph-private-home-care-llc-decatur-8440` and confirm the helpline block renders, then one `report_url` from the CSV and confirm it loads. Submit one real test lead with your own phone and confirm the email arrives at `LEAD_NOTIFY_EMAIL`; delete the row afterwards with the same SQL as Step 2.

- [ ] **Step 6: Record it**

Update memory `project_dead_end_views_2026_10.md` with the merge commit and "shipped" status, and add `/report/[slug]` and `LEAD_NOTIFY_EMAIL` to CLAUDE.md's API routes and environment variables sections.
