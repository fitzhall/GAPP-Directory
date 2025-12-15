// GAPP Provider Type - Georgia Pediatric Care Providers

export type ServiceType = 'RN' | 'LPN' | 'PCS';

export interface Provider {
  // Identity
  id: string;
  name: string;               // Agency name
  slug: string;               // URL-friendly name

  // Location
  city: string;
  state: string;              // Always 'GA' for GAPP
  countiesServed: string[];   // Multi-county support

  // Contact
  email?: string;
  phone?: string;
  intakePhone?: string;       // Dedicated intake line
  website?: string;
  address?: string;

  // Services
  servicesOffered: ServiceType[];
  acceptingNewPatients: boolean;

  // Availability & Response
  responseExpectation?: string;  // "Same day callback", "Within 24 hours"
  availableHours?: string;       // "Nights/Weekends available"
  languages?: string[];          // Spanish, etc.

  // Profile Content
  bio?: string;                  // About the agency (3-5 sentences)
  howToStart?: string;           // Step-by-step in plain English
  yearsInBusiness?: number;

  // Tier System (0 = Verified Free, 1 = Featured $99/mo)
  tierLevel: number;

  // Status & Trust Signals
  isActive: boolean;
  isVerified: boolean;           // We called and verified
  isFeatured: boolean;           // Paid featured listing
  backgroundCheckedStaff?: boolean;
  fastResponse?: boolean;        // Measured/verified fast response

  // Timestamps
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  featuredAt?: string;
}

// For search/filter operations
export interface ProviderFilters {
  search?: string;
  county?: string;
  service?: ServiceType;
  acceptingNewPatients?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  languages?: string;
  nightsWeekends?: boolean;
  limit?: number;
  offset?: number;
}

// For card displays in search results
export interface ProviderCardData {
  id: string;
  name: string;
  slug: string;
  city: string;
  countiesServed: string[];
  servicesOffered: ServiceType[];
  acceptingNewPatients: boolean;
  tierLevel: number;
  isVerified: boolean;
  isFeatured: boolean;
  fastResponse?: boolean;
  backgroundCheckedStaff?: boolean;
  responseExpectation?: string;
}

// Callback request from families
export interface CallbackRequest {
  id: string;

  // Family info
  parentName: string;
  phone: string;
  email?: string;
  preferredCallbackTime?: string;  // "Morning", "Afternoon", "Evening"

  // Care needs
  zipCode: string;
  county: string;
  serviceNeeded: ServiceType | 'not_sure';
  hoursNeeded?: string;
  urgency: 'asap' | 'this_month' | 'researching';
  specialNeeds?: string;  // Nights, weekends, Spanish, high medical needs

  // Routing
  providerId: string;     // Which provider they're requesting
  providerName: string;

  // Status
  status: 'new' | 'contacted' | 'converted' | 'closed';

  // Timestamps
  createdAt: string;
  contactedAt?: string;
}

// Quiz answers for "Help Me Choose" flow
export interface QuizAnswers {
  zipCode?: string;
  county?: string;
  serviceType?: ServiceType | 'not_sure';
  urgency?: 'asap' | 'this_month' | 'researching';
  specialNeeds?: string[];  // ['nights', 'weekends', 'spanish', 'high_medical']
}

// Georgia counties (159 total, we'll start with key ones)
export const GEORGIA_COUNTIES = [
  'Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Clayton',
  'Cherokee', 'Forsyth', 'Henry', 'Hall', 'Richmond',
  'Chatham', 'Muscogee', 'Columbia', 'Douglas', 'Paulding',
  'Bibb', 'Houston', 'Clarke', 'Fayette', 'Coweta',
  'Carroll', 'Bartow', 'Lowndes', 'Whitfield', 'Floyd',
  'Rockdale', 'Newton', 'Troup', 'Glynn', 'Dougherty',
  // Add more as needed
] as const;

export type GeorgiaCounty = typeof GEORGIA_COUNTIES[number];
