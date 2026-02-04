/**
 * Shapley Value Computation for Intervention Attribution
 *
 * The Shapley value fairly distributes the total "payoff" (learning gain)
 * among all components based on their marginal contributions across all
 * possible orderings of component addition.
 *
 * Formula:
 * φᵢ = Σ [|S|!(n-|S|-1)!/n!] × [v(S ∪ {i}) - v(S)]
 *
 * Where:
 * - φᵢ = Shapley value for component i
 * - S = coalition not containing i
 * - v(S) = value function (expected learning gain) for coalition S
 * - n = total number of components
 *
 * Key Properties:
 * 1. Efficiency: Σφᵢ = v(N) - values sum to total
 * 2. Symmetry: Equal contributors get equal values
 * 3. Null player: Zero contribution → zero value
 * 4. Additivity: Consistent across decomposable games
 */

import type { ComponentId, Coalition, ShapleyResult } from './types';

/** Value function type: maps a coalition to expected learning gain */
export type ValueFunction = (coalition: Coalition) => number;

/**
 * Generate all subsets of a given set
 */
function* powerSet<T>(set: T[]): Generator<T[]> {
  const n = set.length;
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset: T[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(set[i]);
      }
    }
    yield subset;
  }
}

/**
 * Compute factorial (with memoization for efficiency)
 */
const factorialCache: Map<number, number> = new Map();
function factorial(n: number): number {
  if (n <= 1) return 1;
  if (factorialCache.has(n)) return factorialCache.get(n)!;
  const result = n * factorial(n - 1);
  factorialCache.set(n, result);
  return result;
}

/**
 * Compute Shapley value for a single component
 *
 * @param component - The component to compute Shapley value for
 * @param allComponents - All components in the game
 * @param valueFunction - Function mapping coalitions to values
 * @returns Shapley value for the component
 */
function computeShapleyForComponent(
  component: ComponentId,
  allComponents: ComponentId[],
  valueFunction: ValueFunction
): number {
  const n = allComponents.length;
  const othersWithoutComponent = allComponents.filter((c) => c !== component);
  let shapleyValue = 0;

  // Iterate over all coalitions S that don't contain the component
  for (const subset of powerSet(othersWithoutComponent)) {
    const s = subset.length;

    // Compute the weighting factor: |S|!(n-|S|-1)!/n!
    const weight = (factorial(s) * factorial(n - s - 1)) / factorial(n);

    // Compute marginal contribution: v(S ∪ {i}) - v(S)
    const coalitionWithout = new Set(subset) as Coalition;
    const coalitionWith = new Set([...subset, component]) as Coalition;

    const marginalContribution =
      valueFunction(coalitionWith) - valueFunction(coalitionWithout);

    shapleyValue += weight * marginalContribution;
  }

  return shapleyValue;
}

/**
 * Compute Shapley values for all components
 *
 * @param activeComponents - Components to include in computation
 * @param valueFunction - Function mapping coalitions to values
 * @returns ShapleyResult with values for each component
 */
export function computeShapleyValues(
  activeComponents: ComponentId[],
  valueFunction: ValueFunction
): ShapleyResult {
  const values: Record<ComponentId, number> = {
    robotEngagement: 0,
    adaptiveDifficulty: 0,
    caregiverInvolvement: 0,
    gameScaffolding: 0,
  };

  // Compute Shapley value for each active component
  for (const component of activeComponents) {
    values[component] = computeShapleyForComponent(
      component,
      activeComponents,
      valueFunction
    );
  }

  // Total value is v(N) - value of grand coalition
  const grandCoalition = new Set(activeComponents) as Coalition;
  const totalValue = valueFunction(grandCoalition);

  // Sum of individual base effects (without interactions)
  const sumOfIndividualEffects = activeComponents.reduce((sum, comp) => {
    const singleton = new Set([comp]) as Coalition;
    return sum + valueFunction(singleton);
  }, 0);

  // Interaction value = total - sum of individual effects
  const interactionValue = totalValue - sumOfIndividualEffects;

  return {
    values,
    totalValue,
    interactionValue,
  };
}

/**
 * Verify the efficiency axiom: Shapley values should sum to total value
 * This is useful for testing correctness of the implementation
 */
export function verifyEfficiencyAxiom(result: ShapleyResult): boolean {
  const sumOfShapley = Object.values(result.values).reduce((a, b) => a + b, 0);
  const epsilon = 1e-10; // Floating point tolerance
  return Math.abs(sumOfShapley - result.totalValue) < epsilon;
}

/**
 * Get all coalitions for a set of components (useful for visualization)
 */
export function getAllCoalitions(components: ComponentId[]): Coalition[] {
  const coalitions: Coalition[] = [];
  for (const subset of powerSet(components)) {
    coalitions.push(new Set(subset) as Coalition);
  }
  return coalitions;
}

/**
 * Format a coalition as a readable string
 */
export function formatCoalition(coalition: Coalition): string {
  if (coalition.size === 0) return '∅ (empty)';
  return Array.from(coalition)
    .map((c) => c.charAt(0).toUpperCase())
    .join('+');
}
