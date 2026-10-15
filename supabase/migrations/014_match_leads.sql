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
