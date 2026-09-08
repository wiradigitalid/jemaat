---
type: uc
id: UC-6
component: serving
satisfies:
  - FR-5
critical: false
created: '2026-09-08'
---

# UC-6 — I want to configure our ministry teams and define their serving roles.

## Trigger
Ministry Coordinator sets up or updates a ministry department structure (e.g. Worship, Multimedia, Ushers, Hospitality).

## Precondition
Coordinator is authenticated with ministry management privileges.

## Main Flow
1. Coordinator navigates to Ministry Teams desk and selects "+ Add Team".
2. System presents form to enter Team Name, description, and designate Team Leader.
3. Coordinator enters team details and defines required Serving Roles with skill qualifications.
4. Coordinator saves team configuration.
5. System validates that team name is unique and team leader is an active member.
6. System persists ministry team and creates associated serving role definitions.
7. System displays team dashboard showing active roles and eligible volunteer roster pool.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 3 | Role requires specific qualification (e.g. sound technician) | Coordinator checks "Requires Certification" and specifies qualification note; system restricts volunteer auto-scheduling to certified members |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 5 | Team leader candidate is not an active member | Rejects assignment and flags leader status | Validation warning: "Designated team leader must hold active membership standing." Form remains editable |

## Outcome
A Ministry Team and its constituent Serving Roles are established and available for service scheduling.

## Business Rules
- `rules-serving.md`: `BR-SRV-1` (Active membership required for ministry leadership and serving roles).
