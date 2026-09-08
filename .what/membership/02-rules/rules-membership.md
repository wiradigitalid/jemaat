---
type: rules
scope: component
component: membership
status: draft
created: '2026-09-08'
---

# Business Rules — Membership & Households

## Rules

| id | Rule | Binds | Source | Status |
|---|---|---|---|---|
| BR-MEM-1 | An active person profile must have a unique combination of NIK and normalized primary mobile phone number within the tenant church. | `membership` | FR-1 · NFR-1 | active |
| BR-MEM-2 | Deletion or unlinking of a Household record must never cascade delete the constituent Person records; unlinked individuals revert to unassigned household status. | `membership` | FR-2 | active |
| BR-MEM-3 | Batch spreadsheet imports must perform an atomic dry-run validation detecting duplicate contacts before committing data changes to the primary registry. | `membership` | FR-3 | active |
| BR-MEM-4 | A member standing transition to 'Transferred Out' or 'Deceased' automatically closes all active role assignments across ministry teams and care groups. | `membership`, `serving`, `caregroups` | FR-4 | active |
