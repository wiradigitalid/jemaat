---
type: uc
id: UC-8
component: serving
satisfies:
  - FR-7
critical: false
created: '2026-09-08'
---

# UC-8 — I want to confirm, decline, or swap my scheduled serving assignment with one tap.

## Trigger
Volunteer receives a mobile push notification or opens the mobile app seeing an upcoming serving assignment card.

## Precondition
Volunteer has an active assignment in `Published` status for an upcoming service schedule.

## Main Flow
1. Volunteer opens Serving Hub on the mobile app.
2. System presents upcoming assignment card displaying Service Date, Time, Team, Role, and status (`Pending`).
3. Volunteer taps "Accept" button.
4. System updates assignment status to `Confirmed` and logs confirmation timestamp.
5. System displays green confirmation badge and adds event to volunteer's in-app calendar.
6. System notifies ministry coordinator that the duty has been confirmed.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 3 | Volunteer taps "Decline" | System prompts: "Select reason (Traveling, Ill, Work, Other)"; volunteer selects reason and taps "Confirm Decline". System updates status to `Declined` and alerts coordinator of vacant slot |
| 3 | Volunteer taps "Request Swap" | System opens eligible substitute picker from same team; volunteer selects candidate. System marks assignment as `Swap Requested` and sends swap approval invite to candidate |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 4 | Network connection drops during confirmation | Queues confirmation action locally and retries upon reconnect | UI updates optimistically with subtle sync spinner: "Confirming... will sync when online" |
| 4 | Service schedule was already canceled or role reassigned | Informs volunteer of outdated status and refreshes schedule | Alert: "This assignment is no longer active." Card is removed from pending queue |

## Outcome
Roster assignment status is updated to `Confirmed`, `Declined`, or `Swap Requested` with zero phone calls or manual follow-up required from church staff.

## Business Rules
- `AD-4`: Conflict detection and audit trail.
- `rules-serving.md`: `BR-SRV-3` (One-tap RSVP state transitions).
