-- 019: restore counties the claim form wiped (2026-11-04)
-- /api/providers/[slug] never returned counties_served, so /claim/[slug]
-- submitted an empty list unless the agency re-picked every county (fixed in
-- d394d20). Five live listings ended up on no county page. Restore each to
-- what it listed before the claim, from provider-counties.json (Dec 2025);
-- Grace's 9 match the 2026-10-27 snapshot. Grace's claim email bounced
-- (info@gracephc.com); Quincy Young replies from qyoung@gracephc.com.

BEGIN;

UPDATE public.providers SET counties_served = ARRAY['Barrow','Cherokee','Clayton','Cobb','Douglas','Forsyth','Henry','Muscogee','Walton']
WHERE slug = 'grace-pediatric-home-carehall' AND coalesce(array_length(counties_served,1),0) = 0;

UPDATE public.providers SET counties_served = ARRAY['Cherokee','Clayton','Cobb','Coweta','Fayette','Fulton','Gwinnett']
WHERE slug = 'integricare-llc-atlanta-0577' AND coalesce(array_length(counties_served,1),0) = 0;

UPDATE public.providers SET counties_served = ARRAY['Appling','Bryan','Bulloch','Burke','Effingham','Emanuel','Evans','Glynn','Johnson','Richmond','Screven','Tattnall']
WHERE slug = 'greater-living-home-care-llc-richmond-hill-6765' AND coalesce(array_length(counties_served,1),0) = 0;

UPDATE public.providers SET counties_served = ARRAY['Cobb','Coweta','DeKalb','Forsyth']
WHERE slug = 'northside-home-care' AND coalesce(array_length(counties_served,1),0) = 0;

UPDATE public.providers SET counties_served = ARRAY['Bartow','Cherokee','Clayton','Cobb','DeKalb','Douglas','Floyd','Fulton','Hall','Paulding','Polk','Union']
WHERE slug = 'tree-s-of-life-homecare-llc-ellenwood-7701' AND coalesce(array_length(counties_served,1),0) = 0;

UPDATE public.providers SET claimed_by_email = 'qyoung@gracephc.com', email = 'qyoung@gracephc.com'
WHERE slug = 'grace-pediatric-home-carehall' AND claimed_by_email = 'info@gracephc.com';

COMMIT;
