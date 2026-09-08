---
type: model
component: portal
layer: conceptual
created: '2026-09-08'
---

# Model — Congregational Portal & Workflows

## Entities

| Entity | What it is | Identified by | Code name | Never called |
|---|---|---|---|---|
| Church Profile | Core church tenant configuration, identity, location, contact, and 6-digit access code | Church ID | `church_profile` | Organization / Tenant |
| Announcement | Published church notice, pastoral letter, or ministry event broadcast to the mobile portal | Notice ID | `announcement` | Bulletin Item / News |
| Sermon Bulletin | Digital guide for a specific service containing sermon outline, Bible passages, and study notes | Bulletin ID | `sermon_bulletin` | Order of Service |
| Guest Intake Entry | Record of a newcomer who registered contact details via QR onboarding or welcome greeting | Intake ID | `guest_intake_entry` | Visitor Card / Lead |
| Notification Event | Scheduled message dispatched to congregants (serving reminders, pastoral alerts, announcements) | Event ID | `notification_event` | Push Message |

## Relationships

- One **Church Profile** owns one or many **Announcements**, **Sermon Bulletins**, and **Guest Intake Entries**.
- One **Sermon Bulletin** references zero or one **Service Schedule** from `serving`.
- One **Guest Intake Entry** may optionally be linked to or converted into a verified **Person** in `membership`.
- One **Notification Event** targets one or many **Persons** and references an originating domain entity (e.g. Roster Assignment, Meeting Session, or Announcement).

## State Lifecycle

### Guest Intake Entry Lifecycle

| From | To | Trigger | Who may |
|---|---|---|---|
| New / Submitted | Contacted | Welcome team reaches out via call, chat, or in-person greeting | Communications Coordinator |
| Contacted | Followed Up | Guest attends follow-up event, care group, or new member class | Communications Coordinator |
| Followed Up | Converted | Guest profile imported and formally admitted into membership registry | Church Administrator |
| Any | Archived | Guest requests removal or relocates out of area | Communications Coordinator |

## Invariants

- Every Church Profile generates exactly one unique 6-digit alphanumeric church code and corresponding QR deep link for mobile onboarding (`FR-13`, `AD-6`).
- Unverified Guest Intake Entries cannot view church member directory details (`BR-5`).
- Notification Events must respect recipient preferences and quiet hours (e.g., no non-urgent automated notifications between 21:00 and 07:00 local church time) (`FR-15`, `BR-6`).
