---
type: uc
id: UC-15
component: portal
satisfies:
  - FR-12
critical: false
created: '2026-09-08'
---

# UC-15 — I want to check this Sunday's service schedule, sermon notes, and church announcements.

## Trigger
Church Member opens the mobile application on Sunday morning or during the week.

## Precondition
Member's mobile app is connected to their church tenant.

## Main Flow
1. Member opens Jemaat Mobile App.
2. System displays Mobile Home Feed (`screen-mobile-home`) featuring the upcoming service card, service time, and venue.
3. Member taps on the service banner to open Service Bulletin (`screen-mobile-service`).
4. System renders the full service rundown: worship setlist, scripture readings, sermon title, and speaker bio.
5. Member scrolls to study notes and enters personal notes in the reflection box.
6. System saves notes locally and synchronizes them to member's personal cloud backup.
7. Member navigates to church announcements to view upcoming ministry events and pastoral notices.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 4 | Member taps "Share Service" | System generates an aesthetic share card with service itinerary and church deep-link to share via WhatsApp or social media |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 2 | Device has no internet connection | Loads most recently cached bulletin and notices from local store | Non-intrusive notification: "Showing cached bulletin from last sync." Complete text remains readable |

## Outcome
Member is informed of weekly worship liturgy, engages with sermon study materials, and stays connected to church life.

## Business Rules
- `rules-portal.md`: `BR-POR-1` (Cached service bulletins must remain accessible offline).
