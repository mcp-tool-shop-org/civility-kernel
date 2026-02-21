import { describe, it, expect } from "vitest";
import {
  ConstraintRegistry,
  ScorerRegistry,
  DecisionEngine,
  registerDefaultConstraints,
  registerDefaultScorers,
  type PreferencePolicy,
  type Plan
} from "../src/index.js";

describe("constraint param validation", () => {
  it("fails closed with a helpful reason when params are invalid", () => {
    const c = new ConstraintRegistry();
    registerDefaultConstraints(c);
    const s = new ScorerRegistry();
    registerDefaultScorers(s);
    const engine = new DecisionEngine(c, s);

    const policy: PreferencePolicy = {
      version: "1.2.0",
      weights: { efficiency: 1 },
      constraints: [{ id: "max_spend_without_confirm", params: { amount: "twenty" } }],
      contextRules: [],
      uncertaintyThreshold: 1,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const plans: Plan[] = [{ id: "p1", summary: "Do it", steps: [], meta: { reversibility: 1 } }];

    const { trace } = engine.decide(policy, "x", plans);
    expect(trace.outcome).toBe("NO_VALID_PLAN");

    const cand = trace.candidates[0];
    expect(cand.eval.passesConstraints).toBe(false);
    // Trace should now include the invalid-param reason via the constraint result
    expect(
      cand.eval.violatedConstraints.some(
        v => typeof v === "object" && v.id === "max_spend_without_confirm" && String(v.reason).includes("Invalid params")
      )
    ).toBe(true);
  });
});
