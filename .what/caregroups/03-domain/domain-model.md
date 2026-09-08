---
type: model
component: caregroups
layer: conceptual
created: '2026-09-08'
---

# Model — Care Groups & Attendance

## Entities

| Entity | What it is | Identified by | Code name | Never called |
|---|---|---|---|---|
| Care Group | Small group fellowship community formed by geographic, demographic, or affinity grouping | Care Group ID | `care_group` | Cell Group / Komsel |
| Group Membership | Association record connecting an individual to a specific care group with role (Leader, Host, Member) | Membership ID | `group_membership` | Enrollment |
| Meeting Session | Scheduled occurrence of a care group gathering with specific date, host, and agenda | Meeting ID | `meeting_session` | Gathering / Fellowship |
| Attendance Record | Individual attendance log marking an attendee as present, excused, or absent for a meeting session | Attendance ID | `attendance_record` | Roll Call |

## Relationships

- One **Care Group** has one or many **Group Memberships** (one or more designated as Care Group Leader).
- One **Person** may hold zero, one, or many **Group Memberships** across care groups.
- One **Care Group** schedules one or many **Meeting Sessions** over time.
- One **Meeting Session** records zero, one, or many **Attendance Records** (covering enrolled members and visiting guests).

## State Lifecycle

### Meeting Session Lifecycle

| From | To | Trigger | Who may |
|---|---|---|---|
| Scheduled | In Progress | Meeting date and time arrives; attendance logging begins | Care Group Leader |
| In Progress | Completed | Leader finishes attendance check-in and submits session notes | Care Group Leader |
| Scheduled / In Progress | Canceled | Meeting called off due to holiday, emergency, or combined service | Care Group Leader |

## Invariants

- Recording an Attendance Record for an un-enrolled guest creates a temporary visitor attendance link without forcing permanent group enrollment (`FR-10`).
- Offline attendance logs captured on mobile are stored locally and reconciled via idempotent upsert based on (Meeting ID, Person ID) upon network reconnection (`FR-17`, `AD-5`).
- Three consecutive unexcused absent Attendance Records for an enrolled member triggers an automated pastoral absence alert (`FR-11`, `BR-3`).
