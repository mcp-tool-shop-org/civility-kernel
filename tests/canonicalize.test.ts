import { describe, it, expect } from "vitest";
import { canonicalizePolicy } from "../src/policy/canonicalize.js";
import { ConstraintRegistry, registerDefaultConstraints } from "../src/policy/constraints.js";
import { PreferencePolicy } from "../src/policy/types.js";

describe("canonicalizePolicy", () => {
  it("fills defaults and sorts constraints", () => {
    const registry = new ConstraintRegistry();
    registerDefaultConstraints(registry);

    const policy: PreferencePolicy = {
      version: "1.0",
      weights: { low_risk: 0.5, efficiency: 1 },
      constraints: [
        { id: "require_confirm_if", params: { stakeGte: 0.5 } }, // missing irreversible default
        "no_irreversible_changes"
      ],
      contextRules: [],
      uncertaintyThreshold: 0.5,
      memory: {},
      calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
    };

    const canonical = canonicalizePolicy(policy, registry);

    // Weights sorted
    expect(Object.keys(canonical.weights)).toEqual(["efficiency", "low_risk"]);

    // Constraints sorted and defaults filled
    expect(canonical.constraints[0]).toBe("no_irreversible_changes");
    expect(canonical.constraints[1]).toEqual({
      id: "require_confirm_if",
      params: { stakeGte: 0.5, irreversible: false } // default filled
    });
  });
});
