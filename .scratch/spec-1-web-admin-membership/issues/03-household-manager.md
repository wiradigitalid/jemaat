# SPEC-1-03: Household Manager & Family Relationship Linking

**Status:** ready-for-agent
**Component:** membership
**Satisfies:** [UC-2, FR-2]
**Blocked by:** [SPEC-1-02]
**Touches:** [screen-web-households]

## Description
Implement household and family management:
1. Backend API:
   - `GET /api/v1/households`: List households with primary contact, address, and member counts.
   - `POST /api/v1/households`: Create a new household unit with primary address and designated head of household.
   - `GET /api/v1/households/:id`: Get full household details including all linked family members and relationships (`spouse`, `child`, `parent`, `dependent`).
   - `POST /api/v1/households/:id/members`: Link an existing person to a household.
   - `PUT /api/v1/households/:id/head`: Transfer or designate Head of Household (`BR-1`).
2. Web Admin UI:
   - Implement `screen-web-households` matching `.work/design/WebHouseAdmin.dc.html` with card layout, address details, and family tree member list.
   - Implement family connection dialog matching `.work/design/AdminHousehold.dc.html` with relationship dropdown and head-of-household toggle.

## Acceptance Criteria
1. System strictly enforces exactly one Head of Household per family unit (`BR-1`).
2. Changing household address automatically propagates to all linked members whose residence inherits household address (`BR-MEM-2`).
3. UI renders family group cards matching `.work/design/WebHouseAdmin.dc.html`.
