-- 011: cities for the rows 010 renamed by phone match.
-- 010 fixed the name on rows matched by phone (where the Dec 2025 and Aug 2026
-- state lists agree on who owns the phone) but left their glued city
-- ("CobbTyrone", "Lakeview LaneHiram"). This sets the state list's city.
-- Guarded on the old value, unclaimed rows only.

BEGIN;
UPDATE public.providers SET city = $v$Norcross$v$ WHERE id = '1258a995-a691-4170-ac0f-27bea273e46e' AND city = $v$Norcross$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Johns Creek$v$ WHERE id = '1cd0cc46-31b9-45a2-8550-2c5d44798a16' AND city = $v$s Creek$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Dallas$v$ WHERE id = '8cc13773-81ca-4063-82f2-2dbcde6414da' AND city = $v$Fortune WayDallas$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Sandy Springs$v$ WHERE id = '6ea83d26-3368-4deb-8f74-35316ec45f21' AND city = $v$DeKalbSandy Springs$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$South Fulton$v$ WHERE id = '5ebf3d3d-1de1-41f7-b455-45b263b820f2' AND city = $v$Sand Bar LaneSouth Fulton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Stockbridge$v$ WHERE id = 'be413183-0ff6-4315-ac14-1ab4d7927219' AND city = $v$East Church StreetMonroe$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Tyrone$v$ WHERE id = 'b25fe653-818e-4326-b9b7-c64a2586a506' AND city = $v$CobbTyrone$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Macon$v$ WHERE id = '3f81a2fc-dabc-4567-bcfd-6665afa70827' AND city = $v$Macon$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$McDonough$v$ WHERE id = '7eb6db26-289a-4019-89ce-5b515872c368' AND city = $v$McDonough$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Fayetteville$v$ WHERE id = '85e2722b-d575-4fe0-af76-5e7fa45929b6' AND city = $v$FAYETTEVILLE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = '0c38f6cd-06ff-49b4-b2d5-ebca4ca4993a' AND city = $v$FultonAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Hiram$v$ WHERE id = '5523a8ff-a925-439e-9b2a-ab7308656ec7' AND city = $v$Lakeview LaneHiram$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Acworth$v$ WHERE id = 'b8a3318b-578b-4638-8bb4-54555cd5f2c0' AND city = $v$Day Lily WayGwinnettAcworth$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Douglasville$v$ WHERE id = 'c977dc1e-78a5-4835-ad20-9624386dfc75' AND city = $v$Suite DDouglasville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Lithonia$v$ WHERE id = '58bb25e3-9f61-4f03-aed7-baa04909c30a' AND city = $v$WaltonLithonia$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = '93a03b43-f66f-4dcd-b347-c1ae1fc45b44' AND city = $v$WaltonAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Jonesboro$v$ WHERE id = '7b670a6e-7890-4f82-94b8-d5e61327a8d0' AND city = $v$Jonesboro$v$ AND NOT coalesce(is_claimed, false);

COMMIT;

SELECT name, city FROM public.providers WHERE id IN ('1258a995-a691-4170-ac0f-27bea273e46e', '1cd0cc46-31b9-45a2-8550-2c5d44798a16', '8cc13773-81ca-4063-82f2-2dbcde6414da', '6ea83d26-3368-4deb-8f74-35316ec45f21', '5ebf3d3d-1de1-41f7-b455-45b263b820f2', 'be413183-0ff6-4315-ac14-1ab4d7927219', 'b25fe653-818e-4326-b9b7-c64a2586a506', '3f81a2fc-dabc-4567-bcfd-6665afa70827', '7eb6db26-289a-4019-89ce-5b515872c368', '85e2722b-d575-4fe0-af76-5e7fa45929b6', '0c38f6cd-06ff-49b4-b2d5-ebca4ca4993a', '5523a8ff-a925-439e-9b2a-ab7308656ec7', 'b8a3318b-578b-4638-8bb4-54555cd5f2c0', 'c977dc1e-78a5-4835-ad20-9624386dfc75', '58bb25e3-9f61-4f03-aed7-baa04909c30a', '93a03b43-f66f-4dcd-b347-c1ae1fc45b44', '7b670a6e-7890-4f82-94b8-d5e61327a8d0') ORDER BY name;
