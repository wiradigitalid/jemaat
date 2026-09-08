# SPEC-3-02: Care Group Meeting Reports & Pastoral Absence Inactivity Review

**Status:** ready-for-agent
**Component:** caregroups
**Satisfies:** [UC-12, UC-13, FR-10, FR-11, FR-17]
**Blocked by:** [SPEC-3-01]
**Touches:** [screen-web-caregroups]

## Description
Implement care group meeting reports review and the automated pastoral absence alert queue:
1. Backend API:
   - `GET /api/v1/care-groups/:id/meetings`: List completed meeting sessions with attendee headcounts, guest names, and offering records.
   - `GET /api/v1/care-groups/attendance/alerts`: Query members with 3 or more consecutive unexcused absences across recent meetings (`BR-3`, `BR-CG-3`).
   - `POST /api/v1/pastoral/alerts/:id/contact`: Record pastoral follow-up contact notes (e.g. "Called member, currently recovering from illness").
   - `POST /api/v1/pastoral/alerts/:id/dismiss`: Dismiss alert with reason.
2. Web Admin UI:
   - Meeting report summary viewer with attendance breakdown matching `.work/design/Attendance.dc.html`.
   - Pastoral attention queue panel flagging absent members with consecutive missed meeting counts matching `.work/design/Noticed.dc.html`.

## Acceptance Criteria
1. System automatically flags members who miss 3 consecutive sessions in the pastoral attention queue (`BR-3`).
2. Pastoral staff can review absence history and log follow-up actions.
3. UI renders pastoral alert cards matching `Noticed.dc.html`.
