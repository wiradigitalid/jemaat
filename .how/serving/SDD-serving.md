---
type: sdd
component: serving
status: draft
created: '2026-09-08'
realizes:
  - UC-6
  - UC-7
  - UC-8
  - UC-9
  - UC-10
binds:
  - AD-1
  - AD-2
  - AD-4
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SDD — Volunteer Scheduling & Rosters

## Decision Summary · [outline]

The `serving` component handles church ministry department structures, volunteer role requirements, service calendar planning, and mobile roster confirmations. Implemented as the `internal/serving` package in Go, it features an algorithmic conflict validation engine that checks volunteer availability and double-booking before committing assignments. The major architectural trade-off is decoupling the visual planning matrix on the React web admin desk from the volunteer's 1-tap mobile confirmation lifecycle, while ensuring notification events are dispatched through `portal` without circular package dependencies.

## Structure · [outline]

| LC | type | Responsibility |
|---|---|---|
| `screen-web-roster` | ui-screen | Multi-department volunteer schedule grid, slot assignment modal, and conflict resolution |
| `screen-mobile-serving` | ui-screen | Personal duty cards with 1-tap Accept, Decline, and Swap actions, plus blockout calendar |

Logical Component dependencies:
`screen-web-roster` -> `internal/serving/handler` -> `internal/serving/service` (conflict engine) -> `internal/serving/repository` -> PostgreSQL (`db`).

## Inherited Constraints · [guarded]

| AD | How it lands here |
|---|---|
| `AD-1` | `internal/serving` queries `internal/membership`'s public Go interface to verify active member standing before role assignment. It does not perform cross-table foreign key writes directly into `persons`. |
| `AD-2` | Scheduling and matrix calendar calculations must use clean, permissively licensed algorithms (MIT/Apache 2.0). GPL code patterns from ChurchCRM are excluded. |
| `AD-4` | Conflict detection is centralized in `internal/serving/service.ValidateAssignment()`. The engine checks both concurrent service schedule overlaps and active `volunteer_availability` intervals before persisting any assignment. |

## Failure Behaviour · [guarded]

| Boundary | Slow | Absent | Lying | What the user sees | What is logged |
|---|---|---|---|---|---|
| `GET /api/v1/services` | 6s timeout; returns cached calendar view | HTTP 503 Service Unavailable | Corrupted date range parameters | "Unable to load service roster. Retrying..." | `WARN: serving.get_services database timeout` |
| `POST /api/v1/roster-assignments` | 8s timeout with transactional rollback | Network drop during assignment | Assignment payload with detected conflict without override code | "Volunteer has a scheduling conflict: [Reason]. Override requires reason code." | `INFO: assignment blocked by conflict detection engine` |
| `PUT /api/v1/roster-assignments/:id/status` | Mobile optimistic update with 5s timeout | Offline queueing on device | Status change on already canceled assignment | "This service assignment was previously updated or canceled." | `WARN: stale status mutation attempt on assignment` |
| `POST /api/v1/volunteers/availability` | 5s timeout | HTTP 500 Internal Error | Start date after end date | "Blockout start date must be before end date." | `WARN: invalid blockout date range submitted` |
| `screen-web-roster` | Calendar skeleton shimmer | "Offline: Changes not saved" alert | Dropped drag-and-drop event | "Could not move volunteer. Slot assignment restored." | Client-side drag event error |
| `screen-mobile-serving` | Optimistic confirmation toggle | "Saved offline. Will sync when online" | Invalid JWT signature | "Please sign in again to confirm your serving duties." | Security audit token failure |
