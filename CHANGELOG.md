# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-02-27

### Changed

- Promoted version from 0.2.1 to 1.0.0
- Added SECURITY.md with vulnerability reporting process and data scope
- Added SHIP_GATE.md and SCORECARD.md for product standards compliance
- Added coverage configuration (`@vitest/coverage-v8`) and verify script
- Updated README with Security & Data Scope section, scorecard, and badges

## [0.2.0] - 2026-02-23

### Fixed

- Fix broken logo image on npm (absolute raw.githubusercontent.com URL)
- Add `keywords` and `homepage` to package.json for better npm discoverability
- Explicit `README.md` and `LICENSE` entries in `files`

## [0.1.0] - 2026-02-21

### Added

- Human governance loop: preview, propose, explicit approval, apply, with automatic rollback backup
- Policy linter + deterministic diff utilities
- Canonicalization to prevent noisy diffs (defaults filled via Zod, deterministic ordering)
- Parameterized constraints with Zod validation (fail-closed with actionable errors)
- Human-readable diffs via constraint `describe()` hooks
- CI guard: tests, build, examples, and policy-check fixtures

[1.0.0]: https://github.com/mcp-tool-shop-org/civility-kernel/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/mcp-tool-shop-org/civility-kernel/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mcp-tool-shop-org/civility-kernel/releases/tag/v0.1.0
