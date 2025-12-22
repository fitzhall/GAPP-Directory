-- Migration: Add claimed/unclaimed profile status
-- Run this in Supabase SQL Editor

-- Add claimed fields to providers table
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS claimed_by_email TEXT,
ADD COLUMN IF NOT EXISTS claim_token TEXT;

-- Index for claimed status queries
CREATE INDEX IF NOT EXISTS idx_providers_claimed ON providers (is_claimed);

-- Comment explaining the flow:
-- is_claimed = false: Unclaimed profile (scraped/imported from state list)
--   - Shows in directory with limited info
--   - Has "Claim This Profile" button
--   - No callback form (can't route leads to unclaimed)
--
-- is_claimed = true: Provider has claimed their profile
--   - claimed_by_email stores who claimed it
--   - They can now receive leads
--   - Shows "Claimed" badge in admin
--
-- is_verified = true: Admin has verified the claim is legit
--   - Full profile visible
--   - Callback form enabled
--   - Shows "Verified" badge publicly
