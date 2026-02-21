import { ConstraintRegistry } from "./constraints.js";
import { compileEffectivePolicy } from "./context.js";
import { ScorerRegistry } from "./scoring.js";
import { DecisionTrace, Plan, PlanEval, PreferencePolicy } from "./types.js";

function nowIso() {
  return new Date().toISOString();
}

function randId() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

export class DecisionEngine {
  constructor(
    private constraints: ConstraintRegistry,
    private scorers: ScorerRegistry
  ) {}

  decide(
    basePolicy: PreferencePolicy,
    context: string,
    plans: Plan[]
  ): { chosen?: Plan; trace: DecisionTrace } {
    const decisionId = randId();
    const effectivePolicy = compileEffectivePolicy(basePolicy, context, plans);
    let scorerWarnings: string[] = [];
    const evals: PlanEval[] = plans.map((p) => {
      const results = this.constraints.evaluate(effectivePolicy.constraints, p, effectivePolicy);
      const violated = results.filter((r: any) => !r.ok).map((r: any) => ({
        id: r.id,
        params: r.params,
        reason: r.reason
      }));
      const passes = violated.length === 0;
      let scores: Record<string, number> = {};
      if (passes) {
        scores = this.scorers.score(p, effectivePolicy);
        for (const k of Object.keys(effectivePolicy.weights)) {
          if (!(k in scores)) {
            scorerWarnings.push(`Weight '${k}' had no scorer registered; treated as 0.`);
          }
        }
      }
      const utility = passes
        ? Object.entries(effectivePolicy.weights).reduce((sum, [k, w]) => sum + w * (scores[k] ?? 0), 0)
        : -Infinity;
      return {
        planId: p.id,
        passesConstraints: passes,
        violatedConstraints: violated,
        scores,
        utility,
      };
    });
    const survivors = plans
      .map((p) => ({ plan: p, eval: evals.find(e => e.planId === p.id)! }))
      .filter(x => x.eval.passesConstraints);
    const maxUnc = Math.max(...plans.map(p => p.meta.uncertainty ?? 0));
    const shouldAsk = maxUnc > effectivePolicy.uncertaintyThreshold;
    let chosen: Plan | undefined;
    let outcome: DecisionTrace["outcome"] = "NO_VALID_PLAN";
    const rationale: string[] = [];
    if (survivors.length === 0) {
      outcome = "NO_VALID_PLAN";
      rationale.push("All candidate plans violated hard constraints.");
      rationale.push("Agent must ask user to relax constraints or propose new options.");
    } else if (shouldAsk) {
      outcome = "ASK_USER";
      rationale.push(
        `Estimated uncertainty (${maxUnc.toFixed(2)}) exceeds threshold (${effectivePolicy.uncertaintyThreshold.toFixed(2)}).`
      );
      rationale.push("Agent should present top surviving options and ask for preference/confirmation.");
    } else {
      survivors.sort((a, b) => b.eval.utility - a.eval.utility);
      chosen = survivors[0].plan;
      outcome = "EXECUTE";
      rationale.push("Selected highest-utility plan among constraint-passing candidates.");
    }
    if (scorerWarnings.length > 0) {
      rationale.push(...scorerWarnings);
    }
    const trace: DecisionTrace = {
      decisionId,
      context,
      effectivePolicy: {
        weights: effectivePolicy.weights,
        constraints: effectivePolicy.constraints,
        uncertaintyThreshold: effectivePolicy.uncertaintyThreshold,
        calibration: effectivePolicy.calibration,
      },
      candidates: plans.map((p) => ({
        plan: { id: p.id, summary: p.summary, meta: p.meta },
        eval: evals.find(e => e.planId === p.id)!,
      })),
      chosenPlanId: chosen?.id,
      outcome,
      rationale,
      timestamp: nowIso(),
    };
    return { chosen, trace };
  }
}
