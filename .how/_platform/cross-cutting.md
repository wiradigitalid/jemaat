---
type: cross-cutting
scope: _platform
status: draft
created: '2026-09-08'
---

# Cross-Cutting — Jemaat

## Error envelope

Standard JSON envelope returned for all non-2xx HTTP responses across the Go REST API.

```json
{
  "error": {
    "code": "ERR_SCHEDULE_CONFLICT",
    "message": "Volunteer is already assigned to an overlapping service role.",
    "details": [
      {
        "field": "volunteer_id",
        "issue": "Overlaps with assignment ASG-102 on 2026-09-13 09:00:00"
      }
    ]
  }
}
```

| Field | Type | Means | Always present |
|---|---|---|---|
| `error.code` | string | Machine-readable unique error identifier | yes |
| `error.message` | string | Human-readable explanation suitable for display | yes |
| `error.details` | array | Structured list of field-specific validation issues | no |

## Error catalogue

| Code | HTTP | Means | Caller should |
|---|---|---|---|
| `ERR_UNAUTHORIZED` | 401 | Missing, expired, or malformed JWT token | Re-authenticate or refresh token |
| `ERR_FORBIDDEN` | 403 | Authenticated user lacks permission for action | Show unauthorized message; do not retry |
| `ERR_NOT_FOUND` | 404 | Target entity ID does not exist | Verify ID and refresh list |
| `ERR_VALIDATION_FAILED` | 422 | Request payload failed schema validation | Check `details` array and correct inputs |
| `ERR_SCHEDULE_CONFLICT` | 409 | Volunteer has overlapping duty or active blockout | Request coordinator override or pick substitute |
| `ERR_SYNC_CONFLICT` | 409 | Concurrent offline edit detected on server | Apply local delta and reconcile with server state |
| `ERR_CHURCH_CODE_INVALID` | 404 | Scanned QR or 6-digit church code is not found | Prompt user to re-scan or verify church code |
| `ERR_RATE_LIMITED` | 429 | Too many requests submitted within time window | Exponential backoff and retry after interval |
| `ERR_INTERNAL_SERVER` | 500 | Unhandled server error | Log error, surface retry toast to user |

## Platform-owned

| What | Kind | Why no component explains it | Who touches it | The shape every toucher obeys |
|---|---|---|---|---|
| `auth_session` | data | Shared authentication session and JWT claim structure used by all containers | all | JWT payload containing `{ "sub": person_id, "church_id": uuid, "role": string, "exp": int64 }` |

## Other product-level agreements

### Identity and Session Shape

**Applies to:** `all` (`api`, `web`, `mobile`)
**Enforced by:** `internal/middleware/auth.go` middleware and client HTTP interceptors.
- All requests after onboarding require an `Authorization: Bearer <jwt>` header.
- Token expires in 7 days on mobile (with silent refresh), 24 hours on web admin desk.

### Timestamp and Timezone Convention

**Applies to:** `all` (`api`, `web`, `mobile`, `db`)
**Enforced by:** Database column constraints (`TIMESTAMPTZ`) and JSON serialization hooks.
- All timestamps stored and transmitted in UTC ISO-8601 string format (`YYYY-MM-DDTHH:MM:SSZ`).
- Mobile and web clients format timestamps into the church tenant's configured local timezone for user display.

### Pagination Envelope

**Applies to:** `all` (`api`, `web`, `mobile`)
**Enforced by:** API query parser middleware.
- Standard query params: `?page=1&limit=25` (max limit: 100).
- Standard response metadata: `{ "data": [...], "meta": { "total": 120, "page": 1, "limit": 25, "total_pages": 5 } }`.

### Offline Sync Idempotency Protocol

**Applies to:** `caregroups`, `mobile`, `api`
**Enforced by:** `internal/caregroups/sync_handler.go` and SQLite local sync queue.
- Offline check-ins send an idempotency header `X-Idempotency-Key: <meeting_id>-<person_id>-<timestamp>`.
- Server upserts attendance records based on unique compound key `(meeting_id, person_id)`.
