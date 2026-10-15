# Call lists, 2026-10-15

Source: Supabase `providers`, `provider_events`, `callback_requests` (pulled 2026-10-15) joined to the
GSC 3-month export (Jul 15 - Oct 15, 2026) by provider slug.

- `claimed-dial-sheet.csv` - all 62 claimed, active providers. `priority`:
  1 = claimed, unverified, already getting free phone calls (hottest)
  2 = claimed since May 1, unverified, never replied to
  3 = verified, not Featured, getting calls or leads (upsell)
  4 = other claimed, unverified
  5 = verified, no engagement yet
  `calls_all` = phone clicks all time, `calls_sep`/`views_sep` = since Sep 9. `gsc_*` = organic search, 3 months.
- `hot-unclaimed.csv` - 69 unclaimed listings with 3+ profile views since Jul 15. Nobody can call them:
  unclaimed listings show no phone. Pitch is "claim it free", then the verified upsell.

Known dups: Mudaris Healthcare claimed twice (Smyrna + Gwinnett, same phone). Edlyn's retired slug
(`...-lawrenceville-6764`) still earns 18 GSC clicks and redirects to `edlyn-healthcare-services`.

`report_url` (added 2026-10-15): a signed link to that provider's 90-day listing report. Text it
during the call. To fill or refresh the column: in /admin on production click "Export Report Links",
then run `npx tsx scripts/report-links.ts ~/Downloads/gapp-report-links-YYYY-MM-DD.csv`. Links stop
working if the admin password or ADMIN_USERS changes; re-export and re-run.
