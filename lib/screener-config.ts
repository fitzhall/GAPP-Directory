// GAPP Eligibility & Hours Pre-Screener Configuration

// Georgia counties for the dropdown (reuse from quiz)
export const GEORGIA_COUNTIES = [
  'Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Clayton',
  'Cherokee', 'Forsyth', 'Henry', 'Hall', 'Richmond',
  'Chatham', 'Muscogee', 'Columbia', 'Douglas', 'Paulding',
  'Bibb', 'Houston', 'Clarke', 'Fayette', 'Coweta',
  'Carroll', 'Bartow', 'Lowndes', 'Whitfield', 'Floyd',
  'Rockdale', 'Newton', 'Troup', 'Glynn', 'Dougherty',
  'Bryan', 'Effingham', 'Liberty', 'Camden', 'McIntosh',
  'Wayne', 'Burke', 'McDuffie', 'Brooks', 'Echols',
  'Lanier', 'Walton', 'Barrow', 'Peach', 'Crawford'
].sort()

// Care complexity categories
export const CARE_COMPLEXITY = {
  airway: {
    label: 'Airway & Breathing',
    options: [
      { id: 'trach', label: 'Tracheostomy' },
      { id: 'vent', label: 'Ventilator' },
      { id: 'oxygen', label: 'Oxygen therapy' },
      { id: 'suction', label: 'Frequent suctioning' },
    ]
  },
  feeding: {
    label: 'Feeding & Nutrition',
    options: [
      { id: 'gtube', label: 'G-tube / feeding tube' },
      { id: 'tube_meds', label: 'Tube medications' },
      { id: 'aspiration', label: 'Aspiration risk' },
    ]
  },
  neuro: {
    label: 'Neurological',
    options: [
      { id: 'seizures', label: 'Seizures (daily/weekly)' },
      { id: 'rescue_meds', label: 'Rescue medications needed' },
      { id: 'monitoring', label: 'Frequent monitoring required' },
    ]
  },
  mobility: {
    label: 'Mobility & Safety',
    options: [
      { id: 'fall_risk', label: 'Fall risk' },
      { id: 'transfer', label: 'Transfer assistance needed' },
      { id: 'supervision', label: 'Cannot be left alone' },
    ]
  },
  skilled: {
    label: 'Skilled Tasks',
    options: [
      { id: 'complex_meds', label: 'Complex medication schedule' },
      { id: 'wound_care', label: 'Wound care' },
      { id: 'catheter', label: 'Catheter care' },
    ]
  }
}

// Medicaid status options
export const MEDICAID_STATUS_OPTIONS = [
  { id: 'yes', label: 'Yes, we have Medicaid/PeachCare' },
  { id: 'no', label: "No, we don't have coverage yet" },
  { id: 'not_sure', label: 'Not sure / applying' },
]

// Hours status options
export const HOURS_STATUS_OPTIONS = [
  { id: 'approved', label: 'Yes, already approved for hours' },
  { id: 'not_applied', label: "No, haven't applied yet" },
  { id: 'pending', label: 'Pending / waiting for decision' },
  { id: 'reduced', label: 'Had hours, but they were reduced' },
]

// Pain point options
export const PAIN_POINT_OPTIONS = [
  { id: 'qualify', label: "I don't know if we qualify" },
  { id: 'denied', label: 'We applied and got denied' },
  { id: 'reduced', label: 'Our hours are getting reduced' },
  { id: 'no_nurse', label: "We're approved but can't find a nurse" },
  { id: 'researching', label: 'Just researching options' },
]

// Results content based on fit level
export const FIT_LEVEL_CONTENT = {
  strong: {
    title: 'Strong Fit Indicators',
    color: 'green',
    snapshot: "Based on what you shared, your child has multiple skilled-care indicators that typically qualify for GAPP home nursing services.",
  },
  moderate: {
    title: 'Moderate Fit Indicators',
    color: 'yellow',
    snapshot: "Your child has some care needs that may qualify for GAPP services. A detailed Letter of Medical Necessity will be key to demonstrating the need for skilled nursing.",
  },
  needs_review: {
    title: 'Needs Review',
    color: 'gray',
    snapshot: "Based on what you shared, you may need additional documentation to demonstrate skilled care needs. Let's look at your next steps.",
  }
}

// Next steps based on situation
export const NEXT_STEPS = {
  no_medicaid: [
    {
      step: 1,
      title: 'Apply for Medicaid or PeachCare',
      description: 'GAPP services are covered through Georgia Medicaid. Start your application at gateway.ga.gov or call 1-877-423-4746.',
    },
    {
      step: 2,
      title: 'Gather diagnosis documentation',
      description: "While your application processes, collect your child's medical records, diagnosis letters, and any hospital discharge summaries.",
    },
    {
      step: 3,
      title: 'Return here once approved',
      description: "Once you have Medicaid/PeachCare coverage, come back to this tool and we'll guide you through the next steps.",
    },
  ],
  need_hours: [
    {
      step: 1,
      title: 'Request a Letter of Medical Necessity (LMN)',
      description: "Ask your child's pediatrician or specialist to write an LMN documenting the skilled nursing needs.",
    },
    {
      step: 2,
      title: 'Be specific about skilled tasks',
      description: 'Make sure the LMN lists specific skilled tasks that require nursing care, not just general supervision.',
    },
    {
      step: 3,
      title: 'Contact agencies in your county',
      description: 'Reach out to home health agencies who can help guide you through the approval process.',
    },
  ],
  approved_no_nurse: [
    {
      step: 1,
      title: 'Expand your search area',
      description: 'Consider agencies in neighboring counties — many serve multiple areas.',
    },
    {
      step: 2,
      title: 'Contact multiple agencies at once',
      description: "Don't wait for one agency to respond. Reach out to several and see who has availability.",
    },
    {
      step: 3,
      title: 'Consider both RN and LPN options',
      description: 'Depending on your approved care plan, an LPN may be able to provide most services at better availability.',
    },
  ],
  hours_reduced: [
    {
      step: 1,
      title: 'Document daily care needs',
      description: 'Keep a 2-week log of every skilled task performed, including time, duration, and any incidents.',
    },
    {
      step: 2,
      title: 'Request a care plan review',
      description: 'Contact your care coordinator and formally request a review of the reduction decision.',
    },
    {
      step: 3,
      title: 'Update your Letter of Medical Necessity',
      description: "Have your doctor write an updated LMN that reflects current needs — situations change, and documentation should too.",
    },
  ],
  researching: [
    {
      step: 1,
      title: 'Learn about GAPP services',
      description: 'GAPP provides home nursing care for medically fragile children covered by Georgia Medicaid.',
    },
    {
      step: 2,
      title: 'Assess your care needs',
      description: 'Talk to your pediatrician about whether your child might benefit from skilled nursing at home.',
    },
    {
      step: 3,
      title: 'Browse providers in your area',
      description: 'Use our directory to see what agencies serve your county and what services they offer.',
    },
  ],
}

// Scripts for families
export const SCRIPTS = {
  agency_call: {
    title: 'Calling an Agency',
    template: (county: string, conditions: string[]) =>
      `"Hi, I'm looking for home nursing care for my child who has ${conditions.length > 0 ? conditions.join(', ') : 'complex medical needs'}. We have Medicaid coverage and are looking for GAPP services. Are you accepting new patients in ${county} county?"`,
  },
  pediatrician: {
    title: 'Talking to Your Pediatrician',
    template: (tasks: string[]) =>
      `"We need a Letter of Medical Necessity for home nursing hours through GAPP. Can you document that my child requires skilled nursing for ${tasks.length > 0 ? tasks.join(', ') : 'their medical needs'}? The letter should specify why these tasks require a trained nurse rather than a caregiver."`,
  },
  coordinator: {
    title: 'Talking to Your Care Coordinator',
    template: () =>
      `"I'd like to request a formal review of our hours reduction. I've been documenting daily care needs and believe the current hours don't reflect my child's actual skilled nursing requirements. Can you tell me the appeal process?"`,
  }
}

// Document checklist
export const DOCUMENT_CHECKLIST = [
  { id: 'diagnosis', label: 'Current diagnosis list from your doctor' },
  { id: 'medications', label: 'Medication list with schedules and dosages' },
  { id: 'hospitalizations', label: 'Recent hospitalization or ER visit summaries' },
  { id: 'care_plan', label: 'Current care plan (if you have one)' },
  { id: 'insurance', label: 'Medicaid/PeachCare card copy' },
  { id: 'tasks', label: 'Written list of daily skilled care tasks (parent-written is OK)' },
]

// Hour reduction resources
export const HOUR_REDUCTION_TIPS = [
  {
    title: 'Keep a daily care log',
    description: 'Document every skilled task: what, when, how long, and any complications. This creates evidence for appeals.',
  },
  {
    title: 'Know your appeal rights',
    description: 'You have the right to request a fair hearing if you disagree with a coverage decision. Ask for the appeal process in writing.',
  },
  {
    title: 'Get updated documentation',
    description: "Medical needs change. An updated LMN showing current (not historical) needs can support your case.",
  },
  {
    title: 'Connect with other families',
    description: 'Parent support groups often have experience navigating appeals and can share what worked for them.',
  },
]

// Feedback options
export const FEEDBACK_OPTIONS = [
  { id: 'helpful', label: 'Yes, this was helpful' },
  { id: 'somewhat', label: 'Somewhat helpful' },
  { id: 'not_helpful', label: 'No, I need different help' },
]
