-- Migration: Add suspension tracking for verified providers
-- This tracks warning emails and verification suspensions

-- Add warning and suspension tracking to availability_tokens
ALTER TABLE availability_tokens
ADD COLUMN IF NOT EXISTS warning_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS suspension_processed_at TIMESTAMPTZ;

-- Add suspension tracking to providers
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS verification_suspended_at TIMESTAMPTZ;

-- Index for efficient followup queries
CREATE INDEX IF NOT EXISTS idx_tokens_warning_status
ON availability_tokens (used_at, warning_sent_at, created_at)
WHERE used_at IS NULL;

-- Comment for documentation
COMMENT ON COLUMN availability_tokens.warning_sent_at IS 'When the 24-hour warning email was sent';
COMMENT ON COLUMN availability_tokens.suspension_processed_at IS 'When verification was suspended for non-response';
COMMENT ON COLUMN providers.verification_suspended_at IS 'When verified status was suspended due to non-response to availability ping';
