import { describe, it, expect } from "vitest";
import { ConstraintRegistry, registerDefaultConstraints } from "../src/policy/constraints.js";
import { ScorerRegistry, registerDefaultScorers } from "../src/policy/scoring.js";
import { DecisionEngine } from "../src/policy/decision.js";

describe("DecisionEngine", () => {
  it("filters out plans that violate constraints", () => {
    const c = new ConstraintRegistry();
    registerDefaultConstraints(c);
    const s = new ScorerRegistry();
    registerDefaultScorers(s);
    const engine = new DecisionEngine(c, s);

    const policy: any = {
      version: "1.0",
      weights: { efficiency: 1 },
      constraints: ["confirm_spend_money"],
      contextRules: [],
      uncertaintyThreshold: 1,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const plans: any[] = [
      { id: "buy", summary: "Buy", steps: [], meta: { tags: ["spend_money"], reversibility: 1 } },
      { id: "ask", summary: "Ask", steps: [], meta: { tags: [], reversibility: 1 } }
    ];

    const { chosen, trace } = engine.decide(policy, "x", plans);

    expect(trace.outcome).toBe("EXECUTE");
    expect(chosen?.id).toBe("ask");
    const buyEval = trace.candidates.find(c => c.plan.id === "buy")!.eval;
    expect(buyEval.passesConstraints).toBe(false);
    expect(buyEval.violatedConstraints).toContain("confirm_spend_money");
  });

  it("asks user when uncertainty exceeds threshold", () => {
    const c = new ConstraintRegistry();
    registerDefaultConstraints(c);
    const s = new ScorerRegistry();
    registerDefaultScorers(s);
    const engine = new DecisionEngine(c, s);

    const policy: any = {
      version: "1.0",
      weights: { efficiency: 1 },
      constraints: [],
      contextRules: [],
      uncertaintyThreshold: 0.2,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const plans: any[] = [
      { id: "p1", summary: "Do it", steps: [], meta: { uncertainty: 0.9, reversibility: 1 } }
    ];

    const { chosen, trace } = engine.decide(policy, "x", plans);

    expect(trace.outcome).toBe("ASK_USER");
    expect(chosen).toBeUndefined();
  });

  it("fails closed on unknown constraint", () => {
    const c = new ConstraintRegistry();
    registerDefaultConstraints(c);
    const s = new ScorerRegistry();
    registerDefaultScorers(s);
    const engine = new DecisionEngine(c, s);

    const policy: any = {
      version: "1.0",
      weights: { efficiency: 1 },
      constraints: ["does_not_exist"],
      contextRules: [],
      uncertaintyThreshold: 1,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const plans: any[] = [
      { id: "p1", summary: "Do it", steps: [], meta: { reversibility: 1 } }
    ];

    const { trace } = engine.decide(policy, "x", plans);

    expect(trace.outcome).toBe("NO_VALID_PLAN");
    expect(trace.candidates[0].eval.violatedConstraints).toContain("does_not_exist");
  });
});
