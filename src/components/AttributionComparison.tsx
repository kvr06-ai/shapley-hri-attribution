/**
 * Attribution Comparison Component
 *
 * Shows side-by-side comparison of three attribution methods:
 * - Shapley (fair, accounts for interactions)
 * - Equal Split (naive 1/n)
 * - Marginal (order-dependent)
 *
 * This is the "aha" moment of the demo.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Scenario } from '../lib/types';

interface AttributionComparisonProps {
  scenario: Scenario;
}

// Colors for each component
const COMPONENT_COLORS: Record<string, string> = {
  Robot: '#F472B6',
  'Adaptive Tasks': '#60A5FA',
  Parent: '#FBBF24',
};

// Method colors for the grouped bars
const METHOD_COLORS = {
  shapley: '#34D399',    // Green - the "good" one
  equalSplit: '#9CA3AF', // Gray
  marginal: '#F87171',   // Red - problematic
};

export function AttributionComparison({ scenario }: AttributionComparisonProps) {
  const { components, attribution, totalGain } = scenario;

  // Transform data for grouped bar chart
  // Each component becomes a group with 3 bars (one per method)
  const chartData = components.map((component) => ({
    component,
    Shapley: attribution.shapley[component] || 0,
    'Equal Split': attribution.equalSplit[component] || 0,
    Marginal: attribution.marginal[component] || 0,
  }));

  // Calculate percentages for the table
  const getPercent = (value: number) => ((value / totalGain) * 100).toFixed(0);

  return (
    <div className="attribution-comparison">
      <h2>Attribution Comparison</h2>
      <p className="total-gain">
        Total Skill Gain: <strong>+{(totalGain * 100).toFixed(0)}%</strong>
      </p>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="component"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [
                  `${(numValue * 100).toFixed(1)}% (${getPercent(numValue)}% of total)`,
                  name,
                ];
              }}
            />
            <Legend />
            <Bar dataKey="Shapley" fill={METHOD_COLORS.shapley} />
            <Bar dataKey="Equal Split" fill={METHOD_COLORS.equalSplit} />
            <Bar dataKey="Marginal" fill={METHOD_COLORS.marginal} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Method</th>
              {components.map((c) => (
                <th key={c}>
                  <span
                    className="component-dot"
                    style={{ backgroundColor: COMPONENT_COLORS[c] }}
                  />
                  {c}
                </th>
              ))}
              <th>Issue</th>
            </tr>
          </thead>
          <tbody>
            <tr className="method-shapley">
              <td>
                <strong>Shapley</strong>
              </td>
              {components.map((c) => (
                <td key={c}>{getPercent(attribution.shapley[c])}%</td>
              ))}
              <td className="issue good">Fair attribution</td>
            </tr>
            <tr className="method-equal">
              <td>Equal Split</td>
              {components.map((c) => (
                <td key={c}>{getPercent(attribution.equalSplit[c])}%</td>
              ))}
              <td className="issue">Ignores interactions</td>
            </tr>
            <tr className="method-marginal">
              <td>Marginal</td>
              {components.map((c) => (
                <td key={c}>{getPercent(attribution.marginal[c])}%</td>
              ))}
              <td className="issue">Order-dependent</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
