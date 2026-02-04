/**
 * Sample Intervention Data
 *
 * A 15-day robot intervention for a child with ASD.
 * Outcome: 35% improvement in emotion recognition.
 *
 * Key insight: Day 3's encouragement after a failed attempt
 * had disproportionate causal impact (Shapley: +12%) that
 * RL temporal decay methods would miss entirely.
 */

import type { Action, InterventionSummary, ActionInsight } from './types';

/** The intervention: 15 days, one primary action per day */
export const INTERVENTION_ACTIONS: Action[] = [
  // Week 1: Building rapport and initial assessment
  {
    day: 1,
    type: 'emotion_game',
    context: 'baseline session',
    shapleyValue: 0.02,
    rlCredit: 0.01, // Very low due to temporal decay
  },
  {
    day: 2,
    type: 'sequencing_game',
    context: 'skill assessment',
    shapleyValue: 0.01,
    rlCredit: 0.01,
  },
  {
    day: 3,
    type: 'encouragement',
    context: 'after failed attempt - child frustrated',
    shapleyValue: 0.12, // HIGH IMPACT - key turning point
    rlCredit: 0.02,     // RL misses this completely
  },
  {
    day: 4,
    type: 'difficulty_down',
    context: 'adjusted after frustration',
    shapleyValue: 0.06,
    rlCredit: 0.02,
  },
  {
    day: 5,
    type: 'emotion_game',
    context: 'easier level - building confidence',
    shapleyValue: 0.04,
    rlCredit: 0.03,
  },

  // Week 2: Progress and caregiver involvement
  {
    day: 6,
    type: 'caregiver_prompt',
    context: 'parent joins session',
    shapleyValue: 0.08, // Caregiver involvement matters
    rlCredit: 0.03,
  },
  {
    day: 7,
    type: 'perspective_game',
    context: 'new game type introduced',
    shapleyValue: 0.03,
    rlCredit: 0.04,
  },
  {
    day: 8,
    type: 'emotion_game',
    context: 'back to core skill',
    shapleyValue: 0.02,
    rlCredit: 0.05,
  },
  {
    day: 9,
    type: 'difficulty_up',
    context: 'child ready for challenge',
    shapleyValue: 0.05,
    rlCredit: 0.06,
  },
  {
    day: 10,
    type: 'sequencing_game',
    context: 'variety session',
    shapleyValue: 0.01,
    rlCredit: 0.07,
  },

  // Week 3: Consolidation
  {
    day: 11,
    type: 'emotion_game',
    context: 'mastery practice',
    shapleyValue: 0.03,
    rlCredit: 0.08,
  },
  {
    day: 12,
    type: 'encouragement',
    context: 'celebrating progress',
    shapleyValue: -0.01, // Slightly negative - unnecessary interruption
    rlCredit: 0.10,
  },
  {
    day: 13,
    type: 'perspective_game',
    context: 'transfer learning',
    shapleyValue: 0.02,
    rlCredit: 0.12,
  },
  {
    day: 14,
    type: 'emotion_game',
    context: 'final practice',
    shapleyValue: 0.04,
    rlCredit: 0.15,
  },
  {
    day: 15,
    type: 'difficulty_up',
    context: 'final assessment',
    shapleyValue: -0.02, // Negative - pushed too hard at end
    rlCredit: 0.21,      // RL gives this the MOST credit (recency)
  },
];

/** Summary of the intervention */
export const INTERVENTION_SUMMARY: InterventionSummary = {
  totalDays: 15,
  totalActions: 15,
  outcomeImprovement: 0.35, // 35% improvement
  outcomeMeasure: 'emotion recognition score',
};

/** Key insights from Shapley analysis */
export const KEY_INSIGHTS: ActionInsight[] = [
  {
    day: 3,
    type: 'encouragement',
    shapleyValue: 0.12,
    explanation:
      'The encouragement after Day 3\'s failed attempt was the turning point. ' +
      'It prevented disengagement and enabled all subsequent progress. ' +
      'RL methods assign only 2% credit due to temporal distance.',
  },
  {
    day: 6,
    type: 'caregiver_prompt',
    shapleyValue: 0.08,
    explanation:
      'Caregiver involvement on Day 6 amplified the robot\'s effectiveness. ' +
      'The triadic interaction (robot + child + parent) created synergy ' +
      'that wouldn\'t exist with the robot alone.',
  },
  {
    day: 15,
    type: 'difficulty_up',
    shapleyValue: -0.02,
    explanation:
      'The final difficulty increase was counterproductive—the child was ' +
      'already at mastery. RL assigns 21% credit (highest!) because it\'s ' +
      'most recent. Shapley correctly identifies it as slightly harmful.',
  },
];

/** Calculate totals for validation */
export const TOTALS = {
  shapleySum: INTERVENTION_ACTIONS.reduce((sum, a) => sum + a.shapleyValue, 0),
  rlCreditSum: INTERVENTION_ACTIONS.reduce((sum, a) => sum + a.rlCredit, 0),
};
