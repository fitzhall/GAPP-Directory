-- Create table to track new listing requests from providers not in the directory
CREATE TABLE IF NOT EXISTS listing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact info
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,

  -- Business info
  business_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  services_offered TEXT[] DEFAULT '{}',
  counties_served TEXT[] DEFAULT '{}',

  -- Additional context
  notes TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  review_notes TEXT,

  -- If approved, link to created provider
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick status lookups
CREATE INDEX IF NOT EXISTS idx_listing_requests_status ON listing_requests(status);

-- Index for email lookups (to prevent duplicate submissions)
CREATE INDEX IF NOT EXISTS idx_listing_requests_email ON listing_requests(contact_email);
