/**
 * Shapley Attribution Visualizer
 *
 * An interactive demo for visualizing how Shapley values decompose
 * multi-component intervention effects into per-component causal contributions.
 *
 * Context: PhD interview presentation for Imperial College London (PAIR Lab)
 * Research Focus: Causal credit assignment in human-robot interaction
 */

import { useState, useCallback } from 'react';
import type { ComponentId, ShapleyResult, SimulationResult } from './lib/types';
import { computeShapleyValues } from './lib/shapley';
import {
  createValueFunction,
  DEFAULT_CAUSAL_MODEL,
  runAveragedSimulation,
  generateInsight,
} from './lib/simulation';
import { ControlPanel } from './components/ControlPanel';
import { LearningCurve } from './components/LearningCurve';
import { ShapleyChart } from './components/ShapleyChart';
import { InsightPanel } from './components/InsightPanel';
import './App.css';

function App() {
  const [activeComponents, setActiveComponents] = useState<ComponentId[]>([
    'adaptiveDifficulty',
    'scaffoldedHints',
  ]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [shapleyResult, setShapleyResult] = useState<ShapleyResult | null>(null);
  const [insight, setInsight] = useState<string>(
    'Enable intervention components and run a simulation to see how Shapley values decompose the learning gains.'
  );
  const [isRunning, setIsRunning] = useState(false);

  const handleToggleComponent = useCallback((component: ComponentId) => {
    setActiveComponents((prev) =>
      prev.includes(component)
        ? prev.filter((c) => c !== component)
        : [...prev, component]
    );
  }, []);

  const handleRunSimulation = useCallback(() => {
    if (activeComponents.length === 0) return;

    setIsRunning(true);

    // Small delay to show loading state
    setTimeout(() => {
      // Run simulation
      const simResult = runAveragedSimulation({
        activeComponents,
        numTrials: 20,
        initialSkill: 0.2,
      });

      // Compute Shapley values
      const valueFunction = createValueFunction(DEFAULT_CAUSAL_MODEL);
      const shapley = computeShapleyValues(activeComponents, valueFunction);

      // Generate insight
      const insightText = generateInsight(activeComponents, shapley.values);

      setSimulationResult(simResult);
      setShapleyResult(shapley);
      setInsight(insightText);
      setIsRunning(false);
    }, 300);
  }, [activeComponents]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Shapley Attribution Visualizer</h1>
        <p className="subtitle">
          Causal Credit Assignment for Adaptive HRI Interventions
        </p>
      </header>

      <main className="app-main">
        <div className="left-column">
          <ControlPanel
            activeComponents={activeComponents}
            onToggleComponent={handleToggleComponent}
            onRunSimulation={handleRunSimulation}
            isRunning={isRunning}
          />
          <InsightPanel insight={insight} />
        </div>

        <div className="right-column">
          <LearningCurve result={simulationResult} />
          <ShapleyChart
            result={shapleyResult}
            activeComponents={activeComponents}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          <strong>Scientific Context:</strong> This demo addresses the attribution
          gap identified in Salomons et al. (Science Robotics, 2018): "The impact
          of the robot cannot be measured independently from the game."
        </p>
        <p>
          Shapley values provide a principled way to decompose intervention effects,
          answering: <em>"Which components drove the observed learning gains?"</em>
        </p>
      </footer>
    </div>
  );
}

export default App;
