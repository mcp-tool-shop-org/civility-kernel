# civility-kernel

A modular policy layer that makes agent behavior *preference-governed* instead of purely efficiency-maximizing.

**Core idea:** generate candidate plans → **filter** with hard constraints → **score** with user weights → choose, or ask the user when uncertainty is high.

## What it includes

- **Types**: `PreferencePolicy`, `Plan`, `PlanEval`, `DecisionTrace`
- **Constraints** (hard gates): fail-closed, pluggable registry
- **Context compilation**: per-context effective policy with rule-based adjustments
- **Scoring** (soft prefs): pluggable dimension scorers
- **Decision engine**: filter → score → choose, with ASK fallback
- **Learning loop**: proposes policy updates, requires explicit confirmation
- **Feature extraction**: (optional) derive tags/risk/reversibility/stake from plan steps

## Installation

```bash
npm i civility-kernel
# or
pnpm add civility-kernel
```

## Quickstart

```ts
import {
  DecisionEngine,
  ConstraintRegistry,
  ScorerRegistry,
  registerDefaultConstraints,
  registerDefaultScorers
} from "civility-kernel";

const constraints = new ConstraintRegistry();
registerDefaultConstraints(constraints);

const scorers = new ScorerRegistry();
registerDefaultScorers(scorers);

const engine = new DecisionEngine(constraints, scorers);

const policy = {
  version: "1.0",
  weights: { efficiency: 0.6, low_risk: 0.4 },
  constraints: ["no_irreversible_changes", "confirm_spend_money"],
  contextRules: [],
  uncertaintyThreshold: 0.65,
  memory: {},
  calibration: { riskTolerance: 0.3, verbosity: 0.4, initiative: 0.5 }
};

const plans = [
  {
    id: "p1",
    summary: "Book the cheapest flight now",
    steps: [{ kind: "purchase", detail: "Buy flight ticket" }],
    meta: { tags: ["spend_money"], uncertainty: 0.4, stake: 0.6, reversibility: 0 }
  },
  {
    id: "p2",
    summary: "Ask for preferred airline + budget, then book",
    steps: [{ kind: "ask_user", detail: "Airline preference and max budget?" }],
    meta: { uncertainty: 0.2, stake: 0.6, reversibility: 1 }
  }
];

const { chosen, trace } = engine.decide(policy as any, "life-admin", plans as any);

console.log("Outcome:", trace.outcome);
console.log("Chosen:", chosen?.id);
console.log("Why:", trace.rationale);
```

## DecisionTrace (“Why did you do that?”)

Every decision returns a DecisionTrace containing:

- effective policy (weights, constraints, thresholds)
- evaluations for each candidate plan (violations + scores)
- chosen plan (or ASK_USER / NO_VALID_PLAN)
- rationale strings safe to show to end users

## Design principles

- Constraints are non-negotiable: applied before scoring
- Unknown constraints fail closed: safer default
- Uncertainty triggers asking: avoids “efficiently wrong”
- Policy updates are opt-in: propose changes, never silently mutate

## License

MIT
