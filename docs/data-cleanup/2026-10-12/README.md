# Provider listing cleanup, 2026-10-12

The directory was loaded twice in December 2025: Dec 15 from a list of legal names in capitals,
Dec 22 from the state GAPP list (Appendix P). The Dec 22 import ran the list's two columns
together, so counties got glued onto names and cities ("Everbright CareFulton", city
"CherokeeAtlanta"), and a few rows got a county or page header as their whole name ("Marion",
"AAPPENDIX P"). Many agencies ended up listed twice, once per import.

All applied with `supabase db query --linked -f` (CLI 2.120). Every update is guarded on the
old value, and claimed listings are left alone.

| SQL | What it did |
|---|---|
| `010_fix_garbled_provider_names.sql` | 128 names, 132 cities copied from the Aug 15 2026 state list (`outreach/2026-09-appendix-p/`), matched by name, or by phone where the Dec 2025 and Aug 2026 lists agree |
| `011_fix_cities_for_phone_matched_rows.sql` | cities for the 17 phone-matched rows 010 renamed |
| `012_strip_glued_counties.sql` | glued county stripped from 65 names and 40 cities the state list doesn't cover |
| `013_retire_duplicates_and_names.sql` | 93 duplicate listings retired (is_active = false), their URLs forward (308) to the kept listing via `provider_slug_redirects`; blank website/email/address filled from the copy; Strength In Care given its own number (404-585-1515, NPI registry); 127 ALL-CAPS legal names replaced by the state list's trading name |

Result: 624 rows, 531 live listings, 93 retired, 93 redirects (all to a live listing).

## Rules used for duplicates
A pair is merged only when the names match after dropping LLC/INC and a glued county, AND the
two share a city, phone or street number. Names less than 80% alike also need a shared phone or
street. Chains with offices in different cities (Aveanna, Maxim Augusta) are separate listings
and stay. Kept: claimed, then verified, then has callbacks, then on the Aug 2026 state list,
then the clean name. No claimed or verified listing, and none with a family callback, was retired.

## Left alone
- `duplicates-to-review.csv`: the first, looser duplicate pass. Superseded by 013; kept for
  reference.
- `held-rows.csv`: listings that share a phone line with another agency on the state list
  itself (Kunect / Kamcare / Modani; Mir Home Care / MRI Care), URE Healthcare (the two state
  lists disagree), and two names with no recoverable original ("BibbHealthcareGwinnett",
  "StaffingNewton").
- About 140 listings still show ALL-CAPS legal names: they are not on the Aug 2026 state list
  by name, so there is no trading name to copy.
- Charin Health Services (Mableton) is on the state list but has no listing of its own: the
  outreach join had mapped it to the Strength In Care row, which carried Charin's phone. Add it
  with the other ~94 state-list agencies that are not in the directory yet.
