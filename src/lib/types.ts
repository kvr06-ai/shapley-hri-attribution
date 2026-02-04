/**
 * Core types for Shapley-based causal attribution in HRI interventions
 *
 * Context: Social robot interventions for children with ASD
 * Based on PAIR Lab research (Salomons et al., Science Robotics 2018)
 */

/** Intervention components that can be toggled on/off */
export type ComponentId =
  | 'robotEngagement'
  | 'adaptiveDifficulty'
  | 'caregiverInvolvement'
  | 'gameScaffolding';

/** Human-readable labels for each component */
export const COMPONENT_LABELS: Record<ComponentId, string> = {
  robotEngagement: 'Robot Social Engagement',
  adaptiveDifficulty: 'Adaptive Difficulty',
  caregiverInvolvement: 'Caregiver Involvement',
  gameScaffolding: 'Game Scaffolding',
};

/** Descriptions explaining what each component does */
export const COMPONENT_DESCRIPTIONS: Record<ComponentId, string> = {
  robotEngagement:
    'Robot provides social attention, encouragement, and emotional responses',
  adaptiveDifficulty:
    'BKT-driven task adjustment using 25%/75% performance thresholds',
  caregiverInvolvement:
    'Parent/caregiver participates in the triadic interaction',
  gameScaffolding:
    'Graduated hints and support within Story/Rocket/Train games',
};

/** All available component IDs */
export const ALL_COMPONENTS: ComponentId[] = [
  'robotEngagement',
  'adaptiveDifficulty',
  'caregiverInvolvement',
  'gameScaffolding',
];

/** A coalition is a subset of components (represented as a Set) */
export type Coalition = Set<ComponentId>;

/** Result of Shapley value computation */
export interface ShapleyResult {
  /** Shapley value for each component */
  values: Record<ComponentId, number>;
  /** Total value (should equal sum of Shapley values - efficiency axiom) */
  totalValue: number;
  /** Value attributed to interaction effects */
  interactionValue: number;
}

/** Single trial in the learning simulation */
export interface Trial {
  trialNumber: number;
  skillLevel: number;
  correct: boolean;
  activeComponents: ComponentId[];
}

/** Result of running a full simulation */
export interface SimulationResult {
  trials: Trial[];
  initialSkill: number;
  finalSkill: number;
  learningGain: number;
}

/** Configuration for the simulation */
export interface SimulationConfig {
  activeComponents: ComponentId[];
  numTrials: number;
  initialSkill: number;
}
