-- 009: lock the public key out of everything it should not read or change.
--
-- Before (found 2026-10-12): providers and callback_requests had "allow all"
-- policies with no role attached, so anyone holding the public (anon) key,
-- which ships in every visitor's browser, could read the family callback
-- requests (parent name, phone, email, child's needs) and edit or delete any
-- provider listing. availability_tokens and provider_events were publicly
-- readable, and the providers table exposed claimers' names, emails, phones
-- and claim tokens.
--
-- After: the public roles (anon, authenticated) may only
--   * read active providers, and only the public columns
--     (lib/provider-columns.ts lists the same set)
--   * insert a callback request
-- Everything else runs in server routes with the service role, which bypasses
-- row security. Deploy the app code from PR "Lock the database down" FIRST:
-- the admin pages stop using the public key there.
--
-- Safe to re-run: it drops whatever policies exist on these tables and
-- recreates only the ones below.

BEGIN;

DO $$
DECLARE
  t text;
  r record;
  app_tables text[] := ARRAY[
    'providers', 'callback_requests', 'provider_events', 'availability_tokens',
    'listing_requests', 'provider_issues', 'provider_inquiries', 'pending_upgrades'
  ];
BEGIN
  FOREACH t IN ARRAY app_tables LOOP
    IF to_regclass('public.' || t) IS NULL THEN
      CONTINUE;
    END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, t);
    END LOOP;
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
  END LOOP;
END $$;

-- providers: active rows, public columns only.
CREATE POLICY "Public reads active providers" ON public.providers
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

GRANT SELECT (
  id, name, slug, city, state, counties_served, email, phone, intake_phone,
  website, address, services_offered, accepting_new_patients,
  response_expectation, available_hours, languages, bio, how_to_start,
  years_in_business, tier_level, is_active, is_verified, is_featured,
  background_checked_staff, fast_response, created_at, updated_at,
  verified_at, featured_at, is_claimed, claimed_at, is_available,
  availability_updated_at, availability_streak
) ON public.providers TO anon, authenticated;

-- callback_requests: a family can submit one; nobody reads them with the
-- public key.
CREATE POLICY "Anyone can create callback requests" ON public.callback_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON public.callback_requests TO anon, authenticated;

COMMIT;

-- Check: one row per public table. Expect rls_on = true on the app tables,
-- anon_* = false everywhere except anon_insert on callback_requests, and only
-- the two policies above.
SELECT
  c.relname AS table_name,
  c.relkind AS kind,
  c.relrowsecurity AS rls_on,
  (SELECT string_agg(p.policyname || ' [' || p.cmd || ']', '; ')
     FROM pg_policies p
    WHERE p.schemaname = 'public' AND p.tablename = c.relname) AS policies,
  has_table_privilege('anon', c.oid, 'SELECT') AS anon_select_all_columns,
  has_table_privilege('anon', c.oid, 'INSERT') AS anon_insert,
  has_table_privilege('anon', c.oid, 'UPDATE') AS anon_update,
  has_table_privilege('anon', c.oid, 'DELETE') AS anon_delete
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'v', 'm', 'p')
ORDER BY c.relname;
