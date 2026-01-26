-- Migration: Add claimer details columns to providers table
-- Run this in Supabase SQL Editor

-- Add claimer_name column (name of person who claimed the profile)
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS claimer_name TEXT;

-- Add claimer_phone column (phone of person who claimed the profile)
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS claimer_phone TEXT;

-- Backfill: For existing claimed providers without claimer_name,
-- you could optionally set a placeholder or leave as NULL
-- UPDATE providers SET claimer_name = 'Unknown (claimed before migration)'
-- WHERE is_claimed = true AND claimer_name IS NULL;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'providers'
AND column_name IN ('claimer_name', 'claimer_phone');
