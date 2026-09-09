# SPEC-2-03: Blockout Dates & Real-Time Conflict Prevention Engine

**Status:** done
**Component:** serving
**Satisfies:** [UC-9, FR-8]
**Blocked by:** [SPEC-2-02]
**Touches:** [screen-web-roster]

## Description
Implement scheduling conflict prevention and blockout date enforcement:
1. Backend API:
   - `GET /api/v1/volunteers/availability`: List dates and time ranges volunteers have submitted as unavailable.
   - `POST /api/v1/volunteers/availability`: Record volunteer blockout interval with reason notes (`BR-2`).
   - `POST /api/v1/roster-assignments`: During assignment execution, evaluate conflict engine:
     1. Active blockout dates during service schedule (`BR-2`).
     2. Overlapping assignments in concurrent service schedules (`AD-4`).
     3. Maximum duty frequency limits (`BR-SRV-2`).
   - Override mechanism: When conflict is detected, return HTTP 409 Conflict with warning code; allow coordinator override only when accompanied by mandatory reason code (`BR-SRV-3`).
2. Web Admin UI:
   - Roster assignment picker flags conflicting volunteers with clear amber warning badges ("Blocked out: Out of town" or "Already serving in Ushering Service 1").
   - Override confirmation dialog when coordinator explicitly bypasses blockout.

## Acceptance Criteria
1. System prevents silent double-booking of volunteers across concurrent services (`AD-4`).
2. Attempting to schedule a blocked-out volunteer displays warning and requires override reason confirmation.
3. Roster UI displays conflict warning badges seamlessly within `WebRoster.dc.html`.
