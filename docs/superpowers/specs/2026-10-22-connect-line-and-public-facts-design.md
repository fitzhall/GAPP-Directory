# Connect line and public facts on non-verified listings

Date: 2026-10-22. Approved in chat ("build", operator opted out of questions; the how-it-gets-made choices below are the builder's calls).

## Why

Over the last 90 days the 468 unclaimed listings drew 632 page views and the site captured nothing from them: the agency phone is hidden on unclaimed pages, and the helpline button got 0 taps against 17 taps on agency numbers elsewhere. Families want the agency's number. Google is also not indexing 467 provider pages because they hold nothing beyond name, phone, city and counties.

Two changes, both on listings that are **not verified and not featured** (claimed-but-unverified included):

1. **Connect line.** A "Call {Agency}" button that rings a GeorgiaGAPP-owned Twilio number and forwards to the agency. Every call is logged against the listing and emailed to the operator. If the agency does not pick up, the caller lands on the GeorgiaGAPP helpline.
2. **Public facts.** A "Public record" section built from the NPI registry and the Georgia DCH GAPP provider list (Appendix P, 2026-08-15), so each page carries facts that are true, unique to that agency, and useful to a parent.

## Goals, non-goals, anti-goals

- Goal: calls that already want to happen go through a line we own; the operator sees every one (caller number, agency, outcome).
- Goal: every provider page shows at least one verifiable public fact where a confident match exists.
- Non-goal: call screening, recording, SMS, an admin call log UI. Email per call is the deliverable.
- Non-goal: Secretary of State and DCH license lookups (no public API; manual later).
- Anti-goal: a wrong NPI or a wrong "in business since" on a page. Matching is conservative; ambiguous means blank.
- Anti-goal: presenting the referral number as the agency's own number. The page says the call goes through the GeorgiaGAPP referral line.

## Connect line: how it works

**Pool numbers.** `TWILIO_CONNECT_NUMBERS` is a comma-separated list of E.164 Twilio numbers. When a visitor taps Call, the page asks `POST /api/connect/number` for a number. The server assigns one pool number to that listing for 15 minutes (`connect_assignments`), reusing an unexpired assignment for the same listing, else a free or expired number, else the one that expires soonest. The browser then dials it. If the request fails or takes over 2 seconds, the browser dials the agency's number directly (claimed-unverified pages) or does nothing extra (unclaimed pages show the button only when the pool is configured).

**Inbound call.** Twilio posts to `POST /api/connect/voice`. The server validates the Twilio signature, finds the live assignment for the dialed number, logs a `connect_calls` row and a `connect_call` provider event, and returns TwiML: a one-line "Connecting you to {Agency} through the Georgia GAPP directory", then `<Dial>` to the agency's intake or main phone with a 25-second timeout and a whisper to the agency ("A family is calling from GeorgiaGAPP.com"). No assignment live: dial the helpline instead.

**After the agency leg.** The `<Dial action>` posts to `POST /api/connect/status`. Completed: hang up. Busy, no answer, failed, canceled: say "That agency did not pick up. Connecting you to the Georgia GAPP help line" and dial `CONNECT_FALLBACK_PHONE` (defaults to the site helpline). Either way the row is updated and an email goes to `LEAD_NOTIFY_EMAIL` with caller, agency, outcome, duration.

**Caller ID.** `<Dial>` is left at its default, so the agency sees the family's number and can call back.

**Env.** `TWILIO_AUTH_TOKEN` (signature check), `TWILIO_CONNECT_NUMBERS`, optional `CONNECT_FALLBACK_PHONE`. With no pool configured the site behaves exactly as before. No Twilio SDK; TwiML is a string and the signature is an HMAC-SHA1 in `lib/twilio-signature.ts`.

**Twilio setup (operator).** Buy the numbers, set each number's Voice webhook to `https://www.georgiagapp.com/api/connect/voice` (POST), add the three env vars in Vercel, redeploy.

## Public facts: how it works

**Sources.** NPI registry API (`npiregistry.cms.hhs.gov/api`, version 2.1, organizations in GA). Appendix P 2026-08-15 (`outreach/2026-09-appendix-p/appendix-p-2026-08-15-email-list.csv`, joined by `directory_slug`).

**Matching (lib/public-facts.ts).** Names are normalized (uppercase, punctuation removed, LLC/INC/CORP/CO/LTD and a leading THE dropped). A candidate is accepted when the normalized names are equal and the city, phone or street also agrees, or when the phone matches and one name is a prefix of the other. Two accepted candidates with the same score means no match. Everything else stays blank. `facts_checked_at` is set either way so the script does not re-query.

**Columns on providers.** `npi`, `npi_enumeration_date`, `npi_taxonomy`, `npi_official_name`, `npi_official_title`, `state_list_date`, `state_list_coverage`, `facts_checked_at`. Public-readable (column grant, added to `PUBLIC_PROVIDER_COLUMNS`).

**Script.** `scripts/enrich-public-facts.ts` with `--dry-run` and `--all`. Writes a review CSV to `outreach/2026-10-22-public-facts/npi-matches.csv`, then applies with the service role.

**Page.** A "Public record" section on every provider page that has at least one fact, in plain 5th-grade copy, e.g. "Listed in the national provider registry since November 2020 (NPI 1346842911)." "Registered as: In Home Supportive Care." "Contact on record: Erika Thomas, Owner." "On the Georgia Medicaid GAPP provider list dated August 15, 2026." The NPI goes into the MedicalBusiness schema as an identifier.

## Builder's calls

- 15-minute assignment window; number fetched at tap time (not on page load) so crawlers do not churn the pool.
- Say-only whisper, no key-press screening, so a voicemail pick-up cannot strand the caller. Screening is a follow-up once the line is live and testable.
- Email to the operator only, no email to the agency.
- Facts section is shown on verified listings too; it is factual and helps every page.
