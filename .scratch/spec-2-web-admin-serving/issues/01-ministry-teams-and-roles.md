# SPEC-2-01: Ministry Departments, Teams & Roles Configuration

**Status:** ready-for-agent
**Component:** serving
**Satisfies:** [UC-6, FR-5]
**Blocked by:** []
**Touches:** [screen-web-roster]

## Description
Implement configuration for church ministry departments and volunteer serving roles:
1. Backend API:
   - `GET /api/v1/ministry-teams`: List ministry departments (e.g. Worship, Ushering, Multimedia, Kids) with team leaders and role counts.
   - `POST /api/v1/ministry-teams`: Create new ministry team.
   - `GET /api/v1/ministry-teams/:id/roles`: List serving roles within a team (e.g. Worship Leader, Guitarist, Sound Engineer) with volunteer capacity quotas.
   - `POST /api/v1/ministry-teams/:id/roles`: Add serving role with minimum required qualification/tag.
2. Web Admin UI:
   - Implement roles management interface matching `.work/design/WebRoles.dc.html` with department cards, leader badges, and role chips.
   - Implement department creation and editing modal matching `.work/design/AdminDepartments.dc.html` and empty state matching `AdminDepartmentsEmpty.dc.html`.

## Acceptance Criteria
1. Administrator can define ministry teams, assign team leads, and specify required headcount per serving role.
2. Empty states and active department cards match styling in `WebRoles.dc.html`.
