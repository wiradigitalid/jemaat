---
type: inventory
kind: screen
scope: _platform
status: draft
created: '2026-09-08'
derived_from: plan
verified: ''
---

# Inventory — Screens

User interface screens planned for Jemaat, mapping the 95 prototypes in `.work/design` across mobile and web admin containers.

## Rows

| No | Screen | Route | Owning component | Actor | UC served |
|---|---|---|---|---|---|
| 1 | Mobile Home Feed (`screen-mobile-home`) | `/home` | `portal` | Church Member | `UC-15` |
| 2 | Mobile Service Bulletin (`screen-mobile-service`) | `/services/:id` | `portal` | Church Member | `UC-15` |
| 3 | Mobile Sermon Archive (`screen-mobile-sermons`) | `/sermons` | `portal` | Church Member | `UC-15` |
| 4 | Mobile Serving Roster (`screen-mobile-serving`) | `/serving` | `serving` | Volunteer | `UC-8`, `UC-9` |
| 5 | Mobile Care Group Hub (`screen-mobile-caregroups`) | `/care-groups` | `caregroups` | Care Group Member | `UC-11`, `UC-14` |
| 6 | Mobile Attendance Check-In (`screen-mobile-attendance`) | `/care-groups/:id/attendance` | `caregroups` | Care Group Leader | `UC-12` |
| 7 | Mobile Member Directory (`screen-mobile-directory`) | `/directory` | `portal` | Church Member | `UC-17` |
| 8 | Mobile Personal Profile (`screen-mobile-profile`) | `/profile` | `membership` | Church Member | `UC-5` |
| 9 | Mobile Church Code & Onboarding (`screen-mobile-auth`) | `/onboarding` | `portal` | First-Time Visitor | `UC-16` |
| 10 | Web Admin People Registry (`screen-web-people`) | `/admin/people` | `membership` | Church Administrator | `UC-1`, `UC-4` |
| 11 | Web Admin Household Manager (`screen-web-households`) | `/admin/households` | `membership` | Church Administrator | `UC-2` |
| 12 | Web Admin Roster Matrix (`screen-web-roster`) | `/admin/roster` | `serving` | Ministry Coordinator | `UC-6`, `UC-7`, `UC-10` |
| 13 | Web Admin Care Group Manager (`screen-web-caregroups`) | `/admin/care-groups` | `caregroups` | Pastor / Pastoral Team | `UC-11`, `UC-13` |
| 14 | Web Admin CSV Import & Deduplication (`screen-web-data`) | `/admin/data/import` | `membership` | Church Administrator | `UC-3` |
| 15 | Web Admin Church Settings & QR (`screen-web-settings`) | `/admin/settings` | `portal` | Communications Coordinator | `UC-16`, `UC-19` |
