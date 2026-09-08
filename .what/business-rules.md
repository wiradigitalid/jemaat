---
type: rules
scope: global
status: draft
created: '2026-09-08'
---

# Business Rules — Jemaat

## Rules

| id | Rule | Binds | Source | Status |
|---|---|---|---|---|
| BR-1 | Every Household must have exactly one designated Head of Household who serves as the primary contact for family notifications. | `membership`, `portal` | FR-2 · UC-2 | active |
| BR-2 | A volunteer cannot be scheduled for a roster assignment during a date interval registered in their active blockout dates without an explicit coordinator override. | `serving`, `portal` | FR-8 · UC-9 | active |
| BR-3 | When an enrolled care group member accumulates three consecutive unexcused meeting absences, an automated pastoral care alert is generated. | `caregroups`, `portal` | FR-11 · UC-13 | active |
| BR-4 | An individual's personal contact details in the congregational directory are masked by default and require explicit member opt-in consent to be visible to others. | `membership`, `portal` | FR-14 · NFR-1 · UC-17 | active |
| BR-5 | An unverified guest intake entry is restricted from accessing the internal member directory, volunteer rosters, and private care group attendance. | all | FR-13 · FR-16 · UC-16 | active |
| BR-6 | Automated reminder notifications for serving assignments and care group meetings must dispatch at standardized intervals and respect local quiet hours. | `serving`, `caregroups`, `portal` | FR-15 · UC-18 | active |
