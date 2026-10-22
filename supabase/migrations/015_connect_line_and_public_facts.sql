-- Connect line and public facts (2026-10-22).
-- See docs/superpowers/specs/2026-10-22-connect-line-and-public-facts-design.md

-- A pool number assigned to one listing for a short window. A call that
-- arrives on that number inside the window forwards to that listing.
CREATE TABLE IF NOT EXISTS public.connect_assignments (
  number TEXT PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- One row per inbound call on a pool number.
CREATE TABLE IF NOT EXISTS public.connect_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_sid TEXT UNIQUE NOT NULL,
  from_number TEXT,
  to_number TEXT NOT NULL,
  provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  forwarded_to TEXT NOT NULL CHECK (forwarded_to IN ('agency', 'operator')),
  dial_status TEXT,
  duration_seconds INTEGER,
  fell_back BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_connect_calls_provider ON public.connect_calls (provider_id, created_at DESC);

-- Service role only, same as the other operator tables (009).
ALTER TABLE public.connect_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_calls ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.connect_assignments FROM anon, authenticated;
REVOKE ALL ON public.connect_calls FROM anon, authenticated;

-- A connected call counts on the listing report next to phone taps.
ALTER TABLE public.provider_events DROP CONSTRAINT IF EXISTS provider_events_event_type_check;
ALTER TABLE public.provider_events ADD CONSTRAINT provider_events_event_type_check
  CHECK (event_type IN ('view', 'click_phone', 'click_website', 'click_callback', 'impression', 'click_helpline', 'connect_call'));

-- Public facts from public records (NPI registry, Georgia DCH Appendix P).
ALTER TABLE public.providers
  ADD COLUMN IF NOT EXISTS npi TEXT,
  ADD COLUMN IF NOT EXISTS npi_enumeration_date DATE,
  ADD COLUMN IF NOT EXISTS npi_taxonomy TEXT,
  ADD COLUMN IF NOT EXISTS npi_official_name TEXT,
  ADD COLUMN IF NOT EXISTS npi_official_title TEXT,
  ADD COLUMN IF NOT EXISTS state_list_date DATE,
  ADD COLUMN IF NOT EXISTS state_list_coverage TEXT,
  ADD COLUMN IF NOT EXISTS facts_checked_at TIMESTAMPTZ;

GRANT SELECT (
  npi, npi_enumeration_date, npi_taxonomy, npi_official_name, npi_official_title,
  state_list_date, state_list_coverage, facts_checked_at
) ON public.providers TO anon, authenticated;

-- Check: expect two new tables with RLS on and no anon privileges, and
-- eight new provider columns readable by anon.
SELECT c.relname, c.relrowsecurity, has_table_privilege('anon', c.oid, 'SELECT') AS anon_select
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('connect_assignments', 'connect_calls');
