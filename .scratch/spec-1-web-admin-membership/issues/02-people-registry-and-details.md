# SPEC-1-02: People Registry, First-Run Empty State & Privacy Masking

**Status:** ready-for-agent
**Component:** membership
**Satisfies:** [UC-1, UC-5, FR-1]
**Blocked by:** [SPEC-1-01]
**Touches:** [screen-web-people]

## Description
Implement the complete member registry interface and backend API:
1. Backend API:
   - `GET /api/v1/people`: Paginated search with query, status filter (`all`, `active`, `newcomer`, `inactive`), ministry filter, and sorting.
   - Field Privacy Masking (`AD-3`, `BR-4`, `BR-POR-3`): Contact details (phone, email, full address) are masked by default for queries without explicit administrative elevation or unless member opt-in is recorded.
   - `POST /api/v1/people`: Create individual person profile (full name, phone, email, date of birth, gender, baptism date, notes).
   - `GET /api/v1/people/:id`: Retrieve individual member profile with household linkage and serving history.
   - `PUT /api/v1/people/:id`: Update member details.
2. Web Admin UI:
   - Implement First-Run Empty State: When `people.length === 0`, render `screen-web-people` matching `.work/design/WebEmpty.dc.html` ("Nothing here yet", household explanation card, "Add the first person" action, and "An hour, in this order" guide sidebar).
   - Implement Populated Registry: When people exist, render `screen-web-people` matching `.work/design/WebPeople.dc.html` with search bar, status count chips, member data table with avatars, role pills, household badges, and WhatsApp action buttons.
   - Implement member creation dialog matching `.work/design/AdminPersonNew.dc.html`.
   - Implement detailed profile screen matching `.work/design/WebPerson.dc.html` with timeline and contact details.

## Acceptance Criteria
1. When zero members exist, UI strictly renders `WebEmpty.dc.html` layout; when members exist, renders `WebPeople.dc.html`.
2. Form validation enforces standard Indonesian phone format (+62) and required personal fields (`BR-MEM-1`).
3. Contact fields are masked according to `BR-4` / `AD-3` for non-privileged scopes.
4. UI matches layout and typography of `WebPeople.dc.html`, `WebEmpty.dc.html`, and `WebPerson.dc.html`.
