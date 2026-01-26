-- Migration: Add fields to track verification status changes
-- This allows admins to see who missed verification and when

-- Add columns for tracking verification downgrades
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS unverified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS unverified_reason TEXT,
ADD COLUMN IF NOT EXISTS downgraded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS downgraded_reason TEXT;

-- Comment the columns for clarity
COMMENT ON COLUMN providers.unverified_at IS 'Timestamp when provider lost verified badge';
COMMENT ON COLUMN providers.unverified_reason IS 'Reason for losing verification: missed_checkin, failed_verification, manual, etc.';
COMMENT ON COLUMN providers.downgraded_at IS 'Timestamp when provider was downgraded from premium tier';
COMMENT ON COLUMN providers.downgraded_reason IS 'Reason for tier downgrade';

-- Index for finding recently unverified providers
CREATE INDEX IF NOT EXISTS idx_providers_unverified_at ON providers(unverified_at) WHERE unverified_at IS NOT NULL;

-- Index for finding downgraded providers
CREATE INDEX IF NOT EXISTS idx_providers_downgraded_at ON providers(downgraded_at) WHERE downgraded_at IS NOT NULL;
