/**
 * Learning Curve Component
 *
 * Displays the learner's skill progression over trials using a line chart.
 * Visualizes how the combination of active components affects learning rate.
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { SimulationResult } from '../lib/types';

interface LearningCurveProps {
  result: SimulationResult | null;
}

export function LearningCurve({ result }: LearningCurveProps) {
  if (!result) {
    return (
      <div className="chart-panel learning-curve">
        <h2>Learning Curve</h2>
        <div className="chart-placeholder">
          <p>Run a simulation to see the learning curve.</p>
        </div>
      </div>
    );
  }

  const data = result.trials.map((trial) => ({
    trial: trial.trialNumber,
    skill: trial.skillLevel,
  }));

  return (
    <div className="chart-panel learning-curve">
      <h2>Learning Curve</h2>
      <div className="chart-stats">
        <span>
          Initial: <strong>{result.initialSkill.toFixed(2)}</strong>
        </span>
        <span>
          Final: <strong>{result.finalSkill.toFixed(2)}</strong>
        </span>
        <span>
          Gain: <strong>+{result.learningGain.toFixed(2)}</strong>
        </span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="trial"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              label={{
                value: 'Trial',
                position: 'insideBottomRight',
                offset: -5,
                fill: '#9CA3AF',
              }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              label={{
                value: 'Skill Level',
                angle: -90,
                position: 'insideLeft',
                fill: '#9CA3AF',
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F9FAFB' }}
              itemStyle={{ color: '#60A5FA' }}
              formatter={(value) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [numValue.toFixed(3), 'Skill'];
              }}
              labelFormatter={(label) => `Trial ${label}`}
            />
            <ReferenceLine
              y={result.initialSkill}
              stroke="#6B7280"
              strokeDasharray="5 5"
              label={{
                value: 'Initial',
                position: 'right',
                fill: '#6B7280',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="skill"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#60A5FA' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
