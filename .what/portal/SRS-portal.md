---
type: srs
component: portal
status: draft
created: '2026-09-08'
satisfies:
  - FR-12
  - FR-13
  - FR-14
  - FR-15
  - FR-16
reviewed:
  date: '2026-09-08'
  sha: 'fa39a613791991dd5d6f1ae878eab7ea8d9ef7b6'
  lenses:
    - structure
    - prose
    - edge-case-hunter
---

# SRS — Congregational Portal & Workflows

## Decision Summary · [G3]

Congregational mobile dashboard, service bulletins, newcomer onboarding, and workflow notifications.

## Why · [G3]

Provides church members and visitors with a unified self-service mobile gateway for weekly service itineraries, sermons, church notices, fast QR joining, and automated serving reminders.

## Actor Register · [G3]

| Actor | Who they are | What they may do |
|---|---|---|
| Church Member | Regular congregant | View notices, service orders, sermon notes, and personal schedule |
| First-Time Visitor | Guest visiting church | Scan QR code, join church portal, submit contact details for welcome |
| Communications Coordinator | Media / admin staff | Publish announcements, curate weekly rundown, manage guest queue |

## UC Catalogue · [G3]

UC Catalogue — see `.control/registry/usecases.yaml`, rows where `component: portal`.

## Constraints · [G3]

- Member directory visibility must be strictly opt-in per individual; phone numbers and home addresses are masked by default (`FR-14`, `NFR-1`, `BR-4`).
- Church code onboarding must support both physical QR code camera scanning and 6-digit manual alphanumeric entry (`FR-13`, `AD-6`).
- Guest intake entries must not grant internal member directory access until reviewed or approved by church administration (`FR-16`, `BR-5`).

## Non-Goals · [G3]

- Member profile master record editing or household merges (owned by `membership`).
- Volunteer roster scheduling matrix (owned by `serving`).
- Care group attendance check-in (owned by `caregroups`).

## Prerequisite · [G3]

- Church profile configured with public church code and published service schedules.

## Success Signal · [G3]

Active congregants access weekly service bulletins and personal duty schedules via mobile without administrative broadcast, and guest intake submissions reach the follow-up queue in real time (`BG-4`, `BG-5`).

## Assumptions, Risks, and To Be Confirmed · [G3]

### Assumptions
- Newcomers in church lobbies or physical services are willing to scan a prominent QR code or enter a short 6-digit code on their phones.

### Risks
- Spam submissions in the guest intake pipeline (mitigated by rate limiting and device-level verification).

### To Be Confirmed
- None.

## Gate Checklist · [G3]

- Actor list complete and distinct? Yes.
- Titles of use cases expressed as user goals? Yes.
- Critical use case ratio within threshold (<= 33%)? Yes (1 out of 5, 20%).
- Domain boundaries strictly respect `owns:`? Yes (`church_profile`, `announcement`, `sermon_bulletin`, `guest_intake_entry`, `notification_event`).

## Design Reference · [G3]

Paired SDD: `.how/portal/SDD-portal.md`. Bound by `AD-1`, `AD-6`. Applied decisions: see `.control/generated/decisions.md`.
