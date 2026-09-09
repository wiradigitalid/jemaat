# SPEC-1-03: Full-Page Household Manager, Map Pin & Family Linking

**Status:** done
**Component:** membership
**Satisfies:** [UC-2, FR-2]
**Blocked by:** [SPEC-1-02]
**Touches:** [screen-web-households]

## Description
Implement the full-page household management and family relationship linking:
1. Backend API:
   - `GET /api/v1/households`: List households with primary contact, address, and member counts.
   - `POST /api/v1/households`: Create a new household unit with primary address and designated head of household.
   - `GET /api/v1/households/:id`: Get full household details including all linked family members, relationships (`spouse`, `child`, `parent`, `dependent`), residence status (`family`, `also_lives_here`, `moved_out`), and location coordinates.
   - `POST /api/v1/households/:id/members`: Link an existing person to a household with residence status.
   - `PUT /api/v1/households/:id/head`: Transfer or designate Head of Household (`BR-1`).
2. Web Admin UI:
   - Implement `screen-web-households` matching `.work/design/AdminHousehold.dc.html` (1440x1040 layout with header "Keluarga [Name]", action buttons "Print family card" & "Add a person here", left column address & vector map block, right column split into "Family", "Also lives here", and "Moved out").
   - Support adding an existing member or creating a new family member directly inside household context.

## Acceptance Criteria
1. System strictly enforces exactly one Head of Household per family unit (`BR-1`).
2. Changing household address automatically updates residence address across all active family members (`BR-MEM-2`).
3. UI renders the complete layout, map block, and residence sections matching `AdminHousehold.dc.html`.
