// Generic Member Type - Rename and extend as needed for your niche
export interface Member {
  // Basic Information
  id: string;
  name: string;
  companyName?: string;
  slug: string;
  bio?: string;
  yearsExperience?: number;

  // Location
  city?: string;
  state?: string;

  // Contact
  email?: string;
  phone?: string;
  website?: string;
  address?: string;

  // Tier System (0 = Free, 1 = Basic, 2 = Premium, 3 = Elite)
  tierLevel: number;

  // Status
  isActive: boolean;
  isClaimed: boolean;
  isVerified: boolean;
  isFeatured: boolean;

  // Custom Fields (extend for your niche)
  specializations?: string[];
  certifications?: string[];
  customBadges?: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  claimedAt?: string;
  verifiedAt?: string;
}

// Search/Filter Options
export interface MemberFilters {
  search?: string;
  city?: string;
  state?: string;
  tierLevel?: number;
  specialization?: string;
  isVerified?: boolean;
  limit?: number;
  offset?: number;
}

// For card displays
export interface MemberCardData extends Pick<Member,
  'id' | 'name' | 'companyName' | 'slug' | 'city' | 'state' |
  'tierLevel' | 'isVerified' | 'isFeatured' | 'specializations'
> {}