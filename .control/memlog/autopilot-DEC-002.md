---
artifact: .control/decisions/DEC-002-autopilot-mandate.md
---

## Resume
Iteration: 1 at ee4ed1f
Run branch: autopilot/DEC-002 (PR not opened yet)
Stopped at: —
Blocked: —
Parked: —
Next: SPEC-1-04 CSV Import & Deduplication

## Decisions
| When | Where | Decided | Instead of | Cost if wrong | Landed in |
|---|---|---|---|---|---|
| Iteration 1 | wdi-autopilot preflight | Establish mandate DEC-002 for G5 release execution | Manual per-ticket gating | Autopilot halts if parked invariant hit | .control/decisions/DEC-002-autopilot-mandate.md |
| Iteration 1 | SPEC-1-01 implement | Scaffold Go API and React Web Admin with OTP auth, shared computer storage, and 246px sidebar | Ad-hoc templates without design tokens | Rework UI tokens across specs | apps/api, apps/web |
| Iteration 1 | SPEC-1-02 implement | Implement people CRUD with empty-state guide, privacy masking (AD-3/BR-4), and member dialog | Plain table without first-run guidance | Poor onboarding for new churches | apps/api, apps/web |
| Iteration 1 | SPEC-1-03 implement | Implement full-page household manager, single head enforcement (BR-1), and unlink non-cascading (BR-MEM-2) | Simple address field on person record | Disjoint household records and broken family linkage | apps/api, apps/web |
