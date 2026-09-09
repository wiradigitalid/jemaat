# SPEC-2-01: Ministry Departments, Teams & Roles Configuration

**Status:** done
**Component:** serving
**Satisfies:** [UC-6, FR-5]
**Blocked by:** [SPEC-1-01]
**Touches:** [screen-web-roster]

## Description
Implement configuration for church ministry departments and volunteer serving roles matching `.work/design/AdminDepartments.dc.html`:
1. Backend API:
   - `GET /api/v1/ministry-teams`: List ministry departments (e.g. Music, Multimedia, Prayer, Teaching, Kids) with assigned leaders and role counts.
   - `POST /api/v1/ministry-teams`: Create new ministry department.
   - `GET /api/v1/ministry-teams/:id/roles`: List serving roles within a department (e.g. Worship Leader, Vocalist, Sound Engineer, Slides) with volunteer capacity quotas.
   - `POST /api/v1/ministry-teams/:id/roles`: Add serving role with minimum required qualification or tags.
2. Web Admin UI:
   - Implement `screen-web-roster` department settings matching `.work/design/AdminDepartments.dc.html`:
     - Top bar with department count ("6 departments · 24 roles") and "New department" button.
     - Left pane listing departments with active selection border.
     - Right pane detailing selected department roles, quotas, and assigned volunteers.
   - Implement empty state matching `.work/design/AdminDepartmentsEmpty.dc.html` when zero departments are configured.

## Acceptance Criteria
1. Administrator can define ministry departments, assign department leads, and configure required headcount per serving role.
2. Empty states and active department cards render identically to `AdminDepartments.dc.html` and `AdminDepartmentsEmpty.dc.html`.
