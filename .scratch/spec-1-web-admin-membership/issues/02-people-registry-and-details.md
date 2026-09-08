# SPEC-1-02: People Registry & Member Details View

**Status:** ready-for-agent
**Component:** membership
**Satisfies:** [UC-1, UC-5, FR-1]
**Blocked by:** [SPEC-1-01]
**Touches:** [screen-web-people]

## Description
Implement the complete member registry interface and backend API:
1. Backend API:
   - `GET /api/v1/people`: Paginated search with query, status filter (`all`, `active`, `newcomer`, `inactive`), ministry filter, and sorting.
   - `POST /api/v1/people`: Create individual person profile (full name, phone, email, date of birth, gender, baptism date, notes).
   - `GET /api/v1/people/:id`: Retrieve individual member profile with household linkage and serving history.
   - `PUT /api/v1/people/:id`: Update member details.
2. Web Admin UI:
   - Implement `screen-web-people` matching `.work/design/WebPeople.dc.html` with exact layout: search bar, status count chips, member data table with avatars, role pills, household badges, and quick WhatsApp action buttons.
   - Implement member creation dialog matching `.work/design/AdminPersonNew.dc.html`.
   - Implement detailed profile screen matching `.work/design/WebPerson.dc.html` with timeline and contact details.

## Acceptance Criteria
1. Administrator can search, filter, and page through member list.
2. Form validation rejects missing required fields and enforces standard Indonesian phone format (`BR-MEM-1`).
3. UI matches layout and typography of `WebPeople.dc.html` and `WebPerson.dc.html`.
