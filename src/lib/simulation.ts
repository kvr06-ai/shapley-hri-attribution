/**
 * Simulation Engine for Learner Skill Progression
 *
 * This module simulates a learner progressing through a skill-building task
 * with configurable intervention components. The "ground truth" causal model
 * defines how each component (and their interactions) affect learning.
 *
 * Inspired by the PAIR Lab's adaptive tutoring games for children with ASD:
 * - Story game (emotion understanding)
 * - Rocket/House game (perspective-taking)
 * - Train game (sequencing)
 *
 * Reference: Salomons et al., Science Robotics 2018
 */

import type {
  ComponentId,
  Coalition,
  SimulationConfig,
  SimulationResult,
  Trial,
} from './types';
import type { ValueFunction } from './shapley';

/**
 * Ground truth causal model defining component effects
 *
 * Base effects: Direct contribution of each component to learning rate
 * Interaction effects: Synergistic effects when components are combined
 *
 * Key insight: Hints are most effective when difficulty is appropriate.
 * This models the real-world finding that scaffolding works best in the
 * "zone of proximal development" (Vygotsky).
 */
export interface CausalModel {
  baseEffects: Record<ComponentId, number>;
  interactions: {
    components: [ComponentId, ComponentId];
    effect: number;
  }[];
}

/**
 * Default causal model based on HRI tutoring literature
 *
 * Values calibrated to produce realistic learning curves where:
 * - Individual components provide modest gains (0.10-0.20)
 * - Key interactions (hints × difficulty) provide substantial boost
 * - Total gain with all components ≈ 0.8-1.0 skill units over 20 trials
 */
export const DEFAULT_CAUSAL_MODEL: CausalModel = {
  baseEffects: {
    adaptiveDifficulty: 0.18, // Keeps learner in ZPD
    scaffoldedHints: 0.12, // Provides guidance when stuck
    positiveReinforcement: 0.10, // Maintains engagement/motivation
    personalizedContent: 0.08, // Better fit to learner interests
  },
  interactions: [
    // Hints are much more effective when difficulty is appropriate
    // (Can't help if task is too easy or too hard)
    { components: ['scaffoldedHints', 'adaptiveDifficulty'], effect: 0.22 },
    // Reinforcement amplifies the effect of successful hint-taking
    { components: ['positiveReinforcement', 'scaffoldedHints'], effect: 0.08 },
    // Personalized content makes adaptive difficulty more precise
    { components: ['personalizedContent', 'adaptiveDifficulty'], effect: 0.06 },
  ],
};

/**
 * Create a value function from a causal model
 *
 * The value function v(S) computes the expected learning gain for a
 * coalition S of active components. This is the characteristic function
 * in cooperative game theory.
 *
 * @param model - The causal model defining effects and interactions
 * @returns A value function for use in Shapley computation
 */
export function createValueFunction(model: CausalModel): ValueFunction {
  return (coalition: Coalition): number => {
    let value = 0;

    // Add base effects for all components in the coalition
    for (const component of coalition) {
      value += model.baseEffects[component];
    }

    // Add interaction effects where both components are present
    for (const interaction of model.interactions) {
      const [comp1, comp2] = interaction.components;
      if (coalition.has(comp1) && coalition.has(comp2)) {
        value += interaction.effect;
      }
    }

    return value;
  };
}

/**
 * Run a simulation of learner skill progression
 *
 * @param config - Simulation configuration
 * @param model - Causal model (defaults to DEFAULT_CAUSAL_MODEL)
 * @returns Simulation result with trial-by-trial data
 */
export function runSimulation(
  config: SimulationConfig,
  model: CausalModel = DEFAULT_CAUSAL_MODEL
): SimulationResult {
  const { activeComponents, numTrials, initialSkill } = config;
  const valueFunction = createValueFunction(model);
  const coalition = new Set(activeComponents) as Coalition;

  // Learning rate per trial based on active components
  const learningRate = valueFunction(coalition) / numTrials;

  const trials: Trial[] = [];
  let currentSkill = initialSkill;

  for (let i = 0; i < numTrials; i++) {
    // Probability of correct response based on current skill
    // Using a logistic function to model skill-to-performance mapping
    const pCorrect = 1 / (1 + Math.exp(-2 * (currentSkill - 0.5)));

    // Simulate trial outcome with some randomness
    const randomFactor = 0.15 * (Math.random() - 0.5);
    const correct = Math.random() < pCorrect + randomFactor;

    trials.push({
      trialNumber: i + 1,
      skillLevel: currentSkill,
      correct,
      activeComponents: [...activeComponents],
    });

    // Update skill level (learning happens regardless of outcome, but faster with correct)
    const trialGain = correct ? learningRate * 1.2 : learningRate * 0.8;
    currentSkill = Math.min(1.0, currentSkill + trialGain);
  }

  return {
    trials,
    initialSkill,
    finalSkill: currentSkill,
    learningGain: currentSkill - initialSkill,
  };
}

/**
 * Run multiple simulations and average results (for smoother curves)
 *
 * @param config - Simulation configuration
 * @param numRuns - Number of simulation runs to average
 * @param model - Causal model
 * @returns Averaged simulation result
 */
export function runAveragedSimulation(
  config: SimulationConfig,
  numRuns: number = 10,
  model: CausalModel = DEFAULT_CAUSAL_MODEL
): SimulationResult {
  const allResults = Array.from({ length: numRuns }, () =>
    runSimulation(config, model)
  );

  // Average skill levels at each trial
  const avgTrials: Trial[] = config.activeComponents.length > 0
    ? allResults[0].trials.map((_, trialIdx) => {
        const avgSkill =
          allResults.reduce((sum, r) => sum + r.trials[trialIdx].skillLevel, 0) /
          numRuns;
        const correctCount = allResults.filter(
          (r) => r.trials[trialIdx].correct
        ).length;
        return {
          trialNumber: trialIdx + 1,
          skillLevel: avgSkill,
          correct: correctCount > numRuns / 2,
          activeComponents: config.activeComponents,
        };
      })
    : Array.from({ length: config.numTrials }, (_, i) => ({
        trialNumber: i + 1,
        skillLevel: config.initialSkill,
        correct: false,
        activeComponents: [],
      }));

  const avgFinalSkill =
    allResults.reduce((sum, r) => sum + r.finalSkill, 0) / numRuns;

  return {
    trials: avgTrials,
    initialSkill: config.initialSkill,
    finalSkill: avgFinalSkill,
    learningGain: avgFinalSkill - config.initialSkill,
  };
}

/**
 * Get a human-readable insight about the current attribution results
 *
 * @param activeComponents - Currently active components
 * @param shapleyValues - Computed Shapley values
 * @returns An insight string explaining key findings
 */
export function generateInsight(
  activeComponents: ComponentId[],
  shapleyValues: Record<ComponentId, number>
): string {
  if (activeComponents.length === 0) {
    return 'Enable intervention components to see how they contribute to learning gains.';
  }

  if (activeComponents.length === 1) {
    const comp = activeComponents[0];
    const value = shapleyValues[comp];
    return `With only "${formatComponentName(comp)}" active, it accounts for 100% of the ${value.toFixed(2)} learning gain.`;
  }

  // Find the highest-contributing component
  const sorted = activeComponents
    .map((c) => ({ component: c, value: shapleyValues[c] }))
    .sort((a, b) => b.value - a.value);

  const top = sorted[0];
  const total = sorted.reduce((sum, s) => sum + s.value, 0);
  const topPercent = ((top.value / total) * 100).toFixed(0);

  // Check for the key interaction: hints + difficulty
  const hasHints = activeComponents.includes('scaffoldedHints');
  const hasDifficulty = activeComponents.includes('adaptiveDifficulty');

  if (hasHints && hasDifficulty) {
    const hintsValue = shapleyValues['scaffoldedHints'];
    const hintsPercent = ((hintsValue / total) * 100).toFixed(0);
    return `"${formatComponentName(top.component)}" contributes ${topPercent}% of learning gains. Note: "Scaffolded Hints" (${hintsPercent}%) is amplified by "Adaptive Difficulty" — hints are most effective when task difficulty is appropriate.`;
  }

  if (hasHints && !hasDifficulty) {
    return `"${formatComponentName(top.component)}" leads with ${topPercent}%. Try enabling "Adaptive Difficulty" to see how it amplifies the effect of hints.`;
  }

  return `"${formatComponentName(top.component)}" contributes ${topPercent}% of the total ${total.toFixed(2)} learning gain.`;
}

function formatComponentName(component: ComponentId): string {
  const names: Record<ComponentId, string> = {
    adaptiveDifficulty: 'Adaptive Difficulty',
    scaffoldedHints: 'Scaffolded Hints',
    positiveReinforcement: 'Positive Reinforcement',
    personalizedContent: 'Personalized Content',
  };
  return names[component];
}
