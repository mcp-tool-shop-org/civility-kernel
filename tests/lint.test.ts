import { describe, it, expect } from "vitest";
import { lintPolicy } from "../src/policy/lint.js";
import { ConstraintRegistry, registerDefaultConstraints } from "../src/policy/constraints.js";
import { ScorerRegistry, registerDefaultScorers } from "../src/policy/scoring.js";
import { PreferencePolicy } from "../src/policy/types.js";

describe("lintPolicy", () => {
  it("returns ok for a valid policy", () => {
    const registry = new ConstraintRegistry();
    registerDefaultConstraints(registry);
    const scorers = new ScorerRegistry();
    registerDefaultScorers(scorers);

    const policy: PreferencePolicy = {
      version: "1.0",
      weights: { efficiency: 1, low_risk: 0.5 },
      constraints: ["no_irreversible_changes"],
      contextRules: [],
      uncertaintyThreshold: 0.5,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const report = lintPolicy(policy, { registry, scorers });
    expect(report.ok).toBe(true);
    expect(report.issues).toHaveLength(0);
  });

  it("reports error for unknown constraint", () => {
    const registry = new ConstraintRegistry();
    const policy: PreferencePolicy = {
      version: "1.0",
      weights: { efficiency: 1 },
      constraints: ["does_not_exist"],
      contextRules: [],
      uncertaintyThreshold: 0.5,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const report = lintPolicy(policy, { registry });
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: "UNKNOWN_CONSTRAINT",
      severity: "error"
    }));
  });

  it("reports error for invalid constraint params", () => {
    const registry = new ConstraintRegistry();
    registerDefaultConstraints(registry);
    const policy: PreferencePolicy = {
      version: "1.0",
      weights: { efficiency: 1 },
      constraints: [{ id: "max_spend_without_confirm", params: { amount: -10 } }],
      contextRules: [],
      uncertaintyThreshold: 0.5,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const report = lintPolicy(policy, { registry });
    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: "INVALID_CONSTRAINT_PARAMS",
      severity: "error"
    }));
  });

  it("reports warning for missing scorer", () => {
    const registry = new ConstraintRegistry();
    const scorers = new ScorerRegistry();
    const policy: PreferencePolicy = {
      version: "1.0",
      weights: { missing_scorer: 1 },
      constraints: [],
      contextRules: [],
      uncertaintyThreshold: 0.5,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const report = lintPolicy(policy, { registry, scorers });
    expect(report.ok).toBe(true); // warnings don't fail the lint
    expect(report.issues).toContainEqual(expect.objectContaining({
      code: "MISSING_SCORER",
      severity: "warn"
    }));
  });
});
