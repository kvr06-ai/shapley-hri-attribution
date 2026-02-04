# Action-Level Shapley Attribution

**Which robot actions actually caused the improvement?**

> An interactive demo showing how Shapley values identify which specific actions in a social robot intervention caused the observed outcome—and why RL temporal decay methods get this wrong.

[**Live Demo**](https://kvr06-ai.github.io/shapley-hri-attribution/)

---

## The Problem

Social robot interventions for children with ASD involve many actions over many days. When we observe improvement, the question is:

> *"Which of those N actions across X days actually caused the Y% gain?"*

**RL temporal decay methods (GAE/TD)** assign credit based on recency—recent actions get most credit. This is systematically wrong: the pivotal action might have been early encouragement after a failed attempt, not the final session.

---

## The Solution: Shapley Attribution

Shapley values treat each action as a "player" and compute its fair causal contribution by averaging marginal impact across all possible action orderings:

```
φᵢ = Σ [|S|!(n-|S|-1)!/n!] × [v(S ∪ {i}) - v(S)]
```

**Key insight:** Shapley values identify causal impact regardless of timing.

---

## Demo Walkthrough

The demo shows a 15-day intervention with 35% improvement in emotion recognition:

| Day | Action | Shapley | RL Credit | Note |
|-----|--------|---------|-----------|------|
| 3 | Encouragement | **+12%** | 2% | Turning point after failed attempt |
| 6 | Caregiver Prompt | +8% | 3% | Triadic interaction synergy |
| 15 | Difficulty Up | -2% | **21%** | Counterproductive final push |

**The contrast:**
- Shapley correctly identifies Day 3 as most impactful (+12%)
- RL assigns Day 15 as most impactful (21%)—exactly wrong

---

## Action Types

| Action | Description |
|--------|-------------|
| Emotion Game | Emotion recognition practice (Story game) |
| Perspective Game | Perspective-taking practice (Rocket/House game) |
| Sequencing Game | Sequencing practice (Train game) |
| Encouragement | Robot provides social encouragement |
| Difficulty ↑/↓ | BKT-driven difficulty adjustment |
| Caregiver Prompt | Robot prompts caregiver involvement |

---

## References

1. Salomons et al. (2018). "Robots for autism." *Science Robotics*.
2. Shapley, L.S. (1953). "A Value for n-Person Games."

---

## Development

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run deploy   # Deploy to GitHub Pages
```

---

MIT License
