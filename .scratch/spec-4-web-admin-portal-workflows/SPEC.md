# SPEC-4 — Web Admin: Church Settings, QR Code & Guest Triage

## Overview
Implements church identity configuration, 6-digit church code generation, high-resolution QR code banner export for lobby check-in, and the first-time visitor / member applicant triage queue for church office staff.

## References
- PRD: `.what/_prd/church-operations/prd.md` (`CAP-4`, `CAP-5`)
- SRS: `.what/portal/SRS-portal.md`
- SDD: `.how/portal/SDD-portal.md`
- Rules: `.what/portal/02-rules/rules-portal.md` (`BR-POR-2`, `BR-POR-5`, `AD-6`, `BR-5`)
- HTML Prototypes:
  - Church Code & QR Print: `.work/design/WebChurchCode.dc.html`, `.work/design/AdminChurch.dc.html`
  - Applicants Triage Queue: `.work/design/WebApplicants.dc.html`
  - Church Office Settings: `.work/design/AdminScope.dc.html`

## Seams & Testing Strategy
- API Seam: REST endpoints `/api/v1/church/profile`, `/api/v1/church/qr`, `/api/v1/guests/applicants` tested with Go HTTP tests.
- UI Seam: SVG QR rendering and print stylesheet verification, applicants split-pane triage layout matching `WebApplicants.dc.html`.
