/**
 * Scenario Selector Component
 *
 * Three buttons to select predefined intervention scenarios.
 * Replaces the old checkbox-based component toggles.
 */

import type { ScenarioId } from '../lib/types';
import { SCENARIOS, SCENARIO_ORDER } from '../lib/scenarios';

interface ScenarioSelectorProps {
  selectedScenario: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
}

export function ScenarioSelector({
  selectedScenario,
  onSelectScenario,
}: ScenarioSelectorProps) {
  return (
    <div className="scenario-selector">
      <h2>Intervention Scenario</h2>
      <p className="panel-description">
        Select a scenario to see how different attribution methods assign credit.
      </p>

      <div className="scenario-buttons">
        {SCENARIO_ORDER.map((id, index) => {
          const scenario = SCENARIOS[id];
          const isSelected = selectedScenario === id;
          const letter = String.fromCharCode(65 + index); // A, B, C

          return (
            <button
              key={id}
              className={`scenario-button ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectScenario(id)}
            >
              <span className="scenario-letter">{letter}</span>
              <div className="scenario-info">
                <span className="scenario-title">{scenario.title}</span>
                <span className="scenario-components">
                  {scenario.components.join(' + ')}
                </span>
              </div>
              <span className="scenario-gain">+{(scenario.totalGain * 100).toFixed(0)}%</span>
            </button>
          );
        })}
      </div>

      <div className="selected-scenario-detail">
        <p>{SCENARIOS[selectedScenario].description}</p>
      </div>
    </div>
  );
}
