---
title: Getting Started
description: Install Civility Kernel and run your first policy check in under five minutes.
sidebar:
  order: 1
---

## Requirements

- Node.js 18 or later
- npm (included with Node.js)

## Installation

Install the package from npm:

```bash
npm i @mcptoolshop/civility-kernel
```

For development (running examples, tests, and the policy-check CLI):

```bash
git clone https://github.com/mcp-tool-shop-org/civility-kernel.git
cd civility-kernel
npm install
```

## Quick start (programmatic)

Import the core functions and wire up a basic policy evaluation:

```typescript
import {
  lintPolicy,
  canonicalizePolicy,
  diffPolicy,
  explainPolicy,
  ConstraintRegistry,
  ScorerRegistry,
  registerDefaultConstraints,
  registerDefaultScorers,
  DecisionEngine,
} from '@mcptoolshop/civility-kernel';
```

### 1. Set up registries

Constraints and scorers are registered in typed registries. The library ships with sensible defaults:

```typescript
const constraints = new ConstraintRegistry();
registerDefaultConstraints(constraints);

const scorers = new ScorerRegistry();
registerDefaultScorers(scorers);
```

### 2. Define a policy

A `PreferencePolicy` describes your agent's boundaries and tradeoff preferences:

```typescript
const policy = {
  version: '1',
  weights: { efficiency: 0.5, low_risk: 0.3, concise: 0.2 },
  constraints: [
    'no_irreversible_changes',
    { id: 'max_spend_without_confirm', params: { amount: 50 } },
  ],
  contextRules: [],
  uncertaintyThreshold: 0.7,
  memory: {},
  calibration: { riskTolerance: 0.3, verbosity: 0.5, initiative: 0.4 },
};
```

### 3. Lint the policy

Linting catches configuration errors before they reach production:

```typescript
const report = lintPolicy(policy, { registry: constraints, scorers });

if (!report.ok) {
  console.error('Policy has errors:', report.issues);
  process.exit(1);
}
```

### 4. Make a decision

The `DecisionEngine` evaluates candidate plans against the policy:

```typescript
const engine = new DecisionEngine(constraints, scorers);

const plans = [
  {
    id: 'plan-a',
    summary: 'Quick automated fix',
    steps: [{ kind: 'code', detail: 'Apply patch' }],
    meta: { estimatedTimeSec: 30, reversibility: 1, stake: 0.2, uncertainty: 0.3 },
  },
  {
    id: 'plan-b',
    summary: 'Full rewrite',
    steps: [{ kind: 'code', detail: 'Rewrite module' }],
    meta: { estimatedTimeSec: 3600, reversibility: 0, stake: 0.8, uncertainty: 0.6 },
  },
];

const { chosen, trace } = engine.decide(policy, 'code-review', plans);

console.log('Outcome:', trace.outcome);
// "EXECUTE" — plan-a passes constraints, plan-b is irreversible
console.log('Chosen:', chosen?.summary);
```

## Quick start (CLI)

The policy-check CLI provides a governance loop for managing policy files on disk.

### Preview a policy

See a human-readable summary of what your policy does:

```bash
npm run policy:explain
```

### Propose a change

Lint the proposed policy, canonicalize it, and show a diff against the current one:

```bash
npm run policy:propose
```

The CLI will prompt for approval before applying any changes.

### Canonicalize in place

Normalize the active policy file (sort keys, fill defaults, deduplicate constraints):

```bash
npm run policy:canonicalize
```

## Running examples

The repo includes runnable examples:

```bash
npm run example:basic          # Basic constraint evaluation
npm run example:parameterized  # Parameterized constraints with Zod schemas
npm run example:explain        # Policy explanation output
```

## Running tests

```bash
npm test                # Run all tests
npm run test:coverage   # Run with coverage report
npm run verify          # Build + test (CI equivalent)
```

## Next steps

- Read [Policy Files](/civility-kernel/handbook/policy-files/) to understand the full policy format
- See the [API Reference](/civility-kernel/handbook/api/) for programmatic usage
- Check the [CLI & Security Reference](/civility-kernel/handbook/reference/) for all CLI flags and the security model
