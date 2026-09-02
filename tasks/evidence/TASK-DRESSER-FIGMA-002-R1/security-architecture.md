# Security architecture — TASK-DRESSER-FIGMA-002-R1

The source preflight proved that a sandboxed Figma plugin cannot read the companion's owner-only runtime file, while embedding or copying its bearer would violate the frozen privacy contract.

R1 closes only that blocker:

1. The bundled Figma UI is a minimal secret-free bootstrap that navigates to the fixed loopback `/plugin` document.
2. The companion serves the self-contained built UI and issues a random opaque `__Host-` session cookie with `HttpOnly`, `Secure`, `SameSite=None`, and `Path=/` for the embedded non-null-origin iframe.
3. Only a hash and expiry live in companion memory. No bearer or session value enters JavaScript, Figma messages, URLs, storage, build output, runtime files, logs, evidence, or Git.
4. Cookie auth is accepted only for exact same-origin capabilities/render requests with a fixed non-secret client marker and compatible fetch metadata. It cannot authorize shutdown.
5. Existing bearer plus opaque `Origin: null` behavior remains unchanged for tests and other local clients. Mixed auth is rejected.
6. Sessions are bounded, rotated, expired, cleared on stop, and invalid after restart.

The `SameSite=None; Secure` choice is required because `/plugin` is embedded under the Figma host. Live Figma Desktop verification is a release gate; implementation must stop rather than weaken cookie/security attributes if that runtime cannot support the contract.
