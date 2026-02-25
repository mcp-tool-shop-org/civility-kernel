# Changelog

## 0.2.0
- Fix broken logo image on npm (absolute raw.githubusercontent.com URL)
- Add `keywords` and `homepage` to package.json for better npm discoverability
- Explicit `README.md` and `LICENSE` entries in `files`

## 0.1.0
- Human governance loop: preview → propose → explicit approval → apply, with automatic rollback backup
- Policy linter + deterministic diff utilities
- Canonicalization to prevent noisy diffs (defaults filled via Zod, deterministic ordering)
- Parameterized constraints with Zod validation (fail-closed with actionable errors)
- Human-readable diffs via constraint `describe()` hooks
- CI guard: tests, build, examples, and policy-check fixtures
