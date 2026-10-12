# Provider name cleanup, 2026-10-12

The December 2025 import ran the state list's two columns together: counties got glued onto
names and cities ("Everbright CareFulton", city "CherokeeAtlanta"), and a few rows got a county
or page header as their whole name ("Marion", "AAPPENDIX P").

## Applied (supabase/migrations)
- `010_fix_garbled_provider_names.sql`: 128 names and 95 cities copied from the Aug 15 2026
  state list (`outreach/2026-09-appendix-p/`), plus 37 city-only fixes. Unclaimed rows only,
  matched by name, or by phone where the Dec 2025 and Aug 2026 lists agree on who owns the phone.
- `011_fix_cities_for_phone_matched_rows.sql`: cities for the 17 phone-matched rows 010 renamed.

Slugs did not change, so no URL moved.

## Waiting for a yes
- `012_strip_glued_counties.PENDING.sql`: strips the glued county from 65 names and 40 cities the
  state list doesn't cover. Mechanical; reviewed by eye.

## Needs a decision
- `duplicates-to-review.csv`: 115 rows that look like a second listing of a business already
  listed. Most are the legal-name row ("ACE HEALTHCARE, LLC") next to the trading-name row
  ("ACE Healthcare"). Phones usually differ between the two imports, and the name match strips
  generic words, so some pairs may be different businesses. Retiring a row should also redirect
  its URL to the kept one.
- `held-rows.csv`: rows not touched. Two of them carry another business's phone number.
