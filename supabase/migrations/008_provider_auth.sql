-- Link Supabase Auth users to provider records
ALTER TABLE providers ADD COLUMN auth_user_id UUID UNIQUE;

-- Index for looking up provider by auth user
CREATE INDEX idx_providers_auth_user ON providers (auth_user_id) WHERE auth_user_id IS NOT NULL;

-- RLS: providers can read their own events
CREATE POLICY "Providers can read own events" ON provider_events
  FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM providers WHERE auth_user_id = auth.uid()
    )
  );

-- RLS: providers can read their own callback requests
CREATE POLICY "Providers can read own callbacks" ON callback_requests
  FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM providers WHERE auth_user_id = auth.uid()
    )
  );
