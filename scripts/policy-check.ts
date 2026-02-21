import fs from "fs";
import { lintPolicy } from "../src/policy/lint.js";
import { diffPolicy } from "../src/policy/diff.js";
import { ConstraintRegistry, registerDefaultConstraints } from "../src/policy/constraints.js";
import { ScorerRegistry, registerDefaultScorers } from "../src/policy/scoring.js";
import { PreferencePolicy } from "../src/policy/types.js";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: tsx scripts/policy-check.ts <policy.json> [old_policy.json]");
  process.exit(1);
}

const policyPath = args[0];
const oldPolicyPath = args[1];

const policy: PreferencePolicy = JSON.parse(fs.readFileSync(policyPath, "utf-8"));

const registry = new ConstraintRegistry();
registerDefaultConstraints(registry);
const scorers = new ScorerRegistry();
registerDefaultScorers(scorers);

console.log(`Linting ${policyPath}...`);
const report = lintPolicy(policy, { registry, scorers });

if (report.issues.length > 0) {
  console.log("\nIssues found:");
  for (const issue of report.issues) {
    const prefix = issue.severity === "error" ? "❌ ERROR" : issue.severity === "warn" ? "⚠️ WARN" : "ℹ️ INFO";
    console.log(`${prefix} [${issue.code}] ${issue.path ? `(${issue.path}) ` : ""}${issue.message}`);
  }
} else {
  console.log("✅ No issues found.");
}

if (oldPolicyPath) {
  console.log(`\nDiffing against ${oldPolicyPath}...`);
  const oldPolicy: PreferencePolicy = JSON.parse(fs.readFileSync(oldPolicyPath, "utf-8"));
  const diff = diffPolicy(oldPolicy, policy);
  
  if (diff.changed) {
    console.log("Changes:");
    for (const item of diff.items) {
      console.log(`- [${item.kind}] ${item.message}`);
    }
  } else {
    console.log("No changes.");
  }
}

if (!report.ok) {
  console.error("\nLint failed with errors.");
  process.exit(1);
}
