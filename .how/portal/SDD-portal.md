---
type: sdd
component: portal
status: draft
created: '2026-09-08'
realizes:
  - UC-15
  - UC-16
  - UC-17
  - UC-18
  - UC-19
binds:
  - AD-1
  - AD-2
  - AD-3
  - AD-6
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SDD — Congregational Portal & Workflows

## Decision Summary · [outline]

The `portal` component powers the congregational mobile experience, Sunday digital bulletins, church code onboarding, privacy-masked directory, and automated workflow notification dispatch. Architected as `internal/portal` in Go and the primary Flutter mobile screen shell, its key design choice is separating public onboarding endpoints (church lookup, guest intake) from authenticated member features (directory search, personal schedule). Notification events are queued in a durable PostgreSQL event table and dispatched asynchronously to external push notification providers (FCM/APNs) with quiet-hours throttling.

## Structure · [outline]

| LC | type | Responsibility |
|---|---|---|
| `screen-mobile-home` | ui-screen | Primary mobile landing feed showing service rundown, quick duties, and news |
| `screen-mobile-service` | ui-screen | Sunday worship itinerary, scripture readings, sermon notes, and study guide |
| `screen-mobile-sermons` | ui-screen | Archive of past sermons, speaker series, and audio/video links |
| `screen-mobile-directory` | ui-screen | Searchable congregation directory with contact detail masking |
| `screen-mobile-auth` | ui-screen | Camera QR code scanner, 6-digit church code lookup, and phone OTP login |
| `screen-web-settings` | ui-screen | Web administrative tenant profile, QR code print generator, and notification policies |

Logical Component dependencies:
`screen-mobile-auth` -> `internal/portal/lookup_handler` -> PostgreSQL (`db`).
`screen-mobile-directory` -> `internal/portal/directory_handler` -> `internal/membership/service` (for privacy masking) -> PostgreSQL (`db`).

## Inherited Constraints · [guarded]

| AD | How it lands here |
|---|---|
| `AD-1` | `internal/portal` isolates notification queuing and guest cards in its own schema tables. It interfaces with `serving` and `caregroups` via event subscriptions rather than synchronous tight coupling. |
| `AD-2` | QR code generation and parsing must use permissively licensed libraries (e.g. `skip2/go-qrcode` under MIT, `mobile_scanner` under Apache 2.0). |
| `AD-3` | The `/api/v1/directory` endpoint strictly enforces field masking: member phone and address fields are truncated/hidden at query serialization time unless `directory_visible = true`. |
| `AD-6` | The church lookup endpoint `/api/v1/church/lookup` accepts both direct 6-digit code queries and deep-link URI payloads, returning identical tenant profiles. |

## Failure Behaviour · [guarded]

| Boundary | Slow | Absent | Lying | What the user sees | What is logged |
|---|---|---|---|---|---|
| `GET /api/v1/church/lookup` | 3s timeout with local lookup cache fallback | Network offline | Malformed church code string | "Church not found. Please verify the 6-digit code." | `INFO: church lookup miss for code` |
| `GET /api/v1/feed` | 4s timeout; serves cached home feed | HTTP 503 Service Unavailable | Corrupted bulletin payload | "Showing cached bulletin. Pull down to refresh." | `WARN: portal.get_feed timeout` |
| `GET /api/v1/directory` | 6s timeout; returns cached list | HTTP 403 Forbidden (guest user) | SQL injection or invalid filter | "Directory search unavailable. Please retry." | `WARN: unauthorized directory query attempt by unverified guest` |
| `POST /api/v1/guests/intake` | 5s timeout | Network drop | Payload exceeding character limits | "Could not submit welcome card. Please try again." | `WARN: guest intake validation error` |
| `POST /api/v1/notifications/dispatch` | Asynchronous worker process with exponential retry | Cloud Push Service outage (FCM/APNs) | Push provider rejects device token | Silent to user; notifications retry up to 5 times | `ERROR: push dispatch failed for token, marking stale` |
| `screen-mobile-auth` | Camera preview keeps running | Camera hardware permission denied | Corrupted QR image | "Camera unavailable. Tap to enter 6-digit code manually." | Mobile device permission audit log |
| `screen-mobile-directory` | Alphabetical index shimmer skeleton | Network disconnected | Unmasked phone returned (caught by client assertion) | "Member details masked for privacy." Phone number is never rendered | Critical security client log |
