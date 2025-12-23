-- Add availability tracking to providers table
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS availability_updated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS availability_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_ping_sent_at TIMESTAMP WITH TIME ZONE;

-- Create availability tokens table for one-click responses
CREATE TABLE IF NOT EXISTS availability_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  response TEXT CHECK (response IN ('available', 'not_available')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_availability_tokens_token ON availability_tokens(token);

-- Index for finding expired/unused tokens
CREATE INDEX IF NOT EXISTS idx_availability_tokens_expires ON availability_tokens(expires_at);

-- Index for provider availability queries (case manager portal)
CREATE INDEX IF NOT EXISTS idx_providers_availability
ON providers(is_verified, is_available, availability_updated_at)
WHERE is_active = true;

-- RLS policies for availability_tokens
ALTER TABLE availability_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public to read tokens (for validation)
CREATE POLICY "Allow public to read availability tokens" ON availability_tokens
  FOR SELECT USING (true);

-- Only service role can insert/update tokens
CREATE POLICY "Service role can manage tokens" ON availability_tokens
  FOR ALL USING (auth.role() = 'service_role');
