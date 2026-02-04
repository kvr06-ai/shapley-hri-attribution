/**
 * Insight Panel Component
 *
 * Displays the key takeaway for the selected scenario.
 * This is the "so what?" that ties everything together.
 */

import type { Scenario } from '../lib/types';

interface InsightPanelProps {
  scenario: Scenario;
}

export function InsightPanel({ scenario }: InsightPanelProps) {
  return (
    <div className="insight-panel">
      <h2>Key Insight</h2>
      <p className="insight-text">{scenario.insight}</p>

      {scenario.id === 'robotPlusAdaptive' && (
        <div className="insight-highlight">
          <span className="highlight-label">The interaction effect:</span>
          <p>
            Robot effectiveness <em>increases</em> when combined with skill-matched tasks.
            Shapley captures this synergy. Equal-split misses it.
          </p>
        </div>
      )}

      {scenario.id === 'fullIntervention' && (
        <div className="insight-highlight">
          <span className="highlight-label">Clinical interpretation:</span>
          <p>
            "The robot accounted for <strong>36%</strong> of Johnny's improvement
            in emotion recognition." — The signal needed to optimize interventions.
          </p>
        </div>
      )}
    </div>
  );
}
