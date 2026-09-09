# SPEC-2-02: Monthly Service Roster Matrix & Volunteer Assignment

**Status:** done
**Component:** serving
**Satisfies:** [UC-7, UC-8, UC-10, FR-6, FR-7]
**Blocked by:** [SPEC-2-01, SPEC-1-02]
**Touches:** [screen-web-roster]

## Description
Implement the volunteer scheduling matrix and assignment workflows:
1. Backend API:
   - `GET /api/v1/services`: List planned church services (Sundays, mid-week, special events) with dates and time slots.
   - `POST /api/v1/services`: Create service instance.
   - `GET /api/v1/services/:id/roster`: Retrieve matrix grid of all required roles and current volunteer assignments.
   - `POST /api/v1/roster-assignments`: Assign an active member (`person_id`) to a role in a service.
   - `PUT /api/v1/roster-assignments/:id/status`: Update assignment status (`confirmed`, `pending`, `declined`, `swapped`) — satisfies UC-8 and FR-7.
   - `DELETE /api/v1/roster-assignments/:id`: Remove volunteer assignment or replace with substitute (`UC-10`).
   - `GET /api/v1/services/:id/roster/status`: Summary counts of confirmed, pending, and declined assignments.
2. Web Admin UI:
   - Implement `screen-web-roster` matching `.work/design/WebRoster.dc.html` with calendar week selector, department grouping, volunteer status chips (green: confirmed, yellow: pending, red: declined, dashed: unfilled).
   - Implement volunteer assignment picker dialog matching `.work/design/AdminServing.dc.html` and `.work/design/AdminRolePicker.dc.html`.
   - Implement weekly service digest matching `.work/design/WebWeek.dc.html`.

## Acceptance Criteria
1. Coordinators can assign volunteers to empty roster slots and replace volunteers who declined with available candidates.
2. Assignment status updates across pending, confirmed, and declined (`PUT /api/v1/roster-assignments/:id/status`).
3. Matrix view matches layout and color tokens of `WebRoster.dc.html`.
