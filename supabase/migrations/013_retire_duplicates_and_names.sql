-- 013: retire duplicate listings, forward their URLs, and show trading
-- names instead of ALL-CAPS legal names. Approved by the operator 2026-10-12.
--
-- The directory was loaded twice in Dec 2025 (Dec 15: legal names in capitals;
-- Dec 22: the state GAPP list), so many agencies are listed twice. A pair is
-- retired only when the names match (after dropping LLC/INC and a glued
-- county) AND they share a city, phone or street number; names less than 80%
-- alike need a shared phone or street. Chains with offices in different
-- cities (Aveanna, Maxim Augusta) are NOT merged. Kept: claimed > verified >
-- has callbacks > on the Aug 2026 state list > clean name. No claimed or
-- verified listing and no listing with a family callback is retired.
-- Retired rows stay in the table (is_active = false); their URL forwards to
-- the kept listing via provider_slug_redirects. Blank website/email/address
-- on the kept row is filled from the retired copy.
-- Also: Strength In Care gets its own phone (NPI registry + state list; the
-- listing carried Charin Health Services' number), and unclaimed listings
-- named in ALL-CAPS legal form take their name from the Aug 2026 state list.

BEGIN;

CREATE TABLE IF NOT EXISTS public.provider_slug_redirects (
  old_slug   text PRIMARY KEY,
  new_slug   text NOT NULL,
  reason     text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.provider_slug_redirects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reads slug redirects" ON public.provider_slug_redirects;
CREATE POLICY "Public reads slug redirects" ON public.provider_slug_redirects
  FOR SELECT TO anon, authenticated USING (true);
REVOKE ALL ON public.provider_slug_redirects FROM anon, authenticated;
GRANT SELECT ON public.provider_slug_redirects TO anon, authenticated;

-- forward each retired URL to the kept listing
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$klas-expertsbutts$v$, $v$1st-klas-experts-llc-mcdonough-5866$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$a-good-life-home-care-agency-llc-duluth-7155$v$, $v$a-good-life-home-carehenry$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$a-home-for-caredouglas$v$, $v$a-home-for-care-inc-buford-7448$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$a-lifetime-of-hopecoweta$v$, $v$a-lifetime-of-hope-newnan-6532$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$upsona-supreme-nursing-and-homecarecobb$v$, $v$a-supreme-nursing-and-homecare-atlanta-2700$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$aajo-healthcare-llc-roswell-9476$v$, $v$aajo-healthcarecobb$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$abba-health-services-llc-marietta-8940$v$, $v$forsythabba-health-servicescoweta$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$above-healthcare-servicesmonroe$v$, $v$above-healthcare-services-llc-atlanta-9531$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$agape-home-care-services-llc-hampton-5481$v$, $v$agape-home-care-services-cobb$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$ageless-homecare-servicesfulton$v$, $v$ageless-homecare-services-inc-johns-creek-6397$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$alpha-comfort-caregwinnett$v$, $v$alpha-comfort-care-inc-sandy-springs-9372$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$alpha-omega-staffingbarrow$v$, $v$alpha-omega-staffing-llc-lawrenceville-4562$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$amenity-nursing-care-and-companion-services-llc-loganville-7822$v$, $v$amenity-nursing-care-and-companion-svs$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$anointed-healthcare-servicesdekalb$v$, $v$anointed-healthcare-services-limited-co-decatur-0360$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$beau-caredouglas$v$, $v$beau-care$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$best-careliberty$v$, $v$best-care-inc-hinesville-6505$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$buttsaxess-health-solutionscherokee$v$, $v$axess-health-solutions-llc-tucker-0767$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$care-the-wright-waydekalb$v$, $v$care-the-wright-way-decatur-sgme$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$comfort-care-experts-inc-atlanta-6925$v$, $v$comfort-care-experts$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$commonwealth-private-care-llc-marietta-1395$v$, $v$commonwealth-private-care$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$constant-healthcare-llc-mcdonough-1792$v$, $v$constant-healthcaredekalb$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$creating-magical-memories-llc-atlanta-7473$v$, $v$creating-magical-memorieshenry$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$custom-living-carefulton$v$, $v$custom-living-care-llc-atlanta-4535$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$dantily-homecarecobb$v$, $v$dantily-homecare-llc-powder-springs-ah4j$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$dedicated-kare-llc-marietta-8623$v$, $v$dedicated-karegwinnett$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$divine-home-nursingforsyth$v$, $v$divine-home-nursing-llc-cumming-5318$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$domi-healthcare-services-llc-mcdonough-3770$v$, $v$domi-healthcare-services$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$easy-homesolversgwinnett$v$, $v$easy-homesolvers-llc-grayson-1290$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$edlyn-healthcare-services-inc-lawrenceville-6764$v$, $v$edlyn-healthcare-services$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$efficient-healthcare-servicesnewton$v$, $v$efficient-healthcare-services-llc$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$maconemerald-healthcare-systemfayette$v$, $v$emerald-healthcare-system-inc-fayetteville-4343$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$enhanced-family-carespalding$v$, $v$enhanced-family-care-l-l-c-mcdonough-3203$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$entegrity-homecare-solution-inc-jonesboro-7121$v$, $v$pikeentegrity-homecare-solutionsbaldwin$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$health-care$v$, $v$evergreen-health-carecobb$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$faith-home-care-llc-grovetown-5983$v$, $v$jenkinsfaith-home-carejefferson$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$family-choice-healthcare-llc-milton-1159$v$, $v$family-choice-healthcare$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$gilma-compassion-llc-stone-mountain-5758$v$, $v$gilma-compassion$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$grace-pediatric-home-care-llc-johns-creek-5414$v$, $v$grace-pediatric-home-carehall$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$greater-living-home-carechatham$v$, $v$greater-living-home-care-llc-richmond-hill-6765$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$guardian-angels-home-care-llc-alpharetta-8043$v$, $v$guardian-angels-home-care-llc$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$habershamaffinity-pediatricsbutts$v$, $v$affinity-pediatrics-llc-mcdonough-5976$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$hc-roots-llc-atlanta-1839$v$, $v$hc-rootsfulton$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$health-source-agencybibb$v$, $v$health-source-agency-inc-stockbridge-2874$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$heartfelt-comfort-care-llc-atlanta-9826$v$, $v$heartfelt-comfort-carefulton$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$hope-private-in-home-carecherokee$v$, $v$hope-private-in-home-care-snellville-9090$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$integricaredekalb$v$, $v$integricare-llc-atlanta-0577$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$jas-links-healthcare-services-inc-duluth-8728$v$, $v$jas-links-healthcarebanks$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$jc-caring-services-llc-atlanta-7139$v$, $v$j-c-caring-servicesfayette$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$l-amour-home-care-llc-lithonia-9563$v$, $v$amour-home-caredouglas$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$la-paz-homecare-llc-douglasville-3886$v$, $v$lapaz-homecaregwinnett$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$lillie$v$, $v$lillie-s-helpers-llc-macon-2911$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$m-and-a-home-care-llc-jonesboro-8956$v$, $v$m-and-a-home-care$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$maskan-llc-lawrenceville-5487$v$, $v$maskan$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$maxim-healthcare-services$v$, $v$maxim-healthcare-services-inc-savannah-5670$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$maxim-healthcare-servicesdade$v$, $v$maxim-healthcare-services-inc-savannah-5670$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$meridian-medihealth-llc-atlanta-8541$v$, $v$meridian-medihealth$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$myland-homecarebutts$v$, $v$myland-homecare-llc-mcdonough-8715$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$nicely-health-services$v$, $v$nicely-health-services-llc-dacula-0292$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$nobility-home-care-services-llc-ellenwood-3545$v$, $v$nobility-home-care-servicesdouglas$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$whitfieldnoble-grace-home-carefulton$v$, $v$noble-grace-home-care-llc-palmetto-5392$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$olive-home-care-services-inc-riverdale-6009$v$, $v$jacksonolive-home-care-servicescherokee$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$omni-home-carehenry$v$, $v$omni-home-care-llc-fayetteville-9699$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$our-best-healthcare-servicesdekalb$v$, $v$our-best-healthcare-services-llc-hoschton-6648$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$peace-of-mind-private-care-llc-atlanta-1925$v$, $v$peace-of-mind-private-care$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$peachtree-family-services-llc-atlanta-6233$v$, $v$peachtree-family-services-cobb$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$pediatric-services-of-america-llc-cartersville-8399$v$, $v$pediatric-services-of-america-inc-cartersville-8399$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$precision-care-solutions-llc-atlanta-6702$v$, $v$precision-care-solutionsfulton$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$presidential-home-carecherokee$v$, $v$presidential-home-care-llc-alpharetta-1404$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$prestige-health-partners-llc-loganville-4799$v$, $v$prestige-health-partnersdouglas$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$professional-and-quality-home-carefulton$v$, $v$professional-and-quality-home-care-llc-lawrenceville-2507$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$proud-life-home-caredekalb$v$, $v$proud-life-home-care-hampton-4068$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$pure-ivy-health-care-inc-lilburn-7667$v$, $v$pure-ivy-health-caregwinnett$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$quality-care-love-llc-powder-springs-7424$v$, $v$quality-care-and-lovecobb$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$quality-care-inhome-care-servicesnewton$v$, $v$quality-care-inhome-care-services-llc-atlanta-3740$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$rayrac-healthcareservices-douglasville-4323$v$, $v$rayrac-healthcarefulton$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$restorative-custom-healthcareforsyth$v$, $v$restorative-custom-healthcare-services-inc$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$ridgewood-personal-care-home-inc-marietta-2800$v$, $v$ridgewood-personal-care-home$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$rosemond-health-alliesgwinnett$v$, $v$rosemond-health-allies-llc-decatur-7716$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$salvation-services-lllp-atlanta-7814$v$, $v$muscogeesalvation-servicesclayton$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$sanzie-healthcare-servicesbanks$v$, $v$sanzie-healthcare-services-inc-fayetteville-3632$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$shinesun-provider-placement-services-llc-atlanta-6608$v$, $v$shinesun-provider-placement-servicescherokee$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$tender-touch-healthcare-llc-marietta-3654$v$, $v$trouptender-touch-healthcarecobb$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$tmc-care-servicescarroll$v$, $v$tmc-care-services-llc-atlanta-3694$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$trees-of-life-homecarefayette$v$, $v$tree-s-of-life-homecare-llc-ellenwood-7701$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$truevoice-homecare-inc-dallas-2534$v$, $v$true-voice-homecaregwinnett$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$ubuntu-caring-hands-llc-atlanta-0623$v$, $v$ubuntu-caring-hands$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$unite-healthcare-servicesfulton$v$, $v$unite-healthcare-services-llc-atlanta-3499$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$universal-healthcarecherokee$v$, $v$universal-healthcare-llc-atlanta-0403$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$upsona-premium-healthcare-solutionbibb$v$, $v$apremium-healthcare-solution-llc-macon-9576$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$virtue-care-services-mcdonough-1607$v$, $v$virtue-care-servicesfayette$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$welive-healthcare-services-llc-stone-mountain-1291$v$, $v$welive-healthcare-servicesfulton$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$your-village-healthcarejohnson$v$, $v$your-village-healthcare-services-llc-stapleton-6870$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;
INSERT INTO public.provider_slug_redirects (old_slug, new_slug, reason) VALUES ($v$your-way-your-voice-llc-snellville-1221$v$, $v$your-way-your-voice$v$, 'duplicate listing 2026-10-12') ON CONFLICT (old_slug) DO NOTHING;

-- fill blanks on the kept listing from the retired copy
UPDATE public.providers SET address = $v$2370 MAIN STREET, NW, UNIT 2409, DULUTH, GA 30096-2870$v$ WHERE id = 'e3d93c45-7fc5-4776-8beb-c0126c366ca4' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$3602 SUMMIT OAKS DRIVE, ROSWELL, GA 30075-5283$v$ WHERE id = '1660c381-43bd-4a21-b355-6078d66cc76d' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$1363 VALMONT TRACE NE, MARIETTA, GA 30066-7815$v$ WHERE id = 'fd4a1188-f161-4f0c-b7e4-c01eb0bc6d66' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$390 WINDPHER RIDGE, HAMPTON, GA 30228-5592$v$ WHERE id = '4f7edd50-8c0f-4be9-8887-aaee14ee907d' AND (address IS NULL OR address = '');
UPDATE public.providers SET website = $v$https://www.amenitynursingcare.com$v$ WHERE id = '34ed7661-c7ef-4bbe-b8a5-e951381ab9c1' AND (website IS NULL OR website = '');
UPDATE public.providers SET address = $v$4605 CHESTNUT OAK ST, LOGANVILLE, GA 30052-9408$v$ WHERE id = '34ed7661-c7ef-4bbe-b8a5-e951381ab9c1' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$1577 PINEBREEZE DRIVE, MARIETTA, GA 30062-2158$v$ WHERE id = '5e110963-936c-4114-b12a-e0cfc1ea78bb' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$689 BLUE ASH COURT, MCDONOUGH, GA 30253-3019$v$ WHERE id = 'a3be7579-d8bb-46ec-93cc-056e96d17823' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$56 PERIMETER CENTER E, SUITE 150, ATLANTA, GA 30346-2210$v$ WHERE id = '025c2bec-6592-41d7-8504-89793a8e40a6' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$1622 WOOD HOLLOW COURT, MARIETTA, GA 30067-8480$v$ WHERE id = 'a7d6c45f-cdeb-43b0-a22c-a5269d04dbe9' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$903 PAVILION COURT, SUITE K, MCDONOUGH, GA 30253-5224$v$ WHERE id = '5d91362d-8e25-4aa7-b453-034fd6ee95b4' AND (address IS NULL OR address = '');
UPDATE public.providers SET website = $v$https://www.edlynhealthcare.com$v$ WHERE id = 'f4ee639f-f638-45e6-a291-fcf974d0fd8c' AND (website IS NULL OR website = '');
UPDATE public.providers SET website = $v$https://www.entegrityhs.com$v$ WHERE id = '7b670a6e-7890-4f82-94b8-d5e61327a8d0' AND (website IS NULL OR website = '');
UPDATE public.providers SET address = $v$534 FLINT TRAIL, SUITE A, JONESBORO, GA 30236-1316$v$ WHERE id = '7b670a6e-7890-4f82-94b8-d5e61327a8d0' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$7147 Mount Zion Circle, Apt. 1203Morrow, Georgia 30260$v$ WHERE id = '29ba8c85-291c-4ad1-8023-e51374f6d8b5' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$1013 JARROW PLACE, GROVETOWN, GA 30813-2234$v$ WHERE id = 'e68c3ec9-2abc-472b-b670-597033847a98' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$510 TULLAMORE WAY, MILTON, GA 30004-2643$v$ WHERE id = '1c6bdfbf-e025-42b4-bd1f-88ddfa7568aa' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$725 SAN MIGUEL DRIVE, STONE MOUNTAIN, GA 30083-3830$v$ WHERE id = 'cdb4f914-c9a4-4cd1-92ea-9862e1ee4d35' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$6470 E JOHNS CROSSING, SUITE 160, JOHNS CREEK, GA 30097-1500$v$ WHERE id = '0c9ab173-c67f-4b74-82b9-83c1314b91b9' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$191 PEACHTREE STREET, SUITE 1401, ATLANTA, GA 30303-1740$v$ WHERE id = 'a4dc7944-95b0-4530-ba5a-511b5f696e38' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$1372 PEACHTREE STREET, SUITE 16, ATLANTA, GA 30309-3203$v$ WHERE id = 'a9c749db-48e9-4fd9-85da-b8871a4f389a' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$2282 MEADOW CHURCH ROAD, SUITE 400, DULUTH, GA 30097-5318$v$ WHERE id = '8e47cc63-26f6-41f6-bdef-43297877d4a0' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$5373 ASHLEY COURT, ATLANTA, GA 30338-7001$v$ WHERE id = 'dcc2ea91-9204-42d0-b1b3-64eb6ca871fb' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$6434 GINA AGHA CIR, LITHONIA, GA 30038-6501$v$ WHERE id = 'e990a9e6-92af-4b9e-8f8d-c6e3f7147f40' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$6974 SPRINGWOOD DRIVE, DOUGLASVILLE, GA 30135-1543$v$ WHERE id = '50852a68-f954-4433-aa73-3fcf847c0c93' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$127 JONESBORO ROAD, JONESBORO, GA 30236-2468$v$ WHERE id = 'a6dfa029-9bed-4329-a7b5-44004c66b5a8' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$3491 TIOGA LAKE COVE, LAWRENCEVILLE, GA 30044-3480$v$ WHERE id = '958071f2-8a89-48bc-857c-d9e7835c46c6' AND (address IS NULL OR address = '');
UPDATE public.providers SET website = $v$https://www.meridianmedihealth.org$v$ WHERE id = 'a8da1af2-4066-4b12-a7ba-54224334ed42' AND (website IS NULL OR website = '');
UPDATE public.providers SET address = $v$4421 MORTONS WAY, ELLENWOOD, GA 30294-6635$v$ WHERE id = '1e28d5b7-184a-4ca4-a005-2fdc26af1a1d' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$808 COMMERCE BLVD, SUITE E, RIVERDALE, GA 30296-7192$v$ WHERE id = '5dfc8f62-a5b5-4cbd-9934-dafafc3292ae' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$3590 CARRIAGE WAY, ATLANTA, GA 30344-6049$v$ WHERE id = '63ba0118-c633-41f2-9144-07fd59bb5006' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$828 RALPH MCGILL BLVD, #112, ATLANTA, GA 30306-4343$v$ WHERE id = 'ac344649-86bf-4806-80d2-6b8c06ee80e2' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$711 AUTUMN MEADOW DRIVE, LOGANVILLE, GA 30052-7934$v$ WHERE id = 'bc10858d-8349-4e0b-b9d6-9a675c31b6b1' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$1119 WESTGATE DRIVE, LILBURN, GA 30047-3272$v$ WHERE id = '0186bf0b-999d-4a7e-8aab-bc392871acaa' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$260 WINTER PARK LANE, POWDER SPRINGS, GA 30127-4133$v$ WHERE id = '4437de9c-288e-486e-bf5a-fd7503a4f5b8' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$8331-D OFFICE PARK DRIVE, DOUGLASVILLE, GA 30134-6937$v$ WHERE id = '969add7c-2d35-4bde-adc3-ad92d53a0c49' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$2248 CREEL ROAD, ATLANTA, GA 30349-4819$v$ WHERE id = '44ebd79f-b8e4-4e5c-96a4-2a1ff7b7058e' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$260 PEACHTREE STREET NW SUITE 2200, ATLANTA, GA 30303-1292$v$ WHERE id = 'efd879bb-8a2b-4809-aced-57ff62145925' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$55 ATLANTA ST SE, STE 104, MARIETTA, GA 30060-1977$v$ WHERE id = '68a0c9ef-2f66-4f60-b87c-334aa78a7d42' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$500 HERITAGE CLUB CIRCLE, DALLAS, GA 30132-7547$v$ WHERE id = '3c6c7842-0e5d-4666-8b31-e2821916558e' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$155 WESTRIDGE PKWY, SUITE 203, MCDONOUGH, GA 30253-3051$v$ WHERE id = '5a9888d4-a990-40c8-97f5-338fa4764881' AND (address IS NULL OR address = '');
UPDATE public.providers SET address = $v$4606 EBERLINE COURT, STONE MOUNTAIN, GA 30083-4331$v$ WHERE id = '24871650-e49f-4ff3-8db2-05d8df4e9007' AND (address IS NULL OR address = '');
UPDATE public.providers SET website = $v$https://www.yourwayyourvoicehomecare.com$v$ WHERE id = 'e4134739-0edc-4c8f-b198-d20a5da7f6d7' AND (website IS NULL OR website = '');

-- retire the duplicates (never a claimed or verified listing)
UPDATE public.providers SET is_active = false WHERE id = 'dac9b79e-b109-429b-8535-d5ea0c999097' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '368593e1-1562-4e6f-bae5-a9c7d611c278' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'f0b88c06-2e6d-4e73-9aeb-77fb4eec4f5e' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '117428a1-d485-4068-8185-c4469dadb53f' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '656f47c4-3232-4660-ae23-e56ab30d8575' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '375b4af1-7b76-427b-92c7-03481f670553' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '594b3efd-3f42-422c-abb8-427c32ac4d89' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'ad9b690c-716e-4e8d-a3fb-db4a0e0c83b9' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '2bed090b-9271-4eae-93f7-faa5f52cfda6' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '4921acd3-2686-41fc-b04f-7aedbe0bbdaf' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '6650d28d-127a-4ee3-b1ac-4b01d2924d8e' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'bcd1dd0f-0de3-45e7-98f3-09a7307710a5' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '039f2b74-c0cb-439f-941f-d82be45964a4' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '0f524537-6375-4b59-8ee7-7a7239f7471c' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'ada23afd-23b6-4952-83ea-57a0090a0728' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '76df9f86-499f-45a8-910d-00f6a2069bed' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '298ba23d-e77f-49b3-9900-6293c8b8180a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'fa904446-9b7d-449e-bdb9-7ea9601cb0e3' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'b578d22f-7441-434c-af11-2c4399c575f1' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'b956a917-e171-4498-a120-9a64d0fa76d6' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '84531fcb-ff65-48c0-af71-70ed9282d86d' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '4e71b43a-d7b5-42cb-844f-ef78f26e4206' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'b71f359f-6b21-48dd-833f-4f9d7ad1a7bf' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'd8d803ab-425a-46d1-b61c-baea86dc6720' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '5684102a-c465-4954-8e77-c1f0ec0271a7' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '3966ce14-d687-4491-aab6-264830689c95' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '1a5aa8c8-acdf-41f6-8563-8145d45d37db' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '0de389f3-3c46-49ae-9a3b-3da4cc01c245' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'f79f3bd8-2ae9-4e05-8821-f5eb2bc2e51d' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'fa7d33ce-fcc1-42df-8239-564c372ebe0d' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'a71390cb-802d-4ea5-9145-e8ea2656c2ae' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '5e042929-05e9-4043-92be-3910fe5b8492' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'a5e37dc6-1d18-4756-87be-2417b0107611' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '456ce0ff-9019-4a22-a676-65e5aa46d98a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '9974762a-ec4c-4c8b-8d2d-091a6bceacae' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'ca3f7525-de53-4122-a587-d1882ec1bbc8' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'b74a5624-928f-46d3-819c-fe841054ae77' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'b670a11b-d37b-42d9-8500-040cff25678a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '0a66ab89-b1a6-488d-9b63-22bf3409e3d5' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'f97fcba0-2e9a-4e9a-9cdd-07726b74a45a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '881d3167-29ed-4119-9294-754beaeaf196' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'ae5a6737-71a7-414c-858e-c6a84d209dd4' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '81e232e6-eb27-4b36-ac8a-58476d907780' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'bd48bb50-d55b-48a9-acd0-77a989b71b93' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'e65e5257-607c-492a-b73c-512a33afcecd' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '539c73c8-dc5d-41fc-873e-dd8ee167b263' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '8846c928-629d-4510-9194-aa379f19e58e' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '801a1a6f-9474-46f2-b8ab-51ebb184b814' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'b1c8072e-e7e5-40ca-9404-8f39d3853637' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '785e7577-b97b-47df-ac53-957648e9490a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'e6b2b462-ec0e-4539-9f6f-493df783fcf5' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'a1ef4590-b9f0-4851-bb86-087ba51dd468' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'de194c50-47a8-4567-937b-08ef821afc11' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'ce2df073-5adf-4956-8695-18eb1fcd784d' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '8488e3fa-c9a6-4f90-bdd2-2842fc5d3d20' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '1e6c9bf3-0ee8-46ec-9ff1-3dfbe60e13db' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '7e8b4087-725f-412e-a831-c435258b6f76' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '22aba598-0c57-472b-bf0c-a53770a3ecdb' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '2e645c28-ca96-4522-9a96-ec8ea8f7ca9c' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'd909f783-0653-47f7-8467-e12630bdee36' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '9130e922-1de2-4da3-b69a-31e1a0805938' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'dcd823dd-3700-43d8-b882-ada732886ed1' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '2a0a4917-02b1-4942-8898-0360f1bf71c5' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '5902eba1-0927-4c38-9f26-1f8f7043254e' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'd671b6e9-eaae-4801-b2bc-db3f8df03881' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'd38ea6de-b7ed-4ed4-8f81-67731a8f9326' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '843f6fb0-d581-4a50-80d3-eb18a7497f30' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '7244bf47-5055-4bdb-b6f3-44a3e9902004' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '7fe0be56-4e0c-4a9f-b3e4-9c31f7251b85' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '30025b2c-badb-41c5-bee8-8f79a073f217' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'bea62605-490c-46be-82d2-08a41999dc2a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '9b5442f8-e0e8-40f3-9442-2e80570d34af' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '548165ae-33bc-4bea-ba39-754adbe6bc8a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '7a8b251a-576c-4788-b201-d00cd4af17b3' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'bcabb735-1174-4d49-9fb8-bcba0e98de48' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'de79965a-f854-4383-ba94-082657ad8722' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'd4434329-7248-4bdb-80d5-de3d2fba2275' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '996dbd4d-61ec-4554-a45d-c0dfb7153eaa' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '69b055fa-71bf-4473-b685-3e62320a3f83' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '698cc246-99b3-49ba-9c0e-c01080daf912' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'dde5818d-434c-48de-bcd4-0c19dc5844cf' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'a92ddef1-30e8-46a5-a10c-9de2893da6d5' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '8e976198-b103-4035-9664-9ba51b33c5be' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'fbb421cc-2ee8-4a15-adc3-dc536b9386a1' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'b980853c-3882-4d38-9345-124cb73d469a' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '083c73f8-70fa-4bd0-88e7-00c9e2804137' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '28a7356e-b7d5-46e6-a732-bae7342065b6' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '39ff3398-1c01-44f7-9e06-790286620f6d' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '0f4ff5b3-6966-42de-85df-14ac9699ae9c' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'a56d7090-68ce-4d8d-b069-9c58ed6f4d9b' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '3d23c3d0-156d-455e-b762-3c89a4ef11bb' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = 'dce6e9c8-1d1d-4907-8b55-f3c8f751adc3' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);
UPDATE public.providers SET is_active = false WHERE id = '69fa7712-255e-45ab-8b1e-4bb23bf94221' AND is_active AND NOT coalesce(is_claimed, false) AND NOT coalesce(is_verified, false);

-- Strength In Care: its own number (NPI registry, Strength In Care LLC, McDonough)
UPDATE public.providers SET name = 'Strength In Care', phone = '(404) 585-1515'
 WHERE slug = 'waltonstrength-in-care' AND name = 'WaltonStrength In Care'
   AND phone = '(770) 353-9986' AND NOT coalesce(is_claimed, false);

-- ALL-CAPS legal names -> the state list's trading name (unclaimed, matched by name)
UPDATE public.providers SET name = $v$Reaching Clarity$v$ WHERE id = 'ae7f0fda-f8ac-4254-82a8-1721fe55b713' AND name = $v$REACHING CLARITY, INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Maxim Healthcare Services$v$ WHERE id = '9f30c02b-529e-48e4-9d56-8982dd109259' AND name = $v$MAXIM HEALTHCARE SERVICES, INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$World of Love$v$ WHERE id = 'd084868b-1d77-4888-801e-c7dc9652a52e' AND name = $v$WORLD OF LOVE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Angels Touch Loving Care$v$ WHERE id = '3f66cf8b-1070-4381-9443-48f05e774b84' AND name = $v$ANGEL'S TOUCH LOVING CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Supreme Nursing and Homecare$v$ WHERE id = '0f6f0d00-0aff-48b4-8655-838e6962c32c' AND name = $v$A SUPREME NURSING AND HOMECARE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Anointed Healthcare Services$v$ WHERE id = '6038228d-942b-4ff1-b0be-4304963715e5' AND name = $v$ANOINTED HEALTHCARE SERVICES LIMITED CO$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Onewell Health of Georgia$v$ WHERE id = 'b6ca9554-6e93-40fa-befd-a76249400fdb' AND name = $v$ONEWELL HEALTH OF GEORGIA, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Lifetime of Hope$v$ WHERE id = 'a85cd99f-e9f5-4a90-88d7-539d1a40572b' AND name = $v$A LIFETIME OF HOPE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$SRA Helper Hands$v$ WHERE id = '0f3768f5-066c-4787-a548-2a05c611abbf' AND name = $v$SRA HELPER HANDS, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Diamond Touch Home Care$v$ WHERE id = '1f0f4cbb-d3eb-4ead-9bd0-36e97e897f2f' AND name = $v$DIAMOND TOUCH HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Adiel Healthcare Services$v$ WHERE id = '0ef620b7-cc2e-478c-8664-483186677141' AND name = $v$ADIEL HEALTHCARE SERVICES INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Your Way Staffing$v$ WHERE id = 'c2121ee1-35be-44ca-a55b-71e5365932ce' AND name = $v$YOUR WAY STAFFING LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$IDM Care$v$ WHERE id = 'b4cb40aa-72f5-4a79-a16c-69dac759090f' AND name = $v$IDM CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Betterlife Health Services$v$ WHERE id = '9b15ec5c-74f4-4c85-95ad-691a5b5cc3e0' AND name = $v$BETTERLIFE HEALTH SERVICES, INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Hope Sky$v$ WHERE id = '18eb3c41-9407-4086-8196-52f749f1c6f6' AND name = $v$HOPE SKY LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Noble Grace Home Care$v$ WHERE id = '7fd22e20-7659-461d-9a4a-e69afd41e680' AND name = $v$NOBLE GRACE HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$AKJ Pillars of Support$v$ WHERE id = '59a1e196-9bbb-4116-8410-8baa97cfb24f' AND name = $v$AKJ PILLARS OF SUPPORT LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Brightstars Home Care of Georgia$v$ WHERE id = 'abaa6e48-d2f1-44f5-86b2-fdd9d33a2ffb' AND name = $v$BRIGHTSTARS HOME CARE OF GEORGIA LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Royal Faith Homecare Agency$v$ WHERE id = '312fb350-ba77-4fdb-bd90-8c765c2e0e6e' AND name = $v$ROYAL FAITH HOMECARE AGENCY LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Noble Star Health$v$ WHERE id = 'd320fd62-1b3f-4296-ba4a-98ba7ed6cb5c' AND name = $v$NOBLE STAR HEALTH, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Nathan Home Care and Nursing$v$ WHERE id = '0d62c83c-cc6c-45e5-bab1-de627e1d3445' AND name = $v$NATHAN HOME CARE AND NURSING AGENCY LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$True Care Staffing$v$ WHERE id = 'bf630dcd-bd02-4aa2-b4d1-9d6e268c6760' AND name = $v$TRUE CARE STAFFING LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Holigenix Healthcare$v$ WHERE id = 'ca555f27-6f42-40d5-8293-503faf88d7f7' AND name = $v$HOLIGENIX HEALTHCARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Americare Services$v$ WHERE id = '67877919-6224-46d6-bea5-137947af5e79' AND name = $v$AMERICARE SERVICES INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Uplift Home Solutions$v$ WHERE id = 'f816be75-6ab4-4fa7-a771-7c61b010f819' AND name = $v$UPLIFT HOME SOLUTIONS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Emic Healthcare$v$ WHERE id = 'eb9e3d90-76b8-4593-bdaa-74cecb1bbfb6' AND name = $v$EMIC HEALTHCARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Horizon Care Partners$v$ WHERE id = '3cf78ce5-1f49-47cd-86f2-8ce9963d4a9b' AND name = $v$HORIZON CARE PARTNERS$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Unity Health Care$v$ WHERE id = 'd52b93e2-a651-4082-969d-6bd54d4fd3c8' AND name = $v$UNITY HEALTH CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$At My Place, My Home$v$ WHERE id = '2652199d-ac70-4986-95bd-57dea607e455' AND name = $v$AT MY PLACE, MY HOME LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Mending Homes Care Services$v$ WHERE id = 'c105c768-fe83-42f7-9007-e6387c283dae' AND name = $v$MENDING HOMES CARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Miryam Loving Care$v$ WHERE id = '301da2ce-02cc-49e4-8848-bf77a18b5d39' AND name = $v$MIRYAM LOVING CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Live Well Home Care$v$ WHERE id = '8e0955ef-747f-47fc-859f-8d8ffacd8cc5' AND name = $v$LIVE WELL HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Just Peachy Homecare$v$ WHERE id = 'db05ffe4-16e1-4d43-83ad-d21495ba892e' AND name = $v$JUST PEACHY HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Yaraab Home Care Services$v$ WHERE id = '322a9877-a28d-413c-b5cd-aa742c1c13ac' AND name = $v$YARAAB HOME CARE SERVICES, INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Your Village Healthcare$v$ WHERE id = 'c441d45c-ec80-474b-bb60-f6a290c97505' AND name = $v$YOUR VILLAGE HEALTHCARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Mothers Love Healthcare$v$ WHERE id = '43977a4e-c314-453e-9535-1a922a838723' AND name = $v$A MOTHERS LOVE HEALTHCARE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$STAT Homecare$v$ WHERE id = '67e74480-829d-42a4-9261-5db30cba2a77' AND name = $v$STAT HOMECARE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Gracie Homecare$v$ WHERE id = '807e8dc4-9680-4610-89da-d17c32bd83f5' AND name = $v$GRACIE HOMECARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Nicely Health Services$v$ WHERE id = 'd6e848f4-39b4-48d5-8682-060b679fbfc5' AND name = $v$NICELY HEALTH SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Chapman and Friends$v$ WHERE id = '36976365-5f47-4e63-b3c9-60ceb6b07ce8' AND name = $v$CHAPMAN & FRIENDS HEALTHCARE PROVIDERS OF GEORGIA$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$True Hope Healthcare Services$v$ WHERE id = '88979d6b-e661-4445-9249-647d2df9cdb8' AND name = $v$TRUE HOPE HEALTHCARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Alpha Comfort Care$v$ WHERE id = '61794577-10da-48c0-9459-f5e6f2a510ab' AND name = $v$ALPHA COMFORT CARE, INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Health First Home Care$v$ WHERE id = 'f9c38ddb-2e4b-49c8-aa35-d3e153d55efd' AND name = $v$HEALTH FIRST HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$IProvide Home Care Solutions$v$ WHERE id = '04a2e3ba-40cd-4cc9-8791-50ab99fe42f6' AND name = $v$IPROVIDE HOME CARE SOLUTIONS$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Capstone Quality Care$v$ WHERE id = '95ebeb8d-3554-46a8-9103-12bd67044832' AND name = $v$CAPSTONE QUALITY CARE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Mutual Care$v$ WHERE id = 'c1e3696f-f4d2-466f-a7a6-79768b81c911' AND name = $v$MUTUAL CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Fidelis Healthcare Professionals$v$ WHERE id = 'eb67af5c-93e3-4ec6-81b6-34f2032ee603' AND name = $v$FIDELIS HEALTHCARE PROFESSIONALS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Go Forth Staffing$v$ WHERE id = '86869224-965e-4595-9795-81fda3a2aaa2' AND name = $v$GO FORTH STAFFING INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Readymed Medical Solutions$v$ WHERE id = '31d6a62b-3c30-44d3-b56d-dce01a20bfeb' AND name = $v$READYMED MEDICAL SOLUTIONS INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Omni Home Care$v$ WHERE id = '8f961ac0-1617-420c-b600-5a2dcf8718c9' AND name = $v$OMNI HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$SOFA$v$ WHERE id = '531ba498-dab9-455c-be47-b080ba556142' AND name = $v$SOFA LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Bethel Private Home Care$v$ WHERE id = '6a9b1c9b-90a5-411b-8e0a-19ba2de9e083' AND name = $v$BETHEL PRIVATE HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Carestar Healthcare$v$ WHERE id = '9964a0d8-38ed-4a46-989a-cfb1dda18860' AND name = $v$CARESTAR HEALTHCARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Gail’s Homecare$v$ WHERE id = '2cd79336-aefb-4155-9eb9-187d88602727' AND name = $v$GAIL'S HOMECARE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Unite Healthcare Services$v$ WHERE id = '7547e44c-b8c3-4faf-9c8d-a1a501886e9c' AND name = $v$UNITE HEALTHCARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Our Best Healthcare Services$v$ WHERE id = '9c990790-a3b6-40e7-a0f3-eaf97e1e09e3' AND name = $v$OUR BEST HEALTHCARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Better Beginnings Health Care Services$v$ WHERE id = '51944a04-27e8-499a-8836-d48d71c2f65a' AND name = $v$BETTER BEGINNINGS HEALTHCARE SERVICES, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Love and Caring Home Care$v$ WHERE id = 'de0dd7f3-2dbf-4991-9f66-b06a35f86b91' AND name = $v$LOVE AND CARING HOME CARE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Murphy Healthcare Professionals$v$ WHERE id = '7e654fc7-45d0-4633-a22a-fd07bea2ead5' AND name = $v$MURPHY HEALTHCARE PROFESSIONALS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Safe At Home Private Care$v$ WHERE id = 'b77d9fa2-1ea0-467f-a45b-0051ef0c3926' AND name = $v$SAFE AT HOME PRIVATE CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Alpha-Ohms Healthcare$v$ WHERE id = 'cc956773-82b6-4652-8666-1fb1f154b578' AND name = $v$ALPHA-OHMS HEALTHCARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Admirable Healthcare$v$ WHERE id = '0a9e342f-6245-48ff-a46a-05e3d3db9d25' AND name = $v$ADMIRABLE HEALTHCARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Dantily Homecare$v$ WHERE id = '241c77eb-14c3-48ec-a60b-55a9563d14a5' AND name = $v$DANTILY HOMECARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$PCA Elite$v$ WHERE id = '022557f5-f456-4c3e-af66-922c838f4f3f' AND name = $v$PCA ELITE, INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Triumph Private Home Care$v$ WHERE id = '679294f1-75fc-4195-8325-facdaab753eb' AND name = $v$TRIUMPH PRIVATE HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Optimum VIP Care Services$v$ WHERE id = '89bae80e-6623-4251-8a2a-19f95a8dd434' AND name = $v$OPTIMUM VIP CARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Healthy Heroes$v$ WHERE id = '8efe3c65-1eb5-4374-9db4-59f857c59ac5' AND name = $v$HEALTHY HEROES$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Express Professional Homecare$v$ WHERE id = '404014cc-4427-40af-a99b-3cae3036e130' AND name = $v$EXPRESS PROFESSIONAL HOMECARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$National Home Care$v$ WHERE id = 'c9c4287b-5170-4f05-a4c6-619371e9ba4f' AND name = $v$NATIONAL HOME CARE CORPORATION$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Trusted Care Professionals$v$ WHERE id = 'b6f920f9-d04f-498e-b904-6fa048c545bc' AND name = $v$TRUSTED CARE PROFESSIONALS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Lillie’s Helpers$v$ WHERE id = 'b56d55f5-240f-45c4-8eb9-c123e957562f' AND name = $v$LILLIE'S  HELPERS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Georgia Essential Private Care$v$ WHERE id = '69d6230e-2348-4fec-9fb1-2d4c55a23fdb' AND name = $v$GEORGIA ESSENTIAL PRIVATE CARE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$New Eden Healthcare Services$v$ WHERE id = 'faa53694-7872-4160-9785-fc92830ac91b' AND name = $v$NEW EDEN HEALTHCARE SERVICES, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Above Healthcare Services$v$ WHERE id = 'e9d6f776-3c0b-4701-9955-81e2d79665b0' AND name = $v$ABOVE HEALTHCARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Integrity First Healthcare Services$v$ WHERE id = '8332e5c5-c599-4294-8f06-cb7e80dfce16' AND name = $v$INTEGRITY FIRST HEALTHCARE SERVICES, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Complete Nursing Care$v$ WHERE id = '68b86f67-8ad0-4b68-8d66-6333f3ad851a' AND name = $v$COMPLETE NURSING CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$K Devine Cares$v$ WHERE id = 'e91a283e-411b-47c6-8774-7993066100be' AND name = $v$KDEVINE CARES$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Heritage Health Partners$v$ WHERE id = 'd158320b-d0b2-4ac0-b1dc-6245f59bf9c4' AND name = $v$HERITAGE HEALTH PARTNERS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Del Mar Healthcare$v$ WHERE id = 'e54e4443-f6a1-4682-89f9-ae6e2dda7565' AND name = $v$DEL MAR HEALTHCARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Easy Homesolvers$v$ WHERE id = '523004f9-0a98-4bff-b41a-be076e81a91b' AND name = $v$EASY HOMESOLVERS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Divine Source Healthcare Systems$v$ WHERE id = '5106e1ec-110b-4127-875b-279ef65d46be' AND name = $v$DIVINE SOURCE HEALTHCARE SYSTEMS INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Me and My Nanna$v$ WHERE id = '575ac171-3db0-47e6-8c6c-f1c936931430' AND name = $v$ME AND MY NANNA, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Sadiecare Health Services$v$ WHERE id = 'd0122e59-4133-417a-92b5-0b11bb67b6c9' AND name = $v$SADIECARE HEALTH SERVICES INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Dr. Bostic Private Home Care$v$ WHERE id = '3574722c-6f2f-4b18-b5d8-d73ddfb93033' AND name = $v$DR. BOSTIC PRIVATE HOME CARE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Home Care Promise$v$ WHERE id = '4b39b35c-65a6-4a22-a370-913b659cad1a' AND name = $v$HOME CARE PROMISE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$New Life Private Care$v$ WHERE id = '694ca92f-2c68-4fa9-adb2-fd00a98779ac' AND name = $v$NEW LIFE PRIVATE CARE$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Angels Court$v$ WHERE id = '618df1fc-1037-4168-9ece-c0bed4a44e77' AND name = $v$ANGELS COURT LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Myland Homecare$v$ WHERE id = 'd22bf085-5dd4-4d5f-a7e5-16fd104729a8' AND name = $v$MYLAND HOMECARE, LLC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Caring Hands Homecare$v$ WHERE id = 'dd4e8497-f663-4033-9703-129361bfbca1' AND name = $v$CARING HANDS HOMECARE AND NURSING SERVICES$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Affinity Pediatrics$v$ WHERE id = 'b8bd1fb9-a3d8-4a1b-9a38-a7e87c427667' AND name = $v$AFFINITY PEDIATRICS, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Integricare$v$ WHERE id = '2c6f5055-4760-4695-88cd-61f865fcae55' AND name = $v$INTEGRICARE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Lexx Homecare$v$ WHERE id = '7c5d69b0-9ba7-435c-8308-64dad365a4a4' AND name = $v$LEXX HOMECARE AGENCY, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Quantum Grace Solutions$v$ WHERE id = '6a88a09f-e168-41b7-9dbf-b0be4cfbf0ce' AND name = $v$QUANTUM GRACE SOLUTIONS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Professional and Quality Home Care$v$ WHERE id = '8046001f-bc3e-4818-9e85-f58ae5cf352f' AND name = $v$PROFESSIONAL AND QUALITY HOME CARE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$EKAA Care & Support$v$ WHERE id = '3dbc73bc-fd63-4f7d-9142-50b390f4f5d9' AND name = $v$EKAA CARE AND SUPPORT PROVIDER$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Lillie’s Healthcare$v$ WHERE id = '92bc9ffb-d875-444c-8ba9-8f193a02168f' AND name = $v$LILLIE'S HEALTHCARE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Epiphany Healthcare System$v$ WHERE id = '24731790-ef36-48a0-81fa-3aa9d0b83074' AND name = $v$EPIPHANY HEALTHCARE SYSTEM, INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Providence Healthcare of Georgia$v$ WHERE id = '394de6e2-d6d3-4e70-b3ae-a3e5ae25f4b4' AND name = $v$PROVIDENCE HEALTHCARE OF GEORGIA, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$ARAA Home Care$v$ WHERE id = '7f13e731-525e-489f-8fbd-229ceedacc64' AND name = $v$ARAA HOME CARE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Glory Healthcare$v$ WHERE id = '11638096-3e81-4bb1-82bf-3961a601bd90' AND name = $v$GLORY HEALTHCARE SERVICES, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Your Choice Caregivers$v$ WHERE id = '369bc5dd-f13a-4c90-9547-d055e10fa0d4' AND name = $v$YOUR CHOICE CAREGIVERS, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Personal Home Care of Atlanta$v$ WHERE id = '68de3c03-4e82-4fa0-ad94-c314a95d8e57' AND name = $v$PERSONAL HOME CARE OF ATLANTA, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Immaculate Healthcare Solutions$v$ WHERE id = '4033e30c-0735-4296-8fe0-ca705f55fac3' AND name = $v$IMMACULATE HEALTHCARE SOLUTIONS LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$AACE Healthcare$v$ WHERE id = '258dcc98-d0fd-4f9d-9ec1-aa096e402222' AND name = $v$AACE HEALTHCARE SERVICES$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$AXESS Health Solutions$v$ WHERE id = '465cf273-41f7-4619-862b-0183d10aa575' AND name = $v$AXESS HEALTH SOLUTIONS, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$We Care Home Care$v$ WHERE id = '8e161f3b-12aa-49b1-9e3e-8f03df048c6d' AND name = $v$WE CARE HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Viet Home Care$v$ WHERE id = '241d816d-d6c0-41c6-b9a6-36ef71ce3fff' AND name = $v$VIET HOME CARE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A New Well, Inc Home Health Care$v$ WHERE id = '60863386-31ca-43c7-a67d-8ad733bbb4d3' AND name = $v$A NEW WELL, INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Michester, Inc.$v$ WHERE id = 'b0e7073a-809e-448e-b218-6fa92e846882' AND name = $v$MICHESTER, INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Premium Healthcare Solution$v$ WHERE id = 'e493c753-cedf-49f1-a6b9-1a74293beb91' AND name = $v$APREMIUM HEALTHCARE SOLUTION LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Cater Home Health Care, Inc.$v$ WHERE id = '39a4c63f-461c-414d-95bb-8b200f26267b' AND name = $v$CATER HOME HEALTH CARE INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$ChyChy’s Healthcare$v$ WHERE id = '7a3a2e8f-357d-4c3b-8660-3623973ee38d' AND name = $v$CHYCHY'S HEALTHCARE& MEDICAL SUPPLY, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$CONCOH Healthcare$v$ WHERE id = 'e4e3e7ba-e42f-4840-9d60-534a0b5e6292' AND name = $v$CONCOH HEALTH CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Diversified Private Homecare$v$ WHERE id = '8e477b48-75af-44d7-affe-423bd05c60bf' AND name = $v$DIVERSIFIED PRIVATE HOME CARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Emerald Healthcare System$v$ WHERE id = '921e80e5-31d1-40e5-a4fb-3e30675f0d48' AND name = $v$EMERALD HEALTHCARE SYSTEM, INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Excelcare by Divinee$v$ WHERE id = '8b46cfcf-c726-45aa-b0b2-8fbe45684afc' AND name = $v$EXCELCARE BY DIVINEE, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Georgia NurseCare$v$ WHERE id = 'a0b3e7c5-28cd-4c85-8162-d42d50d121ac' AND name = $v$GEORGIA NURSECARE LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Giles Holdings International$v$ WHERE id = '18977cdf-a7bb-430b-b0c2-ff69d3bb07e9' AND name = $v$GILES HOLDINGS INTERNATIONAL, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Health Source Agency$v$ WHERE id = 'c6044329-00da-401b-ac65-f26446f1f7a4' AND name = $v$HEALTH SOURCE AGENCY, INC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Kindtouch Healthcare Service$v$ WHERE id = '6e76acfb-67b6-4f92-a6cf-824c21b2359e' AND name = $v$KINDTOUCH HEALTHCARE SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Lorddys Healthcare$v$ WHERE id = 'b8694706-e95c-4748-8909-00fd6ee49421' AND name = $v$LORDDYS HEALTHCARE SOLUTIONS, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Next Step Healthcare Services$v$ WHERE id = 'bf486349-8b50-4eb8-aa6f-2c53ee0668b3' AND name = $v$NEXT STEP HEALTHCARE SERVICES, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Omni Healthcare Services$v$ WHERE id = '5c07989b-b99a-4849-b857-d6a0d2f3bac3' AND name = $v$OMNI HEALTHCARE SERVICES, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Optimum Pediatric Services$v$ WHERE id = 'f31d681d-2738-455f-afbb-1a760c87376c' AND name = $v$OPTIMUM PEDIATRIC SERVICES LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Pediatric Care Providers$v$ WHERE id = '225f5b4b-9111-4026-aff8-f9ad29e14d30' AND name = $v$PEDIATRIC CARE PROVIDERS, LLC$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$CCENO Home Healthcare$v$ WHERE id = '243db79f-0b9b-4ec9-8320-7e90356887ff' AND name = $v$CCENO HOME HEALTHCARE SERVICES, INC.$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Complete Access Services$v$ WHERE id = 'cb2aa86d-cc48-4278-9f3c-a4b77b762b11' AND name = $v$COMPLETE ACCESS SERVICES CORPORATION$v$ AND NOT coalesce(is_claimed, false);

COMMIT;

SELECT
  (SELECT count(*) FROM public.providers WHERE is_active) AS active_listings,
  (SELECT count(*) FROM public.providers WHERE NOT is_active) AS retired_listings,
  (SELECT count(*) FROM public.provider_slug_redirects) AS redirects,
  (SELECT count(*) FROM public.provider_slug_redirects r JOIN public.providers p ON p.slug = r.new_slug AND p.is_active) AS redirects_to_live_listing,
  (SELECT count(*) FROM public.providers WHERE is_active AND name = upper(name) AND name ~ '[A-Z]{4}') AS active_all_caps_names;
