# Preflight review — TASK-MOCKUP-001

Date: 2026-08-30
Reviewer: independent Railway verifier (not the executor)
Mode: preflight

## Verdict basis

- The approved brief and repository state support one bounded local prototype: a direct `/tools/mockup` route, browser-only still-image composition, one original generic phone shell, controls, and PNG export.
- Ownership is explicit and non-overlapping: only `src/main.tsx` and new files under `src/tools/mockup/` are in scope. Existing dirty-worktree changes and generated `dist` output are excluded.
- The route-isolation requirement is testable from the proposed `src/main.tsx` branch: the mockup editor must be lazy-loaded and rendered outside `SiteBoot`; ordinary routes must keep their existing providers and boot wrapper.
- Privacy and clean-room boundaries are explicit: no upload, persistence, analytics, filename/content logging, Dresser bundle, UI source, copy, media, device artwork, or branded assets.
- The packet includes valid-image, corrupt/unsupported/zero-dimension negative paths, preservation of the last valid composition, preview/export comparison, accessibility, privacy, lint, build, and diff checks.
- Rollback is bounded to task-owned files and the direct route branch; the task creates no durable user data.
- `@phosphor-icons/react` is already installed. The packet freezes named imports, semantic keys, a neutral `Question` fallback, and accessible names.

## Explicit Mobbin exception

The compile validator was run in compile phase and returned exactly one error:

`UX-flow task requires completed Mobbin research before compile`

That gate is intentionally superseded for this prototype by the user's direct approval, `без мобина просто форкай`, recorded in `tasks/BRIEF.json`, `tasks/CONSTRAINTS.json`, `tasks/STATE.json`, and the task constraints. The task does not claim Mobbin research was completed. The absence is bounded to prototype reference assurance and does not weaken the frozen clean-room, privacy, validation, or rollback requirements.

Raw validator output: `tasks/evidence/TASK-MOCKUP-001/compile-validation.log`.

## Result

PASS under the explicit user-approved Mobbin exception. No additional scope or acceptance requirement was introduced.
