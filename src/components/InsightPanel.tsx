/**
 * Insight Panel Component
 *
 * Displays dynamic insights about the current attribution results.
 * Highlights key findings like interaction effects and dominant contributors.
 */

interface InsightPanelProps {
  insight: string;
  showMathDetails?: boolean;
}

export function InsightPanel({ insight, showMathDetails = false }: InsightPanelProps) {
  return (
    <div className="insight-panel">
      <h2>Key Insight</h2>
      <p className="insight-text">{insight}</p>

      {showMathDetails && (
        <div className="math-details">
          <h3>Shapley Value Formula</h3>
          <div className="formula">
            φᵢ = Σ<sub>S⊆N\{`{i}`}</sub>{' '}
            <span className="fraction">
              <span className="numerator">|S|!(n-|S|-1)!</span>
              <span className="denominator">n!</span>
            </span>
            × [v(S ∪ {`{i}`}) - v(S)]
          </div>
          <p className="formula-explanation">
            The Shapley value φᵢ for component i is computed by averaging its
            marginal contribution v(S ∪ {`{i}`}) - v(S) across all possible
            coalitions S, weighted by the probability of that coalition forming.
          </p>
        </div>
      )}
    </div>
  );
}
