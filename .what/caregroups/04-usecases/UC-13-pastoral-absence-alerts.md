---
type: uc
id: UC-13
component: caregroups
satisfies:
  - FR-11
critical: false
created: '2026-09-08'
---

# UC-13 — I want to see when care group members miss several meetings in a row so our team can reach out.

## Trigger
Care group leader submits weekly attendance, or pastoral team opens the Pastoral Care Dashboard.

## Precondition
Attendance records for multiple consecutive meeting sessions have been submitted.

## Main Flow
1. Pastor opens Care Group Oversight desk on Web Admin or Pastoral Alerts on mobile.
2. System evaluates historical attendance logs across all active care groups.
3. System identifies enrolled members who have recorded 3 consecutive unexcused absences.
4. System surfaces member cards in the "Pastoral Care Attention" queue with last attended date, leader notes, and phone shortcut.
5. Pastor assigns a pastoral staff member or care group leader to reach out.
6. Staff member logs contact outcome (e.g. "Hospitalized", "Traveling", "Spiritual Struggle").
7. System updates alert status to `Contacted` and clears badge from priority view.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 3 | Member recorded excused absence (e.g., reported travel in advance) | System increments unexcused absence counter by 0 and suppresses automated pastoral alert |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 4 | Alert delivery fails due to invalid staff phone number | Logs notification delivery error and keeps alert visible in web admin dashboard | Amber status banner: "Push alert could not be sent to pastor; action required via web desk" |

## Outcome
Pastoral team detects and shepherds disengaging or struggling members before they drift away entirely.

## Business Rules
- `BR-3`: Consecutive absence pastoral alert rule.
- `rules-caregroups.md`: `BR-CG-3` (Excused vs unexcused absence handling).
