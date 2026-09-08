---
type: model
component: serving
layer: conceptual
created: '2026-09-08'
---

# Model — Volunteer Scheduling & Rosters

## Entities

| Entity | What it is | Identified by | Code name | Never called |
|---|---|---|---|---|
| Ministry Team | Functional church department coordinating specific serving areas (e.g. Worship, Ushers, Tech) | Team ID | `ministry_team` | Department |
| Serving Role | Specific operational role within a team with defined responsibilities and qualifications | Role ID | `serving_role` | Position / Slot |
| Service Schedule | Planned church worship service or gathering event occurring on a specific date and time | Schedule ID | `service_schedule` | Event / Mass |
| Roster Assignment | Scheduled pairing of a volunteer to a specific serving role for a service schedule | Assignment ID | `roster_assignment` | Duty Slot |
| Volunteer Availability | Record of dates or recurring intervals when a volunteer is blocked out or unavailable | Availability ID | `volunteer_availability` | Leave Request |

## Relationships

- One **Ministry Team** defines one or many **Serving Roles**.
- One **Service Schedule** contains zero, one, or many **Roster Assignments**.
- One **Serving Role** is referenced by zero, one, or many **Roster Assignments**.
- One **Roster Assignment** references exactly one eligible **Person** (Volunteer) and one **Service Schedule**.
- One **Person** may register zero, one, or many **Volunteer Availability** records representing blockout periods.

## State Lifecycle

### Roster Assignment Lifecycle

| From | To | Trigger | Who may |
|---|---|---|---|
| Draft | Published | Service schedule roster published by ministry coordinator | Ministry Coordinator |
| Published | Confirmed | Volunteer accepts the scheduled assignment via 1-tap mobile notification | Volunteer |
| Published / Confirmed | Declined | Volunteer declines assignment due to unforeseen conflict | Volunteer |
| Published / Confirmed | Swap Requested | Volunteer requests a substitute swap with another team member | Volunteer |
| Declined / Swap Requested | Reassigned | Coordinator assigns a replacement volunteer to fill the open role | Ministry Coordinator |

## Invariants

- A volunteer cannot be scheduled for a role on a date overlapping their active Volunteer Availability (blockout date) without coordinator override confirmation (`FR-8`, `BR-2`).
- A volunteer cannot be scheduled in two conflicting roles across overlapping service schedules (`FR-6`).
- Publishing a roster assignment triggers an automated notification event to the assigned volunteer (`FR-7`, `FR-15`).
