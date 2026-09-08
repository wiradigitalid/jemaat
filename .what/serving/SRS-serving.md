---
type: srs
component: serving
status: draft
created: '2026-09-08'
satisfies:
  - FR-5
  - FR-6
  - FR-7
  - FR-8
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SRS — Volunteer Scheduling & Rosters

## Decision Summary · [G3]

Volunteer scheduling, ministry role management, service roster planning, and mobile confirmations.

## Why · [G3]

Enables ministry heads and service coordinators to schedule volunteers transparently across weekly services, track serving commitments, detect scheduling conflicts, and collect 1-tap mobile confirmations.

## Actor Register · [G3]

| Actor | Who they are | What they may do |
|---|---|---|
| Ministry Coordinator | Department lead or service planner | Define roles, schedule volunteers, monitor coverage, review declines |
| Volunteer | Serving church member | Receive notifications, confirm or decline duties, submit blockout dates |

## UC Catalogue · [G3]

UC Catalogue — see `.control/registry/usecases.yaml`, rows where `component: serving`.

## Constraints · [G3]

- Cannot schedule a volunteer whose blockout dates overlap with the service schedule (`FR-8`, `BR-2`).
- A volunteer cannot be scheduled for two overlapping roles in the same service time without an explicit coordinator override warning (`FR-6`).
- Requires active member record from `membership` to be eligible for scheduled ministry roles (`FR-5`).

## Non-Goals · [G3]

- Member profile updates or address changes (owned by `membership`).
- Weekly service liturgy or sermon text creation (owned by `portal`).
- Care group attendance check-in (owned by `caregroups`).

## Prerequisite · [G3]

- Verified personal member records in `membership` with active serving status.
- Defined service schedules and ministry teams.

## Success Signal · [G3]

At least 80% of scheduled volunteer roster slots are confirmed directly via mobile at least 48 hours prior to the service time (`BG-2`).

## Assumptions, Risks, and To Be Confirmed · [G3]

### Assumptions
- Volunteers have smartphone access to receive push notifications or in-app alerts for roster assignments.

### Risks
- Volunteers may delay responding until the last minute, requiring automated reminder escalations.

### To Be Confirmed
- None.

## Gate Checklist · [G3]

- Actor list complete and distinct? Yes.
- Titles of use cases expressed as user goals? Yes.
- Critical use case ratio within threshold (<= 33%)? Yes (0 out of 5, 0%).
- Domain boundaries strictly respect `owns:`? Yes (`ministry_team`, `serving_role`, `service_schedule`, `roster_assignment`, `volunteer_availability`).

## Design Reference · [G3]

Paired SDD: `.how/serving/SDD-serving.md`. Bound by `AD-1`, `AD-4`. Applied decisions: see `.control/generated/decisions.md`.
