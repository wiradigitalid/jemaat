# SPEC-2 — Web Admin: Volunteer Scheduling & Rosters

## Overview
Implements church ministry departments, teams, serving roles, monthly volunteer roster matrices, conflict checks, and assignment management for the church office back-office portal.

## Scope Clarification
Volunteer scheduling and roster planning is a core P0 administrative priority for church operations (`CAP-2`, `BG-2`, `FR-5`, `FR-6`, `FR-8`). While earlier exploratory design drafts noted roster W3 as a later release, this specification authoritatively scopes the full Web Admin volunteer scheduling capabilities for release v0.1.0.

## References
- PRD: `.what/_prd/church-operations/prd.md` (`CAP-2`)
- SRS: `.what/serving/SRS-serving.md`
- SDD: `.how/serving/SDD-serving.md`
- Rules: `.what/serving/02-rules/rules-serving.md` (`BR-SRV-1` to `BR-SRV-4`, `BR-2`, `AD-4`)
- HTML Prototypes:
  - Ministry Departments & Roles: `.work/design/AdminDepartments.dc.html`, `.work/design/AdminDepartmentsEmpty.dc.html`
  - Monthly Roster Matrix: `.work/design/WebRoster.dc.html`
  - Volunteer Assignment Dialog: `.work/design/AdminServing.dc.html`, `.work/design/AdminRolePicker.dc.html`
  - Weekly Service Digest: `.work/design/WebWeek.dc.html`

## Seams & Testing Strategy
- API Seam: REST endpoints `/api/v1/ministry-teams`, `/api/v1/services`, `/api/v1/roster-assignments`, `/api/v1/volunteers/availability` tested with mock database and service calendar.
- UI Seam: Roster matrix grid rendering, drag-or-click volunteer assignment, slot status indicators (confirmed, pending, declined, unfilled).
