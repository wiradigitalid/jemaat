# SPEC-3-02: Care Group Meeting Reports, Attendance Sync & Pastoral Absence Review

**Status:** ready-for-agent
**Component:** caregroups
**Satisfies:** [UC-12, UC-13, FR-10, FR-11, FR-17]
**Blocked by:** [SPEC-3-01]
**Touches:** [screen-web-caregroups]

## Description
Implement care group meeting reports review, backend attendance sync endpoint, and the automated pastoral absence alert queue for church staff:
1. Backend API:
   - `POST /api/v1/care-groups/attendance/sync`: Ingest offline attendance records using idempotent upsert keyed on `(meeting_session_id, person_id)` (`FR-10`, `FR-17`, `UC-12`, `AD-5`).
   - `GET /api/v1/care-groups/:id/meetings`: List completed meeting sessions with attendee headcounts, guest names, and offering records.
   - `GET /api/v1/care-groups/absence-alerts`: Query members with 3 or more consecutive unexcused absences across recent meetings (`BR-3`, `BR-CG-3`, `UC-13`, `FR-11`).
     - Condition: Member is enrolled in group and has `attended = false` across 3 most recent meetings with `excused = false`.
   - `POST /api/v1/pastoral/alerts/:id/contact`: Record pastoral follow-up contact notes (e.g. "Called member, currently recovering from illness").
   - `POST /api/v1/pastoral/alerts/:id/dismiss`: Dismiss alert with reason.
2. Web Admin UI:
   - Meeting report summary viewer with attendance breakdown matching `.work/design/Attendance.dc.html`.
   - Desktop Pastoral Attention Queue: Render split-pane / card list on web admin dashboard (using tokens from `WebApplicants.dc.html` adapted with badge "3 missed meetings" and quick WhatsApp outreach action).

## Acceptance Criteria
1. System implements idempotent attendance sync API (`POST /api/v1/care-groups/attendance/sync`) keyed on `(meeting_session_id, person_id)`.
2. System flags members who miss 3 consecutive sessions without an excuse in the pastoral queue (`BR-3`).
3. Pastoral staff can review absence history and log follow-up actions.
4. API path conforms strictly to `inventory-api.md` (`/api/v1/care-groups/absence-alerts`).
