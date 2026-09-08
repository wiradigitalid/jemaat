---
type: sdd
component: caregroups
status: draft
created: '2026-09-08'
realizes:
  - UC-11
  - UC-12
  - UC-13
  - UC-14
binds:
  - AD-1
  - AD-2
  - AD-5
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SDD — Care Groups & Attendance

## Decision Summary · [outline]

The `caregroups` component manages small group fellowships, recurring meeting sessions, and mobile attendance check-in. Engineered as the `internal/caregroups` package in Go with a paired Flutter mobile offline client, its central architectural design is offline-first resilience: care group leaders can check in members in locations without internet access, storing attendance records in device SQLite storage that synchronizes idempotently to PostgreSQL upon reconnect. Pastoral health monitoring algorithms run asynchronously to detect consecutive member absences without adding overhead to the check-in path.

## Structure · [outline]

| LC | type | Responsibility |
|---|---|---|
| `screen-web-caregroups` | ui-screen | Web administrative care group oversight, zone configuration, and attendance metrics |
| `screen-mobile-caregroups` | ui-screen | Mobile care group hub, upcoming meeting schedule, and RSVP submission |
| `screen-mobile-attendance` | ui-screen | Single-tap mobile member and guest attendance check-in with offline SQLite persistence |

Logical Component dependencies:
`screen-mobile-attendance` -> Local SQLite Store (mobile) -> (when online) -> `internal/caregroups/handler` -> `internal/caregroups/service` -> `internal/caregroups/repository` -> PostgreSQL (`db`).

## Inherited Constraints · [guarded]

| AD | How it lands here |
|---|---|
| `AD-1` | Small group records and attendance logs reside strictly in `internal/caregroups/`. Member names are queried from `internal/membership` via Go interface; care group logic never mutates person identity directly. |
| `AD-2` | Mobile local database storage and synchronization engines must use permissively licensed SQLite packages (e.g. sqflite/drift under MIT/Apache 2.0). |
| `AD-5` | The attendance sync protocol must be strictly idempotent. The sync endpoint `/api/v1/care-groups/attendance/sync` takes a batch payload with client timestamps and applies upsert queries based on `(meeting_session_id, person_id)`. |

## Failure Behaviour · [guarded]

| Boundary | Slow | Absent | Lying | What the user sees | What is logged |
|---|---|---|---|---|---|
| `GET /api/v1/care-groups` | 5s timeout; loads from local SQLite cache | HTTP 503 Service Unavailable | Corrupted group list payload | "Showing cached care group info. Reconnecting..." | `WARN: caregroups.get_groups connection failed` |
| `POST /api/v1/care-groups/attendance/sync` | Sync queue batches requests and retries with exponential backoff (5s, 15s, 60s) | No cellular connection | Out-of-order sync timestamps or malformed JSON | "Attendance saved on your phone. Will upload when back online." | `INFO: offline attendance queued locally (count: N)` |
| `GET /api/v1/care-groups/absence-alerts` | 6s timeout | HTTP 500 Internal Error | Mismatched member absence calculation | "Unable to refresh pastoral alerts right now." | `ERROR: pastoral alert aggregation query failed` |
| `screen-mobile-attendance` | Immediate instant UI checkbox response (0ms local latency) | Total offline mode | Conflicting local record | Green checkmark with offline badge: "Saved locally." | Device local audit trail |
| `screen-web-caregroups` | Summary metrics shimmer placeholder | "Server unreachable" notification banner | Incomplete attendance percentage | "Network error. Reconnect to refresh small group data." | Web client console error log |
