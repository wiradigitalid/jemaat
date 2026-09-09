# SPEC-4-01: Church Settings, Tenant Profile & QR Code Print Generator

**Status:** ready-for-agent
**Component:** portal
**Satisfies:** [UC-15, UC-16, FR-12, FR-13]
**Blocked by:** [SPEC-1-01]
**Touches:** [screen-web-settings]

## Description
Implement church profile settings and QR code generator:
1. Backend API:
   - `GET /api/v1/church/profile`: Retrieve church tenant profile (name, address, denomination, service times, contact email/phone, 6-digit code).
   - `PUT /api/v1/church/profile`: Update church profile.
   - `POST /api/v1/church/code/regenerate`: Generate new 6-digit alphanumeric church code (`BR-POR-2`).
   - `GET /api/v1/church/qr`: Generate vector SVG / PNG QR code containing standard deep link (`jemaat://church?code=XXXXXX`).
2. Web Admin UI:
   - Implement `screen-web-settings` matching `.work/design/WebChurchCode.dc.html` with large printable QR code card, 6-digit code display, print banner action, and copy-link button.
   - Implement church tenant profile settings form matching `.work/design/AdminChurch.dc.html`.

## Acceptance Criteria
1. System produces clean printable church welcome poster with valid QR code and readable 6-digit code.
2. QR code encodes canonical deep link (`AD-6`).
3. UI matches layout and typography in `WebChurchCode.dc.html`.
