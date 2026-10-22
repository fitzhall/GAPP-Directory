-- 017: merge the two Mudaris Healthcare listings (2026-10-22)
-- Mudaris called: they claimed two listings on 2026-09-21 and one is wrong.
-- Keep mudaris-healthcare (right website + business email). Its phone was
-- missing a digit (404482011); 404-448-2011 is the number on mudarishealthcare.com.
-- Add the counties the retired copy listed. Retire mudaris-healthcare-llc
-- (misspelled website) and forward its URL. No callback_requests on either row.
-- Unlike 013, the retired row is claimed; the owner asked for this.

BEGIN;

UPDATE public.providers
SET phone = '404-448-2011',
    counties_served = ARRAY(SELECT DISTINCT unnest(counties_served || ARRAY['Oconee','Spalding','Pulaski','Dawson']::text[]) ORDER BY 1)
WHERE id = '0cbe9ea5-ef24-4b7e-83ea-66ce07edc2df';

UPDATE public.providers SET is_active = false
WHERE id = '39311a98-e944-44dc-b0a1-42e45c9e508c' AND is_active;

INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason)
VALUES ('mudaris-healthcare-llc', 'mudaris-healthcare', 'duplicate listing, owner request 2026-10-22')
ON CONFLICT (old_slug) DO NOTHING;

COMMIT;
