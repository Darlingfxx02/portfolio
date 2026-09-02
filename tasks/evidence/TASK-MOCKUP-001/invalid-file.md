# Invalid-file recovery — TASK-MOCKUP-001

Status: PASS

After a valid image and adjusted composition were present, three synthetic local inputs were exercised through the real file-input change handler:

| Case | Visible result | Last valid canvas | Ready state |
| --- | --- | --- | --- |
| Unsupported `text/plain` | “Choose a PNG or JPEG image…” | SHA-256 unchanged | Preserved |
| Corrupt `image/png` | “This image could not be read…” | SHA-256 unchanged | Preserved |
| PNG with zero width in IHDR | “This image could not be read…” | SHA-256 unchanged | Preserved |

No route crash or uncaught application exception occurred. See `editor-invalid-recovery.png` and `browser-report.json.invalid`.
