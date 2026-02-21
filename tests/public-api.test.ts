import { describe, it, expect } from "vitest";
import * as api from "../src/index.js";

describe("public api", () => {
  it("exports the core surface", () => {
    expect(api.DecisionEngine).toBeTypeOf("function");
    expect(api.ConstraintRegistry).toBeTypeOf("function");
    expect(api.ScorerRegistry).toBeTypeOf("function");
    expect(api.registerDefaultConstraints).toBeTypeOf("function");
    expect(api.registerDefaultScorers).toBeTypeOf("function");
  });
});
