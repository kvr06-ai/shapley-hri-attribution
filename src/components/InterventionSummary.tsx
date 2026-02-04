/**
 * Intervention Summary Component
 *
 * Shows the overall intervention details and outcome.
 * Sets the context for the attribution analysis.
 */

import type { InterventionSummary as SummaryType } from '../lib/types';

interface InterventionSummaryProps {
  summary: SummaryType;
}

export function InterventionSummary({ summary }: InterventionSummaryProps) {
  return (
    <div className="intervention-summary">
      <h2>The Intervention</h2>
      <p className="panel-description">
        A social robot worked with a child over {summary.totalDays} days.
        The question: <em>Which actions actually caused the improvement?</em>
      </p>

      <div className="summary-stats">
        <div className="stat">
          <span className="stat-value">{summary.totalDays}</span>
          <span className="stat-label">Days</span>
        </div>
        <div className="stat">
          <span className="stat-value">{summary.totalActions}</span>
          <span className="stat-label">Actions</span>
        </div>
        <div className="stat outcome">
          <span className="stat-value">+{(summary.outcomeImprovement * 100).toFixed(0)}%</span>
          <span className="stat-label">{summary.outcomeMeasure}</span>
        </div>
      </div>

      <p className="summary-context">
        Each day, the robot performed one primary action: playing games,
        giving encouragement, adjusting difficulty, or prompting the caregiver.
      </p>
    </div>
  );
}
