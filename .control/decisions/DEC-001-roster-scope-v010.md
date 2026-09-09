---
type: decision
id: DEC-001
status: accepted
accepted_by: "Product Owner, 2026-09-09"
touches:
  - .scratch/spec-2-web-admin-serving/SPEC.md
  - .control/registry/specs.yaml
created: '2026-09-09'
---

# DEC-001 — Volunteer Roster and Scheduling is Included in v0.1.0 Web Admin

## Decision

Volunteer scheduling, ministry departments, roster matrices, and conflict prevention (SPEC-2) are included in the v0.1.0 release of Jemaat Web Admin, formally superseding the exploratory deferral note in Release.dc.html.

## Why

A core pain point for church administration is coordinating Sunday services and volunteer duty rosters alongside membership management. Deferring the volunteer roster would force churches to continue using separate spreadsheets for ministry operations, hindering the primary adoption goal (CAP-2, BG-2). The HTML prototypes in .work/design/ (WebRoster.dc.html, AdminDepartments.dc.html, AdminServing.dc.html, AdminRolePicker.dc.html) are complete and fully designed.

## Cost

Adds 3 vertical tickets (SPEC-2-01, SPEC-2-02, SPEC-2-03) to the initial build scope of Web Admin, requiring the conflict engine (AD-4, BR-2) to be implemented in the first release cycle.

## Alternatives

| Option | Why not |
| --- | --- |
| Defer roster to v0.2.0 | Leaves churches without duty scheduling tools, breaking church operations unity |
| Build read-only roster | Coordinators cannot assign substitutes when volunteers decline duties (UC-10) |

## Reversal trigger

If volunteer scheduling backend implementation exceeds the pilot milestone deadline or church pilot users explicitly request membership-only rollouts.
