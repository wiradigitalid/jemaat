---
type: rules
scope: component
component: caregroups
status: draft
created: '2026-09-08'
---

# Business Rules — Care Groups & Attendance

## Rules

| id | Rule | Binds | Source | Status |
|---|---|---|---|---|
| BR-CG-1 | A care group must have at least one designated active leader; retiring a leader without appointing a successor is prohibited. | `caregroups` | FR-9 | active |
| BR-CG-2 | Offline attendance synchronization must be idempotent; multiple sync submissions for the same (meeting_id, person_id) pair update presence status without duplicating records. | `caregroups` | FR-10 · FR-17 · AD-5 | active |
| BR-CG-3 | An excused absence recorded by a group leader does not increment the consecutive absence counter used to trigger pastoral care alerts. | `caregroups` | FR-11 · BR-3 | active |
| BR-CG-4 | Meeting visitors who attend 3 meetings within a 60-day window are automatically recommended to the care group leader for formal group enrollment. | `caregroups` | FR-9 · FR-10 | active |
