# SPEC-4-03: Church Office Access Roles ("Who Can Do What")

**Status:** done
**Component:** portal
**Satisfies:** [UC-1, FR-1]
**Blocked by:** [SPEC-4-01, SPEC-1-02]
**Touches:** [screen-web-roles]

## Description
Implement church office administrative staff access role management matching `.work/design/WebRoles.dc.html`:
1. Backend API:
   - `GET /api/v1/church/access-roles`: List administrators, office staff, and leaders with access permissions beyond their household.
   - `POST /api/v1/church/access-roles`: Grant office access role (`Administrator`, `Church office`, `Care group leader`) to an existing member.
   - `DELETE /api/v1/church/access-roles/:id`: Revoke administrative access.
   - Safety rule: Maintain minimum of 2 active church administrators at all times to prevent account lockout.
2. Web Admin UI:
   - Implement `screen-web-roles` matching `.work/design/WebRoles.dc.html`:
     - Header "Who can do what" with subtitle ("Six people have access beyond their own household · 248 do not").
     - Button "Give someone access".
     - Table listing person avatar/name, membership standing pill, assigned office role ("Church office", "Administrator", "Leads Anugerah"), and audit line ("Andreas Wibowo · Feb 2021 · used yesterday").

## Acceptance Criteria
1. Administrator can review staff privileges and grant/revoke access.
2. System enforces minimum 2 administrators safety guard.
3. UI renders table and metadata matching `WebRoles.dc.html`.
