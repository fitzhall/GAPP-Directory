-- 012: strip glued counties from names and cities the
-- state list can't vouch for. After 010/011 the rows left garbled are ones the
-- Aug 2026 state list does not cover; the damage is the same import glue: a
-- county stuck onto the end (sometimes start) of the name ("Agape Family
-- HealthcareCobb") or before the city ("CobbMcDonough"). This strips it. Two
-- names set by hand from the Dec 2025 list ("1st Klas Experts", "Georgia
-- NurseCare"). Left alone: names that would collapse to a generic word
-- ("BibbHealthcareGwinnett", "StaffingNewton"), "PauldingJones Creek", and
-- every claimed listing. Guarded on the old value.

BEGIN;

UPDATE public.providers SET name = $v$A Home for Care$v$ WHERE id = 'f0b88c06-2e6d-4e73-9aeb-77fb4eec4f5e' AND name = $v$A Home for CareDouglas$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Lifetime of Hope$v$ WHERE id = '117428a1-d485-4068-8185-c4469dadb53f' AND name = $v$A Lifetime of HopeCoweta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Above Healthcare Services$v$ WHERE id = 'ad9b690c-716e-4e8d-a3fb-db4a0e0c83b9' AND name = $v$Above Healthcare ServicesMonroe$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Agape Family Healthcare$v$ WHERE id = '87393236-90ad-4b0e-8b20-c4f55b084d53' AND name = $v$Agape Family HealthcareCobb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Ageless Homecare Services$v$ WHERE id = '4921acd3-2686-41fc-b04f-7aedbe0bbdaf' AND name = $v$Ageless Homecare ServicesFulton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Alpha Comfort Care$v$ WHERE id = '6650d28d-127a-4ee3-b1ac-4b01d2924d8e' AND name = $v$Alpha Comfort CareGwinnett$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Alpha Omega Staffing$v$ WHERE id = 'bcd1dd0f-0de3-45e7-98f3-09a7307710a5' AND name = $v$Alpha Omega StaffingBarrow$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Anointed Healthcare Services$v$ WHERE id = '0f524537-6375-4b59-8ee7-7a7239f7471c' AND name = $v$Anointed Healthcare ServicesDeKalb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Beau Care$v$ WHERE id = 'ada23afd-23b6-4952-83ea-57a0090a0728' AND name = $v$Beau CareDouglas$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Best Care$v$ WHERE id = '76df9f86-499f-45a8-910d-00f6a2069bed' AND name = $v$Best CareLiberty$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Myka Health Systems$v$ WHERE id = 'c7660364-06c5-475c-b414-5081ece08870' AND name = $v$BibbMyka Health SystemsCoweta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Brighter Days Home Care$v$ WHERE id = '08d890a8-b0ed-4a78-a09b-ab95f30ca703' AND name = $v$Brighter Days Home CareCobb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$AXESS Health Solutions$v$ WHERE id = '298ba23d-e77f-49b3-9900-6293c8b8180a' AND name = $v$ButtsAXESS Health SolutionsCherokee$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$C Private Home Care$v$ WHERE id = '75801ec8-9a77-4060-b4fb-fd9dd73e31ca' AND name = $v$C Private Home CareBanks$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Care the Wright Way$v$ WHERE id = 'fa904446-9b7d-449e-bdb9-7ea9601cb0e3' AND name = $v$Care the Wright WayDeKalb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Anderson Assist Home Care$v$ WHERE id = '532810ea-db98-4dbc-9da6-2738b4b1cb9c' AND name = $v$ClarkeAnderson Assist Home CareFulton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Custom Living Care$v$ WHERE id = 'b71f359f-6b21-48dd-833f-4f9d7ad1a7bf' AND name = $v$Custom Living CareFulton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Dantily Homecare$v$ WHERE id = 'd8d803ab-425a-46d1-b61c-baea86dc6720' AND name = $v$Dantily HomecareCobb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Divine Home Nursing$v$ WHERE id = '3966ce14-d687-4491-aab6-264830689c95' AND name = $v$Divine Home NursingForsyth$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Easy Homesolvers$v$ WHERE id = '0de389f3-3c46-49ae-9a3b-3da4cc01c245' AND name = $v$Easy HomesolversGwinnett$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Efficient Healthcare Services$v$ WHERE id = 'fa7d33ce-fcc1-42df-8239-564c372ebe0d' AND name = $v$Efficient Healthcare ServicesNewton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$New Generations Health Services$v$ WHERE id = '6f0adfa9-b687-43bd-b45e-fa646ac928ca' AND name = $v$EffinghamNew Generations Health ServicesBarrow$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Enhanced Family Care$v$ WHERE id = '5e042929-05e9-4043-92be-3910fe5b8492' AND name = $v$Enhanced Family CareSpalding$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Glory Healthcare$v$ WHERE id = 'e1a78fc8-aa39-49dd-a6ef-b166c179b7cc' AND name = $v$Glory HealthcareClayton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Grace Eboh Home Care$v$ WHERE id = 'c995d82b-436d-45ed-a849-e47981997972' AND name = $v$Grace Eboh Home CareBleckley$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Greater Living Home Care$v$ WHERE id = '0a66ab89-b1a6-488d-9b63-22bf3409e3d5' AND name = $v$Greater Living Home CareChatham$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Affinity Pediatrics$v$ WHERE id = '881d3167-29ed-4119-9294-754beaeaf196' AND name = $v$HabershamAffinity PediatricsButts$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Your Choice Caregivers$v$ WHERE id = 'db678107-004e-452c-bdca-39e46efe2d15' AND name = $v$HartYour Choice CaregiversCherokee$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Health Source Agency$v$ WHERE id = '81e232e6-eb27-4b36-ac8a-58476d907780' AND name = $v$Health Source AgencyBibb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Heavenly Global Healthcare$v$ WHERE id = '25006b57-81bb-4b2c-852f-08192ba7a804' AND name = $v$Heavenly Global HealthcareCherokee$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Hope Private In Home Care$v$ WHERE id = 'e65e5257-607c-492a-b73c-512a33afcecd' AND name = $v$Hope Private In Home CareCherokee$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Integricare$v$ WHERE id = '539c73c8-dc5d-41fc-873e-dd8ee167b263' AND name = $v$IntegricareDeKalb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$1st Klas Experts$v$ WHERE id = 'dac9b79e-b109-429b-8535-d5ea0c999097' AND name = $v$Klas ExpertsButts$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Premium Healthcare Solution$v$ WHERE id = '594ae8cf-06bb-4fb2-9896-354fbe76805f' AND name = $v$LowndesA Premium Healthcare SolutionHenry$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Emerald Healthcare System$v$ WHERE id = 'a71390cb-802d-4ea5-9145-e8ea2656c2ae' AND name = $v$MaconEmerald Healthcare SystemFayette$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Manuesth Homecare Services$v$ WHERE id = '76144408-7011-4ae0-a761-72628848ed07' AND name = $v$Manuesth Homecare ServicesChatham$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Maxim Healthcare Services$v$ WHERE id = '9a9fa43f-7e69-48fc-ad24-07cb5654790b' AND name = $v$Maxim Healthcare ServicesBaldwin$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Maxim Healthcare Services$v$ WHERE id = '8488e3fa-c9a6-4f90-bdd2-2842fc5d3d20' AND name = $v$Maxim Healthcare ServicesDade$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Mir Home Care$v$ WHERE id = '39c775fd-4988-43c2-beb2-ef4a6fc50a87' AND name = $v$Mir Home CareDouglas$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Myland Homecare$v$ WHERE id = '7e8b4087-725f-412e-a831-c435258b6f76' AND name = $v$Myland HomecareButts$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Precious Angel Homecare$v$ WHERE id = '44a5bee9-b312-4019-92e2-61ba56144ff0' AND name = $v$NewtonPrecious Angel HomecarePaulding$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Georgia NurseCare$v$ WHERE id = 'b473414d-f6fa-48f8-b579-b251ed92390d' AND name = $v$NurseCareGlynn$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Omni Healthcare Services$v$ WHERE id = '03b2bb8d-574f-4b4c-86d7-79617d22b232' AND name = $v$Omni Healthcare ServicesCarroll$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Omni Home Care$v$ WHERE id = 'dcd823dd-3700-43d8-b882-ada732886ed1' AND name = $v$Omni Home CareHenry$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$One Touch Homecare$v$ WHERE id = 'ad4f0ed0-9b4e-4b9e-95fc-94e7ce27a04e' AND name = $v$One Touch HomecareGrady$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Our Best Healthcare Services$v$ WHERE id = '2a0a4917-02b1-4942-8898-0360f1bf71c5' AND name = $v$Our Best Healthcare ServicesDeKalb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Piece by Piece$v$ WHERE id = '536cb83b-94d8-42da-a7a4-6e04fbb50211' AND name = $v$Piece by PieceCobb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Presidential Home Care$v$ WHERE id = '7244bf47-5055-4bdb-b6f3-44a3e9902004' AND name = $v$Presidential Home CareCherokee$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Professional and Quality Home Care$v$ WHERE id = '30025b2c-badb-41c5-bee8-8f79a073f217' AND name = $v$Professional and Quality Home CareFulton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Proud Life Home Care$v$ WHERE id = 'bea62605-490c-46be-82d2-08a41999dc2a' AND name = $v$Proud Life Home CareDeKalb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Quality Care Inhome Care Services$v$ WHERE id = '7a8b251a-576c-4788-b201-d00cd4af17b3' AND name = $v$Quality Care Inhome Care ServicesNewton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Restorative Custom Healthcare$v$ WHERE id = 'de79965a-f854-4383-ba94-082657ad8722' AND name = $v$Restorative Custom HealthcareForsyth$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Rosemond Health Allies$v$ WHERE id = '996dbd4d-61ec-4554-a45d-c0dfb7153eaa' AND name = $v$Rosemond Health AlliesGwinnett$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Sanzie Healthcare Services$v$ WHERE id = '698cc246-99b3-49ba-9c0e-c01080daf912' AND name = $v$Sanzie Healthcare ServicesBanks$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$TMC Care Services$v$ WHERE id = '8e976198-b103-4035-9664-9ba51b33c5be' AND name = $v$TMC Care ServicesCarroll$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Trees of Life Homecare$v$ WHERE id = 'fbb421cc-2ee8-4a15-adc3-dc536b9386a1' AND name = $v$Trees of Life HomecareFayette$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Ulticare Health and Home Care$v$ WHERE id = '5dcbb847-644d-45a9-9895-a1605c516ac9' AND name = $v$Ulticare Health and Home CareDouglas$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Unite Healthcare Services$v$ WHERE id = '28a7356e-b7d5-46e6-a732-bae7342065b6' AND name = $v$Unite Healthcare ServicesFulton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Universal Healthcare$v$ WHERE id = '39ff3398-1c01-44f7-9e06-790286620f6d' AND name = $v$Universal HealthcareCherokee$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Premium Healthcare Solution$v$ WHERE id = '0f4ff5b3-6966-42de-85df-14ac9699ae9c' AND name = $v$UpsonA Premium Healthcare SolutionBibb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$A Supreme Nursing and Homecare$v$ WHERE id = '656f47c4-3232-4660-ae23-e56ab30d8575' AND name = $v$UpsonA Supreme Nursing and HomecareCobb$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$URE Healthcare$v$ WHERE id = '92928ef9-360d-479e-aca8-bb123e5df97f' AND name = $v$URE HealthcareCarroll$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Strength In Care$v$ WHERE id = '04e2a50b-1a1b-4660-898d-a32a04d5af48' AND name = $v$WaltonStrength In Care$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Noble Grace Home Care$v$ WHERE id = 'd909f783-0653-47f7-8467-e12630bdee36' AND name = $v$WhitfieldNoble Grace Home CareFulton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET name = $v$Your Village Healthcare$v$ WHERE id = 'dce6e9c8-1d1d-4907-8b55-f3c8f751adc3' AND name = $v$Your Village HealthcareJohnson$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Buford$v$ WHERE id = 'f0b88c06-2e6d-4e73-9aeb-77fb4eec4f5e' AND city = $v$FayetteBuford$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = 'ad9b690c-716e-4e8d-a3fb-db4a0e0c83b9' AND city = $v$ClaytonAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Johns Creek$v$ WHERE id = '4921acd3-2686-41fc-b04f-7aedbe0bbdaf' AND city = $v$WaltonJohns Creek$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Lawrenceville$v$ WHERE id = 'bcd1dd0f-0de3-45e7-98f3-09a7307710a5' AND city = $v$RockdaleLawrenceville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = 'ada23afd-23b6-4952-83ea-57a0090a0728' AND city = $v$ClaytonAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Lawrenceville$v$ WHERE id = '4852d31a-42c3-4927-9b97-b4ecb73888a2' AND city = $v$CherokeeLawrenceville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Ellenwood$v$ WHERE id = 'c7660364-06c5-475c-b414-5081ece08870' AND city = $v$GwinnettEllenwood$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Austell$v$ WHERE id = '08d890a8-b0ed-4a78-a09b-ab95f30ca703' AND city = $v$CherokeeAustell$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Tucker$v$ WHERE id = '298ba23d-e77f-49b3-9900-6293c8b8180a' AND city = $v$RockdaleTucker$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = 'b71f359f-6b21-48dd-833f-4f9d7ad1a7bf' AND city = $v$GwinnettAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Powder Springs$v$ WHERE id = 'd8d803ab-425a-46d1-b61c-baea86dc6720' AND city = $v$ForsythPowder Springs$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Johns Creek$v$ WHERE id = '3966ce14-d687-4491-aab6-264830689c95' AND city = $v$CherokeeJohns Creek$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$McDonough$v$ WHERE id = '5e042929-05e9-4043-92be-3910fe5b8492' AND city = $v$CobbMcDonough$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Fayetteville$v$ WHERE id = '6b769e12-a57e-4b51-8837-bbe10e394af2' AND city = $v$Cannon DriveFayetteville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Riverdale$v$ WHERE id = '94ea32b0-98f0-40ae-9213-3fc72ac974d0' AND city = $v$CherokeeRiverdale$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Stone Mountain$v$ WHERE id = 'cdb4f914-c9a4-4cd1-92ea-9862e1ee4d35' AND city = $v$San Miguel DriveStone Mountain$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Snellville$v$ WHERE id = 'e65e5257-607c-492a-b73c-512a33afcecd' AND city = $v$FayetteSnellville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = '539c73c8-dc5d-41fc-873e-dd8ee167b263' AND city = $v$DouglasAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$McDonough$v$ WHERE id = 'dac9b79e-b109-429b-8535-d5ea0c999097' AND city = $v$SpaldingMcDonough$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Buford$v$ WHERE id = '70f5c6f4-cb62-4ea6-a82c-3a704726171c' AND city = $v$Hidden Shoals RoadBuford$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Lawrenceville$v$ WHERE id = '958071f2-8a89-48bc-857c-d9e7835c46c6' AND city = $v$Tioga Lake CoveLawrenceville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Mableton$v$ WHERE id = '536cb83b-94d8-42da-a7a4-6e04fbb50211' AND city = $v$ChathamMableton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Alpharetta$v$ WHERE id = '7244bf47-5055-4bdb-b6f3-44a3e9902004' AND city = $v$HenryAlpharetta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Hampton$v$ WHERE id = 'bea62605-490c-46be-82d2-08a41999dc2a' AND city = $v$Tara Glynn DriveForsythHampton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = '7a8b251a-576c-4788-b201-d00cd4af17b3' AND city = $v$CobbAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Powder Springs$v$ WHERE id = 'de79965a-f854-4383-ba94-082657ad8722' AND city = $v$CobbPowder Springs$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Douglasville$v$ WHERE id = '5dcbb847-644d-45a9-9895-a1605c516ac9' AND city = $v$FayetteDouglasville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Atlanta$v$ WHERE id = '656f47c4-3232-4660-ae23-e56ab30d8575' AND city = $v$Lakehaven WayCarrollAtlanta$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Newnan$v$ WHERE id = '117428a1-d485-4068-8185-c4469dadb53f' AND city = $v$Southwind LaneTroupNewnan$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Decatur$v$ WHERE id = '0f524537-6375-4b59-8ee7-7a7239f7471c' AND city = $v$GreeneDecatur$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Hinesville$v$ WHERE id = '76df9f86-499f-45a8-910d-00f6a2069bed' AND city = $v$BullochHinesville$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$East Dublin$v$ WHERE id = 'eb862002-cbd9-4bc0-ba8a-7605ac5f9482' AND city = $v$SouthEast Dublin$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Grayson$v$ WHERE id = '0de389f3-3c46-49ae-9a3b-3da4cc01c245' AND city = $v$RockdaleGrayson$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Fairburn$v$ WHERE id = 'fa7d33ce-fcc1-42df-8239-564c372ebe0d' AND city = $v$FultonFairburn$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Milton$v$ WHERE id = '1c6bdfbf-e025-42b4-bd1f-88ddfa7568aa' AND city = $v$Tullamore WayMilton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Fairburn$v$ WHERE id = 'db678107-004e-452c-bdca-39e46efe2d15' AND city = $v$PauldingFairburn$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Dacula$v$ WHERE id = '22aba598-0c57-472b-bf0c-a53770a3ecdb' AND city = $v$School House RunDacula$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Hoschton$v$ WHERE id = '2a0a4917-02b1-4942-8898-0360f1bf71c5' AND city = $v$GwinnettHoschton$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Decatur$v$ WHERE id = '2e9c6c7e-7ef4-424b-9574-703c7301839c' AND city = $v$DeKalbDecatur$v$ AND NOT coalesce(is_claimed, false);
UPDATE public.providers SET city = $v$Palmetto$v$ WHERE id = 'd909f783-0653-47f7-8467-e12630bdee36' AND city = $v$ClaytonPalmetto$v$ AND NOT coalesce(is_claimed, false);

COMMIT;

SELECT
  count(*) FILTER (WHERE name ~ '[a-z][A-Z]' AND name !~ '(Mc|Mac|La|De)[A-Z]') AS names_still_glued,
  count(*) FILTER (WHERE city ~ '[a-z][A-Z]' AND city !~ '(Mc|Mac|La|De)[A-Z]') AS cities_still_glued
FROM public.providers;
