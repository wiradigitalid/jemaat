# SPEC-4-02: Guest & Member Applicants Triage Queue

**Status:** ready-for-agent
**Component:** portal
**Satisfies:** [UC-17, UC-18, UC-19, FR-14, FR-15, FR-16]
**Blocked by:** [SPEC-4-01]
**Touches:** [screen-web-settings]

## Description
Implement the back-office guest intake and member applicant triage queue:
1. Backend API:
   - `GET /api/v1/guests/applicants`: List pending guest cards and membership applicants with submission timestamps and status (`pending_contact`, `contacted`, `admitted`, `rejected`).
   - `GET /api/v1/guests/applicants/:id`: Detailed applicant review showing submitted name, phone, prior church background, requested membership category.
   - `POST /api/v1/guests/applicants/:id/contact`: Log contact event (e.g. WhatsApp message sent, phone call).
   - `POST /api/v1/guests/applicants/:id/admit`: Convert approved applicant directly into a verified member profile (`person` record).
2. Web Admin UI:
   - Implement split-pane applicants queue matching `.work/design/WebApplicants.dc.html`:
     - Left pane: list of applicant cards with submission duration badge ("2 days ago", "oldest submitted 4 days ago") and membership category desire.
     - Right pane: detail review card with WhatsApp direct contact button, prior church history, and administrative decision actions ("Admit as Member", "Keep in Follow-Up", "Reject").

## Acceptance Criteria
1. Church office staff can triage submissions, contact visitors via WhatsApp shortcut, and promote approved applicants to active members.
2. UI matches exact split-pane design of `WebApplicants.dc.html`.
