# Icon fallback — TASK-MOCKUP-001

Status: PASS

In the local development runtime, `resolveMockupIcon('not.a.real.icon')` returned the same neutral `Question` component as the declared `action.unknown` semantic key. It also emitted the expected key-only diagnostic. No user data or filename was included.

Raw evidence: `browser-report.json.iconFallback` and `browser-report.json.fallbackDiagnostic`.
