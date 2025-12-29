import { createClient } from '@supabase/supabase-js';
import type { Provider, ProviderCardData, CallbackRequest, ProviderFilters } from '@/types/provider';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// PROVIDER QUERIES
// ============================================

/**
 * Get all active providers with optional filters
 */
export async function getProviders(filters?: ProviderFilters): Promise<Provider[]> {
  let query = supabase
    .from('providers')
    .select('*')
    .eq('is_active', true);

  // Apply filters
  if (filters?.county) {
    query = query.contains('counties_served', [filters.county]);
  }

  if (filters?.service) {
    query = query.contains('services_offered', [filters.service]);
  }

  if (filters?.acceptingNewPatients !== undefined) {
    query = query.eq('accepting_new_patients', filters.acceptingNewPatients);
  }

  if (filters?.isVerified !== undefined) {
    query = query.eq('is_verified', filters.isVerified);
  }

  if (filters?.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
  }

  // Pagination
  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  // Sort: Featured first, then by tier, then alphabetically
  query = query.order('is_featured', { ascending: false })
    .order('tier_level', { ascending: false })
    .order('name');

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }

  return transformProviders(data || []);
}

/**
 * Get a single provider by slug
 */
export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching provider:', error);
    throw error;
  }

  return transformProvider(data);
}

/**
 * Get providers for a specific county
 */
export async function getProvidersByCounty(county: string): Promise<Provider[]> {
  return getProviders({ county });
}

/**
 * Get featured providers (for homepage)
 */
export async function getFeaturedProviders(limit = 6): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('name')
    .limit(limit);

  if (error) {
    console.error('Error fetching featured providers:', error);
    throw error;
  }

  return transformProviders(data || []);
}

/**
 * Get all unique counties that have providers
 */
export async function getActiveCounties(): Promise<string[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('counties_served')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching counties:', error);
    throw error;
  }

  // Flatten and dedupe counties
  const allCounties = data?.flatMap(p => p.counties_served) || [];
  return Array.from(new Set(allCounties)).sort();
}

// ============================================
// CALLBACK REQUEST MUTATIONS
// ============================================

/**
 * Create a new callback request
 */
export async function createCallbackRequest(
  request: Omit<CallbackRequest, 'id' | 'status' | 'createdAt' | 'contactedAt'>
): Promise<CallbackRequest> {
  const { data, error } = await supabase
    .from('callback_requests')
    .insert({
      parent_name: request.parentName,
      phone: request.phone,
      email: request.email,
      preferred_callback_time: request.preferredCallbackTime,
      zip_code: request.zipCode,
      county: request.county,
      service_needed: request.serviceNeeded,
      hours_needed: request.hoursNeeded,
      urgency: request.urgency,
      special_needs: request.specialNeeds,
      provider_id: request.providerId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating callback request:', error);
    throw error;
  }

  return transformCallbackRequest(data);
}

// ============================================
// TRANSFORM FUNCTIONS (DB -> TypeScript)
// ============================================

function transformProvider(data: Record<string, unknown>): Provider {
  return {
    id: data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    city: data.city as string,
    state: data.state as string,
    countiesServed: data.counties_served as string[],
    email: data.email as string | undefined,
    phone: data.phone as string | undefined,
    intakePhone: data.intake_phone as string | undefined,
    website: data.website as string | undefined,
    address: data.address as string | undefined,
    servicesOffered: data.services_offered as Provider['servicesOffered'],
    acceptingNewPatients: data.accepting_new_patients as boolean,
    responseExpectation: data.response_expectation as string | undefined,
    availableHours: data.available_hours as string | undefined,
    languages: data.languages as string[] | undefined,
    bio: data.bio as string | undefined,
    howToStart: data.how_to_start as string | undefined,
    yearsInBusiness: data.years_in_business as number | undefined,
    tierLevel: data.tier_level as number,
    isActive: data.is_active as boolean,
    isClaimed: (data.is_claimed as boolean) ?? false,
    isVerified: data.is_verified as boolean,
    isFeatured: data.is_featured as boolean,
    backgroundCheckedStaff: data.background_checked_staff as boolean | undefined,
    fastResponse: data.fast_response as boolean | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
    verifiedAt: data.verified_at as string | undefined,
    featuredAt: data.featured_at as string | undefined,
  };
}

function transformProviders(data: Record<string, unknown>[]): Provider[] {
  return data.map(transformProvider);
}

function transformCallbackRequest(data: Record<string, unknown>): CallbackRequest {
  return {
    id: data.id as string,
    parentName: data.parent_name as string,
    phone: data.phone as string,
    email: data.email as string | undefined,
    preferredCallbackTime: data.preferred_callback_time as string | undefined,
    zipCode: data.zip_code as string,
    county: data.county as string,
    serviceNeeded: data.service_needed as CallbackRequest['serviceNeeded'],
    hoursNeeded: data.hours_needed as string | undefined,
    urgency: data.urgency as CallbackRequest['urgency'],
    specialNeeds: data.special_needs as string | undefined,
    providerId: data.provider_id as string,
    providerName: '', // Would need to join
    status: data.status as CallbackRequest['status'],
    createdAt: data.created_at as string,
    contactedAt: data.contacted_at as string | undefined,
  };
}

// ============================================
// PROVIDER CARD DATA (lighter weight)
// ============================================

export function toProviderCard(provider: Provider): ProviderCardData {
  return {
    id: provider.id,
    name: provider.name,
    slug: provider.slug,
    city: provider.city,
    countiesServed: provider.countiesServed,
    servicesOffered: provider.servicesOffered,
    acceptingNewPatients: provider.acceptingNewPatients,
    tierLevel: provider.tierLevel,
    isClaimed: provider.isClaimed,
    isVerified: provider.isVerified,
    isFeatured: provider.isFeatured,
    phone: provider.phone,
    fastResponse: provider.fastResponse,
    backgroundCheckedStaff: provider.backgroundCheckedStaff,
    responseExpectation: provider.responseExpectation,
  };
}
