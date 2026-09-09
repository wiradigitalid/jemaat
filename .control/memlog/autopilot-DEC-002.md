---
artifact: .control/decisions/DEC-002-autopilot-mandate.md
---

## Resume
Iteration: 1 (Finished)
Run branch: autopilot/DEC-002 (PR #1 ready for owner review: https://github.com/wiradigitalid/jemaat/pull/1)
Stopped at: § Finish (all 4 specs and 14 tickets closed, 100% green)
Blocked: —
Parked: —
Next: Owner review and merge of PR #1 into main

## Decisions
| When | Where | Decided | Instead of | Cost if wrong | Landed in |
|---|---|---|---|---|---|
| Iteration 1 | wdi-autopilot preflight | Establish mandate DEC-002 for G5 release execution | Manual per-ticket gating | Autopilot halts if parked invariant hit | .control/decisions/DEC-002-autopilot-mandate.md |
| Iteration 1 | SPEC-1-01 implement | Scaffold Go API and React Web Admin with OTP auth, shared computer storage, and 246px sidebar | Ad-hoc templates without design tokens | Rework UI tokens across specs | apps/api, apps/web |
| Iteration 1 | SPEC-1-02 implement | Implement people CRUD with empty-state guide, privacy masking (AD-3/BR-4), and member dialog | Plain table without first-run guidance | Poor onboarding for new churches | apps/api, apps/web |
| Iteration 1 | SPEC-1-03 implement | Implement full-page household manager, single head enforcement (BR-1), and unlink non-cascading (BR-MEM-2) | Simple address field on person record | Disjoint household records and broken family linkage | apps/api, apps/web |
| Iteration 1 | SPEC-1-04 implement | Implement CSV import with 4-step wizard, duplicate detection (BR-MEM-3), and field-level merge | Blind overwrite on CSV upload | Lost contact details and duplicate member corruption | apps/api, apps/web |
| Iteration 1 | SPEC-1-05 implement | Implement status transitions, church transfer attestation, audit logs, and auto-close roles (BR-MEM-4) | Unlogged status updates | Orphaned active roles for transferred members | apps/api, apps/web |
| Iteration 1 | SPEC-1-06 implement | Implement master data export with download cards and CSV stream formatting matching WebData.dc.html | Single manual SQL dump | Inability for administrators to export data freely | apps/api, apps/web |
| Iteration 1 | SPEC-1 close | Close SPEC-1 upon full completion and verification of all 6 vertical slices | Leaving spec open across iterations | G5 release tracking drift | .control/registry/specs.yaml |
| Iteration 1 | SPEC-2-01 implement | Implement ministry departments and roles 3-pane layout matching AdminDepartments.dc.html | Ad-hoc roster setup without quotas | Inability to configure volunteer capacity quotas | apps/api, apps/web |
| Iteration 1 | SPEC-2-02 implement | Implement monthly roster matrix grid matching WebRoster.dc.html, slot assignments, and substitutes (UC-7/8/10) | Static calendar without volunteer substitutions | Coordinator unable to fill duty vacancies | apps/api, apps/web |
| Iteration 1 | SPEC-2-03 implement | Implement conflict engine, blockouts (BR-2), double-booking guards (AD-4), and mandatory override justifications | Silent double-booking or scheduling unavailable volunteers | Volunteer burnout, empty service roles on Sunday | apps/api, apps/web |
| Iteration 1 | SPEC-2 close | Close SPEC-2 upon full verification of volunteer scheduling, roster matrix, and conflict engine | Keeping spec open | Milestone tracking ambiguity | .control/registry/specs.yaml |
| Iteration 1 | SPEC-3-01 implement | Implement 3-pane care groups directory, unplaced placement queue, and member enrollment matching AdminGroups.dc.html | Single flat list without unplaced placement | Unassigned seekers left in limbo | apps/api, apps/web |
| Iteration 1 | SPEC-3-02 implement | Implement meeting records review, idempotent attendance sync (AD-5), and 3-consecutive-absence pastoral alerts (BR-3) | Manual tallying or unlogged absences | Members slipping away unnoticed without pastoral outreach | apps/api, apps/web |
| Iteration 1 | SPEC-3 close | Close SPEC-3 upon full verification of care groups directory, meeting logs, and pastoral absence triage | Leaving spec open | Release tracking desync | .control/registry/specs.yaml |
| Iteration 1 | SPEC-4-01 implement | Implement church profile, canonical deep link (AD-6), QR code generation, and printable welcome poster modal | Manual poster design by each congregation | Fragmented parish branding and unverified links | apps/api, apps/web |
| Iteration 1 | SPEC-4-02 implement | Implement guest onboarding queue, triage split-pane, member promotion with household creation (AD-1), and quiet hours throttling (BR-6) | Unchecked notification blasting and manual record recreation | Privacy complaints and stalled visitor intake | apps/api, apps/web |
| Iteration 1 | SPEC-4-03 implement | Implement administrative access roles ("Who can do what"), role cards, and minimum 2 administrators guard (SPEC-4-03) | Single admin or unconstrained role revocation | Permanent lockout if lone administrator departs | apps/api, apps/web |
| Iteration 1 | SPEC-4 close | Close SPEC-4 upon full verification of church code, applicant triage, and administrative role management | Keeping spec open | Milestone tracking ambiguity | .control/registry/specs.yaml |
