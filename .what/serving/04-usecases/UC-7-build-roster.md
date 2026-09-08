---
type: uc
id: UC-7
component: serving
satisfies:
  - FR-6
critical: false
created: '2026-09-08'
---

# UC-7 — I want to build the monthly service roster and assign qualified volunteers.

## Trigger
Ministry Coordinator prepares the volunteer duty calendar for upcoming Sunday worship services or special events.

## Precondition
Ministry teams, serving roles, and service schedules exist in the system.

## Main Flow
1. Coordinator opens Roster Matrix view and selects target month.
2. System renders multi-department matrix with service date columns and role rows.
3. Coordinator clicks an empty role slot and selects an eligible volunteer from the candidate dropdown.
4. System checks volunteer against active blockout dates and concurrent service assignments.
5. System confirms no conflicts and places volunteer into slot with status `Pending`.
6. Coordinator completes assignments across roles and clicks "Publish Roster".
7. System transitions assignments to `Published` and queues automated mobile notifications to all scheduled volunteers.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 4 | Volunteer has registered a blockout date or concurrent duty | System flags conflict warning with details (e.g. "Blocked out: Traveling") and prompts: "Override conflict?" If coordinator confirms with override reason, assignment proceeds |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 4 | Critical conflict override rejected by policy | Prohibits duplicate assignment to identical simultaneous service | Alert: "Volunteer cannot be scheduled in two concurrent services." Slot remains vacant |
| 7 | Notification queue delivery fails for some recipients | Retains published state and flags un-notified volunteers in matrix | Matrix shows amber warning icon on affected slots with "Resend Notification" button |

## Outcome
Service roster is published with volunteer duties allocated and automated mobile notifications dispatched.

## Business Rules
- `BR-2`: Blockout date conflict validation.
- `AD-4`: Centralized conflict detection engine.
- `rules-serving.md`: `BR-SRV-2` (Assignment conflict rules).
