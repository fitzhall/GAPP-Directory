-- Provider analytics event tracking
CREATE TABLE provider_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click_phone', 'click_website', 'click_callback', 'impression')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Primary query index: dashboard stats for a provider in a date range
CREATE INDEX idx_provider_events_dashboard
  ON provider_events (provider_id, event_type, created_at DESC);

-- Enable RLS
ALTER TABLE provider_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (public tracking)
CREATE POLICY "Public can insert events" ON provider_events
  FOR INSERT WITH CHECK (true);

-- Service role can read all events
CREATE POLICY "Service role can read all events" ON provider_events
  FOR SELECT USING (true);
