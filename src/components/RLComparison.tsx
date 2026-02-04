/**
 * RL Comparison Component
 *
 * Shows side-by-side comparison of Shapley vs RL temporal decay.
 * This is the "aha" moment: RL attributes most credit to recent actions,
 * while Shapley correctly identifies the key early intervention.
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
import type { Action } from '../lib/types';

interface RLComparisonProps {
  actions: Action[];
}

export function RLComparison({ actions }: RLComparisonProps) {
  // Transform data for grouped bar chart
  const chartData = actions.map((action) => ({
    day: `D${action.day}`,
    Shapley: action.shapleyValue,
    'RL Credit': action.rlCredit,
  }));

  // Find the key contrasts
  const shapleyTop = [...actions].sort((a, b) => b.shapleyValue - a.shapleyValue)[0];
  const rlTop = [...actions].sort((a, b) => b.rlCredit - a.rlCredit)[0];

  return (
    <div className="rl-comparison">
      <h2>Shapley vs RL Temporal Decay</h2>
      <p className="panel-description">
        RL methods (GAE/TD) use temporal decay: recent actions get more credit.
        Shapley identifies actual causal impact regardless of timing.
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="day"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              interval={0}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#F9FAFB',
              }}
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [`${(numValue * 100).toFixed(1)}%`, name];
              }}
            />
            <Legend />
            <Bar dataKey="Shapley" fill="#34D399" radius={[2, 2, 0, 0]} />
            <Bar dataKey="RL Credit" fill="#F87171" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key contrast callout */}
      <div className="contrast-callout">
        <div className="contrast-item shapley">
          <span className="contrast-label">Shapley says:</span>
          <span className="contrast-value">
            Day {shapleyTop.day} most impactful ({(shapleyTop.shapleyValue * 100).toFixed(0)}%)
          </span>
        </div>
        <div className="contrast-item rl">
          <span className="contrast-label">RL says:</span>
          <span className="contrast-value">
            Day {rlTop.day} most impactful ({(rlTop.rlCredit * 100).toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
