import { describe, it, expect } from "vitest";
import { diffPolicy } from "../src/policy/diff.js";
import { PreferencePolicy } from "../src/policy/types.js";

describe("diffPolicy", () => {
  const basePolicy: PreferencePolicy = {
    version: "1.0",
    weights: { efficiency: 1, low_risk: 0.5 },
    constraints: ["no_irreversible_changes", { id: "max_spend_without_confirm", params: { amount: 20 } }],
    contextRules: [],
    uncertaintyThreshold: 0.5,
    memory: {},
    calibration: { riskTolerance: 0.5, verbosity: 0.5, initiative: 0.5 }
  };

  it("detects no changes", () => {
    const diff = diffPolicy(basePolicy, basePolicy);
    expect(diff.changed).toBe(false);
    expect(diff.items).toHaveLength(0);
  });

  it("detects weight changes", () => {
    const newPolicy = {
      ...basePolicy,
      weights: { efficiency: 0.8, concise: 1 }
    };
    const diff = diffPolicy(basePolicy, newPolicy);
    expect(diff.changed).toBe(true);
    expect(diff.items).toContainEqual(expect.objectContaining({ kind: "weight_changed", path: "weights.efficiency" }));
    expect(diff.items).toContainEqual(expect.objectContaining({ kind: "weight_removed", path: "weights.low_risk" }));
    expect(diff.items).toContainEqual(expect.objectContaining({ kind: "weight_added", path: "weights.concise" }));
  });

  it("detects constraint param changes as remove+add", () => {
    const newPolicy = {
      ...basePolicy,
      constraints: ["no_irreversible_changes", { id: "max_spend_without_confirm", params: { amount: 200 } }]
    };
    const diff = diffPolicy(basePolicy, newPolicy);
    expect(diff.changed).toBe(true);
    expect(diff.items).toContainEqual(expect.objectContaining({ kind: "constraint_removed" }));
    expect(diff.items).toContainEqual(expect.objectContaining({ kind: "constraint_added" }));
  });
});
