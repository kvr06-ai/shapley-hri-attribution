/**
 * Action Timeline Component
 *
 * Shows Shapley values for each action across the intervention.
 * Key visual: Bar chart with days on X-axis, Shapley contribution on Y-axis.
 * Highlights the key insight: early actions can have high causal impact.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { Action } from '../lib/types';
import { ACTION_SHORT_LABELS } from '../lib/types';

interface ActionTimelineProps {
  actions: Action[];
  highlightDay?: number;
}

// Color scale: positive = green, negative = red, near-zero = gray
function getBarColor(value: number): string {
  if (value >= 0.08) return '#10B981'; // Strong positive - emerald
  if (value >= 0.04) return '#34D399'; // Moderate positive - green
  if (value > 0) return '#6EE7B7';     // Weak positive - light green
  if (value < -0.01) return '#F87171'; // Negative - red
  return '#9CA3AF';                     // Near zero - gray
}

export function ActionTimeline({ actions, highlightDay }: ActionTimelineProps) {
  // Transform data for chart
  const chartData = actions.map((action) => ({
    day: `D${action.day}`,
    dayNum: action.day,
    shapley: action.shapleyValue,
    label: ACTION_SHORT_LABELS[action.type],
    context: action.context,
    fullLabel: `Day ${action.day}: ${ACTION_SHORT_LABELS[action.type]}`,
  }));

  return (
    <div className="action-timeline">
      <h2>Shapley Attribution by Action</h2>
      <p className="panel-description">
        Each bar shows the causal contribution of that day's action to the final outcome.
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="day"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              interval={0}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              domain={[-0.05, 0.15]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '0.85rem',
              }}
              formatter={(value) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [`${(numValue * 100).toFixed(1)}% contribution`, 'Shapley Value'];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.fullLabel}\n${data.context || ''}`;
                }
                return label;
              }}
            />
            <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
            <Bar dataKey="shapley" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.shapley)}
                  stroke={entry.dayNum === highlightDay ? '#FBBF24' : 'none'}
                  strokeWidth={entry.dayNum === highlightDay ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Action type legend below chart */}
      <div className="action-legend">
        {actions.map((action) => (
          <div key={action.day} className="legend-item">
            <span className="legend-day">D{action.day}</span>
            <span className="legend-type">{ACTION_SHORT_LABELS[action.type]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
