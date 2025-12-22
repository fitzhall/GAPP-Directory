// GAPP Eligibility Screener - Scoring and Result Utilities

import {
  CARE_COMPLEXITY,
  FIT_LEVEL_CONTENT,
  NEXT_STEPS,
  SCRIPTS,
} from './screener-config'

// Types
export interface ScreenerState {
  step: number
  // Step 1: Care complexity
  airway: string[]
  feeding: string[]
  neuro: string[]
  mobility: string[]
  skilled: string[]
  // Step 2: Current situation
  medicaidStatus: 'yes' | 'no' | 'not_sure' | null
  hoursStatus: 'approved' | 'not_applied' | 'pending' | 'reduced' | null
  painPoint: string | null
  // Step 3: Geography
  county: string
  zipCode: string
}

export type FitLevel = 'strong' | 'moderate' | 'needs_review'

export interface ScreenerResults {
  fitLevel: FitLevel
  fitContent: typeof FIT_LEVEL_CONTENT.strong
  totalIndicators: number
  selectedConditions: string[]
  selectedTasks: string[]
  nextSteps: typeof NEXT_STEPS.need_hours
  scripts: {
    agency: string
    pediatrician: string
    coordinator?: string
  }
  showHourReduction: boolean
}

// Initial state
export const initialScreenerState: ScreenerState = {
  step: 1,
  airway: [],
  feeding: [],
  neuro: [],
  mobility: [],
  skilled: [],
  medicaidStatus: null,
  hoursStatus: null,
  painPoint: null,
  county: '',
  zipCode: '',
}

// Get all selected indicators as a flat array
export function getAllIndicators(state: ScreenerState): string[] {
  return [
    ...state.airway,
    ...state.feeding,
    ...state.neuro,
    ...state.mobility,
    ...state.skilled,
  ]
}

// Calculate fit level based on state
export function calculateFitLevel(state: ScreenerState): FitLevel {
  const totalIndicators = getAllIndicators(state).length

  // Strong fit: 3+ indicators AND on Medicaid
  if (totalIndicators >= 3 && state.medicaidStatus === 'yes') {
    return 'strong'
  }

  // Moderate fit: 1+ indicators (regardless of Medicaid status)
  if (totalIndicators >= 1) {
    return 'moderate'
  }

  // Needs review: no indicators selected
  return 'needs_review'
}

// Get human-readable labels for selected care indicators
export function getSelectedConditionLabels(state: ScreenerState): string[] {
  const labels: string[] = []

  // Helper to get labels from a category
  const getLabels = (category: keyof typeof CARE_COMPLEXITY, selected: string[]) => {
    const options = CARE_COMPLEXITY[category].options
    selected.forEach(id => {
      const option = options.find(o => o.id === id)
      if (option) labels.push(option.label.toLowerCase())
    })
  }

  getLabels('airway', state.airway)
  getLabels('feeding', state.feeding)
  getLabels('neuro', state.neuro)

  return labels
}

// Get human-readable labels for selected skilled tasks
export function getSelectedTaskLabels(state: ScreenerState): string[] {
  const labels: string[] = []

  const getLabels = (category: keyof typeof CARE_COMPLEXITY, selected: string[]) => {
    const options = CARE_COMPLEXITY[category].options
    selected.forEach(id => {
      const option = options.find(o => o.id === id)
      if (option) labels.push(option.label.toLowerCase())
    })
  }

  getLabels('skilled', state.skilled)
  getLabels('mobility', state.mobility)

  return labels
}

// Determine which next steps to show based on situation
export function getNextSteps(state: ScreenerState) {
  // No Medicaid - that's the first priority
  if (state.medicaidStatus === 'no' || state.medicaidStatus === 'not_sure') {
    return NEXT_STEPS.no_medicaid
  }

  // Based on pain point / hours status
  if (state.painPoint === 'no_nurse' || state.hoursStatus === 'approved') {
    return NEXT_STEPS.approved_no_nurse
  }

  if (state.painPoint === 'reduced' || state.hoursStatus === 'reduced') {
    return NEXT_STEPS.hours_reduced
  }

  if (state.painPoint === 'researching') {
    return NEXT_STEPS.researching
  }

  // Default: need hours
  return NEXT_STEPS.need_hours
}

// Generate all results from state
export function generateResults(state: ScreenerState): ScreenerResults {
  const fitLevel = calculateFitLevel(state)
  const conditions = getSelectedConditionLabels(state)
  const tasks = getSelectedTaskLabels(state)
  const allIndicators = [...conditions, ...tasks]

  return {
    fitLevel,
    fitContent: FIT_LEVEL_CONTENT[fitLevel],
    totalIndicators: getAllIndicators(state).length,
    selectedConditions: conditions,
    selectedTasks: tasks,
    nextSteps: getNextSteps(state),
    scripts: {
      agency: SCRIPTS.agency_call.template(state.county || 'your', allIndicators),
      pediatrician: SCRIPTS.pediatrician.template(allIndicators),
      coordinator: (state.hoursStatus === 'reduced' || state.painPoint === 'reduced')
        ? SCRIPTS.coordinator.template()
        : undefined,
    },
    showHourReduction: state.hoursStatus === 'reduced' || state.painPoint === 'reduced',
  }
}

// Validation helpers
export function canProceedFromStep(state: ScreenerState, step: number): boolean {
  switch (step) {
    case 1:
      // At least one care indicator should be selected, but not required
      // Let them proceed even with nothing selected
      return true
    case 2:
      // Must select medicaid status and pain point
      return state.medicaidStatus !== null && state.painPoint !== null
    case 3:
      // Must select county
      return state.county !== ''
    default:
      return true
  }
}
