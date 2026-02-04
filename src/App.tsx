/**
 * Shapley Attribution Visualizer
 *
 * A simplified demo showing why Shapley values matter for
 * attributing credit in multi-component interventions.
 *
 * Key message: Shapley captures interaction effects that
 * simpler methods (equal-split, marginal) miss.
 */

import { useState } from 'react';
import type { ScenarioId } from './lib/types';
import { SCENARIOS } from './lib/scenarios';
import { ScenarioSelector } from './components/ScenarioSelector';
import { AttributionComparison } from './components/AttributionComparison';
import { InsightPanel } from './components/InsightPanel';
import './App.css';

function App() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('robotPlusAdaptive');

  const scenario = SCENARIOS[selectedScenario];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Shapley Attribution</h1>
        <p className="subtitle">
          Why fair credit assignment matters for social robot interventions
        </p>
      </header>

      <main className="app-main">
        <div className="left-column">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
          />
          <InsightPanel scenario={scenario} />
        </div>

        <div className="right-column">
          <AttributionComparison scenario={scenario} />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          <strong>The problem:</strong> "The impact of the robot cannot be measured
          independently from the game." — Salomons et al., Science Robotics 2018
        </p>
        <p>
          <strong>The solution:</strong> Shapley values decompose the total effect,
          answering: <em>"How much did the robot actually contribute?"</em>
        </p>
      </footer>
    </div>
  );
}

export default App;
