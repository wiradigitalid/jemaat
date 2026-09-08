---
type: srs
component: caregroups
status: draft
created: '2026-09-08'
satisfies:
  - FR-9
  - FR-10
  - FR-11
  - FR-17
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SRS — Care Groups & Attendance

## Decision Summary · [G3]

Small care group community management, meeting scheduling, mobile attendance check-in, and pastoral care monitoring.

## Why · [G3]

Empowers small group leaders to coordinate localized fellowship gatherings, track weekly attendance and visitors directly on mobile even offline, and alerts pastoral staff when members exhibit consecutive absences.

## Actor Register · [G3]

| Actor | Who they are | What they may do |
|---|---|---|
| Care Group Leader | Lay leader hosting small group | View group roster, record meeting attendance, add meeting guests |
| Pastor / Pastoral Team | Overseeing church shepherd | Monitor group health, view attendance reports, review absence alerts |
| Care Group Member | Enrolled small group attendee | View meeting times and locations, RSVP for upcoming gatherings |

## UC Catalogue · [G3]

UC Catalogue — see `.control/registry/usecases.yaml`, rows where `component: caregroups`.

## Constraints · [G3]

- Mobile attendance check-in must execute and persist locally on device SQLite when network connectivity is lost, syncing automatically and idempotently once online (`FR-17`, `NFR-2`, `AD-5`).
- Pastoral alert triggers automatically when an enrolled member records 3 consecutive unexcused meeting absences (`FR-11`, `BR-3`).

## Non-Goals · [G3]

- Sunday worship service volunteer rosters (owned by `serving`).
- Church-wide news broadcasting or sermon bulletins (owned by `portal`).
- Primary household address management (owned by `membership`).

## Prerequisite · [G3]

- Active person records in `membership` available for care group enrollment.

## Success Signal · [G3]

Over 90% of active care groups submit weekly meeting attendance within 24 hours of gathering (`BG-3`).

## Assumptions, Risks, and To Be Confirmed · [G3]

### Assumptions
- Care group meetings often happen in basements, community halls, or private homes with intermittent cellular connectivity.

### Risks
- Sync conflicts if two leaders simultaneously record attendance for the same meeting on separate devices while offline (resolved via last-write-wins per attendee ID with server timestamp reconciliation).

### To Be Confirmed
- None.

## Gate Checklist · [G3]

- Actor list complete and distinct? Yes.
- Titles of use cases expressed as user goals? Yes.
- Critical use case ratio within threshold (<= 33%)? Yes (0 out of 4, 0%).
- Domain boundaries strictly respect `owns:`? Yes (`care_group`, `group_membership`, `meeting_session`, `attendance_record`).

## Design Reference · [G3]

Paired SDD: `.how/caregroups/SDD-caregroups.md`. Bound by `AD-1`, `AD-5`. Applied decisions: see `.control/generated/decisions.md`.
