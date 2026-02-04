/**
 * Insight Panel Component (Action-Level)
 *
 * Displays key insights from the Shapley analysis.
 * Highlights the actions with surprising/important attributions.
 */

import type { ActionInsight } from '../lib/types';
import { ACTION_LABELS } from '../lib/types';

interface InsightPanelProps {
  insights: ActionInsight[];
  onHighlightDay?: (day: number | undefined) => void;
}

export function InsightPanel({ insights, onHighlightDay }: InsightPanelProps) {
  return (
    <div className="insight-panel">
      <h2>Key Findings</h2>

      {insights.map((insight) => (
        <div
          key={insight.day}
          className={`insight-item ${insight.shapleyValue < 0 ? 'negative' : 'positive'}`}
          onMouseEnter={() => onHighlightDay?.(insight.day)}
          onMouseLeave={() => onHighlightDay?.(undefined)}
        >
          <div className="insight-header">
            <span className="insight-day">Day {insight.day}</span>
            <span className="insight-action">{ACTION_LABELS[insight.type]}</span>
            <span
              className={`insight-value ${insight.shapleyValue >= 0 ? 'positive' : 'negative'}`}
            >
              {insight.shapleyValue >= 0 ? '+' : ''}
              {(insight.shapleyValue * 100).toFixed(0)}%
            </span>
          </div>
          <p className="insight-explanation">{insight.explanation}</p>
        </div>
      ))}

      <div className="insight-takeaway">
        <span className="takeaway-label">The Takeaway</span>
        <p>
          Shapley attribution reveals that <strong>timing alone doesn't determine impact</strong>.
          Early actions can be decisive, and recent actions can be harmful—patterns that
          RL temporal decay methods systematically miss.
        </p>
      </div>
    </div>
  );
}
