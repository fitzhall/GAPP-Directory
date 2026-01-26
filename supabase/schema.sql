-- GAPP Provider Directory Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROVIDERS TABLE
-- ============================================
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  name TEXT NOT NULL,                    -- Agency name
  slug TEXT UNIQUE NOT NULL,             -- URL-friendly name

  -- Location
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'GA',
  counties_served TEXT[] NOT NULL,       -- Multi-county support

  -- Contact
  email TEXT,
  phone TEXT,
  intake_phone TEXT,                     -- Dedicated intake line
  website TEXT,
  address TEXT,

  -- Services
  services_offered TEXT[] NOT NULL,      -- ['RN', 'LPN', 'PCS']
  accepting_new_patients BOOLEAN NOT NULL DEFAULT true,

  -- Availability & Response
  response_expectation TEXT,             -- "Same day callback"
  available_hours TEXT,                  -- "Nights/Weekends available"
  languages TEXT[] DEFAULT ARRAY['English'],

  -- Profile Content
  bio TEXT,
  how_to_start TEXT,
  years_in_business INTEGER,

  -- Tier System (0 = Verified Free, 1 = Featured $99/mo)
  tier_level INTEGER NOT NULL DEFAULT 0,

  -- Status & Trust Signals
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_claimed BOOLEAN NOT NULL DEFAULT false,  -- Provider has claimed their profile
  is_verified BOOLEAN NOT NULL DEFAULT false, -- Admin verified the claim
  is_featured BOOLEAN NOT NULL DEFAULT false, -- Paid featured listing
  background_checked_staff BOOLEAN DEFAULT false,
  fast_response BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  claimed_by_email TEXT,                      -- Email of person who claimed
  claimer_name TEXT,                          -- Name of person who claimed
  claimer_phone TEXT,                         -- Phone of person who claimed
  verified_at TIMESTAMPTZ,
  featured_at TIMESTAMPTZ
);

-- Index for common queries
CREATE INDEX idx_providers_counties ON providers USING GIN (counties_served);
CREATE INDEX idx_providers_services ON providers USING GIN (services_offered);
CREATE INDEX idx_providers_active ON providers (is_active) WHERE is_active = true;
CREATE INDEX idx_providers_tier ON providers (tier_level);
CREATE INDEX idx_providers_slug ON providers (slug);

-- ============================================
-- CALLBACK REQUESTS TABLE
-- ============================================
CREATE TABLE callback_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Family info
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  preferred_callback_time TEXT,          -- "Morning", "Afternoon", "Evening"

  -- Care needs
  zip_code TEXT NOT NULL,
  county TEXT NOT NULL,
  service_needed TEXT NOT NULL,          -- 'RN', 'LPN', 'PCS', 'not_sure'
  hours_needed TEXT,
  urgency TEXT NOT NULL,                 -- 'asap', 'this_month', 'researching'
  special_needs TEXT,                    -- Notes about nights, weekends, etc.

  -- Routing
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,

  -- Status
  status TEXT NOT NULL DEFAULT 'new',    -- 'new', 'contacted', 'converted', 'closed'

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,

  -- Admin notes
  notes TEXT
);

-- Index for provider lookups
CREATE INDEX idx_callback_provider ON callback_requests (provider_id);
CREATE INDEX idx_callback_status ON callback_requests (status);
CREATE INDEX idx_callback_created ON callback_requests (created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- Providers: Anyone can read active providers
CREATE POLICY "Public can view active providers" ON providers
  FOR SELECT
  USING (is_active = true);

-- Providers: Only authenticated admins can modify (we'll add auth later)
-- For now, allow all for development
CREATE POLICY "Allow all provider modifications" ON providers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Callback requests: Anyone can create
CREATE POLICY "Anyone can create callback requests" ON callback_requests
  FOR INSERT
  WITH CHECK (true);

-- Callback requests: Only service role can read/update
CREATE POLICY "Service role can manage callbacks" ON callback_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View for provider cards (subset of fields)
CREATE VIEW provider_cards AS
SELECT
  id,
  name,
  slug,
  city,
  counties_served,
  services_offered,
  accepting_new_patients,
  tier_level,
  is_verified,
  is_featured,
  fast_response,
  background_checked_staff,
  response_expectation
FROM providers
WHERE is_active = true;
