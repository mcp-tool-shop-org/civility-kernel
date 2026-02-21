import type { PreferencePolicy, ConstraintSpec } from "./types.js";

export interface PolicyDiffItem {
  kind:
    | "weight_changed"
    | "weight_added"
    | "weight_removed"
    | "constraint_added"
    | "constraint_removed"
    | "threshold_changed"
    | "calibration_changed"
    | "context_rule_added"
    | "context_rule_removed"
    | "context_rule_changed";
  message: string;
  path?: string;
  meta?: Record<string, unknown>;
}

export interface PolicyDiff {
  changed: boolean;
  items: PolicyDiffItem[];
}

function specKey(spec: ConstraintSpec): string {
  if (typeof spec === "string") return spec;
  const params = spec.params && Object.keys(spec.params).length ? JSON.stringify(spec.params) : "";
  return `${spec.id}${params ? ":" + params : ""}`;
}

function byKey<T>(arr: T[], keyFn: (t: T) => string): Map<string, T> {
  const m = new Map<string, T>();
  for (const x of arr) m.set(keyFn(x), x);
  return m;
}

export function diffPolicy(a: PreferencePolicy, b: PreferencePolicy): PolicyDiff {
  const items: PolicyDiffItem[] = [];

  // threshold
  if (a.uncertaintyThreshold !== b.uncertaintyThreshold) {
    items.push({
      kind: "threshold_changed",
      message: `Uncertainty threshold changed ${a.uncertaintyThreshold} → ${b.uncertaintyThreshold}`,
      path: "uncertaintyThreshold"
    });
  }

  // calibration
  for (const k of ["riskTolerance", "verbosity", "initiative"] as const) {
    if (a.calibration[k] !== b.calibration[k]) {
      items.push({
        kind: "calibration_changed",
        message: `Calibration "${k}" changed ${a.calibration[k]} → ${b.calibration[k]}`,
        path: `calibration.${k}`
      });
    }
  }

  // weights
  const aW = a.weights, bW = b.weights;
  for (const k of new Set([...Object.keys(aW), ...Object.keys(bW)])) {
    if (!(k in aW)) {
      items.push({ kind: "weight_added", message: `Weight "${k}" added (${bW[k]})`, path: `weights.${k}` });
    } else if (!(k in bW)) {
      items.push({ kind: "weight_removed", message: `Weight "${k}" removed (was ${aW[k]})`, path: `weights.${k}` });
    } else if (aW[k] !== bW[k]) {
      items.push({
        kind: "weight_changed",
        message: `Weight "${k}" changed ${aW[k]} → ${bW[k]}`,
        path: `weights.${k}`
      });
    }
  }

  // constraints (treat each spec instance as a set element keyed by id+params)
  const aC = new Set(a.constraints.map(specKey));
  const bC = new Set(b.constraints.map(specKey));
  for (const x of bC) if (!aC.has(x)) items.push({ kind: "constraint_added", message: `Constraint added: ${x}`, path: "constraints" });
  for (const x of aC) if (!bC.has(x)) items.push({ kind: "constraint_removed", message: `Constraint removed: ${x}`, path: "constraints" });

  // context rules (simple diff by index+context; later you can get fancy)
  const aR = byKey(a.contextRules, r => r.context);
  const bR = byKey(b.contextRules, r => r.context);

  for (const [ctx, r] of bR) {
    if (!aR.has(ctx)) {
      items.push({ kind: "context_rule_added", message: `Context rule added: ${ctx}`, path: "contextRules", meta: { context: ctx } });
      continue;
    }
    const prev = aR.get(ctx)!;
    const prevJson = JSON.stringify(prev.adjust);
    const nextJson = JSON.stringify(r.adjust);
    const prevWhen = JSON.stringify(prev.when ?? {});
    const nextWhen = JSON.stringify(r.when ?? {});
    if (prevJson !== nextJson || prevWhen !== nextWhen) {
      items.push({
        kind: "context_rule_changed",
        message: `Context rule changed: ${ctx}`,
        path: "contextRules",
        meta: { context: ctx, before: prev, after: r }
      });
    }
  }
  for (const [ctx] of aR) {
    if (!bR.has(ctx)) items.push({ kind: "context_rule_removed", message: `Context rule removed: ${ctx}`, path: "contextRules", meta: { context: ctx } });
  }

  return { changed: items.length > 0, items };
}
