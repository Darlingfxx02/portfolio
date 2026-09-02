# Icon strategy — TASK-DRESSER-FIGMA-002

- Existing package: `@phosphor-icons/react` 2.1.10.
- Installed package license: MIT.
- Strategy: reuse the existing library with direct named imports in `figma-plugin/src/ui/icons.ts`.
- Fallback: `Question`; unknown data-driven keys return it and emit a development/test-only diagnostic.
- Required semantic keys: refresh preview, insert, reset, retry, selection status, error status, solid, picture, mesh, transparent, and unknown.
- Every icon-only control requires an accessible name; decorative icons are hidden from assistive technology.
- Do not import the full catalog, draw custom replacements, use emoji/Unicode placeholders, or leak raw library names into capability data.
