---
type: uc
id: UC-12
component: caregroups
satisfies:
  - FR-10
  - FR-17
critical: false
created: '2026-09-08'
---

# UC-12 — I want to record who attended tonight's care group meeting even without internet access.

## Trigger
Care Group Leader records attendance during or immediately after a Friday night small group gathering.

## Precondition
Leader is on the mobile app, and the meeting session exists for today's date (synced prior to going offline).

## Main Flow
1. Leader opens Mobile Attendance Check-In screen while meeting in a location with no mobile signal.
2. System detects offline status and loads group member roster from local SQLite cache.
3. Leader taps checkboxes to mark each attending member as `Present` (or leaves unchecked for `Absent`).
4. Leader taps "+ Add Visitor" to enter the name of a guest brought by an attendee.
5. Leader enters prayer notes and taps "Save Attendance".
6. System writes attendance records and meeting summary directly to local SQLite database with timestamp.
7. System displays green checkmark: "Attendance saved offline. Will synchronize automatically when connected."

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 7 | Device re-establishes internet connectivity | Mobile background sync service detects network, sends idempotent batch sync request to `/api/v1/care-groups/attendance/sync`, receives confirmation, and clears local sync queue |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 2 | Device local storage full or corrupted | Attempts safe fallback to in-memory store and alerts user | Alert: "Device storage low. Attendance kept in memory—please do not close app until synced." |
| 7 | Server returns conflict during synchronization | Reconciles using latest timestamp per attendee record | Toast: "Attendance synchronized successfully with server updates." |

## Outcome
Complete care group attendance is captured without data loss, regardless of internet connectivity status.

## Business Rules
- `AD-5`: Offline-first SQLite synchronization protocol.
- `rules-caregroups.md`: `BR-CG-2` (Idempotent upsert by meeting and person).
