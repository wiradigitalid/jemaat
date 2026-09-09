# SPEC-4-02: Guest & Member Applicants Triage Queue, Reminders & Directory Access

**Status:** done
**Component:** portal
**Satisfies:** [UC-17, UC-18, UC-19, FR-14, FR-15, FR-16]
**Blocked by:** [SPEC-4-01, SPEC-1-02]
**Touches:** [screen-web-settings]

## Description
Implement the back-office guest intake, member applicant triage queue, and administrative workflow notification policies:
1. Backend API:
   - `GET /api/v1/guests/queue`: List pending guest cards and membership applicants with submission timestamps and status (`pending_contact`, `contacted`, `admitted`, `rejected`) (`FR-16`, `UC-19`).
   - `GET /api/v1/guests/queue/:id`: Detailed applicant review showing submitted name, phone, prior church background, requested membership category.
   - `POST /api/v1/guests/queue/:id/contact`: Log contact event (e.g. WhatsApp message sent, phone call).
   - `POST /api/v1/guests/queue/:id/admit`: Convert approved applicant directly into a verified member profile (`person` record) using membership service interface (`AD-1`). Unverified guests cannot access directory (`BR-5`).
   - `GET /api/v1/directory`: Backend directory search supporting privacy masking (`AD-3`, `BR-4`, `FR-14`, `UC-17`).
   - `POST /api/v1/notifications/dispatch`: Background reminder queue handler respecting quiet hours (`BR-6`, `FR-15`, `UC-18`).
2. Web Admin UI:
   - Implement split-pane applicants queue matching `.work/design/WebApplicants.dc.html`:
     - Left pane: list of applicant cards with submission duration badge ("2 days ago", "oldest submitted 4 days ago") and membership category desire.
     - Right pane: detail review card with WhatsApp direct contact button, prior church history, and administrative decision actions ("Admit as Member", "Keep in Follow-Up", "Reject").

## Acceptance Criteria
1. Church office staff can triage submissions, contact visitors via WhatsApp shortcut, and promote approved applicants to active members.
2. Endpoint path matches `inventory-api.md` (`/api/v1/guests/queue`).
3. Directory endpoint enforces field masking for unauthenticated or unverified guests (`BR-4`, `BR-5`).
4. Notification dispatch honors recipient quiet hours (`BR-6`).
5. UI matches exact split-pane design of `WebApplicants.dc.html`.
