// Fire & Life Safety Directory Configuration
export const fireSafetyConfig = {
  // Site Info
  siteName: 'Fire & Life Safety Directory',
  tagline: 'Find certified fire and life safety professionals nationwide',

  // Member Terminology
  memberSingular: 'inspector',
  memberPlural: 'inspectors',

  // Tiers
  tiers: [
    { level: 0, name: 'Listed', price: 0, color: 'gray' },
    { level: 1, name: 'Certified', price: 149, color: 'blue' },
    { level: 2, name: 'Master', price: 299, color: 'purple' },
    { level: 3, name: 'Elite', price: 499, color: 'yellow' },
  ],

  // Custom Badges
  badges: [
    { id: 'nfpa', label: 'NFPA Certified', color: 'red' },
    { id: 'icc', label: 'ICC Certified', color: 'blue' },
    { id: 'nicet', label: 'NICET', color: 'green' },
    { id: 'featured', label: 'Featured', color: 'purple' },
  ],

  // Features
  features: {
    search: true,
    claiming: true,
    tiers: true,
    location: true,
    reviews: false,
    messaging: false,
  }
}

// Sample Fire Safety Specializations
export const fireSpecializations = [
  'Fire Sprinkler Systems',
  'Fire Alarm Systems',
  'Emergency Lighting',
  'Exit Planning',
  'Fire Extinguishers',
  'Kitchen Hood Systems',
  'Special Hazards',
  'Fire Pumps',
  'Standpipe Systems',
  'Fire Doors',
  'Smoke Control',
  'Mass Notification'
]