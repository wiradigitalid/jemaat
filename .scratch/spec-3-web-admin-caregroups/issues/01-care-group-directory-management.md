# SPEC-3-01: Care Group Directory & Member Enrollment Management

**Status:** ready-for-agent
**Component:** caregroups
**Satisfies:** [UC-11, UC-14, FR-9]
**Blocked by:** []
**Touches:** [screen-web-caregroups]

## Description
Implement care group directory and member enrollment management:
1. Backend API:
   - `GET /api/v1/care-groups`: List all church care groups with zone, demographic, assigned leader, and enrolled member count.
   - `POST /api/v1/care-groups`: Create a new care group with meeting schedule (e.g. Every Friday 19:30) and address.
   - `GET /api/v1/care-groups/:id`: Detailed view of group, meeting history, and enrolled roster.
   - `POST /api/v1/care-groups/:id/members`: Enroll or transfer members into care group.
   - `DELETE /api/v1/care-groups/:id/members/:personId`: Remove member from care group.
2. Web Admin UI:
   - Implement `screen-web-caregroups` matching `.work/design/AdminGroups.dc.html` with group cards, leader avatars, meeting schedule tags, and member count badges.
   - Group detail sidebar showing enrolled members and attendance trends.

## Acceptance Criteria
1. Administrator can create care groups, assign designated leaders, and manage member enrollment.
2. UI matches styling of group cards in `AdminGroups.dc.html`.
