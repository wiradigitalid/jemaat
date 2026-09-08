---
type: inventory
kind: api
scope: _platform
status: draft
created: '2026-09-08'
derived_from: plan
verified: ''
---

# Inventory — Endpoints

REST API endpoints planned for the Go backend API container, grouped by component ownership.

## Rows

| No | Method | Path | Owning component | Description | Status |
|---|---|---|---|---|---|
| 1 | `GET` | `/api/v1/people` | `membership` | Search and paginate church member records with role masking | draft |
| 2 | `POST` | `/api/v1/people` | `membership` | Register a new member with personal details and contact channels | draft |
| 3 | `GET` | `/api/v1/people/:id` | `membership` | Retrieve individual profile, spiritual milestones, and household | draft |
| 4 | `PUT` | `/api/v1/people/:id` | `membership` | Update profile information and directory visibility preferences | draft |
| 5 | `POST` | `/api/v1/households` | `membership` | Create a family household and assign primary head of household | draft |
| 6 | `GET` | `/api/v1/households/:id` | `membership` | Retrieve household address and linked family relationship tree | draft |
| 7 | `POST` | `/api/v1/people/import` | `membership` | Bulk upload member spreadsheet with duplicate detection dry-run | draft |
| 8 | `POST` | `/api/v1/people/merge` | `membership` | Merge duplicate person records into an authoritative master record | draft |
| 9 | `GET` | `/api/v1/ministry-teams` | `serving` | List all ministry departments, leaders, and qualified roles | draft |
| 10 | `GET` | `/api/v1/services` | `serving` | List service schedules with real-time roster fill status | draft |
| 11 | `POST` | `/api/v1/services` | `serving` | Schedule a church gathering or recurring service template | draft |
| 12 | `POST` | `/api/v1/roster-assignments` | `serving` | Assign a volunteer to a serving role with automated conflict validation | draft |
| 13 | `PUT` | `/api/v1/roster-assignments/:id/status` | `serving` | 1-tap mobile action to confirm, decline, or swap serving assignment | draft |
| 14 | `POST` | `/api/v1/volunteers/availability` | `serving` | Submit volunteer blockout date intervals and reason notes | draft |
| 15 | `GET` | `/api/v1/volunteers/availability` | `serving` | Retrieve active volunteer blockout intervals for roster planning | draft |
| 16 | `GET` | `/api/v1/care-groups` | `caregroups` | List care groups, zone coordinates, and member rosters | draft |
| 17 | `POST` | `/api/v1/care-groups` | `caregroups` | Create care group fellowship and appoint lay leaders | draft |
| 18 | `GET` | `/api/v1/care-groups/:id/meetings` | `caregroups` | List past and upcoming meeting sessions with attendance counts | draft |
| 19 | `POST` | `/api/v1/care-groups/:id/meetings` | `caregroups` | Schedule a care group gathering with date, host, and agenda | draft |
| 20 | `POST` | `/api/v1/care-groups/attendance/sync` | `caregroups` | Batch sync offline attendance logs with idempotent upsert | draft |
| 21 | `GET` | `/api/v1/care-groups/absence-alerts` | `caregroups` | List enrolled members with 3+ consecutive absences for pastoral care | draft |
| 22 | `GET` | `/api/v1/church/lookup` | `portal` | Resolve 6-digit church code or scanned QR deep link to church profile | draft |
| 23 | `GET` | `/api/v1/feed` | `portal` | Mobile congregational home feed (bulletin, personal duty, notices) | draft |
| 24 | `GET` | `/api/v1/bulletins/:service_id` | `portal` | Retrieve digital sermon outline, scripture readings, and study notes | draft |
| 25 | `GET` | `/api/v1/directory` | `portal` | Search opt-in member directory with contact detail masking | draft |
| 26 | `POST` | `/api/v1/guests/intake` | `portal` | Submit newcomer contact card from mobile QR onboarding | draft |
| 27 | `GET` | `/api/v1/guests/queue` | `portal` | Administrative welcome queue for first-time visitor follow-up | draft |
| 28 | `POST` | `/api/v1/notifications/dispatch` | `portal` | Trigger automated notification queue processing and reminder dispatch | draft |
