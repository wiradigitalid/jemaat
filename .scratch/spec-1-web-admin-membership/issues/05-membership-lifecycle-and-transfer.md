# SPEC-1-05: Membership Lifecycle Transitions, Transfer & Audit Trail

**Status:** done
**Component:** membership
**Satisfies:** [UC-4, FR-4]
**Blocked by:** [SPEC-1-02]
**Touches:** [screen-web-people]

## Description
Implement status transitions, member transfers, and audit logs:
1. Backend API:
   - `PUT /api/v1/people/:id/status`: Update membership standing (`newcomer` -> `regular_attendee` -> `active_member` -> `inactive` -> `archived`).
   - Rule `BR-MEM-4`: Marking a member status as transferred, archived, or deceased automatically closes all active ministry serving roles and care group enrollments.
   - `POST /api/v1/people/:id/transfer`: Record church attestation/transfer to another church (`dest_church_name`, `transfer_date`, `certificate_number`).
   - `GET /api/v1/people/:id/audit`: Retrieve full chronological audit history of changes to a member's record.
2. Web Admin UI:
   - Implement member archive list matching `.work/design/WebArchive.dc.html`.
   - Implement transfer workflow dialog matching `.work/design/WebTransfer.dc.html`.
   - Implement audit history tab on member detail view matching `.work/design/WebChanges.dc.html`.

## Acceptance Criteria
1. Member status change requires selection of valid transition state and captures operator identity.
2. Transferring or archiving a member automatically revokes active roster roles and group enrollments (`BR-MEM-4`).
3. UI matches `WebArchive.dc.html`, `WebTransfer.dc.html`, and `WebChanges.dc.html`.
