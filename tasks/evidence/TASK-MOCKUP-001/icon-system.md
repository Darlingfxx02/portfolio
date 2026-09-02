# Icon system — TASK-MOCKUP-001

- Existing library: `@phosphor-icons/react` 2.1.10 in `package.json` and `pnpm-lock.yaml`.
- License: MIT, verified from the installed `node_modules/@phosphor-icons/react/package.json` metadata on 2026-08-30.
- Strategy: direct named imports for static editor actions, plus a small typed semantic resolver only where a key is data-driven.
- Required semantics: upload image, export image, reset composition, return/back, unknown action.
- Fallback: `Question` for an unknown semantic key, with a development/test diagnostic.
- Every icon-only button requires an accessible name.

## Result

- `src/tools/mockup/icons.ts` uses named Phosphor imports and a typed semantic resolver.
- The development fallback check passed: an unknown key returned the same `Question` component as `action.unknown` and emitted `[Mockup Studio] Unknown icon key: not.a.real.icon`.
- The only icon-only control is the back action; its accessible name is `Back to portfolio`.
- Evidence: `browser-report.json`, fields `iconFallback`, `fallbackDiagnostic`, `valid.labels`, and `focus`.
