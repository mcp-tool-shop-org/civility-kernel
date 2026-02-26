<div align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/civility-kernel/readme.png" alt="civility-kernel logo" width="360" />
</div>

# civility-kernel

A policy layer that makes agent behavior **preference-governed** instead of purely efficiency-maximizing.

It does four things, reliably:

1) **Lint** policies (catch broken or unsafe configs before they ship)  
2) **Canonicalize** policies (equivalent inputs become the same output)  
3) **Diff + approve** changes (human-readable, explicit consent)  
4) **Rollback** automatically (save the previous policy before overwriting)

This is the boring safety machinery that lets you build “agents with boundaries.”

---

## Core idea

Your agent generates candidate plans. civility-kernel decides what happens next:

**generate → filter (hard constraints) → score (weights) → choose OR ask**

Hard constraints are non-negotiable. Soft preferences guide tradeoffs. Uncertainty can force “ask the human.”

---

## Install

```bash
npm i @mcptoolshop/civility-kernel
```

## The human governance loop

You can always see what your policy does.
The agent must show changes before they apply.
You can roll back.
Nothing silently updates.

Preview the policy contract:
```bash
npm run policy:explain
```

Propose an update (shows diff, prompts for approval):
```bash
npm run policy:propose
```

Canonicalize the current policy file (format-only normalization):
```bash
npm run policy:canonicalize
```

### Automatic rollback safety

When applying changes, `policy-check` can back up the old policy first:

```bash
npx tsx scripts/policy-check.ts policies/default.json --propose policies/proposed.json --write-prev policies/previous.json
```

## Policy files

Recommended convention:

- `policies/default.json` — active policy
- `policies/previous.json` — automatic rollback target
- `policies/profiles/*.json` — named profiles (work / low-friction / safe-mode)

## CLI options (policy-check)

- `--explain` — print a human-readable policy summary
- `--propose <file>` — lint + show canonicalized diff + prompt approval
- `--apply` — rewrite the policy file in canonical form
- `--write-prev <file>` — back up the old canonical policy before overwriting
- `--diff short|full` — short shows “headline” changes; full shows everything
- `--prev <file>` — deterministic CI diff mode

## Public API

- `lintPolicy(policy, { registry, scorers })`
- `canonicalizePolicy(policy, registry, scorers?)`
- `diffPolicy(a, b, { mode })` (short vs full)
- `explainPolicy(policy, registry, { format })`

## CI

CI runs:
- examples
- tests
- build
- `policy-check` against fixtures (`policies/default.json` vs `policies/previous.json`)

This prevents shipping broken policies or misleading diffs.

## Development

```bash
npm test
npm run build
npm run example:basic
npm run policy:check
```

## License

MIT (see LICENSE)
