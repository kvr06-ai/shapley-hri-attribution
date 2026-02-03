# Shapley Attribution Visualizer

**Causal Credit Assignment for Adaptive Human-Robot Interaction Interventions**

> An interactive demo visualizing how Shapley values decompose multi-component intervention effects into per-component causal contributions.

[**Live Demo**](https://kvr06-ai.github.io/shapley-hri-attribution/)

---

## Scientific Context

### The Attribution Gap

In adaptive interventions combining multiple components (robot presence, adaptive difficulty, scaffolded hints, etc.), a fundamental question remains:

> *"Which specific components of the intervention drove the observed gains?"*

This challenge is explicitly identified in Salomons et al. (Science Robotics, 2018):

> "The impact of the robot cannot be measured independently from the game... future work should address which specific components of the intervention drove the observed gains."

### Shapley Values as a Solution

Shapley values (from cooperative game theory) provide a principled approach to this attribution problem. For each component *i*, the Shapley value φᵢ represents its **fair share** of the total outcome, computed by averaging its marginal contribution across all possible orderings of component addition:

```
φᵢ = Σ [|S|!(n-|S|-1)!/n!] × [v(S ∪ {i}) - v(S)]
```

**Key Properties:**
1. **Efficiency** — Values sum to total effect (nothing lost or double-counted)
2. **Symmetry** — Equal contributors receive equal attribution
3. **Null Player** — Zero contribution → zero attribution
4. **Handles Interactions** — Non-additive effects are captured (e.g., "hints only work when difficulty is appropriate")

---

## How to Interpret the Demo

### Intervention Components

The demo models four intervention components inspired by adaptive tutoring research:

| Component | Description |
|-----------|-------------|
| **Adaptive Difficulty** | Adjusts task difficulty based on 25%/75% performance thresholds |
| **Scaffolded Hints** | Provides graduated hints when learner struggles |
| **Positive Reinforcement** | Delivers timed encouragement after correct responses |
| **Personalized Content** | Selects content matching learner profile |

### Key Interaction Effect

The demo demonstrates a critical insight: **Scaffolded Hints** show higher attribution when **Adaptive Difficulty** is also active. This models the real-world finding that scaffolding is most effective in the "zone of proximal development" — hints can't help if the task is already too easy or impossibly hard.

Try these experiments:
1. Enable only "Scaffolded Hints" → Note its attribution
2. Enable both "Scaffolded Hints" + "Adaptive Difficulty" → Hints attribution increases
3. The difference is the **interaction effect**

---

## Technical Details

### Implementation

- **Shapley Computation**: Exact enumeration over all 2^n coalitions (tractable for n=4 components)
- **Value Function**: Causal model with base effects + pairwise interaction terms
- **Simulation**: Averaged over 10 runs for smooth learning curves

### Scaling Considerations

With 4 components (16 coalitions), exact Shapley computation is trivial. For larger systems:
- **Hierarchical aggregation**: Group related components
- **Monte Carlo sampling**: Approximate via sampled permutations
- **Temporal sparsity**: Only re-compute when interventions change

---

## References

1. Salomons, N., et al. (2018). "Robots for autism: A pilot study of a socially assistive robot for children with autism." *Science Robotics*, 3(21).
2. Shapley, L.S. (1953). "A Value for n-Person Games." In *Contributions to the Theory of Games II*.
3. Lundberg, S.M., & Lee, S.I. (2017). "A Unified Approach to Interpreting Model Predictions." *NeurIPS*.

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## License

MIT
