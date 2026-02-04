/**
 * Predefined scenarios for the Shapley attribution demo
 *
 * Each scenario shows a different intervention configuration and
 * how attribution methods differ in assigning credit.
 *
 * The key insight: Shapley captures interaction effects that
 * simpler methods miss.
 */

import type { Scenario, ScenarioId } from './types';

/**
 * Scenario A: Robot Only (Fixed Easy Tasks)
 *
 * Robot provides social engagement but tasks don't adapt to child's level.
 * Modest improvement because tasks may be too easy or too hard.
 */
const robotOnly: Scenario = {
  id: 'robotOnly',
  title: 'Robot Only',
  description: 'Robot tutors child with fixed difficulty tasks',
  components: ['Robot'],
  totalGain: 0.15,
  attribution: {
    shapley: { Robot: 0.15 },
    equalSplit: { Robot: 0.15 },
    marginal: { Robot: 0.15 },
  },
  insight:
    'With only one component, all methods agree: the robot accounts for 100% of the gain.',
};

/**
 * Scenario B: Robot + Skill-Matched Tasks
 *
 * Robot provides social engagement AND tasks adapt to child's skill level.
 * Larger improvement because robot support is most effective when
 * tasks are in the "zone of proximal development."
 *
 * KEY INSIGHT: The robot's contribution increases when combined with
 * adaptive tasks — this is the interaction effect Shapley captures.
 */
const robotPlusAdaptive: Scenario = {
  id: 'robotPlusAdaptive',
  title: 'Robot + Adaptive Tasks',
  description: 'Robot tutors child with skill-matched tasks',
  components: ['Robot', 'Adaptive Tasks'],
  totalGain: 0.45,
  attribution: {
    shapley: {
      Robot: 0.20,           // Base effect (0.15) + half of interaction (0.05)
      'Adaptive Tasks': 0.25, // Base effect (0.20) + half of interaction (0.05)
    },
    equalSplit: {
      Robot: 0.225,          // 50% of 0.45
      'Adaptive Tasks': 0.225,
    },
    marginal: {
      Robot: 0.15,           // Just the robot-alone effect
      'Adaptive Tasks': 0.30, // Gets ALL the incremental gain (0.45 - 0.15)
    },
  },
  insight:
    'Shapley shows Robot contributes 44% (not 50%). The extra 0.10 gain is interaction — robot support works better when tasks match skill level.',
};

/**
 * Scenario C: Full Intervention (Robot + Adaptive + Parent)
 *
 * Complete triadic intervention: robot, adaptive tasks, and parent involvement.
 * Maximum improvement due to multiple synergies.
 */
const fullIntervention: Scenario = {
  id: 'fullIntervention',
  title: 'Full Intervention',
  description: 'Robot + adaptive tasks + parent involvement',
  components: ['Robot', 'Adaptive Tasks', 'Parent'],
  totalGain: 0.72,
  attribution: {
    shapley: {
      Robot: 0.26,           // Gets credit for base + share of interactions
      'Adaptive Tasks': 0.28,
      Parent: 0.18,
    },
    equalSplit: {
      Robot: 0.24,           // 33% each
      'Adaptive Tasks': 0.24,
      Parent: 0.24,
    },
    marginal: {
      Robot: 0.15,           // Only base effect
      'Adaptive Tasks': 0.30, // Incremental over robot
      Parent: 0.27,          // Gets ALL remaining gain
    },
  },
  insight:
    'Shapley fairly distributes credit: Robot 36%, Adaptive 39%, Parent 25%. Equal-split overvalues Parent; Marginal depends on arbitrary ordering.',
};

/** All scenarios in order */
export const SCENARIOS: Record<ScenarioId, Scenario> = {
  robotOnly,
  robotPlusAdaptive,
  fullIntervention,
};

/** Ordered list for iteration */
export const SCENARIO_ORDER: ScenarioId[] = [
  'robotOnly',
  'robotPlusAdaptive',
  'fullIntervention',
];

/**
 * Get a comparison summary for the "aha" moment
 */
export function getComparisonSummary(scenarioId: ScenarioId): string {
  if (scenarioId === 'robotOnly') {
    return 'All methods agree when there\'s only one component.';
  }

  if (scenarioId === 'robotPlusAdaptive') {
    return `
      <strong>Equal Split</strong> says Robot = 50%. But is that fair?<br/>
      <strong>Marginal</strong> says Robot = 33% (Adaptive gets the rest). But that depends on ordering.<br/>
      <strong>Shapley</strong> says Robot = 44%. It captures that robot effectiveness <em>depends on</em> having appropriate tasks.
    `;
  }

  return `
    <strong>Key question:</strong> "How much did the robot contribute?"<br/>
    <strong>Shapley answer:</strong> 36% — accounting for both its direct effect and its synergy with adaptive tasks.<br/>
    This is the signal clinicians need to optimize interventions.
  `;
}
