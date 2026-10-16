# Match leads, helpline CTA, and provider traffic reports

**Date:** 2026-10-15
**Branch:** `feat/match-leads-and-reports` (from `main` at `3254fd4`)
**Status:** approved in conversation, awaiting spec review

## Why

Measured 2026-10-15 (see memory `project-dead-end-views-2026-10`): search traffic tripled since
April, but leads stayed at about two a month. Of 1,221 provider-page views between Jul 15 and
Oct 15, 728 (60%) landed on unclaimed listings, which show no phone number and no form. Those
families leave with nothing. Verified listings turn about 6% of views into a call or a form.

Two things follow. First, the site should capture those families itself, by phone first and a
short form second, and route them to verified providers. Second, the 62 claimed providers who
are not paying need a sales tool that shows them, in their own numbers, what the directory
already sends them.

## Scope

In:

1. New site phone number sitewide: **678-263-8540**. The old number no longer works.
2. A helpline CTA (call or text us) plus a short "match me" form on unclaimed provider pages
   and on the five highest-traffic informational pages.
3. Site-owned leads stored in `callback_requests` with no provider, emailed to the operator.
4. Admin: see unassigned leads, assign one to a verified provider (which emails that
   provider), and log a phone lead by hand.
5. A public, signed, per-provider traffic report at `/report/[slug]?t=…`, plus a script that
   writes each report link into the two call-list CSVs.

Out (this pass): SMS sending, provider portal changes, pay-per-lead billing, the
client-rendered `/directory` page, any change to claimed or verified provider pages.

## 1. Phone number

`lib/config.ts` → `contact.phone = '(678) 263-8540'`, `contact.phoneRaw = '+16782638540'`.
Every existing render (footer in `app/layout.tsx`, `/contact`, `/privacy`, `/terms`) reads
from config, so nothing else changes. Grep for the literal old number `746-3176` and
`17707463176` across `app/`, `components/`, `lib/`, `public/` to confirm no hardcoded copies.

## 2. Data model

Migration `supabase/migrations/014_match_leads.sql`:

```sql
ALTER TABLE callback_requests ALTER COLUMN provider_id DROP NOT NULL;
ALTER TABLE callback_requests
  ADD COLUMN source TEXT NOT NULL DEFAULT 'provider_form'
    CHECK (source IN ('provider_form', 'match_form', 'phone')),
  ADD COLUMN source_page TEXT;
CREATE INDEX idx_callback_requests_unassigned
  ON callback_requests (created_at DESC) WHERE provider_id IS NULL;

ALTER TABLE provider_events DROP CONSTRAINT provider_events_event_type_check;
ALTER TABLE provider_events ADD CONSTRAINT provider_events_event_type_check
  CHECK (event_type IN ('view','click_phone','click_website','click_callback','impression','click_helpline'));
```

- `source`: `provider_form` (existing CallbackForm), `match_form` (new form), `phone`
  (logged by the operator in admin).
- `source_page`: the path the family was on (`/provider/<slug>` or `/gapp-approval-timeline`).
- `zip_code` stays NOT NULL in the table; the match form does not collect it, so the API
  stores `''`. (Changing the column is a wider change than this needs.)
- `click_helpline` on `provider_events`: a tap on our number from an unclaimed provider's
  page, attributed to that provider. This is the "families tried to reach you through us"
  number on the report.
- RLS from 009 already allows anon INSERT on `callback_requests` and nothing else; the new
  API routes use the service role, as `/api/callback` does. No policy changes.

Apply with the CLI (`npx supabase@2.120.0 db query --linked …`) after the operator says yes,
per the lock-down memory rule on production writes.

## 3. Public surfaces

### 3a. `components/HelplineCta.tsx` (server component)

Props: `county?: string`, `providerId?: string`, `sourcePage: string`, `variant: 'provider' | 'banner'`.

Renders, in order:

- Heading. Provider variant: "This agency hasn't claimed its listing yet, so we can't connect
  you to them directly." Banner variant: "Not sure which provider to call?"
- One line: "Call or text us at **678-263-8540** and we'll match you with a GAPP provider in
  {county ?? 'your county'} today. A real person answers."
- The phone as a tap-to-call button (`tel:+16782638540`) and a "Text us" button
  (`sms:+16782638540`). On provider pages both are `TrackableLink` with
  `eventType="click_helpline"`; on informational pages they are plain links (no provider to
  attribute to; GTM already sees the click).
- `<MatchForm …/>` below.

Copy must follow the 5th-grade voice rule (`feedback_content_voice_5th_grade.md`).

### 3b. `components/MatchForm.tsx` (client component)

Fields: parent name, phone, county (select from `GEORGIA_COUNTIES` in
`lib/screener-config.ts`, prefilled from the prop), what you need (RN / LPN / PCS / not sure,
labels from `config.services`), optional "anything we should know" textarea, and the same SMS
consent checkbox text as `CallbackForm` with "and {providerName}" removed. Four required
fields, one screen, no steps. Urgency is not asked; the API stores `urgency = 'asap'`
because a family on an unclaimed page is looking now, and the operator qualifies on the call.

Posts to `/api/match`. Success state: "Got it. We'll call or text you within one business
day. Faster: call us now at 678-263-8540." Error state mirrors CallbackForm.

### 3c. Placement

- `app/provider/[slug]/page.tsx`, the unclaimed branch only (the `else` of
  `provider.isClaimed` around line 383): replace the "Contact Information Unavailable" block
  with `<HelplineCta variant="provider" county={provider.countiesServed[0]}
  providerId={provider.id} sourcePage={`/provider/${provider.slug}`} />`. Keep the
  "Are you the owner?" claim link below it, smaller.
- Informational pages, inserted immediately before the FAQ section:
  `/georgia-pediatric-program`, `/gapp-providers-georgia`, `/gapp-paid-caregiver`,
  `/katie-beckett-waiver-georgia`, `/gapp-approval-timeline`. `variant="banner"`,
  `sourcePage` = the page path.
- Claimed-unverified and verified pages: unchanged.

The provider page already has `export const revalidate = 3600`; the five content pages are
static and rebuild on deploy.

## 4. `/api/match` (POST)

`app/api/match/route.ts`, service-role client like `/api/callback`.

Body: `{ parentName, phone, county, serviceNeeded, notes?, sourcePage, smsConsent }`.

1. Validate: all four required fields present, `serviceNeeded` in
   `RN | LPN | PCS | not_sure`, `smsConsent === true`, `sourcePage` starts with `/` and is
   under 200 chars. 400 otherwise.
2. Normalise phone to digits; reject if fewer than 10.
3. Dedup: same normalised phone with `source = 'match_form'` in the last 30 minutes returns
   `{ success: true, id, deduped: true }` without inserting or emailing.
4. Insert: `provider_id = null, source = 'match_form', source_page, zip_code = '',
   urgency = 'asap', status = 'new', special_needs = notes`.
5. Email the operator via Resend to `process.env.LEAD_NOTIFY_EMAIL` (new Vercel env var,
   set to the operator's address). Subject: `Match lead: {parentName}, {county}, {service}`.
   Body: the fields, the source page as a link, and an admin link to `/admin/leads`. If the
   env var or Resend is missing, log and still return success; the lead is in the table.
6. Response `{ success: true, id }`.

Validation, phone normalisation, and the dedup window are pure functions in
`lib/match-lead.ts` so they can be unit-tested without a database.

## 5. Admin

### 5a. `app/api/admin/data/route.ts`

- `leads.list`: unchanged query; rows now include `source`, `source_page`, and a null
  `provider` for unassigned leads.
- New `leads.assign` `{ id, providerId }`: sets `provider_id`, keeps `status`, then sends
  the provider the existing lead email. Move the HTML template out of `/api/callback/route.ts`
  into `lib/lead-email.ts` → `sendLeadEmail(provider, lead)` and call it from both places.
  Returns the updated row.
- New `leads.insertPhone` `{ parentName, phone, county, serviceNeeded, notes }`: inserts
  with `source = 'phone'`, `provider_id = null`, `urgency = 'asap'`, `zip_code = ''`.
- New `providers.forCounty` `{ county }`: `id, name, slug, is_featured` for active,
  verified providers whose `counties_served` contains the county, Featured first, then name.

### 5b. `app/admin/leads/page.tsx`

- Status filter gains a "Needs match" tab: `provider_id IS NULL`. Default tab becomes
  "Needs match" when any exist.
- Unassigned rows show a source badge ("Match form" / "Phone") and the source page, and an
  "Assign to provider" select populated from `providers.forCounty` for the lead's county,
  with an "Assign and email" button. After assignment the row shows the provider link like
  any other lead.
- "Add phone lead" button opens an inline form with the five fields, posts
  `leads.insertPhone`, prepends the row.

## 6. Provider report

### 6a. Token

`lib/report-token.ts`: `reportToken(slug)` = HMAC-SHA256 over `report-v1:${slug}` with the
same `signingKey()` derivation as `lib/admin-session.ts` (export that function), base64url,
first 24 chars. `verifyReportToken(slug, token)` uses `timingSafeEqual`. No expiry; the
admin can rotate every link by changing `ADMIN_SESSION_SECRET`.

### 6b. Page `app/report/[slug]/page.tsx`

- `dynamic = 'force-dynamic'`, `robots: noindex`, no nav links to it.
- Bad or missing token → `notFound()`. Inactive provider → `notFound()`.
- Data (service role, last 90 days, computed in `lib/report-data.ts` → `getReportData(slug)`):
  - `views`, `impressions`, `phoneClicks`, `websiteClicks`, `callbackClicks`, `helplineClicks`
    from `provider_events` for this provider.
  - `leads`: count of `callback_requests` with this `provider_id`.
  - `peer`: for verified, active providers sharing at least one county with this one, the
    median `views` and `phoneClicks` per provider over the same window, and how many such
    providers there are. If fewer than three peers, show the sitewide verified median
    instead and say so.
- Layout (Tailwind, prints cleanly, phone-width first):
  1. "Your GeorgiaGAPP listing report" + provider name, city, date range.
  2. Four stat tiles: profile views, directory impressions, phone taps, families who tried to
     reach you through us (helpline taps + leads). Unclaimed listings show "0, because your
     number isn't shown" under phone taps.
  3. "Verified listings in your counties" comparison, two columns (you vs. peer median).
  4. "What you're missing" list driven by state: no phone shown (unclaimed), no callback
     form (not verified), no website link (not verified), not first in county results (not
     Featured).
  5. One CTA: claim link if unclaimed, otherwise "Call or text 678-263-8540 to turn these on."
- Copy at 5th-grade level, no AI tells.

### 6c. Links for the call lists

`scripts/report-links.ts` (run with `tsx`, needs `ADMIN_SESSION_SECRET` and the admin env in
`.env.local`): reads `outreach/2026-10-15-call-lists/claimed-dial-sheet.csv` and
`hot-unclaimed.csv`, adds a `report_url` column (`https://www.georgiagapp.com/report/<slug>?t=<token>`),
writes them back in place. Also a `leads.reportLink { slug }` admin op and a "Copy report
link" button on the admin providers table, so a single link can be made without the script.

## 7. Testing

- Add `vitest` (dev dependency) and `npm test`. No test runner exists today.
- Unit tests: `lib/match-lead.ts` (validation cases, phone normalisation, dedup window
  helper), `lib/report-token.ts` (round trip, tamper, wrong slug), `lib/report-data.ts`
  peer-median helper on fixed arrays.
- Build must pass `scripts/seo-check.ts` (no new SEO pages are added; `/report` is noindex
  and not in the sitemap).
- Manual before merge: one unclaimed provider page and `/gapp-approval-timeline` on a phone
  width; submit the form, see the lead in admin under "Needs match", assign it to a verified
  provider, confirm the provider email in Resend's log; open a report link for Opulent and
  for Triumph Private Home Care.

## 8. Rollout order

1. Config number change + migration 014 (apply after approval).
2. `/api/match`, `MatchForm`, `HelplineCta`, provider-page placement.
3. Informational page placement.
4. Admin: needs-match tab, assign, phone lead.
5. Report page, token, script; regenerate the CSVs with links.
6. Set `LEAD_NOTIFY_EMAIL` on Vercel, merge, verify on production.

## Open items noted, not in scope

- Two leads from September still sit in status `new`.
- Mudaris Healthcare claimed twice (two listings, one phone).
- `help@georgiagapp.com` inbox remains inaccessible; provider replies to lead emails go there.
