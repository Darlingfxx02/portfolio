# Complete preflight matrix

Status: PASS

Canonical allowed responses:

| Route | Requested method | Required request headers | Emitted allow headers |
| --- | --- | --- | --- |
| `/v1/capabilities` | GET | authorization | GET; authorization |
| `/v1/render` | POST | authorization, content-type, x-dresser-preset | POST; authorization, content-type, x-dresser-preset |
| `/v1/shutdown` | POST | authorization | POST; authorization |

Case and caller ordering variants passed but always returned the canonical values above. The table is frozen in protocol code; permission values are not echoed from the request.

Denied coverage: all three cross-route methods, missing required authorization/render headers, extra headers on render and shutdown, and unknown OPTIONS route. Supported-route negatives returned `INVALID_PREFLIGHT`; the unknown route returned `NOT_FOUND`. All omitted allow-method/allow-header permission fields and produced zero manager/shutdown calls.
