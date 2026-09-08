---
type: inventory
kind: db
scope: _platform
status: draft
created: '2026-09-08'
derived_from: plan
verified: ''
---

# Inventory — Tables

Database tables planned for Jemaat, grouped by component ownership.

## Rows

| No | Table | Owning component | What it holds | Key columns | Status |
|---|---|---|---|---|---|
| 1 | `persons` | `membership` | Personal identity, contact channels, birth date, gender | `id`, `church_id`, `full_name`, `phone`, `nik` | draft |
| 2 | `households` | `membership` | Residential dwelling units and shared family address | `id`, `church_id`, `name`, `head_person_id`, `address` | draft |
| 3 | `family_relationships` | `membership` | Directional kinship connections between persons | `id`, `person_id`, `related_person_id`, `relationship_type` | draft |
| 4 | `membership_records` | `membership` | Baptism records, admission dates, and member standing status | `id`, `person_id`, `status`, `reception_date` | draft |
| 5 | `ministry_teams` | `serving` | Ministry departments organizing service operations | `id`, `church_id`, `name`, `leader_person_id` | draft |
| 6 | `serving_roles` | `serving` | Specific positions with required skills per team | `id`, `ministry_team_id`, `name`, `qualification_notes` | draft |
| 7 | `service_schedules` | `serving` | Scheduled church services and worship events | `id`, `church_id`, `title`, `service_time` | draft |
| 8 | `roster_assignments` | `serving` | Volunteer duty assignments and RSVP confirmations | `id`, `service_schedule_id`, `serving_role_id`, `volunteer_person_id`, `status` | draft |
| 9 | `volunteer_availabilities` | `serving` | Blockout dates and serving exceptions | `id`, `person_id`, `start_date`, `end_date`, `reason` | draft |
| 10 | `care_groups` | `caregroups` | Small group communities and localized fellowships | `id`, `church_id`, `name`, `zone`, `primary_leader_id` | draft |
| 11 | `group_memberships` | `caregroups` | Enrolled members and lay leaders in care groups | `id`, `care_group_id`, `person_id`, `role` | draft |
| 12 | `meeting_sessions` | `caregroups` | Specific gathering instances with agenda and host location | `id`, `care_group_id`, `meeting_time`, `host_address`, `status` | draft |
| 13 | `attendance_records` | `caregroups` | Presence/absence check-in logs per attendee per meeting | `id`, `meeting_session_id`, `person_id`, `status` | draft |
| 14 | `church_profiles` | `portal` | Church tenant configuration and 6-digit access code | `id`, `name`, `church_code`, `address`, `contact_phone` | draft |
| 15 | `announcements` | `portal` | Church bulletins, news items, and event announcements | `id`, `church_id`, `title`, `body`, `published_at` | draft |
| 16 | `sermon_bulletins` | `portal` | Digital sermon outlines, scripture readings, and study guides | `id`, `service_schedule_id`, `title`, `speaker`, `scripture` | draft |
| 17 | `guest_intake_entries` | `portal` | Newcomer cards and welcome follow-up queue | `id`, `church_id`, `full_name`, `phone`, `status` | draft |
| 18 | `notification_events` | `portal` | Scheduled and dispatched push/messaging alerts | `id`, `church_id`, `recipient_person_id`, `type`, `status`, `scheduled_at` | draft |
