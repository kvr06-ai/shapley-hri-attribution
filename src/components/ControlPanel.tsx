/**
 * Control Panel Component
 *
 * Allows users to toggle intervention components on/off and run simulations.
 * Each toggle represents a component of the adaptive tutoring intervention.
 */

import type { ComponentId } from '../lib/types';
import {
  ALL_COMPONENTS,
  COMPONENT_LABELS,
  COMPONENT_DESCRIPTIONS,
} from '../lib/types';

interface ControlPanelProps {
  activeComponents: ComponentId[];
  onToggleComponent: (component: ComponentId) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export function ControlPanel({
  activeComponents,
  onToggleComponent,
  onRunSimulation,
  isRunning,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h2>Intervention Components</h2>
      <p className="panel-description">
        Toggle components of the social robot ASD intervention.
        Shapley values show each component's causal contribution to skill gains.
      </p>

      <div className="component-toggles">
        {ALL_COMPONENTS.map((component) => (
          <label key={component} className="component-toggle">
            <input
              type="checkbox"
              checked={activeComponents.includes(component)}
              onChange={() => onToggleComponent(component)}
            />
            <div className="toggle-content">
              <span className="toggle-label">{COMPONENT_LABELS[component]}</span>
              <span className="toggle-description">
                {COMPONENT_DESCRIPTIONS[component]}
              </span>
            </div>
          </label>
        ))}
      </div>

      <button
        className="run-button"
        onClick={onRunSimulation}
        disabled={isRunning || activeComponents.length === 0}
      >
        {isRunning ? 'Running...' : 'Run Simulation'}
      </button>

      {activeComponents.length === 0 && (
        <p className="hint-text">
          Select at least one component to run a simulation.
        </p>
      )}
    </div>
  );
}
