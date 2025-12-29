-- Add claim tokens for direct email links
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS claim_token UUID DEFAULT gen_random_uuid();

-- Create unique index on claim_token
CREATE UNIQUE INDEX IF NOT EXISTS idx_providers_claim_token ON providers(claim_token);

-- Generate tokens for any providers that don't have one
UPDATE providers SET claim_token = gen_random_uuid() WHERE claim_token IS NULL;

-- Create table to track provider issues reported by case managers
CREATE TABLE IF NOT EXISTS provider_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('no_answer', 'not_taking_cases', 'wrong_number', 'other')),
  reported_by TEXT, -- optional: case manager identifier
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT
);

-- Index for quick lookups by provider
CREATE INDEX IF NOT EXISTS idx_provider_issues_provider ON provider_issues(provider_id);

-- Index for unresolved issues
CREATE INDEX IF NOT EXISTS idx_provider_issues_unresolved ON provider_issues(provider_id) WHERE resolved_at IS NULL;
