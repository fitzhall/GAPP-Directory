// GAPP Provider Directory Configuration

export const config = {
  // Site Info
  siteName: 'GAPP Provider Directory',
  tagline: 'Find a Georgia GAPP provider you can trust',
  description: 'Helping Georgia families find verified GAPP providers for pediatric home care',

  // Member Terminology
  memberSingular: 'provider',
  memberPlural: 'providers',

  // Tiers (simple: Verified Free vs Featured Paid)
  tiers: [
    {
      level: 0,
      name: 'Verified',
      price: 0,
      color: 'green',
      description: 'Free verified listing',
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
      price: 99,
      color: 'purple',
      description: 'Premium placement + lead routing',
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
    email: 'support@gappdirectory.com',
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
