-- Verify One Provider Per County
-- This script selects one provider per county and marks them as verified
-- Run this in Supabase SQL Editor

-- First, let's see the current state
-- SELECT
--   unnest(counties_served) as county,
--   COUNT(*) as provider_count,
--   SUM(CASE WHEN is_verified THEN 1 ELSE 0 END) as verified_count
-- FROM providers
-- GROUP BY county
-- ORDER BY county;

-- Create a CTE to get one random provider per county
WITH county_providers AS (
  SELECT DISTINCT ON (county)
    p.id,
    p.name,
    county
  FROM providers p,
    unnest(p.counties_served) AS county
  WHERE p.is_active = true
  ORDER BY county, p.name -- Pick alphabetically first provider per county for consistency
),
providers_to_verify AS (
  SELECT DISTINCT id FROM county_providers
)
-- Update these providers to be verified
UPDATE providers
SET
  is_verified = true,
  verified_at = NOW(),
  accepting_new_patients = true
WHERE id IN (SELECT id FROM providers_to_verify);

-- Show results
SELECT
  unnest(counties_served) as county,
  name,
  is_verified,
  accepting_new_patients
FROM providers
WHERE is_verified = true
ORDER BY county, name;
