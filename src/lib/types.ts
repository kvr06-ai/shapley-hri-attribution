/**
 * Types for Action-Level Shapley Attribution Demo
 *
 * Models a 15-day robot intervention where each day has a primary action.
 * Demonstrates how Shapley values identify which specific actions
 * caused the observed improvement — unlike RL temporal decay methods.
 */

/** Types of robot actions in the intervention */
export type ActionType =
  | 'emotion_game'
  | 'perspective_game'
  | 'sequencing_game'
  | 'encouragement'
  | 'difficulty_up'
  | 'difficulty_down'
  | 'caregiver_prompt';

/** Human-readable labels for action types */
export const ACTION_LABELS: Record<ActionType, string> = {
  emotion_game: 'Emotion Recognition Game',
  perspective_game: 'Perspective-Taking Game',
  sequencing_game: 'Sequencing Game',
  encouragement: 'Encouragement',
  difficulty_up: 'Difficulty Increased',
  difficulty_down: 'Difficulty Decreased',
  caregiver_prompt: 'Caregiver Prompt',
};

/** Short labels for chart display */
export const ACTION_SHORT_LABELS: Record<ActionType, string> = {
  emotion_game: 'Emotion',
  perspective_game: 'Perspective',
  sequencing_game: 'Sequence',
  encouragement: 'Encourage',
  difficulty_up: 'Diff ↑',
  difficulty_down: 'Diff ↓',
  caregiver_prompt: 'Caregiver',
};

/** A single robot action in the intervention */
export interface Action {
  day: number;
  type: ActionType;
  context?: string; // e.g., "after failed attempt"
  /** Shapley value: causal contribution to outcome */
  shapleyValue: number;
  /** RL credit: what temporal decay methods would assign */
  rlCredit: number;
}

/** Summary of the intervention */
export interface InterventionSummary {
  totalDays: number;
  totalActions: number;
  outcomeImprovement: number; // e.g., 0.35 = 35% improvement
  outcomeMeasure: string; // e.g., "joint attention score"
}

/** Key insight about a high-impact action */
export interface ActionInsight {
  day: number;
  type: ActionType;
  shapleyValue: number;
  explanation: string;
}
