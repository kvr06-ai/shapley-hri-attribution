/**
 * Simplified types for Shapley attribution demo
 *
 * Focus: 3 concrete scenarios showing why Shapley matters
 */

/** The three demo scenarios */
export type ScenarioId = 'robotOnly' | 'robotPlusAdaptive' | 'fullIntervention';

/** Human-readable scenario info */
export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  components: string[];
  totalGain: number;
  /** Attribution under different methods */
  attribution: {
    shapley: Record<string, number>;
    equalSplit: Record<string, number>;
    marginal: Record<string, number>;
  };
  /** Key insight to display */
  insight: string;
}

/** For comparison chart */
export interface AttributionMethod {
  name: string;
  shortName: string;
  description: string;
  values: Record<string, number>;
  problem?: string;
}
