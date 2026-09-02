# Preflight review — TASK-MOCKUP-MCP-001

Date: 2026-08-30
Reviewer: independent Railway verifier, not the executor
Mode: preflight
Verdict: PASS

## Packet and environment checks

- The schema-v4 task uses the allowed `local` tracking provider, with no external initial-message binding required. Intent approval is recorded in `tasks/STATE.json` and matches the browser-backed local MCP slice in `tasks/BRIEF.json`.
- The task is correctly classified as backend/tooling rather than UX flow: it automates an existing browser UI without changing screen structure or human navigation. A Mobbin or visual-contract gate is therefore not applicable.
- The MVP has concrete user value, a three-step first demo, one named unlock, bounded vertical scope, no parallel assignment, and no dependency chain.
- Security and privacy boundaries cover canonical input validation, bounded PNG/JPEG decoding, loopback-only browser traffic, unique output paths, serialization, redacted errors/logs, timeouts, cleanup, and destructive/remote exclusions.
- Rollback is bounded to task-owned server files, package metadata additions, and disposable output artifacts. There is no migration or external side effect.
- The exact mirror is present at `.local/dresser-mirror`; `shasum -a 256 -c MANIFEST.sha256` passed for every listed file. The manifest file SHA-256 observed during preflight is `50363797dfae069048924ddef79cbc6e29c31338e84562c8fd822cf4608380e7`.
- The mirror's existing browser QA reports device/background/mesh controls and only loopback/blob requests. Google Chrome, Node 22.23.1, and pnpm 10.30.3 are available locally.
- The sibling task validator passed in compile phase; raw output is in `compile-validation.log`.

## Correction review

The corrected packet changes only the validation policy that caused the previous lint/scope contradiction:

- acceptance criterion 8 now requires task-scoped MCP lint/tests/build/whitespace checks and treats the frozen full-repository lint baseline as accepted MVP debt;
- the required `lint` command is now `pnpm lint:mockup-mcp`;
- the required `build` command is now `pnpm build:mockup-mcp`;
- the `full-repo-lint-baseline-debt` observable check requires an exact comparison with the preflight baseline;
- required evidence names both the task-scoped gates and unchanged full-repository debt.

These changes are confined to resolving the previous gate contradiction and do not expand product scope, browser behavior, security policy, artifact handling, or external side effects. `package.json` is already in scope for the required scripts, and task-owned server/test files are available for those scripts to validate.

A fresh `pnpm lint` run after correction reproduced exactly the same 10 errors at the same locations in the same five out-of-scope files recorded in `preflight-lint.log`. This non-zero command is no longer a required passing command; it is a strict no-regression comparison. Any new, moved, removed, or task-owned MCP lint finding would fail the frozen check.

The sibling compile validator passed again after correction. Mirror integrity also passed again. No release blocker remains at preflight.

No production code was modified during verification.
