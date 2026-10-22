-- One premium seat per county. A featured agency names the one county where it
-- sits first; everywhere else it ranks as verified. The unique index is what
-- keeps the "one dominant agency per county" promise true at the database.
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS premium_county TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS providers_premium_county_unique
  ON public.providers (lower(premium_county))
  WHERE premium_county IS NOT NULL AND is_active = true;

GRANT SELECT (premium_county) ON public.providers TO anon, authenticated;
