# Preflight review — TASK-MOCKUP-MCP-001-R1

Date: 2026-08-30
Reviewer: independent Railway verifier, not the executor
Mode: preflight
Verdict: PASS

## Provenance and remediation budget

- `TASK-MOCKUP-MCP-001` is in `rework-required` after an independently validated final FAIL.
- The source verdict identifies one release blocker: the real `Browser.downloadWillBegin` timeout promise can reject before `exportPng` attaches its handler, terminating Node and leaving the task-created mirror alive. It also identifies the immediate-throw timeout test as a harness defect.
- R1 names that source task, uses remediation attempt 1 and dependency depth 1. Project limits are one remediation attempt and dependency depth two, so the packet is within budget and does not require rebaseline.
- R1 directly unlocks final verification of the source task. It adds no unrelated feature or interface work.

## Scope and feasibility

- Production/test ownership is limited to `browser-session.mjs` and `mcp-live.test.mjs`. Public MCP tools, schemas, preset contract, package metadata, mirror files, portfolio source, deployment, and unrelated lint debt are explicitly excluded.
- The verified defect and its cleanup consequences are both owned by `browser-session.mjs`; the missing real-browser coverage is owned by `mcp-live.test.mjs`. No third production file is required to close the blocker.
- The existing code starts the timeout-bearing download event promise before the export click but attaches its await only after a separate CDP evaluation. Immediate rejection handling and a structured try/finally can be implemented locally without changing normal render or public error semantics.
- Session launch already owns the Chrome PID, mirror PID, loopback port, profile directory, and downloads directory. Its close path already has the primitives needed for bounded TERM/KILL handling and directory removal; R1 narrows changes to making that cleanup idempotent and reliable for the timeout outcome.
- A deterministic export-stage timeout seam can remain internal to `browser-session.mjs`: the live test must launch the exact mirror and Chrome, import/apply a valid preset, observe the export action, then delay or bound only the download-event wait. An immediate throwing launch stub is explicitly rejected.
- The targeted live regression, independent live check, owned-PID/port cleanup check, happy-path contract regression, task-scoped gates, mirror integrity, and strict lint-baseline comparison collectively cover the original failing acceptance and risk checks.

## Baseline evidence

The original MCP source directory is currently untracked, so Git alone cannot distinguish R1 edits from the already integrated source task. `preflight-baseline.sha256` records every current `server/mockup-mcp` file. Final scope verification can require changed hashes only for the two in-scope paths and exact matches for all six excluded MCP files.

The exact mirror manifest passed again during this preflight. `git diff --check` passed. The sibling task validator passed in compile phase; raw output is in `compile-validation.log`.

No live timeout reproduction was rerun at preflight because the source final evidence already records the crash and orphan, and intentionally recreating that unsafe outcome adds no compilation assurance. R1's frozen regression is the required post-fix proof.

No production code was modified during verification.

