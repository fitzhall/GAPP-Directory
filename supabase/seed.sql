-- GAPP Provider Directory Seed Data
-- Run this AFTER schema.sql in Supabase SQL Editor

-- ============================================
-- SAMPLE PROVIDERS
-- ============================================

INSERT INTO providers (
  name, slug, city, state, counties_served,
  email, phone, intake_phone, website,
  services_offered, accepting_new_patients,
  response_expectation, available_hours, languages,
  bio, how_to_start, years_in_business,
  tier_level, is_active, is_verified, is_featured,
  background_checked_staff, fast_response
) VALUES

-- Featured Provider 1 (Tier 1)
(
  'Caring Hearts Home Health',
  'caring-hearts-home-health',
  'Atlanta',
  'GA',
  ARRAY['Fulton', 'DeKalb', 'Cobb', 'Gwinnett'],
  'intake@caringheartshh.com',
  '(404) 555-0101',
  '(404) 555-0102',
  'https://caringheartshh.com',
  ARRAY['RN', 'LPN', 'PCS'],
  true,
  'Calls returned same day',
  'Nights and weekends available',
  ARRAY['English', 'Spanish'],
  'Caring Hearts has served Georgia families for over 15 years. Our team of compassionate nurses and caregivers specialize in pediatric home care, providing skilled nursing and personal care services to children enrolled in the GAPP program. We believe every child deserves quality care in the comfort of their home.',
  'Step 1: Call our intake line. Step 2: We verify your GAPP eligibility. Step 3: We schedule an in-home assessment. Step 4: Care begins within 48-72 hours of approval.',
  15,
  1, true, true, true,
  true, true
),

-- Featured Provider 2 (Tier 1)
(
  'Peach State Pediatric Care',
  'peach-state-pediatric-care',
  'Marietta',
  'GA',
  ARRAY['Cobb', 'Cherokee', 'Paulding', 'Douglas', 'Bartow'],
  'info@peachstatepediatric.com',
  '(770) 555-0201',
  '(770) 555-0200',
  'https://peachstatepediatric.com',
  ARRAY['RN', 'LPN'],
  true,
  'Within 24 hours',
  'Nights available',
  ARRAY['English'],
  'Peach State Pediatric Care focuses exclusively on skilled nursing for medically complex children. Our nurses are specially trained in pediatric ventilator care, trach care, and feeding tube management. We partner with families to ensure seamless care coordination.',
  'Step 1: Contact our intake coordinator. Step 2: Provide your GAPP authorization. Step 3: Clinical team reviews care needs. Step 4: Nurse matching and start of care.',
  8,
  1, true, true, true,
  true, true
),

-- Verified Provider 3 (Tier 0)
(
  'Comfort Care Solutions',
  'comfort-care-solutions',
  'Decatur',
  'GA',
  ARRAY['DeKalb', 'Rockdale', 'Newton', 'Henry'],
  'contact@comfortcaresolutions.com',
  '(404) 555-0301',
  NULL,
  NULL,
  ARRAY['PCS'],
  true,
  'Within 48 hours',
  NULL,
  ARRAY['English'],
  'Comfort Care Solutions provides personal care services to help children with daily living activities. Our trained caregivers assist with bathing, dressing, grooming, and mobility support.',
  NULL,
  5,
  0, true, true, false,
  true, false
),

-- Verified Provider 4 (Tier 0)
(
  'Georgia Family Health Services',
  'georgia-family-health-services',
  'Savannah',
  'GA',
  ARRAY['Chatham', 'Bryan', 'Effingham', 'Liberty'],
  'gafamilyhealth@email.com',
  '(912) 555-0401',
  NULL,
  'https://gafamilyhealthservices.com',
  ARRAY['RN', 'LPN', 'PCS'],
  true,
  'Same day callback',
  'Weekends available',
  ARRAY['English', 'Spanish'],
  'Serving the Savannah area for 10 years, Georgia Family Health Services offers comprehensive home care including skilled nursing and personal care for GAPP-enrolled children.',
  NULL,
  10,
  0, true, true, false,
  false, true
),

-- Featured Provider 5 (Tier 1)
(
  'Sunrise Pediatric Nursing',
  'sunrise-pediatric-nursing',
  'Augusta',
  'GA',
  ARRAY['Richmond', 'Columbia', 'Burke', 'McDuffie'],
  'intake@sunrisepediatric.com',
  '(706) 555-0501',
  '(706) 555-0500',
  'https://sunrisepediatric.com',
  ARRAY['RN', 'LPN'],
  true,
  'Calls returned same day',
  'Nights and weekends available',
  ARRAY['English'],
  'Sunrise Pediatric Nursing specializes in high-acuity pediatric cases. Our team includes nurses with PICU and NICU backgrounds who understand the unique needs of medically fragile children. We serve the Augusta metro and surrounding counties.',
  'Step 1: Call us. Step 2: Share your current care needs. Step 3: We coordinate with your care coordinator. Step 4: Services begin.',
  12,
  1, true, true, true,
  true, true
),

-- Verified Provider 6 (Tier 0)
(
  'Hometown Healthcare',
  'hometown-healthcare',
  'Macon',
  'GA',
  ARRAY['Bibb', 'Houston', 'Peach', 'Crawford'],
  'info@hometownhealthcare.com',
  '(478) 555-0601',
  NULL,
  NULL,
  ARRAY['LPN', 'PCS'],
  true,
  'Within 24-48 hours',
  NULL,
  ARRAY['English'],
  'Hometown Healthcare brings quality care to Central Georgia families. We provide LPN nursing services and personal care assistance for children in the GAPP program.',
  NULL,
  7,
  0, true, true, false,
  true, false
),

-- Verified Provider 7 (Tier 0) - Not accepting new patients
(
  'Northside Home Nursing',
  'northside-home-nursing',
  'Alpharetta',
  'GA',
  ARRAY['Fulton', 'Forsyth', 'Cherokee'],
  'northsidehomenursing@email.com',
  '(770) 555-0701',
  NULL,
  NULL,
  ARRAY['RN'],
  false,  -- NOT accepting new patients
  NULL,
  NULL,
  ARRAY['English'],
  'Northside Home Nursing provides RN-level skilled nursing care in North Fulton and surrounding counties.',
  NULL,
  4,
  0, true, true, false,
  true, false
),

-- Verified Provider 8 (Tier 0)
(
  'South Georgia Pediatric Services',
  'south-georgia-pediatric-services',
  'Valdosta',
  'GA',
  ARRAY['Lowndes', 'Brooks', 'Echols', 'Lanier'],
  'sgps@email.com',
  '(229) 555-0801',
  NULL,
  NULL,
  ARRAY['RN', 'LPN', 'PCS'],
  true,
  'Within 24 hours',
  NULL,
  ARRAY['English', 'Spanish'],
  'South Georgia Pediatric Services brings professional pediatric home care to families in Valdosta and the surrounding South Georgia region.',
  NULL,
  6,
  0, true, true, false,
  false, false
),

-- Featured Provider 9 (Tier 1)
(
  'Metro Atlanta Kids Care',
  'metro-atlanta-kids-care',
  'Lawrenceville',
  'GA',
  ARRAY['Gwinnett', 'Walton', 'Barrow', 'Hall'],
  'care@metroatlantakidscare.com',
  '(678) 555-0901',
  '(678) 555-0900',
  'https://metroatlantakidscare.com',
  ARRAY['RN', 'LPN', 'PCS'],
  true,
  'Same day response guaranteed',
  'Full night and weekend coverage',
  ARRAY['English', 'Spanish', 'Korean'],
  'Metro Atlanta Kids Care is the premier pediatric home health agency serving Gwinnett County and Northeast Metro Atlanta. Our multilingual team provides culturally sensitive care for diverse families. We specialize in trach/vent care, feeding tubes, and complex medical needs.',
  'Step 1: Call our 24/7 intake line. Step 2: Quick eligibility check. Step 3: Same-week assessment. Step 4: Care starts immediately after authorization.',
  11,
  1, true, true, true,
  true, true
),

-- Verified Provider 10 (Tier 0)
(
  'Coastal Care Partners',
  'coastal-care-partners',
  'Brunswick',
  'GA',
  ARRAY['Glynn', 'Camden', 'McIntosh', 'Wayne'],
  'coastalcare@email.com',
  '(912) 555-1001',
  NULL,
  NULL,
  ARRAY['LPN', 'PCS'],
  true,
  'Within 48 hours',
  'Limited weekend availability',
  ARRAY['English'],
  'Coastal Care Partners serves families along Georgia''s beautiful coast. We provide LPN nursing and personal care services with a focus on building lasting relationships with families.',
  NULL,
  3,
  0, true, true, false,
  false, false
);

-- Verify the insert
SELECT name, city, counties_served, services_offered, tier_level, is_featured
FROM providers
ORDER BY tier_level DESC, name;
