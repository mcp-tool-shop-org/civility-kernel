#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";

import {
  ConstraintRegistry,
  ScorerRegistry,
  registerDefaultConstraints,
  registerDefaultScorers,
  canonicalizePolicy,
  lintPolicy,
  diffPolicy,
  explainPolicy,
  type PreferencePolicy
} from "../src/index.js";

type Args = {
  policyPath?: string;
  prevPath?: string;
  proposePath?: string;
  explain?: boolean;
  apply?: boolean;
  format?: "text" | "markdown";
  strict?: boolean; // treat warnings as errors
};

function parseArgs(argv: string[]): Args {
  const out: Args = { format: "text", strict: false };
  const pos: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a) continue;

    if (a === "--prev") out.prevPath = argv[++i];
    else if (a === "--propose") out.proposePath = argv[++i];
    else if (a === "--explain") out.explain = true;
    else if (a === "--apply") out.apply = true;
    else if (a === "--format") {
      const v = (argv[++i] ?? "text") as any;
      out.format = v === "markdown" ? "markdown" : "text";
    } else if (a === "--strict") out.strict = true;
    else if (a.startsWith("-")) {
      throw new Error(`Unknown flag: ${a}`);
    } else {
      pos.push(a);
    }
  }

  if (pos.length >= 1) out.policyPath = pos[0];
  return out;
}

function readJson<T>(p: string): T {
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw) as T;
}

function writeJson(p: string, obj: unknown) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function printIssues(issues: ReturnType<typeof lintPolicy>["issues"]) {
  for (const it of issues) {
    const where = it.path ? ` (${it.path})` : "";
    console.log(`${it.severity.toUpperCase()} ${it.code}${where}: ${it.message}`);
  }
}

function askYesNo(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase().startsWith("y"));
    });
  });
}

function ensureFile(p?: string, label = "file") {
  if (!p) throw new Error(`Missing ${label} path.`);
  if (!fs.existsSync(p)) throw new Error(`Cannot find ${label}: ${p}`);
}

function hasExplainer(): boolean {
  return typeof (explainPolicy as any) === "function";
}

function fallbackExplain(policy: PreferencePolicy) {
  const lines: string[] = [];
  lines.push(`Policy v${policy.version}`);
  lines.push(`- Uncertainty threshold: ${policy.uncertaintyThreshold}`);
  lines.push(`- Constraints: ${policy.constraints.length}`);
  lines.push(`- Weights: ${Object.keys(policy.weights).length}`);
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureFile(args.policyPath, "policy");

  const registry = new ConstraintRegistry();
  registerDefaultConstraints(registry);

  const scorers = new ScorerRegistry();
  registerDefaultScorers(scorers);

  const policyPath = args.policyPath!;
  const policyRaw = readJson<PreferencePolicy>(policyPath);

  // Canonicalize first so everything downstream is stable
  const policy = canonicalizePolicy(policyRaw, registry);

  // Lint
  const report = lintPolicy(policy, { registry, scorers });

  const hasErrors = report.issues.some((i) => i.severity === "error");
  const hasWarnings = report.issues.some((i) => i.severity === "warn");

  if (report.issues.length) {
    console.log("\nLint report:");
    printIssues(report.issues);
  } else {
    console.log("\nLint report: OK");
  }

  if (hasErrors || (args.strict && hasWarnings)) {
    console.log("\nPolicy is not acceptable.");
    process.exit(1);
  }

  // Explain (preview)
  if (args.explain) {
    console.log("\nPolicy preview:");
    if (hasExplainer()) {
      const exp = (explainPolicy as any)(policy, registry, { format: args.format ?? "text" });
      if (exp?.summary) console.log(exp.summary);
      if (Array.isArray(exp?.lines)) console.log(exp.lines.join("\n"));
      if (exp?.warnings?.length) {
        console.log("\nWarnings:");
        for (const w of exp.warnings) console.log(`- ${w}`);
      }
    } else {
      console.log(fallbackExplain(policy));
    }
  }

  // CI-friendly diff mode: --prev
  if (args.prevPath) {
    ensureFile(args.prevPath, "prev policy");
    const prevRaw = readJson<PreferencePolicy>(args.prevPath);
    const prev = canonicalizePolicy(prevRaw, registry);

    const d = diffPolicy(prev, policy, registry);
    console.log("\nDiff vs prev:");
    if (!d.changed) console.log("No changes.");
    else for (const item of d.items) console.log(`- ${item.message}`);
  }

  // Human mode: --propose <new.json>
  if (args.proposePath) {
    ensureFile(args.proposePath, "proposed policy");
    const proposedRaw = readJson<PreferencePolicy>(args.proposePath);
    const proposed = canonicalizePolicy(proposedRaw, registry);

    const proposedLint = lintPolicy(proposed, { registry, scorers });
    const proposedErrors = proposedLint.issues.some((i) => i.severity === "error");
    const proposedWarnings = proposedLint.issues.some((i) => i.severity === "warn");

    console.log("\nProposed policy lint:");
    if (proposedLint.issues.length) printIssues(proposedLint.issues);
    else console.log("OK");

    if (proposedErrors || (args.strict && proposedWarnings)) {
      console.log("\nProposed policy is not acceptable. Not applying.");
      process.exit(1);
    }

    const d = diffPolicy(policy, proposed, registry);
    console.log("\nProposed changes:");
    if (!d.changed) console.log("No changes.");
    else for (const item of d.items) console.log(`- ${item.message}`);

    // Default behavior: ask to apply (unless --apply present)
    const shouldApply = args.apply ? true : await askYesNo("\nApply these changes? (y/N) ");
    if (!shouldApply) {
      console.log("Not applied.");
      return;
    }

    // Write canonicalized proposed policy to the target policyPath
    writeJson(policyPath, proposed);
    console.log(`Applied. Wrote canonicalized policy to ${policyPath}`);
  } else if (args.apply) {
    // If user called --apply without --propose, interpret as: "rewrite policy file in canonical form"
    writeJson(policyPath, policy);
    console.log(`Applied canonicalization. Wrote canonicalized policy to ${policyPath}`);
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
