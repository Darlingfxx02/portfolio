# Independent live export-timeout evidence

Date: 2026-08-30
Result: PASS

An independent Node process used the real `BrowserSessionManager`, exact loopback `.local/dresser-mirror`, controlled Chrome, valid local JPEG, and valid `dresser-preset/v1`. The internal test-only predicate ignored `Browser.downloadWillBegin` after the real export button was clicked, forcing the bounded export-stage timeout.

- Export action observed: `true`
- Caught code: `DOWNLOAD_FAILED`
- Caught message: `Controlled browser operation timed out`
- Node remained alive: `true`
- Exit code: `0`
- `unhandledRejection`: none
- `uncaughtExceptionMonitor`: none
- Partial output artifact: none

The separate frozen `node --test --test-name-pattern='live export timeout' ...` regression also passed 1/1.
