# SPEC-3 — Web Admin: Care Groups & Pastoral Triage

## Overview
Implements back-office care group directory management, leader assignments, meeting logs review, and desktop pastoral attention alerts for consecutive unexcused absences.

## References
- PRD: `.what/_prd/church-operations/prd.md` (`CAP-3`)
- SRS: `.what/caregroups/SRS-caregroups.md`
- SDD: `.how/caregroups/SDD-caregroups.md`
- Rules: `.what/caregroups/02-rules/rules-caregroups.md` (`BR-CG-1` to `BR-CG-4`, `BR-3`)
- HTML Prototypes:
  - Care Group Hub & Directory: `.work/design/CareGroups.dc.html`, `.work/design/GroupDetail.dc.html`, `.work/design/AdminGroups.dc.html`
  - Meeting Review & Attendance: `.work/design/Meeting.dc.html`, `.work/design/Attendance.dc.html`
  - Inactivity Pastoral Queue (Desktop Adapted): `.work/design/WebApplicants.dc.html`, `.work/design/Noticed.dc.html`

## Seams & Testing Strategy
- API Seam: REST endpoints `/api/v1/care-groups`, `/api/v1/care-groups/:id/meetings`, `/api/v1/care-groups/absence-alerts` tested against PostgreSQL care group tables.
- UI Seam: Care group grid/card list, member enrollment list, desktop pastoral alert queue with absence history counters.
