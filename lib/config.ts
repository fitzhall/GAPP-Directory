// GAPP Provider Directory Configuration

export const config = {
  // Site Info
  siteName: 'GAPP Provider Directory',
  tagline: 'Find a Georgia GAPP provider you can trust',
  description: 'Helping Georgia families find verified GAPP providers for pediatric home care',

  // Member Terminology
  memberSingular: 'provider',
  memberPlural: 'providers',

  // Tiers (0 = Claimed, 1 = Featured Paid)
  tiers: [
    {
      level: 0,
      name: 'Verified',
      price: 147,
      color: 'green',
      description: 'Verified listing, billed quarterly',
      features: [
        'Listed in search results',
        'Counties served displayed',
        'Services offered shown',
        'Basic profile'
      ]
    },
    {
      level: 1,
      name: 'Featured',
      price: 897,
      color: 'purple',
      description: 'Premium: first place in one county, billed quarterly',
      features: [
        'Top placement in your counties',
        'Featured badge on profile',
        'Callback request button',
        'Lead info before contact',
        'Expanded profile with photos',
        'Priority in "Help Me Choose" results'
      ]
    },
  ],

  // Plans and the Whop checkout links that charge them. Prices here must match
  // what the Whop plan actually charges (checked 2026-10-22).
  pricing: {
    verified: {
      price: 147,
      period: 'quarter',
      label: '$147/quarter',
      checkoutUrl: 'https://whop.com/checkout/plan_ONEJn5I9ehbJp',
    },
    premium: {
      price: 897,
      period: 'quarter',
      label: '$897/quarter',
      checkoutUrl: 'https://whop.com/checkout/plan_G4k1CThUXfFdD',
    },
  },

  // Trust Badges
  badges: [
    { id: 'verified', label: 'Verified GAPP Provider', color: 'green', icon: 'check' },
    { id: 'featured', label: 'Featured', color: 'purple', icon: 'star' },
    { id: 'fast_response', label: 'Fast Response', color: 'blue', icon: 'clock' },
    { id: 'background_checked', label: 'Background-Checked Staff', color: 'teal', icon: 'shield' },
  ],

  // Service Types
  services: [
    { id: 'RN', label: 'Registered Nursing (RN)', description: 'Skilled nursing care by registered nurses' },
    { id: 'LPN', label: 'Licensed Practical Nursing (LPN)', description: 'Nursing care by licensed practical nurses' },
    { id: 'PCS', label: 'Personal Care Services (PCS)', description: 'Help with bathing, dressing, daily activities' },
  ],

  // Features
  features: {
    search: true,
    quiz: true,           // "Help Me Choose" flow
    callbackRequests: true,
    tiers: true,
    location: true,
    reviews: false,       // Maybe later
    messaging: false,     // Not for MVP
  },

  // Quiz Questions for "Help Me Choose"
  quizQuestions: [
    {
      id: 'location',
      question: 'Where are you located?',
      type: 'location',
      required: true,
    },
    {
      id: 'service',
      question: 'What kind of help do you need?',
      type: 'single',
      options: [
        { value: 'RN', label: 'Nursing help at home (RN)' },
        { value: 'LPN', label: 'Nursing help at home (LPN)' },
        { value: 'PCS', label: 'Personal care help (bathing, dressing, etc.)' },
        { value: 'not_sure', label: 'Not sure yet' },
      ],
      required: true,
    },
    {
      id: 'urgency',
      question: 'When do you need help?',
      type: 'single',
      options: [
        { value: 'asap', label: 'As soon as possible' },
        { value: 'this_month', label: 'Within the next month' },
        { value: 'researching', label: 'Just researching options' },
      ],
      required: true,
    },
    {
      id: 'special_needs',
      question: 'Anything else important?',
      type: 'multi',
      options: [
        { value: 'nights', label: 'Need night hours' },
        { value: 'weekends', label: 'Need weekend hours' },
        { value: 'spanish', label: 'Spanish-speaking preferred' },
        { value: 'high_medical', label: 'High medical needs' },
      ],
      required: false,
    },
  ],

  // Contact
  contact: {
    email: 'help@georgiaGAPP.com',
    phone: '(678) 263-8540',
    phoneRaw: '+16782638540',
    businessName: 'GeorgiaGAPP.com',
    disclaimer: 'This directory is not affiliated with the State of Georgia or the official GAPP program. We help families find providers but are not a state agency.',
  },
};

// Helper functions
export function getTierName(level: number): string {
  return config.tiers.find(t => t.level === level)?.name || 'Verified';
}

export function getTierColor(level: number): string {
  return config.tiers.find(t => t.level === level)?.color || 'green';
}

export function getServiceLabel(serviceId: string): string {
  return config.services.find(s => s.id === serviceId)?.label || serviceId;
}

export function getServiceDescription(serviceId: string): string {
  return config.services.find(s => s.id === serviceId)?.description || '';
}
