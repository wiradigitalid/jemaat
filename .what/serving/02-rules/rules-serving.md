---
type: rules
scope: component
component: serving
status: draft
created: '2026-09-08'
---

# Business Rules — Volunteer Scheduling & Rosters

## Rules

| id | Rule | Binds | Source | Status |
|---|---|---|---|---|
| BR-SRV-1 | Only congregants with verified active member standing in `membership` may be scheduled for serving roles or appointed as ministry team leaders. | `serving`, `membership` | FR-5 | active |
| BR-SRV-2 | A volunteer cannot be scheduled in two concurrent service schedules; attempting to schedule an overlapping slot requires an explicit coordinator override with reason. | `serving` | FR-6 · AD-4 | active |
| BR-SRV-3 | A volunteer may accept, decline, or request a swap for a published assignment up to 2 hours prior to the service schedule start time; changes within 2 hours require direct coordinator contact. | `serving` | FR-7 | active |
| BR-SRV-4 | Submitting a new blockout date interval automatically flags any existing assignments scheduled within that interval as conflict warnings in the coordinator matrix. | `serving` | FR-8 | active |
