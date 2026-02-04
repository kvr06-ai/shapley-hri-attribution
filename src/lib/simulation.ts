/**
 * Simulation Engine for Social Robot Intervention
 *
 * Models a child with ASD progressing through social skills games
 * (Story, Rocket, Train) with a social robot companion.
 *
 * The "ground truth" causal model defines how each intervention component
 * (and their interactions) affect social skill acquisition.
 *
 * Based on PAIR Lab research:
 * - Salomons et al., Science Robotics 2018 (30-day in-home deployment)
 * - Triadic interactions: Robot + Child + Caregiver
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
 * Base effects: Direct contribution of each component to skill acquisition
 * Interaction effects: Synergistic effects when components are combined
 */
export interface CausalModel {
  baseEffects: Record<ComponentId, number>;
  interactions: {
    components: [ComponentId, ComponentId];
    effect: number;
  }[];
}

/**
 * Default causal model for social robot ASD intervention
 *
 * Key insight from Salomons et al. 2018:
 * "The impact of the robot cannot be measured independently from the game"
 *
 * This model captures potential interaction effects that would allow
 * us to decompose the robot's contribution from other factors.
 *
 * Values calibrated to produce realistic learning curves where:
 * - Robot engagement alone provides moderate gains
 * - Key interactions (robot × difficulty, robot × caregiver) show synergy
 * - Total gain with all components ≈ 0.8-1.0 skill units over 30 sessions
 */
export const DEFAULT_CAUSAL_MODEL: CausalModel = {
  baseEffects: {
    robotEngagement: 0.15, // Robot's social attention and encouragement
    adaptiveDifficulty: 0.18, // BKT-driven task adjustment (25%/75% thresholds)
    caregiverInvolvement: 0.10, // Parent participation in triadic interaction
    gameScaffolding: 0.12, // Graduated hints within games
  },
  interactions: [
    // Robot engagement is most effective when difficulty is appropriate
    // (Mirrors ZPD - robot support matters most at the learning edge)
    { components: ['robotEngagement', 'adaptiveDifficulty'], effect: 0.20 },
    // Triadic synergy: Robot + Caregiver together amplify each other
    // (Child sees consistent social modeling from both)
    { components: ['robotEngagement', 'caregiverInvolvement'], effect: 0.12 },
    // Game scaffolding works better when difficulty is calibrated
    { components: ['gameScaffolding', 'adaptiveDifficulty'], effect: 0.08 },
  ],
};

/**
 * Create a value function from a causal model
 *
 * The value function v(S) computes the expected skill gain for a
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
 * Run a simulation of child skill progression
 *
 * @param config - Simulation configuration
 * @param model - Causal model (defaults to DEFAULT_CAUSAL_MODEL)
 * @returns Simulation result with session-by-session data
 */
export function runSimulation(
  config: SimulationConfig,
  model: CausalModel = DEFAULT_CAUSAL_MODEL
): SimulationResult {
  const { activeComponents, numTrials, initialSkill } = config;
  const valueFunction = createValueFunction(model);
  const coalition = new Set(activeComponents) as Coalition;

  // Learning rate per session based on active components
  const learningRate = valueFunction(coalition) / numTrials;

  const trials: Trial[] = [];
  let currentSkill = initialSkill;

  for (let i = 0; i < numTrials; i++) {
    // Probability of successful skill demonstration based on current level
    const pCorrect = 1 / (1 + Math.exp(-2 * (currentSkill - 0.5)));

    // Simulate session outcome with some variability
    const randomFactor = 0.15 * (Math.random() - 0.5);
    const correct = Math.random() < pCorrect + randomFactor;

    trials.push({
      trialNumber: i + 1,
      skillLevel: currentSkill,
      correct,
      activeComponents: [...activeComponents],
    });

    // Update skill level
    const sessionGain = correct ? learningRate * 1.2 : learningRate * 0.8;
    currentSkill = Math.min(1.0, currentSkill + sessionGain);
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

  // Average skill levels at each session
  const avgTrials: Trial[] =
    config.activeComponents.length > 0
      ? allResults[0].trials.map((_, trialIdx) => {
          const avgSkill =
            allResults.reduce(
              (sum, r) => sum + r.trials[trialIdx].skillLevel,
              0
            ) / numRuns;
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
 * Generate a human-readable insight about the attribution results
 *
 * Highlights key findings relevant to HRI research questions:
 * - How much did the robot contribute vs. other factors?
 * - What interaction effects are present?
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
    return 'Enable intervention components to see how they contribute to social skill gains. Try the robot + adaptive difficulty combination to see interaction effects.';
  }

  if (activeComponents.length === 1) {
    const comp = activeComponents[0];
    const value = shapleyValues[comp];
    return `With only "${formatComponentName(comp)}" active, it accounts for 100% of the ${value.toFixed(2)} skill gain. Enable additional components to see interaction effects.`;
  }

  // Find the highest-contributing component
  const sorted = activeComponents
    .map((c) => ({ component: c, value: shapleyValues[c] }))
    .sort((a, b) => b.value - a.value);

  const top = sorted[0];
  const total = sorted.reduce((sum, s) => sum + s.value, 0);
  const topPercent = ((top.value / total) * 100).toFixed(0);

  // Check for key HRI interactions
  const hasRobot = activeComponents.includes('robotEngagement');
  const hasDifficulty = activeComponents.includes('adaptiveDifficulty');
  const hasCaregiver = activeComponents.includes('caregiverInvolvement');

  // Robot + Difficulty interaction
  if (hasRobot && hasDifficulty) {
    const robotValue = shapleyValues['robotEngagement'];
    const robotPercent = ((robotValue / total) * 100).toFixed(0);

    if (hasCaregiver) {
      return `This triadic configuration shows strong synergy. "Robot Social Engagement" contributes ${robotPercent}% — amplified by both adaptive difficulty and caregiver involvement. This answers: "The robot accounts for ${robotPercent}% of the observed gains."`;
    }

    return `"${formatComponentName(top.component)}" contributes ${topPercent}% of skill gains. Note: Robot engagement (${robotPercent}%) is amplified when adaptive difficulty keeps the child in their zone of proximal development.`;
  }

  // Robot + Caregiver (triadic) without difficulty
  if (hasRobot && hasCaregiver && !hasDifficulty) {
    const robotValue = shapleyValues['robotEngagement'];
    const robotPercent = ((robotValue / total) * 100).toFixed(0);
    return `Triadic interaction active: Robot (${robotPercent}%) and caregiver show synergy. Try adding "Adaptive Difficulty" to see the full intervention effect.`;
  }

  // Robot alone with other components
  if (hasRobot) {
    const robotValue = shapleyValues['robotEngagement'];
    const robotPercent = ((robotValue / total) * 100).toFixed(0);
    return `"Robot Social Engagement" contributes ${robotPercent}% of the total ${total.toFixed(2)} skill gain. This quantifies the robot's independent causal contribution.`;
  }

  // No robot - suggest adding it
  if (!hasRobot) {
    return `"${formatComponentName(top.component)}" leads with ${topPercent}%. Enable "Robot Social Engagement" to see how the robot's contribution compares to other factors.`;
  }

  return `"${formatComponentName(top.component)}" contributes ${topPercent}% of the total ${total.toFixed(2)} skill gain.`;
}

function formatComponentName(component: ComponentId): string {
  const names: Record<ComponentId, string> = {
    robotEngagement: 'Robot Social Engagement',
    adaptiveDifficulty: 'Adaptive Difficulty',
    caregiverInvolvement: 'Caregiver Involvement',
    gameScaffolding: 'Game Scaffolding',
  };
  return names[component];
}
