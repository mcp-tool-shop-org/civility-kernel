import { describe, it, expect } from "vitest";
import { proposePolicyUpdates, FeedbackEvent } from "../src/policy/learning.js";
import { PreferencePolicy } from "../src/policy/types.js";

function makePolicy(overrides?: Partial<PreferencePolicy["calibration"]>): PreferencePolicy {
  return {
    version: "1.0",
    weights: { efficiency: 0.5, low_risk: 0.3, concise: 0.2 },
    constraints: [],
    contextRules: [],
    uncertaintyThreshold: 0.5,
    memory: {},
    calibration: {
      riskTolerance: 0.5,
      verbosity: 0.5,
      initiative: 0.5,
      ...overrides,
    },
  };
}

function makeEvents(
  type: FeedbackEvent["type"],
  count: number,
  weightKey?: string
): FeedbackEvent[] {
  return Array.from({ length: count }, () => ({
    type,
    weightKey,
    timestamp: new Date().toISOString(),
  }));
}

describe("proposePolicyUpdates", () => {
  it("proposes reducing initiative after 3+ UNDOs", () => {
    const policy = makePolicy({ initiative: 0.5 });
    const events = makeEvents("UNDO", 3);
    const proposals = proposePolicyUpdates(policy, events);

    expect(proposals.length).toBeGreaterThanOrEqual(1);
    const initiativePatch = proposals.find((p) => p.patch.calibration?.initiative !== undefined);
    expect(initiativePatch).toBeDefined();
    expect(initiativePatch!.patch.calibration!.initiative).toBe(0.4);
    expect(initiativePatch!.reason).toMatch(/undo/i);
  });

  it("does not propose initiative change below 3 UNDOs", () => {
    const policy = makePolicy({ initiative: 0.5 });
    const events = makeEvents("UNDO", 2);
    const proposals = proposePolicyUpdates(policy, events);

    const initiativePatch = proposals.find((p) => p.patch.calibration?.initiative !== undefined);
    expect(initiativePatch).toBeUndefined();
  });

  it("clamps initiative at 0", () => {
    const policy = makePolicy({ initiative: 0.05 });
    const events = makeEvents("UNDO", 5);
    const proposals = proposePolicyUpdates(policy, events);

    const initiativePatch = proposals.find((p) => p.patch.calibration?.initiative !== undefined);
    expect(initiativePatch).toBeDefined();
    expect(initiativePatch!.patch.calibration!.initiative).toBe(0);
  });

  it("proposes reducing verbosity after 2+ THUMBS_DOWN on concise", () => {
    const policy = makePolicy({ verbosity: 0.6 });
    const events = makeEvents("THUMBS_DOWN", 2, "concise");
    const proposals = proposePolicyUpdates(policy, events);

    const verbPatch = proposals.find((p) => p.patch.calibration?.verbosity !== undefined);
    expect(verbPatch).toBeDefined();
    expect(verbPatch!.patch.calibration!.verbosity).toBeCloseTo(0.5);
    expect(verbPatch!.reason).toMatch(/verbose/i);
  });

  it("does not propose verbosity change for THUMBS_DOWN on other weights", () => {
    const policy = makePolicy({ verbosity: 0.6 });
    const events = makeEvents("THUMBS_DOWN", 5, "efficiency");
    const proposals = proposePolicyUpdates(policy, events);

    const verbPatch = proposals.find((p) => p.patch.calibration?.verbosity !== undefined);
    expect(verbPatch).toBeUndefined();
  });

  it("proposes user clarification after 5+ THUMBS_DOWN with no other proposals", () => {
    const policy = makePolicy();
    const events = makeEvents("THUMBS_DOWN", 5, "efficiency");
    const proposals = proposePolicyUpdates(policy, events);

    expect(proposals.length).toBe(1);
    expect(proposals[0].reason).toMatch(/clarification/i);
    expect(Object.keys(proposals[0].patch)).toHaveLength(0);
  });

  it("does not propose clarification if other patches already proposed", () => {
    const policy = makePolicy({ initiative: 0.5 });
    // 3 UNDOs + 5 THUMBS_DOWN on efficiency — undo patch fires, so clarification should not
    const events = [
      ...makeEvents("UNDO", 3),
      ...makeEvents("THUMBS_DOWN", 5, "efficiency"),
    ];
    const proposals = proposePolicyUpdates(policy, events);

    const clarification = proposals.find((p) => p.reason.match(/clarification/i));
    expect(clarification).toBeUndefined();
  });

  it("returns empty proposals for positive-only feedback", () => {
    const policy = makePolicy();
    const events = [
      ...makeEvents("THUMBS_UP", 10),
      ...makeEvents("CHOOSE_PLAN", 5),
    ];
    const proposals = proposePolicyUpdates(policy, events);
    expect(proposals).toEqual([]);
  });
});
