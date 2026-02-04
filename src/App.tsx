/**
 * Shapley Attribution Visualizer (Action-Level)
 *
 * Demonstrates why Shapley values matter for identifying
 * which specific robot actions caused the observed improvement.
 *
 * Key insight: RL temporal decay methods miss early high-impact actions.
 */

import { useState } from 'react';
import { InterventionSummary } from './components/InterventionSummary';
import { ActionTimeline } from './components/ActionTimeline';
import { RLComparison } from './components/RLComparison';
import { InsightPanel } from './components/InsightPanel';
import {
  INTERVENTION_ACTIONS,
  INTERVENTION_SUMMARY,
  KEY_INSIGHTS,
} from './lib/interventionData';
import './App.css';

function App() {
  const [highlightDay, setHighlightDay] = useState<number | undefined>();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Action-Level Shapley Attribution</h1>
        <p className="subtitle">
          Which robot actions actually caused the improvement?
        </p>
      </header>

      <main className="app-main">
        <div className="top-row">
          <InterventionSummary summary={INTERVENTION_SUMMARY} />
        </div>

        <div className="middle-row">
          <ActionTimeline
            actions={INTERVENTION_ACTIONS}
            highlightDay={highlightDay}
          />
        </div>

        <div className="bottom-row">
          <RLComparison actions={INTERVENTION_ACTIONS} />
          <InsightPanel
            insights={KEY_INSIGHTS}
            onHighlightDay={setHighlightDay}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          <strong>The problem:</strong> RL temporal decay assigns 21% credit to the
          final action (Day 15) and only 2% to the pivotal Day 3 encouragement.
        </p>
        <p>
          <strong>The solution:</strong> Shapley values correctly identify Day 3 as
          the turning point (+12%), revealing that timing ≠ causation.
        </p>
      </footer>
    </div>
  );
}

export default App;
