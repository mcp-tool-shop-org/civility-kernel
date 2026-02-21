import { PreferencePolicy, Plan } from "./types.js";

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const entries = Object.entries(weights);
  const sum = entries.reduce((a, [, v]) => a + Math.max(0, v), 0);
  if (sum <= 0) return Object.fromEntries(entries.map(([k]) => [k, 0]));
  return Object.fromEntries(entries.map(([k, v]) => [k, Math.max(0, v) / sum]));
}

export function compileEffectivePolicy(
  base: PreferencePolicy,
  context: string,
  plans: Plan[]
): PreferencePolicy {
  let eff: PreferencePolicy = structuredClone(base);

  for (const rule of base.contextRules) {
    if (rule.context !== context) continue;
    const when = rule.when;
    const applies = (() => {
      if (!when) return true;
      const maxStake = Math.max(...plans.map(p => p.meta.stake ?? 0));
      const maxUnc = Math.max(...plans.map(p => p.meta.uncertainty ?? 0));
      const anyTags = new Set(plans.flatMap(p => p.meta.tags ?? []));
      if (when.minStake !== undefined && maxStake < when.minStake) return false;
      if (when.maxUncertainty !== undefined && maxUnc > when.maxUncertainty) return false;
      if (when.tagsAny && !when.tagsAny.some(t => anyTags.has(t))) return false;
      return true;
    })();
    if (!applies) continue;
    if (rule.adjust.weights) {
      eff.weights = { ...eff.weights, ...rule.adjust.weights };
    }
    if (rule.adjust.constraintsAdd) {
      eff.constraints = Array.from(new Set([...eff.constraints, ...rule.adjust.constraintsAdd]));
    }
    if (rule.adjust.constraintsRemove) {
      const remove = new Set(rule.adjust.constraintsRemove);
      eff.constraints = eff.constraints.filter(c => {
        if (typeof c === "string") return !remove.has(c);
        return !remove.has(c.id);
      });
    }
    if (rule.adjust.uncertaintyThreshold !== undefined) {
      eff.uncertaintyThreshold = clamp01(rule.adjust.uncertaintyThreshold);
    }
    if (rule.adjust.calibration) {
      eff.calibration = { ...eff.calibration, ...rule.adjust.calibration };
    }
  }
  eff.weights = normalizeWeights(eff.weights);
  return eff;
}
