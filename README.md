<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/civility-kernel/readme.png" alt="civility-kernel logo" width="360" />
</div>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/civility-kernel/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License"></a>
  <a href="https://mcp-tool-shop-org.github.io/civility-kernel/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/civility-kernel"><img src="https://img.shields.io/npm/v/%40mcptoolshop%2Fcivility-kernel" alt="npm version"></a>
</p>

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

## Security & Data Scope

Civility Kernel is a **pure library** — no network requests, no telemetry, no side effects.

- **Data accessed:** Reads JSON policy files from local filesystem. Validates, canonicalizes, and diffs policy documents in-process. All operations are deterministic.
- **Data NOT accessed:** No network requests. No telemetry. No credential storage. The kernel evaluates policy constraints — it does not observe or log agent actions.
- **Permissions required:** File system read for policy JSON files. Write only when explicitly requested via `--apply`.

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## Scorecard

| Category | Score |
|----------|-------|
| Security | 10/10 |
| Error Handling | 10/10 |
| Operator Docs | 10/10 |
| Shipping Hygiene | 10/10 |
| Identity | 10/10 |
| **Overall** | **50/50** |

---

## License

MIT (see LICENSE)

---

Built by <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
