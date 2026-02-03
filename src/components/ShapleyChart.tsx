/**
 * Shapley Attribution Chart Component
 *
 * Displays a horizontal bar chart showing the Shapley value for each
 * intervention component. This visualizes the causal credit assignment
 * that answers: "Which components drove the learning gains?"
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ShapleyResult, ComponentId } from '../lib/types';
import { COMPONENT_LABELS } from '../lib/types';

interface ShapleyChartProps {
  result: ShapleyResult | null;
  activeComponents: ComponentId[];
}

// Color palette for components
const COMPONENT_COLORS: Record<ComponentId, string> = {
  adaptiveDifficulty: '#60A5FA', // Blue
  scaffoldedHints: '#34D399', // Green
  positiveReinforcement: '#FBBF24', // Yellow
  personalizedContent: '#A78BFA', // Purple
};

export function ShapleyChart({ result, activeComponents }: ShapleyChartProps) {
  if (!result || activeComponents.length === 0) {
    return (
      <div className="chart-panel shapley-chart">
        <h2>Shapley Attribution</h2>
        <div className="chart-placeholder">
          <p>Run a simulation to see component attributions.</p>
        </div>
      </div>
    );
  }

  // Prepare data for the chart
  const data = activeComponents
    .map((component) => ({
      component,
      name: COMPONENT_LABELS[component],
      value: result.values[component],
      percentage: (result.values[component] / result.totalValue) * 100,
      color: COMPONENT_COLORS[component],
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="chart-panel shapley-chart">
      <h2>Shapley Attribution</h2>
      <div className="chart-stats">
        <span>
          Total Gain: <strong>{result.totalValue.toFixed(2)}</strong>
        </span>
        <span>
          Interaction Effect: <strong>{result.interactionValue.toFixed(2)}</strong>
          {result.interactionValue > 0 && (
            <span className="interaction-note"> (synergy)</span>
          )}
        </span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              domain={[0, 'auto']}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F9FAFB' }}
              formatter={(value, _name, props) => {
                const numValue = typeof value === 'number' ? value : 0;
                const percentage = props?.payload?.percentage ?? 0;
                return [`${numValue.toFixed(3)} (${percentage.toFixed(1)}%)`, 'Attribution'];
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={entry.component} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="shapley-legend">
        {data.map((item) => (
          <div key={item.component} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">{item.name}</span>
            <span className="legend-value">
              {item.value.toFixed(2)} ({item.percentage.toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
