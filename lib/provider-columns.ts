// The provider columns the public key may read. Everything else on the
// providers table (claim token, the claimer's name, email and phone, the auth
// user link, admin notes on unverify/downgrade) is private: the database only
// grants these columns to the public roles (supabase/migrations/009), so a
// public query must name them instead of using select('*').
// Kept as one string literal so supabase-js can type the rows it returns.
export const PUBLIC_PROVIDER_COLUMNS =
  'id, name, slug, city, state, counties_served, email, phone, intake_phone, website, address, services_offered, accepting_new_patients, response_expectation, available_hours, languages, bio, how_to_start, years_in_business, tier_level, is_active, is_verified, is_featured, background_checked_staff, fast_response, created_at, updated_at, verified_at, featured_at, is_claimed, claimed_at, is_available, availability_updated_at, availability_streak'
