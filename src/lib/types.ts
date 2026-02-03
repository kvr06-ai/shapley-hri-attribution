/**
 * Core types for Shapley-based causal attribution in HRI interventions
 */

/** Intervention components that can be toggled on/off */
export type ComponentId =
  | 'adaptiveDifficulty'
  | 'scaffoldedHints'
  | 'positiveReinforcement'
  | 'personalizedContent';

/** Human-readable labels for each component */
export const COMPONENT_LABELS: Record<ComponentId, string> = {
  adaptiveDifficulty: 'Adaptive Difficulty',
  scaffoldedHints: 'Scaffolded Hints',
  positiveReinforcement: 'Positive Reinforcement',
  personalizedContent: 'Personalized Content',
};

/** Descriptions explaining what each component does */
export const COMPONENT_DESCRIPTIONS: Record<ComponentId, string> = {
  adaptiveDifficulty: 'Adjusts task difficulty based on 25%/75% performance thresholds',
  scaffoldedHints: 'Provides graduated hints when learner struggles',
  positiveReinforcement: 'Delivers timed encouragement after correct responses',
  personalizedContent: 'Selects content matching learner profile',
};

/** All available component IDs */
export const ALL_COMPONENTS: ComponentId[] = [
  'adaptiveDifficulty',
  'scaffoldedHints',
  'positiveReinforcement',
  'personalizedContent',
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
